# 2 · Layout / Wireframe Guide

How pages are built. The site is one wide column (max **1200px**, `--maxw`) with generous white space and quiet hairlines instead of boxes. Sections stack top‑to‑bottom in a deliberate order that walks a visitor from "you have a problem" to "here's proof" to "let's talk."

> **The spine:** grab attention → name the problem → show the method → prove it → make the offer → answer fears → invite a conversation.

## Homepage — section order

| # | Section | Job | Layout pattern |
|---|---------|-----|----------------|
| 1 | Header / nav | Brand + navigation + "Start a build" | Sticky bar, logo left, links centre, two buttons right |
| 2 | Hero (interactive hub) | The promise + the gold robot with 6 spokes | Big headline left‑aligned, robot hub below, two CTAs |
| 3 | Value strip | One‑line proof points | Thin full‑width band of mono phrases split by dots |
| 4 | The state of the industry | "AI slop" — 7 robot kinds | Icon‑left rows, 2 columns → 1 on mobile, multiply animation |
| 5 | AI‑ready self‑check | Qualify the visitor | 4 yes/no questions, live verdict |
| 6 | Guarantee banner | Risk reversal | Big `$0` figure + one bold line |
| 7 | The Owned‑AI Method | How the work runs | Six numbered modules in a grid |
| 8 | Build pipeline | Three checkpoints | Diagram + mascot, one clean card |
| 9 | Build steps | Four honest steps | Numbered step rows with meta on the right |
| 10 | The offer | Scope + price + guarantee | Two‑up: copy left, scorecard card right |
| 11 | Proof | Real before/after | Three stat blocks + "what could go wrong" |
| 12 | Flagship case study | One number moved | Metric band of four figures |
| 13 | What we do | The three businesses + senior | Four cards (2×2) |
| 14 | Manifesto | What we stand on | Dark band, statement + list |
| 15 | FAQ | Kill objections | Accordion, four questions |
| 16 | About | Small senior team | Short lead + members |
| 17 | Field notes | Show thinking | Blog note links |
| 18 | Contact | Convert | Two‑up: pitch left, form right |
| 19 | Footer | Wrap + links | Brand blurb + link columns |

## Reusable section blocks (wireframes in words)

**Section head**
```
[ eyebrow — mono, uppercase, blue or gold ]
[ H2 — Geist 800, tight, one gold word for emphasis ]
[ lead — one clear sentence, muted ]
```
Used at the top of most sections. Keep the H2 to one line where possible.

**Two‑up (copy + object)**
```
┌───────────────┬───────────────┐
│ copy / pitch  │  card / form  │
│ (left)        │  (right)      │
└───────────────┴───────────────┘
```
Used for the offer and contact. Stacks to one column on mobile (copy on top).

**Card grid**
```
┌────────┬────────┐
│ card   │ card   │   2 columns (or 3 for smaller modules)
├────────┼────────┤
│ card   │ card   │   → 1 column on mobile
└────────┴────────┘
```
Cards are quiet: hairline border, `--radius` corners, a mono tag, an H3, a short paragraph, and a text link. No heavy shadows.

**Icon‑left rows** (the "AI slop" pattern)
```
[icon] SLOP 0X
       Name (bold)
       one short tell
```
Small image left, text right. Icons blend into white via `mix-blend-mode:multiply`.

## Rhythm & rules

- **Width:** content max `1200px`; side padding `24px`.
- **Vertical rhythm:** sections breathe — large top/bottom padding, not crammed.
- **Structure without boxes:** use white space and thin `--line` hairlines; avoid card‑in‑card and heavy borders.
- **One dominant thing per screen.** A section has one job; strip anything that doesn't serve it.
- **Emphasis:** build hierarchy with size + weight + one gold word, not with many colours.
- **Dark bands are rare** (only the manifesto) — the brand is white‑first.
- **Mobile:** every multi‑column block collapses to a single clean column; tap targets stay large.

## Do / Don't

**Do:** lead with the answer, keep one accent per view, let it breathe, reuse these blocks.
**Don't:** symmetric 4‑equal‑column bento of rounded cards, cockpit rails, gradients, or gimmicks. Clean beats clever.
