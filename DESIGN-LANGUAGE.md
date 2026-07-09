# DPR AI — Design Language (Phase 1: Audit & Unified System)

**Direction C — "Living System."** Owner: `ux-ui-designer`. Status: **design language locked**; build is later phases.
This is the single authoritative reference. The system lives in **`tokens.css`**; a rendered proof lives in **`design-language.html`**; contrast is machine-verified in **`artifacts/color_science.py`**.

Mood: *engineered instrument · confident-dark · hairline-precision.* The site must look **bespoke and human-designed** — the opposite of generic AI slop. No glow orbs, no neon mesh, no particle fields, no rainbow gradients, no glassmorphism.

---

## 1. Audit — what is inconsistent / cheap / broken (verified, file:line)

| # | Problem | Evidence (file:line) | Verdict |
|---|---------|----------------------|---------|
| 1 | **Two competing type systems loaded on every page** — Fraunces + IBM Plex Sans/Mono *and* Geist + Inter | `index.html:18` & `:21`; `about/contact/jarvis/method/proof.html:13,14`; `blog/*.html:16,17` — 11 pages load both | Purge one. |
| 2 | **Token file used a 3rd, different display font** (Geist), matching neither the authoritative direction nor a purge target | old `tokens.css` `--font-display: 'Geist'` | Replaced → Space Grotesk. |
| 3 | **Teal-glow palette = the "glowing-teal" cliché** the owner named | old `tokens.css` `--primitive-color-teal-signal:#22D3EE`, `--*-teal-glow*` | Replaced → warm amber/orange. |
| 4 | **Particle field ("Interstellar", 4,200–11,000 pts, additive glow)** | `particles.js:1-3`; loaded `index.html:804` | Kill. |
| 5 | **Second particle engine + "marine snow" + glow blobs** | `bg.js:3,71,82,152`; loaded by dead `index.new.html` | Kill. |
| 6 | **Glowing-teal conduit + glow washes in hero** | `hero.css:51,56,60,75,79,87,115-116` | Redesign hero. |
| 7 | **Glow / orb / cursor-glow decoration** | `script.js:14,27-28,83-90`; `agents-anim.js` glowDot×many; `reasoning.js:239`; `scrollbar.css:3` | Strip. |
| 8 | **Raw hex hardcoded in component CSS** (breaks token discipline) | `hero.css:12-19` (`--h-abyss:#07090D` … `--h-teal:#2DD4BF`) | Token-only rebuild. |
| 9 | **Bouncy/overshoot easing** vs "no bounce" rule | old `--h-ease-out`/`--primitive-ease-overshoot` | Replaced → decelerate ease. |
| 10 | **CSS sprawl** — 7 sheets on home, 3 on inner, 4 on blog | `index.html:23-30`; inner `:16-19`; `blog/*:19-23` | Consolidate. |
| 11 | **Dead 63 KB `styles.css`**, referenced only by a backup | `index.cream-backup.html:20` (sole ref) | Delete. |
| 12 | **Dead alt pages + backups** | `index.new.html`, `index.cream-backup.html`, `bg.js.bak`, `mesh-hero.js.bak` | Delete. |
| 13 | **"Bad layout": stacked full-width centered text bands**, hierarchy faked by coloring line 2 teal | `method.html` (every section); see `artifacts/phase1-audit/before-method-desktop.png` | Recompose. |

**Keep the substance** (content is honest and good): hero, mesh-reasoning + workspace demos, 4-step method, offer + guarantee scorecard, anonymized proof card, FAQ, the honest "305 files in one real run" and "a few pilots so far" framing. Redesign the **skin**, not the truth.

---

## 2. Type system (ONE system — hierarchy from size/weight/tracking/opacity, never family swaps)

