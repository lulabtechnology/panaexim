"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import type { EventItem, Locale, SiteContent } from "@/lib/content";

type CinematicEventShowcaseProps = {
  locale: Locale;
  heading: SiteContent["eventsHeading"];
  events: EventItem[];
};

const panelCount = 7;

export function CinematicEventShowcase({ locale, heading, events }: CinematicEventShowcaseProps) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const spanish = locale === "es";

  useEffect(() => {
    if (!root.current || !stage.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const scenes = gsap.utils.toArray<HTMLElement>(".px-showcase-scene", root.current);
      const timeline = gsap.timeline({ paused: true });

      scenes.forEach((scene, index) => {
        gsap.set(scene, { autoAlpha: index === 0 ? 1 : 0, zIndex: index + 1 });
        gsap.set(scene.querySelectorAll(".px-showcase-panel"), {
          yPercent: index === 0 ? 0 : (panelIndex: number) => (panelIndex % 2 ? 110 : -110),
          clipPath: index === 0 ? "inset(0 0% 0 0%)" : "inset(0 44% 0 44%)",
        });
        gsap.set(scene.querySelectorAll(".px-showcase-copy > *"), { autoAlpha: index === 0 ? 1 : 0, y: index === 0 ? 0 : 34 });
      });

      for (let index = 1; index < scenes.length; index += 1) {
        const previous = scenes[index - 1];
        const next = scenes[index];
        const label = `scene-${index}`;
        timeline.addLabel(label);
        timeline
          .to(previous.querySelectorAll(".px-showcase-copy > *"), {
            y: -28,
            autoAlpha: 0,
            duration: 0.18,
            stagger: 0.018,
            ease: "power2.in",
          }, label)
          .to(previous.querySelectorAll(".px-showcase-panel"), {
            yPercent: (panelIndex: number) => (panelIndex % 2 ? -112 : 112),
            rotateY: (panelIndex: number) => (panelIndex % 2 ? 8 : -8),
            scale: 0.985,
            autoAlpha: 0.18,
            duration: 0.46,
            stagger: { amount: 0.12, from: "edges" },
            ease: "power3.inOut",
          }, label)
          .set(next, { autoAlpha: 1 }, `${label}+=0.06`)
          .fromTo(next.querySelectorAll(".px-showcase-panel"), {
            yPercent: (panelIndex: number) => (panelIndex % 2 ? 112 : -112),
            clipPath: "inset(0 44% 0 44%)",
            rotateY: (panelIndex: number) => (panelIndex % 2 ? -8 : 8),
            scale: 1.09,
            autoAlpha: 0.3,
          }, {
            yPercent: 0,
            clipPath: "inset(0 0% 0 0%)",
            rotateY: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.5,
            stagger: { amount: 0.13, from: "center" },
            ease: "power4.inOut",
          }, `${label}+=0.1`)
          .fromTo(next.querySelectorAll(".px-showcase-copy > *"), {
            y: 36,
            autoAlpha: 0,
          }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.25,
            stagger: 0.025,
            ease: "power3.out",
          }, `${label}+=0.34`)
          .set(previous, { autoAlpha: 0 }, `${label}+=0.58`);
      }

      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (events.length - 1) * 1.35}`,
        pin: stage.current,
        scrub: 0.85,
        anticipatePin: 1,
        animation: timeline,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (events.length - 1),
          duration: { min: 0.18, max: 0.48 },
          delay: 0.08,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const next = Math.min(events.length - 1, Math.round(self.progress * (events.length - 1)));
          setActive((current) => current === next ? current : next);
        },
      });
      triggerRef.current = trigger;

      return () => {
        triggerRef.current = null;
        trigger.kill();
        timeline.kill();
      };
    });

    return () => media.revert();
  }, [events.length]);

  function jumpTo(index: number) {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const progress = index / (events.length - 1);
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: "smooth" });
  }

  return (
    <section className="px-showcase" id="events" ref={root} aria-labelledby="showcase-title">
      <div className="px-showcase-stage" ref={stage}>
        <div className="px-showcase-heading">
          <div>
            <span>{heading.eyebrow}</span>
            <h2 id="showcase-title">{spanish ? "Cuatro industrias. Un destino." : "Four industries. One destination."}</h2>
          </div>
          <p><MoveHorizontal aria-hidden="true" />{heading.instruction}</p>
        </div>

        <div className="px-showcase-desktop" aria-label={spanish ? "Eventos PanaEXIM" : "PanaEXIM events"}>
          {events.map((event, sceneIndex) => (
            <article
              className={`px-showcase-scene px-showcase-scene-${event.id}`}
              key={event.id}
              style={{ "--scene-accent": event.accent, "--scene-soft": event.accentSoft } as React.CSSProperties}
              aria-hidden={active !== sceneIndex}
            >
              <div className="px-showcase-panels" aria-hidden="true">
                {Array.from({ length: panelCount }).map((_, panelIndex) => (
                  <div
                    className="px-showcase-panel"
                    key={panelIndex}
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(2,4,8,.03), rgba(2,4,8,.42)), url(/media/phase8/events/${event.id}.webp)`,
                      backgroundSize: `100% 100%, ${panelCount * 100}% 100%`,
                      backgroundPosition: `center, ${(panelIndex / (panelCount - 1)) * 100}% center`,
                    }}
                  />
                ))}
              </div>
              <div className="px-showcase-vignette" />
              <div className="px-showcase-copy">
                <span className="px-showcase-number">{event.number} / 04</span>
                <Image
                  className={`px-showcase-logo px-showcase-logo-${event.id}`}
                  src={event.logo}
                  alt={`${event.name} logo`}
                  width={520}
                  height={220}
                />
                <p>{event.kicker}</p>
                <h3>{event.name}</h3>
                <a href={event.url} target="_blank" rel="noreferrer" tabIndex={active === sceneIndex ? 0 : -1}>
                  {event.cta}<ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="px-showcase-rail" aria-hidden="true">
          {events.map((event, index) => (
            <button key={event.id} className={index === active ? "is-active" : ""} onClick={() => jumpTo(index)} tabIndex={-1}>
              <span>{event.number}</span><i />
            </button>
          ))}
        </div>
        <div className="px-showcase-arrows">
          <button type="button" onClick={() => jumpTo((active - 1 + events.length) % events.length)} aria-label={spanish ? "Evento anterior" : "Previous event"}><ArrowLeft /></button>
          <button type="button" onClick={() => jumpTo((active + 1) % events.length)} aria-label={spanish ? "Evento siguiente" : "Next event"}><ArrowRight /></button>
        </div>
      </div>

      <div className="px-showcase-mobile">
        <div className="px-showcase-mobile-head">
          <span>{heading.eyebrow}</span>
          <h2>{spanish ? "Cuatro industrias. Un destino." : "Four industries. One destination."}</h2>
          <p>{heading.instruction}</p>
        </div>
        <div className="px-showcase-mobile-track">
          {events.map((event) => (
            <article key={event.id} className={`px-mobile-scene px-mobile-scene-${event.id}`} style={{ "--scene-accent": event.accent } as React.CSSProperties}>
              <Image src={event.mobileImage} alt="" fill sizes="88vw" />
              <div className="px-mobile-scene-lines" aria-hidden="true"><span /><span /></div>
              <div className="px-mobile-scene-scrim" />
              <div className="px-mobile-scene-copy">
                <span>{event.number} / 04</span>
                <Image src={event.logo} alt={`${event.name} logo`} width={360} height={150} />
                <h3>{event.name}</h3>
                <p>{event.kicker}</p>
                <a href={event.url} target="_blank" rel="noreferrer">{event.cta}<ArrowUpRight /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
