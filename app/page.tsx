import type { Metadata } from "next";
import {
  HeroSection,
  EventSeriesShowcase,
  ImpactBar,
  AnnualTimeline,
  NetworkFirst,
  PhotoGallery,
  WhyEFG,
  Testimonials,
  EventHighlights,
  SponsorsPartners,
  InquiryForm,
  Footer,
} from "@/components/sections";
import SectionTransition from "@/components/effects/SectionTransition";

const BASE_URL = "https://www.eventsfirstgroup.com";
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title: "Cybersecurity & AI Summits MEA, Asia | Events First Group",
  description:
    "Executive cybersecurity, OT security & AI summits across Middle East, Africa & Asia. Invite-only events for CISOs & technology leaders. 16 events in 2026.",
  keywords: [
    "cybersecurity summit middle east",
    "CISO conference",
    "cybersecurity events dubai",
    "OT security conference",
    "technology summit middle east",
    "AI conference GCC",
    "operational excellence conference",
    "executive cybersecurity summit",
    "Events First Group",
    "invite only cybersecurity summit",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Events First Group, Cybersecurity & Technology Summits",
    description:
      "16 invite-only cybersecurity, AI, and enterprise summits across the Middle East, Africa & Asia in 2026. Join 5,000+ CISOs & technology leaders.",
    url: BASE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Events First Group, 16 Executive Technology Summits in 2026 across Middle East, Africa & Asia",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events First Group, Cybersecurity & Technology Summits",
    description:
      "16 invite-only cybersecurity, AI, and enterprise summits across the Middle East, Africa & Asia in 2026. Join 5,000+ CISOs & technology leaders.",
    site: "@eventsfirstgrp",
    creator: "@eventsfirstgrp",
    images: [OG_IMAGE],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Events First Group",
  legalName: "Events First Group LLC",
  url: BASE_URL,
  logo: `${BASE_URL}/events-first-group_logo_alt.svg`,
  description:
    "B2B technology event company producing invite-only cybersecurity, OT security, AI, and operational excellence summits for CISOs, CTOs, CDOs, and senior transformation leaders across the Middle East, Africa, and Asia.",
  foundingDate: "2018",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  sameAs: [
    "https://www.linkedin.com/company/events-first-group",
    "https://x.com/eventsfirstgrp",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "info@eventsfirstgroup.com",
    areaServed: ["AE", "SA", "KW", "QA", "OM", "BH", "IN", "KE", "ZA"],
    availableLanguage: ["English"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Events First Group",
  url: BASE_URL,
  publisher: {
    "@type": "Organization",
    name: "Events First Group",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/insights?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const eventSeriesJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "Cyber First",
    description: "Invite-only cybersecurity summit series for CISOs across the Middle East, Africa, and Asia",
    url: "https://www.eventsfirstgroup.com/events/cyber-first",
    organizer: { "@type": "Organization", name: "Events First Group", url: "https://www.eventsfirstgroup.com" },
    subEvent: [
      { "@type": "Event", name: "Cyber First Kuwait 2026", startDate: "2026-06-09", location: { "@type": "Place", name: "Jumeirah Messilah Beach Hotel", address: { "@type": "PostalAddress", addressLocality: "Kuwait City", addressCountry: "KW" } } },
      { "@type": "Event", name: "Cyber First India 2026", startDate: "2026-10-10", location: { "@type": "Place", name: "New Delhi", address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" } } },
      { "@type": "Event", name: "Cyber First East Africa 2026", startDate: "2026-07-08", location: { "@type": "Place", name: "Nairobi", address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" } } },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "Digital First",
    description: "Premier Data & AI leadership summit series for CDOs and enterprise leaders in the Middle East",
    url: "https://www.eventsfirstgroup.com/events/data-ai-first",
    organizer: { "@type": "Organization", name: "Events First Group", url: "https://www.eventsfirstgroup.com" },
    subEvent: [
      { "@type": "Event", name: "Digital First Kuwait 2026", startDate: "2026-06-10", location: { "@type": "Place", name: "Jumeirah Messilah Beach Hotel", address: { "@type": "PostalAddress", addressLocality: "Kuwait City", addressCountry: "KW" } } },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "OPEX First",
    description: "Operational excellence conference for COOs and transformation architects in Saudi Arabia and the GCC",
    url: "https://www.eventsfirstgroup.com/events/opex-first",
    organizer: { "@type": "Organization", name: "Events First Group", url: "https://www.eventsfirstgroup.com" },
    subEvent: [
      { "@type": "Event", name: "OPEX First Saudi 2026", startDate: "2026-09-15", location: { "@type": "Place", name: "Riyadh", address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" } } },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "OT Security First",
    description: "The region's only dedicated OT security and critical infrastructure cybersecurity summit",
    url: "https://www.eventsfirstgroup.com/events/ot-security-first",
    organizer: { "@type": "Organization", name: "Events First Group", url: "https://www.eventsfirstgroup.com" },
    subEvent: [
      { "@type": "Event", name: "OT Security First Jubail 2026", startDate: "2026-10-07", location: { "@type": "Place", name: "Jubail", address: { "@type": "PostalAddress", addressLocality: "Jubail", addressCountry: "SA" } } },
    ],
  },
];

export default function Home() {
  return (
    <div>
      {/* Organization + WebSite + EventSeries structured data for Google + AI engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {eventSeriesJsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* The Hero, The Promise */}
      <HeroSection />

      {/* The Event Series, Four Worlds */}
      <EventSeriesShowcase />

      {/* NetworkFirst Boardrooms, Most exclusive product, high up */}
      <NetworkFirst />

      {/* Section Transition - Sweep */}
      <SectionTransition variant="sweep" />

      {/* The Impact Bar, Numbers That Matter (flows from Event Series via gradient) */}
      <ImpactBar />

      {/* Annual Timeline, The Year Ahead (flows directly from ImpactBar) */}
      <AnnualTimeline />

      {/* Section Transition - Expand */}
      <SectionTransition variant="expand" />

      {/* Photo Gallery, Moments That Matter */}
      <PhotoGallery />

      {/* Section Transition - Pulse */}
      <SectionTransition variant="pulse" />

      {/* Why Events First Group, The Trust */}
      <WhyEFG />

      {/* Section Transition - Sweep */}
      <SectionTransition variant="sweep" />

      {/* Testimonials, The Human Voice */}
      <Testimonials />

      {/* Section Transition - Expand */}
      <SectionTransition variant="expand" />

      {/* Event Highlights, From the Stage */}
      <EventHighlights />

      {/* Sponsors & Partners, The Credibility */}
      <SponsorsPartners />

      {/* Section Transition - Pulse */}
      <SectionTransition variant="pulse" />

      {/* Get Involved, Inquiry Form */}
      <InquiryForm />

      {/* Section Transition - Sweep */}
      <SectionTransition variant="sweep" />

      {/* Footer, The Credits */}
      <Footer />
    </div>
  );
}
