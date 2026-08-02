import { NextResponse } from "next/server";
import {
  createSessionToken,
  isParticipantsAuthConfigured,
  PARTICIPANTS_COOKIE,
  participantsCookieOptions,
  verifyAccessPassword,
} from "@/lib/participants-auth";

export async function POST(request: Request) {
  if (!isParticipantsAuthConfigured()) {
    return NextResponse.json(
      { error: "Participant access is not configured yet." },
      { status: 503 },
    );
  }

  let password = "";

  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!password || !verifyAccessPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    PARTICIPANTS_COOKIE,
    createSessionToken(),
    participantsCookieOptions,
  );
  return response;
}
