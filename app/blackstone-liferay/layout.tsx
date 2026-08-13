import type { Metadata } from "next";
import localFont from "next/font/local";

// Source Sans (Source Sans Pro / Source Sans 3) — Liferay's brand typeface.
// Applied page-wide as the single family for this dual-brand roundtable.
const sourceSans = localFont({
  variable: "--font-source",
  display: "swap",
  src: [
    { path: "../fonts/source-sans/source-sans.woff2", weight: "300 800", style: "normal" },
    { path: "../fonts/source-sans/source-sans-italic.woff2", weight: "400 700", style: "italic" },
  ],
});

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/blackstone-liferay`;

export const metadata: Metadata = {
  title: "Executive Roundtable | AI-Powered Government — Enabling Citizen-Centered Experiences",
  description:
    "An invitation-only executive roundtable co-hosted by Blackstone eIT and Liferay — integrating Digital Experience Platforms with scalable, governed Agentic AI to empower Saudi Vision 2030. 20 October 2026, Saudi Arabia.",
  keywords: [
    "Blackstone eIT",
    "Liferay",
    "Digital Experience Platform",
    "DXP",
    "Agentic AI",
    "Saudi public sector",
    "digital government Riyadh",
    "Vision 2030",
    "citizen experience",
    "executive roundtable Riyadh",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "AI-Powered Government — Enabling Citizen-Centered Experiences | Blackstone eIT × Liferay",
    description:
      "Invitation-only executive roundtable on integrating DXP with governed Agentic AI for Saudi public sector. Co-hosted by Blackstone eIT and Liferay. 20 October 2026, Saudi Arabia.",
    url: PAGE_URL,
    siteName: "Events First Group",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "AI-Powered Government — Blackstone eIT × Liferay Executive Roundtable",
    description: "Invitation-only roundtable. 20 October 2026, Riyadh.",
  },
};

export default function BlackstoneLiferayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={sourceSans.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "AI-Powered Government — Enabling Citizen-Centered Experiences | Blackstone eIT × Liferay",
            description:
              "An invitation-only executive roundtable integrating Digital Experience Platforms with governed Agentic AI for the Saudi public sector. Co-hosted by Blackstone eIT and Liferay.",
            startDate: "2026-10-20T10:00:00+03:00",
            endDate: "2026-10-20T14:00:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Saudi Arabia",
              address: { "@type": "PostalAddress", addressCountry: "SA" },
            },
            organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL },
            performer: [
              { "@type": "Organization", name: "Blackstone eIT", url: "https://blackstoneeit.com/" },
              { "@type": "Organization", name: "Liferay", url: "https://www.liferay.com/" },
            ],
            offers: {
              "@type": "Offer",
              url: PAGE_URL,
              availability: "https://schema.org/InStock",
              price: "0",
              priceCurrency: "USD",
              validFrom: "2026-08-01",
            },
          }),
        }}
      />
      {children}
    </div>
  );
}
