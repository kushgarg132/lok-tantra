"use client";

import { useState } from "react";
import { QuizEngine } from "./QuizEngine";
import { TimelineViewer } from "./TimelineViewer";
import { SimulationEngine } from "./SimulationEngine";
import { VisualExplainer } from "./VisualExplainer";
import { useLearnStore } from "@/store/learnStore";
import type { Module, Topic, Level } from "@/data/learn/curriculum";

interface ModuleViewerProps {
  topic: Topic;
  module: Module;
  onBack: () => void;
  onLevelChange: (level: Level) => void;
}

type View = "content" | "quiz" | "timeline" | "simulation" | "explainer";

const LEVEL_CONFIG = {
  beginner: { label: "Beginner", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  intermediate: { label: "Intermediate", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  advanced: { label: "Advanced", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  upsc: { label: "UPSC", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
};

const LEVELS: Level[] = ["beginner", "intermediate", "advanced", "upsc"];

export function ModuleViewer({ topic, module, onBack, onLevelChange }: ModuleViewerProps) {
  const [view, setView] = useState<View>("content");
  const { isModuleComplete, getBestScore } = useLearnStore();
  const complete = isModuleComplete(topic.id, module.level);
  const bestScore = getBestScore(topic.id, module.level);
  const levelCfg = LEVEL_CONFIG[module.level];

  const TIMELINE_MAP: Record<string, string> = {
    constitution: "constitution",
    emergency: "emergency",
    elections: "elections",
    rti: "rti",
  };

  const SIM_MAP: Record<string, string> = {
    elections: "election-process",
    rti: "rti-filing",
    pil: "pil-journey",
    legislature: "bill-to-law",
    lawmaking: "bill-to-law",
  };

  if (view === "quiz") return (
    <QuizEngine topicId={topic.id} level={module.level} topicName={topic.name}
      accentColor={topic.accentColor} onClose={() => setView("content")} />
  );
  if (view === "timeline" && TIMELINE_MAP[topic.id]) return (
    <TimelineViewer timelineId={TIMELINE_MAP[topic.id]} onClose={() => setView("content")} />
  );
  if (view === "simulation" && SIM_MAP[topic.id]) return (
    <SimulationEngine simId={SIM_MAP[topic.id]} onClose={() => setView("content")} />
  );
  if (view === "explainer") return (
    <VisualExplainer type="constitution-preamble" topicId={topic.id} />
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">{topic.icon}</span>
            <span className="font-display font-bold text-slate-900 dark:text-slate-100 truncate">{topic.name}</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${levelCfg.color}`}>{levelCfg.label}</span>
            {complete && <span className="text-emerald-500 text-sm">✓</span>}
          </div>
        </div>
        <div className="text-[10px] text-slate-400 shrink-0">~{module.readingMinutes} min read</div>
      </div>

      {/* Level switcher */}
      <div className="flex gap-1.5 flex-wrap">
        {LEVELS.map((l) => {
          const lc = LEVEL_CONFIG[l];
          const done = isModuleComplete(topic.id, l);
          return (
            <button key={l} onClick={() => onLevelChange(l)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors flex items-center gap-1 ${module.level === l ? lc.color : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
              {l === module.level ? lc.label : LEVEL_CONFIG[l].label}
              {done && <span className="text-emerald-500">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Title + Summary */}
      <div className="card p-6">
        <h2 className="font-display font-bold text-xl text-slate-900 dark:text-slate-100 mb-3">{module.title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{module.summary}</p>
        {module.articles && module.articles.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {module.articles.map((a) => (
              <span key={a} className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{a}</span>
            ))}
          </div>
        )}
      </div>

      {/* Key Concepts */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm mb-4">Key Concepts</h3>
        <div className="space-y-4">
          {module.concepts.map((concept) => (
            <div key={concept.term} className="border-l-2 pl-4" style={{ borderColor: topic.accentColor }}>
              <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-1">{concept.term}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{concept.definition}</p>
              {concept.example && (
                <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-500 italic bg-slate-50 dark:bg-slate-800/60 rounded px-2 py-1">
                  Example: {concept.example}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Facts */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm mb-4">Key Facts</h3>
        <ul className="space-y-2.5">
          {module.keyFacts.map((fact, i) => (
            <li key={i} className="flex gap-3 items-start text-xs text-slate-700 dark:text-slate-300">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ backgroundColor: topic.accentColor }}>
                {i + 1}
              </span>
              <span className="leading-relaxed">{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Activities */}
      {(module.hasQuiz || module.hasTimeline || module.hasExplainer || module.hasSimulation) && (
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm mb-3">Learning Activities</h3>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {module.hasQuiz && (
              <button onClick={() => setView("quiz")}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:shadow-sm transition-all text-left bg-white dark:bg-slate-900">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center text-lg shrink-0">🧪</div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Take Quiz</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {bestScore ? `Best: ${bestScore.score}/${bestScore.total}` : "Test your knowledge"}
                  </div>
                </div>
              </button>
            )}
            {module.hasTimeline && TIMELINE_MAP[topic.id] && (
              <button onClick={() => setView("timeline")}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:shadow-sm transition-all text-left bg-white dark:bg-slate-900">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-lg shrink-0">📅</div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Timeline</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Interactive history</div>
                </div>
              </button>
            )}
            {module.hasExplainer && (
              <button onClick={() => setView("explainer")}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:shadow-sm transition-all text-left bg-white dark:bg-slate-900">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center text-lg shrink-0">🔬</div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Visual Explainer</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Interactive diagram</div>
                </div>
              </button>
            )}
            {module.hasSimulation && SIM_MAP[topic.id] && (
              <button onClick={() => setView("simulation")}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:shadow-sm transition-all text-left bg-white dark:bg-slate-900">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center text-lg shrink-0">🎮</div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Simulation</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Learn by doing</div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Next level prompt */}
      {module.level !== "upsc" && (
        <div className="card p-4 flex items-center gap-3">
          <div className="text-2xl">📈</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Ready to go deeper?</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Move to the next level for more detail and case law.</div>
          </div>
          <button onClick={() => onLevelChange(LEVELS[LEVELS.indexOf(module.level) + 1])}
            className="px-3 py-1.5 text-xs rounded-lg text-white font-medium shrink-0"
            style={{ backgroundColor: topic.accentColor }}>
            Next level
          </button>
        </div>
      )}
    </div>
  );
}
