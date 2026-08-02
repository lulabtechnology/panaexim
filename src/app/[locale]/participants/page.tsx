import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ParticipantsLogin } from "@/components/ParticipantsLogin";
import { ParticipantsLogout } from "@/components/ParticipantsLogout";
import { content, isLocale } from "@/lib/content";
import {
  isParticipantsAuthConfigured,
  PARTICIPANTS_COOKIE,
  verifySessionToken,
} from "@/lib/participants-auth";

const eventGroups = [
  { name: "Panama Jewellery Show", logo: "/media/logos/panama-jewellery-show.png" },
  { name: "PanaCosmetica", logo: "/media/logos/panacosmetica.svg" },
  { name: "PanaDefensa International", logo: "/media/logos/panadefensa.png" },
  { name: "PanaEnergy", logo: "/media/logos/panaenergy.svg" },
];

type ParticipantsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ParticipantsPage({ params }: ParticipantsPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const copy = content[locale];
  const cookieStore = await cookies();
  const authenticated = verifySessionToken(cookieStore.get(PARTICIPANTS_COOKIE)?.value);
  const spanish = locale === "es";

  return (
    <main className="participants-page">
      <div className="participants-page-bg" aria-hidden="true" />
      <div className="container participants-page-inner">
        <Link className="back-link" href={`/${locale}`}>
          <ArrowLeft aria-hidden="true" />
          {spanish ? "Volver a PanaEXIM" : "Back to PanaEXIM"}
        </Link>

        {!authenticated ? (
          <ParticipantsLogin locale={locale} configured={isParticipantsAuthConfigured()} />
        ) : (
          <section className="participants-vault">
            <header>
              <div>
                <p className="eyebrow">{copy.participants.eyebrow}</p>
                <h1>{copy.participants.title}</h1>
                <p>
                  {spanish
                    ? "La estructura segura del directorio ya está funcionando. Los logotipos reales se conectarán en la siguiente fase mediante Supabase."
                    : "The secure directory structure is working. Real participant logos will be connected in the next phase through Supabase."}
                </p>
              </div>
              <ParticipantsLogout locale={locale} />
            </header>

            <div className="vault-status">
              <ShieldCheck aria-hidden="true" />
              <span>{spanish ? "Sesión privada verificada" : "Private session verified"}</span>
            </div>

            <div className="participant-groups">
              {eventGroups.map((group, groupIndex) => (
                <article key={group.name} className="participant-group">
                  <div className="participant-group-heading">
                    <Image src={group.logo} alt={group.name} width={220} height={88} />
                    <strong>{group.name}</strong>
                  </div>
                  <div className="participant-preview-grid">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div className="participant-placeholder" key={index}>
                        <span>P{groupIndex + 1}{index + 1}</span>
                        <small>{spanish ? "Espacio de logo" : "Logo slot"}</small>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
