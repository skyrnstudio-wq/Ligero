"use client";

import { useState } from "react";

/**
 * Home section 6 (site-blueprint.md §4, layout family: form).
 * One email field, one promise. Client-side validation only;
 * a real endpoint arrives with the backend.
 */
export default function Correspondence() {
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
    <section className="bg-aube-base px-6 py-28 sm:px-10 lg:py-36">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-aube-accent">
          The Private Salon
        </p>

        {received ? (
          <p className="mt-8 font-display text-2xl font-light italic text-aube-text sm:text-3xl">
            Welcome. An invitation arrives with our next private dispatch.
          </p>
        ) : (
          <>
            <p className="mt-4 font-display text-2xl font-light italic text-aube-text sm:text-3xl lg:text-4xl">
              Private releases. Olfactory previews. Reserved for our patrons.
            </p>
            <p className="mt-3 text-sm text-aube-text-muted">
              Receive seasonal dispatches and private allocations of limited small-batch macerations.
            </p>
            <form onSubmit={submit} noValidate className="mt-8">
              <label htmlFor="correspondence-email" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  id="correspondence-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "correspondence-error" : undefined}
                  className="w-full flex-1 border-b border-aube-hairline bg-transparent py-3 font-body text-aube-text placeholder:text-aube-text-muted focus:border-aube-accent focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex-none self-start border-b border-aube-accent pb-1 text-xs uppercase tracking-[0.2em] text-aube-text transition-colors hover:text-aube-accent sm:self-center"
                >
                  Join the Salon
                </button>
              </div>
              {error && (
                <p
                  id="correspondence-error"
                  role="alert"
                  className="mt-3 text-left text-sm text-aube-accent"
                >
                  {error}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </section>
  );
}
