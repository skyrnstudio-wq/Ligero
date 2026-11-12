/**
 * Editorial Quote Section (Home Movement).
 * High-fashion luxury statement in deep espresso/Noctis with Cormorant italic display type.
 */
export default function EditorialQuote() {
  return (
    <section
      aria-label="Maison philosophy"
      className="relative overflow-hidden border-b border-[#382a20] bg-[#1c140e] px-6 py-16 text-noctis-text sm:px-10 sm:py-20 lg:py-24 text-center"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(185, 151, 91, 0.16) 0%, rgba(28, 20, 14, 0.98) 85%),
          url('/images/textures/film-grain.webp')
        `,
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "100% 100%, 240px 240px",
      }}
    >
      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="font-body text-[10.5px] font-medium uppercase tracking-[0.28em] text-noctis-accent">
          The Art of Scent
        </p>

        <blockquote className="mt-5 font-display text-2xl font-light italic leading-[1.3] text-noctis-text sm:text-3xl lg:text-[2.85rem] lg:leading-[1.22]">
          &ldquo;Smell is a word, perfume is literature.&rdquo;
        </blockquote>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="h-[1px] w-8 bg-[#382a20]" aria-hidden="true" />
          <cite className="font-body text-[10.5px] not-italic uppercase tracking-[0.22em] text-noctis-text-muted">
            Jean-Claude Ellena · Master Perfumer
          </cite>
          <span className="h-[1px] w-8 bg-[#382a20]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
