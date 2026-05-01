"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Footer } from "@/components/sections";
import InquiryForm from "@/components/sections/InquiryForm";
import CyberFirstCloudsBg from "@/components/effects/CyberFirstCloudsBg";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const CYAN = "#01BBF5";
const CYAN_DIM = "#0082AD";
const INK = "#050608";
const INK_2 = "#0A0B0E";
const INK_3 = "#12141A";
const PAPER = "#F2F2F2";
const RULE = "rgba(255,255,255,0.08)";
const MUTE = "rgba(255,255,255,0.55)";
const FAINT = "rgba(255,255,255,0.35)";
const EASE = [0.22, 1, 0.36, 1] as const;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const S3_LOGOS = `${S3}/sponsors-logo`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const EDITIONS_2026 = [
  { city: "Kuwait City", country: "Kuwait", date: "09 June 2026", edition: "3rd Edition", href: "/events/cyber-first/kuwait-2026", status: "open", venue: "Jumeirah Messilah Beach Hotel", image: "https://efg-final.s3.eu-north-1.amazonaws.com/venues/jumeirah-messilah-kuwait.jpg", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/logos/cyber-first-kuwait-white.svg" },
  { city: "Nairobi", country: "Kenya", date: "08 July 2026", edition: "1st Edition", href: "/events/cyber-first/kenya-2026", status: "open", venue: "Venue TBA", image: "https://efg-final.s3.eu-north-1.amazonaws.com/cyber-first-kenya/kenya-cyber.png", logo: "/Cyber-First-East-Africa-Logo-01.png" },
  { city: "Doha", country: "Qatar", date: "September 2026", edition: "2nd Edition", href: "/events/cyber-first/qatar-2026", status: "soon", venue: "Venue TBA", image: "", logo: "" },
  { city: "New Delhi", country: "India", date: "10 October 2026", edition: "1st Edition", href: "/events/cyber-first/india-2026", status: "open", venue: "The Lalit Ashok", image: "https://efg-final.s3.eu-north-1.amazonaws.com/delhi2-bg.png", logo: "/Asset-5.svg" },
  { city: "Muscat", country: "Oman", date: "October 2026", edition: "5th Edition", href: "/events/cyber-first/oman-2026", status: "soon", venue: "Venue TBA", image: "", logo: "" },
  { city: "Riyadh", country: "Saudi Arabia", date: "October 2026", edition: "4th Edition", href: "/events/cyber-first/ksa-2026", status: "soon", venue: "Venue TBA", image: "", logo: "" },
];

const THESIS = [
  {
    num: "01",
    heading: "Practitioner-led, not vendor-driven.",
    body: "The stage belongs to people who own the risk: sitting CISOs, government cyber leaders, and operational defenders. Vendors earn their voice — they don't buy it.",
  },
  {
    num: "02",
    heading: "Invite-only rooms. Actual CISOs only.",
    body: "Every attendee is vetted before we issue a badge. No title inflation, no solution consultants posing as buyers. The conversations land because the room is real.",
  },
  {
    num: "03",
    heading: "Cross-border intelligence, not single-market noise.",
    body: "Threats don't respect geography, so neither do we. Seven editions across the Gulf, Africa, and South Asia — the same leaders in motion, compounding context as they travel.",
  },
];

const HERO_SERVICES = [
  { label: "Summits", desc: "Seven executive editions across the Gulf, Africa & South Asia" },
  { label: "Access", desc: "Invite-only CISO rooms & curated one-to-one introductions" },
  { label: "Awards", desc: "Stage-recognized category awards judged by sitting CISOs" },
  { label: "Media", desc: "Co-produced research, film, and on-stage launch assets" },
];

const HERO_STATS = [
  { value: "1,500+", label: "Senior Security Leaders" },
  { value: "7", label: "Cities · 3 Continents" },
  { value: "80+", label: "Speakers on Record" },
];

const ROLE_MIX = [
  { label: "CISOs & CSOs", pct: 32 },
  { label: "CTO & CIO", pct: 22 },
  { label: "Government Cyber Leaders", pct: 18 },
  { label: "Security Architects", pct: 15 },
  { label: "Vendor & Solution Leads", pct: 13 },
];

const INDUSTRIES = [
  "Banking & Financial Services",
  "Energy & Utilities",
  "Government & Public Sector",
  "Healthcare & Pharma",
  "Telecommunications",
  "Manufacturing",
  "Retail & E-Commerce",
  "Defense & Intelligence",
  "Critical Infrastructure",
];

const SPEAKERS = [
  { name: "H.E. Dr. Mohamed Al Kuwaiti", title: "Head of Cyber Security", org: "UAE Government", photo: `${S3}/boardroom/MohamedAlKuwaiti.jpg`, focus: "center 22%" },
  { name: "Sara Al Hosani", title: "Director, Cyber Threat Intelligence", org: "Dept of Government Enablement", photo: `${S3}/Speakers-photos/Cyber-First-uae/Sara-Al-Hosani.jpg` },
  { name: "Hussain Al Khalsan", title: "CISO", org: "Zand Bank", photo: `${S3}/Speakers-photos/Cyber-First-uae/Hussain-Al-Khalsan.jpg` },
  { name: "Bernard Assaf", title: "Regional CISO", org: "Airbus", photo: `${S3}/Speakers-photos/Cyber-First-uae/Bernard-Assaf.png` },
  { name: "James Wiles", title: "Head of Cyber Security MEA", org: "Cigna Healthcare", photo: `${S3}/Speakers-photos/Cyber-First-uae/James-Wiles.jpg` },
  { name: "Dr. Ebrahim Al Alkeem", title: "National Risk & Policy Director", org: "UAE Government", photo: `${S3}/Speakers-photos/OT-Security-First/Dr-Ebrahim-Al-Alkeem-Al-Zaabi.jpg` },
  { name: "Toufeeq Ahmed", title: "Group Head, Cyber Security", org: "Gargash Group", photo: `${S3}/Speakers-photos/Cyber-First-uae/Toufeeq-Ahmed.jpg` },
  { name: "Abdulwahab Algamhi", title: "Senior Director, Information Security", org: "Miral", photo: `${S3}/Speakers-photos/Cyber-First-uae/Abdulwahab-Al-Gamhi.jpg` },
];

const ENGAGEMENT_TIERS = [
  {
    num: "01",
    label: "Sponsor",
    tabKey: "sponsor",
    headline: "Own the room.",
    body: "Headline, strategic, or associate partnership across one or multiple editions. Keynote slots, branded lounges, CISO roundtables, full media & research packages.",
    features: [
      "Keynote & panel placement",
      "Branded boardroom or lounge",
      "Pre-qualified CISO introductions",
      "Full media rights · photo · video",
      "Co-authored research distribution",
    ],
    cta: "Request sponsorship deck",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Cyber+First+Kuwait+2025/filemail_photos/cyber21-04-410.jpg",
  },
  {
    num: "02",
    label: "Attend",
    tabKey: "pass",
    headline: "Earn the invite.",
    body: "Cyber First is invite-only for senior security leaders — CISOs, CTOs, directors, government cyber officials. Submit your details and we'll match you to the room where your mandate overlaps.",
    features: [
      "Invite-only, C-suite audience",
      "Chatham House Rule sessions",
      "CISO peer roundtables",
      "Cross-edition circuit access",
    ],
    cta: "Request an invite",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Cyber+First+Kuwait+2025/filemail_photos/cyber21-04-350.jpg",
  },
  {
    num: "03",
    label: "Speak",
    tabKey: "speaker",
    headline: "Take the stage.",
    body: "If you hold a senior cybersecurity brief — in government or enterprise — and have a point of view worth 20 minutes of a CISO's attention, we'd like to hear from you.",
    features: [
      "Keynote · Panel · Fireside",
      "CISO roundtable facilitation",
      "On-stage research launches",
      "Cross-edition speaker circuit",
    ],
    cta: "Submit a speaker profile",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-324.jpg",
  },
];

const SPONSOR_LOGOS = [
  `${S3_LOGOS}/Google-Cloud-Security.png`,
  `${S3_LOGOS}/Tenable-logo.png`,
  `${S3_LOGOS}/Akamai.png`,
  `${S3_LOGOS}/OPSWAT-logo.png`,
  `${S3_LOGOS}/PENTERA.png`,
  `${S3_LOGOS}/Anomali.png`,
  `${S3_LOGOS}/paloalto.png`,
  `${S3_LOGOS}/fortinet.png`,
  `${S3_LOGOS}/kaspersky.png`,
  `${S3_LOGOS}/bitdefender.png`,
  `${S3_LOGOS}/threatlocker.png`,
  `${S3_LOGOS}/Sonicwall.png`,
  `${S3_LOGOS}/ManageEngine.png`,
  `${S3_LOGOS}/corelight.png`,
  `${S3_LOGOS}/AmiViz.png`,
  `${S3_LOGOS}/Paramount.png`,
  `${S3_LOGOS}/bureau-veritas.png`,
  `${S3_LOGOS}/beacon-red.png`,
  `${S3_LOGOS}/filigran.png`,
  `${S3_LOGOS}/secureb4.png`,
  `${S3_LOGOS}/cortelion.png`,
  `${S3_LOGOS}/appknox.png`,
  `${S3_LOGOS}/Gen-x-systems.png`,
  `${S3_LOGOS}/kron-technologies.png`,
];

const TESTIMONIAL_IDS = ["jPQFjwuohfI", "c8sPwIo4Pis", "2LoeDNqsem0", "8C61dof_f3s", "2-KXhfSeBdQ", "2IwKmGEfOIo"];

// Event photo gallery — mixed aspect, chrome bezel treatment (Proof section)
const GALLERY_PHOTOS = [
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Cyber+First+Kuwait+2025/filemail_photos/cyber21-04-550.jpg", caption: "Panel session · Kuwait", aspect: "4 / 3" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Cyber+First+Kuwait+2025/filemail_photos/cyber21-04-324.jpg", caption: "On the main stage", aspect: "4 / 3" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0330.JPG", caption: "Awards ceremony", aspect: "4 / 3" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Cyber+First+Kuwait+2025/Kuwait+Photos/Kuwait+Photos/4X9A1744.jpg", caption: "The main hall", aspect: "4 / 3" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Cyber%20First%20Kuwait%202025/filemail_photos/cyber21-04-390.jpg", caption: "Delegates in session", aspect: "4 / 3" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/cyber-first-kenya/cyber21-04-504.jpg", caption: "Exhibition floor", aspect: "4 / 3" },
];

// Series films — in-motion proof for the first half of the page (recent → oldest)
const SERIES_FILMS = [
  {
    id: "AsrScRfgLpA",
    city: "UAE",
    edition: "Abu Dhabi",
    year: "2025",
    venue: "Abu Dhabi",
    headline: "The debut on home soil.",
    body: "The UAE edition brought the full series arc into one room — sitting CISOs, regulators, and operational defenders from across the Gulf. It set the standard for what an invite-only Cyber First room should feel like.",
  },
  {
    id: "gR-IUI7yJLg",
    city: "Kuwait",
    edition: "3rd Edition",
    year: "2024",
    venue: "Kuwait City",
    headline: "Three editions deep. The circuit finds its rhythm.",
    body: "The third Kuwait edition proved the thesis: cross-border threats need cross-border conversation. Regional leaders returning year-on-year turned the series into a standing forum, not a single-date event.",
  },
  {
    id: "0d_2Itsg6ec",
    city: "Qatar",
    edition: "Doha",
    year: "2023",
    venue: "Doha",
    headline: "Where the series began.",
    body: "The Doha edition was the proof-of-concept. A single room, a handful of sponsors willing to back the format, and the decision to run it again — the beginning of what is now a seven-edition corridor.",
  },
];

const CROSS_SELL = [
  { label: "OT Security First", href: "/events/ot-security-first", color: "#D34B9A", tagline: "Industrial cyber for critical infrastructure" },
  { label: "Digital First", href: "/events/data-ai-first", color: "#0F735E", tagline: "AI & data strategy for the intelligent enterprise" },
  { label: "OPEX First", href: "/events/opex-first", color: "#7C3AED", tagline: "Operational excellence, automation, ROI" },
  { label: "Roundtable", href: "/network-first", color: "#C9935A", tagline: "Invite-only executive boardrooms" },
];

// ─── PAGE ATMOSPHERE — darker, consistent cyan-ink background ────────────────
function PageAtmosphere() {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      overflow: "hidden",
    }} aria-hidden>
      {/* Base — deep ink with subtle cyan undertone */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg,
          ${INK} 0%,
          #060910 10%,
          #070c16 25%,
          #080f1a 50%,
          #070c16 75%,
          #060910 90%,
          ${INK} 100%)`,
      }} />

      {/* Consistent alternating side blooms down the page — one pattern, repeated */}
      <div style={{ position: "absolute", top: "-2%", left: "-18%", width: "58%", height: "28%", background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(1,187,245,0.10), transparent 72%)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", top: "14%", right: "-18%", width: "58%", height: "28%", background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(1,187,245,0.10), transparent 72%)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", top: "30%", left: "-18%", width: "58%", height: "28%", background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(1,187,245,0.10), transparent 72%)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", top: "46%", right: "-18%", width: "58%", height: "28%", background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(1,187,245,0.10), transparent 72%)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", top: "62%", left: "-18%", width: "58%", height: "28%", background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(1,187,245,0.10), transparent 72%)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", top: "78%", right: "-18%", width: "58%", height: "28%", background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(1,187,245,0.10), transparent 72%)", filter: "blur(80px)" }} />

      {/* Edge vignette — reinforces deep edges */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 110% 85% at 50% 50%, transparent 45%, rgba(5,6,8,0.7) 100%)",
        pointerEvents: "none",
      }} />

      {/* Grain overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.03,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ─── SECTION AMBIENT — ONE consistent pattern: single centered top bloom ─────
function SectionAmbient() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: "8%",
        left: "18%",
        right: "18%",
        height: "70%",
        background: "radial-gradient(ellipse 55% 50% at 50% 40%, rgba(1,187,245,0.11), rgba(1,187,245,0.03) 50%, transparent 75%)",
        filter: "blur(64px)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ─── UTILITY: page-level section label ───────────────────────────────────────
function SectionMark({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 28 }}>
      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, fontWeight: 700, color: CYAN, letterSpacing: "0.3em", fontVariantNumeric: "tabular-nums" }}>
        {num}
      </span>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${CYAN}66 0%, ${CYAN}18 50%, transparent 100%)` }} />
      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.32em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

