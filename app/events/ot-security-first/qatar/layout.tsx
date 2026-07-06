import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/ot-security-first/qatar`;
// Share-preview image = the page hero, so link unfurls show the Qatar hero art.
const OG_IMAGE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/assets/OT_qatar.png";

export const metadata: Metadata = {
  title:
    "OT Security First Qatar 2026 | Doha — Securing Critical Infrastructure",
  description:
    "The 5th edition of OT Security First in Qatar — Doha, 11 November 2026. 200+ delegates and 25+ speakers securing Qatar's operational technology across oil & gas, LNG, power, water, and smart cities, aligned to Qatar National Vision 2030 and TASMU Smart Qatar.",
  keywords: [
    "OT security conference Qatar 2026",
    "industrial cybersecurity summit Doha",
    "ICS security event Qatar",
    "SCADA security summit Qatar",
    "critical infrastructure security Doha",
    "OT Security First Qatar",
    "operational technology security Qatar",
    "LNG cybersecurity Qatar",
    "oil and gas cybersecurity Qatar",
    "NCSA Qatar cybersecurity",
    "TASMU Smart Qatar security",
    "Qatar National Vision 2030 cybersecurity",
    "smart city security Qatar",
    "energy and utilities cybersecurity Qatar",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
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
    title: "OT Security First Qatar 2026 — Doha",
    description:
      "Securing the Physical Core of Qatar's Critical Infrastructure. 200+ delegates, 11 November 2026, Doha, State of Qatar.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1344,
        height: 768,
        alt: "OT Security First Qatar 2026 — Industrial Cybersecurity Summit, Doha",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OT Security First Qatar 2026 — Doha",
    description:
      "Securing the Physical Core of Qatar's Critical Infrastructure. 200+ delegates, 11 November 2026, Doha.",
    images: [OG_IMAGE],
  },
};

export default function OTSecurityFirstQatarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Events", url: `${BASE_URL}/events` },
          {
            name: "OT Security First",
            url: `${BASE_URL}/events/ot-security-first`,
          },
          { name: "Qatar 2026", url: PAGE_URL },
        ]}
      />
      {/* Event structured data — JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "OT Security First Qatar 2026 — Doha",
            description:
              "Securing the Physical Core of Qatar's Critical Infrastructure. The 5th edition of OT Security First in Qatar, bringing together government leaders, regulators, and industry experts to secure operational technology across oil & gas, LNG, power, water, and smart cities — aligned to Qatar National Vision 2030 and the TASMU Smart Qatar programme.",
            startDate: "2026-11-11T09:00:00+03:00",
            endDate: "2026-11-11T18:00:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Doha, State of Qatar",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Doha",
                addressCountry: "QA",
              },
            },
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
            },
            offers: {
              "@type": "Offer",
              url: PAGE_URL,
              availability: "https://schema.org/InStock",
              validFrom: "2025-01-01",
            },
            typicalAgeRange: "25-",
            keywords:
              "OT security, ICS security, industrial cybersecurity, SCADA, Qatar, Doha, LNG cybersecurity, oil and gas security, critical infrastructure, NCSA, TASMU Smart Qatar, Qatar National Vision 2030",
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
                name: "When is OT Security First Qatar 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "OT Security First Qatar 2026 takes place on 11 November 2026 in Doha, State of Qatar.",
                },
              },
              {
                "@type": "Question",
                name: "Where is OT Security First Qatar 2026 held?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "In Doha, State of Qatar. The exact five-star venue is announced and confirmed to registered delegates closer to the event date.",
                },
              },
              {
                "@type": "Question",
                name: "Who attends OT Security First Qatar 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "200+ senior leaders and 25+ speakers, including government policymakers and ministries, the National Cyber Security Agency (NCSA) and regulators, heads of critical infrastructure and national utility operators, CISOs, CIOs, CTOs and CDOs, heads of OT/ICS and industrial cybersecurity, and energy, LNG, utilities and smart city leaders.",
                },
              },
              {
                "@type": "Question",
                name: "Is there a fee to attend OT Security First Qatar 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Attendance is free for qualified delegates. Apply via the registration form on the event page; the advisory team will confirm eligibility.",
                },
              },
              {
                "@type": "Question",
                name: "How do I register or sponsor OT Security First Qatar 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Register via the form on this page. For sponsorship, partnership, or speaking enquiries, contact partnerships@eventsfirstgroup.com.",
                },
              },
            ],
          }),
        }}
      />
      <EventFactBlock
        eventName="OT Security First Qatar 2026, Doha"
        series="OT Security First"
        date="11 November 2026"
        city="Doha"
        country="State of Qatar"
        format="in-person"
        audienceSize="200+ delegates and 25+ speakers"
        audienceTypes={[
          "Senior government policymakers and ministries",
          "National Cyber Security Agency (NCSA) and regulatory bodies",
          "Heads of critical infrastructure and national utility operators",
          "CISOs, CIOs, CTOs, and CDOs",
          "Heads of OT, ICS, and industrial cybersecurity",
          "Digital transformation and innovation leaders",
          "Risk, compliance, and governance executives",
          "Energy, LNG, utilities, and smart city leaders",
          "Technology providers, solution architects, and system integrators",
        ]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
