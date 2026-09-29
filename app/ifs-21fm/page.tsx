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
  { id: "solutions", label: "Solutions" },
  { id: "services", label: "Services" },
  { id: "register", label: "Register" },
];

// Anchored to the start of the event day: no start time has been confirmed, so
// the countdown counts down to the date itself and the page never prints a
// fabricated time. Replace with the real start (and offset) once it is set.
const EVENT_DATE_ISO = "2026-10-21T09:00:00+03:00";

// Stock imagery, per the same pattern as the OPEX KSA page — remote Unsplash
// with an explicit width/quality so the cards don't pull full-resolution files.
const UNSPLASH = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=80`;

// No hero asset was supplied for this edition, so the hero is stock too. A
// hard-hat technician working on a commercial building's door hardware —
// facilities services inside a property, which is what this roundtable is
// about. Loaded wider than the card images because it runs full-bleed.
const HERO_IMAGE = `https://images.unsplash.com/photo-1748027869634-fc2e545cfb0c?w=1800&q=82`;

// Every image on the page is a different shot; none is reused from /ifs-20core.
const OVERVIEW_IMAGE = UNSPLASH("1774977863604-59f4e6d37a90");

// ─── Event overview copy ─────────────────────────────────────────────────────
const OVERVIEW_PARAS = [
  "Maximize efficiency and customer satisfaction with integrated Property and Facilities Services software that streamlines operations, optimizes maintenance, and enhances service delivery.",
  "This executive roundtable brings Property and Facilities leaders together around that operating model: how maintenance, resource allocation and service delivery are actually scheduled and measured, and what an integrated platform changes across a portfolio of buildings rather than a single site.",
];

// ─── Industry challenges ─────────────────────────────────────────────────────
// All three carry body copy on IFS's page, so all three are here in full.
const CHALLENGES: { title: string; body?: string }[] = [
  {
    title: "Efficient Operations Management",
    body: "Property and Facilities Services organizations face complex operational challenges, from maintenance scheduling to resource allocation. IFS provides a comprehensive solution that streamlines operations, optimizes maintenance, and enhances service delivery, leading to improved customer satisfaction and reduced costs.",
  },
  {
    title: "Enhancing Customer Experience",
    body: "Property and Facilities Providers are coming under increasing pressure to deliver exceptional customer experiences. IFS's integrated software solutions enable organizations to respond quickly to customer needs, improve service quality, and provide personalized experiences, ultimately driving customer loyalty and retention.",
  },
  {
    title: "Maximizing Asset Performance",
    body: "Effective asset management is critical in Property and Facilities management, where equipment reliability and maintenance are paramount. IFS's Enterprise Asset Management (EAM) capabilities help organizations optimize asset performance, reduce downtime, and extend asset lifespan, resulting in cost savings and improved operational efficiency.",
  },
];

// ─── Tailored solutions ──────────────────────────────────────────────────────
// `tab` is the short label on the tab strip. Each one is lifted straight from
// its own title — the acronym where the source page gives one, otherwise the
// distinguishing words — so nothing new is invented for the label.
const SOLUTIONS = [
  {
    tab: "IFS Cloud",
    title: "IFS Cloud",
    body: "Maximize efficiency and customer satisfaction with IFS Cloud, a comprehensive platform that streamlines operations and enhances service delivery for Property and Facilities Service management.",
    image: UNSPLASH("1659384897789-392e674bde56"),
  },
  {
    tab: "FSM",
    title: "Field Service Management (FSM)",
    body: "Optimize field service operations with IFS FSM, enabling organizations to manage maintenance, optimize resource allocation, and improve customer satisfaction.",
    image: UNSPLASH("1642749776312-aa42ce20c9f5"),
  },
  {
    tab: "EAM",
    title: "Enterprise Asset Management (EAM)",
    body: "Effectively manage assets with IFS EAM, providing tools for maintenance planning, execution, and asset performance management to reduce downtime and extend asset lifespan.",
    image: UNSPLASH("1744123146393-4b5438a5d98f"),
  },
  {
    tab: "Workforce",
    title: "Workforce Planning & Scheduling",
    body: "Optimize workforce planning and scheduling with IFS Workforce Planning & Scheduling, utilizing AI-powered optimization to improve technician utilization and reduce travel time.",
    image: UNSPLASH("1532619675605-1ede6c2ed2b0"),
  },
];

