# DPR / Deeper - Redesign Art Direction (authored by Jarvis brain, Opus 4.8)

> North star: Every moving pixel on this site is a true picture of our mesh actually working - humans hand a goal to one orchestrator that dispatches five autonomous crews and returns results - rendered native-res-crisp on a strict symmetric grid, so a visitor feels in two seconds that no template and no competitor could have made it.

## What 'wow factor' means here
Wow is the first 2 seconds where motion reveals a TRUE behavior of our system that a stock template physically cannot fake: a real orchestration graph dispatching real tasks, a real forecast resolving into a probability fan, a real reliability signal catching and healing an anomaly. It is proprietary, data-shaped, and native-resolution-crisp. If a competitor could buy the same effect on a marketplace, it is not wow.

**Principles**
- Motion must encode information, not fill space. Every moving pixel maps to a noun in our pipeline (task, agent, edge, signal, forecast).
- One hero moment per viewport. Kill the 4 competing loops; let a single focal animation own the eye, everything else holds still.
- Crisp = native res. Render at 2x device-pixel-ratio (3840px source), never CSS-upscale a 1280 asset. Vector mockups (SVG/DOM) instead of raster screenshots so they stay sharp at any zoom.
- Depth over decoration. 3-5 parallax layers at different scroll speeds beat one flat busy background. Real z-space, not a single full-opacity image.
- Palette restraint with per-crew hue keys. Lock the ocean teal/cyan base, then give each of the 5 crews a controlled 18-24 degree hue offset so sections read as siblings, not clones.
- Symmetric scaffold, asymmetric payload. harness.io rigor (strict 12-col grid, 8px baseline) but one zone in each section dominates 60% of attention so it never feels lopsided.
- 60fps or it is off. transform/opacity only, GPU-composited, IntersectionObserver pauses anything off-screen. Jank reads as cheap.
- Earned reveal. Animations trigger on scroll-into-view and play once with intent, not infinite background churn that visibly loops and resets.

**AI-slop anti-patterns (forbidden)**
- Stripe-clone animated mesh-gradient blobs behind everything.
- Floating glowing particles / bokeh that connect to no data.
- Neon 'AI brain', synapses, or glowing-head imagery.
- Circuit-board / PCB-trace textures and hexagon honeycomb grids.
- Glassmorphism cards stacked in identical 4-up rows with swapped icons.
- Fake dashboards with lorem numbers and randomly-wiggling sparklines.
- Rotating 3D wireframe globe or generic 'network sphere'.
- Default SDXL/Midjourney teal-orange cinematic grade with lens flares and god-rays.
- Video loops with a visible jump-cut at the seam.
- Centered headline with one radial glow puddle behind it.
- Every solution section using the same mockup chrome and same background treatment.
- Decorative 'data flowing' loops where the flow direction and node count are meaningless.

## Diagnosis (owner complaint -> cause -> fix)
- **Images, videos, backgrounds are not crisp or clear.**
  - cause: Assets generated near 1024-1280px then CSS-scaled to full-bleed, plus over-compressed JPEG/low-bitrate video and product shots baked as raster screenshots that blur on retina displays.
  - fix: Regenerate stills at 3840x2160 (FLUX.1-dev), ship 2560-wide WebP q82 with object-fit:cover; encode hero/section video at 2560x1440 H.265/AV1 8-12 Mbps with a WebP poster; rebuild all product mockups as live SVG/DOM so they are vector-crisp at any DPR.
- **I like harness.io symmetry but our 4-screen split looks lopsided.**
  - cause: The solution sections cram mockup + background + video into an ad-hoc 4-pane split with unequal content mass, no shared baseline grid, and mockups of differing sizes, so the optical weight tips to one side.
  - fix: Replace the 4-up with a disciplined alternating 58/42 split on a 12-col grid (image side flips L/R each section), lock every mockup to the same frame size and 8px baseline, and balance each side's optical weight (headline block mass = mockup mass).
