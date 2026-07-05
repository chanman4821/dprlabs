// DPR Labs design-token build — SINGLE SOURCE OF TRUTH = the root ../../tokens.css.
//
// Per DESIGN-LANGUAGE.md §8.5 the design/ output is regenerated FROM the root tokens.css
// so there is ONE token source on disk, not two. This build no longer forks a Style
// Dictionary palette (the old warm-paper + cool-slate second accent). It is dependency
// free (plain Node) so a fresh checkout runs `npm run build` with nothing installed.
//
// It emits:
//   dist/tokens.css          @import "../../tokens.css" + the styleguide/component BRIDGE
//   dist/tokens.dark.json     flat name -> resolved value map (dark canonical)
//   dist/tokens.light.json    same map (dark is canonical; light mirrors until authored)
//   dist/tokens.tailwind.cjs  Tailwind preset bound to the CSS custom properties
//
// Every BRIDGE alias is resolved against the root tokens before writing; an unresolved
// reference throws — that is the "0 dangling refs" build proof.

import { promises as fs } from 'node:fs';
import { BRIDGE } from './bridge.mjs';

// SOURCE_PATH: read the root token file from this script's cwd (design/).
// IMPORT_PATH: the @import string written INTO design/dist/tokens.css, resolved relative
// to that emitted file's location (design/dist/) -> two levels up to the repo root.
const SOURCE_PATH = '../tokens.css';
const IMPORT_PATH = '../../tokens.css';
const DIST = 'dist';

// ---- parse the root token file -> { name: rawValue } (first definition wins) ----------
function parseRootTokens(css) {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const defs = new Map();
  const re = /(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(noComments)) !== null) {
    const name = m[1];
    if (!defs.has(name)) defs.set(name, m[2].trim());
  }
  return defs;
}

const PURE_VAR = /^var\(\s*(--[A-Za-z0-9-]+)\s*\)$/;

// Resolve a raw value to its terminal literal by following pure `var(--x)` chains through
// the combined (root + bridge) definitions. Returns { value } or { unresolved }.
function makeResolver(defs) {
  return function resolve(raw, seen = []) {
    const v = String(raw).trim();
    const hit = v.match(PURE_VAR);
    if (!hit) return { value: v };
    const name = hit[1];
    if (seen.includes(name)) return { unresolved: name, cycle: [...seen, name] };
    if (!defs.has(name)) return { unresolved: name };
    return resolve(defs.get(name), [...seen, name]);
  };
}

async function build() {
  const rootCss = await fs.readFile(SOURCE_PATH, 'utf8');
  const rootDefs = parseRootTokens(rootCss);
  console.log(`Parsed ${rootDefs.size} custom properties from ${SOURCE_PATH} (the single source of truth).`);

  // Combined definition universe = root tokens + the bridge aliases.
  const defs = new Map(rootDefs);
  for (const [name, value] of BRIDGE) defs.set(name, value);
  const resolve = makeResolver(defs);

  // ---- BUILD PROOF: every bridge alias must resolve into the root tokens -------------
  const dangling = [];
  for (const [name, value] of BRIDGE) {
    const r = resolve(value);
    if (r.unresolved) {
      dangling.push(`${name}: ${value} -> unresolved {${r.unresolved}}${r.cycle ? ` (cycle ${r.cycle.join(' -> ')})` : ''}`);
    }
  }
  if (dangling.length) {
    throw new Error(`bridge has ${dangling.length} unresolved reference(s):\n  ${dangling.join('\n  ')}`);
  }
  console.log(`OK  bridge: ${BRIDGE.length} styleguide/component names, every alias resolves into ${SOURCE_PATH} (0 dangling).`);

  // ---- emit dist/tokens.css (import + bridge) ----------------------------------------
  const banner =
    `/* =====================================================================\n` +
    `   DPR Labs — design/dist/tokens.css  (GENERATED — do NOT hand-edit)\n` +
    `   Regenerate: npm run build  (dependency-free; edits here are overwritten).\n` +
    `   SINGLE SOURCE OF TRUTH is the root ../../tokens.css. This file imports it\n` +
    `   and only bridges the styleguide/component NAMES that design-language.html\n` +
    `   and the previews consume onto those authoritative tokens. ONE palette:\n` +
    `   graphite canvas + single amber accent. Do NOT reintroduce a second\n` +
    `   (warm-paper / cool-slate) palette here — see DESIGN-LANGUAGE.md §8.5.\n` +
    `   ===================================================================== */\n`;
  const bridgeLines = BRIDGE.map(([name, value]) => `  ${name}: ${value};`).join('\n');
  const cssOut =
    `${banner}@import url("${IMPORT_PATH}");\n\n` +
    `:root {\n` +
    `  /* Bridge: styleguide/component names -> authoritative root tokens. */\n` +
    `${bridgeLines}\n` +
    `}\n`;
  await fs.writeFile(`${DIST}/tokens.css`, cssOut, 'utf8');

  // ---- resolved flat map (root tokens + bridge), for contrast audit + tailwind -------
  const flat = {};
  for (const name of defs.keys()) {
    const r = resolve(defs.get(name));
    if (!r.unresolved) flat[name.replace(/^--/, '')] = r.value; // key without leading --
  }
  const flatJson = JSON.stringify(flat, null, 2) + '\n';
  await fs.writeFile(`${DIST}/tokens.dark.json`, flatJson, 'utf8');
  // Dark is canonical (color-scheme: dark). The light artifact mirrors it until a light
  // theme is authored, so mode-parity holds and no divergent palette lives on disk.
  await fs.writeFile(`${DIST}/tokens.light.json`, flatJson, 'utf8');

  // ---- Tailwind preset bound to the CSS custom properties (mode-adaptive) ------------
  const pick = (prefix) =>
    Object.keys(flat)
      .filter((k) => k.startsWith(prefix))
      .reduce((o, k) => { o[k.slice(prefix.length)] = `var(--${k})`; return o; }, {});
  const preset = {
    theme: {
      extend: {
        colors: pick('color-'),
        borderRadius: pick('radius-'),
        spacing: pick('space-'),
        fontFamily: { display: 'var(--font-display)', body: 'var(--font-body)', mono: 'var(--font-mono)' },
        transitionTimingFunction: { standard: 'var(--ease)', out: 'var(--ease-out)', in: 'var(--ease-in)' },
        zIndex: pick('z-'),
      },
    },
  };
  await fs.writeFile(
    `${DIST}/tokens.tailwind.cjs`,
    `// GENERATED by design/build.mjs — Tailwind preset bound to CSS custom properties.\nmodule.exports = ${JSON.stringify(preset, null, 2)};\n`,
    'utf8',
  );

  console.log(`OK  wrote ${DIST}/tokens.css  (@import ${IMPORT_PATH} + ${BRIDGE.length} bridge properties)`);
  console.log(`OK  wrote ${DIST}/tokens.dark.json, ${DIST}/tokens.light.json (${Object.keys(flat).length} resolved tokens), ${DIST}/tokens.tailwind.cjs`);
}

build().catch((err) => {
  console.error('\nBUILD FAILED:', err.message);
  process.exit(1);
});
