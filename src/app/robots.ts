import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://panaexim.example";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/es/participants", "/en/participants"] }],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
