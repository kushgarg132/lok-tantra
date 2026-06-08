"use client";

import { useState, useMemo } from "react";
import type { CaseDB } from "./JudiciaryDashboard";

// Visualization layout config — x/y coordinates are manually placed editorial positions
const CASE_CATEGORY_CONFIG: Record<string, { color: string; bg: string; text: string; label: string }> = {
  basic_structure:    { color: "#f59e0b", bg: "bg-amber-100 dark:bg-amber-900/30",   text: "text-amber-700 dark:text-amber-300",   label: "Basic Structure" },
  fundamental_rights: { color: "#3b82f6", bg: "bg-blue-100 dark:bg-blue-900/30",     text: "text-blue-700 dark:text-blue-300",     label: "Fundamental Rights" },
  federalism:         { color: "#8b5cf6", bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-300", label: "Federalism" },
  social_justice:     { color: "#10b981", bg: "bg-emerald-100 dark:bg-emerald-900/30",text: "text-emerald-700 dark:text-emerald-300",label: "Social Justice" },
  environment:        { color: "#22c55e", bg: "bg-green-100 dark:bg-green-900/30",   text: "text-green-700 dark:text-green-300",   label: "Environment" },
  pil:                { color: "#ec4899", bg: "bg-pink-100 dark:bg-pink-900/30",     text: "text-pink-700 dark:text-pink-300",     label: "PIL" },
  gender:             { color: "#f43f5e", bg: "bg-rose-100 dark:bg-rose-900/30",     text: "text-rose-700 dark:text-rose-300",     label: "Gender" },
  privacy:            { color: "#64748b", bg: "bg-slate-100 dark:bg-slate-800",      text: "text-slate-700 dark:text-slate-300",   label: "Privacy" },
  speech:             { color: "#f97316", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", label: "Speech" },
};

interface GraphNode {
  id: string; label: string; year: number;
  category: string; x: number; y: number;
  size: "xl" | "lg" | "md" | "sm";
  overruled?: boolean;
}

interface GraphEdge { from: string; to: string }

// Hand-curated citation influence graph — layout is editorial visualization config
const GRAPH_NODES: GraphNode[] = [
  { id: "gopalan",     label: "A.K. Gopalan\n1950",      year: 1950, category: "fundamental_rights", x: 60,  y: 200, size: "lg" },
  { id: "shankari",    label: "Shankari\nPrasad\n1951",  year: 1951, category: "basic_structure",    x: 90,  y: 310, size: "md" },
  { id: "sajjan",      label: "Sajjan Singh\n1964",       year: 1964, category: "basic_structure",    x: 170, y: 310, size: "md" },
  { id: "golak",       label: "Golaknath\n1967",          year: 1967, category: "basic_structure",    x: 220, y: 230, size: "lg" },
  { id: "cooper",      label: "Cooper\n1970",             year: 1970, category: "fundamental_rights", x: 260, y: 330, size: "md" },
  { id: "kesavananda", label: "Kesavananda\n1973",        year: 1973, category: "basic_structure",    x: 330, y: 200, size: "xl" },
  { id: "maneka",      label: "Maneka\nGandhi\n1978",    year: 1978, category: "fundamental_rights", x: 420, y: 120, size: "xl" },
  { id: "minerva",     label: "Minerva\nMills\n1980",    year: 1980, category: "basic_structure",    x: 440, y: 270, size: "lg" },
  { id: "bandhua",     label: "Bandhua\n1984",            year: 1984, category: "pil",                x: 490, y: 350, size: "md" },
  { id: "mc_mehta",    label: "M.C. Mehta\n1987",         year: 1987, category: "environment",        x: 540, y: 380, size: "md" },
  { id: "indra",       label: "Indra\nSawhney\n1992",    year: 1992, category: "social_justice",     x: 580, y: 220, size: "lg" },
  { id: "sr_bommai",   label: "S.R. Bommai\n1994",        year: 1994, category: "federalism",         x: 620, y: 310, size: "lg" },
  { id: "vishaka",     label: "Vishaka\n1997",            year: 1997, category: "gender",             x: 640, y: 130, size: "md" },
  { id: "puttaswamy",  label: "Puttaswamy\n2017",         year: 2017, category: "privacy",            x: 710, y: 200, size: "xl" },
  { id: "navtej",      label: "Navtej Johar\n2018",       year: 2018, category: "fundamental_rights", x: 740, y: 340, size: "lg" },
];

const GRAPH_EDGES: GraphEdge[] = [
  { from: "gopalan",     to: "maneka" },
  { from: "shankari",    to: "sajjan" },
  { from: "sajjan",      to: "golak" },
  { from: "golak",       to: "kesavananda" },
  { from: "cooper",      to: "kesavananda" },
  { from: "kesavananda", to: "minerva" },
  { from: "maneka",      to: "puttaswamy" },
  { from: "maneka",      to: "vishaka" },
  { from: "maneka",      to: "navtej" },
  { from: "minerva",     to: "sr_bommai" },
  { from: "bandhua",     to: "mc_mehta" },
  { from: "indra",       to: "sr_bommai" },
  { from: "kesavananda", to: "indra" },
  { from: "puttaswamy",  to: "navtej" },
];

const W = 760;
const H = 420;
const NODE_R: Record<GraphNode["size"], number> = { xl: 22, lg: 16, md: 12, sm: 8 };

function edgePath(from: GraphNode, to: GraphNode): string {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 30;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

function arrowHead(from: GraphNode, to: GraphNode, r: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = to.x - ux * (r + 4);
  const ay = to.y - uy * (r + 4);
  const px = -uy * 5, py = ux * 5;
  return `M ${ax - ux * 10} ${ay - uy * 10} L ${ax + px} ${ay + py} L ${ax} ${ay} L ${ax - px} ${ay - py} Z`;
}

interface Props { cases: CaseDB[] }

export function JudgmentGraphPanel({ cases }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const activeId = selected || hovered;

  const connectedIds = useMemo(() => {
    if (!activeId) return new Set<string>();
    const ids = new Set<string>();
    GRAPH_EDGES.forEach((e) => {
      if (e.from === activeId || e.to === activeId) {
        ids.add(e.from);
        ids.add(e.to);
      }
    });
    return ids;
  }, [activeId]);

  const nodeById = useMemo(() => {
    const m: Record<string, GraphNode> = {};
    GRAPH_NODES.forEach((n) => { m[n.id] = n; });
    return m;
  }, []);

  const activeNode = activeId ? nodeById[activeId] : null;

  // Enrich detail panel with DB case data matched by name keyword
  const dbCase = useMemo(() => {
    if (!activeNode) return null;
    const keyword = activeNode.label.split("\n")[0].toLowerCase().trim();
    return cases.find((c) => c.name.toLowerCase().includes(keyword)) ?? null;
  }, [activeNode, cases]);

  const activeCaseEdges = activeId ? GRAPH_EDGES.filter((e) => e.from === activeId || e.to === activeId) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">Judgment Citation Network</h3>
        <span className="text-xs text-slate-400">Arrows show influence — click/hover a case to highlight connections</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(CASE_CATEGORY_CONFIG).map(([key, cfg]) => {
          if (!GRAPH_NODES.some((n) => n.category === key)) return null;
          return (
            <span key={key} className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.bg} ${cfg.text}`}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
              {cfg.label}
            </span>
          );
        })}
      </div>

      <div className="card overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 520 }}>
          {[1950, 1960, 1970, 1980, 1990, 2000, 2010, 2018].map((yr) => {
            const x = 40 + ((yr - 1950) / 70) * 680;
            return (
              <g key={yr}>
                <line x1={x} y1={20} x2={x} y2={H - 20} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-slate-700" />
                <text x={x} y={H - 8} textAnchor="middle" fontSize="8" fill="#94a3b8">{yr}</text>
              </g>
            );
          })}

          {GRAPH_EDGES.map((edge, i) => {
            const from = nodeById[edge.from];
            const to = nodeById[edge.to];
            if (!from || !to) return null;
            const isActive = activeId && (edge.from === activeId || edge.to === activeId);
            const r = NODE_R[to.size];
            const catColor = CASE_CATEGORY_CONFIG[from.category]?.color ?? "#94a3b8";
            return (
              <g key={i} opacity={activeId && !isActive ? 0.08 : isActive ? 0.9 : 0.35}>
                <path d={edgePath(from, to)} fill="none" stroke={catColor} strokeWidth={isActive ? 2 : 1.2} />
                <path d={arrowHead(from, to, r)} fill={catColor} />
              </g>
            );
          })}

          {GRAPH_NODES.map((node) => {
            const r = NODE_R[node.size];
            const catCfg = CASE_CATEGORY_CONFIG[node.category];
            const isActive = node.id === activeId;
            const isConnected = connectedIds.has(node.id);
            const isDimmed = activeId && !isActive && !isConnected;
            const lines = node.label.split("\n");
            return (
              <g
                key={node.id}
                onClick={() => setSelected(selected === node.id ? null : node.id)}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
                opacity={isDimmed ? 0.15 : 1}
              >
                {isActive && <circle cx={node.x} cy={node.y} r={r + 5} fill="none" stroke={catCfg.color} strokeWidth="2" opacity="0.4" />}
                <circle cx={node.x} cy={node.y} r={r} fill={catCfg.color} opacity={node.overruled ? 0.45 : 1}
                  stroke={node.overruled ? "#dc2626" : "white"} strokeWidth={node.overruled ? "1.5" : "1"}
                  strokeDasharray={node.overruled ? "3 2" : undefined} />
                {node.overruled && (
                  <g>
                    <line x1={node.x - r * 0.4} y1={node.y - r * 0.4} x2={node.x + r * 0.4} y2={node.y + r * 0.4} stroke="#dc2626" strokeWidth="1.5" />
                    <line x1={node.x + r * 0.4} y1={node.y - r * 0.4} x2={node.x - r * 0.4} y2={node.y + r * 0.4} stroke="#dc2626" strokeWidth="1.5" />
                  </g>
                )}
                {(node.size === "xl" || node.size === "lg" || isActive) && (
                  <text x={node.x} y={node.y + r + 10} textAnchor="middle" fontSize={node.size === "xl" ? "8" : "7"} fontWeight="600" fill="#475569" className="dark:fill-slate-300">
                    {lines[0]}
                  </text>
                )}
                {(node.size === "xl" || node.size === "lg" || isActive) && lines[1] && (
                  <text x={node.x} y={node.y + r + 18} textAnchor="middle" fontSize="7" fill="#94a3b8">{lines[1]}</text>
                )}
                {(node.size === "sm" || node.size === "md") && <title>{lines.join(" ")}</title>}
              </g>
            );
          })}
        </svg>
      </div>

      {activeNode && (
        <div className="card p-5 border-l-4" style={{ borderLeftColor: CASE_CATEGORY_CONFIG[activeNode.category]?.color }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-slate-900 dark:text-slate-100">
                {dbCase?.name ?? activeNode.label.replace(/\n/g, " ")}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${CASE_CATEGORY_CONFIG[activeNode.category]?.bg} ${CASE_CATEGORY_CONFIG[activeNode.category]?.text}`}>
                  {CASE_CATEGORY_CONFIG[activeNode.category]?.label}
                </span>
                <span className="text-xs text-slate-400">{activeNode.year}</span>
                {dbCase?.citation && <span className="text-xs font-mono text-slate-400">{dbCase.citation}</span>}
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              Close ×
            </button>
          </div>

          {dbCase?.summary && (
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{dbCase.summary}</p>
          )}
          {dbCase?.impact && (
            <p className="mt-2 text-xs text-slate-500 italic leading-relaxed">{dbCase.impact}</p>
          )}

          {activeCaseEdges.length > 0 && (
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {activeCaseEdges.filter((e) => e.from === activeId).length > 0 && (
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Influenced →</div>
                  <div className="space-y-1">
                    {activeCaseEdges.filter((e) => e.from === activeId).map((e) => {
                      const n = nodeById[e.to];
                      if (!n) return null;
                      return (
                        <button key={e.to} onClick={() => setSelected(e.to)}
                          className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CASE_CATEGORY_CONFIG[n.category]?.color }} />
                          {n.label.replace(/\n/g, " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {activeCaseEdges.filter((e) => e.to === activeId).length > 0 && (
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-2">← Influenced by</div>
                  <div className="space-y-1">
                    {activeCaseEdges.filter((e) => e.to === activeId).map((e) => {
                      const n = nodeById[e.from];
                      if (!n) return null;
                      return (
                        <button key={e.from} onClick={() => setSelected(e.from)}
                          className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CASE_CATEGORY_CONFIG[n.category]?.color }} />
                          {n.label.replace(/\n/g, " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-slate-400 flex flex-wrap gap-4">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-400" />Larger circle = greater precedential importance</span>
        <span className="flex items-center gap-1.5">
          <svg width="20" height="10" viewBox="0 0 20 10">
            <path d="M 0 5 Q 10 0 20 5" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <polygon points="15,2 20,5 15,8" fill="#94a3b8" />
          </svg>
          Arrow = A influenced B
        </span>
      </div>
    </div>
  );
}
