"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Footer } from "@/components/sections";
import InquiryForm from "@/components/sections/InquiryForm";
import { MeshGradient } from "@paper-design/shaders-react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const OT_CRIMSON = "#D34B9A";
const OT_CRIMSON_DIM = "#8A2E68";
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
  { city: "OT MENA", country: "Regional Virtual", date: "TBC 2026", edition: "Virtual Boardroom", href: "/events/ot-security-first/virtual-boardroom-mena", status: "open", venue: "Virtual · MENA", image: `${S3}/Good/4N8A0290.JPG`, logo: "" },
  { city: "Johannesburg", country: "South Africa", date: "26 August 2026", edition: "1st Edition · Africa", href: "/events/ot-security-first/johannesburg-2026", status: "open", venue: "Johannesburg", image: `${S3}/events/OT%20Security%20First%20UAE%202025/OT%20First%20UAE%20Photos/4N8A0412.JPG`, logo: "" },
  { city: "Jubail", country: "Saudi Arabia", date: "07 October 2026", edition: "1st Edition", href: "/events/ot-security-first/jubail-2026", status: "soon", venue: "Jubail Industrial City", image: "", logo: "" },
  { city: "Muscat", country: "Oman", date: "TBC 2026", edition: "1st Edition", href: "/events/ot-security-first/oman-2026", status: "soon", venue: "Venue TBA", image: "", logo: "" },
];
const FUTURE_BADGES = [
  { city: "Kuwait City", country: "KW" },
  { city: "Doha", country: "QA" },
  { city: "Riyadh", country: "SA" },
];

const THESIS = [
  {
    num: "01",
    heading: "Practitioner-led, not vendor-driven.",
    body: "The stage belongs to people who own the risk — sitting CISOs, ICS architects, and plant-floor defenders from operators across the Gulf and Africa. Vendors earn their voice; they don't buy it.",
    photo: `https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG`,
    photoAlt: "OT Security First Abu Dhabi — executive networking",
  },
  {
    num: "02",
    heading: "Aligned to the standards the room is audited against.",
    body: "Every session ends with a takeaway a head of OT security can walk into a compliance review with — a control mapped, a mitigation logged, a peer confirmed. Time on the floor pays back time in the boardroom.",
    photo: `https://efg-final.s3.eu-north-1.amazonaws.com/events/OT%20Security%20First%20UAE%202025/OT%20First%20UAE%20Photos/4N8A0394.JPG`,
    photoAlt: "OT Security First Abu Dhabi — main session",
  },
  {
    num: "03",
    heading: "Pure OT. Zero IT detour.",
    body: "Oil & gas, power & utilities, petrochemicals, water, nuclear, manufacturing, mining, transport, smart cities — the sectors the Middle East and Africa cannot afford to lose. Every keynote, panel, and closed-door roundtable stays on the plant floor. No IT-side compromises, no generalist noise.",
    photo: `https://efg-final.s3.eu-north-1.amazonaws.com/events/OT%20Security%20First%20UAE%202025/OT%20First%20UAE%20Photos/4N8A0420.JPG`,
    photoAlt: "OT Security First Abu Dhabi — live session",
  },
];

const HERO_SERVICES = [
  { label: "Summits", desc: "Regional OT-only editions across the Middle East & Africa" },
  { label: "Access", desc: "Invite-only industrial CISO rooms & plant-leader introductions" },
  { label: "Awards", desc: "Stage-recognized OT security leadership awards" },
  { label: "Media", desc: "Co-produced research, film, and on-stage launch assets" },
];

const HERO_STATS = [
  { value: "200+", label: "OT & ICS Security Leaders · Saudi Arabia, UAE, Africa" },
  { value: "5", label: "2026 Editions · NCA OTCC · IEC 62443 · NIS2 aligned" },
  { value: "$5.56M", label: "Avg Industrial Breach Cost · IBM 2025" },
];

const ROLE_MIX = [
  { label: "CISO / Head of OT Security", pct: 36 },
  { label: "VP / Director, Industrial Security", pct: 24 },
  { label: "Plant Manager / OT Architect", pct: 18 },
  { label: "Regulator & Government", pct: 12 },
  { label: "Vendor & Solution Leads", pct: 10 },
];

const INDUSTRIES = [
  "Oil & Gas",
  "Power & Utilities",
  "Petrochemicals",
  "Water & Wastewater",
  "Nuclear",
  "Manufacturing",
  "Mining & Metals",
  "Transport & Logistics",
  "Smart Cities",
  "Government & Critical Infrastructure",
];

const SPEAKERS = [
  { name: "H.E. Dr. Mohamed Al Kuwaiti", title: "Head of Cyber Security", org: "UAE Government", photo: `${S3}/boardroom/MohamedAlKuwaiti.jpg`, focus: "center 22%" },
  { name: "Ali Al Kaf Alhashmi", title: "VP Cyber Security & Technology", org: "Mubadala", photo: `${S3}/Speakers-photos/OT-Security-First/Ali-Al-Kaf-Alhashmi.png` },
  { name: "Shaytel Patel", title: "Group SVP Technology Audit", org: "DP World", photo: `${S3}/Speakers-photos/OT-Security-First/Shaytel-Patel.jpg` },
  { name: "Ali AlQallaf", title: "Head of Cybersecurity Operations", org: "KNPC", photo: `${S3}/Speakers-photos/OT-Security-First/ALI-ALQALLAF.jpg` },
  { name: "Abdulhakeem Al Alawi", title: "Information Security Officer", org: "Oman LNG", photo: `${S3}/Speakers-photos/OT-Security-First/Abdulhakeem-Al-Alawi.jpg` },
  { name: "Khaled Al Teneiji", title: "Cyber Security Head", org: "ENOC", photo: `${S3}/Speakers-photos/OT-Security-First/Khaled-Al-Teneiji.jpg` },
  { name: "Wissam Al-Nasairi", title: "OT Security EMEA Lead", org: "IBM Consulting", photo: `${S3}/Speakers-photos/OT-Security-First/Wissam-Al-Nasairi.jpg` },
  { name: "Mohammed Shoukat Ali", title: "GM & Head Global Cybersecurity CoE", org: "Yokogawa", photo: `${S3}/Speakers-photos/OT-Security-First/Mohammed-Shoukat-Ali.jpg` },
];

const ENGAGEMENT_TIERS = [
  {
    num: "01",
    label: "Sponsor",
    tabKey: "sponsor",
    headline: "Back the only OT-only room in MEA.",
    body: "Headline, strategic, or associate partnership across Jubail, Johannesburg, Muscat, and Virtual MENA. Your product in front of the CISOs running Saudi Aramco, ADNOC, Mubadala, Eskom, ENOC, KNPC and Oman LNG — the operators buying Claroty, Dragos, Nozomi, Xage, OPSWAT budgets this cycle.",
    features: [
      "Keynote & panel placement in the OT-only stream",
      "Branded OT demo lounge or closed CISO boardroom",
      "Pre-qualified one-to-one intros with refinery, grid, utility CISOs",
      "Full media rights · photo · broadcast · research",
      "Co-authored whitepaper distributed to 3,000+ MEA OT leaders",
    ],
    cta: "Request sponsorship deck",
    image: `${S3}/events/OT%20Security%20First%20UAE%202025/OT%20First%20UAE%20Photos/4N8A0397.JPG`,
  },
  {
    num: "02",
    label: "Attend",
    tabKey: "pass",
    headline: "Sit with peers who run the control rooms.",
    body: "Invite-only, no cost to attend for qualified operators: CISOs, heads of OT security, SCADA leads, plant managers, and regulators from oil & gas, power, water, petrochemicals, nuclear, manufacturing, mining, transport and smart cities. Share notes on ransomware containment, IEC 62443 implementation, and vendor-risk audits — under Chatham House Rule.",
    features: [
      "Invite-only · plant, refinery, grid & regulator badges",
      "Chatham House Rule sessions — no press, no recording",
      "Closed-door CISO roundtables on active IR & post-incident review",
      "IEC 62443 & NCA OTCC aligned content · CPE credits available",
      "Cross-edition circuit access across KSA, UAE, Africa",
    ],
    cta: "Request an invite",
    image: `${S3}/events/OT%20Security%20First%20UAE%202025/OT%20First%20UAE%20Photos/4N8A0420.JPG`,
  },
  {
    num: "03",
    label: "Speak",
    tabKey: "speaker",
    headline: "Share what you've seen on the plant floor.",
    body: "The stage belongs to operators who've lived the incident: post-Triton response, ransomware on a utility, a Stuxnet-style supply-chain compromise, a live NCA OTCC audit. If you hold a senior OT security, ICS, or critical-infrastructure brief in Saudi Arabia, the UAE, South Africa, or the wider GCC — pitch the session. The room will be in the front row.",
    features: [
      "Keynote · Panel · Fireside · CISO roundtable",
      "On-stage launch of your OT research or field report",
      "Closed-door incident-review facilitation",
      "Speaker placement across every 2026 edition",
      "Editorial support · media rights · video distribution",
    ],
    cta: "Submit a speaker profile",
    image: `${S3}/events/OT%20Security%20First%20UAE%202025/OT%20First%20UAE%20Photos/4N8A0412.JPG`,
  },
];

const SPONSOR_LOGOS = [
  `${S3_LOGOS}/Claroty.png`,
  `${S3_LOGOS}/Dragos.png`,
  `${S3_LOGOS}/nozomi-networks.png`,
  `${S3_LOGOS}/XONA.png`,
  `${S3_LOGOS}/Xage.png`,
  `${S3_LOGOS}/Tenable-logo.png`,
  `${S3_LOGOS}/OPSWAT-logo.png`,
  `${S3_LOGOS}/YOKOGAWA.png`,
  `${S3_LOGOS}/paloalto.png`,
  `${S3_LOGOS}/fortinet.png`,
  `${S3_LOGOS}/kaspersky.png`,
  `${S3_LOGOS}/Sonicwall.png`,
  `${S3_LOGOS}/ManageEngine.png`,
  `${S3_LOGOS}/Wallix.png`,
  `${S3_LOGOS}/seclab.png`,
  `${S3_LOGOS}/advenica.png`,
  `${S3_LOGOS}/microsec.png`,
  `${S3_LOGOS}/keysight-technologies.png`,
  `${S3_LOGOS}/CPX.png`,
  `${S3_LOGOS}/Paramount.png`,
  `${S3_LOGOS}/bureau-veritas.png`,
  `${S3_LOGOS}/Akamai.png`,
  `${S3_LOGOS}/Group-IB.png`,
  `${S3_LOGOS}/threatlocker.png`,
];

const TESTIMONIAL_IDS = ["Q0n_sVaMnxg", "SF87voLk34A", "R5dtc5kjiQU", "Hm_yj3NttPo", "aaG9We6AjY8"];

