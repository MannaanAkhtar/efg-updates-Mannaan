"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { submitForm, isWorkEmail, COUNTRY_CODES, validatePhone, type CountryCode } from "@/lib/form-helpers";

// =============================================================================
// Autodesk x Events First Group - Executive Roundtable
// "Building with Confidence: Data-Led Resilience and Delivery Certainty"
//
// Built strictly to Autodesk Brand Guidelines (https://brand.autodesk.com/):
//   - 85% Autodesk Black / White / Hello Yellow ; 15% accent
//   - 4px base grid (every spacing value is a multiple of 4)
//   - Corner radius scale: buttons 4 / inputs 8 / cards 16 / banners 32
//   - Sharp corners on structural elements, rounded on interactive
//   - Hello Yellow NEVER on White; logo NEVER in Yellow
//   - Artifakt is the brand typeface - using Plus Jakarta Sans (display) +
//     Outfit (body) as closest licensed substitutes available in this app.
// =============================================================================

// ---- Brand tokens -----------------------------------------------------------
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const YELLOW = "#FFFF00";          // Hello Yellow
const WARM_SLATE = "#D5D5CB";
const SLATE = "#666666";
const NEAR_BLACK = "#0A0A0A";      // page base — pure black is reserved for hero accents
const HAIRLINE = "rgba(255,255,255,0.10)";
const HAIRLINE_DARK = "rgba(0,0,0,0.10)";

// Type tokens — font stacks reference the project's existing font variables.
const DISPLAY = "var(--font-display), 'Helvetica Neue', Arial, sans-serif";
const BODY = "var(--font-outfit), Arial, sans-serif";

const EVENT_DATE_ISO = "2026-06-30T10:30:00+04:00";

// ---- Speakers ---------------------------------------------------------------
const SPEAKERS = [
  {
    name: "Naji Atallah",
    role: "Head of Industry, AECO and Manufacturing, EMEA Emerging",
    org: "Autodesk",
    tag: "Moderator",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Naji_Atallah.png" as string | null,
    initials: "NA",
    linkedin: "https://www.linkedin.com/in/naji-atallah/" as string | null,
  },
  {
    name: "Luca Vigliero",
    role: "Executive Director, Board Member",
    org: "XBD Collective",
    tag: "Speaker",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Luca+Headshot.png" as string | null,
    initials: "LV",
    linkedin: "https://www.linkedin.com/in/luca-vigliero-11b7671a/" as string | null,
  },
  {
    name: "Joe Labaky",
    role: "COO",
    org: "Group Amana",
    tag: "Speaker",
    photo: "https://efg-final.s3.eu-north-1.amazonaws.com/Speakers-photos/Joe+Labaky.jpg" as string | null,
    initials: "JL",
    linkedin: "https://www.linkedin.com/in/joelabaky/" as string | null,
  },
];

// ---- Takeaways --------------------------------------------------------------
const TAKEAWAYS = [
  "Learn from fellow AECO executives on how data is helping them increase business confidence and delivery certainty.",
  "Position your business towards increased execution discipline and improved margins.",
  "Gain insights on what data-led resiliency could mean for your business.",
];

// ---- Agenda -----------------------------------------------------------------
type AgendaRow = {
  start: string;
  end: string;
  duration: string;
  segment: string;
  owner: string;
  highlight?: boolean;
};

const AGENDA: AgendaRow[] = [
  { start: "10:30", end: "11:00", duration: "30 min", segment: "Guest Arrival, Registration & Welcome Coffee", owner: "Event Operations Team" },
  { start: "11:00", end: "11:05", duration: "5 min",  segment: "Welcome Remarks & House Keeping",              owner: "Event Host / Moderator" },
  { start: "11:05", end: "11:35", duration: "30 min", segment: "Fireside Chat",                                owner: "Lead Speaker / Sponsor", highlight: true },
  { start: "11:35", end: "12:05", duration: "30 min", segment: "Peer Conversations",                           owner: "Industry Speaker / Sponsor" },
  { start: "12:05", end: "12:10", duration: "5 min",  segment: "Closing Remarks",                              owner: "Event Host / Moderator" },
  { start: "12:15", end: "13:30", duration: "75 min", segment: "Networking Lunch",                             owner: "All Delegates" },
];

// ---- Nav anchors ------------------------------------------------------------
const NAV_LINKS = [
  { id: "overview", label: "Overview" },
  { id: "takeaways", label: "Takeaways" },
  { id: "speakers", label: "Speakers" },
  { id: "agenda", label: "Agenda" },
  { id: "about", label: "About Autodesk" },
];

// =============================================================================
// COUNTDOWN
// =============================================================================
function useCountdown(targetIso: string) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const target = new Date(targetIso).getTime();
  if (!now) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: false, mounted: false };
  const diff = Math.max(0, target - now.getTime());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    finished: diff === 0,
    mounted: true,
  };
}

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

// ---- Autodesk official logo --------------------------------------------------
// Primary Autodesk wordmark from the brand DAM. White-on-dark only per brand:
// the logo can never appear in Hello Yellow or on Hello Yellow.
const AUTODESK_LOGO_WHITE =
  "https://efg-final.s3.eu-north-1.amazonaws.com/sponsors-logo/autodesk-logo-primary-rgb-white.svg";

function AutodeskMark({ tone = "white", height = 28 }: { tone?: "white" | "black"; height?: number }) {
  // Brand rule: only Black/White allowed. Source is the white SVG; the black
  // variant is a CSS-inverted treatment.
  const filter = tone === "black" ? "brightness(0)" : undefined;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={AUTODESK_LOGO_WHITE}
      alt="Autodesk"
      style={{
        height,
        width: "auto",
        display: "inline-block",
        filter,
      }}
    />
  );
}

