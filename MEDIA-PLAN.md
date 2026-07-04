# Deeper (DPR Labs) — Video + Animation Plan

*How we produce every moving/visual asset. Aesthetic: "quiet engineering
confidence" — deep-water dark (Abyss #07090D), one teal signal (#2DD4BF), one
amber human accent (#F4B860), sonar/instrument texture, slow deliberate motion.
Anti-slop: no glowing brains, no robots, no neon swirl, no people, no on-image
text, heavy negative space.*

Tooling that already exists on this box (RTX 5090):
- **Video:** `generate_videos.py` → ComfyUI **Wan 2.2 T2V 14B** (high+low noise
  dual-sampler, umt5 text encoder, wan2.1 VAE, 16 fps, length `4n+1`).
- **Stills:** `generate_images_flux.py` → ComfyUI **Flux schnell fp8** (6 steps).
- ComfyUI server: `http://127.0.0.1:8188` (start it before running either script).

---

## The split: generate vs. hand-code

**ComfyUI generates (atmosphere, texture, cinema):** things that are organic,
lit, grainy, and benefit from "expensive fine-art" rendering. Backgrounds, the
hero ambient, section mood plates, blog headers.

**Hand-code in CSS/Canvas/SVG (precision, interactivity, anything with meaning):**
the sonar grid overlay, "the number" count-ups, scroll reveals, the data-flow
lines with node checkpoints, the honest-proof scorecard reveal, accordions,
focus rings, scroll-progress. These must be crisp, controllable, accessible, and
change per content — generation would produce blurry, uncontrollable slop and
can't carry real numbers/labels. **Never generate anything with text or a UI in
it** — the NEG prompt already fights this; we win by not asking for it.

Every generated video ships with: a **poster still** (first frame, `.jpg`) for
`prefers-reduced-motion` + fast first paint, a **compressed `.mp4` (h264)** and a
**`.webm` (vp9/av1)** twin, `preload="none"`, and IntersectionObserver play/pause
(already handled by `media.js`). Reduced-motion visitors only ever see the poster.

---

## A. Videos to generate with Wan 2.2 T2V (`generate_videos.py`)

Aesthetic is already correct in the current script; we re-scope the job list to
the new sections. Target ≤ ~1.2 MB per loop after compression (see §D). Render
at listed size, then downscale/compress.

| id | Where it lives | What it shows | Size | Frames |
|---|---|---|---|---|
| `hero-abyss` | Home hero background (full-bleed) | Near-black telemetry void, faint receding hairline grid, a few slow teal LED pinpoints drifting in depth, volumetric haze, 16mm grain, mostly empty | 832×480 | 81 |
| `dive` | Hero scroll "surface→deep" transition | Slow descent: a faint bright surface at top recedes upward as thin teal light-shafts and grid deepen into black — one continuous downward drift | 768×768 | 97 |
| `pillar-consulting` | "Agentic AI that ships" section plate | A single teal light-line carries discrete packets left→right; each briefly brightens at a small node checkpoint then dims. Metronomic, vast black space | 768×768 | 81 |
| `pillar-investors` | "Investor relations" section plate | A few dim teal nodes; one node sends a single teal line toward two others, then one soft amber dot pulses once (the "right connection") and fades | 832×480 | 81 |
| `pillar-shipping` | "Product shipping" section plate | A blank dim card rises from the depth into focus; a slow teal scan-line sweeps it and a small amber dot settles at its edge (idea→shipped) | 608×768 | 81 |
| `proof-sonar` | Proof / scorecard section ambience | Slow single sonar sweep ring expanding across a faint grid, one teal blip returning, otherwise still and dark | 832×480 | 81 |
| `closing-surface` | Final CTA background | Calm dark water seen from just below the waterline, faint teal glow breaking through, very slow, quiet | 832×480 | 81 |

Reuse from existing library where good enough: `hero-plate.mp4`,
`accent-data-flow.mp4`, `accent-agents.mp4`, `accent-invoice.mp4` map cleanly to
the above and can seed prompts. **Drop the slop-risk legacy clips**
(`robot-loop`, `neural-loop`, `room-loop`, `hud-loop`) — they fight the new
restraint aesthetic.

Prompt discipline (per clip): deep-water dark, one teal signal + <1% amber, plain
round dots/blank cards with **no markings**, slow deliberate motion, fine film
grain, huge empty negative space, no glow bloom. Keep the existing strong `NEG`.

## B. Stills to generate with Flux schnell (`generate_images_flux.py`)

Re-scope to the dark direction (current stills are the old cream/underwater look).

| id | Use | Prompt direction | Size |
|---|---|---|---|
| `hero-poster` | Hero reduced-motion poster / OG image | Exact first-frame look of `hero-abyss`: telemetry void, hairline grid, teal pinpoints | 1344×768 |
| `og-card` | Social share card (no text; text added in HTML/CSS overlay) | Deep-water dark with a single teal signal arc, generous margin for a headline overlay | 1200×630 |
| `pillar-consulting/investors/shipping` posters | Section video posters | First-frame stills of each pillar clip | 768×768 |
| `blog-abyss-1..5` | Field Notes header textures (one per pillar) | Abstract dark instrument textures, distinct hue-lean per pillar, no subjects | 1344×768 |
| `favicon/orb` | Brand mark | Already have `regenerate_orb.py` — keep; recolor to teal-on-abyss | 512×512 |

## C. Hand-coded motion (CSS / Canvas / SVG — NOT ComfyUI)

Owned by the site's JS (`script.js`, `transitions.js`, `dpr.js`, `widgets.js`,
`bg.js`) and specced in `INTERACTION-SPEC.md`:

