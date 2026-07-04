# ADVANCED PRODUCT-MOCKUP UPGRADE — DPR "Deeper" (v2)

GOAL: Make the 5 in-page product "screenshots" (the `.mockup` in each `section.solution`)
read like **real, advanced SaaS product screens** — the density and polish of harness.io's
product UI — and make them feel **alive** with tasteful, looping micro-animation. This is a
VISUAL-FIDELITY + MOTION upgrade only. Do NOT change site copy, section order, palette, fonts,
the tab controller, or anything outside the mockups + their styles/animation.

## HARD CONSTRAINTS (do not break what already passed QA)
- Vanilla stack only: `index.html`, `styles.css`, and JS (`solutions.js` or a NEW `mockups.js`
  loaded after `solutions.js`). No frameworks, no build step, no new deps.
- Keep the existing ocean `:root` palette + per-solution `--sol` accent + `--surface/--surface-2`.
  Numbers use `font-variant-numeric: tabular-nums`. Inter font stays.
- Mockups stay `aria-hidden="true"` (decorative). All NEW motion MUST:
  - run only while the mockup is on-screen (reuse an IntersectionObserver, like the tab engine),
  - fully stop under `@media (prefers-reduced-motion: reduce)` AND when `matchMedia('(prefers-reduced-motion: reduce)')` is true in JS — paint ONE realistic static final frame instead,
  - use `requestAnimationFrame`/throttled timers, no layout thrash, no console errors.
- Must still pass: 0 console errors, 360px no horizontal scroll, tab auto-advance + click +
  keyboard + pause still work, count-ups still work. Re-verify these.
- Keep each mockup's existing tab→scene wiring (`.mockup[data-active]`, `.mk-scene[data-scene]`)
  so the 3 tabs per solution each show a DISTINCT advanced scene.

## REALISM CHECKLIST (apply to every mockup)
Real product screens have ALL of these — add what's missing:
1. **App chrome**: traffic-light dots + product mark + screen title + a breadcrumb
   (e.g. `Workspace / Acme Co / Opportunity Audit`) + a faux search field + a notification
   dot + a small round user avatar (CSS monogram/gradient chip, not an image).
2. **Left nav rail**: real icon+label rows (Dashboard, Workflows, Data, Insights, Settings) with
   one active row highlighted in `--sol`, a workspace switcher at top, a small section caption.
3. **Dense, believable data** in the work area: tables with header rows + aligned columns +
   status pills (Ready/Running/Review/Done) + timestamps + realistic names and numbers; or a
   real chart (see per-solution). No lorem. Numbers should be specific and consistent.
4. **AI assistant panel** (`.mk-asst`): a typed/streaming assistant line, a value chip that
   counts up, 1–2 small "suggested action" buttons, and a subtle "thinking" shimmer before text.
5. **Micro-interaction layer** (the "advanced" feel): a simulated cursor (small SVG arrow) that
   glides to a row/tab and "clicks" (row highlights/ripples), rows/log-lines that stream in,
   a metric that counts up, a chart that draws on enter, a status pill that flips. Loop subtly
   (~6–10s) and reset cleanly. Keep it classy, not busy — one or two motions at a time.

## PER-SOLUTION CONTENT (3 scenes each = the 3 tabs)
**1. Strategy — "Opportunity Audit"** (`--sol` cyan)
   - Scene 0 (Opportunity audit): a SORTABLE-LOOKING TABLE — cols `Workflow | Effort | Payoff | ROI | Status`,
     6 rows (Invoice review, Support replies, Data clean-up, Report writing, Lead routing, QA triage),
     effort/payoff as mini horizontal bars, ROI as `$`, status pills. A top stat strip:
     `14 workflows • 5 quick wins • payback < 3 wks`. Animation: cursor clicks the `Payoff`
     header → rows re-order (top row springs to top), a row highlights.
   - Scene 1 (Build-vs-buy): a 2-column compare card (Build vs Buy) with check/cross rows and a
     recommendation banner `Recommended: Build (owns data, 3-wk pilot)`.
   - Scene 2 (Risk & data review): a readiness checklist with a circular progress ring (e.g. 82%)
     + 4 check items flipping to ✓.
   - AI panel: streams `Ranked 14 workflows by effort vs payoff.` → value chip counts to `3 weeks`.

