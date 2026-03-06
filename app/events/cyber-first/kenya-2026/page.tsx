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
import { submitForm } from "@/lib/form-helpers";
import type { FormType } from "@/lib/form-helpers";

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = "#01BBF5";
const C_BRIGHT = "#4DD4FF";
const C_DIM = "#0199C7";
const EASE = [0.16, 1, 0.3, 1] as const;

// Kenya-specific accent (warm terracotta/savannah)
const KENYA_ACCENT = "#E07A3D";
const KENYA_GOLD = "#D4A84B";

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const S3_LOGOS = `${S3}/sponsors-logo`;
const WP = "https://cyberfirstseries.com/wp-content/uploads";

// Event date - June 2026
const EVENT_DATE = new Date("2026-06-18T08:00:00+03:00");

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
  { value: "29.9", prefix: "KES ", suffix: "B", label: "Cybercrime Losses", note: "Economic impact in 2025", highlight: true },
  { value: "247", suffix: "%", label: "Annual Threat Increase", note: "Cybersecurity incidents in 2025" },
  { value: "96", suffix: "%", label: "Talent Shortage", note: "Only 1,700 of 40,000 experts needed" },
  { value: "842", suffix: "M", label: "Threats Detected", note: "Q3 2025 alone" },
];

const FOCUS_AREAS = [
  {
    title: "Critical Infrastructure Security",
    desc: "Safeguarding national critical infrastructure and neutralizing advanced persistent threats targeting Kenya's digital backbone.",
    icon: "M2 20h20M4 20V10l8-6 8 6v10M9 20v-4a3 3 0 016 0v4",
    wide: true,
  },
  {
    title: "AI & Next-Gen Threat Intelligence",
    desc: "Integrating artificial intelligence and next-generation threat intelligence to combat the rise of 'Algorithmic Warfare' and AI-driven attacks.",
    icon: "M12 2a4 4 0 014 4v1a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2V6a4 4 0 014-4zM9 18h6M10 22h4",
  },
  {
    title: "Regulatory Governance & Compliance",
    desc: "Navigating the Computer Misuse and Cybercrimes (Amendment) Act 2025, CSOC operationalization, and evolving data privacy frameworks.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4",
  },
  {
    title: "Financial Sector Cyber Resilience",
    desc: "Protecting Kenya's mobile money ecosystem, digital banking infrastructure, and fintech innovations from sophisticated cyber threats.",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    wide: true,
  },
  {
    title: "Cloud & Digital Transformation",
    desc: "Securing Kenya's position as a strategic gateway for regional cloud infrastructure and protecting the Silicon Savannah's digital economy.",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
  },
  {
    title: "Public-Private Collaboration",
    desc: "Building intelligence synergy between government, regulators, and industry to protect national sovereignty and ensure sustained economic growth.",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  },
];

const AGENDA = [
  { time: "08:00 – 09:00", title: "Registration & Networking Breakfast", type: "break" as const },
  { time: "09:00 – 09:20", title: "Opening Keynote", subtitle: "The State of Kenya's Cyber Economy: Navigating the KSh 30 Billion Crisis and Strategic Resilience", type: "keynote" as const },
  { time: "09:20 – 10:10", title: "Panel 1: Critical Infrastructure Security", subtitle: "Safeguarding National Critical Infrastructure & Neutralizing Advanced Threats", type: "panel" as const },
  { time: "10:10 – 10:30", title: "Fireside Chat", subtitle: "Regulatory Governance, Data Privacy & Policy Synchronization", type: "fireside" as const },
  { time: "10:30 – 10:50", title: "Coffee & Networking Break", type: "break" as const },
  { time: "10:50 – 11:35", title: "Panel 2: AI & Threat Intelligence", subtitle: "Integrating AI & Next-Generation Threat Intelligence for Proactive Defense", type: "panel" as const },
  { time: "11:35 – 12:00", title: "Customer Success Story", subtitle: "Enterprise Case Study: From Breach to Resilience", type: "fireside" as const },
  { time: "12:00 – 12:15", title: "Sponsor Presentation", type: "sponsor" as const },
  { time: "12:15 – 12:30", title: "Cyber First Awards Kenya", type: "awards" as const },
  { time: "12:30", title: "Closing Remarks & Networking Lunch", type: "closing" as const },
];

