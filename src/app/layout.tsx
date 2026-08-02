import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://panaexim.example";

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
    icon: "/media/logos/panaexim-emblem.png",
    apple: "/media/logos/panaexim-emblem.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
