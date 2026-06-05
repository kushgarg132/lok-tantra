"use client";

import { useState } from "react";

interface Amendment {
  id: string;
  number: number;
  title: string;
  year: number;
  description?: string | null;
  articlesAmended?: string[] | null;
  significance?: string | null;
}

// Key amendments to always show even if DB is empty
const KEY_AMENDMENTS = [
  {
    id: "static-1",
    number: 1,
    year: 1951,
    title: "First Amendment",
    description: "Added Ninth Schedule (laws immune from judicial review); allowed restrictions on speech; validated land reform laws.",
    significance: "First major amendment — enabled reservations and land reforms that were challenged by courts.",
    articlesAmended: ["15", "19", "85", "87", "174", "176", "341", "342", "372", "376"],
  },
  {
    id: "static-7",
    number: 7,
    year: 1956,
    title: "Seventh Amendment",
    description: "Reorganized states on linguistic basis following the States Reorganisation Act; abolished Classes A, B, C, D of states.",
    significance: "Created the modern map of Indian states based on language.",
    articlesAmended: ["1", "3", "49", "80", "81", "82", "131", "153", "158", "168", "170", "171", "216", "217", "220", "222", "224", "230", "231", "232"],
  },
  {
    id: "static-24",
    number: 24,
    year: 1971,
    title: "Twenty-Fourth Amendment",
    description: "Affirmed Parliament's power to amend any provision of the Constitution including Fundamental Rights.",
    significance: "Response to Golak Nath (1967); later overturned in part by Kesavananda Bharati (1973).",
    articlesAmended: ["13", "368"],
  },
  {
    id: "static-42",
    number: 42,
    year: 1976,
    title: "Forty-Second Amendment (Mini-Constitution)",
    description: "Added 'socialist', 'secular' and 'integrity' to the Preamble. Added Fundamental Duties (Art 51A). Made DPSP superior to FRs (later reversed). Added 10 subjects to Concurrent List.",
    significance: "Most sweeping amendment; passed during Emergency. Many provisions later repealed by 44th Amendment.",
    articlesAmended: ["31C", "39", "51A", "368", "Preamble"],
  },
  {
    id: "static-44",
    number: 44,
    year: 1978,
    title: "Forty-Fourth Amendment",
    description: "Removed right to property as a Fundamental Right (Art 19(f) and Art 31); added Art 300A. Restored rule that President must follow Cabinet advice.",
    significance: "Corrected Emergency-era excesses. Property became a constitutional right, not a fundamental right.",
    articlesAmended: ["19", "22", "30", "31", "74", "77", "83", "103", "105", "123", "132", "133", "134", "139A", "150", "166", "172", "192", "194", "213", "217", "225", "226", "228", "352", "356", "358", "359", "360", "371F"],
  },
  {
    id: "static-52",
    number: 52,
    year: 1985,
    title: "Fifty-Second Amendment (Anti-Defection Law)",
    description: "Added Tenth Schedule — provides for disqualification of members who defect from their political party.",
    significance: "Introduced anti-defection law to prevent political floor-crossing and ensure party discipline.",
    articlesAmended: ["101", "102", "190", "191", "Tenth Schedule"],
  },
  {
    id: "static-61",
    number: 61,
    year: 1988,
    title: "Sixty-First Amendment",
    description: "Reduced voting age from 21 to 18 years for Lok Sabha and State Assembly elections.",
    significance: "Enfranchised millions of young voters, one of the largest single expansions of franchise.",
    articlesAmended: ["326"],
  },
  {
    id: "static-73",
    number: 73,
    year: 1992,
    title: "Seventy-Third Amendment (Panchayati Raj)",
    description: "Added Part IX — gave constitutional status to Panchayati Raj institutions. Mandated three-tier system, reservations for SC/ST/women, regular elections.",
    significance: "Landmark decentralization — brought democracy to village level. 1/3 seats reserved for women.",
    articlesAmended: ["243", "243A-243O"],
  },
  {
    id: "static-74",
    number: 74,
    year: 1992,
    title: "Seventy-Fourth Amendment (Urban Local Bodies)",
    description: "Added Part IXA — gave constitutional status to urban local bodies (municipalities). Established ward committees, reservations.",
    significance: "Decentralized urban governance; gave constitutional backing to municipalities.",
    articlesAmended: ["243P-243ZG"],
  },
  {
    id: "static-86",
    number: 86,
    year: 2002,
    title: "Eighty-Sixth Amendment (Right to Education)",
    description: "Made free and compulsory education (6-14 years) a Fundamental Right under new Article 21A. Modified Article 45 to focus on early childhood care.",
    significance: "Added 11th Fundamental Right. Led to the Right to Education Act (2009).",
    articlesAmended: ["21A", "45", "51A"],
  },
  {
    id: "static-97",
    number: 97,
    year: 2011,
    title: "Ninety-Seventh Amendment (Cooperatives)",
    description: "Added Part IXB — gave constitutional status to cooperative societies. Added Right to form cooperatives in Art 19(1)(c).",
    significance: "Strengthened cooperative movement constitutionally.",
    articlesAmended: ["19", "43B", "243ZH-243ZT"],
  },
  {
    id: "static-101",
    number: 101,
    year: 2016,
    title: "One Hundred and First Amendment (GST)",
    description: "Introduced Goods and Services Tax (GST) — a unified indirect tax. Created GST Council, new Article 246A.",
    significance: "The most significant tax reform since Independence — 'One Nation One Tax'.",
    articlesAmended: ["246A", "269A", "279A", "248"],
  },
  {
    id: "static-103",
    number: 103,
    year: 2019,
    title: "One Hundred and Third Amendment (EWS Reservation)",
    description: "Added 10% reservation for Economically Weaker Sections (EWS) in educational institutions and public employment. Added Arts 15(6) and 16(6).",
    significance: "Extended reservations to economically weaker sections of general category. Upheld by SC in Nov 2022 (4-1).",
    articlesAmended: ["15", "16"],
  },
  {
    id: "static-104",
    number: 104,
    year: 2020,
    title: "One Hundred and Fourth Amendment",
    description: "Extended reservation of SC/ST seats in Lok Sabha and State Assemblies for 10 more years (until 2030). Abolished Anglo-Indian nominated seats.",
    significance: "Ended nominated Anglo-Indian representation that had existed since 1950.",
    articlesAmended: ["334"],
  },
  {
    id: "static-106",
    number: 106,
    year: 2023,
    title: "One Hundred and Sixth Amendment (Women's Reservation)",
    description: "Reserved 1/3 of seats in Lok Sabha, State Assemblies, and Delhi Assembly for women. To come into effect after next delimitation exercise.",
    significance: "Long-pending women's reservation — 27 years after first introduced in 1996 (Nari Shakti Vandan Adhiniyam).",
    articlesAmended: ["239AA", "330A", "332A"],
  },
];

