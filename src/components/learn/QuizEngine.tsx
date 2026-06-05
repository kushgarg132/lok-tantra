"use client";

import { useState } from "react";
import { getQuiz } from "@/data/learn/quizzes";
import { useLearnStore } from "@/store/learnStore";
import type { Level } from "@/data/learn/curriculum";

interface QuizEngineProps {
  topicId: string;
  level: Level;
  topicName: string;
  accentColor: string;
  onClose: () => void;
}

export function QuizEngine({ topicId, level, topicName, accentColor, onClose }: QuizEngineProps) {
  const questions = getQuiz(topicId, level);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const { saveQuizResult, markModuleComplete } = useLearnStore();

  if (!questions.length) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <div className="font-bold text-slate-700 dark:text-slate-300">Quiz coming soon for this level</div>
        <button onClick={onClose} className="mt-4 px-4 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">Back</button>
      </div>
    );
  }

  const q = questions[current];
  const score = answers.filter((a, i) => a === questions[i].correct).length;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      const finalScore = answers.filter((a, i) => a === questions[i].correct).length;
      saveQuizResult({ topicId, level, score: finalScore, total: questions.length, completedAt: new Date().toISOString() });
      if (finalScore >= Math.ceil(questions.length * 0.6)) markModuleComplete(topicId, level);
      setFinished(true);
    }
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = score >= Math.ceil(questions.length * 0.6);
    return (
      <div className="card p-8 text-center space-y-5">
        <div className="text-5xl">{pct >= 80 ? "🏆" : pct >= 60 ? "✅" : "📚"}</div>
        <div className="font-display font-bold text-2xl text-slate-900 dark:text-slate-100">
          {score} / {questions.length} correct
        </div>
        <div className="text-4xl font-display font-bold" style={{ color: accentColor }}>{pct}%</div>
        <div className={`text-sm font-medium ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {passed ? "Module marked complete!" : "Try again to mark complete (need 60%+)"}
        </div>

        {/* Per-question review */}
        <div className="text-left space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs font-semibold text-slate-500 uppercase">Review</div>
          {questions.map((q, i) => {
            const correct = answers[i] === q.correct;
            return (
              <div key={q.id} className={`p-3 rounded-xl border text-xs ${correct ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20" : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"}`}>
                <div className="flex gap-2 items-start mb-1">
                  <span>{correct ? "✓" : "✗"}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{q.question}</span>
                </div>
                {!correct && (
                  <div className="ml-5 text-emerald-700 dark:text-emerald-400">
                    Correct: {q.options[q.correct]}
                  </div>
                )}
                <div className="ml-5 text-slate-500 mt-1 leading-relaxed">{q.explanation}</div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setCurrent(0); setSelected(null); setAnswers(Array(questions.length).fill(null)); setShowExplanation(false); setFinished(false); }}
            className="flex-1 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 transition-colors">
            Retry
          </button>
          <button onClick={onClose} className="flex-1 py-2 text-xs rounded-lg text-white font-medium"
            style={{ backgroundColor: accentColor }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Question {current + 1} of {questions.length}</span>
            <span>{topicName} · {level}</span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%`, backgroundColor: accentColor }} />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="card p-6">
        <div className="text-sm font-display font-bold text-slate-900 dark:text-slate-100 leading-relaxed mb-4">
          {q.question}
        </div>
        {q.article && (
          <div className="text-[10px] text-slate-400 font-mono mb-4">{q.article}</div>
        )}
        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            let cls = "text-left w-full p-3.5 rounded-xl border text-xs transition-all ";
            if (selected === null) {
              cls += "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 cursor-pointer";
            } else if (idx === q.correct) {
              cls += "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 font-medium";
            } else if (idx === selected && selected !== q.correct) {
              cls += "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200";
            } else {
              cls += "border-slate-200 dark:border-slate-700 opacity-50";
            }
            return (
              <button key={idx} onClick={() => handleSelect(idx)} className={cls}>
                <span className="inline-flex items-center gap-2">
                  <span className={`shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border ${selected !== null && idx === q.correct ? "bg-emerald-500 border-emerald-500 text-white" : selected !== null && idx === selected && selected !== q.correct ? "bg-red-500 border-red-500 text-white" : "border-current"}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`rounded-xl p-4 text-xs leading-relaxed ${selected === q.correct ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300" : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"}`}>
          <div className="font-bold mb-1">{selected === q.correct ? "✓ Correct!" : "✗ Not quite"}</div>
          {q.explanation}
        </div>
      )}

      {/* Next button */}
      {selected !== null && (
        <button onClick={handleNext} className="w-full py-3 rounded-xl text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: accentColor }}>
          {current + 1 < questions.length ? "Next Question →" : "See Results"}
        </button>
      )}
    </div>
  );
}
