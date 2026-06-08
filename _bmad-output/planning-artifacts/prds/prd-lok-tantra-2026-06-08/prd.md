---
title: Politician Hierarchy & Historical Power Explorer
status: draft
created: 2026-06-08
updated: 2026-06-08
---

# PRD: Politician Hierarchy & Historical Power Explorer
*Working title — confirm.*

## 0. Document Purpose

This PRD defines the **Power Explorer** — a new flagship feature for LokTantra that fully replaces the existing `/power-structure` page with a graph-based, navigable, historically-aware visualization of India's political power structure, grounded in real people and the Constitution that empowers them. It is written for the product owner (Kush) and for the downstream UX, architecture, and epics/stories workflows that build on it. Functional Requirements are grouped under the Features they belong to and numbered globally (FR-1 through FR-N) for stable cross-referencing; `[ASSUMPTION]` tags mark places the PM inferred without explicit confirmation, indexed in §11. This PRD builds on — and does not duplicate — LokTantra's existing `project-context.md` (tech stack and conventions) and `CLAUDE.md` (design principles, especially neutrality and source-verifiability); both are referenced inline where they bind.

## 1. Vision

Civics is usually taught as something to memorize — names, dates, articles, hierarchies in prose. LokTantra's Power Explorer replaces memorization with discovery: select any politician, post, or institution and watch their world unfold as a connected graph — how they got there, who they report to, what powers they hold, and which constitutional article grounds it all — populated with real people, real photos, and current data.

Wind the graph back through time to see how the same web of power looked in 1991, or 1977, or 1947, and the Constitution stops being an abstract document and becomes the living skeleton of a structure you can actually see move.

This is for anyone who has ever read a civics textbook and immediately forgotten which minister reports to whom, or wondered "wait — how *did* this person become Prime Minister?" — and would rather click through the answer than memorize it.

## 2. Target User

### 2.1 Jobs To Be Done

- **Functional (primary)**: "I need to understand how India's government actually works, beyond the textbook version" — replacing rote-memorized facts with a mental model of how power is structured, granted, and connected to the Constitution.

### 2.3 Key User Journeys
*Numbered globally as UJ-1 through UJ-N. FRs reference journeys by ID inline.*

- **UJ-1. Aman finally understands the Cabinet reshuffle everyone's talking about.**
  - **Persona + context:** Aman, 22, a final-year college student, sees "Cabinet reshuffle" trending and has no structural sense of what that means.
  - **Entry state:** Unauthenticated, on his phone (mobile-first), arriving from curiosity rather than a deep link.
  - **Path:** Opens Power Explorer → lands on the current power graph centered on the PM → taps a minister's name he just saw in the news.
  - **Climax:** The node expands in place: her photo, party, constituency, a traced line showing her rise from state legislator to Union Minister, and a "reports to" edge to the PM carrying a constitutional citation (Article 75). He taps the citation and gets a plain-language explainer of what it actually says.
  - **Resolution:** He walks away seeing exactly where she sits in the machine — not just her name — and screenshots the graph to explain it to a friend.

