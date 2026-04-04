import { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title: "Contact Us | Events First Group, Dubai",
  description:
    "Get in touch with Events First Group. Inquire about sponsorship, speaking opportunities, delegate registration, partnerships, or media requests. Based in Dubai, UAE.",
  keywords: [
    "contact Events First Group",
    "sponsor technology event",
    "speak at conference",
    "event partnership Dubai",
    "technology summit registration",
  ],
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
  openGraph: {
    title: "Contact Us | Events First Group",
    description:
      "Sponsorship, speaking, registration, or partnership inquiries. Based in Dubai, UAE.",
    url: `${BASE_URL}/contact`,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Contact Events First Group",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Events First Group",
    description: "Get in touch, sponsorship, speaking, registration, or partnerships.",
    images: [OG_IMAGE],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Contact", url: `${BASE_URL}/contact` },
        ]}
      />
      {children}
    </>
  );
}
