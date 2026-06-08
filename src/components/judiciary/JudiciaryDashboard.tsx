"use client";

import { useState } from "react";
import { CourtHierarchyPanel } from "./CourtHierarchyPanel";
import { HighCourtsPanel } from "./HighCourtsPanel";
import { LandmarkJudgmentsPanel } from "./LandmarkJudgmentsPanel";
import { ConstitutionalBenchesPanel } from "./ConstitutionalBenchesPanel";
import { PILWorkflowPanel } from "./PILWorkflowPanel";
import { AppealsFlowPanel } from "./AppealsFlowPanel";
import { JudgmentGraphPanel } from "./JudgmentGraphPanel";
import { JudicialReviewPanel } from "./JudicialReviewPanel";

export interface CourtDB {
  id: string; name: string; type: string; description?: string | null;
  basis?: string | null; judges?: string | null; powers: string[];
  courtCount?: string | null; courtChildren: string[];
  city?: string | null; states: string[]; region?: string | null;
  benches: string[]; sanctioned?: number | null; notable?: string | null;
  jurisdiction?: string | null;
}
export interface CaseDB {
  id: string; name: string; year: number; citation?: string | null;
  summary: string; significance?: string | null; impact?: string | null;
  articlesInterpreted: { id: string; number: string }[];
}
export interface WritDB { id: string; name: string; meaning: string; usage: string }

interface Props {
  courts: CourtDB[];
  cases: CaseDB[];
  writs: WritDB[];
}

type TabId = "hierarchy" | "highcourts" | "judgments" | "benches" | "pil" | "appeals" | "graph" | "review";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "hierarchy",  label: "Court Hierarchy",     icon: "🏛️" },
  { id: "highcourts", label: "High Courts",          icon: "⚖️" },
  { id: "judgments",  label: "Landmark Cases",       icon: "📜" },
  { id: "benches",    label: "Constitution Benches", icon: "👨‍⚖️" },
  { id: "pil",        label: "PIL Workflow",         icon: "🔍" },
  { id: "appeals",    label: "Appeals Flow",         icon: "↑" },
  { id: "graph",      label: "Judgment Graph",       icon: "🕸️" },
  { id: "review",     label: "Judicial Review",      icon: "🛡️" },
];

export function JudiciaryDashboard({ courts, cases, writs }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("hierarchy");

  const highCourts = courts.filter((c) => c.type === "high");
  const hierarchyCourts = courts.filter((c) => c.type !== "high");

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
      {/* Quick stats from DB */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-amber-600">
            {courts.find((c) => c.type === "supreme")?.sanctioned ?? 34}
          </div>
          <div className="text-xs text-slate-500 mt-1">SC Judges (sanctioned)</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-emerald-600">{highCourts.length || 25}</div>
          <div className="text-xs text-slate-500 mt-1">High Courts</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100">5 Cr+</div>
          <div className="text-xs text-slate-500 mt-1">Pending Cases (India)</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-purple-600">{cases.length || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Landmark Judgments</div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-1 rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800/50 mb-8 w-fit min-w-full sm:min-w-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-700 text-saffron-600 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <span className="hidden sm:inline">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panels — all receive DB data via props */}
      {activeTab === "hierarchy"  && <CourtHierarchyPanel courts={hierarchyCourts} />}
      {activeTab === "highcourts" && <HighCourtsPanel highCourts={highCourts} />}
      {activeTab === "judgments"  && <LandmarkJudgmentsPanel cases={cases} />}
      {activeTab === "benches"    && <ConstitutionalBenchesPanel />}
      {activeTab === "pil"        && <PILWorkflowPanel />}
      {activeTab === "appeals"    && <AppealsFlowPanel />}
      {activeTab === "graph"      && <JudgmentGraphPanel cases={cases} />}
      {activeTab === "review"     && <JudicialReviewPanel writs={writs} />}
    </div>
  );
}
