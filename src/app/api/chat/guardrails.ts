import { z } from 'zod';

// Structural validation of the request body. This is the layer that cannot be talked
// out of: a client-supplied "system" message is not filtered, it fails to parse,
// because 'system' is not a member of the role enum.

// Applied to what a visitor types. Assistant turns in the history are the model's own
// output and routinely run longer, so they get a separate, looser ceiling.
const MAX_USER_WORDS = 50;
const MAX_MESSAGE_CHARS = 4000;
const MAX_HISTORY = 20;

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(MAX_MESSAGE_CHARS),
  // The client sends its own rendering metadata; accepted but never trusted.
  id: z.string().optional(),
  parts: z.unknown().optional(),
  toolInvocations: z.unknown().optional(),
  createdAt: z.unknown().optional(),
});

export const ChatRequestSchema = z.object({
  id: z.string().optional(),
  messages: z.array(MessageSchema).min(1).max(MAX_HISTORY),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Strips diacritics so Vietnamese written without tone marks still matches:
// "đụ má" and "du ma" normalise to the same text. Also folds đ/Đ, which NFD
// does not decompose.
export function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Deliberately narrow: slurs and direct harassment only. Topic scoping is the system
// prompt's job - it can tell "how do you use Python?" from "do my Python homework",
// and a regex cannot. Word-boundary anchored so "assistant" does not match "ass".
const ABUSE_PATTERNS: RegExp[] = [
  // English
  /\b(fuck|fucking|fucker|motherfucker)\b/,
  /\b(shit|bullshit)\b/,
  /\b(bitch|bastard|asshole)\b/,
  /\b(cunt|whore|slut)\b/,
  /\b(retard|retarded)\b/,
  /\b(kill yourself|kys)\b/,
  // Vietnamese, matched after diacritics are stripped
  /\b(du ma|dm|dmm|djt|dit me|do cho|con cho)\b/,
  /\b(thang cho|thang ngu|do ngu|ngu nhu cho)\b/,
  /\b(cut|lon|buoi)\s+(me|may|mi)\b/,
  /\b(vai lon|vai cut)\b/,
];

export function containsAbuse(text: string): boolean {
  const normalized = normalizeForMatching(text);
  return ABUSE_PATTERNS.some((pattern) => pattern.test(normalized));
}

// Answered without calling a model: costs nothing, stays in voice, and gives an
// attacker no signal that a filter exists.
export const ABUSE_REPLY =
  "Let's keep it friendly, yeah? Happy to talk about my work, my projects, or how to get in touch.";

export const TOO_LONG_REPLY =
  "That's a lot to take in at once. Could you trim it to a sentence or two? I'll give you a better answer that way.";

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

// Only the visitor's own message is capped. Long input is mostly a cost problem -
// it is a weak injection signal, since the shortest jailbreaks are a single line.
export function exceedsWordLimit(text: string): boolean {
  return countWords(text) > MAX_USER_WORDS;
}

export function lastUserMessage(messages: ChatRequest['messages']): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message?.role === 'user') return message.content;
  }
  return '';
}
