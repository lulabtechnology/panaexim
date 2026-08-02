import "server-only";

import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabasePublicConfigured } from "@/lib/supabase/config";

export type AdminIdentity = {
  userId: string;
  email: string;
  displayName: string;
};

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  if (!isSupabasePublicConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;

  if (claimsError || !claims || typeof claims.sub !== "string") return null;
  const userId = claims.sub;

  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("user_id, display_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !admin) return null;

  const emailClaim = claims.email;
  return {
    userId,
    email: typeof emailClaim === "string" ? emailClaim : "",
    displayName:
      typeof admin.display_name === "string" && admin.display_name.trim()
        ? admin.display_name
        : "PanaEXIM Admin",
  };
}

export async function requireAdminIdentity(): Promise<AdminIdentity> {
  const identity = await getAdminIdentity();
  if (!identity) {
    throw new Error("ADMIN_AUTH_REQUIRED");
  }
  return identity;
}
