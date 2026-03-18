"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Footer } from "@/components/sections";
import NetworkFirst from "@/components/sections/NetworkFirst";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { FormType, CountryCode } from "@/lib/form-helpers";
import { FAQSchema } from "@/lib/schemas";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM — White + Gold Only
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = "#C9935A";
const GOLD_50 = "rgba(201, 147, 90, 0.5)";
const GOLD_30 = "rgba(201, 147, 90, 0.3)";
const GOLD_15 = "rgba(201, 147, 90, 0.15)";
const BG = "#000000";
const BG_ALT = "#050505";
const TEXT = "#ffffff";
const TEXT_50 = "rgba(255, 255, 255, 0.5)";
const TEXT_30 = "rgba(255, 255, 255, 0.3)";
const BORDER = "rgba(201, 147, 90, 0.2)";
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// S3 for boardroom photos & sponsor logos
const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const BOARDROOM = `${S3}/networkfirst/boardrooms`;
const S3_LOGOS = `${S3}/sponsors-logo`;
const NF = "https://efg-final.s3.eu-north-1.amazonaws.com/networkfirst/events";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const UPCOMING_EVENTS = [
  {
    date: "April 29th, 2026",
    month: "APR",
    day: "29",
    year: "2026",
    time: "09:00 – 16:00",
    title: "ONE Executive Day KSA",
    subtitle: "Explore the Power of Agentic Enterprise and Low-Code",
    sponsor: "OutSystems",
    location: "JW Marriott Hotel Riyadh",
    link: "https://events.outsystems.com/event/17e2fb07-2b9a-46e2-9acf-44590276e2d8/homepage?RefId=oed-ksa&utm_source=efg&utm_medium=referral&utm_campaign=emea-mea-re-2026-04-29-outsystems-one-executive-day-ksa&utm_term=none&utm_content=none&utm_campaignteam=camp-emea&utm_partner=none",
    image: `${NF}/2026/02/outsystems-one.jpg`,
  },
];

const PAST_EVENTS_2025 = [
  { sponsor: "ONE Executive Day UAE", date: "10 Dec", venue: "Dubai", image: `${NF}/2025/10/Outsystem-01.jpg` },
  { sponsor: "Confluent | AWS", date: "25 Nov", venue: "Ritz Carlton DIFC", image: `${NF}/2025/11/Upcoming-events-05.jpg` },
  { sponsor: "Strategy", date: "19 Nov", venue: "Crowne Plaza, Riyadh", image: `${NF}/2025/11/Strategy-01-1.jpg` },
  { sponsor: "OutSystems", date: "18 Nov", venue: "Dana Rayhaan, Dammam", image: `${NF}/2025/11/Outsysyem-18-nov-01-Thumb.png` },
  { sponsor: "Commvault | GBM", date: "18 Nov", venue: "Ritz Carlton DIFC", image: `${NF}/2025/11/GBM-Comm-vault-01-1-1024x662.jpg` },
  { sponsor: "Finastra", date: "29 Oct", venue: "Voco Riyadh", image: `${NF}/2025/10/Finestra-Thumb-01-1.jpg` },
  { sponsor: "CleverTap", date: "29 Oct", venue: "Jumeirah Messilah, Kuwait", image: `${NF}/2025/10/clevertap-1024x662.jpeg` },
  { sponsor: "Crayon | AWS", date: "29 Oct", venue: "Crowne Plaza Riyadh", image: `${NF}/2025/09/Crayon-AWS-01-1024x662.jpg` },
  { sponsor: "SecurityScorecard", date: "29 Oct", venue: "Grand Hyatt, Abu Dhabi", image: `${NF}/2025/09/ss-01-1024x662.jpg` },
  { sponsor: "Akamai | Cyberia", date: "29 Oct", venue: "Riyadh", image: `${NF}/2025/10/cyberia.jpeg` },
  { sponsor: "Jedox Elevate", date: "29 Oct", venue: "Ritz Carlton JBR", image: `${NF}/2025/09/jedox-roadshow1.jpg` },
  { sponsor: "Confluent", date: "28 Oct", venue: "Voco Hotel, Riyadh", image: `${NF}/2025/10/Confluent-28-oct-01.jpg` },
];

const PAST_EVENTS_2024 = [
  { sponsor: "Freshworks", date: "Dec", venue: "Ritz-Carlton Abu Dhabi", image: `${NF}/2024/11/Upcoming-Events-01-scaled-1-1024x682.jpg` },
  { sponsor: "Trimble", date: "Nov", venue: "Ritz Carlton DIFC", image: `${NF}/2024/11/Events-01-1-1024x682.jpg` },
  { sponsor: "Confluent", date: "Nov", venue: "Hilton Riyadh", image: `${NF}/2024/11/Events-01-1024x682.jpg` },
  { sponsor: "Celonis", date: "Nov", venue: "Dubai", image: `${NF}/2024/10/WhatsApp-Image-2024-10-16-at-4.36.00-PM-1024x669.jpeg` },
  { sponsor: "Coursera", date: "Oct", venue: "Voco Hotel Riyadh", image: `${NF}/2024/09/coursera-img.jpg` },
  { sponsor: "Orbit", date: "Oct", venue: "Ritz Carlton JBR", image: `${NF}/2024/10/WhatsApp-Image-2024-10-09-at-9.55.36-PM-1024x660.jpeg` },
  { sponsor: "Kissflow", date: "Sep", venue: "JW Marriott Marina", image: `${NF}/2024/09/Kissflow-1-1024x660.jpg` },
  { sponsor: "Freshworks", date: "Sep", venue: "Abu Dhabi", image: `${NF}/2024/08/freshworks-auh-1024x682.jpg` },
  { sponsor: "Appknox", date: "Sep", venue: "Conrad Abu Dhabi", image: `${BOARDROOM}/boardroom-05.jpg` },
  { sponsor: "Uniphore", date: "Sep", venue: "Dubai", image: `${BOARDROOM}/boardroom-08.jpg` },
  { sponsor: "Orbit", date: "Jul", venue: "Dubai", image: `${BOARDROOM}/boardroom-10.jpg` },
  { sponsor: "Freshservice", date: "May", venue: "Palazzo Versace Dubai", image: `${BOARDROOM}/boardroom-14.jpg` },
];

const PAST_EVENTS_2023 = [
  { sponsor: "Appknox", date: "Aug", venue: "Sheraton Grand Dubai", image: `${BOARDROOM}/boardroom-17.jpg` },
  { sponsor: "Zero Trust Summit", date: "Oct", venue: "GITEX Dubai", image: `${BOARDROOM}/boardroom-20.jpg` },
  { sponsor: "Ransomware Recovery", date: "Oct", venue: "GITEX Dubai", image: `${BOARDROOM}/boardroom-23.jpg` },
  { sponsor: "Atlassian", date: "Sep", venue: "Movenpick Media City", image: `${BOARDROOM}/boardroom-26.jpg` },
  { sponsor: "Smart NFC Solutions", date: "Jun", venue: "Radisson Blu Dubai", image: `${BOARDROOM}/boardroom-01.jpg` },
  { sponsor: "Digital Marketing", date: "Jun", venue: "Grand Hyatt Abu Dhabi", image: `${BOARDROOM}/boardroom-02.jpg` },
  { sponsor: "Adtech Media", date: "May", venue: "Address Marina Dubai", image: `${BOARDROOM}/boardroom-05.jpg` },
];

const PAST_EVENTS_2026: { sponsor: string; date: string; venue: string; image: string }[] = [
  { sponsor: "CleverTap Iftar", date: "5 Mar", venue: "Madinat Jumeirah, Dubai", image: `${NF}/2026/02/iftar-photo1.jpg` },
  { sponsor: "CleverTap Majlis Al-Suhoor", date: "3 Mar", venue: "JW Marriott, Riyadh", image: `${NF}/2026/02/Suhoor-photo1.jpg` },
];

const CANDID_MOMENTS = [
  `${BOARDROOM}/boardroom-01.jpg`,
  `${BOARDROOM}/boardroom-02.jpg`,
  `${BOARDROOM}/boardroom-05.jpg`,
  `${BOARDROOM}/boardroom-08.jpg`,
  `${BOARDROOM}/boardroom-10.jpg`,
  `${BOARDROOM}/boardroom-14.jpg`,
  `${BOARDROOM}/boardroom-17.jpg`,
  `${BOARDROOM}/boardroom-20.jpg`,
  `${BOARDROOM}/boardroom-23.jpg`,
  `${BOARDROOM}/boardroom-26.jpg`,
];

const STATS = [
  { value: "300+", label: "Boardrooms" },
  { value: "9,000+", label: "Executives" },
  { value: "90+", label: "Hosts" },
  { value: "6+", label: "Global Markets" },
];


const TRUST_LOGOS = [
  { src: `${S3}/Microsoft.png` },
  { src: `${S3}/SAP.png` },
  { src: `${S3_LOGOS}/Google-Cloud-Security.png` },
  { src: `${S3_LOGOS}/EY.png` },
  { src: `${S3_LOGOS}/paloalto.png` },
  { src: `${S3_LOGOS}/fortinet.png` },
  { src: `${S3_LOGOS}/Akamai.png` },
  { src: `${S3_LOGOS}/Celonis.png` },
  { src: `${S3_LOGOS}/Claroty.png` },
  { src: `${S3_LOGOS}/GBM.png` },
  { src: `${S3}/NetwrokFirstLogo/Simpplr_logo.webp` },
  { src: `${S3_LOGOS}/Tenable-logo.png` },
  { src: `${S3_LOGOS}/sentinelone.png` },
  { src: `${S3_LOGOS}/kaspersky.png` },
  { src: `${S3_LOGOS}/Dragos.png` },
  { src: `${S3_LOGOS}/Group-IB.png` },
];

const TITLES = [
  "CISO", "CDO", "CTO", "COO", "CIO", "VP Engineering", "Head of Cybersecurity",
  "Director of IT", "Chief Data Officer", "Group CIO",
];

