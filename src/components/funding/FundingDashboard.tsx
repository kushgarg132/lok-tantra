"use client";

import { useState } from "react";
import { ElectoralBondPanel } from "./ElectoralBondPanel";
import { DonationFlowPanel } from "./DonationFlowPanel";
import { AffidavitPanel } from "./AffidavitPanel";
import { InfluenceMapPanel } from "./InfluenceMapPanel";

type Tab = "bonds" | "flow" | "affidavit" | "influence";

const TABS: { id: Tab; label: string; icon: string; description: string; badge: string; badgeColor: string }[] = [
  {
    id: "bonds",
    label: "Electoral Bonds",
    icon: "🏦",
    description: "₹16,518 crore in anonymous corporate bonds — who bought them and who received them",
    badge: "Struck down Feb 2024",
    badgeColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },
  {
    id: "flow",
    label: "Donation Flows",
    icon: "💸",
    description: "Sector-wise funding flows from corporates to political parties — Sankey and matrix views",
    badge: "ADR + SBI data",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    id: "affidavit",
    label: "MP Affidavits",
    icon: "📄",
    description: "Declared assets, liabilities, criminal cases, and wealth growth of elected representatives",
    badge: "18th Lok Sabha",
    badgeColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    id: "influence",
    label: "Influence Map",
    icon: "🕸️",
    description: "Network visualization: donors → parties → policy domains — follow the money trail",
    badge: "Interactive",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
];

const LEGAL_FRAMEWORK = [
  { article: "Section 29C, RPA 1951", label: "Parties must disclose donations above ₹20,000" },
  { article: "Section 77, RPA 1951", label: "Candidates must submit election expenditure returns within 30 days" },
  { article: "Section 8, RPA 1951", label: "Conviction (≥2 yr imprisonment) = disqualification" },
  { article: "Section 33A, RPA 1951", label: "Candidates must declare criminal antecedents in nomination form" },
  { article: "Rule 4A, CER 1961",    label: "Affidavit: assets, liabilities, education, criminal cases" },
  { article: "SC — ADR 2002",        label: "Mandatory disclosure of criminal cases by all candidates" },
  { article: "SC — Lily Thomas 2013",label: "Immediate disqualification upon conviction, no stay" },
  { article: "SC — ADR 2024",        label: "Electoral Bond Scheme struck down as unconstitutional" },
];

export function FundingDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("bonds");
  const [showLegal, setShowLegal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Tab selector */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${activeTab === tab.id ? "border-indigo-400 shadow-sm bg-indigo-50 dark:bg-indigo-900/20" : "border-transparent bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800"}`}>
            <div className="text-2xl mb-2">{tab.icon}</div>
            <div className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">{tab.label}</div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${tab.badgeColor}`}>{tab.badge}</span>
            <p className="text-[10px] text-slate-500 leading-snug mt-1.5 line-clamp-2">{tab.description}</p>
          </button>
        ))}
      </div>

      {/* Legal framework toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
        <button onClick={() => setShowLegal((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 transition-colors shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
          {showLegal ? "Hide" : "Show"} legal framework
        </button>
        <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
      </div>

      {showLegal && (
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Transparency & Accountability Framework</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {LEGAL_FRAMEWORK.map((l) => (
              <div key={l.article} className="flex gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
                <span className="font-mono text-indigo-500 shrink-0 text-[10px] mt-0.5">{l.article}</span>
                <span className="text-slate-600 dark:text-slate-400">{l.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] text-slate-400">
            Sources: Representation of the People Act 1951 · Conduct of Elections Rules 1961 · Supreme Court of India judgments
          </div>
        </div>
      )}

      {/* Active panel */}
      <div>
        {activeTab === "bonds"     && <ElectoralBondPanel />}
        {activeTab === "flow"      && <DonationFlowPanel />}
        {activeTab === "affidavit" && <AffidavitPanel />}
        {activeTab === "influence" && <InfluenceMapPanel />}
      </div>
    </div>
  );
}
