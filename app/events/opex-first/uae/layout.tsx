import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/opex-first/uae`;

// No dedicated OG card was supplied for this edition, so the link preview uses
// the same still the hero video falls back to.
const OG_IMAGE =
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80";

export const metadata: Metadata = {
  title: "OPEX First UAE 2027: Agentic AI & Operational Excellence Summit",
  description:
    "20 January 2027. The UAE summit for operational excellence, process intelligence and automation leaders delivering the national Agentic AI mandate.",
  keywords: [
    "OPEX First UAE",
    "operational excellence UAE",
    "Agentic AI government",
    "process mining",
    "process intelligence",
    "intelligent automation",
    "Zero Bureaucracy",
    "Dubai Services 360",
    "government excellence",
    "business process management",
    "OPEX awards",
    "operational excellence summit UAE",
    "operational excellence conference 2027",
    "process mining UAE",
    "agentic AI summit UAE",
    "COO summit UAE",
    "UAE",
    "2027",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OPEX First UAE 2027 — Agentic AI. Where the National Mandate meets Operational Reality.",
    description:
      "20 January 2027. 50% of UAE government sectors, services and operations on Agentic AI within two years. The methods, the sequence and the evidence that get you from ambition to measurable impact.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "OPEX First UAE 2027 — 20 January 2027",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "OPEX First UAE 2027 — 20 January 2027",
    description:
      "Agentic AI. Where the National Mandate meets Operational Reality. A one-day summit for operational excellence and process intelligence leaders.",
    images: [OG_IMAGE],
  },
};

export default function OpexFirstUaeLayout({
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
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
              { "@type": "ListItem", position: 2, name: "Events", item: `${BASE_URL}/events` },
              { "@type": "ListItem", position: 3, name: "OPEX First", item: `${BASE_URL}/events/opex-first` },
              { "@type": "ListItem", position: 4, name: "OPEX First UAE 2027", item: PAGE_URL },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "OPEX First UAE 2027",
            url: PAGE_URL,
            description:
              "A one-day operational excellence summit on delivering the UAE's Agentic AI mandate: process mining, process intelligence, intelligent automation and the governance that has to come first.",
            startDate: "2027-01-20T09:00:00+04:00",
            endDate: "2027-01-20T15:00:00+04:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              // Venue not yet confirmed; only the country is asserted.
              name: "To be announced",
              address: {
                "@type": "PostalAddress",
                addressCountry: "AE",
              },
            },
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
              logo: `${BASE_URL}/events-first-group_logo_alt.svg`,
            },
            inLanguage: "en",
          }),
        }}
      />
      {children}
    </>
  );
}
