// DPR Labs contrast audit — WCAG 2.2 AA gate over the BUILT token values (dist/tokens.*.json).
// The system is dark-canonical (root tokens.css sets color-scheme: dark), so the pairing set
// runs against the single graphite + amber palette. Thresholds:
//   body text >= 4.5:1   |   large text / UI component / focus / border >= 3.0:1
// Exit 1 on any failure. No hand-entered ratios — every number is computed here from the hex.

import { promises as fs } from 'node:fs';
import { CONTRAST_PAIRS, BODY, UI } from './bridge.mjs';

const dark = JSON.parse(await fs.readFile('dist/tokens.dark.json', 'utf8'));
const light = JSON.parse(await fs.readFile('dist/tokens.light.json', 'utf8'));

function toRgb(hex) {
  const h = String(hex).trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`not a hex color: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
const lin = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lum = (hex) => {
  const [r, g, b] = toRgb(hex);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const l1 = lum(a), l2 = lum(b);
  const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
};

function runPairs(map) {
  console.log('pair'.padEnd(32) + 'ratio'.padEnd(9) + 'min'.padEnd(6) + 'result');
  let failed = 0;
  for (const [label, fgKey, bgKey, min] of CONTRAST_PAIRS) {
    const fg = map[fgKey], bg = map[bgKey];
    if (!fg || !bg) throw new Error(`missing token ${fgKey} or ${bgKey}`);
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(
      label.padEnd(32) +
        (r.toFixed(2) + ':1').padEnd(9) +
        (min.toFixed(1)).padEnd(6) +
        (ok ? 'PASS' : 'FAIL <-- below threshold'),
    );
  }
  return failed;
}

console.log(`=== DARK (:root) — canonical palette · thresholds body ${BODY}:1 / UI ${UI}:1 ===`);
const failed = runPairs(dark);

// Dark is canonical; the light artifact must mirror it (no divergent second palette on disk).
const parity = JSON.stringify(dark) === JSON.stringify(light);
console.log(`\nmode-parity: dist/tokens.light.json ${parity ? 'mirrors' : 'DIVERGES FROM'} dist/tokens.dark.json (dark-canonical)`);

console.log(`\n${CONTRAST_PAIRS.length} pairings checked.`);
if (failed === 0 && parity) {
  console.log('PASS — every text/bg and UI pairing meets WCAG 2.2 AA, and the light artifact mirrors dark.');
  process.exit(0);
} else {
  if (failed) console.error(`FAIL — ${failed} pairing(s) below threshold.`);
  if (!parity) console.error('FAIL — light artifact diverges from the canonical dark palette.');
  process.exit(1);
}
