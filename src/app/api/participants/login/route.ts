import { NextResponse } from "next/server";
import {
  clearParticipantLoginFailures,
  createSessionToken,
  getParticipantRateLimit,
  isParticipantsAuthConfigured,
  PARTICIPANTS_COOKIE,
  participantsCookieOptions,
  registerParticipantLoginFailure,
  verifyAccessPassword,
} from "@/lib/participants-auth";
import { isTrustedMutationRequest } from "@/lib/request-security";

function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function json(body: object, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export async function POST(request: Request) {
  if (!isTrustedMutationRequest(request)) {
    return json({ error: "Untrusted request origin." }, 403);
  }

  if (!isParticipantsAuthConfigured()) {
    return json({ error: "Participant access is not configured yet." }, 503);
  }

  const identifier = getClientIdentifier(request);
  const rateLimit = await getParticipantRateLimit(identifier);
  if (!rateLimit.allowed) {
    return json(
      { error: "Too many attempts. Please try again later." },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  let password = "";

  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (!password || password.length > 128 || !(await verifyAccessPassword(password))) {
    await registerParticipantLoginFailure(identifier);
    return json({ error: "Incorrect password." }, 401);
  }

  await clearParticipantLoginFailures(identifier);
  const response = json({ ok: true });
  response.cookies.set(
    PARTICIPANTS_COOKIE,
    createSessionToken(),
    participantsCookieOptions,
  );
  return response;
}
