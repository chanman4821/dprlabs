"""Generate varied-palette project thumbnails for DPR (break the all-blue look)."""
import json, urllib.request, urllib.parse, time, os, uuid

COMFY = "http://127.0.0.1:8188"
IMG = os.path.join(os.path.dirname(__file__), "assets", "projects")
os.makedirs(IMG, exist_ok=True)

UI = (", realistic modern SaaS app screenshot, dark mode dashboard UI, clean product "
      "design, charts and graphs and KPI cards and side panels, crisp, dribbble behance "
      "quality, 4k, professional, no readable text, no watermark")

JOBS = [
    ("support", "an AI customer-support inbox app with conversation threads on the left and "
                "an AI suggested-reply panel on the right, teal and amber accents" + UI),
    ("invoices", "a finance and invoicing accounting dashboard with a data table of "
                 "transactions, total revenue numbers and a donut chart, emerald green "
                 "money accents" + UI),
    ("search", "an enterprise knowledge-search app with a search bar, a list of document "
               "results and a document preview pane, violet and indigo accents" + UI),
    ("forecast", "a fintech revenue analytics dashboard with big upward line charts, "
                 "candlestick style graphs, KPI metric cards showing growth, gold and "
                 "green accents, money and profit feel" + UI),
    ("agents", "an AI agent orchestration dashboard showing a node workflow diagram and "
               "live status panels and progress bars, hot pink and orange accents" + UI),
    ("vision", "a computer-vision quality-control dashboard with a grid of product photos, "
               "detection bounding boxes and accuracy metric charts, teal and orange "
               "accents" + UI),
]


def workflow(prompt, seed, w=1280, h=800):
    return {
        "4": {"class_type": "CheckpointLoaderSimple",
              "inputs": {"ckpt_name": "flux1-schnell-fp8.safetensors"}},
        "6": {"class_type": "CLIPTextEncode",
              "inputs": {"text": prompt, "clip": ["4", 1]}},
        "10": {"class_type": "FluxGuidance", "inputs": {"conditioning": ["6", 0], "guidance": 3.5}},
        "7": {"class_type": "CLIPTextEncode", "inputs": {"text": "", "clip": ["4", 1]}},
        "5": {"class_type": "EmptySD3LatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
        "3": {"class_type": "KSampler", "inputs": {
            "seed": seed, "steps": 6, "cfg": 1.0, "sampler_name": "euler",
            "scheduler": "simple", "denoise": 1.0,
            "model": ["4", 0], "positive": ["10", 0], "negative": ["7", 0], "latent_image": ["5", 0]}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
        "9": {"class_type": "SaveImage", "inputs": {"filename_prefix": "dprp", "images": ["8", 0]}},
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


if __name__ == "__main__":
    for i, (name, prompt) in enumerate(JOBS):
        print(f"[gen] {name}", flush=True)
        hist = wait(post(workflow(prompt, 3300 + i * 521)))
        fetch(hist["outputs"]["9"]["images"][0], os.path.join(IMG, f"{name}.png"))
        print(f"  -> {name} done", flush=True)
    print("PROJECTS DONE", flush=True)
