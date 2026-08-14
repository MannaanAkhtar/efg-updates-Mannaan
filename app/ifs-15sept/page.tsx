"use client";

import React, { useRef, useState, useEffect } from "react";
import { useInView, motion } from "framer-motion";
import { submitForm, isWorkEmail } from "@/lib/form-helpers";

// ─── IFS Design Tokens — sourced from IFS Brand Guidelines v6.0 ──────────────
// Tier 1 (primary): Midnight Purple + Dark Purple
// Tier 2 (highlights, used with Tier 1): Light Purple + Purple + Light Blue
// Tier 3 (secondary highlights, sparingly): Green + Fuchsia
const IFS_BG = "#170430";          // Tier 1 · Midnight Purple — page base
const IFS_BG_DEEP = "#0A0218";     // Deepest darkening (off-spec, for footer/depth)
const IFS_DARK_PURPLE = "#360065"; // Tier 1 · Dark Purple
const IFS_BG_CARD = "#250146";     // Card surface, between Tier 1 mid + dark
const IFS_BG_INNER = "#1B0338";    // Inner card / form surface

const IFS_LIGHT_PURPLE = "#CD92FF"; // Tier 2 · Light Purple
const IFS_PURPLE = "#8427E2";      // Tier 2 · Purple
const IFS_LIGHT_BLUE = "#72C9F8";  // Tier 2 · Light Blue
const IFS_PURPLE_GLOW = "#CD92FF"; // Alias kept for legacy refs

const IFS_GREEN = "#33FF94";       // Tier 3 · Green — CTA + Why/Who heading accent
const IFS_GREEN_DEEP = "#1FB571";  // Hover state (derived)
const IFS_FUCHSIA = "#E00072";     // Tier 3 · Fuchsia — Agenda heading accent

const IFS_WHITE = "#FFFFFF";
const IFS_MUTE = "rgba(255,255,255,0.78)";
const IFS_FAINT = "rgba(255,255,255,0.52)";
const IFS_BORDER = "rgba(205,146,255,0.22)"; // Derived from Light Purple
const IFS_HAIRLINE = "rgba(255,255,255,0.08)";

// Dark page foundation — the BrandMeshBackground component layers the
// brand-spec circular gradient discs on top of this base.
const IFS_MESH_BASE = `linear-gradient(180deg, #07010C 0%, #0C021A 50%, #07010C 100%)`;

const IFS_LOGO =
  "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/ifs_logo_negative_rgb-1.svg";

// ─── Data ────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: "overview", label: "Overview" },
  { id: "gain", label: "What You'll Gain" },
  { id: "agenda", label: "Agenda" },
  { id: "speakers", label: "Speakers" },
  { id: "access", label: "Register" },
];

const EVENT_DATE_ISO = "2026-09-15T09:30:00+03:00";
const HERO_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/IFS-jedda.jpg";
const OVERVIEW_IMAGE = "https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/shortage-chips-car-manufacturing-industrial-line-production-electronic-circuit-boards-with-chips.jpg";

const SPEAKERS = [
  {
    name: "Mohammed Sa'Adeh",
    role: "Country Leader — Saudi Arabia, IFS",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Mohammed_Saadeh.png" as string | null,
    initials: "MS",
    linkedin: "https://www.linkedin.com/in/mohammed-sa-adeh-76393a14/",
  },
  {
    name: "Thomas Heckmann",
    role: "Chief Solution Architect, IFS",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Tom+Heckmann-3+(1).jpg" as string | null,
    initials: "TH",
    linkedin: "https://www.linkedin.com/in/tomheckmann/" as string | null,
  },
  {
    name: "Keerthie Maruthapillai",
    role: "Solution Architect, IFS",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Keerthie1.jpg" as string | null,
    initials: "KM",
    linkedin: "https://www.linkedin.com/in/keerthie/",
  },
];

// ─── Event Overview copy ─────────────────────────────────────────────────────
const OVERVIEW_PARAS = [
  "The future of manufacturing is no longer about automation alone. It is about intelligence — AI-driven systems that think, adapt, and act in real time, working alongside people to drive better business outcomes. Over the next decade, artificial intelligence will fundamentally reshape how factories operate, how leaders make decisions, and how value is created.",
  "While much of the industry is still discussing AI's potential, leading manufacturers are already embedding industrial AI into core workflows to improve margins, increase resilience, and accelerate growth. The next era of manufacturing pairs human expertise with AI-powered intelligence to deliver measurable impact without disrupting existing operations.",
  "This exclusive roundtable brings manufacturing leaders together to cut through the AI noise and have an honest discussion on what works, what doesn't, and how to move forward aligned to Saudi Arabia's Future Factories Program and Vision 2030 ambitions.",
];

// ─── What You'll Gain — four premium cards ───────────────────────────────────
const GAIN_CARDS: { text: string; icon: React.ReactNode }[] = [
  {
    text: "Understand how AI is redefining the manufacturing landscape with greater speed and efficiency.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" />
        <line x1="12" y1="1.5" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22.5" />
        <line x1="1.5" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22.5" y2="12" />
      </svg>
    ),
  },
  {
    text: "Discover where AI is delivering real ROI today and how to prioritize your investments.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="5" y1="21" x2="5" y2="12" /><line x1="12" y1="21" x2="12" y2="4" /><line x1="19" y1="21" x2="19" y2="9" />
      </svg>
    ),
  },
  {
    text: "Experience exclusive demonstrations of AI agents, smart production planning, and IFS.ai capabilities.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="4" y="8" width="16" height="12" rx="2" /><path d="M9 8V5a3 3 0 0 1 6 0v3" />
        <circle cx="9" cy="14" r="1" /><circle cx="15" cy="14" r="1" />
      </svg>
    ),
  },
  {
    text: "Participate in executive conversations defining the next generation of Saudi factories.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
];

