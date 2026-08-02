"use client";

import Image from "next/image";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (!root.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hasSeen = false;
    try {
      hasSeen = window.sessionStorage.getItem("panaexim-preloader") === "seen";
    } catch {
      // Storage can be unavailable in strict privacy modes.
    }
    const duration = reduceMotion ? 0.12 : hasSeen ? 0.45 : 1.65;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => {
          try {
            window.sessionStorage.setItem("panaexim-preloader", "seen");
          } catch {
            // The preloader can still complete when session storage is blocked.
          }
          setRemoved(true);
        },
      });

      timeline
        .fromTo(
          ".preloader-line",
          { scaleX: 0 },
          { scaleX: 1, duration: duration * 0.35, stagger: 0.04, ease: "power3.out" },
        )
        .fromTo(
          ".preloader-emblem",
          { autoAlpha: 0, scale: 0.72, rotate: -14 },
          { autoAlpha: 1, scale: 1, rotate: 0, duration: duration * 0.35, ease: "back.out(1.8)" },
          0.05,
        )
        .fromTo(
          ".preloader-copy > *",
          { yPercent: 90, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: duration * 0.25, stagger: 0.06 },
          duration * 0.25,
        )
        .to(root.current, {
          yPercent: -100,
          duration: duration * 0.45,
          ease: "power4.inOut",
          delay: reduceMotion || hasSeen ? 0 : 0.15,
        });
    }, root);

    return () => context.revert();
  }, []);

  if (removed) return null;

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <span className="preloader-line line-one" />
      <span className="preloader-line line-two" />
      <div className="preloader-center">
        <Image
          className="preloader-emblem"
          src="/media/logos/panaexim-emblem.png"
          alt=""
          width={220}
          height={176}
          priority
        />
        <div className="preloader-copy">
          <strong>PanaEXIM 2026</strong>
          <span>4 Events. Infinite Opportunities.</span>
        </div>
      </div>
    </div>
  );
}
