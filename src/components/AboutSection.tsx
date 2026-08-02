import type { SiteContent } from "@/lib/content";

type AboutSectionProps = {
  about: SiteContent["about"];
};

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section className="section about-section" id="panaexim">
      <div className="about-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="container section-grid">
        <div>
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 className="section-title">{about.title}</h2>
        </div>
        <div className="about-copy">
          <p>{about.body}</p>
        </div>
      </div>
      <div className="container stats-grid">
        {about.stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