const AGENDA: { time: string; title: string; highlight?: boolean }[] = [
  { time: "09:30 AM – 10:00 AM", title: "Coffee & Networking" },
  { time: "10:00 AM – 10:05 AM", title: "Welcome" },
  { time: "10:05 AM – 10:30 AM", title: "Session 1: AI for Manufacturing — From Disruption to Dominance", highlight: true },
  { time: "10:30 AM – 11:00 AM", title: "Session 2: AI in Action — Smart Manufacturing with IFS.ai", highlight: true },
  { time: "11:00 AM – 11:30 AM", title: "Session 3: IFS Powering Saudi's Future Factories", highlight: true },
  { time: "11:30 AM – 12:00 PM", title: "Open Q&A" },
  { time: "12:00 PM – 12:30 PM", title: "Lunch Break & Networking" },
];

const INDUSTRIES = [
  "Logistics & Transportation",
  "Manufacturing",
  "Retail & E-commerce",
  "Aerospace & Defence",
  "Energy & Utilities",
  "Automotive",
  "Pharmaceuticals & Healthcare",
  "Construction & Engineering",
  "Telecommunications",
  "Food & Beverage",
  "Government & Public Sector",
  "Other",
];

// Focused on KSA/UAE first, then a broader Gulf + region list.
const COUNTRIES = [
  "Saudi Arabia",
  "United Arab Emirates",
  "Bahrain",
  "Kuwait",
  "Oman",
  "Qatar",
  "Jordan",
  "Lebanon",
  "Egypt",
  "Turkey",
  "Pakistan",
  "India",
  "United Kingdom",
  "United States",
  "Germany",
  "France",
  "Netherlands",
  "Sweden",
  "Singapore",
  "South Africa",
  "Other",
];

// ─── IFS Lockup ──────────────────────────────────────────────────────────────
function IfsLogo({ size = 32 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={IFS_LOGO}
      alt="IFS"
      style={{ height: size, width: "auto", display: "block" }}
    />
  );
}

// ─── Brand Mesh Background — IFS "Mesh + Circular Gradients" composition ────
// Implements Step 3 + Step 4 of the IFS Visual Identity System:
//   • Two same-size CIRCULAR shapes, each filled with a LINEAR gradient running
//     in OPPOSITE directions (135° and 315°)
//   • Discs are oversized and offset so only ARC portions cut through the
//     viewport — producing the brand book's visible curved boundary lines
//   • Zero blur to preserve the sharp curved edge (the visible arc IS the brand
//     motif, not a soft glow halo)
//   • No blend mode — straight alpha compositing over the dark base
// Fixed to the viewport so the mesh acts as a single, consistent page identity
// behind all sections (matches the brand book's per-page composition model).
function BrandMeshBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: IFS_MESH_BASE,
      }}
    >
      {/* Disc 1 — Light Purple → Purple → Dark Purple, gradient running 135°
          (top-left to bottom-right). Anchored at bottom-left of the viewport
          so its top-right arc cuts diagonally across the lower-left quadrant.
          No size caps — discs scale 1:1 with viewport width so the
          composition stays identical from mobile to ultrawide. */}
      <div
        style={{
          position: "absolute",
          left: "-32vw",
          bottom: "-30vh",
          width: "120vw",
          height: "120vw",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${IFS_LIGHT_PURPLE} 0%, ${IFS_PURPLE} 32%, ${IFS_DARK_PURPLE} 62%, ${IFS_BG} 88%)`,
        }}
      />
      {/* Disc 2 — Light Blue → Purple → Dark Purple, gradient running 315°
          (bottom-left to top-right). Anchored at top-right of the viewport so
          its bottom-left arc cuts diagonally across the upper-right quadrant.
          Overlaps Disc 1 in the centre per Step 4 of the brand book. */}
      <div
        style={{
          position: "absolute",
          right: "-30vw",
          top: "-22vh",
          width: "110vw",
          height: "110vw",
          borderRadius: "50%",
          background: `linear-gradient(315deg, ${IFS_LIGHT_BLUE} 0%, ${IFS_PURPLE} 36%, ${IFS_DARK_PURPLE} 64%, ${IFS_BG} 90%)`,
        }}
      />
      {/* Subtle dark wash to ground the centre and prevent the two discs from
          competing — preserves the visible arc boundaries on the outside while
          tempering the mid-overlap luminosity. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, ${IFS_BG_DEEP}66 60%, ${IFS_BG_DEEP}aa 100%)`,
        }}
      />

      {/* Cinematic corner vignette — final layer. Adds a wider, deeper
          falloff focused on the four viewport corners so the disc composition
          reads as bright luminous forms framed by edge shadow. Wide
          transparent centre (≤55%) preserves the disc arcs; the outer 18%
          ramps to pure black at the corners for the poster-framed brand
          book feel. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 115% 95% at 50% 50%, transparent 0%, transparent 55%, ${IFS_BG_DEEP}55 78%, ${IFS_BG_DEEP}cc 92%, #000000 100%)`,
        }}
      />
    </div>
  );
}

// ─── Stacked Circles — brand-signature decorative motif ──────────────────────
// Two outline circles with a larger gradient-filled core circle between them,
// matching the IFS Visual Identity System's Gradient Circular Pattern construction.
function StackedCircles({
  size = 220,
  startColor = IFS_PURPLE,
  endColor = IFS_FUCHSIA,
  rotate = -20,
  opacity = 1,
  className,
  style,
}: {
  size?: number;
  startColor?: string;
  endColor?: string;
  rotate?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const gradId = React.useId();
  const outer = size * 0.34;
  const core = size * 0.78;
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={{
        display: "block",
        transform: `rotate(${rotate}deg)`,
        opacity,
        ...style,
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>
      {/* End circle 1 (start color, outline) */}
      <circle cx={outer / 2 + 4} cy="100" r={outer / 2} fill="none" stroke={startColor} strokeWidth="2" />
      {/* End circle 2 (end color, outline) */}
      <circle cx={200 - outer / 2 - 4} cy="100" r={outer / 2} fill="none" stroke={endColor} strokeWidth="2" />
      {/* Central gradient fill circle */}
      <circle cx="100" cy="100" r={core / 2} fill={`url(#${gradId})`} />
    </svg>
  );
}

