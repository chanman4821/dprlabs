// checklist.js — native checkboxes. Passes when all (or spec.min) are ticked.
import { Store, KEYS } from './store.js';

// spec: { id, required, items:[{id,text}], min? }
export function mount(el, spec, ctx) {
  const saved = (((Store.get(KEYS.checklist, {})[ctx.mid] || {})[ctx.lid] || {})[spec.id]) || { items: {} };
  const min = spec.min || spec.items.length;
  el.innerHTML = `<div class="tk"><ul class="tk-list">${spec.items.map((it) => `
    <li class="tk-item"><label><input type="checkbox" data-id="${it.id}"${saved.items && saved.items[it.id] ? ' checked' : ''}> <span>${it.text}</span></label></li>`).join('')}
    </ul><div class="tk-count" role="status" aria-live="polite"></div></div>`;
  const boxes = [...el.querySelectorAll('input[type=checkbox]')];
  const count = el.querySelector('.tk-count');
  function sync() {
    const checked = boxes.filter((b) => b.checked).length;
    count.textContent = `${checked} of ${boxes.length} done`;
    const items = {};
    boxes.forEach((b) => { items[b.dataset.id] = b.checked; });
    const all = Store.get(KEYS.checklist, {});
    all[ctx.mid] = all[ctx.mid] || {}; all[ctx.mid][ctx.lid] = all[ctx.mid][ctx.lid] || {};
    all[ctx.mid][ctx.lid][spec.id] = { items, checked, total: boxes.length };
    Store.set(KEYS.checklist, all);
    ctx.report(spec.id, checked >= min);
  }
  boxes.forEach((b) => b.addEventListener('change', sync));
  sync();
}
