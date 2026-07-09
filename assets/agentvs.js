/* agentvs.js — hover/focus a behavior line to highlight its matching fix (same data-pair). */
(function () {
  "use strict";
  function init(el) {
    var items = el.querySelectorAll(".agvs-list li[data-pair]");
    function set(pair, on) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].getAttribute("data-pair") === pair) items[i].classList.toggle("hl", on);
      }
    }
    items.forEach(function (li) {
      var pair = li.getAttribute("data-pair");
      li.tabIndex = 0;
      li.addEventListener("mouseenter", function () { set(pair, true); });
      li.addEventListener("mouseleave", function () { set(pair, false); });
      li.addEventListener("focus", function () { set(pair, true); });
      li.addEventListener("blur", function () { set(pair, false); });
    });
  }
  function boot() { document.querySelectorAll("[data-agentvs]").forEach(init); }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
