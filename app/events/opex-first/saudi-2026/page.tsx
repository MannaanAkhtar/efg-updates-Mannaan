"use client";

import React, { useRef, useState, useEffect } from "react";
import { preload } from "react-dom";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { MeshGradient } from "@paper-design/shaders-react";
import { Footer, InquiryForm } from "@/components/sections";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// ─── Design Tokens — monochrome violet (matches brochure) ───────────────────
const V_DIM = "#5B21B6";       // deepest violet
const V = "#7C3AED";           // OPEX First primary
const V_BRIGHT = "#9F6AFF";    // light violet
const V_PALE = "#C4B5FD";      // palest violet (used where a secondary accent was)
// Legacy token names kept as violet aliases so existing references stay coherent
const MINT = V_BRIGHT;
const MINT_BRIGHT = V_PALE;
const MINT_DIM = V_DIM;
const GOLD = V;
const GOLD_BRIGHT = V_BRIGHT;
const BG = "#0a0a14";
const BG_DARK = "#06060e";
const BG_CARD = "#0e0e1c";
const RULE = "rgba(255,255,255,0.08)";
const FAINT = "rgba(255,255,255,0.35)";
const MUTE = "rgba(255,255,255,0.6)";
const EASE = [0.22, 1, 0.36, 1] as const;

const EVENT_DATE = new Date("2026-09-15T09:00:00+03:00");
const EFG_LOGO = "/events-first-group_logo_alt.svg";
const OPEX_LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/logos/OPEX+FIRST+logo-1.png";
const BOARDROOM = "https://efg-final.s3.eu-north-1.amazonaws.com/networkfirst/boardrooms";

const HERO_BG = "https://efg-final.s3.eu-north-1.amazonaws.com/gallery/magnific_make-this-a-high-quality-_2901874874.png";

// ─── Data ────────────────────────────────────────────────────────────────────

const HERO_PILLS = [
  { label: "15 Sep 2026" },
  { label: "Riyadh · KSA" },
  { label: "Full-Day Summit" },
  { label: "220+ Delegates" },
  { label: "30+ Speakers" },
  { label: "5 Awards" },
];

const OVERVIEW_SIGNALS = [
  {
    tag: "Energy",
    name: "Aramco APS",
    body: "Predictive analytics, digital twins, and real-time optimisation across the energy stack.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&q=80",
  },
  {
    tag: "AI Governance",
    name: "SDAIA",
    body: "Institutionalising national AI governance and data infrastructure across entities.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80",
  },
  {
    tag: "Public Sector",
    name: "Digital Government Authority",
    body: "Harmonising digital maturity across federal entities and ministries.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=900&q=80",
  },
  {
    tag: "Benchmarking",
    name: "GovExPro",
    body: "Accelerating benchmarking and public-sector excellence frameworks.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
  },
  {
    tag: "Automation",
    name: "Enterprise RPA",
    body: "Scaling automation from silo bots toward end-to-end orchestration.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80",
  },
];

const OPEX_PAST_EDITIONS = [
  { id: "5obYKv-vJZE", city: "Dubai, UAE", year: "2026", caption: "Operational excellence leaders convene at the regional flagship." },
  { id: "dbL42utoYW4", city: "Riyadh, KSA", year: "2025", caption: "The inaugural Saudi edition — Vision 2030 execution at the table." },
];

const MARKET_BUCKETS = [
  {
    num: "01",
    kicker: "Drivers",
    title: "What's pushing performance to the top of the agenda.",
    lede: "Vision 2030 has shifted from blueprint to delivery — and every leadership conversation now starts with measurable outcomes.",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1848.JPG",
    items: [
      "Vision 2030 delivery pressure across ministries and giga-projects.",
      "National AI institutionalisation under SDAIA mandates.",
      "Industrial and energy optimisation at Aramco scale.",
      "Board-level ROI accountability on every transformation programme.",
    ],
  },
  {
    num: "02",
    kicker: "Signals",
    title: "What's actually happening on the ground.",
    lede: "Mandates are landing as deployments. The market is moving from strategy decks to live programmes with KPIs attached.",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1702.JPG",
    items: [
      "1,000+ initiatives across ministries with KPI-bound delivery timelines.",
      "SDAIA deploys national AI and data governance infrastructure.",
      "Aramco APS integrating predictive analytics and real-time optimisation.",
      "E-invoicing, data governance, and cyber mandates accelerating in lockstep.",
    ],
  },
  {
    num: "03",
    kicker: "Opportunities",
    title: "Where the next chapter gets written.",
    lede: "The execution decade rewards platforms that govern outcomes, not just enable them — opening room for a new operating-model layer.",
    image: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1751.JPG",
    items: [
      "Demand for execution governance and live KPI dashboards.",
      "Shift from AI pilots to scalable, governed AI operations.",
      "Process mining, digital twins, and control-tower models.",
      "Compliance-by-design automation and value-realisation frameworks.",
    ],
  },
];

const STATS = [
  { value: 220, suffix: "+", label: "Delegates" },
  { value: 30, suffix: "+", label: "Industry Speakers" },
  { value: 15, suffix: "+", label: "Conference Sessions" },
  { value: 10, suffix: "+", label: "Technology Providers" },
  { value: 15, suffix: "+", label: "Media Partners" },
  { value: 5, suffix: "", label: "Awards" },
];

const FOCUS_AREAS = [
  { title: "Strategy-to-Execution Governance", body: "From Vision 2030 roadmaps to measurable institutional performance." },
  { title: "AI & Intelligent Automation in Operations", body: "Agentic AI, automation beyond RPA, compliance-integrated AI governance." },
  { title: "Process Mining & Enterprise Orchestration", body: "Cross-functional control towers, KPI-linked process redesign, value-realisation tracking." },
  { title: "Digital Governance & KPI Accountability", body: "Performance transparency, dashboards, executive-grade reporting cadence." },
  { title: "Enterprise Architecture as an Execution Backbone", body: "Architecture aligned to KPIs, API ecosystems, integration discipline at enterprise scale." },
  { title: "Compliance Automation & Regulatory Digitisation", body: "E-invoicing, data governance, cyber-resilient operational models, digital maturity scoring." },
  { title: "Real-Time Performance Control Towers", body: "Continuous optimisation through real-time analytics across operations." },
  { title: "Autonomous Enterprise Models", body: "Cloud-native execution frameworks, security-by-design, self-optimising operating models." },
];

type Speaker = { name: string; title: string; org: string; photo: string };
const SPEAKERS: Speaker[] = [
  { name: "H.E. Dr. Abdullah Bin Sharaf Alghamdi", title: "President", org: "Saudi Data & AI Authority (SDAIA)", photo: "" },
  { name: "H.E. Eng. Ahmed Alsuwaiyan", title: "Governor & Board Member", org: "Digital Government Authority", photo: "" },
  { name: "Rayan Alnafisah", title: "Senior Director", org: "Royal Commission for Riyadh City", photo: "" },
  { name: "Neil Matthew Menezes", title: "VP — Maaden ERP Transformation Program", org: "Maaden", photo: "" },
  { name: "Sultan Moraished", title: "Group Head of Technology & Corporate Excellence", org: "Red Sea Global", photo: "" },
  { name: "Riyadh Alharbi", title: "Senior Director", org: "Royal Commission for Riyadh City", photo: "" },
  { name: "Ramesh Murugesan", title: "Head of IT Governance & Advisory", org: "Maaden", photo: "" },
  { name: "Riyadh Almohawes", title: "VP Strategy & Organisational Excellence", org: "EXPRO — Government Expenditure & Project Efficiency Authority", photo: "" },
];

type AgendaItem = {
  time: string;
  type: "Keynote" | "Panel" | "Fireside" | "Customer Story";
  title: string;
  subtitle?: string;
  bullets?: string[];
};
const AGENDA: AgendaItem[] = [
  {
    time: "09:00 – 09:20",
    type: "Keynote",
    title: "Opening Keynote — Operational Excellence in the Execution Decade",
    subtitle: "Vision 2030 roadmaps meet measurable performance — the new leadership mandate.",
  },
  {
    time: "09:20 – 10:10",
    type: "Panel",
    title: "Operational Excellence Leadership",
    bullets: [
      "Aligning enterprise KPIs with Vision 2030 objectives",
      "Managing execution risk in giga-projects",
      "Embedding governance into transformation portfolios",
      "Performance transparency & executive dashboards",
    ],
  },
  {
    time: "10:10 – 10:30",
    type: "Fireside",
    title: "Fireside Chat — From Strategy to Measurable Results",
    subtitle: "Governance redesign, automation at scale, and ROI you can read on a dashboard.",
  },
  {
    time: "10:50 – 11:35",
    type: "Panel",
    title: "AI & Intelligent Automation in Operations",
    bullets: [
      "Agentic AI in workflow orchestration",
      "Automation beyond RPA",
      "Compliance-integrated AI governance",
      "Measuring AI productivity & ROI",
      "Case signals: Aramco APS, SDAIA AI frameworks, STC automation programs",
    ],
  },
  {
    time: "11:35 – 12:00",
    type: "Customer Story",
    title: "Customer Success Story",
    subtitle: "An enterprise case study — cycle-time, cost, automation, compliance, in numbers.",
  },
  {
    time: "12:45 – 13:30",
    type: "Panel",
    title: "Process Mining & Enterprise Orchestration",
    bullets: [
      "Enterprise control towers",
      "Cross-functional workflow orchestration",
      "KPI-linked process redesign",
      "Value realisation tracking",
      "GovExPro benchmarking integration",
    ],
  },
  {
    time: "13:30 – 13:55",
    type: "Fireside",
    title: "Fireside Chat — Governance & Compliance Automation",
    subtitle: "E-invoicing, data governance, and cyber resilience as operating discipline.",
  },
  {
    time: "13:55 – 14:40",
    type: "Panel",
    title: "The Autonomous Enterprise",
    bullets: [
      "Cloud-native execution frameworks",
      "Enterprise architecture aligned to KPIs",
      "API ecosystems and integration discipline",
      "Security-by-design operational models",
      "Continuous optimisation through real-time analytics",
    ],
  },
  {
    time: "14:40 – 15:00",
    type: "Keynote",
    title: "Closing Keynote — Building Performance-Driven Institutions",
    subtitle: "Institutionalising excellence — frameworks, AI governance, sustainable execution.",
  },
];

const JOB_TITLES = [
  "Chief Operating Officers",
  "Chief Strategy Officers",
  "Chief Information Officers (CIOs)",
  "Chief Transformation Officers",
  "Heads of Operational Excellence",
  "Heads of Enterprise Architecture",
  "Heads of Digital Governance",
  "Program & Portfolio Governance Directors",
  "AI & Automation Leaders",
];

const INDUSTRIES = [
  "Government & Public Sector",
  "Energy & Utilities",
  "Banking & Financial Services",
  "Aviation",
  "Telecom",
  "Manufacturing",
  "Retail",
  "Giga Projects",
];

