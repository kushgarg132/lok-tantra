import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { RepresentativeDiscovery } from "@/components/representatives/RepresentativeDiscovery";

export const revalidate = 3600; // Representative data refreshes at most every hour

export const metadata: Metadata = {
  title: "Find Your Representatives",
  description:
    "Discover your MP, MLA, and local officials by location, PIN code, constituency, or state",
};

export default async function RepresentativesPage() {
  // Only load a subset initially or just states
  const states = await prisma.stateUT.findMany({
    where: { assemblySeats: { gt: 0 } },
    orderBy: { name: "asc" },
  });

  const stateNames = states.map((s) => s.name);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-chakra">Discovery</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Find Your Representatives
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Discover who represents you — from your local councillor to your Member of Parliament.
            Search using your PIN code or exact GPS location to find officials at every tier.
          </p>
        </div>
      </section>

      <RepresentativeDiscovery
        initialRepresentatives={[]}
        states={stateNames}
      />
    </div>
  );
}
