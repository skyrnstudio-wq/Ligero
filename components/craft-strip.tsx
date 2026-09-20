import Image from "next/image";

/**
 * Home section 4 (site-blueprint.md §4, layout family: captioned strip).
 * Three hairline-separated images with nine-word captions:
 * sourcing, blending, resting. Captions verbatim from §5.
 */
const HERO_IMAGE = "/images/hero/Hero-bg-169.jpg";

const CRAFT = [
  {
    caption: "Precious single-origin botanicals, distilled at the peak hour of their bloom.",
    position: "12% 50%",
    alt: "Raw silk plaster wall behind the perfumes",
  },
  {
    caption: "Rested ninety days in darkness, allowing the essences to fuse into an intoxicating sillage.",
    position: "45% 70%",
    alt: "Blends resting on a marble plinth",
  },
  {
    caption: "High concentration formulations. Free of synthetic preservatives or superficial shine.",
    position: "80% 50%",
    alt: "Finished bottles in afternoon light",
  },
];

export default function CraftStrip() {
  return (
    <section aria-label="The craft" className="bg-aube-base px-6 pb-28 sm:px-10 lg:px-16 lg:pb-40">
      <div className="mx-auto max-w-6xl border-t border-aube-hairline">
        {CRAFT.map((craft) => (
          <figure
            key={craft.caption}
            className="grid items-center gap-6 border-b border-aube-hairline py-10 sm:grid-cols-[1fr_auto] lg:py-14"
          >
            <p className="font-display text-xl font-light italic leading-relaxed text-aube-text sm:text-2xl lg:text-[1.65rem] lg:leading-[1.5]">
              {craft.caption}
            </p>
            <div className="relative h-36 w-full overflow-hidden sm:h-32 sm:w-56 lg:w-72">
              <Image
                src={HERO_IMAGE}
                alt={craft.alt}
                fill
                sizes="(max-width: 640px) 100vw, 288px"
                className="object-cover"
                style={{ objectPosition: craft.position }}
              />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
