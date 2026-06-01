import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/poka`;
// TODO: replace with a designed 1200x630 share card once the Poka roundtable
// brand artwork is finalised. For now using the industrial hero image.
const OG_IMAGE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Industrial_efficiency_in_action_Poka.png";

export const metadata: Metadata = {
  title:
    "Turn Your Frontline into a Strategic Growth Lever | Poka Executive Roundtable",
  description:
    "Invitation-only executive roundtable with Poka. How operations leaders close the execution gap across every shift, site and team — AI-augmented frontline work, connected-work strategy, KPI framework for frontline productivity.",
  keywords: [
    "Poka",
    "connected worker platform",
    "frontline operations",
    "manufacturing excellence",
    "AI for manufacturing",
    "operational excellence",
    "continuous improvement",
    "executive roundtable",
    "IFS Poka",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title:
      "Turn Your Frontline into a Strategic Growth Lever — Poka Executive Roundtable",
    description:
      "Close the execution gap. Every shift. Every site. Every team. An invitation-only executive roundtable with Poka.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Poka Executive Roundtable — Turn Your Frontline into a Strategic Growth Lever",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title:
      "Turn Your Frontline into a Strategic Growth Lever — Poka Executive Roundtable",
    description: "Invitation-only executive roundtable with Poka.",
    images: [OG_IMAGE],
  },
};

// Confirmed: 29 June 2026, in-person executive roundtable in Dubai (GST/UTC+4).
// Default time 15:00 GST — keep in sync with EVENT_DATE_ISO in page.tsx.
const EVENT_START_ISO = "2026-06-29T15:00:00+04:00";
const EVENT_END_ISO = "2026-06-29T16:30:00+04:00";

export default function PokaLayout({
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
            name: "Turn Your Frontline into a Strategic Growth Lever — Poka Executive Roundtable",
            description:
              "Invitation-only executive roundtable on closing the execution gap across every shift, site and team. AI-augmented frontline work, connected-work strategy, and a KPI framework for frontline productivity.",
            startDate: EVENT_START_ISO,
            endDate: EVENT_END_ISO,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Dubai — venue TBA",
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
              name: "Poka",
              url: "https://www.poka.io/",
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
              name: "Operations and manufacturing leaders — production, manufacturing excellence, plant leadership, digital transformation and workforce development",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
