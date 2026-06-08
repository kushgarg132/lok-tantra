import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ElectionDashboard } from "@/components/elections/ElectionDashboard";
import type { Prisma } from "@prisma/client";

type AssemblyElection = Prisma.StateAssemblyElectionGetPayload<Record<string, never>>;

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Election Intelligence — LokTantra",
  description: "Lok Sabha & Rajya Sabha analytics, parliament diagrams, coalition maps, vote share analysis, state election results, turnout heatmaps, and constituency data from 1952 to 2024.",
};

type PartyResult = Prisma.PartyElectionResultGetPayload<Record<string, never>>;
type HistorySummary = Prisma.ElectionSummaryGetPayload<Record<string, never>>;
type StateResult = Prisma.StateElectionResultGetPayload<Record<string, never>>;

export default async function ElectionsPage() {
  const [partyResults, history, stateResults, assemblyElections] = await Promise.all([
    prisma.partyElectionResult.findMany({
      where: { type: "lok_sabha" },
      orderBy: [{ year: "desc" }, { seats: "desc" }],
    }).catch((): PartyResult[] => []),
    prisma.electionSummary.findMany({
      where: { type: "lok_sabha" },
      orderBy: { year: "asc" },
    }).catch((): HistorySummary[] => []),
    prisma.stateElectionResult.findMany({
      where: { year: 2024, type: "lok_sabha" },
      orderBy: { seats: "desc" },
    }).catch((): StateResult[] => []),
    prisma.stateAssemblyElection.findMany({
      orderBy: [{ year: "desc" }, { totalSeats: "desc" }],
    }).catch((): AssemblyElection[] => []),
  ]);

  const latestYear = history[history.length - 1]?.year ?? 2024;

  const currentResults = partyResults
    .filter((r) => r.year === latestYear)
    .map((r) => ({ party: r.party, color: r.color, seats: r.seats, voteShare: r.voteShare }));

  const electionHistory = history.map((h) => ({
    year: h.year,
    totalSeats: h.totalSeats,
    majorWinner: h.majorWinner,
    majorSeats: h.majorSeats,
    turnout: h.turnout ?? 0,
  }));

  // Historical per-party breakdown for charts
  const partyHistory = (["INC", "BJP", "Left", "SP"] as const).reduce<
    Record<string, { year: number; seats: number; voteShare: number }[]>
  >((acc, p) => {
    acc[p] = partyResults
      .filter((r) => r.party === p)
      .map((r) => ({ year: r.year, seats: r.seats, voteShare: r.voteShare ?? 0 }))
      .sort((a, b) => a.year - b.year);
    return acc;
  }, {});

  const stateElectionResults = stateResults.map((s) => ({
    state: s.state,
    code: s.code,
    seats: s.seats,
    dominant: s.dominant,
    dominantColor: s.dominantColor,
    dominantSeats: s.dominantSeats,
    alliance: s.alliance as "NDA" | "INDIA" | "Other",
    turnout: s.turnout,
    ndaSeats: s.ndaSeats,
    indiaSeats: s.indiaSeats,
    otherSeats: s.otherSeats,
  }));

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-saffron">Analytics</span>
            <span className="badge-navy">{history.length} General Elections</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Election Intelligence
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Parliament diagrams, coalition analysis, vote share vs seat share, state election heatmaps,
            Rajya Sabha composition, turnout analytics, and constituency deep-dives — all in one place.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {["Parliament Diagram", "Coalition Map", "Party History", "Turnout Heatmap", "Vote Share", "Rajya Sabha", "State Elections", "Constituencies"].map((f) => (
              <span key={f} className="px-3 py-1 text-xs rounded-full bg-purple-100 dark:bg-white/10 text-purple-700 dark:text-slate-300 border border-purple-200 dark:border-white/10">{f}</span>
            ))}
          </div>
        </div>
      </section>

      <ElectionDashboard
        currentResults={currentResults}
        electionHistory={electionHistory}
        partyHistory={partyHistory}
        stateElectionResults={stateElectionResults}
        assemblyElections={assemblyElections}
        latestYear={latestYear}
      />
    </div>
  );
}
