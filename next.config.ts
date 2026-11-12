import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import path from "path";

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    distDir: isDev ? ".next-dev" : ".next",
    outputFileTracingRoot: path.resolve(__dirname),
    serverExternalPackages: ["sanity", "@sanity/vision", "@sanity/ui"],
    images: {
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
    webpack: (config, { dev }) => {
      if (dev) {
        config.watchOptions = {
          ignored: [
            "**/.git/**",
            "**/node_modules/**",
            "**/.next/**",
            "**/.next-dev/**",
            "**/UI Reference/**",
            "**/Perfumes Cutouts/**",
            "**/.studio_backup/**",
            "**/.freebuff/**",
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
      ];
    },
  };
};

export default nextConfig;
