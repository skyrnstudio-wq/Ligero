"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <h2 className="font-display text-3xl font-light italic mb-4">
        Something went wrong
      </h2>
      <button
        onClick={() => reset()}
        className="border-b border-[#a98442] pb-1 text-xs uppercase tracking-[0.22em] transition-colors hover:text-[#a98442]"
      >
        Try again
      </button>
    </div>
  );
}
