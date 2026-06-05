"use client";

import { useState } from "react";
import { IPS_RANKS, IFS_RANKS } from "@/data/bureaucracy/intelligence";

const RANK_COLORS_IPS = [
  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-400",
  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-400",
  "bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-200 border-red-500",
  "bg-rose-200 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200 border-rose-500",
  "bg-red-300 text-red-900 dark:bg-red-800/60 dark:text-red-100 border-red-600",
  "bg-red-400 text-white dark:bg-red-700 dark:text-white border-red-700",
];

const IFS_COLORS = [
  "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  "bg-teal-200 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  "bg-cyan-200 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200",
  "bg-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  "bg-blue-400 text-white dark:bg-blue-700 dark:text-white",
];

export function IPSHierarchyPanel() {
  const [service, setService] = useState<"ips" | "ifs">("ips");
  const [selected, setSelected] = useState<number | null>(null);

  const ranks = service === "ips" ? IPS_RANKS : IFS_RANKS;
  const colors = service === "ips" ? RANK_COLORS_IPS : IFS_COLORS;
  const reversed = [...ranks].reverse();
  const PYRAMID_WIDTHS = ranks.map((_, i) => Math.round(100 - (i * (100 / (ranks.length + 1)))));

  return (
    <div className="space-y-6">
      {/* Service toggle */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { setService("ips"); setSelected(null); }}
          className={`px-4 py-2 text-xs rounded-lg font-medium transition-colors ${service === "ips" ? "bg-red-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
          🚔 IPS — Police Service
        </button>
        <button onClick={() => { setService("ifs"); setSelected(null); }}
          className={`px-4 py-2 text-xs rounded-lg font-medium transition-colors ${service === "ifs" ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
          🌐 IFS — Foreign Service
        </button>
      </div>

      {/* Stats */}
      {service === "ips" ? (
        <div className="grid grid-cols-3 gap-4">
          {[
            { v: "~3,500", l: "IPS Officers", s: "across all states" },
            { v: "~150", l: "Annual intake", s: "via UPSC CSE" },
            { v: "36", l: "DGP posts", s: "one per state/UT" },
          ].map((s) => (
            <div key={s.l} className="card p-4 text-center">
              <div className="text-xl font-display font-bold text-red-700 dark:text-red-300">{s.v}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
              <div className="text-[10px] text-slate-400">{s.s}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {[
            { v: "~900", l: "IFS Officers", s: "for 193 countries" },
            { v: "~35", l: "Annual intake", s: "via UPSC CSE" },
            { v: "1", l: "Foreign Secretary", s: "Apex post in MEA" },
          ].map((s) => (
            <div key={s.l} className="card p-4 text-center">
              <div className="text-xl font-display font-bold text-teal-700 dark:text-teal-300">{s.v}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
              <div className="text-[10px] text-slate-400">{s.s}</div>
            </div>
          ))}
        </div>
      )}

      {/* Pyramid */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">
          {service === "ips" ? "IPS" : "IFS"} Rank Structure (Top → Junior)
        </h3>
        <div className="space-y-1.5">
          {reversed.map((rank, i) => {
            const origIdx = ranks.length - 1 - i;
            const colorClass = colors[origIdx] || colors[0];
            const width = PYRAMID_WIDTHS[i];
            const isSelected = selected === rank.level;
            return (
              <div key={rank.level} className="flex justify-center">
                <button
                  onClick={() => setSelected(isSelected ? null : rank.level)}
                  className={`flex items-center gap-3 px-4 rounded-lg transition-all border-l-4 border-transparent ${colorClass} ${isSelected ? "ring-2 ring-saffron-400" : "hover:opacity-90"}`}
                  style={{ width: `${width}%`, minWidth: 200, height: 40 }}
                >
                  <span className="text-xs font-bold shrink-0">{rank.abbr}</span>
                  <span className="text-xs truncate hidden sm:block">{rank.rank}</span>
                  <span className="ml-auto text-[10px] opacity-70 shrink-0">{rank.yearsRange}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail */}
      {selected && (() => {
        const rank = ranks.find((r) => r.level === selected)!;
        const colorClass = colors[rank.level - 1] || colors[0];
        return (
          <div className={`card p-6 border-l-4 border-l-current ${colorClass}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display font-bold text-base">{rank.rank}</h3>
                <div className="text-xs opacity-70 mt-0.5">{rank.yearsRange}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs font-semibold">{rank.payLevel}</div>
                <div className="text-[10px] opacity-70">{rank.payRange}</div>
              </div>
            </div>
            <p className="text-sm mt-3 leading-relaxed">{rank.role}</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase font-semibold opacity-60 mb-2">Typical Postings</div>
                {rank.typicalPostings.map((p) => (
                  <div key={p} className="flex gap-1.5 items-start text-xs mb-1 opacity-80">
                    <span className="shrink-0">•</span> {p}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold opacity-60 mb-2">Powers</div>
                {rank.powers.slice(0, 3).map((p) => (
                  <div key={p} className="flex gap-1.5 items-start text-xs mb-1 opacity-80">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 mt-0.5">
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

      {/* Central Police Organisations (IPS) */}
      {service === "ips" && (
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-3">Central Police Organisations (led by IPS officers)</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              { name: "CBI", full: "Central Bureau of Investigation", strength: "~8,000" },
              { name: "IB", full: "Intelligence Bureau", strength: "~25,000" },
              { name: "NIA", full: "National Investigation Agency", strength: "~1,000" },
              { name: "BSF", full: "Border Security Force", strength: "2.65 lakh" },
              { name: "CRPF", full: "Central Reserve Police Force", strength: "3.25 lakh" },
              { name: "CISF", full: "Central Industrial Security Force", strength: "1.63 lakh" },
              { name: "ITBP", full: "Indo-Tibetan Border Police", strength: "~90,000" },
              { name: "SSB", full: "Sashastra Seema Bal", strength: "~80,000" },
              { name: "NSG", full: "National Security Guard", strength: "~7,500" },
            ].map((org) => (
              <div key={org.name} className="flex gap-2 items-start p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-xs text-red-600 dark:text-red-400 w-12 shrink-0">{org.name}</span>
                <div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">{org.full}</div>
                  <div className="text-[10px] text-slate-400">{org.strength} personnel</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
