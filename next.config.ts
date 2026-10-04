import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
