---
stepsCompleted: [1, 2, 3]
inputDocuments:
  - "prds/prd-lok-tantra-2026-06-08/prd.md"
  - "architecture.md"
  - "ux-designs/ux-lok-tantra-2026-06-08/DESIGN.md"
  - "ux-designs/ux-lok-tantra-2026-06-08/EXPERIENCE.md"
---

# lok-tantra - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for lok-tantra's Power Explorer feature, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: A user can open the Power Graph and see the current national-layer structure (President, PM, Union Cabinet & Ministers, central institutions, judiciary apex) centered on the Prime Minister's Office. Initial render completes and is interactive on mobile within the performance budget. Every visible Node displays its current occupant's name and photo (or a clear "vacant"/"unknown" state).

FR-2: A user can tap any Node to expand its directly connected Nodes (superior, subordinate, and peer relationships) without losing their place in the broader graph. Expanding reveals all direct Edges labeled with relationship type. User can collapse back without full reload.

FR-3: A user can see a Person's traced sequence of prior Tenures (Office + date range) in chronological order. Tapping a prior Tenure step navigates Time Travel to that period. Each step displays only Office, dates, and factual mechanism of transition — never narrative framing.

FR-4: A user can see a plain-language description of what an Office can do, sourced from and linked to its Constitutional Citation(s). Every Office displays at least one constitutional grounding or an explicit "convention, not codified" label.

FR-5: A user can see a Person's declared assets, criminal case records, and election history sourced from ADR/MyNeta. Accountability Data displays source and last-updated date. Missing data shown as explicit "not available" state, never silently omitted. Every Person's data renders through the same template regardless of media salience or party.

FR-6: A user can tap a Constitutional Citation attached to an Edge or Office and see a plain-language explanation without leaving the graph view. Opens as overlay preserving graph position. Links to full source text via existing `/constitution` explorer.

FR-7: A user can drag a continuous scrubber to any date from 1947 (or fallback start) to today and the Power Graph re-renders to reflect active Tenures. Each Office resolves to last-known-state. Three states: occupied, vacant, not-yet-established/discontinued. Year-only dates marked as approximate. Re-rendering completes within the interactivity budget.

FR-8: A user can search by Person name, Office title, or party and jump directly to that Node within the current graph view, respecting the selected Time Travel date. Paginated, debounced results.

### Non-Functional Requirements

