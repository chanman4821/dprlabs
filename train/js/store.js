// store.js — tiny, safe localStorage wrapper. One versioned key per concern.
export const KEYS = {
  progress: 'dpr_progress_v1',
  quiz: 'dpr_quiz_v1',
  badges: 'dpr_badges_v1',
  library: 'dpr_prompt_library_v1',
  critique: 'dpr_critique_v1',
  compare: 'dpr_compare_v1',
  scenario: 'dpr_scenario_v1',
  checklist: 'dpr_checklist_v1',
};

export const Store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* quota / private mode */ }
  },
  remove(key) { try { localStorage.removeItem(key); } catch (e) {} },
};
