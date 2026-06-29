"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer, InquiryForm } from "@/components/sections";
import EventNavigation from "@/components/ui/EventNavigation";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Lenis (global smooth-scroll) hijacks the wheel, so native hash-anchor jumps get
// reset every frame. Drive Lenis directly when present, else fall back to native.
function jbScrollTo(id: string, offset = -80) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number }) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset });
  else el.scrollIntoView({ behavior: "smooth" });
}

// ─── Design Tokens (OT Security First - pink/magenta only) ───────────────────
const C = "#D34B9A";          // Magenta
const C_BRIGHT = "#E86BB8";   // Light pink
const CYAN = "#F0529E";       // Rose pink (secondary accent; formerly cyan)
const BG_DEEP = "#050818";    // Deep navy/black
const BG_BASE = "#070C20";    // Section base
const EASE = [0.16, 1, 0.3, 1] as const;

const HERO_VIDEO = "https://efg-final.s3.eu-north-1.amazonaws.com/assets/OT-Jubai_video.mp4";
const EVENT_DATE_ISO = "2026-10-27T08:30:00+03:00";

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const S3_LOGOS = `${S3}/sponsors-logo`;

// ─── Speakers ───────────────────────────────────────────────────────────────
type Speaker = {
  name: string;
  title: string;
  org: string;
  photo: string | null;
  linkedin?: string | null;
  flag?: string;
};

