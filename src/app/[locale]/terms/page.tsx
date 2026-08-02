import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/content";

type LegalPageProps = { params: Promise<{ locale: string }> };

export default async function TermsPage({ params }: LegalPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const spanish = locale === "es";

  return (
    <main className="legal-page">
      <div className="container legal-inner">
        <Link href={`/${locale}`} className="back-link"><ArrowLeft />{spanish ? "Volver" : "Back"}</Link>
        <p className="eyebrow">PanaEXIM 2026</p>
        <h1>{spanish ? "Términos de uso" : "Terms of use"}</h1>
        <p className="legal-lead">
          {spanish
            ? "Documento preliminar para el prototipo. Los términos finales deben ajustarse a las condiciones comerciales y legales del evento."
            : "Preliminary document for the prototype. Final terms must be aligned with the event's commercial and legal conditions."}
        </p>
        <section>
          <h2>{spanish ? "Contenido informativo" : "Informational content"}</h2>
          <p>{spanish ? "La información del sitio puede actualizarse a medida que se confirmen participantes, programas, precios, enlaces de registro y documentación." : "Website information may be updated as participants, programs, pricing, registration links and documentation are confirmed."}</p>
        </section>
        <section>
          <h2>{spanish ? "Enlaces externos" : "External links"}</h2>
          <p>{spanish ? "Los sitios de cada feria y plataformas de terceros operan bajo sus propias políticas y condiciones." : "Each exhibition website and third-party platform operates under its own policies and conditions."}</p>
        </section>
        <section>
          <h2>{spanish ? "Contacto" : "Contact"}</h2>
          <p>ap@panamajewelleryshow.com · +507 6270-6323</p>
        </section>
      </div>
    </main>
  );
}
