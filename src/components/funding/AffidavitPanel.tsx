"use client";

import { useState } from "react";
import { MP_AFFIDAVITS, FUNDING_STATS } from "@/data/funding";
import type { MPAffidavit } from "@/data/funding";

type SortKey = "totalAssetsCr" | "netAssetsCr" | "liabilitiesCr" | "assetGrowthPct" | "criminalCases";
type Tab = "assets" | "criminal" | "growth";

const PARTY_COLORS: Record<string, string> = {
  BJP:    "#f97316",
  INC:    "#3b82f6",
  BRS:    "#eab308",
  TMC:    "#22c55e",
  DMK:    "#ef4444",
  YSRCP:  "#8b5cf6",
  BJD:    "#06b6d4",
  SP:     "#dc2626",
  "JD(U)":"#16a34a",
};

const MAX_ASSETS = Math.max(...MP_AFFIDAVITS.map((m) => m.totalAssetsCr));

export function AffidavitPanel() {
  const [tab, setTab] = useState<Tab>("assets");
  const [sortKey, setSortKey] = useState<SortKey>("totalAssetsCr");
  const [selectedMP, setSelectedMP] = useState<MPAffidavit | null>(null);
  const [partyFilter, setPartyFilter] = useState<string | null>(null);

  const parties = Array.from(new Set(MP_AFFIDAVITS.map((m) => m.party)));
  const filtered = MP_AFFIDAVITS
    .filter((m) => !partyFilter || m.party === partyFilter)
    .sort((a, b) => b[sortKey] - a[sortKey]);

  return (
    <div className="space-y-5">
      {/* Aggregate stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "MPs who are crorepatis", value: `${FUNDING_STATS.mpsAsCrorepatis}/543`, sub: "93% of 18th Lok Sabha" },
          { label: "MPs with criminal cases", value: `${FUNDING_STATS.mpsWithCriminalCases}/543`, sub: "46% (ADR 2024)" },
          { label: "Avg declared assets", value: `₹${FUNDING_STATS.avgAssetsCr} cr`, sub: "Per MP, self-reported" },
          { label: "Expense limit per MP", value: "₹97.5 lakh", sub: "Lok Sabha (2024 limit)" },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="font-display font-bold text-slate-900 dark:text-slate-100 text-lg">{s.value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
            <div className="text-[9px] text-slate-400">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Context */}
      <div className="card p-4 border-l-4 border-violet-400 bg-violet-50/40 dark:bg-violet-950/10">
        <div className="text-xs font-bold text-violet-700 dark:text-violet-300 mb-1">Affidavit disclosure system</div>
        <p className="text-xs text-violet-700 dark:text-violet-400 leading-relaxed">
          Since 2003 (SC order in <em>Union of India v. Association for Democratic Reforms</em>), all candidates must file affidavits declaring assets, liabilities, criminal cases, and educational qualifications. These are publicly available at <strong>myneta.info</strong>. The data below is composite/illustrative based on ADR's aggregate analysis of 18th Lok Sabha (2024) affidavits.
        </p>
        <div className="mt-2 font-mono text-[10px] text-violet-500">Section 33A, Representation of People Act · Rule 4A, Conduct of Election Rules</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {([["assets", "Asset Rankings"], ["criminal", "Criminal Cases"], ["growth", "Wealth Growth"]] as [Tab, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${tab === id ? "border-violet-500 text-violet-600 dark:text-violet-400" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Party filter */}
      <div className="flex gap-1.5 flex-wrap items-center">
        <span className="text-[10px] text-slate-400">Party:</span>
        {["All", ...parties].map((p) => {
          const color = PARTY_COLORS[p];
          return (
            <button key={p} onClick={() => setPartyFilter(p === "All" ? null : p)}
              className={`px-2.5 py-0.5 text-[10px] rounded-full font-medium transition-colors ${(p === "All" && !partyFilter) || partyFilter === p ? "text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
              style={p !== "All" && partyFilter === p ? { backgroundColor: color } : undefined}>
              {p}
            </button>
          );
        })}
      </div>

      {/* ── Asset Rankings ── */}
      {tab === "assets" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap items-center text-[10px] text-slate-400">
            Sort by:
            {([["totalAssetsCr", "Total Assets"], ["netAssetsCr", "Net Assets"], ["liabilitiesCr", "Liabilities"]] as [SortKey, string][]).map(([k, l]) => (
              <button key={k} onClick={() => setSortKey(k)}
                className={`px-2 py-0.5 rounded ${sortKey === k ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                {l}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((mp, i) => {
              const barPct = (mp.totalAssetsCr / MAX_ASSETS) * 100;
              const partyColor = PARTY_COLORS[mp.party] ?? "#94a3b8";
              return (
                <button key={mp.id} onClick={() => setSelectedMP(mp === selectedMP ? null : mp)}
                  className={`w-full card p-4 text-left transition-all hover:shadow-md ${selectedMP?.id === mp.id ? "ring-2 ring-violet-400" : ""}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-slate-400 font-mono text-[10px] w-5 shrink-0">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{mp.name}</div>
                      <div className="text-[10px] text-slate-400">{mp.constituency} · {mp.state}</div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full text-white font-bold shrink-0" style={{ backgroundColor: partyColor }}>{mp.party}</span>
                    <div className="text-right shrink-0">
                      <div className="font-display font-bold text-slate-900 dark:text-slate-100">₹{mp.totalAssetsCr} cr</div>
                      <div className="text-[9px] text-slate-400">Net: ₹{mp.netAssetsCr} cr</div>
                    </div>
                  </div>

                  {/* Asset bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${barPct}%`, backgroundColor: partyColor }} />
                    </div>
                    {mp.liabilitiesCr > 0 && (
                      <div className="text-[9px] text-slate-400 shrink-0">Debt: ₹{mp.liabilitiesCr} cr</div>
                    )}
                  </div>

                  {/* Expanded detail */}
                  {selectedMP?.id === mp.id && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <div className="text-slate-400 mb-1">Assets breakdown</div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between"><span>Total assets</span><strong>₹{mp.totalAssetsCr} cr</strong></div>
                          <div className="flex justify-between"><span>Liabilities</span><span className="text-red-500">₹{mp.liabilitiesCr} cr</span></div>
                          <div className="flex justify-between"><span>Net worth</span><strong className="text-emerald-600">₹{mp.netAssetsCr} cr</strong></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1">Background</div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between"><span>Education</span><strong>{mp.education}</strong></div>
                          <div className="flex justify-between"><span>Age</span><strong>{mp.age} yrs</strong></div>
                          <div className="flex justify-between"><span>MP since</span><strong>{mp.termsSince}</strong></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1">Legal</div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between"><span>Criminal cases</span>
                            <strong className={mp.criminalCases > 0 ? "text-amber-600" : "text-emerald-600"}>{mp.criminalCases}</strong></div>
                          <div className="flex justify-between"><span>Serious cases</span>
                            <strong className={mp.seriousCriminalCases > 0 ? "text-red-600" : "text-emerald-600"}>{mp.seriousCriminalCases}</strong></div>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="text-[10px] text-slate-400 text-center">Source: ADR analysis of 18th Lok Sabha affidavits (2024). Entries are composite/illustrative — see myneta.info for individual MP data.</div>
        </div>
      )}

      {/* ── Criminal Cases ── */}
      {tab === "criminal" && (
        <div className="space-y-4">
          {/* Distribution visual */}
          <div className="card p-5">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-4">Criminal Case Distribution — 18th Lok Sabha</div>
            <div className="space-y-3">
              {[
                { label: "No criminal cases", value: 292, total: 543, color: "#22c55e" },
                { label: "1–3 cases", value: 142, total: 543, color: "#f59e0b" },
                { label: "4–9 cases", value: 68, total: 543, color: "#f97316" },
                { label: "10+ cases", value: 41, total: 543, color: "#ef4444" },
              ].map((row) => {
                const pct = (row.value / row.total) * 100;
                return (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">{row.label}</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{row.value} MPs ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: row.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MPs with cases in data */}
          <div className="text-xs font-semibold text-slate-500 uppercase">Illustrative entries with declared cases</div>
          <div className="space-y-2">
            {filtered.filter((m) => m.criminalCases > 0).sort((a, b) => b.criminalCases - a.criminalCases).map((mp) => {
              const partyColor = PARTY_COLORS[mp.party] ?? "#94a3b8";
              return (
                <div key={mp.id} className={`card p-4 border-l-4 ${mp.seriousCriminalCases > 0 ? "border-red-400" : "border-amber-400"}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{mp.name}</div>
                      <div className="text-[10px] text-slate-400">{mp.constituency}</div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full text-white font-bold shrink-0" style={{ backgroundColor: partyColor }}>{mp.party}</span>
                    <div className="text-right shrink-0 space-y-0.5">
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white ${mp.seriousCriminalCases > 0 ? "bg-red-500" : "bg-amber-500"}`}>
                        {mp.criminalCases} cases
                      </div>
                      {mp.seriousCriminalCases > 0 && (
                        <div className="text-[9px] text-red-500 font-bold">{mp.seriousCriminalCases} serious</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legal note */}
          <div className="card p-4 bg-red-50/30 dark:bg-red-950/10 border border-red-200 dark:border-red-900">
            <div className="text-xs font-bold text-red-700 dark:text-red-400 mb-1">Legal status: Presumption of innocence</div>
            <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
              Filing of criminal cases does not imply guilt. An MP is disqualified only upon conviction with imprisonment ≥ 2 years (Section 8, RPA 1951). The SC in <em>Lily Thomas (2013)</em> struck down the provision that allowed convicted MPs to continue by appealing, requiring immediate disqualification.
            </p>
          </div>
        </div>
      )}

      {/* ── Wealth Growth ── */}
      {tab === "growth" && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 leading-relaxed">
            Asset growth % compares declared assets between last two elections (ADR analysis). High growth alone is not evidence of wrongdoing — it may reflect legitimate investments, inheritance, or inflation.
          </div>

          <div className="space-y-2">
            {filtered.sort((a, b) => b.assetGrowthPct - a.assetGrowthPct).map((mp) => {
              const partyColor = PARTY_COLORS[mp.party] ?? "#94a3b8";
              const isHighGrowth = mp.assetGrowthPct > 200;
              return (
                <div key={mp.id} className="card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{mp.name}</div>
                      <div className="text-[10px] text-slate-400">{mp.constituency} · Since {mp.termsSince}</div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full text-white font-bold shrink-0" style={{ backgroundColor: partyColor }}>{mp.party}</span>
                    <div className={`text-right font-display font-bold text-lg shrink-0 ${isHighGrowth ? "text-red-500" : "text-slate-700 dark:text-slate-300"}`}>
                      +{mp.assetGrowthPct}%
                    </div>
                  </div>

                  {/* Growth bar */}
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${isHighGrowth ? "bg-red-400" : "bg-amber-400"}`}
                      style={{ width: `${Math.min((mp.assetGrowthPct / 400) * 100, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                    <span>Current: ₹{mp.totalAssetsCr} cr</span>
                    <span>Prior: ₹{(mp.totalAssetsCr / (1 + mp.assetGrowthPct / 100)).toFixed(1)} cr</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aggregate insight */}
          <div className="card p-4 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-200 dark:border-indigo-900">
            <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">ADR Aggregate Finding (18th Lok Sabha, 2024)</div>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
              The average assets of re-elected MPs grew by <strong>182%</strong> between the 2019 and 2024 elections. While market appreciation, business growth, and inheritance explain some of this, ADR flags cases where growth cannot be accounted for by known sources of income as warranting scrutiny.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
