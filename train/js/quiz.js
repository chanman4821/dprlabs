// quiz.js — honest multiple-choice. Known correct answer + per-option explanation.
// No hidden AI score: you see exactly why an answer is right or wrong.
import { Store, KEYS } from './store.js';

// spec: { id, question, options:[{id,text,correct,explain}], required }
// ctx:  { mid, lid, report(compId, passed) }
export function mount(el, spec, ctx) {
  const name = `${ctx.mid}-${ctx.lid}-${spec.id}`;
  el.innerHTML = `
    <fieldset class="tq">
      <legend class="tq-q">${spec.question}</legend>
      <div class="tq-opts">
        ${spec.options.map((o) => `
          <label class="tq-opt">
            <input type="radio" name="${name}" value="${o.id}">
            <span class="tq-txt">${o.text}</span>
            <span class="tq-ex" hidden>${o.explain}</span>
          </label>`).join('')}
      </div>
      <div class="tq-actions">
        <button type="button" class="btn btn-primary tq-check">Check answer</button>
        <span class="tq-status" role="status" aria-live="polite"></span>
      </div>
    </fieldset>`;

  const inputs = [...el.querySelectorAll('input[type=radio]')];
  const status = el.querySelector('.tq-status');

  function renderResult(selId) {
    el.querySelectorAll('.tq-opt').forEach((l) => {
      l.classList.remove('is-correct', 'is-wrong');
      l.querySelector('.tq-ex').hidden = true;
    });
    inputs.forEach((inp) => {
      const o = spec.options.find((x) => x.id === inp.value);
      const label = inp.closest('.tq-opt');
      if (o.correct) label.classList.add('is-correct');
      if (inp.value === selId && !o.correct) label.classList.add('is-wrong');
      if (inp.value === selId) label.querySelector('.tq-ex').hidden = false;
    });
    const chosen = spec.options.find((o) => o.id === selId);
    const passed = !!(chosen && chosen.correct);
    status.textContent = passed ? '\u2713 Correct' : '\u2715 Not quite \u2014 read why, then try again';
    status.className = 'tq-status ' + (passed ? 'ok' : 'no');
    return passed;
  }

  // restore prior attempt
  const saved = (((Store.get(KEYS.quiz, {})[ctx.mid] || {})[ctx.lid] || {})[spec.id]) || null;
  if (saved && saved.selected) {
    const inp = inputs.find((i) => i.value === saved.selected);
    if (inp) { inp.checked = true; const ok = renderResult(saved.selected); if (ok) ctx.report(spec.id, true); }
  }

  el.querySelector('.tq-check').addEventListener('click', () => {
    const sel = inputs.find((i) => i.checked);
    if (!sel) { status.textContent = 'Pick an answer first.'; status.className = 'tq-status no'; return; }
    const passed = renderResult(sel.value);
    const all = Store.get(KEYS.quiz, {});
    all[ctx.mid] = all[ctx.mid] || {};
    all[ctx.mid][ctx.lid] = all[ctx.mid][ctx.lid] || {};
    const prev = all[ctx.mid][ctx.lid][spec.id] || { attempts: 0 };
    all[ctx.mid][ctx.lid][spec.id] = { selected: sel.value, correct: passed, attempts: (prev.attempts || 0) + 1 };
    Store.set(KEYS.quiz, all);
    ctx.report(spec.id, passed);
  });
}
