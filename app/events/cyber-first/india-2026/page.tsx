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

// ─── Constants ───────────────────────────────────────────────────────────────
const C = "#01BBF5";
const C_BRIGHT = "#4DD4FF";
const EASE = [0.16, 1, 0.3, 1] as const;
const WP = "https://cyberfirstseries.com/wp-content/uploads";
const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const EVENT_DATE = new Date("2026-06-11T08:30:00+05:30");

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
}[] = [
  {
    src: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-28.jpg`,
    alt: "Delegates networking",
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
    src: `${WP}/2024/12/Cyber-First-Series-Pictures-and-Sponsors-30.jpg`,
    alt: "Keynote session",
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
    title: "Cyber Leadership & National Security",
    desc: "Elevating cybersecurity as a national priority aligned with Digital India and National Cyber Security Policy, strengthening public-private partnerships and governance frameworks.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    wide: true,
  },
  {
    title: "AI & Emerging Threat Landscape",
    desc: "Addressing how artificial intelligence is reshaping cyber threats and defence strategies while enabling secure adoption of AI-driven technologies across Indian enterprises.",
    icon: "M12 2a4 4 0 014 4v1a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2V6a4 4 0 014-4zM9 18h6M10 22h4",
  },
  {
    title: "Critical Infrastructure Protection",
    desc: "Strengthening protection of power grids, telecommunications, transportation, and smart city infrastructure against targeted cyber attacks and APT groups.",
    icon: "M2 20h20M4 20V10l8-6 8 6v10M9 20v-4a3 3 0 016 0v4",
  },
  {
    title: "Banking & Financial Cyber Resilience",
    desc: "Enhancing resilience across digital banking, UPI ecosystem, fintech innovation, and RBI compliance frameworks for India's rapidly digitizing financial sector.",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    wide: true,
  },
  {
    title: "Data Protection & Privacy",
    desc: "Navigating the Digital Personal Data Protection Act (DPDP), data localization requirements, and building trust in India's digital economy.",
    icon: "M12 1a3 3 0 00-3 3v4a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M5 21h14M8 21v-4M16 21v-4",
  },
  {
    title: "Threat Intelligence & SOC",
    desc: "Building world-class Security Operations Centers, advancing threat detection capabilities, and fostering intelligence sharing across Indian organizations.",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  },
  {
    title: "Cloud & Digital Transformation Security",
    desc: "Securing cloud adoption, hybrid infrastructure, and digital transformation initiatives across government and enterprise India.",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    wide: true,
  },
  {
    title: "CERT-In Compliance & Frameworks",
    desc: "Understanding and implementing CERT-In directives, incident reporting requirements, and aligning with national cybersecurity frameworks.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4",
  },
];

const S3_LOGOS = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo";
const SPONSORS = {
  gold: [
    { name: "Palo Alto Networks", logo: `${S3_LOGOS}/paloalto.png` },
    { name: "Google Cloud", logo: `${S3_LOGOS}/Google-Cloud-Security.png` },
    { name: "Microsoft", logo: null },
    { name: "Tata Communications", logo: null },
  ],
  strategic: [
    { name: "Kaspersky", logo: `${S3_LOGOS}/kaspersky.png` },
    { name: "Fortinet", logo: `${S3_LOGOS}/fortinet.png` },
    { name: "CrowdStrike", logo: null },
    { name: "Tenable", logo: `${S3_LOGOS}/Tenable-logo.png` },
    { name: "SentinelOne", logo: `${S3_LOGOS}/sentinelone.png` },
    { name: "Securonix", logo: `${S3_LOGOS}/Securonix-logo.png` },
  ],
};

const AGENDA = [
  { time: "08:00 – 09:00", title: "Registration & Networking Breakfast", type: "break" as const },
  { time: "09:00 – 09:15", title: "Opening Ceremony", subtitle: "Welcome Address by Events First Group", type: "ceremony" as const },
  { time: "09:15 – 09:45", title: "Opening Keynote", subtitle: "Securing Digital India: National Cyber Resilience for a $5 Trillion Economy", type: "keynote" as const },
  { time: "09:45 – 10:00", title: "Sponsor Presentation", type: "sponsor" as const },
  { time: "10:00 – 10:45", title: "Panel Discussion 1 – Cyber Leadership & Governance", subtitle: "Building Cyber-Resilient Organizations: Board-Level Accountability and Strategic Risk Management", type: "panel" as const },
  { time: "10:45 – 11:00", title: "Sponsor Presentation", type: "sponsor" as const },
  { time: "11:00 – 11:30", title: "Networking & Refreshment Break", type: "break" as const },
  { time: "11:30 – 11:50", title: "Fireside Chat", subtitle: "AI-Powered Threats & Defenses: Preparing India for the Next Generation of Cyber Attacks", type: "fireside" as const },
  { time: "11:50 – 12:35", title: "Panel Discussion 2 – Critical Infrastructure Security", subtitle: "Protecting India's Digital Backbone: Power, Telecom & Smart Cities", type: "panel" as const },
  { time: "12:35 – 12:50", title: "Sponsor Presentation", type: "sponsor" as const },
  { time: "12:50 – 13:50", title: "Networking Lunch", type: "break" as const },
  { time: "13:50 – 14:35", title: "Panel Discussion 3 – Banking & Financial Cyber Resilience", subtitle: "Securing India's Digital Payments Revolution: UPI, Digital Banking & RBI Compliance", type: "panel" as const },
  { time: "14:35 – 15:20", title: "Panel Discussion 4 – Data Protection & Privacy", subtitle: "DPDP Act Implementation: Navigating India's New Data Privacy Landscape", type: "panel" as const },
  { time: "15:20 – 15:35", title: "Sponsor Presentation", type: "sponsor" as const },
  { time: "15:35 – 15:50", title: "Cyber First Awards India", type: "awards" as const },
  { time: "15:50", title: "Closing Remarks & Networking", type: "closing" as const },
];

const AWARDS_DATA = [
  {
    title: "Cybersecurity Visionary of the Year",
    desc: "Recognizing an individual demonstrating exceptional strategic vision in advancing India's cybersecurity posture.",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  },
  {
    title: "Secure Digital India Leadership",
    desc: "Honoring leadership in securing Digital India initiatives and emerging technology integration.",
    icon: "M12 2a4 4 0 014 4v1a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2V6a4 4 0 014-4zM9 18h6M10 22h4",
  },
  {
    title: "Enterprise Cyber Resilience Excellence",
    desc: "Celebrating excellence in building enterprise-wide cyber resilience frameworks and risk governance.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  {
    title: "Critical Infrastructure Defender",
    desc: "Recognizing outstanding efforts in protecting critical national infrastructure from cyber threats.",
    icon: "M2 20h20M4 20V10l8-6 8 6v10M9 20v-4a3 3 0 016 0v4",
  },
  {
    title: "Data Privacy & Trust Champion",
    desc: "Honoring commitment to data protection, DPDP compliance, and building digital trust.",
    icon: "M12 1a3 3 0 00-3 3v4a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M5 21h14M8 21v-4M16 21v-4",
  },
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
        @media (max-width: 768px) {
          .cfi-hero-section h1 { font-size: clamp(28px, 8vw, 42px) !important; max-width: 100% !important; }
          .cfi-hero-content { padding: 0 20px !important; }
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
      
      <EventNavigation />
      <HeroSection />
      <StatsBar />
      <MarketContext />
      <FocusAreas />
      <WhoShouldAttend />
      <AgendaTimeline />
      <SponsorsSection />
      <Gallery />
      <AwardsSection />
      <Venue />
      <RegistrationSection />
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
          src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.4) saturate(0.85)" }}
        />
      </div>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
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
          {/* Edition Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              alignSelf: "flex-start",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 30,
              background: `${C}15`,
              border: `1px solid ${C}30`,
              marginBottom: 24,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C_BRIGHT }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: C_BRIGHT }}>
              1st Edition · September 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(36px, 5vw, 72px)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#F0F2F5",
              margin: "0 0 28px",
              maxWidth: 700,
            }}
          >
            Securing{" "}
            <span
              style={{
                background: `linear-gradient(110deg, ${C_BRIGHT} 0%, #fff 50%, ${C_BRIGHT} 100%)`,
                backgroundSize: "250% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 6s ease-in-out infinite",
              }}
            >
              Digital India
            </span>
            <br />
            for a $5 Trillion Economy
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 400,
              fontSize: "clamp(15px, 1.4vw, 18px)",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              maxWidth: 480,
              marginBottom: 32,
            }}
          >
            India's premier cybersecurity summit bringing together CISOs, government leaders, and enterprise security executives in New Delhi.
          </motion.p>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
              The Leela Palace, New Delhi
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 34px",
                borderRadius: 50,
                background: C,
                color: "#050810",
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: `0 4px 24px ${C}35`,
              }}
            >
              Reserve Your Seat <span>→</span>
            </Link>
            <Link
              href="/contact"
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
              }}
            >
              Become a Sponsor
            </Link>
          </motion.div>
        </div>
      </div>

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
              1st Edition
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

          <Link
            href="#register"
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
  const items = [
    { n: 350, suffix: "+", label: "Delegates", desc: "C-Suite & Directors", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75", highlight: true },
    { n: 30, suffix: "+", label: "Speakers", desc: "Industry Leaders", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
    { n: 25, suffix: "", label: "Sponsors", desc: "Technology Partners", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { n: 1, suffix: "", label: "Day", desc: "Full Summit", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  ];

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(64px, 8vw, 100px) 0", overflow: "hidden" }}>
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80" alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.2) saturate(0.7)" }} />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, rgba(5,8,16,0.9) 0%, rgba(5,8,16,0.5) 50%, rgba(5,8,16,0.9) 100%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${C}10, transparent 70%)` }} />
      
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,5vw,60px)", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: C_BRIGHT }}>Summit Overview</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 48px)", letterSpacing: "-2px", color: "white", lineHeight: 1.1, margin: "14px 0 0", maxWidth: 550 }}>
            Securing India's<br /><span style={{ color: C_BRIGHT }}>Digital Future.</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3, ease: EASE }} className="cfi-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {items.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }} style={{ padding: s.highlight ? "28px 20px 24px" : "24px 16px 20px", borderRadius: 20, background: s.highlight ? `linear-gradient(145deg, ${C}20 0%, ${C}08 100%)` : "rgba(255,255,255,0.04)", border: `1px solid ${s.highlight ? `${C}40` : "rgba(255,255,255,0.08)"}`, position: "relative" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: s.highlight ? "clamp(40px,5vw,52px)" : "clamp(32px,4vw,40px)", fontWeight: 900, color: "white", letterSpacing: "-2px", lineHeight: 1 }}>
                {inView ? <Counter to={s.n} suffix={s.suffix} /> : "0"}
              </div>
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 8 }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) { .cfi-stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .cfi-stats-grid { gap: 10px !important; } .cfi-stats-grid > div { padding: 16px 14px !important; } }
      `}</style>
    </section>
  );
}

