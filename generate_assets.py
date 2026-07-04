"""Generate Deeper's bespoke AI-first asset kit via Flux, then key black -> alpha."""
import json, urllib.request, urllib.parse, time, os, uuid
import numpy as np
from PIL import Image

COMFY = "http://127.0.0.1:8188"
ROOT = os.path.dirname(__file__)
RAW = os.path.join(ROOT, "assets", "_raw")
ICONS = os.path.join(ROOT, "assets", "icons")
IMG = os.path.join(ROOT, "assets", "images")
for d in (RAW, ICONS, IMG):
    os.makedirs(d, exist_ok=True)

STYLE = (", isolated on pure solid black background #000000, dark, centered, "
         "symmetrical, glowing neon cyan and teal light, elegant 3d glass and "
         "liquid light, premium, minimal, high detail, no text, no words")

# (name, w, h, prompt, kind)  kind: icon|logo|hero|sheen|image
JOBS = [
    ("icon-strategy", 1024, 1024,
     "a single glowing icon of a compass rose merged with a branching route map and "
     "a glowing node, depicting strategy and direction" + STYLE, "icon"),
    ("icon-build", 1024, 1024,
     "a single glowing icon of three translucent cubes assembling and locking together, "
     "depicting custom software being built" + STYLE, "icon"),
    ("icon-automation", 1024, 1024,
     "a single glowing icon of interlocking gears with smooth circular flow arrows, "
     "depicting automated workflow" + STYLE, "icon"),
    ("icon-team", 1024, 1024,
     "a single glowing icon of three connected glowing person nodes forming a small "
     "network, depicting a team" + STYLE, "icon"),
    ("logo-orb", 1024, 1024,
     "a perfect glowing liquid sphere orb made of swirling teal and cyan light, a "
     "premium minimal brand logo mark, soft inner glow" + STYLE, "logo"),
    ("hero-orb", 1280, 1280,
     "a large mesmerizing abstract artificial intelligence core: a glowing translucent "
     "sphere of swirling neural light, fine luminous filaments and data threads orbiting "
     "it, deep teal cyan and indigo, suspended in dark water, cinematic, awe-inspiring, "
     "premium 3d render" + STYLE, "hero"),
    ("btn-sheen", 1024, 320,
     "a soft diagonal streak of bright cyan light, smooth glossy energy highlight, "
     "horizontal, on pure solid black background, minimal, glowing", "sheen"),
]


def workflow(prompt, w, h, seed):
    return {
        "4": {"class_type": "CheckpointLoaderSimple",
              "inputs": {"ckpt_name": "flux1-schnell-fp8.safetensors"}},
        "6": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["4", 1]}},
        "10": {"class_type": "FluxGuidance", "inputs": {"conditioning": ["6", 0], "guidance": 3.2}},
        "7": {"class_type": "CLIPTextEncode", "inputs": {"text": "", "clip": ["4", 1]}},
        "5": {"class_type": "EmptySD3LatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
        "3": {"class_type": "KSampler", "inputs": {
            "seed": seed, "steps": 6, "cfg": 1.0, "sampler_name": "euler",
            "scheduler": "simple", "denoise": 1.0,
            "model": ["4", 0], "positive": ["10", 0], "negative": ["7", 0],
            "latent_image": ["5", 0]}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
        "9": {"class_type": "SaveImage", "inputs": {"filename_prefix": "dpra", "images": ["8", 0]}},
    }


def post(wf):
    data = json.dumps({"prompt": wf, "client_id": str(uuid.uuid4())}).encode()
    req = urllib.request.Request(f"{COMFY}/prompt", data=data, headers={"Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req).read())["prompt_id"]


def wait(pid, timeout=300):
    s = time.time()
    while time.time() - s < timeout:
        h = json.loads(urllib.request.urlopen(f"{COMFY}/history/{pid}").read())
        if pid in h and h[pid].get("outputs"):
            return h[pid]
        time.sleep(2)
    raise TimeoutError(pid)


def fetch(img, dest):
    q = urllib.parse.urlencode({"filename": img["filename"], "subfolder": img.get("subfolder", ""), "type": img["type"]})
    with open(dest, "wb") as f:
        f.write(urllib.request.urlopen(f"{COMFY}/view?{q}").read())


def key_alpha(src, dest, low=14, high=80, gamma=0.85, size=None):
    """Turn glow-on-black into RGBA, dark -> transparent."""
    im = Image.open(src).convert("RGB")
    arr = np.asarray(im).astype(np.float32)
    lum = arr.max(axis=2)  # brightest channel = glow strength
    a = np.clip((lum - low) / (high - low), 0, 1) ** gamma
    rgba = np.dstack([arr, a * 255.0]).astype(np.uint8)
    out = Image.fromarray(rgba, "RGBA")
    if size:
        out = out.resize(size, Image.LANCZOS)
    out.save(dest)


if __name__ == "__main__":
    for i, (name, w, h, prompt, kind) in enumerate(JOBS):
        seed = 7000 + i * 911
        print(f"[gen] {name} ({kind})", flush=True)
        hist = wait(post(workflow(prompt, w, h, seed)))
        raw = os.path.join(RAW, f"{name}.png")
        fetch(hist["outputs"]["9"]["images"][0], raw)

        if kind == "icon":
            key_alpha(raw, os.path.join(ICONS, f"{name}.png"), low=18, high=110, size=(512, 512))
        elif kind == "logo":
            key_alpha(raw, os.path.join(ICONS, "logo-orb.png"), low=10, high=90, size=(256, 256))
        elif kind == "hero":
            key_alpha(raw, os.path.join(IMG, "hero-orb.png"), low=6, high=70, gamma=0.9)
        elif kind == "sheen":
            key_alpha(raw, os.path.join(ICONS, "btn-sheen.png"), low=8, high=120)
        print(f"  -> keyed {name}", flush=True)
    print("ASSETS DONE", flush=True)
