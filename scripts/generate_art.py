"""
Builds the storefront's campaign plates.

The house owns product photography (bottles, seal) but no *sets*. Rather than
inventing sets procedurally — which reads as a gradient no matter how it's
dressed — this composites real photography: dark curtain, smoke, gold cloth,
sourced from Unsplash under a licence that permits commercial use. See
art/CREDITS.md.

Pillow does compositing only: cover-cropping, grading, masking, lighting,
shadow, reflection and grain. The product cut-outs are pasted at full fidelity
and are never redrawn, recoloured or regenerated.

Run: npm run art
Output: src/assets/images/generated/
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "src" / "assets" / "images"
STOCK = ROOT / "art" / "stock"
OUT = IMAGES / "generated"
OUT.mkdir(parents=True, exist_ok=True)


def precrop(image: Image.Image, box) -> Image.Image:
    """Trim by fractions (left, top, right, bottom) before framing."""
    l, tp, r, b = box
    w, h = image.size
    return image.crop((int(w * l), int(h * tp), int(w * r), int(h * b)))


def cover(image: Image.Image, size: tuple[int, int], focus=(0.5, 0.5)) -> Image.Image:
    """Scale to fill, then crop around a focal point — CSS object-fit: cover."""
    tw, th = size
    scale = max(tw / image.width, th / image.height)
    scaled = image.resize((max(int(image.width * scale), tw), max(int(image.height * scale), th)), Image.LANCZOS)
    fx, fy = focus
    left = int((scaled.width - tw) * fx)
    top = int((scaled.height - th) * fy)
    return scaled.crop((left, top, left + tw, top + th))


def grade(image: Image.Image, tint, exposure=0.78, saturation=1.06, blur=0.0) -> Image.Image:
    """Push the backdrop toward the fragrance's colour and hold it back from the product."""
    if blur:
        image = image.filter(ImageFilter.GaussianBlur(radius=blur))
    image = ImageEnhance.Color(image).enhance(saturation)
    arr = np.array(image, dtype=np.float64) / 255.0
    tint_arr = np.array(tint, dtype=np.float64) / 255.0
    # Soft-light style pull toward the tint, strongest in the mid-tones.
    luma = arr @ np.array([0.299, 0.587, 0.114])
    pull = (1.0 - np.abs(luma - 0.5) * 2.0)[..., None] * 0.32
    arr = arr * (1.0 - pull) + tint_arr[None, None, :] * luma[..., None] * pull * 2.0
    arr *= exposure
    return Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8))


