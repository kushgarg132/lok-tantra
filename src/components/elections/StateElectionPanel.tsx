"use client";

import { useState } from "react";
import type { AssemblyElection } from "./ElectionDashboard";

interface Props {
  assemblyElections: AssemblyElection[];
}

export function StateElectionPanel({ assemblyElections }: Props) {
  const years = ["all", ...Array.from(new Set(assemblyElections.map((e) => String(e.year))))].sort((a, b) =>
    a === "all" ? -1 : b === "all" ? 1 : Number(b) - Number(a)
  ) as string[];
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = yearFilter === "all" ? assemblyElections : assemblyElections.filter((e) => String(e.year) === yearFilter);
  const sorted = [...filtered].sort((a, b) => b.year - a.year || b.totalSeats - a.totalSeats);
  const sel = selected ? assemblyElections.find((e) => `${e.state}-${e.year}` === selected) : null;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">
            State Assembly Elections ({years.filter((y) => y !== "all").at(-1)}–{years.filter((y) => y !== "all")[0]})
          </h3>
          <div className="flex gap-1 flex-wrap">
            {years.map((y) => (
              <button key={y} onClick={() => setYearFilter(y)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${yearFilter === y ? "bg-saffron-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700"}`}>
                {y === "all" ? "All" : y}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((e) => {
            const key = `${e.state}-${e.year}`;
            const isSelected = selected === key;
            const winPct = ((e.winnerSeats / e.totalSeats) * 100).toFixed(0);
            return (
              <button
                key={key}
                onClick={() => setSelected(isSelected ? null : key)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected ? "border-saffron-400 bg-saffron-50 dark:bg-saffron-900/10" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{e.state}</div>
                    <div className="text-xs text-slate-400">{e.year} · {e.totalSeats} seats</div>
                  </div>
                  <div className="text-[10px] px-2 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: e.winnerColor }}>
                    {e.winner}
                  </div>
                </div>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                  <div className="h-full rounded-full" style={{ width: `${winPct}%`, backgroundColor: e.winnerColor }} />
                  <div className="h-full flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
                  <span style={{ color: e.winnerColor }} className="font-semibold">{e.winnerSeats} / {e.totalSeats} seats ({winPct}%)</span>
                  <span>{e.turnout}% turnout</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {sel && (
        <div className="card p-6 border-l-4" style={{ borderColor: sel.winnerColor }}>
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">
            {sel.state} Assembly — {sel.year}
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <div className="text-xs text-slate-400 mb-1">Winner</div>
              <div className="text-lg font-bold" style={{ color: sel.winnerColor }}>{sel.winner}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{sel.winnerSeats} seats</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Runner-Up</div>
              <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{sel.runnerUp}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{sel.runnerUpSeats} seats</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Majority needed</div>
              <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{Math.ceil(sel.totalSeats / 2) + 1}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Margin: {sel.winnerSeats - Math.ceil(sel.totalSeats / 2) - 1} seats
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-8 rounded-lg overflow-hidden flex">
              <div style={{ width: `${(sel.winnerSeats / sel.totalSeats) * 100}%`, backgroundColor: sel.winnerColor }}
                className="flex items-center px-2">
                <span className="text-[10px] font-bold text-white">{sel.winner} {sel.winnerSeats}</span>
              </div>
              <div style={{ width: `${(sel.runnerUpSeats / sel.totalSeats) * 100}%` }}
                className="bg-slate-300 dark:bg-slate-600 flex items-center px-1">
                <span className="text-[9px] font-semibold text-slate-700 dark:text-slate-300">{sel.runnerUp} {sel.runnerUpSeats}</span>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="relative h-4">
              <div className="absolute top-0 w-px h-4 bg-red-400"
                style={{ left: `${(Math.ceil(sel.totalSeats / 2) / sel.totalSeats) * 100}%` }} />
              <span className="absolute text-[9px] text-red-400 -translate-x-1/2 top-1"
                style={{ left: `${(Math.ceil(sel.totalSeats / 2) / sel.totalSeats) * 100}%` }}>
                Majority
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 mt-3">
            Voter turnout: <strong className="text-slate-600 dark:text-slate-300">{sel.turnout}%</strong>
          </div>
        </div>
      )}

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
        <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">Key Trends (2022–2024)</h4>
        <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
          <li>BJP won 9 out of 19 state elections shown, including MP, Rajasthan, CG sweeps (2023).</li>
          <li>Congress rebounded in Karnataka (2023), Telangana (2023), Himachal (2022), and J&K (2024).</li>
          <li>JMM retained Jharkhand (2024) — second consecutive win for tribal-led alliance.</li>
          <li>AAP&apos;s massive Punjab win (92/117 seats, 2022) signalled emergence as third national force.</li>
          <li>TDP&apos;s landslide in Andhra (135/175, 2024) ended YSRCP&apos;s one-term dominance.</li>
        </ul>
      </div>
    </div>
  );
}
