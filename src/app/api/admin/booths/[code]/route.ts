import { NextResponse } from "next/server";
import { requireAdminIdentity } from "@/lib/admin-auth";
import {
  isBoothAvailability,
  isValidBoothCode,
  type BoothAvailability,
} from "@/lib/booths";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";
import { isTrustedMutationRequest } from "@/lib/request-security";

function json(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  if (!isTrustedMutationRequest(request)) {
    return json({ error: "Untrusted request origin." }, 403);
  }

  let admin;
  try {
    admin = await requireAdminIdentity();
  } catch {
    return json({ error: "Administrator authentication required." }, 401);
  }

  if (!isSupabaseServiceConfigured()) {
    return json({ error: "Supabase service access is not configured." }, 503);
  }

  const { code: rawCode } = await context.params;
  const code = rawCode.trim().toUpperCase();
  if (!isValidBoothCode(code)) {
    return json({ error: "Invalid booth code." }, 400);
  }

  let status: BoothAvailability;
  try {
    const body = (await request.json()) as { status?: unknown };
    if (typeof body.status !== "string" || !isBoothAvailability(body.status)) {
      return json({ error: "Invalid booth status." }, 400);
    }
    status = body.status;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("booths")
    .upsert(
      {
        code,
        status,
        updated_by: admin.userId,
      },
      { onConflict: "code" },
    )
    .select("code, status, updated_at")
    .single();

  if (error) {
    console.error(`Unable to update booth ${code}:`, error.message);
    return json(
      {
        error:
          "Unable to update booth availability. Confirm that the booth migration has been executed.",
      },
      500,
    );
  }

  return json({ booth: data });
}
