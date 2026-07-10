"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import { Footer, InquiryForm } from "@/components/sections";
import EventNavigation from "@/components/ui/EventNavigation";
import {
  submitForm,
  isWorkEmail,
  COUNTRY_CODES,
  validatePhone,
} from "@/lib/form-helpers";
import type { FormType, CountryCode } from "@/lib/form-helpers";

// ─── Design Tokens (matching VB MENA magenta/cyan) ──────────────────────────
const C = "#D34B9A";           // Magenta
const C_BRIGHT = "#E86BB8";    // Light pink
const C_DIM = "#A83A7A";       // Deep pink
const CYAN = "#00C9FF";        // Cyan accent
const CYAN_DIM = "#0090B8";
const BG = "#0a0e2a";          // Deep navy
const BG_DARK = "#070b1f";
const BG_CARD = "#0d1233";
const EASE = [0.16, 1, 0.3, 1] as const;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const S3_LOGOS = `${S3}/sponsors-logo`;

// Event date: 27 August 2026
const EVENT_DATE = new Date("2026-08-27T08:30:00+02:00");

// ─── Post-Event Reports data ─────────────────────────────────────────────────
type ReportEntry = {
  edition: string;
  year: string;
  title: string;
  url: string;
  filename: string;
  logo?: string;
  logoScale?: number;
};

const POST_EVENT_REPORTS: ReportEntry[] = [
  {
    edition: "Abu Dhabi",
    year: "2026",
    title: "OT Abu Dhabi 2026",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/Post+Event+Report+-+OT+Security+First+2026.pdf",
    filename: "OT-Security-First-Abu-Dhabi-2026-Report.pdf",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/Untitled-2-01.png",
    logoScale: 1.1,
  },
  {
    edition: "MENA Webinar",
    year: "2026",
    title: "OT First MENA Webinar 2026",
    // TODO: replace with the real S3 URL once the report PDF is uploaded.
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/Post+Event+Report+-+OT+First+MENA+Webinar+2026.pdf",
    filename: "OT-First-MENA-Webinar-2026-Report.pdf",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/Untitled-2-01.png",
    logoScale: 1.1,
  },
];

const buildReportDownloadUrl = (url: string, filename: string) =>
  `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;

// ─── Delegate Preview (teaser for the request form) ──────────────────────────
type DelegatePreviewEntry = { name: string; title: string; company: string };

const DELEGATE_PREVIEW: DelegatePreviewEntry[] = [
  { name: "Ramy Hossam Abbas", title: "Leader Cybersecurity", company: "Honeywell" },
  { name: "Umniya Mahmoud", title: "Senior Information Security Specialist", company: "Abu Dhabi Ports Group" },
  { name: "Shafiullah Ismail", title: "Senior VP & Head of ISR", company: "Mubadala Capital" },
  { name: "Mohamed Al Katheeri", title: "Vice President Digital", company: "ADNOC Group" },
  { name: "Alexandr Chipovoy", title: "CyberSec Director (CISO)", company: "Ministry of Energy (Kazakhstan)" },
  { name: "Ayat Khair", title: "Project Manager", company: "Cyber Falcon" },
  { name: "Abdulkader Sunelwala", title: "OT Security Consultant", company: "DP World" },
  { name: "Walid Raafat", title: "Director — Internal Audit, Risk Management & Compliance", company: "Zayed University" },
  { name: "Shaikha Aldhaheri", title: "Senior Instrumentation & Control Specialist", company: "TAQA Water Solutions" },
  { name: "Daniel Laxtrem", title: "Head of Information Security Department", company: "JSC AEDC" },
];
const DELEGATE_VISIBLE_COUNT = 5;

const delegateInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ─── Countdown Hook ──────────────────────────────────────────────────────────
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

// ─── Animated Counter with Glitch Effect ─────────────────────────────────────
function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1800,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState("0");
  const [glitch, setGlitch] = useState(false);
  const decimals = String(to).includes(".")
    ? String(to).split(".")[1].length
    : 0;
  useEffect(() => {
    if (!inView) return;
    setGlitch(true);
    setTimeout(() => setGlitch(false), 200);
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal((eased * to).toFixed(decimals));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration, decimals]);
  return (
    <span
      ref={ref}
      className={glitch ? "otsf-glitch" : ""}
    >
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

// ─── 3D Tilt Wrapper ─────────────────────────────────────────────────────────
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

// ─── Magnetic Button ─────────────────────────────────────────────────────────
function MagneticButton({
  children,
  style,
  className,
  href,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  href?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      x.set(dx * 0.3);
      y.set(dy * 0.3);
    }
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? "a" : "button";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy, display: "inline-block" }}
    >
      <Tag
        href={href}
        onClick={onClick}
        className={className}
        style={style}
      >
        {children}
      </Tag>
    </motion.div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

// Speakers from brochure
const SPEAKERS = [
  {
    name: "Len De Villiers",
    title: "Group CTIO",
    org: "Eskom Holdings",
    linkedin: "https://www.linkedin.com/in/len-de-villiers-33592025/",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Len+De+Villiers.png",
  },
  {
    name: "Nthabiseng Mosupye",
    title: "CTIO",
    org: "Rand Water",
    linkedin: "https://www.linkedin.com/in/nthabiseng-mosupye-86020829/",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Nthabiseng+Mosupye.jpg",
  },
  {
    name: "Cathy Leso",
    title: "CIO",
    org: "Department of Mineral Resources",
    linkedin: "https://www.linkedin.com/in/cathy-leso-b0507a55/",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Cathy+Leso.jpg",
  },
  {
    name: "Ishaaq Jacobs",
    title: "Chief Cyber Security Officer (CISO)",
    org: "Sasol",
    linkedin: "https://www.linkedin.com/in/ishaaq-jacobs/",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Ishaaq+Jacobs.jpg",
  },
  {
    name: "Rishi Hariram",
    title: "CISO / Regional Head — Information Security (EMEA/APAC)",
    org: "Anglo American",
    linkedin: "https://www.linkedin.com/in/rishi-hariram-4307b329/",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Rishi+Hariram.png",
  },
  {
    name: "Akash Makhan",
    title: "OT/IT Convergence (Digital Transformation)",
    org: "Eskom Holdings SOC Ltd",
    linkedin: "https://www.linkedin.com/in/akashmakhan/",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Akash+Makhan.jpg",
  },
  {
    name: "Shane Naidoo",
    title: "Executive Head of IT",
    org: "Transnet",
    linkedin: "",
    photo: "",
  },
  {
    name: "Zanele Fikizolo",
    title: "Senior Advisor – IT Governance, Risk and Compliance",
    org: "Eskom Holdings SOC Ltd",
    linkedin: "https://www.linkedin.com/in/zanele-fikizolo-7b10413a/",
    photo: `${S3}/boardroom/Zanele_Fikizolo.png`,
  },
  {
    name: "Tendani Silima",
    title: "Senior Advisor Cybersecurity",
    org: "Eskom Holdings SOC Ltd",
    linkedin: "https://www.linkedin.com/in/tendani-silima-b915aa73/",
    photo: `${S3}/boardroom/Tendani_Silima.png`,
  },
  {
    name: "Xolani Nzimande",
    title: "OT Cybersecurity Specialist",
    org: "Sasol",
    linkedin: "https://www.linkedin.com/in/xolani-nzimande-3314bb1a/",
    photo: `${S3}/boardroom/Xolani_Nzimande.png`,
  },
  {
    name: "Muvhango Livhusha",
    title: "Vice President",
    org: "ISACA South Africa Chapter",
    linkedin: "https://www.linkedin.com/in/muvhango-sipho-steven-livhusha-phd-candidate-mba-cisa-8566a61aa/",
    photo: `${S3}/boardroom/Muvhango_Livhusha.png`,
  },
  {
    name: "Prinesh Vythilingam",
    title: "Group Head of Cyber Security",
    org: "African Rainbow Minerals Limited",
    linkedin: "https://www.linkedin.com/in/prineshkv/",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Prinesh+Vythilingam.png",
  },
  {
    name: "Andrew Chester",
    title: "CISO",
    org: "Valterra Platinum",
    linkedin: "https://www.linkedin.com/in/za-andrewchester/",
    photo: "",
  },
  {
    name: "Naoufal Kerboute",
    title: "Regional Sales Director",
    org: "Waterfall",
    linkedin: "https://www.linkedin.com/in/nkerboute/",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Naoufal-Media1.jpg",
  },
];

// Strategic Focus Areas from brochure
const STRATEGIC_THEMES = [
  { short: "Zero Trust for ICS", title: "Zero Trust Architecture for ICS" },
  { short: "IT/OT Convergence", title: "IT/OT Convergence & SOC Integration" },
  { short: "AI & Behavioral Analytics", title: "AI & Behavioral Analytics" },
  { short: "Legacy Retrofitting", title: "Legacy Retrofitting & Hardening" },
  { short: "Supply Chain & Third-Party", title: "Supply Chain & Third-Party Risk" },
  { short: "Skills & Capacity", title: "Developing Skills & Capacity" },
  { short: "Regulation & Collaboration", title: "Regulation, Standards & Public-Private Collaboration" },
  { short: "Incident Response", title: "Incident Response & Crisis Management" },
  { short: "Network Visibility", title: "Network Visibility & Monitoring" },
  { short: "Emerging Technologies", title: "Emerging Technologies in OT Security" },
];

// Facts & Figures from brochure
const FACTS_FIGURES = [
  { value: "94", suffix: "%", label: "of industrial organizations experienced at least one intrusion in the past 12 months" },
  { value: "$4.5", suffix: "M", label: "average cost of an OT cyber incident (up 28% from 2024)" },
  { value: "47", suffix: "DAYS", label: "average downtime following a major OT security breach" },
  { value: "82", suffix: "%", label: "of attacks on critical infrastructure originated from ransomware groups" },
  { value: "61", suffix: "%", label: "of African energy and utilities sectors lack basic OT network segmentation" },
  { value: "23", suffix: "%", label: "of organizations have real-time OT threat detection capabilities" },
  { value: "19.5", suffix: "%", label: "projected CAGR OT security market from 2025–2030" },
];

// Market Drivers from brochure
const MARKET_DRIVERS = [
  "Implementation of South Africa's Critical Infrastructure Protection Act (CIPA) and alignment with international standards (IEC 62443, NIST)",
  "National cybersecurity mandates for critical infrastructure protection; government funding to enhance critical infrastructure resilience and support digital transformation initiatives",
  "Industry 4.0 adoption increasing attack surface by 340% across manufacturing and mining; rapid adoption of managed OT Security services and SOC based monitoring solutions",
  "Rising geopolitical tensions driving sophisticated APT campaigns targeting African energy infrastructure",
  "Cyber insurance providers mandating OT security controls, with 89% requiring ICS specific coverage",
  "76% of industrial breaches traced to third party vendor access and equipment",
  "Projected shortage of 3.5 million cybersecurity professionals globally, with acute impact on OT specialization",
];

// Who Should Attend — from brochure
const WHO_ATTEND = {
  executive: [
    "Chief Information Security Officer (CISO)", "Chief Technology Officer (CTO)", "Chief Operations Officer (COO)",
    "Chief Risk Officer (CRO)", "Chief Information Officer (CIO)", "Chief Security Officer (CSO)",
    "Vice President - Operations", "Vice President - Engineering", "Managing Director - Operations",
  ],
  otSecurity: [
    "Head of OT Security", "Director of Industrial Cybersecurity", "OT Security Manager",
    "ICS/SCADA Security Specialist", "Head of IT/OT Convergence", "Cybersecurity Architect (OT/ICS)",
    "Network Security Manager (OT)", "Director of Infrastructure Security",
  ],
  opsEngineering: [
    "Head of Operations Technology", "Heads of Engineering & Automation",
    "Control Systems, SCADA & Process Control", "Head of Maintenance & Reliability",
  ],
  riskCompliance: [
    "Head of Cyber Risk Management", "Compliance Director",
    "GRC (Governance, Risk & Compliance) Head", "Internal Audit Director", "Physical Security Director",
  ],
  government: [
    "Critical Infrastructure Protection Officers", "Government Security Advisors",
    "Regulatory Compliance Officers", "National Cyber Security Officials", "Public Sector IT/OT Directors",
  ],
};

// Target Industries — from brochure
const TARGET_INDUSTRIES = [
  "Oil & Gas", "Power & Energy", "Electricity & Gas", "Water & Wastewater",
  "Mining & Metals", "Chemicals & Petrochemicals", "Government & Public Sector",
  "National & Municipal Departments",
];

// Event Snapshot
const EVENT_SNAPSHOT = [
  { stat: "200+", label: "Delegates", img: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0394.JPG` },
  { stat: "20+", label: "Industry Speakers", img: `${S3}/Good/4N8A0122.JPG` },
  { stat: "10+", label: "Conference Sessions", img: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0398.JPG` },
  { stat: "10+", label: "Technology Providers", img: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0397.JPG` },
  { stat: "10+", label: "Media Partners", img: `${S3}/Good/4N8A9900.JPG` },
  { stat: "5", label: "Awards", img: `${S3}/Good/4N8A0330.JPG` },
];

// Awards — 5 categories from brochure
const AWARDS_DATA = [
  { title: "OT Security Program of the Year", desc: "For an organization that has implemented a mature, multi-site OT security program delivering measurable risk reduction." },
  { title: "CISO / OT Security Leader of the Year", desc: "For an individual who has shown outstanding leadership in driving OT security across their organization or sector." },
  { title: "OT Security Innovation Award", desc: "For a technology or solution provider, offering a standout solution addressing a critical OT security challenge." },
  { title: "Excellence in OT Incident Response & Resilience", desc: "For a team or organization that handled a significant OT related incident effectively and improved resilience as a result." },
  { title: "Public Sector / Critical Infrastructure Protection Award", desc: "For a government entity, regulator, or state-owned enterprise showing leadership in securing national critical infrastructure." },
];

