import Image from "next/image";
import type { EventItem, SiteContent } from "@/lib/content";

type VisionSectionProps = {
  about: SiteContent["about"];
  leadership: SiteContent["leadership"];
  events: EventItem[];
};

export function VisionSection({ about, leadership, events }: VisionSectionProps) {
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

      <div className="px-vision-logos" aria-label="PanaEXIM events">
        {events.map((event) => (
          <a key={event.id} href={event.url} target="_blank" rel="noreferrer">
            <span>{event.number}</span>
            <Image src={event.logo} alt={event.name} width={360} height={150} />
          </a>
        ))}
      </div>
    </section>
  );
}
