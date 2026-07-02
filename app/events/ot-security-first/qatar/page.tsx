"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal, preload, preconnect } from "react-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer, InquiryForm } from "@/components/sections";
import Link from "next/link";
import EventNavigation from "@/components/ui/EventNavigation";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Lenis (global smooth-scroll) hijacks the wheel, so native hash-anchor jumps get
// reset every frame. Drive Lenis directly when present, else fall back to native.
function otqScrollTo(id: string, offset = -80) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number }) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset });
  else el.scrollIntoView({ behavior: "smooth" });
}

// ─── Design Tokens ───────────────────────────────────────────────────────────
// OT Security First magenta as the primary brand, layered with Qatar's maroon +
// gold as country accents (the "Qatar-themed OT" direction).
const C = "#D34B9A";            // OT magenta
const C_BRIGHT = "#E86BB8";     // Light pink
const C_DEEP = "#9E2E74";       // Deep magenta for shadows
const QATAR = "#8A1538";        // Qatar flag maroon
const QATAR_BRIGHT = "#B83A5F"; // Bright maroon highlight
const GOLD = "#C4A34A";         // Awards / recognition gold
const GOLD_BRIGHT = "#E3C878";  // Bright gold
const BG_BASE = "#04060F";      // Unified section background (single deep navy — no seams)
const BG_ELEV = "#0B1226";      // Elevated panel base

const EASE = [0.16, 1, 0.3, 1] as const;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const S3_LOGOS = `${S3}/sponsors-logo`;
const HERO_IMAGE = `${S3}/assets/OT_qatar.png`;
const OT_LOGO = `${S3}/logos/Untitled-2-01.png`;

// Past OT Security First series sponsors & partners (marquee)
const SPONSOR_MARQUEE_1 = [
  `${S3_LOGOS}/paloalto.png`,
  `${S3_LOGOS}/fortinet.png`,
  `${S3_LOGOS}/Claroty.png`,
  `${S3_LOGOS}/Dragos.png`,
  `${S3_LOGOS}/nozomi-networks.png`,
  `${S3_LOGOS}/Tenable-logo.png`,
  `${S3_LOGOS}/kaspersky.png`,
  `${S3_LOGOS}/sentinelone.png`,
  `${S3_LOGOS}/Microsoft_logo.png`,
  `${S3_LOGOS}/Google-Cloud-Security.png`,
  `${S3_LOGOS}/threatlocker.png`,
  `${S3_LOGOS}/OPSWAT-logo.png`,
  `${S3_LOGOS}/Xage.png`,
  `${S3_LOGOS}/corelight.png`,
];
const SPONSOR_MARQUEE_2 = [
  `${S3_LOGOS}/Oracle.png`,
  `${S3_LOGOS}/EY.png`,
  `${S3_LOGOS}/Group-IB.png`,
  `${S3_LOGOS}/Acronis.png`,
  `${S3_LOGOS}/ManageEngine.png`,
  `${S3_LOGOS}/Wallix.png`,
  `${S3_LOGOS}/PENTERA.png`,
  `${S3_LOGOS}/secureworks.png`,
  `${S3_LOGOS}/Anomali.png`,
  `${S3_LOGOS}/AmiViz.png`,
  `${S3_LOGOS}/Paramount.png`,
  `${S3_LOGOS}/YOKOGAWA.png`,
];

// Approx 3rd week of November 2026 — display copy stays "3rd Week of November 2026"
const EVENT_DATE_ISO = "2026-11-16T09:00:00+03:00";

// OT event photography (UAE 2025 + KSA archive, reused as series imagery)
const OT_PHOTOS = {
  panel: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0510.JPG`,
  floor: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0811.JPG`,
  network: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0683.JPG`,
  exhibition: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0820.JPG`,
  session: `${S3}/events/opex+KSA+few/DSC08208.jpg`,
  speakers: `${S3}/events/opex+KSA+few/DSC08456.jpg`,
};

// ─── Content data ────────────────────────────────────────────────────────────
const NUMBERS: { value: number; suffix: string; label: string }[] = [
  { value: 200, suffix: "+", label: "Delegates" },
  { value: 25, suffix: "+", label: "Senior Industry Speakers" },
  { value: 12, suffix: "+", label: "Strategic Conference Sessions" },
  { value: 10, suffix: "+", label: "Technology Providers" },
  { value: 10, suffix: "+", label: "Media & Knowledge Partners" },
  { value: 5, suffix: "+", label: "Industry Recognition Awards" },
];

const AUDIENCE_ROLES: { role: string; icon: string }[] = [
  { role: "Senior government policymakers and ministries", icon: "M12 2 3 7v6c0 5 3.8 8.5 9 9 5.2-.5 9-4 9-9V7z" },
  { role: "National Cyber Security Agency (NCSA) and regulatory bodies", icon: "M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6zM9 12l2 2 4-4" },
  { role: "Heads of critical infrastructure and national utility operators", icon: "M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01" },
  { role: "CISOs, CIOs, CTOs, and CDOs", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { role: "Heads of OT, ICS, and industrial cybersecurity", icon: "M12 2a3 3 0 0 0-3 3v1H7a2 2 0 0 0-2 2v11h14V8a2 2 0 0 0-2-2h-2V5a3 3 0 0 0-3-3zM9 12h6M9 15h6" },
  { role: "Digital transformation and innovation leaders", icon: "M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8" },
  { role: "Risk, compliance, and governance executives", icon: "M9 11l3 3 8-8M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" },
  { role: "Energy, LNG, utilities, and smart city leaders", icon: "M13 2 3 14h7l-1 8 10-12h-7z" },
  { role: "Technology providers, solution architects, and system integrators", icon: "M20 7h-9M14 17H5M17 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM7 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
  { role: "Consultants and strategic advisory firms", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
];

const KEY_THEMES: string[] = [
  "Securing Qatar's critical infrastructure in a hyper-connected era",
  "Bridging IT/OT convergence without expanding the attack surface",
  "Building resilient-by-design operations across energy and utilities",
  "Modernising legacy OT systems without disrupting LNG production",
  "Zero trust architecture for operational technology environments",
  "AI powered threat detection and autonomous OT incident response",
  "Protecting smart city infrastructure and the national digital twin",
  "Enabling secure remote operations and distributed control systems",
  "Strengthening OT supply chain security and third-party risk visibility",
  "Aligning industrial cybersecurity with NCSA and NIA regulatory mandates",
  "Developing future-ready OT cybersecurity talent and capability",
  "From cyber risk to operational resilience in national infrastructure",
];

type MarketDriver = { driver: string; signal: string; opportunity: string; icon: string };
const MARKET_DRIVERS: MarketDriver[] = [
  {
    driver: "Smart City & Giga Project Development",
    signal:
      "Lusail City, a $45 billion, 38 km² smart city, is deploying an AI-powered Smart City Operating System integrating lighting, traffic, water, and building management across 450,000 residents and visitors, with Qatar planning USD 5.7 billion in digital investment by 2026.",
    opportunity:
      "Unprecedented demand for greenfield OT architecture, smart city SCADA harmonisation, and integration between citywide IoT sensor networks and OT security platforms.",
    icon: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 11h.01M15 11h.01",
  },
  {
    driver: "NCSA OT Security Mandates",
    signal:
      "The National Cyber Security Agency strictly enforces the National Information Assurance (NIA) policy and OT security recommendations based on ISA/IEC 62443 for Critical National Infrastructure, and has joined the ISASecure certification programme.",
    opportunity:
      "Massive push for OT-specific cybersecurity solutions, industrial network segmentation, and localised OT Security Operations Centres aligned with NCSA compliance requirements.",
    icon: "M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6zM9 12l2 2 4-4",
  },
  {
    driver: "LNG & Energy Sector Expansion",
    signal:
      "QatarEnergy and Qatargas continue to expand the country's LNG production capacity as the world's largest LNG exporter, with documented surges in OT-targeted cyberattacks against this infrastructure.",
    opportunity:
      "High demand for ICS and SCADA security, asset visibility platforms, and OT-specific incident response capability across upstream, midstream, and downstream LNG operations.",
    icon: "M13 2 3 14h7l-1 8 10-12h-7z",
  },
  {
    driver: "Utility & Grid Hardening",
    signal:
      "Kahramaa, in direct partnership with NCSA, is enforcing ISA/IEC 62443 compliance baselines across electricity and water generation stations, including a dedicated OT training programme for specialists.",
    opportunity:
      "Strong opportunities for Distributed Energy Resource Management Systems, advanced metering infrastructure, and OT security platforms tailored to power and desalination plants.",
    icon: "M4 14a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.5-1.5A4.5 4.5 0 1 1 18 14zM10 12l-2 4h4l-2 4",
  },
  {
    driver: "National Digital Twin Programme",
    signal:
      "The TASMU Smart Qatar programme is developing a National Digital Twin hosted in sovereign data centres for policymaking and urban planning, alongside more than 30 national smart solutions.",
    opportunity:
      "Crucial requirement for secure data integration layers between physical infrastructure sensors and the national digital twin platform, including sovereign cloud OT data security.",
    icon: "M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    driver: "IT/OT Convergence Pressures",
    signal:
      "QatarEnergy and major industrial operators are shifting asset data into private clouds and enterprise data lakes to support AI applications and predictive analytics across LNG and utility operations.",
    opportunity:
      "Crucial requirement for secure IT/OT gateways, unified asset visibility platforms, and data normalisation layers between the plant floor and the boardroom.",
    icon: "M6 3v12a3 3 0 0 0 3 3h6M18 21V9a3 3 0 0 0-3-3H9M6 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  },
  {
    driver: "Construction & Infrastructure Automation",
    signal:
      "Qatar's construction market reached QAR 133.55 billion with Ashghal deploying 3D construction printing and digital twin technologies across major public infrastructure and utility projects.",
    opportunity:
      "Growing need for automated infrastructure monitoring, smart building management security, and OT protection for next-generation construction and public works technology.",
    icon: "M2 20h20M4 20V9l4-3M8 20V6l6-3v17M14 20V8l6 3v9M17 13h.01M11 9h.01M11 13h.01",
  },
];

// ─── Agenda ──────────────────────────────────────────────────────────────────
type AgendaItem = { start: string; end: string; type: string; title: string; desc: string };
type AgendaBreak = { kind: "break"; time: string; title: string };
type AgendaSession = {
  kind: "session";
  num: number;
  time: string;
  title: string;
  items: AgendaItem[];
};
type AgendaBlock = AgendaBreak | AgendaSession;

const AGENDA: AgendaBlock[] = [
  { kind: "break", time: "08:30", title: "Delegate Registration & Welcome Coffee" },
  {
    kind: "session",
    num: 1,
    time: "09:00 – 10:15",
    title: "Setting the National Standard: Where Lawmakers and Regulators Define the Rules of Engagement",
    items: [
      {
        start: "09:00", end: "09:10", type: "Ministerial Keynote",
        title: "Inside the National OT Security Mandate and What It Demands From Industry",
        desc: "A senior government figure lays out the national roadmap for protecting Qatar's industrial and critical infrastructure, what OT compliance now looks like under the National Cyber Security Strategy, and what action operators must take immediately.",
      },
      {
        start: "09:10", end: "09:20", type: "Keynote",
        title: "How NCSA and Kahramaa Are Enforcing ISA/IEC 62443 Across the Utility Sector",
        desc: "A joint walkthrough of the compliance journey across power and water generation facilities, covering asset inventories, risk scoring, and keeping plants running without interruption.",
      },
      {
        start: "09:20", end: "10:00", type: "Panel Discussion",
        title: "Learning Together: How GCC Regulators Are Sharing Intelligence and Frameworks to Strengthen Regional OT Defence",
        desc: "Senior regulators compare notes on cross-border threat intelligence, shared compliance benchmarks, and how national agencies are coordinating to protect industrial systems across borders.",
      },
    ],
  },
  { kind: "break", time: "10:00 – 10:45", title: "Networking Break · VIP Exhibition Tour" },
  {
    kind: "session",
    num: 2,
    time: "10:45 – 11:45",
    title: "Defending the Frontline: Qatar's Energy and LNG Sector Under Pressure",
    items: [
      {
        start: "10:45", end: "10:55", type: "Keynote",
        title: "Who Is Really Targeting Us? Nation-State Actors, Ransomware Gangs, and the Rising Threat to Gulf LNG Facilities in 2026",
        desc: "A threat intelligence briefing on the risks facing QatarEnergy and Qatargas, and the national-level response taking shape to counter them.",
      },
      {
        start: "10:55", end: "11:05", type: "Keynote",
        title: "How IT/OT Convergence Has Widened the Attack Surface in LNG and Petrochemical Plants",
        desc: "Examining how merging corporate networks with plant floor systems opens new vulnerability paths, and how segmentation and zero-trust models can close them back up.",
      },
      {
        start: "11:05", end: "11:45", type: "Panel Discussion",
        title: "Lessons From the Front Line: Incident Response, Detection, and Resilience in Qatar's Energy Operations",
        desc: "Operators from QatarEnergy and Qatargas share lived incident response experience, the gaps still found in detection capability, and what resilience really takes in the world's top LNG exporter.",
      },
    ],
  },
  {
    kind: "session",
    num: 3,
    time: "11:45 – 12:45",
    title: "Protecting the Lifelines: Power, Water, and the Systems Qatar Cannot Live Without",
    items: [
      {
        start: "11:45", end: "11:55", type: "Keynote",
        title: "How Secure Is the Grid, Really? Hardening SCADA and ICS Across Kahramaa's Power and Water Networks",
        desc: "A working framework covering asset visibility, vulnerability management, and IEC 62443 alignment for both ageing and newly built utility systems.",
      },
      {
        start: "11:55", end: "12:05", type: "Keynote",
        title: "Building a Fit-for-Purpose OT SOC: Lessons From Qatar's Most Critical Sites",
        desc: "A look at what a properly built OT SOC requires, how detection is engineered for industrial protocols, and how OT visibility feeds into a national security operations effort.",
      },
      {
        start: "12:05", end: "12:45", type: "Panel Discussion",
        title: "Closing the Gaps: Embedding OT Security Into Procurement and the Supply Chain Across Qatar's Industries",
        desc: "A conversation between operators, regulators, and procurement leaders on writing OT security into vendor contracts and holding every link in the supply chain to account.",
      },
    ],
  },
  { kind: "break", time: "12:45 – 14:00", title: "Networking Luncheon" },
  {
    kind: "session",
    num: 4,
    time: "14:00 – 15:30",
    title: "Looking Forward: Where Innovation and Collaboration Take Qatar's OT Security Next",
    items: [
      {
        start: "14:00", end: "14:15", type: "Keynote",
        title: "Can AI Stay Ahead of the Threat? Digital Twins and Predictive Security in Qatar's Industrial Future",
        desc: "A look at how AI-powered anomaly detection and digital twin simulations are being rolled out under approved GovAI frameworks, and what operators need to do now to keep pace.",
      },
      {
        start: "14:15", end: "14:30", type: "Closing Keynote",
        title: "One Shared Responsibility: A Call to Government and Industry to Secure Qatar's Industrial Future Together",
        desc: "A senior NCSA or ministry figure closes the day by framing the shared duty of operators, regulators, and the private sector in advancing OT resilience nationwide.",
      },
      {
        start: "14:30", end: "15:15", type: "Panel Discussion",
        title: "The Doha Commitment: What Qatar's Energy, Utility, and Government Leaders Must Deliver in the Next 12 Months",
        desc: "The day's key voices come together to set shared priorities, agree concrete actions, and make commitments that will shape OT security progress across Qatar.",
      },
    ],
  },
  { kind: "break", time: "15:15 – 15:30", title: "Official Close · Networking" },
];

const GALLERY: { src: string; alt: string; label: string }[] = [
  { src: OT_PHOTOS.panel, alt: "OT Security First panel discussion — industrial CISOs and OT cybersecurity leaders debating critical infrastructure defence", label: "Panel Discussion" },
  { src: OT_PHOTOS.session, alt: "OT Security First keynote session to a critical infrastructure security audience", label: "Main Session" },
  { src: OT_PHOTOS.floor, alt: "OT Security First exhibition floor — industrial cybersecurity vendors and OT security technology providers", label: "On Floor" },
  { src: OT_PHOTOS.network, alt: "OT Security First networking — CISOs and senior OT security executives building peer connections", label: "Networking" },
  { src: OT_PHOTOS.exhibition, alt: "OT Security First partner exhibition — vendors showcasing OT, ICS and SCADA security solutions", label: "Partner Exhibition" },
  { src: OT_PHOTOS.speakers, alt: "OT Security First speakers on stage — operational technology and ICS security experts presenting insights", label: "Industry Speakers" },
];

// ─── Hooks & shared helpers ──────────────────────────────────────────────────
function useCountdown(targetIso: string) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetIso).getTime() - Date.now();
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 });
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
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
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const loop = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Eyebrow({ inView, label, tone = "magenta" }: { inView: boolean; label: string; tone?: "magenta" | "maroon" | "gold" }) {
  const color = tone === "maroon" ? QATAR_BRIGHT : tone === "gold" ? GOLD_BRIGHT : C_BRIGHT;
  const rail = tone === "maroon" ? QATAR : tone === "gold" ? GOLD : C;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}
    >
      <span style={{ width: 26, height: 1, background: rail, boxShadow: `0 0 8px ${rail}66` }} />
      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "4.5px", textTransform: "uppercase", color }}>
        {label}
      </span>
      <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.14) 0%, transparent 70%)" }} />
    </motion.div>
  );
}

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

