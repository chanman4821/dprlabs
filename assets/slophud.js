/* Slop HUD — a fancy AI diagnostic scanner drawn over each slop robot.
   Canvas + DOM, requestAnimationFrame, active-slide-only, mouse parallax,
   reduced-motion safe. Injects its own DOM so index.html stays clean. */
(function () {
  "use strict";
  var root = document.querySelector("[data-slopcar]");
  if (!root) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var slides = [].slice.call(root.querySelectorAll(".slopslide"));
  if (!slides.length) return;

  // per-slop diagnostics (index-aligned with the 7 slides)
  var DATA = [
    { rows: [["DATA ACCESS", "DENIED"], ["WORKFLOW REACH", "0%"], ["TOUCHES REAL WORK", "NO"]], score: 88 },
    { rows: [["PROD SURVIVAL", "3%"], ["LIVE METRIC", "NONE"], ["DEMO vs REAL", "\u221E"]], score: 94 },
    { rows: [["OWNERSHIP", "0%"], ["COST / CALL", "FOREVER"], ["EXIT VALUE", "$0"]], score: 90 },
    { rows: [["BASELINE", "MISSING"], ["SAMPLE SIZE", "?"], ["COMPARISON", "NONE"]], score: 86 },
    { rows: [["BEHAVIOR CHANGE", "0%"], ["DECK PAGES", "47"], ["SHIPPED", "NOTHING"]], score: 91 },
    { rows: [["TEST COVERAGE", "0%"], ["REGRESSIONS", "UNKNOWN"], ["CONFIDENCE", "BLIND"]], score: 89 },
    { rows: [["NUMBER MOVED", "0"], ["MONTHLY INVOICE", "HIGH"], ["STRATEGY DECKS", "\u221E"]], score: 92 }
  ];
  var INK = "#3b5bdb", GOLD = "#c8912b", RED = "#e5484d";

  var huds = slides.map(function (slide, idx) {
    var vis = slide.querySelector(".slopslide-visual");
    if (!vis) return null;
    var cv = document.createElement("canvas"); cv.className = "shud-canvas";
    var read = document.createElement("div"); read.className = "shud-readout";
    read.innerHTML = '<div class="shud-hd"><i></i>AI SLOP SCAN</div><div class="shud-rows"></div><div class="shud-vd">VERDICT <b>SLOP</b></div>';
    var score = document.createElement("div"); score.className = "shud-score";
    score.innerHTML = '<span class="shud-n">0</span><span class="shud-l">slop index</span>';
    vis.appendChild(cv); vis.appendChild(read); vis.appendChild(score);
    return {
      slide: slide, vis: vis, cv: cv, ctx: cv.getContext("2d"),
      rowsEl: read.querySelector(".shud-rows"), nEl: score.querySelector(".shud-n"),
      data: DATA[idx] || DATA[0], w: 0, h: 0, mx: 0.5, my: 0.4, t0: 0, typed: -1, shown: 0
    };
  }).filter(Boolean);

  function resize(h) {
    var r = h.vis.getBoundingClientRect();
    if (!r.width) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    h.w = r.width; h.h = r.height;
    h.cv.width = Math.round(r.width * dpr); h.cv.height = Math.round(r.height * dpr);
    h.cv.style.width = r.width + "px"; h.cv.style.height = r.height + "px";
    h.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function active() { for (var i = 0; i < huds.length; i++) if (huds[i].slide.classList.contains("is-active")) return huds[i]; return null; }

  root.addEventListener("mousemove", function (e) {
    var h = active(); if (!h) return;
    var r = h.vis.getBoundingClientRect();
    h.mx = (e.clientX - r.left) / r.width; h.my = (e.clientY - r.top) / r.height;
  });
  root.addEventListener("mouseleave", function () { huds.forEach(function (h) { h.mx = 0.5; h.my = 0.4; }); });

  function corner(ctx, x, y, sx, sy, L) { ctx.beginPath(); ctx.moveTo(x, y + sy * L); ctx.lineTo(x, y); ctx.lineTo(x + sx * L, y); ctx.stroke(); }

  function stream(h, now) {
    var rows = h.data.rows, total = rows.length;
    var shown = Math.max(0, Math.min(total, Math.floor((now - h.t0) / 420)));
    if (shown === h.typed) return;
    h.typed = shown;
    var html = "";
    for (var i = 0; i < shown; i++) html += '<div class="shud-row"><span>' + rows[i][0] + '</span><b>' + rows[i][1] + '</b></div>';
    if (shown < total) html += '<div class="shud-row shud-scan">scanning\u2026</div>';
    h.rowsEl.innerHTML = html;
  }

  function draw(h, now) {
    var ctx = h.ctx, w = h.w, ht = h.h; if (!w) return;
    var px = h.mx - 0.5, py = h.my - 0.4;
    ctx.clearRect(0, 0, w, ht);

    // faint engineered grid
    ctx.strokeStyle = "rgba(59,91,219,.13)"; ctx.lineWidth = 1;
    var g = Math.max(24, w / 12);
    for (var x = g; x < w; x += g) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ht); ctx.stroke(); }
    for (var y = g; y < ht; y += g) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // corner brackets
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.lineCap = "round";
    var m = 11, L = 20;
    corner(ctx, m, m, 1, 1, L); corner(ctx, w - m, m, -1, 1, L);
    corner(ctx, m, ht - m, 1, -1, L); corner(ctx, w - m, ht - m, -1, -1, L);

    // scan beam sweeping vertically
    var beat = (now % 2600) / 2600;
    var by = (0.12 + 0.76 * (0.5 - 0.5 * Math.cos(beat * Math.PI * 2))) * ht;
    var grd = ctx.createLinearGradient(0, by - 28, 0, by + 28);
    grd.addColorStop(0, "rgba(59,91,219,0)"); grd.addColorStop(0.5, "rgba(59,91,219,.18)"); grd.addColorStop(1, "rgba(59,91,219,0)");
    ctx.fillStyle = grd; ctx.fillRect(0, by - 28, w, 56);
    ctx.strokeStyle = INK; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(8, by); ctx.lineTo(w - 8, by); ctx.stroke();

    // targeting reticle over the robot head
    var rx = w * 0.5 + px * 24, ry = ht * 0.36 + py * 18, rr = Math.min(w, ht) * 0.17;
    ctx.save(); ctx.translate(rx, ry); ctx.rotate(now / 2400);
    ctx.strokeStyle = INK; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.72;
    for (var a = 0; a < 4; a++) { ctx.beginPath(); ctx.arc(0, 0, rr, a * Math.PI / 2 + 0.34, a * Math.PI / 2 + Math.PI / 2 - 0.34); ctx.stroke(); }
    ctx.restore(); ctx.globalAlpha = 1;
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(rx - rr - 6, ry); ctx.lineTo(rx - rr + 6, ry); ctx.moveTo(rx + rr - 6, ry); ctx.lineTo(rx + rr + 6, ry);
    ctx.moveTo(rx, ry - rr - 6); ctx.lineTo(rx, ry - rr + 6); ctx.moveTo(rx, ry + rr - 6); ctx.lineTo(rx, ry + rr + 6);
    ctx.stroke();
    var pulse = (now % 1600) / 1600;
    ctx.globalAlpha = (1 - pulse) * 0.5; ctx.strokeStyle = INK;
    ctx.beginPath(); ctx.arc(rx, ry, rr * (0.7 + pulse * 0.6), 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;

    // slop-index gauge (bottom-left)
    var gx = 33, gy = ht - 30, ga = 21, target = h.data.score / 100;
    if (h.gauge == null) h.gauge = 0;
    h.gauge += (target - h.gauge) * 0.05;
    ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.strokeStyle = "rgba(59,91,219,.18)";
    ctx.beginPath(); ctx.arc(gx, gy, ga, -Math.PI * 0.75, Math.PI * 0.75); ctx.stroke();
    ctx.strokeStyle = RED;
    ctx.beginPath(); ctx.arc(gx, gy, ga, -Math.PI * 0.75, -Math.PI * 0.75 + Math.PI * 1.5 * h.gauge); ctx.stroke();
    if (h.nEl) h.nEl.textContent = Math.round(h.gauge * 100);
  }

  var last = null;
  function loop(now) {
    var h = active();
    if (h) {
      if (h !== last) { h.t0 = now; h.typed = -1; h.gauge = 0; last = h; resize(h); }
      stream(h, now); draw(h, now);
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", function () { var h = active(); if (h) resize(h); });
  huds.forEach(resize);

  if (reduce) {
    huds.forEach(function (h) {
      if (h.nEl) h.nEl.textContent = h.data.score;
      var html = ""; h.data.rows.forEach(function (r) { html += '<div class="shud-row"><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; });
      h.rowsEl.innerHTML = html;
    });
  } else {
    requestAnimationFrame(loop);
  }
})();
