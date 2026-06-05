"use client";

import { useState } from "react";

interface Simulation {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  steps: SimStep[];
}

interface SimStep {
  id: number;
  title: string;
  actor: string;
  description: string;
  constitutionalBasis?: string;
  options?: { label: string; outcome: string; correct?: boolean }[];
  fact?: string;
}

const simulations: Simulation[] = [
  {
    id: "bill-passing",
    title: "How a Bill Becomes Law",
    description: "Walk through the complete legislative process — from introduction to Presidential assent",
    category: "Legislative",
    difficulty: "beginner",
    estimatedTime: "10 min",
    steps: [
      {
        id: 1,
        title: "Bill Introduction",
        actor: "Member of Parliament / Minister",
        description: "A bill is introduced in either House of Parliament (Lok Sabha or Rajya Sabha). Government bills are introduced by ministers, while private member bills can be introduced by any MP.",
        constitutionalBasis: "Art. 107-108",
        fact: "A Money Bill can only be introduced in the Lok Sabha, not in the Rajya Sabha (Art. 109).",
      },
      {
        id: 2,
        title: "First Reading",
        actor: "House in which bill is introduced",
        description: "The bill is introduced and its title and purpose are read out. No debate happens at this stage. The bill is published in the Gazette of India.",
        constitutionalBasis: "Art. 107",
      },
      {
        id: 3,
        title: "Committee Stage",
        actor: "Standing Committee / Select Committee / Joint Committee",
        description: "The bill is referred to a parliamentary committee for detailed examination. The committee takes expert opinions, hears stakeholders, examines the bill clause-by-clause, and submits a report.",
        fact: "Committee stages are not mandatory but are considered best practice. Sometimes bills are passed without committee review, which is controversial.",
        options: [
          { label: "Refer to Standing Committee", outcome: "The committee will take 3-6 months to examine and submit recommendations.", correct: true },
          { label: "Skip committee stage", outcome: "The bill proceeds directly to debate. Critics may argue insufficient scrutiny." },
          { label: "Refer to Joint Committee", outcome: "Both houses form a joint committee for complex bills requiring broader examination." },
        ],
      },
      {
        id: 4,
        title: "Second Reading — General Discussion",
        actor: "Full House",
        description: "The bill is discussed in general terms. Members debate the principles and provisions of the bill. At this stage, the House can: (a) accept the bill, (b) reject it, or (c) refer it to a committee.",
      },
      {
        id: 5,
        title: "Second Reading — Clause-by-Clause",
        actor: "Full House",
        description: "Each clause is discussed individually and voted upon. Amendments can be proposed and voted on. This is the most detailed stage of debate.",
      },
      {
        id: 6,
        title: "Third Reading",
        actor: "Full House",
        description: "The bill is put to a final vote in the House. Only verbal or formal amendments are allowed. The bill is passed if it gets the required majority.",
        options: [
          { label: "Simple Majority", outcome: "Most bills require a simple majority — more than half of members present and voting.", correct: true },
          { label: "Special Majority", outcome: "Constitutional amendment bills require 2/3 of members present and voting + majority of total membership." },
        ],
      },
      {
        id: 7,
        title: "Transmission to Other House",
        actor: "Other House of Parliament",
        description: "The bill is sent to the other House, which repeats the process (First Reading to Third Reading). The other House can: pass it, reject it, amend it, or take no action for 6 months.",
        constitutionalBasis: "Art. 107-108",
        fact: "If the two Houses disagree, the President may summon a Joint Sitting (Art. 108) — this has happened only 3 times in Indian history.",
      },
      {
        id: 8,
        title: "Presidential Assent",
        actor: "President of India",
        description: "The bill is presented to the President, who may: (a) give assent — bill becomes law, (b) withhold assent — bill fails, or (c) return the bill for reconsideration (not available for Money Bills). If Parliament passes it again, the President must give assent.",
        constitutionalBasis: "Art. 111",
        fact: "The President has never withheld assent outright. The 'pocket veto' — neither assenting nor returning — has been used once, by President Zail Singh on the Indian Post Office Amendment Bill, 1986.",
      },
      {
        id: 9,
        title: "Law Enacted",
        actor: "Government of India",
        description: "The bill becomes an Act of Parliament. It is published in the Official Gazette and comes into force either immediately or on a date specified in the Act.",
        fact: "India has approximately 1,300 central laws and over 30,000 state laws currently in force.",
      },
    ],
  },
  {
    id: "no-confidence",
    title: "No-Confidence Motion",
    description: "Understand how a government can be brought down through a vote of no-confidence",
    category: "Executive",
    difficulty: "intermediate",
    estimatedTime: "8 min",
    steps: [
      {
        id: 1,
        title: "Motion Submitted",
        actor: "Opposition MP",
        description: "Any member of the Lok Sabha can introduce a motion of no-confidence against the Council of Ministers. The motion requires at least 50 members to support its admission.",
        constitutionalBasis: "Art. 75(3), Rule 198 of Lok Sabha",
      },
      {
        id: 2,
        title: "Speaker's Decision",
        actor: "Speaker of Lok Sabha",
        description: "The Speaker examines whether the motion has the support of at least 50 members (by members rising in their seats). If satisfied, the Speaker admits the motion and allocates time for debate.",
        fact: "A no-confidence motion can only be moved in the Lok Sabha, not the Rajya Sabha, because the government is collectively responsible to the Lok Sabha under Article 75(3).",
      },
      {
        id: 3,
        title: "Debate",
        actor: "Members of Lok Sabha",
        description: "A full debate takes place where opposition members highlight their reasons for the motion, and the ruling party defends its record. The Prime Minister typically responds at the end.",
      },
      {
        id: 4,
        title: "Vote",
        actor: "All Members of Lok Sabha",
        description: "The motion is put to vote. If the motion is passed by a simple majority of members present and voting, the government must resign.",
        options: [
          { label: "Motion Passes", outcome: "The Council of Ministers must resign. The President invites the opposition to form the government or calls fresh elections." },
          { label: "Motion Fails", outcome: "The government survives. Another no-confidence motion cannot be moved for 6 months (convention).", correct: true },
        ],
        fact: "27 no-confidence motions have been moved in India. Only one succeeded — against V.P. Singh's government in 1990. The most recent was against the Modi government in 2018, which failed.",
      },
    ],
  },
  {
    id: "constitutional-amendment",
    title: "Constitutional Amendment",
    description: "How the Constitution can be amended under Article 368",
    category: "Constitutional",
    difficulty: "advanced",
    estimatedTime: "12 min",
    steps: [
      {
        id: 1,
        title: "Amendment Bill Introduced",
        actor: "Member of Parliament",
        description: "A bill to amend the Constitution can be introduced in either House of Parliament. It can be introduced by a minister or a private member. No prior permission of the President is required.",
        constitutionalBasis: "Art. 368",
      },
      {
        id: 2,
        title: "Passage in Each House",
        actor: "Both Houses of Parliament",
        description: "The bill must be passed in each House separately by a 'Special Majority' — a majority of total membership of the House AND a 2/3 majority of members present and voting. No joint sitting is possible for amendment bills.",
        constitutionalBasis: "Art. 368(2)",
        fact: "This means if the Lok Sabha has 545 members, at least 273 must vote in favor, and of those present and voting, 2/3 must support the bill.",
      },
      {
        id: 3,
        title: "State Ratification (If Required)",
        actor: "State Legislatures",
        description: "Certain amendments that affect federal provisions must also be ratified by at least half of the state legislatures. These include changes to election of President, extent of executive/judicial power, representation of states in Parliament, and Article 368 itself.",
        constitutionalBasis: "Art. 368(2) proviso",
        options: [
          { label: "Ratification needed", outcome: "The bill is sent to state legislatures. At least 15 of 28 states must ratify it by simple majority.", correct: true },
          { label: "No ratification needed", outcome: "The bill goes directly to the President for assent." },
        ],
      },
      {
        id: 4,
        title: "Presidential Assent",
        actor: "President of India",
        description: "The President must give assent to a Constitution Amendment Bill. Unlike ordinary bills, the President cannot return the bill for reconsideration — assent is obligatory.",
        constitutionalBasis: "Art. 368(2)",
        fact: "The Basic Structure Doctrine (Kesavananda Bharati, 1973) limits Parliament's amending power — the basic structure of the Constitution cannot be altered even by amendment.",
      },
      {
        id: 5,
        title: "Amendment Effective",
        actor: "Constitution of India",
        description: "The amendment becomes part of the Constitution from the date of the President's assent (unless a different date is specified). The amended Constitution is the supreme law.",
        fact: "India has had 106 Constitutional Amendments as of 2024. The 42nd Amendment (1976) is called the 'Mini Constitution' for the sweeping changes it made. The 44th Amendment (1978) undid many of those changes.",
      },
    ],
  },
];

