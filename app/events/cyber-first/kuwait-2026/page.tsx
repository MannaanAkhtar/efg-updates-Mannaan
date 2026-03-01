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
import EventNavigation from "@/components/ui/EventNavigation";

// ─── Constants ───────────────────────────────────────────────────────────────
const C = "#01BBF5";
const C_BRIGHT = "#4DD4FF";
const EASE = [0.16, 1, 0.3, 1] as const;
const WP = "https://cyberfirstseries.com/wp-content/uploads";
const S3 =
  "https://efg-final.s3.eu-north-1.amazonaws.com/speakers/cyber-first-kuwait";
const EVENT_DATE = new Date("2026-04-21T08:00:00+03:00");

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
const SPEAKERS = [
  {
    name: "Faissal Al-Roumi",
    title: "Executive Manager of Operational Risk",
    org: "Burgan Bank",
    photo: `${S3}/faissal-al-roumi-new.jpg`,
  },
  {
    name: "Dr. Fai Ben Salamah",
    title: "Cybersecurity Expert",
    org: "Kuwait Technical College",
    photo: `${S3}/dr-fai-ben-salamah-new.jpg`,
  },
  {
    name: "Shaheela Banu A. Majeed",
    title: "Information Security & Compliance Officer & Auditor",
    org: "Oil & Gas / Confidential",
    photo: `${S3}/shaheela-majeed-new.jpg`,
  },
  {
    name: "Yousef El-Kourdi",
    title: "Group Head of Information Technology",
    org: "City Group Co. KSC",
    photo: `${S3}/yousef-el-kourdi-new.jpg`,
  },
];

