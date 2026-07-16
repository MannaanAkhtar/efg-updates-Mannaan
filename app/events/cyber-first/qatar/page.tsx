"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useInView, AnimatePresence, MotionConfig } from "framer-motion";
import Link from "next/link";
import { Footer, InquiryForm } from "@/components/sections";
import EventNavigation from "@/components/ui/EventNavigation";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

// ─── Brand tokens — Cyber First cyan + Qatar maroon accent ──────────────────
const C = "#01BBF5";              // Cyber First cyan
const C_BRIGHT = "#4DD4FF";       // Bright cyan
const C_DEEP = "#0066A8";         // Deep cyan for shadows
const QATAR = "#8A1538";          // Qatar flag maroon
const QATAR_BRIGHT = "#B83A5F";   // Bright maroon highlight
const GOLD = "#C4A34A";           // Awards / recognition gold
const BG_BASE = "#02050E";        // Deep base
const BG_DEEP = "#040818";        // Deeper navy
const BG_ELEV = "#0A1024";        // Elevated panel base

const EASE = [0.16, 1, 0.3, 1] as const;

const HERO_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/assets/cyberQatar.png";
const EVENT_DATE_ISO = "2026-11-10T09:00:00+03:00";

// ─── Post-Event Reports data ────────────────────────────────────────────────
type ReportEntry = {
  edition: string;
  year: string;
  title: string;
  url: string;
  filename: string;
};

const POST_EVENT_REPORTS: ReportEntry[] = [
  {
    edition: "Kuwait",
    year: "2025",
    title: "Cyber First Kuwait",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/PER+-+Cyber+First+Kuwait+2025+Edition.pdf",
    filename: "Cyber-First-Kuwait-2025-Report.pdf",
  },
  {
    edition: "Qatar",
    year: "2025",
    title: "Cyber First Qatar",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/PER+-+Cyber+First+Qatar+2025+Edition.pdf",
    filename: "Cyber-First-Qatar-2025-Report.pdf",
  },
  {
    edition: "UAE",
    year: "2026",
    title: "Cyber First UAE",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/Post+Event+Report+Cyber+First+UAE_compressed+(1).pdf",
    filename: "Cyber-First-UAE-2026-Report.pdf",
  },
];

// ─── Past Cyber First highlight videos ─────────────────────────────────────
const CFQ_HIGHLIGHTS: { id: string; edition: string; location: string }[] = [
  { id: "0d_2Itsg6ec", edition: "3rd Edition", location: "Qatar" },
  { id: "AsrScRfgLpA", edition: "Cyber First", location: "UAE" },
  { id: "wcEeU0UEl0o", edition: "Cyber First", location: "Kuwait" },
];

// ─── Gallery — past Cyber First atmosphere photos ──────────────────────────
const CFQ_GALLERY: { src: string; alt: string; label?: string }[] = [
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/cyberqatar/ARU00511.jpg", alt: "Cyber First UAE — speakers on the main stage", label: "Past Edition · On Stage" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/cyberqatar/ARU00574.jpg", alt: "Cyber First Qatar — panel discussion", label: "Panel" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/cyberqatar/ARU00722.jpg", alt: "Cyber First Qatar — networking roundtable", label: "Networking" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/cyberqatar/ARU00738.jpg", alt: "Cyber First Qatar — partner exhibition floor", label: "Exhibition" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/cyberqatar/ARU00500.jpg", alt: "Cyber First Qatar — panel speakers on the main stage", label: "The Room" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/cyberqatar/ARU01180.jpg", alt: "Cyber First Qatar — awards ceremony on stage", label: "Awards" },
];

// ─── Past attendee testimonials (CF series shorts) ──────────────────────────
const CFQ_SHORTS: { id: string; title: string }[] = [
  { id: "jPQFjwuohfI", title: "Cyber First attendee testimonial" },
  { id: "c8sPwIo4Pis", title: "Cyber First attendee testimonial" },
  { id: "2LoeDNqsem0", title: "Cyber First attendee testimonial" },
  { id: "8C61dof_f3s", title: "Cyber First attendee testimonial" },
  { id: "2-KXhfSeBdQ", title: "Cyber First attendee testimonial" },
  { id: "2IwKmGEfOIo", title: "Cyber First attendee testimonial" },
];

// ─── At-a-glance highlights (from PDF) ──────────────────────────────────────
const HIGHLIGHTS: { value: string; suffix?: string; label: string }[] = [
  { value: "1",   suffix: "Day", label: "Of strategic insights & networking" },
  { value: "250", suffix: "+",   label: "Senior cybersecurity & technology leaders" },
  { value: "30",  suffix: "+",   label: "Industry experts & visionary speakers" },
  { value: "4",   suffix: "",    label: "High-level leadership panels" },
  { value: "20",  suffix: "+",   label: "Industry sectors represented" },
  { value: "12",  suffix: "+",   label: "Hours of curated conversation" },
];

// ─── Why Qatar? Why Now? — 6 reasons (from PDF) ─────────────────────────────
const WHY_QATAR: { tag: string; tone: "cyan" | "maroon" | "gold"; headline: string; body: string }[] = [
  { tag: "Vision",       tone: "cyan",   headline: "Aligned with Qatar National Vision 2030", body: "Supporting the ambitions of QNV 2030 through secure digital transformation across government, enterprise, and critical infrastructure." },
  { tag: "Investment",   tone: "gold",   headline: "Investments accelerating across the digital stack", body: "AI, cloud, digital government, and smart infrastructure programs are scaling rapidly and reshaping the threat surface." },
  { tag: "Resilience",   tone: "maroon", headline: "Cyber resilience as a national imperative", body: "Strengthening protection of critical national assets and essential services against a rapidly evolving adversary landscape." },
  { tag: "Risk",         tone: "maroon", headline: "AI threats and IT/OT convergence", body: "Addressing the growing challenges of AI-powered cyber threats and converged industrial systems that legacy controls were not built for." },
  { tag: "Trust",        tone: "cyan",   headline: "Regulatory frameworks and digital trust", body: "Advancing data protection, digital trust, and compliance posture across regulated sectors." },
  { tag: "Partnership",  tone: "gold",   headline: "Public-private collaboration", body: "Fostering stronger partnership between government, industry, and technology partners to defend the Kingdom's connected economy." },
];

// ─── Key themes — 8 (from PDF) ──────────────────────────────────────────────
const KEY_THEMES: { num: string; title: string; tag: string }[] = [
  { num: "01", title: "National Cyber Resilience & Digital Sovereignty",        tag: "Sovereign scale" },
  { num: "02", title: "AI Security, Governance & Responsible AI",                tag: "Generative · Agentic" },
  { num: "03", title: "Critical Infrastructure, IT/OT & Industrial Security",    tag: "Energy · Utilities · Industrial" },
  { num: "04", title: "Cloud Security, Data Protection & Digital Trust",         tag: "Multi-cloud trust" },
  { num: "05", title: "Cyber Risk, Compliance & Regulatory Readiness",           tag: "Board to BAU" },
  { num: "06", title: "Cybersecurity Automation & AI-Driven SecOps",             tag: "AI-led SOC" },
  { num: "07", title: "Zero Trust & Identity-Centric Security",                  tag: "Identity-first perimeter" },
  { num: "08", title: "Threat Intelligence & Incident Response",                 tag: "Shared intel · Playbooks" },
];

// ─── Qatar cybersecurity landscape — 6 key facts (from PDF) ─────────────────
const LANDSCAPE_FACTS: { stat: string; unit: string; label: string; tone: "cyan" | "maroon" | "gold" }[] = [
  { stat: "USD 662M+", unit: "2025",   label: "Estimated size of Qatar's cybersecurity market.",             tone: "cyan" },
  { stat: "USD 1.38B+", unit: "by 2034", label: "Projected market value, reflecting sustained investment.",    tone: "cyan" },
  { stat: "8.5%",       unit: "CAGR",    label: "Expected annual growth of Qatar's cybersecurity market.",     tone: "maroon" },
  { stat: "QAR 71.5B",  unit: "by 2030", label: "Qatar's projected digital transformation market value.",      tone: "cyan" },
  { stat: "USD 10T+",   unit: "annual",  label: "Estimated global cost of cybercrime, raising urgency.",       tone: "maroon" },
  { stat: "80%+",       unit: "of breaches", label: "Involve ransomware, phishing, identity or credential theft.", tone: "gold" },
];

