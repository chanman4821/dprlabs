/* DPR micro.js — premium micro-interactions (magnetic CTAs + hero cursor glow).
   Disabled on touch and prefers-reduced-motion. rAF-throttled. Additive, no deps. */
(function () {
  "use strict";
  var mm = window.matchMedia;
  var RM = mm && mm("(prefers-reduced-motion:reduce)").matches;
  var COARSE = mm && mm("(pointer:coarse)").matches;
  if (RM || COARSE) return;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // magnetic primary buttons — gently follow the cursor, spring back on leave
    document.querySelectorAll(".btn-primary").forEach(function (btn) {
      var raf;
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          btn.style.transform = "translate(" + (mx * 0.16).toFixed(1) + "px," + (my * 0.26).toFixed(1) + "px)";
        });
      });
      btn.addEventListener("pointerleave", function () {
        cancelAnimationFrame(raf);
        btn.style.transform = "";
      });
    });

    // hero cursor glow — a soft indigo light tracks the pointer across the hero
    var hero = document.querySelector(".hero-hub") || document.querySelector(".hero") || document.querySelector(".page-hero");
    if (hero) {
      var glow = document.createElement("div");
      glow.className = "cursor-glow";
      glow.setAttribute("aria-hidden", "true");
      hero.insertBefore(glow, hero.firstChild);
      var graf;
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        cancelAnimationFrame(graf);
        graf = requestAnimationFrame(function () {
          glow.style.setProperty("--gx", x + "px");
          glow.style.setProperty("--gy", y + "px");
          glow.style.opacity = "1";
        });
      });
      hero.addEventListener("pointerleave", function () { glow.style.opacity = "0"; });
    }
  });
})();
