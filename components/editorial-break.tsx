/**
 * Home section 5 (site-blueprint.md §4, layout family: color band).
 * Full-width Noctis dark band. Bodoni Moda display. One line, nothing else.
 */
export default function EditorialBreak() {
  return (
    <section className="bg-[#101418] px-6 py-28 text-[#EAE6DC] sm:px-10 lg:py-36 text-center">
      <div className="mx-auto max-w-4xl">
        <p className="font-editorial text-3xl font-light leading-[1.25] sm:text-4xl lg:text-[3.8rem] lg:leading-[1.18]">
          Skin remembers what the mind forgets.
        </p>
        <p className="mt-5 font-display text-lg italic text-noctis-accent sm:text-xl">
          An undeniable sillage that outlasts the night.
        </p>
      </div>
    </section>
  );
}
