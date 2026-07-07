/* DPR AI — reusable interactive widgets (vanilla JS, no deps). */
(function () {
  "use strict";

  /* ---- One Number Meter -------------------------------------------------- *
   * Reflects the visitor's OWN numbers (no promises, no invented data).
   * Markup: <div class="onm" data-onm data-base="assets/mascot/hero/"> ... */
  var ARC = Math.PI * 90; // length of the semicircle path (r=90)

  function initONM(root) {
    var base = root.getAttribute("data-base") || "assets/mascot/hero/";
    var name = root.querySelector(".onm-name");
    var now = root.querySelector(".onm-now");
    var goal = root.querySelector(".onm-goal");
    var val = root.querySelector(".onm-val");
    var needle = root.querySelector(".onm-needle");
    var pctEl = root.querySelector(".onm-pct");
    var status = root.querySelector(".onm-status");
    var bot = root.querySelector(".onm-mascot img");
    if (!val || !needle || !pctEl || !status) return;

    function setBot(file) {
      if (bot && bot.getAttribute("src") !== base + file) bot.setAttribute("src", base + file);
    }

    function update() {
      var n = parseFloat(now.value), g = parseFloat(goal.value);
      var valid = !isNaN(n) && !isNaN(g) && n > 0;
      var pct = valid ? Math.min(100, Math.round((Math.abs(g - n) / n) * 100)) : 0;
      val.style.strokeDashoffset = String(ARC - (pct / 100) * ARC);
      needle.style.transform = "rotate(" + (-90 + (pct / 100) * 180) + "deg)";
      pctEl.textContent = valid ? pct + "%" : "–";
      if (!valid) { status.textContent = "Name your number"; setBot("hero-2.png"); return; }
      if (pct === 0) { status.textContent = "Same number — pick a goal"; setBot("hero-2.png"); return; }
      status.textContent = (g < n ? "Cut" : "Grow") + " it by " + pct + "%";
      setBot(pct > 40 ? "hero-6.png" : "hero-1.png");
    }

    [name, now, goal].forEach(function (el) { if (el) el.addEventListener("input", update); });
    update();
  }

  function boot() {
    document.querySelectorAll("[data-onm]").forEach(initONM);
  }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
