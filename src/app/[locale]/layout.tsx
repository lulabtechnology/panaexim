import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import "../globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#07090d",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PanaEXIM 2026 — 4 Events. Infinite Opportunities.",
    template: "%s · PanaEXIM 2026",
  },
  description:
    "PanaEXIM 2026 reúne cuatro exposiciones internacionales del 23 al 26 de noviembre en el Panama Convention Center.",
  keywords: [
    "PanaEXIM 2026",
    "Panama Jewellery Show",
    "PanaCosmetica",
    "PanaDefensa International",
    "PanaEnergy",
    "Panama Convention Center",
  ],
  openGraph: {
    type: "website",
    siteName: "PanaEXIM 2026",
    title: "PanaEXIM 2026 — 4 Events. Infinite Opportunities.",
    description:
      "Four international exhibitions converge in Panama from November 23–26, 2026.",
    images: [
      {
        url: "/media/hero/panaexim-hero.webp",
        width: 1672,
        height: 941,
        alt: "PanaEXIM 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PanaEXIM 2026",
    description: "4 Events. Infinite Opportunities.",
    images: ["/media/hero/panaexim-hero.webp"],
  },
  icons: {
    icon: [
      { url: "/media/logos/panaexim-icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/media/logos/panaexim-icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/media/logos/panaexim-icon-192.png",
  },
};

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/media/hero/panaexim-hero.webp"
          media="(min-width: 701px)"
        />
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/media/hero/panaexim-hero-mobile.webp"
          media="(max-width: 700px)"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
