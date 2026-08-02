import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { LocaleDocument } from "@/components/LocaleDocument";
import { isLocale } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#050608",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "PanaEXIM 2026",
    images: [{ url: "/media/phase8/hero/panaexim-og.webp", width: 1600, height: 900, alt: "PanaEXIM 2026" }],
  },
  twitter: { card: "summary_large_image", images: ["/media/phase8/hero/panaexim-og.webp"] },
  icons: {
    icon: [
      { url: "/media/logos/panaexim-icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/media/logos/panaexim-icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/media/logos/panaexim-icon-192.png",
  },
};

type LocaleLayoutProps = Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <LocaleDocument locale={locale} />
      {children}
    </>
  );
}
