(function(){
  // mobile menu
  var t=document.getElementById('navToggle'),m=document.getElementById('mobileMenu');
  if(t){t.addEventListener('click',function(){var o=m.classList.toggle('open');t.setAttribute('aria-expanded',o)});
    m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open');t.setAttribute('aria-expanded','false')})});}

  // faq accordion
  document.querySelectorAll('[data-faq] .faq-btn').forEach(function(b){
    var panel=b.nextElementSibling;
    b.addEventListener('click',function(){
      var open=b.getAttribute('aria-expanded')==='true';
      b.setAttribute('aria-expanded',!open);
      panel.style.maxHeight=open?null:panel.scrollHeight+'px';
    });
  });

  // reveal on scroll — robust: never leave content hidden
  var revEls=document.querySelectorAll('.reveal');
  if(revEls.length){
    var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(rm||!('IntersectionObserver' in window)){
      revEls.forEach(function(el){el.classList.add('in');});
    }else{
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:0,rootMargin:'0px 0px 18% 0px'});
      revEls.forEach(function(el){io.observe(el);});
      // bulletproof: force-reveal anything at/above the viewport on scroll (catches IO misses on fast scroll/jumps)
      var tk=false;
      function sw(){tk=false;var vh=window.innerHeight||document.documentElement.clientHeight;for(var i=0;i<revEls.length;i++){var el=revEls[i];if(!el.classList.contains('in')&&el.getBoundingClientRect().top<vh+140)el.classList.add('in');}}
      function os(){if(!tk){tk=true;requestAnimationFrame(sw);}}
      window.addEventListener('scroll',os,{passive:true});window.addEventListener('resize',os,{passive:true});sw();
      // final safety net: nothing stays invisible, ever (cards can't "disappear")
      setTimeout(function(){revEls.forEach(function(el){el.classList.add('in');});},1400);
    }
  }

  // count up
  function countUp(el){
    var target=+el.getAttribute('data-count'),dur=1100,t0=null;
    function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1);el.textContent=Math.round(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  }
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);cio.unobserve(e.target);}})},{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el);});

  // contact — real capture via form service (falls back to mailto until endpoint is set)
  var f=document.getElementById('contactForm');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();
    var btn=f.querySelector('button'), data={source:'contact-form',page:location.pathname,_subject:'Contact form'};
    try{ new FormData(f).forEach(function(v,k){ if(v) data[k]=v; }); }catch(_){}
    if(btn) btn.textContent='Sending\u2026';
    (window.dprCapture?window.dprCapture(data):Promise.resolve()).then(function(){
      var n=document.getElementById('formNote'); if(n){n.hidden=false;} if(btn){btn.textContent='Sent \u2713';}
    }).catch(function(){ if(btn) btn.textContent='Try again'; });
  });
})();

/* hero hub — bot dances; offerings light up when you explore them */
(function(){
  var hub=document.getElementById('hub'); if(!hub) return;
  var nodes=hub.querySelectorAll('.hub-node');
  var lines=hub.querySelectorAll('.hub-web line');
  var hovers=0, tapTimer;
  function set(on,i){
    hovers = on ? hovers+1 : Math.max(0,hovers-1);
    if(lines[i]) lines[i].classList.toggle('lit',on);
    hub.classList.toggle('reacting',hovers>0);
  }
  nodes.forEach(function(n){
    var i=+n.getAttribute('data-node');
    n.addEventListener('mouseenter',function(){set(true,i);});
    n.addEventListener('mouseleave',function(){set(false,i);});
    n.addEventListener('focus',function(){set(true,i);});
    n.addEventListener('blur',function(){set(false,i);});
    n.addEventListener('click',function(){
      hub.classList.add('reacting'); if(lines[i])lines[i].classList.add('lit');
      clearTimeout(tapTimer); tapTimer=setTimeout(function(){hub.classList.remove('reacting'); if(lines[i])lines[i].classList.remove('lit');},1500);
    });
  });
})();

/* hero hub showcase — each service card auto-presents in turn, expanding to reveal the service (also on hover) */
(function(){
  var hub=document.getElementById('hub'); if(!hub) return;
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  if(window.matchMedia('(max-width:760px)').matches) return;
  var nodes=Array.prototype.slice.call(hub.querySelectorAll('.hub-node'));
  var lines=hub.querySelectorAll('.hub-web line');
  if(!nodes.length) return;
  var i=0, paused=false;
  hub.addEventListener('mouseenter',function(){paused=true;});
  hub.addEventListener('mouseleave',function(){paused=false;});
  function step(){
    if(paused){setTimeout(step,1500);return;}
    var node=nodes[i], idx=+node.getAttribute('data-node');
    node.classList.add('showcase');
    if(lines[idx])lines[idx].classList.add('lit');
    setTimeout(function(){
      node.classList.remove('showcase');
      if(lines[idx])lines[idx].classList.remove('lit');
      i=(i+1)%nodes.length;
      setTimeout(step,1000);
    },3400);
  }
  setTimeout(step,2600);
})();

