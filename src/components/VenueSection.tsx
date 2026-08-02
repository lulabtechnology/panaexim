import { ArrowUpRight, Building2, Car, Hotel, Plane } from "lucide-react";
import type { SiteContent } from "@/lib/content";

type VenueSectionProps = {
  venue: SiteContent["venue"];
};

export function VenueSection({ venue }: VenueSectionProps) {
  return (
    <section className="section venue-section" id="venue">
      <div className="container venue-grid">
        <div className="venue-copy">
          <p className="eyebrow">{venue.eyebrow}</p>
          <h2 className="section-title">{venue.title}</h2>
          <p className="venue-intro">{venue.body}</p>

          <div className="venue-details">
            <article>
              <Plane aria-hidden="true" />
              <div>
                <h3>{venue.airportTitle}</h3>
                <p>{venue.airportBody}</p>
              </div>
            </article>
            <article>
              <Car aria-hidden="true" />
              <div>
                <h3>{venue.cityTitle}</h3>
                <p>{venue.cityBody}</p>
              </div>
            </article>
            <article>
              <Hotel aria-hidden="true" />
              <div>
                <h3>{venue.lodgingTitle}</h3>
                <p>{venue.lodgingBody}</p>
              </div>
            </article>
          </div>

          <a
            className="button button-ghost"
            href="https://www.google.com/maps/search/?api=1&query=Panama+Convention+Center"
            target="_blank"
            rel="noreferrer"
          >
            {venue.mapCta}
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        <div className="venue-map-card">
          <div className="venue-map-header">
            <span>
              <Building2 aria-hidden="true" />
            </span>
            <div>
              <strong>Panama Convention Center</strong>
              <small>Amador · Ciudad de Panamá</small>
            </div>
          </div>
          <iframe
            title="Panama Convention Center map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Panama+Convention+Center&output=embed"
          />
          <div className="venue-date-strip">
            <strong>23–26</strong>
            <span>NOV 2026</span>
            <small>10:00–18:00</small>
          </div>
        </div>
      </div>
    </section>
  );
}
