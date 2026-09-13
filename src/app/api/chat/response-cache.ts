// Exact-match response cache. Most traffic on this site is visitors clicking the same
// five canned questions, so replaying a byte-identical answer avoids paying for the
// same generation repeatedly.
//
// Deliberately exact-match only: without an embedding model there is no safe way to
// judge that two differently worded questions deserve the same answer, and a wrong
// hit would put words in Bảo's mouth. Normalisation therefore only removes noise that
// cannot change meaning - case, surrounding space, repeated spaces, trailing
// punctuation.

const MAX_ENTRIES = 100;
const TTL_MS = 24 * 60 * 60 * 1000;

type Entry = { body: string; storedAt: number };

// Insertion-ordered, so the oldest key is the first one Map iteration yields.
const cache = new Map<string, Entry>();

export function normalizeQuestion(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[?!.,]+$/, '');
}

type ChatMessage = { role?: string; content?: unknown };

// Only the opening turn is cacheable. Once there is history, the same question can
// legitimately deserve a different answer, and replaying a stale one would be wrong.
export function cacheKeyFor(messages: ChatMessage[]): string | null {
  const conversation = messages.filter((m) => m?.role !== 'system');
  if (conversation.length !== 1) return null;

  const [only] = conversation;
  if (only?.role !== 'user' || typeof only.content !== 'string') return null;

  const normalized = normalizeQuestion(only.content);
  return normalized.length > 0 ? normalized : null;
}

export function readCache(key: string): string | null {
  const hit = cache.get(key);
  if (!hit) return null;

  if (Date.now() - hit.storedAt > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.body;
}

export function writeCache(key: string, body: string) {
  if (cache.size >= MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { body, storedAt: Date.now() });
}

// Replays a stored data stream as-is. The protocol text already contains the text
// parts, tool calls and finish events, so the client cannot tell it from a live run.
export function replay(body: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(body));
      controller.close();
    },
  });
}
