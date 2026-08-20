"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import {
  submitForm,
  isWorkEmail,
  validatePhone,
  COUNTRY_CODES,
  type CountryCode,
} from "@/lib/form-helpers";

// Lazy-load the WebGL shader runtime so it doesn't ship in the initial JS bundle.
const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false }
);

// ═══════════════════════════════════════════════════════════════════════════
// Blue Yonder — Visibility, Control & Networked Execution
// Executive dinner, Hilton Palm Jumeirah, Dubai, 23 September 2026
//
// Visual system: "Infinite Scale" per Blue Yonder Brand Guidelines 2025.
// Signature reactive dot field where data points flex in size based on
// proximity to a highlighted focal point — implemented here as a cursor-
// reactive canvas grid. Horizon Blue dominant, Midnight Blue grounding,
// Harvest Plum touches. Sentence-case headlines, em-dashes (no spaces),
// numerals for 1-10. Logo locked top-right per brand standard.
// ═══════════════════════════════════════════════════════════════════════════

// ─── Brand Tokens ──────────────────────────────────────────────────────────
// Page composition: dark Horizon-Blue dot-field HERO → light/white sections
// below. Hero tokens are dark-theme; section tokens below are light-theme
// (closer to Blue Yonder's own marketing where Horizon Blue accents sit on
// clean white with Midnight Blue typography).
const HORIZON = "#00B7F1";       // Primary
const HORIZON_DEEP = "#0095CC";  // Darker variant
const PLUM = "#6A0136";          // Secondary
const PLUM_GLOW = "#A30659";     // Brighter touches
const MIDNIGHT = "#000E4E";      // Grounding
const MIDNIGHT_DEEP = "#000628"; // Deepest
const INK = "#04050D";           // Hero base
const WHITE = "#FFFFFF";
const STEEL = "#6B6D76";

// Hero (dark) tokens
const FAINT = "rgba(255,255,255,0.55)";
const MUTE = "rgba(255,255,255,0.78)";
const HAIR = "rgba(255,255,255,0.10)";
const HAIR_STRONG = "rgba(255,255,255,0.18)";

// Light-section tokens
const PAPER = "#FFFFFF";                       // primary light bg
const PAPER_SOFT = "#F4F6FA";                  // subtle alt
const INK_DARK = MIDNIGHT;                     // headlines on light
const INK_BODY = "#1F2333";                    // body text on light
const INK_MUTE = "#5A607A";                    // muted on light
const INK_FAINT = "#8A91A8";                   // faint on light
const LINE = "rgba(0,14,78,0.12)";             // light hairline
const LINE_STRONG = "rgba(0,14,78,0.22)";      // light hairline (stronger)

const EVENT_DATE_ISO = "2026-09-23T17:00:00+04:00";

// ─── Speakers ──────────────────────────────────────────────────────────────
// No bios per brief.
const SPEAKERS = [
  {
    name: "Yahyah Pandor",
    role: "Moderator",
    title: "Vice President & General Manager (MENAT)",
    org: "Blue Yonder",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Yahyah+Pandor.jpeg",
    linkedin: "https://www.linkedin.com/in/ypandor/",
  },
  {
    name: "Nandan Shetty",
    role: "Panelist",
    title: "Senior Strategic Services Director",
    org: "Blue Yonder",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Nandan_Shetty.png",
    linkedin: "https://www.linkedin.com/in/nandan-k-shetty/",
  },
  {
    name: "Jiya Chadha",
    role: "Panelist",
    title: "Senior Solution Advisor",
    org: "Blue Yonder",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Jiya+Chadha1.jpeg",
    linkedin: "https://www.linkedin.com/in/jiya-chadha-26096763/",
  },
];

// ─── Key Takeaways (from brief) ────────────────────────────────────────────
const TAKEAWAYS = [
  "Why visibility without orchestration still leaves supply chains exposed",
  "How GCC organizations can improve control across suppliers, warehouses and transport",
  "The role of network-based collaboration in reducing disruptions and response time",
  "How WMS and TMS create faster, more reliable execution decisions",
  "Practical approaches to improving service, resilience and cost control simultaneously",
  "What an end-to-end execution model looks like for regional supply chains in 2026",
];

// ─── Agenda (180-minute run-of-show, Dubai time) ───────────────────────────
// `phase` is a one-word classifier used as a chip in the row lead. Index 2
// (the moderated roundtable) is the "centerpiece" and gets accent treatment.
type AgendaItem = {
  time: string;
  duration: string;
  phase: string;
  title: string;
  note?: string;
};
const AGENDA: AgendaItem[] = [
  { time: "17:00 – 17:30", duration: "30 min", phase: "Welcome", title: "Arrival & welcome networking" },
  { time: "17:30 – 17:45", duration: "15 min", phase: "Framing", title: "Blue Yonder opening", note: "Short framing — no pitch" },
  { time: "17:45 – 18:45", duration: "60 min", phase: "Centerpiece", title: "Moderated roundtable discussion" },
  { time: "18:45 – 19:15", duration: "30 min", phase: "Peer exchange", title: "Facilitated open discussion & peer exchange" },
  { time: "19:15 – 20:30", duration: "75 min", phase: "Dinner", title: "Seated dinner & curated networking" },
  { time: "20:30 onward", duration: "Open", phase: "Follow-up", title: "Priority follow-up & immediate next-step capture" },
];

const INDUSTRIES = [
  "Logistics & Transportation",
  "Retail & E-commerce",
  "Manufacturing",
  "Consumer Goods (CPG)",
  "Food & Beverage",
  "Pharmaceuticals & Healthcare",
  "Automotive",
  "Energy & Utilities",
  "Aerospace & Defence",
  "3PL / 4PL",
  "Government & Public Sector",
  "Other",
];

const COUNTRIES = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Bahrain",
  "Kuwait",
  "Oman",
  "Qatar",
  "Jordan",
  "Egypt",
  "Turkey",
  "Pakistan",
  "India",
  "United Kingdom",
  "United States",
  "Singapore",
  "Other",
];

// ─── Blue Yonder Logo (official) ───────────────────────────────────────────
// `size` controls the logo height in px. The `_rgb` PNG has the navy wordmark
// baked in — on dark backgrounds we invert it to white for contrast; on light
// backgrounds it renders in brand colours as-is.
const BY_LOGO_SRC =
  "https://efg-final.s3.eu-north-1.amazonaws.com/logos/Blue_Yonder_rgb.png";

function ByLogo({ size = 28, tone = "dark" }: { size?: number; tone?: "dark" | "light" }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={BY_LOGO_SRC}
      alt="Blue Yonder"
      width={size * 4}
      height={size}
      style={{
        height: size,
        width: "auto",
        display: "block",
        userSelect: "none",
        filter: tone === "dark" ? "brightness(0) invert(1)" : "none",
        transition: "filter 0.3s ease",
      }}
    />
  );
}

// ─── Top Bar — Blue Yonder only (no EFG branding in nav per feedback) ──────
// Scroll-aware: transparent at top, glassmorphic when scrolled.
const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "agenda", label: "Agenda" },
  { id: "speakers", label: "Speakers" },
];

function TopBar() {
  // `onLight` flips when scroll passes the dark hero — nav theme swaps to
  // light-glass with Midnight text so it reads cleanly over the white content.
  const [onLight, setOnLight] = useState(false);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCondensed(y > 24);
      // Use 80% of viewport height as the hero/light boundary (hero is min-height: 100vh)
      setOnLight(y > window.innerHeight * 0.78);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const linkColor = onLight ? INK_DARK : WHITE;
  const linkHoverColor = HORIZON;
  const dividerColor = onLight ? LINE_STRONG : HAIR_STRONG;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: condensed ? "10px 0" : "16px 0",
        background: onLight
          ? "rgba(255, 255, 255, 0.86)"
          : condensed
            ? "rgba(0, 6, 40, 0.82)"
            : "linear-gradient(180deg, rgba(4,5,13,0.7) 0%, rgba(4,5,13,0) 100%)",
        backdropFilter: condensed || onLight ? "blur(20px) saturate(160%)" : "blur(6px)",
        WebkitBackdropFilter: condensed || onLight ? "blur(20px) saturate(160%)" : "blur(6px)",
        borderBottom: condensed
          ? `1px solid ${dividerColor}`
          : "1px solid transparent",
        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div
        className="by-nav-row"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <ByLogo size={28} tone={onLight ? "light" : "dark"} />
        </a>

        <div className="by-nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => goTo(e, l.id)}
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13.5,
                fontWeight: 500,
                color: linkColor,
                textDecoration: "none",
                opacity: 0.85,
                transition: "opacity 0.25s ease, color 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.color = linkHoverColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.85";
                e.currentTarget.style.color = linkColor;
              }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#reserve"
          onClick={(e) => goTo(e, "reserve")}
          className="by-nav-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 999,
            background: HORIZON,
            color: MIDNIGHT_DEEP,
            fontFamily: "var(--font-outfit)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.01em",
            textDecoration: "none",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: `0 8px 20px ${HORIZON}55, inset 0 1px 0 rgba(255,255,255,0.4)`,
            transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 12px 26px ${HORIZON}77, inset 0 1px 0 rgba(255,255,255,0.5)`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 20px ${HORIZON}55, inset 0 1px 0 rgba(255,255,255,0.4)`;
          }}
        >
          Reserve seat
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </header>
  );
}

// ─── Hero Wave Path Generator ──────────────────────────────────────────────
// Pure constant — computed once at module load. Math.sin output is rounded
// to 2 decimals so the resulting `d` string is byte-identical between Node
// SSR and the browser (avoids hydration mismatch from V8 transcendental
// precision drift).
type WaveLayer = {
  d: string;
  stops: readonly { o: number; c: string; a: number }[];
  blur: number;
  xRange: number;
  dur: number;
};

