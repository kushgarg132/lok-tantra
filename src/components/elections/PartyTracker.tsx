"use client";

import { useMemo, useState } from "react";
import type { PartyYearRow, ElectionHistoryItem } from "./ElectionDashboard";

type Metric = "seats" | "voteShare";

const PARTY_CONFIG = [
  { key: "INC",  label: "INC / Congress",  color: "#1565C0" },
  { key: "BJP",  label: "BJP / Jan Sangh", color: "#FF9933" },
  { key: "Left", label: "Left (CPM+CPI)",  color: "#B91C1C" },
  { key: "SP",   label: "SP",              color: "#EF4444" },
] as const;

const W = 600, H = 220, PAD_L = 48, PAD_R = 16, PAD_T = 12, PAD_B = 28;
const CW = W - PAD_L - PAD_R;
const CH = H - PAD_T - PAD_B;

interface Props {
  partyHistory: Record<string, PartyYearRow[]>;
  electionHistory: ElectionHistoryItem[];
}

export function PartyTracker({ partyHistory, electionHistory }: Props) {
  const [metric, setMetric] = useState<Metric>("seats");

  // Merge all years across parties
  const allYears = useMemo(() => {
    const years = new Set<number>();
    Object.values(partyHistory).forEach((rows) => rows.forEach((r) => years.add(r.year)));
    electionHistory.forEach((h) => years.add(h.year));
    return Array.from(years).sort();
  }, [partyHistory, electionHistory]);

  const n = allYears.length;

  function toX(year: number) { return PAD_L + (allYears.indexOf(year) / Math.max(n - 1, 1)) * CW; }
  function toY(val: number, maxY: number) { return PAD_T + CH - (val / maxY) * CH; }

  const maxY = metric === "seats" ? 450 : 55;

  function makePath(party: string) {
    const rows = partyHistory[party] ?? [];
    return rows.map((r, i) =>
      `${i === 0 ? "M" : "L"} ${toX(r.year).toFixed(1)} ${toY(metric === "seats" ? r.seats : r.voteShare, maxY).toFixed(1)}`
    ).join(" ");
  }

  const yTicks = metric === "seats" ? [0, 100, 200, 300, 400] : [0, 10, 20, 30, 40, 50];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex gap-1 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
          {(["seats", "voteShare"] as Metric[]).map((m) => (
            <button key={m} onClick={() => setMetric(m)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${metric === m ? "bg-white dark:bg-slate-700 text-saffron-600 shadow-sm" : "text-slate-500"}`}>
              {m === "seats" ? "Seats Won" : "Vote Share %"}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">{allYears[0]} – {allYears[n - 1]} · {n} elections</span>
      </div>

      <div className="card p-6">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-1">Party Performance — Historical Trend</h3>
        <p className="text-xs text-slate-400 mb-4">BJP shown as Jan Sangh (1952–71), Janata Party (1977–80), BJP (1984+)</p>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={PAD_L} x2={W - PAD_R} y1={toY(tick, maxY)} y2={toY(tick, maxY)} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />
              <text x={PAD_L - 6} y={toY(tick, maxY) + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{tick}</text>
            </g>
          ))}
          {metric === "seats" && (
            <>
              <line x1={PAD_L} x2={W - PAD_R} y1={toY(272, maxY)} y2={toY(272, maxY)} stroke="#ef4444" strokeWidth="0.8" strokeDasharray="4 3" />
              <text x={PAD_L + 4} y={toY(272, maxY) - 3} fontSize="8" fill="#ef4444">Majority 272</text>
            </>
          )}
          {PARTY_CONFIG.filter((p) => p.key !== "SP" || metric === "seats").map((p) => {
            const path = makePath(p.key);
            if (!path) return null;
            const rows = partyHistory[p.key] ?? [];
            return (
              <g key={p.key}>
                <path d={path} fill="none" stroke={p.color} strokeWidth="2" strokeLinejoin="round" />
                {rows.map((r) => (
                  <circle key={r.year} cx={toX(r.year)} cy={toY(metric === "seats" ? r.seats : r.voteShare, maxY)} r={3} fill={p.color}>
                    <title>{r.year}: {metric === "seats" ? r.seats + " seats" : r.voteShare + "%"}</title>
                  </circle>
                ))}
              </g>
            );
          })}
          {allYears.map((year) => (
            <text key={year} x={toX(year)} y={H - 2} textAnchor="middle" fontSize="8" fill="#94a3b8">
              {year.toString().slice(-2)}
            </text>
          ))}
        </svg>

        <div className="flex flex-wrap gap-4 mt-3">
          {PARTY_CONFIG.filter((p) => p.key !== "SP" || metric === "seats").map((p) => (
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
                {PARTY_CONFIG.map((p) => (
                  <th key={p.key} className="text-right py-2 px-3 font-semibold" style={{ color: p.color }}>{p.key}</th>
                ))}
                <th className="text-right py-2 pl-3 text-slate-500 font-semibold">Turnout</th>
              </tr>
            </thead>
            <tbody>
              {[...allYears].reverse().map((year, i, arr) => {
                const prevYear = arr[i + 1];
                const h = electionHistory.find((e) => e.year === year);
                return (
                  <tr key={year} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 pr-4 font-bold text-slate-700 dark:text-slate-300">{year}</td>
                    {PARTY_CONFIG.map((p) => {
                      const curr = partyHistory[p.key]?.find((r) => r.year === year);
                      const prev = prevYear ? partyHistory[p.key]?.find((r) => r.year === prevYear) : undefined;
                      const val = curr?.seats ?? 0;
                      const d = prev ? val - (prev.seats ?? 0) : null;
                      return (
                        <td key={p.key} className="text-right py-2 px-3">
                          <span className="font-semibold" style={{ color: p.color }}>{val}</span>
                          {d !== null && d !== 0 && (
                            <span className={`ml-1 text-[9px] ${d > 0 ? "text-emerald-500" : "text-red-400"}`}>
                              {d > 0 ? "+" : ""}{d}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="text-right py-2 pl-3 text-slate-500">{h?.turnout ?? "—"}%</td>
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
