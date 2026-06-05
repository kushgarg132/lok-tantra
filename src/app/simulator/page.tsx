import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { GovernanceSimulator } from "@/components/simulator/GovernanceSimulator";

export const metadata: Metadata = {
  title: "Governance Simulator",
  description: "Simulate democratic processes — bill passing, cabinet formation, constitutional amendments",
};

export default async function SimulatorPage() {
  const processes = await prisma.governanceProcess.findMany({
    include: { steps: { orderBy: { order: "asc" } } },
    orderBy: { name: "asc" },
  });

  const simulations = processes.map((p) => ({
    id: p.slug,
    title: p.name,
    description: p.description,
    category: p.category,
    difficulty: p.difficulty as "beginner" | "intermediate" | "advanced",
    estimatedTime: p.estimatedTime ?? "10 min",
    steps: p.steps.map((s) => ({
      id: s.order,
      title: s.title,
      actor: s.actor,
      description: s.description,
      constitutionalBasis: s.constitutionalArticle ?? undefined,
      fact: s.fact ?? undefined,
      options: (s.options as { label: string; outcome: string; correct?: boolean }[] | null) ?? undefined,
    })),
  }));

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-rose-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-saffron">Interactive</span>
            <span className="badge-navy">Simulation</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Governance Simulator
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Learn by doing. Walk through real democratic processes step by step —
            from introducing a bill to amending the Constitution.
          </p>
        </div>
      </section>

      <GovernanceSimulator simulations={simulations} />
    </div>
  );
}
