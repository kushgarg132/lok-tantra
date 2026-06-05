"use client";

import { useState } from "react";

type ExplainerType = "constitution-preamble" | "federal-structure" | "bill-flow" | "court-hierarchy" | "executive-structure" | "elections-fptp";

interface VisualExplainerProps {
  type: ExplainerType;
  topicId: string;
}

// ─── Preamble Visual ──────────────────────────────────────────────────────────
function PreambleExplainer() {
  const words = [
    { word: "SOVEREIGN", color: "#D97706", desc: "India is not subject to any external authority. It makes its own domestic and foreign policy." },
    { word: "SOCIALIST", color: "#DC2626", desc: "Added in 1976 (42nd Amendment). Commitment to reducing inequality and equitable distribution of resources." },
    { word: "SECULAR", color: "#2563EB", desc: "Added in 1976. No state religion — all religions treated equally by the state." },
    { word: "DEMOCRATIC", color: "#7C3AED", desc: "Government derives its authority from the people through regular, free, and fair elections." },
    { word: "REPUBLIC", color: "#059669", desc: "The head of state (President) is elected, not a hereditary monarch." },
  ];
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="text-center text-xs text-slate-500 italic">Click each word to learn its meaning</div>
      <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
        <div className="text-center text-xs text-slate-600 dark:text-slate-400 mb-2">We, the People of India, having solemnly resolved to constitute India into a…</div>
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {words.map((w, i) => (
            <button key={w.word} onClick={() => setActive(active === i ? null : i)}
              className="px-3 py-1.5 rounded-lg text-white text-sm font-bold transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: w.color }}>
              {w.word}
            </button>
          ))}
        </div>
        <div className="text-center text-xs text-slate-600 dark:text-slate-400">…REPUBLIC</div>
      </div>
      {active !== null && (
        <div className="rounded-xl p-4 border text-sm" style={{ borderColor: words[active].color, backgroundColor: words[active].color + "20" }}>
          <div className="font-bold mb-1" style={{ color: words[active].color }}>{words[active].word}</div>
          <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{words[active].desc}</p>
        </div>
      )}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <strong>Objectives declared in the Preamble:</strong> Justice (social, economic, political) · Liberty (thought, expression, belief, faith, worship) · Equality (status and opportunity) · Fraternity (dignity of individual + unity of nation)
      </div>
    </div>
  );
}

