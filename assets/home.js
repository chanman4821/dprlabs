/* =====================================================================
   DPR LABS — HOME PAGE  ·  assets/home.js
   Single source of motion = design/motion.tokens.json (fetched, validated
   against the documented caps, then re-asserted onto the --sig-* CSS vars
   so the JSON stays authoritative). No wall-clock timers drive behavior:
   ambient drift/pulse is rAF, edges draw on scroll, everything else is
   event driven. prefers-reduced-motion => static "flywheel-rest".
   ===================================================================== */
(function () {
  "use strict";
  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* CSS fallback defaults (mirror of the JSON) — used if fetch is blocked. */
  var MOTION = {
    node_period_seconds: 3.6,
    pulse_period_seconds: 4.2,
    hover_transition_ms: 200,
    hover_lift_pct: 15,
    parallax_max_px: 18,
    edge_draw_ms: 640,
    reveal_stagger_ms: 90
  };

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* ---- 1. Load + validate motion tokens, re-assert CSS vars ---------- */
  function applyMotion(m) {
    // Enforce the documented caps regardless of source.
    m.node_period_seconds  = clamp(+m.node_period_seconds  || 3.6, 2.5, 5.0);
    m.pulse_period_seconds = clamp(+m.pulse_period_seconds || 4.2, 2.5, 5.0);
    m.hover_transition_ms  = clamp(+m.hover_transition_ms  || 200, 150, 250);
    m.hover_lift_pct       = clamp(+m.hover_lift_pct       || 15, 0, 15);
    m.parallax_max_px      = clamp(+m.parallax_max_px      || 18, 0, 20);
    m.edge_draw_ms         = clamp(+m.edge_draw_ms         || 640, 0, 2000);
    MOTION = m;
    root.style.setProperty("--sig-node-period", m.node_period_seconds + "s");
    root.style.setProperty("--sig-pulse-period", m.pulse_period_seconds + "s");
    root.style.setProperty("--sig-hover-ms", m.hover_transition_ms + "ms");
    root.style.setProperty("--sig-hover-scale", (1 + m.hover_lift_pct / 100).toFixed(3));
    root.style.setProperty("--sig-parallax-max", m.parallax_max_px + "px");
    root.style.setProperty("--sig-edge-draw-ms", m.edge_draw_ms + "ms");
  }

  function boot() {
    initReveal();
    initNav();
    initFlywheel();
    initPaths();
    initPillars();
    initRing();
    initParallax();
  }

  fetch("design/motion.tokens.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (data && data.tokens) {
        var t = data.tokens, m = {};
        for (var k in t) { if (t[k] && typeof t[k].value !== "undefined") m[k] = t[k].value; }
        applyMotion(m);
      } else { applyMotion(MOTION); }
    })
    .catch(function () { applyMotion(MOTION); })
    .then(function () {
      if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", boot);
      else boot();
    });

  /* ---- 2. Scroll reveal (bulletproof; never leaves content hidden) --- */
  function initReveal() {
    var els = [].slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;
    if (RM || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
    // safety net: nothing stays invisible on fast scroll/jumps
    setTimeout(function () { els.forEach(function (el) { el.classList.add("in"); }); }, 1600);
  }

  /* ---- 3. Mobile nav ------------------------------------------------- */
  function initNav() {
    var t = document.getElementById("navToggle"), m = document.getElementById("mobileMenu");
    if (!t || !m) return;
    t.addEventListener("click", function () {
      var open = m.classList.toggle("open");
      t.setAttribute("aria-expanded", String(open));
    });
    m.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        m.classList.remove("open"); t.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- 4. Hero network flywheel ------------------------------------- */
  function initFlywheel() {
    var svg = document.getElementById("flywheel");
    if (!svg) return;
    var nodes = [].slice.call(svg.querySelectorAll(".fw-node"));
    var edges = [].slice.call(svg.querySelectorAll(".fw-edge"));
    var panel = document.getElementById("nodePanel");

    // edge draw-on-scroll: set each cross edge's dash length, reveal in view
    var crossEdges = edges.filter(function (e) { return e.classList.contains("cross"); });
    crossEdges.forEach(function (e) {
      var len = edgeLength(e);
      e.style.setProperty("--dash", len.toFixed(1));
    });
    if (RM || !("IntersectionObserver" in window)) {
      crossEdges.forEach(function (e) { e.classList.add("drawn"); });
    } else {
      var eio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("drawn"); eio.unobserve(en.target); }
        });
      }, { threshold: 0.2 });
      crossEdges.forEach(function (e) { eio.observe(e); });
    }

    function litFor(id, on) {
      edges.forEach(function (e) {
        if (e.getAttribute("data-a") === id || e.getAttribute("data-b") === id)
          e.classList.toggle("lit", on);
      });
    }
    function showPanel(n) {
      if (!panel) return;
      panel.querySelector(".np-kicker").textContent = n.getAttribute("data-kicker") || "";
      panel.querySelector(".np-title").textContent = n.getAttribute("data-title") || "";
      panel.querySelector(".np-body").textContent = n.getAttribute("data-body") || "";
    }
    var activeId = null;
    function activate(n) {
      nodes.forEach(function (o) { o.classList.remove("active"); });
      if (activeId) litFor(activeId, false);
      n.classList.add("active");
      activeId = n.getAttribute("data-node");
      litFor(activeId, true);
      showPanel(n);
    }
    nodes.forEach(function (n) {
      n.addEventListener("mouseenter", function () { activate(n); });
      n.addEventListener("focus", function () { activate(n); });
      n.addEventListener("click", function () { activate(n); });
      n.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); activate(n); }
      });
    });

    // ambient drift (rAF; disabled under reduced motion => "flywheel-rest")
    if (RM) return;
    var drifters = nodes.map(function (n, i) {
      var g = n.querySelector(".fw-drift");
      return { g: g, phase: (i * 1.7) % (Math.PI * 2),
               ax: 2.4 + (i % 3), ay: 2.0 + (i % 2) };
    });
    var period = (MOTION.node_period_seconds || 3.6) * 1000;
    var start = null, raf;
    function tick(ts) {
      if (start === null) start = ts;
      var tsec = (ts - start) / period * Math.PI * 2;
      for (var i = 0; i < drifters.length; i++) {
        var d = drifters[i];
        if (!d.g) continue;
        var dx = Math.sin(tsec + d.phase) * d.ax;
        var dy = Math.cos(tsec * 0.85 + d.phase) * d.ay;
        d.g.setAttribute("transform", "translate(" + dx.toFixed(2) + "," + dy.toFixed(2) + ")");
      }
      raf = requestAnimationFrame(tick);
    }
    // pause when hero offscreen (perf)
    var hero = document.querySelector(".hero");
    if (hero && "IntersectionObserver" in window) {
      var vio = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { if (!raf) raf = requestAnimationFrame(tick); }
        else { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      }, { threshold: 0 });
      vio.observe(hero);
    } else { raf = requestAnimationFrame(tick); }
  }

  function edgeLength(e) {
    if (typeof e.getTotalLength === "function") { try { return e.getTotalLength(); } catch (x) {} }
    var x1 = +e.getAttribute("x1"), y1 = +e.getAttribute("y1"),
        x2 = +e.getAttribute("x2"), y2 = +e.getAttribute("y2");
    return Math.hypot(x2 - x1, y2 - y1) || 400;
  }

  /* ---- 5. Dual-path selector (Founders / Investors) ----------------- */
  function initPaths() {
    var tabs = [].slice.call(document.querySelectorAll(".path-tab"));
    if (!tabs.length) return;
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (ev) {
        var k = ev.key, n;
        if (k === "ArrowRight" || k === "ArrowDown") n = tabs[(i + 1) % tabs.length];
        else if (k === "ArrowLeft" || k === "ArrowUp") n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (k === "Home") n = tabs[0];
        else if (k === "End") n = tabs[tabs.length - 1];
        if (n) { ev.preventDefault(); select(n, true); }
      });
    });
  }

  /* ---- 6. Four-pillar rail (updates one shared panel in place) ------- */
  function initPillars() {
    var tabs = [].slice.call(document.querySelectorAll(".pillar-tab"));
    var panel = document.getElementById("pillarPanel");
    if (!tabs.length || !panel) return;
    var f = {
      eye: panel.querySelector(".pp-eye"), title: panel.querySelector("h3"),
      what: panel.querySelector(".pp-what"), nl: panel.querySelector(".pn-label"),
      nv: panel.querySelector(".pn-value"), note: panel.querySelector(".pp-note")
    };
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      f.eye.textContent = tab.getAttribute("data-eye") || "";
      f.title.textContent = tab.getAttribute("data-title") || "";
      f.what.textContent = tab.getAttribute("data-what") || "";
      f.nl.textContent = tab.getAttribute("data-numlabel") || "";
      f.nv.textContent = tab.getAttribute("data-numvalue") || "";
      f.note.textContent = tab.getAttribute("data-note") || "";
      if (!RM) { panel.classList.remove("pillar-swap"); void panel.offsetWidth; panel.classList.add("pillar-swap"); }
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("mouseenter", function () { select(tab); });
      tab.addEventListener("focus", function () { select(tab); });
      tab.addEventListener("keydown", function (ev) {
        var k = ev.key, n;
        if (k === "ArrowDown" || k === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        else if (k === "ArrowUp" || k === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (k === "Home") n = tabs[0];
        else if (k === "End") n = tabs[tabs.length - 1];
        if (n) { ev.preventDefault(); select(n, true); }
      });
    });
  }

  /* ---- 7. Relationship-flywheel ring -------------------------------- */
  function initRing() {
    var ring = document.getElementById("moatRing");
    if (!ring) return;
    var nodes = [].slice.call(ring.querySelectorAll(".ring-node"));
    var num = ring.querySelector(".rc-num"), txt = ring.querySelector(".rc-txt");
    function show(n) {
      nodes.forEach(function (o) { o.classList.remove("active"); });
      n.classList.add("active");
      if (num) num.textContent = n.getAttribute("data-step") || "";
      if (txt) txt.textContent = n.getAttribute("data-label") || "";
    }
    nodes.forEach(function (n) {
      n.addEventListener("mouseenter", function () { show(n); });
      n.addEventListener("focus", function () { show(n); });
      n.addEventListener("click", function () { show(n); });
      n.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); show(n); }
      });
    });
  }

  /* ---- 8. Hero parallax (pointer, capped, reduced-motion off) -------- */
  function initParallax() {
    if (RM) return;
    var hero = document.querySelector(".hero");
    var atmo = document.querySelector(".hero-atmo");
    var stage = document.querySelector(".hero-stage");
    if (!hero || (!atmo && !stage)) return;
    var max = MOTION.parallax_max_px || 18, ticking = false, px = 0, py = 0;
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      px = clamp(nx * max * 2, -max, max);
      py = clamp(ny * max * 2, -max, max);
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
    hero.addEventListener("pointerleave", function () { px = 0; py = 0;
      requestAnimationFrame(apply); }, { passive: true });
    function apply() {
      ticking = false;
      if (atmo) atmo.style.transform = "translate3d(" + (px * 0.5).toFixed(1) + "px," + (py * 0.5).toFixed(1) + "px,0)";
      if (stage) stage.style.transform = "translate3d(" + (-px * 0.35).toFixed(1) + "px," + (-py * 0.35).toFixed(1) + "px,0)";
    }
  }
})();
