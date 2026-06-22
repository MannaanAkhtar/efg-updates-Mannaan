"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { submitForm, COUNTRY_CODES, isWorkEmail, validatePhone } from "@/lib/form-helpers";

// ═════════════════════════════════════════════════════════════════════════════
// BLACKSTONE eIT × OUTSYSTEMS — Executive Roundtable Riyadh
// Brand: Blackstone eIT (host) · Sponsor: OutSystems
// Brand spec: 2026 V1.0 (see /blackstone eit/*.pdf in repo)
// ═════════════════════════════════════════════════════════════════════════════

// ─── Design tokens (Blackstone eIT brand — secondary / host-attributed) ─────
const BS_NAVY = "#0B1F3B";       // Deep Tech Navy — Blackstone surface (used on host cards)
const BS_CYAN = "#00C2FF";       // Electric Cyan — Blackstone accent on host elements
const BS_SILVER = "#F2F4F7";     // Soft Silver — neutral light surface
const BS_WHITE = "#FFFFFF";      // Pure White
const BS_BLACK = "#0A0A0A";      // Blackstone Black
const BS_GRAY = "#5A6B7C";       // Steel Gray
const BS_BLUE = "#145DA0";       // Professional Blue
const BS_LIGHT_BLUE = "#4DA3FF"; // Light Tech Blue

// ─── Design tokens (OutSystems brand — primary / page base) ─────────────────
// Per OutSystems Brand Guidelines (external.2020-1.0): "light and elegance",
// white-led background, red as main hue, yellow as secondary hue. The whole
// page lives in this environment now.
const OS_RED = "#F22800";        // Main hue — CTAs, headline accents, hairlines
const OS_RED_BRIGHT = "#F85E40"; // Bright Red — hover state / glow
const OS_RED_DARK = "#BB1100";   // Dark Red — pressed state / depth
const OS_YELLOW = "#FDB515";     // Secondary CTA / highlight
const OS_SPACE_BLUE = "#0A1E4E"; // OS' dark palette base — used as deepest text

// ─── Guest speaker palette (anyone not from OutSystems / Blackstone) ────────
// A single shared teal treatment for guest speakers — distinct from the cyan
// (Blackstone) and red (OutSystems) tracks so all three affiliations read at
// a glance, no matter which guest organisation.
const GUEST_TEAL = "#14B8A6";
const GUEST_TEAL_BRIGHT = "#5EEAD4";
const GUEST_DEEP = "#0B3D3A";

// ─── Light surface tokens (the page's true base palette) ────────────────────
const CREAM = "#FAFAFA";         // Page background — Apple-style soft off-white
const CREAM_WARM = "#F7F4F1";    // Warmer cream for layered surfaces
const INK = "#0E0E10";           // Maximum-contrast text (headlines)
const CHARCOAL = "#1A1A1A";      // Body text / dark UI chrome
const GRAY_700 = "#39414A";      // OS dark gray — secondary text
const GRAY_500 = "#80858C";      // OS regular gray — tertiary text
const GRAY_300 = "#D7D9DC";      // Hairlines / dividers
const GRAY_100 = "#F2F4F7";      // Faint surface tint (matches BS Soft Silver)

const EASE = [0.22, 1, 0.36, 1] as const;
const EVENT_DATE = new Date("2026-06-24T10:00:00+03:00");

// ─── Brand naming (strict per guideline) ─────────────────────────────────────
// "Blackstone eIT" — capital B, lowercase e, uppercase IT. Never deviate.
const BRAND_HOST = "Blackstone eIT";
const BRAND_SPONSOR = "OutSystems";

// ─── Tagline (DRAFT — content brief showed placeholder) ──────────────────────
// TODO confirm with Mannan: brief had "Second part of the text in the above
// section" in the tagline field which is template helper-text. Using this
// draft until confirmed.
const HERO_TAGLINE_PRIMARY = "From AI pilots to agentic public services —";
const HERO_TAGLINE_ACCENT = "at the scale Vision 2030 demands.";

// ─── Speakers ────────────────────────────────────────────────────────────────
type Speaker = {
  name: string;
  role: "Moderator" | "Speaker" | "Co-Host";
  title: string;
  // "OutSystems" → red treatment, "Blackstone eIT" → cyan/navy treatment.
  // Any other value renders as a generic guest speaker (teal accent + text
  // wordmark). New guest affiliations don't need code changes.
  company: "OutSystems" | "Blackstone eIT" | (string & {});
  linkedin: string;
  photo: string;
};

const SPEAKERS: Speaker[] = [
  {
    name: "Mohamed Shaaban",
    role: "Moderator",
    title: "Senior Account Executive",
    company: "OutSystems",
    linkedin: "https://www.linkedin.com/in/mohamedshaaban",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Mohamed_Shaaban_OutSystems.png",
  },
  {
    name: "Wajih Yahyaoui",
    role: "Co-Host",
    title: "Managing Partner",
    company: "Blackstone eIT",
    linkedin: "https://www.linkedin.com/in/wajihyahyaoui/",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Wajih_Yahaouyi_Blackstone.png",
  },
  {
    name: "Youness Soulayman",
    role: "Speaker",
    title: "CTO & Executive Director",
    company: "Blackstone eIT",
    linkedin: "https://www.linkedin.com/in/younesszahir/",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Youness_Soulayman_Blackstone.png",
  },
  {
    name: "Omar Istaitieh",
    role: "Speaker",
    title: "Lead Solution Architect",
    company: "OutSystems",
    linkedin: "https://www.linkedin.com/in/omaristeatieh",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Omar_Istaitieh_OutSystems.png",
  },
  {
    name: "Thamer Alrowidhan",
    role: "Speaker",
    title: "Chief Information Security Officer (CISO)",
    company: "Confidential",
    linkedin: "https://www.linkedin.com/in/ethamer",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Thamer_alrowidhan.png",
  },
  {
    name: "Oleg Krylov",
    role: "Speaker",
    title: "Senior Director – Information, Communications and Technology",
    company: "Confidential (PIF)",
    linkedin: "https://www.linkedin.com/in/oleg-krylov",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Oleg_Krylov.png",
  },
  {
    name: "Najwa Alharbi",
    role: "Speaker",
    title: "Director, Innovation and AI Product",
    company: "Confidential",
    linkedin: "https://www.linkedin.com/in/najwaalharbi/",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Najwa+Alharbi.png",
  },
];

// ─── Key takeaways ───────────────────────────────────────────────────────────
const TAKEAWAYS = [
  "Moving from AI pilots to scalable, agentic government services",
  "Balancing innovation, governance and trust in agentic AI adoption",
  "Driving citizen impact and operational efficiency through automation and AI",
];

// ─── Agenda ──────────────────────────────────────────────────────────────────
type AgendaItem = {
  start: string;
  end: string;
  title: string;
  subtitle?: string;
  owner?: string;
  type: "logistics" | "welcome" | "keynote" | "feature" | "break" | "demo" | "panel" | "closing" | "recognition";
};

const AGENDA: AgendaItem[] = [
  { start: "10:00", end: "11:00", title: "Registration, Welcome Coffee & Networking", owner: "Doors open 10:00 · Programme starts 10:30", type: "logistics" },
  { start: "11:00", end: "11:05", title: "Welcome Remarks & Introduction", owner: "Mohamed Shaaban · Senior Account Executive · OutSystems", type: "welcome" },
  { start: "11:05", end: "11:35", title: "Delivering Governed, AI-Driven Public Services for Secure, Citizen-Centric Outcomes at Scale", subtitle: "Opening Keynote", owner: "Mohamed Shaaban · Senior Account Executive · OutSystems", type: "keynote" },
  { start: "11:35", end: "12:05", title: "From Digital First to AI Enabled: A Roadmap for Building Enterprise AI Capabilities", subtitle: "Blackstone eIT session", owner: "Youness Soulayman · CTO & Executive Director · Blackstone eIT", type: "feature" },
  { start: "12:05", end: "12:20", title: "Coffee Break & Prayer", type: "break" },
  { start: "12:20", end: "12:50", title: "Applied Government Use Cases", subtitle: "Agentic AI in Action: Live Demo of Government Use Cases", owner: "Omar Istaitieh · Lead Solution Architect · OutSystems", type: "demo" },
  { start: "12:50", end: "13:20", title: "Panel Discussion & Audience Q&A", subtitle: "Scaling Trusted Agentic AI for Saudi Vision 2030: From Strategy to National Impact", owner: "Moderator + Panelists", type: "panel" },
  { start: "13:20", end: "13:25", title: "Vote of Thanks", owner: "Wajih Yahyaoui · Managing Partner · Blackstone eIT", type: "recognition" },
  { start: "13:25", end: "13:30", title: "Closing Remarks", owner: "Mohamed Shaaban · Senior Account Executive · OutSystems", type: "closing" },
  { start: "13:30", end: "—",     title: "Networking Lunch", owner: "All Delegates", type: "logistics" },
];

// ═════════════════════════════════════════════════════════════════════════════
// COUNTDOWN HOOK
// ═════════════════════════════════════════════════════════════════════════════
function useCountdown(target: Date) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 });
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

// ═════════════════════════════════════════════════════════════════════════════
// LOGOMARK PLACEHOLDERS — swap when real SVGs land
// ═════════════════════════════════════════════════════════════════════════════
function BlackstoneLogomark({ size = 28, dark = false }: { size?: number; color?: string; accent?: string; dark?: boolean }) {
  // Two Blackstone eIT logo variants:
  //   default — light wordmark on transparent (designed for dark backgrounds)
  //   dark    — CMYK dark wordmark (designed for white/cream backgrounds)
  // `dark` is what we reach for on the OutSystems cream page surface; the
  // default white variant is for the dark navy host badge chips.
  const src = dark
    ? "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Blackstone+eIT+Logo+Main+No+Slogan+RGB.png"
    : "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/Blackstone+eIT+Logo+Reversed+No+Slogan.png";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Blackstone eIT"
      style={{
        height: size,
        width: "auto",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  );
}

function OutSystemsLogomark({ size = 24, monochrome = false, dark = false }: { size?: number; color?: string; monochrome?: boolean; dark?: boolean }) {
  // Three OutSystems logo variants:
  //   default — red "O" + white wordmark (designed for dark backgrounds)
  //   dark    — red "O" + dark wordmark (designed for white/cream backgrounds)
  //   monochrome — all-white (fallback for cases where the red ring won't work)
  // Per OutSystems brand guideline: "Do not use main logo on dark background";
  // the `dark` variant is what we reach for on the cream page surface.
  const src = dark
    ? "https://efg-final.s3.eu-north-1.amazonaws.com/logos/outsystem_dark.png"
    : "https://efg-final.s3.eu-north-1.amazonaws.com/logos/outsystems.png";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="OutSystems"
      style={{
        height: size,
        width: "auto",
        display: "inline-block",
        verticalAlign: "middle",
        filter: monochrome ? "brightness(0) invert(1)" : undefined,
      }}
    />
  );
}