// Past series sponsor logos — pulled from the homepage S3 sponsor bucket
const SPONSORS = [
  { name: "RICS", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/RICS.png" },
  { name: "IQS", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/AIQS.png" },
  { name: "Celonis", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Celonis.png" },
  { name: "Profit.co", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/profit.co.png" },
  { name: "BotTeq", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/BOT-teq.png" },
  { name: "RE/SAND", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/redsand.png" },
  { name: "ARIS", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/aris.png" },
  { name: "SAP Signavio", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/sap-signavio.png" },
  { name: "Kafaa", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/KAfaa.png" },
  { name: "Minds Advisory", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/minds-advisory.png" },
  { name: "Agile Consulting", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/agile.png" },
  { name: "ISRAR", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/ISRAR.png" },
  { name: "Moxo", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/moxo.png" },
  { name: "SS&C Blue Prism", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/SS%26C.png" },
  { name: "Abu Dhabi University", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/abu-dhabi-university.png" },
  { name: "EY", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/EY.png" },
];

// OPEX First series testimonial shorts (matches homepage Testimonials data)
const OPEX_SHORTS = [
  { id: "WCsfo5Z6xVY", label: "OPEX First" },
  { id: "baCK3xnKh68", label: "OPEX First" },
  { id: "vMv0AfXMQL0", label: "OPEX First" },
  { id: "AefPAed0g-I", label: "OPEX First" },
  { id: "SH9Z1U2_rAM", label: "OPEX First" },
  { id: "wLgYOHHB6o4", label: "OPEX First" },
  { id: "2jpIlqo0HSY", label: "OPEX First" },
  { id: "SLkj5gO-LQ8", label: "OPEX First" },
];

const AWARDS = [
  {
    title: "Operational Excellence Award",
    body: "Recognises organisations or teams demonstrating outstanding implementation of OPEX methodologies — efficiency, cost reduction, and process optimisation gains.",
  },
  {
    title: "AI & Digital Transformation Excellence",
    body: "Honours pioneering use of AI, IoT, data analytics, automation, or emerging technologies driving operational efficiency, predictive insights, and scalable improvements.",
  },
  {
    title: "Sustainability & ESG Operational Excellence",
    body: "Awards integration of sustainable practices, environmental responsibility, social impact, and strong governance into core operations — verifiable carbon, resource, or ESG performance.",
  },
  {
    title: "Supply Chain & Procurement Optimisation",
    body: "Celebrates innovative strategies in supply chain resilience, procurement efficiency, vendor management, and logistics — cost savings, risk mitigation, and agility in volatile environments.",
  },
  {
    title: "Leadership in Operational & Change Excellence",
    body: "Recognises visionary leaders or change-management initiatives aligning people, culture, and strategy to foster high-performing teams, agile operations, and lasting transformation.",
  },
];

const WHATSAPP_URL = "https://wa.me/971545714377";

const CONTACT = [
  {
    name: "Sanjana Venugopal",
    title: "Producer",
    role: "Speaking Enquiries",
    email: "sanjana@eventsfirstgroup.com",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/Sanjana-Venugopal-new.jpg",
    photoPos: "50% 28%",
  },
  {
    name: "Mohammed Hassan",
    title: "Partnership Manager",
    role: "Sponsorship Enquiries",
    email: "hassan@eventsfirstgroup.com",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/hassan.jpg",
    photoPos: "50% 0%",
  },
  {
    name: "Mayur Methi",
    title: "Partnership Manager",
    role: "Sponsorship Enquiries",
    email: "mayur@eventsfirstgroup.com",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/Mayur-Methi.png",
    photoPos: "82% 35%",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useCountdown(target: Date) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setT({ d: 0, h: 0, m: 0, s: 0 });
        clearInterval(id);
        return;
      }
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

function Counter({ to, suffix = "", duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
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

function speakerInitials(name: string) {
  const parts = name.replace(/H\.E\.|Dr\.|Eng\./g, "").trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function typeColor(type: AgendaItem["type"]) {
  if (type === "Keynote") return MINT;
  if (type === "Customer Story") return MINT_BRIGHT;
  if (type === "Fireside") return V_BRIGHT;
  return V;
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  // Preload the LCP hero background — React dedupes, so calling on each render is safe
  preload(HERO_BG, { as: "image", fetchPriority: "high" });
  const cd = useCountdown(EVENT_DATE);

  return (
    <section
      id="overview"
      style={{
        position: "relative",
        minHeight: "100svh",
        background: BG_DARK,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Photographic backdrop — static, natural cover size */}
      <div
        className="opex-hero-bg"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Slight dark purple overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `${V_DIM}66`,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Top-only dark fade — gives the navbar a clean reading band */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "16vh",
          background: `linear-gradient(180deg, ${BG_DARK}cc 0%, ${BG_DARK}66 50%, transparent 100%)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Left-anchored dark fade — gives the content column a clean reading panel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${BG_DARK}ee 0%, ${BG_DARK}cc 28%, ${BG_DARK}66 50%, transparent 72%, ${BG_DARK}55 92%, ${BG_DARK}99 100%)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Bottom soft fade — clean handoff into the next section */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, transparent 65%, ${BG_DARK}99 92%, ${BG_DARK} 100%)`,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Headline bloom halo — soft violet glow anchored to the title position */}
      <div
        className="opex-hero-bloom"
        style={{
          position: "absolute",
          left: "clamp(24px, 5vw, 80px)",
          top: "44%",
          width: "clamp(360px, 38vw, 620px)",
          height: "clamp(220px, 24vw, 380px)",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${V}3a 0%, ${V}1a 35%, transparent 70%)`,
          filter: "blur(60px)",
          zIndex: 3,
          pointerEvents: "none",
          transform: "translateY(-50%)",
        }}
      />

      {/* Grain — premium magazine texture, very subtle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "200px 200px",
          opacity: 0.06,
          mixBlendMode: "overlay",
          zIndex: 4,
          pointerEvents: "none",
        }}
      />


      {/* Content */}
      <div style={{ position: "relative", zIndex: 5, padding: "clamp(80px, 10svh, 124px) clamp(24px, 5vw, 80px) clamp(140px, 17vh, 200px)", textAlign: "left" }}>
        <div style={{ maxWidth: 880, position: "relative", paddingLeft: "clamp(20px, 2.5vw, 36px)" }}>
          {/* Vertical architectural rule — anchors the whole column */}
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
            style={{
              position: "absolute",
              left: 0,
              top: 4,
              bottom: 4,
              width: 2,
              background: `linear-gradient(180deg, ${V_BRIGHT} 0%, ${V} 50%, transparent 100%)`,
              transformOrigin: "top",
              borderRadius: 1,
              boxShadow: `0 0 16px ${V_BRIGHT}55`,
            }}
          />

          {/* Edition stamp */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: V_BRIGHT,
              marginBottom: 30,
            }}
          >
            2nd Edition · Saudi Arabia
          </motion.div>

          {/* Headline — paired monumental */}
          <motion.h1
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 7vw, 100px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              margin: 0,
              textShadow: `0 6px 36px rgba(0,0,0,0.55)`,
            }}
          >
            <span style={{ display: "block" }}>OPEX FIRST</span>
            <span style={{ display: "block", marginTop: "0.04em" }}>
              SAUDI{" "}
              <span
                className="opex-shimmer-text"
                style={{
                  backgroundImage: `linear-gradient(110deg, ${V_BRIGHT} 0%, #ffffff 35%, ${V_PALE} 65%, ${V_BRIGHT} 100%)`,
                  backgroundSize: "250% 100%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                2026
              </span>
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(17px, 1.8vw, 23px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.9)",
              margin: "32px 0 0",
              maxWidth: 680,
              lineHeight: 1.35,
              letterSpacing: "-0.005em",
            }}
          >
            Operational Excellence — Where Leadership Vision Meets Technology Execution.
          </motion.p>

          {/* Meta line */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
              marginTop: 34,
              fontFamily: "var(--font-outfit)",
              fontSize: 13.5,
              fontWeight: 500,
              letterSpacing: "0.4px",
              color: "rgba(255,255,255,0.82)",
            }}
          >
            <span>15 September 2026</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: V_BRIGHT }} />
            <span>Riyadh, KSA</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: V_BRIGHT }} />
            <span>Full-Day Summit</span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 40 }}
          >
            <a
              href="#register"
              className="opex-cta-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 34px",
                borderRadius: 999,
                background: `linear-gradient(135deg, ${V_BRIGHT} 0%, ${V} 50%, ${V_DIM} 100%)`,
                color: "white",
                fontFamily: "var(--font-outfit)",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.3px",
                textDecoration: "none",
                boxShadow: `0 14px 36px ${V}66, inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.2)`,
                transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              Register Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <button
              type="button"
              className="opex-cta-ghost"
              onClick={() => {
                if (typeof window === "undefined") return;
                window.dispatchEvent(new CustomEvent("efg:set-form-tab", { detail: "sponsor" }));
                document.querySelector("#register")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 30px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.92)",
                fontFamily: "var(--font-outfit)",
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: "0.3px",
                border: "1px solid rgba(255,255,255,0.22)",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              Become a Sponsor
            </button>
          </motion.div>
        </div>
      </div>

      {/* EFG corner badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="opex-efg-badge"
        style={{ position: "absolute", bottom: 64, right: "clamp(24px, 5vw, 80px)", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
      >
        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "2px" }}>An Initiative By</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" decoding="async" src={EFG_LOGO} alt="Events First Group" width={120} height={48} style={{ height: 48, width: "auto", opacity: 0.7 }} />
      </motion.div>

      {/* Countdown bar */}
      <div className="opex-countdown-bar" style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20, padding: "20px 0" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "clamp(16px, 4vw, 40px)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hrs" }, { v: cd.m, l: "Min" }, { v: cd.s, l: "Sec" }].map((item, idx, arr) => (
              <div
                key={item.l}
                style={{
                  textAlign: "center",
                  padding: "0 clamp(14px, 2.6vw, 24px)",
                  borderRight: idx < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  minWidth: 56,
                }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.4vw, 30px)", fontWeight: 800, color: "white", display: "block", letterSpacing: "-1px", lineHeight: 1.05 }}>
                  {String(item.v).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 9, fontWeight: 600, color: FAINT, textTransform: "uppercase", letterSpacing: "2px" }}>{item.l}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: MINT, boxShadow: `0 0 12px ${MINT}` }} className="opex-pulse-dot" />
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "2px" }}>Registrations Open</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Event Overview — editorial three-band layout ───────────────────────────
function OpexVideoCard({ videoId, title }: { videoId: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="opex-v-card" onClick={() => !isPlaying && setIsPlaying(true)}>
      {isPlaying ? (
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
          <img loading="lazy" decoding="async" src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={title} className="opex-v-thumb" />
          <div className="opex-v-overlay" />
          <div className="opex-v-play-wrap">
            <div className="opex-v-play-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function EventOverview() {
  const ref = useRef<HTMLElement>(null);
  const signalsRef = useRef<HTMLDivElement>(null);
  const ledgerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // GSAP entrance choreography for Execution Signals + The Room
  useGSAP(() => {
    if (!inView) return;

    // ── Execution Signals — premium card reveal ─────────────────────────
    if (signalsRef.current) {
      const root = signalsRef.current;
      const cards = root.querySelectorAll<HTMLElement>(".opex-signal-card");
      const images = root.querySelectorAll<HTMLImageElement>(".opex-signal-media img");
      const tags = root.querySelectorAll<HTMLElement>(".opex-signal-tag");
      const headings = root.querySelectorAll<HTMLElement>(".opex-signal-body h3");
      const bodies = root.querySelectorAll<HTMLElement>(".opex-signal-body p");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (cards.length) {
        tl.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.94, clipPath: "inset(100% 0% 0% 0%)" },
          { y: 0, opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, stagger: 0.13, ease: "power4.out" },
          0
        );
      }
      if (images.length) {
        tl.fromTo(
          images,
          { scale: 1.18, filter: "saturate(0.4) brightness(0.7) blur(8px)" },
          { scale: 1, filter: "saturate(0.92) brightness(0.94) blur(0px)", duration: 1.4, stagger: 0.13, ease: "power3.out" },
          0.05
        );
      }
      if (tags.length) {
        tl.fromTo(
          tags,
          { y: -12, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.13, ease: "back.out(1.7)" },
          0.45
        );
      }
      if (headings.length) {
        tl.fromTo(
          headings,
          { y: 16, opacity: 0, filter: "blur(6px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, stagger: 0.1 },
          0.55
        );
      }
      if (bodies.length) {
        tl.fromTo(
          bodies,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.1 },
          0.7
        );
      }

      // Subtle scroll-driven parallax on the card images
      images.forEach((img) => {
        gsap.to(img, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".opex-signal-card"),
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });
    }

    // ── The Room — stats ledger reveal ──────────────────────────────────
    if (ledgerRef.current) {
      const root = ledgerRef.current;
      const rules = root.querySelectorAll<HTMLElement>(".opex-room-rule");
      const ticks = root.querySelectorAll<HTMLElement>(".opex-room-tick");
      const numbers = root.querySelectorAll<HTMLElement>(".opex-room-num");
      const labels = root.querySelectorAll<HTMLElement>(".opex-room-label");

      const tl2 = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.5 });
      if (rules.length) {
        tl2.fromTo(
          rules,
          { scaleX: 0, transformOrigin: "left center", opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.9, stagger: 0.07, ease: "power4.out" },
          0
        );
      }
      if (ticks.length) {
        tl2.fromTo(
          ticks,
          { scaleX: 0, transformOrigin: "left center", opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.55, stagger: 0.07, ease: "power4.out" },
          0.15
        );
      }
      if (numbers.length) {
        tl2.fromTo(
          numbers,
          { y: 28, opacity: 0, filter: "blur(10px)", scale: 0.9 },
          { y: 0, opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.95, stagger: 0.09, ease: "power3.out" },
          0.2
        );
      }
      if (labels.length) {
        tl2.fromTo(
          labels,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.09 },
          0.55
        );
      }
    }
    // useGSAP auto-reverts gsap animations + their attached ScrollTriggers on cleanup
  }, [inView]);

  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(180deg, ${BG_DARK} 0%, ${BG} 50%, ${BG_DARK} 100%)`,
        padding: "clamp(48px, 5.5vw, 80px) clamp(20px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "10%", left: "-5%", width: "40%", height: "70%", background: `radial-gradient(ellipse, ${V}10, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "0%", width: "35%", height: "60%", background: `radial-gradient(ellipse, ${V_BRIGHT}08, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionEyebrow inView={inView} label="Event Overview" />

        {/* ── BAND 1 — The Lede ───────────────────────────────────────────── */}
        <div className="opex-overview-lede" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "clamp(40px, 6vw, 80px)", alignItems: "end", marginBottom: "clamp(72px, 10vw, 120px)" }}>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4.6vw, 56px)",
              fontWeight: 800,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "-1.5px",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Saudi Arabia has entered the{" "}
            <span
              className="opex-shimmer-text"
              style={{
                backgroundImage: `linear-gradient(110deg, ${V_BRIGHT}, ${V_PALE}, ${V_BRIGHT})`,
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              execution decade
            </span>{" "}
            of Vision 2030.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(15px, 1.25vw, 17px)",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.7)",
              margin: 0,
              maxWidth: 460,
            }}
          >
            Across ministries, giga-projects, aviation, banking, telecom, and energy — the national focus has shifted from transformation strategy to measurable operational performance. AI-enabled workflows, real-time KPIs, and enterprise orchestration are now leadership mandates, not aspirations.
          </motion.p>
        </div>

        {/* ── Editorial pull quote — vertical bar, no box ────────────────── */}
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          style={{
            margin: "0 0 clamp(72px, 10vw, 120px) 0",
            paddingLeft: "clamp(20px, 2.4vw, 28px)",
            borderLeft: `2px solid ${V_BRIGHT}`,
            maxWidth: 880,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(20px, 2.2vw, 26px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.92)",
              margin: 0,
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
            }}
          >
            OPEX First Saudi 2026 is the only platform dedicated to propelling operational excellence to new heights — convening visionary leaders to co-create the next era of performance mastery.
          </p>
        </motion.blockquote>

        {/* ── BAND 2 — Past editions video showcase ──────────────────────── */}
        <div style={{ marginBottom: "clamp(72px, 10vw, 120px)" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32, gap: 20, flexWrap: "wrap" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ width: 32, height: 1, background: V_BRIGHT, opacity: 0.6 }} />
              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: V_BRIGHT }}>
                From the Stage — Past Editions
              </span>
            </div>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.5)", letterSpacing: "0.3px" }}>
              UAE 2026 · KSA 2025
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            className="opex-pe-grid"
          >
            {OPEX_PAST_EDITIONS.map((v, i) => (
              <div key={v.id} className="opex-pe-card">
                <div style={{
                  width: "100%",
                  padding: 3,
                  borderRadius: 22,
                  background: `linear-gradient(145deg, ${V}26 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 70%, ${V_BRIGHT}1f 100%)`,
                  boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 -2px 0 rgba(0,0,0,0.3) inset, 0 12px 40px rgba(0,0,0,0.4)`,
                }}>
                  <div style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: 19,
                    overflow: "hidden",
                    background: `linear-gradient(180deg, ${BG_CARD} 0%, ${BG_DARK} 100%)`,
                    border: "1px solid rgba(255,255,255,0.04)",
                    boxShadow: `inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.03)`,
                    position: "relative",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", zIndex: 3 }} />
                    <OpexVideoCard videoId={v.id} title={`OPEX First — ${v.city} ${v.year}`} />
                  </div>
                </div>
                <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: "-0.01em" }}>
                    {v.city}
                  </span>
                  <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "2px", color: V_BRIGHT, textTransform: "uppercase" }}>
                    {v.year}
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.6)", margin: "6px 0 0 0", maxWidth: 480 }}>
                  {v.caption}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── BAND 3 — Execution signals (image-led editorial cards) ────── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32, gap: 20, flexWrap: "wrap" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ width: 32, height: 1, background: V_BRIGHT, opacity: 0.6 }} />
              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: V_BRIGHT }}>
                Execution Signals — 2025/26
              </span>
            </div>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.5)", letterSpacing: "0.3px" }}>
              The mandates moving the needle right now.
            </span>
          </motion.div>

          <div ref={signalsRef} className="opex-signals-grid">
            {OVERVIEW_SIGNALS.map((s) => (
              <article key={s.name} className="opex-signal-card">
                <div className="opex-signal-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img loading="lazy" decoding="async" src={s.image} alt={`${s.name} — ${s.tag}`} />
                  <div className="opex-signal-grad" />
                  <div className="opex-signal-tag">
                    <span>{s.tag}</span>
                  </div>
                </div>
                <div className="opex-signal-body">
                  <h3>{s.name}</h3>
                  <p>{s.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── BAND 4 — The Room (stats ledger, Apple-clean) ──────────────── */}
        <div style={{ marginTop: "clamp(72px, 10vw, 120px)", position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.95, ease: EASE }}
            style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28, gap: 20, flexWrap: "wrap" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ width: 32, height: 1, background: V_BRIGHT, opacity: 0.6 }} />
              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: V_BRIGHT }}>
                The Room — Saudi 2026
              </span>
            </div>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.5)", letterSpacing: "0.3px" }}>
              The scale of the day, in numbers.
            </span>
          </motion.div>

          <div ref={ledgerRef} className="opex-room-ledger">
            {STATS.map((s) => (
              <div key={s.label} className="opex-room-stat">
                <span className="opex-room-rule" />
                <span className="opex-room-tick" />
                <div className="opex-room-num">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="opex-room-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Past-editions video card chrome */
        .opex-v-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: border-color 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-v-card:hover .opex-v-thumb { transform: scale(1.04); }
        .opex-v-card:hover .opex-v-play-btn {
          background: ${V}e6;
          border-color: ${V}66;
          transform: scale(1.2);
          box-shadow: 0 0 0 8px ${V}1f, 0 4px 16px ${V}40;
        }
        .opex-v-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .opex-v-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%); }
        .opex-v-play-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .opex-v-play-btn {
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          animation: opex-v-pulse 3s ease-in-out infinite;
        }
        @keyframes opex-v-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.08); }
          50%      { box-shadow: 0 0 0 6px rgba(255,255,255,0.04); }
        }

        /* Past-editions 2-up grid */
        .opex-pe-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(20px, 2.4vw, 32px);
        }
        @media (max-width: 760px) {
          .opex-pe-grid { grid-template-columns: 1fr; }
        }

        /* Execution signals — image-led editorial cards (Apple News vibe) */
        .opex-signals-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: clamp(14px, 1.4vw, 20px);
        }
        .opex-signal-card {
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: 22px;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 12px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04);
          transition: transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.55s ease, border-color 0.55s ease;
          will-change: transform;
        }
        .opex-signal-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 28px 56px rgba(0,0,0,0.55), 0 0 0 1px ${V}33, inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .opex-signal-media {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
        }
        .opex-signal-media img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.22,1,0.36,1), filter 0.55s ease;
          filter: saturate(0.92) contrast(1.04) brightness(0.94);
        }
        .opex-signal-card:hover .opex-signal-media img {
          transform: scale(1.06);
          filter: saturate(1) contrast(1.05) brightness(1);
        }
        .opex-signal-grad {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(6,6,14,0) 40%, rgba(6,6,14,0.55) 75%, rgba(6,6,14,0.92) 100%);
          pointer-events: none;
        }
        .opex-signal-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 2;
        }
        .opex-signal-tag span {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 999px;
          font-family: var(--font-dm-sans);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.95);
          background: rgba(124,58,237,0.32);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(10px) saturate(1.1);
          -webkit-backdrop-filter: blur(10px) saturate(1.1);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 8px rgba(0,0,0,0.3);
        }
        .opex-signal-body {
          padding: 18px 20px 22px;
          background: linear-gradient(180deg, ${BG_DARK} 0%, ${BG} 100%);
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .opex-signal-body h3 {
          font-family: var(--font-display);
          font-size: clamp(15px, 1.15vw, 17px);
          font-weight: 700;
          color: rgba(255,255,255,0.96);
          letter-spacing: -0.01em;
          line-height: 1.25;
          margin: 0 0 8px;
        }
        .opex-signal-body p {
          font-family: var(--font-outfit);
          font-size: 13px;
          line-height: 1.55;
          color: rgba(255,255,255,0.62);
          margin: 0;
        }
        @media (max-width: 1100px) {
          .opex-signals-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 720px) {
          .opex-signals-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .opex-signal-media { aspect-ratio: 1 / 1; }
        }
        @media (max-width: 440px) {
          .opex-signals-grid { grid-template-columns: 1fr; }
          .opex-signal-media { aspect-ratio: 16 / 10; }
        }

        /* The Room stats — premium gradient pill-cards */
        .opex-room-ledger {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: clamp(12px, 1.2vw, 18px);
          align-items: stretch;
        }
        .opex-room-stat {
          position: relative;
          padding: 26px 20px 22px;
          border-radius: 22px;
          overflow: hidden;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(ellipse 130% 80% at 30% 0%, ${V}33 0%, transparent 55%),
            radial-gradient(ellipse 110% 100% at 100% 100%, ${V_BRIGHT}1f 0%, transparent 60%),
            linear-gradient(165deg, rgba(124,58,237,0.18) 0%, rgba(20,16,42,0.72) 45%, rgba(8,8,18,0.9) 100%);
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            inset 0 -1px 0 rgba(0,0,0,0.45),
            0 18px 40px rgba(0,0,0,0.4),
            0 0 0 1px rgba(124,58,237,0.08);
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease, border-color 0.5s ease;
          will-change: transform;
        }
        .opex-room-stat:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.12);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.12),
            inset 0 -1px 0 rgba(0,0,0,0.5),
            0 28px 60px rgba(0,0,0,0.55),
            0 0 0 1px ${V}40,
            0 0 36px ${V}28;
        }
        /* Top glass sheen */
        .opex-room-stat::after {
          content: "";
          position: absolute;
          top: 0; left: 8%; right: 8%;
          height: 42%;
          background: linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 60%, transparent 100%);
          border-radius: 22px 22px 50% 50%;
          pointer-events: none;
          z-index: 1;
        }
        .opex-room-rule {
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          display: block;
          z-index: 2;
        }
        .opex-room-tick {
          position: absolute;
          top: 0; left: 50%;
          width: 60px;
          height: 2px;
          margin-left: -30px;
          background: linear-gradient(90deg, transparent, ${V_BRIGHT}, transparent);
          box-shadow: 0 0 14px ${V_BRIGHT}aa;
          display: block;
          z-index: 3;
          border-radius: 2px;
        }
        .opex-room-num {
          position: relative;
          z-index: 2;
          font-family: var(--font-display);
          font-size: clamp(34px, 3.8vw, 50px);
          font-weight: 800;
          letter-spacing: -2px;
          line-height: 1;
          margin-bottom: 12px;
          background-image: linear-gradient(135deg, #ffffff 0%, ${V_PALE} 60%, ${V_BRIGHT} 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .opex-room-label {
          position: relative;
          z-index: 2;
          font-family: var(--font-dm-sans);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        @media (max-width: 1100px) {
          .opex-room-ledger { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 540px) {
          .opex-room-ledger { grid-template-columns: repeat(2, 1fr); }
        }

        /* Lede band collapses on narrow viewports */
        @media (max-width: 860px) {
          .opex-overview-lede { grid-template-columns: 1fr !important; gap: 24px !important; align-items: start !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Market Pulse 3-column matrix ────────────────────────────────────────────
function MarketPulse() {
  const ref = useRef<HTMLElement>(null);
  const visibleRef = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const onScreen = useInView(visibleRef, { margin: "-20% 0px -20% 0px" });
  const [active, setActive] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 fill of active pill
  const bucket = MARKET_BUCKETS[active];

  // Auto-advance: 7s per bucket, paused on hover / off-screen / after manual click / reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || userInteracted || !onScreen || hovering) {
      setProgress(0);
      return;
    }

    const DURATION = 7000;
    const TICK = 50;
    let elapsed = 0;
    let lastTick = performance.now();
    let cancelled = false;
    let timeoutId: number | null = null;
    let rafId: number | null = null;

    const step = () => {
      if (cancelled) return;
      const now = performance.now();
      if (document.visibilityState === "visible") {
        elapsed += now - lastTick;
      }
      lastTick = now;

      const p = Math.min(elapsed / DURATION, 1);
      setProgress(p);

      if (elapsed >= DURATION) {
        setActive((a) => (a + 1) % MARKET_BUCKETS.length);
        elapsed = 0;
        setProgress(0);
      }
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        rafId = requestAnimationFrame(step);
      }, TICK);
    };

    timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      rafId = requestAnimationFrame(step);
    }, TICK);

    return () => {
      cancelled = true;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [userInteracted, onScreen, hovering]);

  const selectBucket = (i: number) => {
    setActive(i);
    setUserInteracted(true);
    setProgress(0);
  };

  return (
    <section
      ref={(node) => {
        ref.current = node;
        visibleRef.current = node;
      }}
      className="opex-cv"
      style={{
        background: `linear-gradient(180deg, ${BG_DARK}, ${BG})`,
        padding: "clamp(48px, 5.5vw, 80px) clamp(20px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)`, backgroundSize: "80px 80px", pointerEvents: "none", maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent 80%)" }} />
      <div style={{ position: "absolute", top: "10%", left: "-8%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${V}15, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "-8%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${V_BRIGHT}10, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative", zIndex: 2, width: "100%" }}>
        <SectionEyebrow inView={inView} label="Market Pulse" />
        <SectionTitle inView={inView}>
          The forces shaping <em className="opex-violet-shimmer">execution-decade</em> performance.
        </SectionTitle>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1.1vw, 16px)",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.6)",
            margin: "10px 0 0 0",
            maxWidth: 680,
          }}
        >
          Drawn from public mandates, private execution, and partner opportunity — three vantage points on the same accelerating market.
        </motion.p>

        {/* Single panel — paginates through buckets */}
        <div className="opex-mp-stage">
          <motion.article
            key={bucket.num}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="opex-mp-row"
          >
            <figure className="opex-mp-media">
              <div className="opex-mp-media-bezel">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img loading="lazy" decoding="async" src={bucket.image} alt={`${bucket.kicker} — OPEX First past edition`} />
                <div className="opex-mp-media-grad" />
                <div className="opex-mp-media-corner">
                  <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>
                    OPEX First — Past edition
                  </span>
                </div>
              </div>
            </figure>

            <div className="opex-mp-content">
              <div className="opex-mp-num">{bucket.num}</div>
              <div className="opex-mp-kicker">
                <span style={{ width: 28, height: 1, background: V_BRIGHT, opacity: 0.7, display: "inline-block" }} />
                <span>{bucket.kicker}</span>
              </div>
              <h3 className="opex-mp-title">{bucket.title}</h3>
              <p className="opex-mp-lede">{bucket.lede}</p>
              <ul className="opex-mp-list">
                {bucket.items.map((it, idx) => (
                  <motion.li
                    key={`${bucket.num}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="opex-mp-item"
                  >
                    <span className="opex-mp-bullet" />
                    <span>{it}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.article>
        </div>

        {/* Pagination — premium glass pills with auto-advance progress fill */}
        <div
          className="opex-mp-pager"
          role="tablist"
          aria-label="Market Pulse pagination"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {MARKET_BUCKETS.map((b, i) => {
            const isActive = i === active;
            return (
              <button
                key={b.num}
                role="tab"
                aria-selected={isActive}
                onClick={() => selectBucket(i)}
                className={`opex-mp-pill ${isActive ? "is-active" : ""}`}
                type="button"
              >
                {/* Auto-advance progress fill (left to right) — visible only on active pill */}
                <span
                  className="opex-mp-pill-progress"
                  style={{ transform: `scaleX(${isActive ? progress : 0})` }}
                  aria-hidden
                />
                <span className="opex-mp-pill-medallion">
                  <span>{b.num}</span>
                </span>
                <span className="opex-mp-pill-text">
                  <span className="opex-mp-pill-name">{b.kicker}</span>
                  <span className="opex-mp-pill-sub">{i === 0 ? "Public mandates" : i === 1 ? "On-the-ground" : "Where to play"}</span>
                </span>
                <span className="opex-mp-pill-arrow" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .opex-mp-stage {
          margin-top: clamp(24px, 3vw, 36px);
          position: relative;
        }
        .opex-mp-row {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: clamp(28px, 4vw, 56px);
          align-items: center;
        }

        /* Image bezel — premium chrome edge */
        .opex-mp-media { position: relative; margin: 0; }
        .opex-mp-media-bezel {
          position: relative;
          aspect-ratio: 16 / 10;
          max-height: 52svh;
          padding: 3px;
          border-radius: 22px;
          overflow: hidden;
          background: linear-gradient(145deg, ${V}40 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.02) 65%, ${V_BRIGHT}30 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            inset 0 -1px 0 rgba(0,0,0,0.4),
            0 24px 56px rgba(0,0,0,0.5),
            0 0 48px ${V}1a;
        }
        .opex-mp-media-bezel > img {
          position: absolute;
          inset: 3px;
          width: calc(100% - 6px);
          height: calc(100% - 6px);
          object-fit: cover;
          border-radius: 19px;
          filter: saturate(0.95) brightness(0.96);
        }
        .opex-mp-media-grad {
          position: absolute;
          inset: 3px;
          border-radius: 19px;
          background: linear-gradient(180deg, rgba(6,6,14,0.05) 0%, rgba(6,6,14,0) 35%, rgba(6,6,14,0.5) 80%, rgba(6,6,14,0.85) 100%);
          pointer-events: none;
        }
        .opex-mp-media-corner {
          position: absolute;
          left: 18px;
          bottom: 16px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(10px) saturate(1.1);
          -webkit-backdrop-filter: blur(10px) saturate(1.1);
        }

        /* Content column */
        .opex-mp-content { display: flex; flex-direction: column; }
        .opex-mp-num {
          font-family: var(--font-display);
          font-size: clamp(38px, 5vw, 64px);
          font-weight: 800;
          line-height: 0.9;
          letter-spacing: -2px;
          background-image: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, ${V}45 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          margin: 0 0 6px;
          user-select: none;
        }
        .opex-mp-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-dm-sans);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: ${V_BRIGHT};
          margin-bottom: 12px;
        }
        .opex-mp-title {
          font-family: var(--font-display);
          font-size: clamp(20px, 2vw, 28px);
          font-weight: 800;
          color: rgba(255,255,255,0.96);
          letter-spacing: -0.8px;
          line-height: 1.2;
          margin: 0 0 12px;
          max-width: 520px;
        }
        .opex-mp-lede {
          font-family: var(--font-outfit);
          font-size: clamp(13px, 1vw, 14.5px);
          line-height: 1.55;
          color: rgba(255,255,255,0.68);
          margin: 0 0 16px;
          max-width: 520px;
        }
        .opex-mp-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0; }
        .opex-mp-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 9px 0;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-family: var(--font-outfit);
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255,255,255,0.78);
        }
        .opex-mp-item:first-child { border-top: 1px solid rgba(255,255,255,0.14); }
        .opex-mp-bullet {
          flex-shrink: 0;
          width: 6px;
          height: 6px;
          margin-top: 7px;
          border-radius: 50%;
          background: ${V_BRIGHT};
          box-shadow: 0 0 10px ${V_BRIGHT}aa, inset 0 0 4px rgba(255,255,255,0.5);
        }

        /* Pagination — premium glass pills with progress fill */
        .opex-mp-pager {
          margin-top: clamp(20px, 2.5vw, 32px);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(10px, 1.2vw, 16px);
        }
        .opex-mp-pill {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px 14px 14px;
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.05),
            0 6px 18px rgba(0,0,0,0.25);
          cursor: pointer;
          color: rgba(255,255,255,0.7);
          transition:
            transform 0.45s cubic-bezier(0.22,1,0.36,1),
            background 0.45s ease,
            border-color 0.45s ease,
            box-shadow 0.45s ease,
            color 0.4s ease;
          backdrop-filter: blur(10px) saturate(1.1);
          -webkit-backdrop-filter: blur(10px) saturate(1.1);
        }
        .opex-mp-pill:hover {
          transform: translateY(-2px);
          background: linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%);
          border-color: rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.92);
        }
        .opex-mp-pill.is-active {
          background:
            radial-gradient(ellipse 120% 110% at 0% 50%, ${V}55 0%, transparent 65%),
            linear-gradient(135deg, ${V}38 0%, ${V_DIM}38 100%);
          border-color: ${V_BRIGHT}55;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 0 0 1px ${V_BRIGHT}22,
            0 12px 28px rgba(0,0,0,0.4),
            0 0 32px ${V}33;
          color: rgba(255,255,255,0.98);
          transform: translateY(0);
        }
        .opex-mp-pill-progress {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, ${V_BRIGHT}38 0%, ${V}28 100%);
          transform-origin: left center;
          transform: scaleX(0);
          transition: transform 0.05s linear;
          pointer-events: none;
          z-index: -1;
        }
        .opex-mp-pill-medallion {
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22) 0%, transparent 55%),
            linear-gradient(145deg, ${V} 0%, ${V_DIM} 100%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.28),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 4px 12px ${V}66;
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease;
        }
        .opex-mp-pill.is-active .opex-mp-pill-medallion {
          transform: scale(1.05);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.4),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 6px 16px ${V_BRIGHT}80,
            0 0 18px ${V_BRIGHT}55;
        }
        .opex-mp-pill-medallion span {
          font-family: var(--font-dm-sans);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          color: white;
        }
        .opex-mp-pill-text {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }
        .opex-mp-pill-name {
          font-family: var(--font-display);
          font-size: clamp(15px, 1.3vw, 17px);
          font-weight: 700;
          letter-spacing: -0.3px;
          color: inherit;
          line-height: 1.1;
        }
        .opex-mp-pill-sub {
          font-family: var(--font-outfit);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3px;
          color: rgba(255,255,255,0.45);
          line-height: 1.1;
          transition: color 0.4s ease;
        }
        .opex-mp-pill.is-active .opex-mp-pill-sub { color: rgba(255,255,255,0.7); }
        .opex-mp-pill-arrow {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.35);
          transition: color 0.4s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-mp-pill:hover .opex-mp-pill-arrow { color: rgba(255,255,255,0.7); transform: translateX(2px); }
        .opex-mp-pill.is-active .opex-mp-pill-arrow { color: ${V_BRIGHT}; transform: translateX(3px); }

        @media (max-width: 880px) {
          .opex-mp-row {
            grid-template-columns: 1fr !important;
            gap: 22px;
          }
          .opex-mp-media-bezel { aspect-ratio: 16 / 10; }
          .opex-mp-num { font-size: clamp(34px, 11vw, 56px); }
          .opex-mp-pager { grid-template-columns: 1fr; gap: 8px; }
          .opex-mp-pill { padding: 12px 16px 12px 12px; }
          .opex-mp-pill-medallion { width: 34px; height: 34px; }
        }
      `}</style>
    </section>
  );
}

// ─── Strategic Focus Areas ───────────────────────────────────────────────────
function FocusAreas() {
  const ref = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // GSAP — dramatic entrance + continuous spotlight sweep + 3D tilt
  useGSAP(() => {
    if (!inView || !gridRef.current) return;
    const root = gridRef.current;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".opex-fa-card"));
    const medallions = root.querySelectorAll<HTMLElement>(".opex-fa-medallion");
    const titles = root.querySelectorAll<HTMLElement>(".opex-fa-title");
    const bodies = root.querySelectorAll<HTMLElement>(".opex-fa-body");
    const glows = root.querySelectorAll<HTMLElement>(".opex-fa-glow");

    // ── Dramatic staggered entrance ─────────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (cards.length) {
      tl.fromTo(
        cards,
        { y: 120, opacity: 0, scale: 0.6, rotate: -6, clipPath: "inset(100% 0% 0% 0%)" },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.3,
          stagger: { each: 0.11, from: "start" },
          ease: "back.out(1.4)",
        },
        0
      );
    }
    if (medallions.length) {
      tl.fromTo(
        medallions,
        { scale: 3.2, opacity: 0, rotate: -180 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.95, stagger: 0.11, ease: "back.out(2.2)" },
        0.35
      );
      tl.fromTo(
        medallions,
        { boxShadow: "0 0 0 0 rgba(159,106,255,0.0)" },
        {
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.3), 0 4px 12px ${V}66, 0 0 32px ${V_BRIGHT}80`,
          duration: 0.5,
          stagger: 0.11,
          yoyo: true,
          repeat: 1,
        },
        0.45
      );
    }
    if (titles.length) {
      tl.fromTo(
        titles,
        { y: 24, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.85, stagger: 0.11 },
        0.55
      );
    }
    if (bodies.length) {
      tl.fromTo(
        bodies,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.11 },
        0.7
      );
    }
    if (glows.length) {
      tl.fromTo(
        glows,
        { opacity: 0, scale: 0.4 },
        { opacity: 0.4, scale: 1, duration: 1.4, stagger: 0.11, ease: "power3.out" },
        0.4
      );
    }

    // ── Continuous spotlight sweep — cycles through cards forever ──────
    const spotlightDelay = (cards.length * 0.11 + 1.5);
    const spotlightTl = gsap.timeline({ repeat: -1, repeatDelay: 2, delay: spotlightDelay });

    cards.forEach((card, i) => {
      const med = card.querySelector<HTMLElement>(".opex-fa-medallion");
      const glow = card.querySelector<HTMLElement>(".opex-fa-glow");
      const startAt = i * 0.55;

      spotlightTl.to(card, {
        scale: 1.05,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.4), 0 28px 60px rgba(0,0,0,0.55), 0 0 60px ${V_BRIGHT}88, 0 0 0 1px ${V_BRIGHT}88`,
        duration: 0.4,
        ease: "power2.out",
      }, startAt);

      if (med) {
        spotlightTl.to(med, {
          scale: 1.18,
          rotate: 360,
          duration: 0.75,
          ease: "power3.inOut",
        }, startAt);
      }

      if (glow) {
        spotlightTl.to(glow, {
          opacity: 1,
          scale: 1.4,
          duration: 0.5,
          ease: "power2.out",
        }, startAt);
      }

      spotlightTl.to(card, {
        scale: 1,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35), 0 14px 32px rgba(0,0,0,0.32)",
        duration: 0.45,
        ease: "power2.out",
      }, startAt + 0.4);

      if (med) {
        spotlightTl.to(med, {
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        }, startAt + 0.5);
      }

      if (glow) {
        spotlightTl.to(glow, {
          opacity: 0.4,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        }, startAt + 0.5);
      }
    });

    // ── Mouse-driven 3D tilt on each card (deeper + bigger lift) ──────
    const listenerHandles: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];
    cards.forEach((card) => {
      const med = card.querySelector<HTMLElement>(".opex-fa-medallion");
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / (r.width / 2);
        const dy = (e.clientY - cy) / (r.height / 2);
        gsap.to(card, {
          rotateX: dy * -8,
          rotateY: dx * 8,
          y: -12,
          scale: 1.03,
          duration: 0.4,
          ease: "power2.out",
          transformPerspective: 900,
          transformOrigin: "center center",
          overwrite: "auto",
        });
        if (med) {
          gsap.to(med, {
            x: dx * 6,
            y: dy * 6,
            scale: 1.15,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };
      const onLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          overwrite: "auto",
        });
        if (med) {
          gsap.to(med, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      };
      card.addEventListener("mousemove", onMove, { passive: true });
      card.addEventListener("mouseleave", onLeave, { passive: true });
      listenerHandles.push({ el: card, move: onMove, leave: onLeave });
    });

    return () => {
      // Remove DOM listeners we attached (useGSAP auto-handles its animations + ScrollTriggers)
      listenerHandles.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [inView]);

  return (
    <section
      ref={ref}
      id="themes"
      style={{
        background: `linear-gradient(180deg, ${BG} 0%, ${BG_CARD} 50%, ${BG} 100%)`,
        padding: "clamp(48px, 5.5vw, 80px) clamp(20px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "5%", right: "-10%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${V}15, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "-10%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${V_BRIGHT}10, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionEyebrow inView={inView} label="2026 Strategic Focus Areas" />
        <SectionTitle inView={inView}>
          Eight conversations driving <em className="opex-violet-shimmer">the next 12 months</em>.
        </SectionTitle>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1.1vw, 16px)",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.6)",
            margin: "10px 0 0 0",
            maxWidth: 680,
          }}
        >
          The agenda spans the full operational stack — from boardroom mandates to live control-tower execution.
        </motion.p>

        {/* Premium 4×2 glass card grid — compact, luxury feel */}
        <div ref={gridRef} className="opex-fa-grid" style={{ marginTop: "clamp(36px, 4.5vw, 56px)" }}>
          {FOCUS_AREAS.map((f, i) => (
            <article key={f.title} className="opex-fa-card">
              <div className="opex-fa-medallion">
                <span>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="opex-fa-content">
                <h3 className="opex-fa-title">{f.title}</h3>
                <p className="opex-fa-body">{f.body}</p>
              </div>
              <div className="opex-fa-glow" aria-hidden />
            </article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .opex-fa-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(14px, 1.4vw, 20px);
        }
        .opex-fa-card {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 22px 22px 22px 20px;
          border-radius: 20px;
          transform-style: preserve-3d;
          background:
            radial-gradient(ellipse 120% 90% at 0% 0%, ${V}26 0%, transparent 55%),
            radial-gradient(ellipse 100% 90% at 100% 100%, ${V_BRIGHT}1a 0%, transparent 60%),
            linear-gradient(165deg, rgba(124,58,237,0.10) 0%, rgba(20,16,42,0.55) 50%, rgba(8,8,18,0.78) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            0 14px 32px rgba(0,0,0,0.32);
          transition:
            transform 0.5s cubic-bezier(0.22,1,0.36,1),
            border-color 0.5s ease,
            box-shadow 0.5s ease;
          will-change: transform;
        }
        /* Glass sheen on top */
        .opex-fa-card::before {
          content: "";
          position: absolute;
          top: 0; left: 6%; right: 6%;
          height: 38%;
          background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 60%, transparent 100%);
          border-radius: 20px 20px 50% 50%;
          pointer-events: none;
          z-index: 0;
        }
        .opex-fa-card:hover {
          transform: translateY(-5px);
          border-color: ${V_BRIGHT}40;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.12),
            inset 0 -1px 0 rgba(0,0,0,0.4),
            0 22px 50px rgba(0,0,0,0.5),
            0 0 32px ${V}33;
        }
        .opex-fa-card:hover .opex-fa-glow { opacity: 1; }
        .opex-fa-card:hover .opex-fa-medallion {
          transform: scale(1.06);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.4),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 6px 18px ${V_BRIGHT}80,
            0 0 18px ${V_BRIGHT}55;
        }

        /* Bottom violet glow that intensifies on hover */
        .opex-fa-glow {
          position: absolute;
          bottom: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 140%;
          height: 90%;
          background: radial-gradient(ellipse at center, ${V}40 0%, transparent 60%);
          filter: blur(32px);
          opacity: 0.35;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.5s ease;
        }

        /* Number medallion */
        .opex-fa-medallion {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22) 0%, transparent 55%),
            linear-gradient(145deg, ${V} 0%, ${V_DIM} 100%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.28),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 4px 12px ${V}66;
          margin-bottom: 16px;
          position: relative;
          z-index: 2;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease;
        }
        .opex-fa-medallion span {
          font-family: var(--font-dm-sans);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          color: white;
        }

        /* Content */
        .opex-fa-content { position: relative; z-index: 2; }
        .opex-fa-title {
          font-family: var(--font-display);
          font-size: clamp(15px, 1.2vw, 17px);
          font-weight: 700;
          color: rgba(255,255,255,0.96);
          letter-spacing: -0.4px;
          line-height: 1.25;
          margin: 0 0 8px;
        }
        .opex-fa-body {
          font-family: var(--font-outfit);
          font-size: 12.5px;
          line-height: 1.55;
          color: rgba(255,255,255,0.6);
          margin: 0;
        }

        @media (max-width: 1100px) {
          .opex-fa-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .opex-fa-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

// ─── Speakers ────────────────────────────────────────────────────────────────
function Speakers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="speakers"
      style={{
        background: `linear-gradient(180deg, ${BG} 0%, ${BG_DARK} 100%)`,
        padding: "clamp(48px, 5.5vw, 80px) clamp(20px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "20%", left: "-5%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${V}14, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${MINT}10, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionEyebrow inView={inView} label="Speakers & Advisors" />
        <SectionTitle inView={inView}>Voices shaping the <em className="opex-violet-shimmer">execution agenda</em>.</SectionTitle>

        <div className="opex-speakers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22, marginTop: 56 }}>
          {SPEAKERS.map((sp, i) => (
            <motion.div
              key={sp.name}
              initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: EASE }}
              style={{
                position: "relative",
                borderRadius: 22,
                padding: 4,
                background: `linear-gradient(160deg, rgba(159,106,255,0.55) 0%, rgba(159,106,255,0.15) 28%, rgba(255,255,255,0.04) 60%, rgba(0,0,0,0.4) 100%)`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 56px rgba(0,0,0,0.4), 0 0 32px ${V}20`,
              }}
            >
              <div
                style={{
                  borderRadius: 19,
                  background: `linear-gradient(180deg, ${BG_DARK} 0%, #060616 100%)`,
                  overflow: "hidden",
                  position: "relative",
                  border: `1px solid ${V}22`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -2px 12px rgba(0,0,0,0.5)",
                }}
              >
                {/* Photo area */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "3/4",
                    background: sp.photo
                      ? `url(${sp.photo}) center/cover`
                      : `linear-gradient(160deg, ${V_DIM} 0%, ${BG_DARK} 60%, #000 100%)`,
                    overflow: "hidden",
                  }}
                >
                  {/* Duotone violet overlay */}
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 30%, ${BG_DARK}aa 70%, ${BG_DARK} 100%)`, mixBlendMode: "multiply" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${V}10 0%, transparent 50%)`, mixBlendMode: "overlay" }} />

                  {/* Initials placeholder */}
                  {!sp.photo && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontSize: 64,
                        fontWeight: 800,
                        color: V_BRIGHT,
                        opacity: 0.38,
                        letterSpacing: "-2px",
                      }}
                    >
                      {speakerInitials(sp.name)}
                    </div>
                  )}

                  {/* Top reflection */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)` }} />
                </div>

                {/* Name chip */}
                <div
                  style={{
                    padding: "16px 16px 18px",
                    borderTop: `1px solid ${RULE}`,
                    background: `linear-gradient(180deg, rgba(124,58,237,0.08), rgba(0,0,0,0.4))`,
                  }}
                >
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, color: "white", margin: "0 0 4px", lineHeight: 1.25, letterSpacing: "-0.2px" }}>
                    {sp.name}
                  </h3>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11.5, color: MUTE, margin: "0 0 4px", lineHeight: 1.4 }}>
                    {sp.title}
                  </p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 600, color: V_BRIGHT, margin: 0, letterSpacing: "1px", textTransform: "uppercase", lineHeight: 1.3 }}>
                    {sp.org}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Agenda ──────────────────────────────────────────────────────────────────
function Agenda() {
  const ref = useRef<HTMLElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const morning = AGENDA.slice(0, 5);
  const afternoon = AGENDA.slice(5);

  // GSAP entrance: session cards stagger in
  useGSAP(() => {
    if (!inView || !colsRef.current) return;
    const root = colsRef.current;
    const cards = root.querySelectorAll<HTMLElement>(".opex-ag-card");

    if (cards.length) {
      gsap.fromTo(
        cards,
        { y: 24, opacity: 0, scale: 0.97, clipPath: "inset(100% 0% 0% 0%)" },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.85,
          stagger: 0.07,
          ease: "power4.out",
        }
      );
    }
  }, [inView]);

  const typeIcon = (type: AgendaItem["type"]) => {
    if (type === "Keynote") {
      return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
        </svg>
      );
    }
    if (type === "Panel") {
      return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    }
    if (type === "Fireside") {
      return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    }
    // Customer Story
    return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" aria-hidden>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  };

  const renderCard = (a: AgendaItem, i: number) => {
    const accent = typeColor(a.type);
    return (
      <article key={i} className="opex-ag-card" style={{ ["--accent" as never]: accent }}>
        <span className="opex-ag-card-edge" aria-hidden />
        <span className="opex-ag-card-shimmer" aria-hidden />
        <span className="opex-ag-card-frame" aria-hidden />
        <span className="opex-ag-card-glow" aria-hidden />
        <div className="opex-ag-card-inner">
          <div className="opex-ag-head">
            <div className="opex-ag-time-block">
              <span className="opex-ag-time-main">{a.time.split(/\s*[–-]\s*/)[0]}</span>
              <span className="opex-ag-time-sep">→</span>
              <span className="opex-ag-time-end">{a.time.split(/\s*[–-]\s*/)[1] ?? ""}</span>
            </div>
            <span className="opex-ag-type">
              <span className="opex-ag-type-icon">{typeIcon(a.type)}</span>
              {a.type}
            </span>
          </div>

          <h3 className="opex-ag-title">{a.title}</h3>
          {a.subtitle && <p className="opex-ag-sub">{a.subtitle}</p>}
          {a.bullets && (
            <ul className="opex-ag-bullets">
              {a.bullets.map((b, bi) => (
                <li key={bi}>
                  <span className="opex-ag-bullet-dot" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    );
  };

  return (
    <section
      ref={ref}
      id="agenda"
      className="opex-cv"
      style={{
        background: `linear-gradient(180deg, ${BG_DARK}, ${BG} 50%, ${BG_DARK})`,
        padding: "clamp(48px, 5.5vw, 80px) clamp(20px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)`, backgroundSize: "100% 80px", pointerEvents: "none", opacity: 0.6 }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionEyebrow inView={inView} label="Agenda · 15 September 2026" />
        <SectionTitle inView={inView}>
          One day. <em className="opex-violet-shimmer">Nine sessions</em>. Built for action.
        </SectionTitle>

        <div ref={colsRef} className="opex-ag-cols">
          <div className="opex-ag-col">
            <div className="opex-ag-stack">{morning.map(renderCard)}</div>
          </div>
          <div className="opex-ag-col">
            <div className="opex-ag-stack">{afternoon.map((a, i) => renderCard(a, i + morning.length))}</div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .opex-ag-cols {
          margin-top: clamp(36px, 4.5vw, 56px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(28px, 3vw, 48px);
        }
        .opex-ag-col { display: flex; flex-direction: column; }

        /* Stack of cards inside a column */
        .opex-ag-stack { display: flex; flex-direction: column; gap: 14px; }

        /* Premium session card */
        .opex-ag-card {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border-radius: 16px;
          padding: 16px 18px 18px;
          background:
            radial-gradient(ellipse 120% 60% at 0% 0%, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 60%),
            linear-gradient(165deg, rgba(124,58,237,0.06) 0%, rgba(20,16,42,0.55) 50%, rgba(8,8,18,0.78) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            0 10px 26px rgba(0,0,0,0.35);
          transition:
            transform 0.5s cubic-bezier(0.22,1,0.36,1),
            border-color 0.5s ease,
            box-shadow 0.5s ease;
        }
        .opex-ag-card::before {
          /* glass sheen at the top */
          content: "";
          position: absolute;
          top: 0; left: 6%; right: 6%;
          height: 36%;
          background: linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 60%, transparent 100%);
          border-radius: 16px 16px 50% 50%;
          pointer-events: none;
          z-index: 0;
        }
        .opex-ag-card:hover {
          transform: translateY(-3px);
          border-color: color-mix(in srgb, var(--accent) 35%, rgba(255,255,255,0.1));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            inset 0 -1px 0 rgba(0,0,0,0.4),
            0 18px 40px rgba(0,0,0,0.5),
            0 0 28px color-mix(in srgb, var(--accent) 22%, transparent);
        }
        /* Top edge accent — type-coded glow line */
        .opex-ag-card-edge {
          position: absolute;
          top: 0; left: 8%; right: 8%;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, var(--accent) 20%, var(--accent) 80%, transparent);
          box-shadow: 0 0 10px color-mix(in srgb, var(--accent) 60%, transparent);
          z-index: 2;
          opacity: 0.85;
          transition: opacity 0.5s ease;
        }
        .opex-ag-card:hover .opex-ag-card-edge { opacity: 1; }
        /* Hover shimmer — runs left to right across the card */
        .opex-ag-card-shimmer {
          position: absolute;
          top: 0; left: -60%;
          width: 50%;
          height: 100%;
          background: linear-gradient(100deg, transparent, color-mix(in srgb, var(--accent) 12%, rgba(255,255,255,0.04)) 40%, color-mix(in srgb, var(--accent) 18%, rgba(255,255,255,0.06)) 50%, color-mix(in srgb, var(--accent) 12%, rgba(255,255,255,0.04)) 60%, transparent);
          transform: skewX(-18deg);
          pointer-events: none;
          transition: left 0.9s cubic-bezier(0.22,1,0.36,1);
          z-index: 1;
        }
        .opex-ag-card:hover .opex-ag-card-shimmer { left: 130%; }
        /* Inner inset frame — carved bezel feel */
        .opex-ag-card-frame {
          position: absolute;
          inset: 6px;
          border-radius: 11px;
          border: 1px solid rgba(255,255,255,0.04);
          pointer-events: none;
          z-index: 1;
          transition: border-color 0.5s ease;
        }
        .opex-ag-card:hover .opex-ag-card-frame {
          border-color: color-mix(in srgb, var(--accent) 18%, rgba(255,255,255,0.06));
        }
        /* Bottom violet glow that intensifies on hover */
        .opex-ag-card-glow {
          position: absolute;
          bottom: -60%;
          left: 50%;
          transform: translateX(-50%);
          width: 130%;
          height: 90%;
          background: radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 25%, transparent) 0%, transparent 60%);
          filter: blur(28px);
          opacity: 0.25;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.5s ease;
        }
        .opex-ag-card:hover .opex-ag-card-glow { opacity: 0.5; }
        .opex-ag-card-inner { position: relative; z-index: 2; }

        /* Header row: time block + type pill */
        .opex-ag-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }
        .opex-ag-time-block {
          display: inline-flex;
          align-items: baseline;
          gap: 7px;
          font-family: var(--font-display);
        }
        /* Embossed gradient time — primary visual anchor */
        .opex-ag-time-main {
          font-size: clamp(17px, 1.5vw, 20px);
          font-weight: 800;
          letter-spacing: -0.5px;
          background-image: linear-gradient(180deg, #ffffff 0%, color-mix(in srgb, var(--accent) 70%, #ffffff) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          text-shadow: 0 1px 0 rgba(0,0,0,0.4);
        }
        .opex-ag-time-sep {
          font-size: 11px;
          font-weight: 600;
          color: color-mix(in srgb, var(--accent) 60%, rgba(255,255,255,0.3));
        }
        .opex-ag-time-end {
          font-size: 12.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.52);
        }
        /* Type pill with inline icon */
        .opex-ag-type {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 11px 5px 9px;
          border-radius: 999px;
          background:
            radial-gradient(ellipse 100% 100% at 0% 50%, color-mix(in srgb, var(--accent) 25%, transparent) 0%, transparent 70%),
            color-mix(in srgb, var(--accent) 12%, rgba(255,255,255,0.02));
          border: 1px solid color-mix(in srgb, var(--accent) 38%, transparent);
          font-family: var(--font-dm-sans);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.94);
          backdrop-filter: blur(10px) saturate(1.1);
          -webkit-backdrop-filter: blur(10px) saturate(1.1);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            inset 0 -1px 0 rgba(0,0,0,0.2),
            0 2px 8px rgba(0,0,0,0.25),
            0 0 12px color-mix(in srgb, var(--accent) 22%, transparent);
          transition: box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-ag-card:hover .opex-ag-type {
          transform: translateX(-2px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.2),
            0 4px 14px rgba(0,0,0,0.35),
            0 0 18px color-mix(in srgb, var(--accent) 38%, transparent);
        }
        .opex-ag-type-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--accent) 30%, rgba(0,0,0,0.4));
          color: color-mix(in srgb, var(--accent) 90%, #ffffff);
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 50%, transparent);
        }
        .opex-ag-type-icon svg {
          display: block;
        }

        /* Body content */
        .opex-ag-title {
          font-family: var(--font-display);
          font-size: clamp(15px, 1.25vw, 17px);
          font-weight: 700;
          color: rgba(255,255,255,0.97);
          letter-spacing: -0.3px;
          line-height: 1.3;
          margin: 0 0 6px;
        }
        .opex-ag-sub {
          font-family: var(--font-outfit);
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255,255,255,0.82);
          margin: 0;
        }
        .opex-ag-bullets {
          margin: 10px 0 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .opex-ag-bullets li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-family: var(--font-outfit);
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          line-height: 1.5;
        }
        .opex-ag-bullet-dot {
          flex-shrink: 0;
          margin-top: 7px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 80%, transparent);
        }

        @media (max-width: 880px) {
          .opex-ag-cols { grid-template-columns: 1fr; gap: 28px; }
        }
      `}</style>
    </section>
  );
}

// ─── Who Should Attend ──────────────────────────────────────────────────────
function WhoAttends() {
  const ref = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // GSAP: panels glide in, then pills cascade
  useGSAP(() => {
    if (!inView || !gridRef.current) return;
    const root = gridRef.current;
    const panels = root.querySelectorAll<HTMLElement>(".opex-wa-panel");
    const heads = root.querySelectorAll<HTMLElement>(".opex-wa-head");
    const pills = root.querySelectorAll<HTMLElement>(".opex-wa-pill");

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (panels.length) {
      tl.fromTo(
        panels,
        { y: 40, opacity: 0, scale: 0.95, clipPath: "inset(100% 0% 0% 0%)" },
        { y: 0, opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, stagger: 0.15, ease: "power4.out" },
        0
      );
    }
    if (heads.length) {
      tl.fromTo(heads, { y: 16, opacity: 0, filter: "blur(6px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, stagger: 0.15 }, 0.3);
    }
    if (pills.length) {
      tl.fromTo(pills, { y: 16, opacity: 0, scale: 0.85 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.04, ease: "back.out(1.6)" }, 0.5);
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      id="who-attends"
      className="opex-cv"
      style={{
        background: `linear-gradient(180deg, ${BG_DARK} 0%, ${BG} 100%)`,
        padding: "clamp(48px, 5.5vw, 80px) clamp(20px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "20%", right: "-8%", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${V}10, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "-8%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${V_BRIGHT}10, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionEyebrow inView={inView} label="Who Should Attend" />
        <SectionTitle inView={inView}>
          The room is built for <em className="opex-violet-shimmer">operators who own outcomes</em>.
        </SectionTitle>

        <div ref={gridRef} className="opex-wa-grid">
          {/* ── Target Job Titles ─────────────────────────────────────── */}
          <article className="opex-wa-panel">
            <div className="opex-wa-panel-inner">
              <span className="opex-wa-panel-rim" aria-hidden />
              <span className="opex-wa-panel-underglow" aria-hidden />
              <div className="opex-wa-head">
                <div className="opex-wa-medallion">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="opex-wa-head-text">
                  <span className="opex-wa-kicker">Target Roles</span>
                  <span className="opex-wa-count">{JOB_TITLES.length} senior titles</span>
                </div>
              </div>
              <div className="opex-wa-pills">
                {JOB_TITLES.map((it) => (
                  <span key={it} className="opex-wa-pill">{it}</span>
                ))}
              </div>
            </div>
          </article>

          {/* ── Target Industries ─────────────────────────────────────── */}
          <article className="opex-wa-panel">
            <div className="opex-wa-panel-inner">
              <span className="opex-wa-panel-rim" aria-hidden />
              <span className="opex-wa-panel-underglow" aria-hidden />
              <div className="opex-wa-head">
                <div className="opex-wa-medallion">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div className="opex-wa-head-text">
                  <span className="opex-wa-kicker">Target Industries</span>
                  <span className="opex-wa-count">{INDUSTRIES.length} sectors</span>
                </div>
              </div>
              <div className="opex-wa-pills">
                {INDUSTRIES.map((it) => (
                  <span key={it} className="opex-wa-pill">{it}</span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>

      <style jsx global>{`
        .opex-wa-grid {
          margin-top: clamp(36px, 4.5vw, 56px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(20px, 2.4vw, 32px);
        }

        /* Glass panel — chrome bezel removed, just the recessed glass interior */
        .opex-wa-panel {
          position: relative;
          isolation: isolate;
        }
        .opex-wa-panel-inner {
          position: relative;
          border-radius: 22px;
          padding: 28px 28px 32px;
          overflow: hidden;
          background:
            radial-gradient(ellipse 120% 80% at 0% 0%, ${V}26 0%, transparent 55%),
            radial-gradient(ellipse 100% 100% at 100% 100%, ${V_BRIGHT}1f 0%, transparent 60%),
            linear-gradient(165deg, rgba(124,58,237,0.10) 0%, rgba(20,16,42,0.6) 50%, rgba(8,8,18,0.85) 100%);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.35),
            inset 0 0 40px rgba(0,0,0,0.25),
            0 18px 44px rgba(0,0,0,0.4),
            0 0 36px ${V}14;
        }
        /* Liquid glass sheen at top of recessed panel */
        .opex-wa-panel-inner::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 35%, transparent 70%);
          backdrop-filter: blur(2px) saturate(1.2);
          -webkit-backdrop-filter: blur(2px) saturate(1.2);
          pointer-events: none;
          z-index: 0;
          border-radius: 23px 23px 40% 40% / 23px 23px 12% 12%;
        }
        /* Specular corner glint */
        .opex-wa-panel-inner::after {
          content: "";
          position: absolute;
          top: 8px; left: 14px;
          width: 56px; height: 56px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.36), transparent 60%);
          pointer-events: none;
          z-index: 1;
          filter: blur(2px);
        }
        /* Top hairline accent */
        .opex-wa-panel-rim {
          position: absolute;
          top: 0; left: 8%; right: 8%;
          height: 1px;
          background: linear-gradient(90deg, transparent, ${V_BRIGHT}cc, transparent);
          box-shadow: 0 0 16px ${V_BRIGHT}66;
          z-index: 2;
        }
        /* Bottom rim underglow */
        .opex-wa-panel-underglow {
          position: absolute;
          bottom: 0; left: 12%; right: 12%;
          height: 1px;
          background: linear-gradient(90deg, transparent, ${V}66, transparent);
          box-shadow: 0 0 18px ${V}55;
          z-index: 2;
        }

        /* Header */
        .opex-wa-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          position: relative;
          z-index: 3;
        }
        /* Photoreal 3D medallion — pearl-bead skeu */
        .opex-wa-medallion {
          flex-shrink: 0;
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 32% 28%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.18) 18%, transparent 38%),
            radial-gradient(circle at 70% 80%, rgba(0,0,0,0.5) 0%, transparent 50%),
            linear-gradient(145deg, ${V_BRIGHT} 0%, ${V} 45%, ${V_DIM} 100%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow:
            inset 0 2px 0 rgba(255,255,255,0.4),
            inset 0 -2px 0 rgba(0,0,0,0.35),
            inset 0 0 0 1px rgba(255,255,255,0.18),
            0 8px 18px ${V}80,
            0 2px 4px rgba(0,0,0,0.4),
            0 0 0 1px rgba(0,0,0,0.25);
        }
        /* Top specular highlight on the bead */
        .opex-wa-medallion::before {
          content: "";
          position: absolute;
          top: 4px; left: 8px;
          width: 18px; height: 12px;
          border-radius: 999px;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.15) 50%, transparent 80%);
          filter: blur(1px);
          pointer-events: none;
        }
        /* Bottom rim shadow on the bead */
        .opex-wa-medallion::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 999px;
          box-shadow: inset 0 -3px 4px rgba(0,0,0,0.25);
          pointer-events: none;
        }
        .opex-wa-medallion svg { position: relative; z-index: 1; filter: drop-shadow(0 1px 0 rgba(0,0,0,0.4)); }

        .opex-wa-head-text { display: flex; flex-direction: column; gap: 2px; }
        .opex-wa-kicker {
          font-family: var(--font-display);
          font-size: clamp(17px, 1.5vw, 20px);
          font-weight: 800;
          letter-spacing: -0.5px;
          color: rgba(255,255,255,0.96);
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        .opex-wa-count {
          font-family: var(--font-dm-sans);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: ${V_BRIGHT};
          text-shadow: 0 0 12px ${V_BRIGHT}55;
        }

        /* Pill cluster */
        .opex-wa-pills {
          position: relative;
          z-index: 3;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        /* Premium engraved pill — recessed groove + multi-layer glass face */
        .opex-wa-pill {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          padding: 11px 20px;
          border-radius: 999px;
          background:
            linear-gradient(180deg,
              rgba(255,255,255,0.10) 0%,
              rgba(255,255,255,0.03) 35%,
              rgba(0,0,0,0.05) 60%,
              rgba(0,0,0,0.22) 100%
            );
          border: 1px solid rgba(0,0,0,0.55);
          font-family: var(--font-outfit);
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.92);
          letter-spacing: 0.1px;
          backdrop-filter: blur(14px) saturate(1.3);
          -webkit-backdrop-filter: blur(14px) saturate(1.3);
          /* engraved feel: deep inner shadows top + bottom + carved hairline + outer subtle highlight */
          box-shadow:
            inset 0 1.5px 0 rgba(255,255,255,0.22),
            inset 0 -1.5px 1px rgba(0,0,0,0.45),
            inset 0 0 0 1px rgba(255,255,255,0.06),
            inset 0 0 12px rgba(0,0,0,0.18),
            0 1px 0 rgba(255,255,255,0.06),
            0 6px 14px rgba(0,0,0,0.3);
          text-shadow:
            0 1px 1px rgba(0,0,0,0.55),
            0 0 16px rgba(124,58,237,0.0);
          transition:
            transform 0.45s cubic-bezier(0.22,1,0.36,1),
            background 0.45s ease,
            border-color 0.45s ease,
            box-shadow 0.45s ease,
            color 0.4s ease,
            text-shadow 0.4s ease;
          cursor: default;
        }
        /* Layer 1 — Glass cap highlight on top */
        .opex-wa-pill::before {
          content: "";
          position: absolute;
          top: 1px; left: 6%; right: 6%;
          height: 50%;
          border-radius: 999px;
          background:
            linear-gradient(180deg,
              rgba(255,255,255,0.22) 0%,
              rgba(255,255,255,0.06) 45%,
              transparent 90%
            );
          pointer-events: none;
          z-index: 0;
        }
        /* Layer 2 — Hover shimmer streak */
        .opex-wa-pill::after {
          content: "";
          position: absolute;
          top: 0; left: -55%;
          width: 45%;
          height: 100%;
          background: linear-gradient(100deg,
            transparent,
            rgba(255,255,255,0.22) 45%,
            rgba(255,255,255,0.32) 50%,
            rgba(255,255,255,0.22) 55%,
            transparent
          );
          transform: skewX(-18deg);
          pointer-events: none;
          transition: left 0.85s cubic-bezier(0.22,1,0.36,1);
          z-index: 1;
        }
        .opex-wa-pill > * { position: relative; z-index: 2; }
        .opex-wa-pill:hover {
          transform: translateY(-2px) scale(1.02);
          color: rgba(255,255,255,1);
          background:
            linear-gradient(180deg,
              ${V_BRIGHT}40 0%,
              ${V}26 40%,
              ${V_DIM}1f 70%,
              rgba(0,0,0,0.18) 100%
            );
          border-color: ${V_BRIGHT}66;
          text-shadow:
            0 1px 1px rgba(0,0,0,0.55),
            0 0 16px ${V_BRIGHT}80;
          box-shadow:
            inset 0 1.5px 0 rgba(255,255,255,0.4),
            inset 0 -1.5px 1px rgba(0,0,0,0.4),
            inset 0 0 0 1px ${V_BRIGHT}55,
            inset 0 0 18px ${V}33,
            0 1px 0 rgba(255,255,255,0.12),
            0 10px 26px rgba(0,0,0,0.42),
            0 0 28px ${V}77,
            0 0 0 1px ${V_BRIGHT}66;
        }
        .opex-wa-pill:hover::after {
          left: 130%;
        }

        @media (max-width: 880px) {
          .opex-wa-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

// ─── Past Series Sponsors — marquee strip (homepage style) ─────────────────
function SeriesSponsors() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Split into 2 rows for alternating-direction marquee
  const half = Math.ceil(SPONSORS.length / 2);
  const row1 = SPONSORS.slice(0, half);
  const row2 = SPONSORS.slice(half);

  return (
    <section
      ref={ref}
      id="sponsors"
      className="opex-cv"
      style={{
        background: `linear-gradient(180deg, ${BG} 0%, ${BG_DARK} 100%)`,
        padding: "clamp(48px, 5.5vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 5vw, 64px)", position: "relative", zIndex: 2 }}>
        <SectionEyebrow inView={inView} label="Past Series Sponsors" />
        <SectionTitle inView={inView}>
          The brands that helped build the <em className="opex-violet-shimmer">OPEX First</em> stage.
        </SectionTitle>

        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 14,
            color: FAINT,
            margin: "16px 0 0",
            maxWidth: 720,
          }}
        >
          A snapshot of partners that have backed the OPEX First series across previous editions. Saudi 2026 sponsorship slate confirms in waves — get in early.
        </p>
      </div>

      {/* Marquee — 2 rows, alternating directions, homepage-style logo treatment */}
      <div className="opex-ss-marquee" style={{ marginTop: "clamp(36px, 4.5vw, 56px)" }}>
        {/* Edge fades */}
        <div className="opex-ss-fade opex-ss-fade-left" />
        <div className="opex-ss-fade opex-ss-fade-right" />

        {/* Row 1 — scrolls left */}
        <div className="opex-ss-track-wrap">
          <div className="opex-ss-track opex-ss-track-left">
            {[...row1, ...row1].map((s, i) => (
              <div key={`r1-${s.name}-${i}`} className="opex-ss-logo-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.logo}
                  alt={`${s.name} — past OPEX First series sponsor`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right (opposite direction) */}
        <div className="opex-ss-track-wrap" style={{ marginTop: 20 }}>
          <div className="opex-ss-track opex-ss-track-right">
            {[...row2, ...row2].map((s, i) => (
              <div key={`r2-${s.name}-${i}`} className="opex-ss-logo-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.logo}
                  alt={`${s.name} — past OPEX First series sponsor`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .opex-ss-marquee {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .opex-ss-fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: clamp(60px, 10vw, 120px);
          z-index: 10;
          pointer-events: none;
        }
        .opex-ss-fade-left {
          left: 0;
          background: linear-gradient(to right, ${BG_DARK} 0%, transparent 100%);
        }
        .opex-ss-fade-right {
          right: 0;
          background: linear-gradient(to left, ${BG_DARK} 0%, transparent 100%);
        }
        .opex-ss-track-wrap {
          overflow: hidden;
        }
        .opex-ss-track {
          display: flex;
          width: max-content;
        }
        .opex-ss-track-left {
          animation: opex-ss-scroll-left 65s linear infinite;
        }
        .opex-ss-track-right {
          animation: opex-ss-scroll-right 75s linear infinite;
        }
        .opex-ss-marquee:hover .opex-ss-track-left,
        .opex-ss-marquee:hover .opex-ss-track-right {
          animation-play-state: paused;
        }
        .opex-ss-logo-item {
          flex-shrink: 0;
          width: 320px;
          height: 120px;
          margin: 0 clamp(22px, 2.8vw, 44px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.55;
          border-radius: 12px;
          padding: 0;
          transition: opacity 0.4s ease, background 0.4s ease, padding 0.4s ease;
        }
        .opex-ss-logo-item img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          filter: brightness(0) invert(1);
          transition: filter 0.4s ease;
        }
        .opex-ss-logo-item:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.92);
          padding: 14px 22px;
        }
        .opex-ss-logo-item:hover img {
          filter: none;
        }

        @keyframes opex-ss-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes opex-ss-scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (max-width: 720px) {
          .opex-ss-logo-item { width: 220px; height: 90px; margin: 0 20px; }
          .opex-ss-track-left { animation-duration: 50s; }
          .opex-ss-track-right { animation-duration: 60s; }
        }
      `}</style>
    </section>
  );
}

// ─── Past Edition Gallery ──────────────────────────────────────────────────
const GALLERY_PHOTOS = [
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1666.JPG", caption: "Keynote · OPEX First UAE", area: "hero" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1535.JPG", caption: "On the floor", area: "a" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1810.JPG", caption: "Networking", area: "b" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1848.JPG", caption: "The room", area: "c" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1751.JPG", caption: "Official walkthrough", area: "d" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1698.JPG", caption: "Recognition moment", area: "e" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0330.JPG", caption: "Trophy presentation", area: "f" },
];

function PastGallery() {
  const ref = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // GSAP entrance: cards reveal with clipPath stagger
  useGSAP(() => {
    if (!inView || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".opex-gal-card");
    const imgs = gridRef.current.querySelectorAll<HTMLImageElement>(".opex-gal-card img");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (cards.length) {
      tl.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.94, clipPath: "inset(100% 0% 0% 0%)" },
        { y: 0, opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1, stagger: 0.08, ease: "power4.out" },
        0
      );
    }
    if (imgs.length) {
      tl.fromTo(
        imgs,
        { scale: 1.18, filter: "saturate(0.45) brightness(0.7) blur(8px)" },
        { scale: 1, filter: "saturate(0.92) brightness(0.94) blur(0px)", duration: 1.4, stagger: 0.08, ease: "power3.out" },
        0.05
      );
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      id="gallery"
      className="opex-cv"
      style={{
        background: `linear-gradient(180deg, ${BG_DARK} 0%, ${BG} 100%)`,
        padding: "clamp(48px, 5.5vw, 80px) clamp(20px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "10%", right: "-8%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${V}12, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "-8%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${V_BRIGHT}10, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionEyebrow inView={inView} label="In Frames" />
        <SectionTitle inView={inView}>
          Moments from <em className="opex-violet-shimmer">past editions</em> — the room, the stage, the floor.
        </SectionTitle>

        <div ref={gridRef} className="opex-gal-grid">
          {GALLERY_PHOTOS.map((p, i) => (
            <figure key={i} className={`opex-gal-card opex-gal-${p.area}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" decoding="async" src={p.src} alt={p.caption} />
              <div className="opex-gal-grad" />
              <figcaption className="opex-gal-caption">
                <span className="opex-gal-caption-dot" />
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .opex-gal-grid {
          margin-top: clamp(36px, 4.5vw, 56px);
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: clamp(150px, 16vw, 220px);
          gap: 14px;
        }
        .opex-gal-card {
          position: relative;
          isolation: isolate;
          margin: 0;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 32px rgba(0,0,0,0.4);
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease, border-color 0.5s ease;
          will-change: transform;
        }
        .opex-gal-card:hover {
          transform: translateY(-4px);
          border-color: ${V_BRIGHT}40;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.1),
            0 24px 56px rgba(0,0,0,0.55),
            0 0 32px ${V}33;
        }
        .opex-gal-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.92) brightness(0.94);
          transition: transform 1s cubic-bezier(0.22,1,0.36,1), filter 0.5s ease;
        }
        .opex-gal-card:hover img {
          transform: scale(1.06);
          filter: saturate(1) brightness(1);
        }
        .opex-gal-grad {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(6,6,14,0.05) 0%, rgba(6,6,14,0) 35%, rgba(6,6,14,0.55) 80%, rgba(6,6,14,0.85) 100%);
          pointer-events: none;
          z-index: 1;
        }
        .opex-gal-caption {
          position: absolute;
          left: 16px;
          bottom: 14px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 7px 14px;
          border-radius: 999px;
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(10px) saturate(1.1);
          -webkit-backdrop-filter: blur(10px) saturate(1.1);
          font-family: var(--font-dm-sans);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.92);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.45s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-gal-card:hover .opex-gal-caption {
          opacity: 1;
          transform: translateY(0);
        }
        .opex-gal-caption-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: ${V_BRIGHT};
          box-shadow: 0 0 10px ${V_BRIGHT};
        }

        /* Bento layout — 12-col grid */
        .opex-gal-hero { grid-column: span 6; grid-row: span 2; }
        .opex-gal-a    { grid-column: span 3; grid-row: span 1; }
        .opex-gal-b    { grid-column: span 3; grid-row: span 1; }
        .opex-gal-c    { grid-column: span 6; grid-row: span 1; }
        .opex-gal-d    { grid-column: span 4; grid-row: span 1; }
        .opex-gal-e    { grid-column: span 4; grid-row: span 1; }
        .opex-gal-f    { grid-column: span 4; grid-row: span 1; }

        @media (max-width: 880px) {
          .opex-gal-grid {
            grid-template-columns: repeat(6, 1fr);
            grid-auto-rows: clamp(140px, 22vw, 200px);
          }
          .opex-gal-hero { grid-column: span 6; grid-row: span 2; }
          .opex-gal-a, .opex-gal-b { grid-column: span 3; }
          .opex-gal-c { grid-column: span 6; }
          .opex-gal-d, .opex-gal-e, .opex-gal-f { grid-column: span 2; }
        }
        @media (max-width: 560px) {
          .opex-gal-grid {
            grid-template-columns: 1fr 1fr;
            grid-auto-rows: clamp(130px, 38vw, 180px);
          }
          .opex-gal-hero { grid-column: span 2; grid-row: span 2; }
          .opex-gal-a, .opex-gal-b, .opex-gal-c, .opex-gal-d, .opex-gal-e, .opex-gal-f {
            grid-column: span 1; grid-row: span 1;
          }
          .opex-gal-c { grid-column: span 2; }
        }
      `}</style>
    </section>
  );
}

// ─── Voices from the Room — YouTube shorts (homepage Testimonials style) ──
function OpexShortCard({ videoId, label }: { videoId: string; label: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="opex-vr-card" onClick={() => !isPlaying && setIsPlaying(true)}>
      {isPlaying ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            decoding="async"
            src={`https://img.youtube.com/vi/${videoId}/oar2.jpg`}
            alt={`${label} testimonial`}
            className="opex-vr-thumb"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
          />
          <div className="opex-vr-overlay" />
          <div className="opex-vr-play-wrap">
            <div className="opex-vr-play-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
          <div className="opex-vr-label">
            <span style={{
              background: `linear-gradient(135deg, ${V}4d 0%, ${V}26 100%)`,
              borderColor: `${V}4d`,
            }}>{label}</span>
          </div>
        </>
      )}
    </div>
  );
}

