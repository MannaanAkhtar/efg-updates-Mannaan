import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/opex-first/saudi-2026`;
// TODO: replace with a designed 1200×630 share card (event title + date + Riyadh + 3rd Edition badge)
// Share preview uses the photographic hero image (same as the page's hero
// fallback/poster) so link cards render a proper landscape image, not a bare logo.
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/assets/opexKSA.png";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "OPEX First Saudi 2026 (OPEX KSA) — Operational Excellence Summit, Riyadh",
  description:
    "OPEX First Saudi Arabia 2026 (OPEX KSA) — operational excellence summit in Riyadh, 21 Oct 2026. 220+ delegates, 30+ speakers, 5 awards aligned to Vision 2030.",
  keywords: [
    "OPEX KSA",
    "OPEX First KSA",
    "OPEX First Saudi 2026",
    "operational excellence summit KSA",
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Operational Excellence",
  openGraph: {
    title: "OPEX First Saudi 2026 (OPEX KSA) — Riyadh",
    description:
      "Vision to Value — Merging AI and Process Excellence. 21 October 2026, Riyadh.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "OPEX First Saudi 2026 (OPEX KSA) — Riyadh", type: "image/png" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "OPEX First Saudi 2026 — Riyadh",
    description: "Vision to Value — Merging AI and Process Excellence. 21 October 2026, Riyadh.",
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
            "@type": "Organization",
            name: "Events First Group",
            alternateName: "EFG",
            url: BASE_URL,
            logo: `${BASE_URL}/events-first-group_logo_alt.svg`,
            description:
              "Premium B2B summits for COOs, CIOs, CTOs, and transformation leaders across the GCC. Producers of Cyber First, OT Security First, Digital First, OPEX First, and NetworkFirst.",
            sameAs: [
              "https://www.linkedin.com/company/events-first-group",
              "https://twitter.com/eventsfirstgrp",
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "OPEX First Saudi 2026 — 3rd Edition",
            description:
              "Vision to Value — Merging AI and Process Excellence. The only platform dedicated to propelling operational excellence to new heights, convening visionary government leaders, C-suite executives, and global tech innovators across Saudi Arabia's Vision 2030 execution decade.",
            startDate: "2026-10-21T09:00:00+03:00",
            endDate: "2026-10-21T17:00:00+03:00",
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
                name: "When is OPEX First Saudi 2026 (OPEX KSA)?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "OPEX First Saudi Arabia 2026 — also known as OPEX KSA — takes place on 21 October 2026 in Riyadh, Saudi Arabia.",
                },
              },
              {
                "@type": "Question",
                name: "Where is OPEX First Saudi 2026 held?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "OPEX First Saudi 2026 is held at the Hyatt Regency Riyadh Olaya in Riyadh, Saudi Arabia.",
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
      <EventFactBlock
        eventName="OPEX First Saudi 2026, 3rd Edition"
        series="OPEX First"
        date="21 October 2026"
        city="Riyadh"
        country="Saudi Arabia"
        format="in-person"
        audienceSize="220+ delegates and 30+ speakers"
        audienceTypes={["COOs", "Transformation directors", "Process intelligence leaders", "Government excellence officers", "Enterprise C-suite", "AI governance leaders", "Vision 2030 execution heads"]}
        topSpeakers={[
          { name: "H.E. Dr. Abdullah Bin Sharaf Alghamdi", title: "President", org: "Saudi Data & AI Authority (SDAIA)" },
          { name: "H.E. Eng. Ahmed Alsuwaiyan", title: "Governor & Board Member", org: "Digital Government Authority" },
          { name: "Rayan Alnafisah", title: "Senior Director", org: "Royal Commission for Riyadh City" },
          { name: "Neil Matthew Menezes", title: "VP — Maaden ERP Transformation Program", org: "Maaden" },
          { name: "Sultan Moraished", title: "Group Head of Technology & Corporate Excellence", org: "Red Sea Global" },
        ]}
        topSponsors={[
          { name: "Celonis", tier: "Confirmed" },
          { name: "RICS", tier: "Confirmed" },
          { name: "IQS", tier: "Confirmed" },
        ]}
        awards={["Operational Excellence", "AI & Digital Transformation", "Sustainability & ESG", "Supply Chain & Procurement", "Leadership in Operational & Change Excellence"]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
