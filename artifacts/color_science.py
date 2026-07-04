"""DPR Labs — palette derivation + WCAG verification (no external deps).
Authoritative seeds (design direction): primary 36 92% 56%, accent 20 82% 54%,
bg 220 16% 7%. Builds tonal ramps, converts to hex + OKLCH, verifies contrast.
Every ratio printed here is computed, not asserted by hand."""
import math

# ---------- HSL -> sRGB ----------
def hsl_to_rgb(h, s, l):
    h = h / 360.0; s = s / 100.0; l = l / 100.0
    def f(n):
        k = (n + h * 12) % 12
        a = s * min(l, 1 - l)
        return l - a * max(-1, min(k - 3, 9 - k, 1))
    return (f(0), f(8), f(4))  # linear-ish sRGB in 0..1 (gamma-encoded)

def rgb_to_hex(rgb):
    return '#' + ''.join('{:02X}'.format(max(0, min(255, round(c * 255)))) for c in rgb)

# ---------- WCAG relative luminance + contrast ----------
def _lin(c):
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

def luminance(rgb):
    r, g, b = (_lin(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast(rgb1, rgb2):
    l1, l2 = luminance(rgb1), luminance(rgb2)
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)

# ---------- sRGB -> OKLCH (Bjorn Ottosson) ----------
def srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def rgb_to_oklch(rgb):
    r, g, b = (srgb_to_linear(c) for c in rgb)
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l_, m_, s_ = l ** (1/3), m ** (1/3), s ** (1/3)
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    C = math.sqrt(a * a + bb * bb)
    H = math.degrees(math.atan2(bb, a)) % 360
    return (L, C, H)

def oklch_str(rgb):
    L, C, H = rgb_to_oklch(rgb)
    return "oklch({:.1f}% {:.3f} {:.1f})".format(L * 100, C, H)

# ---------- Palette ----------
# name: (H, S, L) HSL
palette = {
    # neutral canvas ramp (bg hue 220, cool blue-graphite) — depth from value
    'bg':            (220, 16, 7),    # page canvas (seed)
    'bg-sunken':     (220, 18, 5),    # deepest well / footer
    'surface':       (220, 14, 10),   # raised panel
    'surface-high':  (218, 13, 14),   # highest raised / hover panel
    'hairline':      (216, 12, 20),   # 1px borders / grid lines (decorative)
    'hairline-strong':(214, 12, 28),  # emphasised decorative rule
    'border-ui':     (216, 11, 42),   # >=3:1 boundary for interactive controls
    # text ramp (cool near-white)
    'text-primary':  (210, 24, 96),   # headings + body
    'text-secondary':(214, 14, 72),   # sub-copy
    'text-tertiary': (216, 12, 56),   # captions / meta (large/UI)
    'text-faint':    (216, 10, 42),   # disabled / placeholder
    # warm signal family — amber primary (reserved accent), orange secondary
    'amber':         (36, 92, 56),    # THE accent (seed)
    'amber-bright':  (40, 96, 64),    # hover / active lift
    'amber-ink':     (34, 90, 46),    # amber text that needs >4.5 on surface
    'orange':        (20, 82, 54),    # secondary warm (seed)
    'orange-deep':   (16, 78, 46),    # gradient far-stop / pressed
    # ink for text sitting ON amber fills
    'on-amber':      (30, 40, 8),
}

rgb = {k: hsl_to_rgb(*v) for k, v in palette.items()}
bg = rgb['bg']; surface = rgb['surface']; surface_high = rgb['surface-high']

print("=== TOKEN VALUES (hex + OKLCH) ===")
for k in palette:
    print("{:16s} {:8s}  {}".format(k, rgb_to_hex(rgb[k]), oklch_str(rgb[k])))

def check(fg, bg_rgb, label, need):
    r = contrast(rgb[fg], bg_rgb)
    ok = 'PASS' if r >= need else 'FAIL'
    print("  {:32s} {:5.2f}:1  (need {:>4}) {}".format(label, r, need, ok))

print("\n=== CONTRAST ON CANVAS (bg #{}) ===".format(rgb_to_hex(bg)[1:]))
check('text-primary', bg, 'text-primary / bg (body)', 4.5)
check('text-secondary', bg, 'text-secondary / bg (body)', 4.5)
check('text-tertiary', bg, 'text-tertiary / bg (large/UI)', 3.0)
check('text-faint', bg, 'text-faint / bg (disabled, non-essential)', 3.0)
check('amber', bg, 'amber / bg (large/UI + graphic)', 3.0)
check('amber', bg, 'amber / bg (as body text)', 4.5)
check('orange', bg, 'orange / bg (large/UI + graphic)', 3.0)
check('amber-bright', bg, 'amber-bright / bg (focus ring)', 3.0)
check('hairline', bg, 'hairline / bg (decorative border)', 1.0)
check('hairline-strong', bg, 'hairline-strong / bg (decorative)', 1.0)
check('border-ui', bg, 'border-ui / bg (interactive control)', 3.0)

print("\n=== CONTRAST ON SURFACE (#{}) ===".format(rgb_to_hex(surface)[1:]))
check('text-primary', surface, 'text-primary / surface', 4.5)
check('text-secondary', surface, 'text-secondary / surface', 4.5)
check('amber-ink', surface, 'amber-ink / surface (body)', 4.5)
check('amber', surface, 'amber / surface (large/UI)', 3.0)

print("\n=== CONTRAST ON SURFACE-HIGH (#{}) ===".format(rgb_to_hex(surface_high)[1:]))
check('text-primary', surface_high, 'text-primary / surface-high', 4.5)
check('text-secondary', surface_high, 'text-secondary / surface-high', 4.5)

print("\n=== TEXT ON AMBER FILL (button) ===")
r = contrast(rgb['on-amber'], rgb['amber'])
print("  on-amber / amber (button label)        {:5.2f}:1  (need 4.5) {}".format(r, 'PASS' if r >= 4.5 else 'FAIL'))
r = contrast(rgb['on-amber'], rgb['amber-bright'])
print("  on-amber / amber-bright (btn hover)     {:5.2f}:1  (need 4.5) {}".format(r, 'PASS' if r >= 4.5 else 'FAIL'))
r = contrast(rgb['on-amber'], rgb['orange'])
print("  on-amber / orange (secondary btn)       {:5.2f}:1  (need 4.5) {}".format(r, 'PASS' if r >= 4.5 else 'FAIL'))
