// DPR Labs token lint — enforces the tier contract on the DTCG SOURCE (tokens/*.json).
// Gates (exit 1 on any violation):
//   1. No dangling refs   — every {alias} resolves to a defined token path.
//   2. No cycles          — the alias graph is a DAG.
//   3. No raw values above the primitive tier — every semantic/component token value
//      is a pure single {alias}, never an inline hex/px/rem.
//   4. One direction only — semantic COLOR -> palette (primitive); component COLOR ->
//      color (semantic), never straight to a palette primitive.
// This is independent of the Style Dictionary build and catches issues SD does not.

import { promises as fs } from 'node:fs';

const FILES = [
  'tokens/primitive.json',
  'tokens/semantic.json',
  'tokens/semantic.light.json',
  'tokens/component.json',
];
const isPrimitive = (fp) => fp.endsWith('primitive.json');
const isSemantic = (fp) => fp.endsWith('semantic.json') || fp.endsWith('semantic.light.json');
const isComponent = (fp) => fp.endsWith('component.json');

const REF = /\{([^}]+)\}/g;
const PURE_ALIAS = /^\{[^}]+\}$/;

function flatten(obj, filePath, prefix = [], inheritedType = null, out = []) {
  const type = obj.$type || inheritedType;
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    if (val && typeof val === 'object' && '$value' in val) {
      out.push({
        path: [...prefix, key].join('.'),
        value: String(val.$value),
        type: val.$type || type,
        filePath,
      });
    } else if (val && typeof val === 'object') {
      flatten(val, filePath, [...prefix, key], type, out);
    }
  }
  return out;
}

function refsOf(value) {
  const out = [];
  let m;
  REF.lastIndex = 0;
  while ((m = REF.exec(value)) !== null) out.push(m[1].trim());
  return out;
}

const violations = [];
const fail = (rule, path, msg) => violations.push({ rule, path, msg });

const tokens = [];
for (const f of FILES) {
  const json = JSON.parse(await fs.readFile(f, 'utf8'));
  flatten(json, f, [], null, tokens);
}

// Defined-path universe (union across modes).
const defined = new Set(tokens.map((t) => t.path));
const byPath = new Map();
for (const t of tokens) if (!byPath.has(t.path)) byPath.set(t.path, t);

// 1 + 3 + 4 — per-token checks
for (const t of tokens) {
  const refs = refsOf(t.value);

  // 1. dangling
  for (const r of refs) {
    if (!defined.has(r)) fail('dangling-ref', t.path, `references undefined token {${r}}`);
  }

  const higherTier = isSemantic(t.filePath) || isComponent(t.filePath);
  if (higherTier) {
    // 3. no raw values above primitive tier — must be a single pure alias
    if (!PURE_ALIAS.test(t.value.trim())) {
      fail('raw-value', t.path, `inlines a raw value "${t.value}" instead of aliasing a lower tier`);
    }
    // 4. direction (color only)
    if (t.type === 'color' && refs.length === 1) {
      const target = refs[0];
      if (isSemantic(t.filePath) && !target.startsWith('palette.')) {
        fail('direction', t.path, `semantic color must alias a palette primitive, got {${target}}`);
      }
      if (isComponent(t.filePath)) {
        if (target.startsWith('palette.')) {
          fail('direction', t.path, `component color must alias a SEMANTIC role, not a palette primitive {${target}}`);
        } else if (!target.startsWith('color.')) {
          fail('direction', t.path, `component color must alias a color.* semantic role, got {${target}}`);
        }
      }
    }
  } else if (isPrimitive(t.filePath)) {
    // primitives must NOT contain aliases (raw values only)
    if (refs.length > 0) fail('primitive-alias', t.path, `primitive tokens must be raw, found alias in "${t.value}"`);
  }
}

// 2. cycles — DFS over the alias graph
const WHITE = 0, GRAY = 1, BLACK = 2;
const color = new Map([...defined].map((p) => [p, WHITE]));
const edges = (p) => (byPath.has(p) ? refsOf(byPath.get(p).value).filter((r) => defined.has(r)) : []);
const stack = [];
function dfs(p) {
  color.set(p, GRAY);
  stack.push(p);
  for (const n of edges(p)) {
    if (color.get(n) === GRAY) {
      const i = stack.indexOf(n);
      fail('cycle', p, `alias cycle: ${[...stack.slice(i), n].join(' -> ')}`);
    } else if (color.get(n) === WHITE) {
      dfs(n);
    }
  }
  stack.pop();
  color.set(p, BLACK);
}
for (const p of defined) if (color.get(p) === WHITE) dfs(p);

// Report
const total = tokens.length;
const semN = tokens.filter((t) => isSemantic(t.filePath)).length;
const compN = tokens.filter((t) => isComponent(t.filePath)).length;
console.log(`Token lint — ${total} tokens (${tokens.length - semN - compN} primitive, ${semN} semantic, ${compN} component)`);
console.log(`Checks: dangling-ref, cycle, raw-value(no inline above primitive), direction(one-way)`);

if (violations.length === 0) {
  console.log(`\nPASS — 0 violations. All aliases resolve, graph is a DAG, no raw values or wrong-direction aliases above the primitive tier.`);
  process.exit(0);
} else {
  console.error(`\nFAIL — ${violations.length} violation(s):`);
  for (const v of violations) console.error(`  [${v.rule}] ${v.path}: ${v.msg}`);
  process.exit(1);
}
