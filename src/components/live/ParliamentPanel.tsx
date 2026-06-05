"use client";

import { PARLIAMENT_SESSIONS, BILLS, BILL_STATUS_META } from "@/data/live";

const SESSION_STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  ongoing:   { label: "In Session",  color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500 animate-pulse" },
  adjourned: { label: "Adjourned",   color: "text-amber-600 dark:text-amber-400",    dot: "bg-amber-500" },
  concluded: { label: "Concluded",   color: "text-slate-500",                         dot: "bg-slate-400" },
  scheduled: { label: "Scheduled",   color: "text-blue-600 dark:text-blue-400",       dot: "bg-blue-400" },
};

const SESSION_TYPE_COLOR: Record<string, string> = {
  Budget:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Winter:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Monsoon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Special: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

const CONTROVERSY_COLOR: Record<string, string> = {
  high:   "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  low:    "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const TYPE_BADGE: Record<string, string> = {
  constitutional: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  money:          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  ordinary:       "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  finance:        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  private:        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

function StatBox({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card p-3 text-center">
      <div className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">{value}</div>
      {sub && <div className="text-[10px] text-emerald-500 font-semibold">{sub}</div>}
      <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

export function ParliamentPanel() {
  const recent = PARLIAMENT_SESSIONS[0];
  const last = PARLIAMENT_SESSIONS[1];
  const sessionMeta = SESSION_STATUS_META[recent.status];
  const lastMeta = SESSION_STATUS_META[last.status];

  return (
    <div className="space-y-5">
      {/* Next / Current session hero */}
      <div className="card p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${sessionMeta.dot}`} />
              <span className={`text-xs font-semibold ${sessionMeta.color}`}>{sessionMeta.label}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${SESSION_TYPE_COLOR[recent.type]}`}>
                {recent.type} Session
              </span>
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-slate-100">
              18th Lok Sabha — {recent.type} Session {recent.year}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {recent.startDate}
              {recent.endDate ? ` – ${recent.endDate}` : " (scheduled)"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">
              {recent.daysHeld > 0 ? `${recent.daysHeld}` : "—"}
            </div>
            <div className="text-[10px] text-slate-500">sitting days</div>
          </div>
        </div>

        {recent.daysHeld > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            <StatBox label="Bills Introduced" value={recent.billsIntroduced} />
            <StatBox label="Bills Passed" value={recent.billsPassed} />
            <StatBox label="Questions Answered" value={recent.questionsAnswered.toLocaleString()} />
            <StatBox label="Sitting Hours" value={recent.sittingHours} />
          </div>
        )}
      </div>

      {/* Last session summary */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-2 h-2 rounded-full ${lastMeta.dot}`} />
          <span className="text-xs font-semibold text-slate-500">
            Previous: {last.type} Session {last.year} ({last.startDate} – {last.endDate})
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <StatBox label="Days" value={last.daysHeld} />
          <StatBox label="Bills Passed" value={last.billsPassed} />
          <StatBox label="Questions" value={last.questionsAnswered.toLocaleString()} />
          <StatBox label="Hours" value={last.sittingHours} />
        </div>
      </div>

      {/* Bills tracker */}
      <div>
        <h4 className="text-sm font-display font-bold text-slate-700 dark:text-slate-300 mb-3">
          Recent Bills — 18th Lok Sabha
        </h4>
        <div className="space-y-2">
          {BILLS.map((bill) => {
            const sm = BILL_STATUS_META[bill.status];
            return (
              <div key={bill.id} className="card p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${sm.color}`}>
                        {sm.label}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${TYPE_BADGE[bill.type]}`}>
                        {bill.type}
                      </span>
                      {bill.controversy !== "low" && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${CONTROVERSY_COLOR[bill.controversy]}`}>
                          {bill.controversy} controversy
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {bill.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {bill.number} · {bill.ministry} · Introduced {bill.introducedDate}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                      {bill.lastAction} <span className="not-italic text-slate-400">({bill.lastActionDate})</span>
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
