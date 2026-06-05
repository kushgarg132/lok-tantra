"use client";

import { useState } from "react";
import { EntityAvatar } from "@/components/media/EntityAvatar";
import { InstitutionBadge } from "@/components/media/InstitutionBadge";

interface PowerNodeDTO {
  id: string;
  name: string;
  type: string;
  level: string;
  branch: string;
  parent: string | null;
  children: string[];
  powers: string[];
  constitutionalArticle: string | null;
  appointedBy: string | null;
  removableBy: string | null;
  reportsTo: string | null;
  logoUrl?: string | null;
  currentHolder?: {
    id: string;
    name: string;
    designation: string;
    party?: string;
    photoUrl?: string | null;
    partyColor?: string;
  } | null;
}

type ViewMode = "hierarchy" | "relationships" | "appointments";

const branchColorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  executive: { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  legislature: { bg: "bg-saffron-50 dark:bg-saffron-900/20", border: "border-saffron-200 dark:border-saffron-800", text: "text-saffron-700 dark:text-saffron-400", dot: "bg-saffron-500" },
  judiciary: { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  independent: { bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200 dark:border-purple-800", text: "text-purple-700 dark:text-purple-400", dot: "bg-purple-500" },
};

const defaultColors = { bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-200 dark:border-slate-700", text: "text-slate-700 dark:text-slate-400", dot: "bg-slate-500" };

function getNodeColors(node: PowerNodeDTO) {
  if (node.id === "people" || node.id === "constitution") return { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-300 dark:border-amber-800", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" };
  if (node.branch && branchColorMap[node.branch]) return branchColorMap[node.branch];
  if (["eci", "cag", "upsc"].includes(node.id)) return branchColorMap.independent;
  return defaultColors;
}

export function PowerHierarchyExplorer({ initialNodes }: { initialNodes: PowerNodeDTO[] }) {
  const POWER_HIERARCHY = initialNodes;
  const [selectedNode, setSelectedNode] = useState<PowerNodeDTO | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["people", "constitution", "president", "parliament", "supreme-court"]));
  const [viewMode, setViewMode] = useState<ViewMode>("hierarchy");
  const [searchQuery, setSearchQuery] = useState("");

  const nodeMap = new Map(POWER_HIERARCHY.map((n) => [n.id, n]));

  function toggleExpand(id: string) {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function getRootNodes() {
    return POWER_HIERARCHY.filter((n) => !n.parent);
  }

  function getChildren(parentId: string) {
    return POWER_HIERARCHY.filter((n) => n.parent === parentId);
  }

  function filteredNodes() {
    if (!searchQuery) return null;
    return POWER_HIERARCHY.filter(
      (n) =>
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.powers.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const searchResults = filteredNodes();

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Tree View */}
        <div className="flex-1 min-w-0">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {(["hierarchy", "relationships", "appointments"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    viewMode === mode
                      ? "bg-saffron-500 text-white"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes, powers..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-saffron-400"
              />
            </div>

            <button
              onClick={() => setExpandedNodes(new Set(POWER_HIERARCHY.map((n) => n.id)))}
              className="px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpandedNodes(new Set())}
              className="px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            >
              Collapse All
            </button>
          </div>

          {/* Search Results */}
          {searchResults ? (
            <div className="space-y-2">
              <p className="text-sm text-slate-500 mb-3">{searchResults.length} results for &ldquo;{searchQuery}&rdquo;</p>
              {searchResults.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  isSelected={selectedNode?.id === node.id}
                  onClick={() => setSelectedNode(node)}
                  depth={0}
                />
              ))}
            </div>
          ) : (
            /* Tree View */
            <div className="space-y-1">
              {viewMode === "hierarchy" && getRootNodes().map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedId={selectedNode?.id ?? null}
                  expandedNodes={expandedNodes}
                  onSelect={setSelectedNode}
                  onToggle={toggleExpand}
                  getChildren={getChildren}
                />
              ))}

              {viewMode === "relationships" && (
                <div className="space-y-4">
                  <RelationshipView title="Who Reports to Whom" type="reportsTo" nodes={POWER_HIERARCHY} />
                  <RelationshipView title="Who Supervises Whom" type="supervises" nodes={POWER_HIERARCHY} />
                </div>
              )}

              {viewMode === "appointments" && (
                <div className="space-y-4">
                  <AppointmentView nodes={POWER_HIERARCHY} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Detail Panel */}
        <div className="lg:w-[420px] lg:sticky lg:top-24 lg:self-start">
          {selectedNode ? (
            <NodeDetailPanel node={selectedNode} nodeMap={nodeMap} onNavigate={(id) => {
              const node = nodeMap.get(id);
              if (node) setSelectedNode(node);
            }} />
          ) : (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-saffron-500">
                  <circle cx="12" cy="5" r="3" /><line x1="12" y1="8" x2="12" y2="14" />
                  <circle cx="6" cy="19" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="12" y1="14" x2="6" y2="16" /><line x1="12" y1="14" x2="18" y2="16" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">Select a Node</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Click on any institution, position, or body in the hierarchy to see its full details — powers, constitutional basis, current holders, and relationships.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TreeNode({
  node,
  depth,
  selectedId,
  expandedNodes,
  onSelect,
  onToggle,
  getChildren,
}: {
  node: PowerNodeDTO;
  depth: number;
  selectedId: string | null;
  expandedNodes: Set<string>;
  onSelect: (n: PowerNodeDTO) => void;
  onToggle: (id: string) => void;
  getChildren: (id: string) => PowerNodeDTO[];
}) {
  const children = getChildren(node.id);
  const hasChildren = children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedId === node.id;
  const colors = getNodeColors(node);

  return (
    <div style={{ marginLeft: `${depth * 20}px` }}>
      <div className="flex items-center gap-1">
        {/* Expand toggle */}
        <button
          onClick={() => hasChildren && onToggle(node.id)}
          className={`w-6 h-6 flex items-center justify-center rounded ${
            hasChildren ? "hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer" : "cursor-default"
          }`}
        >
          {hasChildren && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`text-slate-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          )}
        </button>

        {/* Node card */}
        <NodeCard
          node={node}
          isSelected={isSelected}
          onClick={() => onSelect(node)}
          depth={depth}
        />
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="mt-1 relative">
          <div className="absolute left-[10px] top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" style={{ marginLeft: `${depth * 20}px` }} />
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedNodes={expandedNodes}
              onSelect={onSelect}
              onToggle={onToggle}
              getChildren={getChildren}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NodeCard({
  node,
  isSelected,
  onClick,
  depth,
}: {
  node: PowerNodeDTO;
  isSelected: boolean;
  onClick: () => void;
  depth: number;
}) {
  const colors = getNodeColors(node);

  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
        isSelected
          ? `${colors.bg} ${colors.border} border-2 shadow-sm`
          : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border-2 border-transparent"
      }`}
    >
      {/* Node icon: person photo > institution logo > color dot */}
      {node.currentHolder ? (
        <EntityAvatar
          name={node.currentHolder.name}
          photoUrl={node.currentHolder.photoUrl}
          color={node.currentHolder.partyColor ?? colors.dot.replace("bg-", "#")}
          size="xs"
        />
      ) : (
        <InstitutionBadge
          name={node.name}
          logoUrl={node.logoUrl}
          branch={node.branch}
          size="sm"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
          {node.name}
        </div>
        {node.currentHolder && (
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {node.currentHolder.name}
          </div>
        )}
      </div>
      {node.constitutionalArticle && (
        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">
          {node.constitutionalArticle}
        </span>
      )}
    </button>
  );
}

function NodeDetailPanel({
  node,
  nodeMap,
  onNavigate,
}: {
  node: PowerNodeDTO;
  nodeMap: Map<string, PowerNodeDTO>;
  onNavigate: (id: string) => void;
}) {
  const colors = getNodeColors(node);

  return (
    <div className={`card overflow-hidden`}>
      {/* Header */}
      <div className={`p-6 ${colors.bg} border-b ${colors.border}`}>
        <div className="flex items-start gap-3">
          <InstitutionBadge
            name={node.name}
            logoUrl={node.logoUrl}
            branch={node.branch}
            size="lg"
          />
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-slate-100">
              {node.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${colors.bg} ${colors.text} text-[10px]`}>
                {node.branch ?? node.level}
              </span>
              <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[10px]">
                {node.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Current Holder */}
        {node.currentHolder && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Current Holder
            </h4>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <EntityAvatar
                name={node.currentHolder.name}
                photoUrl={node.currentHolder.photoUrl}
                color={node.currentHolder.partyColor}
                size="lg"
              />
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {node.currentHolder.name}
                </div>
                <div className="text-xs text-slate-500">
                  {node.currentHolder.designation}
                  {node.currentHolder.party && ` · ${node.currentHolder.party}`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Constitutional Basis */}
        {node.constitutionalArticle && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Constitutional Basis
            </h4>
            <div className="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-800 dark:text-amber-300 font-mono">
              {node.constitutionalArticle}
            </div>
          </div>
        )}

        {/* Powers */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Powers & Functions
          </h4>
          <ul className="space-y-1.5">
            {node.powers.map((power) => (
              <li key={power} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-saffron-500 mt-0.5 flex-shrink-0">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                {power}
              </li>
            ))}
          </ul>
        </div>

        {/* Relationships */}
        <div className="space-y-3">
          {node.appointedBy && (
            <RelationshipBadge label="Appointed by" value={node.appointedBy} />
          )}
          {node.removableBy && (
            <RelationshipBadge label="Removable by" value={node.removableBy} />
          )}
          {node.reportsTo && (
            <RelationshipBadge label="Reports to" value={node.reportsTo} />
          )}
        </div>

        {/* Navigate to related nodes */}
        {node.children && node.children.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Subordinate Nodes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {node.children.map((childId) => {
                const child = nodeMap.get(childId);
                if (!child) return null;
                return (
                  <button
                    key={childId}
                    onClick={() => onNavigate(childId)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-saffron-100 dark:hover:bg-saffron-900/30 hover:text-saffron-700 dark:hover:text-saffron-400 transition-colors"
                  >
                    {child.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Parent */}
        {node.parent && nodeMap.get(node.parent) && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Reports To
            </h4>
            <button
              onClick={() => onNavigate(node.parent!)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-700 dark:text-slate-300 hover:bg-saffron-50 dark:hover:bg-saffron-900/20 transition-colors w-full text-left"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-saffron-500">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {nodeMap.get(node.parent!)?.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RelationshipBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium text-slate-900 dark:text-slate-100 text-right max-w-[200px]">{value}</span>
    </div>
  );
}

function RelationshipView({ title, type, nodes }: { title: string; type: string; nodes: PowerNodeDTO[] }) {
  const relationships = nodes
    .filter((n) => (n as unknown as Record<string, unknown>)[type])
    .map((n) => ({ from: n.name, to: (n as unknown as Record<string, unknown>)[type] as string }));

  return (
    <div className="card p-5">
      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">{title}</h3>
      <div className="space-y-2">
        {relationships.map((r, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="font-medium text-slate-900 dark:text-slate-100 min-w-[180px]">{r.from}</span>
            <svg width="20" height="12" viewBox="0 0 20 12" className="text-saffron-400 flex-shrink-0">
              <path d="M0 6h16M12 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="text-slate-600 dark:text-slate-400">{r.to}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppointmentView({ nodes }: { nodes: PowerNodeDTO[] }) {
  const appointments = nodes
    .filter((n) => n.appointedBy)
    .map((n) => ({ position: n.name, appointedBy: n.appointedBy!, removableBy: n.removableBy }));

  return (
    <div className="card p-5">
      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">
        Appointment & Removal Powers
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-2 pr-4 font-semibold text-slate-500 text-xs uppercase">Position</th>
              <th className="text-left py-2 pr-4 font-semibold text-slate-500 text-xs uppercase">Appointed By</th>
              <th className="text-left py-2 font-semibold text-slate-500 text-xs uppercase">Removable By</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.position} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2.5 pr-4 font-medium text-slate-900 dark:text-slate-100">{a.position}</td>
                <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-400">{a.appointedBy}</td>
                <td className="py-2.5 text-slate-600 dark:text-slate-400">{a.removableBy ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
