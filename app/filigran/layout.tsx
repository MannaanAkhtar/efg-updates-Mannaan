import type { Metadata } from "next";

const BASE_URL = "https://www.eventsfirstgroup.com";
const PAGE_URL = `${BASE_URL}/filigran`;
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/LOGO_FILIGRAN_COULEURS.png";

export const metadata: Metadata = {
  title: "Agentic CTEM in Practice | Filigran × EFG Roundtable",
  description:
    "An online executive roundtable on Agentic CTEM — uniting threat intelligence (CTI) and adversarial exposure validation (AEV) with AI agents. 14 July 2026, 70 minutes.",
  keywords: [
    "Agentic CTEM",
    "Continuous Threat Exposure Management",
    "OpenCTI",
    "OpenAEV",
    "threat intelligence",
    "adversarial exposure validation",
    "Filigran",
    "XTM One",
    "AI agents security",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Agentic CTEM in Practice — Filigran × EFG Roundtable",
    description:
      "Uniting threat intelligence (CTI) and adversarial exposure validation (AEV) with AI agents. An online roundtable for security leaders — 14 July 2026.",
    url: PAGE_URL,
    siteName: "Events First Group",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Agentic CTEM in Practice — Filigran × Events First Group" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentic CTEM in Practice — Filigran × EFG",
    description:
      "Uniting threat intelligence (CTI) and adversarial exposure validation (AEV) with AI agents. Online roundtable, 14 July 2026.",
    images: [OG_IMAGE],
  },
};

export default function FiligranLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Agentic CTEM in Practice: Supercharge your CTI and Exposure Validation teams with AI Agents",
            description:
              "An online executive roundtable on Agentic CTEM — uniting threat intelligence (CTI) and adversarial exposure validation (AEV) with AI agents, using Filigran's XTM One as a practical example.",
            startDate: "2026-07-14",
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: { "@type": "VirtualLocation", url: PAGE_URL },
            organizer: { "@type": "Organization", name: "Events First Group", url: BASE_URL },
            sponsor: { "@type": "Organization", name: "Filigran", url: "https://filigran.io/" },
          }),
        }}
      />
      {children}
    </>
  );
}
