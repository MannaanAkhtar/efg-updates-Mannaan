import { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG";

export const metadata: Metadata = {
  title: "Network First Boardrooms | Invite-Only Executive Roundtables | Events First Group",
  description:
    "Exclusive, invite-only boardroom sessions for 15-20 senior technology leaders. Intimate discussions, peer connections, and strategic insights in a closed-door setting.",
  keywords: [
    "executive roundtable",
    "CISO boardroom",
    "invite-only technology event",
    "senior leadership roundtable",
    "exclusive executive summit",
    "closed-door technology discussion",
  ],
  alternates: {
    canonical: `${BASE_URL}/network-first`,
  },
  openGraph: {
    title: "Network First Boardrooms | Events First Group",
    description:
      "Invite-only boardroom sessions for 15-20 senior technology leaders. Exclusive, intimate, impactful.",
    url: `${BASE_URL}/network-first`,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Network First Boardrooms",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Network First Boardrooms | Events First Group",
    description: "Invite-only executive roundtables for senior technology leaders.",
    images: [OG_IMAGE],
  },
};

export default function NetworkFirstLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
