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
import OTYouTubeShorts from "@/components/ot-security-first/OTYouTubeShorts";
import {
  submitForm,
  isWorkEmail,
  COUNTRY_CODES,
  validatePhone,
} from "@/lib/form-helpers";
import type { FormType, CountryCode } from "@/lib/form-helpers";

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = "#E03C32";
const C_BRIGHT = "#FF4D44";
const C_DIM = "#B22D25";
const EASE = [0.16, 1, 0.3, 1] as const;

// South Africa / Industrial accents
const SA_GOLD = "#D4A84B";
const SA_STEEL = "#8B9DAF";

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const S3_LOGOS = `${S3}/sponsors-logo`;

// Event date, September 2026 (placeholder)
const EVENT_DATE = new Date("2026-09-01T08:30:00+02:00");

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

// Advisory Board, from PDF
const ADVISORY_BOARD = [
  {
    name: "Muvhango Livhusha",
    title: "Vice President",
    org: "ISACA South Africa Chapter",
    initials: "ML",
    gradientDir: "135deg",
  },
  {
    name: "Ishaaq Jacobs",
    title: "Chief Information Security Officer",
    org: "Sasol",
    initials: "IJ",
    gradientDir: "225deg",
  },
  {
    name: "Tendani Silima",
    title: "Senior Advisor Cybersecurity",
    org: "Eskom Holdings SOC Ltd",
    initials: "TS",
    gradientDir: "180deg",
  },
  {
    name: "Cathy Leso",
    title: "Chief Information Officer",
    org: "Department of Mineral Resources",
    initials: "CL",
    gradientDir: "315deg",
  },
  {
    name: "Chris Gatsi",
    title: "Chief Information Security Officer",
    org: "Sibanye Stillwater",
    initials: "CG",
    gradientDir: "45deg",
  },
  {
    name: "Thabani Kunene",
    title: "Chief Information Officer",
    org: "Water Research Commission",
    initials: "TK",
    gradientDir: "270deg",
  },
];

