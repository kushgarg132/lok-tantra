"use client";

import { useState } from "react";
import type { WritDB } from "./JudiciaryDashboard";

const JUDICIAL_REVIEW_POWERS = [
  {
    article: "Art. 13",
    title: "Void Laws — Fundamental Rights",
    court: "both" as const,
    description: "Any law (pre or post-Constitution) inconsistent with or in abridgement of Fundamental Rights is void to the extent of inconsistency. Established the supremacy of Part III.",
    grounds: ["Violates a Fundamental Right", "Made by a legislature without competence", "Arbitrary or manifestly unreasonable (Art. 14)"],
    landmark: "A.K. Gopalan v State of Madras (1950) — first major test of Art. 21 scope",
  },
  {
    article: "Art. 32",
    title: "Right to Constitutional Remedies",
    court: "sc" as const,
    description: "The Supreme Court has power to issue directions, orders, or writs for enforcement of Fundamental Rights. Dr. Ambedkar called Art. 32 the 'heart and soul of the Constitution'.",
    grounds: ["Violation of any Fundamental Right (Art. 12–35)", "State action infringing liberty/equality", "PIL for diffuse public rights"],
    landmark: "Maneka Gandhi v Union of India (1978) — expanded Art. 21 to include due process",
  },
  {
    article: "Art. 131–136",
    title: "Original & Appellate Jurisdiction",
    court: "sc" as const,
    description: "Art. 131 gives SC original jurisdiction in Centre–State/State–State disputes. Art. 132–135 set up appellate jurisdiction. Art. 136 grants sweeping special leave to appeal from any court or tribunal.",
    grounds: ["Centre–State constitutional dispute", "Substantial question of law as to interpretation of Constitution", "Any judgment by any court (SLP under Art. 136)"],
    landmark: "State of Rajasthan v Union of India (1977) — limits on Presidential dissolution power",
  },
  {
    article: "Art. 143",
    title: "Advisory Jurisdiction",
    court: "sc" as const,
    description: "President can refer questions of law or fact of public importance to SC for its opinion. SC may or may not give an opinion — it is advisory, not binding.",
    grounds: ["Question of public importance", "Question involving interpretation of Constitution", "Request by President of India"],
    landmark: "In Re Special Reference No. 1 of 2012 (2G Spectrum case advisory reference)",
  },
  {
    article: "Art. 226",
    title: "High Court Writ Jurisdiction",
    court: "hc" as const,
    description: "High Courts can issue writs not only for Fundamental Rights enforcement (like SC under Art. 32) but also for any other purpose — giving wider jurisdiction than the SC.",
    grounds: ["Violation of Fundamental Rights", "Any other legal right", "Ultra vires administrative action", "Excess or lack of jurisdiction"],
    landmark: "Bandhua Mukti Morcha v Union of India (1984) — expanded PIL to HCs",
  },
];

const COURT_BADGE = {
  sc:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  hc:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  both: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
};
const COURT_LABEL = { sc: "Supreme Court", hc: "High Court", both: "SC & HC" };

const WRIT_COLORS = [
  { bg: "bg-amber-50 dark:bg-amber-950/20",   border: "border-amber-400",   text: "text-amber-800 dark:text-amber-300",   sub: "text-amber-600 dark:text-amber-400" },
  { bg: "bg-blue-50 dark:bg-blue-950/20",     border: "border-blue-400",     text: "text-blue-800 dark:text-blue-300",     sub: "text-blue-600 dark:text-blue-400" },
  { bg: "bg-purple-50 dark:bg-purple-950/20", border: "border-purple-400",   text: "text-purple-800 dark:text-purple-300", sub: "text-purple-600 dark:text-purple-400" },
  { bg: "bg-rose-50 dark:bg-rose-950/20",     border: "border-rose-400",     text: "text-rose-800 dark:text-rose-300",     sub: "text-rose-600 dark:text-rose-400" },
  { bg: "bg-teal-50 dark:bg-teal-950/20",     border: "border-teal-400",     text: "text-teal-800 dark:text-teal-300",     sub: "text-teal-600 dark:text-teal-400" },
];

interface Props { writs: WritDB[] }

