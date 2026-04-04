import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first/ksa-2026`;
const OG_IMAGE = `${BASE_URL}/og-default.png`;

export const metadata: Metadata = {
  title: "Digital Resilience KSA 2026 | Cybersecurity Summit Riyadh, October",
  description:
    "Saudi Arabia's premier digital resilience summit, national strategy, threat intelligence, and enterprise continuity. 10 October 2026, Riyadh.",
  keywords: [
    "digital resilience Saudi Arabia 2026",
    "cybersecurity summit Riyadh",
    "CISO summit KSA",
    "cyber security event Saudi",
    "Digital Resilience KSA",
    "enterprise security Saudi Arabia",
    "threat intelligence Riyadh",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Digital Resilience KSA 2026, Riyadh",
    description: "Saudi Arabia's premier digital resilience summit. 10 October 2026, Riyadh.",
    url: PAGE_URL, siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Digital Resilience KSA 2026" }],
    locale: "en_US", type: "website",
  },
  twitter: { card: "summary_large_image", site: "@eventsfirstgrp", title: "Digital Resilience KSA 2026, Riyadh", description: "Saudi Arabia's premier digital resilience summit. 10 October 2026, Riyadh.", images: [OG_IMAGE] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: BASE_URL }, { name: "Events", url: `${BASE_URL}/events` }, { name: "Cyber First", url: `${BASE_URL}/events/cyber-first` }, { name: "KSA 2026", url: PAGE_URL }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: "Digital Resilience KSA 2026", description: "Saudi Arabia's premier digital resilience summit, national strategy, threat intelligence, and enterprise continuity.", startDate: "2026-10-10T09:00:00+03:00", eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: "Riyadh", address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" } }, organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL }, offers: { "@type": "Offer", url: PAGE_URL, availability: "https://schema.org/PreOrder" } }) }} />
      {children}
    </>
  );
}
