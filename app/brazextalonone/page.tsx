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
const HEAT1 = `linear-gradient(135deg, ${B_PINK} 0%, ${B_ORANGE} 50%, ${B_RED} 100%)`;

// Light surfaces — derived from the Braze Zoom Background pastel composition.
const CREAM = "#FFF7EE";          // warm off-white page surface
const CREAM_PINK = "#FFF1EE";     // section variant w/ peach tint
const INK = B_DARK_PURPLE;        // primary text
const INK_SOFT = "rgba(48, 2, 102, 0.72)";
const INK_MUTED = "rgba(48, 2, 102, 0.55)";
const INK_FAINT = "rgba(48, 2, 102, 0.38)";
const LINE = "rgba(48, 2, 102, 0.14)";
const LINE_SOFT = "rgba(48, 2, 102, 0.08)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MAX_W = 1080;
const PAD = "0 clamp(20px, 4vw, 60px)";
const FONT = "'Aribau Grotesk', sans-serif";

const LOCKUP_LOGO = "https://efg-final.s3.eu-north-1.amazonaws.com/logos/brazextalon.png";
const LOCKUP_LOGO_NAV = "https://efg-final.s3.eu-north-1.amazonaws.com/logos/brazextalon1.png";

// PLACEHOLDER — swap with the real webinar date/time once confirmed.
// Format: ISO-8601 with timezone offset. Currently set to a future date so
// the countdown ticks visibly. The displayed date/time chips render "TBA"
// strings while the countdown reads from this constant.
const EVENT_DATE = new Date("2026-07-15T11:00:00+04:00");
const EVENT_DATE_LABEL = "Date TBA";
const EVENT_TIME_LABEL = "Time TBA";

// ─── Content (verbatim from brief — do not modify) ──────────────────────────
const EYEBROW = "Earned, not automated:";
const HEADLINE = "What happens to brand loyalty when AI becomes the decision-maker?";

const PARAGRAPH_1 =
  "Consumers are increasingly using AI to help them choose what to buy, which brands to trust, where to shop, and which products offer the best value. As AI assistants and agents begin comparing, recommending, filtering, and even purchasing on consumers' behalf, brands risk losing direct influence over the customer decision-making process.";

const PARAGRAPH_2_PRE =
  "In a world where algorithms prioritize convenience, price, speed, and utility, traditional drivers of loyalty are being challenged. ";
const PARAGRAPH_2_BOLD =
  "If AI becomes the first touchpoint in the customer journey, what makes a brand stand out?";
const PARAGRAPH_2_POST =
  " What happens to emotional connection, trust, and long-term loyalty when decisions are increasingly machine-assisted?";

const PARAGRAPH_3 =
  "This virtual roundtable brings together loyalty, CRM, digital, and customer experience leaders to explore how brands can stay relevant, differentiated, and trusted in an AI-mediated marketplace.";

const PARAGRAPH_4 =
  "Together, we'll discuss how organizations are rethinking loyalty, retention, personalization, and overall customer engagement for a future where consumers may not always interact with brands directly, and where loyalty must be continuously earned, not simply automated.";

const DISCUSSION_AREAS = [
  "How AI-assisted purchasing is reshaping brand loyalty and customer retention",
  "What differentiates brands when AI agents optimize for efficiency and value",
  "The evolving role of trust, personalization, and emotional connection",
  "How loyalty programs and customer engagement strategies may need to adapt",
  "What “earned loyalty” looks like in an AI-driven customer journey",
];

