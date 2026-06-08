"use client";

import { useState } from "react";
import { useLearnStore } from "@/store/learnStore";
import type { Level } from "@/data/learn/curriculum";

export interface LearningPathDB {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  estimatedHours: number;
  color: string;
  prerequisites: string[];
  modules: LearningModuleDB[];
}
export interface LearningModuleDB {
  id: string;
  title: string;
  description: string;
  type: string;
  content: string;
  estimatedMinutes: number;
  order: number;
}

const LEVEL_CONFIG: Record<string, { label: string; color: string; accent: string; bg: string }> = {
  beginner:     { label: "Beginner",     color: "text-emerald-600 dark:text-emerald-400", accent: "#10b981", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  intermediate: { label: "Intermediate", color: "text-blue-600 dark:text-blue-400",       accent: "#3b82f6", bg: "bg-blue-100 dark:bg-blue-900/30" },
  advanced:     { label: "Advanced",     color: "text-purple-600 dark:text-purple-400",   accent: "#8b5cf6", bg: "bg-purple-100 dark:bg-purple-900/30" },
  upsc:         { label: "UPSC",         color: "text-red-600 dark:text-red-400",         accent: "#ef4444", bg: "bg-red-100 dark:bg-red-900/30" },
  research:     { label: "Research",     color: "text-slate-600 dark:text-slate-400",     accent: "#64748b", bg: "bg-slate-100 dark:bg-slate-800" },
};

const TYPE_ICON: Record<string, string> = {
  explainer: "📖",
  quiz: "🧪",
  simulation: "🎮",
  timeline: "📅",
  case_study: "🔬",
};

interface Props { paths: LearningPathDB[] }

export function LearnDashboard({ paths }: Props) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { isModuleComplete, markModuleComplete } = useLearnStore();

  const activePath = paths.find((p) => p.id === selectedPath);
  const activeModule = activePath?.modules.find((m) => m.id === selectedModule);

  const filteredPaths = search.trim()
    ? paths.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.level.toLowerCase().includes(search.toLowerCase())
      )
    : paths;

  if (activeModule && activePath) {
    const lvl = LEVEL_CONFIG[activePath.level] ?? LEVEL_CONFIG["beginner"];
    const done = isModuleComplete(activeModule.id, activePath.level as Level);
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedModule(null)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            ← Back to {activePath.title}
          </button>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{TYPE_ICON[activeModule.type] ?? "📖"}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${lvl.bg} ${lvl.color}`}>{lvl.label}</span>
              </div>
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-slate-100">{activeModule.title}</h2>
              <div className="text-xs text-slate-400 mt-0.5">~{activeModule.estimatedMinutes} min · Module {activeModule.order} of {activePath.modules.length}</div>
            </div>
            {done && (
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                ✓ Completed
              </span>
            )}
          </div>

          {activeModule.description && (
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{activeModule.description}</p>
          )}

          {activeModule.content ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {activeModule.content}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
              <div className="text-3xl mb-3">📝</div>
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">{activeModule.title}</div>
              <p className="text-xs text-slate-400 mt-2">Full content for this module is being prepared and will appear here once published.</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {!done && (
              <button onClick={() => markModuleComplete(activeModule.id, activePath.level as Level)}
                className="px-4 py-2 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition-colors">
                Mark Complete
              </button>

            )}
            <button onClick={() => setSelectedModule(null)}
              className="px-4 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900">
              Back to modules
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activePath) {
    const lvl = LEVEL_CONFIG[activePath.level] ?? LEVEL_CONFIG["beginner"];
    const completedCount = activePath.modules.filter((m) => isModuleComplete(m.id, activePath.level as Level)).length;
    const pct = activePath.modules.length > 0 ? Math.round((completedCount / activePath.modules.length) * 100) : 0;
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedPath(null); setSelectedModule(null); }}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            ← All Paths
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg shrink-0"
              style={{ backgroundColor: lvl.accent }}>
              {activePath.level === "beginner" ? "A" : activePath.level === "intermediate" ? "B" : activePath.level === "advanced" ? "C" : activePath.level === "upsc" ? "★" : "R"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-slate-100">{activePath.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{activePath.description}</p>
              <div className="flex gap-3 mt-2 text-xs text-slate-400 flex-wrap">
                <span>{activePath.estimatedHours}h estimated</span>
                <span>·</span>
                <span>{activePath.modules.length} modules</span>
                <span>·</span>
                <span className={lvl.color}>{lvl.label}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: lvl.accent }} />
          </div>
          <div className="text-[10px] text-slate-400 mt-1 text-right">{completedCount}/{activePath.modules.length} complete</div>
        </div>

        <div className="space-y-2">
          {[...activePath.modules].sort((a, b) => a.order - b.order).map((mod) => {
            const done = isModuleComplete(mod.id, activePath.level as Level);
            return (
              <button key={mod.id} onClick={() => setSelectedModule(mod.id)}
                className="w-full card p-4 text-left flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                  {done ? "✓" : mod.order}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">{mod.title}</div>
                  {mod.description && <div className="text-xs text-slate-500 mt-0.5 truncate">{mod.description}</div>}
                </div>
                <div className="text-[10px] text-slate-400 shrink-0">{TYPE_ICON[mod.type] ?? "📖"} ~{mod.estimatedMinutes}m</div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 shrink-0">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const totalModules = paths.reduce((s, p) => s + p.modules.length, 0);
  const completedAll = paths.reduce((s, p) => s + p.modules.filter((m) => isModuleComplete(m.id, p.level as Level)).length, 0);
  const overallPct = totalModules > 0 ? Math.round((completedAll / totalModules) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="card p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-slate-100 mb-1">Learn Indian Democracy</h2>
            <p className="text-sm text-slate-500 leading-relaxed">Choose a learning path to start your civic education journey.</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-display font-bold text-3xl text-slate-900 dark:text-slate-100">{overallPct}%</div>
            <div className="text-xs text-slate-400">{completedAll}/{totalModules} modules done</div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-saffron-400 to-saffron-600 rounded-full transition-all"
            style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search learning paths…"
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-saffron-400"
        />
      </div>

      {paths.length === 0 ? (
        <div className="card p-8 text-center text-slate-400">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-sm">No learning paths found. Run <code className="font-mono text-xs">npm run db:seed</code> to populate.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPaths.map((path) => {
            const lvl = LEVEL_CONFIG[path.level] ?? LEVEL_CONFIG["beginner"];
            const completedCount = path.modules.filter((m) => isModuleComplete(m.id, path.level as Level)).length;
            const pct = path.modules.length > 0 ? Math.round((completedCount / path.modules.length) * 100) : 0;
            return (
              <button key={path.id} onClick={() => setSelectedPath(path.id)}
                className="card p-5 text-left hover:shadow-lg transition-all active:scale-[0.99]">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold shrink-0"
                    style={{ backgroundColor: lvl.accent }}>
                    {path.level === "beginner" ? "A" : path.level === "intermediate" ? "B" : path.level === "advanced" ? "C" : path.level === "upsc" ? "★" : "R"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[10px] font-semibold ${lvl.color}`}>{lvl.label}</div>
                    <div className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">{path.title}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{path.description}</p>

                <div className="flex gap-3 text-[10px] text-slate-400 mb-3">
                  <span>{path.modules.length} modules</span>
                  <span>·</span>
                  <span>{path.estimatedHours}h</span>
                  {path.prerequisites.length > 0 && (
                    <>
                      <span>·</span>
                      <span>Req: {path.prerequisites.join(", ")}</span>
                    </>
                  )}
                </div>

                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: lvl.accent }} />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{completedCount}/{path.modules.length} complete</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
