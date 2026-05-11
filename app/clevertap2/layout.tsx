import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-opensans",
  display: "swap",
});

const BASE_URL = "https://www.eventsfirstgroup.com";
// Public, brand-aligned URL. /clevertap2 stays accessible as a sandbox path
// (via the next.config.ts rewrite) but canonical + OG + JSON-LD point here.
const PAGE_URL = `${BASE_URL}/beyond-automation-by-clevertap`;
// TODO: replace with a designed 1200×630 share card once available.
// CleverTap brand logo used as best available event-specific asset for now.
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/CleverTap_Logotype.png";

export const metadata: Metadata = {
  title: "Beyond Automation: AI Agents at Scale | CleverTap x EFG",
  description:
    "A 90-minute virtual roundtable for marketing and CRM leaders. See how AI Agents deliver true 1:1 personalization across every channel. June 10, 2026.",
  keywords: [
    "CleverTap webinar",
    "AI agents marketing",
    "1:1 personalization",
    "agentic AI",
    "CleverAI Decisioning Engine",
    "CRM leaders",
    "lifecycle engagement",
    "customer retention Middle East",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Beyond Automation: How AI Agents Deliver True 1:1 Engagement at Scale",
    description: "See how AI Agents make true 1:1 personalization possible — across every channel, every moment. June 10, 2026 — 90 min virtual roundtable.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Beyond Automation: AI Agents at Scale — CleverTap × EFG, 10 June 2026" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Beyond Automation: AI Agents at Scale — CleverTap × EFG",
    description: "See how AI Agents make true 1:1 personalization possible — across every channel, every moment. June 10, 2026 — 90 min virtual roundtable.",
    images: [OG_IMAGE],
  },
};

export default function CleverTapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={openSans.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Beyond Automation: How AI Agents Deliver True 1:1 Engagement at Scale",
            description: "A 90-minute virtual roundtable for marketing, CRM, and growth leaders on AI Agents and true 1:1 personalization, powered by CleverAI's Decisioning Engine and Agentic Universe.",
            startDate: "2026-06-10T11:00:00+04:00",
            endDate: "2026-06-10T12:30:00+04:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            location: { "@type": "VirtualLocation", url: PAGE_URL },
            organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL },
            sponsor: { "@type": "Organization", name: "CleverTap", url: "https://www.clevertap.com/" },
          }),
        }}
      />
      {children}
    </div>
  );
}
