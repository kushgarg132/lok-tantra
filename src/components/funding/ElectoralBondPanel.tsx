"use client";

import { useState } from "react";
import { BOND_PARTY_RECEIPTS, BOND_DONORS, BOND_PHASES, FUNDING_STATS } from "@/data/funding";

type Tab = "receipts" | "donors" | "timeline";

const MAX_RECEIPT = Math.max(...BOND_PARTY_RECEIPTS.map((p) => p.totalCr));
const MAX_PHASE = Math.max(...BOND_PHASES.map((p) => p.totalIssuedCr));
const TOTAL = BOND_PARTY_RECEIPTS.reduce((a, p) => a + p.totalCr, 0);

export function ElectoralBondPanel() {
  const [tab, setTab] = useState<Tab>("receipts");
  const [selectedDonor, setSelectedDonor] = useState<string | null>(null);
  const [selectedParty, setSelectedParty] = useState<string | null>(null);

  const selectedDonorData = BOND_DONORS.find((d) => d.name === selectedDonor);
  const filteredPartyReceipts = selectedParty
    ? BOND_PARTY_RECEIPTS.filter((p) => p.shortName === selectedParty)
    : BOND_PARTY_RECEIPTS;

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total bonds sold", value: `₹${(FUNDING_STATS.totalBondSoldCr / 100).toFixed(0)}B`, sub: "2018–2024" },
          { label: "Phases", value: FUNDING_STATS.totalPhases, sub: "10 days each" },
          { label: "Struck down by SC", value: "Feb 2024", sub: "Violates Art. 19(1)(a)" },
          { label: "BJP's share", value: "47.5%", sub: "₹6,566 cr" },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="font-display font-bold text-slate-900 dark:text-slate-100 text-xl">{s.value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
            <div className="text-[9px] text-slate-400">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Context card */}
      <div className="card p-4 border-l-4 border-amber-400 bg-amber-50/50 dark:bg-amber-950/10">
        <div className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">What were Electoral Bonds?</div>
        <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
          Electoral bonds were bearer instruments issued by SBI that let donors anonymously fund political parties. Introduced in 2018, they shielded donor identity from public disclosure. The Supreme Court unanimously struck them down on 13 Feb 2024 in <em>Association for Democratic Reforms v. Union of India</em>, ruling they violated voters' right to information under Art. 19(1)(a). The scheme allowed quid pro quo between government and business without accountability.
        </p>
        <div className="mt-2 font-mono text-[10px] text-amber-600 dark:text-amber-500">Section 31(3), RBI Act · Finance Act 2017 (amendment) · Art. 19(1)(a) Constitution</div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {([["receipts", "Party Receipts"], ["donors", "Top Donors"], ["timeline", "Phase Timeline"]] as [Tab, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${tab === id ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Party Receipts ── */}
      {tab === "receipts" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500">Filter by party:</span>
            {["All", ...BOND_PARTY_RECEIPTS.map((p) => p.shortName)].map((p) => (
              <button key={p} onClick={() => setSelectedParty(p === "All" ? null : p)}
                className={`px-2.5 py-1 text-[10px] rounded-full font-medium transition-colors ${(p === "All" && !selectedParty) || selectedParty === p ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                {p}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {BOND_PARTY_RECEIPTS.map((party) => {
              const pct = (party.totalCr / TOTAL) * 100;
              const barPct = (party.totalCr / MAX_RECEIPT) * 100;
              if (selectedParty && party.shortName !== selectedParty) return null;
              return (
                <div key={party.party} className="card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ backgroundColor: party.color }}>
                      {party.shortName.slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{party.party}</div>
                      <div className="text-[10px] text-slate-400">{party.ideology} · {party.phasesActive} phases</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display font-bold text-slate-900 dark:text-slate-100">₹{party.totalCr.toLocaleString("en-IN")} cr</div>
                      <div className="text-[10px] text-slate-400">{pct.toFixed(1)}% of total</div>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${barPct}%`, backgroundColor: party.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 text-center">
            Source: SBI (Supreme Court-mandated disclosure, March 2024) · Total: ₹{TOTAL.toLocaleString("en-IN")} crore
          </div>
        </div>
      )}

      {/* ── Top Donors ── */}
      {tab === "donors" && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {BOND_DONORS.map((donor) => (
              <button key={donor.name} onClick={() => setSelectedDonor(donor.name === selectedDonor ? null : donor.name)}
                className={`card p-4 text-left transition-all hover:shadow-md ${selectedDonor === donor.name ? "ring-2 ring-indigo-400" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: donor.sectorColor }}>
                    {donor.sector.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">{donor.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: donor.sectorColor + "20", color: donor.sectorColor }}>{donor.sector}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Primary: {donor.primaryParty}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display font-bold text-slate-900 dark:text-slate-100">₹{donor.totalCr.toLocaleString("en-IN")} cr</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Donor detail drawer */}
          {selectedDonorData && (
            <div className="card p-5 border-2 border-indigo-300 dark:border-indigo-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: selectedDonorData.sectorColor }}>
                  {selectedDonorData.sector.slice(0, 2)}
                </div>
                <div>
                  <div className="font-display font-bold text-slate-900 dark:text-slate-100">{selectedDonorData.name}</div>
                  <div className="text-xs text-slate-400">{selectedDonorData.sector}</div>
                </div>
                <div className="ml-auto">
                  <div className="font-display font-bold text-2xl text-slate-900 dark:text-slate-100">₹{selectedDonorData.totalCr.toLocaleString("en-IN")} cr</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-slate-500 shrink-0 w-28">Primary recipient</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{selectedDonorData.primaryParty}</span>
                </div>
                {selectedDonorData.knownIssues && (
                  <div className="flex gap-2">
                    <span className="text-slate-500 shrink-0 w-28">Notable context</span>
                    <span className="text-amber-700 dark:text-amber-400 text-xs leading-relaxed">{selectedDonorData.knownIssues}</span>
                  </div>
                )}
              </div>

              {selectedDonorData.knownIssues && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
                  <strong>Transparency concern:</strong> The SC noted that anonymous donations create a conflict of interest when companies face regulatory or enforcement action — removing accountability for quid pro quo arrangements.
                </div>
              )}
            </div>
          )}

          {/* Sector breakdown donut (SVG) */}
          <div className="card p-5">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-4">Donations by Sector (top 12 donors)</div>
            <SectorDonut />
          </div>
        </div>
      )}

      {/* ── Phase Timeline ── */}
      {tab === "timeline" && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-4">Bond Issuance by Phase</div>
            <div className="space-y-2">
              {BOND_PHASES.map((phase) => {
                const pct = (phase.totalIssuedCr / MAX_PHASE) * 100;
                const isElectionYear = [2019, 2024].includes(phase.year);
                return (
                  <div key={phase.phase} className="flex items-center gap-3">
                    <div className="text-[10px] text-slate-400 w-20 shrink-0 text-right">{phase.months}</div>
                    <div className="flex-1 relative h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                      <div className={`h-full rounded-lg transition-all ${isElectionYear ? "bg-red-400" : "bg-indigo-400"}`}
                        style={{ width: `${pct}%` }} />
                      <div className="absolute inset-0 flex items-center px-2">
                        <span className="text-[9px] font-mono font-bold text-white mix-blend-luminosity">₹{phase.totalIssuedCr.toLocaleString("en-IN")} cr</span>
                      </div>
                    </div>
                    {isElectionYear && <span className="text-[9px] text-red-500 font-bold shrink-0">Election ▲</span>}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex gap-4 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-400 inline-block" />Regular phase</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400 inline-block" />Election year peak</span>
            </div>
          </div>

          {/* Year-wise totals */}
          <div className="card p-5">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Year-wise Totals</div>
            <div className="space-y-2">
              {Object.entries(
                BOND_PHASES.reduce<Record<number, number>>((acc, p) => ({ ...acc, [p.year]: (acc[p.year] ?? 0) + p.totalIssuedCr }), {})
              ).map(([year, total]) => {
                const pct = (total / 6000) * 100;
                return (
                  <div key={year} className="flex items-center gap-3">
                    <div className="text-xs font-mono text-slate-500 w-10 shrink-0">{year}</div>
                    <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                      <div className="h-full bg-gradient-to-r from-saffron-400 to-saffron-600 rounded-lg transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                      <span className="absolute inset-0 flex items-center px-2 text-[9px] font-mono text-white mix-blend-luminosity">₹{total.toLocaleString("en-IN")} cr</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-400">
              <strong>2024 spike:</strong> ₹3,427 crore in the Jan 2024 phase alone — just months before the General Election. The scheme was available for 30 days instead of the usual 10, partly explaining the spike.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sector donut chart (SVG) ─────────────────────────────────────────────────

function SectorDonut() {
  const sectors = [
    { name: "Infrastructure", color: "#f97316", cr: 2800 },
    { name: "Mining & Metals", color: "#b45309", cr: 2100 },
    { name: "Lottery & Gaming", color: "#dc2626", cr: 1500 },
    { name: "Finance", color: "#7c3aed", cr: 1200 },
    { name: "Energy", color: "#f59e0b", cr: 950 },
    { name: "Pharma", color: "#22c55e", cr: 800 },
    { name: "Telecom", color: "#06b6d4", cr: 600 },
    { name: "Real Estate", color: "#0891b2", cr: 500 },
  ];

  const total = sectors.reduce((a, s) => a + s.cr, 0);
  const r = 70;
  const cx = 90;
  const cy = 90;
  let cumAngle = -Math.PI / 2;

  const arcs = sectors.map((s) => {
    const fraction = s.cr / total;
    const angle = fraction * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { ...s, path, fraction };
  });

  const [hover, setHover] = useState<typeof sectors[0] | null>(null);

  return (
    <div className="flex gap-6 items-center flex-wrap">
      <svg width="180" height="180" className="shrink-0">
        {arcs.map((arc) => (
          <path key={arc.name} d={arc.path} fill={arc.color}
            opacity={hover && hover.name !== arc.name ? 0.4 : 1}
            className="transition-opacity cursor-pointer"
            onMouseEnter={() => setHover(arc)}
            onMouseLeave={() => setHover(null)} />
        ))}
        <circle cx={cx} cy={cy} r={r * 0.5} fill="white" className="dark:fill-slate-900" />
        <text x={cx} y={cy - 5} textAnchor="middle" className="text-[8px]" fill="currentColor" style={{ fontSize: "8px" }}>
          {hover ? `₹${hover.cr.toLocaleString("en-IN")}` : "₹11,450"}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#94a3b8" style={{ fontSize: "7px" }}>
          {hover ? hover.name : "crore total"}
        </text>
      </svg>
      <div className="flex-1 space-y-1.5">
        {sectors.map((s) => (
          <div key={s.name} className="flex items-center gap-2"
            onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(null)}>
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <div className="text-[10px] text-slate-600 dark:text-slate-400 flex-1 truncate">{s.name}</div>
            <div className="text-[10px] font-mono text-slate-500">₹{s.cr.toLocaleString("en-IN")}</div>
            <div className="text-[9px] text-slate-400 w-8 text-right">{((s.cr / total) * 100).toFixed(0)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
