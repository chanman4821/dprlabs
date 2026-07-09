// compare.js — two panes + a "reveal why" toggle. Passes once revealed.
import { Store, KEYS } from './store.js';

// spec: { id, required, left:{label,text}, right:{label,text}, why:[...] }
export function mount(el, spec, ctx) {
  const saved = (((Store.get(KEYS.compare, {})[ctx.mid] || {})[ctx.lid] || {})[spec.id]) || {};
  el.innerHTML = `<div class="tc">
      <div class="tc-panes">
        <div class="tc-pane tc-bad"><span class="tc-lbl">${spec.left.label}</span><p>${spec.left.text}</p></div>
        <div class="tc-pane tc-good"><span class="tc-lbl">${spec.right.label}</span><p>${spec.right.text}</p></div>
      </div>
      <button type="button" class="btn btn-ghost tc-reveal" aria-expanded="false">Reveal why</button>
      <div class="tc-why" hidden><ul>${spec.why.map((w) => `<li>${w}</li>`).join('')}</ul></div>
    </div>`;
  const btn = el.querySelector('.tc-reveal');
  const why = el.querySelector('.tc-why');
  function reveal() {
    why.hidden = false; btn.setAttribute('aria-expanded', 'true'); btn.textContent = 'Hide why';
    const all = Store.get(KEYS.compare, {});
    all[ctx.mid] = all[ctx.mid] || {}; all[ctx.mid][ctx.lid] = all[ctx.mid][ctx.lid] || {};
    all[ctx.mid][ctx.lid][spec.id] = { revealed: true, viewedAt: new Date().toISOString() };
    Store.set(KEYS.compare, all);
    ctx.report(spec.id, true);
  }
  btn.addEventListener('click', () => {
    if (why.hidden) { reveal(); }
    else { why.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Reveal why'; }
  });
  if (saved.revealed) reveal();
}