const SPEAKERS: Speaker[] = [
  { name: "Ahmed Al Saleh", title: "Head of Digital & OT Cybersecurity Initiatives", org: "Aramco", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Ahmed_Al_Saleh.png", linkedin: "https://www.linkedin.com/in/ahmed-al-saleh/", flag: "https://flagcdn.com/w40/sa.png" },
  { name: "Ahmed T Alawami", title: "Head of AI & Digital Transformation (Energy & Utilities)", org: "Saudi Energy", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Ahmed+T+Alawami.png", linkedin: "https://www.linkedin.com/in/ahmed-alawami1/", flag: "https://flagcdn.com/w40/sa.png" },
  { name: "Abdulrahman Al-Nimari", title: "VP, Cyber Security", org: "", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Abdulrahman+Al-Nimar.png", linkedin: "https://www.linkedin.com/in/alnimari/", flag: "https://flagcdn.com/w40/sa.png" },
  { name: "Sultan Moraished", title: "Group Head of Technology and Corporate Excellence", org: "Red Sea Global", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Sultan_Moraished.png", linkedin: "https://www.linkedin.com/in/sultan-moraished-0786394a/", flag: "https://flagcdn.com/w40/sa.png" },
  { name: "Ali Abdulla Hasan Alsadadi", title: "Chief of Information Technology", org: "Ministry of Oil & Environment Bahrain", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Ali+Abdulla+Hasan+Alsadadi.png", linkedin: "https://www.linkedin.com/in/ali-abdulla-hasan-alsadadi-a4210825/", flag: "https://flagcdn.com/w40/bh.png" },
  { name: "Badar Al Salehi", title: "Director General, Oman National CERT, Cyber Security", org: "MTCIT", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Badar_Al_Salehi.jpg", linkedin: "https://www.linkedin.com/in/badar-al-salehi-75461061/", flag: "https://flagcdn.com/w40/om.png" },
  { name: "Ahmed A. Qaisi", title: "Head of Cybersecurity Defense & Intelligence", org: "NEOM", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Ahmed_A_Qaisi.jpg", linkedin: "https://www.linkedin.com/in/ahmed-a-qaisi-149b0832/", flag: "https://flagcdn.com/w40/sa.png" },
];

// ─── Awards ─────────────────────────────────────────────────────────────────
const AWARDS_DATA = [
  { title: "OT Security Program of the Year", desc: "For an organization that has implemented a mature, multi-site OT security program delivering measurable risk reduction." },
  { title: "CISO / OT Security Leader of the Year", desc: "For an individual who has shown outstanding leadership in driving OT security across their organization or sector." },
  { title: "OT Security Innovation Award", desc: "For a technology or solution provider offering a standout solution addressing a critical OT security challenge." },
  { title: "Excellence in OT Incident Response & Resilience", desc: "For a team or organization that handled a significant OT-related incident effectively and improved resilience as a result." },
  { title: "Public Sector / Critical Infrastructure Protection Award", desc: "For a government entity, regulator, or state-owned enterprise showing leadership in securing national critical infrastructure." },
];

// ─── Past series sponsor marquee ────────────────────────────────────────────
const MARQUEE_ROW_1 = [
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
  `${S3_LOGOS}/Sonicwall.png`,
  `${S3_LOGOS}/threatlocker.png`,
  `${S3_LOGOS}/OPSWAT-logo.png`,
  `${S3_LOGOS}/Xage.png`,
  `${S3_LOGOS}/corelight.png`,
];

const MARQUEE_ROW_2 = [
  `${S3_LOGOS}/Oracle.png`,
  `${S3_LOGOS}/EY.png`,
  `${S3_LOGOS}/Group-IB.png`,
  `${S3_LOGOS}/Acronis.png`,
  `${S3_LOGOS}/ManageEngine.png`,
  `${S3_LOGOS}/Wallix.png`,
  `${S3_LOGOS}/PENTERA.png`,
  `${S3_LOGOS}/Akamai.png`,
  `${S3_LOGOS}/secureworks.png`,
  `${S3_LOGOS}/filigran.png`,
  `${S3_LOGOS}/Anomali.png`,
  `${S3_LOGOS}/AmiViz.png`,
  `${S3_LOGOS}/GBM.png`,
  `${S3_LOGOS}/Paramount.png`,
  `${S3_LOGOS}/YOKOGAWA.png`,
];

// ─── From the Room - OT testimonial shorts ─────────────────────────────────
const OT_SHORTS = [
  { id: "Q0n_sVaMnxg", title: "OT Security First Testimonial" },
  { id: "SF87voLk34A", title: "OT Security First Testimonial" },
  { id: "R5dtc5kjiQU", title: "OT Security First Testimonial" },
  { id: "Hm_yj3NttPo", title: "OT Security First Testimonial" },
  { id: "aaG9We6AjY8", title: "OT Security First Testimonial" },
];

// ─── Gallery - UAE 2026 archive (reused as series past edition imagery) ─────
const GALLERY: { src: string; alt: string; label: string }[] = [
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0510.JPG`, alt: "OT Security First UAE 2025 panel discussion - industrial CISOs and OT cybersecurity leaders on stage debating critical infrastructure defense", label: "Panel Discussion" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/opex+KSA+few/DSC08208.jpg", alt: "OT Security First main conference session - keynote presentation to critical infrastructure security leadership audience in Saudi Arabia", label: "Main Session" },
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0811.JPG`, alt: "OT Security First exhibition floor - industrial cybersecurity solution providers and OT security technology vendors", label: "On Floor" },
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0683.JPG`, alt: "OT Security First networking session - CISOs and senior OT security executives building peer connections at the summit", label: "Networking" },
  { src: `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0820.JPG`, alt: "OT Security First partner exhibition - industrial cybersecurity vendors showcasing OT, ICS, and SCADA security solutions", label: "Partner Exhibition" },
  { src: "https://efg-final.s3.eu-north-1.amazonaws.com/events/opex+KSA+few/DSC08456.jpg", alt: "OT Security First industry speakers on stage - operational technology and ICS security experts presenting strategic insights", label: "Industry Speakers" },
];

// ─── Past event reports (series highlights) ─────────────────────────────────
type ReportEntry = {
  edition: string;
  year: string;
  title: string;
  url: string;
  filename: string;
  logo?: string;
};

const POST_EVENT_REPORTS: ReportEntry[] = [
  {
    edition: "Abu Dhabi",
    year: "2026",
    title: "OT Security First UAE 2026",
    url: `${S3}/post_event_reports/Post+Event+Report+-+OT+Security+First+2026.pdf`,
    filename: "OT-Security-First-Abu-Dhabi-2026-Report.pdf",
    logo: `${S3}/logos/Untitled-2-01.png`,
  },
  {
    edition: "MENA Webinar",
    year: "2026",
    title: "OT First MENA Webinar 2026",
    url: `${S3}/post_event_reports/Post+Event+Report+-+OT+First+MENA+Webinar+2026.pdf`,
    filename: "OT-First-MENA-Webinar-2026-Report.pdf",
    logo: `${S3}/logos/Untitled-2-01.png`,
  },
];

const buildReportDownloadUrl = (url: string, filename: string) =>
  `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;

// ─── Countdown ──────────────────────────────────────────────────────────────
function useCountdown(targetISO: string) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetISO).getTime() - Date.now();
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
  }, [targetISO]);
  return t;
}

// ─── Audience: PDF "Who Will You Meet?" - 10 roles ──────────────────────────
const AUDIENCE_ROLES = [
  "Senior government policymakers and ministries",
  "National cybersecurity authorities and regulators",
  "Heads of critical infrastructure and industrial zones",
  "CISOs, CIOs, CTOs, and CDOs",
  "Heads of OT, ICS, and industrial cybersecurity",
  "Digital transformation and innovation leaders",
  "Risk, compliance, and governance executives",
  "Energy, utilities, petrochemicals, and manufacturing leaders",
  "Technology providers, solution architects, and system integrators",
  "Consultants and strategic advisory firms",
];

// ─── By the Numbers - donut chart data ─────────────────────────────────────
// Pink brand anchor + distinct, harmonious cool accents (violet / blue / teal /
// orchid / slate) so each donut segment maps 1:1 with its legend card, reads
// clearly at a glance, and still feels premium and on-brand.
const BY_NUMBERS: { label: string; value: number; color: string }[] = [
  { label: "Delegates",                       value: 220, color: "#E8519A" }, // pink - dominant brand anchor
  { label: "Senior Industry Speakers",        value: 30,  color: "#8B5CF6" }, // violet
  { label: "Strategic Conference Sessions",   value: 15,  color: "#5B8DEF" }, // blue
  { label: "Media & Knowledge Partners",      value: 15,  color: "#18B6A6" }, // teal
  { label: "Technology Providers",            value: 10,  color: "#C45BC6" }, // orchid
  { label: "Industry Recognition Awards",     value: 5,   color: "#6E7FA0" }, // slate
];

// Pre-computed donut geometry - derived from BY_NUMBERS, never changes at runtime
// so it lives at module scope (vs. re-computing on every render of ByTheNumbers).
const BY_NUMBERS_TOTAL = BY_NUMBERS.reduce((s, item) => s + item.value, 0);
const BY_NUMBERS_RADIUS = 120;
const BY_NUMBERS_STROKE_WIDTH = 40;
const BY_NUMBERS_CIRCUMFERENCE = 2 * Math.PI * BY_NUMBERS_RADIUS;
const BY_NUMBERS_GAP_LEN = 3;
const BY_NUMBERS_SEGMENTS = (() => {
  let cumulative = 0;
  return BY_NUMBERS.map((item) => {
    const pct = item.value / BY_NUMBERS_TOTAL;
    const length = Math.max(pct * BY_NUMBERS_CIRCUMFERENCE - BY_NUMBERS_GAP_LEN, 0);
    const offset = cumulative;
    cumulative += pct * BY_NUMBERS_CIRCUMFERENCE;
    return { ...item, length, offset, pct };
  });
})();

// ─── LAZY MOUNT - defers child rendering until near viewport ───────────────
// Skips render of below-fold sections during initial hydration: no inline
// style objects, no framer-motion observer setup, no continuous animations.
// Reserves the placeholder height so scroll position stays stable.
function LazyMount({
  children,
  minHeight,
  rootMargin = "400px",
  id,
}: {
  children: React.ReactNode;
  minHeight: number | string;
  rootMargin?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible, rootMargin]);
  return (
    <div ref={ref} id={id} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : null}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────────────────
export default function OTSecurityJubail2026() {
  return (
    <div style={{ background: BG_DEEP, color: "white", overflow: "hidden", position: "relative" }}>
      <EventNavigation />
      <Hero />
      <ExecutivePerspective />
      <WhyKingdom />
      <SpeakersSection />
      <BePartOfTheMovement />
      <Evidence2026 />
      <AgendaSection />
      <Audience />
      <ByTheNumbers />
      <LazyMount minHeight={160}><PastSponsorsMarquee /></LazyMount>
      <LazyMount minHeight={620}><FromTheRoom /></LazyMount>
      <LazyMount minHeight={820}><GallerySection /></LazyMount>
      <LazyMount minHeight={1400} id="awards"><AwardsSection /></LazyMount>
      <LazyMount minHeight={760} id="register"><RegisterSection /></LazyMount>
      <LazyMount minHeight={320}><VenueSection /></LazyMount>
      <LazyMount minHeight={640} id="contact"><Contact /></LazyMount>
      <LazyMount minHeight={420}><Footer /></LazyMount>
      <RequestResourcesModal />
    </div>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const cd = useCountdown(EVENT_DATE_ISO);
  const [resourceMenuOpen, setResourceMenuOpen] = useState(false);
  const resourceMenuRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  // Click-outside + ESC closes the resources dropdown
  useEffect(() => {
    if (!resourceMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (resourceMenuRef.current && !resourceMenuRef.current.contains(e.target as Node)) {
        setResourceMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setResourceMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [resourceMenuOpen]);

  // Pause hero CSS animations + the background video when the section scrolls
  // off-screen - saves continuous compositing/decode work the user can't see.
  useEffect(() => {
    const sec = heroSectionRef.current;
    const vid = heroVideoRef.current;
    if (!sec) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        sec.classList.toggle("is-offscreen", !visible);
        if (vid) {
          if (visible) {
            void vid.play().catch(() => { /* autoplay may be blocked; ignore */ });
          } else {
            vid.pause();
          }
        }
      },
      { threshold: 0 }
    );
    obs.observe(sec);
    return () => obs.disconnect();
  }, []);

  const openRequest = (type: "Past Event Report" | "Delegate List") => {
    setResourceMenuOpen(false);
    window.dispatchEvent(new CustomEvent("otsf-jb:open-request", { detail: { type } }));
  };

  return (
    <section
      id="overview"
      ref={heroSectionRef}
      className="otsf-jb-hero-section"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: BG_DEEP,
      }}
    >
      {/* Background video */}
      <video
        ref={heroVideoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://efg-final.s3.eu-north-1.amazonaws.com/assets/OT_Jubail.png"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.55,
          zIndex: 0,
        }}
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      {/* Atmospheric overlays */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            `radial-gradient(ellipse 70% 60% at 50% 110%, ${BG_DEEP} 0%, transparent 60%),
             radial-gradient(ellipse 80% 50% at 50% -10%, ${BG_DEEP} 0%, transparent 60%),
             linear-gradient(180deg, rgba(5,8,24,0.45) 0%, rgba(5,8,24,0.35) 50%, rgba(5,8,24,0.85) 100%)`,
          zIndex: 1,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            `radial-gradient(ellipse 45% 35% at 15% 25%, ${C}18 0%, transparent 60%),
             radial-gradient(ellipse 40% 35% at 85% 80%, ${CYAN}12 0%, transparent 60%)`,
          zIndex: 1,
        }}
      />

      {/* Film grain / noise - cinematic depth */}
      <div
        aria-hidden
        className="otsf-jb-hero-grain"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          mixBlendMode: "overlay",
          pointerEvents: "none",
          zIndex: 2,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.85 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scan lines - subtle CRT/broadcast feel */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)`,
          opacity: 0.35,
          mixBlendMode: "multiply",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Corner brackets - event poster framing */}
      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />

      {/* Content */}
      <div
        className="otsf-jb-hero-content"
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: 1280,
          width: "100%",
          padding: "clamp(120px, 14vh, 180px) clamp(24px, 5vw, 64px) clamp(60px, 8vh, 100px)",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(5,8,24,0.6)",
            border: `1px solid ${C}55`,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            marginBottom: 28,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, background: C_BRIGHT, boxShadow: `0 0 12px ${C_BRIGHT}` }} />
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "white",
            }}
          >
            OT Security First · 4th Edition KSA
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(40px, 6vw, 92px)",
            letterSpacing: "-3px",
            lineHeight: 0.96,
            color: "white",
            margin: "0 auto 22px",
            maxWidth: 1100,
          }}
        >
          Protecting the systems
          <br />
          that{" "}
          <em
            style={{
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            <span className="otsf-jb-hero-tone-a">power the </span>
            <span className="otsf-jb-hero-tone-b">Kingdom.</span>
          </em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(15px, 1.3vw, 19px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.6,
            maxWidth: 720,
            margin: "0 auto 38px",
          }}
        >
          A strategic forum for operational technology leadership - convening regulators, CISOs and industrial engineers at the heart of the Kingdom&apos;s industrial corridor.
        </motion.p>

        {/* Unified info bar - date · location · countdown as one coherent strip
            so the hero reads as [headline] → [one info strip] → [action pair],
            not five competing button-pills. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.42, ease: EASE }}
          className="otsf-jb-hero-infobar"
          style={{
            display: "inline-flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 40,
            padding: "8px 6px",
            borderRadius: 16,
            background: "rgba(5,8,24,0.55)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 14px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Date */}
          <span className="otsf-jb-info-seg" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "6px 18px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14.5, fontWeight: 600, color: "white", letterSpacing: "-0.1px", whiteSpace: "nowrap" }}>27 October 2026</span>
          </span>

          <span aria-hidden className="otsf-jb-info-div" style={{ width: 1, height: 22, background: "rgba(255,255,255,0.14)" }} />

          {/* Location */}
          <span className="otsf-jb-info-seg" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "6px 18px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14.5, fontWeight: 600, color: "white", letterSpacing: "-0.1px", whiteSpace: "nowrap" }}>Jubail · Kingdom of Saudi Arabia</span>
          </span>

          <span aria-hidden className="otsf-jb-info-div" style={{ width: 1, height: 22, background: "rgba(255,255,255,0.14)" }} />

          {/* Countdown */}
          <span className="otsf-jb-info-seg" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "6px 18px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span aria-hidden className="otsf-jb-live-dot otsf-jb-starts-dot" style={{ width: 5, height: 5, borderRadius: 999 }} />
              <span className="otsf-jb-starts-text" style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>Starts in</span>
            </span>
            {[
              { label: "d", value: cd.d },
              { label: "h", value: cd.h },
              { label: "m", value: cd.m },
              { label: "s", value: cd.s },
            ].map((u) => (
              <span key={u.label} style={{ display: "inline-flex", alignItems: "baseline", gap: 2 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, letterSpacing: "-0.5px", color: "white", minWidth: 18, textAlign: "center" }}>{String(u.value).padStart(2, "0")}</span>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>{u.label}</span>
              </span>
            ))}
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}
        >
          {/* Primary CTA - Speaking & sponsorship · glassmorphism + liquid glass */}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); jbScrollTo("contact"); }}
            className="otsf-jb-glass-cta"
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 30px",
              borderRadius: 999,
              // Semi-translucent dual-tone gradient so backdrop-filter actually shows through
              background: `linear-gradient(135deg, ${C}E6 0%, ${C_BRIGHT}E6 45%, ${CYAN}E6 100%)`,
              backdropFilter: "blur(18px) saturate(180%)",
              WebkitBackdropFilter: "blur(18px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#04070C",
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.2px",
              textDecoration: "none",
              overflow: "hidden",
              isolation: "isolate",
              // Layered shadow stack - outer glow + glass insets
              boxShadow: [
                `0 22px 50px ${C}55`,
                `0 14px 32px ${CYAN}44`,
                "inset 0 2px 0 rgba(255,255,255,0.55)",      // top specular highlight
                "inset 0 -1px 0 rgba(0,0,0,0.18)",            // bottom edge depth
                "inset 0 0 22px rgba(255,255,255,0.08)",      // soft interior bloom
              ].join(", "),
              transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = [
                `0 30px 70px ${C}77`,
                `0 20px 48px ${CYAN}55`,
                "inset 0 2px 0 rgba(255,255,255,0.7)",
                "inset 0 -1px 0 rgba(0,0,0,0.18)",
                "inset 0 0 32px rgba(255,255,255,0.14)",
              ].join(", ");
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = [
                `0 22px 50px ${C}55`,
                `0 14px 32px ${CYAN}44`,
                "inset 0 2px 0 rgba(255,255,255,0.55)",
                "inset 0 -1px 0 rgba(0,0,0,0.18)",
                "inset 0 0 22px rgba(255,255,255,0.08)",
              ].join(", ");
            }}
          >
            {/* Top specular reflection - wet-glass curvature */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 999,
                background:
                  "radial-gradient(120% 80% at 30% -20%, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0.08) 35%, transparent 65%)",
                pointerEvents: "none",
                zIndex: 0,
                mixBlendMode: "overlay",
              }}
            />
            {/* Bottom subtle inner glow */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 999,
                background:
                  "radial-gradient(80% 60% at 70% 110%, rgba(255,255,255,0.18) 0%, transparent 60%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            {/* Diagonal moving sheen */}
            <span
              aria-hidden
              className="otsf-jb-glass-sheen"
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "32%",
                background:
                  "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 0,
                mixBlendMode: "overlay",
              }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>Speaking & sponsorship enquiries</span>
            <svg style={{ position: "relative", zIndex: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>

          {/* Past Event Reports - opens request resources dropdown */}
          <div ref={resourceMenuRef} style={{ position: "relative", display: "inline-block" }}>
            <button
              type="button"
              onClick={() => setResourceMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={resourceMenuOpen}
              suppressHydrationWarning
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 28px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.92)",
                fontFamily: "var(--font-display)",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "-0.2px",
                border: "1px solid rgba(255,255,255,0.14)",
                cursor: "pointer",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 6px 18px rgba(0,0,0,0.25)",
                transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s, background 0.35s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = `${C_BRIGHT}88`;
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
            >
              Past Event Reports
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: resourceMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s ease",
                  opacity: 0.8,
                }}
                aria-hidden
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {resourceMenuOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: 0,
                    minWidth: 320,
                    padding: 6,
                    borderRadius: 18,
                    background: "rgba(8, 12, 32, 0.92)",
                    border: `1px solid ${CYAN}33`,
                    backdropFilter: "blur(18px) saturate(180%)",
                    WebkitBackdropFilter: "blur(18px) saturate(180%)",
                    boxShadow: "0 22px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
                    zIndex: 30,
                  }}
                >
                  {/* Past Event Report */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openRequest("Past Event Report")}
                    className="otsf-jb-hero-menu-item"
                    suppressHydrationWarning
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "transparent",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "white",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span style={{ width: 36, height: 36, borderRadius: "50%", background: `${CYAN}22`, border: `1px solid ${CYAN}44`, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <polyline points="9 15 12 18 15 15" />
                      </svg>
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 600, color: "white", lineHeight: 1.25 }}>
                        Past Event Report
                      </span>
                      <span style={{ display: "block", marginTop: 2, fontFamily: "var(--font-outfit)", fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>
                        Request the PDF report from a past edition
                      </span>
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden>
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>

                  <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "2px 10px" }} />

                  {/* Delegate List */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openRequest("Delegate List")}
                    className="otsf-jb-hero-menu-item"
                    suppressHydrationWarning
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "transparent",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "white",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span style={{ width: 36, height: 36, borderRadius: "50%", background: `${CYAN}22`, border: `1px solid ${CYAN}44`, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 600, color: "white", lineHeight: 1.25 }}>
                        Delegate List
                      </span>
                      <span style={{ display: "block", marginTop: 2, fontFamily: "var(--font-outfit)", fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>
                        Request the confirmed attendee roster
                      </span>
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden>
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* EFG initiative badge - bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8, ease: EASE }}
        className="otsf-jb-efg-badge"
        style={{
          position: "absolute",
          bottom: 32,
          right: "clamp(20px, 4vw, 56px)",
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            textTransform: "uppercase",
            letterSpacing: "2.5px",
          }}
        >
          An Initiative By
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          decoding="async"
          src="/events-first-group_logo_alt.svg"
          alt="Events First Group logo - producers of OT Security First Jubail 2026, the Kingdom's flagship industrial cybersecurity summit"
          width={180}
          height={66}
          style={{ height: 50, width: "auto", opacity: 0.8 }}
        />
      </motion.div>

      <style jsx global>{`
        @keyframes otsfJbLivePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.55; }
        }
        .otsf-jb-live-dot {
          animation: otsfJbLivePulse 1.6s ease-in-out infinite;
        }
        @keyframes otsfJbScrollDot {
          0% { transform: translateY(0); opacity: 1; }
          70% { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }
        .otsf-jb-scroll-dot {
          animation: otsfJbScrollDot 1.8s ease-in-out infinite;
        }
        .otsf-jb-scroll-cue {
          transition: color 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .otsf-jb-scroll-cue:hover {
          color: white;
        }
        @media (prefers-reduced-motion: reduce) {
          .otsf-jb-live-dot, .otsf-jb-scroll-dot {
            animation: none;
          }
        }
        .otsf-jb-hero-grain {
          animation: otsfJbGrainShift 1.2s steps(6) infinite;
        }
        @keyframes otsfJbGrainShift {
          0%   { transform: translate(0, 0); }
          20%  { transform: translate(-1px, 1px); }
          40%  { transform: translate(1px, -1px); }
          60%  { transform: translate(-1px, -1px); }
          80%  { transform: translate(1px, 1px); }
          100% { transform: translate(0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .otsf-jb-hero-grain { animation: none; }
        }
        .otsf-jb-hero-menu-item:hover {
          background: rgba(255,255,255,0.06) !important;
        }
        /* Hero italic accent - solid colors that cross-fade pink ↔ cyan (no gradient on italic) */
        @keyframes otsfJbHeroToneA {
          0%, 100% {
            color: ${C_BRIGHT};
            text-shadow: 0 0 28px ${C}55;
          }
          50% {
            color: ${CYAN};
            text-shadow: 0 0 28px ${CYAN}55;
          }
        }
        @keyframes otsfJbHeroToneB {
          0%, 100% {
            color: ${CYAN};
            text-shadow: 0 0 28px ${CYAN}55, 0 0 60px ${CYAN}33;
          }
          50% {
            color: ${C_BRIGHT};
            text-shadow: 0 0 28px ${C}55, 0 0 60px ${C}33;
          }
        }
        .otsf-jb-hero-tone-a {
          color: ${C_BRIGHT};
          text-shadow: 0 0 28px ${C}55;
        }
        .otsf-jb-hero-tone-b {
          color: ${C_BRIGHT};
          text-shadow: 0 0 28px ${C_BRIGHT}55, 0 0 60px ${C_BRIGHT}33;
        }
        /* Starts in badge - same solid-color cross-fade approach */
        @keyframes otsfJbStartsTextSwap {
          0%, 100% { color: ${C_BRIGHT}; }
          50%      { color: ${CYAN}; }
        }
        .otsf-jb-starts-text {
          color: ${C_BRIGHT};
          /* background-clip text properties from inline style are harmless here */
          animation: otsfJbStartsTextSwap 5.5s ease-in-out infinite;
        }
        @keyframes otsfJbStartsDot {
          0%, 100% {
            background: ${C_BRIGHT};
            box-shadow: 0 0 10px ${C_BRIGHT};
          }
          50% {
            background: ${CYAN};
            box-shadow: 0 0 10px ${CYAN};
          }
        }
        .otsf-jb-starts-dot {
          animation: otsfJbLivePulse 1.6s ease-in-out infinite,
                     otsfJbStartsDot 5.5s linear infinite !important;
        }
        /* Glass CTA - diagonal sheen sweep */
        @keyframes otsfJbGlassSheen {
          0%   { left: -40%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
        .otsf-jb-glass-sheen {
          left: -40%;
          animation: otsfJbGlassSheen 4.5s ease-in-out infinite;
          animation-delay: 1.2s;
          will-change: left, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .otsf-jb-hero-tone-a,
          .otsf-jb-hero-tone-b,
          .otsf-jb-starts-text,
          .otsf-jb-glass-sheen { animation: none; }
          .otsf-jb-glass-sheen { display: none; }
          .otsf-jb-starts-dot {
            animation: none !important;
            background: ${C_BRIGHT};
            box-shadow: 0 0 10px ${C_BRIGHT};
          }
        }
        /* EFG initiative badge - shrink on mobile so it doesn't crowd the hero */
        @media (max-width: 720px) {
          .otsf-jb-efg-badge {
            bottom: 24px !important;
            gap: 4px !important;
          }
          .otsf-jb-efg-badge > span {
            font-size: 10px !important;
            letter-spacing: 1.8px !important;
          }
          .otsf-jb-efg-badge > img {
            height: 34px !important;
          }
          /* Hero content - tighten top/bottom padding on mobile to remove dead space */
          .otsf-jb-hero-content {
            padding: clamp(72px, 11vh, 110px) clamp(20px, 5vw, 64px) clamp(40px, 6vh, 70px) !important;
          }
          /* Info bar - stack date/location/countdown and drop the vertical dividers */
          .otsf-jb-hero-infobar {
            flex-direction: column !important;
            gap: 2px !important;
            padding: 10px 18px !important;
          }
          .otsf-jb-info-div { display: none !important; }
          .otsf-jb-info-seg { padding: 7px 6px !important; }
        }
        @media (max-width: 420px) {
          .otsf-jb-efg-badge > span {
            font-size: 9px !important;
            letter-spacing: 1.4px !important;
          }
          .otsf-jb-efg-badge > img {
            height: 28px !important;
          }
        }
        /* When the hero is scrolled off-screen, freeze all of its CSS animations
           so the browser doesn't keep compositing frames the user can't see. */
        .otsf-jb-hero-section.is-offscreen .otsf-jb-hero-tone-a,
        .otsf-jb-hero-section.is-offscreen .otsf-jb-hero-tone-b,
        .otsf-jb-hero-section.is-offscreen .otsf-jb-starts-text,
        .otsf-jb-hero-section.is-offscreen .otsf-jb-starts-dot,
        .otsf-jb-hero-section.is-offscreen .otsf-jb-glass-sheen,
        .otsf-jb-hero-section.is-offscreen .otsf-jb-live-dot,
        .otsf-jb-hero-section.is-offscreen .otsf-jb-scroll-dot,
        .otsf-jb-hero-section.is-offscreen .otsf-jb-hero-grain {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
}

// Corner bracket - thin cyan/magenta L-bracket frame at a viewport corner
function CornerBracket({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const offset = 22;
  const length = 28;
  const stroke = 1;
  const styleByPos: Record<typeof position, React.CSSProperties> = {
    tl: { top: offset, left: offset, borderTop: `${stroke}px solid ${C_BRIGHT}`, borderLeft: `${stroke}px solid ${C_BRIGHT}`, borderTopLeftRadius: 3 },
    tr: { top: offset, right: offset, borderTop: `${stroke}px solid ${CYAN}`,   borderRight: `${stroke}px solid ${CYAN}`,   borderTopRightRadius: 3 },
    bl: { bottom: offset, left: offset, borderBottom: `${stroke}px solid ${CYAN}`, borderLeft: `${stroke}px solid ${CYAN}`, borderBottomLeftRadius: 3 },
    br: { bottom: offset, right: offset, borderBottom: `${stroke}px solid ${C_BRIGHT}`, borderRight: `${stroke}px solid ${C_BRIGHT}`, borderBottomRightRadius: 3 },
  };
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        width: length,
        height: length,
        opacity: 0.55,
        pointerEvents: "none",
        zIndex: 3,
        ...styleByPos[position],
      }}
    />
  );
}

// ─── EXECUTIVE PERSPECTIVE ────────────────────────────────────────────────────
function ExecutivePerspective() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [videoPlaying, setVideoPlaying] = useState(false);
  const HIGHLIGHT_VIDEO_ID = "3ofcPquafgk";

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(64px, 7vw, 96px) 0", background: BG_BASE, overflow: "hidden" }}>
      <BgDots />

      {/* Ambient gradient wash */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-20%",
          right: "-15%",
          width: 720,
          height: 720,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C}10 0%, transparent 60%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CYAN}08 0%, transparent 60%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
        }}
      >
        <Eyebrow inView={inView} label="Executive Perspective" />
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(34px, 5vw, 72px)",
            letterSpacing: "-2.5px",
            lineHeight: 0.98,
            color: "white",
            margin: "0 0 56px",
            maxWidth: 1080,
          }}
        >
          Saudi Arabia&apos;s industrial transformation under{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT, whiteSpace: "nowrap", padding: "0 0.22em 0 0.04em" }}>
            Vision 2030
          </em>{" "}
          is redefining national infrastructure.
        </motion.h2>

        {/* Two-column row: prose + previous edition video */}
        <div
          className="otsf-jb-exec-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: "clamp(36px, 5vw, 72px)",
            alignItems: "start",
          }}
        >
          {/* Left - prose */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            style={{ display: "flex", flexDirection: "column", gap: 22 }}
          >
            {/* Drop cap opening - jeweled */}
            <div style={{ position: "relative" }}>
              <p style={{ ...execPara, marginTop: 0, fontSize: "clamp(18px, 1.5vw, 21px)" }}>
                <span style={{ position: "relative", float: "left", marginRight: 14, marginTop: 4, marginBottom: -4 }}>
                  {/* Glow underlay */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(56px, 6vw, 84px)",
                      fontWeight: 800,
                      lineHeight: 0.85,
                      letterSpacing: "-3px",
                      color: C_BRIGHT,
                      filter: "blur(18px)",
                      opacity: 0.35,
                      pointerEvents: "none",
                    }}
                  >
                    T
                  </span>
                  <span
                    style={{
                      position: "relative",
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(56px, 6vw, 84px)",
                      fontWeight: 800,
                      lineHeight: 0.85,
                      letterSpacing: "-3px",
                      color: C_BRIGHT,
                      display: "inline-block",
                    }}
                  >
                    T
                  </span>
                </span>
                he Kingdom&apos;s industrial landscape is undergoing one of the largest digital transformations, powered by Vision 2030, smart infrastructure investments, and the rapid rise of connected operations. Across oil &amp; gas, power &amp; utilities, petrochemicals, water &amp; waste, nuclear manufacturing, mining &amp; metals, transport &amp; logistics, smart cities, government &amp; critical infrastructure, operational technology (OT) environments are evolving into highly automated, data-driven ecosystems designed to maximize efficiency, productivity, and operational performance.
              </p>
            </div>
            <p style={execPara}>
              Yet as these systems become more intelligent and interconnected, a critical question emerges: are they becoming more resilient, or more exposed?
            </p>

          </motion.div>

          {/* Right - previous edition video bezel */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            style={{ display: "flex", flexDirection: "column", gap: 18, position: "sticky", top: 100 }}
            className="otsf-jb-exec-video-wrap"
          >
            {/* Tag */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C_BRIGHT,
                  boxShadow: `0 0 10px ${C_BRIGHT}`,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "3.2px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Previous Edition · Highlights
              </span>
            </div>

            {/* Video bezel */}
            <div
              className="otsf-jb-exec-video"
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                padding: 3,
                borderRadius: 22,
                background: `linear-gradient(135deg, ${C_BRIGHT}55, ${CYAN}38 50%, ${C_BRIGHT}30)`,
                boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 0 50px ${C}25`,
              }}
            >
              <div
                role={videoPlaying ? undefined : "button"}
                tabIndex={videoPlaying ? undefined : 0}
                aria-label={videoPlaying ? undefined : "Play OT Security First UAE highlights video"}
                onClick={() => !videoPlaying && setVideoPlaying(true)}
                onKeyDown={(e) => { if (!videoPlaying && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setVideoPlaying(true); } }}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: 19,
                  overflow: "hidden",
                  background: "rgba(7,11,31,0.92)",
                  cursor: videoPlaying ? "default" : "pointer",
                }}
              >
                {videoPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${HIGHLIGHT_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title="OT Security First UAE - Event Highlights"
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
                      src={`https://img.youtube.com/vi/${HIGHLIGHT_VIDEO_ID}/maxresdefault.jpg`}
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${HIGHLIGHT_VIDEO_ID}/hqdefault.jpg`; }}
                      alt="OT Security First UAE 2025 industrial cybersecurity summit highlights - CISOs, OT security leaders, and critical infrastructure operators on stage"
                      width={1280}
                      height={720}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {/* Glass reflection */}
                    <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${CYAN}aa, transparent)`, boxShadow: `0 0 12px ${CYAN}60`, pointerEvents: "none" }} />
                    {/* Vignette */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(7,11,31,0.18) 0%, rgba(7,11,31,0.1) 50%, rgba(7,11,31,0.6) 100%)", pointerEvents: "none" }} />
                    {/* Edition serial badge - top left */}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 12px 6px 10px",
                        background: "linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 999,
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                      }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 8px ${C_BRIGHT}` }} />
                      <span
                        style={{
                          fontFamily: "var(--font-outfit)",
                          fontSize: 9.5,
                          fontWeight: 700,
                          letterSpacing: "2.5px",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.92)",
                        }}
                      >
                        Edition · 01
                      </span>
                    </div>
                    {/* Corner ornament - bottom right */}
                    <div aria-hidden style={{ position: "absolute", bottom: 14, right: 14, width: 22, height: 22, borderBottom: `1px solid ${CYAN}`, borderRight: `1px solid ${CYAN}`, opacity: 0.7 }} />
                    <div aria-hidden style={{ position: "absolute", bottom: 18, right: 18, width: 6, height: 6, borderRadius: "50%", background: CYAN, opacity: 0.8, boxShadow: `0 0 10px ${CYAN}` }} />
                    {/* Play button */}
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                      <div className="otsf-jb-exec-play-btn" style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.96)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 12px 36px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.25), 0 0 0 8px rgba(255,255,255,0.06)`,
                        transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), background 0.3s ease",
                      }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill={C} style={{ marginLeft: 4 }}>
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                    </div>
                    {/* Footer overlay caption */}
                    <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, pointerEvents: "none" }}>
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.92)", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
                        OT Security First · UAE
                      </span>
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
                        Watch · 2:14
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Caption */}
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(15px, 1.15vw, 16.5px)",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.78)",
                margin: 0,
                maxWidth: 520,
              }}
            >
              Highlights from the most recent OT Security First flagship edition - the same dialogue platform now arriving in Jubail.
            </p>
          </motion.div>
        </div>

        {/* Bottom pull-quote strap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          style={{
            position: "relative",
            marginTop: "clamp(48px, 6vw, 80px)",
            padding: "clamp(36px, 4vw, 56px) clamp(36px, 5vw, 72px)",
            borderRadius: 24,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 55%, rgba(211,75,154,0.05) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 28px 60px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          <span aria-hidden style={topHair} />
          {/* Ghost mark */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: -30,
              left: 24,
              fontFamily: "var(--font-display)",
              fontSize: 180,
              fontWeight: 800,
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: `1px ${C}25`,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            "
          </span>
          <p
            style={{
              position: "relative",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(22px, 2.4vw, 34px)",
              letterSpacing: "-1px",
              lineHeight: 1.18,
              color: "white",
              margin: 0,
              maxWidth: 1040,
            }}
          >
            <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT, paddingRight: "0.18em" }}>OT Security First - Jubail</em>{" "}
            is a world-class, one-day strategic dialogue platform dedicated to advancing industrial cybersecurity and operational resilience across the Kingdom.
          </p>

          {/* Programme signature */}
          <div
            style={{
              position: "relative",
              marginTop: 32,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span
              aria-hidden
              style={{
                flex: "0 0 36px",
                height: 1,
                background: `linear-gradient(90deg, ${C_BRIGHT}88, transparent)`,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 11,
                fontWeight: 500,
                fontStyle: "italic",
                letterSpacing: "1px",
                color: C_BRIGHT,
                opacity: 0.85,
              }}
            >
              §
            </span>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: "3.2px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              Programme Note · Jubail · 27 October 2026
            </span>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 980px) {
          .otsf-jb-exec-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .otsf-jb-exec-video-wrap {
            position: static !important;
          }
        }
        @media (max-width: 640px) {
          .otsf-jb-exec-stats {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
        .otsf-jb-exec-video:hover .otsf-jb-exec-play-btn {
          transform: scale(1.08);
          background: ${C_BRIGHT} !important;
        }
        .otsf-jb-exec-video:hover .otsf-jb-exec-play-btn svg {
          fill: white;
        }
      `}</style>
    </section>
  );
}

// ─── WHY KINGDOM / JUBAIL ────────────────────────────────────────────────────
const WHY_BG_IMAGE = `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0811.JPG`;

function WhyKingdom() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="context"
      style={{
        position: "relative",
        padding: "clamp(64px, 7vw, 96px) 0",
        background: BG_DEEP,
        overflow: "hidden",
      }}
    >
      {/* ── Background image layer - no overlay ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${WHY_BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "blur(5px) brightness(0.92)",
          transform: "scale(1.06)",
          pointerEvents: "none",
        }}
      />
      {/* Top-only darkening - protects headline readability, leaves cards on clean photo */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "55%",
          background:
            "linear-gradient(180deg, rgba(5,8,24,0.82) 0%, rgba(5,8,24,0.55) 45%, rgba(5,8,24,0.15) 80%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <Eyebrow inView={inView} label="Why Now" tone="cyan" />

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 52px)",
            letterSpacing: "-1.6px",
            lineHeight: 1.02,
            color: "white",
            margin: "0 0 clamp(36px, 4vw, 56px)",
            maxWidth: 960,
            textShadow: "0 2px 18px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          Two converging realities define the moment for{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: CYAN }}>
            OT Security First - Jubail.
          </em>
        </motion.h2>

        <div
          className="otsf-jb-why-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(22px, 3vw, 40px)",
            alignItems: "stretch",
          }}
        >
          <WhyCard
            serial="01"
            tag="Why the Kingdom"
            headline="One of the most strategically significant industrial landscapes in the Middle East."
            bullets={[
              "Saudi Arabia accounts for a majority share of cybersecurity incidents within the MEA region.",
              "Energy remains one of the most targeted sectors regionally.",
              "ICS in the Middle East experience elevated ransomware pressure relative to global averages.",
            ]}
            inView={inView}
            delay={0.2}
          />
          <WhyCard
            serial="02"
            tag="Why Jubail"
            headline="The industrial focal point of national resilience."
            bullets={[
              "Defining industrial cyber events have already proven this risk is no longer theoretical.",
              "Jubail concentrates critical petrochemical and energy assets material to GDP and exports.",
              "Industrial density makes Jubail a strategic focal point for advancing OT cybersecurity maturity.",
            ]}
            inView={inView}
            delay={0.3}
          />
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 880px) {
          .otsf-jb-why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function WhyCard({
  serial,
  tag,
  headline,
  bullets,
  inView,
  delay,
}: {
  serial: string;
  tag: string;
  headline: string;
  bullets: string[];
  inView: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: EASE }}
      className="otsf-jb-why-card"
      style={{
        position: "relative",
        padding: 1.2,
        borderRadius: 24,
        background: `linear-gradient(160deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 22%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.18) 100%)`,
        boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 12px 30px rgba(0,0,0,0.35), 0 0 60px ${C}10`,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "clamp(24px, 2.6vw, 36px)",
          borderRadius: 22.8,
          background:
            "linear-gradient(170deg, rgba(15,20,46,0.94) 0%, rgba(10,14,34,0.97) 55%, rgba(15,20,46,0.95) 100%)",
          backdropFilter: "blur(18px) saturate(1.2)",
          WebkitBackdropFilter: "blur(18px) saturate(1.2)",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Skeuomorphic curvature - inner shadow bottom-right + light catch top-left */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 22.8,
            background:
              "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(255,255,255,0.08) 0%, transparent 55%), radial-gradient(ellipse 70% 80% at 100% 100%, rgba(0,0,0,0.35) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />

        {/* Glass reflection band - top gloss */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "38%",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Rim - brilliant top edge highlight (light source from above) */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "4%",
            right: "4%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), rgba(255,255,255,0.35), rgba(255,255,255,0.55), transparent)",
            boxShadow: "0 0 8px rgba(255,255,255,0.25)",
          }}
        />

        {/* Magenta accent shine - angled refraction streak */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            width: "30%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C_BRIGHT}aa, transparent)`,
            boxShadow: `0 0 10px ${C_BRIGHT}55`,
          }}
        />

        {/* Header - italic serial + hairline + kicker */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 500,
              fontStyle: "italic",
              letterSpacing: "-0.5px",
              color: C_BRIGHT,
              lineHeight: 1,
            }}
          >
            {serial}
          </span>
          <span
            aria-hidden
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(90deg, ${C_BRIGHT}, rgba(255,255,255,0.06) 70%, transparent)`,
            }}
          />
        </div>

        {/* Topic headline - the dominant title */}
        <h3
          className="otsf-jb-why-title"
          style={{
            position: "relative",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 800,
            letterSpacing: "-1.2px",
            color: "white",
            lineHeight: 1.02,
            margin: "0 0 14px",
            textShadow: "0 2px 14px rgba(0,0,0,0.45)",
          }}
        >
          {tag}
        </h3>

        {/* Supporting sub-headline */}
        <p
          style={{
            position: "relative",
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(15px, 1.35vw, 17.5px)",
            fontWeight: 500,
            letterSpacing: "-0.2px",
            color: "rgba(255,255,255,0.82)",
            lineHeight: 1.42,
            margin: "0 0 22px",
          }}
        >
          {headline}
        </p>

        {/* Compact numbered list */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", flex: 1 }}>
          {bullets.map((b, i) => (
            <li
              key={i}
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "24px 1fr",
                gap: 12,
                padding: "12px 0",
                borderTop: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 12,
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: C_BRIGHT,
                  opacity: 0.85,
                  paddingTop: 1,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13.5,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.55,
                  letterSpacing: "-0.1px",
                }}
              >
                {b}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ─── AUDIENCE ───────────────────────────────────────────────────────────────
function Audience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="audience" style={{ position: "relative", padding: "clamp(64px, 7vw, 96px) 0", background: BG_BASE, overflow: "hidden" }}>
      <BgDots opacity={0.04} />

      {/* Ambient washes */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "20%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C}0a 0%, transparent 60%)`,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "10%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CYAN}0a 0%, transparent 60%)`,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <Eyebrow inView={inView} label="Who This Forum Is Designed For" tone="cyan" />

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(30px, 4.4vw, 56px)",
            letterSpacing: "-2px",
            lineHeight: 1.02,
            color: "white",
            margin: "0 0 28px",
            maxWidth: 940,
          }}
        >
          A curated room of{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: CYAN }}>
            decision-makers
          </em>{" "}
          who influence industrial resilience.
        </motion.h2>

        {/* PDF "Who Will You Meet?" - 10 roles, 2-col editorial grid */}
        <div
          className="otsf-jb-audience-roles"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "clamp(28px, 3.5vw, 56px)",
            rowGap: 0,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {AUDIENCE_ROLES.map((role, i) => {
            const serial = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={role}
                className="otsf-jb-role-row"
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.18 + i * 0.05, ease: EASE }}
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  alignItems: "center",
                  gap: 18,
                  padding: "20px 4px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Magenta hairline rail (left) - grows on hover */}
                <span
                  aria-hidden
                  className="otsf-jb-role-rail"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: -2,
                    width: 2,
                    height: 0,
                    transform: "translateY(-50%)",
                    background: `linear-gradient(180deg, ${C_BRIGHT}, ${CYAN})`,
                    boxShadow: `0 0 10px ${C_BRIGHT}55`,
                    transition: "height 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
                {/* Italic Roman-style serial */}
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(18px, 1.7vw, 22px)",
                    fontWeight: 500,
                    fontStyle: "italic",
                    letterSpacing: "-0.6px",
                    color: C_BRIGHT,
                    lineHeight: 1,
                    minWidth: 36,
                  }}
                >
                  {serial}
                </span>
                {/* Role label */}
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(15.5px, 1.4vw, 19px)",
                    fontWeight: 500,
                    letterSpacing: "-0.4px",
                    color: "rgba(255,255,255,0.88)",
                    lineHeight: 1.32,
                  }}
                >
                  {role}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .otsf-jb-role-row:hover .otsf-jb-role-rail {
          height: 80% !important;
        }
        @media (max-width: 720px) {
          .otsf-jb-audience-roles {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── BY THE NUMBERS - donut chart ─────────────────────────────────────────
function ByTheNumbers() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [mounted, setMounted] = useState(false);

  // Donut geometry lives at module scope - see BY_NUMBERS_SEGMENTS above
  const total = BY_NUMBERS_TOTAL;
  const radius = BY_NUMBERS_RADIUS;
  const strokeWidth = BY_NUMBERS_STROKE_WIDTH;
  const circumference = BY_NUMBERS_CIRCUMFERENCE;
  const segments = BY_NUMBERS_SEGMENTS;

  useEffect(() => { setMounted(true); }, []);

  // GSAP entrance: donut + legend cards fade in from the LEFT, scroll-triggered
  useEffect(() => {
    if (!mounted || typeof window === "undefined" || !ref.current) return;
    const ctx = gsap.context(() => {
      const donut = ref.current?.querySelector<HTMLElement>(".otsf-jb-numbers-donut");
      const cards = ref.current?.querySelectorAll<HTMLElement>(".otsf-jb-numbers-legend > div");
      if (!donut || !cards) return;

      // Set initial state immediately so nothing flashes in place before ScrollTrigger fires.
      // Large negative x so the slide reads clearly, not as a subtle nudge.
      gsap.set(donut, { opacity: 0, x: -360 });
      gsap.set(cards, { opacity: 0, x: -260 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      tl.to(donut, { opacity: 1, x: 0, duration: 1.1, ease: "power3.out" })
        .to(
          cards,
          { opacity: 1, x: 0, duration: 0.75, ease: "power3.out", stagger: 0.12 },
          "-=0.7",
        );
    }, ref);
    return () => ctx.revert();
  }, [mounted]);

  return (
    <section
      ref={ref}
      id="numbers"
      style={{
        position: "relative",
        padding: "clamp(64px, 7vw, 96px) 0",
        background: BG_DEEP,
        overflow: "hidden",
      }}
    >
      <BgDots opacity={0.04} />

      {/* Ambient washes */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "15%",
          right: "-12%",
          width: 620,
          height: 620,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C}10 0%, transparent 60%)`,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "5%",
          left: "-10%",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CYAN}0c 0%, transparent 60%)`,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <Eyebrow inView={inView} label="OT First KSA · By the Numbers" />

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(30px, 4.4vw, 56px)",
            letterSpacing: "-2px",
            lineHeight: 1.02,
            color: "white",
            margin: "0 0 clamp(32px, 4vw, 52px)",
            maxWidth: 940,
          }}
        >
          The room in{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>numbers</em>.
        </motion.h2>

        <div
          className="otsf-jb-numbers-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 380px) 1fr",
            gap: "clamp(40px, 5vw, 80px)",
            alignItems: "center",
          }}
        >
          {/* LEFT - Donut (GSAP fades in from the left, see useEffect above) */}
          <motion.div
            className="otsf-jb-numbers-donut"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 380,
              aspectRatio: "1 / 1",
              margin: "0 auto",
            }}
          >
            <svg
              viewBox="0 0 320 320"
              width="100%"
              height="100%"
              style={{ display: "block", transform: "rotate(-90deg)" }}
            >
              {/* Faint background ring */}
              <circle
                cx={160}
                cy={160}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={strokeWidth}
              />
              {/* Segments */}
              {segments.map((seg, i) => (
                <circle
                  key={seg.label}
                  cx={160}
                  cy={160}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${seg.length} ${circumference - seg.length}`}
                  strokeDashoffset={-seg.offset}
                  strokeLinecap="butt"
                  style={{
                    transition: `stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.08}s`,
                    filter: `drop-shadow(0 0 6px ${seg.color}55)`,
                  }}
                />
              ))}
            </svg>

            {/* Center label */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(40px, 5vw, 64px)",
                  letterSpacing: "-2px",
                  lineHeight: 1,
                  color: C_BRIGHT,
                }}
              >
                {total}+
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                In the Room
              </div>
            </div>
          </motion.div>

          {/* RIGHT - Legend */}
          <div
            className="otsf-jb-numbers-legend"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(16px, 1.6vw, 22px)",
            }}
          >
            {segments.map((seg) => (
              <motion.div
                key={seg.label}
                style={{
                  position: "relative",
                  padding: "20px 18px 18px 18px",
                  borderRadius: 12,
                  background: `linear-gradient(180deg, ${seg.color}0d 0%, rgba(255,255,255,0.01) 100%)`,
                  border: `1px solid ${seg.color}33`,
                  overflow: "hidden",
                }}
              >
                {/* Top color bar - full-width identification stripe */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: seg.color,
                    boxShadow: `0 0 14px ${seg.color}99`,
                  }}
                />
                {/* Color dot + value row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {/* Color dot - primary visual link to donut segment */}
                  <span
                    aria-hidden
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: seg.color,
                      boxShadow: `0 0 10px ${seg.color}aa, inset 0 0 0 1px rgba(255,255,255,0.18)`,
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 4,
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      color: "white",
                      letterSpacing: "-1.5px",
                      lineHeight: 1,
                    }}
                  >
                    <span style={{ fontSize: "clamp(30px, 3vw, 42px)" }}>{seg.value}</span>
                    <span style={{ fontSize: "clamp(18px, 1.6vw, 24px)", color: seg.color }}>+</span>
                  </div>
                </div>
                {/* Label */}
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "var(--font-outfit)",
                    fontSize: "clamp(12px, 0.95vw, 13.5px)",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    color: "rgba(255,255,255,0.78)",
                    lineHeight: 1.35,
                  }}
                >
                  {seg.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 880px) {
          .otsf-jb-numbers-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(28px, 5vw, 40px) !important;
          }
        }
        @media (max-width: 540px) {
          .otsf-jb-numbers-legend {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 10px !important;
          }
          .otsf-jb-numbers-legend > div {
            padding: 14px 10px 12px 12px !important;
          }
          /* Value row (color dot + number) - first div child */
          .otsf-jb-numbers-legend > div > div:nth-of-type(1) > div > span:first-child {
            font-size: 22px !important;
            letter-spacing: -1px !important;
          }
          .otsf-jb-numbers-legend > div > div:nth-of-type(1) > div > span:last-child {
            font-size: 14px !important;
          }
          /* Label - second div child */
          .otsf-jb-numbers-legend > div > div:nth-of-type(2) {
            font-size: 10.5px !important;
            margin-top: 8px !important;
            line-height: 1.3 !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── 2026 EVIDENCE ───────────────────────────────────────────────────────────
// Public-facing market evidence: each item carries its cited source.
// Ordered by text density for the bento layout (longest = hero, top → bottom).
type EvidenceItem = { fact: string; source: string; size: "xl" | "wide" | "sm" };
const EVIDENCE_2026: EvidenceItem[] = [
  {
    fact: "Vendor land-grab: Darktrace first Saudi office (Jan 2026); OPSWAT Riyadh office, 4x KSA growth; Yokogawa AI/Cyber CoE Dhahran (Feb 2026); Siemens KSA software office (Feb 2026); Dragos Riyadh HQ + UAE CoE; Nozomi acquired by Mitsubishi",
    source: "Vendor PRs, 2025-26",
    size: "xl",
  },
  {
    fact: "Dragos Y/R 2026: industrial ransomware +49% YoY (~3,300 victims); PYROXENE wipes vs ME infrastructure Jun 2025; BAUXITE (CyberAv3ngers-linked) hit ME oil & gas, water, chemicals",
    source: "Dragos, Feb 2026",
    size: "wide",
  },
  {
    fact: "ADIPEC Abu Dhabi 2-5 Nov (six days after us); GISEC moved to 21-23 Sep; Black Hat MEA 1-3 Dec; Intersec Saudi 16-18 Nov; OT Security First Singapore 8-9 Oct. 27 Oct is clean in KSA",
    source: "Official event sites, 2026",
    size: "wide",
  },
  {
    fact: "RC/JY cities passed SAR 1.5T cumulative investment; Amiral $11bn Jubail cracker (ops 2027); 45+ Jubail turnarounds in 2026",
    source: "SPA / Arab News May 2026; TotalEnergies",
    size: "wide",
  },
  {
    fact: "MEA OT security market $4.36bn (2025) growing to $9.65bn (2030), 17.2% CAGR; energy fastest vertical",
    source: "MarketsandMarkets, 2025",
    size: "wide",
  },
  {
    fact: "SACS-210 (Feb 2026) adds a dedicated OT controls section; transition window closed 26 Aug 2026",
    source: "4S Co. / NHR, Mar 2026",
    size: "sm",
  },
  {
    fact: "50% of OT organisations had at least one intrusion in the last year",
    source: "Fortinet, Jul 2025",
    size: "sm",
  },
  {
    fact: "ECC-2:2024 requires cybersecurity roles to be held by Saudi nationals",
    source: "Clyde & Co, Jan 2025",
    size: "sm",
  },
  {
    fact: "Electric (~$1B, Feb 2026); Claroty $150M Series F",
    source: "Official event sites, 2026",
    size: "sm",
  },
];

function Evidence2026() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="evidence"
      style={{
        position: "relative",
        padding: "clamp(64px, 7vw, 96px) 0",
        background: BG_BASE,
        overflow: "hidden",
      }}
    >
      <BgDots opacity={0.04} />

      {/* Ambient wash */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "8%",
          left: "-10%",
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C}10 0%, transparent 60%)`,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <Eyebrow inView={inView} label="The 2026 Evidence" />

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(30px, 4.4vw, 56px)",
            letterSpacing: "-2px",
            lineHeight: 1.02,
            color: "white",
            margin: "0 0 clamp(32px, 4vw, 52px)",
            maxWidth: 940,
          }}
        >
          The proof behind the{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>agenda</em>.
        </motion.h2>

        <div className="otsf-jb-evidence-grid">
          {EVIDENCE_2026.map((item, i) => (
            <motion.article
              key={item.source + i}
              className={`otsf-jb-ev-card otsf-jb-ev-${item.size}`}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: EASE }}
              whileHover={{ y: -6, transition: { duration: 0.4, ease: EASE } }}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                minHeight: 150,
                padding: item.size === "xl" ? "32px 30px 26px" : "27px 24px 22px",
                borderRadius: 16,
                background:
                  "linear-gradient(168deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 44%, rgba(255,255,255,0.006) 100%)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px -28px rgba(0,0,0,0.85)",
                overflow: "hidden",
                isolation: "isolate",
              }}
            >
              {/* Unified gradient top rail */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, ${C} 0%, ${CYAN} 100%)`,
                }}
              />
              {/* Specular hairline */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 2,
                  left: "8%",
                  right: "8%",
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
                }}
              />
              {/* Top-left accent glow */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: -50,
                  left: -50,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${C}26 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />
              {/* Bottom-right accent glow - fills negative space */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: -60,
                  right: -60,
                  width: 170,
                  height: 170,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${CYAN}14 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />
              {/* Sheen sweep (hover) */}
              <span aria-hidden className="otsf-jb-ev-sheen" />
              {/* Corner brackets */}
              <span aria-hidden className="otsf-jb-ev-br otsf-jb-ev-br-tl" />
              <span aria-hidden className="otsf-jb-ev-br otsf-jb-ev-br-br" />

              {/* Fact */}
              <p
                style={{
                  margin: 0,
                  flex: 1,
                  position: "relative",
                  zIndex: 2,
                  fontFamily: "var(--font-outfit)",
                  fontSize:
                    item.size === "xl"
                      ? "clamp(16px, 1.45vw, 19px)"
                      : "clamp(14px, 1.05vw, 15.5px)",
                  fontWeight: item.size === "xl" ? 600 : 500,
                  lineHeight: item.size === "xl" ? 1.5 : 1.58,
                  color: item.size === "xl" ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.9)",
                  letterSpacing: "0.01em",
                }}
              >
                {item.fact}
              </p>

              {/* Source footer - pinned, consistent across all cards */}
              <div
                style={{
                  marginTop: 20,
                  paddingTop: 14,
                  position: "relative",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: C,
                    boxShadow: `0 0 9px ${C}cc`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                    flexShrink: 0,
                  }}
                >
                  Source
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: "clamp(11.5px, 0.9vw, 12.5px)",
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    color: C_BRIGHT,
                    lineHeight: 1.35,
                  }}
                >
                  {item.source}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        /* Bento grid - tile size tracks text density */
        .otsf-jb-evidence-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: minmax(168px, auto);
          grid-auto-flow: row dense;
          gap: clamp(14px, 1.4vw, 20px);
        }
        .otsf-jb-ev-xl {
          grid-column: span 2;
          grid-row: span 2;
        }
        .otsf-jb-ev-wide {
          grid-column: span 2;
        }
        .otsf-jb-ev-sm {
          grid-column: span 1;
        }
        /* Tablet - collapse to 2 columns */
        @media (max-width: 1080px) {
          .otsf-jb-evidence-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .otsf-jb-ev-xl {
            grid-column: span 2;
            grid-row: span 1;
          }
          .otsf-jb-ev-wide {
            grid-column: span 2;
          }
          .otsf-jb-ev-sm {
            grid-column: span 1;
          }
        }
        .otsf-jb-ev-card {
          transition: border-color 0.55s ease, box-shadow 0.55s ease;
        }
        .otsf-jb-ev-card:hover {
          border-color: rgba(211, 75, 154, 0.5) !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09),
            0 30px 60px -30px rgba(211, 75, 154, 0.5),
            0 0 0 1px rgba(211, 75, 154, 0.14) !important;
        }
        /* Sheen sweep */
        .otsf-jb-ev-sheen {
          position: absolute;
          top: 0;
          left: -65%;
          width: 55%;
          height: 100%;
          background: linear-gradient(
            105deg,
            transparent,
            rgba(255, 255, 255, 0.07),
            transparent
          );
          transform: skewX(-18deg);
          pointer-events: none;
          z-index: 1;
          transition: left 0.9s ease;
        }
        .otsf-jb-ev-card:hover .otsf-jb-ev-sheen {
          left: 135%;
        }
        /* Corner brackets */
        .otsf-jb-ev-br {
          position: absolute;
          width: 16px;
          height: 16px;
          opacity: 0;
          z-index: 3;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }
        .otsf-jb-ev-br-tl {
          top: 11px;
          left: 11px;
          border-top: 1.5px solid #d34b9a;
          border-left: 1.5px solid #d34b9a;
        }
        .otsf-jb-ev-br-br {
          bottom: 11px;
          right: 11px;
          border-bottom: 1.5px solid #f0529e;
          border-right: 1.5px solid #f0529e;
        }
        .otsf-jb-ev-card:hover .otsf-jb-ev-br {
          opacity: 0.85;
        }
        @media (max-width: 600px) {
          .otsf-jb-evidence-grid {
            grid-template-columns: 1fr;
            grid-auto-rows: auto;
          }
          .otsf-jb-ev-xl,
          .otsf-jb-ev-wide,
          .otsf-jb-ev-sm {
            grid-column: span 1;
            grid-row: span 1;
          }
        }
      `}</style>
    </section>
  );
}

