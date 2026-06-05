"use client";

import { useEffect, useRef, useState } from "react";
import type cytoscape from "cytoscape";
import { CYTOSCAPE_ELEMENTS, PRESET_POSITIONS, PARTY_NODES, ALLIANCE_NODES, type PoliticalNode } from "@/data/graph/political";

const CONTAINER_H = 520;

export function PoliticalRelationshipMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cyRef = useRef<any>(null);
  const [selected, setSelected] = useState<PoliticalNode | null>(null);
  const [ready, setReady]       = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    let destroyed = false;

    import("cytoscape").then((mod) => {
      if (destroyed || !containerRef.current) return;
      const cytoscape = mod.default;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cy = cytoscape({
        container: containerRef.current,
        elements: CYTOSCAPE_ELEMENTS,
        layout: {
          name: "preset",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          positions: (node: any) => PRESET_POSITIONS[node.id()] ?? { x: 420, y: 290 },
        } as cytoscape.LayoutOptions,
        style: [
          // Alliance nodes (large circles)
          {
            selector: "node[type = 'alliance']",
            style: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              "width":              (el: any) => Math.max(60, Math.sqrt(el.data("seats")) * 3.5) as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              "height":             (el: any) => Math.max(60, Math.sqrt(el.data("seats")) * 3.5) as any,
              "background-color":   "data(color)",
              "background-opacity": 0.18,
              "border-color":       "data(color)",
              "border-width":       2.5,
              "label":              "data(label)",
              "color":              "data(color)",
              "font-size":          15,
              "font-weight":        700,
              "text-valign":        "center",
              "text-halign":        "center",
            },
          },
          // Party nodes
          {
            selector: "node[type = 'party']",
            style: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              "width":              (el: any) => Math.max(20, Math.sqrt(el.data("seats")) * 4.5) as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              "height":             (el: any) => Math.max(20, Math.sqrt(el.data("seats")) * 4.5) as any,
              "background-color":   "data(color)",
              "border-color":       "#fff",
              "border-width":       1.5,
              "label":              "data(label)",
              "color":              "#1E293B",
              "font-size":          8,
              "font-weight":        600,
              "text-valign":        "center",
              "text-halign":        "center",
              "text-wrap":          "wrap",
              "text-max-width":     "50px",
            },
          },
          // Edges
          {
            selector: "edge",
            style: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              "width":              (el: any) => Math.max(0.8, el.data("strength") / 30) as any,
              "line-color":         "#CBD5E1",
              "opacity":            0.6,
              "curve-style":        "straight",
            },
          },
          // Selected
          {
            selector: ".selected",
            style: {
              "border-width": 3.5,
              "border-color": "#0F172A",
              "opacity":      1,
              "z-index":      10,
            },
          },
          // Dimmed
          {
            selector: ".dimmed",
            style: { opacity: 0.15 },
          },
        ],
        zoom: 1,
        pan: { x: 0, y: 0 },
        boxSelectionEnabled: false,
        userZoomingEnabled: true,
        userPanningEnabled: true,
        minZoom: 0.4,
        maxZoom: 3,
      });

      cyRef.current = cy;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cy.on("tap", "node", (evt: any) => {
        const id    = evt.target.id();
        const type  = evt.target.data("type") as string;
        const allNodes = cy.nodes();
        const allEdges = cy.edges();

        allNodes.removeClass("selected dimmed");
        allEdges.removeClass("dimmed");

        if (type === "alliance") {
          // Highlight all member parties
          const members = allNodes.filter(`[alliance = '${evt.target.data("alliance")}']`);
          members.addClass("selected");
          allNodes.not(members).addClass("dimmed");
          allEdges.filter(`[target = '${id}']`).removeClass("dimmed");
        } else {
          evt.target.addClass("selected");
          allNodes.not(evt.target).addClass("dimmed");
        }

        const match =
          PARTY_NODES.find((p) => p.id === id) ??
          ALLIANCE_NODES.find((a) => a.id === id) ??
          null;
        setSelected(match);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cy.on("tap", (evt: any) => {
        if (evt.target.group && evt.target.group() === "nodes") return;
        cy.nodes().removeClass("selected dimmed");
        cy.edges().removeClass("dimmed");
        setSelected(null);
      });

      setReady(true);
    });

    return () => {
      destroyed = true;
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 items-center text-xs text-slate-500">
        {ALLIANCE_NODES.map((a) => (
          <span key={a.id} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2" style={{ background: a.color + "30", borderColor: a.color }} />
            <strong style={{ color: a.color }}>{a.label}</strong> ({a.seats} seats)
          </span>
        ))}
        <span className="ml-auto text-slate-400">Bubble size = seats · Drag to pan · Scroll to zoom</span>
      </div>

      <div className="flex gap-4 items-start flex-col lg:flex-row">
        <div
          className="flex-1 card overflow-hidden p-0 relative"
          style={{ height: CONTAINER_H }}
        >
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
              Loading political map…
            </div>
          )}
          <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
        </div>

        {selected && (
          <div className="lg:w-64 card p-4 space-y-3 shrink-0">
            <div>
              <div
                className="text-sm font-bold"
                style={{ color: selected.color }}
              >
                {selected.type === "alliance" ? "ALLIANCE" : "PARTY"}
              </div>
              <div className="text-xl font-display font-bold text-slate-900 dark:text-slate-100 mt-1">
                {selected.label.split("\n")[0]}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{selected.seats}</div>
                <div className="text-[10px] text-slate-500">LS Seats</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {Math.round((selected.seats / 543) * 100)}%
                </div>
                <div className="text-[10px] text-slate-500">House share</div>
              </div>
            </div>
            <div
              className="h-2 rounded-full"
              style={{ background: `linear-gradient(to right, ${selected.color}, ${selected.color}40)`, width: `${Math.round((selected.seats / 543) * 100)}%` }}
            />
            <p className="text-[11px] text-slate-500">
              {selected.type === "alliance"
                ? `${selected.seats} of 543 Lok Sabha seats — ${selected.seats >= 272 ? "ruling majority" : "opposition"}`
                : `Member of ${selected.alliance} alliance`}
            </p>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        Lok Sabha 2024 results · Click any node to highlight · Alliance boundaries shown by bubble groups
      </p>
    </div>
  );
}
