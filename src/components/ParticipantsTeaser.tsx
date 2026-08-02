import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import type { Locale, SiteContent } from "@/lib/content";

type ParticipantsTeaserProps = {
  locale: Locale;
  participants: SiteContent["participants"];
};

export function ParticipantsTeaser({ locale, participants }: ParticipantsTeaserProps) {
  return (
    <section className="section participants-teaser" id="participants">
      <div className="participants-blur-grid" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index}>P{String(index + 1).padStart(2, "0")}</span>
        ))}
      </div>
      <div className="container participants-content">
        <div className="participants-lock" aria-hidden="true">
          <LockKeyhole />
        </div>
        <p className="eyebrow">{participants.eyebrow}</p>
        <h2 className="section-title">{participants.title}</h2>
        <p>{participants.body}</p>
        <Link href={`/${locale}/participants`} className="button button-gold">
          {participants.cta}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
