"use client";

import { useState } from "react";
interface PolicyFlowStep { level: number; title: string; body: string; actors: string[]; instrument: string; duration: string; color: string; bg: string; detail: string; examples: string[] }

const POLICY_FLOW_STEPS: PolicyFlowStep[] = [
  { level: 1, title: "Prime Minister's Office (PMO)",                           body: "Policy mandate is set through PM's vision, election manifesto commitments, or national emergency. The PMO acts as the command centre — the Principal Secretary to PM coordinates with Ministries.",                                                                                                                                                                                     actors: ["Prime Minister", "Principal Secretary to PM", "NSA (security)", "PMO Joint Secretaries"],                                                                                    instrument: "Policy Note / Cabinet Note / PM's directive",    duration: "Days to weeks",                            color: "text-amber-700 dark:text-amber-300",  bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800",   detail: "The PMO is the apex of the executive branch. It does not administer programmes directly but sets direction and monitors implementation. All Cabinet notes are processed through the PMO. The Principal Secretary to PM is the critical link between elected PM and the bureaucratic machinery.",                                                                                                                                                                                                                                                                       examples: ["PM announces ₹20 lakh crore COVID relief package", "National Education Policy 2020 directive", "Jan Dhan Yojana announcement"] },
  { level: 2, title: "Union Cabinet & Cabinet Secretariat",                     body: "Major policy decisions must be approved by the Cabinet (Council of Ministers). The Cabinet Secretariat, headed by the Cabinet Secretary, orchestrates this and ensures inter-ministerial coordination.",                                                                                                                                                                                   actors: ["Cabinet Secretary", "Union Ministers", "Cabinet Committees (CCEA, CCS, etc.)", "Secretaries to Cabinet committees"],                                                          instrument: "Cabinet Resolution / Cabinet Committee Decision", duration: "Weeks to months",                          color: "text-red-700 dark:text-red-300",      bg: "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800",           detail: "The Cabinet is the apex decision-making body. Cabinet Committees (CCEA for economic, CCS for security) handle routine decisions. The Cabinet Secretary — the most senior IAS officer — ensures that Cabinet decisions are recorded, communicated, and implemented. He chairs Secretaries' Committee meetings that coordinate between ministries.",                                                                                                                                                                                                                                                                                                           examples: ["Cabinet approves PM Awas Yojana (housing for all)", "CCEA approves MSP for Kharif crops", "CCS decides on defence procurement"] },
  { level: 3, title: "Ministry / Department Secretary",                         body: "Once Cabinet approves, the nodal Ministry translates the decision into an administrative programme. The Secretary drafts guidelines, allocates funds through the budget, and coordinates with states.",                                                                                                                                                                                    actors: ["Secretary to Government of India", "Additional Secretary / Joint Secretary", "Directors / Deputy Secretaries", "Under Secretaries"],                                           instrument: "Scheme Guidelines / Office Memorandum / Sanction Order", duration: "1–6 months",                        color: "text-blue-700 dark:text-blue-300",    bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800",       detail: "This is where policy becomes a 'scheme' with a name, budget allocation, eligible beneficiaries, and implementation guidelines. The Ministry issues Detailed Guidelines or Implementation Guidelines to state governments. Financial resources are routed either directly (CSS — Centrally Sponsored Schemes) or via Finance Commission devolution.",                                                                                                                                                                                                                                                                                                         examples: ["MGNREGS operational guidelines issued by MoRD", "PMJAY scheme details issued by MoHFW", "Pradhan Mantri Gram Sadak Yojana guidelines"] },
  { level: 4, title: "State Government (Chief Secretary / State Ministry)",     body: "In India's federal structure, most implementation happens through state governments. The Chief Secretary coordinates. The State Ministry may adapt the central scheme within parameters and sometimes add state funds (flexi-pool).",                                                                                                                                                        actors: ["Chief Minister", "Chief Secretary", "State Ministry Secretaries", "State Finance Department"],                                                                                instrument: "Government Order (GO) / State Gazette Notification / Scheme Adaptation", duration: "1–3 months after central guidelines", color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800", detail: "States may issue their own Government Orders adapting the central scheme to local needs (e.g. additional beneficiary categories, higher compensation). State budgets must match central funds (typically 60:40 for general states, 90:10 for special category states). Some states add their own top-ups.",                                                                                                                                                                                                                                                                                                                                                     examples: ["Rajasthan adds its own 'Indira Gandhi Urban Employment Guarantee' on top of MGNREGS", "Kerala's own health insurance supplements Ayushman Bharat"] },
  { level: 5, title: "Divisional Commissioner",                                 body: "The Commissioner oversees 3–6 districts. They monitor implementation, resolve inter-district issues, hear appeals from Collector orders, and report to the state government on progress.",                                                                                                                                                                                                 actors: ["Divisional Commissioner (IAS)", "Joint Commissioner", "Divisional-level department heads"],                                                                                   instrument: "Divisional Orders / Review Meetings / Inspection Reports",               duration: "Ongoing monitoring",                       color: "text-indigo-700 dark:text-indigo-300",bg: "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800", detail: "The Commissioner is the first-tier review authority for most Collector actions. They chair Division-level review meetings, conduct surprise inspections, and submit monthly progress reports to the State Secretariat. The Commissioner is also the appellate authority for revenue disputes from district level.",                                                                                                                                                                                                                                                                                                                                                     examples: ["Commissioner chairs monthly MGNREGS review for 5 districts", "Hears appeal against Collector's land acquisition order"] },
  { level: 6, title: "District Collector / District Magistrate",               body: "The Collector is India's most powerful field officer. They translate programme guidelines into district-level plans, coordinate all department heads, and are accountable for outcomes. The 'face of government' for citizens.",                                                                                                                                                            actors: ["District Collector / DC / DM", "Additional Collectors", "District-level department heads (SP, CMO, DEO)", "District Planning Committee"],                                     instrument: "District Action Plan / Collector's order / DPC resolution",              duration: "Ongoing; monthly reporting",                color: "text-emerald-700 dark:text-emerald-300",bg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800", detail: "A typical district has 1–5 million people. The Collector chairs weekly/monthly meetings of all department heads. They prepare the District Action Plan (DAP) for each scheme, allocate block-level targets, and monitor the District Management Information System (DMIS). They are directly accountable to the Commissioner and state government for their district's performance on health, education, poverty, infrastructure, and law & order indicators.", examples: ["Collector chairs DISHA meeting", "District Annual Plan prepared and submitted", "Collector visits blocks to review PMAY housing construction"] },
  { level: 7, title: "Block Development Officer (BDO) / Tehsildar",            body: "Block is the critical 'last administrative mile'. The BDO manages development schemes. The Tehsildar manages revenue. Together they are the primary interface between government and village-level institutions.",                                                                                                                                                                          actors: ["Block Development Officer (BDO)", "Tehsildar / Tahasildar", "Gram Panchayat Officers", "Agriculture / Health Extension Workers"],                                              instrument: "Block Action Plan / Revenue Records / Panchayat Resolutions",            duration: "Weekly execution",                          color: "text-teal-700 dark:text-teal-300",    bg: "bg-teal-50 dark:bg-teal-950/20 border-teal-300 dark:border-teal-800",       detail: "A block has 50–100 villages and a population of 50,000–3,00,000. The BDO manages all development schemes (MGNREGS job cards, PMAY housing, health infrastructure). The Tehsildar manages land records, crop loans, and revenue collections. Both report to the SDM (Sub-Divisional Magistrate) who reports to the Collector. Block-level officers interact directly with Gram Panchayats.",                                                                                                                                                                                                                                                                  examples: ["BDO reviews MGNREGS muster rolls for 60 panchayats", "Tehsildar updates land mutation records", "BDO disburses PMAY installments to beneficiaries"] },
  { level: 8, title: "Gram Panchayat & Village Level Workers",                 body: "The constitutional local self-government (73rd Amendment). Elected Gram Panchayat implements schemes, maintains records, and channels citizen demands upward. Village Level Workers (VLW/Aaganwadi/ASHAs) are the final delivery point.",                                                                                                                                                   actors: ["Gram Pradhan / Sarpanch (elected)", "Gram Panchayat Secretary", "Aaganwadi Worker (ICDS)", "ASHA Worker (Health)", "Agriculture Extension Worker / VLW"],                     instrument: "Panchayat Resolutions / Village Action Plans / Job Cards",               duration: "Daily service delivery",                    color: "text-rose-700 dark:text-rose-300",    bg: "bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800",       detail: "At the bottom of the pyramid are ~2.5 lakh Gram Panchayats covering ~6 lakh villages. The Gram Panchayat Secretary (a state government employee) is the critical link — they maintain job cards, beneficiary lists, and scheme records. VLWs (Village Level Workers) in agriculture, Aaganwadi workers in nutrition/early childhood, and ASHAs in health are the actual 'last mile' delivery agents. The 15th Finance Commission provided ₹2.36 lakh crore directly to local bodies (2021–26).",                                                                                                                                                                   examples: ["ASHA worker identifies PMAY-eligible families in village", "Aaganwadi distributes Poshan Abhiyaan nutritional supplements", "Gram Sabha passes resolution for road construction under MGNREGS"] },
];

// ─── SVG flow diagram dimensions ─────────────────────────────────────────────
const SVG_W = 320;
const NODE_H = 44;
const NODE_GAP = 20;
const PAD = 16;
const TOTAL_H = PAD + POLICY_FLOW_STEPS.length * (NODE_H + NODE_GAP) - NODE_GAP + PAD;

const LEVEL_COLORS = [
  "#B45309", "#DC2626", "#1565C0", "#7C3AED",
  "#4338CA", "#047857", "#0E7490", "#BE185D",
];

function FlowNode({ step, isActive, onClick }: {
  step: PolicyFlowStep;
  isActive: boolean;
  onClick: () => void;
}) {
  const y = PAD + (step.level - 1) * (NODE_H + NODE_GAP);
  const color = LEVEL_COLORS[step.level - 1];
  return (
    <g onClick={onClick} className="cursor-pointer">
      {/* Connector line */}
      {step.level > 1 && (
        <g>
          <line
            x1={SVG_W / 2} y1={y - NODE_GAP}
            x2={SVG_W / 2} y2={y - 6}
            stroke={color} strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5"
          />
          <polygon
            points={`${SVG_W / 2 - 5},${y - 8} ${SVG_W / 2 + 5},${y - 8} ${SVG_W / 2},${y - 1}`}
            fill={color} opacity="0.6"
          />
        </g>
      )}
      {/* Main rect */}
      <rect
        x={PAD} y={y} width={SVG_W - PAD * 2} height={NODE_H}
        rx="6" fill={isActive ? color : "white"}
        stroke={color} strokeWidth={isActive ? 0 : 1.5}
        opacity={isActive ? 1 : 0.95}
        className="dark:fill-slate-800"
      />
      {/* Level badge */}
      <rect x={PAD} y={y} width="28" height={NODE_H} rx="6" fill={color} />
      <text x={PAD + 14} y={y + NODE_H / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">
        {step.level}
      </text>
      {/* Title */}
      <text
        x={PAD + 36} y={y + NODE_H / 2 - 4}
        fontSize="9.5" fontWeight="bold"
        fill={isActive ? "white" : "#1e293b"}
        className="dark:fill-slate-100"
      >
        {step.title.length > 30 ? step.title.slice(0, 30) + "…" : step.title}
      </text>
      <text
        x={PAD + 36} y={y + NODE_H / 2 + 8}
        fontSize="8"
        fill={isActive ? "rgba(255,255,255,0.8)" : "#64748b"}
      >
        {step.actors[0]}
      </text>
    </g>
  );
}

export function PolicyFlowPanel() {
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const active = POLICY_FLOW_STEPS.find((s) => s.level === activeLevel)!;
  const color = LEVEL_COLORS[activeLevel - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
        <h3 className="font-bold text-amber-900 dark:text-amber-300 text-sm mb-1">How Policy Travels from PM to Citizen</h3>
        <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
          Click any level in the flow diagram to explore what happens there, who is responsible, and what administrative instruments are used.
          India has an 8-tier policy delivery chain — often spanning 12–36 months from PM announcement to citizen benefit.
        </p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        {/* SVG flow */}
        <div className="card p-2 overflow-x-auto">
          <svg viewBox={`0 0 ${SVG_W} ${TOTAL_H}`} className="w-full" style={{ minWidth: 260, maxWidth: 360 }}>
            {POLICY_FLOW_STEPS.map((step) => (
              <FlowNode
                key={step.level}
                step={step}
                isActive={step.level === activeLevel}
                onClick={() => setActiveLevel(step.level)}
              />
            ))}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="space-y-4">
          <div className={`card p-6 border-l-4 transition-all`} style={{ borderColor: color }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md" style={{ backgroundColor: color }}>
                {activeLevel}
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">{active.title}</h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5">{active.instrument}</div>
              </div>
              <div className="ml-auto">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">⏱ {active.duration}</span>
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{active.detail}</p>

            {/* Actors */}
            <div className="mt-4">
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Key Actors</div>
              <div className="flex flex-wrap gap-1.5">
                {active.actors.map((actor) => (
                  <span key={actor} className="px-2 py-0.5 text-xs rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800">
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Examples */}
            <div className="mt-4">
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Real-world examples</div>
              <ul className="space-y-1">
                {active.examples.map((ex) => (
                  <li key={ex} className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 mt-0.5" style={{ color }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveLevel((l) => Math.max(1, l - 1))}
              disabled={activeLevel === 1}
              className="flex-1 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
            >
              ← Previous level
            </button>
            <button
              onClick={() => setActiveLevel((l) => Math.min(POLICY_FLOW_STEPS.length, l + 1))}
              disabled={activeLevel === POLICY_FLOW_STEPS.length}
              className="flex-1 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
            >
              Next level →
            </button>
          </div>

          {/* Timeline stat */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">Typical end-to-end timeline</div>
            <div className="flex items-end gap-1 h-8">
              {POLICY_FLOW_STEPS.map((s, i) => {
                const heights = [10, 14, 20, 24, 18, 28, 22, 32];
                return (
                  <div
                    key={s.level}
                    className="flex-1 rounded-sm transition-opacity cursor-pointer"
                    style={{
                      height: heights[i],
                      backgroundColor: LEVEL_COLORS[i],
                      opacity: s.level === activeLevel ? 1 : 0.35,
                    }}
                    onClick={() => setActiveLevel(s.level)}
                    title={s.title}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
              <span>PMO</span>
              <span>Ministry</span>
              <span>State Govt</span>
              <span>District</span>
              <span>Block</span>
              <span>Village</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">PM Awas Yojana: announced 2015 → beneficiaries receiving houses by 2016–2020 (varies by state)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
