import { Jimp } from "jimp";

const img = await Jimp.read("public/images/brand/logo-original.png");
const { width, height, data } = img.bitmap;

// find ink columns in y440-477
const cols = [];
for (let x = 151; x < 1170; x++) {
  let inked = false;
  for (let y = 440; y < 478; y++)
    if (data[(y * width + x) * 4 + 3] > 20) { inked = true; break; }
  if (inked) cols.push(x);
}
console.log("accent ink columns y440-477:", cols.length ? `${cols[0]}-${cols[cols.length-1]} (${cols.length} cols)` : "none");

// fine render around found columns
if (cols.length) {
  const x0 = cols[0] - 10, x1 = cols[cols.length - 1] + 10;
  for (let y = 438; y < 482; y += 2) {
    let line = "";
    for (let x = x0; x < x1; x += 1) {
      let inked = false;
      for (let dy = 0; dy < 2; dy++)
        if (data[((y + dy) * width + x) * 4 + 3] > 20) { inked = true; break; }
      line += inked ? "#" : ".";
    }
    console.log(String(y).padStart(3) + " " + line);
  }
}