const GALLERY: {
  src: string;
  alt: string;
  area: string;
  rotate?: number;
  lift?: boolean;
}[] = [
  {
    src: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-28.jpg`,
    alt: "Delegates networking on the floor",
    area: "hero",
  },
  {
    src: `${WP}/2024/12/Speakers-and-Event-pictures-22.png`,
    alt: "Speaker on the main stage",
    area: "a",
    rotate: -1.5,
    lift: true,
  },
  {
    src: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-30.jpg`,
    alt: "Speaker addressing delegates",
    area: "b",
  },
  {
    src: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-29.jpg`,
    alt: "Panel session",
    area: "c",
    rotate: 1.2,
    lift: true,
  },
  {
    src: `${WP}/2024/12/Speakers-and-Event-pictures-25.png`,
    alt: "Executive networking",
    area: "d",
  },
  {
    src: `${WP}/2024/12/Speakers-and-Event-pictures-20.png`,
    alt: "Awards ceremony",
    area: "e",
  },
];

const FOCUS_AREAS = [
  {
    title: "Cyber Leadership & Governance",
    desc: "Elevating cybersecurity as a strategic business and national governance priority, strengthening regulatory alignment, executive accountability, and enterprise cyber risk frameworks.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    wide: true,
  },
  {
    title: "AI & Emerging Threat Landscape",
    desc: "Addressing how artificial intelligence is reshaping cyber threats and defence strategies while enabling secure adoption of AI-driven technologies across enterprise and government ecosystems.",
    icon: "M12 2a4 4 0 014 4v1a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2V6a4 4 0 014-4zM9 18h6M10 22h4",
  },
  {
    title: "OT & Critical Infrastructure Security",
    desc: "Strengthening protection of industrial control systems, utilities, energy infrastructure, and smart city platforms against targeted cyber attacks and operational disruptions.",
    icon: "M2 20h20M4 20V10l8-6 8 6v10M9 20v-4a3 3 0 016 0v4",
  },
  {
    title: "Banking & Financial Cyber Resilience",
    desc: "Enhancing resilience across digital banking, fintech innovation, fraud prevention, identity security, and regulatory compliance under evolving financial sector frameworks.",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    wide: true,
  },
  {
    title: "Data Protection, Privacy & Digital Trust",
    desc: "Advancing data sovereignty, regulatory compliance, privacy governance, and secure cross-border data management to build trusted digital ecosystems.",
    icon: "M12 1a3 3 0 00-3 3v4a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M5 21h14M8 21v-4M16 21v-4",
  },
  {
    title: "Threat Intelligence & Incident Response",
    desc: "Advancing proactive threat detection, intelligence sharing, and rapid incident response capabilities to minimize breach impact and accelerate recovery.",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  },
  {
    title: "Securing Digital Transformation",
    desc: "Ensuring cybersecurity resilience across smart infrastructure, cloud transformation, and emerging digital technologies aligned with Kuwait Vision 2035.",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    wide: true,
  },
  {
    title: "Regulatory Compliance & Risk Frameworks",
    desc: "Navigating Kuwait's evolving regulatory landscape including CBK's Cyber & Operational Resilience Framework (CORF), GCC mandates, and global standards.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4",
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

const SPONSORS = {
  gold: [
    { name: "Palo Alto Networks", logo: `${WP}/2025/02/paloalto-logo.png` },
    { name: "SentinelOne", logo: `${WP}/2025/02/snetinel-logo.png` },
    { name: "Google Cloud", logo: `${WP}/2025/02/google-logo1.png` },
    { name: "Kaspersky", logo: `${WP}/2025/02/kaspersky-logo.png` },
  ],
  associate: [
    { name: "Akamai", logo: `${WP}/2025/02/akamai-logo.png` },
    { name: "Secureworks", logo: `${WP}/2025/02/secureworks-logo-white.png` },
    { name: "Hackmanac", logo: null },
    { name: "ThreatLocker", logo: `${WP}/2025/02/threatlocker-white-logo.png` },
  ],
  strategic: [
    { name: "Sechard", logo: `${WP}/2025/02/sechard-logo.png` },
    { name: "Cyber Shield", logo: `${WP}/2025/02/cyber-shield-logo.png` },
    { name: "Wallix", logo: `${WP}/2025/02/wallix-logo1.png` },
    { name: "GBM", logo: `${WP}/2025/02/gbm-logo.png` },
    { name: "Acronis", logo: `${WP}/2025/02/acronis-white-logo.png` },
    { name: "Bitdefender", logo: `${WP}/2025/02/bitdefender-white-logo.png` },
    { name: "Sahara Net", logo: `${WP}/2025/02/sahara-net-logo.png` },
    { name: "Deepinfo", logo: `${WP}/2025/02/deepinfo-logo.png` },
  ],
  specialized: [
    { name: "Gorilla Technology", logo: `${WP}/2025/02/gorilla-logo1.png` },
    { name: "Cyber Talents", logo: null },
    { name: "GTB Technologies", logo: `${WP}/2025/02/GTB-long-logo-white.png` },
  ],
  supporting: [
    { name: "Kuwait College of Science & Technology", logo: null },
    { name: "Arab Open University", logo: null },
    { name: "German Business Council Kuwait", logo: null },
    { name: "ISACA UAE Chapter", logo: null },
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
  { name: "Banking & Financial Services", pct: 28 },
  { name: "Energy, Oil & Gas", pct: 22 },
  { name: "Government & Public Sector", pct: 18 },
  { name: "Telecom & Digital Infrastructure", pct: 12 },
  { name: "Critical Infrastructure & Utilities", pct: 8 },
  { name: "Healthcare & Essential Services", pct: 7 },
  { name: "Retail & Digital Economy", pct: 5 },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function CyberFirstKuwait2026() {
  return (
    <div style={{ background: "#050810" }}>
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
      <StatsBar />
      <Gallery />
      <MarketContext />
      <FocusAreas />
      <AgendaTimeline />
      <GrowthStory />
      <AtmosphereDivider />
      <Speakers />
      <SponsorsSection />
      <WhatToExpect />
      <WhoShouldAttend />
      <AdvisoryBoard />
      <AwardsSection />
      <SplitCTA />
      <ContactSection />
      <Venue />
      <Footer />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const cd = useCountdown(EVENT_DATE);

  return (
    <section
      className="cfk-hero-section"
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "#050810",
      }}
    >
      {/* ═══ LAYER 0: Full-bleed background image ═══ */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cyberfirstseries.com/wp-content/uploads/2024/12/Cyber-First-Series-Pictures-and-Sponsors-30.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.55) saturate(0.85)" }}
        />
      </div>

      {/* ═══ LAYER 1: Gradient overlays ═══ */}
      {/* Left-to-right: dark on left for text readability, lighter on right to show image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, rgba(5,8,16,0.92) 0%, rgba(5,8,16,0.75) 35%, rgba(5,8,16,0.35) 60%, rgba(5,8,16,0.15) 100%)`,
          zIndex: 1,
        }}
      />
      {/* Top + bottom fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(5,8,16,0.5) 0%, transparent 25%, transparent 70%, rgba(5,8,16,0.9) 100%)`,
          zIndex: 1,
        }}
      />

      {/* ═══ LAYER 2: Atmospheric effects ═══ */}
      <NeuralConstellation color={C} dotCount={30} connectionDistance={140} speed={0.2} opacity={0.06} />
      <DotMatrixGrid color={C} opacity={0.012} spacing={36} />

      {/* Cyber grid — faded across the section */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${C}04 1px, transparent 1px), linear-gradient(90deg, ${C}04 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.5,
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
      <div className="cfk-hero-content">
        <div
          style={{
            position: "relative",
            zIndex: 10,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 1320,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 80px)",
          }}
        >
          {/* Series eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 14,
            }}
          >
            Cyber First Series · Kuwait
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(38px, 5.5vw, 80px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#F0F2F5",
              margin: "0 0 20px",
              maxWidth: 700,
            }}
          >
            Building National
            <br />
            <span
              className="cfk-shimmer"
              style={{
                background: `linear-gradient(110deg, #fff 0%, #fff 30%, ${C_BRIGHT} 50%, #fff 70%, #fff 100%)`,
                backgroundSize: "250% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Cyber Resilience
            </span>
            <br />
            for a Digitally Sovereign Kuwait
          </motion.h1>

          {/* Separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
            style={{
              width: 48,
              height: 1,
              background: `${C}50`,
              marginBottom: 18,
              transformOrigin: "left",
            }}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(14px, 1.3vw, 17px)",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              maxWidth: 480,
              marginBottom: 24,
            }}
          >
            Kuwait&apos;s Premier Cybersecurity &amp; Operational Resilience Conference — convening government authorities, regulators, critical infrastructure leaders, CISOs, and global cybersecurity experts. Exclusive for C-Suite &amp; Director-Level Leaders.
          </motion.p>

          {/* Date & Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
            style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}
          >
            {[
              { icon: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z", text: "Tuesday, 21 April 2026" },
              { icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z", text: "Jumeirah Messilah Beach Hotel, Kuwait City" },
            ].map((m) => (
              <div key={m.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, flexShrink: 0 }}>
                  <path d={m.icon} />
                </svg>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.55)" }}>
                  {m.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <HeroCTA href="/contact" primary>Reserve Your Seat</HeroCTA>
            <HeroCTA href="/contact">Become a Sponsor</HeroCTA>
          </motion.div>
        </div>
      </div>

      {/* ═══ BOTTOM BAR: 3rd Annual badge + Countdown ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.3, ease: EASE }}
        className="absolute bottom-0 left-0 right-0"
        style={{
          zIndex: 20,
          background: "rgba(5,8,16,0.90)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: `1px solid ${C}25`,
          padding: "20px 0",
        }}
      >
        <div
          className="cfk-bottom-bar flex items-center justify-between"
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 80px)",
          }}
        >
          {/* Left: 3rd Annual badge */}
          <div className="cfk-bar-badge" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="relative flex h-3 w-3" style={{ flexShrink: 0 }}>
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-ping"
                style={{ background: C, opacity: 0.75 }}
              />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: C }} />
            </span>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: C,
              }}
            >
              3rd Annual
            </span>
            <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 6px" }}>|</span>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Cyber First Series
            </span>
          </div>

          {/* Center: Countdown */}
          <div className="cfk-bar-countdown" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[
              { v: cd.d, l: "Days" },
              { v: cd.h, l: "Hrs" },
              { v: cd.m, l: "Min" },
              { v: cd.s, l: "Sec" },
            ].map((u, i) => (
              <div key={u.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className="text-center">
                  <span
                    className="tabular-nums"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 32,
                      fontWeight: 800,
                      color: C_BRIGHT,
                      letterSpacing: "-1px",
                      lineHeight: 1,
                    }}
                  >
                    {String(u.v).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      color: "#606060",
                      display: "block",
                      marginTop: 4,
                    }}
                  >
                    {u.l}
                  </span>
                </div>
                {i < 3 && (
                  <span style={{ color: `${C}40`, fontSize: 24, fontWeight: 300, marginLeft: 6 }}>:</span>
                )}
              </div>
            ))}
          </div>

          {/* Right: CTA */}
          <Link
            href="#register"
            className="cfk-bar-cta transition-all hover:scale-105"
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
            }}
          >
            Register Now →
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
        }
        @media (max-width: 768px) {
          .cfk-hero-content > div {
            padding-top: 100px !important;
            padding-bottom: 80px !important;
          }
          .cfk-bottom-bar {
            flex-direction: column !important;
            gap: 16px !important;
            text-align: center;
          }
          .cfk-bar-badge { justify-content: center; }
          .cfk-bar-countdown { justify-content: center; }
          .cfk-bar-cta { width: 100%; text-align: center; padding: 16px 32px !important; justify-content: center; }
        }
      `}</style>
    </section>
  );
}

/** Hero CTA button */
function HeroCTA({
  children,
  href,
  primary,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2"
      style={{
        padding: primary ? "14px 34px" : "14px 28px",
        borderRadius: 50,
        background: primary
          ? hovered ? C_BRIGHT : C
          : hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
        color: primary ? "#050810" : "rgba(255,255,255,0.8)",
        fontFamily: "var(--font-outfit)",
        fontSize: 14,
        fontWeight: primary ? 700 : 500,
        textDecoration: "none",
        border: primary ? "none" : `1px solid rgba(255,255,255,0.15)`,
        boxShadow: primary
          ? hovered
            ? `0 8px 40px ${C}50, 0 0 50px ${C}20`
            : `0 4px 24px ${C}35`
          : "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span>{children}</span>
      {primary && (
        <span style={{ transition: "transform 0.3s", transform: hovered ? "translateX(3px)" : "translateX(0)" }}>→</span>
      )}
    </Link>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const items = [
    { n: 350, suffix: "+", label: "Delegates", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
    { n: 4, suffix: "+", label: "Speakers", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
    { n: 25, suffix: "", label: "Sponsors", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { n: 25, suffix: "", label: "Media Partners", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
    { n: 14, suffix: "", label: "Supporting Partners", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  ];
  return (
    <section
      ref={ref}
      style={{
        background: "#020508",
        borderTop: `1px solid ${C}15`,
        borderBottom: `1px solid ${C}15`,
        padding: "clamp(32px, 4vw, 48px) 0",
      }}
    >
      <div
        className="cfk-stats-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(20px,5vw,80px)",
          display: "grid",
          gridTemplateColumns: `repeat(${items.length}, 1fr)`,
          gap: 16,
        }}
      >
        {items.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
            style={{
              textAlign: "center",
              padding: "16px 12px",
              borderRadius: 14,
              background: `linear-gradient(145deg, ${C}08, rgba(255,255,255,0.02))`,
              border: `1px solid ${C}12`,
              position: "relative",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${C}15`,
                border: `1px solid ${C}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={s.icon} />
              </svg>
            </div>
            {/* Number */}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px,3.5vw,40px)",
                fontWeight: 900,
                color: C_BRIGHT,
                letterSpacing: "-1.5px",
                lineHeight: 1,
              }}
            >
              {inView ? <Counter to={s.n} suffix={s.suffix} /> : "0"}
            </div>
            {/* Label */}
            <div
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 600,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginTop: 8,
              }}
            >
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
      <style jsx global>{`
        @media (max-width: 900px) {
          .cfk-stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .cfk-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
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
        background: "#030810",
        padding: "clamp(64px,8vw,120px) 0",
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
            Moments captured from our conferences across the GCC.
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

// ─── Market Context ──────────────────────────────────────────────────────────
function MarketContext() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const stats = [
    { value: 1, suffix: "B+", unit: "USD", label: "Kuwait Cyber Market by 2030", note: "Exceeding USD 1 billion", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", badge: "Vision 2035" },
    { value: 11, suffix: "%", unit: "CAGR", label: "Market Growth Rate", note: "Strong double-digit expansion", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", badge: "By 2030" },
    { value: 25, suffix: "%", unit: "YoY", label: "Cyber Workforce Demand", note: "Annual growth through 2030", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75", badge: "+25%" },
    { value: 5, suffix: "M+", unit: "USD", label: "Average Breach Cost", note: "Critical sectors by 2030", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", badge: "Risk" },
  ];
  return (
    <section
      ref={ref}
      style={{
        background: "#020508",
        padding: "clamp(56px,7vw,100px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 60% at 50% 100%, ${C}06, transparent 70%)` }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${C}04 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative" }}>
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
            The Opportunity
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px,3.8vw,52px)",
              letterSpacing: "-2px",
              color: "white",
              lineHeight: 1.08,
              margin: "0 0 14px",
            }}
          >
            Kuwait&apos;s Cybersecurity Market Is Accelerating
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 15,
              color: "#484848",
              lineHeight: 1.65,
              maxWidth: 520,
              margin: 0,
            }}
          >
            Vision 2035 is driving an unprecedented wave of digital transformation — and
            with it, the imperative to secure every layer of the nation&apos;s critical infrastructure.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {stats.map((s, i) => (
            <MarketCard key={s.label} stat={s} delay={0.1 + i * 0.1} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketCard({
  stat,
  delay,
  inView,
}: {
  stat: { value: number; suffix: string; unit: string; label: string; note: string; icon?: string; badge?: string };
  delay: number;
  inView: boolean;
}) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  return (
    <Tilt max={7}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay, ease: EASE }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        style={{
          padding: "28px 24px 24px",
          borderRadius: 20,
          background: hovered ? `${C}08` : `linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
          border: `1px solid ${hovered ? `${C}30` : `${C}15`}`,
          position: "relative",
          overflow: "hidden",
          height: "100%",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Spotlight */}
        <div
          className="absolute pointer-events-none transition-opacity duration-500"
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C}12 0%, transparent 70%)`,
            left: `calc(${mousePos.x * 100}% - 100px)`,
            top: `calc(${mousePos.y * 100}% - 100px)`,
            opacity: hovered ? 1 : 0,
          }}
        />
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${C} 0%, ${C}50 70%, transparent 100%)`,
          }}
        />
        
        {/* Top row: Icon + Badge */}
        <div className="flex items-center justify-between" style={{ marginBottom: 16, position: "relative", zIndex: 1 }}>
          {stat.icon && (
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: `${C}15`,
              border: `1px solid ${C}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={stat.icon} />
              </svg>
            </div>
          )}
          {stat.badge && (
            <span style={{
              padding: "4px 10px",
              borderRadius: 20,
              background: `${C}20`,
              border: `1px solid ${C}30`,
              fontFamily: "var(--font-outfit)",
              fontSize: 9,
              fontWeight: 600,
              color: C_BRIGHT,
              letterSpacing: "0.5px",
            }}>
              {stat.badge}
            </span>
          )}
        </div>

        {/* Unit badge */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            fontFamily: "var(--font-outfit)",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "1.5px",
            color: `${C}60`,
            display: stat.badge ? "none" : "block",
          }}
        >
          {stat.unit}
        </div>

        {/* Number */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px,4vw,48px)",
            fontWeight: 900,
            color: C_BRIGHT,
            letterSpacing: "-2px",
            lineHeight: 1,
            marginBottom: 10,
            position: "relative",
          }}
        >
          {inView ? <Counter to={stat.value} suffix={stat.suffix} duration={1600} /> : `0${stat.suffix}`}
        </div>
        <div
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.45,
            marginBottom: 6,
            position: "relative",
          }}
        >
          {stat.label}
        </div>
        <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.35)", position: "relative" }}>
          {stat.note}
        </div>
        {/* Bottom accent line */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 24,
          right: 24,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C}40, transparent)`,
          borderRadius: 1,
        }} />
      </motion.div>
    </Tilt>
  );
}

// ─── Focus Areas ──────────────────────────────────────────────────────────────
function FocusAreas() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIdx, setActiveIdx] = useState(0);
  const active = FOCUS_AREAS[activeIdx];

  return (
    <section
      ref={ref}
      style={{
        background: "#030810",
        padding: "clamp(64px,8vw,120px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 50% 50% at 30% 40%, ${C}05, transparent 70%)` }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 40% 40% at 80% 60%, ${C}03, transparent 70%)` }}
      />
      {/* Dot matrix */}
      <DotMatrixGrid color={C} opacity={0.02} spacing={28} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px,4vw,60px)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
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
              What We Cover
            </span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px,3.8vw,48px)",
              letterSpacing: "-1.5px",
              color: "white",
              lineHeight: 1.08,
              margin: "16px 0 0",
            }}
          >
            8 Strategic Focus Areas
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: "#707070",
              maxWidth: 520,
              margin: "14px auto 0",
              lineHeight: 1.6,
            }}
          >
            Deep-dive sessions spanning the full spectrum of cybersecurity leadership challenges.
          </p>
        </motion.div>

        {/* Console: Card Grid Left + Detail Panel Right */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="cfk-focus-console"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          {/* Left: 3-col card grid */}
          <div
            className="cfk-focus-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              alignContent: "start",
            }}
          >
            {FOCUS_AREAS.map((area, i) => (
              <FocusCard
                key={area.title}
                area={area}
                index={i}
                isActive={i === activeIdx}
                onClick={() => setActiveIdx(i)}
                delay={i * 0.04}
                inView={inView}
              />
            ))}
          </div>

          {/* Right: Detail Panel */}
          <div
            className="cfk-focus-detail"
            style={{
              background: `${C}04`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${C}12`,
              borderRadius: 18,
              padding: "clamp(24px, 4vw, 40px) clamp(20px, 3vw, 36px)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: 320,
            }}
          >
            {/* Background glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: 350,
                height: 350,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(ellipse at center, ${C}08, transparent 70%)`,
                filter: "blur(40px)",
              }}
            />

            {/* Large faded number watermark */}
            <AnimatePresence mode="wait">
              <motion.span
                key={`wm-${activeIdx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="absolute pointer-events-none select-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(100px, 20vw, 200px)",
                  fontWeight: 900,
                  color: `${C}06`,
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  lineHeight: 1,
                }}
              >
                {String(activeIdx + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ position: "relative" }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${C}12`,
                    border: `1px solid ${C}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 22,
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={C_BRIGHT}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: `drop-shadow(0 0 6px ${C}60)` }}
                  >
                    <path d={active.icon} />
                  </svg>
                </div>

                {/* Track label */}
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: C_BRIGHT,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  Focus Area {String(activeIdx + 1).padStart(2, "0")}
                </span>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(22px, 2.5vw, 28px)",
                    fontWeight: 800,
                    color: "white",
                    margin: "10px 0 16px",
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                  }}
                >
                  {active.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 15,
                    fontWeight: 300,
                    color: "#909090",
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  {active.desc}
                </p>

                {/* Bottom accent bar */}
                <div
                  style={{
                    width: 40,
                    height: 3,
                    background: `linear-gradient(90deg, ${C_BRIGHT}, ${C}60)`,
                    borderRadius: 2,
                    marginTop: 28,
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .cfk-focus-console {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .cfk-focus-cards {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .cfk-focus-console {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .cfk-focus-cards {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
          }
          .cfk-focus-cards button {
            padding: 12px 10px !important;
          }
          .cfk-focus-cards button p {
            font-size: 11px !important;
          }
        }
      `}</style>
    </section>
  );
}

