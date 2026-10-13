import { ArrowUpRight, Building2, Car, Hotel, Plane } from "lucide-react";
import type { Locale, SiteContent } from "@/lib/content";

type VenueSectionProps = {
  locale: Locale;
  venue: SiteContent["venue"];
};

export function VenueSection({ locale, venue }: VenueSectionProps) {
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
            href="https://www.google.com/maps/search/?api=1&query=Megapolis+Convention+Center+Panama"
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
              <strong>Megapolis Convention Center</strong>
              <small>{locale === "es" ? "Avenida Balboa · Ciudad de Panamá" : "Avenida Balboa · Panama City"}</small>
            </div>
          </div>
          <iframe
            title={locale === "es" ? "Mapa del Megapolis Convention Center" : "Megapolis Convention Center map"}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Megapolis+Convention+Center+Panama&output=embed"
          />
          <div className="venue-date-strip">
            <strong>23–25</strong>
            <span>FEB 2027</span>
            <small>10:00–18:00</small>
          </div>
        </div>
      </div>
    </section>
  );
}
