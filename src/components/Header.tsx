"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale, SiteContent } from "@/lib/content";

type HeaderProps = {
  locale: Locale;
  navigation: SiteContent["navigation"];
};

export function Header({ locale, navigation }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const otherLocale = locale === "es" ? "en" : "es";

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 36);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    [navigation.about, "#panaexim"],
    [navigation.events, "#events"],
    [navigation.participants, `/${locale}/participants`],
    [navigation.venue, "#venue"],
    [navigation.contact, "#contact"],
  ] as const;

  return (
    <header className={`site-header ${scrolled || open ? "is-solid" : ""}`}>
      <div className="site-header-inner">
        <Link href={`/${locale}`} className="brand" aria-label="PanaEXIM 2026">
          <span className="brand-emblem">
            <Image
              src="/media/logos/panaexim-emblem.png"
              alt=""
              width={58}
              height={46}
              priority
            />
          </span>
          <span className="brand-wordmark">
            <strong>PanaEXIM</strong>
            <small>2026</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="language-link" href={`/${otherLocale}`}>
            {otherLocale.toUpperCase()}
          </Link>
          <Link className="button button-small button-gold desktop-cta" href="#contact">
            {navigation.exhibitor}
          </Link>
          <button
            type="button"
            className="menu-button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={navigation.menu}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-glow" />
        <nav aria-label="Mobile navigation">
          {links.map(([label, href], index) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{ "--menu-index": index } as React.CSSProperties}
            >
              <span>0{index + 1}</span>
              {label}
            </Link>
          ))}
        </nav>
        <Link className="button button-gold" href="#contact" onClick={() => setOpen(false)}>
          {navigation.exhibitor}
        </Link>
      </div>
    </header>
  );
}
