"""Deeper (DPR) site videos via native ComfyUI Wan 2.2 T2V (RTX 5090).

Instrument-panel / deep-water aesthetic per Jarvis strategy. Anti-AI-slop:
no glowing brains, no robots, no neon swirl, no people, heavy negative space.

Each job renders an MP4 (h264) into assets/video/. 16 fps, length 4n+1.
The site loops these; "longer" durations come from seamless looping + stitching.

Usage:
    python generate_videos.py            # render all jobs
    python generate_videos.py hero       # render only jobs whose id contains 'hero'
"""
import json, os, sys, time, urllib.request, uuid

COMFY = os.environ.get("COMFY_SERVER", "http://127.0.0.1:8188")
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "assets", "video")
os.makedirs(OUT, exist_ok=True)

T2V_HIGH = "wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors"
T2V_LOW = "wan2.2_t2v_low_noise_14B_fp8_scaled.safetensors"
UMT5 = "umt5_xxl_fp8_e4m3fn_scaled.safetensors"
WAN_VAE = "wan_2.1_vae.safetensors"  # 14B Wan2.2 models use the 16-ch Wan2.1 VAE

NEG = (
    "text, words, letters, numbers, digits, glyphs, symbols, characters, "
    "chinese characters, japanese characters, asian characters, handwriting, "
    "captions, labels, subtitles, seven segment display, clock, ui text, "
    "glowing brain, humanoid robot, android, swirling particles, particle nebula, "
    "neon, rainbow, oversaturated, glossy, gloss, cgi sheen, plastic, lens flare, "
    "bloom, watermark, logo, signature, buttons, people, "
    "person, human face, hands, stock office, businessman, busy, cluttered, chaotic, "
    "fast motion, shaky, low quality, blurry, jpeg artifacts, deformed"
)

# id, prompt, width, height, length(frames @16fps; 4n+1)
JOBS = [
    ("hero-plate",
     "A near-black deep-water telemetry void. A faint perspective grid of thin hairlines "
     "recedes into the depth, subtle volumetric haze. A few barely visible teal pinpoints "
     "of light drift slowly like distant instrument LEDs far away in the dark. Extremely "
     "minimal, restrained, cinematic, shallow depth of field, fine 16mm film grain, mostly "
     "empty black negative space, very slow drift, calm.",
     832, 480, 81),
    ("accent-data-flow",
     "On a deep black background, a single thin teal line of light runs left to right "
     "carrying small discrete packets of light; each packet briefly brightens as it passes "
     "a small node checkpoint, then dims. Restrained instrument aesthetic, fine film grain, "
     "vast empty negative space, slow metronomic motion, no glow bloom.",
     768, 768, 81),
    ("accent-invoice",
     "Dark instrument panel: a vertical stack of plain dim blank rectangular cards, "
     "completely blank surfaces with no writing. One card at a time, a quiet thin teal "
     "horizontal scan-line sweeps slowly down a blank card and a single small soft amber "
     "dot appears at its edge, then fades. Minimal, deep-water dark, calm sequential motion, "
     "fine film grain, lots of empty black space, blank surfaces only.",
     608, 768, 81),
    ("accent-agents",
     "On deep black, a sparse scatter of a few small dim round teal dots connected by very "
     "thin faint lines. One dot sends a single thin teal line of light toward two other dots, "
     "then a tiny soft amber dot pulses once and fades. Only one or two lines glow at a time, "
     "vast empty black negative space, plain round dots with no markings, instrument-panel "
     "restraint, very slow deliberate motion, fine film grain.",
     832, 480, 81),
    ("demo-segment",
     "On deep-water-dark black, an abstract minimal constellation of a few small blank round "
     "teal dots joined by thin faint lines. A single thin teal line of light travels slowly "
     "from one dot along a gentle curve to another dot; then one small soft amber dot glows "
     "and eases brighter. Mostly empty black, plain dots with no markings, slow and deliberate, "
     "cinematic, fine film grain.",
     832, 480, 81),
]


