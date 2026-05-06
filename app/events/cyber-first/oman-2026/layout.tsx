import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first/oman-2026`;
const OG_IMAGE = `${BASE_URL}/og-default.png`;

export const metadata: Metadata = {
  title: "Cyber First Oman 2026 | Cybersecurity Summit Muscat, October",
  description:
    "Oman's premier cybersecurity summit bringing together CISOs, regulators, and security leaders. 13 October 2026, Muscat.",
  keywords: [
    "cybersecurity conference Oman 2026",
    "CISO summit Muscat",
    "cyber security event Oman",
    "Cyber First Oman",
    "cybersecurity summit Muscat",
    "information security Oman",
    "enterprise security Oman",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Cyber First Oman 2026, Muscat",
    description: "Oman's premier cybersecurity summit. 13 October 2026, Muscat.",
    url: PAGE_URL, siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Cyber First Oman 2026" }],
    locale: "en_US", type: "website",
  },
  twitter: { card: "summary_large_image", site: "@eventsfirstgrp", title: "Cyber First Oman 2026, Muscat", description: "Oman's premier cybersecurity summit. 13 October 2026, Muscat.", images: [OG_IMAGE] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: BASE_URL }, { name: "Events", url: `${BASE_URL}/events` }, { name: "Cyber First", url: `${BASE_URL}/events/cyber-first` }, { name: "Oman 2026", url: PAGE_URL }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: "Cyber First Oman 2026", description: "Oman's premier cybersecurity summit bringing together CISOs, regulators, and security leaders.", startDate: "2026-10-13T09:00:00+04:00", eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: "Muscat", address: { "@type": "PostalAddress", addressLocality: "Muscat", addressCountry: "OM" } }, organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL }, offers: { "@type": "Offer", url: PAGE_URL, availability: "https://schema.org/InStock", price: "0", priceCurrency: "USD", validFrom: "2026-01-01" } }) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "When is Cyber First Oman 2026?", acceptedAnswer: { "@type": "Answer", text: "Cyber First Oman 2026 takes place on 13 October 2026 in Muscat, Oman." } },
              { "@type": "Question", name: "Where is Cyber First Oman 2026 held?", acceptedAnswer: { "@type": "Answer", text: "The summit is held in Muscat, Oman. The exact venue is confirmed to registered delegates closer to the event date." } },
              { "@type": "Question", name: "Who attends Cyber First Oman 2026?", acceptedAnswer: { "@type": "Answer", text: "CISOs, regulators, government cyber leaders, and enterprise security executives across Oman's banking, energy, telecom, and government sectors. Attendance is invitation-only." } },
              { "@type": "Question", name: "Is there a fee to attend Cyber First Oman 2026?", acceptedAnswer: { "@type": "Answer", text: "Attendance is free for qualified delegates. Apply via the registration form on the event page; the advisory team will confirm eligibility." } },
              { "@type": "Question", name: "How do I register or sponsor Cyber First Oman 2026?", acceptedAnswer: { "@type": "Answer", text: "Register via the form on this page. For sponsorship, partnership, or speaking enquiries, contact partnerships@eventsfirstgroup.com." } },
            ],
          }),
        }}
      />
      <EventFactBlock
        eventName="Cyber First Oman 2026"
        series="Cyber First"
        date="13 October 2026"
        city="Muscat"
        country="Oman"
        format="in-person"
        audienceTypes={["CISOs", "Regulators", "Government cyber leaders", "Banking security heads", "Energy sector security leaders", "Telecom security executives"]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
