"use client";

import { useState, useEffect } from "react";
import { useLiveStore } from "@/store/liveStore";
import { PARLIAMENT_SESSIONS, ELECTION_UPDATES, SC_CASES, ORDINANCES } from "@/data/live";
import { LiveTicker } from "./LiveTicker";
import { NotificationToast } from "./NotificationToast";
import { EventTimeline } from "./EventTimeline";
import { ParliamentPanel } from "./ParliamentPanel";
import { CourtPanel } from "./CourtPanel";
import { ElectionPanel } from "./ElectionPanel";
import { ExecutivePanel } from "./ExecutivePanel";

type MainTab = "parliament" | "courts" | "elections" | "executive" | "timeline";

const MAIN_TABS: { id: MainTab; label: string; icon: string }[] = [
  { id: "parliament", label: "Parliament",  icon: "🏛️" },
  { id: "courts",     label: "Courts",      icon: "⚖️" },
  { id: "elections",  label: "Elections",   icon: "🗳️" },
  { id: "executive",  label: "Executive",   icon: "🏢" },
  { id: "timeline",   label: "Live Feed",   icon: "📡" },
];

// Derived stats for the metrics bar
const currentSession = PARLIAMENT_SESSIONS.find((s) => s.status !== "scheduled");
const activeElections = ELECTION_UPDATES.filter((e) =>
  ["announced", "campaigning", "voting", "counting"].includes(e.status)
).length;
const mccCount = ELECTION_UPDATES.filter((e) => e.mccActive).length;
const activeConstitutionCases = SC_CASES.filter((c) =>
  ["hearing", "listed", "reserved"].includes(c.status)
).length;
const activeOrdinances = ORDINANCES.filter((o) => o.status === "active").length;

function MetricCard({
  icon, label, value, sub, accent,
}: {
  icon: string; label: string; value: string | number; sub?: string; accent?: string;
}) {
  return (
    <div className="card p-3 flex items-center gap-3">
      <span className="text-2xl shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className={`text-lg font-bold font-display leading-tight ${accent ?? "text-slate-900 dark:text-slate-100"}`}>
          {value}
        </div>
        {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
        <div className="text-[10px] text-slate-500 leading-tight">{label}</div>
      </div>
    </div>
  );
}

export function LiveDashboard() {
  const [activeTab, setActiveTab] = useState<MainTab>("parliament");
  const tick = useLiveStore((s) => s.tick);
  const isLive = useLiveStore((s) => s.isLive);
  const toggleLive = useLiveStore((s) => s.toggleLive);
  const timeline = useLiveStore((s) => s.timeline);

  // Simulation interval
  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(tick, 12_000);
    return () => clearInterval(id);
  }, [isLive, tick]);

  const breakingCount = timeline.filter((e) => e.priority === "breaking").length;

  return (
    <>
      {/* Toast overlay — outside flow so it sits on top */}
      <NotificationToast />

      <div className="space-y-4">
        {/* Live ticker */}
        <LiveTicker />

        {/* Metrics bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard
            icon="🏛️"
            label="Parliament"
            value={currentSession ? `${currentSession.type} ${currentSession.year}` : "—"}
            sub={currentSession?.status === "concluded" ? `${currentSession.daysHeld} days, ${currentSession.billsPassed} bills` : currentSession?.status}
            accent="text-blue-600 dark:text-blue-400"
          />
          <MetricCard
            icon="⚖️"
            label="SC Constitution Benches"
            value={activeConstitutionCases}
            sub="active cases tracked"
            accent="text-violet-600 dark:text-violet-400"
          />
          <MetricCard
            icon="🗳️"
            label="Elections Active"
            value={activeElections}
            sub={mccCount > 0 ? `MCC in force: ${mccCount}` : "No MCC active"}
            accent="text-emerald-600 dark:text-emerald-400"
          />
          <MetricCard
            icon="📜"
            label="Live Ordinances"
            value={activeOrdinances}
            sub="requiring parliamentary approval"
            accent="text-red-600 dark:text-red-400"
          />
        </div>

        {/* Live controls */}
        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
          <div className="flex items-center gap-2 shrink-0">
            {breakingCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {breakingCount} breaking
              </span>
            )}
            <button
              onClick={toggleLive}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isLive
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 hover:bg-emerald-100"
                  : "bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-200"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
              {isLive ? "Live — Pause" : "Paused — Resume"}
            </button>
            <span className="text-[10px] text-slate-400">Events every ~12s</span>
          </div>
          <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
        </div>

        {/* Main content: two-column on lg+ */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-5 items-start">

          {/* Left: tab panel */}
          <div>
            {/* Tab navigation */}
            <div className="flex gap-1 mb-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
              {MAIN_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                    activeTab === t.id
                      ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                  {t.id === "timeline" && (
                    <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold">
                      {timeline.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Panel content */}
            <div>
              {activeTab === "parliament" && <ParliamentPanel />}
              {activeTab === "courts"     && <CourtPanel />}
              {activeTab === "elections"  && <ElectionPanel />}
              {activeTab === "executive"  && <ExecutivePanel />}
              {activeTab === "timeline"   && (
                <div className="h-[70vh]">
                  <EventTimeline />
                </div>
              )}
            </div>
          </div>

          {/* Right: always-visible timeline (desktop only) */}
          <div className="hidden lg:flex flex-col h-[80vh] card p-4">
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Live Event Stream
              </span>
              <span className="ml-auto text-[10px] text-slate-400">{timeline.length} events</span>
            </div>
            <EventTimeline compact />
          </div>
        </div>
      </div>
    </>
  );
}