export function GovernanceSimulator({ simulations: simulationsFromDB }: { simulations?: Simulation[] } = {}) {
  const simulations: Simulation[] = simulationsFromDB ?? [];
  const [selectedSim, setSelectedSim] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});

  const activeSim = simulations.find((s) => s.id === selectedSim);

  if (!activeSim) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {simulations.map((sim) => (
            <button
              key={sim.id}
              onClick={() => { setSelectedSim(sim.id); setCurrentStep(0); setSelectedOptions({}); }}
              className="card-interactive p-6 text-left group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-saffron text-[10px]">{sim.category}</span>
                <span className={`badge text-[10px] ${
                  sim.difficulty === "beginner" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : sim.difficulty === "intermediate" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {sim.difficulty}
                </span>
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-slate-100">
                {sim.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {sim.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">{sim.steps.length} steps &middot; {sim.estimatedTime}</span>
                <span className="text-sm font-medium text-saffron-600 dark:text-saffron-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Start
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const step = activeSim.steps[currentStep];
  const progress = ((currentStep + 1) / activeSim.steps.length) * 100;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedSim(null)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-saffron-500 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          All Simulations
        </button>
        <span className="text-sm text-slate-500">
          Step {currentStep + 1} of {activeSim.steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-saffron-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Step list */}
        <div className="lg:col-span-1 space-y-1">
          {activeSim.steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all text-sm ${
                i === currentStep
                  ? "bg-saffron-50 dark:bg-saffron-900/20 text-saffron-700 dark:text-saffron-400 font-medium"
                  : i < currentStep
                  ? "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                  : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                i === currentStep
                  ? "bg-saffron-500 text-white"
                  : i < currentStep
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}>
                {i < currentStep ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : i + 1}
              </div>
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Step detail */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-saffron text-[10px]">Step {currentStep + 1}</span>
              <span className="badge-navy text-[10px]">{step.actor}</span>
            </div>

            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">
              {step.title}
            </h3>

            <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              {step.description}
            </p>

            {step.constitutionalBasis && (
              <div className="mt-4 px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-800 dark:text-amber-300 font-mono inline-block">
                {step.constitutionalBasis}
              </div>
            )}

            {step.fact && (
              <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 flex-shrink-0 mt-0.5">i</span>
                  <p className="text-sm text-blue-700 dark:text-blue-400">{step.fact}</p>
                </div>
              </div>
            )}

            {step.options && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-slate-500 mb-3">What happens next?</h4>
                <div className="space-y-2">
                  {step.options.map((opt, i) => {
                    const isSelected = selectedOptions[currentStep] === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedOptions({ ...selectedOptions, [currentStep]: i })}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? opt.correct
                              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                              : "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {opt.label}
                        </div>
                        {isSelected && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 animate-fade-in">
                            {opt.outcome}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (currentStep < activeSim.steps.length - 1) {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                disabled={currentStep === activeSim.steps.length - 1}
                className="px-6 py-2.5 rounded-xl bg-saffron-500 text-white font-medium text-sm hover:bg-saffron-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {currentStep === activeSim.steps.length - 1 ? "Complete" : "Next Step"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
