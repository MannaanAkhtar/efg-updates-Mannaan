import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/autodesk`;
// TODO: replace with the designed 1200x630 share card once Autodesk artwork
// is finalised.
const OG_IMAGE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg";

export const metadata: Metadata = {
  title:
    "Building with Confidence: Data-Led Resilience and Delivery Certainty | Autodesk Executive Roundtable",
  description:
    "Invitation-only executive roundtable with Autodesk. How connected data can help leaders improve confidence, protect margins, increase execution discipline and deliver projects with greater predictability.",
  keywords: [
    "Autodesk",
    "AECO",
    "connected data",
    "construction",
    "engineering",
    "architecture",
    "supply chain disruption",
    "executive roundtable",
    "delivery certainty",
    "business resiliency",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title:
      "Building with Confidence: Data-Led Resilience and Delivery Certainty",
    description:
      "Invitation-only executive roundtable with Autodesk on AECO resilience and delivery certainty.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Autodesk Executive Roundtable: Building with Confidence",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title:
      "Building with Confidence: Data-Led Resilience and Delivery Certainty",
    description: "Invitation-only executive roundtable with Autodesk.",
    images: [OG_IMAGE],
  },
};

// Confirmed: Tuesday, 30 June 2026, Marriott Palm Jumeirah, Dubai (GST/UTC+4).
const EVENT_START_ISO = "2026-06-30T10:30:00+04:00";
const EVENT_END_ISO = "2026-06-30T13:30:00+04:00";

export default function AutodeskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Building with Confidence: Data-Led Resilience and Delivery Certainty — Autodesk Executive Roundtable",
            description:
              "Invitation-only Autodesk executive roundtable for AECO leaders on navigating disruption, supply-chain risk, and delivery certainty through connected data.",
            startDate: EVENT_START_ISO,
            endDate: EVENT_END_ISO,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Marriott, Palm Jumeirah",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dubai",
                addressCountry: "AE",
              },
            },
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
            },
            sponsor: {
              "@type": "Organization",
              name: "Autodesk",
              url: "https://www.autodesk.com/ae",
            },
            offers: {
              "@type": "Offer",
              url: PAGE_URL,
              availability: "https://schema.org/InStock",
              price: "0",
              priceCurrency: "USD",
              validFrom: "2026-01-01",
            },
            audience: {
              "@type": "BusinessAudience",
              name: "Architecture, engineering, construction and operations (AECO) executives — heads of industry, project leaders, data and digital transformation leaders",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