// ---- Top bar ----------------------------------------------------------------
function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        background: scrolled ? "rgba(0,0,0,0.86)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(150%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(150%)" : "none",
        borderBottom: scrolled ? `1px solid ${HAIRLINE}` : "1px solid transparent",
        transition: "background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px clamp(20px, 4vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <a href="#top" aria-label="Events First Group — return to top" style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/events-first-group_logo_alt.svg"
            alt="Events First Group"
            style={{ height: 34, width: "auto", display: "block" }}
          />
          <span aria-hidden style={{ width: 1, height: 20, background: HAIRLINE }} />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            fontFamily: BODY, fontSize: 9.5, fontWeight: 700,
            letterSpacing: "0.32em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
          }}>
            In partnership with
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AUTODESK_LOGO_WHITE}
              alt="Autodesk"
              style={{ height: 12, width: "auto", display: "block", opacity: 0.85 }}
            />
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="ad-nav-desk" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              style={{
                fontFamily: BODY,
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.78)",
                textDecoration: "none",
                letterSpacing: "0.01em",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = WHITE; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.78)"; }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#reserve"
            style={{
              fontFamily: BODY,
              fontSize: 13,
              fontWeight: 700,
              color: BLACK,
              background: YELLOW,
              padding: "12px 20px",
              borderRadius: 4,
              textDecoration: "none",
              letterSpacing: "0.02em",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,255,0,0.20)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Register Interest
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="ad-nav-toggle"
          style={{
            display: "none",
            background: "transparent",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 4,
            padding: "10px 12px",
            color: WHITE,
            cursor: "pointer",
          }}
        >
          <span style={{ display: "block", width: 16, height: 1.5, background: WHITE, marginBottom: 4 }} />
          <span style={{ display: "block", width: 16, height: 1.5, background: WHITE, marginBottom: 4 }} />
          <span style={{ display: "block", width: 16, height: 1.5, background: WHITE }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="ad-nav-mob"
          style={{
            display: "none",
            padding: "12px clamp(20px, 4vw, 48px) 20px",
            borderTop: `1px solid ${HAIRLINE}`,
            background: "rgba(0,0,0,0.96)",
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                fontFamily: BODY,
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                padding: "12px 0",
                borderBottom: `1px solid ${HAIRLINE}`,
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#reserve"
            onClick={() => setOpen(false)}
            style={{
              display: "inline-block",
              marginTop: 16,
              fontFamily: BODY,
              fontSize: 13,
              fontWeight: 700,
              color: BLACK,
              background: YELLOW,
              padding: "12px 20px",
              borderRadius: 4,
              textDecoration: "none",
            }}
          >
            Register Interest
          </a>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 880px) {
          :global(.ad-nav-desk) { display: none !important; }
          :global(.ad-nav-toggle) { display: inline-flex !important; }
          :global(.ad-nav-mob) { display: block !important; }
        }
      `}</style>
    </header>
  );
}

// ---- Section number heading -------------------------------------------------
function SectionHeader({ number, eyebrow, title, accent = YELLOW, dark = false }: {
  number: string;
  eyebrow?: string;
  title: string;
  accent?: string;
  dark?: boolean;
}) {
  const ink = dark ? BLACK : WHITE;
  const rule = dark ? HAIRLINE_DARK : HAIRLINE;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 24, paddingBottom: 24, borderBottom: `1px solid ${rule}`, marginBottom: 48 }}>
      <span style={{
        fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(40px, 5.6vw, 80px)",
        color: accent, lineHeight: 0.85, letterSpacing: "-0.04em",
        fontVariantNumeric: "tabular-nums",
      }}>{number}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && (
          <div style={{
            fontFamily: BODY, fontSize: 11, fontWeight: 700,
            letterSpacing: "0.32em", textTransform: "uppercase",
            color: dark ? SLATE : "rgba(255,255,255,0.55)", marginBottom: 8,
          }}>{eyebrow}</div>
        )}
        <h2 style={{
          fontFamily: DISPLAY, fontWeight: 800,
          fontSize: "clamp(28px, 3.6vw, 44px)",
          color: ink, margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em",
        }}>
          {title}
        </h2>
      </div>
    </div>
  );
}

// =============================================================================
// HERO — original layout, fit-to-screen
// =============================================================================
function Hero() {
  return (
    <section
      id="top"
      className="ad-hero"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 720,
        background: BLACK,
        color: WHITE,
        paddingTop: 96,
        paddingBottom: 64,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Real BG image — UAE construction skyline (full visible) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://efg-final.s3.eu-north-1.amazonaws.com/boardroom/UAE_constructionskyline1.png"
        alt=""
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.95,
          zIndex: 0,
        }}
      />
      {/* Cinematic left-to-right gradient — heavy on left for headline legibility, fade to fully visible image on right */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(95deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.20) 78%, rgba(0,0,0,0.35) 100%)`,
        zIndex: 0,
      }} />
      {/* Subtle bottom vignette for grounding */}
      <div aria-hidden style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        height: "30%",
        background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 100%)",
        zIndex: 0,
      }} />

      <div style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 48px)",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
        gap: 48,
        alignItems: "center",
      }} className="ad-hero-grid">
        {/* LEFT: editorial */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="ad-hero-eyebrow"
            style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              fontFamily: BODY, fontSize: 11, fontWeight: 700,
              letterSpacing: "0.32em", textTransform: "uppercase",
              color: BLACK, background: YELLOW, padding: "8px 16px",
              borderRadius: 4,
              marginTop: 20,
              marginBottom: 12,
            }}
          >
            <span>Executive Roundtable</span>
            <span aria-hidden style={{ width: 4, height: 4, borderRadius: "50%", background: BLACK }} />
            <span>By Invitation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="ad-hero-headline"
            style={{
              fontFamily: DISPLAY, fontWeight: 800,
              fontSize: "clamp(40px, 4.8vw, 68px)",
              lineHeight: 1.0, letterSpacing: "-0.035em",
              margin: 0, color: WHITE,
              maxWidth: 720,
            }}
          >
            From Risk to{" "}
            <span style={{
              display: "inline-block",
              background: YELLOW, color: BLACK,
              padding: "0 12px",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone" as never,
            }}>Certainty</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="ad-hero-tagline"
            style={{
              marginTop: 28,
              display: "flex", alignItems: "flex-start", gap: 16,
              maxWidth: 720,
            }}
          >
            <span aria-hidden style={{
              width: 36, height: 2, background: YELLOW, flexShrink: 0, marginTop: 14,
            }} />
            <span style={{
              fontFamily: DISPLAY, fontWeight: 600,
              fontSize: "clamp(17px, 1.55vw, 24px)",
              color: "rgba(255,255,255,0.82)",
              letterSpacing: "-0.012em", lineHeight: 1.25,
            }}>
              How Data-Driven AECO Leaders Deliver with Confidence in an Uncertain Market
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="ad-hero-sub"
            style={{
              fontFamily: BODY,
              fontSize: "clamp(15px, 1.15vw, 17px)",
              fontWeight: 400, lineHeight: 1.55,
              color: "rgba(255,255,255,0.72)",
              margin: "28px 0 0",
              maxWidth: 580,
            }}
          >
            A closed-door, invite-only roundtable for AECO leaders on connected data,
            margin protection and delivery certainty. Final approval lies with EFG.
          </motion.p>

          {/* CTA + meta row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: 40,
              display: "flex", alignItems: "center",
              gap: 24, flexWrap: "wrap",
            }}
          >
            <a
              href="#reserve"
              style={{
                fontFamily: BODY, fontSize: 14, fontWeight: 700,
                color: BLACK, background: YELLOW,
                padding: "16px 28px",
                borderRadius: 4,
                textDecoration: "none",
                letterSpacing: "0.02em",
                display: "inline-flex", alignItems: "center", gap: 12,
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(255,255,0,0.28)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Request your seat
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" stroke={BLACK} strokeWidth="2.4" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </a>
            <a
              href="#overview"
              style={{
                fontFamily: BODY, fontSize: 14, fontWeight: 600,
                color: WHITE, background: "transparent",
                padding: "16px 24px",
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 4,
                textDecoration: "none",
                letterSpacing: "0.02em",
                transition: "border-color 0.25s ease, background 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = WHITE;
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = HAIRLINE;
                e.currentTarget.style.background = "transparent";
              }}
            >
              Read the brief
            </a>
          </motion.div>
        </div>

        {/* RIGHT: HELLO YELLOW premium ticket card */}
        <motion.aside
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            background: `linear-gradient(155deg, #FFFF33 0%, #FFFF00 35%, #FFFF00 65%, #F0EF00 100%)`,
            color: BLACK,
            padding: "0",
            borderRadius: 16,
            overflow: "hidden",
            zIndex: 3,
            boxShadow: `
              0 1px 0 rgba(255,255,180,0.85) inset,
              0 -1px 0 rgba(0,0,0,0.12) inset,
              0 50px 100px rgba(255,255,0,0.22),
              0 28px 64px rgba(0,0,0,0.5),
              0 0 0 1px rgba(0,0,0,0.10)
            `,
          }}
        >
          {/* Specular crescent — light catching the top edge of the paper */}
          <div aria-hidden style={{
            position: "absolute", top: 0, left: "10%", right: "10%",
            height: "32%",
            borderRadius: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.10) 50%, transparent 100%)",
            filter: "blur(14px)",
            pointerEvents: "none",
            zIndex: 1,
          }} />

          {/* Subtle inner grid texture */}
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            backgroundImage: `linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
            opacity: 0.55,
            maskImage: "linear-gradient(180deg, transparent 0%, black 20%, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 20%, black 80%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }} />

          {/* Watermark Autodesk logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AUTODESK_LOGO_WHITE}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              bottom: -22, right: -16,
              width: 220, height: "auto",
              opacity: 0.07,
              filter: "brightness(0)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* ── Top masthead band ── */}
          <div style={{
            position: "relative",
            zIndex: 2,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12,
            padding: "14px 28px",
            borderBottom: `1px solid rgba(0,0,0,0.35)`,
            background: "rgba(0,0,0,0.04)",
          }}>
            <span style={{
              fontFamily: BODY, fontSize: 10, fontWeight: 700,
              letterSpacing: "0.36em", textTransform: "uppercase",
              color: BLACK,
            }}>Save the Date</span>
            <span aria-hidden style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.30)" }} />
            <span style={{
              fontFamily: BODY, fontSize: 10, fontWeight: 700,
              letterSpacing: "0.20em", textTransform: "uppercase",
              color: "rgba(0,0,0,0.62)",
            }}>Closed-Door · Invite-Only</span>
          </div>

          {/* ── Card body — prominent time ── */}
          <div style={{ position: "relative", zIndex: 2, padding: "24px 28px 20px", textAlign: "center" }}>
            <div style={{
              fontFamily: BODY, fontSize: 10.5, fontWeight: 700,
              letterSpacing: "0.36em", textTransform: "uppercase",
              color: BLACK, marginBottom: 10,
            }}>Roundtable Time</div>

            <div style={{
              fontFamily: DISPLAY, fontWeight: 800,
              fontSize: "clamp(28px, 3vw, 44px)",
              color: BLACK, lineHeight: 1,
              letterSpacing: "-0.04em",
              textShadow: "0 1px 0 rgba(255,255,255,0.45)",
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}>
              10:30 — 13:30
            </div>
            <div style={{
              fontFamily: BODY, fontSize: 10.5, fontWeight: 700,
              letterSpacing: "0.30em", textTransform: "uppercase",
              color: "rgba(0,0,0,0.62)", marginTop: 8,
            }}>
              GST · 3-hour Roundtable
            </div>
          </div>

          {/* ── Punch-hole perforation divider — premium ticket cue ── */}
          <div aria-hidden style={{
            position: "relative",
            height: 16,
            margin: "0",
          }}>
            {/* left punch */}
            <span style={{
              position: "absolute",
              left: -8, top: "50%",
              width: 16, height: 16,
              borderRadius: "50%",
              background: BLACK,
              transform: "translateY(-50%)",
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.10)",
            }} />
            {/* right punch */}
            <span style={{
              position: "absolute",
              right: -8, top: "50%",
              width: 16, height: 16,
              borderRadius: "50%",
              background: BLACK,
              transform: "translateY(-50%)",
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.10)",
            }} />
            {/* dashed line between */}
            <span style={{
              position: "absolute",
              left: 16, right: 16, top: "50%",
              height: 1,
              backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.55) 0 5px, transparent 5px 10px)",
              backgroundSize: "10px 1px",
              backgroundRepeat: "repeat-x",
              transform: "translateY(-50%)",
            }} />
          </div>

          {/* ── Detail grid 2x2 with accent rails ── */}
          <div style={{
            position: "relative", zIndex: 2,
            padding: "22px 28px 28px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "22px 24px",
          }}>
            {[
              { label: "Date", value: "Tue, 30 Jun 2026" },
              { label: "Location", value: "Marriott, Palm Jumeirah" },
              { label: "Format", value: "Physical Roundtable" },
              { label: "Audience", value: "20–25 AECO Execs" },
            ].map((it) => (
              <div key={it.label} style={{ position: "relative", paddingLeft: 12 }}>
                {/* accent rail */}
                <span aria-hidden style={{
                  position: "absolute", left: 0, top: 4, bottom: 4,
                  width: 2, background: BLACK,
                }} />
                <div style={{
                  fontFamily: BODY, fontSize: 9.5, fontWeight: 700,
                  letterSpacing: "0.32em", textTransform: "uppercase",
                  color: "rgba(0,0,0,0.62)", marginBottom: 6,
                }}>{it.label}</div>
                <div style={{
                  fontFamily: DISPLAY, fontWeight: 800,
                  fontSize: "clamp(12px, 0.95vw, 14.5px)",
                  color: BLACK, lineHeight: 1.25, letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                }}>{it.value}</div>
              </div>
            ))}
          </div>

          {/* ── Bottom signature row ── */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 12,
            padding: "12px 28px",
            borderTop: `1px solid rgba(0,0,0,0.22)`,
            background: "rgba(0,0,0,0.04)",
          }}>
            <span style={{
              fontFamily: BODY, fontSize: 10, fontWeight: 700,
              letterSpacing: "0.30em", textTransform: "uppercase",
              color: "rgba(0,0,0,0.72)",
            }}>Final approval lies with EFG</span>
          </div>
        </motion.aside>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.ad-hero-grid) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 720px) {
          :global(.ad-hero) {
            height: auto !important;
            min-height: 0 !important;
            padding-top: 120px !important;
            padding-bottom: 56px !important;
            align-items: flex-start !important;
          }
          :global(.ad-hero-grid) {
            gap: 32px !important;
          }
          :global(.ad-hero-eyebrow) {
            font-size: 12px !important;
            letter-spacing: 0.28em !important;
            gap: 12px !important;
            padding: 10px 18px !important;
            flex-wrap: wrap !important;
          }
          :global(.ad-hero-headline) {
            font-size: clamp(36px, 9vw, 56px) !important;
            line-height: 1.02 !important;
          }
          :global(.ad-hero-sub) {
            font-size: 15px !important;
          }
        }
        @media (max-width: 420px) {
          :global(.ad-hero-eyebrow) {
            font-size: 11px !important;
            letter-spacing: 0.26em !important;
            padding: 9px 16px !important;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// SECTION 01: DETAIL STRIP — Date / Location / Format / Audience
// =============================================================================
function DetailStrip() {
  const items = [
    { label: "Date", value: "Tuesday, June 30 2026" },
    { label: "Location", value: "Marriott, Palm Jumeirah" },
    { label: "Format", value: "Physical Roundtable" },
    { label: "Audience", value: "20–25 Executives" },
  ];
  return (
    <section style={{ background: BLACK, color: WHITE, padding: "0 0 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <div className="ad-strip" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          borderTop: `1px solid ${HAIRLINE}`,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}>
          {items.map((it, idx) => (
            <div key={it.label} style={{
              padding: "32px 24px",
              borderLeft: idx === 0 ? "0" : `1px solid ${HAIRLINE}`,
            }}>
              <div style={{
                fontFamily: BODY, fontSize: 10, fontWeight: 700,
                letterSpacing: "0.32em", textTransform: "uppercase",
                color: YELLOW, marginBottom: 12,
              }}>{it.label}</div>
              <div style={{
                fontFamily: DISPLAY, fontWeight: 700,
                fontSize: "clamp(15px, 1.2vw, 18px)",
                color: WHITE, lineHeight: 1.25, letterSpacing: "-0.01em",
              }}>{it.value}</div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 720px) {
          :global(.ad-strip) {
            grid-template-columns: 1fr 1fr !important;
          }
          :global(.ad-strip) > div:nth-child(2n+1) { border-left: 0 !important; }
          :global(.ad-strip) > div:nth-child(n+3) { border-top: 1px solid ${HAIRLINE} !important; }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// SECTION 03: EVENT OVERVIEW & POSITIONING
// =============================================================================
function OverviewSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const blocks = [
    {
      head: "What is this roundtable about?",
      body:
        "An Executive-to-Executive forum to discuss resiliency and how the industry should gear itself for delivery certainty amidst regional disruption and supply-chain risk. A space to exchange ideas and understand what peers are doing. Not a product or technical session.",
    },
    {
      head: "What problem does it solve?",
      body:
        "Connecting executives on navigating AECO disruption and instilling business resiliency, so projects deliver on time and margins stay protected.",
    },
    {
      head: "Why should someone attend?",
      body:
        "Hear from industry leaders who are navigating AECO disruption first-hand and learn how they are building delivery certainty into every project they touch.",
    },
  ];

  return (
    <section
      ref={ref}
      id="overview"
      style={{
        background: WHITE, color: BLACK,
        padding: "clamp(80px, 10vh, 128px) 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <SectionHeader
          number="01"
          eyebrow="Overview"
          title="Why we're hosting this conversation."
          accent={BLACK}
          dark
        />

        <div className="ad-overview-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 32,
        }}>
          {blocks.map((b, i) => (
            <motion.div
              key={b.head}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "relative",
                paddingTop: 28,
                borderTop: `2px solid ${BLACK}`,
              }}
            >
              {/* yellow accent rail under the rule */}
              <span aria-hidden style={{
                position: "absolute", top: -2, left: 0, width: 48, height: 2,
                background: YELLOW,
              }} />
              <h3 style={{
                fontFamily: DISPLAY, fontWeight: 800,
                fontSize: "clamp(18px, 1.8vw, 22px)",
                color: BLACK, margin: "0 0 16px",
                letterSpacing: "-0.01em", lineHeight: 1.15,
              }}>{b.head}</h3>
              <p style={{
                fontFamily: BODY, fontSize: "clamp(14px, 1.05vw, 16px)",
                fontWeight: 400, lineHeight: 1.6,
                color: "rgba(0,0,0,0.72)", margin: 0,
              }}>{b.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 820px) {
          :global(.ad-overview-grid) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// SECTION 04: KEY TAKEAWAYS — editorial numbered list, premium
// =============================================================================
function TakeawaysSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="takeaways"
      style={{
        background: NEAR_BLACK, color: WHITE,
        padding: "clamp(80px, 10vh, 128px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* yellow corner block — top right */}
      <div aria-hidden style={{
        position: "absolute", top: 0, right: 0,
        width: 320, height: 8, background: YELLOW,
      }} />

      {/* ghost Autodesk wordmark — bottom-left anchor */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={AUTODESK_LOGO_WHITE}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-2%", left: "-6%",
          width: "38%", height: "auto",
          maxWidth: 600,
          opacity: 0.05,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <SectionHeader
          number="02"
          eyebrow="Key Takeaways"
          title="What you'll walk away with."
        />

        {/* ── Editorial numbered list ── */}
        <div style={{
          borderTop: `1px solid ${HAIRLINE}`,
          position: "relative",
        }}>
          {/* Hairline gradient overlay on top edge */}
          <span aria-hidden style={{
            position: "absolute", top: -1, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, ${YELLOW} 0%, ${YELLOW} 8%, transparent 60%)`,
          }} />

          {TAKEAWAYS.map((text, i) => {
            const meta = [
              { tag: "Outcome", refSegment: "Fireside Chat" },
              { tag: "Strategy", refSegment: "Peer Conversations" },
              { tag: "Insight",  refSegment: "Fireside Chat" },
            ][i];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.12 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="ad-takeaway-row"
                style={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "minmax(90px, 0.25fr) 1px minmax(0, 1fr) minmax(140px, auto)",
                  gap: "clamp(20px, 2.6vw, 44px)",
                  alignItems: "center",
                  padding: "clamp(24px, 2.8vw, 36px) 0 clamp(24px, 2.8vw, 36px) 16px",
                  borderBottom: `1px solid ${HAIRLINE}`,
                }}
              >
                {/* Left accent rail — animates in on hover */}
                <span aria-hidden className="ad-takeaway-rail" style={{
                  position: "absolute", left: 0, top: "18%", bottom: "18%",
                  width: 3, background: YELLOW,
                  transform: "scaleY(0)", transformOrigin: "top",
                  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                }} />

                {/* Subtle full-row yellow wash on hover */}
                <span aria-hidden className="ad-takeaway-wash" style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(90deg, rgba(255,255,0,0.05) 0%, transparent 60%)",
                  opacity: 0, transition: "opacity 0.45s ease",
                  pointerEvents: "none",
                }} />

                {/* Left: bold number with /03 fraction */}
                <div style={{
                  position: "relative",
                  display: "inline-flex", alignItems: "baseline", gap: 6,
                }}>
                  <span style={{
                    fontFamily: DISPLAY, fontWeight: 800,
                    fontSize: "clamp(40px, 4.4vw, 64px)",
                    color: YELLOW, lineHeight: 0.85,
                    letterSpacing: "-0.04em",
                    fontVariantNumeric: "tabular-nums",
                    textShadow: "0 0 32px rgba(255,255,0,0.18)",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{
                    fontFamily: BODY, fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.24em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.32)",
                    alignSelf: "flex-end", paddingBottom: 4,
                  }}>
                    / {String(TAKEAWAYS.length).padStart(2, "0")}
                  </span>
                </div>

                {/* vertical hairline divider — gradient fade */}
                <div aria-hidden style={{
                  width: 1, height: "70%",
                  background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.22) 25%, rgba(255,255,255,0.22) 75%, transparent 100%)",
                  justifySelf: "center",
                }} />

                {/* Right: takeaway content */}
                <div style={{ minWidth: 0 }}>
                  {/* meta tag chip + reference */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 14,
                    marginBottom: 12, flexWrap: "wrap",
                  }}>
                    <span style={{
                      fontFamily: BODY, fontSize: 9.5, fontWeight: 700,
                      letterSpacing: "0.32em", textTransform: "uppercase",
                      color: BLACK, background: YELLOW,
                      padding: "4px 10px",
                      borderRadius: 4,
                    }}>{meta.tag}</span>
                    <span aria-hidden style={{ width: 16, height: 1, background: "rgba(255,255,255,0.25)" }} />
                    <span style={{
                      fontFamily: BODY, fontSize: 10, fontWeight: 600,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.50)",
                    }}>Discussed in {meta.refSegment}</span>
                  </div>

                  <p style={{
                    fontFamily: DISPLAY, fontWeight: 600,
                    fontSize: "clamp(15px, 1.3vw, 20px)",
                    lineHeight: 1.4, letterSpacing: "-0.014em",
                    color: WHITE,
                    margin: 0,
                    maxWidth: 640,
                  }}>{text}</p>
                </div>

                {/* Far right: indicator with label */}
                <div className="ad-takeaway-jump" style={{
                  display: "inline-flex", alignItems: "center",
                  justifySelf: "end",
                  gap: 10,
                  fontFamily: BODY, fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.28em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  transition: "color 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                }}>
                  <span>Discuss</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section footer — link to agenda */}
        <motion.a
          href="#agenda"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: 32,
            display: "inline-flex", alignItems: "center", gap: 12,
            fontFamily: BODY, fontSize: 11, fontWeight: 700,
            letterSpacing: "0.30em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.60)",
            textDecoration: "none",
            paddingBottom: 4,
            borderBottom: `1px solid ${HAIRLINE}`,
            transition: "color 0.25s ease, border-color 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = YELLOW;
            e.currentTarget.style.borderColor = YELLOW;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.60)";
            e.currentTarget.style.borderColor = HAIRLINE;
          }}
        >
          <span>See full agenda</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </motion.a>
      </div>
      <style jsx>{`
        .ad-takeaway-row:hover .ad-takeaway-rail {
          transform: scaleY(1) !important;
        }
        .ad-takeaway-row:hover .ad-takeaway-wash {
          opacity: 1 !important;
        }
        .ad-takeaway-row:hover .ad-takeaway-jump {
          color: ${YELLOW} !important;
          transform: translateX(4px);
        }
        @media (max-width: 820px) {
          :global(.ad-takeaway-row) {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            padding: 24px 0 24px 12px !important;
          }
          /* Hide the vertical hairline divider (4th child) and the
             far-right "Discuss" indicator (6th child) on mobile.
             Children 1-2 are absolutely-positioned spans (rail/wash). */
          :global(.ad-takeaway-row) > *:nth-child(4),
          :global(.ad-takeaway-row) > *:nth-child(6) {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// SECTION 05: SPEAKERS & PANELISTS (Moderator card)
// =============================================================================
function SpeakersSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="speakers"
      style={{
        background: WHITE, color: BLACK,
        padding: "clamp(80px, 10vh, 128px) 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <SectionHeader
          number="03"
          eyebrow="Speakers & Panelists"
          title="At the table."
          accent={BLACK}
          dark
        />

        <div className="ad-speakers-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 320px))",
          gap: 24,
          justifyContent: "start",
        }}>
          {SPEAKERS.map((sp, i) => {
            const role = sp.tag;
            return (
            <motion.article
              key={sp.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="ad-speaker-card"
              style={{
                position: "relative",
                background: BLACK,
                borderRadius: 16,
                overflow: "hidden",
                display: "flex", flexDirection: "column",
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease",
                boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
              }}
            >
              {/* ── Top masthead bar ── */}
              <div style={{
                position: "relative",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12,
                padding: "10px 16px",
                background: BLACK,
                zIndex: 3,
                borderBottom: `1px solid rgba(255,255,255,0.10)`,
              }}>
                {/* yellow accent square */}
                <span aria-hidden style={{
                  width: 10, height: 10, background: YELLOW, flex: "0 0 auto",
                }} />
                <span style={{
                  fontFamily: BODY, fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.36em", textTransform: "uppercase",
                  color: WHITE,
                }}>{role}</span>
                <span aria-hidden style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.18)" }} />
              </div>

              {/* ── Portrait area ── */}
              <div style={{
                position: "relative",
                aspectRatio: "1 / 1",
                background: NEAR_BLACK,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}>
                {sp.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sp.photo}
                    alt={sp.name}
                    className="ad-speaker-photo"
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      objectPosition: "center top",
                      filter: "contrast(1.04) saturate(1.02)",
                      transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.5s ease",
                    }}
                  />
                ) : (
                  <span style={{
                    fontFamily: DISPLAY, fontWeight: 800,
                    fontSize: 64, color: WHITE, letterSpacing: "-0.04em", opacity: 0.5,
                  }}>{sp.initials}</span>
                )}

                {/* Yellow L-shape corner brackets (TL & BR) */}
                {[
                  { top: 12, left: 12, brT: true, brL: true },
                  { bottom: 12, right: 12, brB: true, brR: true },
                ].map((c, idx) => (
                  <span
                    key={idx}
                    aria-hidden
                    className="ad-speaker-bracket"
                    style={{
                      position: "absolute",
                      ...(c.top !== undefined && { top: c.top }),
                      ...(c.bottom !== undefined && { bottom: c.bottom }),
                      ...(c.left !== undefined && { left: c.left }),
                      ...(c.right !== undefined && { right: c.right }),
                      width: 18, height: 18,
                      borderTop: c.brT ? `2px solid ${YELLOW}` : undefined,
                      borderBottom: c.brB ? `2px solid ${YELLOW}` : undefined,
                      borderLeft: c.brL ? `2px solid ${YELLOW}` : undefined,
                      borderRight: c.brR ? `2px solid ${YELLOW}` : undefined,
                      zIndex: 4,
                      transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                ))}

                {/* Bottom fade */}
                <div aria-hidden style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 110,
                  background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.70) 100%)",
                  pointerEvents: "none",
                }} />

                {/* Name + Org overlay (magazine cover style) */}
                <div style={{
                  position: "absolute", bottom: 16, left: 16, right: 16,
                  zIndex: 2,
                }}>
                  {sp.org && (
                    <div style={{
                      fontFamily: BODY, fontSize: 9.5, fontWeight: 700,
                      letterSpacing: "0.34em", textTransform: "uppercase",
                      color: YELLOW, marginBottom: 6,
                    }}>{sp.org}</div>
                  )}
                  <h3 style={{
                    fontFamily: DISPLAY, fontWeight: 800,
                    fontSize: "clamp(20px, 1.7vw, 26px)",
                    color: WHITE, margin: 0,
                    letterSpacing: "-0.025em", lineHeight: 1,
                    textShadow: "0 2px 8px rgba(0,0,0,0.45)",
                  }}>{sp.name}</h3>
                </div>
              </div>

              {/* ── Meta block ── */}
              <div style={{
                position: "relative",
                padding: "18px 20px 20px",
                background: BLACK,
              }}>
                {/* Role line */}
                <p style={{
                  fontFamily: BODY, fontSize: 13, fontWeight: 500,
                  color: "rgba(255,255,255,0.82)",
                  margin: "0 0 16px", lineHeight: 1.45,
                  minHeight: "2.9em", // reserve 2 lines so card bottoms align
                }}>{sp.role}</p>

                {/* Bottom row */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 12, marginTop: 14,
                }}>
                  {/* Autodesk wordmark for Autodesk speakers; company name otherwise */}
                  {sp.org === "Autodesk" ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={AUTODESK_LOGO_WHITE}
                      alt=""
                      aria-hidden
                      style={{ height: 12, width: "auto", opacity: 0.65 }}
                    />
                  ) : sp.org ? (
                    <span style={{
                      fontFamily: BODY, fontSize: 15, fontWeight: 700,
                      letterSpacing: "0.04em", color: "rgba(255,255,255,0.65)",
                      whiteSpace: "nowrap",
                    }}>{sp.org}</span>
                  ) : (
                    <span aria-hidden />
                  )}

                  {sp.linkedin && (
                    <a
                      href={sp.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${sp.name} on LinkedIn`}
                      className="ad-speaker-linkedin"
                      style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        gap: 8,
                        padding: "8px 12px 8px 14px",
                        borderRadius: 4,
                        background: "transparent", color: WHITE,
                        textDecoration: "none",
                        border: `1px solid rgba(255,255,255,0.18)`,
                        fontFamily: BODY, fontSize: 10, fontWeight: 700,
                        letterSpacing: "0.22em", textTransform: "uppercase",
                        transition: "background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = YELLOW;
                        e.currentTarget.style.color = BLACK;
                        e.currentTarget.style.borderColor = YELLOW;
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = WHITE;
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34v-8.7H5.67v8.7h2.67ZM7 8.48a1.56 1.56 0 1 0 0-3.12 1.56 1.56 0 0 0 0 3.12Zm11.34 9.86v-4.76c0-2.55-1.36-3.74-3.18-3.74-1.47 0-2.13.81-2.49 1.38v-1.18h-2.67c.04.76 0 8.7 0 8.7h2.67v-4.86c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.34.73 1.34 1.8v4.68h2.88Z"/>
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
            );
          })}

          {/* Placeholder for further speakers — matches dark Autodesk style */}
          <div className="ad-speaker-placeholder" style={{
            position: "relative",
            border: `1px dashed rgba(0,0,0,0.22)`,
            borderRadius: 16,
            padding: 24,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", textAlign: "center",
            minHeight: 240,
            background: "transparent",
            overflow: "hidden",
          }}>
            {/* corner brackets */}
            {[
              { top: 12, left: 12, brT: true, brL: true },
              { top: 12, right: 12, brT: true, brR: true },
              { bottom: 12, left: 12, brB: true, brL: true },
              { bottom: 12, right: 12, brB: true, brR: true },
            ].map((c, idx) => (
              <span
                key={idx}
                aria-hidden
                style={{
                  position: "absolute",
                  ...(c.top !== undefined && { top: c.top }),
                  ...(c.bottom !== undefined && { bottom: c.bottom }),
                  ...(c.left !== undefined && { left: c.left }),
                  ...(c.right !== undefined && { right: c.right }),
                  width: 14, height: 14,
                  borderTop: c.brT ? `2px solid ${BLACK}` : undefined,
                  borderBottom: c.brB ? `2px solid ${BLACK}` : undefined,
                  borderLeft: c.brL ? `2px solid ${BLACK}` : undefined,
                  borderRight: c.brR ? `2px solid ${BLACK}` : undefined,
                }}
              />
            ))}

            <div style={{
              fontFamily: DISPLAY, fontWeight: 800,
              fontSize: 48, color: BLACK, letterSpacing: "-0.04em",
              lineHeight: 1, marginBottom: 14,
            }}>+</div>
            <div style={{
              fontFamily: BODY, fontSize: 10.5, fontWeight: 700,
              letterSpacing: "0.30em", textTransform: "uppercase",
              color: BLACK,
            }}>More speakers<br />to be announced</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.ad-speaker-card) {
          will-change: transform;
        }
        :global(.ad-speaker-card:hover) {
          transform: translateY(-6px);
          box-shadow: 0 32px 70px rgba(0,0,0,0.30), 0 0 0 1px rgba(0,0,0,0.10);
        }
        :global(.ad-speaker-card:hover .ad-speaker-photo) {
          transform: scale(1.035);
          filter: contrast(1.06) saturate(1.05);
        }
        :global(.ad-speaker-card:hover .ad-speaker-bracket:nth-of-type(odd)) {
          transform: translate(-2px, -2px);
        }
        :global(.ad-speaker-card:hover .ad-speaker-bracket:nth-of-type(even)) {
          transform: translate(2px, 2px);
        }
        @media (max-width: 820px) {
          :global(.ad-speakers-grid) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// SECTION 06: AGENDA
// =============================================================================
function AgendaSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="agenda"
      style={{
        background: BLACK, color: WHITE,
        padding: "clamp(80px, 10vh, 128px) 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <SectionHeader
          number="04"
          eyebrow="Agenda"
          title="What's in store."
        />

        <div style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 16,
          overflow: "hidden",
        }}>
          {/* head row */}
          <div className="ad-agenda-row ad-agenda-head" style={{
            display: "grid",
            gridTemplateColumns: "80px 80px 100px 1fr",
            gap: 16,
            padding: "16px 24px",
            background: "rgba(255,255,255,0.04)",
            borderBottom: `1px solid ${HAIRLINE}`,
            fontFamily: BODY, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.32em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
          }}>
            <span>Start</span>
            <span>End</span>
            <span>Duration</span>
            <span>Segment</span>
          </div>

          {/* body rows */}
          {AGENDA.map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="ad-agenda-row"
              style={{
                display: "grid",
                gridTemplateColumns: "80px 80px 100px 1fr",
                gap: 16,
                padding: "20px 24px",
                borderBottom: idx === AGENDA.length - 1 ? "0" : `1px solid ${HAIRLINE}`,
                background: "transparent",
                position: "relative",
                alignItems: "center",
              }}
            >
              <span className="ad-agenda-start" style={{
                fontFamily: DISPLAY, fontWeight: 700,
                fontSize: 15, color: WHITE,
                fontVariantNumeric: "tabular-nums",
              }}>{row.start}</span>
              <span className="ad-agenda-end" style={{
                fontFamily: DISPLAY, fontWeight: 500,
                fontSize: 15, color: "rgba(255,255,255,0.55)",
                fontVariantNumeric: "tabular-nums",
              }}>{row.end}</span>
              <span className="ad-agenda-duration" style={{
                fontFamily: BODY, fontSize: 11, fontWeight: 600,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}>{row.duration}</span>
              <span className="ad-agenda-segment" style={{
                fontFamily: DISPLAY, fontWeight: 700,
                fontSize: "clamp(14px, 1.1vw, 16px)",
                color: WHITE, letterSpacing: "-0.005em",
              }}>{row.segment}</span>
            </motion.div>
          ))}
        </div>

        <p style={{
          marginTop: 24,
          fontFamily: BODY, fontSize: 12, fontWeight: 500,
          letterSpacing: "0.04em",
          color: "rgba(255,255,255,0.55)",
        }}>
          Programme subject to refinement under Chatham House Rule.
        </p>
      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          :global(.ad-agenda-head) { display: none !important; }
          :global(.ad-agenda-row) {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
            padding: 20px !important;
          }
          /* Group start + en-dash + end + dot + duration on one inline row */
          :global(.ad-agenda-start),
          :global(.ad-agenda-end),
          :global(.ad-agenda-duration) {
            display: inline-block !important;
          }
          :global(.ad-agenda-end)::before {
            content: "—";
            margin: 0 8px;
            color: rgba(255, 255, 255, 0.35);
            font-weight: 400;
          }
          :global(.ad-agenda-duration)::before {
            content: "•";
            margin: 0 10px;
            color: rgba(255, 255, 255, 0.35);
          }
          :global(.ad-agenda-segment) {
            margin-top: 4px !important;
            font-size: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// SECTION 07: ABOUT AUTODESK — cinematic (light)
// =============================================================================
function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="about"
      style={{
        background: WHITE, color: BLACK,
        padding: "clamp(80px, 10vh, 128px) 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <SectionHeader
          number="05"
          eyebrow="About Autodesk"
          title="Changing how the world is designed and made."
          dark
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: BODY,
            fontSize: "clamp(16px, 1.35vw, 20px)",
            fontWeight: 400, lineHeight: 1.6,
            color: "rgba(0,0,0,0.78)",
            margin: 0,
            maxWidth: 820,
          }}
        >
          Autodesk is changing how the world is designed and made. Our connected data
          and technology platform supports the architecture, engineering, construction
          and operations industries from early planning and design, through engineering
          and construction delivery, into asset operations and long-term performance.
        </motion.p>
      </div>
    </section>
  );
}

