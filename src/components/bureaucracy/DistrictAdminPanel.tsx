"use client";

import { useState } from "react";
interface DistrictUnit { id: string; title: string; abbr: string; track: "revenue" | "development" | "police" | "dept"; depth: number; count: string; role: string; powers: string[]; parent?: string }

const DISTRICT_UNITS: DistrictUnit[] = [
  { id: "collector",    title: "District Collector / District Magistrate (DM)", abbr: "DC / DM",       track: "revenue",     depth: 0, count: "1 per district",                                   role: "Overall head of district administration. Revenue authority, law & order coordinator, development supervisor, disaster manager, and electoral officer.",                                                                          powers: ["Head of district revenue administration", "Section 144 / preventive detention orders", "District Magistrate (criminal & executive magistracy)", "Disaster Management authority (NDMA framework)", "Returning Officer for parliamentary/assembly elections", "Chairs DISHA, DPSC, District Planning Committee"] },
  { id: "adc-rev",     title: "Additional District Collector (Revenue)",         abbr: "ADC / ADM",     track: "revenue",     depth: 1, count: "1–2 per district",                                 role: "Heads revenue administration. Handles land acquisition, court cases, revenue appeals. Deputizes for Collector.",                                                                                                                  powers: ["Appellate authority for tehsildar orders", "Land acquisition awards", "Arms licence scrutiny"],                                                                                                                                                                        parent: "collector" },
  { id: "sdm",         title: "Sub-Divisional Magistrate",                       abbr: "SDM / SDO",     track: "revenue",     depth: 2, count: "3–6 per district (one per sub-division)",          role: "Manages a sub-division comprising 3–5 tehsils. Revenue administration, law & order, and certification functions for the sub-division.",                                                                                         powers: ["Executive magistrate powers", "Revenue appeals from Tehsildar", "Income/caste/domicile certificate final authority", "Section 144 for sub-division"],                                                                                                                  parent: "adc-rev" },
  { id: "tehsildar",   title: "Tehsildar / Tahasildar",                          abbr: "Tehsildar",     track: "revenue",     depth: 3, count: "8–20 per district (one per tehsil)",               role: "Head of revenue administration at tehsil level. Maintains land records, issues certificates, collects revenue, adjudicates disputes.",                                                                                            powers: ["Maintenance of cadastral (land) records", "Mutation (name change in records) orders", "Revenue collection authority", "Caste/income/residence certificate issuance", "First-level arbitrator in land disputes"],                                                       parent: "sdm" },
  { id: "naib-tehsildar",title: "Naib Tehsildar",                                abbr: "Naib Tehsildar",track: "revenue",     depth: 4, count: "2–3 per tehsil",                                   role: "Assists Tehsildar. Prepares revenue records, manages patwari inspections, resolves minor land disputes.",                                                                                                                          powers: ["Revenue record management", "Minor land dispute resolution", "Patwari supervision"],                                                                                                                                                                                    parent: "tehsildar" },
  { id: "patwari",     title: "Patwari / Lekhpal / Kanungo",                     abbr: "Patwari",       track: "revenue",     depth: 5, count: "1 per cluster of 5–10 villages",                  role: "Village-level revenue official. Maintains khasra (field register), khatauni (tenure record), girdawari (crop inspection). The custodian of land records.",                                                                       powers: ["Maintains village land map (Naksha)", "Records crop details in girdawari", "Witnesses land transactions", "First contact for land record queries"],                                                                                                                      parent: "naib-tehsildar" },
  { id: "adc-dev",     title: "Additional Collector (Development) / CDO",        abbr: "CDO / DDO",     track: "development", depth: 1, count: "1 per district",                                   role: "Heads district-level implementation of development schemes. Coordinates all department heads for development objectives.",                                                                                                          powers: ["Chairs District Development Coordination & Monitoring Committee", "Oversees MGNREGS, PMAY, and rural development schemes", "District DPSP nodal officer"],                                                                                                              parent: "collector" },
  { id: "bdo",         title: "Block Development Officer",                        abbr: "BDO",           track: "development", depth: 2, count: "10–30 per district (one per block)",               role: "Last administrative officer responsible for block-level development. Implements all Central and State schemes at block level. Primary interface with Gram Panchayats.",                                                             powers: ["Approval of MGNREGS muster rolls", "PMAY beneficiary final selection", "Pradhan Mantri Awas Gramin construction monitoring", "SHG (Self Help Group) formation and finance", "Panchayat Raj institutional support"],                                                     parent: "adc-dev" },
  { id: "gp-sec",      title: "Gram Panchayat Secretary",                         abbr: "GP Secretary",  track: "development", depth: 3, count: "1 per Gram Panchayat (~2.5 lakh GPs in India)",  role: "State government employee posted to Gram Panchayat. Maintains records, facilitates scheme implementation, acts as secretary to elected Gram Pradesh.",                                                                           powers: ["Records maintenance of GP resolutions", "MGNREGS muster roll maintenance", "Beneficiary list management", "Liaises between GP and BDO"],                                                                                                                               parent: "bdo" },
  { id: "sp",          title: "Superintendent of Police",                          abbr: "SP",            track: "police",      depth: 1, count: "1 per district (coordinates with Collector, not under DC)", role: "Head of district police. Responsible for law & order, crime detection, traffic. Coordinates with Collector on law & order but is administratively under DIG/IG.",                                         powers: ["Overall command of district police (~500–2000 officers)", "Suspension of Sub-Inspector and below", "Preventive detention recommendation", "Manages Armed Reserve and District Crime Branch"],                                                                            parent: "collector" },
  { id: "dysp",        title: "Deputy Superintendent of Police",                  abbr: "Dy.SP / DSP",   track: "police",      depth: 2, count: "1 per sub-division (SDPO)",                       role: "Sub-Divisional Police Officer — head of police in a sub-division. Supervises Inspectors, manages stations.",                                                                                                                     powers: ["Investigation of serious crimes", "Inspection of police stations"],                                                                                                                                                                                                      parent: "sp" },
  { id: "civil-surgeon",title: "Chief Medical Officer / Civil Surgeon",           abbr: "CMO / CS",      track: "dept",        depth: 1, count: "1 per district",                                  role: "Head of district health administration. Manages district hospital, PHCs, CHCs. Implements PMJAY, RCH, NMHP, NHM at district level.",                                                                                              powers: ["District health scheme implementation", "Drug procurement", "Medical officer transfers in district"],                                                                                                                                                                    parent: "collector" },
  { id: "deo",         title: "District Education Officer",                        abbr: "DEO",           track: "dept",        depth: 1, count: "1 per district",                                  role: "Manages all government schools and teachers in the district. Implements Mid-Day Meal, PM POSHAN, Samagra Shiksha.",                                                                                                                powers: ["Teacher transfers and appointments", "School inspection and recognition", "Mid-Day Meal monitoring"],                                                                                                                                                                    parent: "collector" },
];

