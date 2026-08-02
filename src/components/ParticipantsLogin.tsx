"use client";

import { KeyRound, LoaderCircle, LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/content";

type ParticipantsLoginProps = {
  locale: Locale;
  configured: boolean;
};

export function ParticipantsLogin({ locale, configured }: ParticipantsLoginProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const spanish = locale === "es";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/participants/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: form.get("password") }),
      });
      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(body.error ?? (spanish ? "No se pudo validar el acceso." : "Access could not be validated."));
        return;
      }

      router.refresh();
    } catch {
      setError(spanish ? "No se pudo conectar con el servidor." : "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="participants-login-card">
      <div className="participants-login-icon"><LockKeyhole aria-hidden="true" /></div>
      <p className="eyebrow">{spanish ? "Acceso autorizado" : "Authorized access"}</p>
      <h1>{spanish ? "Directorio de participantes" : "Participant directory"}</h1>
      <p>
        {spanish
          ? "Ingrese la contraseña proporcionada por la organización. La validación se realiza en el servidor y el contenido privado no se entrega antes de autorizar el acceso."
          : "Enter the password provided by the organization. Validation happens on the server and private content is not delivered before access is authorized."}
      </p>

      {!configured ? (
        <div className="participants-config-note">
          <KeyRound aria-hidden="true" />
          <span>
            {spanish
              ? "Configure PARTICIPANTS_ACCESS_PASSWORD y PARTICIPANTS_SESSION_SECRET en Vercel para activar el acceso."
              : "Configure PARTICIPANTS_ACCESS_PASSWORD and PARTICIPANTS_SESSION_SECRET in Vercel to activate access."}
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="participant-password">
            {spanish ? "Contraseña" : "Password"}
          </label>
          <div className="password-control">
            <KeyRound aria-hidden="true" />
            <input
              id="participant-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <button className="button button-gold" type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="spin" aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
            {loading
              ? spanish ? "Validando..." : "Validating..."
              : spanish ? "Ingresar" : "Enter"}
          </button>
          {error ? <p className="participants-error" role="alert">{error}</p> : null}
        </form>
      )}
    </div>
  );
}
