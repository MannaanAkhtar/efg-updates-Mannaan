"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
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

// Gallery — 8 unique shots spanning 5 different EFG events
const GALLERY: { src: string; alt: string; area: string; rotate?: number; lift?: boolean }[] = [
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0420.JPG`, alt: "OT Security First UAE — panel", area: "hero" },
  { src: `${S3}/events/Cyber+First+Kuwait+2025/filemail_photos/cyber21-04-430.jpg`, alt: "Cyber First Kuwait — executive ceremony", area: "a", rotate: -1.5, lift: true },
  { src: `${S3}/events/Opex+First+UAE/4N8A1848.JPG`, alt: "OPEX First UAE — delegate audience", area: "b" },
  { src: `${S3}/events/Cyber+First+Kuwait+2025/filemail_photos/cyber21-04-550.jpg`, alt: "Cyber First Kuwait — keynote", area: "c", rotate: 1 },
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0397.JPG`, alt: "OT Security First UAE — exhibition", area: "d" },
  { src: `${S3}/cyber-first-kenya/cyber21-04-504.jpg`, alt: "Cyber First Kenya — speakers", area: "e", rotate: -1, lift: true },
  { src: `${S3}/events/Opex+First+UAE/4N8A1702.JPG`, alt: "OPEX First UAE — executive panel", area: "f" },
  { src: `${S3}/Good/4N8A0200.JPG`, alt: "EFG awards recognition", area: "g", rotate: 0.8 },
];

