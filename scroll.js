/* scroll.js — DPR Labs premium scroll choreography.
 *
 * Adds, on top of the existing dpr.js reveals/counters:
 *   • Cinematic hero video play-in (crossfade over the still poster).
 *   • Soft pointer parallax on the hero pipeline (fine-pointer only).
 *   • Lenis smooth scrolling wired to GSAP ScrollTrigger.
 *   • Scroll-scrub hero parallax (visual drifts, copy lifts + fades).
 *   • The method "spine" connector draws itself as it enters view.
 *
 * HARD RULES:
 *   • prefers-reduced-motion → NO Lenis, NO scrub, NO parallax. Static page.
 *   • Graceful degradation: if GSAP / Lenis CDNs fail, the page is fully
 *     usable (dpr.js reveals still fire; native scrolling still works).
 *   • No layout shift, no horizontal overflow, anchor links still work.
 */
(function () {
  "use strict";

  var REDUCE =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var FINE_POINTER =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  /* ── 1. Hero video: crossfade in once it can actually play ──────── */
  (function heroVideo() {
    var v = document.getElementById("heroVideo");
    if (!v) return;
    if (REDUCE) {
      // Poster only — never start the loop.
      try { v.pause(); } catch (e) {}
      return;
    }
    var reveal = function () { v.classList.add("is-playing"); };
    if (v.readyState >= 3) reveal();
    v.addEventListener("canplay", reveal, { once: true });
    v.addEventListener("playing", reveal, { once: true });
    // If the mp4 404s / errors, leave the poster showing (no reveal).
    v.addEventListener("error", function () {
      v.classList.remove("is-playing");
    });
  })();

  /* ── 2. Soft pointer parallax on the hero pipeline ──────────────── */
  (function pointerParallax() {
    if (REDUCE || !FINE_POINTER) return;
    var stage = document.querySelector("[data-hero-parallax]");
    var hero = document.getElementById("hero");
    if (!stage || !hero) return;

    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    var MAX = 14; // px of drift

    var loop = function () {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      stage.style.transform =
        "translate3d(" + cx.toFixed(2) + "px," + cy.toFixed(2) + "px,0)";
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      tx = -nx * MAX;
      ty = -ny * MAX;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener("pointerleave", function () {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  })();

  if (REDUCE) return; // Everything below is motion — bail for reduced-motion.

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var Lenis = window.Lenis;

  /* ── 3. Lenis smooth scroll (only if the lib loaded) ────────────── */
  var lenis = null;
  if (typeof Lenis === "function") {
    try {
      lenis = new Lenis({
        duration: 1.05,
        easing: function (t) { return 1 - Math.pow(1 - t, 3); },
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });
      var rafLoop = function (time) {
        lenis.raf(time);
        requestAnimationFrame(rafLoop);
      };
      requestAnimationFrame(rafLoop);

      // Anchor links → smooth scroll via Lenis (keeps focus behaviour).
      document.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a) return;
        var id = a.getAttribute("href");
        if (!id || id === "#") return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -72 });
        if (el.setAttribute) el.setAttribute("tabindex", "-1");
        if (el.focus) el.focus({ preventScroll: true });
      });
    } catch (err) {
      lenis = null;
    }
  }

  /* ── 4. GSAP scroll choreography (only if GSAP + ScrollTrigger) ─── */
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // Keep ScrollTrigger in sync with Lenis' virtual scroll.
  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
  }

  // Hero parallax: visual drifts down + darkens, copy lifts + fades out.
  var stage = document.querySelector("[data-hero-parallax]");
  var inner = document.querySelector(".hero__inner");
  if (stage) {
    gsap.to(stage, {
      yPercent: 12,
      scale: 1.06,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });
  }
  if (inner) {
    gsap.to(inner, {
      yPercent: -8,
      opacity: 0.15,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom 30%",
        scrub: 0.6,
      },
    });
  }

  // Method spine connector draws itself on scroll.
  var spine = document.querySelector("[data-spine]");
  if (spine) {
    spine.classList.add("spine--draw");
    gsap.fromTo(
      spine,
      { "--spine-draw": "0%" },
      {
        "--spine-draw": "100%",
        ease: "none",
        scrollTrigger: {
          trigger: spine,
          start: "top 78%",
          end: "bottom 70%",
          scrub: 0.5,
        },
      }
    );
  }

  // NOTE: per-section fade/slide reveals are owned by dpr.js (.reveal +
  // IntersectionObserver). Lenis smooths those into a premium glide — we
  // deliberately do NOT re-animate them here to avoid opacity fighting.

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