/* One-Number Test — homepage self-diagnostic */
(function(){
  var t=document.getElementById("oneNumberTest"); if(!t) return;
  var rows=t.querySelectorAll("[data-q]");
  var res=document.getElementById("ontResult");
  if(!res) return;
  var verdict=res.querySelector(".verdict"), rec=res.querySelector(".rec"), link=res.querySelector(".txt-link");
  var R={
    ready:["Pilot-ready. You have a real number to move.","You\u2019ve got a countable metric, a baseline, real stakes, and a way to check the AI \u2014 exactly what a two-week pilot needs. The only thing left is agreeing the target in writing.","Book a 2-week pilot","contact.html"],
    scope:["You have a scoping problem, not an AI problem.","The gap isn\u2019t the model \u2014 it\u2019s that \u201cworking\u201d isn\u2019t defined yet. Name the number, set a baseline, decide who checks it. That\u2019s the work we do in week one, before writing a line of code.","See how we scope it","pilot-scoping-guide.html"],
    notyet:["Not yet \u2014 measure before you automate.","With no number and no baseline, AI just helps you be wrong faster. Make the outcome countable first \u2014 here\u2019s the free guide. Don\u2019t hire anyone, us included, until you can name the number.","Read the scoping guide","pilot-scoping-guide.html"]
  };
  function update(){
    var answered=0,yes=0;
    rows.forEach(function(r){var p=r.querySelector("[aria-pressed=\"true\"]");if(p){answered++;yes+=+p.getAttribute("data-v");}});
    if(answered<rows.length){res.className="tool-result";return;}
    var k=yes===4?"ready":(yes>=2?"scope":"notyet"),d=R[k];
    res.className="tool-result show "+(k==="ready"?"good":(k==="scope"?"warn":""));
    verdict.textContent=d[0]; rec.textContent=d[1];
    if(link){link.firstChild.textContent=d[2]+" "; link.setAttribute("href",d[3]);}
  }
  t.querySelectorAll(".yn").forEach(function(g){
    g.querySelectorAll("button").forEach(function(b){
      b.addEventListener("click",function(){
        g.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed","false");});
        b.setAttribute("aria-pressed","true"); update();
      });
    });
  });
})();

/* Learn dropdown (desktop nav) */
(function(){
  var btn=document.getElementById('learnBtn'), menu=document.getElementById('learnMenu');
  if(!btn||!menu) return;
  function open(){menu.classList.add('open');btn.setAttribute('aria-expanded','true');}
  function close(){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');}
  btn.addEventListener('click',function(e){e.stopPropagation();(btn.getAttribute('aria-expanded')==='true')?close():open();});
  document.addEventListener('click',function(e){if(!e.target.closest('.learn'))close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close);});
})();

/* ── Lead capture + investor nav + caret polish (DPR, site-wide) ──────
   Loaded on every page via site.js. Collected info goes to the form
   service below; until the endpoint is set it falls back to email so
   nothing is ever lost.
   ▶▶ PASTE YOUR FORMSPREE (or Basin) ENDPOINT HERE: ▶▶ */
