import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ligero Parfum",
    short_name: "Ligero",
    description:
      "Independent Indian perfume house presenting seven permanent Eau de Parfum creations, The Discovery Set, and En Route.",
    start_url: "/",
    display: "standalone",
    background_color: "#1c140e",
    theme_color: "#f3ede3",
    lang: "en-IN",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
