# Deeper — Design Direction + Value-Based Blog

*Source: Jarvis decision brain (model `acp:claude-opus-4.8`, high-effort reasoning,
verified real output — not a stub). Companion to `LANDING-PAGE-PLAN.md`.*

---

## Design verdict

The visual direction is largely **right** — the cinematic "surface → deeper → deployed
→ owned" scroll, the motion discipline, and the accessibility are real assets. **Keep them.**
The fatal flaw is not aesthetic, it's **credibility**: the page wins trust with fabricated
proof, which undermines a studio whose whole pitch is "measured honestly." Fix the proof
first, then the craft is finally backing a true claim.

## Art direction

**Quiet engineering confidence** — an instrument panel that happens to be beautiful, not a
SaaS billboard. Depth and precision: deep-water darkness, a single measured teal "signal,"
hairline grids like a sonar readout, and one warm amber reserved for the human and "the
number." Restraint is the brand: negative space, slow deliberate motion, every figure
aligned and tabular, nothing glossy or salesy.

## Typography

- **Display:** Geist Sans (600/700/800) for headings + hero. Free, variable, senior feel.
- **Body / UI / labels / figures:** Inter (variable), `tabular-nums` enabled globally.
- **Scale:** modular major-third (1.250) on an 8px base — 13 / 14 / 16(body) / 20 / 25 /
  31 / 39 / 49 / 61px. Line-height 1.6 body, 1.1 display. Reading measure max 680px.
- **Numerals:** `font-variant-numeric: tabular-nums lining-nums` on every price, percent,
  metric, counter, reading-time, date. Never proportional, never mono.
- **Rules:**
  - Sans by default. Mono (Geist Mono) **only** for code, config, IDs/hashes — never for
    prices, percentages, counters, labels, or headings.
  - Hierarchy from size + weight + tracking + opacity — never by switching font family.
  - Eyebrows/micro-labels: Inter 13px, UPPERCASE, +0.10em tracking, opacity 0.6.
  - Display headings: Geist 700–800, tracking −0.02 to −0.03em, never centered for long lines.
  - Secondary text `rgba(232,238,245,.70)`, tertiary `.50` — earn hierarchy from opacity.
  - **"The number"** (pilot result): Inter heavy + tabular-nums at display size, amber,
    with a sans unit label. Never mono.

## Color & texture

Mode: **dark** primary for the landing/cinematic experience; a **light reading mode** toggle
for the blog (both AA-compliant).

| Name | Hex | Use |
|---|---|---|
| Abyss | `#07090D` | primary background (deep water) |
| Surface | `#10151D` | raised panels, margin notes, scorecard |
| Hairline | `#1C2530` | borders, grid lines, dividers (instrument texture) |
| Text-High | `#E8EEF5` | headings + primary copy (~17:1 on Abyss) |
| Text-Muted | `#AEB9C6` | secondary copy, captions (~9:1 on Abyss) |
| Signal-Teal | `#2DD4BF` | the "measured" accent — lines, sonar glow, active state, big numerals |
| Focus-Teal | `#5EEAD4` | visible focus ring only (high contrast) |
| Human-Amber | `#F4B860` | reserved for "the number" + human warmth — used <1% of surface |
| Light-BG | `#F7F8FA` | blog reading-mode background |
| Light-Text | `#14181F` | blog reading-mode body text |
| Teal-Ink | `#0E8C7A` | teal accent on light mode (AA small-text safe) |

**Texture:** faint film grain (1–2% noise) over a single radial depth-gradient in the hero
(Signal-Teal glow fading into Abyss, like sonar). Low-opacity hairline grid reads as an
instrument readout. **No** drop-shadow card stacks, **no** glassmorphism, **no** gloss —
depth comes from value and gradient, not bevels.

## Layout pattern — main-rail + floating margin notes (editorial spine)

A single narrative column carries the argument top-to-bottom (surface → deeper → deployed →
owned → offer → proof). Small "instrument readouts" — honest metrics, method notes, the
guarantee, a scorecard — float in the **right margin** beside the paragraph they qualify.

