"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import { Footer, InquiryForm } from "@/components/sections";
import { NeuralConstellation, DotMatrixGrid } from "@/components/effects";
import EventNavigation from "@/components/ui/EventNavigation";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { FormType, CountryCode } from "@/lib/form-helpers";

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = "#8B1A22";
const C_BRIGHT = "#B52230";
const C_DIM = "#6E1419";
const EASE = [0.16, 1, 0.3, 1] as const;

// Kenya-specific accent (warm terracotta/savannah)
const KENYA_ACCENT = "#E07A3D";
const KENYA_GOLD = "#D4A84B";

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const S3_LOGOS = `${S3}/sponsors-logo`;
const WP = "https://cyberfirstseries.com/wp-content/uploads";

// Event date - July 2026
const EVENT_DATE = new Date("2026-07-08T08:00:00+03:00");

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

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = "", duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState("0");
  const decimals = String(to).includes(".") ? String(to).split(".")[1].length : 0;
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal((eased * to).toFixed(decimals));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration, decimals]);
  return <span ref={ref}>{val}{suffix}</span>;
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

const THREAT_CARDS = [
  { value: "4.3", prefix: "", suffix: "B", label: "System Attacks", note: "4,375,339,677 detected Q4 2025", highlight: true, trend: "+441%", trendDir: "up" as const },
  { value: "70.9", prefix: "", suffix: "M", label: "Malware", note: "Unpatched vulnerabilities & phishing", highlight: true, trend: "+22%", trendDir: "up" as const },
  { value: "58.3", prefix: "", suffix: "M", label: "DDoS Attacks", note: "Highest in East Africa, 3rd on continent", highlight: false, trend: "+112%", trendDir: "up" as const },
  { value: "42.8", prefix: "", suffix: "M", label: "Brute Force Attacks", note: "42,785,432 credential-based intrusions", highlight: false, trend: "+38%", trendDir: "up" as const },
  { value: "11.7", prefix: "", suffix: "M", label: "Web App Attacks", note: "11,679,136 application layer exploits", highlight: false, trend: "+67%", trendDir: "up" as const },
  { value: "518", prefix: "", suffix: "K", label: "Mobile App Attacks", note: "518,069 mobile threat detections", highlight: false, trend: "+15%", trendDir: "up" as const },
];

