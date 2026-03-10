"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Footer } from "@/components/sections";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { FormType, CountryCode } from "@/lib/form-helpers";

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
const NF = "https://networkfirstme.com/wp-content/uploads";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const UPCOMING_EVENTS = [
  {
    date: "March 3rd, 2026",
    time: "9:30 PM – 2:00 AM",
    title: "Majlis Al-Suhoor",
    subtitle: "مجلس سحور كليڤر تاب",
    sponsor: "CleverTap",
    location: "JW Marriott, Riyadh",
    link: "https://clevertap.networkfirstme.com/",
    image: `${NF}/2026/02/Suhoor-photo1.jpg`,
  },
  {
    date: "March 5th, 2026",
    time: "5:30 PM – 9:30 PM",
    title: "The CleverTap Iftar",
    subtitle: "A Celebration of Flavor, Fellowship, and Future",
    sponsor: "CleverTap",
    location: "Madinat Jumeirah, Dubai",
    link: "https://clevertapdxb.networkfirstme.com/",
    image: `${NF}/2026/02/iftar-photo1.jpg`,
  },
  {
    date: "April 29th, 2026",
    time: "09:00 – 16:00",
    title: "ONE Executive Day KSA",
    subtitle: "Explore the Power of Agentic Enterprise and Low-Code",
    sponsor: "OutSystems",
    location: "JW Marriott Hotel Riyadh",
    link: "https://events.outsystems.com/",
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

const TESTIMONIALS = [
  { quote: "The executive boardroom was transformative for us — our brand got exposure with the right connections.", name: "Srikanth Rayaprolu", title: "CEO & Co-Founder", company: "Ad Scholars" },
  { quote: "Unforgettable experience with tangible results. Everything was professionally managed.", name: "Deep Vyas", title: "Partner", company: "Worker Ants Media" },
  { quote: "An invaluable experience that exceeded our expectations in every way.", name: "Sheryan Gandhi", title: "COO", company: "Tap1ce" },
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
  { src: `${S3_LOGOS}/OutSystems.png` },
  { src: `${S3_LOGOS}/Freshworks.png` },
  { src: `${S3_LOGOS}/CleverTap.png` },
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
      <IntroStatement />
      <WhyBoardroomsWork />
      <TheFormat />
      <CandidMoments />
      <WhyHost />
      <EditorialBreak src={`${BOARDROOM}/boardroom-03.jpg`} />
      <TheExperience />
      <TheFullPackage />
      <TheJourney />
      <UpcomingSection />
      <UrgencyBanner />
      <EditorialBreak src={`${BOARDROOM}/boardroom-12.jpg`} />
      <PastBoardroomsShowcase />
      <ResultsThatMatter />
      <ByTheNumbers />
      <VideoTestimonials />
      <TestimonialCarousel />
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
        <img src={`${S3}/network-first/gallery-03.jpg`} alt="" style={{ width: "100%", height: "120%", objectFit: "cover", filter: "brightness(0.4)" }} />
      </motion.div>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${BG} 0%, transparent 20%, transparent 70%, ${BG} 100%)` }} />

      <motion.div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 24px", opacity }}>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }} style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 24 }}>NetworkFirst Boardrooms</motion.p>
        
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: EASE_OUT }} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(56px, 14vw, 160px)", fontWeight: 600, lineHeight: 0.9, letterSpacing: "-0.04em", margin: 0, color: TEXT }}>The Room.</motion.h1>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} style={{ fontSize: "clamp(17px, 2.2vw, 21px)", fontWeight: 400, color: TEXT_50, maxWidth: 600, marginTop: 24, lineHeight: 1.6 }}>Join an exclusive event experience tailored for leaders seeking to expand their network, foster peer connections, and engage in in-depth discussions.</motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }} className="hero-cta-row" style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="#get-started" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 32px", background: GOLD, color: BG, borderRadius: 980, fontSize: 15, fontWeight: 500, textDecoration: "none", minWidth: 180 }}>
            Host a Boardroom
          </Link>
          <Link href="#get-started" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 32px", background: "transparent", color: TEXT, border: `1px solid ${TEXT_30}`, borderRadius: 980, fontSize: 15, fontWeight: 500, textDecoration: "none", minWidth: 140 }}>
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
          <img key={i} src={logo.src} alt="" style={{ height: 56, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.85, flexShrink: 0 }} />
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
    <section ref={ref} style={{ position: "relative", padding: "clamp(140px, 20vw, 240px) 24px", background: BG, overflow: "hidden" }}>
      {/* Backdrop: vignette + gold orb */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, #0a0a0a 0%, #000 100%)" }} />
      <div className="absolute pointer-events-none" style={{ top: "20%", left: "30%", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,147,90,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        {/* Thin gold rule */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          style={{ width: 60, height: 1, background: GOLD, margin: "0 auto 40px", transformOrigin: "center" }}
        />

        {/* Oversized decorative quotation mark */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.3 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 30,
            right: -40,
            fontFamily: "Georgia, serif",
            fontSize: "clamp(80px, 12vw, 130px)",
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
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: EASE_OUT }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 4.5vw, 44px)",
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
            color: "#F0EBE3",
            margin: 0,
          }}
        >
          We design and manage exclusive executive networking roundtables and virtual boardrooms{" "}
          <span style={{ color: "rgba(240,235,227,0.45)" }}>that bring together C-level decision-makers</span>{" "}
          <span style={{ color: GOLD }}>for meaningful engagement.</span>
        </motion.p>

        {/* Attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE_OUT }}
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: GOLD,
            marginTop: 36,
            opacity: 0.6,
          }}
        >
          &mdash; NetworkFirst
        </motion.p>
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
    {
      versus: "Conferences",
      problem: "Thousands of attendees. Your booth is one of hundreds. You fight for attention.",
      solution: "Your brand owns the room. Every executive is there for you.",
    },
    {
      versus: "Digital Ads",
      problem: "Impressions and clicks. No real conversations. Hard to measure true ROI.",
      solution: "Face-to-face conversations that build real trust and lasting connections.",
    },
    {
      versus: "Cold Outreach",
      problem: "Gatekeepers. Ignored emails. Months to secure a single meeting.",
      solution: "Warm introductions in a trusted environment. 15 meetings in one morning.",
    },
  ];

  const advantages = [
    { num: "01", title: "Boardrooms Built for Leaders", desc: "Carefully designed environments where decisions are made and networks are strengthened." },
    { num: "02", title: "The Right Audience", desc: "We curate C-level executives and technical leaders. Every seat earned by decision-makers who matter." },
    { num: "03", title: "Productive Exchange", desc: "Unlock the power of productive exchange with tailored agendas that drive value." },
  ];

  return (
    <section ref={ref} style={{ padding: "clamp(80px, 10vw, 120px) 24px", background: BG_ALT }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>The Boardroom Advantage</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, lineHeight: 1.15, margin: 0, letterSpacing: "-0.02em", color: TEXT }}>
            Why boardrooms work<br /><span style={{ color: TEXT_50 }}>when everything else doesn&apos;t.</span>
          </h2>
        </motion.div>

        {/* Comparison Grid */}
        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 80 }} className="comparison-grid">
          {comparisons.map((c, i) => (
            <motion.div key={c.versus} variants={fadeUp} custom={i} style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_30})` }} />
              <p style={{ fontSize: 11, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>vs. {c.versus}</p>
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: TEXT_30, lineHeight: 1.6, margin: 0, textDecoration: "line-through", textDecorationColor: TEXT_30 }}>{c.problem}</p>
              </div>
              <div style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: 16 }}>
                <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{c.solution}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Key Advantages */}
        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }} className="advantages-grid">
          {advantages.map((a, i) => (
            <motion.div key={a.title} variants={fadeUp} custom={i} style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: GOLD_30, display: "block", marginBottom: 16 }}>{a.num}</span>
              <h4 style={{ fontSize: 18, fontWeight: 600, color: TEXT, margin: "0 0 8px" }}>{a.title}</h4>
              <p style={{ fontSize: 14, color: TEXT_50, lineHeight: 1.6, margin: 0 }}>{a.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <style jsx global>{`
        @media (max-width: 900px) { 
          .comparison-grid { grid-template-columns: 1fr !important; } 
          .advantages-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
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
  const pillars = [
    { num: "01", title: "Event Planning & Content", desc: "We work with you to design a tailored agenda that aligns with your goals, ensuring every conversation drives value." },
    { num: "02", title: "Delegate Acquisition", desc: "We identify your ideal prospects, deploy multi-channel outreach, and manage registration & attendee coordination end-to-end." },
    { num: "03", title: "Flawless Execution", desc: "5-star hotel venues with curated menus, premium branding, and on-site execution so you can focus on your business objectives." },
  ];

  return (
    <section ref={ref} style={{ padding: "clamp(80px, 10vw, 120px) 24px", maxWidth: 1200, margin: "0 auto" }}>
      <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 64 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 52px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.03em", margin: 0, color: TEXT }}>How it works.</h2>
      </motion.div>
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }} className="format-grid">
        {pillars.map((p, i) => (
          <motion.div key={p.num} variants={fadeUp} custom={i} style={{ padding: "48px 40px", background: BG_ALT, border: `1px solid ${BORDER}`, position: "relative" }} className="format-card">
            <span style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 600, color: GOLD_15, position: "absolute", top: 24, right: 32, lineHeight: 1 }}>{p.num}</span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: TEXT, margin: "0 0 16px", position: "relative" }}>{p.title}</h3>
            <p style={{ fontSize: 15, fontWeight: 400, color: TEXT_50, lineHeight: 1.7, margin: 0, position: "relative" }}>{p.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      <style jsx global>{`@media (max-width: 900px) { .format-grid { grid-template-columns: 1fr !important; } }`}</style>
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
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85)" }} />
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
    { title: "Private & Intimate Setting", desc: "Our managed roundtables provide a private and intimate setting to connect with C-level executives and business leaders." },
    { title: "Tailored Agenda", desc: "We work with you to design a tailored agenda that aligns with your goals, ensuring every conversation drives value." },
    { title: "End-to-End Management", desc: "From planning to flawless on-site execution, we handle everything so you can focus on achieving your business objectives." },
    { title: "Post-Event ROI", desc: "We provide a comprehensive attendee database – insights, contacts, and follow-up opportunities – to nurture relationships long after the event." },
  ];

  return (
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 140px) 24px", background: BG_ALT }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, margin: 0, letterSpacing: "-0.02em", color: TEXT }}>Why host with us.</h2>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "48px 64px" }} className="benefits-grid">
          {benefits.map((b, i) => (
            <motion.div key={b.title} variants={fadeUp} custom={i} style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: TEXT, marginBottom: 8 }}>{b.title}</h3>
              <p style={{ fontSize: 15, color: TEXT_50, lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <style jsx global>{`@media (max-width: 600px) { .benefits-grid { grid-template-columns: 1fr !important; } }`}</style>
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
      <motion.img src={src} alt="" style={{ width: "100%", height: "130%", objectFit: "cover", filter: "brightness(0.5)", y }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${BG} 0%, transparent 15%, transparent 80%, ${BG} 100%)` }} />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE EXPERIENCE
// ═══════════════════════════════════════════════════════════════════════════════

function TheExperience() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const features = [
    { title: "5-Star Hotel Venues", desc: "World-class venues with curated menus that match the caliber of your guests." },
    { title: "Captivating Collateral", desc: "Landing pages and brochures designed to attract and engage your target audience." },
    { title: "Premium Branding", desc: "On-site execution with premium branding that positions your company front and center." },
    { title: "Strategic Acquisition", desc: "Multi-channel outreach including calls, email, LinkedIn campaigns to fill your room with decision-makers." },
  ];

  return (
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 140px) 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="exp-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(48px, 8vw, 80px)", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: EASE_OUT }} className="exp-images">
            <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "4/5", border: `1px solid ${BORDER}` }}>
              <img src={`${BOARDROOM}/outsystems-one/4N8A7083.JPG`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, lineHeight: 1.15, margin: "0 0 48px", letterSpacing: "-0.02em", color: TEXT }}>What you get.</h2>
            <div style={{ display: "grid", gap: 32 }}>
              {features.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}>
                  <h4 style={{ fontSize: 17, fontWeight: 600, color: GOLD, margin: "0 0 6px" }}>{f.title}</h4>
                  <p style={{ fontSize: 15, fontWeight: 400, color: TEXT_50, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <style jsx global>{`@media (max-width: 900px) { .exp-grid { grid-template-columns: 1fr !important; } .exp-images { order: -1; } }`}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE FULL PACKAGE
// ═══════════════════════════════════════════════════════════════════════════════

function TheFullPackage() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const packages = [
    {
      num: "01",
      title: "Custom Landing Pages",
      desc: "Branded registration pages for your event. Your logo, your messaging, your call-to-action. Full analytics on registrations and engagement.",
    },
    {
      num: "02",
      title: "Marketing Content",
      desc: "Pre-event promotion materials, social media assets, email templates, and LinkedIn carousel graphics. Everything you need to amplify reach.",
    },
    {
      num: "03",
      title: "Post-Event Deliverables",
      desc: "Complete attendee list with verified contact details. Professional photography, video highlights, and recap content for your channels.",
    },
    {
      num: "04",
      title: "Lead Nurturing Support",
      desc: "Follow-up email templates, introduction facilitation to key attendees, and recommended next steps for converting conversations to pipeline.",
    },
  ];

  return (
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 140px) 24px", background: BG_ALT }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Beyond the Room</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, lineHeight: 1.15, margin: 0, letterSpacing: "-0.02em", color: TEXT }}>The full package.</h2>
          <p style={{ fontSize: 17, color: TEXT_50, marginTop: 16, maxWidth: 600, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Your boardroom is just the beginning. We provide everything you need before, during, and after the event.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }} className="package-grid">
          {packages.map((p, i) => (
            <motion.div key={p.title} variants={fadeUp} custom={i} style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "32px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: GOLD_30, flexShrink: 0, lineHeight: 1 }}>{p.num}</span>
              <div>
                <h4 style={{ fontSize: 18, fontWeight: 600, color: TEXT, margin: "0 0 8px" }}>{p.title}</h4>
                <p style={{ fontSize: 14, color: TEXT_50, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <style jsx global>{`@media (max-width: 768px) { .package-grid { grid-template-columns: 1fr !important; } }`}</style>
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
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 140px) 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>From Kickoff to Close</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, lineHeight: 1.15, margin: 0, letterSpacing: "-0.02em", color: TEXT }}>The journey.</h2>
          <p style={{ fontSize: 17, color: TEXT_50, marginTop: 16, lineHeight: 1.6 }}>
            6-8 weeks from kickoff to event. Here&apos;s how we get you there.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ position: "relative" }}>
          {/* Timeline line */}
          <div style={{ position: "absolute", left: 23, top: 40, bottom: 40, width: 2, background: `linear-gradient(to bottom, ${GOLD}, ${GOLD_30}, transparent)` }} className="journey-line" />
          
          {steps.map((step, i) => (
            <motion.div key={step.num} variants={fadeUp} custom={i} style={{ display: "flex", gap: 32, marginBottom: i === steps.length - 1 ? 0 : 40, position: "relative" }} className="journey-step">
              {/* Number bubble */}
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: BG_ALT, border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: GOLD }}>{step.num}</span>
              </div>
              
              {/* Content */}
              <div style={{ flex: 1, paddingTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  <h4 style={{ fontSize: 20, fontWeight: 600, color: TEXT, margin: 0 }}>{step.title}</h4>
                  <span style={{ fontSize: 12, color: GOLD, fontWeight: 500, padding: "4px 12px", background: GOLD_15, borderRadius: 980 }}>{step.duration}</span>
                </div>
                <p style={{ fontSize: 15, color: TEXT_50, lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginTop: 64, padding: "32px", background: BG_ALT, border: `1px solid ${BORDER}`, borderRadius: 16 }}>
          <p style={{ fontSize: 15, color: TEXT, margin: 0 }}>
            <span style={{ color: GOLD, fontWeight: 600 }}>Timeline:</span> Average 6-8 weeks from kickoff to event day. Rush delivery available for select markets.
          </p>
        </motion.div>
      </div>
      <style jsx global>{`
        @media (max-width: 640px) { 
          .journey-step { flex-direction: column; gap: 16px !important; }
          .journey-line { display: none; }
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.offsetWidth;
    const newIndex = direction === "left" 
      ? Math.max(0, activeIndex - 1) 
      : Math.min(UPCOMING_EVENTS.length - 1, activeIndex + 1);
    setActiveIndex(newIndex);
    sliderRef.current.scrollTo({ left: newIndex * (cardWidth + 16), behavior: "smooth" });
  };

  return (
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 140px) 0", background: BG_ALT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, margin: 0, letterSpacing: "-0.02em", color: TEXT }}>Upcoming sessions.</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => scroll("left")} disabled={activeIndex === 0} style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${activeIndex === 0 ? TEXT_30 : GOLD}`, background: "transparent", color: activeIndex === 0 ? TEXT_30 : GOLD, cursor: activeIndex === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll("right")} disabled={activeIndex === UPCOMING_EVENTS.length - 1} style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${activeIndex === UPCOMING_EVENTS.length - 1 ? TEXT_30 : GOLD}`, background: "transparent", color: activeIndex === UPCOMING_EVENTS.length - 1 ? TEXT_30 : GOLD, cursor: activeIndex === UPCOMING_EVENTS.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </motion.div>
      </div>

      <div ref={sliderRef} className="upcoming-slider" style={{ display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", paddingLeft: "max(24px, calc((100vw - 1152px) / 2))", paddingRight: 24 }}>
        {UPCOMING_EVENTS.map((e, i) => (
          <motion.a key={e.title} href={e.link} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} className="upcoming-card" style={{ flex: "0 0 min(380px, 85vw)", scrollSnapAlign: "start", display: "block", borderRadius: 16, overflow: "hidden", background: BG, border: `1px solid ${BORDER}`, textDecoration: "none" }}>
            <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
              <img src={e.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 12, left: 12, padding: "6px 12px", borderRadius: 6, background: GOLD, fontSize: 11, fontWeight: 600, color: BG }}>{e.sponsor}</div>
            </div>
            <div style={{ padding: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: GOLD, marginBottom: 8 }}>{e.date}</p>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: TEXT, margin: "0 0 4px", lineHeight: 1.2 }}>{e.title}</h3>
              <p style={{ fontSize: 13, color: TEXT_50, margin: "0 0 12px" }}>{e.subtitle}</p>
              <p style={{ fontSize: 12, color: TEXT_30, margin: 0 }}>{e.location}</p>
            </div>
          </motion.a>
        ))}
      </div>
      <style jsx global>{`.upcoming-slider::-webkit-scrollbar { display: none; }`}</style>
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
        <Link href="#get-started" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", background: GOLD, color: BG, borderRadius: 980, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
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
  const [activeYear, setActiveYear] = useState<"2025" | "2024">("2025");
  const events = activeYear === "2025" ? PAST_EVENTS_2025 : PAST_EVENTS_2024;

  return (
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 140px) 24px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, margin: 0, letterSpacing: "-0.02em", color: TEXT }}>100+ sessions delivered.</h2>
          <div style={{ display: "flex", gap: 4 }}>
            {(["2025", "2024"] as const).map((year) => (
              <button key={year} onClick={() => setActiveYear(year)} style={{ padding: "10px 20px", borderRadius: 980, border: "none", background: activeYear === year ? GOLD : "transparent", color: activeYear === year ? BG : TEXT_50, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>{year}</button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeYear} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="past-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
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

function ResultsThatMatter() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const results = [
    { value: "12", suffix: "avg", label: "Qualified Meetings", desc: "Per boardroom session" },
    { value: "85", suffix: "%", label: "Pipeline Generated", desc: "Within 90 days" },
    { value: "40", suffix: "%", label: "Follow-Up Requests", desc: "Attendees seeking conversations" },
    { value: "92", suffix: "", label: "Net Promoter Score", desc: "Sponsor satisfaction" },
  ];

  return (
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 140px) 24px", background: BG_ALT }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Measurable Impact</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, lineHeight: 1.15, margin: 0, letterSpacing: "-0.02em", color: TEXT }}>Results that matter.</h2>
          <p style={{ fontSize: 17, color: TEXT_50, marginTop: 16, maxWidth: 550, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Not vanity metrics. Real outcomes that impact your bottom line.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }} className="results-grid">
          {results.map((r, i) => (
            <motion.div key={r.label} variants={fadeUp} custom={i} style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "40px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 60, height: 3, background: GOLD, borderRadius: "0 0 3px 3px" }} />
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2, marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(44px, 6vw, 56px)", fontWeight: 600, color: GOLD, letterSpacing: "-0.03em", lineHeight: 1 }}>{r.value}</span>
                <span style={{ fontSize: 20, fontWeight: 500, color: GOLD }}>{r.suffix}</span>
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: TEXT, margin: "0 0 4px" }}>{r.label}</h4>
              <p style={{ fontSize: 13, color: TEXT_50, margin: 0 }}>{r.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ fontSize: 13, color: TEXT_30, fontStyle: "italic" }}>
            Based on aggregate sponsor feedback across 100+ boardroom sessions.
          </p>
        </motion.div>
      </div>
      <style jsx global>{`
        @media (max-width: 900px) { .results-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .results-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BY THE NUMBERS
// ═══════════════════════════════════════════════════════════════════════════════

function ByTheNumbers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 140px) 24px", background: BG_ALT }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
          {STATS.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 8vw, 56px)", fontWeight: 600, color: GOLD, margin: 0, letterSpacing: "-0.03em" }}>{s.value}</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: TEXT_50, marginTop: 4 }}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <style jsx global>{`@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 40px !important; } }`}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════════

function VideoTestimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const videos = [{ id: "SH9Z1U2_rAM" }, { id: "wLgYOHHB6o4" }, { id: "2jpIlqo0HSY" }, { id: "SLkj5gO-LQ8" }];

  return (
    <section ref={ref} style={{ padding: "clamp(80px, 10vw, 120px) 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 600, margin: "0 0 48px", textAlign: "center", letterSpacing: "-0.02em", color: TEXT }}>Hear from our sponsors.</motion.h2>
        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="videos-grid">
          {videos.map((v, i) => (
            <motion.a key={v.id} href={`https://youtube.com/shorts/${v.id}`} target="_blank" rel="noopener noreferrer" variants={fadeUp} custom={i} style={{ position: "relative", aspectRatio: "9/16", borderRadius: 12, overflow: "hidden", border: `1px solid ${BORDER}` }}>
              <img src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={BG}><polygon points="6 3 20 12 6 21" /></svg>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
      <style jsx global>{`@media (max-width: 900px) { .videos-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TESTIMONIAL CAROUSEL
// ═══════════════════════════════════════════════════════════════════════════════

function TestimonialCarousel() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 140px) 24px", background: BG_ALT }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
          <div style={{ minHeight: 180 }}>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 400, lineHeight: 1.4, color: TEXT, margin: "0 0 32px" }}>&ldquo;{TESTIMONIALS[active].quote}&rdquo;</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: GOLD }}>{TESTIMONIALS[active].name}</p>
                <p style={{ fontSize: 13, color: TEXT_50 }}>{TESTIMONIALS[active].title}, {TESTIMONIALS[active].company}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ width: active === i ? 24 : 8, height: 8, borderRadius: 4, border: "none", background: active === i ? GOLD : TEXT_30, cursor: "pointer", transition: "all 0.3s" }} />
            ))}
          </div>
        </motion.div>
      </div>
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
    {
      question: "How far in advance should we book?",
      answer: "We recommend a minimum of 6-8 weeks lead time for optimal guest curation and event preparation. However, rush delivery is available for select markets — contact us to discuss your timeline.",
    },
    {
      question: "How do you select and invite guests?",
      answer: "Every guest is hand-selected based on title, organization, and direct relevance to your ideal customer profile (ICP). We personally reach out to each executive — no mass emails, no delegates. Every seat is earned through direct relationship.",
    },
    {
      question: "What's included in the sponsorship package?",
      answer: "The complete package includes: five-star venue and catering, guest curation (15-20 executives), full production (photography and videography), custom landing page, marketing materials, post-event content, complete attendee list, and follow-up facilitation.",
    },
    {
      question: "Can we invite our own prospects?",
      answer: "Absolutely. Sponsors may invite 3-5 VIP guests of their choice. We'll coordinate the invitations and ensure they're integrated seamlessly into the overall guest experience.",
    },
    {
      question: "What happens after the event?",
      answer: "Within one week, you receive the full attendee list with verified contact details, professional photography, video highlights, and a recap summary. We also facilitate warm introductions to any attendees you'd like to connect with further.",
    },
    {
      question: "Which markets do you operate in?",
      answer: "We operate across multiple global markets including UAE, Saudi Arabia, Kuwait, Bahrain, Qatar, Oman, and Kenya — with expansion into new regions. Each market has dedicated venue partners and executive networks.",
    },
    {
      question: "What topics work best for boardrooms?",
      answer: "Topics that drive genuine peer conversation: digital transformation, cybersecurity strategy, AI implementation, cloud modernization, leadership challenges. We'll help you refine the angle during our discovery call.",
    },
  ];

  return (
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 140px) 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Questions Answered</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 600, lineHeight: 1.15, margin: 0, letterSpacing: "-0.02em", color: TEXT }}>Frequently asked.</h2>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} style={{ border: `1px solid ${openIndex === i ? GOLD : BORDER}`, borderRadius: 12, overflow: "hidden", background: openIndex === i ? BG_ALT : "transparent", transition: "all 0.3s ease" }}>
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} style={{ width: "100%", padding: "20px 24px", background: "transparent", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left" }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: TEXT }}>{faq.question}</span>
                <motion.span animate={{ rotate: openIndex === i ? 45 : 0 }} transition={{ duration: 0.2 }} style={{ color: GOLD, fontSize: 24, fontWeight: 300, lineHeight: 1, flexShrink: 0 }}>+</motion.span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
                    <div style={{ padding: "0 24px 20px", borderTop: `1px solid ${BORDER}` }}>
                      <p style={{ fontSize: 15, color: TEXT_50, lineHeight: 1.7, margin: "16px 0 0" }}>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ fontSize: 15, color: TEXT_50, margin: 0 }}>
            Have more questions?{" "}
            <a href="mailto:hello@networkfirstme.com" style={{ color: GOLD, textDecoration: "none" }}>Get in touch</a>
          </p>
        </motion.div>
      </div>
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
                <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 300, fontSize: 13, color: TEXT_30, margin: "6px 0 0", letterSpacing: "0.2px" }}>We&apos;ll respond within 2 business days</p>
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
                    <p style={{ fontFamily: "var(--font-outfit)", fontWeight: 400, fontSize: 14, color: TEXT_50, margin: "0 0 20px", lineHeight: 1.6 }}>Our team will review your submission and get back to you within 2 business days.</p>
                    <button onClick={resetForm} style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: GOLD, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
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
