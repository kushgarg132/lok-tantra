"use client";

import { useState } from "react";
import type { CivilServiceDB } from "./BureaucracyDashboard";

// Abbreviation lookup by name substring
const SERVICE_META: Record<string, { abbr: string; color: string }> = {
  "Administrative": { abbr: "IAS", color: "#1565C0" },
  "Police":         { abbr: "IPS", color: "#1B5E20" },
  "Forest":         { abbr: "IFoS", color: "#2E7D32" },
  "Foreign":        { abbr: "IFS", color: "#4A148C" },
  "Revenue":        { abbr: "IRS", color: "#BF360C" },
};

function getMeta(name: string) {
  for (const [key, meta] of Object.entries(SERVICE_META)) {
    if (name.includes(key)) return meta;
  }
  const abbrMatch = name.match(/\(([A-Z]+)\)/);
  return { abbr: abbrMatch?.[1] ?? "GOI", color: "#374151" };
}

// Static Central Services table (not in DB)
const CENTRAL_SERVICES = [
  { abbr: "IFS (B)",  name: "Indian Foreign Service (B)",         ministry: "External Affairs",     topPost: "Ambassador / High Commissioner" },
  { abbr: "IRS (IT)", name: "Indian Revenue Service (Income Tax)", ministry: "Finance (CBDT)",       topPost: "Member, CBDT" },
  { abbr: "IRS (CE)", name: "Indian Revenue Service (Customs)",    ministry: "Finance (CBIC)",       topPost: "Member, CBIC" },
  { abbr: "IAAS",     name: "Indian Audit & Accounts Service",     ministry: "C&AG",                 topPost: "Deputy C&AG" },
  { abbr: "IDAS",     name: "Indian Defence Accounts Service",     ministry: "Defence",              topPost: "CGDA" },
  { abbr: "IRTS",     name: "Indian Railway Traffic Service",      ministry: "Railways",             topPost: "Railway Board Member" },
  { abbr: "IRAS",     name: "Indian Railway Accounts Service",     ministry: "Railways",             topPost: "Railway Board Member (Finance)" },
  { abbr: "IPoS",     name: "Indian Postal Service",               ministry: "Communications",       topPost: "Director General, Posts" },
];

interface Props { services: CivilServiceDB[] }

export function AllIndiaServicesPanel({ services }: Props) {
  const [selected, setSelected] = useState<string | null>(services[0]?.id ?? null);

  const sel = services.find((s) => s.id === selected);

  return (
    <div className="space-y-6">
      <div className="card p-5 border-l-4 border-l-indigo-500 bg-indigo-50 dark:bg-indigo-950/20">
        <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm mb-1">All India Services &amp; Central Services</h3>
        <p className="text-xs text-indigo-800 dark:text-indigo-400 leading-relaxed">
          India has 3 All India Services (IAS, IPS, IFoS) whose officers serve both state governments and the Centre. Separately, Central Services (IFS, IRS, IAAS, etc.) serve only the Central government. All are recruited by UPSC.
        </p>
      </div>

      {services.length > 0 ? (
        <div>
          <div className="text-xs text-slate-400 uppercase font-semibold mb-3 tracking-wide">Civil Services (Art. 312)</div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {services.map((svc) => {
              const meta = getMeta(svc.name);
              const isActive = selected === svc.id;
              return (
                <button key={svc.id} onClick={() => setSelected(isActive ? null : svc.id)}
                  className={`px-4 py-2 text-xs rounded-lg font-medium transition-colors border ${isActive ? "text-white border-transparent" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`}
                  style={isActive ? { backgroundColor: meta.color, borderColor: meta.color } : {}}>
                  {meta.abbr}
                </button>
              );
            })}
          </div>

          {sel && (() => {
            const meta = getMeta(sel.name);
            return (
              <div className="card p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-display font-bold shadow-md shrink-0"
                    style={{ backgroundColor: meta.color }}>
                    {meta.abbr}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">{sel.name}</h3>
                    <div className="flex gap-3 mt-2 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">Exam: {sel.exam}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">Cadre: {sel.cadre}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{sel.description}</p>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="card p-6 text-center text-slate-400 text-sm">
          Run <code className="font-mono text-xs">npm run db:seed</code> to populate service data.
        </div>
      )}

      <div>
        <div className="text-xs text-slate-400 uppercase font-semibold mb-3 tracking-wide">Central Services (serve only Central Govt)</div>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Service</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Ministry</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Top Post</th>
                </tr>
              </thead>
              <tbody>
                {CENTRAL_SERVICES.map((svc) => (
                  <tr key={svc.abbr} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-medium text-xs text-slate-900 dark:text-slate-100">{svc.abbr}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 hidden xs:block">{svc.name}</div>
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-500 hidden sm:table-cell">{svc.ministry}</td>
                    <td className="py-3 px-3 text-xs text-slate-600 dark:text-slate-400">{svc.topPost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
        <div className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">UPSC: One Exam, Many Services</div>
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          The UPSC Civil Services Examination (CSE) is conducted annually and selects candidates for all three All India Services plus most Central Services. About 11 lakh candidates register, ~5 lakh write the preliminary exam, ~15,000 write the mains, ~2,500 appear for interview, and ~900–1,000 are finally selected each year.
        </p>
      </div>
    </div>
  );
}
