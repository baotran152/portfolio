// In-memory fixed-window limiter. This is per server instance, so on serverless a
// determined attacker spread across cold starts gets more than the nominal budget.
// It still stops the realistic case - one browser or script hammering the endpoint -
// with no extra dependency. Swap for Upstash Redis if the keys ever need real
// protection across instances.

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 30; // per IP per window
const MAX_TRACKED_IPS = 10_000; // bound the map so it cannot grow without limit

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

function sweep(now: number) {
  for (const [ip, window] of windows) {
    if (window.resetAt <= now) windows.delete(ip);
  }
}

export function clientIp(req: Request): string {
  // Vercel and most proxies set these; the first entry is the originating client.
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(ip);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_IPS) sweep(now);
    const window = { count: 1, resetAt: now + WINDOW_MS };
    windows.set(ip, window);
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: window.resetAt };
  }

  existing.count += 1;
  return {
    allowed: existing.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - existing.count),
    resetAt: existing.resetAt,
  };
}
