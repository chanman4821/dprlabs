// promptlab.js — "show, don't tell" visual: filling the 4 prompt parts live-transforms
// a mock AI answer from red slop to green usable, with a quality meter. No AI call —
// the outputs are authored examples so the cause→effect is honest and instant.
// spec: {
//   id, required,
//   parts:[{id,label,hint,placeholder}],           // exactly the 4 parts, in order
//   template:"You are a {role}. ...",               // colored assembly
//   levels:[{tag,tone,text}]                        // length 5: index = # of filled parts (0..4)
// }
export function mount(el, spec, ctx) {
  const parts = spec.parts || [];
  const levels = spec.levels || [];
  const COLORS = ['#3b5bdb', '#1a9e6a', '#c25e00', '#8a3ffc']; // role, context, task, format

  el.innerHTML = `<div class="pl">
    <div class="pl-left">
      <p class="pl-cap">Fill each part. Watch the answer on the right change as you go.</p>
      <div class="pl-fields">
        ${parts.map((p, i) => `
          <div class="pl-field" data-part="${p.id}">
            <span class="pl-dot" style="--c:${COLORS[i] || '#3b5bdb'}"></span>
            <label>${p.label}<span class="pl-hint">${p.hint || ''}</span>
              <input type="text" data-id="${p.id}" placeholder="${p.placeholder || ''}" autocomplete="off">
            </label>
            <span class="pl-check" aria-hidden="true">✓</span>
          </div>`).join('')}
      </div>
      <div class="pl-prompt" aria-live="polite"><span class="pl-prompt-lbl">Your prompt</span><span class="pl-prompt-txt"></span></div>
    </div>
    <div class="pl-right">
      <div class="pl-meter" role="img" aria-label="Prompt quality">
        <div class="pl-meter-bar"><span class="pl-meter-fill"></span></div>
        <span class="pl-meter-tag">Empty</span>
      </div>
      <div class="pl-out" data-tone="empty">
        <span class="pl-out-lbl">What the AI sends back</span>
        <div class="pl-out-body" aria-live="polite"><p class="pl-out-empty">Fill a box on the left to see the answer.</p></div>
      </div>
    </div>
  </div>`;

  const inputs = [...el.querySelectorAll('.pl-field input')];
  const promptTxt = el.querySelector('.pl-prompt-txt');
  const fill = el.querySelector('.pl-meter-fill');
  const tag = el.querySelector('.pl-meter-tag');
  const outBox = el.querySelector('.pl-out');
  const outBody = el.querySelector('.pl-out-body');

  function esc(s) { return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

  function render() {
    const vals = {};
    let count = 0;
    inputs.forEach((inp, i) => {
      const v = inp.value.trim();
      vals[inp.dataset.id] = v;
      const field = inp.closest('.pl-field');
      if (v) { field.classList.add('on'); count++; } else field.classList.remove('on');
    });

    // colored assembled prompt
    let html = esc(spec.template || '');
    parts.forEach((p, i) => {
      const c = COLORS[i] || '#3b5bdb';
      const v = vals[p.id];
      const chip = v
        ? `<b style="color:${c}">${esc(v)}</b>`
        : `<i class="pl-slot" style="--c:${c}">${esc(p.placeholder || p.label.toLowerCase())}</i>`;
      html = html.replace('{' + p.id + '}', chip);
    });
    promptTxt.innerHTML = html;

    // meter
    const pct = (count / parts.length) * 100;
    fill.style.width = pct + '%';
    const lvl = levels[count] || levels[levels.length - 1] || { tag: '', tone: 'empty', text: '' };
    fill.style.background = ({ bad: '#d64545', mid: '#c25e00', good: '#1a9e6a', empty: '#c9ced6' }[lvl.tone]) || '#c9ced6';
    tag.textContent = lvl.tag || (count ? '' : 'Empty');

    // output
    outBox.setAttribute('data-tone', count ? lvl.tone : 'empty');
    if (!count) {
      outBody.innerHTML = '<p class="pl-out-empty">Fill a box on the left to see the answer.</p>';
    } else {
      outBody.innerHTML = lvl.text;
    }

    ctx.report(spec.id, count === parts.length);
  }

  inputs.forEach((inp) => inp.addEventListener('input', render));
  render();
}
