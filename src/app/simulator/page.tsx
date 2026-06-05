import type { Metadata } from "next";
import { LawmakingSimulator } from "@/components/simulator/LawmakingSimulator";

export const metadata: Metadata = {
  title: "Law-Making Simulator",
  description: "Simulate the complete Indian legislative process — bill pipeline, coalition negotiation, constitutional amendments, and confidence motions.",
};

export default function SimulatorPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-rose-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-saffron">Interactive</span>
            <span className="badge-navy">4 Simulations</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Law-Making Simulator
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Experience India's legislative processes from the inside. Every choice has constitutional consequences
            — from how you handle committee recommendations to whether you invoke the anti-defection law.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2"><span>📋</span> Bill introduction to presidential assent</div>
            <div className="flex items-center gap-2"><span>🤝</span> Build a coalition government</div>
            <div className="flex items-center gap-2"><span>📜</span> Navigate Article 368 amendments</div>
            <div className="flex items-center gap-2"><span>🚨</span> Survive a no-confidence motion</div>
          </div>
        </div>
      </section>

      {/* Simulator */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <LawmakingSimulator />
      </div>
    </div>
  );
}
