import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: "/braze/braze-logo-purple.png",
  },
  title: "AI, Empathy & the New Marketing Operating Model | Braze x EFG Roundtable",
  description:
    "Balancing AI-Driven Efficiency with Empathetic Agility.",
  openGraph: {
    title: "AI, Empathy & the New Marketing Operating Model | Braze x EFG",
    description:
      "Balancing AI-Driven Efficiency with Empathetic Agility.",
    images: [
      {
        url: "https://vroundtable-braze.eventsfirstgroup.com/braze/braze-logo-purple.png",
        width: 1200,
        height: 630,
        alt: "Braze x Events First Group, AI Empathy & the New Marketing Operating Model",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI, Empathy & the New Marketing Operating Model | Braze x EFG",
    description:
      "Balancing AI-Driven Efficiency with Empathetic Agility.",
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
