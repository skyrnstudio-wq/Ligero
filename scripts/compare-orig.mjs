import { Jimp } from "jimp";

const img = await Jimp.read("public/images/brand/logo-original.png");
const { width, height, data } = img.bitmap;
console.log("original size:", width, "x", height);

// wordmark band y481-704 per earlier scan. Look at top rows y455-520 for accent above letters.
for (let y = 450; y < 530; y += 4) {
  let line = "";
  for (let x = 151; x < 1170; x += 8) {
    let inked = false;
    for (let dy = 0; dy < 4 && y + dy < height; dy++)
      for (let dx = 0; dx < 8 && x + dx < width; dx++)
        if (data[((y + dy) * width + (x + dx)) * 4 + 3] > 20) { inked = true; break; }
    line += inked ? "#" : ".";
  }
  console.log(String(y).padStart(3) + " " + line);
}
