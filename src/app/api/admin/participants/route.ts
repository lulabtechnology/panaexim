import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdminIdentity } from "@/lib/admin-auth";
import {
  isParticipantEventSlug,
  type ParticipantEventSlug,
} from "@/lib/participants";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";
import { isTrustedMutationRequest } from "@/lib/request-security";

const MAX_LOGO_BYTES = 4 * 1024 * 1024;
const allowedLogoTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);

function json(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function text(form: FormData, key: string, maxLength: number): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function nullable(value: string): string | null {
  return value || null;
}

function validateWebsite(value: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function hasValidImageSignature(bytes: Buffer, mimeType: string): boolean {
  if (mimeType === "image/png") {
    return (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  if (mimeType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mimeType === "image/webp") {
    return (
      bytes.length >= 12 &&
      bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
      bytes.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}

export async function POST(request: Request) {
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

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Invalid form data." }, 400);
  }

  const id = text(form, "id", 64);
  const name = text(form, "name", 180);
  const eventSlugRaw = text(form, "event_slug", 30);
  const country = text(form, "country", 100);
  const category = text(form, "category", 140);
  const stand = text(form, "stand", 40);
  const websiteRaw = text(form, "website", 400);
  const descriptionEs = text(form, "description_es", 1200);
  const descriptionEn = text(form, "description_en", 1200);
  const logoAlt = text(form, "logo_alt", 220) || name;
  const sortOrderRaw = Number(text(form, "sort_order", 8));
  const sortOrder = Number.isFinite(sortOrderRaw)
    ? Math.max(0, Math.min(9999, Math.trunc(sortOrderRaw)))
    : 0;
  const isPublished = form.get("is_published") === "on";
  const isFeatured = form.get("is_featured") === "on";
  const website = validateWebsite(websiteRaw);

  if (!name || !country || !category || !isParticipantEventSlug(eventSlugRaw)) {
    return json({ error: "Name, event, country and category are required." }, 400);
  }

  if (websiteRaw && !website) {
    return json({ error: "Website must use a valid http or https URL." }, 400);
  }

  const eventSlug: ParticipantEventSlug = eventSlugRaw;
  const logo = form.get("logo");
  let uploadedLogoPath: string | null = null;
  let oldLogoPath: string | null = null;
  const supabase = createServiceClient();

  if (id) {
    const { data: current, error: currentError } = await supabase
      .from("participants")
      .select("id, logo_path")
      .eq("id", id)
      .maybeSingle();

    if (currentError || !current) {
      return json({ error: "Participant record was not found." }, 404);
    }
    oldLogoPath = typeof current.logo_path === "string" ? current.logo_path : null;
  }

  if (logo instanceof File && logo.size > 0) {
    const extension = allowedLogoTypes.get(logo.type);
    if (!extension) {
      return json({ error: "Logo must be PNG, JPG or WebP." }, 400);
    }
    if (logo.size > MAX_LOGO_BYTES) {
      return json({ error: "Logo exceeds the 4 MB limit." }, 400);
    }

    const bytes = Buffer.from(await logo.arrayBuffer());
    if (!hasValidImageSignature(bytes, logo.type)) {
      return json({ error: "The uploaded file does not contain a valid image." }, 400);
    }

    uploadedLogoPath = `${eventSlug}/${randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("participant-logos")
      .upload(uploadedLogoPath, bytes, {
        contentType: logo.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Participant logo upload failed:", uploadError.message);
      return json({ error: "Unable to upload the participant logo." }, 500);
    }
  }

  const record = {
    name,
    event_slug: eventSlug,
    country,
    category,
    website,
    stand: nullable(stand),
    description_es: nullable(descriptionEs),
    description_en: nullable(descriptionEn),
    logo_alt: nullable(logoAlt),
    is_published: isPublished,
    is_featured: isFeatured,
    sort_order: sortOrder,
    updated_by: admin.userId,
    ...(uploadedLogoPath ? { logo_path: uploadedLogoPath } : {}),
  };

  const operation = id
    ? supabase.from("participants").update(record).eq("id", id).select("id").single()
    : supabase
        .from("participants")
        .insert({ ...record, created_by: admin.userId })
        .select("id")
        .single();

  const { data, error } = await operation;
  if (error || !data) {
    if (uploadedLogoPath) {
      await supabase.storage.from("participant-logos").remove([uploadedLogoPath]);
    }
    console.error("Participant save failed:", error?.message);
    return json({ error: "Unable to save the participant." }, 500);
  }

  if (uploadedLogoPath && oldLogoPath && oldLogoPath !== uploadedLogoPath) {
    await supabase.storage.from("participant-logos").remove([oldLogoPath]);
  }

  return json({ ok: true, id: data.id });
}
