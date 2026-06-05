import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Learning Paths",
  description: "Learn Indian democracy from beginner to expert — structured courses, visual explainers, quizzes",
};

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  blue: { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  purple: { bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200 dark:border-purple-800", text: "text-purple-600 dark:text-purple-400", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  saffron: { bg: "bg-saffron-50 dark:bg-saffron-900/20", border: "border-saffron-200 dark:border-saffron-800", text: "text-saffron-600 dark:text-saffron-400", badge: "badge-saffron" },
  slate: { bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-200 dark:border-slate-700", text: "text-slate-600 dark:text-slate-400", badge: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300" },
};

export default async function LearnPage() {
  const paths = await prisma.learningPath.findMany({
    include: { modules: { orderBy: { order: "asc" } } },
    orderBy: { estimatedHours: "asc" },
  });

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-saffron">Education</span>
            <span className="badge-navy">{paths.length} Levels</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Learning Paths
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Structured courses from beginner to research level. Visual explainers, interactive diagrams,
            quizzes, and simulations. Learn Indian democracy the way it should be taught.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        {paths.map((path) => {
          const colors = colorMap[path.color] ?? colorMap.slate;
          return (
            <div key={path.id} className={`card overflow-hidden border-2 ${colors.border}`}>
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge text-[10px] ${colors.badge}`}>{path.level}</span>
                      <span className="text-xs text-slate-400">
                        {path.estimatedHours} hours &middot; {path.modules.length} modules
                      </span>
                    </div>
                    <h2 className="text-xl font-display font-bold text-slate-900 dark:text-slate-100">{path.title}</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">{path.description}</p>
                  </div>
                  <Link href={`/learn/${path.slug}`} className={`px-5 py-2.5 rounded-xl ${colors.text} font-medium text-sm border-2 ${colors.border} transition-colors flex-shrink-0`}>
                    Start Learning
                  </Link>
                </div>
                <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {path.modules.map((module, i) => (
                    <div key={module.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <span className={`w-6 h-6 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{module.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
