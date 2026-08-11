import type { Metadata } from "next";
import localFont from "next/font/local";

// Blackstone eIT brand typeface — used on Blackstone-attributed surfaces only
// (host badges, agenda items where Blackstone owns, etc).
const montserrat = localFont({
  variable: "--font-montserrat",
  display: "swap",
  src: [{ path: "../fonts/montserrat/montserrat.woff2", weight: "300 800", style: "normal" }],
});

// OutSystems primary typeface — Cabin. Used for ALL page-level display type
// (the OutSystems base of the design).
const cabin = localFont({
  variable: "--font-cabin",
  display: "swap",
  src: [
    { path: "../fonts/cabin/cabin.woff2", weight: "400 700", style: "normal" },
    { path: "../fonts/cabin/cabin-italic.woff2", weight: "400 700", style: "italic" },
  ],
});

// OutSystems long-format typeface — Noto Sans. Used for body copy.
const notoSans = localFont({
  variable: "--font-noto-sans",
  display: "swap",
  src: [
    { path: "../fonts/noto-sans/noto-sans.woff2", weight: "400 700", style: "normal" },
    { path: "../fonts/noto-sans/noto-sans-italic.woff2", weight: "400 700", style: "italic" },
  ],
});

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/outsystems-blackstone`;

// The /outsystems-blackstone/opengraph-image.tsx route auto-generates the 1200x630
// share card (Blackstone logo + title) and is wired in automatically by
// Next.js — no need to set `openGraph.images` or `twitter.images` here.

export const metadata: Metadata = {
  title: "Executive Roundtable Riyadh | Empowering Saudi Public Sector Through Agentic AI",
  description:
    "An invitation-only executive roundtable hosted by Blackstone eIT with OutSystems — exploring how agentic AI scales digital government for Saudi Vision 2030. 24 June 2026, Fairmont Riyadh.",
  keywords: [
    "Blackstone eIT",
    "OutSystems",
    "agentic AI",
    "Saudi public sector",
    "digital government Riyadh",
    "Vision 2030 AI",
    "executive roundtable Riyadh",
    "AI-enabled public services",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Executive Roundtable Riyadh — Empowering Saudi Public Sector Through Agentic AI",
    description:
      "Invitation-only executive roundtable on agentic AI for Saudi public sector. Hosted by Blackstone eIT with OutSystems. 24 June 2026, Fairmont Riyadh.",
    url: PAGE_URL,
    siteName: "Events First Group",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Executive Roundtable Riyadh — Agentic AI for Saudi Public Sector",
    description: "Invitation-only roundtable. 24 June 2026, Fairmont Riyadh.",
  },
};

export default function BlackstoneLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${montserrat.variable} ${cabin.variable} ${notoSans.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Executive Roundtable Riyadh — Empowering Saudi Public Sector Through Agentic AI",
            description:
              "An invitation-only executive roundtable on agentic AI for Saudi public sector. Hosted by Blackstone eIT with OutSystems.",
            startDate: "2026-06-24T10:00:00+03:00",
            endDate: "2026-06-24T14:20:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Fairmont Riyadh",
              address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
            },
            image: [`${PAGE_URL}/opengraph-image`],
            organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL },
            sponsor: { "@type": "Organization", name: "OutSystems", url: "https://www.outsystems.com/" },
            offers: {
              "@type": "Offer",
              url: PAGE_URL,
              availability: "https://schema.org/InStock",
              price: "0",
              priceCurrency: "USD",
              validFrom: "2026-04-01",
            },
          }),
        }}
      />
      {children}
    </div>
  );
}
