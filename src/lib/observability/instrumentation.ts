import { createLogger, type Logger } from "./logger";
import { startRun, finishRun, type ScraperSource } from "./scraper-run";
import { incr, recordTimeSeries } from "./metrics";

type AnyFn<T> = () => Promise<T>;

export interface InstrumentOpts {
  source:  ScraperSource;
  jobId?:  string;
  logger?: Logger;
}

function extractCount(result: unknown): number {
  if (result && typeof result === "object") {
    const r = result as Record<string, unknown>;
    if (typeof r.recordsProcessed === "number") return r.recordsProcessed;
    if (typeof r.count            === "number") return r.count;
    if (typeof r.inserted         === "number") return r.inserted;
    if (typeof r.indexed          === "number") return r.indexed;
  }
  return 0;
}

export async function withJobInstrumentation<T>(fn: AnyFn<T>, opts: InstrumentOpts): Promise<T> {
  const log       = opts.logger ?? createLogger(`ETL:${opts.source}`);
  const startedAt = new Date();
  const runId     = await startRun(opts.source, opts.jobId);

  log.info("Job started", { source: opts.source, jobId: opts.jobId });
  await incr(`scraper.${opts.source}.jobs.active`);

  try {
    const result   = await fn();
    const duration = Date.now() - startedAt.getTime();

    await finishRun(runId, opts.source, {
      status:           "success",
      startedAt,
      recordsProcessed: extractCount(result),
    });

    log.info("Job completed", { source: opts.source }, { durationMs: duration });
    await recordTimeSeries(`scraper.${opts.source}.success_ms`, duration);
    await incr(`scraper.${opts.source}.jobs.active`, -1);

    return result;
  } catch (err) {
    const duration = Date.now() - startedAt.getTime();
    const error    = err as Error;

    await finishRun(runId, opts.source, {
      status:       "failed",
      startedAt,
      errorMessage: error.message,
      errorStack:   error.stack,
    });

    log.error("Job failed", { source: opts.source, error: error.message }, { durationMs: duration });
    await incr(`scraper.${opts.source}.jobs.failed`);
    await incr(`scraper.${opts.source}.jobs.active`, -1);

    throw err;
  }
}
