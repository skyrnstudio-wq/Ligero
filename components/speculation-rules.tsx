import { safeJsonLd } from "@/lib/seo/schema";

/**
 * Browser-native Speculation Rules for near-instant MPA / initial-document transitions
 * on pointer hover / intent for public catalog and house routes.
 */
const SPECULATION_RULES = {
  prerender: [
    {
      where: {
        and: [
          {
            href_matches: [
              "/",
              "/collection",
              "/collection/*",
              "/discovery-set",
              "/objects",
              "/objects/*",
              "/help",
            ],
          },
          { not: { href_matches: "/checkout*" } },
          { not: { href_matches: "/studio*" } },
          { not: { href_matches: "/api/*" } },
        ],
      },
      eagerness: "moderate",
    },
  ],
};

export default function SpeculationRules() {
  return (
    <script
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(SPECULATION_RULES) }}
    />
  );
}
