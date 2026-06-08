import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { BureaucracyDashboard } from "@/components/bureaucracy/BureaucracyDashboard";

export const metadata: Metadata = {
  title: "Bureaucracy & Administration — LokTantra",
  description: "Understand India's administrative machinery — IAS hierarchy, IPS ranks, PMO structure, Cabinet Secretariat, district administration, and policy flow from PM to citizen.",
};

export default async function BureaucracyPage() {
  const [levels, services, ministryCount] = await Promise.all([
    prisma.bureaucraticLevel.findMany({ orderBy: [{ hierarchy: "asc" }, { level: "asc" }] }).catch(() => []),
    prisma.civilService.findMany({ orderBy: { name: "asc" } }).catch(() => []),
    prisma.ministry.count().catch(() => 0),
  ]);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="flex flex-wrap gap-2 mb-4">
            {["IAS", "IPS", "IFoS", "PMO", "Cabinet Secretariat", "District Administration"].map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            The Administrative Machinery
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            The permanent executive that runs India — from the Cabinet Secretary in North Block to the Patwari in the village. Explore how policy travels from the Prime Minister to the citizen across 8 layers of government.
          </p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            {[
              { v: "~5,000", l: "IAS officers" },
              { v: "~3,500", l: "IPS officers" },
              { v: "2.5 lakh", l: "Gram Panchayats" },
              { v: "8 tiers", l: "Policy delivery chain" },
            ].map((s) => (
              <div key={s.l} className="card p-3 text-center">
                <div className="font-display font-bold text-saffron-600 dark:text-saffron-400">{s.v}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <BureaucracyDashboard levels={levels} services={services} ministryCount={ministryCount} />
      </div>
    </div>
  );
}
