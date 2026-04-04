import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/opex-first/saudi-2026`;
const OG_IMAGE = `${BASE_URL}/og-default.png`;

export const metadata: Metadata = {
  title: "OPEX First Saudi 2026 | Operational Excellence Summit Riyadh, September",
  description:
    "Process transformation, automation, and the frameworks driving efficiency at scale across Saudi Arabia. 15 September 2026, Riyadh.",
  keywords: [
    "operational excellence summit Saudi 2026",
    "OPEX conference Riyadh",
    "process transformation Saudi Arabia",
    "OPEX First Saudi",
    "automation summit Riyadh",
    "business efficiency conference KSA",
    "digital operations Saudi",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OPEX First Saudi 2026, Riyadh",
    description: "Operational excellence summit. 15 September 2026, Riyadh.",
    url: PAGE_URL, siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "OPEX First Saudi 2026" }],
    locale: "en_US", type: "website",
  },
  twitter: { card: "summary_large_image", site: "@eventsfirstgrp", title: "OPEX First Saudi 2026, Riyadh", description: "Operational excellence summit. 15 September 2026, Riyadh.", images: [OG_IMAGE] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: BASE_URL }, { name: "Events", url: `${BASE_URL}/events` }, { name: "OPEX First", url: `${BASE_URL}/events/opex-first` }, { name: "Saudi 2026", url: PAGE_URL }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: "OPEX First Saudi 2026", description: "Process transformation, automation, and the frameworks driving efficiency at scale across Saudi Arabia.", startDate: "2026-09-15T09:00:00+03:00", eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: "Riyadh", address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" } }, organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL }, offers: { "@type": "Offer", url: PAGE_URL, availability: "https://schema.org/PreOrder" } }) }} />
      {children}
    </>
  );
}
