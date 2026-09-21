import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = "public/images/brand/logo-art.png";
const OUT_DIR = "app"; // Next.js file-based metadata: app/icon.png etc.

// Brand palette (app/globals.css @theme).
const BG = { r: 243, g: 237, b: 227, alpha: 1 }; // raw silk
const ALPHA_THRESHOLD = 128; // ignore faint anti-aliasing when trimming
const MARK_FILL = 0.86; // mark height as a fraction of the square canvas
const CORNER_RADIUS = 0.22; // rounded-square mask, fraction of side

async function main() {
  const meta = await sharp(SRC).metadata();
  const { width: W, height: H, channels = 4 } = meta;

  // Detect the bounding box of non-transparent pixels so the mark fills the icon.
  const { data } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * channels + 3] > ALPHA_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) {
    console.error("Logo appears fully transparent — aborting.");
    process.exit(1);
  }

  console.log(`Source ${W}x${H}, content bbox: x ${minX}..${maxX}, y ${minY}..${maxY}`);
  const contentW = maxX - minX + 1;
  const contentH = maxY - minY + 1;

  // Square canvas: the (tall) mark spans MARK_FILL of the side, centered.
  const canvas = Math.round(contentH / MARK_FILL);

  // Extract the bbox, then center it on a square raw-silk canvas.
  const extracted = await sharp(SRC)
    .extract({ left: minX, top: minY, width: contentW, height: contentH })
    .png()
    .toBuffer();

  const square = await sharp({
    create: { width: canvas, height: canvas, channels: 4, background: BG },
  })
    .composite([{ input: extracted, gravity: "center" }])
    .png()
    .toBuffer();

  // Rounded-square mask (corners transparent, interior keeps the raw-silk bg).
  const radius = Math.round(canvas * CORNER_RADIUS);
  const mask = Buffer.from(
    `<svg width="${canvas}" height="${canvas}"><rect x="0" y="0" width="${canvas}" height="${canvas}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`
  );

  const roundedSquare = await sharp(square)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Main favicon (Next.js file-based metadata).
  await sharp(roundedSquare)
    .resize(256, 256, { kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, "icon.png"));

  // Apple touch icon: full-bleed raw silk (iOS applies its own corner mask,
  // and would fill any transparency with black).
  const appleMark = await sharp(roundedSquare)
    .resize(180, 180, { kernel: "lanczos3" })
    .png()
    .toBuffer();

  await sharp({
    create: { width: 180, height: 180, channels: 4, background: BG },
  })
    .composite([{ input: appleMark, gravity: "center" }])
    .png()
    .toFile(path.join(OUT_DIR, "apple-icon.png"));

  // Multi-size favicon.ico built from PNG-compressed entries (valid for modern browsers).
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map((s) => sharp(roundedSquare).resize(s, s, { kernel: "lanczos3" }).png().toBuffer())
  );

  let offset = 6 + 16 * pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4); // image count

  const dirEntries = pngs.map((png, i) => {
    const e = Buffer.alloc(16);
    const size = sizes[i];
    e[0] = size === 256 ? 0 : size; // 0 means 256
    e[1] = size === 256 ? 0 : size;
    e[2] = 0; // palette
    e[3] = 0; // reserved
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8); // data size
    e.writeUInt32LE(offset, 12); // data offset
    offset += png.length;
    return e;
  });

  const ico = Buffer.concat([header, ...dirEntries, ...pngs]);
  fs.writeFileSync(path.join(OUT_DIR, "favicon.ico"), ico);

  console.log("Wrote app/icon.png, app/apple-icon.png, app/favicon.ico");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
