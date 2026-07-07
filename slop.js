/* THE STATE OF THE INDUSTRY — trigger the "one bot multiplies into six" reveal
   when the section scrolls into view. Degrades gracefully: if JS or
   IntersectionObserver is unavailable, the six are shown static (no pre-hide). */
(function () {
  var sec = document.getElementById('slop');
  if (!sec) return;

  // Marking the section enables the pre-hidden state defined in slop.css.
  sec.classList.add('slop-anim');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    sec.classList.add('multiplied'); // show immediately, no motion
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        sec.classList.add('multiplied');
        io.disconnect();
        break;
      }
    }
  }, { threshold: 0.25 });

  io.observe(sec);
})();
