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

export interface PartyResult { party: string; color: string; seats: number; voteShare: number | null }
export interface ElectionHistoryItem { year: number; totalSeats: number; majorWinner: string; majorSeats: number; turnout: number }
export interface PartyYearRow { year: number; seats: number; voteShare: number }
export interface StateResult {
  state: string; code: string; seats: number; dominant: string; dominantColor: string;
  dominantSeats: number; alliance: "NDA" | "INDIA" | "Other"; turnout: number;
  ndaSeats: number; indiaSeats: number; otherSeats: number;
}

export interface AssemblyElection {
  state: string; year: number; totalSeats: number;
  winner: string; winnerColor: string; winnerSeats: number;
  runnerUp: string; runnerUpSeats: number; turnout: number;
}

interface Props {
  currentResults: PartyResult[];
  electionHistory: ElectionHistoryItem[];
  partyHistory: Record<string, PartyYearRow[]>;
  stateElectionResults: StateResult[];
  assemblyElections: AssemblyElection[];
  latestYear: number;
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

export function ElectionDashboard({ currentResults, electionHistory, partyHistory, stateElectionResults, assemblyElections, latestYear }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("parliament");

  const latest = electionHistory[electionHistory.length - 1];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
      {/* Quick stats from DB */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100">{latest?.totalSeats ?? 543}</div>
          <div className="text-xs text-slate-500 mt-1">Lok Sabha Seats</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-saffron-500">{latest?.majorSeats ?? "—"}</div>
          <div className="text-xs text-slate-500 mt-1">{latest?.majorWinner ?? "BJP"} Seats ({latestYear})</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100">245</div>
          <div className="text-xs text-slate-500 mt-1">Rajya Sabha Seats</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100">{latest?.turnout ?? 65.8}%</div>
          <div className="text-xs text-slate-500 mt-1">{latestYear} Turnout</div>
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

      {/* Panels — each receives its data from DB via props */}
      {activeTab === "parliament"     && <LokSabhaMap parties={currentResults} stateResults={stateElectionResults} />}
      {activeTab === "states"         && <StateElectionPanel assemblyElections={assemblyElections} />}
      {activeTab === "coalitions"     && <CoalitionPanel />}
      {activeTab === "history"        && <PartyTracker partyHistory={partyHistory} electionHistory={electionHistory} />}
      {activeTab === "voteShare"      && <VoteSharePanel currentResults={currentResults} partyHistory={partyHistory} latestYear={latestYear} />}
      {activeTab === "turnout"        && <TurnoutPanel stateResults={stateElectionResults} electionHistory={electionHistory} />}
      {activeTab === "rajyaSabha"     && <RajyaSabhaPanel />}
      {activeTab === "constituencies" && <ConstituencyPanel />}
    </div>
  );
}