const CTA_LABEL = "Join the discussion";

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function Braze3LandingPage() {
  return (
    <div style={{ background: CREAM, fontFamily: FONT }}>
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
        @keyframes braze3-shimmer {
          0% { transform: translateX(-100%) rotate(15deg); }
          100% { transform: translateX(200%) rotate(15deg); }
        }
        @keyframes braze3-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(8px); opacity: 1; }
        }
        @keyframes braze3-pulse-dot {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }

        .braze3-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 10px;
          border: 1px solid ${LINE};
          background: rgba(255,255,255,0.85);
          color: ${INK};
          font-family: 'Aribau Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        .braze3-input::placeholder { color: ${INK_FAINT}; }

        /* ── Mobile (≤768) ── */
        @media (max-width: 768px) {
          .braze3-nav-links { display: none !important; }
          .braze3-nav-cta-desktop { display: none !important; }
          .braze3-nav-burger { display: flex !important; }
          .braze3-nav-logo { height: clamp(64px, 16vw, 96px) !important; width: auto !important; }

          .braze3-hero {
            min-height: 100svh !important;
            padding: 110px 18px 96px !important;
          }
          .braze3-hero-eyebrow { font-size: clamp(11px, 3vw, 14px) !important; }
          .braze3-hero h1 { font-size: clamp(30px, 8.4vw, 46px) !important; line-height: 1.1 !important; }
          .braze3-hero-subline { font-size: clamp(14px, 3.6vw, 17px) !important; line-height: 1.55 !important; }
          .braze3-hero-meta { gap: 4px !important; row-gap: 8px !important; }
          .braze3-hero-meta > span:not(:first-child) { font-size: 12px !important; }
          .braze3-scroll-indicator { display: none !important; }

          .braze3-overview { padding: 48px 0 !important; }
          .braze3-overview-body p,
          .braze3-overview-body .braze3-pullquote {
            font-size: clamp(14px, 3.8vw, 16px) !important;
          }
          .braze3-overview-eyebrow { font-size: clamp(10px, 2.6vw, 11px) !important; }
          .braze3-overview h2 { font-size: clamp(24px, 6.5vw, 34px) !important; }

          .braze3-areas { padding: 48px 0 !important; }
          .braze3-areas h2 { font-size: clamp(24px, 6.5vw, 34px) !important; }
          .braze3-area-row { padding: 12px 16px !important; gap: 12px !important; }
          .braze3-area-row .braze3-area-plinth { width: 34px !important; height: 34px !important; }
          .braze3-area-row .braze3-area-num { font-size: 13px !important; }
          .braze3-area-row .braze3-area-chevron { width: 16px !important; height: 16px !important; }
          .braze3-area-row .braze3-area-text { font-size: clamp(13px, 3.4vw, 15px) !important; }

          .braze3-hosted { padding: 48px 0 !important; }
          .braze3-hosted-card { padding: 36px 20px !important; }
          .braze3-hosted-logo-wrap { padding: 28px 20px !important; }
          .braze3-hosted h3 { font-size: clamp(18px, 4.6vw, 22px) !important; }

          .braze3-register { padding: 48px 0 !important; }
          .braze3-register h2 { font-size: clamp(26px, 6.8vw, 38px) !important; }
          .braze3-form-grid { grid-template-columns: 1fr !important; }
          .braze3-form-container { padding: 28px 20px !important; }

          .braze3-footer-inner { flex-direction: column !important; text-align: center !important; gap: 14px !important; }
          .braze3-footer { padding: 6px 0 6px !important; }
        }

        /* ── Small mobile (≤480) ── */
        @media (max-width: 480px) {
          .braze3-hero { padding: 100px 14px 88px !important; min-height: 100svh !important; }
          .braze3-hero-supergraphic { opacity: 0.6 !important; }
          .braze3-hero h1 { font-size: clamp(26px, 8vw, 36px) !important; }
          .braze3-hero-subline { font-size: 14px !important; }
          .braze3-hero-meta > span:not(:first-child) { font-size: 11px !important; }
          .braze3-overview { padding: 40px 0 !important; }
          .braze3-overview h2 { font-size: clamp(22px, 6vw, 28px) !important; }
          .braze3-pullquote { padding: 26px 30px 26px 46px !important; }
          .braze3-areas { padding: 40px 0 !important; }
          .braze3-areas h2 { font-size: clamp(22px, 6vw, 28px) !important; }
          .braze3-area-row { padding: 10px 14px !important; gap: 10px !important; }
          .braze3-area-row .braze3-area-plinth { width: 32px !important; height: 32px !important; }
          .braze3-area-row .braze3-area-num { font-size: 12px !important; }
          .braze3-hosted { padding: 40px 0 !important; }
          .braze3-hosted-card { padding: 28px 16px !important; gap: 18px !important; }
          .braze3-hosted-logo-wrap { padding: 20px 16px !important; }
          .braze3-register { padding: 40px 0 !important; }
          .braze3-form-container { padding: 22px 16px !important; }
          .braze3-footer { padding: 12px 0 !important; }
          .braze3-footer-inner { padding: 0 16px !important; }
        }

        .braze3-country-dropdown::-webkit-scrollbar { width: 6px; }
        .braze3-country-dropdown::-webkit-scrollbar-track { background: transparent; }
        .braze3-country-dropdown::-webkit-scrollbar-thumb { background: ${LINE}; border-radius: 3px; }
        .braze3-country-dropdown::-webkit-scrollbar-thumb:hover { background: ${INK_FAINT}; }
      `}</style>

      <BrazeNav />
      <HeroSection />
      <OverviewSection />
      <DiscussionAreasSection />
      <HostedBySection />
      <RegisterSection />
      <BrazeFooter />
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#areas", label: "Discussion areas" },
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
        className="braze3-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          background: scrolled ? "rgba(255, 247, 238, 0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${LINE_SOFT}` : "1px solid transparent",
          height: scrolled ? 60 : 72,
          display: "flex",
          alignItems: "center",
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
            width: "100%",
            overflow: "visible",
          }}
        >
          {/* Co-branded Braze x Talon lockup */}
          <span
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Image
              src={LOCKUP_LOGO_NAV}
              alt="Braze x Talon"
              width={320}
              height={68}
              className="braze3-nav-logo"
              style={{ height: "clamp(84px, 9.5vw, 124px)", width: "auto" }}
              priority
              unoptimized
            />
          </span>

          {/* Desktop nav links */}
          <div
            className="braze3-nav-links"
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
                  fontSize: 14,
                  fontWeight: 600,
                  color: INK,
                  textDecoration: "none",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            className="braze3-nav-cta-desktop"
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
            {CTA_LABEL}
          </a>

          {/* Mobile burger */}
          <button
            className="braze3-nav-burger"
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
              style={{ position: "absolute", width: 22, height: 1.5, background: INK, borderRadius: 2 }}
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 0 : -6 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              style={{ position: "absolute", width: 22, height: 1.5, background: INK, borderRadius: 2 }}
              animate={{ opacity: mobileOpen ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              style={{ position: "absolute", width: 22, height: 1.5, background: INK, borderRadius: 2 }}
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
              background: "rgba(255, 247, 238, 0.98)",
              backdropFilter: "blur(30px)",
            }}
          >
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
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={INK} strokeWidth="1.5">
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
                  color: INK,
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
                background: B_PURPLE,
                color: "white",
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {CTA_LABEL}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── COUNTDOWN TIMER ────────────────────────────────────────────────────────
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    function calc() {
      const now = Date.now();
      const diff = EVENT_DATE.getTime() - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }
    setTimeLeft(calc());
    const t = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(t);
  }, []);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 28,
        padding: "12px 20px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${LINE}`,
        boxShadow: "0 4px 22px rgba(48,2,102,0.06)",
        alignSelf: "flex-start",
        width: "fit-content",
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: 10,
          fontWeight: 700,
          color: INK_MUTED,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginRight: 4,
        }}
      >
        Starts in
      </span>
      {units.map((u, i) => (
        <React.Fragment key={u.label}>
          {i > 0 && (
            <span style={{ color: INK_FAINT, fontWeight: 700, fontSize: 14 }}>:</span>
          )}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 18,
                color: INK,
                lineHeight: 1,
              }}
            >
              {mounted ? String(u.value).padStart(2, "0") : "--"}
            </span>
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 7,
                color: INK_FAINT,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginTop: 2,
              }}
            >
              {u.label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </motion.div>
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
      className="braze3-hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: CREAM,
        overflow: "hidden",
        padding: "120px clamp(20px, 4vw, 60px) 100px",
      }}
    >
      {/* Braze Zoom Background — full-bleed, with parallax. Replace src
          with the S3 URL once provided. */}
      <motion.div
        className="braze3-hero-supergraphic"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          y: supergraphicY,
          scale: supergraphicScale,
        }}
      >
        <Image
          src="/brazextalonone/hero-bg.png"
          alt=""
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </motion.div>


      {/* Grain texture for premium depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          pointerEvents: "none",
          zIndex: 2,
          mixBlendMode: "multiply",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Content */}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}
        >
          {/* Webinar chip */}
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              alignSelf: "flex-start",
              padding: "8px 16px",
              borderRadius: 50,
              border: `1px solid ${LINE}`,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              color: INK,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              marginBottom: 28,
              boxShadow: "0 2px 14px rgba(48,2,102,0.06)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: B_RED,
                animation: "braze3-pulse-dot 2.4s ease-in-out infinite",
              }}
            />
            Webinar
          </motion.span>

          {/* Eyebrow — "Earned, not automated:" */}
          <motion.span
            className="braze3-hero-eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
            style={{
              fontFamily: FONT,
              fontSize: "clamp(13px, 1.2vw, 16px)",
              fontWeight: 700,
              color: B_RED,
              letterSpacing: "0.04em",
              textTransform: "none",
              marginBottom: 18,
              display: "inline-block",
            }}
          >
            {EYEBROW}
          </motion.span>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: "clamp(30px, 4.4vw, 60px)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: INK,
              margin: "0 0 28px",
              maxWidth: 760,
            }}
          >
            {HEADLINE}
          </motion.h1>

          {/* Subline pulled from paragraph 3 — already in user-provided content */}
          <motion.p
            className="braze3-hero-subline"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            style={{
              fontFamily: FONT,
              fontSize: "clamp(15px, 1.2vw, 18px)",
              fontWeight: 400,
              lineHeight: 1.55,
              color: INK_SOFT,
              margin: "0 0 28px",
              maxWidth: 620,
            }}
          >
            {PARAGRAPH_3}
          </motion.p>

          {/* Event details strip — placeholder until confirmed */}
          <motion.div
            className="braze3-hero-meta"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              marginBottom: 28,
              flexWrap: "wrap",
            }}
          >
            {[
              {
                icon: (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="3" width="12" height="11" rx="1.5" stroke={INK} strokeWidth="1.2" />
                    <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                ),
                text: EVENT_DATE_LABEL,
              },
              {
                icon: (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke={INK} strokeWidth="1.2" />
                    <path d="M8 4.5V8l2.5 1.5" stroke={INK} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                text: EVENT_TIME_LABEL,
              },
              {
                icon: (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="3" width="12" height="9" rx="1.5" stroke={INK} strokeWidth="1.2" />
                    <circle cx="8" cy="7.5" r="2" stroke={INK} strokeWidth="1.2" />
                  </svg>
                ),
                text: "Virtual",
              },
            ].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span style={{ width: 1, height: 16, background: LINE, margin: "0 16px" }} />
                )}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: FONT,
                    fontSize: 14,
                    fontWeight: 600,
                    color: INK,
                    letterSpacing: "0.01em",
                  }}
                >
                  {item.icon}
                  {item.text}
                </span>
              </React.Fragment>
            ))}
          </motion.div>

          {/* Countdown */}
          <CountdownTimer />

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
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
              {CTA_LABEL}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

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
                color: INK_SOFT,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "color 0.3s ease",
                borderBottom: `1px solid ${LINE}`,
                paddingBottom: 2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = INK;
                e.currentTarget.style.borderBottomColor = INK;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = INK_SOFT;
                e.currentTarget.style.borderBottomColor = LINE;
              }}
            >
              Read overview
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="braze3-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
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
          background: `linear-gradient(to bottom, transparent, ${INK_FAINT})`,
        }} />
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{ animation: "braze3-bounce 2.5s ease-in-out infinite" }}
        >
          <path d="M2 4l4 4 4-4" stroke={INK_FAINT} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}