// ─── Tailored services ───────────────────────────────────────────────────────
const SERVICES: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: "IFS Cloud Services",
    body: "Maximize the potential of IFS Cloud with comprehensive cloud services, ensuring seamless deployment, management, and optimization of your Property and Facilities operations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6-1.6A4.2 4.2 0 0 0 6 19z" />
      </svg>
    ),
  },
  {
    title: "IFS Consulting",
    body: "Transform your Property and Facilities operations with expert consulting services, tailored to your unique needs, driving operational excellence and strategic growth.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="8" r="5" /><path d="M8.5 12.5L7 22l5-3 5 3-1.5-9.5" />
      </svg>
    ),
  },
  {
    title: "IFS Success",
    body: "Achieve rapid time-to-value with IFS Success, featuring tailored success plans and proactive guidance to ensure your Property and Facilities Services operations thrive.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="13" y2="13" />
      </svg>
    ),
  },
  {
    title: "IFS Support Services",
    body: "Ensure ongoing success with comprehensive support services, providing expert assistance, maintenance, and optimization for your Property and Facilities Services solutions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

// ─── Success metrics ─────────────────────────────────────────────────────────
const METRICS = [
  { value: "35%", label: "technician productivity improvement" },
  { value: "49%", label: "sub-contractor spend reduction" },
  { value: "30%", label: "reduction in carbon emissions" },
  { value: "10%", label: "increase in first-time fix rate" },
];

// ─── Trusted by leaders ──────────────────────────────────────────────────────
// Analyst reports named on IFS's industry page. No destination URLs were
// supplied, so these render as plain cards rather than guessed links.
const TRUSTED = [
  {
    title: "IFS named a 2025 Gartner® Peer Insights™ Customers' Choice",
    body: "In the Voice of the Customer for FSM",
  },
  {
    title: "IFS positioned in the Leaders Category in the 2025 IDC MarketScape",
    body: "IFS positioned in the Leaders Category in the 2025 IDC MarketScape",
  },
  {
    title: "IDC, Global Study of Composability in Enterprise Software and Evolving Business Needs",
    body: "Addressing evolving business needs with composability",
  },
];

// Real Estate & Facilities Management leads the list — it is this event's theme.
const INDUSTRIES = [
  "Real Estate & Facilities Management",
  "Construction & Engineering",
  "Shipbuilding & Maritime",
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
            Property &amp; Facilities
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
        /* The kicker is long here ("Property & Facilities"), so it retires
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

// ─── Hero — full-bleed property, operations bar along the foot ───────────────
// Deliberately not the bento used on /ifs-20core: the two roundtables run a day
// apart and should not open with the same silhouette. Here the building is the
// subject, so it fills the frame, and every hard fact rides one glass strip at
// the foot — the shape of a building-management console, which is what the
// page is about.

// One cell of the operations bar. `wide` lets the countdown cell take the extra
// room it needs without the three fact cells going ragged.
function OpsCell({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`ifs-ops-cell${wide ? " is-wide" : ""}`}>
      <span style={{
        display: "block",
        fontFamily: "var(--font-outfit)",
        fontSize: 9.5, fontWeight: 700,
        letterSpacing: "0.26em", textTransform: "uppercase",
        color: IFS_PURPLE_GLOW,
        marginBottom: 8,
      }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function OpsValue({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "block",
      fontFamily: "var(--font-display)",
      fontSize: "clamp(15px, 1.25vw, 18px)",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: IFS_WHITE,
      lineHeight: 1.25,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function HeroSection() {
  return (
    <section
      id="top"
      className="ifs-section"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "transparent",
        minHeight: "100svh",
        display: "flex",
        alignItems: "stretch",
        paddingTop: "clamp(104px, 13vh, 132px)",
        paddingBottom: "clamp(22px, 3vh, 38px)",
      }}
    >
      {/* Full-bleed media + scrims. The image is the hero ground; the scrims
          keep the copy legible over it without flattening the photograph. */}
      <div aria-hidden className="ifs-hero-bg" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ifs-hero-photo"
          src={HERO_IMAGE}
          alt=""
          fetchPriority="high"
          decoding="async"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            // Holds the technician centre-right, clear of the scrim that
            // carries the headline down the left.
            objectPosition: "58% 42%",
          }}
        />
        {/* Left-to-right scrim carries the headline. */}
        <span style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(90deg, ${IFS_BG} 0%, ${IFS_BG}f2 34%, ${IFS_BG}99 56%, rgba(23,4,48,0.28) 78%, rgba(23,4,48,0.15) 100%)`,
        }} />
        {/* Top band clears the fixed nav; bottom band seats the ops bar and
            hands off to the mesh ground of the next section. */}
        <span style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(180deg, ${IFS_BG_DEEP}e6 0%, transparent 26%, transparent 52%, ${IFS_BG_DEEP}d9 88%, ${IFS_BG_DEEP} 100%)`,
        }} />
        {/* Brand tint, so the photograph sits in the IFS palette. */}
        <span style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(120% 90% at 82% 30%, ${IFS_PURPLE}2e 0%, transparent 62%)`,
          mixBlendMode: "screen",
        }} />
      </div>

      <div className="ifs-hero-inner" style={{
        position: "relative", zIndex: 1,
        width: "100%",
        maxWidth: 1280, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 48px)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        gap: "clamp(28px, 5vh, 56px)",
      }}>
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22,1,0.36,1] }}
          style={{ maxWidth: 780, marginTop: "auto", paddingBottom: "clamp(8px, 2vh, 24px)" }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            fontFamily: "var(--font-outfit)",
            fontSize: 10.5, fontWeight: 700,
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: IFS_WHITE,
          }}>
            <span aria-hidden style={{
              width: 7, height: 7, borderRadius: "50%",
              background: IFS_GREEN,
              boxShadow: `0 0 0 4px ${IFS_GREEN}26`,
            }} />
            IFS Executive Roundtable
          </span>

          <h1 style={{
            margin: "18px 0 0",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(34px, 5vw, 64px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.02,
            color: IFS_WHITE,
            textWrap: "balance",
          }}>
            Property and Facilities Management{" "}
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
            margin: "20px 0 0",
            fontFamily: "var(--font-outfit)",
            fontSize: "clamp(14.5px, 1.15vw, 17px)",
            color: IFS_MUTE,
            lineHeight: 1.65,
            maxWidth: 560,
          }}>
            Maximize efficiency and customer satisfaction with integrated Property and
            Facilities Services software that streamlines operations, optimizes maintenance,
            and enhances service delivery.
          </p>
        </motion.div>

        {/* Operations bar */}
        <motion.div
          className="ifs-ops-bar"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.16, ease: [0.22,1,0.36,1] }}
        >
          <OpsCell label="Date"><OpsValue>21 October 2026</OpsValue></OpsCell>
          <OpsCell label="Time"><OpsValue>To be announced</OpsValue></OpsCell>
          <OpsCell label="Venue"><OpsValue>To be announced</OpsValue></OpsCell>
          <OpsCell label="Doors open in" wide>
            <CountdownTimer targetIso={EVENT_DATE_ISO} bare />
          </OpsCell>

          <div className="ifs-ops-cta">
            <a
              href="#register"
              className="ifs-hero-cta"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                width: "100%",
                padding: "15px 26px",
                borderRadius: 12,
                background: IFS_GREEN,
                color: "#062214",
                fontFamily: "var(--font-outfit)",
                fontSize: 14.5, fontWeight: 800,
                letterSpacing: "0.01em",
                textDecoration: "none",
                whiteSpace: "nowrap",
                boxShadow: `0 12px 28px ${IFS_GREEN}55, inset 0 1px 0 rgba(255,255,255,0.45)`,
                transition: "transform 0.28s ease, background 0.28s ease, box-shadow 0.28s ease",
              }}
            >
              Reserve My Seat
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <span style={{
              display: "block",
              marginTop: 9,
              fontFamily: "var(--font-outfit)",
              fontSize: 11,
              color: IFS_FAINT,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}>
              Invitation only · Limited seats
            </span>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .ifs-hero-photo { animation: ifsHeroDrift 26s ease-in-out infinite alternate; }
        /* Starts unscaled so the widest possible crop of the figure is kept —
           the source is wider than the hero frame, so cover already trims the
           sides and any extra zoom loses the subject. */
        @keyframes ifsHeroDrift {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ifs-hero-photo { animation: none; transform: none; }
        }

        .ifs-ops-bar {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 1.35fr) auto;
          align-items: center;
          gap: 0;
          padding: clamp(16px, 1.8vw, 22px) clamp(16px, 2vw, 26px);
          border-radius: 18px;
          border: 1px solid ${IFS_BORDER};
          background: linear-gradient(180deg, rgba(37, 1, 70, 0.72) 0%, rgba(10, 2, 24, 0.82) 100%);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 26px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.07);
        }
        /* Hairline between cells rather than a border per cell, so the strip
           reads as one instrument. */
        .ifs-ops-cell + .ifs-ops-cell,
        .ifs-ops-cta { border-left: 1px solid ${IFS_HAIRLINE}; }
        .ifs-ops-cell { padding: 0 clamp(14px, 1.6vw, 22px); min-width: 0; }
        .ifs-ops-cell:first-child { padding-left: 0; }
        .ifs-ops-cta { padding-left: clamp(16px, 1.8vw, 24px); }

        .ifs-hero-cta:hover {
          transform: translateY(-2px);
          background: ${IFS_GREEN_DEEP} !important;
          box-shadow: 0 16px 34px ${IFS_GREEN}77, inset 0 1px 0 rgba(255,255,255,0.55) !important;
        }

        /* Tablet: the CTA drops to its own full-width row under the facts. */
        @media (max-width: 1080px) {
          .ifs-ops-bar { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 20px; }
          .ifs-ops-cell.is-wide { grid-column: 1 / -1; border-left: 0; padding-left: 0; padding-top: 18px; border-top: 1px solid ${IFS_HAIRLINE}; }
          .ifs-ops-cta { grid-column: 1 / -1; border-left: 0; padding-left: 0; }
        }

        /* Narrow: the scrim turns vertical so the copy still reads, and the bar
           becomes a two-column list. */
        @media (max-width: 720px) {
          .ifs-ops-bar { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 18px; }
          .ifs-ops-cell:nth-child(odd) { padding-left: 0; border-left: 0; }
          .ifs-ops-cell:nth-child(3) { padding-top: 16px; border-top: 1px solid ${IFS_HAIRLINE}; }
          .ifs-ops-cell:nth-child(4) { padding-top: 16px; border-top: 1px solid ${IFS_HAIRLINE}; }
        }
        @media (max-width: 560px) {
          .ifs-ops-bar { grid-template-columns: minmax(0, 1fr); }
          .ifs-ops-cell { padding: 0; border-left: 0 !important; }
          .ifs-ops-cell + .ifs-ops-cell { padding-top: 15px; border-top: 1px solid ${IFS_HAIRLINE}; }
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
              <img src={OVERVIEW_IMAGE} alt="Building maintenance under way" loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
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

// ─── Industry Challenges — vertical tabs ────────────────────────────────────
// A tab pattern, so only one body is on screen at a time and the section stops
// reading as a wall of copy. Deliberately VERTICAL: Tailored Solutions further
// down already uses a horizontal pill strip, and running both on the same axis
// would make the page look like it only owns one device. Here the three titles
// stack as a rail on the left and the selected one opens beside it.
function ChallengesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Roving tabindex. Up/Down are the primary keys for a vertical tablist;
  // Left/Right are accepted too so either habit works.
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const last = CHALLENGES.length - 1;
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const SpokeMark = (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="9" />
      {CHALLENGE_SPOKES.map((sp, k) => (
        <line key={k} x1={sp.x1} y1={sp.y1} x2={sp.x2} y2={sp.y2} />
      ))}
    </svg>
  );

  return (
    <section ref={ref} id="challenges" className="ifs-section" style={{ background: "transparent", padding: `${SECTION_PAD} 0`, position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          style={{ marginBottom: HEADING_GAP }}
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
                </span>{" "}
                Property and Facilities Services Challenges
              </>
            }
            accent={IFS_LIGHT_BLUE}
            maxWidth={820}
          />
        </motion.div>

        <motion.div
          className="ifs-chal-split"
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22,1,0.36,1] }}
        >
          {/* Rail */}
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Property and Facilities Services challenges"
            className="ifs-chal-rail"
          >
            {CHALLENGES.map((c, i) => {
              const on = i === active;
              return (
                <button
                  key={c.title}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  type="button"
                  role="tab"
                  id={`ifs-chal-tab-${i}`}
                  aria-selected={on}
                  aria-controls="ifs-chal-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`ifs-chal-tab${on ? " is-on" : ""}`}
                >
                  <span aria-hidden className="ifs-chal-tab-mark">{SpokeMark}</span>
                  <span className="ifs-chal-tab-label">{c.title}</span>
                  <svg aria-hidden className="ifs-chal-tab-chev" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div
            id="ifs-chal-panel"
            role="tabpanel"
            aria-labelledby={`ifs-chal-tab-${active}`}
            className="ifs-chal-panel"
          >
            <span aria-hidden className="ifs-chal-sheen" />
            {/* All three bodies share one grid cell and crossfade. That way the
                panel is always as tall as the LONGEST of them at whatever width
                the page happens to be, so switching tabs never changes the
                section height — no hand-tuned min-height to go stale when the
                copy changes. */}
            <div className="ifs-chal-bodies">
              {CHALLENGES.map((c, i) => {
                const on = i === active;
                return (
                  <div
                    key={c.title}
                    className={`ifs-chal-body${on ? " is-on" : ""}`}
                    aria-hidden={!on}
                  >
                    <span aria-hidden className="ifs-chal-panel-mark">{SpokeMark}</span>
                    <h3 style={{
                      margin: "clamp(16px, 1.8vw, 22px) 0 0",
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(21px, 2.1vw, 30px)",
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.15,
                      color: IFS_WHITE,
                      textWrap: "balance",
                    }}>
                      {c.title}
                    </h3>
                    {c.body && (
                      <p style={{
                        margin: "14px 0 0",
                        maxWidth: 560,
                        fontFamily: "var(--font-outfit)",
                        fontSize: "clamp(14px, 1.05vw, 15.5px)",
                        color: IFS_MUTE,
                        lineHeight: 1.75,
                      }}>
                        {c.body}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .ifs-chal-split {
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
          gap: clamp(14px, 1.8vw, 22px);
          align-items: stretch;
        }

        .ifs-chal-rail { display: flex; flex-direction: column; gap: 10px; }
        .ifs-chal-tab {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: clamp(15px, 1.5vw, 19px) clamp(16px, 1.6vw, 20px);
          border-radius: 14px;
          border: 1px solid ${IFS_HAIRLINE};
          background: rgba(255,255,255,0.03);
          color: ${IFS_FAINT};
          text-align: left;
          cursor: pointer;
          transition: background 0.35s ease, border-color 0.35s ease, color 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .ifs-chal-tab:hover { color: ${IFS_WHITE}; border-color: ${IFS_PURPLE_GLOW}44; }
        .ifs-chal-tab:focus-visible { outline: 2px solid ${IFS_LIGHT_BLUE}; outline-offset: 2px; }
        .ifs-chal-tab.is-on {
          color: ${IFS_WHITE};
          background: linear-gradient(140deg, ${IFS_DARK_PURPLE} 0%, ${IFS_BG_CARD} 100%);
          border-color: ${IFS_BORDER};
          box-shadow: 0 14px 30px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .ifs-chal-tab-label {
          flex: 1;
          min-width: 0;
          font-family: var(--font-display);
          font-size: clamp(14.5px, 1.2vw, 17px);
          font-weight: 700;
          letter-spacing: -0.018em;
          line-height: 1.25;
        }
        .ifs-chal-tab-mark {
          flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 50%;
          background: linear-gradient(135deg, ${IFS_PURPLE}30 0%, ${IFS_PURPLE}0f 100%);
          border: 1px solid ${IFS_PURPLE_GLOW}3d;
          color: ${IFS_PURPLE_GLOW};
          transition: border-color 0.35s ease;
        }
        .ifs-chal-tab-mark svg { width: 20px; height: 20px; }
        .ifs-chal-tab.is-on .ifs-chal-tab-mark { border-color: ${IFS_PURPLE_GLOW}; }
        .ifs-chal-tab-chev {
          flex-shrink: 0;
          opacity: 0; transform: translateX(-4px);
          color: ${IFS_PURPLE_GLOW};
          transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .ifs-chal-tab.is-on .ifs-chal-tab-chev { opacity: 1; transform: translateX(0); }

        .ifs-chal-panel {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(26px, 3vw, 40px);
          border-radius: 20px;
          background: linear-gradient(165deg, ${IFS_BG_CARD} 0%, ${IFS_BG_INNER} 100%);
          border: 1px solid ${IFS_BORDER};
          box-shadow: 0 22px 54px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .ifs-chal-sheen {
          position: absolute; top: 0; left: 12%; right: 12%; height: 1px;
          background: linear-gradient(90deg, transparent, ${IFS_PURPLE_GLOW}, transparent);
          opacity: 0.65;
        }
        /* Every body occupies the same cell, so the tallest sets the height. */
        .ifs-chal-bodies { display: grid; }
        .ifs-chal-body {
          grid-area: 1 / 1;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1), visibility 0s linear 0.4s;
        }
        .ifs-chal-body.is-on {
          opacity: 1;
          visibility: visible;
          transform: none;
          transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1), visibility 0s;
        }
        .ifs-chal-panel-mark {
          display: inline-flex; align-items: center; justify-content: center;
          width: 54px; height: 54px; border-radius: 50%;
          background: linear-gradient(135deg, ${IFS_PURPLE}3a 0%, ${IFS_PURPLE}12 100%);
          border: 1px solid ${IFS_PURPLE_GLOW}66;
          color: ${IFS_PURPLE_GLOW};
        }

        @media (prefers-reduced-motion: reduce) {
          .ifs-chal-tab, .ifs-chal-tab-chev { transition: none; }
          .ifs-chal-body { transition: opacity 0.01s, visibility 0s linear 0.01s; transform: none; }
          .ifs-chal-body.is-on { transition: opacity 0.01s, visibility 0s; }
        }

        /* Narrow: the rail goes above the panel and the chevron points down,
           because the panel is no longer beside it. */
        @media (max-width: 900px) {
          .ifs-chal-split { grid-template-columns: minmax(0, 1fr); }
          .ifs-chal-tab-chev { transform: rotate(90deg) translateX(-4px); }
          .ifs-chal-tab.is-on .ifs-chal-tab-chev { transform: rotate(90deg); }
        }
        @media (max-width: 560px) {
          .ifs-chal-tab { padding: 13px 14px; gap: 11px; }
          .ifs-chal-tab-mark { width: 32px; height: 32px; }
          .ifs-chal-tab-mark svg { width: 17px; height: 17px; }
        }
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
            title={<>Products tailored for <span style={{ color: IFS_LIGHT_BLUE }}>Property and Facilities Services</span></>}
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
          aria-label="IFS products for Property and Facilities Services"
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
            title={<>Services to maximize Property and Facilities Management <span style={{ color: IFS_PURPLE_GLOW }}>success</span></>}
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
            title="Property and Facilities Services success metrics that matter"
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
            title={<>Trusted by Property and Facilities Services <span style={{ color: IFS_PURPLE_GLOW }}>leaders</span></>}
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
      event_name: "IFS Executive Roundtable — Property and Facilities Management · 21 October 2026",
      metadata: {
        "Event Page": "IFS Executive Roundtable · Property & Facilities Management",
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
            Executive Roundtable · IFS · 21 October 2026
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
export default function IfsPropertyFacilitiesPage() {
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
