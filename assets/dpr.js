/* DPR 2026 — homepage motion controller.
   No build step, single IIFE. Everything null-guarded so partial pages never throw.
   Provides: [data-reveal] scroll reveal (+ [data-stagger] child indexing),
   a shared rAF --sp scroll-progress ticker for [data-sp] sections,
   off-screen <video data-io> pause/play, all gated by prefers-reduced-motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // ---- stagger indices: set --i on direct [data-rvl] children of [data-stg] ----
    [].forEach.call(document.querySelectorAll("[data-stg]"), function (parent) {
      var kids = parent.querySelectorAll(":scope > [data-rvl]");
      [].forEach.call(kids, function (el, i) {
        el.style.setProperty("--i", Math.min(i, 6));
      });
    });

    // ---- reveal ----
    var reveals = [].slice.call(document.querySelectorAll("[data-rvl]"));
    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
        });
      }, { threshold: [0, 0.15, 0.5], rootMargin: "-8% 0px -8%" });
      reveals.forEach(function (el) { io.observe(el); });
    }

    // ---- off-screen video pause/play (perf) ----
    var vids = [].slice.call(document.querySelectorAll("video[data-io]"));
    if (vids.length && "IntersectionObserver" in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var v = e.target;
          if (e.isIntersecting) { if (!reduce && v.play) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
          else if (v.pause) { v.pause(); }
        });
      }, { threshold: 0.1 });
      vids.forEach(function (v) { vio.observe(v); });
    }

    // ---- shared --sp scroll-progress ticker (one rAF loop for all [data-sp]) ----
    var spEls = [].slice.call(document.querySelectorAll("[data-sp]"));
    if (spEls.length && !reduce) {
      var ticking = false;
      function frame() {
        ticking = false;
        var vh = window.innerHeight || document.documentElement.clientHeight;
        for (var k = 0; k < spEls.length; k++) {
          var el = spEls[k], r = el.getBoundingClientRect();
          var total = r.height + vh;
          var p = total > 0 ? (vh - r.top) / total : 0;
          p = p < 0 ? 0 : p > 1 ? 1 : p;
          el.style.setProperty("--sp", p.toFixed(4));
        }
      }
      function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      frame();
    }
  });
})();
