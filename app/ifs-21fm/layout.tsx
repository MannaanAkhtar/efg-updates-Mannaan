import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/ifs-21fm`;
// No hero asset was supplied for this edition, so the OG image is the same
// stock shot the hero uses.
const OG_IMAGE =
  "https://images.unsplash.com/photo-1748027869634-fc2e545cfb0c?w=1200&q=82";

export const metadata: Metadata = {
  title:
    "Property and Facilities Management Software Solutions | IFS Executive Roundtable · 21 October 2026",
  description:
    "An IFS executive roundtable for Property and Facilities Services leaders on 21 October 2026: integrated software that streamlines operations, optimizes maintenance and enhances service delivery across a property portfolio.",
  keywords: [
    "IFS",
    "IFS Cloud",
    "property management software",
    "facilities management software",
    "field service management",
    "enterprise asset management",
    "workforce planning and scheduling",
    "maintenance scheduling",
    "first-time fix rate",
    "executive roundtable",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title:
      "Property and Facilities Management Software Solutions — IFS Executive Roundtable, 21 October 2026",
    description:
      "Streamline operations, optimize maintenance and enhance service delivery across a property portfolio. An exclusive IFS executive roundtable for Property and Facilities Services leaders.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "IFS Executive Roundtable — Property and Facilities Management, 21 October 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Property and Facilities Management Software Solutions — IFS Executive Roundtable",
    description:
      "21 October 2026. Streamline operations, optimize maintenance and enhance service delivery across a property portfolio.",
    images: [OG_IMAGE],
  },
};

export default function IfsPropertyFacilitiesLayout({
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
            name: "IFS Executive Roundtable — Property and Facilities Management",
            description:
              "An exclusive IFS executive roundtable for Property and Facilities Services leaders on efficient operations management, customer experience and asset performance — integrated software that streamlines operations, optimizes maintenance and enhances service delivery.",
            // Start time is not confirmed; the date is anchored to the start of
            // the event day and no endDate is claimed.
            startDate: "2026-10-21T09:00:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              // City and venue are both unconfirmed — no addressLocality or
              // addressCountry is asserted rather than guessing one.
              name: "To be announced",
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
