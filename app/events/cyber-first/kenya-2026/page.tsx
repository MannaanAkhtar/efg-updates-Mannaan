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

const MARKET_STATS = [
  { value: "29.9", prefix: "KES ", suffix: "B", label: "Cybercrime Losses", note: "Economic impact in 2025", highlight: true, trend: "+38%", trendDir: "up" as const },
  { value: "247", suffix: "%", label: "Annual Threat Increase", note: "Cybersecurity incidents in 2025", trend: "+112%", trendDir: "up" as const },
  { value: "96", suffix: "%", label: "Talent Shortage", note: "Only 1,700 of 40,000 experts needed", trend: "+4%", trendDir: "up" as const },
  { value: "4.5", suffix: "B", label: "Threats Detected", note: "Oct–Dec 2025, 441% jump", trend: "+441%", trendDir: "up" as const },
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

const KEY_THREATS = [
  { threat: "DDoS Attacks", stat: "46,786+", note: "Highest in East Africa, 3rd on continent" },
  { threat: "Ransomware (Healthcare)", stat: "95%", note: "Escalation in attacks" },
  { threat: "Ransomware (Manufacturing)", stat: "26%", note: "Of all incidents" },
  { threat: "System Misconfigurations", stat: "70.9M", note: "Malware attacks enabled" },
  { threat: "Security Advisories", stat: "21.8M", note: "Sent by KE-CIRT/CC" },
];

// Kenya Advisory Board (key government & policy leaders from brochure)
const ADVISORY_BOARD = [
  {
    name: "Eng. John Kipchumba Tanui",
    title: "Principal Secretary, State Department of ICT and Digital Economy",
    org: "Government of Kenya",
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
    photo: null,
  },
];

// Gallery images — Cyber First series only (Kuwait 2025 S3 + UAE 2025 WordPress)
const CF_UAE = "https://uae.cyberfirstseries.com/wp-content/uploads/2025/10";
const GALLERY: {
  src: string;
  alt: string;
  area: string;
  rotate?: number;
  lift?: boolean;
}[] = [
  {
    src: `${CF_UAE}/ARU00511.jpg`,
    alt: "Cyber First keynote session",
    area: "hero",
  },
  {
    src: `${S3}/events/Cyber+First+Kuwait+2025/Kuwait+Photos/Kuwait+Photos/4X9A1744.jpg`,
    alt: "Cyber First Kuwait panel",
    area: "a",
    rotate: -1.5,
    lift: true,
  },
  {
    src: `${CF_UAE}/ARU00500.jpg`,
    alt: "Panel discussion",
    area: "b",
  },
  {
    src: `${CF_UAE}/ARU00418.jpg`,
    alt: "Awards ceremony",
    area: "c",
    rotate: 1.2,
    lift: true,
  },
  {
    src: `${S3}/events/Cyber+First+Kuwait+2025/Kuwait+Photos/Kuwait+Photos/4X9A1576.jpg`,
    alt: "Cyber First Kuwait networking",
    area: "d",
  },
  {
    src: `${CF_UAE}/ARU01167.jpg`,
    alt: "Executive networking session",
    area: "e",
  },
];

// Kenya Growth Projections (1st edition)
const GROWTH = [
  {
    year: 2024,
    delegates: 280,
    speakers: 24,
    sponsors: 22,
    media: 15,
    extra: "UAE Edition · 4 Panel Discussions · 6 Supporting Partners",
    past: true,
  },
  {
    year: 2025,
    delegates: 310,
    speakers: 25,
    sponsors: 25,
    media: 17,
    extra: "Kuwait Edition · 6-Hour Live Hackathon · 9 Supporting Partners",
    past: true,
  },
  {
    year: 2026,
    delegates: 200,
    speakers: 20,
    sponsors: 10,
    media: 10,
    extra: "East Africa · Inaugural Nairobi Edition · 4 Panels · 6 Awards",
    active: true,
  },
];

// Sponsor tiers for Kenya
// Marquee Row 1 — past / credibility logos
const MARQUEE_ROW_1 = [
  { name: "Palo Alto Networks", logo: `${S3_LOGOS}/paloalto.png` },
  { name: "SentinelOne", logo: `${S3_LOGOS}/sentinelone.png` },
  { name: "Google Cloud", logo: `${S3_LOGOS}/Google-Cloud-Security.png` },
  { name: "Kaspersky", logo: `${S3_LOGOS}/kaspersky.png` },
  { name: "Akamai", logo: `${S3_LOGOS}/Akamai.png` },
  { name: "Secureworks", logo: `${S3_LOGOS}/secureworks.png` },
];

// Marquee Row 2 — series-wide sponsors
const MARQUEE_ROW_2 = [
  { name: "Google Cloud Security", logo: `${S3_LOGOS}/Google-Cloud-Security.png` },
  { name: "Anomali", logo: `${S3_LOGOS}/Anomali.png` },
  { name: "OPSWAT", logo: `${S3_LOGOS}/OPSWAT-logo.png` },
  { name: "Pentera", logo: `${S3_LOGOS}/PENTERA.png` },
  { name: "HWG", logo: `${S3_LOGOS}/hwg-here-we-go.png` },
  { name: "AmiViz", logo: `${S3_LOGOS}/AmiViz.png` },
  { name: "Securonix", logo: `${S3_LOGOS}/Securonix-logo.png` },
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
        .cfk-stat-card:hover {
          transform: translateY(-4px) !important;
          border-color: ${C_BRIGHT}35 !important;
          box-shadow: 0 12px 40px ${C}18, inset 0 1px 0 ${C_BRIGHT}12 !important;
        }
        @media (max-width: 1024px) {
          .cfk-stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .cfk-hero h1 { font-size: clamp(28px, 9vw, 42px) !important; }
          .cfk-hero-content { padding: 0 20px !important; }
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
      <ThreatLandscape />
      <FocusAreas />
      <AdvisoryBoard />
      <Speakers />
      <AgendaTimeline />
      <SponsorsSection />
      <GrowthStory />
      <AtmosphereDivider />
      <Gallery />
      <WhatToExpect />
      <WhoShouldAttend />
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
    <section id="overview" className="cfk-hero" style={{ position: "relative", height: "100vh", minHeight: 700, overflow: "hidden", background: "#0A0608" }}>
      {/* Nairobi Skyline Background */}
      <div className="absolute inset-0">
        <img
          src="https://efg-final.s3.eu-north-1.amazonaws.com/cyber-first-kenya/nairobi-skyline.jpg"
          alt="Nairobi Skyline with Cyber Network"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.45) saturate(1.1)" }}
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(90deg, rgba(10,6,8,0.95) 0%, rgba(10,6,8,0.7) 40%, rgba(10,6,8,0.4) 70%, rgba(10,6,8,0.3) 100%)`, zIndex: 1 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, rgba(10,6,8,0.5) 0%, transparent 30%, transparent 70%, rgba(10,6,8,0.95) 100%)`, zIndex: 1 }} />

      {/* Subtle Kenya accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 80% 70%, ${KENYA_ACCENT}15, transparent 70%)`, zIndex: 2 }} />

      {/* Cyber effects */}
      <NeuralConstellation color={C} dotCount={25} connectionDistance={120} speed={0.15} opacity={0.05} />
      <DotMatrixGrid color={C} opacity={0.01} spacing={40} />

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${C}03 1px, transparent 1px), linear-gradient(90deg, ${C}03 1px, transparent 1px)`, backgroundSize: "50px 50px", opacity: 0.5, zIndex: 2 }} />

      {/* Content */}
      <div className="cfk-hero-content" style={{ position: "relative", zIndex: 10, height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 1320, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>

        {/* Silicon Savannah Badge */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", alignSelf: "flex-start", gap: 10, padding: "8px 16px", borderRadius: 30, background: `linear-gradient(135deg, ${C}15, ${KENYA_ACCENT}10)`, border: `1px solid ${C}30`, marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C_BRIGHT }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: C_BRIGHT }}>
            1st Edition · July 2026 · The Silicon Savannah
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: EASE }} style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(36px, 5.5vw, 72px)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#F0F2F5", margin: "0 0 12px", maxWidth: 750 }}>
          Beyond Firewalls
        </motion.h1>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: EASE }} style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(20px, 2.5vw, 32px)", lineHeight: 1.2, color: C_BRIGHT, margin: "0 0 28px", maxWidth: 600 }}>
          Strategic Cyber Defense for Kenya&apos;s Digital Age
        </motion.h2>

        {/* Description */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: EASE }} style={{ fontFamily: "var(--font-outfit)", fontWeight: 400, fontSize: "clamp(15px, 1.3vw, 17px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 520, marginBottom: 32 }}>
          East Africa&apos;s premier cybersecurity summit. Where C-level executives, technology leaders, and policymakers synchronize efforts against escalating digital warfare in the Silicon Savannah.
        </motion.p>

        {/* Location */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6, ease: EASE }} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={KENYA_ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
          </svg>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
            Nairobi, Kenya
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8, ease: EASE }} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="#get-involved" onClick={(e) => { e.preventDefault(); document.getElementById("get-involved")?.scrollIntoView({ behavior: "smooth" }); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 34px", borderRadius: 50, background: C, color: "white", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: `0 4px 24px ${C}35`, cursor: "pointer" }}>
            Reserve Your Seat <span>→</span>
          </a>
          <a href="#get-involved" onClick={(e) => { e.preventDefault(); document.getElementById("get-involved")?.scrollIntoView({ behavior: "smooth" }); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 50, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>
            Become a Sponsor
          </a>
        </motion.div>
      </div>

      {/* Bottom Countdown Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.2, ease: EASE }} className="absolute bottom-0 left-0 right-0" style={{ zIndex: 20, background: "rgba(10,6,8,0.92)", backdropFilter: "blur(16px)", borderTop: `1px solid ${C}20`, padding: "18px 0" }}>
        <div className="cfk-bottom-bar flex items-center justify-between flex-wrap gap-4" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ background: KENYA_ACCENT, opacity: 0.75 }} />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: KENYA_ACCENT }} />
            </span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: KENYA_ACCENT }}>1st Edition</span>
            <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 4px" }}>|</span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>Cyber First East Africa</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hrs" }, { v: cd.m, l: "Min" }, { v: cd.s, l: "Sec" }].map((u, i) => (
              <div key={u.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className="text-center">
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: C_BRIGHT, letterSpacing: "-1px", lineHeight: 1 }}>{String(u.v).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", color: "#505050", display: "block", marginTop: 2 }}>{u.l}</span>
                </div>
                {i < 3 && <span style={{ color: `${C}30`, fontSize: 20, fontWeight: 300, marginLeft: 4 }}>:</span>}
              </div>
            ))}
          </div>

          <a href="#get-involved" onClick={(e) => { e.preventDefault(); document.getElementById("get-involved")?.scrollIntoView({ behavior: "smooth" }); }} style={{ padding: "12px 28px", borderRadius: 50, background: C, fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, color: "white", textDecoration: "none", boxShadow: `0 4px 16px ${C}35`, cursor: "pointer" }}>
            Register Now →
          </a>
        </div>
      </motion.div>
    </section>
  );
}

// ─── STATS BAR ───────────────────────────────────────────────────────────────
function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const stats = [
    { n: 200, suffix: "+", label: "Delegates", desc: "C-Suite & Directors", badge: "Expected", highlight: true },
    { n: 20, suffix: "+", label: "Speakers", desc: "Industry Leaders", badge: "Confirmed" },
    { n: 10, suffix: "+", label: "Sessions", desc: "Conference Tracks", badge: "Planned" },
    { n: 10, suffix: "+", label: "Media Partners", desc: "Coverage & Reach", badge: "Confirmed" },
    { n: 6, suffix: "", label: "Awards", desc: "Industry Recognition", badge: "Categories" },
  ];

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(100px, 12vw, 150px) 0 clamp(100px, 12vw, 150px)", overflow: "hidden", background: "#0A0608" }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80" alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.08) saturate(0.3)" }} />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(10,6,8,0.97) 0%, rgba(10,6,8,0.5) 35%, rgba(10,6,8,0.5) 65%, rgba(10,6,8,0.97) 100%)" }} />

      {/* Pulsing radial glow */}
      <div className="absolute inset-0 pointer-events-none cfk-overview-glow" style={{ background: `radial-gradient(ellipse 50% 45% at 50% 30%, ${C}0D, transparent 70%)` }} />

      {/* Secondary warm glow — bottom right */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 35% 45% at 85% 70%, ${KENYA_ACCENT}06, transparent 60%)` }} />

      {/* Third glow — left accent */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 25% 35% at 10% 40%, ${C}08, transparent 60%)` }} />

      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 5%, ${C}30, ${C_BRIGHT}25, ${C}30, transparent 95%)` }} />

      {/* ── Text Block ── */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 3 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: 36 }}>
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 24 }}>
            <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT})` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT }}>Summit Overview</span>
            <span style={{ width: 28, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>

          {/* Headline — two-tier weight */}
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 40px)", letterSpacing: "-1.5px", color: "rgba(255,255,255,0.88)", lineHeight: 1.15, margin: "0 0 8px" }}>
            One Day. Six Tracks.
          </h2>
          <h2 className="cfk-hero-headline" style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(30px, 4vw, 48px)",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            margin: "0 0 12px",
            background: `linear-gradient(135deg, ${C_BRIGHT} 0%, #ffffff 50%, ${C_BRIGHT} 100%)`,
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            filter: `drop-shadow(0 0 30px ${C}25)`,
          }}>
            East Africa&apos;s Top 200+ Security Leaders.
          </h2>

          {/* Subtle underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${C_BRIGHT}, ${KENYA_ACCENT}, ${C_BRIGHT})`, borderRadius: 2, margin: "0 auto 24px" }}
          />
        </motion.div>

        {/* Context paragraphs with left accent bars */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15, ease: EASE }} style={{ marginBottom: 24 }}>
          <div style={{ borderLeft: `2px solid ${C_BRIGHT}45`, paddingLeft: 22, marginBottom: 22, maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.48)", lineHeight: 1.85, margin: 0 }}>
              Kenya&apos;s Silicon Savannah is accelerating through <span style={{ color: "rgba(255,255,255,0.88)", fontWeight: 500 }}>Digital Government, M-Pesa, Smart Cities, 5G rollout</span>, and the rapid adoption of AI and cloud-first strategies. Cybersecurity has become mission-critical to safeguard national infrastructure and enterprise operations.
            </p>
          </div>
          <div style={{ borderLeft: `2px solid ${C_BRIGHT}25`, paddingLeft: 22, maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.48)", lineHeight: 1.85, margin: 0 }}>
              The surge of <span style={{ color: "rgba(255,255,255,0.88)", fontWeight: 500 }}>ransomware, AI-driven cyberattacks, and supply-chain vulnerabilities</span> is creating unprecedented challenges. Organizations must navigate evolving regulations while addressing a <span style={{ color: C_BRIGHT, fontWeight: 500 }}>persistent shortage of skilled cyber professionals</span> across the region.
            </p>
          </div>
        </motion.div>

        {/* Who Attends tags — staggered entrance */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3, ease: EASE }} style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", display: "block", marginBottom: 12 }}>Who Attends</span>
          <div className="flex items-center justify-center flex-wrap gap-2 cfk-overview-tags">
            {["Invite-Only", "C-Suite & Directors", "Government & Policy", "15+ Industries"].map((tag, ti) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.45 + ti * 0.08, ease: EASE }}
                className="cfk-tag"
                style={{ padding: "7px 18px", borderRadius: 20, background: `${C_BRIGHT}08`, border: `1px solid ${C_BRIGHT}18`, fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: `${C_BRIGHT}CC`, transition: "all 0.3s ease" }}
              >{tag}</motion.span>
            ))}
          </div>
        </motion.div>

        {/* Event info anchor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 28 }}
          className="cfk-event-meta"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>08 July 2026</span>
          </div>
          <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>Nairobi, Kenya</span>
          </div>
          <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ background: KENYA_ACCENT, opacity: 0.6 }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: KENYA_ACCENT }} />
            </span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, color: KENYA_ACCENT, letterSpacing: "0.5px" }}>1st Edition</span>
          </div>
        </motion.div>
      </div>

      {/* ── Animated divider band ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5, ease: EASE }}
        style={{ maxWidth: 1200, margin: "60px auto 60px", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 3 }}
      >
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, ${C}15 15%, ${C}30 50%, ${C}15 85%, transparent 100%)` }} />
        {/* Center diamond accent */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(45deg)", width: 6, height: 6, background: C_BRIGHT, borderRadius: 1, boxShadow: `0 0 12px ${C_BRIGHT}40` }} />
      </motion.div>

      {/* ── Stat cards grid ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 3 }}>
        {/* Grid label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 28 }}
        >
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 9, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>By The Numbers</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.6, ease: EASE }} className="cfk-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="cfk-stat-card"
              initial={{ opacity: 0, y: 24, scale: 0.93 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.7 + i * 0.1, ease: EASE }}
              style={{
                padding: s.highlight ? "32px 22px 30px" : "28px 20px 26px",
                borderRadius: 20,
                background: s.highlight
                  ? `linear-gradient(145deg, ${C}1A 0%, ${C}08 50%, rgba(255,255,255,0.02) 100%)`
                  : "linear-gradient(155deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012))",
                backdropFilter: "blur(12px)",
                border: `1px solid ${s.highlight ? `${C_BRIGHT}35` : "rgba(255,255,255,0.07)"}`,
                position: "relative",
                overflow: "hidden",
                textAlign: "center",
                boxShadow: s.highlight
                  ? `0 8px 36px ${C}18, inset 0 1px 0 ${C_BRIGHT}18, 0 0 0 1px ${C}10`
                  : "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Top glow for highlight card */}
              {s.highlight && (
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${C}12, transparent 55%)` }} />
              )}

              {/* Left edge accent for highlight */}
              {s.highlight && (
                <div style={{ position: "absolute", top: "15%", bottom: "15%", left: 0, width: 2, background: `linear-gradient(180deg, transparent, ${C_BRIGHT}60, transparent)`, borderRadius: "0 2px 2px 0" }} />
              )}

              {/* Top accent line */}
              <div style={{ position: "absolute", top: 0, left: s.highlight ? "8%" : "20%", right: s.highlight ? "8%" : "20%", height: s.highlight ? 2 : 1.5, background: `linear-gradient(90deg, transparent, ${s.highlight ? `${C_BRIGHT}80` : `${C_BRIGHT}35`}, transparent)` }} />

              {/* Badge */}
              <div style={{ marginBottom: 16, position: "relative" }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 11px",
                  borderRadius: 20,
                  background: s.highlight ? `${C_BRIGHT}14` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${s.highlight ? `${C_BRIGHT}25` : "rgba(255,255,255,0.06)"}`,
                  fontFamily: "var(--font-dm)",
                  fontSize: 9,
                  fontWeight: 600,
                  color: s.highlight ? C_BRIGHT : "rgba(255,255,255,0.3)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}>
                  {s.highlight && <span style={{ width: 4, height: 4, borderRadius: "50%", background: C_BRIGHT, flexShrink: 0 }} />}
                  {s.badge}
                </span>
              </div>

              {/* Number */}
              <div className="cfk-stat-number" style={{
                fontFamily: "var(--font-display)",
                fontSize: s.highlight ? "clamp(44px, 5.5vw, 58px)" : "clamp(34px, 4.5vw, 44px)",
                fontWeight: 900,
                letterSpacing: "-2px",
                lineHeight: 1,
                position: "relative",
                transition: "all 0.4s ease",
                ...(s.highlight ? {
                  background: `linear-gradient(180deg, #ffffff 30%, ${C_BRIGHT} 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  filter: `drop-shadow(0 0 24px ${C}30)`,
                } : {
                  color: "white",
                }),
              }}>
                {inView ? <Counter to={s.n} suffix={s.suffix} /> : "0"}
              </div>

              {/* Animated underline under number */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.1, ease: EASE }}
                style={{ width: s.highlight ? 36 : 24, height: 2, background: s.highlight ? C_BRIGHT : `${C_BRIGHT}40`, borderRadius: 2, margin: "10px auto 0", transformOrigin: "center" }}
              />

              {/* Label */}
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: s.highlight ? 12 : 10, fontWeight: 700, color: s.highlight ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.5)", letterSpacing: s.highlight ? "2px" : "1.5px", textTransform: "uppercase", marginTop: 12, position: "relative" }}>{s.label}</div>

              {/* Description */}
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: s.highlight ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.22)", marginTop: 5, position: "relative", lineHeight: 1.4 }}>{s.desc}</div>

              {/* Bottom accent line */}
              <div style={{ position: "absolute", bottom: 0, left: s.highlight ? 16 : 24, right: s.highlight ? 16 : 24, height: s.highlight ? 2 : 1, background: s.highlight ? `linear-gradient(90deg, transparent, ${C_BRIGHT}45, transparent)` : "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)", borderRadius: 1 }} />

              {/* Corner dot accent for highlight */}
              {s.highlight && (
                <div style={{ position: "absolute", top: 14, right: 14, width: 5, height: 5, borderRadius: "50%", background: `${C_BRIGHT}30`, boxShadow: `0 0 8px ${C_BRIGHT}20` }} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 120, background: "linear-gradient(to bottom, transparent, #0C0809)", zIndex: 4 }} />
      {/* Bottom border line */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 10%, ${C}15, transparent 90%)`, zIndex: 5 }} />

      <style jsx global>{`
        @keyframes cfk-overview-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes cfk-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .cfk-overview-glow { animation: cfk-overview-pulse 8s ease-in-out infinite; }
        .cfk-hero-headline { animation: cfk-shimmer 8s ease-in-out infinite; }
        .cfk-tag:hover { background: ${C_BRIGHT}14 !important; border-color: ${C_BRIGHT}30 !important; }
        .cfk-stat-card:hover { transform: translateY(-5px) !important; border-color: ${C_BRIGHT}40 !important; box-shadow: 0 16px 48px ${C}20, inset 0 1px 0 ${C_BRIGHT}15 !important; }
        .cfk-stat-card:hover .cfk-stat-number { filter: drop-shadow(0 0 20px ${C_BRIGHT}30) !important; }
        @media (max-width: 1024px) {
          .cfk-stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .cfk-event-meta { gap: 16px !important; }
        }
        @media (max-width: 768px) {
          .cfk-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cfk-overview-tags { gap: 6px !important; }
          .cfk-event-meta { flex-direction: column !important; gap: 10px !important; }
          .cfk-event-meta > span[style*="width: 1px"] { display: none !important; }
        }
        @media (max-width: 480px) {
          .cfk-stats-grid { gap: 10px !important; }
          .cfk-stats-grid > div { padding: 20px 14px 18px !important; border-radius: 16px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── SILICON SAVANNAH CONTEXT ────────────────────────────────────────────────
function SiliconSavannahContext() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(100px, 12vw, 160px) 0", overflow: "hidden", background: "#0A0608" }}>
      {/* Background photo — Nairobi skyline */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=1200&q=70" alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" style={{ filter: "brightness(0.06) saturate(0.3) contrast(1.3)" }} />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(10,6,8,0.97) 0%, rgba(10,6,8,0.5) 30%, rgba(10,6,8,0.5) 70%, rgba(10,6,8,0.97) 100%)" }} />

      {/* Atmospheric glows */}
      <div className="absolute inset-0 pointer-events-none cfk-whynow-pulse" style={{ background: `radial-gradient(ellipse 50% 40% at 50% 30%, ${C}0A, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 35% 40% at 80% 65%, ${KENYA_ACCENT}06, transparent 60%)` }} />

      {/* Floating orbs */}
      <div className="absolute pointer-events-none cfk-whynow-orb1" style={{ width: 450, height: 450, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${C}18, ${C}06 50%, transparent 70%)`, filter: "blur(80px)", top: "8%", left: "5%", zIndex: 1 }} />
      <div className="absolute pointer-events-none cfk-whynow-orb2" style={{ width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle at 60% 60%, ${KENYA_ACCENT}12, ${KENYA_ACCENT}04 50%, transparent 70%)`, filter: "blur(70px)", bottom: "10%", right: "8%", zIndex: 1 }} />
      <div className="absolute pointer-events-none cfk-whynow-orb3" style={{ width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle at 50% 50%, ${C_BRIGHT}0C, transparent 60%)`, filter: "blur(60px)", top: "55%", left: "45%", zIndex: 1 }} />

      {/* Africa continent outline with threat pulse points */}
      <div className="absolute inset-0 pointer-events-none" style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, top: "-5%" }}>
        <svg viewBox="0 0 600 700" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "min(90vw, 900px)", height: "auto", opacity: 1 }}>
          {/* Africa outline — dotted wireframe */}
          <path
            d="M295 45 L310 40 L340 48 L365 42 L380 50 L395 48 L410 55 L420 70 L415 90 L425 105 L440 115 L450 130 L458 150 L455 170 L460 190 L470 210 L478 235 L480 260 L475 285 L480 310 L490 330 L500 355 L505 380 L500 405 L490 425 L475 440 L460 450 L445 465 L425 480 L410 500 L395 515 L380 530 L365 540 L350 555 L335 565 L320 580 L310 595 L300 610 L285 620 L270 610 L255 595 L245 575 L235 555 L225 535 L215 510 L205 485 L195 460 L185 440 L175 425 L165 405 L155 385 L150 365 L148 340 L150 315 L155 290 L152 265 L145 240 L140 215 L142 190 L148 170 L155 155 L165 140 L175 125 L185 112 L195 100 L205 90 L215 78 L228 68 L240 60 L255 52 L270 48 L285 45 Z"
            stroke={C}
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeOpacity="0.4"
            fill="none"
          />
          {/* Inner fill for subtle depth */}
          <path
            d="M295 45 L310 40 L340 48 L365 42 L380 50 L395 48 L410 55 L420 70 L415 90 L425 105 L440 115 L450 130 L458 150 L455 170 L460 190 L470 210 L478 235 L480 260 L475 285 L480 310 L490 330 L500 355 L505 380 L500 405 L490 425 L475 440 L460 450 L445 465 L425 480 L410 500 L395 515 L380 530 L365 540 L350 555 L335 565 L320 580 L310 595 L300 610 L285 620 L270 610 L255 595 L245 575 L235 555 L225 535 L215 510 L205 485 L195 460 L185 440 L175 425 L165 405 L155 385 L150 365 L148 340 L150 315 L155 290 L152 265 L145 240 L140 215 L142 190 L148 170 L155 155 L165 140 L175 125 L185 112 L195 100 L205 90 L215 78 L228 68 L240 60 L255 52 L270 48 L285 45 Z"
            stroke={C}
            strokeWidth="0.8"
            strokeOpacity="0.12"
            fill={`${C}06`}
          />

          {/* Nairobi — main pulse (brightest, largest) */}
          <circle cx="420" cy="340" r="5" fill={C_BRIGHT}>
            <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="420" cy="340" r="5" fill="none" stroke={C_BRIGHT} strokeWidth="1.2" strokeOpacity="0.7">
            <animate attributeName="r" values="5;35;65" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.2;0" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="420" cy="340" r="5" fill="none" stroke={C_BRIGHT} strokeWidth="1" strokeOpacity="0.5">
            <animate attributeName="r" values="5;35;65" dur="3s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.12;0" dur="3s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="420" cy="340" r="5" fill="none" stroke={C_BRIGHT} strokeWidth="0.7" strokeOpacity="0.3">
            <animate attributeName="r" values="5;35;65" dur="3s" begin="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.06;0" dur="3s" begin="2s" repeatCount="indefinite" />
          </circle>
          <text x="438" y="344" fill={C_BRIGHT} fontSize="10" fontFamily="var(--font-dm)" fontWeight="700" letterSpacing="1.5" opacity="0.85">NAIROBI</text>

          {/* Cairo */}
          <circle cx="380" cy="115" r="4" fill={KENYA_ACCENT}>
            <animate attributeName="opacity" values="0.9;0.35;0.9" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="380" cy="115" r="4" fill="none" stroke={KENYA_ACCENT} strokeWidth="1" strokeOpacity="0.5">
            <animate attributeName="r" values="4;25;45" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.1;0" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <text x="394" y="119" fill={KENYA_ACCENT} fontSize="9" fontFamily="var(--font-dm)" fontWeight="600" letterSpacing="1" opacity="0.6">CAIRO</text>

          {/* Lagos */}
          <circle cx="230" cy="310" r="4" fill={KENYA_ACCENT}>
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="230" cy="310" r="4" fill="none" stroke={KENYA_ACCENT} strokeWidth="1" strokeOpacity="0.45">
            <animate attributeName="r" values="4;22;40" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.45;0.08;0" dur="4s" repeatCount="indefinite" />
          </circle>
          <text x="195" y="303" fill={KENYA_ACCENT} fontSize="9" fontFamily="var(--font-dm)" fontWeight="600" letterSpacing="1" opacity="0.55">LAGOS</text>

          {/* Cape Town */}
          <circle cx="310" cy="590" r="3.5" fill={KENYA_ACCENT}>
            <animate attributeName="opacity" values="0.7;0.25;0.7" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="310" cy="590" r="3.5" fill="none" stroke={KENYA_ACCENT} strokeWidth="0.9" strokeOpacity="0.4">
            <animate attributeName="r" values="3.5;20;36" dur="3.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.06;0" dur="3.8s" repeatCount="indefinite" />
          </circle>
          <text x="324" y="594" fill={KENYA_ACCENT} fontSize="8" fontFamily="var(--font-dm)" fontWeight="600" letterSpacing="1" opacity="0.5">CAPE TOWN</text>

          {/* Addis Ababa */}
          <circle cx="430" cy="270" r="3" fill="rgba(255,255,255,0.5)">
            <animate attributeName="opacity" values="0.6;0.25;0.6" dur="3.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="430" cy="270" r="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8">
            <animate attributeName="r" values="3;18;32" dur="4.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.05;0" dur="4.2s" repeatCount="indefinite" />
          </circle>
          <text x="442" y="274" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="var(--font-dm)" fontWeight="500" letterSpacing="0.8" opacity="0.5">ADDIS ABABA</text>

          {/* Johannesburg */}
          <circle cx="355" cy="530" r="3" fill="rgba(255,255,255,0.45)">
            <animate attributeName="opacity" values="0.55;0.2;0.55" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="355" cy="530" r="3" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8">
            <animate attributeName="r" values="3;18;32" dur="3.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0.04;0" dur="3.6s" repeatCount="indefinite" />
          </circle>
          <text x="368" y="534" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="var(--font-dm)" fontWeight="500" letterSpacing="0.8" opacity="0.45">JOHANNESBURG</text>

          {/* Threat connection lines — animated dashes converging on Nairobi */}
          <line x1="380" y1="115" x2="420" y2="340" stroke={C} strokeWidth="0.8" strokeDasharray="4 8" strokeOpacity="0.2">
            <animate attributeName="stroke-dashoffset" values="0;-48" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="230" y1="310" x2="420" y2="340" stroke={C} strokeWidth="0.8" strokeDasharray="4 8" strokeOpacity="0.18">
            <animate attributeName="stroke-dashoffset" values="0;-48" dur="5s" repeatCount="indefinite" />
          </line>
          <line x1="310" y1="590" x2="420" y2="340" stroke={C} strokeWidth="0.8" strokeDasharray="4 8" strokeOpacity="0.15">
            <animate attributeName="stroke-dashoffset" values="0;-48" dur="4.5s" repeatCount="indefinite" />
          </line>
          <line x1="430" y1="270" x2="420" y2="340" stroke={C} strokeWidth="0.7" strokeDasharray="3 7" strokeOpacity="0.14">
            <animate attributeName="stroke-dashoffset" values="0;-40" dur="3.5s" repeatCount="indefinite" />
          </line>
          <line x1="355" y1="530" x2="420" y2="340" stroke={C} strokeWidth="0.7" strokeDasharray="3 7" strokeOpacity="0.14">
            <animate attributeName="stroke-dashoffset" values="0;-40" dur="4.2s" repeatCount="indefinite" />
          </line>
        </svg>
      </div>

      {/* Moving scan line */}
      <div className="absolute left-0 right-0 pointer-events-none cfk-whynow-scanline" style={{
        top: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent 10%, ${C}18, ${C}28, ${C}18, transparent 90%)`,
        boxShadow: `0 0 20px ${C}12, 0 0 60px ${C}06`,
        zIndex: 2,
        willChange: "transform",
      }} />

      {/* Scrolling data ticker — cybersecurity ambiance */}
      <div className="absolute left-0 right-0 pointer-events-none" style={{ top: "87%", overflow: "hidden", zIndex: 2, opacity: 0.035 }}>
        <div className="cfk-whynow-ticker" style={{ whiteSpace: "nowrap", fontFamily: "var(--font-dm)", fontSize: 10, letterSpacing: "2px", color: C_BRIGHT }}>
          0x4F2A · THREAT:ELEVATED · SHA256:9c7b · CERT-KE:2025-0417 · PORT:443 · CVE-2025-31337 · NAIROBI:NODE · TCP/SYN · KE-CIRT · 0xD3F1 · MPESA:SHIELD · TLP:RED · IOC:DETECTED · FIREWALL:ACTIVE · DNS:SINKHOLE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0x4F2A · THREAT:ELEVATED · SHA256:9c7b · CERT-KE:2025-0417 · PORT:443 · CVE-2025-31337 · NAIROBI:NODE · TCP/SYN · KE-CIRT · 0xD3F1 · MPESA:SHIELD · TLP:RED · IOC:DETECTED · FIREWALL:ACTIVE · DNS:SINKHOLE
        </div>
      </div>

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 5%, ${C}20, ${C_BRIGHT}12, ${C}20, transparent 95%)` }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 3 }}>

        {/* Centered header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: 24 }}>
          {/* Alert badge */}
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 10 }}>
            <span className="cfk-whynow-alert-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 8px ${C_BRIGHT}60` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: C_BRIGHT, opacity: 0.9 }}>Live Threat Intelligence</span>
            <span className="cfk-whynow-alert-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 8px ${C_BRIGHT}60` }} />
          </div>
          <div style={{ marginBottom: 18, fontFamily: "var(--font-outfit)", fontSize: 9, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>
            Last updated: Q4 2025 · East Africa Threat Report
          </div>

          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 20 }}>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT})` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT }}>Why Now</span>
            <span style={{ width: 40, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.8vw, 44px)", letterSpacing: "-1.5px", color: "rgba(255,255,255,0.9)", lineHeight: 1.15, margin: "0 0 8px" }}>
            Africa&apos;s Digital Powerhouse{" "}
            <span style={{ color: C_BRIGHT }}>Under Siege</span>
          </h2>
          <h2 className="cfk-whynow-headline" style={{
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: "clamp(32px, 4.2vw, 52px)", letterSpacing: "-2px", lineHeight: 1.1, margin: "0 0 14px",
            background: `linear-gradient(135deg, ${C_BRIGHT} 0%, #ffffff 50%, ${C_BRIGHT} 100%)`,
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent", color: "transparent",
            filter: `drop-shadow(0 0 30px ${C}25)`,
          }}>
            KES 29.9 Billion Lost. 4.5 Billion Threats.
          </h2>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            style={{ width: 70, height: 2, background: `linear-gradient(90deg, ${C_BRIGHT}, ${KENYA_ACCENT}, ${C_BRIGHT})`, borderRadius: 2, margin: "0 auto 22px" }}
          />

          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 16, color: "rgba(255,255,255,0.42)", maxWidth: 620, margin: "0 auto", lineHeight: 1.75 }}>
            Kenya&apos;s rapid digital transformation has expanded its attack surface exponentially. 2026 is the pivotal year where cybersecurity becomes <strong style={{ color: KENYA_ACCENT, fontWeight: 500 }}>core infrastructure</strong> for Africa&apos;s digital economy.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          style={{ maxWidth: 1100, margin: "44px auto 52px", position: "relative" }}
        >
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, ${C}12 15%, ${C}22 50%, ${C}12 85%, transparent 100%)` }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(45deg)", width: 6, height: 6, background: C_BRIGHT, borderRadius: 1, boxShadow: `0 0 12px ${C_BRIGHT}40` }} />
        </motion.div>

        {/* Section label above stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 32, marginTop: 36, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}
        >
          <div style={{ flex: 1, maxWidth: 120, height: 1, background: `linear-gradient(90deg, transparent, ${C}20)` }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.4 }}>
              <path d="M7 1 L12 4 L12 9 L7 13 L2 9 L2 4 Z" stroke={C_BRIGHT} strokeWidth="0.8" fill={`${C_BRIGHT}08`} />
              <path d="M7 4 L7 8 M5.5 6 L8.5 6" stroke={C_BRIGHT} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            </svg>
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Key Indicators — 2025 Data</span>
          </div>
          <div style={{ flex: 1, maxWidth: 120, height: 1, background: `linear-gradient(270deg, transparent, ${C}20)` }} />
        </motion.div>

        {/* Big impact stats — full width, 4 columns */}
        <div style={{ position: "relative" }}>
          {/* Grid pattern behind stats */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `radial-gradient(${C}08 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 70%)",
            top: -20, bottom: -20, left: -20, right: -20,
          }} />
        <div className="cfk-whynow-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 56, position: "relative" }}>
          {MARKET_STATS.map((stat, i) => {
            const badges = ["Critical", "Severe", "Critical", "Extreme"];
            return (
            <motion.div
              key={stat.label}
              className="cfk-whynow-card"
              initial={{ opacity: 0, y: 28, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.6 + i * 0.1, ease: EASE }}
              style={{
                padding: "34px 24px 28px",
                borderRadius: 20,
                background: stat.highlight
                  ? `linear-gradient(145deg, ${C}1A 0%, ${C}08 50%, rgba(255,255,255,0.02) 100%)`
                  : `linear-gradient(155deg, ${C}0C, rgba(255,255,255,0.015))`,
                border: `1px solid ${stat.highlight ? `${C_BRIGHT}40` : `${C_BRIGHT}20`}`,
                position: "relative",
                overflow: "hidden",
                textAlign: "center",
                backdropFilter: "blur(12px)",
                boxShadow: stat.highlight
                  ? `0 8px 36px ${C}20, inset 0 1px 0 ${C_BRIGHT}20, 0 0 0 1px ${C}12`
                  : `0 4px 24px ${C}10, inset 0 1px 0 ${C_BRIGHT}08, 0 0 0 1px ${C}08`,
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Hover glow */}
              <div className="cfk-whynow-glow absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 20%, ${C}00, transparent 70%)`, transition: "all 0.5s ease", opacity: 0 }} />

              {/* Diagonal shimmer sweep — highlighted cards only */}
              {stat.highlight && <div className="cfk-whynow-sweep absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(115deg, transparent 30%, ${C_BRIGHT}06 45%, ${C_BRIGHT}0C 50%, ${C_BRIGHT}06 55%, transparent 70%)`, backgroundSize: "200% 100%" }} />}

              {/* Top accent line — strong red glow */}
              <div style={{ position: "absolute", top: 0, left: stat.highlight ? "6%" : "10%", right: stat.highlight ? "6%" : "10%", height: stat.highlight ? 2.5 : 2, background: `linear-gradient(90deg, transparent, ${stat.highlight ? `${C_BRIGHT}80` : `${C_BRIGHT}40`}, transparent)` }} />

              {/* Top radial glow — like StatsBar */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${stat.highlight ? `${C}14` : `${C}0A`}, transparent 55%)` }} />

              {/* Left bar */}
              <div className="cfk-whynow-bar" style={{ position: "absolute", top: "15%", bottom: "15%", left: 0, width: stat.highlight ? 3 : 2, background: `linear-gradient(180deg, transparent, ${stat.highlight ? `${C_BRIGHT}65` : `${C_BRIGHT}30`}, transparent)`, borderRadius: "0 3px 3px 0", transition: "all 0.4s ease" }} />

              {/* Watermark number */}
              <div style={{ position: "absolute", top: 8, right: 14, fontFamily: "var(--font-display)", fontSize: 72, fontWeight: 900, lineHeight: 1, userSelect: "none", pointerEvents: "none", color: "transparent", WebkitTextStroke: `1px ${stat.highlight ? `${C_BRIGHT}08` : "rgba(255,255,255,0.02)"}`, transition: "all 0.5s ease" }}>
                {stat.value}
              </div>

              {/* Status badge */}
              <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "3px 10px", borderRadius: 20,
                  background: stat.highlight ? `${C_BRIGHT}15` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${stat.highlight ? `${C_BRIGHT}30` : "rgba(255,255,255,0.07)"}`,
                  fontFamily: "var(--font-dm)", fontSize: 9, fontWeight: 600,
                  letterSpacing: "1.2px", textTransform: "uppercase",
                  color: stat.highlight ? C_BRIGHT : "rgba(255,255,255,0.35)",
                }}>
                  <span className={stat.highlight ? "cfk-whynow-alert-dot" : ""} style={{ width: 4, height: 4, borderRadius: "50%", background: stat.highlight ? C_BRIGHT : "rgba(255,255,255,0.25)" }} />
                  {badges[i]}
                </span>
              </div>

              {/* Big number — gradient treatment */}
              <div className="cfk-whynow-number" style={{
                fontFamily: "var(--font-display)",
                fontSize: stat.highlight ? "clamp(38px, 4.2vw, 52px)" : "clamp(34px, 3.8vw, 46px)",
                fontWeight: 900,
                letterSpacing: "-2px",
                lineHeight: 1,
                marginBottom: 6,
                position: "relative",
                transition: "all 0.4s ease",
                background: `linear-gradient(180deg, #ffffff ${stat.highlight ? "30%" : "40%"}, ${C_BRIGHT} 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                filter: `drop-shadow(0 0 24px ${C}${stat.highlight ? "35" : "20"})`,
              }}>
                {stat.prefix}{inView ? <Counter to={parseFloat(stat.value)} duration={1600} /> : stat.value}<span style={{ fontSize: "0.55em", fontWeight: 700, opacity: 0.7 }}>{stat.suffix}</span>
              </div>

              {/* Trend indicator */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, marginBottom: 10 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.8 }}>
                  <path d="M5 1 L9 6 L6.5 6 L6.5 9 L3.5 9 L3.5 6 L1 6 Z" fill={C_BRIGHT} />
                </svg>
                <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, letterSpacing: "0.3px" }}>
                  {stat.trend}
                </span>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, color: "rgba(255,255,255,0.25)" }}>YoY</span>
              </div>

              {/* Label */}
              <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: stat.highlight ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.72)", marginBottom: 6, letterSpacing: "-0.2px" }}>
                {stat.label}
              </div>

              {/* Note */}
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.32)", lineHeight: 1.5 }}>
                {stat.note}
              </div>

              {/* Bottom accent line */}
              <div style={{ position: "absolute", bottom: 0, left: stat.highlight ? "8%" : "12%", right: stat.highlight ? "8%" : "12%", height: stat.highlight ? 2 : 1, background: `linear-gradient(90deg, transparent, ${stat.highlight ? `${C_BRIGHT}50` : `${C_BRIGHT}20`}, transparent)`, borderRadius: 1 }} />

              {/* Corner bracket accents — data readout feel */}
              <div style={{ position: "absolute", top: 8, left: 8, width: 14, height: 14, borderTop: `1px solid ${stat.highlight ? `${C_BRIGHT}35` : `${C_BRIGHT}15`}`, borderLeft: `1px solid ${stat.highlight ? `${C_BRIGHT}35` : `${C_BRIGHT}15`}`, borderRadius: "2px 0 0 0" }} />
              <div style={{ position: "absolute", top: 8, right: 8, width: 14, height: 14, borderTop: `1px solid ${stat.highlight ? `${C_BRIGHT}30` : `${C_BRIGHT}12`}`, borderRight: `1px solid ${stat.highlight ? `${C_BRIGHT}30` : `${C_BRIGHT}12`}`, borderRadius: "0 2px 0 0" }} />
              <div style={{ position: "absolute", bottom: 8, left: 8, width: 14, height: 14, borderBottom: `1px solid ${stat.highlight ? `${C_BRIGHT}28` : `${C_BRIGHT}10`}`, borderLeft: `1px solid ${stat.highlight ? `${C_BRIGHT}28` : `${C_BRIGHT}10`}`, borderRadius: "0 0 0 2px" }} />
              <div style={{ position: "absolute", bottom: 8, right: 8, width: 14, height: 14, borderBottom: `1px solid ${stat.highlight ? `${C_BRIGHT}25` : `${C_BRIGHT}0A`}`, borderRight: `1px solid ${stat.highlight ? `${C_BRIGHT}25` : `${C_BRIGHT}0A`}`, borderRadius: "0 0 2px 0" }} />

              {/* Corner dot — highlight only */}
              {stat.highlight && (
                <div style={{ position: "absolute", top: 14, right: 14, width: 5, height: 5, borderRadius: "50%", background: `${C_BRIGHT}35`, boxShadow: `0 0 8px ${C_BRIGHT}20` }} />
              )}
            </motion.div>
            );
          })}
        </div>
        </div>

        {/* Narrative + Tags — centered below stats, in glass container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
          style={{
            maxWidth: 860, margin: "0 auto", textAlign: "center",
            padding: "36px 40px 32px",
            borderRadius: 24,
            background: "linear-gradient(160deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008))",
            border: "1px solid rgba(255,255,255,0.05)",
            backdropFilter: "blur(16px)",
            boxShadow: `0 8px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glass container top accent */}
          <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}18, transparent)` }} />

          {/* Subtle corner brackets on glass container */}
          <div style={{ position: "absolute", top: 10, left: 10, width: 16, height: 16, borderTop: `1px solid ${C}15`, borderLeft: `1px solid ${C}15`, borderRadius: "3px 0 0 0" }} />
          <div style={{ position: "absolute", top: 10, right: 10, width: 16, height: 16, borderTop: `1px solid ${C}12`, borderRight: `1px solid ${C}12`, borderRadius: "0 3px 0 0" }} />
          <div style={{ position: "absolute", bottom: 10, left: 10, width: 16, height: 16, borderBottom: `1px solid ${C}10`, borderLeft: `1px solid ${C}10`, borderRadius: "0 0 0 3px" }} />
          <div style={{ position: "absolute", bottom: 10, right: 10, width: 16, height: 16, borderBottom: `1px solid ${C}10`, borderRight: `1px solid ${C}10`, borderRadius: "0 0 3px 0" }} />

          {/* Analysis label */}
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ width: 30, height: 1, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08))` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 9, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Analysis</span>
            <div style={{ width: 30, height: 1, background: `linear-gradient(270deg, transparent, rgba(255,255,255,0.08))` }} />
          </div>

          {/* Left-bar accent paragraph */}
          <div style={{ display: "inline-block", textAlign: "left", borderLeft: `2px solid ${C_BRIGHT}30`, paddingLeft: 22, marginBottom: 28, position: "relative" }}>
            <div style={{ position: "absolute", top: -4, left: -1, width: 2, height: 8, background: C_BRIGHT, borderRadius: 1, boxShadow: `0 0 6px ${C_BRIGHT}40` }} />
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, margin: 0 }}>
              The rise of <strong style={{ color: C_BRIGHT, fontWeight: 500 }}>Agentic AI and Deepfakes</strong> has introduced a new era of <span style={{ color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>&apos;Algorithmic Warfare&apos;</span> that legacy systems are ill-equipped to handle — making this summit more urgent than ever.
            </p>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 8 }}>
            {["Cybercrimes Act 2025", "CSOC Operations", "Mobile Money Security", "Regional Cloud Hub"].map((tag, i) => (
              <motion.span
                key={tag}
                className="cfk-whynow-tag"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 1.2 + i * 0.06, ease: EASE }}
                style={{
                  padding: "8px 18px", borderRadius: 20,
                  background: `${KENYA_ACCENT}0C`, border: `1px solid ${KENYA_ACCENT}22`,
                  fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: KENYA_ACCENT,
                  letterSpacing: "0.3px", cursor: "default",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Source citation */}
          <div style={{ marginTop: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.06))` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 16, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.25 }}>
                <circle cx="5" cy="5" r="4" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
                <path d="M5 3 L5 5.5 L6.5 6.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: "0.3px" }}>
                Sources: KE-CIRT/CC · Communications Authority of Kenya · 2025
              </span>
            </div>
            <div style={{ width: 40, height: 1, background: `linear-gradient(270deg, transparent, rgba(255,255,255,0.06))` }} />
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 100, background: "linear-gradient(to bottom, transparent, #0A0608)", zIndex: 4 }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 10%, ${C}12, transparent 90%)`, zIndex: 5 }} />

      <style jsx global>{`
        @keyframes cfk-whynow-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes cfk-whynow-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes cfk-whynow-orb-drift1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -20px); }
          66% { transform: translate(-15px, 25px); }
        }
        @keyframes cfk-whynow-orb-drift2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-25px, 15px); }
          66% { transform: translate(20px, -30px); }
        }
        @keyframes cfk-whynow-orb-drift3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, 15px); }
        }
        @keyframes cfk-whynow-scanmove {
          0% { transform: translateY(-2px); }
          100% { transform: translateY(100vh); }
        }
        @keyframes cfk-whynow-alert-blink {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px ${C_BRIGHT}60; }
          50% { opacity: 0.3; box-shadow: 0 0 4px ${C_BRIGHT}30; }
        }
        .cfk-whynow-alert-dot { animation: cfk-whynow-alert-blink 1.5s ease-in-out infinite; }
        .cfk-whynow-orb1 { animation: cfk-whynow-orb-drift1 18s ease-in-out infinite; }
        .cfk-whynow-orb2 { animation: cfk-whynow-orb-drift2 22s ease-in-out infinite; }
        .cfk-whynow-orb3 { animation: cfk-whynow-orb-drift3 15s ease-in-out infinite; }
        .cfk-whynow-scanline { animation: cfk-whynow-scanmove 12s linear infinite; }
        .cfk-whynow-pulse { animation: cfk-whynow-pulse 8s ease-in-out infinite; }
        .cfk-whynow-headline { animation: cfk-whynow-shimmer 8s ease-in-out infinite; }
        @keyframes cfk-whynow-sweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .cfk-whynow-sweep { animation: cfk-whynow-sweep 6s ease-in-out infinite; }
        @keyframes cfk-whynow-ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .cfk-whynow-ticker { animation: cfk-whynow-ticker-scroll 40s linear infinite; }
        .cfk-whynow-card:hover {
          transform: translateY(-5px) !important;
          border-color: ${C_BRIGHT}45 !important;
          box-shadow: 0 16px 48px ${C}22, inset 0 1px 0 ${C_BRIGHT}18, 0 0 0 1px ${C_BRIGHT}15 !important;
        }
        .cfk-whynow-card:hover .cfk-whynow-glow {
          opacity: 1 !important;
          background: radial-gradient(ellipse 80% 60% at 50% 15%, ${C}10, transparent 70%) !important;
        }
        .cfk-whynow-card:hover .cfk-whynow-number { filter: drop-shadow(0 0 20px ${C_BRIGHT}35) !important; }
        .cfk-whynow-card:hover .cfk-whynow-bar {
          top: 12% !important;
          bottom: 12% !important;
          width: 3px !important;
          background: linear-gradient(180deg, transparent, ${C_BRIGHT}60, transparent) !important;
          box-shadow: 0 0 8px ${C_BRIGHT}20 !important;
        }
        .cfk-whynow-tag:hover {
          background: ${KENYA_ACCENT}18 !important;
          border-color: ${KENYA_ACCENT}35 !important;
          box-shadow: 0 0 16px ${KENYA_ACCENT}10 !important;
          transform: translateY(-1px);
        }
        @media (max-width: 768px) {
          .cfk-whynow-stats { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .cfk-whynow-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── THREAT LANDSCAPE ────────────────────────────────────────────────────────
function ThreatLandscape() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const DANGER = "#EF4444";

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(90px, 12vw, 140px) 0", overflow: "hidden", background: "#0A0608" }}>
      {/* Background photo */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=70" alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" style={{ filter: "brightness(0.07) saturate(0.35) contrast(1.4)" }} />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(10,6,8,0.96) 0%, rgba(10,6,8,0.4) 35%, rgba(10,6,8,0.4) 65%, rgba(10,6,8,0.96) 100%)" }} />

      {/* Animated floating orbs */}
      <div className="absolute pointer-events-none cfk-orb-1" style={{ width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${DANGER}20, ${DANGER}08 50%, transparent 70%)`, filter: "blur(80px)", top: "10%", left: "5%", zIndex: 1 }} />
      <div className="absolute pointer-events-none cfk-orb-2" style={{ width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle at 60% 60%, ${C}15, ${C}06 50%, transparent 70%)`, filter: "blur(70px)", bottom: "5%", right: "8%", zIndex: 1 }} />
      <div className="absolute pointer-events-none cfk-orb-3" style={{ width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle at 50% 50%, ${KENYA_ACCENT}12, transparent 60%)`, filter: "blur(60px)", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1 }} />

      {/* Radar pulse rings — positioned off-center right */}
      <div className="absolute pointer-events-none" style={{ top: "50%", right: "12%", transform: "translateY(-50%)", zIndex: 1 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="absolute cfk-radar-ring" style={{
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: `1px solid ${DANGER}`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animationDelay: `${i * 1.2}s`,
          }} />
        ))}
        {/* Center dot */}
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: DANGER, boxShadow: `0 0 12px ${DANGER}60, 0 0 30px ${DANGER}30`, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      </div>

      {/* Grid pattern with intersection dots */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(${DANGER}06 1px, transparent 1px),
          linear-gradient(90deg, ${DANGER}06 1px, transparent 1px),
          radial-gradient(circle 1.5px at center, ${DANGER}18 1px, transparent 2px)
        `,
        backgroundSize: "80px 80px, 80px 80px, 80px 80px",
        zIndex: 2,
        maskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, black 15%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, black 15%, transparent 70%)",
      }} />

      {/* Moving scan line */}
      <div className="absolute left-0 right-0 pointer-events-none cfk-scanline" style={{
        top: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent 10%, ${DANGER}20, ${DANGER}35, ${DANGER}20, transparent 90%)`,
        boxShadow: `0 0 20px ${DANGER}15, 0 0 60px ${DANGER}08`,
        zIndex: 2,
        willChange: "transform",
      }} />

      {/* Top & bottom border lines */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 5%, ${DANGER}25, ${DANGER}40, ${DANGER}25, transparent 95%)` }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 10%, ${DANGER}15, transparent 90%)`, zIndex: 5 }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 3 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: 20 }}>
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 24 }}>
            <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${DANGER})` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: DANGER }}>Threat Intelligence</span>
            <span style={{ width: 28, height: 1, background: `linear-gradient(270deg, transparent, ${DANGER})` }} />
          </div>

          {/* Two-tier headline */}
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 40px)", letterSpacing: "-1.5px", color: "rgba(255,255,255,0.88)", lineHeight: 1.15, margin: "0 0 8px" }}>
            Kenya&apos;s Cyber Threat Landscape
          </h2>
          <h2 className="cfk-threat-headline" style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(30px, 4vw, 48px)",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            margin: "0 0 12px",
            background: `linear-gradient(135deg, ${DANGER} 0%, #ffffff 50%, ${DANGER} 100%)`,
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            filter: `drop-shadow(0 0 30px ${DANGER}20)`,
          }}>
            4.5 Billion Threats Detected.
          </h2>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${DANGER}, ${KENYA_ACCENT}, ${DANGER})`, borderRadius: 2, margin: "0 auto 20px" }}
          />

          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.4)", maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
            Critical statistics shaping East Africa&apos;s cybersecurity agenda — sourced from KE-CIRT/CC and national threat reports.
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3, ease: EASE }} style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="flex items-center justify-center flex-wrap gap-2">
            {["KE-CIRT/CC Reports", "Data Protection Act 2019", "Critical Infrastructure", "East Africa Region"].map((tag, ti) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.45 + ti * 0.08, ease: EASE }}
                className="cfk-threat-tag"
                style={{ padding: "6px 16px", borderRadius: 20, background: `${DANGER}08`, border: `1px solid ${DANGER}18`, fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: `${DANGER}BB`, transition: "all 0.3s ease" }}
              >{tag}</motion.span>
            ))}
          </div>
        </motion.div>

        {/* Animated divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          style={{ maxWidth: 1100, margin: "0 auto 48px", position: "relative" }}
        >
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, ${DANGER}15 15%, ${DANGER}30 50%, ${DANGER}15 85%, transparent 100%)` }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(45deg)", width: 6, height: 6, background: DANGER, borderRadius: 1, boxShadow: `0 0 12px ${DANGER}40` }} />
        </motion.div>

        {/* "By The Numbers" label */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.55, ease: EASE }} style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 9, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Key Threat Indicators</span>
        </motion.div>

        {/* Cards — 5 in a row */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.6, ease: EASE }} className="cfk-threats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {KEY_THREATS.map((item, i) => (
            <motion.div
              key={item.threat}
              className="cfk-threat-card"
              initial={{ opacity: 0, y: 24, scale: 0.93 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.7 + i * 0.1, ease: EASE }}
              style={{
                padding: i === 0 ? "34px 20px 30px" : "28px 18px 26px",
                borderRadius: 20,
                background: i === 0
                  ? `linear-gradient(145deg, ${DANGER}16 0%, ${DANGER}08 50%, rgba(255,255,255,0.02) 100%)`
                  : "linear-gradient(155deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012))",
                backdropFilter: "blur(12px)",
                border: `1px solid ${i === 0 ? `${DANGER}35` : "rgba(255,255,255,0.07)"}`,
                position: "relative",
                overflow: "hidden",
                textAlign: "center",
                boxShadow: i === 0
                  ? `0 8px 36px ${DANGER}15, inset 0 1px 0 ${DANGER}18, 0 0 0 1px ${DANGER}08`
                  : "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Top glow for highlight */}
              {i === 0 && (
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${DANGER}10, transparent 55%)` }} />
              )}

              {/* Left edge accent for highlight */}
              {i === 0 && (
                <div style={{ position: "absolute", top: "15%", bottom: "15%", left: 0, width: 2, background: `linear-gradient(180deg, transparent, ${DANGER}60, transparent)`, borderRadius: "0 2px 2px 0" }} />
              )}

              {/* Top accent line */}
              <div style={{ position: "absolute", top: 0, left: i === 0 ? "8%" : "20%", right: i === 0 ? "8%" : "20%", height: i === 0 ? 2 : 1.5, background: `linear-gradient(90deg, transparent, ${i === 0 ? `${DANGER}80` : `${DANGER}35`}, transparent)` }} />

              {/* Status badge */}
              <div style={{ marginBottom: 14, position: "relative" }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: i === 0 ? `${DANGER}14` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${i === 0 ? `${DANGER}25` : "rgba(255,255,255,0.06)"}`,
                  fontFamily: "var(--font-dm)",
                  fontSize: 9,
                  fontWeight: 600,
                  color: i === 0 ? DANGER : "rgba(255,255,255,0.3)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}>
                  {i === 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: DANGER, flexShrink: 0, boxShadow: `0 0 6px ${DANGER}60` }} />}
                  {i === 0 ? "Critical" : i < 3 ? "High" : "Monitor"}
                </span>
              </div>

              {/* Stat number */}
              <div className="cfk-threat-num" style={{
                fontFamily: "var(--font-display)",
                fontSize: i === 0 ? "clamp(34px, 4.5vw, 46px)" : "clamp(28px, 3.5vw, 36px)",
                fontWeight: 900,
                letterSpacing: "-1.5px",
                lineHeight: 1,
                position: "relative",
                transition: "all 0.4s ease",
                ...(i === 0 ? {
                  background: `linear-gradient(180deg, #ffffff 20%, ${DANGER} 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  filter: `drop-shadow(0 0 20px ${DANGER}25)`,
                } : {
                  color: "white",
                }),
              }}>
                {item.stat}
              </div>

              {/* Animated underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.1, ease: EASE }}
                style={{ width: i === 0 ? 32 : 20, height: 2, background: i === 0 ? DANGER : `${DANGER}40`, borderRadius: 2, margin: "12px auto 0", transformOrigin: "center" }}
              />

              {/* Label */}
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: i === 0 ? 13 : 12, fontWeight: 700, color: i === 0 ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.55)", letterSpacing: i === 0 ? "1px" : "0.5px", marginTop: 12, position: "relative", lineHeight: 1.3 }}>
                {item.threat}
              </div>

              {/* Note */}
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: i === 0 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.22)", marginTop: 6, position: "relative", lineHeight: 1.4 }}>
                {item.note}
              </div>

              {/* Bottom accent */}
              <div style={{ position: "absolute", bottom: 0, left: i === 0 ? 14 : 24, right: i === 0 ? 14 : 24, height: i === 0 ? 2 : 1, background: i === 0 ? `linear-gradient(90deg, transparent, ${DANGER}45, transparent)` : "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)", borderRadius: 1 }} />

              {/* Corner dot for highlight */}
              {i === 0 && (
                <div style={{ position: "absolute", top: 14, right: 14, width: 5, height: 5, borderRadius: "50%", background: `${DANGER}30`, boxShadow: `0 0 8px ${DANGER}20` }} />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Source citation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.2, ease: EASE }}
          style={{ textAlign: "center", marginTop: 32 }}
        >
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.18)", letterSpacing: "0.3px" }}>
            Sources: KE-CIRT/CC Annual Report · Communications Authority of Kenya · National Cybersecurity Strategy
          </span>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 120, background: "linear-gradient(to bottom, transparent, #0C0809)", zIndex: 4 }} />

      <style jsx global>{`
        @keyframes cfk-orb-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          33% { transform: translate(40px, -30px) scale(1.1); opacity: 0.8; }
          66% { transform: translate(-25px, 20px) scale(0.9); opacity: 0.5; }
        }
        @keyframes cfk-orb-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          40% { transform: translate(-35px, 25px) scale(1.15); opacity: 0.7; }
          70% { transform: translate(20px, -15px) scale(0.95); opacity: 0.4; }
        }
        @keyframes cfk-orb-float-3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
        }
        .cfk-orb-1 { animation: cfk-orb-float-1 18s ease-in-out infinite; }
        .cfk-orb-2 { animation: cfk-orb-float-2 22s ease-in-out infinite; }
        .cfk-orb-3 { animation: cfk-orb-float-3 14s ease-in-out infinite; }

        @keyframes cfk-radar-pulse {
          0% { transform: translate(-50%, -50%) scale(0.15); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
        .cfk-radar-ring { animation: cfk-radar-pulse 4.8s ease-out infinite; }

        @keyframes cfk-scanline-move {
          0% { transform: translateY(-2px); }
          100% { transform: translateY(100vh); }
        }
        .cfk-scanline { animation: cfk-scanline-move 8s linear infinite; }

        @keyframes cfk-threat-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .cfk-threat-headline { animation: cfk-threat-shimmer 8s ease-in-out infinite; }

        .cfk-threat-tag:hover { background: ${DANGER}14 !important; border-color: ${DANGER}30 !important; }
        .cfk-threat-card:hover { transform: translateY(-5px) !important; border-color: ${DANGER}40 !important; box-shadow: 0 16px 48px ${DANGER}18, inset 0 1px 0 ${DANGER}15 !important; }
        .cfk-threat-card:hover .cfk-threat-num { filter: drop-shadow(0 0 20px ${DANGER}30) !important; }
        @media (max-width: 1024px) {
          .cfk-threats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .cfk-threats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cfk-radar-ring, .cfk-orb-1, .cfk-orb-2, .cfk-orb-3 { display: none !important; }
        }
        @media (max-width: 480px) {
          .cfk-threats-grid { gap: 10px !important; }
          .cfk-threats-grid > div { padding: 20px 14px 18px !important; border-radius: 16px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── FOCUS AREAS ─────────────────────────────────────────────────────────────
function FocusAreas() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(100px, 12vw, 150px) 0 clamp(140px, 16vw, 200px)", background: "linear-gradient(180deg, #0A0608 0%, #0D090A 30%, #100B0D 50%, #0D090A 70%, #0A0608 100%)" }}>
      {/* Background — city at night */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1400&q=75" alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" style={{ filter: "brightness(0.25) saturate(0.35) contrast(1.2)", objectPosition: "center 60%" }} />
      </div>

      {/* Crimson color tint */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `${C_DIM}70`, mixBlendMode: "multiply", zIndex: 0 }} />

      {/* Heavy vignette — keeps edges dark, image peeks through center */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 15%, rgba(10,6,8,0.8) 50%, rgba(10,6,8,0.97) 100%)", zIndex: 1 }} />

      {/* Top/bottom hard fade — seamless section transitions */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(10,6,8,1) 0%, rgba(10,6,8,0.7) 12%, transparent 25%, transparent 75%, rgba(10,6,8,0.7) 88%, rgba(10,6,8,1) 100%)", zIndex: 1 }} />

      {/* Primary crimson orb — large, pulsing, centered above cards */}
      <div className="absolute inset-0 pointer-events-none cfk-focus-pulse" style={{ background: `radial-gradient(ellipse 50% 40% at 50% 30%, ${C}18, ${C}0A 40%, transparent 70%)`, zIndex: 1 }} />

      {/* Warm accent orb — right */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 28% 32% at 85% 55%, ${KENYA_ACCENT}0C, transparent 55%)`, zIndex: 1 }} />

      {/* Deep red orb — left lower */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 22% 28% at 12% 65%, ${C_DIM}10, transparent 55%)`, zIndex: 1 }} />

      {/* Dot matrix — concentrated in center */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle 1px, ${C_BRIGHT}06 0.5px, transparent 0.5px)`,
        backgroundSize: "28px 28px",
        zIndex: 1,
        mask: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent 70%)",
        WebkitMask: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent 70%)",
      }} />

      {/* Subtle scan lines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)`,
        zIndex: 1,
      }} />

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 5%, ${C}30, ${C_BRIGHT}20, ${C}30, transparent 95%)`, zIndex: 2 }} />
      <div className="absolute top-0 left-0 right-0" style={{ height: 40, background: `linear-gradient(180deg, ${C_BRIGHT}04, transparent)`, zIndex: 1 }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 3 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: 20 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 24 }}>
            <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT})` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT }}>Conference Tracks</span>
            <span style={{ width: 28, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 40px)", letterSpacing: "-1.5px", color: "rgba(255,255,255,0.88)", lineHeight: 1.15, margin: "0 0 8px" }}>
            What We&apos;re{" "}
            <span style={{ color: C_BRIGHT }}>Solving</span>
          </h2>
          <h2 className="cfk-focus-headline" style={{
            fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(30px, 4vw, 48px)",
            letterSpacing: "-2px", lineHeight: 1.1, margin: "0 0 12px",
            background: `linear-gradient(135deg, ${C_BRIGHT} 0%, #ffffff 50%, ${C_BRIGHT} 100%)`,
            backgroundSize: "200% 100%", WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent", color: "transparent",
            filter: `drop-shadow(0 0 30px ${C}20)`,
          }}>
            6 Strategic Tracks. One Mission.
          </h2>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.8, delay: 0.3, ease: EASE }} style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${C_BRIGHT}, ${KENYA_ACCENT}, ${C_BRIGHT})`, borderRadius: 2, margin: "0 auto 20px" }} />
          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Practitioner-led sessions built around East Africa&apos;s real threat landscape, regulatory reality, and workforce challenges.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={inView ? { scaleX: 1, opacity: 1 } : {}} transition={{ duration: 1, delay: 0.4, ease: EASE }} style={{ maxWidth: 1100, margin: "48px auto 48px", position: "relative" }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, ${C}12 15%, ${C}25 50%, ${C}12 85%, transparent 100%)` }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(45deg)", width: 6, height: 6, background: C_BRIGHT, borderRadius: 1, boxShadow: `0 0 12px ${C_BRIGHT}40` }} />
        </motion.div>

        {/* Bento grid: featured + 2x2 + featured */}
        <div className="cfk-focus-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {FOCUS_AREAS.map((area, i) => {
            const isFeatured = i === 0 || i === FOCUS_AREAS.length - 1;
            return (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.1, ease: EASE }}
                className="cfk-focus-card"
                style={{
                  gridColumn: isFeatured ? "1 / -1" : "auto",
                  position: "relative",
                  padding: isFeatured ? "44px 46px 40px 52px" : "32px 30px 28px 40px",
                  borderRadius: 20,
                  background: `linear-gradient(160deg, rgba(${28 + i * 5},${16 + i * 3},${20 + i * 3},0.85) 0%, rgba(18,12,14,0.9) 40%, rgba(12,8,10,0.95) 100%)`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: `1px solid rgba(255,255,255,0.06)`,
                  borderTop: `1px solid rgba(255,255,255,0.1)`,
                  overflow: "hidden",
                  boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 0.5px ${C}0A, inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)`,
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Inner ambient glow — top-left warm light */}
                <div className="cfk-focus-glow absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 45% at 5% 5%, ${C}18, transparent 65%)`, transition: "all 0.5s ease" }} />

                {/* Secondary glow — bottom-right subtle accent */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 35% at 95% 90%, ${KENYA_ACCENT}05, transparent 60%)` }} />

                {/* Top neon edge */}
                <div className="cfk-focus-topline" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C_BRIGHT}00 5%, ${C_BRIGHT}40 30%, ${C_BRIGHT}50 50%, ${C_BRIGHT}40 70%, ${C_BRIGHT}00 95%)`, transition: "all 0.5s ease" }} />

                {/* Bottom subtle edge */}
                <div style={{ position: "absolute", bottom: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}08, transparent)` }} />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: `linear-gradient(${C_BRIGHT}02 1px, transparent 1px), linear-gradient(90deg, ${C_BRIGHT}02 1px, transparent 1px)`,
                  backgroundSize: "44px 44px",
                  mask: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)",
                  WebkitMask: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)",
                }} />

                {/* Large background track number */}
                <div className="cfk-focus-num" style={{
                  position: "absolute",
                  top: isFeatured ? -20 : -16,
                  right: isFeatured ? 28 : 16,
                  fontFamily: "var(--font-display)",
                  fontSize: isFeatured ? 160 : 120,
                  fontWeight: 900,
                  lineHeight: 1,
                  background: `linear-gradient(170deg, ${C_BRIGHT}12, ${C_BRIGHT}04)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  userSelect: "none",
                  pointerEvents: "none",
                  transition: "all 0.5s ease",
                  letterSpacing: "-6px",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Left accent bar — glowing vertical strip */}
                <div className="cfk-focus-bar" style={{
                  position: "absolute", top: "10%", bottom: "10%", left: 0, width: 3,
                  background: `linear-gradient(180deg, transparent 0%, ${C_BRIGHT}60 25%, ${C_BRIGHT}70 50%, ${KENYA_ACCENT}40 75%, transparent 100%)`,
                  borderRadius: "0 4px 4px 0",
                  boxShadow: `0 0 12px ${C_BRIGHT}15, 2px 0 20px ${C_BRIGHT}08`,
                  transition: "all 0.5s ease",
                }} />

                {/* Content */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: isFeatured ? 26 : 18, position: "relative" }}>
                  {/* Icon container */}
                  <div className="cfk-focus-icon" style={{
                    flexShrink: 0,
                    width: isFeatured ? 56 : 46,
                    height: isFeatured ? 56 : 46,
                    borderRadius: 14,
                    background: `linear-gradient(145deg, ${C}25 0%, ${C}10 100%)`,
                    border: `1px solid ${C_BRIGHT}1A`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 4,
                    boxShadow: `0 4px 16px ${C}15, inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.2)`,
                    transition: "all 0.5s ease",
                    position: "relative",
                  }}>
                    {/* Icon inner ring */}
                    <div className="absolute inset-1 rounded-xl pointer-events-none" style={{ border: `1px solid ${C_BRIGHT}08` }} />
                    <svg width={isFeatured ? "22" : "19"} height={isFeatured ? "22" : "19"} viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85, filter: `drop-shadow(0 0 5px ${C_BRIGHT}35)`, position: "relative" }}>
                      <path d={area.icon} />
                    </svg>
                  </div>

                  {/* Text content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Track pill badge */}
                    <div style={{ marginBottom: 14 }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 600,
                        color: C_BRIGHT, letterSpacing: "2.5px", textTransform: "uppercase",
                        padding: "4px 14px 4px 10px", borderRadius: 20,
                        background: `linear-gradient(135deg, ${C}12, ${C}08)`,
                        border: `1px solid ${C}25`,
                        boxShadow: `0 2px 8px ${C}08`,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 6px ${C_BRIGHT}, 0 0 12px ${C_BRIGHT}60` }} />
                        Track {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: isFeatured ? "clamp(19px, 2.1vw, 23px)" : "clamp(15px, 1.5vw, 18px)",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.96)",
                      margin: "0 0 12px",
                      letterSpacing: "-0.4px",
                      lineHeight: 1.35,
                      maxWidth: isFeatured ? "72%" : "90%",
                    }}>{area.title}</h3>

                    {/* Gradient accent line with glow */}
                    <div style={{
                      width: isFeatured ? 44 : 32, height: 2, borderRadius: 2, marginBottom: 14,
                      background: `linear-gradient(90deg, ${C_BRIGHT}, ${KENYA_ACCENT}90, ${KENYA_GOLD}40, transparent)`,
                      boxShadow: `0 0 10px ${C_BRIGHT}18, 0 1px 4px ${C_BRIGHT}10`,
                    }} />

                    {/* Description */}
                    <p style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: isFeatured ? 15 : 13.5,
                      color: "rgba(255,255,255,0.42)",
                      lineHeight: 1.8,
                      margin: 0,
                      maxWidth: isFeatured ? 680 : 440,
                      letterSpacing: "0.1px",
                    }}>{area.desc}</p>

                    {/* Tags / keywords for featured cards */}
                    {isFeatured && (
                      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                        {(i === 0
                          ? ["APT Defense", "Ransomware", "DDoS Mitigation"]
                          : ["Cross-border", "Collaboration", "Intelligence Sharing"]
                        ).map((tag) => (
                          <span key={tag} style={{
                            fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 500,
                            color: `${KENYA_ACCENT}90`, letterSpacing: "0.5px",
                            padding: "3px 10px", borderRadius: 6,
                            background: `${KENYA_ACCENT}08`, border: `1px solid ${KENYA_ACCENT}12`,
                          }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Corner brackets */}
                <div style={{ position: "absolute", top: 12, left: 12, width: 18, height: 18, borderTop: `1.5px solid ${C_BRIGHT}18`, borderLeft: `1.5px solid ${C_BRIGHT}18`, borderRadius: "4px 0 0 0" }} />
                <div style={{ position: "absolute", top: 12, right: 12, width: 18, height: 18, borderTop: `1.5px solid ${C_BRIGHT}10`, borderRight: `1.5px solid ${C_BRIGHT}10`, borderRadius: "0 4px 0 0" }} />
                <div style={{ position: "absolute", bottom: 12, left: 12, width: 18, height: 18, borderBottom: `1.5px solid ${C_BRIGHT}10`, borderLeft: `1.5px solid ${C_BRIGHT}10`, borderRadius: "0 0 0 4px" }} />
                <div style={{ position: "absolute", bottom: 12, right: 12, width: 18, height: 18, borderBottom: `1.5px solid ${C_BRIGHT}08`, borderRight: `1.5px solid ${C_BRIGHT}08`, borderRadius: "0 0 4px 0" }} />

                {/* Shimmer sweep on hover — CSS driven */}
                <div className="cfk-focus-shimmer-sweep absolute inset-0 pointer-events-none" style={{
                  background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 55%, transparent 60%)`,
                  backgroundSize: "200% 100%",
                  backgroundPosition: "-100% 0",
                  transition: "background-position 0.8s ease",
                }} />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
          style={{ textAlign: "center", marginTop: 52 }}
        >
          <a
            href="#agenda"
            onClick={(e) => { e.preventDefault(); document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth" }); }}
            className="cfk-tracks-cta"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px",
              borderRadius: 50, border: `1px solid ${C}25`, background: `${C}06`,
              fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500,
              color: C_BRIGHT, textDecoration: "none", transition: "all 0.35s ease", letterSpacing: "0.3px", cursor: "pointer",
            }}
          >
            View Full Agenda <span style={{ fontSize: 16, transition: "transform 0.3s ease" }}>→</span>
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 100, background: "linear-gradient(to bottom, transparent, #0C0809)", zIndex: 4 }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 10%, ${C}12, transparent 90%)`, zIndex: 5 }} />

      <style jsx global>{`
        @keyframes cfk-focus-glow-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes cfk-focus-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .cfk-focus-pulse { animation: cfk-focus-glow-pulse 8s ease-in-out infinite; }
        .cfk-focus-headline { animation: cfk-focus-shimmer 8s ease-in-out infinite; }
        .cfk-focus-card:hover {
          border-color: ${C_BRIGHT}30 !important;
          transform: translateY(-5px);
          box-shadow: 0 24px 70px rgba(0,0,0,0.55), 0 0 0 1px ${C_BRIGHT}12, 0 0 50px ${C}15, inset 0 1px 0 rgba(255,255,255,0.07) !important;
        }
        .cfk-focus-card:hover .cfk-focus-glow {
          background: radial-gradient(ellipse 55% 45% at 5% 5%, ${C}28, transparent 65%) !important;
        }
        .cfk-focus-card:hover .cfk-focus-topline {
          height: 2px !important;
          background: linear-gradient(90deg, ${C_BRIGHT}00 2%, ${C_BRIGHT}70 25%, ${C_BRIGHT}90 50%, ${C_BRIGHT}70 75%, ${C_BRIGHT}00 98%) !important;
          box-shadow: 0 0 24px ${C_BRIGHT}25, 0 2px 16px ${C_BRIGHT}18 !important;
        }
        .cfk-focus-card:hover .cfk-focus-bar {
          top: 5% !important; bottom: 5% !important;
          background: linear-gradient(180deg, transparent 0%, ${C_BRIGHT}90 20%, ${C_BRIGHT} 50%, ${KENYA_ACCENT}60 80%, transparent 100%) !important;
          box-shadow: 0 0 18px ${C_BRIGHT}25, 3px 0 24px ${C_BRIGHT}12 !important;
          width: 3px !important;
        }
        .cfk-focus-card:hover .cfk-focus-num {
          background: linear-gradient(170deg, ${C_BRIGHT}20, ${C_BRIGHT}08) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
        }
        .cfk-focus-card:hover .cfk-focus-icon {
          background: linear-gradient(145deg, ${C}38, ${C}18) !important;
          border-color: ${C_BRIGHT}40 !important;
          box-shadow: 0 0 28px ${C}25, 0 4px 16px ${C}15, inset 0 1px 0 rgba(255,255,255,0.08) !important;
          transform: scale(1.05);
        }
        .cfk-focus-card:hover .cfk-focus-icon svg {
          opacity: 1 !important;
          filter: drop-shadow(0 0 8px ${C_BRIGHT}50) !important;
        }
        .cfk-focus-card:hover .cfk-focus-shimmer-sweep {
          background-position: 100% 0 !important;
        }
        .cfk-tracks-cta:hover {
          background: ${C}14 !important;
          border-color: ${C_BRIGHT}40 !important;
          box-shadow: 0 4px 24px ${C}15, 0 0 40px ${C}08 !important;
          transform: translateY(-2px);
        }
        .cfk-tracks-cta:hover span { transform: translateX(4px); }
        @media (max-width: 1024px) {
          .cfk-focus-grid { gap: 14px !important; }
          .cfk-focus-card { padding: 30px 28px 26px 38px !important; }
        }
        @media (max-width: 768px) {
          .cfk-focus-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .cfk-focus-card { padding: 28px 22px 24px 34px !important; grid-column: auto !important; }
          .cfk-focus-num { font-size: 70px !important; right: 8px !important; top: -10px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── ADVISORY BOARD ──────────────────────────────────────────────────────────
function AdvisoryBoard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #080505 0%, #0A0607 100%)",
        padding: "clamp(40px, 5vw, 72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${KENYA_ACCENT}06, transparent 70%)` }} />
      <DotMatrixGrid color={KENYA_ACCENT} opacity={0.015} spacing={30} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 30, height: 1, background: KENYA_ACCENT }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: KENYA_ACCENT }}>
              Leadership
            </span>
            <span style={{ width: 30, height: 1, background: KENYA_ACCENT }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.8vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.08, margin: "16px 0 0" }}>
            Advisory Board
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 500, margin: "14px auto 0", lineHeight: 1.6 }}>
            Industry leaders shaping the summit agenda and driving cybersecurity excellence across East Africa.
          </p>
        </motion.div>

        <div
          className="cfk-advisory-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {ADVISORY_BOARD.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
              style={{
                padding: "24px 16px",
                borderRadius: 18,
                background: `linear-gradient(145deg, ${KENYA_ACCENT}08, rgba(255,255,255,0.02))`,
                border: `1px solid ${KENYA_ACCENT}15`,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${KENYA_ACCENT}08, transparent 70%)` }} />
              
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  margin: "0 auto 16px",
                  background: `linear-gradient(135deg, ${KENYA_ACCENT}30, ${KENYA_ACCENT}10)`,
                  border: `2px solid ${KENYA_ACCENT}40`,
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 24, fontWeight: 600, color: KENYA_ACCENT }}>
                  {member.name.charAt(0)}
                </span>
              </div>

              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "white", margin: "0 0 4px", lineHeight: 1.3 }}>
                {member.name}
              </h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 4px", lineHeight: 1.4 }}>
                {member.title}
              </p>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 10, color: KENYA_ACCENT, margin: 0, fontWeight: 500 }}>
                {member.org}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .cfk-advisory-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .cfk-advisory-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .cfk-advisory-grid > div { padding: 16px 12px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── SPEAKERS ────────────────────────────────────────────────────────────────
function Speakers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  
  return (
    <section id="speakers" ref={ref} style={{ background: "#090506", padding: "clamp(40px,5vw,72px) 0" }}>
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
                fontSize: 11,
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
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "#484848", margin: 0 }}>
              East Africa&apos;s most senior cybersecurity and technology leaders
            </p>
          </div>
          <div style={{ padding: "10px 22px", borderRadius: 30, background: `${KENYA_ACCENT}12`, border: `1px solid ${KENYA_ACCENT}30` }}>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, color: KENYA_ACCENT }}>
              More Speakers Coming Soon
            </span>
          </div>
        </motion.div>

        <div className="cfk-speakers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
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
              justifyContent: "center",
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

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px 20px" }}>
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
                fontSize: 10,
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
                  fontSize: 9,
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
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C_BRIGHT }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>{timeRange}</span>
          <span style={{
            fontFamily: "var(--font-dm)", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)",
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
            <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.3)", marginBottom: 5, letterSpacing: "0.3px" }}>{item.time}</div>

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
                  fontFamily: "var(--font-dm)", fontSize: 9, fontWeight: 600,
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
    <section ref={ref} id="agenda" style={{ background: "#0C0809", padding: "clamp(90px, 11vw, 140px) 0", position: "relative", overflow: "hidden" }}>
      {/* Background photo */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=70" alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" style={{ filter: "brightness(0.04) saturate(0.2) contrast(1.2)" }} />
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
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT }}>Agenda</span>
            <span style={{ width: 28, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 40px)", letterSpacing: "-1.5px", color: "rgba(255,255,255,0.88)", lineHeight: 1.15, margin: "0 0 8px" }}>
            The Day&apos;s{" "}
            <span style={{ color: C_BRIGHT }}>Programme</span>
          </h2>
          <h2 className="cfk-agenda-headline" style={{
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: "clamp(30px, 4vw, 48px)", letterSpacing: "-2px", lineHeight: 1.1, margin: "0 0 12px",
            background: `linear-gradient(135deg, ${C_BRIGHT} 0%, #ffffff 50%, ${C_BRIGHT} 100%)`,
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
        padding: "clamp(48px, 6vw, 80px) 0",
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
                fontSize: 11,
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

          {/* Row 1 — scrolls left */}
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
                    justifyContent: "center",
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

          {/* Row 2 — scrolls right */}
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
                    justifyContent: "center",
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
            }}
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

