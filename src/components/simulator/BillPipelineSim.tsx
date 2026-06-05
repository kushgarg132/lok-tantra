"use client";

import { useState } from "react";
import { BILL_SCENARIOS } from "@/data/lawmaking";
import type { BillScenario } from "@/data/lawmaking";

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage =
  | "pick-scenario"
  | "introduction"
  | "committee"
  | "debate"
  | "voting"
  | "president"
  | "judicial"
  | "result";

interface Scores {
  constitutional: number; // 0-100
  political: number;
  public: number;
}

interface ChoiceMade {
  stageId: string;
  question: string;
  chosen: string;
  consequence: string;
  scoreDeltas: Partial<Scores>;
  isIdeal: boolean;
}

interface SimState {
  scenario: BillScenario;
  stage: Stage;
  scores: Scores;
  govVotes: number;
  history: ChoiceMade[];
  stageQuestion: number; // which question within the stage
  stageChoicesMade: string[]; // choices within current stage
  billFailed: boolean;
  failReason: string;
}

// ─── Stage choice data ────────────────────────────────────────────────────────

interface StageChoice {
  id: string;
  label: string;
  consequence: string;
  ideal?: boolean;
  scoreDeltas: Partial<Scores>;
  govVotesDelta?: number;
  endsBill?: boolean;
  endReason?: string;
}

interface StageQuestion {
  id: string;
  question: string;
  context: string;
  article?: string;
  choices: StageChoice[];
}

