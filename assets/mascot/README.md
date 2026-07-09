# DPR AI hero mascot — original gold robot concept batch (phase 1)

An original, chunky, glossy-gold designer-toy **robot** mascot for the DPR AI
website hero. Rendered locally with the repo's own ComfyUI + Flux pipeline, in the
same gold as the site's golden brain, on a clean pure-white background.

Working name: **AURI** (from *aurum*, Latin for gold). The name is a placeholder —
it still needs a trademark check before public use.

## The 6 concepts (all in this folder)

All are full-body, centered, glossy gold on pure white, **1792 × 2304 px**.

| File | View | Pose / mood |
|------|------|-------------|
| `concept-1-front-hero.png` | front | hands on hips, big confident cheeky grin — **recommended hero** |
| `concept-2-front-wave.png` | front | one arm up in a big friendly wave, winking |
| `concept-3-front-welcome.png` | front | arms open wide, warm welcoming grin |
| `concept-4-threequarter-lean.png` | three-quarter | leaning, hand on hip, sly cheeky smirk |
| `concept-5-threequarter-walk.png` | three-quarter | mid-stride, arms swinging, happy grin |
| `concept-6-threequarter-peek.png` | three-quarter | peeking back over the shoulder, sneaky grin |

Three front + three three-quarter, as asked.

## Recommended hero: `concept-1-front-hero.png`

Pick this one for the site hero. It is the cleanest, most symmetric, and most
iconic — a single gold object that reads instantly, matches the golden brain's
gold and the site's white, and still works when shrunk small (favicon test).
Good alternates: `concept-4-threequarter-lean.png` (more dynamic) and
`concept-2-front-wave.png` (friendlier, more inviting).

## The character (held the same across all 6)

A small chunky gold robot with a big round dome head and a stout little body:
- a big glossy dark visor face holding two bright round eyes and a wide grin;
- the grin is a neat row of small, even, square teeth;
- two round headphone-style disc ears on the sides of the head;
- two short antennae on top, each with a little gold ball on the end;
- panel seams and tiny rivets, ball-joint stubby arms, chunky legs, rounded feet.
Personality: playful, cheeky, a bit of mischief.

## Why it is original (not Labubu / Pop Mart / The Monsters)

The brief said "Labubu-inspired in spirit only" (big eyes, cheeky grin, chunky,
mischief). We stay original on purpose by making it a **gold robot**, not the
protected furry elf-monster:
- short **rounded ball-tipped antennae and disc ears**, NOT the tall pointed
  serrated rabbit/elf ears that are Labubu's signature silhouette;
- a neat row of **small even square teeth**, NOT the signature nine jagged fangs;
- a smooth **hard gold shell** with seams and rivets, NOT plush fur.
No brand name, character name, logo, or trademarked shape is used in the prompt or
appears in any image.

## The exact prompt (so anyone can reproduce it)

Every image is: **character text + one pose line + material/background suffix**.

- Character (same every time):
  > an original chunky designer-toy robot mascot creature, one big rounded dome
  > head on a stout rounded body, big round glossy dark camera-lens eyes each with
  > a single bright white catchlight, a wide cheeky mischievous grin showing a
  > single neat row of small even square teeth, two round headphone-style disc ears
  > on the sides of its head, two short stubby antennae on top of its head each
  > capped with a small polished gold ball, faint panel seams and tiny rivets,
  > ball-joint stubby arms with little rounded three-nub mitten hands, short chunky
  > legs with rounded feet, cute chibi proportions, playful mischievous personality

- Material + background (matched to the golden brain, pure white):
  > made of one solid polished reflective gold material, mirror-like glossy metallic
  > gold, rich warm yellow gold, bright specular highlights, luminous real gold,
  > smooth glossy hard shell surface, smooth blank body panels, premium designer
  > vinyl collectible art toy, isolated on a pure solid white background, seamless
  > bright white studio backdrop, high-key studio lighting, soft even light, subtle
  > soft contact shadow directly beneath it, octane render, 3d, ultra detailed,
  > sharp focus, centered, full body in frame, no text, no letters, no numbers, no
  > serial numbers, no stamped markings, no labels, no logo, no watermark

Note: the word "24k" is deliberately left out. Flux prints it as a literal "24K"
stamp on the body; "rich pure gold" gives the same warm gold with no stray text.

## Pipeline

Local ComfyUI at `127.0.0.1:8188`, checkpoint `flux1-dev-fp8.safetensors`,
FluxGuidance 3.5, 30 steps, euler/simple — the same recipe as the site's golden
brain (`artifacts/gen_goldbrain.py`) — then a `4x-UltraSharp` upscale fit to
1792 × 2304.

Regenerate everything:
```
python assets/mascot/gen_mascot.py
```
Render just one (name-substring match), e.g.:
```
python assets/mascot/gen_mascot.py concept-4
```
Change the seeds in `JOBS` inside `gen_mascot.py` to fan out a fresh batch.

## Checks (measured on real renders, honest)

Each image was scored on six brand checks: (1) polished gold matching the brain,
(2) pure-white background, (3) no text, (4) original robot (not Labubu), (5) big
expressive eyes, (6) cheeky toothy grin.

- **Optimized set (these 6):** 6 of 6 checks pass on every image. Backgrounds
  measured near-white (corner RGB 244–252). No stray text.
- **Naive "before" set (2 renders, the raw request with no prompt work):** each
  passed only 4 of 6 — they came out on a warm amber background (corner RGB
  ~209,175,117 and ~194,147,65) in matte black-accented plastic, so they failed
  the two site-critical checks: gold-material-match and pure-white-background.
- The two site-critical failure modes went from **0/2 pass (naive) → 6/6 pass
  (optimized)** — a 100% reduction in those failures (target was at least 50%).
- One more failure mode was caught during a smoke test and fixed: the "24k" token
  printed a stamped "24K"/serial-number label on the body; removing that word
  cleared it (before/after visible in the session smoke renders).

## Honest weak spot

Flux does not perfectly obey exact camera angles or lock a face across renders.
The character, gold, and white background are correct in all six, and the family
reads as one character, but if a later phase needs exact turntable angles or a
pixel-locked face, add a Flux Kontext reference image or a small character LoRA —
do not change the gold material or the white background.

## Handoff

- Gold material and pure-white background are locked — keep them to match the brain.
- Use `concept-1-front-hero.png` as the single focal object in the hero, with its
  soft contact shadow, per the design direction.
- Everything here stays inside the dpr repo. Nothing was written to jarvis.