Why this over a symmetric bento: the sale is a **linear argument** that must be read in order
and continuously backed by evidence. A bento scatters attention and flattens the surface→deep
narrative. The spine owns ~65% of attention; margins are deliberately narrower and lighter.

## Section-by-section design

1. **Hero — Surface to Deeper.** Full-bleed stage, left-weighted display headline
   *"AI that does real work — proven in weeks, measured in a number."* + sub + one CTA
   *"Book a 2-week pilot"*, sonar depth-gradient behind. Keep the cinematic dive; static
   layered poster under reduced-motion. **No fake logos** — one honest credibility line:
   *"A small senior team. Three pilots so far. We publish how we measure."*

2. **The Method — how a pilot works.** Vertical spine, 4 numbered steps as the rail:
   pick your biggest time-sink → short paid pilot → measure honestly → hand it off (you own
   it). Each step has a right-margin note (duration, who does what, what you get). 1px teal
   connector draws downward on scroll. Margin chips: *"Pilot length: 2–4 weeks"*, *"Price:
   fixed, quoted up front"*, *"Output: a scorecard + working system."*

3. **The Offer + Guarantee (NEW — #1 fix).** A single bordered **scorecard** panel (not a
   pricing grid): pilot scope, fixed price band, timeline, plain guarantee. Honest line:
   *"We agree the number before we start. If we don't move it, you don't pay the final
   invoice — and you keep the code."* The early-stage status is **why** the guarantee exists.

4. **Honest Proof (NEW — replaces fakes).** A real anonymized pilot **scorecard** component
   (before → after → method → caveat) + right-margin link to an open-source scorecard
   template. Example: *"A logistics back-office: invoice triage 11 min → 90 sec per doc,
   sampled over 400 invoices, human-checked. Here's exactly how we measured it."* A
   methodology link, **not** a testimonial. Numbers count up once (freeze under reduced-motion).

5. **What we automate.** Editorial list (not equal cards): support replies, invoice &
   document processing, data entry, data → insight. Each = one-line description + "what the
   number usually is" on the right. Each row links to a matching Field Note teardown.

6. **Your fears, answered.** Spine Q&A on the four real objections: *Will the pilot reach
   production? Are we locked in? Is our data safe? Will we stay dependent on you?* Short,
   honest, no marketing voice. *"No lock-in: it runs on your infra, your repo, your accounts.
   You can fire us and keep everything."*

7. **Who we are (honest).** Short paragraph + **verifiable links** (GitHub, talks, shipped
   work). One real photo or none — never a stock/AI face. *"One senior team. Links you can check."*

8. **Field Notes teaser.** A 3-item rail of latest posts with reading-time (tabular-nums),
   pillar tag, dek — distinct widths, editorial not bento. Routes to the blog.

9. **Final CTA — Book a pilot.** Restated one-liner + single primary button + one-sentence
   "what happens next" so it isn't a black box. *"Tell us your biggest time-sink. We'll reply
   with the number we'd aim to move and a fixed quote."*

## Proof design (trade fabricated trust for verifiable trust)

1. Replace logos with a **method receipt**: an anonymized but REAL pilot scorecard — before,
   after, sample size, who verified, stated caveat. (Honesty about sample size reads as more
   credible than a big round number.)
2. **Open-source the scorecard template** and link it — showing the measurement method *is*
   the proof.
3. Replace testimonials with a **"what could go wrong" honesty block** — naming failure modes
   disarms skepticism better than praise.
4. Founder credibility = **clickable links** (GitHub, talks, repos). Never invented bios or
   AI headshots.
5. Be explicit you're early ("three pilots so far") and frame the **guarantee** as why that's
   safe for the buyer.
6. Use anonymized sector labels ("a logistics back-office") with permission, not fake brands.
7. Every number on the page must trace to a method you'd publish.

---

## Value-based blog — "Field Notes"

**Purpose.** A senior studio earns work by visibly thinking in public. "Field Notes" proves
**competence** and **honesty** — the two things buyers fear they won't get — without a single
invented claim. It is the proof engine the fake testimonials were pretending to be.

**Value strategy.** Every post is useful even to a reader who never hires Deeper: a real
workflow teardown, a measurement method they can copy, or an honest pilot retro (including one
that failed). Give away the "how we measure," not "AI is transformative" filler. Usefulness is
the trust mechanism.

