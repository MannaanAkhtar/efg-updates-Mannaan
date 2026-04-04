"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { InquiryForm } from "@/components/sections";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── SonicWall Design Tokens ─────────────────────────────────────────────────
const SW_DARK = "#1e2828";
const SW_ORANGE = "#ff6e41";
const SW_MELON = "#f79669";
const SW_LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Sonicwall_Logo_RGB_Orange_Sonic+Dark.png";
const SW_AZURE = "#0087ff";
const SW_CREAM = "#f8f9f9";
const SW_LIGHT_BLUE = "#eff9fc";
const SW_WHITE = "#ffffff";
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Data ────────────────────────────────────────────────────────────────────
const TAKEAWAYS = [
  "Clarity on the most common, high-impact security gaps and how modern attackers exploit them, and what effective organizations are doing differently to close them.",
  "Actionable strategies to simplify and strengthen security operations, including how unified management and connected controls reduce complexity and blind spots.",
  "Guidance on building protection-focused security programs, leveraging practical best practices and real-world lessons shared by industry peers.",
  "An understanding of how SonicWall's platform, firewalls, endpoint protection, cloud security, and unified management, work together to improve visibility, speed up detection, and reduce operational burden.",
];

const PAIN_POINTS = [
  { title: "Predictable Gaps", desc: "Attackers aren't getting smarter, organizations are repeatedly leaving the same basic gaps exposed, allowing threat actors to exploit predictable weaknesses across every industry and region." },
  { title: "Speed Mismatch", desc: "AI-powered attackers are finding vulnerabilities faster than security teams can identify, prioritize, and close them, widening the gap between detection and response." },
  { title: "Tool Overload", desc: "Disconnected tools and siloed security operations create unnecessary complexity, turning routine management tasks into time-consuming, high-effort operational burdens." },
];

const SPEAKERS = [
  { name: "Nabil Kouzi", title: "Territory Manager", initials: "NK", bio: "Nabil drives SonicWall's growth across the UAE, leading territory strategy and empowering organizations with advanced cybersecurity solutions." },
  { name: "Ateef Mulla", title: "Principal Solutions Engineer", initials: "AM", bio: "Ateef is a Principal Solutions Engineer who champions the company's end-to-end security solutions, driving the successful delivery of major enterprise projects across the region." },
  { name: "Mohamed Abdallah", title: "Regional Director, META", initials: "MA", bio: "Mohamed Abdallah stands as the Regional Director at SonicWall, overseeing the expansive regions of the Middle East, Turkey, and Africa.", confirmed: false },
];

const AGENDA = [
  { time: "11:00 AM", duration: "5 min", title: "Welcome & Ground Rules", presenter: "Event Host / Moderator" },
  { time: "11:05 AM", duration: "30 min", title: "SonicWall 2026 Cyber Protect Report Overview", presenter: "Nabil Kouzi / Ateef Mulla", highlight: true },
  { time: "11:35 AM", duration: "30 min", title: "SonicWall Platform Overview & Unified Management Demo", presenter: "Ateef Mulla", highlight: true },
  { time: "12:05 PM", duration: "15 min", title: "Panel Discussion", presenter: "Moderator + All Panelists" },
  { time: "12:20 PM", duration: "10 min", title: "Audience Q&A", presenter: "Moderator + Audience" },
  { time: "12:30 PM", duration: "5 min", title: "Audience Poll, Closing Remarks & Next Steps", presenter: "Moderator" },
];

// ─── COUNTDOWN ───────────────────────────────────────────────────────────────
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

