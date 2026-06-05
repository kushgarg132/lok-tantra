"use client";

import { useState, useEffect } from "react";

type FlagStatus = "PENDING" | "REVIEWING" | "RESOLVED_VALID" | "RESOLVED_INVALID" | "ESCALATED";

interface Flag {
  id:            string;
  contentType:   string;
  contentId:     string;
  reason:        string;
  details:       string | null;
  status:        FlagStatus;
  contentSnippet: string | null;
  ipAddress:     string | null;
  createdAt:     string;
  user:          { name: string | null; email: string; role: string } | null;
}

const REASON_LABELS: Record<string, string> = {
  INACCURATE:         "Inaccurate",
  POLITICALLY_BIASED: "Politically biased",
  MISLEADING:         "Misleading",
  MISSING_SOURCE:     "Missing source",
  OUTDATED:           "Outdated",
  INAPPROPRIATE:      "Inappropriate",
  OTHER:              "Other",
};

const STATUS_COLORS: Record<FlagStatus, string> = {
  PENDING:          "bg-amber-900/40 text-amber-300 border-amber-700",
  REVIEWING:        "bg-blue-900/40 text-blue-300 border-blue-700",
  RESOLVED_VALID:   "bg-emerald-900/40 text-emerald-300 border-emerald-700",
  RESOLVED_INVALID: "bg-slate-800 text-slate-400 border-slate-700",
  ESCALATED:        "bg-red-900/40 text-red-300 border-red-700",
};

export default function ModerationQueue() {
  const [flags,   setFlags]   = useState<Flag[]>([]);
  const [stats,   setStats]   = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [note,    setNote]    = useState("");
  const [working, setWorking] = useState(false);

  async function fetchData() {
    setLoading(true);
    const [flagRes, statRes] = await Promise.all([
      fetch("/api/moderation/queue?limit=100"),
      fetch("/api/moderation/queue?view=stats"),
    ]);
    const flagData = await flagRes.json();
    const statData = await statRes.json();
    setFlags(flagData.flags ?? []);
    setStats(statData);
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  async function resolve(flagId: string, status: string) {
    setWorking(true);
    await fetch("/api/moderation/queue", {
      method:  "PATCH",
      headers: { "content-type": "application/json" },
      body:    JSON.stringify({ flagId, status, note }),
    });
    setSelected(null); setNote("");
    await fetchData();
    setWorking(false);
  }

  const pendingCount = stats?.pending ?? 0;

  return (
    <div className="space-y-4">
      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: "Total",     value: stats.total          ?? 0, color: "text-slate-300" },
            { label: "Pending",   value: stats.pending        ?? 0, color: pendingCount > 0 ? "text-amber-400" : "text-slate-300" },
            { label: "Reviewing", value: stats.reviewing      ?? 0, color: "text-blue-400" },
            { label: "Valid",     value: stats.resolvedValid  ?? 0, color: "text-emerald-400" },
            { label: "Invalid",   value: stats.resolvedInvalid?? 0, color: "text-slate-500" },
            { label: "Escalated", value: stats.escalated      ?? 0, color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2 text-center">
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Flag list */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm animate-pulse">Loading queue…</div>
      ) : flags.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm rounded-xl border border-slate-800">
          ✓ No pending flags
        </div>
      ) : (
        <div className="rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-xs text-slate-400">
              <tr>
                <th className="text-left px-4 py-3">Content</th>
                <th className="text-left px-4 py-3">Reason</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Reporter</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flags.map((f, i) => (
                <>
                  <tr
                    key={f.id}
                    className={`border-t border-slate-700/50 cursor-pointer hover:bg-slate-800/30 ${i % 2 === 0 ? "bg-slate-800/10" : ""}`}
                    onClick={() => setSelected(selected === f.id ? null : f.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="text-xs font-mono text-slate-500">{f.contentType}</div>
                      <div className="text-slate-300 text-xs truncate max-w-[140px]">{f.contentId}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{REASON_LABELS[f.reason] ?? f.reason}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-500">
                      {f.user ? (f.user.name ?? f.user.email) : "Anonymous"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-1.5 py-0.5 rounded border text-xs ${STATUS_COLORS[f.status]}`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs text-slate-500 hover:text-slate-300">
                        {selected === f.id ? "▲" : "▼"}
                      </button>
                    </td>
                  </tr>

                  {selected === f.id && (
                    <tr key={`${f.id}-detail`} className="border-t border-slate-700/30">
                      <td colSpan={5} className="px-4 py-4 bg-slate-900/60">
                        {f.contentSnippet && (
                          <blockquote className="text-xs text-slate-400 italic border-l-2 border-slate-700 pl-3 mb-3">
                            {f.contentSnippet}
                          </blockquote>
                        )}
                        {f.details && (
                          <p className="text-xs text-slate-400 mb-3"><strong className="text-slate-300">Reporter note:</strong> {f.details}</p>
                        )}
                        <div className="flex flex-wrap gap-2 items-center">
                          <input
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Review note (optional)…"
                            className="flex-1 min-w-[200px] bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1.5"
                          />
                          <button onClick={() => resolve(f.id, "RESOLVED_VALID")}   disabled={working} className="px-3 py-1.5 text-xs rounded bg-emerald-800 hover:bg-emerald-700 text-white disabled:opacity-50">Valid</button>
                          <button onClick={() => resolve(f.id, "RESOLVED_INVALID")} disabled={working} className="px-3 py-1.5 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-50">Invalid</button>
                          <button onClick={() => resolve(f.id, "ESCALATED")}        disabled={working} className="px-3 py-1.5 text-xs rounded bg-red-900 hover:bg-red-800 text-red-300 disabled:opacity-50">Escalate</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
