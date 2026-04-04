import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/data-ai-first/kuwait-2026`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title: "Digital First Kuwait 2026 | Data & AI Summit, 10 June, Jumeirah Messilah Beach",
  description:
    "Kuwait's premier Data & AI summit. 250+ CDOs and AI leaders, 10 June 2026, Jumeirah Messilah Beach Hotel, Kuwait City. Register or sponsor now.",
  keywords: [
    "data AI conference Kuwait 2026",
    "artificial intelligence summit Kuwait",
    "AI conference",
    "data analytics conference",
    "CDO summit Kuwait",
    "Data AI First Kuwait",
    "AI event June 2026",
    "machine learning conference Kuwait",
    "enterprise AI summit",
    "Kuwait Vision 2035 AI",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Digital First Kuwait 2026, Data & AI Summit",
    description:
      "250+ CDOs, AI architects, and enterprise leaders. 10 June 2026. Jumeirah Messilah Beach Hotel, Kuwait City. Turning Data & AI into Regulated, Profitable, and Scalable Solutions.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Digital First Kuwait 2026, Data & AI Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Digital First Kuwait 2026, Data & AI Summit",
    description:
      "250+ CDOs and AI leaders. 10 June 2026. Jumeirah Messilah Beach Hotel, Kuwait City.",
    images: [OG_IMAGE],
  },
};

export default function DataAIKuwaitLayout({
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
          { name: "Digital First", url: `${BASE_URL}/events/data-ai-first` },
          { name: "Kuwait 2026", url: PAGE_URL },
        ]}
      />
      {/* Event structured data, JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Digital First Kuwait 2026, Data & AI Summit",
            description:
              "Kuwait's premier Data & AI leadership summit bringing together CDOs, AI architects, data scientists, and enterprise leaders to shape Kuwait's AI-driven future aligned with Vision 2035.",
            startDate: "2026-06-10T08:00:00+03:00",
            endDate: "2026-06-10T18:00:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Jumeirah Messilah Beach Hotel & Spa",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Messilah Beach Area",
                addressLocality: "Kuwait City",
                addressCountry: "KW",
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
              "data, AI, artificial intelligence, CDO, Kuwait, data summit, enterprise AI",
          }),
        }}
      />
      {children}
    </>
  );
}
