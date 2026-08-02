import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PanaEXIM 2026",
    short_name: "PanaEXIM",
    description: "4 Events. Infinite Opportunities.",
    start_url: "/es",
    display: "standalone",
    background_color: "#05070b",
    theme_color: "#0a1220",
    icons: [
      {
        src: "/media/logos/panaexim-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/media/logos/panaexim-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
