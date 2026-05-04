import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/effects/SmoothScrollProvider";
import CursorGlow from "@/components/effects/CursorGlow";
import ConditionalNavigation from "@/components/ui/ConditionalNavigation";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

// Plus Jakarta Sans, The voice that commands the room
// Geometric, clean, commanding, pure precision at display sizes
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  style: "normal",
});

// Outfit, The voice that explains
// Clean, modern, effortlessly legible
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// DM Sans, The quiet voice
// Used sparingly: testimonial quotes and the hidden sign-off
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eventsfirstgroup.com"),
  title: {
    default: "Events First Group | Cybersecurity & Technology Summits, Middle East, Africa & Asia",
    template: "%s | Events First Group",
  },
  description:
    "Executive cybersecurity, OT security, AI, and operational excellence summits across the Middle East, Africa & Asia. Invite-only events for CISOs, CDOs & enterprise leaders.",
  keywords: [
    "cybersecurity summit middle east",
    "CISO conference",
    "cybersecurity events dubai",
    "OT security conference",
    "technology summit middle east",
    "AI conference GCC",
    "operational excellence conference",
    "Events First Group",
  ],
  openGraph: {
    title: "Events First Group | Cybersecurity & Technology Summits, Middle East, Africa & Asia",
    description:
      "Executive cybersecurity, OT security, AI, and operational excellence summits across the Middle East, Africa & Asia. Invite-only events for CISOs, CDOs & enterprise leaders.",
    url: "https://eventsfirstgroup.com",
    siteName: "Events First Group",
    images: [
      {
        url: "https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg",
        width: 1200,
        height: 630,
        alt: "Events First Group",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Events First Group | Cybersecurity & Technology Summits",
    description:
      "Executive cybersecurity, OT security, AI, and operational excellence summits across the Middle East, Africa & Asia.",
    site: "@eventsfirstgrp",
    images: ["https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg"],
  },
  icons: {
    icon: [
      { url: "https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Events First Group",
  url: "https://eventsfirstgroup.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://eventsfirstgroup.com/insights?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Events First Group",
  alternateName: "EFG",
  url: "https://eventsfirstgroup.com",
  logo: "https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg",
  description:
    "Events First Group designs executive-grade technology summits across the Middle East, Africa, and Asia. Cyber First, OT Security First, Opex First, and Digital First.",
  foundingDate: "2023",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office M07, The Light Commercial Tower, Arjan",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+971-4-883-4877",
    contactType: "customer service",
    email: "partnerships@eventsfirstgroup.com",
    availableLanguage: "English",
  },
  sameAs: [
    "https://www.linkedin.com/company/events-first-group/",
    "https://www.youtube.com/@eventsfirstgroup",
    "https://www.instagram.com/eventsfirstgroup/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${outfit.variable} ${dmSans.variable}`}>
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Events First Group" />
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Dubai" />
        <link rel="icon" href="https://efg-final.s3.eu-north-1.amazonaws.com/Events+First+logo+icon-01.svg" type="image/svg+xml" />
        {/* Resource hints for faster asset loading */}
        <link rel="dns-prefetch" href="https://efg-final.s3.eu-north-1.amazonaws.com" />
        <link rel="preconnect" href="https://efg-final.s3.eu-north-1.amazonaws.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <SmoothScrollProvider>
          <CursorGlow />
          <ConditionalNavigation />
          <main id="main-content" style={{ position: "relative" }}>{children}</main>
          <WhatsAppButton />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