const HERO_WAVE_LAYERS: readonly WaveLayer[] = (() => {
  const VIEW_W = 1600;
  const VIEW_H = 1000;
  const build = (
    yBase: number,
    seed: number,
    amps: [number, number, number],
    freqs: [number, number, number],
  ): string => {
    let d = `M -100 ${yBase}`;
    for (let x = 0; x <= VIEW_W + 100; x += 12) {
      const t = x / VIEW_W;
      const y =
        yBase +
        Math.sin(t * freqs[0] * Math.PI + seed) * amps[0] +
        Math.sin(t * freqs[1] * Math.PI + seed * 1.7) * amps[1] +
        Math.sin(t * freqs[2] * Math.PI + seed * 0.6) * amps[2];
      d += ` L ${x} ${y.toFixed(2)}`;
    }
    d += ` L ${VIEW_W + 100} ${VIEW_H + 100} L -100 ${VIEW_H + 100} Z`;
    return d;
  };

  return [
    // Back — luminous Horizon top crest sinking into Midnight
    {
      d: build(240, 0.0, [44, 22, 28], [2.1, 4.3, 0.9]),
      stops: [
        { o: 0, c: HORIZON, a: 0.55 },
        { o: 18, c: HORIZON, a: 0.22 },
        { o: 100, c: MIDNIGHT, a: 0.85 },
      ],
      blur: 14, xRange: 28, dur: 70,
    },
    // Mid-back — deeper Midnight body with a brand-blue rim
    {
      d: build(360, 1.4, [54, 18, 24], [2.3, 4.7, 1.1]),
      stops: [
        { o: 0, c: HORIZON, a: 0.32 },
        { o: 14, c: "#0A1B6E", a: 0.85 },
        { o: 100, c: MIDNIGHT_DEEP, a: 0.95 },
      ],
      blur: 18, xRange: 22, dur: 84,
    },
    // BRAND BLOOM — Horizon Blue translucent layer for the middle glow
    {
      d: build(480, 2.6, [50, 24, 30], [2.0, 3.9, 1.0]),
      stops: [
        { o: 0, c: HORIZON, a: 0.45 },
        { o: 24, c: HORIZON, a: 0.22 },
        { o: 60, c: PLUM, a: 0.10 },
        { o: 100, c: MIDNIGHT_DEEP, a: 0.05 },
      ],
      blur: 28, xRange: 36, dur: 92,
    },
    // Mid-front — anchoring deep Midnight with a violet undertone
    {
      d: build(590, 3.8, [46, 20, 24], [2.4, 4.1, 0.8]),
      stops: [
        { o: 0, c: "#1A0742", a: 0.55 },
        { o: 18, c: MIDNIGHT, a: 0.92 },
        { o: 100, c: "#000420", a: 0.98 },
      ],
      blur: 16, xRange: 18, dur: 60,
    },
    // Front — near-black grounding the bottom
    {
      d: build(730, 5.0, [40, 14, 18], [2.6, 4.9, 1.2]),
      stops: [
        { o: 0, c: MIDNIGHT_DEEP, a: 0.9 },
        { o: 100, c: "#000005", a: 1 },
      ],
      blur: 10, xRange: 14, dur: 56,
    },
  ];
})();

// ─── Hero Background — Heavy Liquid Gradient Waves ─────────────────────────
// Five stacked filled wave layers, each filled with its own vertical gradient.
// Motion is glacial (56–92s loops) so the composition reads as design flow,
// not animation. Paths are constants (see HERO_WAVE_LAYERS above).
function HeroBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        background: `linear-gradient(180deg, ${MIDNIGHT_DEEP} 0%, #010210 100%)`,
      }}
    >
      {/* Stacked gradient liquid layers — each its own SVG for per-layer blur */}
      {HERO_WAVE_LAYERS.map((layer, i) => {
        const gradId = `by-liquid-grad-${i}`;
        return (
          <motion.svg
            key={i}
            viewBox="0 0 1600 1000"
            preserveAspectRatio="none"
            animate={{ x: [-layer.xRange, layer.xRange, -layer.xRange] }}
            transition={{
              duration: layer.dur,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "110%",
              height: "110%",
              left: "-5%",
              top: "-5%",
              filter: `blur(${layer.blur}px)`,
              pointerEvents: "none",
            }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                {layer.stops.map((s, j) => (
                  <stop
                    key={j}
                    offset={`${s.o}%`}
                    stopColor={s.c}
                    stopOpacity={s.a}
                  />
                ))}
              </linearGradient>
            </defs>
            <path d={layer.d} fill={`url(#${gradId})`} />
          </motion.svg>
        );
      })}

      {/* Diagonal Horizon Blue wash — softens the upper-left for headline area */}
      <div
        style={{
          position: "absolute",
          left: "-10%",
          top: "0%",
          width: "70%",
          height: "70%",
          background: `radial-gradient(ellipse at 30% 30%, ${HORIZON}1f 0%, ${HORIZON}0a 35%, transparent 70%)`,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Cinematic edge vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 130% 110% at 50% 50%, transparent 45%, rgba(1,2,16,0.5) 80%, #010210 100%)`,
        }}
      />
    </div>
  );
}

// ─── Countdown ─────────────────────────────────────────────────────────────
// Prominent block: small eyebrow + 4 large display-weight numerals with
// hairline separators and tracked unit labels underneath. Re-renders every
// second, so all styles + sub-components are hoisted to module scope to
// avoid per-tick allocation.
const COUNTDOWN_ROOT_STYLE: React.CSSProperties = {
  display: "inline-flex",
  flexDirection: "column",
  gap: 14,
};
const COUNTDOWN_EYEBROW_STYLE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--font-outfit)",
  fontSize: 10.5,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: HORIZON,
  fontWeight: 600,
};
const COUNTDOWN_EYEBROW_DOT_STYLE: React.CSSProperties = {
  width: 5,
  height: 5,
  borderRadius: "50%",
  background: HORIZON,
  boxShadow: `0 0 10px ${HORIZON}`,
};
const COUNTDOWN_ROW_STYLE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "clamp(16px, 1.6vw, 22px)",
};
const COUNTDOWN_CELL_STYLE: React.CSSProperties = {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  minWidth: 56,
};
const COUNTDOWN_NUM_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(28px, 2.6vw, 38px)",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  color: WHITE,
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1,
};
const COUNTDOWN_LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-outfit)",
  fontSize: 10,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.48)",
  fontWeight: 500,
};
const COUNTDOWN_SEP_STYLE: React.CSSProperties = {
  width: 1,
  height: 30,
  background: HAIR_STRONG,
  alignSelf: "center",
};

function CountdownCell({ v, label }: { v: number; label: string }) {
  return (
    <span style={COUNTDOWN_CELL_STYLE}>
      <span style={COUNTDOWN_NUM_STYLE}>{String(v).padStart(2, "0")}</span>
      <span style={COUNTDOWN_LABEL_STYLE}>{label}</span>
    </span>
  );
}

