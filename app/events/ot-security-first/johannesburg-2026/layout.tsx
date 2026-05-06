import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/ot-security-first/johannesburg-2026`;
const OG_IMAGE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title:
    "OT Security First Africa 2026 | Johannesburg — Uncompromised OT Security",
  description:
    "Africa's premier OT/ICS security summit, Johannesburg, 26 August 2026. 200+ delegates and 20+ speakers from energy, utilities, and critical infrastructure.",
  keywords: [
    "OT security conference South Africa 2026",
    "industrial cybersecurity summit Johannesburg",
    "ICS security event Africa",
    "SCADA security summit South Africa",
    "critical infrastructure security Johannesburg",
    "OT Security First Africa",
    "operational technology security",
    "mining cybersecurity South Africa",
    "Eskom cybersecurity",
    "Transnet cybersecurity",
    "POPIA compliance OT",
    "industrial control systems conference Africa",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "OT Security First Africa 2026 — Johannesburg",
    description:
      "Uncompromised OT Security. 200+ delegates, 26 August 2026, Johannesburg. Protecting what Powers our World.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "OT Security First South Africa 2026 — Industrial Cybersecurity Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OT Security First Africa 2026 — Johannesburg",
    description:
      "Uncompromised OT Security. 200+ delegates, 26 August 2026, Johannesburg.",
    images: [OG_IMAGE],
  },
};

export default function OTSecurityFirstJohannesburgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Events", url: `${BASE_URL}/events` },
          {
            name: "OT Security First",
            url: `${BASE_URL}/events/ot-security-first`,
          },
          { name: "Johannesburg 2026", url: PAGE_URL },
        ]}
      />
      {/* Event structured data — JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "OT Security First Africa 2026 — Johannesburg",
            description:
              "Uncompromised OT Security - Protecting what Powers our World. Cross-sector collaboration between technology experts, OT leaders, government and policy makers.",
            startDate: "2026-08-26T08:30:00+02:00",
            endDate: "2026-08-26T18:00:00+02:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Johannesburg",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Johannesburg",
                addressRegion: "Gauteng",
                addressCountry: "ZA",
              },
            },
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
            },
            offers: {
              "@type": "Offer",
              url: PAGE_URL,
              availability: "https://schema.org/InStock",
              validFrom: "2025-01-01",
            },
            typicalAgeRange: "25-",
            keywords:
              "OT security, ICS security, industrial cybersecurity, SCADA, South Africa, Johannesburg, mining cybersecurity, critical infrastructure, Eskom, Transnet",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "When is OT Security First Africa 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "OT Security First Africa 2026 takes place on 26 August 2026 in Johannesburg, South Africa.",
                },
              },
              {
                "@type": "Question",
                name: "Where is OT Security First Africa 2026 held?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "In Johannesburg, Gauteng, South Africa. The exact venue is confirmed to registered delegates closer to the event date.",
                },
              },
              {
                "@type": "Question",
                name: "Who attends OT Security First Africa 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "200+ OT/ICS security leaders, CISOs, and engineering directors from energy (Eskom-tier), mining, transport (Transnet-tier), water, and government across South Africa and the broader continent. 20+ speakers across cross-sector tracks.",
                },
              },
              {
                "@type": "Question",
                name: "Is there a fee to attend OT Security First Africa 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Attendance is free for qualified delegates. Apply via the registration form on the event page; the advisory team will confirm eligibility.",
                },
              },
              {
                "@type": "Question",
                name: "How do I register or sponsor OT Security First Africa 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Register via the form on this page. For sponsorship, partnership, or speaking enquiries, contact partnerships@eventsfirstgroup.com.",
                },
              },
            ],
          }),
        }}
      />
      <EventFactBlock
        eventName="OT Security First Africa 2026, Johannesburg"
        series="OT Security First"
        date="26 August 2026"
        city="Johannesburg"
        country="South Africa"
        format="in-person"
        audienceSize="200+ delegates and 20+ speakers"
        audienceTypes={["OT/ICS security leaders", "Plant CISOs", "Energy security heads (Eskom-tier)", "Mining cybersecurity directors", "Transport security leaders (Transnet-tier)", "Water utility security executives", "POPIA compliance officers", "Government cyber policy makers"]}
        topSpeakers={[
          { name: "Akash Makhan", title: "OT/IT Convergence (Digital Transformation)", org: "Eskom Holdings SOC Ltd" },
          { name: "Zanele Fikizolo", title: "Senior Advisor – IT Governance, Risk and Compliance", org: "Eskom Holdings SOC Ltd" },
          { name: "Muvhango Livhusha", title: "Vice President", org: "ISACA South Africa Chapter" },
          { name: "Tendani Silima", title: "Senior Advisor Cybersecurity", org: "Eskom Holdings SOC Ltd" },
          { name: "Xolani Nzimande", title: "OT Cybersecurity Specialist", org: "Sasol" },
        ]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
