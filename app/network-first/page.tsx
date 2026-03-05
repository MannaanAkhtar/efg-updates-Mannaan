"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Footer } from "@/components/sections";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NF_NAVY = "#0A1628";
const NF_CARD = "#0F1D2F";
const NF_GOLD = "#C9935A";
const NF_GOLD_LIGHT = "#DBA96A";
const NF_MUTED = "#7A8BA3";
const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_W = 1320;
const PAD = "0 clamp(20px, 4vw, 60px)";
const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const S3_LOGOS = `${S3}/sponsors-logo`;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Curated Attendance",
    body: "15 to 20 hand-selected executives per session. Every seat is earned — no walk-ins, no exceptions.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Chatham House Rule",
    body: "No recordings. No press. No slides. The freedom to speak about real challenges with the people who actually share them.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Sponsor-Hosted",
    body: "One strategic partner owns the room. They shape the agenda, select the topic, and build relationships that no exhibition stand can replicate.",
  },
];

const STATS = [
  { value: "100+", label: "Boardrooms Delivered" },
  { value: "1,500+", label: "C-Level Executives Hosted" },
  { value: "80+", label: "Corporate Sponsors" },
  { value: "5", label: "GCC Markets" },
  { value: "2023", label: "Operating Since" },
  { value: "15–20", label: "Executives Per Session" },
];

const PARTICIPANT_TITLES = [
  "CISO", "CDO", "Chief Digital Officer", "VP Engineering",
  "Minister of Digital Economy", "Head of Cybersecurity",
  "Chief Information Officer", "Director of OT Security",
  "Chief Data Officer", "VP Technology", "CTO", "COO",
];

const GALLERY_PHOTOS = [
  { src: `${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-245.jpg`, caption: "VIP Government Delegation", event: "Cyber First Kuwait 2025" },
  { src: `${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-324.jpg`, caption: "Panel Discussion", event: "Cyber First Kuwait 2025" },
  { src: `${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-160.jpg`, caption: "Full House — Grand Ballroom", event: "Cyber First Kuwait 2025" },
  { src: `${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-330.jpg`, caption: "Speaker Lineup", event: "Cyber First Kuwait 2025" },
  { src: `${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-400.jpg`, caption: "Plenary Session", event: "Cyber First Kuwait 2025" },
  { src: `${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-550.jpg`, caption: "Executive Networking", event: "Cyber First Kuwait 2025" },
];

const SPONSOR_LOGOS = [
  { src: `${S3_LOGOS}/Google-Cloud-Security.png`, name: "Google Cloud Security" },
  { src: `${S3_LOGOS}/paloalto.png`, name: "Palo Alto Networks" },
  { src: `${S3_LOGOS}/kaspersky.png`, name: "Kaspersky" },
  { src: `${S3_LOGOS}/fortinet.png`, name: "Fortinet" },
  { src: `${S3_LOGOS}/Akamai.png`, name: "Akamai" },
  { src: `${S3_LOGOS}/EY.png`, name: "EY" },
  { src: `${S3_LOGOS}/Tenable-logo.png`, name: "Tenable" },
  { src: `${S3_LOGOS}/sentinelone.png`, name: "SentinelOne" },
  { src: `${S3_LOGOS}/Celonis.png`, name: "Celonis" },
  { src: `${S3_LOGOS}/ManageEngine.png`, name: "ManageEngine" },
  { src: `${S3_LOGOS}/bitdefender.png`, name: "Bitdefender" },
  { src: `${S3_LOGOS}/Securonix-logo.png`, name: "Securonix" },
  { src: `${S3_LOGOS}/Anomali.png`, name: "Anomali" },
  { src: `${S3_LOGOS}/OPSWAT-logo.png`, name: "OPSWAT" },
  { src: `${S3_LOGOS}/PENTERA.png`, name: "Pentera" },
  { src: `${S3_LOGOS}/AmiViz.png`, name: "AmiViz" },
  { src: `${S3_LOGOS}/Sonicwall.png`, name: "SonicWall" },
  { src: `${S3_LOGOS}/corelight.png`, name: "Corelight" },
  { src: `${S3_LOGOS}/threatlocker.png`, name: "ThreatLocker" },
  { src: `${S3_LOGOS}/Claroty.png`, name: "Claroty" },
  { src: `${S3_LOGOS}/Dragos.png`, name: "Dragos" },
  { src: `${S3_LOGOS}/Group-IB.png`, name: "Group-IB" },
  { src: `${S3_LOGOS}/CPX.png`, name: "CPX" },
  { src: `${S3_LOGOS}/GBM.png`, name: "GBM" },
  { src: `${S3_LOGOS}/Wallix.png`, name: "Wallix" },
  { src: `${S3_LOGOS}/nozomi-networks.png`, name: "Nozomi Networks" },
  { src: `${S3_LOGOS}/Xage.png`, name: "Xage" },
  { src: `${S3_LOGOS}/cyberknight.png`, name: "CyberKnight" },
  { src: `${S3_LOGOS}/Paramount.png`, name: "Paramount" },
  { src: `${S3_LOGOS}/bureau-veritas.png`, name: "Bureau Veritas" },
  { src: `${S3_LOGOS}/DTS-solutions.png`, name: "DTS Solutions" },
  { src: `${S3_LOGOS}/secureworks.png`, name: "Secureworks" },
  { src: `${S3_LOGOS}/hwg-here-we-go.png`, name: "HWG" },
  { src: `${S3_LOGOS}/Gorilla.png`, name: "Gorilla" },
  { src: `${S3_LOGOS}/filigran.png`, name: "Filigran" },
  { src: `${S3_LOGOS}/UAE-Cyber-Security-Council.png`, name: "UAE Cyber Security Council" },
];

