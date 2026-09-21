import sharp from "sharp";

async function convertToWebp() {
  const { data, info } = await sharp("public/images/hero/Hero-bg-169.jpg")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const featherWidth = 600; // 600px smoothstep dissolve

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < featherWidth; x++) {
      const idx = (y * width + x) * channels;
      const t = x / featherWidth;
      // Hermite smoothstep curve for silky transition
      const alpha = t * t * (3 - 2 * t);
      data[idx + 3] = Math.round(255 * alpha);
    }
  }

  const webpBuffer = await sharp(data, {
    raw: { width, height, channels }
  })
    .webp({ quality: 90, effort: 6 })
    .toBuffer();

  const fs = await import("fs");
  fs.writeFileSync("public/images/hero/Hero-bg-feathered.webp", webpBuffer);
  console.log(`Generated Hero-bg-feathered.webp: ${webpBuffer.length} bytes (${Math.round(webpBuffer.length / 1024)} KB)`);
}

convertToWebp().catch(console.error);
