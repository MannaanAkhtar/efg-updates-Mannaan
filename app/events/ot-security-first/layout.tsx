import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/ot-security-first`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title: "OT Security First | Industrial Cybersecurity Summit UAE & Saudi Arabia",
  description:
    "The premier OT/ICS security summit series in UAE and Saudi Arabia. For critical infrastructure defenders and OT security experts. Register or sponsor now.",
  keywords: [
    "OT security summit UAE",
    "industrial cybersecurity conference Middle East",
    "ICS security event Saudi Arabia",
    "SCADA security summit GCC",
    "critical infrastructure security Dubai",
    "OT Security First",
    "operational technology security",
    "industrial control systems conference",
    "OT cyber defense",
    "energy sector cybersecurity",
    "oil gas cybersecurity",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "OT Security First Series, Industrial Cybersecurity Summit",
    description:
      "OT/ICS security leaders and critical infrastructure defenders. Protecting the systems that power our world.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "OT Security First Series, Industrial Cybersecurity Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "OT Security First Series, Industrial Cybersecurity Summit",
    description:
      "OT/ICS security leaders protecting critical infrastructure.",
    images: [OG_IMAGE],
  },
};

export default function OTSecurityFirstLayout({
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
          { name: "OT Security First", url: PAGE_URL },
        ]}
      />
      {/* EventSeries structured data, JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EventSeries",
            name: "OT Security First Series",
            description:
              "The industrial cybersecurity summit series bringing together OT/ICS security leaders, critical infrastructure defenders, and industrial cybersecurity experts.",
            url: PAGE_URL,
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
            },
            keywords:
              "OT security, ICS security, industrial cybersecurity, SCADA, critical infrastructure, operational technology",
          }),
        }}
      />
      {children}
    </>
  );
}
