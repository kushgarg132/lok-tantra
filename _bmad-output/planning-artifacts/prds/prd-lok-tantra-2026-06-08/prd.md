---
title: Power Explorer
status: final
created: 2026-06-08
updated: 2026-06-08
---

# PRD: Power Explorer

## 0. Document Purpose

This PRD defines the **Power Explorer** — a new flagship feature for LokTantra that fully replaces the existing `/power-structure` page with a graph-based, navigable, historically-aware visualization of India's political power structure, grounded in real people and the Constitution that empowers them. It is written for the product owner (Kush) and for the downstream UX, architecture, and epics/stories workflows that build on it. Functional Requirements are grouped under the Features they belong to and numbered globally (FR-1 through FR-N) for stable cross-referencing; `[ASSUMPTION]` tags mark places the PM inferred without explicit confirmation, indexed in §11. This PRD builds on — and does not duplicate — LokTantra's existing `project-context.md` (tech stack and conventions) and `CLAUDE.md` (design principles, especially neutrality and source-verifiability); both are referenced inline where they bind.

## 1. Vision

Civics is usually taught as something to memorize — names, dates, articles, hierarchies in prose. LokTantra's Power Explorer replaces memorization with discovery: select any politician, post, or institution and watch their world unfold as a connected graph — how they got there, who they report to, what powers they hold, and which constitutional article grounds it all — populated with real people, real photos, and current data.

Wind the graph back through time to see how the same web of power looked in 1991, or 1977, or 1947, and the Constitution stops being an abstract document and becomes the living skeleton of a structure you can actually see move.

This is for anyone who has ever read a civics textbook and immediately forgotten which minister reports to whom, or wondered "wait — how *did* this person become Prime Minister?" — and would rather click through the answer than memorize it.

## 2. Target User

### 2.1 Jobs To Be Done

- **Functional (primary)**: "I need to understand how India's government actually works, beyond the textbook version" — replacing rote-memorized facts with a mental model of how power is structured, granted, and connected to the Constitution.

### 2.2 Key User Journeys
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
  - *(Snapshot/bookmark-a-moment is explicitly deferred — see [NON-GOAL for MVP] in §8.2.)*

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
- Initial render completes and is interactive on a mobile device within LokTantra's existing performance expectations [ASSUMPTION: specific budget TBD with architecture — see §10, Open Question #1].
- Every visible Node displays its current occupant's name and photo (or a clear "vacant"/"unknown" state if data is missing).

#### FR-2: Drill through a Node's connections
A user can tap any Node to expand its directly connected Nodes (superior, subordinate, and peer relationships), without losing their place in the broader graph. Realizes UJ-1.

**Consequences (testable):**
- Expanding a Node reveals all of its direct Edges, each labeled with the relationship type (e.g. "reports to," "appoints").
- The user can collapse back to the prior view without a full reload.

**Out of Scope:**
- State-level and individual MP/MLA/constituency Nodes — `[NON-GOAL for MVP]`, deferred to a later expansion wave (see §8.2).

### 4.2 Person & Office Profiles
**Description:** Tapping a Person Node opens a profile that answers "how did they get here, and what does this job actually carry?" — their photo, party, constituency, a traced career path across prior Tenures, the powers and responsibilities of their current Office, and Accountability Data (assets, criminal cases, election history) sourced from ADR/MyNeta. Realizes UJ-1.

**Functional Requirements:**

#### FR-3: View a Person's career path
A user can see a Person's traced sequence of prior Tenures (Office + date range), presented as a path leading to their current position.

**Consequences (testable):**
- The career path renders in chronological order with at least Office name and date range per step.
- Tapping a prior Tenure step navigates Time Travel (§4.4) to that period, centered on that Person — the profile is a doorway into the living graph, not a disconnected mini-timeline. Realizes UJ-2.
- Each step displays only Office, dates, and (where known) the factual mechanism of transition (e.g. "appointed," "elected," "succeeded") — never narrative framing, commentary, or characterization of *how* or *why* the move happened. A career path is a sequence of facts, not a story arc. Directly enforces §5 Neutrality and the no-editorializing Non-Goal in §7.

#### FR-4: View an Office's powers and responsibilities
A user can see a plain-language description of what an Office can do, sourced from and linked to its Constitutional Citation(s).

**Consequences (testable):**
- Every Office Node displays at least one constitutional grounding, or an explicit "convention, not codified" label when no Article applies.

#### FR-5: View a Person's Accountability Data
A user can see a Person's declared assets, criminal case records, and election history, sourced from ADR/MyNeta data.

