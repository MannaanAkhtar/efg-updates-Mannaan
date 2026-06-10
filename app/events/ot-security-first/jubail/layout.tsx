import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/ot-security-first/jubail`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/assets/OT_Jubail.png";
const OG_IMAGE_ALT = "OT Security First Jubail 2026 — Industrial cybersecurity summit, 27 October 2026, Jubail, Saudi Arabia";

const EVENT_START = "2026-10-27T08:30:00+03:00";
const EVENT_END = "2026-10-27T17:30:00+03:00";

const RICH_DESCRIPTION =
  "OT Security First Jubail 2026 — the Kingdom's flagship industrial cybersecurity summit. Aligned with NCA OTCC-1:2022, convening CISOs, regulators, and critical infrastructure leaders. 27 October 2026, Jubail, Saudi Arabia.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "OT Security Jubail 2026 | Industrial Cybersecurity Summit — 27 Oct",
  description: RICH_DESCRIPTION,
  keywords: [
    "OT Security First Jubail 2026",
    "OT security summit Saudi Arabia",
    "industrial cybersecurity Jubail",
    "critical infrastructure security KSA",
    "NCA OTCC-1:2022 compliance",
    "SCADA security summit Saudi",
    "ICS cybersecurity conference",
    "IT OT convergence Saudi Arabia",
    "Vision 2030 industrial cybersecurity",
    "petrochemicals OT security",
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
  openGraph: {
    title: "OT Security First Jubail 2026 — Industrial Cybersecurity Summit",
    description: RICH_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_IMAGE_ALT, type: "image/png" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "OT Security First Jubail 2026",
    description: RICH_DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: OG_IMAGE_ALT }],
  },
  category: "Industrial Cybersecurity",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Preconnect + DNS-prefetch to S3 — most page assets (hero video, bg images, gallery, speaker photos) hit this origin */}
      <link rel="preconnect" href="https://efg-final.s3.eu-north-1.amazonaws.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://efg-final.s3.eu-north-1.amazonaws.com" />
      <BreadcrumbSchema items={[{ name: "Home", url: BASE_URL }, { name: "Events", url: `${BASE_URL}/events` }, { name: "OT Security First", url: `${BASE_URL}/events/ot-security-first` }, { name: "Jubail 2026", url: PAGE_URL }]} />
      {/* Organization schema — site-wide brand surface for knowledge-panel eligibility */}
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
            description: "Premium B2B summits for CISOs, CTOs, and CDOs across the GCC and beyond. Producers of Cyber First, OT Security First, Digital First, OPEX First, and NetworkFirst.",
            sameAs: [
              "https://www.linkedin.com/company/events-first-group",
              "https://twitter.com/eventsfirstgrp",
            ],
          }),
        }}
      />
      {/* Event schema — enriched: image, endDate, organizer.logo, sub-event categorisation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "OT Security First Jubail 2026",
            alternateName: ["OT Security Jubail 2026", "OT Security First Saudi 2026"],
            description:
              "The Kingdom's flagship industrial cybersecurity summit — aligned with NCA OTCC-1:2022, convening CISOs, regulators, and critical infrastructure leaders for one day in Jubail.",
            image: [OG_IMAGE],
            startDate: EVENT_START,
            endDate: EVENT_END,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Jubail",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jubail",
                addressRegion: "Eastern Province",
                addressCountry: "SA",
              },
            },
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
              logo: `${BASE_URL}/events-first-group_logo_alt.svg`,
              sameAs: [
                "https://www.linkedin.com/company/events-first-group",
                "https://twitter.com/eventsfirstgrp",
              ],
            },
            audience: {
              "@type": "BusinessAudience",
              audienceType: "OT/ICS security leaders, Plant CISOs, Critical Infrastructure operators, Regulators",
            },
            offers: {
              "@type": "Offer",
              url: PAGE_URL,
              availability: "https://schema.org/InStock",
              price: "0",
              priceCurrency: "USD",
              validFrom: "2026-01-01",
              category: "Invitation-only delegate registration",
            },
            inLanguage: "en",
            isAccessibleForFree: true,
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
              { "@type": "Question", name: "When is OT Security First Jubail 2026?", acceptedAnswer: { "@type": "Answer", text: "OT Security First Jubail 2026 takes place on 27 October 2026 in Jubail, Saudi Arabia. It is a one-day strategic dialogue platform for industrial cybersecurity and operational resilience." } },
              { "@type": "Question", name: "Where is OT Security First Jubail 2026 held?", acceptedAnswer: { "@type": "Answer", text: "In Jubail, Saudi Arabia — the heart of the Kingdom's industrial corridor and one of the largest petrochemical hubs in the world. The exact venue is confirmed to registered delegates closer to the event date." } },
              { "@type": "Question", name: "Who attends OT Security First Jubail 2026?", acceptedAnswer: { "@type": "Answer", text: "Senior government policymakers, National Cybersecurity Authority regulators, heads of critical infrastructure, CISOs, CIOs, CTOs, CDOs, heads of OT/ICS cybersecurity, risk and compliance executives, and leaders from energy, utilities, petrochemicals, and manufacturing. Attendance is invitation-only." } },
              { "@type": "Question", name: "Is there a fee to attend OT Security First Jubail 2026?", acceptedAnswer: { "@type": "Answer", text: "Attendance is free for qualified delegates. Apply via the registration form on the event page; the advisory team will confirm eligibility." } },
              { "@type": "Question", name: "How do I register or sponsor OT Security First Jubail 2026?", acceptedAnswer: { "@type": "Answer", text: "Register via the form on this page. For sponsorship, partnership, or speaking enquiries, contact partnerships@eventsfirstgroup.com." } },
              { "@type": "Question", name: "Does OT Security First Jubail 2026 align with NCA OTCC-1:2022?", acceptedAnswer: { "@type": "Answer", text: "Yes. The summit is aligned with the Saudi National Cybersecurity Authority's Operational Technology Cybersecurity Controls (OTCC-1:2022) and supports the Kingdom's national cybersecurity framework under Vision 2030." } },
              { "@type": "Question", name: "Which industries are represented at OT Security First Jubail 2026?", acceptedAnswer: { "@type": "Answer", text: "Oil and gas, power and utilities, petrochemicals, water and waste, nuclear, manufacturing, mining and metals, transport and logistics, smart cities, and critical government infrastructure — across both public sector leadership and private sector execution." } },
            ],
          }),
        }}
      />
      <EventFactBlock
        eventName="OT Security Jubail 2026"
        series="OT Security First"
        date="27 October 2026"
        city="Jubail"
        country="Saudi Arabia"
        format="in-person"
        audienceTypes={["OT/ICS security leaders", "Plant CISOs", "Energy security heads", "Petrochemicals security executives", "Utilities security leaders", "Engineering directors"]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