// Gallery — all photos from the OT Security First UAE 2026 edition
const GALLERY: { src: string; alt: string; label: string; area: string; rotate?: number; lift?: boolean }[] = [
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0510.JPG`, alt: "OT Security First UAE — panel discussion", label: "Panel Discussion", area: "hero" },
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0487.JPG`, alt: "OT Security First UAE — main session", label: "Main Session", area: "a", rotate: -1.5, lift: true },
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0811.JPG`, alt: "OT Security First UAE — on floor", label: "On Floor", area: "b" },
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0683.JPG`, alt: "OT Security First UAE — networking", label: "Networking", area: "c", rotate: 1 },
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0820.JPG`, alt: "OT Security First UAE — partner exhibition", label: "Partner Exhibition", area: "d" },
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0394.JPG`, alt: "OT Security First UAE — industry speakers", label: "Industry Speakers", area: "e", rotate: -1, lift: true },
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0894.JPG`, alt: "OT Security First UAE — executive panel", label: "Executive Panel", area: "f" },
  { src: `${S3}/Good/4N8A0200.JPG`, alt: "OT Security First UAE — awards recognition", label: "Awards Recognition", area: "g", rotate: 0.8 },
];

// Contact details — updated from brochure
const CONTACTS = {
  speaking: { name: "Sanjana Venugopal", title: "Senior Conference Producer", phone: "+971 54 571 4377", email: "sanjana@eventsfirstgroup.com", photo: `${S3}/about-us-photos/Sanjana-Venugopal-new.jpg` },
  sponsorship: [
    { name: "Mohammed Danish", title: "Partnership Manager", phone: "+971 56 553 5513", email: "danish@eventsfirstgroup.com", photo: `${S3}/team/danish.png` },
    { name: "Mayur Methi", title: "Partnership Manager", phone: "+971 54 571 4377", email: "mayur@eventsfirstgroup.com", photo: `${S3}/about-us-photos/Mayur-Methi.png` },
  ],
};

// Sponsor logos, reuse existing EFG series sponsors (verified S3 paths)
const MARQUEE_ROW_1 = [
  `${S3_LOGOS}/paloalto.png`,
  `${S3_LOGOS}/fortinet.png`,
  `${S3_LOGOS}/Claroty.png`,
  `${S3_LOGOS}/Dragos.png`,
  `${S3_LOGOS}/nozomi-networks.png`,
  `${S3_LOGOS}/Tenable-logo.png`,
  `${S3_LOGOS}/kaspersky.png`,
  `${S3_LOGOS}/sentinelone.png`,
  `${S3_LOGOS}/Microsoft_logo.png`,
  `${S3_LOGOS}/Google-Cloud-Security.png`,
  `${S3_LOGOS}/Sonicwall.png`,
  `${S3_LOGOS}/threatlocker.png`,
  `${S3_LOGOS}/OPSWAT-logo.png`,
  `${S3_LOGOS}/Xage.png`,
  `${S3_LOGOS}/corelight.png`,
];

const MARQUEE_ROW_2 = [
  `${S3_LOGOS}/Oracle.png`,
  `${S3_LOGOS}/EY.png`,
  `${S3_LOGOS}/Group-IB.png`,
  `${S3_LOGOS}/Acronis.png`,
  `${S3_LOGOS}/ManageEngine.png`,
  `${S3_LOGOS}/Wallix.png`,
  `${S3_LOGOS}/PENTERA.png`,
  `${S3_LOGOS}/Akamai.png`,
  `${S3_LOGOS}/secureworks.png`,
  `${S3_LOGOS}/filigran.png`,
  `${S3_LOGOS}/Anomali.png`,
  `${S3_LOGOS}/AmiViz.png`,
  `${S3_LOGOS}/GBM.png`,
  `${S3_LOGOS}/Paramount.png`,
  `${S3_LOGOS}/YOKOGAWA.png`,
];

// OT Security testimonials — 5 vertical shorts from OT Security First UAE
const OT_SHORTS = [
  { id: "Q0n_sVaMnxg", title: "OT Security First Testimonial" },
  { id: "SF87voLk34A", title: "OT Security First Testimonial" },
  { id: "R5dtc5kjiQU", title: "OT Security First Testimonial" },
  { id: "Hm_yj3NttPo", title: "OT Security First Testimonial" },
  { id: "aaG9We6AjY8", title: "OT Security First Testimonial" },
];

// ─── HERO SECTION ────────────────────────────────────────────────────────────
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
      new CustomEvent("otsf-jhb:open-request", { detail: { type } }),
    );
  };

  return (
    <section id="overview" className="otsf-hero" style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: BG_DARK }}>
      {/* Background Image — kept as-is */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0812.JPG`}
          alt="OT Security First Africa 2026 summit — industrial cybersecurity leaders on stage"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.35) saturate(0.7)" }}
        />
      </div>

      {/* Left-heavy navy overlay — strong left, fading right to reveal image */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${BG_DARK}F2 0%, ${BG_DARK}E0 30%, ${BG_DARK}99 55%, ${BG_DARK}40 75%, transparent 100%)`, zIndex: 1 }} />
      {/* Top/bottom fade for consistency */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${BG_DARK}CC 0%, transparent 25%, transparent 75%, ${BG_DARK}E6 100%)`, zIndex: 1 }} />

      {/* Central radial glow — cyan-pink light source (VB MENA pattern) */}
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: "70%", background: `radial-gradient(ellipse 60% 70% at 50% 100%, ${CYAN}40, ${C}1A 35%, ${CYAN}08 60%, transparent 80%)`, filter: "blur(30px)", zIndex: 2, pointerEvents: "none" }} />

      {/* Secondary upper glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "50%", background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${C}14, transparent 70%)`, zIndex: 2, pointerEvents: "none" }} />

      {/* Cyber grid texture */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${CYAN}06 1px, transparent 1px), linear-gradient(90deg, ${CYAN}06 1px, transparent 1px)`, backgroundSize: "60px 60px", zIndex: 3 }} />

      {/* Content — centered like VB MENA */}
      <div
        className="otsf-hero-inner"
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          textAlign: "left",
          maxWidth: 1320,
          margin: "0 auto",
          padding: "120px clamp(24px, 5vw, 80px) 140px",
        }}
      >
        {/* Edition Badge — liquid glass with gradient border */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: "inline-flex", padding: "1.5px", borderRadius: 999, marginBottom: 36,
            background: `linear-gradient(140deg, ${C_BRIGHT}70 0%, ${CYAN}50 40%, rgba(255,255,255,0.15) 70%, ${C_BRIGHT}40 100%)`,
            boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 4px 16px ${C}20`,
          }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 24px 10px 16px", borderRadius: 999,
            background: `linear-gradient(180deg, rgba(10,14,42,0.82) 0%, rgba(10,14,42,0.65) 100%)`,
            backdropFilter: "blur(24px) saturate(1.5)", WebkitBackdropFilter: "blur(24px) saturate(1.5)",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.3), inset 0 0 20px ${C}0A`,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)", pointerEvents: "none" }} />
            <span className="otsf-pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #ff8a8a 0%, ${C_BRIGHT} 50%, ${C_DIM} 100%)`, boxShadow: `0 0 12px ${C_BRIGHT}, 0 0 4px ${C_BRIGHT}, inset 0 0 2px rgba(255,255,255,0.5)` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.92)", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>Africa Edition</span>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 14 }}>|</span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>Johannesburg</span>
          </div>
        </motion.div>

        {/* Main Headline — twin halves separated by a gradient slash, constrained to left column */}
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(32px, 4.4vw, 60px)",
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            margin: "0 0 26px",
            filter: `drop-shadow(0 4px 30px ${C}20)`,
            display: "flex",
            flexDirection: "column",
            gap: "clamp(6px, 0.9vw, 14px)",
            maxWidth: "min(560px, 44vw)",
          }}
        >
          <span style={{ display: "block" }}>
            Uncompromised<br />
            <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              OT Security
            </span>
          </span>

          {/* Diagonal gradient slash divider */}
          <motion.span
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
            style={{
              display: "block",
              width: "clamp(30px, 3vw, 44px)",
              height: "clamp(2px, 0.24vw, 3px)",
              background: `linear-gradient(90deg, ${C_BRIGHT} 0%, ${CYAN} 100%)`,
              borderRadius: 2,
              transform: "rotate(-58deg)",
              transformOrigin: "left center",
              marginLeft: "clamp(6px, 0.8vw, 12px)",
              boxShadow: `0 0 18px ${C}55, 0 0 6px ${CYAN}66`,
            }}
          />

          <span style={{ display: "block" }}>
            Protecting what<br />
            <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${CYAN} 0%, ${C_BRIGHT} 45%, ${CYAN} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Powers our World
            </span>
          </span>
        </motion.h1>

        {/* Info badges — liquid glass pills with inner shine */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-start", marginBottom: 36 }}
        >
          {[
            { label: "27 August 2026", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { label: "Johannesburg, SA", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
            { label: "200+ Delegates", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
          ].map((item) => (
            <div key={item.label} style={{
              padding: "9px 18px", borderRadius: 50, position: "relative", overflow: "hidden",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.2)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)", pointerEvents: "none" }} />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                <path d={item.icon} />
              </svg>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs — VB MENA style */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          style={{ display: "flex", gap: 16, justifyContent: "flex-start", flexWrap: "wrap" }}
        >
          <a href="#register" className="otsf-cta-primary" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 40px", borderRadius: 50,
            background: `linear-gradient(135deg, ${C}, ${CYAN})`, color: "white",
            fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 700, textDecoration: "none",
            boxShadow: `0 0 40px ${CYAN}33, 0 4px 20px ${C}33`, transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            border: "none", cursor: "pointer",
          }}>
            Register Now →
          </a>
          {/* Resources dropdown — opens the request-form modal with either
              "Past Event Report" or "Delegate List" pre-selected. */}
          <div ref={resourceMenuRef} style={{ position: "relative", display: "inline-block" }}>
            <button
              type="button"
              onClick={() => setResourceMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={resourceMenuOpen}
              className="otsf-cta-ghost"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 28px", borderRadius: 50,
                background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500,
                border: "1px solid rgba(255,255,255,0.12)", transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                cursor: "pointer", position: "relative", overflow: "hidden",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.2)",
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
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
                    background: "rgba(8, 20, 40, 0.88)",
                    border: `1px solid rgba(0, 201, 255, 0.22)`,
                    backdropFilter: "blur(18px) saturate(180%)",
                    WebkitBackdropFilter: "blur(18px) saturate(180%)",
                    boxShadow:
                      "0 22px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
                    zIndex: 30,
                  }}
                >
                  {/* Past Event Report */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openRequest("Past Event Report")}
                    className="otsf-jhb-hero-menu-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "transparent",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "white",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: `${CYAN}22`,
                      border: `1px solid ${CYAN}44`,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <polyline points="9 15 12 18 15 15" />
                      </svg>
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 600, color: "white", lineHeight: 1.25 }}>
                        Past Event Report
                      </span>
                      <span style={{ display: "block", marginTop: 2, fontFamily: "var(--font-outfit)", fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>
                        Request the PDF report from a past edition
                      </span>
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>

                  <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "2px 10px" }} />

                  {/* Delegate List */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openRequest("Delegate List")}
                    className="otsf-jhb-hero-menu-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "transparent",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "white",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: `${CYAN}22`,
                      border: `1px solid ${CYAN}44`,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 600, color: "white", lineHeight: 1.25 }}>
                        Delegate List
                      </span>
                      <span style={{ display: "block", marginTop: 2, fontFamily: "var(--font-outfit)", fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>
                        Request the confirmed attendee roster
                      </span>
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* EFG initiative badge — bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="otsf-efg-badge"
        style={{ position: "absolute", bottom: 80, right: "clamp(24px, 5vw, 80px)", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
      >
        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "2px" }}>An Initiative By</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" src="/events-first-group_logo_alt.svg" alt="Events First Group" width={120} height={44} style={{ height: 44, width: "auto", opacity: 0.6 }} />
      </motion.div>

      {/* Countdown bar — bottom anchored, inline numbers with colon separators */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20, padding: "24px 0" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hrs" }, { v: cd.m, l: "Min" }, { v: cd.s, l: "Sec" }].map((item, i) => (
              <React.Fragment key={item.l}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 800, color: "white", letterSpacing: "-1px" }}>{String(item.v).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "1.5px" }}>{item.l}</span>
                </div>
                {i < 3 && <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2vw, 26px)", fontWeight: 300, color: "rgba(255,255,255,0.15)", margin: "0 2px" }}>:</span>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="otsf-pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: CYAN, boxShadow: `0 0 10px ${CYAN}, 0 0 4px ${CYAN}` }} />
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "2px" }}>Registrations Open</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .otsf-cta-primary:hover { transform: translateY(-3px); box-shadow: 0 0 60px ${CYAN}59, 0 8px 32px ${C}40 !important; background: linear-gradient(135deg, ${C_BRIGHT}, ${CYAN}) !important; }
        .otsf-cta-ghost:hover { transform: translateY(-2px); background: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.3) !important; color: white !important; box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.3) !important; }
        .otsf-jhb-hero-menu-item:hover { background: rgba(0, 201, 255, 0.08) !important; }
        .otsf-jhb-hero-menu-item:focus-visible { outline: none; background: rgba(0, 201, 255, 0.12) !important; }
        .otsf-pulse-dot { animation: otsf-pulse 2s ease-in-out infinite; }
        @keyframes otsf-pulse { 0%,100% { box-shadow: 0 0 8px ${CYAN}, 0 0 4px ${CYAN}; } 50% { box-shadow: 0 0 16px ${CYAN}, 0 0 8px ${CYAN}, 0 0 24px ${CYAN}40; } }
        @media (max-width: 768px) {
          .otsf-hero h1 { font-size: clamp(28px, 9vw, 42px) !important; }
          .otsf-hero-inner { padding: 100px 20px 160px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── FACTS & FIGURES BAR ────────────────────────────────────────────────────
// Stat card — skeuomorphic + liquid glass hybrid
function StatCard({ value, suffix, label, featured = false, large = false }: { value: string; suffix: string; label: string; featured?: boolean; large?: boolean }) {
  const suffixColor = featured ? CYAN : C_BRIGHT;
  return (
    <div className="otsf-stat-premium" style={{
      borderRadius: 24,
      padding: 1.5,
      // Gradient border shell
      background: featured
        ? `linear-gradient(160deg, ${CYAN}80, ${C_BRIGHT}40, rgba(255,255,255,0.15), ${CYAN}50)`
        : `linear-gradient(160deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06), ${C}30)`,
      // Skeuomorphic outer shadows — bottom heavy for raised feel + atmospheric glow
      boxShadow: featured
        ? `0 24px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3), 0 0 50px ${CYAN}25, 0 1px 0 rgba(255,255,255,0.1)`
        : `0 20px 50px rgba(0,0,0,0.45), 0 6px 16px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.08)`,
      height: "100%",
      transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
      position: "relative",
    }}>
      <div style={{
        borderRadius: 22.5,
        padding: large ? "clamp(36px, 4vw, 52px) clamp(32px, 4vw, 48px)" : "clamp(26px, 2.8vw, 34px) clamp(22px, 2.2vw, 30px)",
        // Liquid glass — translucent frosted background
        background: featured
          ? `linear-gradient(165deg, rgba(13,18,51,0.75) 0%, rgba(7,11,31,0.92) 50%, rgba(0,201,255,0.08) 100%)`
          : `linear-gradient(165deg, rgba(13,18,51,0.8) 0%, rgba(7,11,31,0.95) 100%)`,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        // Skeuomorphic inset shadows — top bright bevel + bottom dark depth
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 2px rgba(0,0,0,0.4), inset 1px 0 0 rgba(255,255,255,0.04), inset -1px 0 0 rgba(0,0,0,0.3)`,
        position: "relative",
        overflow: "hidden",
        height: "100%",
        textAlign: large ? "left" : "center",
        display: "flex",
        flexDirection: large ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: large ? "clamp(24px, 3.5vw, 48px)" : 10,
      }}>
        {/* Liquid glass top reflection — light from top-left bouncing off glass surface */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 60%)", pointerEvents: "none", borderRadius: "22.5px 22.5px 0 0" }} />

        {/* Curved glass highlight at top — mimics refracted light */}
        <div style={{ position: "absolute", top: 2, left: "6%", right: "6%", height: 1, background: `linear-gradient(90deg, transparent, ${featured ? `${CYAN}80` : "rgba(255,255,255,0.4)"}, transparent)`, boxShadow: featured ? `0 0 12px ${CYAN}60` : `0 0 6px rgba(255,255,255,0.2)`, borderRadius: 2 }} />

        {/* Secondary inner shine */}
        <div style={{ position: "absolute", top: 6, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)", opacity: 0.6 }} />

        {/* Left accent bar — skeuomorphic raised rail */}
        <div style={{ position: "absolute", top: "15%", bottom: "15%", left: 0, width: 3, background: `linear-gradient(180deg, transparent, ${featured ? CYAN : C_BRIGHT}, transparent)`, borderRadius: "0 3px 3px 0", boxShadow: `0 0 12px ${featured ? CYAN : C_BRIGHT}60` }} />

        {/* Corner atmospheric glow — behind the glass */}
        {featured && <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, background: `radial-gradient(circle, ${CYAN}28, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />}
        {!featured && <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: `radial-gradient(circle, ${C}18, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />}
        {!featured && <div style={{ position: "absolute", bottom: -40, left: -40, width: 140, height: 140, background: `radial-gradient(circle, ${CYAN}0d, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />}

        {/* Subtle grid texture through the glass */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${featured ? CYAN : C}08 1px, transparent 1px), linear-gradient(90deg, ${featured ? CYAN : C}08 1px, transparent 1px)`, backgroundSize: "28px 28px", pointerEvents: "none", opacity: 0.3, maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)" }} />

        {/* Bottom reflection — liquid glass pool effect */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${featured ? `${CYAN}40` : "rgba(255,255,255,0.12)"}, transparent)` }} />

        {/* Stat number — Kenya-style: big bold value + smaller accent suffix, baseline-aligned */}
        <span style={{
          display: "inline-flex",
          alignItems: "baseline",
          justifyContent: large ? "flex-start" : "center",
          position: "relative",
          zIndex: 2,
          lineHeight: 0.95,
        }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: large ? "clamp(64px, 8vw, 110px)" : "clamp(48px, 6vw, 72px)",
            color: "white",
            letterSpacing: "-3px",
            // Skeuomorphic text — subtle bottom depth + top highlight + glow
            textShadow: featured
              ? `0 0 30px ${CYAN}60, 0 2px 0 rgba(0,0,0,0.4), 0 -1px 0 rgba(255,255,255,0.1)`
              : `0 2px 0 rgba(0,0,0,0.4), 0 -1px 0 rgba(255,255,255,0.06), 0 0 20px ${C}25`,
            lineHeight: 1,
          }}>
            {value}
          </span>
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: large ? "clamp(32px, 4vw, 52px)" : "clamp(24px, 3vw, 36px)",
            color: suffixColor,
            letterSpacing: "-1px",
            marginLeft: 4,
            textShadow: `0 0 18px ${suffixColor}55, 0 2px 0 rgba(0,0,0,0.4)`,
          }}>
            {suffix}
          </span>
        </span>

        {/* Label */}
        <span style={{
          fontFamily: "var(--font-outfit)",
          fontSize: large ? "clamp(14px, 1.2vw, 17px)" : "clamp(12.5px, 1vw, 14px)",
          fontWeight: 400,
          color: "rgba(255,255,255,0.72)",
          lineHeight: 1.55,
          display: "block",
          textShadow: "0 1px 2px rgba(0,0,0,0.4)",
          maxWidth: large ? 600 : undefined,
          position: "relative",
          zIndex: 2,
        }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── ABOUT + STATS (editorial interleaved layout) ──────────────────────────
function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Editorial narrative blocks — alternating text and stats
  const lede = "From South Africa\u2019s mining complexes and energy grids to port infrastructure, water utilities, petrochemical processing, and advanced manufacturing environments. These are no longer isolated operational domains — they are digitally integrated ecosystems.";

  const p2 = "This convergence is accelerating productivity but expanding the cyber-physical attack surface. Critical infrastructure is a primary target for sophisticated ransomware and state-sponsored APTs. High-impact outages, ransomware, and supply chain attacks are elevating OT security from an engineering concern to a board-level and national priority.";
  const p3 = "The Critical Infrastructure Protection Act (CIPA) and the Cybercrimes Act (2020) have turned cybersecurity from a nice-to-have into a legal mandate.";
  const p4 = "With 67% of organizations planning to increase OT security budgets in 2026\u201327, and major investments in energy transition, mining automation, and manufacturing modernization underway, the security decisions taken in the next few months will lock in risk — or resilience — for decades.";
  const closing = "OT Security First Africa 2026 is an exclusive platform that will enable candid dialogues, cross-sector collaborations, and concrete action plans between top technology experts, OT leaders, government and policy makers — to secure Africa\u2019s industrial backbone.";

  // Split stats into pairs for interleaving
  const heroStat = FACTS_FIGURES[0]; // 94%
  const statsPair1 = [FACTS_FIGURES[1], FACTS_FIGURES[2]]; // $4.5M + 47 days
  const statsPair2 = [FACTS_FIGURES[3], FACTS_FIGURES[4]]; // 82% + 61%
  const statsPair3 = [FACTS_FIGURES[5], FACTS_FIGURES[6]]; // 23% + 19.5%

  return (
    <section
      ref={ref}
      id="overview"
      style={{
        background: "transparent",
        padding: "clamp(40px, 4.5vw, 64px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Split hero — text left, previous-edition video right */}
        <div className="otsf-about-split" style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          gap: "clamp(32px, 4vw, 64px)",
          alignItems: "center",
          marginBottom: "clamp(28px, 3.5vw, 44px)",
        }}>
          {/* Left — text column */}
          <motion.div
            className="otsf-about-text"
            initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${CYAN}, transparent)` }} />
              <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px" }}>About the Event</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4.4vw, 52px)", color: "white", letterSpacing: "-2px", margin: "0 0 18px", lineHeight: 1.05 }}>
              Securing Africa&apos;s<br />
              <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>industrial backbone</span>
            </h2>
            <motion.div
              className="otsf-about-underline"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 120, height: 3, background: `linear-gradient(90deg, ${CYAN}cc, transparent)`, margin: "0 0 28px 0", borderRadius: 2, transformOrigin: "left" }}
            />
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(17px, 1.55vw, 22px)",
              fontWeight: 500,
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.5,
              letterSpacing: "-0.3px",
              margin: 0,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}>
              {lede}
            </p>
          </motion.div>

          {/* Right — previous edition video bezel */}
          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.97 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="otsf-about-video"
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              padding: 2,
              borderRadius: 22,
              background: `linear-gradient(135deg, ${C_BRIGHT}55, ${CYAN}35 50%, ${C_BRIGHT}30)`,
              boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${C}22`,
            }}
          >
            <div
              role={videoPlaying ? undefined : "button"}
              tabIndex={videoPlaying ? undefined : 0}
              aria-label={videoPlaying ? undefined : "Play OT Security First UAE highlights video"}
              onClick={() => !videoPlaying && setVideoPlaying(true)}
              onKeyDown={(e) => { if (!videoPlaying && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setVideoPlaying(true); } }}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: 20,
                overflow: "hidden",
                background: "rgba(7,11,31,0.9)",
                cursor: videoPlaying ? "default" : "pointer",
              }}
            >
              {videoPlaying ? (
                <iframe
                  src="https://www.youtube.com/embed/3ofcPquafgk?autoplay=1&rel=0&modestbranding=1&playsinline=1"
                  title="OT Security First UAE — Event Highlights"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    loading="lazy"
                    src="https://img.youtube.com/vi/3ofcPquafgk/hqdefault.jpg"
                    alt="OT Security First UAE — Event Highlights"
                    width={480}
                    height={360}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {/* Glass reflection line */}
                  <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${CYAN}90, transparent)`, boxShadow: `0 0 10px ${CYAN}60`, pointerEvents: "none" }} />
                  {/* Vignette */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(7,11,31,0.15) 0%, rgba(7,11,31,0.1) 50%, rgba(7,11,31,0.55) 100%)", pointerEvents: "none" }} />
                  {/* Play button */}
                  <div className="otsf-about-play-wrap" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <div className="otsf-about-play-btn" style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.95)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2)",
                      transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                      backdropFilter: "blur(10px)",
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill={C} style={{ marginLeft: 3 }}>
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                  {/* Corner label */}
                  <div style={{ position: "absolute", top: 14, left: 14, pointerEvents: "none" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: `linear-gradient(135deg, ${C}66 0%, ${C}33 100%)`,
                      border: `1px solid ${C}66`,
                      fontFamily: "var(--font-dm)",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "white",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      backdropFilter: "blur(8px)",
                    }}>OT Security · UAE Highlights</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Editorial flow — interleaved text + stats */}
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(28px, 3.5vw, 48px)" }}>

          {/* Hero stat — 94% featured full-width card */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          >
            <StatCard value={heroStat.value} suffix={heroStat.suffix} label={heroStat.label} featured large />
          </motion.div>

          {/* Paragraph 2 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            style={{ maxWidth: 820, margin: "0 auto" }}
          >
            <p style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(16px, 1.35vw, 19px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.75,
              margin: 0,
              textAlign: "center",
              letterSpacing: "0.01em",
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}>
              {p2}
            </p>
          </motion.div>

          {/* Stats pair 1 — $4.5M + 47 days */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px, 2vw, 24px)" }}
            className="otsf-stats-pair"
          >
            {statsPair1.map((s) => <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} />)}
          </motion.div>

          {/* Paragraph 3 — pull quote style (italic) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", padding: "0 24px" }}
          >
            <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: "70%", background: `linear-gradient(180deg, transparent, ${CYAN}, transparent)`, borderRadius: 2 }} />
            <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: "70%", background: `linear-gradient(180deg, transparent, ${C_BRIGHT}, transparent)`, borderRadius: 2 }} />
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(18px, 1.8vw, 24px)",
              fontWeight: 400,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.5,
              letterSpacing: "-0.3px",
              margin: 0,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}>
              {p3}
            </p>
          </motion.div>

          {/* Stats pair 2 — 82% + 61% */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px, 2vw, 24px)" }}
            className="otsf-stats-pair"
          >
            {statsPair2.map((s) => <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} />)}
          </motion.div>

          {/* Paragraph 4 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
            style={{ maxWidth: 820, margin: "0 auto" }}
          >
            <p style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(16px, 1.35vw, 19px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.75,
              margin: 0,
              textAlign: "center",
              letterSpacing: "0.01em",
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}>
              {p4}
            </p>
          </motion.div>

          {/* Stats pair 3 — 23% + 19.5% */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px, 2vw, 24px)" }}
            className="otsf-stats-pair"
          >
            {statsPair3.map((s) => <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} />)}
          </motion.div>

          {/* Closing narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.95, ease: EASE }}
            style={{ maxWidth: 840, margin: "0 auto", textAlign: "center" }}
          >
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(17px, 1.6vw, 22px)",
              fontWeight: 500,
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.45,
              letterSpacing: "-0.3px",
              margin: 0,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}>
              {closing}
            </p>
          </motion.div>
        </div>

        {/* Highlighted callout — premium CTA with skeuomorphism + liquid glass */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
          className="otsf-movement-cta"
          style={{
            marginTop: "clamp(32px, 4vw, 56px)",
            maxWidth: 1200,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 28,
            padding: 2,
            background: `linear-gradient(135deg, ${C_BRIGHT}, ${CYAN} 50%, ${C_BRIGHT})`,
            boxShadow: `0 28px 80px rgba(0,0,0,0.5), 0 12px 32px ${C}30, 0 0 60px ${CYAN}25, inset 0 1px 0 rgba(255,255,255,0.15)`,
            transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
            position: "relative",
          }}
        >
          {/* Outer gradient animated border shimmer */}
          <div style={{ position: "absolute", inset: -2, borderRadius: 30, background: `linear-gradient(135deg, transparent, ${C_BRIGHT}40, transparent, ${CYAN}40, transparent)`, filter: "blur(12px)", opacity: 0.6, pointerEvents: "none", zIndex: -1 }} />

          <div style={{
            borderRadius: 26,
            padding: "clamp(32px, 4vw, 56px) clamp(32px, 4vw, 72px)",
            background: `linear-gradient(135deg, rgba(211,75,154,0.18) 0%, rgba(13,18,51,0.85) 30%, rgba(7,11,31,0.95) 65%, rgba(0,201,255,0.15) 100%)`,
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            // Skeuomorphic inset shadows
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.5), inset 1px 0 0 rgba(255,255,255,0.05), inset -1px 0 0 rgba(0,0,0,0.3)`,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top reflection light */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 70%)", pointerEvents: "none", borderRadius: "26px 26px 0 0" }} />

            {/* Top shine line with glow */}
            <div style={{ position: "absolute", top: 2, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`, boxShadow: `0 0 24px ${CYAN}80`, borderRadius: 2 }} />

            {/* Secondary shine */}
            <div style={{ position: "absolute", top: 8, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />

            {/* Corner glows */}
            <div style={{ position: "absolute", top: -100, left: -100, width: 350, height: 350, background: `radial-gradient(circle, ${C_BRIGHT}30, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -100, right: -100, width: 350, height: 350, background: `radial-gradient(circle, ${CYAN}25, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />

            {/* Subtle grid texture */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${CYAN}08 1px, transparent 1px), linear-gradient(90deg, ${C}08 1px, transparent 1px)`, backgroundSize: "32px 32px", pointerEvents: "none", opacity: 0.4, maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)" }} />

            {/* Bottom reflection pool */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}60, ${CYAN}60, transparent)` }} />

            {/* Content — 2-column layout */}
            <div className="otsf-movement-content" style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "clamp(28px, 4vw, 56px)" }}>
              {/* LEFT — Badge + Headline */}
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 2vw, 22px)", textAlign: "left" }}>
                <div style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 18px",
                  borderRadius: 50,
                  background: `linear-gradient(135deg, ${C_BRIGHT}20, ${CYAN}15)`,
                  border: `1px solid ${CYAN}35`,
                  backdropFilter: "blur(10px)",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: CYAN, boxShadow: `0 0 10px ${CYAN}`, animation: "otsf-pulse 2s ease-in-out infinite" }} />
                  <span style={{ fontFamily: "var(--font-dm)", fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "3px" }}>Join the movement</span>
                </div>

                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(20px, 2.2vw, 30px)",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.3,
                  margin: 0,
                  letterSpacing: "-0.5px",
                  textShadow: `0 2px 20px rgba(0,0,0,0.4), 0 0 30px ${CYAN}20`,
                }}>
                  Be a part of <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>OT Security First Africa</span> and lead the charge toward securing the systems that power our economy.
                </p>
              </div>

              {/* RIGHT — CTA button */}
              <a
                href="#register"
                className="otsf-movement-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 36px",
                  borderRadius: 50,
                  background: `linear-gradient(135deg, ${C}, ${CYAN})`,
                  color: "white",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: "none",
                  letterSpacing: "0.3px",
                  whiteSpace: "nowrap",
                  boxShadow: `0 8px 24px ${C}40, 0 0 30px ${CYAN}25, inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 2px rgba(0,0,0,0.3)`,
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
                  e.currentTarget.style.boxShadow = `0 14px 36px ${C}55, 0 0 40px ${CYAN}40, inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${C}40, 0 0 30px ${CYAN}25, inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 2px rgba(0,0,0,0.3)`;
                }}
              >
                Register your interest
                <span style={{ fontSize: 16, lineHeight: 1 }}>→</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── MARKET DRIVERS ─────────────────────────────────────────────────────────
// Icon components for each driver — outlined SVG icons (Apple-style)
const DRIVER_ICONS = [
  // Regulation/CIPA — shield with checkmark
  <svg key="0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L4 5v7c0 4.5 3.3 8.6 8 10 4.7-1.4 8-5.5 8-10V5l-8-3z"/><path d="M9 12l2 2 4-4"/></svg>,
  // Government funding — building with coins
  <svg key="1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-6h6v6"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>,
  // Industry 4.0 — chip/circuit
  <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></svg>,
  // Geopolitical APTs — globe with target
  <svg key="3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  // Cyber insurance — document with shield
  <svg key="4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 11l-2 2 2 2 2-2-2-2z"/></svg>,
  // Supply chain breaches — link chain
  <svg key="5" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  // Talent shortage — people
  <svg key="6" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
];

// Short titles for each driver (extracted from the full text)
const DRIVER_TITLES = [
  "Regulatory alignment",
  "National funding boost",
  "Industry 4.0 explosion",
  "Geopolitical threats",
  "Insurance mandates",
  "Vendor breach risk",
  "Talent shortage",
];

// Key takeaways/bullets for each driver
const DRIVER_TAKEAWAYS = [
  ["CIPA enforcement rolling out across sectors", "Alignment with IEC 62443 & NIST frameworks", "Compliance now a board-level priority"],
  ["Government-backed resilience programs", "Digital transformation funding", "Public-sector cyber mandates"],
  ["340% increase in attack surface", "Managed OT Security services rising", "SOC-based monitoring adoption"],
  ["APT campaigns targeting energy infra", "State-sponsored threat escalation", "Cross-border OT espionage risk"],
  ["89% insurers mandate ICS coverage", "Premiums tied to OT controls", "Claim denials for poor segmentation"],
  ["76% breaches from vendor access", "Third-party equipment risks", "Supply chain compromise rising"],
  ["3.5M professional shortage globally", "Acute gap in OT specialization", "Skills bottleneck in Africa"],
];

// Category + impact stat per driver
const DRIVER_META = [
  { category: "Regulation", impact: "CIPA", impactLabel: "Legal mandate" },
  { category: "Economic", impact: "↑", impactLabel: "Funding rising" },
  { category: "Industry", impact: "340%", impactLabel: "Attack surface ↑" },
  { category: "Geopolitical", impact: "APT", impactLabel: "State-level threats" },
  { category: "Financial", impact: "89%", impactLabel: "Insurers require ICS" },
  { category: "Supply chain", impact: "76%", impactLabel: "Vendor-related" },
  { category: "Workforce", impact: "3.5M", impactLabel: "Global shortage" },
];

// Cinematic industrial images — dark, moody, relevant to OT / critical infra
const DRIVER_IMAGES = [
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=85&auto=format&fit=crop", // Regulation — gavel/law
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&q=85&auto=format&fit=crop", // National funding — power grid/infrastructure
  "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1600&q=85&auto=format&fit=crop", // Industry 4.0 — factory machinery
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=85&auto=format&fit=crop", // Geopolitical — earth from space / global
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=85&auto=format&fit=crop", // Insurance — documents/pen
  "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1600&q=85&auto=format&fit=crop", // Vendor breach / supply chain — shipping containers
  "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1600&q=85&auto=format&fit=crop", // Talent — engineer with hard hat
];

// Single driver card for horizontal scroll
function DriverCard({ index }: { index: number }) {
  const accent = index % 2 === 0 ? C_BRIGHT : CYAN;
  const accentDeep = index % 2 === 0 ? C : CYAN_DIM;

  return (
    <div
      className="otsf-driver-slide"
      style={{
        flex: "0 0 100%",
        scrollSnapAlign: "start",
        display: "grid",
        gridTemplateColumns: "1fr 1.15fr",
        gap: "clamp(24px, 3.5vw, 56px)",
        alignItems: "center",
        padding: "0 4px",
      }}
    >
      {/* IMAGE side */}
      <div style={{ position: "relative", aspectRatio: "5 / 4", borderRadius: 20, overflow: "hidden", boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 40px ${accentDeep}22` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DRIVER_IMAGES[index]}
          alt={DRIVER_TITLES[index]}
          loading="lazy"
          width={1000}
          height={800}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.7) contrast(1.08) brightness(0.82)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(7,11,31,0.2) 0%, rgba(7,11,31,0.3) 50%, rgba(7,11,31,0.85) 100%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${accentDeep}20, transparent 55%)`, mixBlendMode: "overlay", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`, boxShadow: `0 0 16px ${accent}60` }} />
        {/* Category chip */}
        <div style={{ position: "absolute", top: 24, left: 24 }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 16px",
            borderRadius: 50,
            background: `rgba(7,11,31,0.7)`,
            backdropFilter: "blur(16px) saturate(180%)",
            border: `1px solid ${accent}60`,
            fontFamily: "var(--font-dm)",
            fontSize: 10,
            fontWeight: 700,
            color: "white",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            boxShadow: `0 4px 12px rgba(0,0,0,0.4), 0 0 20px ${accentDeep}30`,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, boxShadow: `0 0 10px ${accent}` }} />
            {DRIVER_META[index].category}
          </span>
        </div>
        {/* Big outlined number */}
        <div style={{ position: "absolute", bottom: 16, left: 20 }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(54px, 7vw, 100px)",
            fontWeight: 800,
            color: "transparent",
            WebkitTextStroke: `1.5px rgba(255,255,255,0.4)`,
            letterSpacing: "-4px",
            lineHeight: 0.85,
            display: "block",
          }}>
            0{index + 1}
          </span>
        </div>
      </div>

      {/* CONTENT side */}
      <div className="otsf-driver-slide-content" style={{ display: "flex", flexDirection: "column", gap: "clamp(18px, 2.2vw, 28px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: accent, letterSpacing: "3.5px", textTransform: "uppercase" }}>
            0{index + 1} / 07
          </span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}60, transparent)` }} />
        </div>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(26px, 3.2vw, 42px)",
          fontWeight: 700,
          color: "white",
          margin: 0,
          letterSpacing: "-1.3px",
          lineHeight: 1.08,
          textShadow: `0 2px 20px rgba(0,0,0,0.4)`,
        }}>
          {DRIVER_TITLES[index]}
        </h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 3.6vw, 52px)",
            fontWeight: 800,
            color: accent,
            letterSpacing: "-2px",
            lineHeight: 1,
            textShadow: `0 0 24px ${accentDeep}60, 0 2px 0 rgba(0,0,0,0.4)`,
          }}>
            {DRIVER_META[index].impact}
          </span>
          <span style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(13px, 1.05vw, 15px)",
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.3px",
          }}>
            {DRIVER_META[index].impactLabel}
          </span>
        </div>
        <p style={{
          fontFamily: "var(--font-outfit)",
          fontSize: "clamp(14.5px, 1.15vw, 16.5px)",
          fontWeight: 400,
          color: "rgba(255,255,255,0.72)",
          lineHeight: 1.8,
          margin: 0,
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}>
          {MARKET_DRIVERS[index]}
        </p>
      </div>
    </div>
  );
}

// Horizontal carousel for the drivers
function DriversCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeIndexRef = useRef(0);

  const scrollTo = useCallback((i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const slide = el.children[i] as HTMLElement | undefined;
    if (slide) {
      el.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }
  }, []);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const closest = Math.round(el.scrollLeft / el.clientWidth);
    const clamped = Math.max(0, Math.min(MARKET_DRIVERS.length - 1, closest));
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
  };

  // Auto-scroll every 5 seconds, pause on hover/touch
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const next = (activeIndexRef.current + 1) % MARKET_DRIVERS.length;
      scrollTo(next);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, scrollTo]);

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < MARKET_DRIVERS.length - 1;

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
    >
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="otsf-drivers-scroll"
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          gap: 0,
          paddingBottom: 4,
          scrollbarWidth: "none",
        }}
      >
        {MARKET_DRIVERS.map((_, i) => <DriverCard key={i} index={i} />)}
      </div>

      {/* Bottom controls — arrows + dots */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: "clamp(32px, 4vw, 48px)" }}>
        {/* Prev */}
        <button
          onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
          disabled={!canPrev}
          aria-label="Previous driver"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: `1px solid ${canPrev ? C_BRIGHT : "rgba(255,255,255,0.1)"}40`,
            background: `rgba(7,11,31,0.6)`,
            backdropFilter: "blur(12px)",
            color: canPrev ? "white" : "rgba(255,255,255,0.3)",
            cursor: canPrev ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            boxShadow: canPrev ? `0 6px 16px rgba(0,0,0,0.3), 0 0 20px ${C}15` : "none",
          }}
          onMouseEnter={(e) => { if (canPrev) { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.background = `${C}25`; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(7,11,31,0.6)"; }}
        >
          ←
        </button>

        {/* Dots */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {MARKET_DRIVERS.map((_, i) => {
            const isActive = i === activeIndex;
            const accent = i % 2 === 0 ? C_BRIGHT : CYAN;
            return (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to driver ${i + 1}`}
                style={{
                  width: isActive ? 32 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: isActive ? `linear-gradient(90deg, ${C_BRIGHT}, ${CYAN})` : "rgba(255,255,255,0.2)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                  boxShadow: isActive ? `0 0 12px ${accent}60` : "none",
                }}
              />
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => scrollTo(Math.min(MARKET_DRIVERS.length - 1, activeIndex + 1))}
          disabled={!canNext}
          aria-label="Next driver"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: `1px solid ${canNext ? CYAN : "rgba(255,255,255,0.1)"}40`,
            background: `rgba(7,11,31,0.6)`,
            backdropFilter: "blur(12px)",
            color: canNext ? "white" : "rgba(255,255,255,0.3)",
            cursor: canNext ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            boxShadow: canNext ? `0 6px 16px rgba(0,0,0,0.3), 0 0 20px ${CYAN}15` : "none",
          }}
          onMouseEnter={(e) => { if (canNext) { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.background = `${CYAN}25`; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(7,11,31,0.6)"; }}
        >
          →
        </button>
      </div>
    </div>
  );
}

// ─── POST-EVENT REPORTS — downloadable PDFs from past editions ──────────────
function OTSfPostEventReports() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // ── Delegate-list request form state ─────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.country === "ZA") || COUNTRY_CODES[0]
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
    window.addEventListener("otsf-jhb:open-request", onOpenRequest);
    return () => window.removeEventListener("otsf-jhb:open-request", onOpenRequest);
  }, []);

  // Modal copy — derived from the current request type
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

  // Digit count for current phone, used by live validity hint
  const phoneDigits = phone.replace(/[\s\-()]/g, "");
  const phoneDigitsLen = phoneDigits.length;
  const phoneIsValid = phoneDigitsLen > 0 && validatePhone(phone, countryCode) === null;

  // Live-validate phone whenever phone or country code changes (after first interaction)
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
      event_name: "OT Security First Africa 2026 — Johannesburg",
      metadata: {
        "Event Page": "OT Security First Africa 2026 — Johannesburg",
        "Request Type": requestType,
        "Page Section": "Post-Event Reports",
        ...(selectedReport && {
          "Selected Edition": selectedReport.title,
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
              className="otsf-jhb-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="otsf-jhb-modal-title"
          >
            <motion.div
              className="otsf-jhb-modal-card"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="otsf-jhb-modal-close"
                aria-label="Close request form"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <span aria-hidden className="otsf-jhb-modal-hairline" />

              <div className="otsf-jhb-modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 24, height: 1, background: C_BRIGHT }} />
                  <span style={{
                    fontFamily: "var(--font-dm)",
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.32em", textTransform: "uppercase",
                    color: C_BRIGHT,
                  }}>{modalCopy.kicker}</span>
                </div>
                <h3 id="otsf-jhb-modal-title" style={{
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
                <div className="otsf-jhb-modal-success">
                  <div className="otsf-jhb-modal-success-check">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h4>Request received.</h4>
                  <p>{modalCopy.success}</p>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="otsf-jhb-modal-done"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="otsf-jhb-delegate-form-fields">
                {/* Honeypot */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off"
                  style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

                {/* Edition picker — used by both Delegate List and Past Event Report requests */}
                <div className="otsf-jhb-delegate-row">
                  <label className="otsf-jhb-delegate-field" style={{ flex: "1 1 100%" }}>
                    <span className="otsf-jhb-delegate-label">Select Edition</span>
                    <select
                      value={selectedReportUrl}
                      onChange={(e) => {
                        setSelectedReportUrl(e.target.value);
                        if (errors.report) setErrors({ ...errors, report: "" });
                      }}
                      className="otsf-jhb-delegate-input otsf-jhb-delegate-report-select"
                      aria-invalid={!!errors.report}
                    >
                      {POST_EVENT_REPORTS.map((r) => (
                        <option key={r.url} value={r.url}>
                          {r.title}
                        </option>
                      ))}
                    </select>
                    {errors.report && <span className="otsf-jhb-delegate-err">{errors.report}</span>}
                  </label>
                </div>

                <div className="otsf-jhb-delegate-row">
                  <label className="otsf-jhb-delegate-field">
                    <span className="otsf-jhb-delegate-label">Full Name</span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors({ ...errors, fullName: "" }); }}
                      placeholder="Your full name"
                      autoComplete="name"
                      className="otsf-jhb-delegate-input"
                      aria-invalid={!!errors.fullName}
                    />
                    {errors.fullName && <span className="otsf-jhb-delegate-err">{errors.fullName}</span>}
                  </label>

                  <label className="otsf-jhb-delegate-field">
                    <span className="otsf-jhb-delegate-label">Work Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }}
                      placeholder="name@company.com"
                      autoComplete="email"
                      className="otsf-jhb-delegate-input"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <span className="otsf-jhb-delegate-err">{errors.email}</span>}
                  </label>
                </div>

                <div className="otsf-jhb-delegate-row">
                  <label className="otsf-jhb-delegate-field">
                    <span className="otsf-jhb-delegate-label">Job Title</span>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => { setJobTitle(e.target.value); if (errors.jobTitle) setErrors({ ...errors, jobTitle: "" }); }}
                      placeholder="CISO, Head of OT, Plant Director…"
                      autoComplete="organization-title"
                      className="otsf-jhb-delegate-input"
                      aria-invalid={!!errors.jobTitle}
                    />
                    {errors.jobTitle && <span className="otsf-jhb-delegate-err">{errors.jobTitle}</span>}
                  </label>

                  <label className="otsf-jhb-delegate-field">
                    <span className="otsf-jhb-delegate-label">
                      Phone
                      <span className="otsf-jhb-delegate-hint-inline">
                        {countryCode.length} digits expected
                      </span>
                    </span>
                    <div className="otsf-jhb-delegate-phone-row">
                      <select
                        value={`${countryCode.country}-${countryCode.code}`}
                        onChange={(e) => {
                          const [country, code] = e.target.value.split("-");
                          const found = COUNTRY_CODES.find((c) => c.country === country && c.code === code);
                          if (found) {
                            setCountryCode(found);
                            // Trim phone if the new country expects fewer digits
                            setPhone((prev) => prev.replace(/\D/g, "").slice(0, found.length));
                          }
                        }}
                        className="otsf-jhb-delegate-cc"
                        aria-label="Country code"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={`${c.country}-${c.code}`} value={`${c.country}-${c.code}`}>
                            {c.country} {c.code}
                          </option>
                        ))}
                      </select>
                      <div className="otsf-jhb-delegate-phone-input-wrap">
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={phone}
                          onChange={(e) => {
                            // Digits only; hard-cap at the country's expected digit count
                            const digits = e.target.value.replace(/\D/g, "").slice(0, countryCode.length);
                            setPhone(digits);
                          }}
                          onBlur={() => setPhoneTouched(true)}
                          placeholder={countryCode.placeholder}
                          autoComplete="tel-national"
                          maxLength={countryCode.length}
                          className="otsf-jhb-delegate-input otsf-jhb-delegate-phone-input"
                          aria-invalid={!!errors.phone}
                        />
                        {phoneTouched && phoneIsValid && (
                          <span aria-hidden className="otsf-jhb-delegate-phone-check">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                    {phoneTouched && !phoneIsValid && phoneDigitsLen > 0 && !errors.phone && (
                      <span className="otsf-jhb-delegate-phone-progress">
                        {phoneDigitsLen} / {countryCode.length} digits
                      </span>
                    )}
                    {errors.phone && <span className="otsf-jhb-delegate-err">{errors.phone}</span>}
                  </label>
                </div>

                {submitError && (
                  <div className="otsf-jhb-delegate-submit-err">{submitError}</div>
                )}

                <button
                  type="submit"
                  disabled={submitState === "submitting"}
                  className="otsf-jhb-delegate-submit"
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
                <p className="otsf-jhb-delegate-hint">
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
        .otsf-jhb-report-card:hover {
          border-color: ${C_BRIGHT}66 !important;
          transform: translateY(-3px);
          backdrop-filter: blur(34px) saturate(200%) !important;
          -webkit-backdrop-filter: blur(34px) saturate(200%) !important;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(0, 0, 0, 0.45),
            inset 0 0 0 1px ${C}1a,
            0 1px 2px rgba(0, 0, 0, 0.45),
            0 14px 36px ${C}29,
            0 28px 64px rgba(0, 0, 0, 0.38) !important;
        }
        .otsf-jhb-report-card:hover .otsf-jhb-report-logo {
          transform: scale(calc(var(--logo-scale, 1) * 1.04)) !important;
          filter: drop-shadow(0 6px 24px ${C}66) !important;
        }
        .otsf-jhb-report-card:hover .otsf-jhb-report-arrow {
          background: ${C_BRIGHT} !important;
          border-color: ${C_BRIGHT} !important;
          color: white !important;
          transform: translateY(2px);
          box-shadow: 0 6px 16px ${C}66;
        }
        /* ─── Side-by-side layout: cards left, form right ─────────────── */
        .otsf-jhb-reports-layout {
          display: grid;
          grid-template-columns: minmax(280px, 360px) 1fr;
          gap: clamp(20px, 3vw, 40px);
          align-items: start;
        }
        .otsf-jhb-reports-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(16px, 2vw, 28px);
        }
        @media (max-width: 880px) {
          .otsf-jhb-reports-layout {
            grid-template-columns: 1fr !important;
          }
          .otsf-jhb-reports-grid {
            max-width: 420px;
            margin: 0 auto;
          }
        }

        /* ─── Delegate-list request form ──────────────────────────────────── */
        .otsf-jhb-delegate-form-wrap {
          display: flex;
          justify-content: stretch;
        }
        .otsf-jhb-delegate-form-card {
          position: relative;
          width: 100%;
          padding: clamp(16px, 1.8vw, 22px);
          background: linear-gradient(165deg, rgba(30, 18, 38, 0.55) 0%, rgba(12, 8, 24, 0.65) 100%);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          overflow: hidden;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -1px 0 rgba(0, 0, 0, 0.4),
            0 1px 2px rgba(0, 0, 0, 0.45),
            0 14px 36px rgba(0, 0, 0, 0.30),
            0 32px 64px rgba(0, 0, 0, 0.32);
        }
        .otsf-jhb-delegate-hairline {
          position: absolute;
          top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent 0%, ${C_BRIGHT} 30%, ${CYAN} 70%, transparent 100%);
          opacity: 0.75;
        }
        .otsf-jhb-delegate-header {
          margin-bottom: clamp(18px, 2.2vw, 24px);
          position: relative; z-index: 1;
        }
        /* ── Delegate preview teaser ─────────────────────────────────────── */
        .otsf-jhb-delegate-preview {
          position: relative; z-index: 1;
          margin-bottom: clamp(12px, 1.4vw, 16px);
          padding: clamp(10px, 1.2vw, 14px) clamp(12px, 1.4vw, 16px);
          background: linear-gradient(180deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.010) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          overflow: hidden;
        }
        .otsf-jhb-delegate-preview-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: clamp(7px, 0.8vw, 10px);
          padding-bottom: clamp(7px, 0.8vw, 10px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .otsf-jhb-delegate-preview-eyebrow {
          font-family: var(--font-dm);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.26em; text-transform: uppercase;
          color: rgba(255,255,255,0.65);
        }
        .otsf-jhb-delegate-preview-pill {
          display: inline-flex; align-items: center;
          padding: 4px 10px; border-radius: 999px;
          border: 1px solid ${C}55;
          background: ${C}1a;
          font-family: var(--font-outfit);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: ${C_BRIGHT};
          white-space: nowrap;
        }
        .otsf-jhb-delegate-preview-list {
          list-style: none;
          margin: 0; padding: 0;
          display: flex; flex-direction: column;
        }
        .otsf-jhb-delegate-preview-row {
          display: flex; align-items: center;
          gap: clamp(8px, 0.9vw, 11px);
          padding: clamp(4px, 0.5vw, 6px) 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .otsf-jhb-delegate-preview-row:last-child {
          border-bottom: none;
        }
        .otsf-jhb-delegate-preview-row.is-blurred {
          filter: blur(5.5px);
          opacity: 0.72;
          user-select: none;
          pointer-events: none;
        }
        .otsf-jhb-delegate-preview-avatar {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${C} 0%, ${CYAN} 100%);
          font-family: var(--font-display);
          font-size: 10.5px; font-weight: 700;
          letter-spacing: 0.02em;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.35);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.25),
            0 2px 6px rgba(0,0,0,0.35);
        }
        .otsf-jhb-delegate-preview-meta {
          display: flex; flex-direction: column;
          gap: 2px;
          min-width: 0; flex: 1;
        }
        .otsf-jhb-delegate-preview-name {
          font-family: var(--font-display);
          font-size: clamp(12.5px, 0.95vw, 14px);
          font-weight: 700;
          color: white;
          letter-spacing: -0.01em;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .otsf-jhb-delegate-preview-role {
          font-family: var(--font-outfit);
          font-size: clamp(10.5px, 0.82vw, 11.5px);
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          line-height: 1.3;
        }
        .otsf-jhb-delegate-preview-dot {
          color: ${C_BRIGHT};
          font-weight: 700;
          padding: 0 2px;
        }
        .otsf-jhb-delegate-preview-co {
          color: rgba(255,255,255,0.78);
          font-weight: 600;
        }
        .otsf-jhb-delegate-preview-cta {
          margin: clamp(12px, 1.3vw, 14px) 0 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-outfit);
          font-size: 12px;
          font-weight: 600;
          color: ${C_BRIGHT};
          letter-spacing: 0.02em;
        }
        .otsf-jhb-delegate-preview-cta svg {
          flex: 0 0 auto;
          animation: otsf-jhb-cta-bob 1.8s ease-in-out infinite;
        }
        @keyframes otsf-jhb-cta-bob {
          0%, 100% { transform: translateY(0); opacity: 0.9; }
          50%      { transform: translateY(3px); opacity: 1; }
        }
        @media (max-width: 540px) {
          .otsf-jhb-delegate-preview-name { white-space: normal; }
          .otsf-jhb-delegate-preview-avatar { width: 30px; height: 30px; font-size: 11.5px; }
        }
        /* ── CTA text-link (opens modal) ─────────────────────────────────── */
        .otsf-jhb-delegate-cta-link {
          position: relative; z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin: 0;
          padding: 4px 0 2px;
          background: none;
          border: none;
          border-bottom: 1px solid ${C_BRIGHT}55;
          border-radius: 0;
          font-family: var(--font-outfit);
          font-size: clamp(12.5px, 0.95vw, 13.5px);
          font-weight: 600;
          letter-spacing: 0.02em;
          color: ${C_BRIGHT};
          cursor: pointer;
          text-transform: none;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .otsf-jhb-delegate-cta-link:hover {
          color: white;
          border-color: ${C_BRIGHT};
        }
        .otsf-jhb-delegate-cta-link svg {
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .otsf-jhb-delegate-cta-link:hover svg {
          transform: translateX(3px);
        }

        /* ── Modal overlay + card ────────────────────────────────────────── */
        .otsf-jhb-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(16px, 3vw, 32px);
          background: rgba(4, 2, 10, 0.78);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
        }
        .otsf-jhb-modal-card {
          position: relative;
          width: 100%;
          max-width: 580px;
          max-height: calc(100vh - clamp(32px, 6vw, 64px));
          overflow-y: auto;
          padding: clamp(24px, 3vw, 36px);
          background: linear-gradient(165deg, rgba(30, 18, 38, 0.92) 0%, rgba(12, 8, 24, 0.96) 100%);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 20px;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.16),
            inset 0 -1px 0 rgba(0,0,0,0.45),
            0 24px 56px rgba(0,0,0,0.55),
            0 48px 96px rgba(0,0,0,0.45);
        }
        .otsf-jhb-modal-hairline {
          position: absolute;
          top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent 0%, ${C_BRIGHT} 30%, ${CYAN} 70%, transparent 100%);
          opacity: 0.8;
        }
        .otsf-jhb-modal-close {
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
        .otsf-jhb-modal-close:hover {
          color: white;
          border-color: ${C_BRIGHT}66;
          background: ${C}1a;
          transform: rotate(90deg);
        }
        .otsf-jhb-modal-header {
          margin-bottom: clamp(18px, 2vw, 22px);
          padding-right: 36px; /* avoid overlap with close X */
        }
        .otsf-jhb-modal-success {
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: clamp(8px, 1vw, 12px) 0 4px;
        }
        .otsf-jhb-modal-success-check {
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 56px; height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${C}, ${CYAN});
          margin-bottom: 16px;
          box-shadow: 0 8px 24px ${C}40;
        }
        .otsf-jhb-modal-success h4 {
          margin: 0 0 8px;
          font-family: var(--font-display);
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 700;
          color: white;
        }
        .otsf-jhb-modal-success p {
          margin: 0 0 22px;
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.55;
          max-width: 380px;
        }
        .otsf-jhb-modal-done {
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
        .otsf-jhb-modal-done:hover {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }
        @media (max-width: 540px) {
          .otsf-jhb-modal-card { padding: 22px 18px; border-radius: 16px; }
          .otsf-jhb-modal-header { padding-right: 30px; }
        }
        .otsf-jhb-delegate-form-fields {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          gap: clamp(14px, 1.8vw, 18px);
        }
        .otsf-jhb-delegate-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(12px, 1.6vw, 18px);
        }
        .otsf-jhb-delegate-field {
          display: flex; flex-direction: column;
          gap: 6px;
        }
        .otsf-jhb-delegate-label {
          font-family: var(--font-outfit);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .otsf-jhb-delegate-hint-inline {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: none;
          color: rgba(255,255,255,0.35);
        }
        .otsf-jhb-delegate-phone-input-wrap {
          position: relative;
          flex: 1;
        }
        .otsf-jhb-delegate-phone-check {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${C}, ${CYAN});
          color: white;
          box-shadow: 0 2px 8px ${C}40;
          pointer-events: none;
        }
        .otsf-jhb-delegate-phone-progress {
          font-family: var(--font-outfit);
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          font-variant-numeric: tabular-nums;
          margin-top: 2px;
        }
        .otsf-jhb-delegate-input {
          width: 100%;
          padding: 12px 14px;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          color: white;
          font-family: var(--font-outfit);
          font-size: 14.5px;
          line-height: 1.4;
          outline: none;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }
        .otsf-jhb-delegate-input::placeholder {
          color: rgba(255,255,255,0.30);
        }
        .otsf-jhb-delegate-input:focus {
          border-color: ${C_BRIGHT};
          background: rgba(0,0,0,0.35);
          box-shadow: 0 0 0 3px ${C}26;
        }
        .otsf-jhb-delegate-input[aria-invalid="true"] {
          border-color: rgba(255,80,80,0.6);
        }
        /* Past Event Report picker — native select with a custom cyan chevron */
        .otsf-jhb-delegate-report-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          padding-right: 40px;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1l5 5 5-5' stroke='%2300C9FF' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>");
          background-repeat: no-repeat;
          background-position: right 14px center;
          cursor: pointer;
        }
        .otsf-jhb-delegate-report-select option {
          background: #1a1228;
          color: white;
        }
        .otsf-jhb-delegate-phone-row {
          display: flex;
          gap: 8px;
        }
        .otsf-jhb-delegate-cc {
          padding: 12px 10px;
          background: rgba(0,0,0,0.25);
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
        .otsf-jhb-delegate-cc:focus {
          border-color: ${C_BRIGHT};
          box-shadow: 0 0 0 3px ${C}26;
        }
        .otsf-jhb-delegate-cc option {
          background: #0d1233;
          color: white;
        }
        .otsf-jhb-delegate-phone-input {
          flex: 1;
          width: 100%;
          padding-right: 40px;
        }
        .otsf-jhb-delegate-err {
          font-family: var(--font-outfit);
          font-size: 12px;
          color: #ff7a7a;
          margin-top: 2px;
        }
        .otsf-jhb-delegate-submit-err {
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255, 80, 80, 0.10);
          border: 1px solid rgba(255, 80, 80, 0.30);
          color: #ff9a9a;
          font-family: var(--font-outfit);
          font-size: 13.5px;
        }
        .otsf-jhb-delegate-submit {
          display: inline-flex;
          align-items: center; justify-content: center;
          padding: 14px 24px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: linear-gradient(135deg, ${C}, ${CYAN});
          color: white;
          font-family: var(--font-outfit);
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          align-self: flex-start;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, filter 0.25s ease;
          box-shadow: 0 8px 20px ${C}33, inset 0 1px 0 rgba(255,255,255,0.18);
        }
        .otsf-jhb-delegate-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.08);
          box-shadow: 0 12px 28px ${C}4d, inset 0 1px 0 rgba(255,255,255,0.22);
        }
        .otsf-jhb-delegate-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .otsf-jhb-delegate-hint {
          font-family: var(--font-outfit);
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin: 4px 0 0;
        }
        .otsf-jhb-delegate-success {
          position: relative; z-index: 1;
          text-align: center;
          padding: clamp(20px, 3vw, 32px) 0;
        }
        @media (max-width: 640px) {
          .otsf-jhb-delegate-row {
            grid-template-columns: 1fr !important;
          }
          .otsf-jhb-delegate-submit {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}

function MarketDriversSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Header — centered like Apple product section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "clamp(28px, 3.5vw, 44px)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT})` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px" }}>Why Now</span>
            <span style={{ width: 40, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: "0 0 16px" }}>
            Market <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>drivers</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(15px, 1.2vw, 17px)", fontWeight: 400, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 640, margin: "0 auto" }}>
            Seven converging forces are reshaping Africa&apos;s OT security landscape — and why this summit matters now.
          </p>
        </motion.div>

        {/* Horizontal scroll carousel */}
        <DriversCarousel />

        {/* Hidden fallback reference (prevent unused import) */}
        <span style={{ display: "none" }}>{DRIVER_TAKEAWAYS[0][0]}</span>
      </div>
    </section>
  );
}