**Consequences (testable):**
- Accountability Data displays its source and last-updated date, consistent with LokTantra's "source-verifiable" design principle.
- Missing Accountability Data is shown as an explicit "not available" state, never silently omitted.
- Every Person's Accountability Data renders through the **same template, fields, and depth**, regardless of their current media salience, party, or how controversial they are — comparative symmetry is enforced structurally by the template, not decided case-by-case. (Faithful sourcing alone doesn't prevent selective emphasis; symmetry of *treatment* is what closes that gap. Directly extends §5 Neutrality.)

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

`[NOTE FOR PM: this is the PRD's single highest-risk feature — its buildability rests on a national-level historical Tenure dataset back to 1947 that does not appear to exist yet. Open Question #3 has been reframed below from a feasibility check into a scoping decision with a fallback; resolve it before this feature is sized for architecture so "1947" doesn't stay load-bearing on an unverified assumption.]`

**Functional Requirements:**

#### FR-7: Scrub to any date and see the graph reorganize
A user can drag a continuous scrubber to any date from 15 August 1947 — or the fallback start date the PM locks in via Open Question #3 — to today, and the Power Graph re-renders to reflect the Tenures active on that date.

**Consequences (testable):**
- For any selected date, each Office resolves to the Tenure whose start date is the most recent one at or before the selected date ("last known state"), per the confirmed gap-handling rule.
- **On the exact date a Tenure begins, the graph shows the new Tenure as active** (start dates are inclusive) — this boundary rule is explicit and testable, not left to implementation discretion.
- The data model and UI distinguish three states an Office can be in as of a selected date, each rendered distinctly: **occupied** (an active Tenure resolves), **vacant** (the Office exists but no Tenure is currently active — e.g. a gap between appointments), and **not yet established / discontinued** (the date falls outside the Office's constitutional existence window, whether because it was created later or abolished/restructured earlier). This names the specific cases Open Question #5 was pointing at, so it is a locked consequence rather than something an engineer discovers mid-build.
- Where source records specify only a year (common for older Tenures), the system resolves to a stated convention (e.g. 1 January of that year) and visibly marks the date as **approximate** — precision is never invented where the historical record doesn't have it.
- Re-rendering completes within the same interactivity budget as the initial graph load (FR-1) — see Open Question #1 for how that budget gets set, including the pre-approved fallback if continuous scrubbing proves infeasible on mobile.

**Out of Scope:**
- Saving/bookmarking a specific date as a "snapshot" — `[NON-GOAL for MVP]` (see §8.2).

### 4.5 Search & Discovery
**Description:** A user who already knows who or what they're looking for can search directly — by Person name, Office title, or party — and jump straight into the graph at that Node, rather than browsing from the top.

**Functional Requirements:**

#### FR-8: Search the power graph directly
A user can search by Person name, Office title, or party, and select a result to jump directly to that Node within the current graph view, respecting the selected Time Travel date.

**Consequences (testable):**
- Search returns results within LokTantra's existing search-route conventions (paginated, debounced); the underlying retrieval mechanism — `/api/search` reuse vs. new graph-aware resolution — is an open question for architecture (see §10, Open Question #4).
- Selecting a result centers the graph on that Node and preserves the selected Time Travel date.

## 5. Constraints and Guardrails

**Neutrality** *(explicit guardrail — directly serves LokTantra's "politically neutral, no party advocacy" principle from `CLAUDE.md`, and is non-negotiable for a feature that visually maps real politicians and parties)*. The first bullet governs *prominence*; the rest exist because prominence alone isn't where neutrality risk lives — content, framing, and what travels outside the app matter just as much:

- **Prominence is structural, not editorial.** Visual treatment of any Node — layout, size, prominence, ordering — is determined **structurally or chronologically** (constitutional rank, tenure dates, hierarchy position) and never editorially curated by party, popularity, or current events. The default view centers on the *Office* of the Prime Minister — the constitutional apex of the executive — not on whoever currently holds it; Time Travel is what then reveals the full range of people who have occupied that Office across history. That range, however lopsided real history makes it look, is the feature's point — not a side effect to design around.
- **Party color is a secondary, neutral-palette cue — not party branding.** Party colors/logos render as **factual attributes**, using a consistent, LokTantra-defined neutral palette convention (not parties' own brand identities, which carry their own connotations), and the structural/chronological layout above remains the *primary* visual organizer with color strictly secondary. This is a deliberate mitigation, not a claim that color-coding is inert — grouping by color is a real perceptual cue, so layout must never lean on it to do organizational work.
- **Comparative symmetry is enforced by template, not judgment call.** Every Person and every Office at an equivalent constitutional rank receives identical data depth, fields, and presentation template — see FR-5's consequence for how this binds Accountability Data specifically. Faithful sourcing alone doesn't prevent selective emphasis; symmetry of *treatment* is what closes that gap.
- **Context travels with the content.** Because graph views and profile cards are explicitly designed to be shared and screenshotted (UJ-1, SM-2), source attribution, the selected Time Travel date, and constitutional citations render **inline and visible** on the card or view itself — never hidden behind a tap or tooltip — so that even a cropped, decontextualized fragment carries its own provenance and can't be presented as something the platform didn't actually say.

**Source-Verifiability & Privacy:**
- All Accountability Data (FR-5) carries explicit source attribution and last-updated date, per `CLAUDE.md`'s "source-verifiable" principle.
- Accountability Data is limited to public-record facts (ADR/MyNeta declarations, election history) — no inference, ranking, scoring, or commentary that could read as a value judgment about a person.

## 6. Platform & Information Architecture

**Platform:** Mobile-first, responsive web — consistent with LokTantra's existing Next.js/Tailwind stack. The graph visualization is designed for touch and small screens first, then scaled up to larger viewports. `[ASSUMPTION: no native app is planned — flag if that's wrong.]`

**Information Architecture:** This feature **replaces** the existing `/power-structure` route and `PowerHierarchyExplorer` component outright — it supersedes that experience entirely (real people + drill-down + Time Travel vs. a static institutional tree showing only current office-holders). `[NOTE FOR PM: the migration/redirect plan for the old route is an architecture-phase concern — carried into §10 Open Questions (#2), not decided here.]`

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
- Continuous Time Travel scrubber, last-known-state resolution, **start date pending the §10 Open Question #3 scoping decision** (target 1947, fallback ~1990 with 1947 as a later expansion wave) — FR-7
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
1. **Performance budget — needs a spike before it needs a number**: Continuous-scrub re-rendering of an interactive graph on mobile is something nothing in LokTantra's current stack has done (the only live Cytoscape usage today is a small, statically-laid-out graph) — so the right next step isn't "pick a millisecond target," it's "run a technical spike to learn what's achievable, then set the target from evidence." **Pre-approved fallback** if continuous scrubbing can't hit a workable budget on mobile: an anchored-to-known-transitions scrubber — the alternative explicitly considered and deferred during this PRD's drafting (see `.decision-log.md`, 2026-06-08). That fallback is *not* a redesign; architecture can reach for it directly without a new round of PM sign-off. Affects FR-1, FR-7.
2. **Migration plan**: How should the existing `/power-structure` route and `PowerHierarchyExplorer` component be retired or redirected once this feature replaces them (§6)? Architecture-phase concern.
3. **Historical data depth — a scoping decision with a fallback, not a yes/no feasibility check**: The available evidence (LokTantra's newest political dataset, `prisma/seed-political.ts`, is 100% hand-curated *current-day* data with zero historical rows, and no `Tenure`/Office-occupancy model exists yet in `prisma/schema.prisma`) strongly suggests the honest answer to "is there a sourced dataset back to 1947" is **no — assembling and verifying ~75 years of national-level Tenure records is itself a multi-month sourcing and data-modeling effort**, not a gap a feature build closes incidentally. `[NOTE FOR PM: this is a decision for you to make, not a fact for research to surface — the data almost certainly isn't there yet.]` The call to make: should MVP's Time Travel range start at a shallower, more sourceable depth (a commonly-used anchor is ~1990 onward, where records are denser and easier to verify) and extend to 1947 as its own expansion wave — the same "ship the shape, widen the data later" pattern already used for the state/MP/MLA cuts in §8.2? This must be resolved **before** FR-7 is sized for architecture; it is the single biggest determinant of whether "Time Travel to 1947" survives MVP as scoped.
4. **Search infrastructure — likely needs new graph-aware work, not a reuse**: §11 originally carried "reuses `/api/search`" as a working assumption. On inspection, that pipeline is built for *document* retrieval (BM25+KNN over text content), while "jump to a Node while preserving the active Time Travel date" is a *temporal graph-resolution* query — a different problem shape that most likely needs new `GraphService` work regardless of which HTTP route fronts it. Treat reuse as unlikely rather than default, and confirm the real shape with architecture.
5. **Data-model support for the three Office states**: FR-7 (§4.4) now names and locks the three states an Office can be in as of a selected date — occupied, vacant, and not-yet-established/discontinued. What remains genuinely open is whether `prisma/schema.prisma`'s current shape (which, per Open Question #3, has no `Tenure` model at all yet) can represent all three without a redesign, or whether this is simply part of the same data-modeling effort OQ#3 is already naming.

## 11. Assumptions Index
*Every `[ASSUMPTION]` from the document, surfaced for explicit confirmation:*
- From §4.1 (FR-1) / §4.4 (FR-7) — performance/interactivity budget for graph load and re-render is left to architecture to set, not invented here, **and is now understood to require a technical spike before any number can be proposed** (no precedent for continuous-scrub graph re-rendering exists in the current stack). See Open Question #1, including its pre-approved fallback.
- From §6 Platform — no native app is planned; this ships as responsive, mobile-first web only, consistent with LokTantra's existing Next.js stack.