// ─── Federal Structure ────────────────────────────────────────────────────────
function FederalExplainer() {
  const lists = [
    {
      name: "Union List", art: "Art. 246(1)", items: ["Defence", "Foreign Affairs", "Banking", "Railway", "Income Tax", "Currency", "Atomic Energy"],
      color: "#D97706", desc: "Only Parliament can legislate. 97 subjects."
    },
    {
      name: "Concurrent List", art: "Art. 246(2)", items: ["Education", "Marriage", "Bankruptcy", "Forests", "Labour", "Criminal Law"],
      color: "#7C3AED", desc: "Both Parliament and State can legislate. In conflict, Central law prevails. 47 subjects."
    },
    {
      name: "State List", art: "Art. 246(3)", items: ["Police", "Agriculture", "Public Health", "Trade", "Local Govt"],
      color: "#059669", desc: "Only State Legislatures can legislate (normally). 66 subjects."
    },
  ];
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        {lists.map((list, i) => (
          <button key={list.name} onClick={() => setActive(active === i ? null : i)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${active === i ? "scale-105 shadow-md" : "hover:shadow-sm"}`}
            style={{ borderColor: list.color, backgroundColor: list.color + "15" }}>
            <div className="font-bold text-sm mb-1" style={{ color: list.color }}>{list.name}</div>
            <div className="text-[10px] opacity-70 mb-2">{list.art}</div>
            {list.items.map((item) => (
              <div key={item} className="text-xs text-slate-600 dark:text-slate-400 flex gap-1 items-center mb-0.5">
                <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: list.color }} />
                {item}
              </div>
            ))}
          </button>
        ))}
      </div>
      {active !== null && (
        <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: lists[active].color + "20", borderLeft: `4px solid ${lists[active].color}` }}>
          <div className="font-bold mb-1" style={{ color: lists[active].color }}>{lists[active].name}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400">{lists[active].desc}</p>
        </div>
      )}
      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-400">
        <strong>Residuary powers</strong> (anything not in any list): Vest with Parliament (Art. 248) — unlike USA where they go to states.
      </div>
    </div>
  );
}

// ─── Bill Flow ────────────────────────────────────────────────────────────────
function BillFlowExplainer() {
  const STAGES = [
    { label: "Draft Bill", by: "Ministry + Law Dept", color: "#6B7280" },
    { label: "Cabinet Approval", by: "Council of Ministers", color: "#D97706" },
    { label: "Introduction (1st Reading)", by: "Either House", color: "#2563EB" },
    { label: "Debate (2nd Reading)", by: "House Members", color: "#7C3AED" },
    { label: "Committee (optional)", by: "Standing Committee", color: "#059669" },
    { label: "Vote (3rd Reading)", by: "House Members", color: "#2563EB" },
    { label: "Other House", by: "Repeat process", color: "#7C3AED" },
    { label: "Presidential Assent", by: "President of India", color: "#D97706" },
    { label: "Act Published", by: "Official Gazette", color: "#059669" },
  ];
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="text-xs text-slate-500 text-center">Click each stage to learn more</div>
      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-1.5">
          {STAGES.map((stage, i) => (
            <button key={i} onClick={() => setActive(active === i ? null : i)}
              className={`relative flex items-center gap-3 w-full text-left pl-10 pr-4 py-2.5 rounded-lg transition-all ${active === i ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
              <div className="absolute left-2.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 z-10"
                style={{ backgroundColor: stage.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{stage.label}</div>
                <div className="text-[10px] text-slate-400">{stage.by}</div>
              </div>
              <div className="shrink-0 text-[10px] text-slate-400 font-mono">Step {i + 1}</div>
            </button>
          ))}
        </div>
      </div>
      {active !== null && (
        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 text-xs text-indigo-700 dark:text-indigo-400">
          <strong>Step {active + 1}: {STAGES[active].label}</strong> — By {STAGES[active].by}
        </div>
      )}
    </div>
  );
}

// ─── Court Hierarchy ──────────────────────────────────────────────────────────
function CourtHierarchyExplainer() {
  const courts = [
    { name: "Supreme Court", desc: "Final appellate court, original jurisdiction, constitutional interpretation. Art. 124.", color: "#D97706", w: "100%", count: "1" },
    { name: "High Courts", desc: "Highest court in each state. Original + appellate + writ jurisdiction. Art. 214.", color: "#DC2626", w: "75%", count: "25" },
    { name: "District Courts", desc: "Sessions Court (criminal), District Court (civil). Highest at district level.", color: "#7C3AED", w: "55%", count: "672+" },
    { name: "Sub-Divisional Courts", desc: "JMFC, CJM, Sub-Judge. Handles most criminal trials.", color: "#2563EB", w: "38%", count: "Thousands" },
    { name: "Tribunals & Lok Adalats", desc: "Specialized: NGT, NCLT, CAT, Income Tax Tribunal. Lok Adalats for settlement.", color: "#059669", w: "25%", count: "Many" },
  ];
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {courts.map((c, i) => (
        <div key={c.name} className="flex justify-center">
          <button onClick={() => setActive(active === i ? null : i)}
            className={`rounded-xl border-l-4 px-4 py-2.5 text-left transition-all hover:shadow-sm ${active === i ? "shadow-md scale-[1.02]" : ""}`}
            style={{ width: c.w, minWidth: 200, borderColor: c.color, backgroundColor: c.color + "15" }}>
            <div className="flex justify-between items-center">
              <div className="font-bold text-xs" style={{ color: c.color }}>{c.name}</div>
              <div className="text-[10px] font-mono" style={{ color: c.color }}>{c.count}</div>
            </div>
            {active === i && <div className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{c.desc}</div>}
          </button>
        </div>
      ))}
      <div className="text-[10px] text-slate-400 text-center mt-2">Click any level to see details</div>
    </div>
  );
}

// ─── Executive Structure ──────────────────────────────────────────────────────
function ExecutiveExplainer() {
  const nodes = [
    { id: "president", label: "President", sub: "Constitutional Head", color: "#D97706", article: "Art. 52-62" },
    { id: "pm", label: "Prime Minister", sub: "Real Executive", color: "#DC2626", article: "Art. 74-75" },
    { id: "cabinet", label: "Cabinet", sub: "Council of Ministers", color: "#7C3AED", article: "Art. 74" },
    { id: "ls", label: "Lok Sabha", sub: "Controls Cabinet", color: "#2563EB", article: "Art. 75(3)" },
  ];
  const [active, setActive] = useState<string | null>(null);
  const activeNode = nodes.find((n) => n.id === active);

  return (
    <div className="space-y-4">
      {/* SVG diagram */}
      <svg viewBox="0 0 320 260" className="w-full max-w-sm mx-auto">
        {/* President box */}
        <rect x="100" y="10" width="120" height="44" rx="8" fill={`${nodes[0].color}25`} stroke={nodes[0].color} strokeWidth="1.5"
          onClick={() => setActive(active === "president" ? null : "president")} className="cursor-pointer" />
        <text x="160" y="28" textAnchor="middle" fontSize="10" fontWeight="bold" fill={nodes[0].color}>{nodes[0].label}</text>
        <text x="160" y="44" textAnchor="middle" fontSize="8" fill="#64748b">{nodes[0].sub}</text>

        {/* Arrow down */}
        <line x1="160" y1="55" x2="160" y2="75" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="155,72 165,72 160,80" fill="#94a3b8" />
        <text x="165" y="68" fontSize="7" fill="#94a3b8">acts on advice of</text>

        {/* PM box */}
        <rect x="100" y="82" width="120" height="44" rx="8" fill={`${nodes[1].color}25`} stroke={nodes[1].color} strokeWidth="2"
          onClick={() => setActive(active === "pm" ? null : "pm")} className="cursor-pointer" />
        <text x="160" y="100" textAnchor="middle" fontSize="10" fontWeight="bold" fill={nodes[1].color}>{nodes[1].label}</text>
        <text x="160" y="116" textAnchor="middle" fontSize="8" fill="#64748b">{nodes[1].sub}</text>

        {/* PM → Cabinet */}
        <line x1="160" y1="127" x2="160" y2="147" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="155,144 165,144 160,152" fill="#94a3b8" />
        <text x="165" y="140" fontSize="7" fill="#94a3b8">heads</text>

        {/* Cabinet box */}
        <rect x="100" y="154" width="120" height="44" rx="8" fill={`${nodes[2].color}25`} stroke={nodes[2].color} strokeWidth="1.5"
          onClick={() => setActive(active === "cabinet" ? null : "cabinet")} className="cursor-pointer" />
        <text x="160" y="172" textAnchor="middle" fontSize="10" fontWeight="bold" fill={nodes[2].color}>{nodes[2].label}</text>
        <text x="160" y="188" textAnchor="middle" fontSize="8" fill="#64748b">{nodes[2].sub}</text>

        {/* Cabinet → Lok Sabha arrow (curved) */}
        <path d="M 220 176 Q 280 176 280 220 Q 280 250 220 250 Q 170 250 160 220" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="282" y="215" fontSize="7" fill="#94a3b8">responsible to</text>

        {/* Lok Sabha box */}
        <rect x="100" y="218" width="120" height="34" rx="8" fill={`${nodes[3].color}25`} stroke={nodes[3].color} strokeWidth="1.5"
          onClick={() => setActive(active === "ls" ? null : "ls")} className="cursor-pointer" />
        <text x="160" y="234" textAnchor="middle" fontSize="10" fontWeight="bold" fill={nodes[3].color}>{nodes[3].label}</text>
        <text x="160" y="246" textAnchor="middle" fontSize="8" fill="#64748b">{nodes[3].sub}</text>
      </svg>

      {activeNode && (
        <div className="rounded-xl p-4 border text-sm" style={{ borderColor: activeNode.color, backgroundColor: activeNode.color + "15" }}>
          <div className="font-bold" style={{ color: activeNode.color }}>{activeNode.label}</div>
          <div className="text-[10px] font-mono opacity-70">{activeNode.article}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {activeNode.id === "president" && "Constitutional head. Acts on Cabinet advice (Art. 74). Real power is ceremonial — appoints PM, summons Parliament, gives assent to bills."}
            {activeNode.id === "pm" && "Real executive power. Leader of Lok Sabha majority. Heads Cabinet. Sets policy agenda. PM is 'first among equals' in Cabinet."}
            {activeNode.id === "cabinet" && "Collective decision-making body. Collectively responsible to Lok Sabha. Cabinet decisions bind all ministers. If Cabinet falls, government falls."}
            {activeNode.id === "ls" && "Lok Sabha controls the executive through its power to pass/reject confidence motions. PM must always command majority here."}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── FPTP Explainer ───────────────────────────────────────────────────────────
function FPTPExplainer() {
  const candidates = [
    { name: "Party A", votes: 35000, color: "#D97706" },
    { name: "Party B", votes: 30000, color: "#DC2626" },
    { name: "Party C", votes: 20000, color: "#2563EB" },
    { name: "Party D", votes: 15000, color: "#059669" },
  ];
  const total = candidates.reduce((s, c) => s + c.votes, 0);

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
        <div className="font-bold text-purple-800 dark:text-purple-300 text-sm mb-2">Example: 4-candidate constituency</div>
        <div className="space-y-2">
          {candidates.map((c, i) => (
            <div key={c.name} className="flex items-center gap-3">
              <div className="w-14 text-xs font-medium" style={{ color: c.color }}>{c.name}</div>
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-5 overflow-hidden">
                <div className="h-full rounded-full flex items-center pl-2 text-white text-[10px] font-bold transition-all"
                  style={{ width: `${(c.votes / total) * 100}%`, backgroundColor: c.color }}>
                  {Math.round((c.votes / total) * 100)}%
                </div>
              </div>
              <div className="text-xs text-slate-500 w-16 text-right">{c.votes.toLocaleString()}</div>
              {i === 0 && <span className="text-[10px] font-bold text-emerald-600 w-10">WINS</span>}
              {i > 0 && <span className="text-[10px] text-slate-300 w-10">loses</span>}
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2">
          Party A wins with only 35% of votes — 65% voted against the winner. This is FPTP.
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3 border border-emerald-200 dark:border-emerald-800">
          <div className="font-bold text-emerald-700 dark:text-emerald-300 mb-1">FPTP Advantages</div>
          <ul className="text-slate-600 dark:text-slate-400 space-y-0.5">
            <li>• Simple to understand and vote</li>
            <li>• Direct constituency representation</li>
            <li>• Usually produces stable majority governments</li>
            <li>• Strong local MP-constituency link</li>
          </ul>
        </div>
        <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-3 border border-red-200 dark:border-red-800">
          <div className="font-bold text-red-700 dark:text-red-300 mb-1">FPTP Disadvantages</div>
          <ul className="text-slate-600 dark:text-slate-400 space-y-0.5">
            <li>• Many votes "wasted" (non-winners)</li>
            <li>• Minority can win large majorities</li>
            <li>• Small parties under-represented</li>
            <li>• Favors two-party consolidation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const EXPLAINER_MAP: Record<string, { title: string; component: React.FC }> = {
  "constitution-preamble": { title: "The Preamble — Interactive", component: PreambleExplainer },
  "federal-structure": { title: "7th Schedule — Three Lists", component: FederalExplainer },
  "bill-flow": { title: "Bill to Act — Step by Step", component: BillFlowExplainer },
  "court-hierarchy": { title: "Court Hierarchy in India", component: CourtHierarchyExplainer },
  "executive-structure": { title: "Who Really Governs India?", component: ExecutiveExplainer },
  "elections-fptp": { title: "How FPTP Works", component: FPTPExplainer },
};

const TOPIC_EXPLAINER_MAP: Record<string, ExplainerType> = {
  constitution: "constitution-preamble",
  federalism: "federal-structure",
  lawmaking: "bill-flow",
  judiciary: "court-hierarchy",
  executive: "executive-structure",
  elections: "elections-fptp",
};

export function VisualExplainer({ type: initialType, topicId }: VisualExplainerProps) {
  const defaultType = TOPIC_EXPLAINER_MAP[topicId] || initialType || "constitution-preamble";
  const [activeType, setActiveType] = useState<ExplainerType>(defaultType);
  const config = EXPLAINER_MAP[activeType];
  const ExplainerComponent = config.component;

  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(EXPLAINER_MAP).map(([key, val]) => (
          <button key={key} onClick={() => setActiveType(key as ExplainerType)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${activeType === key ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
            {val.title}
          </button>
        ))}
      </div>

      <div className="card p-5">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm mb-4">{config.title}</h3>
        <ExplainerComponent />
      </div>
    </div>
  );
}
