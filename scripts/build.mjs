import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const LOCK_FILE = path.resolve(".next-build.lock");
const NEXT_FONT_LOADER = path.resolve(
  "node_modules/next/dist/compiled/@next/font/dist/google/loader.js"
);

/**
 * Next.js 15 crashes in `next/font/google` when Google Fonts serves an
 * extensionless URL (e.g. `https://fonts.gstatic.com/l/font?kit=...`)
 * because `/\.(woff|woff2|eot|ttf|otf)$/.exec(url)[1]` dereferences `null`.
 * Fall back to `'woff2'` and prefer matching `.woff2` before `.woff`.
 */
function patchNextFontLoader() {
  if (!fs.existsSync(NEXT_FONT_LOADER)) return;
  const original = fs.readFileSync(NEXT_FONT_LOADER, "utf8");
  const safeLine =
    "const ext = (/\\.(woff2|woff|eot|ttf|otf)/.exec(googleFontFileUrl) || [])[1] || 'woff2';";

  if (original.includes(safeLine)) return;

  let updated = original;
  // Clean up any previous local debug wrapper if present
  updated = updated.replace(
    /[ \t]*if \(!\/\\\.\(woff\|woff2\|eot\|ttf\|otf\)\$\/\.test\(googleFontFileUrl\)\) \{\s*\n[ \t]*console\.error\("OFFENDING_URL:", JSON\.stringify\(googleFontFileUrl\), "FONT:", fontFamily\);\s*\n[ \t]*\}\s*\n/g,
    ""
  );
  updated = updated.replace(
    /const ext = .*?\.exec\(googleFontFileUrl\)[^;]*;/,
    safeLine
  );

  if (updated !== original) {
    fs.writeFileSync(NEXT_FONT_LOADER, updated, "utf8");
    console.log("Patched @next/font/google loader for extensionless font URLs.");
  }
}

function isPidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return false;
  }
}

async function acquireLock() {
  while (true) {
    try {
      const fd = fs.openSync(LOCK_FILE, "wx");
      fs.writeSync(fd, `${process.pid}\n`);
      fs.closeSync(fd);
      return () => {
        try {
          fs.unlinkSync(LOCK_FILE);
        } catch {}
      };
    } catch (e) {
      if (e.code === "EEXIST") {
        try {
          const content = fs.readFileSync(LOCK_FILE, "utf8").trim();
          const pid = parseInt(content, 10);
          if (isNaN(pid) || !isPidAlive(pid)) {
            try {
              fs.unlinkSync(LOCK_FILE);
            } catch {}
            continue;
          }
        } catch {
          try {
            fs.unlinkSync(LOCK_FILE);
          } catch {}
          continue;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        throw e;
      }
    }
  }
}

async function main() {
  patchNextFontLoader();
  if (process.argv.includes("--patch-only")) {
    return;
  }

  const releaseLock = await acquireLock();

  const cleanup = () => {
    releaseLock();
  };

  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit(130);
  });
  process.on("SIGTERM", () => {
    cleanup();
    process.exit(143);
  });

  const nextBin = path.resolve("node_modules/.bin/next");
  const child = spawn(nextBin, ["build"], {
    stdio: "inherit",
    env: { ...process.env },
  });

  child.on("close", (code, signal) => {
    cleanup();
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code ?? 0);
    }
  });
}

main().catch((err) => {
  console.error("Build failed:", err);
  try {
    fs.unlinkSync(LOCK_FILE);
  } catch {}
  process.exit(1);
});
