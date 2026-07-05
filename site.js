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

  // reveal on scroll
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

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
