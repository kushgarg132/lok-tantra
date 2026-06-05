import Link from "next/link";
import { SearchBar } from "@/components/home/SearchBar";
import { QuickStats } from "@/components/home/QuickStats";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { PowerPreview } from "@/components/home/PowerPreview";
import { ConstitutionPreview } from "@/components/home/ConstitutionPreview";
import { HowDemocracyWorks } from "@/components/home/HowDemocracyWorks";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-saffron-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-400 text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-saffron-500 animate-pulse" />
              Open-source civic intelligence platform
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight animate-slide-up">
              Understand Indian{" "}
              <span className="bg-gradient-to-r from-saffron-500 via-saffron-600 to-chakra-500 bg-clip-text text-transparent">
                Democracy
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-slide-up">
              Explore how power flows, who governs, how laws are made, and how
              you can participate. The most comprehensive platform for Indian
              governance education.
            </p>

            {/* Search */}
            <div className="mt-8 animate-slide-up">
              <SearchBar />
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-slide-up">
              <Link
                href="/power-structure"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-500 text-white font-medium text-sm hover:bg-saffron-600 transition-colors shadow-lg shadow-saffron-500/25"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="5" r="3" />
                  <line x1="12" y1="8" x2="12" y2="14" />
                  <circle cx="6" cy="19" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="12" y1="14" x2="6" y2="16" />
                  <line x1="12" y1="14" x2="18" y2="16" />
                </svg>
                Explore Power Structure
              </Link>
              <Link
                href="/constitution"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm border border-slate-200 dark:border-slate-700 hover:border-saffron-300 dark:hover:border-saffron-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                Read Constitution
              </Link>
              <Link
                href="/representatives"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm border border-slate-200 dark:border-slate-700 hover:border-saffron-300 dark:hover:border-saffron-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Find My Representatives
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <QuickStats />

      {/* How Democracy Works - Visual Flow */}
      <HowDemocracyWorks />

      {/* Feature Grid */}
      <FeatureGrid />

      {/* Power Structure Preview */}
      <PowerPreview />

      {/* Constitution Preview */}
      <ConstitutionPreview />
    </div>
  );
}
