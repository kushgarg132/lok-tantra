"use client";

import { useState, useMemo } from "react";
import { KEY_CONSTITUENCIES } from "@/data/elections/intelligence";

type SortKey = "name" | "margin" | "turnout" | "votes";

export function ConstituencyPanel() {
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [filterParty, setFilterParty] = useState("all");
  const [filterReserved, setFilterReserved] = useState<"all" | "SC" | "ST" | "general">("all");
  const [sort, setSort] = useState<SortKey>("margin");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<number | null>(null);

  const states = useMemo(() => ["all", ...Array.from(new Set(KEY_CONSTITUENCIES.map(c => c.state)))].sort(), []);
  const parties = useMemo(() => ["all", ...Array.from(new Set(KEY_CONSTITUENCIES.map(c => c.winnerParty)))].sort(), []);

  const filtered = useMemo(() => {
    let data = KEY_CONSTITUENCIES.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) &&
          !c.winner.toLowerCase().includes(search.toLowerCase()) &&
          !c.winnerParty.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterState !== "all" && c.state !== filterState) return false;
      if (filterParty !== "all" && c.winnerParty !== filterParty) return false;
      if (filterReserved === "SC" && c.reserved !== "SC") return false;
      if (filterReserved === "ST" && c.reserved !== "ST") return false;
      if (filterReserved === "general" && c.reserved !== null) return false;
      return true;
    });

    data = data.sort((a, b) => {
      let diff = 0;
      if (sort === "name") diff = a.name.localeCompare(b.name);
      else if (sort === "margin") diff = a.margin - b.margin;
      else if (sort === "turnout") diff = a.turnout - b.turnout;
      else if (sort === "votes") diff = a.votes - b.votes;
      return sortDir === "desc" ? -diff : diff;
    });

    return data;
  }, [search, filterState, filterParty, filterReserved, sort, sortDir]);

  const sel = selected !== null ? KEY_CONSTITUENCIES.find(c => c.id === selected) : null;

  const toggleSort = (k: SortKey) => {
    if (sort === k) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSort(k); setSortDir("desc"); }
  };

  const marginClass = (m: number) => {
    if (m === 0) return "text-slate-400";
    if (m < 10000) return "text-red-500 font-bold";
    if (m < 50000) return "text-orange-500";
    if (m < 200000) return "text-slate-600 dark:text-slate-300";
    return "text-emerald-600 dark:text-emerald-400";
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Search constituency, MP, party..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="col-span-2 sm:col-span-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-saffron-400"
        />
        <select value={filterState} onChange={(e) => setFilterState(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-saffron-400">
          {states.map(s => <option key={s} value={s}>{s === "all" ? "All States" : s}</option>)}
        </select>
        <select value={filterParty} onChange={(e) => setFilterParty(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-saffron-400">
          {parties.map(p => <option key={p} value={p}>{p === "all" ? "All Parties" : p}</option>)}
        </select>
        <div className="flex gap-1">
          {(["all", "general", "SC", "ST"] as const).map((f) => (
            <button key={f} onClick={() => setFilterReserved(f)}
              className={`flex-1 px-2 py-2 text-xs rounded-lg font-medium transition-colors ${filterReserved === f ? "bg-saffron-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
              {f === "all" ? "All" : f === "general" ? "Gen" : f}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-400 px-1">{filtered.length} constituencies shown (key constituencies only)</div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Constituency</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Winner</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase">Party</th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:text-slate-700" onClick={() => toggleSort("margin")}>
                  Margin {sort === "margin" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:text-slate-700" onClick={() => toggleSort("turnout")}>
                  Turnout {sort === "turnout" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Reserved</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(selected === c.id ? null : c.id)}
                  className={`border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors ${selected === c.id ? "bg-saffron-50 dark:bg-saffron-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.state}</div>
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-700 dark:text-slate-300 max-w-[140px]">
                    <div className="truncate">{c.winner}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: c.partyColor }}>
                      {c.winnerParty}
                    </span>
                  </td>
                  <td className={`py-3 px-3 text-right text-xs ${marginClass(c.margin)}`}>
                    {c.margin === 0 ? "Uncontested" : c.margin.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-3 text-right text-xs text-slate-500">{c.turnout}%</td>
                  <td className="py-3 px-4 text-right text-xs hidden md:table-cell">
                    {c.reserved ? (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${c.reserved === "SC" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"}`}>
                        {c.reserved}
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-sm">No constituencies match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <p className="text-xs text-slate-400 px-1">
        Data shows 25 notable constituencies from 2024 Lok Sabha elections. Surat (Gujarat) was uncontested after nomination rejections. Chandigarh (2504 vote margin) and Thiruvananthapuram (16,077 margin) were the closest contests shown.
      </p>
    </div>
  );
}
