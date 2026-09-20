import { Jimp } from "jimp";

const img = await Jimp.read("public/images/brand/logo-original.png");
const { width, height, data } = img.bitmap;

// Wordmark occupies y481-704. The apostrophe above the G sits at y~434-464,
// x636-692 (measured). Crop from just above the apostrophe to the band bottom,
// with a tight x-range around all wordmark ink.
const Y_TOP = 432;   // just above apostrophe top (ink starts ~434)
const Y_BOT = 704;

// find x extent of ink between Y_TOP..Y_BOT
let minX = Infinity, maxX = -1;
for (let y = Y_TOP; y <= Y_BOT; y++)
  for (let x = 0; x < width; x++)
    if (data[(y * width + x) * 4 + 3] > 20) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    }
const X0 = minX, X1 = maxX;
const w = X1 - X0 + 1, h = Y_BOT - Y_TOP + 1;
console.log("crop:", { x: X0, y: Y_TOP, w, h });

// edge ink check
function edgeHasInk(x0, y0, x1, y1) {
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++)
      if (data[(y * width + x) * 4 + 3] > 20) return true;
  return false;
}
console.log("edges:",
  edgeHasInk(X0, Y_TOP, X1, Y_TOP) ? "top✓" : "top-EMPTY",
  edgeHasInk(X0, Y_BOT, X1, Y_BOT) ? "bottom✓" : "bottom-EMPTY",
  edgeHasInk(X0, Y_TOP, X0, Y_BOT) ? "left✓" : "left-EMPTY",
  edgeHasInk(X1, Y_TOP, X1, Y_BOT) ? "right✓" : "right-EMPTY");

img.crop({ x: X0, y: Y_TOP, w, h });
await img.write("public/images/logo.png");
console.log("written:", w, "x", h);
