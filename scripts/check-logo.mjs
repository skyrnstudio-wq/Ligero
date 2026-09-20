import { Jimp } from "jimp";

const img = await Jimp.read("public/images/ligero-logo.png");
const { width, height, data } = img.bitmap;

// Top 60 rows, full width, 3px vertical steps
for (let y = 0; y < 60; y += 3) {
  let line = "";
  for (let x = 0; x < width; x += 6) {
    let inked = false;
    for (let dy = 0; dy < 3 && y + dy < height; dy++)
      for (let dx = 0; dx < 6 && x + dx < width; dx++)
        if (data[((y + dy) * width + (x + dx)) * 4 + 3] > 20) { inked = true; break; }
    line += inked ? "#" : ".";
  }
  console.log(String(y).padStart(2) + " " + line);
}
