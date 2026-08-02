import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabasePublicConfigured } from "@/lib/supabase/config";
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

  if (!isSupabasePublicConfigured()) {
    return json({ error: "Supabase authentication is not configured." }, 503);
  }

  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as {
      email?: unknown;
      password?: unknown;
    };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (!email || !password) {
    return json({ error: "Email and password are required." }, 400);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return json({ error: "Invalid credentials." }, 401);
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (adminError || !admin) {
    await supabase.auth.signOut();
    return json({ error: "This account is not authorized for the PanaEXIM dashboard." }, 403);
  }

  return json({ ok: true });
}
