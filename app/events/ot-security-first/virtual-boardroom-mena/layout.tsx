import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/ot-security-first/virtual-boardroom-mena`;
const OG_IMAGE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/logos/Untitled-2-01.png";

export const metadata: Metadata = {
  title:
    "OT Security in the Age of AI Threats | Virtual Forum MENA 2026",
  description:
    "Closed senior-level virtual forum for OT security leaders in MENA energy and utilities. 100 professionals, 19 May 2026. Register now.",
  keywords: [
    "OT security virtual forum",
    "MENA OT cybersecurity",
    "ICS security webinar",
    "SCADA security virtual event",
    "AI threats OT",
    "critical infrastructure cybersecurity",
    "energy sector cybersecurity MENA",
    "OT Security First",
    "virtual forum 2026",
    "industrial cybersecurity webinar",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "OT Security in the Age of AI Threats, Virtual Forum MENA",
    description:
      "100 verified OT security professionals. May 19, 2026. A strategic virtual dialogue on industrial cyber resilience across MENA.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "OT Security First, Virtual Forum MENA 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "OT Security in the Age of AI Threats, Virtual Forum MENA",
    description:
      "100 verified OT security professionals. May 19, 2026, MENA Region.",
    images: [OG_IMAGE],
  },
};

export default function OTVirtualForumLayout({
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
          { name: "Virtual Forum MENA", url: PAGE_URL },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "OT Security in the Age of AI Threats, Virtual Forum MENA 2026",
            description:
              "A closed, senior-level virtual forum for OT security professionals across MENA's energy and utilities sector.",
            startDate: "2026-05-19T14:00:00+04:00",
            endDate: "2026-05-19T16:00:00+04:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OnlineEventAttendanceMode",
            location: {
              "@type": "VirtualLocation",
              url: PAGE_URL,
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
              validFrom: "2026-01-01",
            },
            typicalAgeRange: "25-",
            keywords:
              "OT security, ICS security, SCADA, AI threats, MENA, virtual forum, critical infrastructure, energy cybersecurity",
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
                name: "When is the OT Security Virtual Forum MENA 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The forum takes place online on 19 May 2026 from 14:00 to 16:00 (GST). Verified registrants receive a private joining link before the session.",
                },
              },
              {
                "@type": "Question",
                name: "Where is the OT Security Virtual Forum MENA held?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "It is a closed virtual forum — no physical venue. Verified registrants receive a private joining link before the session.",
                },
              },
              {
                "@type": "Question",
                name: "Who attends the OT Security Virtual Forum MENA?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "100 verified senior OT security professionals from MENA energy, utilities, oil & gas, and petrochemicals. The room is closed and curated; attendance is by invitation or vetted application.",
                },
              },
              {
                "@type": "Question",
                name: "Is there a fee to attend the OT Security Virtual Forum MENA?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Attendance is free. Applications are reviewed for seniority and sector fit before access is granted.",
                },
              },
              {
                "@type": "Question",
                name: "How do I register or sponsor the OT Security Virtual Forum MENA?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Apply via the registration form on this page. For sponsorship enquiries, contact partnerships@eventsfirstgroup.com.",
                },
              },
            ],
          }),
        }}
      />
      <EventFactBlock
        eventName="OT Security in the Age of AI Threats, Virtual Forum MENA 2026"
        series="OT Security First"
        date="19 May 2026"
        city="MENA Region"
        country="Online"
        format="virtual"
        audienceSize="100 verified OT security professionals"
        audienceTypes={["OT/ICS security professionals", "Energy and utilities security leaders", "Oil & gas security executives", "Petrochemicals security heads", "Critical-infrastructure operators"]}
        topSpeakers={[
          { name: "H.E. Dr. Mohamed Al Kuwaiti", title: "Head of Cyber Security", org: "United Arab Emirates Government" },
          { name: "Vijay Velayutham", title: "Principal Information Security Officer", org: "UAE Ministry of Energy & Infrastructure" },
          { name: "Dr. Shaheela Banu Abdul Majeed", title: "Information Security & Compliance Officer & Auditor", org: "Kuwait Gulf Oil Company (KGOC)" },
          { name: "Ali Abdulla Hasan Alsadadi", title: "Chief of Information Technology", org: "Ministry of Oil & Environment Bahrain" },
          { name: "Nasser Salim Al Alawi", title: "OT Cybersecurity Manager", org: "Oman LNG LLC" },
        ]}
        topSponsors={[
          { name: "FlintX", tier: "Platinum" },
          { name: "TXOne Networks", tier: "Gold" },
          { name: "Darktrace", tier: "Gold" },
        ]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
