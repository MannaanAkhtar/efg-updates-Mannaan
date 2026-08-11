import type { Metadata } from "next";
import localFont from "next/font/local";
import { BreadcrumbSchema } from "@/lib/schemas";

// Display — Montserrat carries the industrial weight in the headlines
const montserrat = localFont({
  variable: "--font-montserrat",
  display: "swap",
  src: [{ path: "../../fonts/montserrat/montserrat.woff2", weight: "300 900", style: "normal" }],
});

// Body / UI / numbers — Inter, the closest widely-available match to SF Pro
const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [{ path: "../../fonts/inter/inter.woff2", weight: "400 600", style: "normal" }],
});

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/powprocess`;
const FAVICON = "/powprocess-favicon.png";
// Social share preview image intentionally omitted for now — a branded
// PowProcess OG card (1200×630) will be added to openGraph/twitter later.

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "PowProcess | Powder & Bulk Solids Arabia, Riyadh",
  description:
    "The Middle East's only dedicated summit and exhibition for powder, particle and bulk-solids processing. One day, five sectors, Riyadh, Saudi Arabia.",
  keywords: [
    "powder processing Saudi Arabia",
    "bulk solids handling",
    "PowProcess Riyadh",
    "powder and bulk solids exhibition Gulf",
    "process technology summit Saudi Arabia",
    "mixing milling drying granulation conveying",
    "industrial localisation Vision 2030",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  icons: {
    icon: [{ url: FAVICON, type: "image/png" }],
    shortcut: FAVICON,
    apple: FAVICON,
  },
  openGraph: {
    title: "PowProcess — Powder & Bulk Solids Arabia, Riyadh",
    description:
      "Processing the Kingdom's Materials. The Middle East's only cross-sector summit and exhibition for powder and bulk-solids processing technology.",
    url: PAGE_URL,
    siteName: "Events First Group",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@eventsfirstgrp",
    title: "PowProcess — Powder & Bulk Solids Arabia, Riyadh",
    description:
      "The Middle East's only cross-sector summit and exhibition for powder and bulk-solids processing technology.",
  },
};

export default function PowProcessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Events", url: `${BASE_URL}/events` },
          { name: "PowProcess", url: PAGE_URL },
        ]}
      />
      <div className={`${montserrat.variable} ${inter.variable}`}>{children}</div>
    </>
  );
}
