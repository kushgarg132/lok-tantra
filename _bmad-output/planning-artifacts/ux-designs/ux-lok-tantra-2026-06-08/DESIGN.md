---
title: Power Explorer — Visual Identity
status: final
created: 2026-06-08
updated: 2026-06-09
sources:
  - "../../prds/prd-lok-tantra-2026-06-08/prd.md"
name: Power Explorer
description: >
  Cinematic, graph-native visual identity for LokTantra's Power Explorer.
  Extends — does not replace — LokTantra's existing Tailwind theme
  (saffron / navy / chakra ramps, Inter / Plus Jakarta Sans / JetBrains Mono,
  class-strategy dark mode). Specifies only the deltas a living, navigable,
  time-traveling graph needs on top of that base: a neutral party-color
  convention, a node/edge/state visual grammar, Time Travel chrome, and a
  motion vocabulary that makes exploration feel like camera movement through
  connected space.
colors:
  inherits: "tailwind.config.ts (theme.extend.colors) — saffron, navy, chakra (50-900 ramps); darkMode: 'class'. Each value below is restated as a literal hex so this token tree resolves on its own; the trailing comment names which inherited ramp step it equals — tailwind.config.ts remains the source of truth if the base theme ever changes these ramps."
  canvas: "#eff6ff"                  # = navy.50
  canvas-dark: "#00002e"             # = navy.900
  node-person: "#f97316"             # = saffron.500
  node-person-dark: "#fb923c"        # = saffron.400
  node-office: "#000080"             # = navy.500
  node-office-dark: "#93c5fd"        # = navy.300
  node-institution: "#046a38"        # = chakra.500
  node-institution-dark: "#34d399"   # = chakra.400
  edge-base: "#64748b"               # corrected placeholder — clears WCAG 3:1 vs {colors.canvas} (the prior #94a3b8 measured 2.36:1, a contrast failure on the default color of every relationship line)
  edge-base-dark: "#94a3b8"          # corrected — clears WCAG 3:1 vs {colors.canvas-dark} (the prior dark-mode value, #475569, measured 2.67:1; the two variants had effectively been assigned to the wrong modes)
  edge-citation: "#34d399"           # = chakra.400
  state-occupied:
    opacity: "1.0"
    outline: "none"
  state-vacant: "#6b7280"
  state-vacant-dark: "#9ca3af"
  state-not-established:
    opacity: "0.2"
    outline: "dashed"
  party-tag-1: "#62569F"
  party-tag-2: "#76569F"
  party-tag-3: "#89569F"
  party-tag-4: "#9D569F"
  party-tag-5: "#9F568E"
  party-tag-6: "#9F567A"
  party-tag-overflow: "#6b7280"
  time-marker-approximate: "#78716c"  # warm stone-gray, not the saffron ramp — see Colors section below for why this shifted off the original {saffron.300} placeholder
  scrubber-track: "#64748b"           # corrected placeholder — the original {navy.200} (#bfdbfe) measured 1.31:1 against {colors.canvas}, far under the 3:1 floor for a persistent control
  scrubber-track-dark: "#000056"      # = navy.700
  scrubber-fill: "#fb923c"            # = saffron.400
  scrubber-thumb: "#f97316"           # = saffron.500
typography:
  inherits: "tailwind.config.ts (theme.extend.fontFamily) — sans (Inter), display (Plus Jakarta Sans), mono (JetBrains Mono)"
  headline: "font-display (Plus Jakarta Sans), used for Person/Office names and section titles — the graph's 'voice' when it introduces someone"
  body: "font-sans (Inter), used for descriptions, explainers, and microcopy"
  data: "font-mono (JetBrains Mono), used for dates, tenure ranges, Article numbers, and Accountability figures — a distinct register that visually marks 'this is sourced fact'"
rounded:
  inherits: "Tailwind defaults (no custom borderRadius scale in tailwind.config.ts — none invented here either)"
  node-card: "rounded-2xl"
  sheet: "rounded-t-3xl"
  chip: "rounded-full"
spacing:
  inherits: "Tailwind's default 4px-based scale (no custom spacing scale in tailwind.config.ts)"
  canvas-padding: "p-4 (mobile) / p-8 (≥ md)"
  node-min-tap-target: "min-h-11 min-w-11 (44px — accessibility floor)"
  sheet-snap-points: "peek (120px) / half (50vh) / full (92vh)"
