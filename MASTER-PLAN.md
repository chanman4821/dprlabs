# DPR AI — Learning Platform Master Plan

*One organized plan for turning dprai.io into the place people learn AI — by reading, sharing,
and doing — plus a live Top AI News feed. Architected with Jarvis's brain (`copilot:claude-opus-4.8`).
Everything here is honest (no invented clients/numbers), buildable on the flat static site (light
theme, Geist, indigo `#3b5bdb`), with no backend except one clearly-optional feature.*

---

## The one idea: READ → SHARE → DO → (convert)

Every AI topic on the site can be **read** (a plain lesson), **saved/shared** (a reference article
or an opinion post), and **practiced hands-on** (an interactive exercise). A visitor flows: read a
lesson → keep the matching article → do the exercise → and, only after real value, meet an honest
"work with us" invite. That single loop makes the guide, knowledge base, blog, training, and news
feel like **one product**, not five bolted-on pages.

**"Ultimate value" =** for founders/small businesses, the confidence and concrete skill to put AI
to work *safely this week*; for investors, a fast, honest way to judge whether an AI approach is
real and defensible.

---

## The five content surfaces (each its own top-menu item)

| # | Menu item | URL | Its job | Read/Share/Do | Status |
|---|---|---|---|---|---|
| 1 | **Learn AI** | `/guide/` | Beginner lessons, plain English | READ | Live (2 of 8 lessons) |
| 2 | **Knowledge Base** | `/kb/` | Durable, searchable reference | SHARE | Live (8 articles, filter) |
| 3 | **Field Notes** | `/blog/` | Honest opinion & practitioner notes | SHARE | Live |
| 4 | **Training** | `/learn/` | Hands-on interactive practice | DO | Designed (build next) |
| 5 | **News** | `/news/` | Top AI news, auto-updated | (stay current) | Designed (build next) |

These are **separate menu items** (operator directive). See Navigation below for how they sit in
the bar without crowding it.

---

## Shared categories (one taxonomy governs everything)

Every lesson, article, and exercise files under **exactly one** track, so all five surfaces line up:

| Track | Lesson (Learn AI) | Article (KB/Blog) | Exercise (Training) |
|---|---|---|---|
| **Getting Started** | What AI is ✅ | AI for small business ✅ | Prompt Builder intro |
| **Building & Owning** | Your first 15 minutes ✅ | How to use Claude ✅ | Prompt Builder (spine) |
| **Measuring AI** | Is your AI actually working? *(to write)* | Measure AI ROI ✅ | Fix-the-Prompt + grader |
| **Compliance & Governance** | AI you can trust *(to write)* | Governance cluster ✅ | Constraint drill |
| **For Investors** | Reading AI claims without hype *(to write)* | Dealflow / eval articles ✅ | "Evaluate the claim" quiz |

The `/kb/` topic filter and the `/learn/` track labels use the **identical** category names.

---

## Surface 4 — Interactive Training (`/learn/`)

Honest "learn by doing" on a no-backend site, built from client-side vanilla JS. Every piece of
feedback is something the visitor can see and trust — never a faked AI answer.

**Core exercises (build order):**
1. **Prompt Builder** *(the spine)* — fill guided fields (role, task, context, constraints,
   format, tone) → a real, copy-ready prompt assembles live + a transparent checklist of what's
   present/missing. *Only assembles your words; never fakes output.*
2. **Fix-the-Prompt** — improve a weak prompt, then reveal a curated stronger version + why
   (labeled "curated by DPR, not an AI response").
3. **Transparent Prompt Grader** — runs your prompt against **visible rules** (has role? context?
   constraints? format?) — a checklist result, explicitly *not* an AI score.
4. Context-layering drill · Constraint composer · Iteration lab · Spot-the-ambiguity quiz.
5. **Optional "Live Sandbox" (bring-your-own-key)** — the *only* server-touching feature, off by
   default: you paste your *own* AI key, the browser calls the provider directly, the key never
   touches DPR (there is no DPR server). Clearly labeled; a "Delete key" button wipes it.

**Reward:** localStorage progress + an **exportable Prompt Library** (save your best prompts,
download them). No fake scores, no streak-guilt, no badges for nothing.

**Rollout:** Phase A Prompt Builder → Phase B practice exercises → Phase C optional sandbox.
**First deliverable:** a single `/learn/` page with the Prompt Builder + checklist + Save-to-Library.

---

## Surface 5 — Top AI News (`/news/`) + the auto-agent

**The page:** static HTML that renders from a committed `news.json`. Header ("Top AI News" +
"Last updated" timestamp), topic filter chips (All · Research · Models · Policy · Business · Tools
· Safety · Open Source), a newest-first feed of cards. Each card: headline (links to source),
source name, date, a **faithful 1–2 line summary**, a prominent "Read at source →" link, a topic
tag, and an "Opinion" badge when relevant. Light/indigo brand. No live fetch on the page.

**Credible sources (RSS/API only — the honest, no-backend path):**
- **AI labs:** OpenAI, Google DeepMind (RSS); Anthropic, Meta AI (auto-discover feed, else skip —
  never fake a URL).