// ─── HERO ────────────────────────────────────────────────────────────────────
function HeroSection() {
  const cd = useCountdown("2026-05-13T11:00:00+04:00");
  const heroRef = useRef<HTMLElement>(null);

  // GSAP: Title mask reveal, each line clips up
  useGSAP(() => {
    if (!heroRef.current) return;
    const lines = heroRef.current.querySelectorAll(".sw-title-line");
    gsap.fromTo(lines,
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.9, stagger: 0.15, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  // GSAP: Kicker slide-in with spring
  useGSAP(() => {
    if (!heroRef.current) return;
    const kicker = heroRef.current.querySelector(".sw-kicker");
    if (kicker) gsap.fromTo(kicker, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.4)", delay: 0.1 });
  }, []);

  // GSAP: Staggered entrance for meta, CTAs
  useGSAP(() => {
    if (!heroRef.current) return;
    const items = heroRef.current.querySelectorAll(".sw-hero-stagger");
    gsap.fromTo(items,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out", delay: 0.9 }
    );
  }, []);

  // GSAP: Countdown tiles drop in with spring
  useGSAP(() => {
    if (!heroRef.current) return;
    const tiles = heroRef.current.querySelectorAll(".sw-cd-tile");
    gsap.fromTo(tiles,
      { y: -30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.6)", delay: 1.3 }
    );
  }, []);

  // GSAP: Parallax, text moves faster than bg on scroll
  useGSAP(() => {
    if (!heroRef.current) return;
    const content = heroRef.current.querySelector(".sw-hero-content");
    if (content) {
      gsap.to(content, {
        y: -40,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 },
      });
    }
  }, []);

  return (
    <section ref={heroRef} style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      {/* Hero background image, Ken Burns infinite zoom */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Hero_homepage.webp"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }}
      />

      {/* Left white scrim */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.4) 60%, transparent 80%)" }} />

      {/* Content, left-aligned, GSAP animated */}
      <div className="sw-hero-content" style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(24px, 5vw, 80px) 100px", width: "100%" }}>
          <div style={{ maxWidth: 580 }}>
            {/* Kicker, GSAP slide-in */}
            <div className="sw-kicker" style={{
              display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, opacity: 0,
              padding: "10px 22px 10px 16px", borderRadius: 40,
              background: "rgba(255,110,65,0.08)",
              border: "1px solid rgba(255,110,65,0.2)",
              boxShadow: "0 2px 8px rgba(255,110,65,0.06)",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: SW_ORANGE, flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: SW_ORANGE }}>Virtual Roundtable</span>
            </div>

            {/* Title, mask reveal per line */}
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 6vw, 68px)", lineHeight: 1.05, letterSpacing: "-2.5px", color: SW_DARK, margin: "0 0 24px" }}>
              <span style={{ display: "block", overflow: "hidden" }}><span className="sw-title-line" style={{ display: "block", fontWeight: 700, opacity: 0 }}>Beyond the</span></span>
              <span style={{ display: "block", overflow: "hidden" }}><span className="sw-title-line" style={{ display: "block", fontWeight: 700, opacity: 0 }}>Firewall:</span></span>
              <span style={{ display: "block", overflow: "hidden" }}><span className="sw-title-line" style={{ display: "block", color: SW_ORANGE, fontWeight: 800, opacity: 0 }}>Strategic Security</span></span>
            </h1>

            {/* Tagline, stagger */}
            <p className="sw-hero-stagger" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(17px, 1.7vw, 21px)", fontWeight: 500, color: "rgba(30,40,40,0.65)", margin: "0 0 24px", lineHeight: 1.6, opacity: 0 }}>
              Cut through the noise. Focus on what actually works.
            </p>

            {/* Meta strip, stagger */}
            <div className="sw-hero-stagger" style={{
              display: "inline-flex", gap: 0, marginBottom: 28, borderRadius: 16, overflow: "hidden", position: "relative", opacity: 0,
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(14px) saturate(1.2)",
              WebkitBackdropFilter: "blur(14px) saturate(1.2)",
              border: "1px solid rgba(255,255,255,0.45)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.35) inset, 0 -1px 0 rgba(0,0,0,0.04) inset, 0 4px 16px rgba(0,0,0,0.04)",
            }}>
              <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
              {[
                { label: "Date", value: "13 May 2026" },
                { label: "Time", value: "11:00 AM GST" },
                { label: "Duration", value: "90 min" },
              ].map((item, i) => (
                <div key={item.label} style={{ padding: "12px 20px", borderLeft: i === 0 ? "none" : "1px solid rgba(30,40,40,0.06)" }}>
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(30,40,40,0.35)", display: "block", marginBottom: 3 }}>{item.label}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: SW_DARK }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* CTAs, stagger */}
            <div className="sw-hero-stagger" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 36, opacity: 0 }}>
              <a href="#register" className="sw-hero-cta" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "15px 40px", borderRadius: 40, textDecoration: "none",
                fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600, color: "white",
                backgroundImage: `linear-gradient(180deg, ${SW_MELON}, ${SW_ORANGE} 40%, #e85a30)`,
                border: "1px solid rgba(255,150,105,0.3)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.25) inset, 0 -1px 0 rgba(0,0,0,0.15) inset, 0 4px 20px rgba(255,110,65,0.25)",
                position: "relative", overflow: "hidden",
              }}>
                <span style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }} />
                Register Now &rarr;
              </a>
              <a href="#agenda" className="sw-hero-ghost" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "15px 32px", borderRadius: 40, textDecoration: "none",
                fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: SW_DARK,
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.45)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.3) inset, 0 -1px 0 rgba(0,0,0,0.04) inset, 0 4px 12px rgba(0,0,0,0.04)",
                position: "relative", overflow: "hidden",
              }}>
                <span style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />
                View Agenda
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Countdown, centered, tiles drop in */}
      <div className="sw-countdown-wrap" style={{ position: "absolute", bottom: 28, left: 0, right: 0, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="sw-hero-stagger" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, opacity: 0 }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(30,40,40,0.4)" }}>Starts In</span>
          <div className="sw-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: SW_ORANGE, boxShadow: `0 0 6px ${SW_ORANGE}` }} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hrs" }, { v: cd.m, l: "Min" }, { v: cd.s, l: "Sec" }].map((item) => (
            <div key={item.l} className="sw-cd-tile" style={{
              textAlign: "center", padding: "14px 18px", borderRadius: 16, minWidth: 68,
              position: "relative", overflow: "hidden", opacity: 0,
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(20px) saturate(1.4)",
              WebkitBackdropFilter: "blur(20px) saturate(1.4)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "0 2px 0 rgba(255,255,255,0.5) inset, 0 -2px 0 rgba(0,0,0,0.06) inset, 0 6px 20px rgba(0,0,0,0.07), 0 0 0 1px rgba(255,255,255,0.2)",
            }}>
              <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)" }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: SW_DARK, display: "block", letterSpacing: "-1px", lineHeight: 1.2 }}>{String(item.v).padStart(2, "0")}</span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 600, color: "rgba(30,40,40,0.45)", textTransform: "uppercase", letterSpacing: "1px" }}>{item.l}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes swPulse { 0%,100%{opacity:1;box-shadow:0 0 4px ${SW_ORANGE}} 50%{opacity:0.5;box-shadow:0 0 10px ${SW_ORANGE}, 0 0 20px ${SW_ORANGE}} }
        .sw-pulse-dot { animation: swPulse 2s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

// ─── OVERVIEW ────────────────────────────────────────────────────────────────
const OVERVIEW_WORDS = "Clarity amid today's fast-evolving threat landscape.".split(" ");

function OverviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const ruleLeftRef = useRef<HTMLDivElement>(null);
  const ruleRightRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  // 1. Word-by-word blur reveal on heading
  useGSAP(() => {
    if (!inView || !headingRef.current) return;
    const words = headingRef.current.querySelectorAll(".sw-reveal-word");
    gsap.fromTo(words,
      { opacity: 0.08, filter: "blur(8px)", y: 6 },
      { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", delay: 0.3 }
    );
  }, [inView]);

  // 2. Horizontal rule, splits from center outward
  useGSAP(() => {
    if (!inView) return;
    if (ruleLeftRef.current) gsap.fromTo(ruleLeftRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out", delay: 0.8 });
    if (ruleRightRef.current) gsap.fromTo(ruleRightRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out", delay: 0.8 });
  }, [inView]);

  // 3. Body text line-by-line fade
  useGSAP(() => {
    if (!inView || !bodyRef.current) return;
    const lines = bodyRef.current.querySelectorAll(".sw-body-line");
    gsap.fromTo(lines,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out", delay: 1.2 }
    );
  }, [inView]);

  // 4. Background parallax
  useGSAP(() => {
    if (!bgRef.current || !sectionRef.current) return;
    gsap.to(bgRef.current, {
      y: 60,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  return (
    <section ref={sectionRef} id="overview" style={{ background: SW_CREAM, padding: "clamp(40px, 5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      {/* Background image, parallax */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={bgRef}
        src="https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/hero-networksecuritymanager.webp"
        alt=""
        style={{ position: "absolute", top: -30, left: 0, right: 0, height: "120%", width: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0, opacity: 0.08 }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(248,249,249,0.85)", zIndex: 1, pointerEvents: "none" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>

        {/* Kicker */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: SW_ORANGE }}>About This Webinar</span>
        </motion.div>

        {/* Oversized serif, word-by-word blur reveal */}
        <div ref={headingRef} style={{ textAlign: "center", marginBottom: 32, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 12px" }}>
          {OVERVIEW_WORDS.map((word, i) => (
            <span key={i} className="sw-reveal-word" style={{
              fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400,
              fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-0.5px",
              color: SW_DARK, lineHeight: 1.3, display: "inline-block",
              opacity: 0,
            }}>{word}</span>
          ))}
        </div>

        {/* Horizontal rule, splits from center */}
        <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 36 }}>
          <div ref={ruleLeftRef} style={{ width: 40, height: 1, background: "rgba(30,40,40,0.15)", transformOrigin: "right center" }} />
          <div ref={ruleRightRef} style={{ width: 40, height: 1, background: "rgba(30,40,40,0.15)", transformOrigin: "left center" }} />
        </div>

        {/* Body text, line-by-line stagger */}
        <div ref={bodyRef} style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <p className="sw-body-line" style={{ fontFamily: "var(--font-outfit)", fontSize: 17, fontWeight: 400, color: "#555", lineHeight: 1.9, margin: "0 0 12px", opacity: 0 }}>
            This virtual roundtable highlights the persistent operational gaps
          </p>
          <p className="sw-body-line" style={{ fontFamily: "var(--font-outfit)", fontSize: 17, fontWeight: 400, color: "#555", lineHeight: 1.9, margin: "0 0 12px", opacity: 0 }}>
            attackers continue to exploit and offers practical, evidence-based
          </p>
          <p className="sw-body-line" style={{ fontFamily: "var(--font-outfit)", fontSize: 17, fontWeight: 400, color: "#555", lineHeight: 1.9, margin: "0 0 12px", opacity: 0 }}>
            strategies to strengthen protection where it matters most.
          </p>
          <p className="sw-body-line" style={{ fontFamily: "var(--font-outfit)", fontSize: 17, fontWeight: 400, color: "#555", lineHeight: 1.9, margin: "0 0 24px", opacity: 0 }}>
            Attendees will gain expert insights into simplifying security operations, eliminating blind spots, and improving overall resilience.
          </p>
          <p className="sw-body-line" style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 500, color: SW_ORANGE, lineHeight: 1.6, margin: 0, opacity: 0 }}>
            Includes a live walkthrough of the SonicWall Platform and Unified Management demo.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── KEY TAKEAWAYS ───────────────────────────────────────────────────────────
function TakeawaysSection() {
  const ref = useRef<HTMLElement>(null);
  const takeawaysRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // GSAP: rows stagger in
  useGSAP(() => {
    if (!inView || !takeawaysRef.current) return;
    const rows = takeawaysRef.current.querySelectorAll(".sw-takeaway-row");
    gsap.fromTo(rows,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out", delay: 0.3 }
    );
  }, [inView]);

  return (
    <section ref={ref} style={{ background: SW_WHITE, padding: "clamp(36px, 4vw, 56px) 0" }}>
      <div ref={takeawaysRef} style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 2, background: SW_ORANGE, borderRadius: 1 }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE }}>What You Will Learn</span>
          </div>
          <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.5px", color: SW_DARK, lineHeight: 1.2, margin: 0 }}>Key Takeaways</h2>
        </motion.div>

        {/* Vertical numbered list */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {TAKEAWAYS.map((item, i) => (
            <div key={i} className="sw-takeaway-row" style={{ display: "flex", gap: "clamp(20px, 3vw, 40px)", alignItems: "flex-start", padding: "24px 0", borderTop: "1px solid rgba(30,40,40,0.08)", opacity: 0 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(36px, 4vw, 48px)", color: SW_ORANGE, lineHeight: 1, flexShrink: 0, minWidth: 56, letterSpacing: "-1px" }}>{String(i + 1).padStart(2, "0")}</span>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 17, fontWeight: 400, color: "#444", lineHeight: 1.8, margin: 0, paddingTop: 6 }}>{item}</p>
            </div>
          ))}
          {/* Bottom rule */}
          <div style={{ borderTop: "1px solid rgba(30,40,40,0.08)" }} />
        </div>
      </div>
    </section>
  );
}

// ─── PAIN POINTS ─────────────────────────────────────────────────────────────
function PainPointsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: SW_WHITE, padding: "clamp(36px, 4vw, 56px) 0" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE }}>The Challenge</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1px", color: SW_DARK, lineHeight: 1.2, margin: "16px 0 0" }}>Why This Matters Now</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="sw-pain-grid">
          {PAIN_POINTS.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: EASE }}
              style={{ padding: "32px 24px", borderRadius: 16, background: SW_DARK, position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${SW_ORANGE}, ${SW_MELON})` }} />
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: SW_ORANGE, margin: "0 0 12px" }}>{item.title}</h4>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .sw-pain-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ─── SPEAKERS ────────────────────────────────────────────────────────────────
function SpeakersSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="speakers" style={{ background: SW_LIGHT_BLUE, padding: "clamp(36px, 4vw, 56px) 0" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE }}>Your Hosts</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1px", color: SW_DARK, lineHeight: 1.2, margin: "16px 0 0" }}>Speakers</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="sw-speakers-grid">
          {SPEAKERS.map((speaker, i) => (
            <motion.div key={speaker.name} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: EASE }}
              style={{ padding: "32px 24px", borderRadius: 16, background: SW_WHITE, textAlign: "center", border: "1px solid rgba(30,40,40,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              {/* Avatar */}
              <div style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${SW_ORANGE}, ${SW_MELON})`, color: "white", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>
                {speaker.initials}
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: SW_DARK, margin: "0 0 4px" }}>{speaker.name}</h4>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 600, color: SW_ORANGE, margin: "0 0 12px" }}>{speaker.title}</p>
              {speaker.confirmed === false && (
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Yet to be confirmed</span>
              )}
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 400, color: "#666", lineHeight: 1.6, margin: 0 }}>{speaker.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .sw-speakers-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ─── AGENDA ──────────────────────────────────────────────────────────────────
function AgendaSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="agenda" style={{ background: SW_WHITE, padding: "clamp(36px, 4vw, 56px) 0" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE }}>Programme</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1px", color: SW_DARK, lineHeight: 1.2, margin: "16px 0 0" }}>Agenda</h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {AGENDA.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: EASE }}
              style={{ display: "flex", gap: 20, padding: "20px 0", borderBottom: i < AGENDA.length - 1 ? "1px solid rgba(30,40,40,0.06)" : "none", alignItems: "flex-start" }}
            >
              <div style={{ flexShrink: 0, width: 80 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: item.highlight ? SW_ORANGE : SW_DARK }}>{item.time}</span>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: "#999", display: "block" }}>{item.duration}</span>
              </div>
              <div>
                <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: SW_DARK, margin: "0 0 4px" }}>{item.title}</h4>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 400, color: "#777", margin: 0 }}>{item.presenter}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── COMPANY PROFILE ─────────────────────────────────────────────────────────