// Qatar flag-inspired 9-point serration — subtle divider motif
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

function Icon({ path, size = 22, color = C_BRIGHT, stroke = 1.6 }: { path: string; size?: number; color?: string; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={path} />
    </svg>
  );
}

// Ambient gradient splash backdrop — layered magenta / maroon / gold radials + blurred orbs.
// Parent section needs position:relative + overflow:hidden, and its content zIndex >= 1.
function GradientSplash() {
  return (
    <>
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(42% 38% at 10% 6%, ${C}24 0%, transparent 60%), radial-gradient(40% 44% at 94% 22%, ${QATAR}2E 0%, transparent 62%), radial-gradient(46% 42% at 78% 104%, ${GOLD}14 0%, transparent 60%)` }} />
      <div aria-hidden style={{ position: "absolute", top: "-8%", left: "-6%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${C}26 0%, transparent 70%)`, filter: "blur(70px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-10%", right: "-4%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${QATAR}2A 0%, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none" }} />
    </>
  );
}

// ─── LAZY MOUNT — defers below-fold render until near viewport ────────────────
function LazyMount({ children, minHeight = 400, id }: { children: React.ReactNode; minHeight?: number; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      id={id}
      style={{
        minHeight: show ? undefined : minHeight,
        // Skip paint/composite + pause CSS animations while this section is
        // scrolled off-screen; renders normally (no containment) when visible.
        // `auto` remembers the last rendered height so scrolling stays stable.
        contentVisibility: "auto",
        containIntrinsicSize: `auto ${minHeight}px`,
      }}
    >
      {show ? children : null}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function OTSecurityFirstQatar2026() {
  // Prioritize the hero LCP: it's painted as a CSS background-image (discovered
  // late by the browser), so warm the S3 origin and preload it at high priority.
  preconnect(S3);
  preload(HERO_IMAGE, { as: "image", fetchPriority: "high" });
  return (
    <div style={{ background: BG_BASE, color: "white", overflow: "hidden", position: "relative" }}>
      <EventNavigation />
      <Hero />
      <Overview />
      <MarketChallenge />
      <WhyQatarDoha />
      <LazyMount minHeight={520} id="speakers"><Speakers /></LazyMount>
      <LazyMount minHeight={280}><PastSponsors /></LazyMount>
      <AudienceThemesDrivers />
      <LazyMount minHeight={1200} id="agenda"><Agenda /></LazyMount>
      <LazyMount minHeight={640}><Testimonials /></LazyMount>
      <LazyMount minHeight={820}><Gallery /></LazyMount>
      <LazyMount minHeight={620} id="awards"><AwardsTeaser /></LazyMount>
      <LazyMount minHeight={520} id="contact"><GetInTouch /></LazyMount>
      <LazyMount minHeight={360} id="venue"><Venue /></LazyMount>
      <LazyMount minHeight={480} id="faq"><FaqSection /></LazyMount>
      <LazyMount minHeight={760} id="register"><RegisterSection /></LazyMount>
      <LazyMount minHeight={320}><SeriesEditions /></LazyMount>
      <LazyMount minHeight={420}><Footer /></LazyMount>

      {/* Post-Event Reports — request modal + floating download prompt */}
      <OtqPostEventReports />
      <OtqPostReportFloat />
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const cd = useCountdown(EVENT_DATE_ISO);
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax drift on the hero image
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 14,
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
        });
      }
      // Staggered entrance
      gsap.from(".otq-hero-anim", {
        y: 34,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const cdUnits = [
    { v: cd.d, l: "Days" },
    { v: cd.h, l: "Hrs" },
    { v: cd.m, l: "Min" },
    { v: cd.s, l: "Sec" },
  ];

  return (
    <section ref={rootRef} style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", background: BG_BASE }}>
      {/* BG image */}
      <div ref={bgRef} aria-hidden style={{ position: "absolute", inset: "-8% 0 0 0", zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${HERO_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center", filter: "saturate(1.05)" }} />
      </div>
      {/* Overlays */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: `linear-gradient(180deg, ${BG_BASE}E6 0%, ${BG_BASE}66 30%, ${BG_BASE}CC 72%, ${BG_BASE} 100%)` }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: `radial-gradient(120% 90% at 15% 20%, ${C}22 0%, transparent 55%), radial-gradient(90% 80% at 90% 90%, ${QATAR}30 0%, transparent 60%)` }} />
      <BgDots opacity={0.05} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1200, margin: "0 auto", padding: "120px 24px 90px" }}>
        <div className="otq-hero-anim" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
          <QatarSerration color={GOLD} width={70} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, letterSpacing: "5px", textTransform: "uppercase", color: GOLD_BRIGHT }}>
            1st Edition · State of Qatar
          </span>
        </div>

        <h1 className="otq-hero-anim" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(42px, 7vw, 92px)", lineHeight: 1.02, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, color: "white" }}>
          OT Security First
          <br />
          <span style={{ background: `linear-gradient(100deg, ${C_BRIGHT} 0%, ${C} 40%, ${QATAR_BRIGHT} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Qatar 2026
          </span>
        </h1>

        <p className="otq-hero-anim" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(16px, 2.1vw, 23px)", fontWeight: 400, color: "rgba(255,255,255,0.82)", maxWidth: 720, margin: "24px 0 0", lineHeight: 1.5 }}>
          Securing the Physical Core of Qatar's Critical Infrastructure.
        </p>

        {/* Meta chips */}
        <div className="otq-hero-anim" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 }}>
          {[
            { label: "3rd Week · November 2026", icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" },
            { label: "Doha, State of Qatar", icon: "M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" },
          ].map((m) => (
            <div key={m.label} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
              <Icon path={m.icon} size={16} color={C_BRIGHT} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* Countdown + CTAs */}
        <div className="otq-hero-anim" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 26, marginTop: 44 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {cdUnits.map((u) => (
              <div key={u.l} style={{ minWidth: 66, textAlign: "center", padding: "12px 10px", borderRadius: 14, background: "linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "white", lineHeight: 1 }}>{String(u.v).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--font-outfit)", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{u.l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={() => otqScrollTo("register")}
              style={{ cursor: "pointer", fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "white", padding: "15px 30px", borderRadius: 999, border: "none", background: `linear-gradient(100deg, ${C} 0%, ${C_DEEP} 100%)`, boxShadow: `0 12px 30px ${C}44` }}
            >
              Reserve Your Seat
            </button>
            <button
              onClick={() => otqScrollTo("agenda")}
              style={{ cursor: "pointer", fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "white", padding: "15px 30px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.04)" }}
            >
              View Agenda
            </button>
          </div>
        </div>
      </div>

      {/* EFG initiative badge - bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
        className="otq-efg-badge"
        style={{ position: "absolute", bottom: 32, right: "clamp(20px, 4vw, 56px)", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}
      >
        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "2.5px" }}>
          An Initiative By
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          decoding="async"
          src="/events-first-group_logo_alt.svg"
          alt="Events First Group logo - producers of OT Security First Qatar 2026, the State of Qatar's flagship industrial cybersecurity summit"
          width={180}
          height={66}
          style={{ height: 48, width: "auto", opacity: 0.8 }}
        />
      </motion.div>

      <style jsx global>{`
        @media (max-width: 720px) {
          .otq-efg-badge { bottom: 22px !important; gap: 4px !important; }
          .otq-efg-badge > span { font-size: 10px !important; letter-spacing: 1.8px !important; }
          .otq-efg-badge > img { height: 32px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── NUMBERS ──────────────────────────────────────────────────────────────────
function Numbers() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} style={{ marginTop: "clamp(44px, 5vw, 66px)", paddingTop: "clamp(36px, 4vw, 52px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
            <QatarSerration color={GOLD} width={54} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "4.5px", textTransform: "uppercase", color: GOLD_BRIGHT }}>OT Security First Qatar in Numbers</span>
            <QatarSerration color={GOLD} width={54} />
          </div>
        </div>

        <div className="otq-numbers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
          {NUMBERS.map((n, i) => (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              whileHover={{ y: -4, boxShadow: `0 20px 40px -16px ${C}40, 0 6px 16px -8px rgba(0,0,0,0.55)` }}
              /* skeuomorphic raised bezel — gradient metal rim + drop shadow */
              style={{
                position: "relative",
                borderRadius: 18,
                padding: 1.25,
                background: `linear-gradient(150deg, ${C_BRIGHT}80 0%, rgba(255,255,255,0.15) 28%, ${GOLD}5E 68%, rgba(255,255,255,0.05) 100%)`,
                boxShadow: "0 16px 32px -14px rgba(0,0,0,0.7), 0 4px 12px -6px rgba(0,0,0,0.5)",
              }}
            >
              {/* liquid-glass inner panel */}
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                  minHeight: 148,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderRadius: 16.75,
                  padding: "26px 14px",
                  textAlign: "center",
                  background: "linear-gradient(168deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.018) 45%, rgba(4,6,15,0.45) 100%)",
                  backdropFilter: "blur(22px) saturate(1.5)",
                  WebkitBackdropFilter: "blur(22px) saturate(1.5)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -20px 34px -20px rgba(0,0,0,0.6)",
                }}
              >
                {/* top glass sheen */}
                <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)", pointerEvents: "none" }} />
                {/* corner refraction glow */}
                <div aria-hidden style={{ position: "absolute", top: "-34%", right: "-22%", width: 110, height: 110, background: `radial-gradient(circle, ${C}4D 0%, transparent 70%)`, filter: "blur(8px)", pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* glowing gradient number */}
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 3.6vw, 46px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", background: `linear-gradient(120deg, #ffffff 0%, ${C_BRIGHT} 48%, ${QATAR_BRIGHT} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", filter: `drop-shadow(0 2px 10px ${C}45)` }}>
                    <Counter to={n.value} suffix={n.suffix} />
                  </div>

                  {/* gold hairline */}
                  <div aria-hidden style={{ width: 24, height: 1, margin: "12px auto 11px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

                  <div style={{ fontFamily: "var(--font-outfit)", fontSize: 12.5, fontWeight: 500, color: "rgba(255,255,255,0.66)", lineHeight: 1.35 }}>{n.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) { .otq-numbers-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 520px) { .otq-numbers-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </div>
  );
}

// ─── OT highlight video — featured, click-to-play ────────────────────────────
const OT_HIGHLIGHT = { id: "3ofcPquafgk", title: "OT Security First UAE — Event Highlights" };

function OtqVideoCard() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="otq-vid" onClick={() => !playing && setPlaying(true)}>
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${OT_HIGHLIGHT.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={OT_HIGHLIGHT.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            src={`https://img.youtube.com/vi/${OT_HIGHLIGHT.id}/maxresdefault.jpg`}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${OT_HIGHLIGHT.id}/hqdefault.jpg`; }}
            alt={OT_HIGHLIGHT.title}
            className="otq-vid-thumb"
          />
          <div className="otq-vid-overlay" />
          <div className="otq-vid-play-wrap">
            <div className="otq-vid-play">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 3, position: "relative", zIndex: 2, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))" }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
          <div className="otq-vid-label"><span>OT Security First UAE · Highlights</span></div>
        </>
      )}
      <style jsx>{`
        .otq-vid { position: absolute; inset: 0; cursor: pointer; overflow: hidden; }
        .otq-vid-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .otq-vid:hover .otq-vid-thumb { transform: scale(1.05); }
        .otq-vid-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(4,6,15,0.12) 0%, transparent 42%, rgba(4,6,15,0.6) 100%); }
        .otq-vid-play-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .otq-vid-play {
          position: relative;
          width: 74px; height: 74px; border-radius: 50%;
          display: grid; place-items: center;
          background:
            radial-gradient(130% 130% at 30% 20%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.16) 26%, rgba(255,255,255,0.05) 54%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.42);
          backdrop-filter: blur(16px) saturate(1.7);
          -webkit-backdrop-filter: blur(16px) saturate(1.7);
          box-shadow:
            inset 0 1.5px 1px rgba(255,255,255,0.75),
            inset 0 -8px 14px rgba(0,0,0,0.28),
            inset 0 0 0 1px rgba(255,255,255,0.06),
            0 10px 30px rgba(0,0,0,0.4),
            0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease;
        }
        /* glossy specular highlight */
        .otq-vid-play::before {
          content: ""; position: absolute; z-index: 1;
          top: 6px; left: 14%; right: 14%; height: 44%;
          border-radius: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.05) 70%, transparent 100%);
          filter: blur(0.5px); pointer-events: none;
        }
        /* expanding pulse ring */
        .otq-vid-play::after {
          content: ""; position: absolute; z-index: 0; inset: -1px;
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.28);
          animation: otqVidPulse 3s ease-in-out infinite; pointer-events: none;
        }
        .otq-vid:hover .otq-vid-play {
          transform: scale(1.1);
          background:
            radial-gradient(130% 130% at 30% 20%, rgba(255,255,255,0.5) 0%, ${C_BRIGHT}D9 30%, ${C}F0 68%, ${C_DEEP}F2 100%);
          border-color: rgba(255,255,255,0.55);
          box-shadow:
            inset 0 1.5px 1px rgba(255,255,255,0.7),
            inset 0 -8px 14px rgba(0,0,0,0.32),
            0 0 0 10px ${C}1f,
            0 12px 34px ${C}66;
        }
        @keyframes otqVidPulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.22); opacity: 0; }
        }
        .otq-vid-label { position: absolute; left: 14px; bottom: 14px; z-index: 2; }
        .otq-vid-label span {
          font-family: var(--font-outfit); font-size: 10px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; color: #fff;
          padding: 6px 12px; border-radius: 50px;
          background: linear-gradient(135deg, ${C}4d 0%, ${C}26 100%);
          border: 1px solid ${C}4d;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 10px rgba(0,0,0,0.3);
        }
        @media (max-width: 600px) { .otq-vid-play { width: 52px; height: 52px; } }
      `}</style>
    </div>
  );
}

// ─── OVERVIEW (magazine editorial spread) ────────────────────────────────────
function Overview() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} id="overview" style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 24px", background: BG_BASE, overflow: "hidden" }}>
      {/* Gradient splash backdrop */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(42% 38% at 10% 6%, ${C}24 0%, transparent 60%), radial-gradient(40% 44% at 94% 22%, ${QATAR}2E 0%, transparent 62%), radial-gradient(46% 42% at 78% 104%, ${GOLD}14 0%, transparent 60%)` }} />
      <div aria-hidden style={{ position: "absolute", top: "-8%", left: "-6%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${C}26 0%, transparent 70%)`, filter: "blur(70px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-10%", right: "-4%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${QATAR}2A 0%, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none" }} />
      <BgDots opacity={0.04} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1140, margin: "0 auto" }}>

        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}
        >
          <span style={{ width: 26, height: 1, background: C, boxShadow: `0 0 8px ${C}66` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "4.5px", textTransform: "uppercase", color: C_BRIGHT }}>Overview</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(27px, 3.6vw, 44px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em", margin: "0 0 44px", maxWidth: 840, color: "white" }}
        >
          A nation in the middle of one of the region's most ambitious{" "}
          <span style={{ fontStyle: "italic", color: C_BRIGHT }}>digital transformations</span>.
        </motion.h2>

        {/* Editorial split: text column | media column */}
        <div className="otq-overview-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52, alignItems: "start" }}>

          {/* Text column — drop-cap lead + pull-quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.14, ease: EASE }}
          >
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(15px, 1.6vw, 16.5px)", lineHeight: 1.72, color: "rgba(255,255,255,0.78)", margin: 0 }}>
              <span style={{ float: "left", fontFamily: "var(--font-display)", fontSize: 58, lineHeight: 0.82, fontWeight: 700, padding: "6px 10px 0 0", background: `linear-gradient(150deg, ${C_BRIGHT}, ${QATAR_BRIGHT})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Q</span>
              atar's national landscape is undergoing one of the most ambitious digital transformations in the region, powered by Qatar National Vision 2030, the TASMU Smart Qatar programme, and the rapid rise of connected, automated infrastructure. Across oil and gas, LNG, power and utilities, water and desalination, smart cities, transport, and government critical infrastructure, operational technology environments are evolving into highly automated, data-driven ecosystems designed to maximise efficiency, sustainability, and operational performance.
            </p>

            <blockquote style={{ margin: "30px 0 0", padding: "4px 0 4px 24px", borderLeft: `2px solid ${GOLD}`, position: "relative" }}>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(18px, 2vw, 23px)", lineHeight: 1.36, fontWeight: 500, color: "rgba(255,255,255,0.9)", margin: 0 }}>
                Yet as these systems become more intelligent and interconnected, are they becoming more <span style={{ color: GOLD_BRIGHT }}>resilient</span>, or more <span style={{ color: C_BRIGHT }}>exposed</span>?
              </p>
            </blockquote>
          </motion.div>

          {/* Media column — contained highlight video */}
          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            style={{ margin: 0 }}
          >
            <div style={{
              padding: 3.5,
              borderRadius: 18,
              background: `linear-gradient(145deg, ${C_BRIGHT}26 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.02) 70%, ${GOLD}22 100%)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 44px rgba(0,0,0,0.45), 0 0 44px ${C}0D`,
            }}>
              <div style={{ borderRadius: 15, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", position: "relative" }}>
                <div aria-hidden style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)", zIndex: 3 }} />
                <div style={{ position: "relative", aspectRatio: "16 / 9", background: BG_ELEV }}>
                  <OtqVideoCard />
                </div>
              </div>
            </div>
            <figcaption style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
              <span aria-hidden style={{ width: 18, height: 1, background: GOLD }} />
              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13.5, color: "rgba(255,255,255,0.5)" }}>
                From the stage · OT Security First UAE, Abu Dhabi
              </span>
            </figcaption>
          </motion.figure>
        </div>

        {/* Full-width "What is" feature band */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.28, ease: EASE }}
          style={{ marginTop: 52, width: "min(1260px, calc(100vw - 48px))", marginLeft: "calc((100% - min(1260px, 100vw - 48px)) / 2)", position: "relative", padding: "clamp(28px, 3vw, 40px) clamp(26px, 3.5vw, 46px)", borderRadius: 6, background: "linear-gradient(168deg, rgba(211,75,154,0.07), rgba(138,21,56,0.045))", border: "1px solid rgba(255,255,255,0.09)", borderTop: `2px solid ${GOLD}`, boxShadow: "0 22px 56px rgba(0,0,0,0.4)" }}
        >
          <div className="otq-platform-grid" style={{ display: "grid", gridTemplateColumns: "0.82fr 2.18fr", gap: "clamp(28px, 4vw, 60px)", alignItems: "start" }}>
            {/* Title block */}
            <div>
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 10.5, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: GOLD_BRIGHT, marginBottom: 12 }}>The Platform</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 2.6vw, 30px)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.015em", margin: 0, color: "white" }}>What is OT Security First Qatar?</h3>
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <QatarSerration color={GOLD} width={40} />
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13.5, fontWeight: 500, color: GOLD_BRIGHT }}>A high-level decision-makers forum</span>
              </div>
            </div>

            {/* Three points as editorial columns */}
            <div className="otq-platform-points" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
              {[
                "A world-class, one-day strategic dialogue platform dedicated to advancing industrial cybersecurity and operational resilience across the State of Qatar.",
                "Aligned with the NCSA policy, the NIA policy, and the National Cyber Security Strategy 2024–2030, it convenes senior policymakers, regulators, government authorities, and critical infrastructure leaders.",
                "It brings together CISOs, CIOs, CTOs, and CDOs from leading energy, utilities, LNG, and manufacturing enterprises, alongside the innovators shaping the future of industrial cybersecurity.",
              ].map((t, i) => (
                <div key={i}>
                  <div aria-hidden style={{ height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, marginBottom: 14 }} />
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: `${GOLD_BRIGHT}`, marginBottom: 11 }}>{`0${i + 1}`}</div>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, lineHeight: 1.66, color: "rgba(255,255,255,0.82)", margin: 0 }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* In Numbers — merged into the Overview section */}
        <Numbers />
      </div>
      <style jsx>{`
        @media (max-width: 880px) {
          .otq-overview-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .otq-platform-grid { grid-template-columns: 1fr !important; gap: 26px !important; }
          .otq-platform-points { grid-template-columns: 1fr !important; gap: 22px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── MARKET CHALLENGE ─────────────────────────────────────────────────────────
function MarketChallenge() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 24px", overflow: "hidden", background: BG_BASE }}>
      {/* photo backdrop */}
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url(${OT_PHOTOS.floor})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.44 }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${BG_BASE}F2 0%, ${BG_BASE}5E 48%, ${BG_BASE}F2 100%)` }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-flex" }}>
          <Eyebrow inView={inView} label="Market Challenge" tone="maroon" />
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.13, letterSpacing: "-0.02em", margin: "0 auto", maxWidth: 1040, color: "white", textShadow: "0 2px 20px rgba(0,0,0,0.7)" }}
        >
          Not just about connectivity and efficiency, but about{" "}
          <span style={{ color: QATAR_BRIGHT }}>security, stability, and resilience</span>.
        </motion.h2>
        {[
          "As Qatar's industrial and utility systems evolve, the convergence of IT and OT, legacy infrastructure dependencies, remote operations, industrial IoT, and AI-driven automation are significantly expanding the cyber attack surface.",
          "This rapid digitalisation, accelerated by mega projects such as Lusail Smart City and the TASMU national digital twin programme, is creating new vulnerabilities across critical infrastructure sectors, making cyber resilience not just an IT concern, but a national security and operational continuity priority.",
          "The challenge now is not only about connectivity and efficiency, but about ensuring security, stability, and resilience across increasingly complex industrial and utility ecosystems.",
        ].map((t, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.12 + i * 0.08, ease: EASE }}
            style={{ ...paraStyle, fontSize: "clamp(16px, 1.9vw, 19px)", maxWidth: 980, margin: i === 0 ? "28px auto 0" : "18px auto 0", textAlign: "center", color: "rgba(255,255,255,0.95)", textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.95)" }}
          >
            {t}
          </motion.p>
        ))}
      </div>
    </section>
  );
}