const FOCUS_AREAS = [
  {
    title: "Safeguarding National Critical Infrastructure & Neutralizing Advanced Threats",
    desc: "Formulating resilient defense mechanisms against APTs, ransomware proliferation, and high-volume DDoS attacks exceeding 1Tbps.",
    icon: "M2 20h20M4 20V10l8-6 8 6v10M9 20v-4a3 3 0 016 0v4",
    wide: true,
  },
  {
    title: "Regulatory Governance, Data Privacy & Policy Synchronization",
    desc: "Strategically aligning enterprise architectures with the Computer Misuse and Cybercrimes Act (CMCA) and national directives for data privacy and legal compliance.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4",
  },
  {
    title: "Architecting Resilient Cloud Ecosystems & Operationalizing Zero Trust",
    desc: "Eradicating implicit trust against social engineering and insider threats while navigating migration to hybrid/public cloud.",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
  },
  {
    title: "Cultivating the Human Defense Perimeter & Bridging the Talent Deficit",
    desc: "Accelerating capacity-building models and institutional partnerships to transform the workforce into an active 'human firewall'.",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    wide: true,
  },
  {
    title: "Integrating AI & Next-Generation Threat Intelligence",
    desc: "Leveraging AI for automated, proactive threat detection and incident response against algorithmic cyber-attacks.",
    icon: "M12 2a4 4 0 014 4v1a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2V6a4 4 0 014-4zM9 18h6M10 22h4",
  },
  {
    title: "Fostering Strategic Geopolitical Partnerships & Intelligence Synergy",
    desc: "Driving regional/global collaboration frameworks to democratize actionable cyber intelligence and fortify cross-border defense.",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
];

const AGENDA = [
  { time: "08:00 – 09:00", title: "Registration & Networking Breakfast", type: "break" as const },
  { time: "09:00 – 09:20", title: "Opening Keynote", subtitle: "The State of Kenya's Cyber Economy: Navigating the KSh 30 Billion Crisis and Strategic Resilience", type: "keynote" as const },
  { time: "09:20 – 10:10", title: "Panel 1: Critical Infrastructure Security", subtitle: "Safeguarding National Critical Infrastructure & Neutralizing Advanced Threats", type: "panel" as const },
  { time: "10:10 – 10:30", title: "Fireside Chat", subtitle: "Regulatory Governance, Data Privacy & Policy Synchronization", type: "fireside" as const },
  { time: "10:30 – 10:50", title: "Coffee & Networking Break", type: "break" as const },
  { time: "10:50 – 11:35", title: "Panel 2: AI & Threat Intelligence", subtitle: "Integrating Artificial Intelligence & Next-Generation Threat Intelligence", type: "panel" as const },
  { time: "11:35 – 12:00", title: "Customer Success Story", subtitle: "Enterprise Case Study: From Breach to Resilience", type: "fireside" as const },
  { time: "12:00 – 12:45", title: "Networking Lunch", type: "break" as const },
  { time: "12:45 – 13:30", title: "Panel 3: Cloud & Zero Trust", subtitle: "Architecting Resilient Cloud Ecosystems & Operationalizing Zero Trust", type: "panel" as const },
  { time: "13:30 – 13:55", title: "Fireside Chat", subtitle: "Fostering Strategic Geopolitical Partnerships & Intelligence Synergy", type: "fireside" as const },
  { time: "13:55 – 14:40", title: "Panel 4: Talent & Human Defense", subtitle: "Cultivating the Human Defense Perimeter & Bridging the Talent Deficit", type: "panel" as const },
  { time: "14:40 – 15:00", title: "Closing Keynote", subtitle: "Building Performance-Driven Cyber Institutions", type: "keynote" as const },
  { time: "15:00", title: "Cyber First Awards East Africa & Networking", type: "awards" as const },
];

const AWARDS_DATA = [
  { title: "Cybersecurity Innovation Award", desc: "Recognizing groundbreaking solutions in threat detection and defence technologies." },
  { title: "Excellence in Cyber Resilience Award", desc: "Honouring organizations that have demonstrated robust recovery and adaptation to cyber incidents." },
  { title: "Emerging Cybersecurity Leader Award", desc: "Celebrating young professionals or startups making significant contributions to the field." },
  { title: "Public Sector Cybersecurity Achievement Award", desc: "Acknowledging government initiatives that enhance national digital security." },
  { title: "The Master of the Attack Surface (Zero Trust Pioneer)", desc: "This awards a C-suite leader or architectural team that has executed the most sophisticated, seamless implementation of Zero Trust Architecture, effectively neutralizing external and internal threats without hindering business operations." },
  { title: "The Sentinel of Critical Infrastructure", desc: "This is dedicated to a public sector entity, utility company, or financial institution that has implemented highly creative strategies to safeguard national data and physical infrastructure from disruption." },
];

const AWARDS_ELIGIBILITY = [
  "Government and regulatory authorities",
  "Enterprises and private sector organisations",
  "Banking and financial institutions",
  "Critical infrastructure operators",
  "Cybersecurity and technology innovators",
];

const WHO_ATTEND_INDUSTRIES = [
  { name: "Banking & Financial Services", pct: 28 },
  { name: "Government & Public Sector", pct: 22 },
  { name: "Telecom & Digital Infrastructure", pct: 18 },
  { name: "Energy & Utilities", pct: 12 },
  { name: "Healthcare", pct: 10 },
  { name: "Manufacturing & Industrial", pct: 10 },
];

// Supporting Partners (shown in hero strip above countdown)
const SUPPORTING_PARTNERS = [
  { name: "NC4", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/cyber-first-kenya/NC4+Logo.jpeg" },
];

// Kenya Advisory Board (key government & policy leaders from brochure)
const ADVISORY_BOARD: { name: string; title: string; org: string; photo: string | null; linkedin?: string }[] = [
  {
    name: "George Kisaka",
    title: "VP",
    org: "ISACA Kenya Chapter",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Nairobi_Speakers/George-Kisaka.jpeg",
    linkedin: "https://www.linkedin.com/in/gkisaka/?originalSubdomain=ke",
  },
  {
    name: "Michael Etale",
    title: "Chief Information Security Officer",
    org: "Absa Bank",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Nairobi_Speakers/Michael_Etale.jpg",
    linkedin: "https://www.linkedin.com/in/michael-etale-cissp/",
  },
  {
    name: "Geoffrey O. Ochieng",
    title: "Global AI Delegate to Kenya",
    org: "Global Alliance for Artificial Intelligence",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Nairobi_Speakers/Geoffrey-Ochieng.png",
    linkedin: "https://www.linkedin.com/in/geoffrey-o-ochieng%E2%84%A2%A2-85127a285/",
  },
  {
    name: "Hussein Omar Hussein",
    title: "Director IT and Digital",
    org: "SBM Bank Kenya",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Nairobi_Speakers/Hussein_Omar_Hussein.jpg",
    linkedin: "https://www.linkedin.com/in/hussein-omar-hussein-hoh",
  },
  {
    name: "Rosemary Koech-Kimwatu",
    title: "Head of Data Protection",
    org: "KCB Bank Group",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Nairobi_Speakers/Rosemary_Koech_Kimwatu.jpg",
    linkedin: "https://www.linkedin.com/in/rosemary-koech-kimwatu-47536520/",
  },
  {
    name: "Colonel (Dr.) James Kimuyu",
    title: "Director",
    org: "NC4",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Nairobi_Speakers/Col+Dr+James+Photo.jpeg",
    linkedin: "https://nc4.go.ke/",
  },
  {
    name: "Frank K Muriuki",
    title: "Lead - Information Security Officer",
    org: "Kenyan Airports Authority",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Nairobi_Speakers/Frank-Muriuki%C2%A0.png",
    linkedin: "https://www.linkedin.com/in/frank-k-muriuki-66396842/",
  },
  {
    name: "Peter Muhumuza",
    title: "CISO",
    org: "KCB Bank Uganda",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Nairobi_Speakers/Peter_Muhumuza.jpg",
    linkedin: "https://www.linkedin.com/in/peter-muhumuza-3aa95215/",
  },
  {
    name: "Steven Mwesige",
    title: "Ag. Chief Information Security Officer",
    org: "Pearl Bank Uganda",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Nairobi_Speakers/Steven_Mwesige.jpg",
    linkedin: "https://www.linkedin.com/in/steven-mwesige/",
  },
  {
    name: "Dr. Isabelle K",
    title: "Principal Officer | Frequency Spectrum",
    org: "Communications Authority of Kenya",
    photo: null,
    linkedin: "https://www.linkedin.com/in/dr-isabelle-k-459211142/",
  },
];

// Kenya Speakers (from brochure)
const SPEAKERS = [
  {
    name: "Eng. John Kipchumba Tanui",
    title: "Principal Secretary, State Department of ICT and Digital Economy",
    org: "Government of Kenya",
    photo: null,
  },
  {
    name: "Dr. Katherine W. Getao",
    title: "Former CEO, ICT Authority; Expert in Cyber Hygiene & Governance",
    org: "ICT Authority Kenya",
    photo: null,
  },
  {
    name: "Vincent Ngundi",
    title: "Director of Cyber Security & Head of National Cybersecurity Centre",
    org: "Communications Authority of Kenya",
    photo: null,
  },
  {
    name: "(Col) Dr James J. Kimuyu",
    title: "Director",
    org: "National Computer & Cybercrimes Coordination Committee (NC4)",
    photo: null,
  },
  {
    name: "Prof. Nura Mohamed, Ph.D, EBS",
    title: "Director General",
    org: "Kenya School of Government",
    photo: null,
  },
  {
    name: "James Yogo",
    title: "Head of Cyber Security (CISO)",
    org: "Central Bank of Kenya",
    photo: null,
  },
  {
    name: "Joylynn Kirui",
    title: "Head of Information Security",
    org: "Prime Bank Africa",
    photo: null,
  },
  {
    name: "Shiphrah Wairima",
    title: "President, Kenya Chapter",
    org: "Global Council for Responsible AI",
    photo: null,
  },
  {
    name: "Dr Aprielle Moraa",
    title: "President",
    org: "Women in CyberSecurity - East Africa",
    photo: null,
  },
  {
    name: "George Kisaka",
    title: "Vice President",
    org: "ISACA Kenya Chapter",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Nairobi_Speakers/George-Kisaka.jpeg",
  },
];

// Gallery images, Cyber First series only (Kuwait 2025 S3 + UAE 2025 WordPress)
const CF_UAE = "/images/cyber-first-uae";
const GALLERY: {
  src: string;
  alt: string;
  area: string;
  rotate?: number;
  lift?: boolean;
}[] = [
  {
    src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Cyber+First+Kuwait+2025/Kuwait+Photos/Kuwait+Photos/4X9A1744.jpg",
    alt: "Cyber First Kuwait keynote session",
    area: "hero",
  },
  {
    src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0412.JPG",
    alt: "Panel discussion with industry leaders",
    area: "a",
    rotate: -1.5,
    lift: true,
  },
  {
    src: `${CF_UAE}/ARU00574.jpg`,
    alt: "Panel discussion, Cyber First UAE",
    area: "b",
  },
  {
    src: "https://efg-final.s3.eu-north-1.amazonaws.com/cyber-first-kenya/cyber21-04-504.jpg",
    alt: "Conference networking",
    area: "c",
    rotate: 1.2,
    lift: true,
  },
  {
    src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-410.jpg",
    alt: "Conference exhibition",
    area: "d",
  },
  {
    src: `${CF_UAE}/ARU00722.jpg`,
    alt: "Executive networking session",
    area: "e",
  },
];

// Sponsor tiers for Kenya
// Marquee Row 1, past / credibility logos
const MARQUEE_ROW_1 = [
  { name: "Palo Alto Networks", logo: `${S3_LOGOS}/paloalto.png` },
  { name: "SentinelOne", logo: `${S3_LOGOS}/sentinelone.png` },
  { name: "Google Cloud", logo: `${S3_LOGOS}/Google-Cloud-Security.png` },
  { name: "Kaspersky", logo: `${S3_LOGOS}/kaspersky.png` },
  { name: "Akamai", logo: `${S3_LOGOS}/Akamai.png` },
  { name: "Secureworks", logo: `${S3_LOGOS}/secureworks.png` },
];

// Marquee Row 2, series-wide sponsors
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

// Who Should Attend roles
const WHO_ATTEND_ROLES = [
  { label: "Government & Regulatory Authorities", icon: "M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11" },
  { label: "Chief Information Security Officers (CISOs)", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { label: "CIOs & IT Security Leaders", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" },
  { label: "Critical Infrastructure Operators", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { label: "Fintech & Mobile Money Leaders", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
  { label: "Telecom & Digital Infrastructure", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
  { label: "Risk & Compliance Professionals", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Cybersecurity Technology Providers", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { label: "Security Operations Center (SOC) Directors", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { label: "AI & Cloud Security Specialists", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
];

// Contact information
const S3_TEAM = "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos";
const CFK_CONTACTS = {
  speaking: {
    name: "Sanjana Venugopal",
    role: "Senior Conference Producer",
    phone: "+971 50 500 3341",
    email: "sanjana@eventsfirstgroup.com",
    photo: `${S3_TEAM}/Sanjana-Venugopal-new.jpg`,
  },
  sponsorship: [
    {
      name: "Mohammed Hassan",
      role: "Partnership Manager",
      phone: "+971 50 140 1320",
      email: "hassan@eventsfirstgroup.com",
      photo: `${S3_TEAM}/hassan.jpg`,
    },
    {
      name: "Mohammed Danish",
      role: "Partnership Manager",
      phone: "+971 50 500 9655",
      email: "danish@eventsfirstgroup.com",
      photo: "/team/danish.jpg",
    },
  ],
};

// ─── PAGE COMPONENT ──────────────────────────────────────────────────────────
export default function CyberFirstKenya2026() {
  return (
    <div style={{ background: "#0A0608" }}>
      <style jsx global>{`
        /* ═══ GLOBAL APPLE-STYLE ANIMATIONS ═══ */
        html { scroll-behavior: smooth; }
        
        /* Hero headline shimmer */
        @keyframes cfk-hero-shimmer {
          0%, 100% { background-position: 200% center; }
          50% { background-position: 0% center; }
        }
        .cfk-hero-main-headline { animation: cfk-hero-shimmer 6s ease-in-out infinite; }
        
        /* Hero primary CTA glow pulse */
        @keyframes cfk-cta-glow {
          0%, 100% { box-shadow: 0 4px 24px ${C}50, 0 12px 48px ${C}30, inset 0 1px 0 rgba(255,255,255,0.2); }
          50% { box-shadow: 0 6px 32px ${C}60, 0 16px 56px ${C}40, inset 0 1px 0 rgba(255,255,255,0.25); }
        }
        .cfk-hero-cta-primary { animation: cfk-cta-glow 3s ease-in-out infinite; }
        .cfk-hero-cta-primary:hover { 
          transform: translateY(-3px) scale(1.02) !important; 
          box-shadow: 0 8px 40px ${C}70, 0 20px 60px ${C}50, inset 0 1px 0 rgba(255,255,255,0.3) !important;
        }
        .cfk-hero-cta-secondary:hover {
          background: rgba(255,255,255,0.12) !important;
          border-color: rgba(255,255,255,0.3) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15) !important;
        }
        
        /* Hero badge hover */
        .cfk-hero-badge:hover {
          background: rgba(255,255,255,0.1) !important;
          border-color: rgba(255,255,255,0.2) !important;
          transform: translateY(-2px);
        }
        
        /* Smooth transitions for all interactive elements */
        a, button { transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        
        /* ═══ GLOBAL CARD ENHANCEMENTS ═══ */
        /* All cards get premium lift on hover */
        [class*="cfk-"][class*="-card"]:hover,
        [class*="cfkn-"][class*="-card"]:hover {
          transform: translateY(-6px) scale(1.01) !important;
        }
        
        /* Focus Area cards */
        .cfk-focus-card {
          background: linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.05) 100%) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08) !important;
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }
        .cfk-focus-card:hover {
          border-color: rgba(255,255,255,0.15) !important;
          box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 16px 48px rgba(0,0,0,0.3), 0 0 60px ${C}10, inset 0 1px 0 rgba(255,255,255,0.12) !important;
        }
        
        /* Agenda cards */
        .cfk-agenda-card, .cfk-agenda-item {
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }
        
        /* Award cards */
        .cfk-award-card {
          background: linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%) !important;
          backdrop-filter: blur(24px) !important;
          -webkit-backdrop-filter: blur(24px) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }
        .cfk-award-card:hover {
          transform: translateY(-8px) !important;
          border-color: rgba(212,168,75,0.3) !important;
          box-shadow: 0 12px 48px rgba(212,168,75,0.15), 0 4px 24px rgba(0,0,0,0.4) !important;
        }
        
        /* Who attends cards */
        .cfk-attend-card {
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
        }
        
        /* Gallery images */
        .cfk-gallery-item img {
          transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }
        .cfk-gallery-item:hover img {
          transform: scale(1.08) !important;
          filter: brightness(1.1) !important;
        }
        
        /* Marquee logos glow on hover */
        .cfkn-marquee-inner img {
          transition: all 0.4s ease !important;
        }
        .cfkn-marquee-inner > div:hover img {
          filter: brightness(0) invert(1) drop-shadow(0 0 20px rgba(255,255,255,0.3)) !important;
          opacity: 1 !important;
        }
        
        /* Section headlines, gradient shimmer */
        @keyframes cfk-section-shimmer {
          0%, 100% { background-position: 200% center; }
          50% { background-position: 0% center; }
        }
        
        /* Stats cards premium */
        .cfk-stat-card {
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }
        
        .cfk-stat-card:hover {
          transform: translateY(-4px) !important;
          border-color: ${C_BRIGHT}35 !important;
          box-shadow: 0 12px 40px ${C}18, inset 0 1px 0 ${C_BRIGHT}12 !important;
        }
        @media (max-width: 1024px) {
          .cfk-bento-overview { grid-template-columns: 1fr !important; }
          .cfk-stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .cfk-hero-toprow { flex-direction: column; align-items: flex-start !important; gap: 12px !important; }
          .cfk-hero h1 { font-size: clamp(28px, 9vw, 42px) !important; }
          .cfk-hero-content { padding: 0 20px !important; padding-bottom: 200px !important; justify-content: flex-start !important; padding-top: 90px !important; }
          .cfk-partners-strip { bottom: 80px !important; padding: 14px 16px !important; gap: 16px !important; }
          .cfk-partners-strip img { transform: scale(1) !important; }
          .cfk-partners-strip > div:last-child { gap: 20px !important; }
          .cfk-countdown-bar { padding: 8px 0 !important; }
          .cfk-countdown-bar .text-center span:first-child { font-size: 18px !important; }
          .cfk-countdown-bar .text-center span:last-child { font-size: 9px !important; }
          .cfk-bento-overview { grid-template-columns: 1fr !important; }
          .cfk-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cfk-focus-grid { grid-template-columns: 1fr !important; }
          .cfk-focus-grid > div { grid-column: span 1 !important; }
          .cfk-market-grid { grid-template-columns: 1fr !important; }
          .cfk-attend-grid { grid-template-columns: 1fr !important; }
          .cfk-threats-grid { grid-template-columns: 1fr !important; }
          .cfk-awards-grid { grid-template-columns: 1fr !important; }
          .cfk-bottom-bar { flex-direction: column !important; gap: 16px !important; text-align: center; }
        }
        @media (max-width: 480px) {
          .cfk-stats-grid > div { padding: 16px 12px !important; }
        }
      `}</style>
      
      <EventNavigation />
      <HeroSection />
      <StatsBar />
      <SiliconSavannahContext />
      <AdvisoryBoard />
      <FocusAreas />
      {/* <Speakers /> */}
      <AgendaTimeline />
      <SponsorsSection />
      <AtmosphereDivider />
      <Gallery />
      {/* <WhatToExpect /> */}
      <WhoShouldAttend />
      <CfkHighlights />
      <CfkTestimonials />
      <AwardsSection />
      <SplitCTA />
      <ContactSection />
      <Venue />
      <Footer />
    </div>
  );
}

// ─── HERO SECTION ────────────────────────────────────────────────────────────
function HeroSection() {
  const cd = useCountdown(EVENT_DATE);

  return (
    <section id="overview" className="cfk-hero" style={{ position: "relative", height: "100vh", minHeight: 720, overflow: "hidden", background: "#0A0608" }}>
      {/* Background Image - Nairobi with Cyber Shield */}
      <div className="absolute inset-0">
        <img
          src="https://efg-final.s3.eu-north-1.amazonaws.com/cyber-first-kenya/kenya-cyber.png"
          alt="Nairobi Cyber Security Hub"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.55)" }}
        />
      </div>

      {/* Left gradient for text readability */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,6,8,0.92) 0%, rgba(10,6,8,0.8) 30%, rgba(10,6,8,0.4) 55%, transparent 75%)", zIndex: 1 }} />
      
      {/* Bottom gradient */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(10,6,8,0.9) 90%, rgba(10,6,8,1) 100%)", zIndex: 1 }} />

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: 1320, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", paddingTop: 120, paddingBottom: 140 }}>

        {/* Top Row — Supporting Partner (left) + Date Badge (right) */}
        <div className="cfk-hero-toprow" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40, gap: 20 }}>
          {/* Supporting Partner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}
          >
            <span style={{
              fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 800,
              letterSpacing: "2.5px", textTransform: "uppercase", color: KENYA_ACCENT,
            }}>Supporting Partner</span>
            <div style={{
              background: "white", borderRadius: 8, padding: "14px 22px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}>
              <img src={SUPPORTING_PARTNERS[0].logo} alt={SUPPORTING_PARTNERS[0].name} style={{ height: 55, objectFit: "contain" }} />
            </div>
          </motion.div>

          {/* Date Badge — liquid glass + skeuomorphic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 14,
              padding: "12px 24px",
              borderRadius: 50,
              background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: C_BRIGHT,
              boxShadow: `0 0 8px ${C_BRIGHT}, 0 0 16px ${C_BRIGHT}60`,
            }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: "white" }}>
              8 JULY 2026
            </span>
            <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.15)", borderRadius: 1 }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
              NAIROBI
            </span>
          </motion.div>
        </div>

        {/* Main Headline - Beyond Firewalls */}
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
            Beyond
          </h1>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(42px, 7vw, 90px)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: C_BRIGHT,
            margin: "0 0 20px 0",
          }}>
            Firewalls
          </h1>
        </motion.div>

        {/* Subheadline - Italic */}
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
            margin: "0 0 16px 0",
            maxWidth: 520,
          }}
        >
          Strategic Cyber Defense for Digital Age
        </motion.h2>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.6 }} 
          style={{ 
            fontFamily: "var(--font-outfit)", 
            fontWeight: 400, 
            fontSize: "clamp(14px, 1.2vw, 16px)",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.6,
            maxWidth: 460,
            margin: "0 0 28px 0",
          }}
        >
          East Africa&apos;s premier cybersecurity summit bringing together C-level executives, technology leaders, and policymakers.
        </motion.p>

        {/* CTA Buttons */}
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
          
          {/* Become a Sponsor */}
          <a
            href="#enquire"
            onClick={(e) => { e.preventDefault(); document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              padding: "clamp(12px, 1.5vw, 16px) clamp(22px, 2.8vw, 32px)",
              borderRadius: 50,
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.9)",
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(13px, 1.1vw, 15px)",
              fontWeight: 500,
              textDecoration: "none", 
              border: "1px solid rgba(255,255,255,0.18)", 
              cursor: "pointer", 
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
          >
            Become a Sponsor
          </a>
        </motion.div>
      </div>

      {/* Community Partner - GAFAI (Bottom Right) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        style={{
          position: "absolute",
          bottom: 130,
          right: "clamp(24px, 5vw, 80px)",
          zIndex: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 14,
        }}
      >
        <span style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: KENYA_ACCENT,
        }}>
          Community Partner
        </span>
        <div style={{
          background: "white",
          borderRadius: 8,
          padding: "14px 22px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}>
          <img
            src="https://efg-final.s3.eu-north-1.amazonaws.com/cyber-first-kenya/gafai_blue_Global_Alliance_for_Artificial_Intelligence.png"
            alt="Global Alliance for Artificial Intelligence (GAFAI)"
            style={{ height: 39, objectFit: "contain" }}
          />
        </div>
      </motion.div>

{/* Bottom Countdown Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, delay: 1 }} 
        style={{ 
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20, 
          background: "rgba(8,5,6,0.97)", 
          backdropFilter: "blur(20px)", 
          borderTop: "1px solid rgba(255,255,255,0.06)", 
          padding: "14px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, maxWidth: 1400, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
          
          {/* Left - Date */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: KENYA_ACCENT }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "white" }}>
              8 JULY 2026
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 2px" }}>|</span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>
              Cyber First East Africa
            </span>
          </div>

          {/* Center - Countdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[
              { v: cd.d, l: "DAYS" }, 
              { v: cd.h, l: "HRS" }, 
              { v: cd.m, l: "MIN" }, 
              { v: cd.s, l: "SEC" }
            ].map((u, i) => (
              <div key={u.l} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center", minWidth: 44 }}>
                  <span style={{ 
                    fontFamily: "var(--font-display)", 
                    fontSize: 24, 
                    fontWeight: 700, 
                    color: C_BRIGHT, 
                    letterSpacing: "-1px", 
                    display: "block",
                  }}>
                    {String(u.v).padStart(2, "0")}
                  </span>
                  <span style={{ 
                    fontFamily: "var(--font-outfit)", 
                    fontSize: 9, 
                    fontWeight: 500, 
                    letterSpacing: "1px", 
                    color: "rgba(255,255,255,0.4)", 
                    display: "block",
                    marginTop: 1,
                  }}>
                    {u.l}
                  </span>
                </div>
                {i < 3 && <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 18, margin: "0 1px" }}>:</span>}
              </div>
            ))}
          </div>

          {/* Right - Register Button */}
          <a
            href="#register"
            onClick={(e) => { e.preventDefault(); document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{ 
              padding: "12px 24px", 
              borderRadius: 50, 
              background: C, 
              fontFamily: "var(--font-outfit)", 
              fontSize: 13, 
              fontWeight: 600, 
              color: "white", 
              textDecoration: "none", 
              cursor: "pointer",
              transition: "all 0.3s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C_BRIGHT; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C; }}
          >
            Register
          </a>
        </div>
      </motion.div>
    </section>
  );
}
// ─── STATS STRIP + STICKY CARDS ──────────────────────────────────────────────
function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!card1Ref.current || !card2Ref.current) return;

    ScrollTrigger.create({
      trigger: card1Ref.current,
      start: "top 5%",
      endTrigger: card2Ref.current,
      end: "top 5%",
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      fastScrollEnd: true,
    });

    ScrollTrigger.create({
      trigger: card2Ref.current,
      start: "top 5%",
      end: "+=300",
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      fastScrollEnd: true,
    });
  }, { scope: containerRef });

  const stats = [
    { value: "200+", label: "Delegates", sub: "C-Suite Leaders" },
    { value: "20+", label: "Speakers", sub: "Industry Experts" },
    { value: "10+", label: "Sessions", sub: "Deep Dives" },
    { value: "6", label: "Awards", sub: "Categories" },
    { value: "15+", label: "Partners", sub: "Global Brands" },
  ];

  return (
    <div ref={containerRef}>
      {/* ── SUMMIT OVERVIEW - APPLE VISION PRO STYLE ── */}
      <section className="cfk-summit-section" style={{ 
        position: "relative",
        background: "#000000", 
        padding: "clamp(100px, 12vw, 160px) 0",
        overflow: "hidden",
      }}>
        {/* Deep atmospheric background layers */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(139,26,34,0.15) 0%, transparent 50%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 100%, rgba(139,26,34,0.08) 0%, transparent 40%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(181,34,48,0.06) 0%, transparent 50%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(181,34,48,0.06) 0%, transparent 50%)",
        }} />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          mixBlendMode: "overlay",
        }} />
        
        {/* Horizontal light streaks */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "repeating-linear-gradient(0deg, transparent 0px, transparent 80px, rgba(255,255,255,0.008) 80px, rgba(255,255,255,0.008) 81px)",
        }} />
        
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)", position: "relative", zIndex: 1 }}>
          {/* Section Heading - Premium Apple Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            style={{ textAlign: "center", marginBottom: "clamp(60px, 8vw, 100px)" }}
          >
            {/* SUMMIT OVERVIEW label with glowing lines */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 28 }}>
              <motion.span 
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ 
                  width: 60, 
                  height: 1, 
                  background: `linear-gradient(90deg, transparent, ${C_BRIGHT})`,
                  transformOrigin: "right",
                }} 
              />
              <span style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "5px",
                textTransform: "uppercase",
                color: C_BRIGHT,
                textShadow: `0 0 30px ${C_BRIGHT}60`,
              }}>
                Summit Overview
              </span>
              <motion.span 
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ 
                  width: 60, 
                  height: 1, 
                  background: `linear-gradient(270deg, transparent, ${C_BRIGHT})`,
                  transformOrigin: "left",
                }} 
              />
            </div>
            
            {/* Main headline - Premium gradient text */}
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="cfk-summit-headline"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontStyle: "italic",
                fontSize: "clamp(40px, 6vw, 80px)",
                letterSpacing: "-2px",
                lineHeight: 1.05,
                margin: "0 0 32px 0",
                background: `linear-gradient(180deg, #ffffff 0%, #f5d0d0 35%, ${C_BRIGHT} 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: `drop-shadow(0 4px 30px ${C}30)`,
              }}
            >
              East Africa&apos;s Top 200+<br />Security Leaders
            </motion.h2>
            
            {/* Glowing underline */}
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ 
                width: 70, 
                height: 3, 
                background: `linear-gradient(90deg, ${C_BRIGHT}, ${KENYA_ACCENT}, ${C_BRIGHT})`,
                margin: "0 auto", 
                borderRadius: 2,
                boxShadow: `0 0 20px ${C_BRIGHT}60, 0 0 40px ${C_BRIGHT}30`,
              }} 
            />
          </motion.div>

          {/* Stats Row - Premium glass cards */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "stretch",
              gap: "clamp(16px, 3vw, 40px)",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "200+", label: "DELEGATES", highlight: true },
              { value: "20+", label: "SPEAKERS", highlight: false },
              { value: "10+", label: "SESSIONS", highlight: false },
              { value: "10+", label: "MEDIA PARTNERS", highlight: false },
              { value: "6", label: "AWARDS", highlight: false },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: [0.25, 1, 0.5, 1] }}
                className="cfk-summit-stat"
                style={{
                  textAlign: "center",
                  flex: "1 1 140px",
                  maxWidth: 200,
                  padding: "clamp(28px, 4vw, 44px) clamp(20px, 3vw, 36px)",
                  background: stat.highlight 
                    ? `linear-gradient(165deg, ${C}18 0%, ${C}08 50%, rgba(0,0,0,0.3) 100%)`
                    : "linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, rgba(0,0,0,0.2) 100%)",
                  borderRadius: 24,
                  border: `1px solid ${stat.highlight ? `${C_BRIGHT}30` : "rgba(255,255,255,0.06)"}`,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: stat.highlight 
                    ? `0 8px 32px ${C}25, 0 0 0 1px ${C}10, inset 0 1px 0 ${C_BRIGHT}15`
                    : "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
                }}
              >
                {/* Top glow accent */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: "20%",
                  right: "20%",
                  height: 1,
                  background: stat.highlight 
                    ? `linear-gradient(90deg, transparent, ${C_BRIGHT}60, transparent)`
                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                }} />
                
                {/* Inner glow */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  background: stat.highlight
                    ? `radial-gradient(ellipse 80% 100% at 50% 0%, ${C}15, transparent)`
                    : "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255,255,255,0.03), transparent)",
                  pointerEvents: "none",
                }} />
                
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(44px, 5vw, 64px)",
                  fontWeight: 700,
                  letterSpacing: "-2px",
                  display: "block",
                  lineHeight: 1,
                  position: "relative",
                  background: stat.highlight 
                    ? `linear-gradient(180deg, #ffffff 20%, ${C_BRIGHT} 100%)`
                    : "linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.6) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: stat.highlight ? `drop-shadow(0 0 20px ${C_BRIGHT}40)` : "none",
                }}>
                  {stat.value}
                </span>
                <span style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(10px, 1vw, 12px)",
                  fontWeight: 500,
                  color: stat.highlight ? `${C_BRIGHT}cc` : "rgba(255,255,255,0.45)",
                  display: "block",
                  marginTop: 14,
                  textTransform: "uppercase",
                  letterSpacing: "2.5px",
                  position: "relative",
                }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
          height: 120,
          background: "linear-gradient(to bottom, transparent, #0A0608)",
        }} />
      </section>
      
      <style jsx global>{`
        .cfk-summit-stat:hover {
          transform: translateY(-6px) scale(1.02) !important;
          border-color: ${C_BRIGHT}50 !important;
          box-shadow: 0 16px 48px ${C}35, 0 0 0 1px ${C_BRIGHT}20, inset 0 1px 0 ${C_BRIGHT}25 !important;
        }
        .cfk-summit-headline {
          animation: cfk-summit-shimmer 8s ease-in-out infinite;
        }
        @keyframes cfk-summit-shimmer {
          0%, 100% { filter: drop-shadow(0 4px 30px ${C}30); }
          50% { filter: drop-shadow(0 4px 40px ${C}45); }
        }
      `}</style>

      {/* ── STICKY CARD 1: THE LANDSCAPE - TWO COLUMN LAYOUT ── */}
      <section 
        ref={card1Ref}
        className="cfk-stack-card"
        style={{ 
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          margin: "0 clamp(16px, 3vw, 40px)",
          borderRadius: 32,
        }}
      >
        {/* Background Image - City Skyline */}
        <div className="absolute inset-0" style={{ borderRadius: 32, overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=1600&q=80"
            alt="Nairobi city skyline, Kenya cybersecurity summit location"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.3) saturate(0.5)" }}
          />
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ 
          background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)",
          borderRadius: 32,
        }} />
        <div className="absolute inset-0" style={{ 
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)",
          borderRadius: 32,
        }} />
        
        {/* Two-column content */}
        <div style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
          padding: "clamp(60px, 8vw, 100px) clamp(40px, 6vw, 100px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 100px)",
          alignItems: "center",
        }}>
          {/* Left: Big Stat */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            style={{ textAlign: "center" }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 16 }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(120px, 20vw, 220px)",
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: "-8px",
                color: "#ffffff",
              }}>
                96
              </span>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(60px, 10vw, 120px)",
                fontWeight: 900,
                lineHeight: 1,
                color: C_BRIGHT,
                marginBottom: "0.08em",
              }}>
                %
              </span>
            </div>
            <span style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(14px, 1.5vw, 18px)",
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "6px",
            }}>
              Talent Gap
            </span>
          </motion.div>
          
          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          >
            <p style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(18px, 1.8vw, 24px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.75,
              marginBottom: 24,
            }}>
              Kenya has solidified its position as a digital powerhouse in Africa, with rapid innovations driving unprecedented economic inclusion. However, this growth has expanded the national attack surface.
            </p>
            <p style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(18px, 1.8vw, 24px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.75,
            }}>
              Organizations face a severe <strong style={{ color: C_BRIGHT, fontWeight: 600 }}>96% talent shortage</strong>, with only 1,700 certified experts for a national requirement of over 40,000.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STICKY CARD 2: THE THREAT - TWO COLUMN LAYOUT (REVERSED) ── */}
      <section 
        ref={card2Ref}
        className="cfk-stack-card"
        style={{ 
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          margin: "20px clamp(16px, 3vw, 40px) 0",
          borderRadius: 32,
        }}
      >
        {/* Background Image - Circuit Board */}
        <div className="absolute inset-0" style={{ borderRadius: 32, overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80"
            alt="Circuit board representing cybersecurity technology"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.25) saturate(0.4)" }}
          />
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ 
          background: "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
          borderRadius: 32,
        }} />
        <div className="absolute inset-0" style={{ 
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)",
          borderRadius: 32,
        }} />
        
        {/* Two-column content (reversed) */}
        <div style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
          padding: "clamp(60px, 8vw, 100px) clamp(40px, 6vw, 100px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 100px)",
          alignItems: "center",
        }}>
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          >
            <p style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(18px, 1.8vw, 24px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.75,
              marginBottom: 24,
            }}>
              Over <strong style={{ color: KENYA_ACCENT, fontWeight: 600 }}>4.5 billion cyber threats</strong> detected between October – December 2025. That is a <strong style={{ color: "#fff", fontWeight: 600 }}>441% jump</strong>. 21.8 million security advisories sent out by KE-CIRT/CC.
            </p>
            <p style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(18px, 1.8vw, 24px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.75,
            }}>
              <strong style={{ color: "#fff", fontWeight: 600 }}>Cyber First East Africa 2026</strong> serves as the definitive nexus for C-level executives, technology leaders, and policymakers to synchronize efforts against escalating digital warfare.
            </p>
          </motion.div>
          
          {/* Right: Big Stat */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
            style={{ textAlign: "center" }}
          >
            {/* Label */}
            <span style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(12px, 1.2vw, 14px)",
              fontWeight: 600,
              color: KENYA_ACCENT,
              textTransform: "uppercase",
              letterSpacing: "5px",
              display: "block",
              marginBottom: 20,
            }}>
              The Threat
            </span>
            
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 16 }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(120px, 20vw, 220px)",
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: "-8px",
                color: "#ffffff",
              }}>
                4.5
              </span>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(60px, 10vw, 120px)",
                fontWeight: 900,
                lineHeight: 1,
                color: KENYA_ACCENT,
                marginBottom: "0.08em",
              }}>
                B
              </span>
            </div>
            <span style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(14px, 1.5vw, 18px)",
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "6px",
            }}>
              Threats Detected
            </span>
          </motion.div>
        </div>
      </section>
      
      <style jsx global>{`
        .cfk-stack-card {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        @media (max-width: 900px) {
          .cfk-stack-card > div > div[style*="grid"] {
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── WHY NOW - GSAP STICKY LEFT + SCROLLING RIGHT ───────────────────────────
function SiliconSavannahContext() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!leftRef.current || !sectionRef.current) return;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: leftRef.current,
      pinSpacing: false,
    });
  }, { scope: sectionRef });

  const THREAT_STATS = [
    { value: "4.5", suffix: "B", label: "System Attacks", note: "Detected Q4 2025", trend: "+441%", color: C_BRIGHT },
    { value: "70.9", suffix: "M", label: "Malware", note: "Unpatched vulnerabilities", trend: "+22%", color: "#ffffff" },
    { value: "58.3", suffix: "M", label: "DDoS Attacks", note: "Highest in East Africa", trend: "+112%", color: "#ffffff" },
    { value: "42.8", suffix: "M", label: "Brute Force", note: "Credential intrusions", trend: "+38%", color: "#ffffff" },
    { value: "11.7", suffix: "M", label: "Web App Attacks", note: "Application exploits", trend: "+67%", color: "#ffffff" },
    { value: "518", suffix: "K", label: "Mobile Threats", note: "Mobile detections", trend: "+15%", color: "#ffffff" },
  ];

  return (
    <section ref={sectionRef} style={{ position: "relative", background: "#0A0608", minHeight: "100vh" }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        minHeight: "100vh",
        maxWidth: 1600,
        margin: "0 auto",
      }}>
        {/* LEFT SIDE - STICKY */}
        <div 
          ref={leftRef}
          style={{ 
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(40px, 6vw, 100px)",
            background: "#0A0608",
          }}
        >
          {/* WHY NOW label */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: C_BRIGHT,
              marginBottom: 32,
            }}
          >
            Why Now
          </motion.span>
          
          {/* Main headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(40px, 5vw, 64px)",
              letterSpacing: "-2px",
              lineHeight: 1.05,
              color: "white",
              margin: "0 0 8px 0",
            }}
          >
            Africa&apos;s Digital<br />Powerhouse
          </motion.h2>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(40px, 5vw, 64px)",
              letterSpacing: "-2px",
              lineHeight: 1.05,
              color: C_BRIGHT,
              margin: "0 0 16px 0",
            }}
          >
            Under Siege
          </motion.h2>
          
          {/* KES stat */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(24px, 3vw, 36px)",
              letterSpacing: "-1px",
              color: C_BRIGHT,
              margin: "0 0 40px 0",
            }}
          >
            KES 29.9 Billion Lost.
          </motion.p>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(16px, 1.5vw, 20px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.75,
              maxWidth: 500,
              margin: "0 0 16px 0",
            }}
          >
            Over 4.5 billion cyber threats detected in Q4 2025 alone. Kenya&apos;s cybersecurity market projected to reach $92.64M by 2029.
          </motion.p>
          
          {/* Source */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 400,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.5px",
            }}
          >
            Source: KE-CIRT/CC · Q4 2025
          </motion.p>
        </div>
        
        {/* RIGHT SIDE - SCROLLING STATS */}
        <div style={{ 
          padding: "clamp(60px, 8vw, 120px) clamp(40px, 5vw, 80px)",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}>
          {THREAT_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              style={{
                padding: "clamp(32px, 4vw, 48px) 0",
                borderBottom: i < THREAT_STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr auto",
                alignItems: "center",
                gap: 24,
              }}
            >
              {/* Big number */}
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(48px, 6vw, 72px)",
                  fontWeight: 800,
                  letterSpacing: "-3px",
                  color: stat.color,
                  lineHeight: 1,
                }}>
                  {stat.value}
                </span>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 700,
                  color: stat.color === "#ffffff" ? KENYA_ACCENT : stat.color,
                  marginLeft: 4,
                }}>
                  {stat.suffix}
                </span>
              </div>
              
              {/* Label & note */}
              <div>
                <span style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(16px, 1.5vw, 20px)",
                  fontWeight: 600,
                  color: "white",
                  display: "block",
                  marginBottom: 4,
                }}>
                  {stat.label}
                </span>
                <span style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(13px, 1.2vw, 15px)",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.45)",
                }}>
                  {stat.note}
                </span>
              </div>
              
              {/* Trend */}
              <span style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(14px, 1.3vw, 18px)",
                fontWeight: 600,
                color: C_BRIGHT,
                textAlign: "right",
              }}>
                {stat.trend}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        @media (max-width: 1024px) {
          section[style*="grid-template-columns: 1fr 1fr"] > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── FOCUS AREAS - FLIP CARDS WITH GSAP ─────────────────────────────────────
function FocusAreas() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  useGSAP(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      ScrollTrigger.create({
        trigger: card,
        start: "top 70%",
        onEnter: () => {
          gsap.to(card.querySelector('.cfk-flip-inner'), {
            rotateY: 180,
            duration: 0.8,
            ease: "power2.out",
          });
          setFlippedCards(prev => new Set([...prev, i]));
        },
      });
    });
  }, { scope: sectionRef });

  const TRACK_DATA = [
    { short: "Critical Infrastructure", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80" },
    { short: "Governance & Privacy", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
    { short: "Cloud & Zero Trust", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80" },
    { short: "Human Firewall", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" },
    { short: "AI & Threat Intel", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" },
    { short: "Global Partnerships", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80" },
  ];

  return (
    <section ref={sectionRef} style={{ position: "relative", padding: "clamp(100px, 12vw, 160px) 0", background: "#0A0608", overflow: "hidden" }}>
      {/* Background glows */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 20%, ${C}15, transparent 60%)` }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 40% at 80% 80%, ${KENYA_ACCENT}08, transparent 50%)` }} />
      
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            <span style={{ width: 50, height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT})` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: C_BRIGHT }}>
              Conference Tracks
            </span>
            <span style={{ width: 50, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>
          
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-2px", color: "white", margin: "0 0 16px 0", lineHeight: 1.1 }}>
            What We&apos;re <span style={{ color: C_BRIGHT }}>Solving</span>
          </h2>
          
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(16px, 1.5vw, 20px)", fontWeight: 400, color: "rgba(255,255,255,0.6)", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
            Six critical tracks addressing East Africa&apos;s most pressing cybersecurity challenges.
          </p>
        </motion.div>

        {/* Flip Cards Grid */}
        <div className="cfk-flip-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {FOCUS_AREAS.map((area, i) => (
            <div
              key={area.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="cfk-flip-card"
              style={{ perspective: 1200, height: 320, cursor: "pointer" }}
            >
              <div 
                className="cfk-flip-inner"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
                }}
              >
                {/* FRONT - Clean image + short title */}
                <div className="cfk-flip-front" style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  borderRadius: 20,
                  overflow: "hidden",
                }}>
                  <img 
                    src={TRACK_DATA[i]?.image} 
                    alt={TRACK_DATA[i]?.short}
                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5) saturate(0.9)", transition: "transform 0.6s ease" }}
                  />
                  {/* Bottom gradient for text readability */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)" }} />
                  
                  {/* Short title at bottom */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px" }}>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(18px, 2vw, 24px)",
                      fontWeight: 600,
                      color: "white",
                      margin: 0,
                      letterSpacing: "-0.5px",
                    }}>
                      {TRACK_DATA[i]?.short}
                    </h3>
                  </div>
                  
                  {/* Subtle top shine */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, background: "linear-gradient(180deg, rgba(255,255,255,0.05), transparent)", pointerEvents: "none" }} />
                </div>

                {/* BACK - Full details */}
                <div className="cfk-flip-back" style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  borderRadius: 20,
                  background: `linear-gradient(165deg, rgba(20,12,14,0.98) 0%, #0A0608 100%)`,
                  border: `1px solid ${C_BRIGHT}20`,
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.5)`,
                }}>
                  {/* Top accent line */}
                  <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}60, transparent)` }} />
                  
                  {/* Track badge */}
                  <div style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: 8,
                    marginBottom: 16,
                    padding: "6px 12px",
                    background: `${C}20`,
                    border: `1px solid ${C_BRIGHT}30`,
                    borderRadius: 20,
                    alignSelf: "flex-start",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 8px ${C_BRIGHT}` }} />
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: C_BRIGHT,
                    }}>
                      Track {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  
                  {/* Short title */}
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(20px, 2.2vw, 26px)",
                    fontWeight: 700,
                    color: "white",
                    margin: "0 0 12px 0",
                    lineHeight: 1.25,
                  }}>
                    {TRACK_DATA[i]?.short}
                  </h3>
                  
                  {/* Accent line */}
                  <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${C_BRIGHT}, ${KENYA_ACCENT})`, marginBottom: 16, borderRadius: 2 }} />
                  
                  {/* Full description */}
                  <p style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    {area.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        .cfk-flip-card {
          transition: transform 0.3s ease;
        }
        .cfk-flip-card:hover {
          transform: translateY(-8px);
        }
        .cfk-flip-card:hover .cfk-flip-inner {
          transform: rotateY(180deg) !important;
        }
        .cfk-flip-card:hover .cfk-flip-front img {
          transform: scale(1.1);
        }
        .cfk-flip-front, .cfk-flip-back {
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
          transition: box-shadow 0.3s ease;
        }
        .cfk-flip-card:hover .cfk-flip-front,
        .cfk-flip-card:hover .cfk-flip-back {
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${C}20;
        }
        @media (max-width: 1024px) {
          .cfk-flip-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .cfk-flip-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── ADVISORY BOARD - HORIZONTAL SCROLL WITH GSAP ────────────────────────────
function AdvisoryBoard() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!trackRef.current || !sectionRef.current) return;

    const track = trackRef.current;
    const leftPanel = 500;
    const scrollWidth = track.scrollWidth - (window.innerWidth - leftPanel);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${scrollWidth * 1.5}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
    });

    tl.to(track, {
      x: -scrollWidth,
      ease: "none",
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0A0608",
        position: "relative",
        overflow: "hidden",
        height: "100vh",
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 100% 80% at 0% 50%, ${C}15, transparent 50%)` }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 60% at 100% 50%, ${KENYA_ACCENT}10, transparent 50%)` }} />

      <div style={{ display: "flex", height: "100%", alignItems: "center" }}>
        {/* LEFT - Sticky Heading with solid background */}
        <div style={{
          width: "clamp(380px, 35vw, 500px)",
          flexShrink: 0,
          padding: "60px clamp(40px, 5vw, 80px)",
          zIndex: 20,
          background: "#0A0608",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRight: `1px solid rgba(255,255,255,0.05)`,
          position: "relative",
        }}>
          {/* Right edge glow */}
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 100, background: `linear-gradient(90deg, transparent, ${C}10)`, pointerEvents: "none" }} />
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "5px",
              textTransform: "uppercase",
              color: C_BRIGHT,
              display: "block",
              marginBottom: 28,
            }}>
              Leadership
            </span>
            
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(44px, 5vw, 68px)",
              letterSpacing: "-3px",
              color: "white",
              lineHeight: 1.0,
              margin: "0 0 24px 0",
            }}>
              Advisory<br />Board &<br /><span style={{ color: C_BRIGHT }}>Speakers</span>
            </h2>
            
            <div style={{ width: 80, height: 4, background: `linear-gradient(90deg, ${C_BRIGHT}, ${KENYA_ACCENT})`, marginBottom: 32, borderRadius: 2 }} />
            
            <p style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 18,
              fontWeight: 400,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.75,
              maxWidth: 360,
            }}>
              Industry leaders shaping the summit agenda and driving cybersecurity excellence across East Africa.
            </p>
            
            {/* Scroll indicator */}
            <div style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "3px", textTransform: "uppercase" }}>
                Scroll to explore
              </span>
              <div style={{ width: 50, height: 1, background: `linear-gradient(90deg, rgba(255,255,255,0.4), transparent)` }} />
              <motion.span
                animate={{ x: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ color: C_BRIGHT, fontSize: 20, fontWeight: 600 }}
              >
                →
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT - Horizontal Scroll Track */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: 32,
            paddingLeft: 48,
            paddingRight: 200,
            willChange: "transform",
          }}
        >
          {ADVISORY_BOARD.map((member, i) => (
            <motion.div
              key={member.name}
              className="cfk-speaker-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "200px" }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3), ease: [0.25, 1, 0.5, 1] }}
              style={{
                flexShrink: 0,
                width: 340,
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
                background: "linear-gradient(165deg, rgba(25,18,20,0.95) 0%, rgba(12,8,10,0.98) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid rgba(255,255,255,0.08)`,
                transformStyle: "preserve-3d",
                transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Animated border gradient */}
              <div className="cfk-card-border" style={{
                position: "absolute",
                inset: -1,
                borderRadius: 25,
                background: `linear-gradient(135deg, ${C_BRIGHT}30, transparent 40%, transparent 60%, ${KENYA_ACCENT}20)`,
                zIndex: -1,
                transition: "opacity 0.4s ease",
                opacity: 0,
              }} />
              
              {/* Photo with parallax container */}
              <div style={{ height: 280, overflow: "hidden", position: "relative" }}>
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="cfk-speaker-photo"
                    style={{
                      width: "110%",
                      height: "110%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      marginLeft: "-5%",
                      marginTop: "-5%",
                      transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${C}60, ${C}30)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 80, color: "rgba(255,255,255,0.15)" }}>👤</span>
                  </div>
                )}
                
                {/* Premium gradient overlays */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.9) 100%)" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C}15, transparent 50%)` }} />
                
                {/* Top shine */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg, rgba(255,255,255,0.06), transparent)" }} />
              </div>
              
              {/* Info section with glass effect */}
              <div style={{
                padding: "28px 32px 32px",
                background: "linear-gradient(180deg, rgba(0,0,0,0.3), transparent)",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "white",
                    margin: "0 0 12px 0",
                    letterSpacing: "-0.5px",
                    lineHeight: 1.15,
                    flex: 1,
                  }}>
                    {member.name}
                  </h3>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="cfk-linkedin-btn"
                      style={{
                        flexShrink: 0,
                        width: 32, height: 32, borderRadius: 8,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                </div>
                <p style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: C_BRIGHT,
                  margin: "0 0 8px 0",
                  lineHeight: 1.45,
                }}>
                  {member.title}
                </p>
                <p style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                  lineHeight: 1.4,
                }}>
                  {member.org}
                </p>
              </div>
              
              {/* Top accent glow line */}
              <div style={{ 
                position: "absolute", 
                top: 0, 
                left: 0,
                right: 0, 
                height: 2, 
                background: `linear-gradient(90deg, transparent 10%, ${C_BRIGHT}60 50%, transparent 90%)`,
                boxShadow: `0 0 20px ${C_BRIGHT}40`,
              }} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .cfk-speaker-card {
          cursor: pointer;
        }
        .cfk-speaker-card:hover {
          transform: translateY(-16px) scale(1.03) rotateX(2deg) !important;
          border-color: rgba(255,255,255,0.15) !important;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 80px ${C}30, inset 0 1px 0 rgba(255,255,255,0.1) !important;
        }
        .cfk-speaker-card:hover .cfk-card-border {
          opacity: 1 !important;
        }
        .cfk-speaker-card:hover .cfk-speaker-photo {
          transform: scale(1.15) !important;
        }
        .cfk-speaker-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, ${C_BRIGHT}00, ${C_BRIGHT}40, ${C_BRIGHT}00);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .cfk-speaker-card:hover::before {
          opacity: 1;
        }
        .cfk-linkedin-btn:hover {
          background: rgba(10,102,194,0.25) !important;
          border-color: rgba(10,102,194,0.5) !important;
        }
        .cfk-linkedin-btn:hover svg {
          fill: #0A66C2 !important;
        }
      `}</style>
    </section>
  );
}

// ─── SPEAKERS ────────────────────────────────────────────────────────────────
function Speakers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  
  return (
    <section id="speakers" ref={ref} style={{ background: "#090506", padding: "clamp(40px,5vw,60px) 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: 48, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: 50,
                background: `${KENYA_ACCENT}12`,
                border: `1px solid ${KENYA_ACCENT}25`,
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: KENYA_ACCENT,
                marginBottom: 20,
              }}
            >
              The Faculty
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(28px,3.8vw,52px)",
                letterSpacing: "-2px",
                color: "white",
                lineHeight: 1.08,
                margin: "0 0 8px",
              }}
            >
              Who&apos;s Speaking
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.3)", margin: 0 }}>
              East Africa&apos;s most senior cybersecurity and technology leaders
            </p>
          </div>
          <div style={{ padding: "10px 22px", borderRadius: 30, background: `${KENYA_ACCENT}12`, border: `1px solid ${KENYA_ACCENT}30` }}>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, color: KENYA_ACCENT }}>
              More Speakers Coming Soon
            </span>
          </div>
        </motion.div>

        <div className="cfk-speakers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
          {SPEAKERS.map((s, i) => (
            <SpeakerCard key={s.name} speaker={s} delay={0.025 * i} inView={inView} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 600px) {
          .cfk-speakers-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
      `}</style>
    </section>
  );
}