const STAGE_QUESTIONS: Record<Stage, StageQuestion[]> = {
  "pick-scenario": [],
  result: [],
  introduction: [
    {
      id: "house",
      question: "Which House will you introduce the bill in?",
      context:
        "The originating house matters. Money bills must start in Lok Sabha. Rajya Sabha introduction gives the government less control over scheduling.",
      article: "Art. 107–109 — Legislative procedure; Art. 110 — Money Bills",
      choices: [
        { id: "ls",  label: "Lok Sabha (recommended for government bills)", consequence: "Scheduled in the week's business list. Government controls legislative calendar.", ideal: true,  scoreDeltas: { political: 5 }, govVotesDelta: 0 },
        { id: "rs",  label: "Rajya Sabha",                                  consequence: "Bill will need passage in LS eventually. Rajya Sabha may add time pressure if opposition dominates.", ideal: false, scoreDeltas: { political: -5 }, govVotesDelta: -3 },
        { id: "ls-money", label: "Lok Sabha (mandatory — Money Bill)",      consequence: "Rajya Sabha can only recommend amendments; Lok Sabha can ignore them. Expedited process.", ideal: true,  scoreDeltas: { constitutional: 3, political: 5 }, govVotesDelta: 0 },
      ],
    },
    {
      id: "consultation",
      question: "How will you handle pre-legislative consultation?",
      context:
        "The Supreme Court in Puttaswamy (2017) recognised that meaningful consultation strengthens the legitimacy of legislation touching fundamental rights.",
      article: "Art. 21 — Procedure established by law must be fair (Maneka Gandhi, 1978)",
      choices: [
        { id: "wide",    label: "Wide public consultation — publish draft, invite submissions, hold stakeholder hearings", consequence: "Civil society appreciates transparency. Raises constitutional score. Slows timeline by 3 months.", ideal: true,  scoreDeltas: { constitutional: 10, public: 12, political: -3 } },
        { id: "limited", label: "Targeted consultation — industry, ministries, state governments only",                  consequence: "Balanced approach. Addresses key objectors without full public process.", ideal: false, scoreDeltas: { constitutional: 5, public: 5 } },
        { id: "skip",    label: "No public consultation — invoke urgency, proceed directly to Parliament",               consequence: "Opposition and civil society allege opaque process. Judicial review challenge strengthened.", ideal: false, scoreDeltas: { constitutional: -12, public: -10, political: 5 } },
      ],
    },
  ],
  committee: [
    {
      id: "referral",
      question: "Refer the bill to a parliamentary committee?",
      context:
        "Parliamentary committees provide detailed clause-by-clause scrutiny, take expert evidence, and submit reports. A 2023 PRS study found only 16% of bills in the 17th Lok Sabha were referred to committees.",
      article: "Rule 331 (Lok Sabha Rules) — Standing Committees; Art. 105 — Parliamentary privileges",
      choices: [
        { id: "standing",  label: "Refer to Department-related Standing Committee (3–6 months)", consequence: "Committee hears experts, civil society, and opposition. Report strengthens constitutional basis and public legitimacy.", ideal: true, scoreDeltas: { constitutional: 15, public: 10 }, govVotesDelta: 5 },
        { id: "select",    label: "Refer to a Select Committee (2–3 months, controlled membership)", consequence: "Faster. Government has more influence over committee composition.", ideal: false, scoreDeltas: { constitutional: 8, public: 5 }, govVotesDelta: 2 },
        { id: "skip-comm", label: "Skip committee entirely — certify as urgent legislation", consequence: "Opposition raises strong objection. Speaker's ruling challenged. Constitutional score weakens. Some coalition MPs uncomfortable.", ideal: false, scoreDeltas: { constitutional: -10, public: -8, political: -5 }, govVotesDelta: -8 },
      ],
    },
    {
      id: "response",
      question: "The committee recommends 14 significant amendments. How do you respond?",
      context:
        "Committee recommendations are not binding on the government, but accepting them reduces the risk of judicial challenge and signals respect for deliberative process.",
      article: "Rule 331E — Committee report; Kesavananda Bharati — Doctrine of constitutionality",
      choices: [
        { id: "accept-major",  label: "Accept most major amendments — strengthen fundamental rights protections", consequence: "Bill is substantively improved. Opposition moderates likely to support. Constitutional score rises significantly.", ideal: true,  scoreDeltas: { constitutional: 12, public: 10, political: -5 }, govVotesDelta: 8 },
        { id: "accept-minor",  label: "Accept minor amendments, reject contentious ones",                         consequence: "Balanced response. Some improvement, some original intent preserved.", ideal: false, scoreDeltas: { constitutional: 5, public: 5 }, govVotesDelta: 3 },
        { id: "reject-all",    label: "Reject all amendments — proceed with original bill",                       consequence: "Committee process seen as tokenistic. Opposition claims the government is steamrolling Parliament. Public scepticism rises.", ideal: false, scoreDeltas: { constitutional: -8, public: -8, political: 5 }, govVotesDelta: -5 },
      ],
    },
  ],
  debate: [
    {
      id: "time",
      question: "How much time do you allocate for floor debate?",
      context:
        "Parliamentary debate serves as the legislative record (travaux préparatoires). Courts use it to interpret legislation. Truncated debate weakens legislative intent.",
      article: "Art. 105 — Freedom of speech in Parliament; Rule 342 — Allocation of time",
      choices: [
        { id: "adequate",   label: "Adequate time — 3 full sitting days with all-party speaking list",           consequence: "Robust debate. Legislative record strengthened. Some cross-party goodwill. Small delay.", ideal: true,  scoreDeltas: { constitutional: 8, public: 8, political: -2 }, govVotesDelta: 4 },
        { id: "extensive",  label: "Extensive debate — unlimited, with opposition able to call divisions at each clause", consequence: "Opposition may attempt procedural delay. Government risk of guillotine later. Good public optics.", ideal: false, scoreDeltas: { constitutional: 10, public: 10, political: -8 }, govVotesDelta: -3 },
        { id: "guillotine", label: "Guillotine — restrict debate to 4 hours and put the bill",                   consequence: "Opposition walks out. Media calls it anti-democratic. Judicial review petitions cite truncated debate as procedural unfairness.", ideal: false, scoreDeltas: { constitutional: -8, public: -10, political: 8 } },
      ],
    },
    {
      id: "amendments",
      question: "Opposition moves several amendments on the floor. How do you handle them?",
      context:
        "A minister can move government amendments at any time during debate. Accepting opposition amendments may strengthen the bill and signal bipartisanship.",
      article: "Rule 367 — Amendments to bills; Art. 100 — Voting in Houses",
      choices: [
        { id: "allow",   label: "Debate each amendment on merits — accept 2 that genuinely strengthen the bill", consequence: "Parliament functions as intended. Court notes bipartisan acceptance of key safeguards in legislative history.", ideal: true,  scoreDeltas: { constitutional: 8, public: 6 }, govVotesDelta: 5 },
        { id: "whip",    label: "Issue whip — coalition MPs vote down all opposition amendments",                 consequence: "Whip enforced efficiently but perception of majoritarianism. Risk of anti-defection proceedings if some MPs follow conscience.", ideal: false, scoreDeltas: { political: 5, public: -5, constitutional: -3 }, govVotesDelta: -2 },
        { id: "mixed",   label: "Move government's own amendments addressing the same concerns",                  consequence: "Government controls the wording. Addresses substance while maintaining initiative.", ideal: false, scoreDeltas: { constitutional: 5, public: 4, political: 3 }, govVotesDelta: 2 },
      ],
    },
  ],
  voting: [
    {
      id: "vote-type",
      question: "Call for voice vote or demand a division?",
      context:
        "A division (recorded vote) creates transparency — each MP's vote is logged. Voice votes can be challenged if the result is not clearly overwhelming.",
      article: "Art. 100 — Questions decided by majority; Rule 367–368 — Division procedure",
      choices: [
        { id: "division", label: "Division vote — recorded, each MP's vote logged", consequence: "Transparent. Strengthens democratic legitimacy. Whip system clearly tested.", ideal: true,  scoreDeltas: { constitutional: 5, public: 5 } },
        { id: "voice",    label: "Voice vote — quick, aye/no chorus",                consequence: "Opposition demands division. Speaker must allow. Minor procedural delay and optics issue.", ideal: false, scoreDeltas: { constitutional: -3, public: -3 } },
      ],
    },
    {
      id: "coalition",
      question: "Three coalition partners (18 seats total) are wavering. What do you do?",
      context:
        "Anti-Defection Law (10th Schedule) means MPs voting against party whip risk disqualification. But coalition partners can be managed through persuasion and assurances.",
      article: "10th Schedule — Anti-Defection Law (added by 52nd Amendment, 1985); Art. 102 — Disqualification",
      choices: [
        { id: "assurance", label: "Personal assurance from the PM — address their specific bill concerns",  consequence: "Partners satisfied. They vote with the government. All 18 seats secured. Goodwill built.", ideal: true,  scoreDeltas: { political: 10, public: 5 }, govVotesDelta: 18 },
        { id: "whip-3",    label: "Issue three-line whip — invoke Anti-Defection Law as warning",           consequence: "Partners comply but resentfully. 12 seats secured. Trust damaged. Coalition tensions rise.", ideal: false, scoreDeltas: { political: -3 }, govVotesDelta: 12 },
        { id: "abstain",   label: "Allow partners to abstain (neither support nor oppose)",                  consequence: "12 seats absent from division. Government's effective majority increases slightly (opposing side not boosted) but total supportive votes reduced.", ideal: false, scoreDeltas: { political: -5, public: 3 }, govVotesDelta: 0 },
        { id: "negotiate", label: "Offer policy concession — amend a specific clause partners object to",   consequence: "Partners fully committed. 18 seats secured. Bill slightly modified but improved constitutionally.", ideal: false, scoreDeltas: { political: 8, constitutional: 3 }, govVotesDelta: 18 },
      ],
    },
  ],
  president: [
    {
      id: "president-framing",
      question: "How does the government counsel the President on assent?",
      context:
        "The President acts on the aid and advice of the Council of Ministers (Art. 74). For ordinary bills, the President can return a bill once for reconsideration (Art. 111). For Money Bills, assent is mandatory. The President cannot pocket veto indefinitely — K. M. Nanavati v. State of Bombay clarified this.",
      article: "Art. 111 — Presidential assent; Art. 74 — Cabinet advice binding; Art. 143 — Reference to SC",
      choices: [
        { id: "constitutional", label: "Emphasise constitutional validity — cite committee process, debate quality, judicial precedent", consequence: "If constitutional score is high, President is satisfied and assents immediately.", ideal: true, scoreDeltas: { constitutional: 5 } },
        { id: "mandate",        label: "Emphasise democratic mandate — this was a manifesto commitment, people elected the government for this", consequence: "President notes the democratic argument. May still have constitutional reservations if score is low.", ideal: false, scoreDeltas: { political: 3 } },
        { id: "refer-sc",       label: "Proactively ask President to refer the bill to the SC under Art. 143 for opinion", consequence: "Shows confidence in constitutionality. SC gives advisory opinion within 3 months. Bill delayed but legitimised.", ideal: false, scoreDeltas: { constitutional: 8, public: 5, political: -5 } },
      ],
    },
  ],
  judicial: [
    {
      id: "challenge-type",
      question: "The opposition files a writ petition in the Supreme Court. What is the primary constitutional ground you argue?",
      context:
        "The petitioners challenge the law under Art. 32 (right to approach SC). The government must defend the bill's constitutional validity. The outcome depends on the choices made throughout the bill's journey.",
      article: "Art. 13 — Laws inconsistent with fundamental rights are void; Art. 32 — Right to constitutional remedies",
      choices: [
        { id: "art-21",      label: "Art. 21 — The law is a reasonable restriction, procedure is just, fair, and reasonable (Maneka Gandhi standard)", consequence: "Strong ground if the committee process was robust and debate was adequate. Court weighs legislative record.", ideal: true,  scoreDeltas: { constitutional: 8 } },
        { id: "art-19-2",    label: "Art. 19(2) — The restrictions on speech/expression are reasonable and in public interest", consequence: "Workable if the bill limits expression. Courts apply proportionality test.", ideal: false, scoreDeltas: { constitutional: 4 } },
        { id: "plenary",     label: "Parliament has plenary legislative power — courts cannot second-guess policy",             consequence: "Aggressive argument. Courts distinguish between policy (Parliament's domain) and fundamental rights (Court's domain). Risky.", ideal: false, scoreDeltas: { constitutional: -5, public: -5 } },
      ],
    },
  ],
};