// ─── AGENDA ──────────────────────────────────────────────────────────────────
// Verbatim conference schedule (source: Jubail agenda doc). Do not alter copy.
type AgendaRow = { time: string; type: string; title: string; desc: string };
type AgendaBreak = { kind: "break"; time: string; label: string; desc?: string };
type AgendaSession = { kind: "session"; serial: string; title: string; time: string; rows: AgendaRow[] };
const AGENDA_BLOCKS: (AgendaBreak | AgendaSession)[] = [
  { kind: "break", time: "08:30", label: "Registration", desc: "Delegate registration, welcome coffee" },
  {
    kind: "session",
    serial: "01",
    title: "The Regulatory Imperative — Governing OT Security in the Kingdom",
    time: "09:00 – 10:15",
    rows: [
      {
        time: "09:00 – 9:10",
        type: "Ministerial Keynote",
        title: "Opening address: Saudi Arabia's national OT security mandate — Vision 2030",
        desc: "The government's strategic direction for securing critical national infrastructure, what the mandate requires, what it signals, and what industry must do now.",
      },
      {
        time: "09:10 – 9:20",
        type: "Keynote",
        title: "Compliance is the floor, not the ceiling: How Saudi Arabia's oil & gas sector is implementing the government mandates on OT Security?",
        desc: "A major national oil company shares its OTCC compliance journey — asset inventory, risk assessment, network segmentation, and building an OT-aware security operations capability.",
      },
      {
        time: "09:20 – 10:00",
        type: "Panel Discussion",
        title: "GCC & Global Collaboration on OT Security. What Are the World's Leading Industrial Nations Doing and What Can Saudi Arabia Learn?",
        desc: "Cyberthreats do not respect borders. This panel brings together OT security leaders from across the GCC and beyond to share how their nations, regulators, and critical infrastructure operators are responding to the same industrial cyber threats — and how cross-border intelligence sharing, joint frameworks, and bilateral agreements can strengthen Saudi Arabia's industrial resilience.",
      },
    ],
  },
  { kind: "break", time: "10:00 – 10:45", label: "Networking Break / VIP Exhibition tour" },
  {
    kind: "session",
    serial: "02",
    title: "The Threat Landscape — What Is Coming for Saudi Arabia's Industrial Sector",
    time: "10:45 – 11:45",
    rows: [
      {
        time: "10:45 – 10:55",
        type: "Keynote",
        title: "State of the threat: Nation-state actors, ransomware, and the targeting of Gulf critical infrastructure in 2026",
        desc: "An authoritative intelligence-led assessment of the cyber threat environment facing Saudi Arabia's oil & gas, petrochemical, and energy sectors — and how the Kingdom is responding at a national level.",
      },
      {
        time: "10:55 – 11:05",
        type: "Keynote",
        title: "IT/OT convergence: How digital transformation is expanding the attack surface across petrochemical operations",
        desc: "How the integration of enterprise IT and industrial OT is creating new vulnerability pathways — and what network segmentation, zero-trust, and unidirectional gateways offer as countermeasures.",
      },
      {
        time: "11:05 – 11:45",
        type: "Panel Discussion",
        title: "Under attack: Incident response, threat detection, and OT resilience across Jubail's industrial corridor",
        desc: "Oil & gas and petrochemical operators discuss real-world incident response experiences, detection capability gaps, and building OT resilience in one of the world's most strategically important industrial zones.",
      },
    ],
  },
  {
    kind: "session",
    serial: "03",
    title: "Securing the Infrastructure — Technology, Standards & Operational Practice",
    time: "11:45 – 12:45",
    rows: [
      {
        time: "11:45 – 11:55",
        type: "Keynote",
        title: "Securing SCADA, PLCs & ICS in legacy and greenfield environments: A practical framework for Jubail's operators",
        desc: "How to build a defensible OT architecture — asset visibility, vulnerability management, patch strategies for legacy systems, and IEC 62443 alignment in an oil & gas context.",
      },
      {
        time: "11:55 – 12:05",
        type: "Keynote",
        title: "Building an OT security operations capability: Lessons from Saudi Arabia's most critical facilities",
        desc: "What a fit-for-purpose OT SOC looks like — detection engineering for industrial protocols, threat hunting in ICS environments, and integrating OT visibility into a national security operations programme.",
      },
      {
        time: "12:05 – 12:45",
        type: "Panel Discussion",
        title: "Standards, procurement & supply chain: How do we build OT security into the fabric of Saudi industrial operations?",
        desc: "Operators, government bodies, and procurement leaders discuss enforcing OT security standards through vendor contracts, integrating IEC 62443 into capital project delivery, and holding the supply chain accountable",
      },
    ],
  },
  { kind: "break", time: "12:45 – 14:00", label: "Networking Luncheon" },
  {
    kind: "session",
    serial: "04",
    title: "The Road Ahead — Innovation, Collaboration & the Future of OT Security",
    time: "14:00 – 15:30",
    rows: [
      {
        time: "14:00 – 14:15",
        type: "Keynote",
        title: "AI, digital twins & predictive security: The next frontier of OT protection for Saudi Arabia's industrial sector",
        desc: "How AI-driven anomaly detection, digital twin-based threat simulation, and predictive analytics are being deployed in oil & gas and petrochemical environments — and what the Kingdom's operators need to do to stay ahead.",
      },
      {
        time: "14:15 – 14:30",
        type: "Closing Keynote",
        title: "A national call to action: Government, industry, and the shared responsibility of securing the Kingdom's OT future",
        desc: "Senior ministry or government figure delivers closing remarks — framing the collective obligation of operators, regulators, and the private sector to advance OT security resilience across Saudi Arabia's most critical industries.",
      },
      {
        time: "14:30 – 15:15",
        type: "Panel Discussion",
        title: "The Jubail Dialogue: What must Saudi Arabia's oil & gas, petrochemical, and government sectors commit to in the next 12 months?",
        desc: "A high-level closing panel bringing together the day's key voices to agree on priorities, actions, and commitments that will define OT security progress across the Kingdom's industrial heartland.",
      },
    ],
  },
  { kind: "break", time: "15:15 – 15:30", label: "Official Close", desc: "Networking" },
];