function SpeakerCard({
  speaker,
  delay,
  inView,
}: {
  speaker: (typeof SPEAKERS)[0];
  delay: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const initials = speaker.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Tilt max={6}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay, ease: EASE }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: 20,
          overflow: "hidden",
          position: "relative",
          cursor: "default",
          boxShadow: hovered ? `0 0 0 1.5px ${KENYA_ACCENT}50, 0 20px 60px rgba(224,122,61,0.12)` : "0 0 0 1px rgba(255,255,255,0.06)",
          transition: "box-shadow 0.4s ease",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "130%",
            background: `linear-gradient(160deg, ${KENYA_ACCENT}14, #080b10)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 38,
                fontWeight: 900,
                color: KENYA_ACCENT,
                opacity: 0.35,
                letterSpacing: "-1px",
              }}
            >
              {initials}
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(10,5,7,0.95) 0%, rgba(10,5,7,0.65) 35%, rgba(10,5,7,0.1) 65%, transparent 100%)",
            }}
          />

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 14px 14px" }}>
            <div
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 700,
                color: "white",
                lineHeight: 1.25,
                marginBottom: 5,
                letterSpacing: "-0.2px",
              }}
            >
              {speaker.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.42)",
                lineHeight: 1.4,
                marginBottom: 7,
              }}
            >
              {speaker.title}
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "3px 9px",
                borderRadius: 20,
                background: `${KENYA_ACCENT}18`,
                border: `1px solid ${KENYA_ACCENT}30`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: KENYA_ACCENT,
                  letterSpacing: "0.3px",
                }}
              >
                {speaker.org}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
}

function AdvisoryCard({
  member,
  delay,
  inView,
}: {
  member: (typeof ADVISORY_BOARD)[0];
  delay: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const initials = member.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Tilt max={8}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="cfk-advisory-card"
        style={{
          borderRadius: 24,
          overflow: "hidden",
          position: "relative",
          cursor: "default",
          background: "linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.1) 100%)",
          border: hovered ? `1px solid ${KENYA_ACCENT}40` : "1px solid rgba(255,255,255,0.08)",
          boxShadow: hovered 
            ? `0 0 0 1px ${KENYA_ACCENT}30, 0 20px 60px rgba(224,122,61,0.15), 0 8px 32px rgba(0,0,0,0.4)` 
            : "0 4px 24px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2)",
          transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: hovered ? "translateY(-8px)" : "translateY(0)",
        }}
      >
        {/* Top shine */}
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", zIndex: 10 }} />
        
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "130%",
            background: `linear-gradient(160deg, ${KENYA_ACCENT}10, #080b10)`,
            overflow: "hidden",
          }}
        >
          {member.photo ? (
            <>
              <img
                src={member.photo}
                alt={member.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 20%",
                  filter: hovered ? "grayscale(0%) brightness(1.05)" : "grayscale(100%) brightness(0.9)",
                  transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                  transform: hovered ? "scale(1.05)" : "scale(1)",
                }}
              />
              {/* Color overlay on hover */}
              <div 
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(ellipse at center bottom, ${KENYA_ACCENT}25, transparent 70%)`,
                  opacity: hovered ? 1 : 0,
                  transition: "opacity 0.5s ease",
                  pointerEvents: "none",
                }}
              />
            </>
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                background: `linear-gradient(135deg, ${KENYA_ACCENT}20, ${C}15)`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 42,
                  fontWeight: 900,
                  color: "white",
                  opacity: 0.6,
                  letterSpacing: "-1px",
                  textShadow: `0 4px 20px ${KENYA_ACCENT}40`,
                }}
              >
                {initials}
              </span>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(10,5,7,0.98) 0%, rgba(10,5,7,0.7) 30%, rgba(10,5,7,0.2) 60%, transparent 100%)",
            }}
          />

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 14px 14px" }}>
            <div
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 700,
                color: "white",
                lineHeight: 1.25,
                marginBottom: 5,
                letterSpacing: "-0.2px",
              }}
            >
              {member.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: member.title.length > 40 ? 10 : 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.42)",
                lineHeight: 1.4,
                marginBottom: 7,
              }}
            >
              {member.title}
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "3px 9px",
                borderRadius: 20,
                background: `${KENYA_ACCENT}18`,
                border: `1px solid ${KENYA_ACCENT}30`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: member.org.length > 25 ? 11 : 13,
                  fontWeight: 700,
                  color: KENYA_ACCENT,
                  letterSpacing: "0.3px",
                }}
              >
                {member.org}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
}

// ─── AGENDA TIMELINE ─────────────────────────────────────────────────────────
function AgendaTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const typeColors: Record<string, string> = { keynote: C, panel: "#9D4EDD", fireside: "#F97316", sponsor: "#10B981", break: "#6B7280", awards: KENYA_GOLD, closing: "#06B6D4" };

  // Split agenda into morning (before lunch) and afternoon (lunch onward)
  const morningItems = AGENDA.slice(0, 7);   // 08:00 – 12:00
  const afternoonItems = AGENDA.slice(7);     // 12:00 – 15:00

  const renderColumn = (items: typeof AGENDA, label: string, timeRange: string, startDelay: number) => (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Column header card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: startDelay, ease: EASE }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", marginBottom: 28, borderRadius: 12,
          background: `linear-gradient(135deg, ${C}0A, ${C}04)`,
          border: `1px solid ${C}18`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 10px ${C_BRIGHT}50` }} />
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 13, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>{timeRange}</span>
          <span style={{
            fontFamily: "var(--font-dm)", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)",
            padding: "3px 8px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
          }}>{items.length} items</span>
        </div>
      </motion.div>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* Timeline rail */}
        <div style={{ position: "absolute", left: 3, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${C}20, ${C}08)`, borderRadius: 2 }} />

        {items.map((item, i) => (
          <motion.div
            key={i}
            className="cfk-agenda-item"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: startDelay + 0.15 + i * 0.06, ease: EASE }}
            style={{ paddingLeft: 28, marginBottom: 14, position: "relative" }}
          >
            {/* Dot on timeline */}
            <div style={{
              position: "absolute", left: 0, top: 12, width: 8, height: 8, borderRadius: "50%",
              background: C, boxShadow: `0 0 8px ${C}35`, border: "2px solid #0C0809",
              transition: "all 0.3s ease",
            }} />

            {/* Time label */}
            <div style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.3)", marginBottom: 5, letterSpacing: "0.3px" }}>{item.time}</div>

            {/* Card */}
            <div className="cfk-agenda-card" style={{
              padding: "16px 18px", borderRadius: 12, position: "relative", overflow: "hidden",
              background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.012))",
              border: "1px solid rgba(255,255,255,0.055)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)",
              transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              {/* Left accent bar */}
              <div className="cfk-agenda-bar" style={{
                position: "absolute", top: "15%", bottom: "15%", left: 0, width: 2,
                background: `linear-gradient(180deg, transparent, ${typeColors[item.type] || C}50, transparent)`,
                borderRadius: "0 2px 2px 0", transition: "all 0.35s ease",
              }} />

              {/* Content */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: item.subtitle ? 6 : 0, flexWrap: "wrap" }}>
                <span style={{
                  padding: "3px 8px", borderRadius: 4,
                  background: `${typeColors[item.type]}12`, border: `1px solid ${typeColors[item.type]}18`,
                  fontFamily: "var(--font-dm)", fontSize: 13, fontWeight: 600,
                  color: typeColors[item.type], textTransform: "uppercase", letterSpacing: "0.5px",
                }}>{item.type}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.2px" }}>{item.title}</span>
              </div>
              {item.subtitle && (
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.38)", margin: 0, lineHeight: 1.65, paddingLeft: 1 }}>{item.subtitle}</p>
              )}
            </div>
          </motion.div>
        ))}

        {/* End cap */}
        <div style={{ paddingLeft: 28, position: "relative" }}>
          <div style={{ position: "absolute", left: 1, top: 0, width: 6, height: 6, borderRadius: "50%", border: `1.5px solid ${C}30` }} />
        </div>
      </div>
    </div>
  );

  return (
    <section ref={ref} id="agenda" style={{ background: "#0C0809", padding: "clamp(60px, 7vw, 90px) 0", position: "relative", overflow: "hidden" }}>
      {/* Background photo */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=70" alt="Conference venue for Cyber First Kenya 2026 agenda" className="w-full h-full object-cover" loading="lazy" decoding="async" style={{ filter: "brightness(0.04) saturate(0.2) contrast(1.2)" }} />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(12,8,9,0.98) 0%, rgba(12,8,9,0.6) 30%, rgba(12,8,9,0.6) 70%, rgba(12,8,9,0.98) 100%)" }} />

      {/* Atmospheric glows */}
      <div className="absolute inset-0 pointer-events-none cfk-agenda-pulse" style={{ background: `radial-gradient(ellipse 45% 40% at 30% 40%, ${C}08, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 35% at 75% 55%, ${KENYA_ACCENT}05, transparent 65%)` }} />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 5%, ${C}20, ${C_BRIGHT}12, ${C}20, transparent 95%)` }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 3 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: 20 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 20 }}>
            <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT})` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 13, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT }}>Agenda</span>
            <span style={{ width: 28, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 40px)", letterSpacing: "-1.5px", color: "rgba(255,255,255,0.88)", lineHeight: 1.15, margin: "0 0 8px" }}>
            The Day&apos;s{" "}
            <span style={{ color: C_BRIGHT }}>Programme</span>
          </h2>
          <h2 className="cfk-agenda-headline" style={{
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: "clamp(30px, 4vw, 48px)", letterSpacing: "-2px", lineHeight: 1.1, margin: "0 0 12px",
            backgroundImage: `linear-gradient(135deg, ${C_BRIGHT} 0%, #ffffff 50%, ${C_BRIGHT} 100%)`,
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent", color: "transparent",
            filter: `drop-shadow(0 0 30px ${C}20)`,
          }}>
            13 Sessions. 7 Hours. One Stage.
          </h2>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${C_BRIGHT}, ${KENYA_ACCENT}, ${C_BRIGHT})`, borderRadius: 2, margin: "0 auto 20px" }}
          />

          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 16, color: "rgba(255,255,255,0.38)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            A curated single-track programme designed to maximize learning, networking, and actionable takeaways.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          style={{ maxWidth: 1100, margin: "48px auto 48px", position: "relative" }}
        >
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, ${C}12 15%, ${C}22 50%, ${C}12 85%, transparent 100%)` }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(45deg)", width: 6, height: 6, background: C_BRIGHT, borderRadius: 1, boxShadow: `0 0 12px ${C_BRIGHT}40` }} />
        </motion.div>

        {/* Two-column split */}
        <div className="cfk-agenda-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44 }}>
          {renderColumn(morningItems, "Morning Session", "08:00 – 12:00", 0.2)}
          {renderColumn(afternoonItems, "Afternoon Session", "12:00 – 15:00", 0.5)}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 100, background: "linear-gradient(to bottom, transparent, #0C0809)", zIndex: 4 }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 10%, ${C}12, transparent 90%)`, zIndex: 5 }} />

      <style jsx global>{`
        @keyframes cfk-agenda-glow-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes cfk-agenda-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .cfk-agenda-pulse { animation: cfk-agenda-glow-pulse 8s ease-in-out infinite; }
        .cfk-agenda-headline { animation: cfk-agenda-shimmer 8s ease-in-out infinite; }
        .cfk-agenda-card:hover {
          border-color: ${C}20 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px ${C}10, inset 0 1px 0 ${C_BRIGHT}08 !important;
        }
        .cfk-agenda-card:hover .cfk-agenda-bar {
          top: 8% !important;
          bottom: 8% !important;
          width: 3px !important;
          background: linear-gradient(180deg, transparent, ${C_BRIGHT}70, transparent) !important;
          box-shadow: 0 0 8px ${C_BRIGHT}25 !important;
        }
        @media (max-width: 768px) {
          .cfk-agenda-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── SPONSORS MARQUEE ────────────────────────────────────────────────────────
function SponsorsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="sponsors"
      style={{
        background: "#0A0708",
        padding: "clamp(40px, 5vw, 60px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Warm radial glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 40%, ${C}08 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 35% at 80% 60%, ${KENYA_ACCENT}06 0%, transparent 65%)`,
        }}
      />

      <DotMatrixGrid color={C} opacity={0.015} spacing={30} />

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
            <span style={{ width: 30, height: 1, background: KENYA_ACCENT }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: KENYA_ACCENT,
              }}
            >
              Trusted By Industry Leaders
            </span>
            <span style={{ width: 30, height: 1, background: KENYA_ACCENT }} />
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
            Our Partners & Sponsors
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: "rgba(255,255,255,0.35)",
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
              background: "linear-gradient(to right, #0A0708 0%, transparent 100%)",
            }}
          />
          {/* Right edge fade */}
          <div
            className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: "clamp(60px, 10vw, 120px)",
              background: "linear-gradient(to left, #0A0708 0%, transparent 100%)",
            }}
          />

          {/* Row 1, scrolls left */}
          <div className="cfkn-marquee-track" style={{ marginBottom: 20 }}>
            <div
              className="cfkn-marquee-inner cfkn-scroll-left"
              style={{ animationDuration: "70s" }}
            >
              {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((logo, i) => (
                <div
                  key={`r1-${i}`}
                  style={{
                    width: 180,
                    height: 60,
                    margin: "0 clamp(18px, 2.5vw, 36px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    opacity: 0.55,
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

          {/* Row 2, scrolls right */}
          <div className="cfkn-marquee-track">
            <div
              className="cfkn-marquee-inner cfkn-scroll-right"
              style={{ animationDuration: "80s" }}
            >
              {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((logo, i) => (
                <div
                  key={`r2-${i}`}
                  style={{
                    width: 180,
                    height: 60,
                    margin: "0 clamp(18px, 2.5vw, 36px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    opacity: 0.55,
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
          <a
            href="#enquire"
            onClick={(e) => { e.preventDefault(); document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: KENYA_ACCENT,
              textDecoration: "none",
              letterSpacing: "0.3px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: "8px 20px",
              borderRadius: 50,
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = `${KENYA_ACCENT}40`; e.currentTarget.style.background = `${C}15`; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = KENYA_ACCENT; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
          >
            Become a Partner →
          </a>
        </motion.div>
      </div>

      <style jsx global>{`
        .cfkn-marquee-track {
          overflow: hidden;
          width: 100%;
        }
        .cfkn-marquee-inner {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .cfkn-scroll-left {
          animation: cfknScrollLeft linear infinite;
        }
        .cfkn-scroll-right {
          animation: cfknScrollRight linear infinite;
        }
        @keyframes cfknScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes cfknScrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

// ─── ATMOSPHERE DIVIDER ──────────────────────────────────────────────────────
function AtmosphereDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  
  return (
    <div ref={ref} style={{ position: "relative", height: "55vh", overflow: "hidden", background: "#020508" }}>
      <motion.div style={{ position: "absolute", inset: "-10%", y: bgY }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${CF_UAE}/ARU00738.jpg`}
          alt="Cyber First delegates"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 30%", filter: "brightness(0.45) saturate(0.7)" }}
        />
      </motion.div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #090506 0%, transparent 20%, transparent 80%, #090506 100%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE }}
          style={{ textAlign: "center", padding: "0 24px" }}
        >
          <div
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: `${KENYA_ACCENT}90`,
              marginBottom: 16,
            }}
          >
            Kenya · 2026
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
            Where East Africa&apos;s cyber leaders shape the future of regional security.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────
function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      style={{
        background: "#090506",
        padding: "clamp(50px,6vw,80px) 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 40% 50%, ${KENYA_ACCENT}08, transparent 70%)`,
        }}
      />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px,4vw,60px)", position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: 56 }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: KENYA_ACCENT }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: KENYA_ACCENT,
              }}
            >
              From Cyber First Events
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
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.6,
              maxWidth: 460,
              margin: "12px 0 0",
            }}
          >
            Moments captured from our conferences across the region.
          </p>
        </motion.div>

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
                      ? `0 20px 60px rgba(224,122,61,0.15), 0 8px 24px rgba(0,0,0,0.5)`
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
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  style={{
                    transform: isHovered ? "scale(1.06)" : "scale(1)",
                    transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(to top, rgba(10,5,7,0.6) 0%, rgba(10,5,7,0.1) 40%, transparent 100%)",
                  }}
                />

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, rgba(224,122,61,0.08) 0%, transparent 60%)`,
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                />

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
          .cfk-bento-grid > div {
            transform: rotate(0deg) !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── WHAT TO EXPECT ──────────────────────────────────────────────────────────
function WhatToExpect() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = [
    {
      icon: "M12 3a9 9 0 110 18 9 9 0 010-18zm0 5a4 4 0 100 8 4 4 0 000-8zm0-3v2m0 14v2",
      title: "4 High-Impact Panel Discussions",
      desc: "Critical Infrastructure, AI-Driven Defense, Financial Cyber Resilience, and Data Privacy Governance.",
      image: `${CF_UAE}/ARU00574.jpg`,
      tag: "Panels",
      highlights: ["Infrastructure", "AI Defense", "Resilience", "Governance"],
    },
    {
      icon: "M2 3h20v14H2V3zm6 18h8m-8-4h8",
      title: "Live Hackathon / CTF Challenge",
      desc: "Teams compete in real-time capture-the-flag scenarios against simulated threat environments.",
      image: `${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-410.jpg`,
      tag: "Competition",
      highlights: ["Real-Time", "CTF", "Threat Sim"],
    },
    {
      icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      title: "Cyber Excellence Awards East Africa",
      desc: "Recognising outstanding contributions to Kenya\u2019s cybersecurity ecosystem across government and enterprise.",
      image: `${CF_UAE}/ARU00418.jpg`,
      tag: "Awards",
      highlights: ["Government", "Enterprise", "Innovation"],
    },
    {
      icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
      title: "Executive Networking",
      desc: "Curated roundtables connecting CISOs and decision-makers across banking, telecom, government, and tech.",
      image: `${CF_UAE}/ARU00722.jpg`,
      tag: "Networking",
      highlights: ["CISOs", "Roundtables", "Cross-Sector"],
    },
  ];

  return (
    <section ref={ref} style={{ background: "#090506", padding: "clamp(60px, 7vw, 90px) 0", position: "relative", overflow: "hidden" }}>
      {/* Atmospheric orbs, 4 layers */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 55% 55% at 20% 18%, ${C_BRIGHT}08, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 35% 40% at 85% 72%, ${C}06, transparent 65%)` }} />
      <div className="absolute inset-0 pointer-events-none cfk-expect-pulse" style={{ background: `radial-gradient(ellipse 50% 40% at 55% 45%, ${C_BRIGHT}05, transparent 60%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 35% 25% at 50% 90%, ${C}05, transparent 55%)` }} />

      {/* Dot matrix */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(${C_BRIGHT}06 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 65% 55% at 50% 50%, black 15%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 50%, black 15%, transparent 70%)",
        opacity: 0.45,
      }} />

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 4px)",
        zIndex: 1,
      }} />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 5%, ${C_BRIGHT}20, ${C_BRIGHT}12, transparent 95%)` }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 24 }}>
            <span style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT})` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 13, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT }}>Programme</span>
            <span style={{ width: 36, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(32px, 4.5vw, 54px)", letterSpacing: "-2.5px",
            color: "rgba(255,255,255,0.92)", lineHeight: 1.08, margin: "0 0 10px",
          }}>
            What to Expect at{" "}
            <span className="cfk-expect-headline" style={{
              backgroundImage: `linear-gradient(135deg, ${C_BRIGHT} 0%, #ffffff 50%, ${C_BRIGHT} 100%)`,
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              WebkitTextFillColor: "transparent", color: "transparent",
            }}>East Africa 2026</span>
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            style={{ width: 70, height: 2, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, ${C}, ${C_BRIGHT}, transparent)`, borderRadius: 2, margin: "0 auto 22px" }}
          />

          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 540, margin: "0 auto", lineHeight: 1.75 }}>
            A full-day programme designed to equip, connect, and inspire East Africa&apos;s cybersecurity leadership.
          </p>
        </motion.div>

        {/* Cards, featured top card + 3 below */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Featured first card, full width */}
          <ExpectCard key={items[0].title} item={items[0]} index={0} inView={inView} featured />

          {/* Bottom 3 cards */}
          <div className="cfk-expect-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {items.slice(1).map((it, i) => (
              <ExpectCard key={it.title} item={it} index={i + 1} inView={inView} />
            ))}
          </div>
        </div>

        <style jsx global>{`
          @keyframes cfk-expect-glow-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          @keyframes cfk-expect-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          .cfk-expect-pulse { animation: cfk-expect-glow-pulse 7s ease-in-out infinite; }
          .cfk-expect-headline { animation: cfk-expect-shimmer 8s ease-in-out infinite; }
          @media (max-width: 900px) {
            .cfk-expect-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 10%, ${C_BRIGHT}12, transparent 90%)` }} />
    </section>
  );
}

function ExpectCard({
  item,
  index,
  inView,
  featured = false,
}: {
  item: { icon: string; title: string; desc: string; image: string; tag: string; highlights: string[] };
  index: number;
  inView: boolean;
  featured?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  const num = String(index + 1).padStart(2, "0");

  return (
    <Tilt max={featured ? 3 : 5}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 36 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, delay: 0.15 + index * 0.13, ease: EASE }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        style={{
          position: "relative",
          padding: featured ? "52px 44px 48px" : "40px 32px 36px",
          borderRadius: 22,
          background: `linear-gradient(160deg, rgba(${22 + index * 3},${14 + index * 2},${16 + index * 2},0.88) 0%, rgba(12,8,10,0.92) 100%)`,
          border: `1px solid ${hovered ? `${C_BRIGHT}30` : "rgba(255,255,255,0.07)"}`,
          borderTop: `1px solid ${hovered ? `${C_BRIGHT}40` : "rgba(255,255,255,0.1)"}`,
          overflow: "hidden",
          transform: hovered ? "translateY(-7px)" : "translateY(0)",
          boxShadow: hovered
            ? `0 24px 64px ${C_BRIGHT}12, 0 0 0 1px ${C_BRIGHT}0A inset, inset 0 1px 0 ${C_BRIGHT}14, 0 0 80px ${C_BRIGHT}04`
            : "0 4px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
          cursor: "default",
          minHeight: featured ? 260 : 240,
        }}
      >
        {/* Background image */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            style={{
              filter: hovered ? "brightness(0.35) saturate(0.6)" : "brightness(0.18) saturate(0.4)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              objectPosition: featured ? "center 30%" : "center",
              transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>

        {/* Gradient overlay, tinted crimson */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: featured
            ? `linear-gradient(135deg, rgba(10,5,7,0.75) 10%, rgba(10,5,7,0.3) 45%, rgba(139,26,34,0.08) 70%, rgba(10,5,7,0.7) 100%)`
            : `linear-gradient(160deg, rgba(10,5,7,0.72) 12%, rgba(10,5,7,0.35) 50%, rgba(10,5,7,0.68) 100%)`,
          zIndex: 0,
        }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          opacity: hovered ? 0.5 : 0.25,
          transition: "opacity 0.4s",
          zIndex: 0,
        }} />

        {/* Shimmer sweep */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.03) 44%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 56%, transparent 62%)",
          backgroundSize: "200% 100%",
          backgroundPosition: hovered ? "-200% 0" : "200% 0",
          transition: "background-position 0.9s cubic-bezier(0.16,1,0.3,1)",
          zIndex: 1,
        }} />

        {/* Mouse-follow glow */}
        <div className="absolute pointer-events-none" style={{
          width: featured ? 350 : 280, height: featured ? 350 : 280, borderRadius: "50%",
          background: `radial-gradient(circle, ${C_BRIGHT}14 0%, ${C_BRIGHT}06 40%, transparent 70%)`,
          left: `calc(${mousePos.x * 100}% - ${featured ? 175 : 140}px)`,
          top: `calc(${mousePos.y * 100}% - ${featured ? 175 : 140}px)`,
          opacity: hovered ? 1 : 0, transition: "opacity 0.4s", zIndex: 1,
        }} />

        {/* Top neon edge */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: hovered ? 2 : 1, zIndex: 2,
          background: hovered
            ? `linear-gradient(90deg, transparent 5%, ${C_BRIGHT}80, ${C_BRIGHT}, ${C_BRIGHT}80, transparent 95%)`
            : `linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)`,
          boxShadow: hovered ? `0 0 18px ${C_BRIGHT}30, 0 0 6px ${C_BRIGHT}20` : "none",
          transition: "all 0.4s",
        }} />

        {/* Left accent bar */}
        <div style={{
          position: "absolute", top: hovered ? "8%" : "14%", bottom: hovered ? "8%" : "14%", left: 0,
          width: hovered ? 3 : 2, zIndex: 2,
          background: hovered
            ? `linear-gradient(180deg, transparent, ${C_BRIGHT}80, ${C_BRIGHT}50, transparent)`
            : `linear-gradient(180deg, transparent, rgba(255,255,255,0.05), transparent)`,
          borderRadius: "0 3px 3px 0",
          boxShadow: hovered ? `3px 0 12px ${C_BRIGHT}18` : "none",
          transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
        }} />

        {/* Number watermark, gradient on hover */}
        <div style={{
          position: "absolute", top: featured ? 16 : 10, right: featured ? 28 : 20, zIndex: 2,
          fontFamily: "var(--font-display)", fontSize: featured ? 100 : 72, fontWeight: 900,
          letterSpacing: "-5px", lineHeight: 1,
          transition: "all 0.5s",
          ...(hovered ? {
            backgroundImage: `linear-gradient(180deg, ${C_BRIGHT}18, ${C_BRIGHT}08)`,
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent", color: "transparent",
          } : { color: "rgba(255,255,255,0.02)" }),
        }}>
          {num}
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 3, display: featured ? "flex" : "block", gap: featured ? 40 : 0, alignItems: featured ? "flex-start" : "stretch" }}>
          {/* Left column for featured */}
          <div style={{ flex: featured ? "0 0 auto" : undefined }}>
            {/* Tag pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: featured ? 28 : 22 }}>
              <div style={{
                padding: "5px 14px", borderRadius: 20,
                background: hovered ? `${C_BRIGHT}18` : `${C_BRIGHT}0A`,
                border: `1px solid ${hovered ? `${C_BRIGHT}35` : `${C_BRIGHT}14`}`,
                transition: "all 0.35s",
              }}>
                <span style={{
                  fontFamily: "var(--font-dm)", fontSize: 13, fontWeight: 600,
                  letterSpacing: "1.8px", textTransform: "uppercase",
                  color: hovered ? C_BRIGHT : `${C_BRIGHT}90`, transition: "color 0.35s",
                }}>
                  {item.tag}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: featured ? 26 : 19, letterSpacing: featured ? "-1px" : "-0.5px",
              color: hovered ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.9)",
              lineHeight: 1.2, margin: `0 0 ${featured ? 16 : 12}px`,
              transition: "color 0.35s", maxWidth: featured ? 500 : undefined,
            }}>
              {item.title}
            </h3>

            {/* Description */}
            <p style={{
              fontFamily: "var(--font-outfit)", fontSize: featured ? 14 : 13, fontWeight: 300,
              color: hovered ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.38)",
              lineHeight: 1.75, margin: 0, maxWidth: featured ? 480 : 400,
              transition: "color 0.35s",
            }}>
              {item.desc}
            </p>

            {/* Highlight tags, keywords */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: featured ? 20 : 16 }}>
              {item.highlights.map((h) => (
                <span key={h} style={{
                  padding: "3px 10px", borderRadius: 6,
                  background: hovered ? `${C_BRIGHT}12` : "rgba(255,255,255,0.025)",
                  border: `1px solid ${hovered ? `${C_BRIGHT}22` : "rgba(255,255,255,0.05)"}`,
                  fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500,
                  color: hovered ? `${C_BRIGHT}CC` : "rgba(255,255,255,0.25)",
                  letterSpacing: "0.3px", transition: "all 0.35s",
                }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Corner brackets, all 4 */}
        <div style={{ position: "absolute", top: 10, left: 10, width: 16, height: 16, borderTop: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderLeft: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderRadius: "4px 0 0 0", transition: "border-color 0.4s", zIndex: 3 }} />
        <div style={{ position: "absolute", top: 10, right: 10, width: 16, height: 16, borderTop: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderRight: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderRadius: "0 4px 0 0", transition: "border-color 0.4s", zIndex: 3 }} />
        <div style={{ position: "absolute", bottom: 10, left: 10, width: 16, height: 16, borderBottom: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderLeft: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderRadius: "0 0 0 4px", transition: "border-color 0.4s", zIndex: 3 }} />
        <div style={{ position: "absolute", bottom: 10, right: 10, width: 16, height: 16, borderBottom: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderRight: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderRadius: "0 0 4px 0", transition: "border-color 0.4s", zIndex: 3 }} />

        {/* Bottom right accent dot */}
        <div style={{ position: "absolute", bottom: 18, right: featured ? 44 : 22, width: 4, height: 4, borderRadius: "50%", background: hovered ? `${C_BRIGHT}40` : "rgba(255,255,255,0.05)", transition: "background 0.4s", zIndex: 3 }} />

        {/* Bottom left, "Learn more" hint on hover for featured */}
        {featured && (
          <div style={{
            position: "absolute", bottom: 20, right: 44, zIndex: 3,
            display: "flex", alignItems: "center", gap: 6,
            opacity: hovered ? 0.6 : 0, transition: "opacity 0.4s",
          }}>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: C_BRIGHT, letterSpacing: "0.5px" }}>Explore</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>
        )}
      </motion.div>
    </Tilt>
  );
}

// ─── WHO SHOULD ATTEND ───────────────────────────────────────────────────────
function WhoShouldAttend() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredRole, setHoveredRole] = useState<number | null>(null);
  const [hoveredInd, setHoveredInd] = useState<number | null>(null);

  return (
    <section ref={ref} style={{ background: "#090506", padding: "clamp(60px, 7vw, 90px) 0", position: "relative", overflow: "hidden" }}>
      {/* Background image */}
      <img
        src="https://efg-final.s3.eu-north-1.amazonaws.com/cyberbg.jpg"
        alt="" aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ filter: "brightness(0.15) saturate(0.5) contrast(1.1)" }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, #090506 0%, rgba(10,5,7,0.7) 30%, rgba(10,5,7,0.7) 70%, #090506 100%)" }} />

      {/* Atmospheric orbs */}
      <div className="absolute inset-0 pointer-events-none cfk-attend-pulse" style={{ background: `radial-gradient(ellipse 50% 45% at 50% 30%, ${C_BRIGHT}08, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 30% 35% at 10% 50%, ${C}06, transparent 60%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 30% 35% at 90% 60%, ${C_BRIGHT}05, transparent 60%)` }} />

      {/* Dot matrix */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(${C_BRIGHT}06 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 65% 55% at 50% 50%, black 15%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 50%, black 15%, transparent 70%)",
        opacity: 0.45,
      }} />

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 4px)",
        zIndex: 1,
      }} />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 5%, ${C_BRIGHT}20, ${C_BRIGHT}12, transparent 95%)` }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative", zIndex: 2 }}>
        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 24 }}>
            <span style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT})` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 13, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT }}>Your Audience</span>
            <span style={{ width: 36, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 54px)", letterSpacing: "-2.5px", color: "rgba(255,255,255,0.92)", lineHeight: 1.08, margin: "0 0 10px" }}>
            Who Should{" "}
            <span style={{ color: C_BRIGHT }}>Attend</span>
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            style={{ width: 70, height: 2, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, ${C}, ${C_BRIGHT}, transparent)`, borderRadius: 2, margin: "0 auto 22px" }}
          />

          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 540, margin: "0 auto", lineHeight: 1.75 }}>
            Designed for senior decision-makers driving cybersecurity strategy across East Africa&apos;s most critical sectors.
          </p>
        </motion.div>

        {/* Content, Roles grid + Industries panel */}
        <div className="cfk-attend-split" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>
          {/* Roles, 2-column grid inside a glass card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
            style={{
              padding: "40px 36px 36px",
              borderRadius: 22,
              background: "linear-gradient(160deg, rgba(24,15,18,0.9) 0%, rgba(14,9,11,0.94) 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderTop: "1px solid rgba(255,255,255,0.11)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 36px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
              backgroundSize: "36px 36px", opacity: 0.35,
            }} />

            {/* Shimmer sweep */}
            <div className="cfk-attend-shimmer absolute inset-0 pointer-events-none" style={{
              background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.02) 44%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 56%, transparent 62%)",
              backgroundSize: "200% 100%", backgroundPosition: "200% 0",
            }} />

            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 40% at 30% 10%, ${C_BRIGHT}06, transparent 55%)` }} />

            {/* Top neon edge */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)` }} />

            {/* Section label */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: `${C_BRIGHT}0E`, border: `1px solid ${C_BRIGHT}1C`,
                  display: "flex", alignItems: "center", justifyContent: "flex-start",
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", inset: 3, borderRadius: 6, border: `1px solid ${C_BRIGHT}0A` }} />
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.85 }}>
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                </div>
                <span style={{ fontFamily: "var(--font-dm)", fontSize: 13, fontWeight: 600, letterSpacing: "2.2px", textTransform: "uppercase", color: C_BRIGHT }}>Target Roles</span>
              </div>
              <span style={{ fontFamily: "var(--font-dm)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.18)", letterSpacing: "0.5px" }}>10 roles</span>
            </div>

            <div className="cfk-attend-roles" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", position: "relative", zIndex: 1 }}>
              {WHO_ATTEND_ROLES.map((role, i) => (
                <motion.div
                  key={role.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.25 + i * 0.04, ease: EASE }}
                  onMouseEnter={() => setHoveredRole(i)}
                  onMouseLeave={() => setHoveredRole(null)}
                  className="flex items-center gap-3"
                  style={{
                    padding: "13px 12px",
                    borderRadius: 12,
                    background: hoveredRole === i ? `${C_BRIGHT}0A` : "transparent",
                    border: `1px solid ${hoveredRole === i ? `${C_BRIGHT}1C` : "transparent"}`,
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    cursor: "default",
                    transform: hoveredRole === i ? "translateX(4px)" : "translateX(0)",
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: hoveredRole === i ? `${C_BRIGHT}1A` : `${C_BRIGHT}08`,
                    border: `1px solid ${hoveredRole === i ? `${C_BRIGHT}38` : `${C_BRIGHT}10`}`,
                    display: "flex", alignItems: "center", justifyContent: "flex-start",
                    flexShrink: 0, transition: "all 0.3s",
                    boxShadow: hoveredRole === i ? `0 0 16px ${C_BRIGHT}12, inset 0 0 8px ${C_BRIGHT}06` : "none",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hoveredRole === i ? C_BRIGHT : `${C_BRIGHT}50`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.3s", filter: hoveredRole === i ? `drop-shadow(0 0 4px ${C_BRIGHT}50)` : "none" }}>
                      <path d={role.icon} />
                    </svg>
                  </div>
                  <span style={{
                    fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: hoveredRole === i ? 600 : 400,
                    color: hoveredRole === i ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.42)",
                    transition: "all 0.3s", lineHeight: 1.35,
                  }}>
                    {role.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Corner brackets */}
            <div style={{ position: "absolute", top: 10, left: 10, width: 16, height: 16, borderTop: "1.5px solid rgba(255,255,255,0.05)", borderLeft: "1.5px solid rgba(255,255,255,0.05)", borderRadius: "4px 0 0 0" }} />
            <div style={{ position: "absolute", top: 10, right: 10, width: 16, height: 16, borderTop: "1.5px solid rgba(255,255,255,0.05)", borderRight: "1.5px solid rgba(255,255,255,0.05)", borderRadius: "0 4px 0 0" }} />
            <div style={{ position: "absolute", bottom: 10, left: 10, width: 16, height: 16, borderBottom: "1.5px solid rgba(255,255,255,0.05)", borderLeft: "1.5px solid rgba(255,255,255,0.05)", borderRadius: "0 0 0 4px" }} />
            <div style={{ position: "absolute", bottom: 10, right: 10, width: 16, height: 16, borderBottom: "1.5px solid rgba(255,255,255,0.05)", borderRight: "1.5px solid rgba(255,255,255,0.05)", borderRadius: "0 0 4px 0" }} />

            {/* Bottom dot */}
            <div style={{ position: "absolute", bottom: 16, right: 20, width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          </motion.div>

          {/* Industries panel, crimson glass card */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.3, ease: EASE }}
            style={{
              padding: "40px 30px 36px",
              borderRadius: 22,
              background: `linear-gradient(155deg, rgba(181,34,48,0.1) 0%, rgba(139,26,34,0.04) 40%, rgba(16,10,12,0.92) 100%)`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${C_BRIGHT}22`,
              borderTop: `1px solid ${C_BRIGHT}35`,
              boxShadow: `inset 0 1px 0 ${C_BRIGHT}12, 0 16px 48px rgba(0,0,0,0.35), 0 0 80px ${C_BRIGHT}05`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 70% 5%, ${C_BRIGHT}0E, transparent 55%)` }} />

            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
              backgroundSize: "36px 36px", opacity: 0.3,
            }} />

            {/* Top neon edge */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent 5%, ${C_BRIGHT}70, ${C_BRIGHT}, ${C_BRIGHT}70, transparent 95%)`, boxShadow: `0 0 16px ${C_BRIGHT}25, 0 0 4px ${C_BRIGHT}15` }} />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: `${C_BRIGHT}18`, border: `1px solid ${C_BRIGHT}35`,
                  display: "flex", alignItems: "center", justifyContent: "flex-start",
                  boxShadow: `0 0 12px ${C_BRIGHT}10`,
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", inset: 3, borderRadius: 6, border: `1px solid ${C_BRIGHT}15` }} />
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 20h20M5 20V8l7-5 7 5v12M9 20v-6h6v6" />
                  </svg>
                </div>
                <span style={{ fontFamily: "var(--font-dm)", fontSize: 13, fontWeight: 700, color: C_BRIGHT, letterSpacing: "2.2px", textTransform: "uppercase" }}>
                  Key Industries
                </span>
              </div>
              <span style={{ fontFamily: "var(--font-dm)", fontSize: 12, fontWeight: 500, color: `${C_BRIGHT}50`, letterSpacing: "0.5px" }}>{WHO_ATTEND_INDUSTRIES.length} sectors</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, position: "relative", zIndex: 1 }}>
              {WHO_ATTEND_INDUSTRIES.map((ind, i) => (
                <motion.div
                  key={ind.name}
                  initial={{ opacity: 0, x: 14 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.4 + i * 0.06, ease: EASE }}
                  onMouseEnter={() => setHoveredInd(i)}
                  onMouseLeave={() => setHoveredInd(null)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: `1px solid ${hoveredInd === i ? `${C_BRIGHT}25` : "transparent"}`,
                    background: hoveredInd === i ? `${C_BRIGHT}0A` : "transparent",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    cursor: "default",
                    transform: hoveredInd === i ? "translateX(3px)" : "translateX(0)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: 22, height: 22, borderRadius: 7,
                      background: hoveredInd === i ? `${C_BRIGHT}22` : `${C_BRIGHT}0C`,
                      border: `1px solid ${hoveredInd === i ? `${C_BRIGHT}42` : `${C_BRIGHT}15`}`,
                      display: "flex", alignItems: "center", justifyContent: "flex-start",
                      flexShrink: 0, transition: "all 0.3s",
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={hoveredInd === i ? C_BRIGHT : `${C_BRIGHT}55`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s" }}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-outfit)", fontSize: 13,
                      fontWeight: hoveredInd === i ? 600 : 400,
                      color: hoveredInd === i ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.48)",
                      transition: "all 0.3s", whiteSpace: "nowrap",
                    }}>
                      {ind.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Corner brackets */}
            <div style={{ position: "absolute", top: 10, left: 10, width: 16, height: 16, borderTop: `1.5px solid ${C_BRIGHT}35`, borderLeft: `1.5px solid ${C_BRIGHT}35`, borderRadius: "4px 0 0 0" }} />
            <div style={{ position: "absolute", top: 10, right: 10, width: 16, height: 16, borderTop: `1.5px solid ${C_BRIGHT}35`, borderRight: `1.5px solid ${C_BRIGHT}35`, borderRadius: "0 4px 0 0" }} />
            <div style={{ position: "absolute", bottom: 10, left: 10, width: 16, height: 16, borderBottom: `1.5px solid ${C_BRIGHT}35`, borderLeft: `1.5px solid ${C_BRIGHT}35`, borderRadius: "0 0 0 4px" }} />
            <div style={{ position: "absolute", bottom: 10, right: 10, width: 16, height: 16, borderBottom: `1.5px solid ${C_BRIGHT}35`, borderRight: `1.5px solid ${C_BRIGHT}35`, borderRadius: "0 0 4px 0" }} />

            {/* Bottom dot */}
            <div style={{ position: "absolute", bottom: 16, right: 22, width: 4, height: 4, borderRadius: "50%", background: `${C_BRIGHT}30` }} />
          </motion.div>
        </div>

      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 10%, ${C_BRIGHT}12, transparent 90%)` }} />

      <style jsx global>{`
        @keyframes cfk-attend-glow-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .cfk-attend-pulse { animation: cfk-attend-glow-pulse 7s ease-in-out infinite; }
        @media (max-width: 900px) {
          .cfk-attend-split { grid-template-columns: 1fr !important; }
          .cfk-attend-roles { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── FROM THE STAGE — Event Highlights ───────────────────────────────────────

const CFK_HIGHLIGHTS = [
  { id: "3ofcPquafgk", title: "Cyber First Event Highlights" },
  { id: "JA1X4cN2-t0", title: "Cyber First Event Highlights" },
  { id: "-a481Lbz55o", title: "Cyber First Event Highlights" },
  { id: "0d_2Itsg6ec", title: "Cyber First Event Highlights" },
  { id: "3uvw31I1tq8", title: "Cyber First Event Highlights" },
  { id: "8xluYDV_07g", title: "Cyber First Event Highlights" },
  { id: "_ogyuzwQWYo", title: "Cyber First Event Highlights" },
];

const CFK_SHORTS = [
  { id: "jPQFjwuohfI", title: "Cyber First Testimonial" },
  { id: "c8sPwIo4Pis", title: "Cyber First Testimonial" },
  { id: "2LoeDNqsem0", title: "Cyber First Testimonial" },
  { id: "8C61dof_f3s", title: "Cyber First Testimonial" },
  { id: "2-KXhfSeBdQ", title: "Cyber First Testimonial" },
  { id: "2IwKmGEfOIo", title: "Cyber First Testimonial" },
];

function CfkVideoCard({ videoId, title, label, isHero, isVertical }: { videoId: string; title: string; label?: string; isHero?: boolean; isVertical?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbSrc = isVertical
    ? `https://img.youtube.com/vi/${videoId}/oar2.jpg`
    : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="cfk-v-card" onClick={() => !isPlaying && setIsPlaying(true)}>
      {isPlaying ? (
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
            src={thumbSrc}
            alt={title}
            className="cfk-v-thumb"
            {...(isVertical ? { onError: (e: React.SyntheticEvent<HTMLImageElement>) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; } } : {})}
          />
          <div className="cfk-v-overlay" />
          <div className="cfk-v-play-wrap">
            <div className={`cfk-v-play-btn ${isHero ? "cfk-v-play-hero" : ""}`}>
              <svg width={isHero ? "18" : "14"} height={isHero ? "18" : "14"} viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
          {label && (
            <div className="cfk-v-label">
              <span style={{
                background: `linear-gradient(135deg, ${C}4d 0%, ${C}26 100%)`,
                borderColor: `${C}4d`,
              }}>{label}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CfkHighlights() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="cfk-eh-section">
      <div className="cfk-eh-glow" />
      <div className="cfk-eh-container">
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <span style={{ width: 24, height: 2, background: C, borderRadius: 1 }} />
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 12, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>From the Stage</span>
        </div>

        <h2 className="cfk-eh-heading" style={{
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }}>Event Highlights</h2>

        <p className="cfk-eh-subtitle" style={{
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s",
        }}>Keynotes, panels, and conversations captured live from Cyber First summits.</p>

        <div className="cfk-eh-bento" style={{
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s",
        }}>
          <div className="cfk-eh-bento-hero">
            <CfkVideoCard videoId={CFK_HIGHLIGHTS[0].id} title={CFK_HIGHLIGHTS[0].title} label="Cyber First" isHero />
          </div>
          <div className="cfk-eh-bento-side">
            <div className="cfk-eh-bento-side-card">
              <CfkVideoCard videoId={CFK_HIGHLIGHTS[1].id} title={CFK_HIGHLIGHTS[1].title} label="Cyber First" />
            </div>
            <div className="cfk-eh-bento-side-card">
              <CfkVideoCard videoId={CFK_HIGHLIGHTS[2].id} title={CFK_HIGHLIGHTS[2].title} label="Cyber First" />
            </div>
          </div>
          <div className="cfk-eh-bento-row">
            {CFK_HIGHLIGHTS.slice(3).map(v => (
              <div key={v.id} className="cfk-eh-bento-row-card">
                <CfkVideoCard videoId={v.id} title={v.title} label="Cyber First" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .cfk-eh-section {
          background: #080A0F;
          padding: clamp(56px, 7vw, 90px) 0 clamp(40px, 5vw, 60px);
          position: relative; overflow: hidden;
        }
        .cfk-eh-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 40% at 50% 0%, ${C}0a 0%, transparent 60%);
        }
        .cfk-eh-container {
          max-width: 1320px; margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 40px); position: relative;
        }
        .cfk-eh-heading {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(28px, 3.5vw, 44px); letter-spacing: -1.5px;
          color: #fff; line-height: 1.15; margin: 0 0 8px;
        }
        .cfk-eh-subtitle {
          font-family: var(--font-outfit); font-weight: 300;
          font-size: clamp(14px, 1.2vw, 16px); color: rgba(255,255,255,0.45);
          line-height: 1.7; margin: 0 0 clamp(28px, 3.5vw, 40px); max-width: 540px;
        }
        .cfk-eh-bento {
          display: grid; grid-template-columns: 3fr 2fr;
          grid-template-rows: 1fr 1fr auto;
          gap: clamp(10px, 1.5vw, 14px);
        }
        .cfk-eh-bento-hero { grid-column: 1; grid-row: 1 / 3; aspect-ratio: 16 / 9; }
        .cfk-eh-bento-side { grid-column: 2; grid-row: 1 / 3; display: flex; flex-direction: column; gap: clamp(10px, 1.5vw, 14px); }
        .cfk-eh-bento-side-card { flex: 1; min-height: 0; }
        .cfk-eh-bento-row { grid-column: 1 / -1; grid-row: 3; display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(10px, 1.5vw, 14px); }
        .cfk-eh-bento-row-card { aspect-ratio: 16 / 9; }

        /* Shared card */
        .cfk-v-card {
          position: relative; width: 100%; height: 100%;
          border-radius: 16px; overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: border-color 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .cfk-v-card:hover {
          border-color: ${C}4d;
          box-shadow: 0 16px 48px ${C}1f, inset 0 1px 0 rgba(255,255,255,0.1);
          transform: translateY(-3px);
        }
        .cfk-v-card:hover .cfk-v-thumb { transform: scale(1.04); }
        .cfk-v-card:hover .cfk-v-play-btn {
          background: ${C}e6;
          border-color: ${C}66;
          transform: scale(1.2);
          box-shadow: 0 0 0 8px ${C}1f, 0 4px 16px ${C}40;
        }
        .cfk-v-card:hover .cfk-v-label span {
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.3);
        }

        /* Label badge — liquid glass */
        .cfk-v-label {
          position: absolute; bottom: 10px; left: 10px; z-index: 2;
        }
        .cfk-v-label span {
          font-family: var(--font-outfit);
          font-size: 9px; font-weight: 600;
          letter-spacing: 1.2px; text-transform: uppercase; color: #fff;
          padding: 4px 10px; border-radius: 50px;
          border-style: solid; border-width: 1px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 10px rgba(0,0,0,0.25);
          transition: box-shadow 0.3s ease;
        }

        .cfk-v-thumb {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .cfk-v-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%);
        }
        .cfk-v-play-wrap {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .cfk-v-play-btn {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          animation: cfk-v-pulse 3s ease-in-out infinite;
        }
        .cfk-v-play-hero { width: 64px; height: 64px; }
        @keyframes cfk-v-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.08); }
          50% { box-shadow: 0 0 0 6px rgba(255,255,255,0.04); }
        }

        @media (max-width: 900px) {
          .cfk-eh-bento { grid-template-columns: 1fr; }
          .cfk-eh-bento-hero { grid-column: 1; aspect-ratio: 16 / 9; }
          .cfk-eh-bento-side { grid-column: 1; flex-direction: row; }
          .cfk-eh-bento-side-card { aspect-ratio: 16 / 9; }
          .cfk-eh-bento-row { grid-column: 1; grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .cfk-eh-bento-row { grid-template-columns: 1fr 1fr; }
          .cfk-eh-bento-side { flex-direction: column; }
          .cfk-eh-bento-side-card { aspect-ratio: 16 / 9; }
          .cfk-v-play-hero { width: 48px; height: 48px; }
        }
      `}</style>
    </section>
  );
}

// ─── FROM THE ROOM — Testimonials ────────────────────────────────────────────

function CfkTestimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="cfk-vr-section">
      <div className="cfk-vr-glow" />
      <div className="cfk-vr-container">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ width: 24, height: 2, background: C, borderRadius: 1 }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>From the Room</span>
          </div>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1, ease: EASE }} className="cfk-vr-heading">
          Hear It From the Room
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15, ease: EASE }} className="cfk-vr-subtitle">
          Hear directly from CISOs and cybersecurity leaders who attended Cyber First events.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} className="cfk-vr-showcase">
          {CFK_SHORTS.map((v, i) => (
            <div key={v.id} className={`cfk-vr-slot cfk-vr-slot-${i % 2 === 0 ? "tall" : "short"} ${i === 2 ? "cfk-vr-slot-hero" : ""}`}>
              <CfkVideoCard videoId={v.id} title={v.title} label="Cyber First" isVertical />
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .cfk-vr-section {
          background: #080A0F;
          padding: clamp(56px, 7vw, 90px) 0 clamp(40px, 5vw, 60px);
          position: relative; overflow: hidden;
        }
        .cfk-vr-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 40% at 50% 100%, ${C}0a 0%, transparent 60%);
        }
        .cfk-vr-container {
          max-width: 1320px; margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 40px); position: relative;
        }
        .cfk-vr-heading {
          font-family: var(--font-display); font-weight: 800;
          font-size: clamp(28px, 3.5vw, 44px); letter-spacing: -1.5px;
          color: #fff; line-height: 1.15; margin: 0 0 8px;
        }
        .cfk-vr-subtitle {
          font-family: var(--font-outfit); font-weight: 300;
          font-size: clamp(14px, 1.2vw, 16px); color: rgba(255,255,255,0.45);
          line-height: 1.7; margin: 0 0 clamp(28px, 3.5vw, 40px); max-width: 500px;
        }
        .cfk-vr-showcase {
          display: flex; gap: 14px;
          align-items: center; justify-content: center;
        }
        .cfk-vr-slot {
          flex-shrink: 0;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .cfk-vr-slot:hover { transform: translateY(-6px); }
        .cfk-vr-slot-tall { width: 200px; height: 340px; }
        .cfk-vr-slot-short { width: 180px; height: 270px; }
        .cfk-vr-slot-hero.cfk-vr-slot-tall { width: 220px; height: 380px; }

        /* Vertical card overrides */
        .cfk-vr-section .cfk-v-thumb { object-position: center 20%; }
        .cfk-vr-section .cfk-v-card { border-radius: 18px; }
        .cfk-vr-section .cfk-v-label span { font-size: 8px; }

        @media (max-width: 900px) {
          .cfk-vr-showcase { flex-wrap: nowrap; overflow-x: auto; justify-content: flex-start; padding-bottom: 8px; }
          .cfk-vr-showcase::-webkit-scrollbar { display: none; }
          .cfk-vr-slot-tall { width: 130px; height: 220px; }
          .cfk-vr-slot-short { width: 120px; height: 180px; }
          .cfk-vr-slot-hero.cfk-vr-slot-tall { width: 145px; height: 250px; }
        }
        @media (max-width: 560px) {
          .cfk-vr-slot-tall { width: 110px; height: 185px; }
          .cfk-vr-slot-short { width: 100px; height: 155px; }
          .cfk-vr-slot-hero.cfk-vr-slot-tall { width: 120px; height: 210px; }
        }
      `}</style>
    </section>
  );
}

