"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Footer } from "@/components/sections";

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
  `${BOARDROOM}/boardroom-05.jpg`,
  `${BOARDROOM}/boardroom-09.jpg`,
  `${BOARDROOM}/boardroom-12.jpg`,
  `${BOARDROOM}/boardroom-15.jpg`,
  `${BOARDROOM}/boardroom-18.jpg`,
  `${BOARDROOM}/boardroom-21.jpg`,
  `${BOARDROOM}/boardroom-24.jpg`,
];

const STATS = [
  { value: "100+", label: "Boardrooms" },
  { value: "1,500+", label: "Executives" },
  { value: "80+", label: "Sponsors" },
  { value: "5", label: "GCC Markets" },
];

const TESTIMONIALS = [
  { quote: "The executive boardroom was transformative for us — our brand got exposure with the right connections.", name: "Srikanth Rayaprolu", title: "CEO & Co-Founder", company: "Ad Scholars" },
  { quote: "Unforgettable experience with tangible results. Everything was professionally managed.", name: "Deep Vyas", title: "Partner", company: "Worker Ants Media" },
  { quote: "An invaluable experience that exceeded our expectations in every way.", name: "Sheryan Gandhi", title: "COO", company: "Tap1ce" },
];

const TRUST_LOGOS = [
  "Google-Cloud-Security.png", "paloalto.png", "fortinet.png", "Akamai.png",
  "EY.png", "Celonis.png", "Claroty.png", "GBM.png", "Confluent.png",
  "OutSystems.png", "Freshworks.png", "CleverTap.png", "Tenable-logo.png",
  "sentinelone.png", "ManageEngine.png", "Dragos.png",
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
      <TheFormat />
      <CandidMoments />
      <WhyHost />
      <EditorialBreak src={`${BOARDROOM}/boardroom-26.jpg`} />
      <TheExperience />
      <UpcomingSection />
      <UrgencyBanner />
      <EditorialBreak src={`${BOARDROOM}/boardroom-31.jpg`} />
      <PastBoardroomsShowcase />
      <ByTheNumbers />
      <VideoTestimonials />
      <TestimonialCarousel />
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
        <img src={`${BOARDROOM}/boardroom-28.jpg`} alt="" style={{ width: "100%", height: "120%", objectFit: "cover", filter: "brightness(0.4)" }} />
      </motion.div>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${BG} 0%, transparent 20%, transparent 70%, ${BG} 100%)` }} />

      <motion.div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 24px", opacity }}>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }} style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 24 }}>NetworkFirst Boardrooms</motion.p>
        
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: EASE_OUT }} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(56px, 14vw, 160px)", fontWeight: 600, lineHeight: 0.9, letterSpacing: "-0.04em", margin: 0, color: TEXT }}>The Room.</motion.h1>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} style={{ fontSize: "clamp(17px, 2.2vw, 21px)", fontWeight: 400, color: TEXT_50, maxWidth: 500, marginTop: 24, lineHeight: 1.6 }}>Host your boardroom. Curate your guests.<br />Shape the conversation that matters.</motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }} className="hero-cta-row" style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 32px", background: GOLD, color: BG, borderRadius: 980, fontSize: 15, fontWeight: 500, textDecoration: "none", minWidth: 180 }}>
            Host a Boardroom
          </Link>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 32px", background: "transparent", color: TEXT, border: `1px solid ${TEXT_30}`, borderRadius: 980, fontSize: 15, fontWeight: 500, textDecoration: "none", minWidth: 140 }}>
            Learn More
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.4 }} style={{ display: "flex", gap: 56, marginTop: 64 }} className="hero-stats">
          {[{ v: "100+", l: "Boardrooms" }, { v: "1,500+", l: "Executives" }, { v: "80+", l: "Sponsors" }].map((s) => (
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
          <img key={i} src={`${S3_LOGOS}/${logo}`} alt="" style={{ height: 32, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.7, flexShrink: 0 }} />
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
    <section ref={ref} style={{ padding: "clamp(120px, 18vw, 200px) 24px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
      <motion.p initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: EASE_OUT }} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 500, lineHeight: 1.3, letterSpacing: "-0.02em", color: TEXT }}>
        Your brand. Your agenda.<br />
        <span style={{ color: TEXT_50 }}>The region&apos;s most senior executives</span>{" "}
        <span style={{ color: GOLD }}>in one room.</span>
      </motion.p>
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
    { num: "01", title: "You Host", desc: "Your brand owns the room. Set the agenda, choose the topic, lead the conversation that positions you as a thought leader." },
    { num: "02", title: "We Curate", desc: "15–20 hand-selected CISOs, CTOs, and C-level executives. Every seat earned. No walk-ins, no filler." },
    { num: "03", title: "They Connect", desc: "Chatham House Rule. No recordings, no press. Real conversations that build real relationships." },
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
    { title: "Direct Access", desc: "Meet decision-makers face-to-face. No gatekeepers." },
    { title: "Thought Leadership", desc: "Position your brand at the center of industry conversations." },
    { title: "Quality Content", desc: "Professional photography and video. Your brand documented." },
    { title: "Real Relationships", desc: "Connections that convert to pipeline and partnerships." },
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
    { title: "Five-Star Venues", desc: "Ritz Carlton, Four Seasons, St. Regis — venues that match the caliber of your guests." },
    { title: "Curated Guest List", desc: "We select participants by title, organization, and relevance to your agenda." },
    { title: "Full Production", desc: "Photography, videography, and post-event content. Your brand documented." },
    { title: "Private Dining", desc: "The conversation continues over lunch. Relationships that outlast the session." },
  ];

  return (
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 140px) 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="exp-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(48px, 8vw, 80px)", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: EASE_OUT }} className="exp-images">
            <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "4/5", border: `1px solid ${BORDER}` }}>
              <img src={`${BOARDROOM}/boardroom-30.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
        <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", background: GOLD, color: BG, borderRadius: 980, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
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

  return (
    <section ref={ref} style={{ padding: "clamp(140px, 18vw, 220px) 24px", position: "relative" }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE_OUT }} style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 8vw, 64px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 20px", color: TEXT }}>Ready to host<br /><span style={{ color: GOLD }}>your boardroom?</span></h2>
        <p style={{ fontSize: 17, fontWeight: 400, color: TEXT_50, lineHeight: 1.6, margin: "0 0 36px" }}>Limited sessions available per quarter.<br />Let&apos;s discuss your objectives.</p>
        <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "18px 40px", background: GOLD, color: BG, borderRadius: 980, fontSize: 16, fontWeight: 500, textDecoration: "none" }}>
          Get Started
        </Link>
        <p style={{ fontSize: 13, color: TEXT_30, marginTop: 24 }}>Or email <a href="mailto:hello@networkfirstme.com" style={{ color: GOLD, textDecoration: "none" }}>hello@networkfirstme.com</a></p>
      </motion.div>
    </section>
  );
}
