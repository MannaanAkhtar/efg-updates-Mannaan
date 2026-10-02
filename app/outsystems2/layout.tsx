import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/outsystems2`;
// The hero key visual doubles as the social preview. It is 1920x1080, so a card
// that insists on 1.91:1 crops only a sliver off the top and bottom.
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/heros/pic.png";
const OG_IMAGE_ALT =
  "Innovator Day UAE — OutSystems, Museum of the Future, Dubai, 28 October 2026";

const TITLE = "Innovator Day UAE | OutSystems · Museum of the Future, Dubai";
const DESCRIPTION =
  "Innovator Day UAE — join 200+ technology and business leaders for a focused day of keynotes, customer stories, expert sessions and live demonstrations that turn AI ambition into practical action. 28 October 2026, Museum of the Future, Dubai.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Innovator Day UAE",
    "OutSystems Dubai",
    "agentic AI",
    "agentic enterprise",
    "low-code UAE",
    "application modernization",
    "enterprise AI",
    "Museum of the Future",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Events First Group",
    title: "Innovator Day UAE — OutSystems, Museum of the Future",
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1920, height: 1080, alt: OG_IMAGE_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Innovator Day UAE — OutSystems, Museum of the Future",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function OutSystemsInnovatorDayUaeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Innovator Day UAE",
    description: DESCRIPTION,
    image: [OG_IMAGE],
    // Dubai is UTC+4, so the offsets are +04:00 rather than the +03:00 the
    // Riyadh edition carries.
    startDate: "2026-10-28T09:00:00+04:00",
    endDate: "2026-10-28T15:00:00+04:00",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Museum of the Future",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "OutSystems",
      url: "https://www.outsystems.com/",
    },
    url: PAGE_URL,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
