// DPR Labs token lint — enforces the SINGLE-SOURCE bridge contract.
// The root ../tokens.css is the one source of truth; design/dist/tokens.css @imports it and
// adds the styleguide/component BRIDGE (bridge.mjs). This lint proves (exit 1 on any fail):
//   1. No dangling alias — every bridge `var(--x)` resolves to a token defined in the root
//      tokens.css (or to another bridge name).
//   2. No raw palette values in the bridge — a bridge value is either an alias or a plain
//      literal (weight / dimension / transparent), never an inline hex / hsl / rgb colour.
//   3. No cycles — the bridge+root alias graph is a DAG.
//   4. No second accent — the bridge introduces no cool-slate / accent-cool token.
//   5. Consumer coverage — every custom property used by design-language.html and the
//      previews is defined by the root tokens.css OR the bridge (no dangling var on a page).

import { promises as fs } from 'node:fs';
import { BRIDGE } from './bridge.mjs';

const ROOT = '../tokens.css';
const CONSUMERS = ['../design-language.html'];

function parseDefs(css) {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const defs = new Map();
  const re = /(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(noComments)) !== null) if (!defs.has(m[1])) defs.set(m[1], m[2].trim());
  return defs;
}

const PURE_VAR = /^var\(\s*(--[A-Za-z0-9-]+)\s*\)$/;
const LITERAL = /^(transparent|[0-9]+(\.[0-9]+)?(px|rem|em|%)?)$/; // weight / dimension / transparent
const COLOR = /#[0-9a-fA-F]{3,8}\b|\bhsl\(|\brgb\(|\boklch\(/;

const violations = [];
const fail = (rule, where, msg) => violations.push({ rule, where, msg });

const rootDefs = parseDefs(await fs.readFile(ROOT, 'utf8'));
const rootNames = new Set(rootDefs.keys());
const bridgeNames = new Set(BRIDGE.map(([n]) => n));

// Combined universe for resolution (root + bridge).
const defs = new Map(rootDefs);
for (const [n, v] of BRIDGE) defs.set(n, v);

function resolve(raw, seen = []) {
  const v = String(raw).trim();
  const hit = v.match(PURE_VAR);
  if (!hit) return { value: v };
  const name = hit[1];
  if (seen.includes(name)) return { unresolved: name, cycle: [...seen, name] };
  if (!defs.has(name)) return { unresolved: name };
  return resolve(defs.get(name), [...seen, name]);
}

// 1 + 2 + 3 + 4 — per bridge entry
for (const [name, value] of BRIDGE) {
  const isVar = PURE_VAR.test(value);
  if (isVar) {
    const r = resolve(value);
    if (r.unresolved) {
      if (r.cycle) fail('cycle', name, `alias cycle: ${r.cycle.join(' -> ')}`);
      else fail('dangling-alias', name, `references {${r.unresolved}} which no root/bridge token defines`);
    }
  } else if (COLOR.test(value) || !LITERAL.test(value)) {
    fail('raw-value', name, `must alias a root token, not inline "${value}"`);
  }
  if (/slate|accent-cool/i.test(name) || /slate|accent-cool/i.test(value)) {
    fail('second-accent', name, `reintroduces a cool-slate 2nd accent ("${value}") — one amber accent only`);
  }
}

// 5 — consumer coverage: every var(--x) used on a styleguide/preview page must be defined.
const previewFiles = (await fs.readdir('previews').catch(() => [])).filter((f) => f.endsWith('.html')).map((f) => `previews/${f}`);
const pages = [...CONSUMERS, ...previewFiles];
let usedCount = 0;
for (const page of pages) {
  const html = await fs.readFile(page, 'utf8').catch(() => null);
  if (html == null) continue;
  const re = /var\(\s*(--[A-Za-z0-9-]+)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    usedCount++;
    const nm = m[1];
    if (!rootNames.has(nm) && !bridgeNames.has(nm)) {
      fail('page-dangling-var', page, `uses ${nm} which neither root tokens.css nor the bridge defines`);
    }
  }
}

// Report
console.log(`Token lint — single source ${ROOT} (${rootNames.size} tokens) + bridge (${bridgeNames.size} names)`);
console.log(`Checks: dangling-alias, raw-value, cycle, second-accent, page-dangling-var (${usedCount} page var() refs across ${pages.length} page(s))`);

if (violations.length === 0) {
  console.log(`\nPASS — 0 violations. Every bridge alias resolves into the root tokens, the bridge adds no raw palette value or second accent, and no styleguide/preview page references an undefined token.`);
  process.exit(0);
} else {
  console.error(`\nFAIL — ${violations.length} violation(s):`);
  for (const v of violations) console.error(`  [${v.rule}] ${v.where}: ${v.msg}`);
  process.exit(1);
}
