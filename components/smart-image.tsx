"use client";

import Image, { type ImageProps } from "next/image";
import { isSanityCdnUrl, sanityImageLoader } from "@/lib/image-delivery";

export type SmartImageProps = ImageProps;

/**
 * Zero-overhead Next.js `<Image>` wrapper that:
 * 1. Routes `cdn.sanity.io` assets directly to Sanity's Fastly Edge CDN with native
 *    `auto=format` (AVIF/WebP), eliminating `/_next/image` double-hop transcoding delay.
 * 2. Applies Sanity LQIP / static `blurDataURL` placeholders automatically when provided.
 */
export default function SmartImage({
  src,
  loader,
  blurDataURL,
  placeholder,
  ...rest
}: SmartImageProps) {
  const isSanity = typeof src === "string" && isSanityCdnUrl(src);
  const resolvedLoader = loader ?? (isSanity ? sanityImageLoader : undefined);

  return (
    <Image
      src={src}
      loader={resolvedLoader}
      placeholder={placeholder ?? (blurDataURL ? "blur" : undefined)}
      blurDataURL={blurDataURL}
      {...rest}
    />
  );
}
