import { redirect } from "next/navigation";
import { PERFUMES } from "@/lib/products";

export async function generateStaticParams() {
  return PERFUMES.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/collection/${slug}`);
}
