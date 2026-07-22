import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/blueyonder`;
// TODO: replace with a designed 1200x630 share card once Blue Yonder Apex logo
// + final hero artwork is available.
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg";

export const metadata: Metadata = {
  title:
    "Visibility, Control & Networked Execution | Blue Yonder Executive Dinner — Dubai 23 September 2026",
  description:
    "Invitation-only Blue Yonder executive dinner on how GCC leaders orchestrate resilient, connected supply chain execution. Dubai, 23 September 2026.",
  keywords: [
    "Blue Yonder",
    "supply chain GCC",
    "warehouse management",
    "transportation management",
    "supply chain visibility",
    "network execution",
    "executive dinner Dubai",
    "connected supply chain",
    "WMS TMS",
    "supply chain resilience",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title:
      "Visibility, Control & Networked Execution — Blue Yonder Executive Dinner",
    description:
      "How GCC leaders orchestrate resilient, connected execution across operations. Dubai, 23 September 2026.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Blue Yonder Executive Dinner — Dubai, 23 September 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Blue Yonder Executive Dinner — Visibility, Control & Networked Execution",
    description: "Invitation-only executive dinner. Dubai, 23 September 2026.",
    images: [OG_IMAGE],
  },
};

export default function BlueYonderLayout({
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
            name: "Visibility, Control & Networked Execution — Blue Yonder Executive Dinner",
            description:
              "Invitation-only Blue Yonder executive dinner exploring how GCC leaders orchestrate resilient, connected supply chain execution across suppliers, warehouses and transportation.",
            startDate: "2026-09-23T17:00:00+04:00",
            endDate: "2026-09-23T20:30:00+04:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Hilton Palm Jumeirah, Dubai",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Palm Jumeirah",
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
              name: "Blue Yonder",
              url: "https://blueyonder.com/",
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
              name: "Senior supply chain, operations, logistics and transformation leaders across the GCC",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
