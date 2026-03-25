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
import { Footer } from "@/components/sections";
import { NeuralConstellation, DotMatrixGrid } from "@/components/effects";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { FormType, CountryCode } from "@/lib/form-helpers";

// ─── Constants ───────────────────────────────────────────────────────────────
const C = "#09B7AA";
const C_BRIGHT = "#3DD4C8";
const EASE = [0.16, 1, 0.3, 1] as const;
const WP = "https://cyberfirstseries.com/wp-content/uploads";
const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const EVENT_DATE = new Date("2026-06-16T08:30:00+05:30");

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

// ─── CountUp (with prefix, suffix, decimals, delay) ─────────────────────────
function CountUp({
  target,
  prefix = "",
  suffix = "",
  active,
  delay = 0,
  style,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  active: boolean;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const [val, setVal] = useState(0);
  const hasDecimals = target % 1 !== 0;

  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(() => {
      const duration = 1600;
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(hasDecimals ? parseFloat((eased * target).toFixed(2)) : Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [active, target, delay, hasDecimals]);

  return (
    <div style={style}>
      {prefix}{hasDecimals ? val.toFixed(2) : val}{suffix}
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const SPEAKERS = [
  {
    name: "Speaker Announcement",
    title: "Coming Soon",
    org: "Government of India",
    photo: `${S3}/speakers/placeholder-gov.jpg`,
  },
  {
    name: "Speaker Announcement",
    title: "Coming Soon",
    org: "Enterprise CISO",
    photo: `${S3}/speakers/placeholder-ciso.jpg`,
  },
  {
    name: "Speaker Announcement",
    title: "Coming Soon",
    org: "Banking & Financial Services",
    photo: `${S3}/speakers/placeholder-banking.jpg`,
  },
  {
    name: "Speaker Announcement",
    title: "Coming Soon",
    org: "Technology Leader",
    photo: `${S3}/speakers/placeholder-tech.jpg`,
  },
];

const GALLERY: {
  src: string;
  alt: string;
  area: string;
  rotate?: number;
  lift?: boolean;
  pos?: string;
}[] = [
  {
    src: `${S3}/Good/4N8A0160.JPG`,
    alt: "Engaged audience at summit",
    area: "hero",
  },
  {
    src: `${WP}/2024/12/Speakers-and-Event-pictures-22.png`,
    alt: "Speaker on main stage",
    area: "a",
    rotate: -1.5,
    lift: true,
  },
  {
    src: `${S3}/Good/4N8A0010.JPG`,
    alt: "Keynote presentation",
    area: "b",
  },
  {
    src: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-29.jpg`,
    alt: "Panel discussion",
    area: "c",
    rotate: 1.2,
    lift: true,
  },
  {
    src: `${S3}/events/Opex+First+UAE/4N8A1848.JPG`,
    alt: "Delegates seated for session",
    area: "d",
  },
  {
    src: `${WP}/2024/12/Speakers-and-Event-pictures-20.png`,
    alt: "Awards ceremony",
    area: "e",
  },
  {
    src: `${S3}/Good/4N8A0122.JPG`,
    alt: "Industry leader address",
    pos: "center 20%",
    area: "f",
  },
  {
    src: `${S3}/Good/4N8A0065.JPG`,
    alt: "Summit audience — executive delegates",
    area: "g",
  },
];

const FOCUS_AREAS: { title: string; desc: string; bg: string; wide?: boolean }[] = [
  {
    title: "Cyber Leadership & National Security",
    desc: "Elevating cybersecurity as a national priority aligned with Digital India, establishing governance frameworks that enable CISOs to drive board-level security strategy.",
    bg: `${S3}/Good/4N8A0122.JPG`,
    wide: true,
  },
  {
    title: "AI & Emerging Threat Landscape",
    desc: "How AI is reshaping cyber threats, defence strategies, and secure enterprise adoption across India's digital ecosystem.",
    bg: `${S3}/cyberbg.jpg`,
  },
  {
    title: "Critical Infrastructure Protection",
    desc: "Defending power grids, telecom, transport, and smart city systems against targeted APTs and nation-state threats.",
    bg: `${S3}/events/OT%20Security%20First%20UAE%202025/OT%20First%20UAE%20Photos/4N8A0394.JPG`,
  },
  {
    title: "Banking & Financial Resilience",
    desc: "Digital banking, UPI ecosystem, fintech security, and RBI compliance for India's rapidly evolving financial sector.",
    bg: `${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-324.jpg`,
    wide: true,
  },
  {
    title: "Data Protection & DPDP Act",
    desc: "Navigating the DPDP Act, data localization mandates, and building trust in India's digital economy.",
    bg: `${S3}/Good/4N8A0030.JPG`,
  },
  {
    title: "Threat Intelligence & SOC",
    desc: "Building world-class SOCs, threat detection, and intelligence sharing across organisations.",
    bg: `${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-390.jpg`,
  },
  {
    title: "Cloud & Digital Transformation",
    desc: "Securing cloud adoption and hybrid infrastructure across government and enterprise India as organisations accelerate digital-first strategies.",
    bg: `${S3}/delhi2-bg.png`,
    wide: true,
  },
  {
    title: "CERT-In Compliance & Frameworks",
    desc: "Implementing CERT-In directives, incident reporting, and national cybersecurity frameworks.",
    bg: `${S3}/events/Opex%20First%20UAE/4N8A1702.JPG`,
  },
];

const S3_LOGOS = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo";

const MARQUEE_ROW_1 = [
  { name: "Palo Alto Networks", logo: `${S3_LOGOS}/paloalto.png` },
  { name: "Google Cloud", logo: `${S3_LOGOS}/Google-Cloud-Security.png` },
  { name: "Kaspersky", logo: `${S3_LOGOS}/kaspersky.png` },
  { name: "Fortinet", logo: `${S3_LOGOS}/fortinet.png` },
  { name: "Tenable", logo: `${S3_LOGOS}/Tenable-logo.png` },
  { name: "SentinelOne", logo: `${S3_LOGOS}/sentinelone.png` },
  { name: "Securonix", logo: `${S3_LOGOS}/Securonix-logo.png` },
];

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

const AGENDA = [
  { time: "08:30 – 09:30", title: "Registration & Networking Breakfast", type: "break" as const },
  { time: "09:30 – 09:40", title: "Welcome Address", type: "ceremony" as const },
  { time: "09:40 – 10:00", title: "Chief Guest Address", subtitle: "India's Vision for a Secure Digital Economy", type: "keynote" as const },
  { time: "10:00 – 10:15", title: "Opening Keynote", subtitle: "Cyber Resilience for India's Digital Economy & Critical Infrastructure", type: "keynote" as const },
  { time: "10:15 – 10:55", title: "Panel 1: Cyber Leadership in the Boardroom", subtitle: "Governance, Risk & National Cyber Readiness", type: "panel" as const },
  { time: "10:55 – 11:10", title: "Sponsor Technology Presentation 1", type: "sponsor" as const },
  { time: "11:10 – 11:25", title: "Sponsor Technology Presentation 2", type: "sponsor" as const },
  { time: "11:25 – 11:45", title: "Coffee Networking Break", type: "break" as const },
  { time: "11:45 – 12:25", title: "Panel 2: AI & the New Cyber Battlefield", subtitle: "Defending Against AI-Driven Threats", type: "panel" as const },
  { time: "12:25 – 12:45", title: "Fireside Chat", subtitle: "Public-Private Collaboration for National Cyber Resilience", type: "fireside" as const },
  { time: "12:45 – 13:00", title: "Sponsor Technology Presentation 3", type: "sponsor" as const },
  { time: "13:00 – 14:00", title: "Lunch & Networking", type: "break" as const },
  { time: "14:00 – 14:40", title: "Panel 3: Data Protection & Digital Trust", subtitle: "Navigating India's Evolving Cyber & Privacy Regulations", type: "panel" as const },
  { time: "14:40 – 14:50", title: "Sponsor Technology Presentation 4", type: "sponsor" as const },
  { time: "14:50 – 15:00", title: "Sponsor Technology Presentation 5", type: "sponsor" as const },
  { time: "15:00 – 15:40", title: "Panel 4: Securing Digital Banking, Payments & Modern Enterprises", subtitle: "Zero Trust, Fraud Prevention & Cloud Security", type: "panel" as const },
  { time: "15:40 – 16:00", title: "Cyber Leadership Awards & Raffle Draw", type: "awards" as const },
  { time: "16:00", title: "Closing Remarks & Networking Coffee", type: "closing" as const },
];

const AWARDS_DATA = [
  "Cybersecurity Leader of the Year",
  "CISO of the Year — Enterprise Security Excellence",
  "AI & Cyber Innovation Leader of the Year",
  "Cyber Resilience Champion — Critical Infrastructure",
  "Cybersecurity Solution Provider of the Year",
  "Best AI-Driven Cybersecurity Innovation",
  "Cloud Security Excellence Award",
  "Emerging Cybersecurity Technology Provider of the Year",
];

const WHO_ATTEND_INDUSTRIES = [
  { name: "Banking & Financial Services", pct: 26 },
  { name: "IT & Technology", pct: 22 },
  { name: "Government & Public Sector", pct: 16 },
  { name: "Telecom & Digital Infrastructure", pct: 14 },
  { name: "Manufacturing & Industrial", pct: 10 },
  { name: "Healthcare & Pharma", pct: 7 },
  { name: "Retail & E-commerce", pct: 5 },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function CyberFirstIndia2026() {
  return (
    <div style={{ background: "#050810" }}>
      <style jsx global>{`
        @media (max-width: 1024px) {
          .cfi-hero-info-card { display: none !important; }
          .cfi-hero-inner { flex-wrap: wrap !important; }
        }
        @media (max-width: 768px) {
          .cfi-hero-section { min-height: 100vh !important; height: auto !important; }
          .cfi-hero-section h1 { font-size: clamp(26px, 7vw, 38px) !important; max-width: 100% !important; letter-spacing: -0.02em !important; }
          .cfi-hero-content { padding: 0 !important; }
          .cfi-hero-inner { height: auto !important; min-height: 100vh !important; padding: 100px 20px 180px !important; }
          .cfi-hero-left { padding-bottom: 0 !important; }
          .cfi-hero-ctas { padding-bottom: 20px !important; }
          .cfi-hero-gradient-side { background: linear-gradient(to bottom, rgba(5,8,16,0.85) 0%, rgba(5,8,16,0.7) 40%, rgba(5,8,16,0.6) 70%, rgba(5,8,16,0.9) 100%) !important; }
          .cfi-partners-strip { align-self: stretch !important; padding: 14px 16px !important; flex-direction: column !important; align-items: center !important; gap: 10px !important; border-radius: 12px !important; margin-top: 20px !important; }
          .cfi-partners-strip img { transform: scale(1) !important; }
          .cfi-partners-strip > div:last-child { justify-content: center !important; gap: 12px !important; }
          .cfi-partners-divider { display: none !important; }
          .cfi-bottom-bar { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 12px !important; padding: 0 16px !important; }
          .cfi-bottom-bar > a { width: 100% !important; text-align: center !important; padding: 12px 24px !important; font-size: 14px !important; }
        }
        @media (max-width: 480px) {
          .cfi-hero-section h1 { font-size: clamp(24px, 7vw, 32px) !important; }
          .cfi-hero-inner { padding: 90px 16px 180px !important; }
        }
        @media (max-width: 480px) {
          .cfi-stats-grid > div { padding: 12px 8px !important; }
        }
        @media (max-width: 600px) {
          .cfi-speakers-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
        @media (max-width: 900px) {
          .cfi-awards-grid { grid-template-columns: 1fr !important; }
          .cfi-split-cta { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          h2 { font-size: clamp(24px, 7vw, 36px) !important; }
        }
      `}</style>
      
      <HeroSection />
      <StatsBar />
      <MarketContext />
      <FocusAreas />
      <SpeakersSection />
      <AgendaTimeline />
      <SponsorsSection />
      <Gallery />
      <WhoShouldAttend />
      <AwardsSection />
      <Venue />
      <RegistrationSection />
      <ContactEnquiries />
      <Footer />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const cd = useCountdown(EVENT_DATE);

  return (
    <section
      className="cfi-hero-section"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 700,
        overflow: "hidden",
        background: "#050810",
      }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://efg-final.s3.eu-north-1.amazonaws.com/delhi2-bg.png"
          alt="New Delhi skyline"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.35) saturate(0.8)", objectPosition: "center 100%" }}
        />
      </div>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none cfi-hero-gradient-side"
        style={{
          background: `linear-gradient(90deg, rgba(5,8,16,0.95) 0%, rgba(5,8,16,0.7) 40%, rgba(5,8,16,0.4) 70%, rgba(5,8,16,0.2) 100%)`,
          zIndex: 1,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(5,8,16,0.6) 0%, transparent 30%, transparent 70%, rgba(5,8,16,0.95) 100%)`,
          zIndex: 1,
        }}
      />

      {/* Atmospheric effects */}
      <NeuralConstellation color={C} dotCount={30} connectionDistance={140} speed={0.2} opacity={0.06} />
      <DotMatrixGrid color={C} opacity={0.012} spacing={36} />

      {/* Subtle accent glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 80% 60%, ${C}12, transparent 70%)`,
          zIndex: 2,
        }}
      />

      {/* Cyber grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${C}04 1px, transparent 1px), linear-gradient(90deg, ${C}04 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.5,
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div className="cfi-hero-content">
        <div
          className="cfi-hero-inner"
          style={{
            position: "relative",
            zIndex: 10,
            height: "100vh",
            display: "flex",
            alignItems: "flex-start",
            maxWidth: 1320,
            margin: "0 auto",
            padding: "150px clamp(24px, 5vw, 80px) 0",
            gap: 48,
          }}
        >
          {/* Left — Text content */}
          <div className="cfi-hero-left" style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          {/* Edition Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            style={{ marginBottom: 20 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 18px",
                borderRadius: 30,
                background: `linear-gradient(135deg, ${C}15, ${C}08)`,
                border: `1px solid ${C}30`,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 8px ${C_BRIGHT}` }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: C_BRIGHT }}>
                India Edition · 16 June 2026
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(34px, 4.8vw, 66px)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: "#F0F2F5",
              margin: "0 0 14px",
              maxWidth: 700,
            }}
          >
            <span
              style={{
                backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, #fff 50%, ${C_BRIGHT} 100%)`,
                backgroundSize: "250% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 6s ease-in-out infinite",
              }}
            >
              Cyber Resilience
            </span>
            <br />
            for India's Digital Future
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
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
            India's premier cybersecurity summit bringing together CISOs, government leaders, and enterprise security executives in New Delhi.
          </motion.p>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
              The Lalit Ashok, New Delhi
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="cfi-hero-ctas"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
          >
            <a
              href="#register?tab=pass"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("register");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                window.dispatchEvent(new CustomEvent("cfi-set-tab", { detail: "pass" }));
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 50,
                background: C,
                color: "#050810",
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
              Reserve Your Seat <span>→</span>
            </a>
            <a
              href="#register?tab=sponsor"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("register");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                window.dispatchEvent(new CustomEvent("cfi-set-tab", { detail: "sponsor" }));
              }}
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
                cursor: "pointer",
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

        </div>
      </div>

      {/* Supporting Partners strip — full width, above countdown */}
      <motion.div
        className="cfi-partners-strip"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1, ease: EASE }}
        style={{
          position: "absolute",
          bottom: 110,
          right: 0,
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          background: "transparent",
          padding: "18px clamp(24px, 5vw, 80px)",
        }}
      >

        {/* Label */}
        <span style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: C_BRIGHT,
          whiteSpace: "nowrap",
          textDecoration: "underline",
          textUnderlineOffset: "6px",
        }}>
          Supporting Partners
        </span>

        {/* Partner logos */}
        <div style={{ display: "flex", alignItems: "center", gap: 48, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { name: "CCA", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/support+partner+/CCA.png" },
            { name: "Coder Flow AI", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/support+partner+/coder_flowAI.png" },
            { name: "Crime Free Bharat", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/support+partner+/Crime_free_bharat.JPG" },
            { name: "Cyber World", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/support+partner+/Cyber_world.png" },
            { name: "Cyber Security Council", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/support+partner+/cybersecuritycouncil.png" },
          ].map((p, idx) => (
            <div key={p.name} style={{ height: 85, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.logo} alt={p.name} loading="lazy" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", transform: idx === 4 ? "scale(1.8)" : "scale(1.5)" }} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom bar with countdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.3, ease: EASE }}
        className="absolute bottom-0 left-0 right-0"
        style={{
          zIndex: 20,
          background: "rgba(5,8,16,0.90)",
          backdropFilter: "blur(16px)",
          borderTop: `1px solid ${C}25`,
          padding: "20px 0",
        }}
      >
        <div
          className="cfi-bottom-bar flex items-center justify-between flex-wrap gap-4"
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 80px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ background: C, opacity: 0.75 }} />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: C }} />
            </span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>
              India Edition
            </span>
            <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 6px" }}>|</span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>
              Cyber First India
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[
              { v: cd.d, l: "Days" },
              { v: cd.h, l: "Hrs" },
              { v: cd.m, l: "Min" },
              { v: cd.s, l: "Sec" },
            ].map((u, i) => (
              <div key={u.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className="text-center">
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: C_BRIGHT, letterSpacing: "-1px", lineHeight: 1 }}>
                    {String(u.v).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", color: "#606060", display: "block", marginTop: 4 }}>
                    {u.l}
                  </span>
                </div>
                {i < 3 && <span style={{ color: `${C}40`, fontSize: 24, fontWeight: 300, marginLeft: 6 }}>:</span>}
              </div>
            ))}
          </div>

          <a
            href="#register?tab=pass"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("register");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              window.dispatchEvent(new CustomEvent("cfi-set-tab", { detail: "pass" }));
            }}
            style={{
              padding: "14px 32px",
              borderRadius: 50,
              background: C,
              fontFamily: "var(--font-outfit)",
              fontSize: 15,
              fontWeight: 600,
              color: "white",
              textDecoration: "none",
              boxShadow: `0 4px 20px ${C}40`,
              cursor: "pointer",
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
              e.currentTarget.style.boxShadow = `0 4px 20px ${C}40`;
            }}
          >
            Register Now →
          </a>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 768px) {
          .cfi-bottom-bar { flex-direction: column !important; text-align: center; }
          .cfi-bottom-bar > div:first-child { justify-content: center; }
          .cfi-bottom-bar > div:nth-child(2) { justify-content: center; }
          .cfi-bottom-bar > a { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const stats = [
    { n: 200, suffix: "+", label: "CISOs & CIOs", desc: "C-Suite & Directors", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75", badge: "Expected", highlight: true },
    { n: 30, suffix: "+", label: "Expert Speakers", desc: "Practitioners & Leaders", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", badge: "Confirmed" },
    { n: 25, suffix: "+", label: "Technology Partners", desc: "Sponsors & Exhibitors", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", badge: "Planned" },
    { n: 1, suffix: "", label: "Focused Day", desc: "Full Summit Experience", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", badge: "16 June" },
  ];

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(60px, 7vw, 90px) 0", overflow: "hidden", background: "#060910" }}>
      {/* Background — real EFG event photo */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-324.jpg`} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.1) saturate(0.4)" }} />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(6,9,16,0.95) 0%, rgba(6,9,16,0.6) 50%, rgba(6,9,16,0.95) 100%)" }} />

      {/* Radial glow — slow pulse */}
      <div className="absolute inset-0 pointer-events-none cfi-overview-glow" style={{ background: `radial-gradient(ellipse 45% 40% at 50% 35%, ${C}0A, transparent 70%)` }} />

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 4px)", zIndex: 2 }} />

      {/* ── Text block ── */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 3 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: 40 }}>
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 20 }}>
            <span style={{ width: 24, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: C }}>Executive Overview</span>
            <span style={{ width: 24, height: 1, background: C }} />
          </div>

          {/* Headline — weight separation */}
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 40px)", letterSpacing: "-1.5px", color: "rgba(255,255,255,0.9)", lineHeight: 1.15, margin: "0 0 6px" }}>
            One Day. One Room.
          </h2>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(30px, 4vw, 48px)",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            margin: "0 0 28px",
            backgroundImage: `linear-gradient(135deg, ${C_BRIGHT} 0%, #ffffff 50%, ${C_BRIGHT} 100%)`,
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: `drop-shadow(0 0 30px ${C}25)`,
            animation: "shimmer 6s ease-in-out infinite",
          }}>
            India's Top 200+ Security Leaders.
          </h2>
        </motion.div>

        {/* Two text blocks with left cyan accent bars */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15, ease: EASE }} style={{ marginBottom: 20 }}>
          <div style={{ borderLeft: `2px solid ${C}40`, paddingLeft: 20, marginBottom: 20, maxWidth: 660, marginLeft: "auto", marginRight: "auto" }}>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, margin: 0 }}>
              India's digital landscape is advancing rapidly through <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>Digital India, UPI, Smart Cities, 5G</span>, and the growing use of AI and cloud technologies. Cybersecurity has become a key priority to safeguard critical infrastructure, financial systems, and enterprise operations.
            </p>
          </div>
          <div style={{ borderLeft: `2px solid ${C}25`, paddingLeft: 20, maxWidth: 660, marginLeft: "auto", marginRight: "auto" }}>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, margin: 0 }}>
              The rise of <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>ransomware, AI-driven cyberattacks, and supply-chain vulnerabilities</span> is creating new challenges. Enterprises must navigate evolving regulations while addressing a <span style={{ color: C_BRIGHT, fontWeight: 500 }}>persistent shortage of 1M+ skilled cyber professionals</span>.
            </p>
          </div>
        </motion.div>

        {/* Tags with label */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.3, ease: EASE }} style={{ textAlign: "center", marginBottom: 0 }}>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 9, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", display: "block", marginBottom: 10 }}>Who Attends</span>
          <div className="flex items-center justify-center flex-wrap gap-2 cfi-overview-tags">
            {["Invite-Only", "C-Suite & Directors", "92% Director-Level+", "15+ Industries"].map((tag) => (
              <span key={tag} style={{ padding: "5px 14px", borderRadius: 20, background: `${C}08`, border: `1px solid ${C}15`, fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: `${C}CC` }}>{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Divider band with scan-line texture ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.4, ease: EASE }}
        style={{
          maxWidth: 1200,
          margin: "56px auto 56px",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 3,
        }}
      >
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${C}20 20%, ${C}30 50%, ${C}20 80%, transparent 100%)`,
        }} />
      </motion.div>

      {/* ── Stat cards — full width row ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 3 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.5, ease: EASE }} className="cfi-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="cfi-stat-card"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: EASE }}
              style={{
                padding: "28px 22px 26px",
                borderRadius: 20,
                background: s.highlight
                  ? `linear-gradient(145deg, ${C}18 0%, ${C}06 100%)`
                  : "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
                backdropFilter: "blur(12px)",
                border: `1px solid ${s.highlight ? `${C}35` : "rgba(255,255,255,0.07)"}`,
                position: "relative",
                overflow: "hidden",
                boxShadow: s.highlight ? `0 8px 32px ${C}15, inset 0 1px 0 ${C}20` : "0 4px 24px rgba(0,0,0,0.25)",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Top glow for highlight card */}
              {s.highlight && (
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${C}10, transparent 60%)` }} />
              )}

              {/* Icon + contextual badge */}
              <div className="flex items-center justify-between" style={{ marginBottom: 16, position: "relative" }}>
                <div style={{
                  width: s.highlight ? 44 : 38,
                  height: s.highlight ? 44 : 38,
                  borderRadius: 12,
                  background: s.highlight ? `${C}20` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${s.highlight ? `${C}40` : "rgba(255,255,255,0.08)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width={s.highlight ? 21 : 17} height={s.highlight ? 21 : 17} viewBox="0 0 24 24" fill="none" stroke={s.highlight ? C_BRIGHT : "rgba(255,255,255,0.45)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon} />
                  </svg>
                </div>
                <span style={{
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: s.highlight ? `${C}15` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${s.highlight ? `${C}25` : "rgba(255,255,255,0.06)"}`,
                  fontFamily: "var(--font-dm)",
                  fontSize: 9,
                  fontWeight: 600,
                  color: s.highlight ? C_BRIGHT : "rgba(255,255,255,0.3)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}>{s.badge}</span>
              </div>

              {/* Number */}
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: s.highlight ? "clamp(42px, 5vw, 56px)" : "clamp(34px, 4.5vw, 44px)",
                fontWeight: 900,
                background: s.highlight ? `linear-gradient(135deg, ${C_BRIGHT} 0%, white 100%)` : "white",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-2px",
                lineHeight: 1,
                filter: s.highlight ? `drop-shadow(0 0 24px ${C}30)` : "none",
                position: "relative",
              }}>
                {inView ? <Counter to={s.n} suffix={s.suffix} /> : "0"}
              </div>

              {/* Label */}
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: s.highlight ? 12 : 10, fontWeight: 700, color: s.highlight ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 12, position: "relative" }}>{s.label}</div>

              {/* Description */}
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: s.highlight ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)", marginTop: 4, position: "relative" }}>{s.desc}</div>

              {/* Bottom accent line */}
              <div style={{ position: "absolute", bottom: 0, left: 20, right: 20, height: 2, background: s.highlight ? `linear-gradient(90deg, transparent, ${C}50, transparent)` : "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", borderRadius: 1 }} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 100, background: "linear-gradient(to bottom, transparent, #080A0F)", zIndex: 4 }} />

      <style jsx global>{`
        @keyframes cfi-overview-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .cfi-overview-glow { animation: cfi-overview-pulse 8s ease-in-out infinite; }
        .cfi-stat-card:hover { border-color: rgba(1, 187, 245, 0.3) !important; transform: translateY(-4px); box-shadow: 0 12px 40px rgba(1, 187, 245, 0.1) !important; }
        @media (max-width: 900px) {
          .cfi-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .cfi-stats-grid { gap: 10px !important; }
          .cfi-stats-grid > div { padding: 20px 16px 18px !important; border-radius: 16px !important; }
          .cfi-overview-tags { gap: 6px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Market Context ──────────────────────────────────────────────────────────
function MarketContext() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { num: 220, prefix: "₹", suffix: "M", label: "Avg. Breach Cost", source: "IBM 2025", highlight: true },
    { num: 2.27, prefix: "", suffix: "M", label: "Cyber Incidents in 2024", source: "CERT-In" },
    { num: 1, prefix: "", suffix: "M+", label: "Unfilled Security Roles", source: "ISC2 2025" },
    { num: 83, prefix: "", suffix: "%", label: "Orgs Not DPDP-Ready", source: "EY India" },
  ];

  return (
    <section id="overview" ref={ref} style={{ background: "#080A0F", padding: "clamp(60px, 7vw, 90px) 0", position: "relative" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 80% 50%, ${C}08, transparent 70%)` }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <div className="cfi-market-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* Left — Copy */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
            <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
              <span style={{ width: 30, height: 1, background: C }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>Why Now</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: "0 0 12px" }}>
              ₹220 Million.
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(16px, 1.6vw, 20px)", fontWeight: 400, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, margin: "0 0 28px" }}>
              That's what a single breach costs in India today.
              <br />
              <span style={{ color: C_BRIGHT, fontWeight: 500 }}>And 83% of enterprises haven't begun DPDP compliance.</span>
            </p>

            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 12 }}>
              India faces <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>3,300+ cyberattacks every week</span> — above the global average. Ransomware, AI-driven threats, and supply-chain compromises are accelerating. The DPDP Act is live and the compliance clock is ticking.
            </p>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 28 }}>
              <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>93% of Indian enterprises are increasing their cybersecurity budgets.</span> The question isn't whether to invest — it's where, how, and with whom.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["CERT-In Compliance", "DPDP Act 2023", "RBI Cyber Framework", "Digital India"].map((tag) => (
                <span key={tag} style={{ padding: "6px 14px", borderRadius: 20, background: `${C}10`, border: `1px solid ${C}20`, fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: C }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — Stat cards */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE }}
                style={{
                  padding: 24,
                  borderRadius: 16,
                  background: stat.highlight
                    ? `linear-gradient(145deg, ${C}15 0%, ${C}05 100%)`
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${stat.highlight ? `${C}30` : "rgba(255,255,255,0.06)"}`,
                  boxShadow: stat.highlight ? `0 0 40px ${C}10` : "none",
                }}
              >
                <CountUp
                  target={stat.num}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  active={inView}
                  delay={0.4 + i * 0.15}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: stat.highlight ? 36 : 30,
                    fontWeight: 800,
                    color: stat.highlight ? C_BRIGHT : "white",
                    letterSpacing: "-1px",
                  }}
                />
                <div style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginTop: 8 }}>
                  {stat.label}
                </div>
                <div style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.3)", marginTop: 6, letterSpacing: "0.5px" }}>
                  {stat.source}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`@media (max-width: 900px) { .cfi-market-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
    </section>
  );
}

// ─── Focus Areas ──────────────────────────────────────────────────────────────
function FocusAreas() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#050810", padding: "clamp(60px, 7vw, 90px) 0", position: "relative", overflow: "hidden" }}>
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 30% 40%, ${C}04, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 40% at 80% 60%, ${C}03, transparent 70%)` }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>Conference Tracks</span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: "0 0 14px" }}>
            What We&apos;re{" "}
            <span style={{ background: `linear-gradient(135deg, ${C}, ${C_BRIGHT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Solving</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            8 practitioner-led tracks built around India&apos;s real threat landscape and regulatory reality.
          </p>
        </motion.div>

        {/* Card Grid */}
        <div className="cfi-focus-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {FOCUS_AREAS.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: EASE }}
              style={{
                gridColumn: area.wide ? "span 2" : "span 1",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                overflow: "hidden",
                position: "relative",
                minHeight: 280,
              }}
              className="cfi-focus-card"
            >
              {/* Background image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={area.bg}
                alt=""
                aria-hidden="true"
                className="cfi-focus-bg"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.35) saturate(0.7)",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease",
                }}
              />

              {/* Gradient overlay */}
              <div
                className="cfi-focus-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(5,8,16,0.95) 30%, rgba(5,8,16,0.4) 70%, rgba(5,8,16,0.25) 100%)",
                  transition: "opacity 0.5s ease",
                }}
              />

              {/* Content — pushed to bottom */}
              <div style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                height: "100%",
                padding: "28px",
              }}>
                {/* Track number pill */}
                <span style={{
                  fontFamily: "var(--font-dm)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: C_BRIGHT,
                  letterSpacing: "1.5px",
                  display: "inline-block",
                  width: "fit-content",
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: `${C}15`,
                  border: `1px solid ${C}25`,
                  marginBottom: 12,
                }}>{String(i + 1).padStart(2, "0")}</span>

                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "white", margin: "0 0 8px", letterSpacing: "-0.3px", lineHeight: 1.25 }}>{area.title}</h3>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>{area.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <Link
            href="#register"
            className="cfi-tracks-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 30px",
              borderRadius: 50,
              border: `1px solid ${C}25`,
              background: `${C}06`,
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 500,
              color: C,
              textDecoration: "none",
              transition: "all 0.35s ease",
              letterSpacing: "0.3px",
            }}
          >
            View Full Agenda <span style={{ fontSize: 16, transition: "transform 0.3s ease" }}>→</span>
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        .cfi-focus-card:hover {
          border-color: rgba(1, 187, 245, 0.2) !important;
          transform: translateY(-6px) !important;
          box-shadow: 0 12px 40px rgba(1, 187, 245, 0.1), 0 0 0 1px rgba(1, 187, 245, 0.08);
        }
        .cfi-focus-card:hover .cfi-focus-bg {
          transform: scale(1.08);
          filter: brightness(0.45) saturate(0.9) !important;
        }
        .cfi-focus-card:hover .cfi-focus-overlay {
          opacity: 0.85;
        }
        .cfi-tracks-cta:hover {
          background: rgba(1, 187, 245, 0.14) !important;
          border-color: rgba(1, 187, 245, 0.45) !important;
          box-shadow: 0 4px 20px rgba(1, 187, 245, 0.1);
        }
        @media (max-width: 1024px) {
          .cfi-focus-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cfi-focus-grid > * { grid-column: span 1 !important; }
        }
        @media (max-width: 600px) {
          .cfi-focus-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Who Should Attend ───────────────────────────────────────────────────────
function WhoShouldAttend() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#080A0F", padding: "clamp(60px, 7vw, 90px) 0" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <div className="cfi-attend-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
            <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
              <span style={{ width: 30, height: 1, background: C }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>The Room</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: "0 0 20px" }}>Who Should Attend</h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 32 }}>
              Cyber First India brings together the decision-makers shaping India's cybersecurity landscape — from government leaders to enterprise CISOs and technology innovators.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {["CISO / CSO", "CIO / CTO", "VP Security", "Director IT", "Head of Risk", "Security Architect", "Compliance Lead", "Government Officials"].map((role) => (
                <div key={role} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C }} />
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{role}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 24px" }}>Delegate Breakdown by Industry</h3>
              {WHO_ATTEND_INDUSTRIES.map((ind, i) => (
                <motion.div key={ind.name} initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{ind.name}</span>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, color: C }}>{ind.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={inView ? { width: `${ind.pct}%` } : {}} transition={{ duration: 0.8, delay: 0.5 + i * 0.05, ease: EASE }} style={{ height: "100%", background: `linear-gradient(90deg, ${C}, ${C_BRIGHT})`, borderRadius: 2 }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`@media (max-width: 900px) { .cfi-attend-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }`}</style>
    </section>
  );
}

// ─── Agenda Timeline ─────────────────────────────────────────────────────────
function AgendaTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const typeColors: Record<string, string> = { keynote: C, panel: "#9D4EDD", fireside: "#F97316", sponsor: "#10B981", break: "#6B7280", ceremony: "#EAB308", awards: "#EC4899", closing: "#06B6D4" };

  const morningItems = AGENDA.slice(0, 12); // Registration through Lunch
  const afternoonItems = AGENDA.slice(12);   // After Lunch through Closing

  const isBreak = (type: string) => type === "break";
  const isHighlight = (type: string) => type === "keynote" || type === "ceremony" || type === "awards";

  const renderItem = (item: (typeof AGENDA)[number], i: number, delayOffset: number) => {
    const color = typeColors[item.type] || C;
    const breakStyle = isBreak(item.type);
    const highlight = isHighlight(item.type);

    return (
      <motion.div
        key={`${item.time}-${i}`}
        initial={{ opacity: 0, x: -15 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay: delayOffset + i * 0.04, ease: EASE }}
        style={{ display: "flex", gap: 20, marginBottom: breakStyle ? 10 : 14, paddingLeft: 22, position: "relative" }}
        className="cfi-agenda-item"
      >
        <div style={{ position: "absolute", left: -4, top: breakStyle ? 7 : 11, width: breakStyle ? 8 : 10, height: breakStyle ? 8 : 10, borderRadius: "50%", background: color, boxShadow: highlight ? `0 0 14px ${color}50` : `0 0 8px ${color}25` }} />
        <div style={{ minWidth: 100, fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.3)", paddingTop: breakStyle ? 2 : 4 }}>{item.time}</div>

        {breakStyle ? (
          /* Break items — minimal inline style, no card */
          <div style={{ flex: 1, padding: "6px 0", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{item.title}</span>
            <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
          </div>
        ) : (
          /* Content sessions — full card with left accent */
          <div style={{
            flex: 1,
            padding: "14px 18px",
            borderRadius: 10,
            background: highlight ? `${color}06` : "rgba(255,255,255,0.02)",
            border: `1px solid ${highlight ? `${color}15` : "rgba(255,255,255,0.06)"}`,
            borderLeft: `3px solid ${color}${highlight ? "60" : "30"}`,
            transition: "all 0.3s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: item.subtitle ? 5 : 0, flexWrap: "wrap" }}>
              <span style={{ padding: "2px 7px", borderRadius: 4, background: `${color}12`, fontFamily: "var(--font-dm)", fontSize: 9, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.type}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: highlight ? 800 : 700, color: "white", letterSpacing: "-0.2px" }}>{item.title}</span>
            </div>
            {item.subtitle && <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.5 }}>{item.subtitle}</p>}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <section id="agenda" ref={ref} style={{ background: "#050810", padding: "clamp(60px, 7vw, 90px) 0", position: "relative", overflow: "hidden" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 50% 30%, ${C}04, transparent 70%)` }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>Agenda</span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: "0 0 14px" }}>
            The Day&apos;s Programme
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            One focused day. Two halves. Every session designed to deliver actionable outcomes.
          </p>
        </motion.div>

        {/* Two-column split */}
        <div className="cfi-agenda-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          {/* Morning */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingBottom: 16, borderBottom: `1px solid rgba(255,255,255,0.06)` }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C, boxShadow: `0 0 10px ${C}40` }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>Morning</span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.25)" }}>08:30 – 13:00</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 600, color: C, letterSpacing: "0.5px", padding: "3px 10px", borderRadius: 20, background: `${C}10`, border: `1px solid ${C}20` }}>{morningItems.filter(it => !isBreak(it.type)).length} Sessions</span>
            </motion.div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, transparent, ${C}25, transparent)` }} />
              {morningItems.map((item, i) => renderItem(item, i, 0.2))}
            </div>
          </div>

          {/* Afternoon */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingBottom: 16, borderBottom: `1px solid rgba(255,255,255,0.06)` }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C, boxShadow: `0 0 10px ${C}40` }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>Afternoon</span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.25)" }}>14:00 – 16:00</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontFamily: "var(--font-dm)", fontSize: 10, fontWeight: 600, color: C, letterSpacing: "0.5px", padding: "3px 10px", borderRadius: 20, background: `${C}10`, border: `1px solid ${C}20` }}>{afternoonItems.filter(it => !isBreak(it.type)).length} Sessions</span>
            </motion.div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, transparent, ${C}25, transparent)` }} />
              {afternoonItems.map((item, i) => renderItem(item, i, 0.35))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .cfi-agenda-item > div:last-child:hover {
          background: rgba(255,255,255,0.035) !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        @media (max-width: 768px) {
          .cfi-agenda-split { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 600px) {
          .cfi-agenda-item { flex-direction: column !important; gap: 6px !important; }
          .cfi-agenda-item > div:first-child { min-width: 0 !important; padding-top: 0 !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Speakers & Advisors ─────────────────────────────────────────────────────
const CFI_SPEAKERS = [
  { name: "Air Vice Marshal (Dr) Devesh Vatsa VSM", designation: "Advisor Cyber Security & Critical Technologies", entity: "Data Security Council of India (DSCI)", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/Dr_Devesh_pic.jpeg" },
  { name: "Prabhu Narayan", designation: "Director & CISO, Department of Economic Affairs (DEA)", entity: "Ministry of Finance, Government of India", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/Prabhu-Narayan.jpg" },
  { name: "M Dhanasekar", designation: "Wing Commander", entity: "Indian Airforce", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/Dhanasekar_Pic.png" },
  { name: "Dr. Susil Kumar Meher", designation: "Head Health IT and CISO", entity: "AIIMS", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/Dr_Sushil_Pic.jpg" },
  { name: "Saurabh Basu", designation: "Scientist E & Head (Enterprise Cyber Security)", entity: "Centre for Development of Telematics (C-DOT), Ministry of Communication, Govt of India", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/Saurabh_pic.jpg" },
  { name: "Dr. Jagannath Sahoo", designation: "Chief Information Security Officer (CISO)", entity: "INOXGFL", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/Dr_Jagannath_Sahoo.jpg" },
  { name: "Dr. Pavan Duggal", designation: "Advocate", entity: "Supreme Court of India", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/Pavan_Duggal.jpg" },
  { name: "Dr Harsha Thennarasu", designation: "Chief Cyber Defence Advisor", entity: "HKIT Security Solutions", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/Dr_Harsha.JPG" },
  { name: "Lt Cdr Karan Kalra (Retd)", designation: "Chief Information Security Officer (CISO)", entity: "Perpetual-Edge", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/CyberFirst_Delhi_Speakers/Dr-Karan.jpg" },
];

function SpeakersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="speakers" ref={ref} style={{ background: "#080A0F", padding: "clamp(60px, 7vw, 90px) 0", position: "relative", overflow: "hidden" }}>
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${C}06, transparent 70%)` }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }} style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT, marginBottom: 16 }}>
            Confirmed Speakers & Advisors
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 48px)", color: "white", margin: 0, lineHeight: 1.15 }}>
            Industry <span style={{ color: C_BRIGHT }}>Leaders</span> & Experts
          </h2>
        </motion.div>

        {/* Speaker Cards Grid */}
        <div className="cfi-speakers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
          {CFI_SPEAKERS.map((speaker, i) => (
            <motion.div
              key={speaker.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: EASE }}
              className="cfi-speaker-card"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                background: "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Photo */}
              <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden", background: speaker.photo ? "transparent" : `linear-gradient(135deg, ${C}20, #0A0C12)` }}>
                {speaker.photo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={speaker.photo}
                      alt={speaker.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", filter: "grayscale(1)", transition: "transform 0.5s ease, filter 0.5s ease" }}
                    />
                  </>
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={`${C_BRIGHT}40`} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
                {/* Bottom gradient overlay */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, #080A0F, transparent)", pointerEvents: "none" }} />
              </div>

              {/* Info */}
              <div style={{ padding: "20px 20px 24px", marginTop: -24, position: "relative" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", margin: "0 0 6px", lineHeight: 1.25 }}>
                  {speaker.name}
                </h3>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 400, color: C_BRIGHT, margin: "0 0 4px", lineHeight: 1.4 }}>
                  {speaker.designation}
                </p>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                  {speaker.entity}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .cfi-speaker-card:hover {
          transform: translateY(-6px);
          border-color: ${C}30 !important;
          box-shadow: 0 20px 50px ${C}10;
        }
        .cfi-speaker-card:hover img {
          transform: scale(1.05);
          filter: grayscale(0) !important;
        }
        @media (max-width: 1100px) {
          .cfi-speakers-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .cfi-speakers-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .cfi-speakers-grid { grid-template-columns: 1fr !important; max-width: 360px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}

// ─── CONFIRMED SPEAKERS ──────────────────────────────────────────────────────
// ─── Sponsors Section ────────────────────────────────────────────────────────
function SponsorsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="sponsors"
      style={{
        background: "#020508",
        padding: "clamp(48px, 6vw, 80px) 0",
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
              Trusted By Industry Leaders
            </span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 44px)",
              letterSpacing: "-1.5px",
              color: "white",
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

          {/* Row 1 — scrolls left */}
          <div className="cfi-marquee-track" style={{ marginBottom: 20 }}>
            <div
              className="cfi-marquee-inner cfi-scroll-left"
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
          <div className="cfi-marquee-track">
            <div
              className="cfi-marquee-inner cfi-scroll-right"
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
          <Link
            href="/sponsors-and-partners"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: C_BRIGHT,
              textDecoration: "none",
              letterSpacing: "0.3px",
              transition: "all 0.3s ease",
              padding: "8px 20px",
              borderRadius: 50,
              border: `1px solid transparent`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = `${C_BRIGHT}40`;
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
        .cfi-marquee-track {
          overflow: hidden;
          width: 100%;
        }
        .cfi-marquee-inner {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .cfi-scroll-left {
          animation: cfiScrollLeft linear infinite;
        }
        .cfi-scroll-right {
          animation: cfiScrollRight linear infinite;
        }
        @keyframes cfiScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes cfiScrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#050810", padding: "clamp(60px, 7vw, 90px) 0" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ marginBottom: 48 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>From the Series</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: 0 }}>
            The Cyber First Experience
          </h2>
        </motion.div>

        <div className="cfi-gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "220px 200px 200px", gap: 12 }}>
          {GALLERY.map((img, i) => {
            // Layout: 0 spans 2col+2row, 6 spans 2col, rest 1col
            const span2Col = i === 0 || i === 6;
            const span2Row = i === 0;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }} className="cfi-gallery-item" style={{ gridColumn: span2Col ? "span 2" : "span 1", gridRow: span2Row ? "span 2" : "span 1", borderRadius: 14, overflow: "hidden", position: "relative" }}>
                <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: img.pos || "center", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,8,16,0.6) 0%, transparent 40%)" }} />
                <span style={{ position: "absolute", bottom: 12, left: 14, fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.5)", opacity: 0, transition: "opacity 0.3s ease" }} className="cfi-gallery-label">{img.alt}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .cfi-gallery-item:hover img { transform: scale(1.04); }
        .cfi-gallery-item:hover .cfi-gallery-label { opacity: 1 !important; }
        @media (max-width: 900px) {
          .cfi-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; grid-template-rows: auto !important; }
          .cfi-gallery-grid > div { grid-column: span 1 !important; grid-row: span 1 !important; aspect-ratio: 16/10; }
          .cfi-gallery-grid > div:first-child { grid-column: span 2 !important; aspect-ratio: 21/9; }
        }
        @media (max-width: 600px) {
          .cfi-gallery-grid { grid-template-columns: 1fr !important; }
          .cfi-gallery-grid > div:first-child { grid-column: span 1 !important; aspect-ratio: 16/10; }
        }
      `}</style>
    </section>
  );
}

// ─── Awards Section ──────────────────────────────────────────────────────────
function AwardsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const GOLD = "#C4A34A";
  const GOLD_BRIGHT = "#D4B85A";

  const [formData, setFormData] = useState({ orgName: "", contactName: "", email: "", phone: "", category: "", reason: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [awardsSelectedCountry, setAwardsSelectedCountry] = useState<CountryCode>(COUNTRY_CODES.find(c => c.country === "IN") || COUNTRY_CODES[0]);
  const [awardsPhoneError, setAwardsPhoneError] = useState<string | null>(null);
  const [awardsEmailError, setAwardsEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && !isWorkEmail(formData.email)) { setAwardsEmailError("Please use your work email address"); return; }
    const phoneErr = validatePhone(formData.phone, awardsSelectedCountry);
    if (phoneErr) { setAwardsPhoneError(phoneErr); return; }
    const result = await submitForm({ type: "awards", full_name: formData.contactName, email: formData.email, company: formData.orgName, phone: `${awardsSelectedCountry.code} ${formData.phone}`, event_name: "Cyber First India 2026", metadata: { category: formData.category, reason: formData.reason }, website: "" });
    if (result.success) {
      setFormSubmitted(true);
    } else {
      setAwardsEmailError(result.error || "Something went wrong. Please try again.");
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", padding: "16px 20px", borderRadius: 14,
    backgroundColor: focusedField === field ? "rgba(196,163,74,0.06)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focusedField === field ? `${GOLD}35` : "rgba(255,255,255,0.07)"}`,
    boxShadow: focusedField === field ? `0 0 20px ${GOLD}08, inset 0 0 20px ${GOLD}03` : "none",
    color: "white", fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, outline: "none",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
  });

  return (
    <section ref={ref} style={{ background: "linear-gradient(180deg, #080A0F 0%, #0A0D14 50%, #080A0F 100%)", padding: "clamp(60px, 7vw, 90px) 0", position: "relative", overflow: "hidden" }}>
      {/* Atmospheric layers */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${GOLD}06, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 40% at 20% 60%, ${C}03, transparent 60%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 40% at 80% 70%, ${GOLD}04, transparent 60%)` }} />
      {/* Scan line texture */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 3px)", backgroundSize: "100% 3px" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 56 }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.1, ease: EASE }} style={{ width: 60, height: 60, margin: "0 auto 20px", borderRadius: 16, background: `linear-gradient(145deg, ${GOLD}18, ${GOLD}06)`, border: `1px solid ${GOLD}25`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 40px ${GOLD}12, inset 0 1px 0 ${GOLD}20`, backdropFilter: "blur(12px)" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 1012 0V2z" />
            </svg>
          </motion.div>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 14 }}>
            <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: GOLD }}>Awards & Recognition</span>
            <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.8vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.08, margin: "12px 0 14px" }}>
            Cyber First India Awards{" "}
            <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2026</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 350, color: "rgba(255,255,255,0.4)", maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>
            Recognizing outstanding leaders, innovators, and organizations driving excellence in cybersecurity and digital resilience across India.
          </p>
        </motion.div>

        {/* ── Two-Column: Categories Left + Form Right ── */}
        <div className="cfi-awards-main" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>

          {/* LEFT — Award Categories as glass cards */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2, ease: EASE }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(18px,2vw,24px)", color: "white", margin: "0 0 6px", letterSpacing: "-0.5px" }}>8 Award Categories</h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>Celebrating leadership across cybersecurity&apos;s most critical domains</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {AWARDS_DATA.map((award, i) => (
                <motion.div
                  key={award}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.04, ease: EASE }}
                  className="cfi-award-card"
                  style={{
                    padding: "16px 20px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Left gold accent */}
                  <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 2, background: `${GOLD}25`, borderRadius: 1 }} />

                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 200, fontSize: 24, letterSpacing: "-1.5px", color: `${GOLD}30`, minWidth: 32, textAlign: "right", lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>

                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${GOLD}0A`, border: `1px solid ${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={`${GOLD}80`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 1012 0V2z" />
                    </svg>
                  </div>

                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.65)", lineHeight: 1.35 }}>{award}</span>
                </motion.div>
              ))}
            </div>

            {/* Eligibility strip */}
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.7, ease: EASE }} style={{ marginTop: 20, padding: "16px 20px", borderRadius: 14, background: `${GOLD}05`, border: `1px solid ${GOLD}12`, display: "flex", flexWrap: "wrap", gap: 14 }}>
              {["India-based", "12-month impact", "Self-nominations OK", "Open to all sectors"].map((t) => (
                <span key={t} className="flex items-center gap-2" style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={`${GOLD}70`} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — Nomination Form Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            style={{
              padding: "clamp(28px,3.5vw,40px)",
              borderRadius: 24,
              background: "linear-gradient(170deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
              backdropFilter: "blur(40px) saturate(1.5)",
              WebkitBackdropFilter: "blur(40px) saturate(1.5)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.02), 0 16px 64px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.04)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glass reflections */}
            <div className="absolute pointer-events-none" style={{ top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.15) 70%, transparent 95%)` }} />
            <div className="absolute pointer-events-none" style={{ top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}0A, transparent 70%)`, filter: "blur(50px)" }} />
            <div className="absolute pointer-events-none" style={{ bottom: -50, left: -50, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${C}06, transparent 70%)`, filter: "blur(50px)" }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.015) 100%)", borderRadius: 24 }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Nominations Open badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: `${GOLD}0C`, border: `1px solid ${GOLD}20`, marginBottom: 18 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill={GOLD} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                <span style={{ fontFamily: "var(--font-dm)", fontSize: 11, fontWeight: 600, color: GOLD, letterSpacing: "0.5px" }}>Nominations Open</span>
              </div>

              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px,2.2vw,26px)", letterSpacing: "-0.5px", color: "white", lineHeight: 1.15, margin: "0 0 6px" }}>
                Submit Your Nomination
              </h4>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 350, color: "rgba(255,255,255,0.4)", lineHeight: 1.55, margin: "0 0 24px" }}>
                Know a leader who deserves recognition? Self-nominations are welcome.
              </p>

              {!formSubmitted ? (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
                    <div className="cfi-awards-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <input type="text" placeholder="Organisation Name" required value={formData.orgName} onChange={(e) => setFormData({ ...formData, orgName: e.target.value })} onFocus={() => setFocusedField("orgName")} onBlur={() => setFocusedField(null)} style={inputStyle("orgName")} />
                      <input type="text" placeholder="Contact Person" required value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} onFocus={() => setFocusedField("contactName")} onBlur={() => setFocusedField(null)} style={inputStyle("contactName")} />
                    </div>

                    <input type="email" placeholder="Work Email Address" required value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setAwardsEmailError(null); }} onFocus={() => setFocusedField("email")} onBlur={() => { setFocusedField(null); if (formData.email && !isWorkEmail(formData.email)) setAwardsEmailError("Please use your work email address"); }} style={inputStyle("email")} />
                    {awardsEmailError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "-6px 0 0" }}>{awardsEmailError}</p>}

                    {/* Phone — full width row */}
                    <div style={{ display: "flex", gap: 10 }}>
                      <select value={`${awardsSelectedCountry.code}|${awardsSelectedCountry.country}`} onChange={(e) => { const [code, country] = e.target.value.split("|"); const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country); if (c) { setAwardsSelectedCountry(c); setAwardsPhoneError(null); } }} onFocus={() => setFocusedField("countryCode")} onBlur={() => setFocusedField(null)} style={{ ...inputStyle("countryCode"), width: 130, flexShrink: 0, appearance: "none" as const, cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}>
                        {COUNTRY_CODES.map((cc) => (<option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: "#222", background: "#fff" }}>{cc.country} {cc.code}</option>))}
                      </select>
                      <input type="tel" placeholder={awardsSelectedCountry.placeholder} value={formData.phone} onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setAwardsPhoneError(null); }} onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} maxLength={awardsSelectedCountry.length} style={{ ...inputStyle("phone"), flex: 1 }} />
                    </div>
                    {awardsPhoneError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "-6px 0 0" }}>{awardsPhoneError}</p>}

                    <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} onFocus={() => setFocusedField("category")} onBlur={() => setFocusedField(null)} style={{ ...inputStyle("category"), appearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23707070' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 18px center", cursor: "pointer", color: formData.category ? "white" : "rgba(255,255,255,0.3)" }}>
                      <option value="" disabled style={{ color: "#555", background: "#111" }}>Select Award Category</option>
                      {AWARDS_DATA.map((a) => (<option key={a} value={a} style={{ color: "white", background: "#111" }}>{a}</option>))}
                    </select>

                    <textarea placeholder="Why should this nominee be considered?" required rows={4} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} onFocus={() => setFocusedField("reason")} onBlur={() => setFocusedField(null)} style={{ ...inputStyle("reason"), resize: "vertical", minHeight: 100 }} />
                  </div>

                  <button type="submit" className="cfi-nominate-btn" style={{ width: "100%", padding: "16px 40px", borderRadius: 14, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, border: "none", color: "#0A0A0A", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, letterSpacing: "-0.2px", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", boxShadow: `0 4px 24px ${GOLD}20` }}>
                    Submit Nomination
                  </button>

                  <p style={{ textAlign: "center", fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 14 }}>
                    Free to nominate · Deadline: 30 May 2026
                  </p>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }} style={{ textAlign: "center", padding: "40px 16px" }}>
                  <div style={{ width: 60, height: 60, borderRadius: 16, background: `${GOLD}12`, border: `1px solid ${GOLD}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", boxShadow: `0 8px 32px ${GOLD}15` }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "white", margin: "0 0 8px" }}>Nomination Submitted</h4>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: 0 }}>Thank you. Our committee will review your submission and follow up shortly.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .cfi-award-card:hover {
          background: rgba(196,163,74,0.05) !important;
          border-color: rgba(196,163,74,0.15) !important;
          transform: translateX(4px);
        }
        .cfi-award-card:hover > div:first-child {
          background: ${GOLD}40 !important;
        }
        .cfi-nominate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(196,163,74,0.3) !important;
        }
        @media (max-width: 900px) {
          .cfi-awards-main { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .cfi-awards-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Venue ───────────────────────────────────────────────────────────────────
function Venue() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="venue" ref={ref} style={{ background: "#050810", padding: "clamp(60px, 7vw, 90px) 0" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <div className="cfi-venue-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ borderRadius: 20, overflow: "hidden", aspectRatio: "16/10" }}>
            <img src="https://efg-final.s3.eu-north-1.amazonaws.com/delhi2-bg.png" alt="The Lalit Ashok Hotel New Delhi" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}>
            <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
              <span style={{ width: 30, height: 1, background: C }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>Venue</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 40px)", letterSpacing: "-1px", color: "white", lineHeight: 1.1, margin: "0 0 16px" }}>
              The Lalit Ashok<br />New Delhi
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 24 }}>
              Set in the heart of Chanakyapuri — New Delhi's diplomatic enclave — The Lalit Ashok offers a world-class setting for India's most important cybersecurity conversations. Where the nation's top CISOs, government leaders, and enterprise security executives convene.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[{ icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", text: "The Lalit Ashok, Chanakyapuri, New Delhi" }, { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: "16 June 2026 · 8:30 AM – 4:00 PM" }].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.5"><path d={item.icon} /></svg>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`@media (max-width: 900px) { .cfi-venue-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ─── Registration Section ────────────────────────────────────────────────────
const REG_TABS = [
  {
    key: "sponsor",
    label: "Sponsor",
    heading: "Partner with\nCyber First India",
    description: "Put your brand in the room with India's top CISOs and security leaders. Sponsorship packages designed for maximum visibility and qualified lead generation.",
    perks: [
      { icon: "layers", text: "Boardroom hosting & keynote slots" },
      { icon: "target", text: "Qualified lead generation" },
      { icon: "eye", text: "Premium brand visibility" },
    ],
    trust: "Trusted by 80+ sponsors across 6+ global markets",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your sponsorship goals..." },
    ],
    cta: "Request Sponsorship Info",
    formType: "sponsor" as FormType,
  },
  {
    key: "pass",
    label: "Attend",
    heading: "Request Your\nEvent Pass",
    description: "Curated for senior leaders — CISOs, CIOs, CTOs, and VP-level executives. Submit your details and we'll match you to the right room.",
    perks: [
      { icon: "users", text: "Invite-only, C-suite audience" },
      { icon: "calendar", text: "16 June 2026 · New Delhi" },
      { icon: "shield", text: "Chatham House Rule sessions" },
    ],
    trust: "5,000+ senior leaders attended EFG events since 2023",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your interests..." },
    ],
    cta: "Request Pass",
    formType: "attend" as FormType,
  },
  {
    key: "speaker",
    label: "Speak",
    heading: "Share Your\nExpertise",
    description: "We platform practitioners, not salespeople. If you're a hands-on leader with real-world experience, we want you on stage.",
    perks: [
      { icon: "mic", text: "Keynote & panel opportunities" },
      { icon: "globe", text: "Reach 300+ senior leaders" },
      { icon: "award", text: "Join our speaker alumni network" },
    ],
    trust: "200+ practitioners have spoken at EFG events since 2023",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
      { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 xxxx xxxx" },
      { name: "company", label: "Company", type: "text", placeholder: "Company name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
      { name: "topic", label: "Proposed Topic", type: "text", placeholder: "Brief topic or area of expertise" },
      { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Tell us about your background..." },
    ],
    cta: "Submit Speaker Proposal",
    formType: "speak" as FormType,
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState("sponsor");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES.find(c => c.country === "IN") || COUNTRY_CODES[0]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const tab = REG_TABS.find((t) => t.key === activeTab)!;

  // Listen for tab-switch events from other sections (e.g. "Become a Sponsor" button)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && REG_TABS.some((t) => t.key === detail)) {
        setActiveTab(detail);
        if (submitted) resetForm();
      }
    };
    window.addEventListener("cfi-set-tab", handler);
    return () => window.removeEventListener("cfi-set-tab", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    if (formData.email && !isWorkEmail(formData.email)) {
      setEmailError("Please use your work email address");
      setSubmitting(false);
      return;
    }

    const phoneErr = validatePhone(formData.phone || "", selectedCountry);
    if (phoneErr) {
      setPhoneError(phoneErr);
      setSubmitting(false);
      return;
    }

    const combinedPhone = `${selectedCountry.code}${(formData.phone || "").replace(/[\s\-()]/g, "")}`;

    const result = await submitForm({
      type: tab.formType,
      full_name: formData.name || "",
      email: formData.email || "",
      company: formData.company || "",
      job_title: formData.title || "",
      phone: combinedPhone,
      event_name: "Cyber First India 2026",
      metadata: {
        message: formData.message || "",
        ...(formData.topic ? { proposed_topic: formData.topic } : {}),
      },
    });

    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setFormError(result.error || "Something went wrong.");
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormError(null);
    setFormData({});
    setPhoneError(null);
    setEmailError(null);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    fontFamily: "var(--font-outfit)",
    fontSize: 13.5,
    fontWeight: 400,
    outline: "none",
    transition: "border-color 0.3s ease",
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
    <section id="register" ref={ref} style={{ background: "#080A0F", padding: "clamp(60px, 7vw, 90px) 0", position: "relative", overflow: "hidden" }}>
      {/* Atmospheric background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 700px 500px at 20% 40%, ${C}06, transparent 70%), radial-gradient(ellipse 500px 400px at 80% 60%, ${C}04, transparent 70%)` }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        {/* Tab pills + section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 30, height: 1, background: C, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: C_BRIGHT, fontFamily: "var(--font-outfit)" }}>
              Get Involved
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 6 }}>
            {REG_TABS.map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => { setActiveTab(t.key); if (submitted) resetForm(); }}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 40,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#050810" : "rgba(255,255,255,0.4)",
                    background: isActive ? C : "rgba(255,255,255,0.04)",
                    border: isActive ? `1px solid ${C}` : "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    letterSpacing: "0.2px",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Split layout */}
        <div className="cfi-reg-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: "clamp(32px, 4vw, 64px)", alignItems: "start" }}>
          {/* LEFT — Editorial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${activeTab}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ paddingTop: 8 }}
            >
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 3.5vw, 50px)", letterSpacing: "-2px", color: "white", lineHeight: 1.08, margin: 0, whiteSpace: "pre-line" }}>
                {tab.heading}
              </h2>
              <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: "clamp(14px, 1.2vw, 16px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "20px 0 0", maxWidth: 440 }}>
                {tab.description}
              </p>
              <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
                {tab.perks.map((perk) => (
                  <div key={perk.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C}0A`, border: `1px solid ${C}18`, display: "flex", alignItems: "center", justifyContent: "center", color: C_BRIGHT, flexShrink: 0 }}>
                      <RegPerkIcon type={perk.icon} />
                    </div>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.55)" }}>
                      {perk.text}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.25)", letterSpacing: "0.3px", margin: 0 }}>
                  {tab.trust}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* RIGHT — Form card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            style={{ borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", padding: "clamp(24px, 3vw, 36px)", position: "relative", overflow: "hidden" }}
          >
            {/* Ambient glow */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(ellipse, ${C}08, transparent 70%)`, pointerEvents: "none" }} />

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px, 2.5vw, 26px)", letterSpacing: "-0.5px", color: "white", margin: "0 0 8px" }}>
                    Inquiry Submitted
                  </h3>
                  <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 14, color: "#A0A0A0", margin: "0 0 20px", lineHeight: 1.6 }}>
                    Our team will review your submission and get back to you within 2 working hours.
                  </p>
                  <button
                    onClick={resetForm}
                    style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: C_BRIGHT, background: "none", border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 8, transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.background = `${C}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = C_BRIGHT;
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    Submit another inquiry &rarr;
                  </button>
                </motion.div>
              ) : (
                <motion.div key={`form-${activeTab}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
                  <form onSubmit={handleSubmit}>
                    <div className="cfi-reg-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      {tab.fields.map((field) => {
                        const isFullWidth = field.type === "textarea" || field.type === "tel";
                        if (field.type === "tel") {
                          return (
                            <div key={field.name} style={{ gridColumn: "1 / -1" }}>
                              <label style={labelStyle}>{field.label}</label>
                              <div style={{ display: "flex", gap: 8 }}>
                                <select
                                  value={`${selectedCountry.code}|${selectedCountry.country}`}
                                  onChange={(e) => {
                                    const [code, country] = e.target.value.split("|");
                                    const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country);
                                    if (c) { setSelectedCountry(c); setPhoneError(null); }
                                  }}
                                  style={{ ...inputStyle, width: 120, flexShrink: 0, appearance: "none", cursor: "pointer" }}
                                >
                                  {COUNTRY_CODES.map((cc) => (
                                    <option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: "#222", background: "#fff" }}>
                                      {cc.country} {cc.code}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="tel"
                                  value={formData[field.name] || ""}
                                  onChange={(e) => { handleChange(field.name, e.target.value); setPhoneError(null); }}
                                  placeholder={selectedCountry.placeholder}
                                  maxLength={selectedCountry.length}
                                  style={{ ...inputStyle, flex: 1 }}
                                  onFocus={(e) => { e.currentTarget.style.borderColor = `${C}50`; }}
                                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                                />
                              </div>
                              {phoneError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{phoneError}</p>}
                            </div>
                          );
                        }
                        if (field.type === "email") {
                          return (
                            <div key={field.name}>
                              <label style={labelStyle}>{field.label}</label>
                              <input
                                type="email"
                                value={formData[field.name] || ""}
                                onChange={(e) => { handleChange(field.name, e.target.value); setEmailError(null); }}
                                placeholder={field.placeholder}
                                required
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = `${C}50`; }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                  const val = formData[field.name] || e.currentTarget.value;
                                  if (val && !isWorkEmail(val)) setEmailError("Please use your work email address");
                                }}
                              />
                              {emailError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{emailError}</p>}
                            </div>
                          );
                        }
                        return (
                          <div key={field.name} style={{ gridColumn: isFullWidth ? "1 / -1" : undefined }}>
                            <label style={labelStyle}>{field.label}</label>
                            {field.type === "textarea" ? (
                              <textarea
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                rows={3}
                                style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = `${C}50`; }}
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
                                onFocus={(e) => { e.currentTarget.style.borderColor = `${C}50`; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Honeypot */}
                    <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

                    {formError && (
                      <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 13, margin: "8px 0 0" }}>{formError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        width: "100%",
                        marginTop: 20,
                        padding: "13px 28px",
                        borderRadius: 10,
                        background: submitting ? `${C}99` : C,
                        color: "#050810",
                        fontFamily: "var(--font-outfit)",
                        fontSize: 14,
                        fontWeight: 600,
                        border: "none",
                        cursor: submitting ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        opacity: submitting ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!submitting) {
                          e.currentTarget.style.background = C_BRIGHT;
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = `0 12px 40px ${C}40`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = submitting ? `${C}99` : C;
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {submitting ? "Submitting..." : tab.cta} {!submitting && <span>&rarr;</span>}
                    </button>
                  </form>

                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.15)", textAlign: "center", margin: "14px 0 0" }}>
                    Your information is kept confidential. We&apos;ll only use it to respond to your inquiry.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 860px) {
          .cfi-reg-split { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .cfi-reg-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Contact Enquiries ───────────────────────────────────────────────────────
const S3_TEAM = "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos";

const CFI_CONTACTS = {
  speaking: {
    name: "Harini",
    role: "Producer",
    phone: "+91 96630 25036",
    email: "harini@eventsfirstgroup.com",
    photo: `${S3_TEAM}/Harini.jpg`,
  },
  sponsorship: [
    {
      name: "Kausar Noor",
      role: "Partnership Manager",
      phone: "+91 80734 00732",
      email: "kausar@eventsfirstgroup.com",
      photo: "/team/noor-kauser.jpg",
    },
    {
      name: "Mayur Methi",
      role: "Partnership Manager",
      phone: "+971 56 170 9909",
      email: "mayur@eventsfirstgroup.com",
      photo: `${S3_TEAM}/Mayur-Methi.png`,
    },
  ],
};

function ContactEnquiries() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#0A0E14", padding: "clamp(60px, 7vw, 90px) 0", position: "relative" }}>
      {/* Subtle background glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 50% 60% at 50% 50%, ${C}06, transparent 70%)` }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 14 }}>
            <div style={{ width: 40, height: 1, background: `linear-gradient(to right, transparent, ${C})` }} />
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: C_BRIGHT, margin: 0 }}>
              Get in Touch
            </p>
            <div style={{ width: 40, height: 1, background: `linear-gradient(to left, transparent, ${C})` }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 44px)", color: "white", margin: "0 0 12px", letterSpacing: "-1px" }}>
            Contact Us
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: 460, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Interested in speaking or sponsoring? Reach out to our team.
          </p>
        </motion.div>

        {/* Contact Grid */}
        <div
          className="cfi-contact-grid"
          style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, alignItems: "stretch" }}
        >
          {/* Speaking Enquiries — wider card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            style={{
              padding: "32px 36px",
              borderRadius: 16,
              background: "linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: `2px solid ${C}40`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle orange glow behind photo area */}
            <div style={{ position: "absolute", left: 40, top: "50%", transform: "translateY(-50%)", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, #E8651A15, transparent 70%)", pointerEvents: "none" }} />

            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C_BRIGHT, marginBottom: 24, position: "relative" }}>
              For Speaking Enquiries
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg, #E8651A, #C4541A)", padding: 3, flexShrink: 0, boxShadow: "0 4px 24px rgba(232,101,26,0.2)" }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={CFI_CONTACTS.speaking.photo} alt={CFI_CONTACTS.speaking.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "white", margin: "0 0 4px" }}>
                    {CFI_CONTACTS.speaking.name}
                  </h3>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "#E8651A", fontWeight: 500, margin: "0 0 16px" }}>
                    {CFI_CONTACTS.speaking.role}
                  </p>
                  {CFI_CONTACTS.speaking.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <a href={`https://wa.me/${CFI_CONTACTS.speaking.phone.replace(/[\s+]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.55)" }}>{CFI_CONTACTS.speaking.phone}</span>
                      </a>
                    </div>
                  )}
                  {CFI_CONTACTS.speaking.email && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      <a href={`mailto:${CFI_CONTACTS.speaking.email}`} style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
                        {CFI_CONTACTS.speaking.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {/* EFG Logo */}
              <div className="cfi-contact-logo" style={{ flexShrink: 0, opacity: 0.5 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/events-first-group_logo_alt.svg" alt="Events First Group" style={{ height: 56 }} />
              </div>
            </div>
          </motion.div>

          {/* Sponsorship Enquiries — narrower card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
            style={{
              padding: "32px 28px",
              borderRadius: 16,
              background: "linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: `2px solid ${C}40`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C_BRIGHT, marginBottom: 24 }}>
              For Sponsorship Enquiries
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {CFI_CONTACTS.sponsorship.map((person, i) => (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: EASE }}
                  className="cfi-contact-person"
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.25s ease" }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.1)" }}>
                    {person.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={person.photo} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)" }}>
                        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
                          {person.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "white", margin: "0 0 2px" }}>
                      {person.name}
                    </h4>
                    <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "0 0 4px" }}>
                      {person.role}
                    </p>
                    {person.phone && (
                      <a href={`https://wa.me/${person.phone.replace(/[\s+]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.55)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        {person.phone}
                      </a>
                    )}
                    <a href={`mailto:${person.email}`} style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: C_BRIGHT, textDecoration: "none" }}>
                      {person.email}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .cfi-contact-person:hover {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(1,187,245,0.15) !important;
          transform: translateX(4px);
        }
        @media (max-width: 768px) {
          .cfi-contact-grid { grid-template-columns: 1fr !important; }
          .cfi-contact-logo { display: none !important; }
        }
      `}</style>
    </section>
  );
}
