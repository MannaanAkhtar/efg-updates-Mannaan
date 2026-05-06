import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { SeriesFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/opex-first`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title: "OPEX First | Operational Excellence Summit Saudi Arabia | COO Conference",
  description:
    "The premier Operational Excellence summit series in Saudi Arabia and the Middle East. For COOs and transformation leaders. Register or sponsor now.",
  keywords: [
    "operational excellence summit Saudi Arabia",
    "OPEX conference Riyadh",
    "COO summit Middle East",
    "business transformation conference GCC",
    "process excellence event UAE",
    "Opex First",
    "continuous improvement summit",
    "lean six sigma conference",
    "operational efficiency event",
    "enterprise transformation",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Opex First Series, The Premier Operational Excellence Summit",
    description:
      "COOs, excellence leaders, and transformation architects. Where efficiency meets excellence.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Opex First Series, Operational Excellence Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Opex First Series, The Premier Operational Excellence Summit",
    description:
      "COOs and excellence leaders redefining operational brilliance.",
    images: [OG_IMAGE],
  },
};

export default function OpexFirstLayout({
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
          { name: "OPEX First", url: PAGE_URL },
        ]}
      />
      {/* EventSeries structured data, JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EventSeries",
            name: "Opex First Series",
            description:
              "The premier operational excellence summit series bringing together COOs, excellence leaders, and transformation architects.",
            url: PAGE_URL,
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
            },
            keywords:
              "operational excellence, OPEX, COO, business transformation, process excellence, continuous improvement, lean six sigma",
          }),
        }}
      />
      <SeriesFactBlock
        seriesName="OPEX First"
        description="OPEX First is the operational excellence and process intelligence summit series by Events First Group, convening transformation leaders, COOs, government excellence officers, and enterprise C-suite across Saudi Arabia and the wider GCC. Each edition is invitation-only and free for qualified end-users."
        audience={["COOs", "Transformation directors", "Process intelligence leaders", "Government excellence officers", "Enterprise C-suite", "Operations heads", "Continuous improvement leaders"]}
        editions={[
          { name: "Process Intelligence MENA, Executive Webinar", city: "GCC Region", country: "Online", date: "21 May 2026", url: `${BASE_URL}/events/opex-first/process-intelligence` },
          { name: "OPEX First Saudi 2026 (2nd Edition)", city: "Riyadh", country: "Saudi Arabia", date: "15 September 2026", url: `${BASE_URL}/events/opex-first/saudi-2026` },
        ]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
