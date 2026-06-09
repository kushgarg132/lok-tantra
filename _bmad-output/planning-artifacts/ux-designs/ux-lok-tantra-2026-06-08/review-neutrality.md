# Adversarial Review — Power Explorer UX Spine Pair (DESIGN.md / EXPERIENCE.md) — Political Neutrality

## Overall verdict

The spine pair clearly *read* the PRD's hardened §5 and made a genuine effort to operationalize all four rules — the shape grammar (circle=Person/square=Office), the "identical accountability-block template," and the Do's/Don'ts table are real, citable design decisions, not just restated intentions. But under adversarial pressure, three of the four rules have a gap between *assertion* and *enforced mechanism*: the party-tag palette's actual hex values contradict the very claim made about them ("none overlaps saffron" — one of the six **is** a desaturated saffron), the cinematic depth-of-field language leaves the single highest-risk moment (what the camera focuses on *during a Time Travel rewind*) completely unconstrained, and the "context travels with content" rule is wired to the Accountability block and citation panel but never to the actual surface UJ-1's climax says gets screenshotted (the expanded Node / graph view itself). None of these are deliberate evasions — they read as exactly the kind of gap that survives a well-meaning first pass and then becomes a live incident the moment a critic screenshots the "wrong" frame.

**Findings: 1 critical, 3 high, 3 medium, 1 low**

---

## Findings

### 1. [CRITICAL] `party-tag-2` is, in measured hue, a desaturated saffron — directly contradicting DESIGN.md's own claim that the palette avoids exactly this collision

**Location:** `DESIGN.md` front-matter, `colors:` block, lines 34-39 (`party-tag-1` through `party-tag-6` hex values), and the prose claim at line 93: *"None overlaps the app's own semantic colors — saffron is reserved for the Person register (and is also a real party's brand color, which makes the collision risk doubly worth naming `[ASSUMPTION]`)..."*

**The check:** Converting the six placeholder hex values to HSL and comparing against the platform's own `saffron.500` (`#f97316`, used for `node-person` — hue ≈ 25°):

| Token | Hex | Hue | Sat | Light |
|---|---|---|---|---|
| `party-tag-1` | `#8B95A6` | 218° (slate-blue) | 13% | 60% |
| `party-tag-2` | `#A8856B` | **26°** (warm brown/terracotta) | 26% | 54% |
| `party-tag-3` | `#7FA08C` | 144° (sage green) | 15% | 56% |
| `party-tag-4` | `#9B85A6` | 280° (mauve) | 16% | 59% |
| `party-tag-5` | `#6B95A8` | 199° (steel blue) | 26% | 54% |
| `party-tag-6` | `#A69B6B` | 49° (olive/khaki) | 25% | 54% |
| *(reference)* `saffron.500` | `#f97316` | **25°** | 95% | 53% |
| *(reference)* `chakra.500` | `#046a38` | 151° (institution green) | 93% | 22% |

`party-tag-2` sits at hue 26° — within one degree of `saffron.500`'s hue 25°, and within the BJP-brand-orange family. It is *not* a different hue rendered subtly; it is the *same* hue at lower saturation/higher lightness — i.e., literally "saffron, muted." The document asserts the team was alert to exactly this collision risk (it even names saffron as "also a real party's brand color") and then specified a value that *is* that collision, just desaturated enough that a quick glance doesn't catch it. A party-affiliation researcher (the exact persona who would scrutinize this palette before sign-off) comparing swatches side-by-side would find this in under a minute, and the platform's own stated rationale ("we were careful about this exact thing") would make the miss look worse, not better — it reads as "they knew the risk and still produced the collision."

