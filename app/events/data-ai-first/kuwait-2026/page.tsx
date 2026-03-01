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
import Link from "next/link";
import { Footer } from "@/components/sections";
import { NeuralConstellation, DotMatrixGrid } from "@/components/effects";

// ─── Constants ───────────────────────────────────────────────────────────────
const E = "#0F735E";
const E_BRIGHT = "#14A882";
const E_GLOW = "#10B981";
const EFG_ORANGE = "#E8651A";
const EFG_ORANGE_BRIGHT = "#F97316";
const GOLD = "#C4A34A";
const EASE = [0.16, 1, 0.3, 1] as const;
const EVENT_DATE = new Date("2026-05-18T08:00:00+03:00");

// ─── Countdown Hook ─────────────────────────────────────────────────────────
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

// ─── Data ────────────────────────────────────────────────────────────────────

const EVENT_STATS = [
  { n: 250, suffix: "+", label: "Attendees" },
  { n: 25, suffix: "+", label: "Industry Experts" },
  { n: 15, suffix: "+", label: "Sponsors" },
  { n: 8, suffix: "", label: "Awards" },
  { n: 4, suffix: "", label: "Panel Discussions" },
];

// TODO: Add speaker photos when available
const SPEAKERS: {
  name: string;
  title: string;
  org: string;
  photo: string | null;
}[] = [
  { name: "Dr Khalid Al Begain", title: "President", org: "KCST", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/speakers/kuwait-2026/khalid-al-begain.png" },
  { name: "Mai AlOwaish", title: "CEO", org: "CINET", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/speakers/kuwait-2026/mai-alowaish.jpg" },
  { name: "Iyad Atieh", title: "CISO", org: "Alghanim Industries", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/speakers/kuwait-2026/iyad-atieh.jpg" },
  { name: "Abdullah AlNusef", title: "Chief Data Officer", org: "Bank Boubyan", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/speakers/kuwait-2026/abdullah-alnusef.jpg" },
  { name: "Abdulmohsen Alsulaimi", title: "Group CTO", org: "Towell International Holding", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/speakers/kuwait-2026/abdulmohsen-alsulaimi.jpg" },
  { name: "Amr Wageeh", title: "General Counsel & FDI Policy Advisor", org: "KDIPA", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/speakers/kuwait-2026/amr-wageeh.jpg" },
];

const FOCUS_AREAS: { title: string; desc: string; icon: string }[] = [
  { title: "Vision 2035 Roadmap", desc: "Aligning Kuwait's national AI strategy with Vision 2035 milestones to build a knowledge-based, innovation-driven economy less reliant on oil revenues.", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
  { title: "National Data Sovereignty", desc: "Establishing frameworks for sovereign data governance, localized storage, and resilient national data infrastructure to protect Kuwait's digital assets.", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  { title: "Digital Identity & e-Government", desc: "Advancing secure digital identity systems incorporating biometrics and evolving e-Government services for citizen-centric authentication and engagement.", icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" },
  { title: "AI & Data Driven Transformation", desc: "Strategies for enterprise-wide AI adoption, turning data and AI into regulated, profitable, and scalable business solutions across sectors.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "Economic & Social Impact", desc: "Measuring AI's contribution to economic diversification, job creation, and social advancement — targeting 50,000+ new tech jobs by 2030.", icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { title: "Ethical Governance & Mitigation", desc: "Frameworks for transparency, fairness, and accountability in AI systems — mitigating bias in hiring, ensuring equitable outcomes in Kuwait's multicultural society.", icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" },
  { title: "Data Ecosystem & Privacy", desc: "Addressing efficient data collection, storage, and management — sovereign AI-enabled data centres, resilient cloud infrastructure, and expanded data-exchange projects.", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" },
  { title: "Women in Technology", desc: "Championing diversity in data science and AI leadership — showcasing women leaders, building inclusive teams, and closing the gender gap in technology.", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { title: "Public Sector AI Modernization", desc: "Transforming government services through AI — improving administrative efficiency, citizen engagement, and budget allocation for digital infrastructure.", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { title: "Digital Trust & Threat Detection", desc: "Building digital trust amid global partnerships — strategies for ensuring respect for local traditions while adhering to global cybersecurity and data protection standards.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "AI Risk & Compliance", desc: "Navigating Kuwait's AI regulatory landscape — risk compliance frameworks, ethical biases, and building organisational readiness for AI governance mandates.", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
  { title: "Resilient Cloud Infrastructure", desc: "Establishing scalable data centres and cloud platforms for disaster recovery, AI integration, and supporting Kuwait's projected $43.36B ICT market growth by 2030.", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
];

const MARKET_STATS: {
  value: number;
  suffix: string;
  unit: string;
  label: string;
  note: string;
}[] = [
  { value: 43, suffix: "B", unit: "USD", label: "Kuwait ICT Market by 2030", note: "Growing from $27.12B current valuation" },
  { value: 9, suffix: "B", unit: "USD", label: "AI & Digital Investment", note: "$3B AI + $6B digital transformation" },
  { value: 800, suffix: "M", unit: "USD", label: "KOC Digital Transformation", note: "11 sub-projects across oil sector" },
  { value: 50, suffix: "K+", unit: "JOBS", label: "New Tech Jobs by 2030", note: "KD 1B annual revenues projected" },
];

const HIGHLIGHTS = [
  {
    title: "Expert-Led Panels & Live Case Studies",
    desc: "4 high-impact panel discussions on Kuwait's AI strategy, Vision 2035 alignment, and enterprise transformation — plus live demonstrations of AI deployments with measurable outcomes from Kuwait and GCC enterprises.",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    stat: "4 Panels",
  },
  {
    title: "100% Data & AI — Zero Filler",
    desc: "Every session is purpose-built for data and AI practitioners. Interactive deep-dive workshops on the critical challenges facing Kuwaiti businesses and government — bring your toughest problems.",
    icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    stat: "100%",
  },
  {
    title: "Curated Executive Networking",
    desc: "Move beyond generic networking — connect with 250+ handpicked senior leaders, CDOs, CTOs, government strategists, investors, and AI architects across Kuwait and the GCC.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
    stat: "250+",
  },
  {
    title: "Awards & Startup Pitch Showcase",
    desc: "Celebrating 8 categories of AI excellence — transformation, innovation, governance, and emerging talent. Plus a live startup pitch session showcasing Kuwait's most promising AI ventures to investors and government buyers.",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1200&q=80",
    stat: "8 Awards",
  },
  {
    title: "Investment & Regulatory Access",
    desc: "Direct access to $9B+ in planned digital sector investment pipelines, partnership frameworks, and a structured AI governance regulatory sandbox with policymakers. Hands-on demos of Edge AI, IoT, generative AI platforms, and cloud-native solutions.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
    stat: "$9B+",
  },
];

const AGENDA = [
  { time: "08:00 – 09:00", title: "Registration, Networking & Refreshments", type: "break" as const },
  { time: "09:00 – 09:15", title: "Welcome Remarks & Opening Ceremony", subtitle: "Welcome Address by Events First Group (EFG)", type: "ceremony" as const },
  { time: "09:15 – 09:30", title: "Opening Keynote", subtitle: "Kuwait's Transformative Journey & Catalyzing Vision — Roadmap to becoming a regional AI leader", type: "keynote" as const },
  { time: "09:30 – 10:15", title: "Panel Discussion 1 – AI & Data Ecosystem", subtitle: "Shaping Kuwait's AI & Data Ecosystem — Vision 2035 to Execution, Strategic Integration, Public-Private Partnerships & GenAI Applications", type: "panel" as const },
  { time: "10:15 – 10:30", title: "Sponsor Presentation 1", type: "sponsor" as const },
  { time: "10:30 – 11:00", title: "VIP Exhibition Tour & Networking Break", type: "break" as const },
  { time: "11:00 – 11:40", title: "Panel Discussion 2 – Data Infrastructure", subtitle: "Building a Robust Data Ecosystem — National Data Sovereignty, Privacy Frameworks & Resilient Cloud Infrastructure", type: "panel" as const },
  { time: "11:45 – 12:00", title: "Edge AI & IoT for Real-Time Applications", type: "presentation" as const },
  { time: "12:00 – 12:15", title: "AI for Sustainability, Energy & Oil and Gas", type: "presentation" as const },
  { time: "12:15 – 13:00", title: "Panel Discussion 3 – AI Governance & Trust", subtitle: "AI-Driven Transformation — Mitigating Threats, Bias Mitigation, Ethical Compliance & Digital Trust", type: "panel" as const },
  { time: "13:00 – 13:30", title: "Prayer & Networking Break", type: "break" as const },
  { time: "13:30 – 13:45", title: "Sponsor Presentation 2", type: "sponsor" as const },
  { time: "13:45 – 14:30", title: "Panel Discussion 4 – Digital Government", subtitle: "Advancing e-Government & Digital Identity — Biometrics, Citizen Services & National Security", type: "panel" as const },
  { time: "14:30 – 14:45", title: "AI Impact in Organisations", subtitle: "Operational risks, decision making, customer service", type: "presentation" as const },
  { time: "14:45 – 15:00", title: "Awards Ceremony & Close of Conference", type: "awards" as const },
];

const AWARDS = [
  { title: "AI Transformation Leader", desc: "Recognising leaders driving enterprise-wide AI adoption and measurable business outcomes." },
  { title: "Data-Driven Innovation", desc: "Celebrating organisations leveraging data to create breakthrough products and services." },
  { title: "Public Sector AI & Data Impact", desc: "Honouring government entities advancing citizen services through AI and data analytics." },
  { title: "AI Ethics & Governance Champion", desc: "Recognising commitment to responsible AI — transparency, fairness, and accountability." },
  { title: "Data & AI Ecosystem Contributor", desc: "Celebrating contributions to building Kuwait's national data and AI infrastructure." },
  { title: "AI & Data Visionary Award", desc: "Honouring individuals whose vision is shaping the future of AI in Kuwait and the GCC." },
  { title: "Emerging AI & Data Talent", desc: "Spotlighting rising professionals making exceptional early-career contributions." },
  { title: "AI & Data Educator / Mentor", desc: "Celebrating those advancing AI literacy and mentoring the next generation of talent." },
];

const AWARDS_ELIGIBILITY = [
  "Government and public sector organisations",
  "Enterprises and private sector companies",
  "Banking and financial institutions",
  "Data and AI technology providers",
  "Academic and research institutions",
];

const WHY_ATTEND = [
  { title: "Shape Kuwait's Digital Horizon", desc: "Directly contribute to the national discourse on Data and AI — influencing policy, investment, and strategic direction.", stat: "National Impact", statValue: "1st", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Curated Connections", desc: "Move beyond generic networking — connect with 250+ handpicked senior leaders, CDOs, government strategists, and AI architects.", stat: "Senior Leaders", statValue: "250+", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { title: "Practical, Localized Strategies", desc: "Laser-focused on actionable strategies for deploying Data and AI solutions specifically within the Kuwaiti context.", stat: "Kuwait-Focused", statValue: "100%", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { title: "Deep-Dive Workshops", desc: "Interactive sessions on critical Data and AI challenges facing Kuwaiti businesses and government — bring your toughest problems.", stat: "Live Workshops", statValue: "4", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { title: "Co-Create Kuwait's AI Roadmap", desc: "A dedicated session to outline Kuwait's National Data & AI roadmap — contribute to strategic priorities and investment areas.", stat: "Market Size", statValue: "$9B+", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
  { title: "Overcome AI Challenges", desc: "Discuss your challenges with data and AI solution providers, get expert answers, and create strategic alliances.", stat: "Solution Providers", statValue: "30+", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const ATTEND_ROLES = [
  { label: "Government Officials & Senior Advisors", icon: "M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11" },
  { label: "Chief Information Officer (CIO)", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { label: "Chief Technology Officer (CTO)", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { label: "Chief Data Officer (CDO)", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" },
  { label: "Chief AI Officer (CAIO)", icon: "M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { label: "Chief Digital Officer", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" },
  { label: "Head of Data Science", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Head of ML / AI", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm0 8a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" },
  { label: "Data & AI Architect", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { label: "Director of Data Engineering", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Head of Digital Transformation", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { label: "Business Unit & Innovation Leads", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Academics & Researchers", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" },
];

const ATTEND_INDUSTRIES = [
  { name: "Government & Public Sector" },
  { name: "Technology" },
  { name: "Banking & Financial Services" },
  { name: "Energy" },
  { name: "Transportation" },
  { name: "Education" },
  { name: "Healthcare" },
  { name: "Manufacturing & Retail" },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function DataAIFirstKuwait2026() {
  return (
    <div style={{ background: "#0A0A0A" }}>
      <HeroSection />
      <StatsBar />
      <MarketContext />
      <FocusAreas />
      <HighlightsGrid />
      <AgendaTimeline />
      <AtmosphereDivider />
      <Speakers />
      <SponsorsSection />
      <AwardsSection />
      <WhoShouldAttend />
      <WhyAttend />
      <PastEventsGallery />
      <FAQSection />
      <SplitCTA />
      <Venue />
      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  1. HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function HeroSection() {
  const cd = useCountdown(EVENT_DATE);

  return (
    <section
      className="daik-hero-section relative w-full overflow-hidden"
      style={{ minHeight: "100vh", background: "#060D0B" }}
    >
      {/* ── AI Face image — full-bleed, anchored right ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.2 }}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ai-photos.png"
          alt=""
          aria-hidden="true"
          className="daik-hero-img absolute"
          style={{
            top: 0,
            right: 0,
            width: "65%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
          }}
        />

        {/* Left dissolve — wide gradient so image melts into dark bg seamlessly */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, #060D0B 30%, rgba(6,13,11,0.85) 42%, rgba(6,13,11,0.4) 55%, transparent 72%)`,
          }}
        />

        {/* Top fade */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, #060D0B 0%, transparent 18%)`,
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, #060D0B 0%, transparent 22%)`,
          }}
        />

        {/* Emerald color wash — unifies the teal image with the emerald theme */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 60% at 70% 45%, rgba(15,115,94,0.06) 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      {/* ── Atmospheric layers (on top of image) ── */}

      {/* Emerald radial glow — left side, behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 70% at 20% 50%, rgba(15,115,94,0.08) 0%, transparent 70%)`,
          zIndex: 2,
        }}
      />

      {/* Emerald glow — bottom anchor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 35% at 50% 100%, rgba(15,115,94,0.06) 0%, transparent 60%)`,
          zIndex: 2,
        }}
      />

      {/* Effects */}
      <NeuralConstellation color={E} dotCount={20} connectionDistance={140} speed={0.25} opacity={0.10} />
      <DotMatrixGrid color={E} opacity={0.02} spacing={30} />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.02,
          zIndex: 3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ── Text content — left-aligned, on top of everything ── */}
      <div
        className="relative z-10 flex flex-col justify-center"
        style={{
          minHeight: "100vh",
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(24px, 4vw, 60px)",
          paddingTop: 140,
          paddingBottom: 100,
        }}
      >
        <div style={{ maxWidth: 560 }}>
          {/* Badge — Date & Edition */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 20px",
                borderRadius: 50,
                background: `${E}18`,
                border: `1px solid ${E}35`,
                fontFamily: "var(--font-outfit)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: E_BRIGHT,
              }}
            >
              18 May 2026 &middot; Kuwait City
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(42px, 5.5vw, 72px)",
              letterSpacing: "-2px",
              lineHeight: 1.0,
              marginTop: 28,
              color: "white",
            }}
          >
            Data & AI First
            <br />
            <span style={{ color: E_BRIGHT }}>Kuwait</span>
            <span style={{ color: E, marginLeft: 12, fontSize: "0.6em" }}>2026</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(16px, 1.6vw, 18px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.6)",
              maxWidth: 440,
              marginTop: 24,
              lineHeight: 1.7,
            }}
          >
            Kuwait&apos;s most exclusive gathering of Data & AI decision-makers. By invitation only.
          </motion.p>

          {/* Exclusivity Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
            className="flex items-center gap-3 flex-wrap"
            style={{ marginTop: 20 }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 50,
                background: "rgba(196,163,74,0.12)",
                border: "1px solid rgba(196,163,74,0.25)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#C4A34A" stroke="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#C4A34A" }}>
                By Invitation Only
              </span>
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 50,
                background: `${E}10`,
                border: `1px solid ${E}25`,
              }}
            >
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, color: E_BRIGHT }}>
                Limited to 250 Senior Leaders
              </span>
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
            className="daik-hero-ctas flex flex-wrap gap-4"
            style={{ marginTop: 24 }}
          >
            <HeroCTA primary href="#register">Request Invitation</HeroCTA>
            <HeroCTA href="#partnership">Partner With Us</HeroCTA>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="daik-bottom-bar absolute bottom-0 left-0 right-0 z-20"
        style={{
          padding: "20px clamp(24px, 4vw, 60px)",
          background: "rgba(6,13,11,0.90)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: `1px solid ${E}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {/* Left: Exclusivity badge */}
        <div className="daik-bar-badge flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ background: "#C4A34A", animationDuration: "1.5s" }}
            />
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: "#C4A34A" }} />
          </span>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#C4A34A",
            }}
          >
            Applications Closing Soon
          </span>
        </div>

        {/* Center: Countdown with urgency label */}
        <div className="daik-bar-countdown flex flex-col items-center gap-2">
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Application Window Closes In
          </span>
          <div className="flex items-center gap-4">
          {[
            { v: cd.d, l: "Days" },
            { v: cd.h, l: "Hrs" },
            { v: cd.m, l: "Min" },
            { v: cd.s, l: "Sec" },
          ].map((u, i) => (
            <div key={u.l} className="text-center flex items-center gap-4">
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: `${E}0A`,
                  border: `1px solid ${E}20`,
                  minWidth: 56,
                }}
              >
                <motion.span
                  key={u.v}
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 800,
                    color: E_BRIGHT,
                    lineHeight: 1,
                    display: "block",
                    textShadow: `0 0 20px ${E}60`,
                  }}
                >
                  {u.v.toString().padStart(2, "0")}
                </motion.span>
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 9,
                    fontWeight: 600,
                    color: `${E}80`,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    display: "block",
                    marginTop: 4,
                  }}
                >
                  {u.l}
                </span>
              </div>
              {i < 3 && (
                <span style={{ color: `${E}50`, fontSize: 20, fontWeight: 300, opacity: 0.5 }}>:</span>
              )}
            </div>
          ))}
          </div>
        </div>

        {/* Right: CTA */}
        <Link
          href="#register"
          className="daik-bar-cta transition-all group"
          style={{
            padding: "14px 32px",
            borderRadius: 50,
            background: `linear-gradient(135deg, #C4A34A 0%, #D4B85A 100%)`,
            fontFamily: "var(--font-outfit)",
            fontSize: 15,
            fontWeight: 600,
            color: "#000",
            boxShadow: `0 4px 24px rgba(196,163,74,0.4)`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
          </svg>
          Apply Now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Shimmer + responsive */}
      <style jsx global>{`
        @keyframes daikShimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: -100% 50%; }
        }
        .daik-shimmer {
          animation: daikShimmer 4s ease-in-out infinite;
        }
        @media (max-width: 900px) {
          .daik-hero-img {
            width: 100% !important;
            opacity: 0.3 !important;
          }
        }
        @media (max-width: 768px) {
          .daik-bottom-bar {
            flex-direction: column !important;
            gap: 16px !important;
            padding: 16px 20px !important;
            text-align: center;
          }
          .daik-bar-badge { justify-content: center; }
          .daik-bar-countdown { 
            justify-content: center;
            gap: 12px !important;
          }
          .daik-bar-countdown > div > div > span:first-child {
            font-size: 24px !important;
          }
          .daik-bar-cta { 
            width: 100%; 
            text-align: center; 
            padding: 14px 28px !important;
            font-size: 14px !important;
          }
        }
        @media (max-width: 480px) {
          .daik-bottom-bar {
            padding: 14px 16px !important;
          }
          .daik-bar-countdown {
            gap: 8px !important;
          }
          .daik-bar-countdown > div > div > span:first-child {
            font-size: 20px !important;
          }
          .daik-bar-countdown > div > div > span:last-child {
            font-size: 8px !important;
          }
          .daik-bar-badge span:last-child {
            font-size: 11px !important;
            letter-spacing: 1.5px !important;
          }
        }
        @media (max-width: 600px) {
          .daik-hero-image-wrap {
            height: 40vh !important;
          }
          .daik-hero-ctas {
            flex-direction: column !important;
            width: 100%;
            gap: 12px !important;
          }
          .daik-hero-ctas > a {
            width: 100%;
            justify-content: center;
            padding: 14px 24px !important;
            font-size: 14px !important;
          }
        }
        @media (max-width: 480px) {
          .daik-hero-ctas > a {
            padding: 12px 20px !important;
            font-size: 13px !important;
          }
        }
      `}</style>
    </section>
  );
}

function HeroCTA({
  children,
  primary = false,
  href,
}: {
  children: React.ReactNode;
  primary?: boolean;
  href: string;
}) {
  const [h, setH] = useState(false);
  return (
    <Link
      href={href}
      className="inline-flex items-center transition-all group"
      style={{
        padding: primary ? "16px 36px" : "14px 32px",
        borderRadius: 50,
        background: primary 
          ? `linear-gradient(135deg, ${E} 0%, ${E_BRIGHT} 100%)`
          : h ? `${E}18` : "rgba(255,255,255,0.03)",
        border: primary ? "none" : `1px solid ${h ? `${E}60` : `${E}40`}`,
        fontFamily: "var(--font-outfit)",
        fontSize: primary ? 16 : 15,
        fontWeight: primary ? 600 : 500,
        color: primary ? "white" : h ? "white" : E_BRIGHT,
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: primary 
          ? h ? `0 8px 32px ${E}50, 0 0 60px ${E}30` : `0 4px 20px ${E}35`
          : h ? `0 4px 16px ${E}20` : "none",
        transform: h ? "translateY(-2px)" : "translateY(0)",
        letterSpacing: primary ? "0.3px" : "0",
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      {children}
      {primary && (
        <svg 
          width="16" height="16" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ 
            marginLeft: 8, 
            transition: "transform 0.3s",
            transform: h ? "translateX(4px)" : "translateX(0)" 
          }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  2. STATS BAR — Impactful, visual-rich
// ═══════════════════════════════════════════════════════════════════════════════

function StatsBar() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "#060606",
        borderTop: `1px solid ${E}15`,
        borderBottom: `1px solid ${E}15`,
        padding: "clamp(48px, 6vw, 72px) 0",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 30%, ${E}12 0%, transparent 70%)`,
        }}
      />
      
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${E}06 1px, transparent 1px), linear-gradient(90deg, ${E}06 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 60px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "clamp(32px, 4vw, 48px)" }}
        >
          {/* Exclusivity badge */}
          <div className="flex items-center justify-center gap-2" style={{ marginBottom: 14 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 50,
                background: "rgba(196,163,74,0.1)",
                border: "1px solid rgba(196,163,74,0.2)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#C4A34A" stroke="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#C4A34A" }}>
                Exclusive · Curated · Invite-Only
              </span>
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              fontWeight: 600,
              color: E_BRIGHT,
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            The Summit at a Glance
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 700,
              color: "white",
              margin: "12px 0 0",
              letterSpacing: "-0.5px",
            }}
          >
            One Day. One Room. Kuwait&apos;s Elite Data & AI Leaders.
          </h2>
        </motion.div>

        {/* Two-column layout: Hero stat left, supporting stats right */}
        <div
          className="daik-stats-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* Left: Hero Stat */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            style={{
              borderRight: `1px solid ${E}20`,
              paddingRight: "clamp(24px, 4vw, 48px)",
              position: "relative",
            }}
          >
            {/* Glow background for the number */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 200,
                height: 150,
                background: `radial-gradient(ellipse at center, ${E}25 0%, transparent 70%)`,
                filter: "blur(40px)",
              }}
            />
            <div style={{ marginBottom: 8, position: "relative" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(80px, 14vw, 120px)",
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${E_BRIGHT} 0%, ${E_GLOW} 50%, ${E_BRIGHT} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-4px",
                  lineHeight: 0.9,
                  filter: `drop-shadow(0 0 60px ${E}60)`,
                }}
              >
                <Counter to={250} suffix="+" duration={2000} />
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(18px, 2vw, 24px)",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.5px",
                margin: 0,
              }}
            >
              Vetted Decision Makers
            </p>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 14,
                fontWeight: 400,
                color: "rgba(255,255,255,0.5)",
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              Hand-selected CDOs, CTOs, CIOs & government strategists. Every attendee personally vetted.
            </p>
          </motion.div>

          {/* Right: Supporting Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="daik-stats-grid-new"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 0,
            }}
          >
            {[
              { n: 25, suffix: "+", label: "Speakers", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" },
              { n: 4, suffix: "", label: "Panels", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
              { n: 8, suffix: "", label: "Awards", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE }}
                style={{
                  textAlign: "center",
                  padding: "clamp(16px, 2vw, 24px)",
                  borderLeft: i > 0 ? `1px solid ${E}15` : "none",
                  background: i === 1 ? `${E}08` : "transparent",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={E_BRIGHT}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ margin: "0 auto 12px", opacity: 0.7 }}
                >
                  <path d={stat.icon} />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 5vw, 48px)",
                    fontWeight: 800,
                    color: "white",
                    letterSpacing: "-2px",
                    display: "block",
                  }}
                >
                  <Counter to={stat.n} suffix={stat.suffix} />
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: E_BRIGHT,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginTop: 8,
                    margin: 0,
                  }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .daik-stats-layout {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 24px !important;
          }
          .daik-stats-layout > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid rgba(15,115,94,0.2);
            padding-right: 0 !important;
            padding-bottom: 24px;
          }
          .daik-stats-layout > div:first-child span {
            font-size: 72px !important;
          }
          .daik-stats-grid-new {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .daik-stats-grid-new > div span:first-of-type {
            font-size: 32px !important;
          }
        }
        @media (max-width: 480px) {
          .daik-stats-layout > div:first-child span {
            font-size: 56px !important;
          }
          .daik-stats-grid-new > div {
            padding: 12px 8px !important;
          }
          .daik-stats-grid-new > div span:first-of-type {
            font-size: 28px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  3. MARKET CONTEXT — Full-width image with floating glass stats
// ═══════════════════════════════════════════════════════════════════════════════

function MarketContext() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ 
        minHeight: "clamp(500px, 70vh, 700px)",
        background: "#050505",
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/market-context-bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      />
      
      {/* Gradient overlay for text readability - lighter to show image */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)`,
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col justify-center"
        style={{
          minHeight: "clamp(500px, 70vh, 700px)",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 60px)",
        }}
      >
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ marginBottom: 48 }}
        >
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: E_BRIGHT,
            }}
          >
            The Opportunity
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(36px, 5vw, 56px)",
              letterSpacing: "-2px",
              color: "white",
              lineHeight: 1.1,
              margin: "16px 0 0",
              maxWidth: 600,
            }}
          >
            Kuwait Vision 2035 is
            <br />
            <span style={{ color: E_BRIGHT }}>reshaping the future.</span>
          </h2>
        </motion.div>

        {/* Floating Glass Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="daik-glass-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {[
            { value: 43, suffix: "B", prefix: "$", label: "ICT Market 2030", highlight: true },
            { value: 9, suffix: "B", prefix: "$", label: "AI Investment" },
            { value: 800, suffix: "M", prefix: "$", label: "KOC Digital" },
            { value: 50, suffix: "K+", prefix: "", label: "New Tech Jobs" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: EASE }}
              whileHover={{ 
                scale: stat.highlight ? 1.03 : 1.02, 
                y: -4,
                transition: { duration: 0.3 }
              }}
              style={{
                padding: stat.highlight ? "32px 24px" : "24px 20px",
                background: stat.highlight 
                  ? `linear-gradient(145deg, ${E}30 0%, ${E}15 50%, ${E}08 100%)`
                  : "rgba(255,255,255,0.05)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: 20,
                border: `1px solid ${stat.highlight ? `${E}50` : "rgba(255,255,255,0.1)"}`,
                textAlign: "center",
                boxShadow: stat.highlight 
                  ? `0 12px 40px ${E}30, inset 0 1px 0 ${E}40, 0 0 80px ${E}15` 
                  : "0 4px 20px rgba(0,0,0,0.2)",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Highlight glow effect for main stat */}
              {stat.highlight && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 30%, ${E}20 0%, transparent 60%)`,
                  }}
                />
              )}
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: stat.highlight ? "clamp(44px, 6vw, 60px)" : "clamp(28px, 4vw, 36px)",
                  fontWeight: 800,
                  background: stat.highlight 
                    ? `linear-gradient(135deg, ${E_BRIGHT} 0%, ${E_GLOW} 50%, white 100%)`
                    : "white",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: "-2px",
                  filter: stat.highlight ? `drop-shadow(0 0 30px ${E}50)` : "none",
                  position: "relative",
                }}
              >
                {stat.prefix}<Counter to={stat.value} suffix={stat.suffix} duration={stat.highlight ? 2000 : 1500} />
              </p>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: stat.highlight ? 13 : 11,
                  fontWeight: 600,
                  color: stat.highlight ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  margin: 0,
                  marginTop: stat.highlight ? 12 : 8,
                  position: "relative",
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .daik-glass-stats {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 500px) {
          .daik-glass-stats {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .daik-glass-stats > div {
            padding: 16px 12px !important;
            border-radius: 14px !important;
          }
          .daik-glass-stats > div p:first-child {
            font-size: 28px !important;
          }
          .daik-glass-stats > div p:last-child {
            font-size: 9px !important;
            margin-top: 6px !important;
          }
        }
        @media (max-width: 380px) {
          .daik-glass-stats {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          .daik-glass-stats > div p:first-child {
            font-size: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* MarketCard - kept for reference but not used in new design */
function MarketCard({ stat }: { stat: (typeof MARKET_STATS)[0] }) {
  const [h, setH] = useState(false);

  return (
    <div
      className="relative overflow-hidden transition-all"
      style={{
        borderRadius: 16,
        padding: "28px 24px",
        background: h ? `${E}08` : "rgba(255,255,255,0.02)",
        border: `1px solid ${h ? `${E}30` : "rgba(255,255,255,0.06)"}`,
        transitionDuration: "0.4s",
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#404040" }}>
        {stat.unit}
      </span>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 48px)", fontWeight: 800, color: E_BRIGHT, margin: "8px 0 0", lineHeight: 1 }}>
        <Counter to={stat.value} suffix={stat.suffix} />
      </p>
      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: "var(--white)", margin: "10px 0 0" }}>
        {stat.label}
      </p>
      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 300, color: "#505050", margin: "6px 0 0", lineHeight: 1.5 }}>
        {stat.note}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  4. FOCUS AREAS
// ═══════════════════════════════════════════════════════════════════════════════

function FocusAreas() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIdx, setActiveIdx] = useState(0);
  const active = FOCUS_AREAS[activeIdx];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#111111", padding: "clamp(40px, 5vw, 72px) 0" }}
    >
      <DotMatrixGrid color={E} opacity={0.015} spacing={24} />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: E }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: E }}>
              What We Cover
            </span>
            <span style={{ width: 30, height: 1, background: E }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3.5vw, 48px)",
              letterSpacing: "-1.5px",
              color: "var(--white)",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            12 Strategic Focus Areas
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.4)", marginTop: 10 }}>
            Curated agenda topics shaped by Kuwait&apos;s top CDOs and CTOs
          </p>
        </motion.div>

        {/* Console layout */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="daik-focus-console"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* Left: Card grid */}
          <div
            className="daik-focus-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            }}
          >
            {FOCUS_AREAS.map((fa, i) => (
              <FocusCard
                key={i}
                idx={i}
                title={fa.title}
                isActive={i === activeIdx}
                onClick={() => setActiveIdx(i)}
              />
            ))}
          </div>

          {/* Right: Detail panel */}
          <div
            className="daik-focus-detail relative overflow-hidden"
            style={{
              borderRadius: 20,
              background: `linear-gradient(145deg, ${E}0A 0%, ${E}04 100%)`,
              border: `1px solid ${E}20`,
              padding: "clamp(28px, 3vw, 44px)",
              minHeight: 360,
              boxShadow: `0 8px 40px ${E}08, inset 0 1px 0 ${E}15`,
            }}
          >
            {/* Top edge glow */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${E}30, transparent)` }} />
            
            {/* Watermark number with gradient */}
            <span
              style={{
                position: "absolute",
                top: -15,
                right: 10,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(100px, 12vw, 160px)",
                fontWeight: 900,
                background: `linear-gradient(180deg, ${E}12 0%, ${E}04 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
                pointerEvents: "none",
              }}
            >
              {(activeIdx + 1).toString().padStart(2, "0")}
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ position: "relative" }}
              >
                {/* Icon with glow */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `linear-gradient(145deg, ${E}18 0%, ${E}08 100%)`,
                    border: `1px solid ${E}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    boxShadow: `0 4px 20px ${E}15`,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={E_BRIGHT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={active.icon} />
                  </svg>
                </motion.div>

                {/* Label */}
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: E_BRIGHT,
                  }}
                >
                  Focus Area {(activeIdx + 1).toString().padStart(2, "0")}
                </span>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(24px, 2.5vw, 32px)",
                    fontWeight: 800,
                    color: "var(--white)",
                    letterSpacing: "-0.5px",
                    margin: "10px 0 0",
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
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.85,
                    margin: "16px 0 0",
                    maxWidth: 440,
                  }}
                >
                  {active.desc}
                </p>

                {/* Accent bar with gradient */}
                <div 
                  style={{ 
                    width: 50, 
                    height: 3, 
                    background: `linear-gradient(90deg, ${E_BRIGHT}, ${E})`, 
                    borderRadius: 2, 
                    marginTop: 28,
                    boxShadow: `0 0 12px ${E}40`,
                  }} 
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .daik-focus-console { grid-template-columns: 1fr !important; }
          .daik-focus-cards { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .daik-focus-cards { grid-template-columns: repeat(3, 1fr) !important; gap: 6px !important; }
          .daik-focus-cards button { padding: 10px 8px !important; }
          .daik-focus-cards button span:first-child { font-size: 10px !important; }
          .daik-focus-cards button span:last-child { font-size: 10px !important; }
        }
        @media (max-width: 480px) {
          .daik-focus-cards { grid-template-columns: repeat(3, 1fr) !important; gap: 4px !important; }
          .daik-focus-cards button { padding: 8px 6px !important; border-radius: 8px !important; }
          .daik-focus-detail { padding: 20px !important; min-height: 280px !important; }
        }
      `}</style>
    </section>
  );
}

function FocusCard({
  idx,
  title,
  isActive,
  onClick,
}: {
  idx: number;
  title: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const [h, setH] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="text-left transition-all"
      style={{
        padding: "14px 12px",
        borderRadius: 12,
        background: isActive ? `${E}12` : h ? `${E}06` : "rgba(255,255,255,0.02)",
        borderTop: `1px solid ${isActive ? `${E}30` : h ? `${E}15` : "rgba(255,255,255,0.04)"}`,
        borderRight: `1px solid ${isActive ? `${E}30` : h ? `${E}15` : "rgba(255,255,255,0.04)"}`,
        borderBottom: `1px solid ${isActive ? `${E}30` : h ? `${E}15` : "rgba(255,255,255,0.04)"}`,
        borderLeft: isActive ? `3px solid ${E_BRIGHT}` : "3px solid transparent",
        cursor: "pointer",
        transitionDuration: "0.25s",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 11,
          fontWeight: 700,
          color: isActive ? E_BRIGHT : `${E}50`,
          display: "block",
        }}
      >
        {(idx + 1).toString().padStart(2, "0")}
      </span>
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: isActive ? 500 : 400,
          color: isActive ? "var(--white)" : h ? "#909090" : "#606060",
          lineHeight: 1.3,
          display: "block",
          marginTop: 4,
        }}
      >
        {title}
      </span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  5. HIGHLIGHTS GRID
// ═══════════════════════════════════════════════════════════════════════════════

function HighlightsGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#080E0C", padding: "clamp(40px, 5vw, 72px) 0" }}
    >
      {/* Atmospheric radials */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 60% at 25% 40%, ${E}06 0%, transparent 70%)`,
        }}
      />
      <DotMatrixGrid color={E} opacity={0.015} spacing={28} />

      <div
        className="daik-hl-split"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "start",
        }}
      >
        {/* ─── LEFT: Header + summary ─── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
              <span style={{ width: 30, height: 1, background: E }} />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: E,
                }}
              >
                What Makes This Different
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(30px, 3.5vw, 48px)",
                letterSpacing: "-1.5px",
                color: "var(--white)",
                lineHeight: 1.1,
                margin: "0 0 20px",
              }}
            >
              Why Leaders Are
              <br />
              <span style={{ color: "#C4A34A" }}>Fighting</span> to Get In
            </h2>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 15,
                fontWeight: 300,
                color: "#606060",
                lineHeight: 1.7,
                maxWidth: 420,
                margin: 0,
              }}
            >
              This isn&apos;t a conference. It&apos;s Kuwait&apos;s most exclusive gathering of Data &amp; AI 
              decision-makers — where deals close and strategies align.
            </p>
          </motion.div>

          {/* Large stat highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            style={{
              marginTop: 48,
              display: "flex",
              gap: 32,
            }}
          >
            {[
              { num: 250, suffix: "+", label: "Senior Leaders" },
              { num: 4, suffix: "", label: "Panel Sessions" },
              { num: 8, suffix: "", label: "Award Categories" },
            ].map((s, i) => (
              <div key={s.label}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 4vw, 52px)",
                    fontWeight: 800,
                    color: E_BRIGHT,
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  <Counter to={s.num} suffix={s.suffix} duration={1400 + i * 200} />
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#505050",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginTop: 6,
                    display: "block",
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ─── RIGHT: Feature items ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {HIGHLIGHTS.map((item, i) => (
            <HighlightRow key={item.title} item={item} idx={i} inView={inView} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .daik-hl-split { 
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .daik-hl-split > div:first-child > div:last-child {
            gap: 20px !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
          }
        }
        @media (max-width: 480px) {
          .daik-hl-split > div:first-child > div:last-child {
            gap: 16px !important;
          }
          .daik-hl-split > div:first-child > div:last-child > div span:first-child {
            font-size: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}

function HighlightRow({
  item,
  idx,
  inView,
}: {
  item: (typeof HIGHLIGHTS)[0];
  idx: number;
  inView: boolean;
}) {
  const [h, setH] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.15 + idx * 0.08, ease: EASE }}
      className="relative transition-all"
      style={{
        padding: "24px 0",
        borderBottom: `1px solid ${h ? `${E}20` : "rgba(255,255,255,0.06)"}`,
        cursor: "default",
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      {/* Hover glow background */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity"
        style={{
          background: `linear-gradient(90deg, ${E}06 0%, transparent 80%)`,
          opacity: h ? 1 : 0,
          transitionDuration: "0.4s",
        }}
      />

      <div className="relative flex items-start gap-4">
        {/* Number index */}
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 13,
            fontWeight: 700,
            color: h ? E_BRIGHT : `${E}50`,
            minWidth: 24,
            paddingTop: 2,
            transition: "color 0.3s",
          }}
        >
          {(idx + 1).toString().padStart(2, "0")}
        </span>

        <div style={{ flex: 1 }}>
          {/* Title + stat row */}
          <div className="flex items-center justify-between gap-3">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 17,
                color: h ? "var(--white)" : "#c0c0c0",
                letterSpacing: "-0.3px",
                margin: 0,
                transition: "color 0.3s",
              }}
            >
              {item.title}
            </h3>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 800,
                color: h ? E_BRIGHT : `${E}40`,
                whiteSpace: "nowrap",
                transition: "color 0.3s",
              }}
            >
              {item.stat}
            </span>
          </div>

          {/* Description — expands on hover */}
          <motion.div
            initial={false}
            animate={{
              height: h ? "auto" : 0,
              opacity: h ? 1 : 0,
              marginTop: h ? 8 : 0,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 300,
                color: "#707070",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {item.desc}
            </p>
          </motion.div>
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ x: h ? 4 : 0, opacity: h ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
          style={{ paddingTop: 2, flexShrink: 0 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={h ? E_BRIGHT : "#404040"}
            strokeWidth="2"
            strokeLinecap="round"
            style={{ transition: "stroke 0.3s" }}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  6. AGENDA TIMELINE
// ═══════════════════════════════════════════════════════════════════════════════

const AGENDA_TYPE_CONFIG: Record<string, { color: string; label: string; tier: "headline" | "standard" | "sponsor" | "break" }> = {
  panel: { color: E, label: "Panel", tier: "headline" },
  keynote: { color: "#C4A34A", label: "Keynote", tier: "headline" },
  ceremony: { color: E_BRIGHT, label: "Opening", tier: "standard" },
  presentation: { color: "#808080", label: "Presentation", tier: "standard" },
  sponsor: { color: "#404040", label: "Sponsor", tier: "sponsor" },
  break: { color: "#333", label: "Break", tier: "break" },
  awards: { color: "#C4A34A", label: "Awards", tier: "headline" },
};

const AGENDA_FILTERS = [
  { key: "all", label: "All" },
  { key: "panel", label: "Panels" },
  { key: "keynote", label: "Keynotes" },
  { key: "presentation", label: "Presentations" },
  { key: "break", label: "Breaks" },
] as const;

function AgendaTimeline() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = activeFilter === "all"
    ? AGENDA
    : AGENDA.filter((item) => {
        if (activeFilter === "keynote") return item.type === "keynote" || item.type === "ceremony";
        if (activeFilter === "break") return item.type === "break";
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
        background: "linear-gradient(180deg, #040E0A 0%, #061410 35%, #050F0C 65%, #040C09 100%)",
        padding: "clamp(40px,5vw,72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Emerald atmosphere */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${E}0A, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 60% at 85% 50%, #0a3a2c10, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 40% at 10% 75%, #0a2a1a0A, transparent 60%)` }} />
      <DotMatrixGrid color={E} opacity={0.02} spacing={26} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          {/* Time badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 20px",
              borderRadius: 50,
              background: `${E}10`,
              border: `1px solid ${E}20`,
              marginBottom: 20,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={E_BRIGHT} strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: E_BRIGHT }}>
              8:00 AM – 3:00 PM · Full Day
            </span>
          </motion.div>
          
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 14 }}>
            <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, transparent, ${E})` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: E }}>
              Full Day Programme
            </span>
            <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, ${E}, transparent)` }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.8vw,48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.08, margin: "12px 0 0" }}>
            Agenda
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>
            4 panels · 2 keynotes · 8 presentations · 1 awards ceremony
          </p>
          <div className="flex items-center justify-center gap-2" style={{ marginTop: 12 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 50,
                background: "rgba(196,163,74,0.08)",
                border: "1px solid rgba(196,163,74,0.15)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C4A34A" strokeWidth="2" strokeLinecap="round">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#C4A34A" }}>
                Closed-Door Sessions · Chatham House Rules
              </span>
            </span>
          </div>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontStyle: "italic", color: "#303030", marginTop: 10 }}>
            Full agenda shared with approved applicants only
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
                  background: isActive ? E : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? E : "rgba(255,255,255,0.06)"}`,
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
            background: "linear-gradient(180deg, rgba(8,20,16,0.6) 0%, rgba(4,14,10,0.45) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid rgba(15,115,94,0.08)`,
            boxShadow: `0 24px 80px rgba(0,6,4,0.5), inset 0 1px 0 rgba(20,168,130,0.04)`,
            padding: "clamp(24px,3vw,40px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top edge glow */}
          <div className="absolute pointer-events-none" style={{ top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${E}30, transparent)` }} />
          <div className="absolute pointer-events-none" style={{ top: 0, left: 0, right: 0, height: 100, background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${E}04, transparent)`, borderRadius: "24px 24px 0 0" }} />

          {/* Content: 2-col for "all", single centered col for filtered */}
          <div
            className={isTwoCol ? "daik-agenda-cols" : ""}
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
              <div className="daik-agenda-rail-glow absolute pointer-events-none" style={{ top: 0, bottom: 0, left: "50%", width: 2, transform: "translateX(-50%)", background: `linear-gradient(180deg, transparent, ${E}15, ${E}08, transparent)` }} />
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
          .daik-agenda-cols { grid-template-columns: 1fr !important; }
          .daik-agenda-cols > div:first-child { border-right: none !important; padding-right: 0 !important; }
          .daik-agenda-cols > div:last-child { padding-left: 0 !important; margin-top: 8px; }
          .daik-agenda-rail-glow { display: none !important; }
        }
        @media (max-width: 480px) {
          .daik-agenda-cols > div > div > div > div {
            padding: 14px 12px !important;
          }
          .daik-agenda-cols > div > div > div > div h4 {
            font-size: 13px !important;
          }
          .daik-agenda-cols > div > div > div > div p {
            font-size: 11px !important;
          }
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
      <div className="flex items-center gap-3" style={{ marginBottom: "subtitle" in item && item.subtitle ? 8 : 0 }}>
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

      {/* Subtitle */}
      {"subtitle" in item && item.subtitle && (
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

// ═══════════════════════════════════════════════════════════════════════════════
//  7. ATMOSPHERE DIVIDER
// ═══════════════════════════════════════════════════════════════════════════════

function AtmosphereDivider() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ height: "60vh", minHeight: 400 }}>
      <motion.div className="absolute inset-0" style={{ y }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.25) saturate(0.5)", transform: "scale(1.2)" }}
        />
      </motion.div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #0A0A0A 0%, transparent 25%, transparent 75%, #111111 100%)" }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${E}10 0%, transparent 55%)` }} />
      
      {/* Animated glow pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            `radial-gradient(ellipse 60% 50% at 50% 50%, ${E}08 0%, transparent 70%)`,
            `radial-gradient(ellipse 70% 60% at 50% 50%, ${E}12 0%, transparent 70%)`,
            `radial-gradient(ellipse 60% 50% at 50% 50%, ${E}08 0%, transparent 70%)`,
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center text-center h-full" 
        style={{ padding: "0 24px", opacity }}
      >
        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 20px",
            borderRadius: 50,
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${E}30`,
            backdropFilter: "blur(12px)",
            marginBottom: 20,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={E_BRIGHT} strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: E_BRIGHT }}>
            Kuwait &middot; May 2026
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(26px, 3.5vw, 44px)",
            letterSpacing: "-1px",
            color: "rgba(255,255,255,0.9)",
            maxWidth: 650,
            lineHeight: 1.25,
          }}
        >
          The room where Kuwait&rsquo;s most <span style={{ color: "#C4A34A" }}>powerful decisions</span> in Data & AI get made.
        </motion.h2>
        
        {/* Exclusivity tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.4)",
            marginTop: 16,
            fontStyle: "italic",
          }}
        >
          &ldquo;If you&apos;re not in the room, you&apos;re not in the conversation.&rdquo;
        </motion.p>
        
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-8"
          style={{ marginTop: 28 }}
        >
          {[
            { value: "250", label: "Vetted Leaders" },
            { value: "68", label: "Spots Left" },
            { value: "1", label: "Exclusive Day" },
          ].map((s, i) => (
            <div key={s.label} className="text-center" style={{ opacity: i === 1 ? 1 : 0.8 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: i === 1 ? "#C4A34A" : E_BRIGHT }}>
                {s.value}
              </span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.4)", display: "block", marginTop: 4, letterSpacing: "1px", textTransform: "uppercase" }}>
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  8. SPEAKERS
// ═══════════════════════════════════════════════════════════════════════════════

function SpeakersSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#0A0A0A", padding: "clamp(40px, 5vw, 72px) 0" }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-wrap items-end justify-between gap-4"
          style={{ marginBottom: 44 }}
        >
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
              <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, transparent, ${E})` }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: E }}>
                The Faculty
              </span>
              <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, ${E}, transparent)` }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px, 3.5vw, 48px)", letterSpacing: "-1.5px", color: "var(--white)", lineHeight: 1.1, margin: 0 }}>
              Who&rsquo;s Speaking
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.45)", marginTop: 10, maxWidth: 400 }}>
              The calibre of voices you&apos;ll hear — and network with — nowhere else
            </p>
          </div>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            style={{ 
              fontFamily: "var(--font-outfit)", 
              fontSize: 12, 
              fontWeight: 600, 
              color: E_BRIGHT, 
              padding: "8px 18px", 
              borderRadius: 50, 
              background: `${E}12`,
              border: `1px solid ${E}25`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: E_BRIGHT, animationDuration: "2s" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: E_BRIGHT }} />
            </span>
            {SPEAKERS.length}+ Confirmed
          </motion.span>
        </motion.div>

        {/* Grid */}
        <div className="daik-speakers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {SPEAKERS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: EASE }}
            >
              <SpeakerCard speaker={s} />
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @media (max-width: 900px) {
          .daik-speakers-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 640px) {
          .daik-speakers-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 400px) {
          .daik-speakers-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .daik-speakers-grid > div > div > div {
            border-radius: 12px !important;
          }
          .daik-speakers-grid > div > div > div > div:last-child {
            padding: 0 12px 14px !important;
          }
          .daik-speakers-grid > div > div > div > div:last-child h4 {
            font-size: 14px !important;
          }
          .daik-speakers-grid > div > div > div > div:last-child p {
            font-size: 11px !important;
          }
          .daik-speakers-grid > div > div > div > div:last-child span {
            font-size: 9px !important;
            padding: 2px 8px !important;
          }
        }
      `}</style>
    </section>
  );
}

function Speakers() {
  return <SpeakersSection />;
}

function SpeakerCard({ speaker }: { speaker: (typeof SPEAKERS)[0] }) {
  const [h, setH] = useState(false);
  const initials = speaker.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <Tilt max={6}>
      <div
        className="relative overflow-hidden transition-all group"
        style={{
          borderRadius: 18,
          aspectRatio: "3 / 4",
          background: "#141414",
          border: `1px solid ${h ? `${E}40` : "rgba(255,255,255,0.06)"}`,
          transform: h ? "translateY(-6px)" : "translateY(0)",
          boxShadow: h ? `0 20px 50px rgba(0,0,0,0.4), 0 0 40px ${E}15` : `0 4px 16px rgba(0,0,0,0.2)`,
          transitionDuration: "0.5s",
          transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
        }}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
      >
        {/* Photo or premium initials fallback */}
        {speaker.photo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={speaker.photo}
              alt={speaker.name}
              className="w-full h-full object-cover transition-all"
              style={{
                filter: h ? "brightness(0.95) saturate(1.1)" : "brightness(0.75) saturate(0.3)",
                transitionDuration: "0.6s",
                transform: h ? "scale(1.02)" : "scale(1)",
              }}
            />
            {/* Emerald tint overlay on hover */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity"
              style={{
                background: `linear-gradient(135deg, ${E}15 0%, transparent 50%)`,
                opacity: h ? 1 : 0,
                transitionDuration: "0.5s",
              }}
            />
          </>
        ) : (
          <div
            className="daik-speaker-placeholder w-full h-full flex flex-col items-center justify-center relative"
            style={{
              background: `linear-gradient(145deg, ${E}18 0%, ${E}08 50%, #141414 100%)`,
            }}
          >
            {/* Animated shimmer effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(110deg, transparent 30%, ${E}10 45%, ${E}20 50%, ${E}10 55%, transparent 70%)`,
                backgroundSize: "200% 100%",
                animation: "shimmer 3s ease-in-out infinite",
              }}
            />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(${E}08 1px, transparent 1px), linear-gradient(90deg, ${E}08 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
                opacity: 0.5,
              }}
            />
            {/* Initials with gradient */}
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 56,
                fontWeight: 800,
                background: `linear-gradient(135deg, ${E}60 0%, ${E_BRIGHT}80 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                position: "relative",
                zIndex: 1,
              }}
            >
              {initials}
            </span>
            {/* "Photo Coming" label */}
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: `${E}60`,
                marginTop: 8,
                position: "relative",
                zIndex: 1,
              }}
            >
              Photo Coming
            </span>
          </div>
        )}

        {/* Bottom gradient - enhanced */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "65%",
            background: "linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.8) 35%, transparent 100%)",
          }}
        />

        {/* Info - enhanced styling */}
        <div className="absolute bottom-0 left-0 right-0" style={{ padding: "0 16px 20px" }}>
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 17,
              fontWeight: 700,
              color: "var(--white)",
              margin: 0,
              lineHeight: 1.2,
              transition: "color 0.3s",
            }}
          >
            {speaker.name}
          </h4>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              fontWeight: 400,
              color: h ? "#a0a0a0" : "#707070",
              margin: "5px 0 0",
              lineHeight: 1.35,
              transition: "color 0.3s",
            }}
          >
            {speaker.title}
          </p>
          <span
            style={{
              display: "inline-block",
              marginTop: 8,
              padding: "4px 12px",
              borderRadius: 50,
              background: h ? `${E}20` : `${E}12`,
              border: `1px solid ${h ? `${E}40` : `${E}20`}`,
              fontFamily: "var(--font-outfit)",
              fontSize: 10,
              fontWeight: 500,
              color: h ? E_BRIGHT : `${E}90`,
              transition: "all 0.3s",
            }}
          >
            {speaker.org}
          </span>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </Tilt>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  9. AWARDS
// ═══════════════════════════════════════════════════════════════════════════════

function AwardsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const nomRef = useRef<HTMLDivElement>(null);
  const nomInView = useInView(nomRef, { once: true, margin: "-60px" });
  const GOLD = "#C4A34A";
  const GOLD_BRIGHT = "#D4B85A";

  const [expandedAward, setExpandedAward] = useState<number | null>(null);
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
    backgroundColor: focusedField === field ? "rgba(196,163,74,0.08)" : "rgba(6,14,10,0.5)",
    border: `1px solid ${focusedField === field ? `${GOLD}40` : `${E}15`}`,
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
        background: "linear-gradient(180deg, #040E0A 0%, #061410 30%, #071816 50%, #061410 70%, #040E0A 100%)",
        padding: "clamp(40px,5vw,72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Emerald atmosphere */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${E}0A, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 15% 70%, #0a2a1a0C, transparent 60%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 100% 30% at 50% 100%, #001a0e 0%, transparent 70%)` }} />
      {/* Gold accent glows */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 35% 30% at 50% 35%, ${GOLD}06, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 25% 25% at 75% 65%, ${GOLD}04, transparent 70%)` }} />
      <DotMatrixGrid color={E} opacity={0.02} spacing={26} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative", zIndex: 1 }}>

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 36 }}
        >
          {/* Trophy icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 20px",
              borderRadius: 16,
              background: `linear-gradient(145deg, ${GOLD}20 0%, ${GOLD}08 100%)`,
              border: `1px solid ${GOLD}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 32px ${GOLD}15`,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 1012 0V2z" />
            </svg>
          </motion.div>
          
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: GOLD }}>
              Recognition Excellence
            </span>
            <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(28px,3.8vw,48px)", letterSpacing: "-1.5px",
            color: "white", lineHeight: 1.08, margin: "12px 0 0",
          }}>
            Data &amp; AI First Awards 2026
          </h2>
          <p style={{
            fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400,
            color: "rgba(255,255,255,0.45)", marginTop: 12, maxWidth: 500, margin: "12px auto 0",
          }}>
            Celebrating the pioneers shaping Kuwait&apos;s digital future
          </p>
        </motion.div>

        {/* ── Glass container wrapping all content ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          style={{
            padding: "clamp(28px,3.5vw,48px)",
            borderRadius: 28,
            background: "linear-gradient(180deg, rgba(8,20,16,0.6) 0%, rgba(4,14,10,0.45) 100%)",
            border: `1px solid rgba(15,115,94,0.1)`,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: `0 24px 80px rgba(0,6,4,0.5), inset 0 1px 0 rgba(20,168,130,0.05), 0 0 120px ${E}03`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top edge glow line */}
          <div className="absolute pointer-events-none" style={{ top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}30, ${E}20, ${GOLD}30, transparent)` }} />
          {/* Inner emerald ambient glow at top */}
          <div className="absolute pointer-events-none" style={{ top: 0, left: 0, right: 0, height: 150, background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${E}06, transparent)`, borderRadius: "28px 28px 0 0" }} />
          {/* Inner gold ambient glow at center */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 35% at 50% 50%, ${GOLD}04, transparent 65%)` }} />
          {/* Bottom edge glow */}
          <div className="absolute pointer-events-none" style={{ bottom: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${E}15, transparent)` }} />

          <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── 1. About Blurb ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          style={{ marginBottom: 36, maxWidth: 680 }}
        >
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(18px,2.2vw,24px)", letterSpacing: "-0.5px",
            color: "white", lineHeight: 1.28, margin: "0 0 14px",
          }}>
            Honouring Pioneers &amp; Innovators Shaping Kuwait&rsquo;s AI Future
          </h3>
          <p style={{
            fontFamily: "var(--font-outfit)", fontWeight: 350,
            fontSize: "clamp(13px,1.1vw,15px)", color: "rgba(255,255,255,0.45)",
            lineHeight: 1.7, margin: 0,
          }}>
            The Data &amp; AI First Awards 2026 celebrate outstanding individuals and organisations driving AI transformation, data innovation, and governance leadership across Kuwait&rsquo;s public and private sectors.
          </p>
        </motion.div>

        {/* ── 2. Award Categories — Expanding Accordion ── */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 20 }}>
          {AWARDS.map((award, i) => {
            const isExpanded = expandedAward === i;
            return (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.04, ease: EASE }}
                onClick={() => setExpandedAward(isExpanded ? null : i)}
                style={{
                  borderBottom: `1px solid ${isExpanded ? `${GOLD}20` : `${E}12`}`,
                  cursor: "pointer",
                  background: isExpanded ? `${E}08` : "transparent",
                  transition: "background 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s",
                  position: "relative",
                }}
                onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = `${E}04`; }}
                onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Gold left accent bar */}
                <motion.div
                  animate={{ scaleY: isExpanded ? 1 : 0, opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  style={{
                    position: "absolute", left: 0, top: "15%", bottom: "15%",
                    width: 2, background: `linear-gradient(180deg, ${GOLD}, ${GOLD_BRIGHT})`,
                    transformOrigin: "center", borderRadius: 1,
                  }}
                />

                {/* Main row */}
                <div className="daik-award-row flex items-center" style={{ padding: "22px 8px 22px 20px", gap: 20 }}>
                  {/* Number */}
                  <span className="daik-award-number" style={{
                    fontFamily: "var(--font-display)", fontWeight: 200,
                    fontSize: "clamp(28px,3vw,42px)", letterSpacing: "-2px",
                    color: isExpanded ? `${GOLD}50` : `${GOLD}18`,
                    transition: "color 0.4s cubic-bezier(0.16,1,0.3,1)",
                    minWidth: 52, textAlign: "right", lineHeight: 1,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <span className="daik-award-title" style={{
                    flex: 1,
                    fontFamily: "var(--font-display)", fontWeight: 600,
                    fontSize: "clamp(14px,1.3vw,18px)",
                    color: isExpanded ? "white" : "rgba(255,255,255,0.55)",
                    transition: "color 0.4s cubic-bezier(0.16,1,0.3,1)",
                    letterSpacing: "-0.3px",
                  }}>
                    {award.title}
                  </span>

                  {/* Plus / Cross toggle */}
                  <motion.svg
                    animate={{ rotate: isExpanded ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke={isExpanded ? GOLD : "rgba(255,255,255,0.2)"}
                    strokeWidth="1.5" strokeLinecap="round"
                    style={{ flexShrink: 0, marginRight: 4, transition: "stroke 0.35s" }}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </motion.svg>
                </div>

                {/* Expandable content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="daik-award-expand-content" style={{ padding: "0 8px 26px 92px" }}>
                        <p style={{
                          fontFamily: "var(--font-outfit)", fontWeight: 350,
                          fontSize: 14, color: "rgba(255,255,255,0.4)",
                          lineHeight: 1.7, margin: "0 0 16px", maxWidth: 520,
                        }}>
                          {award.desc}
                        </p>
                        <span
                          style={{
                            fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500,
                            color: GOLD, letterSpacing: "0.5px", textTransform: "uppercase" as const,
                            borderBottom: `1px solid ${GOLD}35`,
                            paddingBottom: 2,
                            transition: "border-color 0.3s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${GOLD}35`; }}
                        >
                          Nominate &rarr;
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, margin: "28px 0", background: `linear-gradient(90deg, transparent, ${E}15, ${GOLD}20, ${E}15, transparent)` }} />

        {/* ── 3. Nominations & Eligibility (Split Row) — with event photo backdrop ── */}
        <div style={{ position: "relative", borderRadius: 20, overflow: "hidden" }}>
          {/* Event photo backdrop */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ filter: "brightness(0.15) saturate(0.6)" }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(4,14,10,0.7) 0%, transparent 25%, transparent 75%, rgba(4,14,10,0.7) 100%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${GOLD}08, transparent 70%)` }} />

          <div ref={nomRef} className="daik-awards-nom" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, position: "relative", zIndex: 1, padding: "clamp(24px,3vw,40px)" }}>

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
              Data &amp; AI First Awards recognise organisations and leaders demonstrating exceptional contributions to Kuwait&rsquo;s data and AI ecosystem.
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

          {/* RIGHT: Nomination Form — liquid glass card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={nomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            style={{
              padding: "clamp(24px,3vw,36px)",
              borderRadius: 20,
              background: "linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              backdropFilter: "blur(32px) saturate(1.4)",
              WebkitBackdropFilter: "blur(32px) saturate(1.4)",
              border: `1px solid rgba(255,255,255,0.1)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.02), 0 8px 40px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.05)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top refraction highlight */}
            <div className="absolute pointer-events-none" style={{ top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.15) 70%, transparent 95%)` }} />
            {/* Inner light refraction — warm shift top-right, cool shift bottom-left */}
            <div className="absolute pointer-events-none" style={{ top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}0C, transparent 70%)`, filter: "blur(40px)" }} />
            <div className="absolute pointer-events-none" style={{ bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${E}0C, transparent 70%)`, filter: "blur(40px)" }} />
            {/* Subtle inner sheen */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)", borderRadius: 20 }} />

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
                  <div className="daik-awards-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
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
                    {AWARDS.map((a) => (
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
        </div>{/* close daik-awards-nom grid */}
        </div>{/* close photo backdrop wrapper */}

          </div>{/* close zIndex:1 inner */}
        </motion.div>{/* close glass container */}
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .daik-awards-nom { 
            grid-template-columns: 1fr !important;
            padding: 20px !important;
            gap: 28px !important;
          }
          .daik-awards-form-grid { grid-template-columns: 1fr !important; }
          .daik-award-title { font-size: 14px !important; }
          .daik-award-expand-content {
            padding-left: 20px !important;
            padding-right: 16px !important;
          }
          .daik-award-number {
            min-width: 36px !important;
            font-size: 24px !important;
          }
          .daik-award-row {
            padding: 16px 8px 16px 12px !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 480px) {
          .daik-awards-nom { 
            padding: 16px !important;
            gap: 24px !important;
          }
          .daik-award-title { font-size: 13px !important; }
          .daik-award-expand-content {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .daik-award-number {
            min-width: 28px !important;
            font-size: 20px !important;
          }
          .daik-award-row {
            padding: 14px 6px 14px 8px !important;
            gap: 10px !important;
          }
        }
        .daik-awards-form-grid input::placeholder,
        .daik-awards-form-grid + select,
        .daik-awards-form-grid ~ textarea::placeholder {
          color: rgba(255,255,255,0.3);
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  10. WHO SHOULD ATTEND
// ═══════════════════════════════════════════════════════════════════════════════

function WhoShouldAttend() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hoveredRole, setHoveredRole] = useState<number | null>(null);
  const [hoveredInd, setHoveredInd] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      style={{
        background: "#040E0A",
        padding: "clamp(40px, 5vw, 72px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background event photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.07 }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, #040E0A 0%, rgba(4,14,10,0.85) 40%, rgba(4,14,10,0.9) 70%, #040E0A 100%)" }} />

      {/* Atmospheric layers */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50% at 75% 30%, ${E}06, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 40% at 20% 80%, ${E_BRIGHT}03, transparent 70%)` }} />
      <DotMatrixGrid color={E} opacity={0.015} spacing={30} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: 32 }}
        >
          <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: 16 }}>
            <span style={{ width: 30, height: 1, background: E }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: E }}>
              The Guest List
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 50,
                background: "rgba(196,163,74,0.1)",
                border: "1px solid rgba(196,163,74,0.2)",
                marginLeft: 8,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#C4A34A" stroke="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#C4A34A" }}>
                C-Level Only
              </span>
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,3.8vw,48px)", letterSpacing: "-1.5px", color: "white", lineHeight: 1.08, margin: 0 }}>
            Who We&apos;re Looking For
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.45)", marginTop: 10 }}>
            Applications accepted from senior decision-makers only
          </p>
        </motion.div>

        {/* ── Split Layout: 55/45 ── */}
        <div className="daik-attend-split" style={{ display: "grid", gridTemplateColumns: "55fr 45fr", gap: "48px 56px", alignItems: "start" }}>

          {/* ── LEFT: Roles (2-column grid) ── */}
          <div className="daik-attend-roles" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 32px" }}>
            {ATTEND_ROLES.map((role, i) => (
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
                  background: hoveredRole === i ? `${E}06` : "transparent",
                  transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  cursor: "default",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: hoveredRole === i ? `${E}15` : `${E}08`,
                  border: `1px solid ${hoveredRole === i ? `${E}35` : `${E}12`}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.3s",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={hoveredRole === i ? E_BRIGHT : `${E}55`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s" }}>
                    <path d={role.icon} />
                  </svg>
                </div>
                <span style={{
                  fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 500,
                  color: hoveredRole === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                  transition: "all 0.3s", lineHeight: 1.35,
                }}>
                  {role.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* ── RIGHT: Industries + Stat line ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Industries block — liquid glass */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
              style={{
                padding: "28px 24px",
                borderRadius: 20,
                background: "linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                backdropFilter: "blur(32px) saturate(1.4)",
                WebkitBackdropFilter: "blur(32px) saturate(1.4)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.02), 0 8px 40px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.05)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top refraction highlight */}
              <div className="absolute pointer-events-none" style={{ top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.15) 70%, transparent 95%)" }} />
              {/* Inner light refraction */}
              <div className="absolute pointer-events-none" style={{ top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${E_BRIGHT}0C, transparent 70%)`, filter: "blur(40px)" }} />
              <div className="absolute pointer-events-none" style={{ bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${E}0C, transparent 70%)`, filter: "blur(40px)" }} />
              {/* Diagonal sheen */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)", borderRadius: 20 }} />

              <h3 style={{
                fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700,
                color: E_BRIGHT, letterSpacing: "1.5px", textTransform: "uppercase",
                marginBottom: 16, position: "relative", zIndex: 1,
              }}>
                Key Industries
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 2, position: "relative", zIndex: 1 }}>
                {ATTEND_INDUSTRIES.map((ind, i) => (
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
                      background: hoveredInd === i ? "rgba(255,255,255,0.06)" : "transparent",
                      transition: "background 0.25s",
                      cursor: "default",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hoveredInd === i ? E_BRIGHT : `${E}80`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "stroke 0.3s" }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span style={{
                      fontFamily: "var(--font-outfit)", fontSize: 14,
                      fontWeight: hoveredInd === i ? 600 : 450,
                      color: hoveredInd === i ? "white" : "rgba(255,255,255,0.55)",
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
              <div style={{ height: 1, background: `${E}18`, marginBottom: 14 }} />
              <div className="flex items-center gap-4 flex-wrap">
                {["250+ Senior Leaders", "8 Industries", "1 Transformative Day"].map((stat) => (
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
        @media (max-width: 1024px) {
          .daik-attend-split { 
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .daik-attend-roles { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .daik-attend-roles { grid-template-columns: 1fr !important; gap: 2px !important; }
          .daik-attend-roles > div {
            padding: 10px 8px !important;
          }
          .daik-attend-roles > div > div {
            width: 28px !important;
            height: 28px !important;
          }
          .daik-attend-roles > div > span {
            font-size: 13px !important;
          }
        }
        @media (max-width: 480px) {
          .daik-attend-split {
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  11. WHY ATTEND
// ═══════════════════════════════════════════════════════════════════════════════

function WhyAttend() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIdx, setActiveIdx] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const activeItem = WHY_ATTEND[activeIdx];

  // Auto-cycle every 4s unless user has hovered
  useEffect(() => {
    if (userInteracted || !inView) return;
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % WHY_ATTEND.length);
    }, 4000);
    return () => clearInterval(id);
  }, [userInteracted, inView]);

  // Resume auto-cycle 8s after last interaction
  useEffect(() => {
    if (!userInteracted) return;
    const id = setTimeout(() => setUserInteracted(false), 8000);
    return () => clearTimeout(id);
  }, [userInteracted, activeIdx]);

  const handleHover = (i: number) => {
    setActiveIdx(i);
    setUserInteracted(true);
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "#0A0A0A", padding: "clamp(40px, 5vw, 72px) 0" }}
    >
      {/* Atmospheric gradients */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 40% 50% at 60% 50%, ${E}06, transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 30% 40% at 20% 80%, ${E_BRIGHT}03, transparent 70%)` }} />
      <DotMatrixGrid color={E} opacity={0.02} spacing={24} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 12 }}>
            <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, transparent, ${E})` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: E }}>
              Why Leaders Apply
            </span>
            <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, ${E}, transparent)` }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px, 3.5vw, 48px)", letterSpacing: "-1.5px", color: "var(--white)", lineHeight: 1.1, margin: 0 }}>
            6 Reasons to <span style={{ color: "#C4A34A" }}>Fight</span> for a Seat
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.4)", marginTop: 10 }}>
            What makes this gathering worth the application process
          </p>
        </motion.div>

        {/* Console container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="daik-why-console"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 0,
            borderRadius: 18,
            overflow: "hidden",
            background: `${E}03`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${E}15`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.25), 0 0 80px ${E}05`,
          }}
        >
          {/* ── Left: Reason Tabs ── */}
          <div style={{ borderRight: `1px solid ${E}10`, background: "rgba(10,10,10,0.3)" }}>
            {/* Console header bar */}
            <div className="flex items-center gap-2" style={{ padding: "14px 20px", borderBottom: `1px solid ${E}08` }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: `${E}40` }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: `${E}25` }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: `${E}15` }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 500, color: "#404040", marginLeft: 8, letterSpacing: "1px" }}>
                REASONS
              </span>
            </div>

            {WHY_ATTEND.map((w, i) => {
              const isActive = i === activeIdx;
              return (
                <button
                  key={w.title}
                  onMouseEnter={() => handleHover(i)}
                  onClick={() => handleHover(i)}
                  className="w-full text-left transition-all"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "18px 20px",
                    background: isActive ? `${E}0A` : "transparent",
                    border: "none",
                    borderBottom: `1px solid ${E}08`,
                    borderLeft: isActive ? `3px solid ${E_BRIGHT}` : "3px solid transparent",
                    cursor: "pointer",
                    transitionDuration: "0.25s",
                    position: "relative",
                  }}
                >
                  {/* Active glow */}
                  {isActive && (
                    <div className="absolute pointer-events-none" style={{ width: 100, height: 40, left: 0, top: "50%", transform: "translateY(-50%)", background: `radial-gradient(ellipse at left center, ${E}12, transparent 70%)` }} />
                  )}
                  <span style={{
                    fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700,
                    color: isActive ? E_BRIGHT : `${E}40`,
                    minWidth: 24, position: "relative",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-outfit)", fontSize: 14,
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? "var(--white)" : "#606060",
                    transition: "color 0.2s",
                    position: "relative",
                  }}>
                    {w.title}
                  </span>
                </button>
              );
            })}

            {/* Progress bar at bottom */}
            <div style={{ height: 2, background: `${E}08`, position: "relative", overflow: "hidden" }}>
              <motion.div
                key={`progress-${activeIdx}-${userInteracted}`}
                initial={{ width: "0%" }}
                animate={{ width: userInteracted ? "0%" : "100%" }}
                transition={{ duration: userInteracted ? 0 : 4, ease: "linear" }}
                style={{ height: "100%", background: `linear-gradient(90deg, ${E}, ${E_BRIGHT})`, borderRadius: 1 }}
              />
            </div>
          </div>

          {/* ── Right: Answer Panel ── */}
          <div style={{ padding: "clamp(28px,3.5vw,44px)", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", minHeight: 320 }}>
            {/* Background glow */}
            <div className="absolute pointer-events-none" style={{ width: 300, height: 300, top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: `radial-gradient(ellipse at center, ${E}08, transparent 70%)`, filter: "blur(40px)" }} />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ position: "relative" }}
              >
                {/* Title */}
                <h4 style={{
                  fontFamily: "var(--font-display)", fontSize: "clamp(18px,1.8vw,22px)",
                  fontWeight: 700, color: "white", margin: "0 0 14px", letterSpacing: "-0.3px",
                }}>
                  {activeItem.title}
                </h4>

                {/* Description */}
                <p style={{
                  fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 300,
                  color: "rgba(255,255,255,0.5)", lineHeight: 1.8, margin: "0 0 28px",
                }}>
                  {activeItem.desc}
                </p>

                {/* Stat pill */}
                <div className="flex items-center gap-4">
                  <span style={{
                    fontFamily: "var(--font-display)", fontSize: "clamp(28px,2.5vw,36px)",
                    fontWeight: 800, color: E_BRIGHT, letterSpacing: "-1px", lineHeight: 1,
                  }}>
                    {activeItem.statValue}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500,
                    color: "rgba(255,255,255,0.3)", letterSpacing: "1px", textTransform: "uppercase",
                  }}>
                    {activeItem.stat}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .daik-why-console { 
            grid-template-columns: 1fr !important;
            border-radius: 14px !important;
          }
          .daik-why-console > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid rgba(15,115,94,0.1);
          }
          .daik-why-console > div:first-child > button {
            padding: 14px 16px !important;
          }
          .daik-why-console > div:last-child {
            min-height: 260px !important;
            padding: 24px 20px !important;
          }
        }
        @media (max-width: 480px) {
          .daik-why-console > div:first-child > button {
            padding: 12px 14px !important;
          }
          .daik-why-console > div:first-child > button span:last-child {
            font-size: 13px !important;
          }
          .daik-why-console > div:last-child {
            min-height: 240px !important;
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  12. PAST EVENTS GALLERY
// ═══════════════════════════════════════════════════════════════════════════════

const PAST_EVENT_PHOTOS = [
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0290.JPG", caption: "OT Security First Abu Dhabi 2026" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0001.JPG", caption: "Keynote Session" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0012.JPG", caption: "Panel Discussion" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0025.JPG", caption: "Networking" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0028.JPG", caption: "Exhibition" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/Good/4N8A0006.JPG", caption: "Awards Ceremony" },
];

function PastEventsGallery() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "#0A0A0A",
        padding: "clamp(48px, 6vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${E}08, transparent)` }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: E }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: E_BRIGHT }}>
              Events First Group
            </span>
            <span style={{ width: 30, height: 1, background: E }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-1.5px", color: "var(--white)", lineHeight: 1.1, margin: "16px 0 0" }}>
            From Our Recent Events
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.5)", marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>
            A glimpse of what to expect at Data & AI First Kuwait
          </p>
        </motion.div>

        {/* Photo Grid */}
        <div
          className="daik-gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}
        >
          {PAST_EVENT_PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
              className="relative overflow-hidden group"
              style={{
                borderRadius: 14,
                aspectRatio: i === 0 ? "16/10" : "4/3",
                gridColumn: i === 0 ? "span 2" : "span 1",
                gridRow: i === 0 ? "span 2" : "span 1",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-700"
                style={{ transform: "scale(1)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "white" }}>
                  {photo.caption}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="flex flex-wrap justify-center gap-8"
          style={{ marginTop: 32 }}
        >
          {[
            { value: "15+", label: "Events Delivered" },
            { value: "5,000+", label: "Attendees" },
            { value: "6", label: "GCC Countries" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: E_BRIGHT }}>{stat.value}</span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "#606060", display: "block", marginTop: 4 }}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .daik-gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .daik-gallery-grid > div:first-child {
            grid-column: span 2 !important;
            grid-row: span 1 !important;
          }
        }
        @media (max-width: 480px) {
          .daik-gallery-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .daik-gallery-grid > div:first-child {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  13. SPONSORS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const SPONSOR_TIERS: {
  tier: string;
  slots: number;
  color: string;
  sponsors?: { name: string; logo: string }[];
}[] = [
  { tier: "Gold Partner", slots: 1, color: GOLD, sponsors: [] },
  { tier: "Associate Partners", slots: 2, color: E_BRIGHT, sponsors: [] },
  { tier: "Panel Partners", slots: 3, color: "#A78BFA", sponsors: [] },
  { tier: "Strategic Partners", slots: 4, color: "#808080", sponsors: [
    { name: "ManageEngine", logo: "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/ManageEngine.png" },
  ]},
];

function SponsorsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="partners"
      style={{
        background: "#080808",
        padding: "clamp(48px, 6vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: E }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: E_BRIGHT }}>
              Partners
            </span>
            <span style={{ width: 30, height: 1, background: E }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-1.5px", color: "var(--white)", lineHeight: 1.1, margin: "16px 0 0" }}>
            Founding Partners
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.5)", marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>
            Join Kuwait&apos;s leading AI summit as a founding partner
          </p>
        </motion.div>

        {/* Sponsor Tiers */}
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
              className="daik-sponsor-grid"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(tierData.slots, 4)}, 1fr)`,
                gap: 12,
              }}
            >
              {/* Actual sponsors */}
              {tierData.sponsors?.map((sponsor, i) => (
                <div
                  key={sponsor.name}
                  className="flex items-center justify-center transition-all"
                  style={{
                    padding: tierIndex === 0 ? "32px" : "24px",
                    borderRadius: 14,
                    background: `linear-gradient(145deg, ${tierData.color}12, ${tierData.color}06)`,
                    border: `1px solid ${tierData.color}30`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    style={{ maxHeight: tierIndex === 0 ? 60 : 40, maxWidth: "100%", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.9 }}
                  />
                </div>
              ))}
              {/* Placeholder slots */}
              {Array.from({ length: tierData.slots - (tierData.sponsors?.length || 0) }).map((_, i) => (
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginTop: 36 }}
        >
          <Link
            href="#partnership"
            className="inline-flex items-center gap-2 transition-all group"
            style={{
              padding: "14px 32px",
              borderRadius: 50,
              background: `linear-gradient(135deg, ${E}15 0%, ${E}08 100%)`,
              border: `1px solid ${E}40`,
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 600,
              color: E_BRIGHT,
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
          .daik-sponsor-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .daik-sponsor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  14. FAQ SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const FAQS = [
  {
    q: "What is Data & AI First?",
    a: "Data & AI First is a premier summit series by Events First Group designed for enterprise leaders driving AI transformation across the GCC. It brings together Chief Data Officers, AI architects, government strategists, and solution providers for a full day of practitioner-led sessions, workshops, and curated meetings.",
  },
  {
    q: "Who should attend?",
    a: "The summit is built for C-suite and senior leaders in data, AI, digital transformation, and technology. Think CDOs, CAIOs, CTOs, Heads of Data Science, Directors of Digital Transformation, and Government Technology Leaders.",
  },
  {
    q: "Is there a registration fee?",
    a: "Attendance is by invitation only. Submit your application and our committee will review within 48 hours. Approved delegates receive complimentary access including all sessions, networking lunch, and materials.",
  },
  {
    q: "What's included in my attendance?",
    a: "Full-day access to all keynotes, panels, and workshops. Networking lunch and refreshments. Event materials and delegate pack. Certificate of attendance. Access to the exhibition floor and sponsor showcases.",
  },
  {
    q: "What is the dress code?",
    a: "Business formal. The summit brings together senior executives and government officials, so professional attire is expected.",
  },
  {
    q: "How can my company sponsor or partner?",
    a: "We offer Patronage, Knowledge Partner, and Supporting Partner tiers. Founding partners receive priority positioning across all future editions. Request the partnership deck through our form above.",
  },
];

function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      ref={ref}
      style={{
        background: "#0A0A0A",
        padding: "clamp(48px, 6vw, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span style={{ width: 30, height: 1, background: E }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: E_BRIGHT }}>
              FAQ
            </span>
            <span style={{ width: 30, height: 1, background: E }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-1.5px", color: "var(--white)", lineHeight: 1.1, margin: "16px 0 0" }}>
            Common Questions
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: EASE }}
                style={{
                  borderRadius: 12,
                  background: isOpen ? `${E}0A` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isOpen ? `${E}25` : "rgba(255,255,255,0.05)"}`,
                  overflow: "hidden",
                  transition: "all 0.3s",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left"
                  style={{ padding: "18px 20px", background: "none", border: "none", cursor: "pointer" }}
                >
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, color: isOpen ? "white" : "rgba(255,255,255,0.7)" }}>
                    {faq.q}
                  </span>
                  <motion.svg
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke={isOpen ? E_BRIGHT : "rgba(255,255,255,0.3)"}
                    strokeWidth="2" strokeLinecap="round"
                    style={{ flexShrink: 0, marginLeft: 16 }}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, padding: "0 20px 18px", margin: 0 }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ textAlign: "center", marginTop: 32 }}
        >
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "#606060" }}>
            Still have questions?{" "}
            <a href="mailto:info@eventsfirstgroup.com" style={{ color: E_BRIGHT, textDecoration: "none" }}>
              Contact us
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  15. APPLICATION FORM + SPLIT CTA
// ═══════════════════════════════════════════════════════════════════════════════

