# design/ — DPR AI unified design tokens (Phase 1)

Owned by `design-token-mgr`. The ONE source of truth is the root **`../tokens.css`**
(graphite dark canvas, single amber accent, Space Grotesk / Inter / JetBrains Mono).
Per DESIGN-LANGUAGE.md §8.5 this folder regenerates `dist/tokens.css` FROM that root file
so there is one token source on disk, not two. Every page and component consumes tokens —
no page hardcodes a hex, a font, or a px size.

## Commands (run inside `design/`)
```
npm run build      # ../tokens.css -> dist/tokens.css (@import root + styleguide/component bridge)
npm run lint       # single-source contract: bridge aliases resolve, no raw/second-accent, page coverage
npm run contrast   # WCAG 2.2 AA gate over the built values (dark-canonical palette)
npm run verify     # lint + build + contrast (the full green gate)
```
No `npm install` is required — the build is dependency-free plain Node, so a fresh checkout
runs `npm run build` with nothing installed.

## Layout
```
bridge.mjs                  the styleguide/component BRIDGE table (names -> root tokens) + audit pairs
build.mjs                   dependency-free build: @import ../../tokens.css + bridge -> dist/tokens.css
lint-tokens.mjs             single-source contract gate (dangling/raw/cycle/second-accent/page coverage)
contrast-audit.mjs          WCAG 2.2 AA gate over dist/tokens.dark.json (dark canonical)
dist/tokens.css             GENERATED — @import root tokens.css + the resolved bridge (do not hand-edit)
dist/tokens.dark.json       GENERATED — flat name -> resolved value map (fed to the contrast audit)
dist/tokens.tailwind.cjs    GENERATED — Tailwind preset bound to the CSS custom properties
tokens/*.json               original W3C DTCG authoring source (kept for provenance; NOT the build input)
palette-derive.py           palette provenance — computes hex + WCAG ratios from HSL
AUDIT.md                    current-site audit — what is inconsistent/cheap/broken (file:line)
DESIGN-LANGUAGE.md          how to use the system (read this first)
MIGRATION.md                old -> new codemod map + what to delete
```

**Palette provenance.** The authoritative palette lives in the root `../tokens.css`
(primitive → semantic → type tiers): graphite canvas `hsl(220 16% 7%)`, one reserved amber
accent (`#F6A328`, hover/focus `#FBC14B`). `dist/tokens.css` never forks those values — it
`@import`s the root file and only bridges the styleguide/component names onto it. Edit the
root `../tokens.css`, then rebuild here; the gates must stay green.

