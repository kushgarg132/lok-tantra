---
title: Power Explorer — Accessibility Review (DESIGN.md + EXPERIENCE.md)
status: review
created: 2026-06-08
reviewer: accessibility-focused UX review pass
scope: >
  Reviews DESIGN.md and EXPERIENCE.md against the three structural accessibility
  risks this product's core concept concentrates: (1) graph density/navigation,
  (2) color-as-information-channel, (3) cinematic motion as the differentiated
  experience. Graded at "demo" rigor — not WCAG AAA conformance — i.e. "does this
  spine give a builder enough to not accidentally ship something inaccessible,
  given the specific risks THIS product carries."
---

# Accessibility Review — Power Explorer (DESIGN.md + EXPERIENCE.md)

## Overall verdict

This spine pair is **meaningfully better than baseline** — it names all three structural risks explicitly, commits to testable rules like "color is never the only signal" and "every Node is labeled with role + state," and keeps the `prefers-reduced-motion` behavior consistent across both documents. But on the two hardest cases the product actually carries — **screen-reader navigation through a dense spatial graph**, and **whether the placeholder color values pass contrast against the stated canvases** — the spec stops at the level of principle and doesn't reach the level of a buildable rule, and in the contrast case the placeholder values it offers would visibly fail if shipped as-is. The motion spec is the strongest of the three risk areas (consistent reduced-motion language, both docs agree) but is missing the numeric thresholds (duration, blur/parallax intensity) a builder needs to know whether the *default* cinematic experience itself crosses a vestibular-safety line — not just what happens when the user opts out.

---

## Findings

### Finding 1 — `state-vacant` and `edge-base` placeholder colors fail WCAG non-text contrast (3:1) against the light-mode canvas
**Severity: high**
**Location:** `DESIGN.md` front-matter, lines 28–32 (`edge-base: "#94a3b8"`, `state-vacant: "#9ca3af (outline only, no fill)"`) checked against `canvas: "{navy.50}"` → resolves to `#eff6ff` in `tailwind.config.ts`.

Computed contrast ratios (WCAG relative-luminance formula):
- `state-vacant (#9ca3af)` vs `canvas (#eff6ff)` = **2.33:1** — fails the WCAG 1.4.11 "Non-text Contrast" minimum of 3:1 for graphical objects/UI component boundaries.
- `edge-base (#94a3b8)` vs `canvas (#eff6ff)` = **2.36:1** — same failure, and its `-dark` variant doesn't clear the bar either: `edge-base-dark (#475569)` vs `canvas-dark (#00002e)` = **2.67:1**, also under 3:1.

This matters specifically because of *what* these two tokens render: `state-vacant` is the **entire visual signal** that distinguishes "Office is vacant" from "Office is occupied" in `DESIGN.md`'s own description ("outline only, no fill... reads as 'the seat is empty'") — an outline that's barely distinguishable from its background fails at the one job it has. `edge-base` is the **default color of every relationship line in the graph** — in a product whose core value proposition is "see how power connects," a structurally under-contrast edge undermines the entire premise for low-vision users (not just legally-blind users; this is the broader population with reduced contrast sensitivity, which includes most users over ~50 and many with uncorrected refractive issues).

Note: both colors pass comfortably against `canvas-dark` (7.96:1 and 7.88:1 respectively) — and `[ASSUMPTION: dark mode is the graph canvas's default register]` (DESIGN.md line 81) softens the immediate risk. But `DESIGN.md` is explicit that "light mode remains fully supported... and reads as the 'daylight, textbook' register" (not a deprecated fallback), and neither token has a defined `-light`/`-dark` split the way `node-person`/`node-office`/`node-institution`/`scrubber-track` do. As written, a builder who ships the single listed hex in light mode ships a contrast failure on the very states this spec singles out as needing to "be readable at a glance... without relying on color alone."

**Fix:** Either (a) give `state-vacant` and `edge-base` explicit light/dark pairs the same way the register colors have them (e.g., a darker gray for light mode that clears 3:1 against `#eff6ff` — something in the `slate-500`/`#64748b` neighborhood lands ~3.9:1), or (b) if dark-mode-only is truly the intended register for the graph canvas regardless of system theme, say so explicitly and remove the "light mode fully supported" framing from the canvas context (leaving it for sheets/profiles/chrome only). Either resolution is cheap; shipping the current single value is not.

---

