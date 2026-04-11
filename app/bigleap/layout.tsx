import type { Metadata } from "next";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/bigleap`;

export const metadata: Metadata = {
  title: "The Big Leap Connect, Riyadh | CleverTap",
  description:
    "Beyond the Hype. Redefining Growth with AI. An invite-only evening for Riyadh's senior growth, marketing, product, and digital leaders. May 5, 2026.",
  keywords: [
    "Big Leap Connect Riyadh",
    "CleverTap event",
    "Riyadh marketing leaders",
    "AI customer engagement",
    "growth strategy",
    "panel discussion Riyadh",
    "invite-only forum",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "The Big Leap Connect, Riyadh — Beyond the Hype: Redefining Growth with AI",
    description:
      "Where Riyadh's growth leaders converge to exchange ideas, challenge thinking, and collectively take the next leap. May 5, 2026.",
    url: PAGE_URL,
    siteName: "Events First Group",
    locale: "en_US",
    type: "website",
  },
};

export default function BigLeapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={manrope.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "The Big Leap Connect, Riyadh",
            description:
              "Beyond the Hype: Redefining Growth with AI. An invite-only evening event for senior growth, marketing, product, and digital leaders in Riyadh.",
            startDate: "2026-05-05T16:30:00+03:00",
            endDate: "2026-05-05T18:40:00+03:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Riyadh, Saudi Arabia",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Riyadh",
                addressCountry: "SA",
              },
            },
            organizer: { "@type": "Organization", name: "CleverTap", url: "https://www.clevertap.com/" },
            sponsor: { "@type": "Organization", name: "CleverTap", url: "https://www.clevertap.com/" },
          }),
        }}
      />
      {children}
    </div>
  );
}
