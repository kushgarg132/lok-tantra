---
title: Power Explorer — Experience Spec
status: final
created: 2026-06-08
updated: 2026-06-09
sources:
  - "../../prds/prd-lok-tantra-2026-06-08/prd.md"
---

# EXPERIENCE.md — Power Explorer

> `DESIGN.md` is the visual identity reference; this document owns *how it works*. Both spines win on conflict with any mock, wireframe, or import. Glossary terms (Power Graph, Node, Person, Office, Tenure, Edge, Constitutional Citation, Time Travel, Accountability Data) are used exactly as defined in the PRD §3 — not redefined here.

## Foundation

Mobile-first, responsive web — single codebase, no native app `[ASSUMPTION carried from PRD §6: "no native app is planned"]`. Built on LokTantra's existing Next.js/Tailwind stack; the graph renders via the project's existing graph-visualization layer (Cytoscape.js — the only precedent is `PoliticalRelationshipMap`'s small, statically-laid-out graph, so continuous re-rendering at this scale is genuinely new ground, per PRD Open Question #1). No external UI component system — `DESIGN.md` (which itself extends LokTantra's Tailwind theme) is the sole visual identity reference.

`[ASSUMPTION: dark mode is the default register]` for the graph canvas (see `DESIGN.md` → Brand & Style) — light mode remains fully available via LokTantra's existing `class`-strategy toggle.

