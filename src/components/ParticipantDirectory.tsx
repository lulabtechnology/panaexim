/* eslint-disable @next/next/no-img-element */
"use client";

import {
  BadgeCheck,
  Building2,
  ExternalLink,
  Globe2,
  MapPin,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/content";
import type { ParticipantEventSlug, ParticipantView } from "@/lib/participants";

const eventNames: Record<ParticipantEventSlug, string> = {
  jewellery: "Panama Jewellery Show",
  cosmetica: "PanaCosmetica",
  defensa: "PanaDefensa International",
  energy: "PanaEnergy",
};

type ParticipantDirectoryProps = {
  locale: Locale;
  participants: ParticipantView[];
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ParticipantDirectory({
  locale,
  participants,
}: ParticipantDirectoryProps) {
  const spanish = locale === "es";
  const [query, setQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const countries = useMemo(
    () => [...new Set(participants.map((participant) => participant.country).filter(Boolean))].sort(),
    [participants],
  );
  const categories = useMemo(
    () => [...new Set(participants.map((participant) => participant.category).filter(Boolean))].sort(),
    [participants],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);
    return participants.filter((participant) => {
      const description = spanish
        ? participant.description_es
        : participant.description_en;
      const haystack = [
        participant.name,
        participant.country,
        participant.category,
        participant.stand,
        description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase(locale);

      return (
        (!normalizedQuery || haystack.includes(normalizedQuery)) &&
        (eventFilter === "all" || participant.event_slug === eventFilter) &&
        (countryFilter === "all" || participant.country === countryFilter) &&
        (categoryFilter === "all" || participant.category === categoryFilter)
      );
    });
  }, [categoryFilter, countryFilter, eventFilter, locale, participants, query, spanish]);

  return (
    <div className="participant-directory">
      <div className="directory-toolbar">
        <label className="directory-search">
          <span className="sr-only">
            {spanish ? "Buscar participantes" : "Search participants"}
          </span>
          <Search aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={spanish ? "Buscar empresa, país o categoría" : "Search company, country or category"}
          />
        </label>

        <label>
          <span>{spanish ? "Evento" : "Event"}</span>
          <select value={eventFilter} onChange={(event) => setEventFilter(event.target.value)}>
            <option value="all">{spanish ? "Todos" : "All"}</option>
            {Object.entries(eventNames).map(([slug, name]) => (
              <option key={slug} value={slug}>{name}</option>
            ))}
          </select>
        </label>

        <label>
          <span>{spanish ? "País" : "Country"}</span>
          <select value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)}>
            <option value="all">{spanish ? "Todos" : "All"}</option>
            {countries.map((country) => <option key={country}>{country}</option>)}
          </select>
        </label>

        <label>
          <span>{spanish ? "Categoría" : "Category"}</span>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">{spanish ? "Todas" : "All"}</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
      </div>

      <div className="directory-summary" aria-live="polite">
        <BadgeCheck aria-hidden="true" />
        <span>
          {spanish
            ? `${filtered.length} participante${filtered.length === 1 ? "" : "s"} visible${filtered.length === 1 ? "" : "s"}`
            : `${filtered.length} participant${filtered.length === 1 ? "" : "s"} shown`}
        </span>
      </div>

      {filtered.length ? (
        <div className="participant-card-grid">
          {filtered.map((participant) => {
            const description = spanish
              ? participant.description_es
              : participant.description_en;
            return (
              <article className="participant-card" key={participant.id}>
                {participant.is_featured ? (
                  <span className="featured-badge">
                    {spanish ? "Destacado" : "Featured"}
                  </span>
                ) : null}
                <div className="participant-logo-frame">
                  {participant.logo_url ? (
                    // Signed Storage URLs expire and are intentionally rendered without Next image caching.
                    <img
                      src={participant.logo_url}
                      alt={participant.logo_alt || participant.name}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span>{initials(participant.name)}</span>
                  )}
                </div>
                <div className="participant-card-copy">
                  <small>{eventNames[participant.event_slug]}</small>
                  <h2>{participant.name}</h2>
                  <div className="participant-meta">
                    <span><Globe2 aria-hidden="true" />{participant.country}</span>
                    <span><Building2 aria-hidden="true" />{participant.category}</span>
                    {participant.stand ? (
                      <span><MapPin aria-hidden="true" />{spanish ? "Stand" : "Booth"} {participant.stand}</span>
                    ) : null}
                  </div>
                  {description ? <p>{description}</p> : null}
                  {participant.website ? (
                    <a href={participant.website} target="_blank" rel="noreferrer">
                      {spanish ? "Visitar sitio web" : "Visit website"}
                      <ExternalLink aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="directory-empty">
          <Search aria-hidden="true" />
          <h2>{spanish ? "No hay resultados" : "No results found"}</h2>
          <p>
            {spanish
              ? "Prueba otra búsqueda o cambia los filtros seleccionados."
              : "Try another search or change the selected filters."}
          </p>
        </div>
      )}
    </div>
  );
}