function PastShorts() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // First 5 in showcase, rest in marquee — same shape as homepage Testimonials
  const showcaseVideos = OPEX_SHORTS.slice(0, 5);
  const marqueeVideos = OPEX_SHORTS.slice(5);

  return (
    <section
      ref={ref}
      id="voices"
      className="opex-cv"
      style={{
        background: `linear-gradient(180deg, ${BG_DARK} 0%, ${BG} 50%, ${BG_DARK} 100%)`,
        padding: "clamp(48px, 5.5vw, 80px) 0 clamp(32px, 4vw, 56px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="opex-vr-glow" />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)", position: "relative", zIndex: 2 }}>
        <SectionEyebrow inView={inView} label="Voices from the Room" />
        <SectionTitle inView={inView}>
          What past <em className="opex-violet-shimmer">OPEX First</em> attendees say.
        </SectionTitle>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1.1vw, 16px)",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.6)",
            margin: "12px 0 clamp(28px, 3.5vw, 40px) 0",
            maxWidth: 520,
          }}
        >
          Hear directly from leaders who attended OPEX First summits across the GCC.
        </motion.p>

        {/* Row 1 — 5 cards staggered (alternating heights, center hero) */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="opex-vr-showcase"
        >
          {showcaseVideos.map((v, i) => (
            <div key={v.id} className={`opex-vr-slot opex-vr-slot-${i % 2 === 0 ? "tall" : "short"} ${i === 2 ? "opex-vr-slot-hero" : ""}`}>
              <OpexShortCard videoId={v.id} label={v.label} />
            </div>
          ))}
        </motion.div>

        {/* Row 2 — 3 cards staggered (matches process-intelligence sister edition) */}
        {marqueeVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="opex-vr-showcase opex-vr-showcase-row2"
          >
            {marqueeVideos.map((v, i) => (
              <div key={v.id} className={`opex-vr-slot opex-vr-slot-${i % 2 === 0 ? "short" : "tall"} ${i === 1 ? "opex-vr-slot-hero" : ""}`}>
                <OpexShortCard videoId={v.id} label={v.label} />
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        .opex-vr-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 40% at 50% 100%, ${V}14 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 20% 50%, ${V_BRIGHT}10 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 80% 50%, ${V}10 0%, transparent 50%);
        }

        /* Staggered Showcase */
        .opex-vr-showcase {
          display: flex;
          gap: 14px;
          align-items: center;
          justify-content: center;
          margin-bottom: clamp(28px, 3vw, 40px);
        }
        .opex-vr-showcase-row2 {
          margin-top: -10px;
          margin-bottom: 0;
        }
        .opex-vr-slot {
          flex-shrink: 0;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-vr-slot:hover { transform: translateY(-6px); }
        .opex-vr-slot-tall { width: 200px; height: 340px; }
        .opex-vr-slot-short { width: 180px; height: 270px; }
        .opex-vr-slot-hero.opex-vr-slot-tall { width: 220px; height: 380px; }

        /* Card */
        .opex-vr-card {
          position: relative; width: 100%; height: 100%;
          border-radius: 18px; overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: border-color 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
        }
        .opex-vr-card:hover {
          border-color: ${V}50;
          box-shadow: 0 16px 48px ${V}25, inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .opex-vr-card:hover .opex-vr-thumb { transform: scale(1.06); }
        .opex-vr-card:hover .opex-vr-play-btn {
          background: ${V}e6;
          border-color: ${V}66;
          transform: scale(1.2);
          box-shadow: 0 0 0 8px ${V}1f, 0 4px 16px ${V}40;
        }
        .opex-vr-card:hover .opex-vr-label span {
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.3);
        }

        .opex-vr-thumb {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: center 20%;
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-vr-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%);
        }
        .opex-vr-play-wrap {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .opex-vr-play-btn {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          animation: opex-vr-pulse 3s ease-in-out infinite;
        }
        @keyframes opex-vr-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.08); }
          50%      { box-shadow: 0 0 0 6px rgba(255,255,255,0.04); }
        }
        .opex-vr-label {
          position: absolute; bottom: 10px; left: 10px; z-index: 2;
        }
        .opex-vr-label span {
          font-family: var(--font-outfit); font-size: 8px; font-weight: 600;
          letter-spacing: 1.2px; text-transform: uppercase; color: #fff;
          padding: 4px 10px; border-radius: 50px;
          border-style: solid; border-width: 1px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 10px rgba(0,0,0,0.25);
          transition: box-shadow 0.3s ease;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .opex-vr-showcase {
            flex-wrap: nowrap;
            overflow-x: auto;
            justify-content: flex-start;
            padding-bottom: 8px;
          }
          .opex-vr-showcase::-webkit-scrollbar { display: none; }
          .opex-vr-slot-tall { width: 130px; height: 220px; }
          .opex-vr-slot-short { width: 120px; height: 180px; }
          .opex-vr-slot-hero.opex-vr-slot-tall { width: 145px; height: 250px; }
        }
        @media (max-width: 560px) {
          .opex-vr-slot-tall { width: 110px; height: 185px; }
          .opex-vr-slot-short { width: 100px; height: 155px; }
          .opex-vr-slot-hero.opex-vr-slot-tall { width: 120px; height: 210px; }
        }
      `}</style>
    </section>
  );
}

// ─── 2026 Awards — editorial split (image left, awards list right) ────────
function Awards() {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nomRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const nomInView = useInView(nomRef, { once: true, margin: "-80px" });

  const [formData, setFormData] = useState({
    orgName: "",
    contactName: "",
    email: "",
    phone: "",
    category: "",
    reason: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  // Saudi Arabia (+966) is index 1 in COUNTRY_CODES
  const [awardsSelectedCountry, setAwardsSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[1]);
  const [awardsPhoneError, setAwardsPhoneError] = useState<string | null>(null);
  const [awardsEmailError, setAwardsEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleNomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (formData.email && !isWorkEmail(formData.email)) {
      setAwardsEmailError("Please use your work email address");
      return;
    }
    const phoneErr = validatePhone(formData.phone, awardsSelectedCountry);
    if (phoneErr) {
      setAwardsPhoneError(phoneErr);
      return;
    }
    setSubmitting(true);
    const result = await submitForm({
      type: "awards",
      full_name: formData.contactName,
      email: formData.email,
      company: formData.orgName,
      phone: `${awardsSelectedCountry.code} ${formData.phone}`,
      event_name: "OPEX First Saudi Arabia 2026",
      metadata: {
        award_category: formData.category,
        nomination_reason: formData.reason,
        nominee_company: formData.orgName,
      },
      website: "",
    });
    setSubmitting(false);
    if (result.success) {
      setFormSubmitted(true);
    } else {
      setFormError(result.error || "Something went wrong. Please try again.");
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "16px 20px",
    borderRadius: 14,
    backgroundColor: focusedField === field ? "rgba(124,58,237,0.10)" : "rgba(255,255,255,0.025)",
    border: `1px solid ${focusedField === field ? `${V_BRIGHT}55` : "rgba(255,255,255,0.08)"}`,
    boxShadow: focusedField === field
      ? `0 0 22px ${V}1f, inset 0 1px 0 rgba(255,255,255,0.05)`
      : "inset 0 1px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.2)",
    color: "white",
    fontFamily: "var(--font-outfit)",
    fontSize: 14.5,
    fontWeight: 400,
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
  });

  // GSAP cinematic entrance: 5 columns wipe in with mask + blur stagger
  useGSAP(() => {
    if (!inView || !listRef.current) return;
    const cols = listRef.current.querySelectorAll<HTMLElement>(".opex-cat-col");
    const nums = listRef.current.querySelectorAll<HTMLElement>(".opex-cat-num");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (cols.length) {
      tl.fromTo(cols,
        { y: 32, opacity: 0, clipPath: "inset(100% 0% 0% 0%)", filter: "blur(10px)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)", duration: 1.05, stagger: 0.12, ease: "power4.out" },
        0
      );
    }
    if (nums.length) {
      tl.fromTo(nums,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, stagger: 0.12, ease: "back.out(1.6)" },
        0.15
      );
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      id="awards"
      className="opex-cv"
      style={{
        background: `linear-gradient(180deg, ${BG_DARK} 0%, #110a1f 50%, ${BG_DARK} 100%)`,
        padding: "clamp(48px, 5.5vw, 80px) clamp(20px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "50%", background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${V}10, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionEyebrow inView={inView} label="2026 Awards" />
        <SectionTitle inView={inView}>
          Honouring those who turn methodology into{" "}
          <em className="opex-violet-shimmer">
            measurable performance
          </em>.
        </SectionTitle>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1.1vw, 16px)",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.6)",
            margin: "10px 0 0",
            maxWidth: 720,
          }}
        >
          Five categories shining a spotlight on the visionaries and organisations leading the way in operational excellence and technological advancement.
        </motion.p>

        {/* ── Cinematic horizontal category banner ── */}
        <div ref={listRef} className="opex-cat-banner">
          {AWARDS.map((a, i) => (
            <article key={a.title} className="opex-cat-col">
              <div className="opex-cat-spotlight" />
              <div className="opex-cat-rail" />
              <span className="opex-cat-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="opex-cat-divider" />
              <h3 className="opex-cat-title">{a.title}</h3>
              <p className="opex-cat-body">{a.body}</p>
            </article>
          ))}
        </div>

        {/* ── Unified gradient-bezel container — photo + nomination form ── */}
        <div ref={nomRef} className="opex-nom-wrap">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.985 }}
            animate={nomInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            className="opex-nom-bezel"
          >
            <div className="opex-nom-grid">
              {/* LEFT — photo card */}
              <div className="opex-nom-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  loading="lazy"
                  decoding="async"
                  src="https://efg-final.s3.eu-north-1.amazonaws.com/events/Opex%20First%20UAE/4N8A1950.JPG"
                  alt="Awards moment from a past OPEX First edition — recognising excellence in operational leadership"
                />
                {/* Bottom vignette */}
                <div className="opex-nom-photo-vignette" />
                {/* Violet accent overlay */}
                <div className="opex-nom-photo-tint" />
                {/* Live status chip */}
                <div className="opex-nom-photo-chip">
                  <span className="opex-nom-pulse" />
                  <span className="opex-nom-chip-text">Honouring Excellence</span>
                </div>
              </div>

              {/* RIGHT — liquid glass form panel */}
              <div className="opex-nom-form">
                {/* Top reflection line */}
                <div className="opex-nom-form-top" />
                {/* Ambient refraction blurs */}
                <div className="opex-nom-form-blur opex-nom-form-blur-tr" />
                <div className="opex-nom-form-blur opex-nom-form-blur-bl" />
                {/* Sheen */}
                <div className="opex-nom-form-sheen" />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
                    <span style={{ width: 26, height: 1, background: V_BRIGHT }} />
                    <span style={{
                      fontFamily: "var(--font-outfit)", fontSize: 10.5, fontWeight: 700,
                      letterSpacing: "3px", textTransform: "uppercase", color: V_BRIGHT,
                    }}>
                      Nominate
                    </span>
                  </div>
                  <h4 className="opex-nom-form-title">Submit Your Nomination</h4>
                  <p className="opex-nom-form-sub">
                    Tell us who deserves recognition and why. Takes less than two minutes.
                  </p>

                  {!formSubmitted ? (
                    <form onSubmit={handleNomSubmit}>
                      <div className="opex-nom-form-row">
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
                          placeholder="Your Full Name"
                          required
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          onFocus={() => setFocusedField("contactName")}
                          onBlur={() => setFocusedField(null)}
                          style={inputStyle("contactName")}
                        />
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <input
                          type="email"
                          placeholder="Work Email"
                          required
                          value={formData.email}
                          onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setAwardsEmailError(null); }}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => { setFocusedField(null); if (formData.email && !isWorkEmail(formData.email)) setAwardsEmailError("Please use your work email address"); }}
                          style={inputStyle("email")}
                        />
                        {awardsEmailError && <p className="opex-nom-err">{awardsEmailError}</p>}
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", gap: 10 }}>
                          <select
                            value={`${awardsSelectedCountry.code}|${awardsSelectedCountry.country}`}
                            onChange={(e) => { const [code, country] = e.target.value.split("|"); const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country); if (c) { setAwardsSelectedCountry(c); setAwardsPhoneError(null); } }}
                            onFocus={() => setFocusedField("countryCode")}
                            onBlur={() => setFocusedField(null)}
                            style={{
                              ...inputStyle("countryCode"),
                              width: 130, flexShrink: 0, appearance: "none" as const, cursor: "pointer",
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 14px center",
                            }}
                          >
                            {COUNTRY_CODES.map((cc) => (<option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: "#222", background: "#fff" }}>{cc.country} {cc.code}</option>))}
                          </select>
                          <input
                            type="tel"
                            placeholder={awardsSelectedCountry.placeholder}
                            value={formData.phone}
                            onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setAwardsPhoneError(null); }}
                            onFocus={() => setFocusedField("phone")}
                            onBlur={() => setFocusedField(null)}
                            maxLength={awardsSelectedCountry.length}
                            style={{ ...inputStyle("phone"), flex: 1 }}
                          />
                        </div>
                        {awardsPhoneError && <p className="opex-nom-err">{awardsPhoneError}</p>}
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
                          appearance: "none" as const,
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 18px center",
                          paddingRight: 44,
                          cursor: "pointer",
                          color: formData.category ? "white" : "rgba(255,255,255,0.4)",
                        }}
                      >
                        <option value="" disabled style={{ color: "#555", background: "#0e0e1c" }}>Select Award Category</option>
                        {AWARDS.map((a, i) => (
                          <option key={a.title} value={a.title} style={{ color: "white", background: "#0e0e1c" }}>
                            {String(i + 1).padStart(2, "0")} · {a.title}
                          </option>
                        ))}
                      </select>

                      <textarea
                        placeholder="Why does this nominee deserve recognition?"
                        required
                        rows={4}
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        onFocus={() => setFocusedField("reason")}
                        onBlur={() => setFocusedField(null)}
                        style={{
                          ...inputStyle("reason"),
                          marginBottom: 18,
                          resize: "vertical",
                          minHeight: 110,
                          fontFamily: "var(--font-outfit)",
                          lineHeight: 1.5,
                        }}
                      />

                      {formError && <p className="opex-nom-err" style={{ marginBottom: 12 }}>{formError}</p>}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="opex-nom-submit"
                      >
                        <span className="opex-nom-submit-text">{submitting ? "Submitting…" : "Submit Nomination"}</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="opex-nom-submit-arrow">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </button>

                      <p className="opex-nom-disclaimer">
                        Free to nominate · Reviewed by an independent panel
                      </p>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="opex-nom-success"
                    >
                      <div className="opex-nom-success-medal">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={V_BRIGHT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <h4 className="opex-nom-success-title">Nomination submitted</h4>
                      <p className="opex-nom-success-text">
                        Thank you. The OPEX First advisory panel will review your submission and follow up shortly.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        /* ═══════════════════════════════════════════════════════════════ */
        /*  Cinematic horizontal category banner                          */
        /* ═══════════════════════════════════════════════════════════════ */
        .opex-cat-banner {
          margin-top: clamp(40px, 5vw, 64px);
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          border-top: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .opex-cat-col {
          position: relative;
          padding: clamp(24px, 2.6vw, 36px) clamp(16px, 1.6vw, 24px) clamp(28px, 3vw, 40px);
          min-height: 280px;
          border-right: 1px solid rgba(255,255,255,0.06);
          isolation: isolate;
          overflow: hidden;
          transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-cat-col:last-child { border-right: none; }
        .opex-cat-col:hover { transform: translateY(-6px); }

        /* Top accent rail — lights up on hover */
        .opex-cat-rail {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, ${V_BRIGHT}, transparent);
          opacity: 0;
          transition: opacity 0.55s ease;
        }
        .opex-cat-col:hover .opex-cat-rail { opacity: 1; }

        /* Spotlight backdrop — radial violet glow that emerges on hover */
        .opex-cat-spotlight {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 90% at 50% 30%, ${V_BRIGHT}1f 0%, ${V}10 35%, transparent 70%);
          opacity: 0;
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1);
          z-index: -1;
        }
        .opex-cat-col:hover .opex-cat-spotlight { opacity: 1; }

        /* Adjacent columns dim slightly so focus stays on hovered one */
        .opex-cat-banner:hover .opex-cat-col:not(:hover) {
          opacity: 0.55;
          transition: opacity 0.5s ease;
        }
        .opex-cat-banner .opex-cat-col {
          transition: transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease;
        }

        /* Big number — gradient violet, displayed prominently */
        .opex-cat-num {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(44px, 5.4vw, 72px);
          font-weight: 200;
          line-height: 1;
          letter-spacing: -3px;
          background-image: linear-gradient(135deg, ${V_BRIGHT} 0%, ${V} 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          margin-bottom: 14px;
          text-shadow: 0 0 32px ${V}26;
          transition: letter-spacing 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-cat-col:hover .opex-cat-num {
          letter-spacing: -2px;
        }

        /* Thin violet divider between number and title */
        .opex-cat-divider {
          display: block;
          width: 28px; height: 1px;
          background: linear-gradient(90deg, ${V_BRIGHT}, transparent);
          margin-bottom: 16px;
          transition: width 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-cat-col:hover .opex-cat-divider { width: 56px; }

        /* Title */
        .opex-cat-title {
          font-family: var(--font-display);
          font-size: clamp(15px, 1.25vw, 18px);
          font-weight: 700;
          color: rgba(255,255,255,0.96);
          letter-spacing: -0.4px;
          line-height: 1.25;
          margin: 0 0 12px;
        }

        /* Body — line-clamped to 4 lines for visual rhythm */
        .opex-cat-body {
          font-family: var(--font-outfit);
          font-size: clamp(12.5px, 0.95vw, 13.5px);
          font-weight: 400;
          line-height: 1.55;
          color: rgba(255,255,255,0.55);
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /*  Nomination form — premium unified container                  */
        /* ═══════════════════════════════════════════════════════════════ */
        .opex-nom-wrap {
          margin-top: clamp(40px, 5vw, 64px);
        }

        /* Unified gradient-bezel container */
        .opex-nom-bezel {
          position: relative;
          padding: 2px;
          border-radius: 28px;
          background: linear-gradient(135deg,
            ${V_BRIGHT} 0%,
            ${V_BRIGHT}aa 14%,
            ${V}66 38%,
            rgba(255,255,255,0.10) 52%,
            ${V}66 66%,
            ${V_BRIGHT}aa 86%,
            ${V_BRIGHT} 100%
          );
          box-shadow:
            0 30px 80px rgba(0,0,0,0.55),
            0 0 80px ${V}26,
            0 0 50px ${V_BRIGHT}18,
            inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .opex-nom-grid {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          border-radius: 26px;
          overflow: hidden;
          background: ${BG_DARK};
        }

        /* LEFT — photo card */
        .opex-nom-photo {
          position: relative;
          min-height: 600px;
          overflow: hidden;
        }
        .opex-nom-photo > img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          filter: saturate(0.95) contrast(1.08) brightness(0.92);
          pointer-events: none;
          transition: transform 1.6s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-nom-bezel:hover .opex-nom-photo > img {
          transform: scale(1.04);
        }
        .opex-nom-photo-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, transparent 0%, transparent 55%, rgba(6,6,14,0.55) 100%);
        }
        .opex-nom-photo-tint {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(135deg, ${V}1a 0%, transparent 50%, ${V_BRIGHT}14 100%);
          mix-blend-mode: overlay;
        }
        .opex-nom-photo-chip {
          position: absolute; bottom: 24px; left: 24px;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(6,6,14,0.55);
          backdrop-filter: blur(14px) saturate(1.2);
          -webkit-backdrop-filter: blur(14px) saturate(1.2);
          border: 1px solid rgba(255,255,255,0.14);
        }
        .opex-nom-pulse {
          width: 7px; height: 7px; border-radius: 50%;
          background: ${V_BRIGHT};
          box-shadow: 0 0 10px ${V_BRIGHT}, 0 0 18px ${V_BRIGHT}80;
          animation: opex-nom-pulse 1.8s cubic-bezier(0.22,1,0.36,1) infinite;
        }
        @keyframes opex-nom-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.4); opacity: 0.55; }
        }
        .opex-nom-chip-text {
          font-family: var(--font-outfit);
          font-size: 10.5px; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.92);
        }

        /* RIGHT — liquid glass form panel */
        .opex-nom-form {
          position: relative;
          overflow: hidden;
          padding: clamp(32px, 4vw, 52px);
          background: linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%);
          backdrop-filter: blur(36px) saturate(1.4);
          -webkit-backdrop-filter: blur(36px) saturate(1.4);
          border-left: 1px solid rgba(255,255,255,0.06);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            inset 0 -1px 0 rgba(0,0,0,0.35);
        }
        .opex-nom-form-top {
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px; pointer-events: none;
          background: linear-gradient(90deg, transparent, ${V_BRIGHT}cc, transparent);
          box-shadow: 0 0 14px ${V_BRIGHT}80;
        }
        .opex-nom-form-blur {
          position: absolute; pointer-events: none;
          width: 240px; height: 240px; border-radius: 50%;
          filter: blur(50px);
        }
        .opex-nom-form-blur-tr {
          top: -60px; right: -60px;
          background: radial-gradient(circle, ${V_BRIGHT}24, transparent 70%);
        }
        .opex-nom-form-blur-bl {
          bottom: -60px; left: -60px;
          background: radial-gradient(circle, ${V}1f, transparent 70%);
        }
        .opex-nom-form-sheen {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%);
        }
        .opex-nom-form-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(22px, 2.4vw, 28px);
          letter-spacing: -0.6px;
          line-height: 1.15;
          color: white;
          margin: 0 0 6px;
        }
        .opex-nom-form-sub {
          font-family: var(--font-outfit);
          font-size: 13.5px; font-weight: 400;
          color: rgba(255,255,255,0.5);
          line-height: 1.55;
          margin: 0 0 24px;
        }
        .opex-nom-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .opex-nom-form input::placeholder,
        .opex-nom-form textarea::placeholder {
          color: rgba(255,255,255,0.38);
        }
        .opex-nom-err {
          color: #ef4444;
          font-family: var(--font-outfit);
          font-size: 12px;
          margin: 6px 0 0;
        }

        /* Premium gradient submit button */
        .opex-nom-submit {
          position: relative;
          display: inline-flex; align-items: center; gap: 10px;
          width: 100%;
          justify-content: center;
          padding: 17px 40px;
          border-radius: 14px;
          background: linear-gradient(135deg, ${V} 0%, ${V_BRIGHT} 100%);
          border: none;
          color: white;
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.2px;
          cursor: pointer;
          overflow: hidden;
          box-shadow:
            0 12px 32px ${V}40,
            0 0 24px ${V_BRIGHT}30,
            inset 0 1px 0 rgba(255,255,255,0.25),
            inset 0 -1px 0 rgba(0,0,0,0.2);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-nom-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 18px 44px ${V}55,
            0 0 36px ${V_BRIGHT}45,
            inset 0 1px 0 rgba(255,255,255,0.32),
            inset 0 -1px 0 rgba(0,0,0,0.2);
        }
        .opex-nom-submit:disabled {
          cursor: wait; opacity: 0.7;
        }
        .opex-nom-submit-text { position: relative; z-index: 2; }
        .opex-nom-submit-arrow {
          position: relative; z-index: 2;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-nom-submit:hover:not(:disabled) .opex-nom-submit-arrow {
          transform: translateX(4px);
        }
        /* Shimmer sweep on hover */
        .opex-nom-submit::before {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
          transform: translateX(-110%);
          transition: transform 0.7s cubic-bezier(0.22,1,0.36,1);
          pointer-events: none;
        }
        .opex-nom-submit:hover:not(:disabled)::before {
          transform: translateX(110%);
        }

        .opex-nom-disclaimer {
          text-align: center;
          font-family: var(--font-outfit);
          font-size: 11.5px;
          color: rgba(255,255,255,0.32);
          letter-spacing: 0.3px;
          margin: 14px 0 0;
        }

        /* Submitted state */
        .opex-nom-success {
          padding: 36px 16px 16px;
          text-align: center;
        }
        .opex-nom-success-medal {
          width: 64px; height: 64px;
          margin: 0 auto 18px;
          border-radius: 18px;
          background: linear-gradient(145deg, ${V_BRIGHT}22, ${V}10);
          border: 1px solid ${V_BRIGHT}45;
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 30px ${V}30, 0 0 24px ${V_BRIGHT}40, inset 0 1px 0 ${V_BRIGHT}30;
        }
        .opex-nom-success-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 22px;
          letter-spacing: -0.5px;
          color: white;
          margin: 0 0 8px;
        }
        .opex-nom-success-text {
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
          margin: 0 auto;
          max-width: 360px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .opex-cat-banner { grid-template-columns: repeat(3, 1fr); }
          .opex-cat-col:nth-child(3) { border-right: none; }
          .opex-cat-col:nth-child(4),
          .opex-cat-col:nth-child(5) {
            border-top: 1px solid rgba(255,255,255,0.06);
          }
          .opex-cat-col:nth-child(4) { border-right: 1px solid rgba(255,255,255,0.06); }
        }
        @media (max-width: 880px) {
          .opex-nom-grid { grid-template-columns: 1fr; }
          .opex-nom-photo { min-height: 320px; }
          .opex-nom-form { border-left: none; border-top: 1px solid rgba(255,255,255,0.06); }
        }
        @media (max-width: 720px) {
          .opex-cat-banner { grid-template-columns: 1fr 1fr; }
          .opex-cat-col { border-right: 1px solid rgba(255,255,255,0.06) !important; min-height: 240px; }
          .opex-cat-col:nth-child(2n) { border-right: none !important; }
          .opex-cat-col:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,0.06); }
        }
        @media (max-width: 540px) {
          .opex-cat-banner { grid-template-columns: 1fr; }
          .opex-cat-col { border-right: none !important; min-height: 0; padding: 28px 16px 32px; }
          .opex-cat-col:not(:first-child) { border-top: 1px solid rgba(255,255,255,0.06); }
          .opex-nom-form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

// ─── Register / Inquiry ─────────────────────────────────────────────────────
function Register() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      id="register"
      className="opex-cv"
      style={{
        background: `linear-gradient(180deg, ${BG_DARK} 0%, ${BG} 100%)`,
        padding: "clamp(48px, 5.5vw, 80px) clamp(20px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: "10%", left: "-5%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${V}18, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${MINT}12, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionEyebrow inView={inView} label="Register · Speak · Sponsor" centered />
          <SectionTitle inView={inView} centered>
            Tell us how you want to <em className="opex-violet-shimmer">show up</em>.
          </SectionTitle>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="opex-form-wrap"
          style={{
            ["--orange" as string]: V,
            ["--orange-bright" as string]: V_BRIGHT,
            ["--orange-glow" as string]: "rgba(124,58,237,0.4)",
            ["--black" as string]: "transparent",
          } as React.CSSProperties}
        >
          <InquiryForm />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Contact Team ───────────────────────────────────────────────────────────
function ContactTeam() {
  const ref = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // GSAP entrance: portraits clip-path wipe + image zoom + content stagger
  useGSAP(() => {
    if (!inView || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".opex-ct-card");
    const photos = gridRef.current.querySelectorAll<HTMLImageElement>(".opex-ct-photo");
    const bodies = gridRef.current.querySelectorAll<HTMLElement>(".opex-ct-body > *");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (cards.length) {
      tl.fromTo(cards,
        { y: 36, opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1, stagger: 0.14, ease: "power4.out", clearProps: "transform" },
        0
      );
    }
    if (photos.length) {
      tl.fromTo(photos,
        { scale: 1.12, filter: "saturate(0.5) brightness(0.85)" },
        { scale: 1, filter: "saturate(1) brightness(0.96)", duration: 1.4, stagger: 0.14, ease: "power3.out", clearProps: "transform,filter" },
        0.05
      );
    }
    if (bodies.length) {
      tl.fromTo(bodies,
        { y: 14, opacity: 0, filter: "blur(6px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.55, stagger: 0.04, clearProps: "transform,filter" },
        0.5
      );
    }
  }, [inView]);

  // Cursor-aware specular highlight — sets CSS variables on the hovered card
  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const t = e.currentTarget;
    const r = t.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    t.style.setProperty("--mx", `${x}%`);
    t.style.setProperty("--my", `${y}%`);
  };
  const handleCardLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.removeProperty("--mx");
    e.currentTarget.style.removeProperty("--my");
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="opex-cv"
      style={{
        background: `linear-gradient(180deg, ${BG} 0%, ${BG_DARK} 100%)`,
        padding: "clamp(16px, 2vw, 28px) clamp(20px, 5vw, 64px) clamp(48px, 5.5vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient violet orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "10%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${V}14, transparent 70%)`, filter: "blur(70px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "10%", width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${V_BRIGHT}10, transparent 70%)`, filter: "blur(70px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionEyebrow inView={inView} label="Get in touch" centered />
          <SectionTitle inView={inView} centered>
            Talk to the people <em className="opex-violet-shimmer">building the room</em>.
          </SectionTitle>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(13px, 1vw, 15px)",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6,
              maxWidth: 480,
              margin: "12px auto 0",
            }}
          >
            Three people. Direct lines, no gatekeepers.
          </motion.p>
        </div>

        <div ref={gridRef} className="opex-ct-grid">
          {CONTACT.map((c) => (
            <article
              key={c.email}
              className="opex-ct-card"
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
            >
              <div className="opex-ct-aura" aria-hidden="true" />
              <div className="opex-ct-glow" aria-hidden="true" />
              <div className="opex-ct-inner">
              {/* TOP BANNER — prominent role label */}
              <div className="opex-ct-banner">
                <span className="opex-ct-banner-icon" aria-hidden="true">
                  {c.role.toLowerCase().includes("speak") ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="2" width="6" height="13" rx="3" />
                      <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                      <path d="m21 3 1 11h-2" />
                      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                      <path d="M3 4h8" />
                    </svg>
                  )}
                </span>
                <span className="opex-ct-banner-text">{c.role}</span>
              </div>

              {/* Portrait — clean, smart-cropped, with violet duotone unification */}
              <div className="opex-ct-portrait">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  loading="lazy"
                  decoding="async"
                  src={c.photo}
                  alt={`${c.name} — ${c.role}`}
                  className="opex-ct-photo"
                  style={{ objectPosition: c.photoPos }}
                />
                {/* Violet duotone tint to unify disparate photo styles */}
                <div className="opex-ct-tint" />
                {/* Inner ring + bottom blend + bottom violet rim */}
                <div className="opex-ct-portrait-ring" />
                <div className="opex-ct-portrait-grad" />
                <div className="opex-ct-portrait-rim" />

                {/* WhatsApp FAB — icon-only chat action */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opex-ct-whatsapp"
                  aria-label={`Message ${c.name} on WhatsApp`}
                  title="Message on WhatsApp"
                >
                  <span className="opex-ct-whatsapp-pulse" aria-hidden="true" />
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>

              {/* Glass body sheen accents */}
              <span className="opex-ct-sheen-tl" aria-hidden="true" />
              <span className="opex-ct-sheen-br" aria-hidden="true" />

              {/* Body */}
              <div className="opex-ct-body">
                <h3 className="opex-ct-name">{c.name}</h3>
                <p className="opex-ct-title">{c.title}</p>

                {/* Divider with center violet diamond */}
                <div className="opex-ct-divider">
                  <span className="opex-ct-divider-dot" />
                </div>

                <a
                  href={`mailto:${c.email}`}
                  className="opex-ct-link"
                  aria-label={`Email ${c.name}`}
                >
                  <span className="opex-ct-link-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                  </span>
                  <span className="opex-ct-link-text">{c.email}</span>
                  <svg className="opex-ct-link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .opex-ct-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(18px, 2vw, 28px);
          perspective: 1400px;
        }

        /* Skeuomorphic card — outer metallic violet BEZEL */
        .opex-ct-card {
          --mx: 50%;
          --my: 50%;
          position: relative;
          border-radius: 24px;
          padding: 3px;                 /* bezel thickness */
          isolation: isolate;
          transform-style: preserve-3d;
          background:
            /* glass top sheen + bottom shadow */
            linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 25%, transparent 50%, rgba(0,0,0,0.30) 100%),
            /* base metallic violet */
            linear-gradient(165deg, ${V_BRIGHT} 0%, ${V} 35%, ${V_DIM} 70%, #1a0f30 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.45),     /* inner top shine */
            inset 0 -1px 0 rgba(0,0,0,0.45),          /* inner bottom edge */
            inset 1px 0 0 rgba(255,255,255,0.10),     /* inner left highlight */
            inset -1px 0 0 rgba(0,0,0,0.30),          /* inner right shadow */
            0 1px 0 rgba(255,255,255,0.10),           /* outer top hairline */
            0 26px 56px rgba(0,0,0,0.55),             /* deep drop */
            0 12px 24px rgba(0,0,0,0.40),             /* mid drop */
            0 0 0 1px rgba(0,0,0,0.55),               /* outline */
            0 0 60px ${V}1a;                          /* ambient violet bloom */
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-ct-card::before {
          /* Glass reflection line on top of bezel */
          content: "";
          position: absolute;
          top: 1px;
          left: 14%;
          right: 14%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.75) 50%, transparent);
          border-radius: 999px;
          pointer-events: none;
          z-index: 6;
          opacity: 0.85;
          transition: opacity 0.5s ease, left 0.6s ease, right 0.6s ease;
        }
        .opex-ct-card::after {
          /* Bezel corner specular highlights — diamond-cut feel */
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            radial-gradient(circle at 8% 4%, rgba(255,255,255,0.28) 0%, transparent 18%),
            radial-gradient(circle at 92% 4%, rgba(255,255,255,0.18) 0%, transparent 18%),
            radial-gradient(circle at 8% 96%, rgba(255,255,255,0.06) 0%, transparent 14%),
            radial-gradient(circle at 92% 96%, rgba(255,255,255,0.04) 0%, transparent 14%);
          pointer-events: none;
          z-index: 5;
          opacity: 0.9;
          transition: opacity 0.5s ease;
        }
        .opex-ct-card:hover {
          transform: translateY(-10px) rotateX(2deg);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.55),
            inset 0 -1px 0 rgba(0,0,0,0.50),
            inset 1px 0 0 rgba(255,255,255,0.12),
            inset -1px 0 0 rgba(0,0,0,0.32),
            0 1px 0 rgba(255,255,255,0.14),
            0 44px 84px rgba(0,0,0,0.70),
            0 22px 40px rgba(0,0,0,0.55),
            0 0 0 1px rgba(0,0,0,0.55),
            0 0 100px ${V}48;
        }
        .opex-ct-card:hover::before { opacity: 1; left: 8%; right: 8%; }
        .opex-ct-card:hover::after { opacity: 1; }
        .opex-ct-card:hover .opex-ct-banner { filter: brightness(1.10); }

        /* Cursor-aware specular highlight — follows mouse on hover */
        .opex-ct-glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 7;
          opacity: 0;
          transition: opacity 0.45s ease;
          background: radial-gradient(
            420px circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.14) 0%,
            rgba(255, 255, 255, 0.04) 22%,
            transparent 40%
          );
          mix-blend-mode: overlay;
        }
        .opex-ct-card:hover .opex-ct-glow { opacity: 1; }

        /* Breathing ambient violet aura — pulses gently behind every card */
        .opex-ct-aura {
          position: absolute;
          top: -12px; left: -12px; right: -12px; bottom: -12px;
          border-radius: 32px;
          pointer-events: none;
          z-index: -1;
          background:
            radial-gradient(ellipse 70% 65% at 50% 65%, ${V}38 0%, transparent 75%),
            radial-gradient(ellipse 55% 45% at 50% 35%, ${V_BRIGHT}22 0%, transparent 70%);
          filter: blur(22px);
          opacity: 0.55;
          transition: opacity 0.5s ease;
          animation: opex-ct-aura-breathe 5.5s ease-in-out infinite;
        }
        .opex-ct-card:hover .opex-ct-aura {
          opacity: 1;
        }
        @keyframes opex-ct-aura-breathe {
          0%, 100% { transform: scale(0.94); }
          50% { transform: scale(1.05); }
        }

        /* Inner panel — recessed content area inside the bezel */
        .opex-ct-inner {
          position: relative;
          border-radius: 21px;          /* outer radius minus padding */
          overflow: hidden;
          background: linear-gradient(180deg, ${BG_CARD} 0%, ${BG_DARK} 100%);
          box-shadow:
            inset 0 3px 8px rgba(0,0,0,0.65),         /* deep top inset */
            inset 0 -1px 3px rgba(0,0,0,0.45),        /* bottom inset */
            inset 2px 0 4px rgba(0,0,0,0.30),         /* left inset */
            inset -2px 0 4px rgba(0,0,0,0.30),        /* right inset */
            inset 0 -1px 0 rgba(255,255,255,0.05);    /* faint bottom edge highlight */
        }

        /* Glass body sheen — radial highlights inside the recessed panel */
        .opex-ct-sheen-tl, .opex-ct-sheen-br {
          position: absolute;
          width: 220px; height: 220px;
          border-radius: 50%;
          filter: blur(48px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.55;
          transition: opacity 0.6s ease;
        }
        .opex-ct-sheen-tl {
          top: -60px; left: -60px;
          background: radial-gradient(circle, ${V_BRIGHT}22, transparent 70%);
        }
        .opex-ct-sheen-br {
          bottom: -60px; right: -60px;
          background: radial-gradient(circle, ${V}1f, transparent 70%);
        }
        .opex-ct-card:hover .opex-ct-sheen-tl,
        .opex-ct-card:hover .opex-ct-sheen-br { opacity: 0.95; }

        /* Portrait — recessed framed picture */
        .opex-ct-portrait {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: ${BG_DARK};
          z-index: 1;
        }
        .opex-ct-portrait::after {
          /* Inner frame shadow simulating a recessed framed picture */
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),       /* top inner lip highlight */
            inset 0 6px 14px rgba(0,0,0,0.55),          /* deep top recess shadow */
            inset 0 -3px 8px rgba(0,0,0,0.30),          /* bottom recess shadow */
            inset 4px 0 8px rgba(0,0,0,0.25),           /* left recess */
            inset -4px 0 8px rgba(0,0,0,0.25),          /* right recess */
            inset 0 0 0 1px rgba(0,0,0,0.60),           /* dark inner outline */
            inset 0 -1px 0 rgba(255,255,255,0.05);      /* faint bottom edge highlight */
          z-index: 3;
        }
        .opex-ct-portrait::before {
          /* Soft top-down vignette across the portrait for cinematic depth */
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 80% 40% at 50% 0%, transparent 60%, rgba(0,0,0,0.18) 100%),
            radial-gradient(ellipse 80% 40% at 50% 100%, transparent 60%, rgba(0,0,0,0.20) 100%);
          z-index: 2;
        }
        .opex-ct-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.92) contrast(1.04) brightness(0.93);
          transition: transform 1.6s cubic-bezier(0.22,1,0.36,1), filter 0.7s ease;
        }
        .opex-ct-card:hover .opex-ct-photo {
          transform: scale(1.05);
          filter: saturate(1.02) contrast(1.06) brightness(1.02);
        }
        /* Violet tint — unifies inconsistent photo lighting/colour into one palette */
        .opex-ct-tint {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(165deg, ${V}12 0%, transparent 35%, transparent 65%, ${V_BRIGHT}10 100%);
          mix-blend-mode: overlay;
        }
        .opex-ct-portrait-ring {
          position: absolute; inset: 0; pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35);
        }
        .opex-ct-portrait-grad {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg, transparent 0%, transparent 72%, rgba(6,6,14,0.40) 100%);
        }
        /* Bottom violet rim glow inside photo */
        .opex-ct-portrait-rim {
          position: absolute; left: 0; right: 0; bottom: 0;
          height: 60px;
          background: radial-gradient(ellipse 70% 100% at 50% 100%, ${V}28 0%, transparent 75%);
          pointer-events: none;
          opacity: 0.7;
          transition: opacity 0.6s ease;
        }
        .opex-ct-card:hover .opex-ct-portrait-rim { opacity: 1; }

        /* Body — clean editorial */
        .opex-ct-body {
          position: relative;
          padding: clamp(22px, 2.6vw, 30px) clamp(22px, 2.6vw, 30px) clamp(20px, 2.4vw, 26px);
          background: linear-gradient(180deg, ${BG_CARD}fa 0%, ${BG_DARK}fd 100%);
          z-index: 1;
        }

        /* TOP BANNER — embossed metallic violet plate */
        .opex-ct-banner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 18px;
          background:
            /* top corner specular highlights — diamond-cut metal */
            radial-gradient(circle at 0% 0%, rgba(255,255,255,0.35) 0%, transparent 28%),
            radial-gradient(circle at 100% 0%, rgba(255,255,255,0.22) 0%, transparent 28%),
            /* top inner gloss */
            linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 30%, transparent 55%),
            /* metallic violet base */
            linear-gradient(180deg, ${V_BRIGHT} 0%, ${V} 50%, ${V_DIM} 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.55),     /* top inner highlight */
            inset 0 -1px 0 rgba(0,0,0,0.40),          /* bottom inner shadow */
            inset 1px 0 0 rgba(255,255,255,0.12),     /* left inner */
            inset -1px 0 0 rgba(0,0,0,0.20),          /* right inner */
            0 2px 0 rgba(0,0,0,0.40),                 /* hard relief drop */
            0 6px 14px rgba(0,0,0,0.45),              /* soft drop */
            0 8px 24px rgba(124, 58, 237, 0.30);      /* violet bloom */
          border-bottom: 1px solid rgba(0,0,0,0.50);
          z-index: 2;
          overflow: hidden;
          transition: filter 0.5s ease;
        }
        .opex-ct-banner::before {
          /* Subtle moving sheen */
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%);
          background-size: 220% 100%;
          background-position: 200% 0;
          animation: opex-ct-banner-shine 6s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: overlay;
        }
        @keyframes opex-ct-banner-shine {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -120% 0; }
        }
        /* Banner icon — domed metal stud */
        .opex-ct-banner-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.10) 38%, transparent 55%),
            linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(0,0,0,0.18) 100%);
          border: 1px solid rgba(0,0,0,0.45);
          color: white;
          flex-shrink: 0;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.55),     /* top inner shine */
            inset 0 -1px 0 rgba(0,0,0,0.45),          /* bottom inner shadow */
            0 1px 0 rgba(255,255,255,0.18),           /* outer thin highlight */
            0 2px 4px rgba(0,0,0,0.40);               /* drop */
          z-index: 1;
        }
        /* Banner text — engraved/letterpress */
        .opex-ct-banner-text {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 2.6px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.96);
          text-shadow:
            0 -1px 0 rgba(0,0,0,0.50),                /* engraved upper dark */
            0 1px 0 rgba(255,255,255,0.22);           /* lift below */
          z-index: 1;
        }

        /* WhatsApp FAB — domed convex chat button at bottom-right of photo */
        .opex-ct-whatsapp {
          position: absolute;
          right: 14px;
          bottom: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 999px;
          background:
            /* secondary catch-light (lower-right) */
            radial-gradient(circle at 70% 80%, rgba(255,255,255,0.18) 0%, transparent 28%),
            /* primary specular highlight (upper-left dome) */
            radial-gradient(circle at 32% 22%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.10) 32%, transparent 55%),
            /* base metallic green */
            linear-gradient(180deg, #2dd66f 0%, #128C7E 55%, #0a6e62 100%);
          color: white;
          text-decoration: none;
          border: 1px solid rgba(0,0,0,0.45);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.65),     /* top inner shine */
            inset 0 -3px 6px rgba(0,0,0,0.32),        /* bottom inner shadow */
            0 1px 0 rgba(255,255,255,0.20),           /* outer thin highlight */
            0 3px 0 rgba(0,0,0,0.45),                 /* hard rim */
            0 8px 18px rgba(0,0,0,0.55),              /* soft drop */
            0 0 0 4px rgba(0,0,0,0.18),               /* mount halo (set into photo) */
            0 0 28px rgba(37, 211, 102, 0.50);        /* green glow */
          z-index: 4;
          transition:
            transform 0.25s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.25s ease;
        }
        .opex-ct-whatsapp-pulse {
          position: absolute;
          inset: -3px;
          border-radius: 999px;
          border: 2px solid rgba(37, 211, 102, 0.55);
          opacity: 0;
          pointer-events: none;
          animation: opex-ct-wa-pulse 2.6s cubic-bezier(0.22,1,0.36,1) infinite;
        }
        @keyframes opex-ct-wa-pulse {
          0% { transform: scale(1); opacity: 0.75; }
          80% { transform: scale(1.45); opacity: 0; }
          100% { transform: scale(1.45); opacity: 0; }
        }
        .opex-ct-whatsapp:hover {
          transform: scale(1.06) translateY(-2px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.65),
            inset 0 -3px 6px rgba(0,0,0,0.30),
            0 1px 0 rgba(255,255,255,0.22),
            0 4px 0 rgba(0,0,0,0.45),
            0 14px 28px rgba(0,0,0,0.50),
            0 0 40px rgba(37, 211, 102, 0.65);
        }
        .opex-ct-whatsapp:active {
          transform: translateY(2px) scale(0.96);
          box-shadow:
            inset 0 3px 6px rgba(0,0,0,0.45),         /* pressed inset */
            inset 0 -1px 0 rgba(255,255,255,0.18),
            0 1px 0 rgba(0,0,0,0.40),
            0 3px 8px rgba(0,0,0,0.40),
            0 0 18px rgba(37, 211, 102, 0.40);
        }

        .opex-ct-name {
          font-family: var(--font-display);
          font-size: clamp(22px, 2vw, 28px);
          font-weight: 800;
          color: white;
          letter-spacing: -0.8px;
          line-height: 1.08;
          margin: 0 0 6px;
          text-shadow:
            0 -1px 0 rgba(0,0,0,0.50),                /* engraved upper dark */
            0 1px 0 rgba(255,255,255,0.06),           /* lift below */
            0 0 22px rgba(124, 58, 237, 0.18);        /* faint violet aura */
        }
        .opex-ct-title {
          font-family: var(--font-outfit);
          font-size: clamp(12.5px, 0.95vw, 13.5px);
          font-weight: 500;
          letter-spacing: 0.4px;
          color: rgba(255,255,255,0.58);
          line-height: 1.3;
          margin: 0;
          text-shadow: 0 -1px 0 rgba(0,0,0,0.40);     /* subtle engraved feel */
        }

        /* Divider — engraved hairline with raised violet crystal */
        .opex-ct-divider {
          position: relative;
          height: 2px;
          margin: 24px 0 18px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.55) 20%, rgba(0,0,0,0.55) 80%, transparent);
          box-shadow: 0 1px 0 rgba(255,255,255,0.06);
        }
        .opex-ct-divider::before {
          /* Faint violet aura around the gem */
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, ${V_BRIGHT}38 0%, transparent 70%);
          pointer-events: none;
          filter: blur(2px);
        }
        .opex-ct-divider-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 9px; height: 9px;
          border-radius: 1.5px;
          transform: translate(-50%, -50%) rotate(45deg);
          background:
            /* tiny inner reflection band */
            linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.55) 38%, transparent 46%),
            /* main crystal gradient */
            radial-gradient(circle at 28% 22%, #ffffff 0%, ${V_PALE} 18%, ${V_BRIGHT} 45%, ${V} 70%, ${V_DIM} 100%);
          border: 1px solid rgba(0,0,0,0.55);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.75),
            inset 0 -1px 0 rgba(0,0,0,0.30),
            0 1px 0 rgba(0,0,0,0.45),
            0 0 12px ${V_BRIGHT}90,
            0 0 22px ${V_BRIGHT}55;
          z-index: 1;
        }
        .opex-ct-card:hover .opex-ct-divider-dot {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.85),
            inset 0 -1px 0 rgba(0,0,0,0.30),
            0 1px 0 rgba(0,0,0,0.45),
            0 0 16px ${V_BRIGHT},
            0 0 28px ${V_BRIGHT}80;
        }

        /* Email link — pressed groove, raises on hover */
        .opex-ct-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          color: rgba(255,255,255,0.78);
          font-family: var(--font-outfit);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          background: linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.12) 100%);
          border: 1px solid rgba(0,0,0,0.40);
          box-shadow:
            inset 0 2px 4px rgba(0,0,0,0.45),         /* groove inset top */
            inset 0 -1px 0 rgba(255,255,255,0.04),    /* faint bottom edge highlight */
            0 1px 0 rgba(255,255,255,0.06);           /* very thin lift below */
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          position: relative;
        }
        .opex-ct-link:hover {
          color: white;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 50%),
            linear-gradient(180deg, ${V}38 0%, ${V}14 100%);
          border-color: ${V_BRIGHT}55;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),     /* raised top highlight */
            inset 0 -1px 0 rgba(0,0,0,0.30),
            0 1px 0 rgba(0,0,0,0.30),
            0 6px 16px ${V}30;                        /* lift drop */
          transform: translateY(-1px);
        }
        .opex-ct-link:active {
          transform: translateY(0);
          box-shadow:
            inset 0 2px 4px rgba(0,0,0,0.40),
            0 1px 0 rgba(255,255,255,0.04);
        }
        /* Email icon — domed violet stud */
        .opex-ct-link-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background:
            radial-gradient(circle at 30% 25%, rgba(255,255,255,0.30) 0%, transparent 45%),
            linear-gradient(180deg, ${V}48 0%, ${V}1c 100%);
          border: 1px solid rgba(0,0,0,0.45);
          color: ${V_BRIGHT};
          flex-shrink: 0;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.30),     /* top inner shine */
            inset 0 -1px 0 rgba(0,0,0,0.40),          /* bottom inner shadow */
            0 1px 0 rgba(255,255,255,0.06),           /* outer thin highlight */
            0 2px 4px rgba(0,0,0,0.30);
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-ct-link:hover .opex-ct-link-icon {
          background:
            radial-gradient(circle at 30% 25%, rgba(255,255,255,0.40) 0%, transparent 45%),
            linear-gradient(180deg, ${V_BRIGHT}55 0%, ${V}30 100%);
          border-color: rgba(0,0,0,0.55);
          transform: scale(1.06);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.42),
            inset 0 -1px 0 rgba(0,0,0,0.40),
            0 1px 0 rgba(255,255,255,0.10),
            0 4px 12px ${V}40;
        }
        .opex-ct-link-text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .opex-ct-link-arrow {
          color: ${V_BRIGHT};
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1);
          flex-shrink: 0;
        }
        .opex-ct-link:hover .opex-ct-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 880px) {
          .opex-ct-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
          .opex-ct-card:nth-child(3) { grid-column: 1 / -1; max-width: 50%; margin: 0 auto; }
        }
        @media (max-width: 540px) {
          .opex-ct-grid { grid-template-columns: 1fr; }
          .opex-ct-card:nth-child(3) { max-width: none; }
        }
      `}</style>
    </section>
  );
}

// ─── Reusable section heading helpers ───────────────────────────────────────
function SectionEyebrow({ inView, label, centered, gold }: { inView: boolean; label: string; centered?: boolean; gold?: boolean }) {
  const accent = gold ? GOLD_BRIGHT : V_BRIGHT;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
      style={{ display: "flex", alignItems: "center", justifyContent: centered ? "center" : "flex-start", gap: 14, marginBottom: 18 }}
    >
      <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${accent})` }} />
      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: accent }}>
        {label}
      </span>
      <span style={{ width: 28, height: 1, background: `linear-gradient(270deg, transparent, ${accent})` }} />
    </motion.div>
  );
}

