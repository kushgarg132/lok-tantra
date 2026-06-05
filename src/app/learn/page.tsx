import type { Metadata } from "next";
import { LearnDashboard } from "@/components/learn/LearnDashboard";

export const metadata: Metadata = {
  title: "Learn Indian Democracy",
  description: "Interactive learning engine — quizzes, simulations, timelines, visual explainers for Constitution, Elections, Judiciary, and more. Beginner to UPSC level.",
};

export default function LearnPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-saffron">Education</span>
            <span className="badge-navy">12 Topics</span>
            <span className="badge-navy">4 Levels</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Learn Indian Democracy
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            From Preamble to Parliament — interactive lessons, quizzes, simulations, and visual
            explainers. Build civic knowledge at your own pace, from beginner to UPSC level.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-amber-500">🧪</span> Quizzes with explanations
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-500">🎮</span> Decision simulations
            </div>
            <div className="flex items-center gap-2">
              <span className="text-indigo-500">📅</span> Interactive timelines
            </div>
            <div className="flex items-center gap-2">
              <span className="text-violet-500">🔬</span> Visual explainers
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <LearnDashboard />
      </div>
    </div>
  );
}
