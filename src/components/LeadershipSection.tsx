import Image from "next/image";
import type { SiteContent } from "@/lib/content";

type LeadershipSectionProps = {
  leadership: SiteContent["leadership"];
};

const logos = [
  { src: "/media/logos/panama-jewellery-show.png", alt: "Panama Jewellery Show" },
  { src: "/media/logos/panacosmetica.svg", alt: "PanaCosmetica" },
  { src: "/media/logos/panadefensa.png", alt: "PanaDefensa International" },
  { src: "/media/logos/panaenergy.svg", alt: "PanaEnergy" },
];

export function LeadershipSection({ leadership }: LeadershipSectionProps) {
  return (
    <section className="section leadership-section">
      <div className="leadership-map" aria-hidden="true" />
      <div className="container leadership-grid">
        <div className="leadership-visual">
          <div className="leadership-orbit orbit-one" />
          <div className="leadership-orbit orbit-two" />
          <div className="leadership-emblem">
            <Image
              src="/media/logos/panaexim-emblem.png"
              alt="PanaEXIM"
              width={300}
              height={240}
            />
          </div>
          <div className="orbit-logos">
            {logos.map((logo, index) => (
              <div className={`orbit-logo orbit-logo-${index + 1}`} key={logo.alt}>
                <Image src={logo.src} alt={logo.alt} width={142} height={62} />
              </div>
            ))}
          </div>
        </div>

        <div className="leadership-copy">
          <p className="eyebrow">{leadership.eyebrow}</p>
          <h2 className="section-title">{leadership.title}</h2>
          <p>{leadership.body}</p>
          <ul>
            {leadership.pillars.map((pillar) => (
              <li key={pillar}>
                <span aria-hidden="true" />
                {pillar}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
