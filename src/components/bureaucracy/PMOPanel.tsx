"use client";

import { useState } from "react";
interface OrgNode { id: string; title: string; subtitle: string; role: string; basis: string; children: string[]; parent?: string }

const PMO_NODES: OrgNode[] = [
  { id: "pm",            title: "Prime Minister",                       subtitle: "Constitutional head of govt (Art. 75)",                role: "Sets policy direction, chairs Cabinet, leads external affairs",                                                                                                                      basis: "Art. 74, 75 — Council of Ministers; Art. 78 — PM's duties to President",   children: ["principal-sec", "nsa", "psa", "eac"] },
  { id: "principal-sec", title: "Principal Secretary to PM",            subtitle: "Most senior IAS officer in PMO",                        role: "Coordinates all ministerial and administrative work reaching PM. De facto head of PMO. Critical link between PM and bureaucracy.",                                           basis: "IAS officer deputed to PMO",                                                  children: ["js-economic", "js-infra", "js-social", "js-coord"], parent: "pm" },
  { id: "nsa",           title: "National Security Advisor (NSA)",      subtitle: "Heads National Security Council Secretariat",           role: "Coordinates intelligence, foreign policy, defence, and internal security for PM. Chairs Strategic Policy Group.",                                                          basis: "Executive order; heads NSC Secretariat (1999)",                               children: ["dep-nsa"], parent: "pm" },
  { id: "psa",           title: "Principal Scientific Advisor",         subtitle: "Science & Technology policy",                           role: "Advises PM on science, technology, innovation, and deep-tech policy. Coordinates with DST, DRDO, CSIR.",                                                                  basis: "Executive appointment",                                                        children: [], parent: "pm" },
  { id: "eac",           title: "Economic Advisory Council to PM",      subtitle: "PM-EAC (Economic advisors)",                            role: "Provides independent economic analysis and advice. Prepares Economic White Papers. Members are eminent economists.",                                                        basis: "Executive order",                                                              children: [], parent: "pm" },
  { id: "dep-nsa",       title: "Deputy NSA (3 posts)",                 subtitle: "NSC Secretariat",                                       role: "Handles specific security dossiers — cyber, nuclear, counter-terror, China, Pakistan. One Deputy NSA oversees Pakistan/Afghanistan; another handles economic/energy security.", basis: "NSC Secretariat",                                                              children: [], parent: "nsa" },
  { id: "js-economic",   title: "Joint Secretary (Economic Division)",  subtitle: "Monitors economic ministries",                          role: "Tracks Finance, Commerce, Industry, MSME ministries. Processes inter-ministerial references for PM's intervention.",                                                         basis: "IAS/IES officer deputed to PMO",                                               children: [], parent: "principal-sec" },
  { id: "js-infra",      title: "Joint Secretary (Infrastructure)",     subtitle: "Monitors infra sectors",                                role: "Tracks Railways, Roads, Ports, Civil Aviation, Power, Petroleum. Monitors flagship infra programmes.",                                                                      basis: "IAS officer",                                                                  children: [], parent: "principal-sec" },
  { id: "js-social",     title: "Joint Secretary (Social Sectors)",     subtitle: "Health, Education, Rural Development",                  role: "Monitors MoHFW, MoE, MoRD, MoSJE. Reviews implementation of flagship social schemes (PMAY, Swachh Bharat, etc.).",                                                    basis: "IAS officer",                                                                  children: [], parent: "principal-sec" },
  { id: "js-coord",      title: "OSD / Joint Secretary (Coordination)", subtitle: "Cabinet coordination, RTI, public grievances",          role: "Manages PM's public interface — CPGRAMS grievances, PMO's own RTI replies, press coordination, protocol.",                                                                basis: "IAS / IIS officer",                                                            children: [], parent: "principal-sec" },
];

const DEPTH_COLORS: Record<number, string> = {
  0: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-amber-400",
  1: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-400",
  2: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-400",
};

function getDepth(id: string): number {
  const node = PMO_NODES.find((n) => n.id === id);
  if (!node || !node.parent) return 0;
  return 1 + getDepth(node.parent);
}

