"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3";
import {
  INDIA_STATES, PROJ_W, PROJ_H, PROJ_CENTER, PROJ_SCALE, PROJ_TRANSLATE,
  type StateAtlasData,
} from "@/data/atlas/india";

const projection = d3.geoMercator()
  .center(PROJ_CENTER)
  .scale(PROJ_SCALE)
  .translate(PROJ_TRANSLATE);

const rScale = d3.scaleSqrt().domain([1, 80]).range([7, 32]);

// NDA fraction → warm orange; INDIA fraction → cool blue
// Diverging: pure orange at NDA=1, pure blue at INDIA=1, mid-grey at 0.5
const NDA_SCALE   = d3.scaleSequential([0.5, 1], d3.interpolateOranges);
const INDIA_SCALE = d3.scaleSequential([0.5, 1], d3.interpolateBlues);

function heatColor(s: StateAtlasData, metric: HeatMetric): string {
  switch (metric) {
    case "swing": {
      const ndaFrac = s.ndaSeats / s.seats;
      if (ndaFrac >= 0.5) return NDA_SCALE(ndaFrac);
      const indiaFrac = s.indiaSeats / s.seats;
      if (indiaFrac >= 0.5) return INDIA_SCALE(indiaFrac);
      return "#94A3B8";
    }
    case "turnout": {
      const t = d3.scaleQuantize<string>()
        .domain([50, 85])
        .range(["#FEF3C7", "#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B", "#D97706", "#B45309", "#92400E"]);
      return t(s.turnout);
    }
    case "margin": {
      const margin = (s.dominantSeats / s.seats) * 100;
      const scale = d3.scaleSequential([30, 100], d3.interpolateRdPu);
      return scale(margin);
    }
  }
}

type HeatMetric = "swing" | "turnout" | "margin";

const METRICS: { id: HeatMetric; label: string; desc: string }[] = [
  { id: "swing",   label: "Alliance Swing",  desc: "NDA (orange) vs INDIA (blue) seat fraction" },
  { id: "turnout", label: "Voter Turnout",   desc: "Turnout % — darker = higher participation" },
  { id: "margin",  label: "Dominant Margin", desc: "Winning alliance seat dominance %" },
];

interface Tooltip { state: StateAtlasData; clientX: number; clientY: number }

