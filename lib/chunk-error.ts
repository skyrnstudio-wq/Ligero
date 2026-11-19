const CHUNK_RELOAD_STAMP_KEY = "ligero_chunk_reload_at";
const CHUNK_RELOAD_COOLDOWN_MS = 15_000;

const CHUNK_ERROR_MESSAGE_PATTERN =
  /Loading (?:CSS )?chunk [\w-]+ failed|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i;

/**
 * Returns true when an error (or promise rejection reason) represents a failed
 * lazy script/style chunk fetch across Webpack, Next.js, or native ESM loaders.
 */
export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  if (typeof error === "string") {
    return CHUNK_ERROR_MESSAGE_PATTERN.test(error);
  }
  if (typeof error !== "object") return false;

  const maybeError = error as { name?: unknown; message?: unknown };
  if (maybeError.name === "ChunkLoadError") return true;
  if (typeof maybeError.message === "string") {
    return CHUNK_ERROR_MESSAGE_PATTERN.test(maybeError.message);
  }
  return false;
}

/**
 * Triggers at most one guarded full-page reload within `cooldownMs` so stale
 * deployment hashes or transient edge drops recover without an infinite loop.
 * Returns true if a reload was initiated, false if suppressed or unavailable.
 */
export function attemptChunkErrorReload(
  cooldownMs: number = CHUNK_RELOAD_COOLDOWN_MS
): boolean {
  if (typeof window === "undefined") return false;

  try {
    const now = Date.now();
    const lastReloadRaw = window.sessionStorage.getItem(CHUNK_RELOAD_STAMP_KEY);
    const lastReload = lastReloadRaw ? Number(lastReloadRaw) : 0;

    if (!lastReload || Number.isNaN(lastReload) || now - lastReload > cooldownMs) {
      window.sessionStorage.setItem(CHUNK_RELOAD_STAMP_KEY, String(now));
      window.location.reload();
      return true;
    }
  } catch {
    // sessionStorage may be restricted; fall back to manual reload UI
  }

  return false;
}

/**
 * Retries a dynamic `import()` factory on transient chunk load failures before
 * propagating the error to an error boundary.
 */
export async function retryChunkImport<T>(
  importer: () => Promise<T>,
  retries = 2,
  delayMs = 300
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await importer();
    } catch (error) {
      lastError = error;
      if (!isChunkLoadError(error) || attempt === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }

  throw lastError;
}
