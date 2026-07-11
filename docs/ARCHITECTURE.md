# DPR AI — Site Architecture & Design Vision
**v1.0 · the single source of truth. Ties together the audit, IA, service menu, voice, and the visual/interactive direction.**

---

## 0. The vision (locked with the owner)
A **highly visual, interactive, colorful, engaging** site — **not another boring text-wall AI site.**
Every page earns its scroll with a **visual + a bold short statement + something that moves or reacts.**
Function first, but alive: color used with intent, motion with purpose, real interactivity — not decoration.

**The five rules every page must pass:**
1. **A visual per section** — a generated 3D object, diagram, product shot, or animated element. No section is text-only.
2. **Bold, short copy** — one strong statement, not a paragraph (see `voice-rules.md`). Cut filler words.
3. **Something interactive** — hover/expand, animated counters, a slider, a stepper, a toggle, a live demo. Give the visitor something to *do*.
4. **Color + motion with intent** — the brand gradients (indigo→violet→cyan, plus per-service accents), scroll reveals, the reacting robot. Never flat, never static.
5. **Proof, not fluff** — every claim cites a real number or is honestly labeled (anti-slop).

---

## 1. Business & positioning (from `service-menu.md`)
> We build the AI agents & automations that run your business — then hand them to you to **own.**
> One number agreed up front; if it doesn't move, you don't pay.

**Wedge:** custom + **owned** (vs. rented SaaS agents like 11x/Artisan). Proven boutique model: own-the-outcome + productized audit → custom build → managed retainer.

## 2. The 4 services (focused menu)
1. **AI Sales & Marketing Agents** — find leads, write outreach, follow up, book meetings.
2. **Workflow & Ops Automations** — automate the steps that drain hours; scale with code, not headcount.
3. **Multi-Agent Systems** — a team of agents for complex, multi-step work.
4. **Custom AI Pipelines** — your data/docs wired into one system that answers and acts.
Each: custom-built, **you own it**, one number, no move → no fee. Each gets its **own generated 3D visual** (done for the "What we build" section).

## 3. Pricing ladder (market-benchmarked)
- **Opportunity Audit — $2,500** (credited to the build).
- **Fixed-Price Build** — Starter $8k–$12k · Pro $12k–$25k · Multi-agent/Custom $25k–$60k+ (+$2,500/extra workflow).
- **Retainer** — $2k → $8k+/mo, cancel anytime.
- **Guarantee** — miss the number → no fee, keep the code.
- Standardize the **$8k build floor everywhere** (kills the old $3k/$8k conflict).

## 4. Information architecture (from `ia-sitemap.md`)
- **Nav (live):** How it works · Proof▾ · Pricing · Tools▾ · Resources▾ · About▾ + Start a build.
- **Clean URLs** live (/pricing). **New pages to add:** `/services`.
- **3 journeys:** business-buyer · founder · investor (see `ia-sitemap.md`).

## 5. Voice (from `voice-rules.md`)
Blunt · specific · self-aware. Bold one-liners, ≤2 sentences per idea. Banned words: cutting-edge, seamless, unlock, leverage, transform (without a number), etc. A number beats an adjective.

## 6. Design system
- **Light/indigo `site.css`** is canonical (dark `tokens.css` retired).
- Palette: indigo `#4f46e5` → violet `#7c3aed` → cyan `#06b6d4`; per-service accents (blue, pink, teal).
- Type: Geist (sans) + mono for labels/prices. Cards: white, soft shadow, gradient top-bar.
- **Imagery:** generated in **ComfyUI (FLUX)**, backgrounds removed, placed on soft accent glows (never a white box).

## 7. Interactivity toolkit (to build across the site)
- Scroll-reveal on every section (exists; extend).
- Animated counters for real numbers (metric band — exists).
- Hover-lift + expandable cards (services).
- **Interactive cost/ROI slider** (there's already a cost tool — surface it).
- **Interactive method stepper** (the 6-step build, click through each step + its deliverable).
- Service **selector / configurator** ("pick your problem → see what you get + price").
- The **reacting robot** (hero float — done; make it react to hovering the offerings).
- Slop-vs-sharp demo, agent wrong/right demo (exist — keep, spread the pattern).

## 8. Status
**Done & live:** cleanup · new nav + clean URLs · redirects · cleaner homepage · robot float · "What we build" section (in `home-preview.html`).
**In flight:** Services page · Pricing page rebuild · roll visuals+interactivity to core pages · promote new homepage.
**Pending owner input:** real team bios, # builds shipped, a 2nd case study, final prices (see proof-gaps in `messaging-framework.md`).
