"use client";

import { useState } from "react";
interface CoalitionParty { name: string; abbr: string; color: string; seats: number }
interface Coalition { name: string; shortName: string; color: string; bgColor: string; totalSeats: number; parties: CoalitionParty[] }

const COALITIONS_2024: Coalition[] = [
  {
    name: "National Democratic Alliance",
    shortName: "NDA",
    color: "#FF9933",
    bgColor: "#FFF7ED",
    totalSeats: 293,
    parties: [
      { name: "BJP",         abbr: "BJP", color: "#FF9933", seats: 240 },
      { name: "TDP",         abbr: "TDP", color: "#D97706", seats: 16  },
      { name: "JDU",         abbr: "JDU", color: "#0891B2", seats: 12  },
      { name: "SS (Shinde)", abbr: "SS",  color: "#EA580C", seats: 7   },
      { name: "LJP-RV",      abbr: "LJP", color: "#FBBF24", seats: 5   },
      { name: "RLD",         abbr: "RLD", color: "#34D399", seats: 2   },
      { name: "Others",      abbr: "Oth", color: "#94A3B8", seats: 11  },
    ],
  },
  {
    name: "INDIA Alliance",
    shortName: "INDIA",
    color: "#1565C0",
    bgColor: "#EFF6FF",
    totalSeats: 234,
    parties: [
      { name: "Congress",    abbr: "INC",    color: "#1565C0", seats: 99 },
      { name: "SP",          abbr: "SP",     color: "#EF4444", seats: 37 },
      { name: "TMC",         abbr: "TMC",    color: "#059669", seats: 29 },
      { name: "DMK",         abbr: "DMK",    color: "#DC143C", seats: 22 },
      { name: "SS (UBT)",    abbr: "SS-UBT", color: "#F97316", seats: 9  },
      { name: "NCP (SP)",    abbr: "NCP-SP", color: "#7C3AED", seats: 8  },
      { name: "RJD",         abbr: "RJD",    color: "#7F1D1D", seats: 4  },
      { name: "JMM",         abbr: "JMM",    color: "#2E7D32", seats: 3  },
      { name: "AAP",         abbr: "AAP",    color: "#06B6D4", seats: 3  },
      { name: "Left",        abbr: "Left",   color: "#B91C1C", seats: 5  },
      { name: "Others",      abbr: "Oth",    color: "#475569", seats: 15 },
    ],
  },
  {
    name: "Unaffiliated",
    shortName: "Others",
    color: "#64748B",
    bgColor: "#F8FAFC",
    totalSeats: 16,
    parties: [
      { name: "YSRCP",       abbr: "YSRCP", color: "#F59E0B", seats: 4  },
      { name: "Ind./Others", abbr: "Oth",   color: "#9CA3AF", seats: 12 },
    ],
  },
];

const TOTAL = 543;
const MAJORITY = 272;

export function CoalitionPanel() {
  const [expanded, setExpanded] = useState<string | null>("NDA");

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {COALITIONS_2024.map((c) => (
          <div key={c.shortName} className="card p-5 border-t-4" style={{ borderColor: c.color }}>
            <div className="text-2xl font-display font-extrabold" style={{ color: c.color }}>{c.totalSeats}</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{c.shortName}</div>
            <div className="text-xs text-slate-500 mt-1">{((c.totalSeats / TOTAL) * 100).toFixed(1)}% of seats</div>
            {c.shortName === "NDA" && (
              <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                +{c.totalSeats - MAJORITY} above majority
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Coalition composition bar */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">Seat Composition</h3>
          <span className="text-xs text-slate-400">Majority: {MAJORITY} seats</span>
        </div>

        <div className="h-10 rounded-xl overflow-hidden flex">
          {COALITIONS_2024.map((c) => (
            <div
              key={c.shortName}
              className="h-full flex items-center justify-center"
              style={{ width: `${(c.totalSeats / TOTAL) * 100}%`, backgroundColor: c.color }}
            >
              <span className="text-xs font-bold text-white drop-shadow-sm">{c.shortName} {c.totalSeats}</span>
            </div>
          ))}
        </div>

        {/* Majority marker */}
        <div className="relative h-5 mt-1">
          <div
            className="absolute top-0 w-0.5 h-5 bg-red-500"
            style={{ left: `${(MAJORITY / TOTAL) * 100}%` }}
          />
          <div
            className="absolute top-5 text-[10px] text-red-500 font-medium -translate-x-1/2"
            style={{ left: `${(MAJORITY / TOTAL) * 100}%` }}
          >
            272
          </div>
        </div>
      </div>

      {/* Coalition breakdown */}
      <div className="space-y-4">
        {COALITIONS_2024.filter(c => c.parties.length > 1).map((coalition) => (
          <div key={coalition.shortName} className="card overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === coalition.shortName ? null : coalition.shortName)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-8 rounded" style={{ backgroundColor: coalition.color }} />
                <div className="text-left">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{coalition.name}</div>
                  <div className="text-xs text-slate-500">{coalition.parties.length} parties · {coalition.totalSeats} seats</div>
                </div>
              </div>
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${expanded === coalition.shortName ? "rotate-180" : ""}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {expanded === coalition.shortName && (
              <div className="px-4 pb-4 pt-1 space-y-2 border-t border-slate-100 dark:border-slate-800">
                {/* Party bars */}
                {coalition.parties.map((p) => (
                  <div key={p.abbr} className="flex items-center gap-3">
                    <span className="w-14 text-xs font-semibold text-slate-700 dark:text-slate-300 text-right flex-shrink-0">{p.abbr}</span>
                    <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg flex items-center px-2 transition-all"
                        style={{ width: `${(p.seats / coalition.parties[0].seats) * 100}%`, backgroundColor: p.color, minWidth: p.seats > 0 ? "24px" : "0" }}
                      >
                        <span className="text-[9px] font-bold text-white">{p.seats}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 w-6 text-right flex-shrink-0">{p.seats}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Context note */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p><strong className="text-slate-700 dark:text-slate-300">NDA Government:</strong> BJP-led coalition formed 3rd consecutive government. PM Narendra Modi sworn in for a third term on 9 June 2024 with support of JDU and TDP.</p>
        <p><strong className="text-slate-700 dark:text-slate-300">Constitutional basis:</strong> [Art. 75] — PM is appointed by President; ministers hold office during PM's pleasure. Coalition stability depends on floor test confidence.</p>
      </div>
    </div>
  );
}
