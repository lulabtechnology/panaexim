"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { EventItem, SiteContent } from "@/lib/content";
import { Countdown } from "@/components/Countdown";

type HeroProps = {
  hero: SiteContent["hero"];
  events: EventItem[];
};

export function Hero({ hero, events }: HeroProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 });
      timeline
        .fromTo(".px-hero-line", { scaleY: 0 }, { scaleY: 1, duration: 0.9 })
        .fromTo(".px-hero-reveal", { yPercent: 115, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.95, stagger: 0.075 }, "-=0.62")
        .fromTo(".px-hero-sector", { clipPath: "inset(0 50% 0 50%)", scale: 1.12 }, { clipPath: "inset(0 0% 0 0%)", scale: 1, duration: 1.2, stagger: 0.1 }, "-=0.8")
        .fromTo(".px-hero-sector-meta", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.08 }, "-=0.55")
        .fromTo(".px-countdown-bar", { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8 }, "-=0.5");

      gsap.to(".px-hero-visual", {
        yPercent: 9,
        scale: 1.035,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.to(".px-hero-copy", {
        yPercent: 12,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "35% top", end: "bottom top", scrub: 1 },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section className="px-hero" ref={root} aria-labelledby="hero-title">
      <span className="px-hero-line" aria-hidden="true" />
      <div className="px-hero-copy">
        <div className="px-hero-copy-inner">
          <div className="px-hero-overline px-hero-reveal">4 Events. Infinite Opportunities.</div>
          <h1 id="hero-title">
            <span className="px-hero-reveal">PanaEXIM</span>
            <span className="px-hero-reveal">2026</span>
          </h1>
          <p className="px-hero-description px-hero-reveal">{hero.description}</p>
          <div className="px-hero-date px-hero-reveal">
            <strong>23—26 NOV 2026</strong>
            <span>Panama Convention Center</span>
          </div>
          <a className="px-text-link px-hero-reveal" href="#events">
            {hero.secondaryCta}
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="px-hero-visual" aria-label="PanaEXIM events">
        {events.map((event, index) => (
          <a
            href="#events"
            className={`px-hero-sector px-hero-sector-${event.id}`}
            key={event.id}
            style={{ "--sector-accent": event.accent } as React.CSSProperties}
            aria-label={event.name}
          >
            <Image
              src={event.heroImage}
              alt=""
              fill
              sizes="(min-width: 1100px) 17vw, 25vw"
              priority
            />
            <span className="px-hero-sector-scrim" />
            <div className="px-hero-sector-meta">
              <small>{event.number} / 04</small>
              <strong>{event.name}</strong>
            </div>
          </a>
        ))}
      </div>

      <div className="px-countdown-bar">
        <span className="px-countdown-label">{hero.eyebrow}</span>
        <Countdown labels={hero.countdown} />
        <a href="#events" aria-label={hero.scroll}>
          <ArrowDown aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