- **All screens look alike, nothing is unique, it is AI slop.**
  - cause: Every solution section reuses one template: same card chrome, same teal gradient, same generic Wan2.2 loop. No section earns its own identity tied to what that crew actually does.
  - fix: Give each of the 5 crews a distinct visual archetype + its own meaningful animation + its own hue key (see layout_system.sections and meaningful_animation). Identity comes from the crew's real job, not a new sticker.
- **I need real AI animation that means something.**
  - cause: Current motion is decorative background video with no semantic link to orchestration, forecasting, pipelines, or reliability, so it is interchangeable noise.
  - fix: Build 5-6 data-true animations driven by real structures: a live orchestration constellation, a dependency-ordered pipeline DAG, a forecast cone, a self-healing reliability heartbeat, and a parallel agent-swarm convergence.
- **Backgrounds feel muddy and compete with the text.**
  - cause: Single full-opacity busy image behind copy at low contrast; identical teal across all sections flattens the page.
  - fix: Move to a 3-layer depth stack (base gradient + low-opacity volumetric texture + parallax accent) under a directional scrim, keep luminance under ~12% behind text for 4.5:1 contrast, and shift hue per section within the locked palette.
- **No wow in the first moments; anyone could make this.**
  - cause: Hero leads with a generic looping video instead of a proprietary system visual, so the opening reads as a template.
  - fix: Lead the hero with the operating-model orchestration animation playing once on load: humans hand a goal to the orchestrator, which dispatches glowing task tokens down edges to the 5 crews that light up and return results. It is literally our product.

## Layout system
**Philosophy:** Symmetric scaffold, asymmetric payload. Borrow harness.io's strict modular rigor (one grid, one baseline, repeated module sizing) so the page feels engineered and balanced, but give every section a single dominant focal zone and a crew-specific identity so it never reads as five identical panes.

**Grid:** 12-column, 1280px max content / 1440px max section, 24px gutters, 8px baseline rhythm, 96-120px vertical section padding. Type on a 1.25 modular scale (16/20/25/31/39/49/61). Motion timing: 200-400ms micro, 700-1100ms hero reveals, ease cubic-bezier(0.22,1,0.36,1).

**Sections**
- **Hero** [Stage / canvas]: Full-bleed orchestration-constellation canvas as the stage; headline + subhead + CTA anchored bottom-left on the grid, not centered. The animation IS the layout.  _(fixes lopsided: Replaces a centered glow-puddle with an intentional weighted composition: heavy text mass lower-left, motion energy upper-right, balanced on the grid diagonal.)_
- **Operating model** [Hero + margin notes]: One large central orchestration diagram (humans -> orchestrator -> 5 crews) owns 65% of the band; short labeled callouts sit in the side margins.  _(fixes lopsided: Single dominant focal object with symmetric radial crew placement removes any left/right tilt.)_
- **Solution 1 - Orchestration crew** [Editorial 58/42 split (image left)]: Live constellation/graph mockup left at 58%, copy right at 42%. Hue key: cyan.  _(fixes lopsided: Fixed frame size + balanced optical mass; alternation starts here.)_
- **Solution 2 - Forecasting crew** [Editorial 58/42 split (image right)]: Forecast-cone mockup right at 58%, copy left. Hue key: teal-green.  _(fixes lopsided: Mirror of section 1 keeps the page rhythmically symmetric while feeling fresh.)_
- **Solution 3 - Pipeline / data crew** [Editorial 58/42 split (image left)]: Pipeline DAG refinery mockup left, copy right. Hue key: deep blue.  _(fixes lopsided: Same module size as 1 and 2 enforces repetition; only content and hue change.)_
- **Solution 4 - Reliability / ops crew** [Editorial 58/42 split (image right)]: Self-healing heartbeat mockup right, copy left. Hue key: aqua.  _(fixes lopsided: Continues the L/R alternation; identical baseline keeps verticals aligned.)_
- **Solution 5 - Build / delivery crew** [Editorial 58/42 split (image left)]: Assembling-blueprint mockup left, copy right. Hue key: steel cyan.  _(fixes lopsided: Closes the alternation set with the same frame; five sections read as one disciplined family.)_
- **Integrations** [Symmetric module grid]: Centered 6-col logo/connector grid that animates connection lines from each integration into a central orchestrator node on scroll.  _(fixes lopsided: Pure symmetry by design; the only fully-symmetric band, used as a visual rest.)_
- **Results** [Single focus]: One oversized animated metric (count-up + sparkline that draws as it counts) flanked by two smaller supporting stats.  _(fixes lopsided: Clear 60/20/20 hierarchy instead of three equal cards.)_
- **Founders + CTA** [Hero + margin notes / single focus]: Founders as a balanced 2-up with consistent portrait crops; CTA band below is a single centered focal call with the constellation motif echoed faintly behind.  _(fixes lopsided: Matched portrait crops and a symmetric closing band bookend the page against the hero.)_

