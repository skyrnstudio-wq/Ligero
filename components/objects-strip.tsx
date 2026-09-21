/**
 * Home section: Objects. Two quiet hairline rows, a shelf not a shop
 * (site-blueprint.md §10). House names kept: the Discovery Set, En Route.
 */
const OBJECTS = [
  {
    name: "En Route",
    line: "An evocative atmosphere for the private cabin. Hand-finished car diffuser charged with pure atlas cedar, bergamot, and sun-warmed amber.",
    cta: "Discover En Route",
  },
];

export default function ObjectsStrip() {
  return (
    <section aria-label="Objects" className="bg-aube-base px-6 pb-28 sm:px-10 lg:px-16 lg:pb-40">
      <div className="mx-auto max-w-5xl border-t border-aube-hairline">
        {OBJECTS.map((object) => (
          <div
            key={object.name}
            className="flex flex-col gap-3 border-b border-aube-hairline py-10 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
          >
            <div>
              <h3 className="font-display text-2xl font-light italic text-aube-text sm:text-3xl">
                {object.name}
              </h3>
              <p className="mt-2 max-w-md text-aube-text-muted">{object.line}</p>
            </div>
            <a
              href="/objects"
              className="flex-none self-start border-b border-aube-accent pb-1 text-sm uppercase tracking-[0.18em] text-aube-text transition-colors hover:text-aube-accent sm:self-center"
            >
              {object.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
