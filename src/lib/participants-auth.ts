import { createHmac, timingSafeEqual } from "node:crypto";

export const PARTICIPANTS_COOKIE = "panaexim_participants";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  exp: number;
};

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function isParticipantsAuthConfigured(): boolean {
  return Boolean(
    process.env.PARTICIPANTS_ACCESS_PASSWORD &&
      process.env.PARTICIPANTS_SESSION_SECRET &&
      process.env.PARTICIPANTS_SESSION_SECRET.length >= 32,
  );
}

export function verifyAccessPassword(candidate: string): boolean {
  const expected = process.env.PARTICIPANTS_ACCESS_PASSWORD;

  if (!expected) {
    return false;
  }

  const left = Buffer.from(candidate, "utf8");
  const right = Buffer.from(expected, "utf8");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function createSessionToken(): string {
  const secret = process.env.PARTICIPANTS_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("PARTICIPANTS_SESSION_SECRET is not configured securely.");
  }

  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };
  const encoded = encode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const secret = process.env.PARTICIPANTS_SESSION_SECRET;

  if (!token || !secret || secret.length < 32) {
    return false;
  }

  const [encoded, receivedSignature] = token.split(".");
  if (!encoded || !receivedSignature) {
    return false;
  }

  const expectedSignature = sign(encoded, secret);
  const left = Buffer.from(receivedSignature, "utf8");
  const right = Buffer.from(expectedSignature, "utf8");

  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return false;
  }

  try {
    const payload = JSON.parse(decode(encoded)) as SessionPayload;
    return Number.isFinite(payload.exp) && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export const participantsCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};
