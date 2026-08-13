"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  submitForm,
  COUNTRY_CODES,
  isWorkEmail,
  validatePhone,
  type CountryCode,
} from "@/lib/form-helpers";

// ═════════════════════════════════════════════════════════════════════════════
// BLACKSTONE eIT × LIFERAY — Executive Roundtable · Saudi Arabia · 20 Oct 2026
// Two co-hosts presented as one. A bespoke dark, futuristic identity that fuses
// both brands: Blackstone eIT's indigo (#434EE5) and deep-navy tech mood, and
// Liferay's royal blue (#0B5FFF) + signature pixel-tile "diamond" motif. The
// indigo→blue gradient is the page's core "two-brands-as-one" device.
// Typeface: Source Sans (Liferay's brand family), applied page-wide.
// ═════════════════════════════════════════════════════════════════════════════

// ─── Palette ─────────────────────────────────────────────────────────────────
const NAVY = "#060E2E";        // Deepest background — Blackstone deep navy
const NAVY_2 = "#0A1436";      // Layered surface
const NAVY_3 = "#0E1A44";      // Card / panel surface
const INDIGO = "#434EE5";      // Blackstone primary
const INDIGO_LT = "#7981EC";   // Blackstone light indigo
const BLUE = "#0B5FFF";        // Liferay primary
const BLUE_LT = "#70A1FF";     // Liferay light blue
const CYAN = "#2DE2E6";        // Shared bright accent (Blackstone #0DCAF0 ~ Liferay #47FFFC)
const TINT = "#EDF3FE";        // Liferay very-light tint
const WHITE = "#FFFFFF";
const TXT = "rgba(255,255,255,0.92)";
const TXT_2 = "rgba(226,232,255,0.72)";
const TXT_3 = "rgba(200,210,245,0.52)";
const HAIR = "rgba(121,129,236,0.22)";
const HAIR_2 = "rgba(112,161,255,0.16)";

// ─── Light-theme tokens (body sections — Liferay's clean light side) ──────────
const INK = "#0B1533";          // primary dark text on light surfaces
const INK_2 = "#3C4A70";        // secondary text
const INK_3 = "#6C79A2";        // tertiary / labels
const L_HAIR = "rgba(11,95,255,0.16)";       // hairline on light
const L_HAIR_SOFT = "rgba(11,95,255,0.10)";
const L_CARD = "linear-gradient(165deg, rgba(255,255,255,0.94) 0%, rgba(232,240,255,0.78) 100%)";
const L_CARD_SHADOW = "0 1px 0 rgba(255,255,255,0.9) inset, 0 12px 34px rgba(11,40,120,0.09)";

// Continuous dual-tone (blue↔light) section washes — each flows into the next.
const WASH_OVERVIEW = "linear-gradient(180deg, #E7EEFF 0%, #F4F8FF 58%, #EAF1FF 100%)";
const WASH_TAKEAWAYS = "linear-gradient(180deg, #EAF1FF 0%, #DBE7FF 50%, #E8F0FF 100%)";
const WASH_SPEAKERS = "linear-gradient(180deg, #E8F0FF 0%, #F5F8FF 55%, #E9F0FF 100%)";
const WASH_AGENDA = "linear-gradient(180deg, #E9F0FF 0%, #F3F7FF 50%, #E4EDFF 100%)";
const WASH_PARTNERS = "linear-gradient(180deg, #E4EDFF 0%, #EEF4FF 60%, #E1EAFF 100%)";

// Speakers section — moody blue-smoke atmosphere (bright cyan top → dark smoke
// bottom). Organic smoke + grain generated as SVG data-URIs so it stays crisp
// at any width, no external image needed.
const SMOKE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='1400' height='700'><defs><filter id='s' x='-20%' y='-20%' width='140%' height='140%'><feTurbulence type='fractalNoise' baseFrequency='0.008 0.014' numOctaves='4' seed='11' stitchTiles='stitch' result='t'/><feColorMatrix in='t' type='matrix' values='0 0 0 0 0.012  0 0 0 0 0.055  0 0 0 0 0.12  0 0 0 -1.7 1.08'/></filter></defs><rect width='100%' height='100%' filter='url(#s)'/></svg>",
  );
const SMOKE_GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.6'/></svg>",
  );

const FUSION = `linear-gradient(120deg, ${INDIGO} 0%, ${BLUE} 100%)`;
const FUSION_SOFT = `linear-gradient(120deg, ${INDIGO_LT} 0%, ${BLUE_LT} 100%)`;
const EASE = [0.22, 1, 0.36, 1] as const;

const FONT = "var(--font-source), system-ui, -apple-system, sans-serif";

// Hero background — futuristic blue circuit/tile scene with Islamic geometric
// motifs; light-blue negative space on the left holds the headline block.
const HERO_IMAGE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/heros/ChatGPT+Image+Aug+13%2C+2026%2C+10_36_22+AM.png";

// ─── Logos (both white-wordmark variants — perfect on the dark surface) ──────
const LOGO_BLACKSTONE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Blackstone+eIT+Logo+Reversed+No+Slogan.png";
const LOGO_LIFERAY =
  "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Liferay_idOzLD9ii5_1.png";

// ─── Content ─────────────────────────────────────────────────────────────────
const EVENT_META = [
  { label: "Date", value: "20 October 2026" },
  { label: "Time", value: "10:00 AM – 2:00 PM" },
  { label: "Location", value: "Saudi Arabia" },
  { label: "Format", value: "Executive Roundtable" },
];

const OVERVIEW_CARDS = [
  {
    tag: "Platform",
    body: "Fosters active networking and peer knowledge exchange amongst executive peers in public agencies.",
  },
  {
    tag: "Focus",
    body: "Shifting the outlook from legacy isolated portals to high-performance composable architecture.",
  },
  {
    tag: "Trust",
    body: "Structuring robust compliance, data sovereignty, and security policies for AI in GCC governance.",
  },
  {
    tag: "Impact",
    body: "Enabling measurable citizen outcomes, reducing administrative bottlenecks and operational waste.",
  },
];

const TAKEAWAYS = [
  {
    n: "01",
    tag: "Experience",
    body: "Deliver unified digital experiences that serve citizens, employees, partners, and suppliers through a single AI-powered Digital Experience Platform.",
  },
  {
    n: "02",
    tag: "Intelligence",
    body: "Embed governed AI into every digital experience, enabling secure, context-aware automation powered by enterprise data rather than disconnected AI tools.",
  },
  {
    n: "03",
    tag: "Connection",
    body: "Build composable digital platforms using open standards, low-code capabilities, and extensible architectures that accelerate innovation while protecting long-term flexibility.",
  },
  {
    n: "04",
    tag: "Trust",
    body: "Enable trusted AI through robust governance, data sovereignty, and compliance frameworks that meet national security and regulatory requirements.",
  },
];

type AgendaItem = {
  start: string;
  end?: string;
  title: string;
  session?: string;
  owner?: string;
  kind: "logistics" | "welcome" | "keynote" | "feature" | "break" | "demo" | "panel" | "closing";
};

const AGENDA: AgendaItem[] = [
  { start: "10:00", end: "11:00", title: "Registration, Welcome Coffee & Networking", owner: "Doors open 10:30 · Guests arrive", kind: "logistics" },
  { start: "11:00", end: "11:05", title: "Welcome Remarks & Introduction", kind: "welcome" },
  { start: "11:05", end: "11:30", title: "Intelligent Government CX: Leveraging DXP & AI to Modernize Public Services", session: "Opening Keynote", owner: "Ahmed Saad · Regional Sales Manager", kind: "keynote" },
  { start: "11:30", end: "12:00", title: "From Digital First to AI Enabled: A Roadmap for Building Enterprise AI Capabilities", session: "Featured Presentation by Blackstone eIT", kind: "feature" },
  { start: "12:00", end: "12:15", title: "Networking Coffee Break & Prayer", owner: "All delegates", kind: "break" },
  { start: "12:15", end: "12:45", title: "Liferay AI Hub in Action: Building Secure AI Agents for Modern Government Services", session: "Product Demo", owner: "Mahmoud Tayem", kind: "demo" },
  { start: "12:45", end: "13:05", title: "Panel Discussion", session: "Moderator + Panelists", kind: "panel" },
  { start: "13:05", end: "13:20", title: "Q&A & Closing Remarks", kind: "closing" },
  { start: "13:20", title: "Networking Lunch", owner: "All delegates", kind: "logistics" },
];

