import Redis from "ioredis";
import type { MediaVariants } from "./types";

// Reuse the project's Redis connection lazily
let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null;
  if (!_redis) {
    _redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
    _redis.on("error", (err) => {
      // Non-fatal: media cache just won't work
      console.warn("[media-cache] Redis error:", err.message);
    });
  }
  return _redis;
}

const TTL_HIT = 60 * 60;       // 1 hour for found assets
const TTL_MISS = 60 * 5;       // 5 min negative cache for "no image found"
const MISS_SENTINEL = "__NONE__";

function primaryKey(entityType: string, entityId: string): string {
  return `media:url:${entityType}:${entityId}`;
}

function variantsKey(entityType: string, entityId: string): string {
  return `media:variants:${entityType}:${entityId}`;
}

export async function getCachedMediaUrl(
  entityType: string,
  entityId: string
): Promise<string | null | undefined> {
  const r = getRedis();
  if (!r) return undefined; // undefined = cache unavailable
  try {
    const val = await r.get(primaryKey(entityType, entityId));
    if (val === null) return undefined;        // cache miss
    if (val === MISS_SENTINEL) return null;    // known negative
    return val;
  } catch {
    return undefined;
  }
}

export async function setCachedMediaUrl(
  entityType: string,
  entityId: string,
  url: string
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.set(primaryKey(entityType, entityId), url, "EX", TTL_HIT);
  } catch {}
}

export async function setCachedMediaMiss(
  entityType: string,
  entityId: string
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.set(primaryKey(entityType, entityId), MISS_SENTINEL, "EX", TTL_MISS);
  } catch {}
}

export async function getCachedVariants(
  entityType: string,
  entityId: string
): Promise<MediaVariants | null> {
  const r = getRedis();
  if (!r) return null;
  try {
    const raw = await r.get(variantsKey(entityType, entityId));
    if (!raw) return null;
    return JSON.parse(raw) as MediaVariants;
  } catch {
    return null;
  }
}

export async function setCachedVariants(
  entityType: string,
  entityId: string,
  variants: MediaVariants
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.set(
      variantsKey(entityType, entityId),
      JSON.stringify(variants),
      "EX",
      TTL_HIT
    );
  } catch {}
}

export async function invalidateMediaCache(
  entityType: string,
  entityId: string
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.del(primaryKey(entityType, entityId), variantsKey(entityType, entityId));
  } catch {}
}
