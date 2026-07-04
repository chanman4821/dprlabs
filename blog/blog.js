/* Field Notes — nav toggle, scrolled nav, footer year, reading-mode.
   Reading mode is scoped to <article data-theme> so the surrounding
   nav/footer stay in the dark brand system. */
(function () {
  'use strict';
  var KEY = 'deeper-readmode';
  var $ = function (s, r) { return (r || document).querySelector(s); };

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* Footer year */
    document.querySelectorAll('#year, #byear').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    /* Nav shadow on scroll */
    var nav = $('#nav');
    if (nav) {
      var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* Mobile menu */
    var toggle = $('#navToggle'), menu = $('#mobileMenu'), closeBtn = $('#mmClose');
    if (toggle && menu) {
      var setOpen = function (open) {
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) { var f = menu.querySelector('a,button'); if (f) f.focus(); }
        else toggle.focus();
      };
      toggle.addEventListener('click', function () { setOpen(menu.hidden); });
      if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
      menu.addEventListener('click', function (e) {
        if (e.target === menu || e.target.tagName === 'A') setOpen(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !menu.hidden) setOpen(false);
      });
    }

    /* Reading-mode toggle — flips data-theme on the article */
    var article = $('#article');
    var btn = $('#readmodeBtn');
    if (!article || !btn) return;
    var lbl = btn.querySelector('.readmode__t');

    function apply(light) {
      article.setAttribute('data-theme', light ? 'light' : 'dark');
      btn.setAttribute('aria-pressed', light ? 'true' : 'false');
      if (lbl) lbl.textContent = light ? 'Dark reading' : 'Light reading';
    }

    var stored = 'dark';
    try { stored = localStorage.getItem(KEY) || 'dark'; } catch (e) {}
    apply(stored === 'light');

    btn.addEventListener('click', function () {
      var light = article.getAttribute('data-theme') !== 'light';
      apply(light);
      try { localStorage.setItem(KEY, light ? 'light' : 'dark'); } catch (e) {}
    });
  });
})();
