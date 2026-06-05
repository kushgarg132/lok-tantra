"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PoliticalRelationshipMap } from "@/components/graph/PoliticalRelationshipMap";
import { PowerHierarchyTree } from "@/components/graph/PowerHierarchyTree";
import { ElectionHeatmap } from "@/components/graph/ElectionHeatmap";

type Tab = "political" | "hierarchy" | "heatmap";

const TABS: { id: Tab; label: string; desc: string; badge: string }[] = [
  {
    id: "political",
    label: "Political Map",
    desc: "Alliance & party relationships",
    badge: "Cytoscape",
  },
  {
    id: "hierarchy",
    label: "Power Tree",
    desc: "Constitutional hierarchy",
    badge: "D3 Tree",
  },
  {
    id: "heatmap",
    label: "Election Heatmap",
    desc: "2024 LS results by state",
    badge: "D3 Diverging",
  },
];

export default function GraphPage() {
  const [tab, setTab] = useState<Tab>("political");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 uppercase tracking-wide">
              Political Graphs
            </span>
            <span className="text-xs text-slate-400">D3.js · Cytoscape.js · Framer Motion</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            Political Relationship Graphs
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">
            Interactive visualisations of Indian political power — alliance networks, constitutional hierarchy, and election result heatmaps.
          </p>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl mb-6 w-fit flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  tab === t.id
                    ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                }`}
              >
                {t.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Tab description */}
        <p className="text-sm text-slate-500 mb-5">
          {TABS.find((t) => t.id === tab)?.desc}
        </p>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {tab === "political"  && <PoliticalRelationshipMap />}
            {tab === "hierarchy"  && <PowerHierarchyTree />}
            {tab === "heatmap"    && <ElectionHeatmap />}
          </motion.div>
        </AnimatePresence>

        {/* Footer note */}
        <div className="mt-8 text-xs text-slate-400">
          Data: Election Commission of India · Lok Sabha 2024 results · Constitutional articles (Indian Parliament)
        </div>
      </div>
    </main>
  );
}
