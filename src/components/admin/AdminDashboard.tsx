/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Database,
  ExternalLink,
  ImagePlus,
  KeyRound,
  LoaderCircle,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/content";
import type { AdminIdentity } from "@/lib/admin-auth";
import type { ParticipantView } from "@/lib/participants";

const eventOptions = [
  ["jewellery", "Panama Jewellery Show"],
  ["cosmetica", "PanaCosmetica"],
  ["defensa", "PanaDefensa International"],
  ["energy", "PanaEnergy"],
] as const;

type AdminDashboardProps = {
  locale: Locale;
  identity: AdminIdentity;
  participants: ParticipantView[];
  supabaseConfigured: boolean;
};

function participantInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AdminDashboard({
  locale,
  identity,
  participants,
  supabaseConfigured,
}: AdminDashboardProps) {
  const spanish = locale === "es";
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selected = participants.find((participant) => participant.id === selectedId) ?? null;
  const visibleParticipants = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return participants;
    return participants.filter((participant) =>
      [participant.name, participant.country, participant.category]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [participants, query]);

  function resetNotices() {
    setMessage("");
    setError("");
  }

  async function saveParticipant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    resetNotices();
    setSaving(true);
    const formData = new FormData(formElement);
    if (selected) formData.set("id", selected.id);

    try {
      const response = await fetch("/api/admin/participants", {
        method: "POST",
        body: formData,
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? (spanish ? "No se pudo guardar." : "Unable to save."));
        return;
      }
      setMessage(spanish ? "Participante guardado correctamente." : "Participant saved successfully.");
      formElement.reset();
      setSelectedId(null);
      router.refresh();
    } catch {
      setError(spanish ? "Error de conexión." : "Connection error.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteParticipant(id: string, name: string) {
    const confirmed = window.confirm(
      spanish
        ? `¿Eliminar definitivamente a ${name}?`
        : `Permanently delete ${name}?`,
    );
    if (!confirmed) return;

    resetNotices();
    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/participants/${id}`, {
        method: "DELETE",
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? (spanish ? "No se pudo eliminar." : "Unable to delete."));
        return;
      }
      if (selectedId === id) setSelectedId(null);
      setMessage(spanish ? "Participante eliminado." : "Participant deleted.");
      router.refresh();
    } catch {
      setError(spanish ? "Error de conexión." : "Connection error.");
    } finally {
      setDeletingId(null);
    }
  }

  async function updateAccessPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    resetNotices();
    setPasswordSaving(true);
    const form = new FormData(formElement);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");

    if (password !== confirmation) {
      setError(spanish ? "Las contraseñas no coinciden." : "Passwords do not match.");
      setPasswordSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/settings/participants-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? (spanish ? "No se pudo actualizar." : "Unable to update."));
        return;
      }
      formElement.reset();
      setMessage(
        spanish
          ? "Contraseña del directorio actualizada."
          : "Directory password updated.",
      );
    } catch {
      setError(spanish ? "Error de conexión." : "Connection error.");
    } finally {
      setPasswordSaving(false);
    }
  }

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <section className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <p className="eyebrow">PanaEXIM Control Center</p>
          <h1>{spanish ? "Gestión de participantes" : "Participant management"}</h1>
          <p>{identity.displayName} · {identity.email}</p>
        </div>
        <button className="button button-ghost" type="button" onClick={logout} disabled={loggingOut}>
          {loggingOut ? <LoaderCircle className="spin" aria-hidden="true" /> : <LogOut aria-hidden="true" />}
          {spanish ? "Cerrar sesión" : "Sign out"}
        </button>
      </header>

      {!supabaseConfigured ? (
        <div className="admin-configuration-warning">
          <Database aria-hidden="true" />
          <div>
            <h2>{spanish ? "Falta completar Supabase" : "Supabase setup is incomplete"}</h2>
            <p>
              {spanish
                ? "Añade NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY y SUPABASE_SERVICE_ROLE_KEY. Después ejecuta la migración SQL incluida."
                : "Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SERVICE_ROLE_KEY, then run the included SQL migration."}
            </p>
          </div>
        </div>
      ) : null}

      <div className="admin-metrics">
        <article><strong>{participants.length}</strong><span>{spanish ? "Registros" : "Records"}</span></article>
        <article><strong>{participants.filter((item) => item.is_published).length}</strong><span>{spanish ? "Publicados" : "Published"}</span></article>
        <article><strong>{participants.filter((item) => item.is_featured).length}</strong><span>{spanish ? "Destacados" : "Featured"}</span></article>
        <article><strong>{new Set(participants.map((item) => item.country)).size}</strong><span>{spanish ? "Países" : "Countries"}</span></article>
      </div>

      {message ? <p className="admin-notice success" role="status"><ShieldCheck aria-hidden="true" />{message}</p> : null}
      {error ? <p className="admin-notice error" role="alert"><X aria-hidden="true" />{error}</p> : null}

      <div className="admin-workspace">
        <div className="admin-list-panel">
          <div className="admin-panel-heading">
            <div>
              <small>{spanish ? "Directorio" : "Directory"}</small>
              <h2>{spanish ? "Empresas registradas" : "Registered companies"}</h2>
            </div>
            <button className="button button-gold button-small" type="button" onClick={() => setSelectedId(null)}>
              <Plus aria-hidden="true" />{spanish ? "Nuevo" : "New"}
            </button>
          </div>
          <label className="admin-search">
            <Search aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={spanish ? "Buscar registros" : "Search records"}
            />
          </label>

          <div className="admin-participant-list">
            {visibleParticipants.map((participant) => (
              <article key={participant.id} className={selectedId === participant.id ? "is-selected" : ""}>
                <div className="admin-logo-thumb">
                  {participant.logo_url ? (
                    <img src={participant.logo_url} alt="" loading="lazy" />
                  ) : (
                    <span>{participantInitials(participant.name)}</span>
                  )}
                </div>
                <div className="admin-list-copy">
                  <strong>{participant.name}</strong>
                  <span>{participant.country} · {participant.category}</span>
                  <small>{participant.is_published ? (spanish ? "Publicado" : "Published") : (spanish ? "Oculto" : "Hidden")}</small>
                </div>
                <div className="admin-list-actions">
                  <button type="button" onClick={() => setSelectedId(participant.id)} aria-label={spanish ? `Editar ${participant.name}` : `Edit ${participant.name}`}>
                    <Pencil aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => deleteParticipant(participant.id, participant.name)} disabled={deletingId === participant.id} aria-label={spanish ? `Eliminar ${participant.name}` : `Delete ${participant.name}`}>
                    {deletingId === participant.id ? <LoaderCircle className="spin" aria-hidden="true" /> : <Trash2 aria-hidden="true" />}
                  </button>
                </div>
              </article>
            ))}
            {!visibleParticipants.length ? (
              <div className="admin-empty-list">{spanish ? "No hay registros para mostrar." : "No records to show."}</div>
            ) : null}
          </div>
        </div>

        <div className="admin-editor-panel">
          <div className="admin-panel-heading">
            <div>
              <small>{selected ? (spanish ? "Editar" : "Edit") : (spanish ? "Crear" : "Create")}</small>
              <h2>{selected ? selected.name : (spanish ? "Nuevo participante" : "New participant")}</h2>
            </div>
            {selected ? (
              <button type="button" className="admin-icon-button" onClick={() => setSelectedId(null)} aria-label={spanish ? "Cerrar edición" : "Close editor"}>
                <X aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <form key={selected?.id ?? "new"} className="admin-participant-form" onSubmit={saveParticipant}>
            <div className="admin-form-grid">
              <label className="admin-field-wide">
                <span>{spanish ? "Nombre de la empresa" : "Company name"}</span>
                <input name="name" required defaultValue={selected?.name ?? ""} />
              </label>
              <label>
                <span>{spanish ? "Evento" : "Event"}</span>
                <select name="event_slug" required defaultValue={selected?.event_slug ?? "jewellery"}>
                  {eventOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label>
                <span>{spanish ? "País" : "Country"}</span>
                <input name="country" required defaultValue={selected?.country ?? ""} />
              </label>
              <label>
                <span>{spanish ? "Categoría" : "Category"}</span>
                <input name="category" required defaultValue={selected?.category ?? ""} />
              </label>
              <label>
                <span>{spanish ? "Stand" : "Booth"}</span>
                <input name="stand" defaultValue={selected?.stand ?? ""} />
              </label>
              <label className="admin-field-wide">
                <span>{spanish ? "Sitio web" : "Website"}</span>
                <input name="website" type="url" placeholder="https://" defaultValue={selected?.website ?? ""} />
              </label>
              <label>
                <span>{spanish ? "Orden" : "Order"}</span>
                <input name="sort_order" type="number" min="0" max="9999" defaultValue={selected?.sort_order ?? 0} />
              </label>
              <label>
                <span>{spanish ? "Texto alternativo del logo" : "Logo alternative text"}</span>
                <input name="logo_alt" defaultValue={selected?.logo_alt ?? selected?.name ?? ""} />
              </label>
              <label className="admin-field-wide">
                <span>{spanish ? "Descripción en español" : "Spanish description"}</span>
                <textarea name="description_es" rows={3} defaultValue={selected?.description_es ?? ""} />
              </label>
              <label className="admin-field-wide">
                <span>{spanish ? "Descripción en inglés" : "English description"}</span>
                <textarea name="description_en" rows={3} defaultValue={selected?.description_en ?? ""} />
              </label>
              <label className="admin-file-field admin-field-wide">
                <span><ImagePlus aria-hidden="true" />{spanish ? "Logo PNG, JPG o WebP · máximo 4 MB" : "PNG, JPG or WebP logo · maximum 4 MB"}</span>
                <input name="logo" type="file" accept="image/png,image/jpeg,image/webp" />
                {selected?.logo_url ? (
                  <a href={selected.logo_url} target="_blank" rel="noreferrer">
                    {spanish ? "Ver logo actual" : "View current logo"}<ExternalLink aria-hidden="true" />
                  </a>
                ) : null}
              </label>
              <label className="admin-check-field">
                <input name="is_published" type="checkbox" defaultChecked={selected?.is_published ?? true} />
                <span>{spanish ? "Publicado" : "Published"}</span>
              </label>
              <label className="admin-check-field">
                <input name="is_featured" type="checkbox" defaultChecked={selected?.is_featured ?? false} />
                <span>{spanish ? "Destacado" : "Featured"}</span>
              </label>
            </div>
            <button className="button button-gold" type="submit" disabled={saving || !supabaseConfigured}>
              {saving ? <LoaderCircle className="spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
              {saving ? (spanish ? "Guardando..." : "Saving...") : (spanish ? "Guardar participante" : "Save participant")}
            </button>
          </form>
        </div>
      </div>

      <section className="admin-settings-card">
        <div>
          <p className="eyebrow">{spanish ? "Seguridad" : "Security"}</p>
          <h2>{spanish ? "Contraseña del directorio privado" : "Private directory password"}</h2>
          <p>
            {spanish
              ? "La nueva contraseña se almacena cifrada mediante scrypt. No se guarda el texto original."
              : "The new password is stored as a scrypt hash. The original text is never stored."}
          </p>
        </div>
        <form onSubmit={updateAccessPassword}>
          <label>
            <span>{spanish ? "Nueva contraseña" : "New password"}</span>
            <input name="password" type="password" minLength={10} maxLength={128} required autoComplete="new-password" />
          </label>
          <label>
            <span>{spanish ? "Confirmar contraseña" : "Confirm password"}</span>
            <input name="confirmation" type="password" minLength={10} maxLength={128} required autoComplete="new-password" />
          </label>
          <button className="button button-ghost" type="submit" disabled={passwordSaving || !supabaseConfigured}>
            {passwordSaving ? <RefreshCw className="spin" aria-hidden="true" /> : <KeyRound aria-hidden="true" />}
            {spanish ? "Actualizar contraseña" : "Update password"}
          </button>
        </form>
      </section>
    </section>
  );
}
