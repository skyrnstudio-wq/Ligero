"use client";

import { useState } from "react";
import Link from "next/link";
import type { HomepageData } from "@/lib/sanity/data";

/**
 * The Correspondence (site-blueprint.md §2, §4, §5, brand-voice §5).
 * Closing section before the footer.
 * Supports default centered layout or horizontal D.S. & DURGA strip variant.
 */
export default function PrivateSalon({
  data,
  variant = "default",
}: {
  data?: HomepageData | null;
  variant?: "default" | "strip";
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [received, setReceived] = useState(false);

  const promise = data?.patronsPromise || "Four letters a year. Nothing else.";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("This email is missing an @. Check the address.");
      return;
    }
    setError(null);
    setReceived(true);
  };

  if (variant === "strip") {
    return (
      <section
        id="correspondence"
        aria-labelledby="correspondence-strip-heading"
        className="border-t border-pdp-hairline bg-pdp-surface py-12 text-pdp-text sm:py-16"
      >
        <div className="mx-auto flex max-w-[96rem] flex-col justify-between gap-8 px-6 sm:px-10 lg:flex-row lg:items-end lg:px-16">
          <div className="max-w-md">
            <h2
              id="correspondence-strip-heading"
              className="font-body text-base font-normal leading-snug text-pdp-text sm:text-lg"
            >
              Subscribe to receive a complimentary sample vial with your first order
            </h2>
            <p className="mt-1.5 font-body text-xs text-pdp-muted">
              {promise}{" "}
              <Link
                href="/legal/privacy"
                className="underline underline-offset-2 hover:text-pdp-accent"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="w-full max-w-md">
            {received ? (
              <p
                role="status"
                className="border-b border-pdp-text pb-2 font-display text-xl font-light italic text-pdp-text"
              >
                Received. A person answers within a day.
              </p>
            ) : (
              <form onSubmit={submit} noValidate>
                <label
                  htmlFor="correspondence-strip-email"
                  className="block font-body text-[10px] uppercase tracking-[0.18em] text-pdp-muted"
                >
                  Email
                </label>
                <div className="mt-1 flex items-center border-b border-pdp-text pb-2">
                  <input
                    id="correspondence-strip-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@domain.com"
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                      error ? "correspondence-strip-error" : undefined
                    }
                    className="w-full bg-transparent font-body text-sm text-pdp-text placeholder:text-pdp-muted/60 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to the Correspondence"
                    className="ml-3 inline-flex h-8 w-8 shrink-0 items-center justify-center text-pdp-text transition-transform duration-200 hover:translate-x-1 hover:text-pdp-accent"
                  >
                    <span aria-hidden="true" className="text-base leading-none">
                      →
                    </span>
                  </button>
                </div>
                {error && (
                  <p
                    id="correspondence-strip-error"
                    role="alert"
                    className="mt-2 font-body text-xs text-pdp-error"
                  >
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="correspondence"
      aria-labelledby="correspondence-heading"
      className="border-t border-aube-hairline bg-aube-surface py-20 text-aube-text sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-2xl px-6 sm:px-10">
        <h2
          id="correspondence-heading"
          className="font-display text-3xl font-light italic text-aube-text sm:text-4xl"
        >
          The Correspondence
        </h2>
        <p className="mt-3 text-base text-aube-text-muted">{promise}</p>

        {received ? (
          <div
            className="mt-8 border-t border-aube-hairline pt-6"
            role="status"
          >
            <p className="font-display text-2xl font-light italic text-aube-text">
              Received. A person answers within a day.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-8">
            <label
              htmlFor="correspondence-email"
              className="block text-xs uppercase tracking-[0.18em] text-aube-text-muted"
            >
              Email address
            </label>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-stretch">
              <input
                id="correspondence-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? "correspondence-error" : "correspondence-consent"
                }
                className="w-full flex-1 border border-aube-hairline bg-aube-base px-4 py-3.5 text-base text-aube-text focus:border-aube-accent focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-12 border border-aube-text bg-aube-text px-7 py-3.5 text-xs uppercase tracking-[0.22em] text-aube-base transition-colors hover:border-aube-accent hover:bg-aube-accent whitespace-nowrap"
              >
                Request the Correspondence
              </button>
            </div>
            {error && (
              <p
                id="correspondence-error"
                role="alert"
                className="mt-2 text-xs text-aube-error"
              >
                {error}
              </p>
            )}
            <p
              id="correspondence-consent"
              className="mt-4 text-xs text-aube-text-muted"
            >
              Subscribing shares your email with us, for four letters a year and
              nothing else. Unsubscribe anytime.{" "}
              <Link
                href="/legal/privacy"
                className="underline underline-offset-2 hover:text-aube-accent"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
