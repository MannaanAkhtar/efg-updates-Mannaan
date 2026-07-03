import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first/kuwait-2026`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0030.JPG";

export const metadata: Metadata = {
  title: "Cyber First Kuwait 2026 | 3rd Annual Cybersecurity Summit, 14 October, Jumeirah Messilah Beach",
  description:
    "Kuwait's premier cybersecurity summit. 500+ CISOs and security leaders, 14 October 2026, Jumeirah Messilah Beach Hotel. Register or sponsor now.",
  keywords: [
    "cybersecurity conference Kuwait 2026",
    "cybersecurity summit Kuwait",
    "CISO summit Kuwait",
    "cyber security event Kuwait City",
    "information security conference Kuwait",
    "Cyber First Kuwait",
    "cybersecurity event October 2026",
    "banking cybersecurity Kuwait",
    "fintech security Kuwait",
    "OT security Kuwait",
    "critical infrastructure security Kuwait",
    "cyber resilience Kuwait",
    "GCC cybersecurity conference",
    "Kuwait Vision 2035 cybersecurity",
    "Jumeirah Messilah Beach cybersecurity summit",
    "cybersecurity awards Kuwait",
    "enterprise security summit Middle East",
    "Kuwait cybersecurity leaders",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Cyber First Kuwait 2026, 3rd Annual Cybersecurity Summit",
    description:
      "500+ CISOs and security leaders. 14 October 2026. Jumeirah Messilah Beach Hotel, Kuwait City. The definitive cybersecurity summit.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Cyber First Kuwait 2026, Cybersecurity Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Cyber First Kuwait 2026, 3rd Annual Cybersecurity Summit",
    description:
      "500+ CISOs and security leaders. 14 October 2026. Jumeirah Messilah Beach Hotel, Kuwait City.",
    images: [OG_IMAGE],
  },
};

export default function CyberFirstKuwaitLayout({
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
          { name: "Cyber First", url: `${BASE_URL}/events/cyber-first` },
          { name: "Kuwait 2026", url: PAGE_URL },
        ]}
      />
      {/* Event structured data, JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "@id": `${PAGE_URL}#event`,
            name: "Cyber First Kuwait 2026, 3rd Annual Cybersecurity Summit",
            description:
              "Kuwait's premier cybersecurity leadership summit — the 3rd Annual edition — convening 500+ CISOs, government cyber leaders, and enterprise security executives across banking, fintech, telecom, energy, and critical infrastructure to advance national cyber resilience.",
            startDate: "2026-10-14T08:00:00+03:00",
            endDate: "2026-10-14T18:00:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            inLanguage: "en",
            isAccessibleForFree: true,
            maximumAttendeeCapacity: 500,
            location: {
              "@type": "Place",
              name: "Jumeirah Messilah Beach Hotel & Spa",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Messilah Beach Area",
                addressLocality: "Kuwait City",
                addressCountry: "KW",
              },
              hasMap:
                "https://www.google.com/maps/search/?api=1&query=Jumeirah+Messilah+Beach+Hotel+%26+Spa+Kuwait",
            },
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
              logo: "https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo-02.png",
              sameAs: [
                "https://www.linkedin.com/company/events-first-group",
                "https://x.com/eventsfirstgrp",
              ],
            },
            performer: [
              { "@type": "Person", name: "Faissal Al-Roumi", jobTitle: "Executive Manager of Operational Risk", worksFor: { "@type": "Organization", name: "Burgan Bank" } },
              { "@type": "Person", name: "Dr. Fai Ben Salamah", jobTitle: "Cybersecurity Expert", worksFor: { "@type": "Organization", name: "Kuwait Technical College" } },
              { "@type": "Person", name: "Yousef H. El-Kordi", jobTitle: "Group Information Technology Director", worksFor: { "@type": "Organization", name: "City Group" } },
              { "@type": "Person", name: "Mohamed Rushdhi", jobTitle: "Head of Information Security Unit", worksFor: { "@type": "Organization", name: "The Industrial Bank of Kuwait" } },
              { "@type": "Person", name: "Omer Yildirim", jobTitle: "SVP, Chief Technology Officer", worksFor: { "@type": "Organization", name: "Tiqmo" } },
              { "@type": "Person", name: "Sumit Tekriwal", jobTitle: "Head of Information Security Governance, Compliance and Privacy", worksFor: { "@type": "Organization", name: "KIB" } },
              { "@type": "Person", name: "Abdulla Al-Awadi", jobTitle: "Chief Strategy Officer", worksFor: { "@type": "Organization", name: "KIB" } },
            ],
            sponsor: [
              { "@type": "Organization", name: "Palo Alto Networks" },
              { "@type": "Organization", name: "SentinelOne" },
              { "@type": "Organization", name: "Google Cloud" },
            ],
            offers: {
              "@type": "Offer",
              name: "Delegate Pass — free for qualified end-users",
              url: PAGE_URL,
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              validFrom: "2025-01-01",
            },
            audience: {
              "@type": "BusinessAudience",
              audienceType:
                "CISOs, government cyber leaders, banking and fintech security heads, telecom and enterprise security executives",
            },
            about: [
              { "@type": "Thing", name: "Cybersecurity" },
              { "@type": "Thing", name: "Information security leadership" },
              { "@type": "Thing", name: "Critical infrastructure protection" },
              { "@type": "Thing", name: "Cyber resilience" },
            ],
            typicalAgeRange: "25-",
            keywords:
              "cybersecurity, CISO, information security, Kuwait, cyber summit, banking security, fintech security, critical infrastructure, cyber resilience, GCC",
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
                name: "When is Cyber First Kuwait 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Cyber First Kuwait 2026 — the 3rd Annual Cybersecurity Summit — takes place on 14 October 2026 at Jumeirah Messilah Beach Hotel & Spa, Kuwait City.",
                },
              },
              {
                "@type": "Question",
                name: "Where is Cyber First Kuwait 2026 held?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "At Jumeirah Messilah Beach Hotel & Spa in Kuwait City, Kuwait. Venue logistics and agenda are shared with registered delegates.",
                },
              },
              {
                "@type": "Question",
                name: "Who attends Cyber First Kuwait 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "500+ CISOs, government cyber leaders, and enterprise security executives from across Kuwait and the GCC. Attendance is invitation-only and curated for senior security leadership.",
                },
              },
              {
                "@type": "Question",
                name: "Is there a fee to attend Cyber First Kuwait 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Attendance is free for qualified end-users (CISOs and security leaders). Apply via the registration form on the event page; the advisory team will confirm eligibility.",
                },
              },
              {
                "@type": "Question",
                name: "How do I register or sponsor Cyber First Kuwait 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Use the registration form on the event page to apply as a delegate. For sponsorship or partnership enquiries, contact partnerships@eventsfirstgroup.com.",
                },
              },
            ],
          }),
        }}
      />
      <EventFactBlock
        eventName="Cyber First Kuwait 2026, 3rd Annual Cybersecurity Summit"
        series="Cyber First"
        date="14 October 2026"
        venue="Jumeirah Messilah Beach Hotel & Spa"
        city="Kuwait City"
        country="Kuwait"
        format="in-person"
        audienceSize="500+ delegates"
        audienceTypes={["CISOs", "Government cyber leaders", "Banking and fintech security heads", "Telecom security leaders", "Enterprise security executives"]}
        topSpeakers={[
          { name: "Faissal Al-Roumi", title: "Executive Manager of Operational Risk", org: "Burgan Bank" },
          { name: "Dr. Fai Ben Salamah", title: "Cybersecurity Expert", org: "Kuwait Technical College" },
          { name: "Shaheela Banu A. Majeed", title: "Information Security & Compliance Officer & Auditor", org: "Oil & Gas (Confidential)" },
          { name: "Yousef El-Kourdi", title: "Group Head of Information Technology", org: "City Group Co. KSC" },
        ]}
        topSponsors={[
          { name: "Palo Alto Networks", tier: "Gold" },
          { name: "SentinelOne", tier: "Gold" },
          { name: "Google Cloud", tier: "Gold" },
        ]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
