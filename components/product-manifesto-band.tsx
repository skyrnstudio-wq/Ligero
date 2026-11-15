import { Product } from "@/lib/products";

interface ProductManifestoBandProps {
  product: Product;
}

export default function ProductManifestoBand({
  product,
}: ProductManifestoBandProps) {
  return (
    <section
      aria-label="Atelier Philosophy"
      className="relative my-6 overflow-hidden border-y border-pdp-hairline bg-gradient-to-r from-pdp-base via-pdp-surface to-pdp-base py-10 sm:my-20 sm:py-24"
    >
      {/* Dynamic ambient radial gradients matching the active fragrance glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,var(--pdp-glow)_0%,transparent_70%)] opacity-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--pdp-accent)_12%,transparent)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--pdp-accent)_16%,transparent)_0%,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-10 lg:px-12">
        <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.24em] text-pdp-accent">
          Atelier Philosophy · Botanical Formulation
        </p>

        <blockquote className="mt-3 font-display text-xl font-light italic leading-snug tracking-[-0.01em] text-pdp-text sm:mt-4 sm:text-3xl lg:text-[2.35rem]">
          &ldquo;We do not rush what takes time in stillness to awaken.
          Every flacon of {product.name} is an uncompromised composition of raw
          botanicals, harvested at dawn and distilled into skin intimacy.&rdquo;
        </blockquote>

        <div className="mt-5 flex items-center justify-center gap-3 font-body text-xs text-pdp-muted sm:mt-8">
          <span className="h-px w-8 bg-pdp-accent/40" />
          <span>Ligero Atelier de Parfum</span>
          <span className="h-px w-8 bg-pdp-accent/40" />
        </div>

        {/* 3 Craftsmanship Pillars with subtle gradient borders */}
        <div className="mt-7 grid grid-cols-3 gap-2 sm:mt-12 sm:gap-4 lg:gap-6">
          <div className="group rounded border border-pdp-hairline/80 bg-pdp-base/90 p-3 text-left md:backdrop-blur-sm transition-all duration-300 hover:border-pdp-accent/50 hover:bg-pdp-base/95 sm:p-5">
            <span className="font-display text-xl font-normal text-pdp-accent sm:text-2xl">
              EdP
            </span>
            <p className="mt-1 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-pdp-text sm:text-xs sm:tracking-[0.14em]">
              Eau de Parfum
            </p>
            <p className="mt-1 hidden font-body text-[11px] leading-relaxed text-pdp-muted sm:block">
              Artisanal botanical concentration that bonds with skin temperature throughout the day.
            </p>
          </div>

          <div className="group rounded border border-pdp-hairline/80 bg-pdp-base/90 p-3 text-left md:backdrop-blur-sm transition-all duration-300 hover:border-pdp-accent/50 hover:bg-pdp-base/95 sm:p-5">
            <span className="font-display text-xl font-normal text-pdp-accent sm:text-2xl">
              Batch
            </span>
            <p className="mt-1 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-pdp-text sm:text-xs sm:tracking-[0.14em]">
              Small-Batch Blending
            </p>
            <p className="mt-1 hidden font-body text-[11px] leading-relaxed text-pdp-muted sm:block">
              Handcrafted in limited batches to preserve the delicate integrity of raw botanicals.
            </p>
          </div>

          <div className="group rounded border border-pdp-hairline/80 bg-pdp-base/90 p-3 text-left md:backdrop-blur-sm transition-all duration-300 hover:border-pdp-accent/50 hover:bg-pdp-base/95 sm:p-5">
            <span className="font-display text-xl font-normal text-pdp-accent sm:text-2xl">
              0%
            </span>
            <p className="mt-1 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-pdp-text sm:text-xs sm:tracking-[0.14em]">
              Phthalates &amp; Dyes
            </p>
            <p className="mt-1 hidden font-body text-[11px] leading-relaxed text-pdp-muted sm:block">
              Zero synthetic masking fixatives. Only grain alcohol and botanical distillates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