### Finding 2 — Five of six `party-tag-*` placeholder hexes fail WCAG contrast against the light canvas; the chip's text-on-fill relationship is itself ambiguous, compounding the risk
**Severity: high**
**Location:** `DESIGN.md` front-matter lines 34–39 (`party-tag-1` through `party-tag-6`) and `components.party-tag-chip` (line 64): *"rounded-full, one of `party-tag-1`..`6`, `{typography.data}` abbreviation."*

Computed contrast vs `canvas (#eff6ff)`:

| Token | Hex | Ratio | 3:1 (graphical) | 4.5:1 (normal text) |
|---|---|---|---|---|
| party-tag-1 | `#8B95A6` | 2.78:1 | fail | fail |
| party-tag-2 | `#A8856B` | 3.10:1 | pass | fail |
| party-tag-3 | `#7FA08C` | 2.64:1 | fail | fail |
| party-tag-4 | `#9B85A6` | 3.06:1 | pass | fail |
| party-tag-5 | `#6B95A8` | 2.97:1 | fail | fail |
| party-tag-6 | `#A69B6B` | 2.57:1 | fail | fail |

(All six pass comfortably against `canvas-dark` at 6.0–7.2:1 — so again, the light-mode "fully supported" register is where this bites.)

This is compounded by a genuine spec ambiguity: the component description pairs the `party-tag-N` token directly with "`{typography.data}` abbreviation" inside a `rounded-full` chip, but never states whether that color is the **chip's fill** (text rendered on top, needing 4.5:1 normal-text contrast — all six placeholders fail this against the light canvas) or merely an **accent/border/dot** (a graphical element needing 3:1 — four of six placeholders fail even this lower bar). Two engineers reading line 64 in isolation could reasonably build either: one renders `bg-[party-tag-N] text-white` chips, the other renders a neutral chip with a small `party-tag-N` accent dot. They would ship visibly different — and differently-accessible — components from the same spec line.

This is exactly the kind of placeholder the spec itself flags as highest-stakes (line 91: *"getting this wrong is the single highest reputational-risk color decision in the product"*) — but the `[ASSUMPTION]` attached to it asks for sign-off on "exact hues" for *brand-neutrality* reasons only; it doesn't flag that the placeholder values, as numbers, would currently fail contrast math if carried through to build, nor does it resolve the fill-vs-accent ambiguity that determines which contrast bar even applies.

**Fix:** (a) Resolve the fill-vs-accent question explicitly in the `party-tag-chip` component spec — e.g., "neutral `surface` chip background, `party-tag-N` rendered as a small leading dot + the abbreviation in `ink`/`navy` text" sidesteps the text-on-color contrast problem entirely and is consistent with "a factual attribute sitting *beside* a name" (line 94). (b) Whoever does the real-build neutrality sign-off on hues (already flagged) should be handed the contrast constraint as a hard input, not just a brand one — "muted, equal lightness/saturation" and "passes 3:1 against both canvases" are both satisfiable simultaneously, but only if stated as a joint constraint up front.

---

### Finding 3 — EXPERIENCE.md does not give a screen-reader user any path *through* the graph — it specifies node-level labeling but not graph-level navigation, and this is a real open gap, not a nuance
**Severity: critical**
**Location:** `EXPERIENCE.md` → Accessibility Floor, line 91 (the *only* screen-reader-relevant line in either document): *"Every Node, Edge, and control is labeled with role + state for screen readers; state badges... announce their text label, not a color name."*

This line describes how a **single, already-focused** Node/Edge announces itself. It says nothing about:
- In what **order** a screen-reader user encounters Nodes (is there a defined linear traversal — e.g., DOM order mirrors hierarchy rank, or breadth-first from the focal Node?), since a spatial canvas has no inherent reading order:
- How a screen-reader user **moves from one Node to its connected Nodes** — the single behavior this entire feature exists to deliver (FR-2: tap a Node, reveal what it connects to). Pan/zoom/drag (the primary sighted-user navigation primitives, EXPERIENCE.md line 82) are spatial gestures with no defined non-visual analog.
- Whether there is a **non-graph list-view alternative** — a sequential, navigable representation of "this Node's connections" that a screen-reader user can traverse with standard swipe-to-next-element gestures, the way (for example) a data table is the accessible-alternative pattern for a chart.

The spec's one candidate escape hatch — Search (`EXPERIENCE.md` lines 32, 61, 119) — gets a user *to* a Node ("Selecting a result centers the graph there") but explicitly stops at "centers the graph," which is a spatial/visual outcome a screen-reader user cannot perceive or act on. It does not continue into "...and now here is how you move from this Node to what it connects to," which is the actual task.

