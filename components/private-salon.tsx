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
      id="maison"
      aria-label="The Private Salon"
      className="relative overflow-hidden bg-[#100b0a] text-[#f1ebe4] py-24 sm:py-28 lg:py-32 border-t border-[#f1ebe4]/10"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 40%, rgba(90, 36, 10, 0.22) 0%, rgba(16, 11, 10, 0) 75%),
          url('/assets/plates/cotton-canvas-texture.png')
        `,
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "100% 100%, 360px 120px",
      }}
    >
      {/* Delicate Inner Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60"
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 sm:px-10 text-center">
        <div className="border border-[#f1ebe4]/15 bg-[#171210]/90 p-8 sm:p-14 backdrop-blur-xs shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-[#5a240a]" />
            <p className="text-[11px] font-normal uppercase tracking-[0.28em] text-[#d48b59]">
              03 / The Private Salon
            </p>
            <span className="h-px w-6 bg-[#5a240a]" />
          </div>

          <h2
            className="mt-4 text-3xl sm:text-4xl font-normal text-[#f1ebe4] leading-tight"
            style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
          >
            Private releases. Olfactory previews. Reserved for our patrons.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#a9a39a] leading-relaxed max-w-md mx-auto font-light">
            Receive seasonal dispatches and private allocations of limited small-batch macerations.
          </p>

          {received ? (
            <div className="mt-8 border-t border-[#f1ebe4]/15 pt-6">
              <p
                className="text-xl sm:text-2xl font-light italic text-[#f1ebe4]"
                style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
              >
                Welcome. An invitation arrives with our next private dispatch.
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#d48b59]">
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
                  className="w-full flex-1 border-b border-[#f1ebe4]/30 bg-transparent py-3 px-1 text-[#f1ebe4] placeholder:text-[#a9a39a]/60 focus:border-[#d48b59] focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="border border-[#5a240a] bg-[#5a240a] px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-[#f1ebe4] transition-all hover:border-[#f1ebe4] hover:bg-[#f1ebe4] hover:text-[#100b0a] active:scale-[0.98] sm:self-center text-center whitespace-nowrap cursor-pointer"
                >
                  Join the Salon
                </button>
              </div>
              {error && (
                <p
                  id="salon-error"
                  role="alert"
                  className="mt-3 text-left text-xs text-[#e57373]"
                >
                  {error}
                </p>
              )}
              <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#a9a39a]/60">
                Four letters a year. Nothing else.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
