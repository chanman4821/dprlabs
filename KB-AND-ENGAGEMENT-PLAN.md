# DPR AI — Knowledge Base + Deeper Content + More Interactivity (Growth Plan)

*Plain-English plan of record. Built on the real repo (verified on disk) and the honesty
rules in `BUSINESS-MODEL.md` / `content/README.md`. Design system of record is
`tokens.css` + `DESIGN-LANGUAGE.md` (graphite canvas, ONE amber accent). It does not change
any live HTML — it says what to build and in what order.*

---

## In one paragraph

The site is technically clean but shallow: it has good bones, a few real interactive tools,
and only three real blog posts. This plan adds three things you asked for — a **knowledge
base** (durable reference content), **deeper content** on the pages you already have, and
**more things a visitor actually does** (interactive tools that make people stay). Every item
here obeys your honesty rules: no invented numbers, no fake proof, and the investor side keeps
its legal disclaimer.

---

## The shape of it: three content layers, one engagement layer

You currently blur three different content jobs. Keep them separate so they don't overlap:

| Layer | Lives at | Its one job (charter) |
|---|---|---|
| **Learn AI (free guide)** | `/guide/` | *The front door* — teach a non-technical owner to use AI and prompt well, free. The top-of-funnel lead magnet that earns trust first. |
| **Field Notes (blog)** | `/blog/` | *Thinking in public* — your opinion and stories, with a voice and a date. Proof you're smart and honest. |
| **Teardowns** | `/teardowns.html` | *"What we're seeing"* research — the top of the investor funnel; proof you can spot what's broken. |
| **Knowledge Base (NEW)** | `/kb/` | *The definitive plain-English answer* to "what is X" and "how do I do X." Evergreen, searchable, no author voice. |

**Test that they don't overlap:** the blog post *"The one number"* is your take on picking a
metric. The KB article *"How to pick your one number"* is the reference version — step-by-step,
timeless, no personality. They cross-link, but they're not the same thing twice.

---

---

# PART 0 — The free "Learn AI" guide (the front door) — *primary content play*

**Decided by Jarvis's brain** (`copilot:claude-opus-4.8`): the main content play is a **free,
plain-English guide that teaches non-technical owners to use AI and prompt well**, and it gets
its own home at **`/guide/`** (a clean, shareable URL — not buried inside the knowledge base).
It's the top-of-funnel front door; the knowledge base cross-links into it.

**The 8 lessons (zero to confident):**
1. What AI actually is (and isn't)
2. Your first 15 minutes with an AI assistant
3. The anatomy of a good prompt (role · task · context · format · constraints)
4. Giving AI context about your business
5. Everyday uses that save real time
6. Checking AI's work: trust but verify
7. Keeping your data and customers safe
8. Building your own prompt library

**Every lesson follows the same shape:** Goal → plain-English explanation → worked before/after
example → a hands-on tool (where it helps) → common mistakes → takeaway + one thing to try.

**3 hands-on tools, all honest and client-side (nothing sent anywhere, no faked AI answers):**
- **Prompt Builder** — fill guided fields → a live, copy-ready prompt (builds text only).
- **Before / After gallery** — hand-authored weak→strong prompt pairs, labelled teaching samples.
- **Prompt Checklist** — transparent rule-based "what's missing" (a checklist, *not* an AI score).

**Conversion (soft, trust-first):** invitations appear only *after* value (end of a lesson / the
index), as a quiet link out to the real BUILD page — never mid-lesson pitches, never invented
proof. The investor/CAPITAL side is kept off the guide (or, if shown, gated to accredited readers
with the full disclaimer stack).

**Status — first step BUILT:** `/guide/index.html` is live (the front door: purpose, the 8-lesson
map, the 3-tool preview, one quiet CTA), built on the shipped light `site.css` so it matches the
site today. Verified: 0 console errors, all assets load, 33/33 links resolve.

**Next steps for the guide:** write Lesson 1 (`/guide/what-ai-actually-is.html`) on the same
shell → build the **Prompt Builder** tool (highest-leverage, reusable) → then Lessons 2–3, adding
the Before/After gallery and Checklist. Add "Learn AI" to the site-wide nav during the nav fix.

---

## Foundation first: pick ONE design system (real, unresolved)

There are **two design systems in the repo and they don't match** — settle this before a big content push:

- **What's actually shipped (every live page):** `site.css` — a **light** theme (`#ffffff`
  canvas, near-black ink), **Geist** fonts, and an **indigo** accent `#3b5bdb` (the `--gold-*`
  names are legacy; the live accent is indigo). Classes: `wrap`, `prose`, `sec`, `eyebrow`,
  `lead`, `card`, `grid-2`, `btn`, `reveal`. This is what the home page, About, blog, etc. use
  today.