This is squarely the gap the task brief anticipated might be a genuine open problem worth surfacing rather than something already solved — and that is exactly what this review is finding: **the spec currently has no answer to "how does a blind user explore the Power Graph," only an answer to "how does a blind user hear what one Node is once they're on it."** For a feature whose entire premise is *traversal* ("flying through history," "a space to travel," not "a chart to read" — DESIGN.md lines 77–79), that's not a peripheral accessibility nicety; it's the core interaction model being undefined for an entire user population.

**Fix:** This likely needs an architecture-level decision, not just a copy-edit — but the spine should at minimum *name* the shape of the answer so engineering doesn't improvise one late. Plausible directions worth scoping explicitly: (a) a parallel **list/outline view** of "this Node + its direct connections," reachable from any focused Node, that mirrors exactly what `graph-traverse` reveals visually but in a linearly-navigable form (this is the most established pattern for accessible graph/network UIs); (b) a defined **traversal order contract** — e.g., "from a focused Node, screen-reader users can move to connected Nodes via standard next/previous gestures, in [hierarchy-rank / alphabetical / citation-bearing-first] order" — wired into the same expand-in-place model sighted users get, so it's one mental model, not two products. Either way, this deserves its own `[ASSUMPTION — open for architecture]` flag at minimum, parallel to how the offline-state gap is already flagged (`EXPERIENCE.md` line 74) — right now it reads as solved when it isn't.

---

### Finding 4 — The tap-disabled-until-pinch-zoom trade-off is a motor-accessibility regression dressed as an accessibility floor
**Severity: high**
**Location:** `DESIGN.md` line 117 and `EXPERIENCE.md` line 92 (identical `[ASSUMPTION]`, carried verbatim between the two documents): *"Nodes that would render below this size at deep zoom-out become tap-disabled and require a pinch-zoom-in first..."*

The framing in both documents presents this as the accessibility-*safe* choice — preserving the 44px floor "rather than shrinking the tap target below the floor." That's true as far as it goes: a sub-44px tap target is bad for *everyone* with imprecise pointing (tremor, low dexterity, big fingers, gloves, etc.). But the proposed alternative trades one motor-accessibility problem for a different, arguably worse one:

