"use client";

import { KeyRound, LoaderCircle, LogIn, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/content";

export function AdminLogin({
  locale,
  configured,
}: {
  locale: Locale;
  configured: boolean;
}) {
  const spanish = locale === "es";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(
          body.error ??
            (spanish ? "No se pudo iniciar sesión." : "Unable to sign in."),
        );
        return;
      }
      router.refresh();
    } catch {
      setError(spanish ? "No se pudo conectar con el servidor." : "Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-login-card">
      <div className="admin-login-icon"><ShieldCheck aria-hidden="true" /></div>
      <p className="eyebrow">PanaEXIM Control Center</p>
      <h1>{spanish ? "Panel administrativo" : "Administration dashboard"}</h1>
      <p>
        {spanish
          ? "Acceso exclusivo para el equipo autorizado de PanaEXIM."
          : "Exclusive access for the authorized PanaEXIM team."}
      </p>

      {!configured ? (
        <div className="participants-config-note">
          <KeyRound aria-hidden="true" />
          <span>
            {spanish
              ? "Configura las variables de Supabase y crea el primer administrador siguiendo el README."
              : "Configure the Supabase variables and create the first administrator by following the README."}
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            <span>{spanish ? "Correo" : "Email"}</span>
            <input name="email" type="email" required autoComplete="username" />
          </label>
          <label>
            <span>{spanish ? "Contraseña" : "Password"}</span>
            <input name="password" type="password" required maxLength={256} autoComplete="current-password" />
          </label>
          <button className="button button-gold" type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="spin" aria-hidden="true" /> : <LogIn aria-hidden="true" />}
            {loading
              ? spanish ? "Validando..." : "Validating..."
              : spanish ? "Ingresar al panel" : "Open dashboard"}
          </button>
          {error ? <p className="participants-error" role="alert">{error}</p> : null}
        </form>
      )}
    </section>
  );
}
