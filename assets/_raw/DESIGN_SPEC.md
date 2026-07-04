# DPR "Deeper" redesign — DESIGN SPEC (build-ready handoff)

> Phase 1 of the mesh relay (`ux-ui-designer`). This is the spec the build worker
> implements. It maps every decision to the existing vanilla files. **Do not add
> React/build tooling. Keep Inter + the ocean palette.** Evidence in
> `harness_motion_evidence.json` + `contrast_results.json` (session files).
> Authoritative input: `assets/_raw/REDESIGN_BRIEF.md`.

## 0. Token reconciliation (READ FIRST)
The mesh auto-forged a generic direction (HSL `178 70% 47%`, Space Grotesk/Geist).
**The REDESIGN_BRIEF overrides it** ("follow it exactly", "Font: Inter (already
loaded)", "DO NOT CHANGE THE STACK"). Decision: **keep Inter and the existing
`:root` ocean palette** (`styles.css:2-20`). The auto-forged Space Grotesk/HSL
tokens are NOT used. Uniqueness comes from layout + motion, not a new brand.

---

## 0. ART-DIRECTION BRIEF (stage 0)
- **Named layout:** "**Sonar Deep-Dive**" — a vertical depth journey. Each of the 5
  solutions is a tall, scroll-pinned **screen**: a sticky animated canvas visual on
  one side (~58%), value content + auto-advancing feature tabs on the other (~42%),
  **sides alternate** per solution for rhythm. This is a *stage/asymmetric-split*
  pattern, NOT a flat equal bento.
- **Tokens to build to:** existing `:root` (`--bg #05080e`, `--cyan #3fd0e6`,
  `--teal #1f8fa8`, `--accent #56e0f0`, amber/gold/green/violet/pink). **Add:**
  `--surface:#0a1019`, `--surface-2:#0d1622`, per-solution accent var
  `--sol` set per screen (strategy=cyan, builds=violet, automation=green,
  analytics=gold, enablement=accent). Radius 20px, `--ease cubic-bezier(.2,.7,.2,1)`.
- **References (structure/motion only, NOT visual clone):** harness.io solution
  sections + 24s linear logo marquee + WCAG tab/pause pattern; Linear's pinned-visual
  storytelling; Apple product pages' sticky-media scroll.
- **Banned defaults:** no flat equal-card bento; no monospace numbers (use Inter +
  `tabular-nums`); no stock palette; no Inter-swap; no blue→purple gradient; no
  Harness colours/copy/logos; no ambient widget that doesn't carry a solution's value.

---

## 1. DESIGN BRIEF (stage 1, a–g)
- **(a) Industry + norms:** B2B AI-consulting / professional services. Expected norms:
  outcome-led hero, named social proof, per-offering proof, low-friction "book a call",
  integration reassurance. (NN/g B2B credibility; Christensen JTBD.)
- **(b) JTBD:** *When I'm evaluating an AI partner and I'm skeptical and time-poor, I
  want hard proof each solution delivers measurable value, so I can decide to book a
  call without sitting through a sales pitch.*
- **(c) Competitor teardown (structure refs):** harness.io — per-solution auto-advancing
  tab demos (each offering proves itself with one focused visual; reduces cognitive load,
  NN/g chunking). harness logo marquee — fast low-effort social proof. harness testimonial
  carousel with named outcomes — turns claims into evidence.
- **(d) Candidate flows ranked:** **#1 (chosen)** Scan hero value → jump via solution
  sub-nav to the matching solution → read its metric+tabs → book demo. #2 Linear scroll
  through all 5 then convert. #3 Go straight to testimonials/projects then convert.
  #1 wins: serves self-selection (job 3) + proof (job 2) fastest.
