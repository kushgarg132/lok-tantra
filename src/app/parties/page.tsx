import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const revalidate = 3600; // Party data (seats, ideology) changes at most every hour

export const metadata: Metadata = {
  title: "Political Parties",
  description: "Explore India's political parties — ideologies, leadership, electoral performance, and alliances",
};

export default async function PartiesPage() {
  const [parties, ideologySpectrum] = await Promise.all([
    prisma.politicalParty.findMany({ orderBy: { name: "asc" } }).catch(() => []),
    prisma.ideologyPosition.findMany({ orderBy: { order: "asc" } }).catch(() => []),
  ]);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            Political Parties of India
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Explore India&apos;s multi-party system — ideologies, leadership, electoral strength, and coalition dynamics.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Ideology Spectrum */}
        <section>
          <h2 className="section-heading mb-6">Political Ideology Spectrum</h2>
          <div className="card p-6 overflow-x-auto">
            <div className="flex gap-0 min-w-[600px]">
              {ideologySpectrum.map((pos) => (
                <div key={pos.id} className="flex-1 text-center p-3 border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                  <div className="text-xs font-semibold text-slate-500 uppercase">{pos.position}</div>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {pos.parties.map((p) => (
                      <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{p}</span>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{pos.description}</div>
                </div>
              ))}
            </div>
            <div className="h-2 rounded-full mt-3 min-w-[600px]" style={{ background: "linear-gradient(to right, #ef4444, #f59e0b, #22c55e, #3b82f6, #8b5cf6, #ef4444)" }} />
          </div>
        </section>

        {/* Party Cards */}
        <section>
          <h2 className="section-heading mb-6">Major Parties</h2>
          <div className="space-y-4">
            {parties.map((party) => {
              const seats = party.currentSeats as { ls?: number; rs?: number } | null;
              return (
                <div key={party.id} className="card p-6" style={{ borderLeft: `4px solid ${party.color}` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ backgroundColor: party.color }}>
                      {party.abbreviation}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-display font-bold text-slate-900 dark:text-slate-100">{party.name}</h3>
                        <span className="text-sm text-slate-500">({party.abbreviation})</span>
                        <span className="badge text-[10px]" style={{ backgroundColor: `${party.color}20`, color: party.color }}>{party.type}</span>
                      </div>
                      {party.history && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{party.history}</p>}
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-xs text-slate-400">Founded</span>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{party.founded ?? "—"}</div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400">President</span>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{party.president ?? "—"}</div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400">Lok Sabha Seats</span>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{seats?.ls ?? "—"}</div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400">Rajya Sabha Seats</span>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{seats?.rs ?? "—"}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {party.ideology.map((i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">{i}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
