import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ParticipantDirectory } from "@/components/ParticipantDirectory";
import { ParticipantsLogin } from "@/components/ParticipantsLogin";
import { ParticipantsLogout } from "@/components/ParticipantsLogout";
import { content, isLocale } from "@/lib/content";
import {
  isParticipantsAuthConfigured,
  PARTICIPANTS_COOKIE,
  verifySessionToken,
} from "@/lib/participants-auth";
import { getPublishedParticipants } from "@/lib/participants";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type ParticipantsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ParticipantsPage({ params }: ParticipantsPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale;
  const copy = content[locale];
  const cookieStore = await cookies();
  const authenticated = verifySessionToken(
    cookieStore.get(PARTICIPANTS_COOKIE)?.value,
  );
  const spanish = locale === "es";
  const participants = authenticated ? await getPublishedParticipants() : [];
  const supabaseConfigured = isSupabaseServiceConfigured();

  return (
    <main className="participants-page">
      <div className="participants-page-bg" aria-hidden="true" />
      <div className="container participants-page-inner">
        <Link className="back-link" href={`/${locale}`}>
          <ArrowLeft aria-hidden="true" />
          {spanish ? "Volver a PanaEXIM" : "Back to PanaEXIM"}
        </Link>

        {!authenticated ? (
          <ParticipantsLogin
            locale={locale}
            configured={isParticipantsAuthConfigured()}
          />
        ) : (
          <section className="participants-vault">
            <header>
              <div>
                <p className="eyebrow">{copy.participants.eyebrow}</p>
                <h1>{copy.participants.title}</h1>
                <p>
                  {spanish
                    ? "Directorio privado de empresas confirmadas en el ecosistema PanaEXIM 2026."
                    : "Private directory of confirmed companies across the PanaEXIM 2026 ecosystem."}
                </p>
              </div>
              <ParticipantsLogout locale={locale} />
            </header>

            <div className="vault-status">
              <ShieldCheck aria-hidden="true" />
              <span>
                {spanish ? "Sesión privada verificada" : "Private session verified"}
              </span>
            </div>

            {!supabaseConfigured ? (
              <div className="directory-setup-state">
                <Database aria-hidden="true" />
                <h2>{spanish ? "Supabase aún no está conectado" : "Supabase is not connected yet"}</h2>
                <p>
                  {spanish
                    ? "La seguridad del acceso ya funciona. Añade las variables de Supabase y ejecuta la migración incluida para cargar participantes reales desde el panel administrativo."
                    : "Access security is already working. Add the Supabase variables and run the included migration to load real participants from the admin dashboard."}
                </p>
              </div>
            ) : participants.length ? (
              <ParticipantDirectory locale={locale} participants={participants} />
            ) : (
              <div className="directory-setup-state">
                <Database aria-hidden="true" />
                <h2>{spanish ? "Directorio preparado" : "Directory ready"}</h2>
                <p>
                  {spanish
                    ? "Todavía no hay participantes publicados. El equipo puede cargarlos y ordenarlos desde el panel administrativo."
                    : "No participants are published yet. The team can upload and organize them from the admin dashboard."}
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