// ─── WHY QATAR / WHY DOHA ─────────────────────────────────────────────────────
type WhyCardData = { tone: "magenta" | "maroon"; tag: string; photo: string; headline: string; paras: string[] };

function WhyCard({ card, inView, index }: { card: WhyCardData; inView: boolean; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const accent = card.tone === "maroon" ? QATAR_BRIGHT : C_BRIGHT;
  const accentDeep = card.tone === "maroon" ? QATAR : C;
  const paraStyleWhy: React.CSSProperties = { fontFamily: "var(--font-outfit)", fontSize: 14.5, lineHeight: 1.62, color: "rgba(255,255,255,0.72)", margin: 0 };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay: index * 0.14, ease: EASE }}
      style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: `1px solid ${accentDeep}30`, background: BG_ELEV, boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}
    >
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${card.photo})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 20%, ${BG_ELEV}CC 78%, ${BG_ELEV} 100%), linear-gradient(120deg, ${accentDeep}55 0%, transparent 60%)` }} />
        <div style={{ position: "absolute", left: 26, bottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <QatarSerration color={card.tone === "maroon" ? GOLD : C_BRIGHT} width={48} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: accent }}>{card.tag}</span>
        </div>
      </div>
      <div style={{ padding: "26px 30px 32px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(21px, 2.4vw, 28px)", fontWeight: 700, lineHeight: 1.16, letterSpacing: "-0.01em", margin: 0, color: "white" }}>{card.headline}</h3>

        <p style={{ ...paraStyleWhy, marginTop: 18 }}>{card.paras[0]}</p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ overflow: "hidden" }}
            >
              {card.paras.slice(1).map((p, j) => (
                <p key={j} style={{ ...paraStyleWhy, marginTop: 14 }}>{p}</p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-outfit)", fontSize: 12.5, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: accent }}
        >
          {expanded ? "Read Less" : "Read More"}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ display: "inline-flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
}

function WhyQatarDoha() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const cards = [
    {
      tone: "magenta" as const,
      tag: "Why Qatar?",
      photo: OT_PHOTOS.session,
      headline: "At the forefront of national modernisation under Qatar National Vision 2030.",
      paras: [
        "Qatar is at the forefront of national modernisation under Qatar National Vision 2030, with billions of dollars invested in smart infrastructure, LNG expansion, and digital industrial ecosystems.",
        "The State is rapidly advancing connected operations across critical sectors, positioning itself as a global leader in LNG production and smart city innovation while simultaneously prioritising cybersecurity, data protection, and infrastructure resilience under the National Cyber Security Strategy 2024–2030.",
        "This makes Qatar one of the most important global markets where OT security is directly aligned with national transformation and economic stability.",
      ],
    },
    {
      tone: "maroon" as const,
      tag: "Why Doha?",
      photo: OT_PHOTOS.panel,
      headline: "The political, economic, and regulatory heart of Qatar — a live OT environment.",
      paras: [
        "Doha is the political, economic, and regulatory heart of Qatar and home to the National Cyber Security Agency, QatarEnergy, Kahramaa, and the country's most advanced smart city innovation, Lusail.",
        "Home to the world's largest LNG export operations and one of the fastest-growing smart city ecosystems in the Gulf, Doha represents a live OT environment where energy, utilities, and digital infrastructure operate at massive scale and continuous uptime.",
        "This makes Doha the ideal location to host OT Security First Qatar, placing the dialogue directly at the centre of national operations where cyber risk and operational continuity are most critical.",
      ],
    },
  ];
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 24px", background: BG_BASE, overflow: "hidden" }}>
      <GradientSplash />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto" }}>
        <div className="otq-why-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, alignItems: "start" }}>
          {cards.map((card, i) => (
            <WhyCard key={card.tag} card={card} inView={inView} index={i} />
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 880px) { .otq-why-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── SPEAKERS (announcing soon placeholders) ─────────────────────────────────
function PlaceholderSpeaker({ index, inView }: { index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
      style={{ position: "relative", overflow: "hidden", borderRadius: 18, padding: "30px 18px 24px", textAlign: "center", background: "linear-gradient(168deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012))", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
    >
      {/* shimmer sweep */}
      <div aria-hidden className="otq-sk-shimmer" style={{ animationDelay: `${index * 0.25}s` }} />
      {/* avatar silhouette */}
      <div style={{ position: "relative", zIndex: 1, width: 76, height: 76, borderRadius: "50%", margin: "0 auto 18px", display: "grid", placeItems: "center", background: `linear-gradient(155deg, ${C}33, ${QATAR}22)`, border: `1px solid ${C}3A`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill={C_BRIGHT} style={{ opacity: 0.5 }}><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM3 22a9 9 0 0 1 18 0z" /></svg>
      </div>
      {/* skeleton name + role */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 9 }}>
        <div style={{ width: "68%", height: 11, borderRadius: 6, background: "rgba(255,255,255,0.1)" }} />
        <div style={{ width: "46%", height: 9, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
      </div>
      {/* announcing soon pill */}
      <div style={{ position: "relative", zIndex: 1, marginTop: 16, display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px", borderRadius: 999, background: `${C}1A`, border: `1px solid ${C}3A` }}>
        <span style={{ width: 5, height: 5, borderRadius: 999, background: C_BRIGHT, boxShadow: `0 0 8px ${C_BRIGHT}` }} />
        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: C_BRIGHT }}>Announcing Soon</span>
      </div>
      <style jsx>{`
        .otq-sk-shimmer {
          position: absolute; top: 0; left: -60%; width: 55%; height: 100%; z-index: 0;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.06), transparent);
          animation: otqSkSweep 2.8s ease-in-out infinite; pointer-events: none;
        }
        @keyframes otqSkSweep { 0% { left: -60%; } 55%, 100% { left: 120%; } }
        @media (prefers-reduced-motion: reduce) { .otq-sk-shimmer { animation: none; } }
      `}</style>
    </motion.div>
  );
}

function Speakers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} id="speakers" style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 24px", overflow: "hidden", background: BG_BASE }}>
      <GradientSplash />
      <BgDots opacity={0.04} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex" }}>
            <Eyebrow inView={inView} label="Speakers" tone="magenta" />
          </div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.6vw, 42px)", fontWeight: 700, lineHeight: 1.14, textAlign: "center", margin: "0 auto 14px", maxWidth: 820, color: "white" }}
        >
          The voices shaping Qatar's OT security,{" "}
          <span style={{ color: GOLD_BRIGHT }}>announcing soon</span>.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          style={{ fontFamily: "var(--font-outfit)", fontSize: 15.5, lineHeight: 1.6, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 620, margin: "0 auto" }}
        >
          An elite line-up of government leaders, regulators, and industry experts will be revealed soon. Stay tuned.
        </motion.p>
        <div className="otq-speakers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginTop: 44 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <PlaceholderSpeaker key={i} index={i} inView={inView} />
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) { .otq-speakers-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 620px) { .otq-speakers-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}

// ─── PAST SERIES SPONSORS (marquee) ──────────────────────────────────────────
function OtqMarqueeRow({ logos, direction }: { logos: string[]; direction: "left" | "right" }) {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to right, ${BG_BASE}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to left, ${BG_BASE}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div className={`otq-marquee-track is-${direction}`}>
        {[...logos, ...logos].map((logo, i) => (
          <div key={i} className="otq-marquee-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt={`${logo.split("/").pop()?.replace(/\.(png|jpg|svg|webp)$/i, "").replace(/[-_]/g, " ")} - past sponsor and partner of the OT Security First industrial cybersecurity summit series`}
              width={160}
              height={64}
              loading="lazy"
              decoding="async"
              style={{ maxHeight: 60, maxWidth: 160, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.6 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PastSponsors() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(40px, 5vw, 64px) 0", background: BG_BASE, overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: 1320, margin: "0 auto 36px", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}
        >
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C}30)` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: C_BRIGHT, whiteSpace: "nowrap" }}>Past Series Sponsors &amp; Partners</span>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C}30, transparent)` }} />
        </motion.div>
      </div>

      <OtqMarqueeRow logos={SPONSOR_MARQUEE_1} direction="left" />
      <div style={{ height: 16 }} />
      <OtqMarqueeRow logos={SPONSOR_MARQUEE_2} direction="right" />

      <style jsx global>{`
        @keyframes otqMarqueeLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes otqMarqueeRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .otq-marquee-track { display: flex; width: max-content; will-change: transform; }
        .otq-marquee-track.is-left { animation: otqMarqueeLeft 40s linear infinite; }
        .otq-marquee-track.is-right { animation: otqMarqueeRight 40s linear infinite; }
        .otq-marquee-item { flex-shrink: 0; height: 72px; width: 170px; margin-right: 40px; display: flex; align-items: center; justify-content: center; }
        @media (prefers-reduced-motion: reduce) { .otq-marquee-track { animation: none !important; } }
      `}</style>
    </section>
  );
}

// Slim topic divider — separates the sub-blocks inside the unified section
function TopicDivider() {
  return (
    <div aria-hidden style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.13))" }} />
        <QatarSerration color={GOLD} width={50} />
        <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.13), transparent)" }} />
      </div>
    </div>
  );
}

// ─── AUDIENCE · THEMES · DRIVERS (unified section, shared gradient splash) ────
function AudienceThemesDrivers() {
  return (
    // Kept eagerly mounted (holds the #themes nav anchor), but skip painting its
    // heavy blurred-orb backdrop while off-screen. `auto` self-corrects the height.
    <section style={{ position: "relative", background: BG_BASE, overflow: "hidden", contentVisibility: "auto", containIntrinsicSize: "auto 2200px" }}>
      {/* shared gradient-splash backdrop spanning all three blocks */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(36% 22% at 8% 3%, ${C}24 0%, transparent 60%), radial-gradient(40% 26% at 96% 15%, ${QATAR}2C 0%, transparent 62%), radial-gradient(42% 24% at 2% 48%, ${GOLD}12 0%, transparent 60%), radial-gradient(46% 26% at 100% 66%, ${C}1F 0%, transparent 62%), radial-gradient(38% 22% at 14% 97%, ${QATAR}24 0%, transparent 60%)` }} />
      <div aria-hidden style={{ position: "absolute", top: "-3%", left: "-6%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${C}24 0%, transparent 70%)`, filter: "blur(84px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", top: "42%", right: "-7%", width: 540, height: 540, borderRadius: "50%", background: `radial-gradient(circle, ${QATAR}22 0%, transparent 70%)`, filter: "blur(94px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-4%", left: "16%", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}10 0%, transparent 70%)`, filter: "blur(92px)", pointerEvents: "none" }} />
      <BgDots opacity={0.04} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <WhoYouMeet />
        <TopicDivider />
        <KeyThemes />
        <TopicDivider />
        <MarketDrivers />
      </div>
    </section>
  );
}

// ─── WHO WILL YOU MEET ────────────────────────────────────────────────────────
function MeetRow({ role, icon, index, inView }: { role: string; icon: string; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.05, ease: EASE }}
      whileHover={{ backgroundColor: "rgba(211,75,154,0.05)" }}
      style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}
    >
      <div style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 11, display: "grid", placeItems: "center", background: `linear-gradient(150deg, ${C}, ${C_DEEP})`, border: "1px solid rgba(255,255,255,0.14)", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), 0 5px 12px ${C}3A` }}>
        <Icon path={icon} size={18} color="#fff" stroke={1.7} />
      </div>
      <span style={{ flex: 1, fontFamily: "var(--font-outfit)", fontSize: 14.5, fontWeight: 500, color: "rgba(255,255,255,0.86)", lineHeight: 1.4 }}>{role}</span>
      <span aria-hidden style={{ flexShrink: 0, fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: `${GOLD}66`, letterSpacing: "0.02em" }}>{`0${index + 1}`.slice(-2)}</span>
    </motion.div>
  );
}

function WhoYouMeet() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 24px", overflow: "hidden" }}>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto" }}>
        {/* header */}
        <div style={{ marginBottom: 40 }}>
          <Eyebrow inView={inView} label="Who Will You Meet?" tone="gold" />
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(27px, 3.8vw, 44px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", margin: 0, maxWidth: 840, color: "white" }}
          >
            A powerful cross-section of{" "}
            <span style={{ fontStyle: "italic", color: GOLD_BRIGHT }}>decision-makers</span> and industry leaders.
          </motion.h2>
        </div>

        {/* Split — event photo + editorial roles directory */}
        <div className="otq-meet-grid" style={{ display: "grid", gridTemplateColumns: "0.82fr 1.18fr", gap: 48, alignItems: "stretch" }}>
          {/* Photo of the room */}
          <motion.figure
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.85, delay: 0.12, ease: EASE }}
            style={{ margin: 0 }}
          >
            <div style={{
              height: "100%",
              padding: 4,
              borderRadius: 22,
              background: `linear-gradient(145deg, ${C_BRIGHT}26 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.02) 70%, ${GOLD}22 100%)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), 0 22px 60px rgba(0,0,0,0.5)`,
            }}>
              <div style={{ position: "relative", height: "100%", minHeight: 340, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${OT_PHOTOS.network})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 30%, rgba(4,6,15,0.85) 100%), linear-gradient(120deg, ${QATAR}45 0%, transparent 55%)` }} />
                <div style={{ position: "absolute", left: 24, bottom: 22, right: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <QatarSerration color={GOLD} width={44} />
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: GOLD_BRIGHT }}>Inside the Room</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(15px, 1.7vw, 18px)", lineHeight: 1.35, color: "rgba(255,255,255,0.92)", margin: 0 }}>
                    The people who set policy, run critical infrastructure, and build the future of industrial cybersecurity.
                  </p>
                </div>
              </div>
            </div>
          </motion.figure>

          {/* Roles directory — two columns to keep the section compact */}
          <div className="otq-roles-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "repeat(5, auto)", gridAutoFlow: "column", columnGap: 30, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {AUDIENCE_ROLES.map((r, i) => (
              <MeetRow key={r.role} role={r.role} icon={r.icon} index={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 860px) { .otq-meet-grid { grid-template-columns: 1fr !important; gap: 30px !important; } }
        @media (max-width: 560px) { .otq-roles-grid { grid-template-columns: 1fr !important; grid-template-rows: none !important; grid-auto-flow: row !important; } }
      `}</style>
    </section>
  );
}

// ─── KEY THEMES (magazine index — sticky rail + editorial ledger) ─────────────
function KeyThemes() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  // Rotating tri-colour accent (magenta / maroon / gold) tied to the page system
  const ACCENTS: [string, string][] = [
    [C, C_BRIGHT],
    [QATAR, QATAR_BRIGHT],
    [GOLD, GOLD_BRIGHT],
  ];
  return (
    <section ref={ref} id="themes" style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 24px", overflow: "hidden" }}>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        <div className="otq-themes-split" style={{ display: "grid", gridTemplateColumns: "1.5fr 0.84fr", gap: "clamp(36px, 5vw, 76px)", alignItems: "start" }}>

          {/* RIGHT — sticky title rail */}
          <div className="otq-themes-rail" style={{ position: "sticky", top: 100, gridColumn: 2 }}>
            <Eyebrow inView={inView} label="Key Themes" tone="magenta" />
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE }}
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.02em", margin: 0, color: "white" }}
            >
              The conversations that will shape Qatar's{" "}
              <span style={{ color: C_BRIGHT }}>OT security future</span>.
            </motion.h2>

            {/* big count marker */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
              style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 18 }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(60px, 7vw, 86px)", fontWeight: 700, lineHeight: 0.86, letterSpacing: "-0.03em", background: `linear-gradient(135deg, #ffffff 0%, ${C_BRIGHT} 55%, ${QATAR_BRIGHT} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", filter: `drop-shadow(0 4px 16px ${C}45)` }}>
                12
              </span>
              <div>
                <QatarSerration color={GOLD} width={44} />
                <div style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: GOLD_BRIGHT, marginTop: 8 }}>
                  Strategic<br />Themes
                </div>
              </div>
            </motion.div>
          </div>

          {/* LEFT — two-column editorial index */}
          <div className="otq-themes-index" style={{ display: "grid", gridColumn: 1, gridRow: 1, gridTemplateColumns: "1fr 1fr", gridTemplateRows: "repeat(6, auto)", gridAutoFlow: "column", columnGap: 44, borderTop: "1px solid rgba(255,255,255,0.11)" }}>
            {KEY_THEMES.map((theme, i) => {
              const [acc, accB] = ACCENTS[i % 3];
              return (
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.08 + i * 0.05, ease: EASE }}
                  className="otq-theme-row"
                  style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 18, padding: "20px 12px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {/* left accent tick (grows on hover) */}
                  <span aria-hidden className="otq-theme-tick" style={{ position: "absolute", left: 0, top: "18%", bottom: "18%", width: 2, borderRadius: 2, background: `linear-gradient(180deg, ${acc}, ${accB})`, transform: "scaleY(0)", transformOrigin: "top", transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)" }} />

                  <span className="otq-theme-idx" style={{ flexShrink: 0, minWidth: 38, fontFamily: "var(--font-display)", fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", background: `linear-gradient(135deg, #ffffff 0%, ${accB} 95%)`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", filter: `drop-shadow(0 2px 7px ${acc}40)`, transition: "transform 0.4s ease" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <p className="otq-theme-txt" style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.8)", lineHeight: 1.46, margin: "3px 0 0", transition: "color 0.35s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)" }}>
                    {theme}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .otq-theme-row { border-radius: 10px; transition: background 0.35s ease; }
        .otq-theme-row:hover { background: rgba(255,255,255,0.026); }
        .otq-theme-row:hover .otq-theme-tick { transform: scaleY(1); }
        .otq-theme-row:hover .otq-theme-idx { transform: translateY(-2px); }
        .otq-theme-row:hover .otq-theme-txt { color: #fff; transform: translateX(5px); }
        @media (max-width: 900px) {
          .otq-themes-split { grid-template-columns: 1fr !important; gap: 36px !important; }
          .otq-themes-rail { position: static !important; grid-column: auto !important; }
          .otq-themes-index { grid-column: auto !important; grid-row: auto !important; }
        }
        @media (max-width: 600px) {
          .otq-themes-index { grid-template-columns: 1fr !important; grid-template-rows: none !important; grid-auto-flow: row !important; }
        }
      `}</style>
    </section>
  );
}

// ─── MARKET DRIVERS (master–detail selector) ─────────────────────────────────
function MarketDrivers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const d = MARKET_DRIVERS[active];
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 24px", overflow: "hidden" }}>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto" }}>
        <Eyebrow inView={inView} label="Market Drivers" tone="gold" />
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.6vw, 44px)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.02em", margin: "0 0 14px", maxWidth: 780, color: "white" }}
        >
          The real signals behind Qatar's OT security demand.
        </motion.h2>
        <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.6)", margin: "0 0 40px", maxWidth: 620 }}>
          Facts, real signals, and the implications &amp; opportunities they create across Qatar's critical infrastructure.
        </p>

        <div className="otq-md-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, alignItems: "start" }}>
          {/* Selector grid — two columns */}
          <div className="otq-md-list" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {/* decorative count tile — leads the grid */}
            <div aria-hidden className="otq-md-count" style={{ display: "flex", alignItems: "center", gap: 13, minHeight: 60, padding: "12px 16px", borderRadius: 14, border: "1px dashed rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.014)" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", background: `linear-gradient(135deg, #ffffff, ${GOLD_BRIGHT})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>07</span>
              <div>
                <QatarSerration color={GOLD} width={36} />
                <div style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: GOLD_BRIGHT, marginTop: 6 }}>Market Forces</div>
              </div>
            </div>
            {MARKET_DRIVERS.map((m, i) => {
              const on = i === active;
              return (
                <motion.button
                  key={m.driver}
                  onClick={() => setActive(i)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
                  className={on ? "otq-md-item is-active" : "otq-md-item"}
                  style={{
                    position: "relative", display: "flex", alignItems: "center", gap: 12, width: "100%", minHeight: 60, textAlign: "left",
                    padding: "12px 15px", borderRadius: 14, cursor: "pointer",
                    border: on ? `1px solid ${C}59` : "1px solid rgba(255,255,255,0.07)",
                    background: on ? "linear-gradient(100deg, rgba(211,75,154,0.16), rgba(138,21,56,0.06))" : "rgba(255,255,255,0.02)",
                    boxShadow: on ? `0 14px 30px -18px ${C}, inset 0 1px 0 rgba(255,255,255,0.07)` : "none",
                    transition: "background .3s, border-color .3s, box-shadow .3s",
                  }}
                >
                  <span aria-hidden style={{ position: "absolute", left: 0, top: on ? "18%" : "50%", bottom: on ? "18%" : "50%", width: 3, borderRadius: 3, background: `linear-gradient(180deg, ${C}, ${QATAR})`, opacity: on ? 1 : 0, transition: "all .35s cubic-bezier(0.22,1,0.36,1)" }} />
                  <span style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 11, display: "grid", placeItems: "center", background: on ? `linear-gradient(150deg, ${C}, ${C_DEEP})` : "rgba(255,255,255,0.05)", border: on ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.08)", boxShadow: on ? `0 6px 14px ${C}44` : "none", transition: "background .3s, box-shadow .3s" }}>
                    <Icon path={m.icon} size={18} color={on ? "#fff" : "rgba(255,255,255,0.5)"} />
                  </span>
                  <span style={{ flex: 1, fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: on ? 600 : 500, color: on ? "#fff" : "rgba(255,255,255,0.66)", lineHeight: 1.28, transition: "color .3s" }}>{m.driver}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Detail panel */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="otq-md-detail-wrap"
            style={{ marginTop: -96, borderRadius: 22, padding: 1.25, background: `linear-gradient(150deg, ${C_BRIGHT}4D 0%, rgba(255,255,255,0.12) 30%, ${GOLD}3D 70%, rgba(255,255,255,0.04) 100%)`, boxShadow: "0 24px 54px -24px rgba(0,0,0,0.75)" }}
          >
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 20.75, minHeight: 340, padding: "24px clamp(26px, 3vw, 40px) clamp(28px, 3vw, 40px)", background: "linear-gradient(168deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.013) 46%, rgba(4,6,15,0.5) 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -22px 40px -26px rgba(0,0,0,0.6)" }}>
              {/* watermark icon */}
              <div aria-hidden style={{ position: "absolute", top: -24, right: -12, opacity: 0.06, pointerEvents: "none" }}>
                <Icon path={d.icon} size={196} color={C_BRIGHT} stroke={1} />
              </div>
              {/* corner glow */}
              <div aria-hidden style={{ position: "absolute", top: "-28%", right: "-10%", width: 260, height: 260, background: `radial-gradient(circle, ${C}22 0%, transparent 70%)`, filter: "blur(30px)", pointerEvents: "none" }} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{ position: "relative", zIndex: 1 }}
                >
                  {/* meta line */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: GOLD_BRIGHT, letterSpacing: "0.5px" }}>{String(active + 1).padStart(2, "0")}</span>
                    <span style={{ width: 22, height: 1, background: GOLD }} />
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.42)" }}>Driver {active + 1} of {MARKET_DRIVERS.length}</span>
                  </div>

                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 2.6vw, 30px)", fontWeight: 700, lineHeight: 1.14, letterSpacing: "-0.015em", margin: "0 0 26px", color: "white", maxWidth: 540 }}>{d.driver}</h3>

                  <div style={{ marginBottom: 22 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: QATAR_BRIGHT, marginBottom: 11 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 99, background: QATAR_BRIGHT, boxShadow: `0 0 8px ${QATAR_BRIGHT}` }} />
                      Facts &amp; Real Signals
                    </div>
                    <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, lineHeight: 1.66, color: "rgba(255,255,255,0.84)", margin: 0 }}>{d.signal}</p>
                  </div>

                  <div aria-hidden style={{ height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.13), transparent)", margin: "0 0 22px" }} />

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: GOLD_BRIGHT, marginBottom: 11 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 99, background: GOLD_BRIGHT, boxShadow: `0 0 8px ${GOLD_BRIGHT}` }} />
                      Implications &amp; Opportunities
                    </div>
                    <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, lineHeight: 1.66, color: "rgba(255,255,255,0.84)", margin: 0 }}>{d.opportunity}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      <style jsx global>{`
        .otq-md-item:not(.is-active):hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.14) !important; }
        @media (max-width: 860px) {
          .otq-md-grid { grid-template-columns: 1fr !important; }
          .otq-md-detail-wrap { position: static !important; margin-top: 0 !important; }
        }
        @media (max-width: 520px) {
          .otq-md-list { grid-template-columns: 1fr !important; }
          .otq-md-count { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─── AGENDA ───────────────────────────────────────────────────────────────────
function agendaTypeColor(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("ministerial")) return GOLD;
  if (t.includes("closing")) return QATAR_BRIGHT;
  if (t.includes("panel")) return "#9D6BE0";
  return C; // keynote
}

function AgendaBreakRow({ block, inView }: { block: AgendaBreak; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE }}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderRadius: 14, background: "linear-gradient(90deg, rgba(196,163,74,0.1), rgba(196,163,74,0.02))", border: `1px solid ${GOLD}2E` }}
    >
      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12.5, fontWeight: 700, color: GOLD_BRIGHT, minWidth: 96, letterSpacing: "0.3px" }}>{block.time}</span>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: GOLD, flexShrink: 0 }} />
      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{block.title}</span>
    </motion.div>
  );
}

function Agenda() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Balance the columns with two sessions each — split before the 3rd session
  const sessionIdxs = AGENDA.map((b, i) => (b.kind === "session" ? i : -1)).filter((i) => i >= 0);
  const splitAt = sessionIdxs[Math.ceil(sessionIdxs.length / 2)] ?? AGENDA.length;
  const halves = [
    {
      label: "Morning",
      range: "08:30 – 11:45",
      color: GOLD,
      colorBright: GOLD_BRIGHT,
      icon: "M17 18a5 5 0 0 0-10 0M12 2v7M4.22 10.22l1.42 1.42M1 18h2M21 18h2M18.36 11.64l1.42-1.42M23 22H1M8 6l4-4 4 4",
      blocks: AGENDA.slice(0, splitAt),
      offset: 0,
    },
    {
      label: "Afternoon",
      range: "11:45 – 15:30",
      color: C,
      colorBright: C_BRIGHT,
      icon: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
      blocks: AGENDA.slice(splitAt),
      offset: splitAt,
    },
  ];

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 24px", background: BG_BASE }}>
      <BgDots opacity={0.04} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto" }}>
        {/* header */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{ display: "inline-flex" }}>
            <Eyebrow inView={inView} label="One-Day Agenda · 2026" tone="magenta" />
          </div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, lineHeight: 1.1, textAlign: "center", margin: "0 auto 20px", color: "white" }}
        >
          Conference Agenda
        </motion.h2>

        {/* session-format legend */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 22px", marginBottom: 46 }}>
          {[
            { label: "Keynote", color: C },
            { label: "Panel Discussion", color: "#9D6BE0" },
            { label: "Ministerial", color: GOLD },
            { label: "Closing", color: QATAR_BRIGHT },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ flexShrink: 0, width: 9, height: 9, borderRadius: 99, background: l.color, boxShadow: `0 0 8px ${l.color}99` }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12.5, fontWeight: 500, color: "rgba(255,255,255,0.66)" }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* two halves — morning | afternoon */}
        <div className="otq-ag-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(20px, 3vw, 38px)", alignItems: "start" }}>
          {halves.map((h) => (
            <div key={h.label}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {h.blocks.map((block, i) =>
                  block.kind === "break"
                    ? <AgendaBreakRow key={`b-${h.offset + i}`} block={block} inView={inView} />
                    : <SessionBlock key={`s-${h.offset + i}`} block={block} inView={inView} />
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 34, textAlign: "center", fontFamily: "var(--font-outfit)", fontSize: 12.5, color: "rgba(255,255,255,0.4)" }}>
          OT Security First Qatar · Doha, State of Qatar · Events First Group · Agenda is subject to change
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 820px) {
          .otq-ag-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function SessionBlock({ block, inView }: { block: AgendaSession; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
      /* skeuomorphic bezel */
      style={{ position: "relative", borderRadius: 22, padding: 1.25, background: `linear-gradient(150deg, ${C_BRIGHT}42 0%, rgba(255,255,255,0.1) 30%, ${GOLD}2E 72%, rgba(255,255,255,0.04) 100%)`, boxShadow: "0 20px 46px -22px rgba(0,0,0,0.7)" }}
    >
      <div style={{ borderRadius: 20.75, overflow: "hidden", background: "linear-gradient(180deg, rgba(13,20,40,0.92) 0%, rgba(6,9,20,0.94) 100%)" }}>
        {/* session header — no time range (per-talk times live on the timeline) */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 26px", background: `linear-gradient(100deg, ${C}24, ${QATAR}12)`, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 13, display: "grid", placeItems: "center", background: `linear-gradient(150deg, ${C}, ${C_DEEP})`, boxShadow: `0 8px 20px ${C}44`, border: "1px solid rgba(255,255,255,0.14)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 700, color: "white" }}>{block.num}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: C_BRIGHT, marginBottom: 6 }}>Session {String(block.num).padStart(2, "0")}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 2vw, 19px)", fontWeight: 600, color: "white", lineHeight: 1.28 }}>{block.title}</div>
          </div>
        </div>

        {/* timeline items */}
        <div style={{ padding: "12px 24px 20px" }}>
          {block.items.map((it, ii) => {
            const col = agendaTypeColor(it.type);
            const first = ii === 0;
            const last = ii === block.items.length - 1;
            return (
              <div key={ii} className="otq-ag-row" style={{ display: "grid", gridTemplateColumns: "66px 30px 1fr", alignItems: "stretch" }}>
                {/* time */}
                <div style={{ textAlign: "right", paddingRight: 6, paddingTop: 13 }}>
                  <div style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.92)", lineHeight: 1.3 }}>{it.start}</div>
                  <div style={{ fontFamily: "var(--font-outfit)", fontSize: 11.5, fontWeight: 500, color: "rgba(255,255,255,0.38)", lineHeight: 1.3 }}>{it.end}</div>
                </div>
                {/* rail */}
                <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                  <span aria-hidden style={{ position: "absolute", top: 0, height: 18, width: 2, background: first ? "transparent" : "rgba(255,255,255,0.1)" }} />
                  <span aria-hidden style={{ position: "absolute", top: 18, bottom: 0, width: 2, background: last ? "transparent" : "rgba(255,255,255,0.1)" }} />
                  <span aria-hidden style={{ position: "absolute", top: 12, width: 12, height: 12, borderRadius: 99, background: col, boxShadow: `0 0 0 4px ${col}22, 0 0 10px ${col}99`, border: `2px solid ${BG_ELEV}` }} />
                </div>
                {/* content */}
                <div style={{ paddingTop: 11, paddingBottom: last ? 4 : 22, paddingLeft: 10 }}>
                  <span style={{ display: "inline-block", fontFamily: "var(--font-outfit)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: col, padding: "4px 10px", borderRadius: 7, background: `${col}18`, border: `1px solid ${col}3A`, lineHeight: 1.3, marginBottom: 9 }}>{it.type}</span>
                  <div style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "white", lineHeight: 1.34 }}>{it.title}</div>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, lineHeight: 1.55, color: "rgba(255,255,255,0.6)", margin: "7px 0 0", fontStyle: "italic" }}>{it.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 680px) {
          .otq-ag-row { grid-template-columns: 52px 24px 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}

// ─── TESTIMONIALS · FROM THE ROOM (OT Security First shorts) ─────────────────
const OTQ_SHORTS = [
  { id: "Q0n_sVaMnxg", title: "OT Security First — testimonial from the room" },
  { id: "SF87voLk34A", title: "OT Security First — testimonial from the room" },
  { id: "R5dtc5kjiQU", title: "OT Security First — testimonial from the room" },
  { id: "Hm_yj3NttPo", title: "OT Security First — testimonial from the room" },
  { id: "aaG9We6AjY8", title: "OT Security First — testimonial from the room" },
];

function OtqShort({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="otq-short" onClick={() => !playing && setPlaying(true)}>
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
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
            src={`https://img.youtube.com/vi/${id}/oar2.jpg`}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }}
            alt={title}
            className="otq-short-thumb"
          />
          <div className="otq-short-overlay" />
          <div className="otq-short-play-wrap">
            <div className="otq-short-play">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2, position: "relative", zIndex: 2, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))" }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        </>
      )}
      <style jsx>{`
        .otq-short { position: absolute; inset: 0; cursor: pointer; overflow: hidden; }
        .otq-short-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .otq-short:hover .otq-short-thumb { transform: scale(1.06); }
        .otq-short-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(4,6,15,0.1) 0%, transparent 44%, rgba(4,6,15,0.58) 100%); }
        .otq-short-play-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .otq-short-play {
          position: relative; width: 58px; height: 58px; border-radius: 50%; display: grid; place-items: center;
          background: radial-gradient(130% 130% at 30% 20%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.16) 26%, rgba(255,255,255,0.05) 54%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.42);
          backdrop-filter: blur(14px) saturate(1.7); -webkit-backdrop-filter: blur(14px) saturate(1.7);
          box-shadow: inset 0 1.5px 1px rgba(255,255,255,0.7), inset 0 -6px 12px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.4);
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), background 0.4s ease, border-color 0.4s ease;
        }
        .otq-short-play::after { content: ""; position: absolute; inset: -1px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.28); animation: otqShortPulse 3s ease-in-out infinite; pointer-events: none; }
        .otq-short:hover .otq-short-play {
          transform: scale(1.1);
          background: radial-gradient(130% 130% at 30% 20%, rgba(255,255,255,0.5) 0%, ${C_BRIGHT}D9 30%, ${C}F0 68%, ${C_DEEP}F2 100%);
          border-color: rgba(255,255,255,0.55);
        }
        @keyframes otqShortPulse { 0%,100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.25); opacity: 0; } }
        @media (max-width: 560px) { .otq-short-play { width: 46px; height: 46px; } }
      `}</style>
    </div>
  );
}

