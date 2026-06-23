import { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://www.eventsfirstgroup.com";
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title: "Events Calendar 2026 | Executive Technology Summits | Events First Group",
  description:
    "Browse 9 executive technology summits across Kuwait, Qatar, Saudi Arabia, Oman and UAE in 2026. For CISOs, CDOs, and enterprise leaders.",
  keywords: [
    "technology events 2026",
    "cybersecurity conference Middle East",
    "CISO summit Gulf",
    "enterprise technology events Dubai",
    "OT security conference Saudi Arabia",
    "data AI summit Kuwait",
    "executive technology summit",
  ],
  alternates: {
    canonical: `${BASE_URL}/events`,
  },
  openGraph: {
    title: "Events Calendar 2026 | Events First Group",
    description:
      "9 executive summits across the Middle East, Cybersecurity, OT Security, Data & AI, and Opex. For CISOs, CDOs, and enterprise leaders.",
    url: `${BASE_URL}/events`,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Events First Group, 2026 Events Calendar",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Events Calendar 2026 | Events First Group",
    description:
      "9 executive technology summits for CISOs, CDOs, and enterprise leaders across the Middle East.",
    images: [OG_IMAGE],
  },
};

const events: Array<{ name: string; path: string; series: string }> = [
  { name: "Cyber First", path: "/events/cyber-first", series: "Cyber First" },
  { name: "Cyber First Kenya 2026", path: "/events/cyber-first/kenya-2026", series: "Cyber First" },
  { name: "Cyber First Kuwait 2026", path: "/events/cyber-first/kuwait-2026", series: "Cyber First" },
  { name: "Cyber First Qatar 2026", path: "/events/cyber-first/qatar", series: "Cyber First" },
  { name: "OT Security First", path: "/events/ot-security-first", series: "OT Security First" },
  { name: "OT Security First Johannesburg 2026", path: "/events/ot-security-first/johannesburg-2026", series: "OT Security First" },
  { name: "OT Security First Jubail 2026", path: "/events/ot-security-first/jubail", series: "OT Security First" },
  { name: "OT Security First Oman 2026", path: "/events/ot-security-first/oman-2026", series: "OT Security First" },
  { name: "OT Security First Virtual Boardroom MENA 2026", path: "/events/ot-security-first/virtual-boardroom-mena", series: "OT Security First" },
  { name: "Digital First", path: "/events/data-ai-first", series: "Digital First" },
  { name: "OPEX First", path: "/events/opex-first", series: "OPEX First" },
  { name: "OPEX First Saudi 2026", path: "/events/opex-first/saudi-2026", series: "OPEX First" },
  { name: "OPEX First Process Intelligence MENA 2026", path: "/events/opex-first/process-intelligence", series: "OPEX First" },
];

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Events First Group — 2026 Calendar",
  description:
    "Executive technology summits and boardrooms produced by Events First Group across the Middle East, Africa, and Asia in 2026.",
  url: `${BASE_URL}/events`,
  numberOfItems: events.length,
  itemListElement: events.map((event, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${BASE_URL}${event.path}`,
    item: {
      "@type": "Event",
      name: event.name,
      url: `${BASE_URL}${event.path}`,
      organizer: {
        "@type": "Organization",
        name: "Events First Group",
        url: BASE_URL,
      },
    },
  })),
};

export default function EventsLayout({
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
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {children}
    </>
  );
}
