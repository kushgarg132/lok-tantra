"use client";

import { useState, useEffect } from "react";

interface AuditEntry {
  id:         string;
  action:     string;
  resource:   string | null;
  resourceId: string | null;
  result:     string;
  reason:     string | null;
  ipAddress:  string | null;
  createdAt:  string;
  user:       { name: string | null; email: string } | null;
}

const RESULT_BADGE: Record<string, string> = {
  success: "bg-emerald-900/40 text-emerald-400 border-emerald-800",
  failure: "bg-red-900/40 text-red-400 border-red-800",
  blocked: "bg-amber-900/40 text-amber-400 border-amber-800",
};

function timeAgo(d: string): string {
  const ms = Date.now() - new Date(d).getTime();
  const m  = Math.floor(ms / 60000);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AuditLogViewer() {
  const [logs,    setLogs]    = useState<AuditEntry[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState({ action: "", result: "", resource: "" });
  const [stats,   setStats]   = useState<{ total: number; byResult: Record<string, number>; byAction: Record<string, number> } | null>(null);

  async function fetchLogs() {
    setLoading(true);
    const params = new URLSearchParams({ limit: "100" });
    if (filter.action)   params.set("action",   filter.action);
    if (filter.result)   params.set("result",   filter.result);
    if (filter.resource) params.set("resource", filter.resource);

    const [logRes, statRes] = await Promise.all([
      fetch(`/api/admin/audit?${params}`),
      fetch("/api/admin/audit?view=stats"),
    ]);

    const logData  = await logRes.json();
    const statData = await statRes.json();

    setLogs(logData.logs ?? []);
    setTotal(logData.total ?? 0);
    setStats(statData);
    setLoading(false);
  }

  useEffect(() => { fetchLogs(); }, [filter]);

  return (
    <div className="space-y-4">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2 text-center">
            <div className="text-xl font-bold text-slate-200">{stats.total.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Events (7d)</div>
          </div>
          {Object.entries(stats.byResult ?? {}).map(([r, n]) => (
            <div key={r} className="rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2 text-center">
              <div className={`text-xl font-bold ${r === "blocked" ? "text-amber-400" : r === "failure" ? "text-red-400" : "text-emerald-400"}`}>{(n as number).toLocaleString()}</div>
              <div className="text-xs text-slate-500 capitalize">{r}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          value={filter.action}
          onChange={(e) => setFilter((f) => ({ ...f, action: e.target.value }))}
          placeholder="Filter action…"
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1.5 w-40"
        />
        <select
          value={filter.result}
          onChange={(e) => setFilter((f) => ({ ...f, result: e.target.value }))}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1.5"
        >
          <option value="">All results</option>
          <option value="success">Success</option>
          <option value="failure">Failure</option>
          <option value="blocked">Blocked</option>
        </select>
        <input
          value={filter.resource}
          onChange={(e) => setFilter((f) => ({ ...f, resource: e.target.value }))}
          placeholder="Filter resource…"
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1.5 w-36"
        />
        <button onClick={fetchLogs} className="px-3 py-1.5 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
          Refresh
        </button>
        <span className="ml-auto text-xs text-slate-600 self-center">{total.toLocaleString()} events</span>
      </div>

      {/* Log table */}
      {loading ? (
        <div className="text-center py-8 text-slate-500 text-sm animate-pulse">Loading…</div>
      ) : (
        <div className="rounded-xl border border-slate-700 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="text-left px-4 py-2.5">Action</th>
                <th className="text-left px-4 py-2.5">User</th>
                <th className="text-left px-4 py-2.5 hidden sm:table-cell">Resource</th>
                <th className="text-left px-4 py-2.5">Result</th>
                <th className="text-right px-4 py-2.5">When</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={l.id} className={`border-t border-slate-700/40 ${i % 2 === 0 ? "bg-slate-800/10" : ""}`}>
                  <td className="px-4 py-2.5 font-mono text-slate-300">{l.action}</td>
                  <td className="px-4 py-2.5 text-slate-400 truncate max-w-[120px]">
                    {l.user ? (l.user.name ?? l.user.email) : <span className="text-slate-600">Anonymous</span>}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 hidden sm:table-cell font-mono">
                    {l.resource ? `${l.resource}${l.resourceId ? `:${l.resourceId.slice(0, 8)}` : ""}` : "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${RESULT_BADGE[l.result] ?? ""}`}>
                      {l.result}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-600">{timeAgo(l.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
