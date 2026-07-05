// DPR Labs — token BRIDGE (single source of truth = the root ../../tokens.css).
//
// design-language.html and design/previews/*.html consume design/dist/tokens.css using
// a handful of styleguide/component names (e.g. --fs-body, --font-numeric,
// --color-accent-text, --button-primary-bg) that the authoritative root tokens.css does
// not name directly. Rather than fork a SECOND palette, we @import the root file and add
// this thin bridge that points every styleguide/component name at the authoritative root
// token it means. ONE palette on disk (graphite + single amber); no warm-paper, no
// cool-slate 2nd accent.
//
// Each entry is [name, value]. A value is either `var(--root-token)` (an alias that MUST
// resolve to a token defined in root tokens.css, or to another bridge name) or a literal
// (a weight, a dimension, or `transparent`). build.mjs writes these; lint-tokens.mjs
// proves every alias resolves and that the bridge adds no raw hex / second accent.

export const BRIDGE = [
  // ── Type scale (styleguide names -> authoritative fluid scale) ──────────────
  ['--fs-body',     'var(--fs-sm)'],
  ['--fs-lead',     'var(--fs-md)'],
  ['--fs-caption',  'var(--fs-xs)'],
  ['--fs-small',    'var(--fs-xs)'],
  ['--fs-h3',       'var(--fs-lg)'],
  ['--fs-h5',       'var(--fs-md)'],
  ['--lh-heading',  'var(--lh-tight)'],
  ['--font-numeric','var(--fvn-tabular)'],
  ['--fw-medium',   '500'],
  ['--fw-semibold', '600'],
  ['--fw-bold',     '700'],

  // ── Motion / layout / focus aliases ─────────────────────────────────────────
  ['--ease-standard',     'var(--ease)'],
  ['--layout-nav-height', 'var(--layout-nav-h)'],
  ['--space-hair',        'var(--space-3xs)'],
  ['--focus-ring-color',  'var(--color-focus)'],
  ['--focus-ring-width',  'var(--space-3xs)'],  /* 2px hairline ring        */
  ['--focus-ring-offset', 'var(--space-2xs)'],  /* 4px gap                  */

  // ── Colour roles (single amber accent; slate 2nd accent purged -> warm) ─────
  ['--color-surface-raised',     'var(--color-surface-high)'],
  ['--color-border-interactive', 'var(--color-border-ui)'],
  ['--color-accent-secondary',   'var(--color-accent-2)'],   /* was cool slate; now warm orange */
  ['--color-accent-text',        'var(--color-accent)'],     /* amber as text/icon on canvas    */
  ['--color-status-positive',    'var(--color-positive)'],
  ['--color-status-positive-ui', 'var(--color-positive)'],
  ['--color-status-critical',    'var(--color-danger)'],
  ['--color-status-critical-ui', 'var(--color-danger)'],
  ['--color-status-attention',   'var(--color-accent)'],

  // ── Button component tokens ─────────────────────────────────────────────────
  ['--button-primary-bg',       'var(--color-btn-primary-bg)'],
  ['--button-primary-bg-hover', 'var(--color-btn-primary-hover)'],
  ['--button-primary-text',     'var(--color-btn-primary-text)'],
  ['--button-primary-radius',   'var(--radius-sm)'],
  ['--button-primary-pad-x',    'var(--space-lg)'],
  ['--button-primary-pad-y',    'var(--space-sm)'],
  ['--button-secondary-bg',       'transparent'],
  ['--button-secondary-bg-hover', 'var(--color-surface-high)'],
  ['--button-secondary-border',   'var(--color-btn-ghost-border)'],
  ['--button-secondary-text',     'var(--color-btn-ghost-text)'],

  // ── Input component tokens ──────────────────────────────────────────────────
  ['--input-bg',           'var(--color-bg-sunken)'],
  ['--input-border',       'var(--color-border-ui)'],   /* interactive outline >=3:1 */
  ['--input-border-focus', 'var(--color-focus)'],
  ['--input-text',         'var(--color-text-primary)'],
  ['--input-placeholder',  'var(--color-text-tertiary)'],
  ['--input-radius',       'var(--radius-sm)'],
  ['--input-pad-x',        'var(--space-md)'],
  ['--input-pad-y',        'var(--space-sm)'],

  // ── Card component tokens ───────────────────────────────────────────────────
  ['--card-padding', 'var(--space-xl)'],
  ['--card-radius',  'var(--radius-lg)'],

  // ── Code component tokens ───────────────────────────────────────────────────
  ['--code-bg',     'var(--color-bg-sunken)'],
  ['--code-border', 'var(--color-border)'],
  ['--code-text',   'var(--color-text-secondary)'],

  // ── Badge component tokens ──────────────────────────────────────────────────
  ['--badge-bg',     'var(--color-surface-high)'],
  ['--badge-text',   'var(--color-text-secondary)'],
  ['--badge-border', 'var(--color-border)'],
  ['--badge-radius', 'var(--radius-pill)'],

  // ── Accordion component tokens ──────────────────────────────────────────────
  ['--accordion-border', 'var(--color-border)'],
  ['--accordion-text',   'var(--color-text-primary)'],
  ['--accordion-marker', 'var(--color-accent)'],
];

// WCAG contrast pairing set, keyed by tokens that resolve in the SINGLE dark-canonical
// palette (root tokens.css). [label, foreground token, background token, min ratio].
// BODY text >= 4.5:1 ; large-text / UI component / focus / border >= 3.0:1.
export const BODY = 4.5;
export const UI = 3.0;
export const CONTRAST_PAIRS = [
  // Text on the page canvas
  ['text-primary on bg',        'color-text-primary',   'color-bg',      BODY],
  ['text-secondary on bg',      'color-text-secondary', 'color-bg',      BODY],
  ['text-tertiary on bg',       'color-text-tertiary',  'color-bg',      BODY],
  ['the-number on bg',          'color-number',         'color-bg',      BODY],
  ['link on bg',                'color-link',           'color-bg',      BODY],
  ['accent(text) on bg',        'color-accent',         'color-bg',      BODY],
  ['status-positive on bg',     'color-positive',       'color-bg',      BODY],
  ['status-critical on bg',     'color-danger',         'color-bg',      BODY],
  // Text on a raised surface
  ['text-primary on surface',   'color-text-primary',   'color-surface', BODY],
  ['text-secondary on surface', 'color-text-secondary', 'color-surface', BODY],
  // Ink on the amber fills
  ['on-accent on accent fill',  'color-text-on-accent', 'color-accent',        BODY],
  ['on-accent on accent hover', 'color-text-on-accent', 'color-accent-strong', BODY],
  ['selection text on selection','color-selection-text','color-selection-bg',  BODY],
  // UI / graphic / focus / border (>= 3:1)
  ['focus ring on bg',            'color-focus',    'color-bg',      UI],
  ['interactive border on bg',    'color-border-ui','color-bg',      UI],
  ['interactive border on surface','color-border-ui','color-surface', UI],
];
