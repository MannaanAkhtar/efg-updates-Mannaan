import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/data-ai-first/qatar-2026`;
const OG_IMAGE = `${BASE_URL}/og-default.png`;

export const metadata: Metadata = {
  title: "Digital First Qatar 2026 | Data & AI Summit Doha, September",
  description:
    "AI governance, data platforms, and enterprise intelligence, built for Qatar's digital vision. 23 September 2026, Doha.",
  keywords: [
    "data AI summit Qatar 2026",
    "AI conference Doha",
    "digital transformation Qatar",
    "Digital First Qatar",
    "enterprise AI Doha",
    "data strategy summit Qatar",
    "machine learning conference Qatar",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Digital First Qatar 2026, Doha",
    description: "Data & AI summit. 23 September 2026, Doha, Qatar.",
    url: PAGE_URL, siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Digital First Qatar 2026" }],
    locale: "en_US", type: "website",
  },
  twitter: { card: "summary_large_image", title: "Digital First Qatar 2026, Doha", description: "Data & AI summit. 23 September 2026, Doha.", images: [OG_IMAGE] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: BASE_URL }, { name: "Events", url: `${BASE_URL}/events` }, { name: "Digital First", url: `${BASE_URL}/events/data-ai-first` }, { name: "Qatar 2026", url: PAGE_URL }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: "Digital First Qatar 2026", description: "AI governance, data platforms, and enterprise intelligence, built for Qatar's digital vision.", startDate: "2026-09-23T09:00:00+03:00", eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: "Doha", address: { "@type": "PostalAddress", addressLocality: "Doha", addressCountry: "QA" } }, organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL }, offers: { "@type": "Offer", url: PAGE_URL, availability: "https://schema.org/PreOrder" } }) }} />
      {children}
    </>
  );
}
