"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ExternalLink, MoveHorizontal } from "lucide-react";
import gsap from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import { Observer } from "gsap/dist/Observer";
import { useCallback, useEffect, useRef, useState } from "react";
import type { EventItem, Locale, SiteContent } from "@/lib/content";

type EventCarouselProps = {
  locale: Locale;
  heading: SiteContent["eventsHeading"];
  events: EventItem[];
};

function circularDistance(index: number, active: number, length: number) {
  let distance = index - active;
  if (distance > length / 2) distance -= length;
  if (distance < -length / 2) distance += length;
  return distance;
}

export function EventCarousel({ locale, heading, events }: EventCarouselProps) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<Array<HTMLElement | null>>([]);
  const transitionLocked = useRef(false);

  const go = useCallback(
    (direction: number) => {
      if (transitionLocked.current) return;
      transitionLocked.current = true;
      window.setTimeout(() => {
        transitionLocked.current = false;
      }, 720);

      setActive((current) => {
        const next = (current + direction + events.length) % events.length;
        activeRef.current = next;
        return next;
      });
    },
    [events.length],
  );

  useEffect(() => {
    if (!stage.current) return;
    gsap.registerPlugin(Observer, Draggable);

    const observer = Observer.create({
      target: stage.current,
      type: "wheel",
      tolerance: 55,
      preventDefault: false,
      onDown: () => go(1),
      onUp: () => go(-1),
    });

    const proxy = document.createElement("div");
    let pressX = 0;
    const draggable = Draggable.create(proxy, {
      trigger: stage.current,
      type: "x",
      minimumMovement: 12,
      onPress() {
        pressX = this.x;
      },
      onDragEnd() {
        const movement = this.x - pressX;
        if (Math.abs(movement) > 44) {
          go(movement < 0 ? 1 : -1);
        }
        gsap.set(proxy, { x: 0 });
      },
    })[0];

    return () => {
      observer.kill();
      draggable?.kill();
    };
  }, [go]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    cards.current.forEach((card, index) => {
      if (!card) return;
      const distance = circularDistance(index, active, events.length);
      const absolute = Math.abs(distance);
      const duration = reduceMotion ? 0 : 1.05;

      gsap.to(card, {
        xPercent: distance * 79,
        z: -absolute * 190,
        rotateY: distance * -17,
        scale: 1 - absolute * 0.115,
        opacity: absolute > 1 ? 0.18 : absolute === 1 ? 0.62 : 1,
        filter: absolute === 0 ? "blur(0px)" : `blur(${absolute * 1.2}px)`,
        zIndex: 10 - absolute,
        pointerEvents: absolute === 0 ? "auto" : "none",
        duration,
        ease: "power4.inOut",
      });

      gsap.to(card.querySelector(".event-card-image"), {
        scale: absolute === 0 ? 1.025 : 1.12,
        xPercent: distance * -3,
        duration,
        ease: "power4.inOut",
      });

      gsap.to(card.querySelectorAll(".event-card-reveal"), {
        y: absolute === 0 ? 0 : 22,
        autoAlpha: absolute === 0 ? 1 : 0,
        duration: reduceMotion ? 0 : 0.62,
        stagger: absolute === 0 ? 0.055 : 0,
        delay: absolute === 0 && !reduceMotion ? 0.34 : 0,
        ease: "power3.out",
      });
    });
  }, [active, events.length]);

  const current = events[active];
  const spanish = locale === "es";

  return (
    <section
      className="section events-section"
      id="events"
      ref={root}
      style={
        {
          "--active-accent": current.accent,
          "--active-accent-soft": current.accentSoft,
        } as React.CSSProperties
      }
    >
      <div className="events-ambient" aria-hidden="true" />
      <div className="container events-heading">
        <div>
          <p className="eyebrow">{heading.eyebrow}</p>
          <h2 className="section-title">{heading.title}</h2>
        </div>
        <div className="events-heading-copy">
          <p>{heading.description}</p>
          <span>
            <MoveHorizontal aria-hidden="true" />
            {heading.instruction}
          </span>
        </div>
      </div>

      <div className="carousel-shell">
        <div
          className="carousel-stage"
          ref={stage}
          role="region"
          aria-roledescription="carousel"
          aria-label={spanish ? "Eventos PanaEXIM" : "PanaEXIM events"}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              go(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              go(1);
            }
          }}
        >
          {events.map((event, index) => {
            const isActive = index === active;
            return (
              <article
                className={`event-card event-card-${event.id}`}
                key={event.id}
                ref={(element) => {
                  cards.current[index] = element;
                }}
                aria-hidden={!isActive}
                style={
                  {
                    "--event-image": `url(${event.image})`,
                    "--event-mobile-image": `url(${event.mobileImage})`,
                    "--event-accent": event.accent,
                  } as React.CSSProperties
                }
              >
                <div className="event-card-image" aria-hidden="true" />
                <div className="event-card-scrim" />
                <div className="event-card-grid" aria-hidden="true" />
                <div className="event-card-top">
                  <span>{event.number}</span>
                  <Image
                    src={event.logo}
                    alt={`${event.name} logo`}
                    width={270}
                    height={110}
                    className={`event-logo event-logo-${event.id}`}
                  />
                </div>
                <div className="event-card-content">
                  <p className="event-card-kicker event-card-reveal">{event.kicker}</p>
                  <h3 className="event-card-reveal">{event.name}</h3>
                  <p className="event-card-description event-card-reveal">{event.description}</p>
                  <ul className="event-tags event-card-reveal" aria-label={`${event.name} categories`}>
                    {event.categories.map((category) => (
                      <li key={category}>{category}</li>
                    ))}
                  </ul>
                  <a
                    className="event-card-link event-card-reveal"
                    href={event.url}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={isActive ? 0 : -1}
                  >
                    {event.cta}
                    <ExternalLink aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="carousel-controls container-wide">
          <div className="carousel-progress" aria-live="polite">
            <strong>{String(active + 1).padStart(2, "0")}</strong>
            <span />
            <small>{String(events.length).padStart(2, "0")}</small>
          </div>
          <div className="carousel-buttons">
            <button type="button" onClick={() => go(-1)} aria-label={spanish ? "Evento anterior" : "Previous event"}>
              <ArrowLeft aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={spanish ? "Evento siguiente" : "Next event"}>
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
