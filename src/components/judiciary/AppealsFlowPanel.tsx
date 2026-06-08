"use client";

import { useState } from "react";
interface AppealsRoute {
  id: string;
  name: string;
  color: string;
  icon: string;
  basis: string;
  stages: { court: string; basis: string }[];
}

const APPEALS_ROUTES: AppealsRoute[] = [
  {
    id: "criminal",
    name: "Criminal Appeals",
    color: "#DC2626",
    icon: "⚔️",
    basis: "CrPC, 1973",
    stages: [
      { court: "Magistrate Court", basis: "CrPC — trial of offences up to 3 yrs" },
      { court: "Sessions Court", basis: "CrPC — appeal from Magistrate (s.374)" },
      { court: "High Court", basis: "Art. 215 / CrPC — appeal + revision" },
      { court: "Supreme Court", basis: "Art. 134 / Art. 136 (SLP)" },
    ],
  },
  {
    id: "civil",
    name: "Civil Appeals",
    color: "#1565C0",
    icon: "📄",
    basis: "Code of Civil Procedure, 1908",
    stages: [
      { court: "Trial Court (Civil Judge)", basis: "CPC — original civil jurisdiction" },
      { court: "District Court", basis: "CPC — first appeal from original decree" },
      { court: "High Court", basis: "CPC s.100 — second appeal on question of law" },
      { court: "Supreme Court", basis: "Art. 133 / Art. 136 (SLP)" },
    ],
  },
  {
    id: "constitutional",
    name: "Constitutional Writs",
    color: "#7C3AED",
    icon: "📜",
    basis: "Art. 226 / Art. 32",
    stages: [
      { court: "High Court (Art. 226)", basis: "Writ jurisdiction — any violation of law" },
      { court: "Supreme Court (Art. 32)", basis: "FRs only — itself a Fundamental Right" },
      { court: "SLP / Appeal (Art. 136)", basis: "From HC to SC — discretionary" },
      { court: "Review Petition (Art. 137)", basis: "SC reviews its own order" },
    ],
  },
  {
    id: "service",
    name: "Service Matters",
    color: "#047857",
    icon: "🏛️",
    basis: "Administrative Tribunals Act, 1985",
    stages: [
      { court: "Department / Disciplinary Authority", basis: "Service rules — initial order" },
      { court: "Central Administrative Tribunal (CAT)", basis: "Art. 323A — exclusive jurisdiction" },
      { court: "High Court (Division Bench)", basis: "Art. 226/227 — review of CAT orders" },
      { court: "Supreme Court", basis: "Art. 136 (SLP) — constitutional questions" },
    ],
  },
];

// SVG dimensions
const CARD_W = 150;
const CARD_H = 52;
const COL_GAP = 40;
const ROW_GAP = 36;
const PAD_X = 20;
const PAD_Y = 20;

function routeX(colIdx: number): number {
  return PAD_X + colIdx * (CARD_W + COL_GAP);
}

function stageY(rowIdx: number): number {
  return PAD_Y + rowIdx * (CARD_H + ROW_GAP);
}

const TOTAL_W = PAD_X * 2 + 4 * CARD_W + 3 * COL_GAP;
const TOTAL_H = PAD_Y * 2 + 4 * CARD_H + 3 * ROW_GAP;

function ArrowDown({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <line x1={x + CARD_W / 2} y1={y} x2={x + CARD_W / 2} y2={y + ROW_GAP - 8} stroke={color} strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
      <polygon
        points={`${x + CARD_W / 2 - 5},${y + ROW_GAP - 10} ${x + CARD_W / 2 + 5},${y + ROW_GAP - 10} ${x + CARD_W / 2},${y + ROW_GAP - 2}`}
        fill={color} opacity="0.7"
      />
    </g>
  );
}

