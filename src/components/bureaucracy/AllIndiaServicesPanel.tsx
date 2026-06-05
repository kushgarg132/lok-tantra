"use client";

import { useState } from "react";
import { ALL_INDIA_SERVICES, CENTRAL_SERVICES } from "@/data/bureaucracy/intelligence";

export function AllIndiaServicesPanel() {
  const [selected, setSelected] = useState<string>("ias");

  const service = ALL_INDIA_SERVICES.find((s) => s.id === selected)!;

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="card p-5 border-l-4 border-l-indigo-500 bg-indigo-50 dark:bg-indigo-950/20">
        <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm mb-1">All India Services &amp; Central Services</h3>
        <p className="text-xs text-indigo-800 dark:text-indigo-400 leading-relaxed">
          India has 3 All India Services (IAS, IPS, IFoS) whose officers serve both state governments and the Centre. Separately, Central Services (IFS, IRS, IAAS, etc.) serve only the Central government. All are recruited by UPSC.
        </p>
      </div>

      {/* All India Services */}
      <div>
        <div className="text-xs text-slate-400 uppercase font-semibold mb-3 tracking-wide">All India Services (Art. 312)</div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {ALL_INDIA_SERVICES.map((svc) => (
            <button key={svc.id} onClick={() => setSelected(svc.id)}
              className={`px-4 py-2 text-xs rounded-lg font-medium transition-colors border ${selected === svc.id ? "text-white border-transparent" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`}
              style={selected === svc.id ? { backgroundColor: svc.color, borderColor: svc.color } : {}}>
              {svc.abbr} — {svc.name.replace("Indian ", "")}
            </button>
          ))}
        </div>

        {service && (
          <div className="card p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-display font-bold shadow-md shrink-0"
                style={{ backgroundColor: service.color }}>
                {service.abbr}
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">{service.name}</h3>
                <div className="text-xs text-slate-500 mt-0.5">{service.role}</div>
                <div className="flex gap-3 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">Intake: {service.intake}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">Exam: {service.exam}</span>
                </div>
              </div>
              <div className="ml-auto text-right shrink-0">
                <div className="text-[10px] text-slate-400 mb-0.5">Top post</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[140px] text-right">{service.topPost}</div>
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{service.description}</p>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Key Facts</div>
              <div className="space-y-2">
                {service.keyFacts.map((fact) => (
                  <div key={fact} className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 mt-0.5" style={{ color: service.color }}>
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {fact}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2 font-mono">
              Cadre allocation: {service.cadre}
            </div>
          </div>
        )}
      </div>

      {/* Central Services */}
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

      {/* UPSC recruitment note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
        <div className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">UPSC: One Exam, Many Services</div>
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          The UPSC Civil Services Examination (CSE) is conducted annually and selects candidates for all three All India Services plus most Central Services. About 11 lakh candidates register, ~5 lakh write the preliminary exam, ~15,000 write the mains, ~2,500 appear for personality test (interview), and ~900–1,000 are finally selected each year.
          The IFoS (Indian Forest Service) has a separate exam with the same preliminary stage but different mains syllabus.
        </p>
      </div>
    </div>
  );
}
