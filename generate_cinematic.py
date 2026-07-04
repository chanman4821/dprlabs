"""Cinematic hero-centerpiece + section backdrops for Deeper (DPR).

Direction (from harness.io + cognition.ai references + user's cinematic/cosmic pick):
one BOLD, MEANINGFUL, cinematic centerpiece — a glowing agentic pipeline / flowing
wireframe mesh — with real depth, material and teal light, on deep-water/cosmic dark.
NOT scattered faint dots. Flux schnell fp8, premium quality.

Usage:
    python generate_cinematic.py            # all jobs
    python generate_cinematic.py hero       # only ids containing 'hero'
"""
import json, urllib.request, urllib.parse, time, os, uuid, sys

COMFY = "http://127.0.0.1:8188"
OUT = os.path.join(os.path.dirname(__file__), "assets", "images", "cinematic")
os.makedirs(OUT, exist_ok=True)

# Deep-water / cosmic, teal signal, premium cinematic. No AI-slop.
STYLE = (", cinematic, dramatic volumetric lighting, deep abyssal black background, "
         "teal and cyan accent light only, one warm amber highlight, fine 16mm film grain, "
         "shallow depth of field, ultra detailed, premium 3d render, moody, elegant, "
         "vast negative space, no text, no watermark, no people, no logo")

NEG_NOTE = "(Flux schnell ignores negative; anti-slop handled via prompt wording)"

# id, width, height, prompt
JOBS = [
    # ---- hero centerpiece candidates (16:9) ----
    ("hero-pipeline", 1536, 864,
     "A single sweeping glossy dark conduit pipeline curving through deep black space, "
     "brushed graphite and glass material with thin glowing teal seams, small bright teal "
     "data packets of light flowing along the inside of the pipe, soft rim light, one amber "
     "node glowing where the pipe forks, floating in vast empty darkness, product hero render"),
    ("hero-mesh", 1536, 864,
     "A flowing topographic wireframe mesh surface made of thin glowing teal lines rippling "
     "like a calm ocean of data, fading into deep black, a few brighter teal nodes at the "
     "crests and one soft amber point, sense of a living network surface, dark cinematic, "
     "elegant, minimal, huge negative space"),
    ("hero-constellation", 1536, 864,
     "An elegant three dimensional constellation of glowing teal nodes connected by thin "
     "luminous filaments, arranged like a calm neural pipeline receding into deep abyssal "
     "black with volumetric haze, gentle depth of field, one amber node, refined and "
     "restrained, cinematic product render, vast dark negative space"),
    ("hero-depth", 1536, 864,
     "Looking down into a deep dark ocean trench of pure black water lit by a single faint "
     "column of teal light from far above, suspended glowing particles like slow marine snow, "
     "immense scale and quiet, cinematic underwater atmosphere, minimal, moody"),
    # ---- section backdrops ----
    ("band-flow", 1600, 700,
     "Abstract dark band: thin streams of teal light flowing left to right through black "
     "space, motion-blur light trails, a few small amber pulses, instrument telemetry feel, "
     "very dark, cinematic, wide, empty edges"),
    ("band-grid", 1600, 700,
     "A faint teal perspective hairline grid receding into deep black fog like a sonar "
     "readout, a few distant glowing teal points, extremely minimal, calm, cinematic, dark"),
]


def workflow(prompt, w, h, seed):
    return {
        "4": {"class_type": "CheckpointLoaderSimple",
              "inputs": {"ckpt_name": "flux1-schnell-fp8.safetensors"}},
        "6": {"class_type": "CLIPTextEncode",
              "inputs": {"text": prompt + STYLE, "clip": ["4", 1]}},
        "10": {"class_type": "FluxGuidance",
               "inputs": {"conditioning": ["6", 0], "guidance": 3.2}},
        "7": {"class_type": "CLIPTextEncode", "inputs": {"text": "", "clip": ["4", 1]}},
        "5": {"class_type": "EmptySD3LatentImage",
              "inputs": {"width": w, "height": h, "batch_size": 1}},
        "3": {"class_type": "KSampler", "inputs": {
            "seed": seed, "steps": 6, "cfg": 1.0, "sampler_name": "euler",
            "scheduler": "simple", "denoise": 1.0,
            "model": ["4", 0], "positive": ["10", 0], "negative": ["7", 0],
            "latent_image": ["5", 0]}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
        "9": {"class_type": "SaveImage", "inputs": {"filename_prefix": "dprcin", "images": ["8", 0]}},
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
    flt = sys.argv[1] if len(sys.argv) > 1 else ""
    jobs = [j for j in JOBS if flt in j[0]] if flt else JOBS
    for i, (name, w, h, prompt) in enumerate(jobs):
        seed = 77 + i * 911
        t0 = time.time()
        print(f"[queue] {name} {w}x{h} seed={seed}", flush=True)
        hist = wait(post(workflow(prompt, w, h, seed)))
        img = hist["outputs"]["9"]["images"][0]
        dest = os.path.join(OUT, f"{name}.png")
        fetch(img, dest)
        print(f"[done]  {dest} ({os.path.getsize(dest)/1e6:.2f} MB) in {time.time()-t0:.0f}s", flush=True)
    print("CINEMATIC DONE", flush=True)
