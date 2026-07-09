/* =====================================================================
   reasoning.js — DPR AI · "mesh · reasoning" looping console engine
   Drives a believable reasoning process on a seamless ~22s loop:
     • token-streamed chain-of-thought (Observe → Hypothesize → Consider
       alternatives → Weigh evidence → Decide → Reflect/Revise)
     • a decision graph that grows, prunes branches, and brightens the
       chosen path (canvas 2D, DPR capped at 2)
     • a confidence dial + scored candidate options that re-weigh
     • a self-correction moment that reroutes a branch
     • a short multi-agent exchange (planner ↔ critic → grader)
     • tool-call chips lighting up in sequence
     • a live metrics strip (steps / branches / pruned / confidence)
   Pauses via IntersectionObserver (offscreen) and visibilitychange.
   prefers-reduced-motion → one static fully-populated frame, no motion.
   Honest depiction of the real mesh workflow — no client data.
   ===================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('[data-rs]');
  if (!root) return;

  // ── DOM refs ──────────────────────────────────────────────────────
  var streamEl = root.querySelector('[data-rs-stream]');
  var phaseEl  = root.querySelector('[data-rs-phase]');
  var canvas   = root.querySelector('[data-rs-canvas]');
  var dialArc  = root.querySelector('[data-rs-dial-arc]');
  var dialVal  = root.querySelector('[data-rs-dial-val]');
  var candEls  = {
    A: root.querySelector('[data-cand="A"]'),
    B: root.querySelector('[data-cand="B"]'),
    C: root.querySelector('[data-cand="C"]')
  };
  var agentsEl = root.querySelector('[data-rs-agents]');
  var toolEls  = {};
  Array.prototype.forEach.call(root.querySelectorAll('[data-tool]'), function (t) {
    toolEls[t.getAttribute('data-tool')] = t;
  });
  var mSteps   = root.querySelector('[data-m="steps"]');
  var mBranch  = root.querySelector('[data-m="branches"]');
  var mPruned  = root.querySelector('[data-m="pruned"]');
  var mConf    = root.querySelector('[data-m="conf"]');
  var pageEl   = root.querySelector('[data-rs-page]');
  var pageNo   = 1;

  var ctx = canvas.getContext('2d');

  // ── Metric state ──────────────────────────────────────────────────
  var steps = 0, branchesSeen = 0, branchesPruned = 0, conf = 0.34;

  function setSteps(n) { steps = n; if (mSteps) mSteps.textContent = n; }
  function bumpStep()  { setSteps(steps + 1); }
  function setBranches(n) { branchesSeen = n; if (mBranch) mBranch.textContent = n; }
  function setPruned(n)   { branchesPruned = n; if (mPruned) mPruned.textContent = n; }

  // ── Confidence dial ───────────────────────────────────────────────
  var DIAL_C = 2 * Math.PI * 32; // r=32 in the SVG viewBox
  if (dialArc) { dialArc.style.strokeDasharray = DIAL_C.toFixed(1); }
  function setConf(v) {
    conf = v;
    var txt = v.toFixed(2);
    if (dialVal) dialVal.textContent = txt;
    if (mConf)   mConf.textContent = txt;
    if (dialArc) dialArc.style.strokeDashoffset = (DIAL_C * (1 - v)).toFixed(1);
  }

  // ── Candidate scoring ─────────────────────────────────────────────
  function setCand(id, score, opts) {
    var el = candEls[id]; if (!el) return;
    opts = opts || {};
    var bar = el.querySelector('.rs-cand-bar i');
    var sc  = el.querySelector('.rs-cand-score');
    if (bar) bar.style.width = Math.round(score * 100) + '%';
    if (sc)  sc.textContent = score.toFixed(2);
    el.classList.toggle('is-chosen', !!opts.chosen);
    el.classList.toggle('is-pruned', !!opts.pruned);
  }

  // ── Tool chips ────────────────────────────────────────────────────
  function tool(name, state) {
    var el = toolEls[name]; if (!el) return;
    el.classList.remove('is-active', 'is-done');
    if (state) el.classList.add(state);
  }

  // ── Multi-agent debate ────────────────────────────────────────────
  var MONO = { planner: 'PL', critic: 'CR', grader: 'GR', builder: 'BU', healer: 'HE' };
  function agentTurn(role, label, text) {
    if (!agentsEl) return;
    var row = document.createElement('div');
    row.className = 'rs-turn'; row.setAttribute('data-role', role);
    var av = document.createElement('span');
    av.className = 'mono sm'; av.setAttribute('data-role', role);
    av.textContent = MONO[role] || label.slice(0, 2).toUpperCase();
    row.appendChild(av);
    var body = document.createElement('span');
    var b = document.createElement('b'); b.textContent = label;
    body.appendChild(b);
    body.appendChild(document.createTextNode(' ' + text));
    row.appendChild(body);
    agentsEl.appendChild(row);
    while (agentsEl.children.length > 4) agentsEl.removeChild(agentsEl.firstChild);
  }

  // ── Reasoning graph (canvas) ──────────────────────────────────────
  // Normalized layout; nodes ease their appear/prune, edges ease draw.
  function N(id, x, y, label) {
    return { id: id, x: x, y: y, label: label, p: 0, tp: 0, prune: 0, tprune: 0,
             chosen: false, pulse: 0 };
  }
  var G = {
    nodes: {
      goal: N('goal', 0.11, 0.50, 'goal'),
      hA:   N('hA',   0.40, 0.20, 'auto-clear %'),
      hB:   N('hB',   0.40, 0.52, 'cycle time'),
      hC:   N('hC',   0.40, 0.84, 'invoices/hr'),
      a1:   N('a1',   0.67, 0.20, 'rework?'),
      a2:   N('a2',   0.90, 0.20, 'clean'),
      b1:   N('b1',   0.67, 0.52, '+rework'),
      b2:   N('b2',   0.90, 0.52, 'median')
    },
    edges: [] // {from,to,draw,tdraw,chosen,prune,tprune}
  };
  function E(from, to) {
    var e = { from: from, to: to, draw: 0, tdraw: 0, chosen: false, prune: 0, tprune: 0 };
    G.edges.push(e); return e;
  }
  var EG = {
    goal_hA: E('goal', 'hA'), goal_hB: E('goal', 'hB'), goal_hC: E('goal', 'hC'),
    hA_a1: E('hA', 'a1'), a1_a2: E('a1', 'a2'),
    hB_b1: E('hB', 'b1'), b1_b2: E('b1', 'b2')
  };

  function showNode(id) { var n = G.nodes[id]; if (n) { n.tp = 1; } }
  function drawEdge(id)  { var e = EG[id]; if (e) e.tdraw = 1; }
  function pruneNode(id) { var n = G.nodes[id]; if (n) n.tprune = 1; }
  function pruneEdge(id) { var e = EG[id]; if (e) e.tprune = 1; }
  function chooseNode(id){ var n = G.nodes[id]; if (n) n.chosen = true; }
  function chooseEdge(id){ var e = EG[id]; if (e) e.chosen = true; }

  function graphReset(instant) {
    Object.keys(G.nodes).forEach(function (k) {
      var n = G.nodes[k]; n.tp = 0; n.tprune = 0; n.chosen = false; n.pulse = 0;
      if (instant) { n.p = 0; n.prune = 0; }
    });
    G.edges.forEach(function (e) {
      e.tdraw = 0; e.tprune = 0; e.chosen = false;
      if (instant) { e.draw = 0; e.prune = 0; }
    });
  }
  function graphFill() { // reduced-motion / final static state
    graphReset(true);
    ['goal', 'hB', 'b1', 'b2'].forEach(function (id) { showNode(id); G.nodes[id].p = 1; });
    ['hA', 'hC', 'a1'].forEach(function (id) { showNode(id); pruneNode(id); var n = G.nodes[id]; n.p = 1; n.prune = 1; });
    ['goal_hB', 'hB_b1', 'b1_b2'].forEach(function (id) { drawEdge(id); chooseEdge(id); EG[id].draw = 1; });
    ['goal_hA', 'goal_hC', 'hA_a1'].forEach(function (id) { drawEdge(id); pruneEdge(id); EG[id].draw = 1; EG[id].prune = 1; });
    ['goal', 'hB', 'b1', 'b2'].forEach(chooseNode);
  }

  // Canvas sizing (DPR capped at 2)
  var cw = 0, ch = 0, dpr = 1;
  function sizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = canvas.clientWidth; ch = canvas.clientHeight;
    canvas.width  = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function px(n) { var pad = 16; return { x: pad + n.x * (cw - 2 * pad), y: pad + n.y * (ch - 2 * pad) }; }

  function lerpTo(v, t, k) { return v + (t - v) * k; }

  function stepGraph(dt) {
    var k = Math.min(1, dt / 220);
    Object.keys(G.nodes).forEach(function (key) {
      var n = G.nodes[key];
      n.p = lerpTo(n.p, n.tp, k);
      n.prune = lerpTo(n.prune, n.tprune, k);
      if (n.pulse > 0) n.pulse = Math.max(0, n.pulse - dt);
    });
    G.edges.forEach(function (e) {
      e.draw = lerpTo(e.draw, e.tdraw, k);
      e.prune = lerpTo(e.prune, e.tprune, k);
    });
  }

  function colHair()   { return getCSS('--color-border') || '#1C2530'; }
  function colAccent() { return getCSS('--color-accent') || '#22D3EE'; }
  function colFocus()  { return getCSS('--color-focus')  || '#67E8FF'; }
  function colText()   { return getCSS('--color-text-secondary') || '#AEB9C6'; }
  function colDim()    { return '#4A566380'; }
  var _css = {};
  function getCSS(v) {
    if (_css[v] !== undefined) return _css[v];
    _css[v] = getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    return _css[v];
  }

  function drawGraph() {
    ctx.clearRect(0, 0, cw, ch);
    // edges first
    G.edges.forEach(function (e) {
      if (e.draw <= 0.01) return;
      var a = px(G.nodes[e.from]), b = px(G.nodes[e.to]);
      var ex = a.x + (b.x - a.x) * e.draw, ey = a.y + (b.y - a.y) * e.draw;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(ex, ey);
      if (e.prune > 0.05) {
        ctx.strokeStyle = colDim(); ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
      } else if (e.chosen) {
        ctx.strokeStyle = colAccent(); ctx.lineWidth = 2.2; ctx.setLineDash([]);
        ctx.shadowColor = colAccent(); ctx.shadowBlur = 6;
      } else {
        ctx.strokeStyle = 'rgba(174,185,198,0.45)'; ctx.lineWidth = 1.3; ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]); ctx.shadowBlur = 0;
    });
    // nodes
    Object.keys(G.nodes).forEach(function (key) {
      var n = G.nodes[key];
      if (n.p <= 0.02) return;
      var p = px(n);
      var w = ctx.measureText ? 0 : 0;
      ctx.font = '600 11px Inter, system-ui, sans-serif';
      var tw = ctx.measureText(n.label).width;
      var pad = 8, boxW = tw + pad * 2, boxH = 20;
      var scale = 0.85 + 0.15 * n.p;
      var alpha = Math.max(0, n.p) * (1 - 0.55 * n.prune);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y); ctx.scale(scale, scale);
      var x = -boxW / 2, y = -boxH / 2;
      roundRect(x, y, boxW, boxH, 7);
      if (n.chosen) {
        ctx.fillStyle = 'rgba(34,211,238,0.14)';
        ctx.strokeStyle = colAccent(); ctx.lineWidth = 1.4;
        ctx.shadowColor = colAccent(); ctx.shadowBlur = 8 + 4 * pulseGlow(n);
      } else if (n.prune > 0.1) {
        ctx.fillStyle = 'rgba(16,21,29,0.7)';
        ctx.strokeStyle = colDim(); ctx.lineWidth = 1;
      } else {
        ctx.fillStyle = 'rgba(16,21,29,0.92)';
        ctx.strokeStyle = colHair(); ctx.lineWidth = 1;
      }
      ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      // label
      ctx.font = '600 11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = n.chosen ? colFocus() : (n.prune > 0.1 ? colDim() : colText());
      ctx.fillText(n.label, 0, 0.5);
      if (n.prune > 0.3) { // strike-through
        ctx.strokeStyle = colDim(); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-boxW / 2 + 3, 0); ctx.lineTo(boxW / 2 - 3, 0); ctx.stroke();
      }
      ctx.restore();
    });
  }
  function pulseGlow(n) { return 0.5 + 0.5 * Math.sin(performance.now() / 380); }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ── Stream: segment-based token typing ────────────────────────────
  function seg(text, cls) { return { text: text, cls: cls || null }; }
  var caret = document.createElement('span'); caret.className = 'rs-caret';

  function newLine(kind, segs) {
    var line = document.createElement('p');
    line.className = 'rs-line';
    if (kind) line.setAttribute('data-k', kind);
    streamEl.appendChild(line);
    // prune old lines to avoid unbounded growth
    while (streamEl.children.length > 22) streamEl.removeChild(streamEl.firstChild);
    return { el: line, segs: segs, si: 0, ci: 0, span: null, done: false };
  }
  function scrollStream() { streamEl.scrollTop = streamEl.scrollHeight; }

  var typing = null, typeAcc = 0, CPS = 42;

  function typeTick(dt) {
    if (!typing) return false;
    typeAcc += dt;
    var add = Math.floor((typeAcc / 1000) * CPS);
    if (add <= 0) return true;
    typeAcc -= (add / CPS) * 1000;
    while (add > 0 && !typing.done) {
      if (typing.si >= typing.segs.length) { typing.done = true; break; }
      var s = typing.segs[typing.si];
      if (!typing.span) {
        typing.span = document.createElement('span');
        if (s.cls) typing.span.className = s.cls;
        typing.el.appendChild(typing.span);
      }
      var remaining = s.text.length - typing.ci;
      var takeN = Math.min(add, remaining);
      typing.span.textContent += s.text.substr(typing.ci, takeN);
      typing.ci += takeN; add -= takeN;
      if (typing.ci >= s.text.length) { typing.si++; typing.ci = 0; typing.span = null; }
    }
    typing.el.appendChild(caret);
    scrollStream();
    if (typing.done) { typing = null; return false; }
    return true;
  }

  // ── Director script (sequential; keeps everything in sync) ────────
  function buildScript() {
    return [
      { phase: 'Observe' },
      { line: ['observe', [seg('observe: ', 'rs-lab'),
        seg('AP triages '), seg('~1,200', 'rs-num'), seg(' vendor invoices/wk across '),
        seg('4', 'rs-num'), seg(' channels — by hand.')]] },
      { fn: function () { showNode('goal'); G.nodes.goal.pulse = 400; setBranches(1); tool('search', 'is-active'); } },
      { wait: 260 },

      { phase: 'Hypothesize' },
      { line: ['', [seg('hypothesize: ', 'rs-lab'),
        seg('the pilot needs '), seg('one', 'rs-hi'), seg(' honest number the team already feels.')]] },
      { fn: function () { showNode('hA'); showNode('hB'); showNode('hC');
        drawEdge('goal_hA'); drawEdge('goal_hB'); drawEdge('goal_hC'); setBranches(3);
        setCand('A', 0.58); setCand('B', 0.52); setCand('C', 0.44); setConf(0.48);
        tool('search', 'is-done'); agentTurn('planner', 'planner', 'proposes auto-clear % — simplest to read.'); } },
      { line: ['', [seg('candidates → '),
        seg('auto-clear %', 'rs-hi'), seg(', '), seg('cycle time', 'rs-hi'),
        seg(', '), seg('invoices/hr', 'rs-hi'), seg('.')]] },
      { wait: 220 },

      { phase: 'Consider alternatives' },
      { line: ['', [seg('consider: ', 'rs-lab'),
        seg('invoices/hr rewards speed, not correctness — '), seg('gameable', 'rs-hi'), seg('.')]] },
      { fn: function () { pruneNode('hC'); pruneEdge('goal_hC'); setPruned(1);
        setCand('C', 0.29, { pruned: true }); setBranches(3); } },
      { line: ['', [seg('consider: ', 'rs-lab'),
        seg('auto-clear % is clean — '), seg('assumes', 'rs-hi'), seg(' no downstream rework.')]] },
      { fn: function () { showNode('a1'); drawEdge('hA_a1'); setBranches(4);
        setCand('A', 0.72); setConf(0.61); tool('read', 'is-active'); } },
      { wait: 200 },

      { phase: 'Weigh evidence' },
      { line: ['', [seg('weigh: ', 'rs-lab'),
        seg('read '), seg('400', 'rs-num'), seg(' sampled invoices — '),
        seg('18%', 'rs-num'), seg(' bounce back within '), seg('5', 'rs-num'), seg(' days.')]] },
      { fn: function () { tool('read', 'is-done'); tool('tests', 'is-active');
        agentTurn('critic', 'critic', 'challenges — auto-clear hides that 18% rework.'); } },
      { line: ['', [seg('weigh: ', 'rs-lab'),
        seg('cycle time '), seg('captures', 'rs-hi'), seg(' that rework; auto-clear masks it.')]] },
      { fn: function () { showNode('b1'); drawEdge('hB_b1'); setBranches(5);
        setCand('A', 0.64); setCand('B', 0.88); setConf(0.79); tool('tests', 'is-done');
        agentTurn('planner', 'planner', 'revises → median cycle time, rework included.'); } },
      { wait: 220 },

      { phase: 'Decide' },
      { line: ['decide', [seg('decide: ', 'rs-lab'),
        seg('median cycle time', 'rs-hi'), seg(' — end to end, rework counted.')]] },
      { fn: function () { chooseNode('goal'); chooseNode('hB'); chooseNode('b1');
        chooseEdge('goal_hB'); chooseEdge('hB_b1');
        showNode('a2'); drawEdge('a1_a2'); setBranches(6);
        setCand('A', 0.64); setCand('B', 0.88, { chosen: true }); setConf(0.88);
        tool('verify', 'is-active'); agentTurn('grader', 'grader', 'scores B 0.88 > A 0.64 — accept.'); } },
      { wait: 240 },

      { phase: 'Reflect / Revise', tone: 'revise' },
      { line: ['revise', [seg('revise: ', 'rs-lab'),
        seg('earlier pass ignored illiquid vendors on '), seg('30', 'rs-num'), seg('-day terms.')]] },
      { fn: function () { pruneNode('hA'); pruneNode('a1'); pruneNode('a2');
        pruneEdge('goal_hA'); pruneEdge('hA_a1'); pruneEdge('a1_a2');
        setPruned(2); setCand('A', 0.41, { pruned: true }); } },
      { line: ['revise', [seg('revise: ', 'rs-lab'),
        seg('measure '), seg('touch-to-clear', 'rs-hi'), seg(' only — exclude term-driven wait.')]] },
      { fn: function () { showNode('b2'); drawEdge('b1_b2'); chooseNode('b2'); chooseEdge('b1_b2');
        G.nodes.b2.pulse = 500; setBranches(6); setConf(0.93);
        setCand('B', 0.93, { chosen: true }); tool('verify', 'is-done'); tool('commit', 'is-active'); } },
      { line: ['decide', [seg('decision: ', 'rs-lab'),
        seg('median touch-to-clear time', 'rs-hi'), seg('  ·  confidence '), seg('0.93', 'rs-num'), seg('.')]] },
      { fn: function () { tool('commit', 'is-done'); } },
      { wait: 3600 }
    ];
  }

  // ── Director state machine ────────────────────────────────────────
  var script = buildScript();
  var idx = 0, wait = 0;

  function setPhase(label, tone) {
    if (!phaseEl) return;
    phaseEl.textContent = label;
    phaseEl.setAttribute('data-tone', tone || 'default');
  }

  function processNext() {
    if (idx >= script.length) { loopRestart(); return; }
    var st = script[idx++];
    if (st.phase) { setPhase(st.phase, st.tone); bumpStep(); wait = 120; return; }
    if (st.fn)    { st.fn(); wait = 90; return; }
    if (st.wait)  { wait = st.wait; return; }
    if (st.line)  {
      bumpStep();
      var ln = newLine(st.line[0], st.line[1]);
      typing = ln; typeAcc = 0;
      return;
    }
  }

  var fadeUntil = 0;
  function loopRestart() {
    // Smooth crossfade reset → keeps the loop seamless.
    streamEl.classList.add('is-fade');
    var graphWrap = root.querySelector('.rs-graph');
    if (graphWrap) graphWrap.classList.add('is-fade');
    fadeUntil = performance.now() + 400;
    setTimeout(function () {
      streamEl.innerHTML = '';
      graphReset(true);
      setSteps(0); setBranches(0); setPruned(0);
      setConf(0.34);
      setCand('A', 0.58); setCand('B', 0.52); setCand('C', 0.44);
      if (agentsEl) agentsEl.innerHTML = '';
      ['search', 'read', 'tests', 'verify', 'commit'].forEach(function (t) { tool(t, null); });
      idx = 0; wait = 260;
      pageNo = pageNo >= 12 ? 1 : pageNo + 1;
      if (pageEl) pageEl.textContent = ('0' + pageNo).slice(-2);
      streamEl.classList.remove('is-fade');
      if (graphWrap) graphWrap.classList.remove('is-fade');
    }, 420);
  }

  // ── rAF loop with pause ───────────────────────────────────────────
  var running = false, last = 0, rafId = 0;
  function frame(now) {
    if (!running) return;
    var dt = Math.min(64, now - last); last = now;
    stepGraph(dt); drawGraph();
    if (now < fadeUntil) { rafId = requestAnimationFrame(frame); return; }
    if (typing) { typeTick(dt); }
    else if (wait > 0) { wait -= dt; }
    else { processNext(); }
    rafId = requestAnimationFrame(frame);
  }
  function start() {
    if (running) return;
    running = true; last = performance.now();
    rafId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0;
  }

  // ── Reduced motion: one static, fully-populated frame ─────────────
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    sizeCanvas();
    setPhase('Decide');
    setSteps(11); setBranches(6); setPruned(2); setConf(0.93);
    setCand('A', 0.41, { pruned: true }); setCand('B', 0.93, { chosen: true }); setCand('C', 0.29, { pruned: true });
    ['search', 'read', 'tests', 'verify', 'commit'].forEach(function (t) { tool(t, 'is-done'); });
    agentTurn('planner', 'planner', 'proposes auto-clear % — simplest to read.');
    agentTurn('critic', 'critic', 'challenges — auto-clear hides 18% rework.');
    agentTurn('planner', 'planner', 'revises → median cycle time, rework included.');
    agentTurn('grader', 'grader', 'scores B 0.93 > A 0.41 — accept.');
    [['observe', [seg('observe: ', 'rs-lab'), seg('AP triages '), seg('~1,200', 'rs-num'), seg(' invoices/wk across '), seg('4', 'rs-num'), seg(' channels.')]],
     ['', [seg('weigh: ', 'rs-lab'), seg('read '), seg('400', 'rs-num'), seg(' samples — '), seg('18%', 'rs-num'), seg(' bounce back within '), seg('5', 'rs-num'), seg(' days.')]],
     ['revise', [seg('revise: ', 'rs-lab'), seg('exclude term-driven wait — measure '), seg('touch-to-clear', 'rs-hi'), seg(' only.')]],
     ['decide', [seg('decision: ', 'rs-lab'), seg('median touch-to-clear time', 'rs-hi'), seg('  ·  confidence '), seg('0.93', 'rs-num'), seg('.')]]
    ].forEach(function (l) {
      var ln = newLine(l[0], l[1]);
      l[1].forEach(function (s) { var sp = document.createElement('span'); if (s.cls) sp.className = s.cls; sp.textContent = s.text; ln.el.appendChild(sp); });
    });
    graphFill();
    // draw once (nodes already at p=1)
    requestAnimationFrame(function () { sizeCanvas(); drawGraph(); });
    return;
  }

  // ── Boot ──────────────────────────────────────────────────────────
  sizeCanvas();
  setSteps(0); setBranches(0); setPruned(0); setConf(0.34);
  setCand('A', 0.58); setCand('B', 0.52); setCand('C', 0.44);

  var resizeT = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () { sizeCanvas(); drawGraph(); }, 150);
  });

  var onScreen = false;
  var io = new IntersectionObserver(function (entries) {
    onScreen = entries[0].isIntersecting;
    if (onScreen && !document.hidden) start(); else stop();
  }, { threshold: 0.12 });
  io.observe(root);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (onScreen) start();
  });
})();
