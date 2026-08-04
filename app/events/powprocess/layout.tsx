import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { BreadcrumbSchema } from "@/lib/schemas";

// Display — Montserrat carries the industrial weight in the headlines
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

// Body / UI / numbers — Inter, the closest widely-available match to SF Pro
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
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
