# DPR Labs — site content (source of truth for copy)

This directory holds the **written content** for the DPR Labs marketing site: full,
section-by-section page copy and a refreshed sitemap. It is the plan-of-record for what each
page **says**. It does **not** change any live `.html` — those stay as they are until a
build worker chooses to wire this copy in.

## What's here

- `SITEMAP.md` — refreshed information architecture and navigation.
- `pages/home.md` — Home (`index.html`)
- `pages/how-it-works.md` — How it works (`method.html`)
- `pages/proof.md` — Proof (`proof.html`)
- `pages/built-on-jarvis.md` — Built on Jarvis (`jarvis.html`)
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
   published Field Notes, a real sanitized run of the Jarvis engine (`jarvis.html`), and the
   published measurement method (`proof.html`) — and never shows an empty "coming soon" stub.
   Real profile links (GitHub, talks) are added later as *extra* proof when they exist.
5. **Vague-but-true beats precise-but-fake.** Where an exact figure cannot be verified, the
   copy uses honest phrasing that is true regardless of the exact count (for example, "a few
   pilots so far"). The exact figure is listed under "Facts to confirm before publishing" so
   the team can drop in a real number when they have one.

## Numbers that are real today (safe to use)

From `assets/data/jarvis-run.json` (a real, sanitized export of the Jarvis mesh run log,
exported 2026-06-30, no client data):

- **305** files changed in one real run
- **60** tasks (dispatches) sampled
- **66,255** seconds of compute (~18.4 hours)

Studio-set offer terms already published on the live site (business terms the team controls,
not performance claims): the **two-week pilot**, the **$8,000–$15,000** price band, the
**~2–4 week** timeline, the **one-business-day** reply, and the **guarantee**
(no move → no fee, and you keep the code).

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
