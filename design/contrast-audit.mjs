// DPR Labs contrast audit — WCAG 2.2 gate over the BUILT token values (dist/tokens.*.json).
// Runs the same pairing set against dark (:root) and light ([data-theme="light"]) because
// each role name resolves to its per-mode value. Thresholds:
//   body text  >= 4.5:1   |   large text / UI components / focus / borders >= 3.0:1
// Exit 1 on any failure. No hand-entered ratios — every number is computed here from the hex.

import { promises as fs } from 'node:fs';

const dark = JSON.parse(await fs.readFile('dist/tokens.dark.json', 'utf8'));
const light = JSON.parse(await fs.readFile('dist/tokens.light.json', 'utf8'));
// Light JSON only carries the semantic overrides + palette; fall back to dark for shared roles.
const lightFull = { ...dark, ...light };

function toRgb(hex) {
  const h = hex.trim().replace('#', '');
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

// Pairing set (role names resolve per mode). kind => threshold.
const BODY = 4.5, UI = 3.0;
const pairs = [
  // Text on the page canvas
  ['text-primary on bg',        'color-text-primary',   'color-bg', BODY],
  ['text-secondary on bg',      'color-text-secondary', 'color-bg', BODY],
  ['text-tertiary on bg',       'color-text-tertiary',  'color-bg', BODY],
  ['the-number on bg',          'color-number',         'color-bg', BODY],
  ['link on bg',                'color-link',           'color-bg', BODY],
  ['accent-text on bg',         'color-accent-text',    'color-bg', BODY],
  ['status-positive on bg',     'color-status-positive','color-bg', BODY],
  ['status-critical on bg',     'color-status-critical','color-bg', BODY],
  // Text on a raised surface
  ['text-primary on surface',   'color-text-primary',   'color-surface', BODY],
  ['text-secondary on surface', 'color-text-secondary', 'color-surface', BODY],
  // Text sitting on an amber fill
  ['on-accent on accent fill',  'color-text-on-accent', 'color-accent',       BODY],
  ['on-accent on accent-hover', 'color-text-on-accent', 'color-accent-hover', BODY],
  ['on-accent-cool on cool chip','color-text-on-accent-cool','color-accent-cool', BODY],
  ['on-danger on danger fill',  'color-text-on-danger', 'color-danger',       BODY],
  ['selection text on selection', 'color-selection-text','color-selection-bg', BODY],
  // Cool slate accent as TEXT/graphic on the page canvas (flips per mode)
  ['accent-cool text on bg',    'color-accent-secondary','color-bg', BODY],
  // UI / graphic / focus / border (>= 3:1)
  ['status-positive-ui on bg',  'color-status-positive-ui','color-bg', UI],
  ['status-critical-ui on bg',  'color-status-critical-ui','color-bg', UI],
  ['focus ring on bg',          'color-focus',          'color-bg', UI],
  ['interactive border on bg',  'color-border-interactive','color-bg', UI],
  ['interactive border on surface','color-border-interactive','color-surface', UI],
];

function runMode(name, map) {
  console.log(`\n=== ${name} mode ===`);
  console.log('pair'.padEnd(32) + 'ratio'.padEnd(9) + 'min'.padEnd(6) + 'result');
  let failed = 0;
  for (const [label, fgKey, bgKey, min] of pairs) {
    const fg = map[fgKey], bg = map[bgKey];
    if (!fg || !bg) throw new Error(`missing token ${fgKey} or ${bgKey} in ${name}`);
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

const failDark = runMode('DARK (:root)', dark);
const failLight = runMode('LIGHT ([data-theme=light])', lightFull);
const total = failDark + failLight;

console.log(`\n${pairs.length * 2} pairings checked across 2 modes.`);
if (total === 0) {
  console.log('PASS — every text/bg and UI pairing meets WCAG 2.2 AA in both modes.');
  process.exit(0);
} else {
  console.error(`FAIL — ${total} pairing(s) below threshold.`);
  process.exit(1);
}
