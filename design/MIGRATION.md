# DPR Labs — Token Migration Map (old systems -> unified tokens)

Owner: `design-token-mgr`. This tells the consolidation/frontend phase exactly what to
delete, what to rename, and what breaks. The new source of truth is `design/dist/tokens.css`.

**Boundary:** this phase (Phase 1) authored the token system and this plan. The edits below
(rewiring pages, deleting dead CSS, stripping banned effects) are executed by the
consolidation (refactorer) and frontend phases. Nothing here was deleted yet.

There are/were **three** clashing systems in the repo. Evidence:
- `tokens.css` (linked): teal/cyan "deep water" palette + glow, Geist/Inter. This is the banned "AI" look.
- `styles.css` (63 KB, **not linked by any live page** — only `index.cream-backup.html`): cream paper + green + Fraunces.
- `hero.css`: hardcodes `'Inter'`/`'Geist'`/`'IBM Plex Sans'` as literal strings (lines 197-430).

Every page also loads **two** font sets at once (e.g. `index.html:18` and `index.html:21`).

---

## Step 1 — Fonts: replace the two links with one

Remove BOTH font `<link>` tags on every page (Fraunces+IBM Plex line AND Geist+Inter line) and use:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300..800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
```

Pages to fix (both links each): `index.html`, `about.html`, `contact.html`, `method.html`,
`proof.html`, `jarvis.html`, `blog/index.html`, `blog/no-lock-in.html`, `blog/the-one-number.html`,
`blog/two-week-pilot.html` (backups `index.new.html`, `index.cream-backup.html` too if kept).

This purges **Fraunces, Geist, Inter-as-a-second-system, and the IBM Plex family** and leaves ONE system: Space Grotesk (display) + Inter (body/UI/figures) + JetBrains Mono (code/IDs only).

## Step 2 — Link one token file

Replace the `tokens.css` link (and eventually the other CSS links) so the page loads
`design/dist/tokens.css` first. Component CSS (`sections.css` etc.) may stay **only if** it
consumes the variables below; it must not define its own colors or fonts.

---

## Step 3 — Codemod: old variable -> new variable

### A. `tokens.css` (linked system) — most role NAMES are kept; the VALUE changes (teal -> amber)

Re-linking the new token file swaps the palette automatically for kept names
(`--color-bg`, `--color-surface`, `--color-text-primary/-secondary/-tertiary`, `--color-border`,
`--color-number`, `--color-focus`, `--color-link`, `--font-display/-body/-mono`, `--lh-*`, `--ls-*`,
`--dur-*`, `--z-*`, `--layout-*`, `--shadow-sm/-md/-lg`). Manual renames:

| Old (tokens.css) | New | Note |
| --- | --- | --- |
| `--color-surface-high` | `--color-surface-raised` | renamed |
| `--color-border-subtle` | `--color-border` | plus new `--color-border-strong`, `--color-border-interactive` |
| `--color-accent` (teal) | `--color-accent` (amber, fill) / `--color-accent-text` (amber, text) | split fill vs text |
| `--color-accent-glow`, `--color-accent-glow-lg` | **REMOVED — banned** | delete the glow; no replacement |
| `--color-btn-primary-bg` | `--button-primary-bg` | |
| `--color-btn-primary-text` | `--button-primary-text` | |
| `--color-btn-primary-hover` | `--button-primary-bg-hover` | |
| `--ease` / `--ease-out` | `--ease-standard` / `--ease-entrance` | |
| `--fs-2xs/-xs/-sm/-md/-lg/-xl/-2xl/-3xl/-4xl` | `--fs-caption/-small/-body/-lead/-h5/-h4/-h3/-h2/-display` | new fluid scale; map by intent |
| `--space-1..15` (2..128px) | `--space-*` (8px base) | map by pixel value |
| `--radius-xs/-sm/-md/-lg/-xl` | `--radius-sm/-md/-lg/-xl` | map by value |

### B. `styles.css` (cream/green, dead) — delete the file; map only if any markup reused its vars

0 references to these vars exist outside `styles.css`, so deletion is safe. Map if reused:

| Old (styles.css) | New |
| --- | --- |
| `--bg` / `--bg-sink` / `--surface` | `--color-bg` / `--color-bg-sunken` / `--color-surface` |
| `--ink` / `--ink-2` / `--label` | `--color-text-primary` / `--color-text-secondary` / `--color-text-tertiary` |
| `--line` / `--line-soft` | `--color-border` / (subtle) `--color-border` |
| `--primary` (green) | **DROP** — no green; use `--color-accent` (amber) |
| `--accent` (#C6913E) | `--color-accent-text` (text) / `--color-accent` (fill) |
| `--amber` | `--color-number` |
| `--on-primary` | `--color-text-on-accent` |
| `--display` (Fraunces) | `--font-display` (Space Grotesk) |
| `--sans` / `--mono` | `--font-body` / `--font-mono` |
| `--fs-display/-h2/-h3/-lead/-body/-sm/-label` | `--fs-display/-h2/-h3/-lead/-body/-small/-caption` |
| `--maxw` / `--gutter` | `--layout-maxw` / `--layout-gutter` |
| `--r-lg/-md/-sm` | `--radius-lg/-md/-sm` |
| `--ease` / `--ease-out` | `--ease-standard` / `--ease-entrance` |

### C. `hero.css` hardcoded fonts (lines 197-430)

| Old literal | New |
| --- | --- |
| `'Inter', ...` / `'IBM Plex Sans', ...` | `var(--font-body)` |
| `'Geist', 'Geist Sans', ...` | `var(--font-display)` |

---

## Step 4 — Delete dead / banned material

- **Dead CSS:** `styles.css` (63 KB, 0 live references). Backups `index.cream-backup.html`,
  `index.new.html` if not needed.
- **Banned "AI-slop" effects to strip** (brand ban: glow orbs, neon mesh, particle fields). Real hits by file:
  `agents-anim.js` (17), `particles.js` (8, whole particle field), `bg.js` (7), `script.js` (7),
  `tokens.css` (7 — the removed glow tokens), `hero.css` (6), `styles.css` (5), `reasoning.js` (2),
  `widgets.js` (2), `hero.js` (1), `scrollbar.css` (1). ~63 total. The living-system hero must be
  rebuilt as an engineered instrument, not a lava lamp.

**Never** silently delete a token that a component still aliases. The only tokens removed **without a
replacement** are the glow tokens (`--color-accent-glow*`) — they are banned, so remove the visual effect
in the same edit, do not repoint it.

---

## Deprecation window

The site had **no git history** and is **not shipped**, so there are no external consumers of the old
names. Do the swap inside this redesign's consolidation phase in one pass, then load the site and confirm
each page renders before removing the old CSS files. Order: link new tokens -> remap vars -> visual check
-> delete dead CSS. Keep the old files in the same commit's history (git) so a revert is one step.