1. **Sonar hairline grid overlay** — CSS/SVG on the hero, drawn crisp at any DPR.
2. **"The number" count-ups** — JS, `tabular-nums`, freeze at final under
   reduced-motion.
3. **Scroll-reveal editorial spine** — IntersectionObserver, once-only, staggered.
4. **Data-flow line + node checkpoints** where it must be pixel-crisp and labeled
   — inline SVG, not video.
5. **Honest-proof scorecard reveal** (before→after→method→caveat) — CSS.
6. **"Your fears, answered" accordion**, mobile menu, scroll-progress, magnetic
   buttons, focus rings — all hand-coded, fully keyboard/ARIA.

---

## D. Post-processing pipeline (ffmpeg — after ComfyUI renders)

ComfyUI raw MP4s are too heavy (current `tunnel-loop` is 4 MB). Every clip goes
through a compress + seamless-loop + twin-format step:

```
# seamless loop (crossfade tail into head) + compress mp4
ffmpeg -i raw.mp4 -vf "scale=-2:720,minterpolate=fps=24" -c:v libx264 -crf 26 \
  -preset slow -pix_fmt yuv420p -movflags +faststart -an out.mp4
# webm twin (smaller, modern browsers)
ffmpeg -i out.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -an out.webm
# poster still (first frame)
ffmpeg -i out.mp4 -frames:v 1 -q:v 3 out-poster.jpg
```

Budget: hero ≤ 1.5 MB, section plates ≤ 800 KB each, total page video ≤ ~4 MB.
Serve `<video>` with `<source webm>` first, `<source mp4>` fallback, `poster=`
set, `preload="none"`, `muted loop playsinline`.

## E. Production workflow (run order)

1. Start ComfyUI (`http://127.0.0.1:8188`), confirm `/system_stats` responds.
2. Re-scope the `JOBS` lists in `generate_videos.py` and `generate_images_flux.py`
   to §A/§B, in the dark palette.
3. `python generate_images_flux.py` (fast, iterate prompts first — cheap preview).
4. `python generate_videos.py hero` → review → then full run. ~2–6 min/clip on 5090.
5. Run the §D ffmpeg pass → write to `assets/video/*.mp4|.webm` + `assets/img/*-poster.jpg`.
6. Wire into the rebuilt HTML with poster + dual `<source>` + reduced-motion.
7. Visual QA (Playwright): confirm each video plays on scroll, poster shows under
   reduced-motion, no console/network errors, page weight within budget.

## F. Anti-slop acceptance bar (reject + re-render if any fail)

- No text/letters/numbers/logos baked into any frame.
- No people, faces, hands, robots, brains, neon swirls, particle nebulae.
- Reads as an instrument panel, not a SaaS billboard; ≥ 60% empty dark space.
- Motion is slow and calm (no shake, no fast zoom); loops seamlessly.
- Only one teal signal; amber < 1% of frame; no gloss/bloom/plastic sheen.
