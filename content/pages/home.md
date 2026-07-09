# Home — `index.html`

*One-scroll answer to a cold visitor's first question: **"What is DPR, and which door do I
walk through — get owned AI built (and become fundable) as a founder, or get vetted,
AI-validated dealflow as an investor?"** The page presents **one flywheel to two audiences**,
interactively.*

*Source of truth: `BUSINESS-MODEL.md` (the dual-business model). Section 9, "What dprai.io must
now say" (lines 225–241), is the authoritative site-copy guidance and is cited throughout. Every
claim and number below carries a `BUSINESS-MODEL.md` line reference in the **Source traceability**
table at the bottom. No claim appears here that the source cannot stand behind.*

*This file is the **content foundation** for the home-page redesign. It defines what each section
**says** and **does**; it does not build `index.html`. Design tokens and motion values are owned by
the design-token worker (`design/motion.tokens.json`); generated imagery and the mascot are owned by
the design/asset worker. This spec references those artifacts by name — it does not define them.*

---

## Page identity

- **`<title>`:** DPR AI — Owned, measured AI. And the capital network behind it.
- **Meta description:** DPR AI runs two connected businesses as one flywheel: we build owned,
  measured AI you keep — no lock-in — and we connect founders with the capital network that backs
  them. Owned, measured, honest — proof over theater.
- **Positioning line (one sentence, plain English):** We build owned, measured AI for companies —
  and we connect the founders we help make fundable with an elite capital network. **Two
  businesses, one flywheel.**
- **Ethos (sits on every screen):** **Owned, measured, honest — proof over theater.**
- **Shared shell:** reuse the existing site **nav** and **footer** unchanged (documented under
  *Shared nav + footer* below). Do **not** rebuild them.

---

## Section 1 — Hero: the network flywheel (the ONE signature interactive piece)

- **Eyebrow:** Two businesses. One flywheel.
- **Headline:** We build the AI. We know the capital. The relationship is the moat.
- **Subhead:** DPR builds owned, measured AI companies keep — then connects the founders we help
  make fundable with an elite, high-trust capital network. Owned, measured, honest — proof over
  theater.
- **Audience toggle (top of hero, reframes the whole page):** **I'm building** · **I'm investing**.
  Two states, one page. Default state: *I'm building*. The toggle is keyboard-operable and updates
  the hero detail panel and the dual-path emphasis below.

**The interactive flywheel (this is the focal zone — 60%+ of hero attention):**
- **Two node clusters, clearly labelled:**
  - **Build AI for customers** — nodes: *Automation*, *Compliance & governance*, *Low-code /
    no-code*, *Integration* (the four build pillars).
  - **Connect founders with capital** — nodes: *Founders*, *Investor network*, *Warm, vetted
    introductions*.
- **Cross-cluster edges** draw the founder ↔ capital relationship: a good build makes a founder
  genuinely fundable on merit → a warm, vetted introduction to an investor in the network → wins
  and warm intros deepen trust on both sides → better founders and better investors keep pulling in.
- **Interaction:** hovering or focusing a node raises that single node and opens a **detail panel
  inside the same composition** (not a separate table elsewhere on the page) with the node's one-
  line meaning. Every node is reachable by keyboard; focus shows the same panel a hover does.
- **The label removes doubt for scanners who won't hover:** the positioning line and ethos are
  printed next to the flywheel, so the page reads even with all motion stripped.

- **Primary CTA (Founder state):** Get owned AI built → `contact.html`
- **Primary CTA (Investor state):** Request dealflow access → `investors.html`
- **Secondary CTA:** See how the flywheel works ↓ (scrolls to Section 4)