// ─── Market Context ──────────────────────────────────────────────────────────
function MarketContext() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  const stats = [
    { value: "₹20,000", suffix: "Cr+", label: "Annual Cybercrime Losses", note: "Economic impact in India (2024)", highlight: true },
    { value: "1.3", suffix: "M+", label: "Cyber Incidents", note: "Tracked by CERT-In in 2023" },
    { value: "40", suffix: "%", label: "YoY Attack Increase", note: "Ransomware attacks on Indian orgs" },
    { value: "78", suffix: "%", label: "Skills Gap", note: "Unfilled cybersecurity positions" },
  ];

  return (
    <section ref={ref} style={{ background: "#080A0F", padding: "clamp(80px, 10vw, 120px) 0", position: "relative" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 80% 50%, ${C}08, transparent 70%)` }} />
      
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        <div className="cfi-market-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
            <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
              <span style={{ width: 30, height: 1, background: C }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>Why Now</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: "0 0 20px" }}>
              India's Digital Economy<br />Demands Cyber Leadership
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 24 }}>
              With 900+ million internet users and the world's largest digital payments ecosystem, India is both a land of opportunity and a prime target for sophisticated cyber adversaries. From critical infrastructure to financial services, the stakes have never been higher.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["CERT-In Compliance", "DPDP Act", "RBI Guidelines", "Digital India"].map((tag) => (
                <span key={tag} style={{ padding: "6px 14px", borderRadius: 20, background: `${C}10`, border: `1px solid ${C}25`, fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: C }}>{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: EASE }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE }} style={{ padding: 24, borderRadius: 16, background: stat.highlight ? `linear-gradient(145deg, ${C}15 0%, ${C}05 100%)` : "rgba(255,255,255,0.03)", border: `1px solid ${stat.highlight ? `${C}30` : "rgba(255,255,255,0.06)"}` }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: stat.highlight ? 32 : 28, fontWeight: 800, color: stat.highlight ? C_BRIGHT : "white", letterSpacing: "-1px" }}>
                  {stat.value}<span style={{ fontSize: "0.7em" }}>{stat.suffix}</span>
                </div>
                <div style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginTop: 8 }}>{stat.label}</div>
                <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{stat.note}</div>
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
    <section ref={ref} style={{ background: "#050810", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>Conference Tracks</span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: 0 }}>
            What We're Solving
          </h2>
        </motion.div>

        <div className="cfi-focus-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {FOCUS_AREAS.map((area, i) => (
            <motion.div key={area.title} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }} style={{ gridColumn: area.wide ? "span 2" : "span 1", padding: 28, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.4s ease" }} className="cfi-focus-card">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C}15`, border: `1px solid ${C}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={area.icon} /></svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "white", margin: "0 0 8px" }}>{area.title}</h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{area.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .cfi-focus-card:hover { background: rgba(1, 187, 245, 0.05) !important; border-color: rgba(1, 187, 245, 0.2) !important; transform: translateY(-4px); }
        @media (max-width: 1024px) { .cfi-focus-grid { grid-template-columns: repeat(2, 1fr) !important; } .cfi-focus-grid > div { grid-column: span 1 !important; } }
        @media (max-width: 600px) { .cfi-focus-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Who Should Attend ───────────────────────────────────────────────────────
function WhoShouldAttend() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#080A0F", padding: "clamp(80px, 10vw, 120px) 0" }}>
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

  return (
    <section ref={ref} style={{ background: "#050810", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>Agenda</span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: 0 }}>
            The Day's Programme
          </h2>
        </motion.div>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, transparent, ${C}30, transparent)` }} />
          {AGENDA.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }} style={{ display: "flex", gap: 24, marginBottom: 24, paddingLeft: 24, position: "relative" }}>
              <div style={{ position: "absolute", left: -4, top: 8, width: 10, height: 10, borderRadius: "50%", background: typeColors[item.type] || C, boxShadow: `0 0 12px ${typeColors[item.type] || C}50` }} />
              <div style={{ minWidth: 100, fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>{item.time}</div>
              <div style={{ flex: 1, padding: 20, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: item.subtitle ? 6 : 0 }}>
                  <span style={{ padding: "3px 8px", borderRadius: 4, background: `${typeColors[item.type]}20`, fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, color: typeColors[item.type], textTransform: "uppercase" }}>{item.type}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "white" }}>{item.title}</span>
                </div>
                {item.subtitle && <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>{item.subtitle}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Sponsors Section ────────────────────────────────────────────────────────
function SponsorsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#080A0F", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>Partners</span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: "0 0 12px" }}>
            Sponsorship Opportunities
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 500, margin: "0 auto" }}>
            Position your brand in front of India's top cybersecurity decision-makers.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }} className="cfi-sponsor-grid">
          {SPONSORS.gold.map((sponsor) => (
            <div key={sponsor.name} style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 80 }}>
              {sponsor.logo ? (
                <img src={sponsor.logo} alt={sponsor.name} style={{ maxHeight: 32, maxWidth: "80%", filter: "brightness(0) invert(1)", opacity: 0.7 }} />
              ) : (
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{sponsor.name}</span>
              )}
            </div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4, ease: EASE }} style={{ textAlign: "center" }}>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 50, border: `1px solid ${C}40`, background: "transparent", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: C, textDecoration: "none" }}>
            Become a Sponsor <span>→</span>
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`@media (max-width: 768px) { .cfi-sponsor-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
    </section>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#050810", padding: "clamp(80px, 10vw, 120px) 0" }}>
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

        <div className="cfi-gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "200px 200px", gap: 12 }}>
          {GALLERY.slice(0, 6).map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }} style={{ gridColumn: i === 0 ? "span 2" : "span 1", gridRow: i === 0 ? "span 2" : "span 1", borderRadius: 16, overflow: "hidden", position: "relative" }}>
              <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,8,16,0.7) 0%, transparent 50%)" }} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) { .cfi-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; } .cfi-gallery-grid > div:first-child { grid-column: span 2 !important; grid-row: span 1 !important; } }
        @media (max-width: 600px) { .cfi-gallery-grid { grid-template-columns: 1fr !important; grid-template-rows: auto !important; } .cfi-gallery-grid > div { grid-column: span 1 !important; aspect-ratio: 16/10; } }
      `}</style>
    </section>
  );
}

