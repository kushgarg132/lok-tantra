"use client";

import { useState } from "react";
import type { ArticleDTO } from "./ConstitutionExplorer";

const DPSP_CATEGORIES = [
  {
    id: "socialist",
    title: "Socialist Principles",
    color: "emerald",
    articles: ["39", "39A", "41", "42", "43", "43A", "47"],
    description: "Welfare state provisions: right to work, equal pay, living wage, maternity relief, free legal aid, public health.",
  },
  {
    id: "gandhian",
    title: "Gandhian Principles",
    color: "amber",
    articles: ["40", "43", "43B", "46", "47", "48"],
    description: "Inspired by Gandhian philosophy: village panchayats, cottage industries, welfare of weaker sections, prohibition.",
  },
  {
    id: "liberal",
    title: "Liberal-Intellectual Principles",
    color: "blue",
    articles: ["44", "45", "48A", "49", "50", "51"],
    description: "Uniform civil code, early childhood education, environmental protection, monuments preservation, separation of powers, international peace.",
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; border: string; badge: string; num: string }> = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/10",
    border: "border-emerald-200 dark:border-emerald-800",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    num: "bg-emerald-500 text-white",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/10",
    border: "border-amber-200 dark:border-amber-800",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    num: "bg-amber-500 text-white",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/10",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    num: "bg-blue-500 text-white",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/10",
    border: "border-purple-200 dark:border-purple-800",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    num: "bg-purple-500 text-white",
  },
};

const FR_VS_DPSP = [
  {
    aspect: "Nature",
    fr: "Justiciable — courts can enforce them",
    dpsp: "Non-justiciable — courts cannot enforce them (Art. 37)",
  },
  {
    aspect: "Origin",
    fr: "Inspired by American Bill of Rights",
    dpsp: "Inspired by Irish Constitution (Irish DPSP)",
  },
  {
    aspect: "Who benefits",
    fr: "Individuals (citizens & some to all persons)",
    dpsp: "Society as a whole",
  },
  {
    aspect: "Relationship",
    fr: "Negative rights — restrict government",
    dpsp: "Positive rights — direct government action",
  },
  {
    aspect: "Priority (post-Minerva Mills)",
    fr: "FRs and DPSPs must be harmonized; neither absolutely overrides the other",
    dpsp: "Parliament can restrict FRs to implement DPSPs (Art. 31C, with limits)",
  },
];

interface Props { articles: ArticleDTO[] }

