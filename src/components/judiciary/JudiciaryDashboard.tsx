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

// ─── Types from DB (backward compat) ─────────────────────────────────────────
interface CourtDB { id: string; name: string; type: string; description?: string | null; basis?: string | null; judges?: string | null; powers: string[] }
interface CaseDB  { id: string; name: string; year: number; citation?: string | null; summary: string; impact?: string | null; articlesInterpreted: { id: string; number: string }[] }
interface WritDB  { id: string; name: string; meaning: string; usage: string }

interface Props {
  courts: CourtDB[];
  cases: CaseDB[];
  writs: WritDB[];
}

type TabId = "hierarchy" | "highcourts" | "judgments" | "benches" | "pil" | "appeals" | "graph" | "review";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "hierarchy",  label: "Court Hierarchy", icon: "🏛️" },
  { id: "highcourts", label: "High Courts",      icon: "⚖️" },
  { id: "judgments",  label: "Landmark Cases",   icon: "📜" },
  { id: "benches",    label: "Constitution Benches", icon: "👨‍⚖️" },
  { id: "pil",        label: "PIL Workflow",     icon: "🔍" },
  { id: "appeals",    label: "Appeals Flow",     icon: "↑" },
  { id: "graph",      label: "Judgment Graph",   icon: "🕸️" },
  { id: "review",     label: "Judicial Review",  icon: "🛡️" },
];

export function JudiciaryDashboard({ courts, cases, writs }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("hierarchy");

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-amber-600">34</div>
          <div className="text-xs text-slate-500 mt-1">SC Judges (sanctioned)</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-emerald-600">25</div>
          <div className="text-xs text-slate-500 mt-1">High Courts</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100">5 Cr+</div>
          <div className="text-xs text-slate-500 mt-1">Pending Cases (India)</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-purple-600">1973</div>
          <div className="text-xs text-slate-500 mt-1">Basic Structure Doctrine</div>
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

      {/* Panels */}
      {activeTab === "hierarchy"  && <CourtHierarchyPanel />}
      {activeTab === "highcourts" && <HighCourtsPanel />}
      {activeTab === "judgments"  && <LandmarkJudgmentsPanel />}
      {activeTab === "benches"    && <ConstitutionalBenchesPanel />}
      {activeTab === "pil"        && <PILWorkflowPanel />}
      {activeTab === "appeals"    && <AppealsFlowPanel />}
      {activeTab === "graph"      && <JudgmentGraphPanel />}
      {activeTab === "review"     && <JudicialReviewPanel />}

      {/* Legacy DB data when seeded */}
      {activeTab === "hierarchy" && courts.length > 0 && (
        <div className="mt-8 card p-6">
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">DB Court Records</h3>
          <div className="space-y-3">
            {courts.map((court) => (
              <div key={court.id} className="border-l-4 border-l-emerald-400 pl-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{court.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{court.basis}</span>
                </div>
                {court.description && <p className="text-xs text-slate-500 mt-0.5">{court.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "judgments" && cases.length > 0 && (
        <div className="mt-8 card p-6">
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">DB Landmark Cases</h3>
          <div className="space-y-3">
            {cases.slice(0, 5).map((c) => (
              <div key={c.id} className="border-l-4 border-l-purple-400 pl-4 py-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{c.name}</span>
                  <span className="text-xs text-slate-400">{c.year}</span>
                  {c.citation && <span className="font-mono text-[10px] text-slate-400">{c.citation}</span>}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{c.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
