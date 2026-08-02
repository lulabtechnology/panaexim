import "server-only";

/**
 * Reject browser mutation requests that originate outside the current origin.
 * Same-origin requests and non-browser/server-to-server requests are accepted.
 */
export function isTrustedMutationRequest(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
