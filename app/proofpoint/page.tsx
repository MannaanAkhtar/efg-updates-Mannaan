"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useInView, motion } from "framer-motion";
import {
  submitForm,
  COUNTRY_CODES,
  validatePhone,
  type CountryCode,
} from "@/lib/form-helpers";

// ─── Proofpoint Design Tokens ────────────────────────────────────────────────
// Light enterprise aesthetic — clean cream surfaces, deep navy ink,
// Proofpoint cyan accent. NOT the cinematic-dark Seagate treatment.
const PP_NAVY = "#0E2541";        // Primary ink
const PP_NAVY_DEEP = "#06142B";   // Deepest navy for accents
const PP_NAVY_INK = "#1A2A48";    // Body text
const PP_CYAN = "#00B4F0";        // Proofpoint cyan — primary accent
const PP_CYAN_DEEP = "#0095CC";   // Hover state
const PP_CYAN_BRIGHT = "#4FCDFF"; // Highlight tint
const PP_WHITE = "#FFFFFF";
const PP_CREAM = "#F8FAFD";       // Page surface
const PP_CREAM_DEEP = "#EEF2F8";  // Subtle banding
const PP_GRAY_LIGHT = "#E5EBF2";  // Borders, hairlines
const PP_GRAY = "#5A6B85";        // Secondary text
const PP_HAIRLINE = "rgba(14,37,65,0.10)";

const EVENT_TARGET = "2026-06-23T10:30:00+03:00"; // AST (Arabia Standard Time)

// White Proofpoint favicon mark — used on Proofpoint-led timeline markers
const PFPT_FAVICON =
  "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/PFPT+Favicon_White.png";

// Proofpoint wordmark logos (full lockup)
const PFPT_LOGO_DARK =
  "https://efg-final.s3.eu-north-1.amazonaws.com/logos/proofpoint_blacklogo.png";
const PFPT_LOGO_LIGHT =
  "https://efg-final.s3.eu-north-1.amazonaws.com/logos/proofpoint_whitelogo.png";

// Crowne Plaza Riyadh RDC venue photo
const CROWNE_PLAZA_PHOTO =
  "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/crowne-plaza-riyadh.jpg";

// ─── Data ────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: "overview", label: "Overview" },
  { id: "speakers", label: "Speakers" },
  { id: "agenda", label: "Agenda" },
  { id: "about", label: "About" },
  { id: "venue", label: "Venue" },
];

const TOPICS = [
  {
    n: "01",
    title: "The Agentic Workspace",
    desc: "The emergence of AI-powered collaboration tools reshaping how modern enterprises operate.",
  },
  {
    n: "02",
    title: "New Security Challenges",
    desc: "Identifying and mitigating the risks that come with modern collaboration platforms.",
  },
  {
    n: "03",
    title: "Protecting Humans & AI",
    desc: "Strategies to defend both human users and AI-driven agents across unified workflows.",
  },
];

const SPEAKERS = [
  {
    name: "Abdullah Aljandal",
    role: "Sales Director & Saudi Country Manager",
    org: "Proofpoint",
    linkedin: "https://www.linkedin.com/in/abdullah-aljandal-47373547/",
    initials: "AA",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Abdullah+Aljandal.jpg",
  },
  {
    name: "Elias Samarani",
    role: "Head of Technical Sales, Emerging Markets",
    org: "Proofpoint",
    linkedin: "https://www.linkedin.com/in/elias-samarani-b9ab8223/",
    initials: "ES",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Elias_Samarani.png",
  },
  {
    name: "Mustafa Maarouf",
    role: "Senior Security Engineer",
    org: "Proofpoint",
    linkedin: "https://www.linkedin.com/in/mustafa-maarouf07/",
    initials: "MM",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Mustafa_Maarouf.png",
  },
  {
    name: "Hashim Luai",
    role: "Senior Security Engineer",
    org: "Proofpoint",
    linkedin: "https://www.linkedin.com/in/hashim-luai-a604b917/",
    initials: "HL",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Hashim_Lua.png",
  },
];

type AgendaRow = {
  start: string;
  end: string;
  duration: string;
  segment: string;
  owner: string;
  type: "logistics" | "welcome" | "keynote" | "feature" | "break" | "panel" | "demo" | "closing";
};

const AGENDA: AgendaRow[] = [
  { start: "10:30", end: "11:00", duration: "30 min", segment: "Guest Arrival, Registration & Welcome Coffee", owner: "Event Operations Team", type: "logistics" },
  { start: "11:00", end: "11:05", duration: "5 min",  segment: "Welcome Remarks & House Keeping", owner: "Event Host / Moderator", type: "welcome" },
  { start: "11:05", end: "11:35", duration: "30 min", segment: "Opening Keynote Presentation", owner: "Lead Speaker · Proofpoint", type: "keynote" },
  { start: "11:35", end: "12:05", duration: "30 min", segment: "Featured Presentation", owner: "Industry Speaker · Proofpoint", type: "feature" },
  { start: "12:05", end: "12:30", duration: "25 min", segment: "Networking Coffee Break", owner: "All Delegates", type: "break" },
  { start: "12:30", end: "13:00", duration: "30 min", segment: "Proofpoint Live Innovation Demonstrations", owner: "Proofpoint Presenter", type: "demo" },
  { start: "13:00", end: "13:30", duration: "30 min", segment: "Panel Discussion", owner: "Moderator + Panelists", type: "panel" },
  { start: "13:30", end: "13:35", duration: "5 min",  segment: "Closing Remarks & Vote of Thanks", owner: "Event Host / Moderator", type: "closing" },
  { start: "13:35", end: "—",     duration: "—",      segment: "Networking Lunch", owner: "All Delegates", type: "logistics" },
];

// ─── Countdown Hook ──────────────────────────────────────────────────────────
function useCountdown(target: string) {
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => {
      const diff = Math.max(0, t - Date.now());
      setCd({
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff % 864e5) / 36e5),
        m: Math.floor((diff % 36e5) / 6e4),
        s: Math.floor((diff % 6e4) / 1e3),
      });
    };
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, [target]);
  return cd;
}