// ─── Divider Title — section heading lifted from the brand book chapter style ─
// Small uppercase eyebrow + thin hairline rule + large display heading.
function DividerTitle({
  eyebrow,
  title,
  accent = IFS_GREEN,
  align = "left",
  titleColor = IFS_WHITE,
  maxWidth,
  trailing,
}: {
  eyebrow: string;
  title: React.ReactNode;
  accent?: string;
  align?: "left" | "center";
  titleColor?: string;
  maxWidth?: number | string;
  trailing?: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: align === "center" ? "center" : "flex-start",
      textAlign: align,
      maxWidth,
    }}>
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        fontFamily: "var(--font-outfit)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.34em",
        textTransform: "uppercase",
        color: accent,
      }}>
        <span aria-hidden style={{
          display: "inline-block",
          width: 36, height: 1,
          background: accent,
          opacity: 0.85,
        }} />
        {eyebrow}
      </span>
      <span aria-hidden style={{
        display: "block",
        width: "100%",
        maxWidth: 580,
        height: 1,
        marginTop: 14,
        background: `linear-gradient(90deg, ${accent}66 0%, ${accent}11 60%, transparent 100%)`,
      }} />
      <h2 style={{
        margin: "20px 0 0",
        fontFamily: "var(--font-display)",
        fontSize: "clamp(28px, 4vw, 44px)",
        fontWeight: 800,
        letterSpacing: "-0.028em",
        color: titleColor,
        lineHeight: 1.1,
      }}>
        {title}
      </h2>
      {trailing}
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function IfsNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: scrolled ? "10px 0" : "16px 0",
        background: scrolled ? "rgba(15, 6, 40, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        borderBottom: scrolled ? `1px solid ${IFS_HAIRLINE}` : "1px solid transparent",
        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 48px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 24,
      }}>
        <a
          href="#top"
          onClick={(e) => goTo(e, "top")}
          style={{ display: "inline-flex", alignItems: "center", gap: 14, textDecoration: "none" }}
        >
          <IfsLogo size={36} />
          <span aria-hidden style={{ width: 1, height: 22, background: IFS_HAIRLINE }} />
          <span style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.32em", textTransform: "uppercase",
            color: IFS_MUTE,
          }}>
            Executive Roundtable · Jeddah
          </span>
        </a>

        <div className="ifs-nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => goTo(e, l.id)}
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13.5, fontWeight: 500,
                color: IFS_WHITE,
                textDecoration: "none",
                opacity: 0.85,
                transition: "opacity 0.25s ease, color 0.25s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = IFS_GREEN; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.color = IFS_WHITE; }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#access"
          onClick={(e) => goTo(e, "access")}
          className="ifs-nav-cta"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 22px",
            borderRadius: 999,
            background: IFS_GREEN,
            color: IFS_BG_DEEP,
            fontFamily: "var(--font-outfit)",
            fontSize: 13, fontWeight: 700,
            letterSpacing: "0.01em",
            textDecoration: "none",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: `0 8px 20px ${IFS_GREEN}33, inset 0 1px 0 rgba(255,255,255,0.4)`,
            transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
            whiteSpace: "nowrap",
          }}
        >
          Reserve Seat
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen((o) => !o)}
          className="ifs-nav-toggle"
          style={{
            display: "none",
            width: 38, height: 38,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${IFS_HAIRLINE}`,
            borderRadius: 10,
            color: IFS_WHITE,
            cursor: "pointer",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "auto" }}>
            {open ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
      </div>

      {open && (
        <div className="ifs-nav-mobile" style={{
          marginTop: 8,
          padding: "12px 20px 18px",
          borderTop: `1px solid ${IFS_HAIRLINE}`,
          background: "rgba(15,6,40,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => goTo(e, l.id)}
              style={{
                display: "block",
                padding: "10px 0",
                fontFamily: "var(--font-outfit)",
                fontSize: 14, fontWeight: 500,
                color: IFS_WHITE,
                textDecoration: "none",
                borderBottom: `1px solid ${IFS_HAIRLINE}`,
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 880px) {
          .ifs-nav-links { display: none !important; }
          .ifs-nav-cta { display: none !important; }
          .ifs-nav-toggle { display: inline-flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </nav>
  );
}

// ─── LinkedIn Badge — small icon link, brand-tinted ──────────────────────────
function LinkedInBadge({
  url,
  speakerName,
  size = 30,
}: { url: string; speakerName: string; size?: number }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${speakerName} on LinkedIn`}
      className="ifs-linkedin-badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${IFS_LIGHT_BLUE} 0%, ${IFS_PURPLE} 100%)`,
        border: `1px solid ${IFS_LIGHT_BLUE}55`,
        boxShadow: `0 4px 12px ${IFS_LIGHT_BLUE}33, inset 0 1px 0 rgba(255,255,255,0.18)`,
        color: IFS_BG_DEEP,
        textDecoration: "none",
        transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease",
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    </a>
  );
}

