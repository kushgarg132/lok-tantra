"use client";

import { useState } from "react";
import { IAS_RANKS } from "@/data/bureaucracy/intelligence";

const RANK_COLORS = [
  { bg: "bg-slate-200 dark:bg-slate-700",     text: "text-slate-600 dark:text-slate-300",   border: "border-l-slate-400" },
  { bg: "bg-slate-100 dark:bg-slate-800",     text: "text-slate-600 dark:text-slate-300",   border: "border-l-slate-300" },
  { bg: "bg-blue-100 dark:bg-blue-900/30",    text: "text-blue-700 dark:text-blue-300",     border: "border-l-blue-400" },
  { bg: "bg-indigo-100 dark:bg-indigo-900/30",text: "text-indigo-700 dark:text-indigo-300", border: "border-l-indigo-400" },
  { bg: "bg-violet-100 dark:bg-violet-900/30",text: "text-violet-700 dark:text-violet-300", border: "border-l-violet-500" },
  { bg: "bg-purple-100 dark:bg-purple-900/30",text: "text-purple-700 dark:text-purple-300", border: "border-l-purple-500" },
  { bg: "bg-rose-100 dark:bg-rose-900/30",    text: "text-rose-700 dark:text-rose-300",     border: "border-l-rose-500" },
  { bg: "bg-amber-100 dark:bg-amber-900/30",  text: "text-amber-700 dark:text-amber-300",   border: "border-l-amber-500" },
];

// Pyramid widths from bottom (most junior) to top (most senior) — reversed display
const PYRAMID_WIDTHS = [100, 90, 82, 72, 60, 48, 32, 12];

export function IASHierarchyPanel() {
  const [selected, setSelected] = useState<number | null>(null);
  const [view, setView] = useState<"pyramid" | "table">("pyramid");

  const reversed = [...IAS_RANKS].reverse();

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <div className="text-2xl font-display font-bold text-blue-700 dark:text-blue-300">~5,000</div>
          <div className="text-xs text-slate-500 mt-1">IAS Officers</div>
          <div className="text-[10px] text-slate-400">1:28,000 population ratio</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">~180</div>
          <div className="text-xs text-slate-500 mt-1">Annual intake</div>
          <div className="text-[10px] text-slate-400">via UPSC Civil Services</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-2xl font-display font-bold text-amber-600">1</div>
          <div className="text-xs text-slate-500 mt-1">Cabinet Secretary</div>
          <div className="text-[10px] text-slate-400">₹2,50,000 fixed pay</div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {(["pyramid", "table"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 text-xs rounded-lg font-medium transition-colors ${view === v ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700"}`}>
            {v === "pyramid" ? "🔺 Pyramid View" : "📋 Table View"}
          </button>
        ))}
      </div>

      {view === "pyramid" ? (
        <div className="space-y-4">
          {/* Pyramid */}
          <div className="card p-6">
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">IAS Rank Pyramid (Top → Junior)</h3>
            <div className="space-y-2">
              {reversed.map((rank, i) => {
                const originalIdx = IAS_RANKS.length - 1 - i;
                const colors = RANK_COLORS[originalIdx] || RANK_COLORS[0];
                const width = PYRAMID_WIDTHS[i];
                const isSelected = selected === rank.level;
                return (
                  <div key={rank.level}>
                    <button
                      onClick={() => setSelected(isSelected ? null : rank.level)}
                      className="w-full flex justify-center"
                    >
                      <div
                        className={`flex items-center gap-3 px-4 rounded-lg transition-all border-l-4 ${colors.bg} ${colors.border} ${isSelected ? "ring-2 ring-saffron-400" : "hover:opacity-90"}`}
                        style={{ width: `${width}%`, minWidth: 200, height: 44 }}
                      >
                        <span className={`text-xs font-bold ${colors.text}`}>{rank.abbr}</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block truncate">{rank.rank}</span>
                        <span className="ml-auto text-[10px] text-slate-400">{rank.yearsRange}</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected detail */}
          {selected && (() => {
            const rank = IAS_RANKS.find((r) => r.level === selected)!;
            const colors = RANK_COLORS[rank.level - 1];
            return (
              <div className={`card p-6 border-l-4 ${colors.border} ${colors.bg}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className={`font-display font-bold text-base ${colors.text}`}>{rank.rank}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">{rank.yearsRange}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">{rank.payLevel}</div>
                    <div className="text-[10px] text-slate-400">{rank.payRange}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 leading-relaxed">{rank.role}</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Typical Postings</div>
                    {rank.typicalPostings.map((p) => (
                      <div key={p} className="flex gap-1.5 items-start text-xs text-slate-600 dark:text-slate-400 mb-1">
                        <span className={`mt-0.5 shrink-0 ${colors.text}`}>•</span> {p}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Powers & Functions</div>
                    {rank.powers.slice(0, 4).map((p) => (
                      <div key={p} className="flex gap-1.5 items-start text-xs text-slate-600 dark:text-slate-400 mb-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`${colors.text} shrink-0 mt-0.5`}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        /* Table view */
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Rank</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Pay Level</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Years in Service</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Typical Posting</th>
                </tr>
              </thead>
              <tbody>
                {IAS_RANKS.map((rank, i) => {
                  const colors = RANK_COLORS[i];
                  return (
                    <tr key={rank.level} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${colors.bg} border ${colors.border.replace("border-l-", "border-")}`} />
                          <span className="font-medium text-slate-900 dark:text-slate-100 text-xs">{rank.abbr}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">{rank.rank}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono text-xs text-slate-700 dark:text-slate-300">{rank.payLevel}</div>
                        <div className="text-[10px] text-slate-400">{rank.payRange}</div>
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-500 hidden md:table-cell">{rank.yearsRange}</td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">{rank.typicalPostings[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Career path note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
        <div className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">IAS — Two tracks, one career</div>
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          IAS officers alternate between <strong>field postings</strong> (SDM → ADM → Collector → Commissioner) and <strong>secretariat postings</strong> (Deputy Secretary → Director → Joint Secretary → Secretary → Additional Chief Secretary → Chief Secretary at state; or Joint Secretary → Additional Secretary → Secretary at Centre).
          The same officer might be a District Collector managing 2 million people one year, and drafting national policy as a Joint Secretary in North Block the next. This generalist mobility is the hallmark of the IAS and also its most debated feature.
        </p>
      </div>
    </div>
  );
}