// Contact details — updated from brochure
const CONTACTS = {
  speaking: { name: "Sanjana Venugopal", phone: "+971 50 500 3341", email: "sanjana@eventsfirstgroup.com" },
  sponsorship: [
    { name: "Kausar Noor", phone: "+91 807 340 0732", email: "kausar@eventsfirstgroup.com" },
    { name: "Mayur Methi", phone: "+971 56 170 9909", email: "mayur@eventsfirstgroup.com" },
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
// Stat card — skeuomorphic + liquid glass hybrid
function StatCard({ stat, label, featured = false, large = false }: { stat: string; label: string; featured?: boolean; large?: boolean }) {
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

        {/* Stat number */}
        <span style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: large ? "clamp(48px, 5.5vw, 76px)" : "clamp(30px, 3vw, 42px)",
          color: featured ? CYAN : "white",
          letterSpacing: "-2.5px",
          display: "block",
          // Skeuomorphic text — subtle bottom depth + top highlight + glow
          textShadow: featured
            ? `0 0 30px ${CYAN}60, 0 2px 0 rgba(0,0,0,0.4), 0 -1px 0 rgba(255,255,255,0.1)`
            : `0 2px 0 rgba(0,0,0,0.4), 0 -1px 0 rgba(255,255,255,0.06), 0 0 20px ${C}25`,
          lineHeight: 0.95,
          position: "relative",
          zIndex: 2,
        }}>
          {stat}
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
        padding: "clamp(50px, 6vw, 90px) 0",
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
          marginBottom: "clamp(48px, 6vw, 72px)",
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
              onClick={() => !videoPlaying && setVideoPlaying(true)}
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
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(40px, 5vw, 72px)" }}>

          {/* Hero stat — 94% featured full-width card */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          >
            <StatCard stat={heroStat.stat} label={heroStat.label} featured large />
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
            {statsPair1.map((s) => <StatCard key={s.label} stat={s.stat} label={s.label} />)}
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
            {statsPair2.map((s) => <StatCard key={s.label} stat={s.stat} label={s.label} />)}
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
            {statsPair3.map((s) => <StatCard key={s.label} stat={s.stat} label={s.label} />)}
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
            marginTop: "clamp(56px, 7vw, 88px)",
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
                  Be a part of the <span className="otsf-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>Cyber First Movement</span> and lead the charge toward a strategic, resilient and innovative economy.
                </p>
              </div>

              {/* RIGHT — CTA button */}
              <Link
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
              </Link>
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

function MarketDriversSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "transparent", padding: "clamp(50px, 6vw, 90px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Header — centered like Apple product section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "clamp(48px, 6vw, 72px)" }}
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
    <section ref={sectionRef} id="agenda" style={{ background: "transparent", padding: "clamp(50px, 6vw, 90px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Header — left-aligned editorial style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ marginBottom: "clamp(40px, 5vw, 60px)", maxWidth: 780 }}
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
            marginBottom: "clamp(40px, 5vw, 64px)",
            boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 60px ${C}18`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${S3}/events/Cyber+First+Kuwait+2025/Kuwait+Photos/Kuwait+Photos/4X9A1744.jpg`}
            alt="EFG community"
            loading="lazy"
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

  return (
    <section ref={ref} id="speakers" style={{ background: "transparent", padding: "clamp(40px, 5vw, 70px) 0", position: "relative" }}>
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
    <section ref={ref} style={{ background: "transparent", padding: "clamp(40px, 5vw, 70px) 0", position: "relative" }}>
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
    <section ref={ref} style={{ background: "transparent", padding: "clamp(40px, 5vw, 70px) 0", position: "relative" }}>
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
    <section ref={ref} id="sponsors" style={{ background: "transparent", padding: "clamp(40px, 5vw, 60px) 0", position: "relative", overflow: "hidden" }}>
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
              <img src={logo} alt="" style={{ maxHeight: 72, maxWidth: 170, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }} loading="lazy" />
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
              <img src={logo} alt="" style={{ maxHeight: 72, maxWidth: 170, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }} loading="lazy" />
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
      onClick={() => !playing && setPlaying(true)}
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
    <section ref={ref} style={{ background: "transparent", padding: "clamp(50px, 6vw, 90px) 0", position: "relative", overflow: "hidden" }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: "20%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}14 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C}12 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "clamp(40px, 5vw, 56px)" }}
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
    <section ref={ref} style={{ background: "transparent", padding: "clamp(40px, 5vw, 60px) 0", position: "relative" }}>
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
    <section ref={ref} style={{ background: "transparent", padding: "clamp(40px, 5vw, 70px) 0", position: "relative" }}>
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
    <section ref={ref} id="contact" style={{ background: "transparent", padding: "clamp(40px, 5vw, 60px) 0", position: "relative" }}>
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
    <section ref={ref} id="venue" style={{ background: "transparent", padding: "clamp(40px, 5vw, 60px) 0", position: "relative" }}>
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
    <section id="register" ref={ref} style={{ background: "transparent", padding: "clamp(40px, 5vw, 70px) 0", position: "relative" }}>
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
      <main style={{
        background: `linear-gradient(160deg, ${BG_DARK} 0%, ${BG} 30%, #0c1030 60%, ${BG_CARD} 100%)`,
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Global liquid blobs + noise — behind all sections */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "5%", right: "0%", width: 600, height: 600, borderRadius: "40% 60% 55% 45% / 55% 40% 60% 45%", background: `linear-gradient(135deg, ${C}22, ${CYAN}12, ${C}18)`, filter: "blur(70px)", opacity: 0.5 }} />
          <div style={{ position: "absolute", top: "30%", left: "-5%", width: 500, height: 500, borderRadius: "55% 45% 40% 60% / 45% 55% 45% 55%", background: `linear-gradient(225deg, ${CYAN}18, ${C}10, ${CYAN}1c)`, filter: "blur(80px)", opacity: 0.45 }} />
          <div style={{ position: "absolute", top: "65%", right: "5%", width: 550, height: 550, borderRadius: "45% 55% 60% 40% / 60% 45% 55% 45%", background: `linear-gradient(145deg, ${C}20, ${CYAN}10, ${C}16)`, filter: "blur(70px)", opacity: 0.4 }} />
          <div style={{ position: "absolute", bottom: "5%", left: "10%", width: 450, height: 450, borderRadius: "55% 45% 40% 60% / 45% 55% 45% 55%", background: `radial-gradient(circle, ${CYAN}15, transparent 70%)`, filter: "blur(80px)", opacity: 0.4 }} />
          {/* Noise */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.025, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "128px 128px" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <HeroSection />
          <AboutSection />
          <MarketDriversSection />
          <FocusAreas />
          <SpeakersSection />
          <OTTestimonials />
          <EventSnapshotSection />
          <WhoShouldAttend />
          <SponsorsSection />
          <GallerySection />
          <AwardsSection />
          <ContactSection />
          <VenueSection />
          <RegistrationSection />
          <Footer />
        </div>
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
