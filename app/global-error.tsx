"use client";

import { useEffect } from "react";
import { attemptChunkErrorReload, isChunkLoadError } from "@/lib/chunk-error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const chunkError = isChunkLoadError(error);

  useEffect(() => {
    if (chunkError) {
      attemptChunkErrorReload();
    }
  }, [chunkError]);

  const handleAction = () => {
    if (chunkError && typeof window !== "undefined") {
      window.location.reload();
      return;
    }
    reset();
  };

  return (
    <html lang="en">
      <body className="bg-[#15100c] text-[#f3ede3] flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h2 className="font-display text-3xl font-light italic mb-4">
            {chunkError ? "A newer version is available" : "Something went wrong"}
          </h2>
          <p className="text-sm opacity-70 mb-6">
            {chunkError
              ? "A required script bundle could not be loaded. Reload this page to fetch the latest release."
              : "An unexpected error occurred."}
          </p>
          <button
            onClick={handleAction}
            className="border-b border-[#a98442] pb-1 text-xs uppercase tracking-[0.22em] text-[#f3ede3] hover:text-[#a98442] transition-colors"
          >
            {chunkError ? "Reload page" : "Try again"}
          </button>
        </div>
      </body>
    </html>
  );
}
