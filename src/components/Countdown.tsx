"use client";

import { useEffect, useState } from "react";
import { eventDetails } from "@/lib/event";

type CountdownProps = {
  labels: [string, string, string, string];
  ariaLabel: string;
};

const target = new Date(eventDetails.start).getTime();

function calculate() {
  const difference = Math.max(0, target - Date.now());
  return [
    Math.floor(difference / 86_400_000),
    Math.floor((difference / 3_600_000) % 24),
    Math.floor((difference / 60_000) % 60),
    Math.floor((difference / 1_000) % 60),
  ];
}

export function Countdown({ labels, ariaLabel }: CountdownProps) {
  const [values, setValues] = useState<number[] | null>(null);

  useEffect(() => {
    const firstFrame = window.requestAnimationFrame(() => setValues(calculate()));
    const timer = window.setInterval(() => setValues(calculate()), 1000);
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="countdown" role="timer" aria-label={ariaLabel} aria-live="off">
      {labels.map((label, index) => {
        const value = values?.[index];
        return (
          <div className="countdown-unit" key={label}>
            <strong aria-label={value === undefined ? undefined : `${value} ${label}`}>
              {value === undefined ? "—" : String(value).padStart(2, "0")}
            </strong>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
