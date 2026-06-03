import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/autodesk`;
// TODO: replace with the designed 1200x630 share card once Autodesk artwork
// is finalised.
const OG_IMAGE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg";

export const metadata: Metadata = {
  title:
    "From Risk to Certainty: How Data-Driven Leaders Deliver with Confidence in an Uncertain Market | Events First Group × Autodesk",
  description:
    "Closed-door, invite-only executive roundtable for AECO leaders. How data-driven leaders deliver with confidence in an uncertain market. Hosted by Events First Group, sponsored by Autodesk. Final approval lies with EFG.",
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
      "From Risk to Certainty: How Data-Driven Leaders Deliver with Confidence in an Uncertain Market",
    description:
      "Closed-door, invite-only AECO executive roundtable. Hosted by Events First Group, sponsored by Autodesk.",
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
      "From Risk to Certainty: How Data-Driven Leaders Deliver with Confidence",
    description: "Closed-door, invite-only AECO executive roundtable.",
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
            name: "From Risk to Certainty: How Data-Driven Leaders Deliver with Confidence in an Uncertain Market — Executive Roundtable",
            description:
              "Closed-door, invite-only executive roundtable for AECO leaders. How data-driven leaders deliver with confidence in an uncertain market. Hosted by Events First Group, sponsored by Autodesk. Final approval lies with EFG.",
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