function Countdown({ targetISO }: { targetISO: string }) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [parts, setParts] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setParts({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!mounted) return null;

  return (
    <div style={COUNTDOWN_ROOT_STYLE}>
      <span style={COUNTDOWN_EYEBROW_STYLE}>
        <span aria-hidden style={COUNTDOWN_EYEBROW_DOT_STYLE} />
        Event begins in
      </span>
      <div style={COUNTDOWN_ROW_STYLE}>
        <CountdownCell v={parts.d} label="Days" />
        <span aria-hidden style={COUNTDOWN_SEP_STYLE} />
        <CountdownCell v={parts.h} label="Hours" />
        <span aria-hidden style={COUNTDOWN_SEP_STYLE} />
        <CountdownCell v={parts.m} label="Min" />
        <span aria-hidden style={COUNTDOWN_SEP_STYLE} />
        <CountdownCell v={parts.s} label="Sec" />
      </div>
    </div>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────
// Smooth-scroll handler reused by the hero CTA (kept stable instead of
// re-creating an arrow function inline on each render).
const scrollToReserve = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

function Hero() {
  // Two-column premium layout:
  //   Left  — eyebrow + headline + subtitle + CTA + countdown
  //   Right — vertical glass strip with structured event details
  return (
    <section
      id="top"
      className="by-hero-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: "clamp(100px, 12vw, 130px) 0 clamp(56px, 8vw, 90px)",
      }}
    >
      <HeroBackground />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 56px)",
          width: "100%",
        }}
      >
        <div
          className="by-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 0.85fr",
            gap: "clamp(40px, 6vw, 88px)",
            alignItems: "center",
          }}
        >
          {/* ── Left — text column ───────────────────────────────────────── */}
          <div>
            {/* Eyebrow — frosted glass pill with embedded Horizon dot */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="by-hero-eyebrow"
            >
              <span className="by-hero-eyebrow-text">Blue Yonder Executive Dinner</span>
              <span aria-hidden className="by-hero-eyebrow-dot" />
              <span className="by-hero-eyebrow-text">Dubai</span>
            </motion.div>

            {/* Headline — gradient text + ambient Horizon underglow + depth */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="by-hero-headline"
            >
              Visibility, control &amp; networked execution
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{
                margin: "clamp(20px, 2.5vw, 30px) 0 0",
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(15px, 1.25vw, 18.5px)",
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.78)",
                maxWidth: 540,
                fontWeight: 400,
              }}
            >
              An invitation-only Blue Yonder dinner on resilient, connected
              supply chain execution across the GCC.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginTop: "clamp(28px, 4vw, 44px)" }}
            >
              <a
                href="#reserve"
                onClick={scrollToReserve}
                className="by-hero-cta"
              >
                Reserve your seat
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </motion.div>

            {/* Countdown — own block below CTA, hairline-divided cells */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginTop: "clamp(28px, 4vw, 44px)" }}
            >
              <Countdown targetISO={EVENT_DATE_ISO} />
            </motion.div>
          </div>

          {/* ── Right — vertical glass stats strip ────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <StatsStrip />
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

// ─── Vertical Glass Stats Strip ────────────────────────────────────────────
const HERO_STATS: readonly { label: string; value: string; sub?: string }[] = [
  { label: "Date", value: "23 September 2026", sub: "Save the date" },
  { label: "Time", value: "17:00 — 20:30 GST", sub: "180-minute executive dinner" },
  { label: "Venue", value: "Hilton Palm Jumeirah", sub: "Dubai" },
  { label: "Format", value: "Executive dinner", sub: "Invitation only" },
];

function StatsStrip() {
  return (
    <div className="by-stats-strip">
      {/* Interior Horizon Blue bloom — soft "lit from within" glow */}
      <span aria-hidden className="by-stats-strip__bloom" />
      {/* Slow diagonal drifting specular highlight — animated lens reflection */}
      <span aria-hidden className="by-stats-strip__shine" />

      <div className="by-stats-strip__eyebrow">
        <span aria-hidden className="by-stats-strip__eyebrow-dot" />
        Event details
      </div>

      <div className="by-stats-strip__list">
        {HERO_STATS.map((s) => (
          <div key={s.label} className="by-stats-strip__row">
            <span aria-hidden className="by-stats-strip__row-rim" />
            <div className="by-stats-strip__label">{s.label}</div>
            <div className="by-stats-strip__value">{s.value}</div>
            {s.sub && <div className="by-stats-strip__sub">{s.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section helpers ───────────────────────────────────────────────────────
function SectionHeader({
  eyebrow,
  title,
  align = "left",
  maxWidth = 720,
  theme = "light",
}: {
  eyebrow: string;
  title: React.ReactNode;
  align?: "left" | "center";
  maxWidth?: number;
  theme?: "light" | "dark";
}) {
  const titleColor = theme === "dark" ? WHITE : INK_DARK;
  return (
    <div style={{ textAlign: align, marginBottom: 40, maxWidth, marginLeft: align === "center" ? "auto" : 0, marginRight: align === "center" ? "auto" : 0 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: HORIZON,
            boxShadow: `0 0 12px ${HORIZON}`,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 11.5,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: HORIZON,
            fontWeight: 600,
            textShadow: theme === "dark" ? `0 0 14px ${HORIZON}55` : "none",
          }}
        >
          {eyebrow}
        </span>
      </div>
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 3.4vw, 46px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: titleColor,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

// ─── Why Attend ────────────────────────────────────────────────────────────
function WhyAttend() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="by-about-section">
      {/* Subtle Horizon Blue top hairline — references the dot field accent */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${HORIZON}, transparent)`,
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      {/* Dotted constellation backdrop — Blue Yonder signature pattern, edge-faded */}
      <span aria-hidden className="by-about-section__dots" />

      <div
        ref={ref}
        style={{
          position: "relative",
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 48px)",
        }}
      >
        <SectionHeader
          eyebrow="About"
          title={
            <>
              The challenge is no longer whether to digitize{" "}
              <span style={{ color: HORIZON }}>—</span> it is how to orchestrate
              it end-to-end
            </>
          }
        />

        <div
          className="by-about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: "clamp(36px, 5vw, 72px)",
            alignItems: "start",
            marginTop: 16,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(16px, 1.3vw, 18px)",
                lineHeight: 1.7,
                color: INK_BODY,
                margin: 0,
              }}
            >
              In today&rsquo;s Middle East supply chain environment, visibility
              alone is no longer enough. Business leaders need the ability to{" "}
              <span style={{ color: INK_DARK, fontWeight: 700 }}>see, decide and act</span>{" "}
              across suppliers, warehouses, transportation flows and fulfilment
              operations with speed and confidence.
            </p>
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(15px, 1.2vw, 17px)",
                lineHeight: 1.75,
                color: INK_MUTE,
                margin: "20px 0 0",
              }}
            >
              Join Blue Yonder for an exclusive executive dinner in Dubai focused
              on how leading organizations are improving supply chain resilience
              through connected execution. This curated conversation will explore
              how network visibility, warehouse agility and transportation
              orchestration can work together to create stronger operational
              control across the enterprise.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="by-problem-card"
          >
            <span aria-hidden className="by-problem-card__bloom" />
            <span aria-hidden className="by-problem-card__shine" />
            <span aria-hidden className="by-problem-card__rim" />
            <span aria-hidden className="by-problem-card__dots" />
            <div className="by-problem-card__eyebrow">
              <span aria-hidden className="by-problem-card__eyebrow-dot" />
              The problem we solve
            </div>
            <p className="by-problem-card__body">
              As regional supply chains become more complex and external
              volatility continues to impact sourcing, capacity and service
              expectations, operational control has become a board-level
              priority. For many organizations in the GCC, the challenge is no
              longer whether to digitize execution{" "}
              <span className="by-problem-card__accent">—</span> it is how to
              orchestrate it end-to-end.
            </p>
          </motion.div>
        </div>

        {/* ── Why attend — 6 takeaways ──────────────────────────────────── */}
        <div style={{ marginTop: "clamp(72px, 9vw, 120px)" }}>
          <SectionHeader
            eyebrow="Why attend"
            title="6 things you will walk away with"
          />

          <div
            className="by-takeaway-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "clamp(18px, 2vw, 24px)",
              marginTop: 22,
            }}
          >
            {TAKEAWAYS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                whileHover={{ y: -3 }}
                transition={{
                  duration: 0.65,
                  delay: 0.05 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="by-takeaway-card"
              >
                <span aria-hidden className="by-takeaway-card__number">
                  0{i + 1}
                </span>
                <p className="by-takeaway-card__body">{t}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Speaker Card ──────────────────────────────────────────────────────────
// Vertical "playing-card" layout on dark theme: photo zone on top with role
// pill + LinkedIn floating, name/title/org in a glass footer below. Initials
// placeholder when no photo is available.
function SpeakerCard({
  speaker,
  index,
  inView,
}: {
  speaker: (typeof SPEAKERS)[number];
  index: number;
  inView: boolean;
}) {
  const initials = speaker.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  const isModerator = speaker.role === "Moderator";

  return (
    <motion.article
      className="by-speaker-card"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.75,
        delay: 0.1 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Top Horizon hairline */}
      <span aria-hidden className="by-speaker-card__hairline" />

      {/* Photo zone */}
      <div className="by-speaker-card__photo-wrap">
        {/* Role pill */}
        <span
          className={`by-speaker-card__role${isModerator ? " is-moderator" : ""}`}
        >
          {speaker.role}
        </span>

        {/* LinkedIn floating chip */}
        {speaker.linkedin && (
          <a
            href={speaker.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${speaker.name} on LinkedIn`}
            className="by-speaker-card__linkedin"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.67H9.34V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
            </svg>
          </a>
        )}

        {/* Photo or initials placeholder */}
        {speaker.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={speaker.photo}
            alt={speaker.name}
            className="by-speaker-card__photo"
          />
        ) : (
          <div aria-hidden className="by-speaker-card__initials">
            <span>{initials}</span>
          </div>
        )}

      </div>

      {/* Info footer */}
      <div className="by-speaker-card__info">
        <h3 className="by-speaker-card__name">{speaker.name}</h3>
        <p className="by-speaker-card__title">{speaker.title}</p>
        <p className="by-speaker-card__org">{speaker.org}</p>
      </div>
    </motion.article>
  );
}

// ─── Speakers Section ──────────────────────────────────────────────────────
// Dark backdrop matching the hero (Midnight gradient + Horizon dot
// constellation + soft radial glow), with premium glass cards on top.
function Speakers() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="speakers" className="by-speakers-section">
      {/* Subtle Horizon top hairline — bridges from the section above */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${HORIZON}, transparent)`,
          opacity: 0.55,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Dotted constellation backdrop — Blue Yonder Infinite Scale signature */}
      <span aria-hidden className="by-speakers-section__dots" />

      {/* Soft Horizon glow — anchors the eye to the heading */}
      <span aria-hidden className="by-speakers-section__glow" />

      <div
        ref={ref}
        style={{
          position: "relative",
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 48px)",
          zIndex: 3,
        }}
      >
        <SectionHeader
          theme="dark"
          eyebrow="Speakers"
          title={
            <>
              Hosted by Blue Yonder&rsquo;s regional supply chain leadership
            </>
          }
        />

        <div
          className="by-speakers-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 260px))",
            justifyContent: "center",
            gap: "clamp(18px, 2vw, 26px)",
            marginTop: 8,
          }}
        >
          {SPEAKERS.map((s, i) => (
            <SpeakerCard key={s.name} speaker={s} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Agenda ────────────────────────────────────────────────────────────────
// ─── Agenda Row — compact schedule line ───────────────────────────────────
function AgendaRow({
  item,
  index,
  inView,
}: {
  item: AgendaItem;
  index: number;
  inView: boolean;
}) {
  const isCenterpiece = index === 2;

  return (
    <motion.li
      className={`by-agenda-row${isCenterpiece ? " is-centerpiece" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: 0.06 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span className="by-agenda-row__time">{item.time}</span>
      <div className="by-agenda-row__body">
        <h3 className="by-agenda-row__title">
          {item.title}
          {isCenterpiece && (
            <span className="by-agenda-row__star" aria-label="Centerpiece">
              Centerpiece
            </span>
          )}
        </h3>
        {item.note && <p className="by-agenda-row__note">{item.note}</p>}
      </div>
      <span className="by-agenda-row__phase">{item.phase}</span>
    </motion.li>
  );
}

// ─── Agenda Section ────────────────────────────────────────────────────────
// Returns inline content (no outer <section> or backdrop) — the parent
// BottomBlock provides the shared light backdrop and container.
function Agenda() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div id="agenda" ref={ref} style={{ position: "relative" }}>
      <SectionHeader
        eyebrow="Run of show"
        title={<>180 minutes of structured executive exchange</>}
        maxWidth={720}
      />

      <ol className="by-agenda-rows" aria-label="Run of show">
        {AGENDA.map((item, i) => (
          <AgendaRow key={i} item={item} index={i} inView={inView} />
        ))}
      </ol>

      <div className="by-agenda-outro">
        <span className="by-agenda-outro__rule" aria-hidden />
        <span className="by-agenda-outro__text">
          Times are Dubai (GST). Held at Hilton Palm Jumeirah, Dubai.
        </span>
      </div>
    </div>
  );
}

// ─── About Blue Yonder ─────────────────────────────────────────────────────
// Four pillars of the Blue Yonder platform — used in the About BY section.
// Each pillar is a glass tile with an outline SVG icon, name, and one-line
// descriptor. The icons are stroke-only so they pick up `currentColor`.
const BY_PILLARS: { name: string; desc: string; Icon: () => React.JSX.Element }[] = [
  {
    name: "Planning",
    desc: "Forecast demand, plan supply and orchestrate inventory with AI.",
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 17V7" />
        <path d="M9 17V11" />
        <path d="M15 17V4" />
        <path d="M21 17V9" />
        <path d="M2 20h20" />
      </svg>
    ),
  },
  {
    name: "Execution",
    desc: "Run warehouses, transportation and labour as one connected network.",
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="6" cy="6" r="2.2" />
        <circle cx="18" cy="6" r="2.2" />
        <circle cx="6" cy="18" r="2.2" />
        <circle cx="18" cy="18" r="2.2" />
        <path d="M8.2 6h7.6" />
        <path d="M18 8.2v7.6" />
        <path d="M15.8 18H8.2" />
        <path d="M6 15.8V8.2" />
      </svg>
    ),
  },
  {
    name: "Commerce",
    desc: "Connect order, fulfilment and channel performance end to end.",
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 7h18l-1.5 11.2a2 2 0 0 1-2 1.8H6.5a2 2 0 0 1-2-1.8L3 7Z" />
        <path d="M8 7V5a4 4 0 1 1 8 0v2" />
      </svg>
    ),
  },
  {
    name: "Returns",
    desc: "Recover value through smarter reverse logistics and disposition.",
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 12a9 9 0 0 1 15.5-6.2" />
        <path d="M21 4v5h-5" />
        <path d="M21 12a9 9 0 0 1-15.5 6.2" />
        <path d="M3 20v-5h5" />
      </svg>
    ),
  },
];

