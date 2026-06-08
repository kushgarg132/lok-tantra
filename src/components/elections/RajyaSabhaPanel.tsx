"use client";

import { useMemo, useState } from "react";
interface RsParty { party: string; abbr: string; color: string; seats: number; alliance: "NDA" | "INDIA" | "Regional" | "Nominated" }

const RS_COMPOSITION: RsParty[] = [
  { party: "BJP",          abbr: "BJP",    color: "#FF9933", seats: 88, alliance: "NDA"       },
  { party: "Congress",     abbr: "INC",    color: "#1565C0", seats: 26, alliance: "INDIA"     },
  { party: "TMC",          abbr: "TMC",    color: "#059669", seats: 13, alliance: "INDIA"     },
  { party: "YSRCP",        abbr: "YSRCP",  color: "#F59E0B", seats: 11, alliance: "Regional"  },
  { party: "AAP",          abbr: "AAP",    color: "#06B6D4", seats: 10, alliance: "INDIA"     },
  { party: "DMK",          abbr: "DMK",    color: "#DC143C", seats: 10, alliance: "INDIA"     },
  { party: "BJD",          abbr: "BJD",    color: "#2563EB", seats: 8,  alliance: "Regional"  },
  { party: "JDU",          abbr: "JDU",    color: "#0891B2", seats: 5,  alliance: "NDA"       },
  { party: "BRS",          abbr: "BRS",    color: "#E91E63", seats: 5,  alliance: "Regional"  },
  { party: "AIADMK",       abbr: "ADMK",   color: "#1B5E20", seats: 4,  alliance: "Regional"  },
  { party: "CPM",          abbr: "CPM",    color: "#B91C1C", seats: 4,  alliance: "INDIA"     },
  { party: "SP",           abbr: "SP",     color: "#EF4444", seats: 3,  alliance: "INDIA"     },
  { party: "RJD",          abbr: "RJD",    color: "#7F1D1D", seats: 3,  alliance: "INDIA"     },
  { party: "SS (Shinde)",  abbr: "SS",     color: "#EA580C", seats: 3,  alliance: "NDA"       },
  { party: "NCP (Ajit)",   abbr: "NCP",    color: "#7C3AED", seats: 3,  alliance: "NDA"       },
  { party: "SAD",          abbr: "SAD",    color: "#1E40AF", seats: 3,  alliance: "NDA"       },
  { party: "SS (UBT)",     abbr: "SS-UBT", color: "#F97316", seats: 2,  alliance: "INDIA"     },
  { party: "NCP (SP)",     abbr: "NCP-SP", color: "#A78BFA", seats: 2,  alliance: "INDIA"     },
  { party: "Others",       abbr: "Oth",    color: "#64748B", seats: 28, alliance: "Regional"  },
  { party: "Nominated",    abbr: "Nom",    color: "#94A3B8", seats: 12, alliance: "Nominated" },
];

const TOTAL_RS = 245;
const MAJORITY_RS = 123;

// SVG donut parameters
const CX = 130, CY = 130, R_OUTER = 100, R_INNER = 58;

