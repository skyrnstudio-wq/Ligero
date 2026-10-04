import Image from "next/image";

const HERO_IMAGE = "/images/hero/Hero-bg-feathered.webp";

/**
 * Home hero featuring the campaign photograph with seamless alpha-feathered negative space.
 * Rendered with object-contain to strictly prevent any cropping or zooming of the bottles.
 * The typography stack sits effortlessly in the raw-silk negative space on the left.
 */
export default function Hero() {
  return (
    <section
      aria-label="Ligero Parfum Campaign"
      className="relative flex min-h-[88svh] flex-col justify-between overflow-hidden bg-[#F3EDE3] lg:min-h-[90vh] lg:max-h-[960px] lg:flex-row lg:items-center border-b border-aube-hairline/70"
      style={{
        backgroundImage: `
          radial-gradient(circle at 25% 45%, rgba(255, 255, 255, 0.75) 0%, rgba(243, 237, 227, 0.5) 60%, rgba(243, 237, 227, 0) 85%),
          url('/images/textures/raw-silk-canvas.webp')
        `,
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "100% 100%, 360px 360px",
      }}
    >
      {/* Zero-zoom image container with seamless feathered left edge */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="Ligero Parfum bottles on white marble plinths against a sunlit plaster wall"
          fill
          priority
          sizes="100vw"
          className="object-contain object-bottom lg:object-right select-none"
        />
      </div>

      {/* Gentle raw-silk veil on the left so the typography has soft, effortless contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-2/5 bg-gradient-to-r from-[#F3EDE3] via-[#F3EDE3]/75 to-transparent lg:block"
      />
      {/* Tablet/mobile veil: covers the copy band so text never collides with the
          bottles — taller on phones (copy stacks deeper), 62% from sm up. The lower
          bottles stay fully visible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[72%] bg-gradient-to-b from-[#F3EDE3] via-[#F3EDE3]/95 to-transparent sm:h-[62%] lg:hidden"
      />

      {/* Typography stack */}
      <div className="relative z-10 flex px-6 pb-12 pt-32 sm:px-10 lg:items-center lg:px-16 lg:py-20 xl:px-24">
        <div className="max-w-[22rem] sm:max-w-[30rem] lg:max-w-[32rem] xl:max-w-[36rem]">
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-aube-text-muted">
              Ligero Parfum
            </p>
            <span className="h-px w-6 bg-aube-hairline" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-aube-accent font-medium">
              Ch. I–VII
            </p>
          </div>

          <h1 className="mt-5 font-display text-4xl font-light leading-[1.12] tracking-[-0.01em] text-aube-text sm:text-5xl lg:text-6xl xl:text-[4.15rem]">
            An intimate obsession.
            <span className="mt-2 block italic font-light text-aube-text">
              Crafted to be unforgettable.
            </span>
          </h1>

          <p className="mt-6 text-base leading-relaxed text-aube-text/85 sm:text-lg">
            Rare botanicals, slow-cured resins, and an intoxicating sillage designed to become your second skin. Indulge in an olfactory statement that lingers long after you leave.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="/collection"
              className="group inline-flex items-center gap-3 border-b border-aube-accent pb-1.5 text-xs uppercase tracking-[0.22em] text-aube-text transition-all hover:text-aube-accent hover:border-aube-text"
            >
              <span>Discover Your Signature</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>

            <span className="text-[11px] uppercase tracking-[0.18em] text-aube-text-muted">
              Rested 90 Days
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
