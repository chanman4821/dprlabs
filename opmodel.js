/* opmodel.js — "How we run it" operating-model flow diagram engine for DPR / Deeper.
   - Marching dashed SVG connectors + cycling status labels, started on scroll
     via IntersectionObserver (threshold ~0.25), mirroring the existing reveal system.
   - prefers-reduced-motion: bail out completely. The DOM is authored in a clean,
     fully legible STATIC state (first-state status words, faint static connectors,
     no dots/pulsing), so reduced-motion / no-JS visitors see the same meaning with
     zero motion. CSS gates every animation behind `.opm-stage.is-running`, which is
     only ever added here when motion is allowed.
   - Touches nothing else on the page. */
(function () {
  'use strict';

  var stage = document.querySelector('[data-opmodel]');
  if (!stage) return;

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduce = !!(mq && mq.matches);

  var cyclers = Array.prototype.slice.call(stage.querySelectorAll('[data-states]'));
  var timers = [];

  function states(el) {
    return (el.getAttribute('data-states') || '')
      .split('|')
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
  }

  function startCycling() {
    cyclers.forEach(function (el, i) {
      var list = states(el);
      var word = el.querySelector('.opm-cyc-word');
      if (!word || list.length < 2) return;
      var idx = 0;
      // Slightly different periods so crews don't all flip in unison.
      var period = 2200 + i * 130;
      var t = window.setInterval(function () {
        idx = (idx + 1) % list.length;
        word.textContent = list[idx];
      }, period);
      timers.push(t);
    });
  }

  function stopCycling() {
    timers.forEach(function (t) { window.clearInterval(t); });
    timers = [];
    // Restore the steady first-state word (the static representative label).
    cyclers.forEach(function (el) {
      var list = states(el);
      var word = el.querySelector('.opm-cyc-word');
      if (word && list.length) word.textContent = list[0];
    });
  }

  function run() {
    if (stage.classList.contains('is-running')) return;
    stage.classList.add('is-running');
    startCycling();
  }

  function halt() {
    if (!stage.classList.contains('is-running')) return;
    stage.classList.remove('is-running');
    stopCycling();
  }

  // Reduced motion: never animate. Leave the authored static frame untouched.
  if (reduce) return;

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) run(); else halt();
      });
    }, { threshold: 0.25 });
    io.observe(stage);
  } else {
    // No IO support: just turn it on.
    run();
  }

  // If the user flips reduced-motion on at runtime, stop and reset to static.
  if (mq) {
    var onChange = function () { if (mq.matches) halt(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();