Two secondary collisions worth noting in the same pass: `party-tag-3` (hue 144°, sage green) sits only 7° from `chakra.500` (hue 151°, the Institution/citation register and also the exact hue family of India's national-flag green/Islamic-green political coding); and `party-tag-1`/`party-tag-5` are both blue (hues 218°/199°, ~19° apart) — close enough that in a coalition view with both tags present, they could read as "the same family" rather than as visually distinct categories, undermining the palette's basic job of *distinguishing* parties.

**Fix:** Before sign-off (which the `[ASSUMPTION]` flag already correctly demands), run the actual hex values — not just the design *intent* — through a hue-distance check against (a) `saffron`, `navy`, `chakra` at the shades actually used on-canvas, and (b) the real brand hues of India's major national and large regional parties (saffron/orange = BJP; multiple greens = INC's hand-symbol-adjacent uses, AIMIM, Akali Dal, JD(S) accents, Muslim League; blue = BSP, multiple Dalit-politics-coded parties; red = CPI/CPI(M)/RJD; tricolor combinations = several). `party-tag-2` and `party-tag-3` in particular need to move to genuinely distinct hues (e.g., toward violet/magenta/teal territory that has no major-party association) — not just lower saturation of the same problematic hue.

---

### 2. [HIGH] The cinematic "Focused / Connected / Field" depth-of-field model has no rule for *what determines the focal point during `time-rewind`* — leaving the single most editorially-loaded camera decision in the entire feature unconstrained

**Location:** `DESIGN.md` → "Elevation & Depth," lines 122-130 (the `Focused`/`Connected`/`Field` definitions and the `time-rewind` description); cross-referenced against `EXPERIENCE.md` Flow 2 (lines 121-129) and the cold-open state (`EXPERIENCE.md` line 68: *"Loads centered on the PM's **Office** at today's date"*).