export function ElectionHeatmap() {
  const [metric, setMetric]   = useState<HeatMetric>("swing");
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [selected, setSelected] = useState<StateAtlasData | null>(null);

  const bubbles = useMemo(() => {
    return INDIA_STATES.map((s) => {
      const pt = projection([s.lng, s.lat]) ?? [0, 0];
      return {
        state: s,
        x: pt[0],
        y: pt[1],
        r: rScale(s.seats),
        fill: heatColor(s, metric),
      };
    });
  }, [metric]);

  return (
    <div className="space-y-4">
      {/* Metric tabs */}
      <div className="flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMetric(m.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              metric === m.id
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {m.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 self-center">
          {METRICS.find((m) => m.id === metric)?.desc}
        </span>
      </div>

      <div className="flex gap-4 items-start flex-col lg:flex-row">
        {/* Heatmap */}
        <div className="relative flex-1 card overflow-hidden p-0 bg-slate-50 dark:bg-slate-900">
          <svg
            viewBox={`0 0 ${PROJ_W} ${PROJ_H}`}
            className="w-full"
            role="img"
            aria-label="India election heatmap"
          >
            <defs>
              <pattern id="heat-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.4" opacity="0.4" />
              </pattern>
            </defs>
            <rect width={PROJ_W} height={PROJ_H} fill="url(#heat-grid)" />

            {bubbles.map(({ state, x, y, r, fill }) => (
              <motion.g
                key={state.code}
                role="button"
                tabIndex={0}
                aria-label={`${state.state}: ${state.seats} seats`}
                onClick={() => setSelected(selected?.code === state.code ? null : state)}
                onMouseEnter={(e) => setTooltip({ state, clientX: e.clientX, clientY: e.clientY })}
                onMouseMove={(e)  => setTooltip({ state, clientX: e.clientX, clientY: e.clientY })}
                onMouseLeave={()  => setTooltip(null)}
                style={{ cursor: "pointer" }}
              >
                <motion.circle
                  cx={x}
                  cy={y}
                  animate={{
                    r,
                    fill,
                    opacity: selected ? (selected.code === state.code ? 1 : 0.45) : 0.85,
                    stroke: selected?.code === state.code ? "#1E293B" : "white",
                    strokeWidth: selected?.code === state.code ? 2.5 : 0.8,
                  }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                />
                {r > 18 && (
                  <text
                    x={x} y={y}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={Math.min(r * 0.38, 10)}
                    fill="white" fontWeight="700"
                    style={{ pointerEvents: "none", userSelect: "none", opacity: 0.9 }}
                  >
                    {state.code}
                  </text>
                )}
              </motion.g>
            ))}
          </svg>

          {/* Colour legend */}
          {metric === "swing" && (
            <div className="absolute bottom-3 left-3 flex items-center gap-4 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-16 h-2 rounded-full inline-block" style={{ background: "linear-gradient(to right, #FFF7ED, #C2410C)" }} />
                <span className="text-slate-500">NDA dominance</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-16 h-2 rounded-full inline-block" style={{ background: "linear-gradient(to right, #EFF6FF, #1E40AF)" }} />
                <span className="text-slate-500">INDIA dominance</span>
              </span>
            </div>
          )}
          {metric === "turnout" && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] text-slate-500">
              <span>50%</span>
              <div className="w-24 h-2 rounded-full" style={{ background: "linear-gradient(to right, #FEF3C7, #92400E)" }} />
              <span>85%</span>
            </div>
          )}
          {metric === "margin" && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] text-slate-500">
              <span>30% margin</span>
              <div className="w-24 h-2 rounded-full" style={{ background: "linear-gradient(to right, #FFF1F2, #9F1239)" }} />
              <span>100%</span>
            </div>
          )}

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
              className="lg:w-64 card p-4 space-y-3 shrink-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{selected.state}</h3>
                  <p className="text-xs text-slate-500">{selected.seats} Lok Sabha seats</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 p-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">NDA</span>
                  <span className="font-bold text-orange-600">{selected.ndaSeats} seats ({Math.round(selected.ndaSeats / selected.seats * 100)}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">INDIA</span>
                  <span className="font-bold text-blue-600">{selected.indiaSeats} seats ({Math.round(selected.indiaSeats / selected.seats * 100)}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Other</span>
                  <span className="font-bold text-slate-500">{selected.otherSeats} seats</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 dark:border-slate-700 pt-1.5">
                  <span className="text-slate-500">Turnout</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selected.turnout}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Winner</span>
                  <span className="font-bold" style={{ color: selected.dominantColor }}>{selected.dominant} ({selected.dominantSeats})</span>
                </div>
              </div>

              {/* Bar */}
              <div className="flex h-3 rounded-full overflow-hidden">
                {selected.ndaSeats > 0 && (
                  <div className="bg-orange-400 h-full" style={{ width: `${selected.ndaSeats / selected.seats * 100}%` }} />
                )}
                {selected.indiaSeats > 0 && (
                  <div className="bg-blue-500 h-full" style={{ width: `${selected.indiaSeats / selected.seats * 100}%` }} />
                )}
                {selected.otherSeats > 0 && (
                  <div className="bg-slate-400 h-full" style={{ width: `${selected.otherSeats / selected.seats * 100}%` }} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="fixed z-50 pointer-events-none rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-900 p-3 text-xs"
            style={{ left: tooltip.clientX + 12, top: tooltip.clientY - 70 }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="font-bold text-slate-900 dark:text-slate-100">{tooltip.state.state}</div>
            <div className="text-slate-500 mt-0.5">{tooltip.state.seats} seats · {tooltip.state.turnout}% turnout</div>
            <div className="flex gap-2 mt-1 text-[10px]">
              <span className="text-orange-600 font-semibold">NDA {tooltip.state.ndaSeats}</span>
              <span className="text-blue-600 font-semibold">INDIA {tooltip.state.indiaSeats}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
