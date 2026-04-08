import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/ot-security-first/johannesburg-2026`;
const OG_IMAGE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title:
    "OT Security First South Africa 2026 | Johannesburg — Industrial Cyber Resilience",
  description:
    "Industrial Cyber Resilience in the Era of Convergence. Africa's premier OT/ICS security summit bringing together 200+ CISOs, industrial security leaders, and critical infrastructure operators. 2026, Johannesburg.",
  keywords: [
    "OT security conference South Africa 2026",
    "industrial cybersecurity summit Johannesburg",
    "ICS security event Africa",
    "SCADA security summit South Africa",
    "critical infrastructure security Johannesburg",
    "OT Security First Africa",
    "operational technology security",
    "mining cybersecurity South Africa",
    "Eskom cybersecurity",
    "Transnet cybersecurity",
    "POPIA compliance OT",
    "industrial control systems conference Africa",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "OT Security First South Africa 2026 — Johannesburg Edition",
    description:
      "200+ industrial security leaders. Johannesburg 2026. Industrial Cyber Resilience in the Era of Convergence.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "OT Security First South Africa 2026 — Industrial Cybersecurity Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OT Security First South Africa 2026 — Johannesburg Edition",
    description:
      "200+ industrial security leaders. Johannesburg 2026 — Africa's Industrial Heartland.",
    images: [OG_IMAGE],
  },
};

export default function OTSecurityFirstJohannesburgLayout({
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
          {
            name: "OT Security First",
            url: `${BASE_URL}/events/ot-security-first`,
          },
          { name: "Johannesburg 2026", url: PAGE_URL },
        ]}
      />
      {/* Event structured data — JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "OT Security First South Africa 2026 — Johannesburg Edition",
            description:
              "Africa's premier industrial cybersecurity summit. Industrial Cyber Resilience in the Era of Convergence — bringing together CISOs, OT security leaders, and critical infrastructure operators.",
            startDate: "2026-09-01T08:30:00+02:00",
            endDate: "2026-09-01T18:00:00+02:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Johannesburg",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Johannesburg",
                addressRegion: "Gauteng",
                addressCountry: "ZA",
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
              "OT security, ICS security, industrial cybersecurity, SCADA, South Africa, Johannesburg, mining cybersecurity, critical infrastructure, Eskom, Transnet",
          }),
        }}
      />
      {children}
    </>
  );
}
