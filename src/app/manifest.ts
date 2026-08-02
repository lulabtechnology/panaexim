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
        src: "/media/logos/panaexim-emblem.png",
        sizes: "290x230",
        type: "image/png",
      },
    ],
  };
}
