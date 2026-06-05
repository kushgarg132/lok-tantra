"use client";

import { useState, useMemo } from "react";
import { ARTICLES_DATA, ArticleData } from "@/data/constitution/articles-data";
import FlagContent from "@/components/moderation/FlagContent";

const CATEGORY_LABELS: Record<string, string> = {
  fundamental_rights: "Fundamental Rights",
  dpsp: "Directive Principles",
  fundamental_duties: "Fundamental Duties",
  union_executive: "Union Executive",
  parliament: "Parliament",
  state_executive: "State Executive",
  judiciary: "Judiciary",
  elections: "Elections",
  emergency: "Emergency",
  amendment: "Amendment",
  other: "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
  fundamental_rights: "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300",
  dpsp: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  fundamental_duties: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  union_executive: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  parliament: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  state_executive: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  judiciary: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  elections: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  emergency: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  amendment: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  other: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const PART_NAMES: Record<number, string> = {
  1: "I — The Union and Its Territory",
  2: "II — Citizenship",
  3: "III — Fundamental Rights",
  4: "IV — Directive Principles",
  4.1: "IVA — Fundamental Duties",
  5: "V — The Union",
  6: "VI — The States",
  15: "XV — Elections",
  18: "XVIII — Emergency Provisions",
  20: "XX — Amendment of the Constitution",
  12: "XII — Finance, Property, Contracts and Suits",
};

interface ArticleCardProps {
  article: ArticleData;
  isExpanded: boolean;
  onToggle: () => void;
}

function ArticleCard({ article, isExpanded, onToggle }: ArticleCardProps) {
  const catColor = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.other;
  const catLabel = CATEGORY_LABELS[article.category] || article.category;

  return (
    <div className={`card transition-all ${isExpanded ? "border-saffron-300 dark:border-saffron-700" : ""}`}>
      <button
        className="w-full text-left p-4"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {article.number}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                {article.title}
              </h4>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${catColor}`}>
                {catLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {article.explanation.slice(0, 160)}...
            </p>
          </div>
          <svg
            className={`shrink-0 text-slate-400 transition-transform mt-1 ${isExpanded ? "rotate-180" : ""}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
          {/* Constitutional text */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Constitutional Text
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border-l-2 border-saffron-300">
              {article.text}
            </p>
          </div>

          {/* Explanation */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Explanation
            </h5>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {article.explanation}
            </p>
          </div>

          {/* Related articles */}
          {article.relatedArticles.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Related Articles
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {article.relatedArticles.map((a) => (
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

          <div className="flex justify-end pt-1">
            <FlagContent
              contentType="constitution_article"
              contentId={`article-${article.number}`}
              contentSnippet={article.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  dbArticles?: Array<{ number: string; title: string; text: string; category: string; partNum: number; explanation?: string }>;
}

export function ArticleExplorer({ dbArticles }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Merge DB articles with static, static fills gaps
  const allArticles = useMemo(() => {
    const staticMap = new Map(ARTICLES_DATA.map((a) => [a.number, a]));
    if (dbArticles) {
      for (const db of dbArticles) {
        if (!staticMap.has(db.number)) {
          staticMap.set(db.number, {
            number: db.number,
            title: db.title,
            text: db.text,
            explanation: db.explanation || db.text.slice(0, 300),
            category: db.category || "other",
            partNum: db.partNum || 0,
            relatedArticles: [],
          });
        }
      }
    }
    // Sort by article number
    return Array.from(staticMap.values()).sort((a, b) => {
      const numA = parseFloat(a.number.replace(/[A-Z]/g, ""));
      const numB = parseFloat(b.number.replace(/[A-Z]/g, ""));
      return numA - numB;
    });
  }, [dbArticles]);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(allArticles.map((a) => a.category)))],
    [allArticles]
  );

  const filtered = useMemo(() => {
    return allArticles.filter((a) => {
      const matchCat = selectedCategory === "all" || a.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.number.includes(q) ||
        a.explanation.toLowerCase().includes(q) ||
        a.keywords?.some((k: string) => k.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [allArticles, selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter articles..."
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-saffron-400"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-saffron-400"
        >
          <option value="all">All Categories</option>
          {categories.filter((c) => c !== "all").map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c] || c}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-slate-400">
        {filtered.length} article{filtered.length !== 1 ? "s" : ""} shown
      </p>

      {/* Articles by part */}
      {(() => {
        const byPart = new Map<number, ArticleData[]>();
        for (const a of filtered) {
          if (!byPart.has(a.partNum)) byPart.set(a.partNum, []);
          byPart.get(a.partNum)!.push(a);
        }
        const sortedParts = Array.from(byPart.entries()).sort(([a], [b]) => a - b);

        return sortedParts.map(([partNum, articles]) => (
          <div key={partNum}>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
              Part {PART_NAMES[partNum] || partNum}
            </h3>
            <div className="space-y-2">
              {articles.map((article) => (
                <ArticleCard
                  key={article.number}
                  article={article}
                  isExpanded={expandedIds.has(article.number)}
                  onToggle={() => toggleExpand(article.number)}
                />
              ))}
            </div>
          </div>
        ));
      })()}
    </div>
  );
}
