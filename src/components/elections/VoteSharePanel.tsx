"use client";

import { useMemo } from "react";
import { VOTE_SEAT_DISPARITY_2024, LS_HISTORY } from "@/data/elections/intelligence";

// Chart dimensions
const W = 560, H = 200, PL = 60, PR = 16, PT = 8, PB = 24;

export function VoteSharePanel() {
  const maxPct = 50;

  // Historical vote share for INC and BJP
  const CW = W - PL - PR;
  const CH = H - PT - PB;
  function toY(v: number) { return PT + CH - (v / maxPct) * CH; }

  const incPath = LS_HISTORY.map((r, i) =>
    `${i === 0 ? "M" : "L"} ${(PL + (i / (LS_HISTORY.length - 1)) * CW).toFixed(1)} ${toY(r.incShare).toFixed(1)}`
  ).join(" ");
  const bjpPath = LS_HISTORY.map((r, i) =>
    `${i === 0 ? "M" : "L"} ${(PL + (i / (LS_HISTORY.length - 1)) * CW).toFixed(1)} ${toY(r.bjpShare).toFixed(1)}`
  ).join(" ");
  const yTicks = [0, 10, 20, 30, 40, 50];

  return (
    <div className="space-y-6">
      {/* Vote share vs seat share — 2024 disparity */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-1">
          Vote Share vs Seat Share — 2024
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          India's First-Past-The-Post system often creates large gaps between votes received and seats won. Bars above 0% = over-representation; below = under-representation.
        </p>

        <div className="space-y-3">
          {VOTE_SEAT_DISPARITY_2024.map((p) => {
            const bonus = p.seatShare - p.voteShare;
            return (
              <div key={p.party} className="flex items-center gap-3">
                <div className="w-16 flex items-center gap-1.5 flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{p.party}</span>
                </div>

                {/* Dual bars: vote share (solid) and seat share (striped) */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 w-16 text-right flex-shrink-0">Votes {p.voteShare}%</span>
                    <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(p.voteShare / 45) * 100}%`, backgroundColor: p.color, opacity: 0.6 }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 w-16 text-right flex-shrink-0">Seats {p.seatShare.toFixed(1)}%</span>
                    <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(p.seatShare / 45) * 100}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                </div>

                <div className={`text-xs font-bold flex-shrink-0 w-12 text-right ${bonus > 0 ? "text-emerald-600 dark:text-emerald-400" : bonus < 0 ? "text-red-500" : "text-slate-400"}`}>
                  {bonus > 0 ? "+" : ""}{bonus.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-slate-400 mt-4">
          Seat bonus/penalty = Seat% − Vote%. In 2024, BJP won 36.6% votes but 44.2% seats (+7.6%). SP won 6.8% votes and 6.8% seats (proportional due to regional concentration).
        </p>
      </div>

      {/* Historical vote share chart */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">
          Vote Share Trend — INC & BJP (1952–2024)
        </h3>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={PL} x2={W - PR} y1={toY(t)} y2={toY(t)} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />
              <text x={PL - 4} y={toY(t) + 3} textAnchor="end" fontSize="9" fill="#94a3b8">{t}%</text>
            </g>
          ))}

          {/* INC area */}
          <path
            d={`${incPath} L ${(PL + CW).toFixed(1)} ${H - PB} L ${PL} ${H - PB} Z`}
            fill="#1565C0" opacity="0.08"
          />
          <path d={incPath} fill="none" stroke="#1565C0" strokeWidth="2" strokeLinejoin="round" />
          {LS_HISTORY.map((r, i) => (
            <circle key={`inc-${r.year}`} cx={PL + (i / (LS_HISTORY.length - 1)) * CW} cy={toY(r.incShare)} r={3} fill="#1565C0">
              <title>INC {r.year}: {r.incShare}%</title>
            </circle>
          ))}

          {/* BJP area */}
          <path
            d={`${bjpPath} L ${(PL + CW).toFixed(1)} ${H - PB} L ${PL} ${H - PB} Z`}
            fill="#FF9933" opacity="0.08"
          />
          <path d={bjpPath} fill="none" stroke="#FF9933" strokeWidth="2" strokeLinejoin="round" />
          {LS_HISTORY.map((r, i) => (
            <circle key={`bjp-${r.year}`} cx={PL + (i / (LS_HISTORY.length - 1)) * CW} cy={toY(r.bjpShare)} r={3} fill="#FF9933">
              <title>BJP {r.year}: {r.bjpShare}%</title>
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

        <div className="flex gap-6 mt-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block bg-[#1565C0]" />INC</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block bg-[#FF9933]" />BJP / Jan Sangh / Janata</span>
        </div>
      </div>

      {/* FPTP explainer */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4">
        <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">About First-Past-The-Post (FPTP)</h4>
        <p className="text-xs text-blue-700 dark:text-blue-400">
          India uses FPTP under [Art. 81] — the candidate with the most votes in a constituency wins, regardless of whether they get a majority.
          This creates a "seat bonus" for the leading party and a "seat penalty" for parties with spread-out support.
          In 2019, BJP won 37.4% of votes but 55.8% of seats — the largest bonus in Indian electoral history.
        </p>
      </div>
    </div>
  );
}