const PARTNERS = [
  {
    name: "Blackstone eIT",
    logo: LOGO_BLACKSTONE,
    logoH: 30,
    href: "https://www.blackstoneeit.com",
    hrefLabel: "www.blackstoneeit.com",
    tint: INDIGO,
    body: [
      "Blackstone eIT is a leading System Integrator (SI) and Independent Software Vendor (ISV), globally dedicated to engineering transformative enterprise solutions and intelligent design. Our core focus is on delivering innovative, customized technology that enables clients to evolve into digital-first, data-informed, and AI-enabled organizations.",
      "Our mission is to empower customers to harness the full potential of intelligent technologies — building reliable, cost-effective, and scalable solutions that optimize business operations, enhance customer experience, and accelerate sustained growth.",
    ],
  },
  {
    name: "Liferay",
    logo: LOGO_LIFERAY,
    logoH: 34,
    href: "https://www.liferay.com/company/our-story",
    hrefLabel: "liferay.com",
    tint: BLUE,
    body: [
      "From the moment of our founding in 2004 as an open-source software company, we've taken the unique needs of customers as the driving force behind our development — building adaptable technology powerful enough to handle even the most specific requirements.",
      "Liferay started as a handful of college buddies coding together in a tiny cubicle. Today we've expanded to offices around the world, with 19 locations, 1,100+ employees, and 360+ technology partners.",
    ],
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// PIXEL-TILE DIAMOND — nod to Liferay's signature icon. A 5×5 grid where a
// diamond of filled cells sits inside; used as a small brand mark + motif.
// ═════════════════════════════════════════════════════════════════════════════
function PixelMark({ size = 26, gap = 1.5, radius = 2, from = INDIGO_LT, to = BLUE_LT }: {
  size?: number; gap?: number; radius?: number; from?: string; to?: string;
}) {
  const cells = 5;
  const cs = (size - gap * (cells - 1)) / cells;
  // diamond pattern (1 = filled)
  const grid = [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ];
  const id = `px-${from}-${to}`.replace(/[^a-z0-9]/gi, "");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      {grid.flatMap((row, r) =>
        row.map((v, c) =>
          v ? (
            <rect
              key={`${r}-${c}`}
              x={c * (cs + gap)}
              y={r * (cs + gap)}
              width={cs}
              height={cs}
              rx={radius}
              fill={`url(#${id})`}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

// Faint pixel-grid texture for section backgrounds
function pixelGridBg(color = "rgba(121,129,236,0.05)", cell = 46) {
  return {
    backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
    backgroundSize: `${cell}px ${cell}px`,
  } as React.CSSProperties;
}

// ─── Minimal line icons for the event-detail rows ────────────────────────────
function MetaIcon({ label }: { label: string }) {
  const p = { fill: "none", stroke: "#fff", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const wrap = (children: React.ReactNode) => (
    <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden style={{ display: "block" }}>{children}</svg>
  );
  if (label === "Date") return wrap(<g {...p}><rect x="3" y="4.5" width="18" height="16" rx="3" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></g>);
  if (label === "Time") return wrap(<g {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></g>);
  if (label === "Location") return wrap(<g {...p}><path d="M12 21c4-4.2 7-7.6 7-11a7 7 0 1 0-14 0c0 3.4 3 6.8 7 11Z" /><circle cx="12" cy="10" r="2.5" /></g>);
  // Format — roundtable
  return wrap(<g {...p}><ellipse cx="12" cy="13" rx="8.5" ry="5" /><circle cx="12" cy="5.5" r="1.6" /><circle cx="4.4" cy="13" r="1.4" /><circle cx="19.6" cy="13" r="1.4" /></g>);
}

// ═════════════════════════════════════════════════════════════════════════════
// DUAL LOGO LOCKUP — Blackstone × Liferay, joined by a gradient hairline
// ═════════════════════════════════════════════════════════════════════════════
function LogoLockup({ bsH = 26, lrH = 22, gap = 16 }: { bsH?: number; lrH?: number; gap?: number }) {
  return (
    <span className="bl-lockup" style={{ display: "inline-flex", alignItems: "center", gap, lineHeight: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_BLACKSTONE} alt="Blackstone eIT" className="bl-lockup-bs" style={{ height: bsH, width: "auto", display: "block" }} />
      <span aria-hidden className="bl-lockup-div" style={{ width: 1, height: Math.max(bsH, lrH) * 0.9, background: `linear-gradient(180deg, transparent, ${INDIGO_LT}66 30%, ${BLUE_LT}66 70%, transparent)` }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_LIFERAY} alt="Liferay" className="bl-lockup-lr" style={{ height: lrH, width: "auto", display: "block" }} />
    </span>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// NAV
// ═════════════════════════════════════════════════════════════════════════════
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(6,14,46,0.82)" : "transparent",
      backdropFilter: scrolled ? "blur(16px) saturate(150%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(16px) saturate(150%)" : "none",
      borderBottom: scrolled ? `1px solid ${HAIR}` : "1px solid transparent",
      transition: "background .4s ease, border-color .4s ease, backdrop-filter .4s ease",
    }}>
      <div style={{
        maxWidth: 1300, margin: "0 auto",
        padding: "14px clamp(18px,4vw,48px)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, minHeight: 70,
      }}>
        <a href="#top" aria-label="Blackstone eIT × Liferay" style={{ textDecoration: "none" }}>
          <LogoLockup bsH={26} lrH={30} />
        </a>

        <div className="bl-nav-links" style={{ display: "flex", alignItems: "center", gap: "clamp(18px,2vw,30px)" }}>
          {["Overview", "Takeaways", "Speakers", "Agenda", "Partners"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="bl-nav-link" style={{
              fontFamily: FONT, fontSize: 13.5, fontWeight: 600, color: TXT_2,
              textDecoration: "none", letterSpacing: "0.01em", transition: "color .25s",
            }}>{l}</a>
          ))}
        </div>

        <a href="#register" className="bl-nav-cta" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderRadius: 999, background: FUSION, color: WHITE,
          fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: "0.01em",
          textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
          boxShadow: `0 4px 16px ${BLUE}44, 0 1px 0 rgba(255,255,255,0.18) inset`,
          transition: "transform .2s, box-shadow .2s",
        }}>
          <span className="bl-nav-cta-full">Request Invitation</span>
          <span className="bl-nav-cta-short" style={{ display: "none" }}>Register</span>
          <span aria-hidden>→</span>
        </a>
      </div>

      <style jsx global>{`
        .bl-nav-link:hover { color: ${WHITE} !important; }
        .bl-nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 22px ${BLUE}66, 0 1px 0 rgba(255,255,255,0.22) inset; }
        @media (max-width: 820px) { .bl-nav-links { display: none !important; } }
        @media (max-width: 480px) {
          .bl-lockup-bs { height: 22px !important; }
          .bl-lockup-lr { height: 18px !important; }
          .bl-nav-cta { padding: 8px 14px !important; font-size: 12px !important; }
          .bl-nav-cta-full { display: none !important; }
          .bl-nav-cta-short { display: inline !important; }
        }
      `}</style>
    </nav>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HERO — full-bleed brand image (blue circuit/tile scene, right-weighted) with
// the headline block set into the light-blue negative space on the left. A
// left-to-right navy scrim keeps the text legible while the tech scene stays
// bright on the right. Only content-grounded elements: kicker, title, standfirst,
// the event meta (date/time/location/format), CTA and the co-host lockup.
// ═════════════════════════════════════════════════════════════════════════════
function Hero() {
  return (
    <section id="top" className="bl-hero" style={{ position: "relative", overflow: "hidden", background: NAVY, color: WHITE, minHeight: "100svh", display: "flex" }}>
      {/* Background image */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `url("${HERO_IMAGE}")`,
        backgroundSize: "cover",
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
      }} />
      {/* Left→right navy scrim for text legibility */}
      <div aria-hidden className="bl-hero-scrim" style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `linear-gradient(90deg, ${NAVY} 0%, rgba(6,14,46,0.92) 26%, rgba(6,14,46,0.55) 46%, rgba(6,14,46,0.12) 64%, transparent 80%)`,
      }} />
      {/* Bottom fade into the next section */}
      <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "34%", zIndex: 1, pointerEvents: "none", background: `linear-gradient(180deg, transparent 0%, ${NAVY} 96%)` }} />
      {/* Top fade for nav legibility */}
      <div aria-hidden style={{ position: "absolute", left: 0, right: 0, top: 0, height: 130, zIndex: 1, pointerEvents: "none", background: `linear-gradient(180deg, rgba(6,14,46,0.7) 0%, transparent 100%)` }} />

      <div className="bl-hero-inner" style={{
        position: "relative", zIndex: 2, width: "100%", maxWidth: 1280, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1.08fr 0.92fr", gap: "clamp(28px,4.5vw,64px)", alignItems: "center",
        paddingTop: "clamp(90px,11vh,124px)", paddingBottom: "clamp(32px,5vh,60px)",
        paddingLeft: "clamp(20px,5vw,64px)", paddingRight: "clamp(20px,5vw,64px)",
      }}>
        {/* LEFT — headline block */}
        <div className="bl-hero-stack" style={{ display: "flex", flexDirection: "column", gap: "clamp(15px,1.9vw,23px)", maxWidth: 620 }}>
          {/* Kicker */}
          <motion.span
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
            style={{
              alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 10,
              padding: "7px 15px 7px 11px", borderRadius: 999,
              background: "rgba(11,95,255,0.14)", border: `1px solid ${HAIR}`, backdropFilter: "blur(4px)",
              fontFamily: FONT, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: BLUE_LT, whiteSpace: "nowrap",
            }}
          >
            <PixelMark size={14} gap={1} radius={1} />
            Invitation-only · Executive Roundtable
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            style={{ fontFamily: FONT, fontSize: "clamp(30px,3.7vw,54px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.02, margin: 0, textWrap: "balance" as "balance", textShadow: "0 2px 30px rgba(4,8,26,0.5)" }}
          >
            <span style={{ background: FUSION_SOFT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>AI-Powered Government</span>
            <br />
            Enabling Citizen-Centered Experiences
          </motion.h1>

          {/* Standfirst */}
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.24, ease: EASE }}
            style={{ margin: 0, fontFamily: FONT, fontSize: "clamp(13.5px,1.02vw,16px)", fontWeight: 400, lineHeight: 1.55, color: "rgba(226,232,255,0.86)", maxWidth: 510 }}
          >
            Integrating Digital Experience Platforms with scalable, governed Agentic AI — empowering Saudi Vision 2030 through highly customized, trusted digital experiences. Co-hosted by Blackstone eIT and Liferay.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.36, ease: EASE }}
            style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginTop: 2 }}
          >
            <a href="#register" className="bl-hero-cta" style={{
              display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 30px", borderRadius: 999,
              background: FUSION, color: WHITE, fontFamily: FONT, fontSize: 15, fontWeight: 700,
              textDecoration: "none", boxShadow: `0 6px 22px ${BLUE}66, 0 1px 0 rgba(255,255,255,0.2) inset`, transition: "transform .2s, box-shadow .2s",
            }}>
              Request invitation <span aria-hidden>→</span>
            </a>
            <a href="#agenda" className="bl-hero-link" style={{
              display: "inline-flex", alignItems: "center", gap: 7, fontFamily: FONT, fontSize: 14, fontWeight: 700,
              color: WHITE, textDecoration: "none", transition: "gap .2s, color .2s",
            }}>
              View agenda <span aria-hidden>→</span>
            </a>
          </motion.div>

          {/* Co-host lockup */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.46, ease: EASE }}
            style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2vw,22px)", flexWrap: "wrap", marginTop: 6, paddingTop: "clamp(18px,2.2vw,26px)", borderTop: `1px solid ${HAIR}` }}
          >
            <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: TXT_3, flexShrink: 0 }}>Co-hosted by</span>
            <LogoLockup bsH={28} lrH={32} gap={18} />
          </motion.div>
        </div>

        {/* RIGHT — liquid-glass event stats, floating over the tech scene */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="bl-hero-glass"
          style={{
            position: "relative", justifySelf: "end", width: "100%", maxWidth: 350, overflow: "hidden",
            padding: "24px 22px 10px", borderRadius: 28,
            background: "linear-gradient(158deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 46%, rgba(11,95,255,0.10) 100%)",
            backdropFilter: "blur(32px) saturate(135%)", WebkitBackdropFilter: "blur(32px) saturate(135%)",
            border: "1px solid rgba(255,255,255,0.32)",
            boxShadow: "0 30px 80px rgba(4,8,26,0.5), 0 12px 40px rgba(11,95,255,0.22), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -40px 50px rgba(8,16,44,0.30)",
          }}
        >
          {/* animated light sweep */}
          <span aria-hidden className="bl-glass-sheen" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "55%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)", pointerEvents: "none", zIndex: 3 }} />
          {/* fusion top-edge accent + glow */}
          <span aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2.5, background: FUSION, opacity: 0.9, pointerEvents: "none", zIndex: 2 }} />
          <span aria-hidden style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: 1.5, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)", pointerEvents: "none", zIndex: 2 }} />
          <span aria-hidden style={{ position: "absolute", top: -90, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${BLUE_LT}2e 0%, transparent 68%)`, pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FONT, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: WHITE }}>
              <PixelMark size={15} gap={1} radius={1.5} from="#FFFFFF" to="#BFD3FF" /> Event Details
            </span>
            <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: WHITE, padding: "4px 10px", borderRadius: 999, background: "linear-gradient(150deg, rgba(255,255,255,0.24), rgba(255,255,255,0.10))", border: "1px solid rgba(255,255,255,0.30)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)" }}>KSA</span>
          </div>

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
            {EVENT_META.map((m, i) => (
              <div key={m.label} className="bl-meta-row" style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderTop: i === 0 ? "none" : "1px solid transparent", borderImage: i === 0 ? undefined : "linear-gradient(90deg, transparent, rgba(255,255,255,0.22) 20%, rgba(255,255,255,0.22) 80%, transparent) 1" }}>
                <span className="bl-meta-chip" style={{
                  flexShrink: 0, width: 42, height: 42, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center",
                  background: `linear-gradient(155deg, rgba(255,255,255,0.30), ${BLUE}22 60%, rgba(255,255,255,0.06))`,
                  border: "1px solid rgba(255,255,255,0.34)",
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.6), 0 6px 16px rgba(11,95,255,0.28)`,
                  transition: "transform .3s ease, box-shadow .3s ease",
                }}>
                  <MetaIcon label={m.label} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 9.5, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: BLUE_LT, marginBottom: 3 }}>{m.label}</div>
                  <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: WHITE, lineHeight: 1.2, textShadow: "0 1px 12px rgba(4,8,26,0.4)" }}>{m.value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .bl-hero-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 30px ${BLUE}88, 0 1px 0 rgba(255,255,255,0.24) inset; }
        .bl-hero-link:hover { gap: 12px; color: ${BLUE_LT}; }
        .bl-hero-glass { transition: transform .4s cubic-bezier(0.22,1,0.36,1), box-shadow .4s ease; }
        .bl-hero-glass:hover { transform: translateY(-6px); box-shadow: 0 40px 90px rgba(4,8,26,0.55), 0 18px 50px rgba(11,95,255,0.30), inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -40px 50px rgba(8,16,44,0.30); }
        .bl-hero-glass:hover .bl-meta-chip { transform: scale(1.06); box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 22px rgba(11,95,255,0.42); }
        @keyframes bl-sheen {
          0% { transform: translateX(-120%) skewX(-16deg); }
          55%, 100% { transform: translateX(320%) skewX(-16deg); }
        }
        .bl-glass-sheen { animation: bl-sheen 7.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .bl-glass-sheen { animation: none; opacity: 0; } }
        @media (max-width: 900px) {
          .bl-hero-inner { grid-template-columns: 1fr !important; }
          .bl-hero-glass { justify-self: stretch !important; max-width: 460px !important; }
        }
        @media (max-width: 820px) {
          .bl-hero-scrim { background: linear-gradient(180deg, rgba(6,14,46,0.55) 0%, rgba(6,14,46,0.8) 62%, ${NAVY} 100%) !important; }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION HEADING
// ═════════════════════════════════════════════════════════════════════════════
function SectionHeading({ eyebrow, title, sub, align = "left", light = false }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; align?: "left" | "center"; light?: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }}
      style={{ textAlign: align, maxWidth: align === "center" ? 720 : 760, marginLeft: align === "center" ? "auto" : 0, marginRight: align === "center" ? "auto" : 0 }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: light ? BLUE : BLUE_LT, marginBottom: 16, justifyContent: align === "center" ? "center" : "flex-start" }}>
        <PixelMark size={15} gap={1} radius={1.5} /> {eyebrow}
      </span>
      <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px,3.6vw,46px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.08, margin: 0, color: light ? INK : WHITE }}>{title}</h2>
      {sub && <p style={{ margin: "18px 0 0", fontFamily: FONT, fontSize: "clamp(15px,1.15vw,17.5px)", lineHeight: 1.65, color: light ? INK_2 : TXT_2, maxWidth: 640, marginLeft: align === "center" ? "auto" : 0, marginRight: align === "center" ? "auto" : 0 }}>{sub}</p>}
    </motion.div>
  );
}

