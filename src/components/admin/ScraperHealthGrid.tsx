"use client";

import type { ScraperHealth } from "@/lib/observability/scraper-run";

const STATUS_STYLES: Record<ScraperHealth["status"], string> = {
  healthy:  "border-emerald-500/50 bg-emerald-950/20",
  degraded: "border-amber-500/50   bg-amber-950/20",
  down:     "border-red-500/50     bg-red-950/20",
  unknown:  "border-slate-600      bg-slate-800/30",
};

const STATUS_DOT: Record<ScraperHealth["status"], string> = {
  healthy:  "bg-emerald-400",
  degraded: "bg-amber-400",
  down:     "bg-red-400 animate-pulse",
  unknown:  "bg-slate-500",
};

const SOURCE_LABELS: Record<string, string> = {
  ADR_MYNETA:   "ADR / MyNeta",
  ECI_PORTAL:   "ECI Portal",
  PRS_INDIA:    "PRS India",
  SUPREME_COURT:"Supreme Court",
  INDIA_CODE_API: "India Code API",
  IMAGE_INGEST: "Image Ingest",
};

function fmt(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function fmtAge(date: Date | null): string {
  if (!date) return "never";
  const h = (Date.now() - new Date(date).getTime()) / 3600000;
  if (h < 1)  return `${Math.round(h * 60)}m ago`;
  if (h < 24) return `${Math.round(h)}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

interface Props {
  health: ScraperHealth[];
}

export default function ScraperHealthGrid({ health }: Props) {
  if (health.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-8 text-center text-slate-500 text-sm">
        No scraper run history yet. Start a job to see health data.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {health.map((h) => (
        <div
          key={h.source}
          className={`rounded-xl border p-4 flex flex-col gap-2 ${STATUS_STYLES[h.status]}`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_DOT[h.status]}`} />
            <span className="font-semibold text-sm text-slate-200 truncate">
              {SOURCE_LABELS[h.source] ?? h.source}
            </span>
            <span className="ml-auto text-xs capitalize text-slate-400">{h.status}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
            <span>Last success</span>
            <span className="text-right text-slate-300">{fmtAge(h.lastSuccess)}</span>

            <span>Success rate</span>
            <span className={`text-right font-medium ${h.successRate >= 0.9 ? "text-emerald-400" : h.successRate >= 0.6 ? "text-amber-400" : "text-red-400"}`}>
              {(h.successRate * 100).toFixed(0)}%
            </span>

            <span>Avg duration</span>
            <span className="text-right text-slate-300">
              {h.avgDurationMs > 0 ? fmt(h.avgDurationMs) : "—"}
            </span>

            <span>Runs (24h)</span>
            <span className="text-right text-slate-300">{h.runsLast24h}</span>

            {h.consecutiveFailures > 0 && (
              <>
                <span className="text-red-400">Consecutive fails</span>
                <span className="text-right text-red-400 font-bold">{h.consecutiveFailures}</span>
              </>
            )}
          </div>

          {h.lastError && (
            <p className="mt-1 text-xs text-red-300 truncate" title={h.lastError.message}>
              ⚠ {h.lastError.message ?? "Unknown error"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