- **What's designed but NOT shipped:** `tokens.css` + `DESIGN-LANGUAGE.md` — a **dark graphite**
  theme, one **amber** accent `#F6A328`, **Space Grotesk / Inter / JetBrains Mono**. It's
  labelled "of record," but **no live page uses it yet.** The even-older `DESIGN-AND-BLOG-PLAN.md`
  (teal) is superseded by both.
- **The decision:** either (a) keep building on the shipped light `site.css` for consistency now,
  or (b) commit to the dark `tokens.css` redesign and migrate every page. **Don't build new pages
  half-in-each** — that's how the current split happened. Until you choose (b), new pages should
  match the shipped light site so they don't look orphaned.
- **What was built:** the new `/guide/` front door (below) was built on the **shipped light
  `site.css`** so it looks native today. If you green-light the dark redesign, it restyles with
  everything else.

---

# PART 1 — The Knowledge Base

## Where it lives and how it's addressed

- Root: **`/kb/`** (honest label both founders and investors understand).
- Flat static HTML, same as the rest of the site. Max depth 3: `/kb/[category]/[article].html`.
- Example URLs:
  - `/kb/index.html` — KB home
  - `/kb/measuring-ai/index.html` — a category
  - `/kb/measuring-ai/how-to-pick-your-one-number.html` — an article
  - `/kb/glossary/index.html` + `/kb/glossary/eval-harness.html` — glossary

## The six categories (mapped to your four build pillars + the investor audience)

| # | Category | What's in it | Who it's for |
|---|---|---|---|
| 1 | **Measuring AI** | Picking the one number, baselines, counting rules, stop conditions | Founder |
| 2 | **Building & Owning AI** | Ownership, handover, no lock-in, runbooks, "runs on your infra" | Founder |
| 3 | **Compliance & Governance** | Audit trails, human-in-loop, model-risk docs | Founder (regulated) |
| 4 | **Low-code & Workflow Automation** | No-code vs custom, scoping automation | Founder |
| 5 | **For Investors** | Diligencing AI startups, reading eval claims, how the subscription works | Investor |
| 6 | **Glossary** | Plain-English definitions (RAG, eval harness, SAFE note, the one number) | Both |

## Article types

Concept explainer · How-to guide · Checklist · Comparison · Method deep-dive · FAQ · Glossary
entry. (Lengths run ~50 words for a glossary term up to ~1,500 for a method deep-dive.)

## Launch backlog (20 articles — ship the 7 P0 first)

**Measuring AI**
- **[P0] How to pick the one number before you build anything** (how-to)
- **[P0] How to set a baseline the right way** (how-to)
- **[P0] What makes an AI result actually measurable** (explainer)
- [P1] Vanity metrics vs honest metrics in AI (comparison)
- [P1] The AI measurement checklist — 10 questions before you call it a win (checklist)
- [P2] How to write a stop condition before you build (how-to)

**Building & Owning AI**
- **[P0] What "you own it" actually means in an AI build** (explainer)
- **[P0] The AI handover checklist — 7 things to confirm before "done"** (checklist)
- [P1] Build vs buy vs rent: how to decide for your first AI project (comparison)
- [P1] What "runs on your infrastructure" actually means (explainer)
- [P2] How to write an AI runbook your team can actually use (how-to)

