import Image from "next/image";
import Link from "next/link";
import type { Locale, SiteContent } from "@/lib/content";

type FooterProps = {
  locale: Locale;
  footer: SiteContent["footer"];
};

const eventLinks = [
  ["Panama Jewellery Show", "https://panamajewelryshow.com/"],
  ["PanaCosmetica", "https://panacosmetica.com/"],
  ["PanaDefensa International", "https://panasecurityexpo.com/"],
  ["PanaEnergy", "https://panaenergyexpo.com/"],
] as const;

export function Footer({ locale, footer }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image
            src="/media/phase8/logos/panaexim-gold.png"
            alt="PanaEXIM"
            width={1285}
            height={506}
          />
          <p>{footer.description}</p>
          <strong>23–26 NOV 2026</strong>
          <span>Panama Convention Center</span>
        </div>

        <div>
          <h2>{footer.explore}</h2>
          <nav>
            {eventLinks.map(([label, href]) => (
              <a href={href} target="_blank" rel="noreferrer" key={href}>{label}</a>
            ))}
          </nav>
        </div>

        <div>
          <h2>{footer.legal}</h2>
          <nav>
            <Link href={`/${locale}/privacy`}>{footer.privacy}</Link>
            <Link href={`/${locale}/terms`}>{footer.terms}</Link>
            <Link href={`/${locale}/participants`}>{locale === "es" ? "Participantes" : "Participants"}</Link>
          </nav>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 PanaEXIM. {footer.rights}</p>
        <p>{footer.credit}</p>
      </div>
    </footer>
  );
}