def workflow(prompt, w, h, length, seed):
    steps = 20
    split = 10
    return {
        "clip": {"class_type": "CLIPLoader",
                 "inputs": {"clip_name": UMT5, "type": "wan"}},
        "pos": {"class_type": "CLIPTextEncode",
                "inputs": {"text": prompt, "clip": ["clip", 0]}},
        "neg": {"class_type": "CLIPTextEncode",
                "inputs": {"text": NEG, "clip": ["clip", 0]}},
        "vae": {"class_type": "VAELoader", "inputs": {"vae_name": WAN_VAE}},
        "latent": {"class_type": "EmptyHunyuanLatentVideo",
                   "inputs": {"width": w, "height": h, "length": length, "batch_size": 1}},
        "unet_hi": {"class_type": "UNETLoader",
                    "inputs": {"unet_name": T2V_HIGH, "weight_dtype": "default"}},
        "ms_hi": {"class_type": "ModelSamplingSD3",
                  "inputs": {"model": ["unet_hi", 0], "shift": 8.0}},
        "k_hi": {"class_type": "KSamplerAdvanced",
                 "inputs": {"model": ["ms_hi", 0], "add_noise": "enable",
                            "noise_seed": seed, "steps": steps, "cfg": 3.5,
                            "sampler_name": "euler", "scheduler": "simple",
                            "positive": ["pos", 0], "negative": ["neg", 0],
                            "latent_image": ["latent", 0],
                            "start_at_step": 0, "end_at_step": split,
                            "return_with_leftover_noise": "enable"}},
        "unet_lo": {"class_type": "UNETLoader",
                    "inputs": {"unet_name": T2V_LOW, "weight_dtype": "default"}},
        "ms_lo": {"class_type": "ModelSamplingSD3",
                  "inputs": {"model": ["unet_lo", 0], "shift": 8.0}},
        "k_lo": {"class_type": "KSamplerAdvanced",
                 "inputs": {"model": ["ms_lo", 0], "add_noise": "disable",
                            "noise_seed": seed, "steps": steps, "cfg": 3.5,
                            "sampler_name": "euler", "scheduler": "simple",
                            "positive": ["pos", 0], "negative": ["neg", 0],
                            "latent_image": ["k_hi", 0],
                            "start_at_step": split, "end_at_step": 10000,
                            "return_with_leftover_noise": "disable"}},
        "decode": {"class_type": "VAEDecode",
                   "inputs": {"samples": ["k_lo", 0], "vae": ["vae", 0]}},
        "save": {"class_type": "VHS_VideoCombine",
                 "inputs": {"images": ["decode", 0], "frame_rate": 16.0,
                            "loop_count": 0, "filename_prefix": "dprv",
                            "format": "video/h264-mp4", "pingpong": False,
                            "save_output": True}},
    }


def post(wf):
    data = json.dumps({"prompt": wf, "client_id": str(uuid.uuid4())}).encode()
    req = urllib.request.Request(f"{COMFY}/prompt", data=data,
                                 headers={"Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req).read())["prompt_id"]


def wait(pid, timeout=1800):
    s = time.time()
    while time.time() - s < timeout:
        h = json.loads(urllib.request.urlopen(f"{COMFY}/history/{pid}").read())
        if pid in h and h[pid].get("outputs"):
            return h[pid]
        time.sleep(3)
    raise TimeoutError(pid)


def fetch(info, dest):
    import urllib.parse
    q = urllib.parse.urlencode({"filename": info["filename"],
                                "subfolder": info.get("subfolder", ""),
                                "type": info.get("type", "output")})
    with open(dest, "wb") as f:
        f.write(urllib.request.urlopen(f"{COMFY}/view?{q}").read())


def main():
    flt = sys.argv[1] if len(sys.argv) > 1 else ""
    jobs = [j for j in JOBS if flt in j[0]] if flt else JOBS
    for i, (jid, prompt, w, h, length) in enumerate(jobs):
        seed = 4200 + i * 137
        t0 = time.time()
        print(f"[gen] {jid}  {w}x{h} {length}f seed={seed}", flush=True)
        hist = wait(post(workflow(prompt, w, h, length, seed)))
        # find the mp4 in outputs
        vids = []
        for node_out in hist["outputs"].values():
            for key in ("gifs", "videos", "images"):
                for it in node_out.get(key, []):
                    if str(it.get("filename", "")).endswith(".mp4"):
                        vids.append(it)
        if not vids:
            print(f"  !! no mp4 in outputs for {jid}: {list(hist['outputs'].keys())}", flush=True)
            continue
        dest = os.path.join(OUT, f"{jid}.mp4")
        fetch(vids[0], dest)
        mb = os.path.getsize(dest) / 1e6
        print(f"  -> {dest}  {mb:.2f} MB  in {time.time()-t0:.0f}s", flush=True)
    print("VIDEOS DONE", flush=True)


if __name__ == "__main__":
    main()
