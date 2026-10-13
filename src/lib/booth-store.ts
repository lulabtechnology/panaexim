import "server-only";

import { getDefaultBoothStatuses, type BoothStatusView } from "@/lib/booths";

export type BoothStoreResult = {
  booths: BoothStatusView[];
  databaseReady: boolean;
};

// The February 2027 floor plan is visual; availability is confirmed by the organizers.
export async function getBoothStore(): Promise<BoothStoreResult> {
  return { booths: getDefaultBoothStatuses(), databaseReady: false };
}
