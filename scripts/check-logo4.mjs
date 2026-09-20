import { Jimp } from "jimp";

const img = await Jimp.read("public/images/ligero-logo.png");
const { width, height, data } = img.bitmap;

// apostrophe was at original x636-692 → crop offset X0=152 → x484-540 in new image
for (let y = 0; y < 55; y += 2) {
  let line = "";
  for (let x = 440; x < 600; x += 2) {
    let inked = false;
    for (let dy = 0; dy < 2 && y + dy < height; dy++)
      if (data[((y + dy) * width + x) * 4 + 3] > 20) { inked = true; break; }
    line += inked ? "#" : ".";
  }
  console.log(String(y).padStart(2) + " " + line);
}
