import Image from "next/image";

const HERO_IMAGE = "/images/hero/Hero-bg-169.jpg";

/**
 * Home hero featuring the 16:9 campaign photograph.
 * Rendered with object-contain to strictly prevent any cropping or zooming.
 * The typography stack sits effortlessly in the negative space on the left.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-[85svh] flex-col justify-between overflow-hidden bg-[#F0E2D6] lg:min-h-[88vh] lg:max-h-[960px] lg:flex-row lg:items-center">
      {/* Zero-zoom 16:9 image container */}
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

      {/* Tonal gradient veil on the left so the text has clear contrast and melts seamlessly into the background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-[#F0E2D6] via-[#F0E2D6]/85 to-transparent lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#F0E2D6] via-[#F0E2D6]/85 to-transparent lg:hidden"
      />

      {/* Typography stack */}
      <div className="relative z-10 flex px-6 pb-12 pt-32 sm:px-10 lg:items-center lg:px-16 lg:py-20 xl:px-24">
        <div className="max-w-[22rem] sm:max-w-[30rem] lg:max-w-[32rem] xl:max-w-[36rem]">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-aube-text-muted">
            Haute Parfumerie · Hand-Crafted
          </p>
          <h1 className="mt-5 font-display text-4xl font-light leading-[1.12] tracking-[-0.01em] text-aube-text sm:text-5xl lg:text-6xl xl:text-[4.15rem]">
            An intimate obsession.
            <span className="mt-2 block italic font-light text-aube-text">
              Crafted to be unforgettable.
            </span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-aube-text/80 sm:text-lg">
            Rare botanicals, slow-cured resins, and an intoxicating sillage designed to become your second skin. Indulge in an olfactory statement that lingers long after you leave.
          </p>
          <a
            href="/collection"
            className="group mt-10 inline-flex items-center gap-3 border-b border-aube-accent pb-1.5 text-xs uppercase tracking-[0.22em] text-aube-text transition-all hover:text-aube-accent hover:border-aube-text"
          >
            <span>Discover Your Signature</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
