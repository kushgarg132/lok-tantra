"use client";

import { useState } from "react";
import type { BureaucraticLevelDB } from "./BureaucracyDashboard";

const LEVEL_COLORS = [
  { bg: "bg-amber-100 dark:bg-amber-900/30",   text: "text-amber-700 dark:text-amber-300",   border: "border-l-amber-500" },
  { bg: "bg-rose-100 dark:bg-rose-900/30",     text: "text-rose-700 dark:text-rose-300",     border: "border-l-rose-500" },
  { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-l-purple-500" },
  { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-300", border: "border-l-violet-500" },
  { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300", border: "border-l-indigo-400" },
  { bg: "bg-blue-100 dark:bg-blue-900/30",     text: "text-blue-700 dark:text-blue-300",     border: "border-l-blue-400" },
  { bg: "bg-slate-100 dark:bg-slate-800",      text: "text-slate-600 dark:text-slate-300",   border: "border-l-slate-300" },
  { bg: "bg-slate-200 dark:bg-slate-700",      text: "text-slate-600 dark:text-slate-300",   border: "border-l-slate-400" },
];

// Pyramid widths: index 0 = top (narrowest), last = bottom (widest)
const PYRAMID_WIDTHS = [12, 24, 36, 48, 60, 72, 84, 100];

interface Props { levels: BureaucraticLevelDB[] }

export function IASHierarchyPanel({ levels }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<"pyramid" | "table">("pyramid");

  const sorted = [...levels].sort((a, b) => a.level - b.level);

  if (sorted.length === 0) {
    return (
      <div className="card p-8 text-center text-slate-400 text-sm">
        No hierarchy data available. Run <code className="font-mono text-xs">npm run db:seed</code> to populate.
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <div className="text-2xl font-display font-bold text-amber-600">{sorted.length}</div>
          <div className="text-xs text-slate-500 mt-1">Hierarchy levels</div>
          <div className="text-[10px] text-slate-400">Central Secretariat</div>
        </div>
      </div>

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
          <div className="card p-6">
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">
              Central Secretariat Hierarchy (Senior → Junior)
            </h3>
            <div className="space-y-2">
              {sorted.map((level, i) => {
                const colors = LEVEL_COLORS[i % LEVEL_COLORS.length];
                const width = PYRAMID_WIDTHS[i] ?? 100;
                const isSelected = selected === level.id;
                return (
                  <div key={level.id}>
                    <button
                      onClick={() => setSelected(isSelected ? null : level.id)}
                      className="w-full flex justify-center"
                    >
                      <div
                        className={`flex items-center gap-3 px-4 rounded-lg transition-all border-l-4 ${colors.bg} ${colors.border} ${isSelected ? "ring-2 ring-saffron-400" : "hover:opacity-90"}`}
                        style={{ width: `${width}%`, minWidth: 200, height: 44 }}
                      >
                        <span className={`text-xs font-bold ${colors.text} shrink-0`}>L{level.level}</span>
                        <span className="text-xs text-slate-700 dark:text-slate-300 truncate font-medium">{level.title}</span>
                      </div>
                    </button>
                    {isSelected && (
                      <div className={`mt-1 mx-auto card p-4 border-l-4 ${colors.border} ${colors.bg} max-w-2xl`}>
                        <div className={`text-sm font-bold ${colors.text}`}>{level.title}</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{level.description}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Level</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Title</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Description</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((level, i) => {
                  const colors = LEVEL_COLORS[i % LEVEL_COLORS.length];
                  return (
                    <tr key={level.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>L{level.level}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-xs text-slate-900 dark:text-slate-100">{level.title}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 hidden md:table-cell">{level.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
        <div className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">IAS — Two tracks, one career</div>
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          IAS officers alternate between <strong>field postings</strong> (SDM → ADM → Collector → Commissioner) and <strong>secretariat postings</strong> (Deputy Secretary → Director → Joint Secretary → Secretary at Centre or Chief Secretary at State). The same officer might manage 2 million people as a District Collector one year, and draft national policy as Joint Secretary the next.
        </p>
      </div>
    </div>
  );
}
