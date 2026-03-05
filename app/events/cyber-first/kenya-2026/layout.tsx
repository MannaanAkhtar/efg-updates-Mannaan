import type { Metadata } from "next";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first/kenya-2026`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0030.JPG";

export const metadata: Metadata = {
  title: "Cyber First Kenya 2026 | Strategic Cyber Defense Summit — June 2026, Nairobi",
  description:
    "Kenya's premier cybersecurity leadership summit. Beyond Firewalls - Strategic Cyber Defense for Kenya's Digital Age. CISOs, government cyber leaders, and security innovators gather in June 2026 in Nairobi. Register or sponsor now.",
  keywords: [
    "cybersecurity conference Kenya 2026",
    "CISO summit Kenya",
    "cyber security event Nairobi",
    "cybersecurity summit Africa",
    "information security conference Kenya",
    "Cyber First Kenya",
    "cybersecurity event June 2026",
    "enterprise security summit East Africa",
    "Kenya cybersecurity leaders",
    "Silicon Savannah cybersecurity",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Cyber First Kenya 2026 — Strategic Cyber Defense Summit",
    description:
      "Beyond Firewalls - Strategic Cyber Defense for Kenya's Digital Age. June 2026, Nairobi. The definitive cybersecurity summit for East Africa.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Cyber First Kenya 2026 — Cybersecurity Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber First Kenya 2026 — Strategic Cyber Defense Summit",
    description:
      "Beyond Firewalls - Strategic Cyber Defense for Kenya's Digital Age. June 2026, Nairobi.",
    images: [OG_IMAGE],
  },
};

export default function CyberFirstKenyaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Event structured data — JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Cyber First Kenya 2026 — Strategic Cyber Defense Summit",
            description:
              "Kenya's premier cybersecurity leadership summit bringing together CISOs, government cyber leaders, and security innovators across East Africa. Beyond Firewalls - Strategic Cyber Defense for Kenya's Digital Age.",
            startDate: "2026-06-15T08:00:00+03:00",
            endDate: "2026-06-15T18:00:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Nairobi, Kenya",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nairobi",
                addressCountry: "KE",
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
              "cybersecurity, CISO, information security, Kenya, East Africa, cyber summit, Silicon Savannah",
          }),
        }}
      />
      {children}
    </>
  );
}
