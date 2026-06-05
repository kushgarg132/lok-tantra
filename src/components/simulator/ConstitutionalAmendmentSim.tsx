"use client";

import { useState } from "react";
import { AMENDMENT_SCENARIOS } from "@/data/lawmaking";
import type { AmendmentScenario } from "@/data/lawmaking";

// ─── Types ────────────────────────────────────────────────────────────────────

type AmendStage =
  | "briefing"
  | "pick-scenario"
  | "ls-vote"
  | "rs-vote"
  | "state-ratification"
  | "presidential-assent"
  | "basic-structure"
  | "result";

interface AmendState {
  scenario: AmendmentScenario;
  stage: AmendStage;
  lsVoteResult: VoteResult | null;
  rsVoteResult: VoteResult | null;
  statesRatified: number;
  statesRequired: number;
  presidentialAssented: boolean;
  basicStructureChallenge: boolean;
  basicStructureStruck: boolean;
  failReason: string;
  history: string[];
}

interface VoteResult {
  present: number;
  favor: number;
  against: number;
  threshold: number;
  passed: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Article 368 thresholds:
// Special majority = 2/3 of members present & voting (not total membership)
// ALSO requires majority of total membership of that house

function computeSpecialMajority(totalSeats: number, govSeats: number, political: number): VoteResult {
  // Assume ~85% attendance
  const present = Math.round(totalSeats * 0.85);
  const against = totalSeats - govSeats;
  const againstPresent = Math.round(against * 0.85);
  const favorPresent = present - againstPresent;

  const twoThirdsPresent = Math.ceil((present * 2) / 3);
  const halfTotal = Math.ceil(totalSeats / 2); // also need absolute majority
  const threshold = Math.max(twoThirdsPresent, halfTotal);

  return {
    present,
    favor: favorPresent,
    against: againstPresent,
    threshold,
    passed: favorPresent >= threshold,
  };
}

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];

// Simulate which states ratify — based on whether they are BJP-ruled
const BJP_RULED_STATES = ["Uttar Pradesh","Madhya Pradesh","Rajasthan","Gujarat","Maharashtra","Assam","Goa","Himachal Pradesh","Uttarakhand","Arunachal Pradesh","Tripura","Manipur","Nagaland","Meghalaya","Sikkim"];

// ─── Stage steps ──────────────────────────────────────────────────────────────

const STAGE_INFO: Record<AmendStage, { title: string; icon: string; article: string; description: string }> = {
  briefing: { title: "Briefing", icon: "📖", article: "", description: "" },
  "pick-scenario": { title: "Choose Amendment", icon: "📋", article: "", description: "" },
  "ls-vote": {
    title: "Lok Sabha Vote",
    icon: "🗳️",
    article: "Art. 368(2) — Special majority: 2/3 of members present & voting + majority of total membership",
    description: "The bill is put to vote in Lok Sabha. Constitutional amendments require a special majority — not just a simple majority. This means the government cannot pass an amendment even with a comfortable majority if opposition holds the floor.",
  },
  "rs-vote": {
    title: "Rajya Sabha Vote",
    icon: "🗳️",
    article: "Art. 368(2) — Both Houses must separately pass the amendment by special majority",
    description: "Unlike ordinary bills, constitutional amendments cannot use Art. 108 joint sitting to resolve disagreement between the Houses. Both Houses must independently pass the amendment by special majority.",
  },
  "state-ratification": {
    title: "State Ratification",
    icon: "🗺️",
    article: "Art. 368(2) proviso — Federal provisions require ratification by at least half the states' legislatures",
    description: "Amendments touching the federal structure (legislative lists, powers of states, representation) require ratification by legislatures of at least half the states before the President can assent.",
  },
  "presidential-assent": {
    title: "Presidential Assent",
    icon: "✍️",
    article: "Art. 368(2) — President shall give assent (no option to return constitutional amendments)",
    description: "Unlike ordinary bills, the President has NO discretion to return a constitutional amendment bill. Assent is mandatory once both Houses have passed it (and states have ratified, if required). This was settled in Shankari Prasad (1951).",
  },
  "basic-structure": {
    title: "Basic Structure Challenge",
    icon: "⚖️",
    article: "Kesavananda Bharati v. State of Kerala (1973) — Parliament cannot amend the 'basic structure' of the Constitution",
    description: "Even a perfectly procedurally valid constitutional amendment can be struck down if it violates the 'basic structure' doctrine established by the Supreme Court in 1973. The SC has identified: supremacy of the Constitution, republican & democratic form of government, secularism, separation of powers, federalism, judicial review, and individual freedom.",
  },
  result: { title: "Result", icon: "🏛️", article: "", description: "" },
};

