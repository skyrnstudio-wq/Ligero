/**
 * One-off: remove the generator watermark (bottom-right corner) from
 * Hero-bg.jpg by cloning the clean plaster strip to its left, with
 * feathered edges so the patch blends into the wall gradient.
 *
 * Usage: node scripts/remove-watermark.mjs <in> <out>
 */
import { Jimp } from "jimp";

const IN = process.argv[2];
const OUT = process.argv[3];

if (!IN || !OUT) {
  console.error("usage: node scripts/remove-watermark.mjs <in> <out>");
  process.exit(1);
}

// Watermark bbox measured on the 1568x672 frame: x 1436-1548, y 602-652.
// Dest patch covers it with margin; source is the same-height strip
// immediately to the left (clean wall, same vertical shadow gradient).
const DEST = { x: 1424, y: 588, w: 140, h: 76 };
const SRC = { x: 1284, y: 588 };
const FEATHER = 14;

const img = await Jimp.read(IN);
const { width, height, data } = img.bitmap;

if (DEST.x + DEST.w > width || DEST.y + DEST.h > height) {
  throw new Error("dest rect outside image bounds");
}

const orig = Buffer.from(data); // pristine copy for reads

const weight = (xx, yy) => {
  const edge = Math.min(xx, yy, DEST.w - 1 - xx, DEST.h - 1 - yy);
  return Math.min(1, edge / FEATHER);
};

for (let yy = 0; yy < DEST.h; yy++) {
  for (let xx = 0; xx < DEST.w; xx++) {
    const ax = DEST.x + xx;
    const ay = DEST.y + yy;
    const si = (ay * width + (SRC.x + xx)) * 4;
    const di = (ay * width + ax) * 4;
    const w = weight(xx, yy);
    for (let c = 0; c < 3; c++) {
      data[di + c] = Math.round(orig[si + c] * w + orig[di + c] * (1 - w));
    }
    data[di + 3] = 255;
  }
}

await img.write(OUT);
console.log(`patched ${DEST.w}x${DEST.h} at (${DEST.x},${DEST.y}) -> ${OUT}`);
