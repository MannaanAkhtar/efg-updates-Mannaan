import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first/kuwait-2026`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0030.JPG";

export const metadata: Metadata = {
  title: "Cyber First Kuwait 2026 | 3rd Annual Cybersecurity Summit, 9 June, Jumeirah Messilah Beach",
  description:
    "Kuwait's premier cybersecurity summit. 500+ CISOs and security leaders, 9 June 2026, Jumeirah Messilah Beach Hotel. Register or sponsor now.",
  keywords: [
    "cybersecurity conference Kuwait 2026",
    "CISO summit Kuwait",
    "cyber security event Kuwait City",
    "cybersecurity summit",
    "information security conference Kuwait",
    "Cyber First Kuwait",
    "cybersecurity event June 2026",
    "enterprise security summit",
    "Kuwait cybersecurity leaders",
    "CISO summit",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Cyber First Kuwait 2026, 3rd Annual Cybersecurity Summit",
    description:
      "500+ CISOs and security leaders. 9 June 2026. Jumeirah Messilah Beach Hotel, Kuwait City. The definitive cybersecurity summit.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Cyber First Kuwait 2026, Cybersecurity Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Cyber First Kuwait 2026, 3rd Annual Cybersecurity Summit",
    description:
      "500+ CISOs and security leaders. 9 June 2026. Jumeirah Messilah Beach Hotel, Kuwait City.",
    images: [OG_IMAGE],
  },
};

export default function CyberFirstKuwaitLayout({
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
          { name: "Cyber First", url: `${BASE_URL}/events/cyber-first` },
          { name: "Kuwait 2026", url: PAGE_URL },
        ]}
      />
      {/* Event structured data, JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Cyber First Kuwait 2026, 3rd Annual Cybersecurity Summit",
            description:
              "Kuwait's premier cybersecurity leadership summit bringing together CISOs, government cyber leaders, and security innovators.",
            startDate: "2026-06-09T08:00:00+03:00",
            endDate: "2026-06-09T18:00:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Jumeirah Messilah Beach Hotel & Spa",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Messilah Beach Area",
                addressLocality: "Kuwait City",
                addressCountry: "KW",
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
              "cybersecurity, CISO, information security, Kuwait, cyber summit, enterprise security",
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
                name: "When is Cyber First Kuwait 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Cyber First Kuwait 2026 — the 3rd Annual Cybersecurity Summit — takes place on 9 June 2026 at Jumeirah Messilah Beach Hotel & Spa, Kuwait City.",
                },
              },
              {
                "@type": "Question",
                name: "Where is Cyber First Kuwait 2026 held?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "At Jumeirah Messilah Beach Hotel & Spa in Kuwait City, Kuwait. Venue logistics and agenda are shared with registered delegates.",
                },
              },
              {
                "@type": "Question",
                name: "Who attends Cyber First Kuwait 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "500+ CISOs, government cyber leaders, and enterprise security executives from across Kuwait and the GCC. Attendance is invitation-only and curated for senior security leadership.",
                },
              },
              {
                "@type": "Question",
                name: "Is there a fee to attend Cyber First Kuwait 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Attendance is free for qualified end-users (CISOs and security leaders). Apply via the registration form on the event page; the advisory team will confirm eligibility.",
                },
              },
              {
                "@type": "Question",
                name: "How do I register or sponsor Cyber First Kuwait 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Use the registration form on the event page to apply as a delegate. For sponsorship or partnership enquiries, contact partnerships@eventsfirstgroup.com.",
                },
              },
            ],
          }),
        }}
      />
      <EventFactBlock
        eventName="Cyber First Kuwait 2026, 3rd Annual Cybersecurity Summit"
        series="Cyber First"
        date="9 June 2026"
        venue="Jumeirah Messilah Beach Hotel & Spa"
        city="Kuwait City"
        country="Kuwait"
        format="in-person"
        audienceSize="500+ delegates"
        audienceTypes={["CISOs", "Government cyber leaders", "Banking and fintech security heads", "Telecom security leaders", "Enterprise security executives"]}
        topSpeakers={[
          { name: "Faissal Al-Roumi", title: "Executive Manager of Operational Risk", org: "Burgan Bank" },
          { name: "Dr. Fai Ben Salamah", title: "Cybersecurity Expert", org: "Kuwait Technical College" },
          { name: "Shaheela Banu A. Majeed", title: "Information Security & Compliance Officer & Auditor", org: "Oil & Gas (Confidential)" },
          { name: "Yousef El-Kourdi", title: "Group Head of Information Technology", org: "City Group Co. KSC" },
        ]}
        topSponsors={[
          { name: "Palo Alto Networks", tier: "Gold" },
          { name: "SentinelOne", tier: "Gold" },
          { name: "Google Cloud", tier: "Gold" },
        ]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
