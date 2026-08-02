import "server-only";

import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";

export const participantEventSlugs = [
  "jewellery",
  "cosmetica",
  "defensa",
  "energy",
] as const;

export type ParticipantEventSlug = (typeof participantEventSlugs)[number];

export type ParticipantRecord = {
  id: string;
  name: string;
  event_slug: ParticipantEventSlug;
  country: string;
  category: string;
  website: string | null;
  stand: string | null;
  description_es: string | null;
  description_en: string | null;
  logo_path: string | null;
  logo_alt: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ParticipantView = ParticipantRecord & {
  logo_url: string | null;
};

export function isParticipantEventSlug(value: string): value is ParticipantEventSlug {
  return participantEventSlugs.includes(value as ParticipantEventSlug);
}

async function attachSignedLogoUrls(
  records: ParticipantRecord[],
): Promise<ParticipantView[]> {
  if (!records.length || !isSupabaseServiceConfigured()) {
    return records.map((record) => ({ ...record, logo_url: null }));
  }

  const supabase = createServiceClient();

  return Promise.all(
    records.map(async (record) => {
      if (!record.logo_path) return { ...record, logo_url: null };

      const { data, error } = await supabase.storage
        .from("participant-logos")
        .createSignedUrl(record.logo_path, 60 * 60);

      return {
        ...record,
        logo_url: error ? null : data.signedUrl,
      };
    }),
  );
}

export async function getPublishedParticipants(): Promise<ParticipantView[]> {
  if (!isSupabaseServiceConfigured()) return [];

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .eq("is_published", true)
    .order("event_slug", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Unable to load published participants:", error.message);
    return [];
  }

  return attachSignedLogoUrls((data ?? []) as ParticipantRecord[]);
}

export async function getAdminParticipants(): Promise<ParticipantView[]> {
  if (!isSupabaseServiceConfigured()) return [];

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .order("event_slug", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Unable to load participants: ${error.message}`);
  }

  return attachSignedLogoUrls((data ?? []) as ParticipantRecord[]);
}
