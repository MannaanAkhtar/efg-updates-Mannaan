"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import { Footer, InquiryForm } from "@/components/sections";
import CybercoreBackground from "@/components/ui/cybercore-section-hero";
import EventNavigation from "@/components/ui/EventNavigation";

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = "#D34B9A";           // Pink/magenta
const C_BRIGHT = "#E86BB8";    // Light pink
const C_DIM = "#A83A7A";       // Deep pink
const CYAN = "#00C9FF";        // Cyan accent
const CYAN_DIM = "#0090B8";    // Deep cyan
const BG = "#0a0e2a";          // Deep navy background
const BG_DARK = "#070b1f";     // Darker navy
const BG_CARD = "#0d1233";     // Card navy
const EASE = [0.16, 1, 0.3, 1] as const;

const S3 = "https://efg-final.s3.eu-north-1.amazonaws.com";
const EVENT_DATE = new Date("2026-05-19T14:00:00+04:00");

// ─── Countdown Hook ──────────────────────────────────────────────────────────
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
function Counter({ to, suffix = "", prefix = "", duration = 1800 }: { to: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState("0");
  const decimals = String(to).includes(".") ? String(to).split(".")[1].length : 0;
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal((eased * to).toFixed(decimals));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration, decimals]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const THREAT_STATS = [
  { value: 8.75, prefix: "$", suffix: "M", label: "Average cost of a cyber attack on a Middle East organisation", source: "IBM Research", color: CYAN },
  { value: 5967, prefix: "", suffix: "", label: "Ransomware attacks recorded globally in 2025, a 37% jump over 2024, many targeting critical infrastructure", source: "Cyble CRIL, Jan 2025", color: C_BRIGHT },
  { value: 700, prefix: "", suffix: "%", label: "Surge in sponsored attacks since June 13, 2025, targeting power grids, hospitals & civilian apps", source: "Leder Institute / West Point", color: CYAN },
  { value: 2451, prefix: "", suffix: "", label: "ICS vulnerabilities disclosed in 2025 across 152 vendors, nearly double the 2024 figure of 1,690", source: "Cyble CRIL Annual Report 2025", color: C_BRIGHT },
  { value: 26, prefix: "", suffix: "", label: "Active OT threat groups now tracked globally, 11 were operationally active in 2025, up from 9 in 2024", source: "Dragos 2025 OT/ICS Report", color: C_BRIGHT },
  { value: 50000, prefix: "", suffix: "", label: "Cyberattacks targeting the UAE every single day, according to the UAE's own Cybersecurity Council", source: "UAE Cybersecurity Council, 2025", color: CYAN },
];

const KEY_THEMES = [
  { title: "AI-Powered Threats Targeting OT Environments", icon: "M12 2a4 4 0 014 4v1a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2V6a4 4 0 014-4zM9 18h6M10 22h4" },
  { title: "Incident Response & Operational Resilience", icon: "M12 9v2m0 4h.01M5.07 19H19a2 2 0 001.75-2.94l-6.97-12.06a2 2 0 00-3.5 0L3.32 16.06A2 2 0 005.07 19z" },
  { title: "IT/OT Convergence, Managing the Expanded Attack Surface", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { title: "Zero Trust Architecture for OT Networks", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  { title: "Securing Critical Infrastructure & ICS/SCADA Systems", icon: "M2 20h20M4 20V10l8-6 8 6v10M9 20v-4a3 3 0 016 0v4" },
  { title: "UAE NCA & KSA National Cybersecurity Frameworks", icon: "M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11" },
  { title: "Real-Time Threat Detection & Visibility in OT", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  { title: "Bridging IT Security Teams & OT Engineering", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
];

const PANELS = [
  { num: "01", title: "AI-Powered Threats in OT: Are We Ready?", desc: "State-sponsored actors are now deploying AI-assisted recon and wiper malware against industrial systems across the Gulf. How are energy and utilities operators actually responding, and what does a practical OT defence posture look like in 2025?" },
  { num: "02", title: "IT/OT Convergence: The Air Gap Is Gone", desc: "Fortinet's 2025 research confirmed the traditional IT/OT air gap is largely gone. With supply-chain attacks doubling and vendor access compromises surging, where are the real exposure points, and how are leaders managing them in live operational environments?" },
  { num: "03", title: "From Reactive to Resilient: Building an OT Incident Response Capability", desc: "Only 52% of OT organisations globally have a documented, tested incident response plan. With ransomware now causing full OT site shutdowns in 25% of cases, this panel tackles what genuine resilience requires, from early detection to recovery and regulatory reporting." },
];

const INDUSTRIES = ["Energy & Power Generation", "Oil & Gas", "Water & Utilities", "Petrochemicals", "Critical Manufacturing", "Telecommunications", "Ports & Logistics", "Government & Defence"];
const JOB_FUNCTIONS = ["CISO / CSO", "OT Security Manager", "Head of IT/OT", "VP / Director of Operations", "ICS / SCADA Engineer", "SOC Lead", "Risk & Compliance", "CTO / CIO"];
const COUNTRIES = ["Saudi Arabia", "UAE", "Qatar", "Kuwait", "Oman", "Bahrain", "Jordan", "Egypt", "Nigeria", "South Africa", "Kenya"];

const WHY_SPONSOR = [
  { title: "Quality over quantity", desc: "100 carefully selected OT professionals, not a mass-market webinar. Every person in the room is a real decision-maker in energy, utilities, or critical infrastructure." },
  { title: "Real dialogue, real intelligence", desc: "Panel discussions surface what organisations are actually struggling with right now. You leave with genuine market intelligence on where MENA OT teams stand." },
  { title: "Credibility, not advertising", desc: "The no-sales-pitch format means your brand stands for knowledge and expertise, not vendor noise. The audience remembers the sponsors who helped them think." },
  { title: "The right moment", desc: "After a year that saw Iranian drone strikes hit Gulf cloud infrastructure, SCADA attacks across the region, and 700% surges in state-sponsored activity, the demand for this conversation has never been higher." },
];

const S3_TEAM = "https://efg-final.s3.eu-north-1.amazonaws.com/about-us-photos";
const CONTACTS_TEAM = [
  {
    name: "Mary",
    title: "Delegate Acquisition",
    category: "Speaking Enquiries",
    phone: "+971 58 599 762",
    email: "Mary@eventsfirstgroup.com",
    photo: `${S3_TEAM}/Mary.jpg`,
  },
  {
    name: "Mayur Methi",
    title: "Partnership Manager",
    category: "Sponsorship Enquiries",
    phone: "+971 56 170 9909",
    email: "mayur@eventsfirstgroup.com",
    photo: `${S3_TEAM}/Mayur-Methi.png`,
  },
];

// ─── HERO SECTION, Cybercore Grid ───────────────────────────────────────────
function HeroSection() {
  const cd = useCountdown(EVENT_DATE);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section id="overview" style={{ position: "relative", height: "100vh", minHeight: 700, overflow: "hidden", background: BG_DARK }}>
      {/* Cybercore animated background, sits behind everything */}
      {mounted && <CybercoreBackground beamCount={70} />}

      {/* Central radial glow, cyan-pink light source */}
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: "70%", background: "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(0,201,255,0.25), rgba(211,75,154,0.1) 35%, rgba(0,201,255,0.03) 60%, transparent 80%)", filter: "blur(30px)", zIndex: 2, pointerEvents: "none" }} />

      {/* Secondary upper glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "50%", background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(211,75,154,0.08), transparent 70%)", zIndex: 2, pointerEvents: "none" }} />

      {/* Content overlay, matches demo.tsx pattern */}
      <div className="content-wrapper">
        <main className="hero-section">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 50, background: "rgba(211,75,154,0.08)", border: "1px solid rgba(211,75,154,0.2)", marginBottom: 32 }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 12px ${C_BRIGHT}` }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: C_BRIGHT }}>Virtual Forum</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>MENA · 2026</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            OT Security<br />
            <span className="otvm-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, ${CYAN} 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              in the Age of AI Threats
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            A closed, senior-level virtual forum for 100 OT security leaders protecting MENA&apos;s critical infrastructure in the era of convergence.
          </motion.p>

          {/* Info badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}
          >
            {[
              { label: "19 May 2026", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { label: "Virtual · Live", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
              { label: "2 Hours", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "100 Leaders", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
            ].map((item) => (
              <div key={item.label} style={{ padding: "8px 18px", borderRadius: 50, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.65)" }}>{item.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <a href="#register" className="cta-button">Register Now →</a>
            <a href="#sponsor" className="cta-button-ghost">Sponsor This Forum</a>
          </motion.div>
        </main>
      </div>

      {/* EFG logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        style={{ position: "absolute", bottom: 80, right: "clamp(24px, 5vw, 80px)", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
        className="otvm-efg-badge"
      >
        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "2px" }}>An Initiative By</span>
        <img src="/events-first-group_logo_alt.svg" alt="Events First Group" style={{ height: 48, width: "auto", opacity: 0.7 }} />
      </motion.div>

      {/* Countdown bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20, padding: "20px 0" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 28 }}>
            {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hrs" }, { v: cd.m, l: "Min" }, { v: cd.s, l: "Sec" }].map((item) => (
              <div key={item.l} className="text-center">
                <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 800, color: "white", display: "block", letterSpacing: "-1px" }}>{String(item.v).padStart(2, "0")}</span>
                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "2px" }}>{item.l}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C_BRIGHT, boxShadow: `0 0 12px ${C_BRIGHT}` }} />
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "2px" }}>Registrations Open</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── THREAT STATS, Bento Dashboard with Floating Orbs ──────────────────────
function ThreatStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Floating orbs animation
  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.utils.toArray<HTMLElement>(".otvm-orb").forEach((orb, i) => {
      gsap.to(orb, {
        x: `random(-40, 40)`,
        y: `random(-30, 30)`,
        duration: 8 + i * 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
      }}
      style={{ background: "#060408", padding: "clamp(60px, 8vw, 100px) 0", position: "relative", overflow: "hidden" }}
    >
      {/* Perspective grid floor */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: "-20%",
        width: "140%",
        height: "45%",
        background: "linear-gradient(90deg, rgba(211,75,154,0.12) 1px, transparent 1px), linear-gradient(0deg, rgba(211,75,154,0.12) 1px, transparent 1px)",
        backgroundSize: "80px 40px",
        transform: "perspective(500px) rotateX(60deg)",
        transformOrigin: "bottom center",
        animation: "moveGrid 12s linear infinite",
        maskImage: "radial-gradient(ellipse 70% 90% at 50% 100%, black 20%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 90% at 50% 100%, black 20%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Floor glow */}
      <div style={{ position: "absolute", bottom: "-5%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "45%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(211,75,154,0.25), rgba(232,107,184,0.08) 40%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />

      {/* Floating orbs, using rgba for reliable opacity */}
      <div className="otvm-orb" style={{ position: "absolute", top: "5%", left: "8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(211,75,154,0.2), transparent 65%)", filter: "blur(70px)", pointerEvents: "none", zIndex: 0 }} />
      <div className="otvm-orb" style={{ position: "absolute", bottom: "10%", right: "5%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(224,60,50,0.12), transparent 65%)", filter: "blur(70px)", pointerEvents: "none", zIndex: 0 }} />
      <div className="otvm-orb" style={{ position: "absolute", top: "35%", left: "55%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,107,184,0.15), transparent 65%)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />

      {/* Cursor glow */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(900px circle at ${mousePos.x}% ${mousePos.y}%, rgba(211,75,154,0.1), transparent 45%)`, pointerEvents: "none", transition: "background 0.3s ease", zIndex: 1 }} />

      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(211,75,154,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(211,75,154,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

      {/* Top fade */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, #070b1f, transparent)", pointerEvents: "none", zIndex: 1 }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Section heading, centered, large, with glow underline */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 12px", lineHeight: 1 }}>
            The Threat in <span className="otvm-hero-shimmer" style={{ backgroundImage: `linear-gradient(110deg, ${C_BRIGHT} 0%, #fff 45%, ${C_BRIGHT} 100%)`, backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Numbers</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="otvm-glow-line"
            style={{ width: 120, height: 3, background: `linear-gradient(90deg, transparent, ${C_BRIGHT}, transparent)`, margin: "0 auto 16px", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 20px ${C_BRIGHT}40` }}
          />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>2025 – 2026 data · Sources verified</span>
        </motion.div>

        {/* Stats grid, skeuomorphic panels */}
        <div className="otvm-stats-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}>
          {THREAT_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, rotateX: 8 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="otvm-stat-card"
              style={{
                padding: 0,
                borderRadius: 20,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                /* Outer frame, embossed bezel with gradient shimmer */
                background: "linear-gradient(145deg, rgba(211,75,154,0.1) 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.15) 80%, rgba(232,107,184,0.06) 100%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(211,75,154,0.12)",
                border: "none",
              }}
            >
              {/* Inner recessed panel, the "screen" */}
              <div style={{
                margin: 5,
                borderRadius: 16,
                padding: "clamp(24px, 2.5vw, 36px)",
                background: "linear-gradient(160deg, rgba(211,75,154,0.06) 0%, #0a0810 20%, #080610 80%, rgba(232,107,184,0.04) 100%)",
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6), inset 0 0 1px rgba(0,0,0,0.8), inset 0 0 40px rgba(211,75,154,0.03)",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(211,75,154,0.08)",
              }}>
                {/* Subtle screen reflection, top highlight */}
                <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

                {/* Status LED indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: stat.color, boxShadow: `0 0 8px ${stat.color}, 0 0 16px ${stat.color}50` }} />
                  <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "2px" }}>Live Data</span>
                </div>

                {/* Stat number, LED readout style */}
                <motion.div
                  initial={{ opacity: 0, filter: "blur(12px)" }}
                  animate={inView ? { opacity: 1, filter: "blur(0px)" } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "clamp(36px, 4vw, 52px)",
                    color: stat.color,
                    letterSpacing: "-1px",
                    display: "block",
                    marginBottom: 16,
                    textShadow: `0 0 30px ${stat.color}40, 0 0 60px ${stat.color}15`,
                    lineHeight: 1,
                  }}>
                    <Counter to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </span>
                </motion.div>

                {/* Description */}
                <p style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.65,
                  margin: "0 0 16px",
                  textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                }}>
                  {stat.label}
                </p>

                {/* Source, etched label */}
                <div style={{
                  paddingTop: 12,
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}>
                  <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.2)" }}>{stat.source}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout, embossed strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: 32,
            padding: "24px 32px",
            borderRadius: 16,
            background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.1) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ width: 3, height: 36, borderRadius: 2, background: `linear-gradient(to bottom, ${C_BRIGHT}, ${C})`, flexShrink: 0, boxShadow: `0 0 12px ${C}40` }} />
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>
            The numbers tell part of the story. The reality on the ground in 2025 and early 2026 goes further, and for MENA&apos;s energy and utilities operators, it is impossible to ignore.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── ABOUT THE FORUM ─────────────────────────────────────────────────────────
function AboutForum() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // GSAP, Scale + Blur Morph entrance + staggered rows
  useGSAP(() => {
    if (!cardRef.current) return;
    gsap.from(cardRef.current, {
      scale: 0.85, opacity: 0, filter: "blur(18px)",
      duration: 1.4, ease: "power3.out",
      scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
    });
    gsap.from(".otvm-detail-row", {
      y: 24, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: cardRef.current, start: "top 78%", },
    });
  }, { scope: sectionRef });

  // Idle floating animation, subtle continuous tilt so card always feels alive
  useEffect(() => {
    if (!cardInnerRef.current) return;
    const idle = gsap.timeline({ repeat: -1, yoyo: true })
      .to(cardInnerRef.current, { rotateX: 2, rotateY: -3, duration: 3, ease: "sine.inOut", transformPerspective: 800 })
      .to(cardInnerRef.current, { rotateX: -1.5, rotateY: 2, duration: 3, ease: "sine.inOut", transformPerspective: 800 })
      .to(cardInnerRef.current, { rotateX: 1, rotateY: -1, duration: 2.5, ease: "sine.inOut", transformPerspective: 800 });
    // Store timeline reference on the element for pause/resume
    (cardInnerRef.current as HTMLDivElement & { _idleTl?: gsap.core.Timeline })._idleTl = idle;
    return () => { idle.kill(); };
  }, []);

  // Magnetic tilt + glare on hover
  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (!cardInnerRef.current || !glareRef.current) return;
    // Pause idle animation on hover
    const el = cardInnerRef.current as HTMLDivElement & { _idleTl?: gsap.core.Timeline };
    if (el._idleTl) el._idleTl.pause();
    const rect = cardInnerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -12;
    const rotateY = (x - 0.5) * 12;
    gsap.to(cardInnerRef.current, {
      rotateX, rotateY,
      duration: 0.4, ease: "power2.out",
      transformPerspective: 800,
    });
    gsap.to(glareRef.current, {
      opacity: 0.15,
      background: `radial-gradient(600px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.2), transparent 50%)`,
      duration: 0.3,
    });
  };
  const handleCardMouseLeave = () => {
    if (!cardInnerRef.current || !glareRef.current) return;
    gsap.to(cardInnerRef.current, {
      rotateX: 0, rotateY: 0,
      duration: 0.6, ease: "elastic.out(1, 0.5)",
    });
    gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
    // Resume idle animation after mouse leaves
    const el = cardInnerRef.current as HTMLDivElement & { _idleTl?: gsap.core.Timeline };
    if (el._idleTl) setTimeout(() => el._idleTl?.resume(), 600);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
      }}
      style={{ background: `linear-gradient(160deg, ${BG_DARK} 0%, ${BG} 30%, #0c1030 60%, ${BG_CARD} 100%)`, padding: "clamp(60px, 8vw, 100px) 0", position: "relative", overflow: "hidden" }}
    >
      {/* Liquid glass blobs, large, slow-moving, blurred */}
      <div className="otvm-liquid-1" style={{ position: "absolute", top: "5%", right: "0%", width: 600, height: 600, borderRadius: "40% 60% 55% 45% / 55% 40% 60% 45%", background: "linear-gradient(135deg, rgba(211,75,154,0.15), rgba(0,201,255,0.08), rgba(211,75,154,0.1))", filter: "blur(60px)", pointerEvents: "none", opacity: 0.8 }} />
      <div className="otvm-liquid-2" style={{ position: "absolute", bottom: "0%", left: "-5%", width: 500, height: 500, borderRadius: "55% 45% 40% 60% / 45% 55% 45% 55%", background: "linear-gradient(225deg, rgba(0,201,255,0.1), rgba(211,75,154,0.08), rgba(0,201,255,0.12))", filter: "blur(70px)", pointerEvents: "none", opacity: 0.7 }} />
      <div className="otvm-liquid-3" style={{ position: "absolute", top: "40%", left: "40%", width: 400, height: 400, borderRadius: "45% 55% 60% 40% / 60% 45% 55% 45%", background: "radial-gradient(circle, rgba(211,75,154,0.08), transparent 70%)", filter: "blur(80px)", pointerEvents: "none", opacity: 0.6 }} />

      {/* Cursor glow */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, rgba(211,75,154,0.1), transparent 45%)`, pointerEvents: "none", transition: "background 0.3s ease", zIndex: 1 }} />

      {/* Noise texture for glass depth */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "128px 128px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>

        {/* Heading, centered with shimmer + glow underline */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 12px", lineHeight: 1 }}>
            About the <span className="otvm-hero-shimmer" style={{ backgroundImage: "linear-gradient(110deg, rgba(232,107,184,1) 0%, rgba(0,201,255,1) 45%, rgba(232,107,184,1) 100%)", backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Forum</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="otvm-glow-line"
            style={{ width: 120, height: 3, background: "linear-gradient(90deg, transparent, rgba(0,201,255,0.8), transparent)", margin: "0 auto 16px", borderRadius: 2, transformOrigin: "center" }}
          />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Why this conversation needs to happen now</span>
        </motion.div>

        {/* Bold quote callout */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <p style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: "clamp(20px, 2.5vw, 28px)",
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "-0.5px",
            lineHeight: 1.4,
            margin: "0 auto",
            maxWidth: 700,
          }}>
            &ldquo;This is not a product showcase. It is a closed, senior-level virtual forum for the people who keep critical infrastructure running.&rdquo;
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48 }} className="otvm-about-grid">
          {/* Left, description */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ paddingTop: 48 }}
          >
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 19, fontWeight: 400, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, margin: "0 0 20px", textAlign: "justify", textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
              The people responsible for keeping critical infrastructure running across the MENA region are actively reworking their strategies to respond to an AI-accelerated, geopolitically charged threat environment.
            </p>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 19, fontWeight: 400, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, margin: 0, textAlign: "justify", textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
              MENA&apos;s energy and utilities sector sits at a unique intersection: rapid digital transformation, IT/OT convergence, state-sponsored adversaries, and limited cross-sector intelligence sharing. This forum directly addresses that gap, bringing thought leaders from across the region into one room to think out loud, challenge each other, and build practical frameworks together.
            </p>
          </motion.div>

          {/* Right, Event Details card (GSAP: scale+blur entrance + magnetic tilt hover) */}
          <div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{ perspective: 800, height: "100%" }}
          >
            <div ref={cardInnerRef} className="otvm-details-card" style={{
              borderRadius: 20,
              background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.2) 100%)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(211,75,154,0.1)",
              border: "none",
              overflow: "hidden",
              position: "relative",
              padding: 0,
              height: "100%",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}>
              {/* Light glare overlay, follows cursor */}
              <div ref={glareRef} style={{ position: "absolute", inset: 0, borderRadius: 20, opacity: 0, pointerEvents: "none", zIndex: 10 }} />
              {/* Glassmorphism inner panel */}
              <div style={{
                margin: 5,
                borderRadius: 16,
                padding: "28px 32px",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 4px rgba(0,0,0,0.3)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "100%",
              }}>
                {/* Glass reflection */}
                <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
                {/* Inner pink ambient */}
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: "40%", background: "radial-gradient(ellipse, rgba(211,75,154,0.05), transparent 70%)", pointerEvents: "none" }} />

                {/* Left accent bar */}
                <div style={{ position: "absolute", top: 20, left: 0, width: 3, height: 35, background: `linear-gradient(180deg, ${C_BRIGHT}, rgba(0,201,255,0.3))`, borderRadius: "0 2px 2px 0", boxShadow: `0 0 12px rgba(211,75,154,0.4)` }} />

                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "white", margin: "0 0 24px", letterSpacing: "-0.5px", position: "relative" }}>Event Details</h3>
                {[
                  { label: "Duration", value: "2 hours" },
                  { label: "Format", value: "Virtual Live Broadcast" },
                  { label: "Audience", value: "100 OT Security Professionals" },
                  { label: "Panels", value: "3 x 20-minute sessions" },
                  { label: "Sponsors", value: "3 x 10-15 min awareness slots" },
                  { label: "Region", value: "Middle East & Africa" },
                ].map((item, i) => (
                  <div key={item.label} className="otvm-detail-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.05)" : "none", position: "relative" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: i % 2 === 0 ? `rgba(0,201,255,0.7)` : "rgba(211,75,154,0.7)", boxShadow: i % 2 === 0 ? "0 0 8px rgba(0,201,255,0.5)" : "0 0 8px rgba(211,75,154,0.5)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "rgba(255,255,255,0.55)", flex: 1 }}>{item.label}</span>
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", textAlign: "right" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── KEY THEMES, Liquid Glass Bento ─────────────────────────────────────────
function KeyThemesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  return (
    <section
      ref={sectionRef}
      id="themes"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
      }}
      style={{ background: `linear-gradient(180deg, ${BG_DARK} 0%, ${BG} 40%, ${BG_CARD} 100%)`, padding: "clamp(60px, 8vw, 100px) 0", position: "relative", overflow: "hidden" }}
    >
      {/* Floating liquid blobs */}
      <div className="otvm-liquid-1" style={{ position: "absolute", top: "10%", left: "-5%", width: 500, height: 500, borderRadius: "40% 60% 55% 45% / 55% 40% 60% 45%", background: "linear-gradient(135deg, rgba(0,201,255,0.12), rgba(211,75,154,0.06))", filter: "blur(70px)", pointerEvents: "none", opacity: 0.8 }} />
      <div className="otvm-liquid-2" style={{ position: "absolute", bottom: "5%", right: "-5%", width: 450, height: 450, borderRadius: "55% 45% 40% 60% / 45% 55% 45% 55%", background: "linear-gradient(225deg, rgba(211,75,154,0.1), rgba(0,201,255,0.08))", filter: "blur(70px)", pointerEvents: "none", opacity: 0.7 }} />

      {/* Cursor glow */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, rgba(0,201,255,0.06), transparent 45%)`, pointerEvents: "none", transition: "background 0.3s ease", zIndex: 1 }} />

      {/* Grid texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,201,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,201,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 12px", lineHeight: 1 }}>
            Key <span className="otvm-hero-shimmer" style={{ backgroundImage: "linear-gradient(110deg, rgba(232,107,184,1) 0%, rgba(0,201,255,1) 45%, rgba(232,107,184,1) 100%)", backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Themes</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="otvm-glow-line"
            style={{ width: 120, height: 3, background: "linear-gradient(90deg, transparent, rgba(0,201,255,0.8), transparent)", margin: "0 auto 16px", borderRadius: 2, transformOrigin: "center" }}
          />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>The topics that matter right now in MENA OT security</span>
        </motion.div>

        {/* Bento grid, 4 columns, first 2 cards span 2 each */}
        <div className="otvm-themes-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}>
          {KEY_THEMES.map((theme, i) => {
            const isLarge = i < 2;
            const accentColor = i % 2 === 0 ? "rgba(0,201,255," : "rgba(211,75,154,";

            return (
              <motion.div
                key={theme.title}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="otvm-theme-card"
                style={{
                  gridColumn: isLarge ? "span 2" : i === 6 ? "2 / 3" : i === 7 ? "3 / 4" : "span 1",
                  borderRadius: 20,
                  /* Skeuomorphic outer bezel */
                  background: `linear-gradient(145deg, ${accentColor}0.06), rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.15) 100%)`,
                  boxShadow: `0 1px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accentColor}0.08)`,
                  border: "none",
                  overflow: "hidden",
                  position: "relative",
                  transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Liquid glass inner panel */}
                <div style={{
                  margin: 4,
                  borderRadius: 17,
                  padding: isLarge ? "clamp(28px, 3vw, 40px)" : "clamp(20px, 2vw, 28px)",
                  background: "rgba(10,14,42,0.5)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: isLarge ? 160 : 120,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}>
                  {/* Glass reflection line */}
                  <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

                  {/* Animated liquid refraction glow */}
                  <div className="otvm-refract" style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse 60% 60% at 30% 30%, ${accentColor}0.06), transparent 70%)`,
                    backgroundSize: "200% 200%",
                    pointerEvents: "none",
                  }} />

                  {/* Large watermark number */}
                  <span style={{
                    position: "absolute",
                    top: isLarge ? 20 : 12,
                    right: isLarge ? 28 : 16,
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: isLarge ? 64 : 48,
                    color: `${accentColor}0.06)`,
                    letterSpacing: "-2px",
                    lineHeight: 1,
                    pointerEvents: "none",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Left accent bar */}
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    bottom: "20%",
                    width: 3,
                    borderRadius: 2,
                    background: `linear-gradient(to bottom, ${accentColor}0.6), ${accentColor}0.15))`,
                    boxShadow: `0 0 12px ${accentColor}0.3)`,
                  }} />

                  {/* Title */}
                  <span style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1.4,
                    position: "relative",
                    paddingLeft: 12,
                    maxWidth: isLarge ? 440 : undefined,
                  }}>
                    {theme.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── PANEL DISCUSSIONS, Horizontal Expanding Accordion ──────────────────────
function PanelDiscussions() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activePanel, setActivePanel] = useState(0);

  const colors = [CYAN, C_BRIGHT, CYAN];

  return (
    <section
      ref={sectionRef}
      id="panels"
      style={{ background: `linear-gradient(135deg, ${BG_DARK} 0%, ${BG} 50%, ${BG_CARD} 100%)`, padding: "clamp(60px, 8vw, 100px) 0", position: "relative", overflow: "hidden" }}
    >
      {/* Background orb */}
      <div className="otvm-liquid-2" style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "55% 45% 40% 60% / 45% 55% 45% 55%", background: "linear-gradient(135deg, rgba(0,201,255,0.06), rgba(211,75,154,0.05))", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 12px", lineHeight: 1 }}>
            Panel <span className="otvm-hero-shimmer" style={{ backgroundImage: "linear-gradient(110deg, rgba(232,107,184,1) 0%, rgba(0,201,255,1) 45%, rgba(232,107,184,1) 100%)", backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Discussions</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="otvm-glow-line"
            style={{ width: 120, height: 3, background: "linear-gradient(90deg, transparent, rgba(0,201,255,0.8), transparent)", margin: "0 auto 16px", borderRadius: 2, transformOrigin: "center" }}
          />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Click to explore each panel, three focused dialogues</span>
        </motion.div>

        {/* Horizontal Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="otvm-panels-accordion"
          style={{ display: "flex", gap: 14, height: "clamp(340px, 42vh, 420px)" }}
        >
          {PANELS.map((panel, i) => {
            const isActive = activePanel === i;
            const rgb = i === 1 ? "211,75,154" : "0,201,255";

            return (
              <motion.div
                key={panel.num}
                onClick={() => setActivePanel(i)}
                animate={{ flex: isActive ? 3.5 : 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`otvm-panel-card ${isActive ? "" : "otvm-panel-collapsed"}`}
                style={{
                  borderRadius: 20,
                  /* Skeuomorphic bezel */
                  background: isActive
                    ? `linear-gradient(145deg, rgba(${rgb},0.08), rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.12) 100%)`
                    : "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.15) 100%)",
                  border: "none",
                  boxShadow: isActive
                    ? `0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.3) inset, 0 12px 48px rgba(0,0,0,0.5), 0 0 40px rgba(${rgb},0.08), 0 0 0 1px rgba(${rgb},0.12)`
                    : "0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 4px 20px rgba(0,0,0,0.3)",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  transition: "box-shadow 0.5s ease, background 0.5s ease",
                }}
              >
                {/* Recessed glass inner panel */}
                <div style={{
                  margin: 4,
                  borderRadius: 17,
                  height: "calc(100% - 8px)",
                  background: "rgba(8,11,32,0.7)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -2px 6px rgba(0,0,0,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: isActive ? "clamp(32px, 3vw, 44px)" : "clamp(16px, 1.5vw, 24px)",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Glass reflection */}
                  <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" }} />

                  {/* Top accent line */}
                  <div style={{ position: "absolute", top: 0, left: isActive ? "5%" : "20%", right: isActive ? "5%" : "20%", height: 2, background: `linear-gradient(90deg, transparent, ${colors[i]}${isActive ? "" : "60"}, transparent)`, transition: "all 0.5s ease" }} />

                  {/* Left accent bar, active only */}
                  {isActive && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      style={{ position: "absolute", left: 0, top: "10%", bottom: "10%", width: 4, borderRadius: 2, background: `linear-gradient(to bottom, ${colors[i]}, rgba(255,255,255,0.05))`, boxShadow: `0 0 16px rgba(${rgb},0.35)`, transformOrigin: "top" }}
                    />
                  )}

                  {/* Inner glow, active only */}
                  {isActive && (
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "70%", height: "50%", background: `radial-gradient(ellipse, rgba(${rgb},0.05), transparent 70%)`, pointerEvents: "none" }} />
                  )}

                  {/* Collapsed state */}
                  <motion.div
                    animate={{ opacity: isActive ? 0 : 1, scale: isActive ? 0.95 : 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      display: isActive ? "none" : "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      gap: 14,
                      padding: "0 8px",
                    }}
                  >
                    {/* Panel label */}
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 700, color: colors[i], textTransform: "uppercase", letterSpacing: "2px", opacity: 0.7 }}>Panel</span>
                    {/* Number */}
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: 40,
                      color: colors[i],
                      letterSpacing: "-2px",
                      opacity: 0.4,
                      textShadow: `0 0 30px rgba(${rgb},0.2)`,
                    }}>
                      {panel.num}
                    </span>
                    {/* Title */}
                    <span style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.4)",
                      textAlign: "center",
                      lineHeight: 1.35,
                    }}>
                      {panel.title}
                    </span>
                  </motion.div>

                  {/* Expanded state */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      style={{ paddingLeft: 18 }}
                    >
                      <span style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 10,
                        fontWeight: 700,
                        color: colors[i],
                        textTransform: "uppercase",
                        letterSpacing: "3px",
                        display: "block",
                        marginBottom: 12,
                      }}>
                        Panel {panel.num}
                      </span>
                      <h3 style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "clamp(20px, 2.5vw, 30px)",
                        color: "white",
                        margin: "0 0 14px",
                        lineHeight: 1.25,
                        letterSpacing: "-0.5px",
                      }}>
                        {panel.title}
                      </h3>
                      <p style={{
                        fontFamily: "var(--font-outfit)",
                        fontSize: 14,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.7,
                        margin: 0,
                        maxWidth: 550,
                      }}>
                        {panel.desc}
                      </p>
                      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 32, height: 2, background: `linear-gradient(90deg, ${colors[i]}, transparent)`, borderRadius: 1 }} />
                        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.25)" }}>20-minute moderated dialogue</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom info strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 24, flexWrap: "wrap" }}
        >
          {[
            { label: "Panels", value: "3 Sessions" },
            { label: "Duration", value: "20 min each" },
            { label: "Format", value: "Moderated Dialogue" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1.5px" }}>{item.label}:</span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{item.value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── WHO WILL BE IN THE ROOM ─────────────────────────────────────────────────
function WhoWillBeInRoom() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const pillGroups = [
    { title: "Industries", items: INDUSTRIES, color: CYAN, rgb: "0,201,255" },
    { title: "Job Functions & Seniority", items: JOB_FUNCTIONS, color: C_BRIGHT, rgb: "232,107,184" },
    { title: "Countries", items: COUNTRIES, color: CYAN, rgb: "0,201,255" },
  ];

  return (
    <section ref={sectionRef} id="attend" style={{ background: `linear-gradient(180deg, ${BG_DARK} 0%, ${BG} 50%, ${BG_CARD} 100%)`, padding: "clamp(60px, 8vw, 100px) 0", position: "relative", overflow: "hidden" }}>
      {/* ---------- Floating orbs, MUCH more visible ---------- */}
      <div style={{ position: "absolute", top: "5%", right: "-2%", width: 600, height: 600, borderRadius: "40% 60% 55% 45% / 55% 40% 60% 45%", background: `radial-gradient(circle, rgba(0,201,255,0.25) 0%, rgba(0,201,255,0.08) 50%, transparent 75%)`, filter: "blur(40px)", pointerEvents: "none", animation: "otvmOrbFloat1 12s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "-4%", width: 500, height: 500, borderRadius: "55% 45% 40% 60% / 45% 55% 45% 55%", background: `radial-gradient(circle, rgba(211,75,154,0.22) 0%, rgba(211,75,154,0.06) 50%, transparent 75%)`, filter: "blur(40px)", pointerEvents: "none", animation: "otvmOrbFloat2 14s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "40%", left: "35%", width: 400, height: 400, borderRadius: "45% 55% 60% 40% / 60% 45% 55% 45%", background: `radial-gradient(circle, rgba(0,201,255,0.15) 0%, rgba(211,75,154,0.08) 40%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none", animation: "otvmOrbFloat3 16s ease-in-out infinite" }} />

      {/* Keyframes for floating orbs */}
      <style>{`
        @keyframes otvmOrbFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,20px) scale(1.08)} }
        @keyframes otvmOrbFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(25px,-15px) scale(1.05)} }
        @keyframes otvmOrbFloat3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-15px,-25px) scale(1.1)} }
        .otvm-glass-pill:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 0 20px var(--pill-glow), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 2px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.3) !important;
          border-color: var(--pill-border-hover) !important;
          color: rgba(255,255,255,0.95) !important;
          background: var(--pill-bg-hover) !important;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 28 }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 56px)", color: "white", letterSpacing: "-2px", margin: "0 0 12px", lineHeight: 1 }}>
            Who Will Be in the <span className="otvm-hero-shimmer" style={{ backgroundImage: "linear-gradient(110deg, rgba(232,107,184,1) 0%, rgba(0,201,255,1) 45%, rgba(232,107,184,1) 100%)", backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Room</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 120, height: 3, background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`, margin: "0 auto 16px", borderRadius: 2, transformOrigin: "center", boxShadow: `0 0 12px rgba(0,201,255,0.5)` }}
          />
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.45)", letterSpacing: "0.5px" }}>100 verified OT security professionals from across MENA</span>
        </motion.div>

        {/* Three pill group cards, skeuomorphic bezel containers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {pillGroups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.7, delay: 0.3 + gi * 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                borderRadius: 20,
                padding: 3,
                background: `linear-gradient(145deg, rgba(${group.rgb},0.15) 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.02) 70%, rgba(${group.rgb},0.1) 100%)`,
                boxShadow: `0 1px 0 rgba(255,255,255,0.06) inset, 0 -2px 0 rgba(0,0,0,0.35) inset, 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(${group.rgb},0.06)`,
                overflow: "hidden",
              }}
            >
              {/* Inner recessed panel */}
              <div style={{
                borderRadius: 17,
                padding: "28px 32px",
                background: `linear-gradient(180deg, rgba(13,18,51,0.85) 0%, rgba(7,11,31,0.95) 100%)`,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.04)",
                boxShadow: `inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.03)`,
                position: "relative",
              }}>
                {/* Top glass reflection line */}
                <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)` }} />

                {/* Colored accent bar, left side */}
                <div style={{ position: "absolute", top: 20, left: 0, width: 3, height: 30, background: `linear-gradient(180deg, ${group.color}, rgba(${group.rgb},0.2))`, borderRadius: "0 2px 2px 0", boxShadow: `0 0 12px rgba(${group.rgb},0.4)` }} />

                {/* Category label */}
                <h4 style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 700, color: group.color, textTransform: "uppercase", letterSpacing: "3px", marginBottom: 18, paddingLeft: 12, textShadow: `0 0 20px rgba(${group.rgb},0.4)` }}>{group.title}</h4>

                {/* Pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingLeft: 12 }}>
                  {group.items.map((item, pi) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + gi * 0.12 + pi * 0.03, ease: [0.22, 1, 0.36, 1] }}
                      className="otvm-glass-pill"
                      style={{
                        // CSS custom properties for hover
                        // @ts-expect-error -- CSS custom properties
                        "--pill-glow": `rgba(${group.rgb},0.25)`,
                        "--pill-border-hover": `rgba(${group.rgb},0.4)`,
                        "--pill-bg-hover": `rgba(${group.rgb},0.15)`,
                        padding: "10px 20px",
                        borderRadius: 12,
                        background: `linear-gradient(135deg, rgba(${group.rgb},0.08) 0%, rgba(${group.rgb},0.03) 100%)`,
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        border: `1px solid rgba(${group.rgb},0.18)`,
                        borderTop: `1px solid rgba(255,255,255,0.1)`,
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.25)`,
                        fontFamily: "var(--font-outfit)",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.8)",
                        transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                        cursor: "default",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY SPONSOR ─────────────────────────────────────────────────────────────
function WhySponsor() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const nodeColors = [
    { rgb: "0,201,255", color: CYAN },
    { rgb: "232,107,184", color: C_BRIGHT },
    { rgb: "0,201,255", color: CYAN },
    { rgb: "232,107,184", color: C_BRIGHT },
  ];

  return (
    <section ref={ref} id="sponsor" style={{ background: BG, padding: "clamp(60px, 8vw, 80px) 0", position: "relative", overflow: "hidden" }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", top: "10%", right: "-5%", width: 550, height: 550, borderRadius: "50%", background: `radial-gradient(circle, rgba(211,75,154,0.2) 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "-8%", width: 450, height: 450, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,201,255,0.14) 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        {/* Asymmetric split, left heading + right cards */}
        <div className="otvm-sponsor-split" style={{ display: "grid", gridTemplateColumns: "0.42fr 1fr", gap: "clamp(32px, 5vw, 80px)", alignItems: "start" }}>

          {/* ─── LEFT COLUMN, Sticky heading + decorative ring ─── */}
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(10px)" }}
            animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "sticky", top: 120 }}
          >
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", color: "white", letterSpacing: "-2px", margin: "0 0 20px", lineHeight: 1.05 }}>
              Why{" "}
              <span className="otvm-hero-shimmer" style={{ display: "block", backgroundImage: "linear-gradient(110deg, rgba(232,107,184,1) 0%, rgba(0,201,255,1) 45%, rgba(232,107,184,1) 100%)", backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sponsor</span>
              This Forum
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 80, height: 3, background: `linear-gradient(90deg, ${C_BRIGHT}, ${CYAN})`, marginBottom: 20, borderRadius: 2, transformOrigin: "left", boxShadow: `0 0 14px rgba(211,75,154,0.4)` }}
            />
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 32px" }}>
              Position your brand in front of verified OT security decision-makers across MENA, in a format built for trust, not noise.
            </p>

            {/* Decorative conic ring */}
            <div style={{ position: "relative", width: 160, height: 160 }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: `conic-gradient(from 180deg, ${CYAN}, ${C_BRIGHT}, ${CYAN})`,
                mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                opacity: 0.5,
                animation: "otvmRingSpin 8s linear infinite",
              }} />
              <div style={{
                position: "absolute", inset: 20, borderRadius: "50%",
                background: `conic-gradient(from 0deg, ${C_BRIGHT}, ${CYAN}, ${C_BRIGHT})`,
                mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
                opacity: 0.3,
                animation: "otvmRingSpin 12s linear infinite reverse",
              }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 36, background: `linear-gradient(135deg, ${C_BRIGHT}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>100</span>
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "2px", marginTop: 10, display: "block" }}>Decision Makers</span>
          </motion.div>

          {/* ─── RIGHT COLUMN, 4 cards with connecting timeline ─── */}
          <div style={{ position: "relative" }}>
            {/* Vertical connecting gradient line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                left: 20,
                top: 28,
                bottom: 28,
                width: 2,
                background: `linear-gradient(180deg, ${CYAN}, ${C_BRIGHT}40, ${CYAN}60, ${C_BRIGHT})`,
                borderRadius: 1,
                transformOrigin: "top",
                boxShadow: `0 0 8px rgba(0,201,255,0.2)`,
                zIndex: 1,
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {WHY_SPONSOR.map((item, i) => {
                const nc = nodeColors[i];
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
                    animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
                    transition={{ duration: 0.7, delay: 0.4 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: "flex", gap: 0, alignItems: "stretch" }}
                  >
                    {/* Timeline node */}
                    <div style={{ width: 42, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 24, position: "relative", zIndex: 2 }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: "50%",
                        background: `radial-gradient(circle, ${nc.color} 30%, rgba(${nc.rgb},0.3) 100%)`,
                        boxShadow: `0 0 12px rgba(${nc.rgb},0.5), 0 0 4px rgba(${nc.rgb},0.8)`,
                        border: `2px solid rgba(${nc.rgb},0.6)`,
                      }} />
                    </div>

                    {/* Card, skeuomorphic bezel */}
                    <div style={{ flex: 1, borderRadius: 18, padding: 3, background: `linear-gradient(145deg, rgba(${nc.rgb},0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(${nc.rgb},0.06) 100%)`, boxShadow: `0 1px 0 rgba(255,255,255,0.04) inset, 0 -2px 0 rgba(0,0,0,0.3) inset, 0 6px 24px rgba(0,0,0,0.35)` }}>
                      <div style={{
                        borderRadius: 15,
                        padding: "22px 28px",
                        background: `linear-gradient(180deg, rgba(13,18,51,0.9) 0%, rgba(7,11,31,0.95) 100%)`,
                        boxShadow: `inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.03)`,
                        position: "relative",
                        overflow: "hidden",
                      }}>
                        {/* Top reflection */}
                        <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }} />

                        {/* Number badge */}
                        <div style={{
                          position: "absolute",
                          top: 14,
                          right: 20,
                          fontFamily: "var(--font-display)",
                          fontWeight: 900,
                          fontSize: 11,
                          color: nc.color,
                          opacity: 0.6,
                          letterSpacing: "1px",
                          padding: "3px 10px",
                          borderRadius: 6,
                          background: `rgba(${nc.rgb},0.08)`,
                          border: `1px solid rgba(${nc.rgb},0.15)`,
                        }}>{String(i + 1).padStart(2, "0")}</div>

                        <h3 style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "clamp(17px, 1.5vw, 20px)",
                          color: "white",
                          margin: "0 0 10px",
                          letterSpacing: "-0.5px",
                          paddingRight: 60,
                        }}>{item.title}</h3>
                        <p style={{
                          fontFamily: "var(--font-outfit)",
                          fontSize: 14,
                          fontWeight: 400,
                          color: "rgba(255,255,255,0.5)",
                          lineHeight: 1.75,
                          margin: 0,
                        }}>{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Keyframes + responsive */}
      <style>{`
        @keyframes otvmRingSpin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @media (max-width: 900px) {
          .otvm-sponsor-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── REGISTRATION SECTION, Shared InquiryForm (3 tabs) ─────────────────────
function RegistrationSection() {
  return (
    <section id="register" style={{ background: `linear-gradient(180deg, ${BG} 0%, ${BG_DARK} 100%)`, padding: "clamp(60px, 8vw, 100px) 0", position: "relative", overflow: "hidden" }}>
      {/* Top accent line, full width gradient */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 10%, rgba(0,201,255,0.25) 30%, rgba(211,75,154,0.25) 70%, transparent 90%)` }} />
      {/* Orb, cyan top-left */}
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,201,255,0.1) 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />
      {/* Orb, pink bottom-right */}
      <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(211,75,154,0.08) 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />
      {/* Central subtle glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 700, height: 400, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(0,201,255,0.04) 0%, transparent 70%)`, pointerEvents: "none" }} />
      <InquiryForm defaultCountry="AE" eventName="OT Security First Virtual Boardroom MENA 2026" />
    </section>
  );
}

