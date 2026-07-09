# DPR AI — Sitemap / Information Architecture (dual-business, dual-audience)

*Refreshed for the dual-business model in `BUSINESS-MODEL.md`: DPR runs **two connected
businesses as one flywheel** — (1) build owned, measured AI across four pillars, sold as retainers
and handed over (no lock-in); (2) connect founders with capital through a compliant flat
subscription (never a cut of a raise; equity only as payment for build work). The site presents
**one flywheel to two audiences** (Founders/Companies and Investors), interactively.*

*Grounded in the pages that are **actually built today** (verified on disk) and in
`BUSINESS-MODEL.md` §9 (lines 225–241, "What dprai.io must now say"). This file is the plan of
record for structure and navigation. It does not change any live HTML; page copy lives in
`content/pages/`.*

---

## What changed in this refresh

- **The home page is now dual-audience.** It answers, at a glance, "get owned AI built as a founder,
  or get vetted AI-validated dealflow as an investor?" and routes each audience to its own track.
- **Added the Investor track to the IA.** `investors.html` (investment matching) and
  `what-investors-screen.html` are now first-class destinations, and `investors.html` joins the
  primary nav so the capital path is reachable site-wide — not only from the home hero.
- **Removed a broken reference.** The previous sitemap listed a "Built on Jarvis" page at
  `jarvis.html`; **no such file exists on disk.** The real, sanitized engine run now lives as data
  (`assets/data/jarvis-run.json`) surfaced on the home page and `proof.html`. No dead link ships.
- **Messaging source of truth is `BUSINESS-MODEL.md`.** The four build pillars each carry their real
  honest number; the capital side stays compliance-honest (subscription, not a cut).
- **Kept** the honesty rules and the do-not-build list.

---

## Pages (built today — paths verified on disk)

| Path | Name (nav) | In nav | Audience | Purpose | Primary CTA |
|---|---|---|---|---|---|
| `/index.html` | Home | yes | Both | One flywheel to two audiences: signature network-flywheel hero, dual-path split, four build pillars with honest numbers, relationship-flywheel/moat story, honest cold-start proof, compliance-honest promise, dual conversion | Get owned AI built · Request dealflow access |
| `/method.html` | How it works | yes | Founder | The build method in depth: one honest number agreed up front, the working timeline, open measurement, ownership/handover, when we say no | Get owned AI built |
| `/case-studies.html` | Case studies | yes | Founder | Honest evidence, cold-start-appropriate: worked examples and any real, cleared engagement — no invented logos | Talk to us |
| `/teardowns.html` | Teardowns | yes | Both | Public "what we're seeing" research/teardowns — the information-not-deals top of the investor funnel and proof of competence | Request dealflow access |
| `/investors.html` | Investors | yes | Investor | The capital side: vetted, AI-validated dealflow + elite network by flat subscription; verified-accredited only; published methodology, disclosed conflicts; never a cut of a raise | Request dealflow access |
| `/what-investors-screen.html` | What investors screen on | no | Investor | Explainer that builds investor trust and helps founders become fundable on the criteria that matter | Request dealflow access |
| `/proof.html` | Proof | no | Both | How we measure honestly; the one-honest-number method; the real sanitized engine run; what could go wrong | Get owned AI built |
| `/about.html` | About | yes | Both | Small-senior-firm credibility: why we work this way, honesty principles, verifiable links (no invented faces) | Talk to us |
| `/blog/index.html` | Field Notes | yes | Both | Blog index: useful teardowns and honest retros that prove competence without a single invented claim | Read the latest post |
| `/contact.html` | Contact | yes (CTA) | Founder | Founder conversion endpoint: scope a build + real email + honest good-fit qualifier | Get owned AI built |
| `/pilot.html` | Book a pilot | yes (CTA) | Founder | Founder scoping conversation for a first paid build | Book a scoping conversation |
| `/blog/{slug}.html` | Field Note (post) | no | Both | A single post: title, pillar tag, reading time, body, and the shared CTA | Get owned AI built |

## Global nav (dual-audience)

**How it works · Case studies · Teardowns · Investors · Field Notes · About** — with persistent
CTAs **Talk to us** (`contact.html`) and **Book a pilot** (`pilot.html`) top-right. The mobile menu
mirrors these links. `investors.html` is the added destination that makes the capital path reachable
from every page.

*Nav as currently built in `index.html` (for the build worker to extend, not fork):* How it works ·
Case studies · Teardowns · Field Notes · About + **Talk to us** / **Book a pilot**. This refresh
**adds Investors** to that set.

## Footer groups (as built — keep; all links resolve)

