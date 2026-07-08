import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/inner_circle`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/assets/magnific_use-this-image-as-referen_KjEa1G6kqp.png";

export const metadata: Metadata = {
  title: "The Inner Circle — The Art of Knowing | CleverTap, Riyadh",
  description:
    "An invite-only evening for Riyadh's C-suite growth, marketing, and digital leaders. Presented by CleverTap — ninety minutes, one room, and a single idea worth knowing, closing with a live mentalist experience.",
  keywords: [
    "The Inner Circle",
    "CleverTap Riyadh",
    "The Art of Knowing",
    "AI customer engagement",
    "personalisation Saudi Arabia",
    "C-suite roundtable Riyadh",
    "CMO CGO event Riyadh",
    "AI agents 1:1 engagement",
    "customer retention Saudi Arabia",
    "invite-only executive evening",
  ],
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: "The Inner Circle — The Art of Knowing | CleverTap, Riyadh",
    description:
      "An invite-only evening for Riyadh's C-suite growth, marketing, and digital leaders. Presented by CleverTap.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "The Inner Circle — The Art of Knowing, presented by CleverTap" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Inner Circle — The Art of Knowing | CleverTap, Riyadh",
    description:
      "An invite-only evening for Riyadh's C-suite growth, marketing, and digital leaders. Presented by CleverTap.",
    images: [OG_IMAGE],
  },
};

export default function InnerCircleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "@id": `${PAGE_URL}#event`,
            name: "The Inner Circle — The Art of Knowing",
            description:
              "An invite-only evening for Riyadh's C-suite growth, marketing, and digital leaders, presented by CleverTap — a closed-door conversation on AI-led customer engagement, closing with a live mentalist experience.",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            inLanguage: "en",
            isAccessibleForFree: true,
            startDate: "2026-08-19",
            location: {
              "@type": "Place",
              name: "Hilton Riyadh Hotel & Residences",
              address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
            },
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
            },
            sponsor: {
              "@type": "Organization",
              name: "CleverTap",
              url: "https://clevertap.com/",
            },
            offers: {
              "@type": "Offer",
              name: "Invitation — by invitation only",
              url: PAGE_URL,
              price: "0",
              priceCurrency: "SAR",
              availability: "https://schema.org/InStock",
            },
            audience: {
              "@type": "BusinessAudience",
              audienceType: "CMOs, CGOs, Heads of Digital, and senior growth, marketing, and digital leaders",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
