import "server-only";

import {
  getDefaultBoothStatuses,
  isBoothAvailability,
  isValidBoothCode,
  type BoothStatusView,
} from "@/lib/booths";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";

type StoredBooth = {
  code: string;
  status: string;
  updated_at: string | null;
};

export type BoothStoreResult = {
  booths: BoothStatusView[];
  databaseReady: boolean;
};

function mergeStoredBooths(records: StoredBooth[]): BoothStatusView[] {
  const stored = new Map(
    records
      .filter((record) => isValidBoothCode(record.code) && isBoothAvailability(record.status))
      .map((record) => [record.code.toUpperCase(), record]),
  );

  return getDefaultBoothStatuses().map((fallback) => {
    const record = stored.get(fallback.code);
    if (!record || !isBoothAvailability(record.status)) return fallback;
    return {
      code: fallback.code,
      status: record.status,
      updated_at: record.updated_at ?? null,
    };
  });
}

export async function getBoothStore(): Promise<BoothStoreResult> {
  if (!isSupabaseServiceConfigured()) {
    return { booths: getDefaultBoothStatuses(), databaseReady: false };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("booths")
    .select("code, status, updated_at")
    .order("code", { ascending: true });

  if (error) {
    console.error("Unable to load booth availability:", error.message);
    return { booths: getDefaultBoothStatuses(), databaseReady: false };
  }

  return {
    booths: mergeStoredBooths((data ?? []) as StoredBooth[]),
    databaseReady: true,
  };
}