function AgendaTypeTag({ type }: { type: string }) {
  const isPanel = type.toLowerCase().includes("panel");
  const accent = isPanel ? CYAN : C_BRIGHT;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-outfit)",
        fontSize: 9.5,
        fontWeight: 700,
        letterSpacing: "1.4px",
        textTransform: "uppercase",
        color: accent,
        background: `${accent}10`,
        border: `1px solid ${accent}33`,
        borderRadius: 100,
        padding: "4px 11px",
        lineHeight: 1.3,
        whiteSpace: "nowrap",
      }}
    >
      {type}
    </span>
  );
}

function AgendaBlock({ block }: { block: AgendaBreak | AgendaSession }) {
  if (block.kind === "break") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "15px clamp(22px, 2.4vw, 30px)",
          borderRadius: 14,
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: `${C_BRIGHT}99`, flexShrink: 0 }} />
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 14.5,
            fontWeight: 800,
            color: "#fff",
            background: `linear-gradient(135deg, ${C}40, ${C}22)`,
            border: `1px solid ${C}59`,
            borderRadius: 9,
            padding: "7px 14px",
            letterSpacing: "0.3px",
            whiteSpace: "nowrap",
            boxShadow: `0 2px 10px ${C}1f`,
          }}
        >
          {block.time}
        </span>
        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>
          {block.label}
          {block.desc ? <span style={{ color: "rgba(255,255,255,0.38)" }}>{" · "}{block.desc}</span> : null}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 22,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
      }}
    >
      {/* Session header */}
      <div style={{ padding: "26px clamp(26px, 2.8vw, 36px) 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 11 }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10.5, fontWeight: 700, letterSpacing: "2.6px", color: C_BRIGHT, textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Session {block.serial}
          </span>
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 700,
              color: C_BRIGHT,
              background: `${C}1c`,
              border: `1px solid ${C}40`,
              borderRadius: 8,
              padding: "6px 13px",
              letterSpacing: "0.3px",
              whiteSpace: "nowrap",
            }}
          >
            {block.time}
          </span>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(17px, 1.6vw, 20px)", fontWeight: 700, color: "white", lineHeight: 1.28, letterSpacing: "-0.4px", margin: 0 }}>
          {block.title}
        </h3>
      </div>

      <span aria-hidden style={{ display: "block", height: 1, margin: "0 clamp(26px, 2.8vw, 36px)", background: "rgba(255,255,255,0.08)" }} />

      {/* Rows */}
      <div>
        {block.rows.map((row, ri) => (
          <div
            key={ri}
            style={{
              padding: "24px clamp(26px, 2.8vw, 36px)",
              borderTop: ri === 0 ? "none" : "1px solid rgba(255,255,255,0.055)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#fff",
                  background: `linear-gradient(135deg, ${C}40, ${C}22)`,
                  border: `1px solid ${C}59`,
                  borderRadius: 9,
                  padding: "7px 14px",
                  letterSpacing: "0.3px",
                  whiteSpace: "nowrap",
                  boxShadow: `0 2px 10px ${C}1f`,
                }}
              >
                {row.time}
              </span>
              <AgendaTypeTag type={row.type} />
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px, 1.3vw, 16.5px)", fontWeight: 600, color: "rgba(255,255,255,0.95)", lineHeight: 1.42, letterSpacing: "-0.2px", margin: "0 0 8px" }}>
              {row.title}
            </p>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.58)", lineHeight: 1.68, margin: 0, maxWidth: 620 }}>
              {row.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgendaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const columns = [AGENDA_BLOCKS.slice(0, 4), AGENDA_BLOCKS.slice(4)];
  return (
    <section ref={ref} id="agenda" style={{ position: "relative", padding: "clamp(64px, 7vw, 100px) 0", background: BG_DEEP }}>
      <BgDots opacity={0.04} />
      <div style={{ position: "relative", maxWidth: 1440, margin: "0 auto", padding: "0 clamp(20px, 3vw, 44px)" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 4.5vw, 60px)" }}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "4.5px",
              textTransform: "uppercase",
              color: C_BRIGHT,
              marginBottom: 18,
            }}
          >
            Agenda
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(34px, 5vw, 64px)",
              letterSpacing: "-2.2px",
              lineHeight: 0.98,
              color: "white",
              margin: "0 0 16px",
            }}
          >
            Conference{" "}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>agenda.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.5px",
              color: "rgba(255,255,255,0.6)",
              margin: 0,
            }}
          >
            27 October 2026 &nbsp;·&nbsp; Jubail, Saudi Arabia &nbsp;·&nbsp; 09:00 – 15:30
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.24, ease: EASE }}
          className="otsf-jb-ag-cols"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px, 3vw, 44px)", alignItems: "start" }}
        >
          {columns.map((col, ci) => (
            <div key={ci} style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 1.8vw, 22px)" }}>
              {col.map((block, bi) => (
                <AgendaBlock key={`${ci}-${bi}`} block={block} />
              ))}
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.34, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12.5,
            fontWeight: 500,
            color: "rgba(255,255,255,0.38)",
            textAlign: "center",
            margin: "clamp(34px, 4vw, 48px) 0 0",
          }}
        >
          OT Security First Jubail · 27 October 2026 · Jubail, Saudi Arabia ·{" "}
          <span style={{ color: `${C_BRIGHT}bb` }}>Agenda is subject to change</span>
        </motion.p>
      </div>

      <style jsx global>{`
        @media (max-width: 940px) {
          .otsf-jb-ag-cols {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── CONTACT CARD (shared) ──────────────────────────────────────────────────
function ContactCard({
  delay,
  tone,
  eyebrow,
  name,
  role,
  photo,
  email,
  whatsapp,
  inView,
  photoPos,
  photoTransform,
}: {
  delay: number;
  tone: "pink" | "cyan";
  eyebrow: string;
  name: string;
  role: string;
  photo: string;
  email: string;
  whatsapp: string;
  inView: boolean;
  photoPos?: string;
  photoTransform?: string;
}) {
  const accent = tone === "pink" ? C_BRIGHT : CYAN;
  const accentDeep = tone === "pink" ? C : C;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: EASE }}
      className="otsf-jb-contact-card"
      style={{
        position: "relative",
        borderRadius: 22,
        border: `1.5px solid ${accentDeep}66`,
        background:
          "linear-gradient(180deg, rgba(15,20,46,0.85) 0%, rgba(8,12,28,0.96) 100%)",
        boxShadow: `0 28px 60px ${accentDeep}30, 0 0 50px ${accent}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Floating pill — top-left over photo */}
      <span
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          zIndex: 3,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px 8px 12px",
          borderRadius: 999,
          background: "rgba(8, 12, 28, 0.78)",
          border: `1px solid ${accent}66`,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          fontFamily: "var(--font-outfit)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: accent,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 8px ${accent}`,
          }}
        />
        {eyebrow}
      </span>

      {/* Portrait area — photo-led top */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={`${name}, ${role} at Events First Group - contact for OT Security First Jubail 2026 industrial cybersecurity summit`}
          width={420}
          height={560}
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: photoPos || "center 18%",
            transform: photoTransform || undefined,
          }}
        />
        {/* Soft fade into the card body so name overlays read clean */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "45%",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(8,12,28,0.65) 55%, rgba(8,12,28,0.98) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Name + role band (negative margin lifts it onto the photo fade) */}
      <div
        style={{
          position: "relative",
          marginTop: -84,
          padding: "0 22px 18px",
          zIndex: 2,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(22px, 2vw, 28px)",
            fontWeight: 800,
            letterSpacing: "-1px",
            color: "white",
            margin: 0,
            lineHeight: 1.1,
            textShadow: "0 2px 14px rgba(0,0,0,0.85)",
          }}
        >
          {name}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 16,
              height: 1.5,
              background: accent,
              boxShadow: `0 0 8px ${accent}`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255,255,255,0.72)",
              letterSpacing: "0.2px",
            }}
          >
            {role}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        aria-hidden
        style={{
          height: 1,
          margin: "0 22px",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
        }}
      />

      {/* Bottom strip — email + WhatsApp orb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 22px 20px",
        }}
      >
        <a
          href={`mailto:${email}`}
          className="otsf-jb-contact-pill"
          style={{
            flex: 1,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            color: "rgba(255,255,255,0.78)",
            textDecoration: "none",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accent}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            style={{ flexShrink: 0 }}
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7L12 13 2 7" />
          </svg>
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email}
          </span>
        </a>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="otsf-jb-contact-orb"
          style={{
            flexShrink: 0,
            width: 42,
            height: 42,
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: `radial-gradient(circle at 30% 25%, ${accent}, ${accentDeep})`,
            border: `1px solid ${accent}cc`,
            boxShadow: `0 0 20px ${accent}66, inset 0 1.5px 0 rgba(255,255,255,0.3), inset 0 -3px 6px rgba(0,0,0,0.25)`,
            color: "white",
            textDecoration: "none",
            transition:
              "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
            style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.45))" }}
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}

// ─── CONTACT ────────────────────────────────────────────────────────────────
function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="register-interest" style={{ position: "relative", padding: "clamp(64px, 7vw, 96px) 0", background: BG_DEEP }}>
      <BgDots opacity={0.04} />
      {/* Soft gradient spotlight */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            `radial-gradient(ellipse 55% 50% at 50% 0%, ${C}12 0%, transparent 65%),
             radial-gradient(ellipse 40% 50% at 80% 100%, ${CYAN}07 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <Eyebrow inView={inView} label="Agenda Advisory & Speaking Opportunities" tone="cyan" />

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(34px, 5vw, 64px)",
            letterSpacing: "-2.2px",
            lineHeight: 0.98,
            color: "white",
            margin: "0 0 56px",
            maxWidth: 880,
          }}
        >
          Shape the conversation -{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: CYAN }}>
            start it here.
          </em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.18, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1.1vw, 16px)",
            fontWeight: 400,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.78)",
            margin: "-32px auto 44px",
            textAlign: "center",
            maxWidth: 680,
          }}
        >
          Real people, ready to help you with speaking and sponsorship enquiries.
        </motion.p>

        <div className="otsf-jb-contact-split" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(20px, 2.4vw, 32px)",
          alignItems: "stretch",
        }}>
          <ContactCard
            delay={0.2}
            tone="pink"
            eyebrow="Speaking"
            name="Anna Firdouse Shah"
            role="Senior Conference Producer"
            photo="https://efg-final.s3.eu-north-1.amazonaws.com/team/anna+blur+bg.png"
            photoPos="center center"
            photoTransform="scale(1.4) translateX(-12%)"
            email="anna@eventsfirstgroup.com"
            whatsapp="https://wa.me/971545714377"
            inView={inView}
          />
          <ContactCard
            delay={0.32}
            tone="cyan"
            eyebrow="Sponsorship"
            name="Mohammed Hassan"
            role="Partnership Manager"
            photo="https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/hassan.jpg"
            email="hassan@eventsfirstgroup.com"
            whatsapp="https://wa.me/971545714377"
            inView={inView}
          />
          <ContactCard
            delay={0.44}
            tone="pink"
            eyebrow="Sponsorship"
            name="Mayur Methi"
            role="Partnership Manager"
            photo="https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos/Mayur-Methi.png"
            email="mayur@eventsfirstgroup.com"
            whatsapp="https://wa.me/971545714377"
            inView={inView}
          />
        </div>
      </div>

      <style jsx global>{`
        .otsf-jb-contact-pills {
          display: flex;
          flex-direction: row;
          gap: 10px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        .otsf-jb-contact-pill {
          transition: background 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.35s, color 0.35s, transform 0.35s;
        }
        .otsf-jb-contact-pill:hover {
          background: ${C}18 !important;
          border-color: ${C}55 !important;
          color: ${C_BRIGHT} !important;
          transform: translateY(-1px);
        }
        @media (max-width: 880px) {
          .otsf-jb-contact-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── Shared helpers ──────────────────────────────────────────────────────────
const execPara: React.CSSProperties = {
  fontFamily: "var(--font-outfit)",
  fontSize: "clamp(16.5px, 1.35vw, 19px)",
  fontWeight: 400,
  color: "rgba(255,255,255,0.82)",
  lineHeight: 1.75,
  margin: 0,
};

const topHair: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 1,
  background: `linear-gradient(90deg, ${C}66 0%, ${CYAN}55 50%, transparent 100%)`,
  opacity: 0.55,
  pointerEvents: "none",
  zIndex: 2,
};

function Eyebrow({ inView, label, tone = "pink" }: { inView: boolean; label: string; tone?: "pink" | "cyan" }) {
  const rail = tone === "cyan" ? CYAN : C;
  const text = tone === "cyan" ? CYAN : C_BRIGHT;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}
    >
      <span style={{ width: 26, height: 1, background: rail }} />
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "4.5px",
          textTransform: "uppercase",
          color: text,
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          height: 1,
          background: "linear-gradient(90deg, rgba(255,255,255,0.14) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

function BgDots({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(${C}55 1px, transparent 1px)`,
        backgroundSize: "44px 44px",
        maskImage: "radial-gradient(ellipse 70% 60% at center, black 0%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at center, black 0%, transparent 80%)",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── SPEAKERS ────────────────────────────────────────────────────────────────
function SpeakersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} id="speakers" style={{ position: "relative", padding: "clamp(64px, 7vw, 96px) 0", background: BG_BASE }}>
      <BgDots opacity={0.05} />
      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <Eyebrow inView={inView} label="Leadership" />
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(34px, 5vw, 64px)",
            letterSpacing: "-2.2px",
            lineHeight: 0.98,
            color: "white",
            margin: "0 0 18px",
            maxWidth: 880,
          }}
        >
          Featured{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>
            speakers.
          </em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1.1vw, 16px)",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.65,
            maxWidth: 580,
            margin: "0 0 48px",
          }}
        >
          Regulators, plant CISOs, and industrial engineers shaping the conversation on industrial cyber resilience across the Kingdom.
        </motion.p>

        <div
          className="otsf-jb-speakers-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "clamp(16px, 1.8vw, 24px)",
          }}
        >
          {SPEAKERS.map((s, i) => (
            <motion.div
              key={`${s.name}-${i}`}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.25 + i * 0.07, ease: EASE }}
              className="otsf-jb-speaker-card"
              style={{
                position: "relative",
                borderRadius: 20,
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.012) 60%, rgba(211,75,154,0.03) 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 22px 50px rgba(0,0,0,0.35)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span aria-hidden style={topHair} />

              {/* Portrait area */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4 / 5",
                  background: `linear-gradient(160deg, rgba(211,75,154,0.18) 0%, rgba(0,201,255,0.08) 50%, rgba(7,12,32,0.92) 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {s.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.photo}
                    alt={`${s.name}, ${s.title}${s.org ? ` at ${s.org}` : ""} - speaker at OT Security First Jubail 2026 industrial cybersecurity summit, Saudi Arabia`}
                    loading="lazy"
                    decoding="async"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                    }}
                  />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke={C_BRIGHT} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ opacity: 0.55 }}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: "2.8px",
                        textTransform: "uppercase",
                        color: C_BRIGHT,
                      }}
                    >
                      Coming Soon
                    </span>
                  </div>
                )}
                {/* Bottom fade */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 50%, rgba(7,12,32,0.85) 100%)",
                    pointerEvents: "none",
                  }}
                />
                {/* LinkedIn */}
                {s.linkedin && (
                  <a
                    href={s.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.name} on LinkedIn`}
                    className="otsf-jb-li"
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 2,
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(7,12,32,0.55)",
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: "white",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21H9z" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Card body */}
              <div style={{ position: "relative", padding: "18px 18px 22px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                {/* Country flag pill — bottom-right corner of info panel */}
                {s.flag && (
                  <div
                    style={{
                      position: "absolute",
                      right: 14,
                      bottom: 14,
                      zIndex: 2,
                      padding: 3,
                      borderRadius: 7,
                      background: "linear-gradient(135deg, rgba(211,75,154,0.45), rgba(255,255,255,0.08))",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5), 0 0 10px rgba(211,75,154,0.25)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.flag} alt="" style={{ display: "block", height: 22, width: 40, objectFit: "cover", borderRadius: 4 }} />
                  </div>
                )}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(15px, 1.3vw, 17px)",
                    letterSpacing: "-0.4px",
                    color: "white",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {s.name}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  {s.title}
                </p>
                {s.org && (
                  <p
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.35)",
                      margin: "4px 0 0",
                      paddingRight: 64,
                    }}
                  >
                    {s.org}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .otsf-jb-speaker-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.4s, box-shadow 0.4s;
        }
        .otsf-jb-speaker-card:hover {
          transform: translateY(-4px);
          border-color: ${C}38 !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 26px 56px rgba(0,0,0,0.5), 0 0 0 1px ${C}25 !important;
        }
        .otsf-jb-li { transition: background 0.2s, border-color 0.2s, transform 0.2s; }
        .otsf-jb-li:hover { background: ${C}d9 !important; border-color: ${C} !important; transform: translateY(-1px); }
        @media (max-width: 1100px) {
          .otsf-jb-speakers-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .otsf-jb-speakers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── EVENT SPONSORS (current edition - TBA) ─────────────────────────────────
// ─── PAST SPONSORS MARQUEE ──────────────────────────────────────────────────
function PastSponsorsMarquee() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(64px, 7vw, 96px) 0", background: BG_BASE, overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: 1320, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", textAlign: "center", marginBottom: 40 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}
        >
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C}30)` }} />
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: C_BRIGHT,
            }}
          >
            Past Series Sponsors & Partners
          </span>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C}30, transparent)` }} />
        </motion.div>
      </div>

      <MarqueeRow logos={MARQUEE_ROW_1} direction="left" />
      <div style={{ height: 16 }} />
      <MarqueeRow logos={MARQUEE_ROW_2} direction="right" />

      <style jsx global>{`
        @keyframes otsfJbMarqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes otsfJbMarqueeRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .otsf-jb-marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .otsf-jb-marquee-track.is-left {
          animation: otsfJbMarqueeLeft 35s linear infinite;
        }
        .otsf-jb-marquee-track.is-right {
          animation: otsfJbMarqueeRight 35s linear infinite;
        }
        .otsf-jb-marquee-item {
          flex-shrink: 0;
          height: 80px;
          width: 180px;
          margin-right: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.55;
        }
        @media (prefers-reduced-motion: reduce) {
          .otsf-jb-marquee-track {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function MarqueeRow({ logos, direction }: { logos: string[]; direction: "left" | "right" }) {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to right, ${BG_BASE}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to left, ${BG_BASE}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div className={`otsf-jb-marquee-track is-${direction}`}>
        {[...logos, ...logos].map((logo, i) => (
          <div key={i} className="otsf-jb-marquee-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt={`${logo.split("/").pop()?.replace(/\.(png|jpg|svg|webp)$/i, "").replace(/[-_]/g, " ")} - past technology sponsor and partner of OT Security First industrial cybersecurity summit series`}
              width={160}
              height={64}
              loading="lazy"
              decoding="async"
              style={{
                maxHeight: 64,
                maxWidth: 160,
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
                opacity: 0.85,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FROM THE ROOM - OT shorts ──────────────────────────────────────────────
function FromTheRoom() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(64px, 7vw, 96px) 0", background: BG_DEEP, overflow: "hidden" }}>
      <BgDots opacity={0.05} />
      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <Eyebrow inView={inView} label="From the Room" tone="cyan" />
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(32px, 4.4vw, 56px)",
            letterSpacing: "-2px",
            lineHeight: 1.0,
            color: "white",
            margin: "0 0 14px",
            maxWidth: 760,
          }}
        >
          Hear it{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: CYAN }}>
            from the room.
          </em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1.1vw, 16px)",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "0 0 48px",
          }}
        >
          Unfiltered voices from OT security leaders who&apos;ve walked the floor of OT Security First UAE.
        </motion.p>

        <div className="otsf-jb-shorts-row">
          {OT_SHORTS.map((s, i) => (
            <RoomShort key={s.id} videoId={s.id} title={s.title} index={i} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .otsf-jb-shorts-row {
          display: flex;
          flex-wrap: nowrap;
          gap: clamp(10px, 1.2vw, 18px);
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 1024px) {
          .otsf-jb-shorts-row {
            overflow-x: auto;
            justify-content: flex-start;
            -webkit-overflow-scrolling: touch;
          }
          .otsf-jb-shorts-row::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </section>
  );
}

function RoomShort({ videoId, title, index }: { videoId: string; title: string; index: number }) {
  const [playing, setPlaying] = useState(false);
  const isHero = index === 2;
  const w = isHero ? "clamp(180px, 17vw, 240px)" : index === 0 || index === 4 ? "clamp(140px, 13vw, 190px)" : "clamp(155px, 14.5vw, 215px)";
  const h = isHero ? "clamp(310px, 28vw, 420px)" : index === 0 || index === 4 ? "clamp(225px, 20vw, 310px)" : "clamp(265px, 24vw, 365px)";

  return (
    <div
      style={{
        width: w,
        height: h,
        flexShrink: 0,
        padding: 3,
        borderRadius: 22,
        background: isHero
          ? `linear-gradient(160deg, ${C_BRIGHT}66 0%, ${C}33 40%, rgba(255,255,255,0.06) 75%, ${CYAN}22 100%)`
          : `linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 45%, ${C}1A 100%)`,
        boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)`,
      }}
    >
      <div
        onClick={() => !playing && setPlaying(true)}
        role={playing ? undefined : "button"}
        tabIndex={playing ? undefined : 0}
        onKeyDown={(e) => { if (!playing && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setPlaying(true); } }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 19,
          overflow: "hidden",
          background: "#04070C",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(0,0,0,0.5)",
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
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt={`${title} - OT Security First testimonial video from CISO and OT cybersecurity leader on industrial control system protection`}
              loading="lazy"
              decoding="async"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 28%" }}
            />
            {/* Top tag */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 9px",
                borderRadius: 999,
                background: "rgba(4,8,14,0.55)",
                border: `1px solid ${C}45`,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: 999, background: C_BRIGHT, boxShadow: `0 0 8px ${C_BRIGHT}` }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "white" }}>
                No. {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            {/* Play button */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div
                style={{
                  width: isHero ? 60 : 50,
                  height: isHero ? 60 : 50,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.92)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width={isHero ? 20 : 16} height={isHero ? 20 : 16} viewBox="0 0 16 18" fill={C}>
                  <path d="M14 9L2 17V1L14 9Z" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────
function GallerySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(64px, 7vw, 96px) 0", background: BG_BASE }}>
      <BgDots opacity={0.04} />
      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <Eyebrow inView={inView} label="From Past Editions" />
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(32px, 4.4vw, 56px)",
            letterSpacing: "-2px",
            lineHeight: 1.0,
            color: "white",
            margin: "0 0 14px",
            maxWidth: 760,
          }}
        >
          Inside the{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT }}>
            OT Security First
          </em>{" "}
          experience.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14px, 1.1vw, 16px)",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.6,
            maxWidth: 580,
            margin: "0 0 48px",
          }}
        >
          Moments captured from previous editions of the series.
        </motion.p>

        <div
          className="otsf-jb-gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridAutoRows: "240px",
            gap: 14,
          }}
        >
          {GALLERY.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.2 + i * 0.07, ease: EASE }}
              className="otsf-jb-gallery-tile"
              style={{
                position: "relative",
                borderRadius: 18,
                overflow: "hidden",
                gridColumn: i === 0 ? "span 2" : "auto",
                gridRow: i === 0 ? "span 2" : "auto",
                boxShadow: "0 14px 36px rgba(0,0,0,0.4)",
                cursor: "pointer",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 55%, rgba(5,8,24,0.85) 100%)",
                  pointerEvents: "none",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 16,
                  fontFamily: "var(--font-outfit)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "2.2px",
                  textTransform: "uppercase",
                  color: "white",
                  textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                }}
              >
                {img.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .otsf-jb-gallery-tile:hover img {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .otsf-jb-gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 180px !important;
          }
          .otsf-jb-gallery-grid > .otsf-jb-gallery-tile:first-child {
            grid-column: span 2 !important;
            grid-row: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── AWARDS SECTION (with nomination form) ──────────────────────────────────
function AwardsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const GOLD = "#C4A34A";
  const GOLD_BRIGHT = "#D4B85A";

  const [formData, setFormData] = useState({
    orgName: "",
    contactName: "",
    email: "",
    phone: "",
    category: "",
    reason: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [awardsSelectedCountry, setAwardsSelectedCountry] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.country === "SA") || COUNTRY_CODES[0]
  );
  const [awardsPhoneError, setAwardsPhoneError] = useState<string | null>(null);
  const [awardsEmailError, setAwardsEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setAwardsEmailError(null);
    setAwardsPhoneError(null);

    if (!formData.contactName.trim() || !formData.email.trim()) {
      setSubmitError("Please complete the required fields.");
      return;
    }
    if (formData.email && !isWorkEmail(formData.email)) {
      setAwardsEmailError("Please use your work email address");
      return;
    }
    const phoneErr = validatePhone(formData.phone, awardsSelectedCountry);
    if (phoneErr) {
      setAwardsPhoneError(phoneErr);
      return;
    }

    setIsSubmitting(true);
    const res = await submitForm({
      type: "awards",
      full_name: formData.contactName.trim(),
      email: formData.email.trim(),
      company: formData.orgName.trim(),
      phone: `${awardsSelectedCountry.code} ${formData.phone.trim()}`,
      event_name: "OT Security First Jubail 2026",
      metadata: {
        "Award Category": formData.category || "",
        "Nominee Company": formData.orgName.trim(),
        "Nomination Reason": formData.reason.trim(),
        "Page Section": "OT Jubail Awards · Nomination Form",
      },
    });
    setIsSubmitting(false);

    if (res.success) {
      setFormSubmitted(true);
    } else {
      setSubmitError(res.error || "Something went wrong. Please try again.");
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    backgroundColor: focusedField === field ? `${GOLD}10` : "rgba(7,12,32,0.55)",
    border: `1px solid ${focusedField === field ? `${GOLD}45` : "rgba(255,255,255,0.08)"}`,
    color: "white",
    fontFamily: "var(--font-outfit)",
    fontSize: 14,
    fontWeight: 400,
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
  });

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(64px, 7vw, 96px) 0", background: BG_DEEP }}>
      <BgDots opacity={0.05} />
      {/* Gold ambient */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 50% 35% at 50% 0%, ${GOLD}10 0%, transparent 60%),
                       radial-gradient(ellipse 30% 25% at 75% 80%, ${GOLD}06 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: GOLD }}>
              Awards & Recognition
            </span>
            <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(34px, 5vw, 64px)",
              letterSpacing: "-2.2px",
              color: "white",
              lineHeight: 0.98,
              margin: 0,
              maxWidth: 880,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            OT Security First{" "}
            <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Jubail Awards 2026
            </span>
          </h2>
        </motion.div>

        <div className="otsf-jb-awards-split" style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 36, alignItems: "start" }}>
          {/* LEFT - Form */}
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
            style={{
              position: "relative",
              padding: "clamp(28px, 3vw, 40px)",
              borderRadius: 24,
              background:
                "linear-gradient(170deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 22px 50px rgba(0,0,0,0.4)`,
              overflow: "hidden",
            }}
          >
            <span aria-hidden style={topHair} />

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: `${GOLD}10`, border: `1px solid ${GOLD}30`, marginBottom: 18 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, boxShadow: `0 0 8px ${GOLD}` }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11.5, fontWeight: 600, color: GOLD, letterSpacing: "0.5px" }}>Nominations Open</span>
            </div>

            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(22px, 2.3vw, 28px)", letterSpacing: "-0.8px", color: "white", margin: "0 0 6px" }}>
              Submit Your Nomination
            </h3>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: "0 0 24px" }}>
              Know a leader who deserves recognition? Self-nominations welcome.
            </p>

            {!formSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
                  <input
                    type="text"
                    placeholder="Organisation Name"
                    required
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    onFocus={() => setFocusedField("orgName")}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle("orgName")}
                    suppressHydrationWarning
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
                    suppressHydrationWarning
                  />
                  <input
                    type="email"
                    placeholder="Work Email"
                    required
                    value={formData.email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setAwardsEmailError(null); }}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle("email")}
                    suppressHydrationWarning
                  />
                  {awardsEmailError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: 0 }}>{awardsEmailError}</p>}

                  <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
                    <select
                      value={`${awardsSelectedCountry.code}|${awardsSelectedCountry.country}`}
                      onChange={(e) => { const [code, country] = e.target.value.split("|"); const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country); if (c) { setAwardsSelectedCountry(c); setAwardsPhoneError(null); } }}
                      onFocus={() => setFocusedField("country")}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle("country"), width: 110, flexShrink: 0, cursor: "pointer" }}
                      suppressHydrationWarning
                    >
                      {COUNTRY_CODES.map((cc) => (
                        <option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ background: "#0a0e2a", color: "white" }}>
                          {cc.country} {cc.code}
                        </option>
                      ))}
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
                      suppressHydrationWarning
                    />
                  </div>
                  {awardsPhoneError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: 0 }}>{awardsPhoneError}</p>}

                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    onFocus={() => setFocusedField("category")}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle("category"), cursor: "pointer", color: formData.category ? "white" : "rgba(255,255,255,0.35)" }}
                    suppressHydrationWarning
                  >
                    <option value="" disabled style={{ background: "#0a0e2a", color: "#888" }}>Select Award Category</option>
                    {AWARDS_DATA.map((a) => (
                      <option key={a.title} value={a.title} style={{ background: "#0a0e2a", color: "white" }}>
                        {a.title}
                      </option>
                    ))}
                  </select>

                  <textarea
                    placeholder="Reason for Nomination"
                    required
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    onFocus={() => setFocusedField("reason")}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle("reason"), resize: "vertical", minHeight: 80 }}
                    suppressHydrationWarning
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  suppressHydrationWarning
                  style={{
                    width: "100%",
                    padding: "14px 24px",
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`,
                    border: "none",
                    color: "#0A0A0A",
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    boxShadow: `0 8px 26px ${GOLD}35`,
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {isSubmitting ? "Submitting…" : "Submit Nomination"}
                </button>
                {submitError && (
                  <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "10px 0 0" }}>
                    {submitError}
                  </p>
                )}
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "30px 12px" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${GOLD}15`, border: `1px solid ${GOLD}30`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", margin: "0 0 8px" }}>
                  Nomination Submitted
                </h4>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: 0 }}>
                  Thank you. Our committee will review your submission shortly.
                </p>
              </div>
            )}
          </motion.div>

          {/* RIGHT - Award Categories (editorial list) */}
          <motion.div
            initial={{ opacity: 0, x: 22 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.25, ease: EASE }}
          >
            {/* Header */}
            <div style={{ marginBottom: 28, paddingBottom: 22, borderBottom: `1px solid ${GOLD}1f` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <span
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "3.5px",
                    textTransform: "uppercase",
                    color: GOLD,
                  }}
                >
                  Categories · 05
                </span>
                <span aria-hidden style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${GOLD}66, transparent)` }} />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(26px, 2.8vw, 36px)",
                  color: "white",
                  margin: "0 0 10px",
                  letterSpacing: "-1px",
                  lineHeight: 1.05,
                }}
              >
                The{" "}
                <em style={{ fontStyle: "italic", fontWeight: 400, color: GOLD_BRIGHT }}>
                  honour roll
                </em>
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14.5,
                  color: "rgba(255,255,255,0.6)",
                  margin: 0,
                  lineHeight: 1.6,
                  maxWidth: 520,
                }}
              >
                Five categories spanning programmes, leaders, innovators, and the public sector - chosen to recognise the breadth of industrial resilience in the Kingdom.
              </p>
            </div>

            {/* Editorial 2-column list */}
            <ol
              className="otsf-jb-awards-list"
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "clamp(24px, 3vw, 44px)",
              }}
            >
              {AWARDS_DATA.map((a, i) => {
                const roman = ["I", "II", "III", "IV", "V"][i] ?? String(i + 1);
                // For 2-col, 5 items: top row is items 0,1 (no border-top), rest get border-top
                const isTopRow = i < 2;
                return (
                  <li
                    key={a.title}
                    className="otsf-jb-award-row"
                    style={{
                      position: "relative",
                      display: "grid",
                      gridTemplateColumns: "minmax(56px, 68px) 1fr",
                      gap: "clamp(14px, 1.6vw, 22px)",
                      padding: "clamp(16px, 1.8vw, 22px) 10px clamp(16px, 1.8vw, 22px) 0",
                      borderTop: isTopRow ? "none" : `1px solid ${GOLD}14`,
                      transition: "background 0.4s ease, padding-left 0.4s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {/* Left accent rail (appears on hover) */}
                    <span
                      aria-hidden
                      className="otsf-jb-award-rail"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "20%",
                        bottom: "20%",
                        width: 2,
                        background: `linear-gradient(180deg, ${GOLD_BRIGHT}, ${GOLD}66)`,
                        boxShadow: `0 0 10px ${GOLD}66`,
                        opacity: 0,
                        transition: "opacity 0.4s ease",
                      }}
                    />

                    {/* Roman numeral */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 4,
                        paddingTop: 2,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "clamp(26px, 2.6vw, 34px)",
                          fontWeight: 500,
                          fontStyle: "italic",
                          letterSpacing: "-1.2px",
                          color: GOLD_BRIGHT,
                          lineHeight: 1,
                          textShadow: `0 0 14px ${GOLD}33`,
                        }}
                      >
                        {roman}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 12,
                          fontStyle: "italic",
                          fontWeight: 400,
                          color: `${GOLD}88`,
                          lineHeight: 1,
                        }}
                      >
                        .
                      </span>
                    </div>

                    {/* Title + Description */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <h4
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "clamp(15.5px, 1.4vw, 18px)",
                          color: "white",
                          margin: 0,
                          letterSpacing: "-0.4px",
                          lineHeight: 1.2,
                        }}
                      >
                        {a.title}
                      </h4>
                      <p
                        style={{
                          fontFamily: "var(--font-outfit)",
                          fontSize: 13,
                          color: "rgba(255,255,255,0.62)",
                          lineHeight: 1.55,
                          margin: 0,
                        }}
                      >
                        {a.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .otsf-jb-award-row:hover {
          background: linear-gradient(90deg, ${GOLD}0c 0%, transparent 80%);
          padding-left: 22px !important;
        }
        .otsf-jb-award-row:hover .otsf-jb-award-rail {
          opacity: 1;
        }
        @media (max-width: 980px) {
          .otsf-jb-awards-split { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          .otsf-jb-awards-list {
            grid-template-columns: 1fr !important;
          }
          .otsf-jb-award-row {
            border-top: 1px solid ${GOLD}14 !important;
          }
          .otsf-jb-award-row:first-child {
            border-top: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─── BE PART OF THE MOVEMENT - rally banner ────────────────────────────────
const MOVEMENT_BG_IMAGE = `${S3}/events/OT+Security+First+UAE+2025/OT+First+UAE+Photos/4N8A0820.JPG`;

function BePartOfTheMovement() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        padding: "clamp(56px, 6vw, 88px) 0",
        background: BG_DEEP,
        overflow: "hidden",
      }}
    >
      {/* Full-section background image */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${MOVEMENT_BG_IMAGE}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
        }}
      />

      {/* Darkening overlay - vignette + top/bottom fade for adjacent-section blend + center dark for text readability */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            // Top and bottom blend into BG_DEEP
            `linear-gradient(180deg, ${BG_DEEP} 0%, rgba(5,8,24,0.75) 18%, rgba(5,8,24,0.62) 50%, rgba(5,8,24,0.78) 82%, ${BG_DEEP} 100%),` +
            // Center radial darken behind the headline
            `radial-gradient(ellipse 80% 70% at 50% 50%, rgba(5,8,24,0.55) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Top + bottom dual-tone hairlines (banner frame) */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${C_BRIGHT}40 30%, ${CYAN}40 70%, transparent 100%)`,
          zIndex: 2,
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${C_BRIGHT}40 30%, ${CYAN}40 70%, transparent 100%)`,
          zIndex: 2,
        }}
      />

      {/* Ambient color washes - adds magenta/cyan tinted glow over the image */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            `radial-gradient(circle at 25% 50%, ${C}22 0%, transparent 50%),` +
            `radial-gradient(circle at 75% 50%, ${CYAN}18 0%, transparent 50%)`,
          filter: "blur(60px)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          textAlign: "center",
          zIndex: 3,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.05, ease: EASE }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 28,
          }}
        >
          <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 10px ${C_BRIGHT}` }} />
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "3.2px",
              textTransform: "uppercase",
              color: C_BRIGHT,
            }}
          >
            Be Part of the Movement
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.95, delay: 0.15, ease: EASE }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 52px)",
            letterSpacing: "-1.8px",
            lineHeight: 1.08,
            color: "white",
            margin: "0 auto 36px",
            maxWidth: 1200,
            textShadow: "0 2px 24px rgba(0,0,0,0.65), 0 1px 4px rgba(0,0,0,0.55)",
          }}
        >
          Shape the future of{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: C_BRIGHT, textShadow: "0 2px 18px rgba(0,0,0,0.7)" }}>
            industrial cybersecurity
          </em>{" "}
          in Saudi Arabia - where national infrastructure, industrial innovation, and cyber resilience converge.
        </motion.h2>

        <motion.a
          href="#register"
          onClick={(e) => { e.preventDefault(); jbScrollTo("register"); }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="otsf-jb-movement-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 32px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%)`,
            color: "white",
            fontFamily: "var(--font-outfit)",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "1.6px",
            textTransform: "uppercase",
            textDecoration: "none",
            boxShadow: `0 14px 36px ${C}55, 0 6px 14px ${C}33`,
            transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease",
          }}
        >
          <span>Apply to Attend</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.a>
      </div>

      <style jsx>{`
        .otsf-jb-movement-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 44px ${C}66, 0 8px 18px ${C}40 !important;
        }
      `}</style>
    </section>
  );
}

