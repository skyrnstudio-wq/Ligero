import Link from "next/link";

const EXPLORE = [
  { label: "Home", href: "/" },
  { label: "The Collection", href: "/#collection" },
  { label: "Objects of Scent", href: "/#objects" },
  { label: "The Private Salon", href: "/#maison" },
];

const CONCIERGE = [
  { label: "Concierge", href: "/contact" },
  { label: "Private Appointment", href: "/contact" },
  { label: "Bespoke Curation", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Sale", href: "/legal/terms" },
  { label: "Shipping and Returns", href: "/legal/shipping-returns" },
  { label: "Grievance Officer", href: "/legal/compliance-checklist" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#100b0a] px-6 pb-12 pt-20 text-[#f1ebe4] sm:px-10 lg:px-16 border-t border-[#f1ebe4]/10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-4 sm:gap-x-10">
          {/* Brand Col */}
          <div>
            <Link
              href="/"
              aria-label="Ligero Parfum, home"
              className="font-serif text-3xl tracking-[0.14em] text-[#f1ebe4] select-none hover:opacity-85 transition-opacity"
              style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
            >
              LIGÉRO
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-[#a9a39a] font-light max-w-xs">
              Indian niche fragrance house. Extrait de parfum blended in small batches, rested ninety days.
            </p>
          </div>

          <nav aria-label="Explore">
            <p className="text-[10px] font-normal uppercase tracking-[0.24em] text-[#d48b59]">
              The Weaves
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {EXPLORE.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-[#f1ebe4]/90 transition-colors hover:text-[#d48b59]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Concierge">
            <p className="text-[10px] font-normal uppercase tracking-[0.24em] text-[#d48b59]">
              Concierge
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {CONCIERGE.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-[#f1ebe4]/90 transition-colors hover:text-[#d48b59]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[10px] font-normal uppercase tracking-[0.24em] text-[#d48b59]">
              The Correspondence
            </p>
            <p className="mt-4 text-sm font-light text-[#a9a39a] leading-relaxed">
              Seasonal dispatches and private allocations of limited small-batch macerations.
            </p>
            <div className="mt-5">
              <a
                href="https://www.instagram.com/ligeroparfums"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ligero Parfum on Instagram"
                className="group inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#f1ebe4]/80 transition-colors hover:text-[#d48b59]"
              >
                <span>Instagram</span>
                <span className="text-[11px] text-[#d48b59] transition-transform group-hover:translate-x-0.5">@ligeroparfums ↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#f1ebe4]/10 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p
              className="text-lg font-light italic text-[#f1ebe4]"
              style={{ fontFamily: "var(--font-cormorant), 'Adamina', Georgia, serif" }}
            >
              Worn close. Remembered longer.
            </p>
            <p className="mt-1 text-xs text-[#a9a39a]/60">
              Ligero Parfum. Mumbai, India. All rights reserved.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs text-[#a9a39a]/70 transition-colors hover:text-[#d48b59]"
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
