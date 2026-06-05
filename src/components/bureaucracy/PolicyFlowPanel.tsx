"use client";

import { useState } from "react";
import { POLICY_FLOW_STEPS } from "@/data/bureaucracy/intelligence";

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
  step: typeof POLICY_FLOW_STEPS[0];
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