components:
  node-card-person: "circular avatar + {typography.headline} name + party-tag chip + Office label + a persistent {typography.data} provenance line ('Power Graph · [selected date] · Source: [primary source]') rendered inside the card's own frame"
  node-card-office: "rounded-square glyph + {typography.headline} title + occupant inset (photo or vacancy glyph) + the same persistent {typography.data} provenance line as node-card-person"
  edge: "directional line/arc, arrowhead, relationship-type label; citation-bearing edges carry a small {colors.edge-citation} dot"
  party-tag-chip: "rounded-full, neutral surface fill with standard body-text ink; party-tag-1..6 (or party-tag-overflow) render only as a small leading dot, {typography.data} abbreviation reads in the surface's normal text color — never the chip's own fill or text color, so legibility never depends on the party hue"
  citation-panel: "overlay sheet, {colors.edge-citation} accent rule, {typography.data} Article reference + {typography.body} plain-language explainer"
  time-travel-scrubber: "continuous track + thumb + {typography.data} date readout; time-marker-approximate glyph when source precision is year-only"
  accountability-block: "identical template for every Person — {typography.data} figures, source + last-updated footer, explicit 'not available' state. Takes only data as input — no props, flags, or content-authoring path can change which fields render, their order, size, or position per-Person; any field addition changes the template for everyone simultaneously"
  state-badge: "shape + text label for occupied / vacant / not-yet-established — never color alone"
  profile-sheet: "bottom-sheet overlay ({rounded.sheet}), {typography.headline} Person/Office name header, photo (Person) or state glyph (Office), fixed-order sections: career path, Office powers, Accountability Data; {typography.data} provenance footer — same anatomy for every Person/Office, no per-profile custom layout"
  search-overlay: "full-bleed overlay, {typography.body} search input with visible focus ring, result rows echoing node-card-person / node-card-office at compact scale, {typography.data} result metadata (Office, party tag, date context)"
---

# DESIGN.md — Power Explorer

> Extends LokTantra's existing Tailwind theme (`tailwind.config.ts`). This document specifies deltas only — the visual decisions Power Explorer needed that the base theme didn't already make. Where a token isn't redefined here, the base theme's value applies.

## Brand & Style

Power Explorer feels like **stepping into a living machine you can walk through and rewind** — not a chart to read, but a space to travel. [ASSUMPTION: this reading of "cinematic & immersive" — depth, camera-like motion, a sense of *moving through* connected space rather than *paging between* screens — is the PM's chosen interpretation; confirm before this becomes load-bearing for engineering's animation budget.]

It speaks in LokTantra's existing voice — saffron warmth, navy structure, chakra civic grounding — but adds **depth and motion** so that "browsing a hierarchy" becomes "flying through history." The mood is *reverent, not dramatic*: this is the machinery of a constitutional democracy, not a video game. Cinematic means the graph has weight and presence; it does not mean spectacle for its own sake — every motion either reveals structure or marks the passage of time (§ Elevation & Depth).

