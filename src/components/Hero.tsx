"use client";

import { ArrowDown, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { SiteContent } from "@/lib/content";
import { Countdown } from "@/components/Countdown";

type HeroProps = {
  hero: SiteContent["hero"];
};

const panelCount = 7;

export function Hero({ hero }: HeroProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      timeline
        .fromTo(
          ".hero-panel",
          { clipPath: "inset(0 50% 0 50%)", scale: 1.12 },
          {
            clipPath: "inset(0 0% 0 0%)",
            scale: 1,
            duration: 1.45,
            stagger: { amount: 0.38, from: "center" },
          },
        )
        .fromTo(
          ".hero-reveal",
          { yPercent: 115, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 },
          "-=0.72",
        )
        .fromTo(
          ".countdown-unit",
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.07 },
          "-=0.45",
        );

      gsap.to(".hero-panels", {
        yPercent: 12,
        scale: 1.045,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-content", {
        yPercent: 18,
        autoAlpha: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "38% top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section className="hero" ref={root} aria-labelledby="hero-title">
      <div className="hero-panels" aria-hidden="true">
        {Array.from({ length: panelCount }).map((_, index) => (
          <div
            className="hero-panel"
            key={index}
            style={
              {
                "--panel-index": index,
                "--panel-position": `${(index / (panelCount - 1)) * 100}%`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="hero-scrim" />
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-content container-wide">
        <div className="hero-copy">
          <div className="eyebrow hero-reveal">{hero.eyebrow}</div>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-reveal">{hero.title}</span>
          </h1>
          <p className="hero-tagline hero-reveal">{hero.tagline}</p>
          <p className="hero-description hero-reveal">{hero.description}</p>

          <div className="hero-details hero-reveal">
            <span>
              <CalendarDays aria-hidden="true" />
              {hero.date}
            </span>
            <span>
              <MapPin aria-hidden="true" />
              {hero.venue}
            </span>
          </div>

          <div className="hero-actions hero-reveal">
            <a className="button button-gold" href="#contact">
              {hero.primaryCta}
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="button button-ghost" href="#events">
              {hero.secondaryCta}
            </a>
          </div>
        </div>

        <div className="hero-countdown-wrap hero-reveal">
          <Countdown labels={hero.countdown} />
        </div>
      </div>

      <a href="#panaexim" className="hero-scroll">
        <span>{hero.scroll}</span>
        <ArrowDown aria-hidden="true" />
      </a>
    </section>
  );
}
