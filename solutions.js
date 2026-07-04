/* solutions.js — interaction layer for the DPR "Deeper" redesign.
   Adds: per-solution tab decks (auto-advance + ARIA + keyboard + pause + typing),
   testimonial carousel, sub-nav scrollspy, and contact-form inline validation.
   Pure vanilla. Fully degrades to manual control under prefers-reduced-motion. */
(function () {
  'use strict';

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var AUTO_MS = 6500;          // spec: solution tab auto-advance
  var CAROUSEL_MS = 7000;      // testimonial auto-advance

  /* ---- typewriter for the assistant "value" line ---- */
  function typeInto(el, text) {
    if (!el) return null;
    if (reduce) { el.classList.remove('typing'); el.textContent = text; return null; }
    el.classList.add('typing');
    el.textContent = '';
    var i = 0;
    var speed = Math.max(16, Math.min(46, Math.round(820 / Math.max(1, text.length))));
    var timer = window.setInterval(function () {
      i++;
      el.textContent = text.slice(0, i);
      if (i >= text.length) { window.clearInterval(timer); el.classList.remove('typing'); }
    }, speed);
    return function cancel() { window.clearInterval(timer); el.classList.remove('typing'); };
  }

  /* ---- one solution tab deck ---- */
  function SolutionTabs(section) {
    var tablist = section.querySelector('[role="tablist"]');
    if (!tablist) return;
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var mockup = section.querySelector('.mockup');
    var cap = section.querySelector('.sol-cap');
    var bar = section.querySelector('.sol-progress > span');
    var val = section.querySelector('.mk-val');
    var pauseBtn = section.querySelector('.sol-pause');

    var current = 0;
    var paused = false, hovered = false, focused = false, visible = false;
    var typingCancel = null;
    var rafId = null, startTs = 0, elapsedBefore = 0;

    tablist.setAttribute('aria-orientation', 'vertical');
    if (reduce && pauseBtn) pauseBtn.hidden = true;

    function canRun() { return !reduce && !paused && !hovered && !focused && visible; }

    function clearRaf() { if (rafId) { window.cancelAnimationFrame(rafId); rafId = null; } }

    function step(ts) {
      if (!startTs) startTs = ts;
      var elapsed = elapsedBefore + (ts - startTs);
      var pct = Math.min(100, (elapsed / AUTO_MS) * 100);
      if (bar) bar.style.width = pct + '%';
      if (elapsed >= AUTO_MS) { elapsedBefore = 0; activate(current + 1, false); return; }
      rafId = window.requestAnimationFrame(step);
    }

    function freeze() {
      if (rafId && startTs) elapsedBefore += (window.performance.now() - startTs);
      clearRaf();
    }

    function update() {
      if (canRun()) { if (!rafId) { startTs = 0; rafId = window.requestAnimationFrame(step); } }
      else { freeze(); }
    }

    function activate(i, setFocus) {
      i = ((i % tabs.length) + tabs.length) % tabs.length;
      current = i;
      tabs.forEach(function (t, j) {
        var sel = j === i;
        t.setAttribute('aria-selected', sel ? 'true' : 'false');
        t.tabIndex = sel ? 0 : -1;
        if (panels[j]) panels[j].hidden = !sel;
      });
      if (setFocus) tabs[i].focus();
      if (mockup) mockup.setAttribute('data-active', String(i));
      if (cap) { var c = tabs[i].getAttribute('data-cap'); if (c != null) cap.textContent = c; }
      if (val) {
        if (typingCancel) { typingCancel(); typingCancel = null; }
        typingCancel = typeInto(val, tabs[i].getAttribute('data-val') || '');
      }
      elapsedBefore = 0;
      if (bar) bar.style.width = '0%';
      update();
    }

    tablist.addEventListener('keydown', function (e) {
      var idx = current;
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': idx = current + 1; break;
        case 'ArrowLeft': case 'ArrowUp': idx = current - 1; break;
        case 'Home': idx = 0; break;
        case 'End': idx = tabs.length - 1; break;
        default: return;
      }
      e.preventDefault();
      activate(idx, true);
    });

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { activate(i, false); });
    });

    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        paused = !paused;
        pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
        var lbl = pauseBtn.querySelector('.lbl');
        if (lbl) lbl.textContent = paused ? 'Play' : 'Pause';
        pauseBtn.setAttribute('aria-label',
          paused ? 'Resume auto-advancing examples' : 'Pause auto-advancing examples');
        update();
      });
    }

    section.addEventListener('mouseenter', function () { hovered = true; update(); });
    section.addEventListener('mouseleave', function () { hovered = false; update(); });
    section.addEventListener('focusin', function () { focused = true; update(); });
    section.addEventListener('focusout', function () { focused = false; update(); });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { visible = e.isIntersecting; update(); });
      }, { rootMargin: '-20% 0px -25% 0px', threshold: 0 });
      io.observe(section);
    } else { visible = true; update(); }
  }

  /* ---- sub-nav scrollspy ---- */
  function initScrollspy() {
    var subnav = document.querySelector('.subnav');
    if (!subnav || !('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(subnav.querySelectorAll('a'));
    var map = {};
    links.forEach(function (a) {
      var id = (a.getAttribute('href') || '').replace(/^#/, '');
      var sec = id && document.getElementById(id);
      if (sec) map[id] = a;
    });
    var ids = Object.keys(map);
    if (!ids.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = map[e.target.id];
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    ids.forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* ---- testimonial carousel ---- */
  function initCarousel() {
    var root = document.querySelector('[data-carousel]');
    if (!root) return;
    var track = root.querySelector('.tc-track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.tc-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.tc-dot'));
    var prev = root.querySelector('[data-tc="prev"]');
    var next = root.querySelector('[data-tc="next"]');
    if (!track || slides.length < 2) return;

    var idx = 0, timer = null;
    if (!reduce) track.classList.add('anim');

    function go(i) {
      idx = ((i % slides.length) + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      dots.forEach(function (d, j) {
        if (j === idx) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
    function start() { if (reduce) return; stop(); timer = window.setInterval(function () { go(idx + 1); }, CAROUSEL_MS); }

    if (prev) prev.addEventListener('click', function () { go(idx - 1); start(); });
    if (next) next.addEventListener('click', function () { go(idx + 1); start(); });
    dots.forEach(function (d, j) { d.addEventListener('click', function () { go(j); start(); }); });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(idx - 1); start(); }
      else if (e.key === 'ArrowRight') { go(idx + 1); start(); }
    });

    var x0 = null;
    root.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      x0 = null;
      start();
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0.3 });
      io.observe(root);
    } else { start(); }

    go(0);
  }

  /* ---- contact form inline validation ---- */
  function initForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var name = document.getElementById('cf-name');
    var email = document.getElementById('cf-email');
    var note = document.getElementById('formNote');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setErr(input, on) {
      if (!input) return;
      var field = input.closest('.field');
      if (field) field.classList.toggle('err', on);
      input.setAttribute('aria-invalid', on ? 'true' : 'false');
    }
    function validName() { var ok = !!(name && name.value.trim()); setErr(name, !ok); return ok; }
    function validEmail() { var ok = !!(email && emailRe.test(email.value.trim())); setErr(email, !ok); return ok; }

    function liveCheck(input, fn) {
      if (!input) return;
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('err')) fn();
      });
      input.addEventListener('blur', fn);
    }
    liveCheck(name, validName);
    liveCheck(email, validEmail);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var okN = validName(), okE = validEmail();
      if (!okN || !okE) {
        if (note) note.hidden = true;
        (!okN ? name : email).focus();
        return;
      }
      if (note) note.hidden = false;
      form.reset();
      setErr(name, false);
      setErr(email, false);
    });
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('section.solution'), SolutionTabs);
    initScrollspy();
    initCarousel();
    initForm();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