const TRACK_CONFIG = {
  revenue: { label: "Revenue Track", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", accent: "#B45309" },
  development: { label: "Development Track", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", accent: "#047857" },
  police: { label: "Police (IPS)", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300", accent: "#B91C1C" },
  dept: { label: "Line Departments", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", accent: "#7C3AED" },
};

const DEPTH_INDENT = [0, 16, 32, 48, 64, 80];

function UnitCard({ unit, isSelected, onSelect }: { unit: DistrictUnit; isSelected: boolean; onSelect: () => void }) {
  const track = TRACK_CONFIG[unit.track];
  return (
    <div style={{ paddingLeft: DEPTH_INDENT[unit.depth] }}>
      <button
        onClick={onSelect}
        className={`w-full text-left p-3 rounded-xl border transition-all ${isSelected ? "border-saffron-400 ring-1 ring-saffron-400 shadow-sm" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"} bg-white dark:bg-slate-900`}
      >
        <div className="flex items-center gap-2">
          {unit.depth > 0 && (
            <div className="shrink-0 w-3 h-px bg-slate-300 dark:bg-slate-600" />
          )}
          <span className={`px-2 py-0.5 text-[10px] rounded font-semibold shrink-0 ${track.color}`}>{unit.abbr}</span>
          <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{unit.title}</span>
          <span className="ml-auto text-[10px] text-slate-400 shrink-0 hidden sm:block">{unit.count}</span>
        </div>
      </button>
    </div>
  );
}

export function DistrictAdminPanel() {
  const [selected, setSelected] = useState<string>("collector");
  const [trackFilter, setTrackFilter] = useState<string>("all");

  const selectedUnit = DISTRICT_UNITS.find((u) => u.id === selected)!;

  const filteredUnits = DISTRICT_UNITS.filter((u) => {
    if (u.id === "collector") return true;
    if (trackFilter === "all") return true;
    return u.track === trackFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5 border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20">
        <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm mb-1">District Administration — Government at Ground Level</h3>
        <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed">
          The District Collector is India&apos;s most powerful field officer — managing revenue, development, law &amp; order, elections, and disaster response. Click any unit to explore its role and powers.
        </p>
      </div>

      {/* Track filters */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setTrackFilter("all")}
          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${trackFilter === "all" ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
          All tracks
        </button>
        {(Object.keys(TRACK_CONFIG) as (keyof typeof TRACK_CONFIG)[]).map((t) => (
          <button key={t} onClick={() => setTrackFilter(t)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${trackFilter === t ? TRACK_CONFIG[t].color : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
            {TRACK_CONFIG[t].label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Unit tree */}
        <div className="space-y-2">
          {filteredUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              isSelected={selected === unit.id}
              onSelect={() => setSelected(unit.id)}
            />
          ))}
        </div>

        {/* Detail */}
        {selectedUnit && (
          <div className="card p-6 space-y-4 self-start">
            <div>
              <div className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold mb-2 ${TRACK_CONFIG[selectedUnit.track].color}`}>
                {TRACK_CONFIG[selectedUnit.track].label}
              </div>
              <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">{selectedUnit.title}</h3>
              <div className="text-[10px] text-slate-400 mt-1">{selectedUnit.count}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5">Role</div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{selectedUnit.role}</p>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Powers &amp; Functions</div>
              <div className="space-y-1.5">
                {selectedUnit.powers.map((p) => (
                  <div key={p} className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 mt-0.5 text-emerald-500">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {p}
                  </div>
                ))}
              </div>
            </div>
            {selectedUnit.parent && (
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5">Reports to</div>
                <button onClick={() => setSelected(selectedUnit.parent!)}
                  className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors">
                  {DISTRICT_UNITS.find((u) => u.id === selectedUnit.parent)?.abbr || selectedUnit.parent} ↑
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Typical district stats */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm">A Typical Indian District</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { v: "~2–5M", l: "Population", s: "average district" },
            { v: "10–30", l: "Blocks (Tehsils)", s: "sub-district units" },
            { v: "300–800", l: "Gram Panchayats", s: "per district" },
            { v: "1 IAS", l: "District Collector", s: "managing all of this" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-xl font-display font-bold text-emerald-700 dark:text-emerald-300">{s.v}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{s.l}</div>
              <div className="text-[10px] text-slate-400">{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
