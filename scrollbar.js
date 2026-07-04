/* scrollbar.js — drive the scroll-reactive scrollbar hue + progress bar.
   Maps scroll progress (0..1) to a hue from cyan (190) to yellow (48). */
(function () {
  'use strict';
  var root = document.documentElement;
  var bar = document.getElementById('scrollProgress');
  var CYAN = 190, YELLOW = 48;
  var raf = 0;

  function update() {
    raf = 0;
    var h = root.scrollHeight - root.clientHeight;
    var y = window.scrollY || window.pageYOffset || root.scrollTop || 0;
    var p = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;
    var hue = (CYAN + (YELLOW - CYAN) * p).toFixed(1);
    root.style.setProperty('--sb-hue', hue);
    root.style.setProperty('--sb-thumb', 'hsl(' + hue + ' 92% 56%)');
    if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(update); }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  /* Lenis (if present) emits scroll on the window too; this stays in sync. */
  update();
})();
