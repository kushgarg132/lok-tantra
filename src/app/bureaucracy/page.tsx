import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Bureaucracy",
  description: "Understand India's administrative machinery — IAS, IPS, IFS, ministry structure, and district administration",
};

export default async function BureaucracyPage() {
  const [centralLevels, districtLevels, civilServices, ministries] = await Promise.all([
    prisma.bureaucraticLevel.findMany({ where: { hierarchy: "central_secretariat" }, orderBy: { level: "asc" } }),
    prisma.bureaucraticLevel.findMany({ where: { hierarchy: "district_administration" }, orderBy: { level: "asc" } }),
    prisma.civilService.findMany({ orderBy: { name: "asc" } }),
    prisma.ministry.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
            The Administrative Machinery
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            The permanent executive that runs India — from the Cabinet Secretary in Delhi to the
            Village Level Worker. Understand how policy becomes reality.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-12">
        <section>
          <h2 className="section-heading mb-6">Central Secretariat Hierarchy</h2>
          <div className="max-w-2xl space-y-2">
            {centralLevels.map((level, i) => (
              <div key={level.id}>
                {i > 0 && (
                  <div className="flex justify-center py-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-300">
                      <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                <div className="card p-4 flex items-center gap-4" style={{ marginLeft: `${i * 16}px` }}>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
                    {level.level}
                  </div>
                  <div>
                    <div className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">{level.title}</div>
                    <div className="text-xs text-slate-500">{level.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-heading mb-6">District Administration Hierarchy</h2>
          <div className="max-w-2xl space-y-2">
            {districtLevels.map((level, i) => (
              <div key={level.id}>
                {i > 0 && (
                  <div className="flex justify-center py-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-300">
                      <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                <div className="card p-4 flex items-center gap-4" style={{ marginLeft: `${i * 16}px` }}>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    {level.level}
                  </div>
                  <div>
                    <div className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">{level.title}</div>
                    <div className="text-xs text-slate-500">{level.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-heading mb-6">All-India Services</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {civilServices.map((service) => (
              <div key={service.id} className="card p-5">
                <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">{service.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{service.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                  <span>Exam: <strong>{service.exam}</strong></span>
                  <span>Cadre: <strong>{service.cadre}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-heading mb-6">Union Ministries</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ministries.map((m) => (
              <div key={m.id} className="card p-4">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{m.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{m.department}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