export function DPSPExplorer({ articles }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showDuties, setShowDuties] = useState(false);

  const dpspArticles = articles.filter((a) => a.category === "dpsp" || a.number === "51A");

  const currentCategory = DPSP_CATEGORIES.find((c) => c.id === selectedCategory);
  const categoryArticles = currentCategory
    ? currentCategory.articles
        .map((n) => dpspArticles.find((a) => a.number === n))
        .filter(Boolean)
    : [];

  const fundamentalDuties = articles.find((a) => a.number === "51A");

  return (
    <div className="space-y-6">
      {/* Context */}
      <div className="card p-5 border-l-4 border-emerald-400">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <strong>Part IV (Articles 36-51)</strong> lists Directive Principles of State Policy — guidelines for the State in governance.
          They are <strong>non-justiciable</strong> (Art. 37) but courts can use them to interpret laws.
          Classified into three types: Socialist, Gandhian, and Liberal-Intellectual.
        </p>
      </div>

      {/* Category selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DPSP_CATEGORIES.map((category) => {
          const colors = CATEGORY_COLORS[category.color];
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(isSelected ? null : category.id);
                setExpandedArticle(null);
              }}
              className={`text-left p-5 rounded-2xl border-2 transition-all ${colors.bg} ${
                isSelected
                  ? colors.border + " shadow-lg"
                  : "border-transparent hover:" + colors.border
              }`}
            >
              <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-2">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {category.articles.map((a) => (
                  <span key={a} className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.num}`}>
                    {a}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {category.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected category articles */}
      {currentCategory && (
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
            {currentCategory.title}
          </h3>
          {categoryArticles.length === 0 && (
            <p className="text-sm text-slate-400">These articles have not yet been added to the explorer.</p>
          )}
          {categoryArticles.map((article) => {
            if (!article) return null;
            const isExpanded = expandedArticle === article.number;
            const colors = CATEGORY_COLORS[currentCategory.color];
            return (
              <div
                key={article.number}
                className={`card transition-all ${isExpanded ? colors.border + " border-2" : ""}`}
              >
                <button
                  className="w-full text-left p-4"
                  onClick={() => setExpandedArticle(isExpanded ? null : article.number)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`shrink-0 text-xs font-bold px-2.5 py-1.5 rounded-lg ${colors.num}`}>
                      {article.number}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex-1 text-left">
                      {article.title}
                    </span>
                    <svg
                      className={`shrink-0 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="text-xs italic text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 leading-relaxed border-l-2 border-slate-300">
                      {article.text.slice(0, 500)}{article.text.length > 500 ? "..." : ""}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {article.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FR vs DPSP comparison */}
      <div className="card overflow-hidden">
        <button
          className="w-full text-left p-5 flex items-center justify-between"
          onClick={() => setShowComparison(!showComparison)}
        >
          <div>
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">
              Fundamental Rights vs DPSP — Key Differences
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Understanding the relationship between Part III and Part IV
            </p>
          </div>
          <svg
            className={`text-slate-400 transition-transform ${showComparison ? "rotate-180" : ""}`}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {showComparison && (
          <div className="border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase w-1/4">Aspect</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-saffron-600 uppercase">Fundamental Rights (Part III)</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-emerald-600 uppercase">DPSP (Part IV)</th>
                </tr>
              </thead>
              <tbody>
                {FR_VS_DPSP.map((row, i) => (
                  <tr key={row.aspect} className={i % 2 === 0 ? "" : "bg-slate-50/50 dark:bg-slate-800/20"}>
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-xs align-top">
                      {row.aspect}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs align-top">
                      {row.fr}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs align-top">
                      {row.dpsp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fundamental Duties */}
      <div className="card overflow-hidden">
        <button
          className="w-full text-left p-5 flex items-center justify-between"
          onClick={() => setShowDuties(!showDuties)}
        >
          <div>
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">
              Part IVA — Fundamental Duties (Art. 51A)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Added by 42nd Amendment (1976), expanded by 86th Amendment (2002)
            </p>
          </div>
          <svg
            className={`text-slate-400 transition-transform ${showDuties ? "rotate-180" : ""}`}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {showDuties && fundamentalDuties && (
          <div className="border-t border-slate-100 dark:border-slate-800 p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { letter: "a", duty: "Abide by the Constitution and respect national flag and anthem" },
                { letter: "b", duty: "Cherish and follow noble ideals of the freedom struggle" },
                { letter: "c", duty: "Uphold and protect sovereignty, unity and integrity of India" },
                { letter: "d", duty: "Defend the country and render national service when called upon" },
                { letter: "e", duty: "Promote harmony and spirit of common brotherhood; renounce practices derogatory to women's dignity" },
                { letter: "f", duty: "Value and preserve the rich heritage of our composite culture" },
                { letter: "g", duty: "Protect and improve the natural environment; compassion for living creatures" },
                { letter: "h", duty: "Develop scientific temper, humanism and spirit of inquiry and reform" },
                { letter: "i", duty: "Safeguard public property and abjure violence" },
                { letter: "j", duty: "Strive towards excellence in all spheres of individual and collective activity" },
                { letter: "k", duty: "Parents/guardians to provide education to children aged 6-14" },
              ].map(({ letter, duty }) => (
                <div
                  key={letter}
                  className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center">
                    {letter}
                  </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{duty}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Fundamental Duties are non-justiciable — courts cannot enforce them. However, Parliament can make laws to enforce them, and courts use them as interpretive tools.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