// ─────────────────────────────────────────────────────────────────────────────
// MOTION
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: EASE_OUT } }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function NetworkFirstPage() {
  return (
    <main style={{ background: BG, color: TEXT, overflowX: "hidden" }}>
      <Hero />
      <TrustStrip />
      <NetworkFirst />
      <IntroStatement />
      <WhyBoardroomsWork />
      <TheFormat />
      <CandidMoments />
      <WhyHost />
      <EditorialBreak src={`${BOARDROOM}/boardroom-03.jpg`} />
      <TheExperience />
      <TheJourney />
      <UpcomingSection />
      <PastBoardroomsShowcase />
      <ResultsThatMatter />
      <VideoTestimonials />

      <FAQSection />
      <TitlesMarquee />
      <FinalCTA />
      <Footer />
      
      {/* ═══════════════════════════════════════════════════════════════════════
          GLOBAL MOBILE STYLES
          ═══════════════════════════════════════════════════════════════════════ */}
      <style jsx global>{`
        /* ─── Hero Mobile ─── */
        @media (max-width: 768px) {
          .hero-cta-row {
            flex-direction: column !important;
            width: 100% !important;
          }
          .hero-cta-row a {
            width: 100% !important;
            justify-content: center !important;
          }
        }
        
        /* ─── Trust Strip Mobile ─── */
        @media (max-width: 640px) {
          section > div[style*="gap: 64"] {
            gap: 40px !important;
          }
        }
        
        /* ─── Intro Statement Mobile ─── */
        @media (max-width: 640px) {
          section[style*="padding: clamp(120px"] {
            padding: 80px 20px !important;
          }
        }
        
        /* ─── Format Cards Mobile ─── */
        @media (max-width: 900px) {
          .format-grid {
            grid-template-columns: 1fr !important;
          }
          .format-card {
            padding: 32px 24px !important;
          }
          .format-card span[style*="fontSize: 64"] {
            font-size: 48px !important;
            top: 16px !important;
            right: 20px !important;
          }
        }
        
        /* ─── Candid Moments Mobile ─── */
        @media (max-width: 640px) {
          .candid-slider > div {
            flex: 0 0 280px !important;
          }
        }
        
        /* ─── Upcoming Cards Mobile ─── */
        @media (max-width: 480px) {
          .upcoming-card {
            flex: 0 0 90vw !important;
          }
          .upcoming-card > div:last-child {
            padding: 20px !important;
          }
        }
        
        /* ─── Past Boardrooms Mobile ─── */
        @media (max-width: 480px) {
          .past-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .past-card {
            aspect-ratio: 16/10 !important;
          }
        }
        
        /* ─── Video Grid Mobile ─── */
        @media (max-width: 640px) {
          .videos-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
        }
        @media (max-width: 400px) {
          .videos-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        
        /* ─── General Mobile Typography ─── */
        @media (max-width: 640px) {
          h1 {
            font-size: clamp(40px, 12vw, 56px) !important;
          }
          h2 {
            font-size: clamp(28px, 7vw, 36px) !important;
          }
        }
        
        /* ─── Touch Targets ─── */
        @media (max-width: 768px) {
          button, a[style*="padding"] {
            min-height: 44px;
          }
        }
        
        /* ─── Spacing Adjustments ─── */
        @media (max-width: 640px) {
          section {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════════════════

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={ref} style={{ position: "relative", height: "100vh", minHeight: 700, overflow: "hidden" }}>
      <motion.div style={{ position: "absolute", inset: 0, y, scale }}>
        <img src={`${S3}/network-first/gallery-03.jpg`} alt="Network First executive boardroom session" style={{ width: "100%", height: "120%", objectFit: "cover", filter: "brightness(0.4)" }} />
      </motion.div>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${BG} 0%, transparent 20%, transparent 70%, ${BG} 100%)` }} />

      <motion.div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 24px", opacity }}>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }} style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 24 }}>NetworkFirst Boardrooms</motion.p>
        
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: EASE_OUT }} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(56px, 14vw, 160px)", fontWeight: 600, lineHeight: 0.9, letterSpacing: "-0.04em", margin: 0, color: TEXT }}>The Room.</motion.h1>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} style={{ fontSize: "clamp(17px, 2.2vw, 21px)", fontWeight: 400, color: TEXT_50, maxWidth: 600, marginTop: 24, lineHeight: 1.6 }}>Join an exclusive event experience tailored for leaders seeking to expand their network, foster peer connections, and engage in in-depth discussions.</motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }} className="hero-cta-row" style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="#get-started"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 32px", background: GOLD, color: BG, borderRadius: 980, fontSize: 15, fontWeight: 500, textDecoration: "none", minWidth: 180, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#D9A96A"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${GOLD_30}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            Host a Boardroom
          </Link>
          <Link
            href="#get-started"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 32px", background: "transparent", color: TEXT, border: `1px solid ${TEXT_30}`, borderRadius: 980, fontSize: 15, fontWeight: 500, textDecoration: "none", minWidth: 140, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = TEXT_30; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Request Invite
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.4 }} style={{ display: "flex", gap: 56, marginTop: 64 }} className="hero-stats">
          {[{ v: "300+", l: "Boardrooms" }, { v: "9,000+", l: "Executives" }, { v: "90+", l: "Hosts" }].map((s) => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: GOLD, margin: 0, letterSpacing: "-0.02em" }}>{s.v}</p>
              <p style={{ fontSize: 11, color: TEXT_50, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{s.l}</p>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ duration: 1, delay: 1.8 }} style={{ position: "absolute", bottom: 40 }}>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
        </motion.div>
      </motion.div>
      <style jsx global>{`
        @media (max-width: 640px) { 
          .hero-stats { 
            flex-direction: row !important; 
            gap: 32px !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
          }
        }
        @media (max-width: 400px) {
          .hero-stats {
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRUST STRIP — Animated Marquee with Larger Logos
// ═══════════════════════════════════════════════════════════════════════════════

function TrustStrip() {
  return (
    <section style={{ padding: "40px 0", background: BG_ALT, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, overflow: "hidden" }}>
      <p style={{ fontSize: 11, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center", marginBottom: 24 }}>Trusted By</p>
      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ display: "flex", gap: 64, alignItems: "center" }}>
        {[...TRUST_LOGOS, ...TRUST_LOGOS].map((logo, i) => (
          <img key={i} src={logo.src} alt="Network First executive boardroom session" style={{ height: 56, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.85, flexShrink: 0 }} />
        ))}
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTRO STATEMENT
// ═══════════════════════════════════════════════════════════════════════════════

function IntroStatement() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(80px, 12vw, 140px) 24px", background: BG, overflow: "hidden" }}>
      {/* Backdrop: boardroom photo — heavily darkened & blurred */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/networkfirst/boardroom-25.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px) brightness(0.18) saturate(0.6)",
        }}
      />
      {/* Geometric gold wireframe grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(201,147,90,0.04) 0px, rgba(201,147,90,0.04) 1px, transparent 1px, transparent 80px),
            repeating-linear-gradient(90deg, rgba(201,147,90,0.04) 0px, rgba(201,147,90,0.04) 1px, transparent 1px, transparent 80px)
          `,
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 100%)",
        }}
      />
      {/* Dark vignette edges */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 75% 60% at 50% 50%, transparent 0%, #0a0a0a 100%)" }} />
      {/* Gold orb glow — left side */}
      <div className="absolute pointer-events-none" style={{ top: "10%", left: "10%", width: 500, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,147,90,0.07) 0%, transparent 70%)", filter: "blur(80px)" }} />
      {/* Subtle top/bottom border lines */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(201,147,90,0.15) 50%, transparent 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(201,147,90,0.15) 50%, transparent 100%)" }} />

      <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", display: "flex", gap: 32 }}>
        {/* Vertical gold accent bar */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={inView ? { opacity: 1, scaleY: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          style={{
            width: 2,
            height: 60,
            background: GOLD,
            flexShrink: 0,
            marginTop: 12,
            transformOrigin: "top",
            boxShadow: "0 0 12px rgba(201,147,90,0.3)",
          }}
        />

        <div style={{ position: "relative" }}>
          {/* Oversized decorative quotation mark — top-left */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.15 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -50,
              left: -10,
              fontFamily: "Georgia, serif",
              fontSize: "clamp(80px, 12vw, 140px)",
              fontWeight: 400,
              lineHeight: 1,
              color: GOLD,
              userSelect: "none",
            }}
          >
            &ldquo;
          </motion.span>

          {/* Quote text */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: EASE_OUT }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(26px, 4.5vw, 44px)",
              fontWeight: 500,
              lineHeight: 1.55,
              letterSpacing: "-0.01em",
              color: "#F0EBE3",
              margin: 0,
              textAlign: "left",
            }}
          >
            We design and manage exclusive executive networking roundtables and virtual boardrooms{" "}
            <span style={{ color: "rgba(240,235,227,0.4)" }}>that bring together C-level decision-makers</span>{" "}
            <span style={{ color: GOLD }}>for meaningful engagement.</span>
          </motion.p>

          {/* Attribution */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.6 } : {}}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE_OUT }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: GOLD,
              marginTop: 36,
              textAlign: "left",
            }}
          >
            &mdash; NetworkFirst
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WHY BOARDROOMS WORK
// ═══════════════════════════════════════════════════════════════════════════════