**Compliance & Governance**
- **[P0] What an AI audit trail requires — a plain-English guide** (explainer)
- [P1] Human-in-loop: when to require it and how to implement it (how-to)
- [P2] Model risk documentation: what it covers and why it matters (explainer)

**Low-code & Workflow Automation**
- [P1] When to use a no-code AI tool vs a custom build (comparison)
- [P2] How to scope a workflow automation project (how-to)

**For Investors** *(every article here carries the disclaimer stack)*
- **[P0] How to read an AI startup's eval claims (and what they hide)** (explainer)
- [P1] Six questions to ask any AI vendor before signing (checklist — useful to both)
- [P1] How DPR scores and presents companies for investor dealflow (method deep-dive)

**Glossary** — [P1] eval harness · RAG · the one honest number · [P2] SAFE note

**Launch = the 7 P0 articles.** That's enough for the KB to have a real purpose. P1s follow
about monthly; P2s when convenient.

**Three honesty guardrails baked in** (where SEO tempts a dishonest angle, use the honest one):
- No "AI ROI calculator" that promises numbers → publish the **measurement method** + a blank
  scorecard instead.
- No "case studies by industry" implying many clients → **one labelled worked example**
  (logistics) marked *ILLUSTRATION*.
- No "best AI tools" ranking → **"how to evaluate AI tools: a checklist"** instead.

## KB page layouts (all on the dark graphite spine, ~680px reading column)