// ─── Who should attend — 12 roles (from PDF) ────────────────────────────────
const WHO_ATTENDS: { role: string; icon: string }[] = [
  { role: "CISOs & Chief Information Security Officers",                       icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { role: "CIOs, CTOs & Chief Digital Officers",                                icon: "M3 4h18v12H3zM7 20h10M9 16v4M15 16v4" },
  { role: "Heads of Cybersecurity & Information Security",                      icon: "M5 11V7a5 5 0 1 1 10 0v4M4 11h12v10H4z" },
  { role: "SOC Leaders, Threat Intelligence & Incident Response",               icon: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 7v5l3 2" },
  { role: "Cloud, Network & Infrastructure Security Professionals",             icon: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" },
  { role: "Risk, Governance, Compliance & Data Protection Officers",            icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" },
  { role: "Government Cybersecurity Leaders & Regulatory Authorities",          icon: "M3 21h18M3 10h18M3 7l9-4 9 4M5 10v11m6-11v11m4-11v11m4-11v11" },
  { role: "OT/ICS & Critical Infrastructure Security Professionals",            icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { role: "AI, Cloud & Digital Transformation Leaders",                         icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
  { role: "Banking, FinTech & Telecommunications Security Heads",               icon: "M3 21h18M5 21V10l7-6 7 6v11M9 14v3M15 14v3" },
  { role: "Technology Providers, Cybersecurity Vendors & MSSPs",                icon: "M4 4h16v6H4zM4 14h16v6H4zM7 7h.01M7 17h.01" },
  { role: "Industry Advisors, Consultants & Academic Researchers",              icon: "M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" },
];

// ─── Industry sectors — 11 (from PDF) ───────────────────────────────────────
const SECTORS: { name: string; short: string; icon: string }[] = [
  { name: "Government & Public Sector",                  short: "Government",      icon: "M3 21h18M3 10h18M3 7l9-4 9 4M5 10v11m4-11v11m6-11v11m4-11v11" },
  { name: "Banking, Financial Services & FinTech",       short: "Banking & FinTech", icon: "M3 21h18M5 21V10l7-6 7 6v11M9 14v3M15 14v3" },
  { name: "Telecommunications & Digital Infrastructure", short: "Telecom",         icon: "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" },
  { name: "Oil, Gas, Energy & LNG",                      short: "Energy",          icon: "M12 2c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 1 .5 2 1 2 0-2 1-4 1-7z" },
  { name: "Utilities & Critical Infrastructure",         short: "Utilities",       icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
  { name: "Cloud, AI & Technology Providers",            short: "Cloud & AI",      icon: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10zM12 13v3M10 14.5h4" },
  { name: "Healthcare & Life Sciences",                  short: "Healthcare",      icon: "M3 12h3l2-6 4 12 2-6h7" },
  { name: "Manufacturing & Industrial (OT/ICS)",         short: "Manufacturing",   icon: "M2 20h20V9l-6 4V9l-6 4V5H2v15zM6 16h2M11 16h2M16 16h2" },
  { name: "Transportation, Aviation & Smart Mobility",   short: "Aviation",        icon: "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" },
  { name: "Smart Cities & Digital Government",           short: "Smart Cities",    icon: "M3 21V8l5-4 5 4v13M13 21V11l4-3 4 3v10M3 21h18M7 12h.01M7 16h.01M17 14h.01M17 18h.01" },
  { name: "Education & Research Institutions",           short: "Education",       icon: "M22 10L12 5 2 10l10 5z M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" },
];

// ─── Past Series Sponsors & Partners — Cyber First series logos ────────────
const CFQ_S3_LOGOS = "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo";

const CFQ_MARQUEE_ROW_1: { name: string; logo: string }[] = [
  { name: "Palo Alto Networks", logo: `${CFQ_S3_LOGOS}/paloalto.png` },
  { name: "SentinelOne",        logo: `${CFQ_S3_LOGOS}/sentinelone.png` },
  { name: "Google Cloud",       logo: `${CFQ_S3_LOGOS}/Google-Cloud-Security.png` },
  { name: "Kaspersky",          logo: `${CFQ_S3_LOGOS}/kaspersky.png` },
  { name: "Akamai",             logo: `${CFQ_S3_LOGOS}/Akamai.png` },
  { name: "Secureworks",        logo: `${CFQ_S3_LOGOS}/secureworks.png` },
  { name: "Fortinet",           logo: `${CFQ_S3_LOGOS}/fortinet.png` },
  { name: "OPSWAT",             logo: `${CFQ_S3_LOGOS}/OPSWAT-logo.png` },
];

const CFQ_MARQUEE_ROW_2: { name: string; logo: string }[] = [
  { name: "Anomali",          logo: `${CFQ_S3_LOGOS}/Anomali.png` },
  { name: "Pentera",          logo: `${CFQ_S3_LOGOS}/PENTERA.png` },
  { name: "HWG",              logo: `${CFQ_S3_LOGOS}/hwg-here-we-go.png` },
  { name: "AmiViz",           logo: `${CFQ_S3_LOGOS}/AmiViz.png` },
  { name: "Paramount",        logo: `${CFQ_S3_LOGOS}/Paramount.png` },
  { name: "Kron Technologies", logo: `${CFQ_S3_LOGOS}/kron-technologies.png` },
  { name: "Appknox",          logo: `${CFQ_S3_LOGOS}/appknox.png` },
  { name: "Filigran",         logo: `${CFQ_S3_LOGOS}/filigran.png` },
  { name: "Corelight",        logo: `${CFQ_S3_LOGOS}/corelight.png` },
  { name: "ManageEngine",     logo: `${CFQ_S3_LOGOS}/ManageEngine.png` },
  { name: "StarLink",         logo: `${CFQ_S3_LOGOS}/StarLink+-+White+Logo.png` },
  { name: "Bureau Veritas",   logo: `${CFQ_S3_LOGOS}/bureau-veritas.png` },
];

// ─── Advisors — 3 named individuals (from PDF) ──────────────────────────────
const ADVISORS: { name: string; title: string; org: string; photo?: string; linkedin?: string }[] = [
  { name: "Nicholas Jones", title: "EMEIA Cybersecurity Oil & Gas Leader", org: "EY",              photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Nicholas_Jones.png", linkedin: "https://www.linkedin.com/in/nicholas-jones-2464151b/" },
  { name: "Harris Ismail",  title: "Head of Identity & Access Management", org: "Commercial Bank" },
  { name: "Feroz Khan",     title: "Head of IT Security",                   org: "TotalEnergies" },
];

// ─── Speakers — named individuals ───────────────────────────────────────────
const CFQ_SPEAKERS: { name: string; title: string; org: string; photo?: string; linkedin?: string }[] = [
  { name: "Hans W. Thomasz", title: "CISO", org: "Qatar Development Bank",  photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Hans_w_Thomasz.png" },
  { name: "Anfal Shaikh",    title: "CISO", org: "Qatar Islamic Insurance", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Anfal_shaikh.png" },
  { name: "Tarek Terk",      title: "Cybersecurity Leader", org: "Confidential", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Tarek+Terk.png" },
];

// ─── Agenda — 17 rows (from PDF) ────────────────────────────────────────────
type AgendaRow = {
  start: string;
  end: string;
  segment: string;
  type: "logistics" | "welcome" | "keynote" | "panel" | "sponsor" | "break" | "fireside" | "awards" | "closing";
  bullets?: string[];
};

const AGENDA: AgendaRow[] = [
  { start: "08:00", end: "09:00", segment: "Registration, Networking & Refreshments", type: "logistics" },
  { start: "09:00", end: "09:10", segment: "Welcome Address & Opening Remarks", type: "welcome" },
  { start: "09:10", end: "09:20", segment: "Opening Keynote Address", type: "keynote" },
  {
    start: "09:20", end: "10:00",
    segment: "Panel 1 · Securing Qatar's Digital Future Through Cyber Resilience, Innovation & Trust",
    type: "panel",
    bullets: [
      "Strengthening national cyber resilience in an AI-powered economy",
      "Accelerating public-private collaboration for a secure digital future",
      "Balancing innovation, governance, and cyber risk management",
      "Addressing emerging threats across critical infrastructure and digital services",
      "Building a cyber-aware culture and strengthening digital trust",
    ],
  },
  { start: "10:00", end: "10:10", segment: "Technology Partner Presentation · Sponsor Session 1", type: "sponsor" },
  { start: "10:10", end: "10:20", segment: "Technology Partner Presentation · Sponsor Session 2", type: "sponsor" },
  { start: "10:20", end: "11:00", segment: "Networking Coffee Break & Exhibition Tour", type: "break" },
  {
    start: "11:00", end: "11:40",
    segment: "Panel 2 · AI, Automation & Cyber Defense — Managing Opportunity and Risk",
    type: "panel",
    bullets: [
      "AI-powered threat detection and response",
      "Securing Generative AI and Agentic AI",
      "Responsible AI governance and risk management",
      "AI-driven Security Operations Centers (SOC)",
      "Preparing for next-generation AI threats",
    ],
  },
  { start: "11:40", end: "11:50", segment: "Technology Partner Presentation · Sponsor Session 3", type: "sponsor" },
  { start: "11:50", end: "12:00", segment: "Technology Partner Presentation · Sponsor Session 4", type: "sponsor" },
  {
    start: "12:00", end: "12:40",
    segment: "Panel 3 · The Future of Security Operations — AI, SOC Transformation & Threat Intelligence",
    type: "panel",
    bullets: [
      "AI-powered Security Operations (SOC)",
      "SOC transformation & automation",
      "XDR, MDR & threat intelligence",
      "Threat detection & rapid response",
      "Reducing alert fatigue with AI",
      "Building cyber resilience through intelligent operations",
    ],
  },
  { start: "12:40", end: "12:50", segment: "Technology Partner Presentation · Sponsor Session 5", type: "sponsor" },
  { start: "12:50", end: "13:00", segment: "Technology Partner Presentation · Sponsor Session 6", type: "sponsor" },
  { start: "13:00", end: "13:30", segment: "Networking & Refreshment Break", type: "break" },
  {
    start: "13:30", end: "13:45",
    segment: "Fireside Chat · Data Protection & Digital Trust in an AI-Driven Economy",
    type: "fireside",
    bullets: [
      "Balancing innovation with data privacy",
      "Building digital trust through effective data governance",
      "Securing sensitive data across cloud and AI environments",
      "Preparing for evolving data protection and regulatory requirements",
    ],
  },
  {
    start: "13:45", end: "14:25",
    segment: "Panel 4 · From Compliance to Cyber Resilience — Building Trust in a Connected Economy",
    type: "panel",
    bullets: [
      "Cyber governance and regulatory compliance",
      "Zero Trust architecture",
      "Cloud security and data protection",
      "Resilience, recovery and crisis management",
    ],
  },
  { start: "14:25", end: "14:45", segment: "Cyber First Qatar Awards & Recognition Ceremony · Raffle Draw", type: "awards" },
  { start: "14:45", end: "14:50", segment: "Closing Remarks", type: "closing" },
  { start: "14:50", end: "onwards", segment: "Networking Lunch", type: "logistics" },
];

// ───────────────────────────────────────────────────────────────────────────
// Hooks & shared helpers
// ───────────────────────────────────────────────────────────────────────────

function useCountdown(targetIso: string) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date(targetIso).getTime();
    const tick = () => {
      const diff = target - Date.now();
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
  }, [targetIso]);
  return t;
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1600;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Eyebrow({ inView, label, tone = "cyan" }: { inView: boolean; label: string; tone?: "cyan" | "maroon" | "gold" }) {
  const color = tone === "maroon" ? QATAR_BRIGHT : tone === "gold" ? GOLD : C_BRIGHT;
  const rail = tone === "maroon" ? QATAR : tone === "gold" ? GOLD : C;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}
    >
      <span style={{ width: 26, height: 1, background: rail, boxShadow: `0 0 8px ${rail}66` }} />
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "4.5px",
          textTransform: "uppercase",
          color,
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.14) 0%, transparent 70%)" }} />
    </motion.div>
  );
}

// Subtle background dot pattern
function BgDots({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(rgba(255,255,255,${opacity}) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        backgroundPosition: "center",
        maskImage: "radial-gradient(ellipse 60% 70% at 50% 50%, black 0%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 50%, black 0%, transparent 100%)",
        pointerEvents: "none",
      }}
    />
  );
}

// Qatar flag-inspired 9-point serration — a subtle divider motif
function QatarSerration({ color = QATAR, width = 80 }: { color?: string; width?: number }) {
  return (
    <svg width={width} height={10} viewBox="0 0 80 10" aria-hidden style={{ flexShrink: 0 }}>
      <path
        d="M0 5 L8 0 L16 5 L24 0 L32 5 L40 0 L48 5 L56 0 L64 5 L72 0 L80 5"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// HERO
// ───────────────────────────────────────────────────────────────────────────
function Hero() {
  const cd = useCountdown(EVENT_DATE_ISO);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="overview"
      style={{
        position: "relative",
        height: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: BG_DEEP,
      }}
    >
      {/* Hero background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt="Cyber First Qatar 2026 — Building cyber resilience for Qatar's AI-powered digital economy in Doha"
        width={1920}
        height={1080}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.8,
          zIndex: 0,
        }}
      />

      {/* Atmospheric overlays */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% 110%, ${BG_DEEP} 0%, transparent 70%),
            radial-gradient(ellipse 80% 40% at 50% -10%, ${BG_DEEP} 0%, transparent 70%),
            linear-gradient(180deg, rgba(2,5,14,0.22) 0%, rgba(2,5,14,0.12) 50%, rgba(2,5,14,0.75) 100%)
          `,
          zIndex: 1,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 45% 35% at 15% 25%, ${C}1a 0%, transparent 60%),
            radial-gradient(ellipse 45% 35% at 85% 75%, ${QATAR}18 0%, transparent 60%)
          `,
          zIndex: 1,
        }}
      />
      <BgDots opacity={0.04} />

      {/* Edition chip — premium skeuomorphic badge anchored top-right */}
      <motion.div
        className="cfq-hero-chip"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
        style={{
          position: "absolute",
          top: "clamp(130px, 17vh, 200px)",
          right: "clamp(18px, 5vw, 64px)",
          zIndex: 4,
        }}
      >
        {/* Ambient outer halo — cyan + maroon */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: -18,
            borderRadius: 999,
            background: `radial-gradient(ellipse 70% 65% at 25% 30%, ${C}33 0%, transparent 65%), radial-gradient(ellipse 60% 60% at 75% 75%, ${QATAR}28 0%, transparent 70%)`,
            filter: "blur(18px)",
            opacity: 0.85,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        {/* Outer bezel — gradient ring (cyan → cream → maroon) */}
        <div
          style={{
            position: "relative",
            padding: "1.5px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${C_BRIGHT} 0%, ${C}aa 22%, rgba(255,235,200,0.55) 50%, ${QATAR}aa 78%, ${QATAR_BRIGHT} 100%)`,
            boxShadow: `0 14px 36px rgba(0,0,0,0.55), 0 0 28px ${C}33, 0 0 50px ${QATAR}22, inset 0 1px 0 rgba(255,255,255,0.18)`,
          }}
        >
          {/* Inner recessed panel */}
          <div
            style={{
              position: "relative",
              borderRadius: 999,
              padding: "10px 20px",
              background: `linear-gradient(180deg, rgba(6,10,22,0.95) 0%, rgba(2,5,14,0.98) 100%)`,
              boxShadow: `inset 0 2px 6px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.04)`,
              display: "inline-flex",
              alignItems: "center",
              gap: 11,
              overflow: "hidden",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {/* Top glass reflection sweep */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: "12%",
                right: "12%",
                height: 1,
                background: `linear-gradient(90deg, transparent, ${C_BRIGHT}dd, ${QATAR_BRIGHT}aa, transparent)`,
                boxShadow: `0 0 10px ${C}88`,
                pointerEvents: "none",
              }}
            />

            {/* Left serration */}
            <QatarSerration width={20} color={QATAR_BRIGHT} />

            {/* Status pulse dot */}
            <span className="cfq-chip-pulse" style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 8, height: 8 }}>
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: C_BRIGHT,
                  boxShadow: `0 0 8px ${C_BRIGHT}, 0 0 14px ${C}88`,
                }}
              />
              <span
                aria-hidden
                className="cfq-chip-pulse-ring"
                style={{
                  position: "absolute",
                  inset: -2,
                  borderRadius: "50%",
                  border: `1px solid ${C_BRIGHT}`,
                  opacity: 0,
                }}
              />
            </span>

            {/* "CYBER FIRST" — white display weight */}
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: "3.5px",
                textTransform: "uppercase",
                color: "white",
              }}
            >
              Cyber First
            </span>

            {/* Hairline separator */}
            <span
              aria-hidden
              style={{
                width: 1,
                height: 12,
                background: `linear-gradient(180deg, transparent, ${QATAR_BRIGHT}aa, transparent)`,
              }}
            />

            {/* "3RD EDITION QATAR" — cyan */}
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "3.5px",
                textTransform: "uppercase",
                color: C_BRIGHT,
              }}
            >
              8th Edition Qatar
            </span>

            {/* Right serration */}
            <QatarSerration width={20} color={QATAR_BRIGHT} />
          </div>
        </div>
      </motion.div>

      {/* Hero content — left-anchored editorial, right side reveals Doha skyline */}
      <div
        className="cfq-hero-content"
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: 1320,
          width: "100%",
          padding: "clamp(84px, 10vh, 130px) clamp(18px, 5vw, 64px) clamp(32px, 4.5vh, 60px)",
        }}
      >

        <div className="cfq-hero-left" style={{ maxWidth: 680 }}>
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4.6vw, 68px)",
              letterSpacing: "-2px",
              lineHeight: 1.05,
              color: "white",
              margin: "0 0 18px",
              maxWidth: 680,
              overflowWrap: "break-word",
            }}
          >
            Building cyber resilience for{" "}
            <span
              style={{
                color: C_BRIGHT,
                fontStyle: "italic",
                fontWeight: 400,
                paddingRight: "0.12em",
              }}
            >
              Qatar's AI-powered digital economy.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(13.5px, 1.2vw, 17px)",
              fontWeight: 500,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.96)",
              margin: "0 0 26px",
              maxWidth: 560,
              textShadow: "0 2px 14px rgba(2,5,14,0.7), 0 1px 4px rgba(2,5,14,0.55)",
            }}
          >
            Convening cybersecurity leaders, government decision-makers, critical infrastructure operators
            and technology innovators to shape Qatar's secure digital future.
          </motion.p>

          {/* Date + Location pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}
          >
            {[
              { label: "10 November 2026", border: C },
              { label: "Doha · Qatar",     border: QATAR_BRIGHT },
            ].map((p) => (
              <span
                key={p.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 18px",
                  borderRadius: 999,
                  background: "rgba(4,7,12,0.55)",
                  border: `1px solid ${p.border}55`,
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12.5,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: "white",
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.border, boxShadow: `0 0 10px ${p.border}` }} />
                {p.label}
              </span>
            ))}
          </motion.div>

          {/* Countdown — compact horizontal strip */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.52, ease: EASE }}
            style={{
              display: "inline-flex",
              alignItems: "stretch",
              padding: 4,
              borderRadius: 14,
              background: "rgba(4,7,12,0.6)",
              border: `1px solid ${C}33`,
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              marginBottom: 24,
            }}
          >
            {[
              { v: cd.d, label: "Days" },
              { v: cd.h, label: "Hrs" },
              { v: cd.m, label: "Min" },
              { v: cd.s, label: "Sec" },
            ].map((u, i, arr) => (
              <div key={u.label} style={{ display: "flex", alignItems: "stretch" }}>
                <div style={{ padding: "8px 16px", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 58 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(20px, 2.1vw, 26px)",
                      fontWeight: 700,
                      lineHeight: 1,
                      color: "white",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(u.v).padStart(2, "0")}
                  </span>
                  <span style={{ marginTop: 5, fontFamily: "var(--font-outfit)", fontSize: 8.5, fontWeight: 700, letterSpacing: "2.2px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                    {u.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <span style={{ width: 1, alignSelf: "stretch", margin: "8px 0", background: "rgba(255,255,255,0.08)" }} />
                )}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.62, ease: EASE }}
            style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
          >
            <a
              href="#register-interest"
              className="cfq-cta-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                borderRadius: 999,
                background: `linear-gradient(135deg, ${C} 0%, ${C_DEEP} 100%)`,
                border: `1px solid ${C_BRIGHT}88`,
                fontFamily: "var(--font-outfit)",
                fontSize: 13.5,
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "white",
                textDecoration: "none",
                boxShadow: `0 14px 36px ${C}55, 0 0 50px ${C}22`,
              }}
            >
              Apply to attend
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a
              href="#agenda"
              className="cfq-cta-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 24px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${QATAR_BRIGHT}55`,
                fontFamily: "var(--font-outfit)",
                fontSize: 13.5,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "white",
                textDecoration: "none",
              }}
            >
              View the agenda
            </a>
          </motion.div>
        </div>
      </div>

      {/* EFG attribution */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.85 }}
        style={{
          position: "absolute",
          bottom: 22,
          right: 22,
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 14px",
          borderRadius: 999,
          background: "rgba(4,7,12,0.55)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.62)" }}>
          An initiative by
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/events-first-group_logo_alt.svg"
          alt="Events First Group logo — producers of Cyber First Qatar 2026 cybersecurity summit"
          width={120}
          height={44}
          loading="lazy"
          decoding="async"
          style={{ height: 32, width: "auto", opacity: 0.85 }}
        />
      </motion.div>

      <style jsx>{`
        @keyframes cfq-chip-pulse-anim {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(2.4); opacity: 0;   }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        .cfq-chip-pulse-ring {
          animation: cfq-chip-pulse-anim 2.2s cubic-bezier(0.22,1,0.36,1) infinite;
        }
        .cfq-cta-primary {
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease;
        }
        .cfq-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 44px ${C}77, 0 0 60px ${C}33 !important;
        }
        .cfq-cta-secondary {
          transition: background 0.35s ease, border-color 0.35s ease, transform 0.35s ease;
        }
        .cfq-cta-secondary:hover {
          background: rgba(255,255,255,0.08) !important;
          border-color: ${QATAR_BRIGHT}99 !important;
          transform: translateY(-2px);
        }
        /* ── Tablet (≤900px) — slightly tighten copy + spacing ───────── */
        @media (max-width: 900px) {
          .cfq-hero-left :global(h1) {
            font-size: clamp(30px, 6vw, 56px) !important;
            letter-spacing: -1.6px !important;
          }
        }
        /* ── Narrow phones (≤480px) — compress vertical rhythm ──────── */
        @media (max-width: 480px) {
          .cfq-hero-content {
            padding: 116px 18px 30px !important;
          }
          .cfq-hero-chip {
            top: 78px !important;
            right: 14px !important;
            padding: 6px 12px !important;
          }
          .cfq-hero-chip :global(span) {
            font-size: 9px !important;
            letter-spacing: 2.4px !important;
          }
          .cfq-hero-left :global(h1) {
            font-size: clamp(26px, 7.8vw, 38px) !important;
            line-height: 1.08 !important;
            margin-bottom: 14px !important;
          }
          .cfq-hero-left :global(p) {
            margin-bottom: 18px !important;
          }
        }
        /* ── Tiny phones (≤360px) — final compress ──────────────────── */
        @media (max-width: 360px) {
          .cfq-hero-left :global(h1) {
            font-size: 24px !important;
            letter-spacing: -1px !important;
          }
        }
        /* ── Short viewports (≤700px tall) — squeeze top padding ───── */
        @media (max-height: 700px) {
          .cfq-hero-content {
            padding-top: clamp(76px, 9vh, 96px) !important;
            padding-bottom: clamp(24px, 3.5vh, 40px) !important;
          }
          .cfq-hero-left :global(h1) {
            font-size: clamp(26px, 4vw, 48px) !important;
            margin-bottom: 12px !important;
          }
          .cfq-hero-left :global(p) {
            margin-bottom: 18px !important;
          }
        }
        /* ── Very short (≤620px tall) — also shrink the countdown ───── */
        @media (max-height: 620px) {
          .cfq-hero-left :global(h1) {
            font-size: clamp(22px, 3.5vw, 36px) !important;
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// AT A GLANCE
// ───────────────────────────────────────────────────────────────────────────
function AtAGlance() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="glance"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0",
        background: BG_BASE,
        overflow: "hidden",
      }}
    >
      {/* ── Background image — past Cyber First hall photo from S3 ──────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://efg-final.s3.eu-north-1.amazonaws.com/cyberbg.jpg"
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.62,
          zIndex: 0,
        }}
      />
      {/* Tonal overlay — keeps stats readable while letting the hall photo show through */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 60% 55% at 15% 30%, ${C}24 0%, transparent 60%),
            radial-gradient(ellipse 55% 50% at 90% 75%, ${QATAR}1e 0%, transparent 60%),
            linear-gradient(180deg, rgba(2,5,14,0.55) 0%, rgba(2,5,14,0.32) 50%, rgba(2,5,14,0.65) 100%)
          `,
          zIndex: 1,
        }}
      />
      <BgDots opacity={0.035} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {/* Eyebrow rendered as a glass badge so it reads cleanly over the hall photo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: EASE }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(4,7,12,0.65)",
            border: `1px solid ${C}55`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 18px ${C}22`,
            marginBottom: "clamp(20px, 2.4vw, 28px)",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 10px ${C_BRIGHT}, 0 0 18px ${C}66` }} />
          <span style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "3.5px",
            textTransform: "uppercase",
            color: C_BRIGHT,
          }}>
            Cyber First Qatar · At a Glance
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 48px)",
            letterSpacing: "-1.8px",
            lineHeight: 1.04,
            color: "white",
            margin: "0 0 clamp(32px, 4vw, 52px)",
            maxWidth: 880,
            textShadow: "0 2px 14px rgba(2,5,14,0.55)",
          }}
        >
          One day. One room.{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>The leaders defining Qatar's secure digital future.</em>
        </motion.h2>

        {/* Single-row stat strip — 6 columns sharing a unified glass bar */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
          className="cfq-glance-strip"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: `repeat(${HIGHLIGHTS.length}, 1fr)`,
            background: `linear-gradient(180deg, rgba(4,7,12,0.72) 0%, rgba(4,7,12,0.58) 100%)`,
            border: `1px solid ${C}26`,
            borderRadius: 20,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 0 50px ${C}14, inset 0 1px 0 rgba(255,255,255,0.05)`,
            overflow: "hidden",
          }}
        >
          {/* Top accent hairline spanning the bar */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: "4%",
              right: "4%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${C_BRIGHT}aa 30%, ${QATAR_BRIGHT}88 70%, transparent)`,
              boxShadow: `0 0 16px ${C}77`,
            }}
          />

          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.28 + i * 0.06, ease: EASE }}
              className="cfq-glance-cell"
              style={{
                position: "relative",
                padding: "clamp(22px, 2.4vw, 34px) clamp(12px, 1.4vw, 22px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 10,
                borderRight: i < HIGHLIGHTS.length - 1 ? `1px solid rgba(255,255,255,0.07)` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 4vw, 56px)",
                    fontWeight: 800,
                    letterSpacing: "-1.8px",
                    color: "white",
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <Counter to={parseInt(h.value, 10) || 0} />
                </span>
                {h.suffix && (
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(18px, 1.9vw, 26px)",
                      fontWeight: 700,
                      color: C_BRIGHT,
                      letterSpacing: "-0.4px",
                      lineHeight: 1,
                    }}
                  >
                    {h.suffix}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "clamp(11.5px, 0.85vw, 13px)",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {h.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          .cfq-glance-strip {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .cfq-glance-cell:nth-child(3n) {
            border-right: none !important;
          }
          .cfq-glance-cell:nth-child(n + 4) {
            border-top: 1px solid rgba(255,255,255,0.07);
          }
        }
        @media (max-width: 640px) {
          .cfq-glance-strip {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .cfq-glance-cell {
            border-right: none !important;
          }
          .cfq-glance-cell:nth-child(2n) {
            border-right: none !important;
          }
          .cfq-glance-cell:nth-child(2n + 1) {
            border-right: 1px solid rgba(255,255,255,0.07) !important;
          }
          .cfq-glance-cell:nth-child(n + 3) {
            border-top: 1px solid rgba(255,255,255,0.07);
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// EVENT OVERVIEW
// ───────────────────────────────────────────────────────────────────────────
function EventOverview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="about"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0",
        background: BG_DEEP,
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 50% 60% at 15% 25%, ${C}14 0%, transparent 60%),
            radial-gradient(ellipse 45% 50% at 90% 80%, ${QATAR}12 0%, transparent 65%),
            radial-gradient(ellipse 30% 40% at 50% 110%, ${GOLD}08 0%, transparent 70%)
          `,
          pointerEvents: "none",
        }}
      />
      <BgDots opacity={0.04} />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <div
          className="cfq-overview-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 1fr",
            gap: "clamp(36px, 4.5vw, 72px)",
            alignItems: "center",
          }}
        >
          {/* ── LEFT — editorial copy column ── */}
          <div className="cfq-overview-copy">

            <Eyebrow inView={inView} label="Event Overview" tone="maroon" />

            {/* Pull-quote intro */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(22px, 2.2vw, 32px)",
                letterSpacing: "-0.8px",
                lineHeight: 1.3,
                color: "white",
                margin: "0 0 clamp(24px, 2.8vw, 36px)",
              }}
            >
              As Qatar accelerates its digital transformation under{" "}
              <span style={{ color: C_BRIGHT, fontStyle: "italic", fontWeight: 400 }}>Qatar National Vision 2030</span>,
              cybersecurity is emerging as a critical pillar of economic growth, digital trust, and national resilience.
            </motion.p>

            {/* Body para 1 — market stats */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.2, ease: EASE }}
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(15px, 1.15vw, 17px)",
                fontWeight: 400,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.85)",
                margin: "0 0 22px",
              }}
            >
              With the country's cybersecurity market projected to exceed{" "}
              <strong style={{ color: "white", fontWeight: 600 }}>USD 1 billion by 2030</strong>{" "}
              and global cybercrime costs expected to surpass{" "}
              <strong style={{ color: "white", fontWeight: 600 }}>USD 10 trillion annually</strong>,
              organizations are increasing investments in AI security, cloud protection, and critical infrastructure resilience.
            </motion.p>

            {/* Body para 2 — QNCS Strategy alignment */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.3, ease: EASE }}
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(15px, 1.15vw, 17px)",
                fontWeight: 400,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.85)",
                margin: "0 0 clamp(28px, 3.2vw, 40px)",
              }}
            >
              Aligned with the{" "}
              <span style={{ color: QATAR_BRIGHT, fontWeight: 600 }}>Qatar National Cyber Security Strategy 2024-2030</span>,
              Cyber First Qatar 2026 convenes 250+ senior leaders, 30+ expert speakers, and key government and industry stakeholders
              to shape the strategies, technologies, and partnerships of Qatar's secure, AI-powered future.
            </motion.p>

            {/* Footer line — proof anchor (ties text to video column) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, ${C}aa, transparent)` }} />
              <span style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "3.5px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}>
                Past editions delivered across the region
              </span>
            </motion.div>
          </div>

          {/* ── RIGHT — 3 videos stacked vertically, premium proof column ── */}
          <div
            className="cfq-overview-videos"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(14px, 1.6vw, 22px)",
              position: "relative",
            }}
          >
            {/* Ambient cyan + maroon halo behind the video stack */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: -24,
                borderRadius: 32,
                background: `radial-gradient(ellipse 60% 35% at 30% 15%, ${C}24 0%, transparent 60%), radial-gradient(ellipse 60% 35% at 70% 85%, ${QATAR}22 0%, transparent 60%)`,
                filter: "blur(40px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            <CfqHighlightCard
              videoId="0d_2Itsg6ec"
              edition="3rd Edition · Qatar"
              location="Qatar"
              inView={inView}
              index={0}
            />

            {/* Caption under the featured highlight */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4, position: "relative", zIndex: 1 }}
            >
              <span aria-hidden style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", background: `${C}1f`, border: `1px solid ${C}44`, flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill={C_BRIGHT} aria-hidden><path d="M8 5v14l11-7z" /></svg>
              </span>
              <span>
                <span style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 600, color: "white", lineHeight: 1.25 }}>
                  Inside the last Cyber First Qatar edition
                </span>
                <span style={{ display: "block", marginTop: 1, fontFamily: "var(--font-outfit)", fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>
                  Official event highlights
                </span>
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .cfq-overview-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(28px, 4vw, 44px) !important;
          }
          /* Copy first on tablet/mobile so users get context before scrolling videos */
          .cfq-overview-copy {
            order: 1;
            position: static !important;
            top: auto !important;
          }
          .cfq-overview-videos {
            order: 2;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Highlight video card — Cyber First past editions ─────────────────────
function CfqHighlightCard({
  videoId,
  edition,
  location,
  inView,
  index,
  featured = false,
}: {
  videoId: string;
  edition: string;
  location: string;
  inView: boolean;
  index: number;
  featured?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbSrc = featured
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const accent = featured ? GOLD : C;
  const accentBright = featured ? "#E2BD68" : C_BRIGHT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay: featured ? 0.18 : 0.5 + index * 0.1, ease: EASE }}
      className="cfq-vcard"
      onClick={() => !isPlaying && setIsPlaying(true)}
      style={{
        position: "relative",
        borderRadius: featured ? 22 : 18,
        overflow: "hidden",
        cursor: isPlaying ? "default" : "pointer",
        aspectRatio: "16 / 9",
        background: `linear-gradient(165deg, ${BG_ELEV} 0%, ${BG_BASE} 100%)`,
        border: `1px solid ${accent}${featured ? "33" : "1f"}`,
        boxShadow: featured
          ? `0 40px 90px rgba(0,0,0,0.65), 0 0 80px ${accent}26, 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`
          : `0 22px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)`,
        transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1), border-color 0.55s ease, box-shadow 0.55s ease",
        zIndex: 1,
      }}
    >
      {isPlaying ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={`Cyber First ${location} — Event Highlights`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbSrc}
            alt={`Cyber First ${location} highlights thumbnail`}
            loading="lazy"
            className="cfq-vcard-thumb"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const img = e.currentTarget;
              if (img.src.includes("maxresdefault")) img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
            }}
          />

          {/* Dark overlay for legibility + hover lighten */}
          <div
            aria-hidden
            className="cfq-vcard-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: featured
                ? `linear-gradient(180deg, rgba(2,5,14,0.12) 0%, rgba(2,5,14,0.04) 45%, rgba(2,5,14,0.88) 100%)`
                : `linear-gradient(180deg, rgba(2,5,14,0.15) 0%, rgba(2,5,14,0.05) 45%, rgba(2,5,14,0.85) 100%)`,
              transition: "opacity 0.5s ease",
            }}
          />

          {/* Top accent hairline */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: featured ? "8%" : "12%",
              right: featured ? "8%" : "12%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${accentBright}cc, transparent)`,
              boxShadow: `0 0 16px ${accent}aa`,
            }}
          />

          {/* Edition pill — top-left */}
          <span
            style={{
              position: "absolute",
              top: featured ? 22 : 14,
              left: featured ? 22 : 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: featured ? "7px 14px" : "5px 11px",
              borderRadius: 999,
              background: "rgba(4,7,12,0.7)",
              border: `1px solid ${accent}66`,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              fontFamily: "var(--font-outfit)",
              fontSize: featured ? 10.5 : 9.5,
              fontWeight: 700,
              letterSpacing: featured ? "2.8px" : "2.2px",
              textTransform: "uppercase",
              color: accentBright,
              zIndex: 3,
              boxShadow: `0 4px 14px rgba(0,0,0,0.4), 0 0 18px ${accent}33`,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: accentBright, boxShadow: `0 0 10px ${accentBright}` }} />
            {edition}
          </span>

          {/* Location title — bottom-left */}
          <div
            style={{
              position: "absolute",
              bottom: featured ? 24 : 14,
              left: featured ? 26 : 16,
              right: featured ? 26 : 16,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
              zIndex: 3,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: featured ? 5 : 3 }}>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: featured ? 10 : 9, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                Event Highlights
              </span>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: featured ? "clamp(20px, 2.2vw, 30px)" : "clamp(15px, 1.4vw, 18px)",
                fontWeight: featured ? 800 : 700,
                letterSpacing: featured ? "-0.6px" : "-0.3px",
                color: "white",
              }}>
                Cyber First · {location}
              </span>
            </div>
            {featured && (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                border: `1px solid rgba(255,255,255,0.14)`,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: "white",
                whiteSpace: "nowrap",
              }}>
                Watch
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </span>
            )}
          </div>

          {/* Apple-style play button — center */}
          <div
            className="cfq-vcard-play-wrap"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 4,
              pointerEvents: "none",
            }}
          >
            <div
              className="cfq-vcard-play-btn"
              style={{
                position: "relative",
                width: featured ? 92 : 64,
                height: featured ? 92 : 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.94)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: featured
                  ? `0 22px 60px rgba(0,0,0,0.65), 0 0 50px ${accent}66`
                  : `0 14px 40px rgba(0,0,0,0.55), 0 0 30px ${C}55`,
                transition: "background 0.35s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)",
              }}
              data-featured={featured ? "true" : "false"}
            >
              {/* Pulse ring */}
              <span
                aria-hidden
                className="cfq-vcard-play-pulse"
                style={{
                  position: "absolute",
                  inset: featured ? -8 : -6,
                  borderRadius: "50%",
                  border: `${featured ? 2 : 1.5}px solid ${accentBright}`,
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />
              <svg width={featured ? 30 : 22} height={featured ? 30 : 22} viewBox="0 0 24 24" fill={featured ? "#3A2A06" : C_DEEP} style={{ marginLeft: featured ? 4 : 3 }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .cfq-vcard:hover {
          transform: translateY(-5px);
          border-color: ${accent}77 !important;
          box-shadow:
            0 36px 80px rgba(0,0,0,0.65),
            0 0 80px ${accent}40,
            inset 0 1px 0 rgba(255,255,255,0.07) !important;
        }
        .cfq-vcard:hover .cfq-vcard-thumb {
          transform: scale(1.06);
        }
        .cfq-vcard:hover .cfq-vcard-overlay {
          opacity: 0.72;
        }
        .cfq-vcard:hover .cfq-vcard-play-btn {
          background: ${accentBright} !important;
          transform: scale(1.06);
        }
        @keyframes cfq-vcard-pulse {
          0%   { transform: scale(1);   opacity: 0.75; }
          80%  { transform: scale(1.6); opacity: 0;    }
          100% { transform: scale(1.6); opacity: 0;    }
        }
        .cfq-vcard-play-pulse {
          animation: cfq-vcard-pulse 2.4s cubic-bezier(0.22,1,0.36,1) infinite;
        }
      `}</style>
    </motion.div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// WHY QATAR? WHY NOW?
// ───────────────────────────────────────────────────────────────────────────
function WhyQatar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const toneMap = {
    cyan:   { accent: C,     bright: C_BRIGHT, glow: `${C}40` },
    maroon: { accent: QATAR, bright: QATAR_BRIGHT, glow: `${QATAR}40` },
    gold:   { accent: GOLD,  bright: "#E2BD68", glow: `${GOLD}40` },
  } as const;

  return (
    <section
      ref={ref}
      id="why-qatar"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0",
        background: BG_DEEP,
        overflow: "hidden",
      }}
    >
      {/* Ambient cyan + maroon halos — same intensity as Event Overview / Themes */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 50% 60% at 15% 25%, ${C}14 0%, transparent 60%),
            radial-gradient(ellipse 45% 50% at 90% 80%, ${QATAR}14 0%, transparent 65%)
          `,
          pointerEvents: "none",
        }}
      />
      <BgDots opacity={0.035} />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        {/* Eyebrow as glass badge for consistency with At a Glance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: EASE }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(4,7,12,0.65)",
            border: `1px solid ${QATAR}55`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 18px ${QATAR}22`,
            marginBottom: "clamp(20px, 2.4vw, 28px)",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: QATAR_BRIGHT, boxShadow: `0 0 10px ${QATAR_BRIGHT}, 0 0 18px ${QATAR}66` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "3.5px", textTransform: "uppercase", color: QATAR_BRIGHT }}>
            Why Qatar · Why Now
          </span>
        </motion.div>

        {/* Headline + intro paragraph */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "clamp(24px, 4vw, 60px)", alignItems: "end", marginBottom: "clamp(36px, 4.5vw, 56px)" }} className="cfq-why-header">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 50px)",
              letterSpacing: "-1.8px",
              lineHeight: 1.04,
              color: "white",
              margin: 0,
            }}
          >
            Six forces converging on{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: QATAR_BRIGHT }}>Doha right now.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(14.5px, 1.1vw, 16px)",
              fontWeight: 400,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.78)",
              margin: 0,
              maxWidth: 540,
            }}
          >
            From national strategy to converged industrial systems, the same handful of forces are reshaping
            how the Kingdom defends its connected economy &mdash; and they are all moving at once.
          </motion.p>
        </div>

        <div
          className="cfq-why-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(16px, 1.8vw, 22px)",
          }}
        >
          {WHY_QATAR.map((w, i) => {
            const t = toneMap[w.tone];
            return (
              <motion.div
                key={w.headline}
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.18 + i * 0.06, ease: EASE }}
                className="cfq-why-card"
                style={{
                  position: "relative",
                  padding: "clamp(24px, 2.8vw, 32px)",
                  paddingLeft: "clamp(28px, 3.2vw, 36px)",
                  borderRadius: 20,
                  background: `linear-gradient(170deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%)`,
                  border: `1px solid rgba(255,255,255,0.05)`,
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.5s ease, box-shadow 0.5s ease",
                  boxShadow: `0 18px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)`,
                  ["--card-accent" as string]: t.accent,
                  ["--card-glow" as string]: t.glow,
                }}
              >
                {/* Left tone rail */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "10%",
                    bottom: "10%",
                    left: 0,
                    width: 3,
                    borderRadius: "0 3px 3px 0",
                    background: `linear-gradient(180deg, transparent, ${t.bright}, transparent)`,
                    boxShadow: `0 0 12px ${t.accent}88`,
                  }}
                />

                {/* Top accent hairline */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "10%",
                    right: "10%",
                    height: 1,
                    background: `linear-gradient(90deg, transparent, ${t.bright}aa, transparent)`,
                    boxShadow: `0 0 12px ${t.accent}66`,
                  }}
                />

                {/* Big ghost number — background corner */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: -12,
                    right: -8,
                    fontFamily: "var(--font-display)",
                    fontSize: 130,
                    fontWeight: 900,
                    fontStyle: "italic",
                    lineHeight: 1,
                    color: "transparent",
                    WebkitTextStroke: `1px ${t.accent}1a`,
                    letterSpacing: "-6px",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Top row: tag chip + small serration */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, position: "relative", zIndex: 1 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "5px 11px",
                      borderRadius: 999,
                      background: `${t.accent}1a`,
                      border: `1px solid ${t.accent}44`,
                      fontFamily: "var(--font-outfit)",
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: "2.4px",
                      textTransform: "uppercase",
                      color: t.bright,
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.bright, boxShadow: `0 0 8px ${t.bright}` }} />
                    {w.tag}
                  </span>
                  <QatarSerration width={28} color={`${t.accent}66`} />
                </div>

                {/* Headline */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(17px, 1.5vw, 21px)",
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                    color: "white",
                    lineHeight: 1.2,
                    margin: 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {w.headline}
                </h3>

                {/* Body */}
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.74)",
                    lineHeight: 1.6,
                    margin: 0,
                    flex: 1,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {w.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .cfq-why-card:hover {
          transform: translateY(-5px);
          border-color: var(--card-accent) !important;
          box-shadow:
            0 28px 64px rgba(0,0,0,0.6),
            0 0 60px var(--card-glow),
            inset 0 1px 0 rgba(255,255,255,0.07) !important;
        }
        @media (max-width: 980px) {
          .cfq-why-header {
            grid-template-columns: 1fr !important;
            align-items: start !important;
          }
          .cfq-why-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 620px) {
          .cfq-why-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// KEY THEMES
// ───────────────────────────────────────────────────────────────────────────
function KeyThemes() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="themes"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0 clamp(24px, 3vw, 38px)",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 40% 50% at 90% 25%, ${C}15 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 10% 75%, ${QATAR}15 0%, transparent 60%)
          `,
          pointerEvents: "none",
        }}
      />
      <BgDots opacity={0.04} />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        {/* Eyebrow as glass badge — matches other reworked sections */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: EASE }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(4,7,12,0.65)",
            border: `1px solid ${QATAR}55`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 18px ${QATAR}22`,
            marginBottom: "clamp(20px, 2.4vw, 28px)",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: QATAR_BRIGHT, boxShadow: `0 0 10px ${QATAR_BRIGHT}, 0 0 18px ${QATAR}66` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "3.5px", textTransform: "uppercase", color: QATAR_BRIGHT }}>
            Strategic Themes · 8 Tracks
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 50px)",
            letterSpacing: "-1.8px",
            lineHeight: 1.04,
            color: "white",
            margin: "0 0 clamp(36px, 4vw, 54px)",
            maxWidth: 920,
          }}
        >
          The conversations defining{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>cyber resilience in Qatar.</em>
        </motion.h2>

        {/* Bento grid — 4 cols, first 2 cards span 2, last 2 cards center-spanned.
            All cards share identical padding, height, and typography for visual unity. */}
        <div
          className="cfq-themes-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: "1fr",
            gap: "clamp(14px, 1.4vw, 18px)",
          }}
        >
          {KEY_THEMES.map((t, i) => {
            const isCyan = i % 2 === 0;
            const accentRgba = isCyan ? "1,187,245" : "184,58,95";
            return (
              <motion.div
                key={t.num}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: EASE }}
                className="cfq-theme-card"
                style={{
                  gridColumn: i < 2 ? "span 2" : i === 6 ? "2 / 3" : i === 7 ? "3 / 4" : "span 1",
                  borderRadius: 20,
                  /* Outer skeuomorphic bezel */
                  background: `linear-gradient(145deg, rgba(${accentRgba},0.07), rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.15) 100%)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(${accentRgba},0.09)`,
                  overflow: "hidden",
                  position: "relative",
                  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease",
                  ["--card-accent-rgba" as string]: accentRgba,
                }}
              >
                {/* Inner liquid glass panel — uniform padding + height across all cards */}
                <div
                  style={{
                    position: "relative",
                    margin: 4,
                    borderRadius: 17,
                    padding: "clamp(18px, 1.8vw, 24px)",
                    background: "rgba(10,14,32,0.7)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                    overflow: "hidden",
                    minHeight: 96,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Top reflection line */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "10%",
                      right: "10%",
                      height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                    }}
                  />

                  {/* Subtle accent refraction wash */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(ellipse 60% 60% at 30% 30%, rgba(${accentRgba},0.06), transparent 70%)`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Big ghost watermark number — uniform size */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 14,
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: 38,
                      color: `rgba(${accentRgba},0.1)`,
                      letterSpacing: "-1.5px",
                      lineHeight: 1,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {t.num}
                  </span>

                  {/* Left accent rail */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      bottom: "20%",
                      width: 3,
                      borderRadius: 2,
                      background: `linear-gradient(to bottom, rgba(${accentRgba},0.7), rgba(${accentRgba},0.15))`,
                      boxShadow: `0 0 12px rgba(${accentRgba},0.4)`,
                    }}
                  />

                  {/* Title — uniform size across all cards */}
                  <h3
                    style={{
                      position: "relative",
                      fontFamily: "var(--font-outfit)",
                      fontSize: "clamp(14.5px, 1.15vw, 16.5px)",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.92)",
                      lineHeight: 1.4,
                      margin: 0,
                      paddingLeft: 12,
                      paddingRight: 36,
                    }}
                  >
                    {t.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .cfq-theme-card:hover {
          transform: translateY(-4px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 16px 40px rgba(0,0,0,0.5),
            0 0 0 1px rgba(var(--card-accent-rgba), 0.18) !important;
        }
        @media (max-width: 900px) {
          .cfq-themes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .cfq-theme-card {
            grid-column: span 1 !important;
          }
        }
        @media (max-width: 520px) {
          .cfq-themes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// QATAR CYBERSECURITY LANDSCAPE — Key Facts
// ───────────────────────────────────────────────────────────────────────────
function LandscapeFacts() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="landscape"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0",
        background: BG_BASE,
        overflow: "hidden",
      }}
    >
      {/* ── Background image — past Cyber First event stage photo from S3 ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://efg-final.s3.eu-north-1.amazonaws.com/kuwait/kuwait/cyber21-04-760.jpg"
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.6,
          zIndex: 0,
        }}
      />
      {/* Tonal overlay — keeps stats readable while the stage photo reads */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 55% 50% at 15% 25%, ${C}22 0%, transparent 60%),
            radial-gradient(ellipse 55% 50% at 90% 75%, ${QATAR}1f 0%, transparent 60%),
            linear-gradient(180deg, rgba(2,5,14,0.58) 0%, rgba(2,5,14,0.36) 50%, rgba(2,5,14,0.68) 100%)
          `,
          zIndex: 1,
        }}
      />
      <BgDots opacity={0.035} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {/* Eyebrow as glass badge — consistent with At a Glance / Why Qatar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: EASE }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(4,7,12,0.65)",
            border: `1px solid ${C}55`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 18px ${C}22`,
            marginBottom: "clamp(20px, 2.4vw, 28px)",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 10px ${C_BRIGHT}, 0 0 18px ${C}66` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "3.5px", textTransform: "uppercase", color: C_BRIGHT }}>
            Qatar Cybersecurity Landscape
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 50px)",
            letterSpacing: "-1.8px",
            lineHeight: 1.04,
            color: "white",
            margin: "0 0 clamp(32px, 4vw, 52px)",
            maxWidth: 920,
            textShadow: "0 2px 14px rgba(2,5,14,0.55)",
          }}
        >
          The market is moving{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>fast.</em>
        </motion.h2>

        {/* Single-row fact strip — 6 columns in unified glass bar */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
          className="cfq-facts-strip"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: `repeat(${LANDSCAPE_FACTS.length}, 1fr)`,
            background: `linear-gradient(180deg, rgba(4,7,12,0.74) 0%, rgba(4,7,12,0.58) 100%)`,
            border: `1px solid ${C}26`,
            borderRadius: 20,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 0 50px ${C}14, inset 0 1px 0 rgba(255,255,255,0.05)`,
            overflow: "hidden",
          }}
        >
          {/* Top accent hairline spanning the bar */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: "4%",
              right: "4%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${C_BRIGHT}aa 30%, ${QATAR_BRIGHT}88 70%, transparent)`,
              boxShadow: `0 0 16px ${C}77`,
            }}
          />

          {LANDSCAPE_FACTS.map((f, i) => {
            const accent = f.tone === "maroon" ? QATAR_BRIGHT : f.tone === "gold" ? "#E2BD68" : C_BRIGHT;
            const accentDeep = f.tone === "maroon" ? QATAR : f.tone === "gold" ? GOLD : C;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.28 + i * 0.06, ease: EASE }}
                className="cfq-facts-cell"
                style={{
                  position: "relative",
                  padding: "clamp(22px, 2.4vw, 30px) clamp(12px, 1.4vw, 22px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 10,
                  borderRight: i < LANDSCAPE_FACTS.length - 1 ? `1px solid rgba(255,255,255,0.07)` : "none",
                }}
              >
                {/* Tone accent rail at the top of each cell */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "20%",
                    right: "20%",
                    height: 2,
                    background: accentDeep,
                    boxShadow: `0 0 10px ${accent}aa`,
                    opacity: 0.85,
                  }}
                />

                {/* Unit pill */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 9px",
                    borderRadius: 999,
                    background: `${accentDeep}1a`,
                    border: `1px solid ${accentDeep}44`,
                  }}
                >
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: accent, boxShadow: `0 0 6px ${accent}` }} />
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: accent }}>
                    {f.unit}
                  </span>
                </div>

                {/* Big stat (gradient text) */}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(22px, 2.3vw, 32px)",
                    fontWeight: 800,
                    letterSpacing: "-1.2px",
                    lineHeight: 1.05,
                    color: "white",
                    background: `linear-gradient(135deg, white 0%, ${accent} 100%)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {f.stat}
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: "clamp(11px, 0.85vw, 13px)",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.78)",
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                >
                  {f.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          .cfq-facts-strip {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .cfq-facts-cell:nth-child(3n) {
            border-right: none !important;
          }
          .cfq-facts-cell:nth-child(n + 4) {
            border-top: 1px solid rgba(255,255,255,0.07);
          }
        }
        @media (max-width: 640px) {
          .cfq-facts-strip {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .cfq-facts-cell {
            border-right: none !important;
          }
          .cfq-facts-cell:nth-child(2n + 1) {
            border-right: 1px solid rgba(255,255,255,0.07) !important;
          }
          .cfq-facts-cell:nth-child(n + 3) {
            border-top: 1px solid rgba(255,255,255,0.07);
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// WHO SHOULD ATTEND
// ───────────────────────────────────────────────────────────────────────────
function WhoAttends() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="audience"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <BgDots opacity={0.04} />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        {/* Section header */}
        <div style={{ marginBottom: "clamp(28px, 3vw, 40px)", maxWidth: 920 }}>
          <Eyebrow inView={inView} label="Who Should Attend" tone="maroon" />

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 50px)",
              letterSpacing: "-1.8px",
              lineHeight: 1.04,
              color: "white",
              margin: 0,
            }}
          >
            The room is built for{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: QATAR_BRIGHT }}>senior decision-makers.</em>
          </motion.h2>
        </div>

        {/* Split — image left, role list right */}
        <div
          className="cfq-attends-split"
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: "clamp(24px, 3vw, 44px)",
            alignItems: "start",
          }}
        >
          {/* LEFT — sticky image card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
            className="cfq-attends-image-wrap"
            style={{
              position: "sticky",
              top: 100,
            }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: 22,
                overflow: "hidden",
                padding: 3,
                background: `linear-gradient(145deg, ${C}30 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 70%, ${QATAR}26 100%)`,
                boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 -2px 0 rgba(0,0,0,0.3) inset, 0 24px 60px rgba(0,0,0,0.55)`,
              }}
            >
              <div
                style={{
                  position: "relative",
                  borderRadius: 19,
                  overflow: "hidden",
                  background: BG_DEEP,
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/cyber-first-uae/ARU00500.jpg"
                    alt="Senior cybersecurity leaders at a past Cyber First summit"
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center 35%",
                      display: "block",
                    }}
                  />
                  {/* Tone gradient overlay */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(180deg, rgba(4,8,24,0.08) 0%, rgba(4,8,24,0.4) 55%, rgba(4,8,24,0.96) 100%)`,
                      pointerEvents: "none",
                    }}
                  />
                  {/* Top shine */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "8%",
                      right: "8%",
                      height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                      zIndex: 3,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Caption overlay — bottom */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: "clamp(20px, 2.4vw, 28px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      zIndex: 4,
                    }}
                  >
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: C_BRIGHT,
                          boxShadow: `0 0 10px ${C}`,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-outfit)",
                          fontSize: 10.5,
                          fontWeight: 700,
                          letterSpacing: "3px",
                          textTransform: "uppercase",
                          color: C_BRIGHT,
                        }}
                      >
                        The Room
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "clamp(17px, 1.5vw, 22px)",
                        lineHeight: 1.25,
                        letterSpacing: "-0.5px",
                        color: "white",
                        margin: 0,
                        textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                      }}
                    >
                      250+ senior cyber and digital leaders shaping Qatar&apos;s connected economy.
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontWeight: 400,
                        fontSize: "clamp(13px, 1.05vw, 14.5px)",
                        lineHeight: 1.55,
                        color: "rgba(255,255,255,0.74)",
                        margin: 0,
                        textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                      }}
                    >
                      A curated, invite-only gathering of CISOs, CIOs and security practitioners across government, banking, energy and critical infrastructure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — role grid (2-col) */}
          <div
            className="cfq-attends-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "clamp(10px, 1.2vw, 14px)",
              alignContent: "start",
            }}
          >
            {WHO_ATTENDS.map((item, i) => {
              const tone = i % 2 === 0 ? C : QATAR;
              const toneBright = i % 2 === 0 ? C_BRIGHT : QATAR_BRIGHT;
              return (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.22 + i * 0.04, ease: EASE }}
                  className="cfq-attend-card"
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "clamp(14px, 1.4vw, 18px) clamp(16px, 1.6vw, 20px)",
                    borderRadius: 12,
                    background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)`,
                    border: `1px solid rgba(255,255,255,0.06)`,
                    overflow: "hidden",
                    transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), border-color 0.45s ease, box-shadow 0.45s ease, background 0.45s ease",
                    // CSS vars for hover styling without rebuilding template literals
                    ['--cfq-attend-tone' as string]: tone,
                    ['--cfq-attend-tone-bright' as string]: toneBright,
                  }}
                >
                  {/* Left tone rail */}
                  <span
                    aria-hidden
                    className="cfq-attend-rail"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      bottom: "20%",
                      width: 2,
                      background: `linear-gradient(180deg, transparent, ${tone}, transparent)`,
                      opacity: 0.6,
                      transition: "opacity 0.45s ease",
                    }}
                  />

                  {/* Icon disc */}
                  <span
                    className="cfq-attend-icon"
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `linear-gradient(135deg, ${tone}28 0%, ${tone}10 100%)`,
                      border: `1px solid ${tone}45`,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`,
                      transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={toneBright}
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={item.icon} />
                    </svg>
                  </span>

                  {/* Role label */}
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: "clamp(13.5px, 1.05vw, 14.5px)",
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.88)",
                      letterSpacing: "0.1px",
                      lineHeight: 1.35,
                    }}
                  >
                    {item.role}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cfq-attend-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.14) !important;
          box-shadow: 0 14px 38px rgba(0,0,0,0.4);
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%) !important;
        }
        .cfq-attend-card:hover .cfq-attend-rail {
          opacity: 1 !important;
          top: 0 !important;
          bottom: 0 !important;
        }
        .cfq-attend-card:hover .cfq-attend-icon {
          transform: scale(1.05);
          background: linear-gradient(135deg, var(--cfq-attend-tone) 0%, var(--cfq-attend-tone-bright) 100%) !important;
          border-color: var(--cfq-attend-tone-bright) !important;
          box-shadow: 0 0 20px var(--cfq-attend-tone), inset 0 1px 0 rgba(255,255,255,0.2) !important;
        }
        .cfq-attend-card:hover .cfq-attend-icon svg {
          stroke: white !important;
        }
        @media (max-width: 980px) {
          .cfq-attends-split {
            grid-template-columns: 1fr !important;
          }
          .cfq-attends-image-wrap {
            position: relative !important;
            top: 0 !important;
            max-width: 540px;
            margin: 0 auto;
          }
        }
        @media (max-width: 640px) {
          .cfq-attends-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// KEY INDUSTRY SECTORS
// ───────────────────────────────────────────────────────────────────────────
function KeyIndustries() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="sectors"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <BgDots opacity={0.035} />

      {/* Ambient halos */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 50% 40% at 50% 20%, ${C}0e 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 40% 35% at 30% 80%, ${QATAR}10 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", zIndex: 2 }}>
        {/* Header — centered */}
        <div style={{ textAlign: "center", marginBottom: "clamp(32px, 4vw, 52px)" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 22 }}
          >
            <span style={{ width: 26, height: 1, background: C, boxShadow: `0 0 8px ${C}66` }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "4.5px",
                textTransform: "uppercase",
                color: C_BRIGHT,
              }}
            >
              Key Industry Sectors · 11 Represented
            </span>
            <span style={{ width: 26, height: 1, background: C, boxShadow: `0 0 8px ${C}66` }} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(26px, 3.6vw, 44px)",
              letterSpacing: "-1.6px",
              lineHeight: 1.06,
              color: "white",
              margin: "0 auto",
              maxWidth: 760,
            }}
          >
            The sectors shaping Qatar&apos;s{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>connected economy.</em>
          </motion.h2>
        </div>

        {/* Honeycomb — 4 / 3 / 4 = 11 */}
        <div
          className="cfq-hex-grid"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {[
            [0, 1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10],
          ].map((row, rowIdx) => (
            <div
              key={`row-${rowIdx}`}
              className="cfq-hex-row"
              style={{
                display: "flex",
                gap: "clamp(6px, 0.7vw, 12px)",
                justifyContent: "center",
                marginTop: rowIdx === 0 ? 0 : "clamp(-44px, -3.4vw, -34px)",
              }}
            >
              {row.map((idx, colIdx) => {
                const s = SECTORS[idx];
                const tone = idx % 2 === 0 ? C : QATAR;
                const toneBright = idx % 2 === 0 ? C_BRIGHT : QATAR_BRIGHT;
                const toneDeep = idx % 2 === 0 ? C_DEEP : QATAR;
                return (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: 0.18 + rowIdx * 0.08 + colIdx * 0.04,
                      ease: EASE,
                    }}
                    className="cfq-hex"
                    style={{
                      width: "clamp(120px, 11.5vw, 158px)",
                      aspectRatio: "1 / 1.1547",
                      position: "relative",
                      flexShrink: 0,
                      ['--hex-tone' as string]: tone,
                      ['--hex-tone-bright' as string]: toneBright,
                      ['--hex-tone-deep' as string]: toneDeep,
                    }}
                  >
                    {/* Gradient border hex */}
                    <div
                      aria-hidden
                      className="cfq-hex-border"
                      style={{
                        background: `linear-gradient(140deg, ${tone}80 0%, ${tone}30 35%, rgba(255,255,255,0.08) 70%, ${tone}55 100%)`,
                      }}
                    />
                    {/* Inner hex */}
                    <div
                      className="cfq-hex-inner"
                      style={{
                        background: `linear-gradient(160deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%)`,
                      }}
                    >
                      {/* Subtle inner shine */}
                      <div
                        aria-hidden
                        className="cfq-hex-shine"
                        style={{
                          background: `radial-gradient(ellipse 70% 50% at 50% 15%, ${tone}1c 0%, transparent 70%)`,
                        }}
                      />

                      {/* Icon */}
                      <span
                        className="cfq-hex-icon"
                        aria-hidden
                        style={{
                          background: `linear-gradient(135deg, ${tone}28 0%, ${tone}0c 100%)`,
                          border: `1px solid ${tone}55`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.3)`,
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={toneBright}
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d={s.icon} />
                        </svg>
                      </span>

                      {/* Label */}
                      <span className="cfq-hex-label">{s.short}</span>

                      {/* Index */}
                      <span
                        className="cfq-hex-index"
                        style={{ color: toneBright }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Mobile fallback — pill cloud */}
        <div className="cfq-sectors-pills">
          {SECTORS.map((s, i) => {
            const tone = i % 2 === 0 ? C : QATAR;
            const toneBright = i % 2 === 0 ? C_BRIGHT : QATAR_BRIGHT;
            return (
              <div
                key={`pill-${s.name}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: `linear-gradient(135deg, ${tone}1a 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${tone}40`,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={toneBright} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1px" }}>
                  {s.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .cfq-hex {
          cursor: default;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), filter 0.5s ease;
        }
        .cfq-hex-border,
        .cfq-hex-inner,
        .cfq-hex-shine {
          position: absolute;
          inset: 0;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
        .cfq-hex-inner {
          inset: 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 12px;
          overflow: hidden;
        }
        .cfq-hex-shine {
          pointer-events: none;
          transition: opacity 0.5s ease;
        }
        .cfq-hex-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.5s cubic-bezier(0.22,1,0.36,1);
          position: relative;
          z-index: 2;
        }
        .cfq-hex-label {
          font-family: var(--font-outfit);
          font-size: clamp(10.5px, 0.85vw, 11.5px);
          font-weight: 600;
          color: rgba(255,255,255,0.88);
          letter-spacing: 0.3px;
          text-align: center;
          line-height: 1.2;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        .cfq-hex-index {
          font-family: var(--font-display);
          font-size: 8.5px;
          font-weight: 700;
          font-style: italic;
          letter-spacing: 0.5px;
          opacity: 0.6;
          position: absolute;
          top: 11px;
          right: 14px;
          z-index: 2;
        }
        .cfq-hex:hover {
          transform: translateY(-4px) scale(1.03);
          z-index: 5;
        }
        .cfq-hex:hover .cfq-hex-border {
          background: linear-gradient(140deg, var(--hex-tone-bright) 0%, var(--hex-tone) 50%, var(--hex-tone-deep) 100%) !important;
        }
        .cfq-hex:hover .cfq-hex-icon {
          background: linear-gradient(135deg, var(--hex-tone) 0%, var(--hex-tone-bright) 100%) !important;
          border-color: var(--hex-tone-bright) !important;
          box-shadow: 0 0 24px var(--hex-tone), inset 0 1px 0 rgba(255,255,255,0.25) !important;
          transform: scale(1.08);
        }
        .cfq-hex:hover .cfq-hex-icon svg {
          stroke: white !important;
        }
        .cfq-hex:hover .cfq-hex-shine {
          opacity: 1.6;
        }

        .cfq-sectors-pills {
          display: none;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        @media (max-width: 880px) {
          .cfq-hex-grid {
            display: none !important;
          }
          .cfq-sectors-pills {
            display: flex !important;
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// ADVISORS
// ───────────────────────────────────────────────────────────────────────────
function Advisors() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="advisors"
      style={{
        position: "relative",
        padding: "clamp(24px, 3vw, 38px) 0 clamp(48px, 5.5vw, 76px)",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${C}10 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <BgDots opacity={0.04} />

      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <Eyebrow inView={inView} label="Advisory Board" tone="gold" />

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 50px)",
            letterSpacing: "-1.8px",
            lineHeight: 1.04,
            color: "white",
            margin: "0 0 clamp(36px, 4vw, 54px)",
            maxWidth: 920,
          }}
        >
          Shaped by leaders who run{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: GOLD }}>the security functions.</em>
        </motion.h2>

        <div
          className="cfq-advisors-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(18px, 2vw, 28px)",
          }}
        >
          {ADVISORS.map((a, i) => {
            const initials = a.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
            return (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: EASE }}
                className="cfq-advisor-card"
                style={{
                  position: "relative",
                  borderRadius: 20,
                  overflow: "hidden",
                  background: `linear-gradient(180deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%)`,
                  border: `1px solid ${GOLD}2e`,
                  boxShadow: `0 22px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)`,
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.5s ease, box-shadow 0.5s ease",
                }}
              >
                {/* PHOTO / INITIALS — top, full-bleed, 1:1 aspect for a more compact card */}
                <div
                  className="cfq-advisor-photo-frame"
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    background: a.photo
                      ? `linear-gradient(135deg, ${GOLD}40 0%, ${C}25 100%)`
                      : `linear-gradient(135deg, ${GOLD}33 0%, ${C}1c 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {a.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.photo}
                      alt={`${a.name}, ${a.title} at ${a.org}`}
                      loading="lazy"
                      className="cfq-advisor-photo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center 18%",
                        display: "block",
                        transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  ) : (
                    <>
                      {/* Subtle gold halo for initials backdrop */}
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: "20% 18% 24% 18%",
                          borderRadius: "50%",
                          background: `radial-gradient(circle, ${GOLD}22 0%, transparent 70%)`,
                          filter: "blur(20px)",
                          pointerEvents: "none",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "clamp(56px, 6vw, 84px)",
                          letterSpacing: "-2.5px",
                          color: GOLD,
                          textShadow: `0 0 24px ${GOLD}66, 0 4px 18px rgba(0,0,0,0.5)`,
                          lineHeight: 1,
                          position: "relative",
                        }}
                      >
                        {initials}
                      </span>
                    </>
                  )}

                  {/* Bottom fade — keeps the gradient transition into the info block clean */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 60,
                      background: `linear-gradient(180deg, transparent 0%, rgba(4,8,24,0.45) 100%)`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Top accent hairline */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 0, left: "10%", right: "10%",
                      height: 1,
                      background: `linear-gradient(90deg, transparent, ${GOLD}cc, transparent)`,
                      boxShadow: `0 0 14px ${GOLD}66`,
                    }}
                  />

                  {/* Floating LinkedIn chip — bottom-right of photo */}
                  {a.linkedin && (
                    <a
                      href={a.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${a.name} on LinkedIn`}
                      className="cfq-advisor-li"
                      style={{
                        position: "absolute",
                        right: 12,
                        bottom: 12,
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.94)",
                        color: BG_DEEP,
                        backdropFilter: "blur(6px)",
                        boxShadow: `0 6px 18px rgba(0,0,0,0.35), 0 0 18px ${GOLD}33`,
                        textDecoration: "none",
                        transition: "background 0.28s ease, color 0.28s ease, transform 0.28s ease",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* INFO BLOCK — below the photo */}
                <div
                  style={{
                    padding: "clamp(16px, 1.7vw, 22px) clamp(18px, 1.9vw, 24px) clamp(18px, 1.9vw, 22px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    flex: 1,
                  }}
                >
                  {/* Name */}
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(16px, 1.4vw, 19px)",
                      fontWeight: 700,
                      letterSpacing: "-0.4px",
                      color: "white",
                      lineHeight: 1.2,
                      margin: 0,
                    }}
                  >
                    {a.name}
                  </h3>

                  {/* Title */}
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.78)",
                      lineHeight: 1.4,
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {a.title}
                  </p>

                  {/* Org — gold tag with hairline */}
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 4 }}>
                    <span aria-hidden style={{ width: 16, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, boxShadow: `0 0 8px ${GOLD}66` }} />
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: GOLD,
                    }}>
                      {a.org}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .cfq-advisor-card:hover {
          transform: translateY(-5px);
          border-color: ${GOLD}66 !important;
          box-shadow: 0 30px 64px rgba(0,0,0,0.6), 0 0 60px ${GOLD}22, inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }
        .cfq-advisor-card:hover .cfq-advisor-photo {
          transform: scale(1.05);
        }
        .cfq-advisor-li:hover {
          background: ${GOLD} !important;
          color: white !important;
          transform: translateY(-1px) scale(1.06);
        }
        @media (max-width: 980px) {
          .cfq-advisors-grid {
            grid-template-columns: 1fr !important;
            max-width: 540px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// SPEAKERS — named individuals (cyan accent, mirrors the advisory card)
// ───────────────────────────────────────────────────────────────────────────
function Speakers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="speakers"
      style={{
        position: "relative",
        padding: "clamp(24px, 3vw, 38px) 0 clamp(48px, 5.5vw, 76px)",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${C}10 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <BgDots opacity={0.04} />

      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <Eyebrow inView={inView} label="Speakers" tone="cyan" />

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 50px)",
            letterSpacing: "-1.8px",
            lineHeight: 1.04,
            color: "white",
            margin: "0 0 clamp(36px, 4vw, 54px)",
            maxWidth: 920,
          }}
        >
          The voices on{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C }}>the Qatar stage.</em>
        </motion.h2>

        <div
          className="cfq-speakers-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(18px, 2vw, 28px)",
            maxWidth: 840,
            margin: "0 auto",
          }}
        >
          {CFQ_SPEAKERS.map((a, i) => {
            const initials = a.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
            return (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: EASE }}
                className="cfq-speaker-card"
                style={{
                  position: "relative",
                  borderRadius: 20,
                  overflow: "hidden",
                  background: `linear-gradient(180deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%)`,
                  border: `1px solid ${C}2e`,
                  boxShadow: `0 22px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)`,
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.5s ease, box-shadow 0.5s ease",
                }}
              >
                {/* PHOTO / INITIALS — top, full-bleed, 1:1 aspect */}
                <div
                  className="cfq-speaker-photo-frame"
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    background: a.photo
                      ? `linear-gradient(135deg, ${C}40 0%, ${QATAR}25 100%)`
                      : `linear-gradient(135deg, ${C}33 0%, ${QATAR}1c 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {a.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.photo}
                      alt={`${a.name}, ${a.title} at ${a.org}`}
                      loading="lazy"
                      className="cfq-speaker-photo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center 18%",
                        display: "block",
                        transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  ) : (
                    <>
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: "20% 18% 24% 18%",
                          borderRadius: "50%",
                          background: `radial-gradient(circle, ${C}22 0%, transparent 70%)`,
                          filter: "blur(20px)",
                          pointerEvents: "none",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "clamp(56px, 6vw, 84px)",
                          letterSpacing: "-2.5px",
                          color: C,
                          textShadow: `0 0 24px ${C}66, 0 4px 18px rgba(0,0,0,0.5)`,
                          lineHeight: 1,
                          position: "relative",
                        }}
                      >
                        {initials}
                      </span>
                    </>
                  )}

                  {/* Bottom fade */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 60,
                      background: `linear-gradient(180deg, transparent 0%, rgba(4,8,24,0.45) 100%)`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Top accent hairline */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 0, left: "10%", right: "10%",
                      height: 1,
                      background: `linear-gradient(90deg, transparent, ${C}cc, transparent)`,
                      boxShadow: `0 0 14px ${C}66`,
                    }}
                  />

                  {/* Floating LinkedIn chip — bottom-right of photo */}
                  {a.linkedin && (
                    <a
                      href={a.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${a.name} on LinkedIn`}
                      className="cfq-speaker-li"
                      style={{
                        position: "absolute",
                        right: 12,
                        bottom: 12,
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.94)",
                        color: BG_DEEP,
                        backdropFilter: "blur(6px)",
                        boxShadow: `0 6px 18px rgba(0,0,0,0.35), 0 0 18px ${C}33`,
                        textDecoration: "none",
                        transition: "background 0.28s ease, color 0.28s ease, transform 0.28s ease",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* INFO BLOCK — below the photo */}
                <div
                  style={{
                    padding: "clamp(16px, 1.7vw, 22px) clamp(18px, 1.9vw, 24px) clamp(18px, 1.9vw, 22px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(16px, 1.4vw, 19px)",
                      fontWeight: 700,
                      letterSpacing: "-0.4px",
                      color: "white",
                      lineHeight: 1.2,
                      margin: 0,
                    }}
                  >
                    {a.name}
                  </h3>

                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.78)",
                      lineHeight: 1.4,
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {a.title}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 4 }}>
                    <span aria-hidden style={{ width: 16, height: 1, background: `linear-gradient(90deg, ${C}, transparent)`, boxShadow: `0 0 8px ${C}66` }} />
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: C,
                    }}>
                      {a.org}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .cfq-speaker-card:hover {
          transform: translateY(-5px);
          border-color: ${C}66 !important;
          box-shadow: 0 30px 64px rgba(0,0,0,0.6), 0 0 60px ${C}22, inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }
        .cfq-speaker-card:hover .cfq-speaker-photo {
          transform: scale(1.05);
        }
        .cfq-speaker-li:hover {
          background: ${C} !important;
          color: white !important;
          transform: translateY(-1px) scale(1.06);
        }
        @media (max-width: 980px) {
          .cfq-speakers-grid {
            grid-template-columns: 1fr !important;
            max-width: 300px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// PAST SERIES SPONSORS & PARTNERS — dual marquee
// ───────────────────────────────────────────────────────────────────────────
function PastSeriesSponsors() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="past-series-sponsors"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0",
        background: BG_BASE,
        overflow: "hidden",
      }}
    >
      {/* Ambient glow halos */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 40% at 50% 30%, ${C}0e 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 40% 35% at 80% 70%, ${QATAR}10 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <BgDots opacity={0.035} />

      <div style={{ position: "relative", maxWidth: 1520, margin: "0 auto", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "clamp(28px, 3vw, 40px)", padding: "0 clamp(24px, 5vw, 80px)" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${C}99)`, boxShadow: `0 0 8px ${C}55` }} />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "4.5px",
                textTransform: "uppercase",
                color: C_BRIGHT,
              }}
            >
              Past Series Sponsors & Partners
            </span>
            <span style={{ width: 32, height: 1, background: `linear-gradient(270deg, transparent, ${C}99)`, boxShadow: `0 0 8px ${C}55` }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(26px, 3.4vw, 42px)",
              letterSpacing: "-1.4px",
              lineHeight: 1.08,
              color: "white",
              margin: "8px 0 14px",
            }}
          >
            Trusted by the security{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>vendor ecosystem.</em>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(14px, 1.1vw, 16px)",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6,
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            A snapshot of the global technology leaders and security vendors who have partnered with the Cyber First series.
          </p>
        </motion.div>

        {/* Marquee container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          style={{ position: "relative" }}
        >
          {/* Edge fades */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0, top: 0, bottom: 0,
              width: "clamp(60px, 10vw, 120px)",
              background: `linear-gradient(to right, ${BG_BASE} 0%, transparent 100%)`,
              zIndex: 3,
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              right: 0, top: 0, bottom: 0,
              width: "clamp(60px, 10vw, 120px)",
              background: `linear-gradient(to left, ${BG_BASE} 0%, transparent 100%)`,
              zIndex: 3,
              pointerEvents: "none",
            }}
          />

          {/* Row 1 — scroll left */}
          <div className="cfq-marquee-track" style={{ marginBottom: 22 }}>
            <div
              className="cfq-marquee-inner cfq-scroll-left"
              style={{ animationDuration: "70s" }}
            >
              {[...CFQ_MARQUEE_ROW_1, ...CFQ_MARQUEE_ROW_1].map((logo, i) => (
                <div
                  key={`cfq-r1-${i}`}
                  style={{
                    width: 180,
                    height: 64,
                    margin: "0 clamp(18px, 2.5vw, 36px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.6,
                    flexShrink: 0,
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

          {/* Row 2 — scroll right */}
          <div className="cfq-marquee-track">
            <div
              className="cfq-marquee-inner cfq-scroll-right"
              style={{ animationDuration: "80s" }}
            >
              {[...CFQ_MARQUEE_ROW_2, ...CFQ_MARQUEE_ROW_2].map((logo, i) => (
                <div
                  key={`cfq-r2-${i}`}
                  style={{
                    width: 180,
                    height: 64,
                    margin: "0 clamp(18px, 2.5vw, 36px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.6,
                    flexShrink: 0,
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
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          style={{ textAlign: "center", marginTop: "clamp(28px, 3vw, 40px)" }}
        >
          <a
            href="#enquire"
            onClick={(e) => { e.preventDefault(); document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" }); }}
            className="cfq-partner-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 600,
              color: C_BRIGHT,
              textDecoration: "none",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              padding: "10px 22px",
              borderRadius: 999,
              border: `1px solid ${C}33`,
              background: `${C}0a`,
              transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
              cursor: "pointer",
            }}
          >
            Become a Partner
            <span aria-hidden style={{ fontSize: 14 }}>→</span>
          </a>
        </motion.div>
      </div>

      <style jsx global>{`
        .cfq-marquee-track {
          overflow: hidden;
          width: 100%;
        }
        .cfq-marquee-inner {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .cfq-scroll-left {
          animation: cfqScrollLeft linear infinite;
        }
        .cfq-scroll-right {
          animation: cfqScrollRight linear infinite;
        }
        @keyframes cfqScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes cfqScrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .cfq-partner-cta:hover {
          color: white !important;
          border-color: ${C}80 !important;
          background: ${C}1f !important;
          box-shadow: 0 0 24px ${C}33, inset 0 1px 0 rgba(255,255,255,0.08);
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// TESTIMONIALS — From the Room (CF series vertical shorts)
// ───────────────────────────────────────────────────────────────────────────
function CfqShortCard({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      role={playing ? undefined : "button"}
      tabIndex={playing ? undefined : 0}
      aria-label={playing ? undefined : `Play testimonial: ${title}`}
      onClick={() => !playing && setPlaying(true)}
      onKeyDown={(e) => { if (!playing && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setPlaying(true); } }}
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
            width={360}
            height={640}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(2,5,14,0.1) 0%, rgba(2,5,14,0.1) 55%, rgba(2,5,14,0.6) 100%)", pointerEvents: "none" }} />

          {/* Play button — single liquid glass dome */}
          <div
            className="cfq-short-play"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 28%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.06) 75%, rgba(255,255,255,0.14) 100%)`,
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.35)",
              boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.18), 0 12px 36px rgba(0,0,0,0.5), 0 0 18px rgba(255,255,255,0.06)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {/* Top crescent reflection — the signature liquid glass highlight */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 2,
                left: "14%",
                right: "14%",
                height: "42%",
                borderRadius: "50%",
                background: `radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.15) 50%, transparent 80%)`,
                pointerEvents: "none",
              }}
            />
            {/* Bottom inner curvature shadow */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0,
                left: "12%",
                right: "12%",
                height: "45%",
                borderRadius: "50%",
                background: `radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.2) 0%, transparent 65%)`,
                pointerEvents: "none",
              }}
            />
            {/* Bottom rim light bounce */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                bottom: 3,
                left: "32%",
                right: "32%",
                height: 3,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.4)",
                filter: "blur(2px)",
                pointerEvents: "none",
              }}
            />

            {/* Triangle */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="white"
              style={{
                marginLeft: 2.5,
                position: "relative",
                zIndex: 2,
                filter: "drop-shadow(0 1.5px 3px rgba(0,0,0,0.5))",
              }}
            >
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
              fontFamily: "var(--font-outfit)",
              fontSize: 8,
              fontWeight: 700,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              backdropFilter: "blur(8px)",
            }}>Cyber First</span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Series highlights — UAE + Kuwait edition videos (moved out of Overview) ──
function SeriesHighlights() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="series-highlights"
      style={{
        position: "relative",
        padding: "clamp(8px, 1.2vw, 16px) 0",
        margin: "clamp(-48px, -4vw, -28px) 0",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs — match Testimonials */}
      <div aria-hidden style={{ position: "absolute", top: "18%", left: "-5%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${C}10 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "12%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${QATAR}0e 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />
      <BgDots opacity={0.035} />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "clamp(28px, 3.5vw, 44px)" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <span style={{ width: 26, height: 1, background: C, boxShadow: `0 0 8px ${C}66` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "4.5px", textTransform: "uppercase", color: C_BRIGHT }}>
              From the Series
            </span>
            <span style={{ width: 26, height: 1, background: C, boxShadow: `0 0 8px ${C}66` }} />
          </div>

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 50px)", letterSpacing: "-1.8px", lineHeight: 1.04, color: "white", margin: "0 0 12px" }}>
            Highlights from{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>past editions.</em>
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
            style={{ width: 120, height: 3, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, transparent)`, margin: "0 auto 16px", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px ${C}80` }}
          />

          <p style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(14px, 1.1vw, 16px)", color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
            Relive the energy from Cyber First editions across the region.
          </p>
        </motion.div>

        {/* 2-up video grid — UAE + Kuwait */}
        <div className="cfq-series-hl-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "clamp(16px, 2vw, 26px)", maxWidth: 920, margin: "0 auto" }}>
          <CfqHighlightCard videoId="AsrScRfgLpA" edition="Cyber First · UAE" location="UAE" inView={inView} index={0} />
          <CfqHighlightCard videoId="wcEeU0UEl0o" edition="Cyber First · Kuwait" location="Kuwait" inView={inView} index={1} />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 720px) {
          .cfq-series-hl-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="testimonials"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "20%",
          right: "-5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C}10 0%, transparent 70%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "15%",
          left: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${QATAR}0e 0%, transparent 70%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <BgDots opacity={0.035} />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "clamp(28px, 3.5vw, 44px)" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <span style={{ width: 26, height: 1, background: C, boxShadow: `0 0 8px ${C}66` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "4.5px", textTransform: "uppercase", color: C_BRIGHT }}>
              Testimonials
            </span>
            <span style={{ width: 26, height: 1, background: C, boxShadow: `0 0 8px ${C}66` }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 50px)",
              letterSpacing: "-1.8px",
              lineHeight: 1.04,
              color: "white",
              margin: "0 0 12px",
            }}
          >
            Hear it from{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>the room.</em>
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
            style={{
              width: 120,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, transparent)`,
              margin: "0 auto 14px",
              borderRadius: 2,
              transformOrigin: "center",
              boxShadow: `0 0 12px ${C}80`,
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              fontSize: "clamp(14px, 1.1vw, 16px)",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.3px",
              margin: 0,
            }}
          >
            Hear directly from cybersecurity leaders who attended past Cyber First summits.
          </p>
        </motion.div>

        {/* Staggered showcase — 6 vertical shorts, center hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="cfq-testi-showcase"
        >
          {CFQ_SHORTS.map((v, i) => (
            <div
              key={v.id}
              className={`cfq-testi-slot cfq-testi-slot-${i % 2 === 0 ? "tall" : "short"} ${i === 2 ? "cfq-testi-slot-hero" : ""}`}
            >
              {/* Skeumorphic outer bezel */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  padding: 3,
                  borderRadius: 22,
                  background: `linear-gradient(145deg, rgba(${i % 2 === 0 ? "77,212,255" : "184,58,95"},0.18) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 70%, rgba(${i % 2 === 0 ? "184,58,95" : "77,212,255"},0.12) 100%)`,
                  boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 -2px 0 rgba(0,0,0,0.3) inset, 0 14px 44px rgba(0,0,0,0.45)`,
                }}
              >
                {/* Inner recessed panel */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 19,
                    overflow: "hidden",
                    background: `linear-gradient(180deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%)`,
                    border: "1px solid rgba(255,255,255,0.04)",
                    boxShadow: `inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.03)`,
                    position: "relative",
                  }}
                >
                  {/* Glass reflection */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "8%",
                      right: "8%",
                      height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                      zIndex: 3,
                      pointerEvents: "none",
                    }}
                  />
                  <CfqShortCard videoId={v.id} title={v.title} />
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
          style={{ textAlign: "center", marginTop: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}
        >
          <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${C}55)` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11.5, color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase" }}>
            6 Voices · Cyber First Series
          </span>
          <div style={{ width: 32, height: 1, background: `linear-gradient(270deg, transparent, ${C}55)` }} />
        </motion.div>
      </div>

      <style jsx global>{`
        .cfq-testi-showcase {
          display: flex;
          gap: 14px;
          align-items: center;
          justify-content: center;
        }
        .cfq-testi-slot {
          flex-shrink: 0;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .cfq-testi-slot:hover {
          transform: translateY(-6px);
        }
        .cfq-testi-slot-tall {
          width: 200px;
          height: 340px;
        }
        .cfq-testi-slot-short {
          width: 180px;
          height: 270px;
        }
        .cfq-testi-slot-hero.cfq-testi-slot-tall {
          width: 220px;
          height: 380px;
        }
        .cfq-testi-slot:hover .cfq-short-play {
          transform: translate(-50%, -50%) scale(1.08) !important;
          background: radial-gradient(circle at 35% 28%, rgba(1,187,245,0.5) 0%, rgba(1,187,245,0.22) 45%, rgba(1,187,245,0.1) 75%, rgba(1,187,245,0.22) 100%) !important;
          border-color: ${C_BRIGHT} !important;
          box-shadow:
            inset 0 1.5px 0 rgba(255,255,255,0.55),
            inset 0 -1px 0 rgba(0,0,0,0.18),
            0 12px 40px rgba(0,0,0,0.55),
            0 0 32px ${C}66,
            0 0 0 0.5px ${C_BRIGHT}88 !important;
        }

        @media (max-width: 980px) {
          .cfq-testi-showcase {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            justify-content: flex-start;
            padding: 0 clamp(16px, 4vw, 40px) 8px;
            gap: 12px;
          }
          .cfq-testi-showcase::-webkit-scrollbar { display: none; }
          .cfq-testi-slot-tall { width: 150px; height: 250px; }
          .cfq-testi-slot-short { width: 135px; height: 200px; }
          .cfq-testi-slot-hero.cfq-testi-slot-tall { width: 165px; height: 280px; }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// AGENDA
// ───────────────────────────────────────────────────────────────────────────
function Agenda() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const typeStyle = (type: AgendaRow["type"]) => {
    switch (type) {
      case "keynote":   return { tag: "Keynote",            color: C_BRIGHT };
      case "panel":     return { tag: "Panel",              color: C };
      case "fireside":  return { tag: "Fireside",           color: C_BRIGHT };
      case "sponsor":   return { tag: "Tech Partner",       color: "#9DA8B8" };
      case "break":     return { tag: "Break",              color: "rgba(255,255,255,0.4)" };
      case "welcome":   return { tag: "Welcome",            color: QATAR_BRIGHT };
      case "awards":    return { tag: "Awards & Raffle",    color: GOLD };
      case "closing":   return { tag: "Closing",            color: QATAR_BRIGHT };
      case "logistics": return { tag: "Logistics",          color: "rgba(255,255,255,0.5)" };
    }
  };

  // Single agenda row renderer — used by both columns
  const renderRow = (row: AgendaRow, i: number, delay: number) => {
    const ts = typeStyle(row.type);
    const isFeatured = row.type === "panel" || row.type === "keynote" || row.type === "awards" || row.type === "fireside";
    const isMinimal = row.type === "break" || row.type === "logistics" || row.type === "closing" || row.type === "welcome";
    return (
      <motion.li
        key={`${i}-${row.start}`}
        initial={{ opacity: 0, x: -10 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45, delay, ease: EASE }}
        style={{
          position: "relative",
          paddingLeft: 44,
          paddingBlock: isFeatured ? 14 : isMinimal ? 10 : 12,
          paddingRight: 16,
          borderRadius: 12,
          background: isFeatured
            ? `linear-gradient(170deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%)`
            : isMinimal
              ? "transparent"
              : "rgba(255,255,255,0.025)",
          border: `1px solid ${isFeatured ? `${ts.color}30` : isMinimal ? "transparent" : "rgba(255,255,255,0.05)"}`,
        }}
      >
        {/* Node dot */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 13,
            top: isFeatured ? 20 : isMinimal ? 16 : 17,
            width: isFeatured ? 9 : 7,
            height: isFeatured ? 9 : 7,
            borderRadius: "50%",
            background: ts.color,
            boxShadow: `0 0 ${isFeatured ? 10 : 6}px ${ts.color}, 0 0 0 ${isFeatured ? 3 : 2}px ${BG_BASE}`,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: isFeatured ? 14 : 13,
                fontWeight: 700,
                color: isMinimal ? "rgba(255,255,255,0.55)" : "white",
                letterSpacing: "-0.2px",
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
              }}
            >
              {row.start}<span style={{ color: "rgba(255,255,255,0.35)" }}> – </span>{row.end}
            </span>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: ts.color,
                flexShrink: 0,
              }}
            >
              {ts.tag}
            </span>
          </div>

          <span
            style={{
              fontFamily: isFeatured ? "var(--font-display)" : "var(--font-outfit)",
              fontSize: isFeatured ? "clamp(15px, 1.15vw, 16.5px)" : isMinimal ? 13.5 : 14.5,
              fontWeight: isFeatured ? 600 : 500,
              color: isMinimal ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.94)",
              letterSpacing: "-0.15px",
              lineHeight: 1.32,
            }}
          >
            {row.segment}
          </span>

          {row.bullets && row.bullets.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
              {row.bullets.map((b) => (
                <span
                  key={b}
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.78)",
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: `${ts.color}12`,
                    border: `1px solid ${ts.color}30`,
                    letterSpacing: "0.05px",
                    lineHeight: 1.45,
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.li>
    );
  };

  // Split the agenda at 12:00 — everything from 12:00 onwards goes into afternoon
  const SPLIT_IDX = 10;
  const morningRows = AGENDA.slice(0, SPLIT_IDX);
  const afternoonRows = AGENDA.slice(SPLIT_IDX);

  return (
    <section
      ref={ref}
      id="agenda"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <BgDots opacity={0.035} />

      {/* Ambient halos */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 50% 40% at 20% 30%, ${C}0e 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 40% 35% at 85% 70%, ${QATAR}0e 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", zIndex: 2 }}>
        {/* Header */}
        <div style={{ marginBottom: "clamp(28px, 3.5vw, 44px)", maxWidth: 920 }}>
          <Eyebrow inView={inView} label="Agenda · 10 November 2026" />

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 50px)",
              letterSpacing: "-1.8px",
              lineHeight: 1.04,
              color: "white",
              margin: 0,
            }}
          >
            One day. Four panels.{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>A full programme.</em>
          </motion.h2>
        </div>

        {/* 2-col agenda — morning | afternoon */}
        <div
          className="cfq-agenda-split"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(28px, 3vw, 44px)",
            alignItems: "start",
          }}
        >
          {/* MORNING */}
          <div className="cfq-agenda-col" style={{ position: "relative" }}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16, paddingLeft: 4 }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: C_BRIGHT, letterSpacing: "3px", textTransform: "uppercase" }}>
                Morning
              </span>
              <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C}55, transparent)` }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.55)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.5px" }}>
                08:00 – 12:00
              </span>
            </motion.div>

            {/* Vertical rail */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 17,
                top: 52,
                bottom: 8,
                width: 1,
                background: `linear-gradient(180deg, transparent 0%, ${C}45 8%, ${C}45 92%, transparent 100%)`,
              }}
            />

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
              {morningRows.map((row, i) => renderRow(row, i, 0.1 + i * 0.025))}
            </ul>
          </div>

          {/* AFTERNOON */}
          <div className="cfq-agenda-col" style={{ position: "relative" }}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
              style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16, paddingLeft: 4 }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: QATAR_BRIGHT, letterSpacing: "3px", textTransform: "uppercase" }}>
                Afternoon
              </span>
              <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${QATAR}55, transparent)` }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.55)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.5px" }}>
                12:00 – onwards
              </span>
            </motion.div>

            {/* Vertical rail */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 17,
                top: 52,
                bottom: 8,
                width: 1,
                background: `linear-gradient(180deg, transparent 0%, ${QATAR}55 8%, ${QATAR}55 92%, transparent 100%)`,
              }}
            />

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
              {afternoonRows.map((row, i) => renderRow(row, i, 0.2 + i * 0.025))}
            </ul>
          </div>
        </div>

        {/* Draft note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
          style={{
            marginTop: 28,
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(255,255,255,0.5)",
            fontStyle: "italic",
            letterSpacing: "0.05em",
            textAlign: "center",
          }}
        >
          Please note: this is a draft agenda and is subject to change.
        </motion.p>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .cfq-agenda-split {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// GALLERY — editorial mosaic (1 hero + 5 tiles)
// ───────────────────────────────────────────────────────────────────────────
function GallerySection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const hero = CFQ_GALLERY[0];
  const tiles = CFQ_GALLERY.slice(1);

  return (
    <section
      ref={ref}
      id="gallery"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* Ambient halos */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 55% 40% at 25% 25%, ${C}0c 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 45% 40% at 80% 80%, ${QATAR}10 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <BgDots opacity={0.035} />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", zIndex: 2 }}>
        {/* Header */}
        <div style={{ marginBottom: "clamp(28px, 3vw, 40px)", maxWidth: 920 }}>
          <Eyebrow inView={inView} label="Atmosphere" tone="maroon" />

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 50px)",
              letterSpacing: "-1.8px",
              lineHeight: 1.04,
              color: "white",
              margin: 0,
            }}
          >
            From the floor of{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>past editions.</em>
          </motion.h2>
        </div>

        {/* HERO image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
          className="cfq-gallery-hero"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "21 / 9",
            borderRadius: 22,
            overflow: "hidden",
            padding: 3,
            background: `linear-gradient(135deg, ${C}30 0%, rgba(255,255,255,0.05) 35%, rgba(255,255,255,0.02) 65%, ${QATAR}30 100%)`,
            boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 -2px 0 rgba(0,0,0,0.3) inset, 0 26px 70px rgba(0,0,0,0.55)`,
            marginBottom: "clamp(14px, 1.4vw, 20px)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 19,
              overflow: "hidden",
              background: BG_DEEP,
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.src}
              alt={hero.alt}
              loading="lazy"
              className="cfq-gallery-img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 38%",
                transition: "transform 1.2s cubic-bezier(0.22,1,0.36,1)",
              }}
            />

            {/* Top shine */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: "8%",
                right: "8%",
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                zIndex: 3,
                pointerEvents: "none",
              }}
            />

            {/* Bottom gradient + caption overlay */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(180deg, rgba(2,5,14,0) 0%, rgba(2,5,14,0) 40%, rgba(2,5,14,0.45) 75%, rgba(2,5,14,0.92) 100%)`,
                pointerEvents: "none",
              }}
            />

            {/* Caption block — bottom-left */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "clamp(20px, 2.4vw, 32px)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 18,
                flexWrap: "wrap",
                zIndex: 4,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 560 }}>
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: C_BRIGHT,
                  }}
                >
                  Cyber First · Past Edition
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(18px, 1.8vw, 26px)",
                    color: "white",
                    letterSpacing: "-0.6px",
                    lineHeight: 1.18,
                    margin: 0,
                    textShadow: "0 2px 14px rgba(0,0,0,0.6)",
                  }}
                >
                  The room where regional security leaders converge.
                </h3>
              </div>

              {/* Liquid-glass count chip */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(16px) saturate(180%)",
                  WebkitBackdropFilter: "blur(16px) saturate(180%)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 24px rgba(0,0,0,0.35)`,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C_BRIGHT,
                    boxShadow: `0 0 8px ${C}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "white",
                  }}
                >
                  Cyber First Series
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TILES — 4-col asymmetric mosaic */}
        <div
          className="cfq-gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1.2fr 1fr",
            gridTemplateRows: "180px 180px",
            gap: "clamp(10px, 1.2vw, 16px)",
            gridTemplateAreas: `"a b c d" "a e c d"`,
          }}
        >
          {tiles.map((img, i) => {
            const area = ["a", "b", "e", "c", "d"][i];
            const tone = i % 2 === 0 ? C : QATAR;
            return (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: EASE }}
                className="cfq-gallery-tile"
                style={{
                  gridArea: area,
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  padding: 2,
                  background: `linear-gradient(145deg, ${tone}30 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.02) 75%, ${tone}22 100%)`,
                  boxShadow: `0 1px 0 rgba(255,255,255,0.04) inset, 0 -1.5px 0 rgba(0,0,0,0.3) inset, 0 14px 36px rgba(0,0,0,0.45)`,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: 14,
                    overflow: "hidden",
                    background: BG_DEEP,
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="cfq-gallery-img"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center 38%",
                      transition: "transform 1.1s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />

                  {/* Top hairline */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "10%",
                      right: "10%",
                      height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
                      zIndex: 3,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Bottom gradient overlay */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(180deg, rgba(2,5,14,0) 0%, rgba(2,5,14,0) 55%, rgba(2,5,14,0.78) 100%)`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Bottom-left label chip — liquid glass */}
                  {img.label && (
                    <div
                      style={{
                        position: "absolute",
                        left: 12,
                        bottom: 12,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "5px 12px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(12px) saturate(180%)",
                        WebkitBackdropFilter: "blur(12px) saturate(180%)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 14px rgba(0,0,0,0.35)`,
                        zIndex: 4,
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: tone === C ? C_BRIGHT : QATAR_BRIGHT,
                          boxShadow: `0 0 6px ${tone}`,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-outfit)",
                          fontSize: 9.5,
                          fontWeight: 700,
                          letterSpacing: "1.8px",
                          textTransform: "uppercase",
                          color: "white",
                        }}
                      >
                        {img.label}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .cfq-gallery-hero:hover .cfq-gallery-img,
        .cfq-gallery-tile:hover .cfq-gallery-img {
          transform: scale(1.05);
        }
        @media (max-width: 880px) {
          .cfq-gallery-grid {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: 160px 160px 160px !important;
            grid-template-areas: "a b" "a e" "c d" !important;
          }
        }
        @media (max-width: 560px) {
          .cfq-gallery-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: repeat(5, 180px) !important;
            grid-template-areas: "a" "b" "c" "d" "e" !important;
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// AWARDS — coming soon / hype teaser
// ───────────────────────────────────────────────────────────────────────────
function AwardsTeaser() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const GOLD_BRIGHT = "#E2C063";

  return (
    <section
      ref={ref}
      id="awards"
      style={{
        position: "relative",
        padding: "clamp(60px, 6.5vw, 96px) 0",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* Spotlight halo behind the trophy */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          width: 700,
          height: 700,
          marginLeft: -350,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD}18 0%, ${GOLD}06 35%, transparent 65%)`,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Ambient bottom orbs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-8%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C}0c 0%, transparent 70%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "15%",
          right: "-8%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${QATAR}0e 0%, transparent 70%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <BgDots opacity={0.04} />

      <div style={{ position: "relative", maxWidth: 1380, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", zIndex: 2, textAlign: "center" }}>
        {/* Trophy emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            display: "inline-flex",
            position: "relative",
            marginBottom: 28,
          }}
        >
          {/* Outer rotating glow ring */}
          <span
            aria-hidden
            className="cfq-awards-ring"
            style={{
              position: "absolute",
              inset: -22,
              borderRadius: "50%",
              background: `conic-gradient(from 0deg, ${GOLD}66, transparent 25%, ${GOLD}88 50%, transparent 75%, ${GOLD}66)`,
              filter: "blur(6px)",
              opacity: 0.7,
            }}
          />
          {/* Inner halo */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${GOLD}30 0%, transparent 70%)`,
              filter: "blur(12px)",
            }}
          />
          {/* Trophy disc */}
          <span
            className="cfq-awards-emblem"
            style={{
              position: "relative",
              width: 92,
              height: 92,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `radial-gradient(circle at 35% 25%, ${GOLD_BRIGHT} 0%, ${GOLD} 50%, #8E6E2E 100%)`,
              border: `1.5px solid ${GOLD_BRIGHT}`,
              boxShadow: `inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -2px 0 rgba(0,0,0,0.3), 0 18px 50px rgba(196,163,74,0.5), 0 0 0 1px rgba(255,255,255,0.08)`,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1a1206" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
            </svg>
          </span>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}
        >
          <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, boxShadow: `0 0 8px ${GOLD}66` }} />
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "4.5px",
              textTransform: "uppercase",
              color: GOLD_BRIGHT,
            }}
          >
            Awards & Recognition
          </span>
          <span style={{ width: 32, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD})`, boxShadow: `0 0 8px ${GOLD}66` }} />
        </motion.div>

        {/* Headline with shimmer on "Coming Soon" */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.25, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(30px, 4.4vw, 60px)",
            letterSpacing: "-2px",
            lineHeight: 1.05,
            color: "white",
            margin: "0 auto 18px",
            maxWidth: 880,
          }}
        >
          Cyber First Qatar Awards
          <br />
          <span
            className="cfq-awards-shimmer"
            style={{
              backgroundImage: `linear-gradient(110deg, ${GOLD} 0%, ${GOLD_BRIGHT} 25%, #FFE8B6 50%, ${GOLD_BRIGHT} 75%, ${GOLD} 100%)`,
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
            }}
          >
            Coming Soon
          </span>
        </motion.h2>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 300,
            fontSize: "clamp(15px, 1.2vw, 17px)",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.6)",
            margin: "0 auto clamp(36px, 4vw, 48px)",
            maxWidth: 620,
          }}
        >
          We&apos;re curating the categories that will recognise the people, programmes and partners shaping Qatar&apos;s cybersecurity future.{" "}
          <span style={{ color: GOLD_BRIGHT, fontWeight: 500 }}>Be the first to know when nominations open.</span>
        </motion.p>

        {/* Locked category tiles — 6 in one row */}
        <div
          className="cfq-awards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "clamp(8px, 1vw, 14px)",
            margin: "0 auto clamp(36px, 4vw, 48px)",
            width: "100%",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45 + n * 0.06, ease: EASE }}
              className="cfq-award-locked"
              style={{
                position: "relative",
                padding: "18px 14px 16px",
                borderRadius: 14,
                background: `linear-gradient(180deg, rgba(196,163,74,0.05) 0%, rgba(196,163,74,0.015) 100%)`,
                border: `1px solid ${GOLD}1f`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 9,
                minHeight: 144,
                textAlign: "left",
              }}
            >
              {/* Scanning shimmer */}
              <span
                aria-hidden
                className="cfq-award-scan"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(105deg, transparent 30%, ${GOLD}22 50%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Lock icon */}
              <span
                aria-hidden
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${GOLD}28 0%, ${GOLD}0c 100%)`,
                  border: `1px solid ${GOLD}45`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GOLD_BRIGHT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>

              {/* Category number */}
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "2.2px",
                  textTransform: "uppercase",
                  color: GOLD_BRIGHT,
                  opacity: 0.7,
                }}
              >
                Category {String(n).padStart(2, "0")}
              </span>

              {/* Blurred placeholder text — feels like content is being held back */}
              <div
                aria-hidden
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  width: "100%",
                  filter: "blur(5px)",
                  opacity: 0.4,
                  userSelect: "none",
                }}
              >
                <span style={{ display: "block", width: "82%", height: 11, borderRadius: 4, background: "rgba(255,255,255,0.6)" }} />
                <span style={{ display: "block", width: "65%", height: 11, borderRadius: 4, background: "rgba(255,255,255,0.5)" }} />
              </div>

              {/* "Reveal soon" stamp */}
              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  fontFamily: "var(--font-outfit)",
                  fontSize: 8.5,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: GOLD,
                  opacity: 0.7,
                }}
              >
                TBA
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA — notify me */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
        >
          <a
            href="#get-involved"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("efg:set-form-tab", { detail: "pass" }));
              document.getElementById("get-involved")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="cfq-awards-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 32px",
              borderRadius: 999,
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_BRIGHT} 100%)`,
              border: `1px solid ${GOLD_BRIGHT}`,
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#1a1206",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2), 0 14px 36px rgba(196,163,74,0.45), 0 0 0 1px rgba(255,255,255,0.08)`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1206" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Notify Me When Nominations Open
            <span aria-hidden style={{ fontSize: 15 }}>→</span>
          </a>

          {/* Sub-CTA pulse indicator */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span
              aria-hidden
              className="cfq-awards-pulse"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: GOLD_BRIGHT,
                boxShadow: `0 0 10px ${GOLD}`,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Categories Revealing Soon
            </span>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes cfqAwardsShimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        .cfq-awards-shimmer {
          animation: cfqAwardsShimmer 4.5s linear infinite;
        }

        @keyframes cfqAwardsRing {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .cfq-awards-ring {
          animation: cfqAwardsRing 14s linear infinite;
        }

        @keyframes cfqAwardsPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(1.35); }
        }
        .cfq-awards-pulse {
          animation: cfqAwardsPulse 1.8s ease-in-out infinite;
        }

        @keyframes cfqAwardScan {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .cfq-award-scan {
          animation: cfqAwardScan 4.5s ease-in-out infinite;
        }

        .cfq-awards-cta:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.2), 0 18px 44px rgba(196,163,74,0.6), 0 0 0 1px rgba(255,255,255,0.12) !important;
        }
      `}</style>

      <style jsx>{`
        @media (max-width: 1100px) {
          .cfq-awards-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .cfq-awards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 400px) {
          .cfq-awards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CONTACTS — Speaking & Sponsorship enquiries
// ───────────────────────────────────────────────────────────────────────────
function ContactsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  type Contact = {
    name: string;
    role: string;
    email: string;
    phone: string;
    phoneDigits: string;
    linkedin?: string;
    photo: string;
    tone: "cyan" | "maroon";
  };

  const speakingContact: Contact = {
    name: "Harini Sudhakar",
    role: "Senior Conference Producer",
    email: "harini@eventsfirstgroup.com",
    phone: "+971 54 571 4377",
    phoneDigits: "971545714377",
    linkedin: "https://www.linkedin.com/in/harini-sudhakar-8aa75b214/",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/Harini.jpg",
    tone: "cyan",
  };

  const sponsorshipContacts: Contact[] = [
    {
      name: "Mayur Methi",
      role: "Partnership Manager",
      email: "mayur@eventsfirstgroup.com",
      phone: "+971 54 571 4377",
      phoneDigits: "971545714377",
      photo: "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/Mayur-Methi.png",
      tone: "maroon",
    },
    {
      name: "Mohammed Danish",
      role: "Partnership Manager",
      email: "danish@eventsfirstgroup.com",
      phone: "+971 54 571 4377",
      phoneDigits: "971545714377",
      linkedin: "https://www.linkedin.com/in/mohammed-danish-018bb7262/",
      photo: "/team/danish.jpg",
      tone: "maroon",
    },
  ];

  const ContactCard = ({ c, label, delay }: { c: Contact; label: string; delay: number }) => {
    const tone = c.tone === "cyan" ? C : QATAR;
    const toneBright = c.tone === "cyan" ? C_BRIGHT : QATAR_BRIGHT;
    const initials = c.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, delay, ease: EASE }}
        className="cfq-concierge"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 340,
        }}
      >
        {/* Outer skeumorphic bezel — single tone gradient, matches Testimonials/Gallery pattern */}
        <div
          style={{
            position: "relative",
            padding: 3,
            borderRadius: 22,
            background: `linear-gradient(145deg, ${tone}50 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 70%, ${tone}26 100%)`,
            boxShadow: `0 1.5px 0 rgba(255,255,255,0.06) inset, 0 -2px 0 rgba(0,0,0,0.35) inset, 0 24px 60px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.04)`,
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: 19,
              background: `linear-gradient(180deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%)`,
              border: "1px solid rgba(255,255,255,0.04)",
              overflow: "hidden",
            }}
          >
            {/* Top reflection */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
                zIndex: 5,
              }}
            />

            {/* SQUARE PHOTO */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                background: `linear-gradient(135deg, ${tone}30 0%, ${BG_DEEP} 100%)`,
              }}
            >
              {/* Initials fallback — only visible when the photo fails to load */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 64,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: "-2px",
                  zIndex: 0,
                }}
              >
                {initials}
              </span>

              {c.photo && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={c.photo}
                  alt={`${c.name}, ${c.role}`}
                  loading="lazy"
                  className="cfq-concierge-photo"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 18%",
                    zIndex: 1,
                    transition: "transform 1s cubic-bezier(0.22,1,0.36,1), filter 0.8s ease",
                    filter: "saturate(1.05) contrast(1.06)",
                  }}
                />
              )}

              {/* Vignette + bottom fade into card body */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  boxShadow: "inset 0 0 70px rgba(0,0,0,0.45)",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(180deg, rgba(2,5,14,0.18) 0%, rgba(2,5,14,0) 30%, rgba(2,5,14,0) 60%, ${BG_ELEV} 100%)`,
                  pointerEvents: "none",
                  zIndex: 3,
                }}
              />

              {/* Liquid glass label chip — top-right */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 11px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(14px) saturate(180%)",
                  WebkitBackdropFilter: "blur(14px) saturate(180%)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 16px rgba(0,0,0,0.35)`,
                  zIndex: 4,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: toneBright,
                    boxShadow: `0 0 8px ${tone}`,
                  }}
                />
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "white" }}>
                  {label}
                </span>
              </div>
            </div>

            {/* CONTENT */}
            <div style={{ padding: "18px 22px 22px", textAlign: "center" }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 19,
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2,
                  margin: "0 0 4px",
                }}
              >
                {c.name}
              </h3>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 12.5,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: "0.2px",
                  lineHeight: 1.35,
                  marginBottom: 16,
                }}
              >
                {c.role}
              </span>

              {/* Hairline */}
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${tone}55, transparent)`, marginBottom: 14 }} />

              {/* EMAIL — full-width tone-tinted glass */}
              <a
                href={`mailto:${c.email}`}
                aria-label={`Email ${c.name}`}
                title={c.email}
                className="cfq-conc-btn cfq-conc-btn-email"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  height: 40,
                  borderRadius: 11,
                  background: `linear-gradient(135deg, ${tone}26 0%, ${tone}14 100%)`,
                  border: `1px solid ${tone}66`,
                  backdropFilter: "blur(10px) saturate(160%)",
                  WebkitBackdropFilter: "blur(10px) saturate(160%)",
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.18), 0 6px 18px rgba(0,0,0,0.3)`,
                  textDecoration: "none",
                  marginBottom: 8,
                  transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                  ['--tone' as string]: tone,
                  ['--tone-bright' as string]: toneBright,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={toneBright} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, zIndex: 2, position: "relative" }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.1px",
                    color: "rgba(255,255,255,0.92)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                    zIndex: 2,
                    position: "relative",
                  }}
                >
                  {c.email}
                </span>
              </a>

              {/* WhatsApp + LinkedIn — split row */}
              <div style={{ display: "flex", gap: 8 }}>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${c.phoneDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp ${c.name} at ${c.phone}`}
                  title={c.phone}
                  className="cfq-conc-btn cfq-conc-btn-wa"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    height: 40,
                    borderRadius: 11,
                    background: `linear-gradient(135deg, ${tone}26 0%, ${tone}14 100%)`,
                    border: `1px solid ${tone}66`,
                    backdropFilter: "blur(10px) saturate(160%)",
                    WebkitBackdropFilter: "blur(10px) saturate(160%)",
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.18), 0 6px 18px rgba(0,0,0,0.3)`,
                    textDecoration: "none",
                    transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 32 32" fill="#25D366" aria-hidden style={{ zIndex: 2, position: "relative" }}>
                    <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.295-.07c-.873-.448-1.683-.926-2.396-1.564-.563-.503-1.16-1.102-1.621-1.736-.054-.077-.154-.247-.154-.34 0-.49 1.4-1.142 1.4-1.498 0-.176-.106-.296-.158-.479-.117-.418-1.06-2.473-1.245-2.79-.21-.36-.385-.5-.71-.5-.09 0-.176-.014-.265-.014-.4 0-.808.11-1.156.342-.49.34-1.082.802-1.082 1.706 0 .9.3 1.654.683 2.42.787 1.587 3.36 4.83 5.034 5.518.81.333 1.658.532 2.525.547.916 0 2.18-.4 2.18-1.387 0-.61-.473-1.07-.853-1.323-.235-.155-.45-.31-.633-.444zM16.11 5.013c-6.067 0-10.987 4.92-10.987 10.987a10.964 10.964 0 0 0 1.633 5.766L4 27l5.5-1.66a10.96 10.96 0 0 0 6.61 2.207c6.067 0 10.99-4.923 10.99-10.99S22.18 5.013 16.11 5.013zm0 19.918c-1.81 0-3.59-.5-5.14-1.45l-.367-.22-3.81 1.15 1.18-3.71-.24-.382a9.083 9.083 0 0 1-1.39-4.823 9.06 9.06 0 1 1 9.77 9.066c-.21.012-.42.012-.63 0-.12 0-.24 0-.36-.001 0 0 1 .368.99.368z" />
                  </svg>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9.5, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.92)", zIndex: 2, position: "relative" }}>
                    WhatsApp
                  </span>
                </a>

                {/* LinkedIn — only if URL provided */}
                {c.linkedin && (
                  <a
                    href={c.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${c.name} on LinkedIn`}
                    title="LinkedIn"
                    className="cfq-conc-btn cfq-conc-btn-li"
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      height: 40,
                      borderRadius: 11,
                      background: `linear-gradient(135deg, ${tone}26 0%, ${tone}14 100%)`,
                      border: `1px solid ${tone}66`,
                      backdropFilter: "blur(10px) saturate(160%)",
                      WebkitBackdropFilter: "blur(10px) saturate(160%)",
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.18), 0 6px 18px rgba(0,0,0,0.3)`,
                      textDecoration: "none",
                      transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#3CA0FF" aria-hidden style={{ zIndex: 2, position: "relative" }}>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9.5, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.92)", zIndex: 2, position: "relative" }}>
                      LinkedIn
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section
      ref={ref}
      id="contacts"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* Ambient halos */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 50% 40% at 20% 25%, ${C}0e 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 45% 40% at 80% 75%, ${QATAR}10 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <BgDots opacity={0.035} />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", zIndex: 2 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(32px, 4vw, 48px)" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}
          >
            <span style={{ width: 26, height: 1, background: C, boxShadow: `0 0 8px ${C}66` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "4.5px", textTransform: "uppercase", color: C_BRIGHT }}>
              Get in Touch
            </span>
            <span style={{ width: 26, height: 1, background: C, boxShadow: `0 0 8px ${C}66` }} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 50px)",
              letterSpacing: "-1.8px",
              lineHeight: 1.04,
              color: "white",
              margin: "0 auto",
              maxWidth: 820,
            }}
          >
            Speak directly with{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>the team behind the room.</em>
          </motion.h2>
        </div>

        {/* All 3 cards in one row */}
        <div
          className="cfq-contacts-row"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "stretch",
            gap: "clamp(18px, 2vw, 28px)",
          }}
        >
          <ContactCard c={speakingContact} label="Speaking" delay={0.2} />
          {sponsorshipContacts.map((c, i) => (
            <ContactCard key={c.email} c={c} label="Sponsorship" delay={0.3 + i * 0.1} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .cfq-concierge:hover .cfq-concierge-photo {
          transform: scale(1.04);
          filter: saturate(1.1) contrast(1.06) !important;
        }

        /* Tone-tinted glass contact buttons with shimmer sweep */
        .cfq-conc-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .cfq-conc-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 70%;
          height: 100%;
          background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%);
          transform: skewX(-18deg);
          transition: left 0.85s cubic-bezier(0.22,1,0.36,1);
          pointer-events: none;
          z-index: 1;
        }
        .cfq-conc-btn:hover::before {
          left: 170%;
        }

        .cfq-conc-btn-email:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, var(--tone) 0%, var(--tone-bright) 100%) !important;
          border-color: var(--tone-bright) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -1px 0 rgba(0,0,0,0.22), 0 14px 30px var(--tone) !important;
        }
        .cfq-conc-btn-email:hover svg {
          stroke: white !important;
        }
        .cfq-conc-btn-email:hover span {
          color: white !important;
        }

        .cfq-conc-btn-wa:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%) !important;
          border-color: #25D366 !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2), 0 14px 30px rgba(37,211,102,0.5) !important;
        }
        .cfq-conc-btn-wa:hover svg {
          fill: white !important;
        }
        .cfq-conc-btn-wa:hover span {
          color: white !important;
        }

        .cfq-conc-btn-li:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #0A66C2 0%, #004182 100%) !important;
          border-color: #0A66C2 !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.2), 0 14px 30px rgba(10,102,194,0.55) !important;
        }
        .cfq-conc-btn-li:hover svg {
          fill: white !important;
        }
        .cfq-conc-btn-li:hover span {
          color: white !important;
        }

        @media (max-width: 1100px) {
          .cfq-contacts-row {
            gap: 16px !important;
          }
          .cfq-concierge {
            max-width: 300px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// VENUE — reveal soon teaser with Doha hotel background
// ───────────────────────────────────────────────────────────────────────────
function VenueTeaser() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const GOLD_BRIGHT = "#E2C063";

  // Doha skyline from Unsplash (Akbar Nemati) — swap for the real venue shot once selected
  const VENUE_BG = "https://images.unsplash.com/photo-1683194247996-43897678c94c?w=2400&q=85&auto=format&fit=crop";

  return (
    <section
      ref={ref}
      id="venue"
      style={{
        position: "relative",
        padding: "clamp(40px, 4.5vw, 64px) 0",
        background: BG_BASE,
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={VENUE_BG}
          alt=""
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 60%",
            filter: "saturate(0.85) contrast(1.05)",
          }}
        />
      </div>

      {/* Dark vignette so text always reads */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(2,5,14,0.85) 0%, rgba(2,5,14,0.6) 35%, rgba(2,5,14,0.6) 65%, rgba(2,5,14,0.92) 100%)`,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Tone wash — cyan top-left, maroon bottom-right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 15% 20%, ${C}1a 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 85% 80%, ${QATAR}1f 0%, transparent 55%)`,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Side vignette ring */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 200px rgba(0,0,0,0.7)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <BgDots opacity={0.04} />

      <div
        style={{
          position: "relative",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          zIndex: 3,
          textAlign: "center",
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 22 }}
        >
          <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, boxShadow: `0 0 8px ${GOLD}66` }} />
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "4.5px",
              textTransform: "uppercase",
              color: GOLD_BRIGHT,
            }}
          >
            The Venue
          </span>
          <span style={{ width: 32, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD})`, boxShadow: `0 0 8px ${GOLD}66` }} />
        </motion.div>

        {/* Headline with shimmer on "Reveal Soon" */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 64px)",
            letterSpacing: "-2.2px",
            lineHeight: 1.02,
            color: "white",
            margin: "0 auto 18px",
            maxWidth: 900,
            textShadow: "0 4px 24px rgba(0,0,0,0.5)",
          }}
        >
          Hosted in the heart of Doha.
          <br />
          <span
            className="cfq-venue-shimmer"
            style={{
              backgroundImage: `linear-gradient(110deg, ${GOLD} 0%, ${GOLD_BRIGHT} 25%, #FFE8B6 50%, ${GOLD_BRIGHT} 75%, ${GOLD} 100%)`,
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
            }}
          >
            Venue announcing soon.
          </span>
        </motion.h2>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 300,
            fontSize: "clamp(15px, 1.2vw, 17px)",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.72)",
            margin: "0 auto clamp(34px, 4vw, 44px)",
            maxWidth: 620,
            textShadow: "0 2px 10px rgba(0,0,0,0.4)",
          }}
        >
          We&apos;re finalising the host property for Cyber First Qatar 2026 — a five-star venue in the heart of Doha, selected for executive networking and a programme of this calibre.
        </motion.p>

        {/* Confirmed-facts chips */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.35, ease: EASE }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
            marginBottom: "clamp(34px, 4vw, 44px)",
          }}
        >
          {[
            { label: "Doha, Qatar", confirmed: true, icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
            { label: "10 November 2026", confirmed: true, icon: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18" },
            { label: "Five-Star Property", confirmed: false, icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
          ].map((chip) => (
            <div
              key={chip.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 16px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(14px) saturate(180%)",
                WebkitBackdropFilter: "blur(14px) saturate(180%)",
                border: `1px solid ${chip.confirmed ? "rgba(255,255,255,0.22)" : `${GOLD}55`}`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 18px rgba(0,0,0,0.4)`,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={chip.confirmed ? C_BRIGHT : GOLD_BRIGHT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={chip.icon} />
              </svg>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11.5,
                  fontWeight: 600,
                  letterSpacing: "0.8px",
                  color: "white",
                  textTransform: "uppercase",
                }}
              >
                {chip.label}
              </span>
              {!chip.confirmed && (
                <span
                  style={{
                    marginLeft: 4,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 8.5,
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    color: GOLD,
                    textTransform: "uppercase",
                  }}
                >
                  TBA
                </span>
              )}
            </div>
          ))}
        </motion.div>

      </div>

      <style jsx global>{`
        @keyframes cfqVenueShimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        .cfq-venue-shimmer {
          animation: cfqVenueShimmer 5s linear infinite;
        }
        @keyframes cfqVenuePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(1.4); }
        }
        .cfq-venue-pulse {
          animation: cfqVenuePulse 1.8s ease-in-out infinite;
        }
        .cfq-venue-cta:hover {
          background: rgba(255,255,255,0.16) !important;
          border-color: ${GOLD_BRIGHT} !important;
          transform: translateY(-2px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 18px 44px rgba(0,0,0,0.6), 0 0 36px ${GOLD}55 !important;
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// REGISTER (shared InquiryForm)
// ───────────────────────────────────────────────────────────────────────────
function RegisterSection() {
  return (
    <section
      id="register"
      style={{
        position: "relative",
        padding: "clamp(48px, 5.5vw, 76px) 0",
        background: BG_DEEP,
        overflow: "hidden",
      }}
    >
      <BgDots opacity={0.04} />
      <div
        className="cfq-register-wrap"
        style={{ position: "relative", zIndex: 1 }}
      >
        <InquiryForm
          defaultCountry="QA"
          eventName="Cyber First Qatar 2026"
          labelText="Join us in Doha"
        />
      </div>

      <style jsx global>{`
        .cfq-register-wrap #get-involved {
          background: transparent !important;
        }
        .cfq-register-wrap #get-involved > .absolute {
          display: none;
        }
        .cfq-register-wrap .inquiry-split > div:last-child {
          background: rgba(10, 16, 36, 0.78) !important;
          backdrop-filter: blur(28px) saturate(1.2) !important;
          -webkit-backdrop-filter: blur(28px) saturate(1.2) !important;
          border: 1px solid ${C}25 !important;
          box-shadow: 0 22px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }
        .cfq-register-wrap button[style*="background: var(--orange)"] {
          background: ${C} !important;
          border-color: ${C} !important;
        }
        .cfq-register-wrap .inquiry-split > div:last-child > .absolute {
          background: radial-gradient(ellipse, ${C}12 0%, transparent 70%) !important;
        }
        .cfq-register-wrap [style*="var(--orange)"][style*="letter-spacing: 3px"] {
          color: ${C_BRIGHT} !important;
        }
        .cfq-register-wrap .inquiry-split svg {
          color: ${C_BRIGHT};
        }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// POST-EVENT REPORTS — request modal (portalled to <body>)
// ───────────────────────────────────────────────────────────────────────────
function CfqPostEventReports() {
  type RequestKind = "Past Event Report" | "Delegate List";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.country === "QA") || COUNTRY_CODES[0]
  );
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [requestType, setRequestType] = useState<RequestKind>("Past Event Report");
  const [selectedReportUrl, setSelectedReportUrl] = useState<string>(POST_EVENT_REPORTS[0]?.url ?? "");

  // Lock body scroll + ESC-to-close while modal is open
  useEffect(() => {
    if (!modalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  // Listen for global "open this modal" events from other components on this page
  useEffect(() => {
    const onOpenRequest = (e: Event) => {
      const detail = (e as CustomEvent<{ type?: RequestKind }>).detail;
      if (detail?.type === "Past Event Report" || detail?.type === "Delegate List") {
        setRequestType(detail.type);
        setSubmitState("idle");
        setSubmitError("");
        setErrors({});
        setModalOpen(true);
      }
    };
    window.addEventListener("cfq-2026:open-request", onOpenRequest);
    return () => window.removeEventListener("cfq-2026:open-request", onOpenRequest);
  }, []);

  const modalCopy = requestType === "Past Event Report"
    ? {
        kicker: "Request the Past Event Report",
        title: "Get the post-event report.",
        subtitle: "Share your details and we'll send the chosen edition's report to your work email.",
        success: "We'll email the post-event report PDF to your work email within 1 business day.",
      }
    : {
        kicker: "Request the Delegate List",
        title: "Get the full attendee roster.",
        subtitle: "Share your details and we'll send the curated delegate list to your work email.",
        success: "We'll send the delegate list to your work email within 1 business day.",
      };

  const phoneDigits = phone.replace(/[\s\-()]/g, "");
  const phoneDigitsLen = phoneDigits.length;
  const phoneIsValid = phoneDigitsLen > 0 && validatePhone(phone, countryCode) === null;

  useEffect(() => {
    if (!phoneTouched) return;
    const err = validatePhone(phone, countryCode);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next.phone = err; else delete next.phone;
      return next;
    });
  }, [phone, countryCode, phoneTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Work email is required";
    else if (!isWorkEmail(email.trim())) newErrors.email = "Please use your work email — free providers are not accepted";
    if (!jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    const phoneErr = validatePhone(phone, countryCode);
    if (phoneErr) newErrors.phone = phoneErr;
    if (!selectedReportUrl) newErrors.report = "Please select an edition";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setPhoneTouched(true);
      return;
    }

    const selectedReport = POST_EVENT_REPORTS.find((r) => r.url === selectedReportUrl);

    setSubmitState("submitting");
    setSubmitError("");
    const res = await submitForm({
      type: "contact",
      full_name: fullName.trim(),
      email: email.trim(),
      job_title: jobTitle.trim(),
      phone: `${countryCode.code} ${phone.trim()}`,
      event_name: "Cyber First Qatar 2026",
      metadata: {
        "Event Page": "Cyber First Qatar 2026",
        "Request Type": requestType,
        "Page Section": "Post-Event Reports",
        ...(selectedReport && {
          "Selected Edition": `${selectedReport.title} ${selectedReport.year}`,
          ...(requestType === "Past Event Report" && { "Selected Report URL": selectedReport.url }),
        }),
      },
    });
    if (res.success) {
      setSubmitState("success");
      setFullName(""); setEmail(""); setJobTitle(""); setPhone("");
    } else {
      setSubmitState("error");
      setSubmitError(res.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {mounted && createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              className="cfq-req-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setModalOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cfq-req-modal-title"
            >
              <motion.div
                className="cfq-req-modal-card"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cfq-req-modal-close"
                  aria-label="Close request form"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <span aria-hidden className="cfq-req-modal-hairline" />

                <div className="cfq-req-modal-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 24, height: 1, background: C_BRIGHT }} />
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.32em", textTransform: "uppercase",
                      color: C_BRIGHT,
                    }}>{modalCopy.kicker}</span>
                  </div>
                  <h3 id="cfq-req-modal-title" style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(20px, 2.4vw, 26px)",
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                    color: "white",
                    lineHeight: 1.2,
                  }}>
                    {modalCopy.title}
                  </h3>
                  <p style={{
                    margin: "10px 0 0",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.55,
                  }}>
                    {modalCopy.subtitle}
                  </p>
                </div>

                {submitState === "success" ? (
                  <div className="cfq-req-modal-success">
                    <div className="cfq-req-modal-success-check">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h4>Request received.</h4>
                    <p>{modalCopy.success}</p>
                    <button type="button" onClick={() => setModalOpen(false)} className="cfq-req-modal-done">
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="cfq-req-form-fields">
                    <input type="text" name="website" tabIndex={-1} autoComplete="off"
                      style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

                    {/* Request type toggle — Past Event Report vs Delegate List */}
                    <div className="cfq-req-form-row">
                      <div
                        role="tablist"
                        aria-label="Request type"
                        style={{ display: "flex", gap: 8, width: "100%" }}
                      >
                        {(["Past Event Report", "Delegate List"] as const).map((kind) => {
                          const active = requestType === kind;
                          return (
                            <button
                              key={kind}
                              type="button"
                              role="tab"
                              aria-selected={active}
                              onClick={() => setRequestType(kind)}
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 9,
                                border: active ? `1px solid ${C}66` : "1px solid rgba(255,255,255,0.10)",
                                background: active ? `linear-gradient(135deg, ${C}26, ${C}0a)` : "rgba(255,255,255,0.03)",
                                color: active ? C_BRIGHT : "rgba(255,255,255,0.55)",
                                fontFamily: "var(--font-outfit)",
                                fontSize: 12.5,
                                fontWeight: 600,
                                letterSpacing: "0.2px",
                                cursor: "pointer",
                                transition: "all 0.25s ease",
                              }}
                            >
                              {kind}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="cfq-req-form-row">
                      <label className="cfq-req-form-field" style={{ flex: "1 1 100%" }}>
                        <span className="cfq-req-form-label">Select Edition</span>
                        <select
                          value={selectedReportUrl}
                          onChange={(e) => {
                            setSelectedReportUrl(e.target.value);
                            if (errors.report) setErrors({ ...errors, report: "" });
                          }}
                          className="cfq-req-form-input cfq-req-form-report-select"
                          aria-invalid={!!errors.report}
                        >
                          {POST_EVENT_REPORTS.map((r) => (
                            <option key={r.url} value={r.url} style={{ background: BG_ELEV, color: "#fff" }}>
                              {r.title} {r.year}
                            </option>
                          ))}
                        </select>
                        {errors.report && <span className="cfq-req-form-err">{errors.report}</span>}
                      </label>
                    </div>

                    <div className="cfq-req-form-row">
                      <label className="cfq-req-form-field">
                        <span className="cfq-req-form-label">Full Name</span>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors({ ...errors, fullName: "" }); }}
                          placeholder="Your full name"
                          autoComplete="name"
                          className="cfq-req-form-input"
                          aria-invalid={!!errors.fullName}
                        />
                        {errors.fullName && <span className="cfq-req-form-err">{errors.fullName}</span>}
                      </label>

                      <label className="cfq-req-form-field">
                        <span className="cfq-req-form-label">Work Email</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }}
                          placeholder="name@company.com"
                          autoComplete="email"
                          className="cfq-req-form-input"
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && <span className="cfq-req-form-err">{errors.email}</span>}
                      </label>
                    </div>

                    <div className="cfq-req-form-row">
                      <label className="cfq-req-form-field">
                        <span className="cfq-req-form-label">Job Title</span>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => { setJobTitle(e.target.value); if (errors.jobTitle) setErrors({ ...errors, jobTitle: "" }); }}
                          placeholder="CISO, Head of IT, CIO…"
                          autoComplete="organization-title"
                          className="cfq-req-form-input"
                          aria-invalid={!!errors.jobTitle}
                        />
                        {errors.jobTitle && <span className="cfq-req-form-err">{errors.jobTitle}</span>}
                      </label>

                      <label className="cfq-req-form-field">
                        <span className="cfq-req-form-label">
                          Phone
                          <span className="cfq-req-form-hint-inline">
                            {countryCode.length} digits expected
                          </span>
                        </span>
                        <div className="cfq-req-form-phone-row">
                          <select
                            value={`${countryCode.country}-${countryCode.code}`}
                            onChange={(e) => {
                              const [country, code] = e.target.value.split("-");
                              const found = COUNTRY_CODES.find((c) => c.country === country && c.code === code);
                              if (found) {
                                setCountryCode(found);
                                setPhone((prev) => prev.replace(/\D/g, "").slice(0, found.length));
                              }
                            }}
                            className="cfq-req-form-cc"
                            aria-label="Country code"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={`${c.country}-${c.code}`} value={`${c.country}-${c.code}`} style={{ background: BG_ELEV, color: "#fff" }}>
                                {c.country} {c.code}
                              </option>
                            ))}
                          </select>
                          <div className="cfq-req-form-phone-wrap">
                            <input
                              type="tel"
                              inputMode="numeric"
                              value={phone}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, countryCode.length);
                                setPhone(digits);
                              }}
                              onBlur={() => setPhoneTouched(true)}
                              placeholder={countryCode.placeholder}
                              autoComplete="tel-national"
                              maxLength={countryCode.length}
                              className="cfq-req-form-input cfq-req-form-phone-input"
                              aria-invalid={!!errors.phone}
                            />
                            {phoneTouched && phoneIsValid && (
                              <span aria-hidden className="cfq-req-form-phone-check">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                            )}
                          </div>
                        </div>
                        {phoneTouched && !phoneIsValid && phoneDigitsLen > 0 && !errors.phone && (
                          <span className="cfq-req-form-phone-progress">
                            {phoneDigitsLen} / {countryCode.length} digits
                          </span>
                        )}
                        {errors.phone && <span className="cfq-req-form-err">{errors.phone}</span>}
                      </label>
                    </div>

                    {submitError && (
                      <div className="cfq-req-form-submit-err">{submitError}</div>
                    )}

                    <button type="submit" disabled={submitState === "submitting"} className="cfq-req-form-submit">
                      {submitState === "submitting"
                        ? "Sending…"
                        : requestType === "Past Event Report"
                          ? "Send me the report"
                          : "Send me the delegate list"}
                      {submitState !== "submitting" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}>
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      )}
                    </button>
                    <p className="cfq-req-form-hint">
                      We respect your inbox. Used only to send the requested resource and edition follow-ups.
                    </p>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <style jsx global>{`
        .cfq-req-modal-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: clamp(16px, 3vw, 32px);
          background: rgba(2, 4, 14, 0.78);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
        }
        .cfq-req-modal-card {
          position: relative;
          width: 100%; max-width: 580px;
          max-height: calc(100vh - clamp(32px, 6vw, 64px));
          overflow-y: auto;
          padding: clamp(24px, 3vw, 36px);
          background: linear-gradient(165deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 20px;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            inset 0 -1px 0 rgba(0,0,0,0.45),
            0 24px 56px rgba(0,0,0,0.55),
            0 48px 96px rgba(0,0,0,0.45);
        }
        .cfq-req-modal-hairline {
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent 0%, ${C_BRIGHT} 30%, ${QATAR_BRIGHT} 70%, transparent 100%);
          opacity: 0.85;
        }
        .cfq-req-modal-close {
          position: absolute; top: 14px; right: 14px;
          display: inline-flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .cfq-req-modal-close:hover {
          color: white; border-color: ${C_BRIGHT}66; background: ${C}1a; transform: rotate(90deg);
        }
        .cfq-req-modal-header { margin-bottom: clamp(18px, 2vw, 22px); padding-right: 36px; }
        .cfq-req-modal-success { display: flex; flex-direction: column; align-items: center; text-align: center; padding: clamp(8px, 1vw, 12px) 0 4px; }
        .cfq-req-modal-success-check {
          display: inline-flex; align-items: center; justify-content: center;
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, ${C}, ${C_BRIGHT});
          margin-bottom: 16px;
          box-shadow: 0 8px 24px ${C}66;
        }
        .cfq-req-modal-success h4 {
          margin: 0 0 8px;
          font-family: var(--font-display);
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 700; color: white;
        }
        .cfq-req-modal-success p {
          margin: 0 0 22px;
          font-family: var(--font-outfit);
          font-size: 14px; color: rgba(255,255,255,0.6);
          line-height: 1.55; max-width: 380px;
        }
        .cfq-req-modal-done {
          padding: 10px 28px;
          background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%);
          color: white; border: none; border-radius: 10px;
          font-family: var(--font-outfit); font-size: 13px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          cursor: pointer;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 20px ${C}55;
          transition: all 0.3s ease;
        }
        .cfq-req-modal-done:hover { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 14px 30px ${C}88; }

        .cfq-req-form-fields { display: flex; flex-direction: column; gap: 14px; }
        .cfq-req-form-row { display: flex; flex-wrap: wrap; gap: 14px; }
        .cfq-req-form-field { flex: 1 1 200px; display: flex; flex-direction: column; gap: 6px; position: relative; }
        .cfq-req-form-label {
          font-family: var(--font-outfit); font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.6); letter-spacing: 0.5px;
          text-transform: uppercase;
          display: flex; align-items: center; gap: 8px;
        }
        .cfq-req-form-hint-inline {
          font-size: 10px; letter-spacing: 0.3px; text-transform: none; opacity: 0.5;
        }
        .cfq-req-form-input {
          width: 100%;
          padding: 11px 13px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: white;
          font-family: var(--font-outfit); font-size: 14px;
          transition: all 0.25s ease;
          outline: none;
        }
        .cfq-req-form-input:focus { border-color: ${C}88; background: rgba(255,255,255,0.06); box-shadow: 0 0 0 3px ${C}22; }
        .cfq-req-form-input[aria-invalid="true"] { border-color: rgba(255,80,80,0.6); }
        .cfq-req-form-report-select { cursor: pointer; appearance: none; -webkit-appearance: none; background-image: linear-gradient(45deg, transparent 50%, ${C_BRIGHT} 50%), linear-gradient(135deg, ${C_BRIGHT} 50%, transparent 50%); background-position: calc(100% - 16px) 50%, calc(100% - 11px) 50%; background-size: 5px 5px; background-repeat: no-repeat; padding-right: 32px; }
        .cfq-req-form-cc { flex: 0 0 110px; padding: 11px 9px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: white; font-family: var(--font-outfit); font-size: 12px; cursor: pointer; }
        .cfq-req-form-phone-row { display: flex; gap: 8px; }
        .cfq-req-form-phone-wrap { position: relative; flex: 1; }
        .cfq-req-form-phone-input { padding-right: 38px; }
        .cfq-req-form-phone-check { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: ${C_BRIGHT}; }
        .cfq-req-form-phone-progress { font-family: var(--font-outfit); font-size: 11px; color: rgba(255,255,255,0.45); }
        .cfq-req-form-err { font-family: var(--font-outfit); font-size: 11px; color: #ff6b6b; }
        .cfq-req-form-submit-err {
          padding: 10px 14px; border-radius: 10px;
          background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3);
          color: #ffb6b6; font-family: var(--font-outfit); font-size: 13px;
        }
        .cfq-req-form-submit {
          margin-top: 4px;
          padding: 13px 26px;
          background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%);
          color: white; border: none; border-radius: 12px;
          font-family: var(--font-outfit); font-size: 13px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 10px 26px ${C}55;
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .cfq-req-form-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 16px 36px ${C}88; }
        .cfq-req-form-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .cfq-req-form-hint {
          font-family: var(--font-outfit); font-size: 11px; color: rgba(255,255,255,0.4);
          margin: 4px 0 0; text-align: center;
        }
      `}</style>
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// POST-EVENT REPORTS — floating sticky note (Hero/Overview) → icon thereafter
// ───────────────────────────────────────────────────────────────────────────
function CfqPostReportFloat() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nudged, setNudged] = useState(false);
  const [pastOverview, setPastOverview] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const DISMISS_KEY = "cfq-2026-report-dismissed";
  const NUDGE_KEY = "cfq-2026-report-nudged";

  // Read persisted state on mount
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 700px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Watch the Event Overview section — once its bottom leaves the viewport, switch to State B (icon mode)
  useEffect(() => {
    if (!mounted) return;
    const overview = document.getElementById("overview");
    if (!overview) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        // pastOverview = true when the overview section's bottom is above the viewport top
        const rect = entry.boundingClientRect;
        setPastOverview(rect.bottom < 60);
      },
      { threshold: [0, 0.1, 1], rootMargin: "0px 0px -60% 0px" }
    );
    obs.observe(overview);
    // Also handle the case where the user is already scrolled past on page load
    const initial = overview.getBoundingClientRect();
    setPastOverview(initial.bottom < 60);
    return () => obs.disconnect();
  }, [mounted]);

  // Fire the one-time nudge popup the first time the icon mode kicks in
  useEffect(() => {
    if (!mounted || dismissed || nudged) return;
    // On desktop the nudge fires when we transition into State B (icon)
    // On mobile the icon is always shown, so fire after a short delay
    const shouldFire = isMobile ? true : pastOverview;
    if (!shouldFire) return;
    const showTimer = setTimeout(() => setShowNudge(true), 800);
    const hideTimer = setTimeout(() => {
      setShowNudge(false);
      try { localStorage.setItem(NUDGE_KEY, "1"); } catch {}
      setNudged(true);
    }, 8000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [mounted, pastOverview, dismissed, nudged, isMobile]);

  const handleOpen = () => {
    window.dispatchEvent(new CustomEvent("cfq-2026:open-request", { detail: { type: "Past Event Report" } }));
    setShowNudge(false);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    setShowNudge(false);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
  };

  const handleDismissNudge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNudge(false);
    try { localStorage.setItem(NUDGE_KEY, "1"); } catch {}
    setNudged(true);
  };

  if (!mounted || dismissed) return null;

  // Desktop, State A — sticky note bottom-center over Hero + Overview only
  // Desktop: keep the sticky note visible the whole way down (no conversion to a FAB icon).
  // Mobile: the note is too wide, so use the compact FAB with a dismissible popup nudge.
  const showStickyNote = !isMobile;
  const showIcon = isMobile;

  return (
    <>
      <AnimatePresence>
        {showStickyNote && (
          <motion.div
            key="sticky-note"
            initial={{ opacity: 0, y: 28, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 28, x: "-50%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="cfq-report-note"
            role="button"
            tabIndex={0}
            onClick={handleOpen}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpen(); } }}
            aria-label="Download Post Event Reports"
          >
            <button
              type="button"
              className="cfq-report-note-close"
              onClick={handleDismiss}
              aria-label="Dismiss"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <span aria-hidden className="cfq-report-note-hairline" />

            <div className="cfq-report-note-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
            </div>

            <div className="cfq-report-note-body">
              <span className="cfq-report-note-eyebrow">
                <span className="cfq-report-note-pulse" aria-hidden />
                Free Download
              </span>
              <span className="cfq-report-note-title">
                Download our Post Event Reports
              </span>
              <span className="cfq-report-note-cta">
                View past editions
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6 }}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIcon && (
          <motion.div
            key="floating-icon-wrap"
            className="cfq-report-fab-wrap"
            initial={{ opacity: 0, scale: 0.6, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 14 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence>
              {showNudge && (
                <motion.div
                  key="nudge"
                  className="cfq-report-fab-nudge"
                  initial={{ opacity: 0, x: 12, scale: 0.94 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 12, scale: 0.94 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="cfq-report-fab-nudge-eyebrow">
                    <span className="cfq-report-note-pulse" aria-hidden /> Free Download
                  </span>
                  <span className="cfq-report-fab-nudge-text">
                    Download our Post Event Reports
                  </span>
                  <button
                    type="button"
                    className="cfq-report-fab-nudge-close"
                    onClick={handleDismissNudge}
                    aria-label="Dismiss"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                  <span aria-hidden className="cfq-report-fab-nudge-tail" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="cfq-report-fab-btnwrap">
              <button
                type="button"
                className="cfq-report-fab"
                onClick={handleOpen}
                aria-label="Download Post Event Reports"
                title="Download Post Event Reports"
              >
                <span aria-hidden className="cfq-report-fab-pulse" />
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
              </button>
              <button
                type="button"
                className="cfq-report-fab-close"
                onClick={handleDismiss}
                aria-label="Dismiss"
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* ── Sticky note (State A) ─────────────────────────────────────── */
        .cfq-report-note {
          position: fixed;
          bottom: 24px;
          left: 50%;
          z-index: 60;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 14px 22px 14px 18px;
          border-radius: 999px;
          cursor: pointer;
          background: linear-gradient(145deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%);
          border: 1px solid ${C}55;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.10),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            0 18px 50px rgba(0,0,0,0.55),
            0 0 36px ${C}30;
          transition: border-color 0.45s ease, box-shadow 0.45s ease;
          max-width: calc(100vw - 32px);
        }
        .cfq-report-note:hover {
          border-color: ${C_BRIGHT};
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            0 22px 60px rgba(0,0,0,0.6),
            0 0 50px ${C}55;
        }
        .cfq-report-note-hairline {
          position: absolute;
          top: 0; left: 12%; right: 12%; height: 1px;
          background: linear-gradient(90deg, transparent 0%, ${C_BRIGHT}, ${QATAR_BRIGHT}, transparent 100%);
          opacity: 0.7;
        }
        .cfq-report-note-close {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 22px; height: 22px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(20,28,52,0.95);
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .cfq-report-note-close:hover {
          color: white;
          background: ${QATAR};
          border-color: ${QATAR_BRIGHT};
          transform: rotate(90deg) scale(1.08);
        }
        .cfq-report-note-icon {
          flex-shrink: 0;
          width: 38px; height: 38px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.32), 0 6px 18px ${C}66;
        }
        .cfq-report-note-body {
          display: flex; flex-direction: column; gap: 1px; line-height: 1.15;
        }
        .cfq-report-note-eyebrow {
          font-family: var(--font-outfit);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: ${C_BRIGHT};
          display: inline-flex; align-items: center; gap: 6px;
        }
        .cfq-report-note-pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: ${C_BRIGHT};
          box-shadow: 0 0 8px ${C};
          animation: cfqReportPulse 1.6s ease-in-out infinite;
        }
        .cfq-report-note-title {
          font-family: var(--font-display);
          font-size: 13.5px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.2px;
        }
        .cfq-report-note-cta {
          font-family: var(--font-outfit);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          display: inline-flex; align-items: center;
          margin-top: 2px;
        }
        .cfq-report-note:hover .cfq-report-note-cta { color: ${C_BRIGHT}; }
        @keyframes cfqReportPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.45; transform: scale(1.5); }
        }

        /* ── FAB icon (State B) ────────────────────────────────────────── */
        .cfq-report-fab-wrap {
          position: fixed;
          bottom: 96px;
          right: 24px;
          z-index: 50;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          gap: 12px;
        }
        .cfq-report-fab-btnwrap {
          position: relative;
          display: inline-flex;
        }
        .cfq-report-fab {
          position: relative;
          width: 56px; height: 56px;
          border-radius: 50%;
          border: 1px solid ${C_BRIGHT};
          background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%);
          color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow:
            inset 0 1.5px 0 rgba(255,255,255,0.34),
            inset 0 -1.5px 0 rgba(0,0,0,0.25),
            0 14px 36px rgba(0,0,0,0.45),
            0 0 30px ${C}55;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
        }
        .cfq-report-fab:hover {
          transform: translateY(-3px) scale(1.06);
          box-shadow:
            inset 0 1.5px 0 rgba(255,255,255,0.4),
            inset 0 -1.5px 0 rgba(0,0,0,0.25),
            0 18px 44px rgba(0,0,0,0.5),
            0 0 44px ${C}88;
        }
        .cfq-report-fab-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: ${C};
          opacity: 0.4;
          animation: cfqFabRing 2.4s ease-out infinite;
          z-index: -1;
        }
        @keyframes cfqFabRing {
          0%   { transform: scale(1);   opacity: 0.55; }
          80%  { transform: scale(1.7); opacity: 0;    }
          100% { transform: scale(1.7); opacity: 0;    }
        }
        .cfq-report-fab-close {
          position: absolute;
          top: -6px; right: -6px;
          width: 20px; height: 20px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(20,28,52,0.96);
          color: rgba(255,255,255,0.78);
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .cfq-report-fab-close:hover {
          color: white;
          background: ${QATAR};
          border-color: ${QATAR_BRIGHT};
          transform: rotate(90deg) scale(1.08);
        }

        .cfq-report-fab-nudge {
          position: relative;
          max-width: 230px;
          padding: 12px 32px 12px 14px;
          border-radius: 14px;
          background: linear-gradient(145deg, ${BG_ELEV} 0%, ${BG_DEEP} 100%);
          border: 1px solid ${C}55;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.10),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            0 14px 36px rgba(0,0,0,0.55),
            0 0 28px ${C}30;
          display: flex; flex-direction: column; gap: 4px;
        }
        .cfq-report-fab-nudge-eyebrow {
          font-family: var(--font-outfit);
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: ${C_BRIGHT};
          display: inline-flex; align-items: center; gap: 6px;
        }
        .cfq-report-fab-nudge-text {
          font-family: var(--font-display);
          font-size: 12.5px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.1px;
          line-height: 1.25;
        }
        .cfq-report-fab-nudge-close {
          position: absolute;
          top: 6px; right: 6px;
          width: 20px; height: 20px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .cfq-report-fab-nudge-close:hover {
          color: white;
          background: ${QATAR}33;
          border-color: ${QATAR}88;
        }
        .cfq-report-fab-nudge-tail {
          position: absolute;
          right: -6px; top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 12px; height: 12px;
          background: ${BG_ELEV};
          border-top: 1px solid ${C}55;
          border-right: 1px solid ${C}55;
        }

        @media (max-width: 700px) {
          .cfq-report-fab-wrap { bottom: 88px; right: 16px; }
          .cfq-report-fab { width: 50px; height: 50px; }
          .cfq-report-fab-nudge { max-width: 200px; padding: 10px 28px 10px 12px; }
        }
      `}</style>
    </>
  );
}

// ─── CYBER FIRST SERIES — cross-links to other editions ───────────────────────
// Confirmed editions carry a live href + logo + hero image; upcoming ones render
// as dimmed "Coming Soon" cards until they're ready.
type CfqEdition = { city: string; edition: string; when?: string; href?: string; logo?: string; image?: string; scrimLight?: boolean };
const CFQ_EDITIONS: CfqEdition[] = [
  { city: "Kuwait City", edition: "Kuwait Edition", when: "October 2026", href: "/events/cyber-first/kuwait-2026", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/assets/Cyber_kuwait.png", image: "https://efg-final.s3.eu-north-1.amazonaws.com/assets/magnific_cinematic-wideangle-hero-_CHoH66yEEy.png", scrimLight: true },
  { city: "United Arab Emirates", edition: "New Edition" },
];

function SeriesEditions() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(40px, 4.5vw, 64px) 24px", background: "transparent", overflow: "hidden" }}>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, color: C_BRIGHT, textTransform: "uppercase", letterSpacing: "4.5px" }}>Cyber First Series</span>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(23px, 3.2vw, 36px)", fontWeight: 700, lineHeight: 1.14, textAlign: "center", margin: "0 auto 34px", maxWidth: 680, color: "white", letterSpacing: "-0.02em" }}
        >
          Explore other editions across the region.
        </motion.h2>
        <div className="cfq-series-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 340px))", gap: 16, justifyContent: "center" }}>
          {CFQ_EDITIONS.map((e, i) => {
            const ready = Boolean(e.href && e.logo);
            return (
              <motion.div
                key={e.city}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.08 * i, ease: EASE }}
              >
                {ready ? (
                  <Link href={e.href!} className="cfq-series-card cfq-series-card-live" aria-label={`Cyber First ${e.city} — ${e.edition}${e.when ? `, ${e.when}` : ""}`}>
                    <span aria-hidden className="cfq-series-bg" style={{ backgroundImage: `url("${e.image}")` }} />
                    <span aria-hidden className={`cfq-series-scrim${e.scrimLight ? " cfq-series-scrim-light" : ""}`} />
                    <span className="cfq-series-logo-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={e.logo} alt={`Cyber First ${e.city}`} loading="lazy" className="cfq-series-logo" />
                    </span>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9.5, fontWeight: 700, letterSpacing: "2.4px", textTransform: "uppercase", color: C_BRIGHT }}>{e.edition}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "white", letterSpacing: "-0.01em", lineHeight: 1.15 }}>{e.city}</span>
                    {e.when && <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.55)" }}>{e.when}</span>}
                    <span className="cfq-series-go" style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                      View event
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </span>
                  </Link>
                ) : (
                  <div className="cfq-series-card cfq-series-card-soon" aria-label={`Cyber First ${e.city} — coming soon`}>
                    <span className="cfq-series-soon-top">
                      <span className="cfq-series-soon-badge">
                        <span aria-hidden className="cfq-series-soon-dot" />
                        Coming Soon
                      </span>
                    </span>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9.5, fontWeight: 700, letterSpacing: "2.4px", textTransform: "uppercase", color: `${C_BRIGHT}99` }}>{e.edition}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.01em", lineHeight: 1.15 }}>{e.city}</span>
                    {e.when && <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>{e.when}</span>}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      <style jsx global>{`
        .cfq-series-card { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 6px; height: 100%; padding: 22px 20px; border-radius: 16px; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.014)); box-shadow: inset 0 1px 0 rgba(255,255,255,0.07); transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease, box-shadow 0.4s ease; }
        .cfq-series-card:hover { transform: translateY(-5px); border-color: ${C}66; box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 40px rgba(0,0,0,0.45), 0 0 34px ${C}22; }
        .cfq-series-card:hover .cfq-series-go { color: ${C_BRIGHT}; }
        .cfq-series-card-live > *:not(.cfq-series-bg):not(.cfq-series-scrim) { position: relative; z-index: 2; }
        .cfq-series-bg { position: absolute; inset: 0; z-index: 0; background-size: cover; background-position: center; opacity: 0.5; transform: scale(1.02); transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .cfq-series-scrim { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(4,10,20,0.62) 0%, rgba(4,10,20,0.82) 58%, rgba(4,10,20,0.95) 100%); }
        .cfq-series-scrim-light { background: linear-gradient(180deg, rgba(4,10,20,0.38) 0%, rgba(4,10,20,0.62) 58%, rgba(4,10,20,0.86) 100%); }
        .cfq-series-card-live:hover .cfq-series-bg { opacity: 0.68; transform: scale(1.06); }
        .cfq-series-logo-wrap { display: flex; align-items: center; justify-content: flex-start; height: 52px; margin-bottom: 8px; }
        .cfq-series-logo { max-height: 52px; max-width: 100%; width: auto; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4)); }
        .cfq-series-card-soon { cursor: default; opacity: 0.72; }
        .cfq-series-card-soon:hover { transform: none; border-color: ${C}33; box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), 0 0 26px ${C}18; opacity: 0.85; }
        .cfq-series-soon-top { display: flex; align-items: center; height: 52px; margin-bottom: 8px; }
        .cfq-series-soon-badge { display: inline-flex; align-items: center; gap: 7px; padding: 7px 13px; border-radius: 999px; border: 1px solid ${C}40; background: ${C}14; font-family: var(--font-outfit); font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${C_BRIGHT}; }
        .cfq-series-soon-dot { width: 6px; height: 6px; border-radius: 50%; background: ${C_BRIGHT}; box-shadow: 0 0 8px ${C}; animation: cfqSeriesSoonPulse 1.8s ease-in-out infinite; }
        @keyframes cfqSeriesSoonPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.4); } }
        @media (max-width: 520px) { .cfq-series-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ───────────────────────────────────────────────────────────────────────────
export default function CyberFirstQatar2026() {
  return (
    <MotionConfig reducedMotion="user">
    <div style={{ background: BG_BASE, minHeight: "100vh", overflow: "hidden" }}>
      <EventNavigation />
      <Hero />
      <EventOverview />
      <AtAGlance />
      <WhyQatar />
      <LandscapeFacts />
      <div style={{ position: "relative", background: BG_DEEP, overflow: "hidden" }}>
        <KeyThemes />
        <Advisors />
        <Speakers />
      </div>
      <PastSeriesSponsors />
      <div style={{ position: "relative", background: BG_DEEP, overflow: "hidden" }}>
        <WhoAttends />
        <KeyIndustries />
        <Agenda />
        <SeriesHighlights />
        <Testimonials />
        <GallerySection />
        <AwardsTeaser />
        <ContactsSection />
      </div>
      <VenueTeaser />
      <RegisterSection />
      <SeriesEditions />
      <Footer />

      {/* Post-Event Reports — request modal + floating sticky note/icon */}
      <CfqPostEventReports />
      <CfqPostReportFloat />
    </div>
    </MotionConfig>
  );
}
