"use client";

import { useState } from "react";
import { getSimulation, SIMULATIONS } from "@/data/learn/simulations";
import { useLearnStore } from "@/store/learnStore";

interface SimulationEngineProps {
  simId?: string;
  topicId?: string;
  onClose?: () => void;
}

export function SimulationEngine({ simId, topicId, onClose }: SimulationEngineProps) {
  const sims = topicId
    ? SIMULATIONS.filter((s) => s.topic === topicId)
    : SIMULATIONS;

  const [activeSimId, setActiveSimId] = useState(simId || sims[0]?.id || SIMULATIONS[0].id);
  const [currentStepId, setCurrentStepId] = useState<string>(() => {
    const sim = getSimulation(activeSimId);
    return sim?.startStepId || "";
  });
  const [history, setHistory] = useState<string[]>([]);
  const [choiceHistory, setChoiceHistory] = useState<{ stepId: string; choiceId: string; isCorrect: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  const { markSimulationComplete } = useLearnStore();
  const sim = getSimulation(activeSimId)!;
  const currentStep = sim?.steps.find((s) => s.id === currentStepId);

  const handleChoose = (choiceId: string, nextStepId: string, isCorrect: boolean) => {
    setHistory((h) => [...h, currentStepId]);
    setChoiceHistory((h) => [...h, { stepId: currentStepId, choiceId, isCorrect }]);
    const next = sim.steps.find((s) => s.id === nextStepId);
    if (next) {
      setCurrentStepId(nextStepId);
      if (!next.isDecision && !sim.steps.find((s) => s.id === nextStepId && s.choices?.length)) {
        // Auto-advance to check if this is the last outcome step
        if (nextStepId === "complete" || !sim.steps.find((s) => s.id === nextStepId)?.isDecision) {
          // Will be advanced manually
        }
      }
    }
  };

  const handleContinue = () => {
    const nextIdx = sim.steps.findIndex((s) => s.id === currentStepId) + 1;
    if (nextIdx < sim.steps.length) {
      const nextStep = sim.steps[nextIdx];
      setHistory((h) => [...h, currentStepId]);
      setCurrentStepId(nextStep.id);
    } else {
      markSimulationComplete(activeSimId);
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentStepId(sim.startStepId);
    setHistory([]);
    setChoiceHistory([]);
    setFinished(false);
  };

  const handleChangeSim = (id: string) => {
    const s = getSimulation(id)!;
    setActiveSimId(id);
    setCurrentStepId(s.startStepId);
    setHistory([]);
    setChoiceHistory([]);
    setFinished(false);
  };

  const correctChoices = choiceHistory.filter((c) => c.isCorrect).length;
  const totalChoices = choiceHistory.filter((c) => c.isCorrect !== undefined).length;

  if (!sim || !currentStep) return null;

  if (finished) {
    return (
      <div className="card p-8 space-y-5 text-center">
        <div className="text-5xl">🎉</div>
        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-slate-100">Simulation Complete!</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">{sim.endMessage}</p>
        {totalChoices > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
            {correctChoices}/{totalChoices} correct decisions
          </div>
        )}
        <div className="flex gap-3 max-w-sm mx-auto">
          <button onClick={handleRestart} className="flex-1 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-600">
            Try again
          </button>
          {onClose && (
            <button onClick={onClose} className="flex-1 py-2 rounded-xl text-xs bg-indigo-600 text-white">
              Done
            </button>
          )}
        </div>
      </div>
    );
  }

  const stepIndex = sim.steps.findIndex((s) => s.id === currentStepId);
  const progress = Math.round((stepIndex / sim.steps.length) * 100);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
        )}
        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{sim.title}</span>
            <span>Step {stepIndex + 1}/{sim.steps.length}</span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Sim selector */}
      {sims.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {sims.map((s) => (
            <button key={s.id} onClick={() => handleChangeSim(s.id)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${activeSimId === s.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
              {s.title}
            </button>
          ))}
        </div>
      )}

      {/* Scenario card */}
      <div className="card p-6 space-y-4">
        {/* Step type badge */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 text-[10px] rounded-full font-semibold ${currentStep.isDecision ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"}`}>
            {currentStep.isDecision ? "⚖️ Decision Point" : "📋 Information"}
          </span>
          <span className="text-[10px] text-slate-400">{currentStep.actor}</span>
        </div>

        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">{currentStep.title}</h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{currentStep.description}</p>

        {currentStep.article && (
          <div className="font-mono text-xs bg-slate-50 dark:bg-slate-800/60 rounded-lg px-3 py-2 text-slate-500">
            {currentStep.article}
          </div>
        )}

        {/* Outcome box for information steps */}
        {!currentStep.isDecision && currentStep.outcome && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase mb-1">What happens</div>
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">{currentStep.outcome}</p>
          </div>
        )}
      </div>

      {/* Choices or Continue */}
      {currentStep.isDecision && currentStep.choices ? (
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-500 uppercase">What do you do?</div>
          {currentStep.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleChoose(choice.id, choice.nextStepId, choice.isCorrect ?? false)}
              className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-indigo-400 shrink-0 mt-0.5 transition-colors" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{choice.label}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <button onClick={handleContinue}
          className="w-full py-3 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
          Continue →
        </button>
      )}

      {/* Back button */}
      {history.length > 0 && (
        <button onClick={() => {
          const prev = history[history.length - 1];
          setCurrentStepId(prev);
          setHistory((h) => h.slice(0, -1));
          setChoiceHistory((h) => h.slice(0, -1));
        }} className="w-full py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 transition-colors">
          ← Back
        </button>
      )}
    </div>
  );
}