This feature **fully replaces** `/power-structure` and `PowerHierarchyExplorer` (PRD §6) — there is no parallel old/new experience to reconcile; the migration/redirect mechanics are an architecture-phase concern (PRD Open Question #2), out of this spine's scope.

## Information Architecture

Single-canvas-plus-overlays — the Power Graph never leaves the screen. Everything else (profiles, citations, search, Time Travel chrome) layers over it as sheets/panels per `DESIGN.md`'s elevation model, so the user's place in the graph is never lost (directly serves FR-2 and FR-6's "without leaving the graph view").

| Surface | Reached from | Purpose |
|---|---|---|
| Power Graph | App open (cold) — replaces `/power-structure` | The canvas itself: current national-layer structure, centered on the Office of the PM |
| Person / Office profile sheet | Tap any Node | Career path, Office powers + citation, Accountability Data (FR-3, FR-4, FR-5) |
| Citation panel | Tap a Constitutional Citation (in graph or profile) | Plain-language explainer + link to `/constitution` (FR-6) |
| Time Travel scrubber | Persistent chrome at the graph's edge | Re-renders the graph for any selected date, 1947 (or fallback start — Open Question #3) to present (FR-7) |
| Search | Persistent entry point in chrome | Jump directly to a Node by Person, Office, or party (FR-8) |

No tab bar, no drawer. There is exactly one "home" — the graph — and every other surface is a temporary layer over it that the user can dismiss back to without losing context. Modal stacks one level deep: a citation opened from within a profile sheet sits *on* that sheet, and dismissing it returns to the sheet, not the bare graph.

## Voice and Tone

Microcopy. Brand voice and aesthetic posture live in `DESIGN.md` → Brand & Style ("reverent, not dramatic"). Every string below is grounded in a state the PRD explicitly names — voice here is an enforcement surface for §5 Neutrality and FR-3's "facts, not narrative" rule, not a place to add personality.

| Do | Don't |
|---|---|
| "Vacant — no Tenure recorded for this date." | "Nobody's in charge here right now." |
| "This Office didn't exist yet on the selected date." | "Office not found." |
| "Date is approximate — only the year is recorded." | "~1977 (estimate)" |
| "Source: ADR/MyNeta. Last updated [date]." | "Verified ✓" / "Trusted source" |
| "Accountability Data is not available for this Person." (rendered, not omitted) | Leaving the section out entirely |
| "No matches for '[query]'." | "Hmm, we couldn't find that — try another search!" |
| Short, complete, factual sentences naming what *is* and what's *missing*. | Exclamation marks, speculation about *why* something happened, or any framing of a rise/fall/reshuffle as a story (binds FR-3's narrative-neutrality rule and §7's no-editorializing Non-Goal). |

## Component Patterns

Behavioral. Visual specs live in `DESIGN.md` → Components.

| Component | Use | Behavioral rules |
|---|---|---|
| Node (Person / Office / Institution) — visual: `DESIGN.md` → `node-card-person` (circle) and `node-card-office` (rounded square); Institution shares Office's card template | Power Graph | Tap → expands in place via `graph-traverse` (FR-2). Press-and-hold `[ASSUMPTION: reserved — no peek-preview in v1, avoids adding a second navigation pattern to a graph that's already dense]` |
| Edge | Power Graph | Tap the citation dot → opens citation panel, position preserved (FR-6). Tap elsewhere on the edge is a no-op — avoids accidental navigation in a dense graph |
| Profile sheet | Tap a Person/Office Node | Opens at the **half** snap point; drag to peek/full/dismiss. Graph stays visible and interactive behind it at peek/half |
| Citation panel | Tap a citation (graph or profile) | Opens as an overlay *on top of* whatever surface it was opened from (one level of stacking max); dismiss returns to the exact prior scroll/zoom position |
| Time Travel scrubber | Persistent chrome | Drag re-renders continuously via `time-rewind`; release commits the date. Tapping a career-path step inside a profile also drives it, centered on that Person (FR-3) |
| Search | Persistent entry point | Opens as an overlay; results respect the active Time Travel date and are paginated/debounced per LokTantra's existing search conventions (FR-8). Selecting a result centers the graph there *and keeps the date* |
| Accountability block | Inside profile sheet | Always rendered — including its "not available" state — in the same position and depth for every Person (FR-5, §5 comparative symmetry) |
| Party-tag chip | Node cards, profile sheet | Non-interactive, decorative-factual only, never tappable. Renders identically regardless of which party it represents — no party gets a larger, more prominent, or differently-styled tag (§5 "color is secondary, layout is primary") |
| State badge | Graph Nodes, profile sheet | Re-renders on every `time-rewind` tick; label text changes synchronously with the badge shape, never a separate async load. Appears identically in graph and profile contexts — same shape + label pairing in both |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Cold open | Power Graph | Loads centered on the PM's Office at today's date. `[ASSUMPTION: skeleton/shimmer placeholder Nodes while the initial fetch resolves — exact treatment depends on the load-time the Open Question #1 spike reveals]` |
| Vacant Office | Graph / Profile | Outline-only Node, generic silhouette glyph (no photo/name) + "Vacant — no Tenure recorded for this date." |
| Not yet established / discontinued | Graph | Ghosted Node (20% opacity, dashed outline) + "This Office didn't exist yet on the selected date" / "…no longer exists." |
| Approximate historical date | Time Travel / career path | `{colors.time-marker-approximate}` glyph + "Date is approximate — only the year is recorded." (FR-7) |
| Missing Accountability Data | Profile | Explicit "Not available" block — same template position as populated data, never silently dropped (FR-5) |
| Search — no results | Search overlay | "No matches for '[query]'." No suggestions, no "did you mean" — keeps search factual rather than presumptive `[ASSUMPTION]` |
| Fetch / connectivity failure | Power Graph | `[ASSUMPTION — open for architecture]`: PRD doesn't specify offline behavior; proposing cached last-good graph + small inline notice over a hard error, so a flaky connection doesn't strand the user mid-exploration |
| Reduced motion | Graph / Scrubber | `graph-traverse` and `time-rewind` collapse to instant cuts — the *content* change (new focal Node, new date) is identical; only the camera-movement feeling is removed |
| Profile sheet loading | Profile sheet | Sheet opens immediately at the half snap point (tap registers instantly); content sections show skeleton rows while career path, Office powers, and Accountability Data fetch independently |
| Profile / citation fetch failure | Profile sheet / Citation panel | Inline error within the sheet/panel — "Could not load [section]." — sheet stays open at its current snap point; user can dismiss or retry without losing graph position |
| Search — idle | Search overlay | Overlay shows a focused text input and brief prompt: "Search by person, office, or party." No recent-searches, no suggestions — keeps search factual (§5) |
| Search — pending | Search overlay | Skeleton result rows appear after the debounce window fires; input remains editable. Results replace skeletons as they arrive |
| Scrub in progress | Power Graph / Scrubber | `[ASSUMPTION — pending Open Question #1 performance spike]`: during active drag, the graph morphs continuously toward the scrubbed date; if re-rendering can't keep pace, Nodes hold their last-settled positions with a subtle loading shimmer until the scrub pauses or releases |

## Interaction Primitives

- **Tap** a Node to expand it in place — the graph refocuses via `graph-traverse`, never a page navigation.
- **Drag** the Time Travel scrubber for continuous scrubbing; release commits the date and triggers `time-rewind` (FR-7). Dragging is the primary "rewind through history" gesture this entire feature is built around.
- **Tap** a citation (the dot on an edge, or an inline reference in a profile) to open its plain-language explainer without losing position (FR-6).
- **Pinch / drag** to zoom and pan the graph canvas — standard map/graph gesture vocabulary, already familiar from `PoliticalRelationshipMap`.
- **Swipe down** on any sheet to step it through its snap points (full → half → peek → dismiss).
- **Tap** a career-path step inside a profile to jump Time Travel to that period, centered on that Person (FR-3) — the profile is a doorway *into* the living graph, not a dead-end mini-timeline.
- **Banned**: party brand marks (logos, official brand colors) anywhere in the UI (§5); algorithmic "you might also like" or "trending now" surfacing of any Person (would directly violate SM-C2's anti-amplification counter-metric); like / comment / rank / score affordances on any Person or Office (§7 Non-Goals — no UGC, no rankings, no editorializing).

## Accessibility Floor

Behavioral. Visual contrast and shape-pairing live in `DESIGN.md`.

- Every Node, Edge, and control is labeled with role + state for screen readers; state badges (occupied / vacant / not-yet-established) announce their **text label**, not a color name.
- Screen-reader graph traversal: from any focused Node, a **connections list** (DOM-ordered, navigable with standard next/previous gestures) presents that Node's direct connections — the same set `graph-traverse` reveals visually — in hierarchy-rank order (superior → peer → subordinate). Each item announces: relationship type, target Node name, type (Person / Office / Institution), and state. Activating an item triggers the same `graph-traverse` a sighted tap does, making the connected Node the new focus and exposing *its* connections list in turn. One mental model — expand and traverse — not a separate "accessible version." `[ASSUMPTION — open for architecture: the exact DOM structure (live-region announcements vs. ARIA tree vs. companion list panel) is an engineering decision; the contract is that connected Nodes are linearly reachable from any focused Node without spatial gestures.]`
- Tap targets stay ≥ 44px (`DESIGN.md` → `node-min-tap-target`) at every zoom level. `[ASSUMPTION carried from DESIGN.md: Nodes that would render below this visual size at deep zoom-out become tap-disabled for direct touch but remain reachable via Search (FR-8) and the connections list (above) — pinch-to-zoom is one path in, never the only path, preserving access for switch-access and single-finger users. Confirm the visual trade-off with engineering during the performance spike (PRD Open Question #1).]`
- `prefers-reduced-motion` removes the `graph-traverse` / `time-rewind` camera-movement animation; every resulting state change remains identical and instantaneous — no information is conveyed by motion alone.
- Dynamic type / text scaling is honored through `DESIGN.md` typography tokens. Profile and citation text reflows; dense graph labels truncate gracefully (with the full name available on tap) rather than overlapping neighbors.
- Color is never the only signal: every state (party tag, Office status, approximate-date marker) pairs its color with a distinct shape and/or text label — binds `DESIGN.md` → Do's and Don'ts directly to a testable accessibility rule.
- Focus traversal in sheets and panels follows reading order; dismissing a sheet returns focus to the Node that opened it — at the Node's **current** post-`graph-traverse` position, not a cached pre-navigation reference — so a screen-reader or keyboard user's frame stays synced with the graph's current state.

## Responsive & Platform

Touch and small screens come first (PRD §6); larger viewports are a *scale-up*, not a redesign — the single-canvas-plus-overlays IA holds at every size.

- **Phone (primary)**: full-bleed graph canvas; sheets are bottom sheets at peek/half/full snap points; Time Travel scrubber sits as a thin persistent strip at the screen's bottom or side edge so it never competes with the canvas for space.
- **Tablet / desktop (≥ md)**: the graph canvas gains breathing room (`{spacing.canvas-padding}` scales up per `DESIGN.md`); profile/citation surfaces *may* render as side panels rather than bottom sheets `[ASSUMPTION — a natural scale-up of the sheet pattern for wider viewports, not confirmed; the PRD names mobile-first but doesn't specify large-viewport treatment beyond "scaled up"]`. The graph itself remains the permanent home surface either way.
- Pointer input (desktop) adds **hover** as a *progressive enhancement only* — a light preview highlight on hover — never a required interaction path, since touch must remain fully sufficient on its own.

## Key Flows

Mirrored verbatim from the PRD's Key User Journeys (§2.2) — names, persona context, and climax beats carry over unchanged; only the surface-level interaction beats are added here.

### Flow 1 — UJ-1: Aman finally understands the Cabinet reshuffle (Aman, 22, final-year student, on his phone, unauthenticated)

1. Aman opens Power Explorer (the surface that now stands where `/power-structure` used to be).
2. The Power Graph loads, centered on the Office of the Prime Minister.
3. He taps the name of the minister he just saw trending in the news.
4. The Node expands in place via `graph-traverse`: her photo, party tag, constituency, a chronological list of her prior Tenures — Office, dates, and how each transition occurred (elected / appointed / reshuffled) — up to her current position, and a "reports to" edge to the PM carrying a Constitutional Citation (Article 75).
5. He taps the citation — the panel opens over the graph with a plain-language explainer; his place in the graph doesn't move.
6. **Climax:** He sees exactly where she sits in the machine — not just her name — and screenshots the graph to explain it to a friend. Because `DESIGN.md`'s "context travels with the content" rule keeps attribution, the date, and the citation rendered inline, the screenshot explains itself even stripped of the app around it.

Failure: if the minister isn't within the graph's default expansion depth from the PM, Search (FR-8) surfaces her directly and centers the graph there — Aman never has to manually drill down to find her.

### Flow 2 — UJ-2: Priya discovers a "permanent fixture" wasn't always there (Priya, 35, schoolteacher, prepping a civics lesson)

1. Priya is on the main graph view and notices the continuous Time Travel scrubber at the screen's edge.
2. She drags it back to 1977 on a whim — the graph reorganizes via `time-rewind`: different faces, different (neutral-palette) party tags, and a few Offices ghost into their "not yet established" treatment.
3. She drags further to 1947 — the structure thins to its barest constitutional skeleton: most Offices either ghosted or in their very first Tenure.
4. **Climax:** She realizes she can *show* her students how the system evolved, not just describe it — the rewind itself is the lesson, not a feature she has to explain.
5. She lets the scrubber settle back toward today; the graph fills back in, reading as forward motion through history — a clear before/after mental model to bring into tomorrow's lesson.

Failure / sparse-record path: at 1947, several Tenures are known only to the year — those Nodes carry the `time-marker-approximate` glyph and the "Date is approximate" microcopy rather than inventing a precise day (FR-7). Priya sees a thinner, honestly-marked graph, never a broken or silently-wrong one — which is itself a small lesson about how historical records work.

Note: snapshot/bookmark-a-moment is `[NON-GOAL for MVP]` (PRD §4.4, §8.2) — Priya's flow deliberately ends in her head, not in a saved artifact. That's a scope cut the PRD already named and reasoned about (flagged there as worth revisiting once the scrubber ships and real usage is visible), not a gap this spine introduces.
