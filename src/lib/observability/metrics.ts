import Redis from "ioredis";

const METRIC_TTL    = 7 * 24 * 3600;
const MAX_TS_POINTS = 1440;

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  try {
    _redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      lazyConnect: true, connectTimeout: 2000, enableOfflineQueue: false, maxRetriesPerRequest: 1,
    });
    _redis.on("error", () => {});
    return _redis;
  } catch { return null; }
}

export async function incr(metric: string, by = 1): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    const key = `obs:counter:${metric}`;
    if (by >= 0) await r.incrby(key, by);
    else         await r.decrby(key, -by);
    await r.expire(key, METRIC_TTL);
  } catch {}
}

export async function getCounter(metric: string): Promise<number> {
  const r = getRedis();
  if (!r) return 0;
  try {
    const val = await r.get(`obs:counter:${metric}`);
    return val ? parseInt(val, 10) : 0;
  } catch { return 0; }
}

export async function setGauge(metric: string, value: number): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.set(`obs:gauge:${metric}`, String(value), "EX", METRIC_TTL);
  } catch {}
}

export async function getGauge(metric: string): Promise<number | null> {
  const r = getRedis();
  if (!r) return null;
  try {
    const val = await r.get(`obs:gauge:${metric}`);
    return val != null ? parseFloat(val) : null;
  } catch { return null; }
}

export async function recordTimeSeries(metric: string, value: number, ts = Date.now()): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    const key = `obs:ts:${metric}`;
    await r.zadd(key, ts, `${ts}:${value}`);
    const count = await r.zcard(key);
    if (count > MAX_TS_POINTS) {
      await r.zremrangebyrank(key, 0, count - MAX_TS_POINTS - 1);
    }
    await r.expire(key, METRIC_TTL);
  } catch {}
}

export async function getTimeSeries(metric: string, fromMs: number, toMs: number): Promise<Array<{ ts: number; value: number }>> {
  const r = getRedis();
  if (!r) return [];
  try {
    const members = await r.zrangebyscore(`obs:ts:${metric}`, fromMs, toMs);
    return members.map((m) => {
      const colon = m.indexOf(":");
      return { ts: parseInt(m.slice(0, colon), 10), value: parseFloat(m.slice(colon + 1)) };
    });
  } catch { return []; }
}

export async function getMultiCounters(metrics: string[]): Promise<Record<string, number>> {
  const empty = Object.fromEntries(metrics.map((m) => [m, 0]));
  if (metrics.length === 0) return empty;
  const r = getRedis();
  if (!r) return empty;
  try {
    const keys   = metrics.map((m) => `obs:counter:${m}`);
    const values = await r.mget(...keys);
    return Object.fromEntries(metrics.map((m, i) => [m, values[i] ? parseInt(values[i]!, 10) : 0]));
  } catch { return empty; }
}