function AboutBlueYonder() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div id="about-by" ref={ref} style={{ position: "relative" }}>
      <div className="by-aboutby-grid">
          {/* Left — copy + CTA */}
          <motion.div
            className="by-aboutby-lead"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="by-aboutby-eyebrow">
              <span aria-hidden className="by-aboutby-eyebrow__dot" />
              <span>About Blue Yonder</span>
            </div>
            <h2 className="by-aboutby-title">
              AI-powered supply chain planning{" "}
              <span style={{ color: HORIZON }}>&amp;</span> execution across the
              network
            </h2>
            <p className="by-aboutby-lead__body">
              Blue Yonder is the world leader in end-to-end digital supply chain
              transformation, unifying planning, execution, commerce and returns
              on a cognitive platform that helps businesses make better
              decisions, act faster and operate with greater confidence.
            </p>
            <p className="by-aboutby-lead__body by-aboutby-lead__body--mute">
              From suppliers and distribution centers to transportation networks
              and stores, Blue Yonder enables more resilient, efficient and
              connected supply chains.
            </p>

            <a
              href="https://blueyonder.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="by-aboutby-cta"
            >
              <span>Visit blueyonder.com</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </motion.div>

          {/* Right — 4-pillar grid */}
          <motion.div
            className="by-aboutby-pillars"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            aria-label="What Blue Yonder unifies"
          >
            <span className="by-aboutby-pillars__caption">
              <span aria-hidden className="by-aboutby-pillars__caption-rule" />
              One platform · four pillars
            </span>
            <div className="by-aboutby-pillars__grid">
              {BY_PILLARS.map(({ name, desc, Icon }, i) => (
                <motion.div
                  key={name}
                  className="by-aboutby-pillar"
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.55,
                    delay: 0.18 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span aria-hidden className="by-aboutby-pillar__hairline" />
                  <span className="by-aboutby-pillar__icon">
                    <Icon />
                  </span>
                  <h3 className="by-aboutby-pillar__name">{name}</h3>
                  <p className="by-aboutby-pillar__desc">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
    </div>
  );
}

// ─── Form Field helper ─────────────────────────────────────────────────────
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
    <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: error ? "#ffb4c4" : FAINT,
          fontWeight: 600,
        }}
      >
        {label}
        {required && <span style={{ color: HORIZON, marginLeft: 4 }}>*</span>}
      </span>
      {children}
      {error && (
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            color: "#ffb4c4",
            marginTop: 2,
          }}
        >
          {error}
        </span>
      )}
    </label>
  );
}

// ─── Reservation Form ──────────────────────────────────────────────────────
function ReservationForm() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  // Phone: default to UAE (+971) since the event is in Dubai
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
    else if (!isWorkEmail(email.trim()))
      newErrors.email = "Please use your work email — free providers are not accepted";
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
    const cleanPhoneDigits = phone.replace(/[\s\-()]/g, "");
    const fullPhone = `${phoneCountry.code} ${cleanPhoneDigits}`;
    const res = await submitForm({
      type: "contact",
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      job_title: jobTitle.trim(),
      company: company.trim(),
      phone: fullPhone,
      event_name:
        "Blue Yonder Executive Dinner — Visibility, Control & Networked Execution · Dubai 23 September 2026",
      metadata: {
        "Event Page": "Blue Yonder Executive Dinner · Dubai",
        "Page Section": "Reservation Form",
        "First Name": firstName.trim(),
        "Last Name": lastName.trim(),
        "Phone Country": `${phoneCountry.name} (${phoneCountry.code})`,
        Country: country,
        Industry: industry,
        "Consent Given": "true",
      },
    });
    if (res.success) {
      setSubmitState("success");
      setEmail("");
      setFirstName("");
      setLastName("");
      setJobTitle("");
      setCompany("");
      setPhone("");
      setPhoneCountry(defaultPhoneCountry);
      setCountry("");
      setIndustry("");
      setConsent(false);
    } else {
      setSubmitState("error");
      setSubmitError(res.error || "Something went wrong. Please try again.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${HAIR_STRONG}`,
    background: "rgba(255,255,255,0.04)",
    color: WHITE,
    fontFamily: "var(--font-outfit)",
    fontSize: 14.5,
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  };

  return (
    <div id="reserve" ref={ref} style={{ position: "relative" }}>
        <div
          className="by-form-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.95fr 1.05fr",
            gap: "clamp(36px, 5vw, 72px)",
            alignItems: "start",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeader
              eyebrow="Reserve"
              title={
                <>
                  Request your seat at the table
                </>
              }
              maxWidth={520}
            />
            <p
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "clamp(15px, 1.2vw, 17px)",
                lineHeight: 1.7,
                color: INK_BODY,
                margin: "0 0 22px",
                maxWidth: 460,
              }}
            >
              This dinner is by invitation only. Apply below and our team will
              be in touch with venue details and confirmation within 48 hours.
            </p>

            <div className="by-reserve-info">
              <span aria-hidden className="by-reserve-info__hairline" />
              <Detail
                icon="date"
                label="Date"
                value="23 September 2026"
                sub="Save the date"
              />
              <Detail
                icon="location"
                label="Location"
                value="Hilton Palm Jumeirah"
                sub="Dubai"
              />
              <Detail
                icon="format"
                label="Format"
                value="Executive dinner — invitation only"
              />
              <Detail
                icon="audience"
                label="Audience"
                value="GCC supply chain & operations leaders"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              padding: "clamp(24px, 3vw, 36px)",
              borderRadius: 20,
              background: `linear-gradient(165deg, ${MIDNIGHT} 0%, ${MIDNIGHT_DEEP} 100%)`,
              border: `1px solid ${MIDNIGHT}`,
              boxShadow: `0 24px 60px rgba(0,14,78,0.25), inset 0 1px 0 rgba(255,255,255,0.08)`,
              overflow: "hidden",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: "8%",
                right: "8%",
                height: 1,
                background: `linear-gradient(90deg, transparent, ${HORIZON}, transparent)`,
                opacity: 0.7,
              }}
            />

            {submitState === "success" ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: HORIZON,
                    marginBottom: 18,
                    boxShadow: `0 12px 32px ${HORIZON}55`,
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={MIDNIGHT_DEEP} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(20px, 2vw, 24px)",
                    fontWeight: 700,
                    color: WHITE,
                  }}
                >
                  Request received.
                </h3>
                <p
                  style={{
                    margin: "12px auto 0",
                    fontFamily: "var(--font-outfit)",
                    fontSize: 14.5,
                    color: MUTE,
                    lineHeight: 1.6,
                    maxWidth: 380,
                  }}
                >
                  We&rsquo;ll be in touch within 48 hours with your invitation
                  and venue details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
                />

                <Field label="Business email" error={errors.email} required>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder="name@company.com"
                    autoComplete="email"
                    style={inputStyle}
                    aria-invalid={!!errors.email}
                    suppressHydrationWarning
                  />
                </Field>

                <div className="by-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="First name" error={errors.firstName} required>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) setErrors({ ...errors, firstName: "" });
                      }}
                      autoComplete="given-name"
                      style={inputStyle}
                      aria-invalid={!!errors.firstName}
                      suppressHydrationWarning
                    />
                  </Field>
                  <Field label="Last name" error={errors.lastName} required>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName) setErrors({ ...errors, lastName: "" });
                      }}
                      autoComplete="family-name"
                      style={inputStyle}
                      aria-invalid={!!errors.lastName}
                      suppressHydrationWarning
                    />
                  </Field>
                </div>

                <div className="by-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Job title" error={errors.jobTitle} required>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => {
                        setJobTitle(e.target.value);
                        if (errors.jobTitle) setErrors({ ...errors, jobTitle: "" });
                      }}
                      autoComplete="organization-title"
                      style={inputStyle}
                      aria-invalid={!!errors.jobTitle}
                      suppressHydrationWarning
                    />
                  </Field>
                  <Field label="Company" error={errors.company} required>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        if (errors.company) setErrors({ ...errors, company: "" });
                      }}
                      autoComplete="organization"
                      style={inputStyle}
                      aria-invalid={!!errors.company}
                      suppressHydrationWarning
                    />
                  </Field>
                </div>

                <Field label="Phone number" error={errors.phone} required>
                  <div
                    className="by-phone-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(118px, 130px) 1fr",
                      gap: 10,
                    }}
                  >
                    <select
                      value={phoneCountry.code + "-" + phoneCountry.country}
                      onChange={(e) => {
                        const [code, country] = e.target.value.split("-");
                        const next = COUNTRY_CODES.find(
                          (c) => c.code === code && c.country === country,
                        );
                        if (next) {
                          setPhoneCountry(next);
                          // Trim phone to new max length when switching country
                          setPhone((prev) => prev.slice(0, next.length));
                          if (errors.phone) setErrors({ ...errors, phone: "" });
                        }
                      }}
                      aria-label="Phone country code"
                      style={inputStyle}
                      suppressHydrationWarning
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option
                          key={`${c.code}-${c.country}`}
                          value={`${c.code}-${c.country}`}
                          style={{ background: MIDNIGHT_DEEP }}
                        >
                          {c.country} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => {
                        const digitsOnly = e.target.value
                          .replace(/[^\d]/g, "")
                          .slice(0, phoneCountry.length);
                        setPhone(digitsOnly);
                        if (errors.phone) setErrors({ ...errors, phone: "" });
                      }}
                      placeholder={phoneCountry.placeholder}
                      autoComplete="tel-national"
                      maxLength={phoneCountry.length}
                      style={inputStyle}
                      aria-invalid={!!errors.phone}
                      suppressHydrationWarning
                    />
                  </div>
                </Field>

                <div className="by-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Country" error={errors.country} required>
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        if (errors.country) setErrors({ ...errors, country: "" });
                      }}
                      style={inputStyle}
                      aria-invalid={!!errors.country}
                      suppressHydrationWarning
                    >
                      <option value="" style={{ background: MIDNIGHT_DEEP }}>Select…</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} style={{ background: MIDNIGHT_DEEP }}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Industry" error={errors.industry} required>
                    <select
                      value={industry}
                      onChange={(e) => {
                        setIndustry(e.target.value);
                        if (errors.industry) setErrors({ ...errors, industry: "" });
                      }}
                      style={inputStyle}
                      aria-invalid={!!errors.industry}
                      suppressHydrationWarning
                    >
                      <option value="" style={{ background: MIDNIGHT_DEEP }}>Select…</option>
                      {INDUSTRIES.map((i) => (
                        <option key={i} value={i} style={{ background: MIDNIGHT_DEEP }}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    cursor: "pointer",
                    marginTop: 4,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (errors.consent) setErrors({ ...errors, consent: "" });
                    }}
                    style={{
                      flexShrink: 0,
                      width: 16,
                      height: 16,
                      marginTop: 3,
                      accentColor: HORIZON,
                    }}
                    suppressHydrationWarning
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-outfit)",
                      fontSize: 12.5,
                      color: errors.consent ? "#ffb4c4" : FAINT,
                      lineHeight: 1.5,
                    }}
                  >
                    I agree to receive event-related communications from Events
                    First Group and Blue Yonder. I understand my information
                    will be handled per the relevant privacy policies.
                  </span>
                </label>

                {submitError && (
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: "rgba(217, 38, 74, 0.12)",
                      border: "1px solid rgba(217, 38, 74, 0.35)",
                      fontFamily: "var(--font-outfit)",
                      fontSize: 13,
                      color: "#ffb4c4",
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitState === "submitting"}
                  style={{
                    marginTop: 6,
                    padding: "14px 22px",
                    borderRadius: 10,
                    border: "none",
                    background: HORIZON,
                    color: MIDNIGHT_DEEP,
                    fontFamily: "var(--font-outfit)",
                    fontWeight: 700,
                    fontSize: 14.5,
                    letterSpacing: "0.02em",
                    cursor: submitState === "submitting" ? "wait" : "pointer",
                    boxShadow: `0 12px 30px ${HORIZON}55, inset 0 1px 0 rgba(255,255,255,0.5)`,
                    transition: "transform 0.2s, box-shadow 0.2s, opacity 0.2s",
                    opacity: submitState === "submitting" ? 0.7 : 1,
                  }}
                >
                  {submitState === "submitting" ? "Submitting…" : "Request my seat"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
    </div>
  );
}

