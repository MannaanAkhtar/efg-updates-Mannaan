import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/ifs-21fm`;
// No hero asset was supplied for this edition, so the OG image is the same
// stock shot the hero uses.
const OG_IMAGE =
  "https://images.unsplash.com/photo-1748027869634-fc2e545cfb0c?w=1200&q=82";

export const metadata: Metadata = {
  // The headline leads, but the Property & Facilities phrasing stays in the
  // title — it is what the page is actually searched for.
  title:
    "From Operational Complexity to Service Excellence | IFS Property & Facilities Roundtable · 21 October 2026",
  description:
    "An IFS executive roundtable for Property and Facilities Services leaders at the Hilton Jeddah on 21 October 2026. Discover how leading organizations are leveraging AI, intelligent asset management and connected service operations to improve efficiency, elevate customer experiences and unlock new levels of operational excellence.",
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
    "Jeddah",
    "Saudi Arabia",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title:
      "From Operational Complexity to Service Excellence — IFS Executive Roundtable, 21 October 2026",
    description:
      "Discover how leading organizations are leveraging AI, intelligent asset management and connected service operations to improve efficiency, elevate customer experiences and unlock new levels of operational excellence.",
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
    title: "From Operational Complexity to Service Excellence — IFS Executive Roundtable",
    description:
      "21 October 2026. How AI, intelligent asset management and connected service operations improve efficiency and elevate customer experiences.",
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
