# design/ — DPR Labs unified design tokens (Phase 1)

Owned by `design-token-mgr`. The ONE source of truth for color, type, space, radius,
elevation, and motion. Every page and component consumes `dist/tokens.css` — no page
hardcodes a hex, a font, or a px size.

## Commands (run inside `design/`)
```
npm install        # once — installs Style Dictionary
npm run build      # DTCG JSON -> dist/tokens.css (+ flat JSON + Tailwind preset)
npm run lint       # alias contract: no dangling/cyclic/raw/wrong-direction tokens
npm run contrast   # WCAG 2.2 AA gate over built values, dark + light
npm run verify     # lint + build + contrast (the full green gate)
```

## Layout
```
tokens/primitive.json       tier 1 — raw palette + scales (the only place a hex lives)
tokens/semantic.json        tier 2 — color roles, DARK (default)
tokens/semantic.light.json  tier 2 — color roles, LIGHT (same paths -> mode completeness)
tokens/component.json       tier 3 — per-component tokens (alias semantic roles)
build.mjs                   Style Dictionary build (+ shadcn/ui HSL-triplet compat layer)
lint-tokens.mjs             tier-contract gate
contrast-audit.mjs          WCAG 2.2 gate (42 pairings, dark + light)
palette-derive.py           palette provenance — computes every hex + WCAG ratio from HSL
dist/tokens.css             THE single token file (:root dark + [data-theme=light] + reduced-motion)
AUDIT.md                    current-site audit — what is inconsistent/cheap/broken (file:line)
DESIGN-LANGUAGE.md          how to use the system (read this first)
MIGRATION.md                old -> new codemod map + what to delete
```

**Palette provenance.** Values are the DPR Labs brief (Direction B): warm canvas `30 9% 7%`, amber
primary `36 86% 56%`, cool slate accent `205 22% 64%`, body Inter. `python palette-derive.py` re-derives
every hex from HSL and prints the computed WCAG ratios (it reuses `../artifacts/color_science.py`, so no
color math is duplicated). shadcn parts read `hsl(var(--primary))`; hand-written CSS reads `--color-*`.

Edit tokens in `tokens/*.json`, never `dist/`. Rebuild and the gates must stay green.
