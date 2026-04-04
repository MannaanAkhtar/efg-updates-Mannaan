import type { Metadata } from "next";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/sonicwall`;

export const metadata: Metadata = {
  title: "Beyond the Firewall: Strategic Security Conversations | SonicWall x EFG",
  description:
    "A 90-minute virtual roundtable for IT and security leaders. Cut through the noise. Focus on what actually works. May 13, 2026.",
  keywords: [
    "SonicWall webinar",
    "cybersecurity webinar",
    "firewall security",
    "security operations",
    "threat landscape",
    "unified management",
    "SonicWall platform",
    "cyber protect report",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Beyond the Firewall: Strategic Security Conversations",
    description: "Cut through the noise. Focus on what actually works. May 13, 2026, 90 min virtual roundtable.",
    url: PAGE_URL,
    siteName: "Events First Group",
    locale: "en_US",
    type: "website",
  },
};

export default function SonicWallLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Beyond the Firewall: Strategic Security Conversations",
            description: "A 90-minute virtual roundtable for IT and security leaders on cybersecurity strategy.",
            startDate: "2026-05-13T11:00:00+04:00",
            endDate: "2026-05-13T12:30:00+04:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            location: { "@type": "VirtualLocation", url: PAGE_URL },
            organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL },
            sponsor: { "@type": "Organization", name: "SonicWall", url: "https://www.sonicwall.com/" },
          }),
        }}
      />
      {children}
    </>
  );
}