// ─── REGISTER (shared InquiryForm) ──────────────────────────────────────────
function RegisterSection() {
  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(64px, 7vw, 96px) 0",
        background: BG_BASE,
        overflow: "hidden",
      }}
    >
      <BgDots opacity={0.04} />
      <div
        className="otsf-jb-register-wrap"
        style={{ position: "relative", zIndex: 1 }}
      >
        <InquiryForm
          defaultCountry="SA"
          eventName="OT Security First Jubail 2026"
          labelText="Join Us in Jubail"
        />
      </div>

      <style jsx global>{`
        .otsf-jb-register-wrap #get-involved {
          background: transparent !important;
        }
        .otsf-jb-register-wrap #get-involved > .absolute {
          display: none;
        }
        .otsf-jb-register-wrap .inquiry-split > div:last-child {
          background: rgba(7, 12, 32, 0.78) !important;
          backdrop-filter: blur(28px) saturate(1.2) !important;
          -webkit-backdrop-filter: blur(28px) saturate(1.2) !important;
          border: 1px solid ${C}25 !important;
          box-shadow: 0 22px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }
        .otsf-jb-register-wrap button[style*="background: var(--orange)"] {
          background: ${C} !important;
          border-color: ${C} !important;
        }
        .otsf-jb-register-wrap .inquiry-split > div:last-child > .absolute {
          background: radial-gradient(ellipse, ${C}10 0%, transparent 70%) !important;
        }
        .otsf-jb-register-wrap [style*="var(--orange)"][style*="letter-spacing: 3px"] {
          color: ${C_BRIGHT} !important;
        }
        .otsf-jb-register-wrap .inquiry-split svg {
          color: ${C_BRIGHT};
        }
      `}</style>
    </section>
  );
}

