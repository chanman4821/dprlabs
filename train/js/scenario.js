// scenario.js — branching "what would you do". Passes on reaching an outcome node.
import { Store, KEYS } from './store.js';

// spec: { id, required, start, nodes:{ nodeId:{ text, choices:[{label,to}], outcome? } } }
export function mount(el, spec, ctx) {
  const saved = (((Store.get(KEYS.scenario, {})[ctx.mid] || {})[ctx.lid] || {})[spec.id]) || null;
  let path = (saved && Array.isArray(saved.path) && saved.path.length) ? saved.path.slice() : [spec.start];
  el.innerHTML = `<div class="ts"><div class="ts-trail" aria-hidden="true"></div><div class="ts-node"></div></div>`;
  const nodeEl = el.querySelector('.ts-node');
  const trailEl = el.querySelector('.ts-trail');
  function save(complete) {
    const all = Store.get(KEYS.scenario, {});
    all[ctx.mid] = all[ctx.mid] || {}; all[ctx.mid][ctx.lid] = all[ctx.mid][ctx.lid] || {};
    all[ctx.mid][ctx.lid][spec.id] = { path: path.slice(), currentNode: path[path.length - 1], complete };
    Store.set(KEYS.scenario, all);
  }
  function render() {
    const cur = path[path.length - 1];
    const node = spec.nodes[cur];
    trailEl.textContent = path.length > 1 ? 'Your path: ' + path.join(' \u2192 ') : '';
    const terminal = !node.choices || !node.choices.length;
    nodeEl.innerHTML = `<p class="ts-text">${node.text}</p>` + (terminal
      ? `<p class="ts-outcome">${node.outcome || ''}</p>` + (path.length > 1 ? `<button type="button" class="btn btn-ghost ts-restart">Try again</button>` : '')
      : `<div class="ts-choices">${node.choices.map((c, i) => `<button type="button" class="btn btn-ghost ts-choice" data-i="${i}">${c.label}</button>`).join('')}</div>`);
    if (terminal) {
      ctx.report(spec.id, true); save(true);
      const rb = nodeEl.querySelector('.ts-restart');
      if (rb) rb.addEventListener('click', () => { path = [spec.start]; save(false); render(); });
    } else {
      ctx.report(spec.id, false);
      nodeEl.querySelectorAll('.ts-choice').forEach((b) => b.addEventListener('click', () => {
        path.push(node.choices[+b.dataset.i].to); save(false); render();
      }));
    }
  }
  render();
}
