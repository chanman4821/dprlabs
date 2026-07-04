/* media.js — background video controller for DPR / Deeper
   - prefers-reduced-motion: pause everything (CSS also hides .hero-vid / .amb-vid,
     so the still images take over). Motion never plays for those visitors.
   - Hero loop: plays while it's on screen (above the fold).
   - Section + tunnel loops (.amb-vid): play ONLY while near the viewport via
     IntersectionObserver, and pause when scrolled away — premium motion without
     burning battery or bandwidth (they also use preload="none"). */
(function () {
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hero = document.querySelector('.hero-vid');
  var ambs = Array.prototype.slice.call(document.querySelectorAll('.amb-vid'));

  function play(v) { if (!v) return; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function pause(v) { if (!v) return; try { v.pause(); } catch (e) {} }
  function inView(v) {
    var r = v.getBoundingClientRect();
    var vh = window.innerHeight || 800;
    return r.bottom > -200 && r.top < vh + 200;
  }

  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      if (mq.matches) return;
      entries.forEach(function (e) {
        if (e.isIntersecting) play(e.target); else pause(e.target);
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    ambs.forEach(function (v) { io.observe(v); });
  }

  function apply() {
    if (mq.matches) {
      pause(hero);
      ambs.forEach(pause);
    } else {
      play(hero);
      if (io) { ambs.forEach(function (v) { if (inView(v)) play(v); }); }
      else { ambs.forEach(play); }
    }
  }
  apply();
  if (mq.addEventListener) mq.addEventListener('change', apply);
  else if (mq.addListener) mq.addListener(apply);
})();
