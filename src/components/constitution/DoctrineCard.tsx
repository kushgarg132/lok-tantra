"use client";

import { useState } from "react";
import { DOCTRINES_DATA, DoctrineData } from "@/data/constitution/doctrines-data";

const CATEGORY_CONFIG = {
  interpretation: { label: "Interpretation", color: "saffron" },
  federalism: { label: "Federalism", color: "blue" },
  rights: { label: "Rights", color: "emerald" },
  procedure: { label: "Procedure", color: "purple" },
  sovereignty: { label: "Sovereignty", color: "red" },
};

const COLOR_CLASSES: Record<string, { badge: string; border: string; num: string }> = {
  saffron: {
    badge: "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300",
    border: "border-l-saffron-400",
    num: "text-saffron-600 dark:text-saffron-400",
  },
  blue: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    border: "border-l-blue-400",
    num: "text-blue-600 dark:text-blue-400",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    border: "border-l-emerald-400",
    num: "text-emerald-600 dark:text-emerald-400",
  },
  purple: {
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    border: "border-l-purple-400",
    num: "text-purple-600 dark:text-purple-400",
  },
  red: {
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    border: "border-l-red-400",
    num: "text-red-600 dark:text-red-400",
  },
};

export function DoctrineExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = DOCTRINES_DATA.filter((d) => {
    const matchCat = selectedCategory === "all" || d.category === selectedCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      d.name.toLowerCase().includes(q) ||
      (d.shortName || "").toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.keywords.some((k) => k.toLowerCase().includes(q)) ||
      d.landmarkCase.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Intro */}
      <div className="card p-5 border-l-4 border-navy-400">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Constitutional doctrines are judge-made principles that guide interpretation of the Indian Constitution.
          They fill gaps, resolve conflicts, and have shaped fundamental rights, federalism, and parliamentary democracy.
          The <strong>Basic Structure Doctrine</strong> (1973) is the most significant — unique to India among constitutional democracies.
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctrines..."
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-saffron-400"
        />
        <div className="flex flex-wrap gap-2">
          {["all", ...Object.keys(CATEGORY_CONFIG)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                selectedCategory === cat
                  ? "bg-saffron-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {cat === "all" ? "All" : CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG].label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doctrine) => {
          const catConfig = CATEGORY_CONFIG[doctrine.category];
          const colors = COLOR_CLASSES[catConfig.color];
          const isExpanded = expandedId === doctrine.id;

          return (
            <div
              key={doctrine.id}
              className={`card border-l-4 ${colors.border} transition-all ${
                isExpanded ? "md:col-span-2" : ""
              }`}
            >
              <button
                className="w-full text-left p-5"
                onClick={() => setExpandedId(isExpanded ? null : doctrine.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">
                        {doctrine.name}
                      </h3>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {catConfig.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {doctrine.description}
                    </p>
                    <p className={`text-xs font-medium mt-2 ${colors.num}`}>
                      {doctrine.landmarkCase} ({doctrine.caseYear})
                    </p>
                  </div>
                  <svg
                    className={`shrink-0 text-slate-400 transition-transform mt-0.5 ${isExpanded ? "rotate-180" : ""}`}
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                  <div>
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Detailed Explanation
                    </h5>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {doctrine.detail}
                    </p>
                  </div>

                  {doctrine.relatedArticles.length > 0 && (
                    <div>
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Relevant Articles
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {doctrine.relatedArticles.map((a) => (
                          <span
                            key={a}
                            className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                          >
                            Art. {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Keywords
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {doctrine.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-slate-500 text-sm">No doctrines match your search.</p>
        </div>
      )}
    </div>
  );
}
