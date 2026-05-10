import { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://www.eventsfirstgroup.com";
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title: "Insights | Cybersecurity, AI & Enterprise Technology Analysis | Events First Group",
  description:
    "Expert analysis, industry trends, and thought leadership on cybersecurity, OT security, data & AI, and operational excellence from practitioners shaping the future.",
  keywords: [
    "cybersecurity insights",
    "CISO articles",
    "OT security analysis",
    "data AI trends",
    "enterprise technology blog",
    "Middle East cybersecurity news",
    "operational excellence articles",
  ],
  alternates: {
    canonical: `${BASE_URL}/insights`,
  },
  openGraph: {
    title: "Insights | Events First Group",
    description:
      "Expert analysis on cybersecurity, OT security, data & AI, and operational excellence from industry practitioners.",
    url: `${BASE_URL}/insights`,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Events First Group Insights",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights | Events First Group",
    description:
      "Thought leadership and analysis on cybersecurity, data & AI, and enterprise technology.",
    images: [OG_IMAGE],
  },
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Insights", url: `${BASE_URL}/insights` },
        ]}
      />
      {children}
    </>
  );
}