// Event photo gallery — mixed aspect, chrome bezel treatment (Proof section)
const GALLERY_PHOTOS = [
  { src: `${S3}/events/OT%20Security%20First%20UAE%202025/OT%20First%20UAE%20Photos/4N8A0412.JPG`, caption: "Panel session · Abu Dhabi", aspect: "4 / 3" },
  { src: `${S3}/Good/4N8A0290.JPG`, caption: "On the main stage", aspect: "4 / 3" },
  { src: `${S3}/events/OT%20Security%20First%20UAE%202025/OT%20First%20UAE%20Photos/4N8A0397.JPG`, caption: "Partner exhibition", aspect: "4 / 3" },
  { src: `${S3}/events/Opex%20First%20UAE/4N8A1751.JPG`, caption: "Award ceremony", aspect: "4 / 3" },
  { src: `${S3}/events/OT%20Security%20First%20UAE%202025/OT%20First%20UAE%20Photos/4N8A0420.JPG`, caption: "Live session", aspect: "4 / 3" },
  { src: `${S3}/events/Opex%20First%20UAE/4N8A1666.JPG`, caption: "Executive networking", aspect: "4 / 3" },
];

// Series films — in-motion proof for the first half of the page (recent → oldest)
const SERIES_FILMS = [
  {
    id: "3ofcPquafgk",
    city: "UAE",
    edition: "Abu Dhabi",
    year: "2026",
    venue: "Rosewood Abu Dhabi",
    headline: "The debut edition.",
    body: "Abu Dhabi 2026 put OT security on its own stage — 34 speakers, 150+ critical-infrastructure leaders, the first room in the region where ICS defenders set the agenda without an IT detour.",
  },
];

