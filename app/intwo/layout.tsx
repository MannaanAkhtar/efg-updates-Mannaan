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
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/heros/intwo+hero.png";

export const metadata: Metadata = {
  title: "AI Agents in Action — Intwo CXO Roundtable, Dubai",
  description:
    "A half-day working session for Dynamics 365 customers in Dubai. Live agents running inside the system, then Intwo customizes one live to a real request from the room. Thursday 8 October 2026. By invitation only.",
  // Invitation and RSVP only — the brief specifies no public landing page, so the
  // page stays out of search results while remaining reachable by direct link.
  robots: { index: false, follow: false },
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "AI Agents in Action — Intwo CXO Roundtable, Dubai",
    description:
      "Your ERP knows. It just doesn't act. Three hours with live agents inside Dynamics 365. Dubai, Thursday 8 October 2026. By invitation.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1672, height: 941, alt: "AI Agents in Action — Intwo CXO Roundtable, Dubai" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "AI Agents in Action — Intwo CXO Roundtable, Dubai",
    description: "Your ERP knows. It just doesn't act. Dubai, Thursday 8 October 2026. By invitation.",
    images: [OG_IMAGE],
  },
};

export default function IntwoLayout({ children }: { children: React.ReactNode }) {
  return <div className={inter.variable}>{children}</div>;
}
