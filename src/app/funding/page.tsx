import type { Metadata } from "next";
import { FundingDashboard } from "@/components/funding/FundingDashboard";

export const metadata: Metadata = {
  title: "Political Funding & Transparency",
  description: "Track electoral bonds, corporate donations, MP affidavits, and political influence networks — complete transparency data for Indian democracy.",
};

export default function FundingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-saffron">Transparency</span>
            <span className="badge-navy">4 Datasets</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Political Funding & Transparency
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Follow the money in Indian politics — electoral bonds, corporate donation flows, MP affidavits,
            and the network connecting donors to parties to policy decisions.
          </p>
          <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">
            <div className="flex items-center gap-2"><span>🏦</span> ₹16,518 cr in electoral bonds (2018–2024)</div>
            <div className="flex items-center gap-2"><span>📄</span> MP-declared assets and criminal cases</div>
            <div className="flex items-center gap-2"><span>🕸️</span> Donor → party → policy influence network</div>
            <div className="flex items-center gap-2"><span>⚖️</span> SC struck bonds down — Feb 2024</div>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <FundingDashboard />
      </div>
    </div>
  );
}
