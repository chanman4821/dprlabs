"""DPR Labs hero mascot - ORIGINAL glossy-gold designer-toy robot ("AURI").

Drives the repo's existing local ComfyUI + Flux-dev pipeline (the same pattern
as artifacts/gen_goldbrain.py and generate_images_flux.py: local ComfyUI at
127.0.0.1:8188, checkpoint flux1-dev-fp8, guidance 3.5, euler/simple, then a
4x-UltraSharp upscale) to render 6 concept variations of ONE original creature-
bot mascot for the DPR Labs website hero.

WHY THIS IS AN ORIGINAL CHARACTER (IP guardrail - not Labubu / Pop Mart / The
Monsters): the brief is "Labubu-inspired in spirit only" (big eyes, cheeky grin,
chunky proportions, mischief). We deliberately diverge from the protected design
by making it a hard-shell GOLD ROBOT rather than a furry elf-monster:
  - two short ROUNDED ball-tipped antennae + round headphone disc ears
    (NOT the tall pointed serrated rabbit/elf ears that are Labubu's silhouette),
  - a neat row of small EVEN square teeth
    (NOT the signature nine jagged serrated fangs),
  - a smooth polished GOLD SHELL with panel seams and rivets (NOT plush fur).
No brand name, character name, or trademarked shape appears in the prompt; the
character is described only in positive, original terms.

MATERIAL: one solid polished reflective 24k gold - the same gold recipe the
owner approved for the site's golden brain (see artifacts/gen_goldbrain.py) - on
a clean pure-white seamless background to match the clean white Vercel-style site.

RESOLUTION: 896x1152 base -> 4x-UltraSharp upscale -> fit to 1792x2304 (hi-res).

Run:  python assets/mascot/gen_mascot.py   (ComfyUI must be running)
Change the seeds in JOBS to fan out a fresh batch.
"""
import json, urllib.request, urllib.parse, time, os, uuid

COMFY = "http://127.0.0.1:8188"
OUT = os.path.dirname(os.path.abspath(__file__))
CKPT = "flux1-dev-fp8.safetensors"

# The ORIGINAL creature-bot, held IDENTICAL across every pose so all six read as
# clearly the same character (concept-batch identity; a later phase can lock the
# face harder with a Flux Kontext reference or a small character LoRA).
CHAR = (
    "an original chunky designer-toy robot mascot creature, one big rounded dome "
    "head on a stout rounded body, big round glossy dark camera-lens eyes each "
    "with a single bright white catchlight, a wide cheeky mischievous grin showing "
    "a single neat row of small even square teeth, two round headphone-style disc "
    "ears on the sides of its head, two short stubby antennae on top of its head "
    "each capped with a small polished gold ball, faint panel seams and tiny "
    "rivets, ball-joint stubby arms with "
    "little rounded three-nub mitten hands, short chunky legs with rounded feet, "
    "cute chibi proportions, playful mischievous personality, "
)

# Gold material (matched to the site's golden brain) + pure-white studio backdrop.
# NOTE: the numeral "24k" is intentionally avoided in the prompt because Flux
# renders it as a literal stamped "24K" label on the body; "rich pure gold" gives
# the identical warm reflective material without leaking text onto the mascot.
STYLE = (
    ", made of one solid polished reflective gold material, mirror-like glossy "
    "metallic gold, rich warm yellow gold, bright specular highlights, luminous "
    "real gold, smooth glossy hard shell surface, smooth blank body panels, "
    "premium designer vinyl collectible art toy, isolated on a pure solid white "
    "background, seamless bright white studio backdrop, high-key studio lighting, "
    "soft even light, subtle soft contact shadow directly beneath it, octane "
    "render, 3d, ultra detailed, sharp focus, centered, full body in frame, "
    "no text, no letters, no numbers, no serial numbers, no stamped markings, "
    "no labels, no logo, no watermark"
)

