import os
import numpy as np
from PIL import Image

def generate_raw_silk_texture():
    os.makedirs("public/images/textures", exist_ok=True)
    width, height = 512, 512
    
    # Base Aube color: #F3EDE3 -> RGB (243, 237, 227)
    base_r, base_g, base_b = 243, 237, 227
    
    # 1. High frequency grain (fine tactile paper noise)
    noise = np.random.normal(0, 3.5, (height, width))
    
    # 2. Horizontal weft threads (silk fiber lines)
    y_lines = np.sin(np.linspace(0, 128 * np.pi, height))[:, None]
    y_noise = np.random.normal(0, 1.2, (height, width))
    weft = (y_lines * 1.8 + y_noise)
    
    # 3. Vertical warp threads (linen weave)
    x_lines = np.sin(np.linspace(0, 128 * np.pi, width))[None, :]
    x_noise = np.random.normal(0, 1.2, (height, width))
    warp = (x_lines * 1.8 + x_noise)
    
    # 4. Subtle larger organic fiber mottling (clouds / pulp)
    from scipy.ndimage import gaussian_filter
    low_freq = gaussian_filter(np.random.normal(0, 6.0, (height, width)), sigma=18)
    med_freq = gaussian_filter(np.random.normal(0, 3.0, (height, width)), sigma=4)
    
    # Combine texture channels
    total_tex = noise * 0.45 + weft * 0.5 + warp * 0.5 + low_freq * 0.7 + med_freq * 0.5
    
    # Make seamlessly tileable by blending edges
    blend_w = 48
    for i in range(blend_w):
        alpha = i / blend_w
        total_tex[:, i] = total_tex[:, i] * alpha + total_tex[:, -(blend_w - i)] * (1 - alpha)
        total_tex[i, :] = total_tex[i, :] * alpha + total_tex[-(blend_w - i), :] * (1 - alpha)
        
    # Apply to RGB channels with slight warm hue variation
    r = np.clip(base_r + total_tex * 1.05, 0, 255).astype(np.uint8)
    g = np.clip(base_g + total_tex * 0.98, 0, 255).astype(np.uint8)
    b = np.clip(base_b + total_tex * 0.88, 0, 255).astype(np.uint8)
    
    img_array = np.stack([r, g, b], axis=-1)
    img = Image.fromarray(img_array)
    
    # Save both WebP and PNG
    img.save("public/images/textures/raw-silk-canvas.webp", "WEBP", quality=95)
    img.save("public/images/textures/raw-silk-canvas.png", "PNG")
    print(f"Generated raw silk canvas texture: {width}x{height} (WebP size: {os.path.getsize('public/images/textures/raw-silk-canvas.webp')} bytes)")

if __name__ == "__main__":
    generate_raw_silk_texture()