// ─── Score helpers ────────────────────────────────────────────────────────────

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

function applyDeltas(scores: Scores, deltas: Partial<Scores>): Scores {
  return {
    constitutional: clamp(scores.constitutional + (deltas.constitutional ?? 0)),
    political: clamp(scores.political + (deltas.political ?? 0)),
    public: clamp(scores.public + (deltas.public ?? 0)),
  };
}

function computeVotes(scenario: BillScenario, political: number, publicScore: number): number {
  let votes = scenario.govSeats;
  // Coalition coherence: if political < 55, partners defect
  if (political < 40) votes -= 20;
  else if (political < 55) votes -= 10;
  // Public support crossovers
  if (publicScore > 70) votes += 4;
  else if (publicScore < 40) votes -= 4;
  return Math.max(0, votes);
}

function judicialOutcome(constitutional: number): { verdict: string; detail: string; color: string } {
  if (constitutional >= 80) return { verdict: "Upheld — Unanimous", detail: "The Court finds the legislation constitutionally sound. The legislative process was robust, rights safeguards were incorporated, and proportionality is established.", color: "emerald" };
  if (constitutional >= 65) return { verdict: "Upheld with Conditions", detail: "The Court upholds the law but reads down two provisions. The government must issue rules within 6 months to ensure proportionality under Art. 21.", color: "blue" };
  if (constitutional >= 50) return { verdict: "Partially Struck Down", detail: "Three key sections are declared unconstitutional for violating Art. 21. The government may amend and re-enact those provisions.", color: "amber" };
  return { verdict: "Struck Down", detail: "The Act is declared unconstitutional. The inadequate pre-legislative process, truncated debate, and lack of fundamental rights safeguards render it void under Art. 13.", color: "red" };
}

