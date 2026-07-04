# DPR / "Deeper" website redesign — build brief (machine-readable for mesh workers)

TARGET REPO (write ALL files here, nowhere else): C:\Users\dennha\programs\dpr
NEVER write into C:\Users\dennha\programs\jarvis. This is the DPR app, keep it self-contained.

## What DPR is
"Deeper" — a small, senior AI **consulting studio**. Brand metaphor = ocean depth:
"Most AI projects stay on the surface. We go deeper." Dark, premium, calm-technical.

## Stack — DO NOT CHANGE THE STACK
Vanilla static site. Files:
- index.html  (single page, semantic sections)
- styles.css  (design tokens in :root — teal/cyan ocean palette, Inter font)
- bg.js       (WebGL fixed background)
- widgets.js  (canvas "widget" engine: <canvas data-widget="neural|depth|dive|chart|flow">,
               DPR-aware, animates only when visible, respects prefers-reduced-motion)
- script.js   (scroll progress, sticky nav, Mariana-Trench depth gauge, parallax,
               reveal-on-scroll, stat counters, chat demo, project filters, mind-map drag)
Do NOT introduce React/Next/build tooling. Extend this existing custom system.

## Brand identity to PRESERVE (make it unique, do not clone Harness)
- Palette: --bg #05080e, --cyan #3fd0e6, --teal #1f8fa8, --accent #56e0f0,
  plus amber/gold/green/violet/pink accents. Keep the dark ocean-depth feel.
- Font: Inter (already loaded). Headings tight tracking, tabular-nums for numbers.
- Signature motifs to keep & lean into: the depth gauge (metres of depth on scroll),
  the live canvas widgets, the animated gradient text (.grad-flow), the grain + cursor glow.
- NO Harness colors, copy, logos, or screenshots. Inspiration is STRUCTURE + MOTION only.

## Harness.io structure we are ADAPTING (Playwright analysis 2026-06)
1. Full-viewport hero: one bold line "AI for Everything After Code" + one subline + ONE CTA,
   with an abstract animated 3D visual on the right.
2. Infinite customer-logo marquee ("World's most innovative teams build with…"),
   built from 3 duplicated lists for a seamless loop.
3. FOUR big "AI for X" SOLUTION SECTIONS (DevOps, Testing, Security, Cost). Each one:
   - Large section heading "AI for <X>" + a paragraph of value copy.
   - A TABBED, auto-advancing product-UI demo (multiple feature tabs; each tab swaps the
     visual + caption). Has a "Pause animation" control. Feature pills under it.
   - Tall, scroll-pinned feel — the visual is the hero of the section.
4. "100+ Integrations" — giant typographic statement section.
5. "Hear From Our Customers" — testimonial carousel (image + quote + dots).
6. "Request a Demo" form + newsletter signup.
7. Multi-column footer with an award/badge block.

## THE REDESIGN — what to build (value-based, one animated screen per solution)
Reframe DPR's offerings as distinct **solution screens**, each its own full section with
its own animated visual + auto-advancing feature tabs + a hard value metric. Use these 5:

1. **AI Strategy & Roadmap** — "See where the money is hiding."
   Tabs: Opportunity audit / Build-vs-buy / Risk & data review.
   Value stat: e.g. "3-week path from first call to a working pilot."
   Visual: animated mind-map / sonar-scan widget.
2. **Custom AI Builds** — "Assistants & agents wired into your stack."
   Tabs: RAG over your docs / Custom agents / Tools in your existing software.
   Value: "40+ systems shipped to production."
   Visual: animated chat/agent UI (reuse/extend the chat demo) or neural widget.
3. **Workflow Automation** — "Hand the work your team dreads to reliable pipelines."
   Tabs: Support replies / Invoice handling / Document processing.
   Value: "11k+ manual hours removed per year." / "$240k saved on one invoice pipeline."
   Visual: animated pipeline/flow widget (nodes lighting up in sequence).
4. **Analytics & Forecasting** — "Decisions backed by your own data."
   Tabs: Demand forecasting / Visual quality checks / Operational insight.
   Value: "68% faster support turnaround." Visual: animated chart widget.
5. **Team Enablement** — "We leave, the progress stays."
   Tabs: Hands-on training / Playbooks / No lock-in (you own code, data, keys).
   Value: "92% of pilots clients chose to keep running."
   Visual: animated handoff/flow widget.

Each solution screen must:
- Auto-advance its tabs on a timer, pause on hover/focus, expose a visible pause control,
  and be clickable (tab a feature -> visual + caption update). Keyboard-operable (WCAG 2.2 AA).