- **Display / headings** — `Space Grotesk` (400–700). Tight tracking (`--ls-display -0.028em`). Oversized, top-left anchored hero (`--fs-display` fluid 40→76px).
- **Body / UI / figures** — `Inter` (300–800). **Global `tabular-nums`** so every figure aligns.
- **Mono — code / config / IDs / timestamps ONLY** — `JetBrains Mono`. **Never** prices, %, counters, labels, headings.
- Scale (Major-third 1.25): `13 · 14 · 16 · 20 · 25 · 31 · 39 · 49 · 61` → tokens `--fs-2xs … --fs-4xl`, fluid `--fs-display/-h1/-h2`.
- **Load once (replace both old links):**
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300..800&family=JetBrains+Mono:wght@400;500;700&display=swap">
  ```

---

## 3. Colour system (graphite canvas + ONE reserved warm accent — all AA-verified)

Ratios below are **computed** on the delivered hex by `artifacts/color_science.py` (run it to reproduce).

| Token | Hex | OKLCH | On canvas #0F1115 | Use |
|-------|-----|-------|-------------------|-----|
| `--color-bg` | `#0F1115` | 17.7% .008 264 | — | page canvas |
| `--color-bg-sunken` | `#0A0C0F` | 15.4% .007 264 | — | footer / wells |
| `--color-surface` | `#16181D` | 21.0% .010 264 | — | raised panel |
| `--color-surface-high` | `#1F2228` | 25.3% .012 261 | — | hover / highest |
| `--color-hairline` | `#2D3239` | 31.4% .015 258 | 1.46:1 | **decorative** 1px rules |
| `--color-border-ui` | `#5F6977` | 51.7% .025 258 | **3.39:1** | interactive control edge |
| `--color-text-primary` | `#F2F5F7` | 96.8% .004 248 | **17.26:1** | headings + body |
| `--color-text-secondary` | `#AEB6C2` | 77.4% .019 255 | **9.26:1** | sub-copy |
| `--color-text-tertiary` | `#818C9C` | 63.7% .027 258 | **5.56:1** | captions / meta |
| `--color-text-faint` | `#606976` | 51.8% .023 258 | **3.41:1** | disabled (non-essential) |
| **`--color-accent`** (amber) | `#F6A328` | 78.0% .158 71 | **9.20:1** | the number + one active state |
| `--color-accent-strong` / `--color-focus` | `#FBC14B` | 84.3% .146 81 | **11.53:1** | hover / **focus ring** |
| `--color-accent-2` (orange) | `#EA6A2A` | 67.1% .175 44 | **5.92:1** | single jolt / gradient far-stop |
| `--color-danger` | `#E5484D` | — | icon+text | errors (never colour alone) |

On amber fill: ink `--color-text-on-accent #1D140C` = **8.82:1** (button labels). Amber-ink `#DF830C` on surface = **6.25:1** (amber body text on panels).

**Rules:** one reserved accent (the amber family) — spend it on *the number* and a single active/focus state, nowhere decorative. Depth from **value + light** and 1px hairlines — never drop-shadow stacks or glass. Fine SVG grain (`--p-noise`, ~3.5%) may sit over flats to avoid the AI-flat look; never a gradient blur. Dark is the one canonical mode (blog included), matching "confident-dark."

---

## 4. Spacing · radius · elevation · motion

- **Spacing** — 4px base / 8px rhythm, t-shirt tokens `--space-3xs(2) … --space-5xl(128)` + fluid `--space-section` (64→136px) for roomy vertical rhythm. Legacy `--space-1…12` aliases retained only until the refactor.
- **Radius** — restrained/crisp: `xs 2 · sm 4 · md 8 · lg 14 · pill`. The instrument surface uses `lg`.
- **Elevation** — `--elevation-hairline` (inset top-light), `--elevation-panel`, and a single soft `--elevation-focal` reserved for the ONE focal instrument. No card-shadow stacks.
- **Motion** — durations `micro 150 · base 300 · slow 500 · choreo 800`ms; eases `--ease-out` (decelerate, enter), `--ease-in` (exit), `--ease` (standard). **No bounce/overshoot.** Every animation (hero, count-ups, scroll choreography) MUST collapse to a clean static final state under `prefers-reduced-motion` — global guard is already in `tokens.css`.