// ─── Awards Section ──────────────────────────────────────────────────────────
function AwardsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#080A0F", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: C }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>Recognition</span>
            <span style={{ width: 30, height: 1, background: C }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, margin: 0 }}>
            Cyber First Awards India
          </h2>
        </motion.div>

        <div className="cfi-awards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {AWARDS_DATA.slice(0, 3).map((award, i) => (
            <motion.div key={award.title} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }} style={{ padding: 28, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${C}15`, border: `1px solid ${C}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C} strokeWidth="1.5"><path d={award.icon} /></svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "white", margin: "0 0 8px" }}>{award.title}</h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{award.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Venue ───────────────────────────────────────────────────────────────────
function Venue() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "#050810", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <div className="cfi-venue-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ borderRadius: 20, overflow: "hidden", aspectRatio: "16/10" }}>
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80" alt="The Leela Palace New Delhi" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}>
            <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
              <span style={{ width: 30, height: 1, background: C }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C }}>Venue</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 40px)", letterSpacing: "-1px", color: "white", lineHeight: 1.1, margin: "0 0 16px" }}>
              The Leela Palace<br />New Delhi
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 24 }}>
              Set amidst the iconic Diplomatic Enclave, The Leela Palace New Delhi offers an unparalleled setting for India's premier cybersecurity summit. World-class facilities meet timeless elegance.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[{ icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", text: "Diplomatic Enclave, Chanakyapuri" }, { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: "September 15, 2026 · 8:00 AM – 5:00 PM" }].map((item) => (
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
function RegistrationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="register" ref={ref} style={{ background: "#080A0F", padding: "clamp(100px, 12vw, 140px) 0", position: "relative" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${C}15, transparent 70%)` }} />
      
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", textAlign: "center", position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-2px", color: "white", lineHeight: 1.1, margin: "0 0 16px" }}>
            Join Us in<br /><span style={{ color: C_BRIGHT }}>New Delhi</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
            Be part of India's most influential cybersecurity gathering. Limited seats available for qualified security professionals.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "18px 40px", borderRadius: 50, background: C, color: "#050810", fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: `0 8px 32px ${C}40` }}>
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
