"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/sections";
import { NeuralConstellation, DotMatrixGrid } from "@/components/effects";
import EventNavigation from "@/components/ui/EventNavigation";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { FormType, CountryCode } from "@/lib/form-helpers";

// ─── Constants ───────────────────────────────────────────────────────────────
const C = "#01BBF5";
const C_BRIGHT = "#4DD4FF";
const EASE = [0.16, 1, 0.3, 1] as const;
const WP = "https://cyberfirstseries.com/wp-content/uploads";
const S3 =
  "https://efg-final.s3.eu-north-1.amazonaws.com/speakers/cyber-first-kuwait";
const EVENT_DATE = new Date("2026-10-14T08:00:00+03:00");

// ─── Post-Event Reports data ─────────────────────────────────────────────────
type ReportEntry = {
  edition: string;
  year: string;
  title: string;
  url: string;
  filename: string;
};

const POST_EVENT_REPORTS: ReportEntry[] = [
  {
    edition: "Kuwait",
    year: "2025",
    title: "Cyber First Kuwait",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/PER+-+Cyber+First+Kuwait+2025+Edition.pdf",
    filename: "Cyber-First-Kuwait-2025-Report.pdf",
  },
  {
    edition: "Qatar",
    year: "2025",
    title: "Cyber First Qatar",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/PER+-+Cyber+First+Qatar+2025+Edition.pdf",
    filename: "Cyber-First-Qatar-2025-Report.pdf",
  },
  {
    edition: "UAE",
    year: "2026",
    title: "Cyber First UAE",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/Post+Event+Report+Cyber+First+UAE_compressed+(1).pdf",
    filename: "Cyber-First-UAE-2026-Report.pdf",
  },
];

// ─── Countdown ───────────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 });
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({
  to,
  suffix = "",
  duration = 1800,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

// ─── 3D Tilt wrapper ─────────────────────────────────────────────────────────
function Tilt({
  children,
  max = 10,
  style,
}: {
  children: React.ReactNode;
  max?: number;
  style?: React.CSSProperties;
}) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 250, damping: 22 });
  const sry = useSpring(ry, { stiffness: 250, damping: 22 });

  return (
    <motion.div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * max);
        ry.set(((e.clientX - r.left) / r.width - 0.5) * max);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 900,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
// Only confirmed speakers with premium photos
type Speaker = {
  name: string;
  title: string;
  org: string;
  photo: string | null;
  linkedin: string | null;
};

const SPEAKERS: Speaker[] = [
  {
    name: "Shaheela Banu A. Majeed",
    title: "Information Security & Compliance Officer & Auditor",
    org: "Oil & Gas / Confidential",
    photo: `${S3}/shaheela-majeed-new.jpg`,
    linkedin: "https://www.linkedin.com/in/shaheela-banu/",
  },
  {
    name: "Mohamed Rushdhi",
    title: "Head of Information Security Unit",
    org: "The Industrial Bank of Kuwait",
    photo: null,
    linkedin: "https://www.linkedin.com/in/rushdhi-mohamed-information-security/",
  },
  {
    name: "Omer Yildirim",
    title: "SVP, Chief Technology Officer",
    org: "Tiqmo",
    photo: null,
    linkedin: "https://www.linkedin.com/in/yildirimomer/",
  },
  {
    name: "Dr Fai Ben Salamah",
    title: "Cybersecurity Expert",
    org: "Kuwait Technical College",
    photo: `${S3}/dr-fai-ben-salamah-new.jpg`,
    linkedin: "https://www.linkedin.com/in/dr-fai-ben-salamah-83113b1a0/",
  },
  {
    name: "Faissal Al-Roumi",
    title: "Executive Manager of Operational Risk",
    org: "Burgan Bank",
    photo: `${S3}/faissal-al-roumi-new.jpg`,
    linkedin: "https://www.linkedin.com/in/faissal-al-roumi-mba-corp-0b2064112/",
  },
  {
    name: "Eng. Yousef H. El-Kordi",
    title: "Group Information Technology Director",
    org: "City Group",
    photo: `${S3}/yousef-el-kourdi-new.jpg`,
    linkedin: "https://www.linkedin.com/in/yousefelkordi/",
  },
  {
    name: "Sumit Tekriwal",
    title: "Head of Information Security Governance, Compliance and Privacy Unit",
    org: "KIB",
    photo: `${S3}/sumit-tekriwal.jpg`,
    linkedin: "https://www.linkedin.com/in/sumittekriwal/",
  },
];

// Kuwait 2025 photos used for the gallery + Key Topic panels (verified S3 URLs).
const KW25 = "https://efg-final.s3.eu-north-1.amazonaws.com/events/Cyber+First+Kuwait+2025/Kuwait+Photos/Kuwait+Photos";

const GALLERY: {
  src: string;
  alt: string;
  area: string;
  rotate?: number;
  lift?: boolean;
}[] = [
  {
    src: `${KW25}/4X9A2256.jpg`,
    alt: "Panel discussion on the main stage",
    area: "hero",
  },
  {
    src: `${KW25}/4X9A1934.jpg`,
    alt: "Inside the summit floor",
    area: "a",
    rotate: -1.5,
    lift: true,
  },
  {
    src: `${KW25}/4X9A2164.jpg`,
    alt: "Speaker addressing delegates",
    area: "b",
  },
  {
    src: "https://efg-final.s3.eu-north-1.amazonaws.com/kuwait/kuwait/cyber21-04-760.jpg",
    alt: "Panel session",
    area: "c",
    rotate: 1.2,
    lift: true,
  },
  {
    src: "https://efg-final.s3.eu-north-1.amazonaws.com/kuwait/kuwait/cyber21-04-87.jpg",
    alt: "Executive networking",
    area: "d",
  },
  {
    src: "https://efg-final.s3.eu-north-1.amazonaws.com/kuwait/kuwait/cyber21-04-713.jpg",
    alt: "Awards ceremony",
    area: "e",
  },
];

const FOCUS_AREAS = [
  {
    title: "AI-Powered Cyber Defense & Security Operations",
    desc: "Leveraging AI and machine learning to detect, respond, and counter sophisticated threats — modernising the SOC with autonomous defence capabilities at machine speed.",
    icon: "M12 2a4 4 0 014 4v1a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2V6a4 4 0 014-4zM9 18h6M10 22h4",
    image: `${KW25}/4X9A1519.jpg`,
    wide: true,
  },
  {
    title: "Critical Infrastructure & OT Security",
    desc: "Strengthening protection of industrial control systems, utilities, energy infrastructure, and smart city platforms against targeted cyber attacks and operational disruptions.",
    icon: "M2 20h20M4 20V10l8-6 8 6v10M9 20v-4a3 3 0 016 0v4",
    image: `${KW25}/4X9A1611.jpg`,
  },
  {
    title: "Cloud Security & Zero Trust Architecture",
    desc: "Securing hybrid and multi-cloud environments through Zero Trust principles, identity-first access controls, and continuous verification across the enterprise.",
    icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
    image: `${KW25}/4X9A1748.jpg`,
  },
  {
    title: "Cyber Resilience & Incident Response",
    desc: "Building enterprise-wide resilience frameworks, threat intelligence sharing, and rapid response capabilities to minimise breach impact and accelerate recovery.",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    image: `${KW25}/4X9A1942.jpg`,
    wide: true,
  },
  {
    title: "Data Protection, Privacy & Compliance",
    desc: "Advancing data sovereignty, regulatory compliance, privacy governance, and secure cross-border data management aligned with Kuwait's evolving frameworks.",
    icon: "M12 1a3 3 0 00-3 3v4a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M5 21h14M8 21v-4M16 21v-4",
    image: `${KW25}/4X9A2230.jpg`,
  },
  {
    title: "Third-Party & Supply Chain Risk Management",
    desc: "Managing the cascading risks of vendor ecosystems, supply chain dependencies, and software supply chain integrity in an interconnected digital economy.",
    icon: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
    image: `${KW25}/4X9A2200.jpg`,
  },
  {
    title: "Identity Security & Access Governance",
    desc: "Modernising identity architectures, privileged access management, and continuous identity verification to defend against credential-based and insider threats.",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    image: `${KW25}/4X9A2363.jpg`,
    wide: true,
  },
  {
    title: "Building Kuwait's Cybersecurity Workforce",
    desc: "Developing national talent pipelines, upskilling existing teams, and partnering with academia to address the cybersecurity skills gap across Kuwait.",
    icon: "M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z",
    image: `${KW25}/4X9A2498.jpg`,
  },
];

const GROWTH = [
  {
    year: 2024,
    delegates: 280,
    speakers: 24,
    sponsors: 22,
    media: 15,
    extra: "4 Panel Discussions · 6 Supporting Partners",
  },
  {
    year: 2025,
    delegates: 310,
    speakers: 25,
    sponsors: 25,
    media: 17,
    extra: "6-Hour Live Hackathon · 9 Supporting Partners",
  },
  {
    year: 2026,
    delegates: 350,
    speakers: 30,
    sponsors: 25,
    media: 25,
    extra: "Live CTF / Hackathon · Awards · 14 Supporting Partners",
    active: true,
  },
];

const S3_LOGOS = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo";
const SPONSORS = {
  gold: [
    { name: "Palo Alto Networks", logo: `${S3_LOGOS}/paloalto.png` },
    { name: "SentinelOne", logo: `${S3_LOGOS}/sentinelone.png` },
    { name: "Google Cloud", logo: `${S3_LOGOS}/Google-Cloud-Security.png` },
    { name: "Kaspersky", logo: `${S3_LOGOS}/kaspersky.png` },
  ],
  associate: [
    { name: "Akamai", logo: `${S3_LOGOS}/Akamai.png` },
    { name: "Secureworks", logo: `${S3_LOGOS}/secureworks.png` },
    { name: "Hackmanac", logo: null },
    { name: "ThreatLocker", logo: `${S3_LOGOS}/threatlocker.png` },
  ],
  strategic: [
    { name: "Sechard", logo: `${S3_LOGOS}/sechard.png` },
    { name: "Cyber Shield", logo: `${S3_LOGOS}/cyber-shield.png` },
    { name: "Wallix", logo: `${S3_LOGOS}/wallix.png` },
    { name: "GBM", logo: `${S3_LOGOS}/gbm.png` },
    { name: "Acronis", logo: `${S3_LOGOS}/acronis.png` },
    { name: "Bitdefender", logo: `${S3_LOGOS}/bitdefender.png` },
    { name: "Sahara Net", logo: `${S3_LOGOS}/sahara-net.png` },
    { name: "Deepinfo", logo: `${S3_LOGOS}/Deepinfo.png` },
  ],
  specialized: [
    { name: "Gorilla Technology", logo: `${S3_LOGOS}/Gorilla.png` },
    { name: "Cyber Talents", logo: `${S3_LOGOS}/cyber-talents.png` },
    { name: "GTB Technologies", logo: `${S3_LOGOS}/gtb-technologies.png` },
  ],
  supporting: [
    { name: "Kuwait College of Science & Technology", logo: null },
    { name: "Arab Open University", logo: null },
    { name: "German Business Council Kuwait", logo: null },
    { name: "ISACA UAE Chapter", logo: null },
  ],
};

// Curated tier-display for the "Featured Sponsors" section — separate from the
// full marquee. Two tiers, premium cards, gold accent on the top tier.
// `lightBg: true` forces a white card background for logos that are dark-on-transparent.
type FeaturedSponsor = { name: string; logo: string; lightBg?: boolean };
const FEATURED_SPONSORS: { gold: FeaturedSponsor[]; strategic: FeaturedSponsor[] } = {
  gold: [
    { name: "Kaspersky", logo: `${S3_LOGOS}/kaspersky.png` },
    { name: "Google Cloud Security", logo: `${S3_LOGOS}/Google+Cloud-02.png` },
  ],
  strategic: [
    { name: "Akamai", logo: `${S3_LOGOS}/Akamai.png` },
    { name: "ThreatLocker", logo: `${S3_LOGOS}/threatlocker.png` },
    { name: "ManageEngine", logo: `${S3_LOGOS}/managengine1.png` },
  ],
};

const AGENDA = [
  { time: "08:00 – 09:00", title: "Registration & Networking", type: "break" as const },
  { time: "09:00 – 09:10", title: "Opening Ceremony", subtitle: "Welcome Address by Events First Group (EFG)", type: "ceremony" as const },
  { time: "09:10 – 09:30", title: "Opening Keynote", subtitle: "Cyber Resilience for Kuwait: Securing National Infrastructure, Digital Economy & AI Innovation", type: "keynote" as const },
  { time: "09:30 – 09:45", title: "Sponsor Presentation 1", type: "sponsor" as const },
  { time: "09:45 – 10:25", title: "Panel Discussion 1 – Cyber Leadership & Governance", subtitle: "Cybersecurity at the Executive Table: Leadership, Regulation & Strategic Risk Management in a Hyper-Connected Economy", type: "panel" as const },
  { time: "10:25 – 10:40", title: "Sponsor Presentation 2", type: "sponsor" as const },
  { time: "10:40 – 11:10", title: "Coffee & Networking Break", type: "break" as const },
  { time: "11:10 – 11:30", title: "Fireside Chat", subtitle: "AI-Driven Threat Landscape: Preparing for the Next Generation of Cyber Attacks", type: "fireside" as const },
  { time: "11:30 – 12:10", title: "Panel Discussion 2 – OT & Critical Infrastructure Security", subtitle: "Securing Kuwait\u2019s Critical Infrastructure: Strengthening OT, Industrial Cybersecurity & Operational Resilience", type: "panel" as const },
  { time: "12:10 – 12:25", title: "Sponsor Presentation 3", type: "sponsor" as const },
  { time: "12:25 – 12:40", title: "Sponsor Presentation 4", type: "sponsor" as const },
  { time: "12:40 – 01:10", title: "Networking & Refreshment Break", type: "break" as const },
  { time: "01:10 – 01:50", title: "Panel Discussion 3 – Banking & Financial Cyber Resilience", subtitle: "Securing Kuwait\u2019s Financial Ecosystem: Strengthening Cyber Resilience, Fraud Prevention & Regulatory Compliance in Digital Banking", type: "panel" as const },
  { time: "01:50 – 02:30", title: "Panel Discussion 4 – Data Protection, Privacy & Digital Trust", subtitle: "Safeguarding Data in Kuwait\u2019s Expanding Digital Economy", type: "panel" as const },
  { time: "02:30 – 02:45", title: "Sponsor Presentation 5", type: "sponsor" as const },
  { time: "02:45 – 03:00", title: "Sponsor Presentation 6", type: "sponsor" as const },
  { time: "03:00 – 03:15", title: "Cyber First Awards & Raffle Draw", type: "awards" as const },
  { time: "03:15", title: "Closing Remarks & Networking Lunch", type: "closing" as const },
];

const AWARDS_DATA = [
  {
    title: "Cybersecurity Visionary of the Year",
    desc: "Recognising an individual demonstrating exceptional strategic vision in advancing Kuwait\u2019s cybersecurity posture.",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  },
  {
    title: "Secure AI & Emerging Technology Leadership",
    desc: "Honouring leadership in securing AI adoption and emerging technology integration across the enterprise.",
    icon: "M12 2a4 4 0 014 4v1a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2V6a4 4 0 014-4zM9 18h6M10 22h4",
  },
  {
    title: "Enterprise Cyber Resilience & Risk Management",
    desc: "Celebrating excellence in building enterprise-wide cyber resilience frameworks and risk governance.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  {
    title: "Critical Infrastructure Cyber Defense",
    desc: "Recognising outstanding efforts in protecting critical national infrastructure from cyber threats.",
    icon: "M2 20h20M4 20V10l8-6 8 6v10M9 20v-4a3 3 0 016 0v4",
  },
  {
    title: "Digital Trust, Privacy & Data Governance",
    desc: "Honouring commitment to data protection, privacy standards, and building digital trust ecosystems.",
    icon: "M12 1a3 3 0 00-3 3v4a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M5 21h14M8 21v-4M16 21v-4",
  },
];

const AWARDS_ELIGIBILITY = [
  "Government and regulatory authorities",
  "Enterprises and private sector organisations",
  "Banking and financial institutions",
  "Critical infrastructure operators",
  "Cybersecurity and technology innovators",
];

const WHO_ATTEND_INDUSTRIES = [
  { name: "Banking, Finance & Fintech", pct: 18 },
  { name: "Government & Public Sector", pct: 16 },
  { name: "Telecommunications & ISPs", pct: 12 },
  { name: "Oil & Gas & Energy", pct: 12 },
  { name: "Utilities & Critical Infrastructure", pct: 10 },
  { name: "Technology, Cloud & IT Services", pct: 9 },
  { name: "Healthcare & Pharmaceuticals", pct: 6 },
  { name: "Manufacturing & Industrial (OT/ICS)", pct: 6 },
  { name: "Transportation & Logistics", pct: 4 },
  { name: "Retail & E-commerce", pct: 4 },
  { name: "Education & Research Institutions", pct: 3 },
];

