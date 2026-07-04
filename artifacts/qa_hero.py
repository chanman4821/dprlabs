import json, time
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8899/index.new.html"
ART = r"C:\Users\dennha\programs\dpr\artifacts"

console_msgs = []
failed_reqs = []
responses = []

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width":1440,"height":900}, device_scale_factor=1)
    page = ctx.new_page()
    page.on("console", lambda m: console_msgs.append({"type":m.type,"text":m.text}))
    page.on("requestfailed", lambda r: failed_reqs.append({"url":r.url,"err":r.failure}))
    page.on("response", lambda r: responses.append({"url":r.url,"status":r.status}))
    resp = page.goto(URL, wait_until="networkidle")
    http_status = resp.status if resp else None
    time.sleep(3)

    page.screenshot(path=ART+r"\hero-desktop.png", full_page=True)

    diag = page.evaluate(r"""() => {
      const out = {};
      const canvases = Array.from(document.querySelectorAll('canvas'));
      out.canvasCount = canvases.length;
      out.canvases = canvases.map(c => ({
        id: c.id,
        cssW: c.getBoundingClientRect().width,
        cssH: c.getBoundingClientRect().height,
        pxW: c.width, pxH: c.height
      }));
      const gl = document.querySelector('#bg-gl');
      out.bgGlPresent = !!gl;
      if (gl) {
        let ctx = null;
        try { ctx = gl.getContext('webgl2') || gl.getContext('webgl') || gl.getContext('experimental-webgl'); } catch(e){}
        out.bgGlHasWebGL = !!ctx;
      }
      const hero = document.querySelector('.hero, header, section');
      out.heroBg = hero ? getComputedStyle(hero).backgroundColor : null;
      const h1 = document.querySelector('h1');
      out.h1Text = h1 ? h1.innerText.trim() : null;
      out.h1Color = h1 ? getComputedStyle(h1).color : null;
      out.bodyBg = getComputedStyle(document.body).backgroundColor;
      // CTA buttons
      const btns = Array.from(document.querySelectorAll('a,button')).filter(e=>{
        const r=e.getBoundingClientRect(); return r.width>0 && r.height>0;
      }).map(e=>({t:(e.innerText||'').trim().slice(0,40), cls:e.className}));
      out.ctaCandidates = btns.slice(0,12);
      // overflow
      out.scrollWidth = document.documentElement.scrollWidth;
      out.innerWidth = window.innerWidth;
      out.overflow = document.documentElement.scrollWidth > window.innerWidth;
      // amber number search
      const all = Array.from(document.querySelectorAll('*'));
      out.bodyTextSample = document.body.innerText.slice(0,600);
      // NaN/undefined
      out.hasNaN = document.body.innerText.includes('NaN');
      out.hasUndefined = document.body.innerText.includes('undefined');
      return out;
    }""")

    # mobile
    page.set_viewport_size({"width":390,"height":844})
    time.sleep(1.5)
    page.screenshot(path=ART+r"\hero-mobile.png", full_page=True)
    mobile_overflow = page.evaluate("() => ({sw:document.documentElement.scrollWidth, iw:window.innerWidth, over:document.documentElement.scrollWidth>window.innerWidth})")

    b.close()

report = {
  "http_status": http_status,
  "console": console_msgs,
  "failed_requests": failed_reqs,
  "http_errors": [r for r in responses if r["status"]>=400],
  "diag": diag,
  "mobile_overflow": mobile_overflow,
}
print(json.dumps(report, indent=2, default=str))
open(ART+r"\visual-qa-report.json","w").write(json.dumps(report, indent=2, default=str))
