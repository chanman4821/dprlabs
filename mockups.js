/* mockups.js — micro-animation engine for the in-page product mockups.
   Vanilla, no deps. Coexists with solutions.js (the tab controller).
   Rules:
   - Motion runs ONLY while a mockup is on-screen AND motion is allowed.
   - Reduced-motion (or no JS) => the DOM-authored final frame is shown, untouched.
   - All looping CSS motion is gated behind .mockup.fx-run, toggled here. */
(function () {
  'use strict';
  if (typeof document === 'undefined' || !document.querySelectorAll) return;

  var EASE = 'cubic-bezier(.22,.61,.36,1)';
  var RM = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false, addEventListener: null, addListener: null };

  function toArr(x) { return Array.prototype.slice.call(x); }

  function makeController(mockup) {
    var timers = [], rafs = [], stimers = [], live = false, vis = false, cursor = null;
    var stream = mockup.querySelector('.mk-asst .mk-stream');
    var cmsgB = mockup.querySelector('.cmsg.b .cmsg-t');
    var chips = toArr(mockup.querySelectorAll('.mk-chip-num'));
    var finals = new Map();

    function cap(el) { if (el && !finals.has(el)) finals.set(el, el.textContent); }
    chips.forEach(cap); cap(stream); cap(cmsgB);

    function T(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
    function R(fn) { var id = window.requestAnimationFrame(fn); rafs.push(id); return id; }
    function S(fn, ms) { var id = setTimeout(fn, ms); stimers.push(id); return id; }
    function clearScene() { stimers.forEach(clearTimeout); stimers = []; }
    function clearAll() {
      timers.forEach(clearTimeout); timers = [];
      stimers.forEach(clearTimeout); stimers = [];
      rafs.forEach(window.cancelAnimationFrame); rafs = [];
    }

    function ensureCursor() {
      if (cursor) return cursor;
      cursor = document.createElement('div');
      cursor.className = 'mk-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M4 2l7 18 2.6-7.4L21 10z" fill="#fff" stroke="#04121a" ' +
        'stroke-width="1.2" stroke-linejoin="round"/></svg>' +
        '<span class="ripple"></span>';
      mockup.appendChild(cursor);
      return cursor;
    }
    function moveCursor(target, glide) {
      if (!cursor || !target) return;
      var mr = mockup.getBoundingClientRect(), tr = target.getBoundingClientRect();
      if (!tr.width && !tr.height) return;
      var x = tr.left - mr.left + tr.width * 0.5 - 2;
      var y = tr.top - mr.top + tr.height * 0.5 - 2;
      cursor.style.transition = glide
        ? 'transform .85s ' + EASE + ', opacity .3s'
        : 'opacity .3s';
      cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    }
    function clickPulse() {
      if (!cursor) return;
      cursor.classList.remove('click');
      void cursor.offsetWidth;
      cursor.classList.add('click');
    }

    function streamText(el, text, sched) {
      if (!el || text == null) return;
      sched = sched || T;
      el.classList.add('is-typing');
      el.textContent = '';
      var i = 0;
      (function step() {
        if (!live) return;
        el.textContent = text.slice(0, i);
        i++;
        if (i <= text.length) sched(step, 24);
        else el.classList.remove('is-typing');
      })();
    }

    function countUp(el) {
      if (!el) return;
      var to = parseFloat(el.getAttribute('data-to'));
      if (isNaN(to)) return;
      var pre = el.getAttribute('data-prefix') || '';
      var suf = el.getAttribute('data-suffix') || '';
      var fin = finals.has(el) ? finals.get(el) : el.textContent;
      var t0 = 0;
      function fmt(n) { return pre + Math.round(n).toLocaleString('en-US') + suf; }
      el.textContent = fmt(0);
      R(function tick(now) {
        if (!live) return;
        if (!t0) t0 = now;
        var p = Math.min(1, (now - t0) / 900);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(to * e);
        if (p < 1) R(tick); else el.textContent = fin;
      });
    }

    function drawLine(el, dur, delay) {
      if (!el || typeof el.getTotalLength !== 'function') return;
      var len;
      try { len = el.getTotalLength(); } catch (e) { return; }
      if (!len) return;
      el.style.transition = 'none';
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      el.getBoundingClientRect();
      S(function () {
        if (!live) return;
        el.style.transition = 'stroke-dashoffset ' + dur + 'ms ease';
        el.style.strokeDashoffset = '0';
        S(function () {
          el.style.transition = '';
          el.style.strokeDasharray = '';
          el.style.strokeDashoffset = '';
        }, dur + 80);
      }, delay);
    }

    function activeScene() {
      var i = mockup.getAttribute('data-active') || '0';
      return mockup.querySelector('.mk-scene[data-scene="' + i + '"]');
    }

    function cursorLoop(scene) {
      ensureCursor();
      var sel = '.th-sort, .gnode.run .gn-ic, .rstep.active .rdot, .cite, ' +
        '.tool.on .tool-dot, .mb:not(.done), .tl-r:not(.done) .tl-dot, ' +
        '.doc-v, .fn-bar, .fc-dot, .rd:not(.done)';
      var targets = toArr(scene.querySelectorAll(sel)).slice(0, 3);
      if (!targets.length) targets = toArr(scene.children).slice(0, 2);
      if (!targets.length) return;
      cursor.classList.add('show');
      moveCursor(targets[0], false);
      var k = 0;
      (function hop() {
        if (!live) return;
        moveCursor(targets[k % targets.length], true);
        S(function () {
          if (!live) return;
          clickPulse();
          k++;
          S(hop, 1500);
        }, 900);
      })();
    }

    function runOnce() {
      streamText(stream, stream ? (stream.getAttribute('data-text') || finals.get(stream)) : null, T);
      chips.forEach(countUp);
      runSceneFx();
    }
    function runSceneFx() {
      var scene = activeScene();
      if (!scene) return;
      var i = mockup.getAttribute('data-active') || '0';
      if (i === '0' && cmsgB && scene.contains(cmsgB)) {
        streamText(cmsgB, cmsgB.getAttribute('data-text') || finals.get(cmsgB), S);
      }
      if (i === '0') {
        var a = mockup.querySelector('.fc-actual'), f = mockup.querySelector('.fc-fore');
        if (a) { drawLine(a, 1000, 250); drawLine(f, 700, 1150); }
      }
      cursorLoop(scene);
    }

    function activate() {
      if (live || RM.matches) return;
      live = true;
      mockup.classList.add('fx-run');
      T(runOnce, 60);
    }
    function teardown() {
      live = false;
      clearAll();
      mockup.classList.remove('fx-run');
      if (cursor) cursor.classList.remove('show', 'click');
      finals.forEach(function (v, el) {
        if (!el) return;
        el.textContent = v;
        if (el.classList) el.classList.remove('is-typing');
      });
      ['.fc-actual', '.fc-fore'].forEach(function (s) {
        var el = mockup.querySelector(s);
        if (el) { el.style.transition = ''; el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; }
      });
    }
    function onSceneChange() {
      if (!live) return;
      clearScene();
      if (cursor) cursor.classList.remove('click');
      S(runSceneFx, 40);
    }

    return {
      mockup: mockup,
      activate: activate,
      teardown: teardown,
      onSceneChange: onSceneChange,
      isVisible: function () { return vis; },
      setVis: function (v) { vis = v; }
    };
  }

  function init() {
    var mocks = toArr(document.querySelectorAll('.mockup'));
    if (!mocks.length) return;
    var ctrls = mocks.map(function (m) {
      var c = makeController(m);
      var mo = new MutationObserver(function () { c.onSceneChange(); });
      mo.observe(m, { attributes: true, attributeFilter: ['data-active'] });
      return c;
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var c = ctrls.filter(function (x) { return x.mockup === en.target; })[0];
          if (!c) return;
          var on = en.isIntersecting && en.intersectionRatio >= 0.3;
          c.setVis(on);
          if (on && !RM.matches) c.activate(); else c.teardown();
        });
      }, { threshold: [0, 0.3, 0.6] });
      ctrls.forEach(function (c) { io.observe(c.mockup); });
    } else {
      ctrls.forEach(function (c) { c.setVis(true); if (!RM.matches) c.activate(); });
    }

    var onRM = function () {
      if (RM.matches) ctrls.forEach(function (c) { c.teardown(); });
      else ctrls.forEach(function (c) { if (c.isVisible()) c.activate(); });
    };
    if (RM.addEventListener) RM.addEventListener('change', onRM);
    else if (RM.addListener) RM.addListener(onRM);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
