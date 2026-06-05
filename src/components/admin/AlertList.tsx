"use client";

import type { AlertEvaluation } from "@/lib/observability/alert-engine";

const SEV_STYLES = {
  critical: "bg-red-950/40 border-red-500/60 text-red-300",
  warning:  "bg-amber-950/40 border-amber-500/60 text-amber-300",
  info:     "bg-blue-950/40 border-blue-500/60 text-blue-300",
};

const SEV_ICON = { critical: "🔴", warning: "🟡", info: "🔵" };

interface HistoryItem {
  id:         string;
  rule:       string;
  severity:   string;
  message:    string;
  createdAt:  string | Date;
}

interface Props {
  active:  AlertEvaluation[];
  history: HistoryItem[];
}

function timeAgo(d: string | Date): string {
  const ms = Date.now() - new Date(d).getTime();
  const m  = Math.floor(ms / 60000);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AlertList({ active, history }: Props) {
  const noActive = active.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Active Alerts</h4>
        {noActive ? (
          <div className="rounded-lg border border-emerald-800/50 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-400 flex items-center gap-2">
            <span>✓</span> All clear — no active alerts
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {active.map((a) => {
              const sev = a.rule.severity as keyof typeof SEV_STYLES;
              return (
                <div key={a.rule.id} className={`rounded-lg border px-4 py-3 text-sm ${SEV_STYLES[sev] ?? SEV_STYLES.info}`}>
                  <div className="flex items-center gap-2 font-semibold">
                    <span>{SEV_ICON[sev]}</span>
                    <span>{a.rule.name}</span>
                  </div>
                  {a.message && (
                    <p className="mt-1 text-xs opacity-80">{a.message}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Recent History</h4>
          <div className="rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">Rule</th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium">Severity</th>
                  <th className="text-left px-3 py-2 text-slate-400 font-medium hidden sm:table-cell">Message</th>
                  <th className="text-right px-3 py-2 text-slate-400 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 20).map((h, i) => {
                  const sev = h.severity as keyof typeof SEV_ICON;
                  return (
                    <tr key={h.id} className={`border-t border-slate-700/50 ${i % 2 === 0 ? "bg-slate-800/20" : ""}`}>
                      <td className="px-3 py-2 text-slate-300 font-mono">{h.rule}</td>
                      <td className="px-3 py-2">
                        <span className={`text-xs ${SEV_STYLES[sev as keyof typeof SEV_STYLES] ?? ""} px-1.5 py-0.5 rounded border`}>
                          {SEV_ICON[sev] ?? ""} {h.severity}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-400 truncate max-w-[200px] hidden sm:table-cell">{h.message}</td>
                      <td className="px-3 py-2 text-right text-slate-500">{timeAgo(h.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
