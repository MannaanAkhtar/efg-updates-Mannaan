import { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/team-fun-1.jpg";

export const metadata: Metadata = {
  title: "About Us | Events First Group, The Story Behind the Summits",
  description:
    "Events First Group designs executive-grade technology summits across the Middle East, Africa, and Asia. Founded in 2023 in Dubai, we've reached 5,000+ technology leaders through Cyber First, OT Security First, Opex First, and Digital First.",
  keywords: [
    "Events First Group",
    "about EFG",
    "technology events company Dubai",
    "executive summit organizer",
    "CISO conference organizer",
    "Middle East tech events",
  ],
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: "About Events First Group, The Story Behind the Summits",
    description:
      "We design executive-grade technology summits for CISOs, CDOs, and enterprise leaders. Founded 2023 in Dubai. 5,000+ leaders reached.",
    url: `${BASE_URL}/about`,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Events First Group Team",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Events First Group",
    description:
      "The team behind Cyber First, OT Security First, Opex First, and Digital First summits.",
    images: [OG_IMAGE],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "About", url: `${BASE_URL}/about` },
        ]}
      />
      {children}
    </>
  );
}
