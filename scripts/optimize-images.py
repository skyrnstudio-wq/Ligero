#!/usr/bin/env python3
"""
Optimizes public/images assets using Pillow (Lanczos resampling) + cwebp.
- Converts tray.jpeg and fleur-tray.jpeg to WebP
- Caps oversized editorial/notes photos at high-DPI display bounds
- Preserves exact canvas dimensions for normalized transparent bottle cutouts
- Only replaces files when the optimized output is strictly smaller
"""

import os
import glob
import subprocess
import tempfile
from PIL import Image


def encode_webp(src_path: str, dst_path: str, max_dim: int | None, quality: int, alpha_quality: int | None):
    with Image.open(src_path) as im:
        w, h = im.size
        has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
        if has_alpha:
            im = im.convert("RGBA")
        else:
            im = im.convert("RGB")

        if max_dim and max(w, h) > max_dim:
            ratio = max_dim / max(w, h)
            new_size = (max(1, round(w * ratio)), max(1, round(h * ratio)))
            im = im.resize(new_size, Image.Resampling.LANCZOS)

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tf_png:
            tmp_png = tf_png.name
        with tempfile.NamedTemporaryFile(suffix=".webp", delete=False) as tf_webp:
            tmp_webp = tf_webp.name

        try:
            im.save(tmp_png, "PNG")
            cmd = ["cwebp", "-quiet", "-q", str(quality), "-m", "6"]
            if has_alpha and alpha_quality is not None:
                cmd += ["-alpha_q", str(alpha_quality)]
            cmd += [tmp_png, "-o", tmp_webp]
            subprocess.run(cmd, check=True)

            new_bytes = os.path.getsize(tmp_webp)
            if os.path.exists(dst_path):
                old_bytes = os.path.getsize(dst_path)
                if new_bytes >= old_bytes:
                    return old_bytes, old_bytes, False

            os.replace(tmp_webp, dst_path)
            return os.path.getsize(src_path) if src_path != dst_path else old_bytes, new_bytes, True
        finally:
            if os.path.exists(tmp_png):
                os.unlink(tmp_png)
            if os.path.exists(tmp_webp):
                os.unlink(tmp_webp)


def profile_for(path: str):
    norm = path.replace("\\", "/")
    if "/cutouts/" in norm or "ligero-parfum-cutout.webp" in norm:
        return None, 82, 92
    if "/objects/" in norm:
        if "floating" in norm:
            return 1400, 82, 92
        return 1400, 80, None
    if "/notes/" in norm:
        return 1150, 80, None
    if "/textures/" in norm:
        return None, 95, None
    return 1440, 80, None


def main():
    total_before = 0
    total_after = 0

    # 1. Convert legacy tray JPEGs to WebP
    for legacy_jpg in [
        "public/images/perfumes/tray.jpeg",
        "public/images/perfumes/fleur-tray.jpeg",
    ]:
        if os.path.exists(legacy_jpg):
            target_webp = os.path.splitext(legacy_jpg)[0] + ".webp"
            q = 90 if "fleur-tray" in legacy_jpg else 82
            before = os.path.getsize(legacy_jpg)
            _, after, _ = encode_webp(legacy_jpg, target_webp, 1440, q, None)
            print(f"Converted {legacy_jpg} ({before // 1024} KB) -> {target_webp} ({after // 1024} KB)")

    # 2. Optimize all WebP assets in public/images
    for path in sorted(glob.glob("public/images/**/*.webp", recursive=True)):
        before = os.path.getsize(path)
        total_before += before
        max_dim, q, alpha_q = profile_for(path)
        _, after, replaced = encode_webp(path, path, max_dim, q, alpha_q)
        total_after += after
        status = "OPTIMIZED" if replaced else "KEPT"
        print(f"[{status:9s}] {before // 1024:5d} KB -> {after // 1024:5d} KB | {path}")

    saved = total_before - total_after
    print(f"\nWebP Totals: {total_before / (1024 * 1024):.2f} MB -> {total_after / (1024 * 1024):.2f} MB (saved {saved / (1024 * 1024):.2f} MB)")


if __name__ == "__main__":
    main()