window.DPR_FORM_ENDPOINT = window.DPR_FORM_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID';
(function(){
  var ENDPOINT = window.DPR_FORM_ENDPOINT;
  var configured = ENDPOINT.indexOf('YOUR_FORM_ID') === -1 && /^https?:\/\//.test(ENDPOINT);

  // send a lead to the form service; falls back to a prefilled email if not yet configured
  window.dprCapture = function(data){
    if(configured){
      return fetch(ENDPOINT, {method:'POST', headers:{'Accept':'application/json','Content-Type':'application/json'}, body:JSON.stringify(data)})
        .then(function(r){ if(!r.ok) throw new Error('capture failed'); return true; });
    }
    var subj = encodeURIComponent(data._subject || ('New lead — ' + (data.source||location.pathname)));
    var body = encodeURIComponent(Object.keys(data).filter(function(k){return k[0]!=='_';}).map(function(k){return k+': '+data[k];}).join('\n'));
    window.location.href = 'mailto:hello@dprai.io?subject=' + subj + '&body=' + body;
    return Promise.resolve(false);
  };

  // Investors nav item (desktop + mobile), inserted before About
  var nav = document.querySelector('.nav-links');
  if(nav && !nav.querySelector('[data-ir]')){
    var about = nav.querySelector('a[href$="about.html"]');
    var a = document.createElement('a'); a.href='/dataroom.html'; a.textContent='Investors'; a.setAttribute('data-ir','');
    about ? nav.insertBefore(a, about) : nav.appendChild(a);
  }
  var mm = document.getElementById('mobileMenu');
  if(mm && !mm.querySelector('[data-ir]')){
    var lastM = mm.querySelector('a[href$="contact.html"]');
    var a2 = document.createElement('a'); a2.href='/dataroom.html'; a2.textContent='Investors'; a2.setAttribute('data-ir','');
    lastM ? mm.insertBefore(a2, lastM) : mm.appendChild(a2);
  }

  // swap the ▾ caret glyph for a clean chevron
  Array.prototype.forEach.call(document.querySelectorAll('.caret'), function(c){
    c.innerHTML = '<svg width="10" height="7" viewBox="0 0 10 7" aria-hidden="true" focusable="false" style="vertical-align:middle;margin-top:-1px"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  });

  // Brand mark → [DPR] AI code-token (site-wide, DRY; no-JS falls back to plain "DPR AI")
  Array.prototype.forEach.call(document.querySelectorAll('a.brand'), function(el){
    if(el.getAttribute('data-brandmark')) return;
    el.setAttribute('data-brandmark','1');
    if(!el.getAttribute('aria-label')) el.setAttribute('aria-label','DPR AI — home');
    el.innerHTML = '<span class="brk" aria-hidden="true">[</span>'+
      '<span class="brand-word">DPR</span>'+
      '<span class="brk" aria-hidden="true">]</span>'+
      '<span class="brand-ai">AI</span>'+
      '<span class="brand-cursor" aria-hidden="true"></span>';
  });

  // crisp SVG favicon (keeps each page's relative prefix)
  var fav = document.querySelector('link[rel~="icon"]');
  if(fav && fav.getAttribute('href')){
    fav.setAttribute('type','image/svg+xml');
    fav.setAttribute('href', fav.getAttribute('href').replace(/assets\/.*$/, 'assets/brand/mark.svg'));
  }

  // site-wide email capture strip, injected at the top of the footer
  var fw = document.querySelector('footer .wrap');
  if(fw && !document.getElementById('dprCapture')){
    var wrap = document.createElement('div'); wrap.id='dprCapture'; wrap.className='dpr-capture';
    wrap.innerHTML =
      '<div class="dpr-capture-txt"><b>Get the occasional honest note.</b>'+
      '<span>How we build AI you own — no spam, unsubscribe anytime.</span></div>'+
      '<form class="dpr-capture-form" novalidate>'+
      '<input type="email" required placeholder="you@company.com" aria-label="Your email" autocomplete="email" />'+
      '<button type="submit" class="btn btn-primary">Keep me posted</button>'+
      '<span class="dpr-capture-ok" hidden>Thanks — you\u2019re on the list.</span></form>';
    fw.insertBefore(wrap, fw.firstChild);
    var cf = wrap.querySelector('form'), ok = wrap.querySelector('.dpr-capture-ok'), inp = wrap.querySelector('input'), b = wrap.querySelector('button');
    cf.addEventListener('submit', function(e){
      e.preventDefault();
      var email = (inp.value||'').trim();
      if(!/.+@.+\..+/.test(email)){ inp.focus(); return; }
      b.textContent = 'Sending\u2026';
      window.dprCapture({email:email, source:'footer-capture', page:location.pathname, _subject:'Newsletter signup'})
        .then(function(){ b.style.display='none'; inp.style.display='none'; ok.hidden=false; })
        .catch(function(){ b.textContent='Try again'; });
    });
  }

  // styles for the capture strip
  var css =
    '.dpr-capture{display:flex;gap:20px;align-items:center;justify-content:space-between;flex-wrap:wrap;'+
    'border:1px solid var(--line);border-radius:16px;background:linear-gradient(180deg,#fff,rgba(59,91,219,.04));'+
    'padding:20px 24px;margin:0 0 28px}'+
    '.dpr-capture-txt{display:flex;flex-direction:column;gap:2px}'+
    '.dpr-capture-txt b{font-size:16px}.dpr-capture-txt span{color:var(--muted);font-size:13px}'+
    '.dpr-capture-form{display:flex;gap:10px;align-items:center;flex-wrap:wrap}'+
    '.dpr-capture-form input{padding:10px 14px;border:1px solid var(--line);border-radius:10px;font:inherit;font-size:15px;min-width:230px;background:#fff}'+
    '.dpr-capture-form input:focus{outline:none;border-color:var(--accent,#3b5bdb);box-shadow:0 0 0 3px rgba(59,91,219,.15)}'+
    '.dpr-capture-ok{color:#1f7a54;font-family:var(--mono);font-size:13px}'+
    '@media(max-width:640px){.dpr-capture{flex-direction:column;align-items:flex-start}.dpr-capture-form{width:100%}.dpr-capture-form input{min-width:0;flex:1}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();