# (name, base_w, base_h, seed, pose)  -- 3 front + 3 three-quarter.
JOBS = [
    ("concept-1-front-hero", 896, 1152, 3120,
     "front view, standing tall and symmetrical facing straight at the camera, "
     "both little hands planted on its hips, chin up, beaming a big confident "
     "cheeky grin, bright wide eyes"),
    ("concept-2-front-wave", 896, 1152, 5477,
     "front view, facing forward, lifting one stubby arm in a big friendly wave, "
     "winking one eye, playful open cheeky grin"),
    ("concept-3-front-welcome", 896, 1152, 8842,
     "front view, facing forward, both short arms opened wide in a warm welcoming "
     "gesture, bright sparkling wide eyes and a happy toothy grin"),
    ("concept-4-threequarter-lean", 896, 1152, 2069,
     "three-quarter view turned slightly to one side, leaning casually with one "
     "hand on its hip, a sly cheeky smirk and a mischievous sideways glance at "
     "the camera"),
    ("concept-5-threequarter-walk", 896, 1152, 6391,
     "three-quarter view mid-stride walking playfully forward, short arms swinging, "
     "looking ahead with a happy toothy grin"),
    ("concept-6-threequarter-peek", 896, 1152, 9518,
     "three-quarter view, turned away and peeking back over its shoulder with a "
     "sneaky mischievous grin, one little finger raised beside its mouth"),
]


def base(prompt, w, h, seed):
    return {
        "4": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": CKPT}},
        "6": {"class_type": "CLIPTextEncode", "inputs": {"text": CHAR + prompt + STYLE, "clip": ["4", 1]}},
        "10": {"class_type": "FluxGuidance", "inputs": {"conditioning": ["6", 0], "guidance": 3.5}},
        "7": {"class_type": "CLIPTextEncode", "inputs": {"text": "", "clip": ["4", 1]}},
        "5": {"class_type": "EmptySD3LatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
        "3": {"class_type": "KSampler", "inputs": {"seed": seed, "steps": 30, "cfg": 1.0,
              "sampler_name": "euler", "scheduler": "simple", "denoise": 1.0,
              "model": ["4", 0], "positive": ["10", 0], "negative": ["7", 0], "latent_image": ["5", 0]}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
    }


def upscaled(wf, prefix, dw, dh):
    wf["um"] = {"class_type": "UpscaleModelLoader", "inputs": {"model_name": "4x-UltraSharp.pth"}}
    wf["up"] = {"class_type": "ImageUpscaleWithModel", "inputs": {"upscale_model": ["um", 0], "image": ["8", 0]}}
    wf["fit"] = {"class_type": "ImageScale", "inputs": {"image": ["up", 0], "upscale_method": "lanczos",
                 "width": dw, "height": dh, "crop": "disabled"}}
    wf["9"] = {"class_type": "SaveImage", "inputs": {"filename_prefix": prefix, "images": ["fit", 0]}}
    return wf


def post(w):
    d = json.dumps({"prompt": w, "client_id": str(uuid.uuid4())}).encode()
    r = urllib.request.Request(f"{COMFY}/prompt", data=d, headers={"Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(r).read())["prompt_id"]


def wait(pid, timeout=900):
    s = time.time()
    while time.time() - s < timeout:
        h = json.loads(urllib.request.urlopen(f"{COMFY}/history/{pid}").read())
        if pid in h and h[pid].get("outputs"):
            return h[pid]
        time.sleep(2)
    raise TimeoutError(pid)


def fetch(img, dest):
    q = urllib.parse.urlencode({"filename": img["filename"], "subfolder": img.get("subfolder", ""), "type": img["type"]})
    open(dest, "wb").write(urllib.request.urlopen(f"{COMFY}/view?{q}").read())


def render_one(name, w, h, seed, pose):
    # base() assembles the full prompt as CHAR + pose + STYLE (node "6").
    wf = upscaled(base(pose, w, h, seed), f"dprMascot_{name}", w * 2, h * 2)
    hist = wait(post(wf))
    img = hist["outputs"]["9"]["images"][0]
    dest = os.path.join(OUT, f"{name}.png")
    fetch(img, dest)
    return dest


if __name__ == "__main__":
    import sys
    t0 = time.time()
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for name, w, h, seed, pose in JOBS:
        if only and only not in name:
            continue
        print(f"[queue] {name} {w*2}x{h*2}", flush=True)
        dest = render_one(name, w, h, seed, pose)
        print(f"[done]  {dest} ({os.path.getsize(dest)} bytes)", flush=True)
    print(f"ALL DONE in {time.time()-t0:.0f}s -> {OUT}", flush=True)
