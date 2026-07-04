/* transitions.js — "coolest site alive" imagery + motion layer for DPR "Deeper".
   Loaded LAST (after mockups.js). Pure vanilla, no deps.

   Owns: mobile-menu controller, desktop sub-nav sliding indicator, reveal-on-scroll,
   rAF parallax + sticky cross-fade of the cinematic backdrops, and the data-tunnel wipe.

   Hard rule: everything that MOVES is gated by prefers-reduced-motion. The mobile menu
   and the sub-nav indicator still WORK under reduced motion (navigation is essential) —
   they just stop animating (instant open, indicator jumps without a tween). All scroll
   motion (reveals, parallax, cross-fade, tunnel) is skipped entirely. The reveal layer
   only hides content when <html> has `tr-ready`, so no-JS / reduced-motion shows everything. */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function prefersReduced() { return !!(mqReduce && mqReduce.matches); }

  function onMq(mq, fn) {
    if (!mq) return;
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  }

  /* ============================================================
     1) MOBILE MENU — always functional; animation gated in CSS
     ============================================================ */
  function initMobileMenu() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;
    var lastFocus = null;
    var hideTimer = null;

    function focusables() {
      return Array.prototype.slice.call(
        menu.querySelectorAll('a[href], button:not([disabled])')
      ).filter(function (el) { return el.offsetWidth > 0 || el.offsetHeight > 0; });
    }

    function open() {
      if (menu.classList.contains('is-open')) return;
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      lastFocus = document.activeElement;
      menu.hidden = false;
      void menu.offsetWidth; /* reflow so the open transition runs */
      docEl.classList.add('mm-open');
      menu.classList.add('is-open');
      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      var f = focusables();
      if (f.length) f[0].focus();
      document.addEventListener('keydown', onKey, true);
    }

    function close(restoreFocus) {
      if (!menu.classList.contains('is-open')) return;
      docEl.classList.remove('mm-open');
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.removeEventListener('keydown', onKey, true);
      if (prefersReduced()) {
        menu.hidden = true;
      } else {
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
          if (!menu.classList.contains('is-open')) menu.hidden = true;
        }, 420);
      }
      if (restoreFocus !== false && lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function onKey(e) {
      if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); close(true); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    toggle.addEventListener('click', function () {
      if (menu.classList.contains('is-open')) close(true); else open();
    });
    /* click on the dimmed backdrop (not the panel) closes */
    menu.addEventListener('click', function (e) {
      if (e.target === menu) close(true);
    });
    /* tapping a link closes and lets script.js handle the smooth scroll;
       don't restore focus to the hamburger because we're navigating away */
    Array.prototype.forEach.call(menu.querySelectorAll('a[href^="#"]'), function (a) {
      a.addEventListener('click', function () { close(false); });
    });
    /* if the viewport grows back to desktop, drop the menu */
    var mqDesk = window.matchMedia('(min-width: 921px)');
    onMq(mqDesk, function () { if (mqDesk.matches) close(false); });
  }

  /* ============================================================
     2) SUB-NAV SLIDING INDICATOR — always placed; tween gated in CSS
     ============================================================ */
  function initSubnavIndicator() {
    var subnav = document.querySelector('.subnav');
    var ind = document.getElementById('subnavInd');
    if (!subnav || !ind) return;
    var links = Array.prototype.slice.call(subnav.querySelectorAll('a'));
    if (!links.length) return;

    subnav.classList.add('has-ind'); /* CSS swaps the snapping pill for the sliding bar */

    function activeLink() {
      for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute('aria-current') === 'true') return links[i];
      }
      return null;
    }

    function place() {
      var a = activeLink();
      if (!a) { ind.style.opacity = '0'; ind.style.width = '0px'; return; }
      /* resolve the section accent reliably from the dot's painted colour */
      var dot = a.querySelector('.sn-dot');
      var sol = dot ? getComputedStyle(dot).backgroundColor : getComputedStyle(a).color;
      ind.style.setProperty('--ind-c', sol);
      ind.style.opacity = '1';
      ind.style.width = a.offsetWidth + 'px';
      ind.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    }

    /* react to scrollspy flipping aria-current */
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].attributeName === 'aria-current') { place(); return; }
      }
    });
    links.forEach(function (a) { mo.observe(a, { attributes: true, attributeFilter: ['aria-current'] }); });

    /* immediate feedback on click, before the scrollspy catches up */
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        links.forEach(function (l) { l.removeAttribute('aria-current'); });
        a.setAttribute('aria-current', 'true');
        place();
      });
    });

    window.addEventListener('resize', place, { passive: true });
    subnav.addEventListener('scroll', place, { passive: true });
    /* fonts/layout can settle a beat after load */
    place();
    setTimeout(place, 250);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place).catch(function () {});
  }

  /* always-on pieces (navigation must work regardless of motion preference) */
  initMobileMenu();
  initSubnavIndicator();

  /* ============================================================
     Everything below MOVES — skip it entirely under reduced motion.
     ============================================================ */
  if (prefersReduced()) return;
  docEl.classList.add('tr-ready'); /* unlocks the reveal/parallax CSS */

  /* ---- 3) reveal-on-scroll: major sections fade + rise 24px (one-shot) ---- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    var sel = '.sol-overview, section.solution, .integrations, .results, .process, ' +
      '.founders, .about, .closing, .contact, .tunnel-wipe';
    var nodes = Array.prototype.slice.call(document.querySelectorAll(sel));
    if (!nodes.length) return;
    var vh = window.innerHeight || 800;
    var marked = [];
    nodes.forEach(function (el) {
      var r = el.getBoundingClientRect();
      /* already on screen at load → show immediately, never hide (no flash) */
      if (r.top < vh * 0.85) { el.classList.add('is-in'); return; }
      el.classList.add('reveal');
      marked.push(el);
    });
    if (!marked.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });
    marked.forEach(function (el) { io.observe(el); });
    /* safety net: never leave anything stuck hidden */
    setTimeout(function () {
      marked.forEach(function (el) {
        if (!el.classList.contains('is-in')) { el.classList.add('is-in'); io.unobserve(el); }
      });
    }, 4000);
  }

  /* ---- 4) rAF parallax + sticky cross-fade + tunnel brighten ---- */
  function initScrollMotion() {
    var heroBg = document.querySelector('.hero-bg');
    var ambs = Array.prototype.slice.call(document.querySelectorAll('.tech-amb'));
    var tunnel = document.querySelector('.tunnel-wipe');
    if (!heroBg && !ambs.length && !tunnel) return;
    var ticking = false;

    function frame() {
      ticking = false;
      var vh = window.innerHeight || 800;

      if (heroBg) {
        var hero = heroBg.parentElement;
        var hr = hero.getBoundingClientRect();
        if (hr.bottom > 0 && hr.top < vh) {
          heroBg.style.setProperty('--py', (window.scrollY * 0.18).toFixed(1) + 'px');
        }
      }

      ambs.forEach(function (amb) {
        var box = amb.closest('.sol-visual') || amb.parentElement;
        var r = box.getBoundingClientRect();
        if (r.bottom < -120 || r.top > vh + 120) return;
        var center = r.top + r.height / 2;
        var d = (center - vh / 2) / vh;            /* ~ -1 (above) .. +1 (below) */
        amb.style.setProperty('--py', (-d * 42).toFixed(1) + 'px');   /* depth drift */
        var o = 0.20 - Math.min(0.14, Math.abs(d) * 0.20);            /* cross-fade */
        amb.style.setProperty('--amb-o', Math.max(0.06, o).toFixed(3));
      });

      if (tunnel) {
        var tr = tunnel.getBoundingClientRect();
        if (tr.bottom > 0 && tr.top < vh) {
          var p = 1 - Math.min(1, Math.abs(tr.top + tr.height / 2 - vh / 2) / (vh / 2));
          tunnel.style.setProperty('--tp', p.toFixed(3));
        }
      }
    }

    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    frame();
  }

  initReveal();
  initScrollMotion();
})();