**Information architecture.** Nav item **"Field Notes"** alongside Method / Offer / Pilot.
Index is an editorial list grouped by pillar (not a card wall). Each automation row on the
landing page deep-links to its matching teardown; each post links back to Method + Offer. Tags
map 1:1 to pillars. A shared "pilot offer" module is appended to every post.

**Post template design.** Reading mode (light `#F7F8FA` or dark toggle), single 680px measure.
Geist H1 + Inter dek + reading-time/date in tabular-nums. Right margin holds "method notes" as
small instrument callouts. Code/config/IDs in Geist Mono; everything else sans. A reusable
**"The number"** pull-stat component (Inter heavy + tabular-nums, amber). Author block with
verifiable links only. Footer = the standard honest pilot CTA. Diagrams only — no stock hero
images.

**Content pillars.**
1. Pilot method & honest measurement
2. Automating the boring (support, invoices, documents, data entry)
3. Honest AI (limits, failure modes, what not to automate)
4. Own it / no lock-in (handoff, knowledge transfer, architecture)
5. Security & your data on your infra

**First 10 posts.**
1. What a two-week AI pilot actually looks like, day by day
2. The one number: how we pick the metric that decides a pilot
3. Automating support replies without sounding like a robot
4. Invoices, line by line: where AI helps and where it shouldn't
5. How to hand off an AI system so your team actually owns it
6. No lock-in, on purpose: the architecture that lets you fire us
7. Where document AI quietly fails — and how we catch it
8. A pilot that didn't work, and what the number told us
9. Data entry is a measurement problem before it's an AI problem
10. Your data, your servers: the security checklist we run first

**Cadence & distribution.** One substantial post **every two weeks** (quality over volume).
Distribute by hand: a short LinkedIn post with the one insight + link, a plain-text email to a
small list, and one thread repurposing the method section. No content treadmill — each post is
evergreen proof.

**Conversion.** End every post with the same honest module, never a hard sell: *"Recognize
this time-sink? In a 2-week pilot we'd aim to move [the number] — and here's the exact
scorecard we'd use,"* linking to the Offer. The post already showed the skill, so the CTA is an
invitation to apply it, not a pitch.

---

## Accessibility

- WCAG 2.2 AA: Text-High on Abyss ≈ 17:1; Text-Muted ≈ 9:1; restrict Signal-Teal to large/
  graphic use or verify small-text contrast.
- Respect `prefers-reduced-motion`: cinematic dive + count-ups collapse to static posters /
  final values.
- Visible focus ring (Focus-Teal `#5EEAD4`, 2px offset) on every interactive element — never
  remove the outline.
- Semantic landmarks; one H1 per page; logical heading order.
- Never rely on color alone for "the number" or status — pair with label + unit.
- Accordions/toggles fully keyboard operable; Escape closes; focus restored.
- Blog reading mode AA in both light and dark; tabular-nums keep figures aligned.
- All imagery has alt text; no AI/stock human faces presented as real people.

## Build order

1. **Delete all fabricated proof** (logos, testimonials, founder bios/photos, invented round
   stats) — leave honest placeholders.
2. Build the **Offer + Guarantee** scorecard panel (fixed scope, price band, timeline,
   "agree the number first" guarantee).
3. Build **Honest Proof** + reusable anonymized scorecard component (before → after → sample
   size → method → caveat); publish the open-source scorecard template.
4. **Token pass:** load Geist Sans / Inter / Geist Mono, global tabular-nums, dark palette as
   CSS variables, grain + sonar gradient.
5. Refactor the page into the **main-rail + floating margin-notes spine**; keep the hero.
6. Add **"Your fears, answered"** + the honest **About** (verifiable links only).
7. Build **Field Notes**: index (editorial list by pillar) + single-post template with reading
   mode, method-margin notes, shared pilot CTA.
8. Write + publish the first **3 posts** (pilot day-by-day, the one number, an honest
   failed-pilot retro).
9. Accessibility + reduced-motion QA: contrast audit, keyboard pass, focus rings, fallbacks.
10. Run Lighthouse + axe; fix to AA; ship.
