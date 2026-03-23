"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone } from "@/lib/form-helpers";
import type { CountryCode } from "@/lib/form-helpers";

// ─── Braze Brand Colors ─────────────────────────────────────────────────────
const B_ORANGE = "#FFA524";
const B_PURPLE = "#801ED7";
const B_DARK_PURPLE = "#300266";
const B_RED = "#E9371F";
const B_PINK = "#FFA4FB";
const B_LAVENDER = "#C9C4FF";
const B_PEACH = "#FFD4BC";
const HEAT1 = `linear-gradient(135deg, ${B_PINK} 0%, ${B_ORANGE} 50%, ${B_RED} 100%)`;
const HEAT2 = `linear-gradient(135deg, ${B_LAVENDER} 0%, ${B_PURPLE} 50%, ${B_ORANGE} 100%)`;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MAX_W = 1080;
const PAD = "0 clamp(20px, 4vw, 60px)";
const FONT = "'Aribau Grotesk', sans-serif";

// ─── Content ─────────────────────────────────────────────────────────────────
const THEMES = [
  {
    num: "01",
    title: "Engagement During Uncertainty",
    desc: "Approaches to customer engagement during uncertain times.",
  },
  {
    num: "02",
    title: "Messaging and Sensitivity",
    desc: "Balancing business targets, messaging, and sensitivity.",
  },
  {
    num: "03",
    title: "Adapting Marketing Strategies",
    desc: "Peer insights on adapting marketing strategies.",
  },
  {
    num: "04",
    title: "Lessons from the Region",
    desc: "Lessons learned from challenges across the region.",
  },
];

const ROLES_GROUP_1 = [
  "Marketing",
  "Growth",
  "Digital",
  "Customer Engagement",
];

