"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useInView, motion } from "framer-motion";
import { submitForm, isWorkEmail, validatePhone, COUNTRY_CODES, type CountryCode } from "@/lib/form-helpers";

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

const IFS_GREEN = "#33FF94";       // Tier 3 · Green — CTA accent
const IFS_GREEN_DEEP = "#1FB571";  // Hover state (derived)
const IFS_FUCHSIA = "#E00072";     // Tier 3 · Fuchsia — section heading accent

const IFS_WHITE = "#FFFFFF";
const IFS_MUTE = "rgba(255,255,255,0.78)";
const IFS_FAINT = "rgba(255,255,255,0.52)";
const IFS_BORDER = "rgba(205,146,255,0.22)"; // Derived from Light Purple
const IFS_HAIRLINE = "rgba(255,255,255,0.08)";

// ─── Vertical rhythm ─────────────────────────────────────────────────────────
// One spacing scale for the whole page, so every section break is the same size
// instead of each section carrying its own numbers.
// SECTION_PAD sits on both the top and bottom of a section, so the gap between
// two neighbouring sections is twice this value.
const SECTION_PAD = "clamp(24px, 2.6vw, 34px)";
// Gap from a section heading (DividerTitle) down to the content it introduces.
const HEADING_GAP = "clamp(20px, 2.4vw, 28px)";

// Dark page foundation — the BrandMeshBackground component layers the
// brand-spec circular gradient discs on top of this base.
const IFS_MESH_BASE = `linear-gradient(180deg, #07010C 0%, #0C021A 50%, #07010C 100%)`;

const IFS_LOGO =
  "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/ifs_logo_negative_rgb-1.svg";

// ─── Data ────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: "overview", label: "Overview" },
  { id: "challenges", label: "Challenges" },
  { id: "segments", label: "Segments" },
  { id: "solutions", label: "Solutions" },
  { id: "services", label: "Services" },
  { id: "register", label: "Register" },
];

// Anchored to the start of the event day: no start time has been confirmed, so
// the countdown counts down to the date itself and the page never prints a
// fabricated time. Replace with the real start (and offset) once it is set.
const EVENT_DATE_ISO = "2026-10-20T09:00:00+03:00";

const HERO_IMAGE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/heros/sitecore_hero-gettyimages-1267010934.avif";

