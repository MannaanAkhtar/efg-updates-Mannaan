"use client";

import React, { useRef, useState, useEffect, memo } from "react";
import { useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── SonicWall Design Tokens ─────────────────────────────────────────────────
const SW_DARK = "#1e2828";
const SW_ORANGE = "#ff6e41";
const SW_MELON = "#f79669";
const SW_LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Sonicwall_Logo_RGB_Orange_Sonic+Dark.png";
const SW_CREAM = "#f8f9f9";
const SW_WHITE = "#ffffff";

// ─── Data ────────────────────────────────────────────────────────────────────
const TAKEAWAYS = [
  { heading: "Close the Gaps.", desc: "Clarity on the most common, high-impact security gaps and how modern attackers exploit them — and what effective organizations are doing differently to close them." },
  { heading: "Simplify Operations.", desc: "Actionable strategies to simplify and strengthen security operations, including how unified management and connected controls reduce complexity and blind spots." },
  { heading: "Build Resilience.", desc: "Guidance on building protection-focused security programs, leveraging practical best practices and real-world lessons shared by industry peers." },
  { heading: "See the Platform.", desc: "An understanding of how SonicWall's platform — firewalls, endpoint protection, cloud security, and unified management — work together to improve visibility, speed up detection, and reduce operational burden." },
];

const PAIN_POINTS = [
  { title: "Predictable Gaps", desc: "Attackers aren't getting smarter. Organizations are repeatedly leaving the same basic gaps exposed, allowing threat actors to exploit predictable weaknesses across every industry and region." },
  { title: "Speed Mismatch", desc: "AI-powered attackers are finding vulnerabilities faster than security teams can identify, prioritize, and close them, widening the gap between detection and response." },
  { title: "Tool Overload", desc: "Disconnected tools and siloed security operations create unnecessary complexity, turning routine management tasks into time-consuming, high-effort operational burdens." },
];

const SPEAKERS = [
  { name: "Sumit Tekriwal", title: "Head of Information Governance, Compliance & Privacy Unit, KIB", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Sumit.png", bio: "Sumit leads the Information Governance, Compliance & Privacy Unit at Kuwait International Bank (KIB), driving regulatory alignment, data protection, and risk management across the institution." },
  { name: "John Mankarios", title: "VP - Deputy Head of IT, QInvest", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/JohnMankarios.png", bio: "John serves as VP and Deputy Head of IT at QInvest, overseeing technology strategy and infrastructure across the organisation." },
  { name: "Toufeeq Ahmed", title: "Group Head of Cybersecurity, Gargash Group", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Toufeeq.png", bio: "Toufeeq leads cybersecurity strategy and operations across Gargash Group, safeguarding the organisation's digital infrastructure and driving resilience against evolving threats." },
  { name: "Mohamed Abdallah", title: "Regional Director, META", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Mohamed_Abdallah1.png", bio: "Mohamed Abdallah stands as the Regional Director at SonicWall, overseeing the expansive regions of the Middle East, Turkey, and Africa." },
  { name: "Nabil Kouzi", title: "Territory Manager", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/nabil1.png", bio: "Nabil drives SonicWall's growth across the UAE, leading territory strategy and empowering organizations with advanced cybersecurity solutions." },
  { name: "Ateef Mulla", title: "Principal Solutions Engineer", photo: "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/ateef1.png", bio: "Ateef is a Principal Solutions Engineer who champions the company's end-to-end security solutions, driving the successful delivery of major enterprise projects across the region." },
];

const AGENDA = [
  { time: "11:00 AM", duration: "5 min", title: "Welcome & Ground Rules", presenter: "Event Host / Moderator" },
  { time: "11:05 AM", duration: "30 min", title: "SonicWall 2026 Cyber Protect Report Overview", presenter: "Nabil Kouzi / Ateef Mulla", highlight: true },
  { time: "11:35 AM", duration: "30 min", title: "SonicWall Platform Overview & Unified Management Demo", presenter: "Ateef Mulla", highlight: true },
  { time: "12:05 PM", duration: "15 min", title: "Panel Discussion", presenter: "Moderator + All Panelists" },
  { time: "12:20 PM", duration: "10 min", title: "Audience Q&A", presenter: "Moderator + Audience" },
  { time: "12:30 PM", duration: "5 min", title: "Audience Poll, Closing Remarks & Next Steps", presenter: "Moderator" },
];

// ─── COUNTDOWN (isolated to prevent parent re-renders) ──────────────────────
const CountdownDisplay = memo(function CountdownDisplay({ target }: { target: string }) {
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

  return (
    <div style={{ display: "flex", gap: 10 }}>
      {[{ v: cd.d, l: "Days" }, { v: cd.h, l: "Hrs" }, { v: cd.m, l: "Min" }, { v: cd.s, l: "Sec" }].map((item) => (
        <div key={item.l} className="sw-cd-tile" style={{
          textAlign: "center", padding: "14px 18px", borderRadius: 16, minWidth: 68,
          position: "relative", overflow: "hidden", opacity: 0,
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 2px 0 rgba(255,255,255,0.5) inset, 0 -2px 0 rgba(0,0,0,0.06) inset, 0 6px 20px rgba(0,0,0,0.07)",
        }}>
          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 300, color: SW_DARK, display: "block", letterSpacing: "-1px", lineHeight: 1.2 }}>{String(item.v).padStart(2, "0")}</span>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 400, color: "rgba(30,40,40,0.45)", textTransform: "uppercase", letterSpacing: "1px" }}>{item.l}</span>
        </div>
      ))}
    </div>
  );
});

// ─── HERO ────────────────────────────────────────────────────────────────────
function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  // GSAP: All hero animations in one timeline + parallax
  useGSAP(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const lines = heroRef.current.querySelectorAll(".sw-title-line");
    const kicker = heroRef.current.querySelector(".sw-kicker");
    const staggerItems = heroRef.current.querySelectorAll(".sw-hero-stagger");
    const tiles = heroRef.current.querySelectorAll(".sw-cd-tile");
    const content = heroRef.current.querySelector(".sw-hero-content");

    // Kicker slide-in
    if (kicker) tl.fromTo(kicker, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.4)" }, 0.1);
    // Title mask reveal
    tl.fromTo(lines, { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 0.9, stagger: 0.15 }, 0.3);
    // Meta + CTAs stagger
    tl.fromTo(staggerItems, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out" }, 0.9);
    // Countdown tiles drop
    tl.fromTo(tiles, { y: -30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.6)" }, 1.3);

    // Parallax (separate, scroll-linked)
    if (content) {
      gsap.to(content, { y: -40, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 } });
    }
  }, []);

  return (
    <section ref={heroRef} style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      {/* Hero background image — Ken Burns infinite zoom */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Hero_homepage.webp"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }}
      />

      {/* Left white scrim */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.4) 60%, transparent 80%)" }} />

      {/* Content — left-aligned, GSAP animated */}
      <div className="sw-hero-content" style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px clamp(24px, 5vw, 80px) 100px", width: "100%" }}>
          <div style={{ maxWidth: 580 }}>
            {/* Kicker — GSAP slide-in */}
            <div className="sw-kicker" style={{
              display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, opacity: 0,
              padding: "10px 22px 10px 16px", borderRadius: 40,
              background: "rgba(255,110,65,0.08)",
              border: "1px solid rgba(255,110,65,0.2)",
              boxShadow: "0 2px 8px rgba(255,110,65,0.06)",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: SW_ORANGE, flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE }}>Virtual Roundtable</span>
            </div>

            {/* Title — mask reveal per line */}
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4.2vw, 46px)", lineHeight: 1.1, letterSpacing: "-2px", color: SW_DARK, margin: "0 0 24px" }}>
              <span style={{ display: "block", overflow: "hidden" }}><span className="sw-title-line" style={{ display: "block", fontWeight: 300, opacity: 0 }}>Cyber Resilience in the</span></span>
              <span style={{ display: "block", overflow: "hidden" }}><span className="sw-title-line" style={{ display: "block", fontWeight: 300, opacity: 0 }}>Age of Real-Time Threats:</span></span>
              <span style={{ display: "block", overflow: "hidden" }}><span className="sw-title-line" style={{ display: "block", color: SW_ORANGE, fontWeight: 300, opacity: 0 }}>Closing the Gap Between</span></span>
              <span style={{ display: "block", overflow: "hidden" }}><span className="sw-title-line" style={{ display: "block", color: SW_ORANGE, fontWeight: 300, opacity: 0 }}>Attack Speed and Response</span></span>
            </h1>

            {/* Tagline — stagger */}
            <p className="sw-hero-stagger" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(17px, 1.7vw, 21px)", fontWeight: 400, color: "rgba(30,40,40,0.65)", margin: "0 0 24px", lineHeight: 1.6, opacity: 0 }}>
              Cut through the noise. Focus on what actually works.
            </p>

            {/* Meta strip — stagger */}
            <div className="sw-hero-stagger" style={{
              display: "inline-flex", gap: 0, marginBottom: 28, borderRadius: 16, overflow: "hidden", position: "relative", opacity: 0,
              background: "rgba(255,255,255,0.5)",
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
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9, fontWeight: 400, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(30,40,40,0.35)", display: "block", marginBottom: 3 }}>{item.label}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: SW_DARK }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* CTAs — stagger */}
            <div className="sw-hero-stagger" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 36, opacity: 0 }}>
              <a href="#register" className="sw-hero-cta" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "15px 40px", borderRadius: 40, textDecoration: "none",
                fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, color: "white",
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
                background: "rgba(255,255,255,0.5)",
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

      {/* Brought to you by NetworkFirst — bottom right */}
      <div className="sw-hero-stagger" style={{ position: "absolute", bottom: 32, right: "clamp(24px, 5vw, 80px)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, opacity: 0 }}>
        <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(30,40,40,0.4)" }}>Brought to you by</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Networkfirstlogo-01.jpg" alt="NetworkFirst" width={380} height={104} style={{ height: 100, width: "auto" }} />
      </div>

      {/* Countdown — centered, tiles drop in */}
      <div className="sw-countdown-wrap" style={{ position: "absolute", bottom: 28, left: 0, right: 0, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="sw-hero-stagger" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, opacity: 0 }}>
          <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10, fontWeight: 400, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(30,40,40,0.4)" }}>Starts In</span>
          <div className="sw-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: SW_ORANGE, boxShadow: `0 0 6px ${SW_ORANGE}` }} />
        </div>
        <CountdownDisplay target="2026-05-13T11:00:00+04:00" />
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
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  // All animations in one timeline + separate parallax
  useGSAP(() => {
    if (!inView) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Header — dashes + kicker
    if (headerRef.current) {
      const dashes = headerRef.current.querySelectorAll(".sw-ov-dash");
      const kicker = headerRef.current.querySelector(".sw-ov-kicker");
      tl.fromTo(dashes, { scaleX: 0 }, { scaleX: 1, duration: 0.5, stagger: 0.05 }, 0)
        .fromTo(kicker, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1);
    }

    // Heading — word-by-word blur reveal
    if (headingRef.current) {
      const words = headingRef.current.querySelectorAll(".sw-reveal-word");
      tl.fromTo(words,
        { opacity: 0.05, filter: "blur(8px)", y: 8 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.5, stagger: 0.04, ease: "power2.out" },
        0.2
      );
    }

    // Divider grows from center
    if (headerRef.current) {
      const divider = headerRef.current.querySelector(".sw-ov-divider");
      if (divider) tl.fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.6, transformOrigin: "center" }, 0.6);
    }

    // Body paragraphs clip-reveal + callout
    if (bodyRef.current) {
      const paras = bodyRef.current.querySelectorAll(".sw-ov-para");
      const callout = bodyRef.current.querySelector(".sw-ov-callout");
      tl.fromTo(paras,
        { clipPath: "inset(0 0 30% 0)", opacity: 0, y: 14 },
        { clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
        0.7
      );
      if (callout) tl.fromTo(callout, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.0);
    }
  }, [inView]);

  // Background parallax (scroll-linked, separate)
  useGSAP(() => {
    if (!bgRef.current || !sectionRef.current) return;
    gsap.to(bgRef.current, {
      y: 60, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
    });
  }, []);

  return (
    <section ref={sectionRef} id="overview" style={{ background: SW_CREAM, padding: "clamp(44px, 5vw, 64px) 0", position: "relative", overflow: "hidden" }}>
      {/* Background image — parallax */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={bgRef}
        src="https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/Home-Contact-Block.webp"
        alt=""
        style={{ position: "absolute", top: -30, left: 0, right: 0, height: "120%", width: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.3)", zIndex: 1, pointerEvents: "none" }} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>

        {/* Header — centered with dashes */}
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, justifyContent: "center" }}>
            <div className="sw-ov-dash" style={{ width: 28, height: 2, background: SW_ORANGE, borderRadius: 1, transform: "scaleX(0)" }} />
            <span className="sw-ov-kicker" style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE, opacity: 0 }}>About This Webinar</span>
            <div className="sw-ov-dash" style={{ width: 28, height: 2, background: SW_ORANGE, borderRadius: 1, transform: "scaleX(0)" }} />
          </div>

          {/* Heading — word-by-word blur reveal */}
          <div ref={headingRef} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 10px", marginBottom: 22 }}>
            {OVERVIEW_WORDS.map((word, i) => (
              <span key={i} className="sw-reveal-word" style={{
                fontFamily: "var(--font-display)", fontWeight: 300,
                fontSize: "clamp(26px, 3.5vw, 38px)", letterSpacing: "-0.5px",
                color: SW_DARK, lineHeight: 1.25, display: "inline-block",
                opacity: 0,
              }}>{word}</span>
            ))}
          </div>

          {/* Gradient divider */}
          <div className="sw-ov-divider" style={{ width: 48, height: 2, background: `linear-gradient(90deg, ${SW_ORANGE}, ${SW_MELON})`, borderRadius: 1, margin: "0 auto", transform: "scaleX(0)" }} />
        </div>

        {/* Body text */}
        <div ref={bodyRef} style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <p className="sw-ov-para" style={{ fontFamily: "var(--font-outfit)", fontSize: 15.5, fontWeight: 400, color: "#333", lineHeight: 1.8, margin: "0 0 12px", opacity: 0, clipPath: "inset(0 0 30% 0)" }}>
            This virtual roundtable highlights the persistent operational gaps attackers continue to exploit and offers practical, evidence-based strategies to strengthen protection where it matters most.
          </p>
          <p className="sw-ov-para" style={{ fontFamily: "var(--font-outfit)", fontSize: 15.5, fontWeight: 400, color: "#333", lineHeight: 1.8, margin: "0 0 28px", opacity: 0, clipPath: "inset(0 0 30% 0)" }}>
            Attendees will gain expert insights into simplifying security operations, eliminating blind spots, and improving overall resilience.
          </p>

          {/* Live demo callout — liquid glass skeuomorphic */}
          <div className="sw-ov-callout" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 28px", borderRadius: 50, background: "linear-gradient(145deg, rgba(160,190,240,0.3) 0%, rgba(200,220,250,0.25) 50%, rgba(255,230,215,0.2) 100%)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)", opacity: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: SW_ORANGE, boxShadow: `0 0 6px ${SW_ORANGE}50, 0 0 12px ${SW_ORANGE}20`, animation: "swCalloutPulse 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 500, color: SW_DARK, letterSpacing: "0.1px" }}>Includes a SonicWall Platform &amp; Unified Management demo</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes swCalloutPulse {
          0%, 100% { box-shadow: 0 0 6px ${SW_ORANGE}50, 0 0 12px ${SW_ORANGE}20; }
          50% { box-shadow: 0 0 8px ${SW_ORANGE}70, 0 0 18px ${SW_ORANGE}30; }
        }
      `}</style>
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
    <section ref={ref} style={{ background: SW_WHITE, padding: "clamp(40px, 5vw, 60px) 0" }}>
      <style>{`
        .sw-takeaway-row { transition: background 0.3s ease; border-radius: 10px; }
        .sw-takeaway-row:hover { background: rgba(30,40,40,0.02); }
        .sw-takeaway-row:hover .sw-tk-num { opacity: 1 !important; }
      `}</style>
      <div ref={takeawaysRef} style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 2, background: SW_ORANGE, borderRadius: 1 }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE }}>What You Will Learn</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", color: SW_DARK, lineHeight: 1.15, margin: 0 }}>Key Takeaways</h2>
        </div>

        {/* Vertical numbered list */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {TAKEAWAYS.map((item, i) => (
            <div key={i} className="sw-takeaway-row" style={{ display: "flex", gap: 24, alignItems: "flex-start", padding: "20px 16px", margin: "0 -16px", borderTop: i === 0 ? "none" : "1px solid rgba(30,40,40,0.06)", opacity: 0 }}>
              {/* Number */}
              <span className="sw-tk-num" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 34, color: SW_ORANGE, opacity: 0.7, lineHeight: 1.15, letterSpacing: "-1px", flexShrink: 0, width: 44, transition: "opacity 0.3s ease" }}>{String(i + 1).padStart(2, "0")}</span>
              {/* Content */}
              <div style={{ flex: 1, paddingTop: 2 }}>
                <h4 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: 16.5, color: SW_DARK, margin: "0 0 6px", letterSpacing: "0px", lineHeight: 1.35 }}>{item.heading}</h4>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14.5, fontWeight: 400, color: "#555", lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PAIN POINTS ─────────────────────────────────────────────────────────────
function PainPointsSection() {
  const ref = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useGSAP(() => {
    if (!inView || !cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll(".sw-pain-card");
    gsap.fromTo(cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out", delay: 0.25 }
    );
  }, [inView]);

  return (
    <section ref={ref} style={{ background: SW_CREAM, padding: "clamp(44px, 5vw, 64px) 0" }}>
      <style>{`
        .sw-pain-card {
          transition: transform 0.4s cubic-bezier(0.165,0.84,0.44,1), box-shadow 0.4s cubic-bezier(0.165,0.84,0.44,1), background 0.4s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03);
        }
        .sw-pain-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px rgba(30,40,40,0.06), 0 12px 40px rgba(0,0,0,0.08);
          background: #ffffff !important;
        }
        .sw-pain-card:hover .sw-pain-num { opacity: 1 !important; color: ${SW_ORANGE} !important; }
        .sw-pain-card:hover .sw-pain-bar { width: 100% !important; }
      `}</style>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 2, background: SW_ORANGE, borderRadius: 1 }} />
            <span style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE }}>The Challenge</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", color: SW_DARK, lineHeight: 1.15, margin: 0 }}>Why This Matters Now</h2>
        </div>

        {/* Cards */}
        <div ref={cardsRef} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="sw-pain-grid">
          {PAIN_POINTS.map((item, i) => (
            <div key={item.title} className="sw-pain-card" style={{ padding: "32px 28px 28px", borderRadius: 16, background: "#fafafa", opacity: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              {/* Top accent bar — grows full width on hover */}
              <div className="sw-pain-bar" style={{ position: "absolute", top: 0, left: 0, width: 40, height: 2.5, background: `linear-gradient(90deg, ${SW_ORANGE}, ${SW_MELON})`, transition: "width 0.5s cubic-bezier(0.165,0.84,0.44,1)" }} />
              {/* Number + Title row */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
                <span className="sw-pain-num" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: SW_ORANGE, opacity: 0.35, lineHeight: 1, letterSpacing: "-1.5px", transition: "opacity 0.4s ease, color 0.4s ease" }}>{String(i + 1).padStart(2, "0")}</span>
                <h4 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: 17, color: SW_DARK, margin: 0, letterSpacing: "0px", lineHeight: 1.2 }}>{item.title}</h4>
              </div>
              {/* Description */}
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, color: "#555", lineHeight: 1.75, margin: 0, flex: 1 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SPEAKERS ────────────────────────────────────────────────────────────────
function SpeakersSection() {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useGSAP(() => {
    if (!inView) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // ── Header: dash grows, kicker slides, heading blur-reveals ──
    if (headerRef.current) {
      const dash = headerRef.current.querySelector(".sw-spk-dash");
      const kicker = headerRef.current.querySelector(".sw-spk-kicker");
      const heading = headerRef.current.querySelector(".sw-spk-heading");

      tl.fromTo(dash, { scaleX: 0 }, { scaleX: 1, duration: 0.6, transformOrigin: "left" }, 0)
        .fromTo(kicker, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0.1)
        .fromTo(heading, { opacity: 0.08, filter: "blur(6px)", y: 8 }, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.7 }, 0.15);
    }

    // ── Cards: clip-path reveal + stagger ──
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".sw-speaker-card");
      const photos = cardsRef.current.querySelectorAll(".sw-speaker-photo");

      tl.fromTo(cards,
        { clipPath: "inset(20% 0 0 0)", opacity: 0, y: 30 },
        { clipPath: "inset(0% 0 0 0)", opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
        0.3
      );

      // ── Photos: Ken Burns settle ──
      tl.fromTo(photos,
        { scale: 1.1 },
        { scale: 1, duration: 1.4, ease: "power2.out", stagger: 0.15 },
        0.3
      );

      // ── Inner text: sequenced waterfall per card ──
      cards.forEach((card, i) => {
        const name = card.querySelector(".sw-speaker-name");
        const title = card.querySelector(".sw-speaker-title");
        const divider = card.querySelector(".sw-speaker-divider");
        const bio = card.querySelector(".sw-speaker-bio");
        const startTime = 0.55 + i * 0.15;

        tl.fromTo(name, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, startTime)
          .fromTo(title, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, startTime + 0.1)
          .fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.5, transformOrigin: "left" }, startTime + 0.15)
          .fromTo(bio, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, startTime + 0.2);
      });
    }
  }, [inView]);

  return (
    <section ref={ref} id="speakers" style={{ background: SW_WHITE, padding: "clamp(44px, 5vw, 64px) 0" }}>
      <style>{`
        .sw-speaker-card {
          transition: transform 0.4s cubic-bezier(0.165,0.84,0.44,1), box-shadow 0.4s cubic-bezier(0.165,0.84,0.44,1);
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }
        .sw-speaker-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 0 1px rgba(30,40,40,0.05), 0 16px 48px rgba(0,0,0,0.1);
        }
        .sw-speaker-card:hover .sw-speaker-photo { transform: scale(1.04) !important; filter: brightness(1.02); }
        .sw-speaker-card:hover .sw-speaker-name { color: ${SW_ORANGE} !important; }
      `}</style>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div className="sw-spk-dash" style={{ width: 28, height: 2, background: SW_ORANGE, borderRadius: 1, transformOrigin: "left", transform: "scaleX(0)" }} />
            <span className="sw-spk-kicker" style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE, opacity: 0 }}>Your Hosts</span>
          </div>
          <h2 className="sw-spk-heading" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", color: SW_DARK, lineHeight: 1.15, margin: 0, opacity: 0.08, filter: "blur(6px)" }}>Speakers</h2>
        </div>

        {/* Cards */}
        <div ref={cardsRef} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="sw-speakers-grid">
          {SPEAKERS.map((speaker) => (
            <div key={speaker.name} className="sw-speaker-card" style={{ borderRadius: 16, background: "#fff", overflow: "hidden", opacity: 0, border: "1px solid rgba(30,40,40,0.05)", clipPath: "inset(20% 0 0 0)" }}>
              {/* Photo with gradient overlay */}
              <div className="sw-speaker-photo-wrap" style={{ width: "100%", aspectRatio: "3/4", overflow: "hidden", position: "relative", background: SW_DARK }}>
                {speaker.photo ? (
                  <img className="sw-speaker-photo" loading="lazy" src={speaker.photo} alt={speaker.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: "scale(1.1)", transition: "transform 0.6s cubic-bezier(0.165,0.84,0.44,1), filter 0.6s ease" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${SW_ORANGE}20, ${SW_DARK})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 300, color: "rgba(255,255,255,0.15)" }}>{speaker.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, rgba(0,0,0,0.15), transparent)", pointerEvents: "none" }} />
              </div>
              {/* Info */}
              <div style={{ padding: "22px 24px 26px" }}>
                <h4 className="sw-speaker-name" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: 18, color: SW_DARK, margin: "0 0 4px", letterSpacing: "-0.3px", transition: "color 0.3s ease", opacity: 0 }}>{speaker.name}</h4>
                <p className="sw-speaker-title" style={{ fontFamily: "var(--font-outfit)", fontSize: 12.5, fontWeight: 400, color: SW_ORANGE, margin: "0 0 14px", letterSpacing: "0.3px", opacity: 0 }}>{speaker.title}</p>
                <div className="sw-speaker-divider" style={{ width: 24, height: 1.5, background: `linear-gradient(90deg, ${SW_ORANGE}, ${SW_MELON})`, borderRadius: 1, marginBottom: 14, transformOrigin: "left", transform: "scaleX(0)" }} />
                <p className="sw-speaker-bio" style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, fontWeight: 400, color: "#666", lineHeight: 1.7, margin: 0, opacity: 0 }}>{speaker.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AGENDA ──────────────────────────────────────────────────────────────────
function AgendaSection() {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useGSAP(() => {
    if (!inView) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Header
    if (headerRef.current) {
      const dash = headerRef.current.querySelector(".sw-ag-dash");
      const kicker = headerRef.current.querySelector(".sw-ag-kicker");
      const heading = headerRef.current.querySelector(".sw-ag-heading");
      tl.fromTo(dash, { scaleX: 0 }, { scaleX: 1, duration: 0.6, transformOrigin: "left" }, 0)
        .fromTo(kicker, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0.1)
        .fromTo(heading, { opacity: 0.08, filter: "blur(6px)", y: 8 }, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.7 }, 0.15);
    }

    // Rows stagger
    if (listRef.current) {
      const rows = listRef.current.querySelectorAll(".sw-agenda-row");
      tl.fromTo(rows,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.07 },
        0.4
      );
      // Timeline line grows
      const line = listRef.current.querySelector(".sw-ag-line");
      if (line) {
        tl.fromTo(line, { scaleY: 0, transformOrigin: "top" }, { scaleY: 1, duration: 0.8, ease: "power2.out" }, 0.35);
      }
      // Timeline dots pop
      const dots = listRef.current.querySelectorAll(".sw-ag-dot");
      tl.fromTo(dots,
        { scale: 0 },
        { scale: 1, duration: 0.35, stagger: 0.07, ease: "back.out(2.5)" },
        0.5
      );
    }
  }, [inView]);

  return (
    <section ref={ref} id="agenda" style={{ background: SW_CREAM, padding: "clamp(44px, 5vw, 64px) 0" }}>
      <style>{`
        .sw-agenda-row { transition: background 0.35s ease, box-shadow 0.35s ease; border-radius: 12px; }
        .sw-agenda-row:hover { background: #fff; box-shadow: 0 2px 16px rgba(0,0,0,0.04); }
        .sw-agenda-row:hover .sw-ag-time { color: ${SW_ORANGE} !important; }
        .sw-agenda-row:hover .sw-ag-dot { box-shadow: 0 0 0 3px rgba(255,110,65,0.15); }
        .sw-ag-dot { transition: box-shadow 0.3s ease; }
      `}</style>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div className="sw-ag-dash" style={{ width: 28, height: 2, background: SW_ORANGE, borderRadius: 1, transformOrigin: "left", transform: "scaleX(0)" }} />
            <span className="sw-ag-kicker" style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE, opacity: 0 }}>Programme</span>
          </div>
          <h2 className="sw-ag-heading" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", color: SW_DARK, lineHeight: 1.15, margin: 0, opacity: 0.08, filter: "blur(6px)" }}>Agenda</h2>
        </div>

        {/* Timeline list */}
        <div ref={listRef} style={{ display: "flex", flexDirection: "column", position: "relative", gap: 2 }}>
          {/* Vertical timeline line */}
          <div className="sw-ag-line" style={{ position: "absolute", left: 93, top: 12, bottom: 12, width: 1.5, background: `linear-gradient(to bottom, ${SW_ORANGE}22, ${SW_ORANGE}44, ${SW_ORANGE}22)`, borderRadius: 1 }} />

          {AGENDA.map((item, i) => (
            <div key={item.title} className="sw-agenda-row" style={{ display: "flex", gap: 20, padding: "18px 16px", margin: "0 -16px", alignItems: "flex-start", opacity: 0, position: "relative" }}>
              {/* Time column */}
              <div style={{ flexShrink: 0, width: 76, textAlign: "right", paddingTop: 1 }}>
                <span className="sw-ag-time" style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 300, color: item.highlight ? SW_ORANGE : SW_DARK, transition: "color 0.3s ease", letterSpacing: "-0.3px" }}>{item.time}</span>
                <span style={{ fontFamily: "var(--font-outfit)", fontSize: 10.5, fontWeight: 400, color: "#aaa", display: "block", marginTop: 2, letterSpacing: "0.3px" }}>{item.duration}</span>
              </div>

              {/* Timeline dot */}
              <div style={{ flexShrink: 0, width: 11, display: "flex", justifyContent: "center", paddingTop: 4, zIndex: 1 }}>
                <div className="sw-ag-dot" style={{ width: item.highlight ? 9 : 7, height: item.highlight ? 9 : 7, borderRadius: "50%", background: item.highlight ? SW_ORANGE : "#d1d5db", transform: "scale(0)" }} />
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                  <h4 style={{ fontFamily: "var(--font-outfit)", fontWeight: 600, fontSize: 15, color: SW_DARK, margin: 0, letterSpacing: "-0.1px", lineHeight: 1.35 }}>{item.title}</h4>
                  {item.highlight && (
                    <span style={{ fontFamily: "var(--font-outfit)", fontSize: 9.5, fontWeight: 500, letterSpacing: "0.8px", textTransform: "uppercase", color: SW_ORANGE, background: `${SW_ORANGE}0d`, padding: "2px 7px", borderRadius: 4, lineHeight: 1.6 }}>Featured</span>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 400, color: "#888", margin: 0, lineHeight: 1.5 }}>{item.presenter}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── COMPANY PROFILE ─────────────────────────────────────────────────────────
function CompanySection() {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useGSAP(() => {
    if (!inView) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Header — dashes scale in, kicker fades, heading chars mask-reveal
    if (headerRef.current) {
      const dashes = headerRef.current.querySelectorAll(".sw-about-dash");
      const kicker = headerRef.current.querySelector(".sw-about-kicker");
      const chars = headerRef.current.querySelectorAll(".sw-about-char");

      tl.fromTo(dashes, { scaleX: 0 }, { scaleX: 1, duration: 0.5, stagger: 0.05 }, 0)
        .fromTo(kicker, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1)
        // Char-by-char mask reveal (overflow:hidden on parent)
        .fromTo(chars,
          { y: "100%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.5, stagger: 0.03, ease: "power2.out" },
          0.2
        );
    }

    // Content — line-by-line paragraph reveal, counter stats, links
    if (contentRef.current) {
      const paras = contentRef.current.querySelectorAll(".sw-about-p");
      const statNums = contentRef.current.querySelectorAll(".sw-about-stat-num");
      const statLabels = contentRef.current.querySelectorAll(".sw-about-stat-label");
      const statDividers = contentRef.current.querySelectorAll(".sw-about-stat-div");
      const links = contentRef.current.querySelector(".sw-about-links");

      // Paragraphs — clip from bottom + fade
      tl.fromTo(paras,
        { clipPath: "inset(0 0 30% 0)", opacity: 0, y: 16 },
        { clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
        0.5
      );

      // Stat dividers grow from center
      tl.fromTo(statDividers,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.5, stagger: 0.08, transformOrigin: "center" },
        0.9
      );

      // Stats — counter animation (numbers count up)
      const counters = [
        { el: statNums[0], target: 30, suffix: "+" },
        { el: statNums[1], target: 17, suffix: "K+" },
        { el: statNums[2], target: 1, suffix: "M+" },
      ];
      counters.forEach((c, i) => {
        if (!c.el) return;
        const obj = { val: 0 };
        tl.to(obj, {
          val: c.target,
          duration: 1.2,
          ease: "power2.out",
          onStart: () => { (c.el as HTMLElement).style.opacity = "1"; },
          onUpdate: () => { (c.el as HTMLElement).textContent = Math.round(obj.val) + c.suffix; },
        }, 0.95 + i * 0.08);
      });

      // Stat labels fade in
      tl.fromTo(statLabels,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
        1.2
      );

      // Links — slide up with spring
      tl.fromTo(links,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" },
        1.4
      );
    }
  }, [inView]);


  return (
    <section ref={ref} style={{ position: "relative", padding: "clamp(40px, 5vw, 56px) 0" }}>
      <style>{`
        .sw-glass-btn {
          transition: all 0.35s cubic-bezier(0.165,0.84,0.44,1);
        }
        .sw-glass-btn:hover {
          background: linear-gradient(145deg, rgba(140,175,235,0.4) 0%, rgba(180,205,245,0.35) 50%, rgba(255,220,200,0.3) 100%) !important;
          border-color: rgba(255,255,255,0.65) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.1) !important;
          transform: translateY(-2px);
        }
      `}</style>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <div className="sw-about-content" style={{ maxWidth: 540 }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div className="sw-about-dash" style={{ width: 32, height: 2, background: `linear-gradient(90deg, ${SW_ORANGE}, ${SW_MELON})`, borderRadius: 1, transform: "scaleX(0)" }} />
            <span className="sw-about-kicker" style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE, opacity: 0 }}>About</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(32px, 4vw, 44px)", letterSpacing: "-1px", color: SW_DARK, lineHeight: 1.15, margin: 0, display: "flex", gap: "0 4px", overflow: "hidden" }}>
            {"SonicWall".split("").map((ch, i) => (
              <span key={i} className="sw-about-char" style={{ display: "inline-block", opacity: 0, transform: "translateY(100%)" }}>{ch}</span>
            ))}
          </h2>
        </div>

        {/* Content */}
        <div ref={contentRef}>
          <p className="sw-about-p" style={{ fontFamily: "var(--font-outfit)", fontSize: 17, fontWeight: 400, color: "#333", lineHeight: 1.75, margin: "0 0 12px", opacity: 0, clipPath: "inset(0 0 30% 0)" }}>
            For more than 30 years, SonicWall has championed a partner-first model that combines purpose-built technology, cloud-delivered security services and real-time threat intelligence to help businesses prevent breaches, reduce risk and stay operational in the face of evolving modern threats.
          </p>
          <p className="sw-about-p" style={{ fontFamily: "var(--font-outfit)", fontSize: 17, fontWeight: 400, color: "#333", lineHeight: 1.75, margin: "0 0 24px", opacity: 0, clipPath: "inset(0 0 30% 0)" }}>
            Through its unified cybersecurity portfolio and global community of over 17,000 partners, SonicWall enables managed service providers to actively manage, continuously optimize and measurably protect networks, cloud environments, endpoints and applications.
          </p>

          {/* Stats row */}
          <div className="sw-about-stats" style={{ display: "flex", gap: 0, maxWidth: 420, marginBottom: 24, width: "100%" }}>
            {[
              { num: "30+", label: "Years" },
              { num: "17K+", label: "Partners" },
            ].map((stat, i) => (
              <div key={stat.label} style={{ flex: 1, textAlign: "center", padding: "12px 0", position: "relative" }}>
                {i > 0 && <div className="sw-about-stat-div" style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 1, background: "rgba(30,40,40,0.1)", transform: "scaleY(0)" }} />}
                <span className="sw-about-stat-num" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px, 3vw, 34px)", color: SW_ORANGE, letterSpacing: "-1.5px", display: "block", lineHeight: 1, opacity: 0 }}>{stat.num}</span>
                <span className="sw-about-stat-label" style={{ fontFamily: "var(--font-outfit)", fontSize: 11, fontWeight: 500, color: "#555", letterSpacing: "0.5px", textTransform: "uppercase", marginTop: 6, display: "block", opacity: 0 }}>{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="sw-about-links" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", opacity: 0 }}>
            <a href="https://www.sonicwall.com/" target="_blank" rel="noopener noreferrer" className="sw-glass-btn" style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, color: SW_DARK, textDecoration: "none", padding: "14px 28px", borderRadius: 50, display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(145deg, rgba(160,190,240,0.3) 0%, rgba(200,220,250,0.25) 50%, rgba(255,230,215,0.2) 100%)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.03), 0 4px 14px rgba(0,0,0,0.06)" }}>sonicwall.com <span style={{ fontSize: 17, lineHeight: 1 }}>&rarr;</span></a>
            <a href="mailto:MEA@sonicwall.com" className="sw-glass-btn" style={{ fontFamily: "var(--font-outfit)", fontSize: 15, fontWeight: 500, color: SW_DARK, textDecoration: "none", padding: "14px 28px", borderRadius: 50, display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(145deg, rgba(160,190,240,0.3) 0%, rgba(200,220,250,0.25) 50%, rgba(255,230,215,0.2) 100%)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.03), 0 4px 14px rgba(0,0,0,0.06)" }}>MEA@sonicwall.com</a>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

// ─── REGISTRATION ────────────────────────────────────────────────────────────
function RegistrationSection() {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    COUNTRY_CODES.find(c => c.country === "AE") || COUNTRY_CODES[0]
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useGSAP(() => {
    if (!inView) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (headerRef.current) {
      const kicker = headerRef.current.querySelector(".sw-reg-kicker");
      const words = headerRef.current.querySelectorAll(".sw-reg-word");
      const desc = headerRef.current.querySelector(".sw-reg-desc");
      const trustPoints = headerRef.current.querySelectorAll(".sw-reg-trust");

      tl.fromTo(kicker, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 0)
        // Word-by-word mask reveal
        .fromTo(words,
          { y: "110%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" },
          0.1
        )
        .fromTo(desc, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.4)
        // Trust points stagger in
        .fromTo(trustPoints,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.08 },
          0.6
        );
    }
    if (formRef.current) {
      tl.fromTo(formRef.current,
        { opacity: 0, y: 24, clipPath: "inset(8% 0 0 0)" },
        { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 0.8 },
        0.3
      );
    }
  }, [inView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    if (formData.email && !isWorkEmail(formData.email)) {
      setEmailError("Please use your work email address");
      setSubmitting(false);
      return;
    }
    const phoneErr = validatePhone(formData.phone || "", selectedCountry);
    if (phoneErr) { setPhoneError(phoneErr); setSubmitting(false); return; }
    const combinedPhone = `${selectedCountry.code}${(formData.phone || "").replace(/[\s\-()]/g, "")}`;
    const result = await submitForm({
      type: "attend",
      full_name: formData.name || "",
      email: formData.email || "",
      company: formData.company || "",
      job_title: formData.title || "",
      phone: combinedPhone,
      event_name: "SonicWall Beyond the Firewall 2026",
      metadata: { message: formData.message || "" },
    });
    setSubmitting(false);
    if (result.success) setSubmitted(true);
    else setFormError(result.error || "Something went wrong.");
  };

  const handleChange = (n: string, v: string) => setFormData(p => ({ ...p, [n]: v }));
  const resetForm = () => { setSubmitted(false); setFormError(null); setFormData({}); setPhoneError(null); setEmailError(null); };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.45)",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.5)",
    color: SW_DARK, fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 400,
    outline: "none", transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500,
    color: "rgba(30,40,40,0.5)", marginBottom: 6, display: "block", letterSpacing: "0.3px",
  };

  const FIELDS = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
    { name: "email", label: "Work Email", type: "email", placeholder: "you@company.com" },
    { name: "phone", label: "Phone Number", type: "tel", placeholder: "+971 xxxx xxxx" },
    { name: "company", label: "Company", type: "text", placeholder: "Company name" },
    { name: "title", label: "Job Title", type: "text", placeholder: "Your role" },
    { name: "message", label: "Message (Optional)", type: "textarea", placeholder: "Anything you'd like us to know..." },
  ];

  return (
    <section ref={ref} id="register" style={{ position: "relative", padding: "clamp(48px, 6vw, 72px) 0" }}>
      <style>{`
        .sw-reg-input:focus { border-color: rgba(255,110,65,0.3) !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06), 0 0 0 3px rgba(255,110,65,0.08), 0 1px 0 rgba(255,255,255,0.5) !important; }
        .sw-reg-submit { transition: all 0.35s cubic-bezier(0.165,0.84,0.44,1); }
        .sw-reg-submit:hover:not(:disabled) { background: ${SW_MELON} !important; transform: translateY(-1px); box-shadow: 0 8px 30px rgba(255,110,65,0.25); }
        @media (max-width: 768px) { .sw-reg-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 500px) { .sw-reg-fields { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <div style={{ background: "linear-gradient(145deg, rgba(160,190,240,0.45) 0%, rgba(130,170,230,0.35) 40%, rgba(170,195,240,0.4) 100%)", border: "1px solid rgba(255,255,255,0.45)", borderRadius: 24, padding: "clamp(32px, 4vw, 48px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -2px 0 rgba(0,0,0,0.03), 0 12px 48px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}>
        <div className="sw-reg-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "clamp(28px, 4vw, 48px)", alignItems: "center" }}>

          {/* Left — Editorial */}
          <div ref={headerRef} style={{ paddingTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 28, height: 2, background: SW_ORANGE, borderRadius: 1 }} />
              <span className="sw-reg-kicker" style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 400, letterSpacing: "2.5px", textTransform: "uppercase", color: SW_ORANGE, opacity: 0 }}>Register</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-1px", color: SW_DARK, lineHeight: 1.1, margin: "0 0 16px", display: "flex", flexWrap: "wrap", gap: "0 10px" }}>
              {["Reserve", "Your", "Seat"].map((word, i) => (
                <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
                  <span className="sw-reg-word" style={{ display: "inline-block", transform: "translateY(110%)", opacity: 0 }}>{word}</span>
                </span>
              ))}
            </h2>
            <p className="sw-reg-desc" style={{ fontFamily: "var(--font-outfit)", fontSize: 16, fontWeight: 400, color: "#222", lineHeight: 1.75, margin: 0, maxWidth: 380, opacity: 0 }}>
              This is an exclusive, invite-only virtual roundtable for senior cybersecurity leaders. Submit your details and our team will confirm your place within 24 hours.
            </p>

            {/* Trust points */}
            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Invite-only, senior audience",
                "90-minute focused session",
                "Chatham House Rule",
              ].map(t => (
                <div key={t} className="sw-reg-trust" style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: SW_ORANGE, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: "#333" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div ref={formRef} style={{ opacity: 0 }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, color: SW_DARK, margin: "0 0 6px", letterSpacing: "-0.5px" }}>You&apos;re Registered</h3>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13.5, color: "#666", margin: "0 0 16px", lineHeight: 1.6 }}>Our team will confirm your seat within 24 hours.</p>
                <button onClick={resetForm} style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: SW_ORANGE, background: "none", border: "none", cursor: "pointer" }}>Submit another &rarr;</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="sw-reg-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {FIELDS.map(field => {
                    if (field.type === "tel") {
                      return (
                        <div key={field.name} style={{ gridColumn: "1 / -1" }}>
                          <label style={labelStyle}>{field.label}</label>
                          <div style={{ display: "flex", gap: 8 }}>
                            <select
                              value={`${selectedCountry.code}|${selectedCountry.country}`}
                              onChange={e => { const [code, country] = e.target.value.split("|"); const c = COUNTRY_CODES.find(cc => cc.code === code && cc.country === country); if (c) { setSelectedCountry(c); setPhoneError(null); } }}
                              className="sw-reg-input"
                              style={{ ...inputStyle, width: 120, flexShrink: 0, appearance: "none", cursor: "pointer" }}
                            >
                              {COUNTRY_CODES.map(cc => (
                                <option key={`${cc.code}-${cc.country}`} value={`${cc.code}|${cc.country}`} style={{ color: SW_DARK, background: "#fff" }}>{cc.country} {cc.code}</option>
                              ))}
                            </select>
                            <input type="tel" value={formData[field.name] || ""} onChange={e => { handleChange(field.name, e.target.value); setPhoneError(null); }} placeholder={selectedCountry.placeholder} maxLength={selectedCountry.length} className="sw-reg-input" style={{ ...inputStyle, flex: 1 }} />
                          </div>
                          {phoneError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{phoneError}</p>}
                        </div>
                      );
                    }
                    if (field.type === "email") {
                      return (
                        <div key={field.name}>
                          <label style={labelStyle}>{field.label}</label>
                          <input type="email" value={formData[field.name] || ""} onChange={e => { handleChange(field.name, e.target.value); setEmailError(null); }} placeholder={field.placeholder} required className="sw-reg-input" style={inputStyle}
                            onBlur={e => { const val = formData[field.name] || e.currentTarget.value; if (val && !isWorkEmail(val)) setEmailError("Please use your work email address"); }} />
                          {emailError && <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>{emailError}</p>}
                        </div>
                      );
                    }
                    if (field.type === "textarea") {
                      return (
                        <div key={field.name} style={{ gridColumn: "1 / -1" }}>
                          <label style={labelStyle}>{field.label}</label>
                          <textarea value={formData[field.name] || ""} onChange={e => handleChange(field.name, e.target.value)} placeholder={field.placeholder} rows={3} className="sw-reg-input" style={{ ...inputStyle, resize: "vertical", minHeight: 68 }} />
                        </div>
                      );
                    }
                    return (
                      <div key={field.name}>
                        <label style={labelStyle}>{field.label}</label>
                        <input type={field.type} value={formData[field.name] || ""} onChange={e => handleChange(field.name, e.target.value)} placeholder={field.placeholder} required className="sw-reg-input" style={inputStyle} />
                      </div>
                    );
                  })}
                </div>
                <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                {formError && <p style={{ color: "#ef4444", fontFamily: "var(--font-outfit)", fontSize: 12, margin: "8px 0 0" }}>{formError}</p>}
                <button type="submit" disabled={submitting} className="sw-reg-submit" style={{ width: "100%", marginTop: 18, padding: "13px 28px", borderRadius: 12, background: SW_ORANGE, color: "#fff", fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, border: "none", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1), 0 4px 16px rgba(255,110,65,0.2)" }}>
                  {submitting ? "Submitting..." : "Register Now"} {!submitting && <span>&rarr;</span>}
                </button>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "#999", textAlign: "center", margin: "12px 0 0" }}>Your information is kept confidential.</p>
              </form>
            )}
          </div>
        </div>
        </div>
      </div>
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
        {/* Logo — scroll to top on click */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SW_LOGO} alt="SonicWall" width={220} height={56} style={{ height: 56, width: "auto", cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

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
    <footer style={{ background: "#fff", borderTop: "1px solid rgba(30,40,40,0.06)", padding: "24px 0 20px" }}>
      <style>{`
        .sw-footer-link { transition: color 0.3s ease; }
        .sw-footer-link:hover { color: ${SW_ORANGE} !important; }
      `}</style>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {/* Top row — logo + links */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SW_LOGO} alt="SonicWall" width={140} height={32} style={{ height: 26, width: "auto" }} />
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <a href="https://www.sonicwall.com/" target="_blank" rel="noopener noreferrer" className="sw-footer-link" style={{ fontFamily: "var(--font-outfit)", fontSize: 12.5, fontWeight: 500, color: "#444", textDecoration: "none" }}>sonicwall.com &rarr;</a>
            <span style={{ width: 1, height: 12, background: "rgba(30,40,40,0.12)" }} />
            <a href="mailto:MEA@sonicwall.com" className="sw-footer-link" style={{ fontFamily: "var(--font-outfit)", fontSize: 12.5, fontWeight: 500, color: "#444", textDecoration: "none" }}>MEA@sonicwall.com</a>
          </div>
        </div>
        {/* Divider */}
        <div style={{ height: 1, background: "rgba(30,40,40,0.08)", marginBottom: 12 }} />
        {/* Copyright */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "#999", margin: 0 }}>
            &copy; {new Date().getFullYear()} SonicWall Inc. All rights reserved.
          </p>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 11, color: "#aaa", margin: 0 }}>
            Produced by <a href="https://eventsfirstgroup.com" target="_blank" rel="noopener noreferrer" style={{ color: SW_ORANGE, textDecoration: "none", fontWeight: 500 }}>Events First Group</a>
          </p>
        </div>
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
    <div style={{ background: "#fff" }}>
      <style jsx global>{`
        #register { --orange: ${SW_ORANGE}; --orange-bright: ${SW_MELON}; --orange-glow: rgba(255,110,65,0.35); }
        #register #get-involved { background: ${SW_DARK} !important; }
        #register #get-involved button[type="submit"] { background: ${SW_ORANGE} !important; border: none !important; }
        #register #get-involved button[type="submit"]:hover { background: ${SW_MELON} !important; }

        /* ─── Mobile responsive ─── */
        @media (max-width: 768px) {
          /* Hero */
          .sw-hero-content { min-height: auto !important; }
          .sw-hero-content > div { padding: 80px 20px 10px !important; }
          .sw-hero-content > div > div { max-width: 100% !important; }
          .sw-hero-content h1 { font-size: clamp(28px, 8.5vw, 38px) !important; letter-spacing: -1.5px !important; margin-bottom: 12px !important; }
          .sw-hero-content p { font-size: 14px !important; margin-bottom: 12px !important; }
          .sw-hero-content .sw-kicker { margin-bottom: 14px !important; }
          .sw-hero-content .sw-hero-stagger { margin-bottom: 16px !important; }
          .sw-hero-content .sw-hero-stagger > div { padding: 10px 14px !important; }

          /* Countdown */
          .sw-countdown-wrap { position: relative !important; bottom: auto !important; margin-top: 12px; padding-bottom: 12px; }
          .sw-cd-tile { padding: 8px 10px !important; min-width: 48px !important; border-radius: 10px !important; }
          .sw-cd-tile span:first-child { font-size: 18px !important; }

          /* All sections tighter */
          section { padding-top: 28px !important; padding-bottom: 28px !important; }

          /* All grids to 1 column */
          .sw-takeaways-grid,
          .sw-pain-grid,
          .sw-speakers-grid,
          .sw-overview-grid,
          .sw-reg-grid { grid-template-columns: 1fr !important; }

          /* CTA buttons full width */
          .sw-hero-cta, .sw-hero-ghost { width: 100% !important; justify-content: center !important; }

          /* About section — full width on mobile */
          .sw-about-content { max-width: 100% !important; }

          /* Speakers — square photos on mobile to show full face */
          .sw-speaker-photo-wrap { aspect-ratio: 1/1 !important; }

          /* Agenda timeline line hidden on mobile */
          .sw-ag-line { display: none !important; }
          .sw-agenda-row { padding-left: 0 !important; margin-left: 0 !important; }

          /* Glass buttons stack */
          .sw-glass-btn { width: 100% !important; justify-content: center !important; }

          /* Footer */
          footer > div:first-child { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          footer > div:last-child { flex-direction: column !important; align-items: flex-start !important; }

          /* Register glass container */
          .sw-reg-grid > div:first-child { text-align: center !important; }
          .sw-reg-grid > div:first-child > div { justify-content: center !important; }
          .sw-reg-grid > div:first-child p { max-width: 100% !important; }
        }

        @media (max-width: 480px) {
          .sw-hero-content > div { padding: 72px 16px 8px !important; }
          .sw-hero-content h1 { font-size: clamp(26px, 8.5vw, 34px) !important; }
          .sw-hero-content .sw-kicker { padding: 8px 16px 8px 12px !important; }
          .sw-hero-content .sw-kicker span { font-size: 10px !important; }

          /* Form fields 1 column on small screens */
          .sw-reg-fields { grid-template-columns: 1fr !important; }

          /* Smaller glass container padding */
          .sw-reg-grid { gap: 20px !important; }

          /* Callout badge wraps */
          .sw-ov-callout { text-align: center !important; }

          /* Stats tighter */
          .sw-about-stats { max-width: 100% !important; }
        }
      `}</style>

      <SonicWallNav />
      <HeroSection />
      <OverviewSection />
      <TakeawaysSection />
      <PainPointsSection />
      <SpeakersSection />
      <AgendaSection />
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Shared background */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img loading="lazy" src="https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/hero-networksecuritymanager.webp" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.35)" }} />
        </div>
        <CompanySection />
        <RegistrationSection />
      </div>
      <SonicWallFooter />
    </div>
  );
}
