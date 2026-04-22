"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MeshGradient } from "@paper-design/shaders-react";
import { Footer, InquiryForm } from "@/components/sections";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── COMING SOON MODE ─────────────────────────────────────────────────────
// Set to false when ready to launch the full page
const COMING_SOON = false;

// ─── Design Tokens ───────────────────────────────────────────────────────────
const V = "#7C3AED";          // Violet / OPEX First primary
const V_BRIGHT = "#9F6AFF";   // Light violet
const V_DIM = "#5B21B6";      // Deep violet
const MINT = "#34D399";       // Mint accent (secondary)
const MINT_DIM = "#059669";   // Deep mint
const BG = "#0a0a14";         // Deep dark background
const BG_DARK = "#06060e";    // Darker
const BG_CARD = "#0e0e1c";    // Card background
const EASE = [0.22, 1, 0.36, 1] as const;

const S3_LOGOS = "https://efg-final.s3.eu-north-1.amazonaws.com/logos";
const EFG_LOGO = "/events-first-group_logo_alt.svg";

// ─── Data ────────────────────────────────────────────────────────────────────

const KEY_THEMES = [
  "From Digital Transformation to Process Intelligence",
  "Process Mining as a Foundation for Operational Excellence",
  "Linking Process Performance to Business KPIs",
  "Automation + Process Intelligence: Beyond RPA",
  "Real-Time Operational Control and Process Visibility",
  "AI-Driven Process Optimisation",
  "Governance, Compliance, and Process Transparency",
  "Driving ROI from Enterprise Transformation Investments",
];

const MARKET_DRIVERS = [
  { driver: "Vision 2030 Execution (KSA)", signal: "Saudi Arabia is transitioning from strategic planning to disciplined execution across giga-projects, energy diversification, and sweeping public sector reforms.", implication: "Surging demand for KPI tracking, process visibility, and execution discipline at enterprise scale." },
  { driver: "UAE Government Efficiency Mandates", signal: "The UAE Zero Bureaucracy programme is targeting faster, leaner, and more citizen-centric government processes across federal entities.", implication: "Strong institutional focus on operational efficiency, process optimisation, and digital service delivery." },
  { driver: "Energy Sector Optimisation", signal: "ADNOC, Saudi Aramco, and QatarEnergy are investing heavily in digital transformation and operational optimisation across upstream and downstream operations.", implication: "Critical need for real-time process monitoring, predictive maintenance, and production efficiency improvements." },
  { driver: "ERP and Automation Saturation", signal: "Widespread adoption of SAP, Oracle, and RPA tools across GCC enterprises has created a complex technology landscape.", implication: "Growing gap between system investment and operational visibility, precisely where process intelligence adds value." },
  { driver: "CFO and Board-Level ROI Pressure", signal: "Increased scrutiny from boards and finance leadership on transformation spend and measurable business outcomes.", implication: "Rising demand for ROI-driven transformation frameworks, value tracking, and benefit realisation methodologies." },
  { driver: "Complex Multi-System Environments", signal: "Enterprises are operating across legacy systems, cloud platforms, automation layers, and hybrid architectures.", implication: "Urgent need for end-to-end process transparency that spans organisational and technological boundaries." },
  { driver: "AI Adoption in Enterprise Operations", signal: "GCC organisations are investing heavily in artificial intelligence for operational decision-making and process automation.", implication: "Imperative to link AI capabilities to real operational performance data and measurable business outcomes." },
];

const CASE_STUDIES = [
  { company: "Saudi Aramco", title: "Operational Optimisation at Scale", desc: "Saudi Aramco is leveraging advanced digital platforms and analytics capabilities to optimise procurement workflows, maintenance operations, and supply chain management.", outcomes: ["Improved asset utilisation and equipment uptime across production facilities", "Measurable reduction in procurement cycle times and operational inefficiencies"], logo: `${S3_LOGOS}/aramco.jpg`, logoStyle: { right: 0, height: "100%", width: "100%", objectFit: "cover" as const, opacity: 0.25, overlayDark: 0.15 } },
  { company: "ADNOC", title: "AI-Driven Operational Excellence", desc: "ADNOC has implemented AI and advanced digital systems across its production and operational workflows, creating one of the region's most sophisticated intelligent operations platforms.", outcomes: ["Significant reduction in unplanned downtime across production assets", "Improved production efficiency and throughput optimisation"], logo: `${S3_LOGOS}/freepik_generate-this-pic-with-ul_2748490079.png`, logoStyle: { right: 0, height: "100%", width: "100%", objectFit: "cover" as const, opacity: 0.2, overlayDark: 0.15 } },
  { company: "Emirates NBD", title: "End-to-End Process Transformation", desc: "Emirates NBD has undertaken a comprehensive transformation of its customer-facing and back-office processes, streamlining onboarding journeys, compliance workflows, and transaction processing.", outcomes: ["Dramatically faster customer onboarding cycle times", "Enhanced regulatory compliance and operational transparency"], logo: `${S3_LOGOS}/nbd.png`, logoStyle: { right: 0, height: "100%", width: "100%", objectFit: "cover" as const, opacity: 0.3, overlayDark: 0.15 } },
  { company: "STC", title: "Service Delivery Optimisation", desc: "STC has improved its customer lifecycle management and service delivery processes through targeted digital transformation initiatives.", outcomes: ["Measurable reduction in service delivery timelines", "Increased end-to-end operational visibility across the customer journey"], logo: `${S3_LOGOS}/STC.jpg`, logoStyle: { right: 0, height: "100%", width: "100%", objectFit: "cover" as const, opacity: 0.25 } },
  { company: "DEWA", title: "Operational Transparency and Performance Monitoring", desc: "DEWA has implemented sophisticated digital systems to improve workflow efficiency and performance monitoring across its utility operations.", outcomes: ["Improved service delivery and citizen satisfaction scores", "Enhanced operational transparency and real-time performance tracking"], logo: `${S3_LOGOS}/deva.png`, logoStyle: { right: 0, height: "100%", width: "100%", objectFit: "cover" as const, opacity: 0.25 } },
  { company: "SABIC", title: "Manufacturing and Supply Chain Efficiency", desc: "SABIC has focused its digital transformation efforts on supply chain optimisation and production efficiency, leveraging data analytics to improve process control.", outcomes: ["Improved process control and production yield", "Increased operational efficiency across the manufacturing value chain"], logo: `${S3_LOGOS}/sabic.webp`, logoStyle: { right: 0, height: "100%", width: "100%", objectFit: "cover" as const, opacity: 0.25 } },
];

const SENIOR_ROLES = [
  "Chief Operating Officers (COOs)",
  "Chief Transformation Officers (CTrOs)",
  "Chief Information Officers (CIOs) / Chief Technology Officers (CTOs)",
  "Heads / VPs of Operational Excellence",
  "Heads / VPs of Process Excellence",
  "Heads of Automation / RPA Centres of Excellence",
  "Enterprise Architecture Leaders and Directors",
];

const TARGET_INDUSTRIES = [
  "Government and Public Sector",
  "Oil and Gas / Energy",
  "Banking and Financial Services",
  "Telecommunications",
  "Logistics and Supply Chain",
  "Manufacturing",
];

const AGENDA = [
  { time: "00:00 - 00:10", title: "Opening Remarks", desc: "Setting the stage for the webinar by framing the regional macro shift from digital investment to operational execution and ROI accountability." },
  { time: "00:10 - 00:30", title: "Panel 1: Why Digital Transformation Needs Process Intelligence", desc: "Exploring the growing disconnect between digital investment and operational performance, and why process intelligence is the critical bridge between strategy and execution.", subtopics: ["The Visibility Gap: Why most GCC enterprises still lack a unified, data-driven view of how their processes actually run.", "From Deployment to Value Realisation: Connecting technology investments to tangible business outcomes.", "Building a Process-Centric Culture: Embedding process intelligence into transformation governance."] },
  { time: "00:30 - 00:40", title: "Enterprise / Government Keynote", desc: "A senior government or enterprise leader will share a first-hand account of how their organisation is applying process intelligence principles to drive operational performance." },
  { time: "00:40 - 01:00", title: "Panel 2: From Process Mining to Operational Efficiency", desc: "How process mining technologies are being deployed across GCC enterprises to drive measurable efficiency gains, with real-world lessons and quantifiable results.", subtopics: ["End-to-End Process Transparency: Using system data to reveal how work truly flows across departments.", "Connecting Process KPIs to Business Outcomes: Moving beyond process mapping to KPI-driven dashboards.", "Scaling from Pilot to Enterprise Standard: Overcoming the data integration, stakeholder, and change management challenges."] },
  { time: "01:00 - 01:10", title: "Sponsor Presentation 1", desc: "A focused presentation from a leading process intelligence or automation vendor, showcasing regional case studies and measurable impact." },
  { time: "01:10 - 01:30", title: "Panel 3: AI, Automation, and the Future of Process Intelligence", desc: "How AI, intelligent automation, and process intelligence are converging to create a new paradigm for enterprise operations.", subtopics: ["From Reactive Automation to Predictive Intelligence: Evolving beyond rule-based RPA to AI-powered systems.", "Generative AI and LLMs in Process Optimisation: Practical applications of GenAI for natural language process querying.", "Governance and Trust in AI-Driven Decisions: Building governance frameworks that ensure AI-driven process decisions are explainable."] },
  { time: "01:30 - 01:40", title: "Sponsor Presentation 2", desc: "A focused presentation from a complementary technology vendor, demonstrating how their solutions integrate with process intelligence." },
  { time: "01:40 - 01:50", title: "Sponsor Presentation 3", desc: "A final sponsor presentation highlighting innovative approaches to enterprise process transformation." },
  { time: "01:50 - 02:00", title: "Closing Remarks and Raffle", desc: "A concise wrap-up synthesising the key insights from the session, reinforcing the strategic importance of process intelligence for GCC enterprises." },
];

const S3_TEAM = "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos";
const CONTACTS = [
  { name: "Harini Sudhakar", title: "Producer", category: "Speaking Enquiries", phone: "+971 50 615 9216", email: "harini@eventsfirstgroup.com", photo: `${S3_TEAM}/Harini.jpg` },
  { name: "Mohammed Hassan", title: "Partnership Manager", category: "Sponsorship Enquiries", phone: "+971 54 302 0244", email: "hassan@eventsfirstgroup.com", photo: `${S3_TEAM}/hassan.jpg` },
  { name: "Kausar Noor", title: "Partnership Manager", category: "Sponsorship Enquiries", phone: "+91 80734 00732", email: "kausar@eventsfirstgroup.com", photo: "/team/noor-kauser.jpg" },
];

// ─── COUNTER COMPONENT ──────────────────────────────────────────────────────
function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to]);
  const hasDecimals = to !== Math.floor(to);
  return (
    <div ref={ref} style={{ display: "inline" }}>
      {prefix}{hasDecimals ? val.toFixed(2) : val}{suffix}
    </div>
  );
}

