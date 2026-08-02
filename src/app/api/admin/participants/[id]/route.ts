import { NextResponse } from "next/server";
import { requireAdminIdentity } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";
import { isTrustedMutationRequest } from "@/lib/request-security";

function json(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
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

  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return json({ error: "Invalid participant identifier." }, 400);
  }

  const supabase = createServiceClient();
  const { data: participant, error: readError } = await supabase
    .from("participants")
    .select("logo_path")
    .eq("id", id)
    .maybeSingle();

  if (readError || !participant) {
    return json({ error: "Participant record was not found." }, 404);
  }

  const { error: deleteError } = await supabase
    .from("participants")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Participant deletion failed:", deleteError.message);
    return json({ error: "Unable to delete the participant." }, 500);
  }

  if (typeof participant.logo_path === "string" && participant.logo_path) {
    await supabase.storage.from("participant-logos").remove([participant.logo_path]);
  }

  return json({ ok: true });
}