function polarToXY(angle: number, r: number) {
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

function makeArc(startAngle: number, endAngle: number, r: number) {
  const start = polarToXY(startAngle, r);
  const end = polarToXY(endAngle, r);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

function makeDonutSlice(startAngle: number, endAngle: number) {
  const outerStart = polarToXY(startAngle, R_OUTER);
  const outerEnd = polarToXY(endAngle, R_OUTER);
  const innerEnd = polarToXY(endAngle, R_INNER);
  const innerStart = polarToXY(startAngle, R_INNER);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    `M ${outerStart.x.toFixed(2)} ${outerStart.y.toFixed(2)}`,
    `A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${outerEnd.x.toFixed(2)} ${outerEnd.y.toFixed(2)}`,
    `L ${innerEnd.x.toFixed(2)} ${innerEnd.y.toFixed(2)}`,
    `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${innerStart.x.toFixed(2)} ${innerStart.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export function RajyaSabhaPanel() {
  const [filter, setFilter] = useState<"all" | "NDA" | "INDIA" | "Regional" | "Nominated">("all");
  const [hovered, setHovered] = useState<string | null>(null);

  const visible = filter === "all" ? RS_COMPOSITION : RS_COMPOSITION.filter(p => p.alliance === filter);

  const slices = useMemo(() => {
    let angle = -Math.PI / 2; // start at top
    return RS_COMPOSITION.map((p) => {
      const slice = (p.seats / TOTAL_RS) * 2 * Math.PI;
      const start = angle;
      angle += slice;
      return { ...p, start, end: angle, mid: start + slice / 2 };
    });
  }, []);

  const ndaSeats = RS_COMPOSITION.filter(p => p.alliance === "NDA").reduce((s, p) => s + p.seats, 0);
  const indiaSeats = RS_COMPOSITION.filter(p => p.alliance === "INDIA").reduce((s, p) => s + p.seats, 0);
  const regionalSeats = RS_COMPOSITION.filter(p => p.alliance === "Regional").reduce((s, p) => s + p.seats, 0);

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5 text-center">
          <div className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">{TOTAL_RS}</div>
          <div className="text-xs text-slate-500 mt-1">Total RS Seats</div>
          <div className="text-[10px] text-slate-400 mt-0.5">233 elected + 12 nominated</div>
        </div>
        <div className="card p-5 text-center border-t-4 border-saffron-500">
          <div className="text-2xl font-display font-bold text-saffron-500">{ndaSeats}</div>
          <div className="text-xs text-slate-500 mt-1">NDA</div>
        </div>
        <div className="card p-5 text-center border-t-4 border-blue-600">
          <div className="text-2xl font-display font-bold text-blue-600">{indiaSeats}</div>
          <div className="text-xs text-slate-500 mt-1">INDIA</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-2xl font-display font-bold text-slate-600 dark:text-slate-400">{regionalSeats}</div>
          <div className="text-xs text-slate-500 mt-1">Regional / Others</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Donut chart */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">Composition Donut</h3>
          <svg viewBox="0 0 260 260" className="w-full max-w-[260px] mx-auto">
            {slices.map((s) => (
              <path
                key={s.party}
                d={makeDonutSlice(s.start, s.end)}
                fill={s.color}
                opacity={hovered && hovered !== s.party ? 0.5 : 1}
                onMouseEnter={() => setHovered(s.party)}
                onMouseLeave={() => setHovered(null)}
                className="transition-opacity cursor-pointer"
              >
                <title>{s.party}: {s.seats} seats</title>
              </path>
            ))}
            {/* Center text */}
            <text x={CX} y={CY - 8} textAnchor="middle" fontSize="22" fontWeight="bold" fill="currentColor" className="fill-slate-900 dark:fill-slate-100">{TOTAL_RS}</text>
            <text x={CX} y={CY + 8} textAnchor="middle" fontSize="10" fill="#94a3b8">Total seats</text>
            <text x={CX} y={CY + 20} textAnchor="middle" fontSize="9" fill="#94a3b8">Majority: {MAJORITY_RS}</text>
          </svg>
        </div>

        {/* Party table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">Party Breakdown</h3>
            <div className="flex gap-0.5 flex-wrap">
              {(["all", "NDA", "INDIA", "Regional"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-2 py-0.5 text-[10px] rounded font-medium ${filter === f ? "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-400" : "text-slate-400 hover:text-slate-600"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {visible.map((p) => (
              <div key={p.party} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="flex-1 text-xs text-slate-700 dark:text-slate-300 truncate">{p.party}</span>
                <div className="w-24 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex-shrink-0">
                  <div className="h-full rounded-full" style={{ width: `${(p.seats / 95) * 100}%`, backgroundColor: p.color }} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-8 text-right flex-shrink-0">{p.seats}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RS vs LS comparison */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">Rajya Sabha vs Lok Sabha</h3>
        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          {[
            { label: "Nature", rs: "Permanent House — never dissolved", ls: "Temporary — 5-year term, can be dissolved" },
            { label: "Election", rs: "Elected by State legislative assembly members (indirect), 1/3rd retire every 2 years", ls: "Directly elected by voters under FPTP" },
            { label: "Seats", rs: "245 (233 elected + 12 nominated by President)", ls: "543 (530 states + 13 UTs, elected)" },
            { label: "Presided by", rs: "Vice President of India [Art. 64]", ls: "Speaker of Lok Sabha [Art. 93]" },
            { label: "Money Bills", rs: "Cannot introduce; can only suggest changes in 14 days", ls: "Sole authority — certified by Speaker [Art. 110]" },
            { label: "Special powers", rs: "Authorises Centre on State subjects [Art. 249]", ls: "Vote of no confidence against Council of Ministers" },
          ].map((row) => (
            <div key={row.label} className="space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{row.label}</div>
              <div className="flex gap-2 text-xs">
                <div className="w-1 rounded bg-[#7C3AED] flex-shrink-0" />
                <div><span className="font-semibold text-slate-700 dark:text-slate-300">RS: </span>{row.rs}</div>
              </div>
              <div className="flex gap-2 text-xs">
                <div className="w-1 rounded bg-saffron-400 flex-shrink-0" />
                <div><span className="font-semibold text-slate-700 dark:text-slate-300">LS: </span>{row.ls}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
