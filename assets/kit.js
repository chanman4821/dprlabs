/* DPR kit — shared interactions: reveal, expandable cards, FAQ, data-driven stepper */
(function () {
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

    // scroll reveal
    var rv = document.querySelectorAll('[data-rv]');
    if (reduce || !('IntersectionObserver' in window)) {
      rv.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: .12 });
      rv.forEach(function (el) { io.observe(el); });
    }

    // expandable service cards
    document.querySelectorAll('.sv-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () { btn.closest('.sv-card').classList.toggle('open'); });
    });

    // FAQ accordions
    document.querySelectorAll('.qa button').forEach(function (b) {
      b.addEventListener('click', function () { b.closest('.qa').classList.toggle('open'); });
    });

    // data-driven stepper: needs #stepDots, #stepPanel and a JSON <script id="stepData">
    var dots = document.getElementById('stepDots'), panel = document.getElementById('stepPanel'),
        data = document.getElementById('stepData');
    if (dots && panel && data) {
      var steps = JSON.parse(data.textContent);
      function render(i) {
        Array.prototype.forEach.call(dots.children, function (d, j) { d.classList.toggle('on', j === i); });
        var s = steps[i];
        panel.innerHTML = '<h4>' + s.h + '</h4><p>' + s.p + '</p>' + (s.d ? '<div class="deliver">' + s.d + '</div>' : '');
      }
      steps.forEach(function (s, i) {
        var el = document.createElement('button'); el.type = 'button'; el.className = 'step-dot';
        el.innerHTML = '<div class="n">' + s.n + '</div><div class="l">' + s.l + '</div>';
        el.addEventListener('click', function () { render(i); });
        el.addEventListener('mouseenter', function () { render(i); });
        dots.appendChild(el);
      });
      render(0);
    }
  });
})();
