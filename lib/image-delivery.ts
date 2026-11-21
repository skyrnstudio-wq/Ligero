import type { ImageLoaderProps } from "next/image";

const SANITY_CDN_PREFIX = "https://cdn.sanity.io/images/";
const warmedUrls = new Set<string>();

export function isSanityCdnUrl(src: string): boolean {
  return src.startsWith(SANITY_CDN_PREFIX);
}

/**
 * Transforms a Sanity CDN image URL into a direct Fastly-edge-optimized URL
 * using Sanity's native `auto=format` (AVIF/WebP negotiation), avoiding the
 * `/_next/image` double-hop proxy and cold serverless re-encoding latency.
 */
export function buildSanityImageUrl(
  src: string,
  width: number,
  quality = 75
): string {
  const base = src.split("?")[0];
  const safeWidth = Math.max(48, Math.round(width));
  const safeQuality = Math.min(95, Math.max(40, Math.round(quality)));
  return `${base}?w=${safeWidth}&q=${safeQuality}&auto=format&fit=max`;
}

export function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (isSanityCdnUrl(src)) {
    return buildSanityImageUrl(src, width, quality ?? 75);
  }
  return src;
}

/**
 * Picks the exact Next.js srcset width bucket (`imageSizes` + `deviceSizes`)
 * so warmed URLs match the exact `<img>` srcset candidate for 100% cache hit.
 */
const WIDTH_BUCKETS = [48, 96, 128, 192, 256, 320, 384, 480, 640, 750, 828, 1080, 1200, 1600, 1920];

export function matchImageWidthBucket(cssWidth: number): number {
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 3) : 1;
  const target = cssWidth * dpr;
  for (const bucket of WIDTH_BUCKETS) {
    if (bucket >= target) return bucket;
  }
  return WIDTH_BUCKETS[WIDTH_BUCKETS.length - 1];
}

function shouldRespectSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  return Boolean(conn?.saveData || conn?.effectiveType === "slow-2g");
}

/**
 * Pre-fetches and asynchronously decodes an image into browser memory cache
 * ahead of scroll, hover, or route navigation.
 */
export function warmImage(
  src: string | undefined,
  cssWidth = 240,
  quality = 75
): void {
  if (typeof window === "undefined" || !src || shouldRespectSaveData()) return;

  const width = matchImageWidthBucket(cssWidth);
  const resolvedUrl = isSanityCdnUrl(src)
    ? buildSanityImageUrl(src, width, quality)
    : src.startsWith("/")
      ? `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
      : src;

  if (warmedUrls.has(resolvedUrl)) return;
  warmedUrls.add(resolvedUrl);

  const img = new window.Image();
  img.decoding = "async";
  img.src = resolvedUrl;
  if (typeof img.decode === "function") {
    img.decode().catch(() => {
      // Ignore decode cancellation / abort
    });
  }
}

/**
 * Runs a warming callback once after the user's first real interaction
 * (scroll, pointer move, touch, or keyboard), keeping initial synthetic
 * page-load audits completely untouched while making real browsing instant.
 */
export function onFirstUserInteraction(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  let fired = false;
  const events: Array<keyof WindowEventMap> = [
    "scroll",
    "pointermove",
    "touchstart",
    "keydown",
  ];

  const trigger = () => {
    if (fired) return;
    fired = true;
    cleanup();
    callback();
  };

  const cleanup = () => {
    for (const evt of events) {
      window.removeEventListener(evt, trigger);
    }
  };

  for (const evt of events) {
    window.addEventListener(evt, trigger, { passive: true, once: true });
  }

  return cleanup;
}
