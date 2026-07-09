# DPR AI — Design Language (Phase 1, unified token system)

Owner: `design-token-mgr`. This is the written design language for the redesign.
It defines the ONE token system every page uses. Later phases (ux-ui-designer,
frontend, design-engineer) build the look and the pages **on top of these tokens**.
Do not invent colors, font sizes, or spacing outside this file.

The source of truth is `design/tokens/*.json` (W3C DTCG). Style Dictionary builds it
into one CSS file: `design/dist/tokens.css`. Rebuild with `npm run build` inside `design/`.

---

## How to use it

1. Load Space Grotesk + Inter + JetBrains Mono once (see MIGRATION.md for the exact tag).
2. Link ONE token file: `design/dist/tokens.css`. Nothing else defines colors, type, or spacing.
3. Dark is the default. For a light reading area (e.g. blog), set `data-theme="light"` on a wrapper.
4. Use the CSS variables. Never hardcode a hex, a px font size, or a font family in a page or component.

```css
/* good */   color: var(--color-text-primary); background: var(--color-bg);
/* banned */ color: #F4F0EB;  font-family: 'Geist';  font-size: 44px;
```

---

## Three tiers (one direction only)

```
palette (primitive, raw values)  ->  color roles (semantic)  ->  component tokens
   --palette-amber-500                 --color-accent              --button-primary-bg
```

- **Palette** = raw values. The only place a hex lives. Never use `--palette-*` directly in a page.
- **Color roles** = what a color means (`--color-bg`, `--color-text-primary`, `--color-accent`). Use these.
- **Component tokens** = per-part values (`--card-bg`, `--input-border`). They point at color roles, so they
  flip with the theme automatically.

The lint (`npm run lint`) fails the build if any semantic/component token inlines a raw value or points
the wrong way. The contrast audit (`npm run contrast`) fails if any text/UI pair drops below WCAG 2.2 AA.

---

## Color

Warm, dark, expensive-restraint. Near-black warm canvas, ONE reserved brand accent (amber) plus
ONE cool complementary accent (slate-blue) for secondary emphasis and data. All brand values below
come from the DPR AI brief (Direction B) and are fixed.

| Role | Token | Dark | Light |
| --- | --- | --- | --- |
| Canvas | `--color-bg` | `#131210` (hsl 30 9% 7%) | warm paper `#FAF8F5` |
| Surface / raised | `--color-surface` / `--color-surface-raised` | `#1C1A17` (30 8% 10%) / `#24211E` (28 8% 13%) | `#FDFDFB` |
| Text primary / secondary / tertiary | `--color-text-primary/-secondary/-tertiary` | `#F1EEE9` / `#C5BDB5` / `#A79F95` | dark inks |
| Hairline / strong / interactive border | `--color-border` / `--color-border-strong` / `--color-border-interactive` | warm grays | paper grays |
| **Accent (amber, primary)** | `--color-accent` | `#EFA22E` (hsl 36 86% 56%) | same fill |
| **Accent (slate, cool secondary)** | `--color-accent-secondary` / `--color-accent-cool` | `#8FA7B7` (hsl 205 22% 64%) | dark slate `#405A6D` (text) / same chip |
| The one honest number | `--color-number` | `#EFA22E` | `#955B04` |

**Two amber roles — do not mix them up:**
- `--color-accent` is a **fill**. Put `--color-text-on-accent` (dark `#1D140C`) on top of it. Buttons, chips.
- `--color-accent-text` / `--color-number` / `--color-link` / `--color-focus` are amber used as **text,
  icons, hairlines, or the number** directly on the page. In light mode they darken to `#955B04` so they
  stay readable on paper. Never draw amber text with `--color-accent`.

**Cool slate accent (the reserved secondary):** `#8FA7B7` (hsl 205 22% 64%) is the complementary cool
tone — use `--color-accent-secondary` for slate text/graphics on the dark canvas (flips to `#405A6D` on
paper), and `--color-accent-cool` as a slate chip/hover fill with `--color-text-on-accent-cool` (`#17232C`)
text. It exists to balance the warm amber without a second warm hue; keep it restrained.

**Status (functional only, never brand):** `--color-status-positive` (green), `--color-status-critical`
(red), `--color-status-attention` (= the amber, for "awaiting a decision"), and `--color-danger` (dark-red
destructive fill with `--color-text-on-danger`). Each status has a text tone and a `-ui` tone for graphics.
**Never rely on color alone** — pair it with an icon, label, or shape.

**shadcn/ui components** consume the same palette via HSL-triplet aliases (`hsl(var(--primary))`,
`hsl(var(--background))`, `hsl(var(--accent))`, `--ring`, `--destructive`, …). Those variables are emitted
in the same `tokens.css` and are asserted at build time to equal the DTCG primitives they mirror — so
shadcn and the hand-written `--color-*` roles can never drift.

**Banned (brand rule):** teal/cyan glow, neon gradient mesh, glowing orbs, particle fields, rainbow
gradients. There are no glow tokens. Depth comes from surface value + a 1px hairline, not stacked shadows
or glassmorphism.

---

## Type

One family per job. Hierarchy comes from **size + weight + tracking + opacity — never from swapping fonts.**

- Display / headings / eyebrows: **Space Grotesk** — `var(--font-display)`
- Body / UI / **all figures** (prices, %, counters): **Inter** — `var(--font-body)`
- Code / config / IDs **only**: **JetBrains Mono** — `var(--font-mono)`. Never use mono for prices,
  percentages, counters, labels, or headings.
- Every figure uses tabular numbers. Apply `font-variant-numeric: var(--font-numeric)` on the root.

Fluid scale (clamp-based, so it scales with the viewport): `--fs-caption` `--fs-small` `--fs-body`
`--fs-lead` `--fs-h5` `--fs-h4` `--fs-h3` `--fs-h2` `--fs-h1` `--fs-display`.
Weights: `--fw-regular/medium/semibold/bold`. Line-height: `--lh-tight/heading/snug/lead/body/mono`.
Tracking: `--ls-display/heading/body/label/mono`.

---

## Space, radius, elevation

- Spacing is on an 8px base: `--space-2` = 8px, `--space-4` = 16px, `--space-6` = 32px, and so on, with
  `--space-hair` (1px) and `--space-2xs` (2px) for hairline detail.
- Radius is restrained: `--radius-sm/md/lg/xl` (4-16px) and `--radius-pill`.
- Elevation is subtle: `--shadow-sm/md/lg` for menus and modals only. Cards get depth from surface value
  and a hairline, not from shadow stacks.

---

## Motion

Slow, purposeful, eased. No bounce, no gratuitous parallax.

- Durations: `--dur-instant` (80ms) `--dur-fast` (160ms) `--dur-base` (280ms) `--dur-slow` (480ms)
  `--dur-cinematic` (800ms).
- Easing: `--ease-standard`, `--ease-entrance`, `--ease-exit`, `--ease-linear`. None overshoot.
- **Reduced motion:** the token file already collapses every duration to ~0 under
  `@media (prefers-reduced-motion: reduce)`. Any transition using `--dur-*` becomes instant automatically.
  JS-driven animation (the living-system hero, count-ups) must still check the media query and jump to its
  final static state.

---

## Accessibility floor (built in)

- Body text and the number: contrast >= 4.5:1. Large text, UI, focus rings, interactive borders: >= 3:1.
  Verified in both modes by `npm run contrast` (42 pairings, all pass).
- Focus ring: `--focus-ring-color` (amber), `--focus-ring-width` (2px), `--focus-ring-offset` (2px). Always visible.
- Never use color as the only signal. Keep semantic HTML and one H1 per page (page phase).
