import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Citizen Action Center",
  description: "Learn how to file RTI, PIL, grievances, and participate in Indian democracy",
};

export default async function CitizenActionPage() {
  const actions = await prisma.citizenAction.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-saffron">Participate</span>
            <span className="badge-chakra">Your Rights</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Citizen Action Center
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Democracy works when citizens participate. Learn how to use every tool available —
            from filing RTI to contesting elections. Step-by-step guides with templates.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          {actions.map((action) => (
            <div key={action.id} id={action.slug} className="card overflow-hidden scroll-mt-20">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center text-xl flex-shrink-0">
                    {action.icon === "clipboard" ? "📋" : action.icon === "scale" ? "⚖️" : action.icon === "file-text" ? "📝" : action.icon === "vote" ? "🗳️" : action.icon === "trophy" ? "🏆" : "📢"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-display font-bold text-slate-900 dark:text-slate-100">
                        {action.title}
                      </h2>
                      <span className={`badge text-[10px] ${
                        action.difficulty === "Easy" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : action.difficulty === "Intermediate" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {action.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{action.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                      <span>Cost: <strong>{action.cost}</strong></span>
                      <span>Timeline: <strong>{action.timeline}</strong></span>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Step-by-Step Guide
                      </h3>
                      <ol className="space-y-2">
                        {action.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-saffron-100 dark:bg-saffron-900/30 text-saffron-600 dark:text-saffron-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="mt-4 px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-800 dark:text-amber-300 inline-block font-mono">
                      {action.legalBasis}
                    </div>

                    {action.template && (
                      <details className="mt-4">
                        <summary className="text-sm font-medium text-saffron-600 dark:text-saffron-400 cursor-pointer hover:text-saffron-700">
                          View Template
                        </summary>
                        <pre className="mt-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto">
                          {action.template}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