// ─── AWARDS SECTION ──────────────────────────────────────────────────────────
function AwardsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const GOLD = KENYA_GOLD;
  const GOLD_BRIGHT = "#E0B85A";

  const [formData, setFormData] = useState({ orgName: "", contactName: "", email: "", phone: "", category: "", reason: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [awardsSelectedCountry, setAwardsSelectedCountry] = useState<CountryCode>(COUNTRY_CODES.find(c => c.country === "KE") || COUNTRY_CODES[0]);
  const [awardsPhoneError, setAwardsPhoneError] = useState<string | null>(null);
  const [awardsEmailError, setAwardsEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && !isWorkEmail(formData.email)) { setAwardsEmailError("Please use your work email address"); return; }
    const phoneErr = validatePhone(formData.phone, awardsSelectedCountry);
    if (phoneErr) { setAwardsPhoneError(phoneErr); return; }
    const result = await submitForm({ type: "awards", full_name: formData.contactName, email: formData.email, company: formData.orgName, phone: `${awardsSelectedCountry.code} ${formData.phone}`, event_name: "Cyber First East Africa 2026", metadata: { category: formData.category, reason: formData.reason }, website: "" });
    if (result.success) {
      setFormSubmitted(true);
    } else {
      setAwardsEmailError(result.error || "Something went wrong. Please try again.");
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", padding: "13px 0", borderRadius: 0,
    backgroundColor: "transparent",
    border: "none",
    borderBottom: `1.5px solid ${focusedField === field ? GOLD : "rgba(255,255,255,0.10)"}`,
    boxShadow: focusedField === field ? `0 1px 0 ${GOLD}60` : "none",
    color: "white", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, outline: "none",
    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
  });

  // Trophy icons for each category
  const categoryIcons = [
    "M13 2L3 14h9l-1 8 10-12h-9l1-8z", // Innovation, lightning
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", // Resilience, shield
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", // Emerging, star
    "M3 21h18M3 10h18M3 7l9-4 9 4M5 10v11M19 10v11M9 21v-4a3 3 0 016 0v4", // Public Sector, building
    "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", // Zero Trust, eye
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", // Sentinel, shield-check
  ];

  return (
    <section ref={ref} id="awards" style={{ background: "linear-gradient(180deg, #0A0608 0%, #0B0708 40%, #0D0809 60%, #0A0608 100%)", padding: "clamp(60px, 7vw, 90px) 0", position: "relative", overflow: "hidden" }}>
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 10%, ${GOLD}07, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 40% at 10% 80%, ${C}04, transparent 60%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 35% at 90% 70%, ${GOLD}04, transparent 60%)` }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>

        {/* ═══ TOP: Header ═══ */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 28 }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.1, ease: EASE }} style={{ width: 60, height: 60, margin: "0 auto 22px", borderRadius: 16, background: `linear-gradient(145deg, ${GOLD}18, ${GOLD}06)`, border: `1px solid ${GOLD}28`, display: "flex", alignItems: "center", justifyContent: "flex-start", boxShadow: `0 8px 48px ${GOLD}15, inset 0 1px 0 ${GOLD}20` }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 1012 0V2z" />
            </svg>
          </motion.div>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 14 }}>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: GOLD }}>Awards & Recognition</span>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 56px)", letterSpacing: "-2px", color: "white", lineHeight: 1.05, margin: "12px 0 18px" }}>
            Cyber First Awards{" "}
            <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>East Africa 2026</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 350, color: "rgba(255,255,255,0.42)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Join us as we celebrate the Cyber First 2026 Awards, honoring those who demonstrate outstanding excellence and innovation in operational practices.
          </p>
          {/* Stats strip */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3, ease: EASE }} className="flex items-center justify-center gap-6 flex-wrap" style={{ padding: "16px 32px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", display: "inline-flex" }}>
            {[
              { num: "6", label: "Categories" },
              { num: "5", label: "Eligible Sectors" },
              { num: "2026", label: "Inaugural Edition" },
            ].map((s, si) => (
              <React.Fragment key={s.label}>
                {si > 0 && <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)" }} />}
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, letterSpacing: "-1px", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.num}</span>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.35)", letterSpacing: "0.5px" }}>{s.label}</span>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Decorative divider ── */}
        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={inView ? { opacity: 1, scaleX: 1 } : {}} transition={{ duration: 0.8, delay: 0.4, ease: EASE }} style={{ height: 1, margin: "0 auto 56px", maxWidth: 600, background: `linear-gradient(90deg, transparent, ${GOLD}25, ${GOLD}40, ${GOLD}25, transparent)` }} />

        {/* ═══ BOTTOM: Split, Form (40%) + Categories (60%) ═══ */}
        <div className="cfk-awards-split" style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 36, alignItems: "start" }}>

          {/* ── LEFT: Nomination Form (Glass Card) ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="cfk-form-glass"
            style={{
              padding: "clamp(28px,3vw,40px)",
              borderRadius: 24,
              background: "linear-gradient(170deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(255,255,255,0.02), 0 24px 80px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.04)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glass reflections */}
            <div className="absolute pointer-events-none" style={{ top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 70%, transparent 95%)` }} />
            <div className="absolute pointer-events-none" style={{ top: -50, right: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}0A, transparent 70%)`, filter: "blur(50px)" }} />
            <div className="absolute pointer-events-none" style={{ bottom: -50, left: -30, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${C}06, transparent 70%)`, filter: "blur(45px)" }} />
            {/* Corner glow */}
            <div className="absolute pointer-events-none" style={{ top: 0, left: 0, width: 120, height: 120, background: `radial-gradient(circle at 0 0, ${GOLD}08, transparent 70%)` }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: `${GOLD}0C`, border: `1px solid ${GOLD}22`, marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, boxShadow: `0 0 8px ${GOLD}80`, animation: "cfkPulse 2s ease-in-out infinite" }} />
                <span style={{ fontFamily: "var(--font-dm)", fontSize: 13, fontWeight: 600, color: GOLD, letterSpacing: "0.5px" }}>Nominations Open</span>
              </div>

              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.2vw,26px)", letterSpacing: "-0.5px", color: "white", lineHeight: 1.15, margin: "0 0 6px" }}>
                Submit Your Nomination
              </h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 350, color: "rgba(255,255,255,0.38)", lineHeight: 1.6, margin: "0 0 28px" }}>
                Know a leader who deserves recognition? Self-nominations are welcome.
              </p>

              {!formSubmitted ? (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 28 }}>
                    <div className="cfk-input-group">
                      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: 4, display: "block" }}>Organisation</label>
                      <input type="text" placeholder="Company or Institution" required value={formData.orgName} onChange={(e) => setFormData({ ...formData, orgName: e.target.value })} onFocus={() => setFocusedField("orgName")} onBlur={() => setFocusedField(null)} style={inputStyle("orgName")} />
                    </div>
                    <div className="cfk-input-group">
                      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: 4, display: "block" }}>Contact Person</label>
                      <input type="text" placeholder="Full Name" required value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} onFocus={() => setFocusedField("contactName")} onBlur={() => setFocusedField(null)} style={inputStyle("contactName")} />
                    </div>

                    <div className="cfk-input-group">
                      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: 4, display: "block" }}>Email</label>
                      <input type="email" placeholder="Work Email Address" required value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setAwardsEmailError(null); }} onFocus={() => setFocusedField("email")} onBlur={() => { setFocusedField(null); if (formData.email && !isWorkEmail(formData.email)) setAwardsEmailError("Please use your work email address"); }} style={inputStyle("email")} />
                      {awardsEmailError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "6px 0 0" }}>{awardsEmailError}</p>}
                    </div>

                    <div className="cfk-input-group">
                      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: 4, display: "block" }}>Phone</label>
                      <div style={{ display: "flex", gap: 12, alignItems: "end" }}>
                        <select value={`${awardsSelectedCountry.code}|${awardsSelectedCountry.country}`} onChange={(e) => { const [code, country] = e.target.value.split("|"); const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country); if (c) { setAwardsSelectedCountry(c); setAwardsPhoneError(null); } }} onFocus={() => setFocusedField("countryCode")} onBlur={() => setFocusedField(null)} style={{ ...inputStyle("countryCode"), width: 100, flexShrink: 0, cursor: "pointer", appearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 4px center" }}>
                          {COUNTRY_CODES.map((cc) => (<option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: "#222", background: "#fff" }}>{cc.country} {cc.code}</option>))}
                        </select>
                        <input type="tel" placeholder={awardsSelectedCountry.placeholder} value={formData.phone} onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setAwardsPhoneError(null); }} onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} maxLength={awardsSelectedCountry.length} style={{ ...inputStyle("phone"), flex: 1 }} />
                      </div>
                      {awardsPhoneError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "6px 0 0" }}>{awardsPhoneError}</p>}
                    </div>

                    <div className="cfk-input-group">
                      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: 4, display: "block" }}>Award Category</label>
                      <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} onFocus={() => setFocusedField("category")} onBlur={() => setFocusedField(null)} style={{ ...inputStyle("category"), cursor: "pointer", appearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23707070' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 4px center", color: formData.category ? "white" : "rgba(255,255,255,0.3)" }}>
                        <option value="" disabled style={{ color: "#555", background: "#111" }}>Select Category</option>
                        {AWARDS_DATA.map((a) => (<option key={a.title} value={a.title} style={{ color: "white", background: "#111" }}>{a.title}</option>))}
                      </select>
                    </div>

                    <div className="cfk-input-group">
                      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: 4, display: "block" }}>Reason for Nomination</label>
                      <textarea placeholder="Why should this nominee be considered?" required rows={3} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} onFocus={() => setFocusedField("reason")} onBlur={() => setFocusedField(null)} style={{ ...inputStyle("reason"), resize: "vertical", minHeight: 80, borderBottom: `1.5px solid ${focusedField === "reason" ? GOLD : "rgba(255,255,255,0.10)"}` }} />
                    </div>
                  </div>

                  <button type="submit" className="cfk-nominate-btn" style={{ width: "100%", padding: "16px 32px", borderRadius: 14, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, border: "none", color: "#0A0A0A", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, letterSpacing: "-0.2px", cursor: "pointer", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", boxShadow: `0 4px 24px ${GOLD}25`, position: "relative", overflow: "hidden" }}>
                    <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 8 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                      Submit Nomination
                    </span>
                  </button>

                  <p style={{ textAlign: "center", fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.2)", marginTop: 16 }}>
                    Free to nominate · Open to all sectors
                  </p>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }} style={{ textAlign: "center", padding: "40px 12px" }}>
                  <div style={{ width: 60, height: 60, borderRadius: 16, background: `${GOLD}12`, border: `1px solid ${GOLD}30`, display: "flex", alignItems: "center", justifyContent: "flex-start", margin: "0 auto 18px", boxShadow: `0 8px 40px ${GOLD}15` }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "white", margin: "0 0 8px" }}>Nomination Submitted</h4>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>Thank you. Our committee will review your submission shortly.</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ── RIGHT: Award Categories (60%) ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          >
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(20px,2.2vw,26px)", color: "white", margin: "0 0 8px", letterSpacing: "-0.5px" }}>2026 Award Categories</h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, color: "rgba(255,255,255,0.38)", margin: 0, lineHeight: 1.6 }}>We&apos;ll shine a spotlight on the visionaries and organizations leading the way in technological advancements.</p>
            </div>

            {/* Category Cards, 2-col grid */}
            <div className="cfk-awards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {AWARDS_DATA.map((award, i) => (
                <motion.div
                  key={award.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.35 + i * 0.07, ease: EASE }}
                  className="cfk-award-card"
                  style={{
                    padding: "22px 20px 22px 24px",
                    borderRadius: 16,
                    background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
                    border: "1px solid rgba(255,255,255,0.06)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {/* Left gold accent */}
                  <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 3, background: `${GOLD}20`, borderRadius: "0 2px 2px 0", transition: "all 0.35s" }} className="cfk-award-accent" />
                  {/* Hover shimmer line */}
                  <div className="cfk-award-shimmer" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}00, transparent)`, transition: "background 0.5s" }} />

                  {/* Icon + Number header */}
                  <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${GOLD}08`, border: `1px solid ${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "flex-start", flexShrink: 0, transition: "all 0.35s" }} className="cfk-award-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={`${GOLD}50`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={categoryIcons[i]} /></svg>
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 200, fontSize: 28, letterSpacing: "-2px", color: `${GOLD}18`, lineHeight: 1, transition: "color 0.35s", marginLeft: "auto" }} className="cfk-award-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 600, color: "rgba(255,255,255,0.82)", margin: "0 0 8px", lineHeight: 1.35 }}>
                    {award.title}
                  </h4>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12.5, color: "rgba(255,255,255,0.32)", lineHeight: 1.65, margin: 0 }}>
                    {award.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Eligibility */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
              style={{ marginTop: 20, padding: "22px 24px", borderRadius: 16, background: "linear-gradient(145deg, rgba(212,168,75,0.04), rgba(212,168,75,0.01))", border: `1px solid ${GOLD}12` }}
            >
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "white", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${GOLD}0C`, border: `1px solid ${GOLD}18`, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                Who Can Be Nominated
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {AWARDS_ELIGIBILITY.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: `${GOLD}0A`, border: `1px solid ${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "flex-start", flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={`${GOLD}80`} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </div>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12.5, fontWeight: 450, color: "rgba(255,255,255,0.5)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes cfkPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .cfk-award-card:hover {
          background: linear-gradient(145deg, rgba(212,168,75,0.07), rgba(212,168,75,0.02)) !important;
          border-color: rgba(212,168,75,0.20) !important;
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(212,168,75,0.06);
        }
        .cfk-award-card:hover .cfk-award-accent {
          background: ${GOLD} !important;
          top: 0% !important;
          bottom: 0% !important;
          box-shadow: 0 0 12px ${GOLD}40;
        }
        .cfk-award-card:hover .cfk-award-num {
          color: rgba(212,168,75,0.5) !important;
        }
        .cfk-award-card:hover .cfk-award-icon {
          background: rgba(212,168,75,0.12) !important;
          border-color: rgba(212,168,75,0.25) !important;
        }
        .cfk-award-card:hover .cfk-award-icon svg {
          stroke: ${GOLD} !important;
        }
        .cfk-award-card:hover .cfk-award-shimmer {
          background: linear-gradient(90deg, transparent, ${GOLD}30, transparent) !important;
        }
        .cfk-nominate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 36px rgba(212,168,75,0.4) !important;
        }
        .cfk-nominate-btn:active {
          transform: translateY(0);
        }
        .cfk-form-glass:hover {
          border-color: rgba(255,255,255,0.12) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(255,255,255,0.02), 0 24px 80px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.06), 0 0 80px rgba(212,168,75,0.04) !important;
        }
        @media (max-width: 900px) {
          .cfk-awards-split { grid-template-columns: 1fr !important; }
          .cfk-awards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── SPLIT CTA ───────────────────────────────────────────────────────────────
function SplitCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="enquire"
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(40px,5vw,60px) 0",
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${CF_UAE}/ARU01180.jpg`}
          alt="Cyber First East Africa 2026 cybersecurity conference Nairobi"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.15) saturate(0.6)" }}
        />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, #090506 0%, transparent 20%, transparent 80%, #090506 100%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${KENYA_ACCENT}08, transparent 70%)` }} />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ textAlign: "center", marginBottom: 8, position: "relative", zIndex: 1 }}
      >
        <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
          <span style={{ width: 30, height: 1, background: C }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C }}>
            Join Us
          </span>
          <span style={{ width: 30, height: 1, background: C }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.08, margin: "12px 0 0" }}>
          Be Part of{" "}
          <span style={{ backgroundImage: `linear-gradient(135deg, ${C_BRIGHT}, #FF4D5A)`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
            Cyber First East Africa
          </span>
        </h2>
      </motion.div>

      {/* InquiryForm with overridden styles */}
      <div id="register" className="cfk-form-wrapper" style={{ position: "relative", zIndex: 1 }}>
        <InquiryForm defaultCountry="KE" eventName="Cyber First East Africa 2026" hideLabel />
      </div>

      <style jsx global>{`
        /* Transparent background, let event photo show through */
        .cfk-form-wrapper #get-involved {
          background: transparent !important;
        }
        .cfk-form-wrapper #get-involved > .absolute {
          display: none;
        }

        /* Glass morphism on form card */
        .cfk-form-wrapper .inquiry-split > div:last-child {
          background: rgba(5, 8, 16, 0.82) !important;
          backdrop-filter: blur(32px) saturate(1.2) !important;
          -webkit-backdrop-filter: blur(32px) saturate(1.2) !important;
          border: 1px solid rgba(1, 187, 245, 0.15) !important;
          box-shadow: 0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }

        /* Tab pills, Kenya/Cyber themed */
        .cfk-form-wrapper button[style*="background: var(--orange)"] {
          background: ${C} !important;
          border-color: ${C} !important;
        }
        
        /* Prominent tab buttons */
        .cfk-form-wrapper #get-involved > div > div:first-child button {
          padding: 16px 36px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          border-radius: 50px !important;
          letter-spacing: 0.5px !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          min-width: 140px !important;
        }
        .cfk-form-wrapper #get-involved > div > div:first-child button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
        }

        /* Form card ambient glow, cyan instead of orange */
        .cfk-form-wrapper .inquiry-split > div:last-child > .absolute {
          background: radial-gradient(ellipse, rgba(1,187,245,0.06) 0%, transparent 70%) !important;
        }

        /* Submit button, keep orange (EFG brand) */

        /* Section label, cyan */
        .cfk-form-wrapper [style*="var(--orange)"][style*="letter-spacing: 3px"] {
          color: ${C} !important;
        }

        /* Perk icons, cyan tint */
        .cfk-form-wrapper .inquiry-split svg {
          color: ${C};
        }
      `}</style>
    </section>
  );
}

