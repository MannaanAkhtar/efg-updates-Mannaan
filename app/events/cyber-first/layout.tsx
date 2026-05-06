import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { SeriesFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0030.JPG";

export const metadata: Metadata = {
  title: "Cyber First | CISO Summit Dubai & Middle East | Cybersecurity Conference",
  description:
    "The premier CISO summit series across Dubai, Kuwait, Saudi Arabia, India and Kenya. For CISOs and security leaders. Register or sponsor now.",
  keywords: [
    "CISO summit Dubai",
    "cybersecurity conference Middle East",
    "cybersecurity summit UAE",
    "CISO conference GCC",
    "cyber security events Dubai",
    "information security summit",
    "enterprise security conference",
    "Cyber First",
    "cybersecurity leadership",
    "CISO summit Middle East",
    "cybersecurity conference Africa",
    "cyber defense summit",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Cyber First Series, The Definitive Cybersecurity Summit",
    description:
      "CISOs, government cyber leaders, and security innovators across Abu Dhabi, Kuwait, Riyadh, Delhi, and Nairobi. Register for the next edition.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Cyber First Series, Cybersecurity Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Cyber First Series, The Definitive Cybersecurity Summit",
    description:
      "CISOs and security leaders across Abu Dhabi, Kuwait, Riyadh, Delhi, and Nairobi.",
    images: [OG_IMAGE],
  },
};

export default function CyberFirstLayout({
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
          { name: "Cyber First", url: PAGE_URL },
        ]}
      />
      {/* EventSeries structured data, JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EventSeries",
            name: "Cyber First Series",
            description:
              "The definitive cybersecurity summit series bringing together CISOs, government cyber leaders, and security innovators across multiple regions.",
            url: PAGE_URL,
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
            },
            location: [
              { "@type": "Place", name: "Abu Dhabi, UAE" },
              { "@type": "Place", name: "Kuwait City, Kuwait" },
              { "@type": "Place", name: "Riyadh, Saudi Arabia" },
              { "@type": "Place", name: "Delhi, India" },
              { "@type": "Place", name: "Nairobi, Kenya" },
            ],
            keywords:
              "cybersecurity, CISO, information security, cyber summit, enterprise security, government security",
          }),
        }}
      />
      <SeriesFactBlock
        seriesName="Cyber First"
        description="Cyber First is the definitive cybersecurity summit series by Events First Group, convening CISOs, government cyber leaders, regulators, and enterprise security executives across the Middle East, India, and East Africa. Each edition is invitation-only and free for qualified end-users."
        audience={["CISOs", "CIOs", "Government cyber leaders", "Regulators", "Critical-infrastructure operators", "Banking and fintech security heads", "Telecom and digital infrastructure security leaders"]}
        editions={[
          { name: "Cyber First Kuwait 2026 (3rd Annual)", city: "Kuwait City", country: "Kuwait", date: "9 June 2026", url: `${BASE_URL}/events/cyber-first/kuwait-2026` },
          { name: "Cyber First Kenya 2026, Nairobi Edition", city: "Nairobi", country: "Kenya", date: "July 2026", url: `${BASE_URL}/events/cyber-first/kenya-2026` },
          { name: "Cyber First Qatar 2026", city: "Doha", country: "Qatar", date: "22 September 2026", url: `${BASE_URL}/events/cyber-first/qatar-2026` },
          { name: "Digital Resilience KSA 2026", city: "Riyadh", country: "Saudi Arabia", date: "10 October 2026", url: `${BASE_URL}/events/cyber-first/ksa-2026` },
          { name: "Cyber First India 2026, Delhi Edition", city: "New Delhi", country: "India", date: "10 October 2026", url: `${BASE_URL}/events/cyber-first/india-2026` },
          { name: "Cyber First Oman 2026", city: "Muscat", country: "Oman", date: "13 October 2026", url: `${BASE_URL}/events/cyber-first/oman-2026` },
        ]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
