"use client";

import { useState } from "react";
import { FLOOR_PARTNERS } from "@/data/lawmaking";
import type { FloorPartner } from "@/data/lawmaking";

// ─── Types ────────────────────────────────────────────────────────────────────

type FloorAction =
  | "funds"
  | "portfolio"
  | "ideology"
  | "regional"
  | "legal";

interface PartnerProgress {
  id: string;
  support: "supporting" | "neutral" | "abstaining" | "opposing";
  moodChange: number; // cumulative change from actions
  actionsUsed: FloorAction[];
}

type Phase = "briefing" | "managing" | "result";

interface ConfState {
  phase: Phase;
  daysPassed: number; // 0-10
  partnerProgress: Record<string, PartnerProgress>;
  actionsPerDay: number; // actions used today
  maxActionsPerDay: number;
  log: string[];
}

// ─── Action definitions ───────────────────────────────────────────────────────

interface Action {
  id: FloorAction;
  label: string;
  description: string;
  icon: string;
  effect: (partner: FloorPartner, pp: PartnerProgress) => { moodDelta: number; consequence: string };
  cost: number; // "political capital" cost
}

const ACTIONS: Action[] = [
  {
    id: "funds",
    label: "Offer Constituency Funds",
    icon: "💰",
    description: "Promise accelerated release of MPLADS funds and a central scheme in their constituency.",
    effect: (partner) => ({
      moodDelta: partner.susceptibleTo.includes("funds") ? 25 : 5,
      consequence: partner.susceptibleTo.includes("funds")
        ? "The promise of ₹50 crore in constituency development funds is well received. Support likely."
        : "They are unmoved by financial offers. 'We are not here for funds.' Small goodwill gain only.",
    }),
    cost: 1,
  },
  {
    id: "portfolio",
    label: "Offer Cabinet Position",
    icon: "🪑",
    description: "Offer a Minister of State position in the next reshuffle.",
    effect: (partner) => ({
      moodDelta: partner.susceptibleTo.includes("portfolio") ? 30 : 8,
      consequence: partner.susceptibleTo.includes("portfolio")
        ? "The offer of a Cabinet position is exactly what they wanted. They are strongly inclined to support the government now."
        : "They already have ministerial ambitions elsewhere. Offer helps a little but doesn't swing the decision.",
    }),
    cost: 1,
  },
  {
    id: "ideology",
    label: "Appeal to Policy Agenda",
    icon: "📋",
    description: "Present the government's policy commitments — infrastructure, welfare, rights legislation.",
    effect: (partner) => ({
      moodDelta: partner.susceptibleTo.includes("ideology") ? 20 : 3,
      consequence: partner.susceptibleTo.includes("ideology")
        ? "Your policy agenda resonates. They believe this government will deliver on shared goals."
        : "Policy appeals don't move them much. Their concerns are transactional, not ideological.",
    }),
    cost: 0,
  },
  {
    id: "regional",
    label: "Regional Development Package",
    icon: "🗺️",
    description: "Commit to a special infrastructure package for their state or region.",
    effect: (partner) => ({
      moodDelta: partner.susceptibleTo.includes("regional") ? 28 : 4,
      consequence: partner.susceptibleTo.includes("regional")
        ? "A ₹20,000 crore state package is a game-changer. Their region wins big. They will support the government."
        : "Regional packages are appreciated but not their primary concern right now.",
    }),
    cost: 1,
  },
  {
    id: "legal",
    label: "Invoke Anti-Defection Caution",
    icon: "⚖️",
    description: "Remind them that voting against the party whip could trigger disqualification under the 10th Schedule.",
    effect: (partner) => ({
      moodDelta: partner.susceptibleTo.includes("legal") ? 15 : -10,
      consequence: partner.susceptibleTo.includes("legal")
        ? "The Anti-Defection caution works — they are reminded of the legal risk of a floor cross."
        : "This backfires. They are independent members or from a different party entirely. Threatening them creates bad press.",
    }),
    cost: 0,
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const GOV_SEATS_BASE = 258; // minority government
const TOTAL_SEATS = 543;
const MAJORITY = 272;
const TOTAL_DAYS = 10;
const ACTIONS_PER_DAY = 2;

function computeSupportSeats(progress: Record<string, PartnerProgress>): number {
  let total = GOV_SEATS_BASE;
  for (const [id, pp] of Object.entries(progress)) {
    const partner = FLOOR_PARTNERS.find((p) => p.id === id)!;
    if (!partner) continue;
    if (pp.support === "supporting") total += partner.seats;
    // abstaining: doesn't add to opposition or government (raises effective majority slightly)
    // opposing: adds to opposition
  }
  return total;
}

function getEffectiveMajority(progress: Record<string, PartnerProgress>): number {
  // Effective majority = 50% of members present - abstaining MPs reduce quorum
  const abstaining = Object.entries(progress).reduce((acc, [id, pp]) => {
    if (pp.support !== "abstaining") return acc;
    const p = FLOOR_PARTNERS.find((f) => f.id === id);
    return acc + (p?.seats ?? 0);
  }, 0);
  return Math.ceil((TOTAL_SEATS - abstaining) / 2);
}

function supportFromMood(base: "supporting" | "neutral" | "abstaining" | "opposing", moodChange: number): "supporting" | "neutral" | "abstaining" | "opposing" {
  const threshold = 50;
  if (moodChange >= threshold) return "supporting";
  if (moodChange <= -20) return "opposing";
  if (moodChange >= 15) return "neutral";
  return base;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ConfidenceMotionSim() {
  const initState = (): ConfState => ({
    phase: "briefing",
    daysPassed: 1,
    partnerProgress: Object.fromEntries(
      FLOOR_PARTNERS.map((p) => [p.id, { id: p.id, support: p.currentSupport, moodChange: 0, actionsUsed: [] }])
    ),
    actionsPerDay: 0,
    maxActionsPerDay: ACTIONS_PER_DAY,
    log: [],
  });

  const [state, setState] = useState<ConfState>(initState());
  const [actionResult, setActionResult] = useState<{ partner: string; action: string; consequence: string } | null>(null);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);

  const govSeats = computeSupportSeats(state.partnerProgress);
  const effectiveMajority = getEffectiveMajority(state.partnerProgress);
  const passes = govSeats >= effectiveMajority;
  const daysLeft = TOTAL_DAYS - state.daysPassed;

  function applyAction(partner: FloorPartner, action: Action) {
    if (state.actionsPerDay >= state.maxActionsPerDay) return;

    const pp = state.partnerProgress[partner.id];
    const { moodDelta, consequence } = action.effect(partner, pp);
    const newMood = pp.moodChange + moodDelta;
    const newSupport = supportFromMood(partner.currentSupport, newMood);

    const newLog = [...state.log, `Day ${state.daysPassed}: ${action.label} → ${partner.shortName} (${moodDelta > 0 ? "+" : ""}${moodDelta} mood)`];

    setState((prev) => ({
      ...prev,
      partnerProgress: {
        ...prev.partnerProgress,
        [partner.id]: {
          ...pp,
          moodChange: newMood,
          support: newSupport,
          actionsUsed: [...pp.actionsUsed, action.id],
        },
      },
      actionsPerDay: prev.actionsPerDay + 1,
      log: newLog,
    }));
    setActionResult({ partner: partner.name, action: action.label, consequence });
  }

  function nextDay() {
    if (state.daysPassed >= TOTAL_DAYS) {
      setState((prev) => ({ ...prev, phase: "result" }));
      return;
    }
    setState((prev) => ({
      ...prev,
      daysPassed: prev.daysPassed + 1,
      actionsPerDay: 0,
    }));
    setActionResult(null);
    setActivePartnerId(null);
  }

  function goToResult() {
    setState((prev) => ({ ...prev, phase: "result" }));
  }

  if (state.phase === "briefing") {
    return (
      <div className="space-y-5">
        <div className="card p-6 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-slate-900">
          <div className="text-3xl mb-3">🚨</div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">No-Confidence Motion</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            The opposition has tabled a <strong>motion of no-confidence</strong> under Rule 198. The Speaker has admitted it. You have <strong>10 days</strong> before the floor test.
          </p>

          <div className="grid grid-cols-3 gap-3 text-center mb-4 text-xs">
            <div className="card p-3"><div className="font-bold text-red-500 text-xl">{GOV_SEATS_BASE}</div><div className="text-slate-400">Your current seats</div></div>
            <div className="card p-3"><div className="font-bold text-slate-900 dark:text-slate-100 text-xl">{MAJORITY}</div><div className="text-slate-400">Simple majority</div></div>
            <div className="card p-3"><div className="font-bold text-amber-500 text-xl">{MAJORITY - GOV_SEATS_BASE}</div><div className="text-slate-400">Seats needed</div></div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4 text-xs">
            <div className="font-bold text-red-700 dark:text-red-300 mb-1">Constitutional context</div>
            <div className="text-red-700 dark:text-red-400 space-y-1">
              <div>• <strong>Rule 198</strong> (Lok Sabha Rules): No-confidence motion is admitted if supported by 50+ MPs</div>
              <div>• <strong>Art. 75(3)</strong>: Council of Ministers is collectively responsible to Lok Sabha</div>
              <div>• Speaker must fix a date for the motion within 10 days of admission</div>
              <div>• <strong>10th Schedule</strong>: Members voting against their party's whip risk disqualification</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 mb-4">
            <strong>How it works:</strong> Each day you can take <strong>{ACTIONS_PER_DAY} actions</strong> — meet potential supporters, make offers, apply pressure. You have 10 days to reach {MAJORITY} seats. Abstentions effectively lower the threshold you need.
          </div>

          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Potential floor support</div>
          <div className="space-y-1.5">
            {FLOOR_PARTNERS.map((p) => (
              <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="font-medium text-slate-800 dark:text-slate-200">{p.name}</span>
                <span className="text-slate-400">({p.seats} seats)</span>
                <span className={`ml-auto px-1.5 py-0.5 text-[9px] rounded font-medium ${p.currentSupport === "supporting" ? "bg-emerald-100 text-emerald-700" : p.currentSupport === "abstaining" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                  {p.currentSupport}
                </span>
              </div>
            ))}
          </div>

          <button onClick={() => setState((p) => ({ ...p, phase: "managing" }))}
            className="w-full py-3 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors mt-4">
            Begin Floor Management →
          </button>
        </div>
      </div>
    );
  }

  if (state.phase === "result") {
    const supporting = FLOOR_PARTNERS.filter((p) => state.partnerProgress[p.id].support === "supporting");
    const abstaining = FLOOR_PARTNERS.filter((p) => state.partnerProgress[p.id].support === "abstaining");
    const opposing = FLOOR_PARTNERS.filter((p) => state.partnerProgress[p.id].support === "opposing" || state.partnerProgress[p.id].support === "neutral");

    return (
      <div className="space-y-5">
        <div className="card p-6 text-center space-y-4">
          <div className="text-5xl">{passes ? "🏛️" : "💀"}</div>
          <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-slate-100">
            {passes ? "Government Survives!" : "Government Falls"}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {passes
              ? `The motion of no-confidence was defeated. The government secured ${govSeats} votes against an effective majority of ${effectiveMajority} (${abstaining.length > 0 ? `${abstaining.reduce((a, p) => a + p.seats, 0)} MPs abstained, lowering the threshold` : "full house"}).`
              : `The motion of no-confidence passed. The government secured only ${govSeats} votes — ${effectiveMajority - govSeats} short. The President will invite the opposition to form a government or call fresh elections.`}
          </p>
        </div>

        {/* Vote bar */}
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Floor Test Results</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Gov votes: <strong className={passes ? "text-emerald-600" : "text-red-500"}>{govSeats}</strong></span>
              <span>Effective majority: <strong>{effectiveMajority}</strong></span>
              <span>Abstaining: {abstaining.reduce((a, p) => a + p.seats, 0)}</span>
            </div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
              <div className="absolute left-0 h-full bg-orange-500 rounded-l-full" style={{ width: `${(GOV_SEATS_BASE / TOTAL_SEATS) * 100}%` }} />
              {supporting.map((p, i, arr) => {
                const leftOffset = ([GOV_SEATS_BASE, ...arr.slice(0, i).map((j) => j.seats)].reduce((a, b) => a + b, 0) / TOTAL_SEATS) * 100;
                return <div key={p.id} className="absolute h-full" style={{ left: `${leftOffset}%`, width: `${(p.seats / TOTAL_SEATS) * 100}%`, backgroundColor: p.color }} />;
              })}
              <div className="absolute top-0 h-full w-0.5 bg-white z-10" style={{ left: `${(effectiveMajority / TOTAL_SEATS) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Partner breakdown */}
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Partner Outcomes</div>
          <div className="space-y-2">
            {FLOOR_PARTNERS.map((p) => {
              const pp = state.partnerProgress[p.id];
              const statusColor = pp.support === "supporting" ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200" : pp.support === "abstaining" ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200" : "text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200";
              return (
                <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border text-xs ${statusColor}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ backgroundColor: p.color }}>{p.shortName.slice(0,3)}</div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{p.name} ({p.seats} seats)</div>
                    <div>Mood change: {pp.moodChange > 0 ? "+" : ""}{pp.moodChange} points · {pp.actionsUsed.length} actions used</div>
                  </div>
                  <div className="ml-auto font-bold capitalize">{pp.support}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Log */}
        {state.log.length > 0 && (
          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Action Log</div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {state.log.map((l, i) => <div key={i} className="text-[10px] text-slate-500">{l}</div>)}
            </div>
          </div>
        )}

        <button onClick={() => setState(initState())} className="w-full py-3 rounded-xl text-sm font-medium bg-indigo-600 text-white">
          Try again
        </button>
      </div>
    );
  }

  // ─── Managing phase ────────────────────────────────────────────────────────

  const activePartner = activePartnerId ? FLOOR_PARTNERS.find((p) => p.id === activePartnerId) : null;
  const activePP = activePartnerId ? state.partnerProgress[activePartnerId] : null;

  return (
    <div className="space-y-5">
      {/* Header: day + votes */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-display font-bold text-slate-900 dark:text-slate-100">Day {state.daysPassed} of {TOTAL_DAYS}</div>
            <div className="text-xs text-slate-400">Actions remaining today: <strong>{state.maxActionsPerDay - state.actionsPerDay}</strong></div>
          </div>
          <div className="text-right">
            <div className={`font-display font-bold text-xl ${passes ? "text-emerald-600" : "text-red-500"}`}>{govSeats}</div>
            <div className="text-[10px] text-slate-400">votes (need {effectiveMajority})</div>
          </div>
        </div>

        {/* Progress to majority */}
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
          <div className="absolute left-0 h-full bg-orange-500 rounded-l-full transition-all duration-500" style={{ width: `${(GOV_SEATS_BASE / TOTAL_SEATS) * 100}%` }} />
          {FLOOR_PARTNERS.filter((p) => state.partnerProgress[p.id].support === "supporting").map((p, i, arr) => {
            const leftOffset = ([GOV_SEATS_BASE, ...arr.slice(0, i).map((j) => j.seats)].reduce((a, b) => a + b, 0) / TOTAL_SEATS) * 100;
            return <div key={p.id} className="absolute h-full transition-all" style={{ left: `${leftOffset}%`, width: `${(p.seats / TOTAL_SEATS) * 100}%`, backgroundColor: p.color }} />;
          })}
          <div className="absolute top-0 h-full w-0.5 bg-white z-10" style={{ left: `${(effectiveMajority / TOTAL_SEATS) * 100}%` }} />
        </div>

        {/* Day timeline */}
        <div className="flex gap-0.5 mt-3">
          {Array.from({ length: TOTAL_DAYS }, (_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full ${i < state.daysPassed - 1 ? "bg-emerald-500" : i === state.daysPassed - 1 ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"}`} />
          ))}
        </div>
        <div className="text-[9px] text-slate-400 mt-1">{daysLeft} days until floor test</div>
      </div>

      {/* Action result panel */}
      {actionResult && (
        <div className="card p-4 border border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-900/10">
          <div className="text-[10px] font-bold text-indigo-500 uppercase mb-1">Result</div>
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">{actionResult.action} → {actionResult.partner}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{actionResult.consequence}</p>
        </div>
      )}

      {/* Partner list */}
      <div className="space-y-2">
        {FLOOR_PARTNERS.map((partner) => {
          const pp = state.partnerProgress[partner.id];
          const moodPct = Math.min(100, Math.max(0, 50 + pp.moodChange));
          const isActive = activePartnerId === partner.id;

          return (
            <div key={partner.id} className={`card transition-all ${isActive ? "ring-2 ring-indigo-400" : ""}`}>
              <button
                className="w-full p-4 text-left"
                onClick={() => setActivePartnerId(isActive ? null : partner.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: partner.color }}>
                    {partner.shortName.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{partner.name}</div>
                    <div className="text-[10px] text-slate-400">{partner.seats} seats</div>
                  </div>
                  <div className={`px-2 py-0.5 text-[9px] rounded-full font-semibold shrink-0 ${pp.support === "supporting" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : pp.support === "abstaining" ? "bg-amber-100 text-amber-700" : pp.support === "opposing" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"}`}>
                    {pp.support}
                  </div>
                </div>

                {/* Mood bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                    <span>Mood: {pp.moodChange > 0 ? "+" : ""}{pp.moodChange}</span>
                    <span>{partner.mood}% base</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${moodPct >= 60 ? "bg-emerald-500" : moodPct >= 40 ? "bg-amber-500" : "bg-red-400"}`}
                      style={{ width: `${moodPct}%` }} />
                  </div>
                </div>
              </button>

              {/* Action panel */}
              {isActive && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="text-[10px] text-slate-400 italic">"{partner.demands}"</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Choose an action ({state.maxActionsPerDay - state.actionsPerDay} remaining today)</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {ACTIONS.map((action) => {
                      const alreadyUsed = pp.actionsUsed.includes(action.id);
                      const noActionsLeft = state.actionsPerDay >= state.maxActionsPerDay;
                      const susceptible = partner.susceptibleTo.includes(action.id);
                      return (
                        <button
                          key={action.id}
                          disabled={alreadyUsed || noActionsLeft}
                          onClick={() => { applyAction(partner, action); }}
                          className={`p-3 rounded-xl border text-left transition-all ${alreadyUsed ? "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700" : noActionsLeft ? "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700" : susceptible ? "border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 hover:shadow-sm bg-emerald-50/30 dark:bg-emerald-900/10" : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:shadow-sm"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{action.icon}</span>
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{action.label}</span>
                            {susceptible && <span className="ml-auto text-[9px] px-1.5 rounded bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold shrink-0">Effective</span>}
                          </div>
                          <div className="text-[10px] text-slate-500 leading-snug">{action.description}</div>
                          {alreadyUsed && <div className="text-[9px] text-slate-400 mt-1">Already used</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* End day / call vote */}
      <div className="flex gap-3">
        <button onClick={nextDay} disabled={state.daysPassed >= TOTAL_DAYS}
          className="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 transition-colors disabled:opacity-40">
          {state.daysPassed >= TOTAL_DAYS ? "Day 10 reached" : `End Day ${state.daysPassed} →`}
        </button>
        <button onClick={goToResult}
          className="flex-1 py-3 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
          Call the Vote Now
        </button>
      </div>

      {/* Log */}
      {state.log.length > 0 && (
        <div className="card p-4">
          <div className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Activity Log</div>
          <div className="space-y-0.5 max-h-32 overflow-y-auto">
            {[...state.log].reverse().map((l, i) => <div key={i} className="text-[10px] text-slate-400">{l}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
