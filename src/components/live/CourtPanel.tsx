"use client";

import { SC_CASES, SC_CASE_STATUS } from "@/data/live";

const SIGNIFICANCE_META: Record<string, { label: string; color: string }> = {
  landmark: { label: "Landmark",  color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400" },
  major:    { label: "Major",     color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400" },
  routine:  { label: "Routine",   color: "text-slate-500 bg-slate-100 dark:bg-slate-800" },
};

const CASE_TYPE_COLOR: Record<string, string> = {
  PIL:       "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  Writ:      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Appeal:    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  SLP:       "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Reference: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const ACTIVE_STATUSES = new Set(["filed", "listed", "hearing", "reserved"]);

export function CourtPanel() {
  const active = SC_CASES.filter((c) => ACTIVE_STATUSES.has(c.status));
  const decided = SC_CASES.filter((c) => c.status === "decided");
  const constitutionBenches = active.filter((c) => c.bench.includes("-judge") || c.bench.includes("Constitution Bench"));

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold font-display text-violet-600 dark:text-violet-400">
            {active.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active Cases</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold font-display text-amber-600 dark:text-amber-400">
            {constitutionBenches.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Constitution Benches</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
            {decided.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Decided (tracked)</div>
        </div>
      </div>

      {/* Active constitutional cases */}
      <div>
        <h4 className="text-sm font-display font-bold text-slate-700 dark:text-slate-300 mb-3">
          Active Constitutional Cases
        </h4>
        <div className="space-y-3">
          {active.map((c) => {
            const sm = SC_CASE_STATUS[c.status];
            const sig = SIGNIFICANCE_META[c.significance];
            return (
              <div key={c.id} className="card p-4">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${sm.color}`}>
                    {sm.label}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${CASE_TYPE_COLOR[c.caseType]}`}>
                    {c.caseType}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${sig.color}`}>
                    {sig.label}
                  </span>
                </div>

                <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug mb-1">
                  {c.title}
                </h5>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                  {c.summary}
                </p>

                <div className="flex flex-wrap gap-1 mb-2">
                  {c.articlesChallenged.map((a) => (
                    <span key={a} className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-mono">
                      {a}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
                  <span className="font-mono">{c.petitionNumber}</span>
                  <span>{c.bench.split(",")[0]}{c.bench.includes(",") ? " + others" : ""}</span>
                  <span>Last heard {c.lastHearing}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decided landmark cases */}
      <div>
        <h4 className="text-sm font-display font-bold text-slate-700 dark:text-slate-300 mb-3">
          Recently Decided Landmark Cases
        </h4>
        <div className="space-y-2">
          {decided.map((c) => {
            const sig = SIGNIFICANCE_META[c.significance];
            return (
              <div key={c.id} className="card p-3 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-start gap-2">
                  <span className="text-xl shrink-0">✅</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${sig.color}`}>
                        {sig.label}
                      </span>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Decided {c.lastHearing}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{c.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {c.summary}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