type DetailIcon = "date" | "location" | "format" | "audience";

function DetailIconSvg({ kind }: { kind: DetailIcon }) {
  switch (kind) {
    case "date":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4" />
          <path d="M8 3v4" />
          <path d="M3 10h18" />
        </svg>
      );
    case "location":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "format":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 11a8 8 0 0 1 16 0v3a2 2 0 0 1-2 2h-2v-5h4" />
          <path d="M3 14a2 2 0 0 0 2 2h2v-5H3" />
        </svg>
      );
    case "audience":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
  }
}

function Detail({
  icon,
  label,
  value,
  sub,
}: {
  icon: DetailIcon;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="by-reserve-detail">
      <span aria-hidden className="by-reserve-detail__icon">
        <DetailIconSvg kind={icon} />
      </span>
      <span style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 10.5,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: HORIZON_DEEP,
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 14.5,
            color: INK_DARK,
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          {value}
        </span>
        {sub && (
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 12,
              color: INK_MUTE,
              marginTop: 2,
            }}
          >
            {sub}
          </span>
        )}
      </span>
    </div>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="by-footer">
      <span aria-hidden className="by-footer__hairline" />
      <div className="by-footer__inner">
        <ByLogo size={26} tone="dark" />
        <div className="by-footer__right">
          <span className="by-footer__initiative-label">An initiative by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/events-first-group_logo_alt.svg"
            alt="Events First Group"
            className="by-footer__efg-logo"
            width={120}
            height={42}
          />
        </div>
      </div>
    </footer>
  );
}