// ─── OVERVIEW ───────────────────────────────────────────────────────────────
function OverviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="overview"
      className="braze3-overview"
      ref={ref}
      style={{
        padding: "72px 0",
        background: CREAM,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative supergraphic, low opacity */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "-12%",
          width: "45%",
          height: "70%",
          opacity: 0.18,
          pointerEvents: "none",
        }}
      >
        <Image src="/braze/sg-heat1-3.png" alt="" fill style={{ objectFit: "contain" }} />
      </div>

      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative", zIndex: 2 }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
        >
          <span style={{ width: 28, height: 2, background: B_RED, borderRadius: 2 }} />
          <span
            className="braze3-overview-eyebrow"
            style={{
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: B_RED,
            }}
          >
            The conversation
          </span>
        </motion.div>

        {/* Section title — echoes the eyebrow */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: "clamp(28px, 3.6vw, 44px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: INK,
            margin: "0 0 28px",
            maxWidth: 760,
          }}
        >
          {EYEBROW}
        </motion.h2>

        {/* Body paragraphs */}
        <div
          className="braze3-overview-body"
          style={{ maxWidth: 780, display: "flex", flexDirection: "column", gap: 24 }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            style={{
              fontFamily: FONT,
              fontSize: "clamp(15px, 1.15vw, 17px)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: INK_SOFT,
              margin: 0,
            }}
          >
            {PARAGRAPH_1}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
            style={{
              fontFamily: FONT,
              fontSize: "clamp(15px, 1.15vw, 17px)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: INK_SOFT,
              margin: 0,
            }}
          >
            {PARAGRAPH_2_PRE}
            <strong style={{ color: INK, fontWeight: 900, letterSpacing: "-0.005em" }}>
              {PARAGRAPH_2_BOLD}
            </strong>
            {PARAGRAPH_2_POST}
          </motion.p>

          {/* Paragraph 3 elevated as pull quote — content unchanged, skeumorphic treatment */}
          <motion.div
            className="braze3-pullquote"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.34, ease: EASE }}
            style={{
              position: "relative",
              padding: "34px 40px 34px 56px",
              borderRadius: 20,
              background: `
                radial-gradient(ellipse 80% 60% at 22% 8%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 28%, transparent 60%),
                radial-gradient(ellipse 70% 55% at 92% 100%, ${B_PINK}26 0%, ${B_PINK}0d 35%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 100% 0%, ${B_ORANGE}14 0%, transparent 55%),
                linear-gradient(168deg, #FFFFFF 0%, #FFFBF8 45%, #FFF0EC 100%)
              `,
              border: "1px solid rgba(48, 2, 102, 0.08)",
              boxShadow: `
                0 1.5px 0 0 rgba(255,255,255,1) inset,
                0 -1.5px 0 0 rgba(48,2,102,0.05) inset,
                0 0 0 1px rgba(255,255,255,0.6) inset,
                0 1px 3px rgba(48,2,102,0.04),
                0 22px 56px rgba(48,2,102,0.09),
                0 0 80px ${B_PINK}26
              `,
              marginTop: 16,
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            {/* Paper-texture noise overlay */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.05,
                pointerEvents: "none",
                mixBlendMode: "multiply",
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: "128px 128px",
                borderRadius: "inherit",
              }}
            />

            {/* Top specular highlight hairline */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 50%, transparent)",
                pointerEvents: "none",
              }}
            />

            {/* Embossed channel — recessed groove behind the rail */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 28,
                bottom: 28,
                left: 26,
                width: 8,
                borderRadius: 6,
                background: "rgba(48, 2, 102, 0.04)",
                boxShadow: `
                  inset 1px 0 0 rgba(48,2,102,0.08),
                  inset -1px 0 0 rgba(255,255,255,0.8)
                `,
              }}
            />

            {/* Heat-gradient rail — sits in the channel with its own glow */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 30,
                bottom: 30,
                left: 28,
                width: 4,
                borderRadius: 4,
                background: HEAT1,
                boxShadow: `
                  0 0 14px ${B_PINK}aa,
                  0 0 28px ${B_ORANGE}55,
                  inset 0 1px 0 rgba(255,255,255,0.7)
                `,
              }}
            />

            {/* Opening quote ornament in heat gradient */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 14,
                right: 30,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 64,
                lineHeight: 1,
                color: "transparent",
                background: HEAT1,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                opacity: 0.22,
                letterSpacing: "-0.05em",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              &ldquo;
            </span>

            <p
              style={{
                fontFamily: FONT,
                fontSize: "clamp(15px, 1.2vw, 18px)",
                fontWeight: 500,
                lineHeight: 1.6,
                color: INK,
                margin: 0,
                position: "relative",
                zIndex: 2,
                textShadow: "0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              {PARAGRAPH_3}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.42, ease: EASE }}
            style={{
              fontFamily: FONT,
              fontSize: "clamp(15px, 1.15vw, 17px)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: INK_SOFT,
              margin: 0,
            }}
          >
            {PARAGRAPH_4}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// ─── DISCUSSION AREAS ───────────────────────────────────────────────────────
function DiscussionAreasSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="areas"
      className="braze3-areas"
      ref={ref}
      style={{
        padding: "72px 0",
        background: CREAM_PINK,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative supergraphic, low opacity */}
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-15%",
          width: "55%",
          height: "100%",
          opacity: 0.18,
          pointerEvents: "none",
          transform: "rotate(180deg)",
        }}
      >
        <Image src="/braze/sg-heat1-1.png" alt="" fill style={{ objectFit: "contain" }} />
      </div>

      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
        >
          <span style={{ width: 28, height: 2, background: B_RED, borderRadius: 2 }} />
          <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: B_RED }}>
            Discussion areas
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: "clamp(28px, 3.6vw, 44px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: INK,
            margin: "0 0 14px",
            maxWidth: 760,
          }}
        >
          Key discussion areas include:
        </motion.h2>

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {DISCUSSION_AREAS.map((text, i) => {
            const restShadow = `
              0 2px 0 0 rgba(255,255,255,1) inset,
              0 -1.5px 0 0 rgba(48,2,102,0.06) inset,
              1px 0 0 0 rgba(255,255,255,0.8) inset,
              -1px 0 0 0 rgba(48,2,102,0.04) inset,
              0 0 0 1px rgba(255,255,255,0.6) inset,
              0 1px 2px rgba(48,2,102,0.04),
              0 6px 16px rgba(48,2,102,0.06),
              0 18px 42px rgba(48,2,102,0.1),
              0 0 56px ${B_PINK}2e
            `;
            const hoverShadow = `
              0 2px 0 0 rgba(255,255,255,1) inset,
              0 -1.5px 0 0 rgba(48,2,102,0.07) inset,
              1px 0 0 0 rgba(255,255,255,0.9) inset,
              -1px 0 0 0 rgba(48,2,102,0.05) inset,
              0 0 0 1px rgba(255,255,255,0.75) inset,
              0 2px 4px rgba(48,2,102,0.05),
              0 10px 22px rgba(48,2,102,0.08),
              0 26px 56px rgba(48,2,102,0.13),
              0 0 72px ${B_PINK}4a
            `;
            return (
              <motion.div
                key={i}
                className="braze3-area-row"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.07, ease: EASE }}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "16px 24px",
                  borderRadius: 14,
                  background: `
                    radial-gradient(ellipse 70% 55% at 18% 6%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 28%, transparent 62%),
                    radial-gradient(ellipse 65% 55% at 96% 100%, ${B_PINK}26 0%, ${B_PINK}0d 35%, transparent 62%),
                    radial-gradient(ellipse 45% 38% at 100% 0%, ${B_ORANGE}14 0%, transparent 58%),
                    linear-gradient(166deg, #FFFFFF 0%, #FFFBF8 55%, #FFF0EC 100%)
                  `,
                  border: "1px solid rgba(48, 2, 102, 0.08)",
                  boxShadow: restShadow,
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "default",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(6px) translateY(-2px) scale(1.005)";
                  e.currentTarget.style.boxShadow = hoverShadow;
                  e.currentTarget.style.borderColor = `${B_RED}3d`;
                  const chev = e.currentTarget.querySelector(".braze3-area-chevron") as HTMLElement | null;
                  if (chev) { chev.style.transform = "translateX(4px)"; chev.style.opacity = "1"; }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0) translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = restShadow;
                  e.currentTarget.style.borderColor = "rgba(48, 2, 102, 0.08)";
                  const chev = e.currentTarget.querySelector(".braze3-area-chevron") as HTMLElement | null;
                  if (chev) { chev.style.transform = "translateX(0)"; chev.style.opacity = "0.55"; }
                }}
              >
                {/* Top specular highlight hairline */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "8%",
                    right: "8%",
                    height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 50%, transparent)",
                    pointerEvents: "none",
                    zIndex: 3,
                  }}
                />

                {/* Bottom seal hairline */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "15%",
                    right: "15%",
                    height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(48,2,102,0.08) 50%, transparent)",
                    pointerEvents: "none",
                    zIndex: 3,
                  }}
                />

                {/* Top-left heat dot ornament */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 12,
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: HEAT1,
                    boxShadow: `0 0 10px ${B_PINK}80, 0 0 18px ${B_ORANGE}40, inset 0 1px 0 rgba(255,255,255,0.5)`,
                    pointerEvents: "none",
                    zIndex: 3,
                  }}
                />

                {/* Paper-texture noise overlay */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.045,
                    pointerEvents: "none",
                    mixBlendMode: "multiply",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: "128px 128px",
                    borderRadius: "inherit",
                  }}
                />

                {/* Embossed disc plinth holding the number */}
                <div
                  className="braze3-area-plinth"
                  style={{
                    position: "relative",
                    zIndex: 2,
                    flexShrink: 0,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `
                      radial-gradient(circle at 32% 28%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.35) 38%, transparent 65%),
                      radial-gradient(circle at 70% 82%, ${B_PINK}22 0%, transparent 65%),
                      linear-gradient(155deg, #FFF8F3 0%, #FFEDE2 100%)
                    `,
                    boxShadow: `
                      0 1px 0 rgba(255,255,255,1) inset,
                      0 -1px 0 rgba(48,2,102,0.08) inset,
                      0 0 0 1px rgba(48,2,102,0.06) inset,
                      0 2px 4px rgba(48,2,102,0.06) inset,
                      0 1px 1px rgba(255,255,255,0.9),
                      0 4px 10px rgba(48,2,102,0.06),
                      0 0 18px ${B_PINK}33
                    `,
                  }}
                >
                  {/* Plinth specular arc */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 2,
                      left: "22%",
                      right: "22%",
                      height: 5,
                      borderRadius: "50%",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0))",
                      filter: "blur(1.5px)",
                      pointerEvents: "none",
                    }}
                  />
                  <span
                    className="braze3-area-num"
                    style={{
                      fontFamily: FONT,
                      fontWeight: 900,
                      fontSize: 16,
                      color: "transparent",
                      background: HEAT1,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                      position: "relative",
                      zIndex: 2,
                      filter: `drop-shadow(0 1px 0 rgba(255,255,255,0.9)) drop-shadow(0 1.5px 3px ${B_ORANGE}55)`,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <span
                  className="braze3-area-text"
                  style={{
                    fontFamily: FONT,
                    fontSize: "clamp(15px, 1.15vw, 17px)",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    color: INK,
                    position: "relative",
                    zIndex: 2,
                    textShadow: "0 1px 0 rgba(255,255,255,0.7), 0 0 1px rgba(255,255,255,0.4)",
                    flex: 1,
                  }}
                >
                  {text}
                </span>

                {/* Embossed chevron indicator on the right */}
                <span
                  className="braze3-area-chevron"
                  aria-hidden
                  style={{
                    position: "relative",
                    zIndex: 2,
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.55,
                    transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M4 2l5 5-5 5"
                      stroke="url(#braze3-chevron-grad)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: `drop-shadow(0 1px 0 rgba(255,255,255,0.8))` }}
                    />
                    <defs>
                      <linearGradient id="braze3-chevron-grad" x1="0" y1="0" x2="14" y2="14" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor={B_PINK} />
                        <stop offset="0.5" stopColor={B_ORANGE} />
                        <stop offset="1" stopColor={B_RED} />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── HOSTED BY ──────────────────────────────────────────────────────────────
function HostedBySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="braze3-hosted"
      ref={ref}
      style={{
        padding: "72px 0",
        background: CREAM,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="braze3-hosted-card"
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            padding: "44px 40px",
            borderRadius: 24,
            background: `
              radial-gradient(ellipse 80% 60% at 22% 8%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 28%, transparent 60%),
              radial-gradient(ellipse 70% 55% at 92% 100%, ${B_PINK}26 0%, ${B_PINK}0d 35%, transparent 60%),
              radial-gradient(ellipse 45% 38% at 100% 0%, ${B_ORANGE}14 0%, transparent 58%),
              linear-gradient(168deg, #FFFFFF 0%, #FFFBF8 45%, #FFF0EC 100%)
            `,
            border: "1px solid rgba(48, 2, 102, 0.08)",
            boxShadow: `
              0 2px 0 0 rgba(255,255,255,1) inset,
              0 -1.5px 0 0 rgba(48,2,102,0.06) inset,
              1px 0 0 0 rgba(255,255,255,0.8) inset,
              -1px 0 0 0 rgba(48,2,102,0.04) inset,
              0 0 0 1px rgba(255,255,255,0.6) inset,
              0 1px 3px rgba(48,2,102,0.04),
              0 24px 60px rgba(48,2,102,0.1),
              0 0 96px ${B_PINK}33
            `,
            overflow: "hidden",
          }}
        >
          {/* Paper-texture noise overlay */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.045,
              pointerEvents: "none",
              mixBlendMode: "multiply",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
              borderRadius: "inherit",
            }}
          />

          {/* Top heat-gradient rail */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: 3,
              background: HEAT1,
              borderRadius: 3,
              opacity: 0.95,
              boxShadow: `0 0 12px ${B_PINK}66, 0 1px 0 rgba(255,255,255,0.4) inset`,
            }}
          />

          {/* Top specular hairline below the rail */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 4,
              left: "14%",
              right: "14%",
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 50%, transparent)",
              pointerEvents: "none",
            }}
          />

          {/* Bottom seal hairline */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              left: "18%",
              right: "18%",
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(48,2,102,0.1) 50%, transparent)",
              pointerEvents: "none",
            }}
          />

          {/* Corner heat-dot ornaments */}
          {[
            { top: 14, left: 16 },
            { top: 14, right: 16 },
          ].map((pos, k) => (
            <span
              key={k}
              aria-hidden
              style={{
                position: "absolute",
                ...pos,
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: HEAT1,
                boxShadow: `0 0 10px ${B_PINK}99, 0 0 18px ${B_ORANGE}40, inset 0 1px 0 rgba(255,255,255,0.6)`,
                zIndex: 3,
              }}
            />
          ))}

          {/* Soft ambient pink wash */}
          <div
            style={{
              position: "absolute",
              top: "-40%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: B_PINK,
              opacity: 0.14,
              filter: "blur(140px)",
              pointerEvents: "none",
            }}
          />

          {/* "Hosted by" label with engraved channel */}
          <span
            style={{
              position: "relative",
              zIndex: 2,
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: INK_MUTED,
              textShadow: "0 1px 0 rgba(255,255,255,0.7)",
              paddingBottom: 10,
              borderBottom: "1px solid rgba(48,2,102,0.08)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            Hosted by
          </span>

          {/* Embossed plaque holding the logo */}
          <div
            className="braze3-hosted-logo-wrap"
            style={{
              position: "relative",
              zIndex: 2,
              padding: "32px 44px",
              borderRadius: 20,
              background: `
                radial-gradient(ellipse 70% 50% at 25% 10%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 35%, transparent 65%),
                linear-gradient(160deg, #FFFFFF 0%, #FFFAF5 100%)
              `,
              border: "1px solid rgba(48, 2, 102, 0.07)",
              boxShadow: `
                0 2px 0 0 rgba(255,255,255,1) inset,
                0 -1px 0 0 rgba(48,2,102,0.05) inset,
                0 0 0 1px rgba(255,255,255,0.7) inset,
                inset 0 1px 3px rgba(48,2,102,0.05),
                0 1px 1px rgba(255,255,255,0.9),
                0 8px 22px rgba(48,2,102,0.08),
                0 18px 42px rgba(48,2,102,0.06),
                0 0 36px ${B_PINK}26
              `,
              overflow: "hidden",
            }}
          >
            {/* Plaque specular arc */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 4,
                left: "25%",
                right: "25%",
                height: 10,
                borderRadius: "50%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0))",
                filter: "blur(3px)",
                pointerEvents: "none",
              }}
            />
            <Image
              src={LOCKUP_LOGO_NAV}
              alt="Braze x Talon"
              width={420}
              height={80}
              style={{ height: "auto", width: "100%", maxWidth: 360, display: "block", position: "relative", zIndex: 2 }}
              unoptimized
            />
          </div>

          <h3
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: "clamp(16px, 1.5vw, 20px)",
              color: INK,
              margin: 0,
              textAlign: "center",
              maxWidth: 560,
              lineHeight: 1.45,
              position: "relative",
              zIndex: 2,
              textShadow: "0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            A virtual roundtable for loyalty, CRM, digital, and customer experience leaders.
          </h3>
        </motion.div>
      </div>
    </section>
  );
}

