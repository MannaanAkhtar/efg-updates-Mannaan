"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import { Footer } from "@/components/sections";
import EventNavigation from "@/components/ui/EventNavigation";
import OTYouTubeShorts from "@/components/ot-security-first/OTYouTubeShorts";
import {
  submitForm,
  isWorkEmail,
  COUNTRY_CODES,
} from "@/lib/form-helpers";
import type { FormType } from "@/lib/form-helpers";

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

// Event date: 26 August 2026
const EVENT_DATE = new Date("2026-08-26T08:30:00+02:00");

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
    name: "Akash Makhan",
    title: "OT/IT Convergence (Digital Transformation)",
    org: "Eskom Holdings SOC Ltd",
    linkedin: "https://www.linkedin.com/in/akashmakhan/",
  },
  {
    name: "Zanele Fikizolo",
    title: "Senior Advisor – IT Governance, Risk and Compliance",
    org: "Eskom Holdings SOC Ltd",
    linkedin: "https://www.linkedin.com/in/zanele-fikizolo-7b10413a/",
  },
  {
    name: "Muvhango Livhusha",
    title: "Vice President",
    org: "ISACA South Africa Chapter",
    linkedin: "https://www.linkedin.com/in/muvhango-sipho-steven-livhusha-phd-candidate-mba-cisa-8566a61aa/",
  },
  {
    name: "Tendani Silima",
    title: "Senior Advisor Cybersecurity",
    org: "Eskom Holdings SOC Ltd",
    linkedin: "https://www.linkedin.com/in/tendani-silima-b915aa73/",
  },
  {
    name: "Xolani Nzimande",
    title: "OT Cybersecurity Specialist",
    org: "Sasol",
  },
];

