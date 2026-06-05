"use client";

import { useState, useMemo } from "react";
import { HIGH_COURTS, type HighCourtData } from "@/data/judiciary/intelligence";

const REGIONS = ["All", "North", "South", "East", "West", "Northeast", "Central"] as const;
type Region = typeof REGIONS[number];

const REGION_COLORS: Record<string, string> = {
  North:     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  South:     "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  East:      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  West:      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Northeast: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  Central:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

function strengthBar(count: number, max: number) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mt-1">
      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function HighCourtsPanel() {
  const [region, setRegion] = useState<Region>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return HIGH_COURTS.filter((hc) => {
      if (region !== "All" && hc.region !== region) return false;
      if (search) {
        const q = search.toLowerCase();
        return hc.name.toLowerCase().includes(q) ||
          hc.city.toLowerCase().includes(q) ||
          hc.states.some((s) => s.toLowerCase().includes(q));
      }
      return true;
    });
  }, [region, search]);

  const maxStrength = Math.max(...HIGH_COURTS.map((h) => h.sanctioned));
  const sel = selected ? HIGH_COURTS.find((h) => h.id === selected) : null;

  const regionCounts = useMemo(() => {
    const m: Record<string, number> = {};
    HIGH_COURTS.forEach((hc) => { m[hc.region] = (m[hc.region] || 0) + 1; });
    return m;
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {(["North", "South", "East", "West", "Northeast", "Central"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r === region ? "All" : r)}
            className={`card p-3 text-center transition-all hover:shadow-md ${region === r ? "ring-2 ring-saffron-400" : ""}`}
          >
            <div className="text-lg font-display font-bold text-slate-900 dark:text-slate-100">{regionCounts[r] || 0}</div>
            <div className={`text-[10px] font-semibold mt-0.5 px-1.5 py-0.5 rounded-full ${REGION_COLORS[r]}`}>{r}</div>
          </button>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search courts, cities, states..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-saffron-400"
        />
        <div className="flex gap-1 flex-wrap">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
                region === r ? "bg-saffron-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-400">{filtered.length} of 25 High Courts</div>

      {/* HC grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((hc) => (
          <button
            key={hc.id}
            onClick={() => setSelected(selected === hc.id ? null : hc.id)}
            className={`card p-4 text-left transition-all hover:shadow-md ${
              selected === hc.id ? "ring-2 ring-emerald-400" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">{hc.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{hc.city} · Est. {hc.established}</div>
              </div>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${REGION_COLORS[hc.region]}`}>
                {hc.region}
              </span>
            </div>

            <div className="mt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Sanctioned</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{hc.sanctioned} judges</span>
              </div>
              {strengthBar(hc.sanctioned, maxStrength)}
            </div>

            <div className="mt-2 text-xs text-slate-500 truncate">
              {hc.states.join(", ")}
            </div>

            {selected === hc.id && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Jurisdiction</div>
                  <div className="flex flex-wrap gap-1">
                    {hc.states.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">{s}</span>
                    ))}
                  </div>
                </div>
                {hc.benches.length > 0 && (
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Circuit Benches</div>
                    <div className="flex flex-wrap gap-1">
                      {hc.benches.map((b) => (
                        <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{b}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="text-[10px] text-amber-700 dark:text-amber-400 italic">{hc.notable}</div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Footer note */}
      <div className="text-xs text-slate-400 px-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
        <strong className="text-slate-600 dark:text-slate-300">Constitutional Basis:</strong> Art. 214 mandates at least one High Court per state.
        Art. 231 allows Parliament to establish a common HC for two or more states (e.g., Punjab & Haryana).
        Art. 217 governs appointment of HC judges by the President in consultation with CJI, HC Chief Justice, and State Governor.
      </div>
    </div>
  );
}
