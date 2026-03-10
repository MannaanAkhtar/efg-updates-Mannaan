import type { Metadata } from "next";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/data-ai-first/kuwait-2026`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title: "Data & AI First Kuwait 2026 | Data & AI Summit — 18 May, Jumeirah Messilah Beach",
  description:
    "Kuwait's premier Data & AI leadership summit. 250+ CDOs, AI architects, and enterprise leaders. 18 May 2026 at Jumeirah Messilah Beach Hotel, Kuwait City. Turning Data & AI into Regulated, Profitable, and Scalable Solutions.",
  keywords: [
    "data AI conference Kuwait 2026",
    "artificial intelligence summit Kuwait",
    "AI conference",
    "data analytics conference",
    "CDO summit Kuwait",
    "Data AI First Kuwait",
    "AI event May 2026",
    "machine learning conference Kuwait",
    "enterprise AI summit",
    "Kuwait Vision 2035 AI",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Data & AI First Kuwait 2026 — Data & AI Summit",
    description:
      "250+ CDOs, AI architects, and enterprise leaders. 18 May 2026. Jumeirah Messilah Beach Hotel, Kuwait City. Turning Data & AI into Regulated, Profitable, and Scalable Solutions.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Data & AI First Kuwait 2026 — Data & AI Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data & AI First Kuwait 2026 — Data & AI Summit",
    description:
      "250+ CDOs and AI leaders. 18 May 2026. Jumeirah Messilah Beach Hotel, Kuwait City.",
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
      {/* Event structured data — JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Data & AI First Kuwait 2026 — Data & AI Summit",
            description:
              "Kuwait's premier Data & AI leadership summit bringing together CDOs, AI architects, data scientists, and enterprise leaders to shape Kuwait's AI-driven future aligned with Vision 2035.",
            startDate: "2026-05-18T08:00:00+03:00",
            endDate: "2026-05-18T18:00:00+03:00",
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
