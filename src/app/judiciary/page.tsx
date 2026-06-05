import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { JudiciaryDashboard } from "@/components/judiciary/JudiciaryDashboard";

export const metadata: Metadata = {
  title: "Judiciary Intelligence — LokTantra",
  description:
    "Supreme Court hierarchy, 25 High Courts, landmark judgments, constitutional benches, PIL workflows, appeals flow, judgment citation graph, and judicial review powers.",
};

export default async function JudiciaryPage() {
  const [courts, cases, writs] = await Promise.all([
    prisma.court.findMany({ orderBy: { type: "asc" } }),
    prisma.landmarkCase.findMany({
      include: { articlesInterpreted: true },
      orderBy: { year: "asc" },
    }),
    prisma.writ.findMany(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-chakra">Judiciary</span>
            <span className="badge-navy">Art. 124–237</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Judiciary Intelligence
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Guardian of the Constitution. Explore the complete court hierarchy, 25 High Courts,
            landmark judgments, constitutional benches, PIL workflows, and judicial review powers.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              "Court Hierarchy", "25 High Courts", "Landmark Cases", "Constitution Benches",
              "PIL Workflow", "Appeals Flow", "Judgment Graph", "Judicial Review",
            ].map((f) => (
              <span key={f} className="px-3 py-1 text-xs rounded-full bg-emerald-100 dark:bg-white/10 text-emerald-700 dark:text-slate-300 border border-emerald-200 dark:border-white/10">
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <JudiciaryDashboard courts={courts} cases={cases} writs={writs} />
    </div>
  );
}
