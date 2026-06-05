"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3";
import {
  INDIA_STATES, PROJ_W, PROJ_H, PROJ_CENTER, PROJ_SCALE, PROJ_TRANSLATE,
  type StateAtlasData,
} from "@/data/atlas/india";

// ── D3 Projection (module-level math only, no DOM) ──────────────────────────
const projection = d3.geoMercator()
  .center(PROJ_CENTER)
  .scale(PROJ_SCALE)
  .translate(PROJ_TRANSLATE);

// ── Color Scales ─────────────────────────────────────────────────────────────
const ndaScale     = d3.scaleSequential([0, 1],   d3.interpolateOranges);
const indiaScale   = d3.scaleSequential([0, 1],   d3.interpolateBlues);
const turnoutScale = d3.scaleSequential([50, 85], d3.interpolateGreens);
const popScale     = d3.scaleSequential([0.1, 200], d3.interpolatePurples);
const seatsScale   = d3.scaleSequential([1, 80],  d3.interpolateReds);
const rScale       = d3.scaleSqrt().domain([1, 80]).range([7, 32]);

export type AtlasLayer = "election" | "turnout" | "population" | "seats";

function getColor(s: StateAtlasData, layer: AtlasLayer): string {
  switch (layer) {
    case "election": {
      if (s.alliance === "NDA")   return ndaScale(Math.max(0.3, s.ndaSeats / s.seats));
      if (s.alliance === "INDIA") return indiaScale(Math.max(0.3, s.indiaSeats / s.seats));
      return "#94A3B8";
    }
    case "turnout":    return turnoutScale(s.turnout);
    case "population": return popScale(s.population);
    case "seats":      return seatsScale(s.seats);
  }
}

const LAYERS: { id: AtlasLayer; label: string; desc: string }[] = [
  { id: "election",   label: "2024 Results",  desc: "Alliance outcome by NDA/INDIA seat fraction" },
  { id: "turnout",    label: "Voter Turnout",  desc: "Voter turnout % in 2024 Lok Sabha election" },
  { id: "population", label: "Population",     desc: "State population in millions (Census 2021)" },
  { id: "seats",      label: "LS Seats",       desc: "Number of Lok Sabha constituencies" },
];

const LAYER_LEGEND: Record<AtlasLayer, { lo: string; hi: string; loLabel: string; hiLabel: string }> = {
  election:   { lo: "#FFF7ED", hi: "#C2410C", loLabel: "Opposition",    hiLabel: "NDA sweep" },
  turnout:    { lo: "#ECFDF5", hi: "#065F46", loLabel: "50% turnout",   hiLabel: "85% turnout" },
  population: { lo: "#F5F3FF", hi: "#4C1D95", loLabel: "Low pop.",      hiLabel: "200M+" },
  seats:      { lo: "#FFF1F2", hi: "#9F1239", loLabel: "1 seat",        hiLabel: "80 seats" },
};

interface Tooltip {
  state: StateAtlasData;
  clientX: number;
  clientY: number;
}

