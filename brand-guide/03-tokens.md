# 3 · Token Guide

These are the **design tokens** — the small set of named values everything on the site is built from. They already live in `site.css` under `:root`. Documented here so anyone can reuse them exactly.

> Think of tokens as the brand's Lego bricks: a fixed set of colours, sizes, and spacings. Build only from these and everything stays consistent.

## Colour tokens

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#ffffff` | Page background (the canvas) |
| `--bg-soft` | `#f7f7f8` | Quiet panels, code blocks |
| `--bg-softer` | `#f0f0f2` | Slightly deeper fills |
| `--ink` | `#0a0a0b` | Main text |
| `--ink-2` | `#18181b` | Strong text / headings |
| `--muted` | `#3a3f47` | Secondary text |
| `--faint` | `#767b85` | Captions, meta labels |
| `--line` | `rgba(15,17,20,.09)` | Hairline dividers |
| `--line-2` | `rgba(15,17,20,.15)` | Stronger borders, inputs |
| `--gold` | `#c8912b` | Primary gold accent |
| `--gold-bright` | `#e9c46a` | Gold highlight / on dark |
| `--gold-soft` | `#f7f2e6` | Gold tint background, text selection |
| `--gold-hi` | `#8a6416` | Deep gold text on light |
| `--accent` / `--blue` | `#3b5bdb` | Actions, links, "AI" |
| `--accent-strong` | `#2f49b0` | Hover/pressed blue |
| `--accent-soft` | `#eef1fb` | Blue tint background |

> Note: `--gold-deep` (`#52525b`) is actually a **grey** used for muted mono labels — the name is legacy. Don't use it as a gold.

## Type tokens

| Token | Value |
|-------|-------|
| `--sans` | `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `--mono` | `'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace` |

**Weights in use:** Geist 400 / 500 / 600 / 700 / 800 · Geist Mono 400 / 500 / 600.

**Label pattern:** Geist Mono, ~11–12px, `letter-spacing:.08–.16em`, `text-transform:uppercase`, colour `--faint` or `--accent`.

**Numbers:** the site uses `font-variant-numeric: tabular-nums` so figures line up. Keep prices, percentages and counters in Geist (sans) with tabular numbers — never in mono.

## Layout & shape tokens

| Token | Value | Use |
|-------|-------|-----|
| `--maxw` | `1200px` | Max content width (`.wrap`) |
| `--radius` | `16px` | Default corner radius |
| `.wrap` padding | `0 24px` | Side gutters |
| `:target` offset | `84px` | Anchor scroll offset (sticky header) |

## Shadow tokens

| Token | Value |
|-------|-------|
| `--shadow-1` | `0 1px 2px rgba(10,12,16,.05), 0 1px 1px rgba(10,12,16,.03)` |
| `--shadow-2` | `0 2px 6px rgba(10,12,16,.04), 0 16px 40px rgba(10,12,16,.08)` |

## Motion

- Reveal on scroll: `.reveal → .in` (fade + rise); staggered lists use `[data-stagger] → .is-in`.
- The "AI slop" section: one bot walks in and **multiplies** into the seven, then each keeps a small idle motion.
- **Always** guard motion with `@media (prefers-reduced-motion: reduce)` — the site turns animation off for those users.