// ─── ANIMATED NETWORK MESH (hero background) ─────────────────────────────────
function NetworkMesh() {
  const nodes = React.useMemo(() => {
    const out: { x: number; y: number; r: number; delay: number }[] = [];
    const seed = 73; // deterministic random
    let s = seed;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 54; i++) {
      out.push({ x: rand() * 100, y: rand() * 100, r: 1.2 + rand() * 2.4, delay: rand() * 4 });
    }
    return out;
  }, []);

  // Build connections to nearest neighbors (k=2)
  const connections = React.useMemo(() => {
    const out: { x1: number; y1: number; x2: number; y2: number; delay: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const dists = nodes.map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) })).filter((p) => p.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
      for (const { j } of dists) {
        if (i < j) out.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[j].x, y2: nodes[j].y, delay: (i + j) * 0.05 });
      }
    }
    return out;
  }, [nodes]);

  return (
    <svg
      aria-hidden
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.55 }}
    >
      <defs>
        <radialGradient id="cfm-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CYAN} stopOpacity="1" />
          <stop offset="60%" stopColor={CYAN} stopOpacity="0.5" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
        </radialGradient>
      </defs>
      {connections.map((c, i) => (
        <line
          key={`l${i}`}
          x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
          stroke={CYAN}
          strokeOpacity="0.12"
          strokeWidth="0.08"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={`n${i}`}
          cx={n.x} cy={n.y} r={n.r * 0.28}
          fill="url(#cfm-node)"
        >
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${3 + (i % 4)}s`} begin={`${n.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. HERO — Two-anchor composition (top + bottom blocks, shader breathes middle)
// ═════════════════════════════════════════════════════════════════════════════
function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100svh", background: INK, overflow: "hidden", color: "white", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {/* Shader */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <CyberFirstCloudsBg />
      </div>

      {/* Readability layers — darker at top + bottom where text sits, letting the shader breathe in the middle */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(5,6,8,0.72) 0%, rgba(5,6,8,0.25) 22%, rgba(5,6,8,0) 40%, rgba(5,6,8,0) 60%, rgba(5,6,8,0.35) 78%, rgba(5,6,8,0.8) 100%)`, zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 90% 100% at 50% 50%, transparent 40%, rgba(5,6,8,0.5) 100%)`, zIndex: 1, pointerEvents: "none" }} />

      {/* Content — stacked top + bottom blocks, tight rhythm */}
      <div style={{
        position: "relative",
        zIndex: 4,
        display: "flex",
        flexDirection: "column",
        gap: "clamp(24px, 3.5svh, 44px)",
        padding: "clamp(56px, 7svh, 88px) clamp(16px, 5vw, 80px) clamp(44px, 6svh, 72px)",
      }}>
        {/* ─── TOP BLOCK: brand intro + tagline + sub ───────────────────── */}
        <div style={{ textAlign: "center", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          {/* Series badge — glass + skeu hybrid pill */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
            style={{ marginBottom: "clamp(12px, 1.6vh, 20px)", display: "flex", justifyContent: "center" }}
          >
            {/* Ambient cyan halo behind the badge */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{
                position: "absolute",
                inset: -10,
                borderRadius: 999,
                background: "radial-gradient(ellipse 60% 90% at 50% 50%, rgba(1,187,245,0.18) 0%, transparent 70%)",
                filter: "blur(14px)",
                pointerEvents: "none",
              }} />

              {/* Outer metallic bezel */}
              <div className="cf-series-bezel" style={{
                position: "relative",
                padding: 1.5,
                borderRadius: 999,
                background: `linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.02) 65%, rgba(0,0,0,0.35) 100%)`,
                boxShadow: `0 10px 28px rgba(0,0,0,0.45), 0 0 36px rgba(1,187,245,0.12)`,
              }}>
                {/* Inner recessed panel */}
                <div style={{
                  position: "relative",
                  borderRadius: 999,
                  padding: "9px 18px 9px 14px",
                  background: `linear-gradient(180deg, rgba(10,12,18,0.85) 0%, rgba(5,7,12,0.92) 100%)`,
                  backdropFilter: "blur(20px) saturate(1.5)",
                  WebkitBackdropFilter: "blur(20px) saturate(1.5)",
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.15),
                    inset 0 -1px 0 rgba(0,0,0,0.5),
                    inset 0 0 16px rgba(0,0,0,0.4)
                  `,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  overflow: "hidden",
                }}>
                  {/* Shimmer sweep */}
                  <span className="cf-pill-shimmer" />

                  {/* Top refraction line */}
                  <span style={{ position: "absolute", top: 0, left: "18%", right: "18%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)", pointerEvents: "none", zIndex: 2 }} />

                  {/* Cyan pulse dot */}
                  <span style={{
                    position: "relative",
                    zIndex: 3,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${CYAN} 55%, #008eb8 100%)`,
                    boxShadow: `0 0 0 1.5px rgba(1,187,245,0.2), 0 0 10px ${CYAN}, inset 0 1px 0 rgba(255,255,255,0.6)`,
                    flexShrink: 0,
                  }} className="cf-pulse-dot" />

                  {/* Text with subtle gradient for lift */}
                  <span style={{
                    position: "relative",
                    zIndex: 3,
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: "0.42em",
                    textTransform: "uppercase",
                    backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    textShadow: "0 1px 0 rgba(0,0,0,0.5)",
                  }}>
                    The Series · 2026
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* BRAND — the hero introduction */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 200,
              fontSize: "clamp(40px, 9.2vw, 128px)",
              lineHeight: 1,
              letterSpacing: "-0.025em",
              margin: 0,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              textAlign: "center",
              display: "block",
              width: "100%",
            }}
          >
            <span className="cf-brand-shimmer">Cyber First</span>
          </motion.h1>

          {/* Tagline — premium glass + skeu pill */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
            style={{ marginTop: "clamp(14px, 1.8vh, 22px)", display: "flex", justifyContent: "center" }}
          >
            <div style={{ position: "relative", display: "inline-block", maxWidth: "min(100%, 780px)" }}>
              {/* Ambient cyan halo */}
              <div style={{
                position: "absolute",
                inset: -14,
                borderRadius: 999,
                background: "radial-gradient(ellipse 65% 120% at 50% 50%, rgba(1,187,245,0.22) 0%, transparent 72%)",
                filter: "blur(18px)",
                pointerEvents: "none",
              }} />

              {/* Metallic bezel */}
              <div style={{
                position: "relative",
                padding: 1.5,
                borderRadius: 999,
                background: `linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.02) 65%, rgba(0,0,0,0.4) 100%)`,
                boxShadow: `0 14px 36px rgba(0,0,0,0.5), 0 0 50px rgba(1,187,245,0.14)`,
              }}>
                {/* Recessed glass panel */}
                <div style={{
                  position: "relative",
                  borderRadius: 999,
                  padding: "clamp(11px, 1.3vh, 15px) clamp(22px, 2.8vw, 38px)",
                  background: `linear-gradient(180deg, rgba(14,18,28,0.78) 0%, rgba(6,9,15,0.88) 100%)`,
                  backdropFilter: "blur(22px) saturate(1.6)",
                  WebkitBackdropFilter: "blur(22px) saturate(1.6)",
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.18),
                    inset 0 -1px 0 rgba(0,0,0,0.55),
                    inset 0 0 24px rgba(0,0,0,0.35)
                  `,
                  overflow: "hidden",
                }}>
                  {/* Shimmer sweep */}
                  <span className="cf-pill-shimmer" />

                  {/* Top refraction hairline */}
                  <span style={{ position: "absolute", top: 0, left: "18%", right: "18%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", pointerEvents: "none", zIndex: 2 }} />

                  {/* Bottom inner shadow hairline — sells the recessed feel */}
                  <span style={{ position: "absolute", bottom: 0, left: "25%", right: "25%", height: 1, background: "linear-gradient(90deg, transparent, rgba(1,187,245,0.25), transparent)", pointerEvents: "none", zIndex: 2 }} />

                  {/* Text */}
                  <span style={{
                    position: "relative",
                    zIndex: 3,
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    fontSize: "clamp(14px, 2.2vw, 26px)",
                    lineHeight: 1.3,
                    letterSpacing: "-0.005em",
                    color: "rgba(255,255,255,0.95)",
                    textShadow: "0 1px 0 rgba(0,0,0,0.4)",
                    textAlign: "center",
                    textWrap: "balance" as "balance",
                  }}>
                    The CISOs of a region,{" "}
                    <span className="cf-accent-shimmer">in one room.</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sub — quieter glass + skeu pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
            style={{ marginTop: "clamp(10px, 1.1vh, 14px)", display: "flex", justifyContent: "center" }}
          >
            <div style={{ position: "relative", display: "inline-block", maxWidth: "min(100%, 640px)" }}>
              {/* Subtle ambient halo (quieter) */}
              <div style={{
                position: "absolute",
                inset: -10,
                borderRadius: 999,
                background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 75%)",
                filter: "blur(12px)",
                pointerEvents: "none",
              }} />

              {/* Metallic bezel (thinner) */}
              <div style={{
                position: "relative",
                padding: 1,
                borderRadius: 999,
                background: `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.015) 70%, rgba(0,0,0,0.32) 100%)`,
                boxShadow: `0 8px 24px rgba(0,0,0,0.4)`,
              }}>
                {/* Recessed glass panel */}
                <div style={{
                  position: "relative",
                  borderRadius: 999,
                  padding: "clamp(8px, 1vh, 11px) clamp(18px, 2.2vw, 28px)",
                  background: `linear-gradient(180deg, rgba(12,15,22,0.72) 0%, rgba(5,7,12,0.82) 100%)`,
                  backdropFilter: "blur(18px) saturate(1.4)",
                  WebkitBackdropFilter: "blur(18px) saturate(1.4)",
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.12),
                    inset 0 -1px 0 rgba(0,0,0,0.45),
                    inset 0 0 16px rgba(0,0,0,0.3)
                  `,
                  overflow: "hidden",
                }}>
                  <span className="cf-pill-shimmer" />

                  <span style={{ position: "absolute", top: 0, left: "22%", right: "22%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", pointerEvents: "none", zIndex: 2 }} />

                  <span style={{
                    position: "relative",
                    zIndex: 3,
                    display: "block",
                    fontFamily: "var(--font-outfit)",
                    fontSize: "clamp(11px, 1.2vw, 15px)",
                    fontWeight: 400,
                    lineHeight: 1.55,
                    color: "rgba(255,255,255,0.82)",
                    letterSpacing: "0.01em",
                    textShadow: "0 1px 0 rgba(0,0,0,0.35)",
                    textAlign: "center",
                    textWrap: "balance" as "balance",
                  }}>
                    The executive cybersecurity summit series for the Middle East, Africa, and South Asia.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── BOTTOM BLOCK: services + CTA + next edition ──────────────── */}
        <div style={{ maxWidth: 1120, margin: "0 auto", width: "100%" }}>
          {/* Services manifest — polished 4-column row with chrome number chips */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.6 }}
            className="cf-hero-services"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0,
              padding: "clamp(14px, 1.6vh, 20px) 0",
              position: "relative",
            }}
          >
            {/* Top rule — faint center-strong gradient */}
            <span style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 25%, rgba(1,187,245,0.35) 50%, rgba(255,255,255,0.1) 75%, transparent 100%)`, pointerEvents: "none" }} />
            {/* Bottom rule */}
            <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 25%, rgba(1,187,245,0.25) 50%, rgba(255,255,255,0.08) 75%, transparent 100%)`, pointerEvents: "none" }} />

            {HERO_SERVICES.map((s, i) => (
              <div
                key={s.label}
                className="cf-hero-service"
                style={{
                  borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                  padding: "4px clamp(12px, 1.8vw, 28px)",
                  textAlign: "center",
                  position: "relative",
                  transition: "background 0.4s ease",
                }}
              >
                {/* Chrome number chip */}
                <div className="cf-service-chip" style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  marginBottom: 10,
                  borderRadius: 10,
                  padding: 1,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.35) 100%)`,
                  boxShadow: `0 4px 14px rgba(0,0,0,0.4), 0 0 20px rgba(1,187,245,0.12)`,
                  transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease",
                }}>
                  <div style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: 9,
                    background: `linear-gradient(180deg, rgba(12,16,24,0.95) 0%, rgba(6,8,14,1) 100%)`,
                    boxShadow: `
                      inset 0 1px 0 rgba(255,255,255,0.16),
                      inset 0 -1px 0 rgba(0,0,0,0.55),
                      inset 0 0 10px rgba(0,0,0,0.45)
                    `,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}>
                    <span style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)", pointerEvents: "none" }} />
                    <span style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 11,
                      fontWeight: 700,
                      color: CYAN,
                      letterSpacing: "0.08em",
                      fontVariantNumeric: "tabular-nums",
                      textShadow: `0 0 8px rgba(1,187,245,0.5)`,
                    }}>
                      0{i + 1}
                    </span>
                  </div>
                </div>

                <div style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(10.5px, 1vw, 12px)",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.95)",
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}>
                  {s.label}
                </div>
                <div style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(10.5px, 1vw, 11.5px)",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.52)",
                  lineHeight: 1.5,
                  textWrap: "balance" as "balance",
                }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA + next edition — single horizontal row, aligned on same baseline */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.8 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(14px, 2vw, 26px)",
              marginTop: "clamp(14px, 1.8vh, 22px)",
            }}
            className="cf-hero-actions"
          >
            <Link
              href="#engage"
              className="cf-hero-cta"
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "15px 30px 15px 34px",
                background: `linear-gradient(180deg, #40d4ff 0%, ${CYAN} 55%, #0095c8 100%)`,
                color: INK,
                fontFamily: "var(--font-outfit)",
                fontSize: 14.5,
                fontWeight: 600,
                letterSpacing: "0.01em",
                textDecoration: "none",
                borderRadius: 999,
                transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.55),
                  inset 0 -1px 0 rgba(0,30,50,0.25),
                  inset 0 0 0 0.5px rgba(255,255,255,0.2),
                  0 1px 3px rgba(0,0,0,0.5),
                  0 14px 38px rgba(1,187,245,0.3),
                  0 0 70px rgba(1,187,245,0.12)
                `,
                overflow: "hidden",
              }}
            >
              <span style={{ position: "absolute", top: 1, left: "10%", right: "10%", height: "38%", background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)", borderRadius: "999px 999px 50% 50%", pointerEvents: "none", filter: "blur(0.3px)" }} />
              <span style={{ position: "relative", zIndex: 2 }}>Partner with us</span>
              <span style={{ position: "relative", zIndex: 2, fontSize: 15, marginTop: -1, transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)" }} className="cf-hero-cta-arrow">→</span>
            </Link>

            {/* Chromed vertical divider */}
            <span className="cf-hero-divider" style={{
              display: "inline-block",
              width: 1,
              height: 32,
              background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.22) 40%, rgba(255,255,255,0.22) 60%, transparent 100%)`,
              boxShadow: `0 0 8px rgba(255,255,255,0.08)`,
            }} />

            {/* Secondary link — subtle glass chip */}
            <Link
              href="#engage"
              className="cf-hero-next"
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 20px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(14px) saturate(1.3)",
                WebkitBackdropFilter: "blur(14px) saturate(1.3)",
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 14px rgba(0,0,0,0.25)`,
                fontFamily: "var(--font-outfit)",
                fontSize: 13.5,
                fontWeight: 500,
                color: "rgba(255,255,255,0.82)",
                textDecoration: "none",
                letterSpacing: "0.015em",
                transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                overflow: "hidden",
              }}
            >
              <span style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)", pointerEvents: "none" }} />
              <span style={{ position: "relative", zIndex: 2 }}>How we partner</span>
              <span className="cf-hero-next-arrow" style={{
                position: "relative",
                zIndex: 2,
                display: "inline-flex",
                alignItems: "center",
                color: CYAN,
                fontSize: 13,
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
              }}>→</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue — chrome-rimmed glass capsule */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.1, ease: EASE }}
        style={{
          position: "absolute",
          bottom: 22,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        <div style={{
          position: "relative",
          padding: 1,
          borderRadius: 999,
          background: `linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.35) 100%)`,
          boxShadow: `0 6px 18px rgba(0,0,0,0.4), 0 0 22px rgba(1,187,245,0.1)`,
        }}>
          <div style={{
            position: "relative",
            width: 22,
            height: 40,
            borderRadius: 999,
            background: "rgba(8,10,14,0.75)",
            backdropFilter: "blur(10px) saturate(1.3)",
            WebkitBackdropFilter: "blur(10px) saturate(1.3)",
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.14),
              inset 0 -1px 0 rgba(0,0,0,0.5),
              inset 0 0 10px rgba(0,0,0,0.4)
            `,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
          }}>
            <span style={{ position: "absolute", top: 2, left: "25%", right: "25%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)", pointerEvents: "none" }} />
            <div className="cf-scroll-tick" style={{
              position: "absolute",
              top: 6,
              width: 2,
              height: 7,
              borderRadius: 2,
              background: `linear-gradient(180deg, ${CYAN}, rgba(1,187,245,0.3) 70%, transparent)`,
              boxShadow: `0 0 8px ${CYAN}`,
            }} />
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes cf-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.4); }
        }
        .cf-pulse-dot { animation: cf-pulse 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes cf-text-shimmer {
          0%   { background-position: 200% 50%; }
          100% { background-position: -40% 50%; }
        }
        @keyframes cf-accent-shimmer-sweep {
          0%   { background-position: 260% 50%; }
          100% { background-position: -80% 50%; }
        }
        /* Brand title — cool-white base, bright cyan-haloed shine sweeps across */
        .cf-brand-shimmer {
          background-image: linear-gradient(
            105deg,
            rgba(205, 230, 250, 0.78) 0%,
            rgba(215, 238, 255, 0.85) 30%,
            ${CYAN} 42%,
            #d8f3ff 48%,
            #ffffff 50%,
            #d8f3ff 52%,
            ${CYAN} 58%,
            rgba(215, 238, 255, 0.85) 70%,
            rgba(205, 230, 250, 0.78) 100%
          );
          background-size: 220% 100%;
          background-position: 200% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: cf-text-shimmer 5s cubic-bezier(0.55, 0, 0.45, 1) infinite;
          filter: drop-shadow(0 0 42px rgba(1,187,245,0.32));
        }
        /* Tagline accent — solid cyan base, narrow bright shine sweeps across */
        .cf-accent-shimmer {
          display: inline-block;
          padding: 0 0.12em;
          margin: 0 -0.12em;
          background-image: linear-gradient(
            105deg,
            ${CYAN} 0%,
            ${CYAN} 44%,
            #c8efff 48%,
            #ffffff 50%,
            #c8efff 52%,
            ${CYAN} 56%,
            ${CYAN} 100%
          );
          background-size: 300% 100%;
          background-position: 260% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: cf-accent-shimmer-sweep 5.5s cubic-bezier(0.55, 0, 0.45, 1) infinite;
          animation-delay: 1.5s;
          filter: drop-shadow(0 0 18px rgba(1,187,245,0.22));
        }
        @keyframes cf-pill-shimmer {
          0%   { left: -85%; }
          100% { left: 185%; }
        }
        .cf-pill-shimmer {
          position: absolute;
          top: 0;
          left: -85%;
          width: 48%;
          height: 100%;
          background: linear-gradient(100deg, transparent 0%, rgba(1,187,245,0.08) 35%, rgba(255,255,255,0.18) 50%, rgba(1,187,245,0.08) 65%, transparent 100%);
          transform: skewX(-18deg);
          pointer-events: none;
          z-index: 1;
          animation: cf-pill-shimmer 6.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
          border-radius: 999px;
        }
        .cf-hero-pill-sub .cf-pill-shimmer {
          animation-duration: 8s;
          animation-delay: 2.2s;
          background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
        }
        @keyframes cf-scroll-drop {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(18px); opacity: 0; }
        }
        .cf-scroll-tick { animation: cf-scroll-drop 2s cubic-bezier(0.5, 0, 0.5, 1) infinite; }
        .cf-hero-cta:hover {
          transform: translateY(-2px) scale(1.02);
          background: linear-gradient(180deg, #66dfff 0%, #27c5f5 55%, #009fd0 100%) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.65),
            inset 0 -1px 0 rgba(0,30,50,0.3),
            inset 0 0 0 0.5px rgba(255,255,255,0.25),
            0 2px 6px rgba(0,0,0,0.6),
            0 20px 50px rgba(1,187,245,0.5),
            0 0 90px rgba(1,187,245,0.28) !important;
        }
        .cf-hero-cta:hover .cf-hero-cta-arrow { transform: translateX(4px); }
        .cf-hero-next:hover {
          color: rgba(255,255,255,0.98) !important;
          background: rgba(1,187,245,0.08) !important;
          border-color: rgba(1,187,245,0.32) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 6px 20px rgba(1,187,245,0.22) !important;
          transform: translateY(-1px);
        }
        .cf-hero-next:hover .cf-hero-next-arrow { transform: translateX(4px); }
        .cf-hero-service { cursor: default; }
        .cf-hero-service:hover .cf-service-chip {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.5), 0 0 30px rgba(1,187,245,0.3) !important;
        }
        @media (max-width: 960px) {
          .cf-hero-services {
            grid-template-columns: repeat(2, 1fr) !important;
            row-gap: 20px !important;
          }
          .cf-hero-services > .cf-hero-service:nth-child(odd) { border-left: none !important; }
          .cf-hero-services > .cf-hero-service:nth-child(n+3) {
            padding-top: 20px !important;
            border-top: 1px solid rgba(255,255,255,0.08) !important;
          }
          .cf-hero-divider { display: none !important; }
          .cf-hero-actions { flex-direction: column !important; gap: 14px !important; }
          .cf-hero-cta { width: 100% !important; justify-content: center !important; max-width: 320px !important; }
          .cf-hero-next { width: 100% !important; justify-content: center !important; max-width: 320px !important; }
        }
        @media (max-width: 480px) {
          .cf-hero-services {
            grid-template-columns: 1fr !important;
            row-gap: 16px !important;
          }
          .cf-hero-services > .cf-hero-service {
            border-left: none !important;
            padding-top: 16px !important;
          }
          .cf-hero-services > .cf-hero-service:not(:first-child) {
            border-top: 1px solid rgba(255,255,255,0.08) !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── HERO STATS — premium editorial row with chrome accents ──────────────────
function HeroStats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{
      background: "transparent",
      padding: "clamp(24px, 3vw, 40px) 0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Top rule — cyan accent peak at center */}
      <span style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(1,187,245,0.4) 50%, rgba(255,255,255,0.08) 80%, transparent 100%)" }} />
      {/* Bottom rule */}
      <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 25%, rgba(1,187,245,0.22) 50%, rgba(255,255,255,0.06) 75%, transparent 100%)" }} />

      {/* Ambient center cyan glow */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        height: "140%",
        background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(1,187,245,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
        filter: "blur(22px)",
      }} />

      {/* Faint top-edge glow */}
      <div style={{ position: "absolute", top: -1, left: "30%", right: "30%", height: 6, background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(1,187,245,0.35), transparent 70%)", filter: "blur(4px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: "clamp(16px, 2vh, 24px)" }}
        >
          <span style={{ width: 32, height: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.4))" }} />
          <span style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}>
            At a Glance
          </span>
          <span style={{ width: 32, height: 1, background: "linear-gradient(to left, transparent, rgba(255,255,255,0.4))" }} />
        </motion.div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(24px, 3vw, 56px)" }} className="cf-herostats-grid">
          {HERO_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 + i * 0.12, ease: EASE }}
              className="cf-herostat-item"
              style={{
                position: "relative",
                textAlign: "center",
              }}
            >
              {/* Chromed vertical divider (before each except first) */}
              {i > 0 && (
                <span style={{
                  position: "absolute",
                  left: "clamp(-12px, -1.5vw, -28px)",
                  top: "12%",
                  bottom: "12%",
                  width: 1,
                  background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.08) 25%, rgba(1,187,245,0.25) 50%, rgba(255,255,255,0.08) 75%, transparent 100%)",
                  boxShadow: "0 0 8px rgba(1,187,245,0.08)",
                  pointerEvents: "none",
                }} className="cf-herostat-divider" />
              )}

              {/* Ambient cyan bloom behind the big number */}
              <div style={{
                position: "absolute",
                top: "38%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70%",
                height: "90%",
                background: "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(1,187,245,0.18) 0%, transparent 70%)",
                filter: "blur(20px)",
                pointerEvents: "none",
                zIndex: 0,
              }} />

              {/* Big number — gradient fill with cyan bloom */}
              <div style={{
                position: "relative",
                zIndex: 2,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(34px, 3.8vw, 58px)",
                fontWeight: 200,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                backgroundImage: "linear-gradient(180deg, #ffffff 0%, rgba(200,230,250,0.75) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                filter: "drop-shadow(0 0 24px rgba(1,187,245,0.2))",
              }}>
                {s.value}
              </div>

              {/* Cyan accent underline */}
              <div style={{
                width: 32,
                height: 1.5,
                margin: "10px auto 8px",
                background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
                boxShadow: `0 0 10px ${CYAN}80`,
              }} />

              {/* Label */}
              <div style={{
                position: "relative",
                zIndex: 2,
                fontFamily: "var(--font-dm-sans)",
                fontSize: 10.5,
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 760px) {
          .cf-herostats-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .cf-herostat-divider { display: none !important; }
          .cf-herostats-grid > div + div::before {
            content: "";
            position: absolute;
            top: -18px;
            left: 20%;
            right: 20%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(1,187,245,0.25), transparent);
          }
        }
      `}</style>
    </section>
  );
}

// ─── Chrome-framed photo used in the Thesis section ─────────────────────────
function ThesisPhoto({ src, alt, aspect, location, tagline, year, translateX = 0 }: {
  src: string;
  alt: string;
  aspect: string;
  location: string;
  tagline: string;
  year: string;
  translateX?: number;
}) {
  return (
    <div
      className="cf-thesis-photo"
      style={{
        position: "relative",
        transform: `translateX(${translateX}px)`,
        transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div style={{
        position: "relative",
        padding: 2,
        borderRadius: 16,
        background: "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 28%, rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.08) 75%, rgba(1,187,245,0.38) 100%)",
        boxShadow: "0 22px 54px rgba(0,0,0,0.5), 0 0 40px rgba(1,187,245,0.12), 0 0 0 1px rgba(255,255,255,0.03)",
      }}>
        <div style={{ position: "absolute", inset: 2, borderRadius: 14, pointerEvents: "none", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.45)", zIndex: 3 }} />
        <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", aspectRatio: aspect, background: "#000" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="cf-thesis-photo-img"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 35%",
              filter: "saturate(0.9) contrast(1.08) brightness(0.8)",
              transition: "transform 1s cubic-bezier(0.22,1,0.36,1), filter 0.6s ease",
            }}
          />
          {/* Overlays */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,8,14,0.15) 0%, transparent 30%, transparent 55%, rgba(5,8,14,0.78) 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(1,187,245,0.08), transparent 45%, rgba(1,187,245,0.08) 100%)", mixBlendMode: "overlay" as const, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.05, mixBlendMode: "overlay" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px 180px", pointerEvents: "none" }} />

          {/* Caption chip — bottom-left */}
          <div style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px 8px 12px",
            borderRadius: 999,
            background: "rgba(5,8,12,0.55)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(14px) saturate(1.4)",
            WebkitBackdropFilter: "blur(14px) saturate(1.4)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 14px rgba(0,0,0,0.4)",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: CYAN, boxShadow: `0 0 8px ${CYAN}`, flexShrink: 0 }} />
            <span style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 9.5,
              fontWeight: 700,
              color: CYAN,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}>
              {tagline}
            </span>
            <span style={{ width: 1, height: 11, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
            <span style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11.5,
              fontWeight: 500,
              color: "white",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}>
              {location}
            </span>
          </div>

          {/* Year stamp — bottom-right */}
          <div style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 9px",
            borderRadius: 6,
            background: "rgba(5,8,12,0.55)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px) saturate(1.4)",
            WebkitBackdropFilter: "blur(10px) saturate(1.4)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.35)",
          }}>
            <span style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,255,255,0.72)",
              letterSpacing: "0.2em",
              fontVariantNumeric: "tabular-nums",
            }}>
              {year}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. THESIS
// ═════════════════════════════════════════════════════════════════════════════
function Thesis() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="thesis" style={{ background: "transparent", padding: "clamp(40px, 5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      <SectionAmbient />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>
        <SectionMark num="02" label="The Thesis" />

        {/* Split layout — headline + paragraphs on left, cinematic photo on right */}
        <div className="cf-thesis-split" style={{
          display: "grid",
          gridTemplateColumns: "1.25fr 1fr",
          gap: "clamp(40px, 5vw, 88px)",
          alignItems: "center",
          marginTop: "clamp(24px, 3vh, 36px)",
        }}>
          {/* Left — headline + paragraphs */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(28px, 3.6vw, 52px)",
                lineHeight: 1.12,
                letterSpacing: "-0.03em",
                color: "white",
                margin: "0 0 clamp(28px, 3.4vh, 44px)",
                maxWidth: 620,
                textWrap: "balance" as "balance",
              }}
            >
              Most summits sell access. We curate{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                <span className="cf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "11s" }}>
                  intelligence
                </span>
                {/* Hairline accent under the word */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: "-0.08em",
                    height: 1,
                    background: `linear-gradient(90deg, transparent 0%, ${CYAN}88 25%, ${CYAN} 50%, ${CYAN}88 75%, transparent 100%)`,
                    boxShadow: `0 0 14px ${CYAN}55`,
                    opacity: 0.85,
                    pointerEvents: "none",
                  }}
                />
              </span>
              .
            </motion.h2>

            <div style={{ display: "grid", gap: 0 }}>
              {THESIS.map((t, i) => (
                <motion.div
                  key={t.num}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.18 + i * 0.12, ease: EASE }}
                  className="cf-thesis-row"
                  style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "clamp(14px, 1.6vw, 22px)",
                    alignItems: "baseline",
                    padding: "clamp(16px, 2vh, 22px) 0",
                  }}
                >
                  {i > 0 && (
                    <span style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 15%, rgba(1,187,245,0.3) 50%, rgba(255,255,255,0.06) 85%, transparent 100%)",
                      pointerEvents: "none",
                    }} />
                  )}

                  {/* Chrome micro-chip number marker */}
                  <span
                    className="cf-thesis-chip"
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: 999,
                      padding: 1,
                      background: "linear-gradient(140deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.02) 65%, rgba(1,187,245,0.42) 100%)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02)",
                      top: 6,
                      flexShrink: 0,
                    }}
                  >
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      borderRadius: 999,
                      background: "radial-gradient(circle at 50% 30%, rgba(20,28,40,0.96), rgba(7,10,16,0.98))",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.6)",
                      position: "relative",
                    }}>
                      <span style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: CYAN,
                        letterSpacing: "0.06em",
                        fontVariantNumeric: "tabular-nums",
                        lineHeight: 1,
                        textShadow: `0 0 10px ${CYAN}55`,
                      }}>
                        {t.num}
                      </span>
                      {/* refraction hairline */}
                      <span style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 999,
                        background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 40%)",
                        pointerEvents: "none",
                      }} />
                    </span>
                  </span>

                  <p style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: "clamp(16px, 1.2vw, 20px)",
                    fontWeight: 300,
                    lineHeight: 1.68,
                    color: "rgba(255,255,255,0.62)",
                    margin: 0,
                    textWrap: "pretty" as "pretty",
                  }}>
                    <span style={{
                      color: "white",
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                    }}>
                      {t.heading}
                    </span>
                    <span>{" "}</span>
                    {t.body}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>

          {/* Right — asymmetric dual-photo composition with chrome bezels */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            style={{ position: "relative" }}
          >
            {/* Ambient cyan halo behind the whole composition */}
            <div style={{
              position: "absolute",
              inset: -40,
              borderRadius: 36,
              background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(1,187,245,0.22), transparent 70%)",
              filter: "blur(48px)",
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16 }}>
              <ThesisPhoto
                src={`${S3}/cyber-first-kenya/cyber21-04-504.jpg`}
                alt="Cyber First UAE — the exhibition floor"
                aspect="16 / 10"
                location="Cyber First · UAE"
                tagline="The floor"
                year="2025"
                translateX={10}
              />
              <ThesisPhoto
                src={`${S3}/events/Cyber+First+Kuwait+2025/Kuwait+Photos/Kuwait+Photos/4X9A1744.jpg`}
                alt="Cyber First Kuwait — the main hall"
                aspect="16 / 10"
                location="Cyber First · Kuwait"
                tagline="The room"
                year="2025"
                translateX={-10}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .cf-thesis-photo:hover .cf-thesis-photo-img {
          transform: scale(1.04);
          filter: saturate(1) contrast(1.1) brightness(0.9) !important;
        }
        .cf-thesis-chip {
          transition: box-shadow 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .cf-thesis-row:hover .cf-thesis-chip {
          box-shadow: 0 6px 18px rgba(0,0,0,0.5), 0 0 22px rgba(1,187,245,0.32), 0 0 0 1px rgba(255,255,255,0.04) !important;
          transform: translateY(-1px);
        }
        @media (max-width: 900px) {
          .cf-thesis-split {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .cf-thesis-photo {
            transform: none !important;
          }
        }
        @media (max-width: 640px) {
          .cf-thesis-row {
            grid-template-columns: auto 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. IN MOTION — series films bento (first-half trust-building)
// ═════════════════════════════════════════════════════════════════════════════
function FilmCard({ film }: { film: typeof SERIES_FILMS[0] }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      role={playing ? undefined : "button"}
      tabIndex={playing ? undefined : 0}
      aria-label={playing ? undefined : `Play ${film.city} ${film.edition} highlight reel`}
      onClick={() => !playing && setPlaying(true)}
      onKeyDown={(e) => { if (!playing && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setPlaying(true); } }}
      className="cf-film-card"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 12,
        overflow: "hidden",
        cursor: playing ? "default" : "pointer",
        background: "#000",
        boxShadow: "0 14px 36px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 30px rgba(1,187,245,0.06)",
        transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease",
      }}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${film.id}?autoplay=1&rel=0&modestbranding=1`}
          title={`${film.city} — ${film.edition}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${film.id}/maxresdefault.jpg`}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${film.id}/hqdefault.jpg`; }}
            alt={`${film.city} highlight reel thumbnail`}
            loading="lazy"
            className="cf-film-img"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.78) saturate(0.92)", transition: "filter 0.5s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)" }}
          />
          {/* Bottom gradient */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.8) 100%)", pointerEvents: "none" }} />
          {/* Subtle cyan overlay tint */}
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 60%, rgba(1,187,245,0.08), transparent 70%)`, pointerEvents: "none", mixBlendMode: "overlay" as const }} />
          {/* Top hairline reflection */}
          <div style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`, pointerEvents: "none" }} />

          {/* Play button — Apple-glossy cyan orb */}
          <div className="cf-film-play" style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 64,
            height: 64,
            borderRadius: "50%",
            padding: 1,
            background: `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.08) 100%)`,
            transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: `linear-gradient(180deg, #40d4ff 0%, ${CYAN} 55%, #0089bb 100%)`,
              boxShadow: `
                inset 0 1.5px 0 rgba(255,255,255,0.55),
                inset 0 -1px 0 rgba(0,30,50,0.3),
                0 10px 30px rgba(1,187,245,0.5),
                0 0 70px rgba(1,187,245,0.25)
              `,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{ position: "absolute", top: "8%", left: "22%", right: "22%", height: "32%", background: "radial-gradient(ellipse at center top, rgba(255,255,255,0.55), transparent 70%)", pointerEvents: "none", borderRadius: "50%" }} />
              <svg width={16} height={19} viewBox="0 0 20 22" fill="none" style={{ position: "relative", marginLeft: 2 }}>
                <path d="M19 11L0.999999 21.3923L1 0.607696L19 11Z" fill={INK} />
              </svg>
            </div>
          </div>

          {/* Location badge — glass chip */}
          <div style={{
            position: "absolute",
            bottom: 14,
            left: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            padding: "7px 13px 7px 11px",
            borderRadius: 999,
            background: "rgba(5,8,12,0.6)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(14px) saturate(1.4)",
            WebkitBackdropFilter: "blur(14px) saturate(1.4)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 14px rgba(0,0,0,0.4)",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: CYAN,
              boxShadow: `0 0 8px ${CYAN}, 0 0 0 2px rgba(1,187,245,0.2)`,
            }} />
            <span style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              fontWeight: 500,
              color: "white",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}>
              {film.city}
              <span style={{ color: "rgba(255,255,255,0.55)", margin: "0 6px" }}>·</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>{film.edition}</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function EditionRow({ film, reverse, index, inView }: {
  film: typeof SERIES_FILMS[0];
  reverse: boolean;
  index: number;
  inView: boolean;
}) {
  return (
    <div
      className={`cf-edition-row${reverse ? " cf-edition-reverse" : ""}`}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(32px, 4.5vw, 72px)",
        alignItems: "center",
      }}
    >
      {/* Video column */}
      <motion.div
        className="cf-edition-video"
        initial={{ opacity: 0, x: reverse ? 28 : -28, scale: 0.98 }}
        animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.1 + index * 0.1, ease: EASE }}
        style={{ position: "relative", aspectRatio: "16 / 9", order: reverse ? 2 : 1 }}
      >
        <FilmCard film={film} />
      </motion.div>

      {/* Text column */}
      <motion.div
        className="cf-edition-text"
        initial={{ opacity: 0, x: reverse ? -28 : 28 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.2 + index * 0.1, ease: EASE }}
        style={{ display: "flex", flexDirection: "column", gap: 18, order: reverse ? 1 : 2 }}
      >
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            width: 28,
            height: 1,
            background: `linear-gradient(90deg, ${CYAN}, transparent)`,
            opacity: 0.8,
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 10.5,
            fontWeight: 700,
            color: FAINT,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontVariantNumeric: "tabular-nums",
          }}>
            {film.year} · {film.city}
          </span>
        </div>

        {/* Headline */}
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: "clamp(24px, 2.4vw, 36px)",
          lineHeight: 1.14,
          letterSpacing: "-0.025em",
          color: "white",
          margin: 0,
          textWrap: "balance" as "balance",
        }}>
          {film.headline}
        </h3>

        {/* Body */}
        <p style={{
          fontFamily: "var(--font-outfit)",
          fontSize: "clamp(15px, 1.05vw, 17px)",
          fontWeight: 300,
          lineHeight: 1.72,
          color: MUTE,
          margin: 0,
          maxWidth: 520,
          textWrap: "pretty" as "pretty",
        }}>
          {film.body}
        </p>

        {/* Location chip */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "7px 13px 7px 11px",
          borderRadius: 999,
          background: "rgba(5,8,12,0.55)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px) saturate(1.4)",
          WebkitBackdropFilter: "blur(12px) saturate(1.4)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.35)",
          alignSelf: "flex-start",
          marginTop: 4,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: CYAN, boxShadow: `0 0 8px ${CYAN}`, flexShrink: 0 }} />
          <span style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 10.5,
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}>
            Cyber First · {film.venue}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function InMotion() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { val: "3", label: "editions run" },
    { val: "2", label: "countries" },
    { val: "120+", label: "organisations" },
    { val: "380+", label: "UAE 2026 attendees" },
  ];

  return (
    <section ref={ref} id="past" style={{ background: "transparent", padding: "clamp(48px, 6vw, 84px) 0", position: "relative", overflow: "hidden" }}>
      <SectionAmbient />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>
        <SectionMark num="03" label="The Past" />

        {/* Narrative block — year rail on left, story + stats on right */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          className="cf-past-narrative"
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: "clamp(28px, 4vw, 72px)",
            alignItems: "start",
            marginBottom: "clamp(32px, 4vw, 52px)",
          }}
        >
          {/* Left rail — year label */}
          <div>
            <div style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 11,
              fontWeight: 700,
              color: FAINT,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}>
              Past · 2023—25
            </div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 3.4vw, 48px)",
              fontWeight: 300,
              color: "white",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}>
              2023<span style={{ color: CYAN }}>—</span>25
            </div>
            <div style={{
              width: 48,
              height: 1,
              background: `linear-gradient(90deg, ${CYAN}, transparent)`,
              marginTop: 18,
              opacity: 0.7,
            }} />
          </div>

          {/* Right column — headline + sub + narrative + stats */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(30px, 4vw, 58px)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                color: "white",
                margin: "0 0 14px",
                maxWidth: 780,
                textWrap: "balance" as "balance",
              }}
            >
              Three editions.{" "}
              <span style={{ color: CYAN, fontStyle: "italic", fontWeight: 400 }}>
                One narrative.
              </span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(15px, 1.15vw, 18px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.72)",
                letterSpacing: "0.005em",
                marginBottom: 28,
              }}
            >
              The proof-of-concept years.
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(16px, 1.1vw, 18px)",
                fontWeight: 300,
                lineHeight: 1.7,
                color: MUTE,
                margin: "0 0 36px",
                maxWidth: 680,
                textWrap: "pretty" as "pretty",
              }}
            >
              Three editions in Kuwait and the UAE. <span style={{ color: "white", fontWeight: 500 }}>1,500+ senior security leaders</span> on record. <span style={{ color: "white", fontWeight: 500 }}>50+ sponsors</span> who came back. Enough to prove the model. Enough to know the demand was structural, not circumstantial.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "clamp(16px, 2.2vw, 32px)",
                paddingTop: 20,
                borderTop: `1px solid ${RULE}`,
              }}
              className="cf-past-stats"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(26px, 2.6vw, 38px)",
                    fontWeight: 300,
                    color: CYAN,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}>
                    {s.val}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 10,
                    fontWeight: 600,
                    color: FAINT,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    marginTop: 8,
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Zigzag editorial rows — recent → oldest, alternating sides */}
        <div
          className="cf-past-editions"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(24px, 3vw, 40px)",
          }}
        >
          {SERIES_FILMS.map((f, i) => (
            <EditionRow key={f.id} film={f} reverse={i % 2 === 1} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .cf-film-card:hover .cf-film-img {
          filter: brightness(0.92) saturate(1) !important;
          transform: scale(1.04);
        }
        .cf-film-card:hover .cf-film-play {
          transform: translate(-50%, -50%) scale(1.08);
        }
        @media (max-width: 900px) {
          .cf-past-narrative {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .cf-edition-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .cf-edition-row .cf-edition-video { order: 1 !important; }
          .cf-edition-row .cf-edition-text  { order: 2 !important; }
        }
        @media (max-width: 620px) {
          .cf-past-stats {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. ARC (past / present / future)
// ═════════════════════════════════════════════════════════════════════════════
function Arc() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="arc" style={{ background: "transparent", padding: "clamp(48px, 6vw, 84px) 0", position: "relative", overflow: "hidden" }}>
      <SectionAmbient />
      {/* Faint horizontal rule top */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${CYAN}30, transparent)` }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <SectionMark num="04" label="The Arc" />

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(32px, 4.5vw, 64px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "white",
            margin: "0 0 40px",
            maxWidth: 960,
          }}
        >
          From here,{" "}
          <span className="cf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "10s" }}>
            the corridor widens.
          </span>
        </motion.h2>

        {/* ─── PRESENT — horizontal strip ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
            paddingBottom: 18,
            marginBottom: 20,
            borderBottom: `1px solid ${RULE}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 700, color: CYAN, letterSpacing: "0.3em", textTransform: "uppercase" }}>
              Present · 2026
            </span>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${CYAN}, transparent)`, opacity: 0.7 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 1.4vw, 20px)", fontWeight: 400, fontStyle: "italic", color: "rgba(255,255,255,0.78)", letterSpacing: "-0.01em" }}>
              Six editions. Three continents. One conversation.
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 600, color: FAINT, letterSpacing: "0.22em", textTransform: "uppercase", fontVariantNumeric: "tabular-nums" }}>
            03 Open <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 6px" }}>·</span> 03 Upcoming
          </span>
        </motion.div>

        {/* Open editions — full premium cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.28, ease: EASE }}
          className="cf-arc-strip"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(14px, 1.4vw, 20px)",
            marginBottom: 26,
          }}
        >
          {EDITIONS_2026.filter((ed) => ed.status === "open").map((ed, i) => (
            <Link
              key={ed.city}
              href={ed.href}
              scroll
              className="cf-arc-card"
              style={{
                position: "relative",
                display: "block",
                padding: 1.5,
                borderRadius: 16,
                background: `linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 28%, rgba(255,255,255,0.02) 62%, ${CYAN}55 100%)`,
                boxShadow: `0 14px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02), 0 0 28px ${CYAN}14`,
                textDecoration: "none",
                color: "inherit",
                overflow: "hidden",
                transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease",
              }}
            >
              <div style={{
                position: "relative",
                borderRadius: 14.5,
                overflow: "hidden",
                aspectRatio: "16 / 10",
                background: "#05070b",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.55)",
              }}>
                {/* Hero image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ed.image}
                  alt={`${ed.city} edition venue`}
                  loading="lazy"
                  className="cf-arc-card-img"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 40%",
                    filter: "saturate(0.88) contrast(1.08) brightness(0.66)",
                    transition: "transform 1s cubic-bezier(0.22,1,0.36,1), filter 0.6s ease",
                  }}
                />

                {/* Dark legibility gradient — top to bottom */}
                <span style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(5,7,11,0.55) 0%, rgba(5,7,11,0.2) 22%, rgba(5,7,11,0.35) 52%, rgba(5,7,11,0.9) 100%)",
                  pointerEvents: "none",
                }} />
                {/* Cyan brand tint */}
                <span style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(135deg, ${CYAN}10 0%, transparent 40%, ${CYAN}0a 100%)`,
                  mixBlendMode: "overlay" as const,
                  pointerEvents: "none",
                }} />
                {/* Film grain */}
                <span style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.06,
                  mixBlendMode: "overlay" as const,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: "180px 180px",
                  pointerEvents: "none",
                }} />
                {/* Top cyan caustic */}
                <span style={{
                  position: "absolute",
                  top: 0,
                  left: "12%",
                  right: "12%",
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
                  opacity: 0.7,
                  pointerEvents: "none",
                }} />

                {/* Content overlay */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  padding: "14px 16px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}>
                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 34,
                      height: 22,
                      padding: "0 8px",
                      borderRadius: 6,
                      background: "linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      backdropFilter: "blur(10px) saturate(1.4)",
                      WebkitBackdropFilter: "blur(10px) saturate(1.4)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16), 0 2px 5px rgba(0,0,0,0.45)",
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.92)",
                      letterSpacing: "0.14em",
                      fontVariantNumeric: "tabular-nums",
                    }}>
                      0{i + 1}
                    </span>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "5px 10px 5px 9px",
                      borderRadius: 999,
                      background: "rgba(5,8,12,0.5)",
                      border: `1px solid ${CYAN}55`,
                      backdropFilter: "blur(12px) saturate(1.4)",
                      WebkitBackdropFilter: "blur(12px) saturate(1.4)",
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 18px ${CYAN}28`,
                    }}>
                      <span className="cf-arc-open-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
                      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 9, fontWeight: 700, color: CYAN, letterSpacing: "0.22em", textTransform: "uppercase" }}>
                        Open
                      </span>
                    </span>
                  </div>

                  {/* Edition logo — centered, large */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "48px 18px 68px",
                    pointerEvents: "none",
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ed.logo}
                      alt={`Cyber First ${ed.city} logo`}
                      loading="lazy"
                      style={{
                        maxWidth: "94%",
                        maxHeight: "90%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.7)) drop-shadow(0 0 36px rgba(1,187,245,0.24))",
                      }}
                    />
                  </div>

                  {/* Spacer to push content to bottom */}
                  <div style={{ flex: 1 }} />

                  <span style={{ width: 36, height: 1, background: `linear-gradient(90deg, ${CYAN}, transparent)`, opacity: 0.85 }} />

                  {/* Bottom row — date glass chip + arrow button */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 11px",
                      borderRadius: 8,
                      background: "rgba(5,8,12,0.5)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px) saturate(1.4)",
                      WebkitBackdropFilter: "blur(10px) saturate(1.4)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: "white",
                      letterSpacing: "0.005em",
                    }}>
                      {ed.date}
                    </span>
                    <span
                      className="cf-arc-card-arrow"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 30,
                        height: 30,
                        borderRadius: 999,
                        background: `${CYAN}22`,
                        border: `1px solid ${CYAN}66`,
                        color: CYAN,
                        backdropFilter: "blur(10px) saturate(1.4)",
                        WebkitBackdropFilter: "blur(10px) saturate(1.4)",
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 0 14px ${CYAN}26`,
                        transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), background 0.4s ease, border-color 0.4s ease",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Soon — confirmed dates, registration not yet open — rendered as badges */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.36, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}
        >
          <span style={{ width: 20, height: 1, background: `linear-gradient(90deg, ${CYAN}55, transparent)`, opacity: 0.8 }} />
          <span style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 9.5,
            fontWeight: 700,
            color: FAINT,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}>
            Upcoming · registration opens soon
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.42, ease: EASE }}
          className="cf-arc-soon-badges"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(10px, 1vw, 14px)",
            marginBottom: 48,
          }}
        >
          {EDITIONS_2026.filter((ed) => ed.status === "soon").map((ed, i) => {
            const code = ed.country === "Qatar" ? "QA"
              : ed.country === "Oman" ? "OM"
              : ed.country === "Saudi Arabia" ? "SA"
              : ed.country.slice(0, 2).toUpperCase();
            return (
              <motion.div
                key={ed.city}
                initial={{ opacity: 0, y: 6 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.46 + i * 0.05, ease: EASE }}
              >
                <Link
                  href={ed.href}
                  className="cf-arc-soon-badge"
                  style={{
                    position: "relative",
                    display: "inline-block",
                    padding: 1,
                    borderRadius: 999,
                    background: `linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 36%, rgba(255,255,255,0.02) 68%, ${CYAN}48 100%)`,
                    boxShadow: `0 5px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)`,
                    textDecoration: "none",
                    color: "inherit",
                    transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease",
                  }}
                >
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 16px 9px 12px",
                    borderRadius: 999,
                    background: "linear-gradient(180deg, rgba(22,27,36,0.94), rgba(10,14,20,0.96))",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)",
                  }}>
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: CYAN,
                      boxShadow: `0 0 8px ${CYAN}88`,
                      opacity: 0.72,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: "white",
                      letterSpacing: "-0.005em",
                      whiteSpace: "nowrap",
                    }}>
                      {ed.city}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 9,
                      fontWeight: 600,
                      color: FAINT,
                      letterSpacing: "0.18em",
                      fontVariantNumeric: "tabular-nums",
                    }}>
                      {code}
                    </span>
                    <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.82)",
                      letterSpacing: "0.005em",
                      whiteSpace: "nowrap",
                    }}>
                      {ed.date}
                    </span>
                    <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
                    <span style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 9,
                      fontWeight: 700,
                      color: CYAN,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}>
                      Soon
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ─── FUTURE — horizontal strip ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.38, ease: EASE }}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
            paddingBottom: 18,
            marginBottom: 20,
            borderBottom: `1px solid ${RULE}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 700, color: FAINT, letterSpacing: "0.3em", textTransform: "uppercase" }}>
              Future · 2027+
            </span>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, rgba(255,255,255,0.35), transparent)`, opacity: 0.7 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 1.4vw, 20px)", fontWeight: 400, fontStyle: "italic", color: "rgba(255,255,255,0.78)", letterSpacing: "-0.01em" }}>
              The corridor expands.
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 600, color: FAINT, letterSpacing: "0.22em", textTransform: "uppercase", fontVariantNumeric: "tabular-nums" }}>
            Under review
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.46, ease: EASE }}
          className="cf-arc-future-badges"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(10px, 1vw, 14px)",
            marginBottom: 22,
          }}
        >
          {[
            { city: "Cairo", country: "EG", role: "Anchor" },
            { city: "Istanbul", country: "TR", role: "Anchor" },
            { city: "Singapore", country: "SG", role: "Anchor" },
            { city: "Johannesburg", country: "ZA", role: "Pan-African" },
            { city: "Lagos", country: "NG", role: "Pan-African" },
          ].map((c, i) => (
            <motion.div
              key={c.city}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.52 + i * 0.05, ease: EASE }}
              className="cf-arc-future-badge"
              style={{
                position: "relative",
                display: "inline-block",
                padding: 1,
                borderRadius: 999,
                background: `linear-gradient(140deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.02) 70%, ${CYAN}40 100%)`,
                boxShadow: `0 4px 14px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.02)`,
                transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease",
              }}
            >
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 16px 8px 12px",
                borderRadius: 999,
                background: "linear-gradient(180deg, rgba(22,27,36,0.94), rgba(10,14,20,0.96))",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.5)",
              }}>
                <span
                  className="cf-arc-future-dot"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "transparent",
                    border: `1px solid ${CYAN}`,
                    flexShrink: 0,
                  }}
                />
                <span style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: "white",
                  letterSpacing: "-0.005em",
                  whiteSpace: "nowrap",
                }}>
                  {c.city}
                </span>
                <span style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 9,
                  fontWeight: 600,
                  color: FAINT,
                  letterSpacing: "0.18em",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {c.country}
                </span>
                <span style={{ width: 1, height: 11, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
                <span style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 9,
                  fontWeight: 700,
                  color: CYAN,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>
                  {c.role}
                </span>
              </div>
            </motion.div>
          ))}

          {/* "and more" terminal chip */}
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.78, ease: EASE }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 14px",
              borderRadius: 999,
              border: `1px dashed ${CYAN}33`,
              background: "transparent",
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              fontWeight: 400,
              fontStyle: "italic",
              color: FAINT,
              letterSpacing: "0.005em",
            }}
          >
            + more under review
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.56, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            fontWeight: 400,
            fontStyle: "italic",
            color: FAINT,
            letterSpacing: "0.01em",
          }}
        >
          Year-round research, persistent CISO councils, and additional cities under review. Partners who commit early shape the blueprint.
        </motion.div>
      </div>

      <style jsx global>{`
        .cf-arc-card {
          will-change: transform;
        }
        .cf-arc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 44px ${CYAN}26 !important;
        }
        .cf-arc-card:hover .cf-arc-card-img {
          transform: scale(1.05);
          filter: saturate(1) contrast(1.1) brightness(0.74) !important;
        }
        .cf-arc-card:hover .cf-arc-card-arrow {
          transform: translateX(3px);
          background: ${CYAN}32 !important;
          border-color: ${CYAN}99 !important;
          color: ${CYAN} !important;
        }
        .cf-arc-future-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), 0 0 24px ${CYAN}26 !important;
        }
        .cf-arc-soon-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), 0 0 28px ${CYAN}30 !important;
        }
        @keyframes cf-open-pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${CYAN}55; }
          50%      { box-shadow: 0 0 0 5px ${CYAN}00; }
        }
        .cf-arc-open-dot {
          animation: cf-open-pulse 2.2s ease-in-out infinite;
        }
        @keyframes cf-future-pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${CYAN}55; opacity: 0.65; }
          50%      { box-shadow: 0 0 0 4px ${CYAN}00; opacity: 1; }
        }
        .cf-arc-future-dot {
          animation: cf-future-pulse 2.4s ease-in-out infinite;
        }
        @media (max-width: 1020px) {
          .cf-arc-strip {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .cf-arc-strip {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. THE ROOM (role mix + speakers + industries)
// ═════════════════════════════════════════════════════════════════════════════
function TheRoom() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const maxPct = Math.max(...ROLE_MIX.map((r) => r.pct));

  return (
    <section ref={ref} id="room" style={{ background: "transparent", padding: "clamp(48px, 6vw, 84px) 0", position: "relative", overflow: "hidden" }}>
      <SectionAmbient />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>
        <SectionMark num="05" label="The Room" />

        {/* Headline + lede */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(22px, 3.4vw, 48px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "white",
            margin: "0 0 18px",
            whiteSpace: "nowrap",
          }}
        >
          The badges read{" "}
          <span className="cf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "9s" }}>
            Director
          </span>{" "}
          or above.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(15px, 1.05vw, 17px)",
            fontWeight: 300,
            lineHeight: 1.7,
            color: MUTE,
            margin: "0 0 clamp(36px, 5vw, 60px)",
            maxWidth: 640,
            textWrap: "pretty" as "pretty",
          }}
        >
          A room is only as good as the names on the badges. Every attendee is vetted before we issue the invite — no title-inflators, no consultants in disguise. Just the people who own the risk.
        </motion.p>

        {/* ─── ROLE MIX + INDUSTRIES split ───────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "clamp(28px, 3.4vw, 52px)", marginBottom: "clamp(56px, 6.5vw, 88px)" }} className="cf-room-split">

          {/* Role mix — premium rail */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${CYAN}, transparent)`, opacity: 0.75 }} />
              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10.5, fontWeight: 700, color: FAINT, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                Role mix
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {ROLE_MIX.map((r, i) => (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, x: -18 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.22 + i * 0.08, ease: EASE }}
                  className="cf-room-role"
                  style={{
                    position: "relative",
                    padding: "18px 2px 18px 0",
                    display: "grid",
                    gridTemplateColumns: "32px 1fr auto",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  {/* Cyan-peak hairline divider */}
                  {i > 0 && (
                    <span style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 18%, ${CYAN}33 50%, rgba(255,255,255,0.05) 82%, transparent 100%)`,
                      pointerEvents: "none",
                    }} />
                  )}

                  {/* Chrome index chip */}
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 22,
                    padding: "0 6px",
                    borderRadius: 5,
                    background: "linear-gradient(140deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 60%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 5px rgba(0,0,0,0.35)",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.82)",
                    letterSpacing: "0.08em",
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    0{i + 1}
                  </span>

                  {/* Label + bar */}
                  <div>
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(15px, 1.3vw, 19px)",
                      fontWeight: 400,
                      color: "white",
                      letterSpacing: "-0.008em",
                    }}>
                      {r.label}
                    </div>
                    <div style={{ marginTop: 10, height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 999, position: "relative", overflow: "hidden" }}>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={inView ? { scaleX: r.pct / maxPct } : {}}
                        transition={{ duration: 1.3, delay: 0.4 + i * 0.08, ease: EASE }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: `linear-gradient(90deg, ${CYAN}aa, ${CYAN})`,
                          boxShadow: `0 0 10px ${CYAN}66`,
                          transformOrigin: "left",
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>

                  {/* Percentage */}
                  <div style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 2,
                    fontFamily: "var(--font-display)",
                    color: CYAN,
                    letterSpacing: "-0.025em",
                    fontVariantNumeric: "tabular-nums",
                    minWidth: 70,
                    justifyContent: "flex-end",
                    textShadow: `0 0 18px ${CYAN}26`,
                  }}>
                    <span style={{ fontSize: "clamp(24px, 2.2vw, 34px)", fontWeight: 300, lineHeight: 1 }}>{r.pct}</span>
                    <span style={{ fontSize: "clamp(11px, 0.9vw, 14px)", fontWeight: 500, opacity: 0.75 }}>%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Industries — chrome-bezel glass chips */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${CYAN}, transparent)`, opacity: 0.75 }} />
                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10.5, fontWeight: 700, color: FAINT, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                  Industries represented
                </span>
              </div>
              <span style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 9.5,
                fontWeight: 700,
                color: CYAN,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: 999,
                background: `${CYAN}10`,
                border: `1px solid ${CYAN}33`,
              }}>
                {INDUSTRIES.length} sectors
              </span>
            </div>

            <div className="cf-room-industries" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {INDUSTRIES.map((ind, i) => (
                <motion.span
                  key={ind}
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.28 + i * 0.04, ease: EASE }}
                  className="cf-room-industry"
                  style={{
                    position: "relative",
                    display: "inline-block",
                    padding: 1,
                    borderRadius: 999,
                    background: "linear-gradient(140deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.02) 70%, rgba(1,187,245,0.28) 100%)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.02)",
                    transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease",
                  }}
                >
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "8px 14px 8px 12px",
                    borderRadius: 999,
                    background: "linear-gradient(180deg, rgba(22,27,36,0.94), rgba(10,14,20,0.96))",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.5)",
                  }}>
                    <span style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: CYAN,
                      boxShadow: `0 0 7px ${CYAN}`,
                      opacity: 0.8,
                    }} />
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.9)",
                      letterSpacing: "-0.003em",
                      whiteSpace: "nowrap",
                    }}>
                      {ind}
                    </span>
                  </span>
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* ─── SPEAKERS — premium chrome-bezel cards ─────────────────────── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${CYAN}, transparent)`, opacity: 0.75 }} />
                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10.5, fontWeight: 700, color: FAINT, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                  On the stage
                </span>
              </div>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(22px, 2.2vw, 32px)",
                color: "white",
                margin: 0,
                letterSpacing: "-0.022em",
                lineHeight: 1.1,
              }}>
                Recent speakers —{" "}
                <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>a partial list.</span>
              </h3>
            </div>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(5,8,12,0.55)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px) saturate(1.4)",
              WebkitBackdropFilter: "blur(10px) saturate(1.4)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
              <span style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 9.5,
                fontWeight: 700,
                color: "rgba(255,255,255,0.82)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}>
                80+ on the record
              </span>
            </span>
          </motion.div>

          <div className="cf-speakers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(14px, 1.4vw, 20px)" }}>
            {SPEAKERS.map((sp, i) => (
              <motion.figure
                key={sp.name}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease: EASE }}
                className="cf-speaker-card"
                style={{
                  margin: 0,
                  position: "relative",
                  padding: 1.5,
                  borderRadius: 16,
                  background: `linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 28%, rgba(255,255,255,0.02) 62%, ${CYAN}55 100%)`,
                  boxShadow: `0 14px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02), 0 0 28px ${CYAN}14`,
                  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease",
                }}
              >
                <div style={{
                  position: "relative",
                  borderRadius: 14.5,
                  overflow: "hidden",
                  aspectRatio: "4 / 5",
                  background: "#05070b",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.55)",
                }}>
                  {/* Full-color cinematic photo — same treatment as Thesis / Arc Open cards */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sp.photo}
                    alt={`${sp.name}, ${sp.title}`}
                    loading="lazy"
                    className="cf-speaker-photo"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: (sp as { focus?: string }).focus ?? "top center",
                      filter: "saturate(0.9) contrast(1.08) brightness(0.78)",
                      transition: "filter 0.7s ease, transform 1s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                  {/* Dark legibility gradient */}
                  <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,7,11,0.22) 0%, transparent 30%, rgba(5,7,11,0.32) 55%, rgba(5,7,11,0.95) 100%)", pointerEvents: "none" }} />
                  {/* Subtle cyan brand tint */}
                  <span style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${CYAN}10 0%, transparent 50%, ${CYAN}08 100%)`, mixBlendMode: "overlay" as const, pointerEvents: "none" }} />
                  {/* Top cyan caustic */}
                  <span style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`, opacity: 0.7, pointerEvents: "none" }} />

                  {/* Liquid-glass name chip — bottom */}
                  <figcaption style={{
                    position: "absolute",
                    left: 10,
                    right: 10,
                    bottom: 10,
                    padding: "10px 13px 12px",
                    borderRadius: 11,
                    background: "rgba(5,8,12,0.55)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    backdropFilter: "blur(14px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(14px) saturate(1.4)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 6px 14px rgba(0,0,0,0.45)",
                  }}>
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "clamp(13px, 1vw, 15px)",
                      color: "white",
                      letterSpacing: "-0.013em",
                      lineHeight: 1.2,
                    }}>
                      {sp.name}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 10.5,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.72)",
                      marginTop: 4,
                      lineHeight: 1.35,
                    }}>
                      {sp.title}
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 6,
                      paddingTop: 6,
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <span style={{ width: 3, height: 3, borderRadius: "50%", background: CYAN, boxShadow: `0 0 5px ${CYAN}`, flexShrink: 0 }} />
                      <span style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: CYAN,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        lineHeight: 1.2,
                      }}>
                        {sp.org}
                      </span>
                    </div>
                  </figcaption>
                </div>
              </motion.figure>
            ))}
          </div>

          {/* ─── CTA — See all speakers ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              marginTop: "clamp(36px, 4.5vw, 56px)",
            }}
          >
            <Link
              href="/events/cyber-first/kuwait-2026#speakers"
              scroll
              className="cf-speakers-cta"
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 22px 14px 26px",
                borderRadius: 999,
                background: `linear-gradient(180deg, #40d4ff 0%, ${CYAN} 55%, #0095c8 100%)`,
                color: INK,
                fontFamily: "var(--font-outfit)",
                fontSize: 14.5,
                fontWeight: 600,
                letterSpacing: "0.005em",
                textDecoration: "none",
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.2), 0 10px 28px ${CYAN}36, 0 0 0 1px rgba(255,255,255,0.05)`,
                transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease",
              }}
            >
              <span>Meet the full roster</span>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: 999,
                background: "rgba(0,0,0,0.18)",
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </Link>
            <span style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 10.5,
              fontWeight: 600,
              color: FAINT,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}>
              80+ speakers across the series
            </span>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .cf-speaker-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 44px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px ${CYAN}26 !important;
        }
        .cf-speaker-card:hover .cf-speaker-photo {
          filter: saturate(1.05) contrast(1.1) brightness(0.94) !important;
          transform: scale(1.04);
        }
        .cf-room-industry:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), 0 0 22px ${CYAN}26 !important;
        }
        .cf-speakers-cta:hover {
          transform: translateY(-2px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.22), 0 16px 36px ${CYAN}4e, 0 0 0 1px rgba(255,255,255,0.06) !important;
        }
        .cf-speakers-cta:hover svg {
          transform: translateX(3px);
        }
        .cf-room-role:hover .cf-chrome-idx {
          border-color: ${CYAN}55 !important;
        }
        @media (max-width: 960px) {
          .cf-room-split {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
          .cf-speakers-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. ENGAGE (services)
// ═════════════════════════════════════════════════════════════════════════════
function Engage() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleTierCta = (e: React.MouseEvent<HTMLAnchorElement>, tabKey: string) => {
    // Let the browser handle scroll to #contact; broadcast the tab to InquiryForm
    window.dispatchEvent(new CustomEvent("efg:set-form-tab", { detail: tabKey }));
  };

  return (
    <section ref={ref} id="engage" style={{ background: "transparent", padding: "clamp(48px, 6vw, 84px) 0", position: "relative", overflow: "hidden" }}>
      <SectionAmbient />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>
        <SectionMark num="06" label="How to Engage" />

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(22px, 3.4vw, 48px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "white",
            margin: "0 0 14px",
            whiteSpace: "nowrap",
          }}
        >
          Three ways in.{" "}
          <span className="cf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "10s" }}>
            Pick your altitude.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1vw, 16px)",
            fontWeight: 300,
            lineHeight: 1.7,
            color: MUTE,
            margin: "0 0 clamp(36px, 4.5vw, 56px)",
            maxWidth: 620,
          }}
        >
          Sponsor a room, earn an invite, or take the stage. Pick the altitude that fits your brief and the form below routes you to the right team.
        </motion.p>

        <div className="cf-engage-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(14px, 1.5vw, 22px)", alignItems: "stretch" }}>
          {ENGAGEMENT_TIERS.map((tier, i) => (
            <motion.article
              key={tier.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.15 + i * 0.1, ease: EASE }}
              className="cf-engage-tier"
              style={{
                position: "relative",
                padding: 1.5,
                borderRadius: 16,
                background: `linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.02) 64%, ${CYAN}50 100%)`,
                boxShadow: `0 14px 34px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02), 0 0 26px ${CYAN}12`,
                transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease",
                display: "flex",
                height: "100%",
              }}
            >
              <div style={{
                position: "relative",
                borderRadius: 14.5,
                overflow: "hidden",
                background: "#05070b",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.55)",
                padding: "clamp(22px, 2.4vw, 32px)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                flex: 1,
                width: "100%",
              }}>
                {/* Background image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tier.image}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="cf-engage-bg"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    filter: "saturate(0.9) contrast(1.06) brightness(0.72)",
                    transition: "transform 1s cubic-bezier(0.22,1,0.36,1), filter 0.7s ease",
                    zIndex: 0,
                  }}
                />
                {/* Dark legibility wash — stronger at top+bottom where text sits */}
                <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,7,11,0.72) 0%, rgba(5,7,11,0.4) 30%, rgba(5,7,11,0.5) 62%, rgba(5,7,11,0.92) 100%)", pointerEvents: "none", zIndex: 0 }} />
                {/* Left-biased darken for copy readability */}
                <span style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(5,7,11,0.5) 0%, rgba(5,7,11,0.2) 55%, rgba(5,7,11,0.1) 100%)", pointerEvents: "none", zIndex: 0 }} />
                {/* Cyan brand tint */}
                <span style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${CYAN}14 0%, transparent 50%, ${CYAN}0f 100%)`, mixBlendMode: "overlay" as const, pointerEvents: "none", zIndex: 0 }} />
                {/* Soft vignette */}
                <span style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 95% 100% at 50% 50%, transparent 52%, rgba(5,7,11,0.6) 100%)", pointerEvents: "none", zIndex: 0 }} />
                {/* Film grain */}
                <span style={{ position: "absolute", inset: 0, opacity: 0.05, mixBlendMode: "overlay" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px 180px", pointerEvents: "none", zIndex: 0 }} />
                {/* Top cyan caustic */}
                <span style={{
                  position: "absolute",
                  top: 0,
                  left: "12%",
                  right: "12%",
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
                  opacity: 0.6,
                  pointerEvents: "none",
                  zIndex: 1,
                }} />

                {/* Content wrapper — stacks above image + overlays */}
                <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                {/* Header — label pill + large faded index */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 11px",
                    borderRadius: 999,
                    background: `${CYAN}14`,
                    border: `1px solid ${CYAN}55`,
                    backdropFilter: "blur(10px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(10px) saturate(1.4)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: CYAN, boxShadow: `0 0 8px ${CYAN}`, flexShrink: 0 }} />
                    <span style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: CYAN,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                    }}>
                      {tier.label}
                    </span>
                  </span>
                  <span style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(44px, 4vw, 56px)",
                    fontWeight: 200,
                    color: "rgba(255,255,255,0.08)",
                    letterSpacing: "-0.03em",
                    lineHeight: 0.8,
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {tier.num}
                  </span>
                </div>

                {/* Headline */}
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(22px, 2vw, 30px)",
                  lineHeight: 1.12,
                  letterSpacing: "-0.022em",
                  color: "white",
                  margin: "2px 0 0",
                  textShadow: "0 2px 14px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.4)",
                }}>
                  {tier.headline}
                </h3>

                {/* Body */}
                <p style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14,
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.82)",
                  margin: 0,
                  textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                }}>
                  {tier.body}
                </p>

                {/* Cyan hairline */}
                <span style={{ width: 36, height: 1, background: `linear-gradient(90deg, ${CYAN}, transparent)`, opacity: 0.85 }} />

                {/* Features list — cyan dot markers */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.92)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      lineHeight: 1.5,
                      textShadow: "0 1px 6px rgba(0,0,0,0.65)",
                    }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: CYAN, boxShadow: `0 0 6px ${CYAN}aa`, marginTop: 7, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA — glass pill with cyan arrow */}
                <a
                  href="#contact"
                  className="cf-engage-cta"
                  onClick={(e) => handleTierCta(e, tier.tabKey)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "12px 14px 12px 16px",
                    borderRadius: 10,
                    background: "rgba(5,8,12,0.55)",
                    border: `1px solid ${CYAN}40`,
                    backdropFilter: "blur(10px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(10px) saturate(1.4)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "white",
                    textDecoration: "none",
                    letterSpacing: "0.002em",
                    marginTop: 4,
                    transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
                  }}
                >
                  <span>{tier.cta}</span>
                  <span
                    className="cf-engage-arrow"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      background: `${CYAN}1e`,
                      border: `1px solid ${CYAN}66`,
                      color: CYAN,
                      transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), background 0.4s ease",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .cf-engage-tier:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 44px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 38px ${CYAN}26 !important;
        }
        .cf-engage-tier:hover .cf-engage-bg {
          transform: scale(1.05);
          filter: saturate(1) contrast(1.08) brightness(0.82) !important;
        }
        .cf-engage-tier:hover .cf-engage-cta {
          background: rgba(1,187,245,0.08) !important;
          border-color: ${CYAN}88 !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 0 18px ${CYAN}24 !important;
        }
        .cf-engage-tier:hover .cf-engage-arrow {
          transform: translateX(3px);
          background: ${CYAN}30 !important;
        }
        @media (max-width: 900px) {
          .cf-engage-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 6. PROOF (sponsors + video + testimonials)
// ═════════════════════════════════════════════════════════════════════════════
function ProofSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="proof" style={{ background: "transparent", padding: "clamp(48px, 6vw, 84px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <SectionMark num="07" label="Proof" />

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(22px, 3.5vw, 50px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "white",
            margin: "0 0 14px",
            whiteSpace: "nowrap",
          }}
        >
          Read the ledger.{" "}
          <span className="cf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "10s" }}>
            Ask the names.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1vw, 16px)",
            fontWeight: 300,
            lineHeight: 1.7,
            color: MUTE,
            margin: "0 0 clamp(32px, 4vw, 52px)",
            maxWidth: 600,
          }}
        >
          Unscripted voices from the room — captured on-site, minutes after the sessions wrapped. No edits, no talking points.
        </motion.p>

        {/* ─── In frames — photo gallery from past editions ───────────── */}
        <div style={{ marginBottom: 52 }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${CYAN}, transparent)`, opacity: 0.75 }} />
                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10.5, fontWeight: 700, color: FAINT, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                  In frames
                </span>
              </div>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(22px, 2.2vw, 32px)",
                color: "white",
                margin: 0,
                letterSpacing: "-0.022em",
                lineHeight: 1.1,
              }}>
                Moments from past editions —{" "}
                <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>the room, the stage, the floor.</span>
              </h3>
            </div>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(5,8,12,0.55)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px) saturate(1.4)",
              WebkitBackdropFilter: "blur(10px) saturate(1.4)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
              <span style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 9.5,
                fontWeight: 700,
                color: "rgba(255,255,255,0.82)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}>
                {GALLERY_PHOTOS.length} frames
              </span>
            </span>
          </motion.div>

          <div className="cf-gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(14px, 1.4vw, 20px)" }}>
            {GALLERY_PHOTOS.map((photo, i) => (
              <motion.figure
                key={photo.src}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: EASE }}
                className="cf-gallery-card"
                style={{
                  margin: 0,
                  position: "relative",
                  padding: 1.5,
                  borderRadius: 14,
                  background: `linear-gradient(140deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 32%, rgba(255,255,255,0.02) 66%, ${CYAN}44 100%)`,
                  boxShadow: `0 10px 26px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02), 0 0 22px ${CYAN}0e`,
                  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease",
                }}
              >
                <div style={{
                  position: "relative",
                  borderRadius: 12.5,
                  overflow: "hidden",
                  aspectRatio: photo.aspect,
                  background: "#05070b",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.55)",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    loading="lazy"
                    className="cf-gallery-img"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      filter: "saturate(0.92) contrast(1.06) brightness(0.82)",
                      transition: "filter 0.7s ease, transform 1s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                  {/* Dark legibility gradient at bottom */}
                  <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,7,11,0.15) 0%, transparent 35%, rgba(5,7,11,0.25) 62%, rgba(5,7,11,0.85) 100%)", pointerEvents: "none" }} />
                  {/* Cyan tint */}
                  <span style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${CYAN}0d 0%, transparent 50%, ${CYAN}08 100%)`, mixBlendMode: "overlay" as const, pointerEvents: "none" }} />
                  {/* Top cyan caustic */}
                  <span style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`, opacity: 0.6, pointerEvents: "none" }} />

                  {/* Glass caption chip — bottom-left */}
                  <figcaption style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 11px 6px 10px",
                    borderRadius: 999,
                    background: "rgba(5,8,12,0.55)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(12px) saturate(1.4)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.45)",
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: CYAN, boxShadow: `0 0 6px ${CYAN}`, flexShrink: 0 }} />
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: "white",
                      letterSpacing: "-0.003em",
                      whiteSpace: "nowrap",
                    }}>
                      {photo.caption}
                    </span>
                  </figcaption>
                </div>
              </motion.figure>
            ))}
          </div>
        </div>

        {/* From the room — testimonial shorts gallery */}
        <div style={{ marginBottom: 52 }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
            style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${CYAN}, transparent)`, opacity: 0.75 }} />
                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10.5, fontWeight: 700, color: FAINT, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                  The gallery
                </span>
              </div>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(22px, 2.2vw, 32px)",
                color: "white",
                margin: 0,
                letterSpacing: "-0.022em",
                lineHeight: 1.1,
              }}>
                From the room.
              </h3>
            </div>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(5,8,12,0.55)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px) saturate(1.4)",
              WebkitBackdropFilter: "blur(10px) saturate(1.4)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
              <span style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 9.5,
                fontWeight: 700,
                color: "rgba(255,255,255,0.82)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}>
                On-site · {TESTIMONIAL_IDS.length} clips
              </span>
            </span>
          </motion.div>

          <div className="cf-shorts-showcase">
            {TESTIMONIAL_IDS.map((vid, i) => (
              <div
                key={vid}
                className={`cf-shorts-slot cf-shorts-slot-${i % 2 === 0 ? "tall" : "short"}${i === 2 ? " cf-shorts-slot-hero" : ""}`}
              >
                <TestimonialShort videoId={vid} delay={i * 0.06} inView={inView} />
              </div>
            ))}
          </div>
        </div>

        {/* ─── Our Past Series Partners & Sponsors — dual marquee ─────── */}
        <div>
          {/* Header — centered eyebrow + title + lede */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ textAlign: "center", marginBottom: 36 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ width: 30, height: 1, background: CYAN }} />
              <span style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 11,
                fontWeight: 700,
                color: CYAN,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}>
                Our Past Series
              </span>
              <span style={{ width: 30, height: 1, background: CYAN }} />
            </div>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(26px, 3.2vw, 44px)",
              letterSpacing: "-0.025em",
              color: "white",
              lineHeight: 1.1,
              margin: "0 auto",
              maxWidth: 760,
              textWrap: "balance" as "balance",
            }}>
              Partners &{" "}
              <span className="cf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "10s" }}>
                Sponsors
              </span>
            </h3>
            <p style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(14px, 1vw, 16px)",
              color: MUTE,
              lineHeight: 1.6,
              maxWidth: 520,
              margin: "14px auto 0",
            }}>
              Backed by global technology leaders and security vendors across the series.
            </p>
          </motion.div>

          {/* Dual marquee — breaks out of the 1280px wrapper to span the viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="cf-marquee-fullwidth"
            style={{
              position: "relative",
              width: "100vw",
              marginLeft: "calc(-50vw + 50%)",
              marginRight: "calc(-50vw + 50%)",
            }}
          >
            {/* Left edge fade */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "clamp(80px, 12vw, 160px)",
                background: `linear-gradient(to right, ${INK} 0%, transparent 100%)`,
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
            {/* Right edge fade */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "clamp(80px, 12vw, 160px)",
                background: `linear-gradient(to left, ${INK} 0%, transparent 100%)`,
                zIndex: 2,
                pointerEvents: "none",
              }}
            />

            {/* Row 1 — scrolls left */}
            <div className="cf-marquee-track" style={{ marginBottom: 20 }}>
              <div className="cf-marquee-inner cf-marquee-scroll-left" style={{ animationDuration: "72s" }}>
                {[...SPONSOR_LOGOS.slice(0, 12), ...SPONSOR_LOGOS.slice(0, 12)].map((logo, i) => (
                  <div
                    key={`r1-${i}`}
                    className="cf-marquee-cell"
                    style={{
                      width: 180,
                      height: 60,
                      margin: "0 clamp(18px, 2.5vw, 36px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo}
                      alt={`${(logo.split("/").pop() || "sponsor").replace(/\.[a-z]+$/i, "").replace(/[-_]/g, " ")} logo`}
                      loading="lazy"
                      className="cf-marquee-img"
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                        filter: "brightness(0) invert(1) opacity(0.58)",
                        transition: "filter 0.4s ease",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2 — scrolls right */}
            <div className="cf-marquee-track">
              <div className="cf-marquee-inner cf-marquee-scroll-right" style={{ animationDuration: "84s" }}>
                {[...SPONSOR_LOGOS.slice(12), ...SPONSOR_LOGOS.slice(12)].map((logo, i) => (
                  <div
                    key={`r2-${i}`}
                    className="cf-marquee-cell"
                    style={{
                      width: 180,
                      height: 60,
                      margin: "0 clamp(18px, 2.5vw, 36px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo}
                      alt={`${(logo.split("/").pop() || "sponsor").replace(/\.[a-z]+$/i, "").replace(/[-_]/g, " ")} logo`}
                      loading="lazy"
                      className="cf-marquee-img"
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                        filter: "brightness(0) invert(1) opacity(0.58)",
                        transition: "filter 0.4s ease",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Counter caption */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 32 }}
          >
            <span style={{ width: 24, height: 1, background: `linear-gradient(90deg, transparent, ${CYAN}55)` }} />
            <span style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 10.5,
              fontWeight: 700,
              color: FAINT,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}>
              A partial list · 50+ across the series
            </span>
            <span style={{ width: 24, height: 1, background: `linear-gradient(270deg, transparent, ${CYAN}55)` }} />
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        /* Sponsor marquee */
        .cf-marquee-track {
          overflow: hidden;
          width: 100%;
        }
        .cf-marquee-inner {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .cf-marquee-inner:hover {
          animation-play-state: paused;
        }
        .cf-marquee-scroll-left {
          animation: cfMarqueeScrollLeft linear infinite;
        }
        .cf-marquee-scroll-right {
          animation: cfMarqueeScrollRight linear infinite;
        }
        .cf-marquee-cell:hover .cf-marquee-img {
          filter: brightness(0) invert(1) opacity(1) !important;
        }
        @keyframes cfMarqueeScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes cfMarqueeScrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .cf-short-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 36px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 30px ${CYAN}30 !important;
        }
        .cf-short-card:hover .cf-short-img {
          transform: scale(1.05);
          filter: saturate(1.05) contrast(1.1) brightness(0.92) !important;
        }
        .cf-short-card:hover .cf-short-play {
          transform: translate(-50%, -50%) scale(1.08);
          background: rgba(1,187,245,0.18) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 0 28px ${CYAN}66, 0 10px 24px rgba(0,0,0,0.6) !important;
        }
        .cf-gallery-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 32px ${CYAN}26 !important;
        }
        .cf-gallery-card:hover .cf-gallery-img {
          transform: scale(1.04);
          filter: saturate(1.05) contrast(1.08) brightness(0.94) !important;
        }
        @media (max-width: 900px) {
          .cf-gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 540px) {
          .cf-gallery-grid {
            grid-template-columns: 1fr !important;
          }
        }
        /* Staggered showcase — same pattern as VB MENA / Kenya */
        .cf-shorts-showcase {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
        }
        .cf-shorts-slot {
          flex-shrink: 0;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .cf-shorts-slot:hover { transform: translateY(-6px); }
        .cf-shorts-slot-tall { width: 185px; height: 315px; }
        .cf-shorts-slot-short { width: 165px; height: 260px; }
        .cf-shorts-slot-hero.cf-shorts-slot-tall { width: 210px; height: 360px; }
        @media (max-width: 1100px) {
          .cf-shorts-showcase {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            justify-content: flex-start;
            padding: 0 clamp(16px, 3vw, 32px) 8px;
            scrollbar-width: none;
          }
          .cf-shorts-showcase::-webkit-scrollbar { display: none; }
        }
        @media (max-width: 900px) {
          .cf-shorts-slot-tall { width: 170px; height: 285px; }
          .cf-shorts-slot-short { width: 150px; height: 230px; }
          .cf-shorts-slot-hero.cf-shorts-slot-tall { width: 190px; height: 320px; }
        }
        @media (max-width: 560px) {
          .cf-shorts-slot-tall { width: 150px; height: 255px; }
          .cf-shorts-slot-short { width: 135px; height: 210px; }
          .cf-shorts-slot-hero.cf-shorts-slot-tall { width: 170px; height: 290px; }
          .cf-marquee-cell {
            width: 140px !important;
            height: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}

function TestimonialShort({ videoId, delay, inView }: { videoId: string; delay: number; inView: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className="cf-short-card"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: 1.5,
        borderRadius: 18,
        background: `linear-gradient(140deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 32%, rgba(255,255,255,0.02) 66%, ${CYAN}4d 100%)`,
        boxShadow: `0 10px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02), 0 0 20px ${CYAN}10`,
        cursor: playing ? "default" : "pointer",
        transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease",
      }}
      onClick={() => !playing && setPlaying(true)}
      role={playing ? undefined : "button"}
      tabIndex={playing ? undefined : 0}
      aria-label={playing ? undefined : "Play testimonial"}
      onKeyDown={(e) => { if (!playing && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setPlaying(true); } }}
    >
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 16.5,
        overflow: "hidden",
        background: "#05070b",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.55)",
      }}>
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title="Testimonial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${videoId}/oar2.jpg`}
              onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
              alt="Testimonial thumbnail"
              loading="lazy"
              className="cf-short-img"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "saturate(0.9) contrast(1.06) brightness(0.82)",
                transition: "filter 0.6s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)",
              }}
            />
            {/* Dark legibility gradient */}
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,7,11,0.2) 0%, transparent 35%, rgba(5,7,11,0.25) 58%, rgba(5,7,11,0.85) 100%)", pointerEvents: "none" }} />
            {/* Cyan brand tint */}
            <span style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${CYAN}0f 0%, transparent 50%, ${CYAN}0a 100%)`, mixBlendMode: "overlay" as const, pointerEvents: "none" }} />
            {/* Top cyan caustic */}
            <span style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`, opacity: 0.65, pointerEvents: "none" }} />

            {/* Liquid-glass play button */}
            <span
              className="cf-short-play"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "rgba(5,8,12,0.55)",
                border: `1px solid ${CYAN}66`,
                backdropFilter: "blur(12px) saturate(1.4)",
                WebkitBackdropFilter: "blur(12px) saturate(1.4)",
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.16), 0 0 18px ${CYAN}44, 0 8px 20px rgba(0,0,0,0.55)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: CYAN,
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), background 0.4s ease, box-shadow 0.4s ease",
              }}
            >
              <svg width="13" height="15" viewBox="0 0 20 22" fill="none">
                <path d="M19 11L0.999999 21.3923L1 0.607696L19 11Z" fill="currentColor" />
              </svg>
            </span>

            {/* Bottom chip */}
            <span style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              right: 10,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 9px",
              borderRadius: 6,
              background: "rgba(5,8,12,0.55)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px) saturate(1.4)",
              WebkitBackdropFilter: "blur(10px) saturate(1.4)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              justifyContent: "flex-start",
            }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: CYAN, boxShadow: `0 0 5px ${CYAN}`, flexShrink: 0 }} />
              <span style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 8.5,
                fontWeight: 700,
                color: "rgba(255,255,255,0.82)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}>
                Testimonial
              </span>
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 7. JOIN + CROSS-SELL
// ═════════════════════════════════════════════════════════════════════════════
function JoinCta() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="contact" style={{ background: "transparent", padding: "clamp(40px, 4.5vw, 68px) 0 clamp(32px, 3.5vw, 56px)", position: "relative", overflow: "hidden" }}>
      {/* Background network echo */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        <NetworkMesh />
      </div>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${CYAN}10 0%, transparent 60%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 22 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 18 }}>
            <span style={{ width: 40, height: 1, background: CYAN }} />
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 700, color: CYAN, letterSpacing: "0.35em", textTransform: "uppercase" }}>
              08 · Join
            </span>
            <span style={{ width: 40, height: 1, background: CYAN }} />
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(28px, 3.4vw, 52px)",
            lineHeight: 1.04,
            letterSpacing: "-0.035em",
            color: "white",
            margin: "0 auto",
            maxWidth: 820,
            textWrap: "balance" as "balance",
          }}>
            Ready to lead the{" "}
            <span className="cf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "10s" }}>
              conversation?
            </span>
          </h2>

          <p style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1vw, 16px)",
            fontWeight: 300,
            lineHeight: 1.6,
            color: MUTE,
            margin: "14px auto 0",
            maxWidth: 580,
          }}>
            Tell us which edition — or the whole circuit. Our team will come back within two working days with a tailored proposal.
          </p>
        </motion.div>

        {/* Inquiry form — themed to cyan by overriding the shared CSS vars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="cf-join-form-wrap"
          style={{
            ["--orange" as string]: CYAN,
            ["--orange-bright" as string]: "#4DD4FF",
            ["--orange-glow" as string]: "rgba(1,187,245,0.4)",
            ["--black" as string]: "transparent",
            marginBottom: 24,
          } as React.CSSProperties}
        >
          <InquiryForm hideLabel eventName="Cyber First" />
        </motion.div>

        {/* Quick contact details — premium glass pills */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 12,
          paddingTop: 32,
          marginTop: 20,
          borderTop: `1px solid ${RULE}`,
        }}>
          {/* Email pill */}
          <a
            href="mailto:partnerships@eventsfirstgroup.com"
            className="cf-contact-pill"
            style={{
              position: "relative",
              display: "inline-block",
              padding: 1,
              borderRadius: 999,
              background: `linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 36%, rgba(255,255,255,0.02) 68%, ${CYAN}48 100%)`,
              boxShadow: `0 6px 18px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)`,
              textDecoration: "none",
              color: "inherit",
              transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease",
            }}
          >
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px 10px 14px",
              borderRadius: 999,
              background: "linear-gradient(180deg, rgba(22,27,36,0.94), rgba(10,14,20,0.96))",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)",
            }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: 999,
                background: `${CYAN}1a`,
                border: `1px solid ${CYAN}4d`,
                color: CYAN,
                flexShrink: 0,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 500,
                color: "white",
                letterSpacing: "-0.003em",
                whiteSpace: "nowrap",
              }}>
                partnerships@eventsfirstgroup.com
              </span>
            </span>
          </a>

          {/* Location pill */}
          <span
            className="cf-contact-pill"
            style={{
              position: "relative",
              display: "inline-block",
              padding: 1,
              borderRadius: 999,
              background: `linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.02) 72%, ${CYAN}3a 100%)`,
              boxShadow: `0 6px 18px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)`,
              transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease",
            }}
          >
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px 10px 14px",
              borderRadius: 999,
              background: "linear-gradient(180deg, rgba(22,27,36,0.94), rgba(10,14,20,0.96))",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)",
            }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: 999,
                background: `${CYAN}1a`,
                border: `1px solid ${CYAN}4d`,
                color: CYAN,
                flexShrink: 0,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" /></svg>
              </span>
              <span style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 500,
                color: "white",
                letterSpacing: "-0.003em",
              }}>
                Office M07, The Light Commercial Tower
                <span style={{ color: FAINT, margin: "0 6px" }}>·</span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>Arjan, Dubai</span>
              </span>
            </span>
          </span>
        </div>
      </div>

      {/* Scoped overrides to tighten the embedded InquiryForm for this section */}
      <style jsx global>{`
        .cf-join-form-wrap > section#get-involved {
          padding: 0 !important;
        }
        .cf-join-form-wrap > section#get-involved > div {
          padding-left: 0 !important;
          padding-right: 0 !important;
          max-width: none !important;
        }
        .cf-join-form-wrap > section#get-involved > div > div:first-child {
          margin-bottom: 22px !important;
        }
        .cf-join-form-wrap .inquiry-split {
          grid-template-columns: 1fr 1.35fr !important;
          gap: clamp(28px, 3.2vw, 52px) !important;
        }
        a.cf-contact-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03), 0 0 26px ${CYAN}30 !important;
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CROSS-SELL
// ═════════════════════════════════════════════════════════════════════════════
function CrossSell() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "transparent", padding: "clamp(48px, 5vw, 72px) 0", borderTop: `1px solid ${RULE}`, position: "relative", overflow: "hidden" }}>
      <SectionAmbient />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>
        <SectionMark num="09" label="Our Other Series" />

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(16px, 2.4vw, 36px)",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "white",
            margin: "0 0 14px",
            whiteSpace: "nowrap",
          }}
        >
          Cyber First is one of four.{" "}
          <span className="cf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "10s" }}>
            See the whole portfolio.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1vw, 16px)",
            fontWeight: 300,
            lineHeight: 1.7,
            color: MUTE,
            margin: "0 0 clamp(36px, 4.5vw, 56px)",
            maxWidth: 620,
          }}
        >
          Four invite-only series, one curation standard. Same practitioner-led format, different mandates.
        </motion.p>

        <div className="cf-xsell-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(14px, 1.4vw, 20px)", alignItems: "stretch" }}>
          {CROSS_SELL.map((series, i) => {
            const c = series.color;
            return (
              <motion.div
                key={series.label}
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: EASE }}
                style={{ display: "flex" }}
              >
                <Link
                  href={series.href}
                  className="cf-xsell-card"
                  style={{
                    position: "relative",
                    display: "flex",
                    width: "100%",
                    padding: 2,
                    borderRadius: 18,
                    /* Skeu bezel — chromatic metallic ring with specular glints and series color */
                    background: `
                      linear-gradient(135deg,
                        rgba(255,255,255,0.42) 0%,
                        ${c}66 12%,
                        rgba(255,255,255,0.08) 30%,
                        rgba(255,255,255,0.02) 50%,
                        rgba(0,0,0,0.35) 72%,
                        ${c}aa 100%)
                    `,
                    boxShadow: `
                      0 20px 46px rgba(0,0,0,0.55),
                      0 4px 12px rgba(0,0,0,0.35),
                      0 0 0 1px rgba(255,255,255,0.04),
                      0 0 38px ${c}2e,
                      inset 0 1px 0 rgba(255,255,255,0.25)
                    `,
                    textDecoration: "none",
                    color: "inherit",
                    overflow: "hidden",
                    transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.55s ease",
                  }}
                >
                  <div
                    className="cf-xsell-glass"
                    style={{
                      position: "relative",
                      flex: 1,
                      borderRadius: 15.5,
                      overflow: "hidden",
                      /* Liquid glass panel — layered refractive stack */
                      background: `
                        radial-gradient(ellipse 130% 60% at 50% 0%, ${c}33 0%, transparent 55%),
                        radial-gradient(ellipse 90% 70% at 100% 100%, ${c}22 0%, transparent 60%),
                        linear-gradient(165deg, rgba(24,32,44,0.72) 0%, rgba(10,14,22,0.88) 55%, rgba(6,9,14,0.94) 100%)
                      `,
                      backdropFilter: "blur(20px) saturate(1.6)",
                      WebkitBackdropFilter: "blur(20px) saturate(1.6)",
                      /* Skeu depth — rim lighting + recessed core */
                      boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.22),
                        inset 0 -1px 0 rgba(0,0,0,0.65),
                        inset 1px 0 0 rgba(255,255,255,0.05),
                        inset -1px 0 0 rgba(0,0,0,0.3),
                        inset 0 -14px 28px -18px rgba(0,0,0,0.8),
                        inset 0 14px 22px -18px ${c}26
                      `,
                      padding: "clamp(22px, 2.2vw, 30px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    {/* Animated color bloom (top-right) */}
                    <span
                      className="cf-xsell-bloom"
                      style={{
                        position: "absolute",
                        top: -80,
                        right: -60,
                        width: 240,
                        height: 240,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${c}55 0%, transparent 65%)`,
                        filter: "blur(30px)",
                        pointerEvents: "none",
                        transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease",
                        opacity: 0.95,
                      }}
                    />
                    {/* Specular highlight — glass curvature sheen near top-left */}
                    <span style={{
                      position: "absolute",
                      top: -2,
                      left: "8%",
                      right: "8%",
                      height: "42%",
                      borderRadius: "50%",
                      background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 28%, transparent 60%)",
                      filter: "blur(8px)",
                      pointerEvents: "none",
                      mixBlendMode: "screen" as const,
                    }} />
                    {/* Diagonal refraction sheen (mix-blend overlay) */}
                    <span style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${c}1c 0%, transparent 40%, ${c}12 100%)`,
                      mixBlendMode: "overlay" as const,
                      pointerEvents: "none",
                    }} />
                    {/* Fine noise texture for glass realism */}
                    <span style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0.045,
                      mixBlendMode: "overlay" as const,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      backgroundSize: "180px 180px",
                      pointerEvents: "none",
                    }} />
                    {/* Top refraction hairline — catches light on the glass edge */}
                    <span style={{
                      position: "absolute",
                      top: 0,
                      left: "6%",
                      right: "6%",
                      height: 1,
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 20%, ${c} 50%, rgba(255,255,255,0.5) 80%, transparent)`,
                      opacity: 0.9,
                      pointerEvents: "none",
                    }} />
                    {/* Secondary top highlight — soft */}
                    <span style={{
                      position: "absolute",
                      top: 2,
                      left: "18%",
                      right: "18%",
                      height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                      pointerEvents: "none",
                    }} />
                    {/* Bottom glass shadow line */}
                    <span style={{
                      position: "absolute",
                      bottom: 0,
                      left: "14%",
                      right: "14%",
                      height: 1,
                      background: `linear-gradient(90deg, transparent, ${c}aa, transparent)`,
                      opacity: 0.45,
                      pointerEvents: "none",
                    }} />

                    {/* Content wrapper — above all gradient layers */}
                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                      {/* Pulsing color dot */}
                      <span
                        className="cf-xsell-dot"
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: c,
                          boxShadow: `0 0 12px ${c}`,
                          flexShrink: 0,
                          alignSelf: "flex-start",
                        }}
                      />

                      {/* Title */}
                      <div style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        fontSize: "clamp(18px, 1.6vw, 22px)",
                        color: "white",
                        letterSpacing: "-0.018em",
                        lineHeight: 1.15,
                        textShadow: "0 1px 8px rgba(0,0,0,0.45)",
                      }}>
                        {series.label}
                      </div>

                      {/* Tagline */}
                      <div style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 13,
                        fontWeight: 300,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.68)",
                        flex: 1,
                      }}>
                        {series.tagline}
                      </div>

                      {/* Tapered hairline (series color) */}
                      <span style={{
                        width: 32,
                        height: 1,
                        background: `linear-gradient(90deg, ${c}, transparent)`,
                        opacity: 0.85,
                      }} />

                      {/* Liquid-glass + skeu CTA */}
                      <div
                        className="cf-xsell-cta"
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                          padding: "11px 13px 11px 15px",
                          borderRadius: 12,
                          background: `
                            linear-gradient(180deg, ${c}1c 0%, rgba(5,8,12,0.55) 48%, rgba(5,8,12,0.65) 100%)
                          `,
                          border: `1px solid ${c}55`,
                          backdropFilter: "blur(14px) saturate(1.6)",
                          WebkitBackdropFilter: "blur(14px) saturate(1.6)",
                          boxShadow: `
                            inset 0 1px 0 rgba(255,255,255,0.2),
                            inset 0 -1px 0 rgba(0,0,0,0.5),
                            0 4px 14px rgba(0,0,0,0.4),
                            0 0 18px ${c}22
                          `,
                          fontFamily: "var(--font-outfit)",
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "white",
                          letterSpacing: "0.005em",
                          marginTop: 4,
                          overflow: "hidden",
                          transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                        }}
                      >
                        {/* Top edge specular highlight */}
                        <span style={{
                          position: "absolute",
                          top: 0,
                          left: "10%",
                          right: "10%",
                          height: 1,
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                          pointerEvents: "none",
                        }} />
                        <span style={{ position: "relative", textShadow: `0 0 10px ${c}55` }}>Explore the series</span>
                        <span
                          className="cf-xsell-arrow"
                          style={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 26,
                            height: 26,
                            borderRadius: 999,
                            background: `
                              radial-gradient(circle at 50% 30%, ${c}55 0%, ${c}28 55%, ${c}14 100%)
                            `,
                            border: `1px solid ${c}88`,
                            color: "white",
                            boxShadow: `
                              inset 0 1px 0 rgba(255,255,255,0.4),
                              inset 0 -1px 0 rgba(0,0,0,0.35),
                              0 0 12px ${c}55
                            `,
                            transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), background 0.4s ease, box-shadow 0.4s ease",
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .cf-xsell-card:hover {
          transform: translateY(-5px);
        }
        .cf-xsell-card:hover .cf-xsell-arrow {
          transform: translateX(3px);
        }
        .cf-xsell-card:hover .cf-xsell-bloom {
          transform: scale(1.25);
          opacity: 1 !important;
        }
        @media (max-width: 900px) {
          .cf-xsell-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          .cf-xsell-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function CyberFirstPage() {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div style={{ background: INK, color: "white", fontFamily: "var(--font-outfit)" }}>
      <Hero />
      <div style={{ position: "relative", isolation: "isolate" }}>
        <PageAtmosphere />
        <div style={{ position: "relative", zIndex: 1 }}>
          <HeroStats />
          <Thesis />
          <InMotion />
          <Arc />
          <TheRoom />
          <Engage />
          <ProofSection />
          <JoinCta />
          <CrossSell />
        </div>
      </div>
      <Footer />
    </div>
  );
}
