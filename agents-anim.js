/* =====================================================================
   agents-anim.js — DPR AI
   1) Reusable vanilla-canvas "AI agents at work" engine (no libs).
      Types via <canvas data-agents="dispatch|telemetry|constellation">.
      - devicePixelRatio capped at 2
      - pauses offscreen (IntersectionObserver) AND on document.hidden
      - reduces counts on coarse pointer / small screens
      - prefers-reduced-motion => ONE composed still, no RAF
      - all canvases aria-hidden, never steal scroll/focus
   2) Method connector spine draw-on-scroll (IntersectionObserver)
   3) "Your fears" accordion (ARIA APG keyboard contract)
   Reveal / count-up / contact form / nav are owned by dpr.js — not here.
   ===================================================================== */
(function () {
  'use strict';

  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COARSE = window.matchMedia('(pointer: coarse)').matches;
  var FINE   = window.matchMedia('(any-pointer: fine)').matches;

  var TEAL   = '#2DD4BF';
  var FOCUS  = '#5EEAD4';
  var AMBER  = '#F4B860';
  var HAIR   = 'rgba(120,150,170,0.16)';

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rand(a, b) { return a + Math.random() * (b - a); }

  /* ------------------------------------------------------------------
     Base canvas controller: sizing, DPR, pause on hidden/offscreen
     ------------------------------------------------------------------ */
  function makeCanvas(canvas, draw, step) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, raf = 0, running = false, visible = false, t = 0;

    function resize() {
      var r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw.init(W, H, ctx);
      if (REDUCE) { still(); }
    }

    function still() { ctx.clearRect(0, 0, W, H); draw.render(W, H, ctx, t, true); }

    function frame() {
      if (!running) return;
      t += 1;
      step && step();
      ctx.clearRect(0, 0, W, H);
      draw.render(W, H, ctx, t, false);
      raf = requestAnimationFrame(frame);
    }

    function play() {
      if (REDUCE || running || !visible || document.hidden) return;
      running = true; raf = requestAnimationFrame(frame);
    }
    function pause() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

    var io = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) play(); else pause();
    }, { threshold: 0.01 });
    io.observe(canvas);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pause(); else play();
    });

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt); rt = setTimeout(resize, 150);
    }, { passive: true });

    resize();
    if (REDUCE) still();
  }

  /* ------------------------------------------------------------------
     Shared: slow-drifting volumetric haze blobs (depth + "alive" feel).
     A few large teal radial gradients at very low alpha. Cheap, tasteful.
     ------------------------------------------------------------------ */
  function makeHaze(n) {
    var blobs = [];
    return {
      init: function (W, H) {
        blobs = [];
        for (var i = 0; i < n; i++) {
          blobs.push({
            x: rand(0.15, 0.85) * W, y: rand(0.15, 0.85) * H,
            r: rand(0.28, 0.5) * Math.min(W, H),
            a: rand(0, Math.PI * 2), sp: rand(0.0006, 0.0016) * (Math.random() < 0.5 ? -1 : 1),
            orb: rand(0.04, 0.09) * Math.min(W, H), amp: rand(0.02, 0.05)
          });
        }
      },
      render: function (W, H, ctx, isStill) {
        for (var i = 0; i < blobs.length; i++) {
          var b = blobs[i];
          if (!isStill) b.a += b.sp;
          var bx = b.x + Math.cos(b.a) * b.orb;
          var by = b.y + Math.sin(b.a * 0.8) * b.orb;
          var g = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
          g.addColorStop(0, 'rgba(45,212,191,' + b.amp + ')');
          g.addColorStop(1, 'rgba(45,212,191,0)');
          ctx.fillStyle = g;
          ctx.fillRect(bx - b.r, by - b.r, b.r * 2, b.r * 2);
        }
      }
    };
  }

  // Soft glowing dot via layered arcs (no shadowBlur cost per node).
  function glowDot(ctx, x, y, r, cr, cg, cb, core) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
    g.addColorStop(0, 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (0.5 * core) + ')');
    g.addColorStop(1, 'rgba(' + cr + ',' + cg + ',' + cb + ',0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + core + ')';
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  }

  /* ------------------------------------------------------------------
     (a) DISPATCH — denser role-node mesh with depth. Data packets
         stream along edges leaving a short comet trail; arrivals fire
         an expanding ring; rare amber success blip. Volumetric haze.
     ------------------------------------------------------------------ */
  function dispatch() {
    var nodes = [], edges = [], packets = [], rings = [], NN, haze = makeHaze(3);
    return {
      init: function (W, H) {
        NN = (COARSE || W < 620) ? 7 : 13;
        nodes = [];
        for (var i = 0; i < NN; i++) {
          var z = rand(0.45, 1);
          nodes.push({
            x: rand(0.08, 0.92) * W,
            y: rand(0.12, 0.88) * H,
            r: (2.2 + z * 3.2), z: z,
            pulse: Math.random() * Math.PI * 2
          });
        }
        edges = [];
        for (var a = 0; a < NN; a++) {
          for (var b = a + 1; b < NN; b++) {
            var dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y;
            if (Math.hypot(dx, dy) < W * 0.46) edges.push([a, b]);
          }
        }
        packets = []; rings = [];
        haze.init(W, H);
      },
      render: function (W, H, ctx, t, isStill) {
        haze.render(W, H, ctx, isStill);
        // edges
        ctx.lineWidth = 1;
        for (var e = 0; e < edges.length; e++) {
          var A = nodes[edges[e][0]], B = nodes[edges[e][1]];
          ctx.strokeStyle = HAIR;
          ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
        }
        // spawn packets (denser)
        if (!isStill && edges.length && t % 11 === 0 && packets.length < NN + 8) {
          var edge = edges[(Math.random() * edges.length) | 0];
          packets.push({ e: edge, p: 0, sp: rand(0.008, 0.018), ok: Math.random() < 0.08 });
        }
        // packets travel with comet trail
        for (var i = packets.length - 1; i >= 0; i--) {
          var pk = packets[i], A2 = nodes[pk.e[0]], B2 = nodes[pk.e[1]];
          if (!isStill) pk.p += pk.sp; else pk.p = 0.5;
          var x = A2.x + (B2.x - A2.x) * pk.p;
          var y = A2.y + (B2.y - A2.y) * pk.p;
          var tp = clamp(pk.p - 0.06, 0, 1);
          var tx = A2.x + (B2.x - A2.x) * tp, ty = A2.y + (B2.y - A2.y) * tp;
          var tg = ctx.createLinearGradient(tx, ty, x, y);
          var col = pk.ok ? '244,184,96' : '94,234,212';
          tg.addColorStop(0, 'rgba(' + col + ',0)');
          tg.addColorStop(1, 'rgba(' + col + ',0.55)');
          ctx.strokeStyle = tg; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
          ctx.lineWidth = 1;
          glowDot(ctx, x, y, 2, pk.ok ? 244 : 94, pk.ok ? 184 : 234, pk.ok ? 96 : 212, 0.95);
          if (pk.p >= 1) {
            B2.pulse = 0;
            rings.push({ x: B2.x, y: B2.y, p: 0, ok: pk.ok });
            packets.splice(i, 1);
          }
        }
        // arrival rings
        for (var g = rings.length - 1; g >= 0; g--) {
          var rg = rings[g];
          if (!isStill) rg.p += 0.045; else rg.p = 0.5;
          var rr = 4 + rg.p * 16;
          ctx.strokeStyle = (rg.ok ? 'rgba(244,184,96,' : 'rgba(94,234,212,') + (0.5 * (1 - rg.p)) + ')';
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(rg.x, rg.y, rr, 0, 7); ctx.stroke();
          ctx.lineWidth = 1;
          if (rg.p >= 1) rings.splice(g, 1);
        }
        // nodes with depth glow
        for (var nn = 0; nn < nodes.length; nn++) {
          var nd = nodes[nn];
          if (!isStill) nd.pulse += 0.045;
          var core = 0.5 + 0.35 * Math.abs(Math.sin(nd.pulse)) * nd.z;
          glowDot(ctx, nd.x, nd.y, nd.r, 94, 234, 212, clamp(core, 0, 1));
        }
      }
    };
  }

  /* ------------------------------------------------------------------
     (b) TELEMETRY — denser rising bars, live sparkline, drifting data
         stream dots along the top, and a soft scan sweep with glow.
     ------------------------------------------------------------------ */
  function telemetry() {
    var bars = [], spark = [], stream = [], NB, scan = 0, haze = makeHaze(2);
    return {
      init: function (W, H) {
        NB = (COARSE || W < 620) ? 14 : 26;
        bars = [];
        for (var i = 0; i < NB; i++) bars.push({ v: rand(0.2, 0.8), tv: rand(0.2, 0.9), ph: Math.random() });
        spark = [];
        for (var s = 0; s < 56; s++) spark.push(rand(0.3, 0.7));
        stream = [];
        var SN = (COARSE || W < 620) ? 6 : 12;
        for (var d = 0; d < SN; d++) stream.push({ x: rand(0, 1), v: rand(0.15, 0.85), sp: rand(0.0016, 0.004) });
        scan = 0;
        haze.init(W, H);
      },
      render: function (W, H, ctx, t, isStill) {
        haze.render(W, H, ctx, isStill);
        var padX = W * 0.07, padY = H * 0.16;
        var gw = (W - padX * 2) / NB, bw = gw * 0.44;
        var baseY = H - padY;
        // bars
        for (var i = 0; i < NB; i++) {
          var b = bars[i];
          if (!isStill) {
            b.v += (b.tv - b.v) * 0.045;
            if (Math.abs(b.tv - b.v) < 0.02) b.tv = rand(0.15, 0.95);
          }
          var bh = b.v * (H * 0.46);
          var x = padX + i * gw + (gw - bw) / 2;
          ctx.fillStyle = 'rgba(45,212,191,0.10)';
          ctx.fillRect(x, baseY - (H * 0.46), bw, H * 0.46);
          var amber = i % 11 === 5;
          ctx.fillStyle = amber ? AMBER : TEAL;
          ctx.globalAlpha = 0.75;
          ctx.fillRect(x, baseY - bh, bw, bh);
          ctx.globalAlpha = 1;
          // glowing tip
          glowDot(ctx, x + bw / 2, baseY - bh, 1.6, amber ? 244 : 94, amber ? 184 : 234, amber ? 96 : 212, 0.7);
        }
        // drifting data-stream dots across the top
        for (var s = 0; s < stream.length; s++) {
          var st = stream[s];
          if (!isStill) { st.x += st.sp; if (st.x > 1) { st.x = 0; st.v = rand(0.15, 0.85); } }
          var dx = padX + st.x * (W - padX * 2);
          var dy = padY * 0.5 + (1 - st.v) * (H * 0.12);
          glowDot(ctx, dx, dy, 1.4, 94, 234, 212, 0.6);
        }
        // sparkline across top
        if (!isStill && t % 8 === 0) { spark.shift(); spark.push(clamp(spark[spark.length - 1] + rand(-0.12, 0.12), 0.15, 0.85)); }
        ctx.strokeStyle = FOCUS; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7;
        ctx.beginPath();
        for (var k = 0; k < spark.length; k++) {
          var sx = padX + (k / (spark.length - 1)) * (W - padX * 2);
          var sy = padY + (1 - spark[k]) * (H * 0.16);
          k ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
        }
        ctx.stroke(); ctx.globalAlpha = 1;
        // scan-line sweep
        if (!isStill) { scan += 1.3; if (scan > W) scan = 0; }
        var sw = isStill ? W * 0.5 : scan;
        var grad = ctx.createLinearGradient(sw - 90, 0, sw, 0);
        grad.addColorStop(0, 'rgba(94,234,212,0)');
        grad.addColorStop(1, 'rgba(94,234,212,0.22)');
        ctx.fillStyle = grad; ctx.fillRect(sw - 90, 0, 90, H);
      }
    };
  }

  /* ------------------------------------------------------------------
     (c) CONSTELLATION — denser slowly-rotating agent network with
         depth (z-scaled brightness/size), central volumetric core,
         more pulses firing between agents, pointer parallax.
     ------------------------------------------------------------------ */
  function constellation() {
    var pts = [], NN, cx, cy, rot = 0, mx = 0, my = 0, pulses = [], haze = makeHaze(2);
    return {
      init: function (W, H) {
        NN = (COARSE || W < 620) ? 22 : 56;
        cx = W / 2; cy = H / 2; pts = [];
        var R = Math.min(W, H) * 0.46;
        for (var i = 0; i < NN; i++) {
          var ang = rand(0, Math.PI * 2), rad = Math.sqrt(Math.random()) * R;
          pts.push({ ang: ang, rad: rad, z: rand(0.4, 1), r: rand(1.1, 2.8) });
        }
        pulses = [];
        haze.init(W, H);
        if (FINE && !COARSE) {
          canvasParallax(W, H, function (nx, ny) { mx = nx; my = ny; });
        }
      },
      render: function (W, H, ctx, t, isStill) {
        haze.render(W, H, ctx, isStill);
        cx = W / 2; cy = H / 2;
        if (!isStill) rot += 0.0011;
        var px = mx * 18, py = my * 18;
        var xy = [];
        for (var i = 0; i < NN; i++) {
          var p = pts[i];
          var a = p.ang + rot * p.z;
          var x = cx + Math.cos(a) * p.rad + px * p.z;
          var y = cy + Math.sin(a) * p.rad * 0.6 + py * p.z;
          xy.push([x, y]);
        }
        // edges near
        var near = W * 0.14;
        ctx.lineWidth = 1;
        for (var m = 0; m < NN; m++) {
          for (var n = m + 1; n < NN; n++) {
            var dx = xy[m][0] - xy[n][0], dy = xy[m][1] - xy[n][1];
            var d = Math.hypot(dx, dy);
            if (d < near) {
              ctx.strokeStyle = 'rgba(45,212,191,' + (0.14 * (1 - d / near)) + ')';
              ctx.beginPath(); ctx.moveTo(xy[m][0], xy[m][1]); ctx.lineTo(xy[n][0], xy[n][1]); ctx.stroke();
            }
          }
        }
        // pulses firing between agents (more life)
        if (!isStill && t % 16 === 0 && pulses.length < 12) {
          var s = (Math.random() * NN) | 0, e = (Math.random() * NN) | 0;
          if (s !== e) pulses.push({ s: s, e: e, p: 0, ok: Math.random() < 0.07 });
        }
        for (var q = pulses.length - 1; q >= 0; q--) {
          var pu = pulses[q];
          if (!isStill) pu.p += 0.02; else pu.p = 0.5;
          var sx = xy[pu.s][0] + (xy[pu.e][0] - xy[pu.s][0]) * pu.p;
          var sy = xy[pu.s][1] + (xy[pu.e][1] - xy[pu.s][1]) * pu.p;
          glowDot(ctx, sx, sy, 2, pu.ok ? 244 : 94, pu.ok ? 184 : 234, pu.ok ? 96 : 212, 0.9);
          if (pu.p >= 1) pulses.splice(q, 1);
        }
        // nodes with depth glow
        for (var k = 0; k < NN; k++) {
          var pt = pts[k];
          glowDot(ctx, xy[k][0], xy[k][1], pt.r, 94, 234, 212, 0.35 + 0.45 * pt.z);
        }
      }
    };
  }

  /* ------------------------------------------------------------------
     (d) FIELD — full-bleed low-opacity "agent network" backdrop band.
         Slowly-drifting depth particles with faint proximity links.
         No rotation, no chrome: quiet ambient presence behind copy.
     ------------------------------------------------------------------ */
  function field() {
    var pts = [], NN, haze = makeHaze(3);
    return {
      init: function (W, H) {
        NN = (COARSE || W < 620) ? 14 : 34;
        pts = [];
        for (var i = 0; i < NN; i++) {
          var z = rand(0.35, 1);
          pts.push({
            x: rand(0, 1) * W, y: rand(0, 1) * H, z: z,
            vx: rand(-0.16, 0.16) * z, vy: rand(-0.10, 0.10) * z,
            r: 0.8 + z * 1.6
          });
        }
        haze.init(W, H);
      },
      render: function (W, H, ctx, t, isStill) {
        haze.render(W, H, ctx, isStill);
        for (var i = 0; i < NN; i++) {
          var p = pts[i];
          if (!isStill) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
            if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
          }
        }
        var near = Math.min(W, H) * 0.22;
        ctx.lineWidth = 1;
        for (var m = 0; m < NN; m++) {
          for (var n = m + 1; n < NN; n++) {
            var dx = pts[m].x - pts[n].x, dy = pts[m].y - pts[n].y;
            var d = Math.hypot(dx, dy);
            if (d < near) {
              ctx.strokeStyle = 'rgba(45,212,191,' + (0.06 * (1 - d / near)) + ')';
              ctx.beginPath(); ctx.moveTo(pts[m].x, pts[m].y); ctx.lineTo(pts[n].x, pts[n].y); ctx.stroke();
            }
          }
        }
        for (var k = 0; k < NN; k++) {
          glowDot(ctx, pts[k].x, pts[k].y, pts[k].r, 94, 234, 212, 0.18 + 0.22 * pts[k].z);
        }
      }
    };
  }

  function canvasParallax(W, H, cb) {
    window.addEventListener('pointermove', function (e) {
      cb((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2);
    }, { passive: true });
  }

  var FACTORIES = { dispatch: dispatch, telemetry: telemetry, constellation: constellation, field: field };

  function boot() {
    var canvases = document.querySelectorAll('canvas[data-agents]');
    for (var i = 0; i < canvases.length; i++) {
      var type = canvases[i].getAttribute('data-agents');
      var f = FACTORIES[type];
      if (f) makeCanvas(canvases[i], f());
    }
    spineConnector();
    faqAccordion();
  }

  /* ------------------------------------------------------------------
     Method connector: draw the teal spine as it enters view.
     ------------------------------------------------------------------ */
  function spineConnector() {
    var spine = document.querySelector('[data-spine]');
    if (!spine) return;
    if (REDUCE || !('IntersectionObserver' in window)) { spine.classList.add('is-active'); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { spine.classList.add('is-active'); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(spine);
  }

  /* ------------------------------------------------------------------
     Accordion — ARIA APG (independent panels, full keyboard contract).
     ------------------------------------------------------------------ */
  function faqAccordion() {
    var root = document.querySelector('[data-faq]');
    if (!root) return;
    var btns = Array.prototype.slice.call(root.querySelectorAll('.faq__btn'));

    function panelFor(btn) { return document.getElementById(btn.getAttribute('aria-controls')); }
    function setOpen(btn, open) {
      btn.setAttribute('aria-expanded', String(open));
      var panel = panelFor(btn);
      if (open) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
    }

    btns.forEach(function (btn, idx) {
      btn.addEventListener('click', function () {
        setOpen(btn, btn.getAttribute('aria-expanded') !== 'true');
      });
      btn.addEventListener('keydown', function (e) {
        var k = e.key;
        if (k === 'ArrowDown') { e.preventDefault(); btns[(idx + 1) % btns.length].focus(); }
        else if (k === 'ArrowUp') { e.preventDefault(); btns[(idx - 1 + btns.length) % btns.length].focus(); }
        else if (k === 'Home') { e.preventDefault(); btns[0].focus(); }
        else if (k === 'End') { e.preventDefault(); btns[btns.length - 1].focus(); }
      });
      // Escape from within the panel closes + refocuses the button
      var panel = panelFor(btn);
      if (panel) panel.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { setOpen(btn, false); btn.focus(); }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
