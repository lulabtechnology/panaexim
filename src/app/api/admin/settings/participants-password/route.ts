import { NextResponse } from "next/server";
import { requireAdminIdentity } from "@/lib/admin-auth";
import { storeParticipantAccessPassword } from "@/lib/participants-auth";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";
import { isTrustedMutationRequest } from "@/lib/request-security";

function json(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) {
    return json({ error: "Untrusted request origin." }, 403);
  }

  try {
    await requireAdminIdentity();
  } catch {
    return json({ error: "Administrator authentication required." }, 401);
  }

  if (!isSupabaseServiceConfigured()) {
    return json({ error: "Supabase service access is not configured." }, 503);
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (password.length < 10 || password.length > 128 || password.trim().length < 10) {
    return json({ error: "Password must contain between 10 and 128 characters." }, 400);
  }

  try {
    await storeParticipantAccessPassword(password);
    return json({ ok: true });
  } catch (error) {
    console.error("Unable to update participant password:", error);
    return json({ error: "Unable to update the directory password." }, 500);
  }
}