function WhyBoardroomsWork() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const comparisons = [
    { label: "Conferences", old: "Your booth is one of hundreds. You fight for attention.", ours: "Your brand owns the room. Every executive is there for you." },
    { label: "Digital Ads", old: "Impressions and clicks. No real conversations.", ours: "Face-to-face conversations that build real trust." },
    { label: "Cold Outreach", old: "Gatekeepers. Ignored emails. Months for one meeting.", ours: "Warm introductions. 15 meetings in one morning." },
  ];

  const pillars = [
    { stat: "15+", label: "Executive Meetings", sub: "per boardroom session" },
    { stat: "C-Suite", label: "Decision Makers", sub: "curated, never random" },
    { stat: "100%", label: "Brand Ownership", sub: "your room, your story" },
  ];

  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden", background: BG }}>
      {/* ── Top: Image-backed header ── */}
      <div style={{ position: "relative", padding: "clamp(80px, 10vw, 120px) 24px clamp(60px, 8vw, 80px)" }}>
        {/* Boardroom photo backdrop */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(/networkfirst/boardroom-07.jpg)", backgroundSize: "cover", backgroundPosition: "center 30%", filter: "brightness(0.14) saturate(0.5)", }} />
        {/* Dark vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 0%, #000000 100%)" }} />
        {/* Gold accent wash */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(201,147,90,0.04) 0%, transparent 60%)" }} />
        {/* Bottom fade to black */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 120, background: "linear-gradient(to top, #000000 0%, transparent 100%)" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <p style={{ fontSize: 13, color: GOLD, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 20, fontWeight: 600 }}>The Boardroom Advantage</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 6.5vw, 62px)", fontWeight: 800, lineHeight: 1.1, margin: 0, letterSpacing: "-0.03em", color: TEXT }}>
              Why boardrooms work
            </h2>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 6.5vw, 62px)", fontWeight: 800, lineHeight: 1.1, margin: "4px 0 0", letterSpacing: "-0.03em", color: GOLD_50 }}>
              when everything else doesn&apos;t.
            </h2>
          </motion.div>
        </div>
      </div>

      {/* ── Comparison Table: Old Way vs. Boardroom Way ── */}
      <div style={{ background: BG, padding: "0 24px clamp(32px, 4vw, 48px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Table header */}
          <motion.div
            variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{ display: "grid", gridTemplateColumns: "140px 1fr 40px 1fr", gap: 0, padding: "20px 0", borderBottom: `1px solid ${BORDER}`, marginBottom: 0 }}
            className="comparison-table-header"
          >
            <div />
            <p style={{ fontSize: 12, color: TEXT_30, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>The Old Way</p>
            <div />
            <p style={{ fontSize: 12, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>The Boardroom Way</p>
          </motion.div>

          {/* Table rows */}
          {comparisons.map((c, i) => (
            <motion.div
              key={c.label}
              variants={fadeUp} custom={i} initial="hidden" animate={inView ? "visible" : "hidden"}
              style={{ display: "grid", gridTemplateColumns: "140px 1fr 40px 1fr", gap: 0, padding: "28px 0", borderBottom: `1px solid rgba(255,255,255,0.04)`, alignItems: "start" }}
              className="comparison-table-row"
            >
              {/* Label */}
              <p style={{ fontSize: 15, color: GOLD, fontWeight: 600, margin: 0, paddingTop: 2 }}>{c.label}</p>
              {/* Old way */}
              <p style={{ fontSize: 16, color: TEXT_30, lineHeight: 1.65, margin: 0, textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.12)" }}>{c.old}</p>
              {/* Arrow divider */}
              <div className="flex items-center justify-center">
                <span style={{ color: GOLD_30, fontSize: 18 }}>→</span>
              </div>
              {/* Boardroom way */}
              <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.65, margin: 0, fontWeight: 500 }}>{c.ours}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Pillar Stats Strip ── */}
      <div style={{ background: BG, padding: "clamp(24px, 4vw, 40px) 24px clamp(60px, 8vw, 80px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <motion.div
            variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}
            className="pillars-strip"
          >
            {pillars.map((p, i) => (
              <motion.div
                key={p.label} variants={fadeUp} custom={i}
                style={{
                  textAlign: "center",
                  padding: "28px 24px",
                  borderLeft: i > 0 ? `1px solid rgba(201,147,90,0.12)` : "none",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px, 6vw, 60px)",
                  fontWeight: 800,
                  color: GOLD,
                  display: "block",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}>{p.stat}</span>
                <h4 style={{ fontSize: 19, fontWeight: 700, color: TEXT, margin: "16px 0 6px", letterSpacing: "-0.01em" }}>{p.label}</h4>
                <p style={{ fontSize: 14, color: TEXT_30, margin: 0, fontWeight: 400 }}>{p.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .comparison-table-header { display: none !important; }
          .comparison-table-row {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            padding: 24px 0 !important;
          }
          .comparison-table-row > div:nth-child(3) { display: none !important; }
          .pillars-strip {
            grid-template-columns: 1fr !important;
          }
          .pillars-strip > div {
            border-left: none !important;
            border-bottom: 1px solid rgba(201,147,90,0.12) !important;
            padding: 32px 0 !important;
          }
          .pillars-strip > div:last-child { border-bottom: none !important; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE FORMAT
// ═══════════════════════════════════════════════════════════════════════════════

function TheFormat() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const steps = [
    { num: "01", title: "We Design Your Agenda", desc: "Tailored content aligned to your goals. Every topic, every panel — built around what matters to your pipeline." },
    { num: "02", title: "We Fill Your Room", desc: "Multi-channel outreach to C-level executives. We identify, invite, and confirm decision-makers who match your ICP." },
    { num: "03", title: "We Execute Flawlessly", desc: "5-star venues, premium branding, curated menus. You walk in and own the room — we handle every detail." },
  ];

  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden", background: BG }}>
      {/* ── Full-bleed boardroom photo — fades from left into content ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: EASE_OUT }}
        className="absolute inset-0 pointer-events-none"
      >
        <img
          src="/networkfirst/boardroom-executives.jpg"
          alt="Network First executive boardroom session"
          style={{ position: "absolute", top: 0, left: 0, width: "55%", height: "100%", objectFit: "cover", filter: "brightness(0.4) saturate(0.7)" }}
          className="format-bg-img"
        />
        {/* Smooth fade from image → dark */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "60%", height: "100%", background: "linear-gradient(to right, transparent 30%, #000000 100%)" }} className="format-bg-fade" />
        {/* Gold tint on image */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "55%", height: "100%", background: "linear-gradient(160deg, rgba(201,147,90,0.1) 0%, transparent 40%)" }} />
        {/* Top/bottom section bleed */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #000000 0%, transparent 8%, transparent 92%, #000000 100%)" }} />
        {/* Subtle gold grid on the right (content area) */}
        <div style={{
          position: "absolute", top: 0, right: 0, width: "55%", height: "100%",
          backgroundImage: "repeating-linear-gradient(0deg, rgba(201,147,90,0.025) 0px, rgba(201,147,90,0.025) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, rgba(201,147,90,0.025) 0px, rgba(201,147,90,0.025) 1px, transparent 1px, transparent 80px)",
          maskImage: "radial-gradient(ellipse 90% 80% at 60% 50%, black 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 60% 50%, black 0%, transparent 100%)",
        }} />
      </motion.div>

      {/* Thin gold horizontal accent at top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(201,147,90,0.2) 50%, transparent 100%)`, zIndex: 2 }} />

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative", zIndex: 1 }} className="format-layout">
        {/* Left spacer — image shows through */}
        <div className="format-spacer" />

        {/* Right: Content */}
        <div style={{ padding: "clamp(64px, 8vw, 100px) clamp(40px, 5vw, 72px)" }}>
          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
            <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
              <span style={{ width: 28, height: 1, background: GOLD }} />
              <p style={{ fontSize: 12, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>The Format</p>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5.5vw, 52px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 14px", color: TEXT }}>
              How it works<span style={{ color: GOLD }}>?</span>
            </h2>
            <p style={{ fontSize: 15, color: TEXT_30, lineHeight: 1.65, margin: "0 0 36px", maxWidth: 460 }}>
              Three steps. One seamless experience. We handle everything so you can focus on building relationships.
            </p>
          </motion.div>

          {/* Steps — with card-like treatment */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                variants={fadeUp} custom={i} initial="hidden" animate={inView ? "visible" : "hidden"}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  gap: 20,
                  padding: "24px 24px 24px 20px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(201,147,90,0.08)",
                  borderRadius: 14,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Subtle left accent bar */}
                <div style={{ position: "absolute", top: 12, bottom: 12, left: 0, width: 2, background: `linear-gradient(to bottom, ${GOLD}, ${GOLD_30})`, borderRadius: 1 }} />
                {/* Number circle */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 2 }}>
                  <div style={{
                    width: 44, height: 44,
                    borderRadius: "50%",
                    border: `1.5px solid ${GOLD_30}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(201,147,90,0.06)",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: GOLD }}>{s.num}</span>
                  </div>
                </div>
                {/* Text */}
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: TEXT, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, fontWeight: 400, color: TEXT_50, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom summary strip */}
          <motion.div
            variants={fadeUp} custom={4} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{
              marginTop: 28,
              padding: "24px 28px",
              background: "rgba(201,147,90,0.04)",
              border: "1px solid rgba(201,147,90,0.1)",
              borderRadius: 14,
              display: "flex",
              justifyContent: "space-between",
            }}
            className="format-summary"
          >
            {[
              { val: "End-to-End", label: "Managed Service" },
              { val: "5-Star", label: "Venue Standard" },
              { val: "100%", label: "Your Brand" },
            ].map((item, i) => (
              <div key={item.label} style={{ textAlign: "center", flex: 1, borderLeft: i > 0 ? "1px solid rgba(201,147,90,0.1)" : "none", paddingLeft: i > 0 ? 20 : 0 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: GOLD, display: "block", lineHeight: 1 }}>{item.val}</span>
                <span style={{ fontSize: 12, color: TEXT_30, marginTop: 6, display: "block" }}>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Thin gold horizontal accent at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(201,147,90,0.2) 50%, transparent 100%)`, zIndex: 2 }} />

      <style jsx global>{`
        @media (max-width: 900px) {
          .format-layout { grid-template-columns: 1fr !important; }
          .format-spacer { display: none !important; }
          .format-bg-img { width: 100% !important; filter: brightness(0.2) saturate(0.4) !important; }
          .format-bg-fade { width: 100% !important; background: linear-gradient(to bottom, transparent 0%, #000000 70%) !important; }
          .format-summary { gap: 16px !important; flex-wrap: wrap; }
          .format-summary > div { border-left: none !important; padding-left: 0 !important; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANDID MOMENTS
// ═══════════════════════════════════════════════════════════════════════════════

function CandidMoments() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} style={{ padding: "clamp(40px, 6vw, 60px) 0", overflow: "hidden" }}>
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1.2 }}>
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} style={{ display: "flex", gap: 12 }}>
          {[...CANDID_MOMENTS, ...CANDID_MOMENTS].map((src, i) => (
            <div key={i} style={{ flex: "0 0 320px", aspectRatio: "3/2", borderRadius: 12, overflow: "hidden" }}>
              <img src={src} alt="Network First executive boardroom session" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85)" }} />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WHY HOST
// ═══════════════════════════════════════════════════════════════════════════════

function WhyHost() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const benefits = [
    { num: "01", title: "Private & Intimate Setting", desc: "Managed roundtables in a private setting. No noise, no crowds — just you and the decision-makers who matter." },
    { num: "02", title: "Tailored Agenda", desc: "We co-design every session around your goals. Every topic, every conversation drives pipeline value." },
    { num: "03", title: "End-to-End Management", desc: "From delegate acquisition to flawless on-site execution — we handle everything so you can focus on relationships." },
    { num: "04", title: "Post-Event ROI", desc: "Comprehensive attendee database with insights, contacts, and follow-up opportunities to nurture long after the event." },
  ];

  const metrics = [
    { value: "15+", label: "Meetings Per Room" },
    { value: "48hr", label: "Lead Follow-Up" },
  ];

  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden", padding: "clamp(80px, 10vw, 120px) 24px", background: BG_ALT }}>
      {/* Subtle ambient gold orb */}
      <div className="absolute pointer-events-none" style={{ top: "-10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,147,90,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: GOLD }} />
            <p style={{ fontSize: 12, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>Why Host With Us</p>
            <span style={{ width: 28, height: 1, background: GOLD }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px, 5vw, 48px)", fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.03em", color: TEXT, lineHeight: 1.15 }}>
            Your brand. Your room.<br /><span style={{ color: GOLD_50 }}>Our expertise.</span>
          </h2>
          <p style={{ fontSize: 15, color: TEXT_30, lineHeight: 1.65, margin: "0 auto", maxWidth: 520 }}>
            Everything you need to host a boardroom that builds pipeline, strengthens relationships, and delivers measurable ROI.
          </p>
        </motion.div>

        {/* 2x2 Benefit Cards */}
        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="benefits-grid">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title} variants={fadeUp} custom={i}
              style={{
                padding: "32px 28px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(201,147,90,0.08)",
                borderRadius: 14,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Large faded number */}
              <span style={{
                position: "absolute", top: 16, right: 20,
                fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 800,
                color: GOLD_15, lineHeight: 1, pointerEvents: "none",
              }}>{b.num}</span>
              {/* Gold top accent */}
              <div style={{ position: "absolute", top: 0, left: 24, width: 40, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_30})`, borderRadius: 1 }} />
              {/* Content */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: TEXT, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: TEXT_50, lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Metrics Strip */}
        <motion.div
          variants={fadeUp} custom={5} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            marginTop: 24,
            padding: "28px 32px",
            background: "rgba(201,147,90,0.04)",
            border: "1px solid rgba(201,147,90,0.1)",
            borderRadius: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="metrics-strip"
        >
          {metrics.map((m, i) => (
            <div key={m.label} style={{ textAlign: "center", flex: 1, borderLeft: i > 0 ? "1px solid rgba(201,147,90,0.1)" : "none", paddingLeft: i > 0 ? 24 : 0 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: GOLD, display: "block", lineHeight: 1 }}>{m.value}</span>
              <span style={{ fontSize: 13, color: TEXT_30, marginTop: 6, display: "block", fontWeight: 400 }}>{m.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .benefits-grid { grid-template-columns: 1fr !important; }
          .metrics-strip { flex-direction: column !important; gap: 20px !important; }
          .metrics-strip > div { border-left: none !important; padding-left: 0 !important; border-top: 1px solid rgba(201,147,90,0.1); padding-top: 16px; }
          .metrics-strip > div:first-child { border-top: none !important; padding-top: 0 !important; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EDITORIAL BREAK
// ═══════════════════════════════════════════════════════════════════════════════

function EditorialBreak({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1.2 }} style={{ position: "relative", width: "100%", height: "60vh", minHeight: 360, maxHeight: 600, overflow: "hidden" }}>
      <motion.img src={src} alt="Network First executive boardroom session" style={{ width: "100%", height: "130%", objectFit: "cover", filter: "brightness(0.5)", y }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${BG} 0%, transparent 15%, transparent 80%, ${BG} 100%)` }} />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE EXPERIENCE
// ═══════════════════════════════════════════════════════════════════════════════

function ExperienceCard({ tag, title, desc, delay }: { tag: string; title: string; desc: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
      style={{ height: "100%" }}
    >
      <div style={{
        padding: "28px 26px 28px 28px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(201,147,90,0.08)",
        borderRadius: 14,
        position: "relative",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Gold top accent */}
        <div style={{ position: "absolute", top: 0, left: 24, width: 40, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_30})`, borderRadius: 1 }} />
        {/* Gold left accent */}
        <div style={{ position: "absolute", top: 14, bottom: 14, left: 0, width: 2, background: `linear-gradient(to bottom, ${GOLD}, ${GOLD_30})`, borderRadius: 1 }} />
        {/* Tag */}
        <span style={{
          display: "inline-block",
          fontSize: 10,
          fontWeight: 600,
          color: GOLD,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          background: "rgba(201,147,90,0.08)",
          border: "1px solid rgba(201,147,90,0.12)",
          borderRadius: 6,
          padding: "4px 10px",
          marginBottom: 14,
          width: "fit-content",
        }}>{tag}</span>
        <h4 style={{ fontSize: 20, fontWeight: 700, color: TEXT, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{title}</h4>
        <p style={{ fontSize: 14, color: TEXT_50, lineHeight: 1.7, margin: 0, flex: 1 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

function TheExperience() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const features = [
    { tag: "Venue", title: "5-Star Hotel Venues", desc: "World-class venues with curated menus that match the caliber of your guests." },
    { tag: "Design", title: "Captivating Collateral", desc: "Landing pages and brochures designed to attract and engage your target audience." },
    { tag: "Identity", title: "Premium Branding", desc: "On-site execution with premium branding that positions your company front and center." },
    { tag: "Outreach", title: "Strategic Acquisition", desc: "Multi-channel outreach including calls, email, LinkedIn campaigns to fill your room with decision-makers." },
  ];

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(80px, 10vw, 120px) 24px", overflow: "hidden" }}>
      {/* Ambient gold orb */}
      <div className="absolute pointer-events-none" style={{ bottom: "-15%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,147,90,0.04) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: GOLD }} />
            <p style={{ fontSize: 12, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>The Experience</p>
            <span style={{ width: 28, height: 1, background: GOLD }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5.5vw, 52px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 14px", letterSpacing: "-0.03em", color: TEXT }}>
            What you get<span style={{ color: GOLD }}>.</span>
          </h2>
          <p style={{ fontSize: 15, color: TEXT_30, lineHeight: 1.65, margin: "0 auto", maxWidth: 480 }}>
            A full-service boardroom experience — from venue to follow-up, every detail is handled.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="exp-bento" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "auto auto auto auto",
          gap: 16,
        }}>
          {/* Feature 1 — top left */}
          <div style={{ gridColumn: "1", gridRow: "1" }}>
            <ExperienceCard tag={features[0].tag} title={features[0].title} desc={features[0].desc} delay={0} />
          </div>

          {/* Image 1 — top right, spans 2 rows */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
            style={{ gridColumn: "2", gridRow: "1 / 3", minHeight: 300 }}
          >
            <div style={{
              borderRadius: 14,
              overflow: "hidden",
              height: "100%",
              border: "1px solid rgba(201,147,90,0.1)",
              position: "relative",
            }}>
              <img
                src="/networkfirst/boardroom-22.jpg"
                alt="Boardroom experience"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65) saturate(0.85)" }}
              />
              {/* Dark bottom gradient for text legibility */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
              {/* Gold tint */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(201,147,90,0.1) 0%, transparent 40%)" }} />
              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0" style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: 13, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 4px", fontWeight: 600 }}>Curated Spaces</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.5 }}>Every venue hand-picked to match the caliber of your audience.</p>
              </div>
            </div>
          </motion.div>

          {/* Feature 2 — second row left */}
          <div style={{ gridColumn: "1", gridRow: "2" }}>
            <ExperienceCard tag={features[1].tag} title={features[1].title} desc={features[1].desc} delay={0.1} />
          </div>

          {/* Image 2 — third row left, spans 2 rows */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }}
            style={{ gridColumn: "1", gridRow: "3 / 5", minHeight: 260 }}
          >
            <div style={{
              borderRadius: 14,
              overflow: "hidden",
              height: "100%",
              border: "1px solid rgba(201,147,90,0.1)",
              position: "relative",
            }}>
              <img
                src="/networkfirst/boardroom-09.jpg"
                alt="Executive networking"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65) saturate(0.85)" }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(200deg, rgba(201,147,90,0.1) 0%, transparent 40%)" }} />
              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0" style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: 13, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 4px", fontWeight: 600 }}>Real Connections</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.5 }}>Intimate settings where conversations turn into partnerships.</p>
              </div>
            </div>
          </motion.div>

          {/* Feature 3 — third row right */}
          <div style={{ gridColumn: "2", gridRow: "3" }}>
            <ExperienceCard tag={features[2].tag} title={features[2].title} desc={features[2].desc} delay={0.2} />
          </div>

          {/* Feature 4 — fourth row right */}
          <div style={{ gridColumn: "2", gridRow: "4" }}>
            <ExperienceCard tag={features[3].tag} title={features[3].title} desc={features[3].desc} delay={0.3} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .exp-bento {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
          }
          .exp-bento > * {
            grid-column: 1 !important;
            grid-row: auto !important;
            min-height: auto !important;
          }
          .exp-bento > *:nth-child(2),
          .exp-bento > *:nth-child(5) {
            min-height: 220px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE JOURNEY
// ═══════════════════════════════════════════════════════════════════════════════

function TheJourney() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    {
      num: "01",
      title: "Discovery Call",
      desc: "We understand your objectives, target audience, and ideal topics. Together we define what success looks like.",
      duration: "Week 1",
    },
    {
      num: "02",
      title: "Guest Curation",
      desc: "We identify and personally invite 15-20 qualified executives. Title, organization, and relevance to your ICP — every seat earned.",
      duration: "Weeks 2-4",
    },
    {
      num: "03",
      title: "Content Alignment",
      desc: "Agenda development, talking points, and moderator preparation. Your narrative, refined and ready.",
      duration: "Weeks 3-5",
    },
    {
      num: "04",
      title: "Event Execution",
      desc: "Five-star venue, full production, seamless experience. You focus on conversations — we handle everything else.",
      duration: "Event Day",
    },
    {
      num: "05",
      title: "Post-Event",
      desc: "Content delivery, warm introductions, feedback summary. Pipeline building continues long after the room clears.",
      duration: "Week 6-8",
    },
  ];

  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden", padding: "clamp(80px, 10vw, 120px) 24px", background: BG }}>
      {/* Gold border top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(201,147,90,0.15) 50%, transparent 100%)`, zIndex: 2 }} />

      {/* Ambient orb */}
      <div className="absolute pointer-events-none" style={{ top: "30%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,147,90,0.03) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: GOLD }} />
            <p style={{ fontSize: 12, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>From Kickoff to Close</p>
            <span style={{ width: 28, height: 1, background: GOLD }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5.5vw, 52px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 14px", letterSpacing: "-0.03em", color: TEXT }}>
            The journey<span style={{ color: GOLD }}>.</span>
          </h2>
          <p style={{ fontSize: 15, color: TEXT_30, lineHeight: 1.65, margin: "0 auto", maxWidth: 520 }}>
            6-8 weeks from kickoff to event day. Here&apos;s how we get you there.
          </p>
        </motion.div>

        {/* ── Desktop: Horizontal Process ── */}
        <div className="journey-desktop" style={{ display: "block" }}>
          {/* Row 1: Top row — 3 cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 18 }}>
            {steps.slice(0, 3).map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp} custom={i} initial="hidden" animate={inView ? "visible" : "hidden"}
                style={{
                  padding: "28px 24px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(201,147,90,0.08)",
                  borderRadius: 14,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Gold top accent */}
                <div style={{ position: "absolute", top: 0, left: 24, width: 36, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_30})`, borderRadius: 1 }} />
                {/* Gold left accent */}
                <div style={{ position: "absolute", top: 14, bottom: 14, left: 0, width: 2, background: `linear-gradient(to bottom, ${GOLD}, ${GOLD_30})`, borderRadius: 1 }} />
                {/* Large faded number */}
                <span style={{ position: "absolute", top: -8, right: 12, fontFamily: "var(--font-display)", fontSize: 72, fontWeight: 800, color: "rgba(201,147,90,0.04)", lineHeight: 1, pointerEvents: "none" }}>{step.num}</span>
                {/* Header row: number + duration */}
                <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(201,147,90,0.08)", border: `1.5px solid ${GOLD_30}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: GOLD }}>{step.num}</span>
                  </div>
                  <span style={{ fontSize: 11, color: GOLD, fontWeight: 600, padding: "3px 10px", background: "rgba(201,147,90,0.08)", border: "1px solid rgba(201,147,90,0.12)", borderRadius: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>{step.duration}</span>
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{step.title}</h4>
                <p style={{ fontSize: 14, color: TEXT_50, lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Connecting arrow strip */}
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex items-center justify-center gap-4" style={{ margin: "0 0 18px", padding: "10px 0" }}>
            {["Discovery", "Curation", "Alignment", "Execution", "Follow-up"].map((label, i) => (
              <div key={label} className="flex items-center gap-4">
                <span style={{ fontSize: 11, color: TEXT_30, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
                {i < 4 && <span style={{ color: GOLD_30, fontSize: 14 }}>&rarr;</span>}
              </div>
            ))}
          </motion.div>

          {/* Row 2: Bottom row — 2 wider cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
            {steps.slice(3).map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp} custom={i + 3} initial="hidden" animate={inView ? "visible" : "hidden"}
                style={{
                  padding: "28px 24px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(201,147,90,0.08)",
                  borderRadius: 14,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Gold top accent */}
                <div style={{ position: "absolute", top: 0, left: 24, width: 36, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_30})`, borderRadius: 1 }} />
                {/* Gold left accent */}
                <div style={{ position: "absolute", top: 14, bottom: 14, left: 0, width: 2, background: `linear-gradient(to bottom, ${GOLD}, ${GOLD_30})`, borderRadius: 1 }} />
                {/* Large faded number */}
                <span style={{ position: "absolute", top: -8, right: 16, fontFamily: "var(--font-display)", fontSize: 72, fontWeight: 800, color: "rgba(201,147,90,0.04)", lineHeight: 1, pointerEvents: "none" }}>{step.num}</span>
                {/* Header row */}
                <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(201,147,90,0.08)", border: `1.5px solid ${GOLD_30}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: GOLD }}>{step.num}</span>
                  </div>
                  <span style={{ fontSize: 11, color: GOLD, fontWeight: 600, padding: "3px 10px", background: "rgba(201,147,90,0.08)", border: "1px solid rgba(201,147,90,0.12)", borderRadius: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>{step.duration}</span>
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{step.title}</h4>
                <p style={{ fontSize: 14, color: TEXT_50, lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Mobile: Vertical Timeline ── */}
        <div className="journey-mobile" style={{ display: "none" }}>
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${GOLD}, ${GOLD_30}, transparent)` }} />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp} custom={i} initial="hidden" animate={inView ? "visible" : "hidden"}
                style={{ display: "flex", gap: 20, marginBottom: i === steps.length - 1 ? 0 : 20, position: "relative" }}
              >
                {/* Number circle */}
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: BG, border: `2px solid ${GOLD}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, position: "relative", zIndex: 1,
                  boxShadow: `0 0 16px rgba(201,147,90,0.2)`,
                }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: GOLD }}>{step.num}</span>
                </div>

                {/* Card */}
                <div style={{
                  flex: 1, padding: "22px 20px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(201,147,90,0.08)",
                  borderRadius: 14, position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 18, width: 28, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_30})`, borderRadius: 1 }} />
                  <div style={{ position: "absolute", top: 14, bottom: 14, left: 0, width: 2, background: `linear-gradient(to bottom, ${GOLD}, ${GOLD_30})`, borderRadius: 1 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>{step.title}</h4>
                    <span style={{ fontSize: 11, color: GOLD, fontWeight: 600, padding: "3px 10px", background: "rgba(201,147,90,0.08)", border: "1px solid rgba(201,147,90,0.12)", borderRadius: 6, whiteSpace: "nowrap" }}>{step.duration}</span>
                  </div>
                  <p style={{ fontSize: 13, color: TEXT_50, lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom summary strip */}
        <motion.div
          variants={fadeUp} custom={5} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            marginTop: 28,
            padding: "22px 32px",
            background: "rgba(201,147,90,0.04)",
            border: "1px solid rgba(201,147,90,0.1)",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: 14, color: TEXT_50, margin: 0, lineHeight: 1.6 }}>
            <span style={{ color: GOLD, fontWeight: 600 }}>Timeline:</span>{" "}
            Average 6-8 weeks from kickoff to event day. Rush delivery available for select markets.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {[["5", "Phases"], ["6-8", "Weeks"]].map(([num, label]) => (
              <div key={label} className="flex items-center gap-2">
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: GOLD }}>{num}</span>
                <span style={{ fontSize: 12, color: TEXT_30, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Gold border bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(201,147,90,0.15) 50%, transparent 100%)`, zIndex: 2 }} />

      <style jsx global>{`
        @media (max-width: 868px) {
          .journey-desktop { display: none !important; }
          .journey-mobile { display: block !important; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UPCOMING EVENTS
// ═══════════════════════════════════════════════════════════════════════════════

function UpcomingSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden", padding: "clamp(80px, 10vw, 120px) 24px", background: BG_ALT }}>
      {/* Gold border top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(201,147,90,0.15) 50%, transparent 100%)`, zIndex: 2 }} />

      {/* Ambient orb */}
      <div className="absolute pointer-events-none" style={{ top: "20%", right: "-8%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,147,90,0.04) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: GOLD }} />
            <p style={{ fontSize: 12, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>Upcoming Sessions</p>
            <span style={{ width: 28, height: 1, background: GOLD }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5.5vw, 52px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 14px", letterSpacing: "-0.03em", color: TEXT }}>
            What&apos;s next<span style={{ color: GOLD }}>.</span>
          </h2>
          <p style={{ fontSize: 15, color: TEXT_30, lineHeight: 1.65, margin: "0 auto", maxWidth: 520 }}>
            Secure your seat at an upcoming boardroom session.
          </p>
        </motion.div>

        {/* Event Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {UPCOMING_EVENTS.map((e, idx) => (
            <motion.a
              key={e.title}
              href={e.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp} custom={idx + 1} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="upcoming-event-card"
              style={{
                display: "block",
                borderRadius: 14,
                overflow: "hidden",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(201,147,90,0.08)",
                textDecoration: "none",
                position: "relative",
                padding: "clamp(28px, 4vw, 44px)",
                transition: "border-color 0.3s ease",
              }}
            >
              {/* Background event photo */}
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                <img src={e.image} alt="Network First executive boardroom session" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.2) saturate(0.7)" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.65) 100%)` }} />
              </div>
              {/* Gold top accent */}
              <div style={{ position: "absolute", top: 0, left: "clamp(32px, 4vw, 48px)", width: 40, height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_30})`, borderRadius: 1, zIndex: 2 }} />
              {/* Gold left accent */}
              <div style={{ position: "absolute", top: 20, bottom: 20, left: 0, width: 2, background: `linear-gradient(to bottom, ${GOLD}, ${GOLD_30})`, borderRadius: 1, zIndex: 2 }} />

              <div className="upcoming-inner" style={{ display: "grid", gridTemplateColumns: "auto 1px 1fr", gap: "clamp(24px, 4vw, 40px)", alignItems: "center", position: "relative", zIndex: 1 }}>
                {/* Date Block */}
                <div style={{ textAlign: "center", minWidth: 100, position: "relative" }}>
                  {idx === 0 && (
                    <span style={{
                      display: "inline-block", fontSize: 9, fontWeight: 700, color: GOLD,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      background: "rgba(201,147,90,0.1)", border: "1px solid rgba(201,147,90,0.15)",
                      borderRadius: 5, padding: "3px 10px", marginBottom: 12,
                    }}>Next Event</span>
                  )}
                  <p style={{ fontSize: 13, color: GOLD, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 2px", fontWeight: 700 }}>{e.month}</p>
                  <p style={{
                    fontFamily: "var(--font-display)", fontSize: "clamp(60px, 10vw, 100px)", fontWeight: 800,
                    color: GOLD, lineHeight: 0.85, margin: 0, letterSpacing: "-0.04em",
                    textShadow: "0 0 50px rgba(201,147,90,0.25)",
                  }}>{e.day}</p>
                  <p style={{ fontSize: 12, color: TEXT_30, letterSpacing: "0.12em", margin: "6px 0 0", fontWeight: 500 }}>{e.year}</p>
                </div>

                {/* Vertical divider */}
                <div className="upcoming-divider" style={{ width: 1, alignSelf: "stretch", background: `linear-gradient(to bottom, transparent, ${GOLD_30}, ${GOLD}, ${GOLD_30}, transparent)` }} />

                {/* Event Details */}
                <div>
                  {/* Sponsor tag */}
                  <span style={{
                    display: "inline-block", fontSize: 10, fontWeight: 700, color: BG,
                    background: GOLD, borderRadius: 5, padding: "4px 12px",
                    letterSpacing: "0.03em", marginBottom: 14,
                  }}>{e.sponsor}</span>

                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, color: TEXT, margin: "0 0 10px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>{e.title}</h3>
                  <p style={{ fontSize: 14, color: TEXT_50, margin: "0 0 18px", lineHeight: 1.6, maxWidth: 440 }}>{e.subtitle}</p>

                  {/* Meta row */}
                  <div className="flex items-center gap-4" style={{ flexWrap: "wrap", marginBottom: 20 }}>
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      <span style={{ fontSize: 13, color: TEXT_50 }}>{e.location}</span>
                    </div>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: GOLD_30 }} />
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                      <span style={{ fontSize: 13, color: TEXT_50 }}>{e.time}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    fontSize: 13, color: GOLD, fontWeight: 700,
                    padding: "12px 26px", border: `1.5px solid ${GOLD}`,
                    borderRadius: 980, transition: "all 0.3s ease",
                    letterSpacing: "0.02em",
                  }}>
                    Register Now
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Coming soon strip */}
        <motion.div
          variants={fadeUp} custom={UPCOMING_EVENTS.length + 1} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            marginTop: 24,
            padding: "18px 28px",
            background: "rgba(201,147,90,0.03)",
            border: "1px solid rgba(201,147,90,0.08)",
            borderRadius: 14,
          }}
        >
          <div className="flex items-center justify-center gap-3" style={{ flexWrap: "wrap" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, boxShadow: `0 0 12px rgba(201,147,90,0.4)` }} />
            <p style={{ fontSize: 14, color: TEXT_50, margin: 0 }}>
              More sessions coming for <span style={{ color: GOLD, fontWeight: 600 }}>Q2 &amp; Q3 2026</span> &mdash; stay tuned.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Gold border bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(201,147,90,0.15) 50%, transparent 100%)`, zIndex: 2 }} />

      <style jsx global>{`
        @media (max-width: 640px) {
          .upcoming-inner { grid-template-columns: 1fr !important; text-align: center; }
          .upcoming-inner > div:first-child { margin-bottom: 8px; }
          .upcoming-inner > div:last-child { text-align: left; }
          .upcoming-divider { display: none; }
        }
        .upcoming-event-card:hover { border-color: rgba(201,147,90,0.25) !important; }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// URGENCY BANNER
// ═══════════════════════════════════════════════════════════════════════════════

function UrgencyBanner() {
  return (
    <section style={{ padding: "56px 24px", background: BG, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: "clamp(18px, 3vw, 22px)", color: TEXT, fontWeight: 500, margin: "0 0 24px", lineHeight: 1.4 }}>Limited sponsorship slots available for Q2 2026.</p>
        <Link
          href="#get-started"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", background: GOLD, color: BG, borderRadius: 980, fontSize: 15, fontWeight: 500, textDecoration: "none", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#D9A96A"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${GOLD_30}`; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          Reserve Your Session
        </Link>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAST BOARDROOMS
// ═══════════════════════════════════════════════════════════════════════════════

function PastBoardroomsShowcase() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [activeYear, setActiveYear] = useState<"2026" | "2025" | "2024" | "2023">("2025");
  const eventsMap = {
    "2026": PAST_EVENTS_2026,
    "2025": PAST_EVENTS_2025,
    "2024": PAST_EVENTS_2024,
    "2023": PAST_EVENTS_2023,
  };
  const events = eventsMap[activeYear];

  return (
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 140px) 24px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, margin: 0, letterSpacing: "-0.02em", color: TEXT }}>300+ sessions delivered.</h2>
          <div style={{ display: "flex", gap: 4 }}>
            {(["2026", "2025", "2024", "2023"] as const).map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                style={{ padding: "10px 20px", borderRadius: 980, border: "none", background: activeYear === year ? GOLD : "transparent", color: activeYear === year ? BG : TEXT_50, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.3s ease" }}
                onMouseEnter={(e) => { if (activeYear !== year) { e.currentTarget.style.background = GOLD_15; e.currentTarget.style.color = TEXT; } }}
                onMouseLeave={(e) => { if (activeYear !== year) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = TEXT_50; } }}
              >{year}</button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeYear} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
            {events.length > 0 ? (
              <div className="past-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {events.slice(0, 12).map((e, i) => (
                  <motion.div key={e.sponsor + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.02 }} className="past-card" style={{ position: "relative", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden", border: `1px solid ${BORDER}` }}>
                    <img src={e.image} alt={e.sponsor} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${BG}ee 0%, ${BG}60 30%, transparent 50%)` }} />
                    <div style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
                      <p style={{ fontSize: 10, color: GOLD, marginBottom: 2 }}>{e.date} {activeYear}</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: 0, lineHeight: 1.2 }}>{e.sponsor}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "80px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: `1px solid ${BORDER}` }}>
                <p style={{ fontSize: 16, color: TEXT_50, margin: 0 }}>Events for {activeYear} coming soon.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <style jsx global>{`@media (max-width: 1100px) { .past-grid { grid-template-columns: repeat(3, 1fr) !important; } } @media (max-width: 768px) { .past-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESULTS THAT MATTER
// ═══════════════════════════════════════════════════════════════════════════════

function AnimatedCounter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { damping: 40, stiffness: 80 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, target, motionVal]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(target >= 1000 ? Math.round(v).toLocaleString() : String(Math.round(v)));
    });
    return unsubscribe;
  }, [spring, target]);

  return (
    <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 52px)", fontWeight: 800, color: GOLD, letterSpacing: "-0.03em", lineHeight: 1, textShadow: "0 0 40px rgba(201,147,90,0.2)" }}>
      {display}{suffix}
    </span>
  );
}

function CircularProgress({ percent, size, inView }: { percent: number; size: number; inView: boolean }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const spring = useSpring(circ, { damping: 40, stiffness: 60 });
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    if (inView) {
      const target = circ - (percent / 100) * circ;
      spring.set(target);
    }
  }, [inView, percent, circ, spring]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setOffset(v));
    return unsub;
  }, [spring]);

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(201,147,90,0.08)" strokeWidth={6} />
      {/* Progress */}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={GOLD} strokeWidth={6} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ filter: "drop-shadow(0 0 8px rgba(201,147,90,0.3))" }} />
    </svg>
  );
}

function SemiGauge({ value, max, size, inView }: { value: number; max: number; size: number; inView: boolean }) {
  const r = (size - 8) / 2;
  const halfCirc = Math.PI * r;
  const spring = useSpring(halfCirc, { damping: 40, stiffness: 60 });
  const [offset, setOffset] = useState(halfCirc);

  useEffect(() => {
    if (inView) {
      const target = halfCirc - (value / max) * halfCirc;
      spring.set(target);
    }
  }, [inView, value, max, halfCirc, spring]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setOffset(v));
    return unsub;
  }, [spring]);

  return (
    <svg width={size} height={size / 2 + 8} style={{ flexShrink: 0 }}>
      {/* Track */}
      <path d={`M 4 ${size / 2} A ${r} ${r} 0 0 1 ${size - 4} ${size / 2}`} fill="none" stroke="rgba(201,147,90,0.08)" strokeWidth={6} strokeLinecap="round" />
      {/* Progress */}
      <path d={`M 4 ${size / 2} A ${r} ${r} 0 0 1 ${size - 4} ${size / 2}`} fill="none" stroke={GOLD} strokeWidth={6} strokeLinecap="round" strokeDasharray={halfCirc} strokeDashoffset={offset} style={{ filter: "drop-shadow(0 0 8px rgba(201,147,90,0.3))" }} />
    </svg>
  );
}

function ResultsThatMatter() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const companyStats = [
    { target: 300, suffix: "+", label: "Boardrooms" },
    { target: 9000, suffix: "+", label: "Executives" },
    { target: 90, suffix: "+", label: "Hosts" },
    { target: 6, suffix: "+", label: "Global Markets" },
  ];

  const outcomes = [
    { value: 12, suffix: "avg", label: "Qualified Meetings", desc: "Per boardroom session", type: "counter" as const },
    { value: 85, suffix: "%", label: "Pipeline Generated", desc: "Within 90 days", type: "ring" as const },
    { value: 40, suffix: "%", label: "Follow-Up Requests", desc: "Attendees seeking conversations", type: "ring" as const },
    { value: 92, suffix: "", label: "Net Promoter Score", desc: "Sponsor satisfaction", type: "gauge" as const },
  ];

  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden", padding: "clamp(80px, 10vw, 120px) 24px", background: BG_ALT }}>
      {/* Gold border top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(201,147,90,0.15) 50%, transparent 100%)`, zIndex: 2 }} />

      {/* Ambient orbs */}
      <div className="absolute pointer-events-none" style={{ top: "10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,147,90,0.04) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute pointer-events-none" style={{ bottom: "10%", right: "-5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,147,90,0.03) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="flex items-center justify-center gap-3" style={{ marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: GOLD }} />
            <p style={{ fontSize: 12, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>Measurable Impact</p>
            <span style={{ width: 28, height: 1, background: GOLD }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5.5vw, 52px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 14px", letterSpacing: "-0.03em", color: TEXT }}>
            Results that matter<span style={{ color: GOLD }}>.</span>
          </h2>
          <p style={{ fontSize: 15, color: TEXT_30, lineHeight: 1.65, margin: "0 auto", maxWidth: 520 }}>
            Not vanity metrics. Real outcomes that impact your bottom line.
          </p>
        </motion.div>

        {/* Company stats — animated counters */}
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate={inView ? "visible" : "hidden"} className="impact-stats-strip" style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
          marginBottom: 20, position: "relative",
          background: "rgba(201,147,90,0.04)", border: "1px solid rgba(201,147,90,0.1)", borderRadius: 14,
          padding: "36px 0",
        }}>
          {companyStats.map((s, i) => (
            <div key={s.label} style={{
              textAlign: "center", position: "relative",
              borderRight: i < companyStats.length - 1 ? `1px solid rgba(201,147,90,0.1)` : "none",
              padding: "0 20px",
            }}>
              <AnimatedCounter target={s.target} suffix={s.suffix} inView={inView} />
              <p style={{ fontSize: 12, fontWeight: 600, color: TEXT_50, marginTop: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Section label */}
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${GOLD_30}, transparent)` }} />
          <span style={{ fontSize: 11, color: GOLD, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Outcomes Per Session</span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(270deg, ${GOLD_30}, transparent)` }} />
        </motion.div>

        {/* Outcome cards — mixed visuals */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }} className="results-grid">
          {outcomes.map((o, i) => (
            <motion.div key={o.label} variants={fadeUp} custom={i} initial="hidden" animate={inView ? "visible" : "hidden"} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(201,147,90,0.08)",
              borderRadius: 14, padding: "28px 20px",
              position: "relative", overflow: "hidden",
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
            }}>
              {/* Gold top accent */}
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 36, height: 2, background: `linear-gradient(90deg, ${GOLD_30}, ${GOLD}, ${GOLD_30})`, borderRadius: 1 }} />

              {/* Visual */}
              {o.type === "ring" && (
                <div style={{ position: "relative", marginBottom: 16 }}>
                  <CircularProgress percent={o.value} size={100} inView={inView} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: GOLD, letterSpacing: "-0.02em" }}>{o.value}<span style={{ fontSize: 14, color: GOLD_50 }}>%</span></span>
                  </div>
                </div>
              )}
              {o.type === "gauge" && (
                <div style={{ position: "relative", marginBottom: 8 }}>
                  <SemiGauge value={o.value} max={100} size={110} inView={inView} />
                  <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: GOLD, letterSpacing: "-0.02em" }}>{o.value}</span>
                  </div>
                </div>
              )}
              {o.type === "counter" && (
                <div style={{ marginBottom: 16, marginTop: 8 }}>
                  <AnimatedCounter target={o.value} suffix="" inView={inView} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: GOLD_50, marginLeft: 2 }}>{o.suffix}</span>
                </div>
              )}

              <h4 style={{ fontSize: 15, fontWeight: 700, color: TEXT, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{o.label}</h4>
              <p style={{ fontSize: 13, color: TEXT_50, margin: 0, lineHeight: 1.55 }}>{o.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footnote strip */}
        <motion.div
          variants={fadeUp} custom={2} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            marginTop: 24,
            padding: "18px 28px",
            background: "rgba(201,147,90,0.03)",
            border: "1px solid rgba(201,147,90,0.08)",
            borderRadius: 14,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 12, color: TEXT_30, fontStyle: "italic", margin: 0 }}>
            Based on aggregate sponsor feedback across 100+ boardroom sessions.
          </p>
        </motion.div>
      </div>

      {/* Gold border bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, rgba(201,147,90,0.15) 50%, transparent 100%)`, zIndex: 2 }} />

      <style jsx global>{`
        @media (max-width: 900px) {
          .results-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .impact-stats-strip { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; padding: 24px 0 !important; }
          .impact-stats-strip > div { border-right: none !important; }
        }
        @media (max-width: 480px) {
          .results-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════════

function VideoTestimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const videos = ["SH9Z1U2_rAM", "wLgYOHHB6o4", "2jpIlqo0HSY", "SLkj5gO-LQ8"];

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(100px, 12vw, 140px) 24px", background: BG_ALT, overflow: "hidden" }}>
      {/* Ambient orb */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD_15} 0%, transparent 70%)`, pointerEvents: "none" }} />

      {/* Gold border top */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${GOLD_30}, transparent)` }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Standard premium header */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, margin: "0 0 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ width: 24, height: 1, background: GOLD_50 }} />
            Sponsor Voices
            <span style={{ width: 24, height: 1, background: GOLD_50 }} />
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.02em", color: TEXT }}>
            Hear from our sponsors<span style={{ color: GOLD }}>.</span>
          </h2>
          <p style={{ fontSize: 15, color: TEXT_30, margin: 0, maxWidth: 500, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Real stories from partners who&apos;ve experienced the boardroom firsthand.
          </p>
        </motion.div>

        {/* Video cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="vt-grid">
          {videos.map((v, i) => (
            <motion.a
              key={v}
              href={`https://youtube.com/shorts/${v}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i, ease: EASE_OUT }}
              className="vt-card"
              style={{
                position: "relative",
                aspectRatio: "9/16",
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid rgba(201,147,90,0.08)`,
                textDecoration: "none",
                display: "block",
              }}
            >
              {/* Thumbnail */}
              <img
                src={`https://img.youtube.com/vi/${v}/maxresdefault.jpg`}
                alt="Network First executive boardroom session"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)", transition: "filter 0.4s ease, transform 0.4s ease" }}
                className="vt-thumb"
              />

              {/* Gold top accent */}
              <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: 0.6 }} />

              {/* Play button */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="vt-play" style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: `rgba(201,147,90,0.15)`,
                  backdropFilter: "blur(12px)",
                  border: `1.5px solid ${GOLD_50}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s ease",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={GOLD} style={{ marginLeft: 2 }}><polygon points="6 3 20 12 6 21" /></svg>
                </div>
              </div>

              {/* Shorts badge */}
              <div style={{
                position: "absolute", top: 12, right: 12,
                padding: "4px 10px", borderRadius: 20,
                background: "rgba(255,0,0,0.8)",
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <svg width="12" height="14" viewBox="0 0 24 24" fill="white"><path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z" /></svg>
                <span style={{ fontSize: 10, fontWeight: 700, color: "white", letterSpacing: "0.03em" }}>Shorts</span>
              </div>
            </motion.a>
          ))}
        </div>

      </div>

      {/* Gold border bottom */}
      <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${GOLD_30}, transparent)` }} />

      <style jsx global>{`
        @media (max-width: 900px) { .vt-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; } }
        @media (max-width: 480px) { .vt-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; } }
        .vt-card:hover .vt-thumb { filter: brightness(0.75) !important; transform: scale(1.03); }
        .vt-card:hover { border-color: ${GOLD_30} !important; }
        .vt-card:hover .vt-play { background: ${GOLD} !important; border-color: ${GOLD} !important; }
        .vt-card:hover .vt-play svg { fill: ${BG} !important; }
      `}</style>
    </section>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// FAQ SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { question: "How far in advance should we book?", answer: "We recommend a minimum of 6-8 weeks lead time for optimal guest curation and event preparation. However, rush delivery is available for select markets — contact us to discuss your timeline." },
    { question: "How do you select and invite guests?", answer: "Every guest is hand-selected based on title, organization, and direct relevance to your ideal customer profile (ICP). We personally reach out to each executive — no mass emails, no delegates. Every seat is earned through direct relationship." },
    { question: "What's included in the sponsorship package?", answer: "The complete package includes: five-star venue and catering, guest curation (15-20 executives), full production (photography and videography), custom landing page, marketing materials, post-event content, complete attendee list, and follow-up facilitation." },
    { question: "Can we invite our own prospects?", answer: "Absolutely. Sponsors may invite 3-5 VIP guests of their choice. We'll coordinate the invitations and ensure they're integrated seamlessly into the overall guest experience." },
    { question: "What happens after the event?", answer: "Within one week, you receive the full attendee list with verified contact details, professional photography, video highlights, and a recap summary. We also facilitate warm introductions to any attendees you'd like to connect with further." },
    { question: "Which markets do you operate in?", answer: "We operate across multiple global markets including UAE, Saudi Arabia, Kuwait, Bahrain, Qatar, Oman, and Kenya — with expansion into new regions. Each market has dedicated venue partners and executive networks." },
    { question: "What topics work best for boardrooms?", answer: "Topics that drive genuine peer conversation: digital transformation, cybersecurity strategy, AI implementation, cloud modernization, leadership challenges. We'll help you refine the angle during our discovery call." },
  ];

  // Map FAQs for schema
  const faqSchemaItems = faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(100px, 12vw, 140px) 24px", background: BG_ALT, overflow: "hidden" }}>
      {/* FAQ Schema for SEO */}
      <FAQSchema items={faqSchemaItems} />

      {/* Ambient orb */}
      <div style={{ position: "absolute", top: "30%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD_15} 0%, transparent 70%)`, pointerEvents: "none" }} />

      {/* Gold border top */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${GOLD_30}, transparent)` }} />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
        {/* Standard premium header */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 72 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, margin: "0 0 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ width: 24, height: 1, background: GOLD_50 }} />
            Questions Answered
            <span style={{ width: 24, height: 1, background: GOLD_50 }} />
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.02em", color: TEXT }}>
            Frequently asked<span style={{ color: GOLD }}>.</span>
          </h2>
          <p style={{ fontSize: 15, color: TEXT_30, margin: 0, maxWidth: 460, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Everything you need to know about partnering with us.
          </p>
        </motion.div>

        {/* FAQ items — numbered editorial */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Top divider */}
          <div style={{ height: 1, background: `linear-gradient(90deg, ${GOLD_30}, ${BORDER}, ${GOLD_30})` }} />

          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i, ease: EASE_OUT }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="faq-row"
                style={{
                  width: "100%",
                  padding: "28px 0",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 32px",
                  alignItems: "center",
                  gap: 0,
                  textAlign: "left",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Number */}
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  fontWeight: 700,
                  color: openIndex === i ? GOLD : TEXT_30,
                  letterSpacing: "-0.02em",
                  transition: "color 0.3s ease",
                  lineHeight: 1,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Question */}
                <span style={{
                  fontSize: "clamp(16px, 2vw, 18px)",
                  fontWeight: 500,
                  color: openIndex === i ? TEXT : "rgba(255,255,255,0.7)",
                  transition: "color 0.3s ease",
                  lineHeight: 1.4,
                }}>
                  {faq.question}
                </span>

                {/* Chevron */}
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={openIndex === i ? GOLD : TEXT_30} strokeWidth="2" strokeLinecap="round" style={{ transition: "stroke 0.3s ease" }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </motion.span>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{
                      paddingLeft: 60,
                      paddingBottom: 28,
                      paddingRight: 32,
                    }}>
                      {/* Gold accent bar */}
                      <div style={{ width: 32, height: 2, background: `linear-gradient(90deg, ${GOLD}, transparent)`, marginBottom: 16, borderRadius: 1 }} />
                      <p style={{ fontSize: 15, color: TEXT_50, lineHeight: 1.75, margin: 0 }}>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div style={{ height: 1, background: openIndex === i ? `linear-gradient(90deg, ${GOLD_30}, ${BORDER}, transparent)` : BORDER, transition: "background 0.3s ease" }} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{ textAlign: "center", marginTop: 56 }}
        >
          <p style={{ fontSize: 15, color: TEXT_50, margin: 0 }}>
            Have more questions?{" "}
            <a href="#get-started" onClick={(e) => { e.preventDefault(); document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" }); }} style={{ color: GOLD, textDecoration: "none", fontWeight: 500, borderBottom: `1px solid ${GOLD_30}`, paddingBottom: 2, transition: "border-color 0.3s ease", cursor: "pointer" }}>Get in touch</a>
          </p>
        </motion.div>
      </div>

      {/* Gold border bottom */}
      <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${GOLD_30}, transparent)` }} />

      <style jsx global>{`
        .faq-row:hover span:first-child { color: ${GOLD} !important; }
        .faq-row:hover span:nth-child(2) { color: ${TEXT} !important; }
        @media (max-width: 640px) {
          .faq-row { grid-template-columns: 40px 1fr 28px !important; padding: 22px 0 !important; }
          .faq-row span:first-child { font-size: 24px !important; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TITLES MARQUEE
// ═══════════════════════════════════════════════════════════════════════════════

function TitlesMarquee() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} style={{ padding: "clamp(60px, 8vw, 80px) 0", overflow: "hidden" }}>
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
        <p style={{ fontSize: 11, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center", marginBottom: 24 }}>Who attends</p>
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} style={{ display: "flex", gap: 48 }}>
          {[...TITLES, ...TITLES, ...TITLES, ...TITLES].map((t, i) => (
            <span key={i} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 500, color: TEXT_30, whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FINAL CTA
// ═══════════════════════════════════════════════════════════════════════════════

function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormError(null);
    setFormData({});
    setPhoneError(null);
    setEmailError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = formData.email || "";
    if (email && !isWorkEmail(email)) {
      setEmailError("Please use your work email address");
      return;
    }

    const phone = formData.phone || "";
    const phoneErr = validatePhone(phone, selectedCountry);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const fullPhone = phone ? `${selectedCountry.code}${phone.replace(/[\s\-()]/g, "")}` : "";

    const result = await submitForm({
      type: "networkfirst" as FormType,
      full_name: formData.name || "",
      email,
      company: formData.company || "",
      job_title: formData.title || "",
      phone: fullPhone,
      metadata: {
        boardroom_type: formData.boardroom_type || "",
        country: formData.country || "",
        message: formData.message || "",
      },
    });

    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setFormError(result.error || "Something went wrong.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 10,
    border: `1px solid ${BORDER}`,
    background: "rgba(255,255,255,0.03)",
    color: TEXT,
    fontFamily: "var(--font-outfit)",
    fontSize: 14,
    fontWeight: 400,
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-outfit)",
    fontSize: 11,
    fontWeight: 500,
    color: TEXT_30,
    marginBottom: 6,
    display: "block",
    letterSpacing: "0.3px",
  };

  return (
    <section ref={ref} id="get-started" style={{ background: BG, padding: "clamp(80px, 12vw, 140px) 0", position: "relative", overflow: "hidden" }}>
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 800px 600px at 25% 50%, rgba(201,147,90,0.04) 0%, transparent 70%), radial-gradient(ellipse 600px 500px at 75% 40%, rgba(201,147,90,0.03) 0%, transparent 70%)` }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative" }}>
        {/* Split layout */}
        <div className="nf-cta-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "clamp(40px, 5vw, 72px)", alignItems: "start" }}>

          {/* ── LEFT: Editorial ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            style={{ paddingTop: 8 }}
          >
            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ width: 30, height: 1, background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: GOLD, fontFamily: "var(--font-outfit)" }}>Get Started</span>
            </div>

            {/* Headline */}
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(36px, 4vw, 52px)", letterSpacing: "-0.03em", color: TEXT, lineHeight: 1.08, margin: 0, whiteSpace: "pre-line" }}>
              Ready to host{"\n"}<span style={{ color: GOLD }}>your boardroom?</span>
            </h2>

            {/* Description */}
            <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: "clamp(14px, 1.2vw, 16px)", color: TEXT_50, lineHeight: 1.7, margin: "20px 0 0", maxWidth: 420 }}>
              Limited sessions available per quarter. Share your objectives and our team will craft the perfect boardroom experience for your brand.
            </p>

            {/* Perks — minimal numbered list */}
            <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                "Invite-only C-suite audience",
                "End-to-end event management",
                "Measurable pipeline ROI",
              ].map((text, i) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: i < 2 ? `1px solid rgba(201,147,90,0.08)` : "none" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500, color: GOLD, opacity: 0.6, width: 20, flexShrink: 0 }}>0{i + 1}</span>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: TEXT_50, letterSpacing: "0.2px" }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Trust metrics */}
            <div style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${BORDER}`, display: "flex", gap: "clamp(24px, 4vw, 48px)" }}>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 600, color: TEXT, margin: 0, letterSpacing: "-0.03em" }}>100<span style={{ color: GOLD }}>+</span></p>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: TEXT_30, margin: "4px 0 0", letterSpacing: "0.3px" }}>Boardrooms hosted</p>
              </div>
              <div style={{ width: 1, background: BORDER, alignSelf: "stretch" }} />
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 600, color: TEXT, margin: 0, letterSpacing: "-0.03em" }}>6<span style={{ color: GOLD }}>+</span></p>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 400, color: TEXT_30, margin: "4px 0 0", letterSpacing: "0.3px" }}>Global markets</p>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Glass Form Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT }}
            style={{ position: "relative" }}
          >
            {/* Gold glow behind card */}
            <div className="absolute pointer-events-none" style={{ top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,147,90,0.08) 0%, transparent 70%)" }} />

            <div style={{
              borderRadius: 24,
              border: "1px solid rgba(201,147,90,0.15)",
              background: "rgba(201,147,90,0.04)",
              backdropFilter: "blur(20px) saturate(1.4)",
              WebkitBackdropFilter: "blur(20px) saturate(1.4)",
              boxShadow: "0 0 80px rgba(201,147,90,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
              padding: "clamp(28px, 3vw, 40px)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Inner highlight line */}
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD_30}, transparent)` }} />

              {/* Form card header */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(20px, 2.2vw, 26px)", letterSpacing: "-0.02em", color: TEXT, margin: 0 }}>Book Your Session</h3>
                <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 13, color: TEXT_30, margin: "6px 0 0", letterSpacing: "0.2px" }}>We&apos;ll respond within 2 working hours</p>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    style={{ textAlign: "center", padding: "40px 0" }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(22px, 3vw, 28px)", letterSpacing: "-0.5px", color: TEXT, margin: "0 0 8px" }}>Inquiry Submitted</h3>
                    <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 400, fontSize: 14, color: TEXT_50, margin: "0 0 20px", lineHeight: 1.6 }}>Our team will review your submission and get back to you within 2 working hours.</p>
                    <button
                      onClick={resetForm}
                      style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: GOLD, background: "none", border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 8, transition: "all 0.3s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = TEXT; e.currentTarget.style.background = GOLD_15; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = GOLD; e.currentTarget.style.background = "none"; }}
                    >
                      Submit another inquiry &rarr;
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <form onSubmit={handleSubmit}>
                      <div className="nf-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {/* Full Name */}
                        <div>
                          <label style={labelStyle}>Full Name</label>
                          <input type="text" value={formData.name || ""} onChange={(e) => handleChange("name", e.target.value)} placeholder="Your full name" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,147,90,0.4)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(201,147,90,0.15)"; }} />
                        </div>

                        {/* Work Email */}
                        <div>
                          <label style={labelStyle}>Work Email</label>
                          <input
                            type="email"
                            value={formData.email || ""}
                            onChange={(e) => { handleChange("email", e.target.value); setEmailError(null); }}
                            placeholder="you@company.com"
                            required
                            style={{ ...inputStyle, borderColor: emailError ? "rgba(239,68,68,0.5)" : undefined }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,147,90,0.4)"; }}
                            onBlur={(e) => {
                              const val = e.currentTarget.value;
                              if (val && !isWorkEmail(val)) { setEmailError("Please use your work email address"); e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)"; }
                              else { setEmailError(null); e.currentTarget.style.borderColor = "rgba(201,147,90,0.15)"; }
                            }}
                          />
                          {emailError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 11, margin: "4px 0 0" }}>{emailError}</p>}
                        </div>

                        {/* Phone — full width */}
                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={labelStyle}>Phone Number</label>
                          <div style={{ display: "flex", gap: 8 }}>
                            <select
                              value={`${selectedCountry.code}|${selectedCountry.country}`}
                              onChange={(e) => {
                                const [code, country] = e.target.value.split("|");
                                const c = COUNTRY_CODES.find((cc) => cc.code === code && cc.country === country);
                                if (c) { setSelectedCountry(c); setPhoneError(null); }
                              }}
                              style={{ ...inputStyle, width: 120, flexShrink: 0, appearance: "none" as const, WebkitAppearance: "none" as const, cursor: "pointer", fontSize: 12 }}
                            >
                              {COUNTRY_CODES.map((cc) => (
                                <option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: "#222", background: "#fff" }}>
                                  {cc.country} {cc.code}
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              value={formData.phone || ""}
                              onChange={(e) => { handleChange("phone", e.target.value); setPhoneError(null); }}
                              placeholder={selectedCountry.placeholder}
                              maxLength={selectedCountry.length}
                              style={{ ...inputStyle, flex: 1 }}
                              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,147,90,0.4)"; }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = "rgba(201,147,90,0.15)";
                                const err = validatePhone(formData.phone || "", selectedCountry);
                                if (err) setPhoneError(err);
                              }}
                            />
                          </div>
                          {phoneError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 11, margin: "4px 0 0" }}>{phoneError}</p>}
                        </div>

                        {/* Company */}
                        <div>
                          <label style={labelStyle}>Company</label>
                          <input type="text" value={formData.company || ""} onChange={(e) => handleChange("company", e.target.value)} placeholder="Company name" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,147,90,0.4)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(201,147,90,0.15)"; }} />
                        </div>

                        {/* Job Title */}
                        <div>
                          <label style={labelStyle}>Job Title</label>
                          <input type="text" value={formData.title || ""} onChange={(e) => handleChange("title", e.target.value)} placeholder="Your role" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,147,90,0.4)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(201,147,90,0.15)"; }} />
                        </div>

                        {/* Type of Boardroom */}
                        <div>
                          <label style={labelStyle}>Type of Boardroom</label>
                          <select
                            value={formData.boardroom_type || ""}
                            onChange={(e) => handleChange("boardroom_type", e.target.value)}
                            required
                            style={{ ...inputStyle, appearance: "none" as const, WebkitAppearance: "none" as const, cursor: "pointer", color: formData.boardroom_type ? TEXT : TEXT_30 }}
                          >
                            <option value="" style={{ color: "#222", background: "#fff" }}>Select type</option>
                            <option value="Executive Roundtable" style={{ color: "#222", background: "#fff" }}>Executive Roundtable</option>
                            <option value="Virtual" style={{ color: "#222", background: "#fff" }}>Virtual</option>
                          </select>
                        </div>

                        {/* Country */}
                        <div>
                          <label style={labelStyle}>Country</label>
                          <select
                            value={formData.country || ""}
                            onChange={(e) => handleChange("country", e.target.value)}
                            required
                            style={{ ...inputStyle, appearance: "none" as const, WebkitAppearance: "none" as const, cursor: "pointer", color: formData.country ? TEXT : TEXT_30 }}
                          >
                            <option value="" style={{ color: "#222", background: "#fff" }}>Select country</option>
                            {COUNTRY_CODES.map((cc) => (
                              <option key={cc.country} value={cc.name} style={{ color: "#222", background: "#fff" }}>
                                {cc.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Message — full width */}
                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={labelStyle}>Message (Optional)</label>
                          <textarea
                            value={formData.message || ""}
                            onChange={(e) => handleChange("message", e.target.value)}
                            placeholder="Tell us about your objectives..."
                            rows={3}
                            style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,147,90,0.4)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(201,147,90,0.15)"; }}
                          />
                        </div>
                      </div>

                      {/* Honeypot */}
                      <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

                      {formError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 13, margin: "12px 0 0" }}>{formError}</p>}

                      <button
                        type="submit"
                        disabled={submitting}
                        style={{
                          width: "100%",
                          marginTop: 20,
                          padding: "15px 28px",
                          borderRadius: 12,
                          background: submitting ? GOLD_50 : GOLD,
                          color: BG,
                          fontFamily: "var(--font-outfit)",
                          fontSize: 15,
                          fontWeight: 600,
                          border: "none",
                          cursor: submitting ? "not-allowed" : "pointer",
                          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                          opacity: submitting ? 0.7 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!submitting) {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,147,90,0.3)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        {submitting ? "Submitting..." : "Get Started"}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 860px) {
          .nf-cta-split {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .nf-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