- **Tech press:** The Verge (AI feed), TechCrunch (AI feed), Ars Technica, MIT Technology Review.
- **Research/aggregators:** arXiv (`cs.AI`/`cs.LG`/`cs.CL` RSS + API), Hacker News (official API +
  Algolia search).

**The agent (a scheduled job *outside* the page — GitHub Actions cron, every ~3h):**
`fetch → dedupe (normalized-URL + title-similarity) → rank (credibility 0.35 + recency 0.35 +
importance 0.30) → faithful extractive summary → honesty gate → write news.json + regenerate
/news/ → commit + push to main (auto-deploys)`. Idempotent; skips empty runs.

**Honesty gate (rejects before publishing):** no working source link → drop; source not on the
credible allowlist → drop; a number/quote in the summary not in the source → drop; hype/clickbait
→ drop; duplicate → collapse into one. Opinion is kept but **badged**, never faked.

**News feeds the flywheel:** each item can carry curated cross-links into `/kb/`, `/guide/`, and
`/learn/` (e.g. a model-release story → the matching KB glossary + a Learn exercise).

**First deliverable:** a static `/news/` page from a **hand-seeded** `news.json` (5–10 real,
hand-picked stories) — proves the layout + schema before any automation is wired.

---

## Navigation (separate menu items)

Each surface is its own destination. The full site nav:

- **Business:** How it works · Case studies · Teardowns · Investors · About
- **Learn:** Learn AI · Knowledge Base · Field Notes · Training · News

That's a lot for one row. Recommended: keep the business links in the top bar and group the five
learning surfaces under a **"Learn" menu** (a dropdown/mega-menu) where **each appears as its own
item** — honoring "separate menu items" while keeping the bar clean. (If you'd rather have all five
as flat top-level links, we can do that instead.) A **Footer** lists all surfaces on every page,
and every lesson/article/post ends with three inline links: **keep this** (`/kb/`), **go deeper**
(`/guide/`/`/blog/`), **try it** (`/learn/`) — plus a "Related news" strip where it fits.

---

## The production engine (how every piece gets made)

1. **Pick the topic** from real audience questions.
2. **Validate real demand** — Google autocomplete + Google Trends (already in use). Ships only if
   there's genuine search demand *and* DPR can answer it truthfully. Interest is direction, never a
   published statistic.
3. **File under one track** (Section above) so its lesson + article + exercise are planned together.
4. **Create** — lesson (for beginners), KB article (durable reference), blog post (honest opinion),
   or `/learn/` exercise (client-side, transparent feedback).
5. **Honesty/quality gate (must pass):** no invented clients/numbers/testimonials; investor content
   carries the disclaimer stack; no backend dependency (except the optional sandbox); every claim
   sourced or cut; links to at least one other surface so nothing is orphaned.
6. **Graphics** via the local **ComfyUI** pipeline to a shared spec (white + indigo `#3b5bdb`),
   with alt text. **Status: 15 training illustrations already generated** and on-brand.
7. **Cadence:** one track cycle at a time (a lesson/article + a note + an exercise), reviewed
   against the gate before publish.

---

## Honest value measurement (no vanity metrics)

- **Skill signals:** exercises/quizzes completed (stored locally, not surveilled) and prompts
  saved/exported — real "do" value.
- **Usefulness signals:** which honest topics people seek (from the demand-validation tooling) —
  used to guide topics, never published as inflated numbers.
- **Conversion, honestly:** clearly-labeled CTAs *after* value is delivered. No fake scarcity,
  forced signups, countdowns, or invented social proof. If a number isn't truly known, it stays
  UNKNOWN rather than invented.

---

## Phased roadmap

- **Phase 0 — today (live):** `/guide/` (2 lessons), `/kb/` (8 articles + filter), `/blog/`.
- **Phase 1 — Unify + nav:** shared taxonomy across guide/KB/blog, the read→share→do cross-links,
  and expand the menu (separate items / Learn menu). *The single best NEXT step.*
- **Phase 2 — Training spine:** build `/learn/` Prompt Builder + localStorage progress + the first
  ComfyUI graphics; link it from every matching lesson/article.
- **Phase 3 — News page:** static `/news/` from a hand-seeded `news.json` (proves the contract).
- **Phase 4 — Practice depth:** Fix-the-Prompt + grader, context/constraint/iteration drills,
  quizzes, exportable Prompt Library.
- **Phase 5 — Automate news:** the scheduled agent (GitHub Actions, every ~3h) writing `news.json`.
- **Phase 6 — Fill the tracks + optional sandbox:** the planned lessons paired with KB + exercises;
  the optional BYOK Live Sandbox.

---

## Honesty rules carried across everything

No invented clients, numbers, testimonials, or "breaking" hype. Every news item links to its real
source with a faithful summary. Investor content ships the disclaimer stack. Illustrations are
labeled where they depict rather than prove. If we can't defend it, it doesn't ship.

---

## Sources

- Content architecture + roadmap: Jarvis `dpr_master_plan` (copilot:claude-opus-4.8).
- Interactive training design: Jarvis `dpr_training_center`.
- News section + agent design: Jarvis `dpr_news_agent`.
- Demand validation: Google autocomplete + Google Trends (run this session).
- Graphics: local ComfyUI (FLUX), 15 assets generated to `assets/learn/`.
