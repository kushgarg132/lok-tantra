import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { LearnDashboard } from "@/components/learn/LearnDashboard";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Learn Indian Democracy",
  description: "Interactive learning engine — quizzes, simulations, timelines, visual explainers for Constitution, Elections, Judiciary, and more. Beginner to UPSC level.",
};

export default async function LearnPage() {
  const paths = await prisma.learningPath
    .findMany({
      include: {
        modules: {
          orderBy: { order: "asc" },
          select: { id: true, title: true, description: true, type: true, content: true, estimatedMinutes: true, order: true },
        },
      },
      orderBy: { createdAt: "asc" },
    })
    .catch(() => []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-saffron">Education</span>
            <span className="badge-navy">{paths.length} Paths</span>
            <span className="badge-navy">{paths.reduce((s, p) => s + p.modules.length, 0)} Modules</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Learn Indian Democracy
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            From Preamble to Parliament — interactive lessons, quizzes, simulations, and visual
            explainers. Build civic knowledge at your own pace, from beginner to UPSC level.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
            {[
              { icon: "🧪", label: "Quizzes with explanations" },
              { icon: "🎮", label: "Decision simulations" },
              { icon: "📅", label: "Interactive timelines" },
              { icon: "🔬", label: "Visual explainers" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2">
                <span>{f.icon}</span> {f.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <LearnDashboard paths={paths} />
      </div>
    </div>
  );
}
