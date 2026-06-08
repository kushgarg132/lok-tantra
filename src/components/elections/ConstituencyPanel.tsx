"use client";

import { useState, useMemo } from "react";
interface Constituency { id: number; name: string; state: string; winner: string; winnerParty: string; partyColor: string; votes: number; margin: number; turnout: number; reserved: null | "SC" | "ST" }

const KEY_CONSTITUENCIES: Constituency[] = [
  { id: 1,  name: "Varanasi",           state: "UP",          winner: "Narendra Modi",         winnerParty: "BJP",   partyColor: "#FF9933", votes: 612970,  margin: 152513,  turnout: 62.0, reserved: null  },
  { id: 2,  name: "Rae Bareli",         state: "UP",          winner: "Rahul Gandhi",          winnerParty: "INC",   partyColor: "#1565C0", votes: 687649,  margin: 390030,  turnout: 54.0, reserved: null  },
  { id: 3,  name: "Amethi",             state: "UP",          winner: "K. L. Sharma",          winnerParty: "INC",   partyColor: "#1565C0", votes: 540678,  margin: 167196,  turnout: 55.0, reserved: null  },
  { id: 4,  name: "Lucknow",            state: "UP",          winner: "Rajnath Singh",         winnerParty: "BJP",   partyColor: "#FF9933", votes: 680078,  margin: 452442,  turnout: 55.0, reserved: null  },
  { id: 5,  name: "Meerut",             state: "UP",          winner: "Arun Govil",            winnerParty: "BJP",   partyColor: "#FF9933", votes: 623412,  margin: 114979,  turnout: 59.0, reserved: null  },
  { id: 6,  name: "Azamgarh",           state: "UP",          winner: "Dharmendra Yadav",      winnerParty: "SP",    partyColor: "#EF4444", votes: 515060,  margin: 97499,   turnout: 55.0, reserved: "SC" },
  { id: 7,  name: "Thiruvananthapuram", state: "Kerala",      winner: "Shashi Tharoor",        winnerParty: "INC",   partyColor: "#1565C0", votes: 358155,  margin: 16077,   turnout: 71.9, reserved: null  },
  { id: 8,  name: "Wayanad",            state: "Kerala",      winner: "Rahul Gandhi",          winnerParty: "INC",   partyColor: "#1565C0", votes: 648931,  margin: 364422,  turnout: 73.0, reserved: "ST" },
  { id: 9,  name: "Hyderabad",          state: "Telangana",   winner: "Asaduddin Owaisi",      winnerParty: "AIMIM", partyColor: "#1B5E20", votes: 506082,  margin: 338087,  turnout: 52.0, reserved: null  },
  { id: 10, name: "Surat",              state: "Gujarat",     winner: "Mukesh Dalal",          winnerParty: "BJP",   partyColor: "#FF9933", votes: 0,       margin: 0,       turnout: 34.0, reserved: null  },
  { id: 11, name: "Chandigarh",         state: "Chandigarh",  winner: "Manish Tewari",         winnerParty: "INC",   partyColor: "#1565C0", votes: 194765,  margin: 2504,    turnout: 68.3, reserved: null  },
  { id: 12, name: "Nagpur",             state: "Maharashtra", winner: "Nitin Gadkari",         winnerParty: "BJP",   partyColor: "#FF9933", votes: 679985,  margin: 136893,  turnout: 62.0, reserved: null  },
  { id: 13, name: "Mumbai North",       state: "Maharashtra", winner: "Piyush Goyal",          winnerParty: "BJP",   partyColor: "#FF9933", votes: 700452,  margin: 420123,  turnout: 61.0, reserved: null  },
  { id: 14, name: "Bengaluru South",    state: "Karnataka",   winner: "Tejasvi Surya",         winnerParty: "BJP",   partyColor: "#FF9933", votes: 774289,  margin: 200220,  turnout: 65.0, reserved: null  },
  { id: 15, name: "Patna Sahib",        state: "Bihar",       winner: "Ravi Shankar Prasad",   winnerParty: "BJP",   partyColor: "#FF9933", votes: 598045,  margin: 154118,  turnout: 58.0, reserved: null  },
  { id: 16, name: "Kolkata North",      state: "West Bengal", winner: "Sudip Bandyopadhyay",   winnerParty: "TMC",   partyColor: "#059669", votes: 613250,  margin: 155140,  turnout: 68.0, reserved: null  },
  { id: 17, name: "New Delhi",          state: "Delhi",       winner: "Bansuri Swaraj",        winnerParty: "BJP",   partyColor: "#FF9933", votes: 507810,  margin: 78370,   turnout: 56.0, reserved: null  },
  { id: 18, name: "Bhopal",             state: "MP",          winner: "Alok Sharma",           winnerParty: "BJP",   partyColor: "#FF9933", votes: 879012,  margin: 295245,  turnout: 59.0, reserved: null  },
  { id: 19, name: "Indore",             state: "MP",          winner: "Shankar Lalwani",       winnerParty: "BJP",   partyColor: "#FF9933", votes: 1174005, margin: 1174005, turnout: 63.0, reserved: null  },
  { id: 20, name: "Baramulla",          state: "J&K",         winner: "Sheikh Abdul Rashid",   winnerParty: "Ind.", partyColor: "#64748B", votes: 695105,  margin: 204142,  turnout: 62.0, reserved: null  },
  { id: 21, name: "Bastar",             state: "Chhattisgarh",winner: "Mahesh Kashyap",        winnerParty: "BJP",   partyColor: "#FF9933", votes: 381920,  margin: 6019,    turnout: 74.0, reserved: "ST" },
  { id: 22, name: "Mandya",             state: "Karnataka",   winner: "Nikhil Kumaraswamy",    winnerParty: "JDS",   partyColor: "#16A34A", votes: 612450,  margin: 166116,  turnout: 80.0, reserved: null  },
  { id: 23, name: "Coimbatore",         state: "Tamil Nadu",  winner: "Ganapathy P. Rajkumar", winnerParty: "DMK",   partyColor: "#DC143C", votes: 599250,  margin: 141064,  turnout: 68.0, reserved: null  },
  { id: 24, name: "Srinagar",           state: "J&K",         winner: "Aga S. Ruhullah Mehdi", winnerParty: "NC",    partyColor: "#1A237E", votes: 573872,  margin: 278311,  turnout: 38.0, reserved: null  },
  { id: 25, name: "Kolkata South",      state: "West Bengal", winner: "Mala Roy",              winnerParty: "TMC",   partyColor: "#059669", votes: 602010,  margin: 167543,  turnout: 65.0, reserved: null  },
];

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