// =============================================================================
// RESERVE / FORM
// =============================================================================
type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  company: string;
};

function ReserveSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm] = useState<FormState>({
    firstName: "", lastName: "", email: "", phone: "", title: "", company: "",
  });
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(
    () => COUNTRY_CODES.find((c) => c.country === "AE") ?? COUNTRY_CODES[0]
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() ||
        !form.phone.trim() || !form.title.trim() || !form.company.trim()) {
      setError("Please complete every field.");
      return;
    }
    if (!isWorkEmail(form.email)) {
      setError("Please use a corporate email.");
      return;
    }
    const phoneError = validatePhone(form.phone, phoneCountry);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    setStatus("submitting");
    const fullPhone = `${phoneCountry.code} ${form.phone.trim()}`;
    const res = await submitForm({
      type: "attend",
      full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email: form.email.trim(),
      phone: fullPhone,
      company: form.company.trim(),
      job_title: form.title.trim(),
      event_name:
        "Autodesk Executive Roundtable: Building with Confidence",
      metadata: {
        "Event Page": "Autodesk Executive Roundtable",
        "Page Section": "Reservation Form",
        "First Name": form.firstName.trim(),
        "Last Name": form.lastName.trim(),
        "Phone Country": phoneCountry.name,
      },
    });
    if (res.success) {
      setStatus("success");
      setForm({ firstName: "", lastName: "", email: "", phone: "", title: "", company: "" });
    } else {
      setStatus("error");
      setError(res.error || "Submission failed. Please try again.");
    }
  };

  return (
    <section
      ref={ref}
      id="reserve"
      style={{
        background: BLACK, color: WHITE,
        padding: "clamp(80px, 10vh, 128px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* yellow corner accent */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0,
        width: 320, height: 8, background: YELLOW,
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <div className="ad-reserve-grid" style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
          gap: 64,
          alignItems: "start",
        }}>
          {/* LEFT: editorial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{
              fontFamily: BODY, fontSize: 13, fontWeight: 700,
              letterSpacing: "0.32em", textTransform: "uppercase",
              color: YELLOW, marginBottom: 20,
            }}>Reserve your seat</div>
            <h2 style={{
              fontFamily: DISPLAY, fontWeight: 800,
              fontSize: "clamp(44px, 5.6vw, 76px)",
              color: WHITE, margin: 0, lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}>
              Twenty seats.<br />
              <span style={{
                background: YELLOW, color: BLACK,
                padding: "0 14px",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone" as never,
              }}>One room.</span>
            </h2>
            <p style={{
              marginTop: 32, maxWidth: 560,
              fontFamily: BODY, fontSize: "clamp(16px, 1.3vw, 20px)",
              fontWeight: 400, lineHeight: 1.6,
              color: "rgba(255,255,255,0.82)",
            }}>
              Invitations are reviewed by Events First Group on behalf of Autodesk.
              Use your work email so we can verify your seniority and confirm your seat.
            </p>

            <div style={{
              marginTop: 40,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 28,
              maxWidth: 560,
            }}>
              <div>
                <div style={{
                  fontFamily: BODY, fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.32em", textTransform: "uppercase",
                  color: YELLOW, marginBottom: 10,
                }}>Date</div>
                <div style={{
                  fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: WHITE,
                }}>Tuesday, 30 June 2026</div>
              </div>
              <div>
                <div style={{
                  fontFamily: BODY, fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.32em", textTransform: "uppercase",
                  color: YELLOW, marginBottom: 10,
                }}>Time</div>
                <div style={{
                  fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: WHITE,
                }}>10:30 AM – 1:30 PM GST</div>
                <div style={{
                  fontFamily: BODY, fontSize: 12, fontWeight: 500,
                  color: "rgba(255,255,255,0.55)", marginTop: 4,
                }}>3-hour roundtable, not a full day</div>
              </div>
            </div>

            {/* Location strip with pin icon + valet parking */}
            <div style={{
              marginTop: 32, maxWidth: 560,
              display: "flex", alignItems: "flex-start", gap: 14,
              padding: "18px 20px",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 8,
              background: "rgba(255,255,255,0.02)",
            }}>
              {/* Map pin SVG */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 11.4 7.3 11.6a1 1 0 0 0 1.4 0C13 21.4 20 15.4 20 10a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill={YELLOW} />
              </svg>
              <div>
                <div style={{
                  fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: WHITE,
                  letterSpacing: "-0.005em",
                }}>Marriott, Palm Jumeirah · Dubai</div>
                <div style={{
                  fontFamily: BODY, fontSize: 12.5, fontWeight: 500,
                  color: "rgba(255,255,255,0.62)", marginTop: 4,
                }}>Valet parking available at the venue</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: form — Autodesk styled */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              background: WHITE, color: BLACK,
              borderRadius: 16,
              overflow: "hidden",
              maxWidth: 480,
              width: "100%",
              justifySelf: "end",
            }}
          >
            {/* Top yellow ticker — matches the speaker card top strip */}
            <span aria-hidden style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 4,
              background: YELLOW, zIndex: 3,
            }} />

            {/* Masthead bar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 12,
              padding: "16px 24px",
              borderBottom: `1px solid rgba(0,0,0,0.12)`,
              background: WHITE,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span aria-hidden style={{
                  width: 10, height: 10,
                  background: status === "success" ? BLACK : YELLOW,
                }} />
                <span style={{
                  fontFamily: BODY, fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.36em", textTransform: "uppercase",
                  color: BLACK,
                }}>{status === "success" ? "Submitted" : "Register Interest"}</span>
              </div>
              {status === "success" && (
                <span style={{
                  fontFamily: BODY, fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  color: SLATE, fontVariantNumeric: "tabular-nums",
                }}>Under Consideration</span>
              )}
            </div>

            {/* Form body OR success state */}
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  padding: "44px 24px 48px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  minHeight: 360,
                }}
              >
                {/* Yellow check badge */}
                <div style={{
                  position: "relative",
                  width: 64, height: 64,
                  background: YELLOW,
                  borderRadius: 4,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 24,
                  boxShadow: "0 18px 40px rgba(255,255,0,0.30)",
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7" stroke={BLACK} strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                </div>

                {/* Tracked confirmation kicker */}
                <div style={{
                  fontFamily: BODY, fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.36em", textTransform: "uppercase",
                  color: BLACK, marginBottom: 12,
                  display: "inline-flex", alignItems: "center", gap: 10,
                }}>
                  <span aria-hidden style={{ width: 18, height: 1, background: BLACK }} />
                  <span>Request Received</span>
                  <span aria-hidden style={{ width: 18, height: 1, background: BLACK }} />
                </div>

                {/* Headline */}
                <h3 style={{
                  fontFamily: DISPLAY, fontWeight: 800,
                  fontSize: "clamp(24px, 2.4vw, 32px)",
                  color: BLACK, margin: "0 0 12px",
                  letterSpacing: "-0.025em", lineHeight: 1.05,
                  maxWidth: 360,
                }}>
                  Thank you. Your seat is being reviewed.
                </h3>

                {/* Body copy */}
                <p style={{
                  fontFamily: BODY, fontSize: 14, fontWeight: 400,
                  color: "rgba(0,0,0,0.65)", margin: "0 0 28px",
                  lineHeight: 1.6, maxWidth: 360,
                }}>
                  Events First Group will be in touch shortly on behalf of Autodesk to confirm your invitation.
                </p>

                {/* Detail block */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  width: "100%",
                  maxWidth: 360,
                  paddingTop: 20,
                  borderTop: `1px solid rgba(0,0,0,0.12)`,
                }}>
                  <div>
                    <div style={{
                      fontFamily: BODY, fontSize: 9, fontWeight: 700,
                      letterSpacing: "0.32em", textTransform: "uppercase",
                      color: SLATE, marginBottom: 6,
                    }}>Date</div>
                    <div style={{
                      fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, color: BLACK,
                    }}>30 Jun 2026</div>
                  </div>
                  <div>
                    <div style={{
                      fontFamily: BODY, fontSize: 9, fontWeight: 700,
                      letterSpacing: "0.32em", textTransform: "uppercase",
                      color: SLATE, marginBottom: 6,
                    }}>Venue</div>
                    <div style={{
                      fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, color: BLACK,
                    }}>Marriott, Palm Jumeirah</div>
                  </div>
                </div>
              </motion.div>
            ) : (
            <div style={{ padding: "20px 24px 24px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px 16px",
              }}>
                <Field label="First Name" value={form.firstName} onChange={update("firstName")} required />
                <Field label="Last Name" value={form.lastName} onChange={update("lastName")} required />
                <Field label="Work Email" value={form.email} onChange={update("email")} type="email" required colSpan={2} />

                {/* Phone field with country code selector */}
                <label style={{ gridColumn: "1 / -1", display: "block" }}>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 6,
                    marginBottom: 6,
                    fontFamily: BODY, fontSize: 9, fontWeight: 700,
                    letterSpacing: "0.32em", textTransform: "uppercase",
                    color: "#000",
                  }}>
                    Phone
                    <span aria-hidden style={{
                      width: 4, height: 4, background: YELLOW, display: "inline-block",
                    }} />
                  </span>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(110px, 132px) 1fr",
                    gap: 12,
                    alignItems: "end",
                  }}>
                    <select
                      value={`${phoneCountry.code}-${phoneCountry.country}`}
                      onChange={(e) => {
                        const [code, country] = e.target.value.split("-");
                        const next = COUNTRY_CODES.find(
                          (c) => c.code === code && c.country === country
                        );
                        if (next) {
                          setPhoneCountry(next);
                          setForm((p) => ({ ...p, phone: p.phone.slice(0, next.length) }));
                        }
                      }}
                      aria-label="Phone country code"
                      style={{
                        width: "100%",
                        padding: "8px 0",
                        fontFamily: BODY, fontSize: 14, fontWeight: 600,
                        color: BLACK, background: "transparent",
                        border: "0",
                        borderBottom: `1.5px solid rgba(0,0,0,0.22)`,
                        borderRadius: 0,
                        outline: "none",
                        appearance: "none",
                        backgroundImage:
                          `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23000' stroke-width='1.6' fill='none' stroke-linecap='square'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 4px center",
                        paddingRight: 20,
                        cursor: "pointer",
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderBottomColor = BLACK; }}
                      onBlur={(e) => { e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.22)"; }}
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
                      value={form.phone}
                      onChange={(e) => {
                        const digitsOnly = e.target.value
                          .replace(/[^\d]/g, "")
                          .slice(0, phoneCountry.length);
                        setForm((p) => ({ ...p, phone: digitsOnly }));
                      }}
                      placeholder={phoneCountry.placeholder}
                      autoComplete="tel-national"
                      maxLength={phoneCountry.length}
                      required
                      style={{
                        width: "100%",
                        padding: "8px 0",
                        fontFamily: BODY, fontSize: 14, fontWeight: 600,
                        color: BLACK, background: "transparent",
                        border: "0",
                        borderBottom: `1.5px solid rgba(0,0,0,0.22)`,
                        borderRadius: 0,
                        outline: "none",
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderBottomColor = BLACK; }}
                      onBlur={(e) => { e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.22)"; }}
                    />
                  </div>
                  <div style={{
                    marginTop: 6,
                    fontFamily: BODY, fontSize: 10, fontWeight: 500,
                    color: SLATE, letterSpacing: "0.02em",
                  }}>
                    {phoneCountry.name} · {phoneCountry.length} digits
                  </div>
                </label>

                <Field label="Job Title" value={form.title} onChange={update("title")} required colSpan={2} />
                <Field label="Company" value={form.company} onChange={update("company")} required colSpan={2} />
              </div>

              {error && (
                <div role="alert" style={{
                  marginTop: 16, padding: "10px 14px",
                  background: "rgba(242,82,10,0.10)",
                  border: `1px solid rgba(242,82,10,0.50)`,
                  borderRadius: 4,
                  fontFamily: BODY, fontSize: 12, fontWeight: 500,
                  color: "#A2350A",
                }}>{error}</div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="ad-form-submit"
                style={{
                  marginTop: 24, width: "100%",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  gap: 12,
                  fontFamily: BODY, fontSize: 12, fontWeight: 700,
                  color: BLACK, background: YELLOW,
                  padding: "14px 20px",
                  borderRadius: 4,
                  border: "0", cursor: status === "submitting" ? "wait" : "pointer",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (status !== "submitting") {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 16px 36px rgba(255,255,0,0.35)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span>
                  {status === "submitting" ? "Submitting..." : "Register Interest"}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 5l7 7-7 7" stroke={BLACK} strokeWidth="2.6" strokeLinecap="square" strokeLinejoin="miter" />
                </svg>
              </button>

            </div>
            )}

            {/* Footer signature bar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 12,
              padding: "12px 24px",
              borderTop: `1px solid rgba(0,0,0,0.10)`,
              background: "rgba(0,0,0,0.03)",
            }}>
              <span style={{
                fontFamily: BODY, fontSize: 9.5, fontWeight: 700,
                letterSpacing: "0.30em", textTransform: "uppercase",
                color: SLATE,
              }}>By Invitation Only</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/events-first-group_logo_alt.svg"
                alt="Events First Group"
                style={{
                  height: 18, width: "auto",
                  filter: "brightness(0)",
                  opacity: 0.75,
                }}
              />
            </div>
          </motion.form>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          :global(.ad-reserve-grid) {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", required, colSpan = 1 }: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  colSpan?: 1 | 2;
}) {
  return (
    <label style={{
      gridColumn: colSpan === 2 ? "1 / -1" : undefined,
      display: "block",
      position: "relative",
    }}>
      <span style={{
        display: "flex", alignItems: "center", gap: 6,
        marginBottom: 6,
        fontFamily: BODY, fontSize: 9, fontWeight: 700,
        letterSpacing: "0.32em", textTransform: "uppercase",
        color: "#000",
      }}>
        {label}
        {required && (
          <span aria-hidden style={{
            width: 4, height: 4, background: YELLOW, display: "inline-block",
          }} />
        )}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        suppressHydrationWarning
        className="ad-form-input"
        style={{
          width: "100%",
          padding: "8px 0",
          fontFamily: BODY, fontSize: 14, fontWeight: 600,
          color: BLACK, background: "transparent",
          border: "0",
          borderBottom: `1.5px solid rgba(0,0,0,0.22)`,
          borderRadius: 0,
          outline: "none",
          transition: "border-color 0.2s ease",
        }}
        onFocus={(e) => { e.currentTarget.style.borderBottomColor = BLACK; }}
        onBlur={(e) => { e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.22)"; }}
      />
    </label>
  );
}

// =============================================================================
// FOOTER
// =============================================================================
function Footer() {
  return (
    <footer style={{
      background: BLACK, color: WHITE,
      padding: "48px 0 32px",
      borderTop: `1px solid ${HAIRLINE}`,
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "0 clamp(20px, 4vw, 48px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 32, flexWrap: "wrap",
      }}>
        <div className="ad-footer-marks" style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <AutodeskMark tone="white" height={32} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: BODY, fontSize: 10, fontWeight: 700,
              letterSpacing: "0.32em", textTransform: "uppercase",
              color: SLATE,
            }}>Hosted by</div>
          </div>
          <a
            href="https://www.eventsfirstgroup.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Events First Group"
            style={{ display: "inline-flex" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/events-first-group_logo_alt.svg"
              alt="Events First Group"
              style={{ height: 36, width: "auto", display: "block" }}
            />
          </a>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          :global(.ad-footer-marks) {
            gap: 20px !important;
          }
        }
      `}</style>
    </footer>
  );
}

// =============================================================================
// PAGE
// =============================================================================
export default function AutodeskPage() {
  // Honor a #hash on arrival (e.g. from a /s/ad-mary short link → #reserve).
  // Framer-motion content mounts after the browser's native hash jump fires,
  // so scroll explicitly once the target exists, retrying briefly if needed.
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    let tries = 0;
    const tick = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (tries++ < 20) setTimeout(tick, 150);
    };
    const t = setTimeout(tick, 450);
    return () => clearTimeout(t);
  }, []);

  return (
    <main style={{ fontFamily: BODY, background: BLACK, color: WHITE, minHeight: "100vh" }}>
      <TopBar />
      <Hero />
      <OverviewSection />
      <TakeawaysSection />
      <SpeakersSection />
      <AgendaSection />
      <AboutSection />
      <ReserveSection />
      <Footer />
    </main>
  );
}