function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 24px", overflow: "hidden", background: BG_BASE }}>
      <BgDots opacity={0.04} />
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(40% 40% at 12% 0%, ${C}1C 0%, transparent 60%), radial-gradient(42% 44% at 90% 8%, ${QATAR}22 0%, transparent 62%)` }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex" }}>
            <Eyebrow inView={inView} label="From the Room" tone="gold" />
          </div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.6vw, 44px)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.02em", textAlign: "center", margin: "0 auto 14px", maxWidth: 760, color: "white" }}
        >
          Hear it straight from{" "}
          <span style={{ color: C_BRIGHT }}>the room</span>.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          style={{ fontFamily: "var(--font-outfit)", fontSize: 15.5, lineHeight: 1.6, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 600, margin: "0 auto" }}
        >
          Unscripted reactions from the senior leaders inside the OT Security First experience.
        </motion.p>

        <div className="otq-shorts-row">
          {OTQ_SHORTS.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 26 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className={`otq-short-slot ${i === 2 ? "hero" : i % 2 === 0 ? "tall" : "short"}`}
            >
              <div className="otq-short-card">
                <div style={{ position: "relative", aspectRatio: "9 / 16", borderRadius: 18, overflow: "hidden", background: BG_ELEV, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <OtqShort id={v.id} title={v.title} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .otq-shorts-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; align-items: center; margin-top: 46px; }
        .otq-short-slot.tall { margin-top: -18px; }
        .otq-short-slot.short { margin-top: 18px; }
        .otq-short-slot.hero { margin-top: -32px; z-index: 3; }
        .otq-short-card {
          position: relative; border-radius: 22px; padding: 4px;
          background: linear-gradient(150deg, ${C_BRIGHT}33 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.02) 70%, ${GOLD}24 100%);
          box-shadow: 0 20px 44px -20px rgba(0,0,0,0.7);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .otq-short-card:hover { box-shadow: 0 26px 54px -20px ${C}4D, 0 20px 44px -20px rgba(0,0,0,0.7); }
        .otq-short-slot.hero .otq-short-card { transform: scale(1.05); box-shadow: 0 30px 62px -22px ${C}59, 0 20px 44px -20px rgba(0,0,0,0.7); }
        @media (max-width: 900px) {
          .otq-shorts-row { grid-template-columns: repeat(3, 1fr); gap: 14px; }
          .otq-short-slot.tall, .otq-short-slot.short, .otq-short-slot.hero { margin-top: 0; }
          .otq-short-slot.hero .otq-short-card { transform: none; }
        }
        @media (max-width: 560px) {
          .otq-shorts-row { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
      `}</style>
    </section>
  );
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────
function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 24px", background: BG_BASE }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex" }}>
            <Eyebrow inView={inView} label="From the Series" tone="magenta" />
          </div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.6vw, 44px)", fontWeight: 700, textAlign: "center", margin: "0 auto 44px", color: "white" }}
        >
          Inside the OT Security First experience.
        </motion.h2>
        <div className="otq-gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridAutoRows: "220px", gap: 14 }}>
          {GALLERY.map((g, i) => (
            <motion.div
              key={g.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
              whileHover={{ scale: 0.99 }}
              className={i === 0 ? "otq-gallery-hero" : ""}
              style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", gridColumn: i === 0 ? "span 2" : undefined, gridRow: i === 0 ? "span 2" : undefined }}
            >
              <img src={g.src} alt={g.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(4,6,15,0.85) 100%)" }} />
              <div style={{ position: "absolute", left: 18, bottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 5, height: 5, borderRadius: 99, background: C_BRIGHT, boxShadow: `0 0 8px ${C}` }} />
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, color: "white", letterSpacing: "0.5px" }}>{g.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 760px) {
          .otq-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .otq-gallery-hero { grid-column: span 2 !important; grid-row: span 1 !important; }
        }
      `}</style>
    </section>
  );
}

// ─── AWARDS (coming soon teaser) ─────────────────────────────────────────────
function AwardsTeaser() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(56px, 6vw, 92px) 24px", background: BG_BASE, overflow: "hidden" }}>
      {/* spotlight halo + ambient orbs */}
      <div aria-hidden style={{ position: "absolute", top: "6%", left: "50%", width: 700, height: 700, marginLeft: -350, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}18 0%, ${GOLD}06 35%, transparent 65%)`, filter: "blur(40px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "10%", left: "-8%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${C}12 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "14%", right: "-8%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${QATAR}14 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />
      <BgDots opacity={0.04} />

      <div style={{ position: "relative", maxWidth: 1160, margin: "0 auto", zIndex: 2, textAlign: "center" }}>
        {/* trophy emblem */}
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.9, ease: EASE }} style={{ display: "inline-flex", position: "relative", marginBottom: 26 }}>
          <span aria-hidden className="otq-aw-ring" style={{ position: "absolute", inset: -22, borderRadius: "50%", background: `conic-gradient(from 0deg, ${GOLD}66, transparent 25%, ${GOLD}88 50%, transparent 75%, ${GOLD}66)`, filter: "blur(6px)", opacity: 0.7 }} />
          <span aria-hidden style={{ position: "absolute", inset: -8, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}30 0%, transparent 70%)`, filter: "blur(12px)" }} />
          <span style={{ position: "relative", width: 90, height: 90, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(circle at 35% 25%, ${GOLD_BRIGHT} 0%, ${GOLD} 50%, #8E6E2E 100%)`, border: `1.5px solid ${GOLD_BRIGHT}`, boxShadow: `inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -2px 0 rgba(0,0,0,0.3), 0 18px 50px ${GOLD}80` }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#1a1206" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
            </svg>
          </span>
        </motion.div>

        {/* eyebrow */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, boxShadow: `0 0 8px ${GOLD}66` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "4.5px", textTransform: "uppercase", color: GOLD_BRIGHT }}>Awards &amp; Recognition</span>
          <span style={{ width: 32, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD})`, boxShadow: `0 0 8px ${GOLD}66` }} />
        </motion.div>

        {/* headline */}
        <motion.h2 initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.25, ease: EASE }} style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(30px, 4.4vw, 58px)", letterSpacing: "-0.02em", lineHeight: 1.05, color: "white", margin: "0 auto 18px", maxWidth: 880 }}>
          OT Security First Qatar Awards
          <br />
          <span className="otq-aw-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${GOLD} 0%, ${GOLD_BRIGHT} 25%, #FFE8B6 50%, ${GOLD_BRIGHT} 75%, ${GOLD} 100%)`, backgroundSize: "300% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block" }}>
            Coming Soon
          </span>
        </motion.h2>

        {/* subline */}
        <motion.p initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.35, ease: EASE }} style={{ fontFamily: "var(--font-outfit)", fontWeight: 400, fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: 1.6, color: "rgba(255,255,255,0.6)", margin: "0 auto clamp(34px, 4vw, 46px)", maxWidth: 640 }}>
          We&apos;re curating the categories that will recognise the people, programmes, and partners advancing the security of Qatar&apos;s critical infrastructure.{" "}
          <span style={{ color: GOLD_BRIGHT, fontWeight: 500 }}>Be the first to know when nominations open.</span>
        </motion.p>

        {/* locked category tiles */}
        <div className="otq-aw-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "clamp(8px, 1vw, 14px)", margin: "0 auto clamp(34px, 4vw, 46px)" }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <motion.div key={n} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.35 + n * 0.06, ease: EASE }} style={{ position: "relative", padding: "18px 14px 16px", borderRadius: 14, background: `linear-gradient(180deg, ${GOLD}0D 0%, ${GOLD}04 100%)`, border: `1px solid ${GOLD}1f`, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 9, minHeight: 140, textAlign: "left" }}>
              <span aria-hidden className="otq-aw-scan" style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent 30%, ${GOLD}22 50%, transparent 70%)`, pointerEvents: "none" }} />
              <span aria-hidden style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${GOLD}28 0%, ${GOLD}0c 100%)`, border: `1px solid ${GOLD}45` }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GOLD_BRIGHT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 10.5, fontWeight: 700, letterSpacing: "2.2px", textTransform: "uppercase", color: GOLD_BRIGHT, opacity: 0.7 }}>Category {String(n).padStart(2, "0")}</span>
              <div aria-hidden style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", filter: "blur(5px)", opacity: 0.4, userSelect: "none" }}>
                <span style={{ display: "block", width: "82%", height: 11, borderRadius: 4, background: "rgba(255,255,255,0.6)" }} />
                <span style={{ display: "block", width: "65%", height: 11, borderRadius: 4, background: "rgba(255,255,255,0.5)" }} />
              </div>
              <span style={{ position: "absolute", right: 12, top: 12, fontFamily: "var(--font-outfit)", fontSize: 8.5, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: GOLD, opacity: 0.7 }}>TBA</span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.button initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.8, ease: EASE }} onClick={() => otqScrollTo("register")} className="otq-aw-cta" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 32px", borderRadius: 999, background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_BRIGHT} 100%)`, border: `1px solid ${GOLD_BRIGHT}`, fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#1a1206", cursor: "pointer", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 14px 36px ${GOLD}73` }}>
          Notify Me When Nominations Open
        </motion.button>
      </div>

      <style jsx global>{`
        @keyframes otqAwShimmer { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
        .otq-aw-shimmer { animation: otqAwShimmer 4.5s linear infinite; }
        @keyframes otqAwRing { to { transform: rotate(360deg); } }
        .otq-aw-ring { animation: otqAwRing 14s linear infinite; }
        @keyframes otqAwScan { 0% { transform: translateX(-120%); } 60%, 100% { transform: translateX(120%); } }
        .otq-aw-scan { animation: otqAwScan 3.6s ease-in-out infinite; }
        .otq-aw-cta:hover { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 18px 44px ${GOLD}8c !important; }
        @media (max-width: 860px) { .otq-aw-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 480px) { .otq-aw-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}

// ─── GET IN TOUCH ────────────────────────────────────────────────────────────
type OtqContact = { eyebrow: string; name: string; role: string; email: string; linkedin?: string; whatsapp: string; whatsappLabel: string; photo: string; photoPos?: string; tone: "magenta" | "maroon" };

const OTQ_CONTACTS: OtqContact[] = [
  { eyebrow: "Speaking Enquiries", name: "Anna Firdouse Shah", role: "Senior Conference Producer", email: "anna@eventsfirstgroup.com", linkedin: "https://www.linkedin.com/in/anna-firdous-shah-88a90b1b8/", whatsapp: "https://wa.me/971545714377", whatsappLabel: "+971 54 571 4377", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/team/anna+blur+bg.png", photoPos: "center 28%", tone: "magenta" },
  { eyebrow: "Sponsorship", name: "Mohammed Hassan", role: "Partnership Manager", email: "hassan@eventsfirstgroup.com", linkedin: "https://www.linkedin.com/in/mohammed-hassan-khan/", whatsapp: "https://wa.me/971545714377", whatsappLabel: "+971 54 571 4377", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/hassan.jpg", photoPos: "center 18%", tone: "maroon" },
  { eyebrow: "Sponsorship", name: "Mohammed Danish", role: "Partnership Manager", email: "danish@eventsfirstgroup.com", linkedin: "https://www.linkedin.com/in/mohammed-danish-018bb7262/", whatsapp: "https://wa.me/971545714377", whatsappLabel: "+971 54 571 4377", photo: "/team/danish.jpg", photoPos: "center 22%", tone: "maroon" },
];

function OtqContactCard({ c, delay, inView }: { c: OtqContact; delay: number; inView: boolean }) {
  const tone = c.tone === "maroon" ? QATAR : C;
  const toneBright = c.tone === "maroon" ? QATAR_BRIGHT : C_BRIGHT;
  const WHATSAPP = "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.09c-.24.68-1.42 1.31-1.95 1.36-.5.05-1.13.24-3.68-.77-3.09-1.22-5.08-4.35-5.24-4.55-.15-.2-1.26-1.68-1.26-3.2s.8-2.27 1.08-2.58c.28-.31.61-.39.82-.39.2 0 .41 0 .59.01.19.01.44-.07.69.53.24.6.83 2.07.9 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.2.73-.85.92-1.14.19-.29.39-.24.65-.15.27.1 1.71.81 2 .96.29.15.49.22.56.34.07.12.07.68-.17 1.36z";
  const links = [
    { kind: "email", href: `mailto:${c.email}`, label: `Email ${c.name}`, icon: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7", filled: false },
    ...(c.linkedin ? [{ kind: "linkedin", href: c.linkedin, label: `${c.name} on LinkedIn`, icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z", filled: false }] : []),
    { kind: "whatsapp", href: c.whatsapp, label: `WhatsApp ${c.name}`, icon: WHATSAPP, filled: true },
  ];
  const iconLinks = links.filter((l) => l.kind !== "email");
  const btnStyle = { display: "grid", placeItems: "center", flex: 1, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", color: "#fff", textDecoration: "none" } as React.CSSProperties;
  const contentStyle = { position: "absolute", left: 0, right: 0, bottom: 0, padding: "24px 22px 22px", "--btn-tone": tone, "--btn-tone-b": toneBright } as React.CSSProperties;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: EASE }}
      whileHover={{ y: -6, boxShadow: `0 34px 72px -26px rgba(0,0,0,0.85), 0 16px 46px -20px ${tone}` }}
      className="otq-ct-card"
      style={{ position: "relative", borderRadius: 22, padding: 1.25, background: `linear-gradient(150deg, ${toneBright}45 0%, rgba(255,255,255,0.1) 30%, ${GOLD}2A 72%, rgba(255,255,255,0.04) 100%)`, boxShadow: "0 20px 46px -22px rgba(0,0,0,0.7)" }}
    >
      <div style={{ position: "relative", borderRadius: 20.75, overflow: "hidden", aspectRatio: "4 / 5", background: BG_ELEV }}>
        {/* photo fills the card */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.photo} alt={c.name} loading="lazy" className="otq-ct-photo" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: c.photoPos || "center top" }} />
        {/* base scrim */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,6,15,0.05) 0%, transparent 26%, rgba(4,6,15,0.6) 58%, rgba(4,6,15,0.96) 100%)", pointerEvents: "none" }} />
        {/* tone wash — brightens on hover */}
        <div aria-hidden className="otq-ct-wash" style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 38%, ${tone}42 100%), linear-gradient(125deg, ${tone}2E 0%, transparent 55%)`, opacity: 0, transition: "opacity 0.45s ease", pointerEvents: "none" }} />
        {/* corner accent glow on hover */}
        <div aria-hidden className="otq-ct-glow" style={{ position: "absolute", top: "-18%", right: "-14%", width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${toneBright}55 0%, transparent 70%)`, filter: "blur(30px)", opacity: 0, transition: "opacity 0.45s ease", pointerEvents: "none" }} />

        <div style={contentStyle}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "5px 12px", borderRadius: 999, background: `${tone}33`, border: `1px solid ${tone}70`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
            <span style={{ width: 5, height: 5, borderRadius: 99, background: toneBright, boxShadow: `0 0 8px ${toneBright}` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#fff" }}>{c.eyebrow}</span>
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.1vw, 24px)", fontWeight: 700, color: "white", margin: "0 0 3px", lineHeight: 1.12, textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>{c.name}</h3>
          <div style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, color: "rgba(255,255,255,0.78)", marginBottom: 16, textShadow: "0 1px 8px rgba(0,0,0,0.55)" }}>{c.role}</div>

          {/* email — full text pill */}
          <a href={`mailto:${c.email}`} aria-label={`Email ${c.name}`} className="otq-ct-mail" style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 13px", borderRadius: 11, background: "rgba(0,0,0,0.42)", border: "1px solid rgba(255,255,255,0.16)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", textDecoration: "none", marginBottom: 10 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: toneBright, flexShrink: 0 }}><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7" /></svg>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12.5, fontWeight: 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</span>
          </a>

          {/* icon buttons — linkedin + whatsapp */}
          <div style={{ display: "flex", gap: 10 }}>
            {iconLinks.map((l) => (
              <a key={l.kind} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.label} title={l.label} className="otq-ct-btn" style={btnStyle}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill={l.filled ? "currentColor" : "none"} stroke={l.filled ? "none" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={l.icon} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GetInTouch() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 24px", background: BG_BASE, overflow: "hidden" }}>
      <GradientSplash />
      <BgDots opacity={0.04} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex" }}>
            <Eyebrow inView={inView} label="Get in Touch" tone="magenta" />
          </div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.6vw, 44px)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.02em", textAlign: "center", margin: "0 auto 14px", maxWidth: 760, color: "white" }}
        >
          Real people, ready to{" "}
          <span style={{ color: C_BRIGHT }}>help</span>.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          style={{ fontFamily: "var(--font-outfit)", fontSize: 15.5, lineHeight: 1.6, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 600, margin: "0 auto" }}
        >
          Talk to our team about speaking and sponsorship opportunities at OT Security First Qatar.
        </motion.p>
        <div className="otq-contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(18px, 2.2vw, 30px)", marginTop: 46, alignItems: "stretch" }}>
          {OTQ_CONTACTS.map((c, i) => (
            <OtqContactCard key={c.name} c={c} delay={0.15 + i * 0.12} inView={inView} />
          ))}
        </div>
      </div>
      <style jsx global>{`
        .otq-ct-photo { transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .otq-ct-card:hover .otq-ct-photo { transform: scale(1.05); }
        .otq-ct-card:hover .otq-ct-wash { opacity: 1; }
        .otq-ct-card:hover .otq-ct-glow { opacity: 1; }
        .otq-ct-btn { transition: background .3s, border-color .3s, transform .3s, box-shadow .3s; }
        .otq-ct-btn:hover { background: var(--btn-tone) !important; border-color: var(--btn-tone-b) !important; transform: translateY(-2px); box-shadow: 0 10px 22px -8px var(--btn-tone); }
        .otq-ct-mail { transition: background .3s, border-color .3s; }
        .otq-ct-mail:hover { background: var(--btn-tone) !important; border-color: var(--btn-tone-b) !important; }
        @media (max-width: 860px) { .otq-contact-grid { grid-template-columns: 1fr !important; max-width: 360px; margin-left: auto; margin-right: auto; } }
      `}</style>
    </section>
  );
}

