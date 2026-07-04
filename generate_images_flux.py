"""Regenerate Deeper site images via local ComfyUI using Flux schnell (premium quality)."""
import json, urllib.request, urllib.parse, time, os, uuid

COMFY = "http://127.0.0.1:8188"
OUT = os.path.join(os.path.dirname(__file__), "assets", "images")
os.makedirs(OUT, exist_ok=True)

STYLE = (", award-winning fine-art photography, cinematic studio lighting, "
         "ultra detailed, photoreal, shallow depth of field, deep navy and "
         "teal and cyan palette, elegant, expensive, minimal, no text, no people unless stated")

JOBS = [
    ("hero", 1344, 768,
     "Looking up from deep underwater toward a distant glowing surface, "
     "shafts of cyan light cutting through dark blue water, fine suspended "
     "particles catching the light, vast quiet depth, abstract and serene"),
    ("services", 1024, 1024,
     "Macro studio shot of stacked translucent layered glass plates with soft "
     "cyan edge-light, depicting depth and layers, on a dark seamless background, "
     "premium product photography, clean and architectural"),
    ("process", 1024, 1024,
     "A single thin ribbon of glowing cyan light flowing in a smooth curve from "
     "top to bottom through dark water, long exposure light trail, minimal, "
     "elegant, sense of a path descending into depth"),
    ("results", 1024, 1024,
     "Abstract close-up of smooth rising glowing teal light columns reflected on "
     "a dark calm water surface, like a sound wave or growth chart, minimal, "
     "premium, dark moody background"),
    ("about", 1344, 768,
     "Wide cinematic shot of a lone free-diver in silhouette descending into a "
     "vast deep blue ocean abyss, dramatic shafts of light from above, immense "
     "scale, contemplative, calm, fine-art underwater photography"),
    ("cta", 1344, 768,
     "Calm dark ocean surface seen from just below the waterline at twilight, "
     "soft cyan glow breaking through, minimal horizon, vast and quiet, "
     "cinematic, peaceful, fine-art seascape"),
    ("founder1", 768, 768,
     "Abstract glossy three dimensional sphere made of swirling deep teal and "
     "cyan liquid light on a dark seamless studio background, premium product "
     "render, soft reflections, minimal"),
    ("founder2", 768, 768,
     "Abstract glossy three dimensional sphere made of swirling deep blue and "
     "aqua glass with internal glow on a dark seamless studio background, "
     "premium product render, minimal"),
    ("founder3", 768, 768,
     "Abstract glossy three dimensional sphere made of swirling indigo and "
     "bright cyan plasma light on a dark seamless studio background, premium "
     "product render, minimal"),
]


def workflow(prompt, w, h, seed):
    return {
        "4": {"class_type": "CheckpointLoaderSimple",
              "inputs": {"ckpt_name": "flux1-schnell-fp8.safetensors"}},
        "6": {"class_type": "CLIPTextEncode",
              "inputs": {"text": prompt + STYLE, "clip": ["4", 1]}},
        "10": {"class_type": "FluxGuidance",
               "inputs": {"conditioning": ["6", 0], "guidance": 3.5}},
        "7": {"class_type": "CLIPTextEncode", "inputs": {"text": "", "clip": ["4", 1]}},
        "5": {"class_type": "EmptySD3LatentImage",
              "inputs": {"width": w, "height": h, "batch_size": 1}},
        "3": {"class_type": "KSampler", "inputs": {
            "seed": seed, "steps": 6, "cfg": 1.0, "sampler_name": "euler",
            "scheduler": "simple", "denoise": 1.0,
            "model": ["4", 0], "positive": ["10", 0], "negative": ["7", 0],
            "latent_image": ["5", 0]}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
        "9": {"class_type": "SaveImage", "inputs": {"filename_prefix": "dprf", "images": ["8", 0]}},
    }


def post(wf):
    data = json.dumps({"prompt": wf, "client_id": str(uuid.uuid4())}).encode()
    req = urllib.request.Request(f"{COMFY}/prompt", data=data,
                                 headers={"Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req).read())["prompt_id"]


def wait(pid, timeout=300):
    start = time.time()
    while time.time() - start < timeout:
        h = json.loads(urllib.request.urlopen(f"{COMFY}/history/{pid}").read())
        if pid in h and h[pid].get("outputs"):
            return h[pid]
        time.sleep(2)
    raise TimeoutError(pid)


def fetch(img, dest):
    q = urllib.parse.urlencode({"filename": img["filename"],
                                "subfolder": img.get("subfolder", ""),
                                "type": img["type"]})
    with open(dest, "wb") as f:
        f.write(urllib.request.urlopen(f"{COMFY}/view?{q}").read())


if __name__ == "__main__":
    for i, (name, w, h, prompt) in enumerate(JOBS):
        seed = 42 + i * 1234
        print(f"[queue] {name} {w}x{h}", flush=True)
        hist = wait(post(workflow(prompt, w, h, seed)))
        img = hist["outputs"]["9"]["images"][0]
        dest = os.path.join(OUT, f"{name}.png")
        fetch(img, dest)
        print(f"[done]  {dest} ({os.path.getsize(dest)} bytes)", flush=True)
    print("ALL DONE", flush=True)