// ─── Proofpoint Logo — text placeholder until the SVG arrives ────────────────
function ProofpointLogo({ inverted = false, size = 28 }: { inverted?: boolean; size?: number }) {
  return (
    <img
      src={inverted ? PFPT_LOGO_LIGHT : PFPT_LOGO_DARK}
      alt="Proofpoint"
      style={{
        height: size,
        width: "auto",
        display: "block",
        objectFit: "contain",
      }}
    />
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// NAV
// ═════════════════════════════════════════════════════════════════════════════
function ProofpointNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) =>
      document.getElementById(l.id)
    ).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        if (top.target.id) setActiveSection(top.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "clamp(12px, 1.6vw, 18px) clamp(20px, 4vw, 56px)",
        background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
        borderBottom: scrolled ? `1px solid ${PP_HAIRLINE}` : "1px solid transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "background 0.3s ease, border-color 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
      }}
    >
      <a
        href="#top"
        aria-label="Proofpoint"
        style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
      >
        <ProofpointLogo size={40} />
      </a>

      <nav className="pp-nav-links" style={{ display: "flex", alignItems: "center", gap: "clamp(20px, 2.6vw, 36px)" }}>
        {NAV_LINKS.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              style={{
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: isActive ? PP_NAVY : PP_GRAY,
                textDecoration: "none",
                position: "relative",
                padding: "6px 0",
                transition: "color 0.3s ease",
              }}
            >
              {link.label}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -2,
                  height: 2,
                  background: PP_CYAN,
                  borderRadius: 1,
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "center",
                  transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                }}
              />
            </a>
          );
        })}
      </nav>

      <a
        href="#register"
        className="pp-nav-cta"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 18px",
          borderRadius: 999,
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: PP_WHITE,
          background: PP_CYAN,
          textDecoration: "none",
          boxShadow: `0 4px 14px ${PP_CYAN}40, inset 0 1px 0 rgba(255,255,255,0.25)`,
          transition: "background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
        }}
      >
        Request Invitation
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      <style jsx>{`
        .pp-nav-cta:hover {
          background: ${PP_CYAN_DEEP};
          transform: translateY(-1px);
          box-shadow: 0 8px 22px ${PP_CYAN}55, inset 0 1px 0 rgba(255,255,255,0.3);
        }
        @media (max-width: 820px) {
          .pp-nav-links {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HERO
// ═════════════════════════════════════════════════════════════════════════════
function CountdownDisplay({ target }: { target: string }) {
  const cd = useCountdown(target);
  const cells = [
    { v: cd.d, l: "D" },
    { v: cd.h, l: "H" },
    { v: cd.m, l: "M" },
    { v: cd.s, l: "S" },
  ];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: PP_GRAY,
          marginRight: 4,
        }}
      >
        Starts in
      </span>
      {cells.map((c, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "baseline", gap: 2 }}>
          <span
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: PP_NAVY,
              minWidth: 22,
              textAlign: "center",
            }}
          >
            {String(c.v).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: "var(--font-outfit), system-ui, sans-serif",
              fontSize: 10,
              fontWeight: 600,
              color: PP_GRAY,
            }}
          >
            {c.l}
          </span>
          {i < cells.length - 1 && (
            <span style={{ color: PP_GRAY_LIGHT, marginInline: 2 }}>·</span>
          )}
        </span>
      ))}
    </div>
  );
}

function HeroSection() {
  return (
    <section
      id="top"
      style={{
        position: "relative",
        overflow: "hidden",
        // Base vertical wash — white at the very top, cream through the
        // body, faintly cyan-tinted at the bottom edge. Gives natural
        // depth and lifts the headline area.
        background: `linear-gradient(180deg,
          #FFFFFF 0%,
          ${PP_CREAM} 30%,
          ${PP_CREAM} 60%,
          #EEF7FC 95%,
          #E6F2FB 100%
        )`,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "clamp(110px, 14vh, 160px)",
        paddingBottom: "clamp(40px, 6vh, 72px)",
      }}
    >
      {/* ── BG layer 1: subtle dot grid — restrained enterprise texture.
         32px tile, navy dots at 5% opacity. Faded toward edges via mask so
         it never competes with the headline. ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at center, ${PP_NAVY}13 1px, transparent 1.4px)`,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.15) 90%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.15) 90%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── BG layer 2a: ambient cyan glow, bottom-right corner ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-25%",
          right: "-15%",
          width: "70vw",
          height: "70vh",
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${PP_CYAN}10 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── BG layer 2b: balancing soft glow, top-left corner — navy
         tint at lower opacity so the page feels symmetrically lit
         without competing with the cyan headline accent. ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: "55vw",
          height: "55vh",
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${PP_NAVY}08 0%, ${PP_CYAN}06 40%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── BG layer 2c: faint cyan whisper, middle-right — anchors the
         right column where the rotated squares sit. ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "30%",
          right: "10%",
          width: "32vw",
          height: "32vh",
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${PP_CYAN_BRIGHT}10 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── BG layer 3: rotated rounded squares (top-right) — kept from
         previous pass per user feedback. ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "8%",
          right: "-6%",
          width: "clamp(280px, 30vw, 480px)",
          height: "clamp(280px, 30vw, 480px)",
          border: `1px solid ${PP_CYAN}25`,
          transform: "rotate(15deg)",
          borderRadius: 24,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "14%",
          right: "-2%",
          width: "clamp(180px, 22vw, 320px)",
          height: "clamp(180px, 22vw, 320px)",
          border: `1px solid ${PP_NAVY}12`,
          transform: "rotate(8deg)",
          borderRadius: 18,
          pointerEvents: "none",
        }}
      />

      {/* ── BG layer 4: curved divider — soft watercolour-wash gradient
         visible across the full wave but kept restrained. Cyan
         concentrates at the curved top edge and fades down into white at
         the bottom (vertical gradient = natural wash). Subtle horizontal
         variation goes from light-cyan on the left to a slightly cooler
         navy hint on the right. ── */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          bottom: -1,
          left: 0,
          width: "100%",
          height: "clamp(56px, 7vw, 96px)",
          pointerEvents: "none",
        }}
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Single PP_CYAN across the full width — matches the rest of
             the hero's cyan (Human headline, Request Invitation CTA, meta
             middots, accent rule). Slight horizontal opacity variation
             only, to keep the wave from feeling like a flat block. */}
          <linearGradient
            id="pp-hero-wave-hue"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={PP_CYAN} stopOpacity="0.4" />
            <stop offset="50%" stopColor={PP_CYAN} stopOpacity="0.32" />
            <stop offset="100%" stopColor={PP_CYAN} stopOpacity="0.4" />
          </linearGradient>
          {/* Vertical fade — coloured at the top edge, transparent at
             bottom so it sits on the white Overview section cleanly */}
          <linearGradient
            id="pp-hero-wave-fade"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={PP_WHITE} stopOpacity="0" />
            <stop offset="65%" stopColor={PP_WHITE} stopOpacity="0.55" />
            <stop offset="100%" stopColor={PP_WHITE} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Coloured wave — horizontal hue variation */}
        <path
          d="M0,40 Q300,80 600,38 T1200,42 L1200,80 L0,80 Z"
          fill="url(#pp-hero-wave-hue)"
        />
        {/* Vertical white fade — concentrates colour at top, transitions
           down through the body of the wave into pure white at the
           bottom edge */}
        <path
          d="M0,40 Q300,80 600,38 T1200,42 L1200,80 L0,80 Z"
          fill="url(#pp-hero-wave-fade)"
        />
      </svg>

      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(20px, 4.5vw, 72px)",
          position: "relative",
          zIndex: 4,
          width: "100%",
        }}
      >
        {/* Location badge — Riyadh, Saudi Arabia. Glassy white pill with
            a cyan pin icon. Sits above the H1 as a kicker. */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.02, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "clamp(20px, 2.4vh, 28px)" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "8px 16px 8px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.85)",
              border: `1px solid rgba(0,180,240,0.30)`,
              boxShadow:
                "0 6px 18px rgba(14,37,65,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
              fontFamily: "var(--font-outfit), system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: PP_NAVY,
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13z"
                stroke={PP_CYAN}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9" r="2.4" stroke={PP_CYAN} strokeWidth="2" />
            </svg>
            Riyadh, Saudi Arabia
          </span>
        </motion.div>

        {/* Big-type editorial H1 — Plus Jakarta Sans 700, monumental scale.
            "Human" rendered as filled cyan, "Agentic" as outlined navy
            (text-stroke, transparent fill). The duality is visualized in
            the typography itself — no italic accent, no decorative chip.
            This visual move is unique to this page; not borrowed from any
            other event page in the codebase. */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(36px, 5.8vw, 92px)",
            fontWeight: 700,
            color: PP_NAVY,
            letterSpacing: "-0.032em",
            lineHeight: 1.02,
            margin: 0,
            maxWidth: "min(1180px, 94vw)",
            textWrap: "balance" as "balance",
          }}
        >
          The Next Chapter in{" "}
          <span style={{ color: PP_CYAN }}>Human</span>
          {" "}and{" "}
          <span
            className="pp-h1-agentic"
            style={{
              color: "transparent",
              WebkitTextStroke: `1.6px ${PP_NAVY}`,
              fontWeight: 700,
              transition: "color 0.4s ease, -webkit-text-stroke-color 0.4s ease",
            }}
          >
            Agentic
          </span>
          {" "}Security<span style={{ color: PP_CYAN }}>.</span>
        </motion.h1>

        {/* Tagline — direct sans, no Georgia italic */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: "clamp(28px, 3.4vh, 42px)",
            marginBottom: 0,
            fontFamily: "var(--font-outfit), system-ui, sans-serif",
            fontSize: "clamp(16px, 1.3vw, 21px)",
            fontWeight: 400,
            lineHeight: 1.5,
            color: PP_NAVY_INK,
            maxWidth: 720,
          }}
        >
          Discover how the rise of AI-powered &ldquo;agentic&rdquo; workspaces is
          transforming the way we collaborate — and what that means for security.
        </motion.p>

        {/* Single CTA — no ghost secondary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: "clamp(36px, 4.4vh, 56px)" }}
        >
          <a
            href="#register"
            className="pp-hero-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 28px",
              borderRadius: 999,
              fontFamily: "var(--font-outfit), system-ui, sans-serif",
              fontSize: "clamp(13px, 1vw, 14.5px)",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: PP_WHITE,
              background: PP_CYAN,
              textDecoration: "none",
              boxShadow: `0 10px 28px ${PP_CYAN}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
              transition: "transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
            }}
          >
            Request Invitation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>

        {/* Architectural chapter rule + single meta strip — all event
            facts inline, separated by cyan middots. No countdown, no
            split top/bottom marker. ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.72 }}
          style={{
            marginTop: "clamp(64px, 8vh, 100px)",
          }}
        >
          <div
            aria-hidden
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              marginBottom: 22,
            }}
          >
            <span
              style={{
                display: "block",
                width: 64,
                height: 3,
                background: PP_CYAN,
                borderRadius: 0,
              }}
            />
            {/* Architectural pin — small cyan dot at the seam between the
               solid cyan bar and the grey hairline. Echoes the
               proofpoint. logomark dot. */}
            <span
              style={{
                display: "block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: PP_CYAN,
                marginLeft: 6,
                boxShadow: `0 0 8px ${PP_CYAN}66`,
              }}
            />
            <span
              style={{
                display: "block",
                flex: 1,
                height: 1,
                background: PP_GRAY_LIGHT,
                marginLeft: 6,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "clamp(14px, 2vw, 28px)",
              fontFamily: "var(--font-outfit), system-ui, sans-serif",
              fontSize: "clamp(11px, 0.9vw, 13px)",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: PP_NAVY_INK,
            }}
          >
            <span>23 June 2026</span>
            <span style={{ color: PP_CYAN }}>·</span>
            <span>10:30 – 13:35 AST</span>
            <span style={{ color: PP_CYAN }}>·</span>
            <span>Crowne Plaza Riyadh</span>
            <span style={{ color: PP_CYAN }}>·</span>
            <span style={{ color: PP_GRAY }}>In-Person · Invite-Only</span>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .pp-hero-cta:hover {
          background: ${PP_CYAN_DEEP};
          transform: translateY(-1px);
          box-shadow: 0 14px 32px ${PP_CYAN}55, inset 0 1px 0 rgba(255, 255, 255, 0.35);
        }
        /* Hover micro-interaction: outlined "Agentic" fills with cyan
           when the headline is hovered. Pure CSS — no JS, no perf cost. */
        .pp-h1-agentic:hover {
          color: ${PP_CYAN};
          -webkit-text-stroke-color: ${PP_CYAN};
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// OVERVIEW
// ═════════════════════════════════════════════════════════════════════════════
function OverviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="overview"
      style={{
        background: PP_WHITE,
        padding: "clamp(72px, 9vh, 120px) 0",
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${PP_HAIRLINE}`,
      }}
    >
      {/* Subtle dot-grid texture — same restrained pattern used in the
          hero. Faded radially so it never competes with the content. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at center, ${PP_NAVY}0a 1px, transparent 1.4px)`,
          backgroundSize: "36px 36px",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.1) 90%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.1) 90%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 56px)",
          position: "relative",
        }}
      >
        {/* Kicker + heading */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 32,
            flexWrap: "wrap",
            marginBottom: "clamp(48px, 6vh, 72px)",
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: PP_CYAN,
                marginBottom: 22,
              }}
            >
              <span style={{ width: 22, height: 1, background: PP_CYAN }} />
              Overview
            </span>

            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(28px, 3.6vw, 48px)",
                fontWeight: 700,
                letterSpacing: "-0.026em",
                lineHeight: 1.08,
                color: PP_NAVY,
                margin: 0,
                textWrap: "balance" as "balance",
              }}
            >
              What we&rsquo;ll explore<span style={{ color: PP_CYAN }}>.</span>
            </h2>
          </div>

          <p
            style={{
              maxWidth: 420,
              fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(14px, 1.1vw, 17px)",
              lineHeight: 1.55,
              color: PP_GRAY,
              margin: 0,
            }}
          >
            A working session for senior security leaders navigating the shift from
            human-only to human + AI agent workflows.
          </p>
        </div>

        {/* 3-column topic cards */}
        <div
          className="pp-topic-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(20px, 2.4vw, 32px)",
            marginBottom: "clamp(56px, 7vh, 80px)",
          }}
        >
          {TOPICS.map((t, i) => (
            <div
              key={t.n}
              className="pp-topic-card"
              style={{
                padding: "clamp(22px, 2.4vw, 30px)",
                paddingBottom: "clamp(44px, 3.6vw, 56px)",
                borderRadius: 16,
                background: `linear-gradient(180deg, ${PP_WHITE} 0%, ${PP_CREAM} 100%)`,
                border: `1px solid ${PP_GRAY_LIGHT}`,
                position: "relative",
                overflow: "hidden",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.1}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.1}s, border-color 0.35s ease, box-shadow 0.35s ease, background 0.35s ease`,
                boxShadow: "0 1px 2px rgba(14,37,65,0.03)",
              }}
            >
              {/* Top-edge cyan rule — animates from left to right on hover */}
              <span
                aria-hidden
                className="pp-topic-card-rule"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, ${PP_CYAN} 0%, ${PP_CYAN_BRIGHT} 100%)`,
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
                  boxShadow: `0 0 14px ${PP_CYAN}66`,
                }}
              />

              {/* Watermark numeral — large outlined italic serif, bottom-right */}
              <span
                aria-hidden
                className="pp-topic-watermark"
                style={{
                  position: "absolute",
                  right: "clamp(-10px, -0.9vw, -6px)",
                  bottom: "clamp(-22px, -2vw, -16px)",
                  fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "clamp(96px, 11vw, 150px)",
                  lineHeight: 1,
                  color: "transparent",
                  WebkitTextStroke: `1.2px ${PP_NAVY}12`,
                  pointerEvents: "none",
                  userSelect: "none",
                  transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {t.n}
              </span>

              {/* Identifier label */}
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.28em",
                  color: PP_CYAN,
                  marginBottom: 16,
                  position: "relative",
                }}
              >
                {t.n}
              </span>

              <h3
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "clamp(17px, 1.5vw, 22px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.18,
                  color: PP_NAVY,
                  margin: "0 0 10px",
                  position: "relative",
                }}
              >
                {t.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-outfit), system-ui, sans-serif",
                  fontSize: "clamp(13px, 1vw, 14.5px)",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: PP_GRAY,
                  margin: 0,
                  position: "relative",
                }}
              >
                {t.desc}
              </p>

              {/* Cyan arrow affordance — slides in on hover */}
              <span
                aria-hidden
                className="pp-topic-cta"
                style={{
                  position: "absolute",
                  left: "clamp(22px, 2.4vw, 30px)",
                  bottom: "clamp(18px, 2vw, 24px)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: 0,
                  transform: "translateX(-10px)",
                  transition:
                    "opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 1.5,
                    background: PP_CYAN,
                  }}
                />
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: PP_CYAN,
                    boxShadow: `0 0 10px ${PP_CYAN}88`,
                  }}
                />
              </span>
            </div>
          ))}
        </div>

        {/* Problem statement — 2-col split */}
        <div
          className="pp-overview-body"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(28px, 4vw, 56px)",
            paddingTop: "clamp(40px, 5vh, 56px)",
            borderTop: `1px solid ${PP_HAIRLINE}`,
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(20px, 1.9vw, 28px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.18,
                color: PP_NAVY,
                margin: "0 0 16px",
              }}
            >
              The problem we&rsquo;re solving<span style={{ color: PP_CYAN }}>.</span>
            </h3>
            <p
              style={{
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontSize: "clamp(14px, 1.1vw, 16px)",
                fontWeight: 400,
                lineHeight: 1.7,
                color: PP_NAVY_INK,
                margin: 0,
              }}
            >
              We&rsquo;ll highlight how Proofpoint&rsquo;s newest capabilities help
              organisations stay ahead of evolving human- and AI-centric threats —
              with a focus on reducing human risk, strengthening resilience, and
              protecting critical assets.
            </p>
          </div>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(20px, 1.9vw, 28px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.18,
                color: PP_NAVY,
                margin: "0 0 16px",
              }}
            >
              How the room works<span style={{ color: PP_CYAN }}>.</span>
            </h3>
            <p
              style={{
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontSize: "clamp(14px, 1.1vw, 16px)",
                fontWeight: 400,
                lineHeight: 1.7,
                color: PP_NAVY_INK,
                margin: 0,
              }}
            >
              See what&rsquo;s new, understand the value of our latest advancements,
              and learn how to apply them in today&rsquo;s threat landscape. This
              interactive session will blend expert perspectives, live demonstrations,
              and audience participation.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pp-topic-card {
          will-change: transform, box-shadow;
        }
        .pp-topic-card:hover {
          border-color: ${PP_CYAN}66 !important;
          box-shadow:
            0 18px 44px rgba(0,180,240,0.10),
            0 6px 16px rgba(14,37,65,0.06) !important;
          background: linear-gradient(180deg, ${PP_WHITE} 0%, ${PP_WHITE} 100%) !important;
        }
        /* Top-edge cyan rule animates in from left on hover */
        .pp-topic-card:hover .pp-topic-card-rule {
          transform: scaleX(1) !important;
        }
        /* Watermark numeral darkens slightly + lifts on hover */
        .pp-topic-card:hover .pp-topic-watermark {
          -webkit-text-stroke-color: ${PP_CYAN}40 !important;
          transform: translate(-4px, -6px);
        }
        /* Arrow affordance reveals at bottom-left */
        .pp-topic-card:hover .pp-topic-cta {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
        @media (max-width: 880px) {
          .pp-topic-grid {
            grid-template-columns: 1fr !important;
          }
          .pp-overview-body {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SPEAKERS
// ═════════════════════════════════════════════════════════════════════════════
function SpeakersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="speakers"
      style={{
        background: PP_CREAM,
        padding: "clamp(72px, 9vh, 120px) 0",
        position: "relative",
        borderTop: `1px solid ${PP_HAIRLINE}`,
        overflow: "hidden",
      }}
    >
      {/* Subtle cyan tint glow, top-right corner */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-12%",
          right: "-8%",
          width: 520,
          height: 520,
          background: `radial-gradient(circle, ${PP_CYAN}0d 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 56px)",
          position: "relative",
        }}
      >
        {/* Header — kicker + confirmed-count meta strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 32,
            flexWrap: "wrap",
            marginBottom: "clamp(36px, 4.5vh, 56px)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "var(--font-outfit), system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: PP_CYAN,
            }}
          >
            <span style={{ width: 22, height: 1, background: PP_CYAN }} />
            Speakers
          </span>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-outfit), system-ui, sans-serif",
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: PP_GRAY,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: PP_CYAN, boxShadow: `0 0 8px ${PP_CYAN}66` }} />
            {SPEAKERS.length.toString().padStart(2, "0")} confirmed
          </div>
        </div>

        <div
          className="pp-speakers-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "clamp(20px, 2vw, 28px)",
          }}
        >
          {SPEAKERS.map((s, i) => (
            <div
              key={s.name}
              className="pp-speaker-card"
              style={{
                background: `linear-gradient(180deg, ${PP_NAVY} 0%, ${PP_NAVY_DEEP} 100%)`,
                border: `1px solid rgba(0,180,240,0.20)`,
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.08}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.08}s, border-color 0.35s ease, box-shadow 0.35s ease`,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 14px rgba(6,20,43,0.16)",
              }}
            >
              {/* Full-bleed portrait — dominates the card */}
              <div
                className="pp-speaker-portrait"
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 5",
                  overflow: "hidden",
                  background: `linear-gradient(135deg, ${PP_CYAN} 0%, ${PP_NAVY} 100%)`,
                }}
              >
                <img
                  src={s.photo}
                  alt={s.name}
                  loading="lazy"
                  className="pp-speaker-img"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 20%",
                    display: "block",
                    transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
                  }}
                />

                {/* Bottom navy fade — keeps name area legible on edge cases and adds depth */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 70,
                    background: `linear-gradient(180deg, transparent 0%, rgba(14,37,65,0.25) 100%)`,
                    pointerEvents: "none",
                  }}
                />

                {/* Floating LinkedIn chip in the photo's bottom-right */}
                <a
                  href={s.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.name} on LinkedIn`}
                  className="pp-speaker-li"
                  style={{
                    position: "absolute",
                    right: 14,
                    bottom: 14,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.96)",
                    color: PP_NAVY,
                    backdropFilter: "blur(6px)",
                    boxShadow: "0 6px 18px rgba(14,37,65,0.18)",
                    textDecoration: "none",
                    transition:
                      "background 0.25s ease, color 0.25s ease, transform 0.25s ease",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>

              {/* Meta block — name, role, org */}
              <div
                style={{
                  padding: "clamp(18px, 1.8vw, 24px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  position: "relative",
                }}
              >
                {/* Top-edge cyan rule that scales in on hover */}
                <span
                  aria-hidden
                  className="pp-speaker-rule"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "clamp(18px, 1.8vw, 24px)",
                    width: 32,
                    height: 2,
                    background: PP_CYAN,
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
                    boxShadow: `0 0 10px ${PP_CYAN}66`,
                  }}
                />

                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "clamp(16px, 1.3vw, 19px)",
                    fontWeight: 700,
                    letterSpacing: "-0.018em",
                    lineHeight: 1.22,
                    color: PP_WHITE,
                    margin: 0,
                    minHeight: "1.22em",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {s.name}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-outfit), system-ui, sans-serif",
                    fontSize: "clamp(12.5px, 0.95vw, 13.5px)",
                    fontWeight: 500,
                    color: PP_CYAN_BRIGHT,
                    margin: 0,
                    lineHeight: 1.4,
                    minHeight: "calc(1.4em * 2)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {s.role}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-outfit), system-ui, sans-serif",
                    fontSize: "clamp(12px, 0.85vw, 12.5px)",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.62)",
                    margin: 0,
                    lineHeight: 1.4,
                    minHeight: "calc(1.4em * 2)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {s.org}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .pp-speaker-card {
          will-change: transform, box-shadow;
        }
        .pp-speaker-card:hover {
          border-color: ${PP_CYAN}55 !important;
          box-shadow:
            0 18px 44px rgba(0,180,240,0.10),
            0 6px 16px rgba(14,37,65,0.08) !important;
          transform: translateY(-4px) !important;
        }
        .pp-speaker-card:hover .pp-speaker-img {
          transform: scale(1.05);
        }
        .pp-speaker-card:hover .pp-speaker-rule {
          transform: scaleX(1) !important;
        }
        .pp-speaker-li:hover {
          background: ${PP_CYAN} !important;
          color: ${PP_WHITE} !important;
          transform: translateY(-1px);
        }
        @media (max-width: 980px) {
          .pp-speakers-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 540px) {
          .pp-speakers-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// AGENDA
// ═════════════════════════════════════════════════════════════════════════════
function AgendaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="agenda"
      style={{
        background: PP_WHITE,
        padding: "clamp(72px, 9vh, 120px) 0",
        position: "relative",
        borderTop: `1px solid ${PP_HAIRLINE}`,
        overflow: "hidden",
      }}
    >
      {/* Soft cyan haze, bottom-left */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-8%",
          width: 580,
          height: 580,
          background: `radial-gradient(circle, ${PP_CYAN}0c 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 56px)",
          position: "relative",
        }}
      >
        {/* Header — kicker + meta strip on right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 32,
            flexWrap: "wrap",
            marginBottom: "clamp(40px, 5vh, 56px)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "var(--font-outfit), system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: PP_CYAN,
            }}
          >
            <span style={{ width: 22, height: 1, background: PP_CYAN }} />
            Agenda
          </span>

          <div
            style={{
              fontFamily: "var(--font-outfit), system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: PP_GRAY,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>23 Jun 2026</span>
            <span style={{ width: 18, height: 1, background: PP_GRAY_LIGHT }} />
            <span>Riyadh · AST</span>
          </div>
        </div>

        {/* Compact vertical timeline */}
        <div
          className="pp-timeline"
          style={{
            position: "relative",
            borderTop: `1px solid ${PP_HAIRLINE}`,
            borderBottom: `1px solid ${PP_HAIRLINE}`,
          }}
        >
          {/* Continuous rail line — gradient fades at top/bottom for soft endings */}
          <span
            aria-hidden
            className="pp-tl-rail"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 28,
              width: 1,
              background: `linear-gradient(180deg, transparent 0%, ${PP_GRAY_LIGHT} 6%, ${PP_GRAY_LIGHT} 94%, transparent 100%)`,
              zIndex: 0,
            }}
          />

          {AGENDA.map((row, i) => {
            const isProofpoint =
              row.type === "keynote" || row.type === "feature" || row.type === "demo";
            const isLogistical = row.type === "break" || row.type === "logistics";
            const isPanel = row.type === "panel";
            const isLast = i === AGENDA.length - 1;

            return (
              <div
                key={i}
                className={`pp-tl-row ${isProofpoint ? "is-brand" : ""} ${isLogistical ? "is-log" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(14px, 1.8vw, 22px)",
                  padding: "14px 12px 14px 4px",
                  borderBottom: isLast ? "none" : `1px solid ${PP_HAIRLINE}`,
                  position: "relative",
                  background: isProofpoint ? "rgba(0,180,240,0.025)" : "transparent",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateX(0)" : "translateX(-8px)",
                  transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${0.08 + i * 0.04}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${0.08 + i * 0.04}s, background 0.25s ease`,
                }}
              >
                {/* Rail node column */}
                <div
                  style={{
                    width: 56,
                    display: "flex",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isProofpoint ? (
                    <span
                      aria-hidden
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${PP_NAVY} 0%, ${PP_NAVY_DEEP} 100%)`,
                        border: `1px solid ${PP_CYAN}66`,
                        boxShadow: `0 3px 10px rgba(14,37,65,0.18), 0 0 0 3px rgba(0,180,240,0.08)`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      <img
                        src={PFPT_FAVICON}
                        alt=""
                        width={15}
                        height={15}
                        loading="lazy"
                        style={{ display: "block", objectFit: "contain" }}
                      />
                    </span>
                  ) : isPanel ? (
                    <span
                      aria-hidden
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: `2.5px solid ${PP_CYAN}`,
                        background: PP_WHITE,
                        boxShadow: `0 0 0 3px rgba(0,180,240,0.08)`,
                        position: "relative",
                        zIndex: 2,
                      }}
                    />
                  ) : isLogistical ? (
                    <span
                      aria-hidden
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        border: `1.5px solid ${PP_GRAY}`,
                        background: PP_WHITE,
                        position: "relative",
                        zIndex: 2,
                      }}
                    />
                  ) : (
                    <span
                      aria-hidden
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: PP_CYAN,
                        boxShadow: `0 0 8px ${PP_CYAN}80`,
                        position: "relative",
                        zIndex: 2,
                      }}
                    />
                  )}
                </div>

                {/* Time block — tabular numerals */}
                <div
                  className="pp-tl-time"
                  style={{
                    width: "clamp(108px, 11vw, 132px)",
                    flexShrink: 0,
                    fontFamily: "var(--font-outfit), system-ui, sans-serif",
                    fontSize: "clamp(12.5px, 1vw, 14px)",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: isProofpoint ? PP_NAVY : PP_NAVY_INK,
                    fontVariantNumeric: "tabular-nums",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  {row.start}
                  <svg
                    width="11"
                    height="6"
                    viewBox="0 0 11 6"
                    fill="none"
                    aria-hidden
                    style={{ flexShrink: 0, opacity: isProofpoint ? 0.95 : 0.6 }}
                  >
                    <path
                      d="M0 3h9.5M7 0.7l2.8 2.3-2.8 2.3"
                      stroke={PP_CYAN}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  {row.end}
                </div>

                {/* Duration chip — soft pill */}
                <div
                  className="pp-tl-duration"
                  style={{
                    flexShrink: 0,
                    width: 78,
                    textAlign: "center",
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontFamily: "var(--font-outfit), system-ui, sans-serif",
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: isProofpoint ? PP_CYAN_DEEP : PP_GRAY,
                    background: isProofpoint
                      ? "rgba(0,180,240,0.10)"
                      : "rgba(14,37,65,0.04)",
                    border: isProofpoint
                      ? `1px solid rgba(0,180,240,0.18)`
                      : `1px solid ${PP_GRAY_LIGHT}`,
                  }}
                >
                  {row.duration}
                </div>

                {/* Segment + owner stacked */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "clamp(14px, 1.15vw, 16.5px)",
                      fontWeight: isProofpoint ? 700 : 600,
                      letterSpacing: "-0.012em",
                      lineHeight: 1.28,
                      color: isLogistical ? PP_NAVY_INK : PP_NAVY,
                      margin: 0,
                    }}
                  >
                    {row.segment}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-outfit), system-ui, sans-serif",
                      fontSize: "clamp(11.5px, 0.9vw, 13px)",
                      fontWeight: 400,
                      lineHeight: 1.35,
                      color: PP_GRAY,
                      margin: "2px 0 0",
                    }}
                  >
                    {row.owner}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .pp-tl-row:not(.is-brand):hover {
          background: rgba(14, 37, 65, 0.025) !important;
        }
        .pp-tl-row.is-brand:hover {
          background: rgba(0, 180, 240, 0.06) !important;
        }
        @media (max-width: 760px) {
          .pp-tl-row {
            flex-wrap: wrap !important;
            padding: 14px 4px !important;
          }
          .pp-tl-time {
            width: auto !important;
          }
          .pp-tl-row > div:last-child {
            flex-basis: 100% !important;
            margin-top: 6px !important;
            padding-left: 70px !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ABOUT
// ═════════════════════════════════════════════════════════════════════════════
function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { value: "80+", label: "of the Fortune 100" },
    { value: "10,000+", label: "large enterprises" },
    { value: "Millions", label: "of smaller organisations" },
    { value: "1", label: "platform · people · data · AI agents" },
  ];

  return (
    <section
      ref={ref}
      id="about"
      style={{
        background: `linear-gradient(180deg, ${PP_NAVY_DEEP} 0%, ${PP_NAVY} 55%, ${PP_NAVY_DEEP} 100%)`,
        padding: "clamp(88px, 11vh, 144px) 0",
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${PP_HAIRLINE}`,
      }}
    >
      {/* Cyan glow — bottom-left ambient */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-25%",
          left: "-12%",
          width: 720,
          height: 720,
          background: `radial-gradient(circle, ${PP_CYAN}1c 0%, transparent 60%)`,
          pointerEvents: "none",
          filter: "blur(20px)",
        }}
      />
      {/* Cyan glow — top-right ambient */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-12%",
          right: "-8%",
          width: 540,
          height: 540,
          background: `radial-gradient(circle, ${PP_CYAN}14 0%, transparent 60%)`,
          pointerEvents: "none",
          filter: "blur(28px)",
        }}
      />
      {/* Subtle dot grid pattern */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.04) 1px, transparent 1.4px)`,
          backgroundSize: "42px 42px",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 90% at 50% 50%, rgba(0,0,0,0.55) 30%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 95% 90% at 50% 50%, rgba(0,0,0,0.55) 30%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 56px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="pp-about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 320px) minmax(0, 1fr)",
            gap: "clamp(40px, 5vw, 80px)",
            alignItems: "flex-start",
          }}
        >
          {/* Brand seal — large PFPT favicon medallion */}
          <div
            className="pp-about-brand"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div
              className="pp-medallion"
              style={{
                position: "relative",
                width: "clamp(160px, 16vw, 220px)",
                height: "clamp(160px, 16vw, 220px)",
                borderRadius: "50%",
                background: `radial-gradient(circle at 30% 25%, rgba(0,180,240,0.18) 0%, ${PP_NAVY} 55%, ${PP_NAVY_DEEP} 100%)`,
                border: `1px solid rgba(0,180,240,0.35)`,
                boxShadow: `
                  0 0 0 6px rgba(0,180,240,0.05),
                  0 0 60px rgba(0,180,240,0.18),
                  inset 0 0 40px rgba(0,180,240,0.06)
                `,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Animated outer cyan ring */}
              <span
                aria-hidden
                className="pp-medallion-ring"
                style={{
                  position: "absolute",
                  inset: -10,
                  borderRadius: "50%",
                  border: `1px solid rgba(0,180,240,0.18)`,
                  pointerEvents: "none",
                }}
              />
              <img
                src={PFPT_FAVICON}
                alt="Proofpoint"
                width={120}
                height={120}
                loading="lazy"
                style={{
                  width: "55%",
                  height: "55%",
                  objectFit: "contain",
                  display: "block",
                  filter: "drop-shadow(0 4px 14px rgba(0,180,240,0.25))",
                }}
              />
            </div>

            <ProofpointLogo inverted size={44} />
          </div>

          {/* Editorial column */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
              transition:
                "opacity 1s 0.1s cubic-bezier(0.22,1,0.36,1), transform 1s 0.1s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: PP_CYAN,
                marginBottom: 22,
              }}
            >
              <span style={{ width: 22, height: 1, background: PP_CYAN }} />
              About Proofpoint
            </span>

            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(26px, 3.4vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.026em",
                lineHeight: 1.1,
                color: PP_WHITE,
                margin: 0,
                maxWidth: 640,
              }}
            >
              Securing how people, data, and AI agents connect<span style={{ color: PP_CYAN }}>.</span>
            </h2>

            <p
              style={{
                margin: "clamp(22px, 2.6vh, 30px) 0 0",
                maxWidth: 640,
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontSize: "clamp(14px, 1.1vw, 15.5px)",
                fontWeight: 400,
                lineHeight: 1.72,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Proofpoint, Inc. is a global leader in human- and agent-centric
              cybersecurity, securing how people, data and AI agents connect across
              email, cloud and collaboration tools. A trusted partner to over 80 of
              the Fortune 100, over 10,000 large enterprises, and millions of smaller
              organizations in stopping threats, preventing data loss, and building
              resilience across people and AI workflows.
            </p>

            <p
              style={{
                margin: "clamp(16px, 2vh, 22px) 0 0",
                maxWidth: 640,
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontSize: "clamp(14px, 1.1vw, 15.5px)",
                fontWeight: 400,
                lineHeight: 1.72,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Proofpoint&rsquo;s collaboration and data security platform helps
              organizations of all sizes protect and empower their people while
              embracing AI securely and confidently.
            </p>

            <a
              href="https://www.proofpoint.com/uk"
              target="_blank"
              rel="noopener noreferrer"
              className="pp-about-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginTop: "clamp(28px, 3.2vh, 38px)",
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: PP_WHITE,
                textDecoration: "none",
                padding: "13px 22px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.05)",
                transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              Visit proofpoint.com
              <span
                aria-hidden
                className="pp-about-cta-arrow"
                style={{
                  fontSize: 14,
                  lineHeight: 1,
                  display: "inline-block",
                  transition: "transform 0.3s ease",
                }}
              >
                ↗
              </span>
            </a>
          </div>
        </div>

        {/* Stat strip — single horizontal row with vertical hairline dividers */}
        <div
          className="pp-about-stats"
          style={{
            marginTop: "clamp(56px, 7vh, 88px)",
            paddingTop: "clamp(32px, 4vh, 48px)",
            borderTop: `1px solid rgba(255,255,255,0.10)`,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 1.1s 0.2s cubic-bezier(0.22,1,0.36,1), transform 1.1s 0.2s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="pp-about-stat"
              style={{
                padding: "0 clamp(16px, 2vw, 28px)",
                borderLeft: i === 0 ? "none" : `1px solid rgba(255,255,255,0.10)`,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "clamp(30px, 3.2vw, 46px)",
                  fontWeight: 700,
                  letterSpacing: "-0.028em",
                  lineHeight: 1,
                  background: `linear-gradient(180deg, ${PP_CYAN_BRIGHT} 0%, ${PP_CYAN} 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 10,
                }}
              >
                {s.value}
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-outfit), system-ui, sans-serif",
                  fontSize: "clamp(12px, 0.95vw, 13.5px)",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  lineHeight: 1.45,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .pp-medallion-ring {
          animation: pp-medallion-breathe 5.2s ease-in-out infinite;
        }
        @keyframes pp-medallion-breathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.04); opacity: 1; }
        }
        .pp-about-cta:hover {
          background: ${PP_CYAN} !important;
          border-color: ${PP_CYAN} !important;
        }
        .pp-about-cta:hover .pp-about-cta-arrow {
          transform: translate(3px, -3px);
        }
        @media (max-width: 900px) {
          .pp-about-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(36px, 5vw, 56px) !important;
          }
          .pp-about-brand {
            align-items: center !important;
          }
        }
        @media (max-width: 760px) {
          .pp-about-stats {
            grid-template-columns: repeat(2, 1fr) !important;
            row-gap: 32px;
          }
          .pp-about-stat:nth-child(3) {
            border-left: none !important;
          }
        }
        @media (max-width: 420px) {
          .pp-about-stats {
            grid-template-columns: 1fr !important;
            row-gap: 28px;
          }
          .pp-about-stat {
            border-left: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// VENUE
// ═════════════════════════════════════════════════════════════════════════════
function VenueSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="venue"
      style={{
        position: "relative",
        background: PP_WHITE,
        padding: "clamp(72px, 9vh, 120px) 0",
        borderTop: `1px solid ${PP_HAIRLINE}`,
        overflow: "hidden",
      }}
    >
      {/* Subtle cyan haze, top-right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: 580,
          height: 580,
          background: `radial-gradient(circle, ${PP_CYAN}0c 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 56px)",
          position: "relative",
        }}
      >
        <div
          className="pp-venue-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
            gap: "clamp(40px, 5vw, 72px)",
            alignItems: "center",
          }}
        >
          {/* Left column — copy */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: PP_CYAN,
                marginBottom: 22,
              }}
            >
              <span style={{ width: 22, height: 1, background: PP_CYAN }} />
              Venue
            </span>

            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(32px, 4vw, 56px)",
                fontWeight: 700,
                letterSpacing: "-0.026em",
                lineHeight: 1.04,
                color: PP_NAVY,
                margin: 0,
              }}
            >
              Crowne Plaza Riyadh<span style={{ color: PP_CYAN }}>.</span>
            </h2>

            <p
              style={{
                margin: "clamp(14px, 1.8vh, 20px) 0 0",
                fontFamily: `Georgia, "Cambria", "Times New Roman", serif`,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(16px, 1.4vw, 22px)",
                color: PP_CYAN,
                lineHeight: 1.3,
              }}
            >
              RDC Hotel &amp; Convention by IHG · Riyadh, Saudi Arabia
            </p>

            {/* Fact grid — dates + time from the brief */}
            <div
              className="pp-venue-facts"
              style={{
                marginTop: "clamp(28px, 3.4vh, 40px)",
                paddingTop: "clamp(20px, 2.4vh, 28px)",
                borderTop: `1px solid ${PP_HAIRLINE}`,
                display: "grid",
                gridTemplateColumns: "auto auto",
                columnGap: "clamp(28px, 3.4vw, 48px)",
                rowGap: 18,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-outfit), system-ui, sans-serif",
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: PP_GRAY,
                    marginBottom: 6,
                  }}
                >
                  Date
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "clamp(15px, 1.2vw, 17px)",
                    fontWeight: 600,
                    letterSpacing: "-0.012em",
                    color: PP_NAVY,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  23 Jun 2026
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-outfit), system-ui, sans-serif",
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: PP_GRAY,
                    marginBottom: 6,
                  }}
                >
                  Time
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "clamp(15px, 1.2vw, 17px)",
                    fontWeight: 600,
                    letterSpacing: "-0.012em",
                    color: PP_NAVY,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  10:30 &ndash; 13:35 AST
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Crowne+Plaza+Riyadh+RDC+Hotel+%26+Convention+by+IHG"
              target="_blank"
              rel="noopener noreferrer"
              className="pp-venue-map-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginTop: "clamp(28px, 3.2vh, 40px)",
                padding: "12px 22px",
                borderRadius: 999,
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: PP_NAVY,
                background: PP_WHITE,
                border: `1px solid ${PP_GRAY_LIGHT}`,
                textDecoration: "none",
                transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
              }}
            >
              View on Map
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M7 17L17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Right column — real venue photo */}
          <div
            className="pp-venue-visual"
            style={{
              position: "relative",
              aspectRatio: "4 / 3",
              width: "100%",
              borderRadius: 22,
              overflow: "hidden",
              background: PP_NAVY,
              boxShadow:
                "0 28px 72px rgba(14,37,65,0.20), 0 0 0 1px rgba(0,180,240,0.10)",
              opacity: inView ? 1 : 0,
              transform: inView ? "scale(1)" : "scale(0.96)",
              transition:
                "opacity 1.2s 0.2s cubic-bezier(0.22,1,0.36,1), transform 1.2s 0.2s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <img
              src={CROWNE_PLAZA_PHOTO}
              alt="Crowne Plaza Riyadh"
              loading="lazy"
              className="pp-venue-img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                transition: "transform 1.2s cubic-bezier(0.22,1,0.36,1)",
              }}
            />

            {/* Bottom gradient overlay for the caption */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 140,
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(14,37,65,0.55) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Inset caption — venue name + city */}
            <div
              style={{
                position: "absolute",
                left: "clamp(20px, 2.4vw, 32px)",
                right: "clamp(20px, 2.4vw, 32px)",
                bottom: "clamp(18px, 2vw, 26px)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 16,
                color: PP_WHITE,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-outfit), system-ui, sans-serif",
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: PP_CYAN_BRIGHT,
                    marginBottom: 4,
                  }}
                >
                  Host Venue
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "clamp(16px, 1.5vw, 21px)",
                    fontWeight: 700,
                    letterSpacing: "-0.014em",
                    lineHeight: 1.15,
                    textShadow: "0 2px 10px rgba(0,0,0,0.45)",
                  }}
                >
                  Crowne Plaza Riyadh
                </div>
              </div>
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.95)",
                  boxShadow: "0 6px 18px rgba(14,37,65,0.25)",
                  color: PP_NAVY,
                  flexShrink: 0,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pp-venue-map-cta:hover {
          background: ${PP_NAVY} !important;
          border-color: ${PP_NAVY} !important;
          color: ${PP_WHITE} !important;
        }
        .pp-venue-visual:hover .pp-venue-img {
          transform: scale(1.04);
        }
        @media (max-width: 900px) {
          .pp-venue-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(36px, 5vw, 56px) !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// REGISTER
// ═════════════════════════════════════════════════════════════════════════════
function RegisterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const SPECS = [
    { label: "Date", value: "23 Jun 2026" },
    { label: "Time", value: "10:30 – 13:35 AST" },
    { label: "Venue", value: "Crowne Plaza Riyadh" },
    { label: "Format", value: "Invite-only roundtable" },
  ];

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", company: "", jobTitle: "", message: "",
  });
  const saIndex = COUNTRY_CODES.findIndex((c) => c.country === "SA");
  const [country, setCountry] = useState<CountryCode>(
    COUNTRY_CODES[saIndex >= 0 ? saIndex : 0]
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (e.target.name === "phone") setPhoneError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const phoneErr = validatePhone(form.phone, country);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }
    setLoading(true);
    const result = await submitForm({
      type: "attend",
      full_name: form.fullName,
      email: form.email,
      company: form.company,
      job_title: form.jobTitle,
      phone: `${country.code} ${form.phone}`,
      event_name: "Proofpoint Executive Roundtable — Riyadh 2026",
      metadata: { message: form.message },
    });
    setLoading(false);
    if (result.success) setSubmitted(true);
    else setErrorMsg(result.error || "Something went wrong. Please try again.");
  };

  return (
    <section
      ref={ref}
      id="register"
      style={{
        background: PP_CREAM,
        padding: "clamp(80px, 10vh, 130px) 0",
        position: "relative",
        borderTop: `1px solid ${PP_HAIRLINE}`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 56px)",
        }}
      >
        <div
          className="pp-register-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
            gap: "clamp(40px, 5vw, 80px)",
            alignItems: "start",
          }}
        >
          {/* RIGHT — editorial copy (rendered second in JSX, but appears on the right) */}
          <div
            className="pp-register-copy"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
              position: "sticky",
              top: 100,
              order: 2,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "var(--font-outfit), system-ui, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: PP_CYAN,
                marginBottom: 22,
              }}
            >
              <span style={{ width: 22, height: 1, background: PP_CYAN }} />
              Request Invitation
            </span>

            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(28px, 3.6vw, 48px)",
                fontWeight: 700,
                letterSpacing: "-0.026em",
                lineHeight: 1.06,
                color: PP_NAVY,
                margin: 0,
                maxWidth: 480,
              }}
            >
              Request your invitation<span style={{ color: PP_CYAN }}>.</span>
            </h2>

            {/* Event spec strip — facts derived from the brief */}
            <dl
              className="pp-register-specs"
              style={{
                margin: "clamp(28px, 3.4vh, 38px) 0 0",
                paddingTop: "clamp(22px, 2.6vh, 28px)",
                borderTop: `1px solid ${PP_HAIRLINE}`,
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                columnGap: "clamp(20px, 2.4vw, 36px)",
                rowGap: 18,
              }}
            >
              {SPECS.map((s) => (
                <React.Fragment key={s.label}>
                  <dt
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-outfit), system-ui, sans-serif",
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: PP_GRAY,
                      alignSelf: "center",
                    }}
                  >
                    {s.label}
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "clamp(14px, 1.1vw, 16px)",
                      fontWeight: 600,
                      letterSpacing: "-0.012em",
                      color: PP_NAVY,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {s.value}
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          </div>

          {/* LEFT — form card (rendered second in JSX, but appears on the left) */}
          <div
            className="pp-register-form"
            style={{
              background: `linear-gradient(180deg, #EAF3FC 0%, #D7E5F4 100%)`,
              borderRadius: 24,
              padding: "clamp(28px, 3vw, 44px)",
              boxShadow:
                "0 24px 64px rgba(0,180,240,0.10), 0 4px 16px rgba(14,37,65,0.05)",
              border: `1px solid rgba(0,180,240,0.18)`,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1.1s 0.15s cubic-bezier(0.22,1,0.36,1), transform 1.1s 0.15s cubic-bezier(0.22,1,0.36,1)",
              order: 1,
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "clamp(36px, 6vh, 56px) 12px" }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: PP_CYAN,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 22,
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12l5 5L20 7"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "clamp(22px, 2vw, 28px)",
                    fontWeight: 700,
                    color: PP_NAVY,
                    margin: "0 0 8px",
                  }}
                >
                  Request received.
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-outfit), system-ui, sans-serif",
                    fontSize: 14,
                    color: PP_GRAY,
                    margin: 0,
                  }}
                >
                  Our team will be in touch within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Row 1 — Full Name | Work Email */}
                <div className="pp-form-row">
                  <FormField
                    label="Full Name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    label="Work Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone with country code — full width */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "var(--font-outfit), system-ui, sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: PP_GRAY,
                      marginBottom: 8,
                    }}
                  >
                    Phone Number<span style={{ color: PP_CYAN, marginLeft: 4 }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      value={country.country}
                      onChange={(e) => {
                        const c = COUNTRY_CODES.find((c) => c.country === e.target.value);
                        if (c) {
                          setCountry(c);
                          // Truncate phone to new country's max digit length
                          setForm((p) => ({
                            ...p,
                            phone: p.phone.replace(/\D/g, "").slice(0, c.length),
                          }));
                          setPhoneError(null);
                        }
                      }}
                      style={{
                        padding: "12px 10px",
                        borderRadius: 10,
                        border: `1px solid rgba(0,180,240,0.20)`,
                        background: PP_WHITE,
                        fontFamily: "var(--font-outfit), system-ui, sans-serif",
                        fontSize: 14,
                        color: PP_NAVY,
                        minWidth: 110,
                        cursor: "pointer",
                      }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.country} value={c.country}>
                          {c.country} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={form.phone}
                      onChange={(e) => {
                        // Strip non-digits + cap at country's required digit count
                        const digits = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, country.length);
                        setForm((p) => ({ ...p, phone: digits }));
                        setPhoneError(null);
                      }}
                      required
                      maxLength={country.length}
                      placeholder={country.placeholder}
                      style={{
                        flex: 1,
                        padding: "12px 14px",
                        borderRadius: 10,
                        border: `1px solid ${phoneError ? "#E53935" : "rgba(0,180,240,0.20)"}`,
                        background: PP_WHITE,
                        fontFamily: "var(--font-outfit), system-ui, sans-serif",
                        fontSize: 14,
                        color: PP_NAVY,
                        outline: "none",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    />
                  </div>

                  {/* Digit-count hint (or error if validation fails on submit) */}
                  {phoneError ? (
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontFamily: "var(--font-outfit), system-ui, sans-serif",
                        fontSize: 12,
                        color: "#E53935",
                      }}
                    >
                      {phoneError}
                    </p>
                  ) : (
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontFamily: "var(--font-outfit), system-ui, sans-serif",
                        fontSize: 11.5,
                        color:
                          form.phone.length === country.length
                            ? PP_CYAN_DEEP
                            : PP_GRAY,
                        letterSpacing: "0.04em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {form.phone.length} / {country.length} digits &middot;{" "}
                      {country.name}
                    </p>
                  )}
                </div>

                {/* Row 3 — Company | Job Title */}
                <div className="pp-form-row">
                  <FormField
                    label="Company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    label="Job Title"
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                    required
                  />
                </div>

                <FormField
                  label="Message (Optional)"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  textarea
                />

                {errorMsg && (
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-outfit), system-ui, sans-serif",
                      fontSize: 13,
                      color: "#E53935",
                    }}
                  >
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="pp-form-submit"
                  style={{
                    marginTop: 6,
                    padding: "15px 28px",
                    borderRadius: 999,
                    border: "none",
                    background: `linear-gradient(135deg, ${PP_CYAN} 0%, ${PP_CYAN_DEEP} 100%)`,
                    fontFamily: "var(--font-outfit), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: PP_WHITE,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    boxShadow: `0 8px 24px ${PP_CYAN}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  }}
                >
                  {loading ? "Submitting…" : "Request Invitation"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .pp-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .pp-form-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px ${PP_CYAN}55, inset 0 1px 0 rgba(255,255,255,0.35);
        }
        @media (max-width: 900px) {
          .pp-register-grid {
            grid-template-columns: 1fr !important;
          }
          .pp-register-copy {
            position: relative !important;
            top: auto !important;
            order: 1 !important;
          }
          .pp-register-form {
            order: 2 !important;
          }
        }
        @media (max-width: 560px) {
          .pp-form-row {
            grid-template-columns: 1fr !important;
            gap: 18px;
          }
        }
      `}</style>
    </section>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  textarea = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const baseStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid rgba(0,180,240,0.20)`,
    background: PP_WHITE,
    fontFamily: "var(--font-outfit), system-ui, sans-serif",
    fontSize: 14,
    color: PP_NAVY,
    outline: "none",
    resize: textarea ? "vertical" : undefined,
  };
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: PP_GRAY,
          marginBottom: 8,
        }}
      >
        {label}
        {required && <span style={{ color: PP_CYAN, marginLeft: 4 }}>*</span>}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={3}
          style={baseStyle}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          style={baseStyle}
        />
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═════════════════════════════════════════════════════════════════════════════
function ProofpointFooter() {
  return (
    <footer
      style={{
        background: PP_NAVY_DEEP,
        padding: "clamp(48px, 6vh, 72px) 0 32px",
        borderTop: `1px solid ${PP_HAIRLINE}`,
      }}
    >
      <div
        className="pp-footer-row"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 56px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "clamp(12px, 2vw, 24px)",
          flexWrap: "nowrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <ProofpointLogo inverted size={40} />
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "var(--font-outfit), system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <span>Produced by</span>
          <a
            href="https://www.eventsfirstgroup.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Events First Group"
            style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
          >
            <img
              src="/events-first-group_logo_alt.svg"
              alt="Events First Group"
              style={{ height: 36, width: "auto", display: "block", opacity: 0.85 }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function ProofpointPage() {
  return (
    <div
      style={{
        background: PP_WHITE,
        color: PP_NAVY,
        fontFamily: "var(--font-outfit), system-ui, sans-serif",
      }}
    >
      <ProofpointNav />
      <HeroSection />
      <OverviewSection />
      <SpeakersSection />
      <AgendaSection />
      <AboutSection />
      <VenueSection />
      <RegisterSection />
      <ProofpointFooter />
    </div>
  );
}
