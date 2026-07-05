/* DPR anim.js — reveal / stagger / count-up / SVG draw-in engine.
   Additive: uses data-* hooks so it never conflicts with the legacy .reveal in site.js.
   Hooks: [data-reveal], [data-stagger] (staggers direct children),
          [data-count-to] (+ data-count-from/decimals/prefix/suffix/count-dur),
          [data-draw] on an SVG path/line (draws stroke on view).
   Honors prefers-reduced-motion. Never leaves content hidden. */
(function () {
  "use strict";
  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  function fmt(v, pre, suf, dec) {
    return pre + v.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
  }
  function countUp(el) {
    var to = parseFloat(el.getAttribute("data-count-to"));
    if (isNaN(to)) return;
    var from = parseFloat(el.getAttribute("data-count-from") || "0");
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "";
    var dur = parseInt(el.getAttribute("data-count-dur") || "1150", 10), t0 = null;
    if (RM) { el.textContent = fmt(to, pre, suf, dec); return; }
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e, pre, suf, dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  ready(function () {
    var reveals = [].slice.call(document.querySelectorAll("[data-reveal],[data-stagger]"));
    var counts = [].slice.call(document.querySelectorAll("[data-count-to]"));
    var draws = [].slice.call(document.querySelectorAll("[data-draw]"));
    draws.forEach(function (el) {
      try { var len = el.getTotalLength ? el.getTotalLength() : 1000; el.style.setProperty("--len", Math.ceil(len)); } catch (e) {}
    });
    if (RM || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
      draws.forEach(function (el) { el.classList.add("is-in"); });
      counts.forEach(countUp);
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    draws.forEach(function (el) { io.observe(el); });
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counts.forEach(function (el) { cio.observe(el); });
    // safety net: nothing stays hidden ever
    setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
      draws.forEach(function (el) { el.classList.add("is-in"); });
    }, 2500);
  });
  window.DPRanim = { countUp: countUp };
})();
