import { createDataStreamResponse, streamText, type CoreMessage } from 'ai';
import {
  buildProviderChain,
  createModelFor,
  shouldFallBack,
  type ProviderCandidate,
} from './provider';
import { getSystemPrompt } from './prompt';
import { checkRateLimit, clientIp } from './rate-limit';
import {
  ABUSE_REPLY,
  ChatRequestSchema,
  TOO_LONG_REPLY,
  containsAbuse,
  countWords,
  exceedsWordLimit,
  lastUserMessage,
} from './guardrails';
import {
  cacheKeyFor,
  readCache,
  replay,
  writeCache,
} from './response-cache';
import { getContact } from './tools/getContact';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';
import { getBackground } from './tools/getBackground';
import { getPhotos } from './tools/getPhotos';
import { hasPhotos } from '@/lib/photos';

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

// Forwards every chunk untouched while accumulating a copy, so a successful answer
// can be replayed later without a second generation.
function captureFor(key: string): TransformStream<string, string> {
  let body = '';

  return new TransformStream<string, string>({
    transform(chunk, controller) {
      body += chunk;
      controller.enqueue(chunk);
    },
    flush() {
      // Never cache a run that ended in an error part.
      if (!body.includes('\n3:') && !body.startsWith('3:')) writeCache(key, body);
    },
  });
}

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const limit = checkRateLimit(ip);

    if (!limit.allowed) {
      const minutes = Math.ceil((limit.resetAt - Date.now()) / 60_000);
      return new Response(
        `Too many messages. Try again in about ${minutes} minute(s).`,
        {
          status: 429,
          headers: {
            'retry-after': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          },
        },
      );
    }

    // Structural gate. A client-supplied "system" message fails the role enum here,
    // so it can never reach the model.
    const parsed = ChatRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      console.warn('[CHAT-API] rejected malformed body:', parsed.error.issues[0]?.message);
      return new Response('Invalid request.', { status: 400 });
    }

    // Validated shape, widened for the SDK, which also accepts the system message
    // prepended below.
    const messages = parsed.data.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })) as CoreMessage[];

    const question = lastUserMessage(parsed.data.messages);

    if (exceedsWordLimit(question)) {
      console.warn(
        `[CHAT-API] ${ip} sent ${countWords(question)} words, over the limit`,
      );
      return new Response(replay(`0:${JSON.stringify(TOO_LONG_REPLY)}\n`), {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'x-vercel-ai-data-stream': 'v1',
        },
      });
    }

    // Answered without a model call: no tokens spent, stays in voice, and gives no
    // signal that a filter exists.
    if (containsAbuse(question)) {
      console.warn(`[CHAT-API] abuse filter tripped for ${ip}`);
      return new Response(replay(`0:${JSON.stringify(ABUSE_REPLY)}\n`), {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'x-vercel-ai-data-stream': 'v1',
        },
      });
    }

    const cacheKey = cacheKeyFor(parsed.data.messages);
    if (cacheKey) {
      const cached = readCache(cacheKey);
      if (cached) {
        console.log(`[CHAT-API] cache hit for "${cacheKey}"`);
        return new Response(replay(cached), {
          headers: {
            'content-type': 'text/plain; charset=utf-8',
            'x-vercel-ai-data-stream': 'v1',
          },
        });
      }
    }

    messages.unshift(getSystemPrompt());

    // getPhotos is offered only when there is something to show, so the model can
    // never open an empty gallery.
    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getBackground,
      ...(hasPhotos() ? { getPhotos } : {}),
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
            maxTokens: 800,
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
            const decoded = outputBranch.pipeThrough(decodeChunks());
            const forwarded = cacheKey
              ? decoded.pipeThrough(captureFor(cacheKey))
              : decoded;

            dataStream.merge(
              forwarded as unknown as Parameters<typeof dataStream.merge>[0],
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