export function GovernanceAtlas() {
  const [layer, setLayer]     = useState<AtlasLayer>("election");
  const [selected, setSelected] = useState<StateAtlasData | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [search, setSearch]   = useState("");
  const svgRef                = useRef<SVGSVGElement>(null);

  // Project each state centroid to SVG coordinates
  const projected = useMemo(() => {
    return INDIA_STATES.map((s) => {
      const pt = projection([s.lng, s.lat]) ?? [0, 0];
      return {
        state: s,
        x: pt[0],
        y: pt[1],
        r: rScale(s.seats),
        fill: getColor(s, layer),
      };
    });
  }, [layer]);

  const visible = useMemo(() => {
    if (!search.trim()) return projected;
    const q = search.toLowerCase();
    return projected.filter((p) => p.state.state.toLowerCase().includes(q) || p.state.code.toLowerCase().includes(q));
  }, [projected, search]);

  const legend = LAYER_LEGEND[layer];

  return (
    <div className="space-y-4">
      {/* Layer selector */}
      <div className="flex flex-wrap gap-2">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLayer(l.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              layer === l.id
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {l.label}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search state…"
          className="ml-auto px-3 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Search states"
        />
      </div>

      <div className="flex gap-4 items-start flex-col lg:flex-row">
        {/* Map */}
        <div className="relative flex-1 card overflow-hidden p-0 bg-slate-50 dark:bg-slate-900">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${PROJ_W} ${PROJ_H}`}
            className="w-full"
            role="img"
            aria-label="India governance atlas — bubble map of states"
          >
            {/* Subtle grid */}
            <defs>
              <pattern id="atlas-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.5" opacity="0.5" />
              </pattern>
            </defs>
            <rect width={PROJ_W} height={PROJ_H} fill="url(#atlas-grid)" />

            {/* State bubbles */}
            {projected.map(({ state, x, y, r, fill }) => {
              const isHighlighted = !search || visible.some((v) => v.state.code === state.code);
              const isSelected    = selected?.code === state.code;
              return (
                <motion.g
                  key={state.code}
                  role="button"
                  aria-label={`${state.state}: ${state.seats} LS seats, ${state.alliance} won, ${state.turnout}% turnout`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelected(state);
                  }}
                  onClick={() => setSelected(selected?.code === state.code ? null : state)}
                  onMouseEnter={(e) => setTooltip({ state, clientX: e.clientX, clientY: e.clientY })}
                  onMouseMove={(e) => setTooltip({ state, clientX: e.clientX, clientY: e.clientY })}
                  onMouseLeave={() => setTooltip(null)}
                  style={{ cursor: "pointer" }}
                >
                  <motion.circle
                    cx={x}
                    cy={y}
                    initial={{ r: 0, opacity: 0 }}
                    animate={{
                      r: isHighlighted ? r : r * 0.4,
                      opacity: isHighlighted ? (isSelected ? 1 : 0.82) : 0.2,
                      fill,
                      stroke: isSelected ? "#1E293B" : "white",
                      strokeWidth: isSelected ? 2.5 : 1,
                    }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                  />
                  {r > 18 && (
                    <motion.text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={Math.min(r * 0.38, 10)}
                      fill="white"
                      fontWeight="700"
                      style={{ pointerEvents: "none", userSelect: "none" }}
                      animate={{ opacity: isHighlighted ? 0.9 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {state.code}
                    </motion.text>
                  )}
                </motion.g>
              );
            })}
          </svg>

          {/* Legend strip */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="text-[10px] text-slate-500">{legend.loLabel}</span>
            <div
              className="w-24 h-2 rounded-full"
              style={{ background: `linear-gradient(to right, ${legend.lo}, ${legend.hi})` }}
            />
            <span className="text-[10px] text-slate-500">{legend.hiLabel}</span>
          </div>

          {/* Alliance legend for election layer */}
          {layer === "election" && (
            <div className="absolute bottom-3 right-3 flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
                <span className="text-slate-600 dark:text-slate-400">NDA</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                <span className="text-slate-600 dark:text-slate-400">INDIA</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />
                <span className="text-slate-600 dark:text-slate-400">Other</span>
              </span>
            </div>
          )}

          {/* Bubble size legend */}
          <div className="absolute top-3 right-3 text-[10px] text-slate-400 bg-white/80 dark:bg-slate-900/80 rounded-lg px-2 py-1 backdrop-blur-sm">
            Bubble size = LS seats
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.code}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.25 }}
              className="lg:w-72 card p-5 space-y-4 shrink-0"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                    {selected.state}
                  </h3>
                  <p className="text-xs text-slate-500">{selected.capital} · {selected.region}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 p-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Alliance badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold"
                style={{ background: selected.dominantColor + "20", color: selected.dominantColor }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: selected.dominantColor }} />
                {selected.alliance} — {selected.dominant} dominant
              </div>

              {/* Seat breakdown bar */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>NDA {selected.ndaSeats}</span>
                  <span>Total {selected.seats}</span>
                  <span>INDIA {selected.indiaSeats}</span>
                </div>
                <div className="flex h-4 rounded-full overflow-hidden">
                  {selected.ndaSeats > 0 && (
                    <div className="bg-orange-400 h-full" style={{ width: `${(selected.ndaSeats / selected.seats) * 100}%` }} />
                  )}
                  {selected.indiaSeats > 0 && (
                    <div className="bg-blue-500 h-full" style={{ width: `${(selected.indiaSeats / selected.seats) * 100}%` }} />
                  )}
                  {selected.otherSeats > 0 && (
                    <div className="bg-slate-400 h-full" style={{ width: `${(selected.otherSeats / selected.seats) * 100}%` }} />
                  )}
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "LS Seats",   value: selected.seats },
                  { label: "Turnout",    value: `${selected.turnout}%` },
                  { label: "Population", value: `${selected.population}M` },
                  { label: "Area",       value: `${(selected.area / 1000).toFixed(0)}k km²` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2 text-center">
                    <div className="text-base font-bold font-display text-slate-900 dark:text-slate-100">{value}</div>
                    <div className="text-[10px] text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="fixed z-50 pointer-events-none rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-900 p-3 text-xs"
            style={{ left: tooltip.clientX + 14, top: tooltip.clientY - 60 }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <div className="font-bold text-slate-900 dark:text-slate-100">{tooltip.state.state}</div>
            <div className="text-slate-500 mt-0.5">{tooltip.state.seats} seats · {tooltip.state.turnout}% turnout</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full" style={{ background: tooltip.state.dominantColor }} />
              <span className="font-medium" style={{ color: tooltip.state.dominantColor }}>
                {tooltip.state.dominant} ({tooltip.state.dominantSeats} seats)
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
