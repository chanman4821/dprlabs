// builder.js — guided fields assemble a prompt from a template, saved to the library.
import { Store, KEYS } from './store.js';

// spec: { id, required, title, fields:[{id,label,hint,placeholder}], template }
export function mount(el, spec, ctx) {
  el.innerHTML = `<div class="tb">
      <div class="tb-fields">${spec.fields.map((f) => `
        <div class="tb-field"><label>${f.label}${f.hint ? ` <span class="tb-hint">${f.hint}</span>` : ''}</label>
        <input type="text" data-id="${f.id}" placeholder="${f.placeholder || ''}"></div>`).join('')}</div>
      <div class="tb-out">
        <div class="tb-preview" aria-live="polite"><span class="tb-empty">Fill the fields and hit Build.</span></div>
        <div class="tb-actions"><button type="button" class="btn btn-primary tb-build">Build &amp; save</button><span class="tb-status" role="status" aria-live="polite"></span></div>
      </div>
    </div>`;
  const inputs = [...el.querySelectorAll('.tb-field input')];
  const preview = el.querySelector('.tb-preview');
  const status = el.querySelector('.tb-status');
  function assemble() {
    const vals = {};
    inputs.forEach((i) => { vals[i.dataset.id] = i.value.trim(); });
    let out = spec.template;
    Object.keys(vals).forEach((k) => { out = out.replace(new RegExp('\\{' + k + '\\}', 'g'), vals[k] || `[${k}]`); });
    return { out, complete: inputs.every((i) => i.value.trim()) };
  }
  el.querySelector('.tb-build').addEventListener('click', () => {
    const { out, complete } = assemble();
    preview.textContent = out;
    if (!complete) {
      status.textContent = 'Fill every field for the strongest prompt.'; status.className = 'tb-status no';
      ctx.report(spec.id, false); return;
    }
    status.textContent = '\u2713 Built and saved to your library'; status.className = 'tb-status ok';
    const lib = Store.get(KEYS.library, []);
    const arr = Array.isArray(lib) ? lib : [];
    if (!arr.length || arr[0].prompt !== out) {
      arr.unshift({ id: String(Date.now()), module: ctx.mid, title: spec.title || 'Saved prompt', prompt: out, savedAt: new Date().toISOString() });
      Store.set(KEYS.library, arr.slice(0, 100));
    }
    ctx.report(spec.id, true);
  });
}