// ─── FOCUS AREAS, 10 GSAP Flip Cards ────────────────────────────────────────
function FocusAreas() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} id="themes" style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Header — left-aligned editorial style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ marginBottom: "clamp(28px, 3.5vw, 44px)", maxWidth: 780 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${C_BRIGHT}, transparent)` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px" }}>Strategic Themes</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 54px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: "0 0 20px" }}>
            The agenda, <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>10 critical tracks</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(15px, 1.2vw, 17px)", fontWeight: 400, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
            Non-surface industrial priorities, anchored in operational practicality — drawn from the rooms our community fills.
          </p>
        </motion.div>

        {/* Cinematic hero image */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, ease: EASE }}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "21 / 9",
            borderRadius: 28,
            overflow: "hidden",
            marginBottom: "clamp(28px, 3.5vw, 44px)",
            boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 60px ${C}18`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0572.JPG`}
            alt="OT Security First UAE — delegates and main session"
            loading="lazy"
            width={1680}
            height={720}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.05) contrast(1.03)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(7,11,31,0.1) 0%, rgba(7,11,31,0.15) 55%, rgba(7,11,31,0.6) 100%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C}20, transparent 50%, ${CYAN}15)`, mixBlendMode: "overlay", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg, transparent, ${CYAN}80, transparent)`, boxShadow: `0 0 16px ${CYAN}60` }} />
        </motion.div>

        {/* Bento grid — 4 columns, first 2 cards span 2 each (VB MENA pattern) */}
        <div className="otsf-themes-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}>
          {STRATEGIC_THEMES.map((theme, i) => {
            const isLarge = i < 2;
            const accentRgba = i % 2 === 0 ? "rgba(211,75,154," : "rgba(0,201,255,";

            return (
              <motion.div
                key={theme.title}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="otsf-theme-card"
                style={{
                  gridColumn: isLarge ? "span 2" : "span 1",
                  borderRadius: 20,
                  background: `linear-gradient(145deg, ${accentRgba}0.06), rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.15) 100%)`,
                  boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accentRgba}0.08)`,
                  border: "none",
                  overflow: "hidden",
                  position: "relative",
                  transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Liquid glass inner panel */}
                <div style={{
                  margin: 4,
                  borderRadius: 17,
                  padding: isLarge ? "clamp(28px, 3vw, 40px)" : "clamp(20px, 2vw, 28px)",
                  background: "rgba(10,14,42,0.65)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: isLarge ? 160 : 120,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}>
                  {/* Glass reflection line */}
                  <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

                  {/* Refraction glow */}
                  <div className="otsf-theme-refract" style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse 60% 60% at 30% 30%, ${accentRgba}0.06), transparent 70%)`,
                    pointerEvents: "none",
                  }} />

                  {/* Watermark number */}
                  <span style={{
                    position: "absolute",
                    top: isLarge ? 20 : 12,
                    right: isLarge ? 28 : 16,
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: isLarge ? 64 : 48,
                    color: `${accentRgba}0.08)`,
                    letterSpacing: "-2px",
                    lineHeight: 1,
                    pointerEvents: "none",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Left accent bar */}
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    bottom: "20%",
                    width: 3,
                    borderRadius: 2,
                    background: `linear-gradient(to bottom, ${accentRgba}0.6), ${accentRgba}0.15))`,
                    boxShadow: `0 0 12px ${accentRgba}0.3)`,
                  }} />

                  {/* Title */}
                  <span style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: isLarge ? 19 : 17,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1.4,
                    position: "relative",
                    paddingLeft: 12,
                    maxWidth: isLarge ? 440 : undefined,
                  }}>
                    {theme.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SPEAKERS SECTION ───────────────────────────────────────────────────────
function SpeakersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  // Mobile-only: gently auto-scroll the speakers row (ping-pong), pause on touch.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 768px)");
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let paused = false;
    let dir = 1;
    let resumeTimer: ReturnType<typeof setTimeout>;
    let started = false;
    const speed = 0.5; // px per frame

    const active = () => mq.matches && !reduceMq.matches;

    const step = () => {
      if (started && active() && !paused) {
        el.scrollLeft += speed * dir;
        const max = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= max - 1) dir = -1;
        else if (el.scrollLeft <= 0) dir = 1;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // Small delay so card entrance animations settle before motion starts
    const startTimer = setTimeout(() => { started = true; }, 1600);

    const pause = () => { paused = true; clearTimeout(resumeTimer); };
    const resume = () => { clearTimeout(resumeTimer); resumeTimer = setTimeout(() => { paused = false; }, 1600); };

    // Keep pagination dots in sync with scroll position
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      const frac = max > 0 ? el.scrollLeft / max : 0;
      setActiveDot(Math.round(frac * SPEAKERS.length));
    };

    el.addEventListener("pointerdown", pause);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });
    el.addEventListener("pointerup", resume);
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(startTimer);
      clearTimeout(resumeTimer);
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
      el.removeEventListener("pointerup", resume);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToDot = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (i / Math.max(1, SPEAKERS.length)) * max, behavior: "smooth" });
  };

  return (
    <section ref={ref} id="speakers" style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 40% 60% at 80% 50%, ${C}08, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Leadership</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: "0 0 16px" }}>
            Featured <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Speakers</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0, maxWidth: 600 }}>
            Industry leaders shaping the conversation on industrial cyber resilience across South Africa and the continent.
          </p>
        </motion.div>

        <div ref={trackRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }} className="otsf-speakers-grid">
          {SPEAKERS.map((speaker, i) => {
            const accent = i % 2 === 0 ? C_BRIGHT : CYAN;
            const accentRgb = i % 2 === 0 ? "232,107,184" : "0,201,255";
            return (
              <motion.div
                key={speaker.name}
                initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(6px)" }}
                animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.75, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Tilt max={6}>
                  <div className="otsf-speaker-card" style={{ position: "relative", transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}>
                    {/* Ambient accent glow behind card */}
                    <div className="otsf-speaker-glow" style={{
                      position: "absolute",
                      inset: -20,
                      borderRadius: 34,
                      background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(${accentRgb},0.18) 0%, transparent 70%)`,
                      filter: "blur(22px)",
                      opacity: 0.55,
                      pointerEvents: "none",
                      transition: "opacity 0.55s ease",
                    }} />

                    {/* Outer metallic gradient bezel */}
                    <div style={{
                      position: "relative",
                      padding: 2,
                      borderRadius: 24,
                      background: `linear-gradient(135deg, rgba(${accentRgb},0.65) 0%, rgba(${accentRgb},0.2) 15%, rgba(255,255,255,0.14) 32%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.12) 68%, rgba(${accentRgb},0.2) 85%, rgba(${accentRgb},0.55) 100%)`,
                      boxShadow: `0 28px 64px rgba(0,0,0,0.5), 0 0 45px rgba(${accentRgb},0.16), 0 0 0 1px rgba(255,255,255,0.03)`,
                    }}>
                      {/* Inner highlight ring */}
                      <div style={{
                        position: "absolute",
                        inset: 2,
                        borderRadius: 22,
                        pointerEvents: "none",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.04)",
                        zIndex: 3,
                      }} />

                      <div style={{
                        position: "relative",
                        borderRadius: 22,
                        overflow: "hidden",
                        background: "linear-gradient(165deg, rgba(22,26,54,0.96) 0%, rgba(12,14,34,0.98) 50%, rgba(8,10,26,1) 100%)",
                        display: "flex",
                        flexDirection: "column",
                      }}>
                        {/* Hover shine sweep */}
                        <div className="otsf-speaker-shine" style={{
                          position: "absolute",
                          top: 0,
                          left: "-80%",
                          width: "60%",
                          height: "100%",
                          background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.12) 50%, transparent)",
                          transform: "skewX(-20deg)",
                          pointerEvents: "none",
                          transition: "left 1s cubic-bezier(0.22, 1, 0.36, 1)",
                          zIndex: 4,
                        }} />

                        {/* Photo section */}
                        <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden" }}>
                          {speaker.photo ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={speaker.photo}
                                alt={`${speaker.name}, ${speaker.title} at ${speaker.org}`}
                                loading="lazy"
                                width={400}
                                height={500}
                                className="otsf-speaker-photo"
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  objectPosition: "top center",
                                  filter: "saturate(0.92) contrast(1.08) brightness(0.98)",
                                  transition: "transform 1s cubic-bezier(0.22,1,0.36,1), filter 0.5s ease",
                                }}
                              />
                            </>
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, rgba(${accentRgb},0.18), rgba(${accentRgb},0.04))` }}>
                              <span style={{ fontFamily: "var(--font-display)", fontSize: 72, fontWeight: 800, color: `${accent}30`, letterSpacing: "-2px" }}>
                                {speaker.name.split(" ").map(n => n[0]).join("")}
                              </span>
                            </div>
                          )}
                          {/* Bottom fade */}
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 0%, transparent 35%, rgba(8,10,26,0.55) 70%, rgba(8,10,26,0.96) 100%)", pointerEvents: "none" }} />
                          {/* Top vignette */}
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(180deg, rgba(8,10,26,0.4) 0%, transparent 100%)", pointerEvents: "none" }} />
                          {/* Accent wash */}
                          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(${accentRgb},0.14) 0%, transparent 50%, rgba(${accentRgb},0.1) 100%)`, mixBlendMode: "overlay", pointerEvents: "none" }} />
                          {/* Film grain */}
                          <div style={{ position: "absolute", inset: 0, opacity: 0.06, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px 180px", pointerEvents: "none" }} />
                          {/* Top reflection */}
                          <div style={{ position: "absolute", top: 0, left: "6%", right: "6%", height: 1, background: `linear-gradient(90deg, transparent, ${accent}dd, transparent)`, boxShadow: `0 0 16px ${accent}90`, pointerEvents: "none" }} />
                          {/* Inner photo frame */}
                          <div style={{ position: "absolute", inset: 8, border: "1px solid rgba(255,255,255,0.04)", borderRadius: 14, pointerEvents: "none" }} />

                          {/* Name + title overlaid at bottom of photo */}
                          <div style={{ position: "absolute", left: 20, right: 20, bottom: 18 }}>
                            <h3 style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              fontSize: "clamp(17px, 1.4vw, 21px)",
                              color: "white",
                              margin: 0,
                              letterSpacing: "-0.4px",
                              lineHeight: 1.15,
                              textShadow: "0 2px 18px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.75)",
                            }}>
                              {speaker.name}
                            </h3>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 9, marginTop: 6 }}>
                              <span style={{ width: 14, height: 1, background: accent, boxShadow: `0 0 8px ${accent}`, marginTop: 7, flexShrink: 0 }} />
                              <span style={{
                                fontFamily: "var(--font-outfit)",
                                fontSize: 11.5,
                                fontWeight: 500,
                                color: "rgba(255,255,255,0.82)",
                                letterSpacing: "0.2px",
                                lineHeight: 1.35,
                                textShadow: "0 1px 8px rgba(0,0,0,0.85)",
                              }}>
                                {speaker.title}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Accent hairline divider */}
                        <div style={{ position: "relative", height: 1, background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.55), transparent)`, boxShadow: `0 0 14px rgba(${accentRgb},0.4)` }} />

                        {/* Info panel — glassmorphism */}
                        <div style={{
                          position: "relative",
                          padding: "16px 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          background: "linear-gradient(180deg, rgba(14,18,42,0.55) 0%, rgba(8,10,26,0.75) 100%)",
                          backdropFilter: "blur(20px) saturate(1.3)",
                          WebkitBackdropFilter: "blur(20px) saturate(1.3)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                          minHeight: 60,
                        }}>
                          {/* Top reflection */}
                          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", pointerEvents: "none" }} />

                          {/* Organization */}
                          <div style={{ display: "flex", alignItems: "center", gap: 9, flex: 1, minWidth: 0 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                              <path d="M3 21h18M3 7l9-4 9 4M4 21V10m4 11v-7a2 2 0 012-2h4a2 2 0 012 2v7m4 0V10" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span style={{
                              fontFamily: "var(--font-outfit)",
                              fontSize: 12,
                              fontWeight: 500,
                              color: "rgba(255,255,255,0.72)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}>
                              {speaker.org}
                            </span>
                          </div>

                          {/* LinkedIn orb button */}
                          {speaker.linkedin && (
                            <a
                              href={speaker.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${speaker.name} on LinkedIn`}
                              className="otsf-speaker-li"
                              style={{
                                position: "relative",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 38,
                                height: 38,
                                borderRadius: "50%",
                                flexShrink: 0,
                                background: `
                                  radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22) 0%, transparent 35%),
                                  linear-gradient(155deg, ${accent} 0%, rgba(${accentRgb},0.5) 45%, rgba(${accentRgb},0.22) 100%)
                                `,
                                border: `1px solid rgba(${accentRgb},0.8)`,
                                boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.08), 0 6px 14px rgba(${accentRgb},0.35), 0 0 22px rgba(${accentRgb},0.2)`,
                                textDecoration: "none",
                                transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                                overflow: "hidden",
                              }}
                            >
                              <span style={{ position: "absolute", top: 2, left: "22%", right: "22%", height: "38%", background: "radial-gradient(ellipse at center top, rgba(255,255,255,0.5), transparent 70%)", pointerEvents: "none", borderRadius: "50%" }} />
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ position: "relative", filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.4))" }}>
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            );
          })}

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 + SPEAKERS.length * 0.08, ease: EASE }}
          >
            <div
              className="otsf-speaker-card"
              style={{
                borderRadius: 24,
                overflow: "hidden",
                background: `linear-gradient(135deg, ${C}12, ${C}04)`,
                border: `1px solid ${C}20`,
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                height: "100%",
                minHeight: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center", padding: 32 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: C_BRIGHT, display: "block", marginBottom: 8 }}>+</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", margin: "0 0 6px" }}>More Speakers</h3>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>Coming soon</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pagination dots — mobile carousel only */}
        <div className="otsf-speakers-dots" aria-hidden>
          {Array.from({ length: SPEAKERS.length + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToDot(i)}
              aria-label={`Go to speaker ${i + 1}`}
              className={`otsf-speakers-dot${activeDot === i ? " is-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── EVENT SNAPSHOT ──────────────────────────────────────────────────────────
function EventSnapshotSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: "15%", left: "-5%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${C}12 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}10 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "clamp(28px, 3.5vw, 44px)" }}
        >
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>At a Glance</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1, letterSpacing: "-2px", color: "white", margin: "0 0 14px" }}>
            Event <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Snapshot</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 120, height: 3, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, transparent)`, margin: "0 auto", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px ${C}80` }}
          />
        </motion.div>

        <div className="otsf-snapshot-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {EVENT_SNAPSHOT.map((item, i) => {
            const accent = i % 2 === 0 ? C_BRIGHT : CYAN;
            const accentRgba = i % 2 === 0 ? "rgba(232,107,184," : "rgba(0,201,255,";
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
                animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="otsf-snapshot-card"
                style={{
                  position: "relative",
                  padding: 2,
                  borderRadius: 22,
                  background: `linear-gradient(145deg, ${accentRgba}0.22) 0%, rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.15) 100%)`,
                  boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 14px 40px rgba(0,0,0,0.4), 0 0 0 1px ${accentRgba}0.1)`,
                  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease",
                }}
              >
                <div style={{
                  position: "relative",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.04)",
                  padding: "clamp(22px, 2.2vw, 28px)",
                  minHeight: "clamp(190px, 15vw, 230px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}>
                  {/* Background photo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={`${item.stat} ${item.label} from previous EFG editions`}
                    loading="lazy"
                    width={480}
                    height={320}
                    className="otsf-snapshot-img"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "saturate(0.85) contrast(1.08) brightness(0.95)",
                      transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1), filter 0.5s ease",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Stronger bottom-weighted vignette */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(7,11,31,0.35) 0%, rgba(7,11,31,0.55) 45%, rgba(7,11,31,0.92) 80%, rgba(7,11,31,0.98) 100%)", pointerEvents: "none" }} />

                  {/* Accent color wash */}
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${accentRgba}0.28) 0%, transparent 50%, ${accentRgba}0.22) 100%)`, mixBlendMode: "overlay", pointerEvents: "none" }} />

                  {/* Film grain noise */}
                  <div style={{ position: "absolute", inset: 0, opacity: 0.08, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px 180px", pointerEvents: "none" }} />

                  {/* Glass reflection line */}
                  <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${accent}aa, transparent)`, boxShadow: `0 0 12px ${accent}80`, pointerEvents: "none" }} />

                  {/* Corner chip — subtle event-series tag */}
                  <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 7 }}>
                    <span className="otsf-snapshot-pulse" style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: accent,
                      boxShadow: `0 0 8px ${accent}, 0 0 16px ${accent}80`,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "var(--font-dm)",
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.72)",
                      textTransform: "uppercase",
                      letterSpacing: "2.5px",
                      textShadow: "0 1px 6px rgba(0,0,0,0.8)",
                    }}>
                      Past Edition
                    </span>
                  </div>

                  {/* Bottom content stack */}
                  <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Stat number */}
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "clamp(42px, 4.6vw, 60px)",
                      letterSpacing: "-2px",
                      lineHeight: 0.95,
                      color: "white",
                      textShadow: `0 2px 20px rgba(0,0,0,0.8), 0 0 38px ${accent}55`,
                    }}>
                      {item.stat}
                    </span>

                    {/* Hairline accent rule */}
                    <div style={{
                      height: 1,
                      width: 30,
                      background: `linear-gradient(90deg, ${accent}, ${accent}30)`,
                      boxShadow: `0 0 10px ${accent}80`,
                    }} />

                    {/* Label */}
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.94)",
                      letterSpacing: "0.2px",
                      textShadow: "0 1px 8px rgba(0,0,0,0.75)",
                    }}>
                      {item.label}
                    </span>
                  </div>

                  {/* Bottom accent bar */}
                  <div className="otsf-snapshot-bar" style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: 2,
                    width: "34%",
                    background: `linear-gradient(90deg, ${accent}, ${accent}66 60%, transparent)`,
                    boxShadow: `0 0 14px ${accent}`,
                    transition: "width 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                  }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── WHO SHOULD ATTEND ───────────────────────────────────────────────────────
function WhoShouldAttend() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const groups: { key: keyof typeof WHO_ATTEND; label: string; accent: string; accentRgba: string; icon: string; span: number }[] = [
    {
      key: "executive",
      label: "Executive Leadership",
      accent: C_BRIGHT,
      accentRgba: "rgba(232,107,184,",
      icon: "M12 2l2.8 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6 3.5 1.5-6.8L2.3 9l6.9-.7z",
      span: 2,
    },
    {
      key: "otSecurity",
      label: "OT Security & Cybersecurity",
      accent: CYAN,
      accentRgba: "rgba(0,201,255,",
      icon: "M12 2l8 3v6c0 5.2-3.4 9.7-8 11-4.6-1.3-8-5.8-8-11V5l8-3zm0 6a3 3 0 00-3 3v2H9v4h6v-4h-.5v-2a3 3 0 00-2.5-3z",
      span: 1,
    },
    {
      key: "opsEngineering",
      label: "Operations & Engineering",
      accent: C_BRIGHT,
      accentRgba: "rgba(232,107,184,",
      icon: "M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3c0 .4 0 .8-.1 1.2l2.1 1.6-2 3.4-2.4-1a7 7 0 01-2 1.2L14.5 21h-5l-.4-2.6a7 7 0 01-2-1.2l-2.4 1-2-3.4 2-1.6a7 7 0 010-2.4l-2-1.6 2-3.4 2.4 1a7 7 0 012-1.2L9.5 3h5l.4 2.6a7 7 0 012 1.2l2.4-1 2 3.4-2 1.6c.1.4.1.8.1 1.2z",
      span: 1,
    },
    {
      key: "riskCompliance",
      label: "Risk & Compliance",
      accent: CYAN,
      accentRgba: "rgba(0,201,255,",
      icon: "M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5zm-1 14l-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z",
      span: 1,
    },
    {
      key: "government",
      label: "Government & Public Sector",
      accent: C_BRIGHT,
      accentRgba: "rgba(232,107,184,",
      icon: "M3 21h18v-2H3v2zM5 9v8h2V9H5zm6 0v8h2V9h-2zm6 0v8h2V9h-2zM12 2L2 7v2h20V7L12 2z",
      span: 1,
    },
  ];

  return (
    <section ref={ref} style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: "10%", right: "-5%", width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}12 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", left: "-5%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${C}10 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "clamp(28px, 3.5vw, 44px)" }}
        >
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Designed For</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1, letterSpacing: "-2px", color: "white", margin: "0 0 14px" }}>
            Who This Forum{" "}
            <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Is Built For</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 120, height: 3, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, transparent)`, margin: "0 auto 14px", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px ${C}80` }}
          />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.45)" }}>
            Five leadership tracks gathering at one table — from boardrooms to control rooms.
          </span>
        </motion.div>

        {/* Attendee groups — bento: Executive spans 2, rest are single cells */}
        <div className="otsf-who-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "stretch", gridAutoRows: "min-content" }}>
          {groups.map((group, gi) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.7, delay: 0.15 + gi * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="otsf-who-card"
              style={{
                gridColumn: `span ${group.span}`,
                position: "relative",
                padding: 1.5,
                borderRadius: 24,
                background: `linear-gradient(145deg, ${group.accentRgba}0.55) 0%, ${group.accentRgba}0.18) 18%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.02) 65%, ${group.accentRgba}0.35) 100%)`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${group.accentRgba}0.12), 0 0 0 1px rgba(255,255,255,0.03)`,
                transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease",
              }}
            >
              <div style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: 22.5,
                overflow: "hidden",
                background: `linear-gradient(160deg, rgba(20,26,64,0.62) 0%, rgba(10,14,42,0.7) 50%, rgba(7,11,31,0.78) 100%)`,
                backdropFilter: "blur(28px) saturate(1.25)",
                WebkitBackdropFilter: "blur(28px) saturate(1.25)",
                boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 30px 60px -30px ${group.accentRgba}0.25)`,
                padding: "clamp(22px, 2.2vw, 28px)",
                display: "flex",
                flexDirection: "column",
              }}>
                {/* Liquid glass — top highlight strip */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 50, background: `linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 100%)`, pointerEvents: "none" }} />

                {/* Glass reflection line (sharp) */}
                <div style={{ position: "absolute", top: 0, left: "6%", right: "6%", height: 1, background: `linear-gradient(90deg, transparent, ${group.accent}cc, transparent)`, boxShadow: `0 0 14px ${group.accent}80`, pointerEvents: "none" }} />

                {/* Refraction glow — top-left */}
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 50% at 20% 15%, ${group.accentRgba}0.14), transparent 70%)`, pointerEvents: "none" }} />

                {/* Refraction glow — bottom-right accent */}
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 50% at 85% 90%, ${group.accentRgba}0.1), transparent 60%)`, pointerEvents: "none" }} />

                {/* Ghost number */}
                <span style={{
                  position: "absolute",
                  bottom: -18,
                  right: 8,
                  fontFamily: "var(--font-display)",
                  fontSize: 150,
                  fontWeight: 900,
                  lineHeight: 0.85,
                  letterSpacing: "-7px",
                  color: "transparent",
                  WebkitTextStroke: `1px ${group.accent}18`,
                  textShadow: `0 0 40px ${group.accent}08`,
                  pointerEvents: "none",
                  userSelect: "none",
                }}>
                  {String(gi + 1).padStart(2, "0")}
                </span>

                {/* Header — liquid glass icon tile + title */}
                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                  <div className="otsf-who-icon" style={{
                    position: "relative",
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `linear-gradient(145deg, ${group.accent}55 0%, ${group.accent}22 45%, ${group.accent}0f 100%)`,
                    border: `1px solid ${group.accent}66`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.25), 0 6px 16px ${group.accentRgba}0.3), 0 0 24px ${group.accentRgba}0.18)`,
                    overflow: "hidden",
                  }}>
                    {/* Icon tile inner highlight */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.2), transparent)", pointerEvents: "none" }} />
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ filter: `drop-shadow(0 0 6px ${group.accent})`, position: "relative" }}>
                      <path d={group.icon} />
                    </svg>
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(15px, 1.35vw, 18px)",
                    color: "white",
                    margin: 0,
                    letterSpacing: "-0.3px",
                    lineHeight: 1.2,
                    textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                  }}>
                    {group.label}
                  </h3>
                </div>

                {/* Hairline divider */}
                <div style={{
                  position: "relative",
                  height: 1,
                  width: "100%",
                  background: `linear-gradient(90deg, ${group.accent}66, ${group.accent}15 55%, transparent)`,
                  marginBottom: 16,
                  boxShadow: `0 1px 0 rgba(0,0,0,0.2)`,
                }} />

                {/* Role list */}
                <div className={group.span === 2 ? "otsf-who-roles-2col" : "otsf-who-roles"} style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: group.span === 2 ? "1fr 1fr" : "1fr",
                  gap: "9px 18px",
                }}>
                  {WHO_ATTEND[group.key].map((role) => (
                    <div key={role} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{
                        position: "relative",
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${group.accent}30 0%, transparent 65%)`,
                        flexShrink: 0,
                        marginTop: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                          <path d="M9 18l6-6-6-6" stroke={group.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 400, color: "rgba(255,255,255,0.8)", lineHeight: 1.45 }}>
                        {role}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom accent bar */}
                <div className="otsf-who-bar" style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: 2,
                  width: "26%",
                  background: `linear-gradient(90deg, ${group.accent}, ${group.accent}66 60%, transparent)`,
                  boxShadow: `0 0 14px ${group.accent}, 0 0 24px ${group.accent}80`,
                  transition: "width 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                }} />

                {/* Hover shine sweep */}
                <div className="otsf-who-shine" style={{
                  position: "absolute",
                  top: 0,
                  left: "-60%",
                  width: "50%",
                  height: "100%",
                  background: `linear-gradient(100deg, transparent, rgba(255,255,255,0.08) 50%, transparent)`,
                  transform: "skewX(-20deg)",
                  pointerEvents: "none",
                  transition: "left 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
                }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Target Industries — premium chips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: "clamp(28px, 3.5vw, 44px)", textAlign: "center" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${CYAN})` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 10.5, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px" }}>Target Industries</span>
            <span style={{ width: 40, height: 1, background: `linear-gradient(270deg, transparent, ${CYAN})` }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 960, margin: "0 auto" }}>
            {TARGET_INDUSTRIES.map((ind, i) => {
              const chipAccent = i % 2 === 0 ? CYAN : C_BRIGHT;
              const chipRgba = i % 2 === 0 ? "rgba(0,201,255," : "rgba(232,107,184,";
              return (
                <motion.span
                  key={ind}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.7 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="otsf-industry-chip"
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "1.5px",
                    borderRadius: 999,
                    background: `linear-gradient(135deg, ${chipRgba}0.5) 0%, ${chipRgba}0.15) 30%, rgba(255,255,255,0.06) 55%, ${chipRgba}0.35) 100%)`,
                    boxShadow: `0 8px 20px rgba(0,0,0,0.35), 0 0 18px ${chipRgba}0.14)`,
                    cursor: "default",
                    transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                    overflow: "hidden",
                  }}
                >
                  <span style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "9px 17px",
                    borderRadius: 999,
                    background: `linear-gradient(160deg, rgba(20,26,64,0.65) 0%, rgba(10,14,42,0.72) 100%)`,
                    backdropFilter: "blur(18px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(18px) saturate(1.2)",
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.04)`,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.92)",
                    letterSpacing: "0.2px",
                    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }}>
                    {/* Top reflection */}
                    <span style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${chipAccent}aa, transparent)`, pointerEvents: "none" }} />
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: chipAccent,
                      boxShadow: `0 0 8px ${chipAccent}, 0 0 14px ${chipAccent}66`,
                      flexShrink: 0,
                    }} />
                    {ind}
                  </span>
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── EVENT SPONSORS 2026 ────────────────────────────────────────────────────
// Current-event sponsors, grouped by tier. As more sign on, append to this
// list with the appropriate `tier` and render tiers will populate
// automatically (strategic at the top, then platinum / gold / supporting).
const EVENT_SPONSORS_2026: {
  name: string;
  logo: string;
  url?: string;
  tier: "strategic" | "platinum" | "gold" | "supporting" | "media";
  scale?: number;        // multiplier on the tier's default logo height
  keepColor?: boolean;   // skip the brightness(0) invert(1) white treatment
  lightBg?: boolean;     // render a white inner panel (for logos with dark text)
}[] = [
  {
    name: "Waterfall Security Solutions",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/Waterfall_logo_white.png",
    url: "https://waterfall-security.com/",
    tier: "strategic",
    keepColor: true,
  },
  {
    name: "Fortress Hub Technologies",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Fortress+Hub+Technologies+Ltd+PNG.png",
    url: "https://www.fortresshubtechnologies.com/",
    tier: "strategic",
    keepColor: true,
    scale: 2.1,
  },
  {
    name: "Corrserve",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/corrserve1.png",
    url: "https://corrserve.co.za/",
    tier: "gold",
    keepColor: true,
  },
  {
    name: "Seceon",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Seceon-PNG-Security+for+Eons-Green+Logo.png",
    url: "https://seceon.com/",
    tier: "gold",
    keepColor: true,
    scale: 1.3,
  },
  {
    name: "Forescout",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/forescout.png",
    url: "https://www.forescout.com/",
    tier: "gold",
    keepColor: true,
  },
  {
    name: "Keysight",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Keysight1.png",
    url: "https://www.keysight.com/us/en/home.html",
    tier: "gold",
    keepColor: true,
    scale: 1.45,
  },
  {
    name: "Fortinet",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Fortinet-logo-rgb-white-red.png",
    url: "https://www.fortinet.com/",
    tier: "gold",
    keepColor: true,
    scale: 1.3,
  },
  {
    name: "Times of AI",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/Timesofai-02.png",
    url: "https://timesofai.com/",
    tier: "media",
    scale: 1.55,
  },
  {
    name: "CapitalBayNews",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/CapitalbaynewsLogo.svg",
    url: "https://www.capitalbay.news/",
    tier: "media",
    keepColor: true,
  },
  {
    name: "Times of Blockchain",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/Times-OF-Blockchain-1.svg",
    url: "https://www.timesofblockchain.com/",
    tier: "media",
  },
  {
    name: "TEX Afrika Media",
    logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/tex_afrika_media.png",
    url: "https://www.texafrica.com/",
    tier: "media",
    keepColor: true,
  },
];

