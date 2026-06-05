export { createLogger }                          from "./logger";
export type { Logger, LogLevel, LogEntry }        from "./logger";

export { incr, getCounter, setGauge, getGauge, recordTimeSeries, getTimeSeries, getMultiCounters } from "./metrics";

export { startRun, finishRun, getScraperHealth }  from "./scraper-run";
export type { ScraperSource, ScraperHealth, FinishRunOpts } from "./scraper-run";

export { evaluateAlerts, getRecentAlerts, ALERT_RULES } from "./alert-engine";
export type { AlertRule, AlertEvaluation }         from "./alert-engine";

export { getDataFreshness, getProvenanceSummary }  from "./freshness";
export type { FreshnessEntry, ProvenanceSummary }  from "./freshness";

export { runDiagnostics }                          from "./diagnostics";
export type { DiagnosticCheck, SystemDiagnostics } from "./diagnostics";

export { requeueFailed, requeueAllFailed, drainQueue, getQueueDepths } from "./recovery";
export type { QueueName, RecoveryResult }          from "./recovery";

export { withJobInstrumentation }                  from "./instrumentation";
export type { InstrumentOpts }                     from "./instrumentation";