function CompanySection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: SW_CREAM, padding: "clamp(36px, 4vw, 56px) 0" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE }}>About</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1px", color: SW_DARK, lineHeight: 1.2, margin: "16px 0 24px" }}>SonicWall</h2>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "#555", lineHeight: 1.8, margin: "0 0 16px" }}>
            For more than 30 years, SonicWall has championed a partner-first model that combines purpose-built technology, cloud-delivered security services and real-time threat intelligence to help businesses prevent breaches, reduce risk and stay operational in the face of evolving modern threats.
          </p>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "#555", lineHeight: 1.8, margin: "0 0 24px" }}>
            Through its unified cybersecurity portfolio and global community of over 17,000 partners, SonicWall enables managed service providers to actively manage, continuously optimize and measurably protect networks, cloud environments, endpoints and applications.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://www.sonicwall.com/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, color: SW_ORANGE, textDecoration: "none" }}>sonicwall.com &rarr;</a>
            <a href="mailto:MEA@sonicwall.com" style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 600, color: SW_DARK, textDecoration: "none" }}>MEA@sonicwall.com</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── REGISTRATION ────────────────────────────────────────────────────────────
function RegistrationSection() {
  return (
    <section id="register" style={{ background: SW_DARK, padding: "clamp(36px, 4vw, 56px) 0" }}>
      <InquiryForm defaultCountry="AE" eventName="SonicWall Beyond the Firewall 2026" />
    </section>
  );
}

