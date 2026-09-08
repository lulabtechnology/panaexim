import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { getAdminIdentity } from "@/lib/admin-auth";
import { getBoothStore } from "@/lib/booth-store";
import { getDefaultBoothStatuses } from "@/lib/booths";
import { isLocale } from "@/lib/content";
import { getAdminParticipants } from "@/lib/participants";
import {
  isSupabasePublicConfigured,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale;
  const spanish = locale === "es";
  const identity = await getAdminIdentity();
  const serviceConfigured = isSupabaseServiceConfigured();
  const participants = identity && serviceConfigured ? await getAdminParticipants() : [];
  const boothStore = identity
    ? await getBoothStore()
    : { booths: getDefaultBoothStatuses(), databaseReady: false };

  return (
    <main className="admin-page">
      <div className="admin-page-bg" aria-hidden="true" />
      <div className="container admin-page-inner">
        <Link className="back-link" href={`/${locale}`}>
          <ArrowLeft aria-hidden="true" />
          {spanish ? "Volver al sitio" : "Back to website"}
        </Link>

        {identity ? (
          <AdminDashboard
            locale={locale}
            identity={identity}
            participants={participants}
            booths={boothStore.booths}
            boothsDatabaseReady={boothStore.databaseReady}
            supabaseConfigured={serviceConfigured}
          />
        ) : (
          <AdminLogin
            locale={locale}
            configured={isSupabasePublicConfigured()}
          />
        )}
      </div>
    </main>
  );
}