// ─── POST-EVENT REPORTS — modal-only (hero dropdown opens this) ─────────────
function CfkKwPostEventReports() {
  const ref = useRef<HTMLElement>(null);

  // ── Request form state ────────────────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.country === "KW") || COUNTRY_CODES[0]
  );
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  // Mount flag so the portal target (document.body) is only used after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  // Tracks which resource is being requested — drives the modal copy + metadata.
  type RequestKind = "Delegate List" | "Past Event Report";
  const [requestType, setRequestType] = useState<RequestKind>("Delegate List");
  // When requesting a Past Event Report, the user picks which edition's PDF.
  const [selectedReportUrl, setSelectedReportUrl] = useState<string>(
    POST_EVENT_REPORTS[0]?.url ?? "",
  );

  // Lock body scroll + ESC-to-close while modal is open
  useEffect(() => {
    if (!modalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  // Listen for the hero dropdown opening the modal with a chosen request type
  useEffect(() => {
    const onOpenRequest = (e: Event) => {
      const detail = (e as CustomEvent<{ type?: RequestKind }>).detail;
      if (detail?.type === "Past Event Report" || detail?.type === "Delegate List") {
        setRequestType(detail.type);
        setSubmitState("idle");
        setSubmitError("");
        setErrors({});
        setModalOpen(true);
      }
    };
    window.addEventListener("cfk-2026:open-request", onOpenRequest);
    return () => window.removeEventListener("cfk-2026:open-request", onOpenRequest);
  }, []);

  const modalCopy =
    requestType === "Past Event Report"
      ? {
          kicker: "Request the Past Event Report",
          title: "Get the post-event report.",
          subtitle:
            "Share your details and we’ll send the curated delegate list to your work email.",
          success:
            "We’ll email the post-event report PDF to your work email within 1 business day.",
        }
      : {
          kicker: "Request the Delegate List",
          title: "Get the full attendee roster.",
          subtitle:
            "Share your details and we’ll send the curated delegate list to your work email.",
          success:
            "We’ll send the delegate list to your work email within 1 business day.",
        };

  const phoneDigits = phone.replace(/[\s\-()]/g, "");
  const phoneDigitsLen = phoneDigits.length;
  const phoneIsValid = phoneDigitsLen > 0 && validatePhone(phone, countryCode) === null;

  useEffect(() => {
    if (!phoneTouched) return;
    const err = validatePhone(phone, countryCode);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next.phone = err; else delete next.phone;
      return next;
    });
  }, [phone, countryCode, phoneTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Work email is required";
    else if (!isWorkEmail(email.trim())) newErrors.email = "Please use your work email — free providers are not accepted";
    if (!jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    const phoneErr = validatePhone(phone, countryCode);
    if (phoneErr) newErrors.phone = phoneErr;
    if (!selectedReportUrl) {
      newErrors.report = "Please select an edition";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setPhoneTouched(true);
      return;
    }

    const selectedReport = POST_EVENT_REPORTS.find((r) => r.url === selectedReportUrl);

    setSubmitState("submitting");
    setSubmitError("");
    const res = await submitForm({
      type: "contact",
      full_name: fullName.trim(),
      email: email.trim(),
      job_title: jobTitle.trim(),
      phone: `${countryCode.code} ${phone.trim()}`,
      event_name: "Cyber First Kuwait 2026",
      metadata: {
        "Event Page": "Cyber First Kuwait 2026",
        "Request Type": requestType,
        "Page Section": "Post-Event Reports",
        ...(selectedReport && {
          "Selected Edition": `${selectedReport.title} ${selectedReport.year}`,
          ...(requestType === "Past Event Report" && {
            "Selected Report URL": selectedReport.url,
          }),
        }),
      },
    });
    if (res.success) {
      setSubmitState("success");
      setFullName(""); setEmail(""); setJobTitle(""); setPhone("");
    } else {
      setSubmitState("error");
      setSubmitError(res.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <section ref={ref} id="reports" aria-hidden style={{ padding: 0, margin: 0, height: 0, overflow: "hidden" }}>

      {/* ─── Request Form Modal — portalled to <body> so the popup
          overlays the whole viewport (not constrained to this section) ── */}
      {mounted && createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              className="cfk-kw-req-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setModalOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cfk-kw-req-modal-title"
            >
              <motion.div
                className="cfk-kw-req-modal-card"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.96 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cfk-kw-req-modal-close"
                  aria-label="Close request form"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <span aria-hidden className="cfk-kw-req-modal-hairline" />

                <div className="cfk-kw-req-modal-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 24, height: 1, background: C_BRIGHT }} />
                    <span style={{
                      fontFamily: "var(--font-dm)",
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.32em", textTransform: "uppercase",
                      color: C_BRIGHT,
                    }}>{modalCopy.kicker}</span>
                  </div>
                  <h3 id="cfk-kw-req-modal-title" style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(20px, 2.4vw, 26px)",
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                    color: "white",
                    lineHeight: 1.2,
                  }}>
                    {modalCopy.title}
                  </h3>
                  <p style={{
                    margin: "10px 0 0",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.55,
                  }}>
                    {modalCopy.subtitle}
                  </p>
                </div>

                {submitState === "success" ? (
                  <div className="cfk-kw-req-modal-success">
                    <div className="cfk-kw-req-modal-success-check">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h4>Request received.</h4>
                    <p>{modalCopy.success}</p>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="cfk-kw-req-modal-done"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="cfk-kw-req-form-fields">
                    {/* Honeypot */}
                    <input type="text" name="website" tabIndex={-1} autoComplete="off"
                      style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

                    {/* Edition picker — used by both Delegate List and Past Event Report requests */}
                    <div className="cfk-kw-req-form-row">
                      <label className="cfk-kw-req-form-field" style={{ flex: "1 1 100%" }}>
                        <span className="cfk-kw-req-form-label">Select Edition</span>
                        <select
                          value={selectedReportUrl}
                          onChange={(e) => {
                            setSelectedReportUrl(e.target.value);
                            if (errors.report) setErrors({ ...errors, report: "" });
                          }}
                          className="cfk-kw-req-form-input cfk-kw-req-form-report-select"
                          aria-invalid={!!errors.report}
                        >
                          {POST_EVENT_REPORTS.map((r) => (
                            <option key={r.url} value={r.url}>
                              {r.title} {r.year}
                            </option>
                          ))}
                        </select>
                        {errors.report && <span className="cfk-kw-req-form-err">{errors.report}</span>}
                      </label>
                    </div>

                    <div className="cfk-kw-req-form-row">
                      <label className="cfk-kw-req-form-field">
                        <span className="cfk-kw-req-form-label">Full Name</span>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors({ ...errors, fullName: "" }); }}
                          placeholder="Your full name"
                          autoComplete="name"
                          className="cfk-kw-req-form-input"
                          aria-invalid={!!errors.fullName}
                        />
                        {errors.fullName && <span className="cfk-kw-req-form-err">{errors.fullName}</span>}
                      </label>

                      <label className="cfk-kw-req-form-field">
                        <span className="cfk-kw-req-form-label">Work Email</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }}
                          placeholder="name@company.com"
                          autoComplete="email"
                          className="cfk-kw-req-form-input"
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && <span className="cfk-kw-req-form-err">{errors.email}</span>}
                      </label>
                    </div>

                    <div className="cfk-kw-req-form-row">
                      <label className="cfk-kw-req-form-field">
                        <span className="cfk-kw-req-form-label">Job Title</span>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => { setJobTitle(e.target.value); if (errors.jobTitle) setErrors({ ...errors, jobTitle: "" }); }}
                          placeholder="CISO, Head of IT, CIO…"
                          autoComplete="organization-title"
                          className="cfk-kw-req-form-input"
                          aria-invalid={!!errors.jobTitle}
                        />
                        {errors.jobTitle && <span className="cfk-kw-req-form-err">{errors.jobTitle}</span>}
                      </label>

                      <label className="cfk-kw-req-form-field">
                        <span className="cfk-kw-req-form-label">
                          Phone
                          <span className="cfk-kw-req-form-hint-inline">
                            {countryCode.length} digits expected
                          </span>
                        </span>
                        <div className="cfk-kw-req-form-phone-row">
                          <select
                            value={`${countryCode.country}-${countryCode.code}`}
                            onChange={(e) => {
                              const [country, code] = e.target.value.split("-");
                              const found = COUNTRY_CODES.find((c) => c.country === country && c.code === code);
                              if (found) {
                                setCountryCode(found);
                                setPhone((prev) => prev.replace(/\D/g, "").slice(0, found.length));
                              }
                            }}
                            className="cfk-kw-req-form-cc"
                            aria-label="Country code"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={`${c.country}-${c.code}`} value={`${c.country}-${c.code}`}>
                                {c.country} {c.code}
                              </option>
                            ))}
                          </select>
                          <div className="cfk-kw-req-form-phone-wrap">
                            <input
                              type="tel"
                              inputMode="numeric"
                              value={phone}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, countryCode.length);
                                setPhone(digits);
                              }}
                              onBlur={() => setPhoneTouched(true)}
                              placeholder={countryCode.placeholder}
                              autoComplete="tel-national"
                              maxLength={countryCode.length}
                              className="cfk-kw-req-form-input cfk-kw-req-form-phone-input"
                              aria-invalid={!!errors.phone}
                            />
                            {phoneTouched && phoneIsValid && (
                              <span aria-hidden className="cfk-kw-req-form-phone-check">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                            )}
                          </div>
                        </div>
                        {phoneTouched && !phoneIsValid && phoneDigitsLen > 0 && !errors.phone && (
                          <span className="cfk-kw-req-form-phone-progress">
                            {phoneDigitsLen} / {countryCode.length} digits
                          </span>
                        )}
                        {errors.phone && <span className="cfk-kw-req-form-err">{errors.phone}</span>}
                      </label>
                    </div>

                    {submitError && (
                      <div className="cfk-kw-req-form-submit-err">{submitError}</div>
                    )}

                    <button
                      type="submit"
                      disabled={submitState === "submitting"}
                      className="cfk-kw-req-form-submit"
                    >
                      {submitState === "submitting"
                        ? "Sending…"
                        : requestType === "Past Event Report"
                        ? "Send me the report"
                        : "Send me the delegate list"}
                      {submitState !== "submitting" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}>
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      )}
                    </button>
                    <p className="cfk-kw-req-form-hint">
                      We respect your inbox. Used only to send the delegate list and edition follow-ups.
                    </p>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <style jsx global>{`
        /* ── Modal overlay + card ────────────────────────────────────────── */
        .cfk-kw-req-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(16px, 3vw, 32px);
          background: rgba(2, 6, 14, 0.78);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
        }
        .cfk-kw-req-modal-card {
          position: relative;
          width: 100%;
          max-width: 580px;
          max-height: calc(100vh - clamp(32px, 6vw, 64px));
          overflow-y: auto;
          padding: clamp(24px, 3vw, 36px);
          background: linear-gradient(165deg, rgba(8, 18, 32, 0.94) 0%, rgba(4, 8, 16, 0.97) 100%);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 20px;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.16),
            inset 0 -1px 0 rgba(0,0,0,0.45),
            0 24px 56px rgba(0,0,0,0.55),
            0 48px 96px rgba(0,0,0,0.45);
        }
        .cfk-kw-req-modal-hairline {
          position: absolute;
          top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent 0%, ${C} 30%, ${C_BRIGHT} 70%, transparent 100%);
          opacity: 0.8;
        }
        .cfk-kw-req-modal-close {
          position: absolute;
          top: 14px; right: 14px;
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .cfk-kw-req-modal-close:hover {
          color: white;
          border-color: ${C_BRIGHT}66;
          background: ${C}1a;
          transform: rotate(90deg);
        }
        .cfk-kw-req-modal-header {
          margin-bottom: clamp(18px, 2vw, 22px);
          padding-right: 36px;
        }
        .cfk-kw-req-modal-success {
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: clamp(8px, 1vw, 12px) 0 4px;
        }
        .cfk-kw-req-modal-success-check {
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 56px; height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${C}, ${C_BRIGHT});
          margin-bottom: 16px;
          box-shadow: 0 8px 24px ${C}66;
        }
        .cfk-kw-req-modal-success h4 {
          margin: 0 0 8px;
          font-family: var(--font-display);
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 700;
          color: white;
        }
        .cfk-kw-req-modal-success p {
          margin: 0 0 22px;
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.55;
          max-width: 380px;
        }
        .cfk-kw-req-modal-done {
          padding: 10px 28px;
          background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%);
          border: 1px solid ${C_BRIGHT}55;
          border-radius: 10px;
          color: white;
          font-family: var(--font-outfit);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: transform 0.3s ease, filter 0.3s ease;
        }
        .cfk-kw-req-modal-done:hover {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }
        @media (max-width: 540px) {
          .cfk-kw-req-modal-card { padding: 22px 18px; border-radius: 16px; }
          .cfk-kw-req-modal-header { padding-right: 30px; }
        }

        /* ── Form fields ─────────────────────────────────────────────────── */
        .cfk-kw-req-form-fields {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          gap: clamp(14px, 1.8vw, 18px);
        }
        .cfk-kw-req-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(12px, 1.6vw, 18px);
        }
        .cfk-kw-req-form-field {
          display: flex; flex-direction: column;
          gap: 6px;
        }
        .cfk-kw-req-form-label {
          font-family: var(--font-outfit);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .cfk-kw-req-form-hint-inline {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: none;
          color: rgba(255,255,255,0.35);
        }
        .cfk-kw-req-form-phone-wrap {
          position: relative;
          flex: 1;
        }
        .cfk-kw-req-form-phone-check {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${C}, ${C_BRIGHT});
          color: white;
          box-shadow: 0 2px 8px ${C}66;
          pointer-events: none;
        }
        .cfk-kw-req-form-phone-progress {
          font-family: var(--font-outfit);
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          font-variant-numeric: tabular-nums;
          margin-top: 2px;
        }
        .cfk-kw-req-form-input {
          width: 100%;
          padding: 12px 14px;
          background: rgba(0,0,0,0.30);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          color: white;
          font-family: var(--font-outfit);
          font-size: 14.5px;
          line-height: 1.4;
          outline: none;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }
        .cfk-kw-req-form-input::placeholder {
          color: rgba(255,255,255,0.30);
        }
        .cfk-kw-req-form-input:focus {
          border-color: ${C_BRIGHT};
          background: rgba(0,0,0,0.40);
          box-shadow: 0 0 0 3px ${C}33;
        }
        .cfk-kw-req-form-input[aria-invalid="true"] {
          border-color: rgba(255,80,80,0.6);
        }
        /* Edition picker — native select with a custom cyan chevron */
        .cfk-kw-req-form-report-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          padding-right: 40px;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1l5 5 5-5' stroke='%2301BBF5' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>");
          background-repeat: no-repeat;
          background-position: right 14px center;
          cursor: pointer;
        }
        .cfk-kw-req-form-report-select option {
          background: #0a1320;
          color: white;
        }
        .cfk-kw-req-form-phone-row {
          display: flex;
          gap: 8px;
        }
        .cfk-kw-req-form-cc {
          padding: 12px 10px;
          background: rgba(0,0,0,0.30);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          color: white;
          font-family: var(--font-outfit);
          font-size: 14px;
          outline: none;
          cursor: pointer;
          max-width: 110px;
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .cfk-kw-req-form-cc:focus {
          border-color: ${C_BRIGHT};
          box-shadow: 0 0 0 3px ${C}33;
        }
        .cfk-kw-req-form-cc option {
          background: #0a1320;
          color: white;
        }
        .cfk-kw-req-form-phone-input {
          flex: 1;
          width: 100%;
          padding-right: 40px;
        }
        .cfk-kw-req-form-err {
          font-family: var(--font-outfit);
          font-size: 12px;
          color: #ff7a7a;
          margin-top: 2px;
        }
        .cfk-kw-req-form-submit-err {
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255, 80, 80, 0.10);
          border: 1px solid rgba(255, 80, 80, 0.30);
          color: #ff9a9a;
          font-family: var(--font-outfit);
          font-size: 13.5px;
        }
        .cfk-kw-req-form-submit {
          display: inline-flex;
          align-items: center; justify-content: center;
          padding: 14px 24px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: linear-gradient(135deg, ${C}, ${C_BRIGHT});
          color: white;
          font-family: var(--font-outfit);
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          align-self: flex-start;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, filter 0.25s ease;
          box-shadow: 0 8px 20px ${C}55, inset 0 1px 0 rgba(255,255,255,0.18);
        }
        .cfk-kw-req-form-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.08);
          box-shadow: 0 12px 28px ${C}77, inset 0 1px 0 rgba(255,255,255,0.22);
        }
        .cfk-kw-req-form-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .cfk-kw-req-form-hint {
          font-family: var(--font-outfit);
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin: 4px 0 0;
        }
        @media (max-width: 640px) {
          .cfk-kw-req-form-row {
            grid-template-columns: 1fr !important;
          }
          .cfk-kw-req-form-submit {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function CyberFirstKuwait2026() {
  return (
    <div style={{
      background: `
        radial-gradient(ellipse 70% 20% at 15% 12%, ${C}12 0%, transparent 65%),
        radial-gradient(ellipse 60% 18% at 88% 30%, ${C}0a 0%, transparent 65%),
        radial-gradient(ellipse 65% 22% at 22% 52%, ${C}10 0%, transparent 65%),
        radial-gradient(ellipse 60% 18% at 80% 70%, ${C}0a 0%, transparent 65%),
        radial-gradient(ellipse 55% 20% at 18% 88%, ${C}0c 0%, transparent 65%),
        linear-gradient(180deg, #050810 0%, #030608 55%, #000000 100%)
      `,
    }}>
      {/* Global Mobile Styles */}
      <style jsx global>{`
        /* Hero mobile */
        @media (max-width: 768px) {
          .cfk-hero-section h1 {
            font-size: clamp(28px, 8vw, 42px) !important;
            max-width: 100% !important;
          }
          .cfk-hero-content {
            padding: 0 20px !important;
          }
        }
        
        /* Stats bar mobile */
        @media (max-width: 480px) {
          .cfk-stats-grid > div {
            padding: 12px 8px !important;
          }
          .cfk-stats-grid > div > div:first-child {
            width: 28px !important;
            height: 28px !important;
          }
        }
        
        /* Speakers grid mobile */
        @media (max-width: 600px) {
          .cfk-speakers-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
        
        /* Awards mobile */
        @media (max-width: 900px) {
          .cfk-awards-top {
            grid-template-columns: 1fr !important;
          }
          .cfk-awards-nom {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Split CTA mobile */
        @media (max-width: 900px) {
          .cfk-split-cta {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Advisory board mobile */
        @media (max-width: 500px) {
          .cfk-advisory-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .cfk-advisory-grid > div {
            padding: 16px 12px !important;
          }
        }
        
        /* Expect grid mobile */
        @media (max-width: 600px) {
          .cfk-expect-grid > div {
            min-height: 200px !important;
          }
        }
        
        /* General text scaling */
        @media (max-width: 480px) {
          h2 {
            font-size: clamp(24px, 7vw, 36px) !important;
          }
        }
      `}</style>
      
      <EventNavigation />
      <HeroSection />
      <MarketContext />
      <FocusAreas />
      <AdvisoryBoard />
      <Speakers />
      <FeaturedSponsors />
      <AgendaTimeline />
      <SponsorsSection />
      <GrowthStory />
      <AtmosphereDivider />
      <Gallery />
      <WhatToExpect />
      <WhoShouldAttend />
      <AwardsSection />
      <FromTheRoom />
      <RegistrationSection />
      <ContactSection />
      <Venue />
      <CfkKwPostEventReports />
      <Footer />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const cd = useCountdown(EVENT_DATE);
  const [resourceMenuOpen, setResourceMenuOpen] = useState(false);
  const resourceMenuRef = useRef<HTMLDivElement>(null);

  // Click-outside + ESC closes the resources dropdown
  useEffect(() => {
    if (!resourceMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (resourceMenuRef.current && !resourceMenuRef.current.contains(e.target as Node)) {
        setResourceMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setResourceMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [resourceMenuOpen]);

  const openRequest = (type: "Past Event Report" | "Delegate List") => {
    setResourceMenuOpen(false);
    window.dispatchEvent(
      new CustomEvent("cfk-2026:open-request", { detail: { type } }),
    );
  };

  return (
    <section
      className="cfk-hero-section"
      style={{
        position: "relative",
        minHeight: "100dvh",
        overflow: "hidden",
        background: "#050810",
      }}
    >
      {/* ═══ LAYER 0: Full-bleed background image — Kuwait 2025 main hall ═══ */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://efg-final.s3.eu-north-1.amazonaws.com/events/Cyber+First+Kuwait+2025/Kuwait+Photos/Kuwait+Photos/4X9A1744.jpg"
          alt="Cyber First Kuwait 2025 main hall — past edition"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.55) saturate(1.05) contrast(1.04)", objectPosition: "center" }}
        />
      </div>

      {/* ═══ LAYER 1: Cinematic gradient stack ═══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, rgba(5,8,16,0.94) 0%, rgba(5,8,16,0.82) 32%, rgba(5,8,16,0.40) 60%, rgba(5,8,16,0.15) 100%)`,
          zIndex: 1,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(5,8,16,0.55) 0%, transparent 28%, transparent 65%, rgba(5,8,16,0.95) 100%)`,
          zIndex: 1,
        }}
      />
      {/* Radial cyan atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 45% at 22% 30%, ${C}18 0%, transparent 65%)`,
          zIndex: 1,
        }}
      />

      {/* ═══ LAYER 2: Atmospheric effects ═══ */}
      <NeuralConstellation color={C} dotCount={32} connectionDistance={150} speed={0.18} opacity={0.07} />
      <DotMatrixGrid color={C} opacity={0.014} spacing={36} />

      {/* Cyber hairline grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${C}05 1px, transparent 1px), linear-gradient(90deg, ${C}05 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 75%)",
          opacity: 0.55,
          zIndex: 2,
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          zIndex: 4,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ═══ CONTENT ═══ */}
      <div
        className="cfk-hero-content"
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: 1320,
          margin: "0 auto",
          padding: "clamp(100px, 14vh, 140px) clamp(24px, 5vw, 80px) clamp(140px, 16vh, 180px)",
        }}
      >
        {/* ═══ Top row — Edition mark (left) · Date+City badge (right) ═══ */}
        <div
          className="cfk-hero-toprow"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "clamp(24px, 4vh, 44px)",
            gap: 20,
          }}
        >
          {/* Series + Edition mark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}
          >
            <span style={{
              fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 800,
              letterSpacing: "2.5px", textTransform: "uppercase", color: C_BRIGHT,
            }}>
              Cyber First Series
            </span>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              padding: "12px 22px",
              borderRadius: 14,
              background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.25), 0 8px 32px rgba(0,0,0,0.4)",
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: 2, background: C,
                boxShadow: `0 0 10px ${C}, 0 0 18px ${C}60`,
              }} />
              <span style={{
                fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700,
                color: "white", letterSpacing: "-0.005em",
              }}>
                3rd Annual Edition
              </span>
            </div>
          </motion.div>

          {/* Date + City glass badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="cfk-hero-datebadge"
            style={{
              display: "inline-flex", alignItems: "center", gap: 14,
              padding: "12px 24px",
              borderRadius: 50,
              background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: C_BRIGHT,
              boxShadow: `0 0 8px ${C_BRIGHT}, 0 0 16px ${C_BRIGHT}60`,
            }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: "white" }}>
              14 OCT 2026
            </span>
            <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.15)", borderRadius: 1 }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
              KUWAIT CITY
            </span>
          </motion.div>
        </div>

        {/* Main headline — split editorial */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(42px, 7vw, 90px)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            margin: 0,
          }}>
            Cyber
          </h1>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(42px, 7vw, 90px)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: C_BRIGHT,
            margin: "0 0 clamp(12px, 2vh, 20px) 0",
          }}>
            Sovereignty
          </h1>
        </motion.div>

        {/* Italic cyan subhead */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontStyle: "italic",
            fontSize: "clamp(18px, 2.5vw, 30px)",
            lineHeight: 1.2,
            color: C_BRIGHT,
            margin: "0 0 clamp(24px, 4vh, 36px) 0",
            maxWidth: 540,
          }}
        >
          Building National Cyber Resilience for a Digitally Sovereign Kuwait
        </motion.h2>

        {/* CTAs — primary + Request Resources dropdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
        >
          {/* Reserve Your Seat */}
          <a
            href="#register"
            onClick={(e) => { e.preventDefault(); document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 36px)",
              borderRadius: 50,
              background: C,
              color: "white",
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(13px, 1.1vw, 15px)",
              fontWeight: 600,
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: `0 4px 24px ${C}50`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C_BRIGHT; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Reserve Your Seat <span>→</span>
          </a>

          {/* Request Resources dropdown */}
          <div ref={resourceMenuRef} style={{ position: "relative", display: "inline-block" }}>
            <button
              type="button"
              onClick={() => setResourceMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={resourceMenuOpen}
              className="cfk-req-ghost"
              suppressHydrationWarning
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "clamp(12px, 1.5vw, 16px) clamp(22px, 2.8vw, 32px)",
                borderRadius: 50,
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.9)",
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(13px, 1.1vw, 15px)",
                fontWeight: 500,
                border: "1px solid rgba(255,255,255,0.18)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              Request Resources
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: resourceMenuOpen ? "rotate(0)" : "rotate(180deg)",
                  transition: "transform 0.25s ease",
                  opacity: 0.8,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {resourceMenuOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: 0,
                    minWidth: 320,
                    padding: 6,
                    borderRadius: 18,
                    background: "rgba(5, 8, 16, 0.92)",
                    border: `1px solid ${C_BRIGHT}3a`,
                    backdropFilter: "blur(18px) saturate(180%)",
                    WebkitBackdropFilter: "blur(18px) saturate(180%)",
                    boxShadow: "0 22px 50px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
                    zIndex: 30,
                  }}
                >
                  <button
                    role="menuitem"
                    onClick={() => openRequest("Past Event Report")}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      width: "100%", padding: "12px 14px",
                      borderRadius: 12,
                      background: "transparent",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${C}15`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${C}20`, border: `1px solid ${C}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    </span>
                    <span>
                      <div style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600 }}>Past Event Report</div>
                      <div style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
                        Highlights from Kuwait 2025
                      </div>
                    </span>
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => openRequest("Delegate List")}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      width: "100%", padding: "12px 14px",
                      borderRadius: 12,
                      background: "transparent",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${C}15`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${C}20`, border: `1px solid ${C}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </span>
                    <span>
                      <div style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600 }}>Delegate List</div>
                      <div style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
                        Past attendees & job titles
                      </div>
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ═══ BOTTOM BAR: refined premium countdown strip ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
        className="absolute bottom-0 left-0 right-0"
        style={{
          zIndex: 20,
          background: "linear-gradient(180deg, rgba(5,8,16,0.5) 0%, rgba(5,8,16,0.92) 50%, rgba(5,8,16,0.96) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: `1px solid ${C}22`,
          padding: "18px 0",
        }}
      >
        <div
          className="cfk-bottom-bar"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            maxWidth: 1320,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 80px)",
            gap: 24,
          }}
        >
          {/* Left: venue */}
          <div className="cfk-bar-venue" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, color: "white", letterSpacing: "0.01em" }}>
              Jumeirah Messilah Beach Hotel
            </span>
            <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 4px" }}>·</span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.55)" }}>
              Kuwait City
            </span>
          </div>

          {/* Center: Premium countdown */}
          <div className="cfk-bar-countdown" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{
              fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 700,
              letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)",
            }}>
              Begins in
            </span>
            {[
              { v: cd.d, l: "Days" },
              { v: cd.h, l: "Hrs" },
              { v: cd.m, l: "Min" },
              { v: cd.s, l: "Sec" },
            ].map((u, i, arr) => (
              <div key={u.l} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ textAlign: "center" }}>
                  <span
                    className="tabular-nums"
                    style={{
                      fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800,
                      color: C_BRIGHT, letterSpacing: "-0.04em", lineHeight: 1,
                      textShadow: `0 0 18px ${C_BRIGHT}40`,
                    }}
                  >
                    {String(u.v).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 600,
                      letterSpacing: "2px", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)", display: "block", marginTop: 4,
                    }}
                  >
                    {u.l}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: `${C}25`, fontSize: 18, fontWeight: 300, lineHeight: 0 }}>·</span>
                )}
              </div>
            ))}
          </div>

          {/* Right: CTA */}
          <Link
            href="#register"
            className="cfk-bar-cta transition-all"
            style={{
              padding: "12px 26px",
              borderRadius: 50,
              background: C,
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 600,
              color: "white",
              textDecoration: "none",
              boxShadow: `0 4px 20px ${C}40`,
              letterSpacing: "0.01em",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}
          >
            Register Now <span>→</span>
          </Link>
        </div>
      </motion.div>

      {/* ═══ Keyframes ═══ */}
      <style jsx global>{`
        @keyframes cfkShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .cfk-shimmer {
          animation: cfkShimmer 6s ease-in-out infinite;
        }
        .cfk-bar-cta:hover {
          background: ${C_BRIGHT} !important;
          transform: translateY(-1px);
        }
        .cfk-req-ghost:hover {
          background: rgba(255,255,255,0.10) !important;
          border-color: rgba(255,255,255,0.28) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 960px) {
          .cfk-hero-toprow {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 18px !important;
          }
          .cfk-hero-datebadge {
            align-self: flex-start;
          }
        }
        @media (max-width: 768px) {
          .cfk-hero-content {
            padding-top: 110px !important;
            padding-bottom: 200px !important;
          }
          .cfk-bottom-bar {
            flex-direction: column !important;
            gap: 14px !important;
            text-align: center;
            align-items: stretch !important;
          }
          .cfk-bar-venue { justify-content: center; flex-wrap: wrap; }
          .cfk-bar-countdown { justify-content: center; flex-wrap: wrap; }
          .cfk-bar-cta { width: 100%; text-align: center; justify-content: center; padding: 14px 26px !important; }
        }
      `}</style>
    </section>
  );
}