function SectionTitle({ inView, children, centered }: { inView: boolean; children: React.ReactNode; centered?: boolean }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(28px, 4vw, 48px)",
        fontWeight: 800,
        color: "rgba(255,255,255,0.95)",
        letterSpacing: "-1.5px",
        lineHeight: 1.1,
        margin: 0,
        textAlign: centered ? "center" : "left",
        maxWidth: centered ? 880 : 980,
        marginLeft: centered ? "auto" : undefined,
        marginRight: centered ? "auto" : undefined,
      }}
    >
      {children}
    </motion.h2>
  );
}

// ─── Page composition ───────────────────────────────────────────────────────
export default function OpexFirstSaudi2026Page() {
  return (
    <main style={{ background: BG_DARK, color: "white", overflow: "hidden" }}>
      <Hero />
      <EventOverview />
      <MarketPulse />
      <FocusAreas />
      {/* <Speakers /> hidden until photos confirmed — restore once URLs are in */}
      <Agenda />
      <WhoAttends />
      <SeriesSponsors />
      <PastGallery />
      <PastShorts />
      <Awards />
      <Register />
      <ContactTeam />
      <Footer />

      <style jsx global>{`
        @keyframes opex-shimmer {
          0% { background-position: 200% 50%; }
          100% { background-position: -100% 50%; }
        }
        .opex-shimmer-text { animation: opex-shimmer 6s linear infinite; }

        /* Violet shimmer — bundled treatment for italic accent words inside section titles */
        .opex-violet-shimmer {
          font-style: italic;
          font-weight: 800;
          background-image: linear-gradient(110deg, ${V_BRIGHT}, ${V_PALE}, ${V_BRIGHT});
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: opex-shimmer 6s linear infinite;
        }

        /* Performance: skip render+paint for offscreen sections.
           Browser auto-renders when scrolled near, learns + remembers actual size. */
        @supports (content-visibility: auto) {
          .opex-cv { content-visibility: auto; contain-intrinsic-size: auto 800px; }
        }

        /* Soft pulse on the headline bloom */
        @keyframes opex-bloom-pulse {
          0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
          50%      { opacity: 0.78; transform: translateY(-50%) scale(1.04); }
        }
        .opex-hero-bloom {
          animation: opex-bloom-pulse 7s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .opex-hero-bloom { animation: none; }
        }


        @keyframes opex-pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
        .opex-pulse-dot { animation: opex-pulse-dot 1.8s ease-in-out infinite; }

        .opex-cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 48px ${V}70, inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .opex-cta-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.32);
          color: white;
          transform: translateY(-2px);
        }
        .opex-focus-card:hover {
          transform: translateY(-6px);
        }
        .opex-contact-link:hover {
          background: rgba(255,255,255,0.08) !important;
          border-color: ${V}40 !important;
          color: white !important;
        }

        /* ─── Form wrap colour override ─── */
        .opex-form-wrap {
          --orange: ${V};
          --orange-bright: ${V_BRIGHT};
          --orange-glow: rgba(124,58,237,0.4);
        }
        .opex-form-wrap .inquiry-split,
        .opex-form-wrap .inquiry-split > div { padding: 0 !important; gap: 0 !important; }

        /* ─── Responsive ─── */
        @media (max-width: 1100px) {
          .opex-stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .opex-speakers-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .opex-contact-grid { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto !important; }
        }
        @media (max-width: 720px) {
          .opex-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .opex-speakers-grid { grid-template-columns: 1fr !important; max-width: 320px; margin: 0 auto !important; }
          .opex-agenda-rail { left: calc(78px + 6px) !important; }
          .opex-agenda-time { width: 78px !important; }
          .opex-efg-badge { display: none !important; }
        }
      `}</style>
    </main>
  );
}
