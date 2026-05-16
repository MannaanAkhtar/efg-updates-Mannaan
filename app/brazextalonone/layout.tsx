import type { Metadata } from "next";

const LOGO_URL = "https://efg-final.s3.eu-north-1.amazonaws.com/logos/brazextalon.png";

export const metadata: Metadata = {
  icons: {
    icon: "/braze/braze-logo-purple.png",
  },
  title:
    "Earned, not automated — What happens to brand loyalty when AI becomes the decision-maker? | Braze x Talon Roundtable",
  description:
    "A virtual roundtable bringing together loyalty, CRM, digital, and customer experience leaders to explore how brands can stay relevant, differentiated, and trusted in an AI-mediated marketplace.",
  openGraph: {
    title:
      "Earned, not automated — Brand loyalty in an AI-mediated marketplace | Braze x Talon",
    description:
      "What happens to brand loyalty when AI becomes the decision-maker? A virtual roundtable for loyalty, CRM, digital and customer experience leaders.",
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Braze x Talon — Earned, not automated",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Earned, not automated — Brand loyalty when AI becomes the decision-maker",
    description:
      "Virtual roundtable. Loyalty, CRM, digital, and customer experience leaders.",
    images: [LOGO_URL],
  },
};

export default function Braze3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
