# DPR AI — Site Redesign Plan

Status: proposed · Owner sign-off needed before Phase 1
Quality bar: **Jarvis vision critic (`mesh.design_critic.critique_ui`) must score the homepage ≥ 84/100 (marketing floor), all sub-scores clear.** Grade the real rendered pixels after every pass, fix what it flags, repeat.

---

## 1. The stance (Jarvis-as-CEO decision)

**Positioning (hero headline):**
> We build production AI your business actually **owns** — not **rents**.
> _(the two words "owns" and "rents" set in the gold accent)_

**Sub-line:**
> Real systems, senior-built, measured against one honest number, handed over with the code, weights, and evals.

**Voice:** Blunt, senior, allergic to hype. We name the enemy (slop) plainly and back every claim with something verifiable. Warm underneath the edge — we're picking a fight with bad AI, not with you.

**Controversial hooks** (used as large typographic pull-quotes across the page):
1. Most AI you've been sold is slop: dead demos, rented wrappers, and accuracy numbers nobody can reproduce.
2. If you can't take the code, the weights, and the evals with you, you don't own it — you're renting theater.
3. Your AI shouldn't die the day our contract ends.
4. No offshore junior farms, no prompt-and-pray. Senior people, or we don't ship it.
5. A demo that works on stage and nowhere else isn't a product — it's a magic trick.

**CTA labels everywhere (no money, no "pricing"):** `Start a build` · `See what we ship`

---

## 2. Content changes

### 2a. Remove ALL pricing / money (owner: "remove anything with money in it")
Exact removals:
- **Homepage cards** — delete the four price tags: `From $12k · then $2k–$5k/mo` (×4, index.html ~L199/208/217/226).
- **Homepage deal band** — delete `Starts with a $2,500 audit — credited to the build` (~L234).
- **Homepage pricing section** — delete the whole "One scope. One number. Priced up front." block incl. the `$8,000–$15,000` price band (~L459–470).
- **Guarantee band** — remove any money/refund wording; reframe purely as "measured against one honest number" (no fee, no refund, no "you don't pay").
- **Top nav** — remove the `Pricing` item from all **47** pages.
- **pricing.html** — retire the page; redirect `/pricing` → `/contact` in `vercel.json`.
- **22 pages that contain dollar figures** (cost pages, `kb/what-custom-ai-automation-costs`, `cost/`, `cost-of-inaction`, dataroom, etc.) — strip every `$` amount; keep the idea, drop the number. The cost-of-inaction calculator and `/cost/` estimator either lose their money output or are cut (decision below).
- **Any "see pricing" style CTA** → `Start a build` / `Talk to us`.

### 2b. Copy
- Rewrite the hero + section intros in the CEO voice above.
- Turn the 5 hooks into real on-page pull-quotes.
- Keep everything honest — zero fabricated metrics (already removed).

---

## 3. Homepage — section by section

Final structure (9 sections, down from the old 19). Each: **content · visual · motion/interaction**.

1. **Hero** — "…actually owns, not rents." + sub-line + 2 CTAs.
   - Visual: crisp animated gold robot (fix the ghosted one; use the transparent WebM).
   - Motion (ANCHOR #1): subtle idle float + gentle cursor parallax; the two gold headline words "reveal" (accent wipes in) on load.

2. **What we build** — "Four things we ship as real, owned systems — not demos." 4 cards (Sales agents · Automations · Multi-agent · Pipelines), each led by what it does. No prices.
   - Visual: the 4 animated 3D objects (kept), floating clean (no square panels).
   - Motion (ANCHOR #2): 3D tilt-on-hover; the traveling bot presents each (kept, tightened).

3. **Fake it vs. prove it** — "Most AI agents fake it. Ours prove it against one honest number." The red/green contrast (bots already removed).
   - Motion (ANCHOR #3): an animated split/slider that literally morphs a "slop" output into a "proven/owned" one.

4. **You own it** — "You walk away with the code, weights, and evals. Always." (new/─reframed from the guarantee, zero money).
   - Visual: the glass-cube-and-key ownership 3D piece; quiet, spacious.

5. **How a build runs** — reframed 6-step path around ownership + the one honest number.
   - Motion: scroll-driven stepper (kept; keep it quiet/clean).

6. **Free open-source tool** — "We build in the open, not behind a paywall of promises." (inbox-to-action).

7. **Small senior team** — "No juniors, no handoffs to strangers. The people who scope it build it."

8. **FAQ** — "Straight answers to the questions vendors dodge." (accordions).

9. **Contact** — "Tell us the number you need to hit." (working form, no money).

Cut: the pricing section, the slop carousel (done), audience-cards (done), fabricated-stat sections (done), extra dark band (done), the 3 redundant widgets (done).

---

## 4. Design system (what takes it from 2/10 → 84+)

- **Color:** light editorial base (near-white bg, near-black ink). ONE accent = **DPR gold** (ties to the mascot), used only to highlight 2–3 key words per headline. A controlled deep-charcoal/ink for the single dark "beat." No rainbow of tinted panels.
- **Typography:** big, tight, heavyweight sans headlines with **two-tone treatment** (ink + gold on the key words). Calm neutral body. Mono ONLY for code/paths — never for labels or counters.
- **Whitespace & rhythm:** generous, consistent vertical padding; one max content width; consistent card style. Legionedge-clean.
- **Motion:** fast, purposeful easing. Site-wide scroll reveals (fade + rise). Soft gradient blends between sections so they flow (no hard stops). Respect `prefers-reduced-motion`. Richness ONLY in the 3 anchor moments above — everything between stays quiet, static, text-forward.
- **Pull-quotes:** the controversial hooks set as large typographic moments so the words themselves are the design.
- **One dark band max**, on-brand deep-indigo/charcoal gradient (not stock near-black).

---

## 5. Site-wide (after the homepage clears 84)

- Propagate the color/type/motion system + the no-`Pricing` nav to all pages.
- Retire pricing.html + redirect.
- Strip `$` from the 22 money pages; reframe or cut the cost calculators.
- Re-grade key pages (services, method, proof, about) with the critic.

---

## 6. Execution phases

- **Phase 1 — Homepage rebuild to 84:** new hero + two-tone/gold system + kill remaining money + the 3 anchor motions + section blends. Grade → fix → repeat until ≥84.
- **Phase 2 — Money purge site-wide:** nav, pricing.html redirect, strip `$` from 22 pages, CTA relabel.
- **Phase 3 — Propagate system** to the rest of the pages; grade the top pages.
- **Phase 4 — Bake the rubric into the design cards** so future design work is auto-graded (the gap found today).

---

## 7. Grading loop (every pass)

1. Render a scrolled screenshot (so reveal content is visible — the critic's own capture doesn't scroll, which under-grades).
2. `critique_ui(png, brief)` → scores + findings + fixes.
3. Fix the flagged items.
4. Repeat until all sub-scores clear and composite ≥ 84.

---

## 8. Open items to confirm

- **Cost calculators** (`/cost/` estimator, `cost-of-inaction`): cut entirely, or keep the tool but remove the dollar output? (They're money-centric.)
- **Bolder?** The hooks above are strong; say if you want them sharper/more controversial.
- Sign-off to start **Phase 1**.
