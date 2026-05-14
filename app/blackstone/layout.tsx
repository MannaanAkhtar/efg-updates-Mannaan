import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

// Brand-mandated typeface (per Blackstone eIT 2026 V1.0 brand guidelines).
// Scoped to /blackstone via this layout so the site-wide font stack is untouched.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/blackstone`;
// TODO: replace with a designed 1200×630 share card once available.
const OG_IMAGE = `${BASE_URL}/events-first-group_logo_alt.svg`;

export const metadata: Metadata = {
  title: "Executive Roundtable Riyadh | Empowering Saudi Public Sector Through Agentic AI",
  description:
    "An invitation-only executive roundtable hosted by Blackstone eIT with OutSystems — exploring how agentic AI scales digital government for Saudi Vision 2030. 10 June 2026, Fairmont Riyadh.",
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
      "Invitation-only executive roundtable on agentic AI for Saudi public sector. Hosted by Blackstone eIT with OutSystems. 10 June 2026, Fairmont Riyadh.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Executive Roundtable Riyadh — 10 June 2026" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Executive Roundtable Riyadh — Agentic AI for Saudi Public Sector",
    description: "Invitation-only roundtable. 10 June 2026, Fairmont Riyadh.",
    images: [OG_IMAGE],
  },
};

export default function BlackstoneLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={montserrat.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Executive Roundtable Riyadh — Empowering Saudi Public Sector Through Agentic AI",
            description:
              "An invitation-only executive roundtable on agentic AI for Saudi public sector. Hosted by Blackstone eIT with OutSystems.",
            startDate: "2026-06-10T10:00:00+03:00",
            endDate: "2026-06-10T14:20:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Fairmont Riyadh",
              address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
            },
            image: [OG_IMAGE],
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
