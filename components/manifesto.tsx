/**
 * Home section 2 (site-blueprint.md §4). Centered manifesto statement
 * on raw silk. No eyebrow, no decoration. One idea.
 */
export default function Manifesto() {
  return (
    <section
      aria-label="The Sillage Manifesto"
      className="relative overflow-hidden bg-[#141210] px-6 py-12 sm:px-10 sm:py-16 lg:py-20 text-center border-y border-white/[0.08]"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%),
          url('/images/textures/dark-silk-canvas.webp')
        `,
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "100% 100%, 360px 360px",
      }}
    >
      {/* Delicate inner ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-noctis-accent">
          The Sillage
        </p>
        <blockquote className="mt-3.5 font-display text-2xl font-light italic leading-[1.3] text-[#F4EFE6] sm:text-3xl lg:text-[2.6rem] lg:leading-[1.2]">
          “Fragrance worn close to the pulse, remembered long after.”
        </blockquote>
        <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[#A9A499]/85">
          Seven compositions. Worn close, remembered longer.
        </p>
      </div>
    </section>
  );
}
