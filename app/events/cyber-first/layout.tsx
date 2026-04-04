import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/lib/schemas";

const BASE_URL = "https://eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/events/cyber-first`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0030.JPG";

export const metadata: Metadata = {
  title: "Cyber First | CISO Summit Dubai & Middle East | Cybersecurity Conference",
  description:
    "The premier CISO summit in Dubai & Middle East. Cyber First brings together CISOs, government cyber leaders, and security innovators across UAE, Kuwait, Saudi Arabia, India & Kenya.",
  keywords: [
    "CISO summit Dubai",
    "cybersecurity conference Middle East",
    "cybersecurity summit UAE",
    "CISO conference GCC",
    "cyber security events Dubai",
    "information security summit",
    "enterprise security conference",
    "Cyber First",
    "cybersecurity leadership",
    "CISO summit Middle East",
    "cybersecurity conference Africa",
    "cyber defense summit",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Cyber First Series, The Definitive Cybersecurity Summit",
    description:
      "CISOs, government cyber leaders, and security innovators across Abu Dhabi, Kuwait, Riyadh, Delhi, and Nairobi. Register for the next edition.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Cyber First Series, Cybersecurity Summit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber First Series, The Definitive Cybersecurity Summit",
    description:
      "CISOs and security leaders across Abu Dhabi, Kuwait, Riyadh, Delhi, and Nairobi.",
    images: [OG_IMAGE],
  },
};

export default function CyberFirstLayout({
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
          { name: "Cyber First", url: PAGE_URL },
        ]}
      />
      {/* EventSeries structured data, JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EventSeries",
            name: "Cyber First Series",
            description:
              "The definitive cybersecurity summit series bringing together CISOs, government cyber leaders, and security innovators across multiple regions.",
            url: PAGE_URL,
            image: [OG_IMAGE],
            organizer: {
              "@type": "Organization",
              name: "Events First Group",
              url: BASE_URL,
            },
            location: [
              { "@type": "Place", name: "Abu Dhabi, UAE" },
              { "@type": "Place", name: "Kuwait City, Kuwait" },
              { "@type": "Place", name: "Riyadh, Saudi Arabia" },
              { "@type": "Place", name: "Delhi, India" },
              { "@type": "Place", name: "Nairobi, Kenya" },
            ],
            keywords:
              "cybersecurity, CISO, information security, cyber summit, enterprise security, government security",
          }),
        }}
      />
      {children}
    </>
  );
}
