import Redis from "ioredis";

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  try {
    _redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      lazyConnect: true, connectTimeout: 1500, enableOfflineQueue: false, maxRetriesPerRequest: 1,
    });
    _redis.on("error", () => {});
    return _redis;
  } catch { return null; }
}

export type RateLimitClass =
  | "global"    // General browsing
  | "auth"      // Sign-in / sign-up (brute-force prevention)
  | "search"    // Search queries
  | "ai"        // AI assistant / RAG answers
  | "write"     // Write operations (flags, etc.)
  | "admin";    // Admin operations

// [limit, windowMs] per class — for unauthenticated requests
const CLASS_LIMITS: Record<RateLimitClass, [number, number]> = {
  global: [300, 60_000],    // 300 req/min per IP
  auth:   [10,  60_000],    // 10 attempts/min
  search: [60,  60_000],    // 60 searches/min
  ai:     [8,   60_000],    // 8 AI calls/min
  write:  [20,  60_000],    // 20 writes/min
  admin:  [200, 60_000],    // 200 admin req/min
};

export interface RateLimitResult {
  allowed:    boolean;
  remaining:  number;
  resetMs:    number;
  limit:      number;
}

export async function checkRateLimit(
  identifier: string,        // IP or userId
  cls:        RateLimitClass,
  multiplier = 1,            // from getRateMultiplier() for authenticated users
): Promise<RateLimitResult> {
  const r = getRedis();
  const [baseLimit, windowMs] = CLASS_LIMITS[cls];
  const limit = Math.floor(baseLimit * multiplier);

  // Fail-open: if Redis is down, allow the request (don't block civic access)
  if (!r) return { allowed: true, remaining: limit, resetMs: 0, limit };

  const key = `rl:${cls}:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  try {
    const pipe = r.pipeline();
    // Sliding window: remove expired entries, add current, count
    pipe.zremrangebyscore(key, 0, windowStart);
    pipe.zadd(key, now, `${now}-${Math.random().toString(36).slice(2)}`);
    pipe.zcard(key);
    pipe.pexpire(key, windowMs);
    const results = await pipe.exec();

    const count = (results?.[2]?.[1] as number) ?? 0;
    const allowed = count <= limit;
    const remaining = Math.max(0, limit - count);

    return { allowed, remaining, resetMs: now + windowMs, limit };
  } catch {
    return { allowed: true, remaining: limit, resetMs: 0, limit };
  }
}

// Shorthand for checking and failing if over limit
export async function enforceRateLimit(
  identifier: string,
  cls: RateLimitClass,
  multiplier = 1,
): Promise<{ blocked: boolean; headers: Record<string, string> }> {
  const result = await checkRateLimit(identifier, cls, multiplier);
  const headers = {
    "X-RateLimit-Limit":     String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset":     String(Math.ceil(result.resetMs / 1000)),
  };
  return { blocked: !result.allowed, headers };
}
