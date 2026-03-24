import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first/india-2026`;
const OG_IMAGE = `${BASE_URL}/Cyber_India.png`;

export const metadata: Metadata = {
  title: "Cyber First India 2026 | Delhi | Cybersecurity Summit — 16 June",
  description:
    "Cyber Resilience for India's Digital Future. India's premier cybersecurity summit bringing together 350+ CISOs, government cyber leaders, and enterprise security executives. 16 June 2026, Delhi.",
  keywords: [
    "cybersecurity conference India 2026",
    "CISO summit India",
    "cyber security event Delhi",
    "cybersecurity summit India",
    "information security conference Delhi",
    "Cyber First India",
    "cybersecurity event June 2026",
    "enterprise security summit India",
    "India cybersecurity leaders",
    "digital India security",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Cyber First India 2026 — Delhi Edition",
    description:
      "350+ CISOs and security leaders. 16 June 2026, Delhi. Cyber Resilience for India's Digital Future.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Cyber First India 2026 — Cybersecurity Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber First India 2026 — Delhi Edition",
    description:
      "350+ CISOs and security leaders. 16 June 2026, Delhi.",
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg", type: "image/svg+xml" },
    ],
  },
};

export default function CyberFirstIndiaLayout({
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
          { name: "Cyber First", url: `${BASE_URL}/events/cyber-first` },
          { name: "India 2026", url: PAGE_URL },
        ]}
      />
      {/* Event structured data — JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Cyber First India 2026 — Delhi Edition",
            description:
              "India's premier cybersecurity leadership summit bringing together CISOs, government cyber leaders, and enterprise security executives. Cyber Resilience for India's Digital Future.",
            startDate: "2026-06-16T08:30:00+05:30",
            endDate: "2026-06-16T18:00:00+05:30",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Delhi NCR",
              address: {
                "@type": "PostalAddress",
                addressLocality: "New Delhi",
                addressRegion: "Delhi",
                addressCountry: "IN",
              },
            },
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
            },
            offers: {
              "@type": "Offer",
              url: PAGE_URL,
              availability: "https://schema.org/InStock",
              validFrom: "2025-01-01",
            },
            typicalAgeRange: "25-",
            keywords:
              "cybersecurity, CISO, information security, India, Delhi, cyber summit, enterprise security, digital India",
          }),
        }}
      />
      {children}
    </>
  );
}
