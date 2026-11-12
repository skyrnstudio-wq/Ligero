import { Product } from "@/lib/products";

interface ProductRitualProps {
  product: Product;
}

export default function ProductRitual({ product }: ProductRitualProps) {
  const steps = [
    {
      num: "01",
      title: "Pulse Point Contact",
      desc: "Apply two measured presses directly to warm pulse points — the carotid artery at the base of the throat, inner wrists, and collarbone.",
      tip: "Never rub wrists together. Allow natural surface tension to preserve the volatile opening.",
    },
    {
      num: "02",
      title: "The Three-Minute Bloom",
      desc: "Wait three minutes without disturbing the mist. Body heat activates the botanical formulation, allowing the floral and spice heart notes to awaken.",
      tip: "The botanical resins require skin contact to begin their olfactory progression.",
    },
    {
      num: "03",
      title: "Enduring Metamorphosis",
      desc: "As the day progresses into evening, the base notes of weathered woods and resins deepen into an intimate skin scent that endures for 12+ hours.",
      tip: "Pairs seamlessly when layered with a lighter daytime mist across fabric collars.",
    },
  ];

  return (
    <section
      aria-labelledby="application-ritual-heading"
      className="relative mx-auto max-w-[96rem] px-6 py-16 sm:px-10 sm:py-24 lg:px-16"
    >
      {/* Soft gradient ambient glow in empty background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/2 h-72 w-96 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--pdp-glow)_0%,transparent_75%)] opacity-60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 bottom-10 h-64 w-64 rounded-full bg-gradient-to-tl from-pdp-accent/10 to-transparent blur-2xl"
      />

      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-pdp-hairline pb-8">
        <div>
          <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.24em] text-pdp-accent">
            The Sensory Ritual
          </p>
          <h2
            id="application-ritual-heading"
            className="mt-2 font-display text-3xl font-normal tracking-[-0.01em] text-pdp-text sm:text-4xl lg:text-[2.65rem] leading-[1.08]"
          >
            How to Wear {product.name}
          </h2>
        </div>
        <p className="max-w-md font-body text-xs leading-relaxed text-pdp-muted">
          Extrait de Parfum possesses three times the oil density of conventional Eau de Parfum. A measured ritual unlocks its full dimensional sillage.
        </p>
      </div>

      <div className="relative mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
        {steps.map((s) => (
          <article
            key={s.num}
            className="group relative flex flex-col justify-between overflow-hidden border border-pdp-hairline bg-gradient-to-b from-pdp-surface/80 via-pdp-surface2/40 to-pdp-base p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:border-pdp-accent/40 hover:shadow-lg"
          >
            {/* Top gradient highlight on hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-pdp-accent/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            <div>
              <span className="font-display text-3xl font-light text-pdp-accent/70 sm:text-4xl">
                {s.num}
              </span>
              <h3 className="mt-3 font-body text-xs font-semibold uppercase tracking-[0.16em] text-pdp-text sm:text-[13px]">
                {s.title}
              </h3>
              <p className="mt-3 font-body text-xs leading-relaxed text-pdp-muted">
                {s.desc}
              </p>
            </div>

            <div className="mt-6 border-t border-pdp-hairline/70 pt-4">
              <p className="font-body text-[11px] italic text-pdp-text/80">
                &ldquo;{s.tip}&rdquo;
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
