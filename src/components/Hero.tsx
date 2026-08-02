"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { EventItem, Locale, SiteContent } from "@/lib/content";
import { Countdown } from "@/components/Countdown";

type HeroProps = {
  locale: Locale;
  hero: SiteContent["hero"];
  events: EventItem[];
};

const READY_EVENT = "panaexim:ready";

export function Hero({ locale, hero, events }: HeroProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const select = gsap.utils.selector(element);
    let introTimeline: gsap.core.Timeline | null = null;
    let played = false;
    let fallbackTimer = 0;

    const context = gsap.context(() => {
      const line = select(".px-hero-line");
      const reveals = select(".px-hero-reveal");
      const sectors = select(".px-hero-sector");
      const sectorMeta = select(".px-hero-sector-meta");
      const countdown = select(".px-countdown-bar");

      if (reduceMotion) {
        gsap.set([line, reveals, sectors, sectorMeta, countdown], { clearProps: "all" });
      } else {
        gsap.set(line, { scaleY: 0 });
        gsap.set(reveals, { yPercent: 115, autoAlpha: 0 });
        gsap.set(sectors, { clipPath: "inset(0 50% 0 50%)", scale: 1.08 });
        gsap.set(sectorMeta, { y: 20, autoAlpha: 0 });
        gsap.set(countdown, { yPercent: 100, autoAlpha: 0 });
      }

      if (!reduceMotion) {
        gsap.to(select(".px-hero-visual"), {
          yPercent: 5,
          scale: 1.018,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(select(".px-hero-copy"), {
          yPercent: 7,
          autoAlpha: 0.22,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "35% top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, element);

    const runIntro = () => {
      if (played) return;
      played = true;
      window.clearTimeout(fallbackTimer);

      if (reduceMotion) {
        ScrollTrigger.refresh();
        return;
      }

      introTimeline = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => ScrollTrigger.refresh(),
      });

      introTimeline
        .to(select(".px-hero-line"), { scaleY: 1, duration: 0.72 })
        .to(
          select(".px-hero-reveal"),
          { yPercent: 0, autoAlpha: 1, duration: 0.82, stagger: 0.065 },
          "-=0.5",
        )
        .to(
          select(".px-hero-sector"),
          { clipPath: "inset(0 0% 0 0%)", scale: 1, duration: 0.96, stagger: 0.075 },
          "-=0.72",
        )
        .to(
          select(".px-hero-sector-meta"),
          { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05 },
          "-=0.4",
        )
        .to(
          select(".px-countdown-bar"),
          { yPercent: 0, autoAlpha: 1, duration: 0.62 },
          "-=0.34",
        );
    };

    const onReady = () => runIntro();
    window.addEventListener(READY_EVENT, onReady, { once: true });

    if (document.documentElement.dataset.panaeximReady === "true") {
      window.requestAnimationFrame(runIntro);
    } else {
      // The page must never remain invisible if storage, the loader or an
      // extension interrupts the custom ready event.
      fallbackTimer = window.setTimeout(runIntro, 2200);
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener(READY_EVENT, onReady);
      introTimeline?.kill();
      context.revert();
    };
  }, []);

  const spanish = locale === "es";

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

      <div className="px-hero-visual" aria-label={spanish ? "Eventos de PanaEXIM" : "PanaEXIM events"}>
        {events.map((event) => (
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
              sizes="(min-width: 1250px) 16vw, (min-width: 901px) 14vw, 25vw"
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
        <Countdown
          labels={hero.countdown}
          ariaLabel={spanish ? "Cuenta regresiva para PanaEXIM 2026" : "Countdown to PanaEXIM 2026"}
        />
        <a href="#events" aria-label={hero.scroll}>
          <ArrowDown aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
