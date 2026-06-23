import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first/qatar`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/assets/cyberQatar.png";
const OG_IMAGE_ALT =
  "Cyber First Qatar 2026 - Building cyber resilience for Qatar's AI-powered digital economy, 10 November 2026, Doha";

const EVENT_START = "2026-11-10T09:00:00+03:00";
const EVENT_END = "2026-11-10T15:30:00+03:00";

const RICH_DESCRIPTION =
  "Cyber First Qatar 2026 - the premier cybersecurity summit for Qatar's AI-powered digital economy. Aligned with the Qatar National Cyber Security Strategy 2024-2030, convening 250+ CISOs, government decision-makers, critical infrastructure operators and technology innovators. 10 November 2026, Doha, Qatar.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title:
    "Cyber First Qatar 2026 | Cybersecurity Summit Doha — 10 November",
  description: RICH_DESCRIPTION,
  keywords: [
    "Cyber First Qatar 2026",
    "cybersecurity summit Qatar",
    "CISO summit Doha",
    "Qatar National Cyber Security Strategy 2024-2030",
    "Qatar National Vision 2030 cybersecurity",
    "AI security Qatar",
    "cloud security summit Doha",
    "critical infrastructure cybersecurity Qatar",
    "IT OT security Qatar",
    "Zero Trust Qatar",
    "cybersecurity conference Middle East 2026",
    "information security conference Qatar",
    "digital trust Qatar",
    "Doha cybersecurity event",
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
    title:
      "Cyber First Qatar 2026 - Cybersecurity Summit, Doha",
    description: RICH_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Cyber First Qatar 2026 - Doha",
    description: RICH_DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: OG_IMAGE_ALT }],
  },
  category: "Cybersecurity",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Preconnect + DNS-prefetch to S3 */}
      <link
        rel="preconnect"
        href="https://efg-final.s3.eu-north-1.amazonaws.com"
        crossOrigin="anonymous"
      />
      <link
        rel="dns-prefetch"
        href="https://efg-final.s3.eu-north-1.amazonaws.com"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Events", url: `${BASE_URL}/events` },
          { name: "Cyber First", url: `${BASE_URL}/events/cyber-first` },
          { name: "Qatar 2026", url: PAGE_URL },
        ]}
      />
      {/* Organization schema */}
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
              "Premium B2B summits for CISOs, CTOs, and CDOs across the GCC and beyond. Producers of Cyber First, OT Security First, Digital First, OPEX First, and NetworkFirst.",
            sameAs: [
              "https://www.linkedin.com/company/events-first-group",
              "https://twitter.com/eventsfirstgrp",
            ],
          }),
        }}
      />
      {/* Event schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Cyber First Qatar 2026",
            alternateName: ["Cyber First Doha 2026", "Cyber First Qatar Summit 2026"],
            description:
              "The premier cybersecurity summit for Qatar's AI-powered digital economy. Aligned with Qatar National Cyber Security Strategy 2024-2030 and supporting Qatar National Vision 2030. Convenes CISOs, government leaders, regulators, and critical infrastructure operators for one day in Doha.",
            image: [OG_IMAGE],
            startDate: EVENT_START,
            endDate: EVENT_END,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Doha",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Doha",
                addressCountry: "QA",
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
              audienceType:
                "CISOs, CIOs, CTOs, CDOs, Government Cybersecurity Leaders, Critical Infrastructure Operators, Banking and FinTech security heads, OT/ICS Security Professionals",
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
      {/* FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "When is Cyber First Qatar 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Cyber First Qatar 2026 takes place on 10 November 2026 in Doha, Qatar. It is a one-day strategic platform for cybersecurity leadership, AI security, and digital trust across regulated sectors.",
                },
              },
              {
                "@type": "Question",
                name: "Where is Cyber First Qatar 2026 held?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The summit is held in Doha, Qatar. The exact venue is confirmed to registered delegates closer to the event date.",
                },
              },
              {
                "@type": "Question",
                name: "Who attends Cyber First Qatar 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "250+ senior cybersecurity leaders including CISOs, CIOs, CTOs, CDOs, SOC leaders, regulators, government cybersecurity heads, and critical infrastructure operators across Qatar's government, banking, energy, telecommunications, healthcare, and OT/ICS sectors. Attendance is invitation-only.",
                },
              },
              {
                "@type": "Question",
                name: "Is there a fee to attend Cyber First Qatar 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Attendance is free for qualified delegates. Apply via the registration form on the event page; the advisory team will confirm eligibility.",
                },
              },
              {
                "@type": "Question",
                name: "How do I register or sponsor Cyber First Qatar 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Register via the form on this page. For sponsorship, partnership, or speaking enquiries, contact partnerships@eventsfirstgroup.com.",
                },
              },
              {
                "@type": "Question",
                name: "Does Cyber First Qatar 2026 align with the Qatar National Cyber Security Strategy?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. The summit is aligned with the Qatar National Cyber Security Strategy 2024-2030 and supports the cybersecurity ambitions of Qatar National Vision 2030.",
                },
              },
              {
                "@type": "Question",
                name: "Which industries are represented at Cyber First Qatar 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Government and public sector, banking and FinTech, telecommunications, oil and gas, utilities and critical infrastructure, cloud and AI providers, healthcare and life sciences, manufacturing and industrial (OT/ICS), transportation and smart mobility, smart cities and digital government, and education and research institutions.",
                },
              },
            ],
          }),
        }}
      />
      <EventFactBlock
        eventName="Cyber First Qatar 2026"
        series="Cyber First"
        date="10 November 2026"
        city="Doha"
        country="Qatar"
        format="in-person"
        audienceTypes={[
          "CISOs",
          "CIOs, CTOs and CDOs",
          "Heads of Cybersecurity and Information Security",
          "SOC, Threat Intelligence and Incident Response leaders",
          "Government cybersecurity leaders and regulators",
          "OT/ICS and Critical Infrastructure security professionals",
          "Banking, FinTech and Telecommunications security heads",
        ]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