// ─── CONTACT SECTION, Nairobi People Cards Style ────────────────────────────
function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: `linear-gradient(180deg, ${BG} 0%, ${BG_DARK} 100%)`, padding: "clamp(60px, 8vw, 100px) 0", position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 40% at 50% 30%, rgba(0,201,255,0.04), transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-2px", color: "white", lineHeight: 1.05, margin: "0 0 12px" }}>
            Meet Your{" "}
            <span className="otvm-hero-shimmer" style={{ backgroundImage: "linear-gradient(110deg, rgba(232,107,184,1) 0%, rgba(0,201,255,1) 45%, rgba(232,107,184,1) 100%)", backgroundSize: "250% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Dedicated Team
            </span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="otvm-glow-line"
            style={{ width: 120, height: 3, background: "linear-gradient(90deg, transparent, rgba(0,201,255,0.8), transparent)", margin: "0 auto 16px", borderRadius: 2, transformOrigin: "center" }}
          />
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: "rgba(255,255,255,0.45)", margin: 0 }}>
            Real people, ready to help you make the most of this forum
          </p>
        </motion.div>

        {/* People Grid, 2 columns */}
        <div className="otvm-contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {CONTACTS_TEAM.map((person, i) => {
            const accent = i === 0 ? CYAN : C_BRIGHT;
            const accentRgb = i === 0 ? "0,201,255" : "211,75,154";

            return (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(8px)" }}
                animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="otvm-contact-card"
                style={{
                  textAlign: "center",
                  padding: "36px 28px 32px",
                  borderRadius: 28,
                  background: "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.08) 100%)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 12px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`,
                  transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Top shine */}
                <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />

                {/* Category badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 100, background: "rgba(0,0,0,0.25)", border: `1px solid rgba(${accentRgb},0.25)`, marginBottom: 18 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}` }} />
                  <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>{person.category}</span>
                </div>

                {/* Avatar circle */}
                <div style={{ width: 100, height: 100, margin: "0 auto 20px", borderRadius: "50%", position: "relative" }}>
                  {/* Gradient ring */}
                  <div style={{ position: "absolute", inset: -3, borderRadius: "50%", background: `conic-gradient(from 0deg, ${accent}, ${C_BRIGHT}, ${accent})`, opacity: 0.7 }} />
                  <div style={{ position: "absolute", inset: -3, borderRadius: "50%", boxShadow: `0 0 30px rgba(${accentRgb},0.3)`, pointerEvents: "none" }} />
                  <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", padding: 3, background: BG_DARK }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: `linear-gradient(135deg, rgba(${accentRgb},0.3), rgba(${accentRgb},0.1))` }}>
                      {person.photo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={person.photo} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700, color: "white" }}>{person.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "white", margin: "0 0 6px", letterSpacing: "-0.5px" }}>{person.name}</h3>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.6))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 24px" }}>{person.title}</p>

                {/* Contact buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href={`mailto:${person.email}`} className="otvm-contact-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 20px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", textDecoration: "none", transition: "all 0.3s ease" }}>
                    {person.email}
                  </a>
                  <a href={`https://wa.me/${person.phone.replace(/[\s+]/g, "")}`} target="_blank" rel="noopener noreferrer" className="otvm-whatsapp-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 20px", borderRadius: 14, background: "linear-gradient(135deg, #25D366, #128C7E)", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, color: "white", textDecoration: "none", boxShadow: "0 4px 20px rgba(37,211,102,0.3)", transition: "all 0.3s ease" }}>
                    Chat on WhatsApp
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .otvm-contact-card:hover { transform: translateY(-10px) scale(1.02) !important; border-color: rgba(255,255,255,0.18) !important; box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 24px 80px rgba(0,0,0,0.4), 0 0 50px rgba(0,201,255,0.06), inset 0 1px 0 rgba(255,255,255,0.12) !important; }
        .otvm-contact-btn:hover { background: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.18) !important; transform: translateY(-2px); }
        .otvm-whatsapp-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 6px 28px rgba(37,211,102,0.45), 0 12px 40px rgba(37,211,102,0.25) !important; }
      `}</style>
    </section>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function OTSecurityVirtualForumMENA() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div style={{ background: BG }}>
      <style jsx global>{`
        /* ─── Override InquiryForm for this page ─────────────────── */
        #register {
          --orange: ${C_BRIGHT};
          --orange-bright: ${C};
          --orange-glow: rgba(211,75,154,0.35);
        }
        /* Make InquiryForm background transparent so wrapper shows through */
        #register #get-involved {
          background: transparent !important;
        }
        /* Active tab pill, gradient */
        #register #get-involved button[style*="var(--orange)"] {
          background: linear-gradient(135deg, ${C_BRIGHT}, ${CYAN}) !important;
          border-color: transparent !important;
        }
        /* CTA submit button, gradient */
        #register #get-involved button[type="submit"] {
          background: linear-gradient(135deg, ${C_BRIGHT}, ${CYAN}) !important;
          border: none !important;
        }
        #register #get-involved button[type="submit"]:hover {
          background: linear-gradient(135deg, ${C}, #4DD9FF) !important;
          box-shadow: 0 12px 40px rgba(211,75,154,0.3) !important;
        }
        /* Override hardcoded orange rgba in perk icon boxes */
        #register #get-involved .flex.items-center.gap-3 > div:first-child {
          background: rgba(211,75,154,0.06) !important;
          border-color: rgba(211,75,154,0.12) !important;
        }
        /* Form card, match page card style */
        #register #get-involved .inquiry-split > div:last-child > div {
          background: rgba(13,18,51,0.6) !important;
          border-color: rgba(211,75,154,0.08) !important;
        }
        /* Section label line color */
        #register #get-involved .flex.items-center.gap-3 > span:first-child {
          background: linear-gradient(90deg, ${C_BRIGHT}, ${CYAN}) !important;
        }

        /* ─── Cybercore Content Layer ─────────────────────────────── */
        .content-wrapper {
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

        .hero-section {
          text-align: center;
          max-width: 900px;
        }

        .hero-section h1 {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(44px, 8vw, 100px);
          line-height: 0.92;
          letter-spacing: -0.04em;
          color: white;
          margin: 0 0 24px;
          text-shadow: 0 0 80px rgba(211,75,154,0.3), 0 0 40px rgba(211,75,154,0.15);
        }

        .hero-section p {
          font-family: var(--font-outfit);
          font-size: clamp(15px, 1.5vw, 18px);
          font-weight: 400;
          color: rgba(255,255,255,0.75);
          line-height: 1.7;
          text-shadow: 0 2px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3);
          max-width: 560px;
          margin: 0 auto 28px;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 40px;
          border-radius: 50px;
          background: linear-gradient(135deg, ${C}, ${CYAN});
          color: white;
          font-family: var(--font-outfit);
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 0 40px rgba(0,201,255,0.2), 0 4px 20px rgba(211,75,154,0.2);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          border: none;
          cursor: pointer;
        }
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 60px rgba(0,201,255,0.35), 0 8px 32px rgba(211,75,154,0.25);
          background: linear-gradient(135deg, ${C_BRIGHT}, ${CYAN});
        }

        .cta-button-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 36px;
          border-radius: 50px;
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.7);
          font-family: var(--font-outfit);
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
        }
        .cta-button-ghost:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.25);
          color: white;
        }

        /* ─── Cybercore Grid Background ─────────────────────────── */
        .scene {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #070b1f;
        }

        /* Perspective grid floor, visible at bottom */
        .floor {
          position: absolute;
          bottom: 0;
          left: -30%;
          width: 160%;
          height: 50%;
          background:
            linear-gradient(90deg, rgba(0,201,255,0.12) 1px, transparent 1px),
            linear-gradient(0deg, rgba(0,201,255,0.12) 1px, transparent 1px);
          background-size: 80px 40px;
          transform: perspective(500px) rotateX(60deg);
          transform-origin: bottom center;
          animation: moveGrid 12s linear infinite;
        }

        /* Big central glow, the "light source" flooding upward */
        .floor::after {
          content: "";
          position: absolute;
          bottom: -20%;
          left: 25%;
          width: 50%;
          height: 60%;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,201,255,0.35), rgba(211,75,154,0.15) 40%, transparent 70%);
          filter: blur(60px);
          animation: floorGlow 6s ease-in-out infinite;
        }

        /* Central vertical beam */
        .main-column {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 100%;
          background: linear-gradient(to top, rgba(0,201,255,0.7), rgba(211,75,154,0.3) 50%, transparent 85%);
          animation: mainGlow 4s ease-in-out infinite alternate;
        }

        /* Radial glow at base of column */
        .main-column::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,201,255,0.3), rgba(211,75,154,0.1) 40%, transparent 65%);
          filter: blur(40px);
        }

        /* Light beams container, full height */
        .light-stream-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .light-beam {
          position: absolute;
          bottom: 0;
          height: 100%;
          border-radius: 2px;
          animation: rise 6s linear infinite, fade 6s ease-in-out infinite;
        }

        .light-beam.primary {
          background: linear-gradient(to top, rgba(211,75,154,0.8), rgba(0,201,255,0.3) 50%, transparent 85%);
          box-shadow: 0 0 10px rgba(211,75,154,0.4);
        }

        .light-beam.secondary {
          background: linear-gradient(to top, rgba(0,201,255,0.7), rgba(211,75,154,0.3) 40%, transparent 75%);
          box-shadow: 0 0 14px rgba(0,201,255,0.5);
        }

        @keyframes rise {
          0% { transform: translateY(100%); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-5%); opacity: 0; }
        }
        @keyframes fade {
          0%, 100% { opacity: 0; }
          5%, 85% { opacity: 0.8; }
        }
        @keyframes floorGlow {
          0%, 100% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes mainGlow {
          from { opacity: 0.5; filter: blur(30px); }
          to { opacity: 0.7; filter: blur(20px); }
        }
        @keyframes moveGrid {
          from { background-position: 0 0; }
          to { background-position: -100px -50px; }
        }

        @keyframes otvm-hero-shimmer {
          0%, 100% { background-position: 200% center; }
          50% { background-position: 0% center; }
        }
        .otvm-hero-shimmer { animation: otvm-hero-shimmer 6s ease-in-out infinite; }

        .otvm-cta-primary:hover {
          background: ${C_BRIGHT} !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 40px ${C}50 !important;
        }
        .otvm-cta-ghost:hover {
          background: rgba(255,255,255,0.1) !important;
          border-color: rgba(255,255,255,0.35) !important;
          transform: translateY(-2px) !important;
        }

        .otvm-stat-card:hover {
          transform: translateY(-6px) !important;
          background: linear-gradient(145deg, ${C}20 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.03) 50%, rgba(0,0,0,0.1) 80%, ${C_BRIGHT}12 100%) !important;
          box-shadow: 0 2px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.4) inset, 0 20px 60px rgba(0,0,0,0.6), 0 0 50px ${C}12, 0 0 0 1px ${C}25 !important;
        }

        @keyframes otvm-glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0,201,255,0.25); }
          50% { box-shadow: 0 0 40px rgba(0,201,255,0.45); }
        }
        .otvm-glow-line { animation: otvm-glow-pulse 3s ease-in-out infinite; }

        .otvm-theme-card:hover {
          transform: translateY(-6px) scale(1.01) !important;
          box-shadow: 0 2px 0 rgba(255,255,255,0.07) inset, 0 -1px 0 rgba(0,0,0,0.4) inset, 0 20px 60px rgba(0,0,0,0.5), 0 0 50px rgba(0,201,255,0.06) !important;
        }

        @keyframes otvm-liquid-refract {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .otvm-refract { animation: otvm-liquid-refract 8s ease-in-out infinite; }

        .otvm-panel-collapsed:hover {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.1) !important;
        }

        .otvm-panel-card:hover {
          transform: translateY(-4px);
          border-color: ${C}20 !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 0 30px ${C}08;
        }

        .otvm-glass-pill:hover {
          transform: translateY(-3px) scale(1.03);
          background: rgba(0,201,255,0.1) !important;
          border-color: rgba(0,201,255,0.25) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 2px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.3), 0 0 20px rgba(0,201,255,0.08) !important;
          color: white !important;
        }

        .otvm-sponsor-card:hover {
          transform: translateY(-4px);
          border-color: ${C}25 !important;
        }

        .otvm-details-card:hover {
          border-color: ${C}20 !important;
        }

        .otvm-glass-panel:hover {
          border-color: rgba(255,255,255,0.15) !important;
          box-shadow: 0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 40px rgba(211,75,154,0.06) !important;
          transform: translateY(-4px);
        }

        @keyframes otvm-liquid-morph-1 {
          0%, 100% { border-radius: 40% 60% 55% 45% / 55% 40% 60% 45%; transform: translate(0, 0) rotate(0deg); }
          25% { border-radius: 55% 45% 40% 60% / 45% 55% 50% 50%; transform: translate(20px, -15px) rotate(3deg); }
          50% { border-radius: 45% 55% 60% 40% / 60% 45% 55% 45%; transform: translate(-10px, 10px) rotate(-2deg); }
          75% { border-radius: 50% 50% 45% 55% / 50% 60% 40% 60%; transform: translate(15px, 5px) rotate(1deg); }
        }
        @keyframes otvm-liquid-morph-2 {
          0%, 100% { border-radius: 55% 45% 40% 60% / 45% 55% 45% 55%; transform: translate(0, 0) rotate(0deg); }
          33% { border-radius: 40% 60% 50% 50% / 60% 40% 55% 45%; transform: translate(-15px, 10px) rotate(-3deg); }
          66% { border-radius: 50% 50% 55% 45% / 45% 55% 40% 60%; transform: translate(10px, -20px) rotate(2deg); }
        }
        @keyframes otvm-liquid-morph-3 {
          0%, 100% { border-radius: 45% 55% 60% 40% / 60% 45% 55% 45%; transform: translate(0, 0); }
          50% { border-radius: 55% 45% 45% 55% / 50% 55% 45% 50%; transform: translate(-20px, 15px); }
        }
        .otvm-liquid-1 { animation: otvm-liquid-morph-1 15s ease-in-out infinite; }
        .otvm-liquid-2 { animation: otvm-liquid-morph-2 18s ease-in-out infinite; }
        .otvm-liquid-3 { animation: otvm-liquid-morph-3 12s ease-in-out infinite; }

        .otvm-info-card:hover {
          border-color: rgba(255,255,255,0.12) !important;
          background: rgba(255,255,255,0.06) !important;
        }

        .otvm-contact-card:hover {
          border-color: ${C}20 !important;
          transform: translateY(-4px);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .otvm-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .otvm-themes-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .otvm-themes-grid > * { grid-column: span 1 !important; }
          .otvm-about-grid { grid-template-columns: 1fr !important; }
          .otvm-panels-accordion { flex-direction: column !important; height: auto !important; }
          .otvm-panels-accordion > * { flex: none !important; min-height: 200px; }
          .otvm-sponsor-grid { grid-template-columns: 1fr !important; }
          .otvm-contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .hero-section h1 { font-size: clamp(28px, 9vw, 42px) !important; }
          .content-wrapper { padding: 80px 20px 120px !important; justify-content: flex-start !important; padding-top: 90px !important; }
          .otvm-efg-badge { bottom: 70px !important; right: 16px !important; }
          /* Reduce beam count impact, keep animation but lighter */
          .light-beam { opacity: 0.5 !important; }
          .light-beam.secondary { display: none !important; }
          .floor { will-change: background-position; -webkit-backface-visibility: hidden; backface-visibility: hidden; }
          .scene, .scene * { -webkit-transform: translateZ(0); transform: translateZ(0); }
          .otvm-stats-grid { grid-template-columns: 1fr !important; }
          .otvm-bento-grid { grid-template-columns: 1fr !important; }
          .otvm-bento-grid > * { grid-column: span 1 !important; }
          .otvm-themes-grid { grid-template-columns: 1fr !important; }
          .otvm-orb { display: none !important; }
        }
      `}</style>

      <EventNavigation />
      <HeroSection />
      <ThreatStats />
      <AboutForum />
      <KeyThemesSection />
      <PanelDiscussions />
      <WhoWillBeInRoom />
      <WhySponsor />
      <RegistrationSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