const TESTIMONIALS = [
  {
    quote: "The executive boardroom was very transformative for us — our brand got the exposure with the right connections.",
    name: "Srikanth Rayaprolu",
    title: "CEO & Co-Founder",
    company: "Ad Scholars",
  },
  {
    quote: "Unforgettable experience with tangible results. Excellent job done by the team — everything was professionally managed.",
    name: "Deep Vyas",
    title: "Partner",
    company: "Worker Ants Media",
  },
  {
    quote: "Our event with Network First was an invaluable experience that exceeded our expectations in every way.",
    name: "Sheryan Gandhi",
    title: "Chief Operating Officer",
    company: "Tap1ce",
  },
];

// YouTube Shorts — testimonial-style vertical videos
const VIDEO_SHORTS = [
  { id: "SH9Z1U2_rAM", title: "Voices of Excellence" },
  { id: "wLgYOHHB6o4", title: "Voices of Excellence" },
  { id: "2jpIlqo0HSY", title: "Voices of Excellence" },
  { id: "SLkj5gO-LQ8", title: "Voices of Excellence" },
];

// YouTube highlight videos — landscape event coverage
const HIGHLIGHT_VIDEOS = [
  { id: "JA1X4cN2-t0", title: "Event Highlights" },
  { id: "-a481Lbz55o", title: "Event Highlights" },
  { id: "Bc3L3iTsaIg", title: "Data & AI First Highlights" },
  { id: "0d_2Itsg6ec", title: "Event Highlights" },
  { id: "wcEeU0UEl0o", title: "Event Highlights" },
  { id: "3uvw31I1tq8", title: "Event Highlights" },
  { id: "6H11mOM-aJc", title: "Event Highlights" },
  { id: "kjro4AVXUhM", title: "Event Highlights" },
];

// Past boardrooms from networkfirstme.com — grouped by year
const PAST_EVENTS_2025 = [
  { sponsor: "Confluent | AWS", date: "25 Nov", venue: "Ritz Carlton DIFC", city: "Dubai" },
  { sponsor: "Strategy", date: "19 Nov", venue: "Crowne Plaza", city: "Riyadh" },
  { sponsor: "OutSystems", date: "18 Nov", venue: "Dana Rayhaan by Rotana", city: "Dammam" },
  { sponsor: "Commvault | GBM", date: "18 Nov", venue: "Ritz Carlton DIFC", city: "Dubai" },
  { sponsor: "Finastra", date: "29 Oct", venue: "Voco Riyadh", city: "Saudi Arabia" },
  { sponsor: "CleverTap", date: "29 Oct", venue: "Jumeirah Messilah Beach", city: "Kuwait" },
  { sponsor: "SecurityScorecard", date: "29 Oct", venue: "Grand Hyatt", city: "Abu Dhabi" },
  { sponsor: "Akamai | Cyberia", date: "29 Oct", venue: "Executive Boardroom", city: "Riyadh" },
  { sponsor: "Jedox Elevate", date: "29 Oct", venue: "Ritz Carlton JBR", city: "Dubai" },
  { sponsor: "Confluent", date: "28 Oct", venue: "Voco Hotel", city: "Riyadh" },
  { sponsor: "GBM | Cisco", date: "23 Oct", venue: "St. Regis Downtown", city: "Dubai" },
  { sponsor: "GBM | Fortinet", date: "09 Oct", venue: "One&Only One Za'abeel", city: "Dubai" },
  { sponsor: "Akamai", date: "01 Oct", venue: "TODA Theatre of Digital Art", city: "Dubai" },
  { sponsor: "Freshworks", date: "18 Sep", venue: "Ritz Carlton JBR", city: "Dubai" },
  { sponsor: "Strategy World", date: "17 Sep", venue: "Delano Bluewaters", city: "Dubai" },
  { sponsor: "GBM", date: "16 Sep", venue: "JW Marriott Marquis", city: "Dubai" },
  { sponsor: "Freshworks", date: "16 Sep", venue: "Voco Hotel", city: "Riyadh" },
  { sponsor: "Summerge", date: "10 Sep", venue: "Ritz Carlton DIFC", city: "Dubai" },
  { sponsor: "CleverTap", date: "09 Sep", venue: "Ritz-Carlton", city: "Jeddah" },
  { sponsor: "Celonis", date: "07 Jul", venue: "Hilton Riyadh", city: "Riyadh" },
  { sponsor: "OutSystems", date: "25 Jun", venue: "Hilton Riyadh", city: "Riyadh" },
  { sponsor: "Celonis", date: "23 Jun", venue: "Executive Boardroom", city: "Riyadh" },
  { sponsor: "Jedox", date: "17 Jun", venue: "Ritz Carlton JBR", city: "Dubai" },
  { sponsor: "OutSystems", date: "29 May", venue: "Ritz Carlton Grand Canal", city: "Abu Dhabi" },
  { sponsor: "Confluent", date: "14 May", venue: "Ritz Carlton DIFC", city: "Dubai" },
  { sponsor: "Jedox", date: "07 May", venue: "Taj Hotel Business Bay", city: "Dubai" },
  { sponsor: "Confluent", date: "30 Apr", venue: "Executive Boardroom", city: "Riyadh" },
  { sponsor: "Celonis", date: "29 Apr", venue: "Executive Boardroom", city: "Abu Dhabi" },
  { sponsor: "Akamai", date: "09 Apr", venue: "Vida Dubai Mall", city: "Dubai" },
  { sponsor: "Freshworks", date: "18 Mar", venue: "St. Regis", city: "Dubai" },
  { sponsor: "Confluent", date: "20 Feb", venue: "Executive Boardroom", city: "Riyadh" },
  { sponsor: "Whatfix", date: "18 Feb", venue: "St. Regis Downtown", city: "Dubai" },
  { sponsor: "Appknox", date: "05 Feb", venue: "Ritz Carlton DIFC", city: "Dubai" },
  { sponsor: "Sonar", date: "28 Jan", venue: "Diplomat Club", city: "Doha" },
  { sponsor: "Orbit Analytics", date: "20 Jan", venue: "Fairmont", city: "Riyadh" },
];