// ─── SONICWALL NAV ───────────────────────────────────────────────────────────
function SonicWallNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#overview", label: "Overview" },
    { href: "#speakers", label: "Speakers" },
    { href: "#agenda", label: "Agenda" },
    { href: "#register", label: "Register" },
  ];

  return (
    <>
      <nav className="sw-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "10px clamp(28px, 5vw, 80px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}>
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SW_LOGO} alt="SonicWall" width={220} height={56} style={{ height: 56, width: "auto" }} />

        {/* Desktop links */}
        <div className="sw-nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {navLinks.slice(0, 3).map((link) => (
            <a key={link.label} href={link.href} className="sw-nav-link" style={{
              fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500,
              color: SW_DARK, textDecoration: "none", transition: "all 0.3s ease",
              position: "relative", padding: "4px 0",
            }}>{link.label}</a>
          ))}
          <a href="#register" className="sw-nav-cta" style={{
            fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 600,
            color: "white", background: SW_ORANGE, padding: "11px 28px", borderRadius: 40,
            textDecoration: "none", transition: "all 0.3s ease",
            boxShadow: `0 2px 12px rgba(255,110,65,0.2)`,
          }}>Register Now</a>
        </div>

        {/* Mobile hamburger */}
        <button className="sw-nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer", padding: 8,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={SW_DARK} strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>}
          </svg>
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 70, left: 0, right: 0, zIndex: 999,
          background: "rgba(255,255,255,0.98)",
          padding: "16px clamp(28px, 5vw, 80px) 24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          display: "flex", flexDirection: "column", gap: 0,
        }}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} style={{
              fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500,
              color: SW_DARK, textDecoration: "none", padding: "14px 0",
              borderBottom: "1px solid rgba(30,40,40,0.06)",
            }}>{link.label}</a>
          ))}
        </div>
      )}

      <style>{`
        .sw-nav-link:hover { color: ${SW_ORANGE} !important; }
        .sw-nav-link::after {
          content: "";
          position: absolute; bottom: -2px; left: 0; right: 0;
          height: 2px; background: ${SW_ORANGE}; border-radius: 1px;
          transform: scaleX(0); transition: transform 0.3s ease;
        }
        .sw-nav-link:hover::after { transform: scaleX(1); }
        .sw-nav-cta:hover { box-shadow: 0 4px 20px rgba(255,110,65,0.35) !important; transform: translateY(-1px); }
        @media (max-width: 768px) {
          .sw-nav-links { display: none !important; }
          .sw-nav-mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
}

// ─── SONICWALL FOOTER ────────────────────────────────────────────────────────
function SonicWallFooter() {
  return (
    <footer style={{ background: SW_DARK, padding: "40px 0 24px", borderTop: `3px solid ${SW_ORANGE}` }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SW_LOGO} alt="SonicWall" width={140} height={32} style={{ height: 28, width: "auto" }} />
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <a href="https://www.sonicwall.com/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>sonicwall.com</a>
          <a href="mailto:MEA@sonicwall.com" style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>MEA@sonicwall.com</a>
        </div>
      </div>
      <div style={{ maxWidth: 1000, margin: "20px auto 0", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>
          &copy; {new Date().getFullYear()} SonicWall Inc. All rights reserved. Produced by Events First Group.
        </p>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function SonicWallPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div>
      <style jsx global>{`
        #register { --orange: ${SW_ORANGE}; --orange-bright: ${SW_MELON}; --orange-glow: rgba(255,110,65,0.35); }
        #register #get-involved { background: ${SW_DARK} !important; }
        #register #get-involved button[type="submit"] { background: ${SW_ORANGE} !important; border: none !important; }
        #register #get-involved button[type="submit"]:hover { background: ${SW_MELON} !important; }

        /* ─── Mobile responsive ─── */
        @media (max-width: 768px) {
          /* Hero, content starts higher, full white overlay on mobile */
          .sw-hero-content { min-height: auto !important; }
          .sw-hero-content > div { padding: 80px 20px 10px !important; }
          .sw-hero-content > div > div { max-width: 100% !important; }
          .sw-hero-content h1 { font-size: clamp(28px, 8.5vw, 38px) !important; letter-spacing: -1.5px !important; margin-bottom: 12px !important; }
          .sw-hero-content p { font-size: 14px !important; margin-bottom: 12px !important; }
          .sw-hero-content .sw-kicker { margin-bottom: 14px !important; }
          .sw-hero-content .sw-hero-stagger { margin-bottom: 16px !important; }

          /* Meta strip compact */
          .sw-hero-content .sw-hero-stagger > div { padding: 10px 14px !important; }

          /* Countdown, make it part of flow on mobile */
          .sw-countdown-wrap { position: relative !important; bottom: auto !important; margin-top: 12px; padding-bottom: 12px; }
          .sw-cd-tile { padding: 8px 10px !important; min-width: 48px !important; border-radius: 10px !important; }
          .sw-cd-tile span:first-child { font-size: 18px !important; }

          /* All sections tighter */
          section { padding-top: 28px !important; padding-bottom: 28px !important; }

          /* Grids */
          .sw-takeaways-grid,
          .sw-pain-grid,
          .sw-speakers-grid,
          .sw-overview-grid { grid-template-columns: 1fr !important; }

          /* CTA buttons full width */
          .sw-hero-cta, .sw-hero-ghost { width: 100% !important; justify-content: center !important; }

          /* Footer */
          footer > div:first-child { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }

        @media (max-width: 480px) {
          .sw-hero-content > div { padding: 72px 16px 8px !important; }
          .sw-hero-content h1 { font-size: clamp(26px, 8.5vw, 34px) !important; }
          .sw-hero-content .sw-kicker { padding: 8px 16px 8px 12px !important; }
          .sw-hero-content .sw-kicker span { font-size: 10px !important; }
        }
      `}</style>

      <SonicWallNav />
      <HeroSection />
      <OverviewSection />
      <TakeawaysSection />
      <PainPointsSection />
      <SpeakersSection />
      <AgendaSection />
      <CompanySection />
      <RegistrationSection />
      <SonicWallFooter />
    </div>
  );
}
