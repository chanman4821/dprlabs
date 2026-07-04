/* Deeper — live canvas widgets that replace every static decorative image.
   Each <canvas data-widget="..."> is sized to its container (DPR-aware),
   only animates while on screen, and respects prefers-reduced-motion. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  // shared smoothed pointer (for the parallax-reactive neural hero)
  var MX = 0, MY = 0, tMX = 0, tMY = 0;
  window.addEventListener('pointermove', function (e) {
    tMX = e.clientX / window.innerWidth - 0.5;
    tMY = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  var REG = {};
  function widget(name, init, draw) { REG[name] = { init: init, draw: draw }; }

  function mount(canvas) {
    var def = REG[canvas.getAttribute('data-widget')];
    if (!def) return;
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, t = 0, running = false, visible = false, state = {};

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      canvas.width = Math.round(w * DPR); canvas.height = Math.round(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    state = def.init ? def.init(w, h) : {};

    function loop() {
      if (!visible) { running = false; return; }
      running = true;
      t += 0.016;
      def.draw(ctx, w, h, t, state);
      if (reduce) { running = false; return; }
      requestAnimationFrame(loop);
    }

    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        resize();
        state = def.init ? def.init(w, h) : state;
        if (!running) def.draw(ctx, w, h, t, state);
      }).observe(canvas);
    }
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        visible = e.isIntersecting;
        if (visible && !running) loop();
      });
    }, { threshold: 0.02 }).observe(canvas);

    def.draw(ctx, w, h, 0, state); // first paint
  }

  /* ---------- 1. DEPTH (services) — light shafts + rising motes ---------- */
  widget('depth',
    function (w, h) {
      var m = [];
      for (var i = 0; i < 46; i++) m.push({
        x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.5,
        s: Math.random() * 0.35 + 0.12, a: Math.random() * 0.5 + 0.2, ph: Math.random() * 6.28
      });
      return { m: m };
    },
    function (ctx, w, h, t, st) {
      ctx.clearRect(0, 0, w, h);
      var g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(12,52,64,0.9)'); g.addColorStop(1, 'rgba(6,12,20,0.96)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < 5; i++) {
        var x = w * (0.1 + i * 0.2) + Math.sin(t * 0.3 + i) * 22;
        var grd = ctx.createLinearGradient(x, 0, x - 70, h);
        grd.addColorStop(0, 'rgba(120,220,240,' + (0.05 + 0.04 * (0.5 + 0.5 * Math.sin(t + i))).toFixed(3) + ')');
        grd.addColorStop(1, 'rgba(120,220,240,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x + 46, 0); ctx.lineTo(x - 34, h); ctx.lineTo(x - 100, h);
        ctx.closePath(); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      for (var j = 0; j < st.m.length; j++) {
        var p = st.m[j];
        if (!reduce) { p.y -= p.s; if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; } }
        var a = p.a * (0.55 + 0.45 * Math.sin(t * 2 + p.ph));
        ctx.fillStyle = 'rgba(150,230,245,' + Math.max(0, a).toFixed(3) + ')';
        ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(63,208,230,0.7)';
        ctx.beginPath(); ctx.arc(p.x + Math.sin(t + p.ph) * 4, p.y, p.r, 0, 6.28); ctx.fill();
      }
      ctx.shadowBlur = 0;
    });

  /* ---------- 2. DIVE (process) — pulse travelling down a 4-node spine ---------- */
  widget('dive', null,
    function (ctx, w, h, t, st) {
      ctx.clearRect(0, 0, w, h);
      var cx = w * 0.5, top = h * 0.12, bot = h * 0.88;
      ctx.strokeStyle = 'rgba(63,208,230,0.16)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(cx, bot); ctx.stroke();
      var p = (t * 0.13) % 1, py = top + (bot - top) * p;
      var seg = ctx.createLinearGradient(0, py - 70, 0, py + 70);
      seg.addColorStop(0, 'rgba(63,208,230,0)');
      seg.addColorStop(0.5, 'rgba(140,235,250,0.95)');
      seg.addColorStop(1, 'rgba(63,208,230,0)');
      ctx.strokeStyle = seg; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, py - 70); ctx.lineTo(cx, py + 70); ctx.stroke();
      for (var i = 0; i < 4; i++) {
        var ny = top + (bot - top) * (i / 3);
        var near = Math.max(0, 1 - Math.abs(ny - py) / 80);
        var r = 11 + near * 9;
        ctx.fillStyle = 'rgba(8,16,24,0.92)';
        ctx.beginPath(); ctx.arc(cx, ny, r, 0, 6.28); ctx.fill();
        ctx.strokeStyle = 'rgba(63,208,230,' + (0.35 + 0.65 * near).toFixed(3) + ')';
        ctx.lineWidth = 2; ctx.shadowBlur = near * 22; ctx.shadowColor = '#3fd0e6';
        ctx.beginPath(); ctx.arc(cx, ny, r, 0, 6.28); ctx.stroke(); ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(230,245,255,' + (0.5 + 0.5 * near).toFixed(3) + ')';
        ctx.font = '600 12px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('0' + (i + 1), cx, ny);
        ctx.strokeStyle = 'rgba(63,208,230,' + (0.08 + 0.32 * near).toFixed(3) + ')'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx + r + 4, ny); ctx.lineTo(cx + r + 30, ny); ctx.stroke();
      }
    });

  /* ---------- 3. CHART (results) — money line climbing, draws on reveal ---------- */
  widget('chart',
    function () {
      var n = 26, v = 0.22, pts = [];
      for (var i = 0; i < n; i++) {
        v += (Math.random() * 0.1 - 0.028) + 0.03;
        pts.push(Math.max(0.06, Math.min(0.95, v)));
      }
      pts[n - 1] = Math.max(pts[n - 1], 0.86);
      return { pts: pts, n: n };
    },
    function (ctx, w, h, t, st) {
      ctx.clearRect(0, 0, w, h);
      var pl = 12, pr = 12, pt = 18, pb = 16, iw = w - pl - pr, ih = h - pt - pb;
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
      for (var gg = 0; gg <= 3; gg++) {
        var gy = pt + ih * gg / 3;
        ctx.beginPath(); ctx.moveTo(pl, gy); ctx.lineTo(w - pr, gy); ctx.stroke();
      }
      function X(i) { return pl + iw * i / (st.n - 1); }
      function Y(i) {
        var jig = i === st.n - 1 ? Math.sin(t * 2) * 0.012 : 0;
        return pt + ih * (1 - (st.pts[i] + jig));
      }
      var prog = Math.min(1, t / 2.0);
      var nShow = Math.max(2, Math.round(prog * st.n));
      ctx.beginPath(); ctx.moveTo(X(0), h - pb);
      for (var a = 0; a < nShow; a++) ctx.lineTo(X(a), Y(a));
      ctx.lineTo(X(nShow - 1), h - pb); ctx.closePath();
      var ag = ctx.createLinearGradient(0, pt, 0, h - pb);
      ag.addColorStop(0, 'rgba(86,224,164,0.34)'); ag.addColorStop(1, 'rgba(86,224,164,0)');
      ctx.fillStyle = ag; ctx.fill();
      ctx.beginPath();
      for (var b = 0; b < nShow; b++) { b === 0 ? ctx.moveTo(X(b), Y(b)) : ctx.lineTo(X(b), Y(b)); }
      var lg = ctx.createLinearGradient(pl, 0, w - pr, 0);
      lg.addColorStop(0, '#3fd0e6'); lg.addColorStop(1, '#ffd166');
      ctx.strokeStyle = lg; ctx.lineWidth = 2.4;
      ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(86,224,164,0.6)'; ctx.stroke(); ctx.shadowBlur = 0;
      var li = nShow - 1;
      ctx.fillStyle = '#ffd166';
      ctx.beginPath(); ctx.arc(X(li), Y(li), 3.4 + Math.sin(t * 4) * 0.8, 0, 6.28); ctx.fill();
      ctx.strokeStyle = 'rgba(255,209,102,0.4)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(X(li), Y(li), 8 + Math.sin(t * 4) * 2, 0, 6.28); ctx.stroke();
    });

  /* ---------- 4. FLOW (about) — flow-field particle stream ---------- */
  widget('flow',
    function () {
      var ps = [];
      for (var i = 0; i < 80; i++) ps.push({ x: Math.random(), y: Math.random() });
      return { ps: ps, first: true };
    },
    function (ctx, w, h, t, st) {
      if (st.first) { ctx.clearRect(0, 0, w, h); st.first = false; }
      ctx.fillStyle = 'rgba(7,13,20,0.16)'; ctx.fillRect(0, 0, w, h);
      for (var i = 0; i < st.ps.length; i++) {
        var p = st.ps[i];
        var ang = Math.sin(p.x * 3 + t * 0.2) * 1.6 + Math.cos(p.y * 3 - t * 0.15) * 1.6;
        if (!reduce) {
          p.x += Math.cos(ang) * 0.0017; p.y += Math.sin(ang) * 0.0017 + 0.0004;
          if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
          if (p.y > 1) { p.y = 0; p.x = Math.random(); }
        }
        var px = p.x * w, py = p.y * h;
        ctx.fillStyle = 'rgba(120,225,240,0.55)';
        ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(63,208,230,0.6)';
        ctx.beginPath(); ctx.arc(px, py, 1.3, 0, 6.28); ctx.fill();
      }
      ctx.shadowBlur = 0;
    });

  /* ---------- 5. NEURAL (hero) — real rotating wired-sphere of nodes ---------- */
  widget('neural',
    function () {
      var N = 92, nodes = [], golden = Math.PI * (3 - Math.sqrt(5));
      for (var i = 0; i < N; i++) {
        var y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(Math.max(0, 1 - y * y)), th = golden * i;
        nodes.push({ x: Math.cos(th) * rad, y: y, z: Math.sin(th) * rad });
      }
      var edges = [], seen = {};
      for (var a = 0; a < N; a++) {
        var ds = [];
        for (var b = 0; b < N; b++) if (b !== a) {
          var dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y, dz = nodes[a].z - nodes[b].z;
          ds.push({ j: b, d: dx * dx + dy * dy + dz * dz });
        }
        ds.sort(function (m, n) { return m.d - n.d; });
        for (var k = 0; k < 3; k++) {
          var j = ds[k].j, key = a < j ? a + '_' + j : j + '_' + a;
          if (!seen[key]) { seen[key] = 1; edges.push([a, j]); }
        }
      }
      var pulses = [];
      for (var q = 0; q < 18; q++) pulses.push({
        e: Math.floor(Math.random() * edges.length), p: Math.random(), s: 0.004 + Math.random() * 0.011
      });
      return { nodes: nodes, edges: edges, pulses: pulses };
    },
    function (ctx, w, h, t, st) {
      ctx.clearRect(0, 0, w, h);
      MX += (tMX - MX) * 0.05; MY += (tMY - MY) * 0.05;
      var cx = w / 2, cy = h / 2, scale = Math.min(w, h) * 0.40, focal = 2.7;
      // soft core glow
      var cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.15);
      cg.addColorStop(0, 'rgba(63,208,230,0.20)');
      cg.addColorStop(0.5, 'rgba(63,208,230,0.06)');
      cg.addColorStop(1, 'rgba(63,208,230,0)');
      ctx.fillStyle = cg; ctx.fillRect(0, 0, w, h);
      var ay = t * 0.13 + MX * 0.7, ax = -0.32 + MY * 0.45;
      var cY = Math.cos(ay), sY = Math.sin(ay), cX = Math.cos(ax), sX = Math.sin(ax);
      var P = st.nodes.map(function (n) {
        var x1 = n.x * cY - n.z * sY, z1 = n.x * sY + n.z * cY, y1 = n.y;
        var y2 = y1 * cX - z1 * sX, z2 = y1 * sX + z1 * cX;
        var persp = focal / (focal - z2);
        return { sx: cx + x1 * scale * persp, sy: cy + y2 * scale * persp, z: z2, d: (z2 + 1) / 2, persp: persp };
      });
      for (var e = 0; e < st.edges.length; e++) {
        var ea = P[st.edges[e][0]], eb = P[st.edges[e][1]], dd = (ea.d + eb.d) / 2;
        ctx.strokeStyle = 'rgba(80,216,236,' + (0.06 + 0.30 * dd).toFixed(3) + ')';
        ctx.lineWidth = 0.6 + dd * 1.2;
        ctx.beginPath(); ctx.moveTo(ea.sx, ea.sy); ctx.lineTo(eb.sx, eb.sy); ctx.stroke();
      }
      for (var i = 0; i < st.pulses.length; i++) {
        var pu = st.pulses[i];
        if (!reduce) { pu.p += pu.s; if (pu.p > 1) { pu.p = 0; pu.e = Math.floor(Math.random() * st.edges.length); } }
        var pa = P[st.edges[pu.e][0]], pb = P[st.edges[pu.e][1]];
        var px = pa.sx + (pb.sx - pa.sx) * pu.p, py = pa.sy + (pb.sy - pa.sy) * pu.p, pd = (pa.d + pb.d) / 2;
        ctx.fillStyle = 'rgba(170,242,255,' + (0.55 + 0.45 * pd).toFixed(3) + ')';
        ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(120,230,250,0.95)';
        ctx.beginPath(); ctx.arc(px, py, 1.7 + pd * 1.4, 0, 6.28); ctx.fill();
      }
      ctx.shadowBlur = 0;
      var order = P.map(function (_, i) { return i; }).sort(function (m, n) { return P[m].z - P[n].z; });
      for (var o = 0; o < order.length; o++) {
        var p = P[order[o]], r = Math.max(0.8, (1.0 + p.d * 3.0) * (0.6 + p.persp * 0.4));
        var hue = (order[o] % 11 === 0) ? '255,209,102' : (order[o] % 7 === 0) ? '180,140,255' : '130,232,250';
        ctx.fillStyle = 'rgba(' + hue + ',' + (0.4 + 0.6 * p.d).toFixed(3) + ')';
        ctx.shadowBlur = 4 + p.d * 11; ctx.shadowColor = 'rgba(63,208,230,0.9)';
        ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, 6.28); ctx.fill();
      }
      ctx.shadowBlur = 0;
    });

  /* ---------- 6. SONAR (Strategy) — rotating sweep revealing opportunity blips ---------- */
  widget('sonar',
    function (w, h) {
      var blips = [], N = 9;
      for (var i = 0; i < N; i++) blips.push({
        a: Math.random() * 6.283,                 // angle
        r: 0.30 + Math.random() * 0.62,           // normalised radius
        v: 0.18 + Math.random() * 0.8,            // payoff weight (size)
        lit: 0                                     // brightness 0..1, decays
      });
      return { blips: blips, sweep: -0.7 };
    },
    function (ctx, w, h, t, st) {
      ctx.clearRect(0, 0, w, h);
      var cx = w * 0.5, cy = h * 0.5, R = Math.min(w, h) * 0.46;
      // backdrop
      var bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      bg.addColorStop(0, 'rgba(10,28,38,0.55)');
      bg.addColorStop(1, 'rgba(5,10,18,0)');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      // range rings + cross hairs
      ctx.strokeStyle = 'rgba(63,208,230,0.16)'; ctx.lineWidth = 1;
      for (var g = 1; g <= 3; g++) {
        ctx.beginPath(); ctx.arc(cx, cy, R * g / 3, 0, 6.283); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
      ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
      // sweep angle (still under reduced-motion: fixed)
      st.sweep = reduce ? 0.6 : (t * 0.85);
      var sa = st.sweep % 6.283;
      // sweep wedge trail
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(sa);
      for (var s = 0; s < 22; s++) {
        ctx.fillStyle = 'rgba(86,224,240,' + (0.05 * (1 - s / 22)).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.arc(0, 0, R, -s * 0.03 - 0.02, -s * 0.03); ctx.closePath(); ctx.fill();
      }
      // leading edge line
      ctx.strokeStyle = 'rgba(150,238,250,0.85)'; ctx.lineWidth = 1.6;
      ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(86,224,240,0.8)';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R, 0); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
      // blips: light up as the sweep passes
      for (var i = 0; i < st.blips.length; i++) {
        var b = st.blips[i];
        var da = ((sa - b.a) % 6.283 + 6.283) % 6.283;   // 0 just-swept
        if (da < 0.10) b.lit = 1;
        else if (!reduce) b.lit *= 0.985;
        if (reduce) b.lit = 0.55;
        var bx = cx + Math.cos(b.a) * b.r * R, by = cy + Math.sin(b.a) * b.r * R;
        var rad = 2.4 + b.v * 5;
        ctx.fillStyle = 'rgba(255,209,102,' + (0.18 + 0.72 * b.lit).toFixed(3) + ')';
        ctx.shadowBlur = 4 + 18 * b.lit; ctx.shadowColor = 'rgba(255,209,102,0.9)';
        ctx.beginPath(); ctx.arc(bx, by, rad, 0, 6.283); ctx.fill();
        ctx.shadowBlur = 0;
        if (b.lit > 0.25) {
          ctx.strokeStyle = 'rgba(255,209,102,' + (0.4 * b.lit).toFixed(3) + ')'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(bx, by, rad + 5 + (1 - b.lit) * 16, 0, 6.283); ctx.stroke();
        }
      }
      // centre
      ctx.fillStyle = 'rgba(150,238,250,0.95)';
      ctx.shadowBlur = 14; ctx.shadowColor = 'rgba(86,224,240,0.9)';
      ctx.beginPath(); ctx.arc(cx, cy, 3.4, 0, 6.283); ctx.fill();
      ctx.shadowBlur = 0;
    });

  /* ---------- 7. PIPELINE (Automation) — nodes lighting in sequence ---------- */
  widget('pipeline',
    function (w, h) {
      return { phase: 0 };
    },
    function (ctx, w, h, t, st) {
      ctx.clearRect(0, 0, w, h);
      var N = 4, padX = w * 0.16, span = w - padX * 2, cy = h * 0.5;
      function nx(i) { return padX + span * (i / (N - 1)); }
      var head = reduce ? 1.4 : (t * 0.6) % (N + 0.6);   // travelling current
      // connecting rail
      ctx.strokeStyle = 'rgba(86,224,164,0.18)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(nx(0), cy); ctx.lineTo(nx(N - 1), cy); ctx.stroke();
      // lit portion of the rail
      var litX = padX + span * Math.min(1, head / (N - 1));
      var rg = ctx.createLinearGradient(nx(0), 0, litX, 0);
      rg.addColorStop(0, 'rgba(86,224,164,0.55)'); rg.addColorStop(1, 'rgba(150,240,210,0.95)');
      ctx.strokeStyle = rg; ctx.lineWidth = 3;
      ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(86,224,164,0.7)';
      ctx.beginPath(); ctx.moveTo(nx(0), cy); ctx.lineTo(litX, cy); ctx.stroke();
      ctx.shadowBlur = 0;
      // flowing dots
      if (!reduce) for (var d = 0; d < 5; d++) {
        var fp = ((t * 0.5 + d / 5) % 1);
        var fx = nx(0) + (nx(N - 1) - nx(0)) * fp;
        ctx.fillStyle = 'rgba(150,240,210,' + (0.5 - 0.4 * Math.abs(fp - 0.5)).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(fx, cy, 1.8, 0, 6.283); ctx.fill();
      }
      // nodes
      for (var i = 0; i < N; i++) {
        var near = Math.max(0, 1 - Math.abs(head - i));
        if (reduce) near = i === 1 ? 1 : 0.2;
        var x = nx(i), r = 12 + near * 8;
        ctx.fillStyle = 'rgba(7,16,14,0.95)';
        ctx.beginPath(); ctx.arc(x, cy, r, 0, 6.283); ctx.fill();
        ctx.strokeStyle = 'rgba(86,224,164,' + (0.35 + 0.65 * near).toFixed(3) + ')';
        ctx.lineWidth = 2; ctx.shadowBlur = near * 22; ctx.shadowColor = '#56e0a4';
        ctx.beginPath(); ctx.arc(x, cy, r, 0, 6.283); ctx.stroke(); ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(210,255,235,' + (0.45 + 0.55 * near).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(x, cy, 2.6 + near * 1.6, 0, 6.283); ctx.fill();
      }
    });

  document.querySelectorAll('canvas[data-widget]').forEach(mount);
})();