- **KB home (`/kb/index.html`):** eyebrow + H1 ("Build, measure, and own AI — the reference
  layer") + a one-line lead, a **pill filter bar** (All / the 6 categories, client-side JS),
  then an editorial list of article cards (category tag · audience badge · type · title ·
  1-line summary · reading time). Shared CTA module at the bottom.
- **Category page (`/kb/[category]/index.html`):** breadcrumb, category headline + 2–3 line
  charter, the same article-card list filtered to this category, links to 2–3 adjacent
  categories, CTA module.
- **Article page:** breadcrumb → header (category eyebrow, H1, meta row: type · last-reviewed
  date · reading time) → **TL;DR box** (amber left-border) → body in the main rail with
  optional **right-margin "instrument notes"** (method notes, caveats, KB cross-links) →
  a **"the number" callout** only where a worked example exists (always labelled *ILLUSTRATION —
  not a DPR result*) → related articles + related Field Notes → **disclaimer stack** (investor
  articles only) → shared conversion module.

## Where KB content lives (source of truth)

Mirror the existing `content/pages/` pattern with a new `content/kb/` tree (one folder per
category, `_category.md` for category copy, one `.md` per article, `glossary/_index.md`). Each
article starts with a small YAML header a build worker turns into the page:

```yaml
---
title: "How to pick the one number before you build anything"
slug: how-to-pick-your-one-number
category: measuring-ai
type: how-to            # explainer | how-to | checklist | comparison | method-deep-dive | faq | glossary
audience: founder       # founder | investor | both
summary: "A practical method for choosing the single metric that decides whether your build worked."
last_reviewed: 2026-07-08
reading_time: 7
related_articles: [how-to-set-a-baseline, what-makes-a-result-measurable]
related_posts: [the-one-number]
conversion_cta: start-build   # start-build | discuss-setup | learn-methodology | subscribe-signal
disclaimer_stack: false       # true for every for-investors article
---
```

---

# PART 2 — Deeper content on the pages you already have

Concrete depth to add, page by page (all within the honesty rules):

| Page | What's thin | Honest addition |
|---|---|---|
| **Home** | Capital side is implicit; the real engine run isn't used as proof | A 2-row "Two ways to work with us" (Founders→Build, Investors→Capital); a small "305 files · 60 tasks · 18.4h — a real sanitized run" callout linking to Proof; a KB "Learn" teaser once 5+ articles exist |
| **How it works** | Never names the four pillars; no cross-links | Add a "What we build" 4-row pillar section (name · one line · honest number · KB link); margin notes linking to KB; expand "when we say no" to 3 concrete scenarios |
| **Investors** | **Missing the legal disclaimer**; no price anchor; firewall not shown | Add the disclaimer stack (header + footer); a "what the subscription includes" tier note; a plain "how we stay honest about conflicts" (firewall) section; link the scoring-method KB article |
| **What investors screen on** | No last-reviewed date; ends abruptly; no disclaimer | Add a review date; KB cross-links per screen; disclaimer stack; a related-content module |
| **Case studies** | Counting rules not shown inline; one-client caveat missing | A "how we counted this" collapsible; a "run the same scorecard →" link to Proof; an honest "this is one engagement" caveat; KB links |
| **Teardowns** | No failure-type filter; not numbered | Add a client-side failure-type filter; number them ("Teardown #1…"); a "prevent this →" KB link per teardown; promote the vendor-grader into its own KB checklist |
| **Proof** | Engine run not cited as proof; counting rules not spelled out | A "what a real run looks like" panel from `jarvis-run.json` (labelled sanitized); a "how DPR counts" section; links to the Measuring-AI KB articles |
| **About** | Only explains the build side; early-stage not framed as a feature | A 3-sentence "two ways we work" flywheel paragraph; a compliance honesty principle; a short "where we are now" (early = why the guarantee exists) |

---

# PART 3 — More interactivity (make people stay)

## What earns dwell time for *this* honest brand

1. **Self-diagnosis tools that give real insight** — visitors invest time when they enter
   their own numbers or run a real check. You already have three (readiness quiz, one-number
   meter, slop test); deepen them, never email-gate the result.
2. **Explorable real-data proof** — the Jarvis run (305 files / 60 tasks / 18.4h) is a genuine
   asset no competitor has. Let people inspect it.
3. **Progressive depth on long content** — hover definitions, expandable method panels, saved
   checklists reward the serious reader and bring them back.
4. **Investor self-qualification** — an explorable, disclaimed screening-method tool lets
   accredited investors judge fit themselves (fewer junk leads).
5. **Honest decision tools** — Build/Buy/Rent and the slop test help even when the answer is
   "don't hire DPR." Trust in the tool becomes trust in the studio (and ranks on search).
6. **Respect the visitor's work** — save checklist/estimator state locally, show reading
   progress. Completion goes up with zero manipulation.

**Reject outright** (off-brand, dishonest): fake live-visitor counters, exit-intent guilt
popups, fake scarcity/countdowns, auto-play audio, email-gating a calculator, auto-popping
chat bubbles, and any invented testimonial or logo wall.

## The component catalogue (12 — mix of upgrades and net-new)

| ID | Component | New/Upgrade | For | Lives on | Priority |
|---|---|---|---|---|---|
| C-01 | **Jarvis Run Explorer** — inspectable, role-filterable view of the real run | NET-NEW | Both | `proof.html` (and/or `method.html`) *— see note* | **P0** |
| C-02 | **ROI / Time-Saved Estimator** — honest *range* + "illustration" label + method tooltip | Upgrade (`cost-of-inaction.html`) | Founder | that page | **P0** |
| C-03 | **"What You Keep" ownership diagram** — toggle "DPR active" ↔ "DPR gone," everything stays green | NET-NEW | Founder | `own-it.html` | **P0** |
| C-04 | **AI-Readiness Quiz** — re-skin to amber/graphite, fix motion, link to fuller scorecard | Upgrade (`index.html`) | Founder | home | **P0** |
| C-05 | **Build vs Buy vs Rent decision tree** — branching, keyboard-navigable, can answer "don't hire us" | Upgrade (`build-buy-rent.html`) | Both | that page | P1 |
| C-06 | **One-Number Pillar Picker** — pick a pillar, get a pre-loaded example metric | Upgrade (`proof.html`) | Founder | Proof | P1 |
| C-07 | **Glossary hover-definitions** — popover on jargon terms site-wide | NET-NEW | Both | all pages | P1 |
| C-08 | **Pilot-Readiness Checklist** — tap, save locally, copy-to-clipboard export | NET-NEW | Both | `investors.html` + `slop.html` | P1 |
| C-09 | **Slop Sniff-Test scorecard** — 7-signal test with a "run it on us" mode | Upgrade (`slop.html`) | Founder | that page | P1 |
| C-10 | **Investor Methodology Explorer** — expandable "how we screen" (fully disclaimed) | NET-NEW | Investor | `investors.html` | P1 |
| C-11 | **Scrollytelling build journey** — "surface → deep → deployed → owned" | NET-NEW | Founder | `method.html` | P2 |
| C-12 | **Blog reading progress + related rail** — hairline progress + related-content after 60% | NET-NEW | Both | `blog/*.html` | P2 |

**The three strongest new engagement bets (P0):**
- **C-01 Jarvis Run Explorer** — turns "we built a real AI engine" into something a skeptic can
  click through. Built only from `jarvis-run.json` (real, sanitized). *Note: your IA rules say
  do **not** create a `jarvis.html` page; put this on `proof.html`/`method.html` instead.*
- **C-02 Estimator** — the calculator already works; make it honest (a **range**, labelled an
  *illustration estimate*, with a "how we'd measure this" note) and on-brand. The CTA fires
  after a real calculation, never as a popup.
- **C-03 "What You Keep"** — the no-lock-in promise is your most credible differentiator and the
  hardest to believe. Let people flip to "DPR gone" and watch everything stay theirs.

## Reuse eight standard interaction patterns (build each once)

Disclosure/accordion · tabs · tooltip/definition popover · count-up number · scroll reveal ·
filter/sort pills · copy-to-clipboard · save/checklist state (localStorage). Each ships the same
contract: keyboard operable, visible focus ring, `Escape` closes overlays, a **reduced-motion
static fallback**, and a **no-JS fallback**. Numbers always use Inter + `tabular-nums`, never
mono. This is what makes the site feel like one instrument, not twelve widgets.

## Honest measurement (know if engagement works, no dark patterns)

Capture only lightweight, privacy-respecting signals: which tools get used, quiz/estimator
completion, checklist saves, KB article reads. No PII, no invasive tracking, no third-party
harvesting.

---

# PART 4 — Quick fixes found along the way

- **Desktop nav is missing links.** It shows How it works · Case studies · Teardowns · About,
  but not **Investors** or **Field Notes** (the capital path and the blog). Add them.
- **Blog posts use a different, smaller nav** (missing Case studies + Teardowns). Make every
  blog post share the main site nav.
- **Design-token drift** (see Foundation): finish moving old pages onto `tokens.css` /
  Space Grotesk / amber; kill leftover Geist fonts and blue `#3b5bdb` on tool panels.
- **Investor pages are missing the legal disclaimer stack** — add it wherever deal/investor
  content appears (compliance requirement).

---

# PART 5 — Suggested build order (baby steps, each testable)

1. **Foundation:** confirm every new thing is built on `tokens.css`; fix the nav (add Investors
   + Field Notes; unify blog nav). *Small, ships in one pass.*
2. **KB skeleton:** `/kb/index.html` + one category (`measuring-ai`) + the KB article template
   and `content/kb/` structure. Prove the layout on one real P0 article.
3. **KB launch content:** write the 7 P0 articles; wire the client-side category filter; add the
   footer "Knowledge Base" link + a home "Learn" teaser.
4. **P0 interactivity:** C-01 Run Explorer, C-02 honest Estimator, C-03 "What You Keep."
5. **Investor honesty + depth:** disclaimer stack, C-10 methodology explorer, deeper investor +
   what-they-screen content.
6. **Deepen existing pages** (Part 2 table) and add C-04–C-09 as content lands.
7. **Polish:** C-11 scrollytelling, C-12 blog reading rail, glossary hover site-wide.

Each step is small enough to build, look at in the browser, and check before the next.

---

## Sources

- Business + honesty rules: `BUSINESS-MODEL.md`, `content/README.md`, `content/SITEMAP.md`.
- Design system of record: `tokens.css`, `DESIGN-LANGUAGE.md` (supersedes
  `DESIGN-AND-BLOG-PLAN.md`).
- Real data for honest components: `assets/data/jarvis-run.json`.
- This plan synthesizes an information-architecture pass (KB + content) and an interaction-design
  pass (engagement components), both grounded in files verified on disk.
