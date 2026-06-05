import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Level } from "@/data/learn/curriculum";

interface QuizResult {
  topicId: string;
  level: Level;
  score: number;
  total: number;
  completedAt: string;
}

interface LearnState {
  // Navigation
  activeTopicId: string | null;
  activeLevel: Level;
  activeView: "dashboard" | "module" | "quiz" | "timeline" | "simulation";

  // Progress
  completedModules: string[]; // `${topicId}-${level}`
  quizResults: QuizResult[];
  simulationsCompleted: string[];

  // Actions
  setActiveTopic: (topicId: string) => void;
  setActiveLevel: (level: Level) => void;
  setActiveView: (view: LearnState["activeView"]) => void;
  markModuleComplete: (topicId: string, level: Level) => void;
  saveQuizResult: (result: QuizResult) => void;
  markSimulationComplete: (simId: string) => void;
  isModuleComplete: (topicId: string, level: Level) => boolean;
  getBestScore: (topicId: string, level: Level) => QuizResult | null;
  getTotalCompleted: () => number;
  reset: () => void;
}

export const useLearnStore = create<LearnState>()(
  persist(
    (set, get) => ({
      activeTopicId: null,
      activeLevel: "beginner",
      activeView: "dashboard",
      completedModules: [],
      quizResults: [],
      simulationsCompleted: [],

      setActiveTopic: (topicId) => set({ activeTopicId: topicId }),
      setActiveLevel: (level) => set({ activeLevel: level }),
      setActiveView: (view) => set({ activeView: view }),

      markModuleComplete: (topicId, level) => {
        const key = `${topicId}-${level}`;
        set((s) => ({
          completedModules: s.completedModules.includes(key)
            ? s.completedModules
            : [...s.completedModules, key],
        }));
      },

      saveQuizResult: (result) => {
        set((s) => {
          const existing = s.quizResults.findIndex(
            (r) => r.topicId === result.topicId && r.level === result.level
          );
          const updated = [...s.quizResults];
          if (existing >= 0) {
            if (result.score > updated[existing].score) {
              updated[existing] = result;
            }
          } else {
            updated.push(result);
          }
          return { quizResults: updated };
        });
      },

      markSimulationComplete: (simId) => {
        set((s) => ({
          simulationsCompleted: s.simulationsCompleted.includes(simId)
            ? s.simulationsCompleted
            : [...s.simulationsCompleted, simId],
        }));
      },

      isModuleComplete: (topicId, level) => {
        return get().completedModules.includes(`${topicId}-${level}`);
      },

      getBestScore: (topicId, level) => {
        return (
          get().quizResults.find(
            (r) => r.topicId === topicId && r.level === level
          ) ?? null
        );
      },

      getTotalCompleted: () => get().completedModules.length,

      reset: () =>
        set({
          completedModules: [],
          quizResults: [],
          simulationsCompleted: [],
          activeTopicId: null,
          activeLevel: "beginner",
          activeView: "dashboard",
        }),
    }),
    { name: "loktantra-learn-progress" }
  )
);
