import { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title: "Events Calendar 2026 | Executive Technology Summits | Events First Group",
  description:
    "Browse 9 executive technology summits across Kuwait, Qatar, Saudi Arabia, Oman, and UAE in 2026. Cybersecurity, OT Security, Data & AI, and Opex events for CISOs, CDOs, and enterprise technology leaders.",
  keywords: [
    "technology events 2026",
    "cybersecurity conference Middle East",
    "CISO summit Gulf",
    "enterprise technology events Dubai",
    "OT security conference Saudi Arabia",
    "data AI summit Kuwait",
    "executive technology summit",
  ],
  alternates: {
    canonical: `${BASE_URL}/events`,
  },
  openGraph: {
    title: "Events Calendar 2026 | Events First Group",
    description:
      "9 executive summits across the Middle East, Cybersecurity, OT Security, Data & AI, and Opex. For CISOs, CDOs, and enterprise leaders.",
    url: `${BASE_URL}/events`,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Events First Group, 2026 Events Calendar",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events Calendar 2026 | Events First Group",
    description:
      "9 executive technology summits for CISOs, CDOs, and enterprise leaders across the Middle East.",
    images: [OG_IMAGE],
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Events", url: `${BASE_URL}/events` },
        ]}
      />
      {children}
    </>
  );
}
