/* =====================================================================
   workspace.js — DPR AI · #workspace run/kanban engine (calm loop)
   Moves task cards through Plan → Build → Grade → Heal → Shipped with a
   live activity feed (avatar + name + action + timestamp) and a syntax-lit
   diff. Muted; accent only on shipped state. Real mesh roles from
   assets/data/jarvis-run.json (planner/dispatcher/builder/grader/healer).
   - Pause via IntersectionObserver (offscreen) + visibilitychange.
   - prefers-reduced-motion → one static populated frame, no loop.
   - Motion = transform/opacity; scheduling via rAF. Seamless loop.
   ===================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('[data-ws]');
  if (!root) return;

  var COLS = ['plan', 'build', 'grade', 'heal', 'shipped'];
  var STEP = 4800; // ms per pipeline advance — calm, ~24s per card crossing

  var TASKS = [
    { title: 'Add retry to invoice sync', files: 11 },
    { title: 'Refactor billing webhook', files: 34 },
    { title: 'Integration tests for auth', files: 8 },
    { title: 'Alert Slack on failed job', files: 5 },
    { title: 'Cache vendor rate lookups', files: 13 },
    { title: 'Move cron to queue workers', files: 22 },
    { title: 'Backfill order events', files: 9 },
    { title: 'Harden PDF export path', files: 17 },
    { title: 'Dedupe webhook deliveries', files: 7 },
    { title: 'Idempotency keys on payouts', files: 15 }
  ];

  var COL_ROLE = { plan: 'planner', build: 'builder', grade: 'grader', heal: 'healer', shipped: 'builder' };
  var MONO = { planner: 'PL', dispatcher: 'DI', builder: 'BU', grader: 'GR', healer: 'HE' };

  var lanes = {};
  COLS.forEach(function (c) { lanes[c] = root.querySelector('.ws-col-lane[data-lane="' + c + '"]'); });
  var counts = {};
  COLS.forEach(function (c) { counts[c] = root.querySelector('[data-count="' + c + '"]'); });
  var logEl = root.querySelector('[data-ws-log]');
  var mFiles = root.querySelector('[data-m="files"]');
  var mChecks = root.querySelector('[data-m="checks"]');
  var mAgents = root.querySelector('[data-m="agents"]');
  var diffTitle = root.querySelector('[data-ws-diff-title]');
  var diffBody = root.querySelector('[data-ws-diff-body]');
  var pageEl = root.querySelector('[data-ws-page]');

  var filesChanged = 305, checksPassed = 720, taskIdx = 0, pageNo = 2;

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function nextTask() { var t = TASKS[taskIdx % TASKS.length]; taskIdx++; return t; }

  function cardEl(task) {
    var card = document.createElement('article');
    card.className = 'ws-card is-enter';
    card.dataset.title = task.title;
    card.dataset.files = task.files;
    card.innerHTML =
      '<p class="ws-card-title">' + esc(task.title) + '</p>' +
      '<div class="ws-card-meta">' +
        '<span class="mono sm" data-role="planner">PL</span>' +
        '<span class="ws-agent-name">planner</span>' +
        '<span class="ws-chip" data-state="working">queued</span>' +
      '</div>' +
      '<div class="ws-bar"><i></i></div>';
    return card;
  }

  function decorate(card, col) {
    var role = COL_ROLE[col];
    var av = card.querySelector('.mono');
    var name = card.querySelector('.ws-agent-name');
    var chip = card.querySelector('.ws-chip');
    var bar = card.querySelector('.ws-bar i');
    av.dataset.role = role;
    av.textContent = MONO[role];
    name.textContent = role;

    if (col === 'plan') { chip.dataset.state = 'working'; chip.textContent = 'scoping'; bar.style.width = '18%'; }
    else if (col === 'build') { chip.dataset.state = 'working'; chip.textContent = 'building'; bar.style.width = '55%'; }
    else if (col === 'grade') { chip.dataset.state = 'working'; chip.textContent = '12/12'; bar.style.width = '82%'; }
    else if (col === 'heal') { chip.dataset.state = 'pass'; chip.textContent = 'green'; bar.style.width = '94%'; }
    else if (col === 'shipped') { card.classList.add('is-ship'); chip.dataset.state = 'shipped'; chip.textContent = 'shipped'; bar.style.width = '100%'; }
  }

  function updateCounts() {
    COLS.forEach(function (c) { if (counts[c]) counts[c].textContent = slots[c] ? '1' : '0'; });
  }

  // ── Activity feed: avatar + name + action + timestamp ─────────────
  var MAXLOG = 5;
  function ageAll() {
    Array.prototype.forEach.call(logEl.children, function (li) {
      var t = li.querySelector('.ws-row-time');
      var n = parseInt(li.dataset.age || '0', 10) + 1;
      li.dataset.age = n;
      if (t) t.textContent = n === 1 ? '1 min ago' : n + ' min ago';
    });
  }
  function feed(role, html) {
    ageAll();
    var li = document.createElement('li');
    li.dataset.age = '0';
    li.innerHTML =
      '<span class="mono sm" data-role="' + role + '">' + MONO[role] + '</span>' +
      '<div class="ws-row-body">' +
        '<div class="ws-row-line">' + html + '</div>' +
        '<div class="ws-row-time">just now</div>' +
      '</div>';
    logEl.appendChild(li);
    while (logEl.children.length > MAXLOG) logEl.removeChild(logEl.firstChild);
  }

  function emitFeed(col, task) {
    var t = task.title.toLowerCase();
    if (col === 'build') feed('builder', '<b>builder</b> is writing ' + esc(t) + ' · <code>' + task.files + ' files</code>');
    else if (col === 'grade') feed('grader', '<b>grader</b> ran checks — <span class="ok">12/12 passed</span>');
    else if (col === 'heal') feed('healer', '<b>healer</b> retried a flaky test → <span class="ok">green</span>');
    else if (col === 'shipped') feed('builder', '<b>Shipped</b> ' + esc(t));
    else if (col === 'plan') feed('planner', '<b>planner</b> scoped ' + esc(t));
  }

  // ── Diff mini-pane ────────────────────────────────────────────────
  var DIFFS = [
    { file: 'services/invoice/sync.py', del: ['resp = client.post(url)'], add: ['for attempt in range(3):', '    await backoff(attempt)'], ctx: 'resp = await client.post(url)' },
    { file: 'billing/webhook.ts', del: ['handle(req.body)'], add: ['const sig = verify(req, secret);', 'if (!sig) return res.status(401);'], ctx: 'await handle(parsed);' },
    { file: 'auth/session_test.py', del: [], add: ['def test_expired_token():', '    assert reject(expired)'], ctx: 'assert accept(valid)' },
    { file: 'jobs/alerts.py', del: ['pass'], add: ['slack.post(channel, fail_msg)'], ctx: 'on_failure(job, notify=True)' }
  ];
  function setDiff(i) {
    var d = DIFFS[i % DIFFS.length];
    if (!diffTitle || !diffBody) return;
    diffTitle.textContent = d.file;
    var html = '';
    d.del.forEach(function (l) { html += '<span class="del">' + esc(l) + '</span>'; });
    d.add.forEach(function (l) { html += '<span class="add">' + esc(l) + '</span>'; });
    html += '<span class="ctx">' + esc(d.ctx) + '</span>';
    diffBody.innerHTML = html;
  }

  function bumpMetric(el, from, to) {
    if (!el) return;
    var start = performance.now(), dur = 900;
    function step(now) {
      var p = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ── Conveyor ──────────────────────────────────────────────────────
  var slots = { plan: null, build: null, grade: null, heal: null, shipped: null };
  var diffIdx = 0;

  function advance() {
    if (slots.shipped) {
      var old = slots.shipped;
      old.style.opacity = '0';
      old.style.transform = 'translateY(10px)';
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 480);
      slots.shipped = null;
    }
    for (var i = COLS.length - 1; i >= 1; i--) {
      var from = COLS[i - 1], to = COLS[i], card = slots[from];
      if (card) {
        lanes[to].appendChild(card);
        slots[to] = card; slots[from] = null;
        decorate(card, to);
        var task = { title: card.dataset.title, files: parseInt(card.dataset.files, 10) };
        emitFeed(to, task);
        if (to === 'build') setDiff(diffIdx++);
        if (to === 'shipped') {
          var fFrom = filesChanged, cFrom = checksPassed;
          filesChanged += task.files; checksPassed += 12;
          bumpMetric(mFiles, fFrom, filesChanged);
          bumpMetric(mChecks, cFrom, checksPassed);
          pageNo++; if (pageEl) pageEl.textContent = ('0' + pageNo).slice(-2);
        }
      }
    }
    var t = nextTask();
    var fresh = cardEl(t);
    lanes.plan.appendChild(fresh);
    requestAnimationFrame(function () { fresh.classList.remove('is-enter'); });
    slots.plan = fresh;
    decorate(fresh, 'plan');
    emitFeed('plan', t);

    var active = 0;
    ['plan', 'build', 'grade', 'heal'].forEach(function (c) { if (slots[c]) active++; });
    if (mAgents) mAgents.textContent = active;
    updateCounts();
  }

  function prime() {
    var seed = ['grade', 'build', 'plan'];
    seed.forEach(function (c) {
      var t = nextTask();
      var card = cardEl(t);
      card.classList.remove('is-enter');
      lanes[c].appendChild(card);
      slots[c] = card;
      decorate(card, c);
    });
    setDiff(diffIdx++);
    feed('planner', '<b>planner</b> accepted plan — <code>5 tasks</code>');
    feed('builder', '<b>builder</b> is writing refactor billing webhook · <code>34 files</code>');
    ageAll();
    if (mAgents) mAgents.textContent = '3';
    if (pageEl) pageEl.textContent = '02';
    updateCounts();
  }

  // ── Reduced motion ────────────────────────────────────────────────
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    COLS.forEach(function (c) {
      var t = nextTask();
      var card = cardEl(t);
      card.classList.remove('is-enter');
      lanes[c].appendChild(card);
      slots[c] = card;
      decorate(card, c);
    });
    setDiff(0);
    feed('planner', '<b>planner</b> accepted plan — <code>5 tasks</code>');
    feed('builder', '<b>builder</b> wrote refactor billing webhook · <code>34 files</code>');
    feed('grader', '<b>grader</b> ran checks — <span class="ok">12/12 passed</span>');
    feed('healer', '<b>healer</b> retried a flaky test → <span class="ok">green</span>');
    feed('builder', '<b>Shipped</b> add retry to invoice sync');
    ageAll();
    if (mAgents) mAgents.textContent = '4';
    updateCounts();
    return;
  }

  // ── rAF scheduler ─────────────────────────────────────────────────
  var running = false, lastTick = 0, rafId = 0, primed = false;
  function frame(now) {
    if (!running) return;
    if (!primed) { prime(); primed = true; lastTick = now; }
    if (now - lastTick >= STEP) { advance(); lastTick = now; }
    rafId = requestAnimationFrame(frame);
  }
  function start() { if (running) return; running = true; lastTick = performance.now(); rafId = requestAnimationFrame(frame); }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; }

  var onScreen = false;
  var io = new IntersectionObserver(function (entries) {
    onScreen = entries[0].isIntersecting;
    if (onScreen && !document.hidden) start(); else stop();
  }, { threshold: 0.15 });
  io.observe(root);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (onScreen) start();
  });
})();