const STAGES_ORDER: AmendStage[] = ["ls-vote", "rs-vote", "state-ratification", "presidential-assent", "basic-structure", "result"];

// ─── Component ────────────────────────────────────────────────────────────────

export function ConstitutionalAmendmentSim() {
  const [state, setState] = useState<AmendState | null>(null);
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set(BJP_RULED_STATES));
  const [showAllStates, setShowAllStates] = useState(false);
  const [basicStructureDefence, setBasicStructureDefence] = useState<string | null>(null);

  function startScenario(scenario: AmendmentScenario) {
    const statesRequired = scenario.amendmentType === "special-plus-states" ? Math.ceil(INDIA_STATES.length / 2) : 0;
    setState({
      scenario,
      stage: scenario.amendmentType === "simple" ? "ls-vote" : "ls-vote",
      lsVoteResult: null,
      rsVoteResult: null,
      statesRatified: 0,
      statesRequired,
      presidentialAssented: false,
      basicStructureChallenge: scenario.isBasicStructure,
      basicStructureStruck: false,
      failReason: "",
      history: [],
    });
  }

  function handleLsVote() {
    if (!state) return;
    const result = computeSpecialMajority(state.scenario.totalLS, state.scenario.govSeatsLS, 0);
    setState((prev) => ({
      ...prev!,
      lsVoteResult: result,
      stage: result.passed ? "rs-vote" : "result",
      failReason: result.passed ? "" : `Lok Sabha vote failed. Government secured ${result.favor} votes but needed ${result.threshold} (2/3 of members present & voting AND majority of total membership).`,
      history: [...prev!.history, `Lok Sabha: ${result.passed ? "PASSED" : "FAILED"} — ${result.favor}/${result.present} in favour, threshold was ${result.threshold}`],
    }));
  }

  function handleRsVote() {
    if (!state) return;
    const result = computeSpecialMajority(state.scenario.totalRS, state.scenario.govSeatsRS, 0);
    const nextStage: AmendStage = !result.passed ? "result" : state.scenario.amendmentType === "special-plus-states" ? "state-ratification" : "presidential-assent";
    setState((prev) => ({
      ...prev!,
      rsVoteResult: result,
      stage: nextStage,
      failReason: result.passed ? "" : `Rajya Sabha vote failed. Government secured ${result.favor} votes but needed ${result.threshold}. Note: no joint sitting remedy exists for constitutional amendments.`,
      history: [...prev!.history, `Rajya Sabha: ${result.passed ? "PASSED" : "FAILED"} — ${result.favor}/${result.present} in favour, threshold was ${result.threshold}`],
    }));
  }

  function handleStateRatification() {
    if (!state) return;
    const ratified = Array.from(selectedStates).length;
    const passed = ratified >= state.statesRequired;
    setState((prev) => ({
      ...prev!,
      statesRatified: ratified,
      stage: passed ? "presidential-assent" : "result",
      failReason: passed ? "" : `Only ${ratified} states ratified, but ${state.statesRequired} are required (half of 28 states). The amendment cannot proceed without adequate state support.`,
      history: [...prev!.history, `State Ratification: ${ratified}/${INDIA_STATES.length} states ratified. Required: ${state.statesRequired}`],
    }));
  }

  function handlePresidentialAssent() {
    if (!state) return;
    setState((prev) => ({
      ...prev!,
      presidentialAssented: true,
      stage: prev!.basicStructureChallenge ? "basic-structure" : "result",
      history: [...prev!.history, "Presidential assent given (mandatory under Art. 368)"],
    }));
  }

  function handleBasicStructure(defence: string) {
    if (!state) return;
    setBasicStructureDefence(defence);
    const struck = defence !== "distinguish";
    setState((prev) => ({
      ...prev!,
      basicStructureStruck: struck,
      stage: "result",
      history: [...prev!.history, struck ? "SC STRUCK DOWN — violates basic structure (Kesavananda Bharati)" : "SC UPHELD — successfully distinguished from basic structure"],
    }));
  }

  function reset() {
    setState(null);
    setSelectedStates(new Set(BJP_RULED_STATES));
    setBasicStructureDefence(null);
  }

  // ─── Briefing / scenario picker ───────────────────────────────────────────

  if (!state) {
    return (
      <div className="space-y-5">
        <div className="card p-5 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-slate-900">
          <div className="text-3xl mb-3">📜</div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">Constitutional Amendment Simulator</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Experience the Article 368 procedure — the most demanding legislative process in Indian democracy. Constitutional amendments require special majorities, and some require state ratification. Even then, the Supreme Court can strike them down if they violate the Basic Structure.
          </p>

          <div className="grid grid-cols-3 gap-3 text-center text-xs mb-4">
            <div className="card p-3"><div className="font-bold text-slate-900 dark:text-slate-100 text-lg">2/3</div><div className="text-slate-400">of members present & voting</div></div>
            <div className="card p-3"><div className="font-bold text-slate-900 dark:text-slate-100 text-lg">+50%</div><div className="text-slate-400">of total membership</div></div>
            <div className="card p-3"><div className="font-bold text-slate-900 dark:text-slate-100 text-lg">14</div><div className="text-slate-400">states must ratify (for federal provisions)</div></div>
          </div>

          <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl p-4 mb-4 text-xs">
            <div className="font-bold text-violet-700 dark:text-violet-300 mb-1">Art. 368 — Amendment Types</div>
            <ul className="space-y-1 text-violet-700 dark:text-violet-400">
              <li><strong>Simple majority:</strong> Some provisions (new states, citizenship) — treated as ordinary law</li>
              <li><strong>Special majority:</strong> Most amendments — 2/3 in each House + absolute majority</li>
              <li><strong>Special + State ratification:</strong> Federal provisions — above + ≥14 state legislatures</li>
            </ul>
          </div>

          <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Choose an amendment to simulate</div>
          <div className="space-y-3">
            {AMENDMENT_SCENARIOS.map((s) => (
              <button key={s.id} onClick={() => startScenario(s)}
                className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:shadow-sm transition-all bg-white dark:bg-slate-900">
                <div className="flex gap-2 mb-1 flex-wrap">
                  <span className={`px-2 py-0.5 text-[9px] rounded-full font-semibold ${s.amendmentType === "special-plus-states" ? "bg-red-100 text-red-700" : "bg-violet-100 text-violet-700"}`}>
                    {s.amendmentType === "special" ? "Special majority" : s.amendmentType === "special-plus-states" ? "Special + State ratification" : "Simple majority"}
                  </span>
                  {s.isBasicStructure && <span className="px-2 py-0.5 text-[9px] rounded-full bg-amber-100 text-amber-700 font-semibold">Basic structure risk</span>}
                </div>
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-1">{s.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{s.articleToAmend}</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { scenario, stage, lsVoteResult, rsVoteResult, statesRatified, statesRequired, basicStructureChallenge, basicStructureStruck, failReason, history } = state;
  const stageInfo = STAGE_INFO[stage];
  const stageIdx = STAGES_ORDER.indexOf(stage);

  // ─── Result screen ────────────────────────────────────────────────────────

  if (stage === "result") {
    const success = !failReason && !basicStructureStruck;
    return (
      <div className="space-y-5">
        <div className="card p-6 text-center space-y-4">
          <div className="text-5xl">{success ? "✅" : basicStructureStruck ? "⚖️" : "❌"}</div>
          <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-slate-100">
            {success ? "Amendment Enacted" : basicStructureStruck ? "Struck Down — Basic Structure" : "Amendment Failed"}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {success
              ? `The ${scenario.articleToAmend} has been successfully amended and is now part of the Constitution.`
              : basicStructureStruck
              ? "The Supreme Court has struck down the amendment as unconstitutional. It violates the basic structure of the Constitution as identified in Kesavananda Bharati (1973)."
              : failReason}
          </p>
        </div>

        {/* Journey log */}
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Amendment Journey</div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className={`text-xs p-2.5 rounded-lg ${h.includes("PASSED") || h.includes("assent") || h.includes("UPHELD") ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : h.includes("FAILED") || h.includes("STRUCK") ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400" : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400"}`}>
                {i + 1}. {h}
              </div>
            ))}
          </div>
        </div>

        {/* Vote detail */}
        {lsVoteResult && (
          <div className="card p-5">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Vote Analysis</div>
            <div className="space-y-4">
              <VoteDisplay label="Lok Sabha" result={lsVoteResult} />
              {rsVoteResult && <VoteDisplay label="Rajya Sabha" result={rsVoteResult} />}
            </div>
          </div>
        )}

        <button onClick={reset} className="w-full py-3 rounded-xl text-sm font-medium bg-violet-600 text-white">
          Try another amendment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stage progress */}
      <div className="flex gap-1">
        {(["ls-vote", "rs-vote", ...(scenario.amendmentType === "special-plus-states" ? ["state-ratification"] : []), "presidential-assent", ...(scenario.isBasicStructure ? ["basic-structure"] : [])] as AmendStage[]).map((s, i, arr) => (
          <div key={s} className={`flex-1 text-center ${STAGES_ORDER.indexOf(s) <= stageIdx ? "opacity-100" : "opacity-30"}`}>
            <div className={`h-1.5 rounded-full mb-1 ${STAGES_ORDER.indexOf(s) < stageIdx ? "bg-emerald-500" : STAGES_ORDER.indexOf(s) === stageIdx ? "bg-violet-500" : "bg-slate-200 dark:bg-slate-700"}`} />
            <div className="text-[8px] text-slate-400 hidden sm:block leading-tight">{STAGE_INFO[s].title}</div>
          </div>
        ))}
      </div>

      {/* Stage header */}
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">{stageInfo.icon}</div>
          <div>
            <div className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">{stageInfo.title}</div>
            <div className="text-[10px] text-slate-400">{scenario.title}</div>
          </div>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">{stageInfo.description}</p>
        {stageInfo.article && (
          <div className="font-mono text-[10px] bg-slate-50 dark:bg-slate-800/60 rounded px-3 py-2 text-slate-500">{stageInfo.article}</div>
        )}
      </div>

      {/* LS Vote */}
      {stage === "ls-vote" && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Lok Sabha Composition</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Total seats</span><strong>{scenario.totalLS}</strong></div>
              <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Government coalition</span><strong className="text-emerald-600">{scenario.govSeatsLS}</strong></div>
              <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Opposition</span><strong className="text-red-500">{scenario.totalLS - scenario.govSeatsLS}</strong></div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <div className="text-xs text-slate-500 mb-2">Special majority threshold (2/3 of present + absolute majority):</div>
                <div className="font-mono text-sm bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded px-3 py-2">
                  ≈ {Math.max(Math.ceil((Math.round(scenario.totalLS * 0.85) * 2) / 3), Math.ceil(scenario.totalLS / 2))} votes required (assuming 85% attendance)
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleLsVote} className="w-full py-3 rounded-xl text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors">
            Call the Division Vote in Lok Sabha →
          </button>
        </div>
      )}

      {/* RS Vote */}
      {stage === "rs-vote" && (
        <div className="space-y-4">
          {lsVoteResult && <VoteDisplay label="Lok Sabha (passed)" result={lsVoteResult} />}
          <div className="card p-5">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Rajya Sabha Composition</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Total seats</span><strong>{scenario.totalRS}</strong></div>
              <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Government seats</span><strong className="text-emerald-600">{scenario.govSeatsRS}</strong></div>
              <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Opposition</span><strong className="text-red-500">{scenario.totalRS - scenario.govSeatsRS}</strong></div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-400">
                ⚠️ No joint sitting remedy: Unlike ordinary bills, Art. 108 joint sitting does NOT apply to constitutional amendments. Both Houses must independently approve.
              </div>
            </div>
          </div>
          <button onClick={handleRsVote} className="w-full py-3 rounded-xl text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors">
            Call the Division Vote in Rajya Sabha →
          </button>
        </div>
      )}

      {/* State Ratification */}
      {stage === "state-ratification" && (
        <div className="space-y-4">
          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">State Legislature Votes</div>
            <p className="text-xs text-slate-500 mb-3">
              {statesRequired} of {INDIA_STATES.length} state legislatures must pass a resolution ratifying the amendment. States shown in <strong>green</strong> have ruling party governments.
            </p>
            <div className="flex justify-between text-xs mb-3">
              <span>Ratified: <strong className={selectedStates.size >= statesRequired ? "text-emerald-600" : "text-amber-500"}>{selectedStates.size}</strong>/{INDIA_STATES.length}</span>
              <span>Required: <strong className="text-violet-600">{statesRequired}</strong></span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto">
              {(showAllStates ? INDIA_STATES : INDIA_STATES).map((st) => {
                const bjpRuled = BJP_RULED_STATES.includes(st);
                const checked = selectedStates.has(st);
                return (
                  <label key={st} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs transition-colors ${checked ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800" : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"}`}>
                    <input type="checkbox" checked={checked}
                      onChange={(e) => {
                        setSelectedStates((prev) => {
                          const next = new Set(prev);
                          if (e.target.checked) next.add(st); else next.delete(st);
                          return next;
                        });
                      }}
                      className="rounded" />
                    <span className={checked ? "text-emerald-700 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400"}>{st}</span>
                    {bjpRuled && <span className="ml-auto text-[9px] text-orange-500 font-bold shrink-0">NDA</span>}
                  </label>
                );
              })}
            </div>
          </div>
          <button onClick={handleStateRatification} className="w-full py-3 rounded-xl text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors">
            Submit State Ratifications ({selectedStates.size} states) →
          </button>
        </div>
      )}

      {/* Presidential Assent */}
      {stage === "presidential-assent" && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Presidential Assent</div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Unlike ordinary bills, the President has <strong>no discretion</strong> to withhold or return a constitutional amendment bill. Assent is mandatory once Parliament passes it. This was settled in <em>Shankari Prasad v. Union of India</em> (1951).
            </p>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-emerald-500">✓</span> Lok Sabha special majority: {lsVoteResult?.favor}/{lsVoteResult?.present} (threshold: {lsVoteResult?.threshold})
              </div>
              {rsVoteResult && (
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <span className="text-emerald-500">✓</span> Rajya Sabha special majority: {rsVoteResult.favor}/{rsVoteResult.present}
                </div>
              )}
              {statesRatified > 0 && (
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <span className="text-emerald-500">✓</span> State ratification: {statesRatified}/{INDIA_STATES.length} states
                </div>
              )}
            </div>
          </div>
          <button onClick={handlePresidentialAssent} className="w-full py-3 rounded-xl text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors">
            Presidential Assent Given (Mandatory) →
          </button>
        </div>
      )}

      {/* Basic Structure Challenge */}
      {stage === "basic-structure" && (
        <div className="space-y-4">
          <div className="card p-5 border-2 border-amber-300 dark:border-amber-700">
            <div className="text-amber-600 dark:text-amber-400 font-bold text-xs uppercase mb-2">⚖️ Supreme Court Challenge</div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              A citizen's petition under Art. 32 challenges the amendment. The petitioner argues it violates the <strong>basic structure</strong> doctrine established in <em>Kesavananda Bharati v. State of Kerala</em> (1973): that Parliament's constituent power is not unlimited.
            </p>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 mb-3">
              <strong>Petitioner's argument:</strong> The amendment to Art. 300A removes an individual's right to approach a court for just compensation — this affects judicial review, which is part of the basic structure. Even Parliament cannot abrogate it.
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">How does the government respond?</div>
            <div className="space-y-2.5">
              {[
                { id: "distinguish", label: "Distinguish from basic structure — Art. 300A is not a fundamental right and judicial review on compensation quantum is not part of basic structure", desc: "Strong argument. SC may agree if the amendment only modifies the modality of compensation, not the principle.", correct: true },
                { id: "plenary", label: "Argue Parliament's plenary constituent power — Art. 368 gives unlimited power to amend any provision", desc: "Weak argument. Explicitly rejected in Kesavananda Bharati. The SC will cite that case against you.", correct: false },
                { id: "dpsp", label: "Invoke Directive Principles — Art. 39(b)/(c) allow property redistribution, overriding Art. 300A for public welfare", desc: "Moderate. The 44th Amendment removed property from Art. 19, but DPSP vs fundamental rights remains contested.", correct: false },
              ].map((opt) => (
                <button key={opt.id} onClick={() => handleBasicStructure(opt.id)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-violet-400 hover:shadow-sm transition-all">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">{opt.label}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Vote display sub-component ───────────────────────────────────────────────

function VoteDisplay({ label, result }: { label: string; result: VoteResult }) {
  const pctFor = (result.favor / result.present) * 100;
  return (
    <div className="card p-4">
      <div className="flex justify-between text-xs text-slate-500 mb-2">
        <span className="font-semibold">{label}</span>
        <span className={result.passed ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>{result.passed ? "✓ Passed" : "✗ Failed"}</span>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between"><span>Present & voting</span><strong>{result.present}</strong></div>
        <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>In favour</span><strong>{result.favor}</strong></div>
        <div className="flex justify-between text-red-500"><span>Against</span><strong>{result.against}</strong></div>
        <div className="flex justify-between text-violet-600 dark:text-violet-400"><span>Threshold (2/3 present + ½ total)</span><strong>{result.threshold}</strong></div>
      </div>
      <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
        <div className="h-full bg-emerald-500 rounded-l-full transition-all" style={{ width: `${pctFor}%` }} />
        <div className="absolute top-0 h-full w-0.5 bg-violet-500" style={{ left: `${(result.threshold / result.present) * 100}%` }} />
      </div>
      <div className="text-[10px] text-slate-400 mt-1">{pctFor.toFixed(1)}% voted in favour (need 66.7%)</div>
    </div>
  );
}
