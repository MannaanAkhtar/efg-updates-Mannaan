import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/sonicwall-7sept`;
// TODO: replace with a designed 1200×630 share card once available.
// Hero image used as the best available event-specific asset for now.
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/sonicwall_hero.png";

export const metadata: Metadata = {
  title: "Cyber Resilience in the Age of Real-Time Threats | SonicWall x EFG",
  description:
    "An executive roundtable for cybersecurity leaders — closing the gap between attack speed and response. 7 September 2026, 10:00 AM KSA. Presentation followed by lunch.",
  keywords: [
    "SonicWall roundtable",
    "cyber resilience",
    "beyond the firewall",
    "cloud-managed perimeter security",
    "Cloud Secure Edge",
    "ZTNA",
    "SASE",
    "managed security services SOC MDR MXDR",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Cyber Resilience in the Age of Real-Time Threats",
    description: "Closing the Gap Between Attack Speed and Response. An executive roundtable — 7 September 2026, 10:00 AM KSA.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Cyber Resilience in the Age of Real-Time Threats — SonicWall × EFG, 7 September 2026" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Cyber Resilience in the Age of Real-Time Threats",
    description: "Closing the Gap Between Attack Speed and Response. An executive roundtable — 7 September 2026, 10:00 AM KSA.",
    images: [OG_IMAGE],
  },
};

export default function SonicWall7SeptLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Cyber Resilience in the Age of Real-Time Threats",
            description: "An executive roundtable for cybersecurity leaders on modernising security beyond the firewall — cloud-managed perimeter security, Cloud Secure Edge, ZTNA, SASE, and managed security services.",
            startDate: "2026-09-07T10:00:00+03:00",
            endDate: "2026-09-07T14:00:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "InterContinental Riyadh by IHG",
              address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
            },
            organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL },
            sponsor: { "@type": "Organization", name: "SonicWall", url: "https://www.sonicwall.com/" },
          }),
        }}
      />
      {children}
    </>
  );
}
