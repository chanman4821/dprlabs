/* DPR diagrams.js — animated, interactive inline-SVG infographics (dark + electric-lime).
   Types: pipeline | barDelta | timeline | framework | handover
   Auto-init on [data-diagram] + data-config='{"items":[...]}'. Animates in on scroll;
   nodes are hoverable. Illustrative / real values only — never fabricated metrics.
   Reduced-motion safe. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var C = { ink:"#F4F6F8", accent:"#BEF23F", accentDim:"#9BD22A",
            line:"rgba(255,255,255,.16)", muted:"#AEB6C0", faint:"#7C8690",
            node:"#15181D", head:"'Bricolage Grotesque',Geist,sans-serif",
            body:"Geist,sans-serif", mono:"'Geist Mono',ui-monospace,monospace" };
  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  function E(tag, a, txt) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; return e; }
  function svgRoot(vb, label) { return E("svg", { viewBox: vb, width: "100%", role: "img", "aria-label": label || "diagram", "class": "dpr-svg", style: "display:block;overflow:visible" }); }
  function revealOnView(target, svg) {
    if (RM || !("IntersectionObserver" in window)) { svg.classList.add("is-in"); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { svg.classList.add("is-in"); io.disconnect(); } }); }, { threshold: .18 });
    io.observe(target);
    setTimeout(function () { svg.classList.add("is-in"); }, 1700);
  }
  function mount(target, svg, extra) { target.innerHTML = ""; target.appendChild(svg); if (extra) target.appendChild(extra); revealOnView(target, svg); return svg; }
  function grp(i) { return E("g", { "class": "di-node", style: "--i:" + i }); }

  function pipeline(target, steps) {
    if (!steps || !steps.length) return;
    var w = 1000, gap = w / steps.length, svg = svgRoot("0 0 " + w + " 176", "process pipeline");
    var line = E("line", { x1: 40, y1: 60, x2: w - 40, y2: 60, stroke: C.line, "stroke-width": 2, "class": "di-line" }); line.setAttribute("data-draw", ""); svg.appendChild(line);
    steps.forEach(function (s, i) {
      var cx = gap * i + gap / 2, g = grp(i);
      g.appendChild(E("circle", { cx: cx, cy: 60, r: 22, fill: C.node, stroke: C.accent, "stroke-width": 2, "class": "di-dot" }));
      g.appendChild(E("text", { x: cx, y: 66, "text-anchor": "middle", fill: C.accent, "font-family": C.mono, "font-size": 15, "font-weight": 600 }, s.n || (i + 1)));
      g.appendChild(E("text", { x: cx, y: 118, "text-anchor": "middle", fill: C.ink, "font-family": C.head, "font-size": 17, "font-weight": 600 }, s.label || ""));
      if (s.sub) g.appendChild(E("text", { x: cx, y: 142, "text-anchor": "middle", fill: C.muted, "font-family": C.body, "font-size": 12.5 }, s.sub));
      svg.appendChild(g);
    });
    return mount(target, svg);
  }

  function barDelta(target, rows) {
    if (!rows || !rows.length) return;
    var w = 1000, rh = 92, h = rows.length * rh + 10, svg = svgRoot("0 0 " + w + " " + h, "comparison");
    var maxV = 0; rows.forEach(function (r) { maxV = Math.max(maxV, +r.before || 0, +r.after || 0); });
    var x0 = 220, bw = w - x0 - 130;
    rows.forEach(function (r, i) {
      var y = i * rh + 20, g = grp(i);
      g.appendChild(E("text", { x: 0, y: y + 14, fill: C.ink, "font-family": C.head, "font-size": 15, "font-weight": 600 }, r.label || ""));
      var wb = maxV ? (+r.before / maxV) * bw : 0, wa = maxV ? (+r.after / maxV) * bw : 0;
      g.appendChild(E("rect", { x: x0, y: y, width: Math.max(wb, 2), height: 16, rx: 8, fill: "#2A2F37", "class": "di-bar" }));
      g.appendChild(E("text", { x: x0 + Math.max(wb, 2) + 10, y: y + 13, fill: C.faint, "font-family": C.mono, "font-size": 12.5 }, "was " + r.before + (r.unit || "")));
      g.appendChild(E("rect", { x: x0, y: y + 30, width: Math.max(wa, 2), height: 16, rx: 8, fill: C.accent, "class": "di-bar" }));
      g.appendChild(E("text", { x: x0 + Math.max(wa, 2) + 10, y: y + 43, fill: C.accent, "font-family": C.mono, "font-size": 13, "font-weight": 600 }, "now " + r.after + (r.unit || "")));
      svg.appendChild(g);
    });
    return mount(target, svg);
  }

  function timeline(target, nodes) {
    if (!nodes || !nodes.length) return;
    var w = 1000, gap = w / nodes.length, svg = svgRoot("0 0 " + w + " 168", "timeline");
    var line = E("line", { x1: 40, y1: 54, x2: w - 40, y2: 54, stroke: C.line, "stroke-width": 2, "class": "di-line" }); line.setAttribute("data-draw", ""); svg.appendChild(line);
    nodes.forEach(function (nd, i) {
      var cx = gap * i + gap / 2, g = grp(i);
      g.appendChild(E("circle", { cx: cx, cy: 54, r: 9, fill: C.accent, "class": "di-dot" }));
      g.appendChild(E("text", { x: cx, y: 30, "text-anchor": "middle", fill: C.accent, "font-family": C.mono, "font-size": 12, "font-weight": 600, "letter-spacing": "0.06em" }, (nd.when || "").toUpperCase()));
      g.appendChild(E("text", { x: cx, y: 92, "text-anchor": "middle", fill: C.ink, "font-family": C.head, "font-size": 15.5, "font-weight": 600 }, nd.label || ""));
      if (nd.sub) g.appendChild(E("text", { x: cx, y: 114, "text-anchor": "middle", fill: C.muted, "font-family": C.body, "font-size": 12.5 }, nd.sub));
      svg.appendChild(g);
    });
    return mount(target, svg);
  }

  function framework(target, nodes) {
    if (!nodes || !nodes.length) return;
    var w = 1000, rh = 78, h = nodes.length * rh, svg = svgRoot("0 0 " + w + " " + h, "framework map");
    var x = 34;
    var line = E("line", { x1: x, y1: 20, x2: x, y2: h - 20, stroke: C.line, "stroke-width": 2, "class": "di-line" }); line.setAttribute("data-draw", ""); svg.appendChild(line);
    nodes.forEach(function (nd, i) {
      var y = i * rh + 26, g = grp(i);
      g.appendChild(E("circle", { cx: x, cy: y, r: 18, fill: C.node, stroke: C.accent, "stroke-width": 2, "class": "di-dot" }));
      g.appendChild(E("text", { x: x, y: y + 5, "text-anchor": "middle", fill: C.accent, "font-family": C.mono, "font-size": 13, "font-weight": 600 }, nd.n || (i + 1)));
      g.appendChild(E("text", { x: x + 40, y: y + 6, fill: C.ink, "font-family": C.head, "font-size": 19, "font-weight": 600 }, nd.label || ""));
      svg.appendChild(g);
    });
    return mount(target, svg);
  }

  // items: [{k,label,detail}] — flagship interactive "what you own" infographic
  function handover(target, items) {
    if (!items || !items.length) return;
    var w = 1000, colW = w / items.length, svg = svgRoot("0 0 " + w + " 150", "what you own");
    var line = E("line", { x1: 30, y1: 42, x2: w - 30, y2: 42, stroke: C.line, "stroke-width": 2, "class": "di-line" }); line.setAttribute("data-draw", ""); svg.appendChild(line);
    var cap = document.createElement("div"); cap.className = "di-caption";
    var capDefault = "Hover each piece — the client owns all of it, no lock-in.";
    cap.textContent = capDefault;
    items.forEach(function (it, i) {
      var cx = colW * i + colW / 2, g = grp(i); g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", (it.label || "") + ": " + (it.detail || ""));
      g.appendChild(E("rect", { x: cx - colW / 2 + 6, y: 2, width: colW - 12, height: 146, rx: 12, fill: "transparent", style: "pointer-events:all", "class": "di-hit" }));
      g.appendChild(E("rect", { x: cx - 26, y: 16, width: 52, height: 52, rx: 14, fill: C.node, stroke: C.accent, "stroke-width": 2, "class": "di-dot" }));
      g.appendChild(E("text", { x: cx, y: 48, "text-anchor": "middle", fill: C.accent, "font-family": C.mono, "font-size": 15, "font-weight": 600 }, it.k || (i + 1)));
      g.appendChild(E("text", { x: cx, y: 100, "text-anchor": "middle", fill: C.ink, "font-family": C.head, "font-size": 15, "font-weight": 600 }, it.label || ""));
      g.appendChild(E("text", { x: cx, y: 122, "text-anchor": "middle", fill: C.faint, "font-family": C.mono, "font-size": 10.5, "letter-spacing": ".08em" }, "YOURS"));
      var d = it.detail || capDefault;
      function on() { cap.textContent = d; var ns = svg.querySelectorAll(".di-node"); for (var j = 0; j < ns.length; j++) ns[j].classList.remove("is-active"); g.classList.add("is-active"); }
      g.addEventListener("mouseenter", on); g.addEventListener("focus", on);
      svg.appendChild(g);
    });
    return mount(target, svg, cap);
  }

  var API = { pipeline: pipeline, barDelta: barDelta, timeline: timeline, framework: framework, handover: handover };
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
