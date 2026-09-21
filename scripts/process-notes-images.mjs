import sharp from "sharp";
import fs from "fs";
import path from "path";

const artifactDir = "C:/Users/skyrn/.gemini/antigravity-ide/brain/1c703da3-fd0a-4528-bada-d41eaf8ae9e3";
const targetDir = "public/images/perfumes/notes";

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const mapping = [
  { slug: "aube", file: "aube_notes_1789989250677.jpg" },
  { slug: "fleur", file: "fleur_notes_pure_1789989301794.jpg" },
  { slug: "ambre-doux", file: "ambredoux_notes_1789989323079.jpg" },
  { slug: "noctis", file: "noctis_notes_1789989351224.jpg" },
  { slug: "blanc", file: "blanc_notes_1789989377430.jpg" },
  { slug: "maree", file: "maree_notes_1789989403569.jpg" },
  { slug: "noir-cacao", file: "noircacao_notes_1789989427661.jpg" },
];

async function processImages() {
  for (const item of mapping) {
    const srcPath = path.join(artifactDir, item.file);
    const destWebp = path.join(targetDir, `${item.slug}.webp`);
    const destJpg = path.join(targetDir, `${item.slug}.jpg`);
    
    if (fs.existsSync(srcPath)) {
      await sharp(srcPath)
        .resize(1200, 1600, { fit: "cover" })
        .webp({ quality: 88 })
        .toFile(destWebp);
      
      await sharp(srcPath)
        .resize(1200, 1600, { fit: "cover" })
        .jpeg({ quality: 88 })
        .toFile(destJpg);
        
      console.log(`Processed ${item.slug} -> ${destWebp}`);
    } else {
      console.error(`Source not found: ${srcPath}`);
    }
  }
}

processImages().catch(console.error);
