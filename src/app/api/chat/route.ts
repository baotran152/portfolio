import { createDataStreamResponse, streamText } from 'ai';
import {
  buildProviderChain,
  createModelFor,
  shouldFallBack,
  type ProviderCandidate,
} from './provider';
import { getSystemPrompt } from './prompt';
import { getContact } from './tools/getContact';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';
import { getBackground } from './tools/getBackground';

export const maxDuration = 30;

function errorHandler(error: unknown) {
  if (error == null) {
    return 'Unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

// Data stream protocol prefixes: '3:' is an error part, and these carry real output.
const ERROR_PREFIX = '3:';
const CONTENT_PREFIXES = ['0:', '9:', 'a:'];

type ProbeResult = { ok: true } | { ok: false };

// Typed explicitly rather than using TextDecoderStream, whose DOM lib signature
// (WritableStream<BufferSource>) does not line up with pipeThrough's Uint8Array.
// Decoding is stateful so multi-byte characters split across chunks survive.
function decodeChunks(): TransformStream<Uint8Array, string> {
  const decoder = new TextDecoder();

  return new TransformStream<Uint8Array, string>({
    transform(chunk, controller) {
      controller.enqueue(decoder.decode(chunk, { stream: true }));
    },
    flush(controller) {
      const tail = decoder.decode();
      if (tail) controller.enqueue(tail);
    },
  });
}

// Reads just far enough to learn whether the provider accepted the request. A failing
// provider emits its error as the first part, before any text, so this settles without
// consuming the answer. tee() buffers, so the branch we forward keeps every byte.
async function probe(stream: ReadableStream<Uint8Array>): Promise<ProbeResult> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      for (const line of buffer.split('\n')) {
        if (line.startsWith(ERROR_PREFIX)) return { ok: false };
        if (CONTENT_PREFIXES.some((prefix) => line.startsWith(prefix))) {
          return { ok: true };
        }
      }
    }
    // Ended without producing anything - treat as a failed attempt.
    return { ok: false };
  } finally {
    reader.cancel().catch(() => {});
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    messages.unshift(getSystemPrompt());

    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getBackground,
    };

    const chain = buildProviderChain();

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const failures: string[] = [];

        for (const candidate of chain) {
          // streamText reports errors through onError rather than throwing, so the
          // error object is captured here to decide whether another provider is worth trying.
          let streamError: unknown;

          const result = streamText({
            model: createModelFor(candidate),
            messages,
            toolCallStreaming: true,
            tools,
            maxSteps: 2,
            onError: ({ error }) => {
              streamError = error;
            },
          });

          const [probeBranch, outputBranch] = result
            .toDataStream({ getErrorMessage: errorHandler })
            .tee();

          const attempt = await probe(probeBranch);

          if (attempt.ok) {
            console.log(
              `[CHAT-API] served by ${candidate.provider} (${candidate.model})`,
            );
            // toDataStream emits bytes; merge consumes the protocol strings those
            // bytes already are, so decoding is a straight pass-through.
            dataStream.merge(
              outputBranch.pipeThrough(decodeChunks()) as unknown as Parameters<
                typeof dataStream.merge
              >[0],
            );
            return;
          }

          outputBranch.cancel().catch(() => {});
          failures.push(
            `${candidate.provider}: ${errorHandler(streamError ?? 'no output')}`,
          );
          console.warn(
            `[CHAT-API] ${candidate.provider} failed, ${errorHandler(streamError ?? 'no output')}`,
          );

          if (!shouldFallBack(streamError)) break;
        }

        // Surfaces through createDataStreamResponse's onError as a single error part.
        throw new Error(
          `Every AI provider failed. ${failures.join(' | ')}`,
        );
      },
      onError: errorHandler,
    });
  } catch (err) {
    console.error('Global error:', err);
    return new Response(errorHandler(err), { status: 500 });
  }
}

export type { ProviderCandidate };