---

## 5. Composition (house rules — fixes "bad layout / cheap / basic")

- **One zone dominates** each screen (≥60% of attention). Strip all chrome and the hierarchy must still read.
- **Forbidden:** symmetric equal-card bento; cockpit top+left+right+footer rails; cards-in-cards; stacked full-width centered text bands.
- **Editorial asymmetry** (per Linear reference): a compact left text column (~340–480px) paired with a much larger living product artifact (`--layout-rail 62%`). Oversized top-left hero, vast negative space below the fold.
- Grid: content `--layout-maxw 1200px`, instrument/full-bleed `--layout-wide 1344px`, inset `--layout-gutter`, fixed slim nav `--layout-nav-h 72px`.

---

## 6. Shared nav + footer (build ONCE, reuse on every page)

- **Nav** (72px, `--color-bg` @ ~0.72 + hairline bottom): brand ("DPR AI") · links (How it works · Proof · Built on Jarvis · Field Notes · About) · one amber primary CTA "Book a call" (44px min target, **no glow pill**). Mobile: disclosure menu — **Esc closes, focus restored to trigger**, `aria-expanded` toggled.
- **Footer** (`--color-bg-sunken`): columns Studio · Field Notes · Get Started · honest one-liner. Same tokens, hairline top rule.

---

## 7. Component state model (every interactive component ships these)

`default · hover · focus-visible · active · disabled · loading(skeleton) · empty · error`. Each state names: visual change · token · ARIA change · transition. Focus-visible = `2px solid --color-focus`, `3px` offset (never removed). Empty states get illustration + copy + CTA (never a blank container). Errors get copy + retry/dismiss, `role="alert"`, and are never signalled by colour alone.

---

## 8. Directives for the next phases

**refactorer (mechanical only — no aesthetic decisions):**
1. Delete dead files: `styles.css`, `index.cream-backup.html`, `index.new.html`, `bg.js`, `bg.js.bak`, `mesh-hero.js`, `mesh-hero.js.bak`, `particles.js`.
2. Remove the particle `<canvas id="particles">` + its `<script>` from `index.html`.
3. Replace the two `<head>` font links on all 11 pages with the single link in §2.
4. Consolidate the 7 sprawl stylesheets into **one** components stylesheet that `@import`s `tokens.css`; every page then loads exactly `tokens.css` + that one sheet. Delete all dead rules and all raw-hex/`--h-*` locals; reference tokens only.
5. Reconcile the **unlinked** prior-tooling build output `design/dist/tokens.css` (a separate Style-Dictionary pipeline, referenced by no page) — either regenerate it from the root `tokens.css` or remove it so there is one token source on disk, not two.

**frontend (owns the premium look) + design-engineer (support):**
- Build order: `index → method → contact → proof → blog index → post template → jarvis → about`, reusing ONE nav + ONE footer.
- Rebuild the **living-system hero + mesh/workspace instrument** as the dominant zone: real streaming steps, real IDs/timestamps (mono), inspectable artifacts, run/replay/step controls, a `prefers-reduced-motion` static poster, and one anchored pilot CTA. Data-real and hairline-detailed — an instrument, not a lava lamp.
- No token may be bypassed: no raw hex, no magic px, no font outside the set. If a value is missing, add the token to `tokens.css` first.

**final proof gate (later phase):** before/after screenshots every page (desktop+mobile), Lighthouse ≥90 perf / 100 a11y + axe on home + one inner, reduced-motion + keyboard evidence, content-honesty check.

---

## 9. Phase-1 proof artifacts

- `tokens.css` — the single unified token system (this design language, in code).
- `design-language.html` — rendered styleguide; live proof the tokens resolve (accent `#F6A328`, focus `#FBC14B`, display `Space Grotesk`).
- `artifacts/color_science.py` — WCAG contrast + OKLCH derivation (all pairs PASS).
- `artifacts/phase1-audit/` — before (current slop) + after (design language) screenshots, desktop + mobile.
