import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CinematicEventShowcase } from "@/components/CinematicEventShowcase";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { OpportunitiesSection } from "@/components/OpportunitiesSection";
import { ParticipantsTeaser } from "@/components/ParticipantsTeaser";
import { Preloader } from "@/components/Preloader";
import { VenueSection } from "@/components/VenueSection";
import { VisionSection } from "@/components/VisionSection";
import { content, isLocale, locales } from "@/lib/content";

type HomePageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = isLocale(requestedLocale) ? requestedLocale : "es";
  const spanish = locale === "es";
  const title = "PanaEXIM 2026 — 4 Events. Infinite Opportunities.";
  const description = spanish
    ? "Cuatro exposiciones internacionales convergen en Panamá del 23 al 26 de noviembre de 2026."
    : "Four international exhibitions converge in Panama from November 23–26, 2026.";

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${spanish ? "es" : "en"}`, languages: { es: "/es", en: "/en" } },
    openGraph: {
      type: "website",
      siteName: "PanaEXIM 2026",
      title,
      description,
      locale: spanish ? "es_PA" : "en_US",
      images: [{ url: "/media/phase8/hero/panaexim-og.webp", width: 1600, height: 900, alt: "PanaEXIM 2026" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/media/phase8/hero/panaexim-og.webp"],
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const copy = content[locale];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ExhibitionEvent",
    name: "PanaEXIM 2026",
    description: copy.hero.description,
    startDate: "2026-11-23T10:00:00-05:00",
    endDate: "2026-11-26T18:00:00-05:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: "Panama Convention Center", address: { "@type": "PostalAddress", addressLocality: "Panama City", addressCountry: "PA" } },
    organizer: { "@type": "Organization", name: "PanaEXIM" },
  };

  return (
    <>
      <Preloader />
      <Header locale={locale} navigation={copy.navigation} />
      <main>
        <Hero locale={locale} hero={copy.hero} events={copy.events} />
        <CinematicEventShowcase locale={locale} heading={copy.eventsHeading} events={copy.events} />
        <VisionSection locale={locale} about={copy.about} leadership={copy.leadership} events={copy.events} />
        <OpportunitiesSection locale={locale} opportunities={copy.opportunities} />
        <ParticipantsTeaser locale={locale} participants={copy.participants} />
        <VenueSection locale={locale} venue={copy.venue} />
        <ContactSection locale={locale} contact={copy.contact} />
      </main>
      <Footer locale={locale} footer={copy.footer} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