// ─── BE PART OF THE MOVEMENT ──────────────────────────────────────────────────
function BeTheMovement() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 24px", overflow: "hidden", background: BG_BASE }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url(${OT_PHOTOS.network})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.2 }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${BG_BASE} 0%, ${BG_BASE}CC 45%, ${BG_BASE} 100%), radial-gradient(80% 80% at 50% 40%, ${C}22 0%, transparent 60%)` }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ display: "inline-flex", marginBottom: 24 }}>
          <QatarSerration color={GOLD} width={90} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4.6vw, 56px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em", margin: 0, color: "white" }}
        >
          Be Part of the{" "}
          <span style={{ background: `linear-gradient(100deg, ${C_BRIGHT}, ${QATAR_BRIGHT})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Movement</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(16px, 2.1vw, 20px)", lineHeight: 1.55, color: "rgba(255,255,255,0.82)", maxWidth: 640, margin: "24px auto 0" }}
        >
          Shape the future of industrial cybersecurity in Qatar — where national infrastructure, smart city innovation, and cyber resilience converge.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.22, ease: EASE }}
          onClick={() => otqScrollTo("register")}
          style={{ cursor: "pointer", marginTop: 34, fontFamily: "var(--font-outfit)", fontSize: 15.5, fontWeight: 600, color: "white", padding: "16px 38px", borderRadius: 999, border: "none", background: `linear-gradient(100deg, ${C} 0%, ${C_DEEP} 100%)`, boxShadow: `0 14px 34px ${C}4D` }}
        >
          Reserve Your Seat
        </motion.button>
      </div>
    </section>
  );
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
function RegisterSection() {
  return (
    <section style={{ position: "relative", padding: "clamp(44px, 5vw, 70px) 0", background: BG_BASE, overflow: "hidden" }}>
      <BgDots opacity={0.04} />
      <div className="otq-register-wrap" style={{ position: "relative", zIndex: 1 }}>
        <InquiryForm defaultCountry="QA" eventName="OT Security First Qatar 2026" labelText="Join Us in Doha" />
      </div>
      <style jsx global>{`
        .otq-register-wrap #get-involved { background: transparent !important; }
        .otq-register-wrap #get-involved > .absolute { display: none; }
        .otq-register-wrap .inquiry-split > div:last-child {
          background: rgba(11, 18, 38, 0.78) !important;
          backdrop-filter: blur(28px) saturate(1.2) !important;
          -webkit-backdrop-filter: blur(28px) saturate(1.2) !important;
          border: 1px solid ${C}25 !important;
          box-shadow: 0 22px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }
        .otq-register-wrap button[style*="background: var(--orange)"] {
          background: ${C} !important;
          border-color: ${C} !important;
        }
        .otq-register-wrap .inquiry-split > div:last-child > .absolute {
          background: radial-gradient(ellipse, ${C}10 0%, transparent 70%) !important;
        }
        .otq-register-wrap [style*="var(--orange)"][style*="letter-spacing: 3px"] {
          color: ${C_BRIGHT} !important;
        }
        .otq-register-wrap .inquiry-split svg { color: ${C_BRIGHT}; }
      `}</style>
    </section>
  );
}

// ─── VENUE ────────────────────────────────────────────────────────────────────
function Venue() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  // Doha skyline — swap for the real venue shot once selected
  const VENUE_BG = "https://images.unsplash.com/photo-1683194247996-43897678c94c?w=1600&q=80&auto=format&fit=crop";
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(48px, 5.5vw, 82px) 0", background: BG_BASE, overflow: "hidden" }}>
      {/* background image */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={VENUE_BG} alt="" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%", filter: "saturate(0.85) contrast(1.05)" }} />
      </div>
      {/* vignette + tone wash */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: `linear-gradient(180deg, ${BG_BASE}DE 0%, ${BG_BASE}99 35%, ${BG_BASE}99 65%, ${BG_BASE}F2 100%)`, pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: `radial-gradient(ellipse 60% 50% at 15% 20%, ${C}1c 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 85% 80%, ${QATAR}24 0%, transparent 55%)`, pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, boxShadow: "inset 0 0 200px rgba(0,0,0,0.7)", pointerEvents: "none" }} />
      <BgDots opacity={0.04} />

      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", zIndex: 3, textAlign: "center" }}>
        {/* eyebrow */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})`, boxShadow: `0 0 8px ${GOLD}66` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "4.5px", textTransform: "uppercase", color: GOLD_BRIGHT }}>The Venue</span>
          <span style={{ width: 32, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD})`, boxShadow: `0 0 8px ${GOLD}66` }} />
        </motion.div>

        {/* headline with shimmer */}
        <motion.h2 initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.1, ease: EASE }} style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(30px, 5vw, 60px)", letterSpacing: "-0.02em", lineHeight: 1.04, color: "white", margin: "0 auto 18px", maxWidth: 900, textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>
          Hosted in the heart of Doha.
          <br />
          <span className="otq-vn-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${GOLD} 0%, ${GOLD_BRIGHT} 25%, #FFE8B6 50%, ${GOLD_BRIGHT} 75%, ${GOLD} 100%)`, backgroundSize: "300% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block" }}>
            Venue announcing soon.
          </span>
        </motion.h2>

        {/* subline */}
        <motion.p initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.25, ease: EASE }} style={{ fontFamily: "var(--font-outfit)", fontWeight: 400, fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: "0 auto clamp(34px, 4vw, 44px)", maxWidth: 640, textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
          We&apos;re finalising the host property for OT Security First Qatar 2026 — a five-star venue in the heart of Doha, selected for executive networking and a programme of this calibre.
        </motion.p>

        {/* fact chips */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay: 0.35, ease: EASE }} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {[
            { label: "Doha, State of Qatar", confirmed: true, icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
            { label: "3rd Week · November 2026", confirmed: true, icon: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18" },
            { label: "Five-Star Property", confirmed: false, icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
          ].map((chip) => (
            <div key={chip.label} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "9px 16px", borderRadius: 999, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(14px) saturate(180%)", WebkitBackdropFilter: "blur(14px) saturate(180%)", border: `1px solid ${chip.confirmed ? "rgba(255,255,255,0.22)" : `${GOLD}55`}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 18px rgba(0,0,0,0.4)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={chip.confirmed ? C_BRIGHT : GOLD_BRIGHT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={chip.icon} /></svg>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.8px", color: "white", textTransform: "uppercase" }}>{chip.label}</span>
              {!chip.confirmed && (
                <span style={{ marginLeft: 4, fontFamily: "var(--font-outfit)", fontSize: 8.5, fontWeight: 700, letterSpacing: "1.5px", color: GOLD, textTransform: "uppercase" }}>TBA</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes otqVnShimmer { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
        .otq-vn-shimmer { animation: otqVnShimmer 5s linear infinite; }
      `}</style>
    </section>
  );
}

// ─── FAQ (visible, matches the FAQPage JSON-LD in layout.tsx) ─────────────────
const OTQ_FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "When is OT Security First Qatar 2026?",
    a: "OT Security First Qatar 2026 takes place in the third week of November 2026 in Doha, State of Qatar. The exact date is confirmed to registered delegates closer to the event.",
  },
  {
    q: "Where is OT Security First Qatar 2026 held?",
    a: "In Doha, State of Qatar. The exact five-star venue is announced and confirmed to registered delegates closer to the event date.",
  },
  {
    q: "Who attends OT Security First Qatar 2026?",
    a: "200+ senior leaders and 25+ speakers — including government policymakers and ministries, the National Cyber Security Agency (NCSA) and regulators, heads of critical infrastructure and national utility operators, CISOs, CIOs, CTOs and CDOs, heads of OT/ICS and industrial cybersecurity, and energy, LNG, utilities and smart-city leaders.",
  },
  {
    q: "Is there a fee to attend OT Security First Qatar 2026?",
    a: "Attendance is free for qualified delegates. Apply via the registration form on this page and the advisory team will confirm eligibility.",
  },
  {
    q: "How do I register or sponsor OT Security First Qatar 2026?",
    a: (
      <>
        Register via the form on this page. For sponsorship, partnership, or
        speaking enquiries, contact{" "}
        <a href="mailto:partnerships@eventsfirstgroup.com" style={{ color: C_BRIGHT, textDecoration: "none", borderBottom: `1px solid ${C}66` }}>
          partnerships@eventsfirstgroup.com
        </a>
        .
      </>
    ),
  },
];

function FaqItem({ q, a, index, isOpen, onToggle }: { q: string; a: React.ReactNode; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${isOpen ? `${C}66` : "rgba(255,255,255,0.1)"}`, background: "linear-gradient(160deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012))", boxShadow: isOpen ? `inset 0 1px 0 rgba(255,255,255,0.1), 0 12px 34px rgba(0,0,0,0.4), 0 0 34px ${C}22` : "inset 0 1px 0 rgba(255,255,255,0.06)", transition: "border-color 0.35s ease, box-shadow 0.35s ease" }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "18px 22px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15.5px, 1.9vw, 18px)", fontWeight: 600, color: isOpen ? "white" : "rgba(255,255,255,0.9)", letterSpacing: "-0.01em" }}>
          {q}
        </span>
        <span aria-hidden style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${isOpen ? C : "rgba(255,255,255,0.18)"}`, background: isOpen ? `linear-gradient(135deg, ${C}, ${C_DEEP})` : "rgba(255,255,255,0.04)", transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "white" : C_BRIGHT} strokeWidth="2.4" strokeLinecap="round" style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={`faq-a-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ margin: 0, padding: "0 22px 20px", fontFamily: "var(--font-outfit)", fontSize: "clamp(14px, 1.6vw, 15.5px)", lineHeight: 1.68, color: "rgba(255,255,255,0.68)" }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section ref={ref} id="faq" style={{ position: "relative", padding: "clamp(44px, 5vw, 74px) 24px", background: BG_BASE, overflow: "hidden" }}>
      <GradientSplash />
      <BgDots opacity={0.04} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex" }}>
            <Eyebrow inView={inView} label="FAQ" tone="magenta" />
          </div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.6vw, 42px)", fontWeight: 700, lineHeight: 1.12, textAlign: "center", margin: "0 auto 40px", maxWidth: 720, color: "white", letterSpacing: "-0.02em" }}
        >
          Everything you need to know about{" "}
          <span style={{ color: C_BRIGHT }}>Qatar 2026</span>.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {OTQ_FAQS.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} index={i} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── OT SECURITY FIRST SERIES — cross-links to other editions ─────────────────
const OTQ_EDITIONS: { city: string; edition: string; when: string; href: string }[] = [
  { city: "Johannesburg", edition: "1st Edition · Africa", when: "August 2026", href: "/events/ot-security-first/johannesburg-2026" },
  { city: "Jubail, KSA", edition: "2nd Edition", when: "October 2026", href: "/events/ot-security-first/jubail" },
  { city: "United Arab Emirates", edition: "Flagship Edition", when: "Coming 2027", href: "/events/ot-security-first" },
  { city: "Muscat, Oman", edition: "New Edition", when: "March 2027", href: "/events/ot-security-first/oman-2026" },
];

function SeriesEditions() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(40px, 4.5vw, 66px) 24px", background: BG_BASE, overflow: "hidden" }}>
      <BgDots opacity={0.035} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex" }}>
            <Eyebrow inView={inView} label="OT Security First Series" tone="magenta" />
          </div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(23px, 3.2vw, 36px)", fontWeight: 700, lineHeight: 1.14, textAlign: "center", margin: "0 auto 34px", maxWidth: 680, color: "white", letterSpacing: "-0.02em" }}
        >
          Explore other editions across the region.
        </motion.h2>
        <div className="otq-series-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {OTQ_EDITIONS.map((e, i) => (
            <motion.div
              key={e.href}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08 * i, ease: EASE }}
            >
              <Link href={e.href} className="otq-series-card" aria-label={`OT Security First ${e.city} — ${e.edition}, ${e.when}`}>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9.5, fontWeight: 700, letterSpacing: "2.4px", textTransform: "uppercase", color: C_BRIGHT }}>{e.edition}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "white", letterSpacing: "-0.01em", lineHeight: 1.15 }}>{e.city}</span>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.55)" }}>{e.when}</span>
                <span className="otq-series-go" style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                  View event
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .otq-series-card { display: flex; flex-direction: column; gap: 6px; height: 100%; padding: 22px 20px; border-radius: 16px; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.014)); box-shadow: inset 0 1px 0 rgba(255,255,255,0.07); transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease, box-shadow 0.4s ease; }
        .otq-series-card:hover { transform: translateY(-5px); border-color: ${C}66; box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 40px rgba(0,0,0,0.45), 0 0 34px ${C}22; }
        .otq-series-card:hover .otq-series-go { color: ${C_BRIGHT}; }
        @media (max-width: 900px) { .otq-series-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 520px) { .otq-series-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── shared styles ────────────────────────────────────────────────────────────
const paraStyle: React.CSSProperties = {
  fontFamily: "var(--font-outfit)",
  fontSize: "clamp(15px, 1.7vw, 17px)",
  lineHeight: 1.68,
  color: "rgba(255,255,255,0.72)",
  margin: 0,
};

// ═══════════════════════════════════════════════════════════════════════════
// POST-EVENT REPORTS — request modal + floating download prompt
// ═══════════════════════════════════════════════════════════════════════════
type OtqReportEntry = { edition: string; year: string; title: string; url: string; filename: string };
const OTQ_POST_EVENT_REPORTS: OtqReportEntry[] = [
  {
    edition: "Abu Dhabi",
    year: "2026",
    title: "OT Security First Abu Dhabi",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/Post+Event+Report+-+OT+Security+First+2026.pdf",
    filename: "OT-Security-First-Abu-Dhabi-2026-Report.pdf",
  },
  {
    edition: "MENA Webinar",
    year: "2026",
    title: "OT First MENA Webinar",
    url: "https://efg-final.s3.eu-north-1.amazonaws.com/post_event_reports/Post+Event+Report+-+OT+First+MENA+Webinar+2026.pdf",
    filename: "OT-First-MENA-Webinar-2026-Report.pdf",
  },
];

function OtqPostEventReports() {
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
  const [selectedReportUrl, setSelectedReportUrl] = useState<string>(OTQ_POST_EVENT_REPORTS[0]?.url ?? "");

  useEffect(() => {
    if (!modalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prevOverflow; window.removeEventListener("keydown", onKey); };
  }, [modalOpen]);

  useEffect(() => {
    const onOpenRequest = (e: Event) => {
      const detail = (e as CustomEvent<{ type?: RequestKind }>).detail;
      if (detail?.type === "Past Event Report" || detail?.type === "Delegate List") {
        setRequestType(detail.type);
        setSubmitState("idle"); setSubmitError(""); setErrors({});
        setModalOpen(true);
      }
    };
    window.addEventListener("otq-2026:open-request", onOpenRequest);
    return () => window.removeEventListener("otq-2026:open-request", onOpenRequest);
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
    setErrors((prev) => { const next = { ...prev }; if (err) next.phone = err; else delete next.phone; return next; });
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
    if (Object.keys(newErrors).length > 0) { setPhoneTouched(true); return; }

    const selectedReport = OTQ_POST_EVENT_REPORTS.find((r) => r.url === selectedReportUrl);

    setSubmitState("submitting");
    setSubmitError("");
    const res = await submitForm({
      type: "contact",
      full_name: fullName.trim(),
      email: email.trim(),
      job_title: jobTitle.trim(),
      phone: `${countryCode.code} ${phone.trim()}`,
      event_name: "OT Security First Qatar 2026",
      metadata: {
        "Event Page": "OT Security First Qatar 2026",
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
              className="otq-req-modal-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setModalOpen(false)}
              role="dialog" aria-modal="true" aria-labelledby="otq-req-modal-title"
            >
              <motion.div
                className="otq-req-modal-card"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <button type="button" onClick={() => setModalOpen(false)} className="otq-req-modal-close" aria-label="Close request form">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <span aria-hidden className="otq-req-modal-hairline" />

                <div className="otq-req-modal-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 24, height: 1, background: C_BRIGHT }} />
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: C_BRIGHT }}>{modalCopy.kicker}</span>
                  </div>
                  <h3 id="otq-req-modal-title" style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.4vw, 26px)", fontWeight: 700, letterSpacing: "-0.5px", color: "white", lineHeight: 1.2 }}>
                    {modalCopy.title}
                  </h3>
                  <p style={{ margin: "10px 0 0", fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>
                    {modalCopy.subtitle}
                  </p>
                </div>

                {submitState === "success" ? (
                  <div className="otq-req-modal-success">
                    <div className="otq-req-modal-success-check">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <h4>Request received.</h4>
                    <p>{modalCopy.success}</p>
                    <button type="button" onClick={() => setModalOpen(false)} className="otq-req-modal-done">Done</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="otq-req-form-fields">
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

                    <div className="otq-req-form-row">
                      <div role="tablist" aria-label="Request type" style={{ display: "flex", gap: 8, width: "100%" }}>
                        {(["Past Event Report", "Delegate List"] as const).map((kind) => {
                          const active = requestType === kind;
                          return (
                            <button key={kind} type="button" role="tab" aria-selected={active} onClick={() => setRequestType(kind)}
                              style={{ flex: 1, padding: "10px 12px", borderRadius: 9, border: active ? `1px solid ${C}66` : "1px solid rgba(255,255,255,0.10)", background: active ? `linear-gradient(135deg, ${C}26, ${C}0a)` : "rgba(255,255,255,0.03)", color: active ? C_BRIGHT : "rgba(255,255,255,0.55)", fontFamily: "var(--font-outfit)", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.2px", cursor: "pointer", transition: "all 0.25s ease" }}>
                              {kind}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="otq-req-form-row">
                      <label className="otq-req-form-field" style={{ flex: "1 1 100%" }}>
                        <span className="otq-req-form-label">Select Edition</span>
                        <select value={selectedReportUrl} onChange={(e) => { setSelectedReportUrl(e.target.value); if (errors.report) setErrors({ ...errors, report: "" }); }} className="otq-req-form-input otq-req-form-report-select" aria-invalid={!!errors.report}>
                          {OTQ_POST_EVENT_REPORTS.map((r) => (
                            <option key={r.url} value={r.url} style={{ background: BG_ELEV, color: "#fff" }}>{r.title} {r.year}</option>
                          ))}
                        </select>
                        {errors.report && <span className="otq-req-form-err">{errors.report}</span>}
                      </label>
                    </div>

                    <div className="otq-req-form-row">
                      <label className="otq-req-form-field">
                        <span className="otq-req-form-label">Full Name</span>
                        <input type="text" value={fullName} onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors({ ...errors, fullName: "" }); }} placeholder="Your full name" autoComplete="name" className="otq-req-form-input" aria-invalid={!!errors.fullName} />
                        {errors.fullName && <span className="otq-req-form-err">{errors.fullName}</span>}
                      </label>
                      <label className="otq-req-form-field">
                        <span className="otq-req-form-label">Work Email</span>
                        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }} placeholder="name@company.com" autoComplete="email" className="otq-req-form-input" aria-invalid={!!errors.email} />
                        {errors.email && <span className="otq-req-form-err">{errors.email}</span>}
                      </label>
                    </div>

                    <div className="otq-req-form-row">
                      <label className="otq-req-form-field">
                        <span className="otq-req-form-label">Job Title</span>
                        <input type="text" value={jobTitle} onChange={(e) => { setJobTitle(e.target.value); if (errors.jobTitle) setErrors({ ...errors, jobTitle: "" }); }} placeholder="CISO, Head of OT, CIO…" autoComplete="organization-title" className="otq-req-form-input" aria-invalid={!!errors.jobTitle} />
                        {errors.jobTitle && <span className="otq-req-form-err">{errors.jobTitle}</span>}
                      </label>
                      <label className="otq-req-form-field">
                        <span className="otq-req-form-label">Phone<span className="otq-req-form-hint-inline">{countryCode.length} digits expected</span></span>
                        <div className="otq-req-form-phone-row">
                          <select value={`${countryCode.country}-${countryCode.code}`} onChange={(e) => { const [country, code] = e.target.value.split("-"); const found = COUNTRY_CODES.find((c) => c.country === country && c.code === code); if (found) { setCountryCode(found); setPhone((prev) => prev.replace(/\D/g, "").slice(0, found.length)); } }} className="otq-req-form-cc" aria-label="Country code">
                            {COUNTRY_CODES.map((c) => (
                              <option key={`${c.country}-${c.code}`} value={`${c.country}-${c.code}`} style={{ background: BG_ELEV, color: "#fff" }}>{c.country} {c.code}</option>
                            ))}
                          </select>
                          <div className="otq-req-form-phone-wrap">
                            <input type="tel" inputMode="numeric" value={phone} onChange={(e) => { const digits = e.target.value.replace(/\D/g, "").slice(0, countryCode.length); setPhone(digits); }} onBlur={() => setPhoneTouched(true)} placeholder={countryCode.placeholder} autoComplete="tel-national" maxLength={countryCode.length} className="otq-req-form-input otq-req-form-phone-input" aria-invalid={!!errors.phone} />
                            {phoneTouched && phoneIsValid && (
                              <span aria-hidden className="otq-req-form-phone-check">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                              </span>
                            )}
                          </div>
                        </div>
                        {phoneTouched && !phoneIsValid && phoneDigitsLen > 0 && !errors.phone && (
                          <span className="otq-req-form-phone-progress">{phoneDigitsLen} / {countryCode.length} digits</span>
                        )}
                        {errors.phone && <span className="otq-req-form-err">{errors.phone}</span>}
                      </label>
                    </div>

                    {submitError && <div className="otq-req-form-submit-err">{submitError}</div>}

                    <button type="submit" disabled={submitState === "submitting"} className="otq-req-form-submit">
                      {submitState === "submitting" ? "Sending…" : requestType === "Past Event Report" ? "Send me the report" : "Send me the delegate list"}
                      {submitState !== "submitting" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}>
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      )}
                    </button>
                    <p className="otq-req-form-hint">We respect your inbox. Used only to send the requested resource and edition follow-ups.</p>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <style jsx global>{`
        .otq-req-modal-overlay { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: clamp(16px, 3vw, 32px); background: rgba(2, 4, 14, 0.78); backdrop-filter: blur(14px) saturate(140%); -webkit-backdrop-filter: blur(14px) saturate(140%); }
        .otq-req-modal-card { position: relative; width: 100%; max-width: 580px; max-height: calc(100vh - clamp(32px, 6vw, 64px)); overflow-y: auto; padding: clamp(24px, 3vw, 36px); background: linear-gradient(165deg, ${BG_ELEV} 0%, ${BG_BASE} 100%); border: 1px solid rgba(255,255,255,0.10); border-radius: 20px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.45), 0 24px 56px rgba(0,0,0,0.55), 0 48px 96px rgba(0,0,0,0.45); }
        .otq-req-modal-hairline { position: absolute; top: 0; left: 8%; right: 8%; height: 1px; background: linear-gradient(90deg, transparent 0%, ${C_BRIGHT} 30%, ${QATAR_BRIGHT} 70%, transparent 100%); opacity: 0.85; }
        .otq-req-modal-close { position: absolute; top: 14px; right: 14px; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.7); cursor: pointer; transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease, transform 0.3s ease; }
        .otq-req-modal-close:hover { color: white; border-color: ${C_BRIGHT}66; background: ${C}1a; transform: rotate(90deg); }
        .otq-req-modal-header { margin-bottom: clamp(18px, 2vw, 22px); padding-right: 36px; }
        .otq-req-modal-success { display: flex; flex-direction: column; align-items: center; text-align: center; padding: clamp(8px, 1vw, 12px) 0 4px; }
        .otq-req-modal-success-check { display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, ${C}, ${C_BRIGHT}); margin-bottom: 16px; box-shadow: 0 8px 24px ${C}66; }
        .otq-req-modal-success h4 { margin: 0 0 8px; font-family: var(--font-display); font-size: clamp(18px, 1.8vw, 22px); font-weight: 700; color: white; }
        .otq-req-modal-success p { margin: 0 0 22px; font-family: var(--font-outfit); font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.55; max-width: 380px; }
        .otq-req-modal-done { padding: 10px 28px; background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%); color: white; border: none; border-radius: 10px; font-family: var(--font-outfit); font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 20px ${C}55; transition: all 0.3s ease; }
        .otq-req-modal-done:hover { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 14px 30px ${C}88; }
        .otq-req-form-fields { display: flex; flex-direction: column; gap: 14px; }
        .otq-req-form-row { display: flex; flex-wrap: wrap; gap: 14px; }
        .otq-req-form-field { flex: 1 1 200px; display: flex; flex-direction: column; gap: 6px; position: relative; }
        .otq-req-form-label { font-family: var(--font-outfit); font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.6); letter-spacing: 0.5px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
        .otq-req-form-hint-inline { font-size: 10px; letter-spacing: 0.3px; text-transform: none; opacity: 0.5; }
        .otq-req-form-input { width: 100%; padding: 11px 13px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: white; font-family: var(--font-outfit); font-size: 14px; transition: all 0.25s ease; outline: none; }
        .otq-req-form-input:focus { border-color: ${C}88; background: rgba(255,255,255,0.06); box-shadow: 0 0 0 3px ${C}22; }
        .otq-req-form-input[aria-invalid="true"] { border-color: rgba(255,80,80,0.6); }
        .otq-req-form-report-select { cursor: pointer; appearance: none; -webkit-appearance: none; background-image: linear-gradient(45deg, transparent 50%, ${C_BRIGHT} 50%), linear-gradient(135deg, ${C_BRIGHT} 50%, transparent 50%); background-position: calc(100% - 16px) 50%, calc(100% - 11px) 50%; background-size: 5px 5px; background-repeat: no-repeat; padding-right: 32px; }
        .otq-req-form-cc { flex: 0 0 110px; padding: 11px 9px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: white; font-family: var(--font-outfit); font-size: 12px; cursor: pointer; }
        .otq-req-form-phone-row { display: flex; gap: 8px; }
        .otq-req-form-phone-wrap { position: relative; flex: 1; }
        .otq-req-form-phone-input { padding-right: 38px; }
        .otq-req-form-phone-check { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: ${C_BRIGHT}; }
        .otq-req-form-phone-progress { font-family: var(--font-outfit); font-size: 11px; color: rgba(255,255,255,0.45); }
        .otq-req-form-err { font-family: var(--font-outfit); font-size: 11px; color: #ff6b6b; }
        .otq-req-form-submit-err { padding: 10px 14px; border-radius: 10px; background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3); color: #ffb6b6; font-family: var(--font-outfit); font-size: 13px; }
        .otq-req-form-submit { margin-top: 4px; padding: 13px 26px; background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%); color: white; border: none; border-radius: 12px; font-family: var(--font-outfit); font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 10px 26px ${C}55; transition: all 0.35s cubic-bezier(0.22,1,0.36,1); }
        .otq-req-form-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 16px 36px ${C}88; }
        .otq-req-form-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .otq-req-form-hint { font-family: var(--font-outfit); font-size: 11px; color: rgba(255,255,255,0.4); margin: 4px 0 0; text-align: center; }
      `}</style>
    </>
  );
}

function OtqPostReportFloat() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nudged, setNudged] = useState(false);
  const [pastOverview, setPastOverview] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const DISMISS_KEY = "otq-2026-report-dismissed";
  const NUDGE_KEY = "otq-2026-report-nudged";

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
      if (localStorage.getItem(NUDGE_KEY) === "1") setNudged(true);
    } catch { /* localStorage unavailable */ }
    const mq = window.matchMedia("(max-width: 700px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const overview = document.getElementById("overview");
    if (!overview) return;
    const obs = new IntersectionObserver(
      ([entry]) => { const rect = entry.boundingClientRect; setPastOverview(rect.bottom < 60); },
      { threshold: [0, 0.1, 1], rootMargin: "0px 0px -60% 0px" }
    );
    obs.observe(overview);
    const initial = overview.getBoundingClientRect();
    setPastOverview(initial.bottom < 60);
    return () => obs.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (!mounted || dismissed || nudged) return;
    const shouldFire = isMobile ? true : pastOverview;
    if (!shouldFire) return;
    const showTimer = setTimeout(() => setShowNudge(true), 800);
    const hideTimer = setTimeout(() => { setShowNudge(false); try { localStorage.setItem(NUDGE_KEY, "1"); } catch {} setNudged(true); }, 8000);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [mounted, pastOverview, dismissed, nudged, isMobile]);

  const handleOpen = () => { window.dispatchEvent(new CustomEvent("otq-2026:open-request", { detail: { type: "Past Event Report" } })); setShowNudge(false); };
  const handleDismiss = (e: React.MouseEvent) => { e.stopPropagation(); setDismissed(true); setShowNudge(false); try { localStorage.setItem(DISMISS_KEY, "1"); } catch {} };
  const handleDismissNudge = (e: React.MouseEvent) => { e.stopPropagation(); setShowNudge(false); try { localStorage.setItem(NUDGE_KEY, "1"); } catch {} setNudged(true); };

  if (!mounted || dismissed) return null;

  // Desktop: keep the sticky note visible the whole way down (no conversion to a FAB icon).
  // Mobile: the note is too wide, so use the compact FAB with a dismissible popup nudge.
  const showStickyNote = !isMobile;
  const showIcon = isMobile;

  return (
    <>
      <AnimatePresence>
        {showStickyNote && (
          <motion.div key="sticky-note" initial={{ opacity: 0, y: 28, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 28, x: "-50%" }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="otq-report-note" role="button" tabIndex={0} onClick={handleOpen} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpen(); } }} aria-label="Download Post Event Reports">
            <button type="button" className="otq-report-note-close" onClick={handleDismiss} aria-label="Dismiss">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <span aria-hidden className="otq-report-note-hairline" />
            <div className="otq-report-note-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><polyline points="9 15 12 18 15 15" /></svg>
            </div>
            <div className="otq-report-note-body">
              <span className="otq-report-note-eyebrow"><span className="otq-report-note-pulse" aria-hidden />Free Download</span>
              <span className="otq-report-note-title">Download our Post Event Reports</span>
              <span className="otq-report-note-cta">View past editions
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6 }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIcon && (
          <motion.div key="floating-icon-wrap" className="otq-report-fab-wrap" initial={{ opacity: 0, scale: 0.6, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6, y: 14 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <AnimatePresence>
              {showNudge && (
                <motion.div key="nudge" className="otq-report-fab-nudge" initial={{ opacity: 0, x: 12, scale: 0.94 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 12, scale: 0.94 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
                  <span className="otq-report-fab-nudge-eyebrow"><span className="otq-report-note-pulse" aria-hidden /> Free Download</span>
                  <span className="otq-report-fab-nudge-text">Download our Post Event Reports</span>
                  <button type="button" className="otq-report-fab-nudge-close" onClick={handleDismissNudge} aria-label="Dismiss">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                  <span aria-hidden className="otq-report-fab-nudge-tail" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="otq-report-fab-btnwrap">
              <button type="button" className="otq-report-fab" onClick={handleOpen} aria-label="Download Post Event Reports" title="Download Post Event Reports">
                <span aria-hidden className="otq-report-fab-pulse" />
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><polyline points="9 15 12 18 15 15" /></svg>
              </button>
              <button type="button" className="otq-report-fab-close" onClick={handleDismiss} aria-label="Dismiss">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .otq-report-note { position: fixed; bottom: 24px; left: 50%; z-index: 60; display: inline-flex; align-items: center; gap: 14px; padding: 14px 22px 14px 18px; border-radius: 999px; cursor: pointer; background: linear-gradient(145deg, ${BG_ELEV} 0%, ${BG_BASE} 100%); border: 1px solid ${C}55; box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.35), 0 18px 50px rgba(0,0,0,0.55), 0 0 36px ${C}30; transition: border-color 0.45s ease, box-shadow 0.45s ease; max-width: calc(100vw - 32px); }
        .otq-report-note:hover { border-color: ${C_BRIGHT}; box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.35), 0 22px 60px rgba(0,0,0,0.6), 0 0 50px ${C}55; }
        .otq-report-note-hairline { position: absolute; top: 0; left: 12%; right: 12%; height: 1px; background: linear-gradient(90deg, transparent 0%, ${C_BRIGHT}, ${QATAR_BRIGHT}, transparent 100%); opacity: 0.7; }
        .otq-report-note-close { position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid rgba(255,255,255,0.18); background: rgba(20,28,52,0.95); color: rgba(255,255,255,0.75); cursor: pointer; backdrop-filter: blur(8px); transition: all 0.3s ease; }
        .otq-report-note-close:hover { color: white; background: ${QATAR}; border-color: ${QATAR_BRIGHT}; transform: rotate(90deg) scale(1.08); }
        .otq-report-note-icon { flex-shrink: 0; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.32), 0 6px 18px ${C}66; }
        .otq-report-note-body { display: flex; flex-direction: column; gap: 1px; line-height: 1.15; }
        .otq-report-note-eyebrow { font-family: var(--font-outfit); font-size: 9px; font-weight: 700; letter-spacing: 2.4px; text-transform: uppercase; color: ${C_BRIGHT}; display: inline-flex; align-items: center; gap: 6px; }
        .otq-report-note-pulse { width: 6px; height: 6px; border-radius: 50%; background: ${C_BRIGHT}; box-shadow: 0 0 8px ${C}; animation: otqReportPulse 1.6s ease-in-out infinite; }
        .otq-report-note-title { font-family: var(--font-display); font-size: 13.5px; font-weight: 700; color: white; letter-spacing: -0.2px; }
        .otq-report-note-cta { font-family: var(--font-outfit); font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.55); display: inline-flex; align-items: center; margin-top: 2px; }
        .otq-report-note:hover .otq-report-note-cta { color: ${C_BRIGHT}; }
        @keyframes otqReportPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(1.5); } }
        .otq-report-fab-wrap { position: fixed; bottom: 96px; right: 24px; z-index: 50; display: flex; flex-direction: row-reverse; align-items: center; gap: 12px; }
        .otq-report-fab-btnwrap { position: relative; display: inline-flex; }
        .otq-report-fab { position: relative; width: 56px; height: 56px; border-radius: 50%; border: 1px solid ${C_BRIGHT}; background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 1.5px 0 rgba(255,255,255,0.34), inset 0 -1.5px 0 rgba(0,0,0,0.25), 0 14px 36px rgba(0,0,0,0.45), 0 0 30px ${C}55; transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease; }
        .otq-report-fab:hover { transform: translateY(-3px) scale(1.06); box-shadow: inset 0 1.5px 0 rgba(255,255,255,0.4), inset 0 -1.5px 0 rgba(0,0,0,0.25), 0 18px 44px rgba(0,0,0,0.5), 0 0 44px ${C}88; }
        .otq-report-fab-pulse { position: absolute; inset: 0; border-radius: 50%; background: ${C}; opacity: 0.4; animation: otqFabRing 2.4s ease-out infinite; z-index: -1; }
        @keyframes otqFabRing { 0% { transform: scale(1); opacity: 0.55; } 80% { transform: scale(1.7); opacity: 0; } 100% { transform: scale(1.7); opacity: 0; } }
        .otq-report-fab-close { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid rgba(255,255,255,0.22); background: rgba(20,28,52,0.96); color: rgba(255,255,255,0.78); cursor: pointer; backdrop-filter: blur(8px); transition: all 0.3s ease; }
        .otq-report-fab-close:hover { color: white; background: ${QATAR}; border-color: ${QATAR_BRIGHT}; transform: rotate(90deg) scale(1.08); }
        .otq-report-fab-nudge { position: relative; max-width: 230px; padding: 12px 32px 12px 14px; border-radius: 14px; background: linear-gradient(145deg, ${BG_ELEV} 0%, ${BG_BASE} 100%); border: 1px solid ${C}55; box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.35), 0 14px 36px rgba(0,0,0,0.55), 0 0 28px ${C}30; display: flex; flex-direction: column; gap: 4px; }
        .otq-report-fab-nudge-eyebrow { font-family: var(--font-outfit); font-size: 8.5px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: ${C_BRIGHT}; display: inline-flex; align-items: center; gap: 6px; }
        .otq-report-fab-nudge-text { font-family: var(--font-display); font-size: 12.5px; font-weight: 700; color: white; letter-spacing: -0.1px; line-height: 1.25; }
        .otq-report-fab-nudge-close { position: absolute; top: 6px; right: 6px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.25s ease; }
        .otq-report-fab-nudge-close:hover { color: white; background: ${QATAR}33; border-color: ${QATAR}88; }
        .otq-report-fab-nudge-tail { position: absolute; right: -6px; top: 50%; transform: translateY(-50%) rotate(45deg); width: 12px; height: 12px; background: ${BG_ELEV}; border-top: 1px solid ${C}55; border-right: 1px solid ${C}55; }
        @media (max-width: 700px) { .otq-report-fab-wrap { bottom: 92px; right: 24px; } .otq-report-fab { width: 56px; height: 56px; } .otq-report-fab-nudge { max-width: 200px; padding: 10px 28px 10px 12px; } }
      `}</style>
    </>
  );
}
