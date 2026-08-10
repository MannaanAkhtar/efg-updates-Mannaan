import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/ifs-dubai`;
// TODO: replace with a designed 1200x630 share card once available.
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg";

export const metadata: Metadata = {
  title:
    "Responding to Supply Chain Disruption — In Weeks, Not Months | IFS Executive Briefing · Dubai",
  description:
    "Join the IFS executive briefing in Dubai on 21 October 2026: how logistics and supply chain leaders gain visibility, test scenarios, and act fast when volatility hits. Focused on Saudi Arabia & UAE.",
  keywords: [
    "IFS",
    "supply chain disruption",
    "logistics resilience",
    "IFS.ai Logistics",
    "industrial AI",
    "Saudi Arabia logistics",
    "UAE supply chain",
    "Dubai executive briefing",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title:
      "Responding to Supply Chain Disruption — In Weeks, Not Months · Dubai, 21 October 2026",
    description:
      "IFS executive briefing for logistics and supply chain leaders navigating active disruption. Dubai, UAE — 21 October 2026.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "IFS Executive Briefing — Responding to Supply Chain Disruption, Dubai 21 October 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Responding to Supply Chain Disruption — IFS Executive Briefing",
    description: "Dubai · 21 October 2026. For logistics leaders navigating active disruption.",
    images: [OG_IMAGE],
  },
};

export default function IfsLayout({
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
            name: "Responding to Supply Chain Disruption — In Weeks, Not Months",
            description:
              "IFS executive briefing covering visibility, simulation, and execution for logistics leaders responding to active supply chain disruption. Focused on Saudi Arabia & UAE.",
            startDate: "2026-10-21T10:00:00+04:00",
            endDate: "2026-10-21T12:30:00+04:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Dubai, UAE",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dubai",
                addressCountry: "United Arab Emirates",
              },
            },
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "IFS",
              url: "https://www.ifs.com/",
            },
            inLanguage: "en",
          }),
        }}
      />
      {children}
    </>
  );
}