`[ASSUMPTION: dark mode is the graph canvas's default register]` — night-sky navy (`{colors.canvas-dark}`) gives Nodes and their connecting Edges room to glow and recede, reinforcing the "constellation of power" feeling Time Travel is built to deliver. Light mode remains fully supported (LokTantra's `class`-strategy convention is unchanged) and reads as the "daylight, textbook" register — present, but not the feature's emotional center. This is an inference from the "cinematic & immersive" mood, not a confirmed preference; cheap to confirm with a single side-by-side comparison before build.

## Colors

Three existing ramps carry distinct *meanings* in Power Explorer, not just decoration — this is itself a structural-neutrality device (§5 of the PRD): **the same three colors appear everywhere a Person, an Office, or an Institution appears**, so no individual figure can visually "own" a register.

- **`{colors.node-person}` (saffron)** — the human layer. Every Person Node, regardless of party, rank, or salience, renders in this register. Warmth signals "a real person stands here."
- **`{colors.node-office}` (navy)** — the structural layer. Every Office Node renders in this register — "the seat," independent of who sits in it. This is the PRD's "Office, not officeholder" framing made visible (§5: the default view centers the *Office* of the PM, not its current occupant).
- **`{colors.node-institution}` (chakra)** — the civic/constitutional layer. Institutions and Constitutional-Citation accents share this register, visually tying "the body" to "the document that creates it."

**Party color is a new, deliberately invented delta** — `party-tag-1` through `party-tag-6` (plus `party-tag-overflow`), a muted, equal-weight categorical palette `[ASSUMPTION: placeholder hex values — exact hues still need final sign-off from whoever owns §5 Neutrality before real build, since getting this wrong is the single highest reputational-risk color decision in the product. The values below replace an earlier placeholder set that — on closer hue/contrast analysis — turned out to collide with exactly the things this palette exists to avoid; they're a corrected starting point for that sign-off conversation, not a finished answer.]`. The replacement set was chosen against three constraints *simultaneously* (the earlier set satisfied none of them at once):
- **Hue distance from real party brands and the app's own registers** — all six sit in the violet → magenta → rose arc (hues 250°–330°), a band that Indian national and major regional parties don't claim as primary brand identity (unlike orange/saffron, green, blue, yellow, and red, which collectively cover most of the rest of the wheel — see the `[ASSUMPTION]` immediately below for the sign-off brief this hands forward). Each tag sits at least 25° of hue from `{colors.node-person}` (saffron), `{colors.node-office}` (navy), `{colors.node-institution}` (chakra-green), and the brand hues of the largest national formations.
- **Equal perceptual weight** — all six share identical saturation (30%) and lightness (48%), spaced at even 16° hue intervals, so **no party tag visually dominates** another at a glance — the opposite of how parties design their *own* brand colors (which compete for visual primacy on purpose). This is a tighter band than "roughly equal": it's the same two numbers, six times, with only hue varying.
- **Contrast** — every tag clears WCAG's 3:1 non-text floor against *both* `{colors.canvas}` and `{colors.canvas-dark}` (a constraint the placeholder values must satisfy as numbers, not just as design intent — see DESIGN.md's own Do's and Don'ts on color-as-signal).
- They render only as a small leading **dot** beside the party abbreviation inside `{components.party-tag-chip}` — never as the chip's fill or background — so text-on-color contrast rules never come into play (see `{components.party-tag-chip}` below for the resolved fill-vs-accent question).
- They never function as a fill, background, or organizing axis for the graph itself — a factual attribute sitting *beside* a name (binds §5's "color is secondary, layout is primary").

`[ASSUMPTION: a national-layer Council of Ministers can plausibly draw from ten-to-fifteen distinct parties at once in a coalition government — likely more than six. Two rules close this gap until real sign-off: (1) tags are assigned in a fixed, publishable, party-agnostic order — alphabetical by official registered name — never by salience or recency, so assignment itself can't become an editorial act; (2) any party beyond the sixth slot in a single view renders with `{colors.party-tag-overflow}` (a flat neutral gray, not a "mystery hue") plus its full name spelled out in the chip's `{typography.data}` abbreviation field — "and N more parties" never hides who they are behind a shared color. This needs the same §5-owner sign-off as the hue set itself — "how many colors" and "which hues" are one conversation, not two.]`

**State colors** make FR-7's three Office-states (occupied / vacant / not-yet-established-or-discontinued) readable at a glance *and* without relying on color alone (colorblind users, and screenshots that lose color fidelity, must still be able to tell them apart — every state pairs its color treatment with a distinct shape treatment, see `{components.state-badge}`). `{colors.state-occupied}` and `{colors.state-not-established}` are *modifiers* — opacity and outline values applied on top of whichever register color (`{colors.node-person}` / `{colors.node-office}` / `{colors.node-institution}`) the Node already carries — not standalone hexes; `{colors.state-vacant}` is the one state that *is* a standalone color, because "vacant" has no register to modify (there's no occupant to carry one):
- **Occupied** — `{colors.state-occupied}`: the Node's own register color at full opacity (`opacity: 1.0`, `outline: none`) with the occupant's photo inset.
- **Vacant** — `{colors.state-vacant}` (`#6b7280` light / `{colors.state-vacant-dark}` `#9ca3af` dark — corrected from a single placeholder value that measured 2.33:1 against the light canvas, under the WCAG 3:1 floor for the *entire visual signal* that an Office is empty), outline only, no fill, a generic silhouette glyph instead of a photo. Reads as "the seat is empty," not "data is missing."
- **Not yet established / discontinued** — `{colors.state-not-established}`: the Node's own register color at 20% opacity (`opacity: 0.2`) with a dashed outline (`outline: dashed`). Reads as "this didn't exist yet" — a ghost, not an error.

