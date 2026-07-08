// progress.js — reads/writes lesson completion + module percent.
import { Store, KEYS } from './store.js';

export function moduleProgress(mid, totalLessons) {
  const p = Store.get(KEYS.progress, {});
  const m = p[mid] || { lessonsComplete: [] };
  const done = (m.lessonsComplete || []).length;
  return {
    done,
    total: totalLessons,
    percent: totalLessons ? Math.round((done / totalLessons) * 100) : 0,
    lessonsComplete: m.lessonsComplete || [],
  };
}

export function lessonComplete(mid, lid) {
  const p = Store.get(KEYS.progress, {});
  return !!(p[mid] && (p[mid].lessonsComplete || []).includes(lid));
}

export function completeLesson(mid, lid, totalLessons) {
  const p = Store.get(KEYS.progress, {});
  const m = p[mid] || { lessonsComplete: [] };
  if (!m.lessonsComplete) m.lessonsComplete = [];
  if (!m.lessonsComplete.includes(lid)) m.lessonsComplete.push(lid);
  m.percent = totalLessons ? Math.round((m.lessonsComplete.length / totalLessons) * 100) : 0;
  m.updatedAt = new Date().toISOString();
  p[mid] = m;
  Store.set(KEYS.progress, p);
  return m;
}
