"use client";

import { ArrowUpRight, CircleDot, LocateFixed, MapPinned, MessageCircle, Minus, Plus, Search, Sparkles } from "lucide-react";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import { boothLayout, getDefaultBoothStatuses, isValidBoothCode, normalizeBoothCode, type BoothAvailability } from "@/lib/booths";
import type { Locale } from "@/lib/content";

const contacts = [{ name: "Panamá", display: "+507 6270-6323", number: "50762706323" }, { name: "Coordinación", display: "+507 6992-0333", number: "50769920333" }];
const copy = {
  es: {
    title: "Elige tu stand en Megapolis.", body: "Explora la nueva distribución de 77 stands, con módulos de 3 × 3 m. Selecciona una ubicación y consulta directamente con el equipo organizador.", all: "Todos", available: "Disponibles", occupied: "Ocupados", unconfirmed: "Por confirmar", availability: "Estado de los stands", search: "Buscar stand, ej. 25", booth: "Stand", choose: "Selecciona un stand", chooseBody: "Toca un número del plano para consultar su ubicación, medidas y estado.", contact: "Consultar este stand", empty: "No encontramos ese número de stand.", dimensions: "3 × 3 m · 9 m²", privacy: "La ocupación del nuevo recinto se confirma con la organización. El plano público no muestra nombres de expositores.", hint: "Desplázate por el plano · toca un stand para seleccionarlo", zoomIn: "Acercar", zoomOut: "Alejar", center: "Centrar plano", plan: "Ver plano original", tour: "Recorrer en 3D", unknownBody: "La disponibilidad de este espacio está por confirmar. Consulta condiciones, precio y reserva con la organización.", availableBody: "Este stand está disponible. Consulta precio, condiciones y reserva.", occupiedBody: "Este stand figura como ocupado. Consulta con la organización otras ubicaciones.", zones: ["Ala diagonal", "Sector central", "Sector derecho", "Fila inferior"],
  },
  en: {
    title: "Choose your booth at Megapolis.", body: "Explore the new layout of 77 booths, each measuring 3 × 3 m. Select a location and contact the organizing team directly.", all: "All", available: "Available", occupied: "Occupied", unconfirmed: "To be confirmed", availability: "Booth status", search: "Search booth, e.g. 25", booth: "Booth", choose: "Select a booth", chooseBody: "Tap a booth number to check its location, dimensions and status.", contact: "Ask about this booth", empty: "We could not find that booth number.", dimensions: "3 × 3 m · 9 m²", privacy: "Occupancy at the new venue is confirmed by the organizers. Exhibitor names are not displayed on the public plan.", hint: "Pan the floor plan · tap a booth to select it", zoomIn: "Zoom in", zoomOut: "Zoom out", center: "Center plan", plan: "View source floor plan", tour: "Explore in 3D", unknownBody: "Availability for this space is awaiting confirmation. Ask the organizers about pricing, terms and reservations.", availableBody: "This booth is available. Ask about pricing, terms and reservations.", occupiedBody: "This booth is occupied. Contact the organizers about other locations.", zones: ["Diagonal wing", "Central sector", "Right sector", "Lower row"],
  },
} as const;