function FocusCard({
  area,
  index,
  isActive,
  onClick,
  delay,
  inView,
}: {
  area: (typeof FOCUS_AREAS)[number];
  index: number;
  isActive: boolean;
  onClick: () => void;
  delay: number;
  inView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 + delay, ease: EASE }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full text-left"
      style={{
        position: "relative",
        padding: "16px 14px",
        borderRadius: 14,
        background: isActive
          ? `${C}0A`
          : isHovered
            ? `${C}06`
            : "rgba(255,255,255,0.015)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: isActive
          ? `1px solid ${C}40`
          : isHovered
            ? `1px solid ${C}20`
            : "1px solid rgba(255,255,255,0.04)",
        cursor: "pointer",
        overflow: "hidden",
        transform: isActive ? "scale(1.03)" : isHovered ? "scale(1.01)" : "scale(1)",
        boxShadow: isActive ? `0 8px 32px rgba(0,0,0,0.25), 0 0 20px ${C}10` : "none",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Active left accent */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{
          width: 3,
          borderRadius: "3px 0 0 3px",
          background: C_BRIGHT,
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Active glow */}
      {isActive && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: 80,
            height: 60,
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            background: `radial-gradient(ellipse at left center, ${C}15, transparent 70%)`,
          }}
        />
      )}

      {/* Number */}
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 11,
          fontWeight: 700,
          color: isActive ? C_BRIGHT : `${C}40`,
          letterSpacing: "1px",
          position: "relative",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Title */}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 13,
          fontWeight: 600,
          color: isActive ? "white" : isHovered ? "#c0c0c0" : "#808080",
          margin: "6px 0 0",
          lineHeight: 1.35,
          transition: "color 0.2s",
          position: "relative",
        }}
      >
        {area.title}
      </p>
    </motion.button>
  );
}