// 10 Strategic Themes, from PDF
const STRATEGIC_THEMES = [
  {
    short: "Energy Infrastructure",
    title: "Protecting South Africa's Energy Infrastructure",
    desc: "Securing Eskom's generation, transmission, and distribution SCADA systems against external threats and insider risk.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    short: "Port & Freight Resilience",
    title: "Building Port and Freight Cyber Resilience",
    desc: "Lessons from Transnet; securing container operations, rail signalling, and pipeline SCADA.",
    icon: "M3 17h4V7H3v10zM20 7h-4v10h4V7zM14 3H10v18h4V3z",
  },
  {
    short: "Mining OT Security",
    title: "Securing Mining OT Environments",
    desc: "Protecting automation, ventilation control, and extraction systems across gold, platinum, and coal operations.",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    short: "Regulatory Compliance",
    title: "Navigating the Cybercrimes Act and POPIA Compliance",
    desc: "Translating legislative obligations into operational audit readiness for industrial operators.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4",
  },
  {
    short: "Bridging the Skills Gap",
    title: "Addressing the Critical Skills Gap",
    desc: "Fewer than 2 cybersecurity experts per 100,000 population across Africa; building OT-specific competencies.",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  },
  {
    short: "IT/OT SOC Alignment",
    title: "Aligning IT/OT SOC Structures and Incident Command Authority",
    desc: "For hybrid industrial environments.",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
  },
  {
    short: "Legacy ICS Vulnerabilities",
    title: "Managing Legacy ICS Vulnerabilities in Non-Patchable Environments",
    desc: "2,451 ICS disclosures in 2025, nearly double 2024.",
    icon: "M12 9v2m0 4h.01M5.07 19H19a2 2 0 001.75-2.94l-6.97-12.06a2 2 0 00-3.5 0L3.32 16.06A2 2 0 005.07 19z",
  },
  {
    short: "AI: Shield & Threat",
    title: "Balancing AI as Both Defensive Capability and Emerging Threat Amplifier",
    desc: "Within OT, while addressing load-shedding's impact on security infrastructure uptime.",
    icon: "M12 2a4 4 0 014 4v1a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2V6a4 4 0 014-4zM9 18h6M10 22h4",
  },
  {
    short: "Ransomware Resilience",
    title: "Building Ransomware Resilience",
    desc: "Through downtime engineering, 50% of 2025 ransomware attacks hit critical infrastructure.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    short: "Third-Party Governance",
    title: "Defining Governance Models for Remote Vendor and Third-Party Access",
    desc: "Access across geographically distributed mining and energy sites.",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
];

// Market stats for "Why South Africa" section
const MARKET_STATS = [
  {
    stat: "USD 1.19B → 3.3B",
    label: "South Africa Cybersecurity Market",
    detail: "13.6% CAGR by 2033 (Grand View Research)",
    accent: true,
  },
  {
    stat: "230 Million",
    label: "Threat Detections in SA",
    detail: "Interpol, highest on the continent",
    accent: false,
  },
  {
    stat: "2,374",
    label: "Reported Breaches (2024/25)",
    detail: "82% occurring after April 2025, Information Regulator",
    accent: false,
  },
  {
    stat: "R50 Billion",
    label: "Transnet Attack Export Losses",
    detail: "Cascading disruption across mining & manufacturing",
    accent: true,
  },
  {
    stat: "37%",
    label: "YoY Attack Rise on Government",
    detail: "Government entities in 2024",
    accent: false,
  },
  {
    stat: "<2 per 100K",
    label: "OT Security Experts in Africa",
    detail: "Critical talent deficit across the continent",
    accent: false,
  },
];

// Industrial Players
const INDUSTRIAL_PLAYERS = [
  {
    name: "Eskom",
    desc: "State-owned power utility generating ~90% of South Africa's electricity through coal, nuclear, and renewable assets with extensive SCADA/ICS infrastructure.",
    stat: "90%",
    statLabel: "of SA electricity",
  },
  {
    name: "Transnet",
    desc: "State-owned freight logistics operating rail, ports, and pipelines; Durban handles 60% of national container traffic.",
    stat: "60%",
    statLabel: "container traffic",
  },
  {
    name: "Sasol",
    desc: "Integrated energy and chemical company operating one of the world's largest coal-to-liquids facilities.",
    stat: "1",
    statLabel: "of world's largest CTL",
  },
];

// Who Should Attend roles
const WHO_ATTEND_ROLES = [
  { role: "CISOs", detail: "Within energy, mining, manufacturing, and heavy industry" },
  { role: "Heads of OT Security", detail: "OT and industrial cybersecurity leadership" },
  { role: "Engineering Leaders", detail: "Engineering and automation leadership" },
  { role: "ICS/SCADA Architects", detail: "ICS/SCADA architects and OT network engineers" },
  { role: "Risk & Compliance", detail: "Industrial risk and compliance executives" },
  { role: "Policy & Regulatory", detail: "Regulatory and policy stakeholders" },
];

// Who Should Sponsor categories
const WHO_SPONSOR_ROLES = [
  "OT security platform providers",
  "ICS/SCADA cybersecurity vendors",
  "OT network segmentation & firewall providers",
  "Industrial SOC & OT incident response firms",
  "OT risk & compliance advisory firms",
  "Industrial system integrators",
  "Automation, mining & energy technology providers",
];

// Industry breakdown
const WHO_ATTEND_INDUSTRIES = [
  { name: "Energy & Power", pct: 25 },
  { name: "Mining & Resources", pct: 22 },
  { name: "Manufacturing", pct: 18 },
  { name: "Government & Regulatory", pct: 15 },
  { name: "Oil, Gas & Petrochemicals", pct: 12 },
  { name: "Water & Utilities", pct: 8 },
];

// Event Format items
const EVENT_FORMAT = [
  { title: "Leadership Breakfast", desc: "Invite-only executive breakfast for CISOs and industrial leaders.", icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z", side: "left" as const },
  { title: "International & SA Keynotes", desc: "Global insight combined with local execution clarity from top security leaders.", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", side: "right" as const },
  { title: "SA Industrial Case Studies", desc: "Real-world implementation learning from South African critical infrastructure operators.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", side: "left" as const },
  { title: "Burning Topic Panels", desc: "Deep discussion on POPIA, Cybercrimes Act, ransomware, and mining OT.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", side: "right" as const },
  { title: "1:1 Executive Meetings", desc: "Pre-scheduled meetings with asset owners and security leaders.", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", side: "left" as const },
  { title: "Technical Workshops", desc: "Hands-on sessions for OT security practitioners and ICS engineers.", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z", side: "right" as const },
  { title: "Leadership Roundtable", desc: "Closed-door dialogue for high-trust executive engagement.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", side: "left" as const },
  { title: "Awards Ceremony", desc: "Industry recognition and credibility for outstanding OT security leadership.", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z", side: "right" as const },
];

// Awards categories
const AWARDS_DATA = [
  { title: "OT Security Excellence Award", desc: "Honouring organisations demonstrating exemplary OT/ICS security posture across critical infrastructure." },
  { title: "Industrial Cyber Resilience Award", desc: "Recognising robust incident response and recovery capabilities in industrial environments." },
  { title: "Emerging OT Security Leader Award", desc: "Celebrating rising professionals making significant contributions to OT security in Africa." },
  { title: "Critical Infrastructure Protection Award", desc: "Acknowledging initiatives that enhance the security of national energy, water, and mining infrastructure." },
  { title: "IT/OT Convergence Pioneer Award", desc: "Recognising the most effective bridging of IT and OT security operations." },
  { title: "Regulatory & Compliance Leadership Award", desc: "Honouring leadership in translating POPIA, Cybercrimes Act, and CIPA into operational security." },
];

// Gallery, reuse existing OT Security First + Cyber First event photos
const GALLERY: { src: string; alt: string; area: string; rotate?: number; lift?: boolean }[] = [
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0412.JPG`, alt: "OT Security First panel discussion", area: "hero" },
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0290.JPG`, alt: "Executive networking session", area: "a", rotate: -1.5, lift: true },
  { src: `${S3}/events/Cyber+First+Kuwait+2025/Kuwait+Photos/Kuwait+Photos/4X9A1744.jpg`, alt: "Keynote presentation", area: "b" },
  { src: `${S3}/Good/4N8A0290.JPG`, alt: "Conference atmosphere", area: "c", rotate: 1 },
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0412.JPG`, alt: "OT Security First awards", area: "d" },
  { src: `${S3}/events/Cyber+First+Kuwait+2025/Kuwait+Photos/Kuwait+Photos/4X9A1744.jpg`, alt: "Networking reception", area: "e", lift: true },
];

// Contact details
const CONTACTS = {
  speaking: { name: "Sanjana Venugopal", phone: "+971 55 416 1657", email: "sanjana@eventsfirstgroup.com" },
  sponsorship: [
    { name: "Shyam Reddy", phone: "+971 56 910 0679", email: "shyam@eventsfirstgroup.com" },
    { name: "Mayur Methi", phone: "+971 56 170 9909", email: "mayur@eventsfirstgroup.com" },
  ],
};

// Sponsor logos, reuse existing OT Security First + EFG sponsors
const MARQUEE_ROW_1 = [
  `${S3_LOGOS}/Siemens.png`,
  `${S3_LOGOS}/Fortinet.png`,
  `${S3_LOGOS}/Palo-Alto.png`,
  `${S3_LOGOS}/nozomi.png`,
  `${S3_LOGOS}/Claroty.png`,
  `${S3_LOGOS}/Dragos.png`,
  `${S3_LOGOS}/CyberArk.png`,
  `${S3_LOGOS}/Tenable.png`,
  `${S3_LOGOS}/Schneider.png`,
  `${S3_LOGOS}/Honeywell.png`,
];

const MARQUEE_ROW_2 = [
  `${S3_LOGOS}/Cisco.png`,
  `${S3_LOGOS}/Kaspersky.png`,
  `${S3_LOGOS}/Microsoft.png`,
  `${S3_LOGOS}/Splunk.png`,
  `${S3_LOGOS}/TrendMicro.png`,
  `${S3_LOGOS}/Waterfall.png`,
  `${S3_LOGOS}/Armis.png`,
  `${S3_LOGOS}/tripwire.png`,
  `${S3_LOGOS}/Forescout.png`,
  `${S3_LOGOS}/hexagon.png`,
];

// ─── HERO SECTION ────────────────────────────────────────────────────────────
function HeroSection() {
  const cd = useCountdown(EVENT_DATE);

  return (
    <section id="overview" className="otsf-hero" style={{ position: "relative", height: "100vh", minHeight: 720, overflow: "hidden", background: "#080A0C" }}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={`${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0412.JPG`}
          alt="OT Security First Summit"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.5) saturate(0.8)" }}
        />
      </div>

      {/* Left gradient for text readability */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, rgba(8,10,12,0.95) 0%, rgba(8,10,12,0.8) 35%, rgba(8,10,12,0.4) 60%, transparent 80%)`, zIndex: 1 }} />

      {/* Bottom gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 60%, rgba(8,10,12,0.9) 90%, rgba(8,10,12,1) 100%)`, zIndex: 1 }} />

      {/* Subtle accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 80% 60%, ${C}10, transparent 70%)`, zIndex: 2 }} />

      {/* Subtle cyber grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${C}04 1px, transparent 1px), linear-gradient(90deg, ${C}04 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.4, zIndex: 2 }} />

      {/* Content */}
      <div
        className="otsf-hero-inner"
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          paddingTop: 140,
          paddingBottom: 140,
        }}
      >
        {/* Edition Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            alignSelf: "flex-start",
            gap: 14,
            padding: "12px 22px",
            borderRadius: 50,
            background: "rgba(12,10,14,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 40,
            backdropFilter: "blur(12px)",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 10px ${C_BRIGHT}` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "white" }}>
            Africa & South Africa Edition
          </span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 18 }}>|</span>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
            Johannesburg
          </span>
        </motion.div>

        {/* Main Headline */}
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
            Industrial Cyber
          </h1>
          <h1
            className="otsf-hero-shimmer"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(42px, 7vw, 90px)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              margin: "0 0 24px 0",
              backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, #fff 50%, ${C_BRIGHT} 100%)`,
              backgroundSize: "250% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Resilience
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 400,
            fontSize: "clamp(15px, 1.3vw, 17px)",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.65,
            maxWidth: 500,
            marginBottom: 28,
          }}
        >
          A strategic forum for operational technology leadership, protecting South Africa&apos;s energy, mining, and industrial infrastructure in the era of convergence.
        </motion.p>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
          </svg>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
            Johannesburg, South Africa
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
        >
          <a
            href="#register"
            className="otsf-cta-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              borderRadius: 50,
              background: C,
              color: "white",
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: `0 4px 24px ${C}35`,
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C_BRIGHT;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 12px 40px ${C}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 24px ${C}35`;
            }}
          >
            Register Interest <span>→</span>
          </a>
          <a
            href="#contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              borderRadius: 50,
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.8)",
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              e.currentTarget.style.color = "rgba(255,255,255,0.8)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Become a Sponsor
          </a>
        </motion.div>
      </div>

      {/* Bottom bar, date TBD, countdown hidden until confirmed */}

      <style jsx global>{`
        @media (max-width: 768px) {
          .otsf-hero h1 { font-size: clamp(28px, 9vw, 42px) !important; }
          .otsf-hero-inner { padding: 100px 20px 200px !important; }
          .otsf-countdown-bar { padding: 12px 0 !important; }
        }
      `}</style>
    </section>
  );
}

// ─── STATS BAR ───────────────────────────────────────────────────────────────
function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { to: 230, suffix: "M+", label: "Threat Detections", sub: "In South Africa (Interpol)" },
    { to: 53, prefix: "R", suffix: "M", label: "Avg Breach Cost", sub: "Per incident (2024)" },
    { to: 13.6, suffix: "%", label: "CAGR Growth", sub: "SA cybersecurity market" },
    { to: 2374, suffix: "", label: "Reported Breaches", sub: "2024/25 fiscal year" },
    { to: 37, suffix: "%", label: "YoY Attack Rise", sub: "Government entities" },
  ];

  return (
    <section ref={ref} style={{ background: "#080A0C", padding: "clamp(40px, 5vw, 60px) 0", position: "relative", borderTop: `1px solid ${C}10`, borderBottom: `1px solid ${C}10` }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${C}08, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "clamp(16px, 2vw, 32px)" }} className="otsf-stats-grid">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="otsf-stat-card"
              style={{
                padding: "clamp(20px, 2vw, 32px) clamp(16px, 1.5vw, 24px)",
                background: i === 0 ? `linear-gradient(135deg, ${C}15, ${C}05)` : "rgba(255,255,255,0.03)",
                border: `1px solid ${i === 0 ? `${C}30` : "rgba(255,255,255,0.06)"}`,
                borderRadius: 20,
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3vw, 40px)", color: i === 0 ? C_BRIGHT : "white", letterSpacing: "-1px", display: "block", marginBottom: 6 }}>
                <Counter to={s.to} suffix={s.suffix} prefix={s.prefix || ""} />
              </span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)", display: "block", marginBottom: 4 }}>{s.label}</span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>{s.sub}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── INDUSTRIAL LANDSCAPE, "Why South Africa" ──────────────────────────────
function IndustrialLandscape() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useGSAP(() => {
    if (!mounted || !sectionRef.current || !trackRef.current) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1025px)", () => {
      const track = trackRef.current!;
      const scrollHeight = track.scrollHeight - window.innerHeight + 200;
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${scrollHeight}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      }).to(track, { y: -(track.scrollHeight - window.innerHeight + 100), ease: "none" });
    });
  }, { scope: sectionRef, dependencies: [mounted] });

  return (
    <section ref={sectionRef} style={{ background: "#080A0C", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 40% 50% at 20% 30%, ${C}08, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "clamp(60px, 7vw, 100px) clamp(20px, 4vw, 60px)", display: "flex", gap: "clamp(40px, 5vw, 80px)", minHeight: "100vh", position: "relative" }} className="otsf-why-sa-layout">
        {/* Left, sticky */}
        <div style={{ flex: "0 0 clamp(320px, 38%, 480px)", position: "relative" }} className="otsf-why-sa-left">
          <div style={{ position: "sticky", top: "15vh" }}>
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Why South Africa</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: "0 0 24px" }}>
              Africa&apos;s Most Industrialised Economy<br /><span style={{ color: C_BRIGHT }}>Under Threat</span>
            </h2>
            <div style={{ padding: "20px 24px", borderRadius: 16, background: `${C}10`, border: `1px solid ${C}20`, marginBottom: 24 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, color: C_BRIGHT, display: "block", letterSpacing: "-1px" }}>R53M</span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Average cost of a data breach in South Africa (2024)</span>
            </div>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: 0 }}>
              From South Africa&apos;s mining complexes and energy grids to port infrastructure, water utilities, petrochemical processing, and advanced manufacturing, these are no longer isolated operational domains. They are digitally integrated ecosystems expanding the cyber-physical attack surface.
            </p>
          </div>
        </div>

        {/* Right, scrolling stats */}
        <div ref={trackRef} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24, paddingTop: "10vh", paddingBottom: "10vh" }} className="otsf-why-sa-right">
          {MARKET_STATS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
              className="otsf-stat-row"
              style={{
                padding: "clamp(28px, 3vw, 40px)",
                background: item.accent ? `linear-gradient(135deg, ${C}12, ${C}04)` : "rgba(255,255,255,0.03)",
                border: `1px solid ${item.accent ? `${C}25` : "rgba(255,255,255,0.06)"}`,
                borderRadius: 24,
                transition: "all 0.3s ease",
              }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", color: item.accent ? C_BRIGHT : "white", letterSpacing: "-1px", display: "block", marginBottom: 8 }}>
                {item.stat}
              </span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.85)", display: "block", marginBottom: 6 }}>{item.label}</span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>{item.detail}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── INDUSTRIAL PROFILE, SA's Industrial Giants ─────────────────────────────
function IndustrialProfile() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 100px) 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 40% at 70% 50%, ${C}06, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Strategic Industrial Profile</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: "0 0 16px", maxWidth: 700 }}>
            South Africa&apos;s<br /><span style={{ color: C_BRIGHT }}>Critical Infrastructure</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 48px", maxWidth: 600 }}>
            Africa&apos;s most industrialised economy with the continent&apos;s largest mining, energy, and manufacturing base.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="otsf-industrial-grid">
          {INDUSTRIAL_PLAYERS.map((player, i) => (
            <motion.div
              key={player.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: EASE }}
            >
              <Tilt max={6}>
                <div
                  className="otsf-industrial-card"
                  style={{
                    padding: "clamp(28px, 3vw, 40px)",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 24,
                    minHeight: 320,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Top accent line */}
                  <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, transparent)`, opacity: 0.4 }} />

                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px, 2.5vw, 32px)", color: "white", margin: "0 0 16px", letterSpacing: "-0.5px" }}>{player.name}</h3>
                    <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>{player.desc}</p>
                  </div>

                  <div style={{ marginTop: 32, padding: "16px 0", borderTop: `1px solid ${C}15` }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, color: C_BRIGHT, display: "block", letterSpacing: "-1px" }}>{player.stat}</span>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>{player.statLabel}</span>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>

        {/* Mining sector callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          style={{
            marginTop: 32,
            padding: "clamp(28px, 3vw, 40px)",
            background: `linear-gradient(135deg, ${C}08, rgba(255,255,255,0.02))`,
            border: `1px solid ${C}15`,
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
          }}
          className="otsf-mining-callout"
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(20px, 2vw, 28px)", color: "white", margin: "0 0 8px" }}>Mining & Resources</h3>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>
              Major mining operations, gold, platinum, manganese, chrome, coal, all heavily dependent on industrial control systems. Critical water infrastructure managed by Rand Water and regional utilities.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["Gold", "Platinum", "Manganese", "Chrome", "Coal"].map((mineral) => (
              <span key={mineral} style={{ padding: "8px 16px", borderRadius: 50, background: `${SA_GOLD}15`, border: `1px solid ${SA_GOLD}30`, fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: SA_GOLD }}>
                {mineral}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOCUS AREAS, 10 GSAP Flip Cards ────────────────────────────────────────
function FocusAreas() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  useEffect(() => setMounted(true), []);

  useGSAP(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top 75%",
          onEnter: () => {
            gsap.to(card.querySelector(".otsf-flip-inner"), {
              rotateY: 180,
              duration: 0.8,
              delay: i * 0.05,
              ease: "power2.out",
            });
            setFlippedCards((prev) => new Set([...prev, i]));
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, { scope: sectionRef, dependencies: [mounted] });

  return (
    <section ref={sectionRef} id="agenda" style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 100px) 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 40% at 50% 20%, ${C}06, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Strategic Themes</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: "0 0 16px" }}>
            The Agenda<br /><span style={{ color: C_BRIGHT }}>10 Critical Tracks</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, maxWidth: 600 }}>
            Non-surface industrial priorities anchored in operational practicality, not theoretical abstraction.
          </p>
        </motion.div>

        <div className="otsf-flip-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "clamp(12px, 1.5vw, 20px)" }}>
          {STRATEGIC_THEMES.map((theme, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="otsf-flip-card"
              style={{ perspective: 1200, height: 280, cursor: "pointer" }}
            >
              <div
                className="otsf-flip-inner"
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Front */}
                <div
                  className="otsf-flip-front"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    borderRadius: 20,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "clamp(16px, 1.5vw, 24px)",
                    background: `linear-gradient(180deg, ${C}15, #0D0E10)`,
                    border: `1px solid ${C}20`,
                  }}
                >
                  {/* Icon */}
                  <div style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: 12, background: `${C}15`, border: `1px solid ${C}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={theme.icon} /></svg>
                  </div>
                  {/* Track number */}
                  <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 8 }}>
                    Track {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(15px, 1.3vw, 18px)", color: "white", lineHeight: 1.3, margin: 0 }}>
                    {theme.short}
                  </h3>
                </div>

                {/* Back */}
                <div
                  className="otsf-flip-back"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: 20,
                    overflow: "hidden",
                    padding: "clamp(16px, 1.5vw, 24px)",
                    background: `linear-gradient(135deg, ${C}20, #0D0E10)`,
                    border: `1px solid ${C}30`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 10 }}>
                    Track {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ width: 32, height: 2, background: `linear-gradient(90deg, ${C_BRIGHT}, transparent)`, marginBottom: 12 }} />
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(13px, 1.1vw, 16px)", color: "white", lineHeight: 1.3, margin: "0 0 10px" }}>
                    {theme.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(11px, 0.9vw, 13px)", fontWeight: 400, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>
                    {theme.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ADVISORY BOARD, Horizontal Scroll ──────────────────────────────────────
function AdvisoryBoardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  useEffect(() => setMounted(true), []);

  useGSAP(() => {
    if (!mounted || !trackRef.current || !sectionRef.current) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1025px)", () => {
      const track = trackRef.current!;
      const scrollWidth = track.scrollWidth - window.innerWidth + 400;
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${scrollWidth * 1.2}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      }).to(track, { x: -scrollWidth, ease: "power1.inOut" });
    });
  }, { scope: sectionRef, dependencies: [mounted] });

  const allCards = [
    ...ADVISORY_BOARD,
    { name: "More Speakers", title: "Coming Soon", org: "Join the advisory board", initials: "+", gradientDir: "135deg", isCTA: true },
  ];

  return (
    <section ref={sectionRef} id="speakers" style={{ background: "#080A0C", height: "100vh", display: "flex", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 40% 60% at 80% 50%, ${C}08, transparent 60%)`, pointerEvents: "none" }} />

      {/* Left panel */}
      <div style={{ width: "clamp(320px, 32vw, 460px)", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(24px, 3vw, 60px)", position: "relative", zIndex: 2 }} className="otsf-speakers-left">
        <div style={{ width: 48, height: 3, background: `linear-gradient(90deg, ${C_BRIGHT}, transparent)`, marginBottom: 24 }} />
        <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Leadership</span>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px, 4.5vw, 60px)", lineHeight: 1.0, letterSpacing: "-2px", color: "white", margin: "0 0 20px" }}>
          Advisory<br />Board &<br /><span style={{ color: C_BRIGHT }}>Speakers</span>
        </h2>
        <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 340 }}>
          Industry leaders shaping the conversation on industrial cyber resilience across South Africa and the continent.
        </p>
        <motion.span animate={{ x: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.35)", display: "inline-flex", alignItems: "center", gap: 8 }}>
          Scroll to explore <span style={{ fontSize: 20 }}>→</span>
        </motion.span>
      </div>

      {/* Right, horizontal scroll track */}
      <div ref={trackRef} style={{ display: "flex", alignItems: "center", gap: 32, paddingRight: 200 }} className="otsf-speakers-track">
        {allCards.map((member, i) => {
          const isCTA = "isCTA" in member && member.isCTA;
          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
            >
              <Tilt max={8}>
                <div
                  className="otsf-speaker-card"
                  style={{
                    width: 320,
                    flexShrink: 0,
                    borderRadius: 24,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    position: "relative",
                  }}
                >
                  {/* Top accent */}
                  <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, transparent)`, opacity: 0.5 }} />

                  {/* Photo / Initials placeholder */}
                  <div style={{
                    height: 260,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isCTA
                      ? `linear-gradient(135deg, ${C}20, ${C}08)`
                      : `linear-gradient(${member.gradientDir}, ${C}18, ${C}05, rgba(255,255,255,0.02))`,
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {isCTA ? (
                      <div style={{ textAlign: "center" }}>
                        <span style={{ fontSize: 48, fontWeight: 800, color: C_BRIGHT, display: "block", marginBottom: 8 }}>+</span>
                        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Speakers being announced</span>
                      </div>
                    ) : (
                      <>
                        <span style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 72,
                          fontWeight: 800,
                          color: `${C_BRIGHT}30`,
                          letterSpacing: "-2px",
                        }}>
                          {member.initials}
                        </span>
                        {/* Subtle radial glow behind initials */}
                        <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${C}20, transparent)`, pointerEvents: "none" }} />
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "20px 24px 24px" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", margin: "0 0 6px" }}>{member.name}</h3>
                    <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: C_BRIGHT, margin: "0 0 4px" }}>{member.title}</p>
                    <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.45)", margin: 0 }}>{member.org}</p>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── EVENT FORMAT, Zig-Zag Timeline ─────────────────────────────────────────
function EventFormatSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 100px) 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 50% at 50% 30%, ${C}06, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>What Happens</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: 0 }}>
            At the <span style={{ color: C_BRIGHT }}>Event</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Center line */}
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, transparent, ${C}30, ${C}30, transparent)`, transform: "translateX(-50%)" }} className="otsf-timeline-line" />

          {EVENT_FORMAT.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: item.side === "left" ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              style={{
                display: "flex",
                justifyContent: item.side === "left" ? "flex-end" : "flex-start",
                paddingLeft: item.side === "right" ? "calc(50% + 32px)" : 0,
                paddingRight: item.side === "left" ? "calc(50% + 32px)" : 0,
                marginBottom: 32,
                position: "relative",
              }}
              className="otsf-timeline-item"
            >
              {/* Dot on center line */}
              <div style={{
                position: "absolute",
                left: "50%",
                top: 24,
                transform: "translateX(-50%)",
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: C,
                border: `3px solid #080A0C`,
                boxShadow: `0 0 16px ${C}60`,
                zIndex: 2,
              }} />

              <div
                className="otsf-timeline-card"
                style={{
                  maxWidth: 360,
                  padding: "24px 28px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 20,
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C}12`, border: `1px solid ${C}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "white", margin: 0, lineHeight: 1.3 }}>{item.title}</h3>
                </div>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHO SHOULD ATTEND ───────────────────────────────────────────────────────
