# DPR Labs — Design Direction & Content Audit (Phase 1)

Author: docs-writer (mesh L2). Scope: the static site at `C:\Users\dennha\programs\dpr`.
This is the reference the build workers after me build to. Every claim cites a real
file and line I read. No invented APIs, no invented numbers.

> Note: this repo is being edited concurrently by the mesh. Between my first and second
> read, `styles.css` was migrated from the old dark "Abyss" system to a warm editorial
> system. The audit below reflects the **current** state of the files as of this pass.

---

## 1. Plain-English verdict

The site is **not** generic AI slop, and it is **mid-migration**. The task's description
("homepage 1/100 RED, cookie-cutter dark hero, single teal accent, decorative node-graph,
gradient headline") is **stale** — that dark version has already been replaced.

What is true right now:
- `styles.css:1-31` is now an **institutional / editorial** system: warm-paper canvas
  `--bg #F7F4EE` (line 10), deep-green primary `--primary #1F5136` (line 19), one
  restrained amber `--accent #C6913E` reserved for "the number" (lines 21, 25),
  no glow (`--glow-brand: none`, line 23), display **Fraunces** serif + body **IBM Plex
  Sans** + **IBM Plex Mono** (lines 29-31).
- The content and structure are genuinely bespoke and honest: one focal headline per
  page (see section 3), a concrete priced offer with a written guarantee
  (`index.html:363-376`), a real "Your fears, answered" FAQ (`index.html:387-406`), and
  a no-borrowed-logos proof stance (`proof.html:38`, `index.html:116-118`).

So the remaining phases are **finish + fix the migration**, not rebuild.

---

## 2. Design direction — the mesh chose EDITORIAL. Build to that. (read first)

There were two competing directions. Reality has resolved it:

- The auto-forged design-direction block asked for warm-institutional, editorial serif,
  amber/warm palette. **The live `styles.css` now implements exactly this family**
  (Fraunces + IBM Plex + warm paper + deep green), so the editorial direction has won.
- The user's verbatim "Geist/Inter already loaded" line is now **out of date** — the
  stylesheet no longer uses Geist/Inter. Do NOT revert to the dark teal system.

**Ruling for all downstream workers:** keep the **warm editorial system** that
`styles.css:8-50` now defines. Deep-green primary, single amber accent for the number,
Fraunces display, IBM Plex body/mono, warm paper background, no neon/glow, no gradient
headlines. Treat `styles.css:8-50` as the single source of truth for tokens.

---

## 3. Per-page content audit (headlines are real, distinct, one focal each)

| Page | H1 (verbatim) | Source | Focal zone | Note |
|---|---|---|---|---|
| index.html | "AI that does real work - proven in weeks, measured in a number." | 88-91 | hero + CTA "Book a 2-week pilot" (95) | proof zone weak (see 4.2) |
| method.html | "One workflow. One number. Two to four weeks." | 38 | pilot method | ok |
| proof.html | "No borrowed logos. We show our method instead." | 38 | honest evidence | thin until real pilots (by design) |
| about.html | "Senior people. No middle layers." | 38 | studio credibility | ok |
| contact.html | "Tell us one task your team dreads." | 38 | the form | ok |
| jarvis.html | "A small team, amplified by a mesh." | 39 | differentiator | ok |
| blog/index.html | "How we actually do the work." | 44 | field notes | 6x "Coming soon" (76-119) |

Every page has a distinct, outcome-led headline and one focal zone. Nav
(`index.html:47-53`) matches `SITEMAP.md`.

---

## 4. Punch list for the build phases (ordered - fix these, nothing else is broken)

### 4.1 [RESOLVED during this pass] fonts loaded != fonts used
STATUS: fixed by a concurrent build worker while this audit was being written — all 10
HTML font links now load `Fraunces + IBM Plex Sans + IBM Plex Mono` (verified: 0 files
still reference `family=Geist`; `index.html:17` now loads Fraunces/IBM Plex). Kept here
as the rationale and as a regression guard: if any page reverts to Geist/Inter, the
editorial type silently falls back to Georgia/system and must be re-fixed.

Original finding — `styles.css:29-31` uses **Fraunces / IBM Plex Sans / IBM Plex Mono**,
but the HTML files had been loading only Geist / Inter / Geist Mono from Google Fonts:
`index.html:17`, `about.html:12`, `method.html:12`, `proof.html:12`, `contact.html:12`,
`jarvis.html:12`, `blog/index.html:16`, `blog/two-week-pilot.html:16`,
`blog/the-one-number.html:16`, `blog/no-lock-in.html:16`.

Result: Fraunces falls back to Georgia (`styles.css:29`), IBM Plex Sans to system-ui,
IBM Plex Mono to Menlo. **The intended editorial typography does not render anywhere.**
This is the single most important build task and it will directly move the vision score.

**Fix:** replace every font `<link>` with the correct families, e.g.
`https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap`.
Apply the identical link to all 10 files above. Verify by loading a page and confirming
the H1 renders in Fraunces, not Georgia.

### 4.2 Homepage "Results" proof zone reads as a dead apology
`index.html:130-143` — the focal proof quote is a meta-note ("Real client quotes will
live here..."). To a skeptical investor this focal slot reads as an empty placeholder.
**Direction:** promote the already-present **pilot scorecard template**
(`index.html:162-190`) + the guarantee (`index.html:370-374`) + the real "Last Jarvis
run" telemetry (`index.html:104-110`) into the focal proof slot. Keep the
"proof publishes as pilots complete" line as a small caption. Do NOT invent client
names, logos, or numbers — the honesty stance (`proof.html:38`) forbids it.

### 4.3 Stale hero decoration from the dark era
`index.html:79-83` still has a full-bleed dark `hero-plate.mp4` video + `#meshCanvas`
overlay — built for the near-black Abyss look. On a warm-paper editorial page a dark
video plate will clash and re-introduce the exact "cookie-cutter dark hero" tell the
task calls out. **Direction:** replace the dark video plate with an editorial hero
treatment consistent with `--bg #F7F4EE`, or remove it. Keep the mesh telemetry number
only while it is bound to real data (`assets/data/jarvis-run.json`); hide the canvas if
that data fails to load, so it never becomes pure decoration.

### 4.4 Blog "Coming soon" sparseness
`blog/index.html:76,87,92,103,108,119` — six "Coming soon" tags while three real posts
exist (`blog/the-one-number.html`, `blog/two-week-pilot.html`, `blog/no-lock-in.html`).
**Direction:** wire the three real posts into the index, or trim the empty rows.

### 4.5 Re-run the vision gate AFTER 4.1
The passing critique `artifacts/critique/critique/20260701-003305_report.json`
(`"result":"PASS"`, `"page_slop_score":0`) was captured on the **old dark** homepage —
its hero screenshot dominant color is near-black `[10,12,16]` (report lines 18-22). It
is **not** valid evidence for the new editorial look. Re-capture the critique after the
font fix before anyone claims GREEN.

---

## 5. Design system the build must hold to (current tokens - do not re-derive)

- **Background:** warm paper `--bg #F7F4EE`; wells `--bg-sink #EFEAE0`; panels
  `--surface #FFFFFF` (`styles.css:10-12`). No dark mode.
- **Ink:** deep green-black `--ink #1B211C`, muted `--ink-2 #4B5751`, labels
  `--label #6B7A70` (`styles.css:13-15`).
- **Accent discipline:** deep-green `--primary #1F5136` is the structural accent;
  amber `--accent #C6913E` / `--amber #B07A1E` is reserved for "the number" ONLY
  (`styles.css:19-25`). No second hue, no glow (`--glow-brand: none`, line 23), no
  gradient headlines.
- **Type:** display Fraunces, body IBM Plex Sans, mono IBM Plex Mono for labels/metrics
  (`styles.css:29-31`); fluid scale `--fs-display ... --fs-label` (`styles.css:33-39`) —
  no ad-hoc sizes.
- **Layout:** rail `--maxw 1240px`, fluid `--gutter` (`styles.css:42-43`); one focal
  zone per section; editorial whitespace. Shadows are hairline-flat
  (`--shadow-shape`, line 48) — no floating soft-shadow vanity cards.
- **Motion:** reuse `data-shape` / `data-parallax` / `reveal` / `magnetic` hooks; all
  must respect `prefers-reduced-motion`.

---

## 6. Handoff to the next worker (build phase)

Do these in order:
1. **4.1 font links** — DONE by the build worker (Fraunces/IBM Plex now loaded on all 10
   files). Verify Fraunces renders and guard against regressions to Geist/Inter.
2. **4.3** — replace/remove the dark hero video plate so the homepage is coherently
   editorial, not a dark hero on a warm site.
3. **4.2** — promote the scorecard + guarantee into the homepage proof focal slot.
4. **4.4** — wire the three real blog posts or trim "coming soon".
5. **4.5** — re-run the vision critique and attach the new report as proof.

Guardrail for every downstream worker: **no invented client names, logos, or numbers.**
The site's entire credibility strategy is its honesty (`proof.html:38`,
`index.html:116-118`). Filling proof with fabricated testimonials fails the brand.
