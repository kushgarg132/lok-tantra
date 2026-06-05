"use client";

import { useState } from "react";
import { LokSabhaMap } from "./LokSabhaMap";
import { CoalitionPanel } from "./CoalitionPanel";
import { PartyTracker } from "./PartyTracker";
import { TurnoutPanel } from "./TurnoutPanel";
import { VoteSharePanel } from "./VoteSharePanel";
import { RajyaSabhaPanel } from "./RajyaSabhaPanel";
import { StateElectionPanel } from "./StateElectionPanel";
import { ConstituencyPanel } from "./ConstituencyPanel";

// ─── Types from DB (kept for backward compat) ────────────────────────────────
interface PartyResult { party: string; color: string; seats: number; voteShare: number | null }
interface ElectionHistoryItem { year: number; totalSeats: number; majorWinner: string; majorSeats: number; turnout: number | null }
interface StateSeat { name: string; total: number; reservedSC: number; reservedST: number }

interface Props {
  currentResults: PartyResult[];
  electionHistory: ElectionHistoryItem[];
  stateSeats: StateSeat[];
}

type TabId = "parliament" | "states" | "coalitions" | "history" | "voteShare" | "turnout" | "rajyaSabha" | "constituencies";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "parliament",     label: "Parliament",    icon: "🏛️" },
  { id: "states",         label: "State Results", icon: "🗺️" },
  { id: "coalitions",     label: "Coalitions",    icon: "🤝" },
  { id: "history",        label: "Party History", icon: "📈" },
  { id: "voteShare",      label: "Vote Share",    icon: "📊" },
  { id: "turnout",        label: "Turnout",       icon: "🔢" },
  { id: "rajyaSabha",     label: "Rajya Sabha",   icon: "🪑" },
  { id: "constituencies", label: "Constituencies",icon: "🔍" },
];

export function ElectionDashboard({ currentResults, electionHistory, stateSeats }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("parliament");

  // Use DB data when available, otherwise fall back to static
  const current2024 = currentResults.length > 0 ? currentResults : null;
  const latestYear = electionHistory.length > 0 ? Math.max(...electionHistory.map(h => h.year)) : 2024;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100">543</div>
          <div className="text-xs text-slate-500 mt-1">Lok Sabha Seats</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-saffron-500">293</div>
          <div className="text-xs text-slate-500 mt-1">NDA Seats (2024)</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100">245</div>
          <div className="text-xs text-slate-500 mt-1">Rajya Sabha Seats</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100">65.8%</div>
          <div className="text-xs text-slate-500 mt-1">2024 Turnout</div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex gap-1 rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800/50 mb-8 w-fit min-w-full sm:min-w-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-700 text-saffron-600 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <span className="hidden sm:inline">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel */}
      {activeTab === "parliament" && <LokSabhaMap />}
      {activeTab === "states" && <StateElectionPanel />}
      {activeTab === "coalitions" && <CoalitionPanel />}
      {activeTab === "history" && <PartyTracker />}
      {activeTab === "voteShare" && <VoteSharePanel />}
      {activeTab === "turnout" && <TurnoutPanel />}
      {activeTab === "rajyaSabha" && <RajyaSabhaPanel />}
      {activeTab === "constituencies" && <ConstituencyPanel />}

      {/* Legacy DB-backed current results (when DB is seeded) */}
      {activeTab === "parliament" && current2024 && current2024.length > 0 && (
        <div className="mt-8 card p-6">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">
            DB Party Results — {latestYear}
          </h3>
          <div className="h-10 rounded-xl overflow-hidden flex">
            {current2024.map((p) => (
              <div key={p.party}
                className="h-full relative group flex items-center justify-center"
                style={{ width: `${(p.seats / 543) * 100}%`, backgroundColor: p.color, minWidth: p.seats > 5 ? "auto" : "3px" }}>
                {p.seats >= 20 && (
                  <span className="text-[10px] font-bold text-white drop-shadow-sm">{p.party} ({p.seats})</span>
                )}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-slate-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                  {p.party}: {p.seats} seats · {p.voteShare ?? 0}%
                </div>
              </div>
            ))}
          </div>
          <div className="relative h-4 mt-0.5">
            <div className="absolute top-0 w-px h-4 bg-red-400" style={{ left: `${(272 / 543) * 100}%` }} />
            <span className="absolute text-[9px] text-red-400 -translate-x-1/2 top-0.5" style={{ left: `${(272 / 543) * 100}%` }}>272</span>
          </div>
        </div>
      )}
    </div>
  );
}