## Background depth system
Problem: A single full-opacity busy teal image sits behind copy in every section, low-contrast and identical, so text fights the background and the whole page flattens into one muddy hue.

Technique: Replace per-section images with a 3-layer parallax depth stack rendered in-engine (Canvas/CSS) plus an optional low-opacity generative texture, masked by a directional scrim. Each section shifts hue 18-24 degrees within the locked ocean palette so they are siblings, not clones. Backgrounds are quiet by default and only brighten where there is no text.

Layers:
- Base: near-black ocean gradient (radial from #06121A to #020608), fixed.
- Volumetric texture: low-opacity (8-14%) generative fog/caustics WebP or CSS, blurred 20-40px, parallax at 0.3x scroll.
- Accent: a single crew-hued light shape (soft conic/radial) parallaxing at 0.6x, positioned opposite the text mass for balance.
- Scrim: directional linear-gradient mask (transparent -> 70% base) on the text side to guarantee contrast.
- Grain: 2-3% monochrome film grain overlay to kill banding and the 'AI plastic' look.

Contrast: Keep background luminance under ~12% behind any text region; body copy >= 4.5:1, large headings >= 3:1 (WCAG 2.2 AA). Scrim opacity tuned per section so the brightest accent never lands behind a paragraph. Verify with a contrast checker before ship.

## Meaningful animations (each = a true picture of what we do)
### Orchestration constellation (hero + operating model)
- shows: A human goal enters the orchestrator node; it spawns task tokens that travel along edges to 5 crew clusters, which light up, do work, and return result pulses back to center.
- why meaningful: It is a literal picture of our core product: an LLM mesh-orchestrator dispatching autonomous agent crews and aggregating their results. The node count = our 5 crews; token flow = real task dispatch.
- how to build: Canvas2D or lightweight WebGL force-directed graph. Pre-baked node layout (no live physics) for determinism; animate tokens as eased point-to-point tweens along bezier edges; crew clusters pulse on token arrival. Drive with requestAnimationFrame, ~120 particles max. GSAP timeline for the hero one-shot.
- perf/a11y: prefers-reduced-motion -> render the final static graph as an SVG poster. IntersectionObserver pauses the loop off-screen. Transform/opacity compositing only, DPR capped at 2, 16ms frame budget. Provide an aria-label describing the diagram.
### Pipeline DAG fill (Pipeline / data crew)
- shows: A dependency graph where nodes illuminate in topological order, edges fill like liquid as upstream stages complete, and a 'now running' marker advances through the DAG.
- why meaningful: Shows autonomous multi-stage pipeline execution with real dependency ordering, not random flow. Mirrors how a crew chains fetch -> compute -> validate -> ship.
- how to build: Inline SVG DAG with stroke-dashoffset edge-fill animation and staggered node opacity keyed to a defined dependency order. Sequence with a small JS scheduler or GSAP timeline. Vector = crisp at any zoom.
- perf/a11y: SVG is cheap; pause via IntersectionObserver. Reduced-motion shows the completed DAG. Nodes get title elements for screen readers.
### Forecast cone (Forecasting crew)
- shows: A solid historical line advances to 'now', then unfurls into a probabilistic fan (p10/p50/p90 bands) projecting forward, with the median path drawn last.
- why meaningful: Forecasting is a real capability; the widening cone is the honest visual grammar of probabilistic prediction, not a fake stock chart wiggle.
- how to build: SVG paths: animate the historical line with stroke-dashoffset, then animate band areas expanding via clip-path/scaleY from the 'now' x-anchor. Real-ish sample series baked in JSON for believable shape.
- perf/a11y: Single SVG, draws once on scroll-in. Reduced-motion renders the full cone immediately. Describe via aria (history + projected range).
### Self-healing heartbeat (Reliability / ops crew)
- shows: A steady ECG-like reliability signal scrolls left; an anomaly spike appears, a detector ring locks onto it, the system routes around it, and the signal returns to baseline (green).
- why meaningful: Directly depicts reliability + autonomous self-healing (our watchdog/heartbeat organs). The recovery is the message.
- how to build: Canvas2D scrolling waveform (ring buffer of points) with a scripted anomaly event on a timer; detector ring is an animated stroke-circle; color tween baseline->alert->healed. Deterministic, ~1 draw call.
- perf/a11y: Capped FPS (30 is enough for a waveform), pause off-screen, reduced-motion shows a single static 'caught + healed' frame.
### Agent-swarm convergence (Orchestration crew detail)
- shows: Many small agent dots dispatch in parallel from the orchestrator, each lands on a sub-task tile, tiles flip to 'done', and the swarm reconverges into one aggregated result.
- why meaningful: Shows real parallelism and fan-out/fan-in of an agent mesh, the thing competitors cannot demo because they run single-threaded chatbots.
- how to build: Canvas particles with eased dispatch -> dwell -> return paths; sub-task tiles are DOM/SVG that flip via rotateY. Stagger for legibility, cap ~60 agents.
- perf/a11y: IntersectionObserver gating, reduced-motion shows the final 'all done + aggregated' state, transforms only.
### Integrations stitch (Integrations grid)
- shows: On scroll, connector lines draw from each integration logo into a central orchestrator node, then a pulse runs the loop once to show data is now flowing through us.
- why meaningful: Communicates that we sit at the orchestration center of the customer's existing stack, not bolted on. Line count = real integration count.
- how to build: SVG connectors with stroke-dashoffset draw-on, then a single traveling-pulse along each path. Symmetric radial layout.
- perf/a11y: Draw-once on scroll-in, reduced-motion shows static stitched lines, decorative role with aria-hidden where redundant with text.

## Asset plan
**Regenerate**
- [image] Hero background plate (behind the constellation) - 3840x2160 source -> 2560-wide WebP q82 / FLUX.1-dev (comfy-render-still photoreal path): Deep ocean abyss with subtle volumetric god-light from upper-right, fine caustics, heavy negative space lower-left for text. No subjects, no neon, no lens flare. Cinematic but restrained, film-grain finish.
- [image] 5 solution-section background plates - 3840x2160 source -> 2560-wide WebP q82 each / FLUX.1-dev, RealVisXL fallback: One coherent abyss family, each shifted 18-24 deg in hue per crew (cyan / teal-green / deep blue / aqua / steel). Quiet, low-detail, text-side kept dark. Consistent grain and depth so they read as a set.
- [image] All 5 product mockups - Vector (resolution-independent) / n/a - hand-built SVG/Canvas, no diffusion: REBUILD AS LIVE SVG/DOM, not raster. Each carries its crew animation (constellation, forecast cone, pipeline DAG, heartbeat, blueprint). Identical frame chrome and size across all five for symmetry.
- [image] Operating-model diagram - Vector / n/a - SVG: Hand-built vector orchestration graph (humans -> orchestrator -> 5 crews) matching the hero animation's geometry, used as the reduced-motion poster.
- [video] Hero ambient motion plate (optional, behind constellation) - 2560x1440 H.265/AV1, 8-12 Mbps, WebP poster / Wan 2.2 via ComfyUI-WanVideoWrapper: Extremely slow caustic light drift only, near-static, as depth under the data animation. No looping subjects, seamless 12s loop, must not visibly reset.
- [image] Founder portraits - 2x retina, WebP / n/a - real photos, do not synth faces: Matched crop, matched key-light direction and color temperature, identical background treatment, so the 2-up is symmetric and premium.
- [image] Grain + scrim overlays - 512px tiling PNG / n/a - generated/exported once: 2-3% monochrome film grain tile and directional scrim PNGs reused site-wide to unify texture and kill AI-plastic banding.

**Cut**
- All 5 generic per-section Wan2.2 decorative video loops (replaced by meaningful in-engine animations).
- Any full-opacity single-image backgrounds (replaced by the 3-layer depth stack).
- Raster product screenshots (replaced by vector SVG/DOM mockups).
- Particle/bokeh and mesh-gradient effects with no data meaning.
- The current lopsided 4-pane solution layout.
- Duplicate teal gradients reused identically across sections.

## Build phases
### Phase 0 - Design tokens + grid foundation - Lock the symmetric scaffold so nothing can drift lopsided again.
- CSS custom properties: 12-col grid, 8px baseline, 1.25 type scale, motion easings/durations.
- Locked ocean palette + 5 per-crew hue keys as tokens.
- Reusable section module (58/42 split with L/R modifier) and the symmetric integrations grid.
### Phase 1 - Background depth system - Replace muddy single images with the quiet 3-layer parallax stack.
- Base gradient + volumetric texture + accent + scrim + grain layers wired with parallax.
- Per-section hue offsets and verified 4.5:1 text contrast.
- Reduced-motion fallbacks (static plates).
### Phase 2 - Meaningful animation engine - Build the 6 data-true animations as reusable, gated components.
- Orchestration constellation (hero + operating model), pipeline DAG, forecast cone, reliability heartbeat, agent swarm, integrations stitch.
- Shared scroll-trigger + IntersectionObserver + prefers-reduced-motion harness.
- Static SVG posters for every animation.
### Phase 3 - Asset regeneration - Produce crisp, native-res backgrounds and rebuild mockups as vector.
- 5 + hero background plates at 3840 source via FLUX.1-dev, exported WebP.
- All 5 product mockups rebuilt as SVG/DOM carrying their crew animation.
- Optional hero ambient video at 2560x1440, matched founder portraits.
### Phase 4 - Layout reassembly - Kill the lopsided split; assemble the symmetric alternating page.
- Hero (stage), operating model (hero+margin), 5 alternating 58/42 solution sections, symmetric integrations, single-focus results, bookended founders/CTA.
- Baseline-aligned verticals and matched module sizes across all five solution bands.
### Phase 5 - Performance + a11y + QA - Prove it is crisp, fast, accessible, and slop-free before ship.
- 60fps verification (transform/opacity only, off-screen pause), Lighthouse + WCAG 2.2 AA contrast pass.
- Retina sharpness check (no upscaled raster), reduced-motion walkthrough.
- Anti-slop self-audit against ai_slop_antipatterns; visual-QA screenshot pass.
## ASSET PATHS (background plates are generated separately and dropped in as files)
The background depth system MUST reference these exact paths, and MUST degrade gracefully
to the base CSS gradient if a file is missing (do not hard-fail if a plate is absent):
- Hero abyss plate:            assets/images/bg/hero-abyss.webp
- Orchestration crew (cyan):   assets/images/bg/crew-orchestration.webp
- Forecasting crew (teal-green):assets/images/bg/crew-forecast.webp
- Pipeline crew (deep blue):    assets/images/bg/crew-pipeline.webp
- Reliability crew (aqua):      assets/images/bg/crew-reliability.webp
- Build crew (steel cyan):      assets/images/bg/crew-build.webp
- Grain tile:                   assets/images/bg/grain.png
- Optional hero ambient video:  assets/video/hero-abyss-drift.mp4 (use as <video> depth layer if present)

Each plate is a 16:9 full-bleed abyss image with dark negative space on the text side.
Use object-fit:cover, the directional scrim over the text side, and the per-section hue.
Treat plates as the 'volumetric texture'/'accent' layers in the 3-layer stack; the base
gradient + scrim + grain are CSS so the page looks finished even before plates load.