> **Builder note (interactive, not decorative):** this is the site's single signature motion
> piece. All timing/parallax values come from `design/motion.tokens.json` (node drift/pulse period,
> hover raise ≤15% over the token's ease-out, parallax cap). Under `prefers-reduced-motion` it
> freezes to the `flywheel-rest` frame (nodes at layout-default, edges fully drawn, glow/wash pinned)
> with instant opacity/colour hover feedback only. No wall-clock timers drive behaviour.

---

## Section 2 — Dual-path split: choose your door

*Two audiences with opposite needs, each routed within seconds. This section is one interactive
band with two distinct tracks — never one generic pitch.*

- **Eyebrow:** Two doors, one firm.
- **Headline:** Pick the door that's yours.

**Track A — Founders & companies**
- **Value line:** Get owned, measured AI built into your real systems — judged on one honest number
  you agree up front, handed over so you own it. No lock-in. Good builds make you genuinely
  fundable — on merit, not hype.
- **Who it's for (today):** regulated, data-sensitive businesses — legal, healthcare, fintech,
  insurance — where audit-ready AI is worth the premium.
- **CTA:** Get owned AI built → `contact.html`
- **Secondary:** See how a build works → `method.html`

**Track B — Investors**
- **Value line:** Curated, AI-validated, de-risked dealflow plus access to an elite founder network
  — by **flat subscription**, verified-accredited only. Published scoring methodology, disclosed
  conflicts, no spam, no promises. **Never a cut of a raise.**
- **Who it's for:** angels and angel groups, micro-VCs and emerging managers, family offices,
  syndicate leads.
- **CTA:** Request dealflow access → `investors.html`
- **Secondary:** What we screen on → `what-investors-screen.html`

> **Builder note:** the top-of-hero toggle (Section 1) sets which track is emphasised first, but
> **both tracks are always visible and reachable** — neither audience is hidden behind a click.

---

## Section 3 — The four build pillars (one interactive unit, honest number in-container)

*This is the "owned, measured" proof, made concrete. Build it as **one** connected component: a
rail of the four pillars you hover/click that updates a detail panel **in the same container**.
Do **not** repeat the broken `method.html` pattern (a labelled box, a separate description table far
below, and a mascot floating in its own column).*

- **Eyebrow:** What we build — measured on one honest number.
- **Headline:** Four pillars. One number each. You own the result.
- **Subhead:** We wire real AI into your systems, judge it on a number you agree up front, and hand
  it over. Every pillar is monitored, retrained, and yours to keep — sold as a retainer, not a
  one-off project.

**Pillar rail (each item, on hover/focus/click, updates the shared detail panel):**

| Pillar | What we actually do | The one honest number |
|---|---|---|
| **AI automation** | Wire real AI into your workflows; monitored, retrained, handed over so you own it | **Time / cost removed per cycle** |
| **Compliance & governance** | Model-risk docs, audit trails, human-in-loop controls, regulatory guardrails baked in | **Findings closed / audit-ready** |
| **Low-code / no-code** | Fast builds on tools you already own — shipped in weeks, no lock-in | **Weeks to live / adoption** |
| **Integration** | Connect your data and systems so the AI runs on ground truth | **One source of truth** |

- **Detail panel (shared, in-container):** shows the selected pillar's fuller "what we do" line and
  its honest number. The mascot, if used, lives **inside** this composition as a companion anchored
  to the panel — never floating in its own column.
- **Entry engagement is a retainer from day one:** a setup fee stands the system up, then a monthly
  retainer covers monitoring, retraining, eval upkeep, and a defined set of deliverables. You recur
  from day one — you are not billed for a project that never ships.
- **CTA:** See how a build works → `method.html`

---

## Section 4 — The relationship flywheel: why the network is the moat

*The strategic story that separates DPR from a generic AI agency and from a generic dealflow list.
Told visually (a compounding loop) and in words.*

- **Eyebrow:** The moat is the relationships.
- **Headline:** Every build compounds the network. That's the whole game.
- **Subhead:** Good builds create real, measured traction → traction makes a founder genuinely
  fundable → a warm, vetted introduction on merit → wins deepen trust on both sides → better
  founders and better investors keep pulling in.

- **Body (plain English):** A pure AI-services shop lives project-to-project with no compounding
  asset. A pure dealflow list has no proof — just deal spam. Together, the AI builds are the *proof
  engine* that earns the right to make introductions, and the investor network is the *distribution*
  that makes those builds more valuable. **The durable asset is the relationship network itself, not
  any single deal.** Neither side is easy to copy, because both rest on the same slowly-earned thing:
  trust.

- **The honesty boundary, stated plainly (this is not fine print):**
  - The capital side earns money exactly **one** way: a **flat, recurring dealflow subscription**
    paid by investors. **Never a percentage of a raise, never a per-intro success fee, never any pay
    tied to a financing event.**
  - We take **equity/SAFE only as payment for build work delivered**, priced to the fair cash value
    of those services. **We never grant or receive equity for making an introduction.**
  - **The firewall:** we do **not** warm-introduce a company we hold equity in to any paying
    subscriber. If such a match is genuinely investor-driven, it routes entirely through a
    **registered broker-dealer partner** who contracts with and is paid directly — never DPR — with
    the stake disclosed on the deal page.

> **Builder note:** the flywheel loop here is an *explanatory* diagram (builds → traction → intros →
> wins → reputation → more builds), distinct from the Section 1 signature hero. Keep it calm and
> legible; the hero owns the signature motion.

---

## Section 5 — Honest cold-start proof (no fabricated anything)

*We are early with no client roster. Trust comes from a guarantee-grade promise, a concrete "what a
first engagement looks like", published honesty principles, and one real, sanitized run of our own
engine — **not** from fake logos, testimonials, or invented metrics.*

- **Eyebrow:** Proof over theater.
- **Headline:** No borrowed logos. Here's how you check us instead.

**How we prove it honestly (four verifiable signals):**

1. **You agree the number before we start.** We judge every build on one honest number the client
   agrees to up front, report it against a real baseline with sample size and caveats in plain
   sight, and if it didn't move, we say so.
2. **You own it — no lock-in.** Code, configuration, and docs are handed over so your team can run
   and extend the system. No license to renew, no seat to rent.
3. **What a first engagement looks like (concrete, not a promise about your numbers):** we land on
   one real workflow in your systems, stand it up with a setup fee, then run it on a monthly retainer
   — monitoring, retraining, eval upkeep, a defined set of deliverables, and the one honest number.
   Early on, the founder side is seeded by real paid builds and the investor side by **information,
   not deals** (a free "what we're seeing" research memo), so nothing here rests on a two-sided
   network that doesn't exist yet.
4. **One real run of our delivery engine (labelled, sourced — not a client result):** a sanitized
   export of our own mesh run shows **305 files changed**, **60 dispatches sampled**, **~18.4 hours
   of compute** in a single run. *This is a depiction of our build capability from our own logs
   (`assets/data/jarvis-run.json`, exported 2026-06-30, no client data) — not a claim about your
   workflow.*

**Our honesty principles (published, not decorative):**
- No invented clients, logos, testimonials, or unverifiable stats — ever.
- Every score and memo carries: *information, not a recommendation; not investment advice; do your
  own diligence.*
- We publish our scoring methodology and disclose every conflict on the deal page.

- **CTA (Founder):** See how we measure → `proof.html`
- **CTA (Investor):** What we screen on → `what-investors-screen.html`

---

## Section 6 — The compliance-honest promise (say it out loud)

*Investors and regulator-minded founders need to see, in plain sight, that DPR is not a finder
taking success fees.*

- **Eyebrow:** What we never promise.
- **Headline:** Subscription, not a cut. Equity only for build. No guaranteed raise.
- **Body:** We are **not a broker-dealer** and we **do not guarantee any raise**. The capital side
  is a flat recurring subscription — never a percentage of capital, never a success fee, and no DPR
  fee is ever triggered by, contingent on, or timed to a financing event. Advisory that helps a
  founder become fundable is sold as generic traction/ops instrumentation, billed and payable
  whether or not you raise.
- **Disclaimer stack (carried site-wide where deals are shown):** *Not a broker-dealer. Not
  investment advice. No guaranteed raise. All investments are speculative and may lose value. Past
  results don't predict the future.* This is not legal advice.

---

## Section 7 — Dual conversion (the two BLOCKING actions)

*The page exists to start build engagements and to open the capital side. Give each audience its
own qualified next step.*

- **Eyebrow:** Walk through your door.
- **Headline:** Two paths. One honest firm.

**Founders / companies**
- **Line:** Tell us the workflow eating your team's time. We'll scope one honest number and a build
  you'll own.
- **Primary CTA:** Get owned AI built → `contact.html`
- **Secondary:** Book a scoping conversation → `pilot.html`

**Investors**
- **Line:** Request access to vetted, AI-validated dealflow and an elite founder network — flat
  subscription, verified-accredited only.
- **Primary CTA:** Request dealflow access → `investors.html`
- **Reassurance chip:** Verified-accredited · published methodology · never a cut of a raise.

- **Direct line (both):** Prefer email? `hello@dprai.io` — one business day to a real reply.

---

## Shared nav + footer (reuse — do not rebuild)

The redesign reuses the **existing** site chrome. Documented here so the builder wires the same
elements and does not fork them:

- **Primary nav (as built in `index.html`):** How it works (`method.html`) · Case studies
  (`case-studies.html`) · Teardowns (`teardowns.html`) · Field Notes (`blog/index.html`) · About
  (`about.html`), with persistent CTAs **Talk to us** (`contact.html`) and **Book a pilot**
  (`pilot.html`). A mobile menu mirrors these links.
- **IA note (see `content/SITEMAP.md`):** the dual-audience redesign adds an **Investors**
  destination (`investors.html`) to the primary nav so the capital path is reachable from every
  page, not only the home hero.
- **Footer (as built):** brand blurb + three columns (Studio · Field Notes · Get started) + bottom
  line. Keep the footer's existing links; they all resolve.

---

## Interaction & accessibility notes (for the build worker)

- **Every major section is interactive**, not a static band: the hero flywheel, the audience toggle,
  the dual-path tracks, and the four-pillar rail all respond to hover/focus/click and update content
  **in place**.
- **Keyboard-operable throughout:** the toggle, every flywheel node, and every pillar in the rail
  are focusable and operable by keyboard; focus reveals the same detail a hover does; visible focus
  ring on every interactive element.
- **`prefers-reduced-motion`:** honour it in **both** CSS and JS — freeze the hero to the
  `flywheel-rest` frame, disable drift/parallax/scroll-draw, and keep instant opacity/colour feedback
  only. All motion values come from `design/motion.tokens.json`; **no hardcoded wall-clock timers**
  drive behaviour (motion is event/scroll/reduced-motion driven).
- **Contrast:** meet WCAG 2.2 AA against the graphite canvas; the reserved amber accent is used
  sparingly (one accent, capped), never as body text on low-contrast fills.
- **Scroll-reveal** uses IntersectionObserver, animating `transform`/`opacity` only.

---

## Source traceability (every claim → `BUSINESS-MODEL.md`)

| Home-page claim | Source line(s) |
|---|---|
| Ethos "owned, measured, honest — proof over theater"; sits on every screen | 11, 241 |
| Two connected businesses forming one flywheel | 4, 13, 22 |
| Line 1: owned, measured AI; judged on one honest number agreed up front; handed over; no lock-in; sold as retainers | 13 |
| Four build pillars + what we do + honest number (site-facing) | 233–236 |
| Line 2: connect founders with capital; introductions and information only; flat recurring subscription; never a cut of a raise / no per-intro success fee | 22, 101, 215 |
| Equity/SAFE only as payment for build work; never for an introduction | 24 |
| Firewall: don't warm-intro a company we hold equity in to a paying subscriber; route via registered broker-dealer partner; disclose the stake | 26, 217 |
| The moat is the relationship network itself, not any single deal | 32 |
| Why the combo beats either alone (proof engine + distribution) | 34, 36 |
| Audience toggle "I'm building / I'm investing" reframes the page | 227 |
| Interactive spine: flywheel diagram; audit/quiz returns your one honest number; gated deal rooms behind accredited verification | 241 |
| Founder view / Investor view one-liners | 238, 239 |
| Investors are verified-accredited; published methodology; disclosed conflicts; portfolio deals capped/unpaid | 66, 109 |
| Wedge (today): regulated legal, healthcare, fintech, insurance | 40, 44 |
| Retainer entry: setup fee (LUMPY) + monthly retainer (RECURRING) covering monitoring/retraining/evals/deliverables | 74 |
| Advisory decoupled from any raise (sold as generic traction/ops, billed regardless) | 87, 219 |
| Not a broker-dealer; do not guarantee any raise; zero contingent fee | 97 |
| What we never promise + full disclaimer stack | 223 |
| Seed founder side with real paid builds; seed investor side with information, not deals | 175, 177 |
| Automation never negotiates/recommends/touches money; "information, not a recommendation" | 211 |

Real proof numbers (305 files / 60 dispatches / 66,255 s ≈ 18.4 h): `assets/data/jarvis-run.json`
`totals` (verified), provenance note "Real, sanitized run records… No client data."

---

## Facts to confirm before publishing

- **Domain / email consistency.** `BUSINESS-MODEL.md` line 11 names the site **dprai.io**, while the
  live footer and this content dir use **`hello@dprai.io`** as the contact of record and "DPR AI
  (dprai.io)". Confirm the canonical domain and email before launch; this spec keeps the existing
  live contact of record (`hello@dprai.io`) rather than inventing a new one.
- **Launch SKUs.** `BUSINESS-MODEL.md` §3 (line 70) launches with **three** packages — Starter,
  Growth, and the Signal investor tier — not the full menu. If the home page names prices, show only
  the launch three; the rest is the ladder the firm grows into.
- **Firewall vs. "build them then fund them."** `BUSINESS-MODEL.md`'s own pressure-test (line 248)
  flags that the firewall forbids self-introducing equity-held companies to paid subscribers. This
  spec resolves it honestly: introductions are **on merit**, the moat is the **relationship network**
  (not self-dealt portfolio deals), and equity-held companies route only through a registered
  broker-dealer partner. Keep that framing; do not imply DPR funds its own book.
- **The real-run figures.** 305 / 60 / 66,255 are current as of the 2026-06-30 export
  (`assets/data/jarvis-run.json`). Re-export before a relaunch so the number is current, and always
  ship it **labelled** as a depiction of our engine, not a client result.
- **No client proof yet.** Until a real, cleared case study exists, keep Section 5 to the four
  verifiable signals above; do **not** add logos, testimonials, or client numbers.
