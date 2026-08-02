import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const routes = ["/es", "/en", "/es/privacy", "/en/privacy", "/es/terms", "/en/terms"];
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/es" || route === "/en" ? "weekly" : "monthly",
    priority: route === "/es" || route === "/en" ? 1 : 0.4,
  }));
}
