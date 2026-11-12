"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#15100c] text-[#f3ede3] flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h2 className="font-display text-3xl font-light italic mb-4">
            Something went wrong
          </h2>
          <p className="text-sm opacity-70 mb-6">
            An unexpected error occurred.
          </p>
          <button
            onClick={() => reset()}
            className="border-b border-[#a98442] pb-1 text-xs uppercase tracking-[0.22em] text-[#f3ede3] hover:text-[#a98442] transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