// ─── COUNTDOWN HOOK ──────────────────────────────────────────────────────────
function useCountdown(target: string) {
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => {
      const diff = Math.max(0, t - Date.now());
      setCd({ d: Math.floor(diff / 864e5), h: Math.floor((diff % 864e5) / 36e5), m: Math.floor((diff % 36e5) / 6e4), s: Math.floor((diff % 6e4) / 1e3) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return cd;
}

// ─── HERO SECTION ────────────────────────────────────────────────────────────
function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const cd = useCountdown("2026-05-21T11:00:00+04:00");
  useEffect(() => setMounted(true), []);

  return (
    <section id="overview" className="opex-hero-section">
      {/* Shader Mesh Gradient background — dark palette only */}
      {mounted && (
        <MeshGradient
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          colors={["#000000", "#4c1d95", "#1e0a4e", "#134e4a", "#0a0a14"]}
          speed={0.4}
          distortion={0.5}
          swirl={0.4}
          grainOverlay={0.06}
        />
      )}

      {/* Dark overlay for consistent readability */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 1, pointerEvents: "none" }} />

      {/* Subtle violet/mint glow accents — controlled, won't wash out */}
      <div style={{ position: "absolute", top: "15%", left: "10%", width: "50%", height: "55%", background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(124,58,237,0.1), transparent 55%)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: "45%", height: "50%", background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(52,211,153,0.06), transparent 55%)", zIndex: 2, pointerEvents: "none" }} />

      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "25%", background: `linear-gradient(to top, ${BG_DARK}, transparent)`, zIndex: 3, pointerEvents: "none" }} />

      {/* Centered content */}
      <div className="opex-hero-content">
        <main className="opex-hero-main">
          {/* Badge — skeuomorphic glass */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="opex-badge"
            style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              padding: "12px 26px", borderRadius: 50, marginBottom: 28,
              background: "linear-gradient(145deg, rgba(124,58,237,0.18), rgba(14,14,28,0.8) 40%, rgba(52,211,153,0.1))",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 8px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(124,58,237,0.15)",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", borderRadius: 1 }} />
            <span className="opex-pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: MINT, boxShadow: `0 0 12px ${MINT}, 0 0 4px ${MINT}`, flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: V_BRIGHT, textShadow: `0 0 20px rgba(124,58,237,0.3)` }}>Executive Webinar</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>&middot;</span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>MENA &middot; 2026</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.5, ease: EASE }}
          >
            Process Intelligence<br />
            <span className="opex-shimmer-text">
              MENA
            </span>
          </motion.h1>

          {/* Description — two-line hierarchy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ marginBottom: 6 }}
          >
            From Digital Investment to Measurable Execution
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="opex-hero-subline"
          >
            Driving Operational Intelligence Across the GCC
          </motion.p>

          {/* Info badges — skeuomorphic glass pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}
          >
            {["21 May 2026", "Virtual · Live", "2 Hours", "GCC Leaders"].map((label) => (
              <div key={label} className="opex-info-pill" style={{
                padding: "9px 20px", borderRadius: 50, position: "relative", overflow: "hidden",
                background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 50%, rgba(124,58,237,0.06))",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 4px 12px rgba(0,0,0,0.25)",
                transition: "all 0.3s ease", cursor: "default",
              }}>
                <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", letterSpacing: "0.5px" }}>{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <a href="#register" className="opex-cta-primary">Register Now &rarr;</a>
            <a href="#agenda" className="opex-cta-ghost">View Agenda</a>
          </motion.div>
        </main>
      </div>

      {/* EFG logo — bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        style={{ position: "absolute", bottom: 80, right: "clamp(24px, 5vw, 80px)", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
        className="opex-efg-badge"
      >
        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "2px" }}>An Initiative By</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={EFG_LOGO} alt="Events First Group" width={120} height={48} style={{ width: "auto", height: 48, opacity: 0.7 }} />
      </motion.div>

      {/* Countdown bar — bottom with top separator */}
      <div className="opex-countdown-bar" style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20, padding: "18px 0" }}>
{/* separator removed */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(16px, 4vw, 80px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hrs" }, { v: cd.m, l: "Min" }, { v: cd.s, l: "Sec" }].map((item, i) => (
              <div key={item.l} className="opex-cd-card" style={{
                textAlign: "center", padding: "10px 14px", borderRadius: 12, minWidth: 56, position: "relative", overflow: "hidden",
                background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01) 50%, rgba(124,58,237,0.05))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 4px 16px rgba(0,0,0,0.3)",
                transition: "all 0.3s ease",
              }}>
                <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
                <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: "white", display: "block", letterSpacing: "-1px", lineHeight: 1.2 }}>{String(item.v).padStart(2, "0")}</span>
                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px" }}>{item.l}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="opex-pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: MINT, boxShadow: `0 0 12px ${MINT}` }} />
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "2px" }}>Registrations Open</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes opexShimmer { 0%,100%{background-position:250% 50%} 50%{background-position:0% 50%} }
        @keyframes opexPulse { 0%,100%{opacity:1;box-shadow:0 0 6px ${MINT}} 50%{opacity:0.5;box-shadow:0 0 16px ${MINT}, 0 0 30px ${MINT}} }
        .opex-hero-shimmer { animation: opexShimmer 4s ease-in-out infinite; }
        .opex-pulse-dot { animation: opexPulse 2s ease-in-out infinite; }
        .opex-shimmer-text {
          background-image: linear-gradient(110deg, ${V_BRIGHT}, ${MINT}, ${V_BRIGHT});
          background-size: 250% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: opexShimmer 4s ease-in-out infinite;
        }
        .opex-hero-subline {
          font-style: italic !important;
          color: rgba(255,255,255,0.65) !important;
          font-size: 16px !important;
          font-weight: 400 !important;
          text-shadow: 0 2px 16px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.5) !important;
          margin-bottom: 24px !important;
        }
        .opex-info-pill:hover {
          transform: translateY(-2px);
          border-color: rgba(124,58,237,0.25) !important;
          box-shadow: 0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 8px 20px rgba(0,0,0,0.3), 0 0 15px rgba(124,58,237,0.1) !important;
        }
        .opex-cd-card:hover {
          border-color: rgba(124,58,237,0.2) !important;
          box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 6px 20px rgba(0,0,0,0.35), 0 0 12px rgba(124,58,237,0.12) !important;
          transform: translateY(-1px);
        }

        .opex-hero-section {
          position: relative;
          height: 100vh;
          min-height: 700px;
          overflow: hidden;
          background: #000;
        }
        .opex-hero-content {
          position: relative;
          z-index: 10;
          height: 100vh;
          min-height: 700px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 70px clamp(24px, 5vw, 80px) 100px;
        }
        .opex-hero-main {
          text-align: center;
          max-width: 900px;
        }
        .opex-hero-main h1 {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(44px, 8vw, 100px);
          line-height: 0.92;
          letter-spacing: -0.04em;
          color: white;
          margin: 0 0 24px;
          text-shadow: 0 4px 30px rgba(0,0,0,0.5), 0 0 80px rgba(124,58,237,0.3), 0 0 40px rgba(124,58,237,0.15);
        }
        .opex-hero-main p {
          font-family: var(--font-outfit);
          font-size: clamp(16px, 1.6vw, 20px);
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          line-height: 1.7;
          text-shadow: 0 2px 16px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.5);
          max-width: 560px;
          margin: 0 auto 28px;
        }
        .opex-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 40px;
          border-radius: 50px;
          background: linear-gradient(180deg, ${V_BRIGHT}, ${V} 40%, ${V_DIM});
          color: white;
          font-family: var(--font-outfit);
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid rgba(159,106,255,0.3);
          box-shadow: 0 1px 0 rgba(255,255,255,0.2) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 4px 30px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.15);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .opex-cta-primary::before {
          content: "";
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          border-radius: 1px;
        }
        .opex-cta-primary:hover {
          box-shadow: 0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 8px 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.2);
          transform: translateY(-2px);
        }
        .opex-cta-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 40px;
          border-radius: 50px;
          background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 50%, rgba(124,58,237,0.06));
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.75);
          font-family: var(--font-outfit);
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          /* backdrop-filter removed for perf */
          box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 4px 12px rgba(0,0,0,0.25);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .opex-cta-ghost::before {
          content: "";
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        }
        .opex-cta-ghost:hover {
          background: linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 50%, rgba(124,58,237,0.1));
          border-color: rgba(124,58,237,0.3);
          color: white;
          box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 6px 20px rgba(0,0,0,0.3), 0 0 20px rgba(124,58,237,0.1);
        }
        /* ─── Tablet (1024px) ─── */
        @media (max-width: 1024px) {
          .opex-hero-content { padding: 70px clamp(20px, 4vw, 40px) 100px; }
          .opex-hero-main { max-width: 700px; }
          .opex-hero-main h1 { font-size: clamp(36px, 7vw, 64px); }
          .opex-hero-main p { font-size: clamp(14px, 1.8vw, 17px); max-width: 480px; }
          .opex-cta-primary, .opex-cta-ghost { padding: 14px 32px; font-size: 14px; }
          .opex-badge { padding: 10px 20px !important; gap: 10px !important; }
          .opex-badge span { font-size: 12px !important; }
          .opex-efg-badge { bottom: 75px !important; }
          .opex-efg-badge img { height: 40px !important; }
        }

        /* ─── Mobile (768px) ─── */
        @media (max-width: 768px) {
          .opex-hero-section { min-height: 100svh; }
          .opex-hero-content {
            padding: 80px 16px 110px !important;
            min-height: 100svh;
          }
          .opex-hero-main { max-width: 100%; }
          .opex-hero-main h1 { font-size: clamp(28px, 10vw, 44px) !important; line-height: 0.95; letter-spacing: -0.03em; margin-bottom: 18px; }
          .opex-hero-main p { font-size: 15px; max-width: 90%; margin-bottom: 20px; }
          .opex-cta-primary, .opex-cta-ghost { padding: 13px 28px; font-size: 13px; }
          .opex-badge { padding: 8px 16px !important; gap: 8px !important; margin-bottom: 24px !important; }
          .opex-badge span { font-size: 10px !important; letter-spacing: 1px !important; }
          .opex-countdown-bar { padding: 14px 0 !important; }
          .opex-countdown-bar > div { justify-content: center !important; }
          .opex-efg-badge { bottom: 68px !important; right: 12px !important; }
          .opex-efg-badge img { height: 36px !important; }
          .opex-efg-badge span { font-size: 8px !important; }
        }

        /* ─── Small mobile (480px) ─── */
        @media (max-width: 480px) {
          .opex-hero-content { padding: 70px 12px 100px !important; }
          .opex-hero-main h1 { font-size: clamp(26px, 11vw, 38px) !important; }
          .opex-hero-main p { font-size: 14px; }
          .opex-cta-primary, .opex-cta-ghost { padding: 12px 24px; font-size: 12px; width: 100%; justify-content: center; }
          .opex-badge { flex-wrap: wrap !important; justify-content: center !important; }
          .opex-countdown-bar > div > div:first-child { gap: 8px !important; }
          .opex-countdown-bar > div > div:last-child span:last-child { display: none; }
          .opex-efg-badge { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─── ABOUT / OVERVIEW ────────────────────────────────────────────────────────
const EVENT_DETAILS = [
  { label: "Duration", value: "2 Hours" },
  { label: "Format", value: "Virtual Live Broadcast" },
  { label: "Audience", value: "Senior GCC Leaders" },
  { label: "Panels", value: "3 x 20-min sessions" },
  { label: "Sponsors", value: "3 x awareness slots" },
  { label: "Region", value: "Middle East & Africa" },
];

const QUOTE_WORDS = "How do we ensure that our digital investments deliver measurable, sustainable outcomes?".split(" ");
const HIGHLIGHT_WORDS = new Set(["digital", "investments", "measurable,", "sustainable"]);

const STAT_HIGHLIGHTS = [
  { big: "Billions", desc: "Invested in ERP, automation & AI across the GCC", accent: V_BRIGHT, rgb: "124,58,237" },
  { big: "6 Sectors", desc: "Energy, banking, telecom, government & more", accent: MINT, rgb: "52,211,153" },
  { big: "1 Gap", desc: "The missing layer between investment and execution", accent: V_BRIGHT, rgb: "124,58,237" },
];

function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  // GSAP: word-by-word blur reveal on quote
  useGSAP(() => {
    if (!inView || !quoteRef.current) return;
    const words = quoteRef.current.querySelectorAll(".quote-word");
    gsap.fromTo(words,
      { opacity: 0.15, filter: "blur(8px)", y: 8 },
      { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.6, stagger: 0.04, ease: "power2.out", delay: 0.3 }
    );
  }, [inView]);

  // GSAP: stat cards — entrance only (continuous via CSS)
  useGSAP(() => {
    if (!inView || !statsRef.current) return;
    const cards = statsRef.current.querySelectorAll(".stat-highlight");
    gsap.fromTo(cards,
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.6 }
    );
  }, [inView]);

  // GSAP: paragraph fade
  useGSAP(() => {
    if (!inView || !paraRef.current) return;
    gsap.fromTo(paraRef.current,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.0 }
    );
  }, [inView]);

  // GSAP: detail pills — entrance only (continuous via CSS)
  useGSAP(() => {
    if (!inView || !pillsRef.current) return;
    const pills = pillsRef.current.querySelectorAll(".detail-pill");
    gsap.fromTo(pills,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 1.3 }
    );
  }, [inView]);

  return (
    <section ref={sectionRef} style={{ background: `linear-gradient(180deg, ${BG_DARK} 0%, ${BG} 100%)`, padding: "clamp(40px, 5vw, 70px) 0", position: "relative", overflow: "hidden" }}>
      {/* Aurora background — static radial gradients (no blur, no animation) */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 700, height: 700, top: "-10%", right: "-8%", borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 50%)` }} />
        <div style={{ position: "absolute", width: 600, height: 600, bottom: "-5%", left: "5%", borderRadius: "50%", background: `radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 50%)` }} />
        <div style={{ position: "absolute", width: 500, height: 500, top: "35%", left: "45%", borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 50%)` }} />
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* 1. Header */}
        <motion.div initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}} transition={{ duration: 1, ease: EASE }} style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 12px", lineHeight: 1 }}>
            Event <span className="opex-shimmer-text">Overview</span>
          </h2>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, delay: 0.4, ease: EASE }} style={{ width: 100, height: 3, background: `linear-gradient(90deg, transparent, ${V_BRIGHT}, transparent)`, margin: "0 auto", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px rgba(124,58,237,0.5)` }} />
        </motion.div>

        {/* 2. Quote — word-by-word blur reveal with highlighted words */}
        <div ref={quoteRef} style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontStyle: "italic", fontSize: "clamp(22px, 3vw, 32px)", letterSpacing: "-0.5px", lineHeight: 1.5, margin: "0 auto", maxWidth: 760, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 9px" }}>
            <span className="quote-word" style={{ color: "rgba(255,255,255,0.35)", display: "inline-block" }}>&ldquo;</span>
            {QUOTE_WORDS.map((word, i) => (
              <span key={i} className="quote-word" style={{
                display: "inline-block",
                color: HIGHLIGHT_WORDS.has(word) ? V_BRIGHT : "rgba(255,255,255,0.9)",
                textShadow: HIGHLIGHT_WORDS.has(word) ? `0 0 20px rgba(124,58,237,0.3), 0 2px 12px rgba(0,0,0,0.4)` : "0 2px 12px rgba(0,0,0,0.4)",
              }}>{word}</span>
            ))}
            <span className="quote-word" style={{ color: "rgba(255,255,255,0.35)", display: "inline-block" }}>&rdquo;</span>
          </p>
        </div>

        {/* 3. Stat Highlights — 3 skeuomorphic glass cards */}
        <div ref={statsRef} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }} className="opex-stat-grid">
          {STAT_HIGHLIGHTS.map((stat, i) => (
            <div key={stat.big} className="stat-highlight" style={{
              borderRadius: 18, padding: "32px 24px 28px", textAlign: "center", position: "relative", overflow: "hidden", opacity: 0,
              background: `linear-gradient(145deg, rgba(${stat.rgb},0.12), rgba(14,14,28,0.85) 40%, rgba(${stat.rgb},0.06))`,
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: `0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 8px 28px rgba(0,0,0,0.35)`,
            }}>
              {/* Top accent border */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent 10%, rgba(${stat.rgb},0.5) 50%, transparent 90%)`, boxShadow: `0 0 12px rgba(${stat.rgb},0.3)` }} />
              {/* Glass reflection edge */}
              <div style={{ position: "absolute", top: 2, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 46px)", color: stat.accent, letterSpacing: "-1px", marginBottom: 12, textShadow: `0 0 25px rgba(${stat.rgb},0.35)` }}>{stat.big}</div>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: 0 }}>{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* 4. Single centered paragraph */}
        <p ref={paraRef} style={{ fontFamily: "var(--font-outfit)", fontSize: 19, fontWeight: 500, color: "rgba(255,255,255,0.88)", lineHeight: 1.8, textAlign: "center", maxWidth: 720, margin: "0 auto 40px", opacity: 0, textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
          Process Intelligence MENA brings together senior transformation, operations, and technology leaders to explore how organisations across the GCC are accelerating their journey toward data-driven, performance-led, and execution-focused enterprises.
        </p>

        {/* 5. Event Details — horizontal glass pills */}
        <div ref={pillsRef} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }} className="opex-detail-pills">
          {EVENT_DETAILS.map((item, i) => (
            <div key={item.label} className="detail-pill" style={{
              padding: "14px 22px", borderRadius: 16, textAlign: "center", minWidth: 140, opacity: 0,
              position: "relative", overflow: "hidden",
              background: `linear-gradient(145deg, rgba(${i % 2 === 0 ? "124,58,237" : "52,211,153"},0.08), rgba(255,255,255,0.03) 50%, rgba(${i % 2 === 0 ? "52,211,153" : "124,58,237"},0.04))`,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 4px 14px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease", cursor: "default",
            }}>
              <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: 6 }}>{item.label}</span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.95)" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* aurora orbs replaced with static radial gradients */
        .stat-highlight { transition: all 0.3s ease; }
        .stat-highlight:nth-child(1) { animation-delay: 0s; animation-duration: 3s; }
        .stat-highlight:nth-child(2) { animation-delay: 0.4s; animation-duration: 3.5s; }
        .stat-highlight:nth-child(3) { animation-delay: 0.8s; animation-duration: 2.8s; }
        /* statFloat removed for perf */
        .stat-highlight:hover { transform: translateY(-4px) !important; border-color: rgba(124,58,237,0.25) !important; box-shadow: 0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 12px 32px rgba(0,0,0,0.4), 0 0 20px rgba(124,58,237,0.1) !important; }
        .detail-pill { transition: transform 0.3s ease; }
        .detail-pill:nth-child(1) { animation-delay: 0s; }
        .detail-pill:nth-child(2) { animation-delay: 0.2s; }
        .detail-pill:nth-child(3) { animation-delay: 0.4s; }
        .detail-pill:nth-child(4) { animation-delay: 0.6s; }
        .detail-pill:nth-child(5) { animation-delay: 0.8s; }
        .detail-pill:nth-child(6) { animation-delay: 1.0s; }
        /* pillWave removed for perf */
        .detail-pill:hover { transform: translateY(-2px) !important; border-color: rgba(124,58,237,0.2) !important; box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 8px 20px rgba(0,0,0,0.35), 0 0 12px rgba(124,58,237,0.1) !important; }
        @media (max-width: 768px) {
          .opex-stat-grid { grid-template-columns: 1fr !important; }
          .opex-detail-pills { display: grid !important; grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── KEY THEMES ──────────────────────────────────────────────────────────────
function KeyThemesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="themes" style={{ background: BG, padding: "clamp(40px, 5vw, 70px) 0", position: "relative", overflow: "hidden" }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 50%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "5%", right: "-8%", width: 550, height: 550, borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}} transition={{ duration: 1, ease: EASE }} style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 12px", lineHeight: 1 }}>
            Key <span className="opex-shimmer-text">Themes</span>
          </h2>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, delay: 0.4, ease: EASE }} style={{ width: 100, height: 3, background: `linear-gradient(90deg, transparent, ${V_BRIGHT}, transparent)`, margin: "0 auto", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px rgba(124,58,237,0.5)` }} />
        </motion.div>

        {/* Bento Grid */}
        <div className="opex-bento-grid">
          {KEY_THEMES.map((theme, i) => {
            const isHero = i === 0;
            const isMedium = i === 1 || i === 2;
            const isViolet = i % 2 === 0;
            const rgb = isViolet ? "124,58,237" : "52,211,153";
            const accent = isViolet ? V_BRIGHT : MINT;
            // Grid area assignments: hero spans 2 cols, medium each take 1 col, rest fill 2x3
            const gridArea = isHero ? "hero" : isMedium ? `med${i}` : undefined;

            return (
              <motion.div
                key={theme}
                className={`bento-card ${isHero ? "bento-hero" : isMedium ? "bento-medium" : "bento-small"}`}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease: EASE }}
                style={{
                  gridArea,
                  borderRadius: 20, position: "relative", overflow: "hidden",
                  padding: isHero ? "32px 32px" : "22px 22px",
                  background: `linear-gradient(145deg, rgba(${rgb},0.12), rgba(14,14,28,0.85) 40%, rgba(${rgb},0.06))`,
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: `0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 8px 28px rgba(0,0,0,0.35)`,
                  display: "flex", flexDirection: "column", justifyContent: isHero ? "flex-end" : "center",
                  cursor: "default", transition: "all 0.35s ease",
                }}
              >
                {/* Animated gradient border — top accent */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  backgroundImage: `linear-gradient(90deg, transparent 10%, rgba(${rgb},0.7) 50%, transparent 90%)`,
                  backgroundSize: "100% 100%",
                  boxShadow: `0 0 10px rgba(${rgb},0.3)`,
                }} />
                {/* Glass reflection */}
                <div style={{ position: "absolute", top: 2, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
                {/* Left accent bar */}
                <div style={{ position: "absolute", top: "20%", left: 0, width: 2, height: "30%", background: `linear-gradient(180deg, rgba(${rgb},0.4), transparent)`, borderRadius: "0 2px 2px 0" }} />

                {/* Number */}
                <span style={{
                  fontFamily: "var(--font-display)", fontWeight: 800,
                  fontSize: isHero ? 72 : isMedium ? 44 : 32,
                  color: accent, opacity: isHero ? 0.2 : 0.18,
                  position: "absolute", top: isHero ? 16 : 8, right: isHero ? 24 : 14,
                  lineHeight: 1, letterSpacing: "-2px",
                  textShadow: `0 0 20px rgba(${rgb},0.15)`,
                }}>{String(i + 1).padStart(2, "0")}</span>

                {/* Theme title */}
                <span style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: isHero ? 26 : isMedium ? 19 : 17,
                  fontWeight: isHero ? 700 : 600,
                  color: "rgba(255,255,255,0.92)",
                  lineHeight: 1.4,
                  position: "relative", zIndex: 2,
                  maxWidth: isHero ? 500 : undefined,
                  textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}>{theme}</span>

                {/* Hero card gets a subtitle */}
                {isHero && (
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.6)", marginTop: 10, lineHeight: 1.6, maxWidth: 440, textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}>
                    The foundational shift from digitising processes to understanding and optimising them
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        /* bentoShift removed for perf */

        .opex-bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: auto;
          grid-template-areas:
            "hero hero med1"
            "hero hero med2"
            "s3 s4 s5"
            "s6 s7 s7";
          gap: 14px;
        }
        .opex-bento-grid > .bento-small:nth-child(4) { grid-area: s3; }
        .opex-bento-grid > .bento-small:nth-child(5) { grid-area: s4; }
        .opex-bento-grid > .bento-small:nth-child(6) { grid-area: s5; }
        .opex-bento-grid > .bento-small:nth-child(7) { grid-area: s6; }
        .opex-bento-grid > .bento-small:nth-child(8) { grid-area: s7; }

        .bento-card:hover {
          transform: translateY(-3px) !important;
          border-color: rgba(124,58,237,0.2) !important;
          box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 12px 32px rgba(0,0,0,0.4), 0 0 16px rgba(124,58,237,0.1) !important;
        }
        .bento-hero { min-height: 200px; }
        .bento-medium { min-height: 90px; }
        .bento-small { min-height: 80px; }

        @media (max-width: 768px) {
          .opex-bento-grid {
            grid-template-columns: 1fr !important;
            grid-template-areas: none !important;
          }
          .opex-bento-grid > * { grid-area: auto !important; }
          .bento-hero { min-height: 120px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── SPEAKERS ───────────────────────────────────────────────────────────────
const SPEAKERS = [
  {
    name: "Dr. Mohammad Khalaf Alghamdi",
    title: "Ph.D. Deputy Mayor for Strategy & Transformation",
    org: "Madinah Municipality",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Mohamad+Khalaf.png",
  },
  {
    name: "Eng. Meshal Aldeaijy",
    title: "Strategic Planning and Execution Advisor",
    org: "Confidential",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Eng.+Meshal+Aldeaijy.png",
  },
  {
    name: "Abdelkader NESSIB",
    title: "IT Operations & Infrastructure Manager / Cybersecurity & Digital Transformation Advisor",
    org: "Saipem Qatar",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Abdelkader.png",
  },
  {
    name: "Ben Kite",
    title: "Senior Executive Leader – Defence, Intelligence, Cyber, Security & Resilience",
    org: "Kearney",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Ben_Kite.png",
  },
];

function SpeakersSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="speakers" style={{ background: `linear-gradient(180deg, ${BG} 0%, ${BG_CARD} 50%, ${BG} 100%)`, padding: "clamp(48px, 6vw, 80px) 0", position: "relative", overflow: "hidden" }}>
      {/* Background glows */}
      <div style={{ position: "absolute", top: "10%", left: "-5%", width: "40%", height: "60%", background: `radial-gradient(ellipse, ${V}08, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: "35%", height: "50%", background: `radial-gradient(ellipse, ${MINT}05, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${V_BRIGHT})` }} />
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: V_BRIGHT }}>Speakers</span>
            <span style={{ width: 28, height: 1, background: `linear-gradient(270deg, transparent, ${V_BRIGHT})` }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-1.5px", color: "rgba(255,255,255,0.92)", lineHeight: 1.15, margin: 0 }}>
            Featured <span className="opex-shimmer-text">panellists</span>
          </h2>
        </motion.div>

        {/* Speaker cards */}
        <div className="opex-pi-speakers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, alignItems: "stretch" }}>
          {SPEAKERS.map((speaker, i) => (
            <motion.div
              key={speaker.name}
              initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: EASE }}
              style={{
                borderRadius: 24,
                padding: 2,
                background: `linear-gradient(160deg, ${V_BRIGHT}50, ${MINT}30, rgba(255,255,255,0.08), ${V_BRIGHT}30)`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 25px ${V}12`,
                transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
                display: "flex",
              }}
            >
              <div style={{
                borderRadius: 22,
                overflow: "hidden",
                position: "relative",
                background: `linear-gradient(165deg, ${BG_CARD} 0%, ${BG_DARK} 100%)`,
                flex: 1,
                display: "flex",
                flexDirection: "column" as const,
              }}>
                {/* Photo */}
                <div style={{ height: 280, overflow: "hidden", position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={speaker.photo}
                    alt={speaker.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, ${BG_DARK}ee 100%)`, pointerEvents: "none" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${V}10, transparent 50%)`, pointerEvents: "none" }} />
                </div>

                {/* Info */}
                <div style={{ padding: "18px 22px 24px", flex: 1 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 10px", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
                    {speaker.name}
                  </h3>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, color: MINT, margin: "0 0 4px", lineHeight: 1.4 }}>
                    {speaker.title}
                  </p>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.4 }}>
                    {speaker.org}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom border */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 10%, ${V}15, transparent 90%)` }} />

      <style jsx global>{`
        @media (max-width: 900px) {
          .opex-pi-speakers-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 18px !important; }
        }
        @media (max-width: 520px) {
          .opex-pi-speakers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── MARKET DRIVERS ──────────────────────────────────────────────────────────
function MarketDriversSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const prevIdx = useRef(0);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const scrollToCard = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - 40, behavior: "smooth" });
      setActiveIdx(idx);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(center - (card.offsetLeft + card.offsetWidth / 2));
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveIdx(closest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP: tab stagger entrance
  useGSAP(() => {
    if (!inView || !tabsRef.current) return;
    const tabs = tabsRef.current.querySelectorAll(".driver-tab");
    gsap.fromTo(tabs, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: "power2.out", delay: 0.3 });
  }, [inView]);

  // GSAP: scale pop on active card change
  useEffect(() => {
    if (activeIdx === prevIdx.current) return;
    prevIdx.current = activeIdx;
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[activeIdx] as HTMLElement;
    if (!card) return;
    // Pop animation
    gsap.fromTo(card, { scale: 0.97 }, { scale: 1, duration: 0.35, ease: "back.out(1.5)" });
    // Content stagger
    const title = card.querySelector(".driver-title");
    const signal = card.querySelector(".driver-signal");
    const impl = card.querySelector(".driver-impl");
    if (title && signal && impl) {
      gsap.fromTo([title, signal, impl], { opacity: 0.5, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" });
    }
  }, [activeIdx]);

  return (
    <section ref={sectionRef} id="drivers" style={{ background: `linear-gradient(180deg, ${BG} 0%, ${BG_CARD} 100%)`, padding: "clamp(40px, 5vw, 70px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "20%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <div className="driver-header-area" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: EASE }} style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 8px", lineHeight: 1 }}>
            Market <span className="opex-shimmer-text">Drivers</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.5)", margin: "8px 0 0" }}>Forces creating urgency for process intelligence adoption across the GCC</p>
        </motion.div>

        {/* Glass tabs */}
        <div ref={tabsRef} className="driver-tabs-wrap" style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {MARKET_DRIVERS.map((_, i) => {
            const isActive = activeIdx === i;
            const isViolet = i % 2 === 0;
            const rgb = isViolet ? "124,58,237" : "52,211,153";
            const accent = isViolet ? V_BRIGHT : MINT;
            return (
              <button
                key={i}
                className="driver-tab"
                onClick={() => scrollToCard(i)}
                style={{
                  padding: "9px 18px", borderRadius: 12, cursor: "pointer", position: "relative", overflow: "hidden",
                  fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 700, letterSpacing: "0.5px",
                  transition: "all 0.3s ease", border: "none",
                  background: isActive
                    ? `linear-gradient(145deg, rgba(${rgb},0.2), rgba(${rgb},0.08))`
                    : "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                  color: isActive ? accent : "rgba(255,255,255,0.35)",
                  boxShadow: isActive
                    ? `0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 4px 16px rgba(${rgb},0.15), 0 0 0 1px rgba(${rgb},0.25)`
                    : "0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 2px 8px rgba(0,0,0,0.2)",
                  opacity: 0,
                }}
              >
                {/* Top highlight */}
                <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: isActive ? `linear-gradient(90deg, transparent, rgba(${rgb},0.3), transparent)` : "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
                {String(i + 1).padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Carousel */}
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.4 }}>
        <div
          ref={scrollRef}
          className="opex-drivers-scroll"
          style={{ display: "flex", gap: 20, overflowX: "auto", overflowY: "hidden", padding: "8px clamp(20px, 4vw, 60px) 20px", scrollSnapType: "x mandatory", cursor: "grab", WebkitOverflowScrolling: "touch" }}
          onMouseDown={(e) => {
            const el = scrollRef.current;
            if (!el) return;
            el.style.cursor = "grabbing";
            const startX = e.pageX - el.offsetLeft, scrollLeft = el.scrollLeft;
            const onMove = (ev: MouseEvent) => { el.scrollLeft = scrollLeft - (ev.pageX - el.offsetLeft - startX); };
            const onUp = () => { el.style.cursor = "grab"; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        >
          {MARKET_DRIVERS.map((item, i) => {
            const isViolet = i % 2 === 0;
            const rgb = isViolet ? "124,58,237" : "52,211,153";
            const accent = isViolet ? V_BRIGHT : MINT;
            const isActive = activeIdx === i;

            return (
              <div
                key={item.driver}
                className="driver-carousel-card"
                style={{
                  flex: "0 0 min(85vw, 720px)", scrollSnapAlign: "center",
                  borderRadius: 22, position: "relative", overflow: "hidden",
                  padding: "36px 40px 32px",
                  background: `linear-gradient(145deg, rgba(${rgb},0.08), rgba(255,255,255,0.03) 50%, rgba(${rgb},0.05))`,
                  border: `1px solid rgba(${isActive ? rgb : "255,255,255"},${isActive ? 0.25 : 0.06})`,
                  boxShadow: isActive
                    ? `0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 16px 48px rgba(0,0,0,0.45), 0 0 24px rgba(${rgb},0.1)`
                    : `0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 4px 16px rgba(0,0,0,0.25)`,
                  transition: "all 0.4s ease",
                  userSelect: "none",
                  opacity: isActive ? 1 : 0.55,
                  transform: isActive ? "scale(1)" : "scale(0.96)",
                }}
              >
                {/* Top accent glow line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent 5%, rgba(${rgb},0.7) 50%, transparent 95%)`, boxShadow: `0 0 12px rgba(${rgb},0.25)` }} />
                {/* Glass reflection */}
                <div style={{ position: "absolute", top: 2, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
                {/* Left accent bar */}
                <div style={{ position: "absolute", top: "15%", left: 0, width: 2, height: "30%", background: `linear-gradient(180deg, rgba(${rgb},0.5), transparent)`, borderRadius: "0 2px 2px 0" }} />

                {/* Layout: left content + right number */}
                <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <h4 className="driver-title" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(22px, 2.5vw, 28px)", color: accent, margin: "0 0 16px", lineHeight: 1.25, textShadow: `0 0 24px rgba(${rgb},0.25)` }}>{item.driver}</h4>
                    <p className="driver-signal" style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.8)", lineHeight: 1.75, margin: "0 0 20px" }}>{item.signal}</p>

                    {/* Implication bar — glass */}
                    <div className="driver-impl" style={{
                      padding: "14px 18px", borderRadius: 14, position: "relative", overflow: "hidden",
                      background: `rgba(${rgb},0.07)`,
                      borderLeft: `3px solid rgba(${rgb},0.45)`,
                      boxShadow: `0 1px 0 rgba(255,255,255,0.04) inset`,
                    }}>
                      <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
                      <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{item.implication}</p>
                    </div>
                  </div>

                  {/* Large number */}
                  <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(64px, 8vw, 100px)", color: accent, opacity: 0.14, lineHeight: 1, letterSpacing: "-4px", textShadow: `0 0 30px rgba(${rgb},0.15)` }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ flex: "0 0 40px" }} />
        </div>
      </motion.div>

      {/* Mobile tabs — below carousel, hidden on desktop */}
      <div className="driver-tabs-mobile" style={{ display: "none", justifyContent: "center", gap: 8, flexWrap: "wrap", maxWidth: 1100, margin: "20px auto 0", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {MARKET_DRIVERS.map((_, i) => {
          const isActive = activeIdx === i;
          const isViolet = i % 2 === 0;
          const rgb = isViolet ? "124,58,237" : "52,211,153";
          const accent = isViolet ? V_BRIGHT : MINT;
          return (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              style={{
                padding: "9px 18px", borderRadius: 12, cursor: "pointer", position: "relative", overflow: "hidden",
                fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 700, letterSpacing: "0.5px",
                transition: "all 0.3s ease", border: "none",
                background: isActive
                  ? `linear-gradient(145deg, rgba(${rgb},0.2), rgba(${rgb},0.08))`
                  : "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                color: isActive ? accent : "rgba(255,255,255,0.35)",
                boxShadow: isActive
                  ? `0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 4px 16px rgba(${rgb},0.15), 0 0 0 1px rgba(${rgb},0.25)`
                  : "0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>

      {/* Progress bar with glowing dot */}
      <div style={{ maxWidth: 1100, margin: "16px auto 0", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "visible", position: "relative" }}>
          <div style={{ height: "100%", width: `${((activeIdx + 1) / MARKET_DRIVERS.length) * 100}%`, background: `linear-gradient(90deg, ${V_BRIGHT}, ${MINT})`, borderRadius: 3, transition: "width 0.4s ease", position: "relative" }}>
            {/* Leading dot */}
            <div className="progress-dot" style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 8, height: 8, borderRadius: "50%", background: MINT, boxShadow: `0 0 8px ${MINT}, 0 0 16px ${MINT}` }} />
          </div>
        </div>
      </div>

      <style>{`
        .opex-drivers-scroll::-webkit-scrollbar { display: none; }
        .opex-drivers-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .driver-carousel-card:hover { opacity: 1 !important; transform: scale(1) !important; }
        .driver-tab:hover { color: rgba(255,255,255,0.6) !important; }
        .progress-dot { animation: dotPulse 1.5s ease-in-out infinite; }
        @keyframes dotPulse { 0%,100%{box-shadow: 0 0 8px ${MINT}, 0 0 16px ${MINT}} 50%{box-shadow: 0 0 12px ${MINT}, 0 0 28px ${MINT}, 0 0 40px rgba(52,211,153,0.3)} }
        @media (max-width: 768px) {
          .driver-carousel-card { flex: 0 0 90vw !important; padding: 24px 20px 20px !important; }
          .driver-carousel-card > div { flex-direction: column !important; }
          .driver-carousel-card > div > div:last-child { display: none; }
          .driver-tabs-wrap { display: none !important; }
          .driver-tabs-mobile { display: flex !important; }
        }
      `}</style>
    </section>
  );
}

// ─── CASE STUDIES ────────────────────────────────────────────────────────────
function CaseStudiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeIdx, setActiveIdx] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const prevIdx = useRef(0);
  const isAnimating = useRef(false);
  const pendingIdx = useRef<number | null>(null);

  const cs = CASE_STUDIES[displayIdx];
  const isViolet = displayIdx % 2 === 0;
  const rgb = isViolet ? "124,58,237" : "52,211,153";
  const accent = isViolet ? V_BRIGHT : MINT;

  // Preload all logo images on mount
  useEffect(() => {
    CASE_STUDIES.forEach((c) => {
      if (c.logo) {
        const img = new Image();
        img.src = c.logo;
      }
    });
  }, []);

  useGSAP(() => {
    if (!inView || !tabsRef.current) return;
    const tabs = tabsRef.current.querySelectorAll(".cs-tab");
    gsap.fromTo(tabs, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: "power2.out", delay: 0.3 });
  }, [inView]);

  useGSAP(() => {
    if (!inView || !cardRef.current) return;
    gsap.fromTo(cardRef.current, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power2.out", delay: 0.5 });
  }, [inView]);

  // Fade out → swap content → fade in (queues rapid clicks)
  useEffect(() => {
    if (activeIdx === prevIdx.current) return;
    const card = cardRef.current;
    if (!card) return;

    // If already animating, queue the latest click
    if (isAnimating.current) {
      pendingIdx.current = activeIdx;
      return;
    }

    const direction = activeIdx > prevIdx.current ? 1 : -1;
    prevIdx.current = activeIdx;
    isAnimating.current = true;

    // Kill any running tweens on card to avoid overlap
    gsap.killTweensOf(card);

    // Fade out
    gsap.to(card, { opacity: 0, scale: 0.97, duration: 0.15, ease: "power2.in", onComplete: () => {
      // Swap content
      setDisplayIdx(activeIdx);
      // Fade in after render
      requestAnimationFrame(() => {
        gsap.fromTo(card, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.5)" });
        const els = card.querySelectorAll(".cs-anim");
        if (els.length) gsap.fromTo(els, { opacity: 0, x: 16 * direction }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" });
        isAnimating.current = false;

        // Process queued click
        if (pendingIdx.current !== null && pendingIdx.current !== activeIdx) {
          const next = pendingIdx.current;
          pendingIdx.current = null;
          setActiveIdx(next);
        }
      });
    }});
  }, [activeIdx]);

  // Memoized tab click handler
  const handleTabClick = useCallback((i: number) => {
    if (i !== activeIdx) setActiveIdx(i);
  }, [activeIdx]);

  return (
    <section ref={sectionRef} id="case-studies" style={{ background: `linear-gradient(180deg, ${BG_CARD} 0%, ${BG} 100%)`, padding: "clamp(48px, 6vw, 80px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: "5%", left: "-5%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 50%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}} transition={{ duration: 1, ease: EASE }} style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 8px", lineHeight: 1 }}>
            Regional <span className="opex-shimmer-text">Case Studies</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.45)", margin: "8px 0 0" }}>How leading GCC enterprises drive measurable improvements</p>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, delay: 0.4, ease: EASE }} style={{ width: 80, height: 3, background: `linear-gradient(90deg, transparent, ${V_BRIGHT}, ${MINT}, transparent)`, margin: "16px auto 0", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px rgba(124,58,237,0.3)` }} />
        </motion.div>

        {/* Step counter */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 }} style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: "2px" }}>{String(activeIdx + 1).padStart(2, "0")} / {String(CASE_STUDIES.length).padStart(2, "0")}</span>
        </motion.div>

        <div ref={tabsRef} className="cs-tabs-desktop" style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {CASE_STUDIES.map((c, i) => {
            const isActive = activeIdx === i;
            const tabRgb = i % 2 === 0 ? "124,58,237" : "52,211,153";
            const tabAccent = i % 2 === 0 ? V_BRIGHT : MINT;
            return (
              <button key={c.company} className="cs-tab" onClick={() => handleTabClick(i)} style={{
                padding: "9px 18px", borderRadius: 12, cursor: "pointer", position: "relative", overflow: "hidden",
                fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 700, letterSpacing: "0.3px",
                transition: "all 0.3s ease", border: "none", opacity: 0,
                background: isActive ? `linear-gradient(145deg, rgba(${tabRgb},0.2), rgba(${tabRgb},0.08))` : "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                color: isActive ? tabAccent : "rgba(255,255,255,0.35)",
                boxShadow: isActive ? `0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 4px 16px rgba(${tabRgb},0.15), 0 0 0 1px rgba(${tabRgb},0.25)` : "0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 2px 8px rgba(0,0,0,0.2)",
              }}>
                <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: isActive ? `linear-gradient(90deg, transparent, rgba(${tabRgb},0.3), transparent)` : "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
                {c.company}
              </button>
            );
          })}
        </div>

        <div ref={cardRef} style={{
          borderRadius: 24, padding: 3,
          background: `linear-gradient(160deg, rgba(${rgb},0.15) 0%, rgba(255,255,255,0.04) 30%, rgba(${rgb},0.06) 60%, rgba(255,255,255,0.03) 100%)`,
          boxShadow: `0 2px 0 rgba(255,255,255,0.08) inset, 0 -2px 0 rgba(0,0,0,0.2) inset, 0 20px 56px rgba(0,0,0,0.5), 0 6px 16px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(${rgb},0.12)`,
          transition: "background 0.5s ease, box-shadow 0.5s ease",
          willChange: "transform, opacity",
        }}>
          <div className="cs-card-inner" style={{
            borderRadius: 21, padding: "clamp(32px, 4vw, 48px) clamp(32px, 4.5vw, 52px)",
            background: "linear-gradient(180deg, rgba(14,14,28,0.93), rgba(8,8,18,0.97))",
            boxShadow: "inset 0 2px 0 rgba(255,255,255,0.05), inset 0 -2px 4px rgba(0,0,0,0.3), inset 2px 0 8px rgba(255,255,255,0.02), inset -2px 0 8px rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden",
          }}>
            {/* Full-bleed company logo background */}
            {cs.logo && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="cs-watermark" loading="lazy" decoding="async" src={cs.logo} alt="" style={{ position: "absolute", top: 0, bottom: 0, pointerEvents: "none" as const, margin: "auto 0", zIndex: 0, right: cs.logoStyle?.right ?? -30, height: cs.logoStyle?.height ?? "130%", width: cs.logoStyle?.width ?? "auto", objectFit: (cs.logoStyle?.objectFit as React.CSSProperties["objectFit"]) ?? "contain", opacity: cs.logoStyle?.opacity ?? 1, willChange: "opacity" }} />
                <div style={{ position: "absolute", inset: 0, background: `rgba(8,8,18,${cs.logoStyle?.overlayDark ?? 0.5})`, pointerEvents: "none", zIndex: 1 }} />
              </>
            )}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent 5%, rgba(${rgb},0.55) 50%, transparent 95%)`, boxShadow: `0 0 16px rgba(${rgb},0.2)` }} />
            <div style={{ position: "absolute", top: 2, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
            <div style={{ position: "absolute", inset: 6, borderRadius: 15, border: "1px solid rgba(255,255,255,0.03)", boxShadow: "inset 0 1px 2px rgba(255,255,255,0.02)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "10%", left: 0, width: 3, height: "35%", background: `linear-gradient(180deg, rgba(${rgb},0.6), transparent)`, borderRadius: "0 2px 2px 0", boxShadow: `0 0 14px rgba(${rgb},0.3)` }} />
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, rgba(${rgb},0.08), transparent 60%)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, rgba(${rgb},0.1), transparent)` }} />
            {/* Left edge highlight */}
            <div style={{ position: "absolute", top: "15%", bottom: "15%", left: 0, width: 1, background: `linear-gradient(180deg, transparent, rgba(255,255,255,0.06), transparent)` }} />
            {/* Midline reflection */}
            <div style={{ position: "absolute", top: "50%", left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)", pointerEvents: "none" }} />

            <div className="cs-content-row" style={{ display: "flex", gap: "clamp(28px, 5vw, 56px)", alignItems: "flex-start", position: "relative", zIndex: 2 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="cs-anim" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px, 3vw, 34px)", color: accent, margin: "0 0 8px", letterSpacing: "-1px", lineHeight: 1.15, textShadow: `0 0 28px rgba(${rgb},0.25)` }}>{cs.company}</h3>
                <p className="cs-anim" style={{ fontFamily: "var(--font-outfit)", fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: "0 0 18px", lineHeight: 1.35 }}>{cs.title}</p>
                <p className="cs-anim" style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: "0 0 24px" }}>{cs.desc}</p>
                <div className="cs-anim">
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "2.5px", margin: "0 0 14px" }}>Key Outcomes</p>
                  {cs.outcomes.map((o) => (
                    <div key={o} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10, padding: "12px 16px", borderRadius: 14, position: "relative", overflow: "hidden", background: "rgba(14,14,28,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: `3px solid rgba(${rgb},0.4)`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.2)" }}>
                      <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M20 6L9 17l-5-5" /></svg>
                      <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.55 }}>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="cs-watermark-col" style={{ flexShrink: 0, width: "clamp(80px, 12vw, 160px)" }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "visible", position: "relative" }}>
            <div style={{ height: "100%", width: `${((activeIdx + 1) / CASE_STUDIES.length) * 100}%`, background: `linear-gradient(90deg, ${V_BRIGHT}, ${MINT})`, borderRadius: 3, transition: "width 0.4s ease", position: "relative" }}>
              <div className="cs-progress-dot" style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 8, height: 8, borderRadius: "50%", background: MINT, boxShadow: `0 0 8px ${MINT}, 0 0 16px ${MINT}` }} />
            </div>
          </div>
        </div>
      </div>

        {/* Mobile tabs — below card */}
        <div className="cs-tabs-mobile" style={{ display: "none", justifyContent: "center", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
          {CASE_STUDIES.map((c, i) => {
            const isActive = activeIdx === i;
            const tabRgb = i % 2 === 0 ? "124,58,237" : "52,211,153";
            const tabAccent = i % 2 === 0 ? V_BRIGHT : MINT;
            return (
              <button key={c.company} className="cs-tab" onClick={() => handleTabClick(i)} style={{
                padding: "9px 18px", borderRadius: 12, cursor: "pointer", position: "relative", overflow: "hidden",
                fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 700, letterSpacing: "0.3px",
                transition: "all 0.3s ease", border: "none",
                background: isActive ? `linear-gradient(145deg, rgba(${tabRgb},0.2), rgba(${tabRgb},0.08))` : "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                color: isActive ? tabAccent : "rgba(255,255,255,0.35)",
                boxShadow: isActive ? `0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 4px 16px rgba(${tabRgb},0.15), 0 0 0 1px rgba(${tabRgb},0.25)` : "0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 2px 8px rgba(0,0,0,0.2)",
              }}>
                {c.company}
              </button>
            );
          })}
        </div>

      <style>{`
        .cs-tab { transition: all 0.35s cubic-bezier(0.22,1,0.36,1) !important; }
        .cs-tab:hover { color: rgba(255,255,255,0.65) !important; transform: translateY(-2px); }
        .cs-progress-dot { animation: csDotPulse 1.5s ease-in-out infinite; }
        @keyframes csDotPulse { 0%,100%{box-shadow: 0 0 8px ${MINT}, 0 0 16px ${MINT}} 50%{box-shadow: 0 0 12px ${MINT}, 0 0 28px ${MINT}, 0 0 40px rgba(52,211,153,0.3)} }
        @media (max-width: 768px) {
          .cs-content-row { flex-direction: column !important; }
          .cs-watermark-col { display: none !important; }
          .cs-card-inner { padding: 24px 20px 20px !important; }
          .cs-tab { padding: 7px 14px !important; font-size: 11px !important; }
          .cs-tabs-desktop { display: none !important; }
          .cs-tabs-mobile { display: flex !important; }
        }
      `}</style>
    </section>
  );
}

