import Link from "next/link";

/**
 * Site footer (site-blueprint.md §2). Noctis dark, unbleached silk text,
 * four columns, one legal line. The Correspondence is the promise column.
 */
const EXPLORE = [
  { label: "Home", href: "/" },
  { label: "The Collection", href: "/collection" },
  { label: "Objects", href: "/objects" },
  { label: "The Journal", href: "/journal" },
];

const MAISON = [{ label: "The Maison", href: "/maison" }];

const CONCIERGE = [
  { label: "Concierge", href: "/contact" },
  { label: "Private Appointment", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Sale", href: "/legal/terms" },
  { label: "Shipping and Returns", href: "/legal/shipping-returns" },
  { label: "Grievance Officer", href: "/legal/compliance-checklist" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#101418] px-6 pb-10 pt-20 text-[#EAE6DC] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
          <nav aria-label="Explore">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#EAE6DC]/50">
              Explore
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {EXPLORE.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-display text-lg font-light text-[#EAE6DC] transition-colors hover:text-[#c6a15b]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Maison">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#EAE6DC]/50">
              Maison
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {MAISON.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-display text-lg font-light text-[#EAE6DC] transition-colors hover:text-[#c6a15b]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Concierge">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#EAE6DC]/50">
              Concierge
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {CONCIERGE.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-display text-lg font-light text-[#EAE6DC] transition-colors hover:text-[#c6a15b]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#EAE6DC]/50">
              The Private Salon
            </p>
            <p className="mt-4 font-display text-lg font-light italic text-[#EAE6DC]">
              Private allocations and olfactory previews.
            </p>
            <div className="mt-6">
              <a
                href="https://www.instagram.com/ligeroparfums"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ligero Parfum on Instagram"
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#EAE6DC]/70 transition-colors hover:text-[#c6a15b]"
              >
                <span>Instagram</span>
                <span className="text-[11px] text-[#c6a15b] transition-transform group-hover:translate-x-0.5">@ligeroparfums ↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#EAE6DC]/10 pt-6">
          <p className="font-display text-xl font-light italic text-[#EAE6DC]">
            Worn close. Remembered longer.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-[#EAE6DC]/50">
            Ligero Parfum. Mumbai, India. Registered address and GSTIN to be confirmed.
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs text-[#EAE6DC]/60 transition-colors hover:text-[#c6a15b]"
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
