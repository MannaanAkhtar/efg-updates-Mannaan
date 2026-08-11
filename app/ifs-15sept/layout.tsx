import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/ifs-15sept`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/IFS-jedda.jpg";

export const metadata: Metadata = {
  title:
    "Next Decade of Manufacturing in Saudi Arabia | IFS Executive Roundtable · Jeddah",
  description:
    "Join the IFS executive roundtable in Jeddah on 15 September 2026: how manufacturing leaders put industrial AI to work for real business value — aligned to Saudi Arabia's Future Factories Program and Vision 2030.",
  keywords: [
    "IFS",
    "industrial AI",
    "intelligent manufacturing",
    "IFS.ai",
    "smart manufacturing",
    "Saudi Arabia manufacturing",
    "Future Factories Program",
    "Vision 2030",
    "Jeddah executive roundtable",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title:
      "Next Decade of Manufacturing in Saudi Arabia — IFS Executive Roundtable · Jeddah, 15 September 2026",
    description:
      "Driven by Industrial AI. Built for Real Business Value. An exclusive IFS executive roundtable for manufacturing leaders — Jeddah, Saudi Arabia, 15 September 2026.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "IFS Executive Roundtable — Next Decade of Manufacturing in Saudi Arabia, Jeddah 15 September 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Next Decade of Manufacturing in Saudi Arabia — IFS Executive Roundtable",
    description: "Jeddah · 15 September 2026. Driven by Industrial AI. Built for Real Business Value.",
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
            name: "Next Decade of Manufacturing in Saudi Arabia — IFS Executive Roundtable",
            description:
              "An exclusive IFS executive roundtable on putting industrial AI to work in manufacturing — smart production, AI agents, and IFS.ai — aligned to Saudi Arabia's Future Factories Program and Vision 2030.",
            startDate: "2026-09-15T09:30:00+03:00",
            endDate: "2026-09-15T12:30:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Jeddah — venue TBA",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jeddah",
                addressCountry: "Saudi Arabia",
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
