import os
from rembg import remove
from PIL import Image

perfumes = [
    ("aube", "public/images/perfumes/aube.jpeg"),
    ("noctis", "public/images/perfumes/noctis.jpeg"),
    ("maree", "public/images/perfumes/maree.jpeg"),
    ("ambre-doux", "public/images/perfumes/ambre-doux.jpeg"),
    ("blanc", "public/images/perfumes/blanc.jpeg"),
    ("noir-cacao", "public/images/perfumes/noir-cacao.jpeg"),
]

out_dir = "public/images/perfumes/cutouts"
os.makedirs(out_dir, exist_ok=True)

# Also check if noir-cutout already exists in 3d/
if os.path.exists("3d/noir-cutout.png"):
    img = Image.open("3d/noir-cutout.png")
    # Save optimized webp
    img.save(os.path.join(out_dir, "noir-cacao.webp"), "WEBP", quality=95)
    print("Saved noir-cacao.webp from 3d/noir-cutout.png")

for name, path in perfumes:
    if name == "noir-cacao" and os.path.exists(os.path.join(out_dir, "noir-cacao.webp")):
        continue
    if not os.path.exists(path):
        print(f"Skipping {name}, not found at {path}")
        continue
    print(f"Processing {name} from {path}...")
    inp = Image.open(path)
    # Resize to max 1200 if larger to speed up and keep crisp
    w, h = inp.size
    if max(w, h) > 1600:
        scale = 1600 / max(w, h)
        inp = inp.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    
    out = remove(inp)
    
    # Trim empty transparent borders to get exact bounding box
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
        # Add 20px padding around
        padded = Image.new("RGBA", (out.width + 40, out.height + 40), (0, 0, 0, 0))
        padded.paste(out, (20, 20))
        out = padded
        
    webp_path = os.path.join(out_dir, f"{name}.webp")
    out.save(webp_path, "WEBP", quality=92)
    png_path = os.path.join(out_dir, f"{name}.png")
    out.save(png_path, "PNG")
    print(f"Successfully created {name} cutout: {out.size}")

print("All cutouts completed!")
