import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/ot-security-first/oman-2026`;
const OG_IMAGE = `${BASE_URL}/og-default.png`;

export const metadata: Metadata = {
  title: "OT Security Oman 2026 | Industrial Security Summit Muscat, October",
  description:
    "Protecting Oman's energy, utilities, and industrial sectors through IT/OT convergence. 14 October 2026, Muscat.",
  keywords: [
    "OT security summit Oman 2026",
    "industrial cybersecurity Oman",
    "critical infrastructure Muscat",
    "OT Security First Oman",
    "energy sector security Oman",
    "SCADA security Muscat",
    "IT OT convergence Oman",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OT Security Oman 2026, Muscat",
    description: "Industrial security summit. 14 October 2026, Muscat, Oman.",
    url: PAGE_URL, siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "OT Security Oman 2026" }],
    locale: "en_US", type: "website",
  },
  twitter: { card: "summary_large_image", site: "@eventsfirstgrp", title: "OT Security Oman 2026, Muscat", description: "Industrial security summit. 14 October 2026, Muscat.", images: [OG_IMAGE] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: BASE_URL }, { name: "Events", url: `${BASE_URL}/events` }, { name: "OT Security First", url: `${BASE_URL}/events/ot-security-first` }, { name: "Oman 2026", url: PAGE_URL }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: "OT Security Oman 2026", description: "Protecting Oman's energy, utilities, and industrial sectors through IT/OT convergence.", startDate: "2026-10-14T09:00:00+04:00", eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: "Muscat", address: { "@type": "PostalAddress", addressLocality: "Muscat", addressCountry: "OM" } }, organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL }, offers: { "@type": "Offer", url: PAGE_URL, availability: "https://schema.org/PreOrder" } }) }} />
      {children}
    </>
  );
}