function WhoShouldAttend() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 100px) 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 40% at 30% 60%, ${C}06, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Designed For</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: 0 }}>
            Who This Forum<br /><span style={{ color: C_BRIGHT }}>Is Built For</span>
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }} className="otsf-who-grid">
          {/* Attendees */}
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "white", margin: "0 0 24px" }}>Who Should <span style={{ color: C_BRIGHT }}>Attend</span></h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {WHO_ATTEND_ROLES.map((item, i) => (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE }}
                  className="otsf-role-card"
                  style={{
                    padding: "16px 20px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    transition: "all 0.3s ease",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "white", display: "block", marginBottom: 2 }}>{item.role}</span>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>{item.detail}</span>
                </motion.div>
              ))}
            </div>

            {/* Industry breakdown */}
            <div style={{ marginTop: 32 }}>
              <h4 style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>Expected Industry Mix</h4>
              {WHO_ATTEND_INDUSTRIES.map((ind, i) => (
                <div key={ind.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{ind.name}</span>
                    <span style={{ fontFamily: "var(--font-dm)", fontSize: 12, fontWeight: 700, color: C_BRIGHT }}>{ind.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${ind.pct}%` } : {}}
                      transition={{ duration: 1, delay: 0.5 + i * 0.08, ease: EASE }}
                      style={{ height: "100%", background: `linear-gradient(90deg, ${C}, ${C_BRIGHT})`, borderRadius: 2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sponsors */}
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "white", margin: "0 0 24px" }}>Who Should <span style={{ color: SA_GOLD }}>Sponsor</span></h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {WHO_SPONSOR_ROLES.map((role, i) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE }}
                  className="otsf-role-card"
                  style={{
                    padding: "16px 20px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.3s ease",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: `${SA_GOLD}40`, border: `2px solid ${SA_GOLD}`, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.75)" }}>{role}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SPONSORS SECTION, Dual Marquee ─────────────────────────────────────────
function SponsorsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="sponsors" style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 80px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", textAlign: "center", marginBottom: 48 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C}30)` }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px" }}>Past Sponsors & Partners</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C}30)` }} />
          </div>
        </motion.div>
      </div>

      {/* Row 1, scroll left */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(to right, #080A0C, transparent)", zIndex: 2 }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(to left, #080A0C, transparent)", zIndex: 2 }} />
        <div className="otsf-marquee" style={{ display: "flex", gap: 40, animation: "otsf-scroll-left 70s linear infinite" }}>
          {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((logo, i) => (
            <div key={i} style={{ flexShrink: 0, height: 50, width: 120, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
              <img src={logo} alt="" style={{ maxHeight: 40, maxWidth: 100, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2, scroll right */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(to right, #080A0C, transparent)", zIndex: 2 }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(to left, #080A0C, transparent)", zIndex: 2 }} />
        <div className="otsf-marquee" style={{ display: "flex", gap: 40, animation: "otsf-scroll-right 80s linear infinite" }}>
          {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((logo, i) => (
            <div key={i} style={{ flexShrink: 0, height: 50, width: 120, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
              <img src={logo} alt="" style={{ maxHeight: 40, maxWidth: 100, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────
function GallerySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 80px) 0", position: "relative" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Atmosphere</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: 0 }}>
            From Previous <span style={{ color: C_BRIGHT }}>Editions</span>
          </h2>
        </motion.div>

        <div
          className="otsf-gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "220px 200px",
            gap: 16,
            gridTemplateAreas: `"hero hero a" "b c d"`,
          }}
        >
          {GALLERY.slice(0, 5).map((img, i) => (
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
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,10,12,0.6), transparent 50%)", pointerEvents: "none" }} />
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
  const [formState, setFormState] = useState({ name: "", email: "", company: "", title: "", phone: "", countryIdx: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!formState.name.trim()) errs.name = "Required";
    if (!formState.email.trim()) errs.email = "Required";
    else if (!isWorkEmail(formState.email)) errs.email = "Please use your work email";
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
      });
      setSubmitted(true);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={ref} style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 100px) 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${SA_GOLD}06, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="otsf-awards-grid">
          {/* Left, nomination form */}
          <div>
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: SA_GOLD, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Awards</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.05, letterSpacing: "-1.5px", color: "white", margin: "0 0 16px" }}>
              OT Security First<br /><span style={{ color: SA_GOLD }}>Awards Africa</span>
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 32px" }}>
              Nominate outstanding organisations and leaders driving OT security excellence across the continent.
            </p>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: 40, background: `${SA_GOLD}10`, border: `1px solid ${SA_GOLD}25`, borderRadius: 20, textAlign: "center" }}>
                <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>&#10003;</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "white", marginBottom: 8 }}>Nomination Submitted</h3>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Thank you! We&apos;ll be in touch.</p>
              </motion.div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${errors[field.key] ? "#ef4444" : "rgba(255,255,255,0.08)"}`,
                        color: "white",
                        fontFamily: "var(--font-outfit)",
                        fontSize: 14,
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                    />
                    {errors[field.key] && <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "#ef4444", marginTop: 4, display: "block" }}>{errors[field.key]}</span>}
                  </div>
                ))}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    padding: "16px 32px",
                    borderRadius: 50,
                    background: `linear-gradient(135deg, ${SA_GOLD}, #B8842A)`,
                    color: "#0A0A0A",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 15,
                    fontWeight: 700,
                    border: "none",
                    cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    transition: "all 0.3s ease",
                    marginTop: 8,
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Nomination"}
                </button>
                {errors.form && <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "#ef4444" }}>{errors.form}</span>}
              </div>
            )}
          </div>

          {/* Right, award categories */}
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "white", margin: "0 0 24px" }}>Award Categories</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {AWARDS_DATA.map((award, i) => (
                <motion.div
                  key={award.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE }}
                  className="otsf-award-card"
                  style={{
                    padding: "20px 24px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: SA_GOLD, minWidth: 20 }}>0{i + 1}</span>
                    <div>
                      <h4 style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "white", margin: "0 0 4px" }}>{award.title}</h4>
                      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5 }}>{award.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT SECTION ─────────────────────────────────────────────────────────
function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="contact" style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 80px) 0", position: "relative" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-1.5px", color: "white", margin: "0 0 12px" }}>
            Get In <span style={{ color: C_BRIGHT }}>Touch</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.5)", margin: 0 }}>For speaking and sponsorship enquiries</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="otsf-contact-grid">
          {/* Speaking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="otsf-contact-card"
            style={{ padding: "32px 28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, transition: "all 0.3s ease" }}
          >
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "3px", display: "block", marginBottom: 16 }}>Speaking Enquiries</span>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "white", margin: "0 0 8px" }}>{CONTACTS.speaking.name}</h3>
            <a href={`tel:${CONTACTS.speaking.phone.replace(/\s/g, "")}`} style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.6)", textDecoration: "none", display: "block", marginBottom: 4 }}>{CONTACTS.speaking.phone}</a>
            <a href={`mailto:${CONTACTS.speaking.email}`} style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: C_BRIGHT, textDecoration: "none" }}>{CONTACTS.speaking.email}</a>
          </motion.div>

          {/* Sponsorship */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="otsf-contact-card"
            style={{ padding: "32px 28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, transition: "all 0.3s ease" }}
          >
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "3px", display: "block", marginBottom: 16 }}>Sponsorship Enquiries</span>
            {CONTACTS.sponsorship.map((c) => (
              <div key={c.name} style={{ marginBottom: 16 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", margin: "0 0 6px" }}>{c.name}</h3>
                <a href={`tel:${c.phone.replace(/\s/g, "")}`} style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.6)", textDecoration: "none", display: "block", marginBottom: 2 }}>{c.phone}</a>
                <a href={`mailto:${c.email}`} style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: C_BRIGHT, textDecoration: "none" }}>{c.email}</a>
              </div>
            ))}
          </motion.div>
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
    <section ref={ref} id="venue" style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 80px) 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 50% at 50% 80%, ${C}06, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", textAlign: "center", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Location</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: "0 0 16px" }}>
            Johannesburg,<br /><span style={{ color: C_BRIGHT }}>South Africa</span>
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
              background: `linear-gradient(135deg, ${C_BRIGHT}, ${C})`,
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

// ─── REGISTRATION / CTA SECTION ──────────────────────────────────────────────
function RegistrationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="register" ref={ref} style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 90px) 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${C}08, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 40% 40% at 30% 80%, ${C}06, transparent 60%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", textAlign: "center", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-2px", color: "white", lineHeight: 1.1, margin: "0 0 16px" }}>
            Join Us in<br /><span style={{ color: C_BRIGHT }}>Johannesburg</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
            Be part of Africa&apos;s defining industrial cybersecurity conversation. Secure your place at OT Security First South Africa.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              className="otsf-cta-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "18px 40px",
                borderRadius: 50,
                background: `linear-gradient(135deg, ${C}, ${C_DIM})`,
                color: "white",
                fontFamily: "var(--font-outfit)",
                fontSize: 16,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: `0 8px 32px ${C}35`,
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              Register Now <span>→</span>
            </Link>
            <Link
              href="/contact"
              className="otsf-cta-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "18px 40px",
                borderRadius: 50,
                background: "transparent",
                color: "white",
                fontFamily: "var(--font-outfit)",
                fontSize: 16,
                fontWeight: 500,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────
export default function OTSecurityFirstJohannesburg2026() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <EventNavigation />
      <main style={{ background: "#080A0C", color: "white" }}>
        <HeroSection />
        <StatsBar />
        <IndustrialLandscape />
        <IndustrialProfile />
        <FocusAreas />
        <AdvisoryBoardSection />
        <EventFormatSection />
        <WhoShouldAttend />
        <SponsorsSection />
        <GallerySection />
        <AwardsSection />
        <ContactSection />
        <VenueSection />
        <OTYouTubeShorts />
        <RegistrationSection />
        <Footer />
      </main>

      <style jsx global>{`
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
          0% { text-shadow: 2px 0 ${C_BRIGHT}, -2px 0 ${SA_STEEL}; opacity: 0.8; }
          25% { text-shadow: -1px 0 ${C_BRIGHT}, 1px 0 ${SA_STEEL}; opacity: 1; }
          50% { text-shadow: 1px 0 ${C_BRIGHT}, -1px 0 ${SA_STEEL}; opacity: 0.9; }
          100% { text-shadow: none; opacity: 1; }
        }


        /* ─── CTA hover ─────────────────────────────────────────────── */
        .otsf-cta-primary:hover {
          background: linear-gradient(135deg, ${C_BRIGHT}, ${C}) !important;
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
          transform: translateY(-12px) scale(1.02) !important;
          border-color: ${C}25 !important;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 60px ${C}15;
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
          border-color: ${SA_GOLD}20 !important;
          background: rgba(255,255,255,0.04) !important;
        }

        .otsf-contact-card:hover {
          border-color: ${C}20 !important;
          transform: translateY(-4px);
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
          .otsf-awards-grid,
          .otsf-contact-grid {
            grid-template-columns: 1fr !important;
          }
          .otsf-industrial-grid {
            grid-template-columns: 1fr !important;
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
          /* Advisory board: vertical layout on tablet/mobile */
          .otsf-speakers-left {
            display: none !important;
          }
          .otsf-speakers-track {
            flex-wrap: wrap !important;
            justify-content: center !important;
            padding: 60px 20px !important;
            gap: 20px !important;
          }
        }

        @media (max-width: 768px) {
          .otsf-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
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
          .otsf-timeline-item {
            padding-left: 48px !important;
            padding-right: 0 !important;
          }
          .otsf-timeline-line {
            left: 16px !important;
          }
          .otsf-timeline-item > div:first-child {
            left: 16px !important;
          }
          .otsf-mining-callout {
            flex-direction: column !important;
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
