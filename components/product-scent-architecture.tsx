import Image from "next/image";
import { Product } from "@/lib/products";

interface ProductScentArchitectureProps {
  product: Product;
  isDark?: boolean;
}

/**
 * Full-width "Olfactory Notes" showcase (matching D.S. & DURGA PDP middle band).
 * Centered display heading followed by a 3-column horizontal botanical gallery where
 * each card pairs a tall portrait botanical plate with a vertical hairline divider
 * and a bottom-aligned ingredient note.
 */
export default function ProductScentArchitecture({
  product,
}: ProductScentArchitectureProps) {
  const ingredients =
    product.keyIngredients && product.keyIngredients.length > 0
      ? product.keyIngredients.slice(0, 3)
      : [
          {
            name: product.notesPoem[0] || "Opening Note",
            note: "Top / Head",
            description: product.scentProfile.top,
          },
          {
            name: product.notesPoem[1] || "Heart Note",
            note: "Heart",
            description: product.scentProfile.heart,
          },
          {
            name: product.notesPoem[2] || "Base Note",
            note: "Base / Anchor",
            description: product.scentProfile.base,
          },
        ];

  const primaryBotanical = `/images/perfumes/notes/${product.slug}.webp`;

  return (
    <section
      aria-labelledby="olfactory-notes-heading"
      className="relative overflow-hidden border-y border-pdp-hairline bg-gradient-to-b from-pdp-surface via-pdp-surface2/40 to-pdp-surface py-16 text-pdp-text sm:py-24"
    >
      {/* Soft atmospheric gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_15%,var(--pdp-glow)_0%,transparent_75%)] opacity-60"
      />

      <div className="relative mx-auto max-w-[104rem] px-6 sm:px-10 lg:px-16">
        <p className="text-center font-body text-[9.5px] font-semibold uppercase tracking-[0.24em] text-pdp-accent">
          Three-Tier Olfactory Architecture
        </p>

        <h2
          id="olfactory-notes-heading"
          className="mt-2 text-center font-display text-4xl font-normal tracking-[-0.01em] text-pdp-text sm:text-5xl lg:text-[3.5rem]"
        >
          Olfactory Notes
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-12">
          {ingredients.map((item) => {
            const imgSrc = primaryBotanical;

            return (
              <article
                key={item.name}
                className="grid grid-cols-[1.15fr_1fr] items-stretch gap-4 sm:gap-5"
              >
                {/* Left Portrait Botanical Plate + Vertical Black Hairline Rule */}
                <div className="relative border-r border-pdp-text/40 pr-3.5 sm:pr-4">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-pdp-surface2">
                    <Image
                      src={imgSrc}
                      alt={`${item.name} (${item.note}) — ${product.name} olfactory note`}
                      fill
                      sizes="(max-width: 768px) 52vw, 20vw"
                      className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                    />
                  </div>
                </div>

                {/* Right Bottom-Aligned Note Title, Origin & Description */}
                <div className="flex flex-col justify-end pb-1">
                  <p className="font-body text-[9px] uppercase tracking-[0.2em] text-pdp-muted">
                    {item.origin || item.note}
                  </p>
                  <h3 className="mt-1 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-pdp-text sm:text-xs">
                    {item.name}
                  </h3>
                  <p className="mt-2 font-body text-[11px] leading-relaxed text-pdp-muted sm:text-xs">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom-left subtle plate index indicator */}
        <div className="mt-8 flex items-center gap-3 font-body text-[10px] uppercase tracking-[0.2em] text-pdp-muted">
          <span aria-hidden="true">←</span>
          <span className="tabular-nums">01 / 03</span>
          <span aria-hidden="true">→</span>
          <span className="ml-2 text-pdp-text/75">
            {product.scentProfile.family} · Extrait de Parfum
          </span>
        </div>
      </div>
    </section>
  );
}