// Stock imagery, per the same pattern as the OPEX KSA page — remote Unsplash
// with an explicit width/quality so the cards don't pull full-resolution files.
const UNSPLASH = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=80`;

// Deliberately not the same shot as the Construction segment card below.
const OVERVIEW_IMAGE = UNSPLASH("1504917595217-d4dc5ebe6122");

// ─── Event overview copy ─────────────────────────────────────────────────────
const OVERVIEW_PARAS = [
  "Manage the complete asset lifecycle with integrated Construction and Engineering software solutions that connect project planning, project execution, project financial control and asset and facilities management — boosting efficiency, reducing costs, and ensuring profitability.",
  "This executive roundtable brings Construction and Engineering leaders together around that operating model: where projects are actually won and lost, which capabilities close the gap between plan and delivery, and how an integrated platform changes the economics of a portfolio rather than a single project.",
];

// ─── Industry challenges ─────────────────────────────────────────────────────
// Only the first item has body copy in the source material. The other two are
// listed by title on IFS's page without expanded text, so they carry none here
// rather than inventing copy for them.
const CHALLENGES: { title: string; body?: string }[] = [
  {
    title: "Delivering Projects On-Time and On-Budget",
    body: "Construction and Engineering organizations struggle with project delays and cost overruns. IFS Cloud ERP enables accurate forecasting, real-time visibility, and proactive risk mitigation to improve project margins and reduce overruns by integrating project planning, execution, and financial control in one platform.",
  },
  { title: "Embracing Modern Construction Methods" },
  { title: "Maximizing Asset Performance" },
];

// ─── Industry segments ───────────────────────────────────────────────────────
const SEGMENTS = [
  {
    title: "Construction",
    body: "Manage construction projects with integrated software solutions that connect project planning, execution, and financial control.",
    image: UNSPLASH("1541888946425-d81bb19240f5"),
  },
  {
    title: "Engineering",
    body: "Streamline complex engineering processes with industry-specific capabilities that support design, procurement, and project delivery.",
    image: UNSPLASH("1581091226825-a6a2a5aee158"),
  },
  {
    title: "Shipbuilding and Maritime",
    body: "Optimize shipbuilding and marine contractor operations with software that integrates and manages the complete project and asset lifecycle management process.",
    image: UNSPLASH("1578575437130-527eed3abbec"),
  },
];

// ─── Tailored solutions ──────────────────────────────────────────────────────
// `tab` is the short label on the tab strip. Each one is lifted straight from
// its own title — the acronym where the source page gives one, otherwise the
// distinguishing words — so nothing new is invented for the label.
const SOLUTIONS = [
  {
    tab: "ERP",
    title: "Enterprise Resource Planning (ERP)",
    body: "Streamline Construction and Engineering operations with IFS Cloud ERP, a fully composable AI-powered platform that integrates project planning, execution, and financial control, enabling accurate forecasting, real-time visibility, and proactive risk mitigation.",
    image: UNSPLASH("1503387762-592deb58ef4e"),
  },
  {
    tab: "FSM",
    title: "Field Service Management (FSM)",
    body: "Optimize field service operations with IFS FSM, designed to coordinate mobile workforce operations for infrastructure maintenance and service delivery, enhancing reliability, safety, and customer experience.",
    image: UNSPLASH("1621905251189-08b45d6a269e"),
  },
  {
    tab: "Asset Lifecycle",
    title: "Asset Lifecycle Management",
    body: "Manage complex assets across their lifecycle with IFS Asset Lifecycle Management, ensuring uptime and profitability through comprehensive asset lifecycle management and maintenance capabilities.",
    image: UNSPLASH("1486406146926-c627a92ad1ab"),
  },
  {
    tab: "EAM",
    title: "Enterprise Asset Management (EAM)",
    body: "Maximize asset performance with IFS EAM, a solution for managing the lifecycle of physical assets to maximize value, performance, and compliance, including maintenance, planning, and asset tracking.",
    image: UNSPLASH("1516937941344-00b4e0337589"),
  },
];

// ─── Tailored services ───────────────────────────────────────────────────────
const SERVICES: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: "IFS Success",
    body: "Maximize the value of your IFS investment with tailored success plans, expert guidance, and proactive support, helping Construction and Engineering organizations achieve operational excellence and long-term strategic goals.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="8" r="5" /><path d="M8.5 12.5L7 22l5-3 5 3-1.5-9.5" />
      </svg>
    ),
  },
  {
    title: "IFS Cloud Services",
    body: "Leverage the power of IFS Cloud Services for seamless implementation, management, and optimization of your Construction and Engineering operations, ensuring scalability, security, and continuous innovation.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6-1.6A4.2 4.2 0 0 0 6 19z" />
      </svg>
    ),
  },
  {
    title: "IFS Consulting Services",
    body: "Transform your Construction and Engineering business with IFS Consulting Services, providing expert analysis, strategy, and implementation support to drive digital transformation and achieve sustainable growth.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="13" y2="13" />
      </svg>
    ),
  },
  {
    title: "IFS Support Services",
    body: "Ensure the ongoing success of your IFS solution with comprehensive IFS Support Services, offering proactive monitoring, timely resolution, and expert guidance to minimize downtime and maximize ROI.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

// ─── Success metrics ─────────────────────────────────────────────────────────
const METRICS = [
  { value: "40%", label: "faster time to market" },
  { value: "25%", label: "increase in project margins" },
  { value: "30%", label: "reduction in operational costs" },
  { value: "95%", label: "increase in project delivery accuracy" },
];

// ─── Trusted by leaders ──────────────────────────────────────────────────────
// Analyst reports named on IFS's industry page. No destination URLs were
// supplied, so these render as plain cards rather than guessed links.
const TRUSTED = [
  {
    title: "Forrester Total Economic Impact™ of IFS Solutions Deployed in the Cloud",
    body: "Cost Savings And Business Benefits Enabled By IFS Solutions Deployed In The Cloud",
  },
  {
    title: "IDC Worldwide Asset Life-Cycle Management Applications Market Shares 2023 report",
    body: "Fastest growing among top 10 in ALM",
  },
  {
    title: "Worldwide Business Research — State of Service 2023",
    body: "A Global View into the Biggest Trends and Challenges Facing Field Service Companies Today",
  },
];

// Construction & Engineering leads the list — it is this event's theme.
const INDUSTRIES = [
  "Construction & Engineering",
  "Shipbuilding & Maritime",
  "Real Estate & Facilities Management",
  "Infrastructure & Utilities",
  "Energy & Resources",
  "Manufacturing",
  "Aerospace & Defence",
  "Oil & Gas",
  "Transportation & Logistics",
  "Government & Public Sector",
  "Telecommunications",
  "Other",
];

// Focused on GCC first, then a broader regional list.
const COUNTRIES = [
  "United Arab Emirates",
  "Saudi Arabia",
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

// Spoke endpoints for the challenge icon's radiating mark. Precomputed and
// rounded: V8 on the server and in the browser can disagree on the last bit of
// Math.cos/Math.sin, and the raw floats then serialize differently in the two
// renders, which trips React's hydration check.
const CHALLENGE_SPOKES = Array.from({ length: 12 }, (_, k) => {
  const a = (k * Math.PI) / 6;
  const r = (n: number) => Number(n.toFixed(3));
  return {
    x1: r(12 + Math.cos(a) * 5),
    y1: r(12 + Math.sin(a) * 5),
    x2: r(12 + Math.cos(a) * 8.4),
    y2: r(12 + Math.sin(a) * 8.4),
  };
});

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
          so its top-right arc cuts diagonally across the lower-left quadrant. */}
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
          (bottom-left to top-right). Anchored at top-right so its bottom-left
          arc cuts across the upper-right quadrant, overlapping Disc 1 in the
          centre per Step 4 of the brand book. */}
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
      {/* Dark wash to ground the centre so the two discs don't compete. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, ${IFS_BG_DEEP}66 60%, ${IFS_BG_DEEP}aa 100%)`,
        }}
      />
      {/* Cinematic corner vignette — wide transparent centre preserves the disc
          arcs; the outer band ramps to black for the poster-framed brand feel. */}
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

