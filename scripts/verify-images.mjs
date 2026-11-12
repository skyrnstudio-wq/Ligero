import fs from "node:fs";
import path from "node:path";

const SLUGS = ["aube", "fleur", "ambre-doux", "noctis", "blanc", "maree", "noir-cacao"];
const exts = [".tsx", ".ts", ".jsx", ".js", ".html", ".css"];
function findFiles(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir)) {
    if (item === "node_modules" || item === ".git" || item === ".next" || item === ".next-dev") continue;
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) {
      res = res.concat(findFiles(p));
    } else if (exts.some((e) => p.endsWith(e))) {
      res.push(p);
    }
  }
  return res;
}

const files = findFiles(".");
const imgRegex = /["'`]((\/images\/[^"'`]+))["'`]/g;
let verified = 0;
let missing = 0;

for (const f of files) {
  const content = fs.readFileSync(f, "utf8");
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const rawUrl = match[1];
    if (rawUrl.includes("/**")) continue;

    const urlsToCheck = [];
    if (rawUrl.includes("${")) {
      for (const s of SLUGS) {
        urlsToCheck.push(rawUrl.replace(/\$\{[^}]+\}/g, s));
      }
    } else {
      urlsToCheck.push(rawUrl);
    }

    for (const url of urlsToCheck) {
      const cleanUrl = url.split("?")[0];
      const diskPath = path.join("public", cleanUrl.replace(/^\//, ""));
      if (!fs.existsSync(diskPath)) {
        console.error(`FAILED: in ${f} -> ${url} (not found at ${diskPath})`);
        missing++;
      } else {
        console.log(`VERIFIED: ${f} -> ${url}`);
        verified++;
      }
    }
  }
}

console.log(`\nResult: ${verified} image references verified, ${missing} missing.`);
if (missing > 0) process.exit(1);
