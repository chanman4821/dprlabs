/* DPR diagrams.js — reusable inline-SVG infographic renderer.
   API: DPRdiagrams.pipeline(el, steps), .barDelta(el, rows), .timeline(el, nodes), .framework(el, nodes)
   Auto-init: any element with data-diagram="pipeline|barDelta|timeline|framework"
   and data-config='{"items":[...]}' (JSON) is rendered on load.
   SVG strokes get [data-draw] so anim.js animates them in. Real values only — no fabricated data. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var C = { ink: "#0a0a0b", accent: "#3b5bdb", accentSoft: "#eef1fb", line: "rgba(15,17,20,.16)", muted: "#3a3f47", faint: "#767b85" };
  function E(tag, a, txt) {
    var e = document.createElementNS(NS, tag);
    for (var k in a) e.setAttribute(k, a[k]);
    if (txt != null) e.textContent = txt;
    return e;
  }
  function svgRoot(vb, label) {
    return E("svg", { viewBox: vb, width: "100%", role: "img", "aria-label": label || "diagram", class: "dpr-svg", style: "display:block;overflow:visible" });
  }
  function mount(target, svg) { target.innerHTML = ""; target.appendChild(svg); return svg; }

  // steps: [{n,label,sub}]
  function pipeline(target, steps) {
    if (!steps || !steps.length) return;
    var w = 1000, gap = w / steps.length, svg = svgRoot("0 0 " + w + " 172", "process pipeline");
    var line = E("line", { x1: 40, y1: 62, x2: w - 40, y2: 62, stroke: C.line, "stroke-width": 2 });
    line.setAttribute("data-draw", ""); svg.appendChild(line);
    steps.forEach(function (s, i) {
      var cx = gap * i + gap / 2;
      svg.appendChild(E("circle", { cx: cx, cy: 62, r: 21, fill: "#fff", stroke: C.accent, "stroke-width": 2 }));
      svg.appendChild(E("text", { x: cx, y: 68, "text-anchor": "middle", fill: C.accent, "font-family": "'Geist Mono',monospace", "font-size": 15, "font-weight": 600 }, s.n || (i + 1)));
      svg.appendChild(E("text", { x: cx, y: 116, "text-anchor": "middle", fill: C.ink, "font-family": "Geist,sans-serif", "font-size": 17, "font-weight": 600 }, s.label || ""));
      if (s.sub) svg.appendChild(E("text", { x: cx, y: 140, "text-anchor": "middle", fill: C.muted, "font-family": "Geist,sans-serif", "font-size": 12.5 }, s.sub));
    });
    return mount(target, svg);
  }

  // rows: [{label, before, after, unit}]
  function barDelta(target, rows) {
    if (!rows || !rows.length) return;
    var w = 1000, rh = 92, h = rows.length * rh + 10, svg = svgRoot("0 0 " + w + " " + h, "before and after comparison");
    var maxV = 0; rows.forEach(function (r) { maxV = Math.max(maxV, +r.before || 0, +r.after || 0); });
    var x0 = 220, bw = w - x0 - 120;
    rows.forEach(function (r, i) {
      var y = i * rh + 20;
      svg.appendChild(E("text", { x: 0, y: y + 14, fill: C.ink, "font-family": "Geist,sans-serif", "font-size": 15, "font-weight": 600 }, r.label || ""));
      // before (faint) + after (accent)
      var wb = maxV ? (+r.before / maxV) * bw : 0, wa = maxV ? (+r.after / maxV) * bw : 0;
      svg.appendChild(E("rect", { x: x0, y: y, width: Math.max(wb, 2), height: 16, rx: 8, fill: "#e6e7ea" }));
      svg.appendChild(E("text", { x: x0 + Math.max(wb, 2) + 10, y: y + 13, fill: C.faint, "font-family": "'Geist Mono',monospace", "font-size": 12.5 }, "was " + r.before + (r.unit || "")));
      svg.appendChild(E("rect", { x: x0, y: y + 30, width: Math.max(wa, 2), height: 16, rx: 8, fill: C.accent }));
      svg.appendChild(E("text", { x: x0 + Math.max(wa, 2) + 10, y: y + 43, fill: C.accent, "font-family": "'Geist Mono',monospace", "font-size": 13, "font-weight": 600 }, "now " + r.after + (r.unit || "")));
    });
    return mount(target, svg);
  }

  // nodes: [{when,label,sub}]
  function timeline(target, nodes) {
    if (!nodes || !nodes.length) return;
    var w = 1000, gap = w / nodes.length, svg = svgRoot("0 0 " + w + " 168", "timeline");
    var line = E("line", { x1: 40, y1: 54, x2: w - 40, y2: 54, stroke: C.line, "stroke-width": 2 });
    line.setAttribute("data-draw", ""); svg.appendChild(line);
    nodes.forEach(function (nd, i) {
      var cx = gap * i + gap / 2;
      svg.appendChild(E("circle", { cx: cx, cy: 54, r: 8, fill: C.accent }));
      svg.appendChild(E("text", { x: cx, y: 30, "text-anchor": "middle", fill: C.accent, "font-family": "'Geist Mono',monospace", "font-size": 12, "font-weight": 600, "letter-spacing": "0.06em" }, (nd.when || "").toUpperCase()));
      svg.appendChild(E("text", { x: cx, y: 92, "text-anchor": "middle", fill: C.ink, "font-family": "Geist,sans-serif", "font-size": 15.5, "font-weight": 600 }, nd.label || ""));
      if (nd.sub) svg.appendChild(E("text", { x: cx, y: 114, "text-anchor": "middle", fill: C.muted, "font-family": "Geist,sans-serif", "font-size": 12.5 }, nd.sub));
    });
    return mount(target, svg);
  }

  // nodes: [{n,label}] — vertical connected framework
  function framework(target, nodes) {
    if (!nodes || !nodes.length) return;
    var w = 1000, rh = 78, h = nodes.length * rh, svg = svgRoot("0 0 " + w + " " + h, "framework map");
    var x = 34;
    var line = E("line", { x1: x, y1: 20, x2: x, y2: h - 20, stroke: C.line, "stroke-width": 2 });
    line.setAttribute("data-draw", ""); svg.appendChild(line);
    nodes.forEach(function (nd, i) {
      var y = i * rh + 26;
      svg.appendChild(E("circle", { cx: x, cy: y, r: 18, fill: C.accentSoft, stroke: C.accent, "stroke-width": 2 }));
      svg.appendChild(E("text", { x: x, y: y + 5, "text-anchor": "middle", fill: C.accent, "font-family": "'Geist Mono',monospace", "font-size": 13, "font-weight": 600 }, nd.n || (i + 1)));
      svg.appendChild(E("text", { x: x + 40, y: y + 6, fill: C.ink, "font-family": "Geist,sans-serif", "font-size": 19, "font-weight": 600 }, nd.label || ""));
    });
    return mount(target, svg);
  }

  var API = { pipeline: pipeline, barDelta: barDelta, timeline: timeline, framework: framework };
  window.DPRdiagrams = API;

  function init() {
    document.querySelectorAll("[data-diagram]").forEach(function (t) {
      try {
        var type = t.getAttribute("data-diagram");
        var cfg = JSON.parse(t.getAttribute("data-config") || "{}");
        var data = cfg.items || cfg.steps || cfg.rows || cfg.nodes || [];
        if (API[type]) API[type](t, data);
      } catch (e) {}
    });
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