// ─── GROWTH STORY ────────────────────────────────────────────────────────────
function GrowthStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const locationLabels = ["Dubai, UAE", "Kuwait City, Kuwait", "Nairobi, Kenya"];
  const locationFlags = ["🇦🇪", "🇰🇼", "🇰🇪"];
  const editionLabels = ["Edition 01", "Edition 02", "Edition 03"];
  const maxDelegates = 310; // for progress bar scaling

  return (
    <section ref={ref} style={{ background: "#0C0809", padding: "clamp(100px, 12vw, 160px) 0", position: "relative", overflow: "hidden" }}>
      {/* Background photo */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=70" alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" style={{ filter: "brightness(0.04) saturate(0.2) contrast(1.2)" }} />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(12,8,9,0.97) 0%, rgba(12,8,9,0.45) 35%, rgba(12,8,9,0.45) 65%, rgba(12,8,9,0.97) 100%)" }} />

      {/* Atmospheric glows — 4 orbs */}
      <div className="absolute inset-0 pointer-events-none cfk-growth-pulse" style={{ background: `radial-gradient(ellipse 55% 50% at 50% 28%, ${C_BRIGHT}0C, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 30% 35% at 8% 40%, ${C}0A, transparent 60%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 25% 30% at 92% 50%, ${C_BRIGHT}08, transparent 60%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 25% at 50% 85%, ${C}06, transparent 60%)` }} />

      {/* Dot matrix pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(${C_BRIGHT}08 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 65% 55% at 50% 50%, black 15%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 50%, black 15%, transparent 70%)",
        opacity: 0.5,
      }} />

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 4px)",
        zIndex: 2,
      }} />

      {/* Top border with glow */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 5%, ${C_BRIGHT}28, ${C_BRIGHT}18, transparent 95%)` }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative", zIndex: 3 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 28 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 24 }}>
            <span style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT})` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT }}>Our Journey</span>
            <span style={{ width: 36, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px, 4vw, 48px)", letterSpacing: "-1.5px", color: "rgba(255,255,255,0.92)", lineHeight: 1.15, margin: "0 0 6px" }}>
            From Dubai to{" "}
            <span style={{ color: C_BRIGHT }}>Nairobi</span>
          </h2>
          <h2 className="cfk-growth-headline" style={{
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: "clamp(32px, 4.5vw, 54px)", letterSpacing: "-2.5px", lineHeight: 1.1, margin: "0 0 16px",
            background: `linear-gradient(135deg, ${C_BRIGHT} 0%, #ffffff 50%, ${C_BRIGHT} 100%)`,
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent", color: "transparent",
          }}>
            3 Editions. 3 Regions. One Mission.
          </h2>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            style={{ width: 70, height: 2, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, ${C}, ${C_BRIGHT}, transparent)`, borderRadius: 2, margin: "0 auto 24px" }}
          />

          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 16, color: "rgba(255,255,255,0.42)", maxWidth: 540, margin: "0 auto", lineHeight: 1.75 }}>
            Tracking the Cyber First series as it expands across the Middle East, Gulf, and now East Africa.
          </p>
        </motion.div>

        {/* Divider with triple dots */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          style={{ maxWidth: 1100, margin: "48px auto 56px", position: "relative" }}
        >
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, ${C_BRIGHT}12 15%, ${C_BRIGHT}22 50%, ${C_BRIGHT}12 85%, transparent 100%)` }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", gap: 8 }}>
            {[4, 6, 4].map((s, idx) => (
              <div key={idx} style={{ width: s, height: s, background: idx === 1 ? C_BRIGHT : `${C_BRIGHT}50`, borderRadius: idx === 1 ? 1 : "50%", transform: idx === 1 ? "rotate(45deg)" : "none", boxShadow: idx === 1 ? `0 0 14px ${C_BRIGHT}45` : "none" }} />
            ))}
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="cfk-growth-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, position: "relative" }}>
          {/* Progress connector line behind cards */}
          <div className="cfk-growth-connector" style={{
            position: "absolute", top: 56, left: "16.67%", right: "16.67%", zIndex: 0,
          }}>
            {/* Dashed track */}
            <div style={{ height: 1, background: `repeating-linear-gradient(90deg, ${C_BRIGHT}18 0px, ${C_BRIGHT}18 8px, transparent 8px, transparent 14px)` }} />
            {/* Solid overlay gradient */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, rgba(255,255,255,0.03), ${C_BRIGHT}20, ${C_BRIGHT}45)`, marginTop: -0.5 }} />
            {/* Stepping stones */}
            {[0, 0.5, 1].map((p, pi) => (
              <div key={p} style={{
                position: "absolute", left: `${p * 100}%`, top: -4, transform: "translateX(-50%)",
              }}>
                <div style={{ width: pi === 2 ? 10 : 8, height: pi === 2 ? 10 : 8, borderRadius: "50%", background: pi === 2 ? C_BRIGHT : `${C_BRIGHT}40`, boxShadow: pi === 2 ? `0 0 12px ${C_BRIGHT}60, 0 0 4px ${C_BRIGHT}30` : "none", border: pi === 2 ? `2px solid ${C_BRIGHT}80` : "none" }} />
              </div>
            ))}
          </div>

          {GROWTH.map((g, i) => (
            <Tilt key={g.year} max={4}>
              <motion.div
                className={`cfk-growth-card ${g.active ? "cfk-growth-card-active" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.5 + i * 0.2, ease: EASE }}
                style={{
                  padding: "44px 32px 34px",
                  borderRadius: 22,
                  background: g.active
                    ? `linear-gradient(160deg, rgba(181,34,48,0.12) 0%, rgba(181,34,48,0.04) 50%, rgba(110,20,25,0.02) 100%)`
                    : `linear-gradient(160deg, rgba(${20 + i * 4},${16 + i * 2},${18 + i * 2},0.9) 0%, rgba(14,10,12,0.95) 100%)`,
                  border: `1px solid ${g.active ? C_BRIGHT + "48" : "rgba(255,255,255,0.07)"}`,
                  borderTop: `1px solid ${g.active ? C_BRIGHT + "55" : "rgba(255,255,255,0.1)"}`,
                  position: "relative",
                  overflow: "hidden",
                  zIndex: 1,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: g.active
                    ? `0 16px 48px ${C_BRIGHT}16, 0 0 0 1px ${C_BRIGHT}0A inset, inset 0 1px 0 ${C_BRIGHT}1A, 0 0 80px ${C_BRIGHT}06`
                    : "0 6px 28px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                  transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
                  backgroundSize: "36px 36px",
                  opacity: g.active ? 0.7 : 0.35,
                }} />

                {/* Shimmer sweep on hover */}
                <div className="cfk-growth-shimmer-sweep absolute inset-0 pointer-events-none" style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  backgroundPosition: "200% 0",
                  transition: "background-position 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                }} />

                {/* Hover glow overlay */}
                <div className="cfk-growth-glow absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 60% at 30% 20%, ${C_BRIGHT}00, transparent 70%)`, transition: "all 0.5s ease", opacity: 0 }} />

                {/* Active card ambient glow */}
                {g.active && (
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 55% at 50% -10%, ${C_BRIGHT}15, transparent 55%)` }} />
                )}

                {/* Top neon edge */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: g.active ? 2 : 1, background: g.active ? `linear-gradient(90deg, transparent 5%, ${C_BRIGHT}80, ${C_BRIGHT}, ${C_BRIGHT}80, transparent 95%)` : `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)`, boxShadow: g.active ? `0 0 16px ${C_BRIGHT}35, 0 0 6px ${C_BRIGHT}25` : "none" }} />

                {/* Left accent bar */}
                <div className="cfk-growth-bar" style={{ position: "absolute", top: "10%", bottom: "10%", left: 0, width: g.active ? 3 : 2, background: g.active ? `linear-gradient(180deg, transparent, ${C_BRIGHT}80, ${C_BRIGHT}50, transparent)` : `linear-gradient(180deg, transparent, rgba(255,255,255,0.05), transparent)`, borderRadius: "0 3px 3px 0", transition: "all 0.45s ease", boxShadow: g.active ? `3px 0 12px ${C_BRIGHT}18` : "none" }} />

                {/* Corner brackets for active card */}
                {g.active && <>
                  <div style={{ position: "absolute", top: 8, left: 8, width: 16, height: 16, borderTop: `1.5px solid ${C_BRIGHT}55`, borderLeft: `1.5px solid ${C_BRIGHT}55`, borderRadius: "4px 0 0 0" }} />
                  <div style={{ position: "absolute", top: 8, right: 8, width: 16, height: 16, borderTop: `1.5px solid ${C_BRIGHT}55`, borderRight: `1.5px solid ${C_BRIGHT}55`, borderRadius: "0 4px 0 0" }} />
                  <div style={{ position: "absolute", bottom: 8, left: 8, width: 16, height: 16, borderBottom: `1.5px solid ${C_BRIGHT}55`, borderLeft: `1.5px solid ${C_BRIGHT}55`, borderRadius: "0 0 0 4px" }} />
                  <div style={{ position: "absolute", bottom: 8, right: 8, width: 16, height: 16, borderBottom: `1.5px solid ${C_BRIGHT}55`, borderRight: `1.5px solid ${C_BRIGHT}55`, borderRadius: "0 0 4px 0" }} />
                </>}

                {/* Edition label */}
                <div style={{
                  fontFamily: "var(--font-dm)", fontSize: 9, fontWeight: 600,
                  letterSpacing: "2.5px", textTransform: "uppercase",
                  color: g.active ? `${C_BRIGHT}70` : "rgba(255,255,255,0.12)",
                  marginBottom: 8, position: "relative", zIndex: 2,
                }}>
                  {editionLabels[i]}
                </div>

                {/* Badge */}
                <div style={{
                  position: "absolute", top: 20, right: 20,
                  padding: "4px 12px", borderRadius: 20, display: "flex", alignItems: "center", gap: 5,
                  background: g.active ? `${C_BRIGHT}1A` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${g.active ? C_BRIGHT + "40" : "rgba(255,255,255,0.07)"}`,
                  backdropFilter: "blur(8px)",
                }}>
                  {g.active && <span className="cfk-growth-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 6px ${C_BRIGHT}60` }} />}
                  {!g.active && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>}
                  <span style={{
                    fontFamily: "var(--font-dm)", fontSize: 9, fontWeight: g.active ? 700 : 500,
                    letterSpacing: g.active ? "1.5px" : "1px", textTransform: "uppercase",
                    color: g.active ? C_BRIGHT : "rgba(255,255,255,0.3)",
                  }}>
                    {g.active ? "Current" : "Completed"}
                  </span>
                </div>

                {/* Year — gradient on active, larger */}
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: g.active ? 68 : 58, fontWeight: 900,
                  letterSpacing: "-4px", lineHeight: 1, marginBottom: 2, position: "relative", zIndex: 2,
                  ...(g.active ? {
                    background: `linear-gradient(180deg, ${C_BRIGHT} 20%, ${C_DIM} 100%)`,
                    WebkitBackgroundClip: "text", backgroundClip: "text",
                    WebkitTextFillColor: "transparent", color: "transparent",
                    filter: `drop-shadow(0 2px 8px ${C_BRIGHT}18)`,
                  } : { color: "rgba(255,255,255,0.08)" }),
                }}>
                  {g.year}
                </div>

                {/* Location with flag */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 7,
                  fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 400,
                  color: g.active ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.22)",
                  marginBottom: 28, letterSpacing: "0.3px", position: "relative", zIndex: 2,
                }}>
                  <span style={{ fontSize: 15, filter: g.active ? "none" : "grayscale(0.6) opacity(0.5)" }}>{locationFlags[i]}</span>
                  {locationLabels[i]}
                </div>

                {/* Stats rows with progress bars */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative", zIndex: 2 }}>
                  {([
                    ["Delegates", g.delegates],
                    ["Speakers", g.speakers],
                    ["Sponsors", g.sponsors],
                    ["Media Partners", g.media],
                  ] as [string, number][]).map(([label, val], si) => {
                    const barMax = label === "Delegates" ? 350 : label === "Speakers" ? 30 : label === "Sponsors" ? 30 : 20;
                    const pct = Math.min((val / barMax) * 100, 100);
                    return (
                      <div key={label} style={{
                        padding: "13px 0 14px",
                        borderBottom: si < 3 ? `1px solid ${g.active ? C_BRIGHT + "0C" : "rgba(255,255,255,0.035)"}` : "none",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: g.active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", letterSpacing: "0.2px" }}>
                            {label}
                          </span>
                          <span style={{
                            fontFamily: "var(--font-display)", fontSize: g.active ? 26 : 21, fontWeight: 800,
                            color: g.active ? C_BRIGHT : "rgba(255,255,255,0.38)",
                            letterSpacing: "-0.5px", lineHeight: 1,
                          }}>
                            {inView ? <Counter to={val} suffix="+" duration={1400} /> : val}
                          </span>
                        </div>
                        {/* Mini progress bar */}
                        <div style={{ height: 2, borderRadius: 1, background: g.active ? `${C_BRIGHT}0A` : "rgba(255,255,255,0.02)", overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${pct}%` } : {}}
                            transition={{ duration: 1.2, delay: 0.8 + si * 0.1 + i * 0.15, ease: EASE }}
                            style={{
                              height: "100%", borderRadius: 1,
                              background: g.active
                                ? `linear-gradient(90deg, ${C_BRIGHT}50, ${C_BRIGHT})`
                                : `linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12))`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Extra info pill */}
                <div style={{
                  marginTop: 16, padding: "13px 16px", borderRadius: 14,
                  background: g.active ? `linear-gradient(135deg, ${C_BRIGHT}0E, ${C_BRIGHT}06)` : "rgba(255,255,255,0.018)",
                  border: `1px solid ${g.active ? C_BRIGHT + "20" : "rgba(255,255,255,0.04)"}`,
                  display: "flex", alignItems: "flex-start", gap: 10,
                  position: "relative", zIndex: 2,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: g.active ? `${C_BRIGHT}15` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${g.active ? C_BRIGHT + "25" : "rgba(255,255,255,0.05)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={g.active ? C_BRIGHT : "rgba(255,255,255,0.18)"} strokeWidth="2" strokeLinecap="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: g.active ? `${C_BRIGHT}BB` : "rgba(255,255,255,0.2)", lineHeight: 1.55 }}>
                    {g.extra}
                  </span>
                </div>

                {/* Bottom corner dot */}
                <div style={{ position: "absolute", bottom: 14, right: 18, width: 4, height: 4, borderRadius: "50%", background: g.active ? `${C_BRIGHT}40` : "rgba(255,255,255,0.05)" }} />
              </motion.div>
            </Tilt>
          ))}
        </div>

        {/* Cumulative stats bar — glass container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.2, ease: EASE }}
          style={{
            display: "flex", justifyContent: "center", gap: 0, marginTop: 60,
            background: "linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))",
            border: `1px solid rgba(255,255,255,0.06)`,
            borderTop: `1px solid rgba(255,255,255,0.09)`,
            borderRadius: 18, overflow: "hidden", position: "relative",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Subtle top glow on stats bar */}
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}20, transparent)` }} />

          {[
            ["Total Delegates", "790+", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4"],
            ["Nations Reached", "5+", "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5"],
            ["Organisations", "120+", "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"],
          ].map(([label, val, icon], idx) => (
            <div key={label} style={{
              textAlign: "center", flex: 1, padding: "32px 20px 28px",
              borderRight: idx < 2 ? `1px solid rgba(255,255,255,0.05)` : "none",
              position: "relative",
            }}>
              {/* Icon */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${C_BRIGHT}0C`, border: `1px solid ${C_BRIGHT}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                    <path d={icon} />
                  </svg>
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: C_BRIGHT, letterSpacing: "-0.5px", marginBottom: 6 }}>{val}</div>
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.32)", letterSpacing: "1.2px", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 120, background: "linear-gradient(to bottom, transparent, #0C0809)", zIndex: 4 }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent 10%, ${C_BRIGHT}18, transparent 90%)`, zIndex: 5 }} />

      <style jsx global>{`
        @keyframes cfk-growth-glow-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes cfk-growth-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes cfk-growth-dot-blink {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px ${C_BRIGHT}60; }
          50% { opacity: 0.3; box-shadow: 0 0 2px ${C_BRIGHT}20; }
        }
        @keyframes cfk-growth-border-pulse {
          0%, 100% { border-color: ${C_BRIGHT}48; }
          50% { border-color: ${C_BRIGHT}30; }
        }
        .cfk-growth-pulse { animation: cfk-growth-glow-pulse 8s ease-in-out infinite; }
        .cfk-growth-headline { animation: cfk-growth-shimmer 8s ease-in-out infinite; }
        .cfk-growth-dot { animation: cfk-growth-dot-blink 2s ease-in-out infinite; }
        .cfk-growth-card-active { animation: cfk-growth-border-pulse 4s ease-in-out infinite; }
        .cfk-growth-card:hover {
          transform: translateY(-7px) !important;
          border-color: ${C_BRIGHT}38 !important;
          box-shadow: 0 24px 64px ${C_BRIGHT}14, 0 0 0 1px ${C_BRIGHT}0A inset, inset 0 1px 0 ${C_BRIGHT}14 !important;
        }
        .cfk-growth-card:hover .cfk-growth-shimmer-sweep {
          background-position: -200% 0 !important;
        }
        .cfk-growth-card:hover .cfk-growth-glow {
          opacity: 1 !important;
          background: radial-gradient(ellipse 80% 60% at 25% 15%, ${C_BRIGHT}0E, transparent 70%) !important;
        }
        .cfk-growth-card:hover .cfk-growth-bar {
          top: 6% !important;
          bottom: 6% !important;
          width: 3px !important;
          background: linear-gradient(180deg, transparent, ${C_BRIGHT}80, ${C_BRIGHT}50, transparent) !important;
          box-shadow: 3px 0 14px ${C_BRIGHT}22 !important;
        }
        @media (max-width: 768px) {
          .cfk-growth-grid { grid-template-columns: 1fr !important; }
          .cfk-growth-connector { display: none !important; }
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
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
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
        padding: "clamp(64px,8vw,120px) 0",
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
                fontSize: 11,
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
              color: "#707070",
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
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
    <section ref={ref} style={{ background: "#090506", padding: "clamp(100px, 12vw, 160px) 0", position: "relative", overflow: "hidden" }}>
      {/* Atmospheric orbs — 4 layers */}
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
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT }}>Programme</span>
            <span style={{ width: 36, height: 1, background: `linear-gradient(270deg, transparent, ${C_BRIGHT})` }} />
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(32px, 4.5vw, 54px)", letterSpacing: "-2.5px",
            color: "rgba(255,255,255,0.92)", lineHeight: 1.08, margin: "0 0 10px",
          }}>
            What to Expect at{" "}
            <span className="cfk-expect-headline" style={{
              background: `linear-gradient(135deg, ${C_BRIGHT} 0%, #ffffff 50%, ${C_BRIGHT} 100%)`,
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

          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 540, margin: "0 auto", lineHeight: 1.75 }}>
            A full-day programme designed to equip, connect, and inspire East Africa&apos;s cybersecurity leadership.
          </p>
        </motion.div>

        {/* Cards — featured top card + 3 below */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Featured first card — full width */}
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
            alt=""
            className="w-full h-full object-cover"
            style={{
              filter: hovered ? "brightness(0.35) saturate(0.6)" : "brightness(0.18) saturate(0.4)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              objectPosition: featured ? "center 30%" : "center",
              transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>

        {/* Gradient overlay — tinted crimson */}
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

        {/* Number watermark — gradient on hover */}
        <div style={{
          position: "absolute", top: featured ? 16 : 10, right: featured ? 28 : 20, zIndex: 2,
          fontFamily: "var(--font-display)", fontSize: featured ? 100 : 72, fontWeight: 900,
          letterSpacing: "-5px", lineHeight: 1,
          transition: "all 0.5s",
          ...(hovered ? {
            background: `linear-gradient(180deg, ${C_BRIGHT}18, ${C_BRIGHT}08)`,
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
                  fontFamily: "var(--font-dm)", fontSize: 9, fontWeight: 600,
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

            {/* Highlight tags — keywords */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: featured ? 20 : 16 }}>
              {item.highlights.map((h) => (
                <span key={h} style={{
                  padding: "3px 10px", borderRadius: 6,
                  background: hovered ? `${C_BRIGHT}12` : "rgba(255,255,255,0.025)",
                  border: `1px solid ${hovered ? `${C_BRIGHT}22` : "rgba(255,255,255,0.05)"}`,
                  fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 500,
                  color: hovered ? `${C_BRIGHT}CC` : "rgba(255,255,255,0.25)",
                  letterSpacing: "0.3px", transition: "all 0.35s",
                }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Corner brackets — all 4 */}
        <div style={{ position: "absolute", top: 10, left: 10, width: 16, height: 16, borderTop: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderLeft: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderRadius: "4px 0 0 0", transition: "border-color 0.4s", zIndex: 3 }} />
        <div style={{ position: "absolute", top: 10, right: 10, width: 16, height: 16, borderTop: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderRight: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderRadius: "0 4px 0 0", transition: "border-color 0.4s", zIndex: 3 }} />
        <div style={{ position: "absolute", bottom: 10, left: 10, width: 16, height: 16, borderBottom: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderLeft: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderRadius: "0 0 0 4px", transition: "border-color 0.4s", zIndex: 3 }} />
        <div style={{ position: "absolute", bottom: 10, right: 10, width: 16, height: 16, borderBottom: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderRight: `1.5px solid ${hovered ? `${C_BRIGHT}45` : "rgba(255,255,255,0.04)"}`, borderRadius: "0 0 4px 0", transition: "border-color 0.4s", zIndex: 3 }} />

        {/* Bottom right accent dot */}
        <div style={{ position: "absolute", bottom: 18, right: featured ? 44 : 22, width: 4, height: 4, borderRadius: "50%", background: hovered ? `${C_BRIGHT}40` : "rgba(255,255,255,0.05)", transition: "background 0.4s", zIndex: 3 }} />

        {/* Bottom left — "Learn more" hint on hover for featured */}
        {featured && (
          <div style={{
            position: "absolute", bottom: 20, right: 44, zIndex: 3,
            display: "flex", alignItems: "center", gap: 6,
            opacity: hovered ? 0.6 : 0, transition: "opacity 0.4s",
          }}>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: C_BRIGHT, letterSpacing: "0.5px" }}>Explore</span>
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hoveredRole, setHoveredRole] = useState<number | null>(null);
  const [hoveredInd, setHoveredInd] = useState<number | null>(null);

  return (
    <section ref={ref} style={{ background: "#090506", padding: "clamp(100px, 12vw, 160px) 0", position: "relative", overflow: "hidden" }}>
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
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT }}>Your Audience</span>
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

          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 540, margin: "0 auto", lineHeight: 1.75 }}>
            Designed for senior decision-makers driving cybersecurity strategy across East Africa&apos;s most critical sectors.
          </p>
        </motion.div>

        {/* Content — Roles grid + Industries panel */}
        <div className="cfk-attend-split" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>
          {/* Roles — 2-column grid inside a glass card */}
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
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", inset: 3, borderRadius: 6, border: `1px solid ${C_BRIGHT}0A` }} />
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.85 }}>
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                </div>
                <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, letterSpacing: "2.2px", textTransform: "uppercase", color: C_BRIGHT }}>Target Roles</span>
              </div>
              <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.18)", letterSpacing: "0.5px" }}>10 roles</span>
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
                    display: "flex", alignItems: "center", justifyContent: "center",
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

          {/* Industries panel — crimson glass card */}
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
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 12px ${C_BRIGHT}10`,
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", inset: 3, borderRadius: 6, border: `1px solid ${C_BRIGHT}15` }} />
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 20h20M5 20V8l7-5 7 5v12M9 20v-6h6v6" />
                  </svg>
                </div>
                <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, letterSpacing: "2.2px", textTransform: "uppercase" }}>
                  Key Industries
                </span>
              </div>
              <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 500, color: `${C_BRIGHT}50`, letterSpacing: "0.5px" }}>% share</span>
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
                  {/* Top row: name + percentage */}
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <div className="flex items-center gap-3">
                      <div style={{
                        width: 22, height: 22, borderRadius: 7,
                        background: hoveredInd === i ? `${C_BRIGHT}22` : `${C_BRIGHT}0C`,
                        border: `1px solid ${hoveredInd === i ? `${C_BRIGHT}42` : `${C_BRIGHT}15`}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
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
                    <span style={{
                      fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700,
                      color: hoveredInd === i ? C_BRIGHT : `${C_BRIGHT}60`,
                      transition: "color 0.3s", flexShrink: 0, marginLeft: 8,
                    }}>
                      {ind.pct}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 3, borderRadius: 2, background: `${C_BRIGHT}0A`, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${ind.pct}%` } : {}}
                      transition={{ duration: 1, delay: 0.7 + i * 0.08, ease: EASE }}
                      style={{
                        height: "100%", borderRadius: 2,
                        background: hoveredInd === i
                          ? `linear-gradient(90deg, ${C_BRIGHT}80, ${C_BRIGHT})`
                          : `linear-gradient(90deg, ${C_BRIGHT}40, ${C_BRIGHT}70)`,
                        boxShadow: hoveredInd === i ? `0 0 8px ${C_BRIGHT}30` : "none",
                        transition: "background 0.3s, box-shadow 0.3s",
                      }}
                    />
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

        {/* Bottom stats bar — glass container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          style={{
            display: "flex", justifyContent: "center", gap: 0, marginTop: 52,
            background: "linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))",
            border: "1px solid rgba(255,255,255,0.06)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 18, overflow: "hidden", position: "relative",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}18, transparent)` }} />

          {[
            ["200+", "Senior Leaders", "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8z"],
            ["6", "Key Industries", "M2 20h20M5 20V8l7-5 7 5v12"],
            ["1", "Transformative Day", "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"],
          ].map(([val, label, icon], idx) => (
            <div key={label} style={{
              textAlign: "center", flex: 1, padding: "30px 20px 26px",
              borderRight: idx < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
              position: "relative",
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: `${C_BRIGHT}0C`, border: `1px solid ${C_BRIGHT}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", inset: 3, borderRadius: 6, border: `1px solid ${C_BRIGHT}08` }} />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                    <path d={icon} />
                  </svg>
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: C_BRIGHT, letterSpacing: "-0.5px", marginBottom: 5 }}>{val}</div>
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.32)", letterSpacing: "1.2px", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </motion.div>
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
    "M13 2L3 14h9l-1 8 10-12h-9l1-8z", // Innovation — lightning
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", // Resilience — shield
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", // Emerging — star
    "M3 21h18M3 10h18M3 7l9-4 9 4M5 10v11M19 10v11M9 21v-4a3 3 0 016 0v4", // Public Sector — building
    "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", // Zero Trust — eye
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", // Sentinel — shield-check
  ];

  return (
    <section ref={ref} id="awards" style={{ background: "linear-gradient(180deg, #0A0608 0%, #0B0708 40%, #0D0809 60%, #0A0608 100%)", padding: "clamp(80px, 10vw, 130px) 0", position: "relative", overflow: "hidden" }}>
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 10%, ${GOLD}07, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 40% at 10% 80%, ${C}04, transparent 60%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 35% at 90% 70%, ${GOLD}04, transparent 60%)` }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>

        {/* ═══ TOP: Header ═══ */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 28 }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.1, ease: EASE }} style={{ width: 60, height: 60, margin: "0 auto 22px", borderRadius: 16, background: `linear-gradient(145deg, ${GOLD}18, ${GOLD}06)`, border: `1px solid ${GOLD}28`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 48px ${GOLD}15, inset 0 1px 0 ${GOLD}20` }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 1012 0V2z" />
            </svg>
          </motion.div>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 14 }}>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: GOLD }}>Awards & Recognition</span>
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

        {/* ═══ BOTTOM: Split — Form (40%) + Categories (60%) ═══ */}
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
                <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, color: GOLD, letterSpacing: "0.5px" }}>Nominations Open</span>
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
                      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: 4, display: "block" }}>Organisation</label>
                      <input type="text" placeholder="Company or Institution" required value={formData.orgName} onChange={(e) => setFormData({ ...formData, orgName: e.target.value })} onFocus={() => setFocusedField("orgName")} onBlur={() => setFocusedField(null)} style={inputStyle("orgName")} />
                    </div>
                    <div className="cfk-input-group">
                      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: 4, display: "block" }}>Contact Person</label>
                      <input type="text" placeholder="Full Name" required value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} onFocus={() => setFocusedField("contactName")} onBlur={() => setFocusedField(null)} style={inputStyle("contactName")} />
                    </div>

                    <div className="cfk-input-group">
                      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: 4, display: "block" }}>Email</label>
                      <input type="email" placeholder="Work Email Address" required value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setAwardsEmailError(null); }} onFocus={() => setFocusedField("email")} onBlur={() => { setFocusedField(null); if (formData.email && !isWorkEmail(formData.email)) setAwardsEmailError("Please use your work email address"); }} style={inputStyle("email")} />
                      {awardsEmailError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "6px 0 0" }}>{awardsEmailError}</p>}
                    </div>

                    <div className="cfk-input-group">
                      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: 4, display: "block" }}>Phone</label>
                      <div style={{ display: "flex", gap: 12, alignItems: "end" }}>
                        <select value={`${awardsSelectedCountry.code}|${awardsSelectedCountry.country}`} onChange={(e) => { const [code, country] = e.target.value.split("|"); const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country); if (c) { setAwardsSelectedCountry(c); setAwardsPhoneError(null); } }} onFocus={() => setFocusedField("countryCode")} onBlur={() => setFocusedField(null)} style={{ ...inputStyle("countryCode"), width: 100, flexShrink: 0, cursor: "pointer", appearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 4px center" }}>
                          {COUNTRY_CODES.map((cc) => (<option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: "#222", background: "#fff" }}>{cc.country} {cc.code}</option>))}
                        </select>
                        <input type="tel" placeholder={awardsSelectedCountry.placeholder} value={formData.phone} onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setAwardsPhoneError(null); }} onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} maxLength={awardsSelectedCountry.length} style={{ ...inputStyle("phone"), flex: 1 }} />
                      </div>
                      {awardsPhoneError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "6px 0 0" }}>{awardsPhoneError}</p>}
                    </div>

                    <div className="cfk-input-group">
                      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: 4, display: "block" }}>Award Category</label>
                      <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} onFocus={() => setFocusedField("category")} onBlur={() => setFocusedField(null)} style={{ ...inputStyle("category"), cursor: "pointer", appearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23707070' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 4px center", color: formData.category ? "white" : "rgba(255,255,255,0.3)" }}>
                        <option value="" disabled style={{ color: "#555", background: "#111" }}>Select Category</option>
                        {AWARDS_DATA.map((a) => (<option key={a.title} value={a.title} style={{ color: "white", background: "#111" }}>{a.title}</option>))}
                      </select>
                    </div>

                    <div className="cfk-input-group">
                      <label style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: 4, display: "block" }}>Reason for Nomination</label>
                      <textarea placeholder="Why should this nominee be considered?" required rows={3} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} onFocus={() => setFocusedField("reason")} onBlur={() => setFocusedField(null)} style={{ ...inputStyle("reason"), resize: "vertical", minHeight: 80, borderBottom: `1.5px solid ${focusedField === "reason" ? GOLD : "rgba(255,255,255,0.10)"}` }} />
                    </div>
                  </div>

                  <button type="submit" className="cfk-nominate-btn" style={{ width: "100%", padding: "16px 32px", borderRadius: 14, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, border: "none", color: "#0A0A0A", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, letterSpacing: "-0.2px", cursor: "pointer", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", boxShadow: `0 4px 24px ${GOLD}25`, position: "relative", overflow: "hidden" }}>
                    <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                      Submit Nomination
                    </span>
                  </button>

                  <p style={{ textAlign: "center", fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 16 }}>
                    Free to nominate · Open to all sectors
                  </p>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }} style={{ textAlign: "center", padding: "40px 12px" }}>
                  <div style={{ width: 60, height: 60, borderRadius: 16, background: `${GOLD}12`, border: `1px solid ${GOLD}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", boxShadow: `0 8px 40px ${GOLD}15` }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "white", margin: "0 0 8px" }}>Nomination Submitted</h4>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>Thank you. Our committee will review your submission shortly.</p>
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

            {/* Category Cards — 2-col grid */}
            <div className="cfk-awards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${GOLD}08`, border: `1px solid ${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.35s" }} className="cfk-award-icon">
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
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${GOLD}0C`, border: `1px solid ${GOLD}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                Who Can Be Nominated
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {AWARDS_ELIGIBILITY.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: `${GOLD}0A`, border: `1px solid ${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="enquire"
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(40px,5vw,72px) 0",
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
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>
            Join Us
          </span>
          <span style={{ width: 30, height: 1, background: C }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.08, margin: "12px 0 0" }}>
          Be Part of{" "}
          <span style={{ background: `linear-gradient(135deg, ${C_BRIGHT}, #FF4D5A)`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
            Cyber First East Africa
          </span>
        </h2>
      </motion.div>

      {/* InquiryForm with overridden styles */}
      <div className="cfk-form-wrapper" style={{ position: "relative", zIndex: 1 }}>
        <InquiryForm defaultCountry="KE" eventName="Cyber First East Africa 2026" />
      </div>

      <style jsx global>{`
        /* Transparent background — let event photo show through */
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

        /* Tab pills — Kenya/Cyber themed */
        .cfk-form-wrapper button[style*="background: var(--orange)"] {
          background: ${C} !important;
          border-color: ${C} !important;
        }

        /* Form card ambient glow — cyan instead of orange */
        .cfk-form-wrapper .inquiry-split > div:last-child > .absolute {
          background: radial-gradient(ellipse, rgba(1,187,245,0.06) 0%, transparent 70%) !important;
        }

        /* Submit button — keep orange (EFG brand) */

        /* Section label — cyan */
        .cfk-form-wrapper [style*="var(--orange)"][style*="letter-spacing: 3px"] {
          color: ${C} !important;
        }

        /* Perk icons — cyan tint */
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

  return (
    <section
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #080505 0%, #0C0708 100%)",
        padding: "clamp(48px, 6vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: KENYA_ACCENT }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: KENYA_ACCENT }}>
              Get in Touch
            </span>
            <span style={{ width: 30, height: 1, background: KENYA_ACCENT }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: "16px 0 0" }}>
            Contact Us
          </h2>
        </motion.div>

        <div className="cfk-contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          {/* Speaking Enquiries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            style={{
              padding: "32px",
              borderRadius: 20,
              background: `linear-gradient(145deg, ${KENYA_ACCENT}08, rgba(255,255,255,0.02))`,
              border: `1px solid ${KENYA_ACCENT}20`,
            }}
          >
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: KENYA_ACCENT, marginBottom: 24 }}>
              For Speaking Enquiries
            </p>
            <div className="flex items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sanjana-headshot.png"
                alt={CFK_CONTACTS.speaking.name}
                style={{ width: 100, height: 100, objectFit: "contain", flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "white", margin: "0 0 2px" }}>
                  {CFK_CONTACTS.speaking.name}
                </p>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "#E8651A", margin: "0 0 16px" }}>
                  {CFK_CONTACTS.speaking.role}
                </p>
                <div className="flex flex-col gap-3">
                  <a href={`tel:${CFK_CONTACTS.speaking.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 transition-colors hover:opacity-80">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={KENYA_ACCENT} strokeWidth="2" strokeLinecap="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "#909090" }}>{CFK_CONTACTS.speaking.phone}</span>
                  </a>
                  <a href={`mailto:${CFK_CONTACTS.speaking.email}`} className="flex items-center gap-3 transition-colors hover:opacity-80">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={KENYA_ACCENT} strokeWidth="2" strokeLinecap="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "#909090" }}>{CFK_CONTACTS.speaking.email}</span>
                  </a>
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/events-first-group_logo_alt.svg"
                alt="Events First Group"
                style={{ width: 120, height: "auto", objectFit: "contain", flexShrink: 0, opacity: 0.85 }}
              />
            </div>
          </motion.div>

          {/* Sponsorship Enquiries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            style={{
              padding: "40px",
              borderRadius: 20,
              background: `linear-gradient(145deg, ${KENYA_ACCENT}08, rgba(255,255,255,0.02))`,
              border: `1px solid ${KENYA_ACCENT}20`,
            }}
          >
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: KENYA_ACCENT, marginBottom: 24 }}>
              For Sponsorship Enquiries
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {CFK_CONTACTS.sponsorship.map((person) => (
                <div key={person.name} className="flex items-center gap-4">
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${KENYA_ACCENT}30, ${KENYA_ACCENT}10)`,
                      border: `1px solid ${KENYA_ACCENT}30`,
                      overflow: "hidden",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {person.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={person.photo} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                    ) : (
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 20, fontWeight: 600, color: KENYA_ACCENT }}>
                        {person.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "var(--font-outfit)", fontWeight: 600, fontSize: 17, color: "white", margin: "0 0 2px" }}>
                      {person.name}
                    </h4>
                    <a href={`mailto:${person.email}`} style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                      {person.email}
                    </a>
                    <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
                      <a href={`https://wa.me/${person.phone.replace(/\s+/g, "").replace("+", "")}`} style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
                        {person.phone}
                      </a>
                      <a href={`https://wa.me/${person.phone.replace(/\s+/g, "").replace("+", "")}`} target="_blank" rel="noopener noreferrer" title="WhatsApp">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .cfk-contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── VENUE ───────────────────────────────────────────────────────────────────
function Venue() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const venueDetails = [
    { icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z", label: "Location", value: "Nairobi, Kenya" },
    { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Date", value: "Wednesday, 8 July 2026" },
    { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Time", value: "8:00 AM — 5:00 PM (EAT)" },
    { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", label: "Format", value: "Full-day conference + networking" },
  ];

  return (
    <section id="venue" ref={sectionRef} style={{ background: "#090506" }}>
      <div style={{ position: "relative", height: "65vh", minHeight: 500, overflow: "hidden" }}>
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <img
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80"
            alt="Nairobi Kenya venue"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.55) saturate(1.1)", minHeight: "120%" }}
          />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, #090506 0%, rgba(10,5,7,0.5) 35%, rgba(10,5,7,0.05) 65%, rgba(10,5,7,0.3) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 40% at 50% 100%, ${KENYA_ACCENT}06, transparent 60%)` }} />

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 clamp(20px,4vw,60px) 120px", zIndex: 2 }}>
          <div style={{ maxWidth: 1320, margin: "0 auto" }}>
            <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={KENYA_ACCENT} strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: KENYA_ACCENT }}>
                The Venue
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px,4.5vw,56px)", letterSpacing: "-2px", color: "white", lineHeight: 1.05, margin: 0 }}>
              <span style={{ color: KENYA_ACCENT }}>Nairobi</span>, Kenya
            </h2>
          </div>
        </div>
      </div>

      <div ref={cardRef} style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px,4vw,60px)", position: "relative", zIndex: 3, marginTop: -80 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            background: "rgba(10,5,7,0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: `1px solid ${KENYA_ACCENT}15`,
            borderRadius: 22,
            padding: "clamp(28px,3.5vw,44px) clamp(24px,3vw,44px)",
            boxShadow: `0 0 80px ${KENYA_ACCENT}04, 0 25px 60px rgba(0,0,0,0.4)`,
          }}
        >
          <div className="cfk-venue-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,3vw,40px)", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 420 }}>
                Kenya&apos;s premier conference destination — hosting East Africa&apos;s leading cybersecurity gathering for its inaugural edition in the heart of Nairobi.
              </p>
              <a
                href="https://maps.google.com/?q=Radisson+Blu+Hotel+Nairobi"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 26px",
                  borderRadius: 50,
                  background: `${KENYA_ACCENT}10`,
                  color: KENYA_ACCENT,
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  border: `1px solid ${KENYA_ACCENT}30`,
                  transition: "all 0.3s ease",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={KENYA_ACCENT} strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Open in Google Maps →
              </a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {venueDetails.map((item) => (
                <div key={item.label} style={{ padding: "18px 16px", background: `${KENYA_ACCENT}05`, border: `1px solid ${KENYA_ACCENT}0A`, borderRadius: 14 }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={KENYA_ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7, flexShrink: 0 }}>
                      <path d={item.icon} />
                    </svg>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, color: KENYA_ACCENT, textTransform: "uppercase", letterSpacing: "1.5px" }}>
                      {item.label}
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ height: "clamp(48px,6vw,80px)" }} />

      <style jsx global>{`
        @media (max-width: 768px) {
          .cfk-venue-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── REGISTRATION SECTION ────────────────────────────────────────────────────
function RegistrationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="register" ref={ref} style={{ background: "#0C0809", padding: "clamp(100px, 12vw, 140px) 0", position: "relative" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${KENYA_ACCENT}12, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 40% at 30% 80%, ${C}08, transparent 60%)` }} />

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", textAlign: "center", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-2px", color: "white", lineHeight: 1.1, margin: "0 0 16px" }}>
            Join Us in<br /><span style={{ color: KENYA_ACCENT }}>Nairobi</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
            Be part of the Cyber First Movement and lead the charge toward a strategic, resilient, and innovative digital economy in the Silicon Savannah.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "18px 40px", borderRadius: 50, background: `linear-gradient(135deg, ${C}, ${C_DIM})`, color: "white", fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: `0 8px 32px ${C}35` }}>
              Register Now <span>→</span>
            </Link>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "18px 40px", borderRadius: 50, background: "transparent", color: "white", fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
