"use client";

import { useState } from "react";
import { CABINET_EVENTS, GOVERNOR_CHANGES, ORDINANCES } from "@/data/live";

type SubTab = "cabinet" | "governors" | "ordinances";

const CABINET_TYPE_META: Record<string, { icon: string; color: string; label: string }> = {
  reshuffle:        { icon: "🔄", color: "text-amber-600 dark:text-amber-400", label: "Reshuffle" },
  "new-minister":   { icon: "➕", color: "text-emerald-600 dark:text-emerald-400", label: "New Minister" },
  resignation:      { icon: "📤", color: "text-red-600 dark:text-red-400", label: "Resignation" },
  expansion:        { icon: "⬆️", color: "text-blue-600 dark:text-blue-400", label: "Expansion" },
  "portfolio-change": { icon: "📋", color: "text-violet-600 dark:text-violet-400", label: "Portfolio Change" },
};

const GOVERNOR_TYPE_META: Record<string, { icon: string; color: string; label: string }> = {
  appointed:         { icon: "🆕", color: "text-emerald-600 dark:text-emerald-400", label: "Appointed" },
  transferred:       { icon: "🔃", color: "text-blue-600 dark:text-blue-400", label: "Transferred" },
  "additional-charge": { icon: "➕", color: "text-amber-600 dark:text-amber-400", label: "Additional Charge" },
  resigned:          { icon: "📤", color: "text-red-600 dark:text-red-400", label: "Resigned" },
};

const SIGNIFICANCE_COLOR: Record<string, string> = {
  high:   "border-l-amber-500",
  medium: "border-l-blue-400",
  low:    "border-l-slate-300 dark:border-l-slate-700",
};

const ORD_STATUS_META: Record<string, { label: string; color: string }> = {
  active:           { label: "Active",           color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" },
  "replaced-by-act": { label: "Replaced by Act",  color: "text-slate-500 bg-slate-100 dark:bg-slate-800" },
  lapsed:           { label: "Lapsed",           color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400" },
  withdrawn:        { label: "Withdrawn",        color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400" },
};

const ORD_CONTROVERSY_COLOR: Record<string, string> = {
  high:   "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
  medium: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
  low:    "text-slate-500 bg-slate-50 dark:bg-slate-800 dark:text-slate-400",
};

export function ExecutivePanel() {
  const [sub, setSub] = useState<SubTab>("cabinet");

  const activeSubs: { id: SubTab; label: string; icon: string; count: number }[] = [
    { id: "cabinet",    label: "Cabinet",   icon: "🏢", count: CABINET_EVENTS.length },
    { id: "governors",  label: "Governors", icon: "🔱", count: GOVERNOR_CHANGES.length },
    { id: "ordinances", label: "Ordinances", icon: "📜", count: ORDINANCES.filter((o) => o.status === "active").length },
  ];

  return (
    <div className="space-y-4">
      {/* Sub-tab navigation */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {activeSubs.map((s) => (
          <button
            key={s.id}
            onClick={() => setSub(s.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              sub === s.id
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              sub === s.id ? "bg-white/20 text-white dark:bg-black/20 dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}>
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* Cabinet events */}
      {sub === "cabinet" && (
        <div className="space-y-2">
          <p className="text-[11px] text-slate-400 mb-3">
            Cabinet events since June 2024 · 18th Lok Sabha term
          </p>
          {CABINET_EVENTS.map((e) => {
            const tm = CABINET_TYPE_META[e.type];
            return (
              <div
                key={e.id}
                className={`card p-4 border-l-4 ${SIGNIFICANCE_COLOR[e.significance]}`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-xl shrink-0 mt-0.5">{tm.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${tm.color}`}>
                        {tm.label}
                      </span>
                      <span className="text-[10px] text-slate-400">{e.date}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {e.minister}
                    </p>
                    <p className={`text-[11px] font-medium mt-0.5 ${tm.color}`}>{e.ministry}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {e.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Governor changes */}
      {sub === "governors" && (
        <div className="space-y-2">
          <p className="text-[11px] text-slate-400 mb-3">
            Governor appointments, transfers and changes · Raj Bhavan events
          </p>
          {GOVERNOR_CHANGES.map((g) => {
            const tm = GOVERNOR_TYPE_META[g.type];
            return (
              <div key={g.id} className="card p-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-xl shrink-0 mt-0.5">{tm.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${tm.color}`}>
                        {tm.label}
                      </span>
                      <span className="text-[10px] text-slate-400">{g.date}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {g.governor}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{g.state}</span>
                      {g.previousState && g.previousState !== g.state && (
                        <span className="text-slate-400"> ← {g.previousState}</span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {g.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ordinances */}
      {sub === "ordinances" && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="text-center">
              <div className="text-xl font-bold font-display text-amber-700 dark:text-amber-400">
                {ORDINANCES.filter((o) => o.status === "active").length}
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400">Active Ordinances</div>
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
              Ordinances promulgated under Art. 123 must be placed before Parliament within 6 weeks of reassembly.
            </div>
          </div>

          {ORDINANCES.map((o) => {
            const sm = ORD_STATUS_META[o.status];
            return (
              <div key={o.id} className="card p-4">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${sm.color}`}>
                    {sm.label}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${ORD_CONTROVERSY_COLOR[o.controversy]}`}>
                    {o.controversy} controversy
                  </span>
                  <span className="text-[10px] text-slate-400 ml-auto">{o.promulgatedDate}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                  {o.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{o.number} · {o.ministry}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed italic">
                  {o.reason}
                </p>
              </div>
            );
          })}

          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-1">
            <span className="font-mono text-indigo-400">Art. 123</span>
            <span>Ordinance-making power of the President — requires urgency; Parliament may disapprove</span>
          </div>
        </div>
      )}
    </div>
  );
}