**Pinch-to-zoom is itself one of the higher-precision gestures in the touch vocabulary** — it requires two simultaneous, coordinated contact points and a controlled scaling motion. For exactly the population this rule claims to protect (users with tremor, limited fine motor control, single-hand or single-finger operation, users of switch-access or other assistive input methods that can't produce a two-finger pinch at all), **gating "this control becomes operable" behind "first perform a harder gesture than tapping it"** is not a accessibility-neutral trade-off — it's substituting a problem the spec is worried about (small tap targets) with a problem it isn't discussing (a gesture many motor-impaired users cannot perform at all, turning "harder to tap precisely" into "literally impossible to reach without another input method"). A switch-access or single-switch-scanning user, in particular, has no pinch gesture available to them at all — this design would leave such a user with **zero path** to a Node that's currently rendered below the floor, full stop.

Neither document surfaces this tension; both carry the `[ASSUMPTION]` as a performance-engineering question ("confirm with engineering during the performance spike") rather than an accessibility one — which means the relevant reviewer (an accessibility-minded eye) may never see it before it ships, since it's framed as a perf trade-off to be resolved in a perf spike.

**Fix:** Reframe the open question to include the motor-accessibility angle explicitly, and add a **non-gestural alternative path** to the same destination — e.g., "tap-disabled Nodes remain reachable via Search (FR-8) or via a '+' / list-expansion affordance that doesn't require pinch," so pinch-zoom is *one* way in, not the *only* way in. (Search already exists as a chrome-level entry point per `EXPERIENCE.md` line 32 — extending it to also serve as the de facto answer to "how do I reach a Node I can't currently tap" would close this gap cheaply, and is consistent with how Search already resolves the "minister isn't in the default expansion depth" failure case in Flow 1, line 119.)

---

### Finding 5 — Motion spec lacks the numeric vestibular-safety thresholds a builder needs to judge whether the *default* (motion-on) experience is itself safe — not just what happens when it's turned off
**Severity: medium**
**Location:** `DESIGN.md` → Elevation & Depth, lines 122–132 (the `graph-traverse` / `time-rewind` definitions and the "Field" depth-of-field blur description); `EXPERIENCE.md` → Accessibility Floor line 93 and State Patterns line 75.

What *is* specified, and specified well: the `prefers-reduced-motion` collapse behavior is stated identically and consistently in three places (`DESIGN.md` line 132, `EXPERIENCE.md` lines 75 and 93) — "instant cuts... only the camera-movement feeling is removed, no information lost." That consistency is a real strength and exactly what a builder needs for the *opt-out* path. Both documents also correctly flag that the motion *names and easings* are proposals, not finalized specs (`DESIGN.md` line 128 `[ASSUMPTION]`).

What's missing is the **default-on** side of vestibular safety — the thing a `prefers-reduced-motion` toggle doesn't cover, because plenty of vestibular-disorder users don't have that OS setting enabled (awareness of the setting's existence is low; some platforms don't expose it prominently) and will simply experience the cinematic default. For that population, the relevant questions a spine should answer — and doesn't — are:
- **Duration**: how long does a `graph-traverse` pan/zoom/refocus or a `time-rewind` re-render run? (WCAG 2.3.3 / general vestibular guidance treats animations under ~5 seconds with parallax/zoom as higher-risk; "the camera moving through the graph" as described — DESIGN.md line 129 — is exactly the kind of zoom-and-translate motion that triggers symptoms in susceptible users even at modest durations.)
- **Intensity of the "Field" blur**: line 126 introduces "softly blurs" as a *permanent, always-on* depth-of-field treatment for the unfocused two-thirds of the canvas — this is not "camera movement" (so it's ambiguous whether `prefers-reduced-motion` even touches it per the current wording, which scopes the reduction to "`graph-traverse`/`time-rewind`... camera-movement animation" specifically) and a constant blur/defocus field is itself a documented vestibular and visual-strain trigger independent of whether anything is actively moving.
- **Parallax depth** between the Focused/Connected/Field layers (lines 124–126) — depth-of-field effects that create apparent relative motion between layers during a pan are a separate, well-documented vestibular trigger from the pan itself.

None of these get a number, a cap, or even a qualitative ceiling ("keep traverse durations under N ms," "Field blur should never exceed a light defocus — no heavy gaussian"). A builder optimizing for "cinematic" with no ceiling could easily land on something that's technically `prefers-reduced-motion`-compliant when toggled off, yet vestibular-unsafe by default for users who never find or set that toggle.

**Fix:** Add a short "Motion budget" sub-section (even 3–4 lines) to `DESIGN.md` → Elevation & Depth or to `EXPERIENCE.md` → Accessibility Floor stating concrete ceilings — e.g., "`graph-traverse` and `time-rewind` complete within [X]ms; Field-layer blur stays at a light defocus (no heavy gaussian/depth blur); no layer moves at a different apparent speed than ±[Y]% of the focal layer during a traverse." Numbers can be placeholders pending the performance spike (the same `[ASSUMPTION]` pattern already used elsewhere in this spine), but the *category* of constraint — duration ceiling, blur-intensity ceiling, parallax-delta ceiling — needs to exist as a named target, or it will not get budgeted at all. Also worth a one-line clarification of whether the "Field" blur is itself disabled/reduced under `prefers-reduced-motion` (current wording scopes the reduction narrowly to "camera-movement... animation," leaving the always-on blur's status ambiguous).

---

### Finding 6 — `time-marker-approximate` and `scrubber-track` placeholder values also fail 3:1 against the light canvas — same root cause as Finding 1, smaller blast radius
**Severity: low**
**Location:** `DESIGN.md` front-matter lines 40–41 (`time-marker-approximate: "{saffron.300}"` → `#fdba74`; `scrubber-track: "{navy.200}"` → `#bfdbfe`), checked against `canvas (#eff6ff)`.

- `time-marker-approximate (#fdba74)` vs `canvas (#eff6ff)` = **1.55:1** — far below 3:1. This is the glyph that signals "this date is uncertain" (FR-7's approximate-date convention) — under-contrast, it risks reading as simply absent on a light-mode screen, which is the opposite of the spec's stated intent ("a soft warm highlight... imprecision... is expected, not alarming" — line 101). If the glyph is invisible, the user doesn't get "gentle acknowledgment of imprecision," they get silent data loss.
- `scrubber-track (#bfdbfe)` vs `canvas (#eff6ff)` = **1.31:1**. The track is the persistent chrome for the entire Time Travel feature (the mechanism UJ-2's whole "climax" — EXPERIENCE.md line 126 — depends on); a barely-visible track makes the control harder to locate and target, compounding the motor-accessibility concerns in Finding 4.

These two are flagged at **low** rather than high/critical because (a) both pass comfortably against `canvas-dark` (11.98:1 and 14.22:1), and dark mode is the stated default register, softening real-world exposure; and (b) unlike `state-vacant`/`edge-base`/`party-tag-*`, neither of these is described as carrying its meaning *through color alone* — `time-marker-approximate` is explicitly paired with the "Date is approximate" text microcopy (EXPERIENCE.md line 71), and the scrubber track is a single persistent control, not a repeated categorical signal. So the contrast issue here is a **findability/polish** problem rather than an **information-loss** problem. Still worth fixing in the same pass as Finding 1, since the root cause (single hex value with no light-mode-appropriate pairing) and the fix shape are identical.

**Fix:** Same remedy as Finding 1 — add explicit light-register values for tokens that are presented as single hex values but used on a canvas that changes by mode (`{navy.50}` light / `{navy.900}` dark). A lower-lightness saffron (e.g., `saffron.500`/`#f97316`, ~2.6:1 — still short; something closer to `saffron.600`/`#ea580c` lands nearer 3.6:1) and a mid-tone navy (`navy.400`/`#60a5fa` lands ~2.0:1; a custom mid-slate would clear 3:1 more reliably) would need to be checked the same way before being finalized — the point isn't the specific replacement hue, it's that *any* token rendered directly on a mode-dependent canvas needs a mode-aware pairing, and right now four of these six "single value" tokens (`state-vacant`, `edge-base`, `time-marker-approximate`, `scrubber-track`) don't have one.

---

### Finding 7 — The Accessibility Floor is genuinely well-targeted on *what to test*, but several of its rules describe an end-state without the intermediate behavioral rule a builder needs to get there
**Severity: medium**
**Location:** `EXPERIENCE.md` → Accessibility Floor, lines 87–96 (the section as a whole).

Crediting what's right first: this section is *not* a generic platitude list — every one of its six bullets ties directly to a named risk in this specific product (state-badge text labels for color-blind users; 44px floor for a dense graph; reduced-motion for the cinematic core; truncation rules for dense graph labels; "color is never the only signal" bound explicitly back to `DESIGN.md`'s Do/Don't table; focus-return-to-opening-Node for sheet dismissal). That's real, specific work, and it's the right shape for a "demo-stakes" spine — better than what the worked example (`experience-example-mobile.md` → Accessibility Floor) does for its much simpler single-surface product, because it had to reach further to cover a harder UI.

Where it falls short of "buildable": two of the six rules describe a *goal* without the *mechanism*:
- Line 91 ("every Node, Edge, control labeled with role + state") — covered in depth by Finding 3; the gap is graph-level traversal, not node-level labeling.
- Line 96 ("Focus traversal in sheets and panels follows reading order; dismissing a sheet returns focus to the Node that opened it") — this is good and concrete *for sheets*, but the spine never states the parallel rule for the **graph canvas itself**: when a Node expands via `graph-traverse` and the profile sheet later dismisses, does focus return to the *Node's new (post-traverse) position*, its *pre-traverse position*, or somewhere else? Given that `graph-traverse` actively moves the focal point (that's its entire job — DESIGN.md line 129), "return focus to the Node that opened it" is ambiguous about *where* that Node now visually/logically sits. This is a smaller, more local version of the Finding 3 problem (motion changes the spatial frame; the spec doesn't yet say what a non-visual user's frame of reference is after that change).

**Fix:** Extend line 96's rule one clause further — state explicitly that focus return targets the Node's *current* (post-navigation) position/state, not a cached pre-navigation reference, so a screen-reader or keyboard user's mental model stays synced with what `graph-traverse` just did. This is a one-sentence addition that closes a real ambiguity.

---

## Summary table

| # | Finding | Severity | Risk area |
|---|---|---|---|
| 1 | `state-vacant` / `edge-base` fail 3:1 contrast vs light canvas | High | Color-as-channel |
| 2 | 5/6 `party-tag-*` fail contrast; chip fill-vs-accent ambiguity compounds it | High | Color-as-channel |
| 3 | No screen-reader path *through* the graph — only single-Node labeling specified | Critical | Graph navigation |
| 4 | Tap-disabled-until-pinch-zoom is a motor-accessibility regression, framed only as a perf trade-off | High | Tap targets / motor |
| 5 | No vestibular-safety numeric thresholds for default (motion-on) `graph-traverse`/`time-rewind`/Field-blur | Medium | Motion |
| 6 | `time-marker-approximate` / `scrubber-track` also fail 3:1 vs light canvas (lower blast radius) | Low | Color-as-channel |
| 7 | Accessibility Floor names the right risks but two rules stop at goal-statement, not mechanism | Medium | Graph navigation / general |

**Counts:** 1 critical · 3 high · 2 medium · 1 low