- **UJ-2. Priya discovers that a "permanent fixture" of Indian politics wasn't always there.**
  - **Persona + context:** Priya, 35, a schoolteacher prepping a civics lesson, is exploring the current power graph.
  - **Entry state:** Authenticated or not (doesn't matter), on the main graph view, notices a continuous timeline scrubber at the edge of the screen.
  - **Path:** Drags the scrubber back to 1977 on a whim → the graph visibly reorganizes (different faces, party colors, some posts don't exist yet) → drags further to 1947 and watches the structure thin to its barest constitutional skeleton.
  - **Climax:** She realizes she can *show* her students how the system evolved, not just describe it.
  - **Resolution:** She has a clear before/after mental model to bring into her lesson tomorrow.
  - *(Snapshot/bookmark-a-moment is explicitly deferred — see [NON-GOAL for MVP] in §6.)*

## 3. Glossary
*Downstream workflows and readers must use these terms exactly. FRs, UJs, and SMs use Glossary terms verbatim.*

- **Power Graph** — The core interactive visualization: a navigable network of Nodes connected by typed, directional Edges representing relationships of authority, appointment, and accountability.
- **Node** — A single entity in the Power Graph: a Person, an Office, or an Institution.
- **Person** — A real individual who has held one or more Offices; carries biographical and Accountability Data.
- **Office** — A constitutionally or statutorily defined position (e.g. "Prime Minister", "Union Minister of Home Affairs") that exists independently of who currently holds it.
- **Tenure** — A specific Person's occupancy of an Office across a defined date range (start date, end date or "incumbent"). The atomic unit that makes Time Travel possible — the Power Graph is rendered by resolving, for a given date, which Tenure is active for each Office.
- **Edge** — A typed, directional relationship between two Nodes (e.g. "reports to", "appoints", "elected from"). Carries an optional Constitutional Citation.
- **Constitutional Citation** — A reference to a specific Article (or other constitutional/statutory provision) that grounds an Edge or an Office's powers; expandable into a plain-language explainer.
- **Time Travel** — The continuous historical scrubber that re-renders the Power Graph to reflect active Tenures as of any selected date between 1947 and present. Dates falling between two recorded transitions resolve to the **last known state** (most recent Tenure-start at or before the selected date).
- **Accountability Data** — Factual records about a Person sourced from ADR/MyNeta: declared assets, criminal cases, election history. Distinct from **Activity Data** (voting records, speeches, public statements), which is out of scope for v1.

## 4. Features

### 4.1 The Power Graph
**Description:** The core navigable visualization. On load, the user sees the current national power graph centered on the Office of the Prime Minister, rendered as connected Nodes (people occupying Offices, plus Institutions) joined by typed Edges. The user can pan, zoom, and tap any Node to expand its immediate connections — moving up (who appoints/oversees this Office), down (who reports to it), or sideways (peer Offices, allied Institutions) — turning "browsing" into "drilling through the actual machine of government." Realizes UJ-1.

**Functional Requirements:**

#### FR-1: View the national power graph
A user can open the Power Graph and see the current national-layer structure (President, PM, Union Cabinet & Ministers, central institutions, judiciary apex) centered on the Prime Minister's Office.

**Consequences (testable):**
- Initial render completes and is interactive on a mobile device within LokTantra's existing performance expectations [ASSUMPTION: specific budget TBD with architecture — flagged in §8].
- Every visible Node displays its current occupant's name and photo (or a clear "vacant"/"unknown" state if data is missing).

#### FR-2: Drill through a Node's connections
A user can tap any Node to expand its directly connected Nodes (superior, subordinate, and peer relationships), without losing their place in the broader graph. Realizes UJ-1.

**Consequences (testable):**
- Expanding a Node reveals all of its direct Edges, each labeled with the relationship type (e.g. "reports to," "appoints").
- The user can collapse back to the prior view without a full reload.

**Out of Scope:**
- State-level and individual MP/MLA/constituency Nodes — `[NON-GOAL for MVP]`, deferred to a later expansion wave (see §6.2).

### 4.2 Person & Office Profiles
**Description:** Tapping a Person Node opens a profile that answers "how did they get here, and what does this job actually carry?" — their photo, party, constituency, a traced career path across prior Tenures, the powers and responsibilities of their current Office, and Accountability Data (assets, criminal cases, election history) sourced from ADR/MyNeta. Realizes UJ-1.

**Functional Requirements:**

#### FR-3: View a Person's career path
A user can see a Person's traced sequence of prior Tenures (Office + date range), presented as a path leading to their current position.

**Consequences (testable):**
- The career path renders in chronological order with at least Office name and date range per step.
- Tapping a prior Tenure step navigates Time Travel (§4.4) to that period, centered on that Person — the profile is a doorway into the living graph, not a disconnected mini-timeline. Realizes UJ-2.

#### FR-4: View an Office's powers and responsibilities
A user can see a plain-language description of what an Office can do, sourced from and linked to its Constitutional Citation(s).

**Consequences (testable):**
- Every Office Node displays at least one constitutional grounding, or an explicit "convention, not codified" label when no Article applies.

#### FR-5: View a Person's Accountability Data
A user can see a Person's declared assets, criminal case records, and election history, sourced from ADR/MyNeta data.

**Consequences (testable):**
- Accountability Data displays its source and last-updated date, consistent with LokTantra's "source-verifiable" design principle.
- Missing Accountability Data is shown as an explicit "not available" state, never silently omitted.

**Feature-specific NFRs:**
- Accountability Data must carry source attribution per LokTantra's neutrality/source-verifiability principles (`CLAUDE.md`).

### 4.3 Constitutional Grounding
**Description:** Every Edge and every Office in the graph carries a link back to the constitutional or statutory provision that creates or empowers it. Tapping a citation opens a plain-language explainer — turning the Constitution from a document you'd read about into the thing you keep bumping into while exploring. This is the throughline that fulfills the Vision's promise to "make the Constitution easy to understand." Realizes UJ-1.

**Functional Requirements:**

#### FR-6: Inspect a constitutional citation inline
A user can tap a Constitutional Citation attached to an Edge or Office and see a plain-language explanation of that provision without leaving the graph view.

**Consequences (testable):**
- The explainer opens as an overlay/panel that preserves the user's position in the graph (no navigation away).
- Each explainer links to the source text (existing `/constitution` explorer or equivalent) for users who want the full provision.

### 4.4 Time Travel
**Description:** A continuous scrubber lets the user select any date between 1947 and the present; the entire Power Graph re-renders to show who held each Office as of that date, resolved via the active Tenure for each Office on that date (last-known-state for in-between dates). This is what makes the system feel like "the Constitution in motion" rather than a static snapshot. Realizes UJ-2.

**Functional Requirements:**

#### FR-7: Scrub to any date and see the graph reorganize
A user can drag a continuous scrubber to any date from 15 August 1947 to today, and the Power Graph re-renders to reflect the Tenures active on that date.

**Consequences (testable):**
- For any selected date, each Office resolves to the Tenure whose start date is the most recent one at or before the selected date ("last known state"), per the confirmed gap-handling rule.
- Re-rendering completes within the same interactivity budget as the initial graph load (FR-1).
- Offices that did not yet exist as of the selected date are visibly absent or marked "not yet established," not shown as empty/vacant.

**Out of Scope:**
- Saving/bookmarking a specific date as a "snapshot" — `[NON-GOAL for MVP]` (see §6.2).

### 4.5 Search & Discovery
**Description:** A user who already knows who or what they're looking for can search directly — by Person name, Office title, or party — and jump straight into the graph at that Node, rather than browsing from the top.

**Functional Requirements:**

#### FR-8: Search the power graph directly
A user can search by Person name, Office title, or party, and select a result to jump directly to that Node within the current graph view (respecting whatever date Time Travel is currently set to).

**Consequences (testable):**
- Search returns results within LokTantra's existing search-route conventions (paginated, debounced) [ASSUMPTION: reuses existing `/api/search` infrastructure rather than a bespoke endpoint — confirm with architecture].
- Selecting a result centers the graph on that Node and preserves the currently selected Time Travel date.

## 5. Constraints and Guardrails

**Neutrality** *(explicit guardrail — directly serves LokTantra's "politically neutral, no party advocacy" principle from `CLAUDE.md`, and is non-negotiable for a feature that visually maps real politicians and parties):*
- Visual treatment of any Node — layout, size, prominence, ordering — is determined **structurally or chronologically** (constitutional rank, tenure dates, hierarchy position) and never editorially curated by party, popularity, or current events.
- Party colors and logos render as **factual attributes** of a Person/Office (consistent with how `PartyTracker` and other existing LokTantra components already treat party colors) — never as emphasis, endorsement, or visual favoritism.
- Every Office and every Person at an equivalent constitutional rank receives equivalent data depth and visual treatment — no figure or party is foregrounded relative to peers holding comparable positions.

**Source-Verifiability & Privacy:**
- All Accountability Data (FR-5) carries explicit source attribution and last-updated date, per `CLAUDE.md`'s "source-verifiable" principle.
- Accountability Data is limited to public-record facts (ADR/MyNeta declarations, election history) — no inference, ranking, scoring, or commentary that could read as a value judgment about a person.

## 6. Platform & Information Architecture

**Platform:** Mobile-first, responsive web — consistent with LokTantra's existing Next.js/Tailwind stack. The graph visualization is designed for touch and small screens first, then scaled up to larger viewports. `[ASSUMPTION: no native app is planned — flag if that's wrong.]`

**Information Architecture:** This feature **replaces** the existing `/power-structure` route and `PowerHierarchyExplorer` component outright — it supersedes that experience entirely (real people + drill-down + Time Travel vs. a static institutional tree showing only current office-holders). `[NOTE FOR PM: the migration/redirect plan for the old route is an architecture-phase concern — carried into §9 Open Questions, not decided here.]`

## 7. Non-Goals (Explicit)
- This is not a news or current-events feed — it shows structure and history, not commentary or analysis on unfolding political developments.
- This is not a platform for user-generated content — no comments, ratings, or rankings of politicians.
- This will not editorialize on a politician's performance, popularity, or merit — only present verifiable structural and Accountability facts (directly enforces §5 Neutrality).
- This does not aim to be a complete biography/wiki for every politician — profile depth is bounded by what the "graph of power" experience needs (career path, office, accountability), not exhaustive life history.

## 8. MVP Scope

### 8.1 In Scope
- National/central-layer Power Graph (President, PM, Union Cabinet & Ministers, central institutions, judiciary apex), centered on the PM, with full drill navigation — FR-1, FR-2
- Person & Office Profiles: career path, office powers with constitutional grounding, Accountability Data from ADR/MyNeta — FR-3, FR-4, FR-5
- Constitutional Grounding inline explainers — FR-6
- Continuous Time Travel scrubber, 1947–present, last-known-state resolution — FR-7
- Search by Person, Office, or party — FR-8
- Full replacement of `/power-structure` with this experience

### 8.2 Out of Scope for MVP
- **State governments, Chief Ministers, state cabinets** — `[NON-GOAL for MVP]`, deferred to expansion wave 2 (same shape, wider data).
- **Individual MPs/MLAs and constituency-level Nodes** — `[NON-GOAL for MVP]`, deferred to expansion wave 3.
- **Activity Data** (voting records, speeches, public statements) on profiles — `[NON-GOAL for MVP]`, deferred; the heaviest ongoing data-sourcing and maintenance lift of everything discussed.
- **Snapshot / bookmark-a-moment-in-time** — `[NON-GOAL for MVP]`. `[NOTE FOR PM: this was the emotional payoff of Priya's journey (UJ-2) — worth revisiting once the core scrubber ships and real usage patterns are visible.]`

## 9. Success Metrics
*Each SM cross-references the FR(s) it validates. Counter-metrics counterbalance specific primary/secondary metrics.*

**Primary**
- **SM-1**: Reach — unique visitors / monthly active users to the Power Explorer surface, target to be set with the team's broader growth goals. Validates FR-1 (the surface people actually arrive at and explore).
- **SM-2**: Share rate — how often a graph view or profile is shared/screenshotted/exported (the "Aman shares it with a friend" moment from UJ-1 turned into organic reach). Validates FR-1, FR-2.

**Secondary**
- **SM-3**: Time Travel engagement — % of sessions that move the scrubber at least once. Validates FR-7, the feature's most differentiated capability and the heart of the "Constitution in motion" promise.
- **SM-4**: Search usage — % of sessions that use Search & Discovery to jump directly to a Node. Validates FR-8.

**Counter-metrics (do not optimize)**
- **SM-C1**: Raw session length / time-on-page should *not* be chased as a proxy for success. This product's mission is "understand, then move on," not "stay scrolling" — inflated time-on-page could just as easily mean confusing navigation as genuine engagement, and optimizing for stickiness would conflict with LokTantra's educational, neutral identity. Counterbalances SM-1.
- **SM-C2**: Reach growth must *not* come from skewing visual prominence toward sensational, controversial, or currently-trending figures — that would directly violate the §5 Neutrality guardrail (structural/chronological treatment only). Counterbalances SM-1 and SM-2: growth must come from the quality and clarity of the experience, never from algorithmic amplification of any person or party.

## 10. Open Questions
1. **Performance budget**: What's the target load/re-render time for the Power Graph on mobile, and how does it sit within LokTantra's existing performance expectations? Affects FR-1, FR-7 — needs architecture input before epics are cut.
2. **Migration plan**: How should the existing `/power-structure` route and `PowerHierarchyExplorer` component be retired or redirected once this feature replaces them (§6)? Architecture-phase concern.
3. **Historical data availability**: Is there a sourced, verifiable dataset of national-layer Tenures (PM, Cabinet, key institutions) reaching back to 1947 — or does "continuous Time Travel to 1947" require new ETL/ingestion work of its own? This is the single biggest determinant of whether FR-7 is buildable as scoped, and should be validated **before** the architecture/epics phase, not discovered during it.
4. **Search infrastructure**: Does Search & Discovery (FR-8) reuse the existing `/api/search` Elasticsearch pipeline, or does graph-specific search (jump-to-Node while preserving Time Travel state) need its own approach?
5. **"Vacant" vs. "not yet established" states**: FR-1 and FR-7 both depend on distinguishing an Office that's *currently vacant* from one that *doesn't exist yet* as of a selected date — does the underlying data model already support that distinction, or does it need to be defined as part of this work?

## 11. Assumptions Index
*Every `[ASSUMPTION]` from the document, surfaced for explicit confirmation:*
- From §4.1 (FR-1) / §4.4 (FR-7) — performance/interactivity budget for graph load and re-render is left to architecture to set, not invented here. See Open Question #1.
- From §6 Platform — no native app is planned; this ships as responsive, mobile-first web only, consistent with LokTantra's existing Next.js stack.
- From §4.5 (FR-8) — Search & Discovery is assumed to reuse LokTantra's existing `/api/search` infrastructure rather than a bespoke endpoint. See Open Question #4.