// ─── Gallery ──────────────────────────────────────────────────────────────────
function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      style={{
        background: "transparent",
        padding: "clamp(40px,5vw,72px) 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 40% 50%, ${C}08, transparent 70%)`,
        }}
      />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px,4vw,60px)", position: "relative" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: 56 }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: C,
              }}
            >
              From Past Editions
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px,3.8vw,52px)",
              letterSpacing: "-1.5px",
              color: "white",
              lineHeight: 1.08,
              margin: 0,
            }}
          >
            Inside the Cyber First Experience
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: "#707070",
              lineHeight: 1.6,
              maxWidth: 460,
              margin: "12px 0 0",
            }}
          >
            Moments captured from our conferences worldwide.
          </p>
        </motion.div>

        {/* ── Bento + Collage Grid ── */}
        {/*
          Layout (desktop):
          ┌─────────────┬─────────────┬───────┬───────┐
          │             │             │   a   │   b   │
          │    hero     │    hero     │ (rot) │       │
          │             │             ├───────┼───────┤
          │             │             │   d   │   c   │
          ├─────────────┴─────────────┤       │ (rot) │
          │           e               │       │       │
          └───────────────────────────┴───────┴───────┘
        */}
        <div className="cfk-bento-grid">
          {GALLERY.map((img, i) => {
            const isHovered = hoveredIdx === i;
            const shouldDim = hoveredIdx !== null && hoveredIdx !== i;
            const baseRotate = img.rotate ?? 0;

            return (
              <motion.div
                key={img.src}
                className={`cfk-bento-${img.area}`}
                initial={{ opacity: 0, y: 30, rotate: baseRotate }}
                animate={
                  inView
                    ? { opacity: 1, y: 0, rotate: baseRotate }
                    : {}
                }
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: img.lift
                    ? isHovered
                      ? `0 20px 60px rgba(1,187,245,0.15), 0 8px 24px rgba(0,0,0,0.5)`
                      : `0 8px 32px rgba(0,0,0,0.4)`
                    : isHovered
                      ? `0 12px 40px rgba(0,0,0,0.4)`
                      : "none",
                  zIndex: img.lift ? 2 : 1,
                  transition: "box-shadow 0.5s cubic-bezier(0.16,1,0.3,1), filter 0.5s cubic-bezier(0.16,1,0.3,1)",
                  filter: shouldDim
                    ? "brightness(0.45) saturate(0.7)"
                    : "brightness(1) saturate(1)",
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  style={{
                    transform: isHovered ? "scale(1.06)" : "scale(1)",
                    transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />

                {/* Bottom gradient */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(to top, rgba(3,8,16,0.6) 0%, rgba(3,8,16,0.1) 40%, transparent 100%)",
                  }}
                />

                {/* Cyan tint on hover */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, rgba(1,187,245,0.08) 0%, transparent 60%)`,
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                />

                {/* Caption on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  style={{
                    padding: "20px 24px",
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "translateY(0)" : "translateY(10px)",
                    transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.9)",
                      textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                    }}
                  >
                    {img.alt}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Bento grid CSS */}
      <style jsx global>{`
        .cfk-bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: 220px 220px 180px;
          grid-template-areas:
            "hero hero a    b"
            "hero hero d    c"
            "e    e    d    c";
          gap: 14px;
        }
        .cfk-bento-hero { grid-area: hero; }
        .cfk-bento-a    { grid-area: a; }
        .cfk-bento-b    { grid-area: b; }
        .cfk-bento-c    { grid-area: c; }
        .cfk-bento-d    { grid-area: d; }
        .cfk-bento-e    { grid-area: e; }

        @media (max-width: 1024px) {
          .cfk-bento-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: 260px 200px 200px;
            grid-template-areas:
              "hero hero a"
              "hero hero b"
              "c    d    e";
          }
        }

        @media (max-width: 640px) {
          .cfk-bento-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 280px 180px 180px 180px;
            grid-template-areas:
              "hero hero"
              "a    b"
              "c    d"
              "e    e";
            gap: 10px;
          }
          /* Remove rotations on mobile */
          .cfk-bento-grid > div {
            transform: rotate(0deg) !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Market Context (Premium Uplift) ─────────────────────────────────────────
function MarketContext() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: 300, suffix: "+", label: "Delegates", note: "CISOs & C-Suite Leaders", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75", badge: "Summit", highlight: true },
    { value: 25, suffix: "+", label: "Speakers", note: "Industry & Government Leaders", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", badge: "Keynote" },
    { value: 25, suffix: "", label: "Sponsors", note: "Technology Partners", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", badge: "Partners" },
    { value: 1, suffix: "", label: "Day", note: "Full Executive Summit", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", badge: "14 Oct" },
  ];

  return (
    <section
      ref={ref}
      className="cfk-market-section"
      style={{
        position: "relative",
        padding: "clamp(40px,5vw,72px) 0",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      {/* ═══ BACKGROUND LAYERS ═══ */}
      {/* Static cyber grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${C}08 1px, transparent 1px),
            linear-gradient(90deg, ${C}08 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: 0.4,
        }}
      />

      {/* Central glow orb (static) */}
      <div
        className="absolute pointer-events-none cfk-market-orb"
        style={{
          width: "120%",
          height: "100%",
          left: "-10%",
          top: 0,
          background: `radial-gradient(ellipse 50% 70% at 50% 30%, ${C}15, transparent 70%)`,
        }}
      />

      {/* ═══ CONTENT ═══ */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative", zIndex: 1 }}>
        {/* ═══ ROW 1: Overview text (left) · Video 1 (right) ═══ */}
        <div className="cfk-eo-row cfk-eo-row-1">
          {/* LEFT: eyebrow + title + paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            className="cfk-eo-text"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 22px",
                borderRadius: 50,
                background: `linear-gradient(135deg, ${C}20 0%, ${C}08 100%)`,
                border: `1px solid ${C}40`,
                marginBottom: 24,
                boxShadow: `0 0 40px ${C}15, inset 0 1px 0 ${C}30`,
              }}
            >
              <span
                className="cfk-pulse-dot"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C_BRIGHT,
                  boxShadow: `0 0 12px ${C}`,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: C_BRIGHT,
                }}
              >
                Event Overview
              </span>
            </motion.div>

            {/* Title — left-aligned, sized for half-width column */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(30px, 3.6vw, 52px)",
                letterSpacing: "-1.5px",
                lineHeight: 1.05,
                margin: "0 0 22px",
              }}
            >
              <span style={{ color: "white" }}>Cyber First Kuwait</span>
              <br />
              <span
                className="cfk-title-glow"
                style={{
                  background: `linear-gradient(135deg, ${C_BRIGHT} 0%, ${C} 50%, #fff 100%)`,
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: `drop-shadow(0 0 30px ${C}50)`,
                }}
              >
                Summit 2026
              </span>
            </motion.h2>

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 400,
                fontSize: "clamp(15px, 1.1vw, 17px)",
                color: "rgba(255,255,255,0.62)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Bringing together 300+ CISOs, cybersecurity leaders, government officials, technology executives, and business decision-makers for a high-impact forum focused on advancing Kuwait&apos;s cyber resilience and secure digital future. As Kuwait accelerates its digital transformation through cloud adoption, smart government services, AI innovation, 5G infrastructure, and Vision 2035 initiatives — cybersecurity has become a national priority.
            </motion.p>
          </motion.div>

          {/* RIGHT: Video 1 — 2025 Edition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="cfk-eo-media"
          >
            <KuwaitPastVideo videoId="gR-IUI7yJLg" title="Cyber First Kuwait — 3rd Edition" edition="2025 Edition" />
          </motion.div>
        </div>

        {/* ═══ ROW 2: Video 2 (left) · 2x2 Stats (right) ═══ */}
        <div className="cfk-eo-row cfk-eo-row-2">
          {/* LEFT: Video 2 — 2024 Edition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="cfk-eo-media"
          >
            <KuwaitPastVideo videoId="wcEeU0UEl0o" title="Cyber First Kuwait — Event Highlights" edition="2024 Edition" />
          </motion.div>

          {/* RIGHT: 2x2 stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="cfk-eo-stats"
          >
            {stats.map((s, i) => (
              <MarketCard key={s.label} stat={s} delay={0.3 + i * 0.1} inView={inView} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8, ease: EASE }}
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C}40, ${C}, ${C}40, transparent)`,
            marginTop: 48,
            transformOrigin: "center",
          }}
        />
      </div>

      {/* ═══ CSS ═══ */}
      <style jsx global>{`
        /* ═══ Split alternating rows ═══ */
        .cfk-eo-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .cfk-eo-row-1 {
          margin-bottom: 48px;
        }
        .cfk-eo-text {
          padding-right: 8px;
        }
        .cfk-eo-media {
          width: 100%;
        }
        /* 2x2 stats grid on the right of Row 2 */
        .cfk-eo-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .cfk-eo-row {
            gap: 32px;
          }
        }
        @media (max-width: 900px) {
          .cfk-eo-row {
            grid-template-columns: 1fr !important;
            gap: 28px;
          }
          .cfk-eo-row-1 {
            margin-bottom: 32px !important;
          }
          /* Mobile order: Row 1 [text → video1] (natural), Row 2 [video2 → stats] (natural) */
          .cfk-eo-text {
            padding-right: 0 !important;
          }
        }
        @media (max-width: 600px) {
          .cfk-eo-stats {
            gap: 14px !important;
          }
        }
        @media (max-width: 420px) {
          .cfk-eo-stats {
            grid-template-columns: 1fr !important;
          }
        }
        .cfk-past-video-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 16 / 9;
          background: rgba(255,255,255,0.04);
          border: 1px solid ${C}25;
          box-shadow: 0 18px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 80px ${C}05;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s, box-shadow 0.4s;
        }
        .cfk-past-video-card:hover {
          transform: translateY(-4px);
          border-color: ${C_BRIGHT}55;
          box-shadow: 0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 100px ${C}15;
        }
        .cfk-past-video-thumb {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.5s;
        }
        .cfk-past-video-card:hover .cfk-past-video-thumb {
          transform: scale(1.04);
          filter: brightness(1.05);
        }
        .cfk-past-video-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(5,8,16,0.15) 0%, rgba(5,8,16,0.25) 55%, rgba(5,8,16,0.78) 100%);
          pointer-events: none;
        }
        .cfk-past-video-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 78px;
          height: 78px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.4) inset;
          transition: background 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .cfk-past-video-card:hover .cfk-past-video-play {
          background: ${C};
          transform: translate(-50%, -50%) scale(1.08);
        }
        .cfk-past-video-play svg {
          fill: #0a1828;
          transition: fill 0.3s;
        }
        .cfk-past-video-card:hover .cfk-past-video-play svg {
          fill: white;
        }
        .cfk-past-video-label {
          position: absolute;
          left: 18px;
          bottom: 18px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: 50px;
          background: rgba(5,8,16,0.7);
          backdrop-filter: blur(12px);
          border: 1px solid ${C}30;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.4);
        }
      `}</style>
    </section>
  );
}

// ─── Past edition video card ─────────────────────────────────────────────────
function KuwaitPastVideo({ videoId, title, edition }: { videoId: string; title: string; edition: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="cfk-past-video-card" onClick={() => !playing && setPlaying(true)}>
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="cfk-past-video-thumb"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
          />
          <div className="cfk-past-video-overlay" />
          <div className="cfk-past-video-play">
            <svg width="22" height="22" viewBox="0 0 24 24" style={{ marginLeft: 3 }}>
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
          <div className="cfk-past-video-label">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 8px ${C_BRIGHT}` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "white" }}>
              {edition}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function MarketCard({
  stat,
  delay,
  inView,
  index,
}: {
  stat: { value: number; suffix: string; label: string; note: string; icon?: string; badge?: string; highlight?: boolean };
  delay: number;
  inView: boolean;
  index: number;
}) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  const isHighlight = stat.highlight || index === 0;

  return (
    <Tilt max={8}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: EASE }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        whileHover={{ y: -8 }}
        className="cfk-market-card"
        style={{
          padding: isHighlight ? "36px 28px 32px" : "32px 24px 28px",
          borderRadius: 24,
          background: isHighlight
            ? `linear-gradient(145deg, ${C}15 0%, ${C}05 100%)`
            : `linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`,
          border: `1px solid ${isHighlight ? `${C}50` : `${C}20`}`,
          position: "relative",
          overflow: "hidden",
          height: "100%",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: isHighlight
            ? `0 20px 60px ${C}15, 0 0 0 1px ${C}20 inset`
            : `0 10px 40px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Animated spotlight */}
        <div
          className="absolute pointer-events-none transition-opacity duration-700"
          style={{
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C}20 0%, transparent 70%)`,
            left: `calc(${mousePos.x * 100}% - 150px)`,
            top: `calc(${mousePos.y * 100}% - 150px)`,
            opacity: hovered ? 1 : 0,
            filter: "blur(20px)",
          }}
        />

        {/* Top glow line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: isHighlight ? 3 : 2,
            background: isHighlight
              ? `linear-gradient(90deg, transparent, ${C_BRIGHT}, ${C}, transparent)`
              : `linear-gradient(90deg, transparent 10%, ${C}60 50%, transparent 90%)`,
            boxShadow: isHighlight ? `0 0 20px ${C}80` : "none",
          }}
        />

        {/* Corner accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 60,
            height: 60,
            background: `linear-gradient(135deg, ${C}10 0%, transparent 70%)`,
            borderBottomLeftRadius: 40,
          }}
        />

        {/* Top row: Icon + Badge */}
        <div className="flex items-center justify-between" style={{ marginBottom: 20, position: "relative", zIndex: 1 }}>
          {stat.icon && (
            <div
              style={{
                width: isHighlight ? 52 : 44,
                height: isHighlight ? 52 : 44,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${C}25 0%, ${C}10 100%)`,
                border: `1px solid ${C}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isHighlight ? `0 8px 24px ${C}20` : "none",
              }}
            >
              <svg
                width={isHighlight ? 26 : 22}
                height={isHighlight ? 26 : 22}
                viewBox="0 0 24 24"
                fill="none"
                stroke={C_BRIGHT}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={stat.icon} />
              </svg>
            </div>
          )}
          {stat.badge && (
            <span
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: `linear-gradient(135deg, ${C}30 0%, ${C}15 100%)`,
                border: `1px solid ${C}40`,
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 700,
                color: C_BRIGHT,
                letterSpacing: "1px",
                textTransform: "uppercase",
                boxShadow: `0 4px 12px ${C}15`,
              }}
            >
              {stat.badge}
            </span>
          )}
        </div>

        {/* Number with glow */}
        <div
          className={isHighlight ? "cfk-number-glow" : ""}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isHighlight ? "clamp(52px,5.5vw,72px)" : "clamp(44px,4.5vw,56px)",
            fontWeight: 900,
            background: isHighlight
              ? `linear-gradient(135deg, ${C_BRIGHT} 0%, white 50%, ${C_BRIGHT} 100%)`
              : C_BRIGHT,
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-3px",
            lineHeight: 1,
            marginBottom: 14,
            position: "relative",
            filter: isHighlight ? `drop-shadow(0 0 30px ${C}60)` : `drop-shadow(0 0 15px ${C}40)`,
          }}
        >
          {inView ? <Counter to={stat.value} suffix={stat.suffix} duration={1800} /> : `0${stat.suffix}`}
        </div>

        {/* Label */}
        <div
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: isHighlight ? 15 : 14,
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.5,
            marginBottom: 8,
            position: "relative",
          }}
        >
          {stat.label}
        </div>

        {/* Note */}
        <div
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            fontWeight: 400,
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.5,
            position: "relative",
          }}
        >
          {stat.note}
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: isHighlight ? 28 : 24,
            right: isHighlight ? 28 : 24,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${C}50, transparent)`,
            borderRadius: 1,
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 0.3s",
          }}
        />

        {/* Hover border glow */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: 24,
              boxShadow: `inset 0 0 0 1px ${C}50, 0 0 40px ${C}20`,
            }}
          />
        )}
      </motion.div>
    </Tilt>
  );
}

// ─── Focus Areas ──────────────────────────────────────────────────────────────
const KEY_TOPIC_ROTATE_MS = 6000;

function FocusAreas() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const active = FOCUS_AREAS[activeIdx];

  // Auto-rotate through topics until the visitor interacts.
  // Pauses while the visitor is hovering the section, resumes on leave.
  // Stops entirely once a tab has been manually clicked.
  useEffect(() => {
    if (!inView || isHovered || hasUserInteracted) return;
    const id = window.setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % FOCUS_AREAS.length);
    }, KEY_TOPIC_ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [activeIdx, isHovered, hasUserInteracted, inView]);

  return (
    <section
      ref={ref}
      style={{
        background: "transparent",
        padding: "clamp(40px,5vw,72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Static ambient glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 50% 50% at 30% 40%, ${C}05, transparent 70%)` }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 40% 40% at 80% 60%, ${C}03, transparent 70%)` }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,4vw,60px)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 14 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: C_BRIGHT,
              }}
            >
              Key Topics
            </span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px,3.8vw,52px)",
              letterSpacing: "-1.5px",
              color: "white",
              lineHeight: 1.05,
              margin: "16px 0 0",
            }}
          >
            Eight themes shaping Kuwait&apos;s
            <br />
            <span style={{ color: C_BRIGHT }}>cybersecurity agenda</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 400,
              fontSize: 16,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 560,
              margin: "18px auto 0",
              lineHeight: 1.6,
            }}
          >
            Select a theme to read the full focus.
          </p>
        </motion.div>

        {/* Editorial Tabs: vertical list (left) + detail panel (right) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="cfk-key-tabs"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* LEFT: Vertical list of titles */}
          <div className="cfk-key-list" role="tablist" aria-label="Key Topics">
            {FOCUS_AREAS.map((area, i) => {
              const isActive = i === activeIdx;
              const showProgress = isActive && !hasUserInteracted && inView;
              return (
                <button
                  key={area.title}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  suppressHydrationWarning
                  onClick={() => {
                    setActiveIdx(i);
                    setHasUserInteracted(true);
                  }}
                  className={`cfk-key-tab ${isActive ? "is-active" : ""}`}
                >
                  <span className="cfk-key-tab-indicator" aria-hidden="true" />
                  <span className="cfk-key-tab-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cfk-key-tab-title">{area.title}</span>
                  {showProgress && (
                    <span
                      key={activeIdx}
                      className={`cfk-key-tab-progress ${isHovered ? "is-paused" : ""}`}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT: Detail Panel — image (left) + content (right), both swap on tab change */}
          <div className="cfk-key-panel" role="tabpanel" aria-live="polite">
            <div key={activeIdx} className="cfk-key-panel-inner">
              {/* Image — Kuwait 2025 scene tied to this topic */}
              <div className="cfk-key-panel-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={active.image} alt="" loading="lazy" />
                <span className="cfk-key-panel-media-tag">Kuwait 2025</span>
              </div>

              {/* Content */}
              <div className="cfk-key-panel-content">
                {/* Eyebrow */}
                <span className="cfk-key-panel-eyebrow">
                  Topic {String(activeIdx + 1).padStart(2, "0")} / {String(FOCUS_AREAS.length).padStart(2, "0")}
                </span>

                {/* Title */}
                <h3 className="cfk-key-panel-title">{active.title}</h3>

                {/* Description */}
                <p className="cfk-key-panel-desc">{active.desc}</p>

                {/* Bottom accent */}
                <span className="cfk-key-panel-bar" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .cfk-key-tabs {
          display: grid;
          grid-template-columns: minmax(420px, 0.52fr) 1fr;
          gap: 28px;
          align-items: stretch;
        }
        /* ── Left list — 2 columns ── */
        .cfk-key-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          align-content: start;
        }
        .cfk-key-tab {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 14px 12px 18px;
          background: transparent;
          border: 1px solid transparent;
          text-align: left;
          cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease;
          border-radius: 10px;
          overflow: hidden;
        }
        /* Active-tab auto-rotate progress bar */
        .cfk-key-tab-progress {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 0%;
          background: linear-gradient(90deg, ${C}, ${C_BRIGHT});
          border-radius: 0 2px 2px 0;
          animation: cfkKeyProgress ${KEY_TOPIC_ROTATE_MS}ms linear forwards;
          box-shadow: 0 0 8px ${C_BRIGHT}66;
        }
        .cfk-key-tab-progress.is-paused {
          animation-play-state: paused;
        }
        @keyframes cfkKeyProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .cfk-key-tab:hover:not(.is-active) {
          background: rgba(255,255,255,0.03);
        }
        .cfk-key-tab.is-active {
          background: linear-gradient(90deg, ${C}12, ${C}04);
          border-color: ${C}25;
        }
        .cfk-key-tab-indicator {
          position: absolute;
          left: 4px;
          top: 10px;
          bottom: 10px;
          width: 2px;
          background: ${C_BRIGHT};
          border-radius: 2px;
          opacity: 0;
          transform: scaleY(0.4);
          transform-origin: center;
          transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 0 8px ${C_BRIGHT}80;
        }
        .cfk-key-tab.is-active .cfk-key-tab-indicator {
          opacity: 1;
          transform: scaleY(1);
        }
        .cfk-key-tab-num {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.22);
          flex-shrink: 0;
          transition: color 0.3s ease;
          min-width: 20px;
        }
        .cfk-key-tab.is-active .cfk-key-tab-num,
        .cfk-key-tab:hover .cfk-key-tab-num {
          color: ${C_BRIGHT};
        }
        .cfk-key-tab-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          line-height: 1.35;
          letter-spacing: -0.1px;
          transition: color 0.3s ease;
        }
        .cfk-key-tab.is-active .cfk-key-tab-title {
          color: white;
          font-weight: 700;
        }
        .cfk-key-tab:hover:not(.is-active) .cfk-key-tab-title {
          color: rgba(255,255,255,0.78);
        }
        /* ── Right panel — split image (left) + content (right) ── */
        .cfk-key-panel {
          position: relative;
          border-radius: 18px;
          background: linear-gradient(155deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.012) 100%);
          border: 1px solid rgba(255,255,255,0.06);
          padding: clamp(16px, 1.8vw, 22px);
          min-height: 340px;
          overflow: hidden;
        }
        .cfk-key-panel::before {
          content: "";
          position: absolute;
          top: 0;
          left: 32px;
          right: 32px;
          height: 1px;
          background: linear-gradient(90deg, transparent, ${C}40, transparent);
          z-index: 2;
        }
        .cfk-key-panel-inner {
          display: grid;
          grid-template-columns: minmax(220px, 0.85fr) 1fr;
          gap: clamp(18px, 2.2vw, 28px);
          align-items: stretch;
          width: 100%;
          height: 100%;
          animation: cfkKeyFade 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes cfkKeyFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Image side */
        .cfk-key-panel-media {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          min-height: 280px;
          background: rgba(0,0,0,0.4);
        }
        .cfk-key-panel-media img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: brightness(0.78) saturate(1.06);
          animation:
            cfkKeyMediaFade 0.7s ease-out forwards,
            cfkKeyKenBurns 14s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
          will-change: transform, opacity;
        }
        @keyframes cfkKeyMediaFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cfkKeyKenBurns {
          0%   { transform: scale(1.00) translate(0, 0); }
          100% { transform: scale(1.08) translate(-2%, -1.2%); }
        }
        /* Respect reduced-motion preference */
        @media (prefers-reduced-motion: reduce) {
          .cfk-key-panel-media img {
            animation: cfkKeyMediaFade 0.4s ease-out forwards;
          }
          .cfk-key-tab-progress {
            animation: none;
            width: 100%;
            opacity: 0.4;
          }
        }
        .cfk-key-panel-media::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.65) 100%);
          pointer-events: none;
        }
        .cfk-key-panel-media-tag {
          position: absolute;
          left: 12px;
          bottom: 12px;
          padding: 5px 10px;
          font-family: var(--font-outfit);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${C_BRIGHT};
          background: rgba(0,0,0,0.55);
          border: 1px solid ${C}40;
          border-radius: 6px;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 1;
        }
        /* Content side */
        .cfk-key-panel-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(8px, 1vw, 14px) clamp(4px, 0.8vw, 10px);
          max-width: 520px;
        }
        .cfk-key-panel-eyebrow {
          display: block;
          font-family: var(--font-outfit);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: ${C_BRIGHT};
          margin-bottom: 8px;
        }
        .cfk-key-panel-title {
          font-family: var(--font-display);
          font-size: clamp(18px, 1.9vw, 24px);
          font-weight: 800;
          color: white;
          letter-spacing: -0.4px;
          line-height: 1.2;
          margin: 0 0 14px;
        }
        .cfk-key-panel-desc {
          font-family: var(--font-outfit);
          font-size: clamp(13px, 1vw, 14.5px);
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          line-height: 1.65;
          margin: 0;
        }
        .cfk-key-panel-bar {
          display: block;
          width: 36px;
          height: 2px;
          background: linear-gradient(90deg, ${C_BRIGHT}, ${C}40);
          border-radius: 2px;
          margin-top: 20px;
        }
        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .cfk-key-tabs {
            grid-template-columns: minmax(380px, 0.5fr) 1fr !important;
            gap: 22px !important;
          }
          .cfk-key-panel-inner {
            grid-template-columns: minmax(200px, 0.85fr) 1fr !important;
            gap: 18px !important;
          }
        }
        @media (max-width: 880px) {
          .cfk-key-tabs {
            grid-template-columns: 1fr !important;
            gap: 22px !important;
          }
          .cfk-key-panel {
            min-height: auto;
          }
          .cfk-key-panel-inner {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
          .cfk-key-panel-media {
            min-height: 220px !important;
            aspect-ratio: 16 / 9;
          }
        }
        @media (max-width: 520px) {
          .cfk-key-list {
            grid-template-columns: 1fr !important;
          }
          .cfk-key-tab-title {
            font-size: 13px;
          }
          .cfk-key-panel {
            padding: 22px 20px !important;
            min-height: 220px;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Growth Story ─────────────────────────────────────────────────────────────
function GrowthStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ background: "transparent", padding: "clamp(40px,5vw,72px) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: 56 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 50,
              background: `${C}12`,
              border: `1px solid ${C}25`,
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: C_BRIGHT,
              marginBottom: 20,
            }}
          >
            Proven Track Record
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px,3.8vw,52px)",
              letterSpacing: "-2px",
              color: "white",
              lineHeight: 1.08,
              margin: 0,
            }}
          >
            3 Years. One Growing Community.
          </h2>
        </motion.div>

        <div className="cfk-growth-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {GROWTH.map((g, i) => (
            <Tilt key={g.year} max={6}>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.1 + i * 0.12, ease: EASE }}
                style={{
                  padding: "36px 30px",
                  borderRadius: 20,
                  background: g.active ? `linear-gradient(135deg, ${C}14, ${C}06)` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${g.active ? C + "40" : "rgba(255,255,255,0.06)"}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {g.active && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C}, ${C}60, transparent)` }} />
                )}
                {g.active && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: `${C}22`,
                      border: `1px solid ${C}45`,
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: C }}>
                      2026
                    </span>
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 52,
                    fontWeight: 900,
                    color: g.active ? C : "rgba(255,255,255,0.15)",
                    letterSpacing: "-3px",
                    lineHeight: 1,
                    marginBottom: 28,
                  }}
                >
                  {g.year}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {([
                    ["Delegates", g.delegates],
                    ["Speakers", g.speakers],
                    ["Sponsors", g.sponsors],
                    ["Media Partners", g.media],
                  ] as [string, number][]).map(([label, val]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: 10,
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                        {label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 22,
                          fontWeight: 800,
                          color: g.active ? C : "rgba(255,255,255,0.5)",
                          letterSpacing: "-0.5px",
                          lineHeight: 1,
                        }}
                      >
                        {inView ? <Counter to={val} suffix={g.active && label === "Delegates" ? "+" : ""} duration={1400} /> : val}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      marginTop: 6,
                      padding: "8px 14px",
                      borderRadius: 10,
                      background: g.active ? `${C}12` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${g.active ? C + "25" : "rgba(255,255,255,0.04)"}`,
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, color: g.active ? C : "rgba(255,255,255,0.25)" }}>
                      {g.extra}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
        <style jsx global>{`
          @media (max-width: 768px) {
            .cfk-growth-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

// ─── Atmosphere Divider ──────────────────────────────────────────────────────
function AtmosphereDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div ref={ref} style={{ position: "relative", height: "55vh", overflow: "hidden", background: "#020508" }}>
      <motion.div style={{ position: "absolute", inset: "-10%", y: bgY }}>
        <Image
          src={`${KW25}/4X9A2307.jpg`}
          alt="Cyber First Kuwait delegates"
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 30%", filter: "brightness(0.72) saturate(1)" }}
        />
      </motion.div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #030810 0%, transparent 20%, transparent 80%, #030810 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at center, rgba(3,8,16,0.55) 0%, rgba(3,8,16,0.25) 50%, transparent 80%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE }}
          style={{ textAlign: "center", padding: "0 24px" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#ffffff",
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(3,8,16,0.55)",
              border: `1px solid ${C}55`,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              marginBottom: 18,
              textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: C, boxShadow: `0 0 10px ${C}` }} />
            Kuwait · 2026
          </div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(24px,3.5vw,52px)",
              letterSpacing: "-2px",
              color: "white",
              lineHeight: 1.1,
              margin: 0,
              maxWidth: 800,
            }}
          >
            Where Kuwait&apos;s cyber leaders shape the future of national security.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Speakers ─────────────────────────────────────────────────────────────────
function Speakers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ background: "transparent", padding: "clamp(40px,5vw,72px) 0", position: "relative" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 clamp(24px,4vw,64px)", position: "relative" }}>
        {/* Header — centered, editorial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 14 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: C_BRIGHT }}>
              The Faculty
            </span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.8vw, 52px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.05, margin: "16px 0 0" }}>
            Who&apos;s Speaking
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 400, fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "16px auto 0", lineHeight: 1.6 }}>
            Kuwait&apos;s most senior cybersecurity and technology leaders share the stage. More names announcing soon.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="cfk-speakers-grid">
          {SPEAKERS.map((s, i) => (
            <SpeakerCard key={s.name} speaker={s} index={i} inView={inView} />
          ))}

          {/* Ghost card — placeholder slot for upcoming speakers */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.06 * SPEAKERS.length, ease: EASE }}
            className="cfk-speaker-ghost"
            aria-hidden
          >
            <div className="cfk-speaker-ghost-photo">
              <span className="cfk-speaker-ghost-wordmark">Coming Soon</span>
            </div>
            <div className="cfk-speaker-ghost-info">
              <span className="cfk-speaker-ghost-kicker">More Names</span>
              <span className="cfk-speaker-ghost-title">Announcing soon</span>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .cfk-speakers-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: clamp(14px, 1.6vw, 22px);
        }
        @media (max-width: 1180px) {
          .cfk-speakers-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 900px) {
          .cfk-speakers-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 640px) {
          .cfk-speakers-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 420px) {
          .cfk-speakers-grid { grid-template-columns: 1fr !important; }
        }

        /* ── Editorial spotlight card: photo zone (top) + info panel (bottom) ── */
        .cfk-speaker-card {
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: 18px;
          overflow: hidden;
          background: #08111c;
          border: 1px solid rgba(255,255,255,0.06);
          text-decoration: none;
          color: inherit;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.5s ease, box-shadow 0.5s ease;
          will-change: transform;
        }
        .cfk-speaker-card.is-link { cursor: pointer; }
        .cfk-speaker-card:hover {
          transform: translateY(-4px);
          border-color: ${C}35;
          box-shadow: 0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px ${C}20;
        }

        /* ── Photo zone — square, top of card, no overlay ── */
        .cfk-speaker-photo-wrap {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: linear-gradient(160deg, #0e1a24 0%, #080b10 100%);
        }
        .cfk-speaker-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: brightness(0.96) saturate(1.04);
          transition: transform 0.9s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease;
        }
        .cfk-speaker-card:hover .cfk-speaker-photo {
          transform: scale(1.06);
          filter: brightness(1.06) saturate(1.1);
        }
        .cfk-speaker-fallback {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(ellipse 80% 60% at 50% 38%, ${C}24 0%, transparent 72%),
            linear-gradient(160deg, #0e1a24 0%, #080b10 100%);
        }
        .cfk-speaker-fallback span {
          font-family: var(--font-display);
          font-size: clamp(48px, 6vw, 68px);
          font-weight: 800;
          color: ${C_BRIGHT};
          opacity: 0.58;
          letter-spacing: -2px;
          text-shadow: 0 6px 26px ${C}70;
        }

        /* Count stamp — top-left of photo */
        .cfk-speaker-num {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 5px 9px;
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: ${C_BRIGHT};
          background: rgba(0,0,0,0.55);
          border: 1px solid ${C}30;
          border-radius: 6px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 2;
        }

        /* ── Info panel — separate zone below photo ── */
        .cfk-speaker-info {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: clamp(16px, 1.6vw, 22px);
          background: linear-gradient(180deg, #0a141f 0%, #050a14 100%);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        /* Cyan hairline accent at the top edge of the info panel */
        .cfk-speaker-info::before {
          content: "";
          position: absolute;
          top: 0;
          left: 14%;
          right: 14%;
          height: 1px;
          background: linear-gradient(90deg, transparent, ${C}66, ${C_BRIGHT}, ${C}66, transparent);
          opacity: 0.55;
          transition: opacity 0.5s ease;
        }
        .cfk-speaker-card:hover .cfk-speaker-info::before { opacity: 1; }

        .cfk-speaker-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(15.5px, 1.4vw, 18px);
          letter-spacing: -0.35px;
          color: white;
          line-height: 1.22;
          margin: 0 0 6px;
          min-height: 2.44em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .cfk-speaker-title {
          font-family: var(--font-outfit);
          font-size: clamp(11px, 0.95vw, 13px);
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          line-height: 1.45;
          margin: 0;
          min-height: 2.9em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Footer — company chip + LinkedIn arrow */
        .cfk-speaker-foot {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: border-top-color 0.4s ease;
        }
        .cfk-speaker-card:hover .cfk-speaker-foot {
          border-top-color: ${C}28;
        }
        .cfk-speaker-org {
          flex: 1;
          font-family: var(--font-outfit);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: ${C_BRIGHT};
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cfk-speaker-ln {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: rgba(0,0,0,0.32);
          border: 1px solid ${C}30;
          color: ${C_BRIGHT};
          opacity: 0.75;
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
        }
        .cfk-speaker-card:hover .cfk-speaker-ln {
          opacity: 1;
          background: ${C}1a;
          border-color: ${C_BRIGHT};
          transform: scale(1.08);
        }

        /* ── Ghost card — matches split structure (photo zone + info zone) ── */
        .cfk-speaker-ghost {
          display: flex;
          flex-direction: column;
          border-radius: 18px;
          border: 1.5px dashed ${C}30;
          overflow: hidden;
          background: linear-gradient(160deg, rgba(255,255,255,0.018) 0%, rgba(255,255,255,0.005) 100%);
        }
        .cfk-speaker-ghost-photo {
          position: relative;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cfk-speaker-ghost-wordmark {
          font-family: var(--font-display);
          font-size: clamp(18px, 1.9vw, 24px);
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${C_BRIGHT};
          text-align: center;
          text-shadow: 0 4px 28px ${C}88, 0 0 1px ${C}40;
          animation: cfkSpeakerGhostFade 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          padding: 0 16px;
        }
        @keyframes cfkSpeakerGhostFade {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
        .cfk-speaker-ghost-info {
          flex: 1;
          padding: clamp(16px, 1.6vw, 22px);
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
          text-align: center;
          border-top: 1px dashed ${C}25;
          background: rgba(255,255,255,0.012);
        }
        .cfk-speaker-ghost-kicker {
          font-family: var(--font-outfit);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: ${C_BRIGHT};
        }
        .cfk-speaker-ghost-title {
          font-family: var(--font-display);
          font-size: clamp(15px, 1.4vw, 17px);
          font-weight: 700;
          color: rgba(255,255,255,0.72);
          letter-spacing: -0.3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .cfk-speaker-photo,
          .cfk-speaker-card,
          .cfk-speaker-ghost-dot {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function SpeakerCard({
  speaker,
  index,
  inView,
}: {
  speaker: Speaker;
  index: number;
  inView: boolean;
}) {
  const [imgErr, setImgErr] = useState(false);
  const initials = speaker.name
    .replace(/^(Dr|Eng|Mr|Ms|Mrs)\.?\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const hasLinkedin = !!speaker.linkedin;
  const motionProps = {
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay: 0.06 * index, ease: EASE },
  };

  const cardInner = (
    <>
      {/* Photo zone — top, clean, no text overlay */}
      <div className="cfk-speaker-photo-wrap">
        {speaker.photo && !imgErr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={speaker.photo}
            alt={speaker.name}
            loading="lazy"
            className="cfk-speaker-photo"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="cfk-speaker-fallback" aria-hidden>
            <span>{initials}</span>
          </div>
        )}

        <span className="cfk-speaker-num" aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Info zone — separated panel below photo */}
      <div className="cfk-speaker-info">
        <h3 className="cfk-speaker-name">{speaker.name}</h3>
        <p className="cfk-speaker-title">{speaker.title}</p>
        <div className="cfk-speaker-foot">
          <span className="cfk-speaker-org">{speaker.org}</span>
          {hasLinkedin && (
            <span aria-hidden className="cfk-speaker-ln">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (hasLinkedin) {
    return (
      <motion.a
        href={speaker.linkedin ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${speaker.name} on LinkedIn`}
        className="cfk-speaker-card is-link"
        {...motionProps}
      >
        {cardInner}
      </motion.a>
    );
  }

  return (
    <motion.div className="cfk-speaker-card" {...motionProps}>
      {cardInner}
    </motion.div>
  );
}