// Standardized section rhythm — one value everywhere so vertical gaps are even.
const SECTION_PAD: React.CSSProperties = {
  paddingTop: "clamp(48px,5.5vw,76px)", paddingBottom: "clamp(48px,5.5vw,76px)",
  paddingLeft: "clamp(20px,5vw,64px)", paddingRight: "clamp(20px,5vw,64px)",
};

// ═════════════════════════════════════════════════════════════════════════════
// OVERVIEW
// ═════════════════════════════════════════════════════════════════════════════
function OverviewSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const headIn = useInView(headRef, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const numY = useTransform(scrollYProgress, [0, 1], [46, -46]);

  const headLines = ["Where public-sector leaders", "shape the next era of", "digital government"];

  return (
    <section id="overview" ref={sectionRef} style={{ position: "relative", overflow: "hidden", background: WASH_OVERVIEW, color: INK, paddingTop: "clamp(56px,6.5vw,92px)", paddingBottom: "clamp(56px,6.5vw,92px)", paddingLeft: "clamp(20px,5vw,64px)", paddingRight: "clamp(20px,5vw,64px)" }}>
      {/* ease-in from the dark hero */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg, rgba(6,14,46,0.16) 0%, transparent 100%)", pointerEvents: "none" }} />
      {/* cinematic spotlight + vignette */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 42% at 50% 22%, rgba(255,255,255,0.7) 0%, transparent 60%), radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, rgba(11,32,96,0.10) 100%)" }} />
      {/* letterbox hairlines */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${L_HAIR} 20%, ${L_HAIR} 80%, transparent)` }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        {/* ── Cinematic title block ── */}
        <div ref={headRef} style={{ textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={headIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }}
            style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: BLUE, marginBottom: 22 }}
          >
            <PixelMark size={15} gap={1} radius={1.5} /> The Event
          </motion.span>

          <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px,4.6vw,62px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.04, margin: 0, color: INK }}>
            {headLines.map((line, li) => (
              <span key={li} style={{ display: "block", overflow: "hidden" }}>
                <motion.span
                  initial={{ y: "110%" }} animate={headIn ? { y: "0%" } : {}} transition={{ duration: 0.85, delay: 0.12 + li * 0.12, ease: EASE }}
                  style={{ display: "inline-block" }}
                >
                  {li === 1 ? (
                    <>shape the <span className="bl-cine-shimmer">next era</span> of</>
                  ) : line}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={headIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            style={{ margin: "24px auto 0", maxWidth: 660, fontFamily: FONT, fontSize: "clamp(15px,1.15vw,17.5px)", lineHeight: 1.65, color: INK_2 }}
          >
            This exclusive roundtable convenes Saudi Arabia&apos;s leading government authorities and technology architects for a practical deep-dive into integrating Digital Experience Platforms (DXP) with scalable Agentic AI.
          </motion.p>
        </div>

        {/* ── Cinematic pillar frames ── */}
        <div ref={ref} className="bl-cine-grid" style={{ marginTop: "clamp(44px,5vw,72px)", display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "clamp(16px,1.8vw,22px)" }}>
          {OVERVIEW_CARDS.map((c, i) => (
            <motion.div
              key={c.tag}
              initial={{ opacity: 0, y: 30, scale: 0.985 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="bl-cine-frame"
              style={{
                position: "relative", overflow: "hidden", borderRadius: 16, minHeight: "clamp(120px,9.5vw,140px)",
                border: `1px solid ${L_HAIR}`, boxShadow: L_CARD_SHADOW,
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                padding: "clamp(16px,1.8vw,22px)", isolation: "isolate",
              }}
            >
              {/* moving inner wash (ken-burns) */}
              <span aria-hidden className="bl-cine-bg" style={{ position: "absolute", inset: 0, zIndex: -2, background: `linear-gradient(150deg, #FFFFFF 0%, #EAF1FF 52%, #DCE7FF 100%)` }} />
              {/* corner brand glow */}
              <span aria-hidden style={{ position: "absolute", top: -60, right: -50, width: 200, height: 200, borderRadius: "50%", zIndex: -1, background: `radial-gradient(circle, ${(i % 2 === 0 ? INDIGO : BLUE)}22 0%, transparent 68%)`, pointerEvents: "none" }} />
              {/* bottom caption gradient */}
              <span aria-hidden style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(180deg, transparent 40%, rgba(255,255,255,0.55) 100%)", pointerEvents: "none" }} />
              {/* light sweep */}
              <span aria-hidden className="bl-glass-sheen" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "45%", zIndex: 0, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", pointerEvents: "none" }} />

              {/* ghost index — parallax */}
              <motion.span aria-hidden style={{ y: numY, position: "absolute", bottom: "clamp(-18px,-1.1vw,-8px)", right: 16, zIndex: -1, fontFamily: FONT, fontSize: "clamp(64px,7vw,104px)", fontWeight: 800, lineHeight: 0.8, letterSpacing: "-0.05em", background: FUSION, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", opacity: 0.12 }}>
                {`0${i + 1}`}
              </motion.span>

              {/* content — film title-card placement */}
              <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ flexShrink: 0, display: "inline-flex", width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", background: "linear-gradient(155deg, rgba(11,95,255,0.16), rgba(67,78,229,0.08))", border: `1px solid ${L_HAIR}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }}>
                  <PixelMark size={16} gap={1.1} radius={1.6} />
                </span>
                <h3 style={{ fontFamily: FONT, fontSize: "clamp(18px,1.7vw,23px)", fontWeight: 700, letterSpacing: "-0.015em", margin: 0, color: INK }}>{c.tag}</h3>
              </div>
              <p style={{ position: "relative", zIndex: 1, margin: "9px 0 0", fontFamily: FONT, fontSize: "clamp(13px,0.98vw,14.5px)", lineHeight: 1.5, color: INK_2, maxWidth: 440 }}>{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .bl-lcard { transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
        .bl-lcard:hover { transform: translateY(-4px); border-color: ${BLUE}55; box-shadow: 0 22px 46px rgba(11,40,120,0.16), 0 1px 0 rgba(255,255,255,0.9) inset; }
        .bl-cine-shimmer { background: linear-gradient(100deg, ${INDIGO} 0%, ${BLUE} 40%, ${CYAN} 55%, ${BLUE} 70%, ${INDIGO} 100%); background-size: 220% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: bl-cine-shine 5s linear infinite; }
        @keyframes bl-cine-shine { to { background-position: 220% center; } }
        .bl-cine-frame { transition: transform .5s cubic-bezier(0.22,1,0.36,1), box-shadow .5s ease, border-color .5s ease; }
        .bl-cine-frame:hover { transform: translateY(-6px); border-color: ${BLUE}66; box-shadow: 0 30px 60px rgba(11,40,120,0.2), 0 1px 0 rgba(255,255,255,0.9) inset; }
        .bl-cine-bg { transition: transform 1.1s cubic-bezier(0.22,1,0.36,1); }
        .bl-cine-frame:hover .bl-cine-bg { transform: scale(1.08); }
        @media (prefers-reduced-motion: reduce) { .bl-cine-shimmer { animation: none; } }
        @media (max-width: 720px) { .bl-cine-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// TAKEAWAYS
// ═════════════════════════════════════════════════════════════════════════════
function TakeawaysSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const DWELL = 3600; // ms each station holds before auto-advancing

  // Auto-advance through the stations in a loop; pause on hover/focus.
  useEffect(() => {
    if (paused || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % TAKEAWAYS.length), DWELL);
    return () => clearInterval(id);
  }, [paused, inView]);

  return (
    <section id="takeaways" style={{ position: "relative", background: WASH_TAKEAWAYS, color: INK, ...SECTION_PAD }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.5, ...pixelGridBg("rgba(11,95,255,0.05)", 54) }} />
      <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto" }}>
        <SectionHeading light eyebrow="Key Takeaways" title="What you'll walk away with" align="center" />

        {/* ── Horizontal journey rail — auto-advances; hover / tap to steer ── */}
        <div ref={ref} style={{ marginTop: "clamp(40px,5vw,64px)" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="bl-rail" style={{ position: "relative" }}>
            {/* base track */}
            <span aria-hidden className="bl-rail-line" style={{ position: "absolute", left: "12.5%", width: "75%", top: 27, height: 2, background: L_HAIR, borderRadius: 2 }} />
            {/* completed fill up to the active node */}
            <span aria-hidden className="bl-rail-fill" style={{ position: "absolute", left: "12.5%", width: `${25 * active}%`, top: 27, height: 2, background: FUSION, borderRadius: 2, transition: "width .35s cubic-bezier(0.22,1,0.36,1)", boxShadow: `0 0 10px ${BLUE}66` }} />
            {/* crawling segment growing toward the next number */}
            <motion.span
              aria-hidden key={active}
              className="bl-rail-crawl"
              style={{ position: "absolute", left: `calc(12.5% + ${25 * active}%)`, top: 27, height: 2, background: FUSION, borderRadius: 2, boxShadow: `0 0 10px ${BLUE}66` }}
              initial={{ width: "0%" }}
              animate={{ width: paused || active === TAKEAWAYS.length - 1 ? "0%" : "25%" }}
              transition={{ duration: paused ? 0.3 : DWELL / 1000, ease: "linear" }}
            />

            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              {TAKEAWAYS.map((t, i) => {
                const on = active === i;
                return (
                  <motion.button
                    key={t.n}
                    type="button"
                    initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="bl-rail-station"
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <span className="bl-rail-node" aria-hidden style={{
                      width: 54, height: 54, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: FONT, fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em",
                      color: on ? WHITE : BLUE,
                      background: on ? FUSION : "rgba(255,255,255,0.82)",
                      border: on ? "1px solid transparent" : `1.5px solid ${L_HAIR}`,
                      boxShadow: on ? `0 8px 22px ${BLUE}55, inset 0 1px 0 rgba(255,255,255,0.4)` : "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 12px rgba(11,40,120,0.08)",
                      transform: on ? "scale(1.08)" : "scale(1)", transition: "all .35s ease",
                    }}>{t.n}</span>
                    <span className="bl-rail-label" style={{ fontFamily: FONT, fontSize: "clamp(12px,1.05vw,14.5px)", fontWeight: on ? 700 : 600, letterSpacing: "0.01em", color: on ? INK : INK_3, transition: "color .35s ease, font-weight .2s", textAlign: "center", lineHeight: 1.2 }}>{t.tag}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ── Active detail ── */}
          <div style={{ position: "relative", marginTop: "clamp(28px,3.4vw,46px)", minHeight: "clamp(150px,15vw,180px)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: EASE }}
                className="bl-rail-detail"
                style={{ display: "flex", gap: "clamp(18px,2.6vw,38px)", alignItems: "flex-start", maxWidth: 860, margin: "0 auto" }}
              >
                <span aria-hidden style={{ flexShrink: 0, fontFamily: FONT, fontSize: "clamp(56px,7vw,104px)", fontWeight: 800, lineHeight: 0.82, letterSpacing: "-0.04em", background: FUSION, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                  {TAKEAWAYS[active].n}
                </span>
                <div style={{ paddingTop: "clamp(2px,0.6vw,8px)" }}>
                  <h3 style={{ fontFamily: FONT, fontSize: "clamp(22px,2.6vw,36px)", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 10px", color: INK, lineHeight: 1.1 }}>{TAKEAWAYS[active].tag}</h3>
                  <p style={{ margin: 0, fontFamily: FONT, fontSize: "clamp(15px,1.2vw,18px)", lineHeight: 1.62, color: INK_2, maxWidth: 620 }}>{TAKEAWAYS[active].body}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Why attend — statement panel */}
        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay: 0.3, ease: EASE }}
          style={{
            marginTop: "clamp(30px,3.2vw,44px)", padding: "clamp(22px,2.6vw,34px) clamp(26px,4vw,56px)", borderRadius: 24, textAlign: "center", position: "relative", overflow: "hidden",
            background: `radial-gradient(ellipse 60% 90% at 12% 0%, rgba(255,255,255,0.20) 0%, transparent 58%), radial-gradient(ellipse 70% 100% at 92% 108%, ${CYAN}2e 0%, transparent 60%), linear-gradient(120deg, ${INDIGO} 0%, ${BLUE} 100%)`,
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: `0 28px 70px ${BLUE}4d, 0 1px 0 rgba(255,255,255,0.4) inset, 0 -40px 70px rgba(4,8,26,0.22) inset`,
          }}
        >
          {/* pixel-tile texture */}
          <span aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none", maskImage: "radial-gradient(ellipse 80% 90% at 50% 50%, #000 20%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse 80% 90% at 50% 50%, #000 20%, transparent 80%)", ...pixelGridBg("rgba(255,255,255,0.06)", 34) }} />
          {/* big pixel-diamond watermark */}
          <span aria-hidden style={{ position: "absolute", bottom: -34, right: -20, opacity: 0.1, transform: "rotate(-8deg)", pointerEvents: "none" }}>
            <PixelMark size={184} gap={7} radius={7} from="#FFFFFF" to="#FFFFFF" />
          </span>
          <span aria-hidden style={{ position: "absolute", top: -30, left: -14, opacity: 0.08, transform: "rotate(10deg)", pointerEvents: "none" }}>
            <PixelMark size={116} gap={5} radius={5} from="#FFFFFF" to="#FFFFFF" />
          </span>
          {/* moving sheen */}
          <span aria-hidden className="bl-glass-sheen" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "42%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)", pointerEvents: "none" }} />

          {/* eyebrow */}
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FONT, fontSize: 11, fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", padding: "6px 15px", borderRadius: 999, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)", marginBottom: 14 }}>
            <PixelMark size={13} gap={0.9} radius={1} from="#FFFFFF" to="#D9E6FF" /> Why attend
          </div>

          {/* statement */}
          <p style={{ position: "relative", margin: "0 auto", maxWidth: 760, fontFamily: FONT, fontSize: "clamp(19px,2.15vw,29px)", fontWeight: 600, lineHeight: 1.32, color: WHITE, letterSpacing: "-0.015em", textShadow: "0 2px 20px rgba(4,8,26,0.25)" }}>
            Empowering{" "}
            <span style={{ position: "relative", fontWeight: 800, whiteSpace: "nowrap" }}>
              Saudi Vision 2030
              <span aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: "-0.14em", height: 3, borderRadius: 3, background: "linear-gradient(90deg, rgba(255,255,255,0.4), #FFFFFF 50%, rgba(255,255,255,0.4))", boxShadow: `0 0 12px ${CYAN}` }} />
            </span>{" "}
            through highly customized, trusted digital experiences.
          </p>

          {/* CTA */}
          <a href="#register" className="bl-why-cta" style={{
            position: "relative", marginTop: "clamp(16px,1.8vw,22px)", display: "inline-flex", alignItems: "center", gap: 9,
            padding: "11px 24px", borderRadius: 999, fontFamily: FONT, fontSize: 14, fontWeight: 700, textDecoration: "none",
            color: BLUE, background: "linear-gradient(180deg, #FFFFFF, #EAF1FF)", border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 10px 26px rgba(4,8,26,0.28), inset 0 1px 0 rgba(255,255,255,0.9)", transition: "transform .2s ease, box-shadow .2s ease",
          }}>
            Request your invitation <span aria-hidden>→</span>
          </a>
        </motion.div>
      </div>
      <style jsx global>{`
        .bl-rail-station:hover .bl-rail-node { border-color: ${BLUE}66; }
        .bl-why-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(4,8,26,0.36), inset 0 1px 0 rgba(255,255,255,0.95); }
        @media (max-width: 560px) {
          .bl-rail-node { width: 44px !important; height: 44px !important; font-size: 15px !important; }
          .bl-rail-line, .bl-rail-fill { top: 22px !important; }
          .bl-rail-label { font-size: 10.5px !important; }
          .bl-rail-detail { flex-direction: column !important; gap: 8px !important; }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SMOKE BACKGROUND — moody blue-smoke atmosphere shared by Speakers + Reserve
// ═════════════════════════════════════════════════════════════════════════════
const SMOKE_MOTES = [
  { x: "12%", y: "40%", s: 4, o: 0.6, d: 0, dur: 9 },
  { x: "27%", y: "64%", s: 3, o: 0.5, d: 2, dur: 11 },
  { x: "45%", y: "32%", s: 5, o: 0.5, d: 1, dur: 10 },
  { x: "62%", y: "58%", s: 3, o: 0.6, d: 3, dur: 12 },
  { x: "78%", y: "42%", s: 4, o: 0.5, d: 1.5, dur: 9.5 },
  { x: "88%", y: "66%", s: 3, o: 0.5, d: 2.5, dur: 11 },
];

function SmokeBg() {
  return (
    <>
      {/* base smoky gradient — bright cyan glow up top, deep smoke below */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: `
        radial-gradient(ellipse 70% 42% at 50% -8%, rgba(120,214,255,0.6) 0%, rgba(64,166,232,0.28) 26%, transparent 58%),
        linear-gradient(180deg, #1E93CF 0%, #1573B4 13%, #0F5591 26%, #0A3D71 40%, #072B52 54%, #051C39 70%, #030F22 85%, #020A17 100%)
      ` }} />
      {/* darker cloud silhouettes rising from the bottom */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, filter: "blur(8px)", background: `
        radial-gradient(ellipse 34% 30% at 18% 104%, rgba(2,8,18,0.9) 0%, transparent 66%),
        radial-gradient(ellipse 40% 36% at 52% 112%, rgba(2,8,18,0.95) 0%, transparent 68%),
        radial-gradient(ellipse 32% 28% at 84% 102%, rgba(2,8,18,0.85) 0%, transparent 66%)
      ` }} />
      {/* organic turbulence smoke, strongest toward the bottom */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `url("${SMOKE_SVG}")`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.75, maskImage: "linear-gradient(180deg, transparent 6%, #000 52%)", WebkitMaskImage: "linear-gradient(180deg, transparent 6%, #000 52%)", pointerEvents: "none" }} />
      {/* film grain */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `url("${SMOKE_GRAIN}")`, opacity: 0.09, mixBlendMode: "overlay", pointerEvents: "none" }} />
      {/* drifting light motes */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}>
        {SMOKE_MOTES.map((m, idx) => (
          <span key={idx} className="bl-mote" style={{ position: "absolute", left: m.x, top: m.y, width: m.s, height: m.s, borderRadius: "50%", background: "radial-gradient(circle, rgba(190,228,255,0.95) 0%, rgba(120,190,255,0) 70%)", opacity: m.o, animationDelay: `${m.d}s`, animationDuration: `${m.dur}s` }} />
        ))}
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SPEAKERS — to be announced (placeholder cards until the line-up is confirmed)
// ═════════════════════════════════════════════════════════════════════════════
function SpeakersSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const slots = [0, 1, 2, 3];
  return (
    <section id="speakers" style={{ position: "relative", overflow: "hidden", background: "#020A17", color: WHITE, ...SECTION_PAD }}>
      <SmokeBg />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1160, margin: "0 auto" }}>
        <SectionHeading eyebrow="Speakers & Panelists" title="The line-up" align="center" sub="Our speakers and panelists are being confirmed. The full roster of public-sector leaders and platform experts will be announced soon." />

        <div ref={ref} className="bl-speakers-grid" style={{ marginTop: "clamp(40px,5vw,64px)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(16px,1.8vw,22px)" }}>
          {slots.map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="bl-spk-card"
              style={{
                position: "relative", padding: "clamp(24px,2.4vw,30px) 20px", borderRadius: 18, overflow: "hidden", textAlign: "center",
                background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(10,26,60,0.20) 100%)",
                backdropFilter: "blur(14px) saturate(140%)", WebkitBackdropFilter: "blur(14px) saturate(140%)",
                border: "1px solid rgba(150,200,255,0.22)",
                boxShadow: "0 24px 60px rgba(2,8,20,0.55), inset 0 1px 0 rgba(255,255,255,0.28)",
                transition: "transform .35s ease, border-color .35s ease, box-shadow .35s ease",
              }}
            >
              <span aria-hidden style={{ position: "absolute", top: -1, left: "18%", right: "18%", height: 1.5, background: "linear-gradient(90deg, transparent, rgba(150,214,255,0.8), transparent)" }} />
              {/* staggered shimmer sweep */}
              <span aria-hidden className="bl-glass-sheen" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "55%", zIndex: 0, background: "linear-gradient(90deg, transparent, rgba(180,224,255,0.10), transparent)", animationDelay: `${i * 1.4}s`, pointerEvents: "none" }} />
              {/* avatar — breathing glow */}
              <span className="bl-spk-avatar" style={{
                position: "relative", zIndex: 1,
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
                width: 84, height: 84, borderRadius: "50%",
                background: "linear-gradient(160deg, rgba(120,214,255,0.22), rgba(11,95,255,0.14))",
                border: "1px solid rgba(150,200,255,0.30)", animationDelay: `${i * 0.55}s`,
              }}>
                <svg width={38} height={38} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="8.5" r="3.6" stroke="#9CD6FF" strokeWidth="1.6" />
                  <path d="M5 19.5c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="#9CD6FF" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <div style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 7, fontFamily: FONT, fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#BFE2FF", padding: "4px 11px", borderRadius: 999, background: "rgba(120,214,255,0.12)", border: "1px solid rgba(150,200,255,0.26)", marginBottom: 12 }}>
                <PixelMark size={11} gap={0.8} radius={1} from="#BFE2FF" to="#70A1FF" /> To Be Announced
              </div>
              <div style={{ position: "relative", zIndex: 1, fontFamily: FONT, fontSize: 16.5, fontWeight: 700, color: WHITE, letterSpacing: "-0.01em" }}>Speaker</div>
              <div style={{ position: "relative", zIndex: 1, fontFamily: FONT, fontSize: 13, fontWeight: 500, color: "rgba(200,222,255,0.6)", marginTop: 4 }}>Announced soon</div>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .bl-spk-card:hover { transform: translateY(-5px); border-color: rgba(150,214,255,0.45); box-shadow: 0 30px 70px rgba(2,8,20,0.6), inset 0 1px 0 rgba(255,255,255,0.35); }
        .bl-spk-avatar { animation: bl-spk-pulse 3.2s ease-in-out infinite; }
        @keyframes bl-spk-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(120,214,255,0), inset 0 1px 0 rgba(255,255,255,0.4); }
          50% { box-shadow: 0 0 0 7px rgba(120,214,255,0.07), 0 0 26px rgba(120,214,255,0.4), inset 0 1px 0 rgba(255,255,255,0.4); }
        }
        .bl-mote { animation-name: bl-mote-drift; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
        @keyframes bl-mote-drift {
          0% { transform: translateY(6px); opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 0.7; }
          100% { transform: translateY(-64px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .bl-spk-avatar, .bl-mote { animation: none; } }
        @media (max-width: 900px) { .bl-speakers-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 460px) { .bl-speakers-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// AGENDA — color-coded schedule with a scroll-filling spine + session panels
// ═════════════════════════════════════════════════════════════════════════════
function kindColor(kind: AgendaItem["kind"]) {
  switch (kind) {
    case "keynote": return "#0B5FFF";
    case "feature": return "#434EE5";
    case "demo": return "#1E88E5";
    case "panel": return "#0891B2";
    case "welcome": return "#3B6FE0";
    case "closing": return "#5B5FE0";
    case "break": return "#7A87AE";
    default: return "#3B6FE0"; // logistics
  }
}
function kindLabel(kind: AgendaItem["kind"]) {
  switch (kind) {
    case "welcome": return "Welcome & Introduction";
    case "break": return "Networking Break";
    case "closing": return "Closing";
    case "logistics": return "Networking";
    default: return "Session";
  }
}
function agMins(t: string) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function agDuration(a: AgendaItem) {
  if (!a.end || a.end === "—") return null;
  const d = agMins(a.end) - agMins(a.start);
  return d > 0 ? `${d} min` : null;
}
function AgendaIcon({ kind, size = 14, color = "#fff" }: { kind: AgendaItem["kind"]; size?: number; color?: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const wrap = (c: React.ReactNode) => (<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ display: "block" }}>{c}</svg>);
  switch (kind) {
    case "keynote": return wrap(<g {...p}><rect x="9" y="2.5" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17.5v3.5M9 21h6" /></g>);
    case "feature": return wrap(<g {...p}><rect x="3.5" y="4.5" width="17" height="11.5" rx="1.6" /><path d="M12 16v4M8.5 20.5h7" /></g>);
    case "demo": return wrap(<g {...p}><circle cx="12" cy="12" r="8.6" /><path d="M10.2 8.8l5 3.2-5 3.2z" fill={color} stroke="none" /></g>);
    case "panel": return wrap(<g {...p}><circle cx="8" cy="9.5" r="2.3" /><circle cx="16" cy="9.5" r="2.3" /><path d="M3.5 18.5c0-2.4 2-4 4.5-4s4.5 1.6 4.5 4M11.5 18.5c0-2.4 2-4 4.5-4s4.5 1.6 4.5 4" /></g>);
    case "break": return wrap(<g {...p}><path d="M5 8.5h11v4.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" /><path d="M16 9.5h2.4a2.1 2.1 0 0 1 0 4.2H16" /><path d="M8 3v2.2M11.5 3v2.2" /></g>);
    case "welcome": return wrap(<g {...p}><path d="M12 21v-9M8 15l4-4 4 4" /><path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11" /></g>);
    case "closing": return wrap(<g {...p}><path d="M6.5 3v18M6.5 4h10.5l-2.2 3.2 2.2 3.2H6.5" /></g>);
    default: return wrap(<g {...p}><circle cx="9" cy="9" r="2.3" /><circle cx="15" cy="14" r="2.3" /><path d="M4 15.5c0-2 1.6-3.3 3.6-3.3M13 20c0-2 1.6-3.3 3.6-3.3" /></g>);
  }
}

function AgendaSection() {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(timelineRef, { once: true, margin: "-60px" });
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 78%", "end 55%"] });

  return (
    <section id="agenda" style={{ position: "relative", background: WASH_AGENDA, color: INK, ...SECTION_PAD }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <SectionHeading light eyebrow="Agenda" title="Run of show" sub="20 October 2026 · 10:00 AM – 2:00 PM · Saudi Arabia" />

        <div ref={timelineRef} style={{ marginTop: "clamp(38px,4.6vw,58px)", position: "relative" }}>
          {/* spine track + scroll-filling progress */}
          <span aria-hidden className="bl-ag-spine" style={{ position: "absolute", left: 104, top: 18, bottom: 18, width: 2, background: L_HAIR, borderRadius: 2 }} />
          <motion.span aria-hidden className="bl-ag-spine" style={{ position: "absolute", left: 104, top: 18, bottom: 18, width: 2, background: FUSION, borderRadius: 2, transformOrigin: "top", scaleY: scrollYProgress, boxShadow: `0 0 10px ${BLUE}66` }} />

          {AGENDA.map((a, i) => {
            const col = kindColor(a.kind);
            const muted = a.kind === "break" || a.kind === "logistics";
            const dur = agDuration(a);
            const pill = a.session || kindLabel(a.kind);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4), ease: EASE }}
                className="bl-agenda-row"
                style={{ position: "relative", display: "grid", gridTemplateColumns: "84px 1fr", columnGap: 48, alignItems: "start", padding: "9px 0" }}
              >
                {/* time */}
                <div style={{ textAlign: "right", paddingTop: 12 }}>
                  <div style={{ fontFamily: FONT, fontSize: "clamp(15px,1.3vw,18px)", fontWeight: 800, color: INK, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>{a.start}</div>
                  {a.end && a.end !== "—" && <div style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 600, color: INK_3, marginTop: 3, fontVariantNumeric: "tabular-nums" }}>{a.end}</div>}
                </div>

                {/* node on spine */}
                <span aria-hidden className="bl-ag-node" style={{
                  position: "absolute", left: 90, top: 10, width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: muted ? "#FFFFFF" : col,
                  border: muted ? `2px solid ${col}66` : "2px solid #FFFFFF",
                  boxShadow: muted ? "0 2px 8px rgba(11,40,120,0.14)" : `0 0 0 4px ${col}22, 0 5px 14px ${col}55`,
                }}>
                  <AgendaIcon kind={a.kind} size={14} color={muted ? col : "#fff"} />
                </span>

                {/* session panel */}
                <div className="bl-ag-panel" style={{
                  position: "relative", overflow: "hidden", borderRadius: 14,
                  padding: "clamp(13px,1.5vw,18px) clamp(16px,1.8vw,22px)",
                  background: muted ? "rgba(255,255,255,0.42)" : L_CARD,
                  border: `1px solid ${L_HAIR}`, borderLeft: `3px solid ${col}`,
                  boxShadow: muted ? "none" : L_CARD_SHADOW,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", fontFamily: FONT, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: col, padding: "3px 10px", borderRadius: 999, background: `${col}14`, border: `1px solid ${col}33` }}>{pill}</span>
                    {dur && <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.02em", color: INK_3, padding: "3px 9px", borderRadius: 999, background: "rgba(11,40,120,0.05)", border: `1px solid ${L_HAIR_SOFT}` }}>{dur}</span>}
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: "clamp(15px,1.25vw,17.5px)", fontWeight: muted ? 600 : 700, color: muted ? INK_2 : INK, lineHeight: 1.34, letterSpacing: "-0.01em" }}>{a.title}</div>
                  {a.owner && <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: INK_3, marginTop: 7 }}>{a.owner}</div>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <style jsx global>{`
        .bl-ag-panel { transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
        .bl-ag-panel:hover { transform: translateX(5px); box-shadow: 0 18px 40px rgba(11,40,120,0.16), 0 1px 0 rgba(255,255,255,0.9) inset; }
        @media (max-width: 560px) {
          .bl-ag-spine { left: 66px !important; }
          .bl-agenda-row { grid-template-columns: 50px 1fr !important; column-gap: 34px !important; }
          .bl-ag-node { left: 52px !important; }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PARTNERS
// ═════════════════════════════════════════════════════════════════════════════
function PartnersSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section id="partners" style={{ position: "relative", background: WASH_PARTNERS, color: INK, ...SECTION_PAD }}>
      <div style={{ position: "relative", maxWidth: 1160, margin: "0 auto" }}>
        <SectionHeading light eyebrow="The Partners" title="Two companies, one platform vision" align="center" sub="Blackstone eIT and Liferay bring together system integration depth and a market-leading Digital Experience Platform — the foundation for governed, AI-powered public services." />

        <div ref={ref} className="bl-partners-grid" style={{ marginTop: "clamp(40px,5vw,64px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(18px,2vw,26px)" }}>
          {PARTNERS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              className="bl-lcard"
              style={{
                position: "relative", borderRadius: 20, overflow: "hidden",
                background: "linear-gradient(165deg, #FFFFFF 0%, #F1F5FF 55%, #E4ECFF 100%)", border: `1px solid ${L_HAIR}`, boxShadow: L_CARD_SHADOW,
                display: "flex", flexDirection: "column",
              }}
            >
              {/* Blue brand header — keeps the white-wordmark logos legible */}
              <div style={{ position: "relative", overflow: "hidden", padding: "24px clamp(28px,3vw,42px)", background: `linear-gradient(130deg, ${p.tint} 0%, ${NAVY} 118%)`, display: "flex", alignItems: "center", minHeight: 84 }}>
                <span aria-hidden style={{ position: "absolute", top: -50, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 68%)", pointerEvents: "none" }} />
                <span aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1.5, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logo} alt={p.name} style={{ height: p.logoH, width: "auto", display: "block", position: "relative", filter: p.name === "Liferay" ? "brightness(0) invert(1)" : undefined }} />
              </div>

              <div style={{ padding: "clamp(24px,2.8vw,36px) clamp(28px,3vw,42px) clamp(24px,2.8vw,34px)", display: "flex", flexDirection: "column", flex: 1 }}>
                {p.body.map((para, j) => (
                  <p key={j} style={{ margin: "0 0 14px", fontFamily: FONT, fontSize: "clamp(14px,1.02vw,15.5px)", lineHeight: 1.66, color: "#0B1226", fontWeight: 500 }}>{para}</p>
                ))}
                <a href={p.href} target="_blank" rel="noopener noreferrer" style={{
                  marginTop: "auto", paddingTop: 10, display: "inline-flex", alignItems: "center", gap: 8,
                  fontFamily: FONT, fontSize: 13.5, fontWeight: 700, color: BLUE, textDecoration: "none",
                }} className="bl-partner-link">
                  {p.hrefLabel} <span aria-hidden>↗</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .bl-partner-link:hover { text-decoration: underline; }
        @media (max-width: 760px) { .bl-partners-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// REGISTER
// ═════════════════════════════════════════════════════════════════════════════
const INDUSTRIES = [
  "Government / Public Sector", "Banking & Financial Services", "Telecommunications",
  "Healthcare", "Energy & Utilities", "Technology & Software", "Consulting & Advisory",
  "Education", "Retail & E-commerce", "Transport & Logistics", "Other",
];

function RegisterSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const defaultPhoneCountry = useMemo<CountryCode>(
    () => COUNTRY_CODES.find((c) => c.country === "SA") ?? COUNTRY_CODES[0],
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
    const err: Record<string, string> = {};
    if (!email.trim()) err.email = "Business email is required";
    else if (!isWorkEmail(email.trim())) err.email = "Please use your work email — free providers are not accepted";
    if (!firstName.trim()) err.firstName = "First name is required";
    if (!lastName.trim()) err.lastName = "Last name is required";
    if (!jobTitle.trim()) err.jobTitle = "Job title is required";
    if (!company.trim()) err.company = "Company is required";
    const phoneError = validatePhone(phone, phoneCountry);
    if (phoneError) err.phone = phoneError;
    if (!country) err.country = "Please select a country";
    if (!industry) err.industry = "Please select an industry";
    if (!consent) err.consent = "Please confirm consent to proceed";
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setSubmitState("submitting");
    setSubmitError("");
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    const res = await submitForm({
      type: "contact",
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      job_title: jobTitle.trim(),
      company: company.trim(),
      phone: `${phoneCountry.code} ${cleanPhone}`,
      event_name: "Blackstone eIT × Liferay Executive Roundtable — AI-Powered Government: Enabling Citizen-Centered Experiences · Saudi Arabia, 20 October 2026",
      metadata: {
        "Event Page": "Blackstone eIT × Liferay · KSA",
        "Page Section": "Registration Form",
        "Phone Country": `${phoneCountry.name} (${phoneCountry.code})`,
        Country: country,
        Industry: industry,
        "Consent Given": "true",
      },
    });
    if (res.success) {
      setSubmitState("success");
      setEmail(""); setFirstName(""); setLastName(""); setJobTitle(""); setCompany("");
      setPhone(""); setPhoneCountry(defaultPhoneCountry); setCountry(""); setIndustry(""); setConsent(false);
    } else {
      setSubmitState("error");
      setSubmitError(res.error || "Something went wrong. Please try again.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 11, border: `1px solid ${HAIR}`,
    background: "rgba(255,255,255,0.04)", color: WHITE, fontFamily: FONT, fontSize: 14.5, outline: "none",
    transition: "border-color .2s, background .2s",
  };
  const labelStyle: React.CSSProperties = { fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", color: TXT_2, marginBottom: 7, display: "block" };
  const errStyle: React.CSSProperties = { fontFamily: FONT, fontSize: 11.5, color: "#FF8080", marginTop: 5 };
  const countryList = useMemo(() => Array.from(new Set(COUNTRY_CODES.map((c) => c.name))).sort(), []);

  return (
    <section id="register" style={{ position: "relative", overflow: "hidden", background: "#020A17", color: WHITE, ...SECTION_PAD }}>
      <SmokeBg />
      <div ref={ref} className="bl-register-grid" style={{ position: "relative", zIndex: 2, maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "clamp(36px,5vw,72px)", alignItems: "start" }}>
        {/* LEFT — pitch */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BLUE_LT, marginBottom: 16 }}>
            <PixelMark size={15} gap={1} radius={1.5} /> Reserve
          </span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px,3.4vw,44px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.08, margin: "0 0 18px", color: WHITE }}>
            Request your seat<br />at the table
          </h2>
          <p style={{ margin: "0 0 28px", fontFamily: FONT, fontSize: "clamp(15px,1.15vw,17px)", lineHeight: 1.65, color: TXT_2, maxWidth: 440 }}>
            Seats are limited and reserved for senior public-sector and enterprise leaders. Submit your details and our team will confirm your invitation.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {EVENT_META.map((m) => (
              <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <PixelMark size={18} gap={1.2} radius={1.6} />
                <span style={{ fontFamily: FONT, fontSize: 14.5, color: TXT }}><strong style={{ fontWeight: 700 }}>{m.label}:</strong> {m.value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 30, paddingTop: 24, borderTop: `1px solid ${HAIR}` }}>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: TXT_3, marginBottom: 14 }}>Co-hosted by</div>
            <LogoLockup bsH={26} lrH={30} />
          </div>
        </motion.div>

        {/* RIGHT — form */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
          style={{ position: "relative", padding: "clamp(24px,3vw,40px)", borderRadius: 22, background: `linear-gradient(180deg, ${NAVY_3} 0%, ${NAVY_2} 100%)`, border: `1px solid ${HAIR}`, boxShadow: `0 30px 80px rgba(4,8,26,0.5), 0 1px 0 rgba(255,255,255,0.05) inset`, overflow: "hidden" }}
        >
          <span aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: FUSION }} />
          {submitState === "success" ? (
            <div style={{ textAlign: "center", padding: "40px 10px" }}>
              <div style={{ margin: "0 auto 20px", width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: FUSION, boxShadow: `0 8px 30px ${BLUE}55` }}>
                <span style={{ fontSize: 30, color: WHITE }}>✓</span>
              </div>
              <h3 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, margin: "0 0 10px", color: WHITE }}>Request received</h3>
              <p style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.6, color: TXT_2, margin: 0, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
                Thank you. Our team will review your request and confirm your invitation to the Blackstone eIT × Liferay roundtable shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value="" onChange={() => {}} style={{ display: "none" }} aria-hidden />

              <div className="bl-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>First name</label>
                  <input style={inputStyle} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
                  {errors.firstName && <div style={errStyle}>{errors.firstName}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Last name</label>
                  <input style={inputStyle} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
                  {errors.lastName && <div style={errStyle}>{errors.lastName}</div>}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Business email</label>
                <input
                  style={inputStyle} type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => {
                    const v = email.trim();
                    setErrors((prev) => {
                      const next = { ...prev };
                      if (!v) next.email = "Business email is required";
                      else if (!isWorkEmail(v)) next.email = "Please use your work email — free providers are not accepted";
                      else delete next.email;
                      return next;
                    });
                  }}
                  placeholder="you@organisation.gov.sa"
                />
                {errors.email && <div style={errStyle}>{errors.email}</div>}
              </div>

              <div className="bl-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Job title</label>
                  <input style={inputStyle} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. CIO, Director" />
                  {errors.jobTitle && <div style={errStyle}>{errors.jobTitle}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Company / Entity</label>
                  <input style={inputStyle} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Organisation" />
                  {errors.company && <div style={errStyle}>{errors.company}</div>}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Phone</label>
                <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 10 }}>
                  <select
                    style={{ ...inputStyle, padding: "12px 8px" }}
                    value={phoneCountry.country}
                    onChange={(e) => {
                      const c = COUNTRY_CODES.find((x) => x.country === e.target.value);
                      if (c) { setPhoneCountry(c); setPhone((prev) => prev.replace(/\D/g, "").slice(0, c.length)); }
                    }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={`${c.country}-${c.code}`} value={c.country} style={{ background: NAVY_2, color: WHITE }}>{c.country} {c.code}</option>
                    ))}
                  </select>
                  <input
                    style={inputStyle} value={phone} inputMode="numeric" maxLength={phoneCountry.length}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, phoneCountry.length))}
                    placeholder={phoneCountry.placeholder}
                  />
                </div>
                {errors.phone && <div style={errStyle}>{errors.phone}</div>}
              </div>

              <div className="bl-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Country</label>
                  <select style={inputStyle} value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="" style={{ background: NAVY_2 }}>Select country</option>
                    {countryList.map((c) => <option key={c} value={c} style={{ background: NAVY_2, color: WHITE }}>{c}</option>)}
                  </select>
                  {errors.country && <div style={errStyle}>{errors.country}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Industry</label>
                  <select style={inputStyle} value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    <option value="" style={{ background: NAVY_2 }}>Select industry</option>
                    {INDUSTRIES.map((c) => <option key={c} value={c} style={{ background: NAVY_2, color: WHITE }}>{c}</option>)}
                  </select>
                  {errors.industry && <div style={errStyle}>{errors.industry}</div>}
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 2 }}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3, width: 16, height: 16, accentColor: BLUE, flexShrink: 0 }} />
                <span style={{ fontFamily: FONT, fontSize: 12.5, lineHeight: 1.5, color: TXT_3 }}>
                  I agree to be contacted by Events First Group, Blackstone eIT and Liferay regarding this event and consent to my details being processed for this purpose.
                </span>
              </label>
              {errors.consent && <div style={errStyle}>{errors.consent}</div>}

              <button
                type="submit" disabled={submitState === "submitting"}
                className="bl-submit"
                style={{
                  marginTop: 4, padding: "15px", borderRadius: 12, border: "none", cursor: submitState === "submitting" ? "wait" : "pointer",
                  background: FUSION, color: WHITE, fontFamily: FONT, fontSize: 15.5, fontWeight: 700, letterSpacing: "0.01em",
                  boxShadow: `0 6px 22px ${BLUE}55, 0 1px 0 rgba(255,255,255,0.2) inset`, transition: "transform .2s, box-shadow .2s, opacity .2s",
                  opacity: submitState === "submitting" ? 0.7 : 1,
                }}
              >
                {submitState === "submitting" ? "Submitting…" : "Request invitation →"}
              </button>
              {submitState === "error" && <div style={{ ...errStyle, textAlign: "center", fontSize: 13 }}>{submitError}</div>}
            </form>
          )}
        </motion.div>
      </div>
      <style jsx global>{`
        #register input:focus, #register select:focus { border-color: ${BLUE} !important; background: rgba(11,95,255,0.06) !important; }
        #register input::placeholder { color: rgba(200,210,245,0.4); }
        .bl-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px ${BLUE}77, 0 1px 0 rgba(255,255,255,0.24) inset; }
        @media (max-width: 860px) { .bl-register-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 440px) { .bl-form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═════════════════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer style={{ position: "relative", background: "#040A22", color: WHITE, padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px) 40px", borderTop: `1px solid ${HAIR}` }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="bl-footer-top" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <LogoLockup bsH={28} lrH={32} gap={20} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: TXT_3, whiteSpace: "nowrap" }}>Produced by</span>
            <a href="https://www.eventsfirstgroup.com" target="_blank" rel="noopener noreferrer" aria-label="Events First Group" style={{ lineHeight: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/events-first-group_logo_alt.svg" alt="Events First Group" style={{ height: 28, width: "auto", display: "block" }} />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function BlackstoneLiferayPage() {
  // Global Lenis smooth-scroll swallows native #hash jumps on load — replicate
  // the section landing manually for deep links (?...#agenda etc.).
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    let tries = 0;
    const jump = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries++ < 20) {
        setTimeout(jump, 100);
      }
    };
    setTimeout(jump, 300);
  }, []);

  return (
    <main style={{ background: NAVY, fontFamily: FONT, minHeight: "100vh", overflowX: "hidden" }}>
      <Nav />
      <Hero />
      <OverviewSection />
      <TakeawaysSection />
      <SpeakersSection />
      <AgendaSection />
      <PartnersSection />
      <RegisterSection />
      <Footer />
    </main>
  );
}