// ─── CONTACT SECTION ─────────────────────────────────────────────────────────
function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // All team members for people-first design
  const teamMembers = [
    {
      ...CFK_CONTACTS.speaking,
      category: "Speaking Enquiries",
      photo: CFK_CONTACTS.speaking.photo,
    },
    ...CFK_CONTACTS.sponsorship.map((p) => ({
      ...p,
      category: "Sponsorship Enquiries",
    })),
  ];

  return (
    <section
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0A0607 100%)",
        padding: "clamp(80px, 10vw, 120px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 30%, ${C}12, transparent 70%)` }} />
      
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 12, fontWeight: 600, letterSpacing: "4px", textTransform: "uppercase", color: C_BRIGHT }}>
            Your Direct Line
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-2px", color: "white", lineHeight: 1.05, margin: "16px 0 0" }}>
            Meet Your{" "}
            <span style={{ background: `linear-gradient(135deg, ${C_BRIGHT}, ${KENYA_ACCENT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Dedicated Team
            </span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 17, color: "rgba(255,255,255,0.5)", marginTop: 16, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
            Real people, ready to help you make the most of Cyber First East Africa
          </p>
        </motion.div>

        {/* People Grid - 3 columns */}
        <div className="cfk-team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {teamMembers.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="cfk-person-card"
              style={{
                textAlign: "center",
                padding: "56px 36px 44px",
                borderRadius: 32,
                background: "linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.1) 100%)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.12)",
                position: "relative",
                overflow: "hidden",
                boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 12px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)`,
              }}
            >
              {/* Top shine/reflection */}
              <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }} />
              
              {/* Category badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, background: "rgba(0,0,0,0.3)", border: `1px solid ${C_BRIGHT}40`, marginBottom: 32, boxShadow: `0 2px 12px ${C}20, inset 0 1px 0 rgba(255,255,255,0.05)` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 8px ${C_BRIGHT}` }} />
                <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>{person.category}</span>
              </div>

              {/* Photo */}
              <div className="cfk-photo-wrapper" style={{ width: 160, height: 160, margin: "0 auto 28px", borderRadius: "50%", position: "relative" }}>
                <div className="cfk-photo-ring" style={{ position: "absolute", inset: -4, borderRadius: "50%", background: `conic-gradient(from 0deg, ${C_BRIGHT}, ${KENYA_ACCENT}, ${C_BRIGHT})`, opacity: 0.9 }} />
                <div style={{ position: "absolute", inset: -4, borderRadius: "50%", boxShadow: `0 0 40px ${C_BRIGHT}40, 0 0 80px ${C_BRIGHT}20`, pointerEvents: "none" }} />
                <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", padding: 4, background: "#0a0a0a" }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#1a1a1a" }}>
                    {person.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={person.photo} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start", background: `linear-gradient(135deg, ${C}50, ${C}20)` }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 700, color: "white" }}>{person.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "white", margin: "0 0 8px", letterSpacing: "-0.5px", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>{person.name}</h3>

              {/* Role */}
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, background: `linear-gradient(135deg, ${C_BRIGHT}, ${KENYA_ACCENT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: "0 0 32px" }}>{person.role}</p>

              {/* Contact Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 1 }}>
                <a href={`mailto:${person.email}`} className="cfk-contact-btn" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10, padding: "14px 20px", borderRadius: 14, background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)", transition: "all 0.3s ease" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.7 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg>
                  {person.email}
                </a>
                <a href={`https://wa.me/${person.phone.replace(/[\s+]/g, "")}`} target="_blank" rel="noopener noreferrer" className="cfk-whatsapp-btn" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10, padding: "16px 20px", borderRadius: 14, background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, color: "white", textDecoration: "none", boxShadow: "0 4px 20px rgba(37, 211, 102, 0.35), 0 8px 32px rgba(37, 211, 102, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)", transition: "all 0.3s ease" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .cfk-person-card { transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1) !important; }
        .cfk-person-card:hover { transform: translateY(-12px) scale(1.02) !important; border-color: rgba(255,255,255,0.2) !important; box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 24px 80px rgba(0,0,0,0.4), 0 0 60px ${C}15, inset 0 1px 0 rgba(255,255,255,0.15) !important; }
        .cfk-photo-wrapper { transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
        .cfk-person-card:hover .cfk-photo-wrapper { transform: scale(1.08); }
        .cfk-contact-btn:hover { background: rgba(255,255,255,0.12) !important; border-color: rgba(255,255,255,0.2) !important; transform: translateY(-2px); }
        .cfk-whatsapp-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 6px 28px rgba(37, 211, 102, 0.45), 0 12px 40px rgba(37, 211, 102, 0.25), inset 0 1px 0 rgba(255,255,255,0.25) !important; }
        @media (max-width: 900px) { .cfk-team-grid { grid-template-columns: 1fr !important; max-width: 420px !important; margin: 0 auto !important; } }
        @media (min-width: 901px) and (max-width: 1100px) { .cfk-team-grid { grid-template-columns: repeat(2, 1fr) !important; } .cfk-team-grid > div:last-child { grid-column: 1 / -1; max-width: 420px; margin: 0 auto; } }
      `}</style>
    </section>
  );
}

// ─── VENUE ───────────────────────────────────────────────────────────────────
function Venue() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-100px" });
  const headingInView = useInView(sectionRef, { once: true, margin: "-20%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-5%", "15%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);

  const venueDetails = [
    { icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z", label: "Location", value: "Nairobi, Kenya" },
    { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Date", value: "Wednesday, 8 July 2026" },
    { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Time", value: "8:00 AM, 5:00 PM (EAT)" },
    { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", label: "Format", value: "Full-day conference + networking" },
  ];

  return (
    <section id="venue" ref={sectionRef} style={{ background: "#050303", position: "relative" }}>
      {/* Hero Image, Full Bleed, Immersive */}
      <div style={{ position: "relative", height: "85vh", minHeight: 600, overflow: "hidden" }}>
        <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
          <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=85" alt="Nairobi Kenya venue" className="w-full h-full object-cover" style={{ filter: "brightness(0.5) saturate(1.15)", minHeight: "130%" }} />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, #050303 0%, rgba(5,3,3,0.7) 25%, rgba(5,3,3,0) 50%, rgba(5,3,3,0.2) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 100% 60% at 50% 100%, ${C}15, transparent 70%)` }} />
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 200px 60px rgba(0,0,0,0.5)" }} />

        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", textAlign: "center", padding: "0 clamp(24px, 5vw, 80px)", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={headingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 100, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>The Venue</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={headingInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(56px, 12vw, 140px)", letterSpacing: "-0.04em", color: "white", lineHeight: 0.95, margin: "0 0 16px", textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}>
            <span style={{ background: `linear-gradient(135deg, ${C_BRIGHT}, ${KENYA_ACCENT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Nairobi</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={headingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 400, color: "rgba(255,255,255,0.6)", margin: 0, letterSpacing: "0.5px" }}>Kenya&apos;s Silicon Savannah</motion.p>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }} style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 2 }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} style={{ width: 24, height: 40, borderRadius: 12, border: "2px solid rgba(255,255,255,0.3)", display: "flex", justifyContent: "flex-start", paddingTop: 8 }}>
            <motion.div animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} style={{ width: 4, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.5)" }} />
          </motion.div>
        </motion.div>
      </div>

      {/* Details Card */}
      <div ref={cardRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", position: "relative", zIndex: 3, marginTop: -120 }}>
        <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ background: "linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.1) 100%)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 32, padding: "clamp(36px, 5vw, 56px)", boxShadow: "0 4px 24px rgba(0,0,0,0.3), 0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />
          <div className="cfk-venue-inner" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "clamp(32px, 5vw, 64px)", alignItems: "center" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(24px, 3vw, 32px)", color: "white", letterSpacing: "-0.5px", margin: "0 0 16px" }}>East Africa&apos;s Premier Cybersecurity Summit</h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 400, fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: "0 0 32px" }}>Join industry leaders, government officials, and technology innovators in the heart of Kenya&apos;s thriving tech ecosystem.</p>
              <a href="https://maps.google.com/?q=Nairobi+Kenya" target="_blank" rel="noopener noreferrer" className="cfk-maps-btn" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 28px", borderRadius: 16, background: `linear-gradient(135deg, ${C_BRIGHT}, ${C})`, color: "white", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, textDecoration: "none", boxShadow: `0 4px 20px ${C}40, inset 0 1px 0 rgba(255,255,255,0.2)`, transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                View on Map
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
              </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {venueDetails.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }} className="cfk-detail-card" style={{ padding: "24px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, transition: "all 0.3s ease" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${C}15`, border: `1px solid ${C}25`, display: "flex", alignItems: "center", justifyContent: "flex-start", marginBottom: 16 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
                  </div>
                  <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "2px", display: "block", marginBottom: 6 }}>{item.label}</span>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.9)", lineHeight: 1.4 }}>{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ height: "clamp(80px, 10vw, 120px)" }} />

      <style jsx global>{`
        .cfk-maps-btn:hover { transform: translateY(-3px) !important; box-shadow: 0 8px 32px ${C}50, inset 0 1px 0 rgba(255,255,255,0.25) !important; }
        .cfk-detail-card:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.1) !important; transform: translateY(-2px); }
        @media (max-width: 768px) { .cfk-venue-inner { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── REGISTRATION SECTION ────────────────────────────────────────────────────
function RegistrationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="register" ref={ref} style={{ background: "#0C0809", padding: "clamp(60px, 7vw, 90px) 0", position: "relative" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${KENYA_ACCENT}12, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 40% at 30% 80%, ${C}08, transparent 60%)` }} />

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", textAlign: "center", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-2px", color: "white", lineHeight: 1.1, margin: "0 0 16px" }}>
            Join Us in<br /><span style={{ color: KENYA_ACCENT }}>Nairobi</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
            Be part of the Cyber First Movement and lead the charge toward a strategic, resilient, and innovative digital economy in the Silicon Savannah.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "flex-start", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "18px 40px", borderRadius: 50, background: `linear-gradient(135deg, ${C}, ${C_DIM})`, color: "white", fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: `0 8px 32px ${C}35`, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${C_BRIGHT}, ${C})`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${C}50`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${C}, ${C_DIM})`; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 32px ${C}35`; }}
            >
              Register Now <span>→</span>
            </Link>
            <Link
              href="/contact"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "18px 40px", borderRadius: 50, background: "transparent", color: "white", fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
