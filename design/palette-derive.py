"""DPR Labs — authoritative palette derivation (Direction B / DPR Labs buyer site).

Seeds come VERBATIM from the task's DESIGN TOKENS block:
  --background 30 9% 7%   --foreground 38 22% 93%   --card/--popover 30 8% 10%
  --primary 36 86% 56%    --primary-foreground 30 40% 8%
  --secondary/--muted 28 8% 13%   --muted-foreground 34 9% 62%
  --accent 205 22% 64%    (--accent-foreground derived dark)

Every hex printed here is COMPUTED from HSL, and every ratio is COMPUTED (WCAG 2.2),
not asserted by hand. Reuses the repo's artifacts/color_science.py (no new color math).
Run:  python palette-derive.py
"""
import os
import sys

import io
import contextlib

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "artifacts"))
# color_science.py prints a self-test on import; silence it so this script's output is clean.
with contextlib.redirect_stdout(io.StringIO()):
    from color_science import hsl_to_rgb, rgb_to_hex, contrast, oklch_str  # noqa: E402

# name -> (H, S, L) in HSL. Anchors marked AUTH come verbatim from the brief.
palette = {
    # ---- warm neutral ramp (canvas + text), hue ~30 ----
    "warm-950":      (30, 10, 4.5),   # sunken well / deepest recess
    "warm-900":      (30, 9,  7),     # AUTH --background (page canvas)
    "warm-850":      (30, 8,  10),    # AUTH --card / --popover / surface
    "warm-800":      (28, 8,  13),    # AUTH --secondary / --muted / raised surface
    "warm-700":      (30, 8,  18),    # hairline / divider
    "warm-600":      (30, 7,  26),    # strong hairline
    "warm-500":      (34, 9,  48),    # interactive/control border (>=3:1 on canvas)
    "warm-400":      (34, 9,  62),    # AUTH --muted-foreground / tertiary text
    "warm-300":      (30, 12, 74),    # secondary text
    "warm-100":      (38, 22, 93),    # AUTH --foreground (primary text)
    # ---- amber (PRIMARY, reserved accent), re-anchored to AUTH 36 86% 56% ----
    "amber-600":     (36, 88, 47),    # primary hover (darker)
    "amber-500":     (36, 86, 56),    # AUTH --primary / --ring / the-number
    "amber-400":     (38, 92, 66),    # focus ring / link / lighter accent
    "amber-ink":     (36, 95, 30),    # amber TEXT on light paper (needs >=4.5 on lightest paper)
    "on-amber":      (30, 40, 8),     # AUTH --primary-foreground (ink on amber fill)
    # ---- slate (cool SECONDARY accent), hue ~205, AUTH accent = 205 22% 64% ----
    "slate-700":     (205, 26, 34),   # dark slate: UI/graphic + text on paper
    "slate-500":     (205, 24, 52),   # mid slate: UI fill on either mode
    "slate-400":     (205, 22, 64),   # AUTH --accent (graphic/text on dark canvas)
    "slate-300":     (205, 30, 78),   # lighter slate: high-contrast accent text on dark
    "slate-ink":     (205, 32, 13),   # AUTH-derived --accent-foreground (ink on slate chip)
    # ---- status (kept from prior build; re-verified) ----
    "positive-text": (150, 52, 62),
    "positive-ui":   (150, 46, 46),
    "positive-ink":  (150, 58, 28),
    "critical-text": (8,  82, 68),
    "critical-ui":   (6,  68, 52),
    "critical-ink":  (4,  74, 42),
    # ---- light paper ramp ----
    "paper-surface":         (40, 40, 99),
    "paper-canvas":          (38, 33, 97),
    "paper-sunken":          (36, 24, 94),
    "paper-hairline":        (34, 20, 87),
    "paper-hairline-strong": (32, 16, 78),
    "paper-border":          (32, 10, 45),
    "paper-text-tertiary":   (30, 9,  42),
    "paper-text-secondary":  (30, 10, 34),
    "paper-text-primary":    (28, 14, 13),
}

rgb = {k: hsl_to_rgb(*v) for k, v in palette.items()}

print("=== HEX + OKLCH (computed) ===")
for k, v in palette.items():
    print("  {:22s} hsl({:>3} {:>2}% {:>4}%)  {:8s}  {}".format(
        k, v[0], v[1], v[2], rgb_to_hex(rgb[k]), oklch_str(rgb[k])))


def chk(fg, bg, label, need):
    r = contrast(rgb[fg], rgb[bg])
    print("  {:44s} {:5.2f}:1  need {:>4}  {}".format(
        label, r, need, "PASS" if r >= need else "FAIL <--"))


BODY, UI = 4.5, 3.0
print("\n=== DARK — text/graphic on canvas warm-900 ===")
chk("warm-100", "warm-900", "foreground / bg (body)", BODY)
chk("warm-300", "warm-900", "text-secondary / bg (body)", BODY)
chk("warm-400", "warm-900", "muted-foreground / bg (body)", BODY)
chk("amber-500", "warm-900", "primary/the-number / bg (text)", BODY)
chk("amber-400", "warm-900", "link+focus / bg", BODY)
chk("slate-400", "warm-900", "accent(slate) / bg (as text)", BODY)
chk("slate-400", "warm-900", "accent(slate) / bg (as UI/graphic)", UI)
chk("slate-300", "warm-900", "accent-hi(slate) / bg (text)", BODY)
chk("warm-500", "warm-900", "interactive border / bg (UI)", UI)
chk("positive-text", "warm-900", "status-positive / bg", BODY)
chk("critical-text", "warm-900", "status-critical / bg", BODY)

print("\n=== DARK — muted text on muted surface warm-800 (28 8% 13%) ===")
chk("warm-400", "warm-800", "muted-foreground / muted", BODY)
chk("warm-100", "warm-800", "foreground / secondary surface", BODY)

print("\n=== DARK — ink on fills ===")
chk("on-amber", "amber-500", "primary-foreground / primary fill", BODY)
chk("on-amber", "amber-600", "primary-foreground / primary hover", BODY)
chk("slate-ink", "slate-400", "accent-foreground / accent(slate) fill", BODY)
chk("warm-100", "warm-850", "foreground / card", BODY)

print("\n=== LIGHT — on warm paper canvas ===")
chk("paper-text-primary",   "paper-canvas", "text-primary / paper", BODY)
chk("paper-text-secondary", "paper-canvas", "text-secondary / paper", BODY)
chk("paper-text-tertiary",  "paper-canvas", "text-tertiary / paper", BODY)
chk("amber-ink",  "paper-canvas",  "amber-ink (number/link) / paper-canvas", BODY)
chk("amber-ink",  "paper-surface", "amber-ink (number/link) / paper-surface(lightest)", BODY)
chk("slate-700",  "paper-canvas", "accent(slate) / paper (text)", BODY)
chk("slate-700",  "paper-canvas", "accent(slate) / paper (UI)", UI)
chk("paper-border", "paper-canvas", "interactive border / paper (UI)", UI)
chk("positive-ink", "paper-canvas", "status-positive / paper", BODY)
chk("critical-ink", "paper-canvas", "status-critical / paper", BODY)