// ─── Sponsor Marquee Data ─────────────────────────────────────────────────────
const MARQUEE_ROW_1 = [
  ...SPONSORS.gold,
  ...SPONSORS.associate.filter(s => s.logo),
  ...SPONSORS.strategic.filter(s => s.logo),
  ...SPONSORS.specialized.filter(s => s.logo),
].filter(s => s.logo);

const MARQUEE_ROW_2 = [
  { name: "Google Cloud Security", logo: `${S3_LOGOS}/Google-Cloud-Security.png` },
  { name: "Anomali", logo: `${S3_LOGOS}/Anomali.png` },
  { name: "OPSWAT", logo: `${S3_LOGOS}/OPSWAT-logo.png` },
  { name: "Pentera", logo: `${S3_LOGOS}/PENTERA.png` },
  { name: "HWG", logo: `${S3_LOGOS}/hwg-here-we-go.png` },
  { name: "AmiViz", logo: `${S3_LOGOS}/AmiViz.png` },
  { name: "Securonix", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/securonix.jpg" },
  { name: "Paramount", logo: `${S3_LOGOS}/Paramount.png` },
  { name: "Kron Technologies", logo: `${S3_LOGOS}/kron-technologies.png` },
  { name: "Appknox", logo: `${S3_LOGOS}/appknox.png` },
  { name: "Filigran", logo: `${S3_LOGOS}/filigran.png` },
  { name: "Corelight", logo: `${S3_LOGOS}/corelight.png` },
  { name: "ManageEngine", logo: `${S3_LOGOS}/ManageEngine.png` },
  { name: "Fortinet", logo: `${S3_LOGOS}/fortinet.png` },
  { name: "Gen-X Systems", logo: `${S3_LOGOS}/Gen-x-systems.png` },
  { name: "SecureB4", logo: `${S3_LOGOS}/secureb4.png` },
  { name: "Bureau Veritas", logo: `${S3_LOGOS}/bureau-veritas.png` },
  { name: "DREAM", logo: `${S3_LOGOS}/DREAM.png` },
];

// ─── Featured Sponsors — tier-display before the full marquee ────────────────
function FeaturedSponsors() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "transparent",
        padding: "clamp(40px,5vw,72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${C}06, transparent 70%)` }} />
      <DotMatrixGrid color={C} opacity={0.015} spacing={30} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px,4vw,64px)", position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "clamp(40px, 4vw, 56px)" }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 14 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: C_BRIGHT }}>
              Backed By
            </span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.8vw,48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.08, margin: "16px 0 0" }}>
            Featured Sponsors
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 400, fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 540, margin: "16px auto 0", lineHeight: 1.6 }}>
            The technology leaders backing Cyber First Kuwait 2026.
          </p>
        </motion.div>

        {/* ─── GOLD tier label ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="cfk-feat-tier-row cfk-feat-tier-row--gold"
        >
          <span className="cfk-feat-tier-line cfk-feat-tier-line--gold" />
          <span className="cfk-feat-tier-label cfk-feat-tier-label--gold">Gold Sponsors</span>
          <span className="cfk-feat-tier-line cfk-feat-tier-line--gold" />
        </motion.div>

        <div className="cfk-feat-grid cfk-feat-grid--gold">
          {FEATURED_SPONSORS.gold.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.22 + i * 0.12, ease: EASE }}
              className={`cfk-feat-card cfk-feat-card--gold${s.lightBg ? " is-light" : ""}`}
              aria-label={`${s.name} — Gold Sponsor`}
            >
              <span aria-hidden className="cfk-feat-hairline cfk-feat-hairline--gold" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.logo} alt={`${s.name} logo`} loading="lazy" className="cfk-feat-logo" />
            </motion.div>
          ))}
        </div>

        {/* ─── STRATEGIC tier label ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          className="cfk-feat-tier-row"
          style={{ marginTop: "clamp(36px, 4vw, 60px)" }}
        >
          <span className="cfk-feat-tier-line" />
          <span className="cfk-feat-tier-label">Strategic Partners</span>
          <span className="cfk-feat-tier-line" />
        </motion.div>

        <div className="cfk-feat-grid cfk-feat-grid--strategic">
          {FEATURED_SPONSORS.strategic.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: EASE }}
              className={`cfk-feat-card cfk-feat-card--strategic${s.lightBg ? " is-light" : ""}`}
              aria-label={`${s.name} — Strategic Partner`}
            >
              <span aria-hidden className="cfk-feat-hairline" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.logo} alt={`${s.name} logo`} loading="lazy" className="cfk-feat-logo" />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        /* ── Tier labels ── */
        .cfk-feat-tier-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-bottom: clamp(20px, 2.4vw, 32px);
        }
        .cfk-feat-tier-line {
          flex: 0 1 90px;
          height: 1px;
          background: linear-gradient(90deg, transparent, ${C}55, transparent);
        }
        .cfk-feat-tier-line--gold {
          background: linear-gradient(90deg, transparent, rgba(212,168,75,0.6), transparent);
        }
        .cfk-feat-tier-label {
          font-family: var(--font-outfit);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: ${C_BRIGHT};
          text-shadow: 0 0 14px ${C}55;
          white-space: nowrap;
        }
        .cfk-feat-tier-label--gold {
          color: #D4A84B;
          text-shadow: 0 0 16px rgba(212,168,75,0.55);
        }

        /* ── Card grids — narrower max-width so cards aren't cavernous ── */
        .cfk-feat-grid {
          display: grid;
          gap: clamp(14px, 1.6vw, 22px);
          justify-content: center;
          margin: 0 auto;
          width: 100%;
        }
        .cfk-feat-grid--gold {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          max-width: 640px;
        }
        .cfk-feat-grid--strategic {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          max-width: 820px;
        }

        /* ── Cards — wider aspect (less tall), tight padding so logos fill ── */
        .cfk-feat-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 5 / 2;
          padding: clamp(14px, 1.4vw, 22px);
          border-radius: 14px;
          background: linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.012) 100%);
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.5s ease, box-shadow 0.5s ease;
        }
        .cfk-feat-card--gold {
          aspect-ratio: 5 / 2.2;
          padding: clamp(16px, 1.7vw, 26px);
          border-color: rgba(212,168,75,0.22);
        }
        .cfk-feat-card:hover {
          transform: translateY(-3px);
          border-color: ${C}40;
          box-shadow: 0 14px 32px rgba(0,0,0,0.4), 0 0 0 1px ${C}25;
        }
        .cfk-feat-card--gold:hover {
          border-color: rgba(212,168,75,0.55);
          box-shadow: 0 16px 36px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,168,75,0.4);
        }

        /* Hairline accents */
        .cfk-feat-hairline {
          position: absolute;
          top: 0;
          left: 12%;
          right: 12%;
          height: 1px;
          background: linear-gradient(90deg, transparent, ${C}66, ${C_BRIGHT}, ${C}66, transparent);
          opacity: 0.5;
          transition: opacity 0.5s ease;
        }
        .cfk-feat-hairline--gold {
          background: linear-gradient(90deg, transparent, rgba(212,168,75,0.7), rgba(255,235,200,0.95), rgba(212,168,75,0.7), transparent);
          opacity: 0.7;
        }
        .cfk-feat-card:hover .cfk-feat-hairline { opacity: 1; }

        /* ── White background variant for dark-on-transparent logos ── */
        .cfk-feat-card.is-light {
          background: #ffffff;
          border-color: rgba(0,0,0,0.10);
        }
        .cfk-feat-card.is-light .cfk-feat-hairline { display: none; }
        .cfk-feat-card.is-light:hover {
          border-color: ${C};
          box-shadow: 0 16px 36px rgba(0,0,0,0.55), 0 0 0 1px ${C}40;
        }
        /* Gold-tier light card keeps a warm gold border to mark its tier */
        .cfk-feat-card--gold.is-light {
          border-color: rgba(212,168,75,0.45);
        }
        .cfk-feat-card--gold.is-light:hover {
          border-color: rgba(212,168,75,0.85);
          box-shadow: 0 16px 36px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,168,75,0.55);
        }
        /* Don't dim dark logos via the brightness filter */
        .cfk-feat-card.is-light .cfk-feat-logo {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.12));
        }
        .cfk-feat-card.is-light:hover .cfk-feat-logo {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.18));
        }

        /* Logo — fills the card much more */
        .cfk-feat-logo {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          filter: brightness(1.05) drop-shadow(0 2px 8px rgba(0,0,0,0.4));
          transition: filter 0.4s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .cfk-feat-card:hover .cfk-feat-logo {
          filter: brightness(1.15) drop-shadow(0 4px 14px rgba(0,0,0,0.55));
          transform: scale(1.04);
        }

        /* Responsive */
        @media (max-width: 720px) {
          .cfk-feat-grid--gold {
            grid-template-columns: 1fr !important;
            max-width: 320px !important;
          }
          .cfk-feat-grid--strategic {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            max-width: 520px !important;
          }
        }
        @media (max-width: 460px) {
          .cfk-feat-grid--strategic {
            grid-template-columns: 1fr !important;
            max-width: 260px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cfk-feat-card,
          .cfk-feat-logo {
            transition: none !important;
          }
          .cfk-feat-card:hover .cfk-feat-logo { transform: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Sponsors Marquee ─────────────────────────────────────────────────────────
function SponsorsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="partners"
      style={{
        background: "transparent",
        padding: "clamp(40px,5vw,72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 40%, ${C}06 0%, transparent 70%)`,
        }}
      />

      <DotMatrixGrid color={C} opacity={0.012} spacing={30} />

      <div
        style={{
          maxWidth: 1520,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: C }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: C_BRIGHT,
              }}
            >
              Our Past Series
            </span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 44px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "20px 0 0",
            }}
          >
            Partners & Sponsors
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: "#707070",
              lineHeight: 1.6,
              maxWidth: 480,
              margin: "14px auto 0",
            }}
          >
            Backed by global technology leaders and security vendors worldwide.
          </p>
        </motion.div>

        {/* Marquee Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ position: "relative" }}
        >
          {/* Left edge fade */}
          <div
            className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "clamp(60px, 10vw, 120px)",
              background: "linear-gradient(to right, #020508 0%, transparent 100%)",
            }}
          />
          {/* Right edge fade */}
          <div
            className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "clamp(60px, 10vw, 120px)",
              background: "linear-gradient(to left, #020508 0%, transparent 100%)",
            }}
          />

          {/* Row 1, scrolls left */}
          <div className="cfk-marquee-track" style={{ marginBottom: 20 }}>
            <div
              className="cfk-marquee-inner cfk-scroll-left"
              style={{ animationDuration: "70s" }}
            >
              {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((logo, i) => (
                <div
                  key={`r1-${i}`}
                  style={{
                    width: 140,
                    height: 44,
                    margin: "0 clamp(14px, 2vw, 28px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.45,
                    flexShrink: 0,
                    borderRadius: 8,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.logo!}
                    alt={logo.name}
                    loading="lazy"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2, scrolls right */}
          <div className="cfk-marquee-track">
            <div
              className="cfk-marquee-inner cfk-scroll-right"
              style={{ animationDuration: "80s" }}
            >
              {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((logo, i) => (
                <div
                  key={`r2-${i}`}
                  style={{
                    width: 140,
                    height: 44,
                    margin: "0 clamp(14px, 2vw, 28px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.45,
                    flexShrink: 0,
                    borderRadius: 8,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.logo}
                    alt={logo.name}
                    loading="lazy"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginTop: 36 }}
        >
          <Link
            href="#partnership"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: C_BRIGHT,
              textDecoration: "none",
              letterSpacing: "0.3px",
              padding: "10px 24px",
              borderRadius: 50,
              border: "1px solid transparent",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = `${C}40`;
              e.currentTarget.style.background = `${C}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = C_BRIGHT;
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Become a Partner →
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        .cfk-marquee-track {
          overflow: hidden;
          width: 100%;
        }
        .cfk-marquee-inner {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .cfk-scroll-left {
          animation: cfkScrollLeft linear infinite;
        }
        .cfk-scroll-right {
          animation: cfkScrollRight linear infinite;
        }
        @keyframes cfkScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes cfkScrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

// ─── What to Expect ──────────────────────────────────────────────────────────
function WhatToExpect() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const stats: { value: string; suffix?: string; label: string }[] = [
    { value: "1", label: "Day Event" },
    { value: "300", suffix: "+", label: "Senior Decision-Makers" },
    { value: "25", suffix: "+", label: "Expert Speakers & Industry Leaders" },
  ];

  const pillars: { num: string; title: string; desc: string }[] = [
    {
      num: "01",
      title: "Government & Regulatory Representation",
      desc: "Direct insight from the policymakers and regulators shaping Kuwait's digital sovereignty agenda.",
    },
    {
      num: "02",
      title: "Executive Keynotes & Strategic Panel Discussions",
      desc: "Boardroom-grade dialogue from the leaders writing the next chapter of national cyber strategy.",
    },
    {
      num: "03",
      title: "Real-World Case Studies & Success Stories",
      desc: "Field-tested playbooks from practitioners who have lived through the breach — and built the defence.",
    },
    {
      num: "04",
      title: "Interactive Networking Opportunities",
      desc: "Curated introductions between the buyers, builders, and decision-makers reshaping the region.",
    },
    {
      num: "05",
      title: "Cybersecurity Technology Showcase",
      desc: "The platforms, products, and partners defining the next era of enterprise defence.",
    },
  ];

  return (
    <section
      ref={ref}
      style={{
        background: "transparent",
        padding: "clamp(80px,9vw,140px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Whisper background grid for editorial depth */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${C}06 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 70% 60% at center, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at center, black 0%, transparent 80%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 clamp(24px,5vw,80px)",
          position: "relative",
        }}
      >
        {/* ═══ Editorial header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ marginBottom: 72 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "5px",
                textTransform: "uppercase",
                color: C_BRIGHT,
              }}
            >
              <span style={{ width: 24, height: 1, background: C }} />
              Programme
            </span>
            <span
              style={{
                flex: 1,
                height: 1,
                background: "linear-gradient(90deg, rgba(255,255,255,0.14) 0%, transparent 70%)",
              }}
            />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(40px, 5.6vw, 86px)",
              letterSpacing: "-2.5px",
              color: "white",
              lineHeight: 0.98,
              margin: 0,
              maxWidth: 940,
            }}
          >
            What to{" "}
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                color: C_BRIGHT,
              }}
            >
              expect
            </em>
            <br />
            at Cyber First Kuwait 2026.
          </h2>
        </motion.div>

        {/* ═══ Hero stat trio ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="cfk-prog-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(20px, 3vw, 56px)",
            padding: "40px 0",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
            marginBottom: 96,
            position: "relative",
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: EASE }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                position: "relative",
                paddingLeft: i === 0 ? 0 : "clamp(12px, 2vw, 28px)",
                borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span
                  className="tabular-nums"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(56px, 7.2vw, 104px)",
                    fontWeight: 800,
                    letterSpacing: "-4px",
                    color: "white",
                    lineHeight: 0.9,
                    textShadow: `0 0 60px ${C}25`,
                  }}
                >
                  {s.value}
                </span>
                {s.suffix && (
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(28px, 3.6vw, 52px)",
                      fontWeight: 700,
                      color: C_BRIGHT,
                      letterSpacing: "-1.5px",
                      lineHeight: 1,
                    }}
                  >
                    {s.suffix}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.42)",
                  margin: 0,
                  maxWidth: 240,
                  lineHeight: 1.4,
                }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══ Numbered editorial pillars — 3-col grid ═══ */}
        <div
          className="cfk-prog-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(14px, 1.4vw, 22px)",
          }}
        >
          {pillars.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55 + i * 0.08, ease: EASE }}
              className="cfk-prog-pillar"
              style={{
                position: "relative",
                padding: "30px 28px 32px",
                minHeight: 240,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                borderRadius: 18,
                background:
                  "linear-gradient(155deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 55%, rgba(1,187,245,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 18px 38px rgba(0,0,0,0.28)",
                overflow: "hidden",
                isolation: "isolate",
              }}
            >
              {/* Ghost number background mark */}
              <span
                aria-hidden
                className="cfk-prog-ghost"
                style={{
                  position: "absolute",
                  top: -22,
                  right: -8,
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(140px, 14vw, 200px)",
                  fontWeight: 800,
                  letterSpacing: "-8px",
                  lineHeight: 1,
                  background: `linear-gradient(180deg, ${C}14 0%, ${C}02 75%, transparent 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  pointerEvents: "none",
                  zIndex: 0,
                  transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {p.num}
              </span>

              {/* Hairline top accent */}
              <span
                aria-hidden
                className="cfk-prog-top-hair"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: `linear-gradient(90deg, ${C}55 0%, transparent 60%)`,
                  opacity: 0.6,
                  transition: "opacity 0.45s cubic-bezier(0.16,1,0.3,1)",
                  zIndex: 2,
                }}
              />

              {/* Corner accents */}
              <span
                aria-hidden
                className="cfk-prog-corner cfk-prog-corner-tl"
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  width: 14,
                  height: 14,
                  borderTop: `1px solid ${C}45`,
                  borderLeft: `1px solid ${C}45`,
                  borderTopLeftRadius: 4,
                  opacity: 0.4,
                  transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
                  zIndex: 2,
                }}
              />
              <span
                aria-hidden
                className="cfk-prog-corner cfk-prog-corner-br"
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  width: 14,
                  height: 14,
                  borderBottom: `1px solid ${C}45`,
                  borderRight: `1px solid ${C}45`,
                  borderBottomRightRadius: 4,
                  opacity: 0.4,
                  transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
                  zIndex: 2,
                }}
              />

              {/* Index row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 3 }}>
                <span
                  className="cfk-prog-num"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C_BRIGHT,
                    letterSpacing: "3px",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    transition: "color 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  No. {p.num}
                </span>
                <svg
                  className="cfk-prog-arrow"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={C_BRIGHT}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    opacity: 0.35,
                    transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              {/* Title */}
              <h3
                className="cfk-prog-title"
                style={{
                  position: "relative",
                  zIndex: 3,
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(17px, 1.5vw, 22px)",
                  fontWeight: 700,
                  letterSpacing: "-0.6px",
                  color: "white",
                  lineHeight: 1.18,
                  margin: 0,
                  transition: "color 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {p.title}
              </h3>

              {/* Desc */}
              <p
                style={{
                  position: "relative",
                  zIndex: 3,
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <style jsx global>{`
          .cfk-prog-pillar {
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .cfk-prog-pillar:hover {
            transform: translateY(-4px);
            border-color: ${C}30 !important;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08),
              0 24px 56px rgba(0, 0, 0, 0.45),
              0 0 0 1px ${C}18;
          }
          .cfk-prog-pillar:hover .cfk-prog-ghost {
            transform: translateY(-4px) scale(1.04);
          }
          .cfk-prog-pillar:hover .cfk-prog-top-hair {
            opacity: 1;
          }
          .cfk-prog-pillar:hover .cfk-prog-corner {
            opacity: 1;
            border-color: ${C_BRIGHT}80 !important;
          }
          .cfk-prog-pillar:hover .cfk-prog-num {
            color: ${C_BRIGHT};
          }
          .cfk-prog-pillar:hover .cfk-prog-arrow {
            opacity: 1;
            transform: translateX(6px);
          }

          @media (max-width: 880px) {
            .cfk-prog-stats {
              grid-template-columns: 1fr !important;
              gap: 36px !important;
            }
            .cfk-prog-stats > div {
              border-left: none !important;
              padding-left: 0 !important;
              border-top: 1px solid rgba(255, 255, 255, 0.06);
              padding-top: 28px;
            }
            .cfk-prog-stats > div:first-child {
              border-top: none;
              padding-top: 0;
            }
            .cfk-prog-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 560px) {
            .cfk-prog-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

function ExpectCard({
  item,
  index,
  inView,
}: {
  item: { icon: string; title: string; desc: string; image: string };
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  return (
    <Tilt max={6}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 + index * 0.1, ease: EASE }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        style={{
          position: "relative",
          padding: "36px 30px",
          borderRadius: 20,
          background: hovered ? `${C}06` : "rgba(255,255,255,0.02)",
          border: `1px solid ${hovered ? `${C}20` : "rgba(255,255,255,0.06)"}`,
          overflow: "hidden",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? `0 16px 48px rgba(1,187,245,0.08)` : "none",
          transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
          cursor: "default",
          minHeight: 200,
        }}
      >
        {/* Backdrop image */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt="Cyber First Kuwait 2026 cybersecurity summit"
            className="w-full h-full object-cover"
            style={{
              filter: hovered ? "brightness(0.2) saturate(0.5)" : "brightness(0.08) saturate(0.3)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(3,8,16,0.88) 30%, rgba(3,8,16,0.55) 100%)", zIndex: 0 }}
        />

        {/* Spotlight */}
        <div
          className="absolute pointer-events-none transition-opacity duration-500"
          style={{
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C}10 0%, transparent 70%)`,
            left: `calc(${mousePos.x * 100}% - 125px)`,
            top: `calc(${mousePos.y * 100}% - 125px)`,
            opacity: hovered ? 1 : 0,
            zIndex: 1,
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: hovered ? `${C}20` : `${C}10`,
              border: `1px solid ${hovered ? `${C}40` : `${C}20`}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              transition: "all 0.3s",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke={hovered ? C_BRIGHT : `${C}90`}
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{
                filter: hovered ? `drop-shadow(0 0 6px ${C}80)` : "none",
                transition: "all 0.3s",
              }}
            >
              <path d={item.icon} />
            </svg>
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.5px",
              color: "white",
              lineHeight: 1.25,
              margin: "0 0 12px",
            }}
          >
            {item.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {item.desc}
          </p>
        </div>
      </motion.div>
    </Tilt>
  );
}

// ─── Agenda Timeline ─────────────────────────────────────────────────────────
const AGENDA_TYPE_CONFIG: Record<string, { color: string; label: string; tier: "headline" | "standard" | "sponsor" | "break" }> = {
  panel: { color: C, label: "Panel", tier: "headline" },
  keynote: { color: "#C4A34A", label: "Keynote", tier: "headline" },
  fireside: { color: "#C4A34A", label: "Fireside", tier: "headline" },
  ceremony: { color: C_BRIGHT, label: "Opening", tier: "standard" },
  sponsor: { color: "#404040", label: "Sponsor", tier: "sponsor" },
  break: { color: "#333", label: "Break", tier: "break" },
  awards: { color: "#C4A34A", label: "Awards", tier: "headline" },
  closing: { color: C, label: "Closing", tier: "standard" },
};

const AGENDA_FILTERS = [
  { key: "all", label: "All" },
  { key: "panel", label: "Panels" },
  { key: "keynote", label: "Keynotes" },
  { key: "sponsor", label: "Sponsors" },
  { key: "break", label: "Breaks" },
] as const;

function AgendaTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = activeFilter === "all"
    ? AGENDA
    : AGENDA.filter((item) => {
        if (activeFilter === "keynote") return item.type === "keynote" || item.type === "fireside" || item.type === "ceremony";
        if (activeFilter === "break") return item.type === "break" || item.type === "closing";
        return item.type === activeFilter;
      });

  // 2-column split for "all", single column for filtered
  const isTwoCol = activeFilter === "all";
  const mid = Math.ceil(filtered.length / 2);
  const colA = isTwoCol ? filtered.slice(0, mid) : filtered;
  const colB = isTwoCol ? filtered.slice(mid) : [];

  return (
    <section
      ref={ref}
      id="agenda"
      style={{
        background: "transparent",
        padding: "clamp(40px,5vw,72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blue atmosphere */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${C}0A, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 60% at 85% 50%, #1a3a5c10, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 40% at 10% 75%, #0a2a4a0A, transparent 60%)` }} />
      <DotMatrixGrid color={C} opacity={0.02} spacing={26} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>
              Full Day Programme
            </span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.8vw,48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.08, margin: "16px 0 0" }}>
            Agenda
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontStyle: "italic", color: "#404040", marginTop: 14 }}>
            Draft agenda, subject to change.
          </p>
        </motion.div>

        {/* Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="flex flex-wrap justify-center gap-2"
          style={{ marginBottom: 32 }}
        >
          {AGENDA_FILTERS.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                suppressHydrationWarning
                onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: "7px 20px",
                  borderRadius: 50,
                  background: isActive ? C : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? C : "rgba(255,255,255,0.06)"}`,
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "white" : "#606060",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = `${C}15`;
                    e.currentTarget.style.borderColor = `${C}30`;
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "#606060";
                  }
                }}
              >
                {f.label}
              </button>
            );
          })}
        </motion.div>

        {/* ── Glass Container ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          style={{
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(8,20,35,0.6) 0%, rgba(4,12,24,0.45) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(60,140,200,0.08)",
            boxShadow: `0 24px 80px rgba(0,6,20,0.5), inset 0 1px 0 rgba(100,180,255,0.04)`,
            padding: "clamp(24px,3vw,40px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top edge glow */}
          <div className="absolute pointer-events-none" style={{ top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${C}30, transparent)` }} />
          <div className="absolute pointer-events-none" style={{ top: 0, left: 0, right: 0, height: 100, background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${C}04, transparent)`, borderRadius: "24px 24px 0 0" }} />

          {/* Content: 2-col for "all", single centered col for filtered */}
          <div
            className={isTwoCol ? "cfk-agenda-cols" : ""}
            style={{
              display: "grid",
              gridTemplateColumns: isTwoCol ? "1fr 1fr" : "1fr",
              maxWidth: isTwoCol ? "none" : 680,
              margin: isTwoCol ? 0 : "0 auto",
              gap: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Column 1 (or only column when filtered) */}
            <div style={{
              paddingRight: isTwoCol ? "clamp(16px,2vw,32px)" : 0,
              borderRight: isTwoCol ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <AnimatePresence mode="popLayout">
                  {colA.map((item, i) => {
                    const cfg = AGENDA_TYPE_CONFIG[item.type] || AGENDA_TYPE_CONFIG.break;
                    const idx = AGENDA.indexOf(item);
                    return (
                      <motion.div
                        key={`agenda-${idx}`}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.3, delay: i * 0.02, ease: EASE }}
                      >
                        <AgendaItem item={item} cfg={cfg} />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Center rail glow (only in 2-col mode) */}
            {isTwoCol && (
              <div className="cfk-agenda-rail-glow absolute pointer-events-none" style={{ top: 0, bottom: 0, left: "50%", width: 2, transform: "translateX(-50%)", background: `linear-gradient(180deg, transparent, ${C}15, ${C}08, transparent)` }} />
            )}

            {/* Column 2 (only in 2-col mode) */}
            {isTwoCol && (
              <div style={{ paddingLeft: "clamp(16px,2vw,32px)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <AnimatePresence mode="popLayout">
                    {colB.map((item, i) => {
                      const cfg = AGENDA_TYPE_CONFIG[item.type] || AGENDA_TYPE_CONFIG.break;
                      const idx = AGENDA.indexOf(item);
                      return (
                        <motion.div
                          key={`agenda-${idx}`}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.3, delay: 0.1 + i * 0.02, ease: EASE }}
                        >
                          <AgendaItem item={item} cfg={cfg} />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .cfk-agenda-cols { grid-template-columns: 1fr !important; }
          .cfk-agenda-cols > div:first-child { border-right: none !important; padding-right: 0 !important; }
          .cfk-agenda-cols > div:last-child { padding-left: 0 !important; }
          .cfk-agenda-rail-glow { display: none !important; }
        }
      `}</style>
    </section>
  );
}

function AgendaItem({
  item,
  cfg,
}: {
  item: (typeof AGENDA)[0];
  cfg: { color: string; label: string; tier: string };
}) {
  const [hovered, setHovered] = useState(false);
  const isBreak = cfg.tier === "break";
  const isHeadline = cfg.tier === "headline";
  const isSponsor = cfg.tier === "sponsor";

  // ── Break: minimal separator ──
  if (isBreak) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0" }}>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))" }} />
        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 500, color: "#353535", whiteSpace: "nowrap" }}>
          {item.time}
        </span>
        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: "#404040", whiteSpace: "nowrap" }}>
          {item.title}
        </span>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.05))" }} />
      </div>
    );
  }

  // ── Sponsor: compact line ──
  if (isSponsor) {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "7px 12px",
          borderRadius: 8,
          borderLeft: `2px solid ${cfg.color}30`,
          background: hovered ? "rgba(255,255,255,0.02)" : "transparent",
          transition: "all 0.25s",
          cursor: "default",
        }}
      >
        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 500, color: "#303030", whiteSpace: "nowrap", minWidth: 80 }}>
          {item.time}
        </span>
        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: hovered ? "#555" : "#404040", transition: "color 0.2s" }}>
          {item.title}
        </span>
      </div>
    );
  }

  // ── Headline & Standard: clean card ──
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: isHeadline ? 14 : 10,
        background: hovered ? `${cfg.color}08` : "rgba(255,255,255,0.008)",
        borderTop: `1px solid ${hovered ? `${cfg.color}25` : "rgba(255,255,255,0.03)"}`,
        borderRight: `1px solid ${hovered ? `${cfg.color}25` : "rgba(255,255,255,0.03)"}`,
        borderBottom: `1px solid ${hovered ? `${cfg.color}25` : "rgba(255,255,255,0.03)"}`,
        borderLeft: `${isHeadline ? 3 : 2}px solid ${hovered ? cfg.color : `${cfg.color}${isHeadline ? "50" : "25"}`}`,
        padding: isHeadline ? "16px 18px" : "12px 16px",
        cursor: "default",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered && isHeadline ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered && isHeadline ? `0 8px 24px ${cfg.color}08` : "none",
      }}
    >
      {/* Time + label */}
      <div className="flex items-center gap-3" style={{ marginBottom: item.subtitle ? 8 : 0 }}>
        <span style={{
          fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600,
          color: hovered ? `${cfg.color}` : isHeadline ? "rgba(255,255,255,0.5)" : "#505050",
          whiteSpace: "nowrap", transition: "color 0.3s", minWidth: 80,
        }}>
          {item.time}
        </span>
        <span style={{
          fontFamily: "var(--font-outfit)", fontSize: 8, fontWeight: 700,
          letterSpacing: "1px", textTransform: "uppercase",
          color: cfg.color, opacity: 0.7,
        }}>
          {cfg.label}
        </span>
      </div>

      {/* Title */}
      <h4 style={{
        fontFamily: "var(--font-display)",
        fontSize: isHeadline ? 15 : 13,
        fontWeight: isHeadline ? 700 : 600,
        color: isHeadline ? (hovered ? "white" : "rgba(255,255,255,0.85)") : (hovered ? "#c0c0c0" : "#808080"),
        lineHeight: 1.35, margin: 0, transition: "color 0.3s",
      }}>
        {item.title}
      </h4>

      {/* Subtitle, clean text only, no icon box */}
      {item.subtitle && (
        <p style={{
          fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 300,
          color: "rgba(255,255,255,0.4)", lineHeight: 1.65,
          margin: "8px 0 0", paddingLeft: 0,
        }}>
          {item.subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Who Should Attend ───────────────────────────────────────────────────────
const WHO_ATTEND_ROLES = [
  { label: "CISOs & Senior Cybersecurity Leaders", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { label: "CIOs, CTOs & IT Directors", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" },
  { label: "SOC Managers & Security Operations Teams", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { label: "Cloud, Network & Infrastructure Security Engineers", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { label: "Risk, Compliance & Data Protection Officers", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Government & Regulatory Authority Representatives", icon: "M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11" },
  { label: "OT/ICS Security Professionals from Critical Sectors", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { label: "Banking, Fintech & Telecom Security Heads", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
  { label: "CEOs, COOs & Business Decision-Makers", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
  { label: "Cybersecurity Vendors, Consultants & MSSPs", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { label: "University Researchers & Educators", icon: "M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" },
];

function WhoShouldAttend() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hoveredRole, setHoveredRole] = useState<number | null>(null);
  const [hoveredInd, setHoveredInd] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      style={{
        background: "transparent",
        padding: "clamp(40px,5vw,72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background S3 image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://efg-final.s3.eu-north-1.amazonaws.com/cyberbg.jpg"
        alt="Cyber First Kuwait 2026 cybersecurity summit"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ filter: "brightness(0.28) saturate(0.8)" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, #030810 0%, rgba(3,8,16,0.85) 40%, rgba(3,8,16,0.9) 70%, #030810 100%)" }} />

      {/* Atmospheric layers */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 75% 30%, ${C}06, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 40% at 20% 80%, ${C}03, transparent 70%)` }} />
      <DotMatrixGrid color={C} opacity={0.015} spacing={30} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: 48 }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>
              Your Audience
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.8vw,48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.08, margin: 0 }}>
            Who Should Attend
          </h2>
        </motion.div>

        {/* ── Split Layout: 1fr auto ── */}
        <div className="cfk-attend-split" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "48px 56px", alignItems: "center" }}>

          {/* ── LEFT: Roles (2-column grid) ── */}
          <div className="cfk-attend-roles" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 32px" }}>
            {WHO_ATTEND_ROLES.map((role, i) => (
              <motion.div
                key={role.label}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.035, ease: EASE }}
                onMouseEnter={() => setHoveredRole(i)}
                onMouseLeave={() => setHoveredRole(null)}
                className="flex items-center gap-3"
                style={{
                  padding: "12px 8px",
                  borderRadius: 10,
                  background: hoveredRole === i ? `${C}06` : "transparent",
                  transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  cursor: "default",
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: hoveredRole === i ? `${C}15` : `${C}08`,
                  border: `1px solid ${hoveredRole === i ? `${C}35` : `${C}12`}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.3s",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={hoveredRole === i ? C_BRIGHT : `${C}55`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s" }}>
                    <path d={role.icon} />
                  </svg>
                </div>
                <span style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: hoveredRole === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                  transition: "all 0.3s",
                  lineHeight: 1.35,
                }}>
                  {role.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* ── RIGHT: Glass Industries Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            style={{
              padding: "28px 24px",
              borderRadius: 20,
              background: `linear-gradient(135deg, rgba(1,187,245,0.06), rgba(1,187,245,0.02))`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid rgba(1,187,245,0.12)`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.3)",
              position: "relative",
              overflow: "hidden",
              width: "fit-content",
              alignSelf: "flex-start",
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 60% at 80% 20%, ${C}08, transparent 60%)` }} />

            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 700,
              color: C,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: 16,
              position: "relative",
              zIndex: 1,
            }}>
              Key Industries
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 2, position: "relative", zIndex: 1 }}>
              {WHO_ATTEND_INDUSTRIES.map((ind, i) => (
                <motion.div
                  key={ind.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.35 + i * 0.04, ease: EASE }}
                  onMouseEnter={() => setHoveredInd(i)}
                  onMouseLeave={() => setHoveredInd(null)}
                  className="flex items-center gap-3"
                  style={{
                    padding: "9px 16px",
                    borderRadius: 10,
                    border: `1px solid ${hoveredInd === i ? `${C}25` : "transparent"}`,
                    background: hoveredInd === i ? `${C}08` : "transparent",
                    transition: "all 0.25s",
                    cursor: "default",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={hoveredInd === i ? C_BRIGHT : `${C}60`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "stroke 0.3s" }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    fontWeight: hoveredInd === i ? 600 : 500,
                    color: hoveredInd === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
                    transition: "all 0.3s",
                    whiteSpace: "nowrap",
                  }}>
                    {ind.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Stat line (full-width below grid) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
          style={{ padding: "24px 0 0" }}
        >
          <div style={{ height: 1, background: `${C}18`, marginBottom: 14 }} />
          <div className="flex items-center gap-4 flex-wrap">
            {["350+ Senior Leaders", "7 Industries", "1 Transformative Day"].map((stat) => (
              <span key={stat} style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
                {stat}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .cfk-attend-split {
            grid-template-columns: 1fr !important;
          }
          .cfk-attend-roles {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Advisory Board ───────────────────────────────────────────────────────────
type AdvisoryMember = {
  name: string;
  title: string;
  org: string;
  photo: string | null;
  linkedin: string | null;
};

const ADVISORY_BOARD: AdvisoryMember[] = [
  {
    name: "Shaheela Banu A. Majeed",
    title: "Information Security & Compliance Officer & Auditor",
    org: "Oil & Gas / Confidential",
    photo: `${S3}/shaheela-majeed-new.jpg`,
    linkedin: "https://www.linkedin.com/in/shaheela-banu/",
  },
  {
    name: "Mohamed Rushdhi",
    title: "Head of Information Security Unit",
    org: "The Industrial Bank of Kuwait",
    photo: null,
    linkedin: "https://www.linkedin.com/in/rushdhi-mohamed-information-security/",
  },
  {
    name: "Dr Fai Ben Salamah",
    title: "Cybersecurity Expert",
    org: "Kuwait Technical College",
    photo: `${S3}/dr-fai-ben-salamah-new.jpg`,
    linkedin: "https://www.linkedin.com/in/dr-fai-ben-salamah-83113b1a0/",
  },
  {
    name: "Eng. Yousef H. El-Kordi",
    title: "Group Information Technology Director",
    org: "City Group",
    photo: `${S3}/yousef-el-kourdi-new.jpg`,
    linkedin: "https://www.linkedin.com/in/yousefelkordi/",
  },
  {
    name: "Abdulmohsen Alsulaimi",
    title: "Group Chief Technology Officer",
    org: "Towell",
    photo: null,
    linkedin: null,
  },
];

function getInitials(name: string): string {
  return name
    .replace(/^(Dr|Eng|Mr|Ms|Mrs)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function AdvisoryBoard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const railInnerRef = useRef<HTMLDivElement>(null);
  // Lock the continuous drift while a manual smooth-scroll (dot click or end-reset) plays out.
  const autoLockedRef = useRef(false);
  // Page-based pagination — number of "scroll screens" needed, not per-card.
  // Stays at 1 when everything fits → pagination hidden.
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Recompute pageCount whenever the rail width or content width changes.
  useEffect(() => {
    const rail = railInnerRef.current;
    if (!rail) return;
    const recalc = () => {
      if (rail.clientWidth <= 0) return;
      const pages = Math.max(1, Math.ceil(rail.scrollWidth / rail.clientWidth));
      setPageCount(pages);
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(rail);
    return () => ro.disconnect();
  }, []);

  // Sync activePage to current scroll position.
  useEffect(() => {
    const rail = railInnerRef.current;
    if (!rail) return;
    let raf = 0;
    const update = () => {
      if (rail.clientWidth <= 0) return;
      const page = Math.round(rail.scrollLeft / rail.clientWidth);
      setActivePage(Math.max(0, Math.min(page, pageCount - 1)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      rail.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pageCount]);

  const scrollToPage = useCallback((page: number) => {
    const rail = railInnerRef.current;
    if (!rail) return;
    autoLockedRef.current = true;
    rail.scrollTo({
      left: page * rail.clientWidth,
      behavior: "smooth",
    });
    window.setTimeout(() => {
      autoLockedRef.current = false;
    }, 900);
  }, []);

  // Continuous auto-drift through the rail at a gentle constant speed.
  // When it reaches the end, smooth-scrolls back to the first card and resumes.
  // Pauses while hovered, respects prefers-reduced-motion, only runs once in view.
  useEffect(() => {
    if (!inView || isHovered) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const rail = railInnerRef.current;
    if (!rail) return;

    const SPEED_PX_PER_SEC = 40;
    let lastTime = performance.now();
    let rafId = 0;
    let resetTimer = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Manual scrolls (dot clicks / end-reset) lock the tick so the smooth scroll wins.
      if (autoLockedRef.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (maxScroll <= 0) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Reached the end → smooth-glide back to the first card, then resume drift.
      if (rail.scrollLeft >= maxScroll - 0.5) {
        autoLockedRef.current = true;
        rail.scrollTo({ left: 0, behavior: "smooth" });
        resetTimer = window.setTimeout(() => {
          autoLockedRef.current = false;
          lastTime = performance.now();
        }, 1400);
        rafId = requestAnimationFrame(tick);
        return;
      }

      rail.scrollLeft += SPEED_PX_PER_SEC * dt;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(resetTimer);
    };
  }, [inView, isHovered]);

  return (
    <section
      ref={ref}
      style={{
        background: "transparent",
        padding: "clamp(40px, 5vw, 72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric effects */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${C}06, transparent 70%)` }} />
      <DotMatrixGrid color={C} opacity={0.015} spacing={30} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C_BRIGHT }}>
              Leadership
            </span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.8vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.08, margin: "16px 0 0" }}>
            Advisory Board
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 500, margin: "14px auto 0", lineHeight: 1.6 }}>
            Industry leaders shaping the summit agenda and driving cybersecurity excellence across Kuwait.
          </p>
        </motion.div>

        {/* Horizontal scroll rail — section height stays fixed no matter how many advisors join */}
        <div
          className="cfk-advisor-rail"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="cfk-advisor-rail-inner" ref={railInnerRef}>
            {ADVISORY_BOARD.map((member, i) => {
              const hasLinkedin = !!member.linkedin;
              const initials = getInitials(member.name);
              const motionProps = {
                initial: { opacity: 0, y: 18 },
                animate: inView ? { opacity: 1, y: 0 } : {},
                transition: { duration: 0.55, delay: 0.08 + i * 0.05, ease: EASE },
              };

              const cardInner = (
                <>
                  <span aria-hidden className="cfk-advisor-hairline" />

                  {/* Numbered badge */}
                  <span aria-hidden className="cfk-advisor-num">
                    <span className="cfk-advisor-num-dot" />
                    No. {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="cfk-advisor-frame">
                    {member.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.photo} alt={member.name} loading="lazy" className="cfk-advisor-photo" />
                    ) : (
                      <div className="cfk-advisor-fallback" aria-hidden>
                        <span>{initials}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="cfk-advisor-name">{member.name}</h3>
                  <p className="cfk-advisor-title">{member.title}</p>

                  <div className="cfk-advisor-foot">
                    <span className="cfk-advisor-org">{member.org}</span>
                    {hasLinkedin && (
                      <span aria-hidden className="cfk-advisor-ln">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
                        </svg>
                      </span>
                    )}
                  </div>
                </>
              );

              if (hasLinkedin) {
                return (
                  <motion.a
                    key={member.name}
                    href={member.linkedin ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="cfk-advisor-card is-link"
                    {...motionProps}
                  >
                    {cardInner}
                  </motion.a>
                );
              }
              return (
                <motion.div
                  key={member.name}
                  className="cfk-advisor-card"
                  {...motionProps}
                >
                  {cardInner}
                </motion.div>
              );
            })}
          </div>

          {/* Pagination dots — one per scroll page, only shown when there's something to scroll */}
          {pageCount > 1 && (
            <div className="cfk-advisor-pagination" role="tablist" aria-label="Advisor pagination">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={activePage === i}
                  aria-label={`Page ${i + 1} of ${pageCount}`}
                  onClick={() => scrollToPage(i)}
                  suppressHydrationWarning
                  className={`cfk-advisor-dot ${activePage === i ? "is-active" : ""}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        /* ── Full-bleed rail — escapes the 1200px container, then pads from viewport edges ── */
        .cfk-advisor-rail {
          position: relative;
          width: 100vw;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          margin-top: 8px;
          padding: 0 clamp(48px, 7vw, 140px);
          box-sizing: border-box;
        }
        .cfk-advisor-rail-inner {
          display: flex;
          gap: clamp(12px, 1.2vw, 18px);
          overflow-x: auto;
          overflow-y: visible;
          padding: 6px 4px 12px;
          /* No scroll-snap — it fights the continuous auto-drift by pulling each
             sub-pixel increment back to the nearest snap point. Dot clicks still
             land precisely via the explicit scrollTo call. */
          scroll-behavior: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          /* Soft fade so cards visibly dissolve at the rail's right edge when there's more to scroll */
          -webkit-mask-image: linear-gradient(90deg, black 0, black calc(100% - 32px), transparent 100%);
          mask-image: linear-gradient(90deg, black 0, black calc(100% - 32px), transparent 100%);
        }
        .cfk-advisor-rail-inner::-webkit-scrollbar { display: none; }

        /* ── Pagination dots ── */
        .cfk-advisor-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          margin: clamp(22px, 2.4vw, 32px) 0 0;
          padding: 0;
        }
        .cfk-advisor-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: width 0.45s cubic-bezier(0.16,1,0.3,1),
                      background 0.3s ease,
                      border-radius 0.45s ease,
                      box-shadow 0.3s ease,
                      transform 0.3s ease;
        }
        .cfk-advisor-dot:hover {
          background: rgba(255,255,255,0.4);
          transform: scale(1.15);
        }
        .cfk-advisor-dot.is-active {
          background: ${C_BRIGHT};
          width: 28px;
          border-radius: 4px;
          box-shadow: 0 0 14px ${C_BRIGHT}66, 0 0 0 1px ${C}30;
          transform: none;
        }
        .cfk-advisor-dot:focus-visible {
          outline: 2px solid ${C_BRIGHT};
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          .cfk-advisor-dot { transition: background 0.2s ease, width 0s !important; }
        }

        /* ── Compact "badge" card ── */
        .cfk-advisor-card {
          position: relative;
          /* Sized so the 6-advisor lineup always overflows the rail at desktop widths,
             which guarantees the continuous auto-scroll has something to scroll. */
          flex: 0 0 clamp(248px, 22vw, 296px);
          display: flex;
          flex-direction: column;
          padding: clamp(16px, 1.6vw, 20px);
          border-radius: 16px;
          background: linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.012) 100%);
          border: 1px solid rgba(255,255,255,0.06);
          text-decoration: none;
          color: inherit;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .cfk-advisor-card.is-link { cursor: pointer; }
        .cfk-advisor-card:hover {
          transform: translateY(-4px);
          border-color: ${C}35;
          box-shadow: 0 16px 36px rgba(0,0,0,0.4), 0 0 0 1px ${C}1f;
        }

        /* Top hairline accent — section signature */
        .cfk-advisor-hairline {
          position: absolute;
          top: 0;
          left: 14%;
          right: 14%;
          height: 1px;
          background: linear-gradient(90deg, transparent, ${C}66, ${C_BRIGHT}, ${C}66, transparent);
          opacity: 0.55;
          transition: opacity 0.4s ease;
        }
        .cfk-advisor-card:hover .cfk-advisor-hairline { opacity: 1; }

        /* Numbered badge — liquid glass pill */
        .cfk-advisor-num {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 4;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 9px;
          border-radius: 999px;
          background: rgba(4, 8, 14, 0.55);
          border: 1px solid ${C}40;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
          font-family: var(--font-outfit);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: white;
        }
        .cfk-advisor-num-dot {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: ${C_BRIGHT};
          box-shadow: 0 0 8px ${C_BRIGHT};
        }
        .cfk-advisor-card:hover .cfk-advisor-num {
          border-color: ${C_BRIGHT}66;
        }

        /* Photo frame — small rounded square at top */
        .cfk-advisor-frame {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(160deg, #0e1a24, #080b10);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
          margin-bottom: clamp(12px, 1.2vw, 16px);
        }
        .cfk-advisor-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: brightness(0.94) saturate(1.04);
          transition: transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.4s ease;
        }
        .cfk-advisor-card:hover .cfk-advisor-photo {
          transform: scale(1.05);
          filter: brightness(1.06) saturate(1.1);
        }
        .cfk-advisor-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(ellipse 80% 60% at 50% 40%, ${C}1f 0%, transparent 70%),
            linear-gradient(160deg, #0e1a24 0%, #080b10 100%);
        }
        .cfk-advisor-fallback span {
          font-family: var(--font-display);
          font-size: clamp(36px, 4.4vw, 48px);
          font-weight: 800;
          color: ${C_BRIGHT};
          opacity: 0.6;
          letter-spacing: -1.5px;
          text-shadow: 0 4px 18px ${C}66;
        }

        /* Name */
        .cfk-advisor-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(14.5px, 1.3vw, 16px);
          color: white;
          margin: 0 0 6px;
          letter-spacing: -0.3px;
          line-height: 1.2;
          min-height: 2.4em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Title — clamped to keep all cards visually equal-height */
        .cfk-advisor-title {
          font-family: var(--font-outfit);
          font-size: clamp(11px, 0.95vw, 12px);
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          margin: 0 0 12px;
          line-height: 1.4;
          min-height: 3em;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Footer divider + company + LinkedIn */
        .cfk-advisor-foot {
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: border-top-color 0.4s ease;
        }
        .cfk-advisor-card:hover .cfk-advisor-foot {
          border-top-color: ${C}28;
        }
        .cfk-advisor-org {
          flex: 1;
          font-family: var(--font-outfit);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: ${C_BRIGHT};
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cfk-advisor-ln {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: rgba(0,0,0,0.3);
          border: 1px solid ${C}28;
          color: ${C_BRIGHT};
          opacity: 0.7;
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
        }
        .cfk-advisor-card:hover .cfk-advisor-ln {
          opacity: 1;
          background: ${C}1a;
          border-color: ${C_BRIGHT};
          transform: scale(1.06);
        }

        @media (max-width: 640px) {
          .cfk-advisor-card { flex-basis: 188px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cfk-advisor-card,
          .cfk-advisor-photo {
            transition: none !important;
          }
          .cfk-advisor-card:hover .cfk-advisor-photo {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── From the Room — Editorial mosaic of CF voices ───────────────────────────
const FROM_THE_ROOM_SHORTS: { id: string; videoId: string; label: string }[] = [
  { id: "kw-room-1", videoId: "jPQFjwuohfI", label: "Cyber First Voice" },
  { id: "kw-room-2", videoId: "c8sPwIo4Pis", label: "Cyber First Voice" },
  { id: "kw-room-3", videoId: "2LoeDNqsem0", label: "Cyber First Voice" },
  { id: "kw-room-4", videoId: "8C61dof_f3s", label: "Cyber First Voice" },
  { id: "kw-room-5", videoId: "2-KXhfSeBdQ", label: "Cyber First Voice" },
  { id: "kw-room-6", videoId: "2IwKmGEfOIo", label: "Cyber First Voice" },
];

// Height tiers cycle through 6 visual rhythms so the mosaic still reads
// when more shorts are appended later.
const ROOM_HEIGHTS = ["short", "tall", "hero", "tall", "short", "tall"] as const;
type RoomHeight = (typeof ROOM_HEIGHTS)[number];

function FromTheRoom() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "#070A12",
        padding: "clamp(72px, 9vw, 130px) 0 clamp(120px, 12vw, 180px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background atmosphere */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 45% at 50% 0%, ${C}10, transparent 65%),
                       radial-gradient(ellipse 40% 50% at 15% 100%, ${C}07, transparent 70%),
                       radial-gradient(ellipse 35% 40% at 85% 80%, ${C_BRIGHT}06, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${C}07 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 70% 60% at center, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at center, black 0%, transparent 80%)",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(24px, 4vw, 64px)",
          position: "relative",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ marginBottom: 56, textAlign: "center" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 18,
            }}
          >
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${C})` }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "5px",
                textTransform: "uppercase",
                color: C_BRIGHT,
              }}
            >
              From the Room
            </span>
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${C}, transparent)` }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(32px, 4.4vw, 60px)",
              letterSpacing: "-2px",
              color: "white",
              lineHeight: 1.05,
              margin: "0 auto 14px",
              maxWidth: 760,
            }}
          >
            Hear it{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>
              from the room.
            </em>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 400,
              fontSize: "clamp(14px, 1.1vw, 16px)",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.65,
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            Unfiltered voices from CISOs, regulators, and security leaders who&apos;ve walked the Cyber First floor.
          </p>
        </motion.div>

        {/* Mosaic showcase */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="cfk-room-showcase"
        >
          {FROM_THE_ROOM_SHORTS.map((s, i) => (
            <RoomCard
              key={s.id}
              videoId={s.videoId}
              label={s.label}
              index={i}
              tier={ROOM_HEIGHTS[i % ROOM_HEIGHTS.length] as RoomHeight}
            />
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .cfk-room-showcase {
          display: flex;
          flex-wrap: nowrap;
          gap: clamp(8px, 1vw, 16px);
          align-items: center;
          justify-content: center;
          padding: 12px 4px;
        }
        @media (max-width: 1024px) {
          .cfk-room-showcase {
            overflow-x: auto;
            justify-content: flex-start;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding: 12px clamp(8px, 3vw, 32px);
            margin: 0 calc(-1 * clamp(24px, 4vw, 64px));
          }
          .cfk-room-showcase::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

function RoomCard({
  videoId,
  label,
  index,
  tier,
}: {
  videoId: string;
  label: string;
  index: number;
  tier: RoomHeight;
}) {
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Tier-driven dimensions — viewport-clamped so the full row fits the section.
  const dims =
    tier === "hero"
      ? { w: "clamp(170px, 16.5vw, 240px)", h: "clamp(290px, 28vw, 410px)" }
      : tier === "tall"
      ? { w: "clamp(150px, 14.5vw, 210px)", h: "clamp(250px, 24vw, 350px)" }
      : { w: "clamp(135px, 13vw, 190px)", h: "clamp(215px, 20vw, 300px)" };

  const isHero = tier === "hero";

  return (
    <div
      className="cfk-room-card-wrap"
      style={{
        width: dims.w,
        height: dims.h,
        flexShrink: 0,
        scrollSnapAlign: "center",
        transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer skeumorphic bezel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          padding: 3,
          borderRadius: 22,
          background: isHero
            ? `linear-gradient(160deg, ${C_BRIGHT}66 0%, ${C}33 40%, rgba(255,255,255,0.06) 75%, ${C}22 100%)`
            : `linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 45%, ${C}1A 100%)`,
          boxShadow: hovered
            ? `0 26px 56px rgba(0,0,0,0.55), 0 0 0 1px ${C}40, 0 0 38px ${C}30`
            : `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)`,
          transition: "box-shadow 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Inner recessed panel */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 19,
            overflow: "hidden",
            background: "#04070C",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(0,0,0,0.5)",
            cursor: playing ? "default" : "pointer",
          }}
          onClick={() => !playing && setPlaying(true)}
        >
          {!playing ? (
            <>
              {/* Thumbnail — full brightness, no overlay */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt={label}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 28%",
                  transform: hovered ? "scale(1.04)" : "scale(1)",
                  transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
                }}
              />

              {/* Glass reflection line on top */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: "8%",
                  right: "8%",
                  height: 1,
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                  opacity: 0.5,
                  zIndex: 3,
                }}
              />

              {/* Top: voice index liquid-glass label */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 10px",
                  borderRadius: 999,
                  background: "rgba(4,8,14,0.55)",
                  border: `1px solid ${C}40`,
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                  zIndex: 4,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 999,
                    background: C_BRIGHT,
                    boxShadow: `0 0 8px ${C_BRIGHT}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "white",
                  }}
                >
                  No. {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Hero badge — only on the hero tier */}
              {isHero && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    padding: "5px 10px",
                    borderRadius: 999,
                    background: `linear-gradient(135deg, ${C}, ${C_BRIGHT})`,
                    boxShadow: `0 8px 22px ${C}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#04070C",
                    zIndex: 4,
                  }}
                >
                  Featured
                </div>
              )}

              {/* Center: play button (Apple glass style) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 4,
                }}
              >
                <div
                  style={{
                    width: isHero ? 64 : 52,
                    height: isHero ? 64 : 52,
                    borderRadius: "50%",
                    background: hovered ? `${C}EE` : "rgba(255,255,255,0.92)",
                    boxShadow: hovered
                      ? `0 14px 42px ${C}88, 0 0 0 1px ${C}55, inset 0 1px 0 rgba(255,255,255,0.5)`
                      : "0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.55)",
                    transform: hovered ? "scale(1.08)" : "scale(1)",
                    transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width={isHero ? 22 : 18}
                    height={isHero ? 22 : 18}
                    viewBox="0 0 16 18"
                    fill="none"
                    style={{ marginLeft: 2 }}
                  >
                    <path
                      d="M14 9L2 17V1L14 9Z"
                      fill={hovered ? "white" : "#04070C"}
                      stroke={hovered ? "white" : "#04070C"}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Bottom: meta ribbon */}
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 14,
                  right: 14,
                  zIndex: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "2.5px",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.78)",
                    textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                  }}
                >
                  {label}
                </span>
                <span
                  aria-hidden
                  style={{
                    width: "100%",
                    height: 1,
                    background: `linear-gradient(90deg, ${C}AA 0%, ${C}22 60%, transparent 100%)`,
                    opacity: hovered ? 1 : 0.45,
                    transition: "opacity 0.45s cubic-bezier(0.22,1,0.36,1)",
                  }}
                />
              </div>
            </>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={label}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Awards Section ──────────────────────────────────────────────────────────
function AwardsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const nomRef = useRef(null);
  const nomInView = useInView(nomRef, { once: true, margin: "-60px" });
  const GOLD = "#C4A34A";
  const GOLD_BRIGHT = "#D4B85A";

  const [hoveredAward, setHoveredAward] = useState<number | null>(null);
  const [hoveredElig, setHoveredElig] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    orgName: "",
    contactName: "",
    email: "",
    phone: "",
    category: "",
    reason: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [awardsSelectedCountry, setAwardsSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[2]);
  const [awardsPhoneError, setAwardsPhoneError] = useState<string | null>(null);
  const [awardsEmailError, setAwardsEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setAwardsEmailError(null);
    setAwardsPhoneError(null);

    if (!formData.contactName.trim() || !formData.email.trim()) {
      setSubmitError("Please complete the required fields.");
      return;
    }
    if (formData.email && !isWorkEmail(formData.email)) {
      setAwardsEmailError("Please use your work email address");
      return;
    }
    const phoneErr = validatePhone(formData.phone, awardsSelectedCountry);
    if (phoneErr) {
      setAwardsPhoneError(phoneErr);
      return;
    }

    setIsSubmitting(true);
    const res = await submitForm({
      type: "awards",
      full_name: formData.contactName.trim(),
      email: formData.email.trim(),
      company: formData.orgName.trim(),
      phone: `${awardsSelectedCountry.code} ${formData.phone.trim()}`,
      event_name: "Cyber First Kuwait 2026",
      metadata: {
        "Award Category": formData.category || "",
        "Nominee Company": formData.orgName.trim(),
        "Nomination Reason": formData.reason.trim(),
        "Page Section": "Awards · Nomination Form",
      },
    });
    setIsSubmitting(false);

    if (res.success) {
      setFormSubmitted(true);
    } else {
      setSubmitError(res.error || "Something went wrong. Please try again.");
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "16px 20px",
    borderRadius: 14,
    backgroundColor: focusedField === field ? "rgba(196,163,74,0.08)" : "rgba(10,20,40,0.5)",
    border: `1px solid ${focusedField === field ? `${GOLD}40` : "rgba(80,160,220,0.08)"}`,
    boxShadow: focusedField === field ? `0 0 16px ${GOLD}08` : "none",
    color: "white",
    fontFamily: "var(--font-outfit)",
    fontSize: 15,
    fontWeight: 400,
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
  });

  return (
    <section
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #020810 0%, #041220 30%, #051828 50%, #041220 70%, #020810 100%)",
        padding: "clamp(40px,5vw,72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Deep blue atmosphere */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${C}0A, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 15% 70%, #0a2a4a0C, transparent 60%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 100% 30% at 50% 100%, #001428 0%, transparent 70%)` }} />
      {/* Gold accent glows */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 35% 30% at 50% 35%, ${GOLD}06, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 25% 25% at 75% 65%, ${GOLD}04, transparent 70%)` }} />
      <DotMatrixGrid color={C} opacity={0.02} spacing={26} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative", zIndex: 1 }}>

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 30, height: 1, background: GOLD }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: GOLD }}>
              Recognition
            </span>
            <span style={{ width: 30, height: 1, background: GOLD }} />
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(28px,3.8vw,48px)", letterSpacing: "-1.5px",
            color: "white", lineHeight: 1.08, margin: "16px 0 0",
          }}>
            Cyber First Awards 2026
          </h2>
        </motion.div>

        {/* ── Glass container wrapping all content ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          style={{
            padding: "clamp(28px,3.5vw,48px)",
            borderRadius: 28,
            background: "linear-gradient(180deg, rgba(8,22,45,0.6) 0%, rgba(4,14,30,0.45) 100%)",
            border: "1px solid rgba(80,160,220,0.1)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: `0 24px 80px rgba(0,6,20,0.5), inset 0 1px 0 rgba(100,180,255,0.05), 0 0 120px ${C}03`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top edge glow line */}
          <div className="absolute pointer-events-none" style={{ top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}30, ${C}20, ${GOLD}30, transparent)` }} />
          {/* Inner blue ambient glow at top */}
          <div className="absolute pointer-events-none" style={{ top: 0, left: 0, right: 0, height: 150, background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${C}06, transparent)`, borderRadius: "28px 28px 0 0" }} />
          {/* Inner gold ambient glow at center */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 35% at 50% 50%, ${GOLD}04, transparent 65%)` }} />
          {/* Bottom edge glow */}
          <div className="absolute pointer-events-none" style={{ bottom: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${C}15, transparent)` }} />

          <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── 1. About + 2. Awards List (Split Row) ── */}
        <div className="cfk-awards-top" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

          {/* LEFT: About Awards, glass card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            style={{
              padding: "clamp(28px,3vw,40px)",
              borderRadius: 20,
              background: "linear-gradient(160deg, rgba(12,28,50,0.5) 0%, rgba(6,18,35,0.35) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(80,160,220,0.08)",
              boxShadow: `inset 0 1px 0 rgba(100,180,255,0.04), 0 8px 32px rgba(0,4,12,0.3)`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glass highlight at top */}
            <div className="absolute pointer-events-none" style={{ top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg, transparent, rgba(100,180,255,0.12), transparent)` }} />
            {/* Cyan orb */}
            <div className="absolute pointer-events-none" style={{ bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: `${C}08`, filter: "blur(70px)" }} />

            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "clamp(18px,2.2vw,22px)", letterSpacing: "-0.5px",
              color: "white", lineHeight: 1.28, margin: "0 0 20px", position: "relative", zIndex: 1,
            }}>
              Recognising Visionary Leadership &amp; Cybersecurity Innovation Across Kuwait
            </h3>
            <p style={{
              fontFamily: "var(--font-outfit)", fontWeight: 350,
              fontSize: "clamp(13px,1.1vw,15px)", color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7, margin: 0, position: "relative", zIndex: 1,
            }}>
              The Cyber First Awards 2026 celebrate outstanding individuals and organisations driving cybersecurity leadership, innovation, and resilience across Kuwait&rsquo;s public and private sectors. These awards honour pioneers strengthening national cyber defence, securing digital transformation, and building trusted digital ecosystems.
            </p>
          </motion.div>

          {/* RIGHT: Award Categories List */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.22, ease: EASE }}
            style={{
              padding: "clamp(28px,3vw,40px)",
              borderRadius: 20,
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_BRIGHT} 100%)`,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 90% 10%, rgba(255,255,255,0.12), transparent 60%)" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 6, position: "relative", zIndex: 1 }}>
              {AWARDS_DATA.map((award, i) => (
                <motion.div
                  key={award.title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.3 + i * 0.06, ease: EASE }}
                  onMouseEnter={() => setHoveredAward(i)}
                  onMouseLeave={() => setHoveredAward(null)}
                  className="flex items-center gap-3"
                  style={{
                    padding: "11px 14px",
                    borderRadius: 12,
                    background: hoveredAward === i ? "rgba(255,255,255,0.14)" : "transparent",
                    transition: "background 0.25s",
                    cursor: "default",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span style={{
                    fontFamily: "var(--font-outfit)", fontSize: "clamp(13px,1.1vw,15px)",
                    fontWeight: 600, color: "rgba(0,0,0,0.8)",
                    lineHeight: 1.35,
                  }}>
                    {award.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, margin: "28px 0", background: `linear-gradient(90deg, transparent, ${C}15, ${GOLD}20, ${C}15, transparent)` }} />

        {/* ── 3. Nominations & Eligibility (Split Row), with event photo backdrop ── */}
        <div style={{ position: "relative", borderRadius: 20, overflow: "hidden" }}>
          {/* Event photo backdrop */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-28.jpg`}
            alt="Cyber First Kuwait 2026 cybersecurity summit"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ filter: "brightness(0.15) saturate(0.6)" }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(3,8,16,0.7) 0%, transparent 25%, transparent 75%, rgba(3,8,16,0.7) 100%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${GOLD}08, transparent 70%)` }} />

          <div ref={nomRef} className="cfk-awards-nom" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, position: "relative", zIndex: 1, padding: "clamp(24px,3vw,40px)" }}>

          {/* LEFT: Nominations text + Eligibility list */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={nomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
          >
            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(24px,3vw,36px)", letterSpacing: "-1px",
              color: "white", lineHeight: 1.1, margin: "0 0 18px",
            }}>
              Award Nominations
            </h3>
            <p style={{
              fontFamily: "var(--font-outfit)", fontWeight: 350,
              fontSize: "clamp(13px,1.1vw,15px)", color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7, margin: "0 0 32px",
            }}>
              Cyber First Awards recognise organisations and leaders demonstrating exceptional contributions to Kuwait&rsquo;s cybersecurity ecosystem.
            </p>

            <h4 style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: 15, color: "white", margin: "0 0 16px",
            }}>
              Eligibility
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {AWARDS_ELIGIBILITY.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={nomInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.05, ease: EASE }}
                  onMouseEnter={() => setHoveredElig(i)}
                  onMouseLeave={() => setHoveredElig(null)}
                  className="flex items-center gap-3"
                  style={{
                    padding: "10px 8px",
                    borderRadius: 10,
                    background: hoveredElig === i ? `${GOLD}0A` : "transparent",
                    transition: "all 0.3s",
                    cursor: "default",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={hoveredElig === i ? GOLD : `${GOLD}70`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "stroke 0.3s" }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span style={{
                    fontFamily: "var(--font-outfit)", fontSize: 14,
                    fontWeight: 450, color: hoveredElig === i ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)",
                    transition: "color 0.3s",
                  }}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Nomination Form, glass card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={nomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            style={{
              padding: "clamp(24px,3vw,36px)",
              borderRadius: 20,
              background: "linear-gradient(170deg, rgba(12,28,50,0.5) 0%, rgba(6,18,35,0.35) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(80,160,220,0.08)",
              boxShadow: `inset 0 1px 0 rgba(100,180,255,0.04), 0 8px 32px rgba(0,4,12,0.3)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glass highlight at top */}
            <div className="absolute pointer-events-none" style={{ top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg, transparent, rgba(100,180,255,0.12), transparent)` }} />
            {/* Gold orb top-right, cyan orb bottom-left */}
            <div className="absolute pointer-events-none" style={{ top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: `${GOLD}08`, filter: "blur(60px)" }} />
            <div className="absolute pointer-events-none" style={{ bottom: -30, left: -30, width: 160, height: 160, borderRadius: "50%", background: `${C}08`, filter: "blur(60px)" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
                <span style={{ width: 20, height: 1, background: GOLD }} />
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: GOLD }}>
                  Nominate
                </span>
              </div>
              <h4 style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "clamp(18px,2vw,22px)", letterSpacing: "-0.5px",
                color: "white", lineHeight: 1.15, margin: "0 0 20px",
              }}>
                Submit Your Nomination
              </h4>

              {!formSubmitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="cfk-awards-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <input
                      type="text"
                      placeholder="Organisation Name"
                      required
                      value={formData.orgName}
                      onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                      onFocus={() => setFocusedField("orgName")}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle("orgName")}
                      suppressHydrationWarning
                    />
                    <input
                      type="text"
                      placeholder="Contact Person"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      onFocus={() => setFocusedField("contactName")}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle("contactName")}
                      suppressHydrationWarning
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={formData.email}
                      onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setAwardsEmailError(null); }}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => { setFocusedField(null); if (formData.email && !isWorkEmail(formData.email)) setAwardsEmailError("Please use your work email address"); }}
                      style={inputStyle("email")}
                      suppressHydrationWarning
                    />
                    {awardsEmailError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "4px 0 0" }}>{awardsEmailError}</p>}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <select
                        value={`${awardsSelectedCountry.code}|${awardsSelectedCountry.country}`}
                        onChange={(e) => { const [code, country] = e.target.value.split("|"); const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country); if (c) { setAwardsSelectedCountry(c); setAwardsPhoneError(null); } }}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        style={{ ...inputStyle("phone"), width: 130, flexShrink: 0, appearance: "none" as const, cursor: "pointer" }}
                        suppressHydrationWarning
                      >
                        {COUNTRY_CODES.map((cc) => (<option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: "#222", background: "#fff" }}>{cc.country} {cc.code}</option>))}
                      </select>
                      <input
                        type="tel"
                        placeholder={awardsSelectedCountry.placeholder}
                        value={formData.phone}
                        onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setAwardsPhoneError(null); }}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        maxLength={awardsSelectedCountry.length}
                        style={{ ...inputStyle("phone"), flex: 1 }}
                        suppressHydrationWarning
                      />
                    </div>
                    {awardsPhoneError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "4px 0 0" }}>{awardsPhoneError}</p>}
                  </div>

                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    onFocus={() => setFocusedField("category")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...inputStyle("category"),
                      marginBottom: 12,
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23707070' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 18px center",
                      cursor: "pointer",
                      color: formData.category ? "white" : "rgba(255,255,255,0.35)",
                    }}
                    suppressHydrationWarning
                  >
                    <option value="" disabled style={{ color: "#555", background: "#111" }}>Select Award Category</option>
                    {AWARDS_DATA.map((a) => (
                      <option key={a.title} value={a.title} style={{ color: "white", background: "#111" }}>
                        {a.title}
                      </option>
                    ))}
                  </select>

                  <textarea
                    placeholder="Why should this nominee be considered?"
                    required
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    onFocus={() => setFocusedField("reason")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...inputStyle("reason"),
                      marginBottom: 20,
                      resize: "vertical",
                      minHeight: 80,
                    }}
                    suppressHydrationWarning
                  />

                  <button
                    type="submit"
                    suppressHydrationWarning
                    disabled={isSubmitting}
                    style={{
                      padding: "14px 40px",
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_BRIGHT} 100%)`,
                      border: "none",
                      color: "#000",
                      fontFamily: "var(--font-display)",
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: "-0.2px",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      opacity: isSubmitting ? 0.7 : 1,
                      transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    }}
                    onMouseEnter={(e) => {
                      if (isSubmitting) return;
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 12px 32px rgba(196,163,74,0.25)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {isSubmitting ? "Submitting…" : "Submit Nomination"}
                  </button>
                  {submitError && (
                    <p style={{
                      color: "#ef4444",
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12,
                      margin: "10px 0 0",
                    }}>
                      {submitError}
                    </p>
                  )}
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{ textAlign: "center", padding: "32px 16px" }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: `${GOLD}15`, border: `1px solid ${GOLD}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h4 style={{
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    fontSize: 18, color: "white", margin: "0 0 8px",
                  }}>
                    Nomination Submitted
                  </h4>
                  <p style={{
                    fontFamily: "var(--font-outfit)", fontSize: 13,
                    color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: 0,
                  }}>
                    Thank you. Our committee will review your submission and follow up shortly.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
          </div>{/* close nom grid */}
        </div>{/* close photo backdrop wrapper */}

          </div>{/* close zIndex:1 inner */}
        </motion.div>{/* close glass container */}
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .cfk-awards-top { grid-template-columns: 1fr !important; }
          .cfk-awards-nom { grid-template-columns: 1fr !important; }
          .cfk-awards-form-grid { grid-template-columns: 1fr !important; }
        }
        .cfk-awards-form-grid input::placeholder,
        .cfk-awards-form-grid + select,
        .cfk-awards-form-grid ~ textarea::placeholder {
          color: rgba(255,255,255,0.3);
        }
      `}</style>
    </section>
  );
}