**2. Custom builds — "Assistant"** (`--sol` violet)
   - Scene 0 (RAG over your docs): a chat thread — a user bubble + an assistant bubble that
     TYPES in, with inline citation chips `[Policy.pdf] [SOW-2024.docx]`; a side "retrieved
     context" list with 3 doc snippets + relevance % bars.
   - Scene 1 (Custom agents): an agent run card — steps `Plan → Call CRM API → Draft reply →
     Send`, each step flipping done ✓ with a tiny spinner on the active one.
   - Scene 2 (Tools & your software): a grid of connected tool chips (CRM, Email, DB, Slack)
     with "connected" dots.
   - AI panel: `Grounded in your own documents.` → chip `Answered from 1,240 docs`.

**3. Automation — "Pipeline"** (`--sol` green)
   - Scene 0 (Support triage): a real NODE GRAPH — `Intake → Classify → Route → Resolve` nodes
     with status (done ✓ / running spinner / queued), EDGES with animated flow dots traveling
     along them, and a streaming run-log panel below (timestamped lines appearing:
     `09:41 ticket #4821 routed to Billing …`). A throughput counter `1,840 hrs/yr saved` counts up.
     Include ONE "error caught → retried → ok" micro-event in the log.
   - Scene 1 (Invoice handling): a pipeline `Receive → Extract → Validate → Post` + a tiny
     extracted-fields card (Vendor, Amount $, Date) filling in.
   - Scene 2 (Document processing): a queue list draining (items move from Queued→Processing→Done).
   - AI panel: `Runs on its own, checks its own work.` → chip `Saved 1,840 hrs/yr`.

**4. Analytics — "Forecast"** (`--sol` gold)
   - Scene 0 (Demand forecasting): a REAL LINE/AREA CHART (canvas or SVG) with x/y axes,
     gridlines, an `actual` solid series + a `forecast` dashed series + a shaded confidence band;
     a tooltip dot that appears on a point showing `Wk 7 · 4,210 ± 6%`. KPI cards above:
     `Accuracy 96% · MAPE 4% · Horizon 12 wks`. Chart DRAWS in on enter.
   - Scene 1 (Pipeline quality review): a funnel or bar set (Lead→Qualified→Won) with conversion %.
   - Scene 2 (Document insights): a small categorized table with sentiment/topic pills.
   - AI panel: `Backed by your own history.` → chip `Forecast within 4% of actual`.

**5. Enablement — "Handoff"** (`--sol` accent)
   - Scene 0 (Hands-on training): a team roster — 4 members (monogram avatars, name, role,
     `Trained ✓` badge filling in one by one) + an overall progress ring `Team readiness 92%`.
   - Scene 1 (Playbooks): a docs list (Runbook, Prompt library, Eval rubric) with version chips.
   - Scene 2 (AI rollout): a 4-week timeline with milestones checking off.
   - AI panel: `We leave; it keeps working.` → chip `Self-sufficient in 4 weeks`.

## ANIMATION ENGINE (new, small)
Add a `mockups.js` (loaded after solutions.js). For each `section.solution`:
- Build a per-mockup controller that, when the section is visible AND not reduced-motion,
  runs that mockup's scripted micro-animation loop for the CURRENT scene only
  (read `.mockup[data-active]`); pause/reset when the tab/scene changes or section leaves view.
- Provide a shared simulated-cursor helper (absolutely-positioned SVG inside `.mockup`,
  `pointer-events:none`) that can tween to an element's center and emit a "click" ripple.
- Provide a shared "stream text into element" + "count number up" + "draw line chart on canvas".
- Reduced-motion: render the final/static frame of each scene (tables filled, chart fully drawn,
  checklist all ✓, counters at final value) with NO timers.

## DELIVERABLES
- Updated `index.html` (richer mockup markup per the inventory above).
- Updated `styles.css` (new `.mk-*` / table / chart / pill / cursor / log styles; responsive at
  360px; reduced-motion final-frame rules).
- New `mockups.js` (the animation engine) added to the `<script>` list after `solutions.js`.
- Self-check: serve on http://127.0.0.1:8090, confirm 0 console errors, each mockup’s 3 scenes
  render distinct advanced content, motion runs when on-screen and stops under reduced-motion,
  no horizontal scroll at 360px. Report exact files + line ranges changed.

## OUT OF SCOPE
Hero, marquee, integrations, testimonials, process, founders, closing, contact, footer — leave
as-is. No copy rewrites. No palette/font changes. No AI-generated images for the UI itself
(real product feel = DOM/SVG/canvas; the existing ComfyUI art stays as ambient backdrop only).
