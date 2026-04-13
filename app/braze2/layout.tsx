import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: "/braze/braze-logo-purple.png",
  },
  title: "Marketing Through Uncertainty | Braze x Events First Group",
  description:
    "A private virtual roundtable for senior martech leaders in MENAT. How brands are adjusting customer engagement strategies during uncertain times.",
  openGraph: {
    title: "Marketing Through Uncertainty | Braze x EFG Roundtable",
    description:
      "A private virtual roundtable for senior martech leaders in MENAT.",
    images: [
      {
        url: "https://vroundtable-braze.eventsfirstgroup.com/braze/braze-logo-purple.png",
        width: 1200,
        height: 630,
        alt: "Braze x Events First Group, Marketing Through Uncertainty",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketing Through Uncertainty | Braze x EFG Roundtable",
    description:
      "A private virtual roundtable for senior martech leaders in MENAT.",
    images: ["https://vroundtable-braze.eventsfirstgroup.com/braze/braze-logo-purple.png"],
  },
};

export default function Braze2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
