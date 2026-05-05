import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/opex-first/process-intelligence`;
const OG_IMAGE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/logos/OPEX+FIRST+logo-1.png";

export const metadata: Metadata = {
  title:
    "Process Intelligence MENA | Executive Webinar 2026",
  description:
    "From Digital Investment to Measurable Execution. A 2-hour executive webinar for senior transformation, operations, and technology leaders across the GCC. May 21, 2026.",
  keywords: [
    "process intelligence webinar",
    "MENA process mining",
    "GCC operational excellence",
    "digital transformation GCC",
    "process mining webinar",
    "operational intelligence MENA",
    "OPEX First",
    "executive webinar 2026",
    "process optimisation",
    "enterprise transformation",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Process Intelligence MENA — Executive Webinar",
    description:
      "From Digital Investment to Measurable Execution. Driving Operational Intelligence Across the GCC. May 21, 2026.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Process Intelligence MENA — Executive Webinar 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Process Intelligence MENA — Executive Webinar",
    description:
      "From Digital Investment to Measurable Execution. May 21, 2026 — GCC Region.",
    images: [OG_IMAGE],
  },
};

export default function OpexVirtualForumLayout({
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
          {
            name: "OPEX First",
            url: `${BASE_URL}/events/opex-first`,
          },
          { name: "Process Intelligence", url: PAGE_URL },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Process Intelligence MENA — Executive Webinar 2026",
            description:
              "From Digital Investment to Measurable Execution. A 2-hour executive webinar for senior transformation, operations, and technology leaders across the GCC.",
            startDate: "2026-05-21T11:00:00+04:00",
            endDate: "2026-05-21T13:00:00+04:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OnlineEventAttendanceMode",
            location: {
              "@type": "VirtualLocation",
              url: PAGE_URL,
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
              validFrom: "2026-01-01",
            },
            typicalAgeRange: "25-",
            keywords:
              "process intelligence, process mining, GCC, operational excellence, digital transformation, executive webinar",
          }),
        }}
      />
      {children}
    </>
  );
}