interface Props {
  amendments?: Amendment[];
}

export function AmendmentTimeline({ amendments = [] }: Props) {
  const [filter, setFilter] = useState<"all" | "key">("key");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Merge DB amendments with key static amendments
  const mergedAmendments = (() => {
    const dbNums = new Set(amendments.map((a) => a.number));
    const staticToShow = KEY_AMENDMENTS.filter((k) => !dbNums.has(k.number));
    const all = [...amendments, ...staticToShow].sort((a, b) => a.number - b.number);
    return all;
  })();

  const filtered = mergedAmendments.filter((a) => {
    const isKey = KEY_AMENDMENTS.some((k) => k.number === a.number);
    if (filter === "key" && !isKey) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      (a.description || "").toLowerCase().includes(q) ||
      String(a.number).includes(q) ||
      String(a.year).includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search amendments..."
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-saffron-400"
        />
        <div className="flex gap-2">
          {(["key", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-saffron-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {f === "key" ? "Key Amendments" : `All (${mergedAmendments.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-4 pl-14">
          {filtered.map((amendment) => {
            const isExpanded = expandedId === (amendment.id || String(amendment.number));
            const isKey = KEY_AMENDMENTS.some((k) => k.number === amendment.number);

            return (
              <div key={amendment.id || amendment.number} className="relative">
                {/* Year bubble */}
                <div
                  className={`absolute -left-14 top-4 w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-900 shadow-sm ${
                    isKey
                      ? "bg-saffron-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {amendment.year}
                </div>

                <button
                  className={`w-full text-left card p-4 transition-all ${
                    isExpanded ? "border-saffron-400 dark:border-saffron-600 shadow-md" : ""
                  }`}
                  onClick={() =>
                    setExpandedId(
                      isExpanded ? null : amendment.id || String(amendment.number)
                    )
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-400">
                          {amendment.number}{amendment.number === 1 ? "st" : amendment.number === 2 ? "nd" : amendment.number === 3 ? "rd" : "th"} Amendment
                        </span>
                        {isKey && (
                          <span className="text-[10px] bg-saffron-100 text-saffron-600 dark:bg-saffron-900/30 dark:text-saffron-300 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                            Landmark
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 text-sm">
                        {amendment.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {amendment.description}
                      </p>
                    </div>
                    <svg
                      className={`shrink-0 text-slate-400 transition-transform mt-1 ${isExpanded ? "rotate-180" : ""}`}
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="card mt-1 p-4 space-y-3 border-saffron-100 dark:border-saffron-900">
                    {amendment.significance && (
                      <div>
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          Significance
                        </h5>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {amendment.significance}
                        </p>
                      </div>
                    )}
                    {amendment.articlesAmended && amendment.articlesAmended.length > 0 && (
                      <div>
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          Articles Amended / Added
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {amendment.articlesAmended.map((a) => (
                            <span
                              key={a}
                              className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                            >
                              Art. {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-slate-500 text-sm">No amendments match your search.</p>
        </div>
      )}
    </div>
  );
}