// ─── Growth Story ─────────────────────────────────────────────────────────────
function GrowthStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ background: "#020508", padding: "clamp(56px,7vw,100px) 0" }}>
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
          src={`${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-28.jpg`}
          alt="Cyber First delegates"
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 30%", filter: "brightness(0.45) saturate(0.7)" }}
        />
      </motion.div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #030810 0%, transparent 20%, transparent 80%, #030810 100%)" }} />
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
              color: `${C}90`,
              marginBottom: 16,
            }}
          >
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
    <section ref={ref} style={{ background: "#030810", padding: "clamp(56px,7vw,100px) 0" }}>
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
              Kuwait&apos;s most senior cybersecurity and technology leaders
            </p>
          </div>
          <div style={{ padding: "10px 22px", borderRadius: 30, background: `${C}12`, border: `1px solid ${C}30` }}>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, color: C }}>
              More Speakers Coming Soon
            </span>
          </div>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {SPEAKERS.map((s, i) => (
            <SpeakerCard key={s.name} speaker={s} delay={0.025 * i} inView={inView} />
          ))}
        </div>
      </div>
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
  const [imgErr, setImgErr] = useState(false);
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
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          borderRadius: 20,
          overflow: "hidden",
          position: "relative",
          cursor: "default",
          boxShadow: hovered ? `0 0 0 1.5px ${C}50, 0 20px 60px rgba(1,187,245,0.12)` : "0 0 0 1px rgba(255,255,255,0.06)",
          transition: "box-shadow 0.4s ease",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "130%",
            background: "linear-gradient(160deg, #0e1a24, #080b10)",
            overflow: "hidden",
          }}
        >
          {speaker.photo && !imgErr ? (
            <Image
              src={speaker.photo}
              alt={speaker.name}
              fill
              sizes="240px"
              style={{
                objectFit: "cover",
                objectPosition: "center top",
                filter: hovered ? "grayscale(0%) brightness(1.05)" : "grayscale(15%) brightness(0.92)",
                transform: hovered ? "scale(1.04)" : "scale(1)",
                transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
              }}
              onError={() => setImgErr(true)}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(160deg, ${C}14, #0d0d0d)`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 38,
                  fontWeight: 900,
                  color: C,
                  opacity: 0.35,
                  letterSpacing: "-1px",
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
                "linear-gradient(to top, rgba(3,8,16,0.95) 0%, rgba(3,8,16,0.65) 35%, rgba(3,8,16,0.1) 65%, transparent 100%)",
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
                background: `${C}18`,
                border: `1px solid ${C}30`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 9,
                  fontWeight: 700,
                  color: C,
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

// ─── Sponsors ─────────────────────────────────────────────────────────────────
function SponsorsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      style={{
        background: "#020508",
        padding: "clamp(56px,7vw,100px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${C}03 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
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
            Sponsors & Partners
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: "0 0 12px",
            }}
          >
            Trusted by Industry Leaders
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 15,
              color: "#606060",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            25+ partners across cybersecurity, cloud, and enterprise technology.
          </p>
        </motion.div>

        {/* Gold */}
        <SponsorTier label="Gold Sponsors" items={SPONSORS.gold} size="lead" inView={inView} delay={0.2} />
        {/* Associate */}
        <SponsorTier label="Associate Sponsors" items={SPONSORS.associate} size="normal" inView={inView} delay={0.35} />
        {/* Strategic */}
        <SponsorTier label="Strategic Partners" items={SPONSORS.strategic} size="small" inView={inView} delay={0.5} />

        {/* Divider */}
        <div style={{ margin: "36px 0", height: 1, background: `linear-gradient(90deg, transparent, ${C}15, transparent)` }} />

        {/* Specialized */}
        <SponsorTier label="Specialized Partners" items={SPONSORS.specialized} size="small" inView={inView} delay={0.65} />

        {/* Divider */}
        <div style={{ margin: "36px 0", height: 1, background: `linear-gradient(90deg, transparent, ${C}15, transparent)` }} />

        {/* Supporting */}
        <SponsorTier label="Supporting Partners" items={SPONSORS.supporting} size="small" inView={inView} delay={0.8} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginTop: 40 }}
        >
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: 50,
              border: `1px solid ${C}30`,
              background: "transparent",
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 500,
              color: C,
              textDecoration: "none",
            }}
          >
            Become a Sponsor →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function SponsorTier({
  label,
  items,
  size,
  inView,
  delay,
}: {
  label: string;
  items: { name: string; logo: string | null }[];
  size: "lead" | "normal" | "small";
  inView: boolean;
  delay: number;
}) {
  const heights = { lead: 90, normal: 68, small: 52 };
  const logoH = { lead: 44, normal: 32, small: 24 };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{ marginTop: 28 }}
    >
      <p
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: C,
          marginBottom: 12,
          opacity: 0.7,
        }}
      >
        {label}
      </p>
      <div
        className={`cfk-sponsor-${size}`}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(items.length, size === "lead" ? 3 : size === "normal" ? 4 : 6)}, 1fr)`,
          gap: 10,
        }}
      >
        {items.map((s) => (
          <SponsorLogo key={s.name} sponsor={s} height={heights[size]} logoH={logoH[size]} />
        ))}
      </div>
    </motion.div>
  );
}

function SponsorLogo({
  sponsor,
  height,
  logoH,
}: {
  sponsor: { name: string; logo: string | null };
  height: number;
  logoH: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center justify-center transition-all"
      style={{
        minHeight: height,
        padding: "14px 18px",
        background: hovered ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.012)",
        border: hovered ? `1px solid ${C}18` : "1px solid rgba(255,255,255,0.04)",
        borderRadius: 14,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 28px rgba(0,0,0,0.3), 0 0 16px ${C}06` : "none",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {sponsor.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          style={{
            maxHeight: logoH,
            maxWidth: "85%",
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
            opacity: hovered ? 0.7 : 0.4,
            transition: "opacity 0.4s",
          }}
        />
      ) : (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "1.5px",
            color: hovered ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)",
            textTransform: "uppercase",
            textAlign: "center",
            transition: "color 0.4s",
          }}
        >
          {sponsor.name}
        </span>
      )}
    </div>
  );
}

