import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first/oman-2026`;
const OG_IMAGE = `${BASE_URL}/og-default.png`;

export const metadata: Metadata = {
  title: "Cyber First Oman 2026 | Cybersecurity Summit Muscat, October",
  description:
    "Oman's premier cybersecurity summit bringing together CISOs, regulators, and security leaders. 13 October 2026, Muscat.",
  keywords: [
    "cybersecurity conference Oman 2026",
    "CISO summit Muscat",
    "cyber security event Oman",
    "Cyber First Oman",
    "cybersecurity summit Muscat",
    "information security Oman",
    "enterprise security Oman",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Cyber First Oman 2026, Muscat",
    description: "Oman's premier cybersecurity summit. 13 October 2026, Muscat.",
    url: PAGE_URL, siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Cyber First Oman 2026" }],
    locale: "en_US", type: "website",
  },
  twitter: { card: "summary_large_image", title: "Cyber First Oman 2026, Muscat", description: "Oman's premier cybersecurity summit. 13 October 2026, Muscat.", images: [OG_IMAGE] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: BASE_URL }, { name: "Events", url: `${BASE_URL}/events` }, { name: "Cyber First", url: `${BASE_URL}/events/cyber-first` }, { name: "Oman 2026", url: PAGE_URL }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: "Cyber First Oman 2026", description: "Oman's premier cybersecurity summit bringing together CISOs, regulators, and security leaders.", startDate: "2026-10-13T09:00:00+04:00", eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: "Muscat", address: { "@type": "PostalAddress", addressLocality: "Muscat", addressCountry: "OM" } }, organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL }, offers: { "@type": "Offer", url: PAGE_URL, availability: "https://schema.org/PreOrder" } }) }} />
      {children}
    </>
  );
}
