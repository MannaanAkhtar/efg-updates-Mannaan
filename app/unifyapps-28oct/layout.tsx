import type { Metadata } from "next";
import { Inter, Spectral } from "next/font/google";

// UnifyApps' own event pages set headings and body copy in Spectral, with
// Inter for small utility text.
const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ua-inter",
  display: "swap",
});

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/unifyapps-28oct`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/heros/b2.png";

export const metadata: Metadata = {
  title: "Building AI-Native Organizations | UnifyApps Executive Boardroom, Dubai",
  description:
    "An executive boardroom for airlines, ports, energy and contracting leaders, hosted by UnifyApps. Wednesday, 28 October 2026, 3:30 PM – 7:30 PM at Five Iron Golf, The Westin Dubai Marina.",
  keywords: [
    "UnifyApps executive boardroom",
    "AI-native organizations",
    "enterprise AI Dubai",
    "airlines AI",
    "ports AI",
    "energy AI",
    "contracting AI",
    "CIO boardroom Dubai",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Building AI-Native Organizations — UnifyApps Executive Boardroom",
    description: "Airlines, Ports, Energy & Contracting. Dubai · Wednesday, 28 October 2026.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1890, height: 1063, alt: "UnifyApps Executive Boardroom, Dubai, 28 October 2026" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Building AI-Native Organizations — UnifyApps Executive Boardroom",
    description: "Airlines, Ports, Energy & Contracting. Dubai · Wednesday, 28 October 2026.",
    images: [OG_IMAGE],
  },
};

export default function UnifyApps28OctLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${spectral.variable} ${inter.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Building AI-Native Organizations — UnifyApps Executive Boardroom",
            description:
              "An executive boardroom for senior leaders across the airlines, ports, energy, and contracting sectors on moving AI from ambition and isolated pilots into real-world operations.",
            startDate: "2026-10-28T15:30:00+04:00",
            endDate: "2026-10-28T19:30:00+04:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Five Iron Golf, The Westin Dubai Marina",
              address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
            },
            image: [OG_IMAGE],
            organizer: { "@type": "Organization", name: "UnifyApps" },
            url: PAGE_URL,
          }),
        }}
      />
      {children}
    </div>
  );
}
