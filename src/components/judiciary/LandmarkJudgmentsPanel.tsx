"use client";

import { useState, useMemo } from "react";
import { LANDMARK_CASES, CASE_CATEGORY_CONFIG, type CaseCategory } from "@/data/judiciary/intelligence";

const ALL_CATEGORIES: CaseCategory[] = [
  "basic_structure", "fundamental_rights", "federalism", "social_justice",
  "environment", "pil", "gender", "privacy", "speech",
];

export function LandmarkJudgmentsPanel() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CaseCategory | "all">("all");
  const [yearRange, setYearRange] = useState<"all" | "pre1990" | "1990s" | "2000s" | "2010s">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [showOverruled, setShowOverruled] = useState(true);

  const filtered = useMemo(() => {
    return LANDMARK_CASES.filter((c) => {
      if (!showOverruled && c.overruled) return false;
      if (category !== "all" && c.category !== category) return false;
      if (yearRange === "pre1990" && c.year >= 1990) return false;
      if (yearRange === "1990s" && (c.year < 1990 || c.year >= 2000)) return false;
      if (yearRange === "2000s" && (c.year < 2000 || c.year >= 2010)) return false;
      if (yearRange === "2010s" && c.year < 2010) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) ||
          c.short.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [search, category, yearRange, showOverruled]);

  const selCase = selected ? LANDMARK_CASES.find((c) => c.id === selected) : null;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card p-4 space-y-3">
        <input
          type="text"
          placeholder="Search cases, tags, articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-saffron-400"
        />

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategory("all")}
            className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${
              category === "all" ? "bg-slate-700 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700"
            }`}
          >
            All
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const cfg = CASE_CATEGORY_CONFIG[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? "all" : cat)}
                className={`px-2.5 py-1 text-[10px] rounded-full font-semibold transition-colors ${
                  category === cat ? `${cfg.bg} ${cfg.text} ring-1 ring-current` : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Year + overruled */}
        <div className="flex gap-2 flex-wrap items-center">
          <div className="flex gap-1">
            {[["all", "All Years"], ["pre1990", "Pre-1990"], ["1990s", "1990s"], ["2000s", "2000s"], ["2010s", "2010s"]].map(([v, l]) => (
              <button key={v} onClick={() => setYearRange(v as typeof yearRange)}
                className={`px-2 py-1 text-xs rounded font-medium ${yearRange === v ? "bg-saffron-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                {l}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto cursor-pointer">
            <input type="checkbox" checked={showOverruled} onChange={(e) => setShowOverruled(e.target.checked)} className="rounded" />
            Show overruled cases
          </label>
        </div>
      </div>

      <div className="text-xs text-slate-400">{filtered.length} cases</div>

      {/* Case list */}
      <div className="space-y-3">
        {filtered.map((c) => {
          const cfg = CASE_CATEGORY_CONFIG[c.category];
          const isSelected = selected === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelected(isSelected ? null : c.id)}
              className={`w-full card p-5 text-left transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-saffron-400" : ""
              } ${c.overruled ? "opacity-80" : ""}`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-display font-bold text-slate-900 dark:text-slate-100 ${isSelected ? "text-base" : "text-sm"}`}>
                      {c.name}
                    </h3>
                    {c.overruled && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 uppercase tracking-wider">
                        Overruled
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                    <span className="font-semibold">{c.year}</span>
                    <span className="font-mono">{c.citation}</span>
                    <span>{c.benchSize}-judge bench</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`text-slate-400 transition-transform ${isSelected ? "rotate-180" : ""}`}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Articles */}
              {c.articles.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {c.articles.map((a) => (
                    <span key={a} className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-navy-50 dark:bg-slate-800 text-navy-700 dark:text-slate-300 border border-navy-200 dark:border-slate-700">
                      Art. {a}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{c.summary}</p>

              {/* Expanded detail */}
              {isSelected && (
                <div className="mt-4 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Full Summary</div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{c.summary}</p>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Constitutional Impact</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">{c.impact}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No cases match your filters</div>
        )}
      </div>
    </div>
  );
}
