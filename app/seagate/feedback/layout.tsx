import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Your Feedback — Seagate Executive Roundtable",
  description:
    "Tell us about your experience at the Seagate Executive Roundtable on mass capacity storage and Mozaic 4+.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.eventsfirstgroup.com/seagate/feedback" },
};

export default function SeagateFeedbackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
