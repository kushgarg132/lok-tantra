"use client";

import { useMemo, useState } from "react";
import { LS_HISTORY } from "@/data/elections/intelligence";

type Metric = "seats" | "voteShare";

const PARTY_CONFIG = [
  { key: "INC" as const, shareKey: "incShare" as const, label: "INC / Congress",  color: "#1565C0" },
  { key: "BJP" as const, shareKey: "bjpShare" as const, label: "BJP / Jan Sangh", color: "#FF9933" },
  { key: "Left" as const, shareKey: "leftShare" as const, label: "Left (CPM+CPI)", color: "#B91C1C" },
  { key: "SP"  as const, shareKey: undefined,             label: "SP",             color: "#EF4444" },
] as const;

// SVG chart dimensions
const W = 600, H = 220, PAD_L = 48, PAD_R = 16, PAD_T = 12, PAD_B = 28;
const CW = W - PAD_L - PAD_R;
const CH = H - PAD_T - PAD_B;

export function PartyTracker() {
  const [metric, setMetric] = useState<Metric>("seats");

  const data = useMemo(() => {
    return LS_HISTORY.map((row, i) => ({
      year: row.year,
      INC:   metric === "seats" ? row.INC   : row.incShare,
      BJP:   metric === "seats" ? row.BJP   : row.bjpShare,
      Left:  metric === "seats" ? row.Left  : row.leftShare,
      SP:    metric === "seats" ? row.SP    : 0,
      x: PAD_L + (i / (LS_HISTORY.length - 1)) * CW,
    }));
  }, [metric]);

  const maxY = metric === "seats" ? 450 : 55;

  function toY(val: number) {
    return PAD_T + CH - (val / maxY) * CH;
  }

  function makePath(valueKey: "INC" | "BJP" | "Left" | "SP") {
    return data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${d.x.toFixed(1)} ${toY(d[valueKey]).toFixed(1)}`)
      .join(" ");
  }

  const yTicks = metric === "seats" ? [0, 100, 200, 300, 400] : [0, 10, 20, 30, 40, 50];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
          {(["seats", "voteShare"] as Metric[]).map((m) => (
            <button key={m} onClick={() => setMetric(m)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${metric === m ? "bg-white dark:bg-slate-700 text-saffron-600 shadow-sm" : "text-slate-500"}`}>
              {m === "seats" ? "Seats Won" : "Vote Share %"}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">1952 – 2024 · 18 elections</span>
      </div>

      <div className="card p-6">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-1">
          Party Performance — Historical Trend
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          BJP shown as Jan Sangh (1952–71), Janata Party (1977–80), BJP (1984+)
        </p>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={PAD_L} x2={W - PAD_R} y1={toY(tick)} y2={toY(tick)} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />
              <text x={PAD_L - 6} y={toY(tick) + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{tick}</text>
            </g>
          ))}

          {/* Majority line (seats only) */}
          {metric === "seats" && (
            <>
              <line x1={PAD_L} x2={W - PAD_R} y1={toY(272)} y2={toY(272)} stroke="#ef4444" strokeWidth="0.8" strokeDasharray="4 3" />
              <text x={PAD_L + 4} y={toY(272) - 3} fontSize="8" fill="#ef4444">Majority 272</text>
            </>
          )}

          {/* Party lines */}
          {PARTY_CONFIG.filter(p => p.key !== "SP" || metric === "seats").map((p) => (
            <g key={p.key}>
              <path d={makePath(p.key)} fill="none" stroke={p.color} strokeWidth="2" strokeLinejoin="round" />
              {data.map((d) => (
                <circle key={d.year} cx={d.x} cy={toY(d[p.key])} r={3} fill={p.color}>
                  <title>{d.year}: {d[p.key]}{metric === "voteShare" ? "%" : " seats"}</title>
                </circle>
              ))}
            </g>
          ))}

          {/* X axis labels */}
          {data.map((d) => (
            <text key={d.year} x={d.x} y={H - 2} textAnchor="middle" fontSize="8" fill="#94a3b8">
              {d.year.toString().slice(-2)}
            </text>
          ))}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-3">
          {PARTY_CONFIG.filter(p => p.key !== "SP" || metric === "seats").map((p) => (
            <span key={p.key} className="flex items-center gap-1.5 text-xs">
              <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: p.color }} />
              {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* Seat change table */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">Seat Change vs Previous Election</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 pr-4 text-slate-500 font-semibold uppercase">Year</th>
                <th className="text-right py-2 px-3 text-[#1565C0] font-semibold">INC</th>
                <th className="text-right py-2 px-3 text-[#FF9933] font-semibold">BJP/JS</th>
                <th className="text-right py-2 px-3 text-[#B91C1C] font-semibold">Left</th>
                <th className="text-right py-2 px-3 text-[#EF4444] font-semibold">SP</th>
                <th className="text-right py-2 pl-3 text-slate-500 font-semibold">Turnout</th>
              </tr>
            </thead>
            <tbody>
              {LS_HISTORY.slice().reverse().map((row, i, arr) => {
                const prev = arr[i + 1];
                const delta = (val: number, pval?: number) => {
                  if (!prev || pval === undefined) return null;
                  const d = val - pval;
                  return d;
                };
                return (
                  <tr key={row.year} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 pr-4 font-bold text-slate-700 dark:text-slate-300">{row.year}</td>
                    {[
                      { val: row.INC, prev: prev?.INC, color: "#1565C0" },
                      { val: row.BJP, prev: prev?.BJP, color: "#FF9933" },
                      { val: row.Left, prev: prev?.Left, color: "#B91C1C" },
                      { val: row.SP, prev: prev?.SP, color: "#EF4444" },
                    ].map(({ val, prev: pval, color }, ci) => {
                      const d = delta(val, pval);
                      return (
                        <td key={ci} className="text-right py-2 px-3">
                          <span className="font-semibold" style={{ color }}>{val}</span>
                          {d !== null && d !== 0 && (
                            <span className={`ml-1 text-[9px] ${d > 0 ? "text-emerald-500" : "text-red-400"}`}>
                              {d > 0 ? "+" : ""}{d}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="text-right py-2 pl-3 text-slate-500">{row.turnout}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
