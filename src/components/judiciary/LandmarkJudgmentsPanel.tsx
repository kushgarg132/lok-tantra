"use client";

import { useState, useMemo } from "react";
import type { CaseDB } from "./JudiciaryDashboard";

type YearRange = "all" | "pre1990" | "1990s" | "2000s" | "2010s";

interface Props { cases: CaseDB[] }

export function LandmarkJudgmentsPanel({ cases }: Props) {
  const [search, setSearch] = useState("");
  const [yearRange, setYearRange] = useState<YearRange>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (yearRange === "pre1990" && c.year >= 1990) return false;
      if (yearRange === "1990s" && (c.year < 1990 || c.year >= 2000)) return false;
      if (yearRange === "2000s" && (c.year < 2000 || c.year >= 2010)) return false;
      if (yearRange === "2010s" && c.year < 2010) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          (c.citation ?? "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [cases, search, yearRange]);

  const selCase = selected ? cases.find((c) => c.id === selected) : null;

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <input
          type="text"
          placeholder="Search cases, citations, summaries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-saffron-400"
        />
        <div className="flex gap-1 flex-wrap">
          {([["all", "All Years"], ["pre1990", "Pre-1990"], ["1990s", "1990s"], ["2000s", "2000s"], ["2010s", "2010s"]] as [YearRange, string][]).map(([v, l]) => (
            <button key={v} onClick={() => setYearRange(v)}
              className={`px-2 py-1 text-xs rounded font-medium ${yearRange === v ? "bg-saffron-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-400">{filtered.length} cases</div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const isSelected = selected === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelected(isSelected ? null : c.id)}
              className={`w-full card p-5 text-left transition-all hover:shadow-md ${isSelected ? "ring-2 ring-saffron-400" : ""}`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-display font-bold text-slate-900 dark:text-slate-100 ${isSelected ? "text-base" : "text-sm"}`}>
                    {c.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                    <span className="font-semibold">{c.year}</span>
                    {c.citation && <span className="font-mono">{c.citation}</span>}
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={`text-slate-400 transition-transform shrink-0 mt-1 ${isSelected ? "rotate-180" : ""}`}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {c.articlesInterpreted.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {c.articlesInterpreted.map((a) => (
                    <span key={a.id} className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-navy-50 dark:bg-slate-800 text-navy-700 dark:text-slate-300 border border-navy-200 dark:border-slate-700">
                      Art. {a.number}
                    </span>
                  ))}
                </div>
              )}

              <p className={`mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed ${isSelected ? "" : "line-clamp-2"}`}>
                {c.summary}
              </p>

              {isSelected && (
                <div className="mt-4 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                  {c.significance && (
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Significance</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{c.significance}</p>
                    </div>
                  )}
                  {c.impact && (
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Constitutional Impact</div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">{c.impact}</p>
                    </div>
                  )}
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
