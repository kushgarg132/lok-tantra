"use client";

import { useState } from "react";
import { DISTRICT_UNITS } from "@/data/bureaucracy/intelligence";
import type { DistrictUnit } from "@/data/bureaucracy/intelligence";

const TRACK_CONFIG = {
  revenue: { label: "Revenue Track", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", accent: "#B45309" },
  development: { label: "Development Track", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", accent: "#047857" },
  police: { label: "Police (IPS)", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300", accent: "#B91C1C" },
  dept: { label: "Line Departments", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", accent: "#7C3AED" },
};

const DEPTH_INDENT = [0, 16, 32, 48, 64, 80];

function UnitCard({ unit, isSelected, onSelect }: { unit: DistrictUnit; isSelected: boolean; onSelect: () => void }) {
  const track = TRACK_CONFIG[unit.track];
  return (
    <div style={{ paddingLeft: DEPTH_INDENT[unit.depth] }}>
      <button
        onClick={onSelect}
        className={`w-full text-left p-3 rounded-xl border transition-all ${isSelected ? "border-saffron-400 ring-1 ring-saffron-400 shadow-sm" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"} bg-white dark:bg-slate-900`}
      >
        <div className="flex items-center gap-2">
          {unit.depth > 0 && (
            <div className="shrink-0 w-3 h-px bg-slate-300 dark:bg-slate-600" />
          )}
          <span className={`px-2 py-0.5 text-[10px] rounded font-semibold shrink-0 ${track.color}`}>{unit.abbr}</span>
          <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{unit.title}</span>
          <span className="ml-auto text-[10px] text-slate-400 shrink-0 hidden sm:block">{unit.count}</span>
        </div>
      </button>
    </div>
  );
}

export function DistrictAdminPanel() {
  const [selected, setSelected] = useState<string>("collector");
  const [trackFilter, setTrackFilter] = useState<string>("all");

  const selectedUnit = DISTRICT_UNITS.find((u) => u.id === selected)!;

  const filteredUnits = DISTRICT_UNITS.filter((u) => {
    if (u.id === "collector") return true;
    if (trackFilter === "all") return true;
    return u.track === trackFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5 border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20">
        <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm mb-1">District Administration — Government at Ground Level</h3>
        <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed">
          The District Collector is India&apos;s most powerful field officer — managing revenue, development, law &amp; order, elections, and disaster response. Click any unit to explore its role and powers.
        </p>
      </div>

      {/* Track filters */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setTrackFilter("all")}
          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${trackFilter === "all" ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
          All tracks
        </button>
        {(Object.keys(TRACK_CONFIG) as (keyof typeof TRACK_CONFIG)[]).map((t) => (
          <button key={t} onClick={() => setTrackFilter(t)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${trackFilter === t ? TRACK_CONFIG[t].color : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
            {TRACK_CONFIG[t].label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Unit tree */}
        <div className="space-y-2">
          {filteredUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              isSelected={selected === unit.id}
              onSelect={() => setSelected(unit.id)}
            />
          ))}
        </div>

        {/* Detail */}
        {selectedUnit && (
          <div className="card p-6 space-y-4 self-start">
            <div>
              <div className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold mb-2 ${TRACK_CONFIG[selectedUnit.track].color}`}>
                {TRACK_CONFIG[selectedUnit.track].label}
              </div>
              <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">{selectedUnit.title}</h3>
              <div className="text-[10px] text-slate-400 mt-1">{selectedUnit.count}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5">Role</div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{selectedUnit.role}</p>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Powers &amp; Functions</div>
              <div className="space-y-1.5">
                {selectedUnit.powers.map((p) => (
                  <div key={p} className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 mt-0.5 text-emerald-500">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {p}
                  </div>
                ))}
              </div>
            </div>
            {selectedUnit.parent && (
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5">Reports to</div>
                <button onClick={() => setSelected(selectedUnit.parent!)}
                  className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors">
                  {DISTRICT_UNITS.find((u) => u.id === selectedUnit.parent)?.abbr || selectedUnit.parent} ↑
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Typical district stats */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm">A Typical Indian District</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { v: "~2–5M", l: "Population", s: "average district" },
            { v: "10–30", l: "Blocks (Tehsils)", s: "sub-district units" },
            { v: "300–800", l: "Gram Panchayats", s: "per district" },
            { v: "1 IAS", l: "District Collector", s: "managing all of this" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-xl font-display font-bold text-emerald-700 dark:text-emerald-300">{s.v}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{s.l}</div>
              <div className="text-[10px] text-slate-400">{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
