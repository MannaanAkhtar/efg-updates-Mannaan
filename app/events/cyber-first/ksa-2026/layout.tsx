import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first/ksa-2026`;
const OG_IMAGE = `${BASE_URL}/og-default.png`;

export const metadata: Metadata = {
  title: "Digital Resilience KSA 2026 | Cybersecurity Summit Riyadh, October",
  description:
    "Saudi Arabia's premier digital resilience summit, national strategy, threat intelligence, and enterprise continuity. 10 October 2026, Riyadh.",
  keywords: [
    "digital resilience Saudi Arabia 2026",
    "cybersecurity summit Riyadh",
    "CISO summit KSA",
    "cyber security event Saudi",
    "Digital Resilience KSA",
    "enterprise security Saudi Arabia",
    "threat intelligence Riyadh",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Digital Resilience KSA 2026, Riyadh",
    description: "Saudi Arabia's premier digital resilience summit. 10 October 2026, Riyadh.",
    url: PAGE_URL, siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Digital Resilience KSA 2026" }],
    locale: "en_US", type: "website",
  },
  twitter: { card: "summary_large_image", site: "@eventsfirstgrp", title: "Digital Resilience KSA 2026, Riyadh", description: "Saudi Arabia's premier digital resilience summit. 10 October 2026, Riyadh.", images: [OG_IMAGE] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: BASE_URL }, { name: "Events", url: `${BASE_URL}/events` }, { name: "Cyber First", url: `${BASE_URL}/events/cyber-first` }, { name: "KSA 2026", url: PAGE_URL }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: "Digital Resilience KSA 2026", description: "Saudi Arabia's premier digital resilience summit, national strategy, threat intelligence, and enterprise continuity.", startDate: "2026-10-10T09:00:00+03:00", eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: "Riyadh", address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" } }, organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL }, offers: { "@type": "Offer", url: PAGE_URL, availability: "https://schema.org/InStock", price: "0", priceCurrency: "USD", validFrom: "2026-01-01" } }) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "When is Digital Resilience KSA 2026?", acceptedAnswer: { "@type": "Answer", text: "Digital Resilience KSA 2026 takes place on 10 October 2026 in Riyadh, Saudi Arabia." } },
              { "@type": "Question", name: "Where is Digital Resilience KSA 2026 held?", acceptedAnswer: { "@type": "Answer", text: "The summit is held in Riyadh, Saudi Arabia. The exact venue is confirmed to registered delegates closer to the event date." } },
              { "@type": "Question", name: "Who attends Digital Resilience KSA 2026?", acceptedAnswer: { "@type": "Answer", text: "CISOs, government cyber leaders, regulators, and enterprise security executives shaping Saudi Arabia's national digital resilience strategy. Attendance is invitation-only." } },
              { "@type": "Question", name: "Is there a fee to attend Digital Resilience KSA 2026?", acceptedAnswer: { "@type": "Answer", text: "Attendance is free for qualified delegates. Apply via the registration form on the event page; the advisory team will confirm eligibility." } },
              { "@type": "Question", name: "How do I register or sponsor Digital Resilience KSA 2026?", acceptedAnswer: { "@type": "Answer", text: "Register via the form on this page. For sponsorship, partnership, or speaking enquiries, contact partnerships@eventsfirstgroup.com." } },
            ],
          }),
        }}
      />
      <EventFactBlock
        eventName="Digital Resilience KSA 2026"
        series="Cyber First"
        date="10 October 2026"
        city="Riyadh"
        country="Saudi Arabia"
        format="in-person"
        audienceTypes={["CISOs", "Government cyber leaders", "Regulators", "Enterprise security executives", "Critical-infrastructure operators"]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
