"use client";

import { useState } from "react";
import { TOPICS, LEVELS, getModule } from "@/data/learn/curriculum";
import { useLearnStore } from "@/store/learnStore";
import { ModuleViewer } from "./ModuleViewer";
import type { Level, Topic } from "@/data/learn/curriculum";

type DashView = "home" | "module";

const LEVEL_ACCENT: Record<Level, string> = {
  beginner: "#10b981",
  intermediate: "#3b82f6",
  advanced: "#8b5cf6",
  upsc: "#ef4444",
};

export function LearnDashboard() {
  const [view, setView] = useState<DashView>("home");
  const [activeLevel, setActiveLevel] = useState<Level>("beginner");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { isModuleComplete, getBestScore, getTotalCompleted, reset } = useLearnStore();

  const totalModules = TOPICS.length * LEVELS.length;
  const completed = getTotalCompleted();
  const pct = Math.round((completed / totalModules) * 100);

  const filteredTopics = search.trim()
    ? TOPICS.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      )
    : TOPICS;

  const handleOpenModule = (topicId: string, level: Level) => {
    setSelectedTopicId(topicId);
    setActiveLevel(level);
    setView("module");
  };

  // Module view
  if (view === "module" && selectedTopicId) {
    const topic = TOPICS.find((t) => t.id === selectedTopicId)!;
    const module = getModule(selectedTopicId, activeLevel);
    if (!module) {
      return (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">🚧</div>
          <p className="text-sm text-slate-500">Module not found.</p>
          <button onClick={() => setView("home")} className="mt-4 px-4 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
            Back
          </button>
        </div>
      );
    }
    return (
      <ModuleViewer
        topic={topic}
        module={module}
        onBack={() => setView("home")}
        onLevelChange={(l) => {
          setActiveLevel(l);
          setView("module");
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero + Stats */}
      <div className="card p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-slate-100 mb-1">
              Learn Indian Democracy
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              From Preamble to Parliament — interactive lessons, quizzes, and simulations for every level.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-display font-bold text-3xl text-slate-900 dark:text-slate-100">{pct}%</div>
            <div className="text-xs text-slate-400">{completed}/{totalModules} modules done</div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-saffron-400 to-saffron-600 rounded-full transition-all"
            style={{ width: `${pct}%` }} />
        </div>

        {/* Level stats */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {LEVELS.map((lvl) => {
            const done = TOPICS.filter((t) => isModuleComplete(t.id, lvl.id)).length;
            return (
              <div key={lvl.id} className="text-center">
                <div className="font-display font-bold text-slate-900 dark:text-slate-100 text-base">{done}/{TOPICS.length}</div>
                <div className={`text-[10px] font-medium ${lvl.color}`}>{lvl.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level selector */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Learning Level</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setActiveLevel(lvl.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${activeLevel === lvl.id ? "border-current shadow-sm " + lvl.color : "border-transparent bg-slate-100 dark:bg-slate-800/60 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"}`}
            >
              <div className={`w-8 h-8 rounded-xl mb-3 flex items-center justify-center text-base font-bold text-white`}
                style={{ backgroundColor: LEVEL_ACCENT[lvl.id] }}>
                {lvl.id === "beginner" ? "A" : lvl.id === "intermediate" ? "B" : lvl.id === "advanced" ? "C" : "★"}
              </div>
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{lvl.label}</div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{lvl.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search topics…"
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-saffron-400"
        />
      </div>

      {/* Topic grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase">
            {filteredTopics.length} Topics — {LEVELS.find((l) => l.id === activeLevel)?.label} Level
          </h3>
          {completed > 0 && (
            <button onClick={() => reset()} className="text-[10px] text-red-400 hover:text-red-600 transition-colors">
              Reset progress
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => {
            const module = getModule(topic.id, activeLevel);
            const done = isModuleComplete(topic.id, activeLevel);
            const best = getBestScore(topic.id, activeLevel);
            const allLevelsDone = LEVELS.every((l) => isModuleComplete(topic.id, l.id));

            return (
              <TopicCard
                key={topic.id}
                topic={topic}
                activeLevel={activeLevel}
                readingMinutes={module?.readingMinutes}
                done={done}
                allDone={allLevelsDone}
                bestScore={best ? `${best.score}/${best.total}` : undefined}
                hasQuiz={module?.hasQuiz ?? false}
                hasTimeline={module?.hasTimeline ?? false}
                hasSimulation={module?.hasSimulation ?? false}
                hasExplainer={module?.hasExplainer ?? false}
                onClick={() => handleOpenModule(topic.id, activeLevel)}
              />
            );
          })}
        </div>
      </div>

      {/* Quick access: featured activities */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Featured Activities</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <FeaturedCard icon="📜" title="Constitution Quiz" desc="Test your knowledge of India's supreme law" color="#D97706"
            onClick={() => handleOpenModule("constitution", activeLevel)} />
          <FeaturedCard icon="📅" title="Emergency Timeline" desc="The 1975 Emergency — 12 pivotal events" color="#dc2626"
            onClick={() => handleOpenModule("emergency", activeLevel)} />
          <FeaturedCard icon="🎮" title="Bill Simulator" desc="Guide a bill through Parliament step by step" color="#7c3aed"
            onClick={() => handleOpenModule("legislature", "beginner")} />
          <FeaturedCard icon="📋" title="RTI Journey" desc="File an RTI and follow it through the system" color="#0891b2"
            onClick={() => handleOpenModule("rti", "beginner")} />
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TopicCardProps {
  topic: Topic;
  activeLevel: Level;
  readingMinutes?: number;
  done: boolean;
  allDone: boolean;
  bestScore?: string;
  hasQuiz: boolean;
  hasTimeline: boolean;
  hasSimulation: boolean;
  hasExplainer: boolean;
  onClick: () => void;
}

function TopicCard({ topic, activeLevel, readingMinutes, done, allDone, bestScore, hasQuiz, hasTimeline, hasSimulation, hasExplainer, onClick }: TopicCardProps) {
  const levelColor = LEVEL_ACCENT[activeLevel];

  return (
    <button
      onClick={onClick}
      className="card p-5 text-left group hover:shadow-md transition-all hover:-translate-y-0.5 relative overflow-hidden"
    >
      {/* Completion ribbon */}
      {allDone && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">✓</div>
      )}

      {/* Topic icon + name */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${topic.bg}`}>
          {topic.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{topic.name}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2">{topic.description}</div>
        </div>
      </div>

      {/* Current level badge */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: levelColor }}>
          {done && <span>✓</span>}
          {activeLevel.charAt(0).toUpperCase() + activeLevel.slice(1)}
        </div>
        {readingMinutes && <span className="text-[10px] text-slate-400">~{readingMinutes} min</span>}
        {bestScore && <span className="text-[10px] text-slate-400 ml-auto">Quiz: {bestScore}</span>}
      </div>

      {/* Level progress bar */}
      <div className="flex gap-1 mb-3">
        {(["beginner", "intermediate", "advanced", "upsc"] as Level[]).map((l) => (
          <div key={l} className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: LEVEL_ACCENT[l], opacity: done && l === activeLevel ? 1 : 0.2 }} />
        ))}
      </div>

      {/* Feature badges */}
      <div className="flex gap-1.5 flex-wrap">
        {hasQuiz && <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">Quiz</span>}
        {hasTimeline && <span className="px-2 py-0.5 text-[10px] rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">Timeline</span>}
        {hasSimulation && <span className="px-2 py-0.5 text-[10px] rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">Sim</span>}
        {hasExplainer && <span className="px-2 py-0.5 text-[10px] rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">Explainer</span>}
      </div>
    </button>
  );
}

function FeaturedCard({ icon, title, desc, color, onClick }: { icon: string; title: string; desc: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="card p-4 text-left group hover:shadow-md transition-all hover:-translate-y-0.5 flex gap-3 items-start">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: color + "20" }}>
        <span>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 leading-snug">{title}</div>
        <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{desc}</div>
      </div>
    </button>
  );
}
