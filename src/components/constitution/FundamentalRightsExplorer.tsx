"use client";

import { useState } from "react";
import { ARTICLES_DATA } from "@/data/constitution/articles-data";

const FR_GROUPS = [
  {
    id: "equality",
    title: "Right to Equality",
    articles: ["14", "15", "16", "17", "18"],
    color: "saffron",
    icon: "⚖️",
    description: "Equality before law; prohibition of discrimination; equal opportunity in public employment; abolition of untouchability and titles.",
  },
  {
    id: "freedom",
    title: "Right to Freedom",
    articles: ["19", "20", "21", "21A", "22"],
    color: "emerald",
    icon: "🕊️",
    description: "Six freedoms (speech, assembly, movement, residence, profession); protections against conviction; right to life and liberty; right to education; protection against arrest.",
  },
  {
    id: "exploitation",
    title: "Right Against Exploitation",
    articles: ["23", "24"],
    color: "amber",
    icon: "🛡️",
    description: "Prohibition of human trafficking, forced labour, and employment of children in hazardous occupations.",
  },
  {
    id: "religion",
    title: "Right to Freedom of Religion",
    articles: ["25", "26", "27", "28"],
    color: "purple",
    icon: "🙏",
    description: "Freedom of conscience; right to profess, practise, and propagate religion; manage religious affairs; no compulsory taxes for religion; no religious instruction in state schools.",
  },
  {
    id: "cultural",
    title: "Cultural and Educational Rights",
    articles: ["29", "30"],
    color: "blue",
    icon: "📚",
    description: "Protection of minority languages, scripts, and cultures; right of minorities to establish and administer educational institutions.",
  },
  {
    id: "remedies",
    title: "Right to Constitutional Remedies",
    articles: ["32"],
    color: "red",
    icon: "🔨",
    description: "Guaranteed right to approach the Supreme Court for enforcement of fundamental rights through writs.",
  },
];

const GROUP_COLORS: Record<string, { bg: string; border: string; badge: string; num: string }> = {
  saffron: {
    bg: "bg-saffron-50 dark:bg-saffron-900/10",
    border: "border-saffron-200 dark:border-saffron-800",
    badge: "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300",
    num: "bg-saffron-500 text-white",
  },
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
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/10",
    border: "border-purple-200 dark:border-purple-800",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    num: "bg-purple-500 text-white",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/10",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    num: "bg-blue-500 text-white",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/10",
    border: "border-red-200 dark:border-red-800",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    num: "bg-red-500 text-white",
  },
};

const WRITS = [
  {
    name: "Habeas Corpus",
    latin: "You shall have the body",
    use: "Release a person from illegal detention",
    against: "State & private individuals",
    not: "Lawful detention; absconder cases",
  },
  {
    name: "Mandamus",
    latin: "We command",
    use: "Command a public body to perform a public duty",
    against: "Public authorities, lower courts",
    not: "Private individuals; President/Governor; Chief Justice (judicial capacity)",
  },
  {
    name: "Prohibition",
    latin: "To forbid",
    use: "Prevent an inferior court from exceeding its jurisdiction",
    against: "Inferior courts and tribunals",
    not: "Administrative bodies; legislative bodies; superior courts",
  },
  {
    name: "Certiorari",
    latin: "To be certified",
    use: "Quash an inferior court's order made without jurisdiction or in violation of natural justice",
    against: "Inferior courts and tribunals",
    not: "Pure administrative bodies (though distinction blurred)",
  },
  {
    name: "Quo Warranto",
    latin: "By what authority",
    use: "Challenge a person's claim to a public office",
    against: "Person holding a substantive public office",
    not: "Ministerial offices; private bodies",
  },
];

export function FundamentalRightsExplorer() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [showWrits, setShowWrits] = useState(false);

  const currentGroup = FR_GROUPS.find((g) => g.id === selectedGroup);
  const groupArticles = currentGroup
    ? currentGroup.articles
        .map((n) => ARTICLES_DATA.find((a) => a.number === n))
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="card p-5 border-l-4 border-saffron-400">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <strong>Part III (Articles 12-35)</strong> of the Constitution guarantees six categories of Fundamental Rights.
          They are justiciable — enforceable through courts. Article 32 is itself a Fundamental Right.
          During <strong>National Emergency (Art 352)</strong>, rights under Art 19 are suspended.
          Rights under Art 20 and 21 can <strong>never</strong> be suspended.
        </p>
      </div>

      {/* Group cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FR_GROUPS.map((group) => {
          const colors = GROUP_COLORS[group.color];
          const isSelected = selectedGroup === group.id;
          return (
            <button
              key={group.id}
              onClick={() => {
                setSelectedGroup(isSelected ? null : group.id);
                setExpandedArticle(null);
              }}
              className={`text-left p-5 rounded-2xl border-2 transition-all ${colors.bg} ${
                isSelected ? colors.border + " shadow-lg scale-[1.01]" : "border-transparent hover:" + colors.border
              }`}
            >
              <div className="text-2xl mb-3">{group.icon}</div>
              <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-1">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {group.articles.map((a) => (
                  <span key={a} className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.num}`}>
                    {a}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {group.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected group detail */}
      {currentGroup && groupArticles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
            {currentGroup.title}
          </h3>
          {groupArticles.map((article) => {
            if (!article) return null;
            const isExpanded = expandedArticle === article.number;
            const colors = GROUP_COLORS[currentGroup.color];
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
                    {article.relatedArticles.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {article.relatedArticles.map((a) => (
                          <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            Art. {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Writs section */}
      <div className="card overflow-hidden">
        <button
          className="w-full text-left p-5 flex items-center justify-between"
          onClick={() => setShowWrits(!showWrits)}
        >
          <div>
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">
              The Five Constitutional Writs (Art. 32 & 226)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tools for enforcement of Fundamental Rights
            </p>
          </div>
          <svg
            className={`text-slate-400 transition-transform ${showWrits ? "rotate-180" : ""}`}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {showWrits && (
          <div className="border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Writ</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Latin Meaning</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">When Used</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Cannot Issue Against</th>
                </tr>
              </thead>
              <tbody>
                {WRITS.map((writ, i) => (
                  <tr key={writ.name} className={i % 2 === 0 ? "" : "bg-slate-50/50 dark:bg-slate-800/20"}>
                    <td className="px-4 py-3 font-semibold text-saffron-600 dark:text-saffron-400 whitespace-nowrap">
                      {writ.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500 italic text-xs whitespace-nowrap">
                      {writ.latin}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs">
                      {writ.use}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                      {writ.not}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
