import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const LOCK_FILE = path.resolve(".next-build.lock");

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