const TIER_LABEL: Record<typeof EVENT_SPONSORS_2026[number]["tier"], string> = {
  strategic: "Strategic Sponsor",
  platinum: "Platinum Sponsors",
  gold: "Gold Sponsors",
  supporting: "Supporting Sponsors",
  media: "Media Partners",
};

function EventSponsorsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const tiers: (keyof typeof TIER_LABEL)[] = ["gold", "strategic", "platinum", "supporting", "media"];
  const activeTiers = tiers.filter((t) => EVENT_SPONSORS_2026.some((s) => s.tier === t));

  if (activeTiers.length === 0) return null;

  return (
    <section ref={ref} id="event-sponsors" style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative" }}>
      {/* Ambient accent glows */}
      <div style={{ position: "absolute", top: "20%", left: "-5%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}10 0%, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "-5%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${C}10 0%, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ marginBottom: 48, textAlign: "center" }}
        >
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>
            2026 Sponsors
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: "0 0 16px" }}>
            Backed by industry{" "}
            <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              leaders
            </span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 auto", maxWidth: 600 }}>
            The organisations powering OT Security First Africa 2026.
          </p>
        </motion.div>

        {/* Tier groups */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(40px, 5vw, 64px)" }}>
          {activeTiers.map((tier, tIdx) => {
            const sponsorsInTier = EVENT_SPONSORS_2026.filter((s) => s.tier === tier);
            const isStrategic = tier === "strategic";
            // Strategic tier renders one prominent centered card; lower tiers
            // render as multi-column grids so they read as "rows of sponsors".
            const isGold = tier === "gold";
            const cols = isStrategic ? Math.min(sponsorsInTier.length, 2) : Math.min(sponsorsInTier.length, 4);
            const cardMaxWidth = isStrategic ? 360 : isGold ? 320 : 240;

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.15 + tIdx * 0.1, ease: EASE }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
              >
                {/* Tier label */}
                {(() => {
                  const tierAccent = isStrategic ? C_BRIGHT : isGold ? "#E8B845" : CYAN;
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${tierAccent})` }} />
                      <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: tierAccent, textTransform: "uppercase", letterSpacing: "4px" }}>
                        {TIER_LABEL[tier]}
                      </span>
                      <span style={{ width: 28, height: 1, background: `linear-gradient(270deg, transparent, ${tierAccent})` }} />
                    </div>
                  );
                })()}

                {/* Sponsor cards — gold renders as balanced 3+2 centered rows */}
                {(isGold
                  ? [sponsorsInTier.slice(0, 3), sponsorsInTier.slice(3)].filter((r) => r.length > 0)
                  : [sponsorsInTier]
                ).map((rowSponsors, rowIdx) => (
                <div
                  key={rowIdx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${isGold ? rowSponsors.length : cols}, minmax(180px, ${cardMaxWidth}px))`,
                    gap: 20,
                    justifyContent: "center",
                    width: "100%",
                  }}
                  className="otsf-event-sponsors-grid"
                >
                  {rowSponsors.map((sponsor, i) => {
                    const GOLD = "#E8B845";
                    const GOLD_RGB = "232,184,69";
                    const accent = isStrategic
                      ? C_BRIGHT
                      : isGold
                        ? GOLD
                        : (i % 2 === 0 ? CYAN : C_BRIGHT);
                    const accentRgb = isStrategic
                      ? "232,107,184"
                      : isGold
                        ? GOLD_RGB
                        : (i % 2 === 0 ? "0,201,255" : "232,107,184");
                    const padding = isStrategic
                      ? "clamp(22px, 2.4vw, 32px) clamp(24px, 2.6vw, 36px)"
                      : isGold
                        ? "clamp(28px, 3.2vw, 40px) clamp(24px, 2.6vw, 36px)"
                        : "clamp(20px, 2.4vw, 28px) clamp(18px, 2vw, 24px)";
                    const logoHeight = isStrategic
                      ? "clamp(64px, 7vw, 96px)"
                      : isGold
                        ? "clamp(56px, 6vw, 84px)"
                        : "clamp(40px, 4.5vw, 60px)";

                    const inner = (
                      <div className="otsf-event-sponsor-wrap" style={{ position: "relative" }}>
                        {/* Ambient outer glow — blurs freely without being clipped */}
                        <div
                          className="otsf-event-sponsor-glow"
                          aria-hidden
                          style={{
                            position: "absolute",
                            inset: -20,
                            borderRadius: 36,
                            background: `radial-gradient(ellipse 75% 60% at 50% 50%, rgba(${accentRgb},0.22) 0%, transparent 70%)`,
                            filter: "blur(26px)",
                            opacity: 0.55,
                            pointerEvents: "none",
                            transition: "opacity 0.55s ease",
                            zIndex: 0,
                          }}
                        />

                        {/* ── Outer skeu plinth — display tray under the bezel. Gives the
                              card a "mounted on a surface" feel rather than floating flat.
                              Polished dark base with a raised rim light + carved underside. */}
                        <div
                          className="otsf-event-sponsor-plinth"
                          style={{
                            position: "relative",
                            zIndex: 1,
                            padding: isStrategic ? 8 : 6,
                            borderRadius: 26,
                            background: `linear-gradient(180deg, rgba(28,30,58,0.95) 0%, rgba(14,16,38,1) 100%)`,
                            boxShadow: `
                              0 1.5px 0 0 rgba(255,255,255,0.08) inset,
                              0 -1.5px 0 0 rgba(0,0,0,0.55) inset,
                              0 0 0 1px rgba(255,255,255,0.04) inset,
                              0 28px 70px rgba(0,0,0,0.55),
                              0 8px 24px rgba(0,0,0,0.4),
                              0 0 48px rgba(${accentRgb},0.18)
                            `,
                            transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease",
                            overflow: "visible",
                          }}
                        >
                          {/* Plinth top-edge specular catch */}
                          <span aria-hidden style={{
                            position: "absolute",
                            top: 1,
                            left: "14%",
                            right: "14%",
                            height: 1,
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45) 50%, transparent)",
                            pointerEvents: "none",
                            zIndex: 6,
                          }} />

                          {/* Embossed rivets at the plinth corners (strategic tier only) */}
                          {isStrategic && (
                            <>
                              {[
                                { top: 7, left: 7 },
                                { top: 7, right: 7 },
                                { bottom: 7, left: 7 },
                                { bottom: 7, right: 7 },
                              ].map((pos, idx) => (
                                <span
                                  key={`rivet-${idx}`}
                                  aria-hidden
                                  style={{
                                    position: "absolute",
                                    ...pos,
                                    width: 5,
                                    height: 5,
                                    borderRadius: "50%",
                                    background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0%, rgba(140,140,160,0.5) 30%, rgba(20,22,42,1) 100%)`,
                                    boxShadow: `0 1px 1px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(0,0,0,0.6), inset 0 0.5px 0 rgba(255,255,255,0.35)`,
                                    pointerEvents: "none",
                                    zIndex: 7,
                                  }}
                                />
                              ))}
                            </>
                          )}

                          {/* Metallic bezel — polished metal frame */}
                          <div
                            style={{
                              position: "relative",
                              padding: 1.5,
                              borderRadius: 20,
                              background: `linear-gradient(135deg, rgba(${accentRgb},0.7) 0%, rgba(${accentRgb},0.22) 18%, rgba(255,255,255,0.16) 38%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.14) 62%, rgba(${accentRgb},0.22) 82%, rgba(${accentRgb},0.65) 100%)`,
                              boxShadow: `0 0 0 1px rgba(0,0,0,0.45), 0 0 28px rgba(${accentRgb},0.18)`,
                              transition: "box-shadow 0.5s ease",
                            }}
                            className="otsf-event-sponsor-card"
                          >
                            {/* Inner specular highlight ring on the bezel */}
                            <div
                              aria-hidden
                              style={{
                                position: "absolute",
                                inset: 1.5,
                                borderRadius: 18,
                                pointerEvents: "none",
                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.05)",
                                zIndex: 3,
                              }}
                            />

                            {/* Recessed channel — thin dark groove between bezel and panel */}
                            <div
                              aria-hidden
                              style={{
                                position: "absolute",
                                inset: 1.5,
                                borderRadius: 18,
                                pointerEvents: "none",
                                boxShadow: `inset 0 0 0 1.5px rgba(0,0,0,0.55)`,
                                zIndex: 4,
                              }}
                            />

                            <div
                              style={{
                                position: "relative",
                                borderRadius: 18,
                                background: sponsor.lightBg
                                  ? `linear-gradient(165deg, #f8f0d8 0%, #efe3b9 35%, #e2d199 70%, #d4be7c 100%)`
                                  : `linear-gradient(165deg, rgba(18,22,52,0.96) 0%, rgba(12,14,34,0.98) 50%, rgba(8,10,26,1) 100%)`,
                                padding,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: isStrategic ? 130 : isGold ? 150 : 110,
                                overflow: "hidden",
                                // Embossed inset — panel reads as a plate pressed into the bezel
                                boxShadow: sponsor.lightBg
                                  ? `inset 0 2px 4px rgba(110,70,20,0.18), inset 0 -2px 2px rgba(255,238,180,0.55), inset 0 0 30px rgba(150,100,30,0.10)`
                                  : `inset 0 2px 4px rgba(0,0,0,0.5), inset 0 -2px 2px rgba(255,255,255,0.04), inset 0 0 30px rgba(0,0,0,0.35)`,
                              }}
                            >
                              {/* Hover shine sweep — diagonal bright bar that crosses on hover */}
                              <div
                                className="otsf-event-sponsor-shine"
                                aria-hidden
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: "-80%",
                                  width: "55%",
                                  height: "100%",
                                  background: sponsor.lightBg
                                    ? `linear-gradient(100deg, transparent, rgba(255,255,255,0.65) 50%, transparent)`
                                    : `linear-gradient(100deg, transparent, rgba(255,255,255,0.08) 50%, transparent)`,
                                  transform: "skewX(-22deg)",
                                  pointerEvents: "none",
                                  transition: "left 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
                                  zIndex: 4,
                                }}
                              />

                              {/* Top reflection line — bright brand-tinted hairline */}
                              <div aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg, transparent 8%, ${accent}dd 50%, transparent 92%)`, boxShadow: `0 0 14px ${accent}66`, pointerEvents: "none", zIndex: 5 }} />

                              {/* Top inner-edge specular hairline */}
                              <div aria-hidden style={{ position: "absolute", top: 2, left: "14%", right: "14%", height: 1, background: sponsor.lightBg ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 50%, transparent)" : "linear-gradient(90deg, transparent, rgba(255,255,255,0.32) 50%, transparent)", pointerEvents: "none", zIndex: 5 }} />

                              {/* Light-bg only — soft champagne pearl highlight at top */}
                              {sponsor.lightBg && (
                                <div aria-hidden style={{
                                  position: "absolute",
                                  top: 0, left: "12%", right: "12%",
                                  height: "40%",
                                  borderRadius: "50%",
                                  background: "linear-gradient(180deg, rgba(255,248,220,0.95) 0%, rgba(255,238,180,0.20) 60%, transparent 100%)",
                                  filter: "blur(8px)",
                                  pointerEvents: "none",
                                  zIndex: 1,
                                }} />
                              )}

                              {/* Light-bg only — warm bronze bottom edge shadow for depth */}
                              {sponsor.lightBg && (
                                <div aria-hidden style={{
                                  position: "absolute",
                                  bottom: 0, left: "8%", right: "8%",
                                  height: 1,
                                  background: "linear-gradient(90deg, transparent, rgba(110,70,20,0.32) 50%, transparent)",
                                  pointerEvents: "none",
                                  zIndex: 5,
                                }} />
                              )}

                              {/* Corner brackets — cinematic L-shapes (strategic tier only) */}
                              {isStrategic && (
                                <>
                                  {[
                                    { top: 12, left: 12, borderTop: true, borderLeft: true },
                                    { top: 12, right: 12, borderTop: true, borderRight: true },
                                    { bottom: 12, left: 12, borderBottom: true, borderLeft: true },
                                    { bottom: 12, right: 12, borderBottom: true, borderRight: true },
                                  ].map((pos, idx) => (
                                    <span
                                      key={idx}
                                      aria-hidden
                                      style={{
                                        position: "absolute",
                                        ...pos,
                                        width: 12,
                                        height: 12,
                                        borderTop: pos.borderTop ? `1.5px solid ${accent}99` : undefined,
                                        borderBottom: pos.borderBottom ? `1.5px solid ${accent}99` : undefined,
                                        borderLeft: pos.borderLeft ? `1.5px solid ${accent}99` : undefined,
                                        borderRight: pos.borderRight ? `1.5px solid ${accent}99` : undefined,
                                        pointerEvents: "none",
                                        zIndex: 5,
                                      }}
                                    />
                                  ))}
                                </>
                              )}

                              {/* Brushed-metal vertical micro-texture */}
                              <div
                                aria-hidden
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  opacity: sponsor.lightBg ? 0.14 : 0.08,
                                  mixBlendMode: "overlay",
                                  backgroundImage: sponsor.lightBg
                                    ? "repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)"
                                    : "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
                                  pointerEvents: "none",
                                  zIndex: 0,
                                }}
                              />

                              {/* Film grain — very faint */}
                              <div
                                aria-hidden
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  opacity: sponsor.lightBg ? 0.08 : 0.05,
                                  mixBlendMode: sponsor.lightBg ? "multiply" : "overlay",
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                                  backgroundSize: "180px 180px",
                                  pointerEvents: "none",
                                  zIndex: 0,
                                }}
                              />

                              {/* Logo — universal white treatment to match the dark card
                                  unless the sponsor has keepColor (original colors stay).
                                  `scale` enlarges the logo via transform so the layout box
                                  (and the card around it) stays the tier's default size. */}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={sponsor.logo}
                                alt={`${sponsor.name} logo`}
                                style={{
                                  maxHeight: logoHeight,
                                  maxWidth: "100%",
                                  height: logoHeight,
                                  width: "auto",
                                  objectFit: "contain",
                                  position: "relative",
                                  zIndex: 2,
                                  filter: sponsor.keepColor ? "none" : "brightness(0) invert(1)",
                                  transform: sponsor.scale ? `scale(${sponsor.scale})` : undefined,
                                  transformOrigin: "center",
                                }}
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );

                    // Sponsor name label rendered below the card — matches the
                    // VB MENA sponsor card pattern (centered, muted Outfit text).
                    const nameLabel = (
                      <div style={{
                        marginTop: 14,
                        textAlign: "center",
                        fontFamily: "var(--font-outfit)",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.4px",
                      }}>
                        {sponsor.name}
                      </div>
                    );

                    return sponsor.url ? (
                      <a key={sponsor.name} href={sponsor.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
                        {inner}
                        {nameLabel}
                      </a>
                    ) : (
                      <div key={sponsor.name}>
                        {inner}
                        {nameLabel}
                      </div>
                    );
                  })}
                </div>
                ))}
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .otsf-event-sponsor-plinth {
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease;
        }
        .otsf-event-sponsor-wrap:hover .otsf-event-sponsor-plinth {
          transform: translateY(-6px);
          box-shadow:
            0 1.5px 0 0 rgba(255,255,255,0.12) inset,
            0 -1.5px 0 0 rgba(0,0,0,0.6) inset,
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 38px 90px rgba(0,0,0,0.65),
            0 12px 32px rgba(0,0,0,0.5),
            0 0 70px rgba(232,107,184,0.32) !important;
        }
        .otsf-event-sponsor-wrap:hover .otsf-event-sponsor-glow {
          opacity: 0.9 !important;
        }
        .otsf-event-sponsor-wrap:hover .otsf-event-sponsor-shine {
          left: 130% !important;
        }
        @media (max-width: 768px) {
          .otsf-event-sponsors-grid {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── SPONSORS SECTION, Dual Marquee ─────────────────────────────────────────
function SponsorsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="sponsors" style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", textAlign: "center", marginBottom: 48 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C}30)` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px" }}>Past Series Sponsors & Partners</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C}30)` }} />
          </div>
        </motion.div>
      </div>

      {/* Row 1, scroll left */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to right, ${BG}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to left, ${BG}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
        <div className="otsf-marquee" style={{ display: "flex", gap: 40, animation: "otsf-scroll-left 70s linear infinite" }}>
          {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((logo, i) => (
            <div key={i} style={{ flexShrink: 0, height: 90, width: 190, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>
              <img src={logo} alt={`${(logo.split("/").pop() || "sponsor").replace(/\.[a-z]+$/i, "").replace(/[-_]/g, " ")} logo`} width={170} height={72} style={{ maxHeight: 72, maxWidth: 170, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2, scroll right */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to right, ${BG}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to left, ${BG}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
        <div className="otsf-marquee" style={{ display: "flex", gap: 40, animation: "otsf-scroll-right 80s linear infinite" }}>
          {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((logo, i) => (
            <div key={i} style={{ flexShrink: 0, height: 90, width: 190, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>
              <img src={logo} alt={`${(logo.split("/").pop() || "sponsor").replace(/\.[a-z]+$/i, "").replace(/[-_]/g, " ")} logo`} width={170} height={72} style={{ maxHeight: 72, maxWidth: 170, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FROM THE ROOM — OT Security Testimonials ──────────────────────────────
function OTShortCard({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      role={playing ? undefined : "button"}
      tabIndex={playing ? undefined : 0}
      aria-label={playing ? undefined : `Play testimonial: ${title}`}
      onClick={() => !playing && setPlaying(true)}
      onKeyDown={(e) => { if (!playing && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setPlaying(true); } }}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 19,
        overflow: "hidden",
        background: "rgba(7,11,31,0.95)",
        cursor: playing ? "default" : "pointer",
      }}
    >
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
            src={`https://img.youtube.com/vi/${videoId}/oar2.jpg`}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
            alt={title}
            width={360}
            height={640}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(7,11,31,0.1) 0%, rgba(7,11,31,0.1) 55%, rgba(7,11,31,0.55) 100%)", pointerEvents: "none" }} />
          {/* Play button */}
          <div className="otsf-short-play" style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={C} style={{ marginLeft: 2 }}>
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
          {/* Corner label */}
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span style={{
              display: "inline-block",
              padding: "4px 9px",
              borderRadius: 999,
              background: `linear-gradient(135deg, ${C}66 0%, ${C}33 100%)`,
              border: `1px solid ${C}66`,
              fontFamily: "var(--font-dm)",
              fontSize: 8,
              fontWeight: 700,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              backdropFilter: "blur(8px)",
            }}>OT Security</span>
          </div>
        </>
      )}
    </div>
  );
}

function OTTestimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: "20%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}14 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C}12 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "clamp(28px, 3.5vw, 44px)" }}
        >
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Testimonials</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 14px", lineHeight: 1 }}>
            From the{" "}
            <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${CYAN} 0%, ${C_BRIGHT} 45%, ${CYAN} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Room</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 120, height: 3, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, transparent)`, margin: "0 auto 16px", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px ${C}80` }}
          />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.45)", letterSpacing: "0.3px" }}>Hear directly from OT security leaders who attended our summits.</span>
        </motion.div>

        {/* Staggered showcase — 5 vertical cards, alternating tall/short, center hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="otsf-testi-showcase"
        >
          {OT_SHORTS.map((v, i) => (
            <div key={v.id} className={`otsf-testi-slot otsf-testi-slot-${i % 2 === 0 ? "tall" : "short"} ${i === 2 ? "otsf-testi-slot-hero" : ""}`}>
              <div style={{
                width: "100%", height: "100%", padding: 3, borderRadius: 22,
                background: `linear-gradient(145deg, rgba(${i % 2 === 0 ? "0,201,255" : "232,107,184"},0.18) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 70%, rgba(${i % 2 === 0 ? "232,107,184" : "0,201,255"},0.12) 100%)`,
                boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 -2px 0 rgba(0,0,0,0.3) inset, 0 14px 44px rgba(0,0,0,0.45)`,
              }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: 19, overflow: "hidden",
                  background: `linear-gradient(180deg, rgba(13,18,51,0.95) 0%, rgba(7,11,31,0.98) 100%)`,
                  border: "1px solid rgba(255,255,255,0.04)",
                  boxShadow: `inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.03)`,
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", zIndex: 3, pointerEvents: "none" }} />
                  <OTShortCard videoId={v.id} title={v.title} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginTop: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}
        >
          <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${CYAN}55)` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "2px", textTransform: "uppercase" }}>
            5 Voices · OT Security First Series
          </span>
          <div style={{ width: 32, height: 1, background: `linear-gradient(270deg, transparent, ${CYAN}55)` }} />
        </motion.div>
      </div>
    </section>
  );
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────
function GallerySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Atmosphere</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: 0 }}>
            From Previous <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Editions</span>
          </h2>
        </motion.div>

        <div
          className="otsf-gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "240px 210px 210px",
            gap: 16,
            gridTemplateAreas: `"hero hero a" "b c d" "e f g"`,
          }}
        >
          {GALLERY.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: EASE }}
              className="otsf-gallery-item"
              style={{
                gridArea: img.area,
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
                transform: img.rotate ? `rotate(${img.rotate}deg)` : undefined,
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                width={800}
                height={600}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,10,12,0.78) 0%, rgba(8,10,12,0.15) 45%, transparent 70%)", pointerEvents: "none" }} />
              {/* Label */}
              <div
                className="otsf-gallery-label"
                style={{
                  position: "absolute",
                  left: "clamp(12px, 1.4vw, 18px)",
                  right: "clamp(12px, 1.4vw, 18px)",
                  bottom: "clamp(12px, 1.4vw, 16px)",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "white",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                }}>
                  {img.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AWARDS SECTION ──────────────────────────────────────────────────────────
function AwardsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [formState, setFormState] = useState({ name: "", email: "", company: "", title: "", category: "", phone: "", countryIdx: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!formState.name.trim()) errs.name = "Required";
    if (!formState.email.trim()) errs.email = "Required";
    else if (!isWorkEmail(formState.email)) errs.email = "Please use your work email";
    if (!formState.category) errs.category = "Please select a category";
    if (Object.keys(errs).length) return setErrors(errs);

    setSubmitting(true);
    try {
      await submitForm({
        type: "awards" as FormType,
        full_name: formState.name,
        email: formState.email,
        company: formState.company,
        job_title: formState.title,
        phone: formState.phone ? `${COUNTRY_CODES[formState.countryIdx].code}${formState.phone}` : "",
        event_name: "OT Security First Johannesburg 2026, Awards",
        website: "",
        metadata: { award_category: formState.category },
      });
      setSubmitted(true);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="awards" style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: "15%", left: "-5%", width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, ${C}14 0%, transparent 70%)`, filter: "blur(70px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "-5%", width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}10 0%, transparent 70%)`, filter: "blur(70px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "clamp(28px, 3.5vw, 44px)" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT})` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4.5px" }}>The Awards</span>
            <span style={{ width: 40, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1, letterSpacing: "-2px", color: "white", margin: "0 0 14px" }}>
            OT Security First{" "}
            <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Awards Africa</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 120, height: 3, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, transparent)`, margin: "0 auto 14px", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px ${C}` }}
          />
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(14px, 1.1vw, 16px)", fontWeight: 400, color: "rgba(255,255,255,0.55)", maxWidth: 600, margin: "0 auto", lineHeight: 1.55 }}>
            Five categories celebrating organisations and leaders driving OT security excellence across the continent.
          </p>
        </motion.div>

        {/* Categories — 5 numbered entries above the container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "clamp(28px, 3.5vw, 44px)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 28 }}>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT})` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 10.5, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px" }}>Five Categories</span>
            <span style={{ width: 40, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>

          <div className="otsf-awards-cats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "clamp(28px, 4vw, 56px)", rowGap: 2 }}>
            {AWARDS_DATA.map((award, i) => {
              const accent = i % 2 === 0 ? C_BRIGHT : CYAN;
              return (
                <motion.div
                  key={award.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="otsf-award-row"
                  style={{
                    position: "relative",
                    padding: "18px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    transition: "padding-left 0.45s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 12,
                      fontWeight: 700,
                      color: accent,
                      letterSpacing: "1.5px",
                      minWidth: 24,
                      fontVariantNumeric: "tabular-nums",
                      textShadow: `0 0 10px ${accent}55`,
                    }}>
                      0{i + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(14px, 1.2vw, 16.5px)",
                        fontWeight: 600,
                        color: "white",
                        margin: "0 0 4px",
                        letterSpacing: "-0.2px",
                        lineHeight: 1.3,
                      }}>
                        {award.title}
                      </h4>
                      <p style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 12.5,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.5)",
                        margin: 0,
                        lineHeight: 1.55,
                      }}>
                        {award.desc}
                      </p>
                    </div>
                  </div>
                  <div className="otsf-award-sliver" style={{
                    position: "absolute",
                    left: 0,
                    top: "28%",
                    bottom: "28%",
                    width: 2,
                    background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
                    boxShadow: `0 0 8px ${accent}`,
                    opacity: 0,
                    transition: "opacity 0.45s ease",
                  }} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Unified gradient-bordered container wrapping both cards (Web Summit style) */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            padding: 2,
            borderRadius: 28,
            background: `linear-gradient(135deg, ${C_BRIGHT} 0%, ${C_BRIGHT}88 15%, ${CYAN}66 40%, rgba(255,255,255,0.08) 55%, ${CYAN}88 75%, ${CYAN} 100%)`,
            boxShadow: `0 28px 70px rgba(0,0,0,0.5), 0 0 60px ${C}22, 0 0 40px ${CYAN}14`,
          }}
        >
          <div className="otsf-awards-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderRadius: 26,
            overflow: "hidden",
            background: BG,
          }}>
            {/* Left — pure photo card (no text overlay) */}
            <div className="otsf-awards-photo" style={{
              position: "relative",
              minHeight: 620,
              overflow: "hidden",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${S3}/Good/4N8A0200.JPG`}
                alt="OT Security First Awards Africa ceremony — honouring industrial cybersecurity excellence"
                loading="lazy"
                width={720}
                height={900}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "saturate(0.95) contrast(1.1) brightness(0.95)",
                  pointerEvents: "none",
                }}
              />
              {/* Subtle bottom vignette */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 0%, transparent 55%, rgba(7,11,31,0.45) 100%)", pointerEvents: "none" }} />
              {/* Accent tint */}
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C}14 0%, transparent 50%, ${CYAN}10 100%)`, mixBlendMode: "overlay", pointerEvents: "none" }} />
              {/* Corner chip */}
              <div style={{ position: "absolute", bottom: 22, left: 22, display: "flex", alignItems: "center", gap: 9, padding: "8px 14px", borderRadius: 999, background: "rgba(7,11,31,0.55)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1px solid rgba(255,255,255,0.12)` }}>
                <span className="otsf-awards-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 10px ${C_BRIGHT}, 0 0 18px ${C_BRIGHT}80` }} />
                <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "2.5px" }}>Honoring Excellence</span>
              </div>
            </div>

          {/* Right — Nomination form (liquid glass panel inside unified container) */}
          <div className="otsf-awards-form" style={{
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(160deg, rgba(20,26,64,0.5) 0%, rgba(10,14,42,0.65) 100%)",
              backdropFilter: "blur(24px) saturate(1.2)",
              WebkitBackdropFilter: "blur(24px) saturate(1.2)",
              boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.35)",
              padding: "clamp(32px, 3.5vw, 48px)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
            }}>
              {/* Top reflection */}
              <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg, transparent, ${CYAN}bb, transparent)`, boxShadow: `0 0 12px ${CYAN}80`, pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <span style={{ width: 28, height: 1, background: CYAN }} />
                <span style={{ fontFamily: "var(--font-dm)", fontSize: 10.5, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "3.5px" }}>Nominate</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "white", margin: "0 0 6px", letterSpacing: "-0.5px", position: "relative" }}>
                Nominate a Leader
              </h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, color: "rgba(255,255,255,0.55)", margin: "0 0 22px", lineHeight: 1.55, position: "relative" }}>
                Recognise the teams and individuals shaping industrial cyber resilience.
              </p>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{
                  padding: 28,
                  background: `linear-gradient(135deg, ${CYAN}12, ${CYAN}06)`,
                  border: `1px solid ${CYAN}30`,
                  borderRadius: 14,
                  textAlign: "center",
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: `linear-gradient(145deg, ${CYAN}55, ${CYAN}22)`,
                    border: `1px solid ${CYAN}66`,
                    boxShadow: `0 0 24px ${CYAN}55`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", margin: "0 0 6px" }}>Nomination submitted</h4>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0 }}>Thank you — we&apos;ll be in touch.</p>
                </motion.div>
              ) : (
                <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { key: "name", label: "Full Name", type: "text" },
                    { key: "email", label: "Work Email", type: "email" },
                    { key: "company", label: "Company / Organisation", type: "text" },
                    { key: "title", label: "Job Title", type: "text" },
                  ].map((field) => (
                    <div key={field.key}>
                      <input
                        type={field.type}
                        placeholder={field.label}
                        value={formState[field.key as keyof typeof formState] as string}
                        onChange={(e) => { setFormState((s) => ({ ...s, [field.key]: e.target.value })); setErrors((prev) => { const n = { ...prev }; delete n[field.key]; return n; }); }}
                        className="otsf-awards-input"
                        style={{
                          width: "100%",
                          padding: "14px 18px",
                          borderRadius: 12,
                          background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
                          border: `1px solid ${errors[field.key] ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                          color: "white",
                          fontFamily: "var(--font-outfit)",
                          fontSize: 14,
                          fontWeight: 400,
                          outline: "none",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.18)",
                          transition: "border-color 0.3s, box-shadow 0.3s, background 0.3s",
                        }}
                      />
                      {errors[field.key] && <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "#ef4444", marginTop: 6, display: "block" }}>{errors[field.key]}</span>}
                    </div>
                  ))}

                  {/* Category dropdown */}
                  <div style={{ position: "relative" }}>
                    <select
                      value={formState.category}
                      onChange={(e) => { setFormState((s) => ({ ...s, category: e.target.value })); setErrors((prev) => { const n = { ...prev }; delete n.category; return n; }); }}
                      className="otsf-awards-input otsf-awards-select"
                      style={{
                        width: "100%",
                        padding: "14px 44px 14px 18px",
                        borderRadius: 12,
                        background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
                        border: `1px solid ${errors.category ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                        color: formState.category ? "white" : "rgba(255,255,255,0.38)",
                        fontFamily: "var(--font-outfit)",
                        fontSize: 14,
                        fontWeight: 400,
                        outline: "none",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.18)",
                        transition: "border-color 0.3s, box-shadow 0.3s, background 0.3s",
                        appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="" disabled style={{ background: "#0a0e2a", color: "rgba(255,255,255,0.5)" }}>Award Category</option>
                      {AWARDS_DATA.map((award, i) => (
                        <option key={award.title} value={award.title} style={{ background: "#0a0e2a", color: "white" }}>
                          0{i + 1} · {award.title}
                        </option>
                      ))}
                    </select>
                    {/* Custom chevron */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                    >
                      <path d="M6 9l6 6 6-6" stroke={CYAN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {errors.category && <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "#ef4444", marginTop: 6, display: "block" }}>{errors.category}</span>}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="otsf-awards-submit"
                    style={{
                      position: "relative",
                      padding: "15px 32px",
                      borderRadius: 50,
                      background: `linear-gradient(135deg, ${CYAN} 0%, ${C_BRIGHT} 100%)`,
                      color: "#0A0A0A",
                      fontFamily: "var(--font-outfit)",
                      fontSize: 14.5,
                      fontWeight: 700,
                      border: "none",
                      cursor: submitting ? "wait" : "pointer",
                      opacity: submitting ? 0.7 : 1,
                      letterSpacing: "0.3px",
                      boxShadow: `0 10px 28px ${CYAN}45, 0 0 24px ${C}30, inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)`,
                      transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                      marginTop: 8,
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ position: "relative", zIndex: 2 }}>{submitting ? "Submitting..." : "Submit Nomination"}</span>
                  </button>
                  {errors.form && <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "#ef4444" }}>{errors.form}</span>}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONTACT SECTION ─────────────────────────────────────────────────────────
function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Flatten contacts so each person gets their own card
  const people = [
    { ...CONTACTS.speaking, category: "Speaking" },
    ...CONTACTS.sponsorship.map((c) => ({ ...c, category: "Sponsorship" })),
  ];

  const initials = (name: string) => name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <section ref={ref} id="contact" style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: "10%", left: "-5%", width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}12 0%, transparent 70%)`, filter: "blur(70px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, ${C}10 0%, transparent 70%)`, filter: "blur(70px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "clamp(28px, 3.5vw, 44px)" }}
        >
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Meet Your Team</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1, letterSpacing: "-2px", color: "white", margin: "0 0 14px" }}>
            Get In{" "}
            <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Touch</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 120, height: 3, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, transparent)`, margin: "0 auto 14px", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px ${C}80` }}
          />
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: "0 auto", lineHeight: 1.55 }}>
            Real people, ready to help you with speaking and sponsorship enquiries.
          </p>
        </motion.div>

        {/* 3 portrait profile cards — photo top half, contact bottom half */}
        <div className="otsf-contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(18px, 2vw, 28px)" }}>
          {people.map((person, i) => {
            const accent = i % 2 === 0 ? C_BRIGHT : CYAN;
            const accentRgb = i % 2 === 0 ? "232,107,184" : "0,201,255";
            const mailHref = `mailto:${person.email}`;

            return (
              <motion.div
                key={person.email}
                initial={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(8px)" }}
                animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="otsf-contact-card"
                style={{
                  position: "relative",
                  transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Ambient accent glow behind card */}
                <div className="otsf-contact-glow" style={{
                  position: "absolute",
                  inset: -24,
                  borderRadius: 36,
                  background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(${accentRgb},0.2) 0%, transparent 70%)`,
                  filter: "blur(24px)",
                  opacity: 0.65,
                  pointerEvents: "none",
                  transition: "opacity 0.55s ease",
                }} />

                {/* Outer skeuomorphic gradient bezel — 2.5px metallic edge */}
                <div style={{
                  position: "relative",
                  padding: 2.5,
                  borderRadius: 26,
                  background: `
                    linear-gradient(135deg,
                      rgba(${accentRgb},0.7) 0%,
                      rgba(${accentRgb},0.22) 14%,
                      rgba(255,255,255,0.16) 30%,
                      rgba(255,255,255,0.02) 50%,
                      rgba(255,255,255,0.14) 70%,
                      rgba(${accentRgb},0.2) 86%,
                      rgba(${accentRgb},0.6) 100%)
                  `,
                  boxShadow: `
                    0 32px 72px rgba(0,0,0,0.55),
                    0 0 50px rgba(${accentRgb},0.18),
                    0 0 0 1px rgba(255,255,255,0.035)
                  `,
                }}>
                  {/* Inner highlight ring — sits just inside the bezel */}
                  <div style={{
                    position: "absolute",
                    inset: 2.5,
                    borderRadius: 23.5,
                    pointerEvents: "none",
                    boxShadow: `
                      inset 0 1px 0 rgba(255,255,255,0.12),
                      inset 0 -1px 0 rgba(0,0,0,0.5),
                      inset 0 0 0 1px rgba(255,255,255,0.04)
                    `,
                    zIndex: 3,
                  }} />

                  <div style={{
                    position: "relative",
                    borderRadius: 23.5,
                    overflow: "hidden",
                    background: "linear-gradient(165deg, rgba(22,26,54,0.96) 0%, rgba(12,14,34,0.98) 50%, rgba(8,10,26,1) 100%)",
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    {/* Hover shine sweep */}
                    <div className="otsf-contact-shine" style={{
                      position: "absolute",
                      top: 0,
                      left: "-80%",
                      width: "60%",
                      height: "100%",
                      background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.13) 50%, transparent)",
                      transform: "skewX(-20deg)",
                      pointerEvents: "none",
                      transition: "left 1s cubic-bezier(0.22, 1, 0.36, 1)",
                      zIndex: 4,
                    }} />

                    {/* Top portrait photo — framed */}
                    <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={person.photo}
                        alt={`${person.name}, ${person.title} at Events First Group`}
                        loading="lazy"
                        width={400}
                        height={500}
                        className="otsf-contact-photo"
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "top center",
                          filter: "saturate(0.92) contrast(1.08) brightness(0.98)",
                          transition: "transform 1s cubic-bezier(0.22,1,0.36,1), filter 0.5s ease",
                        }}
                      />
                      {/* Bottom fade into panel */}
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 0%, transparent 40%, rgba(8,10,26,0.5) 70%, rgba(8,10,26,0.95) 100%)", pointerEvents: "none" }} />
                      {/* Top vignette for pill legibility */}
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(180deg, rgba(8,10,26,0.45) 0%, transparent 100%)", pointerEvents: "none" }} />
                      {/* Accent color wash */}
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(${accentRgb},0.16) 0%, transparent 45%, rgba(${accentRgb},0.12) 100%)`, mixBlendMode: "overlay", pointerEvents: "none" }} />
                      {/* Film grain */}
                      <div style={{ position: "absolute", inset: 0, opacity: 0.06, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px 180px", pointerEvents: "none" }} />
                      {/* Top reflection */}
                      <div style={{ position: "absolute", top: 0, left: "6%", right: "6%", height: 1, background: `linear-gradient(90deg, transparent, ${accent}dd, transparent)`, boxShadow: `0 0 16px ${accent}90`, pointerEvents: "none" }} />
                      {/* Inner photo frame — subtle hairline just inside the edge */}
                      <div style={{ position: "absolute", inset: 8, border: "1px solid rgba(255,255,255,0.04)", borderRadius: 16, pointerEvents: "none" }} />

                      {/* Category pill — double-glass */}
                      <div style={{
                        position: "absolute",
                        top: 15,
                        left: 15,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        padding: 2,
                        borderRadius: 999,
                        background: `linear-gradient(135deg, rgba(${accentRgb},0.75) 0%, rgba(${accentRgb},0.25) 50%, rgba(${accentRgb},0.55) 100%)`,
                        boxShadow: `0 6px 18px rgba(0,0,0,0.4), 0 0 20px rgba(${accentRgb},0.28)`,
                      }}>
                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 7,
                          padding: "6px 14px",
                          borderRadius: 999,
                          background: "rgba(7,11,31,0.78)",
                          backdropFilter: "blur(16px) saturate(1.3)",
                          WebkitBackdropFilter: "blur(16px) saturate(1.3)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.25)",
                        }}>
                          <span className="otsf-contact-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}, 0 0 14px ${accent}88` }} />
                          <span style={{ fontFamily: "var(--font-dm)", fontSize: 9.5, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.95)" }}>{person.category}</span>
                        </div>
                      </div>

                      {/* Name + title overlaid at bottom of photo */}
                      <div style={{ position: "absolute", left: 22, right: 22, bottom: 20 }}>
                        <h3 style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "clamp(20px, 1.7vw, 26px)",
                          color: "white",
                          margin: 0,
                          letterSpacing: "-0.5px",
                          lineHeight: 1.1,
                          textShadow: "0 2px 18px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.75)",
                        }}>
                          {person.name}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 8 }}>
                          <span style={{ width: 18, height: 1, background: accent, boxShadow: `0 0 8px ${accent}` }} />
                          <span style={{
                            fontFamily: "var(--font-outfit)",
                            fontSize: 11.5,
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.82)",
                            letterSpacing: "0.3px",
                            textShadow: "0 1px 8px rgba(0,0,0,0.85)",
                          }}>
                            {person.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Divider — accent hairline */}
                    <div style={{ position: "relative", height: 1, background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.55), transparent)`, boxShadow: `0 0 14px rgba(${accentRgb},0.45)` }} />

                    {/* Bottom contact panel — glassmorphism */}
                    <div style={{
                      position: "relative",
                      padding: "18px 22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      background: `linear-gradient(180deg, rgba(14,18,42,0.55) 0%, rgba(8,10,26,0.75) 100%)`,
                      backdropFilter: "blur(20px) saturate(1.3)",
                      WebkitBackdropFilter: "blur(20px) saturate(1.3)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.25)",
                    }}>
                      {/* Inner reflection line at top of panel */}
                      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", pointerEvents: "none" }} />

                      {/* Email link */}
                      <a href={mailHref} className="otsf-contact-link" style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        flex: 1,
                        minWidth: 0,
                        fontFamily: "var(--font-outfit)",
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.78)",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                        overflow: "hidden",
                      }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, filter: `drop-shadow(0 0 4px ${accent}66)` }}>
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{person.email}</span>
                      </a>

                      {/* WhatsApp orb button — premium skeuomorphic sphere */}
                      <a
                        href={`https://wa.me/${person.phone.replace(/[^\d]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${person.name}`}
                        className="otsf-contact-wa"
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: `
                            radial-gradient(circle at 30% 25%, rgba(255,255,255,0.24) 0%, transparent 35%),
                            linear-gradient(155deg, ${accent} 0%, rgba(${accentRgb},0.55) 45%, rgba(${accentRgb},0.25) 100%)
                          `,
                          border: `1px solid rgba(${accentRgb},0.85)`,
                          boxShadow: `
                            inset 0 1.5px 0 rgba(255,255,255,0.35),
                            inset 0 -2px 4px rgba(0,0,0,0.3),
                            inset 0 0 0 1px rgba(255,255,255,0.08),
                            0 8px 18px rgba(${accentRgb},0.35),
                            0 0 28px rgba(${accentRgb},0.22)
                          `,
                          textDecoration: "none",
                          transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                          overflow: "hidden",
                        }}
                      >
                        {/* Specular top highlight */}
                        <span style={{ position: "absolute", top: 2, left: "22%", right: "22%", height: "38%", background: "radial-gradient(ellipse at center top, rgba(255,255,255,0.5), transparent 70%)", pointerEvents: "none", borderRadius: "50%" }} />
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="white" style={{ position: "relative", filter: `drop-shadow(0 1px 4px rgba(0,0,0,0.4))` }}>
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.15-.174.2-.298.3-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── VENUE SECTION ───────────────────────────────────────────────────────────
function VenueSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="venue" style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 50% at 50% 80%, ${C}06, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", textAlign: "center", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Location</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: "0 0 16px" }}>
            Johannesburg,<br /><span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>South Africa</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 40px" }}>
            Venue announcement coming soon. The event will take place in Johannesburg, South Africa&apos;s economic capital and gateway to the continent.
          </p>

          <div style={{ padding: "40px 32px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 16 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "white", marginBottom: 8 }}>Venue TBD</h3>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0 }}>
              Premium venue in Johannesburg , details to be announced
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=Johannesburg+South+Africa"
            target="_blank"
            rel="noopener noreferrer"
            className="otsf-maps-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 28px",
              borderRadius: 16,
              background: `linear-gradient(135deg, ${C}, ${CYAN})`,
              color: "white",
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: `0 4px 20px ${C}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
              transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
              marginTop: 32,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            View Johannesburg on Map
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── AGENDA ──────────────────────────────────────────────────────────────────
// Verbatim conference program (source: Johannesburg agenda doc). Do not alter copy.
type JhbAgendaRow = {
  time: string;
  type: "keynote" | "panel" | "fireside" | "break" | "awards";
  title: string;
  desc?: string;
  bullets?: string[];
  moderator?: string;
  panelists?: string[];
};
type JhbAgendaTrack = { label: string; time: string; rows: JhbAgendaRow[] };

const JHB_AGENDA_TRACKS: JhbAgendaTrack[] = [
  {
    label: "Regulation, Standards, & Public Private Collaboration, Governance",
    time: "08:00 – 11:15",
    rows: [
      { time: "08:00 – 9:00", type: "break", title: "Registration, Networking, and Refreshments" },
      { time: "09:05 – 09:10", type: "keynote", title: "Welcome Remarks" },
      { time: "09:10 – 09:15", type: "keynote", title: "National Anthem and Opening Ceremony" },
      { time: "09:15 – 09:30", type: "keynote", title: "Opening Keynote", desc: "The State of OT Security in Africa 2026" },
      {
        time: "09:30 – 10:00",
        type: "panel",
        title: "Leadership Panel",
        desc: "Making OT Security a National Priority - Harmonizing Regulatory Mandates, Public-Private Trust, and Crisis Response\nAligning board level governance, strict regional regulatory standards, and practical crisis readiness to guarantee corporate and operational resilience",
        bullets: [
          "Translating frameworks from paperwork into verifiable engineering controls",
          "Overcoming trust barriers to share active threat indicators and incident insights with regional authorities and industry peers",
          "Constructing localized crisis management playbooks that prioritize physical safety, environmental protection, and uptime",
          "Business Continuity Under Fire to minimize financial and reputational fallout",
        ],
        panelists: [
          "Len De Villiers, Group CTIO, Eskom Holdings",
          "Nthabiseng Mosupye, CTIO, Rand Water",
          "Cathy Leso, CIO, Department of Mineral Resources",
          "Reserved for Keysight / Forescout",
        ],
      },
      { time: "10:00 – 10:15", type: "fireside", title: "Fireside Chat", desc: "IT/OT Convergence Without Losing Control - Integrating the SOC\nHow to converge monitoring while respecting the realities of process safety and uptime" },
      { time: "10:15 – 10:30", type: "fireside", title: "Technology Presentation", desc: "TBC\nReserved for Keysight / Forescout" },
      { time: "10:30 – 11:15", type: "break", title: "Networking Break and Refreshments" },
    ],
  },
  {
    label: "Emerging Technologies - Legacy Retrofitting & Hardening",
    time: "11:15 – 14:30",
    rows: [
      {
        time: "11:15 – 11:45",
        type: "panel",
        title: "Panel Discussion",
        desc: "Beyond the Air Gap: Implementing Zero Trust and Network Visibility in Legacy ICS Environments\nUnpacking the architectural realities of modernizing heavy industrial infrastructure without inducing operational downtime.",
        bullets: [
          "Pragmatic strategies for applying modern cryptographic identities and network access controls",
          "The Visibility Baseline: Moving from “blind spots” to complete asset clarity",
          "Micro-Segmentation in Practice: Definition and enforcement",
          "Continuous Authentication",
        ],
        moderator: "Xolani Nzimande, OT Cybersecurity Specialist, Sasol",
        panelists: [
          "Reserved for Fortinet",
          "Renaldo J, Group Head of Cybersecurity, Globaleq",
        ],
      },
      { time: "11:45 – 12:00", type: "fireside", title: "Technology Presentation", desc: "TBC\nReserved for Fortinet" },
      { time: "12:00 – 12:15", type: "fireside", title: "Technology Presentation", desc: "TBC\nReserved for Corr-Serve / Seceon" },
      {
        time: "12:15 – 12:45",
        type: "panel",
        title: "Panel Discussion",
        desc: "The Core of Converged Defense: Scaling Unified IT/OT SOCs with AI and Emerging Tech\nExploring how organizations are utilizing artificial intelligence and unified monitoring architectures to proactively spot and contain industrial threats",
        bullets: [
          "Bridging the telemetry divide",
          "AI driven behavioural analytics",
          "Evaluating the real-world utility of innovations like digital twins",
          "The culture & workflow shift",
        ],
        panelists: [
          "Ishaaq Jacobs, CISO, Sasol",
          "Reserved for Corr-Serve / Seceon",
        ],
      },
      { time: "12:45 – 13:00", type: "fireside", title: "Technology Presentation", desc: "Passive Deep-Packet Asset Discovery: Eliminating Blind Spots Without Active Polling" },
      { time: "13:00 – 13:30", type: "break", title: "Networking Break and Refreshments" },
      {
        time: "13:30 – 14:00",
        type: "panel",
        title: "Panel Discussion",
        desc: "Securing the Industrial Ecosystem: Third-Party Risk, Supply Chain Integrity, and the OT Talent Crunch\nAddressing the vulnerabilities introduced by external suppliers and the human capital strategies required to manage modern industrial cyber risks",
        bullets: [
          "Mitigating third-party software and hardware component vulnerabilities",
          "Vendor Remote Access Control - Securing and auditing ephemeral remote maintenance gateways",
          "Cross killing the Workforce",
          "Retaining internal OT security expertise and leveraging managed services",
        ],
        panelists: [
          "Muvhango Livhusha, VP, ISACA South Africa Chapter",
          "Shane Naidoo, Executive Head of IT, Transnet",
        ],
      },
      { time: "14:00 – 14:15", type: "fireside", title: "Presentation", desc: "Cyber-attacks on Critical infrastructures: Understanding the Threat and Building resilience\nNaoufal Kerboute, Regional Director - Middle East and Africa, Waterfall Security" },
      { time: "14:15 – 14:30", type: "awards", title: "OT Security First Award Ceremony & Raffle Draw" },
      { time: "14:30", type: "break", title: "Networking Lunch and End of Conference" },
    ],
  },
];

function JhbAgendaTypeTag({ type }: { type: JhbAgendaRow["type"] }) {
  const map: Record<string, { label: string; color: string }> = {
    keynote: { label: "Keynote", color: C_BRIGHT },
    panel: { label: "Panel", color: CYAN },
    fireside: { label: "Fireside", color: C_BRIGHT },
    awards: { label: "Awards", color: "#E8B65C" },
    break: { label: "Break", color: "rgba(255,255,255,0.4)" },
  };
  const { label, color } = map[type] || map.fireside;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-outfit)",
        fontSize: 9.5,
        fontWeight: 700,
        letterSpacing: "1.4px",
        textTransform: "uppercase",
        color,
        background: `${color}14`,
        border: `1px solid ${color}38`,
        borderRadius: 100,
        padding: "4px 11px",
        lineHeight: 1.3,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function JhbAgendaRowItem({ row }: { row: JhbAgendaRow }) {
  if (row.type === "break") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px clamp(22px, 2.4vw, 30px)", borderRadius: 14, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: `${C_BRIGHT}99`, flexShrink: 0 }} />
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 14.5,
            fontWeight: 800,
            color: "#fff",
            background: `linear-gradient(135deg, ${C}40, ${C}22)`,
            border: `1px solid ${C}59`,
            borderRadius: 9,
            padding: "7px 14px",
            letterSpacing: "0.3px",
            whiteSpace: "nowrap",
            boxShadow: `0 2px 10px ${C}1f`,
          }}
        >
          {row.time}
        </span>
        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.55)" }}>{row.title}</span>
      </div>
    );
  }

  const lines = row.desc ? row.desc.split("\n") : [];
  return (
    <div style={{ padding: "24px clamp(26px, 2.8vw, 36px)", borderRadius: 16, background: "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 18px 50px rgba(0,0,0,0.32)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 15,
            fontWeight: 800,
            color: "#fff",
            background: `linear-gradient(135deg, ${C}40, ${C}22)`,
            border: `1px solid ${C}59`,
            borderRadius: 9,
            padding: "7px 14px",
            letterSpacing: "0.3px",
            whiteSpace: "nowrap",
            boxShadow: `0 2px 10px ${C}1f`,
          }}
        >
          {row.time}
        </span>
        <JhbAgendaTypeTag type={row.type} />
      </div>

      <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px, 1.3vw, 17px)", fontWeight: 700, color: "white", lineHeight: 1.32, letterSpacing: "-0.3px", margin: 0 }}>
        {row.title}
      </p>

      {lines.map((line, li) => (
        <p
          key={li}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: li === 0 ? 14 : 13,
            fontWeight: li === 0 ? 600 : 400,
            color: li === 0 ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.5)",
            lineHeight: 1.55,
            margin: li === 0 ? "8px 0 0" : "5px 0 0",
            fontStyle: li > 0 ? "italic" : "normal",
          }}
        >
          {line}
        </p>
      ))}

      {row.bullets && (
        <ul style={{ margin: "13px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
          {row.bullets.map((b, bi) => (
            <li key={bi} style={{ position: "relative", paddingLeft: 16, fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
              <span style={{ position: "absolute", left: 0, top: 7, width: 5, height: 5, borderRadius: "50%", background: CYAN, opacity: 0.8 }} />
              {b}
            </li>
          ))}
        </ul>
      )}

      {row.moderator && (
        <div style={{ marginTop: 13 }}>
          <span style={{ display: "block", fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: CYAN, marginBottom: 6 }}>Moderator</span>
          <p style={{ position: "relative", paddingLeft: 16, margin: 0, fontFamily: "var(--font-outfit)", fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
            <span style={{ position: "absolute", left: 0, top: 6, width: 6, height: 6, borderRadius: "50%", border: `1px solid ${CYAN}`, opacity: 0.8 }} />
            {row.moderator}
          </p>
        </div>
      )}

      {row.panelists && (
        <div style={{ marginTop: 13 }}>
          <span style={{ display: "block", fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: C_BRIGHT, marginBottom: 6 }}>Panelist</span>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {row.panelists.map((p, pi) => (
              <li key={pi} style={{ position: "relative", paddingLeft: 16, fontFamily: "var(--font-outfit)", fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                <span style={{ position: "absolute", left: 0, top: 6, width: 6, height: 6, borderRadius: "50%", border: `1px solid ${C_BRIGHT}`, opacity: 0.8 }} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AgendaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Flatten tracks into a single block list (track banners + rows), then split
  // at 12:00 so the two columns stay visually balanced.
  type Block =
    | { kind: "track"; n: number; label: string; time: string }
    | { kind: "row"; row: JhbAgendaRow };
  const blocks: Block[] = [];
  JHB_AGENDA_TRACKS.forEach((track, ti) => {
    blocks.push({ kind: "track", n: ti + 1, label: track.label, time: track.time });
    track.rows.forEach((row) => blocks.push({ kind: "row", row }));
  });
  const splitIdx = (() => {
    const i = blocks.findIndex((b) => b.kind === "row" && b.row.time.startsWith("12:00"));
    return i === -1 ? Math.ceil(blocks.length / 2) : i;
  })();
  const columns = [blocks.slice(0, splitIdx), blocks.slice(splitIdx)];

  return (
    <section ref={ref} id="agenda" style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "8%", left: "-5%", width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, ${C}10 0%, transparent 70%)`, filter: "blur(70px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "8%", right: "-5%", width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}10 0%, transparent 70%)`, filter: "blur(70px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: "clamp(36px, 4vw, 52px)" }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Agenda</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: "0 0 14px" }}>
            Conference{" "}
            <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Program</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, letterSpacing: "0.4px", color: "rgba(255,255,255,0.6)", margin: "0 0 14px" }}>
            27 August 2026 &nbsp;·&nbsp; Johannesburg, South Africa &nbsp;·&nbsp; 08:00 – 14:30
          </p>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(14px, 1.3vw, 16px)", fontWeight: 500, fontStyle: "italic", color: "rgba(255,255,255,0.45)", maxWidth: 620, margin: "0 auto", lineHeight: 1.6 }}>
            Uncompromised OT Security — Protecting what Powers our World
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="otsf-agenda-cols"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px, 3vw, 40px)", alignItems: "start" }}
        >
          {columns.map((col, ci) => (
            <div key={ci} style={{ display: "flex", flexDirection: "column", gap: "clamp(14px, 1.6vw, 18px)" }}>
              {col.map((block, bi) =>
                block.kind === "track" ? (
                  <div key={bi} style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C}3d`, background: `linear-gradient(120deg, ${C}38 0%, ${C}14 60%, rgba(13,18,51,0.5) 100%)`, padding: "18px clamp(22px, 2.6vw, 30px)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 4 }}>
                      <span style={{ fontFamily: "var(--font-dm)", fontSize: 10.5, fontWeight: 700, letterSpacing: "2.4px", textTransform: "uppercase", color: C_BRIGHT }}>Track {block.n}</span>
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.72)", whiteSpace: "nowrap" }}>{block.time}</span>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 1.6vw, 19px)", fontWeight: 700, color: "white", lineHeight: 1.3, letterSpacing: "-0.3px", margin: 0 }}>{block.label}</h3>
                  </div>
                ) : (
                  <JhbAgendaRowItem key={bi} row={block.row} />
                ),
              )}
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          style={{ fontFamily: "var(--font-outfit)", fontSize: 12.5, fontWeight: 500, fontStyle: "italic", color: "rgba(255,255,255,0.4)", textAlign: "center", margin: "clamp(30px, 4vw, 44px) 0 0" }}
        >
          Kindly note: this is a draft agenda and is subject to minor changes until 4 days prior to the conference.
        </motion.p>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .otsf-agenda-cols {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────
export default function OTSecurityFirstJohannesburg2026() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Honour shared/UTM links: ?tab=attend pre-selects the Attend tab in the
  // register form, and #register scrolls to the registration section on load.
  useEffect(() => {
    // Pre-select the InquiryForm tab from ?tab= (sales-rep links open "Attend").
    const tabParam = new URLSearchParams(window.location.search).get("tab");
    if (tabParam) {
      const tabKey = tabParam === "attend" ? "pass" : tabParam === "speak" ? "speaker" : tabParam;
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("efg:set-form-tab", { detail: tabKey }));
      }, 600);
    }

    // Scroll target: explicit #hash, or the register section when an attend/speak/sponsor
    // link is used (short rep links carry only ?tab=, no hash).
    const id = window.location.hash.replace("#", "") || (tabParam ? "register" : "");
    if (!id) return;

    // #register sits near the bottom; images + GSAP sections above it finish loading
    // after the first scroll and push it down, so the initial jump lands short. Re-align
    // a couple of times once the layout settles — but bail if the user takes over.
    let cancelled = false;
    const cancel = () => { cancelled = true; };
    const scrollNow = () => {
      const el = document.getElementById(id);
      if (!el) return false;
      const lenis = (window as unknown as {
        __lenis?: { scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number }) => void };
      }).__lenis;
      if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.1 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    };
    let tries = 0;
    const start = () => {
      if (!scrollNow()) {
        if (tries++ < 30) window.setTimeout(start, 150);
        return;
      }
      window.addEventListener("wheel", cancel, { passive: true, once: true });
      window.addEventListener("touchmove", cancel, { passive: true, once: true });
      window.setTimeout(() => { if (!cancelled) scrollNow(); }, 1300);
      window.setTimeout(() => { if (!cancelled) scrollNow(); }, 2600);
    };
    window.setTimeout(start, 500);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <EventNavigation />
      <main className="otsf-jhb-page" style={{
        background: `linear-gradient(160deg, ${BG_DARK} 0%, ${BG} 30%, #0c1030 60%, ${BG_CARD} 100%)`,
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Global liquid blobs + noise — position: fixed so the GPU only composites a viewport-sized layer (vs ~25,000px tall page).
            Promoted to its own composited layer via translateZ(0) + will-change so it isn't redrawn on every scroll frame. */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, willChange: "transform", transform: "translateZ(0)" }}>
          <div style={{ position: "absolute", top: "5%", right: "0%", width: 600, height: 600, borderRadius: "40% 60% 55% 45% / 55% 40% 60% 45%", background: `linear-gradient(135deg, ${C}22, ${CYAN}12, ${C}18)`, filter: "blur(50px)", opacity: 0.5 }} />
          <div style={{ position: "absolute", top: "30%", left: "-5%", width: 500, height: 500, borderRadius: "55% 45% 40% 60% / 45% 55% 45% 55%", background: `linear-gradient(225deg, ${CYAN}18, ${C}10, ${CYAN}1c)`, filter: "blur(60px)", opacity: 0.45 }} />
          <div style={{ position: "absolute", top: "65%", right: "5%", width: 550, height: 550, borderRadius: "45% 55% 60% 40% / 60% 45% 55% 45%", background: `linear-gradient(145deg, ${C}20, ${CYAN}10, ${C}16)`, filter: "blur(50px)", opacity: 0.4 }} />
          <div style={{ position: "absolute", bottom: "5%", left: "10%", width: 450, height: 450, borderRadius: "55% 45% 40% 60% / 45% 55% 45% 55%", background: `radial-gradient(circle, ${CYAN}15, transparent 70%)`, filter: "blur(60px)", opacity: 0.4 }} />
          {/* Noise */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.025, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "128px 128px" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <HeroSection />
          <AboutSection />
          <OTSfPostEventReports />
          <MarketDriversSection />
          <FocusAreas />
          <SpeakersSection />
          <EventSponsorsSection />
          <AgendaSection />
          <OTTestimonials />
          <EventSnapshotSection />
          <WhoShouldAttend />
          <SponsorsSection />
          <GallerySection />
          <AwardsSection />
          <section id="register" style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
            {/* Ambient orbs — match other sections */}
            <div style={{ position: "absolute", top: "10%", left: "-5%", width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}12 0%, transparent 70%)`, filter: "blur(70px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 440, height: 440, borderRadius: "50%", background: `radial-gradient(circle, ${C}10 0%, transparent 70%)`, filter: "blur(70px)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <InquiryForm defaultCountry="ZA" eventName="OT Security First Africa 2026" labelText="Join Us in Johannesburg" />
            </div>
          </section>
          <ContactSection />
          <VenueSection />
          <Footer />
        </div>
      </main>

      <style jsx global>{`
        /* ─── Scroll performance: skip rendering of offscreen sections.
              The browser uses the contain-intrinsic-size estimate while a section is
              far below the viewport, then renders it just before it scrolls into view.
              Hero stays normal so the LCP element renders instantly. ───────── */
        .otsf-jhb-page section {
          content-visibility: auto;
          contain-intrinsic-size: auto 800px;
        }
        .otsf-jhb-page > div > section:first-of-type {
          content-visibility: visible;
        }

        /* ─── Override InquiryForm for this page ─────────────────── */
        #register {
          --orange: ${C_BRIGHT};
          --orange-bright: ${C};
          --orange-glow: rgba(211,75,154,0.35);
        }
        #register #get-involved {
          background: transparent !important;
        }
        /* Active tab pill only — target by background property, not color */
        #register #get-involved button[style*="background: var(--orange)"],
        #register #get-involved button[style*="background:var(--orange)"] {
          background: linear-gradient(135deg, ${C_BRIGHT}, ${CYAN}) !important;
          border-color: transparent !important;
        }
        #register #get-involved button[type="submit"] {
          background: linear-gradient(135deg, ${C_BRIGHT}, ${CYAN}) !important;
          border: none !important;
        }
        #register #get-involved button[type="submit"]:hover {
          background: linear-gradient(135deg, ${C}, #4DD9FF) !important;
          box-shadow: 0 12px 40px rgba(211,75,154,0.3) !important;
        }
        #register #get-involved .flex.items-center.gap-3 > div:first-child {
          background: rgba(211,75,154,0.06) !important;
          border-color: rgba(211,75,154,0.12) !important;
        }
        #register #get-involved .inquiry-split > div:last-child > div {
          background: rgba(13,18,51,0.6) !important;
          border-color: rgba(211,75,154,0.08) !important;
        }
        #register #get-involved .flex.items-center.gap-3 > span:first-child {
          background: linear-gradient(90deg, ${C_BRIGHT}, ${CYAN}) !important;
        }

        /* ─── Animations ────────────────────────────────────────────── */
        @keyframes otsf-hero-shimmer {
          0%, 100% { background-position: 200% center; }
          50% { background-position: 0% center; }
        }
        .otsf-hero-shimmer { animation: otsf-hero-shimmer 6s ease-in-out infinite; }

        @keyframes otsf-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px ${C_BRIGHT}; }
          50% { opacity: 0.5; box-shadow: 0 0 16px ${C_BRIGHT}80; }
        }

        @keyframes otsf-scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes otsf-scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }


        /* ─── Glitch effect on counters ─────────────────────────────── */
        .otsf-glitch {
          animation: otsf-glitch-flicker 0.2s ease-out;
        }

        @keyframes otsf-glitch-flicker {
          0% { text-shadow: 2px 0 ${C_BRIGHT}, -2px 0 ${CYAN_DIM}; opacity: 0.8; }
          25% { text-shadow: -1px 0 ${C_BRIGHT}, 1px 0 ${CYAN_DIM}; opacity: 1; }
          50% { text-shadow: 1px 0 ${C_BRIGHT}, -1px 0 ${CYAN_DIM}; opacity: 0.9; }
          100% { text-shadow: none; opacity: 1; }
        }


        /* ─── CTA hover ─────────────────────────────────────────────── */
        .otsf-cta-primary:hover {
          background: linear-gradient(135deg, ${C_BRIGHT}, ${CYAN}) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 40px ${C}50 !important;
        }

        .otsf-cta-ghost:hover {
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(255,255,255,0.4) !important;
          transform: translateY(-2px) !important;
        }

        /* ─── Card hovers ───────────────────────────────────────────── */
        .otsf-stat-card:hover {
          transform: translateY(-4px);
          border-color: ${C}30 !important;
          background: rgba(255,255,255,0.05) !important;
        }

        .otsf-snapshot-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 22px 56px rgba(0,0,0,0.55), 0 0 40px ${C}22 !important;
        }
        .otsf-snapshot-card:hover .otsf-snapshot-bar {
          width: 100% !important;
        }
        .otsf-snapshot-card:hover .otsf-snapshot-img {
          transform: scale(1.06);
          filter: saturate(1.05) contrast(1.08) brightness(1.02) !important;
        }

        /* Designed For — card + chip hovers */
        .otsf-who-card {
          will-change: transform;
        }
        .otsf-who-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 28px 68px rgba(0,0,0,0.6), 0 0 50px ${C}28, 0 0 0 1px rgba(255,255,255,0.06) !important;
        }
        .otsf-who-card:hover .otsf-who-bar {
          width: 100% !important;
        }
        .otsf-who-card:hover .otsf-who-icon {
          transform: scale(1.08) rotate(-2deg);
        }
        .otsf-who-icon {
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .otsf-who-card:hover .otsf-who-shine {
          left: 130% !important;
        }

        .otsf-industry-chip:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 14px 32px rgba(0,0,0,0.45), 0 0 28px rgba(255,255,255,0.08) !important;
        }

        /* Awards — form inputs */
        .otsf-awards-input::placeholder {
          color: rgba(255,255,255,0.38);
        }
        .otsf-awards-input:hover {
          border-color: rgba(255,255,255,0.22) !important;
          background: linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%) !important;
        }
        .otsf-awards-input:focus {
          border-color: ${CYAN}aa !important;
          background: linear-gradient(160deg, rgba(0,201,255,0.08) 0%, rgba(0,201,255,0.02) 100%) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 3px ${CYAN}22, 0 0 18px ${CYAN}25 !important;
        }

        /* Awards — submit button with shine */
        .otsf-awards-submit::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.4) 50%, transparent);
          transform: skewX(-20deg);
          transition: left 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .otsf-awards-submit:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.015);
          box-shadow: 0 16px 40px ${CYAN}60, 0 0 36px ${C}45, inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.2) !important;
        }
        .otsf-awards-submit:hover:not(:disabled)::before {
          left: 140%;
        }
        .otsf-awards-submit:active:not(:disabled) {
          transform: translateY(0) scale(1);
        }

        /* Awards — category rows */
        .otsf-award-row:hover {
          padding-left: 14px !important;
        }
        .otsf-award-row:hover .otsf-award-sliver {
          opacity: 1 !important;
        }

        @keyframes otsf-awards-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.35); }
        }
        .otsf-awards-pulse {
          animation: otsf-awards-pulse 2.4s ease-in-out infinite;
        }

        @media (max-width: 960px) {
          .otsf-who-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .otsf-who-card {
            grid-column: span 1 !important;
          }
          .otsf-who-roles-2col {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .otsf-who-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @keyframes otsf-snapshot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.35); }
        }
        .otsf-snapshot-pulse {
          animation: otsf-snapshot-pulse 2.4s ease-in-out infinite;
        }

        .otsf-stat-premium:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${CYAN}18 !important;
        }

        .otsf-movement-cta:hover {
          transform: translateY(-4px);
          box-shadow: 0 36px 90px rgba(0,0,0,0.6), 0 16px 40px ${C}40, 0 0 80px ${CYAN}35, inset 0 1px 0 rgba(255,255,255,0.2) !important;
        }

        .otsf-driver-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${C}15 !important;
        }

        .otsf-driver-tab:hover {
          transform: translateX(4px);
        }
        .otsf-driver-tab:hover > div {
          background: linear-gradient(165deg, rgba(13,18,51,0.85), rgba(7,11,31,0.95)) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.25) !important;
        }

        .otsf-drivers-scroll::-webkit-scrollbar,
        .otsf-themes-scroll::-webkit-scrollbar {
          display: none;
        }

        /* Testimonials staggered showcase */
        .otsf-testi-showcase {
          display: flex;
          gap: 18px;
          align-items: center;
          justify-content: center;
        }
        .otsf-testi-slot {
          flex-shrink: 0;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .otsf-testi-slot:hover { transform: translateY(-10px); }
        .otsf-testi-slot-tall { width: 210px; height: 360px; }
        .otsf-testi-slot-short { width: 190px; height: 290px; }
        .otsf-testi-slot-hero.otsf-testi-slot-tall { width: 240px; height: 420px; }
        .otsf-testi-slot:hover .otsf-short-play {
          background: ${C} !important;
          transform: translate(-50%, -50%) scale(1.1);
          box-shadow: 0 10px 32px ${C}80, 0 0 0 1px rgba(255,255,255,0.25) !important;
        }
        .otsf-testi-slot:hover .otsf-short-play svg { fill: white !important; }

        @media (max-width: 960px) {
          .otsf-testi-showcase {
            flex-wrap: wrap;
            gap: 14px;
          }
          .otsf-testi-slot,
          .otsf-testi-slot-tall,
          .otsf-testi-slot-short,
          .otsf-testi-slot-hero.otsf-testi-slot-tall {
            width: calc(50% - 7px);
            height: 320px;
          }
        }
        @media (max-width: 520px) {
          .otsf-testi-slot,
          .otsf-testi-slot-tall,
          .otsf-testi-slot-short,
          .otsf-testi-slot-hero.otsf-testi-slot-tall {
            width: 100%;
            height: 360px;
          }
        }

        .otsf-theme-card {
          will-change: transform;
        }
        .otsf-theme-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 16px 48px rgba(0,0,0,0.5), 0 0 40px rgba(211,75,154,0.12) !important;
        }

        @media (max-width: 1024px) {
          .otsf-themes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .otsf-theme-card {
            grid-column: span 1 !important;
          }
        }

        @media (max-width: 900px) {
          .otsf-drivers-grid {
            grid-template-columns: 1fr !important;
          }
          .otsf-driver-slide,
          .otsf-theme-slide {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .otsf-about-split {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .otsf-about-text {
            align-items: center !important;
            text-align: center !important;
          }
          .otsf-about-underline {
            margin: 0 auto 24px !important;
            transform-origin: center !important;
          }
        }

        .otsf-about-video:hover .otsf-about-play-btn {
          background: ${C} !important;
          transform: scale(1.08);
          box-shadow: 0 12px 40px ${C}80, 0 0 0 1px rgba(255,255,255,0.3) !important;
        }
        .otsf-about-video:hover .otsf-about-play-btn svg {
          fill: white !important;
        }

        @media (max-width: 640px) {
          .otsf-themes-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .otsf-movement-content {
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }
          .otsf-movement-content > div:first-child {
            text-align: center !important;
            align-items: center !important;
          }
          .otsf-movement-content > div:first-child > div:first-child {
            align-self: center !important;
          }
          .otsf-movement-btn {
            justify-self: center !important;
          }
        }

        .otsf-stat-row:hover {
          transform: translateY(-4px);
          border-color: ${C}35 !important;
        }

        .otsf-industrial-card:hover {
          transform: translateY(-6px) !important;
          border-color: ${C}25 !important;
          box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 40px ${C}10;
        }

        .otsf-flip-card:hover .otsf-flip-inner {
          transform: rotateY(180deg) !important;
        }

        .otsf-flip-card:hover {
          transform: translateY(-6px) scale(1.02);
        }

        .otsf-speaker-card:hover {
          transform: translateY(-10px) !important;
        }
        .otsf-speakers-dots {
          display: none;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 22px;
        }
        .otsf-speakers-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: none;
          padding: 0;
          background: rgba(255,255,255,0.22);
          cursor: pointer;
          transition: width 0.3s ease, border-radius 0.3s ease, background 0.3s ease;
        }
        .otsf-speakers-dot.is-active {
          width: 22px;
          border-radius: 4px;
          background: linear-gradient(90deg, ${C_BRIGHT}, ${CYAN});
        }
        .otsf-speaker-card:hover .otsf-speaker-glow {
          opacity: 1 !important;
        }
        .otsf-speaker-card:hover .otsf-speaker-photo {
          transform: scale(1.06);
          filter: saturate(1.08) contrast(1.1) brightness(1.03) !important;
        }
        .otsf-speaker-card:hover .otsf-speaker-shine {
          left: 140% !important;
        }
        .otsf-speaker-li:hover {
          transform: translateY(-2px) scale(1.1);
          background:
            radial-gradient(circle at 30% 25%, rgba(255,255,255,0.32) 0%, transparent 40%),
            linear-gradient(155deg, #0A66C2 0%, #0852A0 50%, #054583 100%) !important;
          border-color: #0A66C2 !important;
          box-shadow:
            inset 0 1.5px 0 rgba(255,255,255,0.42),
            inset 0 -2px 4px rgba(0,0,0,0.25),
            inset 0 0 0 1px rgba(255,255,255,0.12),
            0 12px 26px rgba(10,102,194,0.5),
            0 0 36px rgba(10,102,194,0.35) !important;
        }
        .otsf-speaker-li:hover svg { filter: drop-shadow(0 0 8px rgba(255,255,255,0.8)) drop-shadow(0 1px 4px rgba(0,0,0,0.3)) !important; }

        @keyframes otsf-speaker-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.4); }
        }
        .otsf-speaker-pulse {
          animation: otsf-speaker-pulse 2.4s ease-in-out infinite;
        }

        .otsf-timeline-card:hover {
          border-color: ${C}20 !important;
          background: rgba(255,255,255,0.05) !important;
          transform: translateY(-3px);
        }

        .otsf-role-card:hover {
          border-color: rgba(255,255,255,0.12) !important;
          background: rgba(255,255,255,0.05) !important;
        }

        .otsf-award-card:hover {
          border-color: ${CYAN}20 !important;
          background: rgba(255,255,255,0.04) !important;
        }

        .otsf-contact-card {
          will-change: transform;
        }
        .otsf-contact-card:hover {
          transform: translateY(-10px);
        }
        .otsf-contact-card:hover .otsf-contact-glow {
          opacity: 1 !important;
        }
        .otsf-contact-card:hover .otsf-contact-photo {
          transform: scale(1.07);
          filter: saturate(1.1) contrast(1.1) brightness(1.03) !important;
        }
        .otsf-contact-card:hover .otsf-contact-shine {
          left: 140% !important;
        }
        .otsf-contact-link:hover {
          color: white !important;
          opacity: 1 !important;
        }
        .otsf-contact-wa:hover {
          transform: translateY(-3px) scale(1.12);
          background:
            radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35) 0%, transparent 40%),
            linear-gradient(155deg, #25D366 0%, #1DA851 50%, #128C7E 100%) !important;
          border-color: #2ff07a !important;
          box-shadow:
            inset 0 1.5px 0 rgba(255,255,255,0.45),
            inset 0 -2px 4px rgba(0,0,0,0.25),
            inset 0 0 0 1px rgba(255,255,255,0.15),
            0 14px 32px rgba(37,211,102,0.55),
            0 0 44px rgba(37,211,102,0.4) !important;
        }
        .otsf-contact-wa:hover svg { filter: drop-shadow(0 0 10px rgba(255,255,255,0.9)) drop-shadow(0 1px 4px rgba(0,0,0,0.3)) !important; }

        @keyframes otsf-contact-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.4); }
        }
        .otsf-contact-pulse {
          animation: otsf-contact-pulse 2.4s ease-in-out infinite;
        }

        .otsf-gallery-item:hover img {
          transform: scale(1.08) !important;
        }

        .otsf-maps-btn:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 8px 32px ${C}50, inset 0 1px 0 rgba(255,255,255,0.25) !important;
        }

        /* ─── Responsive ────────────────────────────────────────────── */
        @media (max-width: 1280px) {
          .otsf-flip-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 1024px) {
          .otsf-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .otsf-flip-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .otsf-who-grid,
          .otsf-awards-grid {
            grid-template-columns: 1fr !important;
          }
          .otsf-contact-grid {
            grid-template-columns: 1fr !important;
            max-width: 420px;
            margin: 0 auto;
          }
          .otsf-awards-photo {
            min-height: 340px !important;
          }
          .otsf-awards-form {
            border-left: none !important;
            border-top: 1px solid rgba(255,255,255,0.08) !important;
          }
          .otsf-awards-cats {
            grid-template-columns: 1fr !important;
            column-gap: 0 !important;
          }
          .otsf-snapshot-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .otsf-why-sa-layout {
            flex-direction: column !important;
          }
          .otsf-why-sa-left {
            flex: none !important;
            position: static !important;
          }
          .otsf-why-sa-left > div {
            position: static !important;
          }
          .otsf-speakers-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          .otsf-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .otsf-stats-pair {
            grid-template-columns: 1fr !important;
          }
          .otsf-flip-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .otsf-gallery-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
            grid-template-areas: none !important;
          }
          .otsf-gallery-item {
            grid-area: unset !important;
            height: 200px;
          }
          .otsf-snapshot-grid {
            grid-template-columns: 1fr !important;
          }
          .otsf-speakers-grid {
            display: flex !important;
            grid-template-columns: none !important;
            flex-wrap: nowrap;
            overflow-x: auto;
            max-width: none !important;
            margin: 0 -20px !important;
            padding: 6px 20px 18px;
            gap: 16px !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .otsf-speakers-grid::-webkit-scrollbar {
            display: none;
          }
          .otsf-speakers-grid > * {
            flex: 0 0 78%;
            max-width: 300px;
          }
          .otsf-speakers-dots {
            display: flex !important;
          }
        }

        @media (max-width: 480px) {
          .otsf-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .otsf-flip-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
