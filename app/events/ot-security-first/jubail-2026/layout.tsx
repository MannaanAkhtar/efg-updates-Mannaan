import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/ot-security-first/jubail-2026`;
const OG_IMAGE = `${BASE_URL}/og-default.png`;

export const metadata: Metadata = {
  title: "OT Security Jubail 2026 | Industrial Security Summit, October",
  description:
    "Bridging IT and OT security for critical infrastructure, focused on Jubail's industrial heartland. 7 October 2026, Jubail, Saudi Arabia.",
  keywords: [
    "OT security summit Jubail 2026",
    "industrial cybersecurity Saudi Arabia",
    "critical infrastructure security",
    "OT Security First",
    "SCADA security summit",
    "industrial control systems security",
    "IT OT convergence Saudi",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "OT Security Jubail 2026",
    description: "Industrial security summit. 7 October 2026, Jubail, Saudi Arabia.",
    url: PAGE_URL, siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "OT Security Jubail 2026" }],
    locale: "en_US", type: "website",
  },
  twitter: { card: "summary_large_image", site: "@eventsfirstgrp", title: "OT Security Jubail 2026", description: "Industrial security summit. 7 October 2026, Jubail.", images: [OG_IMAGE] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: BASE_URL }, { name: "Events", url: `${BASE_URL}/events` }, { name: "OT Security First", url: `${BASE_URL}/events/ot-security-first` }, { name: "Jubail 2026", url: PAGE_URL }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: "OT Security Jubail 2026", description: "Bridging IT and OT security for critical infrastructure in Jubail's industrial heartland.", startDate: "2026-10-07T09:00:00+03:00", eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: "Jubail", address: { "@type": "PostalAddress", addressLocality: "Jubail", addressCountry: "SA" } }, organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL }, offers: { "@type": "Offer", url: PAGE_URL, availability: "https://schema.org/InStock", price: "0", priceCurrency: "USD", validFrom: "2026-01-01" } }) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "When is OT Security Jubail 2026?", acceptedAnswer: { "@type": "Answer", text: "OT Security Jubail 2026 takes place on 7 October 2026 in Jubail, Saudi Arabia." } },
              { "@type": "Question", name: "Where is OT Security Jubail 2026 held?", acceptedAnswer: { "@type": "Answer", text: "In Jubail, Saudi Arabia — the heart of the kingdom's industrial corridor. The exact venue is confirmed to registered delegates closer to the event date." } },
              { "@type": "Question", name: "Who attends OT Security Jubail 2026?", acceptedAnswer: { "@type": "Answer", text: "OT/ICS security leaders, plant CISOs, and engineering directors from energy, petrochemicals, and utilities operators across Saudi Arabia's industrial heartland. Attendance is invitation-only." } },
              { "@type": "Question", name: "Is there a fee to attend OT Security Jubail 2026?", acceptedAnswer: { "@type": "Answer", text: "Attendance is free for qualified delegates. Apply via the registration form on the event page; the advisory team will confirm eligibility." } },
              { "@type": "Question", name: "How do I register or sponsor OT Security Jubail 2026?", acceptedAnswer: { "@type": "Answer", text: "Register via the form on this page. For sponsorship, partnership, or speaking enquiries, contact partnerships@eventsfirstgroup.com." } },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