// Strategic Focus Areas from brochure
const STRATEGIC_THEMES = [
  { short: "Zero Trust for ICS", title: "Zero Trust Architecture for ICS", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  { short: "IT/OT Convergence", title: "IT/OT Convergence & SOC Integration", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { short: "AI & Behavioral Analytics", title: "AI & Behavioral Analytics", icon: "M12 2a4 4 0 014 4v1a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2V6a4 4 0 014-4zM9 18h6M10 22h4" },
  { short: "Legacy Retrofitting", title: "Legacy Retrofitting & Hardening", icon: "M12 9v2m0 4h.01M5.07 19H19a2 2 0 001.75-2.94l-6.97-12.06a2 2 0 00-3.5 0L3.32 16.06A2 2 0 005.07 19z" },
  { short: "Supply Chain & Third-Party", title: "Supply Chain & Third-Party Risk", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { short: "Skills & Capacity", title: "Developing Skills & Capacity", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
  { short: "Regulation & Collaboration", title: "Regulation, Standards & Public-Private Collaboration", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4" },
  { short: "Incident Response", title: "Incident Response & Crisis Management", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { short: "Network Visibility", title: "Network Visibility & Monitoring", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  { short: "Emerging Technologies", title: "Emerging Technologies in OT Security", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" },
];

// Facts & Figures from brochure
const FACTS_FIGURES = [
  { stat: "94%", label: "of industrial organizations experienced at least one intrusion in the past 12 months" },
  { stat: "$4.5M", label: "average cost of an OT cyber incident (up 28% from 2024)" },
  { stat: "47 days", label: "average downtime following a major OT security breach" },
  { stat: "82%", label: "of attacks on critical infrastructure originated from ransomware groups" },
  { stat: "61%", label: "of African energy and utilities sectors lack basic OT network segmentation" },
  { stat: "23%", label: "of organizations have real-time OT threat detection capabilities" },
  { stat: "19.5%", label: "projected CAGR OT security market from 2025–2030" },
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
  { stat: "200+", label: "Delegates" },
  { stat: "20+", label: "Industry Speakers" },
  { stat: "10+", label: "Conference Sessions" },
  { stat: "10+", label: "Technology Providers" },
  { stat: "10+", label: "Media Partners" },
  { stat: "5", label: "Awards" },
];

// Awards — 5 categories from brochure
const AWARDS_DATA = [
  { title: "OT Security Program of the Year", desc: "For an organization that has implemented a mature, multi-site OT security program delivering measurable risk reduction." },
  { title: "CISO / OT Security Leader of the Year", desc: "For an individual who has shown outstanding leadership in driving OT security across their organization or sector." },
  { title: "OT Security Innovation Award", desc: "For a technology or solution provider, offering a standout solution addressing a critical OT security challenge." },
  { title: "Excellence in OT Incident Response & Resilience", desc: "For a team or organization that handled a significant OT related incident effectively and improved resilience as a result." },
  { title: "Public Sector / Critical Infrastructure Protection Award", desc: "For a government entity, regulator, or state-owned enterprise showing leadership in securing national critical infrastructure." },
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

// Contact details — updated from brochure
const CONTACTS = {
  speaking: { name: "Sanjana Venugopal", phone: "+971 50 500 3341", email: "sanjana@eventsfirstgroup.com" },
  sponsorship: [
    { name: "Kausar Noor", phone: "+91 807 340 0732", email: "kausar@eventsfirstgroup.com" },
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
    <section id="overview" className="otsf-hero" style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: BG_DARK }}>
      {/* Background Image — kept as-is */}
      <div className="absolute inset-0">
        <img
          src={`${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0412.JPG`}
          alt="OT Security First Summit"
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

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(38px, 7vw, 88px)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            margin: "0 0 12px",
            filter: `drop-shadow(0 4px 30px ${C}20)`,
          }}
        >
          Uncompromised<br />
          <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            OT Security
          </span>
        </motion.h1>

        {/* Gradient accent line under title */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 100, height: 3, background: `linear-gradient(90deg, ${C_BRIGHT}, ${CYAN})`, marginBottom: 20, borderRadius: 2, transformOrigin: "left", boxShadow: `0 0 14px ${C}40` }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ fontFamily: "var(--font-outfit)", fontWeight: 400, fontSize: "clamp(16px, 1.5vw, 20px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: 520, marginBottom: 36, letterSpacing: "0.2px" }}
        >
          Protecting what Powers our World
        </motion.p>

        {/* Info badges — liquid glass pills with inner shine */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-start", marginBottom: 36 }}
        >
          {[
            { label: "26 August 2026", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
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
          <a href="#contact" className="otsf-cta-ghost" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 36px", borderRadius: 50,
            background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)",
            fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.12)", transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            cursor: "pointer", position: "relative", overflow: "hidden",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.2)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          }}>
            Sponsor This Forum
          </a>
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
        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "2px" }}>An Initiative By</span>
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
                  <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1.5px" }}>{item.l}</span>
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
function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#080A0C", padding: "clamp(40px, 5vw, 60px) 0", position: "relative", borderTop: `1px solid ${C}10`, borderBottom: `1px solid ${C}10` }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${CYAN}08, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "clamp(16px, 2vw, 24px)" }} className="otsf-stats-grid">
          {FACTS_FIGURES.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="otsf-stat-card"
              style={{
                padding: "clamp(20px, 2vw, 32px) clamp(16px, 1.5vw, 24px)",
                background: i === 0 ? `linear-gradient(135deg, ${CYAN}15, ${CYAN}05)` : "rgba(255,255,255,0.03)",
                border: `1px solid ${i === 0 ? `${CYAN}30` : "rgba(255,255,255,0.06)"}`,
                borderRadius: 20,
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px, 2.5vw, 36px)", color: i === 0 ? CYAN : "white", letterSpacing: "-1px", display: "block", marginBottom: 6 }}>
                {s.stat}
              </span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── OVERVIEW SECTION ───────────────────────────────────────────────────────
function OverviewSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const paragraphs = [
    "From South Africa\u2019s mining complexes and energy grids to port infrastructure, water utilities, petrochemical processing, and advanced manufacturing environments. These are no longer isolated operational domains, they are digitally integrated ecosystems combining OT, enterprise IT, cloud platforms, AI, remote vendor connectivity, and smart automation.",
    "This convergence is accelerating productivity but expanding the cyber-physical attack surface. Critical infrastructure is a primary target for sophisticated ransomware and state sponsored APTs. High impact outages, ransomware, and supply chain attacks are elevating OT security from an engineering concern to a board level and national priority.",
    "The Critical Infrastructure Protection Act (CIPA) and the Cybercrimes Act (2020) have turned cybersecurity from a nice-to-have into a legal mandate.",
    "With 67% of organizations planning to increase OT security budgets in 2026\u201327, and major investments in energy transition, mining automation, manufacturing modernization underway, the security decisions taken in the next few months will lock in risk or resilience for decades.",
    "OT Security First Africa 2026 is an exclusive platform that will enable candid dialogues, cross-sector collaborations, concrete action plans, between top technology experts, OT leaders, government and policy makers, to secure Africa\u2019s industrial backbone. Join us on 26 August 2026 in Johannesburg, with the need to implement defense, before the next major outage occurs!",
  ];

  return (
    <section ref={ref} style={{ background: "#080A0C", position: "relative", overflow: "hidden", padding: "clamp(60px, 7vw, 100px) 0" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 40% 50% at 20% 30%, ${C}08, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>About the Event</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: "0 0 40px" }}>
            Securing Africa&apos;s<br /><span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Industrial Backbone</span>
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: EASE }}
              style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0 }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
          style={{ marginTop: 40, padding: "28px 32px", borderRadius: 20, background: `linear-gradient(135deg, ${C}12, ${CYAN}06)`, border: `1px solid ${C}25` }}
        >
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 17, fontWeight: 700, color: "white", lineHeight: 1.7, margin: 0, textAlign: "center" }}>
            Be a part of the Cyber First Movement and lead the charge toward a strategic, resilient and innovative economy!
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── MARKET DRIVERS ─────────────────────────────────────────────────────────
function MarketDriversSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 100px) 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 40% at 70% 50%, ${CYAN}06, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Why Now</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: 0 }}>
            Market <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Drivers</span>
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {MARKET_DRIVERS.map((driver, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: EASE }}
              className="otsf-role-card"
              style={{
                padding: "20px 24px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                transition: "all 0.3s ease",
              }}
            >
              <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, minWidth: 24, paddingTop: 2 }}>0{i + 1}</span>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>{driver}</p>
            </motion.div>
          ))}
        </div>
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
            The Agenda<br /><span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>10 Critical Tracks</span>
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
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(13px, 1.1vw, 16px)", color: "white", lineHeight: 1.3, margin: 0 }}>
                    {theme.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SPEAKERS SECTION ───────────────────────────────────────────────────────
function SpeakersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="speakers" style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 100px) 0", position: "relative" }}>
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }} className="otsf-speakers-grid">
          {SPEAKERS.map((speaker, i) => (
            <motion.div
              key={speaker.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: EASE }}
            >
              <Tilt max={6}>
                <div
                  className="otsf-speaker-card"
                  style={{
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

                  {/* Initials placeholder */}
                  <div style={{
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${C}18, ${C}05, rgba(255,255,255,0.02))`,
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 56,
                      fontWeight: 800,
                      color: `${C_BRIGHT}30`,
                      letterSpacing: "-2px",
                    }}>
                      {speaker.name.split(" ").map(n => n[0]).join("")}
                    </span>
                    <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${C}20, transparent)`, pointerEvents: "none" }} />
                  </div>

                  {/* Info */}
                  <div style={{ padding: "20px 24px 24px" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", margin: "0 0 6px" }}>{speaker.name}</h3>
                    <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: C_BRIGHT, margin: "0 0 4px" }}>{speaker.title}</p>
                    <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.45)", margin: "0 0 10px" }}>{speaker.org}</p>
                    {speaker.linkedin && (
                      <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: CYAN, textDecoration: "none" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={CYAN}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}

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
      </div>
    </section>
  );
}

// ─── EVENT SNAPSHOT ──────────────────────────────────────────────────────────
function EventSnapshotSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 100px) 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 50% at 50% 30%, ${CYAN}06, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>At a Glance</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: 0 }}>
            Event <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Snapshot</span>
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="otsf-snapshot-grid">
          {EVENT_SNAPSHOT.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: EASE }}
              style={{
                padding: "clamp(28px, 3vw, 40px) 24px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20,
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
              className="otsf-stat-card"
            >
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", color: CYAN, letterSpacing: "-1px", display: "block", marginBottom: 8 }}>
                {item.stat}
              </span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{item.label}</span>
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

  const groups: { key: keyof typeof WHO_ATTEND; label: string; color: string }[] = [
    { key: "executive", label: "Executive Leadership", color: C_BRIGHT },
    { key: "otSecurity", label: "OT Security & Cybersecurity", color: CYAN },
    { key: "opsEngineering", label: "Operations & Engineering", color: C_BRIGHT },
    { key: "riskCompliance", label: "Risk & Compliance", color: CYAN },
    { key: "government", label: "Government & Public Sector", color: C_BRIGHT },
  ];

  return (
    <section ref={ref} style={{ background: "#080A0C", padding: "clamp(60px, 7vw, 100px) 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 40% at 30% 60%, ${CYAN}06, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Designed For</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-2px", color: "white", margin: 0 }}>
            Who This Forum<br /><span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Is Built For</span>
          </h2>
        </motion.div>

        {/* Attendee groups */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="otsf-who-grid">
          {groups.map((group, gi) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + gi * 0.1, ease: EASE }}
              style={{
                padding: "28px 28px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20,
              }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: group.color, margin: "0 0 16px" }}>{group.label}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {WHO_ATTEND[group.key].map((role) => (
                  <div key={role} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: `${group.color}50`, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.7)" }}>{role}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Target Industries */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
          style={{ marginTop: 40 }}
        >
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "white", margin: "0 0 20px" }}>Target <span style={{ color: CYAN }}>Industries</span></h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {TARGET_INDUSTRIES.map((ind) => (
              <span key={ind} style={{ padding: "10px 20px", borderRadius: 50, background: `${CYAN}10`, border: `1px solid ${CYAN}25`, fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: CYAN }}>
                {ind}
              </span>
            ))}
          </div>
        </motion.div>
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
            From Previous <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Editions</span>
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
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${CYAN}06, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="otsf-awards-grid">
          {/* Left, nomination form */}
          <div>
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "4px", display: "block", marginBottom: 16 }}>Awards</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.05, letterSpacing: "-1.5px", color: "white", margin: "0 0 16px" }}>
              OT Security First<br /><span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Awards Africa</span>
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 32px" }}>
              Nominate outstanding organisations and leaders driving OT security excellence across the continent.
            </p>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: 40, background: `${CYAN}10`, border: `1px solid ${CYAN}25`, borderRadius: 20, textAlign: "center" }}>
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
                    background: `linear-gradient(135deg, ${CYAN}, ${CYAN_DIM})`,
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
                    <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 700, color: CYAN, minWidth: 20 }}>0{i + 1}</span>
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
            Get In <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Touch</span>
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
            Join Us in<br /><span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Johannesburg</span>
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
                background: `linear-gradient(135deg, ${C}, ${CYAN})`,
                color: "white",
                fontFamily: "var(--font-outfit)",
                fontSize: 16,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: `0 0 40px ${CYAN}33, 0 4px 20px ${C}33`,
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
        <OverviewSection />
        <MarketDriversSection />
        <FocusAreas />
        <SpeakersSection />
        <EventSnapshotSection />
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
          border-color: ${CYAN}20 !important;
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
