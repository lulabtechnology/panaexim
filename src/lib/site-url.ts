import "server-only";

const FALLBACK_SITE_URL = "https://panaexim.example";

export function getSiteUrl(): string {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  const candidate = explicitUrl || (vercelHost ? `https://${vercelHost}` : FALLBACK_SITE_URL);

  try {
    return new URL(candidate).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}