// Generic guest-speaker wordmark — used for any affiliation that isn't
// OutSystems or Blackstone. We don't carry lockup assets for every guest
// organisation, so the company name renders as text at the same on-card scale
// as the other logomarks, tinted with the shared guest teal glow.
function GuestLogomark({ name, size = 14 }: { name: string; size?: number }) {
  return (
    <span style={{
      fontFamily: "var(--font-display)",
      fontSize: size,
      fontWeight: 800,
      letterSpacing: "0.18em",
      color: "rgba(255,255,255,0.94)",
      lineHeight: 1,
      textShadow: `0 0 18px ${GUEST_TEAL}55`,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      {name}
    </span>
  );
}

// OutSystems iconic ring mark — circle with a small notch cut out at top-right.
function OutSystemsRing({ size = 18, color = OS_RED, strokeWidth = 2.2 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M19.5 8.3 A9 9 0 1 0 20 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// Blackstone iconic hex mark — flat hex outline.
function BlackstoneHex({ size = 18, color = BS_CYAN, strokeWidth = 2 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// NAV
// ═════════════════════════════════════════════════════════════════════════════
function BlackstoneNav() {
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
      background: scrolled ? "rgba(250,250,250,0.92)" : "rgba(250,250,250,0.0)",
      backdropFilter: scrolled ? "blur(14px) saturate(160%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(14px) saturate(160%)" : "none",
      borderBottom: scrolled ? `1px solid ${GRAY_300}` : "1px solid transparent",
      transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
    }}>
      <div style={{
        maxWidth: 1320, margin: "0 auto",
        padding: "14px clamp(20px, 4vw, 56px) 14px clamp(12px, 1.6vw, 24px)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        minHeight: 72,
      }}>
        {/* Logo lockup — Blackstone + OutSystems, both dark-on-light variants
            sitting directly on the cream nav, separated by a subtle hairline.
            Each logo wrapped in a fixed-height flex cell so they share a baseline
            even though the PNGs have different internal padding. */}
        <a href="#top" aria-label={`${BRAND_HOST} × ${BRAND_SPONSOR}`} className="bs-nav-lockup" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          textDecoration: "none",
          lineHeight: 0,
        }}>
          <span className="bs-nav-logo bs-nav-logo-os" style={{ display: "inline-flex", alignItems: "center", height: 40 }}>
            <OutSystemsLogomark size={30} dark />
          </span>
          <span aria-hidden className="bs-nav-divider" style={{
            width: 1, height: 28,
            background: `linear-gradient(180deg, transparent 0%, ${GRAY_300} 30%, ${GRAY_300} 70%, transparent 100%)`,
          }} />
          <span className="bs-nav-logo bs-nav-logo-bs" style={{ display: "inline-flex", alignItems: "center", height: 40 }}>
            <BlackstoneLogomark size={30} dark />
          </span>
        </a>

        <div className="bs-nav-links" style={{ display: "flex", alignItems: "center", gap: "clamp(20px, 2vw, 32px)" }}>
          {["Overview", "Takeaways", "Speakers", "Agenda", "About"].map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`} style={{
              fontFamily: "var(--font-cabin), system-ui, sans-serif",
              fontSize: 13.5, fontWeight: 600,
              color: GRAY_700,
              textDecoration: "none",
              letterSpacing: "0.01em",
              transition: "color 0.3s ease",
            }} className="bs-nav-link">{label}</a>
          ))}
        </div>

        <a href="#register" className="bs-nav-cta" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "11px 22px", borderRadius: 999,
          background: OS_RED,
          color: BS_WHITE,
          fontFamily: "var(--font-cabin), system-ui, sans-serif",
          fontSize: 13, fontWeight: 700,
          letterSpacing: "0.01em",
          textDecoration: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          boxShadow: `0 2px 6px ${OS_RED}1f, 0 4px 12px ${OS_RED}14`,
          transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
        }}>
          <span className="bs-nav-cta-full">Request Invitation</span>
          <span className="bs-nav-cta-short" style={{ display: "none" }}>Register</span>
          <span aria-hidden>→</span>
        </a>
      </div>

      <style jsx global>{`
        .bs-nav-link:hover { color: ${OS_RED} !important; }
        .bs-nav-cta:hover {
          background: ${OS_RED_DARK};
          transform: translateY(-1px);
          box-shadow: 0 3px 8px ${OS_RED}33, 0 6px 16px ${OS_RED}26;
        }
        @media (max-width: 780px) {
          .bs-nav-links { display: none !important; }
        }
        @media (max-width: 520px) {
          /* Nav lockup + CTA scale fluidly from 320px → 520px so the row
             never crowds itself or wraps the CTA to two lines. */
          .bs-nav-lockup { gap: clamp(6px, 2vw, 10px) !important; }
          .bs-nav-logo-bs { height: clamp(26px, 7.5vw, 36px) !important; }
          .bs-nav-logo-bs img { height: clamp(26px, 7.5vw, 36px) !important; }
          .bs-nav-logo-os { height: clamp(26px, 7.5vw, 36px) !important; }
          .bs-nav-logo-os img { height: clamp(18px, 5.2vw, 26px) !important; }
          .bs-nav-divider { height: clamp(18px, 5vw, 24px) !important; }
          .bs-nav-cta {
            padding: clamp(6px, 1.8vw, 9px) clamp(9px, 2.8vw, 14px) !important;
            font-size: clamp(10px, 2.8vw, 12.5px) !important;
            gap: clamp(4px, 1.4vw, 6px) !important;
          }
          .bs-nav-cta-full { display: none !important; }
          .bs-nav-cta-short { display: inline !important; }
        }
      `}</style>
    </nav>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HERO — OutSystems-led: cream surface, monumental Cabin headline, solid red
// accent on "Agentic AI.", red CTA. Blackstone present as the host badge via
// a small dark navy chip wrapping its logo — equal twin badge to OutSystems'.
// Apple-style restraint: one soft red dawn-glow, otherwise pure whitespace.
// ═════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  const cd = useCountdown(EVENT_DATE);

  return (
    <section id="top" className="bs-hero-section" style={{
      position: "relative",
      overflow: "hidden",
      background: BS_WHITE,
      color: INK,
      paddingTop: "clamp(120px, 14vh, 170px)",
      paddingBottom: "clamp(64px, 9vh, 110px)",
      paddingLeft: "clamp(24px, 5vw, 64px)",
      paddingRight: "clamp(24px, 5vw, 64px)",
    }}>
      {/* ── Cool gradient wash — Blackstone-leaning tones. White diagonal base
            fading to soft silver-blue + cyan glow upper-left + navy hint
            bottom-right + light-blue accent upper-right. The red CTA and
            "Agentic AI" headline pop sharply against the cool field. ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 55% 40% at 6% 10%, ${BS_CYAN}26 0%, ${BS_CYAN}0d 38%, transparent 72%),
          radial-gradient(ellipse 50% 38% at 96% 92%, ${BS_NAVY}1f 0%, ${BS_NAVY}08 36%, transparent 68%),
          radial-gradient(ellipse 40% 30% at 92% 12%, ${BS_LIGHT_BLUE}14 0%, transparent 65%),
          linear-gradient(165deg, ${BS_WHITE} 0%, #F4F8FC 50%, #E8F0F8 100%)
        `,
      }} />

      {/* ── 2-column hero grid — asymmetric (text 1.15fr / event card 1fr) ── */}
      <div className="bs-hero-grid" style={{
        position: "relative", zIndex: 2,
        maxWidth: 1280,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1.15fr 1fr",
        gap: "clamp(40px, 6vw, 96px)",
        alignItems: "center",
      }}>

        {/* ─── LEFT: headline + subhead + CTAs + host lockup ─── */}
        <div className="bs-hero-stack" style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(20px, 2.4vw, 32px)",
        }}>
          {/* Announcement chip — simple, no skeu */}
          <motion.span
            className="bs-hero-chip"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              alignSelf: "flex-start",
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "7px 16px 7px 12px",
              borderRadius: 999,
              background: `${OS_RED}0f`,
              border: `1px solid ${OS_RED}33`,
              fontFamily: "var(--font-cabin), system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: OS_RED_DARK,
              whiteSpace: "nowrap",
            }}
          >
            <span aria-hidden style={{
              width: 6, height: 6, borderRadius: "50%",
              background: OS_RED,
            }} />
            Invitation-only · 24 June 2026
          </motion.span>

          {/* Headline — Cabin, big, ink with solid OS_RED on "Agentic AI" */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
            style={{
              fontFamily: "var(--font-cabin), system-ui, sans-serif",
              fontSize: "clamp(40px, 5.4vw, 76px)",
              fontWeight: 700,
              color: INK,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              margin: 0,
              textWrap: "balance" as "balance",
            }}
          >
            Empowering Saudi Public Sector through{" "}
            <span style={{ color: OS_RED, fontWeight: 700 }}>Agentic AI</span>
          </motion.h1>

          {/* Subhead — Noto Sans, gray, longer-form sentence */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: EASE }}
            style={{
              margin: 0,
              fontFamily: "var(--font-noto-sans), system-ui, sans-serif",
              fontSize: "clamp(15px, 1.2vw, 19px)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: GRAY_700,
              maxWidth: 580,
              letterSpacing: "-0.003em",
            }}
          >
            An invitation-only executive roundtable on scaling agentic AI for Saudi Vision 2030. Hosted by {BRAND_SPONSOR} and {BRAND_HOST}.
          </motion.p>

          {/* CTA row — primary red button + secondary text link, OS-style */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.42, ease: EASE }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
              marginTop: "clamp(4px, 0.8vw, 8px)",
            }}
          >
            <a
              href="#register"
              className="bs-hero-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 30px",
                borderRadius: 999,
                background: OS_RED,
                color: BS_WHITE,
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.01em",
                textDecoration: "none",
                boxShadow: `0 2px 6px ${OS_RED}1f, 0 4px 14px ${OS_RED}1a`,
                transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              Request invitation
              <span aria-hidden style={{ fontSize: 15, marginTop: -1 }}>→</span>
            </a>
            <a
              href="#agenda"
              className="bs-hero-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: CHARCOAL,
                textDecoration: "none",
                letterSpacing: "0.01em",
                transition: "color 0.2s ease, gap 0.2s ease",
              }}
            >
              View agenda
              <span aria-hidden style={{ fontSize: 14 }}>→</span>
            </a>
          </motion.div>

          {/* Host lockup — OutSystems first, then Blackstone, joined by "and".
              Structure: a "Hosted by" label + a row containing both logos and
              the "and" connector. On mobile, the label sits on its own line
              above the logos so the two logos stay together on one row. */}
          <motion.div
            className="bs-hero-hostlockup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.56, ease: EASE }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(12px, 2vw, 22px)",
              flexWrap: "wrap",
              marginTop: "clamp(8px, 1.6vw, 16px)",
              paddingTop: "clamp(20px, 2.4vw, 32px)",
              borderTop: `1px solid ${GRAY_300}`,
            }}
          >
            <span className="bs-hero-hostlockup-label" style={{
              fontFamily: "var(--font-cabin), system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: GRAY_500,
              flexShrink: 0,
            }}>
              Hosted by
            </span>
            <div className="bs-hero-hostlockup-logos" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(10px, 1.6vw, 18px)",
              flexWrap: "nowrap",
            }}>
              <span className="bs-hero-hostlockup-os" style={{ display: "inline-flex", alignItems: "center", height: 32, lineHeight: 0, flexShrink: 0 }}>
                <OutSystemsLogomark size={28} dark />
              </span>
              <span className="bs-hero-hostlockup-and" style={{
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: GRAY_500,
                flexShrink: 0,
              }}>
                and
              </span>
              <span className="bs-hero-hostlockup-bs" style={{ display: "inline-flex", alignItems: "center", height: 36, lineHeight: 0, flexShrink: 0 }}>
                <BlackstoneLogomark size={27} dark />
              </span>
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT: compact event details card — the hero "asset" ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.99, rotateY: -16, rotateX: 0 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateY: -9, rotateX: 2 }}
          whileHover={{ rotateY: -14, rotateX: 5, scale: 1.03, y: -8 }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
          className="bs-hero-event-card"
          style={{
            position: "relative",
            padding: "clamp(30px, 3.2vw, 44px)",
            borderRadius: 20,
            // 3D tilt — fixed: left edge recedes into the page, right edge
            // comes forward toward the viewer. Hover deepens the tilt and
            // lifts the card. Perspective stays on this element so the rest
            // of the hero is unaffected.
            transformStyle: "preserve-3d",
            transformOrigin: "85% center",
            transformPerspective: 1400,
            willChange: "transform",
            // Blackstone surface — deep navy gradient with a cool top-left
            // light catch + a faint cyan glow lower-right. Reads as the host
            // brand's signature dark glass.
            background: `
              radial-gradient(ellipse 60% 40% at 15% 10%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.0) 60%),
              radial-gradient(ellipse 65% 50% at 88% 92%, ${BS_CYAN}1f 0%, transparent 60%),
              linear-gradient(135deg, transparent 0%, transparent 48%, rgba(255,255,255,0.06) 50%, transparent 52%, transparent 100%),
              linear-gradient(180deg, #112B4D 0%, ${BS_NAVY} 60%, #061328 100%)
            `,
            border: `1px solid ${BS_CYAN}33`,
            // Skeu shadow stack adapted for dark surface + 3D tilt. The
            // longer/heavier drops to the LEFT reinforce the receding side
            // (left edge goes into the page), so the card reads as physically
            // tilted, not just flat.
            boxShadow: `
              0 1.5px 0 0 rgba(255,255,255,0.18) inset,
              0 -1.5px 0 0 rgba(0,0,0,0.4) inset,
              0 0 0 1px ${BS_CYAN}1f inset,
              -2px 1px 2px rgba(14,14,16,0.08),
              -8px 6px 18px rgba(14,14,16,0.16),
              -20px 18px 44px rgba(14,14,16,0.22),
              -36px 32px 80px rgba(11,31,59,0.34),
              0 0 100px ${BS_CYAN}22
            `,
            display: "flex",
            flexDirection: "column",
            gap: "clamp(16px, 1.8vw, 22px)",
            overflow: "hidden",
          }}
        >
          {/* Subtle paper-texture noise overlay — tactile feel, very faint */}
          <span aria-hidden style={{
            position: "absolute", inset: 0,
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>")`,
            opacity: 0.04,
            mixBlendMode: "multiply",
            pointerEvents: "none",
            zIndex: 0,
          }} />

          {/* Top accent bar — slightly thicker (3px) with internal gradient
              + bottom inset = looks like a 3D channel, not a flat sticker.
              Now Blackstone-signature: navy → cyan → navy. */}
          <span aria-hidden style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${BS_NAVY} 0%, ${BS_CYAN}cc 50%, ${BS_NAVY} 100%)`,
            boxShadow: `
              0 1px 0 0 rgba(255,255,255,0.5) inset,
              0 -1px 0 0 rgba(0,0,0,0.15) inset,
              0 1px 4px ${BS_CYAN}33
            `,
            pointerEvents: "none",
            zIndex: 3,
          }} />
          {/* Specular highlight directly under the accent bar */}
          <span aria-hidden style={{
            position: "absolute",
            top: 3,
            left: "10%", right: "10%",
            height: 1.5,
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,1) 50%, transparent 100%)`,
            pointerEvents: "none",
            zIndex: 2,
          }} />
          {/* Soft cyan bloom under the upper accent — Blackstone glow on the edge */}
          <span aria-hidden style={{
            position: "absolute",
            top: -16, left: "15%", right: "15%",
            height: 70,
            background: `radial-gradient(ellipse 70% 100% at 50% 100%, ${BS_CYAN}14 0%, ${BS_CYAN}07 40%, transparent 70%)`,
            filter: "blur(10px)",
            pointerEvents: "none",
            zIndex: 0,
          }} />


          {/* Top row: category chip + AST chip — single compact row */}
          <div style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginTop: 2,
          }}>
            <span style={{
              fontFamily: "var(--font-cabin), system-ui, sans-serif",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.62)",
              textShadow: `0 1px 0 rgba(0,0,0,0.4)`,
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              <span aria-hidden style={{
                width: 6, height: 6, borderRadius: "50%",
                background: BS_CYAN,
                boxShadow: `
                  0 1px 0 0 rgba(255,255,255,0.5) inset,
                  0 -1px 0 0 rgba(0,0,0,0.2) inset,
                  0 0 0 2px ${BS_CYAN}26,
                  0 0 4px ${BS_CYAN}66
                `,
              }} />
              Executive Roundtable
            </span>
            <span style={{
              fontFamily: "var(--font-cabin), system-ui, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.72)",
              padding: "3px 8px",
              borderRadius: 5,
              background: `linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.18) 100%)`,
              border: `1px solid ${BS_CYAN}33`,
              boxShadow: `
                0 1px 0 0 rgba(255,255,255,0.08) inset,
                0 -1px 0 0 rgba(0,0,0,0.3) inset,
                0 1px 1px rgba(0,0,0,0.12)
              `,
              textShadow: `0 1px 0 rgba(0,0,0,0.4)`,
            }}>
              AST
            </span>
          </div>

          {/* Date + time block — letterpress-style embossed "10" + supporting lines */}
          <div style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "baseline",
            gap: 14,
          }}>
            <span className="bs-event-date" style={{
              fontFamily: "var(--font-cabin), system-ui, sans-serif",
              fontSize: "clamp(64px, 7vw, 96px)",
              fontWeight: 700,
              color: BS_WHITE,
              letterSpacing: "-0.045em",
              lineHeight: 0.88,
              fontVariantNumeric: "tabular-nums",
              // Letterpress on dark: deep top shadow + faint bottom highlight
              // gives the numeral an embossed feel on the navy surface, plus
              // a soft cyan glow for the brand signature.
              textShadow: `
                0 -1px 0 rgba(0,0,0,0.45),
                0 1px 0 rgba(255,255,255,0.12),
                0 2px 6px rgba(0,0,0,0.35),
                0 0 24px ${BS_CYAN}33
              `,
            }}>
              24
            </span>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}>
              <span className="bs-event-month" style={{
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontSize: "clamp(22px, 2.4vw, 30px)",
                fontWeight: 700,
                color: BS_CYAN,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                lineHeight: 1,
                textShadow: `0 1px 0 rgba(0,0,0,0.4), 0 0 14px ${BS_CYAN}55`,
              }}>
                June 2026
              </span>
              <span className="bs-event-time" style={{
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontSize: "clamp(13px, 1.05vw, 15px)",
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.01em",
                lineHeight: 1.2,
                fontVariantNumeric: "tabular-nums",
                textShadow: `0 1px 0 rgba(0,0,0,0.4)`,
              }}>
                Wed · 10:00 — 14:20
              </span>
            </div>
          </div>

          {/* Engraved divider on navy — thin dark recess above + thin light
              highlight below = carved-channel feel on the dark surface. */}
          <span aria-hidden style={{
            position: "relative",
            height: 2, width: "100%",
            background: `linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.4) 80%, transparent 100%)`,
            boxShadow: `0 1px 0 0 rgba(255,255,255,0.08)`,
          }} />

          {/* Compact info rows: Venue + Audience — each glyph sits in a small
              embossed well with refined press-in skeu: stronger inset, light
              specular at top, dual-layer well floor. */}
          <div style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span aria-hidden className="bs-event-info-well" style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34, height: 34,
                borderRadius: 9,
                background: `
                  radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,255,255,0.06) 0%, transparent 60%),
                  linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.25) 100%)
                `,
                boxShadow: `
                  0 1px 0 0 rgba(255,255,255,0.1) inset,
                  0 2px 3px rgba(0,0,0,0.3) inset,
                  0 -1px 0 0 rgba(0,0,0,0.4) inset,
                  0 1px 0 0 rgba(255,255,255,0.06)
                `,
                border: `1px solid ${BS_CYAN}3d`,
                flexShrink: 0,
              }}>
                <BlackstoneHex size={13} color={BS_CYAN} strokeWidth={2.2} />
              </span>
              <span className="bs-event-info-row" style={{
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontSize: "clamp(14.5px, 1.2vw, 17px)",
                fontWeight: 600,
                color: BS_WHITE,
                letterSpacing: "-0.005em",
                lineHeight: 1.3,
                textShadow: `0 1px 0 rgba(0,0,0,0.4)`,
              }}>
                Fairmont Riyadh
                <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 400, marginLeft: 6 }}>· Riyadh, KSA</span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span aria-hidden className="bs-event-info-well" style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34, height: 34,
                borderRadius: 9,
                background: `
                  radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,255,255,0.06) 0%, transparent 60%),
                  linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.25) 100%)
                `,
                boxShadow: `
                  0 1px 0 0 rgba(255,255,255,0.1) inset,
                  0 2px 3px rgba(0,0,0,0.3) inset,
                  0 -1px 0 0 rgba(0,0,0,0.4) inset,
                  0 1px 0 0 rgba(255,255,255,0.06)
                `,
                border: `1px solid ${BS_CYAN}3d`,
                flexShrink: 0,
              }}>
                <OutSystemsRing size={14} color={BS_CYAN} strokeWidth={2.4} />
              </span>
              <span className="bs-event-info-row" style={{
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontSize: "clamp(14.5px, 1.2vw, 17px)",
                fontWeight: 600,
                color: BS_WHITE,
                letterSpacing: "-0.005em",
                lineHeight: 1.3,
                textShadow: `0 1px 0 rgba(0,0,0,0.4)`,
              }}>
                15–20 senior IT executives
              </span>
            </div>
          </div>

          {/* Engraved divider on navy — thin dark recess above + thin light
              highlight below = carved-channel feel on the dark surface. */}
          <span aria-hidden style={{
            position: "relative",
            height: 2, width: "100%",
            background: `linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.4) 80%, transparent 100%)`,
            boxShadow: `0 1px 0 0 rgba(255,255,255,0.08)`,
          }} />

          {/* Countdown — inline on desktop; stacks on mobile so the tray gets
              full card width instead of overflowing past the right edge. */}
          <div className="bs-event-countdown" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}>
            <span style={{
              fontFamily: "var(--font-cabin), system-ui, sans-serif",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              textShadow: `0 1px 0 rgba(0,0,0,0.4)`,
              flexShrink: 0,
            }}>
              Starts in
            </span>
            <div className="bs-event-countdown-tray" style={{
              display: "inline-flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "clamp(10px, 1.2vw, 14px)",
              padding: "8px 12px",
              borderRadius: 8,
              background: `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.3) 100%)`,
              boxShadow: `
                0 1px 0 0 rgba(255,255,255,0.1) inset,
                0 1px 2px rgba(0,0,0,0.3) inset,
                0 1px 0 0 rgba(255,255,255,0.06)
              `,
              border: `1px solid ${BS_CYAN}33`,
            }}>
              {([
                { v: cd.d, l: "D" },
                { v: cd.h, l: "H" },
                { v: cd.m, l: "M" },
                { v: cd.s, l: "S" },
              ]).map(({ v, l }, i) => (
                <span key={i} style={{
                  display: "inline-flex", alignItems: "baseline", gap: 3,
                  fontFamily: "var(--font-cabin), system-ui, sans-serif",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  <span className="bs-event-countdown-num" style={{
                    fontSize: "clamp(19px, 1.7vw, 23px)",
                    fontWeight: 700,
                    color: BS_WHITE,
                    letterSpacing: "-0.015em",
                    textShadow: `0 1px 0 rgba(0,0,0,0.4)`,
                  }}>
                    {String(v).padStart(2, "0")}
                  </span>
                  <span className="bs-event-countdown-label" style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: "rgba(255,255,255,0.5)",
                  }}>
                    {l}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

      </div>

      <style jsx global>{`
        .bs-hero-cta:hover {
          background: ${OS_RED_DARK};
          transform: translateY(-1px);
          box-shadow: 0 3px 8px ${OS_RED}33, 0 8px 22px ${OS_RED}26;
        }
        .bs-hero-link:hover {
          color: ${OS_RED} !important;
          gap: 10px !important;
        }
        @media (max-width: 880px) {
          .bs-hero-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(40px, 6vw, 56px) !important;
          }
        }
        @media (max-width: 520px) {
          /* Every value below uses clamp(vw) so the hero scales smoothly
             across all small-screen sizes (320px → 520px) instead of
             snapping to a single fixed mobile size. */
          .bs-hero-section {
            padding-top: clamp(80px, 22vw, 110px) !important;
            padding-bottom: clamp(40px, 12vw, 64px) !important;
          }
          .bs-hero-stack {
            gap: clamp(14px, 4.5vw, 22px) !important;
          }
          /* Chip — full label "Invitation-only · 24 June 2026" fluid-fits. */
          .bs-hero-chip {
            font-size: clamp(9px, 2.6vw, 11.5px) !important;
            letter-spacing: 0.14em !important;
            padding: clamp(5px, 1.5vw, 7px) clamp(10px, 3vw, 14px) !important;
            gap: clamp(6px, 2vw, 9px) !important;
          }
          /* Host lockup — label gets its own row, both logos stay on next row. */
          .bs-hero-hostlockup {
            gap: clamp(8px, 2.5vw, 12px) !important;
            padding-top: clamp(14px, 4.2vw, 22px) !important;
          }
          .bs-hero-hostlockup-label {
            font-size: clamp(9px, 2.5vw, 11px) !important;
            letter-spacing: 0.22em !important;
            flex-basis: 100% !important;
          }
          .bs-hero-hostlockup-and {
            font-size: clamp(9px, 2.5vw, 11px) !important;
            letter-spacing: 0.22em !important;
          }
          .bs-hero-hostlockup-logos { gap: clamp(10px, 3vw, 14px) !important; }
          /* Per-logo fluid sizing preserves Blackstone-larger-than-OutSystems
             ratio since BS PNG has more whitespace padding around its mark. */
          .bs-hero-hostlockup-os { height: clamp(20px, 5.5vw, 26px) !important; }
          .bs-hero-hostlockup-os img { height: clamp(18px, 5vw, 24px) !important; }
          .bs-hero-hostlockup-bs { height: clamp(26px, 7vw, 34px) !important; }
          .bs-hero-hostlockup-bs img { height: clamp(26px, 7vw, 34px) !important; }
          /* Event card — fluid padding, fluid type, fluid wells.
             Kill the 3D tilt on mobile (card stacks below text — tilt would
             read as broken layout, not depth). */
          .bs-hero-event-card {
            padding: clamp(16px, 4.5vw, 22px) !important;
            gap: clamp(10px, 3vw, 14px) !important;
            border-radius: clamp(12px, 3.5vw, 16px) !important;
            transform: none !important;
          }
          .bs-hero-event-card .bs-event-date {
            font-size: clamp(44px, 13vw, 58px) !important;
          }
          .bs-hero-event-card .bs-event-month {
            font-size: clamp(16px, 4.5vw, 20px) !important;
          }
          .bs-hero-event-card .bs-event-year {
            font-size: clamp(12px, 3vw, 14px) !important;
          }
          .bs-hero-event-card .bs-event-time {
            font-size: clamp(11px, 3vw, 13px) !important;
          }
          .bs-hero-event-card .bs-event-info-row {
            font-size: clamp(12px, 3.4vw, 14px) !important;
          }
          .bs-hero-event-card .bs-event-info-well {
            width: clamp(22px, 6vw, 28px) !important;
            height: clamp(22px, 6vw, 28px) !important;
          }
          /* Countdown — stack on mobile, fluid tile sizing. */
          .bs-event-countdown {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: clamp(5px, 1.4vw, 8px) !important;
          }
          .bs-event-countdown-tray {
            display: flex !important;
            justify-content: space-between !important;
            width: 100% !important;
            padding: clamp(6px, 1.8vw, 9px) clamp(8px, 2.5vw, 12px) !important;
            gap: clamp(4px, 1.4vw, 8px) !important;
          }
          .bs-event-countdown-tray .bs-event-countdown-num {
            font-size: clamp(14px, 4vw, 18px) !important;
          }
          .bs-event-countdown-tray .bs-event-countdown-label {
            font-size: clamp(8px, 2.4vw, 10px) !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EVENT META RIBBON — slim strip directly under the hero
// Time · venue · audience · countdown. Quiet typography, no chrome.
// ═════════════════════════════════════════════════════════════════════════════
function EventMetaRibbon() {
  const cd = useCountdown(EVENT_DATE);

  return (
    <section style={{
      position: "relative",
      background: BS_NAVY,
      borderTop: `1px solid ${BS_CYAN}1f`,
      borderBottom: `1px solid ${BS_CYAN}1f`,
      padding: "clamp(22px, 2.4vw, 30px) 0",
    }}>
      <div className="bs-meta-ribbon" style={{
        maxWidth: 1320, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 56px)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "clamp(16px, 2.4vw, 32px)",
      }}>
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "center",
          gap: "clamp(14px, 2vw, 28px)",
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          fontSize: 12.5,
          fontWeight: 500,
          color: "rgba(255,255,255,0.72)",
          letterSpacing: "0.02em",
        }}>
          <span>10:00 – 14:20 AST</span>
          <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
          <span>Fairmont Riyadh</span>
          <span style={{ color: "rgba(255,255,255,0.18)" }}>/</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>15–20 senior IT executives</span>
        </div>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "clamp(10px, 1.4vw, 16px)",
        }}>
          <span style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.32em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
          }}>Starts in</span>
          {([
            { v: cd.d, l: "Days" },
            { v: cd.h, l: "Hrs" },
            { v: cd.m, l: "Min" },
            { v: cd.s, l: "Sec" },
          ]).map(({ v, l }, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "baseline", gap: 4,
              fontFamily: "var(--font-montserrat), system-ui, sans-serif",
              fontVariantNumeric: "tabular-nums",
            }}>
              <span style={{
                fontSize: 16, fontWeight: 700, color: BS_WHITE, letterSpacing: "-0.01em",
              }}>
                {String(v).padStart(2, "0")}
              </span>
              <span style={{
                fontSize: 9.5, fontWeight: 600, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.42)",
              }}>{l}</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 720px) {
          .bs-meta-ribbon { justify-content: flex-start !important; }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SHARED — section eyebrow + heading
// ═════════════════════════════════════════════════════════════════════════════
function SectionHeading({
  eyebrow,
  title,
  align = "left",
  maxWidth = 760,
}: {
  eyebrow: string;
  title: React.ReactNode;
  align?: "left" | "center";
  maxWidth?: number;
}) {
  return (
    <div style={{
      maxWidth,
      margin: align === "center" ? "0 auto" : 0,
      textAlign: align,
    }}>
      <p style={{
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: BS_CYAN,
        margin: "0 0 14px 0",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      }}>
        <span aria-hidden style={{ width: 22, height: 1, background: BS_CYAN, opacity: 0.7 }} />
        {eyebrow}
      </p>
      <h2 style={{
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        fontSize: "clamp(28px, 3.4vw, 46px)",
        fontWeight: 800,
        color: BS_WHITE,
        letterSpacing: "-0.022em",
        lineHeight: 1.1,
        margin: 0,
        textWrap: "balance" as "balance",
      }}>
        {title}
      </h2>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// JOURNEY CANVAS — single shared atmosphere that holds BOTH Overview and
// Takeaways as one continuous canvas. The ambient washes, ring micropattern,
// hex sculpture, and linear-gradient tone-shift all live on this wrapper —
// so there's no seam between "Why this matters" and "What you'll take away".
// Each inner <section> renders content only (transparent background).
// ═════════════════════════════════════════════════════════════════════════════
function JourneyCanvas() {
  return (
    <section style={{
      position: "relative",
      background: BS_WHITE,
      // Outer breathing room (top + bottom buffer) — inner sections only carry
      // a small bottom/top buffer of their own to space the two content blocks.
      padding: "clamp(72px, 9vw, 120px) 0 clamp(72px, 9vw, 120px)",
      overflow: "hidden",
    }}>
      {/* ── Cool gradient wash — matches the hero direction: Blackstone-leaning
            tones, white diagonal silver-blue base + cyan glow upper-left + navy
            hint lower-right + light-blue accent upper-right. Atmosphere only,
            no decorative chrome (no hex sculptures, no ring micropattern). ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 55% 40% at 6% 8%, ${BS_CYAN}26 0%, ${BS_CYAN}0d 38%, transparent 72%),
          radial-gradient(ellipse 50% 38% at 96% 94%, ${BS_NAVY}1f 0%, ${BS_NAVY}08 36%, transparent 68%),
          radial-gradient(ellipse 40% 30% at 92% 10%, ${BS_LIGHT_BLUE}14 0%, transparent 65%),
          linear-gradient(165deg, ${BS_WHITE} 0%, #F4F8FC 50%, #E8F0F8 100%)
        `,
      }} />

      {/* ── Content: the two sections stacked, both with transparent backgrounds ── */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <OverviewSection />
        <TakeawaysSection />
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// OVERVIEW — Why this matters (OutSystems-base light theme)
// Cream surface, Cabin display, solid OS red accent on "AI pilots", white body
// card with red hairlines. Blackstone signal kept minimal (a thin navy seam).
// Renders content only — atmosphere is painted by <JourneyCanvas>.
// ═════════════════════════════════════════════════════════════════════════════
function OverviewSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  const TAGS = [
    "Citizen-centric",
    "Governance & trust",
    "Mission-critical scale",
    "Vision 2030 aligned",
  ];

  return (
    <section id="overview" ref={ref} style={{
      position: "relative",
      background: "transparent",
      // Just internal content rhythm — the outer breathing room (top buffer)
      // and the unified atmosphere come from <JourneyCanvas>, the parent that
      // wraps both this section and Takeaways as one continuous canvas.
      padding: "0 0 clamp(40px, 5vw, 60px)",
      overflow: "visible",
    }}>
      {/* (No ambient overlays here — JourneyCanvas paints the shared atmosphere.) */}

      {/* ── Content ── */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1320, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 56px)",
        display: "grid",
        gridTemplateColumns: "0.82fr 1.18fr",
        gap: "clamp(40px, 5vw, 80px)",
        alignItems: "center",
      }} className="bs-overview-grid">

        {/* ─── LEFT: the proposition ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 2.4vw, 32px)" }}
        >
          {/* Eyebrow — white pill with red ring icon (matches hero eyebrow language) */}
          <span style={{
            position: "relative",
            alignSelf: "flex-start",
            display: "inline-flex", alignItems: "center", gap: 11,
            padding: "9px 18px 9px 14px",
            borderRadius: 999,
            background: `linear-gradient(180deg, ${BS_WHITE} 0%, #FAF7F4 100%)`,
            border: `1px solid ${GRAY_300}`,
            boxShadow: `
              0 1px 0 0 rgba(255,255,255,1) inset,
              0 -1px 0 0 ${OS_RED}1a inset,
              0 4px 12px rgba(14,14,16,0.05),
              0 0 24px ${OS_RED}14
            `,
            fontFamily: "var(--font-cabin), system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: CHARCOAL,
          }}>
            {/* Specular */}
            <span aria-hidden style={{
              position: "absolute",
              top: 1, left: "16%", right: "16%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,1) 50%, transparent 100%)`,
              pointerEvents: "none",
            }} />
            <OutSystemsRing size={11} color={OS_RED} strokeWidth={2.4} />
            <BlackstoneHex size={10} color={BS_NAVY} strokeWidth={2} />
            Why this matters
          </span>

          {/* Cinematic headline — Cabin, ink, solid OS red accent on "AI pilots" */}
          <h2 style={{
            fontFamily: "var(--font-cabin), system-ui, sans-serif",
            fontSize: "clamp(32px, 4.4vw, 64px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.04,
            color: INK,
            margin: 0,
            textWrap: "balance" as "balance",
          }}>
            The roadmap from{" "}
            <span style={{ color: OS_RED, fontWeight: 700 }}>AI pilots</span>{" "}
            to agentic public services
          </h2>

          {/* Italic Cabin lead — red left bar */}
          <p style={{
            fontFamily: "var(--font-cabin), system-ui, sans-serif",
            fontStyle: "italic",
            fontSize: "clamp(17px, 1.5vw, 22px)",
            fontWeight: 400,
            lineHeight: 1.45,
            color: GRAY_700,
            margin: 0,
            paddingLeft: "clamp(16px, 1.4vw, 22px)",
            borderLeft: `2px solid ${OS_RED}`,
            maxWidth: 540,
          }}>
            The question is no longer{" "}
            <span style={{ color: INK, fontStyle: "normal", fontWeight: 600 }}>whether</span> AI will reshape Saudi government —{" "}
            <span style={{ color: OS_RED, fontStyle: "normal", fontWeight: 700 }}>but how quickly, and at what scale.</span>
          </p>
        </motion.div>

        {/* ─── RIGHT: white body card with red top hairline ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.985 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.0, delay: 0.2, ease: EASE }}
          style={{ position: "relative" }}
        >
          {/* Soft red halo behind the card */}
          <div aria-hidden style={{
            position: "absolute",
            inset: "-32px",
            background: `radial-gradient(ellipse 55% 50% at 50% 50%, ${OS_RED}14 0%, transparent 65%)`,
            filter: "blur(40px)",
            zIndex: 0,
            pointerEvents: "none",
          }} />

          <div style={{
            position: "relative",
            zIndex: 1,
            padding: "clamp(30px, 3.2vw, 48px)",
            borderRadius: 18,
            background: BS_WHITE,
            border: `1px solid ${GRAY_300}`,
            boxShadow: `
              0 1px 0 0 rgba(255,255,255,1) inset,
              0 1px 3px rgba(14,14,16,0.04),
              0 24px 60px rgba(14,14,16,0.08),
              0 0 48px ${OS_RED}10
            `,
            display: "flex",
            flexDirection: "column",
            gap: 22,
            overflow: "hidden",
          }}>
            {/* Top-edge red hairline — OutSystems signature */}
            <span aria-hidden style={{
              position: "absolute",
              top: 0, left: "10%", right: "10%",
              height: 2,
              background: `linear-gradient(90deg, transparent 0%, ${OS_RED} 50%, transparent 100%)`,
              boxShadow: `0 0 10px ${OS_RED}55`,
              pointerEvents: "none",
            }} />
            {/* Tri-band Blackstone under-stripe — navy→cyan→navy. Both host
                accents in a single 1px stripe under the OS red top hairline. */}
            <span aria-hidden style={{
              position: "absolute",
              top: 4, left: "22%", right: "22%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, ${BS_NAVY}66 25%, ${BS_CYAN}88 50%, ${BS_NAVY}66 75%, transparent 100%)`,
              pointerEvents: "none",
            }} />
            {/* Tiny cyan glow dot at dead-centre of the under-stripe — host watermark seal */}
            <span aria-hidden style={{
              position: "absolute",
              top: 2,
              left: "50%",
              transform: "translateX(-50%)",
              width: 5, height: 5,
              borderRadius: "50%",
              background: BS_CYAN,
              boxShadow: `0 0 8px ${BS_CYAN}cc, 0 0 0 2px ${BS_CYAN}22`,
              pointerEvents: "none",
            }} />
            {/* Bottom-edge thin navy hairline — Blackstone "leftover" signature */}
            <span aria-hidden style={{
              position: "absolute",
              bottom: 0, left: "30%", right: "30%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, ${BS_NAVY}66 50%, transparent 100%)`,
              pointerEvents: "none",
            }} />

            {/* Corner brackets — red */}
            {[
              { top: 14, left: 14, borderTop: true, borderLeft: true },
              { top: 14, right: 14, borderTop: true, borderRight: true },
              { bottom: 14, left: 14, borderBottom: true, borderLeft: true },
              { bottom: 14, right: 14, borderBottom: true, borderRight: true },
            ].map((pos, i) => (
              <span key={i} aria-hidden style={{
                position: "absolute",
                ...pos,
                width: 12, height: 12,
                borderTop: pos.borderTop ? `1.5px solid ${OS_RED}55` : undefined,
                borderBottom: pos.borderBottom ? `1.5px solid ${OS_RED}55` : undefined,
                borderLeft: pos.borderLeft ? `1.5px solid ${OS_RED}55` : undefined,
                borderRight: pos.borderRight ? `1.5px solid ${OS_RED}55` : undefined,
                pointerEvents: "none",
              }} />
            ))}

            {/* ── Blackstone "publisher's seal" — small hex watermark at top-right of
                the body card. Reads as a host signature stamp on OS-framed content. ── */}
            <span aria-hidden style={{
              position: "absolute",
              top: 18,
              right: 38,
              width: 32,
              height: 32,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              opacity: 0.85,
            }}>
              <span style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${BS_CYAN}33 0%, transparent 65%)`,
                filter: "blur(4px)",
              }} />
              <svg viewBox="0 0 24 24" width={22} height={22} style={{ position: "relative" }}>
                <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="none" stroke={BS_NAVY} strokeWidth="1.4" strokeLinejoin="round" />
                <polygon points="12,7 17,9.5 17,14.5 12,17 7,14.5 7,9.5" fill="none" stroke={BS_NAVY} strokeWidth="0.9" strokeLinejoin="round" opacity="0.55" />
                <circle cx="12" cy="12" r="1.1" fill={BS_CYAN} />
              </svg>
            </span>

            {/* Small label inside the panel — red hairline + hex icon, signals
                "OutSystems frames it / Blackstone supplies the context" */}
            <span style={{
              fontFamily: "var(--font-cabin), system-ui, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: OS_RED,
              display: "inline-flex", alignItems: "center", gap: 10,
            }}>
              <span aria-hidden style={{ width: 18, height: 1, background: OS_RED, opacity: 0.8 }} />
              <BlackstoneHex size={10} color={BS_NAVY} strokeWidth={2} />
              Context
            </span>

            <p style={{
              fontFamily: "var(--font-noto-sans), system-ui, sans-serif",
              fontSize: "clamp(15px, 1.15vw, 17px)",
              lineHeight: 1.7,
              color: GRAY_700,
              margin: 0,
            }}>
              Saudi Arabia&apos;s public sector stands at an inflection point. Vision 2030 has set
              ambitious targets for digital government — and AI is moving fast from
              proof-of-concept into the production fabric of citizen services.
            </p>

            {/* Inline pullquote — soft red-tinted sub-card */}
            <div style={{
              position: "relative",
              padding: "clamp(14px, 1.4vw, 18px) clamp(18px, 2vw, 24px)",
              borderRadius: 12,
              background: `linear-gradient(135deg, ${OS_RED}0a 0%, ${OS_YELLOW}05 100%)`,
              border: `1px solid ${OS_RED}33`,
              boxShadow: `0 1px 0 0 rgba(255,255,255,0.6) inset`,
            }}>
              <span aria-hidden style={{
                position: "absolute",
                top: "18%", bottom: "18%", left: -1,
                width: 3,
                background: `linear-gradient(180deg, transparent 0%, ${OS_RED} 50%, transparent 100%)`,
                boxShadow: `0 0 8px ${OS_RED}66`,
                borderRadius: 999,
              }} />
              <p style={{
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.25vw, 18px)",
                fontWeight: 400,
                lineHeight: 1.5,
                color: INK,
                margin: 0,
                letterSpacing: "-0.005em",
              }}>
                The work now is{" "}
                <span style={{ fontStyle: "normal", fontWeight: 700, color: OS_RED, letterSpacing: 0 }}>past the slideware</span>
                {" "}— into the operating model.
              </p>
            </div>

            <p style={{
              fontFamily: "var(--font-noto-sans), system-ui, sans-serif",
              fontSize: "clamp(15px, 1.15vw, 17px)",
              lineHeight: 1.7,
              color: GRAY_700,
              margin: 0,
            }}>
              This invite-only roundtable convenes a focused circle of senior IT executives,
              technology decision-makers and digital transformation leaders with the {BRAND_SPONSOR} and {BRAND_HOST} teams —
              where agentic AI is already delivering measurable citizen impact, where it stalls,
              and how Saudi institutions can build the governance, talent and architecture to
              scale it responsibly.
            </p>

            {/* "Focus areas" anchor label + divider */}
            <div style={{
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <span style={{
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: GRAY_500,
                whiteSpace: "nowrap",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                <BlackstoneHex size={10} color={BS_NAVY} strokeWidth={2} />
                Focus areas
              </span>
              <span aria-hidden style={{
                flex: 1, height: 1,
                background: `linear-gradient(90deg, ${GRAY_300} 0%, transparent 100%)`,
              }} />
            </div>

            {/* Tag pills — white with red dot, OutSystems clean style */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 10,
              marginTop: -8,
            }}>
              {TAGS.map((t, i) => {
                // "Vision 2030 aligned" — the Saudi-government-coded tag — gets the
                // Blackstone host signature (navy hex) instead of the OS red dot.
                const isHostTag = t === "Vision 2030 aligned";
                return (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, y: 8 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.55 + i * 0.06, ease: EASE }}
                    style={{
                      position: "relative",
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "7px 14px 7px 12px",
                      borderRadius: 999,
                      background: BS_WHITE,
                      border: `1px solid ${GRAY_300}`,
                      boxShadow: `
                        0 1px 0 0 rgba(255,255,255,1) inset,
                        0 1px 2px rgba(14,14,16,0.04)
                      `,
                      fontFamily: "var(--font-cabin), system-ui, sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                      color: CHARCOAL,
                    }}
                  >
                    {isHostTag ? (
                      <BlackstoneHex size={9} color={BS_NAVY} strokeWidth={2} />
                    ) : (
                      <span aria-hidden style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: OS_RED,
                        boxShadow: `0 0 0 2px ${OS_RED}1f`,
                      }} />
                    )}
                    {t}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 920px) {
          .bs-overview-grid { grid-template-columns: 1fr !important; gap: clamp(36px, 6vw, 56px) !important; }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// TAKEAWAYS — 3 cards
// ═════════════════════════════════════════════════════════════════════════════
function TakeawaysSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  // Editorial theme keywords paired with each takeaway sentence.
  // `host` flags which card carries the Blackstone leftover signature (hex glyph
  // instead of red ring) — applied to the "Trust" theme since governance maps
  // most directly to the host's Saudi public-sector context.
  const ITEMS = [
    { theme: "Scale", text: "Moving from AI pilots to scalable, agentic government services.", host: false },
    { theme: "Trust", text: "Balancing innovation, governance and trust in agentic AI adoption.", host: true },
    { theme: "Impact", text: "Driving citizen impact and operational efficiency through automation and AI.", host: false },
  ];

  return (
    <section id="takeaways" ref={ref} style={{
      position: "relative",
      background: "transparent",
      // Just internal content rhythm — the outer breathing room (bottom buffer)
      // and the unified atmosphere come from <JourneyCanvas>, the parent that
      // wraps both Overview and this section as one continuous canvas.
      padding: "clamp(40px, 5vw, 60px) 0 0",
      overflow: "visible",
    }}>
      {/* (No ambient overlays here — JourneyCanvas paints the shared atmosphere.) */}

      {/* ── Content ── */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1320, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 56px)",
      }}>
        {/* Centered section header — different rhythm from Overview's left-anchored header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(18px, 2.2vw, 28px)",
            marginBottom: "clamp(40px, 5vw, 64px)",
            textAlign: "center",
          }}
        >
          {/* Eyebrow — white pill with red specular under-rim (matches Overview vocabulary) */}
          <span style={{
            position: "relative",
            display: "inline-flex", alignItems: "center", gap: 11,
            padding: "9px 18px 9px 14px",
            borderRadius: 999,
            background: `linear-gradient(180deg, ${BS_WHITE} 0%, #FAF7F4 100%)`,
            border: `1px solid ${GRAY_300}`,
            boxShadow: `
              0 1px 0 0 rgba(255,255,255,1) inset,
              0 -1px 0 0 ${OS_RED}1a inset,
              0 4px 12px rgba(14,14,16,0.05),
              0 0 24px ${OS_RED}14
            `,
            fontFamily: "var(--font-cabin), system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: CHARCOAL,
          }}>
            {/* Specular */}
            <span aria-hidden style={{
              position: "absolute",
              top: 1, left: "16%", right: "16%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,1) 50%, transparent 100%)`,
              pointerEvents: "none",
            }} />
            <OutSystemsRing size={11} color={OS_RED} strokeWidth={2.4} />
            <BlackstoneHex size={10} color={BS_NAVY} strokeWidth={2} />
            What you&apos;ll take away
          </span>

          {/* Centered cinematic headline — Cabin, ink, solid OS red accent */}
          <h2 style={{
            fontFamily: "var(--font-cabin), system-ui, sans-serif",
            fontSize: "clamp(34px, 4.6vw, 68px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: INK,
            margin: 0,
            maxWidth: 920,
            textWrap: "balance" as "balance",
          }}>
            Three conversations{" "}
            <span style={{ color: OS_RED, fontWeight: 700 }}>
              worth your morning
            </span>
          </h2>

          {/* Supporting line — Noto Sans, GRAY_700 (matches Overview body cadence) */}
          <p style={{
            margin: 0,
            fontFamily: "var(--font-noto-sans), system-ui, sans-serif",
            fontSize: "clamp(15px, 1.15vw, 17px)",
            fontWeight: 400,
            lineHeight: 1.6,
            color: GRAY_700,
            maxWidth: 600,
            letterSpacing: "-0.003em",
          }}>
            Three working themes shaped around what senior Saudi public-sector leaders actually need to decide on this year.
          </p>
        </motion.div>

        {/* 3-card grid of takeaways */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(20px, 2.4vw, 30px)",
        }} className="bs-takeaways-grid">
          {ITEMS.map(({ theme, text, host }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.25 + i * 0.12, ease: EASE }}
              className="bs-takeaway-card"
              style={{
                position: "relative",
                padding: "clamp(22px, 2.2vw, 32px) clamp(20px, 1.9vw, 26px) clamp(20px, 2vw, 28px)",
                borderRadius: 16,
                background: BS_WHITE,
                border: `1px solid ${GRAY_300}`,
                boxShadow: `
                  0 1px 0 0 rgba(255,255,255,1) inset,
                  0 1px 3px rgba(14,14,16,0.04),
                  0 16px 38px rgba(14,14,16,0.06),
                  0 0 32px ${OS_RED}0a
                `,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "clamp(10px, 1.2vw, 14px)",
                minHeight: "clamp(160px, 12vw, 190px)",
                overflow: "hidden",
                transition: "transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
              }}
            >
              {/* Top-edge red hairline — OutSystems signature (same as Overview body card) */}
              <span aria-hidden style={{
                position: "absolute",
                top: 0, left: "10%", right: "10%",
                height: 2,
                background: `linear-gradient(90deg, transparent 0%, ${OS_RED} 50%, transparent 100%)`,
                boxShadow: `0 0 10px ${OS_RED}55`,
                pointerEvents: "none",
                zIndex: 2,
              }} />

              {/* Parallel navy under-stripe ONLY on the "host" card — Blackstone leftover signature */}
              {host && (
                <span aria-hidden style={{
                  position: "absolute",
                  top: 4, left: "22%", right: "22%",
                  height: 1,
                  background: `linear-gradient(90deg, transparent 0%, ${BS_NAVY}66 50%, transparent 100%)`,
                  pointerEvents: "none",
                  zIndex: 2,
                }} />
              )}

              {/* Diagonal sheen band — moves on hover. Blackstone-blue tint, so the
                  shimmer reads as the host's "leftover" moment inside an OS-framed card. */}
              <span aria-hidden className="bs-takeaway-sheen" style={{
                position: "absolute",
                top: "-30%",
                left: "-30%",
                width: "60%",
                height: "200%",
                background: `linear-gradient(110deg, transparent 0%, ${BS_CYAN}10 38%, ${BS_CYAN}1f 48%, ${BS_LIGHT_BLUE}14 56%, transparent 100%)`,
                transform: "rotate(8deg)",
                pointerEvents: "none",
                zIndex: 1,
                transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease",
              }} />

              {/* ─── Watermark numeral — partly clipped at bottom-right. Tint follows
                    the card's affiliation: navy on the host (Trust), OS-red elsewhere. ─── */}
              <span aria-hidden style={{
                position: "absolute",
                bottom: "-0.18em",
                right: "-0.05em",
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(92px, 10vw, 140px)",
                lineHeight: 0.85,
                letterSpacing: "-0.05em",
                color: host ? `${BS_NAVY}14` : `${OS_RED}10`,
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 0,
                fontVariantNumeric: "tabular-nums",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Corner brackets — red (Overview vocabulary) */}
              {[
                { top: 14, left: 14, borderTop: true, borderLeft: true },
                { top: 14, right: 14, borderTop: true, borderRight: true },
                { bottom: 14, left: 14, borderBottom: true, borderLeft: true },
                { bottom: 14, right: 14, borderBottom: true, borderRight: true },
              ].map((pos, idx) => (
                <span key={idx} aria-hidden style={{
                  position: "absolute",
                  ...pos,
                  width: 12, height: 12,
                  borderTop: pos.borderTop ? `1.5px solid ${OS_RED}55` : undefined,
                  borderBottom: pos.borderBottom ? `1.5px solid ${OS_RED}55` : undefined,
                  borderLeft: pos.borderLeft ? `1.5px solid ${OS_RED}55` : undefined,
                  borderRight: pos.borderRight ? `1.5px solid ${OS_RED}55` : undefined,
                  pointerEvents: "none",
                  zIndex: 2,
                }} />
              ))}

              {/* Theme keyword — italic Cabin, OS_RED, with hairlines either side */}
              <span style={{
                position: "relative",
                zIndex: 1,
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.2vw, 18px)",
                fontWeight: 500,
                letterSpacing: "0.04em",
                color: host ? BS_NAVY : OS_RED,
                textTransform: "lowercase",
                display: "inline-flex", alignItems: "center", gap: 10,
              }}>
                <span aria-hidden style={{
                  width: 16, height: 1,
                  background: `linear-gradient(90deg, transparent, ${host ? BS_NAVY : OS_RED})`,
                }} />
                {theme}
                <span aria-hidden style={{
                  width: 16, height: 1,
                  background: `linear-gradient(90deg, ${host ? BS_NAVY : OS_RED}, transparent)`,
                }} />
              </span>

              {/* Body — Cabin medium, ink, centered */}
              <p style={{
                position: "relative",
                zIndex: 1,
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontSize: "clamp(17px, 1.45vw, 22px)",
                fontWeight: 500,
                lineHeight: 1.4,
                color: INK,
                margin: 0,
                letterSpacing: "-0.012em",
                textWrap: "balance" as "balance",
                maxWidth: 280,
              }}>
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .bs-takeaway-card:hover {
          transform: translateY(-6px);
          border-color: ${OS_RED}44 !important;
          box-shadow:
            0 1px 0 0 rgba(255,255,255,1) inset,
            0 1px 3px rgba(14,14,16,0.04),
            0 28px 70px rgba(14,14,16,0.10),
            0 0 70px ${OS_RED}1f !important;
        }
        .bs-takeaway-card:hover .bs-takeaway-sheen {
          transform: translateX(260%) rotate(8deg) !important;
        }
        @media (max-width: 980px) {
          .bs-takeaways-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SPEAKERS — 6 speakers, no bios
// ═════════════════════════════════════════════════════════════════════════════
function SpeakerCard({ s, idx, inView }: { s: Speaker; idx: number; inView: boolean }) {
  const initials = s.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const isHost = s.company === "Blackstone eIT";
  const isOs = s.company === "OutSystems";
  const isGuest = !isHost && !isOs;
  // Host (Blackstone) → cyan/blue. OutSystems → brand red. Anyone else
  // (guest speaker — NEOM, future partners, panelists) → shared teal track.
  const companyColor = isHost ? BS_CYAN : isGuest ? GUEST_TEAL : OS_RED;
  // Middle-stop accent used on the outer hex frame gradient — must harmonize
  // with `companyColor` so the frame doesn't go red→blue→red on OS cards.
  const companyAccent = isHost ? BS_LIGHT_BLUE : isGuest ? GUEST_TEAL_BRIGHT : OS_RED_BRIGHT;
  // Deep tonal base for the card body & inner hex backdrop — Blackstone navy
  // for the host, a deep wine-red for OutSystems, a deep teal for guests.
  const companyDeep = isHost ? BS_NAVY : isGuest ? GUEST_DEEP : "#3D0B00";
  const HEX_CLIP = "polygon(25% 5%, 75% 5%, 98% 50%, 75% 95%, 25% 95%, 2% 50%)";

  return (
    <motion.a
      href={s.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: 0.25 + idx * 0.1, ease: EASE }}
      className="bs-speaker-card"
      aria-label={`${s.name} on LinkedIn`}
      style={{
        // Per-card CSS vars — picked up by the global :hover rule so each
        // card glows in its own brand color rather than a hardcoded cyan.
        ["--bs-card-glow" as string]: `${companyColor}3d`,
        ["--bs-card-border" as string]: `${companyColor}55`,
        position: "relative",
        padding: "clamp(24px, 2.2vw, 32px) clamp(22px, 2vw, 28px) clamp(20px, 1.8vw, 26px)",
        borderRadius: 18,
        // Liquid-glass + skeu refractive composite — tinted by company so each
        // card reads as either "black-blue" (Blackstone) or "black-red" (OutSystems).
        background: `
          radial-gradient(ellipse 80% 60% at 22% 8%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 28%, transparent 55%),
          radial-gradient(ellipse 70% 50% at 80% 100%, ${companyColor}3a 0%, ${companyColor}14 35%, transparent 60%),
          radial-gradient(ellipse 60% 90% at 50% 50%, ${companyDeep}55 0%, ${companyDeep}22 50%, transparent 85%),
          linear-gradient(168deg, ${companyDeep}66 0%, ${BS_BLACK}cc 100%)
        `,
        backdropFilter: "blur(30px) saturate(180%) brightness(1.06)",
        WebkitBackdropFilter: "blur(30px) saturate(180%) brightness(1.06)",
        border: `1px solid ${companyColor}33`,
        boxShadow: `
          0 1.5px 0 0 rgba(255,255,255,0.22) inset,
          0 -1.5px 0 0 rgba(0,0,0,0.32) inset,
          0 0 0 1px ${companyColor}33 inset,
          0 1px 2px rgba(0,0,0,0.18) inset,
          0 24px 56px rgba(0,0,0,0.5),
          0 0 70px ${companyColor}33
        `,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "clamp(14px, 1.4vw, 18px)",
        textDecoration: "none",
        overflow: "hidden",
        transition: "transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      {/* Top-edge company-color gradient hairline */}
      <span aria-hidden style={{
        position: "absolute", top: 0, left: "8%", right: "8%", height: 1.5,
        background: `linear-gradient(90deg, transparent 0%, ${companyColor} 50%, transparent 100%)`,
        pointerEvents: "none",
        zIndex: 3,
      }} />
      {/* Skeu specular highlight */}
      <span aria-hidden style={{
        position: "absolute", top: 1.5, left: "20%", right: "20%", height: 1,
        background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)`,
        pointerEvents: "none",
        zIndex: 3,
      }} />
      {/* Bottom-edge dark seal */}
      <span aria-hidden style={{
        position: "absolute", bottom: 0, left: "12%", right: "12%", height: 1,
        background: `linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 50%, transparent 100%)`,
        pointerEvents: "none",
        zIndex: 3,
      }} />

      {/* Diagonal sheen band — "liquid glass" reflection, slides on hover */}
      <span aria-hidden className="bs-speaker-sheen" style={{
        position: "absolute",
        top: "-30%",
        left: "-30%",
        width: "60%",
        height: "200%",
        background: `linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.05) 42%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.05) 58%, transparent 100%)`,
        transform: "rotate(8deg)",
        pointerEvents: "none",
        zIndex: 1,
        transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
      }} />

      {/* Cinematic corner brackets */}
      {[
        { top: 12, left: 12, borderTop: true, borderLeft: true },
        { top: 12, right: 12, borderTop: true, borderRight: true },
        { bottom: 12, left: 12, borderBottom: true, borderLeft: true },
        { bottom: 12, right: 12, borderBottom: true, borderRight: true },
      ].map((pos, idx2) => (
        <span key={idx2} aria-hidden style={{
          position: "absolute",
          ...pos,
          width: 11, height: 11,
          borderTop: pos.borderTop ? `1.5px solid ${companyColor}88` : undefined,
          borderBottom: pos.borderBottom ? `1.5px solid ${companyColor}88` : undefined,
          borderLeft: pos.borderLeft ? `1.5px solid ${companyColor}88` : undefined,
          borderRight: pos.borderRight ? `1.5px solid ${companyColor}88` : undefined,
          pointerEvents: "none",
          zIndex: 3,
        }} />
      ))}

      {/* Role badge — top-right, glass-skeu */}
      <span style={{
        position: "absolute", top: 14, right: 14,
        zIndex: 3,
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        fontSize: 9.5, fontWeight: 700,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: companyColor,
        padding: "5px 10px",
        borderRadius: 999,
        background: `linear-gradient(180deg, ${companyColor}1f 0%, ${companyColor}0a 100%)`,
        border: `1px solid ${companyColor}66`,
        boxShadow: `
          0 1px 0 0 rgba(255,255,255,0.16) inset,
          0 0 12px ${companyColor}33
        `,
      }}>
        {s.role}
      </span>

      {/* Hex portrait — enlarged size, with cyan glow halo behind */}
      <div style={{
        position: "relative",
        zIndex: 2,
        width: "clamp(150px, 11.5vw, 178px)",
        height: "clamp(173px, 13.2vw, 205px)",
        marginTop: 8,
      }}>
        {/* Soft glow halo behind hex */}
        <div aria-hidden style={{
          position: "absolute",
          inset: "-12px",
          background: `radial-gradient(circle, ${companyColor}33 0%, transparent 65%)`,
          filter: "blur(20px)",
          pointerEvents: "none",
        }} />
        {/* Outer hex frame — company-color gradient border */}
        <div style={{
          position: "absolute", inset: 0,
          clipPath: HEX_CLIP,
          background: `linear-gradient(140deg, ${companyColor}, ${companyAccent}55, ${companyColor})`,
          boxShadow: `0 12px 28px rgba(0,0,0,0.4)`,
        }} />
        {/* Inner hex containing the photo (3px frame) */}
        <div style={{
          position: "absolute", inset: 3,
          clipPath: HEX_CLIP,
          background: `linear-gradient(135deg, ${companyDeep}, ${BS_BLACK})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 28,
          color: companyColor,
          letterSpacing: "0.04em",
          overflow: "hidden",
        }}>
          {s.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.photo}
              alt={s.name}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                clipPath: HEX_CLIP,
              }}
            />
          ) : (
            initials
          )}
        </div>
      </div>

      {/* Name — guest cards reserve 1 line of vertical space for consistent alignment */}
      <h3 style={{
        position: "relative",
        zIndex: 2,
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        fontSize: "clamp(17px, 1.4vw, 20px)",
        fontWeight: 700,
        color: BS_WHITE,
        margin: 0,
        letterSpacing: "-0.015em",
        lineHeight: 1.2,
        textWrap: "balance" as "balance",
        ...(isGuest ? { minHeight: "1.2em" } : {}),
      }}>
        {s.name}
      </h3>

      {/* Title — guest cards reserve 3 lines of vertical space for consistent alignment */}
      <p style={{
        position: "relative",
        zIndex: 2,
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        fontSize: "clamp(12.5px, 1vw, 14.5px)",
        fontWeight: 500,
        color: "rgba(255,255,255,0.7)",
        margin: 0,
        lineHeight: 1.4,
        textWrap: "balance" as "balance",
        ...(isGuest ? { minHeight: "4.2em" } : {}),
      }}>
        {s.title}
      </p>

      {/* Company logo — guest cards reserve a fixed 1-line block; BS/OS keep organic sizing */}
      <div style={{
        position: "relative",
        zIndex: 2,
        marginTop: 4,
        display: isGuest ? "flex" : "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.92,
        ...(isGuest ? { minHeight: 36 } : {}),
      }} aria-label={s.company}>
        {isHost ? (
          <BlackstoneLogomark size={28} />
        ) : isOs ? (
          <OutSystemsLogomark size={32} />
        ) : (
          <GuestLogomark name={s.company} size={16} />
        )}
      </div>

      {/* LinkedIn pin at bottom */}
      <span style={{
        position: "relative",
        zIndex: 2,
        marginTop: "auto",
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "6px 12px",
        borderRadius: 999,
        background: `rgba(255,255,255,0.04)`,
        border: `1px solid rgba(255,255,255,0.1)`,
        fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        fontSize: 11, fontWeight: 600,
        color: "rgba(255,255,255,0.62)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
      }} className="bs-speaker-linkedin">
        LinkedIn <span aria-hidden>↗</span>
      </span>
    </motion.a>
  );
}

function SpeakersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section id="speakers" ref={ref} style={{
      position: "relative",
      background: "transparent",
      padding: "clamp(60px, 7vw, 96px) 0",
      overflow: "hidden",
    }}>
      {/* ── Horizontal cyan stage-light band — cuts across the panel zone of the section ── */}
      <div aria-hidden style={{
        position: "absolute",
        top: "38%",
        left: 0, right: 0,
        height: "30%",
        background: `linear-gradient(180deg, transparent 0%, ${BS_CYAN}1f 30%, ${BS_CYAN}2a 50%, ${BS_CYAN}1f 70%, transparent 100%)`,
        filter: "blur(50px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Faint blue underwash ── */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: "-25%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        height: "55%",
        background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${BS_BLUE}22 0%, transparent 70%)`,
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Letterbox frame markers ── */}

      {/* ── Content ── */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1320, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 56px)",
      }}>
        {/* Centered section header — matches Takeaways rhythm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(18px, 2.2vw, 28px)",
            marginBottom: "clamp(36px, 4.5vw, 56px)",
            textAlign: "center",
          }}
        >
          {/* Glass-skeu eyebrow pill */}
          <span style={{
            position: "relative",
            display: "inline-flex", alignItems: "center", gap: 11,
            padding: "9px 18px 9px 14px",
            borderRadius: 999,
            background: `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.02) 100%)`,
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            border: `1px solid rgba(255,255,255,0.14)`,
            boxShadow: `
              0 1px 0 0 rgba(255,255,255,0.22) inset,
              0 0 0 1px ${BS_CYAN}1f inset,
              0 12px 28px rgba(0,0,0,0.32),
              0 0 24px ${BS_CYAN}22
            `,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.88)",
          }}>
            <span aria-hidden style={{
              position: "absolute",
              top: 1, left: "14%", right: "14%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)`,
              pointerEvents: "none",
            }} />
            <span aria-hidden style={{
              width: 9, height: 10,
              clipPath: "polygon(25% 5%, 75% 5%, 98% 50%, 75% 95%, 25% 95%, 2% 50%)",
              background: BS_CYAN,
              boxShadow: `0 0 8px ${BS_CYAN}`,
              flexShrink: 0,
            }} />
            Voices at the table
          </span>

          {/* Centered headline */}
          <h2 style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "clamp(34px, 4.6vw, 68px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: BS_WHITE,
            margin: 0,
            maxWidth: 900,
            textWrap: "balance" as "balance",
          }}>
            Speakers &{" "}
            <span style={{
              background: `linear-gradient(180deg, ${BS_CYAN} 0%, ${BS_LIGHT_BLUE} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 800,
            }}>panelists</span>
          </h2>

          {/* Supporting line */}
          <p style={{
            margin: 0,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "clamp(14px, 1.1vw, 17px)",
            fontWeight: 400,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.62)",
            maxWidth: 580,
            letterSpacing: "-0.003em",
          }}>
            A focused circle of voices from {BRAND_SPONSOR} and {BRAND_HOST} — moderating the conversation and bringing the field experience to the room.
          </p>
        </motion.div>

        {/* 4-card grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "clamp(18px, 2vw, 26px)",
        }} className="bs-speakers-grid">
          {SPEAKERS.map((s, i) => (
            <SpeakerCard key={s.name} s={s} idx={i} inView={inView} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .bs-speaker-card:hover {
          transform: translateY(-6px);
          border-color: var(--bs-card-border, rgba(255,255,255,0.22)) !important;
          box-shadow:
            0 1.5px 0 0 rgba(255,255,255,0.32) inset,
            0 -1.5px 0 0 rgba(0,0,0,0.26) inset,
            0 0 0 1px rgba(255,255,255,0.18) inset,
            0 1px 2px rgba(0,0,0,0.18) inset,
            0 32px 70px rgba(0,0,0,0.55),
            0 0 100px var(--bs-card-glow, rgba(0, 194, 255, 0.24)) !important;
        }
        .bs-speaker-card:hover .bs-speaker-sheen {
          transform: translateX(280%) rotate(8deg) !important;
        }
        .bs-speaker-card:hover .bs-speaker-linkedin {
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(255,255,255,0.18) !important;
          color: ${BS_WHITE} !important;
        }
        @media (max-width: 1080px) {
          .bs-speakers-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .bs-speakers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// AGENDA — 9 items
// ═════════════════════════════════════════════════════════════════════════════
// `kind` drives the card's visual treatment on the OutSystems-base cream surface:
//   - host    → Blackstone-led session (navy hex glyph + cyan tri-band under-stripe)
//   - os      → OutSystems-led session (red ring glyph + red hairlines + brackets)
//   - soft    → OS-attributed but lighter (welcome / closing) — softened red
//   - neutral → logistics / break — gray dot, minimal chrome
function agendaTypeStyle(type: AgendaItem["type"]): {
  label: string; color: string; kind: "host" | "os" | "soft" | "neutral";
} {
  switch (type) {
    case "keynote":
      return { label: "Keynote", color: OS_RED, kind: "os" };
    case "feature":
      return { label: "Featured · Host session", color: BS_NAVY, kind: "host" };
    case "panel":
      return { label: "Panel", color: OS_RED, kind: "os" };
    case "demo":
      return { label: "Live demo", color: OS_RED, kind: "os" };
    case "welcome":
      return { label: "Welcome", color: OS_RED, kind: "soft" };
    case "recognition":
      return { label: "Recognition", color: OS_RED, kind: "soft" };
    case "closing":
      return { label: "Closing", color: OS_RED, kind: "soft" };
    case "break":
      return { label: "Break", color: GRAY_500, kind: "neutral" };
    case "logistics":
    default:
      return { label: "Networking", color: GRAY_500, kind: "neutral" };
  }
}

// ─── Reusable: a column of agenda items grouped under a session label ───
function AgendaColumn({
  label,
  timeRange,
  items,
  inView,
  startDelay,
  accentColor,
}: {
  label: string;
  timeRange: string;
  items: AgendaItem[];
  inView: boolean;
  startDelay: number;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: startDelay, ease: EASE }}
      style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "clamp(14px, 1.6vw, 22px)",
      }}
    >
      {/* Column header — italic Cabin label in ink + small uppercase time range
          with an accent hairline. Same editorial vocabulary as Overview's lead. */}
      <div style={{
        display: "flex", flexDirection: "column",
        gap: 10,
        marginBottom: "clamp(8px, 1vh, 14px)",
      }}>
        <span style={{
          fontFamily: "var(--font-cabin), system-ui, sans-serif",
          fontStyle: "italic",
          fontSize: "clamp(30px, 3.6vw, 48px)",
          fontWeight: 500,
          color: INK,
          letterSpacing: "-0.025em",
          lineHeight: 1,
          textTransform: "lowercase",
          display: "inline-flex", alignItems: "baseline", gap: 8,
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: "var(--font-cabin), system-ui, sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: GRAY_500,
          display: "inline-flex", alignItems: "center", gap: 12,
          fontVariantNumeric: "tabular-nums",
        }}>
          <span aria-hidden style={{
            width: 28, height: 1,
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            boxShadow: `0 0 4px ${accentColor}44`,
          }} />
          {timeRange}
        </span>
      </div>

      {/* Stacked cards */}
      {items.map((item, i) => (
        <AgendaCard key={i} item={item} idx={i} inView={inView} columnDelay={startDelay} />
      ))}
    </motion.div>
  );
}

// ─── Reusable: a single agenda card (OutSystems-base light theme) ───
function AgendaCard({
  item,
  idx,
  inView,
  columnDelay,
}: {
  item: AgendaItem;
  idx: number;
  inView: boolean;
  columnDelay: number;
}) {
  const type = agendaTypeStyle(item.type);
  const isHost = type.kind === "host";       // Blackstone-led — navy + cyan flourish
  const isOS = type.kind === "os";           // OutSystems-led — full red treatment
  const isSoft = type.kind === "soft";       // OS-attributed but lighter (welcome / closing)
  const isNeutral = type.kind === "neutral"; // logistics / break — gray, minimal

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: columnDelay + 0.15 + idx * 0.06, ease: EASE }}
      className="bs-agenda-card"
      style={{
        position: "relative",
        padding: isNeutral
          ? "clamp(14px, 1.4vw, 18px) clamp(16px, 1.6vw, 22px)"
          : "clamp(18px, 1.8vw, 24px) clamp(20px, 2vw, 26px)",
        borderRadius: 14,
        background: BS_WHITE,
        border: `1px solid ${isNeutral ? GRAY_300 : `${type.color}33`}`,
        boxShadow: isNeutral
          ? `0 1px 0 0 rgba(255,255,255,1) inset, 0 1px 2px rgba(14,14,16,0.03)`
          : `
              0 1px 0 0 rgba(255,255,255,1) inset,
              0 1px 3px rgba(14,14,16,0.04),
              0 12px 28px rgba(14,14,16,0.06),
              0 0 28px ${type.color}10
            `,
        overflow: "hidden",
        transition: "transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
        display: "flex",
        flexDirection: "column",
        gap: isNeutral ? 6 : 10,
      }}
    >
      {/* Top hairline — colored for accented items, very faint for neutral */}
      {!isNeutral && (
        <span aria-hidden style={{
          position: "absolute", top: 0, left: "8%", right: "8%",
          height: isOS ? 2 : 1.5,
          background: `linear-gradient(90deg, transparent 0%, ${type.color} 50%, transparent 100%)`,
          boxShadow: `0 0 8px ${type.color}44`,
          pointerEvents: "none",
        }} />
      )}

      {/* Host tri-band Blackstone signature: navy → cyan → navy under-stripe */}
      {isHost && (
        <span aria-hidden style={{
          position: "absolute", top: 4, left: "22%", right: "22%",
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${BS_NAVY}66 25%, ${BS_CYAN}88 50%, ${BS_NAVY}66 75%, transparent 100%)`,
          pointerEvents: "none",
        }} />
      )}

      {/* Corner brackets — only on host / OS cards (skipped for soft and neutral) */}
      {(isHost || isOS) && [
        { top: 10, left: 10, borderTop: true, borderLeft: true },
        { top: 10, right: 10, borderTop: true, borderRight: true },
      ].map((pos, i) => (
        <span key={i} aria-hidden style={{
          position: "absolute",
          ...pos,
          width: 9, height: 9,
          borderTop: pos.borderTop ? `1.5px solid ${type.color}55` : undefined,
          borderLeft: pos.borderLeft ? `1.5px solid ${type.color}55` : undefined,
          borderRight: pos.borderRight ? `1.5px solid ${type.color}55` : undefined,
          pointerEvents: "none",
        }} />
      ))}

      {/* Top row: glyph bullet (hex/ring/dot) + time range + type pill */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {/* Glyph chooses brand: hex for host, ring for OS, dot for neutral */}
        <span aria-hidden style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 16, height: 16,
          flexShrink: 0,
        }}>
          {isHost ? (
            <BlackstoneHex size={14} color={BS_NAVY} strokeWidth={2.2} />
          ) : (isOS || isSoft) ? (
            <OutSystemsRing size={14} color={type.color} strokeWidth={2.4} />
          ) : (
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: type.color, opacity: 0.6,
            }} />
          )}
        </span>
        <span style={{
          fontFamily: "var(--font-cabin), system-ui, sans-serif",
          fontSize: isNeutral ? "clamp(12.5px, 1vw, 14px)" : "clamp(13px, 1.05vw, 15px)",
          fontWeight: 700,
          color: isNeutral ? GRAY_500 : INK,
          letterSpacing: "-0.005em",
          fontVariantNumeric: "tabular-nums",
        }}>
          {item.start} <span style={{ color: GRAY_300, fontWeight: 500 }}>–</span> {item.end}
        </span>
        <span style={{
          marginLeft: "auto",
          fontFamily: "var(--font-cabin), system-ui, sans-serif",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: type.color,
          padding: isNeutral ? "3px 8px" : "3.5px 10px",
          borderRadius: 999,
          background: isNeutral
            ? "transparent"
            : isHost
              ? `linear-gradient(180deg, ${BS_CYAN}1a 0%, ${BS_NAVY}0a 100%)`
              : `linear-gradient(180deg, ${type.color}14 0%, ${type.color}05 100%)`,
          border: isNeutral
            ? `1px solid ${GRAY_300}`
            : `1px solid ${type.color}44`,
          boxShadow: isNeutral
            ? "none"
            : isHost
              ? `0 1px 0 0 rgba(255,255,255,0.8) inset, 0 0 10px ${BS_CYAN}33`
              : `0 1px 0 0 rgba(255,255,255,0.8) inset, 0 0 8px ${type.color}22`,
        }}>
          {type.label}
        </span>
      </div>

      {/* Title — Cabin, ink (smaller for neutral logistics rows) */}
      <h3 style={{
        fontFamily: "var(--font-cabin), system-ui, sans-serif",
        fontSize: isNeutral
          ? "clamp(14px, 1.1vw, 16px)"
          : "clamp(16px, 1.4vw, 20px)",
        fontWeight: isNeutral ? 600 : 700,
        color: isNeutral ? GRAY_700 : INK,
        margin: 0,
        letterSpacing: "-0.018em",
        lineHeight: 1.25,
        textWrap: "balance" as "balance",
      }}>
        {item.title}
      </h3>

      {/* Subtitle — italic Cabin, GRAY_700 */}
      {item.subtitle && (
        <p style={{
          fontFamily: "var(--font-cabin), system-ui, sans-serif",
          fontStyle: "italic",
          fontSize: "clamp(13px, 1.05vw, 15.5px)",
          fontWeight: 400,
          color: GRAY_700,
          margin: 0,
          lineHeight: 1.45,
          letterSpacing: "-0.005em",
        }}>
          {item.subtitle}
        </p>
      )}

      {/* Owner — Noto Sans body line with a tinted bullet */}
      {item.owner && (
        <p style={{
          margin: 0,
          display: "inline-flex", alignItems: "center", gap: 9,
          fontFamily: "var(--font-noto-sans), system-ui, sans-serif",
          fontSize: "clamp(11.5px, 0.9vw, 13px)",
          fontWeight: 500,
          color: GRAY_500,
          lineHeight: 1.45,
        }}>
          <span aria-hidden style={{
            width: 5, height: 5, borderRadius: "50%",
            background: type.color,
            boxShadow: `0 0 0 2px ${type.color}1f`,
            flexShrink: 0,
            opacity: isNeutral ? 0.6 : 1,
          }} />
          {item.owner}
        </p>
      )}
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PROGRAMME CANVAS — single shared atmosphere wrapping BOTH the Agenda
// and the About section ("Behind the table") as one
// continuous canvas. Mirrors the JourneyCanvas pattern at the top of the page:
// ambient washes, hex sculptures, central chapter-divider hex, and ring
// micropattern live on this wrapper, so the boundary between the two
// content blocks disappears.
// ═════════════════════════════════════════════════════════════════════════════
function ProgrammeCanvas() {
  return (
    <section style={{
      position: "relative",
      background: BS_WHITE,
      // Outer breathing room — inner sections carry only small seam buffers.
      padding: "clamp(72px, 9vw, 120px) 0 clamp(72px, 9vw, 120px)",
      overflow: "hidden",
    }}>
      {/* ── Cool gradient wash — matches the hero direction: Blackstone-leaning
            tones, white diagonal silver-blue base + cyan glow upper-left + navy
            hint lower-right + light-blue accent upper-right. Atmosphere only,
            no decorative chrome (no hex sculptures, no ring micropattern). ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 55% 40% at 6% 8%, ${BS_CYAN}26 0%, ${BS_CYAN}0d 38%, transparent 72%),
          radial-gradient(ellipse 50% 38% at 96% 94%, ${BS_NAVY}1f 0%, ${BS_NAVY}08 36%, transparent 68%),
          radial-gradient(ellipse 40% 30% at 92% 10%, ${BS_LIGHT_BLUE}14 0%, transparent 65%),
          linear-gradient(165deg, ${BS_WHITE} 0%, #F4F8FC 50%, #E8F0F8 100%)
        `,
      }} />

      {/* ── Content: the two sections stacked, both with transparent backgrounds ── */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <AgendaSection />
        <AboutSection />
      </div>
    </section>
  );
}

function AgendaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  // ── Split by time of day. Items at/after 12:00 → afternoon. ──
  const morningItems = AGENDA.filter((item) => {
    const [h] = item.start.split(":").map(Number);
    return h < 12;
  });
  const afternoonItems = AGENDA.filter((item) => {
    const [h] = item.start.split(":").map(Number);
    return h >= 12;
  });

  return (
    <section id="agenda" ref={ref} style={{
      position: "relative",
      background: "transparent",
      // Only a small bottom buffer — outer rhythm and shared atmosphere are
      // provided by <ProgrammeCanvas>, the parent that wraps this section
      // together with About as one continuous canvas.
      padding: "0 0 clamp(40px, 5vw, 60px)",
      overflow: "visible",
    }}>
      {/* (No ambient overlays here — ProgrammeCanvas paints the shared atmosphere.) */}

      {/* ── Content ── */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1320, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 56px)",
      }}>
        {/* ─── Left-anchored section header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "clamp(18px, 2.2vw, 28px)",
            marginBottom: "clamp(40px, 5vw, 64px)",
            maxWidth: 820,
          }}
        >
          {/* Eyebrow — white pill with red specular under-rim (matches JourneyCanvas vocabulary) */}
          <span style={{
            position: "relative",
            display: "inline-flex", alignItems: "center", gap: 11,
            padding: "9px 18px 9px 14px",
            borderRadius: 999,
            background: `linear-gradient(180deg, ${BS_WHITE} 0%, #FAF7F4 100%)`,
            border: `1px solid ${GRAY_300}`,
            boxShadow: `
              0 1px 0 0 rgba(255,255,255,1) inset,
              0 -1px 0 0 ${OS_RED}1a inset,
              0 4px 12px rgba(14,14,16,0.05),
              0 0 24px ${OS_RED}14
            `,
            fontFamily: "var(--font-cabin), system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: CHARCOAL,
          }}>
            <span aria-hidden style={{
              position: "absolute",
              top: 1, left: "16%", right: "16%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,1) 50%, transparent 100%)`,
              pointerEvents: "none",
            }} />
            <OutSystemsRing size={11} color={OS_RED} strokeWidth={2.4} />
            <BlackstoneHex size={10} color={BS_NAVY} strokeWidth={2} />
            Agenda · 24 June 2026
          </span>

          <h2 style={{
            fontFamily: "var(--font-cabin), system-ui, sans-serif",
            fontSize: "clamp(34px, 4.6vw, 68px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.04,
            color: INK,
            margin: 0,
            textWrap: "balance" as "balance",
          }}>
            A focused morning{" "}
            <span style={{ color: OS_RED, fontWeight: 700 }}>
              Lunch to keep talking
            </span>
          </h2>

          <p style={{
            margin: 0,
            fontFamily: "var(--font-noto-sans), system-ui, sans-serif",
            fontSize: "clamp(15px, 1.15vw, 17px)",
            fontWeight: 400,
            lineHeight: 1.6,
            color: GRAY_700,
            maxWidth: 660,
            letterSpacing: "-0.003em",
          }}>
            10:00–14:20 AST · Fairmont Riyadh. Two substantive talks, a working demo and a panel — then we sit down together over lunch.
          </p>
        </motion.div>

        {/* ─── Morning + Afternoon split layout ─── */}
        <div style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(36px, 4.5vw, 72px)",
          alignItems: "start",
        }} className="bs-agenda-grid">
          {/* Vertical OS_RED divider hairline between morning + afternoon, with
              a small navy nub at center as the dual-brand seam marker. */}
          <div aria-hidden className="bs-agenda-divider" style={{
            position: "absolute",
            top: "20px",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 1,
            background: `linear-gradient(180deg, transparent 0%, ${OS_RED}55 12%, ${OS_RED}55 88%, transparent 100%)`,
            boxShadow: `0 0 10px ${OS_RED}33`,
            pointerEvents: "none",
          }} />
          {/* Centre seam marker — small hex glyph stamping the divider mid-point */}
          <span aria-hidden className="bs-agenda-divider" style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 22, height: 22,
            background: CREAM,
            borderRadius: "50%",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
            boxShadow: `0 0 0 1px ${OS_RED}22, 0 4px 10px rgba(14,14,16,0.06)`,
          }}>
            <BlackstoneHex size={11} color={BS_NAVY} strokeWidth={2.2} />
          </span>

          {/* ── LEFT: Morning column (OutSystems-led majority) ── */}
          <AgendaColumn
            label="Morning"
            timeRange="10:00 – 12:00"
            items={morningItems}
            inView={inView}
            startDelay={0.15}
            accentColor={OS_RED}
          />

          {/* ── RIGHT: Afternoon column (mixed sessions, panel + closing) ── */}
          <AgendaColumn
            label="Afternoon"
            timeRange="12:00 – 14:20"
            items={afternoonItems}
            inView={inView}
            startDelay={0.4}
            accentColor={OS_RED}
          />
        </div>
      </div>

      <style jsx global>{`
        .bs-agenda-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 1px 0 0 rgba(255,255,255,1) inset,
            0 1px 3px rgba(14,14,16,0.04),
            0 18px 40px rgba(14,14,16,0.08),
            0 0 40px ${OS_RED}1a !important;
        }
        @media (max-width: 880px) {
          .bs-agenda-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(36px, 6vw, 56px) !important;
          }
          .bs-agenda-divider {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ABOUT — Blackstone eIT + OutSystems
// ═════════════════════════════════════════════════════════════════════════════
function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  const HEX_CLIP = "polygon(25% 5%, 75% 5%, 98% 50%, 75% 95%, 25% 95%, 2% 50%)";

  const HOST_BODY: string[] = [
    `${BRAND_HOST} is an SI and ISV leader providing innovative customized technology solutions to help our customers become digital-first, data-informed, and AI-enabled companies.`,
    `Headquartered in Seattle, with a regional headquarter in the UAE and six global offices, the company is an established strategic partner to public sector organizations and private enterprises, helping them navigate the complexities of an increasingly digital and AI-driven technology landscape.`,
    `${BRAND_HOST} is a trusted partner to more than 1,000 enterprises across diverse industries and over 50 government entities. We build resilient, AI-ready infrastructure across cloud, private cloud, and on-premises environments; establish trusted and scalable data foundations, and deliver intelligent applications and AI-augmented workflows that enhance agility and drive measurable business outcomes.`,
  ];
  const SPONSOR_BODY: string[] = [
    `${BRAND_SPONSOR} is a leading AI Development Platform built for the enterprise. Global organizations trust ${BRAND_SPONSOR} to rapidly build mission-critical apps and agents, modernize legacy processes with agentic systems, and govern their entire AI portfolio across complex regulatory environments, all on a unified platform.`,
    `${BRAND_SPONSOR} is consistently recognized as a leader in enterprise software development by Gartner, IDC, and Forrester, and ranked #1 in Customer Satisfaction by users on G2. Business leaders, IT executives and developers choose ${BRAND_SPONSOR} to accelerate internal innovation without compromising reliability and security.`,
    `The ${BRAND_SPONSOR} ecosystem includes more than 85 million end users, over 600 partners, and thousands of active customers in 75+ countries across 20+ industries.`,
  ];

  return (
    <section id="about" ref={ref} style={{
      position: "relative",
      background: "transparent",
      // Only a small top buffer — outer rhythm and shared atmosphere are
      // provided by <ProgrammeCanvas>, the parent that wraps Agenda and this
      // section together as one continuous canvas.
      padding: "clamp(40px, 5vw, 60px) 0 0",
      overflow: "visible",
    }}>
      {/* (No ambient overlays here — ProgrammeCanvas paints the shared atmosphere.) */}

      {/* ── Content ── */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1320, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 56px)",
      }}>
        {/* Centered section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(18px, 2.2vw, 28px)",
            marginBottom: "clamp(40px, 5vw, 64px)",
            textAlign: "center",
          }}
        >
          {/* Eyebrow — white pill, OS ring + Blackstone hex glyphs (JourneyCanvas vocab) */}
          <span style={{
            position: "relative",
            display: "inline-flex", alignItems: "center", gap: 11,
            padding: "9px 18px 9px 14px",
            borderRadius: 999,
            background: `linear-gradient(180deg, ${BS_WHITE} 0%, #FAF7F4 100%)`,
            border: `1px solid ${GRAY_300}`,
            boxShadow: `
              0 1px 0 0 rgba(255,255,255,1) inset,
              0 -1px 0 0 ${OS_RED}1a inset,
              0 4px 12px rgba(14,14,16,0.05),
              0 0 24px ${OS_RED}14
            `,
            fontFamily: "var(--font-cabin), system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: CHARCOAL,
          }}>
            <span aria-hidden style={{
              position: "absolute",
              top: 1, left: "16%", right: "16%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,1) 50%, transparent 100%)`,
              pointerEvents: "none",
            }} />
            <OutSystemsRing size={11} color={OS_RED} strokeWidth={2.4} />
            <BlackstoneHex size={10} color={BS_NAVY} strokeWidth={2} />
            Behind the table
          </span>

          {/* Headline — Cabin, ink, solid OS red on "the hosts." */}
          <h2 style={{
            fontFamily: "var(--font-cabin), system-ui, sans-serif",
            fontSize: "clamp(34px, 4.6vw, 68px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: INK,
            margin: 0,
            maxWidth: 900,
            textWrap: "balance" as "balance",
          }}>
            About{" "}
            <span style={{ color: OS_RED, fontWeight: 700 }}>
              the hosts
            </span>
          </h2>

          {/* Supporting line — Noto Sans, GRAY_700 */}
          <p style={{
            margin: 0,
            fontFamily: "var(--font-noto-sans), system-ui, sans-serif",
            fontSize: "clamp(15px, 1.15vw, 17px)",
            fontWeight: 400,
            lineHeight: 1.6,
            color: GRAY_700,
            maxWidth: 640,
            letterSpacing: "-0.003em",
          }}>
            Two organisations convening this morning — one powering the AI-era platform across the Kingdom, the other making transformation real.
          </p>
        </motion.div>

        {/* 2-column host grid — left card is Blackstone (kept as dark glass per user
            direction), right card is OutSystems (white card, OS-led treatment).
            The visual asymmetry is deliberate: each house keeps its own surface. */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(22px, 2.6vw, 36px)",
        }} className="bs-about-grid">

          {/* ─── RIGHT (was LEFT): Blackstone eIT — translucent cyan-tinted glass card.
                Rendered visually on the right via CSS `order` so OutSystems takes
                the left "hosted by" slot. Kept in JSX order for legibility. ─── */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            className="bs-about-card bs-about-card-host"
            style={{
              position: "relative",
              padding: "clamp(32px, 3vw, 48px)",
              borderRadius: 20,
              background: `
                radial-gradient(ellipse 80% 60% at 22% 8%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 28%, transparent 55%),
                radial-gradient(ellipse 70% 50% at 80% 100%, ${BS_CYAN}1f 0%, transparent 55%),
                linear-gradient(168deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 45%, rgba(0,0,0,0.18) 100%)
              `,
              backdropFilter: "blur(30px) saturate(180%) brightness(1.06)",
              WebkitBackdropFilter: "blur(30px) saturate(180%) brightness(1.06)",
              border: `1px solid rgba(255,255,255,0.14)`,
              boxShadow: `
                0 1.5px 0 0 rgba(255,255,255,0.28) inset,
                0 -1.5px 0 0 rgba(0,0,0,0.24) inset,
                0 0 0 1px ${BS_CYAN}1f inset,
                0 1px 2px rgba(0,0,0,0.18) inset,
                0 24px 56px rgba(0,0,0,0.5),
                0 0 80px ${BS_CYAN}1f
              `,
              display: "flex",
              flexDirection: "column",
              gap: "clamp(20px, 2.2vw, 28px)",
              overflow: "hidden",
              transition: "transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            {/* Top hairline — cyan accent */}
            <span aria-hidden style={{
              position: "absolute", top: 0, left: "8%", right: "8%", height: 1.5,
              background: `linear-gradient(90deg, transparent 0%, ${BS_CYAN} 50%, transparent 100%)`,
              pointerEvents: "none", zIndex: 3,
            }} />
            {/* Specular highlight */}
            <span aria-hidden style={{
              position: "absolute", top: 1.5, left: "20%", right: "20%", height: 1,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)`,
              pointerEvents: "none", zIndex: 3,
            }} />
            {/* Bottom-edge dark seal */}
            <span aria-hidden style={{
              position: "absolute", bottom: 0, left: "12%", right: "12%", height: 1,
              background: `linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 50%, transparent 100%)`,
              pointerEvents: "none", zIndex: 3,
            }} />

            {/* Cinematic corner brackets — cyan */}
            {[
              { top: 14, left: 14, borderTop: true, borderLeft: true },
              { top: 14, right: 14, borderTop: true, borderRight: true },
              { bottom: 14, left: 14, borderBottom: true, borderLeft: true },
              { bottom: 14, right: 14, borderBottom: true, borderRight: true },
            ].map((pos, idx) => (
              <span key={idx} aria-hidden style={{
                position: "absolute",
                ...pos,
                width: 14, height: 14,
                borderTop: pos.borderTop ? `1.5px solid ${BS_CYAN}aa` : undefined,
                borderBottom: pos.borderBottom ? `1.5px solid ${BS_CYAN}aa` : undefined,
                borderLeft: pos.borderLeft ? `1.5px solid ${BS_CYAN}aa` : undefined,
                borderRight: pos.borderRight ? `1.5px solid ${BS_CYAN}aa` : undefined,
                pointerEvents: "none", zIndex: 3,
              }} />
            ))}

            {/* Editorial label — italic serif, cyan */}
            <span style={{
              position: "relative", zIndex: 2,
              fontFamily: "Georgia, 'Cambria', 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: "clamp(15px, 1.2vw, 18px)",
              fontWeight: 400,
              color: BS_CYAN,
              letterSpacing: "0.04em",
              display: "inline-flex", alignItems: "center", gap: 12,
            }}>
              <span aria-hidden style={{ width: 18, height: 1, background: `linear-gradient(90deg, transparent, ${BS_CYAN})` }} />
              with
            </span>

            {/* Logo — dark Blackstone variant (CMYK) for readability on the
                translucent surface sitting over the cream page. */}
            <div style={{
              position: "relative", zIndex: 2,
              display: "inline-flex",
              alignItems: "center",
              minHeight: 68,
            }}>
              <BlackstoneLogomark size={48} dark />
            </div>

            {/* Body — navy/charcoal for legibility on translucent glass */}
            <div style={{
              position: "relative", zIndex: 2,
              display: "flex", flexDirection: "column",
              gap: "clamp(12px, 1vw, 16px)",
            }}>
              {HOST_BODY.map((para, i) => (
                <p key={i} style={{
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                  fontSize: "clamp(14.5px, 1.1vw, 16.5px)",
                  lineHeight: 1.7,
                  color: BS_NAVY,
                  margin: 0,
                  letterSpacing: "-0.003em",
                }}>
                  {para}
                </p>
              ))}
            </div>

            {/* Visit website — glass-skeu cyan CTA pill (navy text for readability) */}
            <a
              href="https://blackstoneeit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bs-about-cta bs-about-cta-host"
              style={{
                position: "relative", zIndex: 2,
                marginTop: "auto",
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "10px 18px",
                borderRadius: 999,
                background: `linear-gradient(180deg, ${BS_CYAN}33 0%, ${BS_CYAN}14 100%)`,
                border: `1px solid ${BS_CYAN}99`,
                boxShadow: `
                  0 1px 0 0 rgba(255,255,255,0.4) inset,
                  0 0 16px ${BS_CYAN}33
                `,
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: BS_NAVY,
                textDecoration: "none",
                transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
              }}
            >
              Visit website
              <span aria-hidden style={{ fontSize: 14, marginTop: -1 }}>↗</span>
            </a>
          </motion.div>

          {/* ─── LEFT (was RIGHT): OutSystems — white card, now the primary
                "hosted by" position. Promoted to first via CSS `order`. ─── */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="bs-about-card bs-about-card-sponsor"
            style={{
              position: "relative",
              padding: "clamp(32px, 3vw, 48px)",
              borderRadius: 20,
              // Layered red-tinted gradient surface — mirrors the Blackstone
              // card's compositional vocabulary (corner light highlight + brand
              // tint radial + diagonal base) but in the OS_RED palette on a
              // light surface so it stays OS-faithful, not dark glass.
              background: `
                radial-gradient(ellipse 80% 60% at 22% 8%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 28%, transparent 60%),
                radial-gradient(ellipse 70% 55% at 85% 100%, ${OS_RED}1f 0%, ${OS_RED}08 35%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 100% 0%, ${OS_RED}14 0%, transparent 55%),
                linear-gradient(168deg, ${BS_WHITE} 0%, #FFF8F5 45%, #FBEFE9 100%)
              `,
              border: `1px solid ${OS_RED}33`,
              boxShadow: `
                0 1.5px 0 0 rgba(255,255,255,1) inset,
                0 -1.5px 0 0 ${OS_RED}1a inset,
                0 0 0 1px ${OS_RED}1a inset,
                0 1px 3px rgba(14,14,16,0.04),
                0 24px 56px rgba(14,14,16,0.08),
                0 0 80px ${OS_RED}22
              `,
              display: "flex",
              flexDirection: "column",
              gap: "clamp(20px, 2.2vw, 28px)",
              overflow: "hidden",
              transition: "transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            {/* Top hairline — OS_RED, signature */}
            <span aria-hidden style={{
              position: "absolute",
              top: 0, left: "8%", right: "8%", height: 2,
              background: `linear-gradient(90deg, transparent 0%, ${OS_RED} 50%, transparent 100%)`,
              boxShadow: `0 0 10px ${OS_RED}55`,
              pointerEvents: "none",
              zIndex: 3,
            }} />

            {/* Cinematic corner brackets — red */}
            {[
              { top: 14, left: 14, borderTop: true, borderLeft: true },
              { top: 14, right: 14, borderTop: true, borderRight: true },
              { bottom: 14, left: 14, borderBottom: true, borderLeft: true },
              { bottom: 14, right: 14, borderBottom: true, borderRight: true },
            ].map((pos, idx) => (
              <span key={idx} aria-hidden style={{
                position: "absolute",
                ...pos,
                width: 14, height: 14,
                borderTop: pos.borderTop ? `1.5px solid ${OS_RED}66` : undefined,
                borderBottom: pos.borderBottom ? `1.5px solid ${OS_RED}66` : undefined,
                borderLeft: pos.borderLeft ? `1.5px solid ${OS_RED}66` : undefined,
                borderRight: pos.borderRight ? `1.5px solid ${OS_RED}66` : undefined,
                pointerEvents: "none",
                zIndex: 3,
              }} />
            ))}

            {/* OS publisher's mark — small ring stamp at top-right, mirrors the
                Blackstone hex seal on the Overview body card. */}
            <span aria-hidden style={{
              position: "absolute",
              top: 18, right: 38,
              width: 32, height: 32,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              opacity: 0.85,
              zIndex: 3,
            }}>
              <span style={{
                position: "absolute", inset: 0,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${OS_RED}1f 0%, transparent 65%)`,
                filter: "blur(4px)",
              }} />
              <OutSystemsRing size={20} color={OS_RED} strokeWidth={2.4} />
            </span>

            {/* Editorial label — italic Cabin, OS_RED */}
            <span style={{
              position: "relative", zIndex: 2,
              fontFamily: "var(--font-cabin), system-ui, sans-serif",
              fontStyle: "italic",
              fontSize: "clamp(15px, 1.2vw, 18px)",
              fontWeight: 500,
              color: OS_RED,
              letterSpacing: "0.02em",
              display: "inline-flex", alignItems: "center", gap: 12,
            }}>
              <span aria-hidden style={{ width: 22, height: 1, background: `linear-gradient(90deg, transparent, ${OS_RED})` }} />
              hosted by
            </span>

            {/* Logo — DARK OutSystems variant (red ring + dark wordmark) for cream surface */}
            <div style={{
              position: "relative", zIndex: 2,
              display: "inline-flex",
              alignItems: "center",
              minHeight: 68,
            }}>
              <OutSystemsLogomark size={52} dark />
            </div>

            {/* Body — Noto Sans, INK */}
            <div style={{
              position: "relative", zIndex: 2,
              display: "flex", flexDirection: "column",
              gap: "clamp(12px, 1vw, 16px)",
            }}>
              {SPONSOR_BODY.map((para, i) => (
                <p key={i} style={{
                  fontFamily: "var(--font-noto-sans), system-ui, sans-serif",
                  fontSize: "clamp(14.5px, 1.1vw, 16.5px)",
                  lineHeight: 1.7,
                  color: GRAY_700,
                  margin: 0,
                  letterSpacing: "-0.003em",
                }}>
                  {para}
                </p>
              ))}
            </div>

            {/* Visit website — flat solid OS_RED button (matches hero CTA) */}
            <a
              href="https://www.outsystems.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bs-about-cta bs-about-cta-sponsor"
              style={{
                position: "relative", zIndex: 2,
                marginTop: "auto",
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "12px 22px",
                borderRadius: 999,
                background: OS_RED,
                border: `1px solid ${OS_RED}`,
                boxShadow: `
                  0 1px 0 0 rgba(255,255,255,0.18) inset,
                  0 8px 18px ${OS_RED}33,
                  0 0 0 1px ${OS_RED}55
                `,
                fontFamily: "var(--font-cabin), system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: BS_WHITE,
                textDecoration: "none",
                transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
              }}
            >
              Visit website
              <span aria-hidden style={{ fontSize: 14, marginTop: -1 }}>↗</span>
            </a>
          </motion.div>

        </div>
      </div>

      <style jsx global>{`
        /* Visual order: OutSystems (sponsor) renders on the left as the
           "hosted by", Blackstone (host classnames preserved) on the right
           as the "with" partner. Works for both the 2-col grid and the
           stacked mobile layout. */
        .bs-about-grid .bs-about-card-sponsor { order: 0; }
        .bs-about-grid .bs-about-card-host { order: 1; }

        .bs-about-card-host:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.22) !important;
          box-shadow:
            0 1.5px 0 0 rgba(255,255,255,0.32) inset,
            0 -1.5px 0 0 rgba(0,0,0,0.26) inset,
            0 0 0 1px rgba(255,255,255,0.18) inset,
            0 1px 2px rgba(0,0,0,0.18) inset,
            0 32px 70px rgba(0,0,0,0.55),
            0 0 100px ${BS_CYAN}3d !important;
        }
        .bs-about-card-sponsor:hover {
          transform: translateY(-6px);
          border-color: ${OS_RED}55 !important;
          box-shadow:
            0 1px 0 0 rgba(255,255,255,1) inset,
            0 1px 3px rgba(14,14,16,0.04),
            0 32px 70px rgba(14,14,16,0.10),
            0 0 80px ${OS_RED}22 !important;
        }
        .bs-about-cta-host:hover {
          transform: translateY(-1px);
          background: linear-gradient(180deg, ${BS_CYAN}3d 0%, ${BS_CYAN}14 100%) !important;
        }
        .bs-about-cta-sponsor:hover {
          transform: translateY(-1px);
          background: ${OS_RED_DARK} !important;
        }
        @media (max-width: 880px) {
          .bs-about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// REGISTER — Request invitation form
// ═════════════════════════════════════════════════════════════════════════════
function RegisterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [countryCode, setCountryCode] = useState("+966");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim()) return setErrorMsg("Please enter your full name."), setStatus("error");
    if (!email.trim() || !isWorkEmail(email)) {
      return setErrorMsg("Please use your work email."), setStatus("error");
    }
    if (!jobTitle.trim()) return setErrorMsg("Please enter your job title."), setStatus("error");
    if (!company.trim()) return setErrorMsg("Please enter your organisation."), setStatus("error");

    if (!phone.trim()) {
      return setErrorMsg(`Please enter your phone number (${selectedCountry.length} digits).`), setStatus("error");
    }
    const phoneError = validatePhone(phone, selectedCountry);
    if (phoneError) return setErrorMsg(phoneError), setStatus("error");

    setStatus("submitting");
    const result = await submitForm({
      type: "attend",
      full_name: fullName.trim(),
      email: email.trim(),
      job_title: jobTitle.trim(),
      company: company.trim(),
      phone: `${countryCode} ${phone.trim()}`,
      event_name: "Executive Roundtable Riyadh — Blackstone eIT × OutSystems · 24 June 2026",
      website,
      metadata: notes.trim() ? { notes: notes.trim() } : undefined,
    });

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Something went wrong. Please try again.");
    }
  };

  const HEX_CLIP = "polygon(25% 5%, 75% 5%, 98% 50%, 75% 95%, 25% 95%, 2% 50%)";

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    background: `rgba(0, 0, 0, 0.35)`,
    border: `1px solid rgba(255, 255, 255, 0.12)`,
    borderRadius: 10,
    color: BS_WHITE,
    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
    fontSize: 14,
    fontWeight: 500,
    outline: "none",
    transition: "border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
    fontSize: 10.5, fontWeight: 700,
    letterSpacing: "0.22em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
    marginBottom: 8,
    display: "block",
  };

  return (
    <section id="register" ref={ref} style={{
      position: "relative",
      background: "transparent",
      padding: "clamp(60px, 7vw, 96px) 0",
      overflow: "hidden",
    }}>
      {/* ── Atmospheric: cool cyan ambient on the LEFT (header column) + brighter spotlight on the RIGHT (form) ── */}
      <div aria-hidden style={{
        position: "absolute",
        top: "-15%", left: "-10%",
        width: "55%", height: "100%",
        background: `radial-gradient(ellipse 45% 50% at 50% 50%, ${BS_CYAN}26 0%, ${BS_CYAN}0a 35%, transparent 65%)`,
        filter: "blur(70px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <div aria-hidden style={{
        position: "absolute",
        top: "-15%", right: "-10%",
        width: "55%", height: "120%",
        background: `radial-gradient(ellipse 40% 50% at 50% 50%, ${BS_CYAN}40 0%, ${BS_BLUE}1a 40%, transparent 65%)`,
        filter: "blur(70px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Faint blue floor wash ── */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: "-30%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        height: "50%",
        background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${BS_BLUE}1f 0%, transparent 70%)`,
        filter: "blur(70px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── Letterbox frame markers ── */}

      {/* ── Split content ── */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1320, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 56px)",
        display: "grid",
        gridTemplateColumns: "0.85fr 1.15fr",
        gap: "clamp(40px, 5vw, 80px)",
        alignItems: "start",
      }} className="bs-register-grid">

        {/* ─── LEFT: sticky pitch column ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          className="bs-register-left"
          style={{
            position: "sticky",
            top: "clamp(96px, 12vh, 130px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "clamp(20px, 2.4vw, 30px)",
          }}
        >
          {/* Glass-skeu eyebrow pill */}
          <span style={{
            position: "relative",
            display: "inline-flex", alignItems: "center", gap: 11,
            padding: "9px 18px 9px 14px",
            borderRadius: 999,
            background: `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.02) 100%)`,
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            border: `1px solid rgba(255,255,255,0.14)`,
            boxShadow: `
              0 1px 0 0 rgba(255,255,255,0.22) inset,
              0 0 0 1px ${BS_CYAN}1f inset,
              0 12px 28px rgba(0,0,0,0.32),
              0 0 24px ${BS_CYAN}22
            `,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.88)",
          }}>
            <span aria-hidden style={{
              position: "absolute",
              top: 1, left: "14%", right: "14%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)`,
              pointerEvents: "none",
            }} />
            <span aria-hidden style={{
              width: 9, height: 10,
              clipPath: HEX_CLIP,
              background: BS_CYAN,
              boxShadow: `0 0 8px ${BS_CYAN}`,
              flexShrink: 0,
            }} />
            Request invitation
          </span>

          {/* Headline */}
          <h2 style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "clamp(30px, 4vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: BS_WHITE,
            margin: 0,
            textWrap: "balance" as "balance",
          }}>
            A seat at the table is by{" "}
            <span style={{
              background: `linear-gradient(180deg, ${BS_CYAN} 0%, ${BS_LIGHT_BLUE} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 800,
            }}>invitation only</span>
          </h2>

          {/* Italic Georgia editorial lead */}
          <p style={{
            fontFamily: "Georgia, 'Cambria', 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: "clamp(15px, 1.25vw, 19px)",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.86)",
            margin: 0,
            paddingLeft: "clamp(16px, 1.4vw, 22px)",
            borderLeft: `2px solid ${BS_CYAN}77`,
            maxWidth: 440,
          }}>
            Tell us a little about your role — we&apos;ll follow up personally.
          </p>

          {/* Body */}
          <p style={{
            margin: 0,
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontSize: "clamp(14px, 1.1vw, 16px)",
            fontWeight: 400,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.68)",
            maxWidth: 440,
          }}>
            Every request is reviewed to keep the room intimate — typically 15–20 senior IT executives from Saudi public-sector entities.
          </p>

        </motion.div>

        {/* ─── RIGHT: form (or success state) ─── */}
        <div style={{ position: "relative" }}>
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              style={{
                position: "relative",
                background: `
                  radial-gradient(ellipse 80% 60% at 22% 8%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 28%, transparent 55%),
                  linear-gradient(168deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.18) 100%)
                `,
                backdropFilter: "blur(28px) saturate(170%)",
                WebkitBackdropFilter: "blur(28px) saturate(170%)",
                border: `1px solid rgba(255,255,255,0.14)`,
                borderRadius: 20,
                padding: "clamp(40px, 5vw, 56px)",
                textAlign: "center",
                boxShadow: `
                  0 1.5px 0 0 rgba(255,255,255,0.22) inset,
                  0 0 0 1px ${BS_CYAN}26 inset,
                  0 24px 56px rgba(0,0,0,0.45),
                  0 0 80px ${BS_CYAN}1f
                `,
                overflow: "hidden",
              }}
            >
              <div style={{
                width: 64, height: 72, margin: "0 auto 22px",
                clipPath: HEX_CLIP,
                background: `linear-gradient(135deg, ${BS_CYAN}, ${BS_LIGHT_BLUE})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 24px ${BS_CYAN}66`,
              }}>
                <span style={{ color: BS_NAVY, fontSize: 26, fontWeight: 900 }}>✓</span>
              </div>
              <h3 style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontSize: "clamp(22px, 2.4vw, 30px)",
                fontWeight: 800,
                color: BS_WHITE,
                margin: "0 0 12px 0",
                letterSpacing: "-0.02em",
              }}>
                Request received
              </h3>
              <p style={{
                fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                fontSize: 15,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.72)",
                margin: 0,
                maxWidth: 480,
                marginInline: "auto",
              }}>
                Thank you for your interest. Our team will review your request and be in touch shortly with the next steps.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
              style={{
                position: "relative",
                background: `
                  radial-gradient(ellipse 80% 60% at 22% 8%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 28%, transparent 55%),
                  radial-gradient(ellipse 70% 50% at 80% 100%, ${BS_CYAN}1f 0%, transparent 55%),
                  linear-gradient(168deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 45%, rgba(0,0,0,0.18) 100%)
                `,
                backdropFilter: "blur(30px) saturate(180%) brightness(1.06)",
                WebkitBackdropFilter: "blur(30px) saturate(180%) brightness(1.06)",
                border: `1px solid rgba(255,255,255,0.14)`,
                borderRadius: 20,
                padding: "clamp(28px, 2.8vw, 40px)",
                display: "flex",
                flexDirection: "column",
                gap: 18,
                boxShadow: `
                  0 1.5px 0 0 rgba(255,255,255,0.28) inset,
                  0 -1.5px 0 0 rgba(0,0,0,0.24) inset,
                  0 0 0 1px ${BS_CYAN}1f inset,
                  0 1px 2px rgba(0,0,0,0.18) inset,
                  0 24px 56px rgba(0,0,0,0.5),
                  0 0 80px ${BS_CYAN}1f
                `,
                overflow: "hidden",
              }}
            >
              {/* Top hairline cyan→blue */}
              <span aria-hidden style={{
                position: "absolute",
                top: 0, left: "8%", right: "8%", height: 1.5,
                background: `linear-gradient(90deg, transparent 0%, ${BS_CYAN} 30%, ${BS_LIGHT_BLUE} 70%, transparent 100%)`,
                pointerEvents: "none",
                zIndex: 3,
              }} />
              {/* Specular highlight */}
              <span aria-hidden style={{
                position: "absolute",
                top: 1.5, left: "20%", right: "20%", height: 1,
                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)`,
                pointerEvents: "none",
                zIndex: 3,
              }} />
              {/* Bottom-edge dark seal */}
              <span aria-hidden style={{
                position: "absolute",
                bottom: 0, left: "12%", right: "12%", height: 1,
                background: `linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 50%, transparent 100%)`,
                pointerEvents: "none",
                zIndex: 3,
              }} />

              {/* Cinematic corner brackets */}
              {[
                { top: 14, left: 14, borderTop: true, borderLeft: true },
                { top: 14, right: 14, borderTop: true, borderRight: true },
                { bottom: 14, left: 14, borderBottom: true, borderLeft: true },
                { bottom: 14, right: 14, borderBottom: true, borderRight: true },
              ].map((pos, idx) => (
                <span key={idx} aria-hidden style={{
                  position: "absolute",
                  ...pos,
                  width: 12, height: 12,
                  borderTop: pos.borderTop ? `1.5px solid ${BS_CYAN}aa` : undefined,
                  borderBottom: pos.borderBottom ? `1.5px solid ${BS_CYAN}aa` : undefined,
                  borderLeft: pos.borderLeft ? `1.5px solid ${BS_CYAN}aa` : undefined,
                  borderRight: pos.borderRight ? `1.5px solid ${BS_CYAN}aa` : undefined,
                  pointerEvents: "none",
                  zIndex: 3,
                }} />
              ))}
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                aria-hidden
                suppressHydrationWarning
              />

              <div className="bs-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Full name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    style={fieldStyle}
                    className="bs-input"
                    required
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label style={labelStyle}>Work email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organisation.gov.sa"
                    style={fieldStyle}
                    className="bs-input"
                    required
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div className="bs-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Job title *</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. CDO, CIO, Head of Digital Transformation"
                    style={fieldStyle}
                    className="bs-input"
                    required
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label style={labelStyle}>Organisation *</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Ministry / authority / entity"
                    style={fieldStyle}
                    className="bs-input"
                    required
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>
                  Phone *{" "}
                  <span style={{
                    color: "rgba(255,255,255,0.35)",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "none",
                    fontSize: 10.5,
                  }}>
                    ({selectedCountry.length} digits)
                  </span>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10 }}>
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      // Reset phone when country changes — different digit count expected
                      setCountryCode(e.target.value);
                      setPhone("");
                    }}
                    style={{ ...fieldStyle, minWidth: 130, padding: "13px 12px" }}
                    className="bs-input"
                    suppressHydrationWarning
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={`${c.code}-${c.country}`} value={c.code} style={{ background: BS_NAVY }}>
                        {c.country} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(e) => {
                      // Strip non-digits; cap at the country's expected digit count
                      const digitsOnly = e.target.value.replace(/\D/g, "");
                      setPhone(digitsOnly.slice(0, selectedCountry.length));
                    }}
                    placeholder={selectedCountry.placeholder}
                    maxLength={selectedCountry.length}
                    style={fieldStyle}
                    className="bs-input"
                    required
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Anything we should know? (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us what you'd like to take away from the morning"
                  rows={4}
                  style={{ ...fieldStyle, resize: "vertical", minHeight: 110, fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}
                  className="bs-input"
                  suppressHydrationWarning
                />
              </div>

              {errorMsg && (
                <p role="alert" style={{
                  margin: 0,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "rgba(255, 99, 132, 0.08)",
                  border: "1px solid rgba(255, 99, 132, 0.32)",
                  color: "#ffb3c1",
                  fontSize: 13,
                  fontWeight: 500,
                }}>
                  {errorMsg}
                </p>
              )}

              <div style={{
                marginTop: 4,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 16, flexWrap: "wrap",
              }}>
                <p style={{
                  margin: 0,
                  fontSize: 11.5,
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.04em",
                  fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                }}>
                  By submitting, you agree to be contacted about this event.
                </p>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="bs-form-submit"
                  suppressHydrationWarning
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    padding: "14px 28px",
                    borderRadius: 999,
                    border: "none",
                    background: status === "submitting"
                      ? `${BS_CYAN}77`
                      : `linear-gradient(135deg, ${BS_CYAN}, ${BS_LIGHT_BLUE})`,
                    color: BS_NAVY,
                    fontFamily: "var(--font-montserrat), system-ui, sans-serif",
                    fontSize: 13, fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: status === "submitting" ? "wait" : "pointer",
                    boxShadow: `0 8px 26px ${BS_CYAN}44`,
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  }}
                >
                  {status === "submitting" ? "Sending…" : <>Request invitation <span aria-hidden>→</span></>}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .bs-input:focus {
          border-color: ${BS_CYAN}99 !important;
          background: rgba(0, 0, 0, 0.55) !important;
          box-shadow: 0 0 0 3px ${BS_CYAN}1f !important;
        }
        .bs-input::placeholder { color: rgba(255,255,255,0.32); }
        .bs-form-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 14px 32px ${BS_CYAN}66;
        }
        @media (max-width: 1020px) {
          .bs-register-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(36px, 5vw, 60px) !important;
          }
          .bs-register-left {
            position: static !important;
            top: auto !important;
          }
        }
        @media (max-width: 680px) {
          .bs-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// FOOTER (basic)
// ═════════════════════════════════════════════════════════════════════════════
function BlackstoneFooter() {
  return (
    <footer style={{
      background: "transparent",
      padding: "clamp(36px, 5vw, 56px) 0",
    }}>
      <div style={{
        maxWidth: 1320, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 56px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 24,
      }}>
        {/* Dual-brand lockup: Blackstone (host) + OutSystems (sponsor) on the
            dark page bottom, separated by a hairline divider — mirrors the
            navigation logo treatment at the top of the page. */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 16,
          lineHeight: 0,
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", height: 44 }}>
            <OutSystemsLogomark size={34} />
          </span>
          <span aria-hidden style={{
            width: 1, height: 32,
            background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.22) 30%, rgba(255,255,255,0.22) 70%, transparent 100%)`,
          }} />
          <span style={{ display: "inline-flex", alignItems: "center", height: 44 }}>
            <BlackstoneLogomark size={33} />
          </span>
        </div>
        <p style={{
          fontSize: 12, color: "rgba(255,255,255,0.42)", margin: 0,
          display: "inline-flex", alignItems: "center", gap: 10,
          fontFamily: "var(--font-montserrat), system-ui, sans-serif",
        }}>
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
              style={{ height: 38, width: "auto", opacity: 0.85 }}
            />
          </a>
        </p>
      </div>
    </footer>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN
// ═════════════════════════════════════════════════════════════════════════════
export default function BlackstonePage() {
  return (
    <div style={{
      // Unified cinematic vertical gradient — sections lay transparent on top of this so the
      // whole scroll reads as one continuous stage rather than slabs separated by hairlines.
      background: `
        linear-gradient(180deg,
          ${BS_NAVY} 0%,
          #0a1a30 14%,
          #08152a 28%,
          #050d1c 42%,
          ${BS_BLACK} 56%,
          #050d1c 70%,
          #08162a 84%,
          ${BS_BLACK} 100%
        )
      `,
      color: BS_WHITE,
      fontFamily: "var(--font-montserrat), system-ui, sans-serif",
      minHeight: "100svh",
    }}>
      <BlackstoneNav />
      <HeroSection />
      <JourneyCanvas />
      <SpeakersSection />
      <ProgrammeCanvas />
      <RegisterSection />
      <BlackstoneFooter />
    </div>
  );
}