function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    background: "rgba(0,0,0,0.4)",
    border: `1px solid ${focusedField === field ? `${EFG_ORANGE}50` : "rgba(255,255,255,0.1)"}`,
    fontFamily: "var(--font-outfit)",
    fontSize: 14,
    fontWeight: 400,
    color: "white",
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
    boxShadow: focusedField === field ? `0 0 0 3px ${EFG_ORANGE}15` : "none",
  });

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ textAlign: "center", padding: "32px 0" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: `${EFG_ORANGE}20`,
            border: `2px solid ${EFG_ORANGE}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={EFG_ORANGE} strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h4 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "white", margin: "0 0 8px" }}>
          Application Submitted
        </h4>
        <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "#808080", maxWidth: 280, margin: "0 auto", lineHeight: 1.6 }}>
          Our team will review your application and respond within 48 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <div className="daik-app-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Full Name"
          required
          onFocus={() => setFocusedField("name")}
          onBlur={() => setFocusedField(null)}
          style={inputStyle("name")}
        />
        <input
          type="email"
          placeholder="Work Email"
          required
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          style={inputStyle("email")}
        />
        <input
          type="text"
          placeholder="Job Title"
          required
          onFocus={() => setFocusedField("title")}
          onBlur={() => setFocusedField(null)}
          style={inputStyle("title")}
        />
        <input
          type="text"
          placeholder="Company"
          required
          onFocus={() => setFocusedField("company")}
          onBlur={() => setFocusedField(null)}
          style={inputStyle("company")}
        />
      </div>
      <select
        required
        onFocus={() => setFocusedField("industry")}
        onBlur={() => setFocusedField(null)}
        style={{
          ...inputStyle("industry"),
          marginBottom: 12,
          cursor: "pointer",
          appearance: "none",
          color: "#808080",
        }}
      >
        <option value="">Select Industry</option>
        <option>Government</option>
        <option>Finance & Banking</option>
        <option>Technology</option>
        <option>Oil & Gas</option>
        <option>Healthcare</option>
        <option>Telecommunications</option>
        <option>Education</option>
        <option>Other</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full transition-all"
        style={{
          padding: "14px 28px",
          borderRadius: 50,
          background: loading ? `${EFG_ORANGE}60` : `linear-gradient(135deg, #C4A34A 0%, #D4B85A 100%)`,
          border: "none",
          fontFamily: "var(--font-outfit)",
          fontSize: 15,
          fontWeight: 700,
          color: "#000",
          cursor: loading ? "wait" : "pointer",
          boxShadow: `0 6px 28px rgba(196,163,74,0.35)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4m0 12v4m-8-10h4m12 0h4m-5.66-5.66l-2.83 2.83m-5.66 5.66l-2.83 2.83m11.32 0l-2.83-2.83m-5.66-5.66l-2.83-2.83" />
            </svg>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
            </svg>
            <span>Submit Application</span>
          </>
        )}
      </button>
      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "#505050", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
        Applications reviewed within 48 hours. Senior leaders only.
      </p>
    </form>
  );
}

function PartnershipForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    background: "rgba(0,0,0,0.4)",
    border: `1px solid ${focusedField === field ? `${E}50` : "rgba(255,255,255,0.1)"}`,
    fontFamily: "var(--font-outfit)",
    fontSize: 13,
    fontWeight: 400,
    color: "white",
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
    boxShadow: focusedField === field ? `0 0 0 3px ${E}15` : "none",
  });

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ textAlign: "center", padding: "24px 0" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: `${E}20`,
            border: `2px solid ${E}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={E_BRIGHT} strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h4 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "white", margin: "0 0 6px" }}>
          Request Received
        </h4>
        <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "#707070", maxWidth: 240, margin: "0 auto", lineHeight: 1.5 }}>
          Partnership deck will be sent to your email shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <div className="daik-partner-form-grid" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="text"
          placeholder="Company Name"
          required
          onFocus={() => setFocusedField("company")}
          onBlur={() => setFocusedField(null)}
          style={inputStyle("company")}
        />
        <input
          type="text"
          placeholder="Contact Person"
          required
          onFocus={() => setFocusedField("contact")}
          onBlur={() => setFocusedField(null)}
          style={inputStyle("contact")}
        />
        <input
          type="email"
          placeholder="Work Email"
          required
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          style={inputStyle("email")}
        />
        <select
          required
          onFocus={() => setFocusedField("tier")}
          onBlur={() => setFocusedField(null)}
          style={{
            ...inputStyle("tier"),
            cursor: "pointer",
            appearance: "none",
            color: "#808080",
          }}
        >
          <option value="">Partnership Interest</option>
          <option>Patronage Partner</option>
          <option>Knowledge Partner</option>
          <option>Supporting Partner</option>
          <option>Exhibition Only</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full transition-all"
        style={{
          marginTop: 12,
          padding: "12px 24px",
          borderRadius: 50,
          background: loading ? `${E}60` : `linear-gradient(135deg, ${E} 0%, ${E_BRIGHT} 100%)`,
          border: "none",
          fontFamily: "var(--font-outfit)",
          fontSize: 14,
          fontWeight: 600,
          color: "white",
          cursor: loading ? "wait" : "pointer",
          boxShadow: `0 4px 20px ${E}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4m0 12v4m-8-10h4m12 0h4" />
            </svg>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Request Partnership Deck</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 10, color: "#505050", textAlign: "center", marginTop: 10, lineHeight: 1.4 }}>
        Deck sent via email within 24 hours.
      </p>
    </form>
  );
}

function SplitCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const cd = useCountdown(EVENT_DATE);

  return (
    <section
      ref={ref}
      id="register"
      className="relative overflow-hidden"
      style={{ background: "#0A0A0A", padding: "clamp(40px, 5vw, 72px) 0" }}
    >
      {/* Background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ filter: "brightness(0.08) saturate(0.3)" }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${E}08 0%, transparent 60%)` }} />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          {/* Exclusivity badge */}
          <div className="flex items-center justify-center gap-2" style={{ marginBottom: 16 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                borderRadius: 50,
                background: "rgba(196,163,74,0.12)",
                border: "1px solid rgba(196,163,74,0.25)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4A34A" strokeWidth="2" strokeLinecap="round">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#C4A34A" }}>
                Approval Required · Limited Seats
              </span>
            </span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px, 3.5vw, 48px)", letterSpacing: "-1.5px", color: "var(--white)", lineHeight: 1.1, margin: 0 }}>
            Request Your Invitation
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.5)", marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>
            All applications are reviewed by our committee. Senior leaders only.
          </p>
        </motion.div>

        {/* Two cards */}
        <div
          className="daik-cta-grid"
          style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}
        >
          {/* Register card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            style={{
              borderRadius: 22,
              padding: "40px 36px",
              background: "linear-gradient(145deg, rgba(232,101,26,0.08) 0%, rgba(10,10,10,0.8) 100%)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: `1px solid ${EFG_ORANGE}35`,
              boxShadow: `0 8px 40px rgba(232,101,26,0.1), inset 0 1px 0 rgba(232,101,26,0.15)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top glow accent */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${EFG_ORANGE}50, transparent)` }} />
            
            {/* Applications Closing badge */}
            <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 16 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 14px",
                  borderRadius: 50,
                  background: "linear-gradient(135deg, rgba(196,163,74,0.15) 0%, rgba(196,163,74,0.08) 100%)",
                  border: "1px solid rgba(196,163,74,0.3)",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "#C4A34A", animationDuration: "1.5s" }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#C4A34A" }} />
                </span>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#C4A34A" }}>
                  Applications Closing Soon
                </span>
              </span>
            </div>

            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: `${EFG_ORANGE}90` }}>
              For Senior Leaders
            </span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 2.8vw, 32px)", fontWeight: 800, color: "var(--white)", margin: "10px 0 0", letterSpacing: "-0.5px" }}>
              Request Your Invitation
            </h3>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "#808080", margin: "12px 0 0", lineHeight: 1.7, maxWidth: 380 }}>
              Submit your application to join Kuwait&apos;s most exclusive Data & AI gathering.
            </p>

            {/* Vetting process badge */}
            <div className="flex flex-col gap-2" style={{ marginTop: 16 }}>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4A34A" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "#C4A34A" }}>
                  Vetting process: 48-hour approval
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={EFG_ORANGE} strokeWidth="2" strokeLinecap="round">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: `${EFG_ORANGE}90` }}>
                  Only 68 spots remaining of 250
                </span>
              </div>
            </div>

            {/* Application Form */}
            <ApplicationForm />
          </motion.div>

          {/* Partnership card */}
          <motion.div
            id="partnership"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            style={{
              borderRadius: 22,
              padding: "40px 32px",
              background: "linear-gradient(145deg, rgba(15,115,94,0.06) 0%, rgba(10,10,10,0.8) 100%)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: `1px solid ${E}30`,
              boxShadow: `0 8px 40px ${E}08, inset 0 1px 0 ${E}15`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top glow accent */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${E}40, transparent)` }} />
            
            {/* Partnership tiers badge */}
            <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 14px",
                  borderRadius: 50,
                  background: `linear-gradient(135deg, ${E}15 0%, ${E}08 100%)`,
                  border: `1px solid ${E}25`,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill={E_BRIGHT} stroke="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: E_BRIGHT }}>
                  Premium Partnerships
                </span>
              </span>
            </div>

            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: `${E_BRIGHT}90` }}>
              For Brands & Vendors
            </span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2vw, 26px)", fontWeight: 800, color: "var(--white)", margin: "12px 0 0", letterSpacing: "-0.5px" }}>
              Explore Partnerships
            </h3>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 300, color: "#707070", margin: "10px 0 0", lineHeight: 1.7 }}>
              Connect with Kuwait&rsquo;s top decision-makers in AI and data.
            </p>

            {/* Partnership Form */}
            <PartnershipForm />
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) { 
          .daik-cta-grid { 
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .daik-cta-grid > div {
            padding: 28px 24px !important;
          }
          .daik-app-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .daik-cta-grid > div {
            padding: 24px 20px !important;
            border-radius: 14px !important;
          }
          .daik-cta-grid > div > .flex {
            gap: 8px !important;
          }
          .daik-cta-grid > div > .flex > div {
            padding: 8px 10px !important;
            min-width: 48px !important;
          }
          .daik-cta-grid > div > .flex > div span:first-child {
            font-size: 18px !important;
          }
          .daik-cta-grid > div > a {
            width: 100%;
            justify-content: center;
            padding: 12px 24px !important;
          }
          .daik-app-form-grid {
            gap: 10px !important;
          }
          .daik-app-form-grid input,
          .daik-app-form-grid + select {
            padding: 10px 12px !important;
            font-size: 13px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  13. VENUE
// ═══════════════════════════════════════════════════════════════════════════════

function Venue() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref}>
      {/* Cinematic photo */}
      <div className="relative overflow-hidden" style={{ height: "65vh", minHeight: 500 }}>
        <motion.div className="absolute inset-0" style={{ y }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://efg-final.s3.eu-north-1.amazonaws.com/venues/jumeirah-messilah-kuwait.jpg"
            alt="Jumeirah Messilah Beach Hotel, Kuwait City"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.45) saturate(0.85)", transform: "scale(1.15)" }}
          />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, #0A0A0A 0%, transparent 25%, transparent 60%, rgba(10,10,10,0.9) 100%)" }} />

        {/* Venue name overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10" style={{ padding: "0 clamp(20px, 4vw, 60px) 120px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={E_BRIGHT} strokeWidth="2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: E_BRIGHT }}>
                The Venue
              </span>
            </div>
            <h2 className="daik-venue-title" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 56px)", letterSpacing: "-2px", color: "var(--white)", lineHeight: 1.05, margin: 0 }}>
              Jumeirah Messilah <span style={{ color: E_BRIGHT }}>Beach Hotel</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Floating info card */}
      <div
        style={{
          maxWidth: 1100,
          margin: "-80px auto 0",
          padding: "0 clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="daik-venue-inner"
          style={{
            borderRadius: 24,
            background: "linear-gradient(145deg, rgba(15,115,94,0.08) 0%, rgba(20, 20, 20, 0.9) 100%)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: `1px solid ${E}25`,
            padding: "44px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 48,
            alignItems: "start",
            boxShadow: `0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 ${E}15`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top glow accent */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${E}40, transparent)` }} />
          
          {/* Left */}
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${E}15`,
                  border: `1px solid ${E}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={E_BRIGHT} strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--white)", margin: 0 }}>
                Venue Details
              </h3>
            </div>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: 0 }}>
              Data & AI First Kuwait 2026 will be hosted at Jumeirah Messilah Beach Hotel — Kuwait's premier beachfront resort offering world-class conference facilities with stunning waterfront views.
            </p>
            
            {/* Venue confirmed badge */}
            <div className="flex items-center gap-2" style={{ marginTop: 20 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 50,
                  background: `${E}15`,
                  border: `1px solid ${E}30`,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={E_BRIGHT} strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, color: E_BRIGHT }}>
                  Venue Confirmed
                </span>
              </span>
            </div>
          </div>

          {/* Right: Detail grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Location", value: "Messilah, Kuwait", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" },
              { label: "Date", value: "May 18, 2026", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { label: "Time", value: "8:00 AM – 3:00 PM", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Format", value: "Full-Day Summit", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
            ].map((d, i) => (
              <motion.div
                key={d.label}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: "16px 18px",
                  borderRadius: 14,
                  background: i === 1 ? `${E}10` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${i === 1 ? `${E}25` : "rgba(255,255,255,0.06)"}`,
                  cursor: "default",
                }}
              >
                <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={i === 1 ? E_BRIGHT : "#505050"} strokeWidth="1.5" strokeLinecap="round">
                    <path d={d.icon} />
                  </svg>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: i === 1 ? E_BRIGHT : "#505050", margin: 0 }}>
                    {d.label}
                  </p>
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--white)", margin: 0 }}>
                  {d.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom padding */}
      <div style={{ height: 80, background: "#0A0A0A" }} />

      <style jsx global>{`
        @media (max-width: 768px) {
          .daik-venue-inner {
            grid-template-columns: 1fr !important;
            padding: 28px 24px !important;
            gap: 24px !important;
          }
          .daik-venue-inner > div:last-child {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
          .daik-venue-title {
            font-size: 28px !important;
          }
        }
        @media (max-width: 500px) {
          .daik-venue-title {
            font-size: 24px !important;
            letter-spacing: -1px !important;
          }
        }
        @media (max-width: 400px) {
          .daik-venue-inner {
            padding: 24px 20px !important;
            margin-top: -60px !important;
          }
          .daik-venue-inner > div:last-child > div {
            padding: 12px !important;
          }
          .daik-venue-inner > div:last-child > div p:last-child {
            font-size: 13px !important;
          }
          .daik-venue-title {
            font-size: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
