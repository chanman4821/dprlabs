"""Wan 2.2 I2V — animate the cinematic hero-pipeline still into a seamless flowing loop.

Takes assets/images/cinematic/hero-pipeline.png and produces a subtle premium motion
loop (teal data flowing along the conduit) into assets/video/hero-pipeline.mp4.
"""
import json, os, shutil, sys, time, urllib.request, urllib.parse, uuid

COMFY = "http://127.0.0.1:8188"
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "assets", "video")
os.makedirs(OUT, exist_ok=True)
COMFY_INPUT = r"C:\AI\ComfyUI\input"

I2V_HIGH = "wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors"
I2V_LOW = "wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors"
UMT5 = "umt5_xxl_fp8_e4m3fn_scaled.safetensors"
WAN_VAE = "wan_2.1_vae.safetensors"

SRC = os.path.join(ROOT, "assets", "images", "cinematic", "hero-pipeline.png")
IMG_NAME = "dpr_hero_pipeline.png"

PROMPT = ("Small bright teal packets of light flow smoothly along the inside of the glowing "
          "conduit pipeline, gentle continuous motion, the amber node softly pulses, faint "
          "drifting haze, calm cinematic, very slow deliberate motion, seamless")
NEG = ("text, words, letters, numbers, watermark, logo, people, person, face, hands, "
       "fast motion, shaky, camera shake, zoom, morphing shapes, flicker, distortion, "
       "extra objects, low quality, blurry, jpeg artifacts, deformed, oversaturated, neon rainbow")

W, H, LEN = 1280, 720, 81
STEPS, SPLIT, SEED = 20, 10, 4242


def workflow():
    return {
        "img": {"class_type": "LoadImage", "inputs": {"image": IMG_NAME}},
        "clip": {"class_type": "CLIPLoader", "inputs": {"clip_name": UMT5, "type": "wan"}},
        "pos": {"class_type": "CLIPTextEncode", "inputs": {"text": PROMPT, "clip": ["clip", 0]}},
        "neg": {"class_type": "CLIPTextEncode", "inputs": {"text": NEG, "clip": ["clip", 0]}},
        "vae": {"class_type": "VAELoader", "inputs": {"vae_name": WAN_VAE}},
        "i2v": {"class_type": "WanImageToVideo",
                "inputs": {"positive": ["pos", 0], "negative": ["neg", 0], "vae": ["vae", 0],
                           "width": W, "height": H, "length": LEN, "batch_size": 1,
                           "start_image": ["img", 0]}},
        "unet_hi": {"class_type": "UNETLoader", "inputs": {"unet_name": I2V_HIGH, "weight_dtype": "default"}},
        "ms_hi": {"class_type": "ModelSamplingSD3", "inputs": {"model": ["unet_hi", 0], "shift": 8.0}},
        "k_hi": {"class_type": "KSamplerAdvanced",
                 "inputs": {"model": ["ms_hi", 0], "add_noise": "enable", "noise_seed": SEED,
                            "steps": STEPS, "cfg": 3.5, "sampler_name": "euler", "scheduler": "simple",
                            "positive": ["i2v", 0], "negative": ["i2v", 1], "latent_image": ["i2v", 2],
                            "start_at_step": 0, "end_at_step": SPLIT, "return_with_leftover_noise": "enable"}},
        "unet_lo": {"class_type": "UNETLoader", "inputs": {"unet_name": I2V_LOW, "weight_dtype": "default"}},
        "ms_lo": {"class_type": "ModelSamplingSD3", "inputs": {"model": ["unet_lo", 0], "shift": 8.0}},
        "k_lo": {"class_type": "KSamplerAdvanced",
                 "inputs": {"model": ["ms_lo", 0], "add_noise": "disable", "noise_seed": SEED,
                            "steps": STEPS, "cfg": 3.5, "sampler_name": "euler", "scheduler": "simple",
                            "positive": ["i2v", 0], "negative": ["i2v", 1], "latent_image": ["k_hi", 0],
                            "start_at_step": SPLIT, "end_at_step": 10000, "return_with_leftover_noise": "disable"}},
        "decode": {"class_type": "VAEDecode", "inputs": {"samples": ["k_lo", 0], "vae": ["vae", 0]}},
        "save": {"class_type": "VHS_VideoCombine",
                 "inputs": {"images": ["decode", 0], "frame_rate": 16.0, "loop_count": 0,
                            "filename_prefix": "dprI2V", "format": "video/h264-mp4",
                            "pingpong": False, "save_output": True}},
    }


def post(wf):
    data = json.dumps({"prompt": wf, "client_id": str(uuid.uuid4())}).encode()
    req = urllib.request.Request(f"{COMFY}/prompt", data=data, headers={"Content-Type": "application/json"})
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
    q = urllib.parse.urlencode({"filename": info["filename"], "subfolder": info.get("subfolder", ""),
                                "type": info.get("type", "output")})
    with open(dest, "wb") as f:
        f.write(urllib.request.urlopen(f"{COMFY}/view?{q}").read())


if __name__ == "__main__":
    os.makedirs(COMFY_INPUT, exist_ok=True)
    shutil.copy(SRC, os.path.join(COMFY_INPUT, IMG_NAME))
    print(f"[i2v] copied start image -> {IMG_NAME}; queuing {W}x{H} {LEN}f", flush=True)
    t0 = time.time()
    hist = wait(post(workflow()))
    vids = []
    for node_out in hist["outputs"].values():
        for key in ("gifs", "videos", "images"):
            for it in node_out.get(key, []):
                if str(it.get("filename", "")).endswith(".mp4"):
                    vids.append(it)
    if not vids:
        print("!! no mp4 in outputs: " + str(list(hist["outputs"].keys())), flush=True)
        sys.exit(1)
    dest = os.path.join(OUT, "hero-pipeline.mp4")
    fetch(vids[0], dest)
    print(f"[i2v] -> {dest}  {os.path.getsize(dest)/1e6:.2f} MB in {time.time()-t0:.0f}s", flush=True)
    print("I2V DONE", flush=True)
