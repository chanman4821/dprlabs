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

  // contact (no backend yet)
  var f=document.getElementById('contactForm');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();var n=document.getElementById('formNote');if(n){n.hidden=false;}f.querySelector('button').textContent='Sent ✓';});
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
