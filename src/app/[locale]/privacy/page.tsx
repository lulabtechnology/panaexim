import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/content";

type LegalPageProps = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: LegalPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const spanish = locale === "es";

  return (
    <main className="legal-page">
      <div className="container legal-inner">
        <Link href={`/${locale}`} className="back-link"><ArrowLeft />{spanish ? "Volver" : "Back"}</Link>
        <p className="eyebrow">PanaEXIM 2026</p>
        <h1>{spanish ? "Política de privacidad" : "Privacy policy"}</h1>
        <p className="legal-lead">
          {spanish
            ? "Documento preliminar para el prototipo. Debe revisarse y completarse antes de publicar el dominio final."
            : "Preliminary document for the prototype. It must be reviewed and completed before the final domain is published."}
        </p>
        <section>
          <h2>{spanish ? "Información recopilada" : "Information collected"}</h2>
          <p>{spanish ? "Los formularios pueden recopilar nombre, empresa, país, correo, teléfono y el contenido de la consulta." : "Forms may collect name, company, country, email, phone number and inquiry content."}</p>
        </section>
        <section>
          <h2>{spanish ? "Finalidad" : "Purpose"}</h2>
          <p>{spanish ? "La información se utiliza para responder solicitudes relacionadas con exhibición, visitas, alianzas, prensa y los eventos de PanaEXIM." : "Information is used to respond to requests regarding exhibiting, visits, partnerships, media and PanaEXIM events."}</p>
        </section>
        <section>
          <h2>{spanish ? "Contacto" : "Contact"}</h2>
          <p>ap@panamajewelleryshow.com · +507 6270-6323</p>
        </section>
      </div>
    </main>
  );
}
