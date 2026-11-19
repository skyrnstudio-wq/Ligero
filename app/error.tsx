"use client";

import { useEffect } from "react";
import { attemptChunkErrorReload, isChunkLoadError } from "@/lib/chunk-error";

export default function ErrorBoundary({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <h2 className="font-display text-3xl font-light italic mb-4">
        {chunkError ? "A newer version is available" : "Something went wrong"}
      </h2>
      {chunkError && (
        <p className="mb-6 max-w-md text-sm opacity-75">
          A required script bundle could not be loaded. Reload this page to fetch the latest release.
        </p>
      )}
      <button
        onClick={handleAction}
        className="border-b border-[#a98442] pb-1 text-xs uppercase tracking-[0.22em] transition-colors hover:text-[#a98442]"
      >
        {chunkError ? "Reload page" : "Try again"}
      </button>
    </div>
  );
}
