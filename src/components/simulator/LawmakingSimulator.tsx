"use client";

import { useState } from "react";
import { BillPipelineSim } from "./BillPipelineSim";
import { CoalitionNegotiationSim } from "./CoalitionNegotiationSim";
import { ConstitutionalAmendmentSim } from "./ConstitutionalAmendmentSim";
import { ConfidenceMotionSim } from "./ConfidenceMotionSim";

type Tab = "pipeline" | "coalition" | "amendment" | "confidence";

const TABS: { id: Tab; label: string; icon: string; description: string; difficulty: string; time: string; diffColor: string }[] = [
  {
    id: "pipeline",
    label: "Bill Pipeline",
    icon: "📋",
    description: "Guide a real bill through all 6 stages — introduction, committee, debate, voting, presidential assent, and judicial review. Every choice affects the outcome.",
    difficulty: "Beginner",
    time: "10 min",
    diffColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    id: "coalition",
    label: "Coalition Negotiation",
    icon: "🤝",
    description: "Your party won 240 seats — 32 short of majority. Negotiate with 6 regional partners. Allocate cabinet berths, accept demands, build a coalition government.",
    difficulty: "Intermediate",
    time: "8 min",
    diffColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    id: "amendment",
    label: "Constitutional Amendment",
    icon: "📜",
    description: "Navigate Article 368 — the hardest legislative process. Special majorities, state ratification, mandatory presidential assent, and the basic structure doctrine.",
    difficulty: "Advanced",
    time: "12 min",
    diffColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    id: "confidence",
    label: "Confidence Motion",
    icon: "🚨",
    description: "The opposition has tabled a no-confidence motion. Your minority government needs 14 more votes in 10 days. Manage floor partners before the Speaker calls the vote.",
    difficulty: "Advanced",
    time: "10 min",
    diffColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },
];

const LEARNING_CONTEXT: Record<Tab, { articles: string[]; keyPrinciples: string[] }> = {
  pipeline: {
    articles: ["Art. 107 — Stages of Bills", "Art. 108 — Joint Sitting", "Art. 110 — Money Bills", "Art. 111 — Presidential Assent", "10th Schedule — Anti-Defection"],
    keyPrinciples: ["Government bills vs Private Member Bills", "Committee scrutiny strengthens legitimacy", "Special majority not needed for ordinary bills", "President can return bill once (not Money Bills)", "SC can strike down law under Art. 13"],
  },
  coalition: {
    articles: ["Art. 75 — PM appointed by President", "Art. 74 — Cabinet advice binding", "Art. 93 — Speaker election", "10th Schedule — Anti-Defection Law"],
    keyPrinciples: ["PM must command Lok Sabha majority", "Coalition government: Common Minimum Programme", "Anti-defection applies to coalition MPs too", "President invites largest party/coalition first", "Floor test settles disputes about majority"],
  },
  amendment: {
    articles: ["Art. 368 — Power to amend", "Art. 13 — Laws void if inconsistent with rights", "Art. 143 — SC advisory jurisdiction"],
    keyPrinciples: ["Special majority = 2/3 present & voting + 50%+ total", "No joint sitting for constitutional amendments", "14 states must ratify federal amendments", "President cannot withhold assent to amendments", "Basic structure cannot be amended (Kesavananda 1973)"],
  },
  confidence: {
    articles: ["Art. 75(3) — Collective responsibility", "Art. 85 — Dissolution of Lok Sabha", "Rule 198 — No-confidence motion", "10th Schedule — Anti-Defection"],
    keyPrinciples: ["Motion admitted if 50+ MPs support", "Speaker fixes date within 10 days", "Government must resign if motion passes", "President can dissolve house or invite opposition", "Abstentions lower effective majority threshold"],
  },
};

export function LawmakingSimulator() {
  const [activeTab, setActiveTab] = useState<Tab>("pipeline");
  const [showContext, setShowContext] = useState(false);
  const ctx = LEARNING_CONTEXT[activeTab];
  const tabInfo = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-6">
      {/* Simulator selector */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setShowContext(false); }}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${activeTab === tab.id ? "border-indigo-400 shadow-sm bg-indigo-50 dark:bg-indigo-900/20" : "border-transparent bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800"}`}
          >
            <div className="text-2xl mb-2">{tab.icon}</div>
            <div className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">{tab.label}</div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-semibold ${tab.diffColor}`}>{tab.difficulty}</span>
              <span className="text-[10px] text-slate-400">{tab.time}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug line-clamp-3">{tab.description}</p>
          </button>
        ))}
      </div>

      {/* Context panel toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
        <button
          onClick={() => setShowContext((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 transition-colors shrink-0"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
          {showContext ? "Hide" : "Show"} constitutional context
        </button>
        <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
      </div>

      {showContext && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-4">
            <div className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Relevant Articles</div>
            <div className="space-y-1">
              {ctx.articles.map((a) => (
                <div key={a} className="font-mono text-[10px] px-2 py-1.5 bg-slate-50 dark:bg-slate-800/60 rounded text-slate-500">{a}</div>
              ))}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Key Principles</div>
            <ul className="space-y-1.5">
              {ctx.keyPrinciples.map((p) => (
                <li key={p} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="text-indigo-400 shrink-0">→</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Active simulator */}
      <div>
        {activeTab === "pipeline" && <BillPipelineSim />}
        {activeTab === "coalition" && <CoalitionNegotiationSim />}
        {activeTab === "amendment" && <ConstitutionalAmendmentSim />}
        {activeTab === "confidence" && <ConfidenceMotionSim />}
      </div>
    </div>
  );
}