const AWARDS_DATA = [
  { title: "Cybersecurity Visionary of the Year", desc: "Recognizing exceptional strategic vision in advancing Kenya's cybersecurity posture.", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  { title: "Critical Infrastructure Defender", desc: "Outstanding efforts in protecting Kenya's critical national infrastructure from cyber threats.", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { title: "AI & Innovation Leadership", desc: "Pioneering the secure adoption of AI and emerging technologies across enterprise Kenya.", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
  { title: "Financial Sector Cyber Resilience", desc: "Excellence in securing mobile money ecosystems and digital banking infrastructure.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { title: "Digital Trust & Data Governance", desc: "Leadership in data protection, privacy standards, and building trusted digital ecosystems.", icon: "M12 1a3 3 0 00-3 3v4a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M5 21h14M8 21v-4M16 21v-4" },
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
  { threat: "Security Advisories", stat: "19.95M", note: "Issued in Q3 2025 (+15.5%)" },
];

// Kenya Advisory Board (placeholder)
const ADVISORY_BOARD = [
  {
    name: "Dr. Katherine Getao",
    title: "Former ICT Secretary",
    org: "Government of Kenya",
    photo: null,
  },
  {
    name: "James Kinyua",
    title: "Head of Cybersecurity",
    org: "Kenya Bankers Association",
    photo: null,
  },
  {
    name: "Grace Wanjiku",
    title: "Chief Information Security Officer",
    org: "Safaricom PLC",
    photo: null,
  },
  {
    name: "Dr. David Mwangi",
    title: "Director of Cyber Operations",
    org: "Communications Authority of Kenya",
    photo: null,
  },
];

// Kenya Speakers (placeholder)
const SPEAKERS = [
  {
    name: "Dr. Moses Kemibaro",
    title: "Chief Digital Strategist",
    org: "iHub Kenya",
    photo: null,
  },
  {
    name: "Angela Ndambuki",
    title: "Group CISO",
    org: "Equity Group Holdings",
    photo: null,
  },
  {
    name: "Peter Ndegwa",
    title: "CEO (Cybersecurity Champion)",
    org: "Safaricom PLC",
    photo: null,
  },
  {
    name: "Dr. Bitange Ndemo",
    title: "Former PS ICT",
    org: "University of Nairobi",
    photo: null,
  },
  {
    name: "Nancy Matimu",
    title: "Managing Director",
    org: "Microsoft East Africa",
    photo: null,
  },
  {
    name: "Samuel Okoth",
    title: "Regional Security Lead",
    org: "Google Cloud Africa",
    photo: null,
  },
];

// Gallery images (reusing Cyber First generic images)
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

// Kenya Growth Projections (1st edition)
const GROWTH = [
  {
    year: 2026,
    delegates: 300,
    speakers: 25,
    sponsors: 20,
    media: 15,
    extra: "Inaugural Edition · 4 Panel Discussions · Awards",
    active: true,
  },
  {
    year: 2027,
    delegates: 400,
    speakers: 30,
    sponsors: 25,
    media: 20,
    extra: "Projected · Live Hackathon · Expanded Tracks",
    projected: true,
  },
  {
    year: 2028,
    delegates: 500,
    speakers: 35,
    sponsors: 30,
    media: 25,
    extra: "Projected · Regional Summit · 2-Day Format",
    projected: true,
  },
];

// Sponsor tiers for Kenya
const SPONSOR_TIERS: {
  tier: string;
  slots: number;
  color: string;
  sponsors?: { name: string; logo: string | null }[];
}[] = [
  { tier: "Gold Partner", slots: 1, color: KENYA_GOLD, sponsors: [] },
  { tier: "Associate Partners", slots: 2, color: C_BRIGHT, sponsors: [] },
  { tier: "Panel Partners", slots: 3, color: "#9D4EDD", sponsors: [] },
  { tier: "Strategic Partners", slots: 4, color: "#808080", sponsors: [] },
];

// Past sponsors for credibility
const PAST_SPONSORS = [
  { name: "Palo Alto Networks", logo: `${S3_LOGOS}/paloalto.png` },
  { name: "SentinelOne", logo: `${S3_LOGOS}/sentinelone.png` },
  { name: "Google Cloud", logo: `${S3_LOGOS}/Google-Cloud-Security.png` },
  { name: "Kaspersky", logo: `${S3_LOGOS}/kaspersky.png` },
  { name: "Akamai", logo: `${S3_LOGOS}/Akamai.png` },
  { name: "Secureworks", logo: `${S3_LOGOS}/secureworks.png` },
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
      photo: null,
    },
  ],
};

// ─── PAGE COMPONENT ──────────────────────────────────────────────────────────
export default function CyberFirstKenya2026() {
  return (
    <div style={{ background: "#050810" }}>
      <style jsx global>{`
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
      <RegistrationSection />
      <Footer />
    </div>
  );
}

// ─── HERO SECTION ────────────────────────────────────────────────────────────
function HeroSection() {
  const cd = useCountdown(EVENT_DATE);

  return (
    <section className="cfk-hero" style={{ position: "relative", height: "100vh", minHeight: 700, overflow: "hidden", background: "#050810" }}>
      {/* Nairobi Skyline Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=1600&q=80"
          alt="Nairobi Skyline"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.35) saturate(0.9)" }}
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(90deg, rgba(5,8,16,0.95) 0%, rgba(5,8,16,0.7) 40%, rgba(5,8,16,0.4) 70%, rgba(5,8,16,0.3) 100%)`, zIndex: 1 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, rgba(5,8,16,0.5) 0%, transparent 30%, transparent 70%, rgba(5,8,16,0.95) 100%)`, zIndex: 1 }} />

      {/* Subtle Kenya accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 80% 70%, ${KENYA_ACCENT}15, transparent 70%)`, zIndex: 2 }} />

      {/* Cyber effects */}
      <NeuralConstellation color={C} dotCount={25} connectionDistance={120} speed={0.15} opacity={0.05} />
      <DotMatrixGrid color={C} opacity={0.01} spacing={40} />

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${C}03 1px, transparent 1px), linear-gradient(90deg, ${C}03 1px, transparent 1px)`, backgroundSize: "50px 50px", opacity: 0.5, zIndex: 2 }} />

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

      {/* Content */}
      <div className="cfk-hero-content" style={{ position: "relative", zIndex: 10, height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 1320, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        
        {/* Silicon Savannah Badge */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", alignSelf: "flex-start", gap: 10, padding: "8px 16px", borderRadius: 30, background: `linear-gradient(135deg, ${C}15, ${KENYA_ACCENT}10)`, border: `1px solid ${C}30`, marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C_BRIGHT }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: C_BRIGHT }}>
            1st Edition · June 2026 · The Silicon Savannah
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
            Radisson Blu Hotel, Nairobi, Kenya
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8, ease: EASE }} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 34px", borderRadius: 50, background: C, color: "#050810", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: `0 4px 24px ${C}35` }}>
            Reserve Your Seat <span>→</span>
          </Link>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 50, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
            Become a Sponsor
          </Link>
        </motion.div>
      </div>

      {/* Bottom Countdown Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.2, ease: EASE }} className="absolute bottom-0 left-0 right-0" style={{ zIndex: 20, background: "rgba(5,8,16,0.92)", backdropFilter: "blur(16px)", borderTop: `1px solid ${C}20`, padding: "18px 0" }}>
        <div className="cfk-bottom-bar flex items-center justify-between flex-wrap gap-4" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ background: KENYA_ACCENT, opacity: 0.75 }} />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: KENYA_ACCENT }} />
            </span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: KENYA_ACCENT }}>1st Edition</span>
            <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 4px" }}>|</span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>Cyber First Kenya</span>
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

          <Link href="#register" style={{ padding: "12px 28px", borderRadius: 50, background: C, fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, color: "white", textDecoration: "none", boxShadow: `0 4px 16px ${C}35` }}>
            Register Now →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ─── STATS BAR ───────────────────────────────────────────────────────────────
function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const items = [
    { n: 300, suffix: "+", label: "Delegates", desc: "C-Suite & Directors", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75", highlight: true },
    { n: 25, suffix: "+", label: "Speakers", desc: "Industry Leaders", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
    { n: 20, suffix: "+", label: "Sponsors", desc: "Technology Partners", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { n: 1, suffix: "", label: "Day", desc: "Intensive Summit", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  ];

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(60px, 8vw, 100px) 0", overflow: "hidden" }}>
      {/* African tech aesthetic background */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80" alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.15) saturate(0.6) sepia(0.1)" }} />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, rgba(5,8,16,0.9) 0%, rgba(5,8,16,0.6) 50%, rgba(5,8,16,0.95) 100%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${C}08, transparent 70%)` }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,5vw,60px)", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: KENYA_ACCENT }}>Summit Overview</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 48px)", letterSpacing: "-2px", color: "white", lineHeight: 1.1, margin: "14px 0 0", maxWidth: 500 }}>
            Securing the<br /><span style={{ color: C_BRIGHT }}>Silicon Savannah.</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} className="cfk-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {items.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }} style={{ padding: s.highlight ? "28px 20px" : "24px 16px", borderRadius: 18, background: s.highlight ? `linear-gradient(145deg, ${C}18 0%, ${KENYA_ACCENT}08 100%)` : "rgba(255,255,255,0.03)", border: `1px solid ${s.highlight ? `${C}35` : "rgba(255,255,255,0.06)"}` }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 14, position: "relative" }}>
                <div style={{
                  width: s.highlight ? 44 : 36,
                  height: s.highlight ? 44 : 36,
                  borderRadius: 12,
                  background: s.highlight ? `${C}25` : "rgba(255,255,255,0.06)",
                  border: `1px solid ${s.highlight ? `${C}50` : "rgba(255,255,255,0.1)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width={s.highlight ? 22 : 18} height={s.highlight ? 22 : 18} viewBox="0 0 24 24" fill="none" stroke={s.highlight ? C_BRIGHT : "rgba(255,255,255,0.5)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon} />
                  </svg>
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: s.highlight ? "clamp(38px,5vw,48px)" : "clamp(30px,4vw,38px)", fontWeight: 900, color: "white", letterSpacing: "-2px", lineHeight: 1 }}>
                {inView ? <Counter to={s.n} suffix={s.suffix} /> : "0"}
              </div>
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 8 }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── SILICON SAVANNAH CONTEXT ────────────────────────────────────────────────
function SiliconSavannahContext() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ background: "#080A0F", padding: "clamp(80px, 10vw, 120px) 0", position: "relative" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 50% at 20% 50%, ${KENYA_ACCENT}08, transparent 70%)` }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <div className="cfk-market-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          
          {/* Left: Narrative */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
            <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
              <span style={{ width: 30, height: 1, background: KENYA_ACCENT }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: KENYA_ACCENT }}>Why Now</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: "0 0 20px" }}>
              Africa&apos;s Digital Powerhouse<br />Under Siege
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 20 }}>
              Kenya has solidified its position as a digital powerhouse in Africa, with rapid innovations driving unprecedented economic inclusion. However, this growth has expanded the national attack surface, leading to a surge in sophisticated threats.
            </p>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 24 }}>
              The rise of <strong style={{ color: C_BRIGHT }}>Agentic AI and Deepfakes</strong> has introduced a new era of &apos;Algorithmic Warfare&apos; that legacy systems are ill-equipped to handle. 2026 is the pivotal year where cybersecurity transitions from a side project to <strong style={{ color: KENYA_ACCENT }}>core infrastructure</strong> for Africa&apos;s digital economy.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Cybercrimes Act 2025", "CSOC Operations", "Mobile Money Security", "Regional Cloud Hub"].map((tag) => (
                <span key={tag} style={{ padding: "6px 14px", borderRadius: 20, background: `${KENYA_ACCENT}12`, border: `1px solid ${KENYA_ACCENT}25`, fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: KENYA_ACCENT }}>{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* Right: Stats */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {MARKET_STATS.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE }} style={{ padding: 22, borderRadius: 14, background: stat.highlight ? `linear-gradient(145deg, ${C}12 0%, ${KENYA_ACCENT}06 100%)` : "rgba(255,255,255,0.025)", border: `1px solid ${stat.highlight ? `${C}25` : "rgba(255,255,255,0.05)"}` }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: stat.highlight ? 30 : 26, fontWeight: 800, color: stat.highlight ? C_BRIGHT : "white", letterSpacing: "-1px" }}>
                  {stat.prefix}{stat.value}<span style={{ fontSize: "0.7em" }}>{stat.suffix}</span>
                </div>
                <div style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>{stat.label}</div>
                <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{stat.note}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── THREAT LANDSCAPE ────────────────────────────────────────────────────────
