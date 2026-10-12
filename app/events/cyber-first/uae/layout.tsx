import type { Metadata } from "next";
import localFont from "next/font/local";
import { BreadcrumbSchema } from "@/lib/schemas";

// Editorial accent face for this page only. Self-hosted like the root fonts, so
// the production build never depends on a fetch to Google Fonts.
const instrumentSerif = localFont({
  variable: "--font-cfu-serif",
  display: "swap",
  src: [
    { path: "../../../fonts/instrument-serif/instrument-serif.woff2", weight: "400", style: "normal" },
    { path: "../../../fonts/instrument-serif/instrument-serif-italic.woff2", weight: "400", style: "italic" },
  ],
});

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first/uae`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/heros/cyber+uae+hero+pic.png";
// The hero's first frame, resized by the image optimiser. page.tsx uses this same URL as
// the video poster, so preloading it here lets the browser fetch it before any script runs.
const HERO_POSTER = `/_next/image?url=${encodeURIComponent(OG_IMAGE)}&w=1200&q=75`;
const OG_IMAGE_ALT = "Cyber First UAE 2027 - Building the UAE's cyber-resilient digital future, 27 January 2027";

// The brief gives a date but no start time, so the schema carries the date only.
const EVENT_DATE = "2027-01-27";

// Search results cut descriptions at roughly 155 characters, so the meta description is a
// shorter cut of the same sentence; the full version stays on the social cards and schema.
const META_DESCRIPTION =
  "Cyber First UAE 2027, the 9th edition: a senior-level cybersecurity and cyber-resilience platform for government, regulators and CISOs. 27 January 2027.";

const RICH_DESCRIPTION =
  "Cyber First UAE 2027, the 9th edition - a senior-level cybersecurity and cyber-resilience platform bringing together government, regulators, CISOs, CIOs, critical infrastructure leaders, financial institutions and technology innovators to shape the UAE's secure digital future. 27 January 2027, UAE.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Cyber First UAE 2027 | Cybersecurity Summit — 27 January",
  description: META_DESCRIPTION,
  keywords: [
    "Cyber First UAE 2027",
    "cybersecurity summit UAE",
    "cyber resilience UAE",
    "CISO summit UAE",
    "AI security UAE",
    "agentic AI cybersecurity",
    "critical infrastructure cybersecurity UAE",
    "OT security UAE",
    "post-quantum cybersecurity",
    "digital sovereignty UAE",
    "cybersecurity conference Middle East 2027",
  ],
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: "Cyber First UAE 2027 - Building the UAE's Cyber-Resilient Digital Future",
    description: RICH_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1672, height: 941, alt: OG_IMAGE_ALT, type: "image/png" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "Cyber First UAE 2027",
    description: RICH_DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: OG_IMAGE_ALT }],
  },
  category: "Cybersecurity",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={instrumentSerif.variable}>
      <link rel="preconnect" href="https://efg-final.s3.eu-north-1.amazonaws.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://efg-final.s3.eu-north-1.amazonaws.com" />
      <link rel="preload" as="image" href={HERO_POSTER} fetchPriority="high" />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Events", url: `${BASE_URL}/events` },
          { name: "Cyber First", url: `${BASE_URL}/events/cyber-first` },
          { name: "UAE 2027", url: PAGE_URL },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Cyber First UAE 2027",
            url: PAGE_URL,
            description: RICH_DESCRIPTION,
            image: [OG_IMAGE],
            startDate: EVENT_DATE,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            // City and venue are not announced yet, so only the country is stated.
            location: {
              "@type": "Place",
              name: "United Arab Emirates",
              address: { "@type": "PostalAddress", addressCountry: "AE" },
            },
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
              logo: `${BASE_URL}/events-first-group_logo_alt.svg`,
              sameAs: [
                "https://www.linkedin.com/company/events-first-group",
                "https://twitter.com/eventsfirstgrp",
              ],
            },
            audience: {
              "@type": "BusinessAudience",
              audienceType:
                "CIOs, CTOs, CISOs, Chief Data, AI and Privacy Officers, cyber risk leaders, critical infrastructure security leaders, regulators and government cybersecurity leaders",
            },
            inLanguage: "en",
          }),
        }}
      />
      {/* The previous edition's highlight film, which the page shows in its overview. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: "Cyber First UAE · Event highlights",
            description: "Highlights from the previous edition of Cyber First UAE.",
            thumbnailUrl: ["https://i.ytimg.com/vi/AsrScRfgLpA/maxresdefault.jpg"],
            embedUrl: "https://www.youtube.com/embed/AsrScRfgLpA",
            contentUrl: "https://www.youtube.com/watch?v=AsrScRfgLpA",
          }),
        }}
      />
      {/* Questions answered only with what the event brief states. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "When is Cyber First UAE 2027?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Cyber First UAE 2027, the 9th edition, takes place on 27 January 2027 in the United Arab Emirates. It is a one-day event.",
                },
              },
              {
                "@type": "Question",
                name: "What is Cyber First UAE 2027?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A senior-level cybersecurity and cyber-resilience platform bringing together government, regulators, CISOs, CIOs, critical infrastructure leaders, financial institutions and technology innovators to shape the UAE's secure digital future. Its theme is Building the UAE's Cyber-Resilient Digital Future.",
                },
              },
              {
                "@type": "Question",
                name: "Who attends Cyber First UAE 2027?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "CIOs, CTOs and Chief Digital Officers; CISOs and information security leaders; Chief Data, AI and Privacy Officers; cyber risk and technology risk leaders; SOC, threat intelligence and incident response leaders; OT, ICS and industrial cybersecurity leaders; critical infrastructure security leaders; government cybersecurity and digital leaders; and regulators and cyber policy leaders.",
                },
              },
              {
                "@type": "Question",
                name: "What topics does Cyber First UAE 2027 cover?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Executive cyber leadership and geopolitical risk; AI, Agentic AI and emerging cyber threats; critical infrastructure, OT and industrial cybersecurity; cloud security, data protection and digital sovereignty; digital supply chains and third-party risk; post-quantum cybersecurity and cryptographic readiness; incident response, cyber recovery and business continuity; and operational resilience and crisis management.",
                },
              },
              {
                "@type": "Question",
                name: "How do I register for or speak at Cyber First UAE 2027?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Use the registration form on the event page to register to attend or to apply to speak.",
                },
              },
            ],
          }),
        }}
      />
      {children}
    </div>
  );
}
