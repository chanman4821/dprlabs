# Deeper (DPR AI) — Sitemap / Information Architecture

*Source: Jarvis decision brain (`acp:claude-opus-4.8`, high-effort). Build reference.*

## Pages

| Path | Name | In nav | Purpose | Primary CTA |
|---|---|---|---|---|
| `/index.html` | Home | yes | One-scroll pitch: offer + one honest number + guarantee + real proof card + Built-on-Jarvis + Field Notes teaser + contact | Book a 30-min pilot-scoping call |
| `/method.html` | How it works | yes | Pilot method in depth: the one-number principle, week-by-week timeline, open measurement, ownership/handover, when we say no | Scope your pilot |
| `/proof.html` | Proof | yes | Honest evidence: real anonymized pilot scorecards (number + baseline + method + limits), verifiable founder links | Discuss a similar pilot |
| `/jarvis.html` | Built on Jarvis | yes | Differentiator shown truthfully: the 5 mesh roles + a real dated run snapshot + honest limits | See it on your pilot |
| `/about.html` | About | yes | Senior small-studio credibility: real founders + verifiable links, honesty principles | Talk to us |
| `/blog/index.html` | Field Notes | yes | Blog index across 5 pillars, filter by pillar | Read the latest post |
| `/contact.html` | Contact | yes | Single conversion endpoint: book a call + real email + good-fit/not-a-fit qualifier | Book a 30-min call |
| `/blog/{slug}.html` | Field Note (template) | no | Single post: title + pillar tag + date, body, related, pilot CTA | Book a 30-min call |

## Global nav
How it works · Proof · Built on Jarvis · Field Notes · About · Contact

## Footer groups
- **Studio:** How it works, Proof, Built on Jarvis, About
- **Field Notes:** All posts + the 5 pillars
- **Get started:** Book a scoping call, Contact, Email us
- **Trust:** Our honesty principles, The guarantee, Founder links

## Blog
- Index: `/blog/index.html`; posts: `/blog/{slug}.html` (lowercase hyphenated slugs)
- Pillars: Pilot method & honest measurement · Automating the boring · Honest AI (limits & failure modes) · Own it / no lock-in · Security & your data
- First posts:
  1. The one honest number: how we pick the single metric a pilot must move
  2. Agree the number first: why our guarantee is structured no-move-no-pay
  3. What we won't promise: failure modes we tell clients about up front
  4. You own it: how we hand over infra, repo, and the measurement method
  5. Your data stays yours: how we scope a pilot without becoming a lock-in

## URL conventions
Flat static `.html` at root for core pages; blog under `/blog/`. No trailing-slash dirs, no query strings. Keep `/index.html` so inbound links don't break.

## Notes / do-not-build
- Replace `/index.html` content, not its path.
- 301 old blog slugs → new `/blog/{slug}.html` if scheme changed.
- Do NOT build Pricing, Careers, Case-Studies (logo wall), or Testimonials — no honest content yet; proof lives on `/proof.html`.
- Services folded into `/method.html` (one offer, not a menu).
- Add footer privacy/legal note once data handling finalized (not a launch blocker).

## Build priority order
1. `/index.html`
2. `/method.html`
3. `/contact.html`
4. `/proof.html`
5. `/blog/index.html`
6. `/blog/{slug}.html` (post template)
7. `/jarvis.html`
8. `/about.html`