// ─── REGISTER ────────────────────────────────────────────────────────────────
function RegisterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [mounted, setMounted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    () => COUNTRY_CODES.find((c) => c.name === "United Arab Emirates") || COUNTRY_CODES[0]
  );
  const [codeSearch, setCodeSearch] = useState("");
  const [codeOpen, setCodeOpen] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

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
    const country = (data.get("country") as string).trim();
    const message = (data.get("message") as string).trim();

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
      event_name: "Braze x Talon Virtual Roundtable — Earned, not automated",
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

  const inputBaseShadow = `
    inset 0 1.5px 3px rgba(48,2,102,0.06),
    inset 0 -1px 0 rgba(255,255,255,0.6),
    0 1px 0 rgba(255,255,255,0.8)
  `;
  const inputFocusShadow = `
    inset 0 1.5px 3px rgba(48,2,102,0.04),
    0 0 0 3px ${B_RED}1f,
    0 1px 0 rgba(255,255,255,0.8)
  `;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 10,
    border: "1px solid rgba(48,2,102,0.1)",
    background: "#FFFDFB",
    color: INK,
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: 400,
    outline: "none",
    boxShadow: inputBaseShadow,
    transition: "border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: 700,
    color: INK_MUTED,
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: 8,
    display: "block",
    textShadow: "0 1px 0 rgba(255,255,255,0.7)",
  };

  return (
    <section
      id="register"
      className="braze3-register"
      ref={ref}
      style={{
        padding: "72px 0",
        background: CREAM_PINK,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "45%",
          height: "80%",
          opacity: 0.18,
          pointerEvents: "none",
        }}
      >
        <Image src="/braze/sg-heat1-5.png" alt="" fill style={{ objectFit: "contain" }} />
      </div>

      <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: PAD, position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
        >
          <span style={{ width: 28, height: 2, background: B_RED, borderRadius: 2 }} />
          <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: B_RED }}>
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
            fontSize: "clamp(28px, 3.8vw, 46px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: INK,
            margin: "0 0 14px",
          }}
        >
          {CTA_LABEL}.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          style={{
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: 15,
            color: INK_MUTED,
            margin: "0 0 32px",
            maxWidth: 520,
          }}
        >
          Submit your details and we will confirm your participation.
        </motion.p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              background: `linear-gradient(135deg, #ffffff 0%, ${B_RED}0a 100%)`,
              border: `1px solid ${B_RED}30`,
              boxShadow: "0 10px 40px rgba(48,2,102,0.06)",
              borderRadius: 20,
              padding: "80px 40px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `${B_RED}10`,
                border: `2px solid ${B_RED}40`,
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
                  stroke={B_RED}
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
              style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: INK, margin: "0 0 12px", letterSpacing: "-0.02em" }}
            >
              You&apos;re in.
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              style={{ fontFamily: FONT, fontWeight: 400, fontSize: 15, color: INK_SOFT, maxWidth: 400, margin: "0 auto" }}
            >
              Your registration has been received. We will be in touch shortly to confirm your spot.
            </motion.p>
          </motion.div>
        ) : (
          <motion.form
            className="braze3-form-container"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            style={{
              position: "relative",
              background: `
                radial-gradient(ellipse 80% 60% at 22% 6%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 28%, transparent 60%),
                radial-gradient(ellipse 70% 55% at 92% 100%, ${B_PINK}1f 0%, ${B_PINK}0a 35%, transparent 60%),
                radial-gradient(ellipse 45% 38% at 100% 0%, ${B_ORANGE}10 0%, transparent 58%),
                linear-gradient(168deg, #FFFFFF 0%, #FFFBF8 45%, #FFF0EC 100%)
              `,
              border: "1px solid rgba(48, 2, 102, 0.08)",
              boxShadow: `
                0 2px 0 0 rgba(255,255,255,1) inset,
                0 -1.5px 0 0 rgba(48,2,102,0.06) inset,
                1px 0 0 0 rgba(255,255,255,0.8) inset,
                -1px 0 0 0 rgba(48,2,102,0.04) inset,
                0 0 0 1px rgba(255,255,255,0.6) inset,
                0 1px 3px rgba(48,2,102,0.04),
                0 28px 64px rgba(48,2,102,0.1),
                0 0 96px ${B_PINK}2a
              `,
              borderRadius: 22,
              padding: "44px 40px",
              overflow: "hidden",
            }}
          >
            {/* Paper-texture noise overlay */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.04,
                pointerEvents: "none",
                mixBlendMode: "multiply",
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: "128px 128px",
                borderRadius: "inherit",
                zIndex: 0,
              }}
            />

            {/* Top heat-gradient rail */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: 3,
                background: HEAT1,
                borderRadius: 3,
                opacity: 0.95,
                boxShadow: `0 0 12px ${B_PINK}66, 0 1px 0 rgba(255,255,255,0.4) inset`,
                zIndex: 3,
              }}
            />

            {/* Top specular hairline */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 4,
                left: "14%",
                right: "14%",
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 50%, transparent)",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />

            {/* Corner heat-dot ornaments */}
            {[
              { top: 14, left: 16 },
              { top: 14, right: 16 },
            ].map((pos, k) => (
              <span
                key={k}
                aria-hidden
                style={{
                  position: "absolute",
                  ...pos,
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: HEAT1,
                  boxShadow: `0 0 10px ${B_PINK}99, 0 0 18px ${B_ORANGE}40, inset 0 1px 0 rgba(255,255,255,0.6)`,
                  zIndex: 3,
                }}
              />
            ))}

            {/* Content above the overlays */}
            <div style={{ position: "relative", zIndex: 2 }}>
            <div className="braze3-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>First name *</label>
                <input name="firstName" placeholder="First name" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = B_RED; e.currentTarget.style.boxShadow = inputFocusShadow; e.currentTarget.style.background = "#FFFAF6"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(48,2,102,0.1)"; e.currentTarget.style.boxShadow = inputBaseShadow; e.currentTarget.style.background = "#FFFDFB"; }} />
              </div>
              <div>
                <label style={labelStyle}>Last name *</label>
                <input name="lastName" placeholder="Last name" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = B_RED; e.currentTarget.style.boxShadow = inputFocusShadow; e.currentTarget.style.background = "#FFFAF6"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(48,2,102,0.1)"; e.currentTarget.style.boxShadow = inputBaseShadow; e.currentTarget.style.background = "#FFFDFB"; }} />
              </div>
              <div>
                <label style={labelStyle}>Work email *</label>
                <input name="email" type="email" placeholder="you@company.com" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = B_RED; e.currentTarget.style.boxShadow = inputFocusShadow; e.currentTarget.style.background = "#FFFAF6"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(48,2,102,0.1)"; e.currentTarget.style.boxShadow = inputBaseShadow; e.currentTarget.style.background = "#FFFDFB"; }} />
              </div>
              <div>
                <label style={labelStyle}>Phone *</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <div ref={codeRef} style={{ position: "relative", width: 110, flexShrink: 0 }}>
                    <input
                      value={mounted ? (codeOpen ? codeSearch : selectedCountry.code) : ""}
                      onChange={(e) => {
                        setCodeSearch(e.target.value);
                        if (!codeOpen) setCodeOpen(true);
                      }}
                      onFocus={() => { setCodeOpen(true); setCodeSearch(""); }}
                      placeholder={mounted ? selectedCountry.code : "+971"}
                      style={{
                        ...inputStyle,
                        cursor: "text",
                        padding: "14px 12px",
                        borderColor: codeOpen ? B_RED : "rgba(48,2,102,0.1)",
                        boxShadow: codeOpen ? inputFocusShadow : inputBaseShadow,
                      }}
                    />
                    {codeOpen && (
                      <div
                        className="braze3-country-dropdown"
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          width: 240,
                          maxHeight: 220,
                          overflowY: "scroll",
                          WebkitOverflowScrolling: "touch",
                          background: "#ffffff",
                          border: `1px solid ${B_RED}40`,
                          borderRadius: 10,
                          marginTop: 4,
                          zIndex: 999,
                          boxShadow: "0 12px 36px rgba(48,2,102,0.16)",
                        }}
                      >
                        {COUNTRY_CODES.filter((c) => {
                          if (!codeSearch) return true;
                          const q = codeSearch.toLowerCase().replace("+", "");
                          return c.code.replace("+", "").includes(q) || c.name.toLowerCase().includes(q);
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
                              color: selectedCountry.code === c.code && selectedCountry.country === c.country ? B_RED : INK_SOFT,
                              background: selectedCountry.code === c.code && selectedCountry.country === c.country ? `${B_RED}10` : "transparent",
                              display: "flex",
                              justifyContent: "space-between",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = `${B_PINK}25`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = selectedCountry.code === c.code && selectedCountry.country === c.country ? `${B_RED}10` : "transparent"; }}
                          >
                            <span>{c.name}</span>
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
                    onFocus={(e) => { e.currentTarget.style.borderColor = B_RED; e.currentTarget.style.boxShadow = inputFocusShadow; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(48,2,102,0.1)"; e.currentTarget.style.boxShadow = inputBaseShadow; }}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Company *</label>
                <input name="company" placeholder="Company name" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = B_RED; e.currentTarget.style.boxShadow = inputFocusShadow; e.currentTarget.style.background = "#FFFAF6"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(48,2,102,0.1)"; e.currentTarget.style.boxShadow = inputBaseShadow; e.currentTarget.style.background = "#FFFDFB"; }} />
              </div>
              <div>
                <label style={labelStyle}>Job title *</label>
                <input name="jobTitle" placeholder="Your role" required style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = B_RED; e.currentTarget.style.boxShadow = inputFocusShadow; e.currentTarget.style.background = "#FFFAF6"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(48,2,102,0.1)"; e.currentTarget.style.boxShadow = inputBaseShadow; e.currentTarget.style.background = "#FFFDFB"; }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Country *</label>
                <select name="country" required style={{ ...inputStyle, cursor: "pointer" }} onFocus={(e) => { e.currentTarget.style.borderColor = B_RED; e.currentTarget.style.boxShadow = inputFocusShadow; e.currentTarget.style.background = "#FFFAF6"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(48,2,102,0.1)"; e.currentTarget.style.boxShadow = inputBaseShadow; e.currentTarget.style.background = "#FFFDFB"; }}>
                  <option value="" style={{ background: "#fff", color: "#888" }}>Select country *</option>
                  {[...new Set(COUNTRY_CODES.map(c => c.name))].sort().map((name) => (
                    <option key={name} value={name} style={{ background: "#fff", color: INK }}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Message (optional)</label>
              <textarea
                name="message"
                placeholder="Anything you would like us to know..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical" as const }}
                onFocus={(e) => { e.currentTarget.style.borderColor = B_RED; e.currentTarget.style.boxShadow = inputFocusShadow; e.currentTarget.style.background = "#FFFAF6"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(48,2,102,0.1)"; e.currentTarget.style.boxShadow = inputBaseShadow; e.currentTarget.style.background = "#FFFDFB"; }}
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
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 48px",
                borderRadius: 50,
                border: "1px solid rgba(255,255,255,0.2)",
                background: sending
                  ? `${B_PURPLE}80`
                  : `linear-gradient(180deg, #9636e2 0%, ${B_PURPLE} 55%, #6914c2 100%)`,
                color: "white",
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "-0.005em",
                textShadow: "0 1px 1px rgba(0,0,0,0.18)",
                cursor: sending ? "not-allowed" : "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: sending
                  ? "none"
                  : `
                    0 1.5px 0 rgba(255,255,255,0.45) inset,
                    0 -1.5px 0 rgba(0,0,0,0.2) inset,
                    0 0 0 1px rgba(255,255,255,0.18) inset,
                    0 1px 2px rgba(48,2,102,0.35),
                    0 10px 28px ${B_PURPLE}66,
                    0 0 56px ${B_PURPLE}3a
                  `,
              }}
              onMouseEnter={(e) => {
                if (!sending) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `
                    0 1.5px 0 rgba(255,255,255,0.55) inset,
                    0 -1.5px 0 rgba(0,0,0,0.22) inset,
                    0 0 0 1px rgba(255,255,255,0.22) inset,
                    0 2px 4px rgba(48,2,102,0.4),
                    0 18px 40px ${B_PURPLE}80,
                    0 0 72px ${B_PURPLE}55
                  `;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = sending
                  ? "none"
                  : `
                    0 1.5px 0 rgba(255,255,255,0.45) inset,
                    0 -1.5px 0 rgba(0,0,0,0.2) inset,
                    0 0 0 1px rgba(255,255,255,0.18) inset,
                    0 1px 2px rgba(48,2,102,0.35),
                    0 10px 28px ${B_PURPLE}66,
                    0 0 56px ${B_PURPLE}3a
                  `;
              }}
            >
              {sending ? "Submitting..." : CTA_LABEL} {!sending && <span>→</span>}
            </button>
            </div>
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
      className="braze3-footer"
      style={{
        padding: "6px 0 6px",
        background: HEAT1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Supergraphic watermark */}
      <div
        style={{
          position: "absolute",
          top: "-60%",
          right: "-10%",
          width: "50%",
          height: "220%",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        <Image src="/braze/sg-heat1-1.png" alt="" fill style={{ objectFit: "contain" }} />
      </div>

      {/* Warm white glow */}
      <div
        style={{
          position: "absolute",
          top: "-40%",
          left: "-10%",
          width: "50%",
          height: "180%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="braze3-footer-inner"
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          padding: PAD,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
          <Image
            src={LOCKUP_LOGO}
            alt="Braze x Talon"
            width={480}
            height={104}
            style={{ height: "clamp(88px, 9.5vw, 124px)", width: "auto" }}
            unoptimized
          />
          <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>
            © {new Date().getFullYear()} Braze, Inc. All rights reserved.
          </span>
        </div>

        <p
          style={{
            margin: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.04em",
          }}
        >
          Produced by
          <a
            href="https://www.eventsfirstgroup.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Events First Group"
            style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/events-first-group_logo_alt.svg"
              alt="Events First Group"
              style={{ height: 32, width: "auto", opacity: 0.95, filter: "brightness(0) invert(1)" }}
            />
          </a>
        </p>
      </div>
    </footer>
  );
}
