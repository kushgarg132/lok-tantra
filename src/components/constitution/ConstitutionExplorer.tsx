"use client";

import { useState } from "react";
import { SemanticSearch } from "./SemanticSearch";
import { ArticleExplorer } from "./ArticleExplorer";
import { FundamentalRightsExplorer } from "./FundamentalRightsExplorer";
import { DPSPExplorer } from "./DPSPExplorer";
import { AmendmentTimeline } from "./AmendmentTimeline";
import { DoctrineExplorer } from "./DoctrineCard";
import { ConstitutionGraph } from "./ConstitutionGraph";

const PREAMBLE = `WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens:

JUSTICE, social, economic and political;

LIBERTY of thought, expression, belief, faith and worship;

EQUALITY of status and of opportunity;

and to promote among them all

FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation;

IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.`;

export interface ArticleDTO {
  id: string;
  number: string;
  title: string;
  text: string;
  explanation: string | null;
  category: string;
  partNum?: number;
  relatedArticles: string[];
  amendments: { id: string; number: number; year: number; description: string; significance: string }[];
  cases: { id: string; name: string }[];
}

export interface AmendmentDTO {
  id: string;
  number: number;
  year: number;
  title: string;
  description: string | null;
  significance?: string | null;
  articlesAmended?: string[] | null;
}

export interface CaseDTO {
  id: string;
  name: string;
  citation: string | null;
  year: number;
  summary: string;
  significance: string;
  impact: string | null;
  articlesInterpreted: string[];
}

export interface PartDTO {
  number: number;
  name: string;
  articles: string;
}

type Tab = "search" | "preamble" | "articles" | "fundamental-rights" | "dpsp" | "amendments" | "cases" | "doctrines" | "graph";

const TABS: { id: Tab; label: string; shortLabel?: string }[] = [
  { id: "search", label: "AI Search" },
  { id: "preamble", label: "Preamble" },
  { id: "articles", label: "All Articles" },
  { id: "fundamental-rights", label: "Fundamental Rights", shortLabel: "FR" },
  { id: "dpsp", label: "DPSP & Duties", shortLabel: "DPSP" },
  { id: "amendments", label: "Amendments" },
  { id: "cases", label: "Landmark Cases", shortLabel: "Cases" },
  { id: "doctrines", label: "Doctrines" },
  { id: "graph", label: "Graph" },
];

interface Props {
  parts: PartDTO[];
  articles: ArticleDTO[];
  amendments: AmendmentDTO[];
  cases: CaseDTO[];
}

export function ConstitutionExplorer({ parts, articles, amendments, cases }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("search");

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
      {/* Tab bar */}
      <div className="overflow-x-auto pb-1 mb-8 -mx-4 px-4">
        <div className="flex gap-1 rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800/50 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-700 text-saffron-600 dark:text-saffron-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel || tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "search" && <SemanticSearch />}
        {activeTab === "preamble" && <PreambleView />}
        {activeTab === "articles" && (
          <ArticleExplorer
            dbArticles={articles.map((a) => ({
              number: a.number,
              title: a.title,
              text: a.text,
              explanation: a.explanation || undefined,
              category: a.category,
              partNum: a.partNum || 0,
            }))}
          />
        )}
        {activeTab === "fundamental-rights" && <FundamentalRightsExplorer />}
        {activeTab === "dpsp" && <DPSPExplorer />}
        {activeTab === "amendments" && <AmendmentTimeline amendments={amendments} />}
        {activeTab === "cases" && <CasesView cases={cases} />}
        {activeTab === "doctrines" && <DoctrineExplorer />}
        {activeTab === "graph" && <ConstitutionGraph />}
      </div>
    </div>
  );
}

