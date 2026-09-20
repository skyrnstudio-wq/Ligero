import { Jimp } from "jimp";

const img = await Jimp.read("public/images/ligero-logo.png");
const { width, height, data } = img.bitmap;

for (let y = 0; y < height; y += 5) {
  let line = "";
  for (let x = 0; x < width; x += 5) {
    let inked = false;
    for (let dy = 0; dy < 5 && y + dy < height; dy++)
      for (let dx = 0; dx < 5 && x + dx < width; dx++)
        if (data[((y + dy) * width + (x + dx)) * 4 + 3] > 20) { inked = true; break; }
    line += inked ? "#" : ".";
  }
  console.log(String(y).padStart(3) + " " + line);
}