// ─── Page styles (responsive overrides) ────────────────────────────────────
const PAGE_STYLES = `
  /* Hero CTA — pill button with lift-on-hover. CSS-driven so the React render
     path stays small and the mouse-handler closures stop allocating per render. */
  .by-hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 28px;
    border-radius: 999px;
    background: ${HORIZON};
    color: ${MIDNIGHT_DEEP};
    font-family: var(--font-outfit);
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.01em;
    text-decoration: none;
    box-shadow: 0 18px 40px ${HORIZON}44, 0 0 0 1px ${HORIZON}88, inset 0 1px 0 rgba(255,255,255,0.5);
    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s;
    will-change: transform;
  }
  .by-hero-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 24px 50px ${HORIZON}66, 0 0 0 1px ${HORIZON}, inset 0 1px 0 rgba(255,255,255,0.55);
  }

  /* ─── Hero Eyebrow — frosted glass pill ──────────────────────────────── */
  .by-hero-eyebrow {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 9px 18px;
    border-radius: 999px;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.10) 0%,
      rgba(255,255,255,0.025) 100%);
    border: 1px solid rgba(255,255,255,0.16);
    backdrop-filter: blur(14px) saturate(170%);
    -webkit-backdrop-filter: blur(14px) saturate(170%);
    box-shadow:
      0 10px 28px rgba(0,0,0,0.30),
      0 0 30px rgba(0,183,241,0.08),
      inset 0 1px 0 rgba(255,255,255,0.22),
      inset 0 -1px 0 rgba(0,0,0,0.35);
    margin-bottom: 36px;
  }
  .by-hero-eyebrow-text {
    font-family: var(--font-outfit);
    font-size: 11px;
    letter-spacing: 0.30em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.85);
    font-weight: 500;
    text-shadow: 0 1px 0 rgba(0,0,0,0.30);
    white-space: nowrap;
  }
  .by-hero-eyebrow-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${HORIZON};
    box-shadow: 0 0 12px ${HORIZON}, 0 0 4px ${HORIZON}, inset 0 1px 1px rgba(255,255,255,0.55);
    animation: by-eyebrow-pulse 3.2s ease-in-out infinite;
  }

  /* ─── About Section — layered brand-ambient backdrop ─────────────────── */
  /* Multi-stop gradient base + asymmetric Horizon Blue blooms + a Plum touch +
     the dotted constellation pattern on top. Reads as premium-paper depth
     rather than flat white. */
  .by-about-section {
    position: relative;
    padding: clamp(60px, 6.5vw, 96px) 0;
    background:
      /* Top-left Horizon Blue bloom — primary brand glow */
      radial-gradient(ellipse 55% 50% at 12% 18%, rgba(0,183,241,0.16) 0%, rgba(0,183,241,0.05) 35%, transparent 70%),
      /* Bottom-right Horizon Blue counterpoint */
      radial-gradient(ellipse 50% 45% at 88% 82%, rgba(0,183,241,0.12) 0%, rgba(0,183,241,0.04) 35%, transparent 72%),
      /* Mid-right Harvest Plum touch — small brand-color complement */
      radial-gradient(ellipse 30% 30% at 78% 32%, rgba(106,1,54,0.05) 0%, transparent 75%),
      /* Vertical depth base — subtle cool-to-warm-to-cool */
      linear-gradient(180deg, #f7f9fc 0%, #ffffff 38%, #ffffff 62%, #f4f7fc 100%);
    overflow: hidden;
  }
  /* Subtle Horizon Blue top + bottom hairlines for section framing */
  .by-about-section::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 18%;
    right: 18%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${HORIZON}, transparent);
    opacity: 0.4;
    pointer-events: none;
    z-index: 1;
  }
  /* Dotted constellation backdrop — denser core, faded edges */
  .by-about-section__dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(0,183,241,0.28) 1.2px, transparent 1.6px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 85% 70% at 50% 50%, black 0%, black 30%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse 85% 70% at 50% 50%, black 0%, black 30%, transparent 80%);
    pointer-events: none;
    opacity: 0.6;
    z-index: 0;
  }

  /* ─── Problem-We-Solve Card — light skeumorphic liquid glass ─────────── */
  .by-problem-card {
    position: relative;
    padding: clamp(24px, 2.6vw, 34px) clamp(24px, 2.6vw, 32px) clamp(24px, 2.6vw, 34px) clamp(28px, 2.8vw, 36px);
    border-radius: 20px;
    background: linear-gradient(180deg,
      #ffffff 0%,
      #fbfcfe 40%,
      #f3f6fb 100%);
    border: 1px solid rgba(0,14,78,0.08);
    box-shadow:
      0 24px 60px rgba(0,14,78,0.12),
      0 8px 20px rgba(0,14,78,0.08),
      0 0 70px rgba(0,183,241,0.10),
      inset 0 1px 0 rgba(255,255,255,0.95),
      inset 0 -1px 0 rgba(0,14,78,0.10),
      inset -1px 0 0 rgba(0,183,241,0.10);
    overflow: hidden;
    isolation: isolate;
    transition: box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }
  /* Hover — intensified Horizon halo + deeper drop (lift comes from framer) */
  .by-problem-card:hover {
    box-shadow:
      0 32px 80px rgba(0,14,78,0.16),
      0 12px 28px rgba(0,14,78,0.10),
      0 0 110px rgba(0,183,241,0.20),
      inset 0 1px 0 rgba(255,255,255,0.95),
      inset 0 -1px 0 rgba(0,14,78,0.10),
      inset -1px 0 0 rgba(0,183,241,0.18);
  }
  .by-problem-card:hover .by-problem-card__bloom {
    opacity: 1;
  }
  /* Specular shine — soft white reflection on the top half */
  .by-problem-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.85) 0%,
      rgba(255,255,255,0.20) 50%,
      transparent 100%);
    border-radius: 20px 20px 0 0;
    pointer-events: none;
    opacity: 0.6;
    z-index: 2;
  }
  /* Horizon Blue rim accent — brand glint catching the top edge */
  .by-problem-card::after {
    content: "";
    position: absolute;
    top: 0;
    left: 12%;
    right: 12%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${HORIZON}, transparent);
    opacity: 0.95;
    pointer-events: none;
    z-index: 3;
  }
  /* Interior Horizon Blue bloom — soft lit-from-within glow */
  .by-problem-card__bloom {
    position: absolute;
    left: 18%;
    top: 20%;
    width: 70%;
    height: 65%;
    background: radial-gradient(ellipse at center,
      rgba(0,183,241,0.16) 0%,
      rgba(0,183,241,0.06) 35%,
      transparent 75%);
    filter: blur(30px);
    pointer-events: none;
    z-index: 1;
    opacity: 0.85;
    animation: by-problem-bloom 10s ease-in-out infinite;
    transition: opacity 0.45s ease;
  }
  @keyframes by-problem-bloom {
    0%, 100% { transform: translate(0, 0) scale(1);    opacity: 0.7; }
    50%      { transform: translate(10px, -8px) scale(1.06); opacity: 0.95; }
  }
  /* Drifting diagonal specular shine — slow lens-pass reflection */
  .by-problem-card__shine {
    position: absolute;
    top: 0;
    left: -40%;
    width: 45%;
    height: 100%;
    background: linear-gradient(115deg,
      transparent 0%,
      rgba(255,255,255,0.0) 30%,
      rgba(255,255,255,0.40) 50%,
      rgba(255,255,255,0.0) 70%,
      transparent 100%
    );
    filter: blur(8px);
    pointer-events: none;
    z-index: 2;
    animation: by-problem-shine 18s ease-in-out infinite;
  }
  @keyframes by-problem-shine {
    0%   { transform: translateX(0%);   opacity: 0; }
    12%  { opacity: 0.85; }
    50%  { opacity: 0.85; }
    88%  { opacity: 0; }
    100% { transform: translateX(320%); opacity: 0; }
  }
  /* Vertical Horizon Blue accent bar — left-edge brand stripe */
  .by-problem-card__rim {
    position: absolute;
    top: 16%;
    bottom: 16%;
    left: 0;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg,
      transparent 0%,
      ${HORIZON} 18%,
      ${HORIZON} 82%,
      transparent 100%);
    box-shadow:
      0 0 14px rgba(0,183,241,0.45),
      0 0 5px rgba(0,183,241,0.75);
    pointer-events: none;
    z-index: 4;
  }
  /* Corner Blue Yonder dot accent — brand decoration in bottom-right */
  .by-problem-card__dots {
    position: absolute;
    bottom: -16px;
    right: -16px;
    width: 140px;
    height: 140px;
    background-image: radial-gradient(rgba(0,183,241,0.45) 1.3px, transparent 1.7px);
    background-size: 13px 13px;
    mask-image: radial-gradient(circle at 100% 100%, black 0%, black 20%, transparent 70%);
    -webkit-mask-image: radial-gradient(circle at 100% 100%, black 0%, black 20%, transparent 70%);
    pointer-events: none;
    opacity: 0.55;
    z-index: 1;
  }
  .by-problem-card__eyebrow {
    position: relative;
    z-index: 4;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    font-family: var(--font-outfit);
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: ${HORIZON_DEEP};
    font-weight: 700;
  }
  .by-problem-card__eyebrow-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${HORIZON};
    box-shadow: 0 0 10px ${HORIZON}66, inset 0 1px 1px rgba(255,255,255,0.6);
    animation: by-eyebrow-pulse 3.2s ease-in-out infinite;
  }
  .by-problem-card__body {
    position: relative;
    z-index: 4;
    margin: 0;
    font-family: var(--font-outfit);
    font-size: clamp(14.5px, 1.1vw, 16px);
    line-height: 1.7;
    color: ${INK_BODY};
  }
  .by-problem-card__accent {
    color: ${HORIZON_DEEP};
    font-weight: 600;
  }

  /* ─── Why-attend takeaway cards — light skeumorphic glass tiles ──────── */
  .by-takeaway-card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(14px, 1.5vw, 18px) clamp(16px, 1.7vw, 20px);
    min-height: clamp(82px, 7vw, 100px);
    border-radius: 14px;
    background: linear-gradient(180deg,
      #ffffff 0%,
      #fbfcfe 45%,
      #f4f7fc 100%);
    border: 1px solid rgba(0,14,78,0.08);
    box-shadow:
      0 14px 36px rgba(0,14,78,0.09),
      0 4px 12px rgba(0,14,78,0.06),
      0 0 50px rgba(0,183,241,0.06),
      inset 0 1px 0 rgba(255,255,255,0.95),
      inset 0 -1px 0 rgba(0,14,78,0.08),
      inset -1px 0 0 rgba(0,183,241,0.08);
    overflow: hidden;
    isolation: isolate;
    transition: box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }
  /* Specular shine — soft white reflection on top half */
  .by-takeaway-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.75) 0%,
      rgba(255,255,255,0.18) 50%,
      transparent 100%);
    border-radius: 16px 16px 0 0;
    pointer-events: none;
    opacity: 0.55;
    z-index: 1;
  }
  /* Horizon Blue rim accent — top edge glint */
  .by-takeaway-card::after {
    content: "";
    position: absolute;
    top: 0;
    left: 14%;
    right: 14%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${HORIZON}, transparent);
    opacity: 0.85;
    pointer-events: none;
    z-index: 2;
  }
  /* Hover — intensified Horizon halo + deeper drop (lift comes from framer) */
  .by-takeaway-card:hover {
    box-shadow:
      0 22px 50px rgba(0,14,78,0.13),
      0 8px 18px rgba(0,14,78,0.08),
      0 0 80px rgba(0,183,241,0.16),
      inset 0 1px 0 rgba(255,255,255,0.95),
      inset 0 -1px 0 rgba(0,14,78,0.08),
      inset -1px 0 0 rgba(0,183,241,0.16);
  }
  .by-takeaway-card:hover .by-takeaway-card__number {
    background: linear-gradient(180deg,
      rgba(0,183,241,0.36) 0%,
      rgba(0,183,241,0.16) 60%,
      rgba(0,183,241,0.06) 100%);
    -webkit-background-clip: text;
    background-clip: text;
  }

  /* Oversized watermark number — sits as a background element in the corner */
  .by-takeaway-card__number {
    position: absolute;
    bottom: -16px;
    right: -8px;
    font-family: var(--font-display);
    font-size: clamp(92px, 10vw, 138px);
    font-weight: 700;
    letter-spacing: -0.06em;
    line-height: 0.88;
    font-variant-numeric: tabular-nums;
    background: linear-gradient(180deg,
      rgba(0,183,241,0.24) 0%,
      rgba(0,183,241,0.10) 60%,
      rgba(0,183,241,0.04) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    pointer-events: none;
    user-select: none;
    z-index: 1;
    transition: background 0.45s ease;
  }
  .by-takeaway-card__body {
    position: relative;
    z-index: 3;
    margin: 0;
    font-family: var(--font-outfit);
    font-size: 17.5px;
    line-height: 1.5;
    color: ${INK_BODY};
    font-weight: 500;
    text-align: center;
    max-width: 92%;
  }

  /* ─── Hero Headline — premium typographic treatment ──────────────────── */
  .by-hero-headline {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(38px, 5vw, 78px);
    font-weight: 600;
    letter-spacing: -0.028em;
    line-height: 1.02;
    max-width: 720px;
    /* Vertical white → cool-white gradient via background-clip text */
    background: linear-gradient(180deg,
      #ffffff 0%,
      #ffffff 42%,
      #dde4f0 88%,
      #c8d2e3 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    /* Ambient Horizon Blue underglow + depth shadow */
    filter:
      drop-shadow(0 0 32px rgba(0,183,241,0.18))
      drop-shadow(0 3px 10px rgba(0,0,0,0.45));
  }

  /* ─── Stats Strip — skeumorphic liquid glass (upgraded) ──────────────── */
  .by-stats-strip {
    position: relative;
    padding: clamp(20px, 1.8vw, 26px) clamp(20px, 2vw, 28px);
    border-radius: 22px;
    background:
      linear-gradient(180deg,
        rgba(255,255,255,0.105) 0%,
        rgba(255,255,255,0.040) 10%,
        rgba(255,255,255,0.022) 46%,
        rgba(255,255,255,0.030) 80%,
        rgba(0,183,241,0.065) 100%
      );
    border: 1px solid rgba(255,255,255,0.16);
    backdrop-filter: blur(26px) saturate(190%);
    -webkit-backdrop-filter: blur(26px) saturate(190%);
    /* Outer drop + soft Horizon halo + inner relief: top highlight, bottom
       darkness, side rim lights */
    box-shadow:
      0 40px 100px rgba(0,0,0,0.58),
      0 12px 28px rgba(0,0,0,0.32),
      0 0 80px rgba(0,183,241,0.10),
      inset 0 1px 0 rgba(255,255,255,0.26),
      inset 0 -1px 0 rgba(0,0,0,0.55),
      inset 1px 0 0 rgba(255,255,255,0.06),
      inset -1px 0 0 rgba(0,183,241,0.14);
    overflow: hidden;
  }
  /* Specular shine — glossy reflection covering the top half */
  .by-stats-strip::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 55%;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.12) 0%,
      rgba(255,255,255,0.04) 38%,
      transparent 100%
    );
    border-radius: 22px 22px 0 0;
    pointer-events: none;
    z-index: 2;
  }
  /* Horizon Blue rim accent — the brand glint where the top edge catches light */
  .by-stats-strip::after {
    content: "";
    position: absolute;
    top: 0;
    left: 12%;
    right: 12%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${HORIZON}, transparent);
    opacity: 0.95;
    pointer-events: none;
    z-index: 3;
  }
  /* Interior Horizon Blue bloom — soft glow inside the glass, behind content */
  .by-stats-strip__bloom {
    position: absolute;
    left: 18%;
    top: 22%;
    width: 70%;
    height: 64%;
    background: radial-gradient(ellipse at center,
      rgba(0,183,241,0.22) 0%,
      rgba(0,183,241,0.08) 38%,
      transparent 75%);
    filter: blur(28px);
    pointer-events: none;
    z-index: 0;
    animation: by-stats-bloom 9s ease-in-out infinite;
  }
  @keyframes by-stats-bloom {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.85; }
    50%      { transform: translate(8px, -6px) scale(1.06); opacity: 1; }
  }
  /* Drifting diagonal specular shine — slow-moving lens reflection */
  .by-stats-strip__shine {
    position: absolute;
    top: 0;
    left: -40%;
    width: 45%;
    height: 100%;
    background: linear-gradient(115deg,
      transparent 0%,
      rgba(255,255,255,0.00) 30%,
      rgba(255,255,255,0.14) 50%,
      rgba(255,255,255,0.00) 70%,
      transparent 100%
    );
    filter: blur(6px);
    pointer-events: none;
    z-index: 1;
    animation: by-stats-shine 16s ease-in-out infinite;
  }
  @keyframes by-stats-shine {
    0%   { transform: translateX(0%);   opacity: 0; }
    12%  { opacity: 0.9; }
    50%  { opacity: 0.9; }
    88%  { opacity: 0; }
    100% { transform: translateX(320%); opacity: 0; }
  }

  .by-stats-strip__eyebrow {
    position: relative;
    z-index: 4;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-family: var(--font-outfit);
    font-size: 10px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: ${HORIZON};
    font-weight: 600;
    text-shadow: 0 1px 0 rgba(0,0,0,0.35);
  }
  /* Pulsing eyebrow dot — soft breathing glow */
  .by-stats-strip__eyebrow-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${HORIZON};
    box-shadow: 0 0 12px ${HORIZON}, 0 0 4px ${HORIZON}, inset 0 1px 1px rgba(255,255,255,0.55);
    animation: by-eyebrow-pulse 3.2s ease-in-out infinite;
  }
  @keyframes by-eyebrow-pulse {
    0%, 100% { transform: scale(1);    box-shadow: 0 0 12px ${HORIZON}, 0 0 4px ${HORIZON}, inset 0 1px 1px rgba(255,255,255,0.55); }
    50%      { transform: scale(1.18); box-shadow: 0 0 20px ${HORIZON}, 0 0 8px ${HORIZON}, inset 0 1px 1px rgba(255,255,255,0.75); }
  }

  .by-stats-strip__list {
    position: relative;
    z-index: 4;
    display: flex;
    flex-direction: column;
  }

  .by-stats-strip__row {
    position: relative;
    padding: 10px 14px 10px 18px;
    margin: 0 -14px 0 -18px;
    border-radius: 10px;
    transition: background 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s;
  }
  /* Per-row left-edge Horizon Blue rim — invisible at rest, lights up on hover */
  .by-stats-strip__row-rim {
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 4px;
    width: 2px;
    border-radius: 2px;
    background: ${HORIZON};
    opacity: 0;
    box-shadow: 0 0 10px ${HORIZON}, 0 0 4px ${HORIZON};
    transition: opacity 0.3s ease;
  }
  /* Etched-groove divider between rows */
  .by-stats-strip__row + .by-stats-strip__row {
    border-top: 1px solid rgba(0,0,0,0.40);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  }
  /* Row hover — Horizon Blue ambient lift */
  .by-stats-strip__row:hover {
    background: linear-gradient(90deg,
      rgba(0,183,241,0.08) 0%,
      rgba(0,183,241,0.02) 50%,
      transparent 100%);
  }
  .by-stats-strip__row:hover .by-stats-strip__row-rim {
    opacity: 1;
  }
  .by-stats-strip__row:hover .by-stats-strip__value {
    text-shadow:
      0 1px 1px rgba(0,0,0,0.50),
      0 0 26px rgba(0,183,241,0.30);
  }

  .by-stats-strip__label {
    position: relative;
    font-family: var(--font-outfit);
    font-size: 9.5px;
    letter-spacing: 0.30em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.58);
    font-weight: 600;
    margin-bottom: 3px;
    text-shadow: 0 1px 0 rgba(0,0,0,0.40);
  }
  .by-stats-strip__value {
    position: relative;
    font-family: var(--font-display);
    font-size: clamp(16px, 1.3vw, 19px);
    color: #ffffff;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.15;
    font-variant-numeric: tabular-nums;
    /* Engraved-into-glass: crisp dark depth + soft Horizon inner light */
    text-shadow:
      0 1px 1px rgba(0,0,0,0.50),
      0 0 22px rgba(0,183,241,0.12);
    transition: text-shadow 0.3s ease;
  }
  .by-stats-strip__sub {
    position: relative;
    margin-top: 2px;
    font-family: var(--font-outfit);
    font-size: 11.5px;
    color: rgba(255,255,255,0.55);
    line-height: 1.35;
    text-shadow: 0 1px 0 rgba(0,0,0,0.30);
  }
  /* ─── Speakers section — dark backdrop ─────────────────────────────── */
  .by-speakers-section {
    position: relative;
    padding: clamp(60px, 6.5vw, 96px) 0;
    background: linear-gradient(180deg, ${MIDNIGHT_DEEP} 0%, #010210 100%);
    overflow: hidden;
    isolation: isolate;
  }
  .by-speakers-section__dots {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: radial-gradient(rgba(0,183,241,0.20) 1px, transparent 1.4px);
    background-size: 26px 26px;
    background-position: 0 0;
    opacity: 0.55;
    -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 35%, transparent 80%);
    mask-image: radial-gradient(ellipse at 50% 40%, #000 35%, transparent 80%);
    z-index: 1;
  }
  .by-speakers-section__glow {
    position: absolute;
    top: -10%;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    height: 60%;
    background: radial-gradient(ellipse at 50% 30%, ${HORIZON}1c 0%, ${HORIZON}08 35%, transparent 70%);
    filter: blur(40px);
    pointer-events: none;
    z-index: 1;
  }

  /* ─── Speaker card — dark glass ────────────────────────────────────── */
  .by-speaker-card {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    overflow: hidden;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 60%, rgba(0,14,78,0.20) 100%);
    border: 1px solid rgba(255,255,255,0.10);
    backdrop-filter: blur(18px) saturate(135%);
    -webkit-backdrop-filter: blur(18px) saturate(135%);
    box-shadow:
      0 22px 60px rgba(0,0,0,0.55),
      0 1px 0 rgba(255,255,255,0.08) inset,
      0 -1px 0 rgba(255,255,255,0.04) inset;
    transition:
      transform 0.55s cubic-bezier(0.22,1,0.36,1),
      border-color 0.4s ease,
      box-shadow 0.4s ease;
    isolation: isolate;
  }
  .by-speaker-card:hover {
    transform: translateY(-6px);
    border-color: rgba(0,183,241,0.42);
    box-shadow:
      0 32px 80px rgba(0,0,0,0.6),
      0 0 0 1px rgba(0,183,241,0.30) inset,
      0 0 42px rgba(0,183,241,0.22);
  }
  .by-speaker-card__hairline {
    position: absolute;
    top: 0;
    left: 8%;
    right: 8%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${HORIZON}, transparent);
    opacity: 0.85;
    z-index: 5;
    pointer-events: none;
  }
  .by-speaker-card__photo-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1.15;
    overflow: hidden;
    background: linear-gradient(160deg, ${MIDNIGHT} 0%, ${MIDNIGHT_DEEP} 100%);
  }
  .by-speaker-card__photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 28%;
    filter: saturate(0.95) contrast(1.06);
    transition: transform 1s cubic-bezier(0.22,1,0.36,1);
  }
  .by-speaker-card:hover .by-speaker-card__photo {
    transform: scale(1.06);
  }
  .by-speaker-card__initials {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: radial-gradient(rgba(0,183,241,0.42) 1.2px, transparent 1.4px);
    background-size: 14px 14px;
  }
  .by-speaker-card__initials span {
    font-family: var(--font-display);
    font-size: clamp(46px, 4vw, 60px);
    font-weight: 700;
    letter-spacing: -0.04em;
    color: ${WHITE};
    text-shadow: 0 0 28px rgba(0,183,241,0.65);
  }
  .by-speaker-card__role {
    position: absolute;
    top: 11px;
    left: 11px;
    z-index: 3;
    display: inline-block;
    padding: 5px 10px;
    border-radius: 999px;
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.18);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    font-family: var(--font-outfit);
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${HORIZON};
    text-shadow: 0 0 12px rgba(0,183,241,0.55);
  }
  .by-speaker-card__role.is-moderator {
    color: ${WHITE};
    background: linear-gradient(135deg, ${PLUM} 0%, ${PLUM_GLOW} 100%);
    border-color: rgba(255,255,255,0.30);
    text-shadow: 0 1px 2px rgba(0,0,0,0.45);
    box-shadow: 0 5px 14px rgba(106,1,54,0.45);
  }
  .by-speaker-card__linkedin {
    position: absolute;
    top: 11px;
    right: 11px;
    z-index: 3;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.18);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: ${HORIZON};
    transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  }
  .by-speaker-card__linkedin:hover {
    transform: translateY(-2px);
    background: ${HORIZON};
    color: ${MIDNIGHT_DEEP};
    border-color: ${HORIZON};
    box-shadow: 0 7px 18px rgba(0,183,241,0.45);
  }
  .by-speaker-card__info {
    position: relative;
    padding: clamp(14px, 1.3vw, 17px) clamp(16px, 1.5vw, 19px) clamp(15px, 1.4vw, 18px);
    z-index: 2;
  }
  .by-speaker-card__name {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(16px, 1.25vw, 19px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${WHITE};
    line-height: 1.18;
  }
  .by-speaker-card__title {
    margin: 6px 0 0;
    font-family: var(--font-outfit);
    font-size: 12.5px;
    line-height: 1.42;
    color: ${MUTE};
    font-weight: 500;
  }
  .by-speaker-card__org {
    margin: 4px 0 0;
    font-family: var(--font-outfit);
    font-size: 11.5px;
    color: ${HORIZON};
    font-weight: 700;
    letter-spacing: 0.04em;
    text-shadow: 0 0 14px rgba(0,183,241,0.35);
  }

  /* ─── Agenda — compact schedule rows ────────────────────────────────── */
  /* Section backdrop is provided by the parent .by-about-section wrapper. */

  /* Rows ------------------------------------------------------------- */
  .by-agenda-rows {
    list-style: none;
    margin: clamp(12px, 1.4vw, 18px) 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .by-agenda-row {
    position: relative;
    display: grid;
    grid-template-columns: 130px 1fr auto;
    gap: clamp(18px, 2.2vw, 32px);
    align-items: center;
    padding: clamp(14px, 1.6vw, 20px) clamp(16px, 1.8vw, 22px);
    border-bottom: 1px solid rgba(0,14,78,0.09);
    transition: background 0.3s ease;
  }
  .by-agenda-row:first-of-type {
    border-top: 1px solid rgba(0,14,78,0.09);
  }
  .by-agenda-row:hover {
    background: rgba(0,183,241,0.035);
  }
  .by-agenda-row__time {
    font-family: var(--font-display);
    font-size: clamp(15px, 1.2vw, 17.5px);
    font-weight: 700;
    letter-spacing: -0.01em;
    color: ${HORIZON_DEEP};
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .by-agenda-row__body {
    min-width: 0;
  }
  .by-agenda-row__title {
    margin: 0;
    font-family: var(--font-outfit);
    font-size: clamp(15px, 1.2vw, 17px);
    font-weight: 600;
    letter-spacing: -0.005em;
    color: ${INK_DARK};
    line-height: 1.4;
    display: inline;
  }
  .by-agenda-row__star {
    display: inline-block;
    margin-left: 10px;
    padding: 2px 8px;
    border-radius: 999px;
    background: linear-gradient(135deg, ${HORIZON_DEEP} 0%, ${HORIZON} 100%);
    color: ${WHITE};
    font-family: var(--font-outfit);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    vertical-align: 2px;
    box-shadow: 0 3px 10px rgba(0,183,241,0.30);
  }
  .by-agenda-row__note {
    margin: 4px 0 0;
    font-family: var(--font-outfit);
    font-size: 13px;
    line-height: 1.45;
    color: ${INK_MUTE};
    font-style: italic;
  }
  .by-agenda-row__phase {
    font-family: var(--font-outfit);
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${INK_MUTE};
    font-weight: 600;
    white-space: nowrap;
  }
  .by-agenda-row.is-centerpiece {
    background: rgba(0,183,241,0.045);
  }
  .by-agenda-row.is-centerpiece:hover {
    background: rgba(0,183,241,0.07);
  }

  /* Closing line ---------------------------------------------------- */
  .by-agenda-outro {
    position: relative;
    margin-top: clamp(20px, 2.2vw, 28px);
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .by-agenda-outro__rule {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(0,14,78,0.18), transparent);
  }
  .by-agenda-outro__text {
    font-family: var(--font-outfit);
    font-size: 12px;
    letter-spacing: 0.02em;
    color: ${INK_MUTE};
    font-weight: 500;
  }

  /* ─── About Blue Yonder — editorial split + 4-pillar grid ──────────── */
  /* Section backdrop is provided by the parent .by-about-section wrapper. */

  .by-aboutby-grid {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: clamp(36px, 4.5vw, 72px);
    align-items: center;
  }

  /* Left — lead column */
  .by-aboutby-lead {
    position: relative;
  }
  .by-aboutby-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
    font-family: var(--font-outfit);
    font-size: 11.5px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: ${PLUM_GLOW};
    font-weight: 600;
  }
  .by-aboutby-eyebrow__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${PLUM_GLOW};
    box-shadow: 0 0 12px ${PLUM_GLOW};
  }
  .by-aboutby-title {
    margin: 0 0 clamp(18px, 2vw, 24px);
    font-family: var(--font-display);
    font-size: clamp(26px, 3vw, 40px);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
    color: ${INK_DARK};
  }
  .by-aboutby-lead__body {
    margin: 0;
    font-family: var(--font-outfit);
    font-size: clamp(15px, 1.15vw, 16.5px);
    line-height: 1.7;
    color: ${INK_BODY};
  }
  .by-aboutby-lead__body + .by-aboutby-lead__body {
    margin-top: 14px;
  }
  .by-aboutby-lead__body--mute {
    color: ${INK_MUTE};
    font-size: clamp(14px, 1.05vw, 15.5px);
  }
  .by-aboutby-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: clamp(22px, 2.4vw, 30px);
    padding: 11px 18px;
    border-radius: 10px;
    border: 1px solid ${HORIZON};
    background: rgba(0,183,241,0.06);
    color: ${HORIZON_DEEP};
    font-family: var(--font-outfit);
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.02em;
    text-decoration: none;
    transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
  }
  .by-aboutby-cta:hover {
    background: ${HORIZON};
    color: ${MIDNIGHT_DEEP};
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(0,183,241,0.30);
  }

  /* Right — pillars */
  .by-aboutby-pillars {
    position: relative;
  }
  .by-aboutby-pillars__caption {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: clamp(14px, 1.4vw, 18px);
    font-family: var(--font-outfit);
    font-size: 11px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: ${INK_MUTE};
    font-weight: 600;
  }
  .by-aboutby-pillars__caption-rule {
    display: inline-block;
    width: 26px;
    height: 1px;
    background: linear-gradient(90deg, ${HORIZON}, transparent);
  }
  .by-aboutby-pillars__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(14px, 1.6vw, 22px);
  }
  .by-aboutby-pillar {
    position: relative;
    padding: clamp(18px, 1.8vw, 24px) clamp(18px, 1.8vw, 24px) clamp(20px, 2vw, 26px);
    border-radius: 16px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcfe 60%, #f4f7fc 100%);
    border: 1px solid rgba(0,14,78,0.08);
    box-shadow:
      0 12px 32px rgba(0,14,78,0.06),
      0 1px 0 rgba(255,255,255,0.75) inset;
    overflow: hidden;
    isolation: isolate;
    transition:
      transform 0.4s cubic-bezier(0.22,1,0.36,1),
      border-color 0.35s ease,
      box-shadow 0.35s ease;
  }
  .by-aboutby-pillar:hover {
    transform: translateY(-3px);
    border-color: rgba(0,183,241,0.42);
    box-shadow:
      0 20px 44px rgba(0,14,78,0.09),
      0 1px 0 rgba(255,255,255,0.85) inset,
      0 0 32px rgba(0,183,241,0.12);
  }
  .by-aboutby-pillar__hairline {
    position: absolute;
    top: 0;
    left: 12%;
    right: 12%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${HORIZON}, transparent);
    opacity: 0.7;
    pointer-events: none;
  }
  .by-aboutby-pillar__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(180deg, rgba(0,183,241,0.10) 0%, rgba(0,183,241,0.04) 100%);
    border: 1px solid rgba(0,183,241,0.22);
    color: ${HORIZON_DEEP};
    box-shadow:
      0 4px 10px rgba(0,183,241,0.12),
      0 1px 0 rgba(255,255,255,0.6) inset;
    margin-bottom: 14px;
  }
  .by-aboutby-pillar__name {
    margin: 0 0 6px;
    font-family: var(--font-display);
    font-size: clamp(16px, 1.3vw, 19px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${INK_DARK};
    line-height: 1.2;
  }
  .by-aboutby-pillar__desc {
    margin: 0;
    font-family: var(--font-outfit);
    font-size: 13.5px;
    line-height: 1.5;
    color: ${INK_MUTE};
    font-weight: 500;
  }

  /* ─── Reserve — event details card ──────────────────────────────────── */
  .by-reserve-info {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: clamp(18px, 1.8vw, 24px) clamp(20px, 2vw, 26px) clamp(20px, 2vw, 26px);
    border-radius: 16px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcfe 60%, #f4f7fc 100%);
    border: 1px solid rgba(0,14,78,0.08);
    box-shadow:
      0 14px 36px rgba(0,14,78,0.06),
      0 1px 0 rgba(255,255,255,0.75) inset;
    overflow: hidden;
    max-width: 460px;
  }
  .by-reserve-info__hairline {
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${HORIZON}, transparent);
    opacity: 0.7;
    pointer-events: none;
  }
  .by-reserve-detail {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 12px 0;
  }
  .by-reserve-detail + .by-reserve-detail {
    border-top: 1px solid rgba(0,14,78,0.06);
  }
  .by-reserve-detail__icon {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(180deg, rgba(0,183,241,0.10) 0%, rgba(0,183,241,0.04) 100%);
    border: 1px solid rgba(0,183,241,0.22);
    color: ${HORIZON_DEEP};
    box-shadow:
      0 3px 8px rgba(0,183,241,0.10),
      0 1px 0 rgba(255,255,255,0.55) inset;
  }

  /* Phone field row inside the dark form panel */
  .by-phone-row select {
    /* Keep the country-code select narrow but readable. */
    padding-left: 12px !important;
    padding-right: 28px !important;
  }

  /* ─── Footer — dark theme ──────────────────────────────────────────── */
  .by-footer {
    position: relative;
    padding: clamp(26px, 3vw, 38px) clamp(20px, 4vw, 48px);
    background: linear-gradient(180deg, ${MIDNIGHT_DEEP} 0%, #010210 100%);
    overflow: hidden;
    isolation: isolate;
  }
  .by-footer__hairline {
    position: absolute;
    top: 0;
    left: 25%;
    right: 25%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${HORIZON}, transparent);
    opacity: 0.55;
    pointer-events: none;
  }
  .by-footer__inner {
    position: relative;
    max-width: 1180px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    flex-wrap: wrap;
  }
  .by-footer__right {
    display: inline-flex;
    align-items: center;
    gap: 14px;
  }
  .by-footer__initiative-label {
    font-family: var(--font-outfit);
    font-size: 10.5px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    font-weight: 600;
  }
  .by-footer__efg-logo {
    height: 36px;
    width: auto;
    display: block;
    opacity: 0.95;
  }

  @media (max-width: 1024px) {
    .by-hero-grid {
      grid-template-columns: 1fr !important;
      gap: 56px !important;
    }
  }
  @media (max-width: 880px) {
    .by-about-grid,
    .by-form-grid,
    .by-about-by-grid,
    .by-aboutby-grid {
      grid-template-columns: 1fr !important;
      gap: 36px !important;
    }
    .by-aboutby-pillars__grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .by-takeaway-grid,
    .by-speakers-grid {
      grid-template-columns: 1fr !important;
    }
    .by-form-row,
    .by-phone-row {
      grid-template-columns: 1fr !important;
    }
    .by-nav-links { display: none !important; }
    .by-agenda-row {
      grid-template-columns: 1fr !important;
      gap: 6px !important;
      align-items: flex-start !important;
    }
    .by-agenda-row__phase {
      order: 1;
    }
    .by-agenda-row__time {
      order: 2;
      font-size: 14px !important;
    }
    .by-agenda-row__body {
      order: 3;
    }
  }
  /* ─── Mobile: phones ≤ 640px ──────────────────────────────────────── */
  @media (max-width: 640px) {
    /* Hero — tighter overall */
    .by-hero-section {
      padding: clamp(90px, 22vw, 110px) 0 clamp(48px, 10vw, 64px) !important;
    }
    .by-hero-grid {
      gap: 40px !important;
    }
    .by-hero-eyebrow {
      padding: 7px 14px !important;
      gap: 10px !important;
      margin-bottom: 24px !important;
    }
    .by-hero-eyebrow-text {
      font-size: 10px !important;
      letter-spacing: 0.22em !important;
    }
    .by-hero-headline {
      font-size: 34px !important;
      line-height: 1.06 !important;
    }
    .by-hero-cta {
      padding: 14px 24px !important;
      font-size: 14px !important;
    }

    /* StatsStrip — tighter padding so it eats less vertical space */
    .by-stats-strip {
      padding: 16px 18px !important;
    }

    /* Speakers — keep cards from going full-width on phones */
    .by-speakers-grid {
      max-width: 340px !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    /* Agenda rows — tighter padding */
    .by-agenda-row {
      padding: 14px 10px !important;
    }

    /* About BY pillars — single column on phones */
    .by-aboutby-pillars__grid {
      grid-template-columns: 1fr !important;
    }

    /* Reserve info card — full width on phones */
    .by-reserve-info {
      max-width: none !important;
    }

    /* iOS Safari: inputs ≥ 16px to prevent zoom-on-focus */
    input,
    select,
    textarea {
      font-size: 16px !important;
    }
  }
  @media (max-width: 540px) {
    .by-nav-cta { display: none !important; }
  }
  /* Form focus state */
  input:focus, select:focus, textarea:focus {
    border-color: ${HORIZON}88 !important;
    background: rgba(0,183,241,0.06) !important;
  }
  /* Native select arrow colour */
  select {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2300B7F1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 34px !important;
  }
`;

