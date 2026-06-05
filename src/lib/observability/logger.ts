import Redis from "ioredis";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  ts:         number;
  level:      LogLevel;
  source:     string;
  msg:        string;
  ctx?:       Record<string, unknown>;
  traceId?:   string;
  jobId?:     string;
  durationMs?: number;
}

const LEVEL_NUM: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const LOG_KEY   = "obs:logs";
const LOG_MAX   = 2000;

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  try {
    _redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      lazyConnect:          true,
      connectTimeout:       2000,
      enableOfflineQueue:   false,
      maxRetriesPerRequest: 1,
    });
    _redis.on("error", () => {});
    return _redis;
  } catch {
    return null;
  }
}

async function pushToRedis(entry: LogEntry): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    const json = JSON.stringify(entry);
    await r.lpush(LOG_KEY, json);
    await r.ltrim(LOG_KEY, 0, LOG_MAX - 1);
    await r.expire(LOG_KEY, 7 * 24 * 3600);
  } catch { /* ignore — observability must not crash the caller */ }
}

async function persistToDb(entry: LogEntry): Promise<void> {
  try {
    const { prisma } = await import("@/lib/db");
    await (prisma as any).observabilityLog.create({
      data: {
        level:      entry.level,
        source:     entry.source,
        message:    entry.msg,
        context:    entry.ctx ?? null,
        traceId:    entry.traceId ?? null,
        jobId:      entry.jobId ?? null,
        durationMs: entry.durationMs ?? null,
      },
    });
  } catch { /* DB down or schema not migrated — ignore */ }
}

function formatConsole(entry: LogEntry): string {
  const time   = new Date(entry.ts).toISOString().slice(11, 23);
  const dur    = entry.durationMs != null ? ` (${entry.durationMs}ms)` : "";
  const ctx    = entry.ctx ? " " + JSON.stringify(entry.ctx) : "";
  return `[${time}] [${entry.level.toUpperCase().padEnd(5)}] [${entry.source}] ${entry.msg}${dur}${ctx}`;
}

const minLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel | undefined) ?? "info";

function emit(level: LogLevel, source: string, msg: string, ctx?: Record<string, unknown>, opts?: { traceId?: string; jobId?: string; durationMs?: number }): void {
  if (LEVEL_NUM[level] < LEVEL_NUM[minLevel]) return;

  const entry: LogEntry = {
    ts:         Date.now(),
    level,
    source,
    msg,
    ...(ctx  ? { ctx }               : {}),
    ...(opts?.traceId   ? { traceId:   opts.traceId }   : {}),
    ...(opts?.jobId     ? { jobId:     opts.jobId }     : {}),
    ...(opts?.durationMs != null ? { durationMs: opts.durationMs } : {}),
  };

  const formatted = formatConsole(entry);
  if (level === "error")      console.error(formatted);
  else if (level === "warn")  console.warn(formatted);
  else                        console.log(formatted);

  void pushToRedis(entry);

  if (level === "error" || level === "warn") {
    void persistToDb(entry);
  }
}

export type LoggerOpts = { traceId?: string; jobId?: string; durationMs?: number };

export interface Logger {
  debug: (msg: string, ctx?: Record<string, unknown>, opts?: LoggerOpts) => void;
  info:  (msg: string, ctx?: Record<string, unknown>, opts?: LoggerOpts) => void;
  warn:  (msg: string, ctx?: Record<string, unknown>, opts?: LoggerOpts) => void;
  error: (msg: string, ctx?: Record<string, unknown>, opts?: LoggerOpts) => void;
}

export function createLogger(source: string): Logger {
  return {
    debug: (msg, ctx, opts) => emit("debug", source, msg, ctx, opts),
    info:  (msg, ctx, opts) => emit("info",  source, msg, ctx, opts),
    warn:  (msg, ctx, opts) => emit("warn",  source, msg, ctx, opts),
    error: (msg, ctx, opts) => emit("error", source, msg, ctx, opts),
  };
}
