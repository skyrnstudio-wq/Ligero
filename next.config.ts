import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import path from "path";

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    poweredByHeader: false,
    distDir: isDev ? ".next-dev" : ".next",
    outputFileTracingRoot: path.resolve(__dirname),
    serverExternalPackages: ["sanity", "@sanity/vision", "@sanity/ui"],
    onDemandEntries: {
      maxInactiveAge: 60 * 60 * 1000,
      pagesBufferLength: 50,
    },
    images: {
      dangerouslyAllowSVG: false,
      contentDispositionType: "attachment",
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
      formats: ["image/webp"],
      minimumCacheTTL: 31536000,
      imageSizes: [48, 96, 128, 256, 384, 480],
      deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
      localPatterns: [
        {
          pathname: "/images/**",
        },
      ],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "cdn.sanity.io",
        },
      ],
    },
    async headers() {
      return [
        {
          source: "/images/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
            {
              key: "Cross-Origin-Resource-Policy",
              value: "cross-origin",
            },
          ],
        },
        {
          source: "/(llms\\.txt|llms-full\\.txt|pricing\\.md)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=3600, stale-while-revalidate=86400",
            },
          ],
        },
        {
          source: "/checkout",
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, private, max-age=0",
            },
            {
              key: "Referrer-Policy",
              value: "no-referrer",
            },
          ],
        },
        {
          source: "/checkout/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, private, max-age=0",
            },
            {
              key: "Referrer-Policy",
              value: "no-referrer",
            },
          ],
        },
      ];
    },
    webpack: (config, { dev }) => {
      if (dev) {
        config.watchOptions = {
          ignored: [
            "**/.git/**",
            "**/node_modules/**",
            "**/.next/**",
            "**/.next-dev/**",
          ],
        };
      }
      return config;
    },
    async redirects() {
      return [
        {
          source: "/products",
          destination: "/collection",
          permanent: true,
        },
        {
          source: "/products/:slug",
          destination: "/collection/:slug",
          permanent: true,
        },
        {
          source: "/perfumes",
          destination: "/collection",
          permanent: true,
        },
        {
          source: "/perfumes/:slug",
          destination: "/collection/:slug",
          permanent: true,
        },
        {
          source: "/car-perfume",
          destination: "/objects/en-route",
          permanent: true,
        },
      ];
    },
  };
};

export default nextConfig;
