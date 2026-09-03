import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";
import { EventFactBlock } from "@/components/seo/FactBlock";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/ot-security-first/uae`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/assets/OT+UAE.png";
const OG_IMAGE_ALT = "OT Security First UAE 2027 — Industrial cybersecurity summit, 27 January 2027, Abu Dhabi, UAE";

const EVENT_START = "2027-01-27T08:30:00+04:00";
const EVENT_END = "2027-01-27T17:30:00+04:00";

const RICH_DESCRIPTION =
  "OT Security First UAE 2027 — the UAE's flagship industrial cybersecurity summit. Framed by the national CIIP framework, convening CISOs, regulators, OT leaders and critical infrastructure operators. 27 January 2027, Abu Dhabi, UAE.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "OT Security First UAE 2027 | Industrial Cybersecurity Summit — 27 Jan",
  description: RICH_DESCRIPTION,
  keywords: [
    "OT Security First UAE 2027",
    "OT security summit UAE",
    "industrial cybersecurity Abu Dhabi",
    "critical infrastructure security UAE",
    "UAE CIIP framework",
    "SCADA security summit UAE",
    "ICS cybersecurity conference",
    "IT OT convergence UAE",
    "energy OT security",
    "critical infrastructure protection UAE",
  ],
  alternates: { canonical: PAGE_URL },
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
    title: "OT Security First UAE 2027 — Industrial Cybersecurity Summit",
    description: RICH_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_IMAGE_ALT, type: "image/png" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "OT Security First UAE 2027",
    description: RICH_DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: OG_IMAGE_ALT }],
  },
  category: "Industrial Cybersecurity",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Preconnect + DNS-prefetch to S3 — hero video, bg images, gallery, sponsor logos hit this origin */}
      <link rel="preconnect" href="https://efg-final.s3.eu-north-1.amazonaws.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://efg-final.s3.eu-north-1.amazonaws.com" />
      {/* Preload the hero poster (LCP) so first paint doesn't wait on the video */}
      <link rel="preload" as="image" href="https://efg-final.s3.eu-north-1.amazonaws.com/assets/OT+UAE.png" fetchPriority="high" />
      {/* Resource hints for the YouTube thumbnails/embeds used by From the Room + the event video */}
      <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://i.ytimg.com" />
      <link rel="preconnect" href="https://www.youtube-nocookie.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
      <BreadcrumbSchema items={[{ name: "Home", url: BASE_URL }, { name: "Events", url: `${BASE_URL}/events` }, { name: "OT Security First", url: `${BASE_URL}/events/ot-security-first` }, { name: "UAE 2027", url: PAGE_URL }]} />
      {/* Organization schema — site-wide brand surface for knowledge-panel eligibility */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Events First Group",
            alternateName: "EFG",
            url: BASE_URL,
            logo: `${BASE_URL}/events-first-group_logo_alt.svg`,
            description: "Premium B2B summits for CISOs, CTOs, and CDOs across the GCC and beyond. Producers of Cyber First, OT Security First, Digital First, OPEX First, and NetworkFirst.",
            sameAs: [
              "https://www.linkedin.com/company/events-first-group",
              "https://twitter.com/eventsfirstgrp",
            ],
          }),
        }}
      />
      {/* Event schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "OT Security First UAE 2027",
            alternateName: ["OT Security UAE 2027", "OT Security First Abu Dhabi 2027"],
            description:
              "The UAE's flagship industrial cybersecurity summit — framed by the national CIIP framework, convening CISOs, regulators, and critical infrastructure leaders for one day in Abu Dhabi.",
            image: [OG_IMAGE],
            startDate: EVENT_START,
            endDate: EVENT_END,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Abu Dhabi",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Abu Dhabi",
                addressCountry: "AE",
              },
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
              audienceType: "OT/ICS security leaders, Plant CISOs, Critical Infrastructure operators, Regulators",
            },
            offers: {
              "@type": "Offer",
              url: PAGE_URL,
              availability: "https://schema.org/InStock",
              price: "0",
              priceCurrency: "USD",
              validFrom: "2026-06-01",
              category: "Invitation-only delegate registration",
            },
            inLanguage: "en",
            isAccessibleForFree: true,
          }),
        }}
      />
      <EventFactBlock
        eventName="OT Security First UAE 2027"
        series="OT Security First"
        date="27 January 2027"
        city="Abu Dhabi"
        country="United Arab Emirates"
        format="in-person"
        audienceTypes={["OT/ICS security leaders", "Plant CISOs", "Energy security heads", "Critical infrastructure operators", "Utilities security leaders", "Engineering directors"]}
        url={PAGE_URL}
      />
      {children}
    </>
  );
}
