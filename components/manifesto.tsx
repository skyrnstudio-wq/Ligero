/**
 * Home section 2 (site-blueprint.md §4). Centered manifesto statement
 * on raw silk. No eyebrow, no decoration. One idea.
 */
export default function Manifesto() {
  return (
    <section className="bg-aube-base px-6 py-28 sm:px-10 lg:py-36 text-center">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-aube-accent">
          The Sillage
        </p>
        <blockquote className="mt-5 font-display text-3xl font-light italic leading-[1.3] text-aube-text sm:text-4xl lg:text-[3.2rem] lg:leading-[1.22]">
          “Fragrance is the most intimate form of luxury. Worn close to the pulse, remembered forever.”
        </blockquote>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-aube-text-muted">
          Seven permanent compositions · Infinite allure
        </p>
      </div>
    </section>
  );
}
