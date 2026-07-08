// badges.js — award + check module badges.
import { Store, KEYS } from './store.js';

export function hasBadge(id) {
  const b = Store.get(KEYS.badges, {});
  return !!(b[id] && b[id].earned);
}

export function awardBadge(id, mid) {
  const b = Store.get(KEYS.badges, {});
  if (b[id] && b[id].earned) return false;
  b[id] = { earned: true, module: mid, earnedAt: new Date().toISOString() };
  Store.set(KEYS.badges, b);
  return true;
}

export function allBadges() {
  return Store.get(KEYS.badges, {});
}
