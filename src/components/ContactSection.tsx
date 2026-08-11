"use client";

import Link from "next/link";
import { Building2, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import type { Locale, SiteContent } from "@/lib/content";

type ContactSectionProps = {
  locale: Locale;
  contact: SiteContent["contact"];
};

const directContacts = [
  { name: "Carolina López", roleEs: "Coordinación", roleEn: "Coordination", phone: "+507 6992-0333", whatsapp: "50769920333" },
  { name: "Alm Palmer", roleEs: "CEO", roleEn: "CEO", phone: "+507 6270-6323", whatsapp: "50762706323" },
] as const;

export function ContactSection({ locale, contact }: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const spanish = locale === "es";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lines = [
      "PanaEXIM",
      "",
      `${contact.name}: ${String(form.get("name") ?? "")}`,
      `${contact.company}: ${String(form.get("company") ?? "")}`,
      `${contact.country}: ${String(form.get("country") ?? "")}`,
      `${contact.email}: ${String(form.get("email") ?? "")}`,
      `${contact.phone}: ${String(form.get("phone") ?? "")}`,
      `${contact.interest}: ${String(form.get("interest") ?? "")}`,
      "",
      String(form.get("message") ?? ""),
    ];

    const url = `https://wa.me/50762706323?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  return (
    <section className="section contact-section" id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="container contact-grid">
        <div className="contact-copy">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2 className="section-title">{contact.title}</h2>
          <p className="contact-intro">{contact.body}</p>

          <div className="contact-cards">
            <article>
              <span><Phone aria-hidden="true" /></span>
              <div>
                <h3>{contact.panama}</h3>
                <a href="tel:+50762706323">+507 6270-6323</a>
                <a href="mailto:ap@panamajewelleryshow.com">ap@panamajewelleryshow.com</a>
              </div>
            </article>

            <article>
              <span><Mail aria-hidden="true" /></span>
              <div>
                <h3>{contact.turkey}</h3>
                <a href="mailto:to@panamajewelleryshow.com">to@panamajewelleryshow.com</a>
              </div>
            </article>

            <article>
              <span><Mail aria-hidden="true" /></span>
              <div>
                <h3>{contact.accounting}</h3>
                <p>Carolina López</p>
                <a href="tel:+50769920333">+507 6992-0333</a>
                <a href="mailto:accounting@panamajewelleryshow.com">accounting@panamajewelleryshow.com</a>
              </div>
            </article>

            <article>
              <span><Building2 aria-hidden="true" /></span>
              <div>
                <h3>{contact.address}</h3>
                <p>
                  {spanish
                    ? "Panama Pacifico International Business Center, Edificio 3485, Oficina 102, Free Zone, Ciudad de Panamá, Panamá."
                    : "Panama Pacifico International Business Center, Building 3485, Office 102, Free Zone, Panama City, Panama."}
                </p>
              </div>
            </article>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-direct">
            <div className="contact-direct-copy">
              <span>{spanish ? "WhatsApp directo" : "Direct WhatsApp"}</span>
              <h3>{spanish ? "¿Prefiere escribirnos sin llenar el formulario?" : "Prefer to message us without filling out the form?"}</h3>
              <p>{spanish ? "Elija un contacto y abra WhatsApp de inmediato." : "Choose a contact and open WhatsApp immediately."}</p>
            </div>
            <div className="contact-direct-actions">
              {directContacts.map((person) => (
                <a
                  key={person.name}
                  href={`https://wa.me/${person.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-direct-link"
                >
                  <MessageCircle aria-hidden="true" />
                  <span>
                    <strong>{person.name}</strong>
                    <small>{spanish ? person.roleEs : person.roleEn} · {person.phone}</small>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-form-separator" aria-hidden="true">
            <span>{spanish ? "o complete el formulario" : "or complete the form"}</span>
          </div>

          <div className="form-heading">
            <span>01</span>
            <h3>{contact.formTitle}</h3>
          </div>

          <div className="form-grid">
            <label>
              <span>{contact.name}</span>
              <input name="name" type="text" required autoComplete="name" />
            </label>
            <label>
              <span>{contact.company}</span>
              <input name="company" type="text" required autoComplete="organization" />
            </label>
            <label>
              <span>{contact.country}</span>
              <input name="country" type="text" required autoComplete="country-name" />
            </label>
            <label>
              <span>{contact.email}</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              <span>{contact.phone}</span>
              <input name="phone" type="tel" required autoComplete="tel" />
            </label>
            <label>
              <span>{contact.interest}</span>
              <select name="interest" required defaultValue="">
                <option value="" disabled>—</option>
                {contact.interests.map((interest) => (
                  <option key={interest} value={interest}>{interest}</option>
                ))}
              </select>
            </label>
            <label className="form-message">
              <span>{contact.message}</span>
              <textarea name="message" required rows={5} />
            </label>
          </div>

          <label className="form-consent">
            <input name="privacy" type="checkbox" required />
            <span>
              {contact.privacyConsent}{" "}
              <Link href={`/${locale}/privacy`} target="_blank" rel="noreferrer">{contact.privacyLink}</Link>.
            </span>
          </label>

          <button type="submit" className="button button-gold form-submit">
            {contact.submit}
            <Send aria-hidden="true" />
          </button>

          {submitted ? (
            <p className="form-status is-visible" role="status" aria-live="polite">
              {contact.success}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