function presidentOutcome(constitutional: number, scenario: BillScenario): { action: string; detail: string } {
  if (scenario.type === "money") return { action: "Assented (mandatory)", detail: "The President must assent to Money Bills. Rajya Sabha's role is only to recommend." };
  if (constitutional >= 70) return { action: "Assented", detail: "The President, satisfied with the constitutional process and advice of the Council of Ministers, gives assent under Art. 111." };
  if (constitutional >= 55) return { action: "Returned for reconsideration", detail: "The President returns the bill with a message seeking reconsideration on constitutional grounds. Parliament can re-pass it unchanged and the President must then assent." };
  return { action: "Referred to Supreme Court (Art. 143)", detail: "The President exercises the discretion to seek the SC's advisory opinion under Art. 143 before assent, citing serious constitutional questions." };
}

// ─── Stage label map ──────────────────────────────────────────────────────────

const STAGES: { id: Stage; label: string; icon: string }[] = [
  { id: "introduction", label: "Introduction", icon: "📋" },
  { id: "committee",    label: "Committee",    icon: "🔍" },
  { id: "debate",       label: "Debate",       icon: "🎙️" },
  { id: "voting",       label: "Voting",       icon: "🗳️" },
  { id: "president",    label: "President",    icon: "✍️" },
  { id: "judicial",     label: "SC Review",    icon: "⚖️" },
];

