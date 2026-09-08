"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  LocateFixed,
  MapPinned,
  MessageCircle,
  Minus,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  boothLayout,
  getDefaultBoothStatuses,
  normalizeBoothCode,
  type BoothAvailability,
} from "@/lib/booths";
import type { Locale } from "@/lib/content";

type BoothSelectionSectionProps = {
  locale: Locale;
};

type StatusFilter = "all" | BoothAvailability;
type MobileView = "map" | "available";

// The source floor plan is 840 x 1000. At browser zoom 100% the previous
// 1:1 rendering was taller than the desktop viewport (850px), which hid the
// south row 119-125 behind an internal scroll. Keep the UI zoom at 100% while
// rendering the base plan at 85% so the complete Canal 1 plan is visible.
const MAP_BASE_SCALE = 0.85;

type BoothApiResponse = {
  booths?: Array<{ code?: unknown; status?: unknown }>;
};

const contacts = [
  { labelEs: "Contacto Panamá", labelEn: "Panama contact", display: "+507 6270-6323", number: "50762706323" },
  { labelEs: "Coordinación", labelEn: "Coordination", display: "+507 6992-0333", number: "50769920333" },
] as const;

const copy = {
  es: {
    eyebrow: "PanaEXIM 2026 · Panama Convention Center",
    title: "Elige tu stand en Canal 1.",
    body: "Recorre el plano real de Canal 1, identifica espacios disponibles y consulta directamente con nuestro equipo. La disponibilidad se actualiza desde el panel de PanaEXIM.",
    live: "Disponibilidad de stands",
    total: "stands",
    available: "Disponibles",
    occupied: "Ocupados",
    all: "Todos",
    map: "Plano",
    list: "Disponibles",
    choose: "Selecciona un stand",
    chooseBody: "Toca cualquier stand para conocer su estado. Si está disponible, puedes consultarlo de inmediato por WhatsApp.",
    booth: "Stand",
    availableLabel: "Disponible",
    occupiedLabel: "Ocupado",
    availableBody: "Este stand aparece disponible. Escríbenos para confirmar precio, condiciones y reserva.",
    occupiedBody: "Este stand ya figura como ocupado. Explora los espacios verdes para encontrar otra ubicación.",
    contact: "Consultar este stand",
    contactPrefix: "Escribir a",
    search: "Buscar stand, ej. 85",
    empty: "No encontramos un stand con ese número.",
    tables: "MESAS",
    entrance: "ENTRADA",
    hall: "CANAL 1",
    hallSub: "PANAMA CONVENTION CENTER",
    zoomIn: "Acercar plano",
    zoomOut: "Alejar plano",
    center: "Centrar plano",
    hint: "Arrastra el plano para recorrer Canal 1 · toca un stand para seleccionarlo",
    privacy: "El mapa público muestra únicamente disponibilidad. No publica nombres de expositores.",
    zoneWest: "Oeste · 1–43",
    zoneCenter: "Centro · 44–74",
    zoneEast: "Este · 75–118",
    zoneSouth: "Frente · 119–125",
    selected: "Stand seleccionado",
    close: "Cerrar",
    cinemaHint: "Toca y desplaza el plano como un selector de asientos",
  },
  en: {
    eyebrow: "PanaEXIM 2026 · Panama Convention Center",
    title: "Choose your booth in Canal 1.",
    body: "Explore the real Canal 1 floor plan, identify available spaces and contact our team directly. Availability is updated from the PanaEXIM control panel.",
    live: "Booth availability",
    total: "booths",
    available: "Available",
    occupied: "Occupied",
    all: "All",
    map: "Floor plan",
    list: "Available",
    choose: "Select a booth",
    chooseBody: "Tap any booth to check its status. If it is available, you can ask about it instantly on WhatsApp.",
    booth: "Booth",
    availableLabel: "Available",
    occupiedLabel: "Occupied",
    availableBody: "This booth is currently available. Message us to confirm pricing, terms and reservation.",
    occupiedBody: "This booth is currently occupied. Explore the green spaces to find another location.",
    contact: "Ask about this booth",
    contactPrefix: "Message",
    search: "Search booth, e.g. 85",
    empty: "We could not find a booth with that number.",
    tables: "TABLES",
    entrance: "ENTRANCE",
    hall: "CANAL 1",
    hallSub: "PANAMA CONVENTION CENTER",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    center: "Center floor plan",
    hint: "Drag the floor plan to explore Canal 1 · tap a booth to select it",
    privacy: "The public map only displays availability. Exhibitor names are never published here.",
    zoneWest: "West · 1–43",
    zoneCenter: "Center · 44–74",
    zoneEast: "East · 75–118",
    zoneSouth: "Front · 119–125",
    selected: "Selected booth",
    close: "Close",
    cinemaHint: "Tap and pan the plan like a cinema seat selector",
  },
} as const;

