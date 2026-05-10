import { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://www.eventsfirstgroup.com";
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title: "Sponsors & Partners | Events First Group",
  description:
    "Meet the technology leaders, solution providers, and strategic partners who sponsor and support Events First Group summits. Join 60+ partners reaching enterprise decision-makers.",
  keywords: [
    "event sponsors",
    "technology event partners",
    "cybersecurity conference sponsors",
    "enterprise summit sponsors",
    "sponsor technology event Middle East",
  ],
  alternates: {
    canonical: `${BASE_URL}/sponsors-and-partners`,
  },
  openGraph: {
    title: "Sponsors & Partners | Events First Group",
    description:
      "60+ technology leaders and solution providers partnering with EFG to reach enterprise decision-makers.",
    url: `${BASE_URL}/sponsors-and-partners`,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Events First Group Sponsors and Partners",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsors & Partners | Events First Group",
    description: "The technology leaders partnering with EFG summits.",
    images: [OG_IMAGE],
  },
};

export default function SponsorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Sponsors & Partners", url: `${BASE_URL}/sponsors-and-partners` },
        ]}
      />
      {children}
    </>
  );
}
