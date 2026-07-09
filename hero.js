/* hero.js — DPR AI hero coordinator.
 * Sets up shared pause/resume for bg.js and mesh-hero.js.
 * - IntersectionObserver: pauses renderers when hero is off-screen.
 * - visibilitychange: pauses renderers when tab is hidden.
 * - window.__heroMobile: flag for renderers to reduce cost on mobile.
 * Must load BEFORE bg.js and mesh-hero.js (preserved by <script> order).
 */
(function () {
  'use strict';

  /* ── Shared pause state ─────────────────────────────────────── */
  /* bg.js and mesh-hero.js read window.__heroPaused and register
     their pause/resume hooks into window.__heroBGPause etc.      */
  window.__heroPaused = false;

  function pause() {
    window.__heroPaused = true;
    if (typeof window.__heroBGPause   === 'function') window.__heroBGPause();
    if (typeof window.__heroMeshPause === 'function') window.__heroMeshPause();
  }

  function resume() {
    window.__heroPaused = false;
    if (typeof window.__heroBGResume   === 'function') window.__heroBGResume();
    if (typeof window.__heroMeshResume === 'function') window.__heroMeshResume();
  }

  /* ── IntersectionObserver — pause when hero leaves viewport ─── */
  var heroEl = document.getElementById('hero');
  if (heroEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { resume(); } else { pause(); }
      });
    }, { threshold: 0 }).observe(heroEl);
  }

  /* ── Tab visibility ─────────────────────────────────────────── */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { pause(); } else { resume(); }
  });

  /* ── Mobile / coarse-pointer flag ──────────────────────────── */
  /* bg.js and mesh-hero.js check this to reduce cost on small/   */
  /* touch screens (fewer particles, lower mesh density).         */
  window.__heroMobile = (
    window.innerWidth < 768 ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  );

})();