function statusLabel(status: BoothAvailability, locale: Locale) {
  if (locale === "es") return status === "available" ? "Disponible" : "Ocupado";
  return status === "available" ? "Available" : "Occupied";
}

export function BoothSelectionSection({ locale }: BoothSelectionSectionProps) {
  const t = copy[locale];
  const viewportRef = useRef<HTMLDivElement>(null);
  const [statusMap, setStatusMap] = useState<Record<string, BoothAvailability>>(() =>
    Object.fromEntries(getDefaultBoothStatuses().map((booth) => [booth.code, booth.status])),
  );
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>("map");
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState("");
  const [searchMiss, setSearchMiss] = useState(false);

  useEffect(() => {
    let active = true;

    async function refreshAvailability() {
      try {
        const response = await fetch("/api/booths", { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as BoothApiResponse;
        if (!active || !Array.isArray(body.booths)) return;

        setStatusMap((current) => {
          const next = { ...current };
          for (const booth of body.booths ?? []) {
            if (
              typeof booth.code === "string" &&
              (booth.status === "available" || booth.status === "occupied")
            ) {
              next[normalizeBoothCode(booth.code)] = booth.status;
            }
          }
          return next;
        });
      } catch {
        // Static fallback remains usable if the live database is temporarily unavailable.
      }
    }

    void refreshAvailability();
    const interval = window.setInterval(refreshAvailability, 60_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const totals = useMemo(() => {
    let available = 0;
    let occupied = 0;
    for (const booth of boothLayout) {
      if (statusMap[booth.code] === "occupied") occupied += 1;
      else available += 1;
    }
    return { available, occupied, total: boothLayout.length };
  }, [statusMap]);

  const availableBooths = useMemo(
    () => boothLayout.filter((booth) => statusMap[booth.code] !== "occupied"),
    [statusMap],
  );

  const selectedStatus = selectedCode ? statusMap[selectedCode] ?? "available" : null;

  function centerBooth(code: string) {
    const viewport = viewportRef.current;
    const target = viewport?.querySelector<HTMLElement>(`[data-booth-code="${code}"]`);
    if (!viewport || !target) return;

    viewport.scrollTo({
      left: Math.max(0, target.offsetLeft - viewport.clientWidth / 2 + target.offsetWidth / 2),
      top: Math.max(0, target.offsetTop - viewport.clientHeight / 2 + target.offsetHeight / 2),
      behavior: "smooth",
    });
  }

  function centerZone(code: string) {
    setMobileView("map");
    window.requestAnimationFrame(() => centerBooth(code));
  }

  function chooseBooth(code: string) {
    setSelectedCode(code);
    setSearchMiss(false);
    setMobileView("map");
    window.requestAnimationFrame(() => centerBooth(code));
  }

  function submitSearch() {
    const normalized = normalizeBoothCode(search.replace(/\s+/g, ""));
    const item = boothLayout.find((booth) => booth.code === normalized);
    if (!item) {
      setSearchMiss(true);
      return;
    }
    setSearchMiss(false);
    chooseBooth(item.code);
  }

  function whatsappUrl(number: string, code: string) {
    const message = locale === "es"
      ? `Hola, estoy interesado en el stand ${code} de PanaEXIM 2026 en Canal 1 del Panama Convention Center. ¿Podrían enviarme información sobre disponibilidad, precio y condiciones de reserva?`
      : `Hello, I am interested in booth ${code} for PanaEXIM 2026 in Canal 1 at the Panama Convention Center. Could you please send me availability, pricing and reservation details?`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  const renderedScale = MAP_BASE_SCALE * zoom;
  const mapStyle: CSSProperties = {
    width: `${Math.round(840 * renderedScale)}px`,
    minWidth: `${Math.round(840 * renderedScale)}px`,
    height: `${Math.round(1000 * renderedScale)}px`,
  };

  const zoneButtons = [
    { label: t.zoneWest, code: "24" },
    { label: t.zoneCenter, code: "50" },
    { label: t.zoneEast, code: "81" },
    { label: t.zoneSouth, code: "122" },
  ];

  return (
    <section id="stands" className="booth-section section">
      <div className="booth-section-orbit booth-section-orbit-one" aria-hidden="true" />
      <div className="booth-section-orbit booth-section-orbit-two" aria-hidden="true" />

      <div className="container-wide booth-section-inner">
        <header className="booth-section-header">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="section-title">{t.title}</h2>
          </div>
          <p className="booth-section-intro">{t.body}</p>
        </header>

        <div className="booth-status-bar" aria-label={t.live}>
          <div className="booth-status-title">
            <span className="booth-live-dot" aria-hidden="true" />
            <strong>{t.live}</strong>
            <small>{totals.total} {t.total}</small>
          </div>
          <div className="booth-status-numbers">
            <span className="is-available"><CheckCircle2 aria-hidden="true" />{totals.available} {t.available}</span>
            <span className="is-occupied"><CircleDot aria-hidden="true" />{totals.occupied} {t.occupied}</span>
          </div>
        </div>

        <div className="booth-mobile-tabs" role="tablist" aria-label={t.live}>
          <button type="button" className={mobileView === "map" ? "is-active" : ""} onClick={() => setMobileView("map")}>{t.map}</button>
          <button type="button" className={mobileView === "available" ? "is-active" : ""} onClick={() => setMobileView("available")}>{t.list} <span>{totals.available}</span></button>
        </div>

        <div className="booth-mobile-search">
          <Search aria-hidden="true" />
          <input
            value={search}
            inputMode="numeric"
            onChange={(event) => { setSearch(event.target.value); setSearchMiss(false); }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitSearch();
              }
            }}
            placeholder={t.search}
            aria-label={t.search}
          />
          <button type="button" onClick={submitSearch} aria-label={t.search}><ArrowUpRight aria-hidden="true" /></button>
        </div>
        {searchMiss ? <p className="booth-search-miss">{t.empty}</p> : null}

        <div className="booth-zone-nav" aria-label={t.hall}>
          {zoneButtons.map((zone) => (
            <button key={zone.code} type="button" onClick={() => centerZone(zone.code)}>{zone.label}</button>
          ))}
        </div>

        <div className={`booth-experience ${mobileView === "available" ? "show-available-list" : "show-map"}`}>
          <div className="booth-map-column">
            <div className="booth-map-controls">
              <div className="booth-filter-group" role="group" aria-label={t.live}>
                {(["all", "available", "occupied"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={filter === option ? "is-active" : ""}
                    onClick={() => setFilter(option)}
                    aria-pressed={filter === option}
                  >
                    {option === "all" ? t.all : option === "available" ? t.available : t.occupied}
                  </button>
                ))}
              </div>

              <div className="booth-zoom-controls">
                <button type="button" onClick={() => setZoom((value) => Math.max(0.85, Number((value - 0.15).toFixed(2))))} aria-label={t.zoomOut}><Minus aria-hidden="true" /></button>
                <span>{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={() => setZoom((value) => Math.min(1.75, Number((value + 0.15).toFixed(2))))} aria-label={t.zoomIn}><Plus aria-hidden="true" /></button>
                <button type="button" onClick={() => centerZone("50")} aria-label={t.center}><LocateFixed aria-hidden="true" /></button>
              </div>
            </div>

            <div className="booth-map-shell">
              <div className="booth-map-mobile-topline" aria-hidden="true">
                <span>{t.hall}</span>
                <small>{t.cinemaHint}</small>
              </div>
              <div className="booth-map-ruler booth-map-ruler-top" aria-hidden="true" />
              <div className="booth-map-ruler booth-map-ruler-side" aria-hidden="true" />
              <div ref={viewportRef} className="booth-map-viewport">
                <div className="booth-map-canvas" style={mapStyle}>
                  <div className="booth-hall-title" aria-hidden="true">
                    <strong>{t.hall}</strong>
                    <span>{t.hallSub}</span>
                  </div>

                  <div className="booth-tables" aria-hidden="true">
                    <span>{t.tables}</span>
                    <div>{Array.from({ length: 12 }, (_, index) => <i key={index}>{index + 1}</i>)}</div>
                  </div>

                  <div className="booth-entrance" aria-hidden="true"><span>{t.entrance}</span></div>
                  <div className="booth-service-opening" aria-hidden="true" />
                  <div className="booth-floor-total-label" aria-hidden="true">125 {t.total.toUpperCase()}</div>
                  <div className="booth-aisle booth-aisle-horizontal" aria-hidden="true" />
                  <div className="booth-aisle booth-aisle-vertical" aria-hidden="true" />

                  {boothLayout.map((booth) => {
                    const status = statusMap[booth.code] ?? booth.defaultStatus;
                    const isSelected = selectedCode === booth.code;
                    const isDimmed = filter !== "all" && status !== filter;
                    const style = {
                      left: `${booth.x}%`,
                      top: `${booth.y}%`,
                      width: `${booth.width}%`,
                      height: `${booth.height}%`,
                    };

                    return (
                      <button
                        key={booth.code}
                        type="button"
                        data-booth-code={booth.code}
                        className={`booth-map-item is-${status}${isSelected ? " is-selected" : ""}${isDimmed ? " is-dimmed" : ""}`}
                        style={style}
                        onClick={() => chooseBooth(booth.code)}
                        aria-label={`${t.booth} ${booth.code}: ${statusLabel(status, locale)}`}
                        aria-pressed={isSelected}
                      >
                        <span>{booth.code}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="booth-map-hint"><MapPinned aria-hidden="true" />{t.hint}</p>

              <div className="booth-map-floating-legend" aria-hidden="true">
                <span><i className="available" />{t.availableLabel}</span>
                <span><i className="occupied" />{t.occupiedLabel}</span>
              </div>
            </div>
          </div>

          <aside className="booth-selection-panel" aria-live="polite">
            <div className="booth-search-box">
              <Search aria-hidden="true" />
              <input
                value={search}
                inputMode="numeric"
                onChange={(event) => { setSearch(event.target.value); setSearchMiss(false); }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    submitSearch();
                  }
                }}
                placeholder={t.search}
                aria-label={t.search}
              />
              <button type="button" onClick={submitSearch} aria-label={t.search}><ArrowUpRight aria-hidden="true" /></button>
            </div>
            {searchMiss ? <p className="booth-search-miss">{t.empty}</p> : null}

            {selectedCode && selectedStatus ? (
              <div className="booth-selected-card">
                <div className={`booth-selected-status is-${selectedStatus}`}>
                  {selectedStatus === "available" ? <CheckCircle2 aria-hidden="true" /> : <CircleDot aria-hidden="true" />}
                  {selectedStatus === "available" ? t.availableLabel : t.occupiedLabel}
                </div>
                <span className="booth-selected-kicker">{t.hall} · PanaEXIM 2026</span>
                <strong className="booth-selected-code">{selectedCode}</strong>
                <p>{selectedStatus === "available" ? t.availableBody : t.occupiedBody}</p>

                {selectedStatus === "available" ? (
                  <div className="booth-contact-actions">
                    <span><MessageCircle aria-hidden="true" />{t.contact}</span>
                    {contacts.map((contact) => (
                      <a key={contact.number} href={whatsappUrl(contact.number, selectedCode)} target="_blank" rel="noreferrer">
                        <div>
                          <small>{t.contactPrefix} {locale === "es" ? contact.labelEs : contact.labelEn}</small>
                          <strong>{contact.display}</strong>
                        </div>
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <button className="booth-find-available" type="button" onClick={() => setFilter("available")}>
                    <Sparkles aria-hidden="true" />{t.available}
                  </button>
                )}
              </div>
            ) : (
              <div className="booth-empty-selection">
                <div><Sparkles aria-hidden="true" /></div>
                <h3>{t.choose}</h3>
                <p>{t.chooseBody}</p>
              </div>
            )}

            <p className="booth-privacy-note">{t.privacy}</p>
          </aside>

          <div className="booth-available-list">
            <div className="booth-available-list-head">
              <div>
                <small>{t.hall}</small>
                <h3>{t.available}</h3>
              </div>
              <strong>{totals.available}</strong>
            </div>
            <div className="booth-available-grid">
              {availableBooths.length ? availableBooths.map((booth) => (
                <button key={booth.code} type="button" onClick={() => chooseBooth(booth.code)}>
                  <span>{booth.code}</span>
                  <small>{t.availableLabel}</small>
                  <ArrowUpRight aria-hidden="true" />
                </button>
              )) : <p>{t.empty}</p>}
            </div>
          </div>
        </div>
      </div>

      {selectedCode && selectedStatus ? (
        <aside className={`booth-mobile-selection-sheet is-${selectedStatus}`} aria-live="polite">
          <button className="booth-mobile-sheet-close" type="button" onClick={() => setSelectedCode(null)} aria-label={t.close}><X aria-hidden="true" /></button>
          <div className="booth-mobile-sheet-handle" aria-hidden="true" />
          <div className="booth-mobile-sheet-summary">
            <div>
              <small>{t.selected}</small>
              <strong>{t.booth} {selectedCode}</strong>
            </div>
            <span className={`booth-selected-status is-${selectedStatus}`}>
              {selectedStatus === "available" ? <CheckCircle2 aria-hidden="true" /> : <CircleDot aria-hidden="true" />}
              {selectedStatus === "available" ? t.availableLabel : t.occupiedLabel}
            </span>
          </div>

          {selectedStatus === "available" ? (
            <div className="booth-mobile-contact-strip">
              {contacts.map((contact) => (
                <a key={contact.number} href={whatsappUrl(contact.number, selectedCode)} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" />
                  <span>
                    <small>{locale === "es" ? contact.labelEs : contact.labelEn}</small>
                    <strong>{contact.display}</strong>
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : (
            <button className="booth-mobile-find-available" type="button" onClick={() => { setSelectedCode(null); setMobileView("available"); }}>
              <Sparkles aria-hidden="true" />{t.available}
              <ChevronDown aria-hidden="true" />
            </button>
          )}
        </aside>
      ) : null}
    </section>
  );
}
