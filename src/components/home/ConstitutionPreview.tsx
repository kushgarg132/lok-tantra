"use client";

import { useState } from "react";
import Link from "next/link";

const highlights = [
  {
    id: "preamble",
    category: "Preamble",
    title: "The Preamble",
    preview: "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC...",
    detail: "The Preamble declares the source of authority (people), nature of the state (sovereign, socialist, secular, democratic, republic), and objectives (justice, liberty, equality, fraternity).",
    color: "saffron",
  },
  {
    id: "fr",
    category: "Part III",
    title: "Fundamental Rights",
    preview: "Articles 12-35 guarantee six fundamental rights to every citizen — the bedrock of individual liberty.",
    detail: "Right to Equality (14-18), Right to Freedom (19-22), Right against Exploitation (23-24), Right to Freedom of Religion (25-28), Cultural & Educational Rights (29-30), Right to Constitutional Remedies (32).",
    color: "blue",
  },
  {
    id: "dpsp",
    category: "Part IV",
    title: "Directive Principles",
    preview: "Articles 36-51 guide the State in making policies — not enforceable by courts but fundamental in governance.",
    detail: "Include social welfare, equal justice, living wage, free legal aid, uniform civil code, protection of environment, separation of judiciary from executive.",
    color: "emerald",
  },
  {
    id: "duties",
    category: "Part IVA",
    title: "Fundamental Duties",
    preview: "Article 51A lists 11 duties of every citizen — added by the 42nd Amendment in 1976.",
    detail: "Abide by the Constitution, cherish national ideals, protect sovereignty, defend the country, promote harmony, preserve heritage, protect environment, develop scientific temper, safeguard public property, strive for excellence.",
    color: "purple",
  },
];

const colorStyles: Record<string, { badge: string; border: string }> = {
  saffron: { badge: "badge-saffron", border: "border-saffron-300 dark:border-saffron-700" },
  blue: { badge: "badge-navy", border: "border-blue-300 dark:border-blue-700" },
  emerald: { badge: "badge-chakra", border: "border-emerald-300 dark:border-emerald-700" },
  purple: { badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", border: "border-purple-300 dark:border-purple-700" },
};

export function ConstitutionPreview() {
  const [activeId, setActiveId] = useState("preamble");
  const active = highlights.find((h) => h.id === activeId)!;
  const styles = colorStyles[active.color];

  return (
    <section className="py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-heading">The Constitution at Your Fingertips</h2>
          <p className="section-subheading mx-auto mt-3">
            Explore every article, amendment, and fundamental right interactively.
            Understand the supreme law that governs India.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {/* Left: Tabs */}
          <div className="lg:col-span-2 space-y-2">
            {highlights.map((h) => (
              <button
                key={h.id}
                onClick={() => setActiveId(h.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                  activeId === h.id
                    ? `${colorStyles[h.color].border} bg-white dark:bg-slate-800 shadow-md`
                    : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`badge ${colorStyles[h.color].badge} text-[10px]`}>
                    {h.category}
                  </span>
                </div>
                <h3 className="mt-1 font-display font-bold text-slate-900 dark:text-slate-100">
                  {h.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {h.preview}
                </p>
              </button>
            ))}
          </div>

          {/* Right: Detail */}
          <div className={`lg:col-span-3 card p-8 border-2 ${styles.border}`}>
            <span className={`badge ${styles.badge}`}>{active.category}</span>
            <h3 className="mt-3 text-2xl font-display font-bold text-slate-900 dark:text-slate-100">
              {active.title}
            </h3>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-4 border-saffron-400 pl-4">
              {active.preview}
            </p>
            <p className="mt-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {active.detail}
            </p>

            <Link
              href="/constitution"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-saffron-600 dark:text-saffron-400 hover:text-saffron-700"
            >
              Explore full Constitution
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
