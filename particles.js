/* particles.js — high-density cinematic particle field (Interstellar-style).
   Thousands of depth-projected particles drifting slowly through deep black,
   royal cyan + white with occasional yellow, additive glow, pointer parallax.
   WebGL (no libs). Respects prefers-reduced-motion (single static frame),
   pauses off-screen + when tab hidden, caps DPR, reduces density on mobile. */
(function () {
  'use strict';
  var canvas = document.getElementById('particles');
  if (!canvas) return;

  var gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false })
        || canvas.getContext('experimental-webgl');
  if (!gl) return; /* graceful: no field, hero still fine */

  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COARSE = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  /* density: dense on desktop, lighter on small/coarse for 60fps */
  var COUNT = COARSE || window.innerWidth < 700 ? 4200 : 11000;
  var DEPTH = 6.0;      /* far plane */
  var FOCAL = 1.15;     /* perspective */
  var SPEED = REDUCE ? 0.0 : 0.16; /* slow, premium drift */

  var vsrc =
    'attribute vec3 aPos; attribute float aSeed;' +
    'uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse; uniform float uDpr;' +
    'varying float vB; varying float vSeed;' +
    'void main(){' +
    '  float z = mod(aPos.z - uTime, ' + DEPTH.toFixed(1) + ');' +
    '  z = max(z, 0.02);' +
    '  vec2 par = uMouse * (0.35 / z);' +           /* nearer particles parallax more */
    '  vec2 p = (aPos.xy * ' + FOCAL.toFixed(2) + ') / z + par;' +
    '  float aspect = uRes.x / uRes.y;' +
    '  p.x /= aspect;' +
    '  gl_Position = vec4(p, 0.0, 1.0);' +
    '  float near = 1.0 - (z / ' + DEPTH.toFixed(1) + ');' +   /* 0 far .. 1 near */
    '  float size = (1.1 + aSeed * 3.0) * near * near * uDpr * 4.6;' +
    '  gl_PointSize = clamp(size, 0.0, 34.0);' +
    '  vB = (0.18 + 0.82 * smoothstep(0.0, 0.12, z)) * (0.35 + 0.65 * near * near);' +          /* fade in from cam, dim far */
    '  vSeed = aSeed;' +
    '}';

  var fsrc =
    'precision mediump float;' +
    'varying float vB; varying float vSeed;' +
    'void main(){' +
    '  vec2 d = gl_PointCoord - 0.5;' +
    '  float r = length(d);' +
    '  if (r > 0.5) discard;' +
    '  float glow = pow(1.0 - r * 2.0, 2.2);' +      /* soft round falloff */
    /* palette: mostly cyan->white, ~7% yellow */
    '  vec3 cyan  = vec3(0.13, 0.83, 0.93);' +
    '  vec3 white = vec3(0.90, 0.97, 1.0);' +
    '  vec3 yellow= vec3(1.0, 0.82, 0.29);' +
    '  vec3 col = mix(cyan, white, smoothstep(0.55, 1.0, vSeed));' +
    '  if (vSeed > 0.93) col = yellow;' +
    '  float a = glow * vB;' +
    '  gl_FragColor = vec4(col * a, a);' +            /* premultiplied additive-ish */
    '}';

  function sh(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { return null; }
    return s;
  }
  var vs = sh(gl.VERTEX_SHADER, vsrc), fs = sh(gl.FRAGMENT_SHADER, fsrc);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  /* build particles: xy spread, z depth */
  var data = new Float32Array(COUNT * 4);
  for (var i = 0; i < COUNT; i++) {
    var o = i * 4;
    data[o]     = (Math.random() * 2 - 1) * 2.2;  /* x */
    data[o + 1] = (Math.random() * 2 - 1) * 2.2;  /* y */
    data[o + 2] = Math.random() * DEPTH;          /* z */
    data[o + 3] = Math.random();                  /* seed */
  }
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  var aPos = gl.getAttribLocation(prog, 'aPos');
  var aSeed = gl.getAttribLocation(prog, 'aSeed');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(aSeed);
  gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 16, 12);

  var uTime = gl.getUniformLocation(prog, 'uTime');
  var uRes = gl.getUniformLocation(prog, 'uRes');
  var uMouse = gl.getUniformLocation(prog, 'uMouse');
  var uDpr = gl.getUniformLocation(prog, 'uDpr');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); /* premultiplied */
  gl.clearColor(0, 0, 0, 0);

  var W = 0, H = 0;
  function resize() {
    var r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uDpr, DPR);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  var mx = 0, my = 0, tmx = 0, tmy = 0;
  if (!COARSE && !REDUCE) {
    window.addEventListener('pointermove', function (e) {
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * -2;
    }, { passive: true });
  }

  var t = 0, last = 0, raf = 0, running = false;
  function frame(now) {
    if (!running) return;
    var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016; last = now;
    t += dt * SPEED;
    mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, mx * 0.12, my * 0.12);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, COUNT);
    raf = requestAnimationFrame(frame);
  }
  function still() {
    gl.uniform1f(uTime, 1.7);
    gl.uniform2f(uMouse, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, COUNT);
  }
  function start() { if (running || REDUCE) return; running = true; last = 0; raf = requestAnimationFrame(frame); }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

  if (REDUCE) { still(); return; }

  /* pause off-screen + on tab hide */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && !document.hidden) start(); else stop(); });
    }, { threshold: 0.01 }).observe(canvas);
  } else { start(); }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
  start();
})();
