"use client";

import { useState } from "react";
import { CABINET_SECRETARIAT, MINISTRY_CLUSTERS } from "@/data/bureaucracy/intelligence";

const CC_COLORS: Record<string, string> = {
  CCS: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-400",
  CCEA: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-400",
  CCI: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-400",
  CCA: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-400",
  CCLST: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-400",
  CCG: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-400",
};

type TabId = "overview" | "committees" | "ministries";

export function CabinetSecretariatPanel() {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="card p-5 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
        <h3 className="font-bold text-red-900 dark:text-red-300 text-sm mb-1">Cabinet Secretariat — Engine of Government</h3>
        <p className="text-xs text-red-800 dark:text-red-400 leading-relaxed">
          The Cabinet Secretariat facilitates smooth Cabinet functioning. Headed by the Cabinet Secretary — the seniormost civil servant in India — it ensures inter-ministerial coordination, records all Cabinet decisions, and manages national crises.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["overview", "committees", "ministries"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs rounded-lg font-medium capitalize transition-colors ${tab === t ? "bg-red-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700"}`}>
            {t === "overview" ? "Org & Roles" : t === "committees" ? "Cabinet Committees" : "Ministry Map"}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-5">
          {/* Roles */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm">Secretariat Roles</h3>
            <div className="space-y-3">
              {CABINET_SECRETARIAT.roles.map((r, i) => (
                <div key={r.title} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">{r.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key functions */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-3 text-sm">Key Functions</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {CABINET_SECRETARIAT.keyFunctions.map((fn) => (
                <div key={fn} className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 mt-0.5 text-red-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {fn}
                </div>
              ))}
            </div>
          </div>

          {/* Cabinet Secretary */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-5">
            <div className="font-bold text-amber-900 dark:text-amber-300 text-sm mb-2">The Cabinet Secretary — India&apos;s Most Senior Civil Servant</div>
            <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
              There is exactly <strong>one</strong> Cabinet Secretary in India, at Pay Level 18 (₹2,50,000 fixed). They chair the Secretaries&apos; Committee, coordinate all Cabinet meetings, manage national crises, and advise the PM on all administrative decisions. The post is the pinnacle of the IAS career. The Cabinet Secretary also heads the Crisis Management Group (CMG) which activates in national disasters or security incidents.
            </p>
          </div>
        </div>
      )}

      {tab === "committees" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Cabinet Committees are permanent committees of ministers who decide on specific policy areas without requiring full Cabinet approval. Chaired by PM or a senior minister.</p>
          {CABINET_SECRETARIAT.cabinetCommittees.map((cc) => {
            const colorClass = CC_COLORS[cc.name] || CC_COLORS["CCS"];
            return (
              <div key={cc.name} className={`rounded-xl border-l-4 p-4 ${colorClass}`}>
                <div className="flex items-start gap-3">
                  <div className={`px-2 py-0.5 rounded text-xs font-bold font-mono shrink-0 border ${colorClass}`}>{cc.name}</div>
                  <div>
                    <div className="font-semibold text-sm">{cc.full}</div>
                    <div className="text-xs mt-1.5 opacity-80 leading-relaxed">{cc.desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "ministries" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">India has 80+ Union Ministries and Departments. The Cabinet Secretariat coordinates them all. Here they are grouped by domain cluster.</p>
          {MINISTRY_CLUSTERS.map((cluster) => (
            <div key={cluster.cluster} className="card p-4">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${cluster.color}`}>{cluster.cluster}</div>
              <div className="flex flex-wrap gap-1.5">
                {cluster.ministries.map((m) => (
                  <span key={m} className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