function nextStage(current: Stage): Stage {
  const order: Stage[] = ["introduction", "committee", "debate", "voting", "president", "judicial", "result"];
  const idx = order.indexOf(current);
  return order[idx + 1] ?? "result";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-slate-500">{label}</span>
        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{value}</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function VoteBar({ gov, threshold, total }: { gov: number; threshold: number; total: number }) {
  const govPct = (gov / total) * 100;
  const threshPct = (threshold / total) * 100;
  const opp = total - gov;
  const passes = gov >= threshold;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Coalition: <strong className="text-slate-900 dark:text-slate-100">{gov}</strong></span>
        <span>Threshold: <strong className={passes ? "text-emerald-600" : "text-red-500"}>{threshold}</strong></span>
        <span>Opposition: <strong className="text-slate-900 dark:text-slate-100">{opp}</strong></span>
      </div>
      <div className="relative h-5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-700 rounded-l-full" style={{ width: `${govPct}%` }} />
        <div className="absolute right-0 top-0 h-full bg-red-400 transition-all duration-700 rounded-r-full" style={{ width: `${((total - gov) / total) * 100}%` }} />
        {/* Threshold marker */}
        <div className="absolute top-0 h-full w-0.5 bg-white dark:bg-slate-900 z-10" style={{ left: `${threshPct}%` }} />
      </div>
      <div className={`text-center text-xs font-bold ${passes ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
        {passes ? `✓ Bill passes — ${gov - threshold} seat margin` : `✗ Bill fails — short by ${threshold - gov} seats`}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BillPipelineSim() {
  const [state, setState] = useState<SimState | null>(null);
  const [pendingChoice, setPendingChoice] = useState<{ choice: StageChoice; question: StageQuestion } | null>(null);

  function startSim(scenario: BillScenario) {
    setState({
      scenario,
      stage: "introduction",
      scores: { ...scenario.startingScores },
      govVotes: scenario.govSeats,
      history: [],
      stageQuestion: 0,
      stageChoicesMade: [],
      billFailed: false,
      failReason: "",
    });
    setPendingChoice(null);
  }

  function handleChoice(choice: StageChoice, question: StageQuestion) {
    if (!state) return;
    setPendingChoice({ choice, question });
  }

  function handleContinue() {
    if (!state || !pendingChoice) return;
    const { choice, question } = pendingChoice;

    const newScores = applyDeltas(state.scores, choice.scoreDeltas);
    const newVotes = state.govVotes + (choice.govVotesDelta ?? 0);

    const newHistory: ChoiceMade[] = [
      ...state.history,
      {
        stageId: state.stage,
        question: question.question,
        chosen: choice.label,
        consequence: choice.consequence,
        scoreDeltas: choice.scoreDeltas,
        isIdeal: choice.ideal ?? false,
      },
    ];

    if (choice.endsBill) {
      setState({ ...state, scores: newScores, govVotes: newVotes, history: newHistory, billFailed: true, failReason: choice.endReason ?? "" });
      setPendingChoice(null);
      return;
    }

    const currentStageQs = STAGE_QUESTIONS[state.stage];
    const nextQIdx = state.stageQuestion + 1;

    if (nextQIdx < currentStageQs.length) {
      setState({ ...state, scores: newScores, govVotes: newVotes, history: newHistory, stageQuestion: nextQIdx });
    } else {
      const next = nextStage(state.stage);
      setState({ ...state, scores: newScores, govVotes: newVotes, history: newHistory, stage: next, stageQuestion: 0, stageChoicesMade: [] });
    }
    setPendingChoice(null);
  }

  // Scenario picker
  if (!state) {
    return (
      <div className="space-y-5">
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-1">Choose a Bill Scenario</h3>
          <p className="text-xs text-slate-500 mb-4">Select a bill to guide through Parliament — from introduction to presidential assent and judicial review.</p>
          <div className="space-y-3">
            {BILL_SCENARIOS.map((s) => (
              <button key={s.id} onClick={() => startSim(s)}
                className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-sm transition-all bg-white dark:bg-slate-900 group">
                <div className="flex items-start gap-3">
                  <div className={`px-2 py-0.5 text-[10px] rounded-full font-semibold shrink-0 mt-0.5 ${s.controversy === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : s.controversy === "medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"}`}>
                    {s.controversy === "high" ? "Controversial" : s.controversy === "medium" ? "Moderate" : "Routine"} · {s.type}
                  </div>
                </div>
                <div className="mt-2 font-semibold text-sm text-slate-900 dark:text-slate-100">{s.title}</div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">{s.description}</div>
                <div className="mt-2 flex gap-3 text-[10px] text-slate-400">
                  <span>Govt: {s.govSeats}/{s.totalSeats} seats</span>
                  <span>Need: {s.threshold}</span>
                  <span>Ministry: {s.ministry}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { scenario, stage, scores, govVotes, history, stageQuestion, billFailed, failReason } = state;

  // Result screen
  if (stage === "result" || billFailed) {
    const finalVotes = computeVotes(scenario, scores.political, scores.public);
    const passes = finalVotes >= scenario.threshold;
    const pOutcome = presidentOutcome(scores.constitutional, scenario);
    const jOutcome = judicialOutcome(scores.constitutional);
    const idealChoices = history.filter((h) => h.isIdeal).length;

    return (
      <div className="space-y-5">
        <div className="card p-6 text-center space-y-4">
          <div className="text-5xl">{billFailed ? "❌" : passes ? "🏛️" : "📋"}</div>
          <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-slate-100">
            {billFailed ? "Bill Failed" : passes ? "Bill Enacted" : "Bill Defeated"}
          </h3>
          {billFailed && <p className="text-sm text-red-600 dark:text-red-400">{failReason}</p>}
          {!billFailed && (
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div><strong>Presidential action:</strong> {pOutcome.action}</div>
              <div className="text-xs text-slate-500 mt-1">{pOutcome.detail}</div>
              {passes && (
                <>
                  <div className="mt-3"><strong>SC verdict:</strong> {jOutcome.verdict}</div>
                  <div className="text-xs text-slate-500">{jOutcome.detail}</div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Final vote count */}
        {!billFailed && (
          <div className="card p-5">
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Final Division</h4>
            <VoteBar gov={finalVotes} threshold={scenario.threshold} total={scenario.totalSeats} />
          </div>
        )}

        {/* Score summary */}
        <div className="card p-5 space-y-3">
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Final Scores</h4>
          <ScoreBar label="Constitutional strength" value={scores.constitutional} color="bg-violet-500" />
          <ScoreBar label="Political management" value={scores.political} color="bg-blue-500" />
          <ScoreBar label="Public legitimacy" value={scores.public} color="bg-emerald-500" />
          <div className="text-xs text-slate-400 pt-1">Ideal choices made: {idealChoices}/{history.length}</div>
        </div>

        {/* Choice review */}
        <div className="card p-5">
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Your Decisions</h4>
          <div className="space-y-3">
            {history.map((h, i) => (
              <div key={i} className={`p-3 rounded-xl text-xs border ${h.isIdeal ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20" : "border-slate-200 dark:border-slate-700"}`}>
                <div className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">{h.stageId.toUpperCase()} — {h.question}</div>
                <div className="text-slate-600 dark:text-slate-400">
                  {h.isIdeal ? "✓" : "○"} {h.chosen}
                </div>
                <div className="text-slate-500 mt-1 italic">{h.consequence}</div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {Object.entries(h.scoreDeltas).map(([k, v]) => (
                    <span key={k} className={`font-mono text-[10px] ${(v ?? 0) > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                      {k.slice(0, 4)}: {(v ?? 0) > 0 ? "+" : ""}{v}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => { setState(null); setPendingChoice(null); }}
          className="w-full py-3 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
          Try another scenario
        </button>
      </div>
    );
  }

  const stageQs = STAGE_QUESTIONS[stage] ?? [];
  const currentQ = stageQs[stageQuestion];
  const stageIdx = STAGES.findIndex((s) => s.id === stage);
  const finalVotesPreview = computeVotes(scenario, scores.political, scores.public);

  return (
    <div className="space-y-5">
      {/* Stage progress */}
      <div className="flex gap-1">
        {STAGES.map((s, i) => (
          <div key={s.id} className={`flex-1 text-center ${i <= stageIdx ? "opacity-100" : "opacity-30"}`}>
            <div className={`h-1.5 rounded-full mb-1 ${i < stageIdx ? "bg-emerald-500" : i === stageIdx ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"}`} />
            <div className="text-[9px] text-slate-400 hidden sm:block">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Current stage header */}
      <div className="card p-4 flex items-center gap-3">
        <div className="text-2xl">{STAGES[stageIdx]?.icon}</div>
        <div>
          <div className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">{STAGES[stageIdx]?.label}</div>
          <div className="text-[10px] text-slate-400">{scenario.shortTitle} · Question {stageQuestion + 1}/{stageQs.length}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-[10px] text-slate-400">Govt votes (est.)</div>
          <div className={`font-display font-bold text-sm ${finalVotesPreview >= scenario.threshold ? "text-emerald-600" : "text-red-500"}`}>{finalVotesPreview}/{scenario.threshold}</div>
        </div>
      </div>

      {/* Live scores */}
      <div className="card p-4 space-y-2.5">
        <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Bill Health</div>
        <ScoreBar label="Constitutional" value={scores.constitutional} color="bg-violet-500" />
        <ScoreBar label="Political" value={scores.political} color="bg-blue-500" />
        <ScoreBar label="Public" value={scores.public} color="bg-emerald-500" />
      </div>

      {/* Question / consequence */}
      {pendingChoice ? (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-[10px] font-bold text-indigo-500 uppercase mb-2">Consequence</div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{pendingChoice.choice.consequence}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {Object.entries(pendingChoice.choice.scoreDeltas).map(([k, v]) => (
                <span key={k} className={`px-2 py-0.5 text-xs font-mono rounded-full ${(v ?? 0) > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
                  {k}: {(v ?? 0) > 0 ? "+" : ""}{v}
                </span>
              ))}
              {(pendingChoice.choice.govVotesDelta ?? 0) !== 0 && (
                <span className={`px-2 py-0.5 text-xs font-mono rounded-full ${(pendingChoice.choice.govVotesDelta ?? 0) > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  votes: {(pendingChoice.choice.govVotesDelta ?? 0) > 0 ? "+" : ""}{pendingChoice.choice.govVotesDelta}
                </span>
              )}
            </div>
          </div>
          <button onClick={handleContinue}
            className="w-full py-3 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            Continue →
          </button>
        </div>
      ) : currentQ ? (
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-2">{currentQ.question}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{currentQ.context}</p>
            {currentQ.article && (
              <div className="font-mono text-[10px] bg-slate-50 dark:bg-slate-800/60 rounded px-3 py-2 text-slate-500">{currentQ.article}</div>
            )}
          </div>
          <div className="space-y-2.5">
            {currentQ.choices.filter((c) => {
              if (c.id === "ls-money") return scenario.type === "money";
              if (c.id === "ls") return scenario.type !== "money";
              return true;
            }).map((choice) => (
              <button key={choice.id} onClick={() => handleChoice(choice, currentQ)}
                className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-400 hover:shadow-sm transition-all">
                <div className="text-sm text-slate-800 dark:text-slate-200">{choice.label}</div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Constitutional basis sidebar */}
      <div className="card p-4">
        <div className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Constitutional Basis</div>
        <div className="space-y-1">
          {scenario.constitutionalBasis.map((b) => (
            <div key={b} className="text-[10px] font-mono text-slate-500 bg-slate-50 dark:bg-slate-800/60 rounded px-2 py-1">{b}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