- Animate in on scroll (reveal). Use a sticky/pinned visual where it strengthens the story.
- Show a concrete VALUE NUMBER (animated count-up via the existing stat counter).

Also keep/refresh: hero, trust marquee (use word-marks for fictional-but-tasteful sectors,
NOT real company logos), results/testimonials carousel, an "Integrations / works-with" mega
section ("Plugs into the tools you already use"), process steps, founders, about, contact form.

## Imagery — generate with LOCAL ComfyUI (no stock, no placeholders)
ComfyUI is running at http://127.0.0.1:8188.
Render skill: C:\Users\dennha\.copilot\skills\comfy-render-still\  (and comfy-render-grade-loop)
Run via: C:\Users\dennha\.copilot\.venv\Scripts\python.exe <skill>\render.py ... (see that SKILL.md)
Generate dark, abstract, deep-ocean/tech imagery (bioluminescent teal/cyan, sonar, depth,
neural light) into C:\Users\dennha\programs\dpr\assets\images and assets\icons:
- 1 hero background/side visual (abstract deep-sea neural light, landscape)
- 1 distinct visual per solution screen (5 total), matching each story above
- refreshed solution/feature icons in the cyan line-art style of existing assets\icons\icon-*.png
Prefer the existing live canvas widgets for motion; use ComfyUI stills for backgrounds,
section media, project thumbnails (assets\projects\*.png), and icons. Replace any placeholder.

## Constraints / Definition of Done
- Loads with ZERO console errors. All links/anchors resolve. Forms validate client-side.
- prefers-reduced-motion: all auto-animations stop; content fully readable/usable.
- Keyboard: nav, tabs, carousel, form all operable; visible focus rings (already styled).
- Mobile responsive down to 360px; no horizontal scroll.
- NO Lorem ipsum, NO "Founder Name" placeholders (write tasteful generic-but-real-sounding
  founder names/roles/bios), NO broken <img>. Every image is real (ComfyUI or canvas).
- Value-based copy throughout: lead with the outcome (hours saved, $ saved, % faster, weeks).
- Unique: must NOT look like Harness; must look like a premium "Deeper / ocean depth" studio.

## UPDATE (confirmed by live harness.io capture) — each solution screen MUST center on a realistic ANIMATED product-UI MOCKUP built in HTML/CSS (not a static image)
Harness pattern: every "AI for X" section centers on a believable product dashboard that
demonstrates the solution, with feature tabs above it and an embedded "AI assistant" panel
that shows HARD VALUE NUMBERS (dollars saved, % faster, hours removed). Recreate this for DPR
in our unique ocean-depth styling (NOT harness visuals/colors):
- A dark rounded "app frame" (subtle --line border + soft cyan glow) containing a slim left
  icon-rail, a main work area, and a right-docked "DPR Assistant" panel.
- Main work area differs per solution (reuse the existing canvas widgets where noted):
  * AI Strategy      -> "Opportunity Audit" board: ranked workflow rows with effort/payoff
                        bars + a highlighted "Recommended first pilot" callout.
  * Custom Builds    -> chat/agent transcript answering from "your docs" with cited sources
                        (elevate the existing chat demo).
  * Workflow Automation -> node-graph pipeline (Intake -> Extract -> Validate -> File) with
                        nodes lighting up in sequence (reuse the flow/dive widget).
  * Analytics        -> forecast chart with a confidence band + "next quarter" marker
                        (reuse the chart widget).
  * Team Enablement  -> "Playbook / handoff" checklist with progress + "you own the keys" badge.
- Right "DPR Assistant" panel: 1-2 short messages, each ending in a HARD VALUE NUMBER
  (e.g. "Saved 1,840 hrs/yr", "$240k removed", "68% faster replies", "Working pilot in 3 weeks").
  Animate one line typing in.
- Feature tabs above the mockup (3 per solution) swap the work area + caption; auto-advance
  ~5s, pause on hover/focus, visible Pause control, fully keyboard operable, ~0.5s ease.
- Under prefers-reduced-motion: NO auto-advance and NO typing animation; every tab still
  reachable by click + keyboard; the marquee also stops (harness fails this — we will not).
- Use assets/images/sol-*.png as a LOW-OPACITY ambient background behind each mockup, never
  as the mockup itself. Keep the depth-gauge, grain, cursor-glow, and gradient-text signatures.

## Verify before declaring done (paste proof)
- Serve: python -m http.server 8090 in C:\Users\dennha\programs\dpr ; open http://127.0.0.1:8090
- Playwright/visual-qa: full-page screenshot, 0 console errors, every section renders,
  each solution screen's tabs auto-advance and respond to click, reduced-motion honored.