export function BoothSelectionSection({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const viewportRef = useRef<HTMLDivElement>(null);
  const [statuses] = useState<Record<string, BoothAvailability>>(() => Object.fromEntries(getDefaultBoothStatuses().map((b) => [b.code, b.status])));
  const [filter, setFilter] = useState<"all" | BoothAvailability>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [miss, setMiss] = useState(false);
  const [zoom, setZoom] = useState(1);
  const totals = useMemo(() => {
    const result = { available: 0, occupied: 0, unconfirmed: 0 };
    for (const b of boothLayout) result[statuses[b.code] ?? "unconfirmed"]++;
    return result;
  }, [statuses]);
  const status = selected ? statuses[selected] ?? "unconfirmed" : null;
  function choose(code: string) {
    setSelected(code); setMiss(false);
    window.requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      const target = viewport?.querySelector<HTMLElement>(`[data-booth-code="${code}"]`);
      if (!viewport || !target) return;
      viewport.scrollTo({ left: Math.max(0, target.offsetLeft - viewport.clientWidth / 2), top: Math.max(0, target.offsetTop - viewport.clientHeight / 2), behavior: "smooth" });
    });
  }
  function find() {
    const code = normalizeBoothCode(search);
    if (!isValidBoothCode(code)) { setMiss(true); return; }
    choose(code);
  }
  function whatsapp(number: string, code: string) {
    const text = locale === "es" ? `Hola, me interesa el stand ${code} (3 × 3 m) de PanaEXIM, del 23 al 25 de febrero de 2027 en Megapolis Convention Center. ¿Podrían confirmar disponibilidad, precio y condiciones de reserva?` : `Hello, I am interested in booth ${code} (3 × 3 m) at PanaEXIM, February 23–25, 2027, at Megapolis Convention Center. Could you confirm availability, pricing and reservation terms?`;
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }
  return (
    <section id="stands" className="booth-section section megapolis-section">
      <div className="container-wide booth-section-inner">
        <header className="booth-section-header"><div><p className="eyebrow">PanaEXIM 2027 · Megapolis Convention Center</p><h2 className="section-title">{t.title}</h2></div><p className="booth-section-intro">{t.body}</p></header>
        <div className="booth-status-bar" aria-label={t.availability}><div className="booth-status-title"><span className="booth-live-dot" /><strong>{t.availability}</strong><small>77 {locale === "es" ? "stands" : "booths"}</small></div><div className="booth-status-numbers">{(["available", "occupied", "unconfirmed"] as const).map((key) => <span className={`is-${key}`} key={key}><CircleDot />{totals[key]} {t[key]}</span>)}</div></div>
        <div className="booth-zone-nav">{["19", "30", "36", "70"].map((code, i) => <button key={code} type="button" onClick={() => choose(code)}>{t.zones[i]}</button>)}</div>
        <div className="booth-experience show-map">
          <div className="booth-map-column">
            <div className="booth-map-controls"><div className="booth-filter-group" role="group" aria-label={t.availability}>{(["all", "available", "occupied", "unconfirmed"] as const).map((key) => <button key={key} type="button" className={filter === key ? "is-active" : ""} aria-pressed={filter === key} onClick={() => setFilter(key)}>{t[key]}</button>)}</div><div className="booth-zoom-controls"><button type="button" onClick={() => setZoom((v) => Math.max(1, v - .25))} aria-label={t.zoomOut}><Minus /></button><span>{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoom((v) => Math.min(3, v + .25))} aria-label={t.zoomIn}><Plus /></button><button type="button" aria-label={t.center} onClick={() => { setZoom(1); viewportRef.current?.scrollTo({ left: 0, top: 0, behavior: "smooth" }); }}><LocateFixed /></button></div></div>
            <div className="booth-map-shell"><div className="megapolis-map-heading"><span>MEGAPOLIS CONVENTION CENTER</span><small>77 × 9 m² · 23–25 FEB 2027</small></div><div ref={viewportRef} className="booth-map-viewport megapolis-viewport"><div className="booth-map-canvas megapolis-map" style={{ "--megapolis-zoom": zoom } as CSSProperties}>{boothLayout.map((b) => {
              const current = statuses[b.code] ?? "unconfirmed";
              return <button key={b.code} type="button" data-booth-code={b.code} className={`booth-map-item is-${current}${selected === b.code ? " is-selected" : ""}${filter !== "all" && filter !== current ? " is-dimmed" : ""}`} style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.width}%`, height: `${b.height}%`, transform: `rotate(${b.rotation}deg)` }} aria-label={`${t.booth} ${b.code} · ${t.dimensions} · ${t[current]}`} aria-pressed={selected === b.code} onClick={() => choose(b.code)}><span>{b.code}</span></button>;
            })}</div></div><p className="booth-map-hint"><MapPinned />{t.hint}</p><div className="megapolis-map-links"><a href="/media/megapolis/source-plan.pdf" target="_blank" rel="noreferrer">{t.plan}<ArrowUpRight /></a><a href="https://3dmodeling.panaeximexpo.com/" target="_blank" rel="noreferrer">{t.tour}<ArrowUpRight /></a></div></div>
          </div>
          <aside className="booth-selection-panel" aria-live="polite"><form className="booth-search-box" onSubmit={(e) => { e.preventDefault(); find(); }}><Search /><input value={search} inputMode="numeric" onChange={(e) => { setSearch(e.target.value); setMiss(false); }} placeholder={t.search} aria-label={t.search} /><button type="submit" aria-label={t.search}><ArrowUpRight /></button></form>{miss && <p className="booth-search-miss">{t.empty}</p>}{selected && status ? <div className="booth-selected-card"><div className={`booth-selected-status is-${status}`}><CircleDot />{t[status]}</div><span className="booth-selected-kicker">MEGAPOLIS · PanaEXIM 2027</span><strong className="booth-selected-code">{selected}</strong><strong className="megapolis-dimensions">{t.dimensions}</strong><p>{status === "available" ? t.availableBody : status === "occupied" ? t.occupiedBody : t.unknownBody}</p><div className="booth-contact-actions"><span><MessageCircle />{t.contact}</span>{contacts.map((c) => <a key={c.number} href={whatsapp(c.number, selected)} target="_blank" rel="noreferrer"><div><small>{c.name}</small><strong>{c.display}</strong></div><ArrowUpRight /></a>)}</div></div> : <div className="booth-empty-selection"><div><Sparkles /></div><h3>{t.choose}</h3><p>{t.chooseBody}</p></div>}<p className="booth-privacy-note">{t.privacy}</p></aside>
        </div>
      </div>
    </section>
  );
}