const PAST_EVENTS_2024 = [
  { sponsor: "Freshworks", date: "Dec", venue: "Ritz-Carlton", city: "Abu Dhabi" },
  { sponsor: "Confluent", date: "Nov", venue: "Executive Boardroom", city: "Dubai" },
  { sponsor: "Celonis", date: "Oct", venue: "Executive Boardroom", city: "Riyadh" },
  { sponsor: "Trimble", date: "Sep", venue: "Virtual Boardroom", city: "Online" },
  { sponsor: "Coursera", date: "Aug", venue: "Executive Roundtable", city: "Dubai" },
  { sponsor: "Kissflow", date: "Jul", venue: "Executive Boardroom", city: "Dubai" },
  { sponsor: "Appknox", date: "Jun", venue: "Executive Boardroom", city: "Dubai" },
  { sponsor: "Uniphore", date: "May", venue: "Executive Roundtable", city: "Dubai" },
];

const UPCOMING_EVENTS = [
  {
    date: "Q2 2026",
    title: "Cybersecurity Leadership Boardroom",
    location: "Kuwait City, Kuwait",
    format: "Physical" as const,
    topic: "National Cyber Resilience & GCC Threat Landscape",
  },
  {
    date: "Q2 2026",
    title: "Data & AI Strategy Boardroom",
    location: "Dubai, UAE",
    format: "Virtual" as const,
    topic: "Regulated AI Deployment & Data Governance",
  },
  {
    date: "Q3 2026",
    title: "OT Security Roundtable",
    location: "Riyadh, Saudi Arabia",
    format: "Physical" as const,
    topic: "Critical Infrastructure Protection",
  },
  {
    date: "Q3 2026",
    title: "Digital Transformation Boardroom",
    location: "Doha, Qatar",
    format: "Physical" as const,
    topic: "Enterprise Digital Strategy for Government",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function NetworkFirstPage() {
  return (
    <>
      <HeroSection />
      <WhatIsSection />
      <FormatsSection />
      <StatsSection />
      <GallerySection />
      <VideoHighlightsSection />
      <PastEventsSection />
      <LogoWallSection />
      <TestimonialsSection />
      <UpcomingSection />
      <TitlesMarquee />
      <DualCTA />
      <Footer />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// S1 — HERO
// ═══════════════════════════════════════════════════════════════════════════════

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });

  const HERO_STATS = [
    { value: "100+", label: "Boardrooms" },
    { value: "1,500+", label: "C-Level Execs" },
    { value: "80+", label: "Sponsors" },
    { value: "2023", label: "Operating Since" },
  ];

  const headlineLines = [
    { text: "Where the GCC\u2019s", color: "#fff", delay: 0.2 },
    { text: "Most Senior Leaders", color: "#fff", delay: 0.35 },
    { text: "Meet Behind", color: "#fff", delay: 0.5 },
    { text: "Closed Doors", color: NF_GOLD, delay: 0.65 },
  ];

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: NF_NAVY,
      }}
    >
      {/* L0 — Full-bleed backdrop photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${S3}/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-245.jpg`}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.25) saturate(0.6)",
        }}
      />

      {/* L1 — Directional gradient: left side darker for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(105deg, ${NF_NAVY}e6 0%, ${NF_NAVY}aa 40%, ${NF_NAVY}44 70%, ${NF_NAVY}66 100%)`,
        }}
      />

      {/* L1b — Top + bottom vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${NF_NAVY}cc 0%, transparent 25%, transparent 75%, ${NF_NAVY}ee 100%)`,
        }}
      />

      {/* L2 — Gold ambient glow (center-right) */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "15%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${NF_GOLD}0c 0%, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* L3 — Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: MAX_W,
          width: "100%",
          margin: "0 auto",
          padding: "clamp(140px, 16vh, 200px) clamp(20px, 4vw, 60px) clamp(80px, 10vh, 120px)",
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}
        >
          <span style={{ width: 28, height: 1, background: NF_GOLD }} />
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: NF_GOLD,
            }}
          >
            NetworkFirst Boardrooms
          </span>
        </motion.div>

        {/* Headline — clip-path reveal per line */}
        <h1 style={{ margin: "0 0 28px" }}>
          {headlineLines.map((line) => (
            <motion.span
              key={line.text}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={inView ? { clipPath: "inset(0 0% 0 0)" } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: line.delay }}
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(38px, 5vw, 72px)",
                lineHeight: 1.06,
                letterSpacing: "-2.5px",
                color: line.color,
              }}
            >
              {line.text}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.8 }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(15px, 1.3vw, 17px)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.7,
            maxWidth: 500,
            margin: "0 0 36px",
          }}
        >
          Exclusive executive roundtables for CISOs, CDOs, CTOs, and government strategists.
          Invitation only. Since 2023.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.95 }}
          style={{ marginBottom: 48 }}
        >
          <Link
            href="/contact"
            className="nfp-hero-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "15px 40px",
              borderRadius: 60,
              background: NF_GOLD,
              color: NF_NAVY,
              fontFamily: "var(--font-outfit)",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Request an Invitation
            <span style={{ fontSize: 17 }}>&rarr;</span>
          </Link>
        </motion.div>

        {/* Inline stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 1.1 }}
          className="nfp-hero-stats"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 0,
          }}
        >
          {HERO_STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                paddingRight: i < HERO_STATS.length - 1 ? "clamp(20px, 2.5vw, 36px)" : 0,
                marginRight: i < HERO_STATS.length - 1 ? "clamp(20px, 2.5vw, 36px)" : 0,
                borderRight: i < HERO_STATS.length - 1 ? `1px solid ${NF_GOLD}18` : "none",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(20px, 1.8vw, 26px)",
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 3px",
                  letterSpacing: "-0.5px",
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10,
                  fontWeight: 500,
                  color: NF_MUTED,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .nfp-hero-cta:hover {
          background: ${NF_GOLD_LIGHT} !important;
          transform: translateY(-2px);
          box-shadow: 0 16px 48px ${NF_GOLD}40;
        }
        @media (max-width: 768px) {
          .nfp-hero-stats {
            flex-wrap: wrap !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 480px) {
          .nfp-hero-stats {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
          }
          .nfp-hero-stats > div {
            border-right: none !important;
            padding-right: 0 !important;
            margin-right: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// S2 — WHAT IS NETWORKFIRST
// ═══════════════════════════════════════════════════════════════════════════════

function WhatIsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: NF_NAVY,
        padding: "clamp(60px, 7vw, 100px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <Eyebrow text="The Format" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "#fff",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            A Different <span style={{ color: NF_GOLD }}>Kind of Room.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: NF_MUTED,
              maxWidth: 560,
              margin: "16px auto 0",
              lineHeight: 1.7,
            }}
          >
            15-seat executive roundtables. Hand-selected leaders. No keynotes, no slides, no recordings.
            Just the conversations that actually move industries — held under Chatham House Rule.
          </p>
        </motion.div>

        {/* 3 Pillar Cards */}
        <div
          className="nfp-pillars-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.1 }}
              className="nfp-pillar-card"
              style={{
                background: NF_CARD,
                border: `1px solid ${NF_GOLD}15`,
                borderRadius: 16,
                padding: "36px 28px",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: `${NF_GOLD}12`,
                  border: `1px solid ${NF_GOLD}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: NF_GOLD,
                  marginBottom: 20,
                }}
              >
                {pillar.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 10px",
                }}
              >
                {pillar.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14,
                  fontWeight: 300,
                  color: NF_MUTED,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {pillar.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .nfp-pillar-card:hover {
          border-color: ${NF_GOLD}35 !important;
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(10, 22, 40, 0.5);
        }
        @media (max-width: 768px) {
          .nfp-pillars-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// S3 — FORMATS (Physical + Virtual)
// ═══════════════════════════════════════════════════════════════════════════════

function FormatsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const formats = [
    {
      title: "Physical Boardrooms",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      description: "Intimate in-person gatherings at five-star venues across the GCC. Curated hospitality, private dining, and face-to-face connections that build lasting relationships.",
      features: [
        "Five-star hotel venues",
        "15–20 hand-selected executives",
        "Curated F&B and private dining",
        "Same-day relationship building",
      ],
    },
    {
      title: "Virtual Boardrooms",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      description: "Moderated online sessions that bring the same curation standards to a cross-border audience. No travel barriers — same quality conversations.",
      features: [
        "Moderated by industry experts",
        "Cross-border executive access",
        "Structured discussion format",
        "Same curation standards",
      ],
    },
  ];

  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(180deg, ${NF_NAVY} 0%, #071020 100%)`,
        padding: "clamp(60px, 7vw, 100px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <Eyebrow text="How We Convene" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "#fff",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            Two Formats. <span style={{ color: NF_GOLD }}>One Standard.</span>
          </h2>
        </motion.div>

        {/* 2 Format Cards */}
        <div
          className="nfp-formats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {formats.map((format, i) => (
            <motion.div
              key={format.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.15 }}
              className="nfp-format-card"
              style={{
                background: NF_CARD,
                border: `1px solid ${NF_GOLD}12`,
                borderRadius: 20,
                padding: "40px 32px",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: `${NF_GOLD}10`,
                  border: `1px solid ${NF_GOLD}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: NF_GOLD,
                  marginBottom: 24,
                }}
              >
                {format.icon}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 12px",
                }}
              >
                {format.title}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14,
                  fontWeight: 300,
                  color: NF_MUTED,
                  lineHeight: 1.7,
                  margin: "0 0 24px",
                }}
              >
                {format.description}
              </p>

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {format.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: NF_GOLD,
                        flexShrink: 0,
                        opacity: 0.6,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 13,
                        color: "rgba(255,255,255,0.65)",
                      }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chatham House Badge */}
              <div
                style={{
                  marginTop: 28,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: `${NF_GOLD}08`,
                  border: `1px solid ${NF_GOLD}18`,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NF_GOLD} strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: NF_GOLD,
                    letterSpacing: "0.5px",
                  }}
                >
                  Chatham House Rule
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .nfp-format-card:hover {
          border-color: ${NF_GOLD}30 !important;
          transform: translateY(-4px);
        }
        @media (max-width: 768px) {
          .nfp-formats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// S4 — BY THE NUMBERS
// ═══════════════════════════════════════════════════════════════════════════════

function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(180deg, #071020 0%, ${NF_NAVY} 100%)`,
        padding: "clamp(60px, 7vw, 100px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `radial-gradient(circle at 1px 1px, ${NF_GOLD} 1px, transparent 0)`,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <Eyebrow text="Track Record" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "#fff",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            Built on Results, <span style={{ color: NF_GOLD }}>Not Promises</span>
          </h2>
        </motion.div>

        <div
          className="nfp-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.08 }}
              style={{
                textAlign: "center",
                padding: "32px 20px",
                borderRadius: 16,
                background: NF_CARD,
                border: `1px solid ${NF_GOLD}10`,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 3vw, 40px)",
                  fontWeight: 800,
                  color: NF_GOLD,
                  margin: "0 0 8px",
                  letterSpacing: "-1px",
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: NF_MUTED,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .nfp-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .nfp-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// S5 — GALLERY
// ═══════════════════════════════════════════════════════════════════════════════

function GallerySection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: NF_NAVY,
        padding: "clamp(60px, 7vw, 100px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <Eyebrow text="Proof, Not Promises" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "#fff",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            Inside <span style={{ color: NF_GOLD }}>the Room</span>
          </h2>
        </motion.div>

        <div
          className="nfp-gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {GALLERY_PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.08 }}
              className="nfp-gallery-item"
              style={{
                position: "relative",
                borderRadius: 14,
                overflow: "hidden",
                aspectRatio: "16 / 10",
                border: `1px solid ${NF_GOLD}10`,
                cursor: "default",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.7) saturate(0.85)",
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />

              {/* Hover overlay with caption */}
              <div
                className="nfp-gallery-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to top, ${NF_NAVY}ee 0%, transparent 50%)`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: 20,
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 4px",
                  }}
                >
                  {photo.caption}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    color: NF_GOLD,
                    margin: 0,
                  }}
                >
                  {photo.event}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .nfp-gallery-item:hover img {
          filter: brightness(0.5) saturate(1) !important;
          transform: scale(1.05);
        }
        .nfp-gallery-item:hover .nfp-gallery-overlay {
          opacity: 1 !important;
        }
        @media (max-width: 768px) {
          .nfp-gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .nfp-gallery-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// S5b — VIDEO HIGHLIGHTS (Shorts + Landscape)
// ═══════════════════════════════════════════════════════════════════════════════

function VideoHighlightsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(180deg, ${NF_NAVY} 0%, #071020 100%)`,
        padding: "clamp(60px, 7vw, 100px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <Eyebrow text="See It for Yourself" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "#fff",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            Voices From <span style={{ color: NF_GOLD }}>the Room</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: NF_MUTED,
              maxWidth: 520,
              margin: "16px auto 0",
              lineHeight: 1.7,
            }}
          >
            Hear directly from the executives and sponsors who&apos;ve been in the room.
          </p>
        </motion.div>

        {/* YouTube Shorts — 4 vertical cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginBottom: 48 }}
        >
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: NF_GOLD,
              marginBottom: 16,
              opacity: 0.7,
            }}
          >
            Executive Testimonials
          </p>
          <div
            className="nfp-shorts-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
          >
            {VIDEO_SHORTS.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.1 }}
              >
                <VideoCard videoId={video.id} title={video.title} aspect="9/16" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Landscape highlight videos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: NF_MUTED,
              marginBottom: 16,
              opacity: 0.6,
            }}
          >
            Event Coverage
          </p>
          <div
            className="nfp-videos-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
          >
            {HIGHLIGHT_VIDEOS.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE, delay: 0.7 + i * 0.08 }}
              >
                <VideoCard videoId={video.id} title={video.title} aspect="16/9" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .nfp-shorts-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .nfp-videos-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .nfp-shorts-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .nfp-videos-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .nfp-shorts-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .nfp-videos-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/** Reusable video card — click-to-play with thumbnail */
function VideoCard({
  videoId,
  title,
  aspect,
}: {
  videoId: string;
  title: string;
  aspect: "9/16" | "16/9";
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="nfp-video-card"
      style={{
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${NF_GOLD}10`,
        background: NF_CARD,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Video area */}
      <div
        style={{
          position: "relative",
          aspectRatio: aspect,
          background: "#000",
          cursor: playing ? "default" : "pointer",
        }}
        onClick={() => !playing && setPlaying(true)}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${videoId}/${aspect === "9/16" ? "oar2" : "hqdefault"}.jpg`}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.7)",
                transition: "filter 0.3s ease",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            {/* Play button */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: `${NF_GOLD}cc`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={NF_NAVY}>
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </div>
            </div>
            {/* Bottom gradient */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                background: `linear-gradient(to top, ${NF_CARD} 0%, transparent 100%)`,
              }}
            />
          </>
        )}
      </div>

      {/* Title bar */}
      <div style={{ padding: "10px 14px" }}>
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(255,255,255,0.6)",
            margin: 0,
          }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// S5c — PAST EVENTS
// ═══════════════════════════════════════════════════════════════════════════════

function PastEventsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [showAll2025, setShowAll2025] = useState(false);

  const visible2025 = showAll2025 ? PAST_EVENTS_2025 : PAST_EVENTS_2025.slice(0, 12);

  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(180deg, ${NF_NAVY} 0%, #060E1C 100%)`,
        padding: "clamp(60px, 7vw, 100px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <Eyebrow text="Track Record" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "#fff",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            Past <span style={{ color: NF_GOLD }}>Boardrooms</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: 16,
              color: NF_MUTED,
              maxWidth: 520,
              margin: "16px auto 0",
              lineHeight: 1.7,
            }}
          >
            {PAST_EVENTS_2025.length + PAST_EVENTS_2024.length}+ executive roundtables delivered across the GCC since 2023.
          </p>
        </motion.div>

        {/* 2025 Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: NF_GOLD,
              marginBottom: 16,
              opacity: 0.7,
            }}
          >
            2025 — {PAST_EVENTS_2025.length} Boardrooms
          </p>

          <div
            className="nfp-past-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {visible2025.map((event, i) => (
              <motion.div
                key={`${event.sponsor}-${event.date}`}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, ease: EASE, delay: 0.3 + i * 0.02 }}
                className="nfp-past-card"
                style={{
                  background: NF_CARD,
                  border: `1px solid ${NF_GOLD}08`,
                  borderRadius: 12,
                  padding: "18px 16px",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Sponsor */}
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 8px",
                    lineHeight: 1.3,
                  }}
                >
                  {event.sponsor}
                </p>

                {/* Venue */}
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.45)",
                    margin: "0 0 10px",
                    lineHeight: 1.4,
                  }}
                >
                  {event.venue}
                </p>

                {/* Date + City */}
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: NF_GOLD,
                      opacity: 0.7,
                    }}
                  >
                    {event.date}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      color: NF_MUTED,
                      opacity: 0.6,
                    }}
                  >
                    {event.city}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Show more / less toggle */}
          {PAST_EVENTS_2025.length > 12 && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button
                onClick={() => setShowAll2025(!showAll2025)}
                className="nfp-show-more-btn"
                style={{
                  background: "transparent",
                  border: `1px solid ${NF_GOLD}25`,
                  borderRadius: 30,
                  padding: "10px 28px",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: NF_GOLD,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {showAll2025
                  ? "Show Less"
                  : `Show All ${PAST_EVENTS_2025.length} Boardrooms`}
              </button>
            </div>
          )}
        </motion.div>

        {/* 2024 Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ marginTop: 48 }}
        >
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: NF_MUTED,
              marginBottom: 16,
              opacity: 0.5,
            }}
          >
            2024 — {PAST_EVENTS_2024.length} Boardrooms
          </p>

          <div
            className="nfp-past-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {PAST_EVENTS_2024.map((event, i) => (
              <motion.div
                key={`2024-${event.sponsor}-${event.date}`}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, ease: EASE, delay: 0.7 + i * 0.03 }}
                className="nfp-past-card"
                style={{
                  background: NF_CARD,
                  border: `1px solid rgba(255,255,255,0.03)`,
                  borderRadius: 12,
                  padding: "18px 16px",
                  opacity: 0.7,
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 8px",
                    lineHeight: 1.3,
                  }}
                >
                  {event.sponsor}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.4)",
                    margin: "0 0 10px",
                    lineHeight: 1.4,
                  }}
                >
                  {event.venue}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: NF_MUTED,
                      opacity: 0.5,
                    }}
                  >
                    {event.date}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      color: NF_MUTED,
                      opacity: 0.4,
                    }}
                  >
                    {event.city}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .nfp-video-card:hover {
          border-color: ${NF_GOLD}25 !important;
          transform: translateY(-3px);
        }
        .nfp-video-card:hover img {
          filter: brightness(0.85) !important;
        }
        .nfp-past-card:hover {
          border-color: ${NF_GOLD}20 !important;
          transform: translateY(-2px);
          opacity: 1 !important;
        }
        .nfp-show-more-btn:hover {
          background: ${NF_GOLD}10 !important;
          border-color: ${NF_GOLD} !important;
        }
        @media (max-width: 1024px) {
          .nfp-past-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .nfp-past-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .nfp-past-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// S6 — LOGO WALL
// ═══════════════════════════════════════════════════════════════════════════════

function LogoWallSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(180deg, ${NF_NAVY} 0%, #060E1C 100%)`,
        padding: "clamp(60px, 7vw, 100px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <Eyebrow text="Our Partners" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 42px)",
              letterSpacing: "-1.5px",
              color: "#fff",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            Trusted by the Brands That{" "}
            <span style={{ color: NF_GOLD }}>Shape the Region</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="nfp-logos-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 12,
          }}
        >
          {SPONSOR_LOGOS.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.02 }}
            >
              <LogoCard logo={logo} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .nfp-logos-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .nfp-logos-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .nfp-logos-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

function LogoCard({ logo }: { logo: { src: string; name: string } }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center justify-center transition-all"
      style={{
        background: hovered ? "rgba(255,255,255,0.9)" : NF_CARD,
        border: hovered ? `1px solid ${NF_GOLD}20` : `1px solid ${NF_GOLD}08`,
        borderRadius: 10,
        padding: "14px 16px",
        minHeight: 60,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        cursor: "default",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.name}
        loading="lazy"
        style={{
          maxWidth: 100,
          maxHeight: 32,
          objectFit: "contain",
          filter: hovered ? "none" : "brightness(0) invert(1)",
          opacity: hovered ? 1 : 0.45,
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// S7 — TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════════

function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "#060E1C",
        padding: "clamp(60px, 7vw, 100px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <Eyebrow text="In Their Words" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 42px)",
              letterSpacing: "-1.5px",
              color: "#fff",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            What Sponsors & Attendees <span style={{ color: NF_GOLD }}>Say</span>
          </h2>
        </motion.div>

        <div
          className="nfp-testimonials-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.12 }}
              className="nfp-testimonial-card"
              style={{
                background: NF_CARD,
                border: `1px solid ${NF_GOLD}10`,
                borderRadius: 18,
                padding: "36px 28px",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Quote mark */}
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 48,
                  color: NF_GOLD,
                  lineHeight: 1,
                  marginBottom: 8,
                  opacity: 0.4,
                }}
              >
                &ldquo;
              </span>

              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 15,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.7,
                  margin: "0 0 24px",
                  flex: 1,
                }}
              >
                {t.quote}
              </p>

              <div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 2px",
                  }}
                >
                  {t.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    color: NF_MUTED,
                    margin: 0,
                  }}
                >
                  {t.title}, {t.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .nfp-testimonial-card:hover {
          border-color: ${NF_GOLD}25 !important;
          transform: translateY(-3px);
        }
        @media (max-width: 768px) {
          .nfp-testimonials-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// S8 — UPCOMING BOARDROOMS
// ═══════════════════════════════════════════════════════════════════════════════

function UpcomingSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: NF_NAVY,
        padding: "clamp(60px, 7vw, 100px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <Eyebrow text="What's Next" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 42px)",
              letterSpacing: "-1.5px",
              color: "#fff",
              lineHeight: 1.1,
              margin: "16px 0 0",
            }}
          >
            Upcoming <span style={{ color: NF_GOLD }}>Boardrooms</span>
          </h2>
        </motion.div>

        <div
          className="nfp-upcoming-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {UPCOMING_EVENTS.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.1 }}
              className="nfp-upcoming-card"
              style={{
                background: NF_CARD,
                border: `1px solid ${NF_GOLD}10`,
                borderRadius: 18,
                padding: "32px 28px",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Top row: date + format badge */}
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: NF_GOLD,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {event.date}
                </span>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "var(--font-outfit)",
                    letterSpacing: "0.5px",
                    background: event.format === "Physical" ? `${NF_GOLD}12` : "rgba(59, 130, 246, 0.1)",
                    color: event.format === "Physical" ? NF_GOLD : "#60A5FA",
                    border: event.format === "Physical" ? `1px solid ${NF_GOLD}20` : "1px solid rgba(59, 130, 246, 0.2)",
                  }}
                >
                  {event.format}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 8px",
                }}
              >
                {event.title}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  color: NF_MUTED,
                  margin: "0 0 4px",
                }}
              >
                {event.location}
              </p>

              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.4)",
                  margin: "0 0 20px",
                  fontStyle: "italic",
                }}
              >
                {event.topic}
              </p>

              <Link
                href="/contact"
                className="nfp-upcoming-cta"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 24px",
                  borderRadius: 30,
                  border: `1px solid ${NF_GOLD}30`,
                  background: "transparent",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: NF_GOLD,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
              >
                Request Invitation
                <span style={{ fontSize: 14 }}>&rarr;</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .nfp-upcoming-card:hover {
          border-color: ${NF_GOLD}25 !important;
          transform: translateY(-3px);
        }
        .nfp-upcoming-cta:hover {
          background: ${NF_GOLD}10 !important;
          border-color: ${NF_GOLD} !important;
        }
        @media (max-width: 768px) {
          .nfp-upcoming-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// S9 — PARTICIPANT TITLES MARQUEE
// ═══════════════════════════════════════════════════════════════════════════════

function TitlesMarquee() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(180deg, ${NF_NAVY} 0%, #071020 100%)`,
        padding: "clamp(40px, 5vw, 64px) 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Edge fades */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "clamp(40px, 8vw, 100px)",
          background: `linear-gradient(to right, ${NF_NAVY}, transparent)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "clamp(40px, 8vw, 100px)",
          background: `linear-gradient(to left, #071020, transparent)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <p
          style={{
            textAlign: "center",
            fontFamily: "var(--font-outfit)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: NF_MUTED,
            marginBottom: 20,
          }}
        >
          Past Participants Include
        </p>

        <div className="nfp-marquee-track">
          <div className="nfp-marquee-inner">
            {[...PARTICIPANT_TITLES, ...PARTICIPANT_TITLES, ...PARTICIPANT_TITLES].map((title, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(14px, 1.5vw, 18px)",
                  fontWeight: 600,
                  color: `${NF_GOLD}55`,
                  whiteSpace: "nowrap",
                  padding: "0 clamp(16px, 2vw, 32px)",
                }}
              >
                {title}
                <span style={{ color: `${NF_GOLD}20`, margin: "0 0 0 clamp(16px, 2vw, 32px)" }}>/</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .nfp-marquee-track {
          overflow: hidden;
        }
        .nfp-marquee-inner {
          display: flex;
          width: max-content;
          animation: nfpMarquee 30s linear infinite;
        }
        @keyframes nfpMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// S10 — DUAL CTA
// ═══════════════════════════════════════════════════════════════════════════════

function DualCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "#071020",
        padding: "clamp(60px, 7vw, 100px) 0",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD }}>
        <div
          className="nfp-dual-cta-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {/* Attend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              background: NF_CARD,
              border: `1px solid ${NF_GOLD}15`,
              borderRadius: 20,
              padding: "48px 36px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: `${NF_GOLD}10`,
                border: `1px solid ${NF_GOLD}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                color: NF_GOLD,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 12px",
              }}
            >
              Attend a Boardroom
            </h3>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 300,
                color: NF_MUTED,
                lineHeight: 1.7,
                margin: "0 0 28px",
                maxWidth: 360,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              For senior executives seeking an invitation to our closed-door sessions across the GCC.
            </p>
            <Link
              href="/contact"
              className="nfp-cta-attend"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 36px",
                borderRadius: 60,
                border: `1px solid ${NF_GOLD}40`,
                background: "transparent",
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 600,
                color: NF_GOLD,
                textDecoration: "none",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              Request an Invitation
              <span>&rarr;</span>
            </Link>
          </motion.div>

          {/* Host */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            style={{
              background: `linear-gradient(135deg, ${NF_GOLD}12 0%, ${NF_CARD} 100%)`,
              border: `1px solid ${NF_GOLD}25`,
              borderRadius: 20,
              padding: "48px 36px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: `${NF_GOLD}15`,
                border: `1px solid ${NF_GOLD}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                color: NF_GOLD,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 12px",
              }}
            >
              Host a Boardroom
            </h3>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 300,
                color: NF_MUTED,
                lineHeight: 1.7,
                margin: "0 0 28px",
                maxWidth: 360,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              For brands and sponsors looking to own the room, shape the agenda, and build direct relationships with C-level executives.
            </p>
            <Link
              href="/contact"
              className="nfp-cta-host"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 36px",
                borderRadius: 60,
                background: NF_GOLD,
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 700,
                color: NF_NAVY,
                textDecoration: "none",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              Become a Sponsor
              <span>&rarr;</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .nfp-cta-attend:hover {
          background: ${NF_GOLD}10 !important;
          border-color: ${NF_GOLD} !important;
          transform: translateY(-2px);
        }
        .nfp-cta-host:hover {
          background: ${NF_GOLD_LIGHT} !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px ${NF_GOLD}40;
        }
        @media (max-width: 768px) {
          .nfp-dual-cta-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED — EYEBROW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function Eyebrow({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span style={{ width: 28, height: 1, background: NF_GOLD }} />
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: NF_GOLD,
        }}
      >
        {text}
      </span>
      <span style={{ width: 28, height: 1, background: NF_GOLD }} />
    </div>
  );
}
