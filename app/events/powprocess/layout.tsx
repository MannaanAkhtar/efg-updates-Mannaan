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
// Social share preview (1200×630). Uses the hero image cropped to the OG spec.
// Swap for a branded PowProcess OG card when one is available.
const OG_IMAGE =
  "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&h=630&q=80";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "PowProcess | Powder & Bulk Solids Arabia, Dammam",
  description:
    "The Gulf's first dedicated summit and exhibition for powder, particle and bulk-solids processing. One day, five sectors, Dammam, Saudi Arabia.",
  keywords: [
    "powder processing Saudi Arabia",
    "bulk solids handling",
    "PowProcess Dammam",
    "powder and bulk solids exhibition Gulf",
    "process technology summit Saudi Arabia",
    "mixing milling drying granulation conveying",
    "industrial localisation Vision 2030",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "PowProcess — Powder & Bulk Solids Arabia, Dammam",
    description:
      "Processing the Kingdom's Materials. The Gulf's first cross-sector summit and exhibition for powder and bulk-solids processing technology.",
    url: PAGE_URL,
    siteName: "Events First Group",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "PowProcess — Powder & Bulk Solids Arabia, Dammam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "PowProcess — Powder & Bulk Solids Arabia, Dammam",
    description:
      "The Gulf's first cross-sector summit and exhibition for powder and bulk-solids processing technology.",
    images: [OG_IMAGE],
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