**`{colors.time-marker-approximate}`** (`#78716c`, a warm stone-gray) flags year-only historical dates per FR-7's "approximate" convention — a soft warm highlight rather than a warning color, because imprecision in 75-year-old records is expected, not alarming. `[ASSUMPTION: this value was deliberately moved off the saffron ramp — the original placeholder (`saffron.300`), sat in the same narrow hue band as {colors.node-person} and a major party's brand identity, compounding exactly the collision risk named two paragraphs up, and on a surface (Time Travel) where a critic is most likely to be looking for "does the platform's palette warm up to certain eras or figures." This stone-gray keeps the "gentle, not alarming" intent — it reads as warm-neutral, not as a hue any party or register can claim — while clearing WCAG contrast against both canvases.]`

## Typography

Inherits LokTantra's three-family stack (`tailwind.config.ts theme.extend.fontFamily`) wholesale — Power Explorer's delta is *which family carries which kind of meaning*, not new families:

- **`{typography.headline}` (Plus Jakarta Sans / `font-display`)** — Person and Office names, profile headers, citation headlines. This is the graph's "voice" at the moment it introduces someone — it should feel like a credit reveal, not a label.
- **`{typography.body}` (Inter / `font-sans`)** — descriptions, plain-language constitutional explainers, microcopy, empty/error states.
- **`{typography.data}` (JetBrains Mono / `font-mono`)** — dates, tenure ranges, Article numbers, Accountability figures (asset values, case counts), party abbreviations in tags. Monospace gives sourced, factual content its own visual register — the reader learns to recognize "this is a verifiable fact" by typeface alone, reinforcing `CLAUDE.md`'s source-verifiability principle and §5's "context travels with the content" guardrail (a screenshot's mono-set citation block reads as data even stripped of its surrounding chrome).

## Layout & Spacing

Mobile-first per the PRD's Platform decision (§6) — the graph canvas *is* the layout; profile, citation, and Accountability content arrive as bottom sheets layered over it rather than as separate pages, so the user's place in the graph is never lost (directly serves FR-2's "expand without losing your place" and FR-6's "without leaving the graph view").

- Inherits Tailwind's default 4px spacing scale — no custom extension exists in `tailwind.config.ts` and none is invented here.
- `{spacing.canvas-padding}` keeps Nodes clear of viewport edges and system chrome (notches, gesture bars) on small screens.
- `{spacing.node-min-tap-target}` (44px) is a hard floor — graphs are dense by nature, but every tappable Node and control meets the accessibility minimum regardless of zoom level. `[ASSUMPTION: at deep zoom-out, Nodes below this visual size become tap-disabled for direct touch but remain reachable via Search (FR-8) and the screen-reader connections list (EXPERIENCE.md → Accessibility Floor) — pinch-to-zoom is one path in, never the only path, preserving access for switch-access and single-finger users. Confirm the visual trade-off with engineering during the performance spike (PRD Open Question #1).]`
- `{spacing.sheet-snap-points}` — profile/citation/Accountability sheets snap to peek / half / full, a standard mobile pattern that lets the user glance at a profile without losing the graph behind it (peek), read comfortably (half), or focus fully (full).

## Elevation & Depth

This is where "cinematic" earns its place: depth is rendered through **focus, not flat material shadows**. Power Explorer borrows a camera's depth-of-field rather than a UI's drop-shadow stack:

- **Focused** — the Node currently expanded/selected renders at full opacity, full scale, sharp.
- **Connected** — its directly-linked Nodes (the ones FR-2 reveals on expansion) render slightly receded — ~85% opacity, very slightly scaled down — close enough to read, clearly "next."
- **Field** — the rest of the graph dims and softly blurs, present as context (so the user never feels lost) without competing for attention.

**The Focused anchor rule — locked, not a vibe:** during `graph-traverse`, "Focused" is trivially neutral (the user tapped something, so of course it's the focal point). During `time-rewind` it is the single most editorially-loaded camera decision in the entire feature, and this spine locks it explicitly: **the Focused anchor remains the Office (or graph position) the user was viewing before the scrub began — never the occupant.** As Tenures change underneath a focused Office across the scrub, each new occupant's Node enters at Connected/Field depth like any other newly-revealed Node, and only becomes Focused if the user explicitly taps it. The camera follows *structure* through history, not faces — which is the only reading that keeps "Office, not officeholder" (the framing this very document praises two sections up) alive *through* Time Travel rather than letting it evaporate the moment the scrubber moves. The alternative — the camera's sharpest, largest, most foregrounded treatment automatically migrating to whichever historical figure happens to occupy the seat at each moment of a 75-year rewind through eras like the Emergency or the post-Independence settlement — would be a system *choosing* which named individuals to spotlight, which is exactly the "editorially curated" treatment §5 rule #1 prohibits, dressed as a camera effect. One sentence closes the gap; this is that sentence, mirrored in `EXPERIENCE.md`'s `time-rewind` row.

Panels and sheets use LokTantra's existing `animate-fade-in` / `animate-slide-up` keyframes for entry — no new motion vocabulary needed there. Two motions *are* new deltas this feature requires and don't yet exist in `tailwind.config.ts` `[ASSUMPTION: names and easings below are proposals for engineering to formalize during build, not finalized specs]`:
- **`graph-traverse`** — the pan/zoom/refocus that happens when a Node expands; reads as the camera moving *through* the graph toward the new focal point, not the content swapping out.
- **`time-rewind`** — the re-render that happens when the Time Travel scrubber moves; Nodes that exist at the new date settle into place, Nodes that don't fade to the "not yet established" ghost treatment (or back from it), giving the unmistakable feeling of watching history run in reverse — anchored on the Office per the Focused-anchor rule above, so the *structure* visibly persists while the *faces* change underneath it. This is UJ-2's entire emotional payload (§4.4) — it deserves its own named motion, not a generic cross-fade.

**Motion budget** `[ASSUMPTION: numeric ceilings below are placeholders pending the Open Question #1 performance spike — the category of constraint is the load-bearing part, not the specific numbers, and a builder needs a named ceiling to budget against even before the spike resolves the exact figure]`:
- `graph-traverse` and `time-rewind` complete within **~400ms** — long enough to read as deliberate camera movement, short enough to stay clear of the ~5-second zoom-and-translate window general vestibular guidance (and WCAG 2.3.3) flags as higher-risk for susceptible users.
- The "Field" blur stays at a **light defocus** — a subtle softening that preserves silhouette and color, never a heavy gaussian/depth blur that itself becomes a visual-strain or vestibular trigger as a permanent, always-on treatment.
- No layer (Focused / Connected / Field) moves at more than **±15%** of the focal layer's apparent speed during a traverse — close enough to feel like depth, far enough from "things visibly racing past each other" to avoid the parallax-delta trigger.

`prefers-reduced-motion` collapses `graph-traverse` and `time-rewind` to instant cuts with no loss of information — the graph still refocuses and the date still changes; only the camera-movement *feeling* is removed. The "Field" blur is *not* a camera-movement animation — it is a permanent depth-of-field treatment — so it is **not** removed by `prefers-reduced-motion`; it instead stays within the light-defocus ceiling above regardless of the user's motion preference, since a constant blur is a contrast/visual-strain concern (addressed by the budget itself), not a motion concern (see `EXPERIENCE.md` → Accessibility Floor for the mirrored rule).

## Shapes

Shape is part of the *structural* visual grammar §5 requires — it carries meaning that color alone shouldn't have to:

- **Person Nodes are circles** (portrait photos read naturally in the round; "a person" is a face, not a box).
- **Office and Institution Nodes are rounded squares** (`{rounded.node-card}`) — "a seat" or "a body" is a place, not a face. This Person-vs-Office shape distinction is what makes "the Office of the PM, not whoever currently holds it" *visible* at a glance, independent of any photo or name.
- **Edges are directional** — a line or arc with an arrowhead pointing from subordinate to superior (or per the relationship's actual direction), stroked in `{colors.edge-base}` (light) / `{colors.edge-base-dark}` (dark), labeled with its relationship type. Citation-bearing edges carry a small `{colors.edge-citation}`-colored dot at their midpoint — a visual promise that "tapping here opens grounding," consistent everywhere it appears.
- **Sheets** use `{rounded.sheet}` (rounded top corners only) — the standard mobile bottom-sheet silhouette, signaling "this layers over the graph, the graph is still there underneath."
- **Tags/chips** use `{rounded.chip}` (fully rounded) — small, factual, pill-shaped attributes that sit *beside* a name rather than reshaping its container.

## Components

| Component | Visual spec | Behavioral notes (→ `EXPERIENCE.md`) |
|---|---|---|
| `node-card-person` | Circle, `{colors.node-person}` register, `{typography.headline}` name, party-tag chip, Office label in `{typography.body}`, **and a persistent `{typography.data}` provenance line — "Power Graph · [selected Time Travel date] · Source: [primary data source for this view]" — set inside the card's own visual frame, not separate chrome** | Tap → expand in place (FR-2). This provenance line is the component-level instantiation of the "context travels with content" rule (→ Do's and Don'ts): it is *the* element that makes Flow 1's screenshot-and-share climax (`EXPERIENCE.md` UJ-1 step 6) self-explaining, because a tight crop around the expanded card physically cannot exclude it |
| `node-card-office` | Rounded square, `{colors.node-office}` or `{colors.node-institution}` register, `{typography.headline}` title, occupant inset or `state-badge`, **plus the same provenance line as `node-card-person`** | Occupant inset shows the current Tenure's Person, or the relevant vacancy/not-established glyph |
| `edge` | Directional line/arc, arrowhead, `{typography.body}` relationship label, optional `{colors.edge-citation}` dot | Tapping the citation dot opens `citation-panel` without leaving the graph (FR-6) |
| `party-tag-chip` | `{rounded.chip}`, neutral surface fill + standard ink; `party-tag-1`..`6` (or `party-tag-overflow`) render *only* as a small leading dot — never the fill or text color — beside the `{typography.data}` party abbreviation | Factual attribute only, non-interactive — never the party's own brand color or logo (§5; binds the "color is secondary, layout is primary" rule in → Do's and Don'ts) |
| `citation-panel` | Overlay sheet, `{colors.edge-citation}` accent rule, `{typography.data}` Article reference, `{typography.body}` plain-language explainer, link to `/constitution` | Opens over the graph, preserves position (FR-6) |
| `time-travel-scrubber` | Continuous `scrubber-track` / `scrubber-fill` / `scrubber-thumb`, `{typography.data}` date readout, `{colors.time-marker-approximate}` glyph for year-only dates | Drag re-renders the graph via `time-rewind` (FR-7) |
| `accountability-block` | `{typography.data}` figures, source + last-updated footer in `{typography.body}`, explicit "not available" state. Takes only data as input — no props, flags, or content-authoring path can change which fields render, their order, size, or position per-Person; any field addition changes the template for everyone simultaneously | **Identical** for every Person regardless of salience — the template *is* the neutrality enforcement (FR-5, §5). Structurally impossible to render asymmetrically, not just convention |
| `state-badge` | Shape + `{typography.body}` text label (never color alone) for occupied / vacant / not-yet-established | Pairs with the node's visual treatment (§ Colors) |
| `profile-sheet` | Bottom-sheet overlay (`{rounded.sheet}`), `{typography.headline}` Person/Office name header, photo or state glyph, fixed-order sections (career path → Office powers → Accountability Data), `{typography.data}` provenance footer | Opens at half snap; drag to peek/full/dismiss. Same anatomy for every Person/Office — no per-profile custom layout |
| `search-overlay` | Full-bleed overlay, `{typography.body}` search input with visible focus ring (`{colors.node-office}` accent), result rows echoing `node-card-person`/`node-card-office` at compact scale, `{typography.data}` metadata per result | Results respect active Time Travel date; paginated and debounced (FR-8) |

## Do's and Don'ts

| Do | Don't |
|---|---|
| Let constitutional rank, hierarchy position, and chronology drive a Node's size, position, and prominence | Enlarge, foreground, or otherwise visually favor a Node because it's trending, controversial, or popular (§5; SM-C2) |
| Render party affiliation as a small `party-tag-chip` in the app's own neutral palette | Use a party's actual brand colors or logo — they carry connotations LokTantra does not endorse (§5) |
| Give every Person and every Office at an equivalent rank the *exact* same card template, fields, and depth | Add visual "extras" — bigger photos, richer detail, more prominent placement — for figures who happen to be more newsworthy (§5; FR-5) |
| Animate only what *means* something: `graph-traverse` = "you moved through the structure," `time-rewind` = "history just moved" | Animate decoratively. Motion that doesn't carry meaning competes with the cinematic intent and burns the mobile performance budget the PRD already flags as at-risk (Open Question #1) |
| Keep source attribution, the selected Time Travel date, and citations rendered inline and visible on every shareable view | Hide provenance behind a tap or tooltip — a cropped screenshot must still carry its own context (§5 "context travels with the content") |
| Mark vacant and not-yet-established Offices with a distinct *shape* treatment plus a text label | Rely on color alone to distinguish states — colorblind users and desaturated screenshots both lose a color-only signal |
