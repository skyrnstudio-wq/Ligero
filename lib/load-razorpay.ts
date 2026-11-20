const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const RAZORPAY_LOAD_TIMEOUT_MS = 15_000;

let inFlightLoad: Promise<boolean> | null = null;

/**
 * Loads the Razorpay checkout.js script asynchronously with timeout,
 * deduplication of concurrent callers, and automatic cleanup on failure so retries work.
 */
export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
    return Promise.resolve(true);
  }

  if (inFlightLoad) {
    return inFlightLoad;
  }

  inFlightLoad = new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_SRC}"]`
    );

    // If a prior attempt left a failed or stale script tag in the DOM, remove it before retrying.
    if (existingScript) {
      if (existingScript.dataset.razorpayStatus === "loading") {
        // Still actively loading from another source; wait with timeout.
        let settled = false;
        const finish = (ok: boolean) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (!ok) inFlightLoad = null;
          resolve(ok);
        };
        const timer = window.setTimeout(() => finish(false), RAZORPAY_LOAD_TIMEOUT_MS);
        existingScript.addEventListener(
          "load",
          () => finish(Boolean((window as unknown as { Razorpay?: unknown }).Razorpay)),
          { once: true }
        );
        existingScript.addEventListener("error", () => finish(false), { once: true });
        return;
      }
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.dataset.razorpayStatus = "loading";

    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (!ok) {
        script.dataset.razorpayStatus = "error";
        script.remove();
        inFlightLoad = null;
      } else {
        script.dataset.razorpayStatus = "loaded";
      }
      resolve(ok);
    };

    const timer = window.setTimeout(() => {
      console.error("Timed out loading Razorpay SDK");
      finish(false);
    }, RAZORPAY_LOAD_TIMEOUT_MS);

    script.onload = () => {
      finish(Boolean((window as unknown as { Razorpay?: unknown }).Razorpay));
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      finish(false);
    };

    document.body.appendChild(script);
  });

  return inFlightLoad;
}
