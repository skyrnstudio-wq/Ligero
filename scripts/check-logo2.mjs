import { Jimp } from "jimp";

const img = await Jimp.read("public/images/ligero-logo.png");
const { width, height, data } = img.bitmap;

// fine: 1px cols sampled every 2, 2px rows sampled every 2, top 50 rows
for (let y = 0; y < 50; y += 2) {
  let line = "";
  for (let x = 380; x < 620; x += 2) {
    let inked = false;
    for (let dy = 0; dy < 2; dy++)
      if (data[((y + dy) * width + x) * 4 + 3] > 20) { inked = true; break; }
    line += inked ? "#" : ".";
  }
  console.log(String(y).padStart(2) + " " + line);
}
