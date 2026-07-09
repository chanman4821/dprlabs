// critique.js — type a prompt, check it against VISIBLE rules (regex). No hidden score.
import { Store, KEYS } from './store.js';

// spec: { id, required, placeholder, rules:[{id,label,pattern,flags?}], min? }
export function mount(el, spec, ctx) {
  const saved = (((Store.get(KEYS.critique, {})[ctx.mid] || {})[ctx.lid] || {})[spec.id]) || {};
  const escaped = saved.text ? saved.text.replace(/</g, '&lt;') : '';
  el.innerHTML = `<div class="tcr">
      <textarea class="tcr-in" rows="4" placeholder="${spec.placeholder || 'Write your prompt here…'}">${escaped}</textarea>
      <div class="tcr-actions"><button type="button" class="btn btn-primary tcr-check">Check it</button><span class="tcr-score" role="status" aria-live="polite"></span></div>
      <ul class="tcr-rules" hidden>${spec.rules.map((r) => `<li class="tcr-rule" data-id="${r.id}"><span class="tcr-ico"></span><span>${r.label}</span></li>`).join('')}</ul>
    </div>`;
  const ta = el.querySelector('.tcr-in');
  const rulesEl = el.querySelector('.tcr-rules');
  const score = el.querySelector('.tcr-score');
  const min = spec.min || spec.rules.length;
  function run() {
    const text = ta.value;
    let passed = 0;
    const rules = {};
    spec.rules.forEach((r) => {
      let ok = false;
      try { ok = new RegExp(r.pattern, r.flags || 'i').test(text); } catch (e) { ok = false; }
      rules[r.id] = ok;
      const li = rulesEl.querySelector(`[data-id="${r.id}"]`);
      li.classList.toggle('ok', ok); li.classList.toggle('no', !ok);
      li.querySelector('.tcr-ico').textContent = ok ? '\u2713' : '\u2715';
      if (ok) passed++;
    });
    rulesEl.hidden = false;
    score.textContent = `${passed}/${spec.rules.length} rules met`;
    const all = Store.get(KEYS.critique, {});
    all[ctx.mid] = all[ctx.mid] || {}; all[ctx.mid][ctx.lid] = all[ctx.mid][ctx.lid] || {};
    all[ctx.mid][ctx.lid][spec.id] = { text, rules, passed, total: spec.rules.length };
    Store.set(KEYS.critique, all);
    ctx.report(spec.id, passed >= min);
  }
  el.querySelector('.tcr-check').addEventListener('click', run);
  if (saved.text) run();
}