// ─── Divider Title — section heading lifted from the brand book chapter style ─
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
          <span className="ifs-nav-kicker" style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: IFS_MUTE,
            // One line or nothing — the two-line wrap made the nav look broken.
            whiteSpace: "nowrap",
          }}>
            Construction &amp; Engineering
          </span>
        </a>

        <div className="ifs-nav-links" style={{ display: "flex", alignItems: "center", gap: 26 }}>
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
          href="#register"
          onClick={(e) => goTo(e, "register")}
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
        /* The kicker is long here ("Construction & Engineering"), so it retires
           before the links do rather than squeezing them. */
        @media (max-width: 1180px) {
          .ifs-nav-kicker { display: none !important; }
        }
        @media (max-width: 980px) {
          .ifs-nav-links { display: none !important; }
          .ifs-nav-cta { display: none !important; }
          .ifs-nav-toggle { display: inline-flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </nav>
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
// `bare` drops the pill chrome so the timer can sit inside a bento tile that
// already provides its own surface.
function CountdownTimer({ targetIso, bare = false }: { targetIso: string; bare?: boolean }) {
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
      style={
        bare
          ? { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }
          : {
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 22px",
              borderRadius: 16,
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${IFS_BORDER}`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.3)`,
            }
      }
    >
      {units.map((u, i) => (
        <React.Fragment key={u.l}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: bare ? 0 : 54, flex: bare ? 1 : undefined }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: bare ? "clamp(26px, 2.6vw, 36px)" : 32,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: IFS_WHITE,
              lineHeight: 1,
            }}>
              {u.v}
            </span>
            <span style={{
              marginTop: 6,
              fontFamily: "var(--font-outfit)",
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.2em",
              color: IFS_FAINT,
            }}>
              {u.l}
            </span>
          </div>
          {i < units.length - 1 && (
            <span aria-hidden style={{ width: 1, height: 36, marginInline: bare ? 0 : 14, background: IFS_HAIRLINE }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Bento tile — shared surface for the hero grid ───────────────────────────
// The tile IS the grid item: it owns its grid-area and its own entrance
// animation. Wrapping it in a second positioned element would put the tile in a
// phantom track of an inner grid, which is what collapsed the media tile.
function BentoTile({
  area,
  delay = 0,
  children,
  padding = "clamp(20px, 2.2vw, 28px)",
  style,
  className,
}: {
  area?: string;
  delay?: number;
  children: React.ReactNode;
  padding?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`ifs-bento-tile${className ? ` ${className}` : ""}`}
      style={{
        gridArea: area,
        position: "relative",
        padding,
        borderRadius: 20,
        background: `linear-gradient(165deg, rgba(37,1,70,0.62) 0%, rgba(10,2,24,0.72) 100%)`,
        border: `1px solid ${IFS_BORDER}`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: `0 18px 44px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.06)`,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// A small labelled fact tile: icon, uppercase label, value.
function BentoFact({
  area,
  delay,
  icon,
  label,
  value,
}: { area: string; delay: number; icon: React.ReactNode; label: string; value: string }) {
  return (
    // Icon sits above the text rather than beside it: these tiles are narrow,
    // and an inline icon left too little room for "20 October 2026" to hold one
    // line.
    <BentoTile area={area} delay={delay}>
      <span aria-hidden style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, borderRadius: 11,
        background: `linear-gradient(135deg, ${IFS_PURPLE}3a 0%, ${IFS_PURPLE}12 100%)`,
        border: `1px solid ${IFS_PURPLE_GLOW}44`,
        color: IFS_PURPLE_GLOW,
        marginBottom: 14,
      }}>
        {icon}
      </span>
      <span style={{
        display: "block",
        fontFamily: "var(--font-outfit)",
        fontSize: 9.5, fontWeight: 700,
        letterSpacing: "0.26em", textTransform: "uppercase",
        color: IFS_FAINT,
      }}>
        {label}
      </span>
      <span style={{
        display: "block",
        marginTop: 6,
        fontFamily: "var(--font-display)",
        fontSize: "clamp(14.5px, 1.15vw, 17px)",
        fontWeight: 700,
        letterSpacing: "-0.015em",
        color: IFS_WHITE,
        lineHeight: 1.25,
        textWrap: "balance",
      }}>
        {value}
      </span>
    </BentoTile>
  );
}

// ─── Hero — bento grid beside a full-height image ────────────────────────────
// Two top-level columns: the image owns its whole side at full hero height, and
// the left side is a bento of copy / facts / countdown / CTA tiles.
function HeroSection() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="top"
      className="ifs-section"
      style={{
        position: "relative",
        overflow: "hidden",
        // Transparent so the brand mesh reads as the hero ground and the tiles
        // float on it.
        background: "transparent",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        paddingTop: "clamp(104px, 13vh, 132px)",
        paddingBottom: "clamp(44px, 6vh, 72px)",
      }}
    >
      <div style={{
        position: "relative", zIndex: 2,
        width: "100%",
        maxWidth: 1280, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 48px)",
      }}>
        <div
          className="ifs-hero-split"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
            gap: "clamp(12px, 1.1vw, 16px)",
            alignItems: "stretch",
          }}
        >
          {/* ── Left: the bento ── */}
          <div
            className="ifs-bento"
            style={{
              display: "grid",
              // Six columns so the fact row splits 2/2/2 and the last row 4/2.
              gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
              gridTemplateRows: "1fr auto auto",
              gridTemplateAreas: `
                "copy  copy  copy  copy  copy  copy"
                "date  date  time  time  venue venue"
                "count count count count cta   cta"
              `,
              gap: "clamp(12px, 1.1vw, 16px)",
            }}
          >
            {/* Copy */}
            <BentoTile area="copy" delay={0} padding="clamp(28px, 3vw, 42px)" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span aria-hidden style={{
                position: "absolute", top: -110, right: -110,
                width: 300, height: 300, borderRadius: "50%",
                background: `radial-gradient(circle, ${IFS_PURPLE}55 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />

              <span style={{
                position: "relative",
                display: "inline-flex", alignItems: "center", gap: 10,
                marginBottom: 18,
                fontFamily: "var(--font-outfit)",
                fontSize: 10.5, fontWeight: 700,
                letterSpacing: "0.3em", textTransform: "uppercase",
                color: IFS_PURPLE_GLOW,
              }}>
                <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: IFS_GREEN, boxShadow: `0 0 8px ${IFS_GREEN}` }} />
                IFS Executive Roundtable
              </span>

              <h1 style={{
                position: "relative",
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(30px, 3.4vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                color: IFS_WHITE,
                textWrap: "balance",
              }}>
                Construction and Engineering{" "}
                <span style={{
                  backgroundImage: `linear-gradient(95deg, ${IFS_LIGHT_PURPLE} 0%, ${IFS_LIGHT_BLUE} 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}>
                  Software Solutions
                </span>
              </h1>

              <p style={{
                position: "relative",
                margin: "16px 0 0",
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(14px, 1.05vw, 15.5px)",
                color: IFS_MUTE,
                lineHeight: 1.65,
                maxWidth: 620,
              }}>
                Manage the complete asset lifecycle with integrated Construction and Engineering
                software solutions that connect project planning, project execution, project
                financial control and asset and facilities management &mdash; boosting efficiency,
                reducing costs, and ensuring profitability.
              </p>
            </BentoTile>

            {/* Facts */}
            <BentoFact
              area="date" delay={0.14} label="Date" value="20 October 2026"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
            />
            <BentoFact
              area="time" delay={0.2} label="Time" value="To be announced"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
            />
            <BentoFact
              area="venue" delay={0.26} label="Venue" value="To be announced"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              }
            />

            {/* Countdown */}
            <BentoTile
              area="count"
              delay={0.32}
              className="ifs-bento-count"
              style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 2.2vw, 32px)" }}
            >
              <span style={{
                flexShrink: 0,
                fontFamily: "var(--font-outfit)",
                fontSize: 9.5, fontWeight: 700,
                letterSpacing: "0.26em", textTransform: "uppercase",
                color: IFS_FAINT,
                maxWidth: 84,
                lineHeight: 1.5,
              }}>
                Doors open in
              </span>
              <span aria-hidden className="ifs-count-rule" style={{ width: 1, alignSelf: "stretch", background: IFS_HAIRLINE }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <CountdownTimer targetIso={EVENT_DATE_ISO} bare />
              </div>
            </BentoTile>

            {/* CTA */}
            <BentoTile
              area="cta"
              delay={0.38}
              style={{
                background: `linear-gradient(155deg, ${IFS_PURPLE}80 0%, rgba(10,2,24,0.86) 100%)`,
                borderColor: `${IFS_LIGHT_PURPLE}55`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <a
                href="#register"
                onClick={scrollTo("register")}
                className="ifs-hero-cta"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "13px 20px",
                  borderRadius: 999,
                  background: IFS_GREEN,
                  color: IFS_BG_DEEP,
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13.5, fontWeight: 700,
                  letterSpacing: "0.01em",
                  textDecoration: "none",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: `0 12px 28px ${IFS_GREEN}55, inset 0 1px 0 rgba(255,255,255,0.5)`,
                  transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                  whiteSpace: "nowrap",
                }}
              >
                Reserve My Seat
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <span style={{
                textAlign: "center",
                fontFamily: "var(--font-outfit)",
                fontSize: 10.5,
                color: "rgba(255,255,255,0.68)",
                letterSpacing: "0.02em",
              }}>
                Invitation only &middot; limited seats
              </span>
            </BentoTile>
          </div>

          {/* ── Right: the image, its whole side, full hero height ── */}
          <BentoTile delay={0.08} padding="0" className="ifs-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE}
              alt="Construction and engineering project delivery on site"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <span aria-hidden style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(195deg, rgba(10,2,24,0.06) 0%, rgba(10,2,24,0.42) 52%, rgba(10,2,24,0.93) 100%)`,
            }} />
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: 0,
              padding: "clamp(20px, 2vw, 28px)",
            }}>
              <span style={{
                display: "block",
                fontFamily: "var(--font-outfit)",
                fontSize: 9.5, fontWeight: 700,
                letterSpacing: "0.26em", textTransform: "uppercase",
                color: IFS_PURPLE_GLOW,
              }}>
                One platform
              </span>
              <span style={{
                display: "block",
                marginTop: 8,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(16px, 1.4vw, 21px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: IFS_WHITE,
                lineHeight: 1.3,
                textWrap: "balance",
              }}>
                Plan, execute and control.
              </span>
            </div>
          </BentoTile>
        </div>
      </div>

      <style jsx global>{`
        .ifs-bento-tile { transition: border-color 0.35s ease; }
        .ifs-bento-tile:hover { border-color: ${IFS_PURPLE_GLOW}66; }
        .ifs-hero-media { min-height: 520px; }
        .ifs-hero-media img { transition: transform 0.8s cubic-bezier(0.22,1,0.36,1); }
        .ifs-hero-media:hover img { transform: scale(1.04); }
        .ifs-hero-cta:hover { transform: translateY(-2px); background: ${IFS_GREEN_DEEP} !important; box-shadow: 0 16px 34px ${IFS_GREEN}77, inset 0 1px 0 rgba(255,255,255,0.55) !important; }

        /* Tablet: the image gives up its side and becomes a banner below. */
        @media (max-width: 1040px) {
          .ifs-hero-split { grid-template-columns: minmax(0, 1fr) !important; }
          .ifs-hero-media { min-height: 260px; }
        }

        /* Narrow: one tile per row. */
        @media (max-width: 720px) {
          .ifs-bento {
            grid-template-columns: minmax(0, 1fr) !important;
            grid-template-rows: auto !important;
            grid-template-areas:
              "copy"
              "date"
              "time"
              "venue"
              "count"
              "cta" !important;
          }
          .ifs-hero-media { min-height: 200px; }
          .ifs-bento-count { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .ifs-count-rule { display: none !important; }
          .ifs-bento-count > div { width: 100%; }
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
      id="overview"
      className="ifs-section"
      style={{ background: "transparent", padding: `${SECTION_PAD} 0`, position: "relative" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <div className="ifs-overview-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "clamp(36px, 5vw, 72px)", alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
            style={{ position: "relative", borderRadius: 20, padding: 6, background: `linear-gradient(165deg, ${IFS_LIGHT_PURPLE}44 0%, ${IFS_PURPLE}22 45%, ${IFS_BG_INNER} 100%)`, border: `1px solid ${IFS_BORDER}`, boxShadow: `0 24px 60px rgba(0,0,0,0.5)` }}
          >
            <div style={{ position: "relative", borderRadius: 15, overflow: "hidden", aspectRatio: "4 / 3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={OVERVIEW_IMAGE} alt="Construction project under way" loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${IFS_PURPLE}22 0%, transparent 50%, rgba(23,4,48,0.35) 100%)` }} />
              <span aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${IFS_PURPLE_GLOW}, transparent)`, opacity: 0.7 }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22,1,0.36,1] }}
          >
            <DividerTitle eyebrow="Event Overview" title="The complete asset lifecycle, connected" accent={IFS_GREEN} maxWidth={560} />
            <div style={{ marginTop: HEADING_GAP, display: "flex", flexDirection: "column", gap: 16 }}>
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

// ─── Industry Challenges — accordion ─────────────────────────────────────────
function ChallengesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  // First item opens by default, mirroring the source page.
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section ref={ref} id="challenges" className="ifs-section" style={{ background: "transparent", padding: `${SECTION_PAD} 0`, position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <div className="ifs-challenge-grid" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "clamp(32px, 4.5vw, 64px)", alignItems: "start" }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          >
            <DividerTitle
              eyebrow="Industry Challenges"
              title={
                <>
                  <span style={{
                    backgroundImage: `linear-gradient(95deg, ${IFS_LIGHT_PURPLE} 0%, ${IFS_LIGHT_BLUE} 100%)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}>
                    Solving the
                  </span>
                  <br />
                  Construction and Engineering Challenges
                </>
              }
              accent={IFS_LIGHT_BLUE}
              maxWidth={520}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22,1,0.36,1] }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {CHALLENGES.map((c, i) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={c.title}
                  className="ifs-challenge-card"
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    background: isOpen
                      ? `linear-gradient(165deg, ${IFS_BG_CARD} 0%, ${IFS_BG_INNER} 100%)`
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isOpen ? `${IFS_PURPLE_GLOW}55` : IFS_HAIRLINE}`,
                    transition: "border-color 0.35s ease, background 0.35s ease",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "18px 20px",
                      background: "transparent",
                      border: "none",
                      textAlign: "left",
                      cursor: c.body ? "pointer" : "default",
                      color: IFS_WHITE,
                    }}
                  >
                    <span aria-hidden style={{
                      flexShrink: 0,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 42, height: 42, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${IFS_PURPLE}3a 0%, ${IFS_PURPLE}12 100%)`,
                      border: `1px solid ${IFS_PURPLE_GLOW}55`,
                      color: IFS_PURPLE_GLOW,
                    }}>
                      {/* Radiating spoke mark, echoing the source page's icon */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                        <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
                        <circle cx="12" cy="12" r="9" />
                        {CHALLENGE_SPOKES.map((s, k) => (
                          <line key={k} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
                        ))}
                      </svg>
                    </span>
                    <span style={{
                      flex: 1,
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(16px, 1.4vw, 19px)",
                      fontWeight: 700,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.3,
                    }}>
                      {c.title}
                    </span>
                    {c.body && (
                      <svg
                        aria-hidden
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke={IFS_PURPLE_GLOW} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)" }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    )}
                  </button>

                  {isOpen && c.body && (
                    <p style={{
                      margin: 0,
                      padding: "0 20px 20px 78px",
                      fontFamily: "var(--font-outfit)",
                      fontSize: "clamp(14px, 1.05vw, 15.5px)",
                      color: IFS_MUTE,
                      lineHeight: 1.7,
                    }}>
                      {c.body}
                    </p>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .ifs-challenge-card:hover { border-color: ${IFS_PURPLE_GLOW}77 !important; }
        @media (max-width: 980px) { .ifs-challenge-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Industry Segments ───────────────────────────────────────────────────────
function SegmentsSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="segments" className="ifs-section" style={{ background: "transparent", padding: `${SECTION_PAD} 0`, position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          style={{ marginBottom: HEADING_GAP }}
        >
          <DividerTitle
            eyebrow="Industry Segments"
            title={<>Driving innovation across <span style={{ color: IFS_PURPLE_GLOW }}>Construction and Engineering</span></>}
            accent={IFS_GREEN}
            maxWidth={760}
          />
        </motion.div>

        <div className="ifs-segment-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(16px, 2vw, 24px)" }}>
          {SEGMENTS.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.08 * i, ease: [0.22,1,0.36,1] }}
              className="ifs-segment-card"
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 18,
                overflow: "hidden",
                background: `linear-gradient(165deg, ${IFS_BG_CARD} 0%, ${IFS_BG_INNER} 100%)`,
                border: `1px solid ${IFS_BORDER}`,
                boxShadow: `0 18px 44px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}
            >
              <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="ifs-segment-img" src={s.image} alt="" loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <span aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(170deg, transparent 40%, ${IFS_BG_INNER}cc 100%)` }} />
              </div>
              <div style={{ padding: "clamp(20px, 2.4vw, 28px)" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(19px, 1.7vw, 23px)", fontWeight: 800, letterSpacing: "-0.02em", color: IFS_WHITE, lineHeight: 1.2 }}>
                  {s.title}
                </h3>
                <p style={{ margin: "12px 0 0", fontFamily: "var(--font-outfit)", fontSize: "clamp(14px, 1.05vw, 15.5px)", color: IFS_MUTE, lineHeight: 1.65 }}>
                  {s.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .ifs-segment-card { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease; }
        .ifs-segment-card:hover { transform: translateY(-4px); border-color: ${IFS_PURPLE_GLOW}77; }
        .ifs-segment-img { transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .ifs-segment-card:hover .ifs-segment-img { transform: scale(1.05); }
        @media (max-width: 980px) { .ifs-segment-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 680px) { .ifs-segment-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Tailored Solutions ──────────────────────────────────────────────────────
// Four products in one tabbed panel rather than four stacked rows — the section
// is a set of alternatives, so a tab strip both says that and keeps the page
// from running four screens long. All four images stay mounted and crossfade,
// so switching never flashes an unloaded image.
function SolutionsSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Roving tabindex: arrows move between tabs, Home/End jump to the ends.
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const last = SOLUTIONS.length - 1;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const current = SOLUTIONS[active];

  return (
    <section ref={ref} id="solutions" className="ifs-section" style={{ background: "transparent", padding: `${SECTION_PAD} 0`, position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          style={{ marginBottom: HEADING_GAP }}
        >
          <DividerTitle
            eyebrow="Tailored Solutions"
            title={<>Products tailored for <span style={{ color: IFS_LIGHT_BLUE }}>Construction and Engineering</span></>}
            accent={IFS_FUCHSIA}
            maxWidth={760}
          />
        </motion.div>

        {/* Tab strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22,1,0.36,1] }}
          role="tablist"
          aria-label="IFS products for Construction and Engineering"
          className="ifs-sol-tabs"
        >
          {SOLUTIONS.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.tab}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                role="tab"
                id={`ifs-sol-tab-${i}`}
                aria-selected={on}
                aria-controls="ifs-sol-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`ifs-sol-tab${on ? " is-on" : ""}`}
              >
                {s.tab}
              </button>
            );
          })}
        </motion.div>

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.14, ease: [0.22,1,0.36,1] }}
          id="ifs-sol-panel"
          role="tabpanel"
          aria-labelledby={`ifs-sol-tab-${active}`}
          className="ifs-sol-panel"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            borderRadius: 20,
            overflow: "hidden",
            background: `linear-gradient(165deg, ${IFS_BG_CARD} 0%, ${IFS_BG_INNER} 100%)`,
            border: `1px solid ${IFS_BORDER}`,
            boxShadow: `0 22px 54px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)`,
          }}
        >
          {/* 360px is the floor that the longest copy (ERP) reaches on its own,
              so the panel is the same height on every tab and switching never
              shifts the sections below it. */}
          <div className="ifs-sol-media" style={{ position: "relative", minHeight: 360, overflow: "hidden" }}>
            {SOLUTIONS.map((s, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={s.tab}
                className="ifs-sol-img"
                src={s.image}
                alt=""
                loading="lazy"
                decoding="async"
                aria-hidden={i !== active}
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "scale(1)" : "scale(1.03)",
                }}
              />
            ))}
            <span aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(120deg, transparent 35%, ${IFS_BG_INNER}aa 100%)` }} />
          </div>

          <div className="ifs-sol-copy" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, padding: "clamp(26px, 3.2vw, 44px)" }}>
            {/* Keyed on the active index so the copy replays its fade on every
                switch while the panel box itself stays put. */}
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <span aria-hidden style={{
                fontFamily: "var(--font-display)",
                fontSize: 12, fontWeight: 800,
                letterSpacing: "0.22em",
                color: IFS_PURPLE_GLOW,
                opacity: 0.8,
              }}>
                {String(active + 1).padStart(2, "0")} / {String(SOLUTIONS.length).padStart(2, "0")}
              </span>
              <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(21px, 2.2vw, 30px)", fontWeight: 800, letterSpacing: "-0.025em", color: IFS_WHITE, lineHeight: 1.15 }}>
                {current.title}
              </h3>
              <p style={{ margin: 0, fontFamily: "var(--font-outfit)", fontSize: "clamp(14px, 1.1vw, 16px)", color: IFS_MUTE, lineHeight: 1.7 }}>
                {current.body}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .ifs-sol-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: clamp(16px, 2vw, 22px);
          padding: 6px;
          border-radius: 999px;
          border: 1px solid ${IFS_HAIRLINE};
          background: rgba(10, 2, 24, 0.55);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .ifs-sol-tabs::-webkit-scrollbar { display: none; }
        .ifs-sol-tab {
          flex: 1 1 0;
          min-width: max-content;
          padding: 11px 18px;
          border: 1px solid transparent;
          border-radius: 999px;
          background: transparent;
          color: ${IFS_FAINT};
          font-family: var(--font-display);
          font-size: clamp(13px, 1vw, 15px);
          font-weight: 700;
          letter-spacing: -0.01em;
          white-space: nowrap;
          cursor: pointer;
          transition: color 0.3s ease, background 0.3s ease, border-color 0.3s ease;
        }
        .ifs-sol-tab:hover { color: ${IFS_WHITE}; }
        .ifs-sol-tab:focus-visible { outline: 2px solid ${IFS_LIGHT_BLUE}; outline-offset: 2px; }
        .ifs-sol-tab.is-on {
          color: ${IFS_WHITE};
          background: linear-gradient(180deg, ${IFS_DARK_PURPLE} 0%, ${IFS_BG_CARD} 100%);
          border-color: ${IFS_BORDER};
          box-shadow: 0 6px 18px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.09);
        }
        .ifs-sol-img {
          transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        @media (prefers-reduced-motion: reduce) {
          .ifs-sol-img { transition: none; }
        }
        @media (max-width: 880px) {
          .ifs-sol-panel { grid-template-columns: 1fr !important; }
          .ifs-sol-media { min-height: 220px !important; }
        }
        @media (max-width: 560px) {
          .ifs-sol-tabs { border-radius: 16px; }
          .ifs-sol-tab { flex: 0 0 auto; padding: 10px 14px; }
        }
      `}</style>
    </section>
  );
}

// ─── Tailored Services ───────────────────────────────────────────────────────
function ServicesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="services" className="ifs-section" style={{ background: "transparent", padding: `${SECTION_PAD} 0`, position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          style={{ marginBottom: HEADING_GAP }}
        >
          <DividerTitle
            eyebrow="Tailored Services"
            title={<>Services to maximize <span style={{ color: IFS_PURPLE_GLOW }}>success</span></>}
            accent={IFS_GREEN}
            maxWidth={640}
          />
        </motion.div>

        <div className="ifs-service-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(14px, 1.8vw, 22px)" }}>
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.07 * i, ease: [0.22,1,0.36,1] }}
              className="ifs-service-card"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                padding: "clamp(22px, 2.6vw, 30px)",
                borderRadius: 18,
                background: `linear-gradient(165deg, ${IFS_BG_CARD} 0%, ${IFS_BG_INNER} 100%)`,
                border: `1px solid ${IFS_BORDER}`,
                boxShadow: `0 18px 44px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
                overflow: "hidden",
              }}
            >
              <span aria-hidden style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg, transparent, ${IFS_PURPLE_GLOW}, transparent)`, opacity: 0.55 }} />
              <span aria-hidden style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 52, height: 52, borderRadius: 14,
                background: `linear-gradient(135deg, ${IFS_PURPLE}44 0%, ${IFS_PURPLE}18 100%)`,
                border: `1px solid ${IFS_PURPLE_GLOW}44`,
                color: IFS_PURPLE_GLOW,
                marginBottom: 16,
              }}>
                {s.icon}
              </span>
              <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(17px, 1.5vw, 20px)", fontWeight: 800, letterSpacing: "-0.02em", color: IFS_WHITE, lineHeight: 1.2 }}>
                {s.title}
              </h3>
              <p style={{ margin: "10px 0 0", fontFamily: "var(--font-outfit)", fontSize: "clamp(13.5px, 1vw, 14.5px)", color: IFS_MUTE, lineHeight: 1.65 }}>
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .ifs-service-card { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease; }
        .ifs-service-card:hover { transform: translateY(-4px); border-color: ${IFS_PURPLE_GLOW}77; }
        @media (max-width: 1080px) { .ifs-service-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 620px) { .ifs-service-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Success Metrics ─────────────────────────────────────────────────────────
function MetricsSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="metrics" className="ifs-section" style={{ background: "transparent", padding: `${SECTION_PAD} 0`, position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          style={{ marginBottom: HEADING_GAP }}
        >
          <DividerTitle
            eyebrow="Success Metrics"
            title="Industry success metrics that matter"
            accent={IFS_LIGHT_BLUE}
            maxWidth={700}
          />
        </motion.div>

        <div className="ifs-metric-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(14px, 1.8vw, 22px)" }}>
          {METRICS.map((m, i) => (
            <motion.div
              key={m.value + m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.07 * i, ease: [0.22,1,0.36,1] }}
              style={{
                padding: "clamp(24px, 2.8vw, 34px)",
                borderRadius: 18,
                background: `linear-gradient(165deg, ${IFS_DARK_PURPLE}55 0%, ${IFS_BG_INNER} 100%)`,
                border: `1px solid ${IFS_PURPLE_GLOW}33`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}
            >
              <span style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 4.6vw, 60px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                backgroundImage: `linear-gradient(120deg, ${IFS_LIGHT_PURPLE} 0%, ${IFS_LIGHT_BLUE} 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}>
                {m.value}
              </span>
              <span style={{
                display: "block",
                marginTop: 14,
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(13.5px, 1.05vw, 15px)",
                color: IFS_MUTE,
                lineHeight: 1.5,
              }}>
                {m.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 1080px) { .ifs-metric-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .ifs-metric-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Trusted by Leaders ──────────────────────────────────────────────────────
function TrustedSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="trusted" className="ifs-section" style={{ background: "transparent", padding: `${SECTION_PAD} 0`, position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          style={{ marginBottom: HEADING_GAP }}
        >
          <DividerTitle
            eyebrow="Trusted by Leaders"
            title={<>Trusted by Construction and Engineering <span style={{ color: IFS_PURPLE_GLOW }}>leaders</span></>}
            accent={IFS_FUCHSIA}
            maxWidth={760}
          />
        </motion.div>

        <div className="ifs-trusted-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(16px, 2vw, 24px)" }}>
          {TRUSTED.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.22,1,0.36,1] }}
              className="ifs-trusted-card"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "clamp(24px, 2.8vw, 32px)",
                borderRadius: 18,
                background: `linear-gradient(165deg, ${IFS_BG_CARD} 0%, ${IFS_BG_INNER} 100%)`,
                border: `1px solid ${IFS_BORDER}`,
                boxShadow: `0 18px 44px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}
            >
              <span aria-hidden style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 46, height: 46, borderRadius: 12,
                background: `linear-gradient(135deg, ${IFS_LIGHT_BLUE}30 0%, ${IFS_LIGHT_BLUE}10 100%)`,
                border: `1px solid ${IFS_LIGHT_BLUE}44`,
                color: IFS_LIGHT_BLUE,
                marginBottom: 18,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="13" x2="15" y2="13" /><line x1="8" y1="17" x2="13" y2="17" />
                </svg>
              </span>
              <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(16.5px, 1.4vw, 19px)", fontWeight: 800, letterSpacing: "-0.018em", color: IFS_WHITE, lineHeight: 1.3 }}>
                {t.title}
              </h3>
              <p style={{ margin: "12px 0 0", fontFamily: "var(--font-outfit)", fontSize: "clamp(13.5px, 1vw, 14.5px)", color: IFS_MUTE, lineHeight: 1.65 }}>
                {t.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .ifs-trusted-card { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease; }
        .ifs-trusted-card:hover { transform: translateY(-4px); border-color: ${IFS_LIGHT_BLUE}77; }
        @media (max-width: 980px) { .ifs-trusted-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 680px) { .ifs-trusted-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Agenda + Register ───────────────────────────────────────────────────────
function AgendaAndFormSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Form state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  // City is TBA, so the regional default is used until the location is set.
  const defaultPhoneCountry = useMemo<CountryCode>(
    () => COUNTRY_CODES.find((c) => c.country === "AE") ?? COUNTRY_CODES[0],
    [],
  );
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(defaultPhoneCountry);
  const [phone, setPhone] = useState("");
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
    const phoneError = validatePhone(phone, phoneCountry);
    if (phoneError) newErrors.phone = phoneError;
    if (!country) newErrors.country = "Please select a country";
    if (!industry) newErrors.industry = "Please select an industry";
    if (!consent) newErrors.consent = "Please confirm consent to proceed";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitState("submitting");
    setSubmitError("");
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    const fullPhone = `${phoneCountry.code} ${cleanPhone}`;
    const res = await submitForm({
      type: "contact",
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      job_title: jobTitle.trim(),
      company: company.trim(),
      phone: fullPhone,
      event_name: "IFS Executive Roundtable — Construction and Engineering · 20 October 2026",
      metadata: {
        "Event Page": "IFS Executive Roundtable · Construction & Engineering",
        "Page Section": "Reservation Form",
        "First Name": firstName.trim(),
        "Last Name": lastName.trim(),
        "Phone Country": `${phoneCountry.name} (${phoneCountry.code})`,
        "Country": country,
        "Industry": industry,
        "Consent Given": "true",
      },
    });
    if (res.success) {
      setSubmitState("success");
      setEmail(""); setFirstName(""); setLastName("");
      setJobTitle(""); setCompany(""); setPhone(""); setPhoneCountry(defaultPhoneCountry);
      setCountry(""); setIndustry("");
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
      className="ifs-section"
      style={{
        background: "transparent",
        padding: `${SECTION_PAD} 0`,
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

          {/* The running order isn't set yet. The section stays in place so the
              rows drop in later without re-laying out the page. */}
          <div style={{
            marginTop: HEADING_GAP,
            padding: "clamp(32px, 4vw, 48px) clamp(20px, 3vw, 32px)",
            borderRadius: 16,
            background: "rgba(255,255,255,0.03)",
            border: `1px dashed ${IFS_BORDER}`,
            textAlign: "center",
          }}>
            <span aria-hidden style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 52, height: 52, borderRadius: "50%",
              background: `linear-gradient(135deg, ${IFS_PURPLE}3a 0%, ${IFS_PURPLE}12 100%)`,
              border: `1px solid ${IFS_PURPLE_GLOW}44`,
              color: IFS_PURPLE_GLOW,
              marginBottom: 18,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <p style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "clamp(18px, 1.8vw, 22px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: IFS_WHITE,
              lineHeight: 1.3,
            }}>
              The full agenda will be announced shortly.
            </p>
            <p style={{
              margin: "10px auto 0",
              maxWidth: 420,
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              color: IFS_FAINT,
              lineHeight: 1.6,
            }}>
              Reserve your seat below and we&rsquo;ll send the running order, timings and venue
              details as soon as they are confirmed.
            </p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Register — its own section */}
    <section
      id="register"
      className="ifs-section"
      style={{
        background: "transparent",
        padding: `${SECTION_PAD} 0`,
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
          style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: HEADING_GAP }}
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

              <Field label="Phone Number" error={errors.phone} required>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(118px, 130px) 1fr", gap: 10 }}>
                  <select
                    value={`${phoneCountry.code}-${phoneCountry.country}`}
                    onChange={(e) => {
                      const [code, ctry] = e.target.value.split("-");
                      const next = COUNTRY_CODES.find((c) => c.code === code && c.country === ctry);
                      if (next) {
                        setPhoneCountry(next);
                        setPhone((prev) => prev.slice(0, next.length));
                        if (errors.phone) setErrors({ ...errors, phone: "" });
                      }
                    }}
                    aria-label="Phone country code"
                    className="ifs-input ifs-select"
                    suppressHydrationWarning
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={`${c.code}-${c.country}`} value={`${c.code}-${c.country}`}>
                        {c.country} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, phoneCountry.length)); if (errors.phone) setErrors({ ...errors, phone: "" }); }}
                    placeholder={phoneCountry.placeholder}
                    autoComplete="tel-national"
                    maxLength={phoneCountry.length}
                    className="ifs-input"
                    aria-invalid={!!errors.phone}
                    suppressHydrationWarning
                  />
                </div>
              </Field>

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
              Hosted by
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
            Executive Roundtable · IFS · 20 October 2026
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
export default function IfsCoreEngineeringPage() {
  // Landing with a URL hash (e.g. #register from a short/UTM link) — native
  // anchor jumps don't take under the global smooth-scroll, so scroll on mount.
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
      {/* globals.css forces `section { padding: clamp(48px,10vw,72px) 0 … }`
          with !important below 640px. On this page that *adds* space rather
          than removing it, so the shared scale is restored here — the class
          selector outranks the bare element selector. The hero keeps the
          clearance its own inline padding declares, for the fixed nav. */}
      <style jsx global>{`
        @media (max-width: 640px) {
          section.ifs-section {
            padding-top: ${SECTION_PAD} !important;
            padding-bottom: ${SECTION_PAD} !important;
          }
          section#top.ifs-section {
            padding-top: clamp(104px, 13vh, 132px) !important;
            padding-bottom: clamp(44px, 6vh, 72px) !important;
          }
        }
      `}</style>

      <BrandMeshBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <IfsNav />
        <HeroSection />
        <OverviewSection />
        <ChallengesSection />
        <SegmentsSection />
        <SolutionsSection />
        <ServicesSection />
        <MetricsSection />
        <TrustedSection />
        <AgendaAndFormSection />
        <IfsFooter />
      </div>
    </div>
  );
}