// ─── Preamble ─────────────────────────────────────────────────────────────────
function PreambleView() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-8 md:p-12 border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-900/10 dark:to-slate-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-1 rounded-full bg-saffron-500" />
            <div className="w-8 h-1 rounded-full bg-white border border-slate-200" />
            <div className="w-8 h-1 rounded-full bg-chakra-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">
            Preamble to the Constitution
          </h2>
          <p className="text-sm text-slate-500 mt-1">The soul of the Constitution</p>
        </div>

        <blockquote className="text-lg leading-relaxed text-slate-800 dark:text-slate-200 font-serif whitespace-pre-line text-center">
          {PREAMBLE}
        </blockquote>

        <div className="mt-8 p-4 rounded-xl bg-amber-100/50 dark:bg-amber-900/20">
          <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">Key Concepts</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {["Sovereign", "Socialist", "Secular", "Democratic", "Republic", "Justice", "Liberty", "Equality", "Fraternity"].map((word) => (
              <span key={word} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-sm font-medium text-amber-700 dark:text-amber-400 text-center">
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400 space-y-2">
          <p>
            <strong>Note:</strong> The words &ldquo;Socialist&rdquo; and &ldquo;Secular&rdquo; were added by the 42nd Amendment (1976).
            The Preamble is part of the Constitution and subject to the Basic Structure Doctrine (Kesavananda Bharati, 1973).
          </p>
        </div>
      </div>

      {/* Structure overview */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Parts", value: "25", sub: "covering all aspects of governance" },
          { label: "Original Articles", value: "395", sub: "now effective articles differ" },
          { label: "Schedules", value: "12", sub: "from state lists to anti-defection" },
          { label: "Amendments", value: "106+", sub: "as of 2024 (most in any written constitution)" },
          { label: "Languages", value: "2", sub: "authenticated in Hindi & English" },
          { label: "Years Drafted", value: "2 yr 11 mo 18 d", sub: "Nov 1946 – Nov 1949" },
        ].map((item) => (
          <div key={item.label} className="card p-4 text-center">
            <div className="text-2xl font-bold text-saffron-600 dark:text-saffron-400">{item.value}</div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">{item.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Landmark Cases ───────────────────────────────────────────────────────────
function CasesView({ cases }: { cases: CaseDTO[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = cases.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      c.significance.toLowerCase().includes(q) ||
      String(c.year).includes(q)
    );
  });

  // Always show key cases if DB is empty
  const displayCases =
    filtered.length > 0
      ? filtered
      : [
          {
            id: "static-kesavananda",
            name: "Kesavananda Bharati v. State of Kerala",
            citation: "AIR 1973 SC 1461",
            year: 1973,
            summary: "Established the Basic Structure Doctrine — Parliament cannot amend the Constitution to destroy its essential features.",
            significance: "Established the Basic Structure Doctrine; most important constitutional case in Indian history.",
            impact: "Limited Parliament's amending power under Art 368; judge-made doctrine unique to India.",
            articlesInterpreted: ["368", "13", "14", "19", "21"],
          },
          {
            id: "static-maneka",
            name: "Maneka Gandhi v. Union of India",
            citation: "AIR 1978 SC 597",
            year: 1978,
            summary: "Expanded Art. 21 — procedure for depriving life/liberty must be fair, just, and reasonable, not just any procedure enacted by law.",
            significance: "Transformed Art. 21 from a narrow procedural right to a substantive right; birthed Indian due process doctrine.",
            impact: "Changed interpretation of 'procedure established by law' to require procedural fairness.",
            articlesInterpreted: ["21", "14", "19"],
          },
          {
            id: "static-puttaswamy",
            name: "K.S. Puttaswamy v. Union of India (Privacy)",
            citation: "2017 10 SCC 1",
            year: 2017,
            summary: "Held that right to privacy is a fundamental right under Art. 21, overruling M.P. Sharma (1954) and Kharak Singh (1963).",
            significance: "Landmark 9-judge bench; established privacy as a fundamental right; introduced proportionality test.",
            impact: "Foundation for data protection legislation; affected Aadhaar Act, surveillance laws.",
            articlesInterpreted: ["21", "14", "19"],
          },
          {
            id: "static-bommai",
            name: "S.R. Bommai v. Union of India",
            citation: "AIR 1994 SC 1918",
            year: 1994,
            summary: "President's Rule under Art. 356 is subject to judicial review; floor test must be held before imposing President's Rule.",
            significance: "Severely restricted political misuse of Art. 356; federalism strengthened.",
            impact: "Governor must hold floor test before recommending President's Rule; courts can review proclamation.",
            articlesInterpreted: ["356", "74", "163"],
          },
        ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search landmark cases..."
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-saffron-400"
        />
      </div>

      {displayCases.map((c) => {
        const isExpanded = expandedId === c.id;
        return (
          <div key={c.id} className="card overflow-hidden">
            <button
              onClick={() => setExpandedId(isExpanded ? null : c.id)}
              className="w-full p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs text-slate-400 font-medium">{c.year}</span>
                    {c.citation && (
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {c.citation}
                      </span>
                    )}
                  </div>
                  <h4 className="font-display font-bold text-slate-900 dark:text-slate-100">
                    {c.name}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {c.summary}
                  </p>
                </div>
                <svg
                  className={`shrink-0 text-slate-400 transition-transform mt-1 ${isExpanded ? "rotate-180" : ""}`}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-700 pt-4 space-y-4">
                <div>
                  <h5 className="text-xs font-semibold text-slate-400 uppercase mb-1">Significance</h5>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{c.significance}</p>
                </div>
                {c.impact && (
                  <div>
                    <h5 className="text-xs font-semibold text-slate-400 uppercase mb-1">Impact</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{c.impact}</p>
                  </div>
                )}
                {c.articlesInterpreted.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold text-slate-400 uppercase mb-2">Articles Interpreted</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {c.articlesInterpreted.map((a) => (
                        <span key={a} className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          Art. {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
