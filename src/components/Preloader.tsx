"use client";

import Image from "next/image";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const READY_EVENT = "panaexim:ready";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (!root.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hasSeen = false;
    try {
      hasSeen = window.sessionStorage.getItem("panaexim-preloader-v8") === "seen";
    } catch {
      // Storage can be unavailable in strict privacy modes.
    }

    document.documentElement.dataset.panaeximReady = "false";
    document.documentElement.classList.add("is-loading");

    const finish = () => {
      try {
        window.sessionStorage.setItem("panaexim-preloader-v8", "seen");
      } catch {
        // The sequence can finish without storage.
      }
      document.documentElement.classList.remove("is-loading");
      document.documentElement.dataset.panaeximReady = "true";
      window.dispatchEvent(new CustomEvent(READY_EVENT));
      setRemoved(true);
    };

    const context = gsap.context(() => {
      const duration = reduceMotion ? 0.12 : hasSeen ? 0.42 : 1.35;
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: finish,
      });

      timeline
        .fromTo(
          ".px-loader-point",
          { scale: 0, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: duration * 0.24, stagger: 0.045 },
        )
        .fromTo(
          ".px-loader-cross span",
          { scaleX: 0, scaleY: 0 },
          { scaleX: 1, scaleY: 1, duration: duration * 0.28, stagger: 0.035 },
          0.08,
        )
        .fromTo(
          ".px-loader-mark",
          { scale: 0.78, rotate: -18, autoAlpha: 0 },
          { scale: 1, rotate: 0, autoAlpha: 1, duration: duration * 0.35, ease: "back.out(1.55)" },
          0.08,
        )
        .fromTo(
          ".px-loader-word",
          { yPercent: 110, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: duration * 0.24 },
          duration * 0.38,
        )
        .to(
          ".px-loader-slit",
          { scaleY: 1, duration: duration * 0.18, ease: "power2.inOut" },
          duration * 0.58,
        )
        .to(root.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: duration * 0.42,
          ease: "power4.inOut",
        });
    }, root);

    return () => {
      context.revert();
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  if (removed) return null;

  return (
    <div className="px-loader" ref={root} aria-hidden="true">
      <div className="px-loader-cross">
        <span />
        <span />
      </div>
      <span className="px-loader-point point-n" />
      <span className="px-loader-point point-e" />
      <span className="px-loader-point point-s" />
      <span className="px-loader-point point-w" />
      <div className="px-loader-center">
        <Image
          className="px-loader-mark"
          src="/media/logos/panaexim-emblem.png"
          alt=""
          width={240}
          height={192}
          priority
        />
        <div className="px-loader-word">
          <strong>PanaEXIM</strong>
        </div>
      </div>
      <span className="px-loader-slit" />
    </div>
  );
}
