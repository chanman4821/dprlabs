/* DPR AI — Knowledge Base interactivity: live search, category filter, AI-ready quiz. */
(function () {
  "use strict";

  /* ---- Hub: live search + category filter ---- */
  function initHub() {
    var search = document.getElementById("kbSearch");
    var pills = document.querySelectorAll(".kb-cat-pill");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".kb-card"));
    var grid = document.getElementById("kbGrid");
    var empty = document.getElementById("kbEmpty");
    if (!cards.length) return;
    var activeCat = "all";

    function apply() {
      var q = (search && search.value || "").trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var hay = (c.getAttribute("data-search") || "").toLowerCase();
        var cat = c.getAttribute("data-cat") || "";
        var ok = (activeCat === "all" || cat === activeCat) && (!q || hay.indexOf(q) !== -1);
        c.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      if (empty) empty.style.display = shown ? "none" : "";
    }
    if (search) search.addEventListener("input", apply);
    Array.prototype.forEach.call(pills, function (p) {
      p.addEventListener("click", function () {
        Array.prototype.forEach.call(pills, function (x) { x.classList.remove("on"); });
        p.classList.add("on");
        activeCat = p.getAttribute("data-cat") || "all";
        apply();
      });
    });
    apply();
  }

  /* ---- AI-ready quiz: check the boxes true for you -> readiness score ---- */
  function initQuiz() {
    var quiz = document.getElementById("kbQuiz");
    if (!quiz) return;
    var boxes = Array.prototype.slice.call(quiz.querySelectorAll('input[type="checkbox"]'));
    var pct = quiz.querySelector(".qz-gauge");
    var fill = quiz.querySelector(".qz-fill");
    var verdict = quiz.querySelector(".qz-verdict");
    var next = quiz.querySelector(".qz-next");
    var bot = quiz.querySelector(".qz-out img");
    var base = quiz.getAttribute("data-base") || "../assets/mascot/hero/";
    var bands;
    try { bands = JSON.parse(quiz.getAttribute("data-bands") || "[]"); } catch (e) { bands = []; }
    if (!boxes.length || !pct) return;

    function update() {
      var checked = boxes.filter(function (b) { return b.checked; }).length;
      var score = Math.round((checked / boxes.length) * 100);
      pct.textContent = score + "%";
      if (fill) fill.style.width = score + "%";
      var band = null;
      for (var i = 0; i < bands.length; i++) {
        if (score >= bands[i].min && score <= bands[i].max) { band = bands[i]; break; }
      }
      if (band) {
        if (verdict) verdict.textContent = band.verdict;
        if (next) next.textContent = band.next;
      }
      if (bot) {
        var f = score >= 76 ? "hero-6.png" : score >= 41 ? "hero-1.png" : "hero-2.png";
        if (bot.getAttribute("src") !== base + f) bot.setAttribute("src", base + f);
      }
    }
    boxes.forEach(function (b) { b.addEventListener("change", update); });
    update();
  }

  function boot() { initHub(); initQuiz(); }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