// ─── VENUE (announced soon) ─────────────────────────────────────────────────
function VenueSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="venue"
      style={{
        position: "relative",
        padding: "clamp(48px, 6vw, 80px) 0",
        background: BG_BASE,
        overflow: "hidden",
      }}
    >
      <BgDots opacity={0.04} />
      {/* Ambient cyan + magenta washes for depth */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            `radial-gradient(ellipse 50% 60% at 50% 0%, ${CYAN}10 0%, transparent 60%),
             radial-gradient(ellipse 40% 50% at 50% 100%, ${C}10 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 920,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          textAlign: "center",
        }}
      >
        <Eyebrow inView={inView} label="Venue" tone="cyan" />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
          style={{
            position: "relative",
            marginTop: 28,
            padding: "clamp(28px, 4vw, 56px) clamp(24px, 4vw, 56px)",
            borderRadius: 22,
            background:
              "linear-gradient(170deg, rgba(15,20,46,0.92) 0%, rgba(10,14,34,0.96) 100%)",
            border: `1px solid ${C}28`,
            boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 56px ${C}10, inset 0 1px 0 rgba(255,255,255,0.05)`,
            overflow: "hidden",
          }}
        >
          {/* Top hairline accent */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: "12%",
              right: "12%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, ${CYAN}, transparent)`,
              boxShadow: `0 0 12px ${C}55`,
            }}
          />

          {/* Pin icon row with pulsing dot */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 16px",
              borderRadius: 999,
              background: `${C}14`,
              border: `1px solid ${C}33`,
              marginBottom: 22,
            }}
          >
            <span
              aria-hidden
              className="otsf-jb-venue-pulse"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C_BRIGHT,
                boxShadow: `0 0 12px ${C_BRIGHT}`,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: C_BRIGHT,
              }}
            >
              Jubail · Saudi Arabia
            </span>
          </div>

          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 52px)",
              letterSpacing: "-1.6px",
              lineHeight: 1.04,
              color: "white",
              margin: 0,
            }}
          >
            Venue{" "}
            <span
              className="otsf-hero-shimmer"
              style={{
                backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 50%, ${C_BRIGHT} 100%)`,
                backgroundSize: "250% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              announced soon.
            </span>
          </h3>

          <p
            style={{
              marginTop: 16,
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(13px, 1.05vw, 15px)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.62)",
              maxWidth: 540,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Registered delegates will be notified directly once the venue is confirmed.
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes otsf-jb-venue-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.55; }
        }
        .otsf-jb-venue-pulse {
          animation: otsf-jb-venue-pulse 1.8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

// ─── PAST EVENT REPORTS (series highlights) ─────────────────────────────────
// ─── REQUEST RESOURCES MODAL ────────────────────────────────────────────────
// Mounted once on the page. Listens for `otsf-jb:open-request` event dispatched
// from the hero dropdown (Past Event Report / Delegate List).
function RequestResourcesModal() {
  type RequestKind = "Past Event Report" | "Delegate List";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.country === "SA") || COUNTRY_CODES[0]
  );
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [requestType, setRequestType] = useState<RequestKind>("Past Event Report");
  const [selectedReportUrl, setSelectedReportUrl] = useState<string>(POST_EVENT_REPORTS[0]?.url ?? "");

  useEffect(() => { setMounted(true); }, []);

  // Body scroll lock + ESC close
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

  // Listen for hero dropdown opening the modal
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
    window.addEventListener("otsf-jb:open-request", onOpenRequest);
    return () => window.removeEventListener("otsf-jb:open-request", onOpenRequest);
  }, []);

  const modalCopy =
    requestType === "Past Event Report"
      ? {
          kicker: "Request the Past Event Report",
          title: "Get the post-event report.",
          subtitle: "Share your details and we'll send the PDF report to your work email.",
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
    else if (!isWorkEmail(email.trim())) newErrors.email = "Please use your work email - free providers are not accepted";
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
      event_name: "OT Security First Jubail 2026",
      metadata: {
        "Event Page": "OT Security First Jubail 2026",
        "Request Type": requestType,
        "Page Section": "Hero · Past Event Reports",
        ...(selectedReport && {
          "Selected Edition": selectedReport.title,
          ...(requestType === "Past Event Report" && {
            "Selected Report URL": selectedReport.url,
          }),
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

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="otsf-jb-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="otsf-jb-modal-title"
          >
            <motion.div
              className="otsf-jb-modal-card"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="otsf-jb-modal-close"
                aria-label="Close request form"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <span aria-hidden className="otsf-jb-modal-hairline" />

              <div className="otsf-jb-modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 24, height: 1, background: C_BRIGHT }} />
                  <span style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.32em", textTransform: "uppercase",
                    color: C_BRIGHT,
                  }}>{modalCopy.kicker}</span>
                </div>
                <h3 id="otsf-jb-modal-title" style={{
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
                <div className="otsf-jb-modal-success">
                  <div className="otsf-jb-modal-success-check">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h4>Request received.</h4>
                  <p>{modalCopy.success}</p>
                  <button type="button" onClick={() => setModalOpen(false)} className="otsf-jb-modal-done">
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="otsf-jb-form-fields">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off"
                    style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

                  <div className="otsf-jb-form-row">
                    <label className="otsf-jb-form-field" style={{ flex: "1 1 100%" }}>
                      <span className="otsf-jb-form-label">Select Edition</span>
                      <select
                        value={selectedReportUrl}
                        onChange={(e) => {
                          setSelectedReportUrl(e.target.value);
                          if (errors.report) setErrors({ ...errors, report: "" });
                        }}
                        className="otsf-jb-form-input otsf-jb-form-report-select"
                        aria-invalid={!!errors.report}
                      >
                        {POST_EVENT_REPORTS.map((r) => (
                          <option key={r.url} value={r.url}>
                            {r.title}
                          </option>
                        ))}
                      </select>
                      {errors.report && <span className="otsf-jb-form-err">{errors.report}</span>}
                    </label>
                  </div>

                  <div className="otsf-jb-form-row">
                    <label className="otsf-jb-form-field">
                      <span className="otsf-jb-form-label">Full Name</span>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors({ ...errors, fullName: "" }); }}
                        placeholder="Your full name"
                        autoComplete="name"
                        className="otsf-jb-form-input"
                        aria-invalid={!!errors.fullName}
                      />
                      {errors.fullName && <span className="otsf-jb-form-err">{errors.fullName}</span>}
                    </label>

                    <label className="otsf-jb-form-field">
                      <span className="otsf-jb-form-label">Work Email</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }}
                        placeholder="name@company.com"
                        autoComplete="email"
                        className="otsf-jb-form-input"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <span className="otsf-jb-form-err">{errors.email}</span>}
                    </label>
                  </div>

                  <div className="otsf-jb-form-row">
                    <label className="otsf-jb-form-field">
                      <span className="otsf-jb-form-label">Job Title</span>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => { setJobTitle(e.target.value); if (errors.jobTitle) setErrors({ ...errors, jobTitle: "" }); }}
                        placeholder="CISO, Head of OT, Plant Director…"
                        autoComplete="organization-title"
                        className="otsf-jb-form-input"
                        aria-invalid={!!errors.jobTitle}
                      />
                      {errors.jobTitle && <span className="otsf-jb-form-err">{errors.jobTitle}</span>}
                    </label>

                    <label className="otsf-jb-form-field">
                      <span className="otsf-jb-form-label">
                        Phone
                        <span className="otsf-jb-form-hint-inline">
                          {countryCode.length} digits expected
                        </span>
                      </span>
                      <div className="otsf-jb-form-phone-row">
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
                          className="otsf-jb-form-cc"
                          aria-label="Country code"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={`${c.country}-${c.code}`} value={`${c.country}-${c.code}`}>
                              {c.country} {c.code}
                            </option>
                          ))}
                        </select>
                        <div className="otsf-jb-form-phone-input-wrap">
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
                            className="otsf-jb-form-input otsf-jb-form-phone-input"
                            aria-invalid={!!errors.phone}
                          />
                          {phoneTouched && phoneIsValid && (
                            <span aria-hidden className="otsf-jb-form-phone-check">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                      {phoneTouched && !phoneIsValid && phoneDigitsLen > 0 && !errors.phone && (
                        <span className="otsf-jb-form-phone-progress">
                          {phoneDigitsLen} / {countryCode.length} digits
                        </span>
                      )}
                      {errors.phone && <span className="otsf-jb-form-err">{errors.phone}</span>}
                    </label>
                  </div>

                  {submitError && (
                    <div className="otsf-jb-form-submit-err">{submitError}</div>
                  )}

                  <button
                    type="submit"
                    disabled={submitState === "submitting"}
                    className="otsf-jb-form-submit"
                  >
                    {submitState === "submitting"
                      ? "Sending…"
                      : requestType === "Past Event Report"
                      ? "Send me the report"
                      : "Send me the delegate list"}
                    {submitState !== "submitting" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }} aria-hidden>
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    )}
                  </button>
                  <p className="otsf-jb-form-hint">
                    We respect your inbox. Used only to send the requested resource and edition follow-ups.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .otsf-jb-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(16px, 3vw, 32px);
          background: rgba(4, 6, 16, 0.78);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
        }
        .otsf-jb-modal-card {
          position: relative;
          width: 100%;
          max-width: 580px;
          max-height: calc(100vh - clamp(32px, 6vw, 64px));
          overflow-y: auto;
          padding: clamp(24px, 3vw, 36px);
          background: linear-gradient(165deg, rgba(20, 14, 38, 0.94) 0%, rgba(8, 12, 28, 0.96) 100%);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 20px;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.16),
            inset 0 -1px 0 rgba(0,0,0,0.45),
            0 24px 56px rgba(0,0,0,0.55),
            0 48px 96px rgba(0,0,0,0.45);
        }
        .otsf-jb-modal-hairline {
          position: absolute;
          top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent 0%, ${C_BRIGHT} 30%, ${CYAN} 70%, transparent 100%);
          opacity: 0.8;
        }
        .otsf-jb-modal-close {
          position: absolute;
          top: 14px; right: 14px;
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .otsf-jb-modal-close:hover {
          color: white;
          border-color: ${C_BRIGHT}66;
          background: ${C}1a;
          transform: rotate(90deg);
        }
        .otsf-jb-modal-header {
          margin-bottom: clamp(18px, 2vw, 22px);
          padding-right: 36px;
        }
        .otsf-jb-modal-success {
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: clamp(8px, 1vw, 12px) 0 4px;
        }
        .otsf-jb-modal-success-check {
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 56px; height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${C}, ${CYAN});
          margin-bottom: 16px;
          box-shadow: 0 8px 24px ${C}40;
        }
        .otsf-jb-modal-success h4 {
          margin: 0 0 8px;
          font-family: var(--font-display);
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 700;
          color: white;
        }
        .otsf-jb-modal-success p {
          margin: 0 0 22px;
          font-family: var(--font-outfit);
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.55;
          max-width: 380px;
        }
        .otsf-jb-modal-done {
          padding: 10px 28px;
          background: linear-gradient(135deg, ${C} 0%, ${C_BRIGHT} 100%);
          border: 1px solid ${C_BRIGHT}55;
          border-radius: 10px;
          color: white;
          font-family: var(--font-outfit);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: transform 0.3s ease, filter 0.3s ease;
        }
        .otsf-jb-modal-done:hover {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }
        @media (max-width: 540px) {
          .otsf-jb-modal-card { padding: 22px 18px; border-radius: 16px; }
          .otsf-jb-modal-header { padding-right: 30px; }
        }
        .otsf-jb-form-fields {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          gap: clamp(14px, 1.8vw, 18px);
        }
        .otsf-jb-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(12px, 1.6vw, 18px);
        }
        .otsf-jb-form-field {
          display: flex; flex-direction: column;
          gap: 6px;
        }
        .otsf-jb-form-label {
          font-family: var(--font-outfit);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .otsf-jb-form-hint-inline {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: none;
          color: rgba(255,255,255,0.35);
        }
        .otsf-jb-form-phone-input-wrap {
          position: relative;
          flex: 1;
        }
        .otsf-jb-form-phone-check {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center; justify-content: center;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${C}, ${CYAN});
          color: white;
          box-shadow: 0 2px 8px ${C}40;
          pointer-events: none;
        }
        .otsf-jb-form-phone-progress {
          font-family: var(--font-outfit);
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          font-variant-numeric: tabular-nums;
          margin-top: 2px;
        }
        .otsf-jb-form-input {
          width: 100%;
          padding: 12px 14px;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          color: white;
          font-family: var(--font-outfit);
          font-size: 14.5px;
          line-height: 1.4;
          outline: none;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }
        .otsf-jb-form-input::placeholder {
          color: rgba(255,255,255,0.30);
        }
        .otsf-jb-form-input:focus {
          border-color: ${C_BRIGHT};
          background: rgba(0,0,0,0.35);
          box-shadow: 0 0 0 3px ${C}26;
        }
        .otsf-jb-form-input[aria-invalid="true"] {
          border-color: rgba(255,80,80,0.6);
        }
        .otsf-jb-form-report-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          padding-right: 40px;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1l5 5 5-5' stroke='%2300C9FF' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>");
          background-repeat: no-repeat;
          background-position: right 14px center;
          cursor: pointer;
        }
        .otsf-jb-form-report-select option {
          background: #14122a;
          color: white;
        }
        .otsf-jb-form-phone-row {
          display: flex;
          gap: 8px;
        }
        .otsf-jb-form-cc {
          padding: 12px 10px;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          color: white;
          font-family: var(--font-outfit);
          font-size: 14px;
          outline: none;
          cursor: pointer;
          max-width: 110px;
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .otsf-jb-form-cc:focus {
          border-color: ${C_BRIGHT};
          box-shadow: 0 0 0 3px ${C}26;
        }
        .otsf-jb-form-cc option {
          background: #14122a;
          color: white;
        }
        .otsf-jb-form-phone-input {
          flex: 1;
          width: 100%;
          padding-right: 40px;
        }
        .otsf-jb-form-err {
          font-family: var(--font-outfit);
          font-size: 12px;
          color: #ff7a7a;
          margin-top: 2px;
        }
        .otsf-jb-form-submit-err {
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255, 80, 80, 0.10);
          border: 1px solid rgba(255, 80, 80, 0.30);
          color: #ff9a9a;
          font-family: var(--font-outfit);
          font-size: 13.5px;
        }
        .otsf-jb-form-submit {
          display: inline-flex;
          align-items: center; justify-content: center;
          padding: 14px 24px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: linear-gradient(135deg, ${C}, ${CYAN});
          color: white;
          font-family: var(--font-outfit);
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          align-self: flex-start;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, filter 0.25s ease;
          box-shadow: 0 8px 20px ${C}33, inset 0 1px 0 rgba(255,255,255,0.18);
        }
        .otsf-jb-form-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.08);
          box-shadow: 0 12px 28px ${C}4d, inset 0 1px 0 rgba(255,255,255,0.22);
        }
        .otsf-jb-form-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .otsf-jb-form-hint {
          font-family: var(--font-outfit);
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin: 4px 0 0;
        }
        @media (max-width: 640px) {
          .otsf-jb-form-row {
            grid-template-columns: 1fr !important;
          }
          .otsf-jb-form-submit {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>,
    document.body,
  );
}

