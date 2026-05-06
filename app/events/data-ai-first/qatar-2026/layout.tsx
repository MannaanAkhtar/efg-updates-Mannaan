import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

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
  twitter: { card: "summary_large_image", site: "@eventsfirstgrp", title: "Digital First Qatar 2026, Doha", description: "Data & AI summit. 23 September 2026, Doha.", images: [OG_IMAGE] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: BASE_URL }, { name: "Events", url: `${BASE_URL}/events` }, { name: "Digital First", url: `${BASE_URL}/events/data-ai-first` }, { name: "Qatar 2026", url: PAGE_URL }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: "Digital First Qatar 2026", description: "AI governance, data platforms, and enterprise intelligence, built for Qatar's digital vision.", startDate: "2026-09-23T09:00:00+03:00", eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: "Doha", address: { "@type": "PostalAddress", addressLocality: "Doha", addressCountry: "QA" } }, organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL }, offers: { "@type": "Offer", url: PAGE_URL, availability: "https://schema.org/InStock", price: "0", priceCurrency: "USD", validFrom: "2026-01-01" } }) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "When is Digital First Qatar 2026?", acceptedAnswer: { "@type": "Answer", text: "Digital First Qatar 2026 takes place on 23 September 2026 in Doha, Qatar." } },
              { "@type": "Question", name: "Where is Digital First Qatar 2026 held?", acceptedAnswer: { "@type": "Answer", text: "The summit is held in Doha, Qatar. The exact venue is confirmed to registered delegates closer to the event date." } },
              { "@type": "Question", name: "Who attends Digital First Qatar 2026?", acceptedAnswer: { "@type": "Answer", text: "CDOs, AI architects, data leaders, and enterprise transformation executives shaping Qatar's national digital agenda. Attendance is invitation-only." } },
              { "@type": "Question", name: "Is there a fee to attend Digital First Qatar 2026?", acceptedAnswer: { "@type": "Answer", text: "Attendance is free for qualified delegates. Apply via the registration form on the event page; the advisory team will confirm eligibility." } },
              { "@type": "Question", name: "How do I register or sponsor Digital First Qatar 2026?", acceptedAnswer: { "@type": "Answer", text: "Register via the form on this page. For sponsorship, partnership, or speaking enquiries, contact partnerships@eventsfirstgroup.com." } },
            ],
          }),
        }}
      />
      <EventFactBlock
        eventName="Digital First Qatar 2026"
        series="Digital First"
        date="23 September 2026"
        city="Doha"
        country="Qatar"
        format="in-person"
        audienceTypes={["CDOs", "AI architects", "Data leaders", "Enterprise transformation executives", "Digital strategy directors"]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
