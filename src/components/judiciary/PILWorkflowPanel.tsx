"use client";

import { useState } from "react";
import { PIL_STEPS } from "@/data/judiciary/intelligence";

const STEP_COLORS = [
  "border-blue-400 bg-blue-500",
  "border-indigo-400 bg-indigo-500",
  "border-purple-400 bg-purple-500",
  "border-violet-400 bg-violet-500",
  "border-amber-400 bg-amber-500",
  "border-orange-400 bg-orange-500",
  "border-red-400 bg-red-500",
  "border-rose-400 bg-rose-500",
  "border-emerald-400 bg-emerald-500",
  "border-teal-400 bg-teal-500",
];

const FAMOUS_PILS = [
  {
    name: "M.C. Mehta v Union of India",
    year: 1986,
    issue: "Pollution of Yamuna & Ganga rivers",
    outcome: "Decades of environmental orders; CNG buses in Delhi; Taj Mahal protection zones",
    icon: "🌿",
  },
  {
    name: "Vishaka v State of Rajasthan",
    year: 1997,
    issue: "Sexual harassment at workplace",
    outcome: "Vishaka Guidelines issued; replaced by POSH Act 2013",
    icon: "⚖️",
  },
  {
    name: "People's Union for Civil Liberties v Union of India",
    year: 2001,
    issue: "Right to food during drought",
    outcome: "Mid-Day Meal Scheme universalised; food as Fundamental Right under Art. 21",
    icon: "🍽️",
  },
  {
    name: "Hussainara Khatoon v State of Bihar",
    year: 1979,
    issue: "40,000 undertrials in jail beyond max sentence",
    outcome: "Mass release ordered; speedy trial and legal aid = Fundamental Rights",
    icon: "🔑",
  },
  {
    name: "Common Cause v Union of India",
    year: 2018,
    issue: "Right to die with dignity (passive euthanasia)",
    outcome: "Passive euthanasia allowed; advance medical directives (living wills) valid",
    icon: "💙",
  },
  {
    name: "Seshan v Union of India (Electoral Reforms)",
    year: 1995,
    issue: "Code of Conduct enforcement during elections",
    outcome: "Election Commission's powers to enforce Model Code clarified and strengthened",
    icon: "🗳️",
  },
];

export function PILWorkflowPanel() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showFamous, setShowFamous] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { value: "1979", label: "First PIL", sub: "Hussainara Khatoon" },
          { value: "Art. 32 / 226", label: "Constitutional Basis", sub: "SC & HC jurisdiction" },
          { value: "Relaxed", label: "Locus Standi", sub: "Any person can file" },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-sm font-display font-bold text-saffron-600 dark:text-saffron-400">{s.value}</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-slate-400">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Workflow steps */}
      <div>
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">PIL Process — Step by Step</h3>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-teal-400 opacity-30" />

          <div className="space-y-2">
            {PIL_STEPS.map((step, i) => {
              const isActive = activeStep === step.step;
              const colorClass = STEP_COLORS[i] || STEP_COLORS[0];
              const [borderColor, bgColor] = colorClass.split(" ");
              return (
                <button
                  key={step.step}
                  onClick={() => setActiveStep(isActive ? null : step.step)}
                  className={`w-full text-left flex gap-4 p-4 rounded-xl border transition-all ${
                    isActive
                      ? `${borderColor} border bg-white dark:bg-slate-800 shadow-md`
                      : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {/* Step number circle */}
                  <div className={`shrink-0 w-9 h-9 rounded-full ${bgColor} flex items-center justify-center text-white font-bold text-sm shadow-sm z-10`}>
                    {step.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{step.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          <span className="font-medium text-slate-500">{step.actor}</span>
                          {step.duration !== "—" && <span> · {step.duration}</span>}
                        </div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className={`text-slate-400 transition-transform shrink-0 ${isActive ? "rotate-180" : ""}`}>
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>

                    {isActive && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{step.description}</p>
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2">
                          <span className="font-mono text-[10px] text-saffron-600 dark:text-saffron-400 font-bold">⚖ {step.basis}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Famous PILs toggle */}
      <div>
        <button
          onClick={() => setShowFamous(!showFamous)}
          className="w-full flex items-center justify-between p-4 card hover:shadow-md transition-shadow"
        >
          <div>
            <div className="font-display font-bold text-slate-900 dark:text-slate-100">Famous PIL Cases</div>
            <div className="text-xs text-slate-500 mt-0.5">Landmark PILs that changed law and policy</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`text-slate-400 transition-transform ${showFamous ? "rotate-180" : ""}`}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {showFamous && (
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            {FAMOUS_PILS.map((p) => (
              <div key={p.name} className="card p-4 border-l-4 border-l-cyan-400">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{p.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{p.year}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1"><span className="font-medium">Issue:</span> {p.issue}</div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1"><span className="font-medium">Outcome:</span> {p.outcome}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Epistolary jurisdiction note */}
      <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/50 rounded-xl p-4">
        <div className="text-sm font-bold text-cyan-800 dark:text-cyan-300 mb-1">Epistolary Jurisdiction</div>
        <p className="text-xs text-cyan-700 dark:text-cyan-400 leading-relaxed">
          Even a letter or postcard addressed to the Chief Justice of India or a High Court can be treated as a PIL petition.
          Courts have taken up cases based on newspaper reports, telegrams, and even social media posts.
          This is called epistolary jurisdiction — breaking the barrier of formal petition requirements.
          Pioneer: Justice P.N. Bhagwati, who virtually invented Indian PIL jurisprudence in the late 1970s.
        </p>
      </div>
    </div>
  );
}
