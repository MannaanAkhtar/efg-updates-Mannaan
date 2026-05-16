import type { Metadata } from "next";

// The /brazextalonone/opengraph-image.tsx route auto-generates the
// 1200x630 share card (cream gradient + co-branded lockup + headline)
// and is wired into og:image and twitter:image by Next.js automatically —
// no need to set `openGraph.images` or `twitter.images` here.

export const metadata: Metadata = {
  icons: {
    icon: "/braze/braze-logo-purple.png",
  },
  title:
    "Earned, not automated — What happens to brand loyalty when AI becomes the decision-maker? | Braze x Talon.One Webinar",
  description:
    "A virtual webinar bringing together loyalty, CRM, digital, and customer experience leaders to explore how brands can stay relevant, differentiated, and trusted in an AI-mediated marketplace.",
  openGraph: {
    title:
      "Earned, not automated — Brand loyalty in an AI-mediated marketplace | Braze x Talon.One",
    description:
      "What happens to brand loyalty when AI becomes the decision-maker? A virtual webinar for loyalty, CRM, digital and customer experience leaders.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Earned, not automated — Brand loyalty when AI becomes the decision-maker",
    description:
      "Virtual webinar. Loyalty, CRM, digital, and customer experience leaders.",
  },
};

export default function Braze3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
