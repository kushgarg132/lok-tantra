"use client";

import { useState } from "react";
import Link from "next/link";

const nodes = [
  {
    id: "president",
    name: "President of India",
    role: "Head of State",
    holder: "Droupadi Murmu",
    article: "Art. 52-62",
    powers: ["Appoints PM", "Supreme Commander", "Assents to bills", "Emergency powers"],
    level: 0,
    branch: "executive" as const,
  },
  {
    id: "vp",
    name: "Vice President",
    role: "Chairman of Rajya Sabha",
    holder: "Jagdeep Dhankhar",
    article: "Art. 63-71",
    powers: ["Chairs Rajya Sabha", "Acts as President when absent"],
    level: 1,
    branch: "executive" as const,
  },
  {
    id: "pm",
    name: "Prime Minister",
    role: "Head of Government",
    holder: "Narendra Modi",
    article: "Art. 74-75",
    powers: ["Heads Cabinet", "Advises President", "Leader of Lok Sabha majority"],
    level: 1,
    branch: "executive" as const,
  },
  {
    id: "cji",
    name: "Chief Justice of India",
    role: "Head of Judiciary",
    holder: "Sanjiv Khanna",
    article: "Art. 124",
    powers: ["Heads Supreme Court", "Constitutional interpretation", "Judicial review"],
    level: 1,
    branch: "judiciary" as const,
  },
  {
    id: "lok-sabha",
    name: "Speaker, Lok Sabha",
    role: "Presiding Officer",
    holder: "Om Birla",
    article: "Art. 93",
    powers: ["Conducts House business", "Maintains order", "Casting vote"],
    level: 1,
    branch: "legislature" as const,
  },
];

const branchColors = {
  executive: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  judiciary: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  legislature: { bg: "bg-saffron-100 dark:bg-saffron-900/30", text: "text-saffron-700 dark:text-saffron-400", border: "border-saffron-200 dark:border-saffron-800" },
};

export function PowerPreview() {
  const [activeNode, setActiveNode] = useState<string>("president");
  const active = nodes.find((n) => n.id === activeNode)!;
  const colors = branchColors[active.branch];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Left: Info */}
          <div className="flex-1">
            <span className="badge-saffron mb-4">Interactive Preview</span>
            <h2 className="section-heading mt-2">
              Explore the Power Structure
            </h2>
            <p className="section-subheading mt-3">
              Click on any position to see who holds it, what powers they have,
              and which constitutional articles define their authority.
            </p>

            {/* Active node detail */}
            <div className={`mt-8 p-6 rounded-2xl border-2 ${colors.border} ${colors.bg} transition-all`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-slate-100">
                    {active.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {active.role}
                  </p>
                </div>
                <span className={`badge ${colors.bg} ${colors.text}`}>
                  {active.article}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                  {active.holder.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {active.holder}
                  </div>
                  <div className="text-xs text-slate-500">Current holder</div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Key Powers
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {active.powers.map((power) => (
                    <span
                      key={power}
                      className="px-2.5 py-1 rounded-lg bg-white/60 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300"
                    >
                      {power}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/power-structure"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-saffron-500 text-white font-medium text-sm hover:bg-saffron-600 transition-colors"
            >
              Explore Full Structure
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Right: Visual hierarchy */}
          <div className="flex-1 w-full">
            <div className="space-y-3">
              {/* President at top */}
              <div className="flex justify-center">
                <NodeButton
                  node={nodes[0]}
                  isActive={activeNode === nodes[0].id}
                  onClick={() => setActiveNode(nodes[0].id)}
                />
              </div>

              {/* Connector lines */}
              <div className="flex justify-center">
                <div className="w-px h-8 bg-slate-300 dark:bg-slate-600" />
              </div>

              {/* Row of 4 */}
              <div className="flex justify-center">
                <div className="relative flex items-start gap-3">
                  <div className="absolute top-0 left-1/4 right-1/4 h-px bg-slate-300 dark:bg-slate-600" />
                  {nodes.slice(1).map((node) => (
                    <div key={node.id} className="flex flex-col items-center">
                      <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
                      <NodeButton
                        node={node}
                        isActive={activeNode === node.id}
                        onClick={() => setActiveNode(node.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NodeButton({
  node,
  isActive,
  onClick,
}: {
  node: (typeof nodes)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const colors = branchColors[node.branch];
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl border-2 transition-all text-center min-w-[140px] ${
        isActive
          ? `${colors.border} ${colors.bg} shadow-lg scale-105`
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
      }`}
    >
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
        {node.name}
      </div>
      <div className="text-[10px] text-slate-500 mt-0.5">{node.holder}</div>
    </button>
  );
}
