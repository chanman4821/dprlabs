# DPR Labs — Sitemap / Information Architecture (refreshed)

*Refreshed from the original `/SITEMAP.md`. Grounded in the pages that are actually built
today (`index.html`, `method.html`, `proof.html`, `jarvis.html`, `about.html`,
`contact.html`, `blog/`) and in `LANDING-PAGE-PLAN.md` and `DESIGN-AND-BLOG-PLAN.md`.*

*This file is the plan of record for structure and navigation. It does not change any live
HTML. Page copy lives in `content/pages/`.*

---

## What changed from the original sitemap

- Brand is now **DPR Labs** everywhere (the old file said "Deeper (DPR Labs)"). The site
  has fully moved off "Deeper".
- Purposes and CTAs are rewritten to match the pages as built, not as first planned.
- Blog slugs now list the **three posts that actually exist**, not the originally planned
  set of five.
- Added a **Services & offerings map** so the four offerings (two-week pilot, agentic AI
  builds, investor intros, product shipping) have a clear home without adding a menu page.
- Kept the original **one-offer-not-a-menu** rule and the **do-not-build** list.

---

## Pages

| Path | Name (nav) | In nav | Purpose | Primary CTA |
|---|---|---|---|---|
| `/index.html` | Home | yes | One-scroll pitch: the offer, one real run number, the guarantee, an illustration scorecard, how a pilot works, the four offerings, fears answered, Field Notes teaser, contact | Book a 2-week pilot |
| `/method.html` | How it works | yes | The pilot method in depth: the one-number principle, the week-by-week timeline, open measurement, ownership/handover, and when we say no | Book a 2-week pilot |
| `/proof.html` | Proof | yes | Honest evidence: one anonymized pilot scorecard **labelled as an illustration**, how we measure, verifiable-links slot, and what could go wrong | Discuss a pilot |
| `/jarvis.html` | Built on Jarvis | yes | The delivery engine, shown truthfully: the five mesh roles, a real sanitized run snapshot from our own logs, and the honest limits | Book a call |
| `/about.html` | About | yes | Small-senior-studio credibility: why we work this way, who you'll work with (verifiable links, no invented faces), honesty principles | Talk to us |
| `/blog/index.html` | Field Notes | yes | Blog index across five pillars: useful teardowns and honest retros that prove competence without a single invented claim | Read the latest post |
| `/contact.html` | Contact | yes | Single conversion endpoint: book a call, real email, and a plain good-fit / not-yet qualifier | Book a call |
| `/blog/{slug}.html` | Field Note (post) | no | A single post: title, pillar tag, reading time, body, and the shared pilot CTA | Book a 2-week pilot |

## Global nav

How it works · Proof · Built on Jarvis · Field Notes · About — with a persistent
**Book a call** button top-right.

## Footer groups (as built)

- **Studio:** How it works · Proof · How we build (Built on Jarvis) · About
- **Field Notes:** All posts · The one number · No lock-in · The two-week pilot
- **Get started:** Book a scoping call · Email us (`hello@dprlabs.io`)

Footer line on every page: *"Agentic AI that ships, measured by one honest number."*
Footer note: *"© 2026 DPR Labs. Real proof only — we publish how we measure."*

---

## Services & offerings map (one offer, not a menu)

DPR Labs sells **one thing** and helps two more ways after. There is deliberately **no
`/services.html` menu page** — a services menu would fight the "one offer" positioning. The
deeper breakdown lives in `content/pages/services.md` and surfaces on the pages below.

| Offering | Rank | Where it lives on the site | Customer outcome (one line) |
|---|---|---|---|
| Two-week pilot | Entry offer | Home hero + Offer section; whole of `method.html` | In two weeks, a real number tells you whether AI can take one task off your team — at a fixed price, with the code yours to keep either way. |
| Agentic AI builds | Primary | Home "What we do" (primary); `method.html`; `jarvis.html` | A working AI system doing a real job in your production, owned by your team, measured by the number you agreed. |
| Investor intros | Supporting | Home "What we do" (supporting) | Warm, relevant introductions to investors who actually fit your stage and sector — no spray-and-pray. |
| Product shipping | Supporting | Home "What we do" (supporting) | You go from idea to a shipped product, built by the same senior team that runs the pilots. |

---

## Blog — Field Notes

- Index: `/blog/index.html`; posts: `/blog/{slug}.html` (lowercase, hyphenated slugs).
- **Pillars:** Pilot method & honest measurement · Automating the boring · Honest AI
  (limits & failure modes) · Own it / no lock-in · Security & your data.
- **Posts live today (3, all dated 2026-06-24) — canonical titles and reading times, taken
  from the posts themselves:**
  1. `/blog/two-week-pilot.html` — "What a two-week AI pilot actually looks like, day by day" ·
     8 min · pillar: Pilot method & honest measurement
  2. `/blog/the-one-number.html` — "The one number: how we pick the metric that decides a pilot" ·
     6 min · pillar: Pilot method & honest measurement
  3. `/blog/no-lock-in.html` — "No lock-in, on purpose: the setup that lets you fire us" ·
     7 min · pillar: Own it — no lock-in
- **Planned next (shown on `/blog/index.html` as "Coming soon", not yet written):** "How to
  hand off an AI system so your team actually owns it"; "Automating support replies without
  sounding like a robot"; "Invoices, line by line: where AI helps and where it shouldn't";
  "Where document AI quietly fails — and how we catch it"; "A pilot that didn't work, and what
  the number told us"; "Your data, your servers: the security checklist we run first". Write one
  substantial post every two weeks; do not treadmill.

## URL conventions

Flat static `.html` at the root for the core pages; blog under `/blog/`. No trailing-slash
directories, no query strings on content URLs. Keep `/index.html` so inbound links survive.

## Notes / do-not-build

- Replace `/index.html` **content**, never its path.
- If a blog slug ever changes, 301 the old slug to the new `/blog/{slug}.html`.
- Do **NOT** build Pricing, Careers, Case-Studies (a logo wall), or Testimonials — there is
  no honest content for them yet. Proof lives on `/proof.html`; price lives inside the offer.
- Services stay folded into the pages above — **one offer, not a menu**.
- Add a footer privacy/legal note once data-handling terms are finalized (not a launch
  blocker).

## Build / edit priority order

1. `/index.html` 2. `/method.html` 3. `/contact.html` 4. `/proof.html`
5. `/blog/index.html` 6. `/blog/{slug}.html` (posts) 7. `/jarvis.html` 8. `/about.html`
