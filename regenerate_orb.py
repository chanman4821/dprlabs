"""Regenerate the hero orb as a REAL floating neural-mesh sphere (no base/reflection)."""
import json, urllib.request, urllib.parse, time, os, uuid
import numpy as np
from PIL import Image

COMFY = "http://127.0.0.1:8188"
ROOT = os.path.dirname(__file__)
RAW = os.path.join(ROOT, "assets", "_raw")
IMG = os.path.join(ROOT, "assets", "images")
os.makedirs(RAW, exist_ok=True)

PROMPT = (
    "a glowing three dimensional neural network mesh sphere, an extremely dense "
    "intricate web of thousands of tiny luminous interconnected nodes and countless "
    "thin glowing synapse filaments forming a perfect floating globe, very high node "
    "density, densely packed plexus network, fine detailed glowing wireframe lattice, "
    "swarming sparkling data particles, abstract artificial intelligence brain core, "
    "electric cyan teal and indigo light, cinematic, awe inspiring, premium octane 3d "
    "render, floating alone in empty dark void, no ground, no floor, no reflection, "
    "no base, no pedestal, no water, no surface, no shadow underneath, "
    "isolated on pure solid black background #000000, centered, symmetrical, "
    "high detail, no text, no words"
)


def workflow(seed, w=1280, h=1280):
    return {
        "4": {"class_type": "CheckpointLoaderSimple",
              "inputs": {"ckpt_name": "flux1-schnell-fp8.safetensors"}},
        "6": {"class_type": "CLIPTextEncode", "inputs": {"text": PROMPT, "clip": ["4", 1]}},
        "10": {"class_type": "FluxGuidance", "inputs": {"conditioning": ["6", 0], "guidance": 3.0}},
        "7": {"class_type": "CLIPTextEncode", "inputs": {"text": "", "clip": ["4", 1]}},
        "5": {"class_type": "EmptySD3LatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
        "3": {"class_type": "KSampler", "inputs": {
            "seed": seed, "steps": 6, "cfg": 1.0, "sampler_name": "euler",
            "scheduler": "simple", "denoise": 1.0,
            "model": ["4", 0], "positive": ["10", 0], "negative": ["7", 0],
            "latent_image": ["5", 0]}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
        "9": {"class_type": "SaveImage", "inputs": {"filename_prefix": "dprorb", "images": ["8", 0]}},
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


def key_alpha(src, dest, low=6, high=72, gamma=0.9):
    """Glow-on-black -> RGBA, masked to a clean circle so no reflection/flat cut survives."""
    im = Image.open(src).convert("RGB")
    arr = np.asarray(im).astype(np.float32)
    lum = arr.max(axis=2)
    a = np.clip((lum - low) / (high - low), 0, 1) ** gamma
    h, w = lum.shape
    # auto-detect the sphere: luminance-weighted centroid + 98.5th-pct radius
    bright = lum > 35
    ys, xs = np.nonzero(bright)
    wgt = lum[bright]
    cx = float((xs * wgt).sum() / wgt.sum())
    cy = float((ys * wgt).sum() / wgt.sum())
    d = np.sqrt((xs - cx) ** 2 + (ys - cy) ** 2)
    order = np.argsort(d)
    cum = np.cumsum(wgt[order]) / wgt.sum()
    R = float(d[order][np.searchsorted(cum, 0.985)])
    feather = 26.0
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    circ = np.clip((R + feather - dist) / feather, 0, 1)  # 1 inside, soft edge, 0 beyond
    a *= circ
    rgba = np.dstack([arr, a * 255.0]).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(dest)


if __name__ == "__main__":
    seed = 50321
    print("[gen] hero-orb neural mesh", flush=True)
    hist = wait(post(workflow(seed)))
    raw = os.path.join(RAW, "hero-orb-mesh.png")
    fetch(hist["outputs"]["9"]["images"][0], raw)
    key_alpha(raw, os.path.join(IMG, "hero-orb.png"))
    print("ORB DONE ->", os.path.join(IMG, "hero-orb.png"), flush=True)
