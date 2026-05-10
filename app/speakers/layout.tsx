import { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://www.eventsfirstgroup.com";
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0045.JPG";

export const metadata: Metadata = {
  title: "Speakers — CISOs & Industry Leaders | Events First Group",
  description:
    "Meet the CISOs, CTOs, CDOs, and industry practitioners who speak at Events First Group summits. 200+ speakers from leading enterprises across the Middle East and beyond.",
  keywords: [
    "cybersecurity speakers",
    "CISO speakers Middle East",
    "technology conference speakers",
    "enterprise security experts",
    "OT security speakers",
    "data AI speakers Gulf",
  ],
  alternates: {
    canonical: `${BASE_URL}/speakers`,
  },
  openGraph: {
    title: "Speakers | Events First Group",
    description:
      "200+ CISOs, CTOs, and industry practitioners who've spoken at our summits. Real expertise, no sales pitches.",
    url: `${BASE_URL}/speakers`,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Events First Group Speakers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Speakers | Events First Group",
    description:
      "Meet the practitioners and thought leaders shaping cybersecurity, OT security, and digital transformation.",
    images: [OG_IMAGE],
  },
};

export default function SpeakersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Speakers", url: `${BASE_URL}/speakers` },
        ]}
      />
      {children}
    </>
  );
}
