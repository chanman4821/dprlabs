// Deeper — interactions
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  var nav = document.getElementById('nav');
  var progress = document.getElementById('scrollProgress');
  var parallax = [].slice.call(document.querySelectorAll('[data-parallax]'));
  var dgFill = document.getElementById('dgFill');
  var dgVal = document.getElementById('dgVal');
  var gauge = document.getElementById('depthGauge');
  var heroOrb = document.getElementById('heroOrb');
  var MAX_DEPTH = 10994; // Mariana Trench, metres
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 80);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? y / h : 0;
    progress.style.width = (pct * 100) + '%';
    if (gauge) {
      gauge.classList.toggle('show', y > window.innerHeight * 0.5);
      if (dgFill) dgFill.style.height = (pct * 100) + '%';
      if (dgVal) dgVal.textContent = Math.round(pct * MAX_DEPTH).toLocaleString();
    }
    if (heroOrb && y < window.innerHeight) {
      heroOrb.style.transform = 'translateY(' + (y * 0.12) + 'px)';
    }
    parallax.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var amt = parseFloat(el.getAttribute('data-parallax')) || 0.08;
      var off = (r.top + r.height / 2 - window.innerHeight / 2) * -amt;
      el.style.transform = 'translateY(' + off.toFixed(1) + 'px) scale(1.06)';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Staggered reveal
  var groups = {};
  [].forEach.call(document.querySelectorAll('.reveal-up'), function (el) {
    var parent = el.parentElement;
    groups[parent.className] = groups[parent.className] || [];
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var sibs = [].slice.call(el.parentElement.children).filter(function (c) {
        return c.classList.contains('reveal-up');
      });
      var idx = sibs.indexOf(el);
      el.style.setProperty('--d', (Math.max(0, idx) * 0.08) + 's');
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal-up').forEach(function (el) { io.observe(el); });

  // Count-up
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (reduce) { el.textContent = target.toLocaleString(); return; }
    var dur = 1500, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-target]').forEach(function (el) { cio.observe(el); });

  // Cursor glow
  var glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    var gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener('pointermove', function (e) { gx = e.clientX; gy = e.clientY; });
    (function loop() {
      cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
      glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  }

  // 3D tilt cards
  if (window.matchMedia('(pointer:fine)').matches && !reduce) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'rotateX(' + (-py * 7).toFixed(2) + 'deg) rotateY(' +
          (px * 9).toFixed(2) + 'deg) translateY(-6px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  // Magnetic buttons
  if (window.matchMedia('(pointer:fine)').matches && !reduce) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.35 + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  // Anchor scroll offset
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) { ev.preventDefault(); return; }
      var t = document.querySelector(id);
      if (!t) return;
      ev.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });
  });

  /* ===== Chat demo ===== */
  var chatLog = document.getElementById('chatLog');
  var chatChips = document.getElementById('chatChips');
  if (chatLog && chatChips) {
    chatChips.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip || chip.disabled) return;
      chip.disabled = true;
      addMsg('user', chip.textContent);
      var ans = chip.getAttribute('data-a');
      var typing = document.createElement('div');
      typing.className = 'msg bot';
      typing.innerHTML = '<div class="bub"><span class="typing"><i></i><i></i><i></i></span></div>';
      chatLog.appendChild(typing);
      chatLog.scrollTop = chatLog.scrollHeight;
      setTimeout(function () {
        chatLog.removeChild(typing);
        typeOut(ans);
      }, 900);
    });
  }
  function addMsg(who, text) {
    var m = document.createElement('div');
    m.className = 'msg ' + who;
    m.innerHTML = '<div class="bub"></div>';
    m.querySelector('.bub').textContent = text;
    chatLog.appendChild(m);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
  function typeOut(text) {
    var m = document.createElement('div');
    m.className = 'msg bot';
    var bub = document.createElement('div');
    bub.className = 'bub';
    m.appendChild(bub);
    chatLog.appendChild(m);
    if (reduce) { bub.textContent = text; return; }
    var i = 0;
    (function step() {
      bub.textContent = text.slice(0, i++);
      chatLog.scrollTop = chatLog.scrollHeight;
      if (i <= text.length) setTimeout(step, 14);
    })();
  }

  /* ===== Project filters ===== */
  var pf = document.getElementById('projFilters');
  var grid = document.getElementById('projGrid');
  if (pf && grid) {
    pf.addEventListener('click', function (e) {
      var btn = e.target.closest('.pf');
      if (!btn) return;
      pf.querySelectorAll('.pf').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-f');
      grid.querySelectorAll('.proj').forEach(function (card) {
        var show = f === 'all' || card.getAttribute('data-cat') === f;
        card.classList.toggle('hide', !show);
      });
    });
  }

  /* ===== Mind map (interactive, draggable) ===== */
  initMindmap();
  function initMindmap() {
    var canvas = document.getElementById('mapCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [
      { label: 'Your business', x: .5, y: .5, r: 46, c: '#3fd0e6', core: true },
      { label: 'Support', x: .22, y: .26, r: 30, c: '#ffae57' },
      { label: 'Invoices', x: .78, y: .24, r: 30, c: '#56e0a4' },
      { label: 'Sales', x: .85, y: .62, r: 30, c: '#ffd166' },
      { label: 'Documents', x: .18, y: .68, r: 30, c: '#b48cff' },
      { label: 'Customers', x: .5, y: .84, r: 30, c: '#ff7eb6' },
      { label: 'Data', x: .5, y: .16, r: 28, c: '#56e0f0' }
    ];
    var edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,6],[2,3],[4,5]];
    nodes.forEach(function (n) { n.hx = n.x; n.hy = n.y; n.vx = 0; n.vy = 0; n.ph = Math.random()*6.28; });

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize); resize();

    var drag = null, t = 0;
    function px(n) { return n.x * W; }
    function py(n) { return n.y * H; }

    function pos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) / W, y: (e.clientY - r.top) / H };
    }
    canvas.addEventListener('pointerdown', function (e) {
      var p = pos(e);
      for (var i = nodes.length - 1; i >= 0; i--) {
        var dx = (p.x - nodes[i].x) * W, dy = (p.y - nodes[i].y) * H;
        if (dx * dx + dy * dy < (nodes[i].r + 8) * (nodes[i].r + 8)) { drag = nodes[i]; canvas.setPointerCapture(e.pointerId); break; }
      }
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var p = pos(e); drag.x = p.x; drag.y = p.y; drag.hx = p.x; drag.hy = p.y;
    });
    canvas.addEventListener('pointerup', function () { drag = null; });

    function draw() {
      t += 0.01;
      ctx.clearRect(0, 0, W, H);
      // float
      nodes.forEach(function (n) {
        if (n === drag) return;
        n.x += (n.hx - n.x) * 0.04 + Math.sin(t + n.ph) * 0.00018;
        n.y += (n.hy - n.y) * 0.04 + Math.cos(t + n.ph) * 0.00018;
      });
      // edges
      edges.forEach(function (ed) {
        var a = nodes[ed[0]], b = nodes[ed[1]];
        var g = ctx.createLinearGradient(px(a), py(a), px(b), py(b));
        g.addColorStop(0, a.c); g.addColorStop(1, b.c);
        ctx.strokeStyle = g; ctx.globalAlpha = 0.3; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(px(a), py(a)); ctx.lineTo(px(b), py(b)); ctx.stroke();
        // pulse
        var m = (Math.sin(t * 2 + ed[0]) + 1) / 2;
        var mx = px(a) + (px(b) - px(a)) * m, my = py(a) + (py(b) - py(a)) * m;
        ctx.globalAlpha = 0.9; ctx.fillStyle = b.c;
        ctx.beginPath(); ctx.arc(mx, my, 2.2, 0, 6.28); ctx.fill();
      });
      ctx.globalAlpha = 1;
      // nodes
      nodes.forEach(function (n) {
        var x = px(n), y = py(n);
        ctx.shadowBlur = 24; ctx.shadowColor = n.c;
        ctx.fillStyle = 'rgba(8,14,22,.92)';
        ctx.beginPath(); ctx.arc(x, y, n.r, 0, 6.28); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = n.core ? 2.4 : 1.6; ctx.strokeStyle = n.c; ctx.globalAlpha = .9;
        ctx.beginPath(); ctx.arc(x, y, n.r, 0, 6.28); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#eef3fb';
        ctx.font = (n.core ? '600 14px ' : '500 12px ') + "Inter, sans-serif";
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n.label, x, y);
      });
      if (!reduce) requestAnimationFrame(draw);
    }
    draw();
  }
})();

function handleSubmit(e) {
  e.preventDefault();
  var note = document.getElementById('formNote');
  if (note) note.hidden = false;
  e.target.querySelectorAll('input,textarea').forEach(function (f) { f.value = ''; });
  return false;
}