**The gap:** The depth-of-field grammar is precisely specified for the *expansion* case — "the Node currently expanded/selected renders at full opacity, full scale, sharp" (line 124) — and that case is correctly anchored to user action (the user tapped something, so of course it's the focal point; no editorial judgment required). But `time-rewind` (line 130) is described only as *"Nodes that exist at the new date settle into place, Nodes that don't fade to the ghost treatment"* — it never says **what stays in "Focused" register while the scrub plays**, or whether anything does. Three readings are all consistent with the current text:
- (a) The camera stays anchored on the **Office** that was focused before the scrub began (e.g., stays on "Prime Minister" while *who* sits in that seat changes underneath) — this is the only reading that's actually neutral, and it's also the reading that makes "Office, not officeholder" (which DESIGN.md itself praises at line 88 as "the PRD's framing made visible") *survive* Time Travel rather than evaporate the moment the scrubber moves.
- (b) The camera *follows the occupant* — i.e., as history rewinds through a sequence of PMs, the "Focused/sharp/full-scale" treatment migrates from face to face, because the system is designed to keep "the interesting thing" sharp. This would mean the single most visually weighted element on screen, at every point in a 75-year scrub, is *a specific named historical individual* — chosen by the system, not the user. That is the textbook definition of "editorial curation by... current events" the PRD's first §5 rule explicitly bans (§5: *"Visual treatment of any Node... is determined structurally or chronologically... and never editorially curated"*).
- (c) Nothing stays "Focused" during the rewind itself (depth-of-field flattens to a neutral mid-state until the scrub settles) — plausible, but also unstated, and would be a meaningfully different (and more defensible) design than (a) or (b).

Flow 2's narration doesn't resolve this either — it describes *what Priya sees change* ("different faces... a few Offices ghost") but never says *where the camera/focus is anchored* while she scrubs to 1977 and 1947 — two of modern India's most politically contested years (the Emergency; the immediate post-Independence settlement). If engineering implements (b) by default — which is the *more naturally cinematic* choice, and this spine explicitly asks for "cinematic" — the platform would, by design, render a sequence of named historical figures in sharp, full-scale, foregrounded focus while the structure around them blurs, during a feature literally named "Time Travel" whose entire differentiator (SM-3) is how often people use it. That is an editorial act dressed as a camera effect, and it is exactly the seam a critic primed to find bias would look for first — "watch whose face the app chooses to make sharp as it rewinds through the Emergency."

**Fix:** Add an explicit rule to `DESIGN.md` → Elevation & Depth (and mirror it in `EXPERIENCE.md`'s `time-rewind` row): *"During `time-rewind`, the Focused anchor remains the Office (or graph position) the user was viewing before the scrub began — never the occupant. As Tenures change underneath a focused Office, the new occupant's Node enters at the same Connected/Field depth as any other newly-revealed Node and only becomes Focused if the user explicitly taps it. The camera follows structure, not faces, through history."* This single sentence closes reading (b) entirely, keeps (a) — the only neutral option — as the locked default, and gives engineering an unambiguous, testable spec instead of an aesthetic vibe to interpret under deadline pressure.

---

### 3. [HIGH] "Context travels with the content" is specified as a component property of the Accountability block and citation panel — but never wired to the actual surface UJ-1's climax says gets screenshotted (the expanded Node / graph view)

**Location:** `EXPERIENCE.md` Flow 1, lines 115-117 (the climax beat) vs. `DESIGN.md` `components:` front-matter (lines 60-68) and Components table (lines 146-155).

**The trace:** Re-read Flow 1's climax precisely. By step 5, Aman has *already tapped the citation and the panel has opened and (implicitly, since step 6 says "his place in the graph doesn't move" and the climax is framed as a fresh beat) been dismissed*. The climax — the thing he actually screenshots — is described as **"the graph"**: the expanded Node showing "her photo, party tag, constituency, a traced line from state legislator to Union Minister, and a 'reports to' edge... carrying a Constitutional Citation." The very next sentence then claims: *"Because `DESIGN.md`'s 'context travels with the content' rule keeps attribution, the date, and the citation rendered inline, the screenshot explains itself even stripped of the app around it."*

But check what `DESIGN.md` actually specifies as carrying "attribution + date" as a rendered element:
- `accountability-block` — **has** a specified "source + last-updated footer" (line 67, 154). Not what Aman is screenshotting in this beat (he hasn't opened Accountability Data — that's FR-5/Flow elsewhere).
- `citation-panel` — **has** a specified Article reference + explainer (line 65, 152). Already dismissed by the time of the climax screenshot per the flow's own sequencing.
- `time-travel-scrubber` — **has** a date readout (line 66, 153), but it's specified as living in *"persistent chrome at the graph's edge"* (`EXPERIENCE.md` line 31) / *"a thin persistent strip at the screen's bottom or side edge"* (`EXPERIENCE.md` line 102) — i.e., physically separated from the expanded Node a user would naturally crop tight around when screenshotting "her" specifically.
- The expanded **Node card / profile-sheet header** itself (what's actually in-frame at the climax) — **has no specified "source: X, as of [date]" element anywhere in the `components` block or Components table.** `node-card-person`'s spec (line 61, 148) lists "circular avatar + name + party-tag chip + Office label" — no attribution field.

So the Do's/Don'ts assertion at `DESIGN.md` line 165 ("Keep source attribution, the selected Time Travel date, and citations rendered inline and visible on every shareable view") is a *correct restatement of the PRD rule* — but it is asserted as a cross-cutting principle, not instantiated as a field on the one component (`node-card-person` / profile-sheet header) that the spine's own flagship user journey says is the thing that gets cropped and shared. This is precisely the "asserted generally, not wired to the specific screenshotted surface" gap the PRD review (line 14, "high" finding on SM-2) warned would recur if not made concrete — and it has recurred, one layer down, in the UX spec that was supposed to make it concrete.

**Fix:** Add a field to `node-card-person` / `node-card-office`'s spec (and the profile-sheet header more generally): a small, persistent, `{typography.data}`-set line — e.g., "Power Graph · [selected date] · Source: [primary data source for this view]" — that renders *inside the expanded-Node card's own visual frame*, not in separate chrome at the canvas edge, so that a tight crop around "her" in Flow 1's climax physically cannot exclude it. Then update Flow 1 step 6's claim to cite *that* element specifically, rather than gesturing at "the rule" in the abstract — which would also make the claim auditable (a reviewer could literally screenshot the same frame Aman does and check whether the assertion holds).

---

### 4. [HIGH] Six party-tag colors is very likely insufficient for the MVP's own named scope, and the spec gives no rule for what happens at color #7

**Location:** `DESIGN.md` front-matter `colors:` (lines 34-39, six tokens only) and prose at line 91 (*"a muted, equal-weight categorical palette"*); cross-referenced against PRD §8.1's MVP scope (*"National/central-layer Power Graph (President, PM, Union Cabinet & Ministers, central institutions, judiciary apex)"*) and §4.4/FR-7 (Time Travel spans 1947–present, i.e., dozens of governments).

**The check:** "Bounded scope" (national layer only, no MPs/MLAs/state governments) does narrow the *number of Person Nodes* on screen, but it does *not* bound the *number of distinct parties* a national-layer Council of Ministers can contain — and Indian coalition governments are large by international standards. The NDA-II/III Union Council of Ministers alone has drawn from more than a dozen constituent parties at once (TDP, JD(U), Shiv Sena factions, LJP factions, RLD, JD(S), Apna Dal, AGP, and others, beyond BJP itself); UPA-era ministries similarly drew from a dozen-plus allies. A *single* "today" view of the Union Cabinet + Ministers, rendered with each Person's party tag, can plausibly need ten-to-fifteen distinct tags simultaneously — roughly double to triple the six the palette provides — well before Time Travel ever moves and *before* any cross-era "reports to" edges bring predecessor-government parties into the same frame.

The spec doesn't merely under-provision; it gives **no fallback rule** for what the sixth-plus party gets. The two most likely *de facto* outcomes if engineering has to invent one under deadline pressure are both worse than the problem the palette was built to solve: (a) reuse — two or more real, rival parties end up wearing visually identical tags, which reads as "the platform can't be bothered to tell us apart" at best and "the platform is grouping rivals together" at worst (the exact "color creates groupings the structure doesn't impose" risk the prior PRD review flagged at its "high" finding on party color); or (b) a generic "Other" bucket — which is its own neutrality problem, since *which* parties get folded into "Other" becomes an editorial sorting decision dressed as a technical limitation.

**Fix:** Either (a) expand the palette to a number derived from an actual count — e.g., audit the largest *single* national-layer view the MVP will render (a specific Council of Ministers at a specific date) plus the realistic worst-case overlap a "reports to" edge can create across two adjacent governments, and provision for that number plus headroom, not a round number chosen for aesthetic balance; or (b) if six is kept as a deliberate "small, equal-weight set" design choice, specify an explicit, neutral, non-editorial assignment + overflow rule up front — e.g., "tags are assigned in a fixed, publishable, party-agnostic order (such as alphabetical-by-official-registered-name) and parties beyond the sixth slot in any single view share a clearly-labeled 'and N more parties — see full list' affordance that names them in text rather than forcing a color collision." Either way, this needs to be resolved *before* the `[ASSUMPTION]` sign-off the document already correctly flags — "how many colors" and "which hues" are the same sign-off conversation, and the spec currently only frames the second.

---

### 5. [MEDIUM] Flow 1's narration phrase "a traced line from state legislator to Union Minister" frames the career path as a directional journey ("from X to Y") in the very same beat that's supposed to demonstrate FR-3's "facts, not narrative" rule in action

**Location:** `EXPERIENCE.md` Flow 1, step 4, line 115.

**The tension:** FR-3's locked consequence (PRD §4.2, quoted in `EXPERIENCE.md`'s own glossary-binding preamble at line 12 as authoritative) states the career path must show *"only Office, dates, and... the factual mechanism of transition... never narrative framing... A career path is a sequence of facts, not a story arc."* `EXPERIENCE.md`'s own Voice & Tone table (lines 40-48) correctly operationalizes this for *microcopy* — banning "rise/fall/reshuffle" framing explicitly. But the climax narration that's supposed to *demonstrate* this rule in action describes what Aman sees as **"a traced line from state legislator to Union Minister"** — a phrase whose entire shape is "started here, ended up there," which is the linguistic skeleton of a rise narrative, even though no value-laden verb ("rose," "climbed") is used. It's the same shape FR-3 itself worries about one level up: a sequence of neutral-sounding facts, arranged so the reader supplies the "story" the platform officially declines to write.

This is *narration about the design*, not literal in-product copy — so its severity is bounded (it won't itself ship to users). But it matters because this is the sentence a designer or engineer will reach for as the canonical mental model of "what the career-path feature looks like working correctly," and "from junior office to senior office" is precisely the framing FR-3's rule was written to prevent the *feature* from implying. If this phrasing is internalized as the reference description, it could quietly steer the actual visual treatment (e.g., emphasizing directionality, using an arrow/arc that visually reads as "ascent," sequencing steps top-to-bottom in a way that reads as a ladder) toward exactly the "visual emphasis that implies... merit" the prior PRD review's "high" finding (line 10) named as the more seductive vector — seductive precisely *because* it would be presented as neutral structure.

**Fix:** Reword the climax beat to mirror FR-3's own factual-sequence framing — e.g., *"...a chronological list of her prior Tenures — Office, dates, and how each transition occurred (elected / appointed / succeeded) — leading to her current position, and a 'reports to' edge to the PM..."* This describes the same UI element without supplying the directional "from X to Y, look how far she's come" shape, and keeps the spine's own illustrative language consistent with the rule it's citing.

---

### 6. [MEDIUM] The "equal lightness/saturation so no party tag dominates" design intent is contradicted by the actual values: three of the six tags are roughly double the saturation of the other three

**Location:** `DESIGN.md` line 92 (*"All six sit at roughly the same lightness/saturation so that no party tag visually dominates another at a glance"*) vs. the measured values in Finding 1's table.

**The check:** Lightness is genuinely tight (53-60% across all six — that part of the claim holds). Saturation is not: `party-tag-2`, `party-tag-5`, and `party-tag-6` measure ~25-26% saturation, while `party-tag-1`, `party-tag-3`, and `party-tag-4` measure ~13-16% — roughly half. In practice this means three of the six chips will read as visibly more "present"/vivid/saturated than the other three when placed side by side (e.g., in a coalition cabinet view with several tags on screen at once) — a small but real perceptual hierarchy the palette's stated design goal explicitly says shouldn't exist. It's not large enough to look "designed," which is exactly what makes it risky: it will look like an *accident* that happens to make specific parties' tags consistently more vivid than others — and "the platform's own data shows party X's tag is measurably more saturated than party Y's, look, here are the numbers" is a complaint that writes itself for anyone who runs the same check this review just ran.

**Fix:** When the palette is revised per Finding 1 (which it must be, regardless), normalize saturation as tightly as lightness already is — target all six within a ~3-5 percentage-point saturation band, not just a similar-looking one. This is a mechanical fix once the hue problem is solved, but it needs to be a stated acceptance criterion for whoever signs off on the final values, not just an aspiration in the surrounding prose.

---

### 7. [MEDIUM] "Comparative symmetry" is asserted as a template property but has no specified *enforcement or audit mechanism* — it remains a promise about what designers will remember to do consistently across every Person profile, not a system-level guarantee

**Location:** `EXPERIENCE.md` line 62 (*"Always rendered... in the same position and depth for every Person"*) and line 72 (*"same template position as populated data, never silently dropped"*); `DESIGN.md` line 67/154 (*"identical template for every Person... the template is the neutrality enforcement"*).

**The gap:** Both documents correctly *name* the rule and correctly bind it to FR-5/§5. But "the template is the neutrality enforcement" is true only if the template is the *only* path to rendering an Accountability block — i.e., if there is no code path, CMS field, or content-author affordance that can produce a Person profile *without* going through that shared component. Nothing in either document states this as an implementation constraint (e.g., "Accountability Data has no per-Person custom-rendering path; the component cannot be parameterized to add, remove, resize, or reorder fields per profile — only to populate or leave-empty the fixed fields it always renders"). Without that explicit "no escape hatch" framing, "identical template" is a *description of the common case*, not a *guarantee* — and the entire mechanism the PRD's §5 rule #3 leans on ("symmetry of treatment is what closes the gap [sourcing alone leaves]") depends on it being the latter. This is the same shape of gap the prior PRD review's "critical" finding (line 8) identified one layer up — the PRD didn't say symmetry was enforced by template *until* it was hardened to say so; this spine now says the right words, but doesn't yet say the words that would make the promise checkable by QA ("does this component have a path to render asymmetrically? No — verify by code review that X").

**Fix:** Add one sentence to the `accountability-block` (and ideally `node-card-person`/`node-card-office`) component spec: *"This component takes only data as input — Person/Office identity and the values to populate fixed fields. It has no props, flags, or content-authoring path that can change which fields render, their order, their size, or their position on a per-Person or per-Office basis. Any future field addition changes the template for everyone simultaneously, not selectively."* That single architectural constraint converts "we built it consistently" (a claim that erodes over a hundred future edits) into "it is structurally impossible to build it inconsistently" (a claim that survives them) — which is the actual bar §5 rule #3 sets ("enforced by template, not judgment call").

---

### 8. [LOW] The `[time-marker-approximate]` treatment uses a "soft warm highlight" (saffron.300) — placing the platform's *imprecision* signal in the same hue family as both its own Person register and a major party's brand color, compounding Finding 1's collision risk in a different surface

**Location:** `DESIGN.md` line 40 (`time-marker-approximate: "{saffron.300}"`) and line 101 (*"a soft warm highlight rather than a warning color, because imprecision in 75-year-old records is expected, not alarming"*).

**The check:** The reasoning for *why* a warm tone was chosen (don't make imprecision look alarming) is sound — but `saffron.300` (`#fdba74`, hue ≈ 31°) sits in the same narrow hue band as `saffron.500` (the Person register, hue 25°) and the real-world saffron/orange political association the document itself names as a live risk at line 93. This token will appear specifically clustered around *historical* dates and figures — i.e., precisely the Time Travel surface where the platform is most exposed to "which era/figures does the platform's own color choices seem to warm up to" scrutiny. It's a small, low-likelihood risk on its own (it's a glyph, not a fill, and the reasoning for warmth-over-alarm is genuinely good UX) — but it adds one more saffron-family token to a palette that, per Finding 1, already has more saffron-adjacency than it should, and during exactly the feature (Time Travel) where a critic is most likely to be looking for "does the platform's palette warm up to certain history."

**Fix:** Keep the "warm, not alarming" intent (it's correct), but shift the actual hue away from the saffron family — e.g., a warm neutral (amber-grey, warm sand) that reads as "gentle/expected" without sitting in the same hue band as the Person register and a major party's brand identity. This is a one-token swap, not a redesign, and is cheap to fold into the same sign-off pass Finding 1 already requires.

---

## Summary table

| # | Finding | Severity | Locus |
|---|---|---|---|
| 1 | `party-tag-2` hue (26°) ≈ `saffron.500` hue (25°) — palette collides with its own stated avoidance claim | **Critical** | `DESIGN.md` colors front-matter, lines 34-39, 93 |
| 2 | No rule for what the camera "Focuses" on during `time-rewind` — could editorially spotlight historical figures | **High** | `DESIGN.md` lines 122-130; `EXPERIENCE.md` lines 121-129 |
| 3 | "Context travels with content" not wired to the actual screenshotted surface (expanded Node/profile header) | **High** | `EXPERIENCE.md` lines 115-117; `DESIGN.md` components, lines 60-68, 146-155 |
| 4 | Six party-tag colors likely insufficient for national-layer coalition scope; no overflow rule | **High** | `DESIGN.md` lines 34-39, 91; PRD §8.1 |
| 5 | "Traced line from state legislator to Union Minister" narration shapes a directional/rise framing in the very beat meant to demo "facts not narrative" | **Medium** | `EXPERIENCE.md` line 115 |
| 6 | Saturation varies ~2x across the six party tags despite the "equal weight" design claim | **Medium** | `DESIGN.md` line 92 vs. measured values |
| 7 | "Identical template" comparative-symmetry rule has no stated "no escape hatch" enforcement mechanism | **Medium** | `EXPERIENCE.md` lines 62, 72; `DESIGN.md` lines 67, 154 |
| 8 | `time-marker-approximate` uses a saffron-family hue, compounding the Finding-1 collision risk on the Time Travel surface specifically | **Low** | `DESIGN.md` lines 40, 101 |
