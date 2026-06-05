"use client";

import { useMemo, useState } from "react";
import { PARLIAMENT_2024, LS_2024_STATES } from "@/data/elections/intelligence";

// Rows: inner → outer; seats count pre-computed for R_MIN=75, R_STEP=22, 9 rows
const SEATS_PER_ROW = [28, 36, 44, 52, 60, 69, 77, 85, 92];
const R_MIN = 75, R_STEP = 22, CX = 280, CY = 285;

function generateParliamentDots(parties: typeof PARLIAMENT_2024) {
  // Generate all positions
  const positions: { x: number; y: number }[] = [];
  for (let row = 0; row < SEATS_PER_ROW.length; row++) {
    const r = R_MIN + row * R_STEP;
    const n = SEATS_PER_ROW[row];
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const angle = Math.PI * (1 - t); // π (left) → 0 (right)
      positions.push({ x: CX + r * Math.cos(angle), y: CY - r * Math.sin(angle) });
    }
  }

  // Sort left→right (x ascending), within same x sort top→bottom (y ascending)
  positions.sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);

  // Assign party colors in order
  const dots: { x: number; y: number; color: string; party: string }[] = [];
  let idx = 0;
  for (const p of parties) {
    for (let s = 0; s < p.seats; s++) {
      const pos = positions[idx++];
      if (pos) dots.push({ ...pos, color: p.color, party: p.party });
    }
  }
  return dots;
}

export function LokSabhaMap() {
  const [view, setView] = useState<"parliament" | "states">("parliament");
  const dots = useMemo(() => generateParliamentDots(PARLIAMENT_2024), []);

  const totalSeats = 543;
  const ndaSeats = PARLIAMENT_2024.filter(p => p.alliance === "NDA").reduce((s, p) => s + p.seats, 0);
  const indiaSeats = PARLIAMENT_2024.filter(p => p.alliance === "INDIA").reduce((s, p) => s + p.seats, 0);

  return (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex gap-2">
        {(["parliament", "states"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${view === v ? "bg-saffron-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
            {v === "parliament" ? "Parliament Diagram" : "State Results"}
          </button>
        ))}
      </div>

      {view === "parliament" ? (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">18th Lok Sabha — 543 Seats</h3>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]" /><b>NDA {ndaSeats}</b></span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1565C0]" /><b>INDIA {indiaSeats}</b></span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]" /><b>Others 16</b></span>
            </div>
          </div>

          <svg viewBox="0 0 560 295" className="w-full max-w-2xl mx-auto">
            {/* Majority line */}
            <line x1="280" y1="30" x2="280" y2="285" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
            <text x="284" y="44" fontSize="9" fill="#94a3b8">Majority 272</text>

            {/* Dots */}
            {dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={3.8} fill={d.color} opacity={0.9}>
                <title>{d.party}</title>
              </circle>
            ))}
          </svg>

          {/* Party legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px]">
            {PARLIAMENT_2024.filter(p => p.seats >= 5).map(p => (
              <span key={p.party} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
                {p.abbr} {p.seats}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <StateResultsGrid />
      )}
    </div>
  );
}

function StateResultsGrid() {
  const sorted = [...LS_2024_STATES].sort((a, b) => b.seats - a.seats);

  return (
    <div className="card p-6 space-y-4">
      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">State-wise 2024 Results</h3>

      <div className="space-y-2">
        {sorted.map((s) => {
          const ndaPct = (s.ndaSeats / s.seats) * 100;
          const indiaPct = (s.indiaSeats / s.seats) * 100;
          const otherPct = (s.otherSeats / s.seats) * 100;
          return (
            <div key={s.code} className="flex items-center gap-3">
              <div className="w-32 text-xs text-slate-700 dark:text-slate-300 truncate flex-shrink-0">{s.state}</div>
              <div className="flex-1 h-6 rounded-lg overflow-hidden flex bg-slate-100 dark:bg-slate-800">
                {s.ndaSeats > 0 && <div style={{ width: `${ndaPct}%`, backgroundColor: "#FF9933" }} className="h-full flex items-center justify-center">
                  {s.ndaSeats >= 4 && <span className="text-[9px] font-bold text-white">{s.ndaSeats}</span>}
                </div>}
                {s.indiaSeats > 0 && <div style={{ width: `${indiaPct}%`, backgroundColor: "#1565C0" }} className="h-full flex items-center justify-center">
                  {s.indiaSeats >= 4 && <span className="text-[9px] font-bold text-white">{s.indiaSeats}</span>}
                </div>}
                {s.otherSeats > 0 && <div style={{ width: `${otherPct}%`, backgroundColor: "#64748B" }} className="h-full" />}
              </div>
              <div className="w-6 text-xs font-bold text-slate-700 dark:text-slate-300 text-right flex-shrink-0">{s.seats}</div>
              <div className="w-10 text-[10px] text-slate-400 text-right flex-shrink-0">{s.turnout}%</div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#FF9933]" /> NDA</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#1565C0]" /> INDIA</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#64748B]" /> Others</span>
        <span className="ml-auto">Seats | Turnout</span>
      </div>
    </div>
  );
}
