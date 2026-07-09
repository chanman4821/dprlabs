/* =====================================================================
   DEEPER — interaction layer (vanilla, no deps)
   One source of truth for motion: prefers-reduced-motion.
   When reduced: videos are paused (poster shows), parallax/magnetic/auto
   are disabled, layout & content stay fully intact.
   ===================================================================== */
(() => {
  'use strict';

  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const REDUCE = reduceMQ.matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* -------- year -------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -------------------------------------------------------------------
     SHAPE VIDEOS — play only while in view, pause when off-screen.
     Never auto-play under reduced motion (poster fallback stays).
     ------------------------------------------------------------------- */
  const videos = $$('video[data-autoplay]');
  videos.forEach(v => { v.muted = true; v.setAttribute('muted', ''); });

  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting && !REDUCE) {
          const p = v.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } else {
          try { v.pause(); } catch (e) {}
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    videos.forEach(v => vio.observe(v));
  } else if (!REDUCE) {
    videos.forEach(v => { const p = v.play(); if (p && p.catch) p.catch(() => {}); });
  }

  /* -------------------------------------------------------------------
     STAGE — scroll-morphing cinematic canvas (the signature interaction).
     One framed media window morphs square -> circle -> wide -> portal as
     you scroll; headline + active video crossfade per chapter; a depth
     spine fills. Disabled entirely under reduced motion (CSS shows a
     static first-chapter hero, videos stay on their posters).
     ------------------------------------------------------------------- */
  const stage = $('#stage'), stMedia = $('#stageMedia');
  if (stage && stMedia && !REDUCE && 'requestAnimationFrame' in window) {
    const chapters = $$('.stage__h .ch', stage);
    const stVids   = $$('.stage__vid', stMedia);
    const marks    = $$('.depth__marks li', stage);
    const fill     = $('#depthFill');
    const tagEl    = $('#stageTag');
    const TAGS = ['live model · running', 'finding the signal', 'shipping to prod', 'learning daily'];

    // shape keyframes as functions of the viewport (w in px, ar = h/w, r in %)
    const shapeKeys = () => {
      const vw = window.innerWidth;
      return [
        { w: Math.min(vw * 0.30, 470), ar: 1.0,    r: 8  },  // 0 square
        { w: Math.min(vw * 0.26, 420), ar: 1.0,    r: 50 },  // 1 circle
        { w: Math.min(vw * 0.40, 600), ar: 0.5625, r: 5  },  // 2 wide 16:9
        { w: Math.min(vw * 0.24, 400), ar: 1.32,   r: 30 }   // 3 portal (tall)
      ];
    };
    const lerp  = (a, b, t) => a + (b - a) * t;
    const ease  = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
    const wide  = window.matchMedia('(min-width: 921px)');   // morph only when the pin layout is active

    let active = -1, ticking = false;
    const apply = () => {
      ticking = false;

      // narrow screens: CSS shows a static stacked hero — clear inline shape vars
      // (so the mobile --mw/--mh/--mr win) and rest on the first chapter.
      if (!wide.matches) {
        stMedia.style.removeProperty('--mw');
        stMedia.style.removeProperty('--mh');
        stMedia.style.removeProperty('--mr');
        if (active !== 0) {
          active = 0;
          chapters.forEach((c, k) => c.classList.toggle('is-on', k === 0));
          stVids.forEach((v, k) => {
            v.classList.toggle('is-on', k === 0);
            if (k === 0) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
            else { try { v.pause(); } catch (e) {} }
          });
          marks.forEach((m, k) => m.classList.toggle('is-on', k === 0));
          if (tagEl) tagEl.textContent = TAGS[0];
        }
        return;
      }

      const len = stage.offsetHeight - window.innerHeight;
      const top = stage.getBoundingClientRect().top;
      const p   = clamp(-top / Math.max(len, 1), 0, 1);          // 0..1 through the stage

      const K = shapeKeys();
      const seg = p * (K.length - 1);                            // 0..3
      const i = clamp(Math.floor(seg), 0, K.length - 2);
      const t = ease(seg - i);
      const w = lerp(K[i].w, K[i + 1].w, t);
      const ar = lerp(K[i].ar, K[i + 1].ar, t);
      const r = lerp(K[i].r, K[i + 1].r, t);
      stMedia.style.setProperty('--mw', w.toFixed(1) + 'px');
      stMedia.style.setProperty('--mh', (w * ar).toFixed(1) + 'px');
      stMedia.style.setProperty('--mr', r.toFixed(2) + '%');

      const idx = clamp(Math.round(seg), 0, K.length - 1);       // nearest chapter
      if (idx !== active) {
        active = idx;
        chapters.forEach((c, k) => c.classList.toggle('is-on', k === idx));
        stVids.forEach((v, k) => {
          v.classList.toggle('is-on', k === idx);
          if (k === idx) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
          else { try { v.pause(); } catch (e) {} }
        });
        marks.forEach((m, k) => m.classList.toggle('is-on', k <= idx));
        if (tagEl) tagEl.textContent = TAGS[idx] || TAGS[0];
      }
      if (fill) fill.style.height = (p * 100).toFixed(1) + '%';
      stage.classList.toggle('is-diving', p > 0.02);
    };
    const onStage = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
    window.addEventListener('scroll', onStage, { passive: true });
    window.addEventListener('resize', onStage, { passive: true });
    apply();
    const v0 = stVids[0];
    if (v0) { const pr = v0.play(); if (pr && pr.catch) pr.catch(() => {}); }
  }

  /* -------------------------------------------------------------------
     SCROLL REVEALS
     ------------------------------------------------------------------- */
  const revealEls = $$('.reveal, .reveal-line');
  const revealAll = () => revealEls.forEach(el => el.classList.add('is-in'));
  if (REDUCE || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    const rio = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach(el => rio.observe(el));
    // Safety net: never leave content permanently hidden (offscreen captures,
    // stalled observers, etc.). Reveals anything still hidden after 2.6s — by
    // then a real reader has already triggered in-view items via scroll.
    setTimeout(revealAll, 2600);
    window.addEventListener('pagehide', revealAll, { once: true });
  }

  /* -------------------------------------------------------------------
     COUNTERS — animate data-count when revealed (instant under reduce)
     ------------------------------------------------------------------- */
  const fmt = (n) => n >= 1000 ? n.toLocaleString('en-US') : String(n);
  const counters = $$('[data-count]');
  const runCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (REDUCE) { el.textContent = fmt(target); return; }
    const dur = 1400, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    if (REDUCE || !('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      const cio = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { runCount(entry.target); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(el => cio.observe(el));
    }
  }

  /* -------------------------------------------------------------------
     PARALLAX on shape windows (subtle; disabled under reduce)
     ------------------------------------------------------------------- */
  const paraEls = $$('[data-parallax]');
  if (!REDUCE && paraEls.length) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      paraEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const amp = parseFloat(el.dataset.parallax) || 0;
        const progress = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5-ish
        el.style.setProperty('--py', (progress * amp).toFixed(2) + 'px');
      });
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* -------------------------------------------------------------------
     MAGNETIC buttons (fine pointer only; disabled under reduce)
     ------------------------------------------------------------------- */
  if (!REDUCE && finePointer) {
    $$('[data-magnetic]').forEach(btn => {
      const strength = 0.32, max = 10;
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        let dx = (e.clientX - (r.left + r.width / 2)) * strength;
        let dy = (e.clientY - (r.top + r.height / 2)) * strength;
        dx = Math.max(-max, Math.min(max, dx));
        dy = Math.max(-max, Math.min(max, dy));
        btn.style.setProperty('--mx', dx.toFixed(1) + 'px');
        btn.style.setProperty('--my', dy.toFixed(1) + 'px');
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
      });
    });
  }

  /* -------------------------------------------------------------------
     SCROLL PROGRESS + sticky nav
     ------------------------------------------------------------------- */
  const bar = $('#scrollProgress');
  const nav = $('#nav');
  let navTick = false;
  const onScrollChrome = () => {
    if (navTick) return; navTick = true;
    requestAnimationFrame(() => {
      const st = window.scrollY || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${h > 0 ? st / h : 0})`;
      if (nav) nav.classList.toggle('is-stuck', st > 8);
      navTick = false;
    });
  };
  window.addEventListener('scroll', onScrollChrome, { passive: true });
  onScrollChrome();

  /* -------------------------------------------------------------------
     TESTIMONIAL rotation
     ------------------------------------------------------------------- */
  // Honest placeholder until real, permission-cleared client quotes exist.
  const QUOTES = [
    { t: 'Real client quotes will live here — each tied to a published method and a number you can check.',
      av: '—', name: 'Proof in progress', role: 'Honest testimonials publish as pilots complete', out: 'measured, not invented' }
  ];
  const qText = $('#qText'), qAv = $('#qAv'), qName = $('#qName'), qRole = $('#qRole'), qOut = $('#qOut');
  const dots = $$('.qdot');
  if (qText && dots.length) {
    let qi = 0, timer = null;
    const render = (i) => {
      const q = QUOTES[i];
      qText.textContent = q.t; qAv.textContent = q.av; qName.textContent = q.name;
      qRole.textContent = q.role; qOut.textContent = q.out;
      dots.forEach((d, k) => {
        d.classList.toggle('is-on', k === i);
        if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      qi = i;
    };
    const go = (i) => { render((i + QUOTES.length) % QUOTES.length); };
    dots.forEach((d, k) => d.addEventListener('click', () => { go(k); restart(); }));
    const restart = () => {
      if (REDUCE) return;
      if (timer) clearInterval(timer);
      timer = setInterval(() => go(qi + 1), 6000);
    };
    render(0); restart();
  }

  /* -------------------------------------------------------------------
     MOBILE MENU (focus trap + Escape + restore focus)
     ------------------------------------------------------------------- */
  const toggle = $('#navToggle'), menu = $('#mobileMenu'), closeBtn = $('#mmClose');
  if (toggle && menu) {
    let lastFocus = null;
    const focusables = () => $$('a[href], button', menu).filter(el => !el.hasAttribute('disabled'));
    const open = () => {
      lastFocus = document.activeElement;
      menu.hidden = false; toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const f = focusables(); if (f[0]) f[0].focus();
      document.addEventListener('keydown', onKey);
    };
    const close = () => {
      menu.hidden = true; toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      if (lastFocus) lastFocus.focus();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        const f = focusables(); if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    menu.addEventListener('click', (e) => { if (e.target === menu) close(); });
    $$('a', menu).forEach(a => a.addEventListener('click', close));
  }

  /* -------------------------------------------------------------------
     CONTACT FORM — lightweight client validation
     ------------------------------------------------------------------- */
  const form = $('#contactForm');
  if (form) {
    const name = $('#cf-name'), email = $('#cf-email'), note = $('#formNote');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mark = (input, ok) => input.closest('.field').classList.toggle('is-invalid', !ok);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const okName = name.value.trim().length > 1;
      const okEmail = emailRe.test(email.value.trim());
      mark(name, okName); mark(email, okEmail);
      if (okName && okEmail) {
        const to = form.getAttribute('data-contact');
        if (to) {
          const msg = $('#cf-message');
          const subject = encodeURIComponent('DPR AI enquiry — ' + name.value.trim());
          const body = encodeURIComponent(
            'Name: ' + name.value.trim() +
            '\nEmail: ' + email.value.trim() +
            '\n\n' + (msg ? msg.value.trim() : '')
          );
          window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
        }
        if (note) note.hidden = false;
        form.reset();
        setTimeout(() => { if (note) note.hidden = true; }, 6000);
      } else {
        (!okName ? name : email).focus();
      }
    });
    [name, email].forEach(input => input && input.addEventListener('input', () => {
      if (input.closest('.field').classList.contains('is-invalid')) {
        const ok = input === email ? emailRe.test(input.value.trim()) : input.value.trim().length > 1;
        mark(input, ok);
      }
    }));
  }
})();
