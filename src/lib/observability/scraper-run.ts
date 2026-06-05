import Redis from "ioredis";
import { incr, setGauge, recordTimeSeries } from "./metrics";

export type ScraperSource =
  | "ADR_MYNETA"
  | "ECI_PORTAL"
  | "PRS_INDIA"
  | "SUPREME_COURT"
  | "INDIA_CODE_API"
  | "IMAGE_INGEST";

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

export async function startRun(source: ScraperSource, jobId?: string): Promise<string | null> {
  try {
    const { prisma } = await import("@/lib/db");
    const run = await (prisma as any).scraperRun.create({
      data: { source, jobId: jobId ?? null, status: "running", startedAt: new Date() },
    });
    await incr(`scraper.${source}.runs.started`);
    return run.id as string;
  } catch { return null; }
}

export interface FinishRunOpts {
  status:           "success" | "failed" | "timeout";
  startedAt:        Date;
  recordsProcessed?: number;
  recordsFailed?:    number;
  errorMessage?:     string;
  errorStack?:       string;
  httpStatus?:       number;
  retryCount?:       number;
}

export async function finishRun(runId: string | null, source: ScraperSource, opts: FinishRunOpts): Promise<void> {
  const durationMs = Date.now() - opts.startedAt.getTime();
  const r = getRedis();
  const ts = Date.now();

  try {
    if (runId) {
      const { prisma } = await import("@/lib/db");
      await (prisma as any).scraperRun.update({
        where: { id: runId },
        data: {
          status:           opts.status,
          finishedAt:       new Date(),
          durationMs,
          recordsProcessed: opts.recordsProcessed ?? 0,
          recordsFailed:    opts.recordsFailed    ?? 0,
          errorMessage:     opts.errorMessage     ?? null,
          errorStack:       opts.errorStack       ?? null,
          httpStatus:       opts.httpStatus       ?? null,
          retryCount:       opts.retryCount       ?? 0,
        },
      });
    }
  } catch {}

  if (opts.status === "success") {
    await incr(`scraper.${source}.runs.success`);
    if (r) {
      await r.set(`obs:scraper:last_success:${source}`, String(ts), "EX", 30 * 24 * 3600).catch(() => {});
      await r.del(`obs:scraper:consecutive_failures:${source}`).catch(() => {});
    }
  } else {
    await incr(`scraper.${source}.runs.failed`);
    if (r) {
      const errPayload = JSON.stringify({ ts, message: opts.errorMessage });
      await r.set(`obs:scraper:last_error:${source}`, errPayload, "EX", 30 * 24 * 3600).catch(() => {});
      await r.incr(`obs:scraper:consecutive_failures:${source}`).catch(() => {});
    }
  }

  await setGauge(`scraper.${source}.last_duration_ms`, durationMs);
  await recordTimeSeries(`scraper.${source}.duration_ms`, durationMs, ts);
  if (opts.recordsProcessed != null) {
    await recordTimeSeries(`scraper.${source}.records`, opts.recordsProcessed, ts);
  }
}

export interface ScraperHealth {
  source:               ScraperSource;
  status:               "healthy" | "degraded" | "down" | "unknown";
  lastSuccess:          Date | null;
  lastError:            { ts: number; message?: string } | null;
  consecutiveFailures:  number;
  successRate:          number;
  avgDurationMs:        number;
  runsLast24h:          number;
}

export async function getScraperHealth(): Promise<ScraperHealth[]> {
  const sources: ScraperSource[] = [
    "ADR_MYNETA", "ECI_PORTAL", "PRS_INDIA", "SUPREME_COURT", "INDIA_CODE_API", "IMAGE_INGEST",
  ];
  const r = getRedis();

  return Promise.all(
    sources.map(async (source): Promise<ScraperHealth> => {
      let lastSuccess: Date | null = null;
      let lastError:   { ts: number; message?: string } | null = null;
      let consecutiveFailures = 0;

      if (r) {
        try {
          const [ls, le, cf] = await Promise.all([
            r.get(`obs:scraper:last_success:${source}`),
            r.get(`obs:scraper:last_error:${source}`),
            r.get(`obs:scraper:consecutive_failures:${source}`),
          ]);
          if (ls) lastSuccess = new Date(parseInt(ls, 10));
          if (le) lastError   = JSON.parse(le) as { ts: number; message?: string };
          if (cf) consecutiveFailures = parseInt(cf, 10);
        } catch {}
      }

      let successRate   = 1;
      let avgDurationMs = 0;
      let runsLast24h   = 0;

      try {
        const { prisma } = await import("@/lib/db");
        const since = new Date(Date.now() - 24 * 3600 * 1000);
        const [succeeded, failed, avg] = await Promise.all([
          (prisma as any).scraperRun.count({ where: { source, status: "success", startedAt: { gte: since } } }),
          (prisma as any).scraperRun.count({ where: { source, status: "failed",  startedAt: { gte: since } } }),
          (prisma as any).scraperRun.aggregate({
            where: { source, status: "success", startedAt: { gte: since } },
            _avg:  { durationMs: true },
          }),
        ]);
        runsLast24h   = succeeded + failed;
        successRate   = runsLast24h > 0 ? succeeded / runsLast24h : 1;
        avgDurationMs = avg._avg?.durationMs ?? 0;
      } catch {}

      const hoursSinceLast = lastSuccess ? (Date.now() - lastSuccess.getTime()) / 3600000 : Infinity;
      const status: ScraperHealth["status"] =
        consecutiveFailures >= 5                           ? "down"     :
        consecutiveFailures >= 2 || hoursSinceLast > 48   ? "degraded" :
        lastSuccess                                        ? "healthy"  :
        "unknown";

      return { source, status, lastSuccess, lastError, consecutiveFailures, successRate, avgDurationMs, runsLast24h };
    })
  );
}
