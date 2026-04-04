import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first/kenya-2026`;
const OG_IMAGE = `${BASE_URL}/Cyber-First-East-Africa-Logo-01.png`;

export const metadata: Metadata = {
  title: "Cyber First Kenya 2026 | Nairobi | Beyond Firewalls, July 2026",
  description:
    "East Africa's premier cybersecurity summit. 300+ CISOs and security leaders. July 2026, Nairobi. Register or sponsor now.",
  keywords: [
    "cybersecurity conference Kenya 2026",
    "CISO summit Kenya",
    "cyber security event Nairobi",
    "cybersecurity summit East Africa",
    "information security conference Kenya",
    "Cyber First Kenya",
    "cybersecurity event July 2026",
    "enterprise security summit Africa",
    "Kenya cybersecurity leaders",
    "Silicon Savannah security",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Cyber First Kenya 2026, Nairobi Edition",
    description:
      "300+ CISOs and security leaders. July 2026, Nairobi. Beyond Firewalls, Strategic Cyber Defense for Kenya's Digital Age.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Cyber First Kenya 2026, Cybersecurity Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber First Kenya 2026, Nairobi Edition",
    description:
      "300+ CISOs and security leaders. July 2026, Nairobi, The Silicon Savannah.",
    site: "@eventsfirstgrp",
    images: [OG_IMAGE],
  },
};

export default function CyberFirstKenyaLayout({
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
          { name: "Kenya 2026", url: PAGE_URL },
        ]}
      />
      {/* Event structured data, JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Cyber First Kenya 2026, Nairobi Edition",
            description:
              "East Africa's premier cybersecurity leadership summit bringing together CISOs, government leaders, and enterprise security executives. Beyond Firewalls, Strategic Cyber Defense for Kenya's Digital Age.",
            startDate: "2026-07-01T08:30:00+03:00",
            endDate: "2026-07-01T18:00:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Nairobi",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nairobi",
                addressCountry: "KE",
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
              "cybersecurity, CISO, information security, Kenya, Nairobi, East Africa, cyber summit, enterprise security, Silicon Savannah",
          }),
        }}
      />
      {/* FAQ structured data for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "When and where is Cyber First Kenya 2026?",
                acceptedAnswer: { "@type": "Answer", text: "Cyber First Kenya 2026 takes place in July 2026 in Nairobi, Kenya. It is a full-day cybersecurity summit running from 08:30 to 15:00 EAT." },
              },
              {
                "@type": "Question",
                name: "Who should attend Cyber First Kenya 2026?",
                acceptedAnswer: { "@type": "Answer", text: "The summit is designed for CISOs, CIOs, government cyber leaders, critical infrastructure operators, fintech and mobile money leaders, telecom security professionals, and risk and compliance officers. 300+ senior decision-makers are expected." },
              },
              {
                "@type": "Question",
                name: "How much does it cost to attend Cyber First Kenya?",
                acceptedAnswer: { "@type": "Answer", text: "Cyber First Kenya is an invite-only summit. Qualified delegates can request a complimentary pass through the registration form on the event page." },
              },
              {
                "@type": "Question",
                name: "What topics are covered at Cyber First Kenya 2026?",
                acceptedAnswer: { "@type": "Answer", text: "Key topics include Safeguarding National Critical Infrastructure, Regulatory Governance and Data Privacy, Cloud Security and Zero Trust Architecture, Cybersecurity Talent Development, AI-Powered Threat Intelligence, and Geopolitical Cyber Partnerships across East Africa." },
              },
              {
                "@type": "Question",
                name: "How can my company sponsor Cyber First Kenya 2026?",
                acceptedAnswer: { "@type": "Answer", text: "Sponsorship packages include keynote slots, exhibition space, boardroom hosting, and access to 300+ senior cybersecurity leaders across East Africa. Contact partnerships@eventsfirstgroup.com or submit a sponsorship inquiry on the event page." },
              },
              {
                "@type": "Question",
                name: "What are the Cyber First Awards East Africa?",
                acceptedAnswer: { "@type": "Answer", text: "The Cyber First Awards East Africa 2026 recognise excellence across 6 categories: Cybersecurity Innovation, Cyber Resilience, Emerging Leader, Public Sector Achievement, Zero Trust Pioneer, and Sentinel of Critical Infrastructure. Nominations are open on the event page." },
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