- **Studio:** How it works (`method.html`) · Proof (`#proof` on home) · About (`#about` on home)
- **Field Notes:** The one number (`blog/the-one-number.html`) · No lock-in (`blog/no-lock-in.html`)
  · Two-week pilot (`blog/two-week-pilot.html`) · All posts (`blog/index.html`)
- **Get started:** Book a scoping call (`#contact`) · Contact (`#contact`) · Email
  (`mailto:hello@dprai.io`)

*Recommended footer additions for the dual-audience site (non-blocking):* an **Investors** link
(`investors.html`) under Get started, and the footer line *"Owned, measured, honest — proof over
theater."*

---

## The dual model on the site (one flywheel, two audiences)

DPR sells **two connected things** and the home page presents them as one loop:

| Side | What the customer gets (one line) | Where it lives | Monetization (compliance-honest) |
|---|---|---|---|
| **Build (Founders/Companies)** | Owned, measured AI wired into your systems, judged on one honest number, handed over — no lock-in | Home hero + pillars + dual-path Track A; `method.html`; `contact.html` / `pilot.html` | Setup fee (LUMPY) + monthly retainer (RECURRING); equity/SAFE only as payment for build work |
| **Capital (Investors)** | Vetted, AI-validated dealflow + elite founder network, verified-accredited, published methodology | Home dual-path Track B; `investors.html`; `what-investors-screen.html`; `teardowns.html` | **Flat recurring subscription only** — never a cut of a raise, never a per-intro success fee |

**The four build pillars** (each with its honest number, from `BUSINESS-MODEL.md` lines 233–236):
AI automation (*time/cost removed per cycle*) · Compliance & governance (*findings closed /
audit-ready*) · Low-code / no-code (*weeks to live / adoption*) · Integration (*one source of
truth*).

**The moat** is the relationship network itself (line 32) — the founder ↔ capital flywheel — kept
clean by the firewall (line 217): DPR does **not** warm-introduce a company it holds equity in to a
paying subscriber.

---

## Blog — Field Notes

- Index: `/blog/index.html`; posts: `/blog/{slug}.html` (lowercase, hyphenated slugs).
- **Pillars:** Build method & honest measurement · Automating the boring · Honest AI (limits &
  failure modes) · Own it / no lock-in · Security & your data · What we're seeing (teardowns — the
  investor-funnel pillar).
- **Posts live today (3, all dated 2026-06-24) — canonical titles and reading times, from the posts
  themselves (verified on disk):**
  1. `/blog/two-week-pilot.html` — "What a two-week AI pilot actually looks like, day by day" · 8 min
  2. `/blog/the-one-number.html` — "The one number: how we pick the metric that decides a pilot" · 6 min
  3. `/blog/no-lock-in.html` — "No lock-in, on purpose: the setup that lets you fire us" · 7 min
- Everything else on `/blog/index.html` marked "Coming soon" must not be linked as if written.

## URL conventions

Flat static `.html` at the root for the core pages; blog under `/blog/`. No trailing-slash
directories, no query strings on content URLs. Keep `/index.html` so inbound links survive.

## Honesty rules (non-negotiable — from `BUSINESS-MODEL.md` and the operator)

- **No invented clients, logos, testimonials, founders, or unverifiable stats.** Ever (line 223).
- **Compliance-honest capital side:** subscription only, never a cut of a raise, never a per-intro
  success fee, no fee timed to a financing event; equity only as payment for build work; the
  disclaimer stack ships wherever deals are shown (lines 22, 97, 215, 223).
- **Illustrations and depictions are labelled as such** — including the real engine run
  (`assets/data/jarvis-run.json`), which is a depiction of DPR's build capability, not a client
  result.
- **Every number traces to a source** we would publish; if we can't defend it, it doesn't ship.

## Notes / do-not-build

- Replace `/index.html` **content**, never its path.
- Do **NOT** build Pricing, Careers, or a Testimonials/logo wall — there is no honest content for
  them yet. Price lives inside the offer; proof lives on `proof.html` and in the honest cold-start
  section of the home page.
- Do **NOT** reference `jarvis.html` — it does not exist. Surface the engine via
  `assets/data/jarvis-run.json` on the home page and `proof.html`.
- Keep **one accent** (amber) and the graphite canvas per the locked design language; the sitemap
  does not override the design tokens (owned by the design-token worker).

## Build / edit priority order (this redesign)

1. `/index.html` (this run — home page only) 2. `/investors.html` 3. `/method.html`
4. `/contact.html` · `/pilot.html` 5. `/proof.html` 6. `/blog/index.html` + posts
7. `/case-studies.html` · `/teardowns.html` 8. `/about.html`