// ─── Contact Section ──────────────────────────────────────────────────────────
const S3_TEAM = "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos";

const CFK_CONTACTS = {
  speaking: {
    name: "Harini Sudhakar",
    role: "Producer",
    phone: "+971 50 615 9216",
    email: "harini@eventsfirstgroup.com",
    photo: `${S3_TEAM}/Harini.jpg`,
  },
  sponsorship: [
    {
      name: "Mohammed Hassan",
      role: "Partnership Manager",
      phone: "+971 54 302 0244",
      email: "hassan@eventsfirstgroup.com",
      photo: `${S3_TEAM}/hassan.jpg`,
    },
    {
      name: "Danish",
      role: "Partnership Manager",
      phone: "+971 50 987 6543",
      email: "danish@eventsfirstgroup.com",
      photo: "/team/danish.jpg",
    },
  ],
};

function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "#070A12",
        padding: "clamp(56px, 6.5vw, 96px) 0 clamp(64px, 7vw, 110px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 55% 45% at 50% 0%, ${C}10, transparent 65%),
                       radial-gradient(ellipse 40% 50% at 12% 100%, ${C}06, transparent 70%),
                       radial-gradient(ellipse 35% 40% at 88% 80%, ${C_BRIGHT}05, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${C}07 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 70% 60% at center, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at center, black 0%, transparent 80%)",
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          position: "relative",
        }}
      >
        {/* ═══ Editorial header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ marginBottom: 36 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "5px",
                textTransform: "uppercase",
                color: C_BRIGHT,
              }}
            >
              <span style={{ width: 24, height: 1, background: C }} />
              Get in Touch
            </span>
            <span
              style={{
                flex: 1,
                height: 1,
                background: "linear-gradient(90deg, rgba(255,255,255,0.14) 0%, transparent 70%)",
              }}
            />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.6vw, 50px)",
              letterSpacing: "-1.8px",
              color: "white",
              lineHeight: 1.02,
              margin: 0,
              maxWidth: 760,
            }}
          >
            Speak with{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>
              the right team.
            </em>
          </h2>
        </motion.div>

        {/* ═══ Two-column editorial contact list ═══ */}
        <div
          className="cfk-contact-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(20px, 3vw, 56px)",
          }}
        >
          <ContactGroup
            groupLabel="For Speaking Enquiries"
            people={[CFK_CONTACTS.speaking]}
            startDelay={0.18}
            inView={inView}
          />

          <ContactGroup
            groupLabel="For Sponsorship Enquiries"
            people={CFK_CONTACTS.sponsorship}
            startDelay={0.28}
            inView={inView}
          />
        </div>
      </div>

      <style jsx global>{`
        .cfk-contact-row {
          transition: background 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cfk-contact-row:hover {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.025) 0%, transparent 100%);
        }
        .cfk-contact-row:hover .cfk-contact-name {
          color: ${C_BRIGHT};
        }
        .cfk-contact-link {
          transition: color 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cfk-contact-link:hover {
          color: ${C_BRIGHT} !important;
        }
        .cfk-contact-wa:hover {
          background: rgba(37, 211, 102, 0.22) !important;
          border-color: rgba(37, 211, 102, 0.55) !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(37, 211, 102, 0.25);
        }
        @media (max-width: 820px) {
          .cfk-contact-cols {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

function ContactGroup({
  groupLabel,
  people,
  startDelay,
  inView,
}: {
  groupLabel: string;
  people: { name: string; role: string; email: string; phone?: string; photo?: string | null }[];
  startDelay: number;
  inView: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Group eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: startDelay, ease: EASE }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "18px 0 22px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            fontWeight: 700,
            color: C_BRIGHT,
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          {groupLabel}
        </span>
        <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C}30 0%, transparent 80%)` }} />
      </motion.div>

      {/* Rows */}
      {people.map((p, i) => (
        <motion.div
          key={p.email}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: startDelay + 0.1 + i * 0.06, ease: EASE }}
          className="cfk-contact-row"
          style={{
            display: "grid",
            gridTemplateColumns: "108px 1fr",
            columnGap: 26,
            rowGap: 12,
            alignItems: "center",
            padding: "24px 4px",
            borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Portrait disk */}
          <div
            style={{
              width: 108,
              height: 108,
              borderRadius: "50%",
              flexShrink: 0,
              padding: 2.5,
              gridRow: "span 2",
              background: `linear-gradient(135deg, ${C}80 0%, ${C_BRIGHT}55 50%, ${C}25 100%)`,
              boxShadow: `0 12px 28px ${C}25, inset 0 1px 0 rgba(255,255,255,0.18)`,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                background: `linear-gradient(160deg, ${C}30 0%, rgba(4,7,12,0.6) 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.4)",
              }}
            >
              {p.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.photo}
                  alt={p.name}
                  className="w-full h-full"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center 18%",
                  }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 36,
                    fontWeight: 700,
                    color: C_BRIGHT,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {p.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* Name */}
          <h3
            className="cfk-contact-name"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(22px, 2vw, 28px)",
              fontWeight: 700,
              letterSpacing: "-0.6px",
              color: "white",
              lineHeight: 1.08,
              margin: 0,
              transition: "color 0.4s cubic-bezier(0.16,1,0.3,1)",
              alignSelf: "end",
            }}
          >
            {p.name}
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: "1.8px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
                marginLeft: 14,
              }}
            >
              {p.role}
            </span>
          </h3>

          {/* Meta */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "6px 16px",
              fontFamily: "var(--font-outfit)",
              fontSize: 15,
              fontWeight: 400,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.3,
              alignSelf: "start",
            }}
          >
            <a
              href={`mailto:${p.email}`}
              className="cfk-contact-link"
              style={{
                color: "rgba(255,255,255,0.78)",
                textDecoration: "none",
              }}
            >
              {p.email}
            </a>
            <a
              href="https://wa.me/971545714377"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${p.name}`}
              className="cfk-contact-wa"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                borderRadius: 999,
                background: "rgba(37,211,102,0.12)",
                border: "1px solid rgba(37,211,102,0.32)",
                color: "#25D366",
                textDecoration: "none",
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: "0 4px 12px rgba(37,211,102,0.12)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.437-9.884 9.888-9.884a9.825 9.825 0 016.99 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.887 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Venue ────────────────────────────────────────────────────────────────────
function Venue() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });

  // Parallax on venue image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const venueDetails = [
    { icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z", label: "Location", value: "Kuwait City, Kuwait" },
    { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Date", value: "Wednesday, 14 October 2026" },
    { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Time", value: "8:00 AM, 5:00 PM (GST+3)" },
    { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", label: "Format", value: "Full-day conference + networking" },
  ];

  return (
    <section ref={sectionRef} style={{ background: "#030810" }}>
      {/* ── Cinematic venue photo ── */}
      <div
        style={{
          position: "relative",
          height: "65vh",
          minHeight: 500,
          overflow: "hidden",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ y: imgY }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://efg-final.s3.eu-north-1.amazonaws.com/venues/jumeirah-messilah-kuwait.jpg"
            alt="Jumeirah Messilah Beach Hotel Kuwait"
            className="w-full h-full object-cover"
            style={{
              filter: "brightness(0.55) saturate(1.1)",
              minHeight: "120%",
            }}
          />
        </motion.div>

        {/* Bottom gradient fade into dark section */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #030810 0%, rgba(3,8,16,0.5) 35%, rgba(3,8,16,0.05) 65%, rgba(3,8,16,0.3) 100%)",
          }}
        />

        {/* Subtle cyan atmosphere at bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 40% at 50% 100%, ${C}06, transparent 60%)`,
          }}
        />

        {/* Venue name overlaid at bottom of photo, well above the overlap zone */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 clamp(20px,4vw,60px) 120px",
            zIndex: 2,
          }}
        >
          <div style={{ maxWidth: 1320, margin: "0 auto" }}>
            <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: C,
                }}
              >
                The Venue
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(32px,4.5vw,56px)",
                letterSpacing: "-2px",
                color: "white",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              Jumeirah Messilah
              <br />
              <span style={{ color: C }}>Beach Hotel</span>
            </h2>
          </div>
        </div>
      </div>

      {/* ── Floating glassmorphic info card, overlaps the photo ── */}
      <div
        ref={cardRef}
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px,4vw,60px)",
          position: "relative",
          zIndex: 3,
          marginTop: -80,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            background: "rgba(3,8,16,0.55)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${C}15`,
            borderRadius: 22,
            padding: "clamp(28px,3.5vw,44px) clamp(24px,3vw,44px)",
            boxShadow: `0 0 80px ${C}04, 0 25px 60px rgba(0,0,0,0.4)`,
          }}
        >
          {/* Description + detail grid */}
          <div className="cfk-venue-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,3vw,40px)", alignItems: "center" }}>
            {/* Left: tagline + CTA */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 300,
                  fontSize: 15,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.7,
                  margin: "0 0 24px",
                  maxWidth: 420,
                }}
              >
                Kuwait&apos;s premier beachfront conference destination, hosting the region&apos;s
                leading cybersecurity gathering for the third consecutive year.
              </p>
              <a
                href="https://maps.google.com/?q=Jumeirah+Messilah+Beach+Hotel+Kuwait"
                target="_blank"
                rel="noopener noreferrer"
                className="cfk-venue-maps-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 26px",
                  borderRadius: 50,
                  background: `${C}10`,
                  color: C,
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  border: `1px solid ${C}30`,
                  transition: "all 0.3s ease",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Open in Google Maps →
              </a>
            </div>

            {/* Right: 2x2 detail grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {venueDetails.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "18px 16px",
                    background: `${C}05`,
                    border: `1px solid ${C}0A`,
                    borderRadius: 14,
                  }}
                >
                  <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ opacity: 0.7, flexShrink: 0 }}
                    >
                      <path d={item.icon} />
                    </svg>
                    <span
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 10,
                        fontWeight: 600,
                        color: C,
                        textTransform: "uppercase",
                        letterSpacing: "1.5px",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.7)",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom spacing */}
      <div style={{ height: "clamp(48px,6vw,80px)" }} />

      <style jsx global>{`
        .cfk-venue-maps-btn:hover {
          background: rgba(1,187,245,0.15) !important;
          border-color: rgba(1,187,245,0.5) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(1,187,245,0.15);
        }
        @media (max-width: 768px) {
          .cfk-venue-inner {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Registration Section ────────────────────────────────────────────────────
const REG_TABS = [
  {
    key: "attend",
    label: "Attend",
    cta: "Claim My Seat",
    heading: "Secure Your\nPlace",
    description:
      "Cyber First is curated for senior security leaders \u2014 CISOs, CIOs, CTOs, and VP-level executives.",
    perks: [
      { icon: "users", text: "Invite-only, C-suite audience" },
      { icon: "shield", text: "Chatham House Rule sessions" },
      { icon: "calendar", text: "Full-day immersive programme" },
    ],
    trust: "1,500+ senior security leaders attended Cyber First since 2024",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+965 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your interests..." },
    ],
  },
  {
    key: "sponsor",
    label: "Sponsor",
    cta: "Request Sponsorship Info",
    heading: "Partner with\nCyber First",
    description:
      "Put your brand in the room with top CISOs and security decision-makers.",
    perks: [
      { icon: "layers", text: "Boardroom hosting & keynote slots" },
      { icon: "target", text: "Qualified lead generation" },
      { icon: "eye", text: "Premium brand visibility worldwide" },
    ],
    trust: "50+ technology leaders have partnered with Cyber First",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+965 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your sponsorship goals..." },
    ],
  },
  {
    key: "speaker",
    label: "Speak",
    cta: "Submit Speaker Proposal",
    heading: "Share Your\nExpertise",
    description:
      "We platform practitioners, not salespeople. If you\u2019re a hands-on security leader, we want you on stage.",
    perks: [
      { icon: "mic", text: "Keynote & panel opportunities" },
      { icon: "globe", text: "Reach 1,500+ senior security leaders" },
      { icon: "award", text: "Join our speaker alumni network" },
    ],
    trust: "80+ practitioners have spoken at Cyber First since 2024",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+965 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "topic", label: "Proposed Topic", type: "text", placeholder: "Brief topic or area of expertise" },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your background..." },
    ],
  },
];

function RegPerkIcon({ type }: { type: string }) {
  const s: React.CSSProperties = { opacity: 0.7 };
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: s };
  if (type === "layers") return <svg {...props}><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>;
  if (type === "target") return <svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
  if (type === "eye") return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
  if (type === "users") return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
  if (type === "calendar") return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
  if (type === "shield") return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
  if (type === "mic") return <svg {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg>;
  if (type === "globe") return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
  return <svg {...props}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>;
}

function RegistrationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState("attend");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[2]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const tab = REG_TABS.find((t) => t.key === activeTab)!;

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") setEmailError(null);
    if (name === "phone") setPhoneError(null);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormError(null);
    setFormData({});
    setPhoneError(null);
    setEmailError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    if (formData.email && !isWorkEmail(formData.email)) {
      setEmailError("Please use your work email address");
      setIsLoading(false);
      return;
    }
    const phoneErr = validatePhone(formData.phone || "", selectedCountry);
    if (phoneErr) {
      setPhoneError(phoneErr);
      setIsLoading(false);
      return;
    }

    const typeMap: Record<string, FormType> = { attend: "attend", sponsor: "sponsor", speaker: "speak" };
    const type = typeMap[activeTab] || "attend";

    const sharedMeta = { message: formData.message || "" };
    const metadataMap: Record<string, () => Record<string, string>> = {
      attend: () => ({ ...sharedMeta }),
      sponsor: () => ({ ...sharedMeta }),
      speaker: () => ({ ...sharedMeta, proposed_topic: formData.topic || "" }),
    };

    const combinedPhone = `${selectedCountry.code}${(formData.phone || "").replace(/[\s\-()]/g, "")}`;
    const meta = metadataMap[activeTab]?.() || {};
    const result = await submitForm({
      type,
      full_name: formData.name || "",
      email: formData.email || "",
      company: formData.company || "",
      job_title: formData.title || "",
      phone: combinedPhone,
      event_name: "Cyber First Kuwait 2026",
      metadata: meta,
    });

    setIsLoading(false);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setFormError(result.error || "Something went wrong.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "white",
    fontFamily: "var(--font-outfit)",
    fontSize: 14,
    fontWeight: 400,
    outline: "none",
    transition: "border-color 0.3s ease, background 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-outfit)",
    fontSize: 11,
    fontWeight: 500,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 5,
    display: "block",
    letterSpacing: "0.3px",
  };

  return (
    <section
      ref={sectionRef}
      id="register"
      style={{
        background: "transparent",
        padding: "clamp(40px,5vw,72px) 0",
        borderTop: `1px solid ${C}10`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 700px 500px at 20% 40%, ${C}08 0%, transparent 70%),
            radial-gradient(ellipse 500px 400px at 80% 60%, ${C}06 0%, transparent 70%)
          `,
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        {/* Tab pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48 }}
        >
          {/* Section label */}
          <div className="flex items-center gap-3">
            <span style={{ width: 30, height: 1, background: C, flexShrink: 0 }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: C,
                fontFamily: "var(--font-outfit)",
              }}
            >
              Get Involved
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Tab buttons */}
          <div style={{ display: "flex", gap: 6 }}>
            {REG_TABS.map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  suppressHydrationWarning
                  onClick={() => {
                    setActiveTab(t.key);
                    if (isSubmitted) resetForm();
                  }}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 40,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#0A0A0A" : "rgba(255,255,255,0.4)",
                    background: isActive ? C : "rgba(255,255,255,0.04)",
                    border: isActive ? `1px solid ${C}` : "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    letterSpacing: "0.2px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = `${C}15`;
                      e.currentTarget.style.borderColor = `${C}30`;
                      e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                    }
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Split layout */}
        <div
          className="cfk-reg-container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.25fr",
            gap: "clamp(32px, 4vw, 64px)",
            alignItems: "start",
          }}
        >
          {/* LEFT COLUMN: Editorial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`reg-left-${activeTab}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ paddingTop: 8 }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(32px, 3.5vw, 50px)",
                  letterSpacing: "-2px",
                  color: "var(--white)",
                  lineHeight: 1.08,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {tab.heading}
              </h2>

              {/* Event details */}
              <div className="flex flex-wrap items-center gap-2" style={{ marginTop: 12 }}>
                {["3rd Edition", "October 14, 2026", "Jumeirah Messilah Beach Hotel"].map(
                  (item, index, arr) => (
                    <span key={item} className="flex items-center gap-2">
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "#707070" }}>
                        {item}
                      </span>
                      {index < arr.length - 1 && <span style={{ color: "#404040" }}>&middot;</span>}
                    </span>
                  )
                )}
              </div>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 300,
                  fontSize: "clamp(14px, 1.2vw, 16px)",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.7,
                  margin: "20px 0 0",
                  maxWidth: 440,
                }}
              >
                {tab.description}
              </p>

              {/* Perks */}
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 16 }}>
                {tab.perks.map((perk) => (
                  <div key={perk.text} className="flex items-center gap-3">
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: `${C}10`,
                        border: `1px solid ${C}1A`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C,
                        flexShrink: 0,
                      }}
                    >
                      <RegPerkIcon type={perk.icon} />
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 14,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      {perk.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trust line */}
              <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.3px",
                    margin: 0,
                  }}
                >
                  {tab.trust}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* RIGHT COLUMN: Form card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            style={{
              borderRadius: 20,
              border: `1px solid ${C}14`,
              background: "rgba(255, 255, 255, 0.02)",
              padding: "clamp(24px, 3vw, 36px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Card ambient glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: -40,
                right: -40,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: `radial-gradient(ellipse, ${C}0A 0%, transparent 70%)`,
              }}
            />

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="reg-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{ textAlign: "center", padding: "40px 0" }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "rgba(34,197,94,0.12)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "clamp(20px, 2.5vw, 26px)",
                      letterSpacing: "-0.5px",
                      color: "white",
                      margin: "0 0 8px",
                    }}
                  >
                    {activeTab === "attend" ? "You\u2019re In!" : "Inquiry Submitted"}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontWeight: 300,
                      fontSize: 14,
                      color: "#A0A0A0",
                      margin: "0 0 20px",
                      lineHeight: 1.6,
                    }}
                  >
                    {activeTab === "attend"
                      ? "We\u2019ll be in touch with event details."
                      : "Our team will review your submission and get back to you within 2 working hours."}
                  </p>
                  <button
                    onClick={resetForm}
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13,
                      fontWeight: 500,
                      color: C,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = C;
                    }}
                  >
                    Submit another inquiry &rarr;
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`reg-form-${activeTab}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <form onSubmit={handleSubmit}>
                    <div
                      className="cfk-reg-form-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 14,
                      }}
                    >
                      {tab.fields.map((field) => {
                        const isFullWidth = field.type === "textarea";
                        if (field.type === "tel") {
                          return (
                            <div key={field.name} style={{ gridColumn: "1 / -1" }}>
                              <label style={labelStyle}>{field.label}</label>
                              <div style={{ display: "flex", gap: 8 }}>
                                <select
                                  value={`${selectedCountry.code}|${selectedCountry.country}`}
                                  onChange={(e) => { const [code, country] = e.target.value.split("|"); const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country); if (c) { setSelectedCountry(c); setPhoneError(null); } }}
                                  style={{ ...inputStyle, width: 120, flexShrink: 0, appearance: "none" as const, cursor: "pointer" }}
                                  onFocus={(e) => { e.currentTarget.style.borderColor = `${C}60`; }}
                                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                                >
                                  {COUNTRY_CODES.map((cc) => (<option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: "#222", background: "#fff" }}>{cc.country} {cc.code}</option>))}
                                </select>
                                <input
                                  type="tel"
                                  value={formData[field.name] || ""}
                                  onChange={(e) => handleChange(field.name, e.target.value)}
                                  placeholder={selectedCountry.placeholder}
                                  maxLength={selectedCountry.length}
                                  style={{ ...inputStyle, flex: 1 }}
                                  onFocus={(e) => { e.currentTarget.style.borderColor = `${C}60`; }}
                                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                                />
                              </div>
                              {phoneError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "4px 0 0" }}>{phoneError}</p>}
                            </div>
                          );
                        }
                        if (field.type === "email") {
                          return (
                            <div key={field.name} style={{ gridColumn: isFullWidth ? "1 / -1" : undefined }}>
                              <label style={labelStyle}>{field.label}</label>
                              <input
                                type="email"
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                required
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = `${C}60`; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; if (formData[field.name] && !isWorkEmail(formData[field.name])) setEmailError("Please use your work email address"); }}
                              />
                              {emailError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "4px 0 0" }}>{emailError}</p>}
                            </div>
                          );
                        }
                        return (
                          <div
                            key={field.name}
                            style={{ gridColumn: isFullWidth ? "1 / -1" : undefined }}
                          >
                            <label style={labelStyle}>{field.label}</label>
                            {field.type === "textarea" ? (
                              <textarea
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                rows={3}
                                style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = `${C}60`; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                              />
                            ) : (
                              <input
                                type={field.type}
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                required
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = `${C}60`; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Honeypot */}
                    <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

                    {/* Error */}
                    {formError && (
                      <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 13, margin: "8px 0 0" }}>
                        {formError}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full transition-all duration-300"
                      style={{
                        width: "100%",
                        marginTop: 20,
                        padding: "13px 28px",
                        borderRadius: 10,
                        background: isLoading ? `${C}80` : C,
                        color: "#0A0A0A",
                        fontFamily: "var(--font-outfit)",
                        fontSize: 15,
                        fontWeight: 600,
                        border: "none",
                        cursor: isLoading ? "wait" : "pointer",
                        opacity: isLoading ? 0.7 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.background = C_BRIGHT;
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = `0 12px 40px ${C}25`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isLoading ? `${C}80` : C;
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {isLoading ? "Submitting..." : tab.cta} {!isLoading && <span>&rarr;</span>}
                    </button>
                  </form>

                  {/* Privacy note */}
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 400,
                      color: "#3A3A3A",
                      textAlign: "center",
                      margin: "14px 0 0",
                    }}
                  >
                    By submitting, you agree to receive event communications from Events First Group.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 860px) {
          .cfk-reg-container {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .cfk-reg-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
