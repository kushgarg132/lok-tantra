"use client";

import { useState, useEffect, useRef } from "react";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  ts:         number;
  level:      LogLevel;
  source:     string;
  msg:        string;
  ctx?:       Record<string, unknown>;
  durationMs?: number;
}

const LEVEL_COLOR: Record<LogLevel, string> = {
  debug: "text-slate-500",
  info:  "text-blue-400",
  warn:  "text-amber-400",
  error: "text-red-400",
};

const LEVELS: LogLevel[] = ["debug", "info", "warn", "error"];

export default function LogStream() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [level,   setLevel]   = useState<LogLevel | "">("");
  const [source,  setSource]  = useState("");
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function fetchLogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "150" });
      if (level)  params.set("level",  level);
      if (source) params.set("source", source);
      const res  = await fetch(`/api/admin/observability/logs?${params}`);
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch {} finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, source]);

  // Pause auto-refresh after 5 minutes of inactivity (900 log entries/minute is wasteful for idle tabs)
  const INACTIVITY_MS = 5 * 60 * 1000;
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    function resetInactivity() {
      setIsActive(true);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => setIsActive(false), INACTIVITY_MS);
    }

    resetInactivity();
    const events = ["mousemove", "keydown", "pointerdown"];
    events.forEach((e) => window.addEventListener(e, resetInactivity, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivity));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!autoRefresh || !isActive) return;
    const id = setInterval(fetchLogs, 10_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, isActive, level, source]);

  useEffect(() => {
    if (autoRefresh) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries, autoRefresh]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as LogLevel | "")}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1.5"
        >
          <option value="">All levels</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Filter by source…"
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1.5 w-40"
        />

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="px-3 py-1.5 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-50 transition-colors"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>

        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="accent-blue-500"
          />
          Live (10s)
        </label>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900 h-80 overflow-auto font-mono text-xs">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-600">
            {loading ? "Loading logs…" : "No log entries found"}
          </div>
        ) : (
          <div className="p-3 space-y-0.5">
            {entries.map((e, i) => (
              <div key={i} className="flex gap-2 leading-5 hover:bg-slate-800/50 px-1 rounded">
                <span className="text-slate-600 flex-shrink-0">
                  {new Date(e.ts).toISOString().slice(11, 23)}
                </span>
                <span className={`flex-shrink-0 w-10 font-bold uppercase ${LEVEL_COLOR[e.level]}`}>
                  {e.level}
                </span>
                <span className="text-slate-500 flex-shrink-0 truncate max-w-[120px]">{e.source}</span>
                <span className="text-slate-300 flex-1 truncate">{e.msg}</span>
                {e.durationMs != null && (
                  <span className="text-slate-600 flex-shrink-0">{e.durationMs}ms</span>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <p className="text-xs text-slate-600">{entries.length} entries (from Redis ring buffer, last 2000 logs)</p>
    </div>
  );
}
