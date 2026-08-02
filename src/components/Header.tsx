"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale, SiteContent } from "@/lib/content";

type HeaderProps = {
  locale: Locale;
  navigation: SiteContent["navigation"];
};

export function Header({ locale, navigation }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileMenu = useRef<HTMLDivElement>(null);
  const otherLocale = locale === "es" ? "en" : "es";

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 48);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previousOverflow;

    if (open) {
      window.requestAnimationFrame(() => {
        mobileMenu.current?.querySelector<HTMLElement>("a[href]")?.focus();
      });
    }

    function handleMenuKeyboard(event: KeyboardEvent) {
      if (!open) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        window.requestAnimationFrame(() => menuButton.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;

      const menuItems = Array.from(
        mobileMenu.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const focusable = [menuButton.current, ...menuItems].filter(
        (item): item is HTMLElement => Boolean(item),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleMenuKeyboard);
    return () => {
      window.removeEventListener("keydown", handleMenuKeyboard);
      document.body.style.overflow = previousOverflow;
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
          <Link className="px-language" href={`/${otherLocale}`} aria-label={locale === "es" ? "Cambiar a inglés" : "Switch to Spanish"}>{otherLocale.toUpperCase()}</Link>
          <Link className="px-header-cta" href="#contact">
            {navigation.exhibitor}
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <button
            type="button"
            ref={menuButton}
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

      <div
        id="px-mobile-navigation"
        ref={mobileMenu}
        className={`px-mobile-menu ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={locale === "es" ? "Menú de navegación" : "Navigation menu"}
        aria-hidden={!open}
        inert={open ? undefined : true}
      >
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
