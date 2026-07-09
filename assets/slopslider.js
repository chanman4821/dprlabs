/* slopslider.js — self-initializing "drag to compare" graphic.
   Any element with [data-slop] and .ss-range + .ss-slop/.ss-sharp panes becomes a
   draggable before/after: left = generic AI slop, right = sharp/specific. Counts are
   read from the number of <mark> spans in each pane (no fabricated numbers). */
(function () {
  "use strict";
  function init(el) {
    var range = el.querySelector(".ss-range");
    if (!range) return;
    var slopN = el.querySelectorAll(".ss-slop .ss-text mark").length;
    var sharpN = el.querySelectorAll(".ss-sharp .ss-text mark").length;
    var cs = el.querySelector(".ss-count-slop b");
    var cg = el.querySelector(".ss-count-sharp b");
    if (cs) cs.textContent = slopN;
    if (cg) cg.textContent = sharpN;
    function upd() { el.style.setProperty("--split", range.value + "%"); }
    range.addEventListener("input", upd);
    upd();
  }
  function boot() {
    var nodes = document.querySelectorAll("[data-slop]");
    for (var i = 0; i < nodes.length; i++) init(nodes[i]);
  }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
