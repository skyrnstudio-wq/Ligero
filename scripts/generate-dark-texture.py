import os
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

def generate_dark_silk_texture():
    os.makedirs("public/images/textures", exist_ok=True)
    width, height = 512, 512
    
    # Deep espresso noir tone: #151311 -> RGB (21, 19, 17)
    base_r, base_g, base_b = 21, 19, 17
    
    # 1. High frequency tactile paper/silk noise
    noise = np.random.normal(0, 3.2, (height, width))
    
    # 2. Horizontal weft threads
    y_lines = np.sin(np.linspace(0, 128 * np.pi, height))[:, None]
    y_noise = np.random.normal(0, 1.0, (height, width))
    weft = (y_lines * 1.5 + y_noise)
    
    # 3. Vertical warp threads
    x_lines = np.sin(np.linspace(0, 128 * np.pi, width))[None, :]
    x_noise = np.random.normal(0, 1.0, (height, width))
    warp = (x_lines * 1.5 + x_noise)
    
    # 4. Organic mottle
    low_freq = gaussian_filter(np.random.normal(0, 4.0, (height, width)), sigma=16)
    
    total_tex = noise * 0.45 + weft * 0.45 + warp * 0.45 + low_freq * 0.6
    
    # Seamless tile wrap
    blend_w = 48
    for i in range(blend_w):
        alpha = i / blend_w
        total_tex[:, i] = total_tex[:, i] * alpha + total_tex[:, -(blend_w - i)] * (1 - alpha)
        total_tex[i, :] = total_tex[i, :] * alpha + total_tex[-(blend_w - i), :] * (1 - alpha)
        
    r = np.clip(base_r + total_tex * 1.1, 0, 255).astype(np.uint8)
    g = np.clip(base_g + total_tex * 1.0, 0, 255).astype(np.uint8)
    b = np.clip(base_b + total_tex * 0.9, 0, 255).astype(np.uint8)
    
    img = Image.fromarray(np.stack([r, g, b], axis=-1))
    img.save("public/images/textures/dark-silk-canvas.webp", "WEBP", quality=95)
    print("Generated dark-silk-canvas.webp")

if __name__ == "__main__":
    generate_dark_silk_texture()