// ─── WHO WILL BE IN THE ROOM ─────────────────────────────────────────────────
function WhoAttendsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const groups = [
    { title: "Senior Roles", items: SENIOR_ROLES, color: V_BRIGHT, rgb: "124,58,237" },
    { title: "Target Industries", items: TARGET_INDUSTRIES, color: MINT, rgb: "52,211,153" },
  ];

  // GSAP: Pill stagger entrance per group
  useGSAP(() => {
    if (!inView || !pillsRef.current) return;
    groups.forEach((_, gi) => {
      const pills = pillsRef.current!.querySelectorAll(`.opex-pill-${gi}`);
      gsap.fromTo(pills, { opacity: 0, y: 12, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05, ease: "power2.out", delay: 0.4 + gi * 0.25 });
    });
  }, [inView]);

  return (
    <section ref={sectionRef} id="attend" style={{ background: BG, padding: "clamp(48px, 6vw, 80px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "15%", right: "-5%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 50%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <div ref={pillsRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}} transition={{ duration: 1, ease: EASE }} style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 8px", lineHeight: 1 }}>
            Target <span className="opex-shimmer-text">Audience</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.45)", margin: "8px 0 0" }}>Senior leaders driving operational transformation across the GCC</p>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, delay: 0.4, ease: EASE }} style={{ width: 100, height: 3, background: `linear-gradient(90deg, transparent, ${V_BRIGHT}, ${MINT}, transparent)`, margin: "16px auto 0", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px rgba(124,58,237,0.3)` }} />
        </motion.div>

        {/* Two panels — align start so Industries doesn't stretch */}
        <div className="opex-attend-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
          {groups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + gi * 0.15, ease: EASE }}
            >
              {/* Outer bezel */}
              <div style={{
                borderRadius: 24, padding: 3,
                background: `linear-gradient(160deg, rgba(${group.rgb},0.14) 0%, rgba(255,255,255,0.04) 30%, rgba(${group.rgb},0.06) 60%, rgba(255,255,255,0.03) 100%)`,
                boxShadow: `0 2px 0 rgba(255,255,255,0.07) inset, 0 -2px 0 rgba(0,0,0,0.2) inset, 0 16px 48px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(${group.rgb},0.1)`,
              }}>
                {/* Inner glass panel */}
                <div style={{
                  borderRadius: 21, padding: "clamp(24px, 3vw, 36px)",
                  background: "linear-gradient(180deg, rgba(14,14,28,0.93), rgba(8,8,18,0.97))",
                  boxShadow: "inset 0 2px 0 rgba(255,255,255,0.05), inset 0 -2px 4px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  position: "relative", overflow: "hidden",
                }}>
                  {/* Decorative layers */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent 5%, rgba(${group.rgb},0.5) 50%, transparent 95%)`, boxShadow: `0 0 14px rgba(${group.rgb},0.18)` }} />
                  <div style={{ position: "absolute", top: 2, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
                  <div style={{ position: "absolute", inset: 6, borderRadius: 15, border: "1px solid rgba(255,255,255,0.03)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: "8%", left: 0, width: 3, height: "25%", background: `linear-gradient(180deg, rgba(${group.rgb},0.6), transparent)`, borderRadius: "0 2px 2px 0", boxShadow: `0 0 12px rgba(${group.rgb},0.3)` }} />
                  <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, rgba(${group.rgb},0.06), transparent 60%)`, pointerEvents: "none" }} />
                  {/* Bottom edge glow */}
                  <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, rgba(${group.rgb},0.08), transparent)` }} />
                  {/* Left edge highlight */}
                  <div style={{ position: "absolute", top: "15%", bottom: "15%", left: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.05), transparent)" }} />

                  {/* Group label + count */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 2, background: `linear-gradient(90deg, rgba(${group.rgb},0.5), transparent)`, borderRadius: 1 }} />
                      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 700, color: group.color, textTransform: "uppercase", letterSpacing: "3px" }}>{group.title}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 600, color: `rgba(${group.rgb},0.5)`, letterSpacing: "1px" }}>{group.items.length}</span>
                  </div>

                  {/* Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {group.items.map((item) => (
                      <span key={item} className={`opex-pill-${gi}`} style={{
                        opacity: 0,
                        padding: "11px 20px", borderRadius: 14, position: "relative", overflow: "hidden",
                        background: `linear-gradient(145deg, rgba(${group.rgb},0.07), rgba(${group.rgb},0.02))`,
                        border: `1px solid rgba(${group.rgb},0.14)`,
                        boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset, 0 2px 8px rgba(0,0,0,0.2)",
                        fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.78)",
                        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)", cursor: "default",
                      }}>
                        <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" }} />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .opex-pill-0:hover, .opex-pill-1:hover { transform: translateY(-2px); }
        .opex-pill-0:hover { border-color: rgba(124,58,237,0.3) !important; box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 6px 20px rgba(124,58,237,0.1) !important; }
        .opex-pill-1:hover { border-color: rgba(52,211,153,0.3) !important; box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 6px 20px rgba(52,211,153,0.1) !important; }
        @media (max-width: 768px) { .opex-attend-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── AGENDA ──────────────────────────────────────────────────────────────────
function AgendaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // GSAP: Timeline line + card stagger
  useGSAP(() => {
    if (!inView || !timelineRef.current) return;
    const cards = timelineRef.current.querySelectorAll(".opex-agenda-card");
    gsap.fromTo(cards, { opacity: 0, x: 30, scale: 0.97 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, stagger: 0.07, ease: "power2.out", delay: 0.4 });
  }, [inView]);

  return (
    <section ref={sectionRef} id="agenda" style={{ background: `linear-gradient(180deg, ${BG} 0%, ${BG_DARK} 100%)`, padding: "clamp(48px, 6vw, 80px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "20%", right: "-5%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 50%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}} transition={{ duration: 1, ease: EASE }} style={{ textAlign: "center", marginBottom: 44 }}>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: V_BRIGHT, margin: "0 0 12px", opacity: 0.7 }}>Programme</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 10px", lineHeight: 1 }}>
            Webinar <span className="opex-shimmer-text">Agenda</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.4)", margin: "0 0 0" }}>2 Hours &middot; Panels, Keynotes & Sponsor Presentations</p>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, delay: 0.4, ease: EASE }} style={{ width: 80, height: 3, background: `linear-gradient(90deg, transparent, ${V_BRIGHT}, ${MINT}, transparent)`, margin: "16px auto 0", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px rgba(124,58,237,0.3)` }} />
        </motion.div>

        {/* Timeline — split into 2 columns */}
        <div ref={timelineRef} className="opex-agenda-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 clamp(20px, 3vw, 36px)" }}>
          {[AGENDA.slice(0, 5), AGENDA.slice(5)].map((col, ci) => (
            <div key={ci} style={{ position: "relative" }}>
              {/* Column label */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 + ci * 0.15, ease: EASE }} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingLeft: 42 }}>
                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: ci === 0 ? V_BRIGHT : MINT, opacity: 0.6 }}>
                  {ci === 0 ? "Session 1 – 5" : "Session 6 – 9"}
                </span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(${ci === 0 ? "124,58,237" : "52,211,153"},0.2), transparent)` }} />
              </motion.div>

              {/* Vertical gradient line per column */}
              <motion.div initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}} transition={{ duration: 1.5, delay: 0.3 + ci * 0.2, ease: EASE }} style={{ position: "absolute", left: 20, top: 50, bottom: 24, width: 3, borderRadius: 2, background: ci === 0 ? `linear-gradient(180deg, ${V_BRIGHT}, ${MINT}50, ${V_BRIGHT}70)` : `linear-gradient(180deg, ${MINT}70, ${V_BRIGHT}50, ${MINT})`, transformOrigin: "top", boxShadow: `0 0 10px rgba(124,58,237,0.2)`, zIndex: 1 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.map((item, idx) => {
                  const globalIdx = ci * 5 + idx;
                  const isPanel = item.title.includes("Panel");
                  const isSponsor = item.title.includes("Sponsor");
                  const isKeynote = item.title.includes("Keynote");
                  const type = isPanel ? "panel" : isSponsor ? "sponsor" : isKeynote ? "keynote" : "general";
                  const color = isPanel ? V_BRIGHT : isSponsor ? MINT : isKeynote ? "#F59E0B" : "rgba(255,255,255,0.6)";
                  const rgb = isPanel ? "124,58,237" : isSponsor ? "52,211,153" : isKeynote ? "245,158,11" : "255,255,255";
                  const hasSubtopics = item.subtopics && item.subtopics.length > 0;
                  const isExpanded = expandedIdx === globalIdx;

                  return (
                    <div key={item.title} className={`opex-agenda-card ${isExpanded ? "opex-agenda-expanded" : ""}`} data-rgb={rgb} style={{ opacity: 0, display: "flex", gap: 0, alignItems: "stretch" }}>
                      {/* Node */}
                      <div style={{ width: 42, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22, position: "relative", zIndex: 2 }}>
                        <div className="opex-agenda-node" style={{
                          width: isPanel || isKeynote ? 14 : 10, height: isPanel || isKeynote ? 14 : 10, borderRadius: "50%",
                          background: `radial-gradient(circle at 35% 35%, ${color}, rgba(${rgb},0.4))`,
                          boxShadow: `0 0 0 3px rgba(${rgb},0.12), 0 0 12px rgba(${rgb},0.4)`,
                          transition: "all 0.3s ease",
                        }} />
                      </div>

                      {/* Card */}
                      <div
                        onClick={() => hasSubtopics ? setExpandedIdx(isExpanded ? null : globalIdx) : null}
                        style={{
                          flex: 1, borderRadius: 18, padding: 2, cursor: hasSubtopics ? "pointer" : "default",
                          background: isExpanded
                            ? `linear-gradient(145deg, rgba(${rgb},0.2), rgba(${rgb},0.06) 50%, rgba(${rgb},0.12) 100%)`
                            : `linear-gradient(145deg, rgba(${rgb},0.1), rgba(255,255,255,0.03) 50%, rgba(${rgb},0.05) 100%)`,
                          boxShadow: isExpanded
                            ? `0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 8px 28px rgba(${rgb},0.15), 0 0 0 1px rgba(${rgb},0.1)`
                            : `0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 6px 20px rgba(0,0,0,0.3)`,
                          transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                        }}
                      >
                        <div style={{
                          borderRadius: 16, padding: "clamp(14px, 1.8vw, 20px) clamp(16px, 2.2vw, 24px)",
                          background: "linear-gradient(180deg, rgba(14,14,28,0.92), rgba(6,6,14,0.96))",
                          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.04), inset 0 -1px 3px rgba(0,0,0,0.25)",
                          border: "1px solid rgba(255,255,255,0.04)",
                          position: "relative", overflow: "hidden",
                          display: "flex",
                        }}>
                          {/* Left accent bar */}
                          <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 3, borderRadius: 2, background: `linear-gradient(180deg, transparent, ${color}, transparent)`, opacity: isExpanded ? 0.8 : 0.3, transition: "opacity 0.3s ease" }} />

                          <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

                          <div style={{ flex: 1, paddingLeft: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 600, color, letterSpacing: "0.5px" }}>{item.time}</span>
                              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 7, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color, padding: "2px 8px", borderRadius: 50, background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.18)`, }}>{type}</span>
                            </div>

                            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(13px, 1.3vw, 15px)", color: "white", margin: "0 0 4px", lineHeight: 1.3 }}>{item.title}</h4>

                            {/* Gradient separator */}
                            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, rgba(${rgb},0.3), transparent)`, marginBottom: 6 }} />

                            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: isExpanded ? 99 : 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{item.desc}</p>

                            {hasSubtopics && (
                              <>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 600, color: `rgba(${rgb},0.6)` }}>{isExpanded ? "Hide topics" : `${item.subtopics!.length} topics`}</span>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" style={{ transition: "transform 0.3s ease", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}><path d="M6 9l6 6 6-6" /></svg>
                                </div>
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
                                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid rgba(${rgb},0.08)` }}>
                                        {item.subtopics!.map((st, si) => (
                                          <motion.div key={st} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: si * 0.04 }} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6, padding: "6px 10px", borderRadius: 8, background: `rgba(${rgb},0.04)`, borderLeft: `2px solid rgba(${rgb},0.2)` }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2, opacity: 0.5 }}><path d="M20 6L9 17l-5-5" /></svg>
                                            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.45 }}>{st}</span>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .opex-agenda-card:hover > div:last-child {
          box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 12px 32px rgba(0,0,0,0.35), 0 0 20px rgba(124,58,237,0.08) !important;
          transform: translateY(-2px);
        }
        .opex-agenda-card:hover .opex-agenda-node {
          transform: scale(1.3);
        }
        .opex-agenda-expanded > div:last-child {
          transform: translateY(-1px);
        }
        @keyframes opex-node-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(124,58,237,0.12), 0 0 12px rgba(124,58,237,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(124,58,237,0.08), 0 0 18px rgba(124,58,237,0.5); }
        }
        .opex-agenda-node { animation: opex-node-pulse 3s ease-in-out infinite; }
        @media (max-width: 768px) {
          .opex-agenda-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── FROM THE STAGE — Event Highlights ───────────────────────────────────────

const OPEX_HIGHLIGHTS = [
  { id: "5obYKv-vJZE", title: "OPEX First UAE 2026" },
  { id: "dbL42utoYW4", title: "OPEX First KSA 2025" },
  { id: "3uvw31I1tq8", title: "Enterprise OPS Conference" },
];

const OPEX_SHORTS = [
  { id: "WCsfo5Z6xVY", title: "OPEX First Testimonial" },
  { id: "baCK3xnKh68", title: "OPEX First Testimonial" },
  { id: "vMv0AfXMQL0", title: "OPEX First Testimonial" },
  { id: "AefPAed0g-I", title: "OPEX First Testimonial" },
  { id: "SH9Z1U2_rAM", title: "OPEX First Testimonial" },
  { id: "wLgYOHHB6o4", title: "OPEX First Testimonial" },
  { id: "2jpIlqo0HSY", title: "OPEX First Testimonial" },
  { id: "SLkj5gO-LQ8", title: "OPEX First Testimonial" },
];

function OpexVideoCard({ videoId, title, label, isHero, isVertical }: { videoId: string; title: string; label?: string; isHero?: boolean; isVertical?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbSrc = isVertical
    ? `https://img.youtube.com/vi/${videoId}/oar2.jpg`
    : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

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
          <img loading="lazy" src={thumbSrc} alt={title} className="opex-v-thumb"
            {...(isVertical ? { onError: (e: React.SyntheticEvent<HTMLImageElement>) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; } } : {})}
          />
          <div className="opex-v-overlay" />
          <div className="opex-v-play-wrap">
            <div className={`opex-v-play-btn ${isHero ? "opex-v-play-hero" : ""}`}>
              <svg width={isHero ? "18" : "14"} height={isHero ? "18" : "14"} viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
          {label && (
            <div className="opex-v-label">
              <span style={{ background: `linear-gradient(135deg, ${V}4d 0%, ${V}26 100%)`, borderColor: `${V}4d` }}>{label}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OpexHighlights() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: `linear-gradient(180deg, ${BG_DARK} 0%, ${BG} 50%, ${BG_DARK} 100%)`, padding: "clamp(60px, 8vw, 100px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "10%", left: "-5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 50%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: EASE }} style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 12px", lineHeight: 1 }}>
            From the{" "}
            <span style={{ background: `linear-gradient(110deg, ${V_BRIGHT}, ${MINT}, ${V_BRIGHT})`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "opexShimmer 6s ease-in-out infinite" }}>Stage</span>
          </h2>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
            style={{ width: 120, height: 3, background: `linear-gradient(90deg, transparent, ${V_BRIGHT}, transparent)`, margin: "0 auto 16px", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px rgba(124,58,237,0.5)` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.45)", letterSpacing: "0.5px" }}>Keynotes, panels, and conversations captured live from OPEX First summits.</span>
        </motion.div>

        {/* 3-column grid with bezels */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3, ease: EASE }} className="opex-eh-grid">
          {OPEX_HIGHLIGHTS.map((v, i) => (
            <div key={v.id} className="opex-eh-grid-card">
              <div style={{
                width: "100%", height: "100%", padding: 3, borderRadius: 22,
                background: `linear-gradient(145deg, rgba(${i % 2 === 0 ? "124,58,237" : "52,211,153"},0.15) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 70%, rgba(${i % 2 === 0 ? "52,211,153" : "124,58,237"},0.1) 100%)`,
                boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 -2px 0 rgba(0,0,0,0.3) inset, 0 12px 40px rgba(0,0,0,0.4)`,
              }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: 19, overflow: "hidden",
                  background: `linear-gradient(180deg, ${BG_CARD} 0%, ${BG_DARK} 100%)`,
                  border: "1px solid rgba(255,255,255,0.04)",
                  boxShadow: `inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.03)`,
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", zIndex: 3 }} />
                  <OpexVideoCard videoId={v.id} title={v.title} label={v.title} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .opex-v-card {
          position: relative; width: 100%; height: 100%;
          border-radius: 16px; overflow: hidden;
          background: rgba(255,255,255,0.03); cursor: pointer;
          transition: border-color 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .opex-v-card:hover .opex-v-thumb { transform: scale(1.04); }
        .opex-v-card:hover .opex-v-play-btn {
          background: ${V}e6; border-color: ${V}66;
          transform: scale(1.2); box-shadow: 0 0 0 8px ${V}1f, 0 4px 16px ${V}40;
        }
        .opex-v-card:hover .opex-v-label span { box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.3); }
        .opex-v-label { position: absolute; bottom: 10px; left: 10px; z-index: 2; }
        .opex-v-label span {
          font-family: var(--font-outfit); font-size: 9px; font-weight: 600;
          letter-spacing: 1.2px; text-transform: uppercase; color: #fff;
          padding: 4px 10px; border-radius: 50px; border-style: solid; border-width: 1px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 10px rgba(0,0,0,0.25);
          transition: box-shadow 0.3s ease;
        }
        .opex-v-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .opex-v-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%); }
        .opex-v-play-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .opex-v-play-btn {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1); animation: opex-v-pulse 3s ease-in-out infinite;
        }
        .opex-v-play-hero { width: 64px; height: 64px; }
        @keyframes opex-v-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.08); } 50% { box-shadow: 0 0 0 6px rgba(255,255,255,0.04); } }
        .opex-eh-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(14px, 2vw, 20px); }
        .opex-eh-grid-card { aspect-ratio: 16 / 9; }
        @media (max-width: 768px) { .opex-eh-grid { grid-template-columns: 1fr; max-width: 500px; margin: 0 auto; } }
        @media (max-width: 600px) { .opex-v-play-hero { width: 48px; height: 48px; } }
      `}</style>
    </section>
  );
}

// ─── FROM THE ROOM — Testimonials ────────────────────────────────────────────

function OpexTestimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const row1 = OPEX_SHORTS.slice(0, 5);
  const row2 = OPEX_SHORTS.slice(5);

  return (
    <section ref={ref} style={{ background: `linear-gradient(180deg, ${BG} 0%, ${BG_DARK} 50%, ${BG} 100%)`, padding: "clamp(60px, 8vw, 100px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "20%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 50%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: EASE }} style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 12px", lineHeight: 1 }}>
            From the{" "}
            <span style={{ background: `linear-gradient(110deg, ${MINT}, ${V_BRIGHT}, ${MINT})`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "opexShimmer 6s ease-in-out infinite" }}>Room</span>
          </h2>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
            style={{ width: 120, height: 3, background: `linear-gradient(90deg, transparent, ${MINT}, transparent)`, margin: "0 auto 16px", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px rgba(52,211,153,0.5)` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.45)", letterSpacing: "0.5px" }}>Hear directly from operational excellence leaders who attended our summits.</span>
        </motion.div>

        {/* Row 1 — 5 cards */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.3, ease: EASE }} className="opex-vr-showcase">
          {row1.map((v, i) => (
            <div key={v.id} className={`opex-vr-slot opex-vr-slot-${i % 2 === 0 ? "tall" : "short"} ${i === 2 ? "opex-vr-slot-hero" : ""}`}>
              <div style={{
                width: "100%", height: "100%", padding: 3, borderRadius: 22,
                background: `linear-gradient(145deg, rgba(${i % 2 === 0 ? "124,58,237" : "52,211,153"},0.15) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 70%, rgba(${i % 2 === 0 ? "52,211,153" : "124,58,237"},0.1) 100%)`,
                boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 -2px 0 rgba(0,0,0,0.3) inset, 0 12px 40px rgba(0,0,0,0.4)`,
              }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: 19, overflow: "hidden",
                  background: `linear-gradient(180deg, ${BG_CARD} 0%, ${BG_DARK} 100%)`,
                  border: "1px solid rgba(255,255,255,0.04)",
                  boxShadow: `inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.03)`,
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", zIndex: 3 }} />
                  <OpexVideoCard videoId={v.id} title={v.title} label="OPEX First" isVertical />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Row 2 — 3 cards */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.5, ease: EASE }} className="opex-vr-showcase" style={{ marginTop: 24 }}>
          {row2.map((v, i) => (
            <div key={v.id} className={`opex-vr-slot opex-vr-slot-${i % 2 === 0 ? "short" : "tall"} ${i === 1 ? "opex-vr-slot-hero" : ""}`}>
              <div style={{
                width: "100%", height: "100%", padding: 3, borderRadius: 22,
                background: `linear-gradient(145deg, rgba(${i % 2 === 0 ? "52,211,153" : "124,58,237"},0.15) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 70%, rgba(${i % 2 === 0 ? "124,58,237" : "52,211,153"},0.1) 100%)`,
                boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 -2px 0 rgba(0,0,0,0.3) inset, 0 12px 40px rgba(0,0,0,0.4)`,
              }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: 19, overflow: "hidden",
                  background: `linear-gradient(180deg, ${BG_CARD} 0%, ${BG_DARK} 100%)`,
                  border: "1px solid rgba(255,255,255,0.04)",
                  boxShadow: `inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.03)`,
                  position: "relative",
                }}>
                  <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", zIndex: 3 }} />
                  <OpexVideoCard videoId={v.id} title={v.title} label="OPEX First" isVertical />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Caption */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
          style={{ textAlign: "center", marginTop: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${V}40)` }} />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "2px", textTransform: "uppercase" }}>8 Voices · OPEX First Series</span>
          <div style={{ width: 32, height: 1, background: `linear-gradient(270deg, transparent, ${V}40)` }} />
        </motion.div>
      </div>

      <style jsx global>{`
        .opex-vr-showcase { display: flex; gap: 18px; align-items: center; justify-content: center; }
        .opex-vr-slot { flex-shrink: 0; transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        .opex-vr-slot:hover { transform: translateY(-8px); }
        .opex-vr-slot-tall { width: 200px; height: 340px; }
        .opex-vr-slot-short { width: 180px; height: 270px; }
        .opex-vr-slot-hero.opex-vr-slot-tall { width: 230px; height: 400px; }
        .opex-vr-showcase .opex-v-thumb { object-position: center 20%; }
        .opex-vr-showcase .opex-v-card { border-radius: 16px; border: none; box-shadow: none; }
        .opex-vr-showcase .opex-v-card:hover { box-shadow: none; transform: none; }
        .opex-vr-showcase .opex-v-label span { font-size: 8px; }
        @media (max-width: 900px) {
          .opex-vr-showcase { flex-wrap: nowrap; overflow-x: auto; justify-content: flex-start; padding-bottom: 8px; }
          .opex-vr-showcase::-webkit-scrollbar { display: none; }
          .opex-vr-slot-tall { width: 140px; height: 240px; }
          .opex-vr-slot-short { width: 130px; height: 200px; }
          .opex-vr-slot-hero.opex-vr-slot-tall { width: 155px; height: 270px; }
        }
        @media (max-width: 560px) {
          .opex-vr-slot-tall { width: 115px; height: 195px; }
          .opex-vr-slot-short { width: 105px; height: 165px; }
          .opex-vr-slot-hero.opex-vr-slot-tall { width: 130px; height: 225px; }
        }
      `}</style>
    </section>
  );
}

// ─── REGISTRATION ────────────────────────────────────────────────────────────
function RegistrationSection() {
  return (
    <section id="register" style={{ background: `linear-gradient(180deg, ${BG_DARK} 0%, ${BG} 100%)`, padding: "clamp(40px, 5vw, 70px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 10%, rgba(124,58,237,0.25) 30%, rgba(52,211,153,0.25) 70%, transparent 90%)` }} />
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 50%)`, pointerEvents: "none" }} />
      <InquiryForm defaultCountry="AE" eventName="Process Intelligence MENA 2026" />
    </section>
  );
}

// ─── CONTACT SECTION ─────────────────────────────────────────────────────────
function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: `linear-gradient(180deg, ${BG} 0%, ${BG_DARK} 100%)`, padding: "clamp(24px, 3vw, 40px) 0", position: "relative", overflow: "hidden" }}>
      {/* Aurora orbs */}
      <div style={{ position: "absolute", top: "10%", left: "-5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 50%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: EASE }} style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", color: "white", letterSpacing: "-1.5px", margin: "0 0 8px", lineHeight: 1 }}>
            Get in <span className="opex-shimmer-text">Touch</span>
          </h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0 }}>Speaking or sponsorship opportunities</p>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, delay: 0.4, ease: EASE }} style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${V_BRIGHT}, ${MINT}, transparent)`, margin: "12px auto 0", borderRadius: 2, transformOrigin: "center" }} />
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(16px, 2vw, 24px)" }} className="opex-contact-grid">
          {CONTACTS.map((person, i) => {
            const accent = i % 2 === 0 ? V_BRIGHT : MINT;
            const rgb = i % 2 === 0 ? "124,58,237" : "52,211,153";
            const waNumber = person.phone.replace(/[\s+]/g, "");
            return (
              <motion.div
                key={person.name}
                className="opex-contact-card"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15, ease: EASE }}
                style={{
                  borderRadius: 22, padding: 3, position: "relative",
                  background: `linear-gradient(160deg, rgba(${rgb},0.15) 0%, rgba(255,255,255,0.04) 40%, rgba(${rgb},0.08) 100%)`,
                  boxShadow: `0 1px 0 rgba(255,255,255,0.06) inset, 0 -2px 0 rgba(0,0,0,0.3) inset, 0 8px 28px rgba(0,0,0,0.4)`,
                }}
              >
                <div style={{
                  borderRadius: 19, padding: "clamp(24px, 3vw, 36px) clamp(20px, 2.5vw, 28px)",
                  background: "linear-gradient(180deg, rgba(14,14,28,0.93), rgba(6,6,14,0.97))",
                  boxShadow: "inset 0 2px 0 rgba(255,255,255,0.05), inset 0 -1px 3px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden", textAlign: "center",
                }}>
                  {/* Top reflection */}
                  <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
                  {/* Top accent line */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent 10%, rgba(${rgb},0.4) 50%, transparent 90%)` }} />
                  {/* Corner orb */}
                  <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, rgba(${rgb},0.08), transparent 60%)`, pointerEvents: "none" }} />

                  {/* Conic gradient avatar ring */}
                  <div style={{ width: 88, height: 88, borderRadius: "50%", margin: "0 auto 18px", padding: 3, background: `conic-gradient(${accent}, rgba(${rgb},0.2), ${accent})`, boxShadow: `0 0 24px rgba(${rgb},0.25)` }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(0,0,0,0.3)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={person.photo} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                    </div>
                  </div>

                  {/* Category badge */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12, padding: "4px 12px", borderRadius: 50, background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.18)` }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent, boxShadow: `0 0 6px ${accent}` }} />
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 9, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1.5px" }}>{person.category}</span>
                  </div>

                  <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(16px, 1.5vw, 19px)", color: "white", margin: "0 0 4px", letterSpacing: "-0.5px" }}>{person.name}</h4>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 18px" }}>{person.title}</p>

                  {/* Separator */}
                  <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, rgba(${rgb},0.3), transparent)`, margin: "0 auto 16px" }} />

                  {/* Contact buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <a href={`mailto:${person.email}`} className="opex-contact-btn" style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 14px", borderRadius: 12,
                      fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", textDecoration: "none",
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      transition: "all 0.3s ease",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      {person.email}
                    </a>
                    <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="opex-contact-btn opex-wa-btn" style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 14px", borderRadius: 12,
                      fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: "white", textDecoration: "none",
                      background: "linear-gradient(135deg, #25D366, #128C7E)", border: "1px solid rgba(37,211,102,0.3)",
                      transition: "all 0.3s ease",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .opex-contact-card { transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease; }
        .opex-contact-card:hover { transform: translateY(-6px); }
        .opex-contact-btn:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.15) !important; }
        .opex-wa-btn:hover { background: linear-gradient(135deg, #2be06f, #1a9e6b) !important; box-shadow: 0 4px 16px rgba(37,211,102,0.3) !important; }
        @media (max-width: 768px) { .opex-contact-grid { grid-template-columns: 1fr !important; max-width: 340px; margin: 0 auto; } }
      `}</style>
    </section>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function ProcessIntelligenceMENA() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div style={{ background: BG }}>
      <style jsx global>{`
        /* Override InquiryForm accent to violet-mint */
        #register {
          --orange: ${V};
          --orange-bright: ${V_BRIGHT};
          --orange-glow: rgba(124,58,237,0.35);
        }
        #register #get-involved {
          background: transparent !important;
        }
        #register #get-involved button[type="submit"] {
          background: linear-gradient(135deg, ${V}, ${V_BRIGHT}) !important;
          border: none !important;
        }
        #register #get-involved button[type="submit"]:hover {
          background: linear-gradient(135deg, ${V_DIM}, ${V}) !important;
          box-shadow: 0 12px 40px rgba(124,58,237,0.3) !important;
        }
        #register #get-involved .flex.items-center.gap-3 > div:first-child {
          background: rgba(124,58,237,0.06) !important;
          border-color: rgba(124,58,237,0.12) !important;
        }
        #register #get-involved .inquiry-split > div:last-child > div {
          background: rgba(14,14,28,0.6) !important;
          border-color: rgba(124,58,237,0.08) !important;
        }

        /* ─── Global Responsive — auto-fit all screens ─── */
        @media (max-width: 1024px) {
          .opex-drivers-grid { gap: 12px !important; }
          .opex-cases-grid { gap: 14px !important; }
        }
        @media (max-width: 768px) {
          .opex-drivers-grid,
          .opex-cases-grid,
          .opex-attend-grid,
          .opex-contact-grid { grid-template-columns: 1fr !important; }
          .opex-drivers-grid > *,
          .opex-cases-grid > * { grid-column: auto !important; }
          .opex-detail-pills { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .opex-stat-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .opex-detail-pills { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <HeroSection />
      <AboutSection />
      <KeyThemesSection />
      <SpeakersSection />
      <MarketDriversSection />
      <CaseStudiesSection />
      <WhoAttendsSection />
      <AgendaSection />
      <OpexHighlights />
      <OpexTestimonials />
      <RegistrationSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
