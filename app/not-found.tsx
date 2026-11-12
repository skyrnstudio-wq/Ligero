import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

/**
 * 404 page (site-blueprint.md §11d, brand-voice/SKILL.md §5):
 * "This page does not exist. The Collection does." linking to /collection.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-aube-base text-aube-text">
      <SiteHeader />

      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-start justify-center px-6 py-32 sm:px-10">
        <h1 className="font-display text-5xl font-light italic leading-tight text-aube-text sm:text-6xl lg:text-7xl">
          This page does not exist. The Collection does.
        </h1>

        <Link
          href="/collection"
          className="mt-10 inline-block border-b border-aube-accent pb-1 text-xs uppercase tracking-[0.22em] text-aube-text transition-colors hover:border-aube-text hover:text-aube-accent"
        >
          Explore the Collection
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
}