// ─── Avatar (initials placeholder until photo is supplied) ───────────────────
function SpeakerAvatar({
  photo,
  initials,
  size = 72,
}: { photo: string | null; initials: string; size?: number }) {
  return (
    <div style={{
      flexShrink: 0,
      width: size, height: size,
      borderRadius: "50%",
      padding: 2,
      background: `linear-gradient(135deg, ${IFS_PURPLE_GLOW}66 0%, ${IFS_PURPLE}33 60%, ${IFS_GREEN}33 100%)`,
      boxShadow: `0 8px 24px rgba(0,0,0,0.4)`,
    }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: "50%",
        background: `linear-gradient(165deg, ${IFS_DARK_PURPLE} 0%, ${IFS_BG_DEEP} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 18%",
            }}
          />
        ) : (
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: size * 0.32,
            fontWeight: 700,
            color: IFS_PURPLE_GLOW,
            letterSpacing: "-0.01em",
          }}>
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Hero Chip — pill-shaped detail badge with icon + label ─────────────────
function HeroChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 18px",
        borderRadius: 999,
        background: "rgba(0,0,0,0.35)",
        border: `1px solid ${IFS_BORDER}`,
        fontFamily: "var(--font-outfit)",
        fontSize: 13.5,
        fontWeight: 600,
        color: IFS_WHITE,
        letterSpacing: "0.005em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: `${IFS_PURPLE}30`,
          border: `1px solid ${IFS_PURPLE_GLOW}55`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: IFS_PURPLE_GLOW,
        }}
      >
        {icon}
      </span>
      {children}
    </span>
  );
}

// ─── Countdown Timer — DAYS / HRS / MIN / SEC tiles ──────────────────────────
function CountdownTimer({ targetIso }: { targetIso: string }) {
  const [parts, setParts] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      setParts({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const units = parts
    ? [
        { v: pad(parts.days), l: "DAYS" },
        { v: pad(parts.hours), l: "HRS" },
        { v: pad(parts.mins), l: "MIN" },
        { v: pad(parts.secs), l: "SEC" },
      ]
    : [
        { v: "--", l: "DAYS" },
        { v: "--", l: "HRS" },
        { v: "--", l: "MIN" },
        { v: "--", l: "SEC" },
      ];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "14px 22px",
        borderRadius: 16,
        background: "rgba(0,0,0,0.4)",
        border: `1px solid ${IFS_BORDER}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.3)`,
      }}
    >
      {units.map((u, i) => (
        <React.Fragment key={u.l}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 54,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: IFS_WHITE,
                lineHeight: 1,
              }}
            >
              {u.v}
            </span>
            <span
              style={{
                marginTop: 6,
                fontFamily: "var(--font-outfit)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: IFS_FAINT,
              }}
            >
              {u.l}
            </span>
          </div>
          {i < units.length - 1 && (
            <span
              aria-hidden
              style={{
                width: 1,
                height: 36,
                marginInline: 14,
                background: IFS_HAIRLINE,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="top"
      style={{
        position: "relative",
        overflow: "hidden",
        background: IFS_BG_DEEP,
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        paddingTop: "clamp(92px, 12vh, 124px)",
        paddingBottom: "clamp(36px, 5vh, 64px)",
      }}
    >
      {/* Full-bleed hero image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt="IFS executive roundtable — the next decade of intelligent manufacturing in Saudi Arabia"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
      />
      {/* Legibility scrim — darker on the left where the copy sits */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, background: `linear-gradient(100deg, rgba(8,2,20,0.90) 0%, rgba(10,3,26,0.74) 34%, rgba(15,6,40,0.40) 60%, rgba(15,6,40,0.10) 82%, transparent 100%)` }} />

      <div style={{
        position: "relative", zIndex: 2,
        width: "100%",
        maxWidth: 1280, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 48px)",
      }}>
        <div id="overview" className="ifs-hero-grid" style={{ display: "block" }}>
          {/* Copy column, overlaid on the hero image */}
          <div style={{ maxWidth: 780 }}>
            {/* LIVE event kicker */}
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                marginBottom: 16,
                fontFamily: "var(--font-outfit)",
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.34em", textTransform: "uppercase",
                color: IFS_PURPLE_GLOW,
              }}
            >
              <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: IFS_GREEN, boxShadow: `0 0 8px ${IFS_GREEN}` }} />
              Executive Roundtable · Jeddah
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, ease: [0.22,1,0.36,1] }}
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(30px, 4.4vw, 52px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
                color: IFS_WHITE,
              }}
            >
              Next Decade of Manufacturing in Saudi Arabia
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22,1,0.36,1] }}
              style={{
                margin: "12px 0 0",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(19px, 2vw, 26px)",
                fontWeight: 500,
                letterSpacing: "-0.015em",
                color: IFS_WHITE,
                lineHeight: 1.25,
              }}
            >
              Driven by Industrial AI. Built for Real Business Value.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22,1,0.36,1] }}
              style={{
                margin: "14px 0 0",
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(14px, 1.1vw, 16px)",
                color: IFS_MUTE,
                lineHeight: 1.55,
                maxWidth: 560,
              }}
            >
              An exclusive executive roundtable for manufacturing leaders — an honest,
              vendor-neutral conversation on where industrial AI is already delivering real
              business value, aligned to Saudi Arabia&apos;s Future Factories Program and Vision 2030.
            </motion.p>

            {/* Detail chips — date / time / venue */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22,1,0.36,1] }}
              style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 10 }}
            >
              <HeroChip
                icon={
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
              >
                15 September 2026
              </HeroChip>
              <HeroChip
                icon={
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
              >
                09:30 AM – 12:30 PM (AST)
              </HeroChip>
              <HeroChip
                icon={
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                }
              >
                The Ritz-Carlton, Jeddah
              </HeroChip>
            </motion.div>

            {/* Primary + secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22,1,0.36,1] }}
              style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 14 }}
            >
              <a
                href="#access"
                onClick={(e) => { e.preventDefault(); document.getElementById("access")?.scrollIntoView({ behavior: "smooth" }); }}
                className="ifs-hero-cta"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "14px 28px",
                  borderRadius: 999,
                  background: `linear-gradient(135deg, ${IFS_LIGHT_PURPLE} 0%, ${IFS_PURPLE} 100%)`,
                  color: IFS_WHITE,
                  fontFamily: "var(--font-outfit)",
                  fontSize: 15, fontWeight: 700,
                  letterSpacing: "0.01em",
                  textDecoration: "none",
                  border: `1px solid ${IFS_LIGHT_PURPLE}66`,
                  boxShadow: `0 14px 32px ${IFS_PURPLE}66, inset 0 1px 0 rgba(255,255,255,0.25)`,
                  transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                Reserve My Seat
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <a
                href="#agenda"
                onClick={(e) => { e.preventDefault(); document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth" }); }}
                className="ifs-hero-cta-secondary"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "14px 28px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.04)",
                  color: IFS_WHITE,
                  fontFamily: "var(--font-outfit)",
                  fontSize: 15, fontWeight: 700,
                  letterSpacing: "0.01em",
                  textDecoration: "none",
                  border: `1px solid ${IFS_BORDER}`,
                  transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                View Agenda
              </a>
            </motion.div>

            {/* Countdown to event */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22,1,0.36,1] }}
              style={{ marginTop: 16 }}
            >
              <CountdownTimer targetIso={EVENT_DATE_ISO} />
            </motion.div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .ifs-hero-cta:hover { transform: translateY(-2px); box-shadow: 0 20px 44px ${IFS_PURPLE}88, inset 0 1px 0 rgba(255,255,255,0.35) !important; }
        .ifs-hero-cta-secondary:hover { transform: translateY(-2px); background: rgba(255,255,255,0.08) !important; border-color: ${IFS_PURPLE_GLOW} !important; }
        .ifs-linkedin-badge:hover { transform: translateY(-1px) scale(1.06); box-shadow: 0 6px 18px ${IFS_LIGHT_BLUE}55, inset 0 1px 0 rgba(255,255,255,0.28) !important; }
        @media (max-width: 880px) {
          .ifs-hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Event Overview ──────────────────────────────────────────────────────────
function OverviewSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="overview-detail"
      style={{ background: "transparent", padding: "clamp(34px, 4.5vw, 56px) 0", position: "relative" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <div className="ifs-overview-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "clamp(36px, 5vw, 72px)", alignItems: "center" }}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
            style={{ position: "relative", borderRadius: 20, padding: 6, background: `linear-gradient(165deg, ${IFS_LIGHT_PURPLE}44 0%, ${IFS_PURPLE}22 45%, ${IFS_BG_INNER} 100%)`, border: `1px solid ${IFS_BORDER}`, boxShadow: `0 24px 60px rgba(0,0,0,0.5)` }}
          >
            <div style={{ position: "relative", borderRadius: 15, overflow: "hidden", aspectRatio: "4 / 3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={OVERVIEW_IMAGE} alt="Industrial AI on the smart factory floor" loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${IFS_PURPLE}22 0%, transparent 50%, rgba(23,4,48,0.35) 100%)` }} />
              <span aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${IFS_PURPLE_GLOW}, transparent)`, opacity: 0.7 }} />
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22,1,0.36,1] }}
          >
            <DividerTitle eyebrow="Event Overview" title="The Age of Intelligent Manufacturing" accent={IFS_GREEN} maxWidth={560} />
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 16 }}>
              {OVERVIEW_PARAS.map((p, i) => (
                <p key={i} style={{ margin: 0, fontFamily: "var(--font-outfit)", fontSize: "clamp(14.5px, 1.1vw, 16px)", color: IFS_MUTE, lineHeight: 1.75 }}>{p}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 880px) { .ifs-overview-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── What You'll Gain ────────────────────────────────────────────────────────
function WhatYouGainSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="gain" style={{ background: "transparent", padding: "clamp(34px, 4.5vw, 56px) 0", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }} style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}>
          <DividerTitle eyebrow="Why Attend" title={<>What you&rsquo;ll <span style={{ color: IFS_PURPLE_GLOW }}>gain</span></>} accent={IFS_FUCHSIA} maxWidth={640} />
        </motion.div>

        <div className="ifs-gain-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px, 2vw, 24px)" }}>
          {GAIN_CARDS.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.22,1,0.36,1] }}
              className="ifs-gain-card"
              style={{ position: "relative", padding: "clamp(24px, 3vw, 36px)", borderRadius: 18, background: `linear-gradient(165deg, ${IFS_BG_CARD} 0%, ${IFS_BG_INNER} 100%)`, border: `1px solid ${IFS_BORDER}`, boxShadow: `0 18px 44px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`, overflow: "hidden" }}
            >
              <span aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg, transparent, ${IFS_PURPLE_GLOW}, transparent)`, opacity: 0.55 }} />
              <span aria-hidden style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${IFS_PURPLE}44 0%, ${IFS_PURPLE}18 100%)`, border: `1px solid ${IFS_PURPLE_GLOW}44`, color: IFS_PURPLE_GLOW, marginBottom: 18 }}>
                {c.icon}
              </span>
              <p style={{ margin: 0, fontFamily: "var(--font-outfit)", fontSize: "clamp(15px, 1.15vw, 16.5px)", color: IFS_WHITE, lineHeight: 1.6, fontWeight: 500 }}>{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .ifs-gain-card { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease; }
        .ifs-gain-card:hover { transform: translateY(-4px); border-color: ${IFS_PURPLE_GLOW}77; }
        @media (max-width: 720px) { .ifs-gain-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Venue ───────────────────────────────────────────────────────────────────
const IFS_VENUE_NAME = "The Ritz-Carlton, Jeddah";
const IFS_VENUE_CITY = "Jeddah, Saudi Arabia";
const IFS_VENUE_MAP = "https://maps.app.goo.gl/sz482YUjgM2qZTXG6";
const IFS_VENUE_IMG = "https://efg-final.s3.eu-north-1.amazonaws.com/venues/ritxcarltonjeddah.jpg";

function VenueSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="venue" style={{ background: "transparent", padding: "clamp(34px, 4.5vw, 56px) 0", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }} style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}>
          <DividerTitle eyebrow="Venue" title={<>The <span style={{ color: IFS_LIGHT_BLUE }}>Ritz-Carlton</span>, Jeddah</>} accent={IFS_LIGHT_BLUE} maxWidth={640} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22,1,0.36,1] }}
          className="ifs-venue-card"
          style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", borderRadius: 20, overflow: "hidden", border: `1px solid ${IFS_BORDER}`, background: `linear-gradient(165deg, ${IFS_BG_CARD} 0%, ${IFS_BG_INNER} 100%)`, boxShadow: `0 22px 54px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)` }}
        >
          {/* Photo — links to the map */}
          <a href={IFS_VENUE_MAP} target="_blank" rel="noopener noreferrer" aria-label={`${IFS_VENUE_NAME} — view on Google Maps`} className="ifs-venue-photo" style={{ position: "relative", display: "block", minHeight: 260, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IFS_VENUE_IMG} alt={`${IFS_VENUE_NAME} — venue for the IFS Executive Roundtable`} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <span aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(120deg, transparent 40%, ${IFS_BG_INNER}88 100%)`, pointerEvents: "none" }} />
          </a>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, padding: "clamp(26px, 3.2vw, 42px)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${IFS_LIGHT_BLUE}3a 0%, ${IFS_LIGHT_BLUE}14 100%)`, border: `1px solid ${IFS_LIGHT_BLUE}44`, color: IFS_LIGHT_BLUE }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 800, letterSpacing: "-0.02em", color: IFS_WHITE, lineHeight: 1.15 }}>{IFS_VENUE_NAME}</h3>
            <p style={{ margin: 0, fontFamily: "var(--font-outfit)", fontSize: "clamp(14px, 1.1vw, 16px)", color: IFS_MUTE, lineHeight: 1.6 }}>{IFS_VENUE_CITY}</p>
            <a
              href={IFS_VENUE_MAP}
              target="_blank"
              rel="noopener noreferrer"
              className="ifs-venue-map-btn"
              style={{ marginTop: 8, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 999, background: `linear-gradient(135deg, ${IFS_LIGHT_PURPLE} 0%, ${IFS_PURPLE} 100%)`, color: IFS_WHITE, fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 700, textDecoration: "none" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              View on Google Maps
            </a>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .ifs-venue-photo img { transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .ifs-venue-card:hover .ifs-venue-photo img { transform: scale(1.05); }
        .ifs-venue-map-btn { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .ifs-venue-map-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px ${IFS_PURPLE}66; }
        @media (max-width: 720px) {
          .ifs-venue-card { grid-template-columns: 1fr !important; }
          .ifs-venue-photo { min-height: 220px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Agenda + Form ───────────────────────────────────────────────────────────
function AgendaAndFormSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Form state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Business email is required";
    else if (!isWorkEmail(email.trim())) newErrors.email = "Please use your work email — free providers are not accepted";
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!company.trim()) newErrors.company = "Company is required";
    if (!country) newErrors.country = "Please select a country";
    if (!industry) newErrors.industry = "Please select an industry";
    if (!consent) newErrors.consent = "Please confirm consent to proceed";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitState("submitting");
    setSubmitError("");
    const res = await submitForm({
      type: "contact",
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      job_title: jobTitle.trim(),
      company: company.trim(),
      event_name: "IFS Executive Roundtable — Next Decade of Manufacturing in Saudi Arabia · Jeddah 15 September 2026",
      metadata: {
        "Event Page": "IFS Executive Roundtable · Jeddah",
        "Page Section": "Reservation Form",
        "First Name": firstName.trim(),
        "Last Name": lastName.trim(),
        "Country": country,
        "Industry": industry,
        "Consent Given": "true",
      },
    });
    if (res.success) {
      setSubmitState("success");
      setEmail(""); setFirstName(""); setLastName("");
      setJobTitle(""); setCompany(""); setCountry(""); setIndustry("");
      setConsent(false);
    } else {
      setSubmitState("error");
      setSubmitError(res.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
    <section
      ref={ref}
      id="agenda"
      style={{
        background: "transparent",
        padding: "clamp(34px, 4.5vw, 56px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 940, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 48px)",
      }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          >
            <DividerTitle eyebrow="Agenda" title="How the day runs" accent={IFS_FUCHSIA} maxWidth={520} />
            <ul style={{
              listStyle: "none", padding: 0, margin: "28px 0 0",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {AGENDA.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 16,
                    alignItems: "center",
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: item.highlight
                      ? `linear-gradient(135deg, ${IFS_PURPLE}22 0%, ${IFS_BG_INNER} 100%)`
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${item.highlight ? `${IFS_PURPLE_GLOW}40` : IFS_HAIRLINE}`,
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 11.5,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    color: item.highlight ? IFS_PURPLE_GLOW : IFS_FAINT,
                    whiteSpace: "nowrap",
                    minWidth: 128,
                  }}>
                    {item.time}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: "clamp(14px, 1.05vw, 15.5px)",
                    color: IFS_WHITE,
                    fontWeight: item.highlight ? 700 : 500,
                    lineHeight: 1.45,
                  }}>
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
            <p style={{
              margin: "22px 0 0",
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              color: IFS_FAINT,
              lineHeight: 1.6,
              fontStyle: "italic",
            }}>
              Timings are in Arabia Standard Time (AST). Agenda subject to minor changes.
            </p>
          </motion.div>
      </div>
    </section>

    {/* Register — its own section */}
    <section
      id="access"
      style={{
        background: "transparent",
        padding: "clamp(4px, 1vw, 12px) 0 clamp(40px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 640, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 48px)",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "clamp(22px, 3vw, 34px)" }}
        >
          <DividerTitle eyebrow="Register" title={<>Reserve your <span style={{ color: IFS_PURPLE_GLOW }}>seat</span></>} accent={IFS_GREEN} align="center" maxWidth={560} />
        </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22,1,0.36,1] }}
            style={{
              position: "relative",
              padding: "clamp(24px, 3vw, 36px)",
              borderRadius: 20,
              background: `linear-gradient(165deg, ${IFS_BG_INNER} 0%, ${IFS_BG_DEEP} 100%)`,
              border: `1px solid ${IFS_BORDER}`,
              boxShadow: `0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`,
              overflow: "hidden",
            }}
          >
            <span aria-hidden style={{
              position: "absolute", top: 0, left: "8%", right: "8%", height: 1,
              background: `linear-gradient(90deg, transparent, ${IFS_PURPLE_GLOW}, transparent)`,
              opacity: 0.7,
            }} />

            {submitState === "success" ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 60, height: 60, borderRadius: "50%",
                  background: IFS_GREEN,
                  marginBottom: 18,
                  boxShadow: `0 12px 32px ${IFS_GREEN}55`,
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={IFS_BG_DEEP} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(20px, 2vw, 24px)",
                  fontWeight: 700,
                  color: IFS_WHITE,
                }}>
                  Seat reserved.
                </h3>
                <p style={{
                  margin: "12px auto 0",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14.5,
                  color: IFS_MUTE,
                  lineHeight: 1.6,
                  maxWidth: 380,
                }}>
                  We&rsquo;ll email your reservation details and venue access to your
                  work address shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input type="text" name="website" tabIndex={-1} autoComplete="off"
                  style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

                <Field label="Business Email" error={errors.email} required>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }}
                    placeholder="name@company.com"
                    autoComplete="email"
                    className="ifs-input"
                    aria-invalid={!!errors.email}
                  />
                </Field>

                <div className="ifs-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="First Name" error={errors.firstName} required>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); if (errors.firstName) setErrors({ ...errors, firstName: "" }); }}
                      autoComplete="given-name"
                      className="ifs-input"
                      aria-invalid={!!errors.firstName}
                    />
                  </Field>
                  <Field label="Last Name" error={errors.lastName} required>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); if (errors.lastName) setErrors({ ...errors, lastName: "" }); }}
                      autoComplete="family-name"
                      className="ifs-input"
                      aria-invalid={!!errors.lastName}
                    />
                  </Field>
                </div>

                <div className="ifs-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Job Title" error={errors.jobTitle} required>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => { setJobTitle(e.target.value); if (errors.jobTitle) setErrors({ ...errors, jobTitle: "" }); }}
                      autoComplete="organization-title"
                      className="ifs-input"
                      aria-invalid={!!errors.jobTitle}
                    />
                  </Field>
                  <Field label="Company" error={errors.company} required>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => { setCompany(e.target.value); if (errors.company) setErrors({ ...errors, company: "" }); }}
                      autoComplete="organization"
                      className="ifs-input"
                      aria-invalid={!!errors.company}
                    />
                  </Field>
                </div>

                <Field label="Country" error={errors.country} required>
                  <select
                    value={country}
                    onChange={(e) => { setCountry(e.target.value); if (errors.country) setErrors({ ...errors, country: "" }); }}
                    className="ifs-input ifs-select"
                    aria-invalid={!!errors.country}
                  >
                    <option value="">Please Select</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Industry" error={errors.industry} required>
                  <select
                    value={industry}
                    onChange={(e) => { setIndustry(e.target.value); if (errors.industry) setErrors({ ...errors, industry: "" }); }}
                    className="ifs-input ifs-select"
                    aria-invalid={!!errors.industry}
                  >
                    <option value="">Please Select</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </Field>

                {/* Consent */}
                <label style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  cursor: "pointer",
                  marginTop: 4,
                }}>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); if (errors.consent) setErrors({ ...errors, consent: "" }); }}
                    className="ifs-checkbox"
                    aria-invalid={!!errors.consent}
                  />
                  <span style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13,
                    color: IFS_MUTE,
                    lineHeight: 1.55,
                  }}>
                    By ticking this box, you agree to our processing of your data as described in our{" "}
                    <a href="https://www.eventsfirstgroup.com/privacy-policy" target="_blank" rel="noopener noreferrer"
                       style={{ color: IFS_FUCHSIA, textDecoration: "underline" }}>
                      Privacy Policy
                    </a>{" "}
                    and to receiving relevant information from us.*
                  </span>
                </label>
                {errors.consent && (
                  <span style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: 12,
                    color: "#ff7a7a",
                    marginTop: -8,
                  }}>{errors.consent}</span>
                )}

                {submitError && (
                  <div style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: "rgba(255,80,80,0.10)",
                    border: "1px solid rgba(255,80,80,0.30)",
                    color: "#ff9a9a",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 13.5,
                  }}>
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitState === "submitting"}
                  className="ifs-form-submit"
                  style={{
                    display: "inline-flex",
                    alignItems: "center", justifyContent: "center",
                    gap: 8,
                    padding: "14px 30px",
                    borderRadius: 999,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: IFS_GREEN,
                    color: IFS_BG_DEEP,
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14, fontWeight: 700,
                    letterSpacing: "0.01em",
                    cursor: submitState === "submitting" ? "not-allowed" : "pointer",
                    opacity: submitState === "submitting" ? 0.55 : 1,
                    boxShadow: `0 12px 28px ${IFS_GREEN}55, inset 0 1px 0 rgba(255,255,255,0.5)`,
                    transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                    alignSelf: "flex-start",
                    marginTop: 4,
                  }}
                >
                  {submitState === "submitting" ? "Sending…" : "Reserve My Seat"}
                </button>
              </form>
            )}
          </motion.div>
      </div>

      <style jsx global>{`
        .ifs-input {
          width: 100%;
          padding: 12px 14px;
          background: rgba(0,0,0,0.30);
          border: 1px solid ${IFS_HAIRLINE};
          border-radius: 10px;
          color: ${IFS_WHITE};
          font-family: var(--font-outfit);
          font-size: 14.5px;
          line-height: 1.4;
          outline: none;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }
        .ifs-input::placeholder { color: rgba(255,255,255,0.32); }
        .ifs-input:focus {
          border-color: ${IFS_PURPLE_GLOW};
          background: rgba(0,0,0,0.42);
          box-shadow: 0 0 0 3px ${IFS_PURPLE}33;
        }
        .ifs-input[aria-invalid="true"] { border-color: rgba(255,80,80,0.6); }
        .ifs-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          padding-right: 38px;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1l5 5 5-5' stroke='%23A78BFA' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>");
          background-repeat: no-repeat;
          background-position: right 14px center;
          cursor: pointer;
        }
        .ifs-select option { background: ${IFS_BG_DEEP}; color: ${IFS_WHITE}; }
        .ifs-checkbox {
          flex-shrink: 0;
          width: 18px; height: 18px;
          margin-top: 2px;
          accent-color: ${IFS_GREEN};
          cursor: pointer;
        }
        .ifs-form-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          background: ${IFS_GREEN_DEEP} !important;
          box-shadow: 0 16px 36px ${IFS_GREEN}77, inset 0 1px 0 rgba(255,255,255,0.55) !important;
        }
        @media (max-width: 880px) {
          .ifs-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
    </>
  );
}

// ─── Field helper ────────────────────────────────────────────────────────────
function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{
        fontFamily: "var(--font-outfit)",
        fontSize: 13, fontWeight: 600,
        color: IFS_WHITE,
        letterSpacing: "0.005em",
      }}>
        {label}{required && <span style={{ color: IFS_FUCHSIA, marginLeft: 2 }}>*</span>}
      </span>
      {children}
      {error && (
        <span style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          color: "#ff7a7a",
        }}>{error}</span>
      )}
    </label>
  );
}

// ─── About the Speakers ──────────────────────────────────────────────────────
function AboutSpeakersSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="speakers"
      style={{
        background: "transparent",
        padding: "clamp(34px, 4.5vw, 56px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Brand-signature stacked-circle ornament — top-right ambient */}
      <div aria-hidden style={{
        position: "absolute",
        top: "4%", right: "-6%",
        width: 360, height: 360,
        pointerEvents: "none",
        opacity: 0.32,
        filter: "blur(0.5px)",
      }}>
        <StackedCircles size={360} startColor={IFS_LIGHT_BLUE} endColor={IFS_PURPLE} rotate={42} />
      </div>

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 1200, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 48px)",
        display: "flex", flexDirection: "column", gap: "clamp(20px, 2.4vw, 32px)",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          style={{ marginBottom: "clamp(8px, 1.5vw, 16px)" }}
        >
          <DividerTitle eyebrow="Speakers" title="Meet the speakers" accent={IFS_LIGHT_PURPLE} maxWidth={720} />
        </motion.div>

        <div className="ifs-speakers-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(18px, 2.4vw, 28px)",
        }}>
          {SPEAKERS.map((sp, i) => (
            <motion.div
              key={sp.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.22,1,0.36,1] }}
              className="ifs-speaker-card"
              style={{
                position: "relative",
                padding: "clamp(26px, 3vw, 36px) clamp(22px, 2.5vw, 30px)",
                borderRadius: 22,
                background: `linear-gradient(165deg, ${IFS_BG_CARD} 0%, ${IFS_BG_INNER} 100%)`,
                border: `1px solid ${IFS_BORDER}`,
                boxShadow: `0 18px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 14,
              }}
            >
              <span aria-hidden style={{
                position: "absolute", top: 0, left: "8%", right: "8%", height: 1,
                background: `linear-gradient(90deg, transparent, ${IFS_PURPLE_GLOW}, transparent)`,
                opacity: 0.6,
              }} />

              <SpeakerAvatar photo={sp.photo} initials={sp.initials} size={168} />

              <div style={{ minWidth: 0 }}>
                <h3 style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(19px, 1.9vw, 23px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: IFS_WHITE,
                  lineHeight: 1.2,
                }}>
                  {sp.name}
                </h3>
                <p style={{
                  margin: "8px 0 0",
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13.5,
                  color: IFS_GREEN,
                  fontWeight: 600,
                  lineHeight: 1.45,
                }}>
                  {sp.role}
                </p>
              </div>

              {sp.linkedin && <LinkedInBadge url={sp.linkedin} speakerName={sp.name} size={34} />}
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .ifs-speaker-card { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease; }
        .ifs-speaker-card:hover { transform: translateY(-4px); border-color: ${IFS_PURPLE_GLOW}77; }
        @media (max-width: 820px) {
          .ifs-speakers-grid { grid-template-columns: 1fr !important; max-width: 420px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function IfsFooter() {
  return (
    <footer style={{
      background: IFS_BG_DEEP,
      borderTop: `1px solid ${IFS_HAIRLINE}`,
      padding: "clamp(32px, 5vw, 52px) 0 24px",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 48px)",
      }}>
        <div className="ifs-footer-row" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 24, flexWrap: "wrap",
        }}>
          <IfsLogo size={52} />

          <div className="ifs-footer-efg" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: IFS_FAINT,
            }}>
              An initiative by
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/events-first-group_logo_alt.svg"
              alt="Events First Group"
              style={{ height: 34, width: "auto", opacity: 0.7, display: "block" }}
            />
          </div>
        </div>

        <div style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: `1px solid ${IFS_HAIRLINE}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: 16, flexWrap: "wrap",
        }}>
          <p style={{
            margin: 0,
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            color: IFS_FAINT,
          }}>
            © {new Date().getFullYear()} Events First Group. All rights reserved.
          </p>
          <p style={{
            margin: 0,
            fontFamily: "var(--font-outfit)",
            fontSize: 11,
            color: IFS_FAINT,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}>
            Executive Roundtable · IFS · Jeddah, 15 September 2026
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 560px) {
          .ifs-footer-row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function IfsPage() {
  // Landing with a URL hash (e.g. #access from a short/UTM link) — native anchor
  // jumps don't take under the global smooth-scroll, so scroll to it on mount.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const id = window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div style={{
      background: IFS_BG_DEEP,
      color: IFS_WHITE,
      minHeight: "100vh",
      position: "relative",
    }}>
      <BrandMeshBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <IfsNav />
        <HeroSection />
        <OverviewSection />
        <AboutSpeakersSection />
        <WhatYouGainSection />
        <VenueSection />
        <AgendaAndFormSection />
        <IfsFooter />
      </div>
    </div>
  );
}
