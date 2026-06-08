"use client";

import { useState } from "react";
import type { CourtDB } from "./JudiciaryDashboard";

const TYPE_CONFIG: Record<string, { color: string; bg: string; indent: number }> = {
  supreme:    { color: "border-l-amber-500",   bg: "bg-amber-50 dark:bg-amber-950/20",    indent: 0  },
  high:       { color: "border-l-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20",indent: 4  },
  district:   { color: "border-l-blue-400",    bg: "bg-blue-50 dark:bg-blue-950/20",      indent: 8  },
  subordinate:{ color: "border-l-slate-400",   bg: "",                                     indent: 12 },
  tribunal:   { color: "border-l-purple-400",  bg: "bg-purple-50 dark:bg-purple-950/20",  indent: 4  },
};

const HIERARCHY_ORDER = ["supreme", "high", "district", "subordinate"];

function CourtCard({ court, expanded, onToggle }: { court: CourtDB; expanded: boolean; onToggle: () => void }) {
  const cfg = TYPE_CONFIG[court.type] ?? { color: "border-l-slate-400", bg: "", indent: 0 };
  return (
    <div style={{ marginLeft: `${cfg.indent * 4}px` }}>
      <button onClick={onToggle}
        className={`w-full text-left card border-l-4 ${cfg.color} ${cfg.bg} p-4 hover:shadow-md transition-shadow`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">{court.name}</h3>
              {court.basis && (
                <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  {court.basis}
                </span>
              )}
            </div>
            <div className="flex gap-4 mt-1 text-xs text-slate-500 flex-wrap">
              {court.courtCount && <span>{court.courtCount} court{court.courtCount !== "1" ? "s" : ""}</span>}
              {court.judges && <span>{court.judges}</span>}
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`shrink-0 text-slate-400 transition-transform mt-1 ${expanded ? "rotate-180" : ""}`}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-left">
            {court.jurisdiction && <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">{court.jurisdiction}</div>}
            {court.description && <div className="text-xs text-slate-500 mb-2">{court.description}</div>}
            <div className="space-y-1">
              {court.powers.map((p, i) => (
                <div key={i} className="flex gap-2 items-start text-xs text-slate-700 dark:text-slate-300">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                    className="text-emerald-500 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  {p}
                </div>
              ))}
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

interface Props { courts: CourtDB[] }

export function CourtHierarchyPanel({ courts }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const mainCourts = HIERARCHY_ORDER.flatMap((t) => courts.filter((c) => c.type === t));
  const tribunals = courts.filter((c) => c.type === "tribunal");

  const scCourt = courts.find((c) => c.type === "supreme");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Supreme Court", value: scCourt?.courtCount ?? "1",   sub: `${scCourt?.judges ?? "34 judges"} (sanctioned)`, color: "text-amber-600" },
          { label: "High Courts",   value: "25",                          sub: "across all states/UTs",                          color: "text-emerald-600" },
          { label: "Districts",     value: "~672",                        sub: "district courts",                                color: "text-blue-600" },
          { label: "Pending Cases", value: "5 Cr+",                       sub: "total pendency (2024)",                          color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">{s.label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Main Court Hierarchy</h3>
        <div className="space-y-1">
          {mainCourts.map((court) => (
            <CourtCard key={court.id} court={court} expanded={!!expanded[court.id]} onToggle={() => toggle(court.id)} />
          ))}
        </div>
      </div>

      {tribunals.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Specialised Tribunals (Art. 323A–B)
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {tribunals.map((court) => (
              <button key={court.id} onClick={() => toggle(court.id)}
                className="card border-l-4 border-l-purple-400 p-4 text-left hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{court.name}</div>
                    <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400 mt-0.5">{court.basis}</div>
                    {court.courtCount && <div className="text-xs text-slate-500 mt-1">{court.courtCount}</div>}
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`text-slate-400 transition-transform ${expanded[court.id] ? "rotate-180" : ""}`}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
                {expanded[court.id] && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    {court.powers.map((p, i) => (
                      <div key={i} className="flex gap-1.5 items-start text-xs text-slate-600 dark:text-slate-400">
                        <span className="text-purple-500 shrink-0">•</span> {p}
                      </div>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
        <div className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Art. 136 — Special Leave Petition (SLP)</div>
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Any person aggrieved by a judgment of any court or tribunal in India can petition the Supreme Court for special leave to appeal.
          Over 40,000 SLPs are filed every year — the SC filters them through a discretionary leave stage.
        </p>
      </div>
    </div>
  );
}
