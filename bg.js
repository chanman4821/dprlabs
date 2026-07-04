/* bg.js — Deeper live deep-ocean background.
   Layer 1: WebGL shader (animated caustics, light shafts, depth gradient).
   Layer 2: Canvas 2D drifting particles ("marine snow").
   Graceful fallback + respects prefers-reduced-motion. No libraries.

   MODIFIED: Added pause/resume hooks for hero.js coordinator.
   window.__heroBGPause()  — stops both RAF loops cleanly.
   window.__heroBGResume() — restarts stopped loops.
   window.__heroMobile — checked to reduce cost on mobile/coarse screens.
   DPR capped at 2 (was 1.5 — raised to match spec; stays ≤2). */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = !!window.__heroMobile; // set by hero.js before this runs

  /* ---------- mouse (shared, smoothed) ---------- */
  var mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5;
  window.addEventListener('pointermove', function (e) {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
  }, { passive: true });

  /* ── Pause / resume hooks (called by hero.js) ─────────────── */
  var _glPaused  = false, _glRafId  = null, _glFrameFn  = null;
  var _ptPaused  = false, _ptRafId  = null, _ptFrameFn  = null;

  window.__heroBGPause = function () {
    _glPaused = true;
    _ptPaused = true;
    if (_glRafId)  { cancelAnimationFrame(_glRafId);  _glRafId  = null; }
    if (_ptRafId)  { cancelAnimationFrame(_ptRafId);  _ptRafId  = null; }
  };

  window.__heroBGResume = function () {
    if (_glPaused && _glFrameFn && !_glRafId) {
      _glPaused = false;
      _glRafId = requestAnimationFrame(_glFrameFn);
    } else { _glPaused = false; }
    if (_ptPaused && _ptFrameFn && !_ptRafId) {
      _ptPaused = false;
      _ptRafId = requestAnimationFrame(_ptFrameFn);
    } else { _ptPaused = false; }
  };

  /* ================= WebGL caustics layer ================= */
  function initGL() {
    var c = document.getElementById('bg-gl');
    if (!c) return false;
    var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return false;

    var vsrc = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fsrc = [
      'precision highp float;',
      'uniform vec2 res;uniform float time;uniform vec2 mouse;',
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
      ' float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));',
      ' return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}',
      'float fbm(vec2 p){float v=0.,a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.02;a*=0.5;}return v;}',
      'void main(){',
      ' vec2 uv=gl_FragCoord.xy/res.xy;',
      ' vec2 q=uv;q.x*=res.x/res.y;',
      ' float t=time*0.04;',
      ' vec2 par=(mouse-0.5)*0.12;',
      /* depth gradient: teal-tinted surface → near-black abyss
         Tuned to tokens: --primitive-color-abyss #07090D top; deeper below */
      ' vec3 top=vec3(0.056,0.298,0.380);',   /* hsl(194 74% 22%) — teal surface */
      ' vec3 bot=vec3(0.027,0.035,0.051);',   /* ~#07090D abyss */
      ' vec3 col=mix(bot,top,pow(uv.y,1.6));',
      /* animated caustic shimmer — teal glow token */
      ' float ca=fbm(q*3.2+vec2(t*1.2,t*0.6)+par);',
      ' ca=fbm(q*3.2+ca*1.5+vec2(-t,t*0.4));',
      ' float caustic=pow(ca,2.2)*1.3;',
      /* --primitive-color-teal-signal #2DD4BF = vec3(0.176,0.831,0.749) */
      ' col+=vec3(0.10,0.45,0.55)*caustic*smoothstep(0.0,1.0,uv.y);',
      /* god rays from top */
      ' float ang=(uv.x-0.5+par.x)*1.4;',
      ' float ray=fbm(vec2(ang*4.0, uv.y*1.5 - t*2.0));',
      ' ray=pow(ray,3.0)*(1.0-uv.y)*1.1;',
      ' col+=vec3(0.18,0.5,0.6)*ray;',
      /* subtle floating glow blob */
      ' float g=smoothstep(0.5,0.0,length(q-vec2(0.8+sin(t)*0.1,0.7)))*0.15;',
      ' col+=vec3(0.1,0.4,0.5)*g;',
      /* vignette */
      ' float vig=smoothstep(1.3,0.3,length(uv-0.5));',
      ' col*=0.55+0.45*vig;',
      ' gl_FragColor=vec4(col,1.0);',
      '}'
    ].join('\n');

    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('bg.js shader:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, vsrc), fs = sh(gl.FRAGMENT_SHADER, fsrc);
    if (!vs || !fs) return false;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes   = gl.getUniformLocation(prog, 'res');
    var uTime  = gl.getUniformLocation(prog, 'time');
    var uMouse = gl.getUniformLocation(prog, 'mouse');

    /* Cap DPR at 2; mobile gets 1.5 max for performance */
    var dprCap = mobile ? 1.5 : 2;
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      c.width  = window.innerWidth  * dpr;
      c.height = window.innerHeight * dpr;
      gl.viewport(0, 0, c.width, c.height);
    }
    window.addEventListener('resize', resize); resize();

    var start = performance.now();
    function frame(now) {
      /* pause check — hero.js sets _glPaused via window.__heroBGPause */
      if (_glPaused) { _glRafId = null; return; }
      smx += (mx - smx) * 0.04;
      smy += (my - smy) * 0.04;
      gl.uniform2f(uRes, c.width, c.height);
      gl.uniform1f(uTime, reduce ? 8.0 : (now - start) / 1000);
      gl.uniform2f(uMouse, smx, smy);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduce) {
        _glRafId = requestAnimationFrame(frame);
      } else {
        _glRafId = null;
      }
    }
    _glFrameFn = frame;
    _glRafId   = requestAnimationFrame(frame);
    return true;
  }

  /* ================= particle layer ================= */
  function initParticles() {
    var c = document.getElementById('bg-parts');
    if (!c) return;
    var ctx = c.getContext('2d');
    var parts = [], N = 0;

    function resize() {
      c.width  = window.innerWidth;
      c.height = window.innerHeight;
      /* Mobile: fewer particles for performance */
      var maxN = mobile ? 55 : 110;
      N = Math.min(maxN, Math.floor(c.width * c.height / (mobile ? 20000 : 14000)));
      parts = [];
      for (var i = 0; i < N; i++) {
        parts.push({
          x:     Math.random() * c.width,
          y:     Math.random() * c.height,
          r:     Math.random() * 1.8 + 0.4,
          vy:    Math.random() * 0.25 + 0.05,
          vx:    (Math.random() - 0.5) * 0.12,
          a:     Math.random() * 0.5 + 0.15,
          tw:    Math.random() * Math.PI * 2,
          depth: Math.random()
        });
      }
    }
    window.addEventListener('resize', resize); resize();

    function frame() {
      /* pause check */
      if (_ptPaused) { _ptRafId = null; return; }
      ctx.clearRect(0, 0, c.width, c.height);
      var ox = (smx - 0.5) * 40, oy = (smy - 0.5) * 24;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y += p.vy; p.x += p.vx; p.tw += 0.02;
        if (p.y > c.height + 5) { p.y = -5; p.x = Math.random() * c.width; }
        if (p.x > c.width  + 5) p.x = -5;
        if (p.x < -5)           p.x = c.width + 5;
        var tw = 0.6 + 0.4 * Math.sin(p.tw);
        var px = p.x + ox * p.depth, py = p.y + oy * p.depth;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(120,220,235,' + (p.a * tw).toFixed(3) + ')';
        ctx.shadowBlur   = 8;
        ctx.shadowColor  = 'rgba(63,208,230,0.7)';
        ctx.fill();
      }
      if (!reduce) {
        _ptRafId = requestAnimationFrame(frame);
      } else {
        _ptRafId = null;
      }
    }
    _ptFrameFn = frame;
    _ptRafId   = requestAnimationFrame(frame);
  }

  /* ── Initialise ─────────────────────────────────────────────── */
  var glOk = false;
  try { glOk = initGL(); } catch (e) { glOk = false; }
  if (!glOk) {
    var g = document.getElementById('bg-gl');
    if (g) g.style.background =
      'radial-gradient(120% 100% at 50% 0%, #0c3340, #07090D 70%)';
  }
  if (!reduce) initParticles();
})();
