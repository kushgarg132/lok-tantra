"use client";

import { useMemo, useState } from "react";
import { LS_2024_STATES, LS_HISTORY } from "@/data/elections/intelligence";

function turnoutColor(t: number): string {
  if (t >= 80) return "#059669";
  if (t >= 75) return "#10B981";
  if (t >= 70) return "#34D399";
  if (t >= 65) return "#6EE7B7";
  if (t >= 60) return "#FCD34D";
  if (t >= 55) return "#F97316";
  return "#EF4444";
}

function turnoutLabel(t: number): string {
  if (t >= 80) return "Very High";
  if (t >= 70) return "High";
  if (t >= 60) return "Moderate";
  return "Low";
}

// SVG dimensions for the historical chart
const W = 560, H = 180, PL = 36, PR = 12, PT = 8, PB = 24;

export function TurnoutPanel() {
  const [sort, setSort] = useState<"name" | "high" | "low">("high");

  const sorted = useMemo(() => {
    const s = [...LS_2024_STATES];
    if (sort === "name") return s.sort((a, b) => a.state.localeCompare(b.state));
    if (sort === "high") return s.sort((a, b) => b.turnout - a.turnout);
    return s.sort((a, b) => a.turnout - b.turnout);
  }, [sort]);

  const nationalAvg = (LS_2024_STATES.reduce((s, x) => s + x.turnout, 0) / LS_2024_STATES.length).toFixed(1);

  // Historical trend chart
  const CW = W - PL - PR;
  const CH = H - PT - PB;
  const maxT = 70; // y-axis max %
  const minT = 40;
  const range = maxT - minT;

  function toY(t: number) { return PT + CH - ((t - minT) / range) * CH; }

  const historicalPath = LS_HISTORY.map((r, i) =>
    `${i === 0 ? "M" : "L"} ${(PL + (i / (LS_HISTORY.length - 1)) * CW).toFixed(1)} ${toY(r.turnout).toFixed(1)}`
  ).join(" ");

  const yTicks = [45, 50, 55, 60, 65, 70];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <div className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">65.8%</div>
          <div className="text-xs text-slate-500 mt-1">National Average 2024</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-2xl font-display font-bold text-emerald-600">
            {sorted.reduce((max, s) => s.turnout > max.turnout ? s : max).state.split(" ")[0]}
          </div>
          <div className="text-xs text-slate-500 mt-1">Highest turnout state</div>
          <div className="text-xs font-bold text-emerald-600">{sorted.reduce((max, s) => s.turnout > max.turnout ? s : max).turnout}%</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-2xl font-display font-bold text-red-500">
            {sorted.reduce((min, s) => s.turnout < min.turnout ? s : min).state.split(" ")[0]}
          </div>
          <div className="text-xs text-slate-500 mt-1">Lowest turnout state</div>
          <div className="text-xs font-bold text-red-500">{sorted.reduce((min, s) => s.turnout < min.turnout ? s : min).turnout}%</div>
        </div>
      </div>

      {/* State heatmap grid */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">Voter Turnout Heatmap — 2024</h3>
          <div className="flex gap-1">
            {(["high", "low", "name"] as const).map((s) => (
              <button key={s} onClick={() => setSort(s)}
                className={`px-2 py-0.5 text-[10px] rounded font-medium ${sort === s ? "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-400" : "text-slate-400 hover:text-slate-600"}`}>
                {s === "name" ? "A–Z" : s === "high" ? "↑ High" : "↓ Low"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
          {sorted.map((s) => (
            <div
              key={s.code}
              className="rounded-lg p-2 text-center cursor-default transition-transform hover:scale-105"
              style={{ backgroundColor: turnoutColor(s.turnout) }}
              title={`${s.state}: ${s.turnout}%`}
            >
              <div className="text-[10px] font-bold text-white drop-shadow-sm">{s.code}</div>
              <div className="text-[11px] font-extrabold text-white drop-shadow-sm">{s.turnout}%</div>
              <div className="text-[8px] text-white/80">{s.seats}s</div>
            </div>
          ))}
        </div>

        {/* Color scale legend */}
        <div className="flex items-center gap-1 mt-4 flex-wrap">
          <span className="text-xs text-slate-400 mr-1">Turnout:</span>
          {[
            { label: "<55%", color: "#EF4444" },
            { label: "55-60%", color: "#F97316" },
            { label: "60-65%", color: "#FCD34D" },
            { label: "65-70%", color: "#6EE7B7" },
            { label: "70-75%", color: "#34D399" },
            { label: "75-80%", color: "#10B981" },
            { label: ">80%", color: "#059669" },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-0.5 text-[10px]">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* Historical turnout line chart */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">
          National Turnout Trend — 1952 to 2024
        </h3>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={PL} x2={W - PR} y1={toY(t)} y2={toY(t)} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />
              <text x={PL - 4} y={toY(t) + 3} textAnchor="end" fontSize="9" fill="#94a3b8">{t}%</text>
            </g>
          ))}
          {/* Area fill */}
          <path
            d={`${historicalPath} L ${(PL + CW).toFixed(1)} ${H - PB} L ${PL} ${H - PB} Z`}
            fill="#FF9933" opacity="0.12"
          />
          <path d={historicalPath} fill="none" stroke="#FF9933" strokeWidth="2" strokeLinejoin="round" />
          {LS_HISTORY.map((r, i) => (
            <circle key={r.year}
              cx={PL + (i / (LS_HISTORY.length - 1)) * CW}
              cy={toY(r.turnout)} r={3.5} fill="#FF9933">
              <title>{r.year}: {r.turnout}%</title>
            </circle>
          ))}
          {/* X labels */}
          {LS_HISTORY.filter((_, i) => i % 2 === 0).map((r) => {
            const i = LS_HISTORY.indexOf(r);
            return (
              <text key={r.year} x={PL + (i / (LS_HISTORY.length - 1)) * CW} y={H - 4} textAnchor="middle" fontSize="8" fill="#94a3b8">
                {r.year.toString().slice(-2)}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
