import type { Metadata } from "next";
import { GovernanceAssistant } from "@/components/assistant/GovernanceAssistant";

export const metadata: Metadata = {
  title: "Governance Assistant — LokTantra",
  description:
    "AI-powered assistant for Indian constitutional law, governance, institutions, and citizens' rights. Grounded in the Constitution with source citations.",
};

export default function AssistantPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Governance Assistant</h1>
              <p className="text-slate-400 text-sm">AI-powered · Constitutionally grounded · Politically neutral</p>
            </div>
          </div>

          <p className="text-slate-300 text-sm max-w-2xl">
            Ask anything about Indian democracy — who controls what, how processes work,
            what the Constitution says, and how citizens can act. Every answer cites the
            relevant Article, case, or law.
          </p>

          {/* Capability cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-6">
            {[
              { icon: "📜", label: "Constitution" },
              { icon: "🏛️", label: "Institutions" },
              { icon: "⚖️", label: "Judiciary" },
              { icon: "🔄", label: "Processes" },
              { icon: "🗳️", label: "Elections" },
              { icon: "🛡️", label: "Rights" },
            ].map((cap) => (
              <div
                key={cap.label}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-white/5 border border-white/10 text-center"
              >
                <span className="text-xl">{cap.icon}</span>
                <span className="text-[11px] text-slate-400">{cap.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <div className="card rounded-none sm:rounded-2xl sm:mt-6 overflow-hidden border border-slate-200 dark:border-slate-800">
          <GovernanceAssistant />
        </div>

        {/* Disclaimer */}
        <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-500">
          <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>
            This assistant is for educational purposes only. It is not legal advice. Constitutional provisions
            are complex and context-dependent — consult a legal professional for specific legal matters.
            AI answers may occasionally be incomplete or simplified.
          </span>
        </div>
      </section>
    </main>
  );
}