function ThreatLandscape() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#050810", padding: "clamp(60px, 8vw, 100px) 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: "#EF4444" }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#EF4444" }}>Threat Intelligence</span>
            <span style={{ width: 30, height: 1, background: "#EF4444" }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 40px)", letterSpacing: "-1px", color: "white", lineHeight: 1.1, margin: 0 }}>
            Kenya&apos;s Cyber Threat Landscape
          </h2>
        </motion.div>

        <div className="cfk-threats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {KEY_THREATS.map((item, i) => (
            <motion.div key={item.threat} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }} style={{ padding: 20, borderRadius: 12, background: "rgba(239, 68, 68, 0.04)", border: "1px solid rgba(239, 68, 68, 0.12)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#EF4444", letterSpacing: "-0.5px" }}>{item.stat}</div>
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: "white", marginTop: 8 }}>{item.threat}</div>
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{item.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOCUS AREAS ─────────────────────────────────────────────────────────────
function FocusAreas() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#080A0F", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>Conference Tracks</span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: 0 }}>
            Strategic Focus Areas
          </h2>
        </motion.div>

        <div className="cfk-focus-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {FOCUS_AREAS.map((area, i) => (
            <motion.div key={area.title} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }} style={{ gridColumn: area.wide ? "span 2" : "span 1", padding: 28, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.4s ease" }} className="cfk-focus-card" onMouseEnter={(e) => { e.currentTarget.style.background = `${C}08`; e.currentTarget.style.borderColor = `${C}20`; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C}12`, border: `1px solid ${C}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={area.icon} /></svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "white", margin: "0 0 8px" }}>{area.title}</h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{area.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
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
        background: "linear-gradient(180deg, #020810 0%, #051018 100%)",
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
    <section ref={ref} style={{ background: "#030810", padding: "clamp(40px,5vw,72px) 0" }}>
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

  return (
    <section ref={ref} style={{ background: "#080A0F", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>Agenda</span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: 0 }}>
            The Day&apos;s Programme
          </h2>
        </motion.div>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, transparent, ${C}30, ${KENYA_ACCENT}30, transparent)` }} />
          {AGENDA.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }} style={{ display: "flex", gap: 24, marginBottom: 20, paddingLeft: 24, position: "relative" }}>
              <div style={{ position: "absolute", left: -4, top: 8, width: 10, height: 10, borderRadius: "50%", background: typeColors[item.type] || C, boxShadow: `0 0 10px ${typeColors[item.type] || C}40` }} />
              <div style={{ minWidth: 90, fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>{item.time}</div>
              <div style={{ flex: 1, padding: 18, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: item.subtitle ? 6 : 0 }}>
                  <span style={{ padding: "3px 8px", borderRadius: 4, background: `${typeColors[item.type]}18`, fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 600, color: typeColors[item.type], textTransform: "uppercase" }}>{item.type}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "white" }}>{item.title}</span>
                </div>
                {item.subtitle && <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>{item.subtitle}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SPONSORS SECTION ────────────────────────────────────────────────────────
function SponsorsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="partners"
      style={{
        background: "#020508",
        padding: "clamp(40px,5vw,72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${KENYA_ACCENT}03 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: KENYA_ACCENT }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: KENYA_ACCENT }}>
              Partners
            </span>
            <span style={{ width: 30, height: 1, background: KENYA_ACCENT }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-1.5px", color: "var(--white)", lineHeight: 1.1, margin: "16px 0 0" }}>
            Founding Partners
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.5)", marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>
            Join East Africa&apos;s premier cybersecurity summit as a founding partner
          </p>
        </motion.div>

        {SPONSOR_TIERS.map((tierData, tierIndex) => (
          <motion.div
            key={tierData.tier}
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + tierIndex * 0.1, ease: EASE }}
            style={{ marginBottom: tierIndex < SPONSOR_TIERS.length - 1 ? 28 : 0 }}
          >
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: tierData.color, marginBottom: 12 }}>
              {tierData.tier}
            </p>
            <div
              className="cfk-sponsor-grid"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(tierData.slots, 4)}, 1fr)`,
                gap: 12,
              }}
            >
              {Array.from({ length: tierData.slots }).map((_, i) => (
                <div
                  key={`placeholder-${i}`}
                  className="flex items-center justify-center transition-all"
                  style={{
                    padding: tierIndex === 0 ? "48px 32px" : "32px 24px",
                    borderRadius: 14,
                    background: `linear-gradient(145deg, ${tierData.color}08, ${tierData.color}03)`,
                    border: `1px dashed ${tierData.color}25`,
                    cursor: "default",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 400, color: `${tierData.color}50` }}>
                    Your brand here
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Past Partners */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
          style={{ marginTop: 48, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#606060", textAlign: "center", marginBottom: 24 }}>
            Trusted by Leading Organizations
          </p>
          <div
            className="cfk-past-sponsors"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: 32,
              opacity: 0.6,
            }}
          >
            {PAST_SPONSORS.map((s) => (
              <div key={s.name} style={{ height: 40 }}>
                <img
                  src={s.logo}
                  alt={s.name}
                  style={{ height: "100%", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }}
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginTop: 40 }}
        >
          <Link
            href="#partnership"
            className="inline-flex items-center gap-2 transition-all group"
            style={{
              padding: "14px 32px",
              borderRadius: 50,
              background: `linear-gradient(135deg, ${KENYA_ACCENT}15 0%, ${KENYA_ACCENT}08 100%)`,
              border: `1px solid ${KENYA_ACCENT}40`,
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 600,
              color: KENYA_ACCENT,
              textDecoration: "none",
            }}
          >
            <span>Become a Founding Partner</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .cfk-sponsor-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cfk-past-sponsors { gap: 24px !important; }
          .cfk-past-sponsors > div { height: 22px !important; }
        }
        @media (max-width: 480px) {
          .cfk-sponsor-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── GROWTH STORY ────────────────────────────────────────────────────────────
function GrowthStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  
  return (
    <section ref={ref} style={{ background: "#020508", padding: "clamp(40px,5vw,72px) 0" }}>
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
            Growth Trajectory
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
            Inaugural Edition. Ambitious Vision.
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
                  background: g.active ? `linear-gradient(135deg, ${KENYA_ACCENT}14, ${KENYA_ACCENT}06)` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${g.active ? KENYA_ACCENT + "40" : "rgba(255,255,255,0.06)"}`,
                  position: "relative",
                  overflow: "hidden",
                  opacity: g.projected ? 0.7 : 1,
                }}
              >
                {g.active && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${KENYA_ACCENT}, ${KENYA_ACCENT}60, transparent)` }} />
                )}
                {g.active && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: `${KENYA_ACCENT}22`,
                      border: `1px solid ${KENYA_ACCENT}45`,
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: KENYA_ACCENT }}>
                      2026
                    </span>
                  </div>
                )}
                {g.projected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                      Projected
                    </span>
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 52,
                    fontWeight: 900,
                    color: g.active ? KENYA_ACCENT : "rgba(255,255,255,0.15)",
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
                          color: g.active ? KENYA_ACCENT : "rgba(255,255,255,0.5)",
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
                      background: g.active ? `${KENYA_ACCENT}12` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${g.active ? KENYA_ACCENT + "25" : "rgba(255,255,255,0.04)"}`,
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, color: g.active ? KENYA_ACCENT : "rgba(255,255,255,0.25)" }}>
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

// ─── ATMOSPHERE DIVIDER ──────────────────────────────────────────────────────
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
        background: "#030810",
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
                    background: "linear-gradient(to top, rgba(3,8,16,0.6) 0%, rgba(3,8,16,0.1) 40%, transparent 100%)",
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
      image: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-28.jpg`,
    },
    {
      icon: "M2 3h20v14H2V3zm6 18h8m-8-4h8",
      title: "Live Hackathon / CTF Challenge",
      desc: "Teams compete in real-time capture-the-flag scenarios against simulated threat environments.",
      image: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-29.jpg`,
    },
    {
      icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      title: "Cyber Excellence Awards Kenya",
      desc: "Recognising outstanding contributions to Kenya's cybersecurity ecosystem across government and enterprise.",
      image: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-30.jpg`,
    },
    {
      icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
      title: "Executive Networking",
      desc: "Curated roundtables connecting CISOs and decision-makers across banking, telecom, government, and tech.",
      image: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-28.jpg`,
    },
  ];
  
  return (
    <section ref={ref} style={{ background: "#030810", padding: "clamp(40px,5vw,72px) 0", position: "relative", overflow: "hidden" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 50% 60% at 30% 20%, ${KENYA_ACCENT}04 0%, transparent 70%)` }}
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
            What to Expect at Kenya 2026
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
          background: hovered ? `${KENYA_ACCENT}06` : "rgba(255,255,255,0.02)",
          border: `1px solid ${hovered ? `${KENYA_ACCENT}20` : "rgba(255,255,255,0.06)"}`,
          overflow: "hidden",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? `0 16px 48px rgba(224,122,61,0.08)` : "none",
          transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
          cursor: "default",
          minHeight: 200,
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
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

        <div
          className="absolute pointer-events-none transition-opacity duration-500"
          style={{
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${KENYA_ACCENT}10 0%, transparent 70%)`,
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
              background: hovered ? `${KENYA_ACCENT}20` : `${KENYA_ACCENT}10`,
              border: `1px solid ${hovered ? `${KENYA_ACCENT}40` : `${KENYA_ACCENT}20`}`,
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
              stroke={hovered ? KENYA_ACCENT : `${KENYA_ACCENT}90`}
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{
                filter: hovered ? `drop-shadow(0 0 6px ${KENYA_ACCENT}80)` : "none",
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

// ─── WHO SHOULD ATTEND ───────────────────────────────────────────────────────
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
        padding: "clamp(40px,5vw,72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src="https://efg-final.s3.eu-north-1.amazonaws.com/cyberbg.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ filter: "brightness(0.28) saturate(0.8)" }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, #030810 0%, rgba(3,8,16,0.85) 40%, rgba(3,8,16,0.9) 70%, #030810 100%)" }} />

      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 75% 30%, ${KENYA_ACCENT}06, transparent 70%)` }} />
      <DotMatrixGrid color={KENYA_ACCENT} opacity={0.015} spacing={30} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: 48 }}
        >
          <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 30, height: 1, background: KENYA_ACCENT }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: KENYA_ACCENT }}>
              Your Audience
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.8vw,48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.08, margin: 0 }}>
            Who Should Attend
          </h2>
        </motion.div>

        <div className="cfk-attend-split" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "48px 56px", alignItems: "center" }}>
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
                  background: hoveredRole === i ? `${KENYA_ACCENT}06` : "transparent",
                  transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  cursor: "default",
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: hoveredRole === i ? `${KENYA_ACCENT}15` : `${KENYA_ACCENT}08`,
                  border: `1px solid ${hoveredRole === i ? `${KENYA_ACCENT}35` : `${KENYA_ACCENT}12`}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.3s",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={hoveredRole === i ? KENYA_ACCENT : `${KENYA_ACCENT}55`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s" }}>
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            style={{
              padding: "28px 24px",
              borderRadius: 20,
              background: `linear-gradient(135deg, rgba(224,122,61,0.06), rgba(224,122,61,0.02))`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid rgba(224,122,61,0.12)`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.3)",
              position: "relative",
              overflow: "hidden",
              width: "fit-content",
              alignSelf: "flex-start",
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 60% at 80% 20%, ${KENYA_ACCENT}08, transparent 60%)` }} />

            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 700,
              color: KENYA_ACCENT,
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
                    border: `1px solid ${hoveredInd === i ? `${KENYA_ACCENT}25` : "transparent"}`,
                    background: hoveredInd === i ? `${KENYA_ACCENT}08` : "transparent",
                    transition: "all 0.25s",
                    cursor: "default",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={hoveredInd === i ? KENYA_ACCENT : `${KENYA_ACCENT}60`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "stroke 0.3s" }}>
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
          style={{ padding: "24px 0 0" }}
        >
          <div style={{ height: 1, background: `${KENYA_ACCENT}18`, marginBottom: 14 }} />
          <div className="flex items-center gap-4 flex-wrap">
            {["300+ Senior Leaders", "6 Industries", "1 Transformative Day"].map((stat) => (
              <span key={stat} style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
                {stat}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .cfk-attend-split { grid-template-columns: 1fr !important; }
          .cfk-attend-roles { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── AWARDS SECTION ──────────────────────────────────────────────────────────
function AwardsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#050810", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: KENYA_GOLD }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: KENYA_GOLD }}>Recognition</span>
            <span style={{ width: 30, height: 1, background: KENYA_GOLD }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: 0 }}>
            Cyber First Awards Kenya
          </h2>
        </motion.div>

        <div className="cfk-awards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {AWARDS_DATA.slice(0, 3).map((award, i) => (
            <motion.div key={award.title} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }} style={{ padding: 28, borderRadius: 16, background: `linear-gradient(145deg, ${KENYA_GOLD}08, transparent)`, border: `1px solid ${KENYA_GOLD}20` }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${KENYA_GOLD}15`, border: `1px solid ${KENYA_GOLD}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={KENYA_GOLD} strokeWidth="1.5"><path d={award.icon} /></svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "white", margin: "0 0 8px" }}>{award.title}</h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{award.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Eligibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          style={{ marginTop: 48, padding: 32, borderRadius: 20, background: `${KENYA_GOLD}06`, border: `1px solid ${KENYA_GOLD}15` }}
        >
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 20 }}>Eligibility</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {AWARDS_ELIGIBILITY.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={KENYA_GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
