import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import type { EventItem, Locale, SiteContent } from "@/lib/content";

type VisionSectionProps = {
  locale: Locale;
  about: SiteContent["about"];
  leadership: SiteContent["leadership"];
  events: EventItem[];
};

export function VisionSection({ locale, about, leadership, events }: VisionSectionProps) {
  const socialLabel = locale === "es" ? "Redes oficiales" : "Official social media";

  return (
    <section className="px-vision" id="panaexim">
      <div className="px-vision-grid">
        <div className="px-vision-title">
          <p className="eyebrow">{leadership.eyebrow}</p>
          <h2>{leadership.title}</h2>
        </div>
        <div className="px-vision-copy">
          <p>{about.body}</p>
          <p>{leadership.body}</p>
        </div>
      </div>

      <div className="px-vision-stats">
        {about.stats.map((stat) => (
          <article key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </div>

      <div className="px-vision-logos" aria-label={locale === "es" ? "Eventos de PanaEXIM" : "PanaEXIM events"}>
        {events.map((event) => (
          <article className="px-vision-event" key={event.id}>
            <span className="px-vision-event-number">{event.number}</span>
            <a className="px-vision-event-link" href={event.url} target="_blank" rel="noreferrer">
              <Image src={event.logo} alt={event.name} width={360} height={150} />
            </a>
            <nav className="px-event-socials" aria-label={`${socialLabel}: ${event.name}`}>
              <a href={event.instagram} target="_blank" rel="noreferrer" aria-label={`Instagram · ${event.name}`}>
                <Instagram aria-hidden="true" />
                <span>Instagram</span>
              </a>
              <a href={event.facebook} target="_blank" rel="noreferrer" aria-label={`Facebook · ${event.name}`}>
                <Facebook aria-hidden="true" />
                <span>Facebook</span>
              </a>
            </nav>
          </article>
        ))}
      </div>
    </section>
  );
}
