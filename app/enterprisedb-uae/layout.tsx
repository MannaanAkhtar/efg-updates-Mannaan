import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/enterprisedb-uae`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/edb_postgres_ai_lightmode%402x+(4).png";

export const metadata: Metadata = {
  title: "The Sovereign Data Estate | EDB Executive Roundtable, Dubai UAE — 25 Nov 2026",
  description:
    "An invite-only executive roundtable on building a sovereign data estate on open-source Postgres — reducing cost, meeting data-sovereignty mandates, and scaling with AI. 25 November 2026, Dubai, UAE. Hosted with EDB.",
  keywords: [
    "sovereign data estate",
    "data sovereignty UAE",
    "PostgreSQL enterprise",
    "EDB Postgres AI",
    "database modernisation",
    "Oracle migration Postgres",
    "open-source database Middle East",
    "executive roundtable Dubai",
    "CIO CTO roundtable UAE",
    "database TCO reduction",
    "data residency compliance GCC",
    "AI data infrastructure",
    "EnterpriseDB",
    "vendor lock-in database",
  ],
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: "The Sovereign Data Estate — EDB Executive Roundtable, Dubai, UAE",
    description:
      "Breaking free from proprietary lock-in: a closed-door roundtable for senior IT & data leaders on building a sovereign data estate with Postgres. 25 November 2026.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "EDB Postgres AI — The Sovereign Data Estate Roundtable" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "The Sovereign Data Estate — EDB Executive Roundtable, Dubai, UAE",
    description:
      "A closed-door roundtable for senior IT & data leaders on building a sovereign data estate with Postgres. 25 November 2026, Dubai, UAE.",
    images: [OG_IMAGE],
  },
};

export default function EnterpriseDBLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "@id": `${PAGE_URL}#event`,
            name: "The Sovereign Data Estate: How Middle East Enterprises Are Breaking Free from Proprietary Lock-in",
            description:
              "An invite-only executive roundtable bringing together senior IT and data leaders to explore how organisations can build a truly sovereign data estate — grounded in open-source Postgres, free from vendor dependency, and architected to scale with AI.",
            startDate: "2026-11-25T09:00:00+04:00",
            endDate: "2026-11-25T12:00:00+04:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            inLanguage: "en",
            isAccessibleForFree: true,
            location: {
              "@type": "Place",
              name: "Dubai, United Arab Emirates",
              address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
            },
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
              logo: "https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo-02.png",
              sameAs: [
                "https://www.linkedin.com/company/events-first-group",
                "https://x.com/eventsfirstgrp",
              ],
            },
            sponsor: {
              "@type": "Organization",
              name: "EnterpriseDB (EDB)",
              url: "https://www.enterprisedb.com/",
            },
            offers: {
              "@type": "Offer",
              name: "Executive seat — by invitation, free for qualified end-users",
              url: PAGE_URL,
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              validFrom: "2026-01-01",
            },
            audience: {
              "@type": "BusinessAudience",
              audienceType: "Senior IT and data leaders — CIOs, CTOs, CDOs, Heads of Data and Infrastructure",
            },
            about: [
              { "@type": "Thing", name: "Data sovereignty" },
              { "@type": "Thing", name: "PostgreSQL" },
              { "@type": "Thing", name: "Database modernisation" },
              { "@type": "Thing", name: "Enterprise AI infrastructure" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
