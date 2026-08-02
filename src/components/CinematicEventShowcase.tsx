"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type { EventItem, Locale, SiteContent } from "@/lib/content";

type CinematicEventShowcaseProps = {
  locale: Locale;
  heading: SiteContent["eventsHeading"];
  events: EventItem[];
};

const panelCount = 7;
const transitionStart = 0.42;
const transitionDuration = 0.58;

export function CinematicEventShowcase({ locale, heading, events }: CinematicEventShowcaseProps) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const mobileTrack = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const mobileFrame = useRef<number | null>(null);
  const dragState = useRef({ active: false, pointerId: -1, startX: 0, currentX: 0 });
  const [active, setActive] = useState(0);
  const [mobileActive, setMobileActive] = useState(0);
  const spanish = locale === "es";

  useEffect(() => {
    if (!root.current || !stage.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const scenes = gsap.utils.toArray<HTMLElement>(".px-showcase-scene", root.current);
      const timeline = gsap.timeline({ paused: true });
      const totalDuration = Math.max(1, scenes.length - 1);

      // Establish a deterministic starting state before ScrollTrigger takes control.
      scenes.forEach((scene, index) => {
        const panels = scene.querySelectorAll(".px-showcase-panel");
        const copy = scene.querySelectorAll(".px-showcase-copy > *");
        const backdrop = scene.querySelector(".px-showcase-backdrop");
        const vignette = scene.querySelector(".px-showcase-vignette");

        gsap.set(scene, { autoAlpha: index === 0 ? 1 : 0, zIndex: index === 0 ? 10 : index });
        gsap.set(panels, {
          yPercent: 0,
          clipPath: "inset(0 0% 0 0%)",
          rotateY: 0,
          scale: 1,
          autoAlpha: 1,
        });
        gsap.set(copy, {
          autoAlpha: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : 30,
        });
        if (backdrop) gsap.set(backdrop, { autoAlpha: index === 0 ? 0.2 : 0.08, scale: 1.035 });
        if (vignette) gsap.set(vignette, { autoAlpha: 1 });
      });

      // A transparent spacer gives every scene a stable hold before its transition.
      timeline.to({}, { duration: totalDuration }, 0);

      for (let index = 1; index < scenes.length; index += 1) {
        const previous = scenes[index - 1];
        const next = scenes[index];
        const previousPanels = previous.querySelectorAll(".px-showcase-panel");
        const nextPanels = next.querySelectorAll(".px-showcase-panel");
        const previousCopy = previous.querySelectorAll(".px-showcase-copy > *");
        const nextCopy = next.querySelectorAll(".px-showcase-copy > *");
        const previousBackdrop = previous.querySelector(".px-showcase-backdrop");
        const nextBackdrop = next.querySelector(".px-showcase-backdrop");
        const start = index - 1 + transitionStart;
        const finish = index;

        timeline
          .set(next, { autoAlpha: 1, zIndex: 20 + index }, start)
          .fromTo(
            nextPanels,
            {
              yPercent: (panelIndex: number) => (panelIndex % 2 ? 70 : -70),
              clipPath: "inset(0 47% 0 47%)",
              rotateY: (panelIndex: number) => (panelIndex % 2 ? -8 : 8),
              scale: 1.065,
              autoAlpha: 0.12,
            },
            {
              yPercent: 0,
              clipPath: "inset(0 0% 0 0%)",
              rotateY: 0,
              scale: 1,
              autoAlpha: 1,
              duration: transitionDuration,
              stagger: { amount: 0.11, from: "center" },
              ease: "power4.inOut",
            },
            start,
          )
          .to(
            previousPanels,
            {
              yPercent: (panelIndex: number) => (panelIndex % 2 ? -66 : 66),
              clipPath: "inset(0 43% 0 43%)",
              rotateY: (panelIndex: number) => (panelIndex % 2 ? 7 : -7),
              scale: 0.985,
              autoAlpha: 0.14,
              duration: transitionDuration * 0.94,
              stagger: { amount: 0.09, from: "edges" },
              ease: "power3.inOut",
            },
            start,
          )
          .to(
            previousCopy,
            {
              y: -24,
              autoAlpha: 0,
              duration: 0.18,
              stagger: 0.014,
              ease: "power2.in",
            },
            start,
          )
          .fromTo(
            nextCopy,
            { y: 32, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.28,
              stagger: 0.022,
              ease: "power3.out",
            },
            start + 0.25,
          );

        if (previousBackdrop) {
          timeline.to(
            previousBackdrop,
            { autoAlpha: 0.05, scale: 1.075, duration: transitionDuration, ease: "power2.inOut" },
            start,
          );
        }
        if (nextBackdrop) {
          timeline.fromTo(
            nextBackdrop,
            { autoAlpha: 0.08, scale: 1.08 },
            { autoAlpha: 0.22, scale: 1.035, duration: transitionDuration, ease: "power2.inOut" },
            start,
          );
        }

        timeline.set(previous, { autoAlpha: 0 }, finish);
      }

      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${window.innerHeight * totalDuration * 1.3}`,
        pin: stage.current,
        scrub: 0.78,
        anticipatePin: 1,
        animation: timeline,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / totalDuration,
          duration: { min: 0.18, max: 0.42 },
          delay: 0.08,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const next = Math.min(events.length - 1, Math.round(self.progress * totalDuration));
          setActive((current) => (current === next ? current : next));
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

  useEffect(
    () => () => {
      if (mobileFrame.current !== null) window.cancelAnimationFrame(mobileFrame.current);
      document.documentElement.classList.remove("is-showcase-dragging");
    },
    [],
  );

  function jumpTo(index: number) {
    const trigger = triggerRef.current;
    if (!trigger || events.length < 2) return;
    const boundedIndex = Math.max(0, Math.min(events.length - 1, index));
    const progress = boundedIndex / (events.length - 1);
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * progress,
      behavior: "smooth",
    });
  }

  function beginDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!triggerRef.current || (event.pointerType === "mouse" && event.button !== 0)) return;
    if ((event.target as Element).closest("a, button")) return;

    dragState.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      currentX: event.clientX,
    };
    stage.current?.setPointerCapture(event.pointerId);
    stage.current?.classList.add("is-dragging");
    document.documentElement.classList.add("is-showcase-dragging");
  }

  function moveDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState.current.active || dragState.current.pointerId !== event.pointerId) return;
    dragState.current.currentX = event.clientX;
  }

  function finishDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState.current.active || dragState.current.pointerId !== event.pointerId) return;

    const movement = event.clientX - dragState.current.startX;
    dragState.current.currentX = event.clientX;
    dragState.current.active = false;
    stage.current?.classList.remove("is-dragging");
    document.documentElement.classList.remove("is-showcase-dragging");

    if (stage.current?.hasPointerCapture(event.pointerId)) {
      stage.current.releasePointerCapture(event.pointerId);
    }

    if (Math.abs(movement) >= 64) {
      jumpTo(active + (movement < 0 ? 1 : -1));
    }
  }

  function updateMobileActive() {
    const track = mobileTrack.current;
    if (!track) return;

    if (mobileFrame.current !== null) window.cancelAnimationFrame(mobileFrame.current);
    mobileFrame.current = window.requestAnimationFrame(() => {
      const cards = Array.from(track.querySelectorAll<HTMLElement>(".px-mobile-scene"));
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let distance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const currentDistance = Math.abs(center - cardCenter);
        if (currentDistance < distance) {
          nearest = index;
          distance = currentDistance;
        }
      });

      setMobileActive(nearest);
    });
  }

  function scrollMobileTo(index: number) {
    const track = mobileTrack.current;
    const card = track?.querySelectorAll<HTMLElement>(".px-mobile-scene")[index];
    if (!track || !card) return;

    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  }

  function handleMobileKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollMobileTo(Math.min(events.length - 1, mobileActive + 1));
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollMobileTo(Math.max(0, mobileActive - 1));
    }
  }

  function handleDesktopKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      jumpTo(active + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      jumpTo(active - 1);
    }
  }

  return (
    <section className="px-showcase" id="events" ref={root} aria-labelledby="showcase-title">
      <div
        className="px-showcase-stage"
        ref={stage}
        role="region"
        tabIndex={0}
        aria-label={spanish ? "Showcase de eventos PanaEXIM" : "PanaEXIM event showcase"}
        onKeyDown={handleDesktopKey}
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
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
              className={`px-showcase-scene px-showcase-scene-${event.id} ${active === sceneIndex ? "is-active" : ""}`}
              key={event.id}
              style={{
                "--scene-accent": event.accent,
                "--scene-soft": event.accentSoft,
              } as React.CSSProperties}
              aria-hidden={active !== sceneIndex}
            >
              <div
                className="px-showcase-backdrop"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(2,4,8,.18), rgba(2,4,8,.68)), url(${event.image})` }}
                aria-hidden="true"
              />
              <div className="px-showcase-panels" aria-hidden="true">
                {Array.from({ length: panelCount }).map((_, panelIndex) => (
                  <div
                    className="px-showcase-panel"
                    key={panelIndex}
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(2,4,8,.03), rgba(2,4,8,.42)), url(${event.image})`,
                      backgroundSize: `100% 100%, ${panelCount * 100}% 100%`,
                      backgroundPosition: `center, ${(panelIndex / (panelCount - 1)) * 100}% center`,
                    }}
                  />
                ))}
              </div>
              <div className="px-showcase-vignette" aria-hidden="true" />
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

        <nav className="px-showcase-rail" aria-label={spanish ? "Seleccionar evento" : "Select event"}>
          {events.map((event, index) => (
            <button
              key={event.id}
              type="button"
              className={index === active ? "is-active" : ""}
              onClick={() => jumpTo(index)}
              aria-label={event.name}
              aria-current={index === active ? "step" : undefined}
            >
              <span>{event.number}</span><i />
            </button>
          ))}
        </nav>
        <div className="px-showcase-arrows">
          <button type="button" onClick={() => jumpTo(active - 1)} disabled={active === 0} aria-label={spanish ? "Evento anterior" : "Previous event"}><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => jumpTo(active + 1)} disabled={active === events.length - 1} aria-label={spanish ? "Evento siguiente" : "Next event"}><ArrowRight aria-hidden="true" /></button>
        </div>
      </div>

      <div className="px-showcase-mobile">
        <div className="px-showcase-mobile-head">
          <span>{heading.eyebrow}</span>
          <h2>{spanish ? "Cuatro industrias. Un destino." : "Four industries. One destination."}</h2>
          <p>{spanish ? "Deslice horizontalmente para explorar" : "Swipe horizontally to explore"}</p>
        </div>

        <div
          className="px-showcase-mobile-track"
          ref={mobileTrack}
          onScroll={updateMobileActive}
          onKeyDown={handleMobileKey}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={spanish ? "Carrusel de eventos PanaEXIM" : "PanaEXIM event carousel"}
        >
          {events.map((event, index) => (
            <article
              key={event.id}
              className={`px-mobile-scene px-mobile-scene-${event.id} ${mobileActive === index ? "is-active" : ""}`}
              style={{ "--scene-accent": event.accent } as React.CSSProperties}
              aria-label={`${event.number} / 04 · ${event.name}`}
              aria-current={mobileActive === index ? "true" : undefined}
            >
              <Image src={event.mobileImage} alt="" fill sizes="(max-width: 900px) 88vw, 1px" />
              <div className="px-mobile-scene-lines" aria-hidden="true"><span /><span /></div>
              <div className="px-mobile-scene-scrim" aria-hidden="true" />
              <div className="px-mobile-scene-copy">
                <span>{event.number} / 04</span>
                <Image src={event.logo} alt={`${event.name} logo`} width={360} height={150} />
                <h3>{event.name}</h3>
                <p>{event.kicker}</p>
                <a href={event.url} target="_blank" rel="noreferrer" tabIndex={mobileActive === index ? 0 : -1}>{event.cta}<ArrowUpRight aria-hidden="true" /></a>
              </div>
            </article>
          ))}
        </div>

        <nav className="px-showcase-mobile-progress" aria-label={spanish ? "Seleccionar evento" : "Select event"}>
          <span>{String(mobileActive + 1).padStart(2, "0")}</span>
          <div>
            {events.map((event, index) => (
              <button
                type="button"
                key={event.id}
                className={mobileActive === index ? "is-active" : ""}
                onClick={() => scrollMobileTo(index)}
                aria-label={event.name}
                aria-current={mobileActive === index ? "step" : undefined}
              />
            ))}
          </div>
          <span>{String(events.length).padStart(2, "0")}</span>
        </nav>
      </div>
    </section>
  );
}
