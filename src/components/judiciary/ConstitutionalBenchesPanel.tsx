"use client";

import { useState } from "react";
interface ConstitutionalBenchCase {
  id: string;
  name: string;
  year: number;
  benchSize: number;
  articles: string[];
  outcome: string;
  significance: string;
  vote?: string;
  dissentBy?: string;
  overruled?: boolean;
}

const CONSTITUTIONAL_BENCHES: ConstitutionalBenchCase[] = [
  {
    id: "kesavananda-bench",
    name: "Kesavananda Bharati v State of Kerala",
    year: 1973,
    benchSize: 13,
    articles: ["13", "368"],
    outcome: "Basic Structure Doctrine established — Parliament cannot amend the Constitution's essential features",
    significance: "Largest bench ever assembled; established the most important constitutional doctrine in Indian history. Overruled Golaknath.",
    vote: "7:6",
    dissentBy: "CJI A.N. Ray, Justices Dwivedi, Mathew, Beg, Chandrachud (partial)",
  },
  {
    id: "golaknath-bench",
    name: "I.C. Golak Nath v State of Punjab",
    year: 1967,
    benchSize: 11,
    articles: ["13", "368"],
    outcome: "Parliament cannot amend fundamental rights under Art. 368 — prospective overruling applied",
    significance: "11-judge bench sparked constitutional crisis; later overruled by Kesavananda Bharati (1973). Introduced prospective overruling for the first time in India.",
    vote: "6:5",
    dissentBy: "Justices Wanchoo, Bachawat, Ramaswami, Mitter, Shelat",
    overruled: true,
  },
  {
    id: "indra-sawhney-bench",
    name: "Indra Sawhney v Union of India",
    year: 1992,
    benchSize: 9,
    articles: ["16", "340"],
    outcome: "OBC reservations valid; 50% ceiling; creamy layer excluded; no reservation in promotions",
    significance: "Defined affirmative action limits still followed today. The 50% Mandal cap has been challenged many times but always upheld as constitutional.",
    vote: "6:3",
    dissentBy: "Justices Pandian, Thommen, Ahmadi (on 50% cap)",
  },
  {
    id: "bommai-bench",
    name: "S.R. Bommai v Union of India",
    year: 1994,
    benchSize: 9,
    articles: ["356", "74"],
    outcome: "Presidential Rule subject to judicial review; floor test mandatory; secularism in Basic Structure",
    significance: "Ended the most abused constitutional provision. Art. 356 had been invoked 100+ times before this judgment; misuse dropped sharply after.",
    vote: "Majority (6:3 on key questions)",
  },
  {
    id: "puttaswamy-bench",
    name: "Justice K.S. Puttaswamy v Union of India",
    year: 2017,
    benchSize: 9,
    articles: ["14", "19", "21"],
    outcome: "Right to privacy is a fundamental right; overruled M.P. Sharma and Kharak Singh",
    significance: "Unanimous 9-judge verdict on a question unanswered for 63 years. The privacy test (legality, legitimate aim, proportionality, procedural guarantees) is now the standard.",
    vote: "9:0 (Unanimous)",
  },
  {
    id: "coelho-bench",
    name: "I.R. Coelho v State of Tamil Nadu",
    year: 2007,
    benchSize: 9,
    articles: ["31B", "9th Schedule", "368"],
    outcome: "Laws in the Ninth Schedule added after April 24, 1973 (Kesavananda date) can be judicially reviewed if they damage Basic Structure",
    significance: "Ended the Parliament's strategy of shielding laws from judicial review by placing them in the Ninth Schedule. Post-Kesavananda laws have no blanket immunity.",
    vote: "Majority",
  },
  {
    id: "navtej-bench",
    name: "Navtej Singh Johar v Union of India",
    year: 2018,
    benchSize: 5,
    articles: ["14", "15", "19", "21"],
    outcome: "Section 377 IPC unconstitutional to the extent it criminalises consensual adult same-sex conduct",
    significance: "Four concurring opinions — each judge wrote separately, reflecting the richness of constitutional reasoning. Constitutional morality > popular morality.",
    vote: "5:0 (Unanimous)",
  },
  {
    id: "adm-jabalpur-bench",
    name: "ADM Jabalpur v Shivkant Shukla",
    year: 1976,
    benchSize: 5,
    articles: ["21", "359"],
    outcome: "Art. 21 (personal liberty) suspended during Emergency under Art. 359 — no right to approach courts",
    significance: "Called the Supreme Court's darkest hour. Effectively suspended habeas corpus. Justice H.R. Khanna alone dissented and was superseded for CJI. 44th Amendment (1978) made Arts. 20–21 non-suspendable.",
    vote: "4:1",
    dissentBy: "Justice H.R. Khanna",
    overruled: true,
  },
];

