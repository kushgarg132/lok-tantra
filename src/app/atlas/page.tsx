import { GovernanceAtlas } from "@/components/atlas/GovernanceAtlas";

export const metadata = {
  title: "Governance Atlas | LokTantra",
  description: "Interactive bubble map of India — explore 2024 Lok Sabha results, voter turnout, population, and seat distribution across all 36 states and UTs.",
};

export default function AtlasPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase tracking-wide">
              Governance Atlas
            </span>
            <span className="text-xs text-slate-400">36 states & UTs · 2024 Lok Sabha</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            India Governance Atlas
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">
            Interactive bubble map of India. Each bubble represents a state or UT — sized by Lok Sabha seats and coloured by the layer you select. Click any bubble for a detailed breakdown.
          </p>
        </div>

        <GovernanceAtlas />

        {/* Data sources */}
        <div className="mt-8 text-xs text-slate-400 space-y-0.5">
          <p>Data: Election Commission of India · Census 2021 (population) · Delimitation Commission (seats)</p>
          <p>Bubble centroids are approximate geographic centres for each state/UT.</p>
        </div>
      </div>
    </main>
  );
}
