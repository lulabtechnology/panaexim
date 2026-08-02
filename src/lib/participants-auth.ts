import "server-only";

import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";

export const PARTICIPANTS_COOKIE = "panaexim_participants";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_FAILURES = 5;
const ACCESS_SETTING_KEY = "participants_access";

type SessionPayload = {
  exp: number;
  iat: number;
  nonce: string;
};

type StoredPassword = {
  algorithm: "scrypt";
  salt: string;
  hash: string;
};

type RateState = {
  attempts: number;
  windowStartedAt: number;
  blockedUntil: number | null;
};

const localRateLimit = new Map<string, RateState>();

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqualStrings(leftValue: string, rightValue: string): boolean {
  const left = createHash("sha256").update(leftValue, "utf8").digest();
  const right = createHash("sha256").update(rightValue, "utf8").digest();
  return timingSafeEqual(left, right);
}

function hashRateIdentifier(identifier: string): string {
  const secret =
    process.env.PARTICIPANTS_RATE_LIMIT_SECRET ??
    process.env.PARTICIPANTS_SESSION_SECRET ??
    "panaexim-rate-limit-fallback";

  return createHmac("sha256", secret)
    .update(identifier || "unknown")
    .digest("hex");
}

function isStoredPassword(value: unknown): value is StoredPassword {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StoredPassword>;
  return (
    candidate.algorithm === "scrypt" &&
    typeof candidate.salt === "string" &&
    typeof candidate.hash === "string"
  );
}