- **(e) AI-integration opportunities:** (1) live chat-assistant demo as a *tab visual*
  inside "Custom AI Builds" (show, don't tell). (2) the per-solution canvas widgets
  *are* the product metaphor (sonar audit, pipeline, forecast chart). (3) optional:
  "which solution fits me?" could be added later — out of scope now.
- **(f) Usability bets:** (1) auto-advance MUST be pausable + keyboard-driven (WCAG
  2.2.2 pause/stop/hide) or it fails skeptical readers. (2) recognition over recall —
  persistent "Book a demo" + sticky solution sub-nav. (3) error-prevention — inline
  client-side form validation with text+icon, not colour-only.
- **(g) Success metric:** demo-CTA click-through (every solution screen + closing band
  routes to `#contact`). Design must keep the CTA reachable from every scroll position.

---

## 2. IA / TAXONOMY + SITEMAP
Single page, semantic sections (each `<section aria-labelledby>`), one `<h1>`.
Order (replaces today's services/chat/mindmap standalone sections):
1. **Hero** — value prop + primary "Book a demo".
2. **Trust marquee** — sector word-marks (fictional-but-tasteful; NOT real logos).
3. **Solutions overview + sub-nav** — 5 anchor pills (scrollspy, sticky) for self-select.
4. **Solution 1 — AI Strategy & Roadmap**  (#sol-strategy)
5. **Solution 2 — Custom AI Builds**       (#sol-builds)
6. **Solution 3 — Workflow Automation**    (#sol-automation)
7. **Solution 4 — Analytics & Forecasting**(#sol-analytics)
8. **Solution 5 — Team Enablement**        (#sol-enablement)
9. **Integrations** — "Plugs into the tools you already use" (mega-type + works-with grid).
10. **Results / testimonials** — carousel (named people + stated outcome) + outcome metrics.
11. **Process** — how we work (keep, `dive` widget).
12. **Founders** — keep, short.
13. **Closing demo CTA band.**
14. **Contact form.**  15. **Footer.**
Nav (lean, drop dense link set): *Solutions · Results · How we work* + persistent
**Book a demo** CTA. (DESIGN DIRECTION: no dense competing nav.)

---

## 3. WIREFRAME (mid-fi, desktop ≥1024; mobile stacks single-col)
```
┌ NAV: [DPR·deeper]      Solutions  Results  How we work     (Book a demo) ┐ sticky
├ HERO ───────────────────────────────────────────────────────────────────┤
│  eyebrow                                   ╲   ┌───────────────┐         │
│  H1  "Most AI projects stay on the          ╲  │  neural orb   │ sticky  │
│       surface.  We go deeper."               ╲ │  (canvas)     │ parallax│
│  sub (value)                                   └───────────────┘         │
│  [Book a demo]  [See solutions ↓]                                        │
├ MARQUEE  AI strategy · Custom agents · RAG · Automation · …  (24s loop) ──┤
├ SOLUTIONS SUB-NAV  ( Strategy | Builds | Automation | Analytics | Team )──┤ sticky pills, scrollspy
├ SOLUTION SCREEN (xN, sides alternate) ───────────────────────────────────┤
│  ┌──────────────── visual 7/12 (sticky) ───────┐ ┌ content 5/12 ───────┐ │
│  │  canvas widget (sonar / neural / pipeline /  │ │ eyebrow  Solution 0n │ │
│  │  chart / dive) + per-tab caption overlay     │ │ H2 headline          │ │
│  │                                              │ │ value copy (1–2 ln)  │ │
│  │                                              │ │ ┌ METRIC ──────────┐ │ │
│  │                                              │ │ │ 11,000+  ▏big     │ │ │
│  │                                              │ │ │ manual hours/yr  │ │ │
│  │                                              │ │ └──────────────────┘ │ │
│  │                                              │ │ [⏸ Pause]            │ │ │
│  │                                              │ │ ▸ tab pill (active)  │ │ │
│  │                                              │ │   tab pill           │ │ │
│  │                                              │ │   tab pill           │ │ │
│  │                                              │ │ ──progress under tab │ │ │
│  └──────────────────────────────────────────────┘ └ [Open case study →] ┘ │
├ INTEGRATIONS  "Plugs into the tools you already use"  + works-with chips ──┤
├ RESULTS  testimonial carousel  ◂ ●●● ▸   + outcome metric cards ──────────┤
├ PROCESS (dive)  →  FOUNDERS  →  CLOSING CTA BAND [Book a demo] ───────────┤
├ CONTACT form (inline validation)  →  FOOTER ─────────────────────────────┤
```

---

## 4. LAYOUT & GRID
- Max content **1180px** (`--maxw`, existing). Outer gutter clamp(20px, 5vw, 80px).
- Columns: **12** ≥1024px · **8** 640–1023 · **4** <640. Gutter 24px. Spacing scale 8pt
  (4/8/12/16/24/32/48/64/96/128).
- **Solution screen split:** visual `7/12`, content `5/12` ≥1024px; visual is
  `position:sticky; top:88px` within a `min-height:170vh` section (pinned-scroll feel).
  Alternate `flex-direction` per screen. **<900px:** single column, visual first,
  `height:clamp(280px,56vh,440px)`, NOT sticky.
- **360px rule:** no element wider than viewport; metric font uses `clamp`; sub-nav pills
  horizontally scroll (`overflow-x:auto`, momentum) rather than wrap-break; marquee
  `overflow:hidden`.

---

## 5. COMPONENTS + STATES (tokens)
**New core component — `SolutionScreen` w/ auto-advancing tabs (WCAG APG tabs):**
- Markup: `section.solution` → `.sol-visual`(canvas widget + `.sol-cap` overlay) +
  `.sol-content`(eyebrow, h2, copy, `.metric`, `.sol-controls`(pause btn),
  `[role=tablist]` of `[role=tab]` pills, `[role=tabpanel]`, `.sol-progress`).
- ARIA: `tablist[aria-label="<solution> features"]`; each `tab[id][role=tab]
  [aria-selected][aria-controls=panelId][tabindex=0|-1]` (roving tabindex);
  `tabpanel[role=tabpanel][aria-labelledby=tabId][tabindex=0]`.
- Keyboard: ←/→ move+activate, Home/End first/last, Enter/Space activate. (WCAG APG.)
- Auto-advance: **6500ms** (NN/g auto-advance reading time), wraps. **Pauses** on
  hover, `focus-within`, section out of viewport (IntersectionObserver), pause-btn
  toggle, and is **fully disabled** under `prefers-reduced-motion`. Pause btn:
  `aria-pressed`, text+icon "Pause"/"Play" (not colour-only).
- `.sol-progress`: 2px bar under active tab, fills 0→100% over 6500ms (cue for
  auto-advance), resets on manual switch; static (no fill) under reduced-motion.
- Tab states: default / hover / **focus-visible** (cyan ring, `styles.css:33`) /
  **selected** (filled accent + left indicator + bolder weight — 3 cues, not colour
  alone) / disabled.

**Reused/extended components & required states (default·hover·focus·active·disabled·error·loading):**
- Buttons primary/ghost/link — exist (`styles.css:73-88`); reuse.
- Trust marquee — exists (CSS); refresh content; keep `aria-hidden`.
- Solutions sub-nav pills — new; scrollspy `aria-current="true"` on in-view section.
- Metric block — reuse count-up (`script.js:63`, `[data-target]`); add `tabular-nums`.
- Integrations mega-type + works-with chips — new; chips are non-interactive labels.
- Testimonial carousel — **new JS**: slides, dots(`aria-current`), prev/next btns,
  auto-advance+pause, swipe, keyboard ←/→; states incl. loading(img).
- Contact form fields — add inline validation: error(text+icon+`aria-invalid`+
  `aria-describedby`), loading(submit), success note (exists `script.js:287`).

---

## 6. COLOUR PALETTE (measured, real ratios) + TYPE SCALE
**Palette = existing `:root`. Documented AA pairs on `--bg #05080e`
(full data: `contrast_results.json`):**
| token | on | ratio | use |
|---|---|---|---|
| `--ink #eef3fb` | bg | **17.99** | body ✓AA |
| `--ink-2` (.64 → #9a9ea6) | bg | **7.46** | secondary ✓AA |
| `--ink-3` (.40 → #62666d) | bg | **3.48** | **LARGE/UI ONLY — never body** |
| `--cyan #3fd0e6` | bg | **10.86** | eyebrow/links ✓AA |
| `--accent #56e0f0` | bg | **12.71** | accent ✓AA |
| `--teal #1f8fa8` | bg | **5.30** | ✓AA |
| `--amber #ffae57` | bg | **10.92** | metric ✓AA |
| `--gold #ffd166` | bg | **13.90** | metric ✓AA |
| `--green #56e0a4` | bg | **12.02** | metric ✓AA |
| `--violet #b48cff` | bg | **7.77** | metric ✓AA |
| `--pink #ff7eb6` | bg | **8.51** | metric ✓AA |
| btn ink `#03121a` | cyan | **10.29** | primary label ✓AA |
| btn ink `#03121a` | teal | **5.02** | label at gradient end ✓AA |
| `--cyan` focus ring | surface `#0a1019` | **10.33** | ✓UI (≥3:1) |
- **Constraint:** card surface `#0a1019` vs bg = **1.05:1** → cards/panels MUST use the
  `--line` 1px border for boundary; never rely on fill contrast.
**Type scale — Inter variable (loaded `index.html:10`), 1.25 modular:**
13(eyebrow,upper,+.18em) · 16(body) · 20(lead) · 25 · 31 · 39 · 49 · **62(hero,clamp)**;
mega display for Integrations = `clamp(3rem,10vw,9rem)`. Headings `letter-spacing:-.03em`,
`line-height:1.05`; body 1.55; all numerals `tabular-nums lining-nums` (exists `styles.css:26`).

---

## 7. INTERACTION / TRANSITIONS
| element | trigger | property | dur | easing |
|---|---|---|---|---|
| nav | scroll>40px | bg/blur/height | 250ms | ease |
| button | hover | shadow+transform | 350ms | `--ease` |
| tab pill | hover/select | bg + indicator slide | 250ms / 300ms | ease / `--ease` |
| tab panel/caption | switch | cross-fade | 300ms | ease |
| sol-progress | active | width 0→100% | 6500ms | linear |
| carousel | next/prev/auto | transform | 500ms | `--ease` |
| reveal-up | in-view | opacity+translateY | 600ms (stagger 80ms) | `--ease` |
| anchor nav | click | scroll, −70px offset | smooth | (exists `script.js:130`) |
Pointer-fine only: magnetic buttons, cursor glow, 3D tilt (exist). Harness ref:
tabs `0.6s ease`, marquee `24s linear` (`harness_motion_evidence.json`).

---

## 8. MOTION / ANIMATION
- Hero `neural` orb (canvas) + parallax; reveal-up stagger; count-up 1500ms ease-out
  cubic (exists). Marquee 24s linear infinite.
- Per-solution canvas widgets (visible-only via IntersectionObserver, exists
  `widgets.js:50`): **new `sonar`** (rotating sweep revealing opportunity blips →
  Strategy), **new `pipeline`** (nodes light in sequence → Automation), reuse
  `neural`/chat-UI (Builds), `chart` (Analytics), `dive`/`flow` (Enablement, Process).
- Tab auto-advance 6500ms + progress fill.
- **`prefers-reduced-motion` (brief-mandated; DPR improves on harness, which does NOT
  honour it):** widgets paint ONE static frame (engine already does this,
  `widgets.js:39`), marquee static, count-up jumps to final (`script.js:65`), tab
  auto-advance OFF, progress no-fill, reveal shows immediately, carousel manual-only.
- Durations follow Material 3 motion (UI 200–300ms, larger 400–600ms).

---

## 9. A11Y CHECKLIST (build must satisfy → QA verifies)
- [ ] Contrast: every text/UI pair per §6; `--ink-3` large/UI only; cards use `--line`.
- [ ] One `<h1>`; `<header><nav><main><section aria-labelledby><footer>` landmarks; h2/section.
- [ ] Every interactive element has visible focus-visible ring (exists).
- [ ] Solution tabs = WCAG APG pattern (roving tabindex, ←/→/Home/End, aria-selected/controls).
- [ ] Auto-advance pausable (WCAG 2.2.2) — pause btn + hover/focus pause + reduced-motion off.
- [ ] Carousel: keyboard + visible controls + dots `aria-current`; not auto-only.
- [ ] Targets ≥44×44px (pills, dots, nav, btns).
- [ ] Not colour-alone: selected tab (indicator+weight+colour), form errors (text+icon), metrics (label).
- [ ] Decorative canvases `aria-hidden` (exists); marquee `aria-hidden`.
- [ ] Forms: label+`aria-describedby` errors, `aria-invalid`, success message.
- [ ] `prefers-reduced-motion` honoured everywhere; content fully usable.
- [ ] 360px: no horizontal scroll.

---

## BUILD HANDOFF — file change map (next worker)
- **index.html:** rebuild `<main>` to §2 order; replace `services`/`chat`/`mindmap`
  standalone sections with 5 `section.solution` screens (chat window becomes a Builds
  tab visual; mind-map metaphor becomes the Strategy `sonar` visual); add solutions
  sub-nav, integrations section, testimonial-carousel markup, closing CTA band; trim nav.
- **styles.css:** add `--surface/--surface-2/--sol`; `.solution/.sol-visual/.sol-content/
  .metric/.tab[role]/.tabpanel/.sol-progress/.sol-controls`; `.subnav`(scrollspy, sticky,
  overflow-x); `.integrations`(mega-type); `.tcarousel`; tighten ≤360 responsive.
- **widgets.js:** add `sonar` + `pipeline` widget defs (same `widget(name,init,draw)` API,
  `widgets.js:17`); keep neural/depth/dive/chart/flow.
- **script.js (or new `solutions.js`, loaded after script.js):** `SolutionTabs`
  controller (auto-advance+ARIA+keyboard+pause+IO+reduced-motion); testimonial carousel
  controller; sub-nav scrollspy (IntersectionObserver); form inline validation. Reuse
  existing reveal/count-up/scroll/magnetic.

## ASSET RENDER LIST — ComfyUI (build phase; `comfy-render-still`, server 127.0.0.1:8188)
All **dark deep-ocean, bioluminescent teal/cyan, abstract, no text, no logos, no people**.
Into `assets/images` (16:9 unless noted), `assets/icons` (square line-art), `assets/projects`.
1. `images/hero-deep.png` — abstract deep-sea neural light field, bioluminescent teal nodes in black water, volumetric god-rays (hero side/bg).
2. `images/sol-strategy.png` — sonar sweep over a dark seabed revealing glowing ore veins ("money hiding"), cyan radar arc.
3. `images/sol-builds.png` — neural agent constellation wired into glowing module blocks, violet+cyan.
4. `images/sol-automation.png` — luminous pipeline of linked nodes lighting in sequence, green+teal current.
5. `images/sol-analytics.png` — abstract rising forecast ridge / data terrain under aurora light, gold+cyan.
6. `images/sol-enablement.png` — two light-forms handing off a glowing core, calm teal (the team "handoff").
7. `icons/icon-analytics.png` — cyan line-art chart/forecast glyph matching existing `icon-*.png` style (5th icon).
8. Refresh existing `projects/*.png` only if visual drift; they already map (support/invoices→Automation, search/agents→Builds, forecast/vision→Analytics).

## VERIFY (build/QA phase — paste proof)
- `python -m http.server 8090` in `C:\Users\dennha\programs\dpr`; open `http://127.0.0.1:8090`.
- Playwright: 0 console errors; every section renders; each solution tab auto-advances,
  responds to click + ←/→ keyboard, pause works; reduced-motion stops all motion; 360px no h-scroll.
