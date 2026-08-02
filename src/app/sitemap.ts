import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://panaexim.example";
  const routes = ["/es", "/en", "/es/privacy", "/en/privacy", "/es/terms", "/en/terms"];
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/es" || route === "/en" ? "weekly" : "monthly",
    priority: route === "/es" || route === "/en" ? 1 : 0.4,
  }));
}
