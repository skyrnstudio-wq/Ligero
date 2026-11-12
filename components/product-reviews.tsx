"use client";

import { useId, useRef, useState } from "react";
import {
  REVIEW_LIMITS,
  WORN_FOR_LABEL,
  WORN_FOR_OPTIONS,
  summarizeReviews,
  type PublicReview,
} from "@/lib/reviews";

interface ProductReviewsProps {
  productSlug: string;
  productName: string;
  /** Approved reviews from the CMS. Empty when there are none, never placeholder data. */
  reviews: PublicReview[];
  isDark?: boolean;
}

type Errors = Partial<Record<"rating" | "name" | "email" | "body" | "form", string>>;

const INITIAL_VISIBLE = 5;

function Stars({ value, className = "" }: { value: number; className?: string }) {
  const safeVal = typeof value === "number" && !isNaN(value) ? value : 0;
  const rounded = Math.round(safeVal);
  return (
    <span className={className} role="img" aria-label={`${safeVal.toFixed(1).replace(/\.0$/, "")} out of 5`}>
      <span aria-hidden="true">
        {"★".repeat(rounded)}
        <span className="opacity-25">{"★".repeat(5 - rounded)}</span>
      </span>
    </span>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ProductReviews({
  productSlug,
  productName,
  reviews,
  isDark = false,
}: ProductReviewsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openedAt = useRef<number>(0);
  const uid = useId();

  const [showAll, setShowAll] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const summary = summarizeReviews(reviews);
  const visible = showAll ? reviews : reviews.slice(0, INITIAL_VISIBLE);

  const hairline = "border-pdp-hairline";
  const surface = "bg-pdp-surface";
  const muted = "text-pdp-muted";
  const accent = "text-pdp-accent";
  const solidButton =
    "border-pdp-btn bg-pdp-btn text-pdp-btn-text hover:bg-pdp-btn-hover";
  const field = `mt-2 w-full border ${hairline} bg-transparent px-3 py-3 text-base text-pdp-text placeholder:text-pdp-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pdp-accent`;
  const errorText = "text-pdp-error";

  const openForm = () => {
    openedAt.current = Date.now();
    setErrors({});
    setSent(false);
    dialogRef.current?.showModal();
  };

  const closeForm = () => dialogRef.current?.close();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const form = new FormData(e.currentTarget);
    const next: Errors = {};
    if (rating < 1) next.rating = "Choose a rating from one to five.";
    if (!String(form.get("name") || "").trim()) next.name = "Add the name to show on the review.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(form.get("email") || "").trim())) {
      next.email = "This email is not valid. Check the address.";
    }
    if (String(form.get("body") || "").trim().length < REVIEW_LIMITS.bodyMin) {
      next.body = `Write at least ${REVIEW_LIMITS.bodyMin} characters.`;
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setErrors({});
    setSending(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          perfumeSlug: productSlug,
          rating,
          name: form.get("name"),
          city: form.get("city"),
          email: form.get("email"),
          title: form.get("title"),
          body: form.get("body"),
          wornFor: form.get("wornFor"),
          website: form.get("website"),
          startedAt: openedAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSent(true);
        setRating(0);
        setBody("");
        (e.target as HTMLFormElement).reset();
      } else {
        setErrors(data.errors ?? { form: "The review could not be sent. Try again in a moment." });
      }
    } catch {
      setErrors({ form: "The review could not be sent. Check your connection and try again." });
    } finally {
      setSending(false);
    }
  };

  const shownRating = hoverRating || rating;

  return (
    <section id="reviews-section" aria-labelledby="reviews-heading" className="pt-8">
      <div className={`flex flex-col gap-5 border-b pb-8 sm:flex-row sm:items-end sm:justify-between ${hairline}`}>
        <div>
          <h2 id="reviews-heading" className="font-display text-3xl font-light italic sm:text-4xl">
            Reviews
          </h2>
          {summary && typeof summary.average === "number" ? (
            <p className={`mt-3 flex items-center gap-2 text-sm ${muted}`}>
              <Stars value={summary.average} className={`text-lg tracking-widest ${accent}`} />
              <span>
                {(summary.average ?? 0).toFixed(1)} from {summary.count} {summary.count === 1 ? "review" : "reviews"}
              </span>
            </p>
          ) : (
            <p className={`mt-3 max-w-md text-sm ${muted}`}>
              Nothing here yet. Wear {productName}, then write the first review.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={openForm}
          className={`inline-flex min-h-11 items-center justify-center border px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors ${solidButton}`}
        >
          Write a review
        </button>
      </div>

      {reviews.length > 0 && (
        <>
          <ul className="divide-y divide-pdp-hairline">
            {visible.map((r) => (
              <li key={r._id} className="py-8">
                <article>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Stars value={r.rating} className={`text-base tracking-widest ${accent}`} />
                    {r.purchaseChecked && (
                      <span className={`text-xs ${muted}`}>Purchase checked</span>
                    )}
                  </div>
                  {r.title && (
                    <h3 className="mt-3 font-display text-2xl font-normal leading-snug">{r.title}</h3>
                  )}
                  <p className="mt-3 max-w-[65ch] whitespace-pre-line text-base leading-relaxed">{r.body}</p>
                  <p className={`mt-4 text-sm ${muted}`}>
                    {r.name}
                    {r.city ? `, ${r.city}` : ""}
                    {r.submittedAt ? ` · ${formatDate(r.submittedAt)}` : ""}
                    {r.wornFor && WORN_FOR_LABEL[r.wornFor] ? ` · Worn for: ${WORN_FOR_LABEL[r.wornFor].toLowerCase()}` : ""}
                  </p>
                </article>
              </li>
            ))}
          </ul>

          {reviews.length > INITIAL_VISIBLE && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className={`min-h-11 border-b pb-0.5 text-xs uppercase tracking-[0.2em] ${hairline} hover:border-current`}
            >
              {showAll ? "Show fewer reviews" : `Show all ${reviews.length} reviews`}
            </button>
          )}
        </>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={`${uid}-title`}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeForm();
        }}
        className={`m-auto w-[min(92vw,34rem)] max-h-[92dvh] overflow-y-auto border p-0 backdrop:bg-black/70 ${hairline} ${surface} text-pdp-text`}
      >
        <div className="p-6 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <h3 id={`${uid}-title`} className="font-display text-3xl font-light italic">
              Review {productName}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              aria-label="Close the review form"
              className={`flex h-11 w-11 flex-none items-center justify-center border ${hairline} text-lg hover:border-current`}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          {sent ? (
            <div className="py-12" role="status">
              <p className={`font-display text-3xl font-light italic ${accent}`}>Received.</p>
              <p className={`mt-3 max-w-sm text-sm leading-relaxed ${muted}`}>
                The house reads every review before it appears. Yours will be on this page once it has been read.
              </p>
              <button
                type="button"
                onClick={closeForm}
                className={`mt-8 inline-flex min-h-11 items-center justify-center border px-6 py-3 text-xs uppercase tracking-[0.2em] ${solidButton}`}
              >
                Return to {productName}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-6">
              <fieldset>
                <legend className="text-sm font-medium">Rating</legend>
                <div
                  className="mt-2 flex items-center gap-1"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label
                      key={n}
                      onMouseEnter={() => setHoverRating(n)}
                      className={`relative flex h-11 w-11 cursor-pointer items-center justify-center text-3xl leading-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-pdp-accent ${
                        n <= shownRating ? accent : "opacity-30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={n}
                        checked={rating === n}
                        onChange={() => setRating(n)}
                        className="sr-only"
                        aria-describedby={errors.rating ? `${uid}-rating-error` : undefined}
                      />
                      <span aria-hidden="true">★</span>
                      <span className="sr-only">{n} out of 5</span>
                    </label>
                  ))}
                </div>
                {errors.rating && (
                  <p id={`${uid}-rating-error`} role="alert" className={`mt-2 text-sm ${errorText}`}>
                    {errors.rating}
                  </p>
                )}
              </fieldset>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-name`} className="block text-sm font-medium">
                    Name shown on the review
                  </label>
                  <input
                    id={`${uid}-name`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={REVIEW_LIMITS.name}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                    className={field}
                  />
                  {errors.name && (
                    <p id={`${uid}-name-error`} role="alert" className={`mt-2 text-sm ${errorText}`}>
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={`${uid}-city`} className="block text-sm font-medium">
                    City <span className={muted}>(optional)</span>
                  </label>
                  <input
                    id={`${uid}-city`}
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    maxLength={REVIEW_LIMITS.city}
                    className={field}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${uid}-email`} className="block text-sm font-medium">
                  Email
                </label>
                <p id={`${uid}-email-help`} className={`mt-1 text-sm ${muted}`}>
                  Never shown. The house uses it to check your order and to reply.
                </p>
                <input
                  id={`${uid}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={`${uid}-email-help${errors.email ? ` ${uid}-email-error` : ""}`}
                  className={field}
                />
                {errors.email && (
                  <p id={`${uid}-email-error`} role="alert" className={`mt-2 text-sm ${errorText}`}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={`${uid}-title-input`} className="block text-sm font-medium">
                  Title <span className={muted}>(optional)</span>
                </label>
                <input
                  id={`${uid}-title-input`}
                  name="title"
                  type="text"
                  maxLength={REVIEW_LIMITS.title}
                  className={field}
                />
              </div>

              <div>
                <label htmlFor={`${uid}-body`} className="block text-sm font-medium">
                  Your review
                </label>
                <textarea
                  id={`${uid}-body`}
                  name="body"
                  rows={5}
                  maxLength={REVIEW_LIMITS.bodyMax}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  aria-invalid={Boolean(errors.body)}
                  aria-describedby={`${uid}-body-count${errors.body ? ` ${uid}-body-error` : ""}`}
                  className={field}
                />
                <div className="mt-2 flex items-start justify-between gap-4 text-sm">
                  <div>
                    {errors.body && (
                      <p id={`${uid}-body-error`} role="alert" className={errorText}>
                        {errors.body}
                      </p>
                    )}
                  </div>
                  <span id={`${uid}-body-count`} className={`tabular-nums ${muted}`}>
                    {body.length} / {REVIEW_LIMITS.bodyMax}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor={`${uid}-worn`} className="block text-sm font-medium">
                  Worn for <span className={muted}>(optional)</span>
                </label>
                <select id={`${uid}-worn`} name="wornFor" defaultValue="" className={`${field} ${surface}`}>
                  <option value="">Not stated</option>
                  {WORN_FOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Honeypot: hidden from people and assistive tech, bots fill it in. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              {errors.form && (
                <p role="alert" className={`text-sm ${errorText}`}>
                  {errors.form}
                </p>
              )}

              <p className={`text-sm leading-relaxed ${muted}`}>
                Reviews appear once the house has read them. Your name, city and review are shown. Your email is not.
              </p>

              <button
                type="submit"
                disabled={sending}
                className={`inline-flex min-h-12 items-center justify-center border px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-60 ${solidButton}`}
              >
                {sending ? "Sending" : "Send the review"}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </section>
  );
}
