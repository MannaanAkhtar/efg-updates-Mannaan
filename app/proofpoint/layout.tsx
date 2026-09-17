import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/proofpoint`;
// TODO: replace with a designed 1200x630 share card once available.
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg";

export const metadata: Metadata = {
  title:
    "The Next Chapter in Human and Agentic Security | Proofpoint Executive Roundtable",
  description:
    "An invitation-only Proofpoint executive roundtable on AI-powered agentic workspaces and the future of human + AI security. Riyadh — date to be announced.",
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
      "Invitation-only Proofpoint roundtable for senior security leaders on agentic-era risk and human-centric defence. Riyadh — date to be announced.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Proofpoint Executive Roundtable — Riyadh",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "The Next Chapter in Human and Agentic Security — Proofpoint",
    description: "Invitation-only roundtable. Riyadh — date to be announced.",
    images: [OG_IMAGE],
  },
};

export default function ProofpointLayout({
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
            // Postponed with no new date yet. Per Google's event structured-data
            // guidance, keep the ORIGINAL dates in startDate/endDate and mark the
            // status EventPostponed; switch to EventRescheduled (with
            // previousStartDate) once the new date is known.
            startDate: "2026-09-23T10:30:00+03:00",
            endDate: "2026-09-23T14:30:00+03:00",
            eventStatus: "https://schema.org/EventPostponed",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Crowne Plaza Riyadh RDC Hotel & Convention by IHG",
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
