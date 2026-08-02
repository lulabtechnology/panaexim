import type { Metadata } from "next";
import { Bodoni_Moda, IBM_Plex_Mono, Manrope } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const displayFont = Bodoni_Moda({
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

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://panaexim.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PanaEXIM 2026 — 4 Events. Infinite Opportunities.",
    template: "%s · PanaEXIM 2026",
  },
  description: "PanaEXIM 2026 reúne cuatro exposiciones internacionales del 23 al 26 de noviembre en el Panama Convention Center.",
  keywords: ["PanaEXIM 2026", "Panama Jewellery Show", "PanaCosmetica", "PanaDefensa International", "PanaEnergy", "Panama Convention Center"],
  openGraph: {
    type: "website",
    siteName: "PanaEXIM 2026",
    title: "PanaEXIM 2026 — 4 Events. Infinite Opportunities.",
    description: "Four international exhibitions converge in Panama from November 23–26, 2026.",
    images: [{ url: "/media/phase8/hero/panaexim-og.webp", width: 1600, height: 900, alt: "PanaEXIM 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PanaEXIM 2026",
    description: "4 Events. Infinite Opportunities.",
    images: ["/media/phase8/hero/panaexim-og.webp"],
  },
  icons: {
    icon: "/media/logos/panaexim-emblem.png",
    apple: "/media/logos/panaexim-icon-192.png",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-panaexim-locale") === "en" ? "en" : "es";
  return (
    <html lang={locale} className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
