import Link from "next/link";

/**
 * Site footer (site-blueprint.md §2).
 * Dark espresso (#1c140e), unbleached silk text (#f3ede3), warm bronze accents.
 * Four columns: Explore, Maison, Help, The Correspondence.
 * Legal line at the bottom with entity details and mandatory Indian disclosures.
 */
const EXPLORE = [
  { label: "Home", href: "/" },
  { label: "The Collection", href: "/collection" },
  { label: "The Discovery Set", href: "/discovery-set" },
  { label: "Car Perfume", href: "/objects/en-route" },
  { label: "Objects", href: "/objects" },
];

const HELP = [
  { label: "Help", href: "/help" },
  { label: "Shipping and Returns", href: "/legal/shipping-returns" },
  { label: "Grievance Officer", href: "/legal/grievance" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Sale", href: "/legal/terms" },
  { label: "Shipping and Returns", href: "/legal/shipping-returns" },
  { label: "Grievance Officer", href: "/legal/grievance" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#1c140e] border-t border-[#382a20] px-6 pt-20 pb-[max(3rem,calc(env(safe-area-inset-bottom)+2rem))] text-noctis-text sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-10">
          {/* Column 1: Explore */}
          <nav aria-label="Explore">
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.22em] text-noctis-accent">
              Explore
            </p>
            <ul className="mt-4 flex flex-col gap-1">
              {EXPLORE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center font-display text-lg font-light text-noctis-text transition-colors hover:text-noctis-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 2: Help */}
          <nav aria-label="Help">
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.22em] text-noctis-accent">
              Help
            </p>
            <ul className="mt-4 flex flex-col gap-1">
              {HELP.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center font-display text-lg font-light text-noctis-text transition-colors hover:text-noctis-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: The Correspondence */}
          <div>
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.22em] text-noctis-accent">
              The Correspondence
            </p>
            <p className="mt-4 font-display text-lg font-light italic text-noctis-text">
              Four letters a year. Nothing else.
            </p>
            <div className="mt-4">
              <a
                href="mailto:sales@ligeroparfums.com"
                className="inline-flex min-h-11 items-center font-body text-xs text-noctis-text underline underline-offset-4 transition-colors hover:text-noctis-accent"
              >
                sales@ligeroparfums.com
              </a>
            </div>
            <div className="mt-2">
              <a
                href="https://www.instagram.com/ligeroparfums"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ligero Parfum on Instagram"
                className="inline-flex min-h-11 items-center font-body gap-2 text-xs uppercase tracking-[0.2em] text-noctis-text-muted transition-colors hover:text-noctis-accent"
              >
                <span>Instagram</span>
                <span className="text-noctis-accent">@ligeroparfums ↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#382a20] pt-8">
          <p className="font-display text-xl font-light italic text-noctis-text">
            Scent, worn like silk.
          </p>
          <p className="font-body mt-3 text-xs leading-relaxed text-noctis-text-muted">
            Ligero Parfum Private Limited · Registered office: Mumbai, Maharashtra, India · All prices in rupees, inclusive of all taxes.
          </p>
          <ul className="mt-4 flex flex-col gap-y-1 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {LEGAL.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center font-body text-xs text-noctis-text-muted transition-colors hover:text-noctis-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
