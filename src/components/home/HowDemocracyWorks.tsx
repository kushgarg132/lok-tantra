"use client";

import { useState } from "react";

const layers = [
  {
    id: "people",
    name: "People of India",
    description: "The ultimate sovereign — all power derives from the people through elections and constitutional mandate",
    color: "from-amber-400 to-amber-500",
    articles: "Preamble",
    detail: "1.4+ billion citizens exercising universal adult franchise",
  },
  {
    id: "constitution",
    name: "Constitution of India",
    description: "The supreme law — establishes the framework, grants powers, defines rights, and limits authority",
    color: "from-saffron-400 to-saffron-600",
    articles: "395 Articles, 12 Schedules",
    detail: "Adopted on 26 January 1950, the longest written constitution of any country",
  },
  {
    id: "branches",
    name: "Three Branches",
    description: "Separation of powers with checks and balances — Legislature, Executive, and Judiciary",
    color: "from-blue-400 to-blue-600",
    articles: "Parts V, VI, XV",
    detail: "Each branch has distinct powers but can check the others",
    children: [
      { name: "Legislature", desc: "Makes laws", icon: "📜" },
      { name: "Executive", desc: "Implements laws", icon: "🏛️" },
      { name: "Judiciary", desc: "Interprets laws", icon: "⚖️" },
    ],
  },
  {
    id: "central",
    name: "Union Government",
    description: "Central government with nationwide jurisdiction — Parliament, PM & Council of Ministers, Supreme Court",
    color: "from-indigo-400 to-indigo-600",
    articles: "Parts V, XIV",
    detail: "Located in New Delhi, governs subjects in the Union and Concurrent Lists",
  },
  {
    id: "state",
    name: "State Governments",
    description: "28 states and 8 UTs — each with their own legislature, executive, and high court",
    color: "from-violet-400 to-violet-600",
    articles: "Parts VI, VIII",
    detail: "Govern subjects in the State List, share power on Concurrent List",
  },
  {
    id: "district",
    name: "District Administration",
    description: "District Collector/Magistrate heads the district — coordinates all departments",
    color: "from-purple-400 to-purple-600",
    articles: "Part IX, IXA",
    detail: "Key unit of governance connecting state policy to ground-level implementation",
  },
  {
    id: "local",
    name: "Local Self-Government",
    description: "Panchayats in rural areas and Municipalities in urban areas — grassroots democracy",
    color: "from-emerald-400 to-emerald-600",
    articles: "Articles 243-243ZG",
    detail: "73rd and 74th Amendments empowered local bodies with constitutional status",
  },
];

export function HowDemocracyWorks() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-heading">
            How Indian Democracy Works
          </h2>
          <p className="section-subheading mx-auto mt-3">
            Power flows from the people, through the Constitution, down to every village. Click any layer to explore.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {layers.map((layer, index) => (
            <div key={layer.id}>
              {/* Connector arrow */}
              {index > 0 && (
                <div className="flex justify-center py-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-300 dark:text-slate-600">
                    <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}

              <button
                onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                className={`w-full text-left rounded-2xl p-5 transition-all duration-300 border-2 ${
                  activeLayer === layer.id
                    ? "border-saffron-400 dark:border-saffron-500 shadow-lg scale-[1.01]"
                    : "border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                } bg-white dark:bg-slate-800`}
                style={{
                  marginLeft: `${index * 12}px`,
                  marginRight: `${index * 12}px`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-display font-bold text-slate-900 dark:text-slate-100">
                        {layer.name}
                      </h3>
                      <span className="badge-saffron text-[10px]">
                        {layer.articles}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {layer.description}
                    </p>

                    {activeLayer === layer.id && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 animate-fade-in">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {layer.detail}
                        </p>
                        {layer.children && (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            {layer.children.map((child) => (
                              <div
                                key={child.name}
                                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center"
                              >
                                <div className="text-xl mb-1">{child.icon}</div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {child.name}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {child.desc}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${activeLayer === layer.id ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
