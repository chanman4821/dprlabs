# DPR AI — Current-Site Audit (Phase 1)

Owner: `ux-ui-designer`. Process step 1 of the redesign: what is concretely inconsistent,
cheap, or broken **right now**, with real file:line evidence. Every line below was found by
grepping the working tree (not asserted from memory). The fix is the unified token system in
this folder — see `DESIGN-LANGUAGE.md` (the language) and `MIGRATION.md` (the codemod).

Method: `grep -n` over `*.html`, `*.css`, `*.js` in the repo root + `blog/`. Counts are raw
match counts per file.

---

## Finding 1 — Every page loads TWO competing font systems at once
Maps to owner's verdict **"too basic / looks cheap"** and non-negotiable **#2 (one type system)**.

Each live page ships a Fraunces + IBM Plex link AND a Geist + Inter link. Two display faces and
two body faces fight on every page; nothing is authoritative.

| Page | Fraunces + IBM Plex | Geist + Inter |
| --- | --- | --- |
| `index.html` | line 18 | line 21 |
| `about.html` | line 13 | line 14 |
| `contact.html` | line 13 | line 14 |
| `method.html` | line 13 | line 14 |
| `proof.html` | line 13 | line 14 |
| `jarvis.html` | line 13 | line 14 |
| `blog/index.html`, `blog/no-lock-in.html`, `blog/the-one-number.html`, `blog/two-week-pilot.html` | Fraunces+Plex link | Geist+Inter link |

`hero.css` then hardcodes `'Inter'`, `'Geist'`, and `'IBM Plex Sans'` as literal font strings
instead of a token, so the family is decided in three different places.

**Fix:** ONE system — Space Grotesk (display) · Inter (body/UI/all figures) · JetBrains Mono
(code/IDs only) — loaded once, referenced only via `--font-display / --font-body / --font-mono`.

---

## Finding 2 — Three clashing colour/CSS systems in one repo
Maps to **"inconsistent execution"** and non-negotiable **#2 (one token file)**.

| System | Where | Palette | Status |
| --- | --- | --- | --- |
| Cool graphite + amber | `tokens.css` (linked by every live page) | `--p-graphite-*`, teal glow remnants | **linked, but wrong palette** |
| Cream paper + green + Fraunces | `styles.css` (63 KB) | `--primary` green, `--accent` `#C6913E` | **dead** — only `index.cream-backup.html:20` links it |
| Warm near-black + amber + slate (new) | `design/dist/tokens.css` | warm `#131210` + amber `#EFA22E` + slate accent `#8FA7B7`, DTCG-built | **the target** — this phase |

The linked `tokens.css` still carries deprecated glow tokens neutralised to `transparent`
(`tokens.css:317` `--color-accent-glow`, `:318` `--color-accent-glow-lg` — "was teal glow" /
"was hero glow"): dead tokens advertising the exact AI cliché the brief bans.

---

## Finding 3 — CSS sprawl: 8 stylesheets, one 64 KB dead file
Maps to **"CSS sprawl → consolidate into ONE"** (brief) and non-negotiable **#2**.

Root CSS by size: `styles.css` 64 KB · `sections.css` 33 KB · `tokens.css` 26 KB ·
`hero.css` 16 KB · `appshell.css` 8.6 KB · `reasoning.css` 8.4 KB · `workspace.css` 7.9 KB ·
`scrollbar.css` 1.5 KB.

`index.html` alone links **seven** of them (lines 23–30: tokens, hero, sections, scrollbar,
appshell, workspace, reasoning). Inner pages link a different subset (tokens + hero + sections),
so no two page types share the same CSS surface.

`styles.css` (the largest file) has **zero** live references — only the unshipped
`index.cream-backup.html:20` uses it. It is safe to delete.

---

## Finding 4 — Token-name + value drift between the two live-ish token files
Maps to **"inconsistent execution"**; this is why a straight re-link is not enough.

The linked `tokens.css` uses t-shirt / graphite names; the new system uses intent / warm names:

