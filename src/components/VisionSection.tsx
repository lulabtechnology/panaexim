import Image from "next/image";
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
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.4" cy="6.7" r="1" fill="currentColor" />
                </svg>
                <span>Instagram</span>
              </a>
              <a href={event.facebook} target="_blank" rel="noreferrer" aria-label={`Facebook · ${event.name}`}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V4a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.4Z" />
                </svg>
                <span>Facebook</span>
              </a>
            </nav>
          </article>
        ))}
      </div>
    </section>
  );
}
