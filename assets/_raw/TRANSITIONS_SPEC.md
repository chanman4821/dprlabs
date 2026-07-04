# TRANSITIONS + IMAGERY SPEC — "coolest site alive" layer

Scope: weave the 7 ComfyUI high-tech images into the DPR "Deeper" site as cinematic
backdrops, and add premium screen-to-screen + menu-to-menu transitions. Vanilla
stack only. Ocean palette. WCAG 2.2 AA + prefers-reduced-motion. Do NOT touch the
5 product mockups or the solutions.js tab controller logic (visual-only additions
around them). Files ONLY in C:\Users\dennha\programs\dpr.

## Image inventory (already in assets/images/tech/, 1216x832 unless noted)
- hero-nexus.png    — glowing cyan particle field on dark water  -> HERO ambient
- tech-hud.png      — futuristic control-panel macro             -> Strategy section ambient
- tech-neural.png   — neural core (1024x1024), cyan/violet        -> Custom-builds section ambient
- tech-pipeline.png — data packets along glowing conduits         -> Automation section ambient
- tech-forecast.png — 3D holographic chart w/ axes on dark grid   -> Analytics section ambient
- tech-room.png     — dark futuristic ops room, teal screens      -> Enablement section ambient
- tech-tunnel.png   — data tunnel w/ light rails                  -> SECTION-TO-SECTION transition wipe

## A. Imagery wiring (visual depth, not literal UI)
1. HERO: layer hero-nexus.png as a full-bleed, darkened (brightness ~.55), slowly
   parallax-drifting background behind the existing hero copy/CTA. Add a soft radial
   vignette + the existing teal gradient on top so text stays AA-legible
   (contrast >= 4.5:1). Subtle scale(1.06)->(1.0) on load.
2. Each solution `section.solution`: place its mapped tech image as a faint ambient
   layer (opacity .12-.20, blur(2px), mix toward --sol accent) BEHIND the existing
   `.sol-visual` mockup, so each screen has its own atmospheric backdrop. Must not
   reduce mockup legibility. Replace/augment the current `img.sol-amb` source.
3. Lazy-load all backdrops (`loading="lazy"` + `decoding="async"`); hero eager.

## B. Screen-to-screen transitions (scroll-driven)
1. Reveal-on-scroll: each major section fades + rises 24px into place via
   IntersectionObserver (one-shot, threshold ~.15). Stagger child cards 60ms.
2. Parallax depth: section ambient images translateY at ~0.15x scroll; foreground
   mockups at 0; creates depth between screens. Use transform only (GPU), rAF-throttled.
3. "Data tunnel" wipe between the solutions block and the next major section: a thin
   full-width band using tech-tunnel.png that scales/brightens as it enters, selling a
   warp between screens. Tasteful, ~120-160px tall, not a full takeover.
4. Sticky section cross-fade: as one solution scrolls out and the next pins, ambient
   backdrops cross-fade (opacity tied to scroll progress) so screens morph, not cut.

## C. Menu-to-menu transitions
1. Desktop sub-nav: animated active indicator (underline/pill) that SLIDES between
   items (FLIP or transform) instead of snapping; smooth-scroll to target with eased
   offset for the sticky header.
2. Scroll-spy hand-off: active nav item updates with a soft 200ms color/indicator
   tween as sections pass (reuse existing scrollspy; add the moving indicator).
3. Mobile menu: slick open/close — panel slides/fades in, items stagger in (40ms),
   backdrop blur; trap focus, close on Esc, restore focus (a11y). Hamburger morphs to X.
4. Header state: transparent over hero -> frosted/blurred solid after ~80px scroll,
   transitioned (background, blur, border) over 250ms.

## D. Motion + a11y rules (hard)
- ALL of the above gated by `prefers-reduced-motion: reduce`: no parallax, no
  auto-movement, instant reveals, static backdrops, indicator jumps without tween.
- Use transform/opacity only; add `will-change` only on actively-animating elements.
- 60fps target; rAF-throttle scroll; disconnect observers after one-shot reveals.
- No layout shift (reserve image space / aspect-ratio). No horizontal scroll at 360px.
- Keep all existing functionality (tabs, auto-advance, pause, carousel, form) intact.

## E. Implementation shape
- New `transitions.js` loaded LAST (after mockups.js). Owns reveal observer, parallax
  rAF loop, header-state, sub-nav moving indicator, mobile-menu controller. One
  `prefersReduced()` guard at top; everything no-ops when true.
- New CSS in styles.css under a `/* === transitions layer === */` block: `.reveal`,
  `.is-in`, `.amb-bg`, `.tunnel-wipe`, header `.is-stuck`, `.subnav-ind`, mobile-menu.
- Reuse existing tokens (--sol, --surface, --ink, --cyan). No new fonts/deps.

## Verify (worker self-check on http://127.0.0.1:8090)
- Zero console/page errors (normal + reduced-motion + 360px).
- Hero shows nexus backdrop, text still AA-legible.
- Each solution shows its own ambient backdrop; mockups still crisp.
- Scrolling: sections reveal, parallax depth visible, tunnel wipe fires, backdrops
  cross-fade between sticky solutions.
- Sub-nav indicator slides; header frosts after scroll; mobile menu animates + traps
  focus + closes on Esc.
- prefers-reduced-motion: everything static/instant, no movement.
- Report exact files + line ranges changed.

## Out of scope
- The 5 product mockups + mockups.js (already upgraded).
- Copy, section order, palette, fonts, pricing/contact logic.
- Any Wan/video work (handled separately as an optional background-loop layer).
