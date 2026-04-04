import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/data-ai-first`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title: "Digital First | AI Summit Dubai & Kuwait | CDO Conference Middle East",
  description:
    "The premier Data & AI leadership summit series in the Middle East. For CDOs, AI architects, and enterprise leaders. Register or sponsor now.",
  keywords: [
    "AI summit Dubai",
    "data AI conference Middle East",
    "CDO summit GCC",
    "artificial intelligence conference Kuwait",
    "data analytics conference UAE",
    "machine learning summit",
    "Data AI First",
    "enterprise AI conference",
    "data leadership summit",
    "AI event series",
    "chief data officer conference",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Digital First Series, The Premier Data & AI Leadership Summit",
    description:
      "CDOs, AI architects, and enterprise leaders. Intelligence amplified, shaping the AI-driven future.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Digital First Series, Data & AI Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Digital First Series, The Premier Data & AI Leadership Summit",
    description:
      "CDOs, AI architects, and enterprise leaders shaping the AI-driven future.",
    images: [OG_IMAGE],
  },
};

export default function DataAIFirstLayout({
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
          { name: "Digital First", url: PAGE_URL },
        ]}
      />
      {/* EventSeries structured data, JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EventSeries",
            name: "Digital First Series",
            description:
              "The premier Data & AI leadership summit series bringing together CDOs, AI architects, data scientists, and enterprise leaders to shape the AI-driven future.",
            url: PAGE_URL,
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
            },
            keywords:
              "data, AI, artificial intelligence, CDO, machine learning, data analytics, enterprise AI",
          }),
        }}
      />
      {children}
    </>
  );
}
