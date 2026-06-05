"use client";

import { ELECTION_UPDATES, ELECTION_STATUS_META } from "@/data/live";

const TYPE_COLOR: Record<string, string> = {
  Assembly:      "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-400",
  "Lok Sabha":   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "By-election": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Council:       "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

function TurnoutBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

export function ElectionPanel() {
  const active = ELECTION_UPDATES.filter((e) =>
    ["announced", "campaigning", "voting", "counting"].includes(e.status)
  );
  const concluded = ELECTION_UPDATES.filter((e) => e.status === "declared");
  const mccActive = ELECTION_UPDATES.filter((e) => e.mccActive);

  return (
    <div className="space-y-5">
      {/* MCC status banner */}
      <div className={`rounded-xl p-4 border ${
        mccActive.length > 0
          ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full ${mccActive.length > 0 ? "bg-amber-500 animate-pulse" : "bg-slate-400"}`} />
          <span className={`text-xs font-bold uppercase tracking-wide ${mccActive.length > 0 ? "text-amber-700 dark:text-amber-400" : "text-slate-500"}`}>
            Model Code of Conduct
          </span>
        </div>
        {mccActive.length > 0 ? (
          <>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              MCC Active in {mccActive.length} constituency/ies
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {mccActive.map((e) => (
                <span key={e.id} className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-medium">
                  {e.state}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2">
              Government may not announce new schemes or make non-routine transfers. EC approval required.
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-500">No elections currently under MCC</p>
        )}
      </div>

      {/* Active / Upcoming elections */}
      {active.length > 0 && (
        <div>
          <h4 className="text-sm font-display font-bold text-slate-700 dark:text-slate-300 mb-3">
            Active & Upcoming Elections
          </h4>
          <div className="space-y-3">
            {active.map((e) => {
              const sm = ELECTION_STATUS_META[e.status];
              return (
                <div key={e.id} className="card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${sm.color}`}>
                          {sm.label}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${TYPE_COLOR[e.electionType] ?? ""}`}>
                          {e.electionType}
                        </span>
                        {e.mccActive && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            MCC Active
                          </span>
                        )}
                      </div>
                      <p className="font-display font-bold text-slate-900 dark:text-slate-100">
                        {e.state}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {e.dates} · {e.seats} seats{e.phases ? ` · ${e.phases} phases` : ""}
                      </p>
                      {e.status === "voting" && e.turnout !== undefined && (
                        <div className="mt-2">
                          <p className="text-[10px] text-slate-400 mb-1">Current turnout</p>
                          <TurnoutBar pct={e.turnout} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent results */}
      <div>
        <h4 className="text-sm font-display font-bold text-slate-700 dark:text-slate-300 mb-3">
          Recent Election Results
        </h4>
        <div className="space-y-2">
          {concluded.map((e) => (
            <div key={e.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${TYPE_COLOR[e.electionType] ?? ""}`}>
                      {e.electionType}
                    </span>
                    <span className="text-[10px] text-slate-400">{e.dates}</span>
                  </div>
                  <p className="font-display font-bold text-slate-900 dark:text-slate-100">{e.state}</p>
                  {e.winner && (
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                      ✓ {e.winner}
                    </p>
                  )}
                  {e.turnout !== undefined && (
                    <div className="mt-2">
                      <p className="text-[10px] text-slate-400 mb-1">Final turnout</p>
                      <TurnoutBar pct={e.turnout} />
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold font-display text-slate-700 dark:text-slate-300">
                    {e.seats}
                  </div>
                  <div className="text-[10px] text-slate-400">seats</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
