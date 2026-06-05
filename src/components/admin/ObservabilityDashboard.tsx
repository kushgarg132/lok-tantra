"use client";

import { useState, useEffect, useCallback } from "react";
import QueueHealthCard from "./QueueHealthCard";
import ScraperHealthGrid from "./ScraperHealthGrid";
import AlertList from "./AlertList";
import FreshnessTable from "./FreshnessTable";
import LogStream from "./LogStream";
import type { ScraperHealth } from "@/lib/observability/scraper-run";
import type { FreshnessEntry } from "@/lib/observability/freshness";
import type { AlertEvaluation } from "@/lib/observability/alert-engine";

type QueueName = "api-fetch" | "scrape-html" | "pdf-ocr" | "image-ingest";
type TabId = "queues" | "scrapers" | "alerts" | "freshness" | "logs";

interface DashboardData {
  ts:           number;
  scraperHealth: ScraperHealth[];
  freshness:    FreshnessEntry[];
  alerts:       AlertEvaluation[];
  queueDepths:  Record<QueueName, Record<string, number>>;
  counters:     Record<string, number>;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "queues",   label: "Queues"   },
  { id: "scrapers", label: "Scrapers" },
  { id: "alerts",   label: "Alerts"   },
  { id: "freshness",label: "Freshness"},
  { id: "logs",     label: "Logs"     },
];

const QUEUE_NAMES: QueueName[] = ["api-fetch", "scrape-html", "pdf-ocr", "image-ingest"];

export default function ObservabilityDashboard() {
  const [data,     setData]     = useState<DashboardData | null>(null);
  const [tab,      setTab]      = useState<TabId>("queues");
  const [loading,  setLoading]  = useState(true);
  const [actLoading, setActLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [alertHistory, setAlertHistory] = useState<any[]>([]);
  const [diagStatus, setDiagStatus] = useState<"idle" | "running" | "done">("idle");
  const [diagResult, setDiagResult] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      const res  = await fetch("/api/admin/observability");
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const res  = await fetch("/api/admin/observability/alerts");
      const json = await res.json();
      setAlertHistory(json.history ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchData();
    fetchAlerts();
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, [fetchData, fetchAlerts]);

  async function recoveryAction(action: string, queue?: QueueName) {
    setActLoading(true);
    try {
      await fetch("/api/admin/observability/recovery", {
        method:  "POST",
        headers: { "content-type": "application/json" },
        body:    JSON.stringify({ action, queue }),
      });
      await fetchData();
    } finally {
      setActLoading(false);
    }
  }

  async function runDiagnostics() {
    setDiagStatus("running");
    try {
      const res  = await fetch("/api/admin/observability/diagnostics");
      const json = await res.json();
      setDiagResult(json);
      setDiagStatus("done");
    } catch {
      setDiagStatus("idle");
    }
  }

  const activeAlerts = (data?.alerts ?? []).filter((a) => a.fired);
  const critCount    = activeAlerts.filter((a) => a.rule.severity === "critical").length;
  const warnCount    = activeAlerts.filter((a) => a.rule.severity === "warning").length;

  const overallBadge =
    critCount > 0 ? "bg-red-900/60 text-red-300 border-red-700"        :
    warnCount > 0 ? "bg-amber-900/60 text-amber-300 border-amber-700"   :
    "bg-emerald-900/60 text-emerald-300 border-emerald-700";

  const overallLabel =
    critCount > 0 ? `${critCount} critical` :
    warnCount > 0 ? `${warnCount} warning`  :
    "All clear";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Observability</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString()}` : "Loading…"} · Auto-refresh 30s
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${overallBadge}`}>
            {overallLabel}
          </span>
          <button
            onClick={fetchData}
            className="px-3 py-1.5 text-xs rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
          >
            Refresh
          </button>
          <a
            href="/api/admin/queues"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 text-xs rounded bg-blue-800/60 hover:bg-blue-700/60 border border-blue-700 text-blue-300 transition-colors"
          >
            Bull Board ↗
          </a>
        </div>
      </div>

      {/* Summary row */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Queues",   value: QUEUE_NAMES.length, sub: `${QUEUE_NAMES.reduce((acc, q) => acc + (data.queueDepths[q]?.failed ?? 0), 0)} failed` },
            { label: "Scrapers", value: data.scraperHealth.filter((h) => h.status === "healthy").length + "/" + data.scraperHealth.length, sub: "healthy" },
            { label: "Alerts",   value: activeAlerts.length, sub: "active" },
            { label: "Sources",  value: data.freshness.filter((f) => f.status === "fresh").length + "/" + data.freshness.length, sub: "fresh" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 text-center">
              <div className="text-2xl font-bold text-slate-200">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label} · {s.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-slate-800 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              tab === t.id
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            {t.label}
            {t.id === "alerts" && activeAlerts.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold">
                {activeAlerts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-600 text-sm animate-pulse">Loading dashboard…</div>
      ) : (
        <>
          {/* Queues */}
          {tab === "queues" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {QUEUE_NAMES.map((q) => (
                  <QueueHealthCard
                    key={q}
                    name={q}
                    counts={data?.queueDepths[q] ?? {}}
                    loading={actLoading}
                    onRequeue={() => recoveryAction("requeue", q)}
                    onDrain={() => recoveryAction("drain", q)}
                  />
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => recoveryAction("requeue-all")}
                  disabled={actLoading}
                  className="px-4 py-2 text-sm rounded bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-medium transition-colors"
                >
                  {actLoading ? "Working…" : "Requeue all failed"}
                </button>
              </div>
            </div>
          )}

          {/* Scrapers */}
          {tab === "scrapers" && (
            <ScraperHealthGrid health={data?.scraperHealth ?? []} />
          )}

          {/* Alerts */}
          {tab === "alerts" && (
            <AlertList
              active={data?.alerts.filter((a) => a.fired) ?? []}
              history={alertHistory}
            />
          )}

          {/* Freshness */}
          {tab === "freshness" && (
            <FreshnessTable entries={data?.freshness ?? []} />
          )}

          {/* Logs */}
          {tab === "logs" && <LogStream />}
        </>
      )}

      {/* Diagnostics */}
      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300">System Diagnostics</h3>
          <button
            onClick={runDiagnostics}
            disabled={diagStatus === "running"}
            className="px-3 py-1.5 text-xs rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 disabled:opacity-50 transition-colors"
          >
            {diagStatus === "running" ? "Running…" : "Run checks"}
          </button>
        </div>

        {diagResult && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                diagResult.overall === "healthy"  ? "bg-emerald-900/50 text-emerald-300 border-emerald-700" :
                diagResult.overall === "degraded" ? "bg-amber-900/50 text-amber-300 border-amber-700"       :
                "bg-red-900/50 text-red-300 border-red-700"
              }`}>
                {diagResult.overall}
              </span>
              <span className="text-xs text-slate-500">{new Date(diagResult.ts).toLocaleTimeString()}</span>
            </div>
            {diagResult.checks?.map((c: any) => (
              <div key={c.name} className="flex items-center gap-3 text-sm">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  c.status === "ok" ? "bg-emerald-400" : c.status === "warn" ? "bg-amber-400" : "bg-red-400"
                }`} />
                <span className="text-slate-300 w-32 flex-shrink-0">{c.name}</span>
                <span className="text-slate-400 text-xs flex-1">{c.message}</span>
                {c.latencyMs != null && (
                  <span className="text-slate-600 text-xs font-mono">{c.latencyMs}ms</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