function RouteCard({ route, stage, colIdx, rowIdx }: {
  route: AppealsRoute;
  stage: AppealsRoute["stages"][0];
  colIdx: number;
  rowIdx: number;
}) {
  const x = routeX(colIdx);
  const y = stageY(rowIdx);
  const isTop = rowIdx === 0;
  return (
    <g>
      <rect
        x={x} y={y} width={CARD_W} height={CARD_H}
        rx="6" ry="6"
        fill={isTop ? route.color : "white"}
        stroke={route.color}
        strokeWidth={isTop ? 0 : 1.5}
        opacity={isTop ? 1 : 0.9}
      />
      {/* Left accent bar */}
      {!isTop && <rect x={x} y={y} width="4" height={CARD_H} rx="3" fill={route.color} opacity="0.7" />}
      {/* Court name */}
      <text
        x={isTop ? x + CARD_W / 2 : x + CARD_W / 2 + 2}
        y={y + CARD_H / 2 - 5}
        textAnchor="middle"
        fontSize="9"
        fontWeight="bold"
        fill={isTop ? "white" : "#1e293b"}
        className="dark:fill-slate-100"
      >
        {stage.court.split(" ").slice(0, 3).join(" ")}
      </text>
      {stage.court.split(" ").length > 3 && (
        <text
          x={isTop ? x + CARD_W / 2 : x + CARD_W / 2 + 2}
          y={y + CARD_H / 2 + 5}
          textAnchor="middle"
          fontSize="9"
          fontWeight="bold"
          fill={isTop ? "white" : "#1e293b"}
          className="dark:fill-slate-100"
        >
          {stage.court.split(" ").slice(3).join(" ")}
        </text>
      )}
      <text
        x={isTop ? x + CARD_W / 2 : x + CARD_W / 2 + 2}
        y={y + CARD_H - 8}
        textAnchor="middle"
        fontSize="7"
        fill={isTop ? "rgba(255,255,255,0.8)" : "#64748b"}
      >
        {stage.basis.split("—")[0].trim().slice(0, 28)}
      </text>
    </g>
  );
}

export function AppealsFlowPanel() {
  const [activeRoute, setActiveRoute] = useState<string | null>(null);

  const activeData = activeRoute ? APPEALS_ROUTES.find((r) => r.id === activeRoute) : null;

  return (
    <div className="space-y-6">
      {/* Legend / route selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {APPEALS_ROUTES.map((route) => (
          <button
            key={route.id}
            onClick={() => setActiveRoute(activeRoute === route.id ? null : route.id)}
            className={`card p-4 text-left transition-all hover:shadow-md ${
              activeRoute === route.id ? "ring-2" : "hover:ring-1"
            }`}
            style={{
              ["--tw-ring-color" as string]: route.color,
              borderLeftColor: route.color,
              borderLeftWidth: "4px",
            }}
          >
            <div className="text-xl mb-1">{route.icon}</div>
            <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{route.name}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{route.basis}</div>
          </button>
        ))}
      </div>

      {/* SVG diagram — all 4 routes together */}
      <div className="card p-4 overflow-x-auto">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">Appeals Flow Diagram</h3>
        <svg viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`} className="w-full max-w-4xl mx-auto" style={{ minWidth: 600 }}>
          {/* Column headers */}
          {APPEALS_ROUTES.map((route, colIdx) => (
            <g key={route.id}>
              <rect x={routeX(colIdx)} y={0} width={CARD_W} height={18} rx="4" fill={route.color} />
              <text x={routeX(colIdx) + CARD_W / 2} y={12} textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">
                {route.icon} {route.name}
              </text>
            </g>
          ))}

          {/* Cards and arrows */}
          {APPEALS_ROUTES.map((route, colIdx) =>
            route.stages.map((stage, rowIdx) => (
              <g key={`${route.id}-${rowIdx}`}>
                <RouteCard route={route} stage={stage} colIdx={colIdx} rowIdx={rowIdx} />
                {rowIdx < route.stages.length - 1 && (
                  <ArrowDown
                    x={routeX(colIdx)}
                    y={stageY(rowIdx) + CARD_H}
                    color={route.color}
                  />
                )}
              </g>
            ))
          )}
        </svg>

        {/* Mobile note */}
        <p className="text-[10px] text-slate-400 text-center mt-2">Scroll horizontally on small screens. Arrows show direction of appeal (lower → higher court).</p>
      </div>

      {/* Active route detail */}
      {activeData && (
        <div className="card p-6 border-l-4" style={{ borderLeftColor: activeData.color }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{activeData.icon}</span>
            <div>
              <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">{activeData.name}</h3>
              <div className="text-xs text-slate-400">{activeData.basis}</div>
            </div>
          </div>
          <div className="space-y-3">
            {activeData.stages.map((stage, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: activeData.color }}>
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{stage.court}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stage.basis}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
          <div className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">Art. 136 — SLP</div>
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Any person can petition the Supreme Court via Special Leave Petition against any court/tribunal order.
            The SC may refuse without reasons. Over 40,000 SLPs filed annually — the SC's most exercised jurisdiction.
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-xl p-4">
          <div className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-1">Art. 226 vs Art. 32</div>
          <p className="text-xs text-purple-700 dark:text-purple-400">
            High Courts under Art. 226 can issue writs for fundamental rights AND for any other purpose
            (broader). The SC under Art. 32 is limited to fundamental rights enforcement, but this itself is a
            Fundamental Right and cannot be suspended except under Art. 359 (now restricted by 44th Amendment).
          </p>
        </div>
      </div>
    </div>
  );
}
