import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";

// Oracle sets event titles in a light transitional serif; Source Serif is the
// closest Google face to the one eventreg.oracle.com ships.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-oracle-serif",
  display: "swap",
});

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/oracle`;

export const metadata: Metadata = {
  title: "Oracle AI: Powering the Intelligent Enterprise — 14 October 2026, Riyadh",
  description:
    "An exclusive Oracle executive experience at the JW Marriott Hotel Riyadh, 14 October 2026. Explore enterprise AI across cloud applications, data platforms, and AI infrastructure.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Oracle AI: Powering the Intelligent Enterprise",
    description:
      "14 October 2026, 10:00 AM – 2:00 PM · JW Marriott Hotel Riyadh. An exclusive Oracle executive experience on enterprise AI.",
    url: PAGE_URL,
    siteName: "Events First Group",
    type: "website",
  },
  // This page mirrors Oracle's own eventreg listing, so it stays out of the
  // index: two pages carrying the same copy would compete with each other.
  robots: { index: false, follow: false },
};

export default function OracleLayout({ children }: { children: React.ReactNode }) {
  return <div className={sourceSerif.variable}>{children}</div>;
}
