/* DPR intro.js — "the instrument boots" calibration sequence (homepage signature).
   Counts a mono readout 0.00->1.00, fires a hairline sweep, then reveals the hero.
   Skippable (click/key/scroll/touch), runs once per session, honors reduced-motion, safe with no-JS. */
(function () {
  "use strict";
  var cal = document.getElementById("calibrate");
  if (!cal) return;
  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var seen = false;
  try { seen = sessionStorage.getItem("dpr_calibrated") === "1"; } catch (e) {}
  var body = document.body;

  function remove() { if (cal && cal.parentNode) cal.parentNode.removeChild(cal); }
  function markSeen() { try { sessionStorage.setItem("dpr_calibrated", "1"); } catch (e) {} }

  if (RM || seen) {
    remove();
    body.classList.add("calibrated");
    markSeen();
    return;
  }

  body.classList.add("calibrating");
  var num = document.getElementById("calNum");
  var tick = cal.querySelector(".cal-tick");
  var dur = 950, t0 = null, done = false, safety;

  function finish() {
    if (done) return;
    done = true;
    clearTimeout(safety);
    cal.classList.add("sweep");
    setTimeout(function () {
      cal.classList.add("done");
      body.classList.remove("calibrating");
      body.classList.add("calibrated");
      setTimeout(remove, 620);
    }, 300);
    markSeen();
  }
  function skip() {
    if (done) return;
    if (num) num.textContent = "1.00";
    if (tick) tick.style.width = "100%";
    finish();
  }
  ["click", "keydown", "wheel", "touchstart"].forEach(function (ev) {
    window.addEventListener(ev, skip, { once: true, passive: true });
  });
  // safety: never trap the page behind the overlay
  safety = setTimeout(skip, 2600);

  function step(ts) {
    if (done) return;
    if (!t0) t0 = ts;
    var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    if (num) num.textContent = e.toFixed(2);
    if (tick) tick.style.width = (e * 100) + "%";
    if (p < 1) requestAnimationFrame(step);
    else finish();
  }
  requestAnimationFrame(step);
})();