function verifyPasswordHash(candidate: string, stored: StoredPassword): boolean {
  try {
    const derived = scryptSync(candidate, Buffer.from(stored.salt, "base64url"), 64);
    const expected = Buffer.from(stored.hash, "base64url");
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export function createPasswordHash(password: string): StoredPassword {
  const salt = randomBytes(24);
  const derived = scryptSync(password, salt, 64);
  return {
    algorithm: "scrypt",
    salt: salt.toString("base64url"),
    hash: derived.toString("base64url"),
  };
}

async function getDatabasePassword(): Promise<StoredPassword | null> {
  if (!isSupabaseServiceConfigured()) return null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("setting_value")
    .eq("setting_key", ACCESS_SETTING_KEY)
    .maybeSingle();

  if (error || !data || !isStoredPassword(data.setting_value)) return null;
  return data.setting_value;
}

export async function storeParticipantAccessPassword(password: string): Promise<void> {
  if (!isSupabaseServiceConfigured()) {
    throw new Error("Supabase service configuration is required.");
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("site_settings").upsert(
    {
      setting_key: ACCESS_SETTING_KEY,
      setting_value: createPasswordHash(password),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "setting_key" },
  );

  if (error) throw new Error(error.message);
}

export function isParticipantsAuthConfigured(): boolean {
  const secret = process.env.PARTICIPANTS_SESSION_SECRET;
  const hasPasswordSource = Boolean(
    process.env.PARTICIPANTS_ACCESS_PASSWORD || isSupabaseServiceConfigured(),
  );
  return Boolean(secret && secret.length >= 32 && hasPasswordSource);
}

export async function verifyAccessPassword(candidate: string): Promise<boolean> {
  const storedPassword = await getDatabasePassword();
  if (storedPassword) return verifyPasswordHash(candidate, storedPassword);

  const expected = process.env.PARTICIPANTS_ACCESS_PASSWORD;
  return expected ? safeEqualStrings(candidate, expected) : false;
}

export function createSessionToken(): string {
  const secret = process.env.PARTICIPANTS_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("PARTICIPANTS_SESSION_SECRET is not configured securely.");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    iat: now,
    exp: now + SESSION_DURATION_SECONDS,
    nonce: randomBytes(18).toString("base64url"),
  };
  const encoded = encode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const secret = process.env.PARTICIPANTS_SESSION_SECRET;

  if (!token || !secret || secret.length < 32) return false;

  const [encoded, receivedSignature] = token.split(".");
  if (!encoded || !receivedSignature) return false;

  const expectedSignature = sign(encoded, secret);
  if (!safeEqualStrings(receivedSignature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(decode(encoded)) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    return (
      Number.isFinite(payload.exp) &&
      Number.isFinite(payload.iat) &&
      typeof payload.nonce === "string" &&
      payload.iat <= now + 30 &&
      payload.exp > now
    );
  } catch {
    return false;
  }
}

export async function getParticipantRateLimit(identifier: string): Promise<{
  allowed: boolean;
  retryAfterSeconds: number;
}> {
  const identifierHash = hashRateIdentifier(identifier);
  const now = Date.now();

  if (isSupabaseServiceConfigured()) {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("participant_login_attempts")
      .select("attempts, window_started_at, blocked_until")
      .eq("identifier_hash", identifierHash)
      .maybeSingle();

    if (!data) return { allowed: true, retryAfterSeconds: 0 };

    const blockedUntil = data.blocked_until
      ? new Date(data.blocked_until).getTime()
      : 0;
    if (blockedUntil > now) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((blockedUntil - now) / 1000),
      };
    }

    const windowStarted = new Date(data.window_started_at).getTime();
    if (!Number.isFinite(windowStarted) || now - windowStarted > RATE_LIMIT_WINDOW_MS) {
      await supabase
        .from("participant_login_attempts")
        .delete()
        .eq("identifier_hash", identifierHash);
    }

    return { allowed: true, retryAfterSeconds: 0 };
  }

  const state = localRateLimit.get(identifierHash);
  if (!state) return { allowed: true, retryAfterSeconds: 0 };
  if (state.blockedUntil && state.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((state.blockedUntil - now) / 1000),
    };
  }
  if (now - state.windowStartedAt > RATE_LIMIT_WINDOW_MS) {
    localRateLimit.delete(identifierHash);
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function registerParticipantLoginFailure(identifier: string): Promise<void> {
  const identifierHash = hashRateIdentifier(identifier);
  const now = Date.now();

  if (isSupabaseServiceConfigured()) {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("participant_login_attempts")
      .select("attempts, window_started_at")
      .eq("identifier_hash", identifierHash)
      .maybeSingle();

    const existingWindow = data?.window_started_at
      ? new Date(data.window_started_at).getTime()
      : 0;
    const resetWindow = !existingWindow || now - existingWindow > RATE_LIMIT_WINDOW_MS;
    const attempts = resetWindow ? 1 : Number(data?.attempts ?? 0) + 1;
    const blockedUntil =
      attempts >= RATE_LIMIT_MAX_FAILURES
        ? new Date(now + RATE_LIMIT_WINDOW_MS).toISOString()
        : null;

    await supabase.from("participant_login_attempts").upsert({
      identifier_hash: identifierHash,
      attempts,
      window_started_at: new Date(resetWindow ? now : existingWindow).toISOString(),
      blocked_until: blockedUntil,
      updated_at: new Date(now).toISOString(),
    });
    return;
  }

  const current = localRateLimit.get(identifierHash);
  const resetWindow = !current || now - current.windowStartedAt > RATE_LIMIT_WINDOW_MS;
  const attempts = resetWindow ? 1 : current.attempts + 1;
  localRateLimit.set(identifierHash, {
    attempts,
    windowStartedAt: resetWindow ? now : current.windowStartedAt,
    blockedUntil:
      attempts >= RATE_LIMIT_MAX_FAILURES ? now + RATE_LIMIT_WINDOW_MS : null,
  });
}

export async function clearParticipantLoginFailures(identifier: string): Promise<void> {
  const identifierHash = hashRateIdentifier(identifier);

  if (isSupabaseServiceConfigured()) {
    const supabase = createServiceClient();
    await supabase
      .from("participant_login_attempts")
      .delete()
      .eq("identifier_hash", identifierHash);
  }

  localRateLimit.delete(identifierHash);
}

export const participantsCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  priority: "high" as const,
  maxAge: SESSION_DURATION_SECONDS,
};