// ─── Bottom Block ──────────────────────────────────────────────────────────
// Wraps Run of show, About Blue Yonder, and Reserve in a single section with
// the shared light backdrop (same as the WhyAttend section above) — dot
// constellation + Horizon blooms + soft vertical gradient. Internal blocks
// are spaced with marginTop, matching the WhyAttend internal rhythm.
function BottomBlock() {
  return (
    <section className="by-about-section" id="bottom-block">
      {/* Top Horizon hairline — bridges from the dark Speakers section above */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${HORIZON}, transparent)`,
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <span aria-hidden className="by-about-section__dots" />

      <div
        style={{
          position: "relative",
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 48px)",
          zIndex: 2,
        }}
      >
        <Agenda />
        <div style={{ marginTop: "clamp(72px, 9vw, 120px)" }}>
          <AboutBlueYonder />
        </div>
        <div style={{ marginTop: "clamp(72px, 9vw, 120px)" }}>
          <ReservationForm />
        </div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function BlueYonderPage() {
  // Landing with a URL hash (e.g. #reserve from a UTM link) — native anchor jumps
  // don't take under the global smooth-scroll, so scroll to the target manually.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const id = window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div style={{ background: PAPER, color: INK_BODY, minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />
      <TopBar />
      <main>
        <Hero />
        <WhyAttend />
        <Speakers />
        <BottomBlock />
      </main>
      <Footer />
    </div>
  );
}
