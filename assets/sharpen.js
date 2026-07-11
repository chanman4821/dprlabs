/* "Feel the difference" — transform AI slop into sharp facts on tap.
   Toggles state, animates the slop-index gauge + counters, runs a scan sweep,
   auto-demos once on scroll-in. Reduced-motion: instant, no sweep. */
(function () {
  "use strict";
  var el = document.querySelector("[data-sharpen]");
  if (!el) return;
  var btn = el.querySelector("[data-btn]");
  var nEl = el.querySelector("[data-n]");
  var tagEl = el.querySelector("[data-tag]");
  var adjEl = el.querySelector("[data-adj]");
  var factEl = el.querySelector("[data-fact]");
  if (!btn || !nEl) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var sharp = false, anim = null;

  function tween(from, to, dur, cb) {
    if (reduce) { cb(to); return; }
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      cb(Math.round(from + (to - from) * e));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function set(toSharp) {
    if (toSharp === sharp) return;
    sharp = toSharp;
    el.classList.toggle("is-sharp", sharp);
    if (!reduce) { el.classList.remove("is-scanning"); void el.offsetWidth; el.classList.add("is-scanning"); }
    if (tagEl) tagEl.textContent = sharp ? "SHARPENED \u2713" : "AI SLOP DRAFT";
    if (btn.firstChild) btn.firstChild.textContent = sharp ? "Show the slop " : "Sharpen it ";
    tween(sharp ? 91 : 9, sharp ? 9 : 91, 900, function (v) { nEl.textContent = v; });
    if (adjEl) tween(sharp ? 7 : 0, sharp ? 0 : 7, 900, function (v) { adjEl.textContent = v; });
    if (factEl) tween(sharp ? 0 : 7, sharp ? 7 : 0, 900, function (v) { factEl.textContent = v; });
  }

  btn.addEventListener("click", function () { set(!sharp); });

  // auto-demo the transform once when it scrolls into view
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          io.disconnect();
          setTimeout(function () { set(true); setTimeout(function () { set(false); }, 2300); }, 550);
        }
      });
    }, { threshold: 0.55 });
    io.observe(el);
  }
})();