NFR-1: Performance — initial graph load and re-render must be interactive on mobile within a budget TBD by performance spike (PRD Open Question #1). Pre-approved fallback: anchored-to-transitions scrubber if continuous scrub can't hit the budget.

NFR-2: Neutrality — visual treatment of any Node is determined structurally/chronologically (constitutional rank, tenure dates, hierarchy position), never editorially curated by party, popularity, or current events (PRD §5).

NFR-3: Source-verifiability — every fact carries provenance inline; source attribution, Time Travel date, and citations render visible on every shareable view (PRD §5, CLAUDE.md).

NFR-4: Accessibility — screen-reader graph traversal via connections list, 44px tap targets, prefers-reduced-motion support, color never the only signal for any state (UX EXPERIENCE.md).

NFR-5: Mobile-first responsive — single codebase, touch and small screens first, larger viewports as scale-up (PRD §6).

NFR-6: Comparative symmetry — every Person and Office at equivalent rank receives identical data depth, fields, and template (PRD §5, FR-5).

### Additional Requirements

AR-1: Create a new `Tenure` model in Prisma with fields: id, personId, positionId, startDate, endDate, startDateApproximate, mechanism. Includes temporal indexes (Architecture Decision 1).

AR-2: Replace `Position.currentHolderId` unique FK with a derived query via `getActiveTenure(positionId)`. Migrate all existing reads (Architecture Gap #3).

AR-3: Implement PG→Neo4j sync worker via BullMQ Redis event bus. Queue: `neo4j-sync`. Events published on Tenure create/update/delete. Failed events retry 3x then dead-letter to `neo4j-sync-dlq` (Architecture Decision 3).

AR-4: Code-split Cytoscape.js via `next/dynamic` with `ssr: false`. Page shell SSRs; graph renderer loads dynamically (Architecture Decision 6).

AR-5: Scaffold vitest configuration (vitest.config.ts, test script in package.json). Project currently has zero test files (Architecture Gap #1).

AR-6: Implement client-side Tenure resolver with parity testing against Neo4j Cypher temporal queries. Shared test fixture validates both resolvers return identical results (Architecture §5.1).

AR-7: Temporal graph endpoints bypass GraphService LRU cache (Architecture Gap #4). Cache useful only for static structural queries.

AR-8: Fully replace `/power-structure` route and `PowerHierarchyExplorer` component. Handle migration/redirect (PRD §6, Architecture Constraint #7).

AR-9: Extend GraphService with 3 new methods: `getTemporalSubgraph(date, depth)`, `expandNode(nodeId, date)`, `searchGraph(query, date)` (Architecture §5.6).

AR-10: Create `usePowerExplorerStore` Zustand store for graph state, Tenure cache, active date, focused Node (Architecture §6.3).

### UX Design Requirements

UX-DR1: Implement party-tag color palette — 6 colors in violet→magenta→rose arc (hues 250°–330°, 30% saturation, 48% lightness, 16° intervals) plus overflow neutral gray. Deterministic alphabetical assignment by party abbreviation (DESIGN.md Colors).

UX-DR2: Build `node-card-person` component — circle shape, saffron register, headline typography name, party-tag chip, Office label, persistent provenance line ("Power Graph · [date] · Source: [source]") inside the card frame (DESIGN.md Components).

UX-DR3: Build `node-card-office` component — rounded-square shape, navy register, headline title, occupant inset or state glyph, same provenance line as person card (DESIGN.md Components).

UX-DR4: Build `edge` component — directional line/arc with arrowhead, relationship-type label, optional citation dot in chakra-400 (DESIGN.md Components).

UX-DR5: Build `party-tag-chip` component — rounded-full, neutral surface fill, party color renders only as small leading dot beside data-font abbreviation (DESIGN.md Components).

UX-DR6: Build `citation-panel` component — overlay sheet with chakra accent rule, data-font Article reference, body-font plain-language explainer, link to `/constitution` (DESIGN.md Components).

UX-DR7: Build `time-travel-scrubber` component — continuous track/fill/thumb, data-font date readout, approximate-date glyph for year-only records (DESIGN.md Components).

UX-DR8: Build `accountability-block` component — data-font figures, source+last-updated footer, explicit "not available" state. Takes only data as input; no props/flags can change fields per-Person (DESIGN.md Components).

UX-DR9: Build `state-badge` component — shape + text label for occupied/vacant/not-yet-established, never color alone (DESIGN.md Components).

UX-DR10: Build `profile-sheet` component — bottom-sheet overlay with rounded top, headline name header, photo/glyph, fixed-order sections (career path → Office powers → Accountability Data), provenance footer. Same anatomy for every Person/Office (DESIGN.md Components).

UX-DR11: Build `search-overlay` component — full-bleed overlay, body-font search input with focus ring, compact node-card result rows, data-font metadata per result. Results respect active Time Travel date (DESIGN.md Components).

UX-DR12: Build `GraphSkeleton` loading placeholder — skeleton/shimmer Nodes for cold-open while initial fetch resolves (EXPERIENCE.md State Patterns).

UX-DR13: Implement depth-of-field focus system — Focused (full opacity/scale/sharp), Connected (~85% opacity, slightly scaled), Field (dimmed, light blur). Camera-metaphor depth, not material shadows (DESIGN.md Elevation & Depth).

UX-DR14: Implement `graph-traverse` motion — pan/zoom/refocus animation reading as camera movement through the graph toward new focal point. ~400ms budget (DESIGN.md Elevation & Depth).

UX-DR15: Implement `time-rewind` motion — Nodes settle into place at new date, ghosts fade in/out for not-yet-established, occupants change underneath stable Office positions. ~400ms budget (DESIGN.md Elevation & Depth).

UX-DR16: Enforce Focused-anchor rule during time-rewind — camera stays anchored on the Office/position, never follows the occupant. New occupants enter at Connected/Field depth (DESIGN.md Elevation & Depth).

UX-DR17: Implement `prefers-reduced-motion` support — graph-traverse and time-rewind collapse to instant cuts; content changes remain identical. Field blur is not removed (it's a static treatment, not animation) (DESIGN.md, EXPERIENCE.md).

UX-DR18: Build `AccessibilityCompanionList` — hidden DOM list mirroring focused Node's connections in hierarchy-rank order. Each item announces relationship type, target name, type, and state. Activating triggers graph-traverse (EXPERIENCE.md Accessibility Floor).

UX-DR19: Enforce 44px minimum tap target at all zoom levels. Below-threshold Nodes become tap-disabled but reachable via Search and connections list (DESIGN.md Layout, EXPERIENCE.md).

UX-DR20: Dark mode as default canvas register (navy.900 background). Light mode fully supported via class-strategy toggle (DESIGN.md Brand & Style).

UX-DR21: Bottom-sheet snap points — peek (120px) / half (50vh) / full (92vh). Swipe-down to step through snap points. Graph visible and interactive at peek/half (EXPERIENCE.md Component Patterns).

UX-DR22: Responsive scale-up for ≥md viewports — canvas gains breathing room, profile/citation may render as side panels rather than bottom sheets [ASSUMPTION] (EXPERIENCE.md Responsive).

UX-DR23: Hover progressive enhancement for pointer input — light preview highlight on hover, never a required interaction path (EXPERIENCE.md Responsive).

### FR Coverage Map

| Requirement | Epic | Description |
|---|---|---|
| FR-1 | Epic 1 | View the national power graph |
| FR-2 | Epic 1 | Drill through Node connections |
| FR-3 | Epic 2 | View Person's career path |
| FR-4 | Epic 2 | View Office powers & responsibilities |
| FR-5 | Epic 2 | View Person's Accountability Data |
| FR-6 | Epic 1 | Inspect constitutional citation inline |
| FR-7 | Epic 3 | Time Travel scrubber |
| FR-8 | Epic 4 | Search the power graph |
| AR-1..AR-5, AR-7..AR-10 | Epic 1 | Architecture foundation requirements |
| AR-6 | Epic 3 | Client-side Tenure resolver + parity testing |
| AR-9 (searchGraph) | Epic 4 | GraphService search extension |
| UX-DR2..6, 9, 12..14, 18..20 | Epic 1 | Graph renderer, node cards, depth-of-field, accessibility |
| UX-DR7 (stub), 8, 10, 21 | Epic 2 | Profile sheet, accountability block, snap points |
| UX-DR1, 7 (full), 15..17 | Epic 3 | Party palette, scrubber, time-rewind, reduced motion |
| UX-DR11, 22, 23 | Epic 4 | Search overlay, responsive polish, hover |
| NFR-1..6 | Cross-cutting | Addressed incrementally across all epics |

## Epic List

### Epic 1: Power Graph Foundation & Navigation
A user can open Power Explorer, see the current national power graph centered on the PM, drill into any Node's connections, and inspect constitutional citations inline — the complete "browse the living machine" experience.
**FRs covered:** FR-1, FR-2, FR-6
**ARs covered:** AR-1, AR-2, AR-3, AR-4, AR-5, AR-7, AR-8, AR-9 (getTemporalSubgraph, expandNode), AR-10
**UX-DRs covered:** UX-DR2, UX-DR3, UX-DR4, UX-DR5, UX-DR6, UX-DR9, UX-DR12, UX-DR13, UX-DR14, UX-DR18, UX-DR19, UX-DR20

### Epic 2: Person & Office Profiles
A user can tap any Person or Office Node and see a full profile — career path across Tenures, Office powers with constitutional grounding, and Accountability Data — completing the "understand where she sits in the machine" moment.
**FRs covered:** FR-3, FR-4, FR-5
**UX-DRs covered:** UX-DR7 (stub), UX-DR8, UX-DR10, UX-DR21

### Epic 3: Time Travel
A user can drag the Time Travel scrubber and watch the Power Graph reorganize across 1947–present — the "Constitution in motion" experience.
**FRs covered:** FR-7
**ARs covered:** AR-6
**UX-DRs covered:** UX-DR1, UX-DR7, UX-DR15, UX-DR16, UX-DR17

### Epic 4: Search & Discovery
A user can search by Person name, Office title, or party and jump directly to that Node in the graph, respecting the active Time Travel date.
**FRs covered:** FR-8
**ARs covered:** AR-9 (searchGraph)
**UX-DRs covered:** UX-DR11, UX-DR22, UX-DR23

---

## Stories

### Epic 1: Power Graph Foundation & Navigation

#### Story 1.1 — Tenure Data Model & Test Harness

**As a** developer,
**I want** the Tenure data model in place with a working test harness,
**so that** all downstream features (graph rendering, Time Travel, profiles) can rely on a single temporal backbone.

**Implements:** AR-1, AR-2, AR-5

##### Acceptance Criteria

1. New `Tenure` model added to `prisma/schema.prisma` with fields: `id` (cuid), `personId`, `positionId`, `startDate` (DateTime), `endDate` (DateTime?), `startDateApproximate` (Boolean, default false), `mechanism` (String?).
2. Relations: `person` → Person (onDelete: Cascade), `position` → Position (onDelete: Restrict).
3. Indexes: `[personId]`, `[positionId]`, `[positionId, startDate, endDate]`, `[personId, startDate]`.
4. `Position.currentHolderId` unique FK is removed. All existing reads of `currentHolderId` across `src/lib/data/` and API routes are migrated to a `getActiveTenure(positionId, date?)` utility that queries the Tenure table (defaults to today).
5. `getActiveTenure` implements the 5 temporal resolution rules: (a) startDate inclusive, (b) endDate inclusive, (c) no match = vacant, (d) before earliest = not-yet-established, (e) overlapping = latest startDate wins.
6. Vitest scaffolded: `vitest.config.ts` created, `test` script added to `package.json`, sample test passes.
7. Seed script (`prisma/seed.ts`) updated to create Tenure records for existing Person→Position relationships.
8. At least 10 test cases covering: single active tenure, vacant position, overlapping tenures, approximate dates, not-yet-established state, migration parity (old `currentHolderId` matches new `getActiveTenure` result for all seeded data).

---

#### Story 1.2 — Neo4j Sync Worker

**As a** developer,
**I want** Tenure changes in PostgreSQL to automatically propagate to Neo4j,
**so that** graph queries always reflect the latest temporal data without manual sync.

**Implements:** AR-3

##### Acceptance Criteria

1. BullMQ queue `neo4j-sync` created with Redis connection from existing config.
2. On Tenure create/update/delete, a `Neo4jSyncEvent` (`{ action: 'upsert' | 'delete', entityType: 'tenure', entityId, timestamp, data }`) is published to the queue.
3. Worker consumes events and upserts/deletes `HOLDS_POSITION` temporal edges in Neo4j with `startDate`, `endDate`, `mechanism` properties.
4. Failed events retry 3× with exponential backoff, then move to `neo4j-sync-dlq`.
5. Dead-letter queue is consumable for manual inspection (no auto-retry from DLQ).
6. Worker logs every processed event at `info` level and every DLQ move at `error` level.
7. Vitest coverage: successful sync, retry on transient Neo4j failure, DLQ after 3 failures, idempotent upsert (processing same event twice produces same state).

---

#### Story 1.3 — Temporal Graph API

**As a** Power Explorer client,
**I want** API endpoints that return time-aware graph data,
**so that** the frontend can render the power structure at any date.

**Implements:** AR-9 (getTemporalSubgraph, expandNode), AR-7, AR-10 (partial — store contract)

##### Acceptance Criteria

1. `GraphService.getTemporalSubgraph(date, depth)` returns the national-layer graph (PM-centered, depth=2 default) with all Nodes resolved to their state at `date`. Returns typed `GraphNodeData[]` and `GraphEdgeData[]`.
2. `GraphService.expandNode(nodeId, date)` returns directly connected Nodes (superior, subordinate, peer) at `date` with labeled Edges.
3. `GET /api/graph/temporal?date=<ISO>&depth=<n>` — Zod-validated, returns `{ nodes: GraphNodeData[], edges: GraphEdgeData[] }`.
4. `GET /api/graph/expand?nodeId=<id>&date=<ISO>` — Zod-validated, returns same shape scoped to the expanded neighborhood.
5. Both endpoints bypass GraphService LRU cache (AR-7) — temporal queries always hit Neo4j.
6. Every `GraphNodeData` includes `state` field resolved per the 5 temporal rules.
7. Person nodes include `photoUrl`, `partyAbbreviation`, `tenureStartDate`, `tenureEndDate`, `tenureMechanism`, `startDateApproximate`.
8. Office nodes include `constitutionalBasis` (first citation article number or "convention, not codified").
9. Response shape is identical regardless of party, person, or office — no conditional fields.
10. Vitest coverage: current-date subgraph, historical-date subgraph, expand with vacant neighbor, expand non-existent nodeId returns 404.

---

#### Story 1.4 — Power Explorer Graph Renderer

**As a** user,
**I want to** open Power Explorer and see an interactive graph of India's national power structure centered on the PM,
**so that** I can visually understand who holds power and how offices relate.

**Implements:** FR-1, AR-4, AR-8, AR-10, UX-DR2, UX-DR3, UX-DR4, UX-DR5, UX-DR9, UX-DR12, UX-DR13, UX-DR19, UX-DR20

##### Acceptance Criteria

1. `/power-explorer` route created. `/power-structure` redirects (308) to `/power-explorer`.
2. Page shell SSRs (meta tags, skeleton). Cytoscape.js renderer loads via `next/dynamic` with `ssr: false`.
3. `usePowerExplorerStore` (Zustand) created with: `nodes`, `edges`, `focusedNodeId`, `activeDate` (defaults to today), `tenureCache`, `isLoading`.
4. On mount, fetches `GET /api/graph/temporal?date=today&depth=2`, populates store, renders graph.
5. `GraphSkeleton` shimmer displayed during initial fetch (UX-DR12).
6. Person nodes render as circles with saffron register, headline name, party-tag chip (leading dot + abbreviation), Office label, provenance line.
7. Office nodes render as rounded squares with navy register, headline title, occupant inset or state glyph (occupied/vacant/not-established via `state-badge`), provenance line.
8. Edges render as directional lines with arrowhead and relationship-type label. Citation-bearing edges show a chakra-400 dot.
9. Depth-of-field: Focused node at full opacity/scale, Connected nodes at ~85% opacity, Field nodes dimmed with light blur.
10. Dark mode (navy.900 background) is default. Light mode via class-strategy toggle.
11. All nodes enforce 44px minimum tap target. Below-threshold nodes at current zoom are tap-disabled.
12. Graph is pannable and zoomable with touch gestures and mouse wheel.
13. Initial render centers on PM Office node as Focused.
14. `PowerHierarchyExplorer` component and its imports are removed.

---

#### Story 1.5 — Node Expansion & Graph Traversal

**As a** user,
**I want to** tap any Node to expand its connections and navigate through the graph,
**so that** I can explore the full power structure without losing context.

**Implements:** FR-2, UX-DR14

##### Acceptance Criteria

1. Tapping a non-focused Node triggers `graph-traverse` motion: camera pans/zooms to center on the tapped Node (~400ms animation).
2. The tapped Node becomes Focused; depth-of-field layers recalculate.
3. If the Node's direct connections are not yet loaded, `GET /api/graph/expand?nodeId=<id>&date=<activeDate>` is called. New nodes/edges merge into the store (no duplicates).
4. Expanding reveals all direct Edges labeled with relationship type (superior, subordinate, peer).
5. A "collapse" affordance (×) on expanded neighborhoods removes the expanded nodes (except those that were part of the prior subgraph) without full reload.
6. `graph-traverse` animation respects `prefers-reduced-motion` — collapses to instant cut.
7. During expansion fetch, a subtle loading indicator shows on the tapped Node (not a full-screen blocker).
8. Double-tapping does not trigger double expansion — debounced.

---

#### Story 1.6 — Citation Panel

**As a** user,
**I want to** tap a constitutional citation on an Edge or Office and see a plain-language explanation,
**so that** I understand the legal basis of power relationships without leaving the graph.

**Implements:** FR-6, UX-DR6

##### Acceptance Criteria

1. Citation dots (chakra-400) on Edges and constitutional basis labels on Office nodes are tappable (44px target).
2. Tapping opens the `citation-panel` as a bottom-sheet overlay (below `md`) or side panel (≥`md`).
3. Panel displays: chakra accent rule at top, data-font Article reference (e.g., "Article 75(1)"), body-font plain-language explainer of what the article establishes.
4. Panel includes a link to the full article in `/constitution` explorer — opens in same tab, preserving browser back-navigation to Power Explorer.
5. Graph remains visible and interactive behind the panel at peek/half snap points.
6. Closing the panel (swipe-down or × button) returns focus to the graph without repositioning.
7. If the citation references multiple articles, each is listed as a separate block within the panel.
8. Provenance line at bottom: "Power Graph · [active date] · Source: Constitution of India".

---

#### Story 1.7 — Accessibility Companion List

**As a** screen-reader user,
**I want** a DOM list that mirrors the focused Node's connections,
**so that** I can traverse the power graph using my assistive technology.

**Implements:** UX-DR18, NFR-4

##### Acceptance Criteria

1. `AccessibilityCompanionList` renders as a hidden `<ul>` (visually hidden, not `display:none`) that updates whenever `focusedNodeId` changes in the store.
2. List items ordered by constitutional hierarchy rank (superior first, then peers, then subordinates).
3. Each `<li>` announces: relationship type ("reports to", "supervises", etc.), target name, target type (Person/Office), and state (occupied/vacant/not-established).
4. Each `<li>` is a `<button>` — activating it triggers `graph-traverse` to that Node and updates Focused state.
5. The Focused Node itself is announced as a live region (`aria-live="polite"`) when it changes — reading the Node's label, type, and state.
6. List is reachable via keyboard tab order (positioned after the graph canvas in DOM order).
7. Tested with NVDA or VoiceOver — all items are announced correctly and activation navigates the graph.

---

### Epic 2: Person & Office Profiles

#### Story 2.1 — Profile Sheet Component

**As a** user,
**I want to** tap a Person or Office Node and see a full-screen profile sheet,
**so that** I can view all details about that entity without navigating away from the graph.

**Implements:** UX-DR10, UX-DR21

##### Acceptance Criteria

1. `profile-sheet` renders as a bottom-sheet overlay with rounded top corners on mobile (<`md`) with three snap points: peek (120px), half (50vh), full (92vh).
2. Swipe-down steps through snap points; swipe past peek dismisses.
3. Graph remains visible and interactive at peek and half snap points.
4. Sheet header: headline-font name/title, photo (Person) or type glyph (Office), provenance line.
5. Sheet body sections render in fixed order: Career Path → Office Powers → Accountability Data. Sections not applicable to the entity type are omitted (Office has no Career Path; Person has no Office Powers directly).
6. Same anatomy for every Person and every Office — no conditional layout based on party, popularity, or any editorial factor.
7. Opening a profile sheet while another is open replaces it (no stacking).
8. Keyboard: `Escape` dismisses the sheet.
9. Profile sheet receives entity data from `usePowerExplorerStore` focused Node — no independent data fetch (data already loaded via graph APIs).
10. Time-travel scrubber stub (non-functional visual placeholder) renders in the sheet footer — functional implementation deferred to Epic 3.

---

#### Story 2.2 — Career Path

**As a** user,
**I want to** see a Person's sequence of prior Tenures in chronological order,
**so that** I can understand their political trajectory and how they reached their current position.

**Implements:** FR-3

##### Acceptance Criteria

1. Career Path section in the profile sheet displays all of the Person's Tenures ordered chronologically (earliest first).
2. Each step shows: Office title (linked to that Office node), start date — end date (or "present"), and mechanism of transition (e.g., "General Election", "Appointed", "Resigned").
3. Year-only dates display an approximate glyph (≈) per UX-DR7 stub.
4. Tapping a prior Tenure step: (a) sets the Time Travel date to that Tenure's start date in the store, (b) navigates the graph to center on that Office, (c) closes or minimizes the profile sheet. (Full time-rewind animation deferred to Epic 3 — for now, the graph simply re-fetches at the new date.)
5. Each step displays only factual data — no narrative framing, no editorial descriptions of why someone moved.
6. Data sourced via `GET /api/graph/temporal` with the Person's ID — API returns all Tenures for that person.
7. If the Person has only one Tenure (current), the section displays it with a "Current and only recorded position" note.
8. Provenance line per step: "Source: [mechanism source]" or "Source: Official records" if mechanism source is unspecified.

---

#### Story 2.3 — Office Powers & Constitutional Grounding

**As a** user,
**I want to** see what an Office can do and which constitutional articles grant those powers,
**so that** I understand the structural authority of the position, not just who holds it.

**Implements:** FR-4

##### Acceptance Criteria

1. Office Powers section renders in the profile sheet for Office-type nodes and for Person nodes (showing the powers of the Office they currently hold).
2. Displays a plain-language description of the Office's constitutional powers and responsibilities.
3. Every power statement is linked to at least one Constitutional Citation (Article number). Tapping the citation opens the `citation-panel` (Story 1.6).
4. Offices without a codified constitutional basis display an explicit label: "Convention, not codified" — never blank or omitted.
5. Powers descriptions are stored as structured data on the Position model (or a linked model) — not hardcoded in the component.
6. Content is identical across all Offices of equivalent constitutional rank — no editorial amplification or suppression.
7. Section header: "Powers & Responsibilities" with a body-font subheader citing the primary constitutional article.

---

#### Story 2.4 — Accountability Data

**As a** user,
**I want to** see a Person's declared assets, criminal case records, and election history,
**so that** I can evaluate their public accountability record using verified data.

**Implements:** FR-5, UX-DR8, NFR-6

##### Acceptance Criteria

1. `accountability-block` component renders in the profile sheet's Accountability Data section for Person nodes.
2. Displays three data groups: Declared Assets (₹ figure + source year), Criminal Cases (count + brief summary per case), Election History (constituency, year, result per election).
3. Data sourced from ADR/MyNeta fields on the Person model. Component takes only data as input — no props or flags that can change which fields render per Person.
4. Every data group shows source attribution ("Source: ADR/MyNeta") and last-updated date.
5. Missing data for any group displays explicit "Not available" state with the text "Data not available from [source]" — never silently omitted, never blank.
6. Figures render in data-font. Source+date footer in data-font at reduced weight.
7. Template is identical for every Person regardless of party, media salience, or any other factor.
8. Vitest coverage: fully populated data, partially missing data, all-missing data. All three render the same structural template.

---

### Epic 3: Time Travel

#### Story 3.1 — Continuous Scrub Performance Spike

**As a** developer,
**I want to** benchmark continuous scrub rendering on target mobile devices,
**so that** we can decide whether to ship continuous scrub or fall back to anchored-to-transitions mode.

**Implements:** NFR-1

##### Acceptance Criteria

1. Spike builds a minimal prototype: Cytoscape.js canvas with 30 nodes + 40 edges, a `<input type="range">` scrubber, and the client-side Tenure resolver (Story 3.2 can be stubbed with a mock resolver for the spike).
2. Prototype measures: (a) time from `input` event to all nodes visually updated (frame budget), (b) total JS main-thread time per scrub tick, (c) FPS during continuous drag on a throttled Chrome DevTools "Mid-tier mobile" profile.
3. Benchmark on at least 2 real devices or DevTools throttle profiles: low-end (4× CPU slowdown) and mid-range (2× slowdown).
4. Pass threshold: ≤16ms frame budget (60fps) on mid-range, ≤33ms (30fps) on low-end.
5. If continuous scrub passes: document results, proceed with continuous implementation.
6. If continuous scrub fails: document results, switch to anchored-to-transitions scrubber (snaps to known Tenure transition dates instead of arbitrary dates).
7. Spike results written as a decision record in the architecture doc or as a markdown file in `_bmad-output/planning-artifacts/`.
8. Spike is timeboxed to 1 dev-day. No production code ships from the spike — it informs the approach for Stories 3.3–3.5.

---

#### Story 3.2 — Client-Side Tenure Resolver

**As a** Power Explorer client,
**I want** a client-side function that resolves all Offices to their occupants at any given date using preloaded Tenure data,
**so that** the scrubber can re-render at 60fps without server round-trips.

**Implements:** AR-6

##### Acceptance Criteria

1. `resolveTenuresAtDate(tenures: Tenure[], date: Date): Map<positionId, ResolvedTenure | null>` implemented as a pure function in `src/lib/power-explorer/tenure-resolver.ts`.
2. Implements the same 5 temporal resolution rules as `getActiveTenure` (Story 1.1).
3. Tenure table preloaded into `usePowerExplorerStore.tenureCache` on Power Explorer mount — expected size ~300-400 rows (~50KB).
4. Shared test fixture (`src/lib/power-explorer/__fixtures__/tenure-test-data.ts`) with at least 15 scenarios covering all 5 resolution rules, overlapping tenures, approximate dates, and edge boundaries.
5. Parity test: both `resolveTenuresAtDate` (client) and a Neo4j Cypher temporal query (server) run against the shared fixture and produce identical results.
6. Resolver benchmarked: ≤2ms for 400 tenures on mid-range device (single `performance.now()` measurement in test).
7. Returns `null` for positions with no matching tenure (vacant state), and a `'not-established'` sentinel for positions whose earliest tenure is after the query date.

---

#### Story 3.3 — Time Travel Scrubber & Party-Tag Palette

**As a** user,
**I want to** drag a scrubber to any date from 1947 to today and see the power graph reorganize,
**so that** I can explore how India's power structure evolved over time.

**Implements:** FR-7, UX-DR1, UX-DR7

##### Acceptance Criteria

1. `time-travel-scrubber` component renders as a continuous (or anchored, per spike result) track with thumb, positioned below the graph canvas.
2. Track range: 1947-08-15 to today. Data-font date readout updates in real-time as thumb is dragged.
3. Year-only dates display approximate glyph (≈).
4. During drag (continuous mode): client-side Tenure resolver re-renders node occupants optimistically at ~60fps. No server call during drag.
5. On drag release: `GET /api/graph/temporal?date=<selectedDate>` validates and replaces the optimistic state.
6. `usePowerExplorerStore.activeDate` updated on both drag (optimistic) and release (validated).
7. Party-tag color palette implemented: 6 hues at 250°, 266°, 282°, 298°, 314°, 330° (all 30% saturation, 48% lightness) plus overflow neutral gray.
8. Party-tag slot assignment: deterministic alphabetical sort by party abbreviation → assign slots 0–5, remaining parties get slot 6 (gray).
9. Party-tag colors re-assigned when the set of visible parties changes (e.g., after time travel).
10. Anchored fallback (if spike chose it): thumb snaps to known Tenure transition dates; dates between transitions show the prior state.

---

#### Story 3.4 — Time-Rewind Motion & Focused-Anchor Rule

**As a** user,
**I want** the graph to animate smoothly when the date changes — offices stay put while occupants swap underneath,
**so that** I perceive the Constitution as the stable machine and people as transient occupants.

**Implements:** UX-DR15, UX-DR16, UX-DR17

##### Acceptance Criteria

1. `time-rewind` motion triggers on scrub release (or anchored-snap): Office nodes remain spatially fixed; Person data (name, photo, party-tag) cross-fades to the new occupant within ~400ms.
2. Offices becoming `not-yet-established` at the new date fade to ghost state (reduced opacity + dashed border). Offices transitioning from ghost to established fade in.
3. Offices becoming `vacant` show the vacant state badge; the prior person data fades out.
4. Focused-anchor rule: camera stays anchored on the currently Focused Office/position during time-rewind. The Focused Office does not move. If the Focused node was a Person, the focus transfers to their Office.
5. New occupants entering at the Focused Office appear at Connected depth, then can be tapped to become Focused.
6. `prefers-reduced-motion`: all time-rewind animations collapse to instant cuts. Content changes (occupant swaps, state changes) are identical. Ghost blur (static treatment) is preserved.
7. Motion performance: all transitions complete within 400ms budget on mid-range device.

---

#### Story 3.5 — Scrub-in-Progress & Edge States

**As a** user,
**I want** the graph to remain useful during and after time travel, even when data is loading or dates are approximate,
**so that** I never see broken or misleading states.

**Implements:** FR-7 (edge cases), NFR-3

##### Acceptance Criteria

1. During scrub drag (before release): graph renders an "unvalidated" visual indicator — subtle border treatment on nodes indicating client-side resolution, not server-confirmed.
2. On scrub release: unvalidated indicator clears once server response arrives and is applied.
3. If server response differs from client-side resolution (mismatch): nodes update to server state with a brief highlight flash to draw attention to the correction.
4. Approximate dates (year-only Tenures): node displays ≈ glyph next to the tenure date. Tooltip/accessible label: "Date is approximate (year only)".
5. Network error during validation: graph retains client-side state, displays a non-blocking toast: "Unable to verify — showing approximate data", with a retry button.
6. Provenance line on all nodes updates to reflect the active Time Travel date: "Power Graph · [active date] · Source: [source]".
7. Scrubber is disabled during initial graph load (Story 1.4 loading state) — enabled once first render completes.

---

### Epic 4: Search & Discovery

#### Story 4.1 — Graph Search API

**As a** Power Explorer user,
**I want to** search the power graph by Person name, Office title, or party,
**so that** I can jump directly to a Node without manual graph traversal.

**Implements:** FR-8, AR-9 (searchGraph)

##### Acceptance Criteria

1. `GraphService.searchGraph(query, date, { limit, offset })` queries Neo4j for Persons, Offices, and Institutions matching the search term, filtered to Tenures active at `date`.
2. Search is case-insensitive and supports partial matching (prefix + substring).
3. Results include `nodeId`, `type` ('person' | 'office' | 'institution'), `label`, `state`, `partyAbbreviation` (if Person), `matchField` (which field matched), and `tenureStartDate`/`tenureEndDate` when applicable.
4. Response shape matches the existing API envelope (`{ data, meta: { total, limit, offset } }`).
5. `GET /api/graph/search?q=<query>&date=<ISO>&limit=<n>&offset=<n>` route wired with Zod validation — `q` min 2 chars, `limit` max 50, `date` defaults to today.
6. Temporal graph search bypasses GraphService LRU cache (AR-7).
7. Results with no active Tenure at `date` return `state: 'vacant'` or `'not-established'` as appropriate — never silently omitted.
8. Empty query or below-min-length returns 400, not an empty 200.
9. Vitest coverage: partial match, exact match, date-filtered results, no-match returns empty array, pagination offset.

---

#### Story 4.2 — Search Overlay UI

**As a** Power Explorer user,
**I want to** open a search overlay, type a query, and see matching results that respect the active Time Travel date,
**so that** I can quickly find and navigate to any Node in the graph.

**Implements:** FR-8, UX-DR11

##### Acceptance Criteria

1. Search trigger button rendered in the Power Explorer toolbar — magnifying glass icon, meets 44px tap target.
2. Tapping trigger opens a full-bleed overlay (`search-overlay` component) with body-font input field and visible focus ring.
3. Input is debounced (300ms) before firing `GET /api/graph/search` with the active Time Travel date from `usePowerExplorerStore`.
4. Results render as compact `node-card` rows — each showing: type icon (person circle / office rounded-square), label (headline font), and data-font metadata (party abbreviation, state badge, matched field).
5. Tapping a result: (a) closes the overlay, (b) navigates the graph to center on that Node using `graph-traverse` motion, (c) sets it as the Focused Node in the store.
6. If the result Node is not in the currently loaded subgraph, the graph fetches the Node's neighborhood via `expandNode` before centering.
7. Empty-state: "No results for '[query]' at [formatted date]" message, data-font.
8. Loading state: skeleton shimmer on result rows while fetch is in-flight.
9. Keyboard: `Escape` closes overlay, `↑`/`↓` navigate results, `Enter` selects highlighted result.
10. Overlay preserves graph position underneath — closing without selection returns to previous view.
11. Provenance line on each result: "Power Graph · [active date] · Search".

---

#### Story 4.3 — Responsive Scale-Up & Hover Enhancement

**As a** Power Explorer user on a larger viewport,
**I want** the layout to use available space effectively and show hover previews on pointer devices,
**so that** the desktop experience feels native rather than a stretched mobile layout.

**Implements:** UX-DR22, UX-DR23

##### Acceptance Criteria

1. At `≥md` breakpoint (768px): graph canvas gains increased padding/breathing room, profile sheet and citation panel render as side panels (right-docked, ~380px width) instead of bottom sheets.
2. Side panels are dismissible and do not occlude the Focused Node — graph viewport adjusts its effective bounds when a panel is open.
3. Search overlay at `≥md` renders as a centered modal (max-width 600px) rather than full-bleed, with backdrop blur.
4. Bottom-sheet snap points (peek/half/full) remain active only below `md` breakpoint.
5. Hover progressive enhancement (pointer devices only, detected via `@media (hover: hover)`): hovering a Node shows a light preview highlight (border glow at Connected-layer opacity) — never changes Focused state.
6. Hover is purely visual enhancement — no information is gated behind hover. All hover-revealed content is reachable via tap/click or keyboard.
7. `prefers-reduced-motion`: hover highlight appears instantly (no fade transition) but is still shown.
8. Responsive behavior tested at 375px (mobile), 768px (tablet), 1280px (desktop) viewport widths.
9. No layout shift or content reflow when transitioning between breakpoints (CSS-only, no JS viewport listeners for layout switching).
