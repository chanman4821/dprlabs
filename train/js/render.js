// render.js — lesson renderer/dispatcher. Renders prose + interactive blocks,
// tracks required interactives, and reports when all required ones pass.
import * as quiz from './quiz.js';

const REGISTRY = { quiz };

// container: DOM node. lesson: { blocks:[...] }. ctx: { mid, lid }.
// onState({ requiredMet, required }) fires on every change.
export function renderLesson(container, lesson, ctx, onState) {
  container.innerHTML = '';
  const required = new Set();
  const passed = new Set();

  const emit = () => onState({
    required: [...required],
    requiredMet: [...required].every((r) => passed.has(r)),
  });

  (lesson.blocks || []).forEach((block) => {
    const wrap = document.createElement('div');
    wrap.className = 't-block t-' + block.type;
    container.appendChild(wrap);

    if (block.type === 'prose') { wrap.innerHTML = block.html; return; }

    const comp = REGISTRY[block.type];
    if (!comp) {
      wrap.innerHTML = '<p class="t-soon">This exercise type is coming in the next build.</p>';
      return;
    }
    if (block.required) required.add(block.id);
    comp.mount(wrap, block, {
      mid: ctx.mid,
      lid: ctx.lid,
      report: (id, ok) => { if (ok) passed.add(id); else passed.delete(id); emit(); },
    });
  });

  emit();
}
