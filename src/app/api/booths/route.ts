import { NextResponse } from "next/server";
import { getBoothStore } from "@/lib/booth-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getBoothStore();

  return NextResponse.json(
    {
      booths: result.booths,
      live: result.databaseReady,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