const CROSS_SELL = [
  { label: "Cyber First", href: "/events/cyber-first", color: "#01BBF5", tagline: "Cybersecurity summits for CISOs · Gulf, Africa, South Asia" },
  { label: "Digital First", href: "/events/data-ai-first", color: "#0F735E", tagline: "AI &amp; data strategy for CDOs · enterprise intelligence" },
  { label: "OPEX First", href: "/events/opex-first", color: "#7C3AED", tagline: "Operational excellence · automation · COO & transformation" },
  { label: "Roundtable", href: "/network-first", color: "#C9935A", tagline: "Invite-only executive boardrooms · closed-door C-suite" },
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
      <div style={{ position: "absolute", top: "-2%", left: "-18%", width: "58%", height: "28%", background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(211,75,154,0.10), transparent 72%)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", top: "14%", right: "-18%", width: "58%", height: "28%", background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(211,75,154,0.10), transparent 72%)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", top: "30%", left: "-18%", width: "58%", height: "28%", background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(211,75,154,0.10), transparent 72%)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", top: "46%", right: "-18%", width: "58%", height: "28%", background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(211,75,154,0.10), transparent 72%)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", top: "62%", left: "-18%", width: "58%", height: "28%", background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(211,75,154,0.10), transparent 72%)", filter: "blur(80px)" }} />
      <div style={{ position: "absolute", top: "78%", right: "-18%", width: "58%", height: "28%", background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(211,75,154,0.10), transparent 72%)", filter: "blur(80px)" }} />

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
        background: "radial-gradient(ellipse 55% 50% at 50% 40%, rgba(211,75,154,0.11), rgba(211,75,154,0.03) 50%, transparent 75%)",
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
      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, fontWeight: 700, color: OT_CRIMSON, letterSpacing: "0.3em", fontVariantNumeric: "tabular-nums" }}>
        {num}
      </span>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${OT_CRIMSON}66 0%, ${OT_CRIMSON}18 50%, transparent 100%)` }} />
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
          <stop offset="0%" stopColor={OT_CRIMSON} stopOpacity="1" />
          <stop offset="60%" stopColor={OT_CRIMSON} stopOpacity="0.5" />
          <stop offset="100%" stopColor={OT_CRIMSON} stopOpacity="0" />
        </radialGradient>
      </defs>
      {connections.map((c, i) => (
        <line
          key={`l${i}`}
          x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
          stroke={OT_CRIMSON}
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section style={{ position: "relative", minHeight: "100svh", background: INK, overflow: "hidden", color: "white", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {/* ── Layer 0: Mesh gradient base — soft flowing magenta blobs on deep ink ── */}
      {mounted && (
        <MeshGradient
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
          colors={["#000000", "#12070c", "#3a0e26", "#8a2b5a", "#d34b9a"]}
          speed={0.28}
          distortion={0.62}
          swirl={0.48}
          grainOverlay={0.07}
        />
      )}

      {/* ── Layer 1: Industrial wireframe grid — OT tie-in, fades at edges ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage: `
            linear-gradient(to right, rgba(211,75,154,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(211,75,154,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "clamp(60px, 7vw, 96px) clamp(60px, 7vw, 96px)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0.9) 20%, transparent 85%)",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0.9) 20%, transparent 85%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Layer 2: Central ambient magenta bloom behind the headline ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "32%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(90%, 1100px)",
          height: "60%",
          background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(211,75,154,0.22) 0%, rgba(211,75,154,0.08) 35%, transparent 72%)",
          zIndex: 2,
          pointerEvents: "none",
          filter: "blur(18px)",
        }}
      />

      {/* ── Layer 3: Readability — darker at top + bottom where text sits ── */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(5,6,8,0.68) 0%, rgba(5,6,8,0.22) 22%, rgba(5,6,8,0) 42%, rgba(5,6,8,0) 58%, rgba(5,6,8,0.35) 78%, rgba(5,6,8,0.85) 100%)`, zIndex: 3, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 90% 100% at 50% 50%, transparent 38%, rgba(5,6,8,0.55) 100%)`, zIndex: 3, pointerEvents: "none" }} />

      {/* Content — asymmetric editorial layout */}
      <div style={{
        position: "relative",
        zIndex: 4,
        display: "flex",
        flexDirection: "column",
        gap: "clamp(22px, 3.4svh, 40px)",
        padding: "clamp(52px, 6svh, 80px) clamp(20px, 5vw, 80px) clamp(44px, 5svh, 68px)",
        maxWidth: 1440,
        margin: "0 auto",
        width: "100%",
      }}>
        {/* ─── TOP ROW: badge left + edition counter right ────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="otsf-hero-toprow"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}
        >
          {/* Series badge — glass + skeu hybrid pill (LEFT) */}
          <div>
            {/* Ambient magenta halo behind the badge */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{
                position: "absolute",
                inset: -10,
                borderRadius: 999,
                background: "radial-gradient(ellipse 60% 90% at 50% 50%, rgba(211,75,154,0.18) 0%, transparent 70%)",
                filter: "blur(14px)",
                pointerEvents: "none",
              }} />

              {/* Outer metallic bezel */}
              <div className="otsf-series-bezel" style={{
                position: "relative",
                padding: 1.5,
                borderRadius: 999,
                background: `linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.02) 65%, rgba(0,0,0,0.35) 100%)`,
                boxShadow: `0 10px 28px rgba(0,0,0,0.45), 0 0 36px rgba(211,75,154,0.12)`,
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
                  <span className="otsf-pill-shimmer" />

                  {/* Top refraction line */}
                  <span style={{ position: "absolute", top: 0, left: "18%", right: "18%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)", pointerEvents: "none", zIndex: 2 }} />

                  {/* Cyan pulse dot */}
                  <span style={{
                    position: "relative",
                    zIndex: 3,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${OT_CRIMSON} 55%, #8A2E68 100%)`,
                    boxShadow: `0 0 0 1.5px rgba(211,75,154,0.2), 0 0 10px ${OT_CRIMSON}, inset 0 1px 0 rgba(255,255,255,0.6)`,
                    flexShrink: 0,
                  }} className="otsf-pulse-dot" />

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
          </div>

          {/* Edition counter — RIGHT side micro meta */}
          <div style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(9.5px, 0.85vw, 11px)",
            fontWeight: 700,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.52)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <span style={{ width: 18, height: 1, background: `linear-gradient(90deg, transparent, ${OT_CRIMSON})` }} />
            <span>2026 Circuit</span>
            <span style={{ color: OT_CRIMSON, opacity: 0.7 }}>·</span>
            <span style={{ color: OT_CRIMSON, fontVariantNumeric: "tabular-nums" }}>02</span>
            <span>Confirmed</span>
          </div>
        </motion.div>

        {/* ─── MAIN SPLIT: brand LEFT · tagline RIGHT ──────────────────── */}
        <div className="otsf-hero-split" style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 1fr",
          gap: "clamp(28px, 4.5vw, 80px)",
          alignItems: "center",
        }}>
          {/* LEFT: Brand title — stacked, left-aligned */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 200,
              fontSize: "clamp(44px, 7.6vw, 112px)",
              lineHeight: 0.94,
              letterSpacing: "-0.034em",
              margin: 0,
              textTransform: "uppercase",
              textAlign: "left",
              display: "block",
            }}
          >
            <span className="otsf-brand-shimmer" style={{ display: "block" }}>OT Security</span>
            <span className="otsf-brand-shimmer" style={{ display: "block" }}>First</span>
          </motion.h1>

          {/* RIGHT: Tagline pull-quote + SEO sub */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
            className="otsf-hero-pullquote"
            style={{ position: "relative", paddingLeft: "clamp(18px, 2vw, 32px)" }}
          >
            {/* Vertical magenta accent line */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: "8%",
                bottom: "8%",
                width: 1,
                background: `linear-gradient(180deg, transparent 0%, ${OT_CRIMSON}aa 20%, ${OT_CRIMSON} 50%, ${OT_CRIMSON}aa 80%, transparent 100%)`,
                boxShadow: `0 0 12px ${OT_CRIMSON}66`,
              }}
            />

            {/* Pull-quote */}
            <p style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(18px, 2.4vw, 34px)",
              lineHeight: 1.22,
              letterSpacing: "-0.008em",
              color: "rgba(255,255,255,0.96)",
              margin: 0,
              textShadow: "0 1px 0 rgba(0,0,0,0.45)",
              textWrap: "balance" as "balance",
              maxWidth: 560,
            }}>
              The control rooms of a region,{" "}
              <span className="otsf-accent-shimmer">in one room.</span>
            </p>

            {/* SEO sub */}
            <p style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(11.5px, 1vw, 14px)",
              fontWeight: 400,
              lineHeight: 1.62,
              color: "rgba(255,255,255,0.6)",
              margin: "clamp(12px, 1.6vh, 18px) 0 0",
              letterSpacing: "0.005em",
              maxWidth: 540,
              textWrap: "pretty" as "pretty",
            }}>
              OT, ICS &amp; critical-infrastructure cybersecurity summits — Saudi Arabia, UAE &amp; Africa. Aligned to NCA OTCC-1:2022 &amp; IEC 62443.
            </p>
          </motion.div>
        </div>


        {/* ─── EVENTS TICKER: the 2026 circuit in one horizontal row ───── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
          className="otsf-hero-editions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(12px, 1.5vw, 22px)",
            padding: "clamp(12px, 1.5vh, 18px) 0",
            position: "relative",
            flexWrap: "wrap",
          }}
        >
          {/* Top rule */}
          <span aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 15%, rgba(211,75,154,0.45) 50%, rgba(255,255,255,0.1) 85%, transparent 100%)`, pointerEvents: "none" }} />
          {/* Bottom rule */}
          <span aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 15%, rgba(211,75,154,0.3) 50%, rgba(255,255,255,0.08) 85%, transparent 100%)`, pointerEvents: "none" }} />

          {/* Eyebrow */}
          <span style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(9.5px, 0.8vw, 11px)",
            fontWeight: 700,
            color: OT_CRIMSON,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            flexShrink: 0,
          }}>
            2026 Circuit
          </span>
          <span style={{ width: 24, height: 1, background: `linear-gradient(90deg, ${OT_CRIMSON}, transparent)`, flexShrink: 0 }} />

          {/* Cities — flex row, wraps on narrow */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(8px, 1vw, 16px)",
            flexWrap: "wrap",
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(12px, 1vw, 14.5px)",
            fontWeight: 500,
            color: "rgba(255,255,255,0.86)",
            letterSpacing: "0.02em",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 8px ${OT_CRIMSON}` }} />
              OT MENA
            </span>
            <span style={{ color: OT_CRIMSON, opacity: 0.55 }}>·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 8px ${OT_CRIMSON}` }} />
              Johannesburg
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)", opacity: 0.7 }}>·</span>
            <span style={{ color: "rgba(255,255,255,0.58)" }}>Jubail</span>
            <span style={{ color: "rgba(255,255,255,0.2)", opacity: 0.7 }}>·</span>
            <span style={{ color: "rgba(255,255,255,0.58)" }}>Muscat</span>
            <span style={{
              marginLeft: 4,
              fontFamily: "var(--font-dm-sans)",
              fontSize: "clamp(9px, 0.75vw, 10.5px)",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.36)",
            }}>
              + more under review
            </span>
          </div>
        </motion.div>

          {/* CTA row — left-anchored, editorial-style */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.8 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "clamp(14px, 2vw, 26px)",
            }}
            className="otsf-hero-actions"
          >
            <Link
              href="#engage"
              className="otsf-hero-cta"
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "15px 30px 15px 34px",
                background: `linear-gradient(180deg, #E86BB8 0%, ${OT_CRIMSON} 55%, #9E3374 100%)`,
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
                  0 14px 38px rgba(211,75,154,0.3),
                  0 0 70px rgba(211,75,154,0.12)
                `,
                overflow: "hidden",
              }}
            >
              <span style={{ position: "absolute", top: 1, left: "10%", right: "10%", height: "38%", background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)", borderRadius: "999px 999px 50% 50%", pointerEvents: "none", filter: "blur(0.3px)" }} />
              <span style={{ position: "relative", zIndex: 2 }}>Partner with us</span>
              <span style={{ position: "relative", zIndex: 2, fontSize: 15, marginTop: -1, transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)" }} className="otsf-hero-cta-arrow">→</span>
            </Link>

            {/* Chromed vertical divider */}
            <span className="otsf-hero-divider" style={{
              display: "inline-block",
              width: 1,
              height: 32,
              background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.22) 40%, rgba(255,255,255,0.22) 60%, transparent 100%)`,
              boxShadow: `0 0 8px rgba(255,255,255,0.08)`,
            }} />

            {/* Secondary link — subtle glass chip */}
            <Link
              href="#engage"
              className="otsf-hero-next"
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
              <span className="otsf-hero-next-arrow" style={{
                position: "relative",
                zIndex: 2,
                display: "inline-flex",
                alignItems: "center",
                color: OT_CRIMSON,
                fontSize: 13,
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
              }}>→</span>
            </Link>
          </motion.div>
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
          boxShadow: `0 6px 18px rgba(0,0,0,0.4), 0 0 22px rgba(211,75,154,0.1)`,
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
            <div className="otsf-scroll-tick" style={{
              position: "absolute",
              top: 6,
              width: 2,
              height: 7,
              borderRadius: 2,
              background: `linear-gradient(180deg, ${OT_CRIMSON}, rgba(211,75,154,0.3) 70%, transparent)`,
              boxShadow: `0 0 8px ${OT_CRIMSON}`,
            }} />
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes otsf-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.4); }
        }
        .otsf-pulse-dot { animation: otsf-pulse 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes otsf-text-shimmer {
          0%   { background-position: 200% 50%; }
          100% { background-position: -40% 50%; }
        }
        @keyframes otsf-accent-shimmer-sweep {
          0%   { background-position: 260% 50%; }
          100% { background-position: -80% 50%; }
        }
        /* Brand title — cool-white base, bright cyan-haloed shine sweeps across */
        .otsf-brand-shimmer {
          background-image: linear-gradient(
            105deg,
            rgba(250, 215, 230, 0.78) 0%,
            rgba(255, 225, 240, 0.85) 30%,
            ${OT_CRIMSON} 42%,
            #ffe9f3 48%,
            #ffffff 50%,
            #ffe9f3 52%,
            ${OT_CRIMSON} 58%,
            rgba(255, 225, 240, 0.85) 70%,
            rgba(250, 215, 230, 0.78) 100%
          );
          background-size: 220% 100%;
          background-position: 200% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: otsf-text-shimmer 5s cubic-bezier(0.55, 0, 0.45, 1) infinite;
          filter: drop-shadow(0 0 42px rgba(211,75,154,0.32));
        }
        /* Tagline accent — solid cyan base, narrow bright shine sweeps across */
        .otsf-accent-shimmer {
          display: inline-block;
          padding: 0 0.12em;
          margin: 0 -0.12em;
          background-image: linear-gradient(
            105deg,
            ${OT_CRIMSON} 0%,
            ${OT_CRIMSON} 44%,
            #ffd6ec 48%,
            #ffffff 50%,
            #ffd6ec 52%,
            ${OT_CRIMSON} 56%,
            ${OT_CRIMSON} 100%
          );
          background-size: 300% 100%;
          background-position: 260% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: otsf-accent-shimmer-sweep 5.5s cubic-bezier(0.55, 0, 0.45, 1) infinite;
          animation-delay: 1.5s;
          filter: drop-shadow(0 0 18px rgba(211,75,154,0.22));
        }
        @keyframes otsf-pill-shimmer {
          0%   { left: -85%; }
          100% { left: 185%; }
        }
        .otsf-pill-shimmer {
          position: absolute;
          top: 0;
          left: -85%;
          width: 48%;
          height: 100%;
          background: linear-gradient(100deg, transparent 0%, rgba(211,75,154,0.08) 35%, rgba(255,255,255,0.18) 50%, rgba(211,75,154,0.08) 65%, transparent 100%);
          transform: skewX(-18deg);
          pointer-events: none;
          z-index: 1;
          animation: otsf-pill-shimmer 6.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
          border-radius: 999px;
        }
        .otsf-hero-pill-sub .otsf-pill-shimmer {
          animation-duration: 8s;
          animation-delay: 2.2s;
          background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
        }
        @keyframes otsf-scroll-drop {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(18px); opacity: 0; }
        }
        .otsf-scroll-tick { animation: otsf-scroll-drop 2s cubic-bezier(0.5, 0, 0.5, 1) infinite; }
        .otsf-hero-cta:hover {
          transform: translateY(-2px) scale(1.02);
          background: linear-gradient(180deg, #EE87C5 0%, #D34B9A 55%, #A83779 100%) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.65),
            inset 0 -1px 0 rgba(0,30,50,0.3),
            inset 0 0 0 0.5px rgba(255,255,255,0.25),
            0 2px 6px rgba(0,0,0,0.6),
            0 20px 50px rgba(211,75,154,0.5),
            0 0 90px rgba(211,75,154,0.28) !important;
        }
        .otsf-hero-cta:hover .otsf-hero-cta-arrow { transform: translateX(4px); }
        .otsf-hero-next:hover {
          color: rgba(255,255,255,0.98) !important;
          background: rgba(211,75,154,0.08) !important;
          border-color: rgba(211,75,154,0.32) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 6px 20px rgba(211,75,154,0.22) !important;
          transform: translateY(-1px);
        }
        .otsf-hero-next:hover .otsf-hero-next-arrow { transform: translateX(4px); }
        @media (max-width: 960px) {
          .otsf-hero-split {
            grid-template-columns: 1fr !important;
            gap: clamp(24px, 4vh, 40px) !important;
          }
          .otsf-hero-pullquote {
            padding-left: 0 !important;
          }
          .otsf-hero-pullquote > span[aria-hidden] {
            display: none !important;
          }
          .otsf-hero-toprow {
            justify-content: flex-start !important;
          }
          .otsf-hero-divider { display: none !important; }
          .otsf-hero-actions { flex-direction: column !important; gap: 14px !important; align-items: stretch !important; }
          .otsf-hero-cta { width: 100% !important; justify-content: center !important; max-width: 320px !important; }
          .otsf-hero-next { width: 100% !important; justify-content: center !important; max-width: 320px !important; }
        }
        @media (max-width: 480px) {
          .otsf-hero-editions {
            gap: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── HERO STATS — editorial data moment, $5.56M as the hero figure ──────────
function HeroStats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{
      background: "transparent",
      padding: "clamp(48px, 6vw, 88px) 0 clamp(40px, 5vw, 72px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient bloom behind the hero figure */}
      <div style={{
        position: "absolute",
        top: "38%",
        left: "18%",
        width: "55%",
        height: "75%",
        background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(211,75,154,0.18) 0%, transparent 72%)",
        pointerEvents: "none",
        filter: "blur(48px)",
      }} />

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 clamp(20px, 5vw, 80px)", position: "relative", zIndex: 2 }}>
        {/* Section mark — left-rail, editorial */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "clamp(24px, 3vh, 44px)" }}
        >
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(18px, 1.6vw, 24px)",
            fontWeight: 200,
            color: "rgba(255,255,255,0.38)",
            letterSpacing: "-0.01em",
            fontVariantNumeric: "tabular-nums",
          }}>
            02
          </span>
          <span style={{ width: 44, height: 1, background: `linear-gradient(90deg, rgba(255,255,255,0.25), ${OT_CRIMSON} 60%, transparent)` }} />
          <span style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(10px, 0.85vw, 11.5px)",
            fontWeight: 700,
            color: OT_CRIMSON,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
          }}>
            The Cost of Doing Nothing
          </span>
        </motion.div>

        {/* Data moment — asymmetric split: hero figure left / narrative right */}
        <div className="otsf-stats-split" style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "end",
        }}>
          {/* LEFT: hero figure + meta */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
          >
            {/* Huge figure */}
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(72px, 13vw, 196px)",
              fontWeight: 200,
              letterSpacing: "-0.05em",
              lineHeight: 0.92,
              color: "white",
              textShadow: `0 0 60px ${OT_CRIMSON}26, 0 4px 30px rgba(0,0,0,0.5)`,
            }}>
              <span className="otsf-brand-shimmer">$5.56M</span>
            </div>

            {/* Underline + label */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: "clamp(14px, 1.8vh, 22px)" }}>
              <span style={{ width: "clamp(36px, 5vw, 64px)", height: 1, background: `linear-gradient(90deg, ${OT_CRIMSON}, transparent)` }} />
              <span style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "clamp(10.5px, 0.9vw, 12.5px)",
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}>
                Avg Industrial Breach Cost
              </span>
            </div>
            <div style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(12px, 1vw, 14px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.015em",
              marginTop: 10,
              fontStyle: "italic",
            }}>
              IBM Cost of a Data Breach Report, 2025
            </div>
          </motion.div>

          {/* RIGHT: framing narrative + supporting stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
            style={{ position: "relative", paddingLeft: "clamp(18px, 2vw, 28px)" }}
          >
            {/* Vertical magenta accent */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: 4,
                bottom: 4,
                width: 1,
                background: `linear-gradient(180deg, transparent 0%, ${OT_CRIMSON}aa 15%, ${OT_CRIMSON} 50%, ${OT_CRIMSON}aa 85%, transparent 100%)`,
                boxShadow: `0 0 12px ${OT_CRIMSON}55`,
              }}
            />

            <p style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(17px, 1.8vw, 24px)",
              lineHeight: 1.3,
              color: "rgba(255,255,255,0.92)",
              margin: 0,
              letterSpacing: "-0.008em",
              textWrap: "balance" as "balance",
            }}>
              The room where that number gets{" "}
              <span className="otsf-accent-shimmer">smaller.</span>
            </p>

            {/* Supporting stats — typographic rows, no chrome */}
            <div style={{ marginTop: "clamp(22px, 2.6vh, 32px)", display: "flex", flexDirection: "column", gap: "clamp(14px, 1.6vh, 20px)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 2.4vw, 34px)",
                  fontWeight: 300,
                  color: OT_CRIMSON,
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "clamp(72px, 8vw, 110px)",
                }}>
                  200+
                </span>
                <span style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(12.5px, 1.05vw, 14px)",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.5,
                  letterSpacing: "0.01em",
                }}>
                  OT &amp; ICS Security Leaders on the circuit —{" "}
                  <span style={{ color: "rgba(255,255,255,0.52)" }}>Saudi Arabia · UAE · Africa</span>
                </span>
              </div>

              <div style={{ height: 1, background: `linear-gradient(90deg, rgba(255,255,255,0.08), transparent)` }} />

              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 2.4vw, 34px)",
                  fontWeight: 300,
                  color: OT_CRIMSON,
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "clamp(72px, 8vw, 110px)",
                }}>
                  05
                </span>
                <span style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(12.5px, 1.05vw, 14px)",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.5,
                  letterSpacing: "0.01em",
                }}>
                  2026 Editions confirmed —{" "}
                  <span style={{ color: "rgba(255,255,255,0.52)" }}>NCA OTCC · IEC 62443 · NIS2 aligned</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 960px) {
          .otsf-stats-split {
            grid-template-columns: 1fr !important;
            gap: clamp(24px, 4vh, 44px) !important;
            align-items: start !important;
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
      className="otsf-thesis-photo"
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
        background: "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 28%, rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.08) 75%, rgba(211,75,154,0.38) 100%)",
        boxShadow: "0 22px 54px rgba(0,0,0,0.5), 0 0 40px rgba(211,75,154,0.12), 0 0 0 1px rgba(255,255,255,0.03)",
      }}>
        <div style={{ position: "absolute", inset: 2, borderRadius: 14, pointerEvents: "none", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.45)", zIndex: 3 }} />
        <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", aspectRatio: aspect, background: "#000" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="otsf-thesis-photo-img"
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
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(211,75,154,0.08), transparent 45%, rgba(211,75,154,0.08) 100%)", mixBlendMode: "overlay" as const, pointerEvents: "none" }} />
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
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 8px ${OT_CRIMSON}`, flexShrink: 0 }} />
            <span style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 9.5,
              fontWeight: 700,
              color: OT_CRIMSON,
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
    <section ref={ref} id="thesis" style={{ background: "transparent", padding: "clamp(36px, 4.5vw, 64px) 0 clamp(28px, 3.6vw, 48px)", position: "relative", overflow: "hidden" }}>
      <SectionAmbient />
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 clamp(20px, 5vw, 80px)", position: "relative", zIndex: 1 }}>
        <SectionMark num="03" label="The Thesis" />

        {/* TOP ROW — asymmetric headline LEFT + single cinematic photo RIGHT */}
        <div className="otsf-thesis-top" style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "clamp(28px, 4vw, 60px)",
          alignItems: "center",
          marginTop: "clamp(18px, 2.2vh, 28px)",
          marginBottom: "clamp(28px, 3.6vw, 48px)",
        }}>
          {/* LEFT: oversized headline + brief lede */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 1.2, ease: EASE }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 200,
                fontSize: "clamp(38px, 5.4vw, 88px)",
                lineHeight: 1.02,
                letterSpacing: "-0.036em",
                color: "white",
                margin: 0,
                maxWidth: 680,
                textWrap: "balance" as "balance",
              }}
            >
              Most summits sell access.{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                <span className="otsf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 300, animationDuration: "11s" }}>
                  We curate intelligence.
                </span>
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: "-0.08em",
                    height: 1,
                    background: `linear-gradient(90deg, transparent 0%, ${OT_CRIMSON}88 25%, ${OT_CRIMSON} 50%, ${OT_CRIMSON}88 75%, transparent 100%)`,
                    boxShadow: `0 0 14px ${OT_CRIMSON}55`,
                    opacity: 0.85,
                    pointerEvents: "none",
                  }}
                />
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(13.5px, 1.1vw, 16px)",
                fontWeight: 400,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.6)",
                margin: "clamp(24px, 3vh, 36px) 0 0",
                maxWidth: 520,
                letterSpacing: "0.005em",
                textWrap: "pretty" as "pretty",
              }}
            >
              Three principles separate an OT Security First room from a trade-show booth. They show up on every agenda, in every vetting call, on every Chatham House floor.
            </motion.p>
          </div>

          {/* RIGHT: single cinematic panorama photo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
            className="otsf-thesis-hero-photo"
            style={{ position: "relative" }}
          >
            {/* Ambient magenta halo */}
            <div aria-hidden style={{
              position: "absolute",
              inset: -40,
              borderRadius: 36,
              background: `radial-gradient(ellipse 60% 70% at 50% 50%, ${OT_CRIMSON}26, transparent 72%)`,
              filter: "blur(52px)",
              pointerEvents: "none",
            }} />

            <div style={{
              position: "relative",
              borderRadius: 14,
              overflow: "hidden",
              aspectRatio: "5 / 4",
              background: "#05070b",
              boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 0 60px ${OT_CRIMSON}1a, 0 0 0 1px rgba(255,255,255,0.04)`,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${S3}/events/OT%20Security%20First%20UAE%202025/OT%20First%20UAE%20Photos/4N8A0412.JPG`}
                alt="OT Security First Abu Dhabi — the main stage"
                loading="lazy"
                className="otsf-thesis-hero-img"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 45%",
                  filter: "saturate(0.8) contrast(1.1) brightness(0.72)",
                  transition: "transform 1s cubic-bezier(0.22,1,0.36,1), filter 0.6s ease",
                }}
              />

              {/* Dark bottom fade */}
              <span aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,7,11,0.25) 0%, transparent 30%, transparent 55%, rgba(5,7,11,0.88) 100%)", pointerEvents: "none" }} />
              {/* Magenta mix-blend tint */}
              <span aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${OT_CRIMSON}14, transparent 45%, ${OT_CRIMSON}10 100%)`, mixBlendMode: "overlay" as const, pointerEvents: "none" }} />
              {/* Top specular hairline */}
              <span aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg, transparent, ${OT_CRIMSON}cc, transparent)`, boxShadow: `0 0 12px ${OT_CRIMSON}88`, pointerEvents: "none" }} />

              {/* Inline caption at bottom — no chrome chip */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "clamp(18px, 2vw, 30px) clamp(20px, 2.4vw, 34px)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 16,
              }}>
                <div>
                  <div style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "clamp(9.5px, 0.78vw, 10.5px)",
                    fontWeight: 700,
                    color: OT_CRIMSON,
                    letterSpacing: "0.36em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}>
                    OT Security First · Abu Dhabi
                  </div>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(18px, 1.8vw, 24px)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: "white",
                    letterSpacing: "-0.008em",
                    lineHeight: 1.1,
                  }}>
                    The room, in motion.
                  </div>
                </div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(18px, 1.8vw, 24px)",
                  fontWeight: 200,
                  color: "rgba(255,255,255,0.52)",
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  2026
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM — 3 stacked thesis rows, zigzag mirrored layout */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {THESIS.map((t, i) => {
            const reverse = i % 2 === 0;
            return (
              <motion.div
                key={t.num}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.4 + i * 0.1, ease: EASE }}
                className="otsf-thesis-arg"
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "clamp(20px, 3vw, 48px)",
                  alignItems: "center",
                  padding: "clamp(14px, 1.8vw, 24px) clamp(14px, 1.6vw, 22px)",
                  borderTop: i > 0 ? `1px solid rgba(255,255,255,0.06)` : undefined,
                }}
              >
                {/* Magenta accent bar — left on normal rows, right on reversed rows */}
                <span
                  aria-hidden
                  className="otsf-thesis-accent"
                  style={{
                    position: "absolute",
                    [reverse ? "right" : "left"]: 0,
                    top: "clamp(18px, 2.4vw, 30px)",
                    bottom: "clamp(18px, 2.4vw, 30px)",
                    width: 2,
                    background: `linear-gradient(180deg, transparent 0%, ${OT_CRIMSON} 50%, transparent 100%)`,
                    boxShadow: `0 0 14px ${OT_CRIMSON}88`,
                    borderRadius: 2,
                    pointerEvents: "none",
                  }}
                />

                {/* Decorative top taper */}
                {i > 0 && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: -1,
                      [reverse ? "right" : "left"]: "clamp(14px, 1.6vw, 22px)",
                      width: "clamp(60px, 8vw, 120px)",
                      height: 1,
                      background: `linear-gradient(${reverse ? "270deg" : "90deg"}, ${OT_CRIMSON}, transparent)`,
                      boxShadow: `0 0 10px ${OT_CRIMSON}66`,
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* TEXT BLOCK — number + heading + body */}
                <div
                  className="otsf-thesis-textblock"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "clamp(72px, 8vw, 120px) 1fr",
                    gap: "clamp(14px, 2vw, 28px)",
                    alignItems: "start",
                    order: reverse ? 2 : 1,
                  }}
                >
                  {/* Solid magenta-gradient big number */}
                  <div
                    className="otsf-thesis-num"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(48px, 6vw, 96px)",
                      fontWeight: 200,
                      lineHeight: 0.86,
                      letterSpacing: "-0.05em",
                      backgroundImage: `linear-gradient(165deg, #ffffff 0%, ${OT_CRIMSON} 55%, ${OT_CRIMSON_DIM} 100%)`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                      filter: `drop-shadow(0 0 24px ${OT_CRIMSON}2e)`,
                      fontVariantNumeric: "tabular-nums",
                      userSelect: "none" as const,
                    }}
                  >
                    {t.num}
                  </div>

                  {/* Heading + body */}
                  <div>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(24px, 2.6vw, 38px)",
                      fontWeight: 300,
                      lineHeight: 1.14,
                      letterSpacing: "-0.022em",
                      color: "white",
                      margin: "0 0 clamp(10px, 1.4vh, 16px)",
                      textWrap: "balance" as "balance",
                    }}>
                      {t.heading}
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: "clamp(15px, 1.2vw, 18px)",
                      fontWeight: 300,
                      lineHeight: 1.65,
                      color: "rgba(255,255,255,0.68)",
                      margin: 0,
                      textWrap: "pretty" as "pretty",
                    }}>
                      {t.body}
                    </p>
                  </div>
                </div>

                {/* PHOTO BLOCK */}
                <div
                  className="otsf-thesis-photo"
                  style={{
                    position: "relative",
                    borderRadius: 10,
                    overflow: "hidden",
                    aspectRatio: "16 / 10",
                    width: "100%",
                    order: reverse ? 1 : 2,
                    boxShadow: `0 18px 42px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), 0 0 36px ${OT_CRIMSON}14`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.photo}
                    alt={t.photoAlt}
                    loading="lazy"
                    className="otsf-thesis-photo-img"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center 45%",
                      filter: "saturate(0.85) contrast(1.1) brightness(0.78)",
                      transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1), filter 0.6s ease",
                    }}
                  />
                  <span aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,7,11,0.2) 0%, transparent 35%, rgba(5,7,11,0.75) 100%)", pointerEvents: "none" }} />
                  <span aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${OT_CRIMSON}14, transparent 45%, ${OT_CRIMSON}0a 100%)`, mixBlendMode: "overlay" as const, pointerEvents: "none" }} />
                  <span aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${OT_CRIMSON}cc, transparent)`, pointerEvents: "none" }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .otsf-thesis-hero-photo:hover .otsf-thesis-hero-img {
          transform: scale(1.035);
          filter: saturate(0.95) contrast(1.12) brightness(0.78) !important;
        }
        .otsf-thesis-arg:hover .otsf-thesis-photo-img {
          transform: scale(1.05);
          filter: saturate(0.95) contrast(1.12) brightness(0.84) !important;
        }
        @media (max-width: 960px) {
          .otsf-thesis-top {
            grid-template-columns: 1fr !important;
            gap: clamp(24px, 3.6vh, 36px) !important;
          }
          .otsf-thesis-arg {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .otsf-thesis-arg .otsf-thesis-textblock {
            order: 1 !important;
          }
          .otsf-thesis-arg .otsf-thesis-photo {
            order: 2 !important;
          }
          .otsf-thesis-textblock {
            grid-template-columns: clamp(64px, 14vw, 88px) 1fr !important;
            gap: clamp(12px, 2.4vw, 20px) !important;
          }
          .otsf-thesis-num {
            font-size: clamp(48px, 14vw, 72px) !important;
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
      className="otsf-film-card"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 12,
        overflow: "hidden",
        cursor: playing ? "default" : "pointer",
        background: "#000",
        boxShadow: "0 14px 36px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 30px rgba(211,75,154,0.06)",
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
            className="otsf-film-img"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.78) saturate(0.92)", transition: "filter 0.5s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)" }}
          />
          {/* Bottom gradient */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.8) 100%)", pointerEvents: "none" }} />
          {/* Subtle cyan overlay tint */}
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 60%, rgba(211,75,154,0.08), transparent 70%)`, pointerEvents: "none", mixBlendMode: "overlay" as const }} />
          {/* Top hairline reflection */}
          <div style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`, pointerEvents: "none" }} />

          {/* Play button — Apple-glossy cyan orb */}
          <div className="otsf-film-play" style={{
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
              background: `linear-gradient(180deg, #E86BB8 0%, ${OT_CRIMSON} 55%, #8A2E68 100%)`,
              boxShadow: `
                inset 0 1.5px 0 rgba(255,255,255,0.55),
                inset 0 -1px 0 rgba(0,30,50,0.3),
                0 10px 30px rgba(211,75,154,0.5),
                0 0 70px rgba(211,75,154,0.25)
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
              background: OT_CRIMSON,
              boxShadow: `0 0 8px ${OT_CRIMSON}, 0 0 0 2px rgba(211,75,154,0.2)`,
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
      className={`otsf-edition-row${reverse ? " otsf-edition-reverse" : ""}`}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(32px, 4.5vw, 72px)",
        alignItems: "center",
      }}
    >
      {/* Video column */}
      <motion.div
        className="otsf-edition-video"
        initial={{ opacity: 0, x: reverse ? 28 : -28, scale: 0.98 }}
        animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.1 + index * 0.1, ease: EASE }}
        style={{ position: "relative", aspectRatio: "16 / 9", order: reverse ? 2 : 1 }}
      >
        <FilmCard film={film} />
      </motion.div>

      {/* Text column */}
      <motion.div
        className="otsf-edition-text"
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
            background: `linear-gradient(90deg, ${OT_CRIMSON}, transparent)`,
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
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 8px ${OT_CRIMSON}`, flexShrink: 0 }} />
          <span style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 10.5,
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}>
            OT Security First · {film.venue}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function InMotion() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const film = SERIES_FILMS[0];

  const stats = [
    { val: "01", label: "Edition run" },
    { val: "34", label: "Speakers on stage" },
    { val: "150+", label: "Industrial leaders" },
    { val: "15+", label: "OT partners" },
  ];

  return (
    <section ref={ref} id="past" style={{ background: "transparent", padding: "clamp(36px, 4.5vw, 64px) 0 clamp(28px, 3.6vw, 48px)", position: "relative", overflow: "hidden" }}>
      <SectionAmbient />
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 clamp(20px, 5vw, 80px)", position: "relative", zIndex: 1 }}>
        <SectionMark num="04" label="The Past" />

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.2, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 200,
            fontSize: "clamp(22px, 4.8vw, 76px)",
            lineHeight: 1.02,
            letterSpacing: "-0.036em",
            color: "white",
            margin: "clamp(18px, 2.2vh, 28px) 0 clamp(12px, 1.6vh, 18px)",
            whiteSpace: "nowrap",
          }}
        >
          The debut edition.{" "}
          <span className="otsf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 300, animationDuration: "11s" }}>
            In motion.
          </span>
        </motion.h2>

        {/* Sub italic line */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(13.5px, 1.1vw, 16px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.005em",
            marginBottom: "clamp(26px, 3.4vw, 48px)",
          }}
        >
          Abu Dhabi · February 2026 — the proof-of-concept year.
        </motion.div>

        {/* MAIN SPLIT: film LEFT · narrative RIGHT */}
        <div className="otsf-past-split" style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 1fr",
          gap: "clamp(28px, 4vw, 64px)",
          alignItems: "stretch",
          marginBottom: "clamp(28px, 3.6vw, 44px)",
        }}>
          {/* LEFT — cinematic film card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            style={{ position: "relative" }}
          >
            {/* Ambient magenta halo */}
            <div aria-hidden style={{
              position: "absolute",
              inset: -32,
              borderRadius: 28,
              background: `radial-gradient(ellipse 60% 70% at 50% 50%, ${OT_CRIMSON}26, transparent 70%)`,
              filter: "blur(52px)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
              <FilmCard film={film} />
            </div>
          </motion.div>

          {/* RIGHT — narrative block with pull-quote + paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.35, ease: EASE }}
            className="otsf-past-narrative-col"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "clamp(16px, 2vh, 26px)",
              position: "relative",
              paddingLeft: "clamp(18px, 2vw, 32px)",
            }}
          >
            {/* Vertical magenta accent */}
            <span aria-hidden style={{
              position: "absolute",
              left: 0,
              top: "8%",
              bottom: "8%",
              width: 1,
              background: `linear-gradient(180deg, transparent 0%, ${OT_CRIMSON}aa 20%, ${OT_CRIMSON} 50%, ${OT_CRIMSON}aa 80%, transparent 100%)`,
              boxShadow: `0 0 14px ${OT_CRIMSON}55`,
              pointerEvents: "none",
            }} />

            {/* Pull-quote */}
            <p style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(19px, 2vw, 28px)",
              lineHeight: 1.26,
              color: "rgba(255,255,255,0.96)",
              margin: 0,
              letterSpacing: "-0.01em",
              textWrap: "balance" as "balance",
              maxWidth: 540,
            }}>
              The first room in the region where ICS defenders set the{" "}
              <span className="otsf-accent-shimmer">agenda.</span>
            </p>

            {/* Narrative paragraph */}
            <p style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(14px, 1.1vw, 16px)",
              fontWeight: 300,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.62)",
              margin: 0,
              textWrap: "pretty" as "pretty",
              maxWidth: 560,
            }}>
              Sitting CISOs and OT security heads from{" "}
              <span style={{ color: "rgba(255,255,255,0.92)", fontWeight: 500 }}>Mubadala, ENOC, KNPC, DP World, Oman LNG, Yokogawa</span>, and the UAE Cyber Security Council on stage. Refinery CISOs, national-grid defenders, port authority heads, and water utility architects in the room.{" "}
              <span style={{ color: "rgba(255,255,255,0.92)", fontWeight: 500 }}>Claroty, Dragos, Nozomi Networks, Xage, OPSWAT</span>{" "}on the floor. Enough to prove the model — and the demand for an OT-only room.
            </p>
          </motion.div>
        </div>

        {/* Skeu+glass pill-badge stat rail */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="otsf-past-stats"
          style={{
            display: "flex",
            flexWrap: "nowrap",
            gap: "clamp(6px, 0.8vw, 10px)",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(18px, 2.2vw, 28px) 0 clamp(6px, 0.8vw, 10px)",
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55 + i * 0.08, ease: EASE }}
              className="otsf-past-stat-pill"
              style={{
                position: "relative",
                borderRadius: 999,
                padding: 1,
                background: `linear-gradient(125deg, ${OT_CRIMSON}55 0%, rgba(255,255,255,0.14) 28%, rgba(255,255,255,0.03) 55%, ${OT_CRIMSON_DIM}55 100%)`,
              }}
            >
              {/* Soft magenta halo beneath */}
              <span aria-hidden className="otsf-pill-halo" style={{
                position: "absolute",
                inset: -12,
                borderRadius: 999,
                background: `radial-gradient(ellipse 70% 120% at 50% 70%, ${OT_CRIMSON}28 0%, transparent 70%)`,
                filter: "blur(16px)",
                pointerEvents: "none",
                opacity: 0.9,
                zIndex: -1,
              }} />

              {/* Interior */}
              <div style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "baseline",
                gap: "clamp(8px, 0.8vw, 12px)",
                padding: "clamp(7px, 0.75vw, 10px) clamp(14px, 1.4vw, 20px)",
                borderRadius: 999,
                background: "linear-gradient(180deg, rgba(20,8,16,0.92) 0%, rgba(8,3,8,0.96) 100%)",
                overflow: "hidden",
              }}>
                {/* Inner top highlight hairline */}
                <span aria-hidden style={{
                  position: "absolute",
                  top: 0,
                  left: "18%",
                  right: "18%",
                  height: 1,
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)`,
                  pointerEvents: "none",
                }} />

                {/* Value — gradient display */}
                <span style={{
                  position: "relative",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(15px, 1.3vw, 20px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  backgroundImage: `linear-gradient(170deg, #ffffff 0%, #ffe9f3 40%, ${OT_CRIMSON} 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {s.val}
                </span>

                {/* Label */}
                <span style={{
                  position: "relative",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "clamp(9px, 0.72vw, 10.5px)",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.78)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>
                  {s.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .otsf-film-card:hover .otsf-film-img {
          filter: brightness(0.92) saturate(1) !important;
          transform: scale(1.04);
        }
        .otsf-film-card:hover .otsf-film-play {
          transform: translate(-50%, -50%) scale(1.08);
        }
        @media (max-width: 960px) {
          .otsf-past-split {
            grid-template-columns: 1fr !important;
            gap: clamp(22px, 3.4vh, 36px) !important;
          }
          .otsf-past-narrative-col {
            padding-left: clamp(14px, 2vw, 22px) !important;
          }
        }
        .otsf-past-stat-pill {
          transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), background 420ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .otsf-past-stat-pill:hover {
          transform: translateY(-3px);
          background: linear-gradient(125deg, ${OT_CRIMSON}88 0%, rgba(255,255,255,0.28) 28%, rgba(255,255,255,0.08) 55%, ${OT_CRIMSON_DIM}88 100%) !important;
        }
        .otsf-past-stat-pill:hover .otsf-pill-halo {
          opacity: 1 !important;
          background: radial-gradient(ellipse 80% 140% at 50% 70%, ${OT_CRIMSON}55 0%, transparent 70%) !important;
        }
        @media (max-width: 720px) {
          .otsf-past-stats {
            justify-content: center !important;
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
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${OT_CRIMSON}30, transparent)` }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <SectionMark num="05" label="The Arc" />

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
          <span className="otsf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "10s" }}>
            the corridor industrializes.
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
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 700, color: OT_CRIMSON, letterSpacing: "0.3em", textTransform: "uppercase" }}>
              Present · 2026
            </span>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${OT_CRIMSON}, transparent)`, opacity: 0.7 }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 1.4vw, 20px)", fontWeight: 400, fontStyle: "italic", color: "rgba(255,255,255,0.78)", letterSpacing: "-0.01em" }}>
              OT MENA · Johannesburg confirmed. Jubail &amp; Muscat on deck. UAE CIIP, NCA OTCC, South Africa NCIIP — one circuit.
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 600, color: FAINT, letterSpacing: "0.22em", textTransform: "uppercase", fontVariantNumeric: "tabular-nums" }}>
            02 Open <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 6px" }}>·</span> 02 Upcoming
          </span>
        </motion.div>

        {/* Open editions — full premium cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.28, ease: EASE }}
          className="otsf-arc-strip"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "clamp(14px, 1.4vw, 20px)",
            marginBottom: 26,
          }}
        >
          {EDITIONS_2026.filter((ed) => ed.status === "open").map((ed, i) => (
            <Link
              key={ed.city}
              href={ed.href}
              scroll
              className="otsf-arc-card"
              style={{
                position: "relative",
                display: "block",
                padding: 1.5,
                borderRadius: 16,
                background: `linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 28%, rgba(255,255,255,0.02) 62%, ${OT_CRIMSON}55 100%)`,
                boxShadow: `0 14px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02), 0 0 28px ${OT_CRIMSON}14`,
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
                  className="otsf-arc-card-img"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 40%",
                    filter: "saturate(0.55) contrast(1.15) brightness(0.38)",
                    transition: "transform 1s cubic-bezier(0.22,1,0.36,1), filter 0.6s ease",
                  }}
                />

                {/* Dark legibility gradient — deeper, bottom-heavy for magazine feel */}
                <span style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(5,7,11,0.82) 0%, rgba(5,7,11,0.45) 30%, rgba(5,7,11,0.65) 62%, rgba(5,7,11,0.98) 100%)",
                  pointerEvents: "none",
                }} />
                {/* Cyan brand tint */}
                <span style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(135deg, ${OT_CRIMSON}10 0%, transparent 40%, ${OT_CRIMSON}0a 100%)`,
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
                  background: `linear-gradient(90deg, transparent, ${OT_CRIMSON}, transparent)`,
                  opacity: 0.7,
                  pointerEvents: "none",
                }} />

                {/* Content overlay — magazine cover layout */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  padding: "clamp(18px, 1.8vw, 26px) clamp(20px, 2vw, 30px) clamp(20px, 2.2vw, 30px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}>
                  {/* TOP row — edition chip + OPEN pill */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 36,
                      height: 24,
                      padding: "0 10px",
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
                      letterSpacing: "0.2em",
                      fontVariantNumeric: "tabular-nums",
                    }}>
                      0{i + 1}
                    </span>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "5px 11px 5px 10px",
                      borderRadius: 999,
                      background: "rgba(5,8,12,0.55)",
                      border: `1px solid ${OT_CRIMSON}66`,
                      backdropFilter: "blur(12px) saturate(1.4)",
                      WebkitBackdropFilter: "blur(12px) saturate(1.4)",
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 22px ${OT_CRIMSON}32`,
                    }}>
                      <span className="otsf-arc-open-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 8px ${OT_CRIMSON}` }} />
                      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 9, fontWeight: 700, color: OT_CRIMSON, letterSpacing: "0.26em", textTransform: "uppercase" }}>
                        Open
                      </span>
                    </span>
                  </div>

                  {/* BOTTOM block — editorial cover treatment */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "clamp(10px, 1vw, 14px)" }}>
                    {/* Edition eyebrow — small caps label above city */}
                    <div style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "clamp(9.5px, 0.78vw, 11px)",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.62)",
                      letterSpacing: "0.36em",
                      textTransform: "uppercase",
                    }}>
                      {ed.edition}
                    </div>

                    {/* City name — refined display weight, restrained size */}
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 200,
                      fontSize: "clamp(26px, 3.2vw, 44px)",
                      color: "white",
                      letterSpacing: "-0.028em",
                      lineHeight: 0.98,
                      textShadow: `0 4px 22px rgba(0,0,0,0.55), 0 0 44px ${OT_CRIMSON}1c`,
                    }}>
                      {ed.city}
                    </div>

                    {/* Location subtitle — thin divider + country + venue */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
                      <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${OT_CRIMSON}, transparent)`, opacity: 0.85 }} />
                      <span style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: "clamp(11px, 0.9vw, 13px)",
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.72)",
                        letterSpacing: "0.02em",
                      }}>
                        OT Security First · {ed.country}
                      </span>
                    </div>

                    {/* Date + chrome arrow row */}
                    <div style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      gap: 12,
                      paddingTop: "clamp(8px, 0.9vw, 14px)",
                      marginTop: "clamp(2px, 0.4vw, 6px)",
                      borderTop: "1px solid rgba(255,255,255,0.09)",
                    }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{
                          fontFamily: "var(--font-dm-sans)",
                          fontSize: "clamp(8.5px, 0.7vw, 10px)",
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.48)",
                          letterSpacing: "0.32em",
                          textTransform: "uppercase",
                        }}>
                          When
                        </span>
                        <span style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "clamp(15px, 1.3vw, 20px)",
                          fontWeight: 300,
                          color: "white",
                          letterSpacing: "-0.015em",
                          lineHeight: 1,
                          fontVariantNumeric: "tabular-nums",
                        }}>
                          {ed.date}
                        </span>
                      </div>

                      {/* Chrome-dome arrow button */}
                      <span
                        className="otsf-arc-card-arrow"
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 38,
                          height: 38,
                          borderRadius: 999,
                          background: `linear-gradient(180deg, #EE87C5 0%, ${OT_CRIMSON} 55%, ${OT_CRIMSON_DIM} 100%)`,
                          color: INK,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.25), 0 6px 18px ${OT_CRIMSON}42, 0 0 24px ${OT_CRIMSON}1c`,
                          overflow: "hidden",
                          transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease",
                          flexShrink: 0,
                        }}
                      >
                        {/* Top specular hairline — chrome dome */}
                        <span style={{
                          position: "absolute",
                          top: 1,
                          left: "14%",
                          right: "14%",
                          height: "36%",
                          background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)",
                          borderRadius: "999px 999px 50% 50%",
                          pointerEvents: "none",
                          filter: "blur(0.3px)",
                        }} />
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ position: "relative", zIndex: 2 }}><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                    </div>
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
          <span style={{ width: 20, height: 1, background: `linear-gradient(90deg, ${OT_CRIMSON}55, transparent)`, opacity: 0.8 }} />
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
          className="otsf-arc-soon-badges"
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
                  className="otsf-arc-soon-badge"
                  style={{
                    position: "relative",
                    display: "inline-block",
                    padding: 1,
                    borderRadius: 999,
                    background: `linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 36%, rgba(255,255,255,0.02) 68%, ${OT_CRIMSON}48 100%)`,
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
                      background: OT_CRIMSON,
                      boxShadow: `0 0 8px ${OT_CRIMSON}88`,
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
                      color: OT_CRIMSON,
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
              Riyadh, Doha, Kuwait City — the next Gulf plants on the map.
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 600, color: FAINT, letterSpacing: "0.22em", textTransform: "uppercase", fontVariantNumeric: "tabular-nums" }}>
            2027 · Under review
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.46, ease: EASE }}
          className="otsf-arc-future-badges"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(10px, 1vw, 14px)",
            marginBottom: 22,
          }}
        >
          {[
            { city: "Kuwait City", country: "KW", role: "Gulf" },
            { city: "Doha", country: "QA", role: "Gulf" },
            { city: "Riyadh", country: "SA", role: "Gulf" },
          ].map((c, i) => (
            <motion.div
              key={c.city}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.52 + i * 0.05, ease: EASE }}
              className="otsf-arc-future-badge"
              style={{
                position: "relative",
                display: "inline-block",
                padding: 1,
                borderRadius: 999,
                background: `linear-gradient(140deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.02) 70%, ${OT_CRIMSON}40 100%)`,
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
                  className="otsf-arc-future-dot"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "transparent",
                    border: `1px solid ${OT_CRIMSON}`,
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
                  color: OT_CRIMSON,
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
              border: `1px dashed ${OT_CRIMSON}33`,
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
        .otsf-arc-card {
          will-change: transform;
        }
        .otsf-arc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 44px ${OT_CRIMSON}26 !important;
        }
        .otsf-arc-card:hover .otsf-arc-card-img {
          transform: scale(1.05);
          filter: saturate(1) contrast(1.1) brightness(0.74) !important;
        }
        .otsf-arc-card:hover .otsf-arc-card-arrow {
          transform: translateX(3px);
          background: ${OT_CRIMSON}32 !important;
          border-color: ${OT_CRIMSON}99 !important;
          color: ${OT_CRIMSON} !important;
        }
        .otsf-arc-future-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), 0 0 24px ${OT_CRIMSON}26 !important;
        }
        .otsf-arc-soon-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), 0 0 28px ${OT_CRIMSON}30 !important;
        }
        @keyframes otsf-open-pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${OT_CRIMSON}55; }
          50%      { box-shadow: 0 0 0 5px ${OT_CRIMSON}00; }
        }
        .otsf-arc-open-dot {
          animation: otsf-open-pulse 2.2s ease-in-out infinite;
        }
        @keyframes otsf-future-pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${OT_CRIMSON}55; opacity: 0.65; }
          50%      { box-shadow: 0 0 0 4px ${OT_CRIMSON}00; opacity: 1; }
        }
        .otsf-arc-future-dot {
          animation: otsf-future-pulse 2.4s ease-in-out infinite;
        }
        @media (max-width: 1020px) {
          .otsf-arc-strip {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .otsf-arc-strip {
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
        <SectionMark num="06" label="The Room" />

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
          <span className="otsf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "9s" }}>
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
          A room is only as good as the names on the badges. Every attendee is vetted against a published OT-security remit before an invite is issued — no title-inflators, no generalist IT consultants in disguise. Just the people who own the PLCs, the SCADA historians, the refinery control networks, and the audit response to NCA OTCC-1:2022 or UAE CIIP.
        </motion.p>

        {/* ─── ROLE MIX + INDUSTRIES split ───────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "clamp(28px, 3.4vw, 52px)", marginBottom: "clamp(56px, 6.5vw, 88px)" }} className="otsf-room-split">

          {/* Role mix — premium rail */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${OT_CRIMSON}, transparent)`, opacity: 0.75 }} />
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
                  className="otsf-room-role"
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
                      background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 18%, ${OT_CRIMSON}33 50%, rgba(255,255,255,0.05) 82%, transparent 100%)`,
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
                          background: `linear-gradient(90deg, ${OT_CRIMSON}aa, ${OT_CRIMSON})`,
                          boxShadow: `0 0 10px ${OT_CRIMSON}66`,
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
                    color: OT_CRIMSON,
                    letterSpacing: "-0.025em",
                    fontVariantNumeric: "tabular-nums",
                    minWidth: 70,
                    justifyContent: "flex-end",
                    textShadow: `0 0 18px ${OT_CRIMSON}26`,
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
                <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${OT_CRIMSON}, transparent)`, opacity: 0.75 }} />
                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10.5, fontWeight: 700, color: FAINT, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                  Industries represented
                </span>
              </div>
              <span style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 9.5,
                fontWeight: 700,
                color: OT_CRIMSON,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: 999,
                background: `${OT_CRIMSON}10`,
                border: `1px solid ${OT_CRIMSON}33`,
              }}>
                {INDUSTRIES.length} sectors
              </span>
            </div>

            <div className="otsf-room-industries" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {INDUSTRIES.map((ind, i) => (
                <motion.span
                  key={ind}
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.28 + i * 0.04, ease: EASE }}
                  className="otsf-room-industry"
                  style={{
                    position: "relative",
                    display: "inline-block",
                    padding: 1,
                    borderRadius: 999,
                    background: "linear-gradient(140deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.02) 70%, rgba(211,75,154,0.28) 100%)",
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
                      background: OT_CRIMSON,
                      boxShadow: `0 0 7px ${OT_CRIMSON}`,
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
                <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${OT_CRIMSON}, transparent)`, opacity: 0.75 }} />
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
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 8px ${OT_CRIMSON}` }} />
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

          <div className="otsf-speakers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(14px, 1.4vw, 20px)" }}>
            {SPEAKERS.map((sp, i) => (
              <motion.figure
                key={sp.name}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease: EASE }}
                className="otsf-speaker-card"
                style={{
                  margin: 0,
                  position: "relative",
                  padding: 1.5,
                  borderRadius: 16,
                  background: `linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 28%, rgba(255,255,255,0.02) 62%, ${OT_CRIMSON}55 100%)`,
                  boxShadow: `0 14px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02), 0 0 28px ${OT_CRIMSON}14`,
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
                    className="otsf-speaker-photo"
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
                  <span style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${OT_CRIMSON}10 0%, transparent 50%, ${OT_CRIMSON}08 100%)`, mixBlendMode: "overlay" as const, pointerEvents: "none" }} />
                  {/* Top cyan caustic */}
                  <span style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: `linear-gradient(90deg, transparent, ${OT_CRIMSON}, transparent)`, opacity: 0.7, pointerEvents: "none" }} />

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
                      <span style={{ width: 3, height: 3, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 5px ${OT_CRIMSON}`, flexShrink: 0 }} />
                      <span style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: OT_CRIMSON,
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
              href="/events/ot-security-first/jubail-2026#speakers"
              scroll
              className="otsf-speakers-cta"
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 22px 14px 26px",
                borderRadius: 999,
                background: `linear-gradient(180deg, #E86BB8 0%, ${OT_CRIMSON} 55%, #9E3374 100%)`,
                color: INK,
                fontFamily: "var(--font-outfit)",
                fontSize: 14.5,
                fontWeight: 600,
                letterSpacing: "0.005em",
                textDecoration: "none",
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.2), 0 10px 28px ${OT_CRIMSON}36, 0 0 0 1px rgba(255,255,255,0.05)`,
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
        .otsf-speaker-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 44px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px ${OT_CRIMSON}26 !important;
        }
        .otsf-speaker-card:hover .otsf-speaker-photo {
          filter: saturate(1.05) contrast(1.1) brightness(0.94) !important;
          transform: scale(1.04);
        }
        .otsf-room-industry:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), 0 0 22px ${OT_CRIMSON}26 !important;
        }
        .otsf-speakers-cta:hover {
          transform: translateY(-2px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.22), 0 16px 36px ${OT_CRIMSON}4e, 0 0 0 1px rgba(255,255,255,0.06) !important;
        }
        .otsf-speakers-cta:hover svg {
          transform: translateX(3px);
        }
        .otsf-room-role:hover .otsf-chrome-idx {
          border-color: ${OT_CRIMSON}55 !important;
        }
        @media (max-width: 960px) {
          .otsf-room-split {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
          .otsf-speakers-grid {
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
        <SectionMark num="07" label="How to Engage" />

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
          <span className="otsf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "10s" }}>
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

        <div className="otsf-engage-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(14px, 1.5vw, 22px)", alignItems: "stretch" }}>
          {ENGAGEMENT_TIERS.map((tier, i) => (
            <motion.article
              key={tier.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.15 + i * 0.1, ease: EASE }}
              className="otsf-engage-tier"
              style={{
                position: "relative",
                padding: 1.5,
                borderRadius: 16,
                background: `linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.02) 64%, ${OT_CRIMSON}50 100%)`,
                boxShadow: `0 14px 34px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02), 0 0 26px ${OT_CRIMSON}12`,
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
                  className="otsf-engage-bg"
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
                <span style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${OT_CRIMSON}14 0%, transparent 50%, ${OT_CRIMSON}0f 100%)`, mixBlendMode: "overlay" as const, pointerEvents: "none", zIndex: 0 }} />
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
                  background: `linear-gradient(90deg, transparent, ${OT_CRIMSON}, transparent)`,
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
                    background: `${OT_CRIMSON}14`,
                    border: `1px solid ${OT_CRIMSON}55`,
                    backdropFilter: "blur(10px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(10px) saturate(1.4)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 8px ${OT_CRIMSON}`, flexShrink: 0 }} />
                    <span style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: OT_CRIMSON,
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
                <span style={{ width: 36, height: 1, background: `linear-gradient(90deg, ${OT_CRIMSON}, transparent)`, opacity: 0.85 }} />

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
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 6px ${OT_CRIMSON}aa`, marginTop: 7, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA — glass pill with cyan arrow */}
                <a
                  href="#contact"
                  className="otsf-engage-cta"
                  onClick={(e) => handleTierCta(e, tier.tabKey)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "12px 14px 12px 16px",
                    borderRadius: 10,
                    background: "rgba(5,8,12,0.55)",
                    border: `1px solid ${OT_CRIMSON}40`,
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
                    className="otsf-engage-arrow"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      background: `${OT_CRIMSON}1e`,
                      border: `1px solid ${OT_CRIMSON}66`,
                      color: OT_CRIMSON,
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
        .otsf-engage-tier:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 44px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 38px ${OT_CRIMSON}26 !important;
        }
        .otsf-engage-tier:hover .otsf-engage-bg {
          transform: scale(1.05);
          filter: saturate(1) contrast(1.08) brightness(0.82) !important;
        }
        .otsf-engage-tier:hover .otsf-engage-cta {
          background: rgba(211,75,154,0.08) !important;
          border-color: ${OT_CRIMSON}88 !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 0 18px ${OT_CRIMSON}24 !important;
        }
        .otsf-engage-tier:hover .otsf-engage-arrow {
          transform: translateX(3px);
          background: ${OT_CRIMSON}30 !important;
        }
        @media (max-width: 900px) {
          .otsf-engage-grid {
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
        <SectionMark num="08" label="Proof" />

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
          <span className="otsf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "10s" }}>
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
          Unscripted voices from the room — refinery CISOs, grid defenders, ICS architects — captured on-site at the Abu Dhabi debut, minutes after the sessions wrapped. No edits, no talking points.
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
                <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${OT_CRIMSON}, transparent)`, opacity: 0.75 }} />
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
                OT Security First Abu Dhabi 2026 —{" "}
                <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>the room, the stage, the plant-floor conversation.</span>
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
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 8px ${OT_CRIMSON}` }} />
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

          <div className="otsf-gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(14px, 1.4vw, 20px)" }}>
            {GALLERY_PHOTOS.map((photo, i) => (
              <motion.figure
                key={photo.src}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: EASE }}
                className="otsf-gallery-card"
                style={{
                  margin: 0,
                  position: "relative",
                  padding: 1.5,
                  borderRadius: 14,
                  background: `linear-gradient(140deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 32%, rgba(255,255,255,0.02) 66%, ${OT_CRIMSON}44 100%)`,
                  boxShadow: `0 10px 26px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02), 0 0 22px ${OT_CRIMSON}0e`,
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
                    className="otsf-gallery-img"
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
                  <span style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${OT_CRIMSON}0d 0%, transparent 50%, ${OT_CRIMSON}08 100%)`, mixBlendMode: "overlay" as const, pointerEvents: "none" }} />
                  {/* Top cyan caustic */}
                  <span style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1, background: `linear-gradient(90deg, transparent, ${OT_CRIMSON}, transparent)`, opacity: 0.6, pointerEvents: "none" }} />

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
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 6px ${OT_CRIMSON}`, flexShrink: 0 }} />
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
                <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${OT_CRIMSON}, transparent)`, opacity: 0.75 }} />
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
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 8px ${OT_CRIMSON}` }} />
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

          <div className="otsf-shorts-showcase">
            {TESTIMONIAL_IDS.map((vid, i) => (
              <div
                key={vid}
                className={`otsf-shorts-slot otsf-shorts-slot-${i % 2 === 0 ? "tall" : "short"}${i === 2 ? " otsf-shorts-slot-hero" : ""}`}
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
              <span style={{ width: 30, height: 1, background: OT_CRIMSON }} />
              <span style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 11,
                fontWeight: 700,
                color: OT_CRIMSON,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}>
                Our Past Series
              </span>
              <span style={{ width: 30, height: 1, background: OT_CRIMSON }} />
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
              <span className="otsf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "10s" }}>
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
              Backed by the OT security vendors the room actually deploys — Claroty, Dragos, Nozomi Networks, Xage, OPSWAT, Tenable, Yokogawa, Sonicwall, Fortinet — plus regional integrators across Saudi Arabia, the UAE, and Africa.
            </p>
          </motion.div>

          {/* Dual marquee — breaks out of the 1280px wrapper to span the viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="otsf-marquee-fullwidth"
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
            <div className="otsf-marquee-track" style={{ marginBottom: 20 }}>
              <div className="otsf-marquee-inner otsf-marquee-scroll-left" style={{ animationDuration: "72s" }}>
                {[...SPONSOR_LOGOS.slice(0, 12), ...SPONSOR_LOGOS.slice(0, 12)].map((logo, i) => (
                  <div
                    key={`r1-${i}`}
                    className="otsf-marquee-cell"
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
                      className="otsf-marquee-img"
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
            <div className="otsf-marquee-track">
              <div className="otsf-marquee-inner otsf-marquee-scroll-right" style={{ animationDuration: "84s" }}>
                {[...SPONSOR_LOGOS.slice(12), ...SPONSOR_LOGOS.slice(12)].map((logo, i) => (
                  <div
                    key={`r2-${i}`}
                    className="otsf-marquee-cell"
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
                      className="otsf-marquee-img"
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
            <span style={{ width: 24, height: 1, background: `linear-gradient(90deg, transparent, ${OT_CRIMSON}55)` }} />
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
            <span style={{ width: 24, height: 1, background: `linear-gradient(270deg, transparent, ${OT_CRIMSON}55)` }} />
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        /* Sponsor marquee */
        .otsf-marquee-track {
          overflow: hidden;
          width: 100%;
        }
        .otsf-marquee-inner {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .otsf-marquee-inner:hover {
          animation-play-state: paused;
        }
        .otsf-marquee-scroll-left {
          animation: cfMarqueeScrollLeft linear infinite;
        }
        .otsf-marquee-scroll-right {
          animation: cfMarqueeScrollRight linear infinite;
        }
        .otsf-marquee-cell:hover .otsf-marquee-img {
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
        .otsf-short-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 36px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 30px ${OT_CRIMSON}30 !important;
        }
        .otsf-short-card:hover .otsf-short-img {
          transform: scale(1.05);
          filter: saturate(1.05) contrast(1.1) brightness(0.92) !important;
        }
        .otsf-short-card:hover .otsf-short-play {
          transform: translate(-50%, -50%) scale(1.08);
          background: rgba(211,75,154,0.18) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 0 28px ${OT_CRIMSON}66, 0 10px 24px rgba(0,0,0,0.6) !important;
        }
        .otsf-gallery-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 32px ${OT_CRIMSON}26 !important;
        }
        .otsf-gallery-card:hover .otsf-gallery-img {
          transform: scale(1.04);
          filter: saturate(1.05) contrast(1.08) brightness(0.94) !important;
        }
        @media (max-width: 900px) {
          .otsf-gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 540px) {
          .otsf-gallery-grid {
            grid-template-columns: 1fr !important;
          }
        }
        /* Staggered showcase — same pattern as VB MENA / Kenya */
        .otsf-shorts-showcase {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
        }
        .otsf-shorts-slot {
          flex-shrink: 0;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .otsf-shorts-slot:hover { transform: translateY(-6px); }
        .otsf-shorts-slot-tall { width: 185px; height: 315px; }
        .otsf-shorts-slot-short { width: 165px; height: 260px; }
        .otsf-shorts-slot-hero.otsf-shorts-slot-tall { width: 210px; height: 360px; }
        @media (max-width: 1100px) {
          .otsf-shorts-showcase {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            justify-content: flex-start;
            padding: 0 clamp(16px, 3vw, 32px) 8px;
            scrollbar-width: none;
          }
          .otsf-shorts-showcase::-webkit-scrollbar { display: none; }
        }
        @media (max-width: 900px) {
          .otsf-shorts-slot-tall { width: 170px; height: 285px; }
          .otsf-shorts-slot-short { width: 150px; height: 230px; }
          .otsf-shorts-slot-hero.otsf-shorts-slot-tall { width: 190px; height: 320px; }
        }
        @media (max-width: 560px) {
          .otsf-shorts-slot-tall { width: 150px; height: 255px; }
          .otsf-shorts-slot-short { width: 135px; height: 210px; }
          .otsf-shorts-slot-hero.otsf-shorts-slot-tall { width: 170px; height: 290px; }
          .otsf-marquee-cell {
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
      className="otsf-short-card"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: 1.5,
        borderRadius: 18,
        background: `linear-gradient(140deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 32%, rgba(255,255,255,0.02) 66%, ${OT_CRIMSON}4d 100%)`,
        boxShadow: `0 10px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02), 0 0 20px ${OT_CRIMSON}10`,
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
              className="otsf-short-img"
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
            <span style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${OT_CRIMSON}0f 0%, transparent 50%, ${OT_CRIMSON}0a 100%)`, mixBlendMode: "overlay" as const, pointerEvents: "none" }} />
            {/* Top cyan caustic */}
            <span style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${OT_CRIMSON}, transparent)`, opacity: 0.65, pointerEvents: "none" }} />

            {/* Liquid-glass play button */}
            <span
              className="otsf-short-play"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "rgba(5,8,12,0.55)",
                border: `1px solid ${OT_CRIMSON}66`,
                backdropFilter: "blur(12px) saturate(1.4)",
                WebkitBackdropFilter: "blur(12px) saturate(1.4)",
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.16), 0 0 18px ${OT_CRIMSON}44, 0 8px 20px rgba(0,0,0,0.55)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: OT_CRIMSON,
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
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: OT_CRIMSON, boxShadow: `0 0 5px ${OT_CRIMSON}`, flexShrink: 0 }} />
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
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${OT_CRIMSON}10 0%, transparent 60%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 22 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 18 }}>
            <span style={{ width: 40, height: 1, background: OT_CRIMSON }} />
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 700, color: OT_CRIMSON, letterSpacing: "0.35em", textTransform: "uppercase" }}>
              09 · Join
            </span>
            <span style={{ width: 40, height: 1, background: OT_CRIMSON }} />
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
            Ready to secure the{" "}
            <span className="otsf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "10s" }}>
              plant floor?
            </span>
          </h2>

          <p style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1vw, 16px)",
            fontWeight: 300,
            lineHeight: 1.6,
            color: MUTE,
            margin: "14px auto 0",
            maxWidth: 620,
          }}>
            Tell us which edition — Jubail, Johannesburg, Muscat, Virtual MENA, or the whole 2026 circuit. Sponsorship, invite, or speaker pitch. Our team replies within two working days with a tailored proposal aligned to your OT security, compliance, or commercial mandate.
          </p>
        </motion.div>

        {/* Inquiry form — themed to cyan by overriding the shared CSS vars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="otsf-join-form-wrap"
          style={{
            ["--orange" as string]: OT_CRIMSON,
            ["--orange-bright" as string]: "#E86BB8",
            ["--orange-glow" as string]: "rgba(211,75,154,0.4)",
            ["--black" as string]: "transparent",
            marginBottom: 24,
          } as React.CSSProperties}
        >
          <InquiryForm hideLabel eventName="OT Security First" />
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
            className="otsf-contact-pill"
            style={{
              position: "relative",
              display: "inline-block",
              padding: 1,
              borderRadius: 999,
              background: `linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 36%, rgba(255,255,255,0.02) 68%, ${OT_CRIMSON}48 100%)`,
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
                background: `${OT_CRIMSON}1a`,
                border: `1px solid ${OT_CRIMSON}4d`,
                color: OT_CRIMSON,
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
            className="otsf-contact-pill"
            style={{
              position: "relative",
              display: "inline-block",
              padding: 1,
              borderRadius: 999,
              background: `linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.02) 72%, ${OT_CRIMSON}3a 100%)`,
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
                background: `${OT_CRIMSON}1a`,
                border: `1px solid ${OT_CRIMSON}4d`,
                color: OT_CRIMSON,
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
        .otsf-join-form-wrap > section#get-involved {
          padding: 0 !important;
        }
        .otsf-join-form-wrap > section#get-involved > div {
          padding-left: 0 !important;
          padding-right: 0 !important;
          max-width: none !important;
        }
        .otsf-join-form-wrap > section#get-involved > div > div:first-child {
          margin-bottom: 22px !important;
        }
        .otsf-join-form-wrap .inquiry-split {
          grid-template-columns: 1fr 1.35fr !important;
          gap: clamp(28px, 3.2vw, 52px) !important;
        }
        a.otsf-contact-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03), 0 0 26px ${OT_CRIMSON}30 !important;
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
        <SectionMark num="10" label="Our Other Series" />

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(14px, 2.1vw, 32px)",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "white",
            margin: "0 0 14px",
            whiteSpace: "nowrap",
          }}
        >
          OT Security First is one of four.{" "}
          <span className="otsf-accent-shimmer" style={{ fontStyle: "italic", fontWeight: 400, animationDuration: "10s" }}>
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
          Four invite-only series, one curation standard. Cybersecurity for CISOs, OT &amp; ICS for industrial defenders, AI &amp; data for the CDO seat, operational excellence for the COO — same practitioner-led format, different mandates.
        </motion.p>

        <div className="otsf-xsell-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(14px, 1.4vw, 20px)", alignItems: "stretch" }}>
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
                  className="otsf-xsell-card"
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
                    className="otsf-xsell-glass"
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
                      className="otsf-xsell-bloom"
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
                        className="otsf-xsell-dot"
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
                        className="otsf-xsell-cta"
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
                          className="otsf-xsell-arrow"
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
        .otsf-xsell-card:hover {
          transform: translateY(-5px);
        }
        .otsf-xsell-card:hover .otsf-xsell-arrow {
          transform: translateX(3px);
        }
        .otsf-xsell-card:hover .otsf-xsell-bloom {
          transform: scale(1.25);
          opacity: 1 !important;
        }
        @media (max-width: 900px) {
          .otsf-xsell-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          .otsf-xsell-grid {
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
export default function OTSecurityFirstPage() {
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
