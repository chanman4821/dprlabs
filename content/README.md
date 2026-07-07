# DPR Labs — site content (source of truth for copy)

This directory holds the **written content** for the DPR Labs marketing site: full,
section-by-section page copy and a refreshed sitemap. It is the plan-of-record for what each
page **says**. It does **not** change any live `.html` — those stay as they are until a
build worker chooses to wire this copy in.

**Messaging source of truth: `../BUSINESS-MODEL.md`.** DPR is now **two connected businesses as
one flywheel** — (1) build owned, measured AI across four pillars, sold as retainers and handed
over (no lock-in); (2) connect founders with capital through a **compliant flat subscription**
(never a cut of a raise; equity only as payment for build work). The home page (`pages/home.md`)
and sitemap (`SITEMAP.md`) in this directory have been refreshed to that **dual-business,
dual-audience** model; the other page specs still reflect the earlier single-offer framing and
should be re-synced to `BUSINESS-MODEL.md` when their pages are next rebuilt.

## What's here

- `SITEMAP.md` — refreshed information architecture and navigation (dual-audience).
- `pages/home.md` — Home (`index.html`) — **dual-business, dual-audience** (Founders + Investors).
- `pages/how-it-works.md` — How it works (`method.html`)
- `pages/proof.md` — Proof (`proof.html`)
- `pages/built-on-jarvis.md` — Built on Jarvis — *note: no `jarvis.html` exists on disk; the real
  sanitized engine run is surfaced as data (`assets/data/jarvis-run.json`) on the home page and
  `proof.html`. Do not link `jarvis.html`.*
- `pages/about.md` — About (`about.html`)
- `pages/contact.md` — Contact (`contact.html`)
- `pages/services.md` — the deeper services & offerings breakdown (feeds Home + How it works)

## How to read a page file

Each page file is laid out **section by section, in page order**. Every section gives:

- **Eyebrow** — the small label above the headline.
- **Headline** — the H1/H2 for that section.
- **Subhead** — the supporting line under the headline (where there is one).
- **Body** — the paragraph(s) of copy.
- **CTA** — the button or link text and where it goes.

At the bottom of each page file is a **"Facts to confirm before publishing"** block. That is
where anything a person must verify or refresh lives (see honesty rules below).

## Honesty rules (non-negotiable — from the plan docs and the operator)

1. **No invented clients, logos, testimonials, founders, or unverifiable stats.** Ever.
2. **Every number traces to a method we would publish.** If we cannot defend a number, it
   does not ship.
3. **Illustrations are labelled as illustrations.** The logistics scorecard
   (11 min → 90 sec, n = 400) is a worked **example of the scorecard shape**, not a claimed
   DPR result. It must always carry the word "illustration".
4. **Founders are shown by verifiable links, not faces or invented bios.** Until real profile
   links are published, the copy anchors credibility to what is **verifiable today** — the
   published Field Notes, a real sanitized run of the Jarvis engine (surfaced as data,
   `assets/data/jarvis-run.json`, on the home page and `proof.html`), and the
   published measurement method (`proof.html`) — and never shows an empty "coming soon" stub.
   Real profile links (GitHub, talks) are added later as *extra* proof when they exist.
5. **Vague-but-true beats precise-but-fake.** Where an exact figure cannot be verified, the
   copy uses honest phrasing that is true regardless of the exact count (for example, "a few
   pilots so far"). The exact figure is listed under "Facts to confirm before publishing" so
   the team can drop in a real number when they have one.
6. **Compliance-honest capital side (non-negotiable).** The capital side monetizes **only** a flat
   recurring subscription — never a percentage of a raise, never a per-intro success fee, and no fee
   is ever triggered by or timed to a financing event. Equity is taken **only** as payment for build
   work. We do not warm-introduce a company DPR holds equity in to a paying subscriber (the
   firewall). The disclaimer stack (*not a broker-dealer, not investment advice, no guaranteed raise,
   investments are speculative, past results don't predict the future*) ships wherever deals appear.
   (`../BUSINESS-MODEL.md` lines 22, 24, 97, 215, 217, 223.)

## Numbers that are real today (safe to use)

From `assets/data/jarvis-run.json` (a real, sanitized export of the Jarvis mesh run log,
exported 2026-06-30, no client data):

- **305** files changed in one real run
- **60** tasks (dispatches) sampled
- **66,255** seconds of compute (~18.4 hours)

Studio-set business terms from `../BUSINESS-MODEL.md` (team-controlled offer terms, **not**
performance claims). The model **launches with three packages** (line 70):

- **Starter** — automation / low-code productized build + monitoring: **$3.5k setup + $1.5k/mo**
  (lines 78).
- **Growth** — custom build wired into your systems, retraining, evals, one honest KPI:
  **$15k setup + $6k/mo** (line 79).
- **Signal (investor tier)** — AI-scored teardowns, published methodology, monthly research memo:
  **$3k/yr (~$250/mo)** (line 105).

The four build pillars each carry a real **honest number** (lines 233–236): AI automation
(*time/cost removed per cycle*), Compliance & governance (*findings closed / audit-ready*),
Low-code / no-code (*weeks to live / adoption*), Integration (*one source of truth*).

Compliance-honest capital framing (lines 22, 97, 215, 223): the capital side is a **flat recurring
subscription only** — never a cut of a raise, never a per-intro success fee, no fee timed to a
financing event; **equity only as payment for build work**; not a broker-dealer; no guaranteed
raise. The **one-business-day** reply promise still holds.

## Blog posts live today (safe to reference — titles and times from the posts)

Three Field Notes are live, all dated **2026-06-24**. Use these canonical titles and reading
times (they are read from the post files, not the home-page teaser, which currently shows two
stale times):

- `blog/two-week-pilot.html` — "What a two-week AI pilot actually looks like, day by day" · 8 min
- `blog/the-one-number.html` — "The one number: how we pick the metric that decides a pilot" · 6 min
- `blog/no-lock-in.html` — "No lock-in, on purpose: the setup that lets you fire us" · 7 min

Everything else on `blog/index.html` is marked "Coming soon" and must not be linked as if it
were written.

## Contact of record

`hello@dprlabs.io` — used site-wide. Reply promise: one business day.
