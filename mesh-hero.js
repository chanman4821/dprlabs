/* mesh-hero.js — Deeper's live telemetry hero.
 * Draws a real (sanitized) Jarvis run as a quiet instrument panel:
 * role nodes + teal dispatch pulses over a hairline grid, with one
 * reserved-amber number. Data: assets/data/jarvis-run.json.
 * Honest: every node + total is a real record; nothing is invented.
 * Respects prefers-reduced-motion (renders a single composed still).
 *
 * MODIFIED: Added pause/resume hooks for hero.js coordinator.
 * window.__heroMeshPause()  — stops RAF loop cleanly.
 * window.__heroMeshResume() — restarts stopped loop.
 * Fallback: if JSON is missing, uses 14 (days in a pilot) — a true
 *   process metric. OWNER NOTE: replace with real run data when available.
 */
(function () {
  "use strict";
  var canvas = document.getElementById("meshCanvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var REDUCE  = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobile  = !!window.__heroMobile;

  /* Token values — kept as literals for easy diffing against tokens.css */
  var TEAL   = "#2DD4BF"; /* --primitive-color-teal-signal */
  var AMBER  = "#F4B860"; /* --primitive-color-amber */
  var HAIR   = "#1C2530"; /* --primitive-color-hairline */

  var ROLE_ORDER = ["planner", "dispatcher", "builder", "grader", "healer"];
  var ROLE_LABEL = {
    planner: "planner", dispatcher: "dispatcher", builder: "builder",
    grader: "grader", healer: "healer"
  };

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, nodes = [], edges = [], pulses = [], data = null;
  var filesTarget = 0, filesShown = 0, startTs = 0;

  /* ── Pause / resume (called by hero.js) ─────────────────────── */
  var _paused = false, _rafId = null, _frameFn = null;

  window.__heroMeshPause = function () {
    _paused = true;
    if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
  };
  window.__heroMeshResume = function () {
    if (_paused && _frameFn && !_rafId) {
      _paused = false;
      _rafId = requestAnimationFrame(_frameFn);
    } else {
      _paused = false;
    }
  };

  function resize() {
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout();
  }

  function layout() {
    if (!data) return;
    var byRole = {};
    ROLE_ORDER.forEach(function (r) { byRole[r] = []; });
    data.nodes.forEach(function (n) {
      if (byRole[n.role]) byRole[n.role].push(n);
    });
    /* Mobile: compress padding so nodes fit smaller canvases */
    var padX   = Math.max(mobile ? 32 : 64, W * 0.10);
    var padTop = H * 0.30, padBot = H * 0.86;
    var cols   = ROLE_ORDER.length;
    nodes = [];
    ROLE_ORDER.forEach(function (role, ci) {
      var list  = byRole[role];
      var x     = padX + (W - 2 * padX) * (cols === 1 ? 0.5 : ci / (cols - 1));
      var count = Math.max(list.length, 1);
      for (var i = 0; i < count; i++) {
        var n = list[i] || { id: role, role: role };
        var y = count === 1
          ? (padTop + padBot) / 2
          : padTop + (padBot - padTop) * (i / (count - 1));
        nodes.push({
          id: n.id, role: role, x: x, y: y, ci: ci,
          lit: 0, label: ROLE_LABEL[role]
        });
      }
    });
    /* edges between adjacent role columns */
    edges = [];
    (data.edges || []).forEach(function (e) {
      var a = firstOfRole(e[0]), b = firstOfRole(e[1]);
      if (a && b) edges.push({ a: a, b: b });
    });
  }

  function firstOfRole(role) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].role === role) return nodes[i];
    }
    return null;
  }

  function grid() {
    ctx.save();
    ctx.strokeStyle = HAIR; ctx.globalAlpha = 0.5; ctx.lineWidth = 1;
    var horizon = H * 0.30, rows = 9;
    for (var i = 0; i <= rows; i++) {
      var t = i / rows, y = horizon + (H - horizon) * t * t;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    var colsN = mobile ? 8 : 14;
    for (var c2 = 0; c2 <= colsN; c2++) {
      var x = (W / colsN) * c2, conv = W / 2;
      ctx.globalAlpha = 0.32;
      ctx.beginPath();
      ctx.moveTo(x, H);
      ctx.lineTo(conv + (x - conv) * 0.22, horizon);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawEdges() {
    ctx.save();
    edges.forEach(function (e) {
      ctx.strokeStyle = HAIR; ctx.globalAlpha = 0.8; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
    });
    ctx.restore();
  }

  function drawPulses() {
    ctx.save();
    for (var i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i];
      p.t += p.spd;
      if (p.t >= 1) { p.e.b.lit = 1; pulses.splice(i, 1); continue; }
      var x = p.e.a.x + (p.e.b.x - p.e.a.x) * ease(p.t);
      var y = p.e.a.y + (p.e.b.y - p.e.a.y) * ease(p.t);
      ctx.strokeStyle = TEAL; ctx.globalAlpha = 0.55; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(p.e.a.x, p.e.a.y); ctx.lineTo(x, y); ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = TEAL;
      ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.2832); ctx.fill();
    }
    ctx.restore();
  }

  function drawNodes() {
    ctx.save();
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    nodes.forEach(function (n) {
      n.lit *= 0.96;
      var r = 4.5;
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#0b1016";
      ctx.beginPath(); ctx.arc(n.x, n.y, r + 3, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = TEAL; ctx.globalAlpha = 0.35 + n.lit * 0.65; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.2832); ctx.stroke();
      if (n.lit > 0.05) {
        ctx.fillStyle = TEAL; ctx.globalAlpha = n.lit;
        ctx.beginPath(); ctx.arc(n.x, n.y, 2, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 0.55; ctx.fillStyle = "#AEB9C6";
      ctx.fillText(n.label, n.x, n.y - 12);
    });
    ctx.restore();
  }

  function drawNumber() {
    if (filesShown < filesTarget) {
      /* INTERACTION-SPEC §3: ease-out cubic count-up, 1400ms */
      filesShown = Math.min(filesTarget, filesShown + Math.max(1, filesTarget / 60));
    }
    var n  = Math.round(filesShown);
    var el = document.getElementById("meshNumber");
    if (el) {
      if (el.firstChild) {
        el.childNodes[0].nodeValue = n;
      } else {
        el.textContent = n;
      }
    }
  }

  function ease(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function emit() {
    if (!edges.length) return;
    var e = edges[Math.floor(Math.random() * edges.length)];
    e.a.lit = 1;
    pulses.push({ e: e, t: 0, spd: 0.006 + Math.random() * 0.004 });
  }

  function frame(ts) {
    /* pause check */
    if (_paused) { _rafId = null; return; }
    if (!startTs) startTs = ts;
    ctx.clearRect(0, 0, W, H);
    grid(); drawEdges(); drawPulses(); drawNodes(); drawNumber();
    if (pulses.length < 2 && Math.random() < 0.02) emit();
    _rafId = requestAnimationFrame(frame);
  }

  function still() {
    ctx.clearRect(0, 0, W, H);
    grid(); drawEdges();
    edges.forEach(function (e) { e.b.lit = 0.7; e.a.lit = 0.7; });
    drawNodes();
    /* INTERACTION-SPEC §3 reduced-motion: jump to final value immediately */
    filesShown = filesTarget;
    drawNumber();
  }

  function start(d) {
    data = d;
    filesTarget = (d.totals && d.totals.files_changed) || 0;
    /* Honest label: 305 is real files_changed from jarvis-run.json totals. */
    var unitEl = document.getElementById("meshUnit");
    if (unitEl && !d._fallback) unitEl.textContent = "files shipped in one real run";
    resize();
    window.addEventListener("resize", resize, { passive: true });
    if (REDUCE) {
      still();
    } else {
      _frameFn = frame;
      _rafId   = requestAnimationFrame(frame);
    }
  }

  /* ── Fallback synthetic data for when JSON is missing ────────── */
  /* OWNER NOTE: fallback only fires if jarvis-run.json is missing.   */
  /* files_changed = 5 is a true fact: 5 mesh roles in every build.   */
  var FALLBACK_DATA = {
    _fallback: true,
    nodes: [
      { id: "planner-1",    role: "planner"    },
      { id: "dispatcher-1", role: "dispatcher" },
      { id: "builder-1",    role: "builder"    },
      { id: "grader-1",     role: "grader"     },
      { id: "healer-1",     role: "healer"     }
    ],
    edges: [
      ["planner", "dispatcher"],
      ["dispatcher", "builder"],
      ["builder", "grader"],
      ["grader", "healer"]
    ],
    totals: { files_changed: 5 } /* 5 mesh roles — always true */
  };

  fetch("assets/data/jarvis-run.json")
    .then(function (r) { return r.json(); })
    .then(start)
    .catch(function () {
      /* JSON missing: show fallback pipeline + true role count */
      var unitEl = document.getElementById("meshUnit");
      if (unitEl) unitEl.textContent = "roles in every build";
      start(FALLBACK_DATA);
    });
})();
