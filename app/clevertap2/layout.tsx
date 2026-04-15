import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-opensans",
  display: "swap",
});

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/clevertap2`;

export const metadata: Metadata = {
  title: "Engaging Customers in Uncertain Times | CleverTap x EFG",
  description:
    "A 90-minute virtual roundtable for marketing and CRM leaders. Relevance builds trust. Trust builds revenue. June 10, 2026.",
  keywords: [
    "CleverTap webinar",
    "customer engagement",
    "retention strategy",
    "CRM leaders",
    "personalisation",
    "lifecycle engagement",
    "customer trust",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Engaging Customers in Uncertain Times: Why Trust is Your Competitive Advantage",
    description: "Relevance builds trust. Trust builds revenue. June 10, 2026 — 90 min virtual roundtable.",
    url: PAGE_URL,
    siteName: "Events First Group",
    locale: "en_US",
    type: "website",
  },
};

export default function CleverTapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={openSans.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Engaging Customers in Uncertain Times: Why Trust is Your Competitive Advantage",
            description: "A 90-minute virtual roundtable for marketing and CRM leaders on customer engagement strategy.",
            startDate: "2026-06-10T11:00:00+04:00",
            endDate: "2026-06-10T12:30:00+04:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            location: { "@type": "VirtualLocation", url: PAGE_URL },
            organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL },
            sponsor: { "@type": "Organization", name: "CleverTap", url: "https://www.clevertap.com/" },
          }),
        }}
      />
      {children}
    </div>
  );
}
