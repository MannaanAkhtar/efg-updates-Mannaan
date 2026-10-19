import type { Metadata } from "next";
import { Source_Serif_4, Source_Sans_3, Source_Code_Pro } from "next/font/google";

// TRPGLOBAL's own type: techriskpartners.com sets Source Serif 4 for display
// and Source Sans 3 for text. Source Code Pro (same superfamily) carries times
// and small labels.
const serif = Source_Serif_4({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-trp-serif",
  display: "swap",
});
const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-trp-sans",
  display: "swap",
});
const code = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-trp-mono",
  display: "swap",
});

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/trpglobal`;
const OG_IMAGE = "https://images.unsplash.com/photo-1462396240927-52058a6a84ec?auto=format&fit=crop&w=1200&h=630&q=80";
const TITLE = "AI-Powered Risk Command Center for Oracle Fusion";
const DESCRIPTION =
  "An executive roundtable hosted by TRPGLOBAL. Turn risk signals into decisive action: detect exposure before it escalates, prevent control failures before they materialize, and give leadership confidence that the business is in control. 26 November 2026, 10:00 AM – 12:30 PM (Dubai time).";

export const metadata: Metadata = {
  title: `${TITLE} | TRPGLOBAL Executive Roundtable`,
  description: DESCRIPTION,
  keywords: [
    "TRPGLOBAL",
    "Oracle Fusion Cloud Risk Management",
    "AI-powered risk management",
    "segregation of duties",
    "joiner mover leaver governance",
    "audit readiness",
    "GRC executive roundtable",
    "risk and compliance Dubai",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `${TITLE} — TRPGLOBAL Executive Roundtable`,
    description: "Detect. Prevent. Control. Assure. 26 November 2026 · 10:00 AM – 12:30 PM (Dubai time) · Oracle office, Dubai Internet City.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${TITLE} — TRPGLOBAL Executive Roundtable, 26 November 2026` }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: `${TITLE} — TRPGLOBAL Executive Roundtable`,
    description: "Detect. Prevent. Control. Assure. 26 November 2026 · 10:00 AM – 12:30 PM (Dubai time) · Oracle office, Dubai Internet City.",
    images: [OG_IMAGE],
  },
};

export default function TrpGlobalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${serif.variable} ${sans.variable} ${code.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: `${TITLE} — TRPGLOBAL Executive Roundtable`,
            description: DESCRIPTION,
            startDate: "2026-11-26T10:00:00+04:00",
            endDate: "2026-11-26T12:30:00+04:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Oracle office, Dubai Internet City",
              address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
            },
            image: [OG_IMAGE],
            organizer: { "@type": "Organization", name: "TRPGLOBAL", url: "https://www.techriskpartners.com/" },
            url: PAGE_URL,
          }),
        }}
      />
      {children}
    </div>
  );
}
