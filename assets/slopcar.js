/* Slop carousel controller. Autoplay with rAF progress bar, pause on hover/focus/
   tab-hidden, prev/next + dot tabs, arrow keys, pointer swipe. Reduced-motion:
   no autoplay, no progress bar — manual navigation only. Degrades to slide 1 static. */
(function () {
  "use strict";
  var root = document.querySelector("[data-slopcar]");
  if (!root) return;
  var track = root.querySelector(".slopcar-track");
  var slides = [].slice.call(root.querySelectorAll(".slopslide"));
  var dotsWrap = root.querySelector(".slopcar-dots");
  var bar = root.querySelector(".slopcar-progress span");
  var prev = root.querySelector("[data-prev]");
  var next = root.querySelector("[data-next]");
  var play = root.querySelector("[data-playpause]");
  var n = slides.length;
  if (!track || !n) return;
  var i = 0, raf = null, start = 0, paused = false;
  var DUR = 5200;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  var dots = [];
  slides.forEach(function (s, idx) {
    var b = document.createElement("button");
    b.className = "slopcar-dot"; b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", "Show slop " + (idx + 1) + " of " + n);
    b.addEventListener("click", function () { go(idx, true); });
    dotsWrap.appendChild(b); dots.push(b);
  });

  function render() {
    track.style.transform = "translateX(-" + (i * 100) + "%)";
    slides.forEach(function (s, idx) {
      s.classList.toggle("is-active", idx === i);
      s.setAttribute("aria-hidden", idx !== i ? "true" : "false");
    });
    dots.forEach(function (d, idx) { d.setAttribute("aria-selected", idx === i ? "true" : "false"); });
  }
  function go(idx, user) { i = (idx % n + n) % n; render(); if (user) restart(); }

  function tick(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / DUR, 1);
    if (bar) bar.style.width = (p * 100) + "%";
    if (p >= 1) { start = 0; go(i + 1); }
    raf = requestAnimationFrame(tick);
  }
  function startAuto() { if (reduce || paused) return; stopAuto(); start = 0; raf = requestAnimationFrame(tick); }
  function stopAuto() { if (raf) { cancelAnimationFrame(raf); raf = null; } if (bar) bar.style.width = "0"; }
  function restart() { stopAuto(); if (!paused && !reduce) startAuto(); }

  if (prev) prev.addEventListener("click", function () { go(i - 1, true); });
  if (next) next.addEventListener("click", function () { go(i + 1, true); });
  if (play) play.addEventListener("click", function () {
    paused = !paused;
    play.setAttribute("aria-pressed", String(!paused));
    play.textContent = paused ? "Play" : "Pause";
    if (paused) stopAuto(); else startAuto();
  });

  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", function () { if (!paused) startAuto(); });
  root.addEventListener("focusin", stopAuto);
  root.addEventListener("focusout", function () { if (!paused) startAuto(); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopAuto(); else if (!paused) startAuto();
  });

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1, true); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1, true); }
  });

  var x0 = null;
  track.addEventListener("pointerdown", function (e) { x0 = e.clientX; });
  track.addEventListener("pointerup", function (e) {
    if (x0 == null) return;
    var dx = e.clientX - x0;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1), true);
    x0 = null;
  });

  render();
  if (!reduce) startAuto();
})();
