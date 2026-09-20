import { Jimp } from "jimp";

const img = await Jimp.read("public/images/brand/logo-original.png");
const { width, height, data } = img.bitmap;

// accent shape around x495-520, y445-475, 1px columns / 2px rows
for (let y = 440; y < 480; y += 2) {
  let line = "";
  for (let x = 480; x < 560; x += 1) {
    let inked = false;
    for (let dy = 0; dy < 2; dy++)
      if (data[((y + dy) * width + x) * 4 + 3] > 20) { inked = true; break; }
    line += inked ? "#" : ".";
  }
  console.log(String(y).padStart(3) + " " + line);
}
