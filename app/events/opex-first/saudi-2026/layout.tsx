import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/opex-first/saudi-2026`;
// TODO: replace with a designed 1200×630 share card (event title + date + Riyadh + 2nd Edition badge)
// once available, e.g. `${S3}/og/opex-first-saudi-2026-share.png`. Today this is the bare logo,
// which Twitter's `summary_large_image` card crops awkwardly.
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/logos/OPEX+FIRST+logo-1.png";

export const metadata: Metadata = {
  title: "OPEX First Saudi 2026 | 2nd Edition Operational Excellence Summit, Riyadh",
  description:
    "2nd Edition Operational Excellence summit, Riyadh, 15 September 2026. 220+ delegates, 30+ speakers, 5 awards aligned to Vision 2030 priorities.",
  keywords: [
    "OPEX First Saudi 2026",
    "operational excellence summit Riyadh",
    "Vision 2030 execution",
    "Saudi Aramco APS",
    "SDAIA AI governance",
    "Digital Government Authority",
    "GovExPro",
    "process intelligence Riyadh",
    "operational excellence KSA",
    "process mining Saudi",
    "intelligent automation KSA",
    "enterprise architecture Saudi",
    "RPA banking telecom Saudi",
    "OPEX awards 2026",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OPEX First Saudi 2026 — 2nd Edition, Riyadh",
    description:
      "Operational Excellence — Where Leadership Vision Meets Technology Execution. 15 September 2026, Riyadh.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "OPEX First Saudi 2026 — 2nd Edition" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "OPEX First Saudi 2026 — 2nd Edition, Riyadh",
    description: "Operational Excellence — Where Leadership Vision Meets Technology Execution. 15 September 2026, Riyadh.",
    images: [OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Events", url: `${BASE_URL}/events` },
          { name: "OPEX First", url: `${BASE_URL}/events/opex-first` },
          { name: "Saudi 2026", url: PAGE_URL },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "OPEX First Saudi 2026 — 2nd Edition",
            description:
              "Operational Excellence — Where Leadership Vision Meets Technology Execution. The only platform dedicated to propelling operational excellence to new heights, convening visionary government leaders, C-suite executives, and global tech innovators across Saudi Arabia's Vision 2030 execution decade.",
            startDate: "2026-09-15T09:00:00+03:00",
            endDate: "2026-09-15T17:00:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Riyadh",
              address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
            },
            image: [OG_IMAGE],
            organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL },
            offers: {
              "@type": "Offer",
              url: PAGE_URL,
              availability: "https://schema.org/InStock",
              price: "0",
              priceCurrency: "USD",
              validFrom: "2026-01-01",
            },
            audience: {
              "@type": "BusinessAudience",
              name: "Senior operational excellence, transformation, technology, and government leaders",
            },
            typicalAgeRange: "25-",
            keywords:
              "operational excellence, OPEX First, Vision 2030, process intelligence, intelligent automation, AI governance, KPI accountability, Saudi Arabia, Riyadh, GovExPro, SDAIA, Aramco APS",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "When is OPEX First Saudi 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "OPEX First Saudi Arabia 2026 takes place on 15 September 2026 in Riyadh, Saudi Arabia.",
                },
              },
              {
                "@type": "Question",
                name: "Where is OPEX First Saudi 2026 held?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "OPEX First Saudi 2026 is held in Riyadh, Saudi Arabia. The exact venue is confirmed to registered delegates closer to the event date.",
                },
              },
              {
                "@type": "Question",
                name: "Who attends OPEX First Saudi 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Senior leaders driving operational excellence and digital transformation across Saudi Arabia — public-sector executives, enterprise C-suite, transformation directors, and process intelligence leaders. Attendance is invitation-only with 220+ delegates and 30+ speakers.",
                },
              },
              {
                "@type": "Question",
                name: "Is there a fee to attend OPEX First Saudi 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Attendance is free for qualified delegates. Apply via the registration form on the event page; the advisory team will confirm eligibility.",
                },
              },
              {
                "@type": "Question",
                name: "How do I nominate someone for the OPEX First Awards 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Submit a nomination via the form in the Awards section of the event page. Five categories cover Operational Excellence, AI & Digital Transformation, Sustainability & ESG, Supply Chain & Procurement, and Leadership in Operational & Change Excellence.",
                },
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