export function JudicialReviewPanel({ writs }: Props) {
  const [activeReview, setActiveReview] = useState<string | null>(null);
  const [activeWrit, setActiveWrit] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="card p-6 border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🏛️</div>
          <div>
            <h3 className="font-display font-bold text-amber-900 dark:text-amber-200 text-lg">The Basic Structure Doctrine</h3>
            <p className="text-sm text-amber-800 dark:text-amber-300 mt-2 leading-relaxed">
              India's most powerful form of judicial review. Parliament can amend any part of the Constitution,
              but cannot destroy its <strong>essential identity</strong>. Established in <em>Kesavananda Bharati v State of Kerala (1973)</em> by a 7:6 majority.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Supremacy of the Constitution", "Republican & democratic form of govt", "Secularism",
                "Separation of powers", "Federal character", "Judicial review",
                "Free & fair elections", "Fundamental rights", "Unity & sovereignty of India", "Rule of law",
              ].map((feature) => (
                <span key={feature} className="px-2 py-0.5 text-xs rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">Review Powers by Article</h3>
        <div className="space-y-3">
          {JUDICIAL_REVIEW_POWERS.map((power) => {
            const isActive = activeReview === power.article;
            return (
              <button
                key={power.article}
                onClick={() => setActiveReview(isActive ? null : power.article)}
                className={`w-full card p-5 text-left transition-all hover:shadow-md ${isActive ? "ring-2 ring-saffron-400" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {power.article}
                      </span>
                      <h4 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">{power.title}</h4>
                    </div>
                    <div className="mt-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${COURT_BADGE[power.court]}`}>
                        {COURT_LABEL[power.court]}
                      </span>
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`text-slate-400 transition-transform shrink-0 mt-1 ${isActive ? "rotate-180" : ""}`}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
                <p className={`mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed ${isActive ? "" : "line-clamp-2"}`}>
                  {power.description}
                </p>
                {isActive && (
                  <div className="mt-4 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Grounds for Review</div>
                      <ul className="space-y-1">
                        {power.grounds.map((g, i) => (
                          <li key={i} className="flex gap-2 items-start text-xs text-slate-700 dark:text-slate-300">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-saffron-500 shrink-0 mt-0.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-xs text-slate-500 italic">
                      <span className="text-saffron-600 dark:text-saffron-400 font-semibold">Landmark: </span>{power.landmark}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {writs.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 mb-4">The Five Constitutional Writs</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {writs.map((writ, i) => {
              const colors = WRIT_COLORS[i % WRIT_COLORS.length];
              const isActive = activeWrit === writ.id;
              return (
                <button
                  key={writ.id}
                  onClick={() => setActiveWrit(isActive ? null : writ.id)}
                  className={`card p-5 text-left border-l-4 ${colors.border} ${colors.bg} transition-all hover:shadow-md ${isActive ? "ring-2 ring-saffron-400" : ""}`}
                >
                  <h4 className={`font-display font-bold text-base ${colors.text}`}>{writ.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">{writ.meaning}</p>
                  {isActive && (
                    <div className="mt-3 pt-3 border-t border-current border-opacity-20 space-y-2">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Usage</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">{writ.usage}</div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5">
        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">Judicial Review — India vs. USA</h4>
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-semibold text-slate-600 dark:text-slate-300 mb-2">India</div>
            <ul className="space-y-1 text-slate-500 dark:text-slate-400">
              <li>• Expressly provided (Art. 13, 32, 226)</li>
              <li>• Extended to constitutional amendments via Basic Structure Doctrine</li>
              <li>• Both SC and HC have writ jurisdiction</li>
              <li>• Art. 32 itself is a Fundamental Right</li>
              <li>• PIL allows any person to enforce public rights</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-600 dark:text-slate-300 mb-2">United States</div>
            <ul className="space-y-1 text-slate-500 dark:text-slate-400">
              <li>• Inferred from Art. III (Marbury v Madison, 1803)</li>
              <li>• Cannot review constitutional amendments</li>
              <li>• Only SCOTUS has federal constitutional review</li>
              <li>• No equivalent of Art. 32/226 writ jurisdiction</li>
              <li>• No PIL — requires &ldquo;standing&rdquo; doctrine</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
