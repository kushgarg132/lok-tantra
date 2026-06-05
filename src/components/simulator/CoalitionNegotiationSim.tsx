"use client";

import { useState } from "react";
import { COALITION_PARTNERS } from "@/data/lawmaking";
import type { CoalitionPartner, CoalitionDemand } from "@/data/lawmaking";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NegotiationState {
  partnerStates: Record<string, PartnerNegState>;
  cabinetBerthsUsed: number; // max 5
  policyConcessions: number; // max 3
  fundsCommitted: number;    // in ₹000 crore, max 200
  currentPartnerId: string | null;
  phase: "briefing" | "negotiating" | "result";
}

interface PartnerNegState {
  joined: boolean;
  rejected: boolean;
  demandsAccepted: string[];
  demandsRejected: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RULING_PARTY_SEATS = 240; // BJP alone
const TOTAL_SEATS = 543;
const MAJORITY_THRESHOLD = 272;
const MAX_CABINET_BERTHS = 5;  // available to give to allies
const MAX_POLICY_CONCESSIONS = 3;
const MAX_FUNDS = 200; // ₹000 crore budget for commitments

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeSeats(states: Record<string, PartnerNegState>): number {
  let total = RULING_PARTY_SEATS;
  for (const [id, ps] of Object.entries(states)) {
    const partner = COALITION_PARTNERS.find((p) => p.id === id);
    if (!partner) continue;
    if (ps.joined) total += partner.seats;
  }
  return total;
}

function canJoin(partner: CoalitionPartner, pState: PartnerNegState, berthsUsed: number, policyConcessions: number): boolean {
  // All redlines must be accepted
  const redlines = partner.demands.filter((d) => d.isRedline);
  return redlines.every((d) => pState.demandsAccepted.includes(d.id));
}

function portfolioCost(demands: CoalitionDemand[], accepted: string[]): number {
  return demands.filter((d) => accepted.includes(d.id) && d.type === "portfolio").reduce((acc, d) => acc + d.cost, 0);
}

function policyCost(demands: CoalitionDemand[], accepted: string[]): number {
  return demands.filter((d) => accepted.includes(d.id) && d.type === "policy").reduce((acc, d) => acc + d.cost, 0);
}

function fundsCost(demands: CoalitionDemand[], accepted: string[]): number {
  return demands.filter((d) => accepted.includes(d.id) && (d.type === "funds" || d.type === "seat-sharing")).reduce((acc, d) => acc + d.cost * 30, 0);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CoalitionNegotiationSim() {
  const initState = (): NegotiationState => ({
    partnerStates: Object.fromEntries(
      COALITION_PARTNERS.map((p) => [p.id, { joined: false, rejected: false, demandsAccepted: [], demandsRejected: [] }])
    ),
    cabinetBerthsUsed: 0,
    policyConcessions: 0,
    fundsCommitted: 0,
    currentPartnerId: null,
    phase: "briefing",
  });

  const [ns, setNs] = useState<NegotiationState>(initState());

  const totalSeats = computeSeats(ns.partnerStates);
  const passes = totalSeats >= MAJORITY_THRESHOLD;
  const berthsLeft = MAX_CABINET_BERTHS - ns.cabinetBerthsUsed;
  const policyLeft = MAX_POLICY_CONCESSIONS - ns.policyConcessions;
  const fundsLeft = MAX_FUNDS - ns.fundsCommitted;

  function openNegotiation(id: string) {
    setNs((prev) => ({ ...prev, currentPartnerId: id }));
  }

  function acceptDemand(demand: CoalitionDemand) {
    if (!ns.currentPartnerId) return;
    const pid = ns.currentPartnerId;
    const partner = COALITION_PARTNERS.find((p) => p.id === pid)!;
    const pState = ns.partnerStates[pid];

    // Check resource capacity
    if (demand.type === "portfolio") {
      const newBerths = portfolioCost(partner.demands, [...pState.demandsAccepted, demand.id]);
      if (ns.cabinetBerthsUsed + demand.cost > MAX_CABINET_BERTHS) return; // can't afford
    }
    if (demand.type === "policy") {
      if (ns.policyConcessions + demand.cost > MAX_POLICY_CONCESSIONS) return;
    }

    const newAccepted = [...pState.demandsAccepted, demand.id];
    const newRejected = pState.demandsRejected.filter((d) => d !== demand.id);

    const newPState = { ...pState, demandsAccepted: newAccepted, demandsRejected: newRejected };
    const joined = canJoin(partner, newPState, ns.cabinetBerthsUsed, ns.policyConcessions);

    setNs((prev) => {
      const pCost = portfolioCost(partner.demands, newAccepted) - portfolioCost(partner.demands, pState.demandsAccepted);
      const polCost = policyCost(partner.demands, newAccepted) - policyCost(partner.demands, pState.demandsAccepted);
      const fCost = fundsCost(partner.demands, newAccepted) - fundsCost(partner.demands, pState.demandsAccepted);
      return {
        ...prev,
        partnerStates: { ...prev.partnerStates, [pid]: { ...newPState, joined } },
        cabinetBerthsUsed: prev.cabinetBerthsUsed + pCost,
        policyConcessions: prev.policyConcessions + polCost,
        fundsCommitted: prev.fundsCommitted + fCost,
      };
    });
  }

  function rejectDemand(demand: CoalitionDemand) {
    if (!ns.currentPartnerId) return;
    const pid = ns.currentPartnerId;
    const partner = COALITION_PARTNERS.find((p) => p.id === pid)!;
    const pState = ns.partnerStates[pid];

    const newAccepted = pState.demandsAccepted.filter((d) => d !== demand.id);
    const newRejected = [...pState.demandsRejected.filter((d) => d !== demand.id), demand.id];

    const newPState = { ...pState, demandsAccepted: newAccepted, demandsRejected: newRejected };
    const joined = canJoin(partner, newPState, ns.cabinetBerthsUsed, ns.policyConcessions);

    setNs((prev) => {
      const pCost = portfolioCost(partner.demands, pState.demandsAccepted) - portfolioCost(partner.demands, newAccepted);
      const polCost = policyCost(partner.demands, pState.demandsAccepted) - policyCost(partner.demands, newAccepted);
      const fCost = fundsCost(partner.demands, pState.demandsAccepted) - fundsCost(partner.demands, newAccepted);
      return {
        ...prev,
        partnerStates: { ...prev.partnerStates, [pid]: { ...newPState, joined } },
        cabinetBerthsUsed: Math.max(0, prev.cabinetBerthsUsed - pCost),
        policyConcessions: Math.max(0, prev.policyConcessions - polCost),
        fundsCommitted: Math.max(0, prev.fundsCommitted - fCost),
      };
    });
  }

  function finalise() {
    setNs((prev) => ({ ...prev, phase: "result" }));
  }

  function reset() {
    setNs(initState());
  }

  const currentPartner = ns.currentPartnerId ? COALITION_PARTNERS.find((p) => p.id === ns.currentPartnerId) : null;
  const currentPState = ns.currentPartnerId ? ns.partnerStates[ns.currentPartnerId] : null;

  // ─── Briefing screen ───────────────────────────────────────────────────────
  if (ns.phase === "briefing") {
    return (
      <div className="space-y-5">
        <div className="card p-6 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900">
          <div className="text-3xl mb-3">🤝</div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">Coalition Negotiation</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            The 18th General Election results are in. Your party (BJP) won{" "}
            <strong>{RULING_PARTY_SEATS}</strong> seats — short of the{" "}
            <strong>{MAJORITY_THRESHOLD}</strong>-seat majority. You need regional allies.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div className="card p-3"><div className="font-display font-bold text-slate-900 dark:text-slate-100 text-xl">{RULING_PARTY_SEATS}</div><div className="text-[10px] text-slate-400">Your seats</div></div>
            <div className="card p-3"><div className="font-display font-bold text-red-500 text-xl">{MAJORITY_THRESHOLD - RULING_PARTY_SEATS}</div><div className="text-[10px] text-slate-400">Seats needed</div></div>
            <div className="card p-3"><div className="font-display font-bold text-slate-900 dark:text-slate-100 text-xl">{COALITION_PARTNERS.reduce((a, p) => a + p.seats, 0)}</div><div className="text-[10px] text-slate-400">Available from allies</div></div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
            <div className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">Your Resources</div>
            <div className="grid grid-cols-3 gap-2 text-xs text-amber-800 dark:text-amber-400">
              <div>🪑 Cabinet berths: <strong>{MAX_CABINET_BERTHS}</strong></div>
              <div>📋 Policy concessions: <strong>{MAX_POLICY_CONCESSIONS}</strong></div>
              <div>💰 Funds budget: <strong>₹{MAX_FUNDS},000 cr</strong></div>
            </div>
          </div>
          <div className="text-xs text-slate-500 mb-4">
            <strong>How it works:</strong> Open negotiations with each party. Accept or reject their demands. Some demands are <strong className="text-red-500">redlines</strong> — refusing them means the party walks. Manage your resources carefully across all partners.
          </div>
          <button onClick={() => setNs((p) => ({ ...p, phase: "negotiating" }))}
            className="w-full py-3 rounded-xl text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors">
            Begin Negotiations →
          </button>
        </div>
      </div>
    );
  }

  // ─── Result screen ─────────────────────────────────────────────────────────
  if (ns.phase === "result") {
    const joined = COALITION_PARTNERS.filter((p) => ns.partnerStates[p.id].joined);
    const notJoined = COALITION_PARTNERS.filter((p) => !ns.partnerStates[p.id].joined);
    return (
      <div className="space-y-5">
        <div className="card p-6 text-center space-y-4">
          <div className="text-5xl">{passes ? "🇮🇳" : "❌"}</div>
          <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-slate-100">
            {passes ? "Government Formed!" : "Coalition Failed"}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {passes
              ? `NDA coalition secured ${totalSeats} seats — ${totalSeats - MAJORITY_THRESHOLD} above majority. President invited to form government.`
              : `Only ${totalSeats} seats secured. ${MAJORITY_THRESHOLD - totalSeats} short of majority. President may explore alternative combinations.`}
          </p>
        </div>

        {/* Vote bar */}
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Lok Sabha Composition</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Coalition: <strong className={passes ? "text-emerald-600" : "text-red-500"}>{totalSeats}</strong></span>
              <span>Threshold: <strong className="text-slate-700 dark:text-slate-300">{MAJORITY_THRESHOLD}</strong></span>
              <span>Others: <strong>{TOTAL_SEATS - totalSeats}</strong></span>
            </div>
            <div className="relative h-5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="absolute left-0 h-full bg-orange-500 rounded-l-full transition-all" style={{ width: `${(RULING_PARTY_SEATS / TOTAL_SEATS) * 100}%` }} />
              {joined.map((p, i) => {
                const leftOffset = (([RULING_PARTY_SEATS, ...joined.slice(0, i).map((j) => j.seats)].reduce((a, b) => a + b, 0)) / TOTAL_SEATS) * 100;
                return <div key={p.id} className="absolute h-full" style={{ left: `${leftOffset}%`, width: `${(p.seats / TOTAL_SEATS) * 100}%`, backgroundColor: p.color }} />;
              })}
              <div className="absolute top-0 h-full w-0.5 bg-white z-10" style={{ left: `${(MAJORITY_THRESHOLD / TOTAL_SEATS) * 100}%` }} />
            </div>
            <div className="flex gap-2 flex-wrap text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />BJP ({RULING_PARTY_SEATS})</span>
              {joined.map((p) => (
                <span key={p.id} className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: p.color }} />{p.shortName} ({p.seats})</span>
              ))}
            </div>
          </div>
        </div>

        {/* Partner breakdown */}
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Negotiation Results</div>
          <div className="space-y-2">
            {joined.map((p) => (
              <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <span className="text-emerald-500 font-bold">+{p.seats}</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{p.name}</span>
                <span className="ml-auto text-[10px] text-emerald-600 dark:text-emerald-400">Joined coalition</span>
              </div>
            ))}
            {notJoined.map((p) => (
              <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 opacity-60">
                <span className="text-red-500 font-bold">—{p.seats}</span>
                <span className="text-xs text-slate-700 dark:text-slate-400">{p.name}</span>
                <span className="ml-auto text-[10px] text-red-500">Did not join</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resources used */}
        <div className="card p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Concessions Made</div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div><div className="font-bold text-slate-900 dark:text-slate-100">{ns.cabinetBerthsUsed}/{MAX_CABINET_BERTHS}</div><div className="text-slate-400">Cabinet berths given</div></div>
            <div><div className="font-bold text-slate-900 dark:text-slate-100">{ns.policyConcessions}/{MAX_POLICY_CONCESSIONS}</div><div className="text-slate-400">Policy concessions</div></div>
            <div><div className="font-bold text-slate-900 dark:text-slate-100">₹{ns.fundsCommitted}K cr</div><div className="text-slate-400">Funds committed</div></div>
          </div>
        </div>

        <button onClick={reset} className="w-full py-3 rounded-xl text-sm font-medium bg-indigo-600 text-white">
          Negotiate again
        </button>
      </div>
    );
  }

  // ─── Negotiation screen ────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Overall seat tracker */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-500 uppercase">Coalition Seats</div>
          <div className={`font-display font-bold text-lg ${passes ? "text-emerald-600" : "text-red-500"}`}>{totalSeats} / {MAJORITY_THRESHOLD}</div>
        </div>
        <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="absolute left-0 h-full bg-orange-500 rounded-l-full transition-all duration-500" style={{ width: `${(RULING_PARTY_SEATS / TOTAL_SEATS) * 100}%` }} />
          {COALITION_PARTNERS.filter((p) => ns.partnerStates[p.id].joined).map((p, i, arr) => {
            const leftOffset = (([RULING_PARTY_SEATS, ...arr.slice(0, i).map((j) => j.seats)].reduce((a, b) => a + b, 0)) / TOTAL_SEATS) * 100;
            return <div key={p.id} className="absolute h-full transition-all duration-500" style={{ left: `${leftOffset}%`, width: `${(p.seats / TOTAL_SEATS) * 100}%`, backgroundColor: p.color }} />;
          })}
          <div className="absolute top-0 h-full w-0.5 bg-white dark:bg-slate-900 z-10" style={{ left: `${(MAJORITY_THRESHOLD / TOTAL_SEATS) * 100}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>BJP: {RULING_PARTY_SEATS}</span>
          <span className="font-bold text-slate-600 dark:text-slate-300">▲ {MAJORITY_THRESHOLD} needed</span>
          <span>Gaps: {Math.max(0, MAJORITY_THRESHOLD - totalSeats)} more</span>
        </div>
      </div>

      {/* Resource meters */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Cabinet berths", used: ns.cabinetBerthsUsed, max: MAX_CABINET_BERTHS, color: "bg-violet-500" },
          { label: "Policy concessions", used: ns.policyConcessions, max: MAX_POLICY_CONCESSIONS, color: "bg-blue-500" },
          { label: "Funds (₹000cr)", used: ns.fundsCommitted, max: MAX_FUNDS, color: "bg-amber-500" },
        ].map((r) => (
          <div key={r.label} className="card p-3">
            <div className="text-[9px] text-slate-400 mb-1.5">{r.label}</div>
            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
              <div className={`h-full rounded-full transition-all ${r.color}`} style={{ width: `${(r.used / r.max) * 100}%` }} />
            </div>
            <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400">{r.used}/{r.max}</div>
          </div>
        ))}
      </div>

      {/* Partner cards */}
      <div className="space-y-2.5">
        {COALITION_PARTNERS.map((partner) => {
          const pState = ns.partnerStates[partner.id];
          const canOpen = !pState.joined && !pState.rejected;
          const redlines = partner.demands.filter((d) => d.isRedline);
          const allRedlinesAccepted = redlines.every((d) => pState.demandsAccepted.includes(d.id));

          return (
            <div key={partner.id} className={`card p-4 border-l-4 transition-all ${pState.joined ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10" : "border-slate-300 dark:border-slate-700"}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: partner.color }}>
                  {partner.shortName.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{partner.name}</div>
                  <div className="text-[10px] text-slate-400">{partner.seats} seats · {partner.ideology}</div>
                </div>
                <div className="text-right shrink-0">
                  {pState.joined ? (
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-semibold">✓ Joined</span>
                  ) : (
                    <button onClick={() => openNegotiation(partner.id)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                      Negotiate
                    </button>
                  )}
                </div>
              </div>

              {/* Mood indicator */}
              <div className="mt-2 flex items-center gap-2">
                <div className={`text-[10px] px-2 py-0.5 rounded-full ${partner.mood === "friendly" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : partner.mood === "wary" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-slate-100 text-slate-500"}`}>
                  {partner.mood === "friendly" ? "😊 Friendly" : partner.mood === "wary" ? "😟 Wary" : "😐 Neutral"}
                </div>
                {!pState.joined && (
                  <div className="text-[10px] text-slate-400">
                    {allRedlinesAccepted ? "Redlines met ✓" : `${redlines.filter(d => !pState.demandsAccepted.includes(d.id)).length} redline${redlines.filter(d => !pState.demandsAccepted.includes(d.id)).length !== 1 ? "s" : ""} pending`}
                  </div>
                )}
              </div>

              {/* Demand summary if negotiating */}
              {pState.demandsAccepted.length > 0 && !pState.joined && (
                <div className="mt-2 text-[10px] text-slate-400">
                  Accepted: {pState.demandsAccepted.length}/{partner.demands.length} demands
                  {!allRedlinesAccepted && <span className="text-amber-500 ml-1">— redlines still pending</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Negotiation drawer */}
      {currentPartner && currentPState && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setNs((p) => ({ ...p, currentPartnerId: null })); }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: currentPartner.color }}>
                {currentPartner.shortName.slice(0, 2)}
              </div>
              <div>
                <div className="font-display font-bold text-slate-900 dark:text-slate-100">{currentPartner.name}</div>
                <div className="text-[10px] text-slate-400">{currentPartner.seats} seats · {currentPartner.ideology}</div>
              </div>
              <button onClick={() => setNs((p) => ({ ...p, currentPartnerId: null }))} className="ml-auto text-slate-400 hover:text-slate-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                The {currentPartner.name} is {currentPartner.mood === "friendly" ? "open to discussions" : currentPartner.mood === "wary" ? "reluctant to join without firm commitments" : "weighing their options"}. Review their demands carefully — <strong className="text-red-500">red borders are redlines</strong>.
              </p>

              {currentPartner.demands.map((demand) => {
                const accepted = currentPState.demandsAccepted.includes(demand.id);
                const rejected = currentPState.demandsRejected.includes(demand.id);
                const canAffordPortfolio = demand.type !== "portfolio" || (ns.cabinetBerthsUsed + demand.cost <= MAX_CABINET_BERTHS || accepted);
                const canAffordPolicy = demand.type !== "policy" || (ns.policyConcessions + demand.cost <= MAX_POLICY_CONCESSIONS || accepted);

                return (
                  <div key={demand.id} className={`p-4 rounded-xl border-2 transition-all ${demand.isRedline ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700"} ${accepted ? "bg-emerald-50 dark:bg-emerald-900/20" : rejected ? "bg-red-50/30 dark:bg-red-900/10 opacity-60" : "bg-white dark:bg-slate-900"}`}>
                    <div className="flex items-start gap-2 mb-1">
                      {demand.isRedline && <span className="px-1.5 py-0.5 text-[9px] rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold shrink-0">REDLINE</span>}
                      <span className={`px-1.5 py-0.5 text-[9px] rounded font-medium shrink-0 ${demand.type === "portfolio" ? "bg-violet-100 text-violet-600" : demand.type === "policy" ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"}`}>
                        {demand.type}
                      </span>
                    </div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-1">{demand.label}</div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{demand.description}</p>

                    {/* Resource cost badge */}
                    <div className="mt-2 text-[10px] text-slate-400">
                      Cost: {demand.type === "portfolio" ? `${demand.cost} cabinet berth${demand.cost > 1 ? "s" : ""}` : demand.type === "policy" ? `${demand.cost} policy concession${demand.cost > 1 ? "s" : ""}` : `₹${demand.cost * 30},000 crore`}
                      {(!canAffordPortfolio || !canAffordPolicy) && !accepted && <span className="text-red-500 ml-2">⚠ Insufficient resources</span>}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        disabled={accepted || !canAffordPortfolio || !canAffordPolicy}
                        onClick={() => acceptDemand(demand)}
                        className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${accepted ? "bg-emerald-500 text-white" : !canAffordPortfolio || !canAffordPolicy ? "bg-slate-100 text-slate-300 cursor-not-allowed" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}>
                        {accepted ? "✓ Accepted" : "Accept"}
                      </button>
                      <button
                        disabled={rejected}
                        onClick={() => rejectDemand(demand)}
                        className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${rejected ? "bg-red-200 text-red-600" : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
                        {rejected ? "Rejected" : "Reject"}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Join status */}
              <div className={`p-3 rounded-xl text-xs font-medium text-center ${currentPState.joined ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"}`}>
                {currentPState.joined
                  ? `✓ ${currentPartner.shortName} has agreed to join the coalition (+${currentPartner.seats} seats)`
                  : `Redlines met: ${currentPartner.demands.filter((d) => d.isRedline && currentPState.demandsAccepted.includes(d.id)).length}/${currentPartner.demands.filter(d => d.isRedline).length}. Accept all redlines to secure support.`}
              </div>

              <button onClick={() => setNs((p) => ({ ...p, currentPartnerId: null }))}
                className="w-full py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finalise */}
      <button onClick={finalise}
        className="w-full py-3 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
        Finalise Coalition ({totalSeats} seats) →
      </button>
    </div>
  );
}
