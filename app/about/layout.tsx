import { Metadata } from "next";
import { BreadcrumbSchema, FAQSchema } from "@/lib/schemas";

const BASE_URL = "https://www.eventsfirstgroup.com";
const OG_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/team-fun-1.jpg";

export const metadata: Metadata = {
  title: "About Us | Events First Group, The Story Behind the Summits",
  description:
    "Events First Group designs executive-grade technology summits across the Middle East, Africa, and Asia. Founded in 2023 in Dubai by Yasir Rauf and Shyam Reddy, with a second office in Bangalore.",
  keywords: [
    "Events First Group",
    "about EFG",
    "technology events company Dubai",
    "executive summit organizer",
    "CISO conference organizer",
    "Middle East tech events",
  ],
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: "About Events First Group, The Story Behind the Summits",
    description:
      "We design executive-grade technology summits for CISOs, CDOs, and enterprise leaders. Founded 2023 in Dubai by Yasir Rauf and Shyam Reddy.",
    url: `${BASE_URL}/about`,
    siteName: "Events First Group",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Events First Group Team",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Events First Group",
    description:
      "The team behind Cyber First, OT Security First, Opex First, and Digital First summits.",
    images: [OG_IMAGE],
  },
};

const aboutFaqs = [
  {
    question: "What is Events First Group?",
    answer:
      "Events First Group (EFG) is a B2B technology event company headquartered in Dubai, with a second office in Bangalore. We design and produce invite-only summits, executive boardrooms, and virtual forums for CISOs, CTOs, CDOs, and senior transformation leaders across the Middle East, Africa, and Asia.",
  },
  {
    question: "When was Events First Group founded, and by whom?",
    answer:
      "Events First Group was founded in 2023 by Yasir Rauf and Shyam Reddy. The company is headquartered in Dubai, United Arab Emirates, with a second office in Bangalore, India.",
  },
  {
    question: "Where is Events First Group based?",
    answer:
      "Our headquarters is in Dubai, United Arab Emirates. We also operate a second office in Bangalore, Karnataka, India.",
  },
  {
    question: "How many events does Events First Group run each year?",
    answer:
      "EFG runs 16 events in 2026 across five series: Cyber First (cybersecurity), OT Security First (industrial and OT security), Digital First (data and AI), OPEX First (operational excellence), and NetworkFirst (executive boardrooms).",
  },
  {
    question: "Which event series does Events First Group produce?",
    answer:
      "Five series: Cyber First, OT Security First, Digital First, OPEX First, and NetworkFirst. Each series focuses on a specific seniority and discipline within enterprise technology.",
  },
  {
    question: "Who attends EFG events?",
    answer:
      "Senior end-users only — CISOs, CTOs, CDOs, COOs, and director-level transformation, security, and data leaders from large enterprises and government across the GCC, MENA, Africa, and India. Attendance is by invitation and verification.",
  },
  {
    question: "How is Events First Group different from Gartner, Reuters Events, or Informa?",
    answer:
      "EFG is a regionally-focused operator with deep MEA and Asia roots. Rooms are invite-only and curated to keep end-users at the centre — no sales pitches from the main stage. Sponsor conversations happen in private NetworkFirst boardrooms instead.",
  },
  {
    question: "How is Events First Group funded?",
    answer:
      "EFG is funded through sponsorships and the NetworkFirst boardroom programme. Verified end-users attend events free of charge.",
  },
  {
    question: "How can I sponsor or partner with Events First Group?",
    answer:
      "Email partnerships@eventsfirstgroup.com or visit https://www.eventsfirstgroup.com/contact to enquire about sponsorship, NetworkFirst boardrooms, or co-branded executive sessions.",
  },
  {
    question: "How can I attend an Events First Group summit?",
    answer:
      "EFG events are invite-only and verified. Senior technology leaders from end-user organisations can request an invitation through https://www.eventsfirstgroup.com/contact, or register directly on the page for a specific event.",
  },
];

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "About", url: `${BASE_URL}/about` },
        ]}
      />
      <FAQSchema items={aboutFaqs} />
      {children}
    </>
  );
}