function NodeCard({ node, isSelected, onSelect }: { node: OrgNode; isSelected: boolean; onSelect: () => void }) {
  const depth = getDepth(node.id);
  const color = DEPTH_COLORS[Math.min(depth, 2)];
  return (
    <button
      onClick={onSelect}
      className={`text-left w-full rounded-xl border-l-4 p-3 transition-all ${color} ${isSelected ? "ring-2 ring-saffron-400 shadow-md" : "hover:shadow-sm"}`}
    >
      <div className="font-semibold text-xs leading-snug">{node.title}</div>
      <div className="text-[10px] opacity-70 mt-0.5">{node.subtitle}</div>
    </button>
  );
}

export function PMOPanel() {
  const [selected, setSelected] = useState<string>("pm");

  const pm = PMO_NODES.find((n) => n.id === "pm")!;
  const principalSec = PMO_NODES.find((n) => n.id === "principal-sec")!;
  const l1Direct = pm.children.filter((id) => id !== "principal-sec").map((id) => PMO_NODES.find((n) => n.id === id)!).filter(Boolean);
  const jsSubs = principalSec.children.map((id) => PMO_NODES.find((n) => n.id === id)!).filter(Boolean);
  const nsaSubs = PMO_NODES.filter((n) => n.parent === "nsa");
  const selectedNode = PMO_NODES.find((n) => n.id === selected)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
        <h3 className="font-bold text-amber-900 dark:text-amber-300 text-sm mb-1">Prime Minister&apos;s Office (PMO)</h3>
        <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
          The PMO is the apex executive secretariat. It does not administer programmes directly but coordinates between the PM and all Union Ministries. Click any role below to explore details.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Org tree */}
        <div className="space-y-4">
          {/* PM */}
          <NodeCard node={pm} isSelected={selected === "pm"} onSelect={() => setSelected("pm")} />

          {/* L1 row */}
          <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-4">
            {/* Principal Secretary branch */}
            <NodeCard node={principalSec} isSelected={selected === "principal-sec"} onSelect={() => setSelected("principal-sec")} />
            <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2 tracking-wide">Joint Secretaries (under Principal Sec)</div>
              <div className="grid sm:grid-cols-2 gap-2">
                {jsSubs.map((n) => (
                  <NodeCard key={n.id} node={n} isSelected={selected === n.id} onSelect={() => setSelected(n.id)} />
                ))}
              </div>
            </div>

            {/* NSA + other L1 */}
            <div className="grid sm:grid-cols-2 gap-2">
              {l1Direct.map((node) => (
                <div key={node.id} className="space-y-2">
                  <NodeCard node={node} isSelected={selected === node.id} onSelect={() => setSelected(node.id)} />
                  {node.id === "nsa" && nsaSubs.map((sub) => (
                    <div key={sub.id} className="pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                      <NodeCard node={sub} isSelected={selected === sub.id} onSelect={() => setSelected(sub.id)} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selectedNode && (
          <div className="card p-6 space-y-4">
            <div>
              <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-base">{selectedNode.title}</h3>
              <div className="text-xs text-slate-500 mt-1">{selectedNode.subtitle}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5">Role</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selectedNode.role}</p>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5">Constitutional / Legal Basis</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 rounded-lg px-3 py-2 font-mono">{selectedNode.basis}</p>
            </div>
            {selectedNode.children.length > 0 && (
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5">Supervises</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.children.map((cid) => {
                    const child = PMO_NODES.find((n) => n.id === cid);
                    return child ? (
                      <button key={cid} onClick={() => setSelected(cid)}
                        className="px-2.5 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 transition-colors">
                        {child.title}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PMO facts */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { v: "~500", l: "PMO Staff", s: "IAS + IPS + specialists" },
          { v: "Art. 74", l: "Constitutional Basis", s: "Council of Ministers aids PM" },
          { v: "7, RCR", l: "Location", s: "7 Race Course Road, New Delhi" },
        ].map((f) => (
          <div key={f.l} className="card p-4 text-center">
            <div className="text-lg font-display font-bold text-amber-700 dark:text-amber-300">{f.v}</div>
            <div className="text-xs text-slate-500 mt-0.5">{f.l}</div>
            <div className="text-[10px] text-slate-400">{f.s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
