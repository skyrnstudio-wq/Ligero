import os
import numpy as np
from PIL import Image
from rembg import remove

MAPPING = {
    "aube": "Aubée Sunrise Perfume Bottle.png",
    "fleur": "LIGÉRO Fleur Crystal Perfume Bottle.png",
    "ambre-doux": "Ligéro Ambre Doux Perfume Bottle.png",
    "noctis": "Noctis Amber Moon Perfume Bottle.png",
    "blanc": "LIGÉRO PARFUMS BLANC Luxury Bottle.png",
    "maree": "LIGÉRO MARÉE Luxury Perfume Bottle.png",
    "noir-cacao": "Noir Cacao Perfume Bottle.png",
}

SRC_DIR = "Perfumes Cutouts"
OUT_DIR = "public/images/perfumes/cutouts"
os.makedirs(OUT_DIR, exist_ok=True)

# Uniform canvas and bottle height so all 7 bottles render at the exact same height
CANVAS_W = 840
CANVAS_H = 1420
TARGET_BOTTLE_H = 1360
BOTTOM_Y = 1390  # top_y = 30

for slug, filename in MAPPING.items():
    src_path = os.path.join(SRC_DIR, filename)
    if not os.path.exists(src_path):
        print(f"Skipping {slug}, not found at {src_path}")
        continue

    img = Image.open(src_path)
    if img.mode == "RGBA":
        arr = np.array(img)
        rgba = img if arr[:, :, 3].min() < 50 else remove(img)
    else:
        rgba = remove(img)

    arr = np.array(rgba)
    alpha = arr[:, :, 3]
    arr[alpha < 18, 3] = 0
    clean_img = Image.fromarray(arr)

    solid = arr[:, :, 3] >= 60
    valid_rows = np.where(solid.sum(axis=1) >= 15)[0]
    valid_cols = np.where(solid.sum(axis=0) >= 15)[0]

    top, bottom = int(valid_rows[0]), int(valid_rows[-1])
    left, right = int(valid_cols[0]), int(valid_cols[-1])

    cropped = clean_img.crop((left, top, right + 1, bottom + 1))
    cw, ch = cropped.size

    scale = TARGET_BOTTLE_H / ch
    new_w = int(round(cw * scale))
    new_h = TARGET_BOTTLE_H
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    paste_x = (CANVAS_W - new_w) // 2
    paste_y = BOTTOM_Y - new_h
    canvas.paste(resized, (paste_x, paste_y), resized)

    canvas.save(os.path.join(OUT_DIR, f"{slug}.webp"), "WEBP", quality=95)
    print(f"Saved normalized {slug}: bottle={new_w}x{new_h} on {CANVAS_W}x{CANVAS_H}")

# Also generate the tilted Ligéro Parfums hero bottle cutout
hero_src = os.path.join(SRC_DIR, "Slanted LIGÉRO Amber Perfume Bottle.png")
if os.path.exists(hero_src):
    hero_img = Image.open(hero_src)
    hero_rgba = remove(hero_img)
    hero_arr = np.array(hero_rgba)
    hero_arr[hero_arr[:, :, 3] < 18, 3] = 0
    hero_clean = Image.fromarray(hero_arr)
    hero_solid = hero_arr[:, :, 3] >= 60
    h_rows = np.where(hero_solid.sum(axis=1) >= 15)[0]
    h_cols = np.where(hero_solid.sum(axis=0) >= 15)[0]
    pad = 24
    ht = max(0, int(h_rows[0]) - pad)
    hb = min(hero_clean.height - 1, int(h_rows[-1]) + pad)
    hl = max(0, int(h_cols[0]) - pad)
    hr = min(hero_clean.width - 1, int(h_cols[-1]) + pad)
    hero_cropped = hero_clean.crop((hl, ht, hr + 1, hb + 1))
    os.makedirs("public/images/hero", exist_ok=True)
    hero_cropped.save("public/images/hero/ligero-parfum-cutout.webp", "WEBP", quality=95)
    print(f"Saved hero cutout: {hero_cropped.size}")

print("All cutouts normalized to identical height!")
