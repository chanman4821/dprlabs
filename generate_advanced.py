"""Advanced cinematic footage (T2V) — intelligence / reasoning motifs.

More advanced than the pipeline loop: a growing reasoning-lattice / emergent-
intelligence bloom in the royal cyan + yellow palette on deep black. Rendered at
a SAFE resolution (832x480, proven stable on this GPU) then upscaled by ffmpeg.

Usage: python generate_advanced.py [idfilter]
"""
import json, os, sys, time, urllib.request, urllib.parse, uuid

COMFY = os.environ.get("COMFY_SERVER", "http://127.0.0.1:8188")
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "assets", "video")
os.makedirs(OUT, exist_ok=True)

T2V_HIGH = "wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors"
T2V_LOW = "wan2.2_t2v_low_noise_14B_fp8_scaled.safetensors"
UMT5 = "umt5_xxl_fp8_e4m3fn_scaled.safetensors"
WAN_VAE = "wan_2.1_vae.safetensors"

NEG = ("text, words, letters, numbers, glyphs, symbols, ui text, watermark, logo, "
       "glowing brain, humanoid robot, android, face, person, people, hands, "
       "neon rainbow, oversaturated, glossy plastic, lens flare, bloom, "
       "fast motion, shaky, camera shake, flicker, low quality, blurry, jpeg artifacts, deformed")

# id, prompt, w, h, length
JOBS = [
    ("reason-bloom",
     "In deep abyssal black, a delicate lattice of fine cyan light filaments slowly "
     "branches and blooms outward from a single point like a growing decision tree; a few "
     "branches brighten and extend deeper while others gently dim and fade away, and one "
     "small warm yellow node ignites softly at the chosen path. Volumetric haze, extremely "
     "slow deliberate growth, cinematic, elegant, restrained, vast empty black negative space, "
     "fine film grain.",
     832, 480, 81),
    ("reason-converge",
     "On deep black, many thin cyan pulses of light travel inward through a sparse three "
     "dimensional web of small nodes, converging slowly toward a center where they resolve "
     "into a single steady yellow point of light. Calm, deliberate, cinematic depth of field, "
     "instrument-panel restraint, huge dark negative space, fine film grain, no glow bloom.",
     832, 480, 81),
    ("deep-think",
     "Looking into a vast dark volume where countless fine faint cyan particles drift and "
     "very slowly organize themselves into a faint coherent lattice structure, a sense of "
     "quiet emergent order forming out of noise, one soft yellow accent, immense scale, "
     "serene, cinematic, deep black, minimal, fine film grain.",
     832, 480, 81),
]


def workflow(prompt, w, h, length, seed):
    steps, split = 20, 10
    return {
        "clip": {"class_type": "CLIPLoader", "inputs": {"clip_name": UMT5, "type": "wan"}},
        "pos": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["clip", 0]}},
        "neg": {"class_type": "CLIPTextEncode", "inputs": {"text": NEG, "clip": ["clip", 0]}},
        "vae": {"class_type": "VAELoader", "inputs": {"vae_name": WAN_VAE}},
        "latent": {"class_type": "EmptyHunyuanLatentVideo",
                   "inputs": {"width": w, "height": h, "length": length, "batch_size": 1}},
        "unet_hi": {"class_type": "UNETLoader", "inputs": {"unet_name": T2V_HIGH, "weight_dtype": "default"}},
        "ms_hi": {"class_type": "ModelSamplingSD3", "inputs": {"model": ["unet_hi", 0], "shift": 8.0}},
        "k_hi": {"class_type": "KSamplerAdvanced",
                 "inputs": {"model": ["ms_hi", 0], "add_noise": "enable", "noise_seed": seed,
                            "steps": steps, "cfg": 3.5, "sampler_name": "euler", "scheduler": "simple",
                            "positive": ["pos", 0], "negative": ["neg", 0], "latent_image": ["latent", 0],
                            "start_at_step": 0, "end_at_step": split, "return_with_leftover_noise": "enable"}},
        "unet_lo": {"class_type": "UNETLoader", "inputs": {"unet_name": T2V_LOW, "weight_dtype": "default"}},
        "ms_lo": {"class_type": "ModelSamplingSD3", "inputs": {"model": ["unet_lo", 0], "shift": 8.0}},
        "k_lo": {"class_type": "KSamplerAdvanced",
                 "inputs": {"model": ["ms_lo", 0], "add_noise": "disable", "noise_seed": seed,
                            "steps": steps, "cfg": 3.5, "sampler_name": "euler", "scheduler": "simple",
                            "positive": ["pos", 0], "negative": ["neg", 0], "latent_image": ["k_hi", 0],
                            "start_at_step": split, "end_at_step": 10000, "return_with_leftover_noise": "disable"}},
        "decode": {"class_type": "VAEDecode", "inputs": {"samples": ["k_lo", 0], "vae": ["vae", 0]}},
        "save": {"class_type": "VHS_VideoCombine",
                 "inputs": {"images": ["decode", 0], "frame_rate": 16.0, "loop_count": 0,
                            "filename_prefix": "dpradv", "format": "video/h264-mp4",
                            "pingpong": False, "save_output": True}},
    }


def post(wf):
    data = json.dumps({"prompt": wf, "client_id": str(uuid.uuid4())}).encode()
    req = urllib.request.Request(f"{COMFY}/prompt", data=data, headers={"Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req).read())["prompt_id"]


def wait(pid, timeout=1200):
    s = time.time()
    while time.time() - s < timeout:
        h = json.loads(urllib.request.urlopen(f"{COMFY}/history/{pid}").read())
        if pid in h and h[pid].get("outputs"):
            return h[pid]
        time.sleep(3)
    raise TimeoutError(pid)


def fetch(info, dest):
    q = urllib.parse.urlencode({"filename": info["filename"], "subfolder": info.get("subfolder", ""),
                                "type": info.get("type", "output")})
    with open(dest, "wb") as f:
        f.write(urllib.request.urlopen(f"{COMFY}/view?{q}").read())


if __name__ == "__main__":
    flt = sys.argv[1] if len(sys.argv) > 1 else ""
    jobs = [j for j in JOBS if flt in j[0]] if flt else JOBS
    for i, (jid, prompt, w, h, length) in enumerate(jobs):
        seed = 909 + i * 373
        t0 = time.time()
        print(f"[adv] {jid} {w}x{h} {length}f seed={seed}", flush=True)
        hist = wait(post(workflow(prompt, w, h, length, seed)))
        vids = []
        for node_out in hist["outputs"].values():
            for key in ("gifs", "videos", "images"):
                for it in node_out.get(key, []):
                    if str(it.get("filename", "")).endswith(".mp4"):
                        vids.append(it)
        if not vids:
            print(f"  !! no mp4 for {jid}", flush=True); continue
        dest = os.path.join(OUT, f"{jid}.mp4")
        fetch(vids[0], dest)
        print(f"  -> {dest} {os.path.getsize(dest)/1e6:.2f} MB in {time.time()-t0:.0f}s", flush=True)
    print("ADVANCED DONE", flush=True)
