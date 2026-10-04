"use client";

import { useState } from "react";

export default function PrivateSalon() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [received, setReceived] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("This email is missing an @. Check the address.");
      return;
    }
    setError(null);
    setReceived(true);
  };

  return (
    <section
      aria-label="The Private Salon"
      className="relative overflow-hidden bg-[#101418] text-[#EAE6DC] py-24 sm:py-28 lg:py-36 border-t border-[#3A3F45]/80"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 40%, rgba(185, 151, 91, 0.12) 0%, rgba(16, 20, 24, 0) 75%),
          url('/images/textures/dark-silk-canvas.webp')
        `,
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "100% 100%, 360px 360px",
      }}
    >
      {/* Delicate Inner Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50"
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 sm:px-10 text-center">
        <div className="border border-[#3A3F45]/80 bg-[#151A1F]/80 p-8 sm:p-14 backdrop-blur-xs shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-[#B9975B]/40" />
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#B9975B]">
              The Private Salon
            </p>
            <span className="h-px w-6 bg-[#B9975B]/40" />
          </div>

          <h2 className="mt-4 font-display text-3xl font-light italic text-[#F4EFE6] sm:text-4xl">
            Private releases. Olfactory previews. Reserved for our patrons.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A9A69C] leading-relaxed max-w-md mx-auto">
            Receive seasonal dispatches and private allocations of limited small-batch macerations.
          </p>

          {received ? (
            <div className="mt-8 border-t border-[#3A3F45]/60 pt-6">
              <p className="font-display text-xl font-light italic text-[#F4EFE6]">
                Welcome. An invitation arrives with our next private dispatch.
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#B9975B]">
                Four letters a year. Nothing else.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-8">
              <label htmlFor="salon-email" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col gap-4 sm:flex-row items-stretch">
                <input
                  id="salon-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "salon-error" : undefined}
                  className="w-full flex-1 border-b border-[#3A3F45] bg-transparent py-3 px-1 font-body text-[#EAE6DC] placeholder:text-[#A9A69C]/60 focus:border-[#B9975B] focus:outline-none"
                />
                <button
                  type="submit"
                  className="border border-[#B9975B] bg-[#B9975B] px-8 py-3 text-xs uppercase tracking-[0.22em] text-[#101418] font-medium transition-all hover:border-[#EAE6DC] hover:bg-[#EAE6DC] active:scale-[0.98] sm:self-center text-center whitespace-nowrap"
                >
                  Join the Salon
                </button>
              </div>
              {error && (
                <p
                  id="salon-error"
                  role="alert"
                  className="mt-3 text-left text-xs text-[#E57373]"
                >
                  {error}
                </p>
              )}
              <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#A9A69C]/70">
                Four letters a year. Nothing else.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