// ─── What to Expect ──────────────────────────────────────────────────────────
function WhatToExpect() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const items = [
    {
      icon: "M12 3a9 9 0 110 18 9 9 0 010-18zm0 5a4 4 0 100 8 4 4 0 000-8zm0-3v2m0 14v2",
      title: "4 High-Impact Panel Discussions",
      desc: "National Cyber Resilience, AI-Driven Defense, OT/ICS Protection, and Data Privacy Governance.",
      image: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-28.jpg`,
    },
    {
      icon: "M2 3h20v14H2V3zm6 18h8m-8-4h8",
      title: "Live CTF / Hackathon",
      desc: "Teams compete in real-time capture-the-flag scenarios — tested against simulated threat environments.",
      image: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-29.jpg`,
    },
    {
      icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      title: "Cyber Excellence Awards",
      desc: "Recognising outstanding contributions to Kuwait's cybersecurity ecosystem across government and enterprise.",
      image: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-30.jpg`,
    },
    {
      icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
      title: "Executive Networking",
      desc: "Curated roundtables connecting CISOs and decision-makers across banking, oil & gas, government, and telecom.",
      image: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-28.jpg`,
    },
  ];
  return (
    <section ref={ref} style={{ background: "#030810", padding: "clamp(56px,7vw,100px) 0", position: "relative", overflow: "hidden" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 50% 60% at 30% 20%, ${C}04 0%, transparent 70%)` }}
      />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: 48 }}
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
            Programme
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
            What to Expect at 2026
          </h2>
        </motion.div>
        <div className="cfk-expect-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {items.map((it, i) => (
            <ExpectCard key={it.title} item={it} index={i} inView={inView} />
          ))}
        </div>
        <style jsx global>{`
          @media (max-width: 768px) {
            .cfk-expect-grid { grid-template-columns: 1fr !important; }
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
            alt=""
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
        background: "linear-gradient(180deg, #020a14 0%, #03101c 35%, #040e18 65%, #020810 100%)",
        padding: "clamp(56px,7vw,100px) 0",
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
            Draft agenda — subject to change.
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

      {/* Subtitle — clean text only, no icon box */}
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
  { label: "Government & Regulatory Authorities", icon: "M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11" },
  { label: "Chief Information Security Officers (CISOs)", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { label: "CIOs & IT Security Leaders", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" },
  { label: "Critical Infrastructure Operators", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { label: "Oil & Gas & Energy Security Leaders", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
  { label: "Banking & Financial Security Leaders", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
  { label: "Risk & Compliance Professionals", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Cybersecurity Technology Providers", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { label: "Security Operations Center (SOC) Directors", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { label: "AI & Emerging Technology Security Specialists", icon: "M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { label: "Cloud & Data Protection Experts", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
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
        background: "#030810",
        padding: "clamp(56px,7vw,100px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background event image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${WP}/2024/12/Speakers-and-Event-pictures-22.png`}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.07 }}
      />
      {/* Dark overlay on backdrop image */}
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

        {/* ── Split Layout: 55/45 ── */}
        <div className="cfk-attend-split" style={{ display: "grid", gridTemplateColumns: "55fr 45fr", gap: "48px 56px", alignItems: "start" }}>

          {/* ── LEFT: Roles (2-column grid, no card) ── */}
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
                {/* Icon */}
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

          {/* ── RIGHT: Industries + Photo stacked ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Industries block (cyan) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
              style={{
                padding: "28px 24px",
                borderRadius: 20,
                background: `linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%)`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 80% 20%, rgba(255,255,255,0.1), transparent 60%)" }} />

              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: 13,
                fontWeight: 700,
                color: "rgba(255,255,255,0.65)",
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
                      padding: "9px 12px",
                      borderRadius: 10,
                      background: hoveredInd === i ? "rgba(255,255,255,0.12)" : "transparent",
                      transition: "background 0.25s",
                      cursor: "default",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: hoveredInd === i ? 1 : 0.7, transition: "opacity 0.3s" }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 14,
                      fontWeight: hoveredInd === i ? 600 : 500,
                      color: hoveredInd === i ? "white" : "rgba(255,255,255,0.85)",
                      transition: "all 0.3s",
                    }}>
                      {ind.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stat line */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
              style={{ padding: "16px 24px" }}
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
        </div>
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
const ADVISORY_BOARD = [
  {
    name: "Faissal Al-Roumi",
    title: "Executive Manager of Operational Risk",
    org: "Burgan Bank",
    photo: `${S3}/faissal-al-roumi-new.jpg`,
  },
  {
    name: "Dr. Fai Ben Salamah",
    title: "Cybersecurity Expert",
    org: "Kuwait Technical College",
    photo: `${S3}/dr-fai-ben-salamah-new.jpg`,
  },
  {
    name: "Shaheela Banu A. Majeed",
    title: "Information Security & Compliance Officer & Auditor",
    org: "Oil & Gas / Confidential",
    photo: `${S3}/shaheela-majeed-new.jpg`,
  },
  {
    name: "Yousef El-Kourdi",
    title: "Group Head of Information Technology",
    org: "City Group Co. KSC",
    photo: `${S3}/yousef-el-kourdi-new.jpg`,
  },
];

function AdvisoryBoard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #020810 0%, #051018 100%)",
        padding: "clamp(56px, 7vw, 100px) 0",
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

        {/* Board Grid */}
        <div
          className="cfk-advisory-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
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
                background: `linear-gradient(145deg, ${C}08, rgba(255,255,255,0.02))`,
                border: `1px solid ${C}15`,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glow */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${C}08, transparent 70%)` }} />
              
              {/* Photo */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  margin: "0 auto 16px",
                  background: `linear-gradient(135deg, ${C}30, ${C}10)`,
                  border: `2px solid ${C}40`,
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 24, fontWeight: 600, color: C_BRIGHT }}>
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Info */}
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "white", margin: "0 0 4px", lineHeight: 1.3 }}>
                {member.name}
              </h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 4px", lineHeight: 1.4 }}>
                {member.title}
              </p>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 10, color: C_BRIGHT, margin: 0, fontWeight: 500 }}>
                {member.org}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile responsive */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .cfk-advisory-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .cfk-advisory-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    backgroundColor: focusedField === field ? "rgba(196,163,74,0.08)" : "rgba(10,20,40,0.5)",
    border: `1px solid ${focusedField === field ? `${GOLD}40` : "rgba(80,160,220,0.08)"}`,
    boxShadow: focusedField === field ? `0 0 16px ${GOLD}08` : "none",
    color: "white",
    fontFamily: "var(--font-outfit)",
    fontSize: 14,
    fontWeight: 400,
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
  });

  return (
    <section
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #020810 0%, #041220 30%, #051828 50%, #041220 70%, #020810 100%)",
        padding: "clamp(56px,7vw,100px) 0",
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

          {/* LEFT: About Awards — glass card */}
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

        {/* ── 3. Nominations & Eligibility (Split Row) — with event photo backdrop ── */}
        <div style={{ position: "relative", borderRadius: 20, overflow: "hidden" }}>
          {/* Event photo backdrop */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-28.jpg`}
            alt=""
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

          {/* RIGHT: Nomination Form — glass card */}
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
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle("email")}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle("phone")}
                    />
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
                  />

                  <button
                    type="submit"
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
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 12px 32px rgba(196,163,74,0.25)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Submit Nomination
                  </button>
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

// ─── Split CTA ────────────────────────────────────────────────────────────────
function SplitCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const cd = useCountdown(EVENT_DATE);

  const EFG_ORANGE = "#E8651A";

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(72px,9vw,140px) 0",
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://cyberfirstseries.com/wp-content/uploads/2024/12/Cyber-First-Series-Pictures-and-Sponsors-28.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.15) saturate(0.6)" }}
        />
      </div>
      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #030810 0%, transparent 20%, transparent 80%, #030810 100%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${C}06, transparent 70%)` }}
      />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px,4vw,60px)", position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
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
              Join Us
            </span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px,4vw,52px)",
              letterSpacing: "-1.5px",
              color: "white",
              lineHeight: 1.08,
              margin: "12px 0 0",
            }}
          >
            Be Part of Cyber First Kuwait
          </h2>
        </motion.div>

        {/* Asymmetric cards: 60/40 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="cfk-split-cta"
          style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, alignItems: "stretch" }}
        >
          {/* Register card (larger) */}
          <div
            style={{
              padding: "clamp(28px,3.5vw,48px)",
              borderRadius: 22,
              background: "linear-gradient(135deg, rgba(232,101,26,0.12), rgba(232,101,26,0.03))",
              border: "1px solid rgba(232,101,26,0.2)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${EFG_ORANGE}, ${EFG_ORANGE}60, transparent)` }} />

            {/* Ambient glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: 300,
                height: 300,
                bottom: -80,
                right: -60,
                background: `radial-gradient(ellipse at center, rgba(232,101,26,0.08), transparent 70%)`,
                filter: "blur(40px)",
              }}
            />

            <div style={{ position: "relative" }}>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: EFG_ORANGE,
                }}
              >
                For Delegates
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(22px,2.8vw,36px)",
                  letterSpacing: "-1.5px",
                  color: "white",
                  lineHeight: 1.1,
                  margin: "14px 0 12px",
                }}
              >
                Register for Cyber First<br />Kuwait 2026
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.65,
                  margin: "0 0 24px",
                  maxWidth: 420,
                }}
              >
                Join 350+ CISOs, government security leaders, and technology experts. 21 April at Jumeirah Messilah Beach Hotel, Kuwait.
              </p>

              {/* Countdown */}
              <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
                {[
                  { val: cd.d, label: "Days" },
                  { val: cd.h, label: "Hrs" },
                  { val: cd.m, label: "Min" },
                  { val: cd.s, label: "Sec" },
                ].map((u) => (
                  <div
                    key={u.label}
                    style={{
                      textAlign: "center",
                      background: "rgba(232,101,26,0.08)",
                      border: "1px solid rgba(232,101,26,0.15)",
                      borderRadius: 12,
                      padding: "10px 14px",
                      minWidth: 56,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 22,
                        fontWeight: 800,
                        color: "white",
                        lineHeight: 1,
                      }}
                    >
                      {String(u.val).padStart(2, "0")}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 9,
                        fontWeight: 600,
                        color: "rgba(232,101,26,0.7)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginTop: 4,
                      }}
                    >
                      {u.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              className="cfk-cta-register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                alignSelf: "flex-start",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 50,
                background: EFG_ORANGE,
                color: "white",
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 4px 28px rgba(232,101,26,0.35)",
                transition: "all 0.3s ease",
              }}
            >
              Register Now →
            </Link>
          </div>

          {/* Sponsor card (smaller) */}
          <div
            style={{
              padding: "clamp(28px,3.5vw,48px)",
              borderRadius: 22,
              background: `linear-gradient(135deg, ${C}0A, ${C}03)`,
              border: `1px solid ${C}20`,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${C}, ${C}60, transparent)` }} />

            {/* Ambient glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: 250,
                height: 250,
                bottom: -60,
                right: -40,
                background: `radial-gradient(ellipse at center, ${C}08, transparent 70%)`,
                filter: "blur(40px)",
              }}
            />

            <div style={{ position: "relative" }}>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: C,
                }}
              >
                For Brands & Vendors
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(20px,2.2vw,30px)",
                  letterSpacing: "-1px",
                  color: "white",
                  lineHeight: 1.15,
                  margin: "14px 0 12px",
                }}
              >
                Sponsor or Partner This Edition
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.65,
                  margin: "0 0 24px",
                }}
              >
                Access 350+ decision-makers across banking, oil & gas, government, and telecom.
              </p>

              {/* Trust stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {[
                  { num: "350+", label: "Senior Delegates" },
                  { num: "25+", label: "Industry Speakers" },
                  { num: "22+", label: "Sponsors & Partners" },
                ].map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 18,
                        fontWeight: 800,
                        color: C_BRIGHT,
                        minWidth: 48,
                      }}
                    >
                      {s.num}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 12,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              className="cfk-cta-sponsor"
              style={{
                display: "inline-flex",
                alignItems: "center",
                alignSelf: "flex-start",
                gap: 8,
                padding: "13px 28px",
                borderRadius: 50,
                background: "transparent",
                color: C,
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                border: `1px solid ${C}50`,
                transition: "all 0.3s ease",
              }}
            >
              Explore Partnerships →
            </Link>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .cfk-cta-register:hover {
          box-shadow: 0 8px 40px rgba(232,101,26,0.5) !important;
          transform: translateY(-2px);
        }
        .cfk-cta-sponsor:hover {
          background: rgba(1,187,245,0.08) !important;
          border-color: rgba(1,187,245,0.5) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .cfk-split-cta {
            grid-template-columns: 1fr !important;
          }
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
    phone: "+971 50 500 3341",
    email: "harini@eventsfirstgroup.com",
    photo: `${S3_TEAM}/Harini.jpg`,
  },
  sponsorship: [
    {
      name: "Mohammed Hassan",
      role: "Partnership Manager",
      phone: "+971 56 398 6565",
      email: "hassan@eventsfirstgroup.com",
      photo: null,
    },
    {
      name: "Danish",
      role: "Partnership Manager",
      phone: "+971 50 987 6543",
      email: "danish@eventsfirstgroup.com",
      photo: `${S3_TEAM}/Danish.jpg`,
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
        background: "linear-gradient(180deg, #020810 0%, #051220 100%)",
        padding: "clamp(48px, 6vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C_BRIGHT }}>
              Get in Touch
            </span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: "16px 0 0" }}>
            Contact Us
          </h2>
        </motion.div>

        {/* Contact Grid */}
        <div
          className="cfk-contact-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          {/* Speaking Enquiries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            style={{
              padding: "32px",
              borderRadius: 20,
              background: `linear-gradient(145deg, ${C}08, rgba(255,255,255,0.02))`,
              border: `1px solid ${C}20`,
            }}
          >
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: C_BRIGHT, marginBottom: 20 }}>
              For Speaking Enquiries
            </p>
            <div className="flex items-center gap-4">
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C}30, ${C}10)`,
                  border: `2px solid ${C}40`,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {CFK_CONTACTS.speaking.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={CFK_CONTACTS.speaking.photo} alt={CFK_CONTACTS.speaking.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", margin: "0 0 2px" }}>
                  {CFK_CONTACTS.speaking.name}
                </h3>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 8px" }}>
                  {CFK_CONTACTS.speaking.role}
                </p>
                <a href={`mailto:${CFK_CONTACTS.speaking.email}`} style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: C_BRIGHT, textDecoration: "none" }}>
                  {CFK_CONTACTS.speaking.email}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Sponsorship Enquiries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            style={{
              padding: "32px",
              borderRadius: 20,
              background: `linear-gradient(145deg, ${C}08, rgba(255,255,255,0.02))`,
              border: `1px solid ${C}20`,
            }}
          >
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: C_BRIGHT, marginBottom: 20 }}>
              For Sponsorship Enquiries
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {CFK_CONTACTS.sponsorship.map((person) => (
                <div key={person.name} className="flex items-center gap-3">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${C}30, ${C}10)`,
                      border: `1px solid ${C}30`,
                      overflow: "hidden",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {person.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 600, color: C_BRIGHT }}>
                        {person.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "var(--font-outfit)", fontWeight: 600, fontSize: 14, color: "white", margin: 0 }}>
                      {person.name}
                    </h4>
                    <a href={`mailto:${person.email}`} style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                      {person.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .cfk-contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
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
    { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Date", value: "Tuesday, 21 April 2026" },
    { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Time", value: "8:00 AM — 5:00 PM (GST+3)" },
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
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85"
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

        {/* Venue name overlaid at bottom of photo — well above the overlap zone */}
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

      {/* ── Floating glassmorphic info card — overlaps the photo ── */}
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
                Kuwait&apos;s premier beachfront conference destination — hosting the region&apos;s
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
