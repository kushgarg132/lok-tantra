"use client";

import type { PartyResult, PartyYearRow } from "./ElectionDashboard";

const W = 560, H = 200, PL = 60, PR = 16, PT = 8, PB = 24;

interface Props {
  currentResults: PartyResult[];
  partyHistory: Record<string, PartyYearRow[]>;
  latestYear: number;
}

export function VoteSharePanel({ currentResults, partyHistory, latestYear }: Props) {
  const totalSeats = currentResults.reduce((s, p) => s + p.seats, 0) || 543;
  const maxPct = 50;

  // Derive vote/seat disparity from DB currentResults
  const disparity = currentResults
    .filter((p) => p.voteShare != null && p.seats > 0)
    .map((p) => ({
      party: p.party,
      color: p.color,
      voteShare: p.voteShare ?? 0,
      seatShare: (p.seats / totalSeats) * 100,
    }))
    .sort((a, b) => b.seatShare - a.seatShare);

  // Historical INC / BJP vote share lines from DB
  const incHistory = partyHistory["INC"] ?? [];
  const bjpHistory = partyHistory["BJP"] ?? [];
  const allYears = Array.from(new Set([...incHistory.map(r => r.year), ...bjpHistory.map(r => r.year)])).sort();
  const n = allYears.length;

  const CW = W - PL - PR;
  const CH = H - PT - PB;
  function toY(v: number) { return PT + CH - (v / maxPct) * CH; }
  function toX(year: number) {
    const i = allYears.indexOf(year);
    return PL + (i / Math.max(n - 1, 1)) * CW;
  }

  const incPath = incHistory.map((r, i) => `${i === 0 ? "M" : "L"} ${toX(r.year).toFixed(1)} ${toY(r.voteShare).toFixed(1)}`).join(" ");
  const bjpPath = bjpHistory.map((r, i) => `${i === 0 ? "M" : "L"} ${toX(r.year).toFixed(1)} ${toY(r.voteShare).toFixed(1)}`).join(" ");

  return (
    <div className="space-y-6">
      {/* Vote share vs seat share disparity */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-1">
          Vote Share vs Seat Share — {latestYear}
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          India's First-Past-The-Post system often creates large gaps between votes received and seats won. Positive = over-represented; negative = under-represented.
        </p>

        <div className="space-y-3">
          {disparity.map((p) => {
            const bonus = p.seatShare - p.voteShare;
            return (
              <div key={p.party} className="flex items-center gap-3">
                <div className="w-16 flex items-center gap-1.5 flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{p.party}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 w-16 text-right flex-shrink-0">Votes {p.voteShare.toFixed(1)}%</span>
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
      </div>

      {/* Historical vote share chart */}
      {n > 1 && (
        <div className="card p-6">
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">
            Vote Share Trend — INC & BJP ({allYears[0]}–{allYears[n - 1]})
          </h3>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {[0, 10, 20, 30, 40, 50].map((t) => (
              <g key={t}>
                <line x1={PL} x2={W - PR} y1={toY(t)} y2={toY(t)} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />
                <text x={PL - 4} y={toY(t) + 3} textAnchor="end" fontSize="9" fill="#94a3b8">{t}%</text>
              </g>
            ))}

            {incPath && <>
              <path d={`${incPath} L ${toX(allYears[n-1]).toFixed(1)} ${H - PB} L ${PL} ${H - PB} Z`} fill="#1565C0" opacity="0.08" />
              <path d={incPath} fill="none" stroke="#1565C0" strokeWidth="2" strokeLinejoin="round" />
              {incHistory.map((r) => (
                <circle key={`inc-${r.year}`} cx={toX(r.year)} cy={toY(r.voteShare)} r={3} fill="#1565C0">
                  <title>INC {r.year}: {r.voteShare}%</title>
                </circle>
              ))}
            </>}

            {bjpPath && <>
              <path d={`${bjpPath} L ${toX(allYears[n-1]).toFixed(1)} ${H - PB} L ${PL} ${H - PB} Z`} fill="#FF9933" opacity="0.08" />
              <path d={bjpPath} fill="none" stroke="#FF9933" strokeWidth="2" strokeLinejoin="round" />
              {bjpHistory.map((r) => (
                <circle key={`bjp-${r.year}`} cx={toX(r.year)} cy={toY(r.voteShare)} r={3} fill="#FF9933">
                  <title>BJP {r.year}: {r.voteShare}%</title>
                </circle>
              ))}
            </>}

            {allYears.filter((_, i) => i % 2 === 0).map((year) => (
              <text key={year} x={toX(year)} y={H - 4} textAnchor="middle" fontSize="8" fill="#94a3b8">
                {year.toString().slice(-2)}
              </text>
            ))}
          </svg>
          <div className="flex gap-6 mt-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block bg-[#1565C0]" />INC</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 inline-block bg-[#FF9933]" />BJP / Jan Sangh / Janata</span>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4">
        <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">About First-Past-The-Post (FPTP)</h4>
        <p className="text-xs text-blue-700 dark:text-blue-400">
          India uses FPTP under Art. 81 — the candidate with the most votes in a constituency wins, regardless of whether they get a majority.
          This creates a "seat bonus" for the leading party and a "seat penalty" for parties with spread-out support.
        </p>
      </div>
    </div>
  );
}
