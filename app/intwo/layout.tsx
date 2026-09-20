import type { Metadata } from "next";
import localFont from "next/font/local";

// Inter is Intwo's brand typeface (brand styleguide, "Typography"). The full
// 100–900 axis is exposed so headlines can use Inter Light, as the book specifies.
const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [{ path: "../fonts/inter/inter.woff2", weight: "100 900", style: "normal" }],
});

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/intwo`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/heros/intwo+hero1.png";

export const metadata: Metadata = {
  title: "AI Agents in Action | Intwo CXO Roundtable, Dubai",
  description:
    "A half-day working session for Dynamics 365 customers in Dubai, hosted by Intwo with Microsoft. Watch live agents working inside the system, then watch Intwo build one to a real request from the room. Thursday 8 October 2026. By invitation only.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "AI Agents in Action | Intwo CXO Roundtable, Dubai",
    description:
      "Your ERP knows. It just doesn't act. Three hours of live agents inside Dynamics 365, hosted by Intwo with Microsoft. Dubai, Thursday 8 October 2026. By invitation.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1672, height: 941, alt: "AI Agents in Action | Intwo CXO Roundtable, Dubai" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "AI Agents in Action | Intwo CXO Roundtable, Dubai",
    description: "Hosted by Intwo with Microsoft. Watch live agents working inside Dynamics 365. Dubai, Thursday 8 October 2026. By invitation.",
    images: [OG_IMAGE],
  },
};

export default function IntwoLayout({ children }: { children: React.ReactNode }) {
  return <div className={inter.variable}>{children}</div>;
}
