import { ArrowRight } from "lucide-react";
import type { Locale, SiteContent } from "@/lib/content";

type OpportunitiesSectionProps = {
  locale: Locale;
  opportunities: SiteContent["opportunities"];
};

export function OpportunitiesSection({ locale, opportunities }: OpportunitiesSectionProps) {
  return (
    <section className="section opportunities-section">
      <div className="container">
        <div className="opportunities-intro">
          <p className="eyebrow">{opportunities.eyebrow}</p>
          <h2 className="section-title">{opportunities.title}</h2>
          <p>{opportunities.description}</p>
        </div>

        <div className="opportunity-grid">
          {opportunities.items.map((item) => (
            <article key={item.number} className="opportunity-card">
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <div className="opportunity-line" aria-hidden="true" />
            </article>
          ))}
        </div>

        <div className="section-actions">
          <a href="#contact" className="button button-gold">
            {opportunities.primaryCta}
            <ArrowRight aria-hidden="true" />
          </a>
          <a href={`/${locale}/participants`} className="button button-ghost">
            {opportunities.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