def key_light(image: Image.Image, centre, radius=(0.62, 0.58), strength=0.34) -> Image.Image:
    """One broad soft source, so the product has somewhere to be lit from."""
    w, h = image.size
    ys, xs = np.mgrid[0:h, 0:w]
    xs = xs / max(w - 1, 1)
    ys = ys / max(h - 1, 1)
    d = np.sqrt(((xs - centre[0]) / radius[0]) ** 2 + ((ys - centre[1]) / radius[1]) ** 2)
    pool = np.clip(1.0 - d, 0.0, 1.0) ** 1.6
    arr = np.array(image, dtype=np.float64)
    arr += pool[..., None] * np.array([255, 244, 228]) * strength
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def floor(image: Image.Image, horizon=0.78, darkness=0.62) -> Image.Image:
    """Turn the lower band into a surface the product can stand on."""
    w, h = image.size
    ys = np.mgrid[0:h, 0:w][0] / max(h - 1, 1)
    ramp = np.clip((ys - horizon) / max(1e-6, 1.0 - horizon), 0.0, 1.0)
    arr = np.array(image, dtype=np.float64)
    arr *= (1.0 - darkness * ramp ** 0.75)[..., None]
    # A thin lift right at the horizon so the edge of the surface catches light.
    edge = np.exp(-(((ys - horizon) / 0.012) ** 2)) * 26.0
    arr += edge[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def overlay_smoke(image: Image.Image, smoke_path: Path, opacity=0.42, focus=(0.5, 0.35)) -> Image.Image:
    """Screen-blend real smoke over the backdrop."""
    smoke = cover(Image.open(smoke_path).convert("RGB"), image.size, focus=focus)
    smoke = smoke.filter(ImageFilter.GaussianBlur(radius=1.2))
    screened = ImageChops.screen(image, smoke)
    return Image.blend(image, screened, opacity)


def vignette(image: Image.Image, strength=0.55) -> Image.Image:
    w, h = image.size
    ys, xs = np.mgrid[0:h, 0:w]
    xs = xs / max(w - 1, 1)
    ys = ys / max(h - 1, 1)
    d = np.sqrt((xs - 0.5) ** 2 + (ys - 0.5) ** 2) / 0.78
    mask = np.clip(1.0 - strength * np.clip(d - 0.38, 0, None) ** 1.4, 0.0, 1.0)
    arr = np.array(image, dtype=np.float64) * mask[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def grain(image: Image.Image, amount=3.6, seed=7) -> Image.Image:
    rng = np.random.default_rng(seed)
    arr = np.array(image, dtype=np.float64)
    arr += rng.normal(0.0, amount, arr.shape[:2])[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def bloom(image: Image.Image, amount=0.22) -> Image.Image:
    blurred = image.filter(ImageFilter.GaussianBlur(radius=max(image.size) / 60))
    return ImageChops.blend(image, ImageChops.screen(image, blurred), amount)


def stand(plate: Image.Image, art: Image.Image, height_frac, centre, horizon=0.78, reflection=0.30, shadow_strength=0.80) -> Image.Image:
    """Stand a cut-out on the horizon with contact shadow and floor reflection."""
    gw, gh = plate.size
    target_h = int(gh * height_frac)
    scale = target_h / art.height
    obj = art.resize((max(int(art.width * scale), 1), target_h), Image.LANCZOS)

    x = int(gw * centre - obj.width / 2)
    base_y = int(gh * horizon)

    alpha = obj.split()[3]
    pool = alpha.resize((int(obj.width * 1.55), max(int(obj.height * 0.11), 2)), Image.LANCZOS)
    pool = pool.filter(ImageFilter.GaussianBlur(radius=max(gw, gh) / 85))
    shadow = Image.new("RGBA", pool.size, (0, 0, 0, 255))
    shadow.putalpha(pool.point(lambda v: int(v * shadow_strength)))
    plate.paste(shadow, (int(gw * centre - pool.width / 2), base_y - int(pool.height * 0.5)), shadow)

    mirror = obj.transpose(Image.FLIP_TOP_BOTTOM)
    fade = np.linspace(reflection, 0.0, mirror.height)[:, None]
    mirror.putalpha(Image.fromarray((np.array(mirror.split()[3], dtype=np.float64) * fade).astype(np.uint8)))
    mirror = mirror.filter(ImageFilter.GaussianBlur(radius=max(gw, gh) / 450))
    plate.paste(mirror, (x, base_y), mirror)

    plate.paste(obj, (x, base_y - obj.height), obj)
    return plate


PLATES = [
    # The supplied set: curtain, chess pieces, cherry, wood blocks, smoke. The
    # bottle rendered into it is not the house's product — its label is even
    # misspelled — so the real cut-out is stood in its place, sized to occlude
    # it completely. The top strip and corner watermark are cropped away.
    dict(name="hero", size=(2560, 1252), backdrop="hero-set-mockup.png",
         precrop=(0.0, 0.10, 1.0, 0.965), focus=(0.5, 0.5),
         tint=(150, 26, 30), art="dance_with_the_devil_cut.png",
         height=0.80, centre=0.508, light=(0.5, 0.42),
         smoke=None, smoke_opacity=0.0, blur=0.0, seed=11,
         horizon=0.876, floor_darkness=0.10, exposure=0.94, saturation=1.0,
         reflection=0.12, shadow=0.55),
    dict(name="tile-dance", size=(1600, 900), backdrop="IQ18KZMORk0.jpg", focus=(0.35, 0.5),
         tint=(150, 22, 28), art="dance_with_the_devil_cut.png", height=0.58, centre=0.70,
         light=(0.70, 0.34), smoke="VU6b_XHFuSE.jpg", smoke_opacity=0.26, blur=2.5, seed=23),
    dict(name="tile-fire", size=(1600, 900), backdrop="JKAKwrATVq8.jpg", focus=(0.5, 0.5),
         tint=(186, 74, 22), art="fire_in_the_hole_2_cut.png", height=0.58, centre=0.32,
         light=(0.32, 0.34), smoke="bHiA_pRM7yM.jpg", smoke_opacity=0.30, blur=1.5, seed=41),
    dict(name="tile-fire-two", size=(1200, 1600), backdrop="gf8J35yRBe8.jpg", focus=(0.5, 0.5),
         tint=(196, 152, 58), art="fire_in_the_hole_2_cut.png", height=0.52, centre=0.50,
         light=(0.5, 0.30), smoke=None, smoke_opacity=0.0, blur=4.0, seed=59),
    dict(name="tile-seal", size=(1600, 900), backdrop="_mNqvJhpzrg.jpg", focus=(0.5, 0.5),
         tint=(150, 22, 28), art="checkmate-seal-cut.png", height=0.44, centre=0.50,
         light=(0.5, 0.36), smoke="VU6b_XHFuSE.jpg", smoke_opacity=0.22, blur=3.0, seed=77),
]

DEFAULT_HORIZON = 0.80

for spec in PLATES:
    source = Image.open(STOCK / spec["backdrop"]).convert("RGB")
    if spec.get("precrop"):
        source = precrop(source, spec["precrop"])
    plate = cover(source, spec["size"], focus=spec["focus"])
    plate = grade(plate, spec["tint"], blur=spec["blur"],
                  exposure=spec.get("exposure", 0.78), saturation=spec.get("saturation", 1.06))
    if spec["smoke"]:
        plate = overlay_smoke(plate, STOCK / spec["smoke"], opacity=spec["smoke_opacity"])
    plate = key_light(plate, spec["light"])
    horizon = spec.get("horizon", DEFAULT_HORIZON)
    plate = floor(plate, horizon=horizon, darkness=spec.get("floor_darkness", 0.62))
    plate = vignette(plate)

    plate = plate.convert("RGBA")
    plate = stand(plate, Image.open(IMAGES / spec["art"]).convert("RGBA"), spec["height"], spec["centre"], horizon,
                  reflection=spec.get("reflection", 0.30), shadow_strength=spec.get("shadow", 0.80))

    plate = bloom(plate.convert("RGB"))
    plate = grain(plate, seed=spec["seed"])

    path = OUT / f"{spec['name']}.jpg"
    plate.save(path, quality=88, optimize=True, progressive=True)
    print(f"{path.relative_to(ROOT)}  {spec['size'][0]}x{spec['size'][1]}  {path.stat().st_size // 1024} kB")
