import fs from "node:fs";
import path from "node:path";

const exts = [".tsx", ".ts", ".jsx", ".js", ".html", ".css"];
function findFiles(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir)) {
    if (item === "node_modules" || item === ".git" || item === ".next") continue;
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
    const url = match[1];
    const diskPath = path.join("public", url.replace(/^\//, ""));
    if (!fs.existsSync(diskPath)) {
      console.error(`FAILED: in ${f} -> ${url} (not found at ${diskPath})`);
      missing++;
    } else {
      console.log(`VERIFIED: ${f} -> ${url}`);
      verified++;
    }
  }
}

console.log(`\nResult: ${verified} image references verified, ${missing} missing.`);
if (missing > 0) process.exit(1);
