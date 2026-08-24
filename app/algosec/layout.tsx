import type { Metadata } from "next";
import { Lato } from "next/font/google";

// AlgoSec brand headline/paragraph font
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/algosec`;
const OG_IMAGE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/ChatGPT+Image+Aug+24%2C+2026%2C+10_04_44+AM.png";

export const metadata: Metadata = {
  title: "AlgoCity: Escape the Complexity — AlgoSec Executive Roundtable, Dubai",
  description:
    "A closed-door AlgoSec executive roundtable securing application connectivity across the hybrid enterprise. 24 September 2026, Dubai. A gamified AlgoCity challenge, senior peer discussion, and networking reception.",
  keywords: [
    "AlgoSec roundtable Dubai",
    "application connectivity security",
    "AlgoCity escape the complexity",
    "network security policy",
    "hybrid cloud security",
    "application-centric security",
    "AlgoSec Horizon",
    "CISO roundtable Dubai",
    "secure application connectivity",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "AlgoCity: Escape the Complexity — AlgoSec Executive Roundtable",
    description:
      "Securing application connectivity across the hybrid enterprise. A closed-door executive roundtable, Dubai · 24 September 2026.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "AlgoCity: Escape the Complexity — AlgoSec Executive Roundtable" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventsfirstgrp",
    title: "AlgoCity: Escape the Complexity — AlgoSec Executive Roundtable",
    description: "Securing application connectivity across the hybrid enterprise. Dubai · 24 September 2026.",
    images: [OG_IMAGE],
  },
};

export default function AlgoSecLayout({ children }: { children: React.ReactNode }) {
  return <div className={lato.variable}>{children}</div>;
}
