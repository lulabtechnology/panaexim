"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
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
    const update = () => setScrolled(window.scrollY > 48);
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
    [navigation.events, "#events"],
    [navigation.about, "#panaexim"],
    [navigation.participants, `/${locale}/participants`],
    [navigation.venue, "#venue"],
    [navigation.contact, "#contact"],
  ] as const;

  return (
    <header className={`px-header ${scrolled || open ? "is-solid" : ""}`}>
      <div className="px-header-inner">
        <Link href={`/${locale}`} className="px-brand" aria-label="PanaEXIM 2026">
          <Image
            src="/media/phase8/logos/panaexim-gold.png"
            alt="PanaEXIM"
            width={1285}
            height={506}
            priority
          />
          <span>2026</span>
        </Link>

        <nav className="px-desktop-nav" aria-label={locale === "es" ? "Navegación principal" : "Main navigation"}>
          {links.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>

        <div className="px-header-actions">
          <Link className="px-language" href={`/${otherLocale}`}>{otherLocale.toUpperCase()}</Link>
          <Link className="px-header-cta" href="#contact">
            {navigation.exhibitor}
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="px-menu-button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="px-mobile-navigation"
            aria-label={open ? (locale === "es" ? "Cerrar menú" : "Close menu") : navigation.menu}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="px-mobile-navigation" className={`px-mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open} inert={open ? undefined : true}>
        <div className="px-mobile-menu-head">
          <span>{locale === "es" ? "Navegación" : "Navigation"}</span>
          <small>PanaEXIM 2026</small>
        </div>
        <nav>
          {links.map(([label, href], index) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>
              <strong>{label}</strong>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <Link className="px-mobile-cta" href="#contact" onClick={() => setOpen(false)}>
          {navigation.exhibitor}
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