const ROLES_GROUP_2 = [
  "Martech",
  "Omnichannel",
  "Retention",
  "Lifecycle",
  "Innovation",
  "Technology",
];

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function BrazeLandingPage() {
  return (
    <div style={{ background: B_DARK_PURPLE, fontFamily: FONT }}>
      <style jsx global>{`
        @font-face {
          font-family: 'Aribau Grotesk';
          src: url('/fonts/AribauGrotesk-Light.woff2') format('woff2');
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Aribau Grotesk';
          src: url('/fonts/AribauGrotesk-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Aribau Grotesk';
          src: url('/fonts/AribauGrotesk-Bold.woff2') format('woff2');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Aribau Grotesk';
          src: url('/fonts/AribauGrotesk-Black.woff2') format('woff2');
          font-weight: 900;
          font-style: normal;
          font-display: swap;
        }
        @keyframes braze-shimmer {
          0% { transform: translateX(-100%) rotate(15deg); }
          100% { transform: translateX(200%) rotate(15deg); }
        }
        @keyframes braze-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(8px); opacity: 1; }
        }
        @keyframes braze-cta-pulse {
          0%, 100% { box-shadow: 0 4px 30px rgba(0,0,0,0.1), 0 0 0 0 rgba(255,255,255,0.3); }
          50% { box-shadow: 0 4px 30px rgba(0,0,0,0.1), 0 0 0 8px rgba(255,255,255,0); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        .braze-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          color: white;
          font-family: 'Aribau Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .braze-input::placeholder { color: rgba(255,255,255,0.35); }
        .braze-input:focus {
          border-color: ${B_ORANGE};
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 3px ${B_ORANGE}15;
        }
        @media (max-width: 768px) {
          .braze-nav-links { display: none !important; }
          .braze-nav-cta { display: none !important; }
          .braze-nav-burger { display: flex !important; }
          .braze-hero { min-height: 100vh !important; padding: 100px 20px 80px !important; }
          .braze-hero h1 { font-size: clamp(34px, 9vw, 48px) !important; }
          .braze-scroll-indicator { display: none !important; }
          .braze-hero-details { display: none !important; }
          .braze-hero-event-details { justify-content: center !important; }
          .braze-hero-content { text-align: center !important; align-items: center !important; }
          .braze-hero-meta { justify-content: center !important; }
          .braze-overview-layout { grid-template-columns: 1fr !important; gap: 32px !important; }
          .braze-themes-timeline { display: none !important; }
          .braze-themes-number { width: 64px !important; }
          .braze-attend-layout { grid-template-columns: 1fr !important; gap: 32px !important; }
          .braze-attend-pills { justify-content: center !important; }
          .braze-form-grid { grid-template-columns: 1fr !important; }
          .braze-section { padding: 60px 0 !important; }
          .braze-section-flush { padding: 0 !important; margin-top: 0 !important; }
          .braze-stats-bar { flex-direction: column !important; gap: 16px !important; padding: 32px 0 !important; }
          .braze-expect-grid { grid-template-columns: 1fr !important; }
          .braze-hosted-layout { flex-direction: column !important; text-align: center !important; }
          .braze-footer-inner { flex-direction: column !important; text-align: center !important; gap: 16px !important; }
        }
        @media (max-width: 480px) {
          .braze-hero h1 { font-size: clamp(28px, 8vw, 36px) !important; }
          .braze-hero { padding: 90px 16px 60px !important; }
        }
      `}</style>

      <BrazeNav />
      <HeroSection />
      <OverviewSection />
      <WhatToExpect />
      <ThemesSection />
      <AttendSection />
      <HostedByBraze />
      <RegisterSection />
      <BrazeFooter />
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#themes", label: "Discussion Themes" },
  { href: "#attend", label: "Who Should Attend" },
  { href: "#register", label: "Register" },
];

function BrazeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function scrollTo(href: string) {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          background: scrolled ? "rgba(48, 2, 102, 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          padding: scrolled ? "12px 0" : "18px 0",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          style={{
            maxWidth: MAX_W,
            margin: "0 auto",
            padding: PAD,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <span
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Image
              src="/braze/braze-logo-white.png"
              alt="Braze"
              width={160}
              height={44}
              style={{ height: "clamp(32px, 3vw, 44px)", width: "auto" }}
              priority
            />
          </span>

          {/* Desktop nav links */}
          <div
            className="braze-nav-links"
            style={{ display: "flex", alignItems: "center", gap: 32 }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            className="braze-nav-cta"
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#register");
            }}
            style={{
              display: "inline-flex",
              padding: "10px 24px",
              borderRadius: 50,
              background: B_PURPLE,
              color: "white",
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Register Now
          </a>

          {/* Mobile burger */}
          <button
            className="braze-nav-burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{
              display: "none",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
              width: 24,
              height: 24,
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <motion.span
              style={{ position: "absolute", width: 22, height: 1.5, background: "white", borderRadius: 2 }}
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 0 : -6 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              style={{ position: "absolute", width: 22, height: 1.5, background: "white", borderRadius: 2 }}
              animate={{ opacity: mobileOpen ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              style={{ position: "absolute", width: 22, height: 1.5, background: "white", borderRadius: 2 }}
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? 0 : 6 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10001,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              background: "rgba(48, 2, 102, 0.97)",
              backdropFilter: "blur(30px)",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="white" strokeWidth="1.5">
                <line x1="7" y1="7" x2="21" y2="21" />
                <line x1="21" y1="7" x2="7" y2="21" />
              </svg>
            </button>

            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                style={{
                  fontFamily: FONT,
                  fontSize: 28,
                  fontWeight: 900,
                  color: "white",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </motion.a>
            ))}

            <motion.a
              href="#register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.08, duration: 0.4, ease: EASE }}
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#register");
              }}
              style={{
                marginTop: 16,
                padding: "14px 36px",
                borderRadius: 50,
                background: B_ORANGE,
                color: "white",
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Register Now
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const supergraphicY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const supergraphicScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="braze-hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: B_ORANGE,
        overflow: "hidden",
        padding: "100px clamp(20px, 4vw, 60px) 100px",
      }}
    >
      {/* Grain texture overlay for premium depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.035,
          pointerEvents: "none",
          zIndex: 4,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Slow animated shimmer sweep */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "40%",
            height: "200%",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 60%, transparent 100%)",
            animation: "braze-shimmer 8s ease-in-out infinite",
          }}
        />
      </div>

      {/* Top-left warm radial glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-15%",
          width: "60%",
          height: "80%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Supergraphic — Heat 1 gradient, dramatic bleed, with parallax */}
      <motion.div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-15%",
          width: "80%",
          height: "140%",
          pointerEvents: "none",
          y: supergraphicY,
          scale: supergraphicScale,
        }}
      >
        <Image
          src="/braze/sg-heat1-5.png"
          alt=""
          fill
          style={{ objectFit: "contain", objectPosition: "right center" }}
          priority
        />
      </motion.div>

      {/* Red flashpoint accent — larger, more atmospheric */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: B_RED,
          opacity: 0.1,
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      {/* Purple atmospheric glow — bottom left for depth */}
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: B_PURPLE,
          opacity: 0.08,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Content with scroll fade — two-column layout */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: MAX_W,
          margin: "0 auto",
          width: "100%",
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        <motion.div
          className="braze-hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", maxWidth: 580 }}
        >
            {/* Virtual Roundtable label */}
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              style={{
                fontFamily: FONT,
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Virtual Roundtable
            </motion.span>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "clamp(30px, 3.5vw, 46px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "white",
                margin: "0 0 24px",
                maxWidth: 540,
                textShadow: "0 2px 40px rgba(0,0,0,0.08)",
              }}
            >
              Marketing Through Uncertainty: How Brands Are Adjusting Customer Engagement Right Now<span style={{ color: B_RED }}>.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "clamp(15px, 1.3vw, 18px)",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.6,
                margin: "0 0 36px",
                maxWidth: 440,
              }}
            >
              A private virtual roundtable for senior martech leaders in MENAT.
            </motion.p>

            {/* Event details — inline with dividers */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                marginBottom: 32,
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="white" strokeWidth="1.2"/><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>, text: "8 April 2026" },
                { icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.2"/><path d="M8 4.5V8l2.5 1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>, text: "60 Min" },
                { icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="9" rx="1.5" stroke="white" strokeWidth="1.2"/><circle cx="8" cy="7.5" r="2" stroke="white" strokeWidth="1.2"/></svg>, text: "Virtual" },
              ].map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.25)", margin: "0 16px" }} />}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: FONT,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "white",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {item.icon}
                    {item.text}
                  </span>
                </React.Fragment>
              ))}
            </motion.div>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
              style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}
            >
              <a
                href="#register"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 40px",
                  borderRadius: 50,
                  background: B_PURPLE,
                  color: "white",
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: `0 4px 24px ${B_PURPLE}35`,
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.boxShadow = `0 12px 40px ${B_PURPLE}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = `0 4px 24px ${B_PURPLE}35`;
                }}
              >
                Register Your Interest
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              {/* Secondary text link */}
              <a
                href="#overview"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "color 0.3s ease",
                  borderBottom: "1px solid rgba(255,255,255,0.25)",
                  paddingBottom: 2,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.25)";
                }}
              >
                Learn More
              </a>
            </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — minimal line + chevron */}
      <motion.div
        className="braze-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{
          position: "absolute",
          bottom: 36,
          left: "clamp(20px, 4vw, 60px)",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{
          width: 1,
          height: 40,
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.35))",
        }} />
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{ animation: "braze-bounce 2.5s ease-in-out infinite" }}
        >
          <path d="M2 4l4 4 4-4" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* Event details strip — REMOVED, now in hero content */}
      <motion.div
        style={{ display: "none" }}
      >
        {[
          { label: "Q2 2026", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/><line x1="1.5" y1="5.5" x2="12.5" y2="5.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/><line x1="4.5" y1="1" x2="4.5" y2="3.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeLinecap="round"/><line x1="9.5" y1="1" x2="9.5" y2="3.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeLinecap="round"/></svg> },
          { label: "60 Min", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/><polyline points="7,4 7,7 9.5,8.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          { label: "Virtual", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/><circle cx="7" cy="7" r="1.5" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/></svg> },
        ].map((item, i) => (
          <span
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(255,255,255,0.75)",
              letterSpacing: "0.3px",
            }}
          >
            {i > 0 && (
              <span style={{
                width: 1,
                height: 14,
                background: "rgba(255,255,255,0.15)",
                marginRight: 20,
              }} />
            )}
            {item.icon}
            {item.label}
          </span>
        ))}
      </motion.div>

    </section>
  );
}

// ─── STATS BAR ──────────────────────────────────────────────────────────────
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const stats = [
    { value: 150, suffix: "+", label: "Senior Leaders" },
    { value: 12, suffix: "+", label: "Markets" },
    { value: 1, suffix: "", label: "Focused Discussion" },
  ];

  return (
    <div
      ref={ref}
      style={{
        background: `linear-gradient(135deg, ${B_DARK_PURPLE} 0%, ${B_PURPLE} 50%, ${B_DARK_PURPLE} 100%)`,
        position: "relative",
        zIndex: 5,
        overflow: "hidden",
      }}
    >
      {/* Supergraphic watermark — subtle */}
      <div style={{
        position: "absolute",
        top: "-60%",
        left: "-8%",
        width: "40%",
        height: "220%",
        opacity: 0.04,
        pointerEvents: "none",
      }}>
        <Image src="/braze/sg-heat1-3.png" alt="" fill style={{ objectFit: "contain" }} />
      </div>
      <div style={{
        position: "absolute",
        top: "-60%",
        right: "-8%",
        width: "40%",
        height: "220%",
        opacity: 0.04,
        pointerEvents: "none",
        transform: "scaleX(-1)",
      }}>
        <Image src="/braze/sg-heat1-3.png" alt="" fill style={{ objectFit: "contain" }} />
      </div>


      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)", position: "relative", zIndex: 2 }}>
        <motion.div
          className="braze-stats-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 0,
            padding: "56px 0",
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.15, ease: EASE }}
              style={{
                textAlign: "center",
                flex: 1,
                padding: "0 40px",
                position: "relative",
              }}
            >
              {/* Gradient divider */}
              {i < stats.length - 1 && (
                <div style={{
                  position: "absolute",
                  right: 0,
                  top: "10%",
                  bottom: "10%",
                  width: 1,
                  background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)",
                }} />
              )}
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: "clamp(40px, 5vw, 64px)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: "white",
                  marginBottom: 16,
                }}
              >
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: 11,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─── OVERVIEW ────────────────────────────────────────────────────────────────
function OverviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="overview"
      className="braze-section braze-section-flush"
      ref={ref}
      style={{
        padding: "0",
        background: "#FAFAFA",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ background: "#FAFAFA", position: "relative", overflow: "hidden" }}>

        {/* Subtle dot grid pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${B_PURPLE}12 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />

        {/* Supergraphic — more visible */}
        <div style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "40%",
          height: "120%",
          opacity: 0.07,
          pointerEvents: "none",
        }}>
          <Image src="/braze/sg-heat1-5.png" alt="" fill style={{ objectFit: "contain" }} />
        </div>

        <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: "100px clamp(20px, 4vw, 60px) 100px", position: "relative", zIndex: 2 }}>
          <div className="braze-overview-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            {/* LEFT — Heading + CTA */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: B_PURPLE,
                  marginBottom: 20,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: B_ORANGE }} />
                About the Roundtable
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: "clamp(26px, 3vw, 40px)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  color: B_DARK_PURPLE,
                  margin: "0 0 36px",
                  paddingLeft: 24,
                  borderImage: `linear-gradient(to bottom, ${B_PURPLE}, ${B_ORANGE}) 1`,
                  borderLeft: "3px solid",
                }}
              >
                In Times of Uncertainty, Should Brands Stay Loud or Go Quiet?
              </motion.h2>

              <motion.a
                href="#register"
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 32px",
                  borderRadius: 50,
                  background: B_PURPLE,
                  color: "white",
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 12px 36px ${B_PURPLE}30`;
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Join the Discussion
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.a>

            </div>

            {/* RIGHT — Body text in card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              style={{
                background: "rgba(128,30,215,0.03)",
                borderRadius: 20,
                padding: "36px 36px 40px",
                border: "1px solid rgba(128,30,215,0.08)",
                boxShadow: "0 4px 24px rgba(128,30,215,0.04)",
              }}
            >
              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: "clamp(15px, 1.2vw, 16px)",
                  color: "rgba(30,0,70,0.72)",
                  lineHeight: 1.75,
                  margin: "0 0 24px",
                }}
              >
                The Middle East region is navigating an evolving landscape. Marketing leaders face shifting priorities, messaging challenges, and rapidly changing customer expectations. Understanding how peers are navigating these changes is critical.
              </p>

              {/* Separator */}
              <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${B_PURPLE}, ${B_ORANGE})`, borderRadius: 2, margin: "0 0 20px" }} />

              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: "clamp(15px, 1.2vw, 16px)",
                  color: "rgba(30,0,70,0.65)",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                Join a focused group of senior martech leaders across MENAT for a virtual closed-door roundtable to exchange perspectives, share strategies, and learn from each other on engaging consumers effectively during uncertain periods.
              </p>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── WHAT TO EXPECT ─────────────────────────────────────────────────────────
const BENEFITS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="10" r="5" stroke={B_PURPLE} strokeWidth="1.5" />
        <circle cx="8" cy="22" r="4" stroke={B_PURPLE} strokeWidth="1.5" />
        <circle cx="24" cy="22" r="4" stroke={B_PURPLE} strokeWidth="1.5" />
        <line x1="13" y1="14" x2="10" y2="19" stroke={B_PURPLE} strokeWidth="1.5" />
        <line x1="19" y1="14" x2="22" y2="19" stroke={B_PURPLE} strokeWidth="1.5" />
      </svg>
    ),
    title: "Peer Insights",
    desc: "Exchange strategies with senior martech leaders navigating similar challenges across the MENAT region.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="5" y="8" width="22" height="16" rx="3" stroke={B_PURPLE} strokeWidth="1.5" />
        <polyline points="10,20 14,14 18,17 22,12" stroke={B_PURPLE} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Actionable Strategies",
    desc: "Walk away with concrete approaches to customer engagement that you can implement immediately.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="7" y="5" width="18" height="22" rx="3" stroke={B_PURPLE} strokeWidth="1.5" />
        <line x1="12" y1="11" x2="20" y2="11" stroke={B_PURPLE} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="16" x2="20" y2="16" stroke={B_PURPLE} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="21" x2="16" y2="21" stroke={B_PURPLE} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Closed-Door Format",
    desc: "An intimate, invite-only virtual setting designed for candid conversation — no recordings, no sales pitches.",
  },
];

function WhatToExpect() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="braze-section" ref={ref} style={{
      padding: "88px 0 100px",
      background: `linear-gradient(170deg, #E8941A 0%, ${B_ORANGE} 35%, #D4800F 100%)`,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Supergraphic watermark — right */}
      <div style={{
        position: "absolute",
        top: "-25%",
        right: "-8%",
        width: "48%",
        height: "150%",
        opacity: 0.16,
        pointerEvents: "none",
      }}>
        <Image src="/braze/sg-heat1-3.png" alt="" fill style={{ objectFit: "contain" }} />
      </div>

      {/* Supergraphic watermark — left subtle */}
      <div style={{
        position: "absolute",
        bottom: "-20%",
        left: "-12%",
        width: "35%",
        height: "120%",
        opacity: 0.08,
        pointerEvents: "none",
        transform: "scaleX(-1) rotate(15deg)",
      }}>
        <Image src="/braze/sg-heat1-1.png" alt="" fill style={{ objectFit: "contain" }} />
      </div>

      {/* White radial glow top-left */}
      <div style={{
        position: "absolute",
        top: "-15%",
        left: "-10%",
        width: "50%",
        height: "70%",
        background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent 55%)",
        pointerEvents: "none",
      }} />

      {/* Red warm tint center-right */}
      <div style={{
        position: "absolute",
        top: "30%",
        right: "-5%",
        width: "40%",
        height: "50%",
        background: `radial-gradient(circle, ${B_RED}12, transparent 60%)`,
        pointerEvents: "none",
      }} />

      {/* Dark vignette at bottom for depth */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "40%",
        background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.06))",
        pointerEvents: "none",
      }} />

      {/* Grain texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.035,
        pointerEvents: "none",
        zIndex: 3,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />

      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative", zIndex: 4 }}>
        {/* Centered header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "white",
              marginBottom: 18,
              opacity: 0.55,
            }}
          >
            <span style={{ width: 20, height: 1.5, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
            What to Expect
            <span style={{ width: 20, height: 1.5, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: "clamp(30px, 3.8vw, 48px)",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "white",
              margin: 0,
              textShadow: "0 3px 28px rgba(0,0,0,0.15)",
            }}
          >
            Your Time, Well Spent.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize: 16,
              color: "rgba(255,255,255,0.7)",
              margin: "18px auto 0",
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            A focused, peer-to-peer format designed for senior leaders.
          </motion.p>
        </div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          style={{
            width: 52,
            height: 3,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
            borderRadius: 4,
            margin: "0 auto 56px",
          }}
        />

        <div
          className="braze-expect-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}
        >
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: EASE }}
              style={{
                background: `linear-gradient(160deg, ${B_DARK_PURPLE} 0%, #1A0440 45%, ${B_PURPLE}95 100%)`,
                borderRadius: 20,
                padding: "44px 32px 40px",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
                boxShadow: `0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`,
                border: "1px solid rgba(128,30,215,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = `0 28px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(128,30,215,0.3)`;
                e.currentTarget.style.borderColor = "rgba(128,30,215,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`;
                e.currentTarget.style.borderColor = "rgba(128,30,215,0.25)";
              }}
            >
              {/* Inner glow — purple shimmer at top */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 130,
                background: `linear-gradient(180deg, rgba(128,30,215,0.2), transparent)`,
                pointerEvents: "none",
              }} />

              {/* Corner glow — warm orange bottom-right */}
              <div style={{
                position: "absolute",
                bottom: -40,
                right: -40,
                width: 160,
                height: 160,
                background: `radial-gradient(circle, ${B_ORANGE}0C, transparent 65%)`,
                pointerEvents: "none",
              }} />

              {/* Left accent bar */}
              <div style={{
                position: "absolute",
                top: 20,
                left: 0,
                bottom: 20,
                width: 3,
                background: `linear-gradient(180deg, ${B_ORANGE}60, transparent)`,
                borderRadius: "0 4px 4px 0",
              }} />

              {/* Number badge */}
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${B_ORANGE}28, ${B_ORANGE}12)`,
                border: `1px solid ${B_ORANGE}35`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 22,
                position: "relative",
                boxShadow: `0 4px 16px ${B_ORANGE}15`,
              }}>
                <span style={{
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: 900,
                  color: B_ORANGE,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 21,
                  color: "white",
                  margin: "0 0 12px",
                  lineHeight: 1.3,
                  position: "relative",
                  letterSpacing: "-0.01em",
                }}
              >
                {b.title}
              </h3>

              {/* Separator */}
              <div style={{
                width: 32,
                height: 2,
                background: `linear-gradient(90deg, ${B_ORANGE}50, transparent)`,
                borderRadius: 2,
                marginBottom: 14,
              }} />

              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 300,
                  fontSize: 14.5,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.8,
                  margin: 0,
                  position: "relative",
                }}
              >
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}

// ─── THEMES ──────────────────────────────────────────────────────────────────
function ThemesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="themes" className="braze-section" ref={ref} style={{
      padding: "96px 0 0",
      background: `linear-gradient(180deg, ${B_DARK_PURPLE} 0%, ${B_PURPLE} 50%, ${B_DARK_PURPLE} 100%)`,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Supergraphic */}
      <div style={{
        position: "absolute",
        bottom: "-20%",
        left: "-8%",
        width: "35%",
        height: "140%",
        opacity: 0.05,
        pointerEvents: "none",
        transform: "scaleX(-1)",
      }}>
        <Image src="/braze/sg-heat1-5.png" alt="" fill style={{ objectFit: "contain" }} />
      </div>

      {/* Warm radial glow — top left */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "-5%",
        width: 600,
        height: 600,
        background: `radial-gradient(circle, ${B_ORANGE}0A, transparent 65%)`,
        pointerEvents: "none",
      }} />

      {/* Purple radial glow — bottom right */}
      <div style={{
        position: "absolute",
        bottom: "-5%",
        right: "-5%",
        width: 500,
        height: 500,
        background: `radial-gradient(circle, rgba(128,30,215,0.12), transparent 65%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative", zIndex: 2 }}>
        {/* Left-aligned header with accent */}
        <div style={{ marginBottom: 64, display: "flex", alignItems: "flex-start", gap: 20 }}>
          {/* Decorative accent bar */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            style={{
              width: 4,
              height: 64,
              background: `linear-gradient(180deg, rgba(255,255,255,0.3), ${B_DARK_PURPLE})`,
              borderRadius: 4,
              flexShrink: 0,
              marginTop: 6,
              transformOrigin: "top",
            }}
          />
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE }}
              style={{
                display: "inline-block",
                fontFamily: FONT,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 14,
              }}
            >
              Discussion Themes
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: "clamp(28px, 3.5vw, 44px)",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                color: "white",
                margin: 0,
              }}
            >
              What We Will Explore.
            </motion.h2>
          </div>
        </div>

        {/* Timeline layout */}
        <div style={{ display: "flex", gap: 0, position: "relative" }}>
          {/* Vertical timeline line */}
          <div className="braze-themes-timeline" style={{ position: "relative", width: 64, flexShrink: 0 }}>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
              style={{
                position: "absolute",
                top: 24,
                bottom: 24,
                left: "50%",
                width: 1.5,
                background: `linear-gradient(180deg, transparent, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.2) 80%, transparent)`,
                transformOrigin: "top",
                marginLeft: -0.75,
              }}
            />
            {/* Timeline dots */}
            {THEMES.map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.45 + i * 0.18, ease: EASE }}
                style={{
                  position: "absolute",
                  top: `calc(${i * (100 / (THEMES.length - 1))}%)`,
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, rgba(255,255,255,0.25) 0%, ${B_DARK_PURPLE} 70%)`,
                  border: `2px solid rgba(255,255,255,0.2)`,
                  boxShadow: `0 0 12px rgba(128,30,215,0.3)`,
                  zIndex: 2,
                }}
              />
            ))}
          </div>

          {/* Cards column */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {THEMES.map((t, i) => (
              <motion.div
                key={t.num}
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease: EASE }}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  borderRadius: 14,
                  overflow: "hidden",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "default",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  e.currentTarget.style.transform = "translateX(8px)";
                  e.currentTarget.style.boxShadow = `0 20px 56px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Number block with gradient */}
                <div className="braze-themes-number" style={{
                  width: 80,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(180deg, rgba(48,2,102,0.9), rgba(48,2,102,0.5))`,
                  borderRight: `1px solid rgba(255,255,255,0.06)`,
                  position: "relative",
                }}>
                  {/* Subtle inner glow */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(circle at center, rgba(128,30,215,0.15), transparent 70%)`,
                    pointerEvents: "none",
                  }} />
                  <span style={{
                    fontFamily: FONT,
                    fontSize: 34,
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.35)",
                    lineHeight: 1,
                    position: "relative",
                  }}>
                    {t.num}
                  </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: "30px 32px 28px" }}>
                  <h3 style={{
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: 20,
                    color: "white",
                    margin: "0 0 8px",
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                  }}>
                    {t.title}
                  </h3>
                  <p style={{
                    fontFamily: FONT,
                    fontWeight: 300,
                    fontSize: 14.5,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.75,
                    margin: 0,
                  }}>
                    {t.desc}
                  </p>
                </div>

                {/* Subtle right edge accent on hover — arrow hint */}
                <div style={{
                  width: 4,
                  flexShrink: 0,
                  background: `linear-gradient(180deg, transparent, rgba(255,255,255,0.06), transparent)`,
                }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── WHO SHOULD ATTEND ───────────────────────────────────────────────────────
function AttendSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="attend"
      className="braze-section braze-section-flush"
      ref={ref}
      style={{
        padding: "0",
        position: "relative",
        marginTop: 80,
      }}
    >
      {/* Main area — dark purple with orange accents */}
      <div style={{
        background: `linear-gradient(160deg, ${B_DARK_PURPLE} 0%, #1A0440 50%, ${B_DARK_PURPLE} 100%)`,
        position: "relative",
        overflow: "hidden",
        padding: "80px 0 96px",
      }}>
        {/* Supergraphic watermark */}
        <div style={{
          position: "absolute",
          top: "-30%",
          right: "-12%",
          width: "55%",
          height: "160%",
          opacity: 0.06,
          pointerEvents: "none",
        }}>
          <Image src="/braze/sg-heat1-1.png" alt="" fill style={{ objectFit: "contain" }} />
        </div>

        {/* Orange radial glow — top right */}
        <div style={{
          position: "absolute",
          top: "-10%",
          right: "5%",
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${B_ORANGE}12, transparent 65%)`,
          pointerEvents: "none",
        }} />

        {/* Purple radial glow — bottom left */}
        <div style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: 400,
          height: 400,
          background: `radial-gradient(circle, rgba(128,30,215,0.15), transparent 65%)`,
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative", zIndex: 2 }}>
          {/* Header */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              display: "inline-block",
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: B_ORANGE,
              marginBottom: 16,
            }}
          >
            Who Should Attend
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: "clamp(28px, 3.8vw, 46px)",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "white",
              margin: "0 0 52px",
            }}
          >
            Built for Senior Martech Leaders.
          </motion.h2>

          <div className="braze-attend-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
            {/* Left — description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            >
              <p style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "clamp(15px, 1.3vw, 17px)",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.75,
                margin: "0 0 20px",
              }}>
                This roundtable is designed for senior leaders who own customer engagement strategy and marketing technology decisions across the MENAT region.
              </p>
              <p style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "clamp(15px, 1.3vw, 17px)",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.75,
                margin: "0 0 36px",
              }}>
                Limited seats available. Secure your spot today.
              </p>
              <a
                href="#register"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 36px",
                  borderRadius: 50,
                  background: B_ORANGE,
                  color: "white",
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 14px 44px ${B_ORANGE}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Secure Your Spot <span>→</span>
              </a>
            </motion.div>

            {/* Right — pills */}
            <motion.div
              className="braze-attend-pills"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              {/* Group 1 */}
              <div>
                <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: B_ORANGE, margin: "0 0 12px" }}>
                  Senior leaders in
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {ROLES_GROUP_1.map((role, i) => (
                    <motion.span
                      key={role}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.35 + i * 0.05, ease: EASE }}
                      style={{
                        padding: "10px 22px",
                        borderRadius: 30,
                        border: `1px solid ${B_ORANGE}40`,
                        background: `${B_ORANGE}0C`,
                        fontFamily: FONT,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.8)",
                        transition: "all 0.25s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${B_ORANGE}20`;
                        e.currentTarget.style.borderColor = `${B_ORANGE}70`;
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `${B_ORANGE}0C`;
                        e.currentTarget.style.borderColor = `${B_ORANGE}40`;
                        e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {role}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Group 2 */}
              <div>
                <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: B_ORANGE, margin: "0 0 12px" }}>
                  Leaders responsible for
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {ROLES_GROUP_2.map((role, i) => (
                    <motion.span
                      key={role}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.55 + i * 0.05, ease: EASE }}
                      style={{
                        padding: "10px 22px",
                        borderRadius: 30,
                        border: `1px solid ${B_ORANGE}40`,
                        background: `${B_ORANGE}0C`,
                        fontFamily: FONT,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.8)",
                        transition: "all 0.25s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${B_ORANGE}20`;
                        e.currentTarget.style.borderColor = `${B_ORANGE}70`;
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `${B_ORANGE}0C`;
                        e.currentTarget.style.borderColor = `${B_ORANGE}40`;
                        e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {role}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HOSTED BY BRAZE ────────────────────────────────────────────────────────
function HostedByBraze() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="braze-section braze-section-flush" ref={ref} style={{
      padding: "0",
      position: "relative",
    }}>
      {/* White / light section */}
      <div style={{
        background: "#FAFAFA",
        position: "relative",
        overflow: "hidden",
        padding: "56px 0 72px",
      }}>
        {/* Supergraphic watermark — right */}
        <div style={{
          position: "absolute",
          top: "-40%",
          right: "-10%",
          width: "40%",
          height: "180%",
          opacity: 0.045,
          pointerEvents: "none",
        }}>
          <Image src="/braze/sg-heat1-5.png" alt="" fill style={{ objectFit: "contain" }} />
        </div>

        {/* Supergraphic watermark — left subtle */}
        <div style={{
          position: "absolute",
          bottom: "-30%",
          left: "-8%",
          width: "30%",
          height: "140%",
          opacity: 0.025,
          pointerEvents: "none",
          transform: "scaleX(-1)",
        }}>
          <Image src="/braze/sg-heat1-1.png" alt="" fill style={{ objectFit: "contain" }} />
        </div>

        {/* Purple dot grid pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(${B_PURPLE} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }} />

        {/* Purple radial glow — top left */}
        <div style={{
          position: "absolute",
          top: "-20%",
          left: "-5%",
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${B_PURPLE}0A, transparent 60%)`,
          pointerEvents: "none",
        }} />

        {/* Orange radial glow — bottom right */}
        <div style={{
          position: "absolute",
          bottom: "-10%",
          right: "5%",
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${B_ORANGE}08, transparent 60%)`,
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative", zIndex: 2 }}>
          {/* Section label above card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ textAlign: "center", marginBottom: 32 }}
          >
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: B_PURPLE,
              opacity: 0.5,
            }}>
              <span style={{ width: 20, height: 1.5, background: B_PURPLE, borderRadius: 2, opacity: 0.4 }} />
              About the Host
              <span style={{ width: 20, height: 1.5, background: B_PURPLE, borderRadius: 2, opacity: 0.4 }} />
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            style={{
              background: "white",
              borderRadius: 24,
              padding: "56px 52px",
              boxShadow: `0 2px 8px rgba(0,0,0,0.03), 0 12px 48px rgba(48,2,102,0.06)`,
              border: "1px solid rgba(128,30,215,0.05)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Gradient accent bar at top */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${B_PURPLE}, ${B_ORANGE}, ${B_RED})`,
            }} />

            {/* Subtle corner gradient */}
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 250,
              height: 250,
              background: `radial-gradient(circle at top right, ${B_PURPLE}05, transparent 70%)`,
              pointerEvents: "none",
            }} />

            <div
              className="braze-hosted-layout"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 44,
              }}
            >
              {/* Logo side */}
              <div style={{ flexShrink: 0 }}>
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 22,
                    background: `linear-gradient(150deg, ${B_DARK_PURPLE}, ${B_PURPLE})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 12px 36px ${B_PURPLE}25`,
                    position: "relative",
                  }}
                >
                  {/* Inner shimmer */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 22,
                    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
                    pointerEvents: "none",
                  }} />
                  <Image
                    src="/braze/braze-logo-white.png"
                    alt="Braze"
                    width={52}
                    height={52}
                    style={{ height: 20, width: "auto", position: "relative" }}
                  />
                </div>

              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: "clamp(28px, 3vw, 40px)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.04em",
                    color: B_DARK_PURPLE,
                    margin: "0 0 8px",
                  }}
                >
                  Braze.
                </h3>

                <p style={{
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: B_PURPLE,
                  margin: "0 0 24px",
                  opacity: 0.6,
                }}>
                  Be Absolutely Engaging.™
                </p>

                {/* Separator */}
                <div style={{
                  width: 48,
                  height: 2.5,
                  background: `linear-gradient(90deg, ${B_PURPLE}, ${B_ORANGE})`,
                  borderRadius: 2,
                  marginBottom: 24,
                }} />

                <p
                  style={{
                    fontFamily: FONT,
                    fontWeight: 400,
                    fontSize: "clamp(14.5px, 1.2vw, 16px)",
                    color: "rgba(30,0,70,0.58)",
                    lineHeight: 1.85,
                    margin: "0 0 18px",
                  }}
                >
                  Braze is the leading customer engagement platform that empowers brands to Be Absolutely Engaging.™ Braze helps brands deliver great customer experiences that drive value both for consumers and for their businesses. Built on a foundation of composable intelligence, BrazeAI™ allows marketers to combine and activate AI agents, models, and features at every touchpoint throughout the Braze Customer Engagement Platform for smarter, faster, and more meaningful customer engagement.
                </p>
                <p
                  style={{
                    fontFamily: FONT,
                    fontWeight: 400,
                    fontSize: "clamp(14.5px, 1.2vw, 16px)",
                    color: "rgba(30,0,70,0.58)",
                    lineHeight: 1.85,
                    margin: 0,
                  }}
                >
                  From cross-channel messaging and journey orchestration to AI-powered decisioning and optimization, Braze enables companies to turn action into interaction through autonomous, 1:1 personalized experiences.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}

// ─── REGISTRATION FORM ───────────────────────────────────────────────────────
function RegisterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.country === "United Arab Emirates") || COUNTRY_CODES[0]
  );
  const [codeSearch, setCodeSearch] = useState("");
  const [codeOpen, setCodeOpen] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (codeRef.current && !codeRef.current.contains(e.target as Node)) {
        setCodeOpen(false);
        setCodeSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const firstName = (data.get("firstName") as string).trim();
    const lastName = (data.get("lastName") as string).trim();
    const email = (data.get("email") as string).trim();
    const phone = (data.get("phone") as string).trim();
    const company = (data.get("company") as string).trim();
    const jobTitle = (data.get("jobTitle") as string).trim();
    const message = (data.get("message") as string).trim();

    const country = (data.get("country") as string).trim();

    if (!firstName || !lastName || !email || !phone || !company || !jobTitle || !country) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isWorkEmail(email)) {
      setError("Please use a work email address.");
      return;
    }
    const phoneErr = validatePhone(phone, selectedCountry);
    if (phoneErr) { setError(phoneErr); return; }

    setSending(true);
    const result = await submitForm({
      type: "attend",
      full_name: `${firstName} ${lastName}`.trim(),
      email,
      phone: `${selectedCountry.code} ${phone}`,
      company,
      job_title: jobTitle,
      event_name: "Braze Virtual Roundtable - MENAT",
      metadata: { ...(message ? { message } : {}), country },
    });

    setSending(false);
    if (result.success) {
      setSent(true);
      form.reset();
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: 400,
    outline: "none",
    transition: "border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: 700,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: 8,
    display: "block",
  };

  return (
    <section
      id="register"
      className="braze-section"
      ref={ref}
      style={{
        padding: "100px 0",
        background: `linear-gradient(180deg, #1a0440 0%, ${B_DARK_PURPLE} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle supergraphic */}
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "50%",
          height: "80%",
          opacity: 0.05,
          pointerEvents: "none",
          transform: "rotate(180deg)",
        }}
      >
        <Image src="/braze/sg-heat1-3.png" alt="" fill style={{ objectFit: "contain" }} />
      </div>

      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
        >
          <span style={{ width: 28, height: 2, background: B_ORANGE, borderRadius: 2 }} />
          <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: B_ORANGE }}>
            Register
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: "clamp(26px, 3.5vw, 42px)",
            lineHeight: 0.8,
            letterSpacing: "-0.04em",
            color: "white",
            margin: "0 0 12px",
          }}
        >
          Register Your Interest.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          style={{
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: 15,
            color: "rgba(255,255,255,0.5)",
            margin: "0 0 48px",
          }}
        >
          Seats are limited. Submit your details and we will confirm your participation.
        </motion.p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, ${B_ORANGE}08 100%)`,
              border: `1px solid ${B_ORANGE}30`,
              borderRadius: 20,
              padding: "80px 40px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Animated checkmark circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `${B_ORANGE}18`,
                border: `2px solid ${B_ORANGE}50`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <motion.svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.polyline
                  points="8,18 15,26 28,10"
                  stroke={B_ORANGE}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                />
              </motion.svg>
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" }}
            >
              You&apos;re In.
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              style={{ fontFamily: FONT, fontWeight: 400, fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 400, margin: "0 auto" }}
            >
              Your registration has been received. We will be in touch shortly to confirm your spot.
            </motion.p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "40px 36px",
            }}
          >
            <div className="braze-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input name="firstName" placeholder="First name" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = B_ORANGE; e.currentTarget.style.boxShadow = `0 0 0 3px ${B_ORANGE}18`; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }} />
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input name="lastName" placeholder="Last name" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = B_ORANGE; e.currentTarget.style.boxShadow = `0 0 0 3px ${B_ORANGE}18`; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }} />
              </div>
              <div>
                <label style={labelStyle}>Work Email *</label>
                <input name="email" type="email" placeholder="you@company.com" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = B_ORANGE; e.currentTarget.style.boxShadow = `0 0 0 3px ${B_ORANGE}18`; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }} />
              </div>
              <div>
                <label style={labelStyle}>Phone *</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <div ref={codeRef} style={{ position: "relative", width: 110, flexShrink: 0 }}>
                    <input
                      value={codeOpen ? codeSearch : selectedCountry.code}
                      onChange={(e) => {
                        setCodeSearch(e.target.value);
                        if (!codeOpen) setCodeOpen(true);
                      }}
                      onFocus={() => { setCodeOpen(true); setCodeSearch(""); }}
                      placeholder={selectedCountry.code}
                      style={{
                        ...inputStyle,
                        cursor: "text",
                        padding: "14px 12px",
                        borderColor: codeOpen ? B_ORANGE : "rgba(255,255,255,0.12)",
                      }}
                    />
                    {codeOpen && (
                      <div style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: 240,
                        maxHeight: 220,
                        overflowY: "auto",
                        background: B_DARK_PURPLE,
                        border: `1px solid ${B_ORANGE}40`,
                        borderRadius: 10,
                        marginTop: 4,
                        zIndex: 50,
                        boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
                      }}>
                        {COUNTRY_CODES.filter((c) => {
                          if (!codeSearch) return true;
                          const q = codeSearch.toLowerCase().replace("+", "");
                          return c.code.replace("+", "").includes(q) || c.country.toLowerCase().includes(q);
                        }).map((c) => (
                          <div
                            key={c.code + c.country}
                            onClick={() => {
                              setSelectedCountry(c);
                              setCodeOpen(false);
                              setCodeSearch("");
                            }}
                            style={{
                              padding: "10px 14px",
                              cursor: "pointer",
                              fontFamily: FONT,
                              fontSize: 13,
                              color: selectedCountry.code === c.code ? B_ORANGE : "rgba(255,255,255,0.8)",
                              background: selectedCountry.code === c.code ? `${B_ORANGE}10` : "transparent",
                              display: "flex",
                              justifyContent: "space-between",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = `${B_PURPLE}30`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = selectedCountry.code === c.code ? `${B_ORANGE}10` : "transparent"; }}
                          >
                            <span>{c.country}</span>
                            <span style={{ opacity: 0.6 }}>{c.code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    required
                    maxLength={selectedCountry.length}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = B_ORANGE; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Company *</label>
                <input name="company" placeholder="Company name" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = B_ORANGE; e.currentTarget.style.boxShadow = `0 0 0 3px ${B_ORANGE}18`; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }} />
              </div>
              <div>
                <label style={labelStyle}>Job Title *</label>
                <input name="jobTitle" placeholder="Your role" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = B_ORANGE; e.currentTarget.style.boxShadow = `0 0 0 3px ${B_ORANGE}18`; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Country *</label>
                <input name="country" placeholder="Your country" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = B_ORANGE; e.currentTarget.style.boxShadow = `0 0 0 3px ${B_ORANGE}18`; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }} />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Message (Optional)</label>
              <textarea
                name="message"
                placeholder="Anything you would like us to know..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical" as const }}
                onFocus={(e) => { e.currentTarget.style.borderColor = B_ORANGE; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              />
            </div>

            {error && (
              <p style={{ fontFamily: FONT, fontSize: 13, color: B_RED, marginBottom: 16, fontWeight: 700 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={sending}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 48px",
                borderRadius: 50,
                border: "none",
                background: sending ? "rgba(255,165,36,0.5)" : B_ORANGE,
                color: "white",
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 700,
                cursor: sending ? "not-allowed" : "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                if (!sending) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 12px 40px ${B_ORANGE}50`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {sending ? "Submitting..." : "Submit Registration"} {!sending && <span>→</span>}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function BrazeFooter() {
  return (
    <footer
      style={{
        padding: "48px 0 44px",
        background: HEAT1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Supergraphic watermark */}
      <div style={{
        position: "absolute",
        top: "-60%",
        right: "-10%",
        width: "50%",
        height: "220%",
        opacity: 0.08,
        pointerEvents: "none",
      }}>
        <Image src="/braze/sg-heat1-1.png" alt="" fill style={{ objectFit: "contain" }} />
      </div>

      {/* Warm white glow */}
      <div style={{
        position: "absolute",
        top: "-40%",
        left: "-10%",
        width: "50%",
        height: "180%",
        background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent 60%)",
        pointerEvents: "none",
      }} />

      <div
        className="braze-footer-inner"
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          padding: PAD,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Image
            src="/braze/braze-logo-white.png"
            alt="Braze"
            width={160}
            height={44}
            style={{ height: "clamp(30px, 2.8vw, 40px)", width: "auto" }}
          />
          <span style={{ width: 1, height: 22, background: "rgba(255,255,255,0.35)" }} />
          <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.85)" }}>
            Be Absolutely Engaging.™
          </span>
        </div>
        <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.7)" }}>
          © {new Date().getFullYear()} Braze, Inc. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
