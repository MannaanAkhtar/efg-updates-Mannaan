import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first/qatar-2026`;
const OG_IMAGE = `${BASE_URL}/og-default.png`;

export const metadata: Metadata = {
  title: "Cyber First Qatar 2026 | Cybersecurity Summit Doha, September",
  description:
    "Qatar's leading cybersecurity platform for CISOs, government security leaders, and enterprise defenders. 22 September 2026, Doha.",
  keywords: [
    "cybersecurity conference Qatar 2026",
    "CISO summit Doha",
    "cyber security event Qatar",
    "Cyber First Qatar",
    "cybersecurity summit Doha",
    "information security conference Qatar",
    "enterprise security Qatar",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Cyber First Qatar 2026, Doha",
    description: "Qatar's premier cybersecurity summit. 22 September 2026, Doha.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Cyber First Qatar 2026" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Cyber First Qatar 2026, Doha",
    description: "Qatar's premier cybersecurity summit. 22 September 2026, Doha.",
    images: [OG_IMAGE],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: BASE_URL },
        { name: "Events", url: `${BASE_URL}/events` },
        { name: "Cyber First", url: `${BASE_URL}/events/cyber-first` },
        { name: "Qatar 2026", url: PAGE_URL },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Event",
        name: "Cyber First Qatar 2026", description: "Qatar's leading cybersecurity platform for CISOs, government security leaders, and enterprise defenders.",
        startDate: "2026-09-22T09:00:00+03:00", eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: "Doha", address: { "@type": "PostalAddress", addressLocality: "Doha", addressCountry: "QA" } },
        organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL },
        offers: { "@type": "Offer", url: PAGE_URL, availability: "https://schema.org/InStock", price: "0", priceCurrency: "USD", validFrom: "2026-01-01" },
      }) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "When is Cyber First Qatar 2026?", acceptedAnswer: { "@type": "Answer", text: "Cyber First Qatar 2026 takes place on 22 September 2026 in Doha, Qatar." } },
              { "@type": "Question", name: "Where is Cyber First Qatar 2026 held?", acceptedAnswer: { "@type": "Answer", text: "The summit is held in Doha, Qatar. The exact venue is confirmed to registered delegates closer to the event date." } },
              { "@type": "Question", name: "Who attends Cyber First Qatar 2026?", acceptedAnswer: { "@type": "Answer", text: "CISOs, government security leaders, regulators, and enterprise defenders across Qatar's banking, energy, telecom, and public sectors. Attendance is invitation-only." } },
              { "@type": "Question", name: "Is there a fee to attend Cyber First Qatar 2026?", acceptedAnswer: { "@type": "Answer", text: "Attendance is free for qualified delegates. Apply via the registration form on the event page; the advisory team will confirm eligibility." } },
              { "@type": "Question", name: "How do I register or sponsor Cyber First Qatar 2026?", acceptedAnswer: { "@type": "Answer", text: "Register via the form on this page. For sponsorship, partnership, or speaking enquiries, contact partnerships@eventsfirstgroup.com." } },
            ],
          }),
        }}
      />
      <EventFactBlock
        eventName="Cyber First Qatar 2026"
        series="Cyber First"
        date="22 September 2026"
        city="Doha"
        country="Qatar"
        format="in-person"
        audienceTypes={["CISOs", "Government security leaders", "Regulators", "Banking and financial security heads", "Energy sector defenders", "Telecom security leaders"]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