| Linked `tokens.css` | New `design/dist/tokens.css` |
| --- | --- |
| `--color-surface-high` (`tokens.css:158`) | `--color-surface-raised` |
| `--color-hairline` (`:162`) | `--color-border` (+ `-strong`, `-interactive`) |
| `--color-accent-strong` (`:177`) | `--color-accent-hover` / `--color-focus` |
| `--layout-nav-h` (`:226`) | `--layout-nav-height` |
| `--fs-xl` / `--fs-2xl` (`:262`/`:263`) | `--fs-h4` / `--fs-h2` (fluid clamp) |
| `--space-2xl` / `--space-5xl` (`:297`/`:300`) | `--space-8` / `--space-12` (8px base) |

`design-language.html` is a third variant again: it hardcodes Space Grotesk + Inter + JetBrains
Mono but links the graphite `tokens.css` and cites cool-gray hex (`#0F1115`) that no longer
matches the warm system. `MIGRATION.md` §3 is the full old→new codemod.

---

## Finding 5 — Banned "AI-slop" effects are still in the code
Maps directly to owner's verdict **"too AI — KILL it"** and non-negotiable **#4**.

Raw hits for `glow|orb|particle|neon|teal|cyan|radial-gradient|floating|confetti`:

| File | Hits | Note |
| --- | --- | --- |
| `agents-anim.js` | 21 | animated agent gl- / float effects |
| `hero.css` | 21 | glow + gradient hero treatment |
| `styles.css` | 16 | dead file, still counts as slop to remove |
| `bg.js` | 11 | background gradient/glow driver |
| `particles.js` | 11 | **entire floating particle field** |
| `tokens.css` | 7 | deprecated glow tokens |
| `sections.css` | 6 | section glow accents |
| `mesh-hero.js` | 6 | mesh/glow hero |
| `scrollbar.js` 3 · `reasoning.js` 2 · `widgets.js` 2 · `scrollbar.css` 2 · `hero.js` 1 · `blog/blog.css` 1 | — | scattered |

`particles.js` and the glow layers are the literal "particle field / glow orb" cliché the brief
calls out. The living-system hero must be rebuilt as an engineered instrument (later phase), and
these effects stripped, not repointed.

---

## Finding 6 — Backup / variant HTML clutter
`index.new.html` (28 KB) and `index.cream-backup.html` (32 KB) are alternate homepages linking
older CSS (`index.new.html:23–26` tokens/hero/sections; `index.cream-backup.html:20` the dead
`styles.css`). They confuse "which index is real" and should be removed in the consolidation pass.

---

---

## Finding 7 — Prior token build targeted the WRONG brief direction
Maps to **"inconsistent execution"** and non-negotiable **#2 (use the design tokens)**.

The repo's first token build (commits `f846f81`, `d708a14`) implemented the **Direction A**
palette from the *operator cockpit* screen — primary amber `hsl(38 92% 56%)` + a warm **orange**
secondary `hsl(30 86% 52%)` (`primitive.json` labelled both "AUTHORITATIVE"). But this task is the
**Direction B** *DPR AI buyer site*, whose authoritative `DESIGN TOKENS` block specifies primary
amber **`36 86% 56%`** and a cool slate-blue accent **`205 22% 64%`** (body **Inter**). Two warm
accents (amber + orange) also risk the "warm-glow / too-AI" read the owner banned; a cool slate
complements the amber and reads as engineered restraint.

**Fix (this phase):** re-anchor amber to `36 86% 56%`, replace orange with a `205` slate ramp, add
the missing `--primary-foreground` / `--accent-foreground` inks, and emit the exact shadcn HSL
triplets from the same source. See `MIGRATION.md §0`.

---

## Resolution (this phase)
One DTCG token system under `design/` is now the single source of truth:
`primitive → semantic → component`, built to `design/dist/tokens.css`, gated by `npm run verify`
(lint: 0 violations · contrast: **42/42** pairings WCAG 2.2 AA in dark + light). Palette is the
authoritative Direction-B set — warm canvas `#131210`, amber primary `#EFA22E` (36 86% 56%), cool
slate accent `#8FA7B7` (205 22% 64%) — with a shadcn/ui HSL-triplet compatibility layer asserted
equal to the DTCG primitives. Type is Space Grotesk + Inter + JetBrains Mono. `design-language.html`
renders this file as living proof. The consolidation and page phases execute `MIGRATION.md` on top
of it — they do not invent new colours, fonts, or sizes.
