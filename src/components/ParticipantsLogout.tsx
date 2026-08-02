"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/content";

export function ParticipantsLogout({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/participants/logout", { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button className="button button-ghost" type="button" onClick={logout} disabled={loading}>
      <LogOut aria-hidden="true" />
      {locale === "es" ? "Cerrar sesión" : "Sign out"}
    </button>
  );
}
