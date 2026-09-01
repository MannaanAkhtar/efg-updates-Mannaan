import type { Metadata } from "next";
import { Saira_Condensed } from "next/font/google";

// Condensed heavy grotesque for the Oracle-comp headings.
const sairaCondensed = Saira_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-oracle-display",
  display: "swap",
});

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/oracle`;

export const metadata: Metadata = {
  title: "Oracle Artificial Intelligence | Hosted by Events First Group",
  description:
    "Explore Oracle's enterprise AI — generative AI, AI agents, and AI infrastructure built into every layer of the stack. A showcase hosted by Events First Group.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Oracle Artificial Intelligence — Hosted by Events First Group",
    description:
      "Enterprise AI across the technology stack — generative AI, AI agents, and AI infrastructure. Hosted by Events First Group.",
    url: PAGE_URL,
    siteName: "Events First Group",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function OracleLayout({ children }: { children: React.ReactNode }) {
  return <div className={sairaCondensed.variable}>{children}</div>;
}
