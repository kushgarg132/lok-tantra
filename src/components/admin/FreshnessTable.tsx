"use client";

import type { FreshnessEntry } from "@/lib/observability/freshness";

const STATUS_BADGE: Record<FreshnessEntry["status"], string> = {
  fresh:  "bg-emerald-900/50 text-emerald-400 border border-emerald-700/50",
  aging:  "bg-amber-900/50   text-amber-400   border border-amber-700/50",
  stale:  "bg-red-900/50     text-red-400     border border-red-700/50",
  never:  "bg-slate-800      text-slate-500   border border-slate-700",
};

function fmtAge(h: number | null): string {
  if (h == null) return "never";
  if (h < 1)    return `${Math.round(h * 60)}m`;
  if (h < 24)   return `${Math.round(h)}h`;
  return `${Math.round(h / 24)}d`;
}

interface Props {
  entries: FreshnessEntry[];
}

export default function FreshnessTable({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-6 text-center text-slate-500 text-sm">
        No data sources registered yet.
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => {
    const order = { stale: 0, never: 1, aging: 2, fresh: 3 };
    return (order[a.status] ?? 9) - (order[b.status] ?? 9);
  });

  return (
    <div className="rounded-xl border border-slate-700 overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-xs text-slate-400">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Source</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-right px-4 py-3 font-medium">Age</th>
            <th className="text-right px-4 py-3 font-medium">Fetches</th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Last fetched</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((e, i) => (
            <tr
              key={e.source}
              className={`border-t border-slate-700/50 ${i % 2 === 0 ? "bg-slate-800/10" : ""}`}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-slate-200 text-sm">{e.source}</div>
                <div className="text-xs text-slate-500 truncate max-w-[200px]" title={e.url}>{e.url}</div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_BADGE[e.status]}`}>
                  {e.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-slate-300 text-xs">
                {fmtAge(e.ageHours)}
              </td>
              <td className="px-4 py-3 text-right text-slate-400 text-xs">{e.fetchCount.toLocaleString()}</td>
              <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell">
                {e.lastFetched ? new Date(e.lastFetched).toLocaleString() : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
