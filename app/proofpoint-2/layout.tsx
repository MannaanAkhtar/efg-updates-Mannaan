import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/proofpoint-2`;
// TODO: replace with a designed 1200x630 share card once available.
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg";

export const metadata: Metadata = {
  title:
    "The Next Chapter in Human and Agentic Security | Proofpoint Executive Roundtable",
  description:
    "An invitation-only Proofpoint executive roundtable on AI-powered agentic workspaces and the future of human + AI security. 16 June 2026, Crowne Plaza Riyadh.",
  keywords: [
    "Proofpoint",
    "agentic security",
    "human-centric cybersecurity",
    "AI security",
    "executive roundtable Riyadh",
    "Saudi Arabia cybersecurity",
    "collaboration security",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title:
      "The Next Chapter in Human and Agentic Security — Proofpoint Executive Roundtable",
    description:
      "Invitation-only Proofpoint roundtable for senior security leaders on agentic-era risk and human-centric defence. 16 June 2026, Riyadh.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Proofpoint Executive Roundtable — Riyadh, 16 June 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "The Next Chapter in Human and Agentic Security — Proofpoint",
    description: "Invitation-only roundtable. 16 June 2026, Riyadh.",
    images: [OG_IMAGE],
  },
};

export default function Proofpoint2Layout({
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
            name: "The Next Chapter in Human and Agentic Security — Proofpoint Executive Roundtable",
            description:
              "An invitation-only Proofpoint executive roundtable on the rise of AI-powered agentic workspaces and what they mean for security.",
            startDate: "2026-06-16T10:30:00+03:00",
            endDate: "2026-06-16T14:30:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "JW Marriott Riyadh",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Riyadh",
                addressCountry: "SA",
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
              name: "Proofpoint",
              url: "https://www.proofpoint.com/",
            },
            offers: {
              "@type": "Offer",
              url: PAGE_URL,
              availability: "https://schema.org/InStock",
              price: "0",
              priceCurrency: "USD",
              validFrom: "2026-01-01",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
