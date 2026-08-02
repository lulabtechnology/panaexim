import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { EventCarousel } from "@/components/EventCarousel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LeadershipSection } from "@/components/LeadershipSection";
import { OpportunitiesSection } from "@/components/OpportunitiesSection";
import { ParticipantsTeaser } from "@/components/ParticipantsTeaser";
import { Preloader } from "@/components/Preloader";
import { VenueSection } from "@/components/VenueSection";
import { content, isLocale, locales } from "@/lib/content";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const spanish = locale === "es";
  return {
    description: spanish
      ? "Cuatro exposiciones internacionales convergen en Panamá del 23 al 26 de noviembre de 2026."
      : "Four international exhibitions converge in Panama from November 23–26, 2026.",
    alternates: {
      canonical: `/${spanish ? "es" : "en"}`,
      languages: {
        es: "/es",
        en: "/en",
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const copy = content[rawLocale];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ExhibitionEvent",
    name: "PanaEXIM 2026",
    description: copy.hero.description,
    startDate: "2026-11-23T10:00:00-05:00",
    endDate: "2026-11-26T18:00:00-05:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Panama Convention Center",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Panama City",
        addressCountry: "PA",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "PanaEXIM",
    },
  };

  return (
    <>
      <Preloader />
      <Header locale={rawLocale} navigation={copy.navigation} />
      <main>
        <Hero hero={copy.hero} />
        <AboutSection about={copy.about} />
        <EventCarousel locale={rawLocale} heading={copy.eventsHeading} events={copy.events} />
        <OpportunitiesSection locale={rawLocale} opportunities={copy.opportunities} />
        <LeadershipSection leadership={copy.leadership} />
        <ParticipantsTeaser locale={rawLocale} participants={copy.participants} />
        <VenueSection venue={copy.venue} />
        <ContactSection locale={rawLocale} contact={copy.contact} />
      </main>
      <Footer locale={rawLocale} footer={copy.footer} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
