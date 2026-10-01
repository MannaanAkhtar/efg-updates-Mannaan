import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/outsystems`;

const TITLE = "ONE Executive Day KSA | OutSystems · JW Marriott Hotel Riyadh";
const DESCRIPTION =
  "ONE Executive Day KSA — the exclusive event for senior IT leaders. Discover how KSA organizations are using agentic systems to innovate faster, modernize legacy processes and build mission-critical applications. 19 October 2026, JW Marriott Hotel Riyadh.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "ONE Executive Day KSA",
    "OutSystems Riyadh",
    "agentic enterprise",
    "Agent Workbench",
    "low-code Saudi Arabia",
    "enterprise AI agents",
    "Vision 2030 digital transformation",
    "JW Marriott Hotel Riyadh",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Events First Group",
    title: "ONE Executive Day KSA — OutSystems, Riyadh",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "ONE Executive Day KSA — OutSystems, Riyadh",
    description: DESCRIPTION,
  },
};

export default function OutSystemsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "ONE Executive Day KSA",
    description: DESCRIPTION,
    startDate: "2026-10-19T09:00:00+03:00",
    endDate: "2026-10-19T16:00:00+03:00",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "JW Marriott Hotel Riyadh",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Riyadh",
        addressCountry: "SA",
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
