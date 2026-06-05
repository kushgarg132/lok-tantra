import type { Metadata } from "next";
import { LiveDashboard } from "@/components/live/LiveDashboard";

export const metadata: Metadata = {
  title: "Democracy Live — Real-time Governance Dashboard",
  description:
    "Live tracking of Parliament sessions, bills, Supreme Court constitutional cases, elections, cabinet reshuffles, governor changes, and ordinances with real-time event streams.",
};

export default function DemocracyLivePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-saffron">Live</span>
            <span className="badge-navy">6 Event Categories</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Simulated Stream
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Democracy Live
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Real-time governance intelligence — Parliament sessions, Supreme Court constitutional cases,
            elections under MCC, cabinet reshuffles, governor changes, and ordinances. All in one stream.
          </p>
          <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-500">
            <div className="flex items-center gap-2"><span>🏛️</span> 18th Lok Sabha — bills and session data</div>
            <div className="flex items-center gap-2"><span>⚖️</span> Supreme Court constitutional benches</div>
            <div className="flex items-center gap-2"><span>🗳️</span> ECI election tracker with MCC status</div>
            <div className="flex items-center gap-2"><span>📜</span> Active Presidential Ordinances (Art. 123)</div>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        <LiveDashboard />
      </div>
    </div>
  );
}
