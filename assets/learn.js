/* DPR learn.js — comprehension interactions for the beginner surfaces.
   1) .term[data-def]  -> plain-word definition popovers (hover + focus + tap, Esc closes)
   2) .sortgame        -> "trust it or check it?" tap game (mobile-safe, keyboard-safe,
                          degrades to a static answer key when JS is off)
   No external deps. Honors prefers-reduced-motion. Never hides content permanently. */
(function () {
  "use strict";
  function ready(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded",fn); }

  /* ---------------- plain-word glossary (single source of truth) ----------
     Honest, one-sentence, non-marketing definitions. window.DPRglossary lets the
     /glossary page render from the same data. initGlossary() auto-wraps the FIRST
     use of each term on a page in a .term tooltip (no per-page editing needed). */
  var DPRGLOSSARY = {
    "baseline": {w:"Baseline", d:"A starting measurement you take before any change, so you can prove whether things actually got better."},
    "eval": {w:"Eval", d:"A repeatable test that checks whether the AI's answers are actually good — a grading key for its work."},
    "evals": {w:"Evals", d:"Repeatable tests that check whether the AI's answers are actually good — a grading key for its work."},
    "guardrail": {w:"Guardrail", d:"A limit you set so the AI can't do or say certain things — like bumpers in a bowling lane."},
    "guardrails": {w:"Guardrails", d:"Limits you set so the AI can't do or say certain things — like bumpers in a bowling lane."},
    "hallucinate": {w:"Hallucinate", d:"When AI makes up a fact, name, or number that sounds right but isn't real."},
    "hallucinating": {w:"Hallucinating", d:"When AI makes up a fact, name, or number that sounds right but isn't real."},
    "inference": {w:"Inference", d:"The moment the AI actually runs and gives you an answer."},
    "lock-in": {w:"Lock-in", d:"When leaving a vendor is so painful or costly that you're stuck with them."},
    "fine-tune": {w:"Fine-tune", d:"Training a general AI a bit more on your own examples so it fits your specific job."},
    "fine-tuning": {w:"Fine-tuning", d:"Training a general AI a bit more on your own examples so it fits your specific job."},
    "prompt": {w:"Prompt", d:"The instructions you type to tell the AI what you want."},
    "llm": {w:"LLM", d:"Large Language Model — the kind of AI (like ChatGPT) that reads and writes text."},
    "rag": {w:"RAG", d:"Letting the AI look things up in your documents before it answers, instead of guessing from memory."},
    "retrieval": {w:"Retrieval", d:"Having the AI look up the right information in your documents before it answers."},
    "token": {w:"Token", d:"The little chunks of text AI reads and writes; usage is often measured and billed by these."},
    "latency": {w:"Latency", d:"How long you wait for the AI to answer."},
    "throughput": {w:"Throughput", d:"How much work the system can handle in a given amount of time."},
    "deterministic": {w:"Deterministic", d:"Gives the exact same answer every time for the same input — predictable, not random."},
    "governance": {w:"Governance", d:"The rules and oversight for using AI safely and responsibly in a business."},
    "compliance": {w:"Compliance", d:"Following the laws and rules that apply to your business and its data."},
    "provenance": {w:"Provenance", d:"A clear record of where something came from and how it was made."},
    "unit economics": {w:"Unit economics", d:"Whether one sale or one use makes or loses money, once you count its real costs."},
    "dealflow": {w:"Dealflow", d:"The steady stream of possible deals or investments coming in to look at."},
    "moat": {w:"Moat", d:"A lasting advantage that makes a business hard for competitors to copy."},
    "orchestrate": {w:"Orchestrate", d:"Coordinating several AI steps or tools so they work together on a bigger task."},
    "orchestration": {w:"Orchestration", d:"Coordinating several AI steps or tools so they work together on a bigger task."},
    "agentic": {w:"Agentic", d:"AI that can take several steps on its own to finish a task, not just answer one question."},
    "endpoint": {w:"Endpoint", d:"A web address a program calls to send or fetch data."},
    "deployment": {w:"Deployment", d:"Putting finished software to work where people actually use it."},
    "observability": {w:"Observability", d:"Being able to see what a system is doing inside, so you can spot problems."},
    "embeddings": {w:"Embeddings", d:"A way of turning words into numbers so a computer can find related meaning."},
    "ebitda": {w:"EBITDA", d:"A common measure of a company's profit before certain costs like interest and taxes."},
    "cohort": {w:"Cohort", d:"A group tracked together over time — like all the customers who joined the same month."}
  };
  window.DPRglossary = DPRGLOSSARY;

  function initGlossary(){
    var main = document.querySelector('main'); if(!main || typeof document.createTreeWalker!=='function') return;
    var SKIP = {A:1,BUTTON:1,CODE:1,PRE:1,H1:1,H2:1,H3:1,H4:1,H5:1,H6:1,SCRIPT:1,STYLE:1,DFN:1,FIGCAPTION:1};
    var terms = Object.keys(DPRGLOSSARY).sort(function(a,b){return b.length-a.length;});
    terms.forEach(function(term){
      var re = new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b','i');
      var walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
        acceptNode:function(node){
          if(!node.nodeValue || !re.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
          var p = node.parentElement;
          while(p && p!==main){
            if(SKIP[p.tagName] || (p.classList && (p.classList.contains('term')||p.classList.contains('tldr')||p.classList.contains('sortgame')||p.classList.contains('eyebrow')||p.classList.contains('term-pop')||p.classList.contains('no-gloss')))) return NodeFilter.FILTER_REJECT;
            p = p.parentElement;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var node = walker.nextNode(); if(!node) return;
      var m = node.nodeValue.match(re); if(!m) return;
      var g = DPRGLOSSARY[term];
      var btn = document.createElement('button');
      btn.type='button'; btn.className='term';
      btn.setAttribute('data-def', g.d); btn.setAttribute('data-word', g.w);
      btn.textContent = node.nodeValue.slice(m.index, m.index+m[0].length);
      var frag = document.createDocumentFragment();
      var before = node.nodeValue.slice(0, m.index), after = node.nodeValue.slice(m.index+m[0].length);
      if(before) frag.appendChild(document.createTextNode(before));
      frag.appendChild(btn);
      if(after) frag.appendChild(document.createTextNode(after));
      node.parentNode.replaceChild(frag, node);
    });
  }

  /* ---------------- plain-word definitions ---------------- */
  function initTerms(){
    var terms = [].slice.call(document.querySelectorAll(".term[data-def]"));
    if(!terms.length) return;
    var pop = document.createElement("span");
    pop.className = "term-pop"; pop.setAttribute("role","tooltip");
    pop.id = "term-pop"; document.body.appendChild(pop);
    var sticky = null;

    function place(el){
      var word = el.getAttribute("data-word") || el.textContent.trim();
      pop.innerHTML = '<span class="tp-word"></span>' + escapeHtml(el.getAttribute("data-def")||"");
      pop.querySelector(".tp-word").textContent = word;
      pop.classList.add("is-open");
      var r = el.getBoundingClientRect();
      var pr = pop.getBoundingClientRect();
      var sx = window.scrollX||window.pageXOffset, sy = window.scrollY||window.pageYOffset;
      var left = r.left + sx + r.width/2 - pr.width/2;
      left = Math.max(10+sx, Math.min(left, sx + document.documentElement.clientWidth - pr.width - 10));
      var above = r.top > pr.height + 14;
      var top = above ? (r.top + sy - pr.height - 10) : (r.bottom + sy + 10);
      pop.style.left = left + "px"; pop.style.top = top + "px";
      // arrow (the ::after) — nudge horizontally under the term
      var ax = (r.left + sx + r.width/2) - left - 5;
      pop.style.setProperty("--ax", Math.max(10, Math.min(ax, pr.width-20)) + "px");
      pop.style.setProperty("--ay", above ? "calc(100% - 5px)" : "-5px");
      el.setAttribute("aria-describedby","term-pop");
    }
    function open(el){ place(el); }
    function close(){ pop.classList.remove("is-open"); sticky=null; }

    terms.forEach(function(el){
      if(el.tagName!=="BUTTON"){ el.setAttribute("role","button"); el.setAttribute("tabindex","0"); }
      el.addEventListener("mouseenter", function(){ if(!sticky) open(el); });
      el.addEventListener("mouseleave", function(){ if(!sticky) close(); });
      el.addEventListener("focus", function(){ open(el); });
      el.addEventListener("blur", function(){ if(!sticky) close(); });
      el.addEventListener("click", function(e){ e.preventDefault(); if(sticky===el){ close(); } else { sticky=el; open(el); } });
      el.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); sticky = (sticky===el)?null:el; sticky?open(el):close(); } });
    });
    document.addEventListener("keydown", function(e){ if(e.key==="Escape") close(); });
    document.addEventListener("click", function(e){ if(sticky && !e.target.closest(".term")) close(); });
    window.addEventListener("scroll", function(){ if(!sticky) close(); }, {passive:true});
    window.addEventListener("resize", close, {passive:true});
  }

  /* ---------------- trust-it / check-it sorting game ---------------- */
  var LABELS = {
    trust: 'Trust it as-is',
    check: 'Double-check it'
  };
  function initSortGames(){
    [].slice.call(document.querySelectorAll(".sortgame")).forEach(function(game){
      var items = [].slice.call(game.querySelectorAll(".sg-item[data-answer]"));
      if(!items.length) return;
      game.classList.add("js-on");
      var total = items.length, done = 0, correct = 0, results = [];
      var score = game.querySelector(".sortgame-score");
      items.forEach(function(item){
        var answer = item.getAttribute("data-answer"); // "trust" | "check"
        var why = item.querySelector(".sg-why");
        var choices = document.createElement("div");
        choices.className = "sg-choices";
        ["trust","check"].forEach(function(val){
          var b = document.createElement("button");
          b.type = "button"; b.className = "sg-btn"; b.setAttribute("data-val", val);
          b.innerHTML = (val==="trust"
            ? '<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l2.8 2.8L12.5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            : '<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.3 10.3L14 14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>')
            + '<span>'+LABELS[val]+'</span>';
          b.addEventListener("click", function(){ grade(item, val, answer, why, choices, b); });
          choices.appendChild(b);
        });
        // insert choices before the explanation
        if(why) item.insertBefore(choices, why); else item.appendChild(choices);
      });
      function grade(item, picked, answer, why, choices, btn){
        if(item.classList.contains("is-graded")) return;
        var right = picked===answer;
        item.classList.add("is-graded", right ? "is-correct" : "is-wrong");
        btn.classList.add(right ? "pick-correct" : "pick-wrong");
        [].slice.call(choices.querySelectorAll(".sg-btn")).forEach(function(b){
          b.disabled = true;
          if(!right && b.getAttribute("data-val")===answer) b.classList.add("pick-correct");
        });
        done++; if(right) correct++; results.push(right);
        if(score){
          if(done===total){
            var dots = results.map(function(r){return '<span class="sg-dot '+(r?"ok":"miss")+'"></span>';}).join("");
            score.innerHTML = '<span class="sg-tally" aria-hidden="true">'+dots+'</span> You sorted all '+total+' — <b>'+correct+' right the first time.</b> The rule sticks once you see why.';
          } else {
            score.textContent = done+" of "+total+" sorted";
          }
        }
      }
    });
  }

  function escapeHtml(s){ return (s||"").replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }

  ready(function(){ initGlossary(); initTerms(); initSortGames(); });
})();