const BENCH_COLORS: Record<number, { ring: string; bg: string; text: string; dot: string }> = {
  13: { ring: "ring-amber-500",   bg: "bg-amber-50 dark:bg-amber-950/20",   text: "text-amber-700 dark:text-amber-300",   dot: "bg-amber-500" },
  9:  { ring: "ring-purple-500",  bg: "bg-purple-50 dark:bg-purple-950/20", text: "text-purple-700 dark:text-purple-300", dot: "bg-purple-500" },
  5:  { ring: "ring-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
};

function JudgeDots({ count, overruled }: { count: number; overruled?: boolean }) {
  return (
    <div className="flex gap-1 flex-wrap mt-2">
      {Array.from({ length: count }).map((_, i) => {
        const cfg = BENCH_COLORS[count] || BENCH_COLORS[5];
        return (
          <div
            key={i}
            className={`w-4 h-4 rounded-full ${overruled ? "bg-slate-300 dark:bg-slate-600" : cfg.dot}`}
            title={`Judge ${i + 1}`}
          />
        );
      })}
    </div>
  );
}

export function ConstitutionalBenchesPanel() {
  const [filter, setFilter] = useState<"all" | 13 | 9 | 5>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = CONSTITUTIONAL_BENCHES.filter((b) =>
    filter === "all" ? true : b.benchSize === filter
  );

  const groupedBySize = [13, 9, 5].reduce((acc, size) => {
    const items = CONSTITUTIONAL_BENCHES.filter((b) => b.benchSize === size);
    if (items.length) acc.push({ size, items });
    return acc;
  }, [] as { size: number; items: typeof CONSTITUTIONAL_BENCHES }[]);

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="card p-5 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
        <h3 className="font-bold text-sm text-amber-800 dark:text-amber-300 mb-2">What is a Constitution Bench?</h3>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          Under Art. 145(3) of the Constitution, a bench of <strong>at least 5 judges</strong> must hear cases involving substantial questions of
          constitutional interpretation. The Chief Justice has the power to constitute benches. Larger benches (7, 9, 11, 13) are assembled for
          matters of the highest constitutional importance. A larger bench always overrides a smaller bench's ruling.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[["all", "All Benches"], [13, "13-Judge"], [9, "9-Judge"], [5, "5-Judge"]].map(([v, l]) => (
          <button
            key={String(v)}
            onClick={() => setFilter(v as typeof filter)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === v ? "bg-saffron-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Benches */}
      {filter === "all" ? (
        <div className="space-y-8">
          {groupedBySize.map(({ size, items }) => {
            const cfg = BENCH_COLORS[size] || BENCH_COLORS[5];
            return (
              <div key={size}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full ${cfg.dot} flex items-center justify-center text-white text-sm font-bold`}>
                    {size}
                  </div>
                  <h3 className={`font-display font-bold text-base ${cfg.text}`}>{size}-Judge Constitution Bench</h3>
                  <span className="text-xs text-slate-400">{items.length} case{items.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="space-y-3">
                  {items.map((bench) => <BenchCard key={bench.id} bench={bench} selected={selected} onSelect={setSelected} />)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((bench) => <BenchCard key={bench.id} bench={bench} selected={selected} onSelect={setSelected} />)}
        </div>
      )}

      {/* Significance note */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-xs text-slate-500">
        <strong className="text-slate-700 dark:text-slate-300">Bench precedence rule:</strong> A decision by a larger bench is binding on smaller benches.
        If a 5-judge bench feels a question was incorrectly decided by a prior 5-judge bench, the matter must be referred to a 7-judge bench.
        This is how Golaknath (11-judge) overruling Sankari Prasad (5-judge) worked, and later Kesavananda (13-judge) overruling Golaknath.
      </div>
    </div>
  );
}

function BenchCard({ bench, selected, onSelect }: {
  bench: ConstitutionalBenchCase;
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const cfg = BENCH_COLORS[bench.benchSize] || BENCH_COLORS[5];
  const isSelected = selected === bench.id;

  return (
    <button
      onClick={() => onSelect(isSelected ? null : bench.id)}
      className={`w-full card p-5 text-left transition-all hover:shadow-md ring-1 ${cfg.ring} ${isSelected ? "ring-2" : "ring-transparent hover:ring-1"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">{bench.name}</h3>
            {bench.overruled && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 uppercase">Overruled</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs font-semibold text-slate-500">{bench.year}</span>
            {bench.vote && <span className="text-xs text-slate-400 font-mono">{bench.vote}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>{bench.benchSize} judges</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`text-slate-400 transition-transform ${isSelected ? "rotate-180" : ""}`}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>

      <JudgeDots count={bench.benchSize} overruled={bench.overruled} />

      {/* Articles */}
      <div className="flex gap-1 mt-2 flex-wrap">
        {bench.articles.map((a) => (
          <span key={a} className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Art. {a}
          </span>
        ))}
      </div>

      {/* Outcome (always shown) */}
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{bench.outcome}</p>

      {isSelected && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Constitutional Significance</div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{bench.significance}</p>
          </div>
          {bench.dissentBy && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 shrink-0 mt-0.5">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <div className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase mb-0.5">Dissenting</div>
                <div className="text-xs text-red-700 dark:text-red-300">{bench.dissentBy}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </button>
  );
}
