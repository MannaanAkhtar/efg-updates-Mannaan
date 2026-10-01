import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/ifs-20core`;
const OG_IMAGE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/heros/sitecore_hero-gettyimages-1267010934.avif";

export const metadata: Metadata = {
  // The headline leads, but the Construction & Engineering phrasing stays in
  // the title — it is what the page is actually searched for.
  title:
    "From Project Complexity to Predictable Outcomes | IFS Construction & Engineering Roundtable · 20 October 2026",
  description:
    "An IFS executive roundtable for Construction and Engineering leaders at the Hilton Jeddah on 20 October 2026, focused on transforming project delivery, improving financial control, maximizing asset performance and driving profitable growth through connected, intelligent operations.",
  keywords: [
    "IFS",
    "IFS Cloud ERP",
    "construction software",
    "engineering software",
    "asset lifecycle management",
    "enterprise asset management",
    "field service management",
    "shipbuilding and maritime",
    "project financial control",
    "executive roundtable",
    "Jeddah",
    "Saudi Arabia",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title:
      "From Project Complexity to Predictable Outcomes — IFS Executive Roundtable, 20 October 2026",
    description:
      "Transforming project delivery, financial control and asset performance through connected, intelligent operations. An exclusive IFS executive roundtable for Construction and Engineering leaders.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "IFS Executive Roundtable — Construction and Engineering, 20 October 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "From Project Complexity to Predictable Outcomes — IFS Executive Roundtable",
    description:
      "20 October 2026. Transforming project delivery, financial control and asset performance through connected, intelligent operations.",
    images: [OG_IMAGE],
  },
};

export default function IfsCoreEngineeringLayout({
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
            name: "IFS Executive Roundtable — Construction and Engineering",
            description:
              "An exclusive IFS executive roundtable for Construction and Engineering leaders on managing the complete asset lifecycle — connecting project planning, project execution, project financial control and asset and facilities management.",
            // Start time is not confirmed; the date is anchored to the start of
            // the event day and no endDate is claimed.
            startDate: "2026-10-20T09:00:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Hilton Jeddah",
              address: {
                "@type": "PostalAddress",
                // No street address was supplied, so only the city and country
                // are asserted.
                addressLocality: "Jeddah",
                addressCountry: "SA",
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
