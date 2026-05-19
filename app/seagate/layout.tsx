import type { Metadata } from "next";
import localFont from "next/font/local";

const sohneBreit = localFont({
  src: [
    { path: "../../public/fonts-seagate/SohneBreit-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts-seagate/SohneBreit-Book.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts-seagate/SohneBreit-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts-seagate/SohneBreit-Semibold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts-seagate/SohneBreit-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts-seagate/SohneBreit-ExtraBold.otf", weight: "800", style: "normal" },
  ],
  variable: "--font-sohne-breit",
  display: "swap",
});

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/seagate`;
// TODO: replace with a designed 1200×630 share card once available.
const OG_IMAGE = `${BASE_URL}/seagate-brand/seagate-pms.png`;

export const metadata: Metadata = {
  title: "Seagate Executive Roundtable | Mass Capacity Storage & Mozaic 4+",
  description:
    "An invitation-only Seagate executive roundtable on the future of mass capacity storage, Mozaic 4+ technology, and the data centre of tomorrow. 17 June 2026, Dubai.",
  keywords: [
    "Seagate roundtable",
    "Mozaic 4+",
    "mass capacity storage",
    "data centre storage UAE",
    "Seagate Technology",
    "enterprise storage executive event",
    "data centre infrastructure Dubai",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Seagate Executive Roundtable — Powering the Future of Mass Capacity Storage",
    description:
      "Join Seagate Technology leadership for an invitation-only roundtable on Mozaic 4+ and the future of data centre storage. 17 June 2026, Dubai.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Seagate Executive Roundtable — Dubai, 17 June 2026" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Seagate Executive Roundtable — Mass Capacity Storage & Mozaic 4+",
    description: "Invitation-only roundtable. 17 June 2026, Dubai.",
    images: [OG_IMAGE],
  },
};

export default function SeagateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={sohneBreit.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Seagate Executive Roundtable — Powering the Future of Mass Capacity Storage",
            description:
              "An invitation-only executive roundtable on Seagate's Mozaic 4+ technology and the future of mass capacity storage for the data centre.",
            startDate: "2026-06-17T10:30:00+04:00",
            endDate: "2026-06-17T14:30:00+04:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Dubai, United Arab Emirates",
              address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
            },
            image: [OG_IMAGE],
            organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL },
            sponsor: { "@type": "Organization", name: "Seagate Technology", url: "https://www.seagate.com/" },
            offers: {
              "@type": "Offer",
              url: PAGE_URL,
              availability: "https://schema.org/InStock",
              price: "0",
              priceCurrency: "USD",
              validFrom: "2025-12-01",
            },
          }),
        }}
      />
      {children}
    </div>
  );
}
